// ==UserScript==
// @name         链接点击打开
// @version      1.6
// @namespace   https://greasyfork.org/users/1171320
// @description  将页面中所有链接修改成可单击跳转（蓝色字体，无下划线）。
// @match        *://*/*
// @exclude      *://*.cloudflare.com/*
// @exclude      *://*.recaptcha.net/*
// @run-at       document-end
// @grant        none
// @author         yzcjd
// @author2       ChatGPT4 辅助
// @license MIT
// @icon data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDE2IDE2Ij4gPHBhdGggZmlsbD0iIzRjNGM0ZCIgZD0iTTMuNSAxYS41LjUgMCAxIDAgMCAxSDR2OWgtLjVhLjUuNSAwIDAgMCAwIDFoNy44NTVhLjUuNSAwIDAgMCAuNDc1LS4xODQuNS41IDAgMCAwIC4xMDYtLjM5OFYxMC41YS41LjUgMCAxIDAtMSAwdi41SDZWMmguNWEuNS41IDAgMSAwIDAtMWgtM3oiLz4gPHBhdGggZmlsbD0iIzQ1YTFmZiIgZD0iTTIuNSAxNGExIDEgMCAxIDAgMCAyaDExYTEgMSAwIDEgMCAwLTJoLTExeiIvPiA8L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/532063/%E9%93%BE%E6%8E%A5%E7%82%B9%E5%87%BB%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/532063/%E9%93%BE%E6%8E%A5%E7%82%B9%E5%87%BB%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  'use strict';
 
 

  // 删除参数可能出错。
  // 添加后：链接+中文，只跳转链接；
  // 注释掉：链接+中文会整体跳转，x.com 能正常访问。
  // 精确匹配常见网址和路径，排除结尾异常字符
  // const urlRegex = /\b(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[\w\-./?%&=#]*)?/gi;

  const cleanUrl = (raw) => {
    return raw.replace(/[`"'，。,！？！）））)、））\]\[]+$/, ''); // 清除结尾非链接字符
  };
 
  const convertText = (node) => {
    if (node.nodeType !== 3 || !node.textContent.trim()) return;
    const text = node.textContent;
    const parent = node.parentNode;
    if (!parent || ['a', 'script', 'style', 'textarea'].includes(parent.tagName?.toLowerCase())) return;
    if (!urlRegex.test(text)) return;
 
    const span = document.createElement('span');
    span.innerHTML = text.replace(urlRegex, (match) => {
      const clean = cleanUrl(match);
      const href = /^https?:\/\//i.test(clean) ? clean : 'https://' + clean;
      return `<a href="${href}" target="_blank" style="color:blue;text-decoration:none">${clean}</a>`;
    });
 
    parent.replaceChild(span, node);
  };
 
  const walk = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) convertText(node);
  };
 
  const observer = new MutationObserver((muts) => {
    muts.forEach(m => m.addedNodes.forEach(n => walk(n)));
  });
 
  walk(document.body);
  observer.observe(document.body, { childList: true, subtree: true });
})();
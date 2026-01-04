// ==UserScript==
// @name         【日本 IPA IT 认证考试真题网站，解除复制和右键限制】【日本のIPA IT認定試験の実際の問題サイト、コピーと右クリックの制限を解除します。】
// @version      0.1.1
// @author       trunk
// @match        *://*/*
// @grant        none
// @description  日本 IPA IT 认证考试真题网站，解除复制和右键限制
// @license MIT
// @namespace https://greasyfork.org/users/904276
// @downloadURL https://update.greasyfork.org/scripts/534740/%E3%80%90%E6%97%A5%E6%9C%AC%20IPA%20IT%20%E8%AE%A4%E8%AF%81%E8%80%83%E8%AF%95%E7%9C%9F%E9%A2%98%E7%BD%91%E7%AB%99%EF%BC%8C%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6%E3%80%91%E3%80%90%E6%97%A5%E6%9C%AC%E3%81%AEIPA%20IT%E8%AA%8D%E5%AE%9A%E8%A9%A6%E9%A8%93%E3%81%AE%E5%AE%9F%E9%9A%9B%E3%81%AE%E5%95%8F%E9%A1%8C%E3%82%B5%E3%82%A4%E3%83%88%E3%80%81%E3%82%B3%E3%83%94%E3%83%BC%E3%81%A8%E5%8F%B3%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%AE%E5%88%B6%E9%99%90%E3%82%92%E8%A7%A3%E9%99%A4%E3%81%97%E3%81%BE%E3%81%99%E3%80%82%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/534740/%E3%80%90%E6%97%A5%E6%9C%AC%20IPA%20IT%20%E8%AE%A4%E8%AF%81%E8%80%83%E8%AF%95%E7%9C%9F%E9%A2%98%E7%BD%91%E7%AB%99%EF%BC%8C%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6%E3%80%91%E3%80%90%E6%97%A5%E6%9C%AC%E3%81%AEIPA%20IT%E8%AA%8D%E5%AE%9A%E8%A9%A6%E9%A8%93%E3%81%AE%E5%AE%9F%E9%9A%9B%E3%81%AE%E5%95%8F%E9%A1%8C%E3%82%B5%E3%82%A4%E3%83%88%E3%80%81%E3%82%B3%E3%83%94%E3%83%BC%E3%81%A8%E5%8F%B3%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%AE%E5%88%B6%E9%99%90%E3%82%92%E8%A7%A3%E9%99%A4%E3%81%97%E3%81%BE%E3%81%99%E3%80%82%E3%80%91.meta.js
// ==/UserScript==

function enableCopyAndRightClick() {
  
  // 还原默认的右键菜单行为
  document.oncontextmenu = null;
  document.body.oncontextmenu = null;
  window.oncontextmenu = null;
  
  // 移除右键和选择禁用
  ['contextmenu', 'selectstart', 'copy', 'cut', 'paste', 'mousedown'].forEach(evt => {
    document.addEventListener(evt, e => {
      e.stopPropagation();
      // 不阻止默认行为，确保右键和复制可用
    }, true);
  });
  
}

function restoreDefaultUserSelect(selector) {
  const element = document.querySelector(selector);
  // 确保传入的是一个 DOM 元素
  if (element && element.style) {
    // 恢复为默认的 user-select 样式
    element.style.setProperty('user-select', 'auto');
  }
}

(function() {
  'use strict';
  
  // 只匹配 www.xxx-siken.com 的域名
  const pattern = /^www\.[a-zA-Z0-9_-]+-siken\.com$/;
  const hostname = window.location.hostname;
  
  // 如果域名匹配则启用复制和右键
  if (pattern.test(hostname)) {
    console.log('开启复制和鼠标右键');
    enableCopyAndRightClick();
    restoreDefaultUserSelect('html');
    restoreDefaultUserSelect('body');
  }
})();

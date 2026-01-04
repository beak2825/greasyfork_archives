// ==UserScript==
// @name         隐藏知乎
// @namespace    
// @version      0.4
// @description  隐藏知乎header
// @author       linyi
// @match        *://www.zhihu.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532973/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/532973/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function () {
  const head = document.querySelector('head');
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerText = `
    .AppHeader,
    .css-1qyytj7,
    .RichContent-cover,
    .WriteArea,
    img {
      display: none !important;
    }
  `;
  head.appendChild(style);

  var link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = 'https://example.com/myicon.ico';

  const target = document.querySelector('title');
  const observer = new MutationObserver(() => {
    if (document.title !== 'Gemini') {
      document.title = 'Gemini';
    }
  });

  observer.observe(target, { childList: true });
  document.title = 'Gemini';
})();


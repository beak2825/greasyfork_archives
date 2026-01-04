// ==UserScript==
// @name         嗶哩輕小說 刪除空行
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動刪除所有空行，讓閱讀更緊湊！
// @author       shanlan(ChatGPT o3-mini)
// @match        https://tw.linovelib.com/novel/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543445/%E5%97%B6%E5%93%A9%E8%BC%95%E5%B0%8F%E8%AA%AA%20%E5%88%AA%E9%99%A4%E7%A9%BA%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/543445/%E5%97%B6%E5%93%A9%E8%BC%95%E5%B0%8F%E8%AA%AA%20%E5%88%AA%E9%99%A4%E7%A9%BA%E8%A1%8C.meta.js
// ==/UserScript==

(function(){
  'use strict';
  const c = document.querySelector('#acontent');
  if (!c) return;
  Array.from(c.childNodes).forEach(n => {
    if ((n.nodeType === Node.ELEMENT_NODE && n.tagName === 'BR') ||
        (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()))
      n.remove();
  });
  c.querySelectorAll('p').forEach(p => {
    const ns = p.childNodes;
    if (ns.length === 1 && ns[0].nodeType === Node.ELEMENT_NODE && ns[0].tagName === 'BR')
      p.remove();
    else if (ns.length === 2 &&
             ((ns[0].nodeType === Node.TEXT_NODE && !ns[0].textContent.trim() &&
               ns[1].nodeType === Node.ELEMENT_NODE && ns[1].tagName === 'BR') ||
              (ns[1].nodeType === Node.TEXT_NODE && !ns[1].textContent.trim() &&
               ns[0].nodeType === Node.ELEMENT_NODE && ns[0].tagName === 'BR')))
      p.remove();
  });
})();
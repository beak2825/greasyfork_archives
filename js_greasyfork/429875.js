// ==UserScript==
// @name         知乎链接直接跳转
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  知乎链接直接跳转,无需确认窗口
// @author       Tomiaa
// @match        *://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @downloadURL https://update.greasyfork.org/scripts/429875/%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429875/%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
;(() => {
  let timer = null;
  let length = 0;
  new MutationObserver(() => {
    clearTimeout(timer);
      timer = setTimeout(() => {
        let a = document.querySelectorAll('a[href*="link.zhihu"]')
        if(a.length == length) return;
        length = a.length;
        Array.from(a).forEach(item => {
          item.href = decodeURIComponent(item.href.replace(/\w+:\/\/link\.zhihu\.com\/\?target=/,''))
        })
      }, 700);
  }).observe(document.body,{childList:true,subtree: true});
})();
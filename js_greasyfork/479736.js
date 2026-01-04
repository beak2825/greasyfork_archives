// ==UserScript==
// @name         好看视频新窗口打开
// @version      0.1.2
// @description  增加一个按钮用于在新窗口打开推荐视频
// @author       Ryan
// @match        https://haokan.baidu.com/*
// @license      GPL-3.0-only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haokan.baidu.com
// @grant        GM_openInTab
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/16759
// @downloadURL https://update.greasyfork.org/scripts/479736/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/479736/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    const 在后台打开 = false;
    GM_addStyle(`
[class*="guessLike_guess-item"],.guess-item, .land-recommend-item {
  position: relative;
}
:is([class*="guessLike_guess-item"],.guess-item,.land-recommend-item) .haokan-open-in-tab {
  right: 22px;
  top: 8px;
  position: absolute;
  transition: all .3s;
  padding: 4px 8px;
  opacity: 0;
  z-index: 999;
}
.land-recommend-item .haokan-open-in-tab {
  right: unset;
  left: 12px;
}
:is([class*="guessLike_guess-item"],.guess-item, .land-recommend-item):hover .haokan-open-in-tab {
  opacity: 1;
}
    `);
    document.addEventListener("mouseover", function({ target: el }) {
        let a = el.closest('[class*="guess-item-link"][target="_self"], .land-recommend-item-link');
        if (a) {
            addBtnAfterEl(a);
        }
    });
    function addBtnAfterEl(el) {
        if (el.nextElementSibling) return;
        let btn = document.createElement('button');
        btn.className = "haokan-open-in-tab";
        btn.innerHTML = '打开';
        btn.addEventListener('click', handleClick);
        el.after(btn);
    }
    function handleClick(e) {
        let li = e.target.closest('li[vid]');
        if (li) {
            GM_openInTab('https://haokan.baidu.com/v?vid=' + li.getAttribute('vid'), 在后台打开);
        }
    }
})();
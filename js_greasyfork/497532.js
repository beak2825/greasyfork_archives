// ==UserScript==
// @name          Ctrl点击滚动
// @description   连续点击加速.单击停止
// @version       1.1
// @match         *://*/*
// @namespace https://greasyfork.org/users/12375
// @downloadURL https://update.greasyfork.org/scripts/497532/Ctrl%E7%82%B9%E5%87%BB%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/497532/Ctrl%E7%82%B9%E5%87%BB%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

let scrolling = false;
    document.body.onclick = e => {
        if (scrolling = e.ctrlKey || e.metaKey) {
            e.preventDefault();
            (function fn() {
                scrolling && (window.scrollBy(0,5), requestAnimationFrame(fn));
            })();
        }
    };


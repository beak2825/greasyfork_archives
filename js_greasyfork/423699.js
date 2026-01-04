// ==UserScript==
// @name                One Click copy image address
// @name:zh-CN          一键复制图片地址
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.1.0
// @description         Hold down Ctrl and Click the left mouse button to copy image address
// @description:zh-CN   按住 Ctrl 并点击鼠标左键复制图片地址
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://*/*
// @grant               GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/423699/One%20Click%20copy%20image%20address.user.js
// @updateURL https://update.greasyfork.org/scripts/423699/One%20Click%20copy%20image%20address.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function display_Tips() {
        let tips_div = document.getElementById('copy-success-alert-tips');
        if (! tips_div) {
            tips_div = document.createElement('div');
            tips_div.id = 'copy-success-alert-tips';
            tips_div.setAttribute('style', 'position: fixed; z-index: 10000; top: 50%; left: 50%; align-items: center; justify-content: center; color: #378239; background-color: #dff08d; border: 1px solid #d6e9c6; border-radius: 5px; padding: 5px 10px; display: none;');
            tips_div.textContent = window.navigator.language.includes('zh') ? '复制成功' : 'copy success';
            document.body.appendChild(tips_div);
        }
        tips_div.style.display = 'block';
        timer && window.clearTimeout(timer);
        var timer = window.setTimeout(() => {
            tips_div.style.display = 'none';
        }, 1000);
    }
    function init() {
        document.querySelectorAll('img').forEach(item => {
            item.addEventListener('click', e => {
                if (e.ctrlKey && ! e.altKey && ! e.shiftKey) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    e.stopPropagation();
                    GM_setClipboard(item.src, 'text');
                    display_Tips();
                    return false;
                }
            });
        });
    }
    init();
})();

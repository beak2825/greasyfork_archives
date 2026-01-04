// ==UserScript==
// @name         EditAuthName
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  编辑权限
// @author       You
// @match        https://*.tyaow.com/admin*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465036/EditAuthName.user.js
// @updateURL https://update.greasyfork.org/scripts/465036/EditAuthName.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function editable() {
        const list = document.querySelectorAll('.dialog-scroll-view-wrap input[disabled]');
        for (let i = 0; i < list.length; i++) {
            const inputEl = list[i];
            // 删除disabled属性
            inputEl.removeAttribute('disabled');
            const parentEl = inputEl.parentNode;
            // 删除 is-disabled 类名
            parentEl.classList.remove('is-disabled');
        }
    }

    const btn = document.createElement('button');
    btn.innerText = '启动编辑';
    // fixed 放在右上角
    btn.style.position = 'fixed';
    btn.style.top = '0';
    btn.style.right = '0';
    btn.style.zIndex = 9999;
    btn.addEventListener('click', editable);
    document.body.appendChild(btn);
})();
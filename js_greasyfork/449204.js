// ==UserScript==
// @name         Workona
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  消除 Workona 弹框
// @author       wenmin92
// @match        https://workona.com/0/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workona.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/449204/Workona.user.js
// @updateURL https://update.greasyfork.org/scripts/449204/Workona.meta.js
// ==/UserScript==


(function () {
    'use strict';

    console.log('Tampermonkey', '='.repeat(120));
    console.log('Amazon图书文件名');
    console.log('Tampermonkey', '='.repeat(120));

    function update() {
        console.log('update ws-restore-remind-me');
        localStorage.setItem('ws-restore-remind-me', Date.now());
    }

    function autoClick() {
        if (document.querySelector('#modal-frame')) {
            document.querySelector('#modal-frame button.style-module--btnReveal--1KndE').click();
        }
    }

    function init() {
        update(); // 首次加载时更新
        document.querySelectorAll('[class*=style-module--sparkle--]').forEach(it => { it.style.display = 'none' }); // 移除左侧列表中的星星

        document.querySelector('[class^=style-module--scroll--]').addEventListener('click', update) // 每次点击时更新
        setInterval(update, 1000 * 60 * 60); // 每小时更新一次
        autoClick(); // 如果出现modal, 自动点掉

        console.log('Workona 弹框消除完毕');
    }

    let readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete" && document.querySelector('[class^=style-module--scroll--]') && document.querySelectorAll('[class*=style-module--sparkle--]')) {
            clearInterval(readyStateCheckInterval);
            init();
        }
    }, 20);
})();
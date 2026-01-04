// ==UserScript==
// @name         Novel Navigation Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用键盘左右箭头切换章节，回车/空格跳转目录
// @author       Transwarpcom
// @match        *://cn.wa01.com/novel/pagea/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525598/Novel%20Navigation%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/525598/Novel%20Navigation%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // 处理章节切换
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            const url = window.location.href;
            const chapterReg = /_(\d+)\.html$/;
            const match = url.match(chapterReg);

            if (match) {
                let chapter = parseInt(match[1], 10);
                chapter += event.key === 'ArrowLeft' ? -1 : 1;

                const newUrl = url.replace(chapterReg, `_${chapter}.html`);
                window.location.href = newUrl;
                event.preventDefault();
            }
        }

        // 处理目录跳转
        if (event.key === 'Enter' || event.key === ' ') {
            const path = window.location.pathname;
            const novelReg = /\/pagea\/(.+?)_\d+\.html$/;
            const match = path.match(novelReg);

            if (match) {
                const novelId = match[1];
                window.location.href = `https://cn.ttkan.co/novel/chapters/${novelId}`;
                event.preventDefault();
            }
        }
    });
})();
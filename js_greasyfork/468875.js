// ==UserScript==
// @name         Note-width
// @namespace    http://rachpt.cn/
// @version      0.0.1
// @description  MDPI note 按钮宽度
// @author       rachpt
// @license      MIT
// @match        https://susy.mdpi.com/user/assigned/process_form/*
// @icon         https://icons.duckduckgo.com/ip2/mdpi.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468875/Note-width.user.js
// @updateURL https://update.greasyfork.org/scripts/468875/Note-width.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function () {
        window.addEventListener("load",() => {
            const noteNodeStyle = document.querySelector('.note-offcanvas-operation')?.style;
            if (noteNodeStyle) {
                noteNodeStyle.width = '34px';
                noteNodeStyle.height = '98px';
                noteNodeStyle.right = '20px';
            }
        });
    })()
})();
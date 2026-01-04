// ==UserScript==
// @name         图寻快捷键发表情
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  图寻快捷键发表情E打开表情,ESC关闭表情界面,1GG,2滑稽,3惊讶,4你好
// @author       lemures
// @match        https://tuxun.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484093/%E5%9B%BE%E5%AF%BB%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8F%91%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/484093/%E5%9B%BE%E5%AF%BB%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8F%91%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'e':
            case 'E':
                var buttonE = document.querySelector('button.el-button:nth-child(4)');
                if (buttonE) buttonE.click();
                break;

            case 'Escape':
                var buttonEsc = document.querySelector('.el-button--cancel');
                if (buttonEsc) buttonEsc.click();
                break;

            case '4':
                var emoji4 = document.querySelector('div.emoji:nth-child(23)');
                if (emoji4) emoji4.click();
                break;

            case '1':
                var emoji1 = document.querySelector('div.emoji:nth-child(24)');
                if (emoji1) emoji1.click();
                break;

            case '2':
                var emoji2 = document.querySelector('div.emoji:nth-child(5)');
                if (emoji2) emoji2.click();
                break;

            case '3':
                var emoji3 = document.querySelector('div.emoji:nth-child(3)');
                if (emoji3) emoji3.click();
                break;
        }
    });
})();

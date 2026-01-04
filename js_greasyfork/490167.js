// ==UserScript==
// @name         番剧页面切换视频比例
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在番剧页面时，可以用“L键”切换视频比例。（看柯南看的）
// @author       40FoUR
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490167/%E7%95%AA%E5%89%A7%E9%A1%B5%E9%9D%A2%E5%88%87%E6%8D%A2%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490167/%E7%95%AA%E5%89%A7%E9%A1%B5%E9%9D%A2%E5%88%87%E6%8D%A2%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 找到元素
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // 设置视频比例
    function setAspectRatio(ratio) {
        waitForElement('.squirtle-single-setting-chooses.squirtle-aspect-ratio', (element) => {
            const choices = element.querySelectorAll('.squirtle-single-setting-choice.squirtle-aspect-ratio-choice');
            choices.forEach((choice) => {
                if (choice.getAttribute('data-value') === ratio) {
                    choice.click();
                }
            });
        });
    }

    // 监听键盘
    document.addEventListener('keydown', function(event) {
        if (event.key === 'l' || event.key === 'L') {
            waitForElement('.squirtle-single-setting-choice.squirtle-aspect-ratio-choice.active', (activeChoice) => {
                const currentRatio = activeChoice.getAttribute('data-value');
                switch (currentRatio) {
                    case '0:0':
                        setAspectRatio('4:3');
                        break;
                    case '4:3':
                        setAspectRatio('16:9');
                        break;
                    case '16:9':
                        setAspectRatio('0:0');
                        break;
                    default:
                        setAspectRatio('0:0');
                        break;
                }
            });
        }
    });
})();

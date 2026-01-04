// ==UserScript==
// @name         B站奖励
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  领B站奖励
// @author       线性代数
// @match        https://www.bilibili.com/blackboard/*
// @grant        none
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/491185/B%E7%AB%99%E5%A5%96%E5%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/491185/B%E7%AB%99%E5%A5%96%E5%8A%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isClicking = false;
    let clickInterval;
    function performActionsOnSite1() {
        const button = document.createElement('button');
        button.textContent = '开始';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.left = '0';
        button.style.transform = 'translateY(-50%)';
        button.style.zIndex = '10000';
        button.style.backgroundColor = 'green';
        button.style.fontSize = '15px';
        button.style.padding = '8px 15px';
        document.body.appendChild(button);

        button.onclick = function() {
            if (!isClicking) {
                isClicking = true;
                button.textContent = '停止';
                const button1 = document.querySelector("#app > div > div.home-wrap.select-disable > section.tool-wrap > div");
                clickInterval = setInterval(function() {
                    button1.click();
                }, 600);
            } else {
                isClicking = false;
                button.textContent = '开始';
                clearInterval(clickInterval);
            }
        };
    }

    performActionsOnSite1();
})();
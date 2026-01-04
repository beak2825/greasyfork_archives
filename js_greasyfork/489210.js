// ==UserScript==
// @name         百家号AI优化助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  优化掉百家号首页遮挡收益的AI助手页面
// @author       @诸葛
// @license      MIT
// @match        https://baijiahao.baidu.com/*
// @match        https://baijiahao.baidu.com/builder/rc/home
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489210/%E7%99%BE%E5%AE%B6%E5%8F%B7AI%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/489210/%E7%99%BE%E5%AE%B6%E5%8F%B7AI%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAICopilot() {
        const element = document.getElementById("AICopilot");
        if (element) {
            element.style.display = "none";
        }
    }

    function modifyMarginRight() {
        const targetElement = document.querySelector('.cheetah-row.cheetah-public.css-11lc5sr');
        if (targetElement) {
            targetElement.style.marginRight = '-500px';
        }
    }

    hideAICopilot();
    modifyMarginRight();

    const intervalID = setInterval(() => {
        hideAICopilot();
        modifyMarginRight();
    }, 1000);

    setTimeout(() => {
        clearInterval(intervalID);
    }, 10000);

})();
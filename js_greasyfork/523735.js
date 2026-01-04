// ==UserScript==
// @name         豆包宽屏气泡美化
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  此脚本由豆包辅助编写
// @author       gu5ang
// @match        https://www.doubao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doubao.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523735/%E8%B1%86%E5%8C%85%E5%AE%BD%E5%B1%8F%E6%B0%94%E6%B3%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/523735/%E8%B1%86%E5%8C%85%E5%AE%BD%E5%B1%8F%E6%B0%94%E6%B3%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const setElementStyles = (elements, styleObject) => {
        elements.forEach(element => {
            for (let [key, value] of Object.entries(styleObject)) {
                element.style[key] = value;
            }
        });
    };

    const modifyStyles = () => {
        const containers = document.querySelectorAll('.container-rBgb6B');
        containers.forEach(container => {
            container.style.setProperty('--center-content-max-width', '1700px');
        });

        const left = document.querySelectorAll('.container-ZYIsnH');
        const right = document.querySelectorAll('.send-message-box-content-LueYkN');
        const bg = document.querySelectorAll('.inter-imkyCb');
        setElementStyles(left, {width: '1300px'});
        setElementStyles(right, {width: '800px', maxWidth: '800px', 'background-color': 'lightyellow'});
        // setElementStyles(bg, {'background-color': '#d4d5d7'});
    };

    const observerCallback = (mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                modifyStyles();
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    const config = {childList: true, subtree: true};

    window.addEventListener('load', () => {
        modifyStyles();
        observer.observe(document.body, config);
    });
})();

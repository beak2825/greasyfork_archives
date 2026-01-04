// ==UserScript==
// @name         古镇天的B站工具包
// @namespace    http://bilibili.gugle.dev/
// @version      0.0.2
// @description  一些实用功能
// @license      LGPL3.0
// @author       古镇天Gugle
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493486/%E5%8F%A4%E9%95%87%E5%A4%A9%E7%9A%84B%E7%AB%99%E5%B7%A5%E5%85%B7%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/493486/%E5%8F%A4%E9%95%87%E5%A4%A9%E7%9A%84B%E7%AB%99%E5%B7%A5%E5%85%B7%E5%8C%85.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    const config = {attributes: true, childList: true, subtree: true};
    let observer;
    const elementIds = []
    const elementClasses = []
    const callback = function (mutationsList, observer) {
        observer.disconnect();
        console.log("callback");
        for (let elementId of elementIds) {
            const element = document.getElementById(elementId);
            if (!element || !element.parentNode) continue;
            element.parentNode.removeChild(element);
        }
        for (let elementClass of elementClasses) {
            const elements = document.getElementsByClassName(elementClass);
            if (!elements) continue;
            for (let element of elements) {
                if (!element || !element.parentNode) continue;
                element.parentNode.removeChild(element);
            }
        }
        observer = new MutationObserver(callback);
        observer.observe(document, config);
    };
    observer = new MutationObserver(callback);
    observer.observe(document, config);

    function removeElementById(id) {
        elementIds.push(id);
        console.log("removeElementById");
    }

    function removeElementByClass(id) {
        elementClasses.push(id);
        console.log("removeElementByClass");
    }

    removeElementById("web-player-module-area-mask-panel");
    removeElementByClass("web-player-icon-roomStatus");
})();
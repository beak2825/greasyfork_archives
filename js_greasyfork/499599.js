// ==UserScript==
// @name         Remove Blur Class Fixed
// @namespace    http://tampermonkey.net/
// @version      2024.10.3
// @description  移除包含 'blur-' 前缀的类名，针对 Nexus Mods 网站
// @author       You
// @match        https://www.nexusmods.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499599/Remove%20Blur%20Class%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/499599/Remove%20Blur%20Class%20Fixed.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 移除元素中所有以 'blur-' 开头的类，若是 BUTTON 则移除元素
    function cleanElement(element) {
        if (element.tagName === "BUTTON") {
            element.remove();
            return;
        }
        const classesToRemove = [...element.classList].filter(cls => cls.startsWith("blur-"));
        classesToRemove.forEach(cls => element.classList.remove(cls));
    }

    // 处理现有元素
    function processElements() {
        document.querySelectorAll("[class*='blur-']").forEach(cleanElement);
    }

    // 设置 MutationObserver 以监测 DOM 变化和类名变化
    function setupObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            cleanElement(node);
                            node.querySelectorAll("[class*='blur-']").forEach(cleanElement);
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('blur-') || [...target.classList].some(cls => cls.startsWith('blur-'))) {
                        cleanElement(target);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // 初始化
    function init() {
        processElements();
        setupObserver();
    }

    // 等待 DOM 完全加载后初始化
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

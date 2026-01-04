// ==UserScript==
// @name         禁用CSDN动态背景
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  禁用CSDN动态背景，防止CPU占用过高
// @author       离尘zh、ChatGPT
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473127/%E7%A6%81%E7%94%A8CSDN%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/473127/%E7%A6%81%E7%94%A8CSDN%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var hasAnimatedBackground = false;
    try {
        var element = document.querySelector('body');
        var styles = window.getComputedStyle(element);
        if (styles.backgroundImage.indexOf(".gif") !== -1) {
            hasAnimatedBackground = true;
        }
    } catch (e) {}

    if (hasAnimatedBackground) {
        var style = document.createElement('style');
        style.innerHTML = `
        * {
            animation: none !important;
            transition: none !important;
        }
        body {
            background-image: none !important;
        }
        `;
        document.head.appendChild(style);

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var addedNodes = mutation.addedNodes;
                addedNodes.forEach(function (node) {
                    if (node.nodeType !== Node.ELEMENT_NODE) {
                        return;
                    }

                    var nodeStyle = node.getAttribute("style");
                    if (nodeStyle != null) {
                        if (nodeStyle.includes("animation")) {
                            node.style.animation = "none";
                        }
                        if (nodeStyle.includes("transition")) {
                            node.style.transition = "none";
                        }
                    }

                    var bgStyle = node.style.backgroundImage;
                    if (bgStyle.indexOf(".gif") !== -1) {
                        node.style.backgroundImage = "none";
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

})();
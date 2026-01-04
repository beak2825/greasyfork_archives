// ==UserScript==
// @name         Apple 苹果产品参数中心
// @namespace    http://tampermonkey.net/
// @version      2024-10-11 1.0
// @description  Apple 苹果产品参数中心 去水印
// @author       moyupoi
// @match        https://hubweb.cn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hubweb.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512192/Apple%20%E8%8B%B9%E6%9E%9C%E4%BA%A7%E5%93%81%E5%8F%82%E6%95%B0%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/512192/Apple%20%E8%8B%B9%E6%9E%9C%E4%BA%A7%E5%93%81%E5%8F%82%E6%95%B0%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateMainLayoutBefore(frameDocument) {
        try {
            const mainLayouts = frameDocument.querySelectorAll('body#mainLayout');
            const stylesheet = frameDocument.styleSheets.length > 0 ? frameDocument.styleSheets[0] : null;

            if (!stylesheet) {
                console.error('No stylesheet found in the frame.');
                return;
            }

            mainLayouts.forEach((body, index) => {
                const rule = `body#mainLayout:nth-of-type(${index + 1})::before { display: none; }`;
                stylesheet.insertRule(rule, stylesheet.cssRules.length);
            });
        } catch (error) {
            console.error('Error updating styles:', error);
        }
    }

    function addClickListener() {
        document.addEventListener('click', () => {
            updateMainLayoutBefore(document);
        });

        document.querySelectorAll('frame').forEach((frame) => {
            frame.addEventListener('load', () => {
                const frameDocument = frame.contentDocument || frame.contentWindow.document;
                updateMainLayoutBefore(frameDocument);

                frameDocument.addEventListener('click', () => {
                    updateMainLayoutBefore(frameDocument);
                });
            });
        });
    }

    window.addEventListener('load', () => {
        addClickListener();
    });

})();

// ==UserScript==
// @name         Google AI Overview Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрывает ИИ-обзоры (AI Overview) в результатах поиска Google
// @author       UXImprover
// @match        https://www.google.com/*
// @grant        none
// @icon         https://i.ibb.co/jPTdQPvj/istockphoto-1468514478-612x612-1.jpg
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540601/Google%20AI%20Overview%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/540601/Google%20AI%20Overview%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hideAIO = () => {
        const aiBlocks = document.querySelectorAll('div[jscontroller="EYwa3d"]');
        aiBlocks.forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        });

        const extraEl = document.querySelector('#Odp5De > div:nth-child(1) > div');
        if (extraEl) {
            extraEl.style.display = 'none';
            extraEl.style.visibility = 'hidden';
        }

        const extraEl2 = document.querySelector('#m-x-content > div');
        if (extraEl2) {
            extraEl2.style.display = 'none';
            extraEl2.style.visibility = 'hidden';
        }
    };

    hideAIO();

    const observer = new MutationObserver(hideAIO);
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ==UserScript==
// @name         mamontu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  mamontu1
// @author       You
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520733/mamontu.user.js
// @updateURL https://update.greasyfork.org/scripts/520733/mamontu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeCanvasElement = () => {
        const canvasElement = document.querySelector('canvas[style*="position: fixed"][style*="width: 100%"][style*="height: 100%"][style*="opacity: 0.1"]');
        if (canvasElement) {
            canvasElement.remove();
            console.log('Canvas element removed.');
        }
    };


    const observer = new MutationObserver(() => {
        removeCanvasElement();
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });


    removeCanvasElement();
})();



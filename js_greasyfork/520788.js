// ==UserScript==
// @name         Remove Snow Effect
// @namespace    http://tampermonkey.net/
// @version      2
// @description  mamonti
// @author       mamonti
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @grant        mamonti
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520788/Remove%20Snow%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/520788/Remove%20Snow%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSnowElement() {
        const snowElement = document.querySelector('div[style*="position: absolute; inset: 0px;"]');
        if (snowElement) {
            snowElement.remove();
        }
    }

    const observer = new MutationObserver(removeSnowElement);
    observer.observe(document.body, { childList: true, subtree: true });

    removeSnowElement();
})();
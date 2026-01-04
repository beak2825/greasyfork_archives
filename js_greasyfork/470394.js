// ==UserScript==
// @name         SkipWarn
// @namespace    Wen
// @version      1.0
// @description  Автоматический переход
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470394/SkipWarn.user.js
// @updateURL https://update.greasyfork.org/scripts/470394/SkipWarn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const urlParams = new URLSearchParams(window.location.search);
    const link = urlParams.get('link');

    if (link) {
        const a = document.createElement('a');
        a.href = link;
        a.rel = 'nofollow';
        a.className = 'button primary';
        a.innerHTML = 'Перейти на название';
        document.body.appendChild(a);
        a.click();
    }
})();
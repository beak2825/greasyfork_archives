// ==UserScript==
// @name         Remove All User SVGS Lolz
// @namespace    Remove All User SVGS
// @version      0.3
// @description  In Title
// @author       el9in
// @license      el9in
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @match        https://lzt.guru/threads/*
// @match        https://lolz.live/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469974/Remove%20All%20User%20SVGS%20Lolz.user.js
// @updateURL https://update.greasyfork.org/scripts/469974/Remove%20All%20User%20SVGS%20Lolz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        const SVGS = document.querySelectorAll(".avatarUserBadges");
        if(SVGS.length) for(let SVG of SVGS) SVG.remove();
        const SVGSAA = document.querySelectorAll(".avatarUserааBadges");
        if(SVGSAA.length) for(let SVG of SVGSAA) SVG.remove();
    }
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                setTimeout(function() {
                    init();
                },1000);
            }
        }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    init();
})();
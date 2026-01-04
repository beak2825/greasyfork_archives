// ==UserScript==
// @name         Remove Paintings
// @namespace    http://tampermonkey.net/
// @version      2024-11-17
// @description  Profiler declutter-er dedicated to removing Paintings/NFT's from any profile.
// @author       Realwdpcker
// @match        pixelplace.io/*
// @icon         https://cdn-icons-png.flaticon.com/512/1158/1158164.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517924/Remove%20Paintings.user.js
// @updateURL https://update.greasyfork.org/scripts/517924/Remove%20Paintings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removepaintingclutter(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    }

    const elementchecker = new MutationObserver(() => {
        const profile = document.querySelector('#profile .box-x .box-content-x div');
        if (profile) {
            removepaintingclutter('#profile .inv-framed.pt-20');
            elementchecker.disconnect();
        }
    });

    elementchecker.observe(document.body, { childList: true, subtree: true });
})();

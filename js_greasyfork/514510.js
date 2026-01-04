// ==UserScript==
// @name         Gartic.io Oda listesi silme engelleyici 
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Gartic.io kayma sorunlarını tüm cihazlarda engeller, çıkış ve odalar tuşlarını görünür bırakır ve odalar tuşu kaymak yerine elle kontrol edilir. 
// @license      MIT
// @author       《₁₈₇》
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514510/Garticio%20Oda%20listesi%20silme%20engelleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/514510/Garticio%20Oda%20listesi%20silme%20engelleyici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';

    const hideElements = () => {
        const elementsToHide = document.querySelectorAll(".right-sidebar, .left-sidebar, .advertisement, .banner, .top-banner, .banner-container");
        elementsToHide.forEach(el => el.style.display = 'none');

        const essentialSections = document.querySelectorAll(".header, .rooms, .game-button, .logout-button");
        essentialSections.forEach(section => section.style.display = 'block');

        const roomsSection = document.querySelector(".rooms");
        if (roomsSection) {
            roomsSection.style.overflowY = 'auto';
            roomsSection.style.maxHeight = '80vh';
        }
    };

    window.addEventListener('load', hideElements);

    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });

})();

// ==UserScript==
// @name         MAL Favorites Row Wrap
// @namespace    https://myanimelist.net/
// @version      1.0
// @description  Display user favorites in rows without horizontal scroll.
// @grant        none
// @match        https://myanimelist.net/profile/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514946/MAL%20Favorites%20Row%20Wrap.user.js
// @updateURL https://update.greasyfork.org/scripts/514946/MAL%20Favorites%20Row%20Wrap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandFavorites(callback) {
        const moreBtn = document.querySelector('.btn-favmore');

        if (!moreBtn) return callback();

        moreBtn.click();

        setTimeout(() => {
            moreBtn.remove();
            callback();
        }, 500);
    }

    function organizeRows() {
        const sections = document.querySelectorAll('.fav-slide-block');

        if (!sections.length) return;

        sections.forEach(section => {
            const favList = section.querySelector('.fav-slide');

            if (!favList) return;

            const items = Array.from(favList.children);

            if (!items.length) return;

            section.querySelectorAll('.btn-fav-slide-side').forEach(btn => btn.style.display = 'none');
            favList.remove();

            let currentUl;
            items.forEach((item, index) => {
                if (index % 10 === 0) {
                    currentUl = document.createElement('ul');
                    currentUl.className = 'fav-slide';
                    currentUl.dataset.slide = "10";
                    section.querySelector('.fav-slide-outer').appendChild(currentUl);
                }
                currentUl.appendChild(item);
            });
        });
    }

    const observer = new MutationObserver((_, obs) => {
        const favSection = document.querySelector('.fav-slide-block');

        if (!favSection) return;

        obs.disconnect();
        expandFavorites(organizeRows);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

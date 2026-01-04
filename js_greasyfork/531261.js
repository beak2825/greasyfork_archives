// ==UserScript==
// @name         Block Ad Cards
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Hide ad cards on itorrents-igruha.org / itorrents-igruha.net
// @match        https://itorrents-igruha.org/*
// @match        https://itorrents-igruha.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531261/Block%20Ad%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/531261/Block%20Ad%20Cards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAdCards() {
        const adLinks = [
            '/790-warface-varfeys.html',
            '/652-war-thunder.html',
            '/16750-malinovka.html',
            '/465-crossout.html',
            '/17336-blum.html',
            '/17116-random-key-steam.html',
            '/17102-skidki-na-igry.html',
            '/1131-counter-strike-16.html',
            '/1983-me-enlisted-download.html',
            '/16751-divine-ark.html',
            '/778-world-of-tanks.html',
            '/72-world-of-warships.html',
            '/72-22-world-of-warships.html',
            '/19761-gta-samp-evolve-role-play.html',
            '/17225-899008.html',
            '/5782-black-myth-wukong.html',
            '/16749-lineage-2-essence.html',
            '/17904-1-8989556.html',
            '/72-21-world-of-warships-download.html'//,
            //'/17221-premium-user.html'
        ];

        adLinks.forEach(link => {
            const cards = document.querySelectorAll(`a[href*="${link}"]`);
            cards.forEach(card => {
                const parentCard = card.closest('.short-item22') || card.closest('.article-film') || card.closest('div') || card;
                parentCard.style.display = 'none';
            });
        });

        const recommendedElements = document.querySelectorAll('.menusidebar');
        recommendedElements.forEach(element => {
            if (element.textContent.includes('Советуем 🔥')) {
                element.style.display = 'none';
            }
        });

        const allArticleFilms = document.querySelectorAll('.article-film');
        allArticleFilms.forEach(film => {
            const link = film.querySelector('a');
            if (link && adLinks.some(adLink => link.href.includes(adLink))) {
                film.style.display = 'none';
            }
        });
        const torrent3Elements = document.querySelectorAll('.torrent3');
        torrent3Elements.forEach(element => {
            element.style.display = 'none';
        });

    }

    hideAdCards();

    const observer = new MutationObserver(hideAdCards);
    observer.observe(document.body, {childList: true, subtree: true});
})();

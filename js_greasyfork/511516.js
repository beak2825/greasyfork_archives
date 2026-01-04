// ==UserScript==
// @name         Add Google Maps Link to Google Search Navigation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a "Maps" link to Google Search navigation, allowing users to directly open their search query in Google Maps.
// @author       Nieme
// @include      https://www.google.*/search*
// @grant        none
// @license      GPLv2
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/511516/Add%20Google%20Maps%20Link%20to%20Google%20Search%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/511516/Add%20Google%20Maps%20Link%20to%20Google%20Search%20Navigation.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const translations = {
        en: 'Maps',
        de: 'Maps',
        fr: 'Maps',
        es: 'Mapa',
        it: 'Mappa',
        nl: 'Kaarten',
        pt: 'Mapa',
        ru: 'Карты',
        ja: '地図',
        ko: '지도',
        zh: '地图'
    };

    function getLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('hl');

        if (langParam) {
            return langParam.split('-')[0];
        }

        return document.documentElement.lang || 'en';
    }

    function addMapLinkToNavigation() {
        const navigationContainer = document.querySelector("div[role='list']");
        if (!navigationContainer) {
            console.log("Userscript Google Maps Error: Navigation container not found. Contact me on Discord: Nieme");
            return;
        }

        if (navigationContainer.querySelector(".custom-map-link")) {
            console.log("Userscript Google Maps Error: Map link already added. Contact me on Discord: Nieme");
            return;
        }

        const queryElement = document.querySelector("input[name='q']");
        if (!queryElement || !queryElement.value) {
            console.log("Userscript Google Maps Error: Query element not found. Contact me on Discord: Nieme");
            return;
        }

        const query = queryElement.value;

        const currentTLD = window.location.hostname.split('.').slice(-1)[0];
        const mapsDomain = `https://www.google.${currentTLD}/maps/search/?api=1&query=${encodeURIComponent(query)}`;

        const language = getLanguage();
        const linkText = translations[language] || translations['en'];

        const newListItem = document.createElement('div');
        newListItem.setAttribute('role', 'listitem');

        const newLink = document.createElement('a');
        newLink.href = mapsDomain;
        newLink.className = 'LatpMc nPDzT T3FoJb custom-map-link';
        newLink.setAttribute('role', 'link');
        newLink.innerHTML = `<div jsname="bVqjv" class="YmvwI">${linkText}</div>`;

        newListItem.appendChild(newLink);

        // Finde das "Videos" Listenelement, damit wir den neuen Link dahinter einfügen können
        const videosLink = navigationContainer.querySelector("a[href*='tbm=vid']");
        if (videosLink && videosLink.parentElement) {
            videosLink.parentElement.insertAdjacentElement('afterend', newListItem);
        } else {
            // Fallback: Falls "Videos" nicht gefunden wird, füge den Link am Ende hinzu
            navigationContainer.appendChild(newListItem);
        }
    }

    const observer = new MutationObserver(() => {
        addMapLinkToNavigation();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(() => {
            addMapLinkToNavigation();
        }, 1000);
    });
})();

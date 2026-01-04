// ==UserScript==
// @name         Free Songs Like X Pro Spotify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get free pro plan on this website, just put in the song and get 50+ spotify songs like it for free. (find spotify songs easier)
// @author       zvddfdzfd fsdfs
// @match        https://songslikex.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479638/Free%20Songs%20Like%20X%20Pro%20Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/479638/Free%20Songs%20Like%20X%20Pro%20Spotify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBlurPointerClass() {
        const elements = document.querySelectorAll('.blur.pointer');
        elements.forEach(element => {
            element.classList.remove('blur', 'pointer');
        });
    }

    function removeButton() {
        const button = document.querySelector('a.button.accent.center.full');
        if (button) {
            button.remove();
        }
    }

    function removeCustomElement() {
        const customElement = document.querySelector('a.recommend.no-hover.m-b-xl');
        if (customElement) {
            customElement.remove();
        }
    }

    function modifyPage() {
        removeBlurPointerClass();
        removeButton();
        removeCustomElement();
    }

    window.addEventListener('load', modifyPage);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                modifyPage();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

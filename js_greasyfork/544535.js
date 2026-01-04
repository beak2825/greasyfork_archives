// ==UserScript==
// @name         nackt-und-angezogen
// @namespace    http://tampermonkey.net/
// @version      2025-08-03
// @description  Shows images in fullscreen and lets you move forward or back using your keyboard, with an easy way to exit fullscreen by escape or by clicking.
// @author       yorekthurr
// @match        https://www.nackt-und-angezogen.com/nackt-bilder/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nackt-und-angezogen.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544535/nackt-und-angezogen.user.js
// @updateURL https://update.greasyfork.org/scripts/544535/nackt-und-angezogen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let triggered = false; // 👉 Nur einmal auslösen!

    function triggerNext() {
        if (triggered) return;
        triggered = true;

        const nextBtn = document.querySelector('.navmenu_pic[title="nächste Datei anzeigen"]');
        if (nextBtn) {
            console.log("➡️ Trigger: Weiter");
            nextBtn.click();
        }
    }

    function triggerPrev() {
        if (triggered) return;
        triggered = true;

        const prevBtn = document.querySelector('.navmenu_pic[title="vorherige Datei anzeigen"]');
        if (prevBtn) {
            console.log("⬅️ Trigger: Zurück");
            prevBtn.click();
        }
    }

    function injectStyles() {
        const style = document.createElement('style');

        style.textContent = `
            .display_media.fullscreen img {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                object-fit: contain;
                z-index: 9999;
                background-color: black;
                margin: 0;
                padding: 0;
            }
        `;

        document.querySelector('.display_media').classList.add('fullscreen');
        document.head.appendChild(style);
    }

    window.addEventListener('load', () => {
        injectStyles();

        // 🖱️ Klick auf das Bild
        document.body.addEventListener('click', function (e) {
            if (e.target.matches('.display_media img')) {
                const imgEl = document.querySelector('.display_media.fullscreen');
                if (imgEl) imgEl.classList.remove('fullscreen')
            }
        });

        // ⌨️ Tastendruck
        document.addEventListener('keydown', function (e) {
            if (e.code === 'ArrowRight' || e.code === 'Space') {
                 e.preventDefault();
                triggerNext();
            } else if (e.code === 'ArrowLeft') {
                 e.preventDefault();
                triggerPrev();
            } else if (e.code === 'Escape') {
                 e.preventDefault();
                const imgEl = document.querySelector('.display_media.fullscreen');
                if (imgEl) imgEl.classList.remove('fullscreen');
            }
        });
    });

})();




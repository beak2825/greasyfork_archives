// ==UserScript==
// @name         Arka plan scripti
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Arka plana seçilen urlyi ekler.Eğer çalışmadıysa bu adrese gidin:https://m.youtube.com/watch?v=DXayo1XNM9k&t=1s
// @author       《₁₈₇》
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516979/Arka%20plan%20scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/516979/Arka%20plan%20scripti.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyGlobalBackground() {
        document.body.style.backgroundImage = "url('')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";

        const startScreen = document.querySelector('.home');
        if (startScreen) {
            startScreen.style.backgroundImage = "url('')";
            startScreen.style.backgroundSize = "cover";
            startScreen.style.backgroundRepeat = "no-repeat";
            startScreen.style.backgroundAttachment = "fixed";
        }

        const roomList = document.querySelector('.rooms');
        if (roomList) {
            roomList.style.backgroundImage = "url('')";
            roomList.style.backgroundSize = "cover";
            roomList.style.backgroundRepeat = "no-repeat";
            roomList.style.backgroundAttachment = "fixed";
        }

        const roomPage = document.querySelector('.room');
        if (roomPage) {
            roomPage.style.backgroundImage = "url('')";
            roomPage.style.backgroundSize = "cover";
            roomPage.style.backgroundRepeat = "no-repeat";
            roomPage.style.backgroundAttachment = "fixed";
        }

        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.backgroundImage = 'none';
        });
    }

    const observer = new MutationObserver(applyGlobalBackground);
    observer.observe(document.body, { childList: true, subtree: true });

    applyGlobalBackground();
})();
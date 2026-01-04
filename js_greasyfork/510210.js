// ==UserScript==
// @name         VK Anonymous Story Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Visualize stories anonimamente no VK
// @author       Seu Nome
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510210/VK%20Anonymous%20Story%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/510210/VK%20Anonymous%20Story%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Seu código aqui
    function hideViewer() {
        const stories = document.querySelectorAll('.Story__sticker');
        stories.forEach(story => {
            story.setAttribute('data-viewed', 'false');
        });
    }

    // Executa a função quando a página é carregada
    window.addEventListener('load', hideViewer);
})();
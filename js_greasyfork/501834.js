// ==UserScript==
// @name         Autoscroll script for speech synthesizer in RanobeHub
// @name:ru      Скрипт автоматической прокрутки для синтезатора речи в RanobeHub
// @namespace    https://github.com/vradiy/ranobehub-auto-scroll
// @version      0.4
// @description  Centers the screen on the speech synthesized paragraph RanobeHub
// @description:ru Центрирует экран на озвучиваемом синтезатором речи абзаце RanobeHub
// @author       vrady
// @match        https://ranobehub.org/ranobe/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501834/Autoscroll%20script%20for%20speech%20synthesizer%20in%20RanobeHub.user.js
// @updateURL https://update.greasyfork.org/scripts/501834/Autoscroll%20script%20for%20speech%20synthesizer%20in%20RanobeHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to scroll the page to the highlighted paragraph
    function scrollToHighlighted() {
        const highlighted = document.querySelector('.paragraph-highlight');
        if (highlighted) {
            highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Observe changes in the document to detect when a new paragraph is highlighted
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.target.classList.contains('paragraph-highlight')) {
                scrollToHighlighted();
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { attributes: true, subtree: true });

    // Initial scroll to the highlighted paragraph
    scrollToHighlighted();
})();

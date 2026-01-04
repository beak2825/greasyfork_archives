// Добавьте свои зеркала в раздел match
// ==UserScript==
// @name         Letterboxd Button for KinoPub
// @name:ru      Кнопка Letterboxd для Кинопаб
// @version      1.3
// @description  Add a styled "Log on Letterboxd" button to movie pages on kino.pub
// @description:ru  Добавляет кнопку страницы фильма на Letterboxd под плеером Кинопаба
// @author       Lex Fradski
// @match        https://*.btr.ovh/item/view/*
// @match        https://kino.pub/item/view/*
// @grant        none
// @namespace https://greasyfork.org/users/1231710
// @downloadURL https://update.greasyfork.org/scripts/486008/Letterboxd%20Button%20for%20KinoPub.user.js
// @updateURL https://update.greasyfork.org/scripts/486008/Letterboxd%20Button%20for%20KinoPub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to load
    window.addEventListener('load', function() {
        let imdbLink = document.querySelector('a[href*="imdb.com/title/"]');
        if (imdbLink) {
            // Extract only the numeric part of the IMDb ID
            let imdbIdMatch = imdbLink.href.match(/tt(\d+)/);
            let imdbId = imdbIdMatch ? imdbIdMatch[1] : null;
            if (imdbId) {
                let letterboxdUrl = `https://letterboxd.com/imdb/${imdbId}`;
                let seenButton = document.getElementById('movie-status');

                if (seenButton) {
                    let letterboxdButton = document.createElement('button');
                    letterboxdButton.innerHTML = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="height: 14px; width: 14px; vertical-align: text-bottom; fill: currentColor;"><path d="M8.224 14.352a4.447 4.447 0 0 1-3.775 2.092C1.992 16.444 0 14.454 0 12s1.992-4.444 4.45-4.444c1.592 0 2.988.836 3.774 2.092-.427.682-.673 1.488-.673 2.352s.246 1.67.673 2.352zM15.101 12c0-.864.247-1.67.674-2.352-.786-1.256-2.183-2.092-3.775-2.092s-2.989.836-3.775 2.092c.427.682.674 1.488.674 2.352s-.247 1.67-.674 2.352c.786 1.256 2.183 2.092 3.775 2.092s2.989-.836 3.775-2.092A4.42 4.42 0 0 1 15.1 12zm4.45-4.444a4.447 4.447 0 0 0-3.775 2.092c.427.682.673 1.488.673 2.352s-.246 1.67-.673 2.352a4.447 4.447 0 0 0 3.775 2.092C22.008 16.444 24 14.454 24 12s-1.992-4.444-4.45-4.444z"/></svg> Открыть на Letterboxd';
                    letterboxdButton.className = seenButton.className; // Copy the class of "Уже видел" button
                    letterboxdButton.style.marginLeft = '10px';
                    letterboxdButton.onclick = function() {
                        window.open(letterboxdUrl, '_blank');
                    };

                    seenButton.parentNode.insertBefore(letterboxdButton, seenButton.nextSibling);
                }
            }
        }
    });
})();

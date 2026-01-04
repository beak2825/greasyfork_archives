// ==UserScript==
// @name         Skrytí NCAA na Courtside1891
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automaticky skryje NCAA na stránce courtside1891.basketball/games
// @author       Michal
// @match        https://www.courtside1891.basketball/games
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527935/Skryt%C3%AD%20NCAA%20na%20Courtside1891.user.js
// @updateURL https://update.greasyfork.org/scripts/527935/Skryt%C3%AD%20NCAA%20na%20Courtside1891.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideNCAACompetitionGames() {
        let titles = document.querySelectorAll('.competition-header__title');

        for (let title of titles) {
            if (title.textContent.trim() === "USA | NCAA") {
                let button = title.closest('button.competition-header');

                if (button) {
                    button.style.display = 'none';

                    let nextElement = button.nextElementSibling;
                    if (nextElement && nextElement.classList.contains('game-centre-v2__competition-games')) {
                        nextElement.style.display = 'none';
                    }
                }
                break;
            }
        }
    }


    let observer = new MutationObserver(hideNCAACompetitionGames);
    observer.observe(document.body, { childList: true, subtree: true });


    setInterval(hideNCAACompetitionGames, 3000);
})();

// ==UserScript==
// @name             Letterboxd Torrent Search button
// @description      Adds torrent search buttons before the IMDb button on the Letterboxd page
// @author           mestrenandi
// @namespace        mestrenandi
// @contributionURL  https://www.paypal.com/donate/?hosted_button_id=PGCMER56TKFFG
// @version          1.0
// @grant            none
// @license          MIT
// @match            https://letterboxd.com/film/*
// @downloadURL https://update.greasyfork.org/scripts/501956/Letterboxd%20Torrent%20Search%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/501956/Letterboxd%20Torrent%20Search%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(id, innerHTML, clickHandler, glowColor) {
        const button = document.createElement('a');
        button.id = id;
        button.className = 'micro-button track-event';
        button.innerHTML = innerHTML;
        button.style.marginRight = "3px";
        button.style.borderColor = "#303840";
        button.style.transition = "box-shadow 0.3s ease-in-out";

        button.addEventListener('mouseover', function() {
            button.style.borderColor = "#9ab";
            button.style.boxShadow = `0 0 10px ${glowColor}`;
        });

        button.addEventListener('mouseout', function() {
            button.style.borderColor = "#303840";
            button.style.boxShadow = "none";
        });

        button.addEventListener('click', clickHandler);

        const imdbButton = document.querySelector('a[data-track-action="IMDb"]');
        if (imdbButton) {
            imdbButton.parentNode.insertBefore(button, imdbButton);
        }
    }

    function getIMDbId() {
        const imdbLink = document.querySelector('a[data-track-action="IMDb"]');
        if (imdbLink) {
            const url = new URL(imdbLink.href);
            const pathname = url.pathname;
            const segments = pathname.split('/');
            for (let i = 0; i < segments.length; i++) {
                if (segments[i].startsWith('tt')) {
                    return segments[i];
                }
            }
        }
        return null;
    }

    const imdbId = getIMDbId();
    if (imdbId) {
        createButton('TGxSearchButton', 'TGx Search', function() {
            const searchURL = `https://torrentgalaxy.to/torrents.php?search=${imdbId}&sort=size&order=desc`;
            window.open(searchURL, '_blank');
        }, 'yellow');
    }

    createButton('ExtSearchButton', 'EXT Search', function() {
        const movieTitle = document.querySelector('h1.headline-1').innerText;
        const query = movieTitle.split(' ').join('+');
        const searchURL = `https://ext.to/search/?order=size&sort=desc&q=${query}`;
        window.open(searchURL, '_blank');
    }, 'blue');

})();

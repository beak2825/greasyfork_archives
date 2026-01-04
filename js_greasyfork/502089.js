// ==UserScript==
// @name             Botão de Procurar Torrent no Letterboxd (Sites Brasileiros, Estrangeiros e Trackers Privados)
// @description      Adiciona botões no site Letterboxd para realizar a procura de torrents em sites estrangeiros e brasileiros.
// @author           mestrenandi
// @namespace        mestrenandi
// @version          1.13
// @grant            none
// @license          MIT
// @match            https://letterboxd.com/film/*
// @downloadURL https://update.greasyfork.org/scripts/502089/Bot%C3%A3o%20de%20Procurar%20Torrent%20no%20Letterboxd%20%28Sites%20Brasileiros%2C%20Estrangeiros%20e%20Trackers%20Privados%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502089/Bot%C3%A3o%20de%20Procurar%20Torrent%20no%20Letterboxd%20%28Sites%20Brasileiros%2C%20Estrangeiros%20e%20Trackers%20Privados%29.meta.js
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
        button.style.lineHeight = "3.18";

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
/////////////////////////////////
    const imdbId = getIMDbId();
    if (imdbId) {
        createButton('TGxSearchButton', 'tgx', function() {
            const searchURL = `https://torrentgalaxy.to/torrents.php?search=${imdbId}&sort=size&order=desc`;
            window.open(searchURL, '_blank');
        }, 'yellow');
    }
/////////////////////////////////
    createButton('ExtSearchButton', 'ext', function() {
        const movieTitle = document.querySelector('h1.headline-1').innerText;
        const query = movieTitle.split(' ').join('+');
        const searchURL = `https://ext.to/search/?order=size&sort=desc&q=${query}`;
        window.open(searchURL, '_blank');
    }, 'blue');
/////////////////////////////////
    if (imdbId) {
        createButton('ComandoSearchButton', 'comando', function() {
            const searchURL = `https://comando.la/?s=${imdbId}`;
            window.open(searchURL, '_blank');
        }, 'gray');
    }
/////////////////////////////////
    if (imdbId) {
        createButton('BludvSearchButton', 'bludv', function() {
            const searchURL = `https://bludv.xyz/?s=${imdbId}`;
            window.open(searchURL, '_blank');
        }, 'green');
    }
/////////////////////////////////
    if (imdbId) {
        createButton('FnPSearchButton', 'fnp', function() {
            const searchURL = `https://fearnopeer.com/torrents?imdbId=${imdbId}&sortField=size`;
            window.open(searchURL, '_blank');
        }, 'blue');
    }
/////////////////////////////////
    if (imdbId) {
        createButton('torrentleechSearchButton', 'torrentleech', function() {
            const searchURL = `https://www.torrentleech.org/torrents/browse/index/query/${imdbId}/orderby/size/order/desc`;
            window.open(searchURL, '_blank');
        }, 'green');
    }
})();
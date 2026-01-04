// ==UserScript==
// @name         YouTube MUSIC
// @version      1.1
// @description  This script uses CSS to get rid of the video player and frees the visual space to be occupied by the playlist. It also increases the font of the song lyrics and puts it at the center of the tab.
// @match        *://music.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/779030
// @downloadURL https://update.greasyfork.org/scripts/521365/YouTube%20MUSIC.user.js
// @updateURL https://update.greasyfork.org/scripts/521365/YouTube%20MUSIC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a <style> element
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        @media (min-width: 936px) {
            #main-panel.ytmusic-player-page {
                flex: unset;
            }
        }
        content.style-scope.ytmusic-player-page {
            flex: unset;
        }
        ytmusic-player-page:not([is-mweb-modernization-enabled]):not([has-av-switcher]) #main-panel.ytmusic-player-page {
            display: block;
        }
        .side-panel.ytmusic-player-page {
            flex: unset;
            margin: -40px -0px 0px !important;
            width: 80vw !important;
            max-width: unset;
        }
        .non-expandable.ytmusic-description-shelf-renderer {
            text-align: center;
            font-size: 20px;
        }
        .ytmusic-player {
            display: block !important;
        }
    `;

    // Append the <style> element to the document head
    document.head.appendChild(style);
})();
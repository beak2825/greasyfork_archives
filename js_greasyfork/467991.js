// ==UserScript==
// @name         soundgasm change background
// @namespace    AnimeRaupe
// @version      1.6
// @description  darkmode color change for soundgasm
// @author       AnimeRaupe
// @match        ://*.soundgasm.net/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467991/soundgasm%20change%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/467991/soundgasm%20change%20background.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const styles1 = document.createElement('style');
    styles1.type = 'text/css';
    styles1.innerHTML = `
        body{
            background-color: #000000 !important;
            color: #a655d9 !important;
        }
    `;

    const styles2 = document.createElement('style');
    styles2.type = 'text/css';
    styles2.innerHTML = `
        .jp-audio, .jp-audio-stream, .jp-video{
            background-color: #000000 !important;
            color: #a655d9 !important;
        }
    `;

    const styles3 = document.createElement('style');
    styles3.type = 'text/css';
    styles3.innerHTML = `
        .sound-details{
            background-color: #000000 !important;
        }
    `;

    const styles4 = document.createElement('style');
    styles4.type = 'text/css';
    styles4.innerHTML = `
        a:-webkit-any-link{
            color: #00dcff !important;
        }
    `;

    document.body.appendChild(styles1);
    document.body.appendChild(styles2);
    document.body.appendChild(styles3);
    document.body.appendChild(styles4);
})();

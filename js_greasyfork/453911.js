// ==UserScript==
// @name         YouTube download button
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds a button to open a Video download website.
// @author       Foxcreek
// @match        https://www.youtube.com/watch*
// @grant        none
// @run-at       document-idle'
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453911/YouTube%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/453911/YouTube%20download%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRightControls(){
        return document.getElementsByClassName('ytp-right-controls')[0];
    }

    function download(){
    var id = window.location.search.split('v=')[1];
    let hrefDownload ='https://en.loader.to/4/?link=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D'+ id + '3&f=6&s=1&e=1&r=ddownr'
      window.open(hrefDownload, '_blank');
    }

    function createButton(){
        const swb = document.createElement('button');
        swb.classList.add('ytp-button');
        swb.classList.add('downloadBTN');
        swb.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><rect width="100%" height="100%" fill="none"/><polyline points="86 110 128 152 170 110" fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="40" x2="128" y2="152" fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M216,152v56a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>`;
        swb.title = 'Set current playback time to URL (u)';
        swb.onclick = download;
        return swb;
    }

    let panel = getRightControls();
    panel.insertBefore(createButton(), panel.firstChild);
})();
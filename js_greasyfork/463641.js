// ==UserScript==
// @name        Enable the Built-In PiP button on Youtube Media Control
// @namespace   http://youtube.com/
// @version     1.4
// @description Enable the built-in Picture-in-Picture (PiP) button (with custom SVG) in the Youtube Media player.
// @match       *://www.youtube.com/*
// @grant       none
// @author      jayzee8bp
// @icon        https://www.youtube.com/s/desktop/932eb6a8/img/favicon.ico
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/463641/Enable%20the%20Built-In%20PiP%20button%20on%20Youtube%20Media%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/463641/Enable%20the%20Built-In%20PiP%20button%20on%20Youtube%20Media%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pipButton = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-pip-button.ytp-button");
    let boolCondPip = false

    // creating events for toggling color
    const togglePipColor = () => {
        boolCondPip = !boolCondPip;
        console.log(boolCondPip);
        pipButton.querySelector("svg").setAttribute('fill', (boolCondPip ? '#ff0000' : '#fff'));
    };

    // removing svg, then add the svg (https://www.svgrepo.com/svg/347276/picture-in-picture)
    pipButton.removeAttribute('style');
    pipButton.innerHTML = '<svg width="100%" height="100%" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, -1, 0, 0)" stroke-width="0.00024000000000000003" style="transform: scale(0.62, -0.62); transition: all 0.7s"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"></path> </g> </g></svg>';

    // attaching events to elements
    pipButton.addEventListener('click', togglePipColor);
})();
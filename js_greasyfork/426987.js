// ==UserScript==
// @name         Chess.com theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Easyyyyyyy
// @author       You
// @match        https://www.chess.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426987/Chesscom%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/426987/Chesscom%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.tabs-tab:not(.tabs-active) {background-color: #0a1417  !important;}')
addGlobalStyle('body{ color:#040614 !important;}');
addGlobalStyle('body{ background-color:#040614 !important;}')
//Main color
addGlobalStyle('.dark-mode{--globalTertiaryBackground: #151621 !important;}')
//Tertiary is buttons
addGlobalStyle('.dark-mode{--globalSecondaryBackground: #151621 !important;}')
//Secondary is Play Button area and selected tab
addGlobalStyle('.dark-mode{--globalBackground: #0a1417 !important;}')
//Custom game selection box
addGlobalStyle('.dark-mode{--globalAccentBackground: #061d19 !important;}')
//nothing yet
addGlobalStyle('#sb{background-color: #151621  !important;}')
addGlobalStyle('#sb .nav-panel:not(.notifications) .shade {background-color:  #061d19  !important;}')
addGlobalStyle('#sb .popover.dark {background-color:#061d19 !important}')


//sidebar
})();
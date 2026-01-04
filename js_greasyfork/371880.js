// ==UserScript==
// @name         FainTV Cleanup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable FainTV's ads and other annoying features
// @author       iczman
// @match        http://pc.faintv.com.tw/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/371880/FainTV%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/371880/FainTV%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disabls ads
    function displayAdvertising() {}
    const playerAdEl = document.getElementById('playerAD')
    playerAdEl.parentElement.removeChild(playerAdEl)

    // Disable fullscreen prompt
    function playerfullscreen() {}
    function enterFullScreen() {}
    function RunPrefixMethod() {}

    // Disable end of video prompt
    chtplayer.off('ended')

    // Auto play video on load
    playPlayer(true)
})();
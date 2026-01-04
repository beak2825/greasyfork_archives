// ==UserScript==
// @name        Always dark mode - readmanganato.com
// @namespace   Violentmonkey Scripts
// @match       https://*manganato.com/*
// @grant       none
// @version     1.0
// @author      Lag
// @description Automatic dark mode in readmanganato
// @downloadURL https://update.greasyfork.org/scripts/431821/Always%20dark%20mode%20-%20readmanganatocom.user.js
// @updateURL https://update.greasyfork.org/scripts/431821/Always%20dark%20mode%20-%20readmanganatocom.meta.js
// ==/UserScript==

$.cookie('changer-mode-dark', 'yes', {
    expires: 30,
    path: "/"
});
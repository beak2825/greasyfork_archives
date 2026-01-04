// ==UserScript==
// @name         Hide Bottom Bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the bottom bar on tutturu.
// @author       You
// @match        https://app.tutturu.tv/servers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427321/Hide%20Bottom%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/427321/Hide%20Bottom%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        const bottombar = document.getElementById('server-content-layout').children[2];
        bottombar.hidden = true;
        bottombar.style.height = 0;
        const grid = document.getElementById('server-content-layout');
        grid.style.gridTemplate = '"a b" minmax(0,1fr)\n"a d" minmax(0,auto)/minmax(65%,1fr) minmax(163px,320px)';
    }, 3000);
})();
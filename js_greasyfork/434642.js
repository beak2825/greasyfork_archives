// ==UserScript==
// @name         Flight Rising: Board Aesthetic
// @description  Automatically apply bbc code to forum posts for your aesthetic
// @namespace    https://greasyfork.org/en/users/547396
// @author       https://greasyfork.org/en/users/547396
// @match        *://*.flightrising.com/forums/*
// @exclude      *://*.flightrising.com/forums/*/*/edit?*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/434642/Flight%20Rising%3A%20Board%20Aesthetic.user.js
// @updateURL https://update.greasyfork.org/scripts/434642/Flight%20Rising%3A%20Board%20Aesthetic.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const boardMessage = document.getElementById('message');

    /* modify the following sample lines to craft your preferred aesthetic */

    const bbctop = '[columns][color=transparent]_____________[/color][nextcol][font=times][color=#636053][size=4][i]',
          bbcmid = '<message here>',
          bbcbot = '[/i][/size][/color][/font][nextcol][color=transparent]_____________[/color][/columns][br][br][center][emoji=deer skull size=1][/center]';

    const aestheticMessage = bbctop + '\n\n' + bbcmid + '\n\n' + bbcbot;

    boardMessage.innerHTML = aestheticMessage;

})();
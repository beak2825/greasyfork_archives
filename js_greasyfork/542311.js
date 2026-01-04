// ==UserScript==
// @name         AttachClassic - fix broken WinClassic links [2025]
// @name:pl      AttachClassic - napraw uszkodzone linki WinClassic [2025]
// @namespace    https://winclassic.net/
// @version      2025-07-11
// @description        Fix broken WinClassic attachment links
// @description:en-GB  Repair not working WinClassic file download links
// @description:pl     Napraw uszkodzone linki WinClassic
// @author       Winverse
// @match        *://winclassic.boards.net/*
// @icon         https://i.imgur.com/BLhizsg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542311/AttachClassic%20-%20fix%20broken%20WinClassic%20links%20%5B2025%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/542311/AttachClassic%20-%20fix%20broken%20WinClassic%20links%20%5B2025%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newUrl = window.location.href.replace('winclassic.boards.net', 'winclassic.net');
    if (window.location.href !== newUrl) {
        console.log('AttachClassic redirecting to:', newUrl);
        window.location.replace(newUrl);
    }
})();

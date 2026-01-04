// ==UserScript==
// @name         ARCHIVE
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Aggiunge comandi al menu di Tampermonkey per accedere a versioni archiviate della pagina corrente
// @author       SH3LL
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @icon         https://i.postimg.cc/L8cP5JMV/icon.png
// @downloadURL https://update.greasyfork.org/scripts/547447/ARCHIVE.user.js
// @updateURL https://update.greasyfork.org/scripts/547447/ARCHIVE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Open in Wayback Machine
    function openWaybackMachine() {
        const currentUrl = window.location.href;
        window.open('https://web.archive.org/web/*/' + currentUrl, '_blank');
    }

    // Open in Archive.is
    function openArchiveToday() {
        const currentUrl = window.location.href;
        window.open('https://archive.is/' + currentUrl, '_blank');
    }

    // Save in Wayback Machine
    function saveToWaybackMachine() {
        const currentUrl = window.location.href;
        window.open('https://web.archive.org/save/' + currentUrl, '_blank');
    }

    // Save in Archive.is
    function saveToArchiveToday() {
        const currentUrl = window.location.href;
        window.open('https://archive.is/?run=1&url=' + encodeURIComponent(currentUrl), '_blank');
    }

    // MENU
    GM_registerMenuCommand('[🔍️]-web.archive.org', openWaybackMachine);
    GM_registerMenuCommand('[🔍️]-archive.is', openArchiveToday);
    GM_registerMenuCommand('[💾]-web.archive.org', saveToWaybackMachine);
    GM_registerMenuCommand('[💾]-archive.is', saveToArchiveToday);
})();
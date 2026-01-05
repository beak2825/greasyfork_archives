// ==UserScript==
// @name        Fast Spoiler 2 Wykop.pl
// @description Wystarczy najechać myszą, aby zobaczyć spoiler.
// @namespace   http://www.wykop.pl/ludzie/referant/
// @include     https://*.wykop.pl/*
// @version     2.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/1996/Fast%20Spoiler%202%20Wykoppl.user.js
// @updateURL https://update.greasyfork.org/scripts/1996/Fast%20Spoiler%202%20Wykoppl.meta.js
// ==/UserScript==

$('#itemsStream, #hotEntriesBox, #upc,.pmStream').on('mouseenter', 'a.showSpoiler', function () {
    this.click();
});
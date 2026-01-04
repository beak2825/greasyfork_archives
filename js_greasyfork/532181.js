// ==UserScript==
// @name          mods.de Forum - Threadliste
// @description   Versteckt Threads mit Lesezeichen in der Threadliste eines Boards
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://forum.mods.de/board.php*
// @icon          https://i.imgur.com/wwA18B8.png
// @version       1.0
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/532181/modsde%20Forum%20-%20Threadliste.user.js
// @updateURL https://update.greasyfork.org/scripts/532181/modsde%20Forum%20-%20Threadliste.meta.js
// ==/UserScript==

// Workaround to get rid of "is not defined" warnings
/* globals $, jQuery */

$('body > div:eq(2) > table:eq(1) > tbody > tr > td > table > tbody > tr').each(function(){
    if ($('td:eq(2) > a', this).hasClass('bookmark')){
        $(this).hide();
    }
});

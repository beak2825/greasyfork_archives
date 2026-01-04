// ==UserScript==
// @name         TWHelp Link
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Skrypt dodaje link do TWHelp (https://pl.tribalwarshelp.com) w profilu gracza oraz plemienia
// @author       PTS
// @match        https://*.plemiona.pl/game.php*screen=info_player*
// @match        https://*.plemiona.pl/game.php*screen=info_ally*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419771/TWHelp%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/419771/TWHelp%20Link.meta.js
// ==/UserScript==

if (window.location.href.includes('info_player')) $("table:contains('Akta gracza')").last().append(`<tr><td colspan='2'><a href='${$("table:contains('Akta gracza')").last().find('tr').last().find('a').first().attr('href').replace('http://www.twstats.com/in','https://pl.tribalwarshelp.com/server')}' target='_blank'>TWHelp</a></td></tr>`)
if (window.location.href.includes('info_ally')) $("table:contains('Właściwości')").last().append(`<tr><td colspan='2'><a href='${$("table:contains('Właściwości')").last().find('tr').not(":last").last().find('a').first().attr('href').replace('http://www.twstats.com/in','https://pl.tribalwarshelp.com/server')}' target='_blank'>TWHelp</a></td></tr>`)
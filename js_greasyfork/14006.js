// ==UserScript==
// @name         Vozforums Filter
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Edit UI Vozforums
// @author       Paul Nguyen
// @grant        none

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @include        /^https?://vozforums\.com/.*$/

// @downloadURL https://update.greasyfork.org/scripts/14006/Vozforums%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/14006/Vozforums%20Filter.meta.js
// ==/UserScript==

$('div#neo_logobar').closest('div').remove();
$('div.middleads').next('div').find('table:first-child > tbody > tr > td:last').remove();
$('div.middleads').next('table').find(' tbody > tr > td[width=160]').remove();
$('div.middleads').next('div').find('table:first-child > tbody > tr > td:first > form[action="forumdisplay.php"]').remove();
$('div#forumsearch_menu').nextAll('table').empty();
$('#threadrating_menu').nextAll('table').empty();
$('img[src="http://vozforums.com/specials/thermaltake_alt1Active_bg2.png"]').closest('div').remove();
$('div.page > div:first > div:first').remove();
$('div.page > div:first > div:first').remove();

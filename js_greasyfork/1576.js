// ==UserScript==
// @name	The Wikipedia Cleaner
// @description	Wikipedia Remove Money Request
// @namespace	http://userscripts.org/users/boku
// @include	*wikipedia.org*
// @version	2021
// @require	https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @license Beerware
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/1576/The%20Wikipedia%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/1576/The%20Wikipedia%20Cleaner.meta.js
// ==/UserScript==

setInterval(CleanWikipedia, 100);
function CleanWikipedia() {
    $('#centralNotice').remove();
    $('#frb-inline').remove();
    $('#portalBanner_en6C_2021a_txt_1').remove();
    $('#portalBanner_en6C_2021a_txt_2').remove();
    $('#portalBanner_en6C_2021a_txt_3').remove();
    $('#portalBanner_en6C_2021a_txt_4').remove();
}
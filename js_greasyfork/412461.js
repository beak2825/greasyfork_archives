// ==UserScript==
// @name         RARBG Torrents - Search List Color Coding
// @namespace    rarbgp2p
// @version      0.51
// @description  Highlights torrents containing given keyword. Better readability, faster browsing.
// @author       miwoj
// @match        https://rarbg.to/torrents.php*
// @include      https://rarbgprx.org/torrents.php*
// @include      https://proxyrarbg.org/torrents.php*
// @include      https://rarbgunblocked.org/torrents.php*
// @include      https://rarbgaccess.org/torrents.php*
// @include      https://rarbgaccessed.org/torrents.php*
// @include      https://rarbgcore.org/torrents.php*
// @include      https://rarbgdata.org/torrents.php*
// @include      https://rarbgenter.org/torrents.php*
// @include      https://rarbgget.org/torrents.php*
// @include      https://rarbggo.org/torrents.php*
// @include      https://rarbgindex.org/torrents.php*
// @include      https://rarbgmirror.org/torrents.php*
// @include      https://rarbgmirrored.org/torrents.php*
// @include      https://rarbgp2p.org/torrents.php*
// @include      https://rarbgproxied.org/torrents.php*
// @include      https://rarbgproxies.org/torrents.php*
// @include      https://rarbgproxy.org/torrents.php*
// @include      https://rarbgto.org/torrents.php*
// @include      https://rarbgtor.org/torrents.php*
// @include      https://rarbgtorrents.org/torrents.php*
// @include      https://rarbgunblock.org/torrents.php*
// @include      https://rarbgway.org/torrents.php*
// @include      https://rarbgweb.org/torrents.php*
// @include      https://unblockedrarbg.org/torrents.php*
// @include      https://rarbg2018.org/torrents.php*
// @include      https://rarbg2019.org/torrents.php*
// @include      https://rarbg2020.org/torrents.php*
// @include      https://rarbg2021.org/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412461/RARBG%20Torrents%20-%20Search%20List%20Color%20Coding.user.js
// @updateURL https://update.greasyfork.org/scripts/412461/RARBG%20Torrents%20-%20Search%20List%20Color%20Coding.meta.js
// ==/UserScript==

"use strict";

$(".lista a[title]").each(function()
{
    if (/(1080)/i.test($(this).text())) {
        $(this).closest("tr").css({ background: "#ded2fa" }); //violet
    }
    else if (/(2160)/i.test($(this).text())) {
        $(this).closest("tr").css({ background: "#e8d0d7" }); //red
    }
    else if (/(2160)/i.test($(this).text())) {
        $(this).closest("tr").css({ background: "#e8d0d7" }); //red
    }
    else if (/(720)/i.test($(this).text())) {
        $(this).closest("tr").css({ background: "#eceed6" });  //yellow
    }
    else if (/(480|.SD.)/i.test($(this).text())) {
        $(this).closest("tr").css({ background: "#c0edc8" });  //green
    }

//ADD MORE WORDS HERE
//template for adding  more keywords:


//    else if (/(KEYWORD)/i.test($(this).text())) {
//        $(this).closest("tr").css({ background: "COLOR" });  //green
//    }






});
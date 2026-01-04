// ==UserScript==
// @name         ac-clar-shaper
// @description  AtCoderのClarから非本質な情報を消し去り問題順にソートするuserscript
// @version      0.2.1
// @author       fal_rnd
// @match        https://atcoder.jp/contests/*/clarifications
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @namespace    https://greasyfork.org/users/205015
// @supportURL   https://twitter.com/fal_rnd
// @downloadURL https://update.greasyfork.org/scripts/388211/ac-clar-shaper.user.js
// @updateURL https://update.greasyfork.org/scripts/388211/ac-clar-shaper.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

jQuery(function($) {
    $('#main-container').removeClass('container');
    {
        let header = $('#main-container > div.row > div:nth-child(2) > div > table > thead > tr > th');
        header.slice(-3).remove();
        header.eq(1).remove();
    }
    {
        let body = $('#main-container > div.row > div:nth-child(2) > div > table > tbody');
        let rows = body.find('tr');

        rows.each((index, row)=>{
            var td = $(row).children();
            td.slice(-3).remove();
            td[1].remove();
        });

        rows.sort((a, b)=>{
            var va = $(a).find(':first-child > a').attr('href');
            var vb = $(b).find(':first-child > a').attr('href');
            return va < vb ? -1 : 1;
        });
        rows.each((index, row)=>{
            body.append(row);
        });
    }
});
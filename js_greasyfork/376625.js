// ==UserScript==
// @name         Album information script
// @namespace    https://greasyfork.org/users/238956
// @version      0.2.1
// @description  Generate album information from Wikipedia page
// @author       CyanideCentral
// @match        https://en.wikipedia.org/wiki/*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376625/Album%20information%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/376625/Album%20information%20script.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    var tb = $('th.summary.album:first');
    if (tb.length == 0) return;
    else {
        $(":root").append("<div style='position:absolute; top:0; left:-9999px;'><textarea id='temp_area' type='text' rows='1' cols='2'></textarea></div>");
        $("#siteSub").append("\xa0\xa0<a id='getInfo'>Album Info</a>");
        //$("#siteSub").append("\xa0\xa0<a id='getTracks'>Track List</a>");
        $("#getInfo").click(function () {
            var it = tb.text() + '\nArtist: ' + $('.contributor:first').text() + '\nLabel: ';
            var lt = $("a[title='Record label']:first").parent().next();
            if (!lt.children().length) lt = lt.text();
            else lt = lt.find(":not(:has(*))").toArray().map(a => a.text).join(", ")
            it += lt + '\nRelease date: ';
            it += $(".published:first")[0].innerText;
            var th = $("th:contains('Professional ratings')");
            if (th.length > 0) {
                var pr = th.parent().parent();
                var mt = pr.find("a[title='Metacritic']").parent().next().text();
                var pf = pr.find("a[title='Pitchfork (website)']").parent().parent().next().text();
                if (mt != '' || pf != '') {
                    it += '\nRating: ';
                    if (mt != '') {
                        it += 'Metacritic ' + mt.split('/')[0];
                    }
                    if (pf != '') {
                        if (mt != '') it += ', ';
                        pf = pf.split('/')[0];
                        if (pf.length == 1) pf += ".0";
                        it += 'Pitchfork ' + pf;
                    }
                }
            }
            it += '\n\n      ';
            var pp = $("div.mw-parser-output").children("p:contains('e')").first().text();
            it += pp.trim().replace(/\[(\d)+\]/g, '').trim() + " (Wikipedia)";
            $("#temp_area").text(it);
            $("#temp_area").focus();
            $("#temp_area").select();
            document.execCommand('copy');
        });
    }
})();
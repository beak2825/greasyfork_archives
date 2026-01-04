// ==UserScript==
// @name         Manaba Integrated
// @namespace    http://tampermonkey.net/
// @version      1.8.25.1
// @description  Manabaの課題提出期限をGoogleカレンダーに追加するリンクを追加します
// @author       A21056
// @match        https://hama-med.manaba.jp/ct/course_*_*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/427532/Manaba%20Integrated.user.js
// @updateURL https://update.greasyfork.org/scripts/427532/Manaba%20Integrated.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ( location.href.match(/https:\/\/hama-med.manaba.jp\/ct\/course_[0-9]*_(query|survey|report)_[0-9]*/) != null ) {
        let tr = $("table.stdlist tr");

        for ( let i = 0; i < tr.length; i++ ) {
            if ( $(tr[i]).text().indexOf("受付終了日時") != -1 ) {
                $(tr[i]).attr('id', 'submission-end')
            }
        }

        let title = $($("table.stdlist tr th")[0]).text().replace(/(<span(.|\n)*span>|\n)/, "").replace(/^\ */, "").replace(/\ *$/, "");
        let end   = $("#submission-end td").text().replace(/(\n|-|:)/g, "").replace(/(\ )+/, "T");
        let url = "https://www.google.com/calendar/render?action=TEMPLATE&text=" + title + "&dates=" + end + "/" + end + "&trp=true&details=" + location.href;

        $("#submission-end td").html($("#submission-end td").text() + "\n<a target='_blank' href='" + url +"'>Googleカレンダーに追加</a>");
    }
    else if ( location.href.match(/https:\/\/hama-med.manaba.jp\/ct\/course_[0-9]*_(query|survey|report)/) != null ) {
        $("table.stdlist tr").each(function(i, elem) {
            if ( i != 0 ) {
                $(elem).attr('onClick', '');

                let title = $(elem).find("a").text();
                let target_url = $(elem).find("a").attr('href');
                let end = $($(elem).find("td")[3]).text().replace(/(-|:)/g, "").replace(/(\ )+/, "T");

                let url = "https://www.google.com/calendar/render?action=TEMPLATE&text=" + title + "&dates=" + end + "/" + end + "&trp=true&details=https://hama-med.manaba.jp/ct/" + target_url;
                $($(elem).find("td")[3]).html($($(elem).find("td")[3]).text() + "<br><a target='_blank' href='" + url +"'>Googleカレンダーに追加</a>");

                $(elem).find("td").each(function(i, elem) {
                    if ( i != 3 ) {
                        $(elem).attr('onClick', "location.href='" + target_url + "'");
                    }
                });
            }
        });
    }

})();
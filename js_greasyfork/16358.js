// ==UserScript==
// @name         IdleRPG - Format Numbers
// @namespace    http://soulweaver.xyz/
// @version      0.2
// @description  Formats the numbers on the main and profile page to make them easier to read.
// @author       Soulweaver
// @match        http*://betterdiscord.net/idlerpg/
// @match        http*://betterdiscord.net/idlerpg/c/?name=*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.0/moment-timezone.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16358/IdleRPG%20-%20Format%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/16358/IdleRPG%20-%20Format%20Numbers.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function () {
    if (window.location.href.indexOf("/c/?name=") > -1) {
        $("table tr td:nth-child(4)").each(function () {
            $(this).text(numberWithCommas($(this).text()));
        });

        $(".col.col-xs-4 p").each(function (i) {
            if (i > 0) {
                var statNum = $(this).text().match(/\d+/)[0]
                $(this).text($(this).text().replace(statNum, numberWithCommas(statNum)));
            }
        });
    } else {
        $("table tr td").filter(':nth-child(3), :nth-child(4), :nth-child(5), :nth-child(6), :nth-child(7), :nth-child(8), :nth-child(9)').each(function () {
            $(this).text(numberWithCommas($(this).text()));
        });
     var dateraw = $("strong").text();
     dateraw = dateraw.substring(14);
     dateraw = dateraw.substring(0, dateraw.indexOf("/GMT"));
     var idfk1 = dateraw.substring(0,2);
     var idfk2 = dateraw.substring(3,5);
     dateraw = dateraw.replace(idfk1, idfk2);
     dateraw = dateraw.replace("/" + idfk2, "/" + idfk1);
     var date = new Date(dateraw);
     var date = moment(date).format("DD/MM/YYYY hh:mm:ss zz");
     $("strong").append("<p>Local time: " + date + "</p>");
    }
});
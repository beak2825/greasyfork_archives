// ==UserScript==
// @name         Sporskiftet - Nye indlæg
// @namespace    JKL.Sporskiftet
// @version      1.1
// @description  Transformerer svar-tæller og dato i liste med nye spørgsmål
// @author       Jacob Kamp Lund
// @match        https://www.sporskiftet.dk/seneste
// @downloadURL https://update.greasyfork.org/scripts/401718/Sporskiftet%20-%20Nye%20indl%C3%A6g.user.js
// @updateURL https://update.greasyfork.org/scripts/401718/Sporskiftet%20-%20Nye%20indl%C3%A6g.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    if ($ == undefined) {
        throw ("jQuery not available in variable $");
    }

    $("#tracker > table.sticky-enabled.sticky-table > tbody > tr > td").css({ "vertical-align": "top" });

    // fjern linieskift i svar-tæller
    $(".replies").find("br").remove();

    // venstrestil indhold i svar-tæller
    $(".replies").css("text-align", "left");

    // fjern tekst i svar-tæller
    $(".replies").find("a").each(function (index, el) {
        var txt = $(el).text();
        var match = /[0-9]+/.exec(txt);
        if (match && match.length == 1) {
            var answers = parseInt(match[0], 10);
            $(el).text("(" + answers + ")").css("margin-left", "0.25em");
            if (answers > 0) {
                // $(el).parents("tr").css("background-color", "#ff9");

                // yellow gradient
                $(el).parents("tr").css("background", "linear-gradient(90deg, hsl(60 100% 80% / 1), transparent)")
            }
        }
    });

    $(".marker").each(function (index, el) {
        // red gradient
        $(el).parents("tr").css("background", "linear-gradient(90deg, hsl(0 100% 87% / 1), transparent)")
    });

    // afkort dato
    $("td.replies").next().each(function (index, el) {
        var txt = $(el).text();
        txt = txt
            .replace(" år", "å")
            .replace(" måneder", "mnd")
            .replace(" måned", "mnd")
            .replace(" uger", "u")
            .replace(" uge", "u")
            .replace(" dage", "d")
            .replace(" dag", "d")
            .replace(" timer", "t")
            .replace(" time", "t")
            .replace(" minutter", "m")
            .replace(" sekunder", "s")
            .replace(" sek.", "s")
            .replace(" m", "m")
            .replace(" siden", "");

        //$(el).attr("title", $(el).text());
        $(el).text(txt);
    });
})(jQuery || window.jQuery);
// ==UserScript==
// @name         Add Hide All Recommendations Button
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      0.2
// @description  Adds a button to hide an entire group of recomendations.
// @author       PurplePinapples
// @include      /^https:\/\/graph\.anime\.plus\/.*\/recommendations,(anime|manga)
// @downloadURL https://update.greasyfork.org/scripts/40948/Add%20Hide%20All%20Recommendations%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/40948/Add%20Hide%20All%20Recommendations%20Button.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var missing_entries = $("div.section.missing table");
    $(missing_entries).find("tbody").each(function() {
        var trs = $(this).children().toArray();
        // first TR is subject/proposed
        // second TR is either nothing or the `a` element to expand if possible
        // trs[1].find("a").first().click(); // expand if possible.
        var subject = $(trs[0]).find("td.subject");
        var proposed = $(trs[0]).find("td.proposed");
        var non_hidden_ul = $(proposed).find("ul").first();
        var hidden_ul = $(proposed).find("ul").last();
        if ($(non_hidden_ul).find("li").toArray().length > 1) {
            $(hidden_ul).after('<ul><li style="text-align: right; font-variant: small-caps"><a href="javascript:void(0);" class="user_script_hide_these">hide all</a></li></ul>');
        }
    });
    // function that hides other elements oncclick (and hides the hide-all button)
    $(".user_script_hide_these").on("click", function() {
        $(this).parents(".proposed").first().find("li:not('.user_script_hide_these')").each(function() {
            $(this).find("a.delete-trigger").first().click(); // first() probably isnt necessary.
        });
        $(this).parents("tbody").first().fadeOut();
        $(this).parents("ul").first().remove();
    });
})();
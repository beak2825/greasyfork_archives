// ==UserScript==
// @name         Hide PTW Only Recommendations
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      0.1
// @description  If graph.anime.plus gives a recommendation which only has something related on your PTW, hide those recommendations.
// @author       PurplePinapples
// @include      /^https:\/\/graph\.anime\.plus\/.*\/recommendations,(anime|manga)
// @downloadURL https://update.greasyfork.org/scripts/40945/Hide%20PTW%20Only%20Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/40945/Hide%20PTW%20Only%20Recommendations.meta.js
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
        var has_non_ptw_items = false;
        $(subject).find("li").each(function() {
            if ($(this).find(".icon-status-planned").length === 0) { // if we find any non-ptw items
                 has_non_ptw_items = true; // dont hide proposed reccomendations, since this isn't all PTW.
            }
        });
        if (!(has_non_ptw_items)) { // if this only has non PTW items
            $(proposed).find("li").each(function() {
                $(this).find("a.delete-trigger").first().click(); // first() probably isnt necessary.
            });
        }
    });
})();
// ==UserScript==
// @name         Steam Community - Add Direct Join Group To Search
// @namespace    Royalgamer06
// @version      1.0
// @description  Adds a button to join the steam group for each steam group search result.
// @author       Royalgamer06
// @include      /^http(s)?\:\/\/steamcommunity\.com\/search.+/
// @grant        none
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26353/Steam%20Community%20-%20Add%20Direct%20Join%20Group%20To%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/26353/Steam%20Community%20-%20Add%20Direct%20Join%20Group%20To%20Search.meta.js
// ==/UserScript==
$("body").on("click", ".joingroup", function(ev) {
    let btn = $(this).parent();
    $(btn).html("Joining...");
    $.post($(btn).parent().find(".searchPersonaName").attr("href"), { action: "join", sessionID: g_sessionID }, function(data) {
        if ($(".error_ctn", data).length > 0) {
            $(btn).html("Failed to join");
        } else {
            $(btn).html("Successfully joined");
        }
    });
}).on("DOMNodeInserted", ".search_row", function() {
    if ($(this).find(".joinGroupArea, .search_gamegroup_avatar_holder").length === 0 && $(this).hasClass("group")) {
        $(this).find(".searchPersonaInfo").append('<div style="padding-top: 12px;" class="joinGroupArea"><a class="btn_green_white_innerfade btn_medium joingroup"><span>Join Group</span></a></div>');
    }
});
// ==UserScript==
// @name         Steam Community - Youtube Videos Adder
// @icon         http://steamcommunity.com/favicon.ico
// @namespace    Royalgamer06
// @author       Royalgamer06
// @version      1.1
// @description  Automatically adds your Youtube videos to Steam. It assumes this format for your YouTube videos: {EXACT_GAME_TITLE} - {MISC}. I may support more patterns if requested.
// @include      *://steamcommunity.com/id/*/videos/add
// @grant        none
// @run-at       document-idle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28885/Steam%20Community%20-%20Youtube%20Videos%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/28885/Steam%20Community%20-%20Youtube%20Videos%20Adder.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(".add_vid_list_entry:first input[type=checkbox]").prop("checked", true);
var game = $(".vid_list_title_add:first").text().split(" - ")[0];
var appid = $("#add_vid_assoc option:contains(" + game.split(")")[0] + ")").val();
if (appid) {
    $("#add_vid_assoc select").val(appid);
} else {
    $("#other_assoc").val(game);
}
AddVideos();
// ==UserScript==
// @name Post Filtering
// @description Filter posts inside topics
// @match https://gamefaqs.gamespot.com/boards*
// @version 1.01
// @author NCloud
// @license MIT
// @namespace https://greasyfork.org/users/973870
// @downloadURL https://update.greasyfork.org/scripts/474379/Post%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/474379/Post%20Filtering.meta.js
// ==/UserScript==
$(".message tr:not(:only-of-type)").each(function() {
var username = $(".name", this).attr("data-username");
$(this).addClass(username);

var filterLink = $("<a>Filter</a>").click(function() {
if ($(this).text() === "Filter") {
$(".message tr").hide();
$(".message tr." + username).show();
$(this).text("Unfilter");
}
else {
$(".message tr").show();
$(this).text("Filter");
}
});

$(".msg_infobox:not(.deleted) .message_num", this).before(" | ", filterLink);
});
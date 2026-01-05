// ==UserScript==
// @name        Eishockeyforum - Forennavigation - Dashboard
// @namespace   ehf neu
// @include     http://www.eishockeyforum.at/index.php/Dashboard/
// @version     20150727
// @description Fügt der Navigationsleiste am Dashboard die fehlenden Links und Knöpfe hinzu.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/277/Eishockeyforum%20-%20Forennavigation%20-%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/277/Eishockeyforum%20-%20Forennavigation%20-%20Dashboard.meta.js
// ==/UserScript==

sitemap = $("#sitemap").children("a").children(".invisible")

var links1 = "<ul class=\"navigationMenuItems\"><li><a href=\"http\:\/\/www\.eishockeyforum\.at\/index\.php\/BoardQuickSearch\/?mode=unreadPosts\"><span>";
var links2 = "<\/span><\/a><\/li><li><a href=\"http\:\/\/www\.eishockeyforum\.at\/index\.php\/BoardQuickSearch\/?mode=undoneThreads\"><span>";
var links3 = "<\/span><\/a><\/li><li><a href=\"http\:\/\/www\.eishockeyforum\.at\/index\.php\/WatchedThreadList\/\"><span>";
var links4 = "<\/span><\/a><\/li><\/ul>"

var read1 = "<li class=\"jsOnly\"><a title=\""
var read2 = "\" class=\"markAllAsReadButton jsTooltip\" onmouseup=\"javascript\:setTimeout(function(){window.location.href=\'http\:\/\/www.eishockeyforum.at\/index.php\/BoardList\/\';}, 500)\"><span class=\"icon icon16 icon-ok\"><\/span><span class=\"invisible\">"
var read3 = "<\/span><\/a><\/li>"

var readeng = "Mark All Forums Read"
var readdeu = "Alle Foren als gelesen markieren"

if (sitemap.text() === "Sitemap") {
$("nav.navigationHeader").prepend(links1 + 'Unread Posts' + links2 + 'Undone Threads' + links3 + 'Watched Threads' + links4);
$("ul.navigationIcons").append(read1 + readeng + read2 + readeng + read3);
} else if (sitemap.text() === "Schnellnavigation") {
$("nav.navigationHeader").prepend(links1 + 'Ungelesene Beiträge' + links2 + 'Unerledigte Themen' + links3 + 'Abonnierte Themen' + links4);
$("ul.navigationIcons").append(read1 + readdeu + read2 + readdeu + read3);
};

$(function() {
	new WBB.Board.MarkAllAsRead();
});

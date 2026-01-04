// ==UserScript==
// @name        Hentai Foundry Story Fixer
// @namespace   hell@hell.hell
// @description depaginates stories on hentai foundry
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-latest.js
// @include     https://www.hentai-foundry.com/stories/user/*/*/*
// @exclude     https://www.hentai-foundry.com/stories/user/*/*/*/*/*/*
// @include     http://www.hentai-foundry.com/stories/user/*/*/*
// @exclude     http://www.hentai-foundry.com/stories/user/*/*/*/*/*/*
// @downloadURL https://update.greasyfork.org/scripts/374315/Hentai%20Foundry%20Story%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374315/Hentai%20Foundry%20Story%20Fixer.meta.js
// ==/UserScript==

const chapters = $("#yw0 > div:nth-child(3) > p").length;
var currentChapter = 1;
function hfPager() {
	if (currentChapter <= chapters) {
		var link = $("#yw0 > div:nth-child(3) > p:nth-child("+currentChapter+") > a:nth-child(1)").attr("href");
		$("#yw0 > div:nth-child(3) > p:nth-child("+currentChapter+")").load(link + " #viewChapter", function() {
			currentChapter++;
			hfPager();
			}
		);
	}
}

hfPager();

$("#yw0 > div:nth-child(2)").append("<button class='CSSFixer'>Fix black text</button>");

$(".CSSFixer").on("click", function(e) {
    $("span").css("color", "white");
});

$("#stories_view").css("width", "100%");
$("#page").css("margin", "0px");
$("#page").css("padding", "0px");
$("#viewChapter > div:nth-child(3) > span").css("color", "");

// ==UserScript==
// @name         MTL Novel Arrow Key Nav
// @namespace    GF-Fear3d
// @version      1.35
// @description  Allows you to use the left and right arrow keys to navigate chapters at mtlnovel.com, fixes the Night Mode theme, and allows you to optionally hide chapter titles until the end of the chapter
// @author       Fear3d
// @match        https://www.mtlnovel.com/*/*/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/412396/MTL%20Novel%20Arrow%20Key%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/412396/MTL%20Novel%20Arrow%20Key%20Nav.meta.js
// ==/UserScript==

(function() {
 	'use strict';

 	var doHideTitle = true; 	// **** Change this to false if you don't want to hide the titles ****
 	var doHideURL = true;		// **** Change this to false if you don't want to hide the title in the URL ****

 	var nextUrl = "";
 	var prevUrl = "";

 	function hideTitle ()
 	{
 		var chapterTitle = '';

 		var mainTitleNode = $(".main-title");
 		var curCrumbNode = $(".current-crumb");

 		var mainTitleText = mainTitleNode.text().trim();
 		var titleMatch = mainTitleText.match(/.+ Chapter \d+: (.+)/);

 		if (titleMatch)
 		{
 			chapterTitle = titleMatch[1];
 			mainTitleNode.html(mainTitleText.replace(chapterTitle, "<i>Title Hidden</i>"));

 			curCrumbNode.html(curCrumbNode.text().replace(chapterTitle, "Title Hidden"));

 			if (doHideURL)
 				history.pushState(null, null, window.location.pathname.match(/\/[\w\.\-~%]+\/chapter-\d+-/)[0] + "Title-Hidden");

 			var pChapterTitle = document.createElement("p");
 			pChapterTitle.innerHTML = "-<br><br>Chapter Title: " + chapterTitle;
 			$("div.par").append(pChapterTitle);
 		}
 	}

 	if (doHideTitle)
 		hideTitle();

 	// Find URLs for Next and Prev
 	$(document).ready(function() {
		var nextPage = $("a.next");
    	var prevPage = $("a.prev");
    	var tocPage = $("a.toc");

    	if (nextPage.length) {
    		nextUrl = nextPage.attr("href");
    	}
    	else {
    		nextUrl = tocPage.attr("href");
    	}

    	if (prevPage.length) {
    		prevUrl = prevPage.attr("href");
    	}
    	else {
    		prevUrl = tocPage.attr("href");
    	}
	});

 	// Handle arrow key events
	$(document).ready(function() {
 		document.onkeydown = function(evt) {
 			switch (evt.keyCode) {
 				case 37: // Left Arrow
 					window.location = prevUrl;
 					break;
 				case 39: // Right Arrow
 					window.location = nextUrl;
 					break;
 				case 65: // a
 					window.location = prevUrl;
 					break;
 				case 68: // d
 					window.location = nextUrl;
 					break;
 				case 87: // w
 					window.scrollBy({top: -50, behavior: 'auto'});
 					break;
 				case 83: // s
 					window.scrollBy({top: 50, behavior: 'auto'});
 					break;
 			}
 		};
 	});

	// Some Costmetic fixes in this function
 	$(document).ready(function() {

 		if ($("body.nightmode-on").length) { 
 			// Changes color of donation banner in night mode and replaces ko-fi image
 			$("div.donations").css("background-color", "#1f2129");
 			$(".donations > p:nth-child(2) > a:nth-child(1) > amp-img:nth-child(1)").attr("src", "https://i.imgur.com/3rT5sKF.png");
 			$(".donations > p:nth-child(2) > a:nth-child(1) > amp-img:nth-child(1) > amp-img:nth-child(1)").attr("src", 
 				"https://i.imgur.com/3rT5sKF.png");
 			$("img.i-amphtml-fill-content:nth-child(2)").attr("src", "https://i.imgur.com/3rT5sKF.png");

 			// Darken the settings button
	 		$("button#settings").css("background", "#2f3139 url(https://gist.githubusercontent.com/Fear3d/ad0120e349ceba72f78f5827d773c412/raw/" + 
	 			"dea64d2251436d2af8e715952fadbbd711ab688c/cog-outline.svg) 6px 7px no-repeat");
	 		$("button#settings").css({"background-size": "20px", "color": "#7a9999", "border": "1px solid #2f3139"});
	 		$("button#settings").hover(function() {
	 			$(this).css("background", "#337ab7 url(https://gist.githubusercontent.com/Fear3d/90e0bdf84768b621d824b96cce0d37b1/raw/cf0597ac1" + 
	 				"f5b4b841cefddecaff8724bc6348bc7/cog-outline-hover.svg) 4px 5px no-repeat");
	 			$(this).css({"background-size": "24px", "color": "white", "border": "1px solid #337ab7"});
	 			}, function() {
	 			$(this).css("background", "#2f3139 url(https://gist.githubusercontent.com/Fear3d/ad0120e349ceba72f78f5827d773c412/raw/" + 
	 				"dea64d2251436d2af8e715952fadbbd711ab688c/cog-outline.svg) 6px 7px no-repeat");
	 			$(this).css({"background-size": "20px", "color": "#7a9999", "border": "1px solid #2f3139"});
	 		});
 		}

 		// Hides blank space in middle of chapter (probably caused by one of MTLNovel's ad scripts that my adblocker is blocking)
 		$("#mgid-under").hide();
 		// Hides blank space that sometimes is left at end of chapter (probably caused by some ad that uBlock is only partially hiding)
 		$("amp-embed.i-amphtml-element.i-amphtml-notbuilt").hide();
 	});

})();
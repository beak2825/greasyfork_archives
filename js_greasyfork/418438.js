// ==UserScript==
// @name         Mangallama Helper
// @namespace    GF-Fear3d
// @version      0.02
// @description  Allows you to use the left and right arrow keys to navigate chapters at Mangallama, enables WASD scrolling and navigation, and adds a link to the title page for each chapter
// @author       Fear3d
// @match        https://mangallama.com/readmanga.php?manga=*&ch=*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418438/Mangallama%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/418438/Mangallama%20Helper.meta.js
// ==/UserScript==

(function() {
 	'use strict';

 	var nextUrl = "";
 	var prevUrl = "";
 	var doNext = false;
 	var doPrev = false;

 	// Find URLs for Next and Prev
 	$(document).ready(function() {
		var nextPage = $("div.row.hotlist > div.col-md-12.hotlist > h3.hotlist:nth-child(2) > a:nth-child(2)");
    	var prevPage = $("div.row.hotlist > div.col-md-12.hotlist > h3.hotlist:nth-child(2) > a:nth-child(1)");

    	if (nextPage.length) {
    		nextUrl = nextPage.attr("href");
    		doNext = true;
    	}

        if (prevPage.length) {
            if (prevPage.html() == "prev chapter") {
                prevUrl = prevPage.attr("href");
                doPrev = true;
            }
            else if (prevPage.html() == "next chapter") {
                nextUrl = prevPage.attr("href");
                doNext = true;
            }
        }
	});

    // Convert title of manga into a link that leads to title page
    $(document).ready(function() {
        var titleDiv = $("div#titlecontainer");

        var mTitle = titleDiv.html().replace(/ Chapter : \d*\.?\d+ ?/, "");
        var mChapter = titleDiv.html().replace(/[\s\S]*(?= Chapter : \d*\.?\d+ ?)/, "");
        var mUrlTitle = mTitle.replace(/-/g, "%252D").replace(/ /g, "-");

        titleDiv.html(`<a href="https://mangallama.com/manga.php?manga=${mUrlTitle}">${mTitle}</a>
            ${mChapter}`);
    });

 	// Handle arrow key events
	$(document).ready(function() {
 		document.onkeydown = function(evt) {
 			switch (evt.keyCode) {
 				case 37: // Left Arrow
 					if (doPrev)
 						window.location = prevUrl;
 					break;
 				case 39: // Right Arrow
 					if (doNext)
 						window.location = nextUrl;
 					break;
 				case 65: // a
 					if (doPrev)
 						window.location = prevUrl;
 					break;
 				case 68: // d
 					if (doNext && !evt.ctrlKey)
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
})();
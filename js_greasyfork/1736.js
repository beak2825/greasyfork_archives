// ==UserScript==
// @name       CF show colors
// @namespace  http://websocket.bplaced.net
// @version    1.1
// @description  Show colored thread title on codingforums
// @match      http://www.codingforums.com/*
// @copyright  2014, Thomas Theiner
// @downloadURL https://update.greasyfork.org/scripts/1736/CF%20show%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/1736/CF%20show%20colors.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    if(unsafeWindow.jQuery) {
        $ = unsafeWindow.jQuery;
        $('#threads li.new').each(function() {
            var theMatch = $(this).find('.threadstats').text().match(/Replies\:\s(\d+)/);
            if(theMatch) {
	            var replies = parseInt(theMatch[1], 10);
    	        if(replies == 0)
        	        $(this).find('.threadinfo').css({'background-color': '#c1343b'});
            }
        });
    }
}, false);
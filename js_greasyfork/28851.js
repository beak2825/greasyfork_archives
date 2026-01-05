// ==UserScript==
// @name         Pixiv Text MOD
// @namespace    http://
// @version      1.0
// @description  A script that makes pixiv great again (fix text position after 4/10's update)
// @author       DriftKingTW(Pixiv ID:9934873)
// @match        http://www.pixiv.net/member_illust.php
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28851/Pixiv%20Text%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/28851/Pixiv%20Text%20MOD.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	var ratingCount =  $('.rating-count');
    var comments = $('.comments');
    var views = $('.views');
    
    ratingCount.css({
        "margin-left":"0px",
        "text-align":"center",
    });
    
    comments.css({
        "margin-left":"0px",
        "display":"block",
        "text-align":"center",
    });
    
    views.css({
        "margin-right":"0px",
        "text-align":"center",
    });
    
})();
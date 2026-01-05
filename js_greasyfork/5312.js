// ==UserScript==
// @name       Crowdsource HIT Helper
// @namespace  http://ericfraze.com
// @version    0.1
// @description (mTurk) Turns the links in "REVIEW: Website Categorization (Adult Content)" into iFrames.
// @match      https://work.crowdsource.com/amt/*
// @copyright  2014+, Eric Fraze
// @downloadURL https://update.greasyfork.org/scripts/5312/Crowdsource%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5312/Crowdsource%20HIT%20Helper.meta.js
// ==/UserScript==

 $(document).ready(function() {
     	// Force the HIT page to be as wide as possible
     	$("#page").css("cssText", "width: 100% !important;");
     	$("#assignment").css("cssText", "width: 100% !important; margin: 0; box-sizing: border-box;");
     	$(".task").css("cssText", "width: 100% !important; box-sizing: border-box;");
     
        // Add the iFrames
        $('a:contains("Website")').filter(function(index) {
            $(this).css('display','block');
            $(this).css('width','100%');
            $(this).after("<iframe sandbox='allow-same-origin allow-forms' class = 'crowdsourcehithelper' src='" + $(this).prop('href')+ "'></iframe>");
            $(".crowdsourcehithelper").css('width','100%');
            $(".crowdsourcehithelper").css('height','500px');
            return false;
        });
});
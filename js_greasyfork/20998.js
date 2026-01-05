// ==UserScript==
// @name         WarezBB Movie Forums CSS and JS Tweaks
// @namespace    http://jbout.in/
// @version      0.1.1
// @description  Better call out 2015/16 movie threads. Highlight popular threads (
// @author       Jeremy Boutin
// @include      https://www.warez-bb.org/viewforum.php?f=4*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/20998/WarezBB%20Movie%20Forums%20CSS%20and%20JS%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/20998/WarezBB%20Movie%20Forums%20CSS%20and%20JS%20Tweaks.meta.js
// ==/UserScript==
/* jshint -W097 */

$.noConflict();

http://127.0.0.1:32400;
// Not sure what this is for, but GreaseMonkey stopped working when removed.

// Remove the sticky threads, and other useless announcement posts.
// Update some CSS.
jQuery('.pagination-links a, .pagination-links b').attr('style', 'font-size: 15px !important');
jQuery(".cat-row").each(function(e) {
    nextSpan = jQuery(this).find('span').text().indexOf("Sticky Topics") !== -1;
    announcementSpan = jQuery(this).find('span').text().indexOf("Announcements") !== -1;
    topicSpan = jQuery(this).find('span').text().indexOf("Topics") !== -1;
    if (nextSpan || announcementSpan) {
        var nextel = jQuery(this).next().attr('class');
        if (nextel == 'list-rows') {
            jQuery(this).hide();
            jQuery(this).next().hide();
        }
    }
});
jQuery('#description').hide();
jQuery('.topicrow .description').attr('style', 'background-color: #f1f1f1 !important');


// CORE FUNCTIONALITY.

jQuery(".topictitle").each(function(e) {
    var thistitlename = jQuery(this).text();
    // Add 2016 Badge
	if (jQuery(this).text().indexOf("2016") !== -1) jQuery(this).addClass("topic2016").removeClass("topic2015");
    // Add 2015 Badge
	if (jQuery(this).text().indexOf("2015") !== -1) jQuery(this).addClass("topic2015").removeClass("topic2016");
});
setTimeout(function(){
    jQuery(".topic2016").each(function(e) {
        var thisparent = jQuery(this).parent().parent().parent();
        jQuery(this).append('<span class="2016MOVIE" style="font-weight:bold;float:right;border: 1px solid #694545;padding: 1px 4px 3px;border-radius: 8%;color: #fefefe;">2016</span>');
		jQuery('.2016MOVIE').css("background", "#333333");
		jQuery('.2016MOVIE').css("font-size", "11px");
        thisparent.attr('style', 'background-color: #fff0cf !important');
    });
    jQuery(".topic2015").each(function(e) {
        var thisparent = jQuery(this).parent().parent().parent();
        jQuery(this).append('<span class="2015MOVIE" style="font-weight:bold;float:right; border: 1px solid #694545;padding: 1px 4px 3px;border-radius: 8%;color: #fefefe;">2015</span>');
		jQuery('.2015MOVIE').css("background", "#666666");
		jQuery('.2015MOVIE').css("font-size", "11px");
        thisparent.attr('style', 'background-color: #fbedf8 !important');
    });
},200);

// Call out semi-popular, and more popular threads. Bolder reply count, etc.
jQuery(".topicrow .topics span").each(function(e) {
	// remove commas in reply count. breaks value for function below..
	if (jQuery(this).text().indexOf(",") !== -1) {
		var noCommas = jQuery(this).text().replace(/,/g, '');
		jQuery(this).text(noCommas);
	}

	// Add classes for popular threads (in tiers)
    var replies = parseFloat(jQuery(this).text());
	if (replies > 25 && replies < 100) jQuery(this).addClass("REPL-N1");
	if (replies > 101 && replies < 500) jQuery(this).removeClass("REPL-N1").addClass("REPL-N2");
    if (replies > 501) jQuery(this).removeClass("REPL-N1").removeClass("REPL-N2").addClass("REPL-N3");
});

setTimeout(function(){
    jQuery(".REPL-N1").each(function(e) {
        jQuery(this)
			.attr('style', 'font-size:14px !important; color: #a99e86 !important; font-weight:bold')
			.append('<b style="margin-left:5px; color:#999 !important; font-size:13px; vertical-align: top !important; line-height:17px;">&#9733;</b>');
    });
    jQuery(".REPL-N2").each(function(e) {
		jQuery(this)
			.attr('style', 'font-size:14px !important; color: #ffb920 !important; font-weight:bold')
			.append('<b style="margin-left:5px; color:#f17304 !important; font-size:15px; vertical-align: top !important; line-height:16px;">&#9733;</b>');
    });
    jQuery(".REPL-N3").each(function(e) {
		jQuery(this)
			.attr('style', 'font-size:16px !important; color: #ff845e !important; font-weight:bold')
			.append('<b style="margin-left:5px; color:#ff5703 !important; font-size:20px; vertical-align: top !important; line-height:18px;">&#9733;</b>');
    });
},200);
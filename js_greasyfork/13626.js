// ==UserScript==
// @name         Add Bars To GFAQS Votals
// @namespace    http://foolmoron.io
// @version      0.2
// @description  adds bars to gamefaqs votals screen
// @author       @foolmoron
// @match        http://*.gamefaqs.com/features/bge20_vote
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13626/Add%20Bars%20To%20GFAQS%20Votals.user.js
// @updateURL https://update.greasyfork.org/scripts/13626/Add%20Bars%20To%20GFAQS%20Votals.meta.js
// ==/UserScript==

$(function() {
	BAR_HEIGHT = '20px';
	BORDER_RADIUS = '10px';
	FIRST_COLOR = '#3951C6';
	SECOND_COLOR = '#28398A';
	
	// kill ugly bars
	$('.battle_results').css('background-image', '')

    // add nice bars
    var detailedResults = $('.detailed_results');
    for (var i = 0; i < detailedResults.length; i++) {
        var detailedResult = detailedResults.eq(i);
        var firstPerc = $('.battle_results', detailedResult.siblings('.battler_box')[0]).text();
        var secondPerc = $('.battle_results', detailedResult.siblings('.battler_box')[1]).text();
        detailedResult.before('\
        	<div style="height: ' + BAR_HEIGHT + '; padding: 0px 4px;">\
        		<div style="float: right; height: 100%; background-color: ' + SECOND_COLOR + '; width: ' + secondPerc + '; border-top-right-radius: ' + BORDER_RADIUS + '; border-bottom-right-radius: ' + BORDER_RADIUS + '; border-left: 1px solid #ADD8E6;"></div>\
        		<div style="float: right; height: 100%; background-color: ' + FIRST_COLOR + '; width: ' + firstPerc + '; border-top-left-radius: ' + BORDER_RADIUS + '; border-bottom-left-radius: ' + BORDER_RADIUS + '; border-right: 1px solid #ADD8E6;"></div>\
    		</div>\
		');
    }
});
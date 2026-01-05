// ==UserScript==
// @name         Seriesfeed Season Separator
// @namespace    https://www.seriesfeed.com
// @version      1.0.2
// @description  Shows a thick line between seasons at the episode view.
// @match        https://*.seriesfeed.com/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @author       Tom
// @copyright    2016+, Tom
// @downloadURL https://update.greasyfork.org/scripts/23767/Seriesfeed%20Season%20Separator.user.js
// @updateURL https://update.greasyfork.org/scripts/23767/Seriesfeed%20Season%20Separator.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global $, console */
'use strict';

$(function() {
	if (window.location.href.indexOf("episodes") > -1) {
		var episodes = $('#afleveringen').find('tr');
		
		var current = "00";
		
		for (var i = 1; i < episodes.length; i++) {
			var row    = $(episodes[i]);
			var name   = row.find('td:eq(0)').text().trim();
			var tag    = name.substr(0, name.indexOf(' '));
			var season = /S(.*)E/.exec(tag)[1];
			
			if (current !== season) {
				row.css('border-top', '3px solid #DDD');
				current = season;
			}
		}
	}
});

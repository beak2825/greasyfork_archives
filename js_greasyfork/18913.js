// ==UserScript==
// @name        Full subreddit menu
// @description Displays all your subreddits in the "My subreddits" dropdown menu instead of the default list capped at 50 items.
// @namespace   raina
// @include     /^https?:\/\/(\w+\.)?reddit\.com\//
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18913/Full%20subreddit%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/18913/Full%20subreddit%20menu.meta.js
// ==/UserScript==
(function() {
	"use strict";

	if (window.top == window.self) {
		var subs = JSON.parse(sessionStorage.getItem("subs"));
		var edit = $('.srdrop.drop-choices .bottom-option');
		var menu = $('.srdrop.drop-choices');
		var list = "";


		var renderSubs = function() {
			list = '<ul style="white-space: pre-line; position: relative;">';
			$.each(subs, function(idx, sub) {
				list += '<li style="display: inline-block; min-width: 23ch;"><a class="choice" href="/r/' + sub + '">' + sub + '</a></li>';
			});
			list += '<li id="subs-tools" style="display: inline-block; position: absolute; right: 0"><a id="subs-refresh" class="choice" href="#">Refresh</a> | </li>';
			list += '</ul>'
			edit.css("border", "none");
			edit.css("font-style", "normal");
			menu.css("width", 'calc(100% - 16px)');
			menu.html(list);
			menu.find('#subs-tools').append(edit);
			menu.find('#subs-tools a').css("display", "inline-block");
			menu.find('#subs-tools #subs-refresh').click(refreshSubs);
		};


		var refreshSubs = function(ev) {
			if ("init" !== ev) {
				ev.preventDefault();
				ev.stopPropagation();
			}
			$.get('/subreddits', function(response) {
				var responseHTML = $(response);
				var subGet = responseHTML.find('.subscription-box li a.title');
				subs = [];
				$.each(subGet, function(idx, el) {
					subs.push(el.textContent);
				});
				sessionStorage.setItem("subs", JSON.stringify(subs));
				renderSubs();
			});
		};


		if (subs) {
			renderSubs();
		} else {
			refreshSubs("init");
		}
	}
}());

/*
	Mini SALR - Minimal Browser Plugin for surfing the Something Awful Forums
  Copyright (C) 2015 Ben Leffler

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ==UserScript==
// @name        Mini SALR
// @namespace   https://gitlab.com/btleffler/mini-salr
// @description Minimal Version of SALR
// @author      Ben Leffler
// @copyright   2015+, btleffler (http://btleffler.github.io/)
// @license     GNU GPLv3
// @homepage    https://gitlab.com/btleffler/mini-salr
// @homepageURL https://gitlab.com/btleffler/mini-salr
// @supportURL  https://gitlab.com/btleffler/mini-salr/issues
// @match       https://forums.somethingawful.com/*
// @match       http://forums.somethingawful.com/*
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/tinycolor/1.3.0/tinycolor.min.js
// @version     1.1.2
// @grant       GM_openInTab
// @grant       window.open
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/15667/Mini%20SALR.user.js
// @updateURL https://update.greasyfork.org/scripts/15667/Mini%20SALR.meta.js
// ==/UserScript==

(function ($, Color) {
	"use strict";

	var toOpen = [],
		container, link, Util;

	var DARKNESS = {
		"SEEN": 10,
		"UNSEEN": 0
	};

	function openTab (url) {
		if (window.GM_openInTab) {
			return GM_openInTab(url, false);
		}

		window.open(url, "_blank");
	}

	// I am an asshole, but...
	$("div.oma_pal, div#ad_banner_user").remove();

	container = $("#forum th.title");

	// Modify Thread Table Row Background Colors and Capture New Post Hrefs
	$("tr.thread.seen").each(function () {
		var $this = $(this),
			$newPostLink = $this.find("a.count"),
			darkness = DARKNESS.SEEN;

		if ($newPostLink.length) {
			darkness = DARKNESS.UNSEEN;
			toOpen.push($newPostLink.first().prop("href"));
		}

		$(this).children("td").each(function () {
			var $this = $(this),
				color = new Color($this.css("backgroundColor"));

			// Desaturate and modify the brightness of the background color
			$this.css(
				"backgroundColor",
				color.greyscale().darken(darkness).toString()
			);
		});
	});

	// If we aren't on the Control Panel,
	// or there aren't enough new posts, there's nothing else to do
	if (toOpen.length < 2 || !/usercp\.php$/.test(window.location.href)) {
		return;
	}

	link = $('<span>Open All Unread</span>').css({
		"font-weight": "bold",
		"display": "inline-block",
		"float": "right",
		"cursor": "pointer"
	});

	container.append(link);

	link.click(function (event) {
		var firstUrl;

		toOpen = toOpen.reverse();
		firstUrl = toOpen.pop();

		toOpen.forEach(openTab);

		window.focus();
		window.location.href = firstUrl;
	});
})(jQuery, tinycolor);

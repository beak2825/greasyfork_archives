/*
    This is a Greasemoneky user script to prevent URLs on embedded Disqus discussions from redirecting.
    Copyright (C) 2017 aktai

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
// @name        Disqus Ignore Redirects
// @description Prevent URLs on embedded Disqus discussions from redirecting.
// @namespace   aktai
// @include     https://disqus.com/embed/*
// @version     1
// @grant       none
// @license     GPL-3.0+
// @supportURL  https://github.com/aktai0/Disqus-Ignore-Redirects
// @downloadURL https://update.greasyfork.org/scripts/30600/Disqus%20Ignore%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/30600/Disqus%20Ignore%20Redirects.meta.js
// ==/UserScript==

// This is implemented as a click listener, so it works even on links in comments added after clicking "Load More Comments"
document.addEventListener('click', function (event) {
   // Ignore clicks on non-"a" tags and "a" tags whose href attribute does not contain "disq.us"
	if (event.target.tagName != "A" || event.target.href.search(/https?:\/\/disq\.us\//) == -1) {
		return;
	}
   
   // Regex to match a "disq.us" URL and group the original URL, up to the last encoded colon
	var redirRegex = /https?:\/\/disq\.us\/url\?url=(.*)%3A.*/g;
   var newURL = event.target.href.replace(redirRegex, function (match, p1) {
         // Match the original URL and return the decoded version
			return decodeURIComponent(p1);
		});
      
   // Update the "a" tag's href attribute
   event.target.href = newURL;
}, true);
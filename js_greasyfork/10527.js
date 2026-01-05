// ==UserScript==
// @id          neogaf-linkback-fix
// @name        NeoGAF : Link Improvements
// @namespace   hateradio)))
// @description Changes the default behavior of links and "Originally Posted By" links (if the quoted post is on the same page, the page will not reload!). Changes m.neogaf.com and neogaf.net URIs to neogaf.com.
// @include     http*://*.neogaf.*/forum/showthread.php*
// @include     http*://*.neogaf.com/forum/showpost.php?p=*
// @homepage    https://greasyfork.org/en/scripts/10527-neogaf-link-improvements/
// @icon        https://i.imgur.com/JrTIiF4.png
// @version     1.1.2
// @grant       GM_log
// @license     https://creativecommons.org/licenses/by-sa/3.0/
// @downloadURL https://update.greasyfork.org/scripts/10527/NeoGAF%20%3A%20Link%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/10527/NeoGAF%20%3A%20Link%20Improvements.meta.js
// ==/UserScript==

/**

Description

Replaces all m.neogaf.com links that are randomly encountered throughout the forum.
No idea why they don't get changed in the back-end -- probably never considered.

Also replaces any miscellaneous neogaf.net links and keeps users browsing on the same domain, replacing [http://**www.**neogaf.com](http://www.neogaf.com) or [http://neogaf.com](http://neogaf.com) links.

The highlight of this script is that it improves the behavior of quoted post links ("Originally Posted By").

If the quote is on the same page, it will automatically go to that post without reloading the page.

If the quote is on a separate page, an underlined red border around the user's name is displayed.
This tells you that there will be a page load if you click on it.

*/

(function () {
	'use strict';
	var linkfix = {
		rels : document.querySelectorAll('.post a[rel]'),
		links : document.querySelectorAll('.postbit a[href*="neogaf."]:not(.linkbacked)'),
		host: '//' + document.location.host + '/',
		init : function () {
			this.css();
			this.proc();
			this.evt();
		},
		css : function () {
			var s = document.getElementsByTagName('style')[0] || document.createElement('style');
			s.textContent += '.gm_diff_page { border-bottom: 1px dotted red }';
			document.body.appendChild(s);
		},
		proc : function () {
			var i = this.rels.length;
			while (i--) {
				this.samePage(this.rels[i]);
			}

			i = this.links.length;
			while (i--) {
				this.normalize(this.links[i]);
			}
		},
		evt: function () {
			document.body.addEventListener('click', function (e) {
				var a = e.target;

				
				if (/(?:viewpost-icon)/.test(a.className)) {
					a = a.parentElement;
				}
				
				if (a && a.rel && /(?:\?p=)/.test(a.href)) {
					// console.log(e, a);
					linkfix.samePage(a, true);
				}
			}, true);
		},
		samePage: function (a, test) {
			var id = a.href.split('#')[1];
			// console.log(id);
			if (document.getElementById(id)) {
				if (test) {
					a.href = '#' + id;
				}
				return;
			}

			a.previousElementSibling.className += ' gm_diff_page';
			a.previousElementSibling.title = '[This quote links to a different page.]';
		},
		normalize: function (a) {
			if (/(?:^http)/.test(a.href)) {
				// replace "m.neogaf.com" and "neogaf.net" to normalize all links
				// changes www.neogaf.com and neogaf.com to the currently used one
				a.href = a.href.replace(/https?:\/\/m.neogaf.com\//, '/forum/')
					.replace(/^(?:https?\:\/\/)(?:\w*\.)?neogaf\.(?:com|net)\//, this.host);
				a.className += ' linkbacked';
			}
		}
	};

	linkfix.init();
}());

// ==UserScript==
// @name         KAT: smart full date/time
// @description  Today: "1 hour ago", yesterday: "yesterday, 11:44", earlier: "12 days ago, 01 Oct 2015, 10:45"
// @include      https://kat.cr/*
// @version      1.0.3
// @author       wOxxOm
// @namespace    https://greasyfork.org/en/users/2159-woxxom
// @license      MIT License
// @run-at       document-start
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/12228/code/setMutationHandler2.js
// @downloadURL https://update.greasyfork.org/scripts/13055/KAT%3A%20smart%20full%20datetime.user.js
// @updateURL https://update.greasyfork.org/scripts/13055/KAT%3A%20smart%20full%20datetime.meta.js
// ==/UserScript==

var dateLocale = 'en-GB';
//var dateLocale = navigator.language;

GM_addStyle('.wOxxOmified {opacity:0.7}');

var today = new Date();
today.setHours(0, 0, 0, 0);

var yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);

var year = new Date();
year.setMonth(0, 1);
year.setHours(0, 0, 0, 0);

var timestamps; // = [].slice.call(document.getElementsByTagName('time'));
setMutationHandler(document, 'time', datify);

function datify(nodes) {
	nodes.forEach(function(n) {
		if (n.wOxxOm == n.textContent)
			return;
		var d = new Date(n.getAttribute('datetime') || n.title);
		if (d >= today) {
			// no change
		} else if (d >= yesterday) {
			setContent(n, 'yesterday, ', d, {hour:'2-digit', minute:'2-digit'});
		} else if (d >= year) {
			setContent(n, '', d, {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'});
		} else {
			setContent(n, '', d, {day:'numeric', month:'short', year:'2-digit', hour:'2-digit', minute:'2-digit'});
		}
	});
	return true;

	function setContent(n, prefix, d, options) {
		var time = d.toLocaleTimeString(dateLocale, options);
		var text = prefix ? prefix + time : time + ', <span class="wOxxOmified">' + n.innerHTML + '</span>';
		if (n.innerHTML != text) {
			var pristine = !n.wOxxOm;
			n.innerHTML = text;
			n.wOxxOm = n.textContent;
			if (pristine)
				setMutationHandler(n, 'time', datify, {
					characterData: true,
					attributes: true, attributeFilter: ['title'],
					childList: true,
					subtree: true
				});
		}
	}
}

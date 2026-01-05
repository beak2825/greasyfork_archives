// ==UserScript==
// @name               Bugmenot Sort Accounts by Date
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            1.0
// @description        Default sorts user/pass by newest to oldest, which is the most probable order in which they still work.
// @run-at             document-start
// @include            http://bugmenot.com/*
// @include            https://bugmenot.com/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.2.2/tinysort.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js
// @author             drhouse
// @icon               http://bugmenot.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/14209/Bugmenot%20Sort%20Accounts%20by%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/14209/Bugmenot%20Sort%20Accounts%20by%20Date.meta.js
// ==/UserScript==

$(document).ready(function () {

	function formatDate(d) {
		var dd = d.getDate();
		var mm = d.getMonth()+1;
		var yy = d.getFullYear() % 100;
		yy = 2000 + yy;

		return yy+'-'+mm+'-'+dd;
	}

	$("#content > article > dl > dd.stats > ul > li:nth-child(3)").text(function(index, text) {
		var x = text.replace('old', 'ago');
		x = x.replace(x, Date.parse(x));
		x = x.replace('(Eastern Daylight Time)', '');
		x = x.replace('(Eastern Standard Time)', '');
		var d = new Date(x);
		return x.replace(x,formatDate(d));
	});

	a = $('#share-it').detach();
	b = $('#content > h2').detach();   
	c = $('#content > ul').detach();
	d = $('#page > footer').detach();

	tinysort.defaults.order = 'desc';
	tinysort('#content > article ',{selector:'#content > article > dl > dd.stats > ul > li:nth-child(3)'});

	a.appendTo("#content");
	b.appendTo("#content");
	c.appendTo("#content");
	d.appendTo("#content");

	$("#content > article > dl > dd.stats > ul > li:nth-child(3)").text(function(index, text) {
		var day = new Date(text);
		var dayWrapper = moment(day).fromNow();
		return text.replace(text, dayWrapper) + ' |  ' + text;
	});

});

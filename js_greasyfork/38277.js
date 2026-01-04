// ==UserScript==
// @name        MturkTitleMaker
// @namespace   https://greasyfork.org/en/users/6503-turk05022014
// @description Puts a title in the titlebar or tab title.
// @match       https://worker.mturk.com/*
// @match       https://turkopticon.info/requesters/*
// @match       https://turkopticon.ucsd.edu/reports?*id=*
// @include     /https://turkopticon\.ucsd\.edu/[a-zA-Z0-9]*$/
// @exclude     https://worker.mturk.com/dashboard
// @exclude     https://worker.mturk.com/status_details/
// @version     2.1.20180405
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/38277/MturkTitleMaker.user.js
// @updateURL https://update.greasyfork.org/scripts/38277/MturkTitleMaker.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var rgxLoc = RegExp('/projects/.*/tasks.*');
var rgxRes = /of (\d+)(?: results (?:from|containing) '(.+)')?/;
var rgxReq = /\/requesters\/(\w+)/;
var rgxUCSD = /id=([a-zA-Z0-9]+)/;
$(function () {
	if (rgxLoc.test(location.href)) {
		var data = $("a:Contains('HIT Details')").parent().data().reactProps.modalOptions;
		document.title = data.requesterName + ": " + data.projectTitle;
	} else if (location.href.indexOf("turkopticon.ucsd.edu") >= 0) {
		var reqs = [];
		$("#reports .strong a").each(function () {
			var req = $(this).text();
			if (reqs.indexOf(req) >= 0)
				return;
			reqs.push(req);
		});
		var p = location.pathname;
		if (p.indexOf("reports") >= 0) {
			var match = rgxUCSD.exec(location.search);
			if (match && match[1])
				reqs.push(match[1]);
		} else
			reqs.push(p.substr(1));
		//reqs.push(p.indexOf("reports") > 0 ? location.search.substr(4) : p.substr(1));
		document.title = reqs.join("; ");
	} else if (location.href.indexOf("turkopticon.info") >= 0) {
		document.title = $(".summary .heading-bar").first().text() + "; " + location.href.replace(/^.*\/requesters\/(?:reports\?id=)?(.+)$/, "$1");
	} else {
		var data = $(".hit-set-table").parent().data();
		var reqCache = JSON.parse(GM_getValue("reqCache", "{}"));
		if (data && data.reactProps.bodyData) {
			data.reactProps.bodyData.forEach(function (h) {
				reqCache[h.requester_id] = { name: h.requester_name, time: Date.now() }
			});
			GM_setValue("reqCache", JSON.stringify(reqCache));
		}
		var title = [];
		var resMatch = rgxRes.exec($(".back-to-search-link,.result-count-info").text());
		if (resMatch)
			title.push(resMatch[1]);
		var data = $(".search-box-container div").data()
		if (data) {
			data = data.reactProps;
			var mr = data.hiddenFormParams["filters[min_reward]"];
			if (mr)
				title.push("$" + (Number.isInteger(mr) ? mr : mr.toFixed(2)));
			if (data.activeSearchValue && (!resMatch || resMatch.length < 2))
				title.push(data.activeSearchValue);
		}
		if (resMatch && resMatch.length > 1) {
				title.push(resMatch[2]);
		} else {
			var reqMatch = rgxReq.exec(location.pathname);
			if (reqMatch)
				title.push(reqCache[reqMatch[1]] ? reqCache[reqMatch[1]].name : reqMatch[1]);
		}
		var h1 = document.getElementsByTagName("h1")[0].textContent;
		if (h1.indexOf("HIT Groups") < 0)
			title.push(h1);
		document.title = title.join(" ");
	}
});
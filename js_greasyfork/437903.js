// ==UserScript==
// @name				reddit.com - Sort by Top Quicker (past hour/24 hours/week/month/year/all time).
// @namespace			a-pav
// @description			All the 'sort by top' options are made available for single clicking. And it actually looks good too.
// @match				*://*.reddit.com/*
// @exclude-match		*://*.reddit.com/search?*
// @exclude-match		*://*.reddit.com/r/*/search?*
// @match              	*://reddit.com/*
// @exclude-match		*://reddit.com/search?*
// @exclude-match		*://reddit.com/r/*/search?*
// @version				1.0
// @run-at				document-end
// @author				a-pav
// @icon				https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// @downloadURL https://update.greasyfork.org/scripts/437903/redditcom%20-%20Sort%20by%20Top%20Quicker%20%28past%20hour24%20hoursweekmonthyearall%20time%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437903/redditcom%20-%20Sort%20by%20Top%20Quicker%20%28past%20hour24%20hoursweekmonthyearall%20time%29.meta.js
// ==/UserScript==

// operates on old design.
var top_a = document.querySelector('ul.tabmenu>li>a[href*="/top/"');
if (top_a === null) {
	return
}

var view = ""

if (window.location.pathname.includes("/top/")) { // we are on a */top/* url
	const re = /hour\b|24|week|month|year|all/;
	var  view = document.querySelector("div.menuarea>div>div.dropdown.lightdrop>span").innerText;
	if (re.test(view)) {
		view = view.match(re)[0]
	}
}

function isView(txt) {
	return txt === view;
}

var html = `
	<li class='${isView("hour") ? 'selected' : ''}'>
		<a class='choice' href='${top_a.href}?sort=top&t=hour'>-1h</a>
	</li>
	<li class='${isView("24") ? 'selected' : ''}'>
		<a class="choice" href='${top_a.href}?sort=top&t=day'>-24h</a>
	</li>
	<li class='${isView("week") ? 'selected' : ''}'>
		<a class="choice" href='${top_a.href}?sort=top&t=week'>-W</a>
	</li>
	<li class='${isView("month") ? 'selected' : ''}'>
		<a class="choice" href='${top_a.href}?sort=top&t=month'>-M</a>
	</li>
	<li class='${isView("year") ? 'selected' : ''}'>
		<a class="choice" href='${top_a.href}?sort=top&t=year'>-Y</a>
	</li>
	<li class='${isView("all") ? 'selected' : ''}'>
		<a class="choice" href='${top_a.href}?sort=top&t=all'>-A</a>
	</li>
`;

top_a.parentElement.insertAdjacentHTML("afterend", html);
// ==UserScript==
// @name         Qobuz Market Switcher
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.05
// @description  Seamlessly switch to different market from anywhere
// @author       Anakunda
// @copyright    2021, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @iconURL      https://static-www.qobuz.com/img/favicon/favicon-96x96.png
// @match        https://www.qobuz.com/*
// @match        http://www.qobuz.com/*
// @match        https://qobuz.com/*
// @match        http://qobuz.com/*
// @downloadURL https://update.greasyfork.org/scripts/392702/Qobuz%20Market%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/392702/Qobuz%20Market%20Switcher.meta.js
// ==/UserScript==

'use strict';

function replaceLinks(a) {
	const rx = /\/([a-z]{2}-[a-z]{2})\//i;
	let lang = rx.exec(a.pathname);
	if (lang != null) lang = lang[0]; else return false;
	const url = new URL(document.location);
	url.pathname = rx.test(url.pathname) ? url.pathname.replace(rx, lang) : lang + url.pathname.slice(1);
	a.href = url.href;
	return true;
}

document.querySelectorAll('ul.countries > li.icon-country a').forEach(replaceLinks);
document.querySelectorAll('ul.countries > li > div.icon-country a').forEach(replaceLinks);
document.querySelectorAll('ul.footer-countries-menu > li.dropdown-item-countries a').forEach(replaceLinks);

let dropUp = document.querySelector('div.dropup');
if (dropUp != null) {
	let ref = document.querySelector('div.album-addtocart');
	if (ref != null) {
		dropUp.style.position = 'unset';
		ref.append(dropUp);
	}
	if ((ref = document.getElementById('right-column')) != null) {
		dropUp.style.marginBottom = '20px';
		dropUp.style.marginLeft = '20px';
		ref.insertBefore(dropUp, ref.children[0].nextElementSibling);
	}
	if ((dropUp = document.querySelector('ul.dropup')) != null) new MutationObserver(function(mutationsList, mo) {
		for (let mutation of mutationsList) if (mutation.target.style.top == '0px') mutation.target.style.top = '40em';
	}).observe(dropUp, { attributes: true, attributeFilter: ['style'] });
}

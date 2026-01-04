// ==UserScript==
// @name Mandiner comments' URL fixer
// @name:hu Mandiner hozzászólás URL-javító
// @description	Userscript for fixing URLs in mandiner.hu's comments
// @description:hu	Felhasználói szkript a mandiner.hu hozzászólásaiban található URL-ek kijavításaira
// @icon	https://mandiner.hu/images/favicon.png
// @version	1.2
// @include	https://*mandiner.hu/cikk/*
// @include	https://*mandiner.hu/felhasznalo/*
// @grant   none
// @namespace https://greasyfork.org/users/412587
// @downloadURL https://update.greasyfork.org/scripts/393345/Mandiner%20comments%27%20URL%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/393345/Mandiner%20comments%27%20URL%20fixer.meta.js
// ==/UserScript==

let actualURL = window.location.href,
	actualURLRegex = /https:\/\/(.*)mandiner.hu\/cikk\/(\d{6})\d{2}(.*)/,
	actualURLYearMonth = actualURL.replace(actualURLRegex,'$2'),
	commentURLs = document.querySelectorAll('.comment .text a'),
	commentURLRegex = new RegExp ('[\?&]utm_source=mandiner&utm_medium=link&utm_campaign=mandiner_' + actualURLYearMonth, 'gi');
for (let commentURL of commentURLs) {
	commentURL.setAttribute('href', commentURL.getAttribute('href').replace(commentURLRegex, ''));
}
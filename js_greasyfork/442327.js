// ==UserScript==
// @name     تحديث تلقائي للإعلانات - haraj.com.sa
// @name:en     haraj.com.sa - Auto Update
// @namespace   https://www.in4sser.com
// @match       *://haraj.com.sa/*
// @grant       none
// @version     1.5.1
// @author      iN4sser
// @grant       GM_addStyle
// @description هذا السكربت سيقوم بتحديث اعلاناتك مباشرة بمجرد الدخول عليها
// @description:en This script will auto-update any post you open in your browser
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/442327/%D8%AA%D8%AD%D8%AF%D9%8A%D8%AB%20%D8%AA%D9%84%D9%82%D8%A7%D8%A6%D9%8A%20%D9%84%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%86%D8%A7%D8%AA%20-%20harajcomsa.user.js
// @updateURL https://update.greasyfork.org/scripts/442327/%D8%AA%D8%AD%D8%AF%D9%8A%D8%AB%20%D8%AA%D9%84%D9%82%D8%A7%D8%A6%D9%8A%20%D9%84%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%86%D8%A7%D8%AA%20-%20harajcomsa.meta.js
// ==/UserScript==

setTimeout(function() {
 Array.prototype.forEach.call(document.getElementsByTagName('button'), function(elem) {
	if (elem.innerHTML.indexOf('تحديث') > -1) {
		document.querySelector("#__next > div > div.px-3.xl\\:px-0.mx-auto.grid.max-w-7xl.grid-cols-1.gap-2.lg\\:grid-cols-4 > div.col-span-full.md\\:col-span-3 > div:nth-child(4) > div > div > button:nth-child(2)").click()
	}
});
}, 2000);
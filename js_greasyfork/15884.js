// ==UserScript==
// @name        Auto.ru del ad-units
// @description Removes ad-units
// @namespace   lainscripts_scissors
// @include     http://auto.ru/*
// @include     https://auto.ru/*
// @include     http://*.auto.ru/*
// @include     https://*.auto.ru/*
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15884/Autoru%20del%20ad-units.user.js
// @updateURL https://update.greasyfork.org/scripts/15884/Autoru%20del%20ad-units.meta.js
// ==/UserScript==

window.setTimeout(
	function check() {
        var a = document.querySelectorAll('.listing-list > .listing-item, .listing-item_type_fixed.listing-item, div[class*="layout_catalog-inline"], .listing > tbody');
var words = /Реклама/;
for (var i=0;i<a.length;i++) if (words.test(a[i].innerHTML))
    a[i].parentNode.removeChild(a[i]);
    window.setTimeout(check, 100);
	}, 100
);

window.setTimeout(
	function check() {
        var a = document.querySelectorAll('.pager-listing + div[class], div[class$="layout_horizontal"], .card > div[class][style], .sidebar > div[class], .main-page__section + div[class]');
var words = /Яндекс.Директ/;
for (var i=0;i<a.length;i++) if (words.test(a[i].innerHTML))
    a[i].parentNode.removeChild(a[i]);
    window.setTimeout(check, 100);
	}, 100
);
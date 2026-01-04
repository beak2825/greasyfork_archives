// ==UserScript==
// @name           AMO View All Versions
// @namespace      http://userscripts.org/users/256199
// @author         NightsoN
// @description    Click addon icon to access version history quickly
// @include        https://addons.mozilla.org/*/firefox/addon/*
// @homepageURL    https://greasyfork.org/scripts/33482
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/33482/AMO%20View%20All%20Versions.user.js
// @updateURL https://update.greasyfork.org/scripts/33482/AMO%20View%20All%20Versions.meta.js
// ==/UserScript==

(function(){
	var id = document.getElementById("addon").getAttribute("data-id");
	var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
	var href = "/" + lang + "/firefox/addon/" + id + "/versions";
	var img = document.getElementById("addon-icon");
	var a = document.createElement("a");
	a.setAttribute("title", "View All Versions");
	a.setAttribute("href", href);
	a.appendChild(img.parentNode.replaceChild(a, img ));
})();
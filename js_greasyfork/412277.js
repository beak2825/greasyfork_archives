// ==UserScript==
// @name         Better Bing Video Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improve Bing video search.
// @author       derac
// @match        *.bing.com/videos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412277/Better%20Bing%20Video%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/412277/Better%20Bing%20Video%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.from(document.getElementsByClassName("mc_vtvc_link")).forEach( (el) => {
        el.setAttribute("href", JSON.parse(el.getElementsByClassName("vrhdata")[0].getAttribute("vrhm")).pgurl);
        console.log(JSON.parse(el.getElementsByClassName("vrhdata")[0].getAttribute("vrhm")).pgurl); });

	let url_path = window.location.href
	if ( ! /duration-long/.test(url_path) ) {
		window.location.replace(url_path + '&qft=+filterui:duration-long') }
})();
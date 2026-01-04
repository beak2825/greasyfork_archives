// ==UserScript==
// @name         Skip Bing Video
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Skips the Bing Video and redirect to the original source.
// @author       derac, edited by GuiAworld
// @match        *.bing.com/*
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/461962/Skip%20Bing%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/461962/Skip%20Bing%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.from(document.getElementsByClassName("mc_vtvc_link")).forEach( (el) => {
        el.setAttribute("href", JSON.parse(el.getElementsByClassName("vrhdata")[0].getAttribute("vrhm")).pgurl);
        console.log(JSON.parse(el.getElementsByClassName("vrhdata")[0].getAttribute("vrhm")).pgurl); });

	let url_path = window.location.href
})();
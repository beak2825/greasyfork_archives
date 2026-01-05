// ==UserScript==
// @name         La dépêche abonné
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  La dépêche en mode abonné
// @author       scodomie
// @match        https://www.ladepeche.fr/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.2.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/18340/La%20d%C3%A9p%C3%AAche%20abonn%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/18340/La%20d%C3%A9p%C3%AAche%20abonn%C3%A9.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function unveilArticle() {
	var elem = window.document.querySelector('div.article-paywall');
	if (elem) {
        elem.style.maxHeight = "99999px";
    }
    delayedLoad();
}

function delayedLoad() {
	window.setTimeout(function() {
		unveilArticle();
	}, 1000);
}

delayedLoad();

// ==UserScript==
// @name RedirectMe
// @name:es RedirectMe
// @description A simple redirection userscript for Youtube.com
// @description:es Un simple userscript de redireccion para youtube.com
// @namespace Backend
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @version 1.0
// @run-at document-start
// @grant none
// @license GPLV3
// @downloadURL https://update.greasyfork.org/scripts/461175/RedirectMe.user.js
// @updateURL https://update.greasyfork.org/scripts/461175/RedirectMe.meta.js
// ==/UserScript==
var a = 0;
const FRONTEND = "poketube.fun"
setInterval(function () {
	if (a === 0 && window.location.href.indexOf('watch?') > -1 && window.location.href.indexOf('list=WL') < 0) {
		a = `//${FRONTEND}/watch?` + window.parent.location.href.split('?')[1];
		window.location.replace(a);
	}
}, 10);

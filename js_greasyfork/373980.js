// ==UserScript==
// @description Redirects golang.org/pkg documentation to godoc.org
// @name GolangDoc redirect
// @namespace Backend
// @include http://golang.org/pkg/*
// @include https://golang.org/pkg/*
// @version 1.0
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/373980/GolangDoc%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/373980/GolangDoc%20redirect.meta.js
// ==/UserScript==
var a = 0;
setInterval(function () {
	if (a === 0 && window.location.href.indexOf('pkg') > -1) {
		a = '//godoc.org/' + window.parent.location.href.split('/pkg/')[1];
		window.location.replace(a);
	}
}, 10);
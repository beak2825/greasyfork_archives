// ==UserScript==
// @name        La Nacion Login
// @namespace   rmGMSites
// @description Quita el login de lanacion.com.ar
// @include     http://lanacion.com.ar/*
// @include     https://lanacion.com.ar/*
// @include     http://www.lanacion.com.ar/*
// @include     https://www.lanacion.com.ar/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23804/La%20Nacion%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/23804/La%20Nacion%20Login.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
	document.getElementsByClassName('lnmodal pantalla-completa login')[0].remove();
}, false);
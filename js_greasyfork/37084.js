// ==UserScript==
// @name           Deref GMX: instant redirection
// @name:de        Deref GMX: sofortige Weiterleitung
// @author         Sebastian
// @description    Redirects automatically and instantly from deref-gmx.net
// @description:de Automatische und sofortige Weiterleitung von deref-gmx.net zur Zielseite
// @namespace      https://greasyfork.org/de/users/165723-sumfui
// @include        https://deref-gmx.net/*
// @version        0.1
// @grant          none
// @run-at         document-start
// @license        CC by-sa http://creativecommons.org/licenses/by-sa/3.0/
// @downloadURL https://update.greasyfork.org/scripts/37084/Deref%20GMX%3A%20instant%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/37084/Deref%20GMX%3A%20instant%20redirection.meta.js
// ==/UserScript==

var url_string = window.location.href;
var url = new URL(url_string);
var c = url.searchParams.get("redirectUrl");
var dec = decodeURI(c);

window.location.replace(dec);
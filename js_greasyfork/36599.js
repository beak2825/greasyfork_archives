// ==UserScript==
// @name        DoodleReplace
// @namespace   http://localhost
// @description Replace the Google Doodle logo with the standard Google logo
// @version     1.0
// @include     http://*.google.*/*
// @include     https://*.google.*/*
// @resource    logo https://www.google.ca/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png
// @grant       GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/36599/DoodleReplace.user.js
// @updateURL https://update.greasyfork.org/scripts/36599/DoodleReplace.meta.js
// ==/UserScript==
var hplogo = document.getElementById('hplogo');
hplogo.innerHTML = '<img style="padding-top: 109px;" src="' +GM_getResourceURL("logo") +'">';
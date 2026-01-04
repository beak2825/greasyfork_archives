// ==UserScript==
// @name         mindjart.megnezed.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       NMyy
// @match        *://mindjart.megnezed.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371392/mindjartmegnezedcom.user.js
// @updateURL https://update.greasyfork.org/scripts/371392/mindjartmegnezedcom.meta.js
// ==/UserScript==

$(document).ready(function() {
    var searchableStr   = document.URL + '&';
    var link  = searchableStr.match (/[\?\&]l=([^\&\#]+)[\&\#]/i) [1];
    link=decodeURIComponent(link);
    location.href=atob(link);
});
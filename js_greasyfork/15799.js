// ==UserScript==
// @name        Fishki.net del post-ads
// @description Removes post-ads
// @namespace   lainscripts_scissors
// @include     http://fishki.net/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15799/Fishkinet%20del%20post-ads.user.js
// @updateURL https://update.greasyfork.org/scripts/15799/Fishkinet%20del%20post-ads.meta.js
// ==/UserScript==

var a = document.querySelectorAll('.main-post');
var words = /543769|Реклама/;
for (var i=0;i<a.length;i++) if (words.test(a[i].innerHTML))
    a[i].parentNode.removeChild(a[i]);
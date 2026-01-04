// ==UserScript==
// @name           xhamsterProfiles
// @namespace      https://userscripts-mirror.org/user
// @description    xHamster show user profiles
// @include        http://xhamster.com/user/*
// @exclude        http://xhamster.com/user/*new-1.html
// @version 0.0.1.20171124105230
// @downloadURL https://update.greasyfork.org/scripts/35626/xhamsterProfiles.user.js
// @updateURL https://update.greasyfork.org/scripts/35626/xhamsterProfiles.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
   var firstPart = 'http://xhamster.com/user/';
   var lastPart = window.location.href.match(/user\/(.*)/)[1];
   window.location.href = firstPart + 'video/' + lastPart + '/new-1.html';
}, false);
// ==UserScript==
// @name         forum.javcdn.pw bypass
// @namespace    https://forum.javcdn.pw/i.imgur.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.javcdn.pw/i.imgur.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420247/forumjavcdnpw%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/420247/forumjavcdnpw%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var oldUrl = window.location.href;
    var newHref= oldUrl.replaceAll('forum.javcdn.pw/', '');
    window.location.href=newHref;
})();
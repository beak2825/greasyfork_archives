// ==UserScript==
// @name         Github ID prefix in title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change "title" to "25: title", where 25 is the id of the PR/issue
// @author       alan
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415823/Github%20ID%20prefix%20in%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/415823/Github%20ID%20prefix%20in%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var url = window.location.href;
    var path_frag = url.split('#');
    var path = path_frag[0];
    var parts = path.split('/');
    if (parts[parts.length-2] == "issues" || parts[parts.length-2] == "pull") {
        var id = parts[parts.length-1];
        var base_title = document.title;
        document.title = id + ": " + base_title;
    }
})();
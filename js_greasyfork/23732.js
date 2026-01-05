// ==UserScript==
// @name         Reklamsız Youtube
// @namespace    http://erdemozveren.com
// @version      0.1
// @description  Reklamsız Bir Youtube.
// @author       ozveren35
// @match        *www.youtube.com/*
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/23732/Reklams%C4%B1z%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/23732/Reklams%C4%B1z%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function(){$(".adDisplay").hide();},2000);
    // Your code here...
})();
// ==UserScript==
// @name         Pastebin auto select Unlisted
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.1.3
// @description  auto selects unlisted when making a paste
// @author       Alistair1231
// @include      https://pastebin.com/edit/*
// @include      https://pastebin.com/clone/*
// @include      https://pastebin.com/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425729/Pastebin%20auto%20select%20Unlisted.user.js
// @updateURL https://update.greasyfork.org/scripts/425729/Pastebin%20auto%20select%20Unlisted.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("postform-status").value=1;
    document.getElementById("select2-postform-status-container").innerHTML="Unlisted";
    // Your code here...
})();
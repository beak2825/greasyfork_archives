// ==UserScript==
// @name         old reddit
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  seamlessly redirect to old.reddit.com
// @author       Tavi
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @run-at       document-start
// @license      BSD0
// @downloadURL https://update.greasyfork.org/scripts/439472/old%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/439472/old%20reddit.meta.js
// ==/UserScript==

(function() {
    var loc = "" + window.location;
    var parts = loc.split('/');
    if (parts.includes("r")) {
        parts.forEach(function(item, i) { if (item == "www.reddit.com") parts[i] = "old.reddit.com"; });
        loc = parts.join('/');
    } else if (parts.length == 3 || (parts.length == 4 && parts[3] == "")) {
        loc = window.location.protocol + "//old.reddit.com";
    } else {
        return
    }
    window.location.replace(loc);
})();
// ==UserScript==
// @name         Today Online De-cancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lmao
// @author       Hengyu
// @match        *://www.todayonline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402713/Today%20Online%20De-cancer.user.js
// @updateURL https://update.greasyfork.org/scripts/402713/Today%20Online%20De-cancer.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    var links = document.getElementsByTagName('link');
    var canonical = ''
    for (var i = 0; i < links.length; i ++) {
        if (links[i].getAttribute("rel") === "canonical") {
            canonical = links[i]
        }
    }
    canonical.parentNode.removeChild(canonical);


})();
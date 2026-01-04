// ==UserScript==
// @name         Steam store wants_mature_content
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Steam Store (Turn on mature content in some region)
// @author       Dogfight360
// @match        http*://store.steampowered.com/
// @icon         http://store.steampowered.com/favicon.ico
// @namespace    https://greasyfork.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428836/Steam%20store%20wants_mature_content.user.js
// @updateURL https://update.greasyfork.org/scripts/428836/Steam%20store%20wants_mature_content.meta.js
// ==/UserScript==

(function() {
    document.cookie="wants_mature_content=1"
    document.cookie="birthtime=22503171"
})();
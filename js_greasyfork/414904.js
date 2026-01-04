// ==UserScript==
// @name         Remove w3schools.com from duckduckgo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A userscript to nuke w3schools links from search results
// @author       You
// @match        https://duckduckgo.com/?q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414904/Remove%20w3schoolscom%20from%20duckduckgo.user.js
// @updateURL https://update.greasyfork.org/scripts/414904/Remove%20w3schoolscom%20from%20duckduckgo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('#links').addEventListener('DOMSubtreeModified',()=>{
        document.querySelectorAll("div[data-domain$='w3schools.com']").forEach((t)=>{
            t.remove()})
    });
})();

// ==UserScript==
// @name         Restore Develop
// @namespace    John R.
// @version      0.1
// @description  Removes Create and replaces it with Develop.
// @author       «John»
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404153/Restore%20Develop.user.js
// @updateURL https://update.greasyfork.org/scripts/404153/Restore%20Develop.meta.js
// ==/UserScript==

(function() {
    'use strict';

var tag = document.querySelector('a[href="https://www.roblox.com/develop"]');
if(tag){
   tag.innerHTML = "Develop";
}
})();

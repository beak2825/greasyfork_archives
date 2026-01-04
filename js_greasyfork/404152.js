// ==UserScript==
// @name         Restore Catalog
// @namespace    «John»
// @version      0.1
// @description  Removes Avatar Shop and replaces it with Catalog.
// @author       «John»
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404152/Restore%20Catalog.user.js
// @updateURL https://update.greasyfork.org/scripts/404152/Restore%20Catalog.meta.js
// ==/UserScript==

(function() {
    'use strict';

var tag = document.querySelector('a[href="https://www.roblox.com/catalog/"]');
if(tag){
   tag.innerHTML = "Catalog";
}
})();

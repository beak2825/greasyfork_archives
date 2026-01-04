// ==UserScript==
// @name         Webnode
// @namespace    https://loutaci.cz/
// @version      0.1
// @description  Detect if site is build on Webnode
// @author       sirluky
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419714/Webnode.user.js
// @updateURL https://update.greasyfork.org/scripts/419714/Webnode.meta.js
// ==/UserScript==

(function() {
    'use strict';
     if(document.querySelector('[name="generator"]').getAttribute('content').match(/webnode/ig)){alert('Je to webnode !!!')}
})();
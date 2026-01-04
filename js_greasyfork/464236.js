// ==UserScript==
// @name         Remove Menu Bar Elements
// @namespace    your-namespace
// @version      1.0
// @description  Removes specified elements from the menu bar
// @match        https://example.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464236/Remove%20Menu%20Bar%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/464236/Remove%20Menu%20Bar%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const menubar = document.querySelector('.m-menubar');
    
    // remove all li elements
    menubar.querySelectorAll('li').forEach(li => li.remove());
})();

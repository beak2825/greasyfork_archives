// ==UserScript==
// @name         Michael Larabel face hider
// @namespace    phoronix.com
// @version      0.2
// @description  Hides Michael Larabel's face from every freaking subpage on Phoronix website.
// @author       bicycle
// @match        https://phoronix.com/*
// @match        https://www.phoronix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31976/Michael%20Larabel%20face%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/31976/Michael%20Larabel%20face%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("about-author").style.display = 'none';
})();
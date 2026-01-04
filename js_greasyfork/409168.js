// ==UserScript==
// @name         Wikipedia Donate Blocker India
// @namespace    https://doctorlife.in/
// @version      0.1
// @description  Block the donation prompts!
// @author       DrGS
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409168/Wikipedia%20Donate%20Blocker%20India.user.js
// @updateURL https://update.greasyfork.org/scripts/409168/Wikipedia%20Donate%20Blocker%20India.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('div.frb').forEach(
        function myFunction(item, index, arr) {item.style.display = "none";}
    )
})();
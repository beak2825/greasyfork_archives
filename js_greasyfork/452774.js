// ==UserScript==
// @name         Genius Instant Old
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Converts new ugly Genius designs to old ones
// @author       You
// @match        *://genius.com/*
// @icon         https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1435674560/mjmgr50tv69vt5pmzeib.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452774/Genius%20Instant%20Old.user.js
// @updateURL https://update.greasyfork.org/scripts/452774/Genius%20Instant%20Old.meta.js
// ==/UserScript==

function getCurrentURL () {
  return window.location.href;
}

// Example
const url = getCurrentURL();

(function() {
    'use strict';

    if (!url.includes("?bagon=1")) {
        window.location.replace(url + "?bagon=1");
    }
})();
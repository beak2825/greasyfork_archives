// ==UserScript==
// @name         Refresh Jubi Cookie
// @namespace    https://www.jubi.com/
// @version      0.1
// @description  Refresh Jubi Cookie every 5 minutes
// @author       ETY001
// @match        https://www.jubi.com/finance*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30562/Refresh%20Jubi%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/30562/Refresh%20Jubi%20Cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){window.location.reload();}, 60*1000*5);
})();
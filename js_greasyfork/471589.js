// ==UserScript==
// @name         Hide Reaction Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the floating reaction button in YouTube livestream chatroom
// @author       Ricky Mo
// @match        https://www.youtube.com/live_chat?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471589/Hide%20Reaction%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/471589/Hide%20Reaction%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("reaction-control-panel").style.display = "none";
    
})();
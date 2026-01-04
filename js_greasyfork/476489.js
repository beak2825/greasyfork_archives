// ==UserScript==
// @name        SkipAuthv1
// @namespace   yumyumyum scripts
// @match       https://auth.segfault.club/
// @grant       none
// @version     1.0
// @author      yumyumyum
// @description Dude, I'm like, not waiting for this to type out. Let. Me. In.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476489/SkipAuthv1.user.js
// @updateURL https://update.greasyfork.org/scripts/476489/SkipAuthv1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function skipTyping() {
        document.getElementById("rules").innerText = document.getElementById("rules").innerText;
        document.getElementById("final").innerText = "";
        document.getElementById("link").className = "";
        const rules = document.getElementById("rules");
        const cmd = document.getElementById("authCmd");
        rules.parentNode.removeChild(rules);
        cmd.parentNode.removeChild(cmd);
    }

    skipTyping();
})();

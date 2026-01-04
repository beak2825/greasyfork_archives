// ==UserScript==
// @name         Volunteer Nexus Exploit
// @namespace    https://app.volunteernexus.com/
// @version      0.1
// @description  try to take over the world!
// @author       nwatx
// @match        https://app.volunteernexus.com/volunteer/opportunity-read.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420478/Volunteer%20Nexus%20Exploit.user.js
// @updateURL https://update.greasyfork.org/scripts/420478/Volunteer%20Nexus%20Exploit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.open("https://app.volunteernexus.com/volunteer/opportunity-read.php?event_id=117&opportunity_id=358");
    window.onload = function() {
        setTimeout(function(){}, 200);
    document.getElementsByClassName('btn')[1].click();
    }
    // Your code here...
})();
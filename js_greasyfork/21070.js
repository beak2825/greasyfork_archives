// ==UserScript==
// @name        Yahoo Mail - Skip Mobile/Cell Number Request
// @namespace   Hydroxides
// @description Skip the request for adding a recovery mobile / cell phone number
// @include     https://edit.yahoo.com/progreg/commchannel?.done=*&skipcpw=1*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21070/Yahoo%20Mail%20-%20Skip%20MobileCell%20Number%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/21070/Yahoo%20Mail%20-%20Skip%20MobileCell%20Number%20Request.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    document.getElementById("skipbtn").click();
}, false);
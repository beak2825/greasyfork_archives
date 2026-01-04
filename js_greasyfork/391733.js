// ==UserScript==
// @name         Thanos Snap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  EOS Everyone
// @author       You
// @match        https://aftlite-na.amazon.com/labor_tracking/find_people
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391733/Thanos%20Snap.user.js
// @updateURL https://update.greasyfork.org/scripts/391733/Thanos%20Snap.meta.js
// ==/UserScript==

var myVar = setInterval(labortrack, 600000);

function labortrack() {
    location.reload
    document.querySelector("input[type='submit']").click();
}

var allInputs = document.getElementsByTagName("input");
for (var i = 0, max = allInputs.length; i < max; i++){
    if (allInputs[i].type === 'checkbox')
        allInputs[i].checked = true;
}
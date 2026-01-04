// ==UserScript==
// @name           Ubik Academy - automatically extend lab time
// @version        0.3
// @namespace      nil
// @author         nil
// @grant          none
// @description    [EN] Extend the time the lab is usable when the timer is below 10 minutes
// @include        https://cyberkube.app/?token=*
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473871/Ubik%20Academy%20-%20automatically%20extend%20lab%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/473871/Ubik%20Academy%20-%20automatically%20extend%20lab%20time.meta.js
// ==/UserScript==

(function nil_greasemonkey_ubik_extendlab() {
  "use strict";
  function checkTimerAndPotentiallyExtendLab() {
    let elt = document.getElementById("timer");
    // "01h : 53m : 35s"
    if (!elt || 9 >= elt.innerText.length) return;
    let remaining_seconds = elt.innerText
				.replace(/[hms\s]/g, "")
         		        .split(':')
    				.map(Number)
    				.reverse()
    				.reduce((acc, elt, idx) => acc + elt * 60**idx, 0);
    // do nothing if more than 10 minutes left (600 seconds)
    if (600 <= remaining_seconds) return;

    let extendBtn = document.getElementById("extend-btn");
    if (!extendBtn) { console.log("#extend-btn element not found"); return; }

    console.log("clicked the extend lab button!");
    extendBtn.click();

    // wait 20 s then refresh the page
    window.setTimeout(() => location.reload(), 20000);
  }
  
  window.setInterval(checkTimerAndPotentiallyExtendLab, 60000);
})();
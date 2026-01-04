// ==UserScript==
// @name         AFR Paywall Remover
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      0.2
// @description  try to take over the world!
// @author       Bunta
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @match        https://www.afr.com/*
// @license      http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393254/AFR%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/393254/AFR%20Paywall%20Remover.meta.js
// ==/UserScript==

// Reset paywall count and refresh
var timedCheck = setInterval(timedFunc, 100);
setTimeout(function(){clearInterval(timedCheck);},10000);

function timedFunc() {
    const payWallCount = localStorage.getItem("ffx:paywallCount");
    if (payWallCount > 1) {
        localStorage.setItem("ffx:paywallCount",0)
        location.reload();
    }
}

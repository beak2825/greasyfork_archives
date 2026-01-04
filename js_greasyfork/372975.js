// ==UserScript==
// @name         Steam auto skip "continue to external site"
// @namespace    https://steamcommunity.com/profiles/76561197991952155
// @version      0.1
// @description  Will automatically click the confirm button when clicking an external link in steamcommunity. Be careful to not click on suspicious links !
// @author       Spychopat
// @match        https://steamcommunity.com/linkfilter/?url=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372975/Steam%20auto%20skip%20%22continue%20to%20external%20site%22.user.js
// @updateURL https://update.greasyfork.org/scripts/372975/Steam%20auto%20skip%20%22continue%20to%20external%20site%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("proceedButton").click();
})();
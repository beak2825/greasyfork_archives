// ==UserScript==
// @name         auto click AtCoder clock once on page load
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      1.0
// @description  to hide the clock
// @author       zica
// @match        https://atcoder.jp/contests/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/499009/auto%20click%20AtCoder%20clock%20once%20on%20page%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/499009/auto%20click%20AtCoder%20clock%20once%20on%20page%20load.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const timer = document.getElementById("fixed-server-timer");
    timer.click();
})();

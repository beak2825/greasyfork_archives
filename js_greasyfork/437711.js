// ==UserScript==
// @name     Train Pally
// @description Trains pally automatically
// @version 1
// @include https://*/game.php?village=*&screen=statue*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/437711/Train%20Pally.user.js
// @updateURL https://update.greasyfork.org/scripts/437711/Train%20Pally.meta.js
// ==/UserScript==

setInterval(function() {
    if (!document.querySelector("#knight_activity > span")) {
        document.querySelector("#knight_actions > div > a").click();
        document.querySelector("#popup_box_knight_regimens > div > div:nth-child(4) > div.actions.center > a:nth-child(1)").click();
    }
    if (parseInt(document.querySelector("[data-endtime]").getAttribute("data-endtime")) <=  Math.round((new Date()).getTime()/1000)) {
        window.location.reload();
    }
}, 1000);
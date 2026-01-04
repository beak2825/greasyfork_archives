// ==UserScript==
// @name         TicketSwap - Reloader
// @version      0.2
// @description  Reload the page till a listing is available
// @author       mr.Jelle-Beat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ticketswap.com
// @match        https://www.ticketswap.com/event/graspop-metal-meeting-2023/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/1022287
// @downloadURL https://update.greasyfork.org/scripts/459483/TicketSwap%20-%20Reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/459483/TicketSwap%20-%20Reloader.meta.js
// ==/UserScript==

var reloadtime = Math.floor(Math.random() * 6824) + 5621;
console.log("reloading in: " + reloadtime);
setTimeout(function () { location.reload(1); }, reloadtime);

var clickme = getItemsV2();
if (clickme !== -1) {
    setTimeout(function () { window.location.href = clickme.href; }, 500);
    clickme.click();
}

function getItemsV2() {
    var listing = $("[data-testid='listing']");
    if (listing.length) {
        return listing[0];
    }
    return -1;
}
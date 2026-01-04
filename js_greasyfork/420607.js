// ==UserScript==
// @name        Ion Storm protection
// @author      Mario Benito
// @copyright   Mario Benito, 2021
// @license     Lesser Gnu Public License, version 2.1
// @homepage	https://github.com/Maberi/planets.nu
// @description Adds ion storm protection level to "more details" ship window (click on ship photo)
// @namespace   maberi/planets.nu
// @include     https://planets.nu/*
// @include     https://*.planets.nu/*
// @include     http://planets.nu/*
// @include     http://*.planets.nu/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/420607/Ion%20Storm%20protection.user.js
// @updateURL https://update.greasyfork.org/scripts/420607/Ion%20Storm%20protection.meta.js
// ==/UserScript==

var ionStormProtectionInfo = function() {
    var html = ionStormProtectionInfo.old_loadMoreMovementDetails.call(this);
    var ship = this.ship;

    // Ion storm protection
    // Ship_Mass + Ship_Experience - 20*(10-Ship_Engine) (in damage points, i.e., percent). This value increases by 50 if unfueled.
    var protection = ship.experience + this.totalmass - 20 * (10 - ship.engineid) - (ship.neutronium == 0 ? 50 : 0);

    $("<div class='lval'><b>Ion protection</b>" + protection + " MeV</div>").appendTo(html);

    return html;
}

ionStormProtectionInfo.loaddashboard = function() {
    if (typeof ionStormProtectionInfo.old_loadMoreMovementDetails === "function") return;

    ionStormProtectionInfo.old_loadMoreMovementDetails = vgap.shipScreen.__proto__.loadMoreMovementDetails;

    vgap.shipScreen.__proto__.loadMoreMovementDetails = ionStormProtectionInfo;
}

if (!GM_info) GM_info = GM.info;

vgap.registerPlugin(ionStormProtectionInfo, GM_info.name);
console.log(name + " v"+GM_info.version+" planets.nu plugin registered");
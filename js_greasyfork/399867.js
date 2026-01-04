// ==UserScript==
// @name         q0 and focus
// @match        https://www.erepublik.com/*/military/battlefield/*
// @description  switch off stingers
// @version      0.2
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/399867/q0%20and%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/399867/q0%20and%20focus.meta.js
// ==/UserScript==

var $ = jQuery;

if (document.getElementsByClassName("aircraft_pvp").length === 0) return;
if ($(".weapon_link,.nolink").length > 0) {
    $(".weapon_link,.nolink")[0].click();
    $("#fight_btn").focus();
}
$('.deployBtn').on('click', function () {
    setTimeout(function () {
        $(".selectWeaponWrapper div").first().click();
    }, 500);
});
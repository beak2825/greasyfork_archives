// ==UserScript==
// @name         Check hotel reservstion (verification) SLT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cms.sletat.ru/Dictionaries/FindClaimsByHotel.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389120/Check%20hotel%20reservstion%20%28verification%29%20SLT.user.js
// @updateURL https://update.greasyfork.org/scripts/389120/Check%20hotel%20reservstion%20%28verification%29%20SLT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hotelId = localStorage.getItem('reservationHotelId');
    if (hotelId > 0) {
        document.querySelector("#body_FilterTextBox").setAttribute("value", hotelId);
        document.querySelector("#body_FilterButton").click();
        localStorage.setItem("reservationHotelId", "0");
    }
})();
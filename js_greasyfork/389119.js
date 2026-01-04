// ==UserScript==
// @name         Check hotel reservstion (button) SLT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cms.sletat.ru/HotelCard.aspx?hotel=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389119/Check%20hotel%20reservstion%20%28button%29%20SLT.user.js
// @updateURL https://update.greasyfork.org/scripts/389119/Check%20hotel%20reservstion%20%28button%29%20SLT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hotelId = window.location.href.replace('https://cms.sletat.ru/HotelCard.aspx?hotel=', '');
    var btnContainer = document.querySelector("#SLT_MenuPanel");
    var checkBtn = document.createElement('a');
    checkBtn.innerHTML = ('<img title="Поиск заявки по отелю" src="https://pngimage.net/wp-content/uploads/2018/06/hotel-booking-icon-png-4.png" style=" width: 48px; height: 48px;">');
    checkBtn.setAttribute("href", "https://cms.sletat.ru/Dictionaries/FindClaimsByHotel.aspx");
    checkBtn.setAttribute("target", "_blank");
    checkBtn.setAttribute("style", "display: block");
    btnContainer.appendChild(checkBtn);
    checkBtn.addEventListener ("click", setReservationHotelId, false);

    function setReservationHotelId() {
        localStorage.setItem("reservationHotelId", hotelId);
    }

})();
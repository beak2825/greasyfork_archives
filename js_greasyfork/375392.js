// ==UserScript==
// @name         Auto Book
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.vebongdaonline.vn/bookTicket
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375392/Auto%20Book.user.js
// @updateURL https://update.greasyfork.org/scripts/375392/Auto%20Book.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ticketPrice = 350000;

    function bookTicket(priceValue) {
        var seat = 2;
        var matchId = 28;
        var data = {};
        data["matchId"] = matchId;
        data["price"] = priceValue;
        data["seat"] = seat;

        $("#stadiumId").val(1);
        $("#matchId").val(28);
        $("#seatValue").val(2);
        $(".chair_match").html("2 vé");
        $("#priceValue").val(priceValue);
        $(".pricePerTicketBill").html("Giá vé: " + priceValue + "VNĐ");

        $.ajax({
            url : "https://www.vebongdaonline.vn/checkValidBookTicket",
            data : JSON.stringify(data),
            type : "POST",
            async: false,
            contentType : "application/json; charset=utf-8",
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
            }
        }).done(function(data) {
            // Check if status OK
            if (data.localeCompare('OK') == 0) {
                console.log("Result: " + data);

                try {
                    sumitForm("selectTicketForm", "checkContinue", event);
                    clearInterval(loopBook);
                } catch(ex) {}

            } else {
                console.log("Result: Het ve");
            }
        }).fail(function () {

        });
    }

    loopBook = setInterval(function(){ bookTicket(ticketPrice); }, 1000);

})();
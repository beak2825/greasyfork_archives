// ==UserScript==
// @name         Popmundo Ticket Price Arranger
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically types in the ticket price while sending show invitations.
// @author       Faun Fangorn
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/InviteArtist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=popmundo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451007/Popmundo%20Ticket%20Price%20Arranger.user.js
// @updateURL https://update.greasyfork.org/scripts/451007/Popmundo%20Ticket%20Price%20Arranger.meta.js
// ==/UserScript==

(function() {
    'use strict';

// You can manually edit your prices from this list.
    const ticketPrices = {
        0: "5",
        1: "6",
        2: "7",
        3: "8",
        4: "9",
        5: "11",
        6: "13",
        7: "15",
        8: "20",
        9: "25",
        10: "30",
        11: "40",
        12: "45",
        13: "50",
        14: "55",
        15: "60",
        16: "65",
        17: "70",
        18: "75",
        19: "80",
        20: "90",
        21: "100",
        22: "105",
        23: "110",
        24: "115",
        25: "120",
        26: "125"
    };

//Set the rider limit to 300000.
    const riderBox = document.querySelector("#ctl00_cphLeftColumn_ctl01_txtRider");
    riderBox.value = "300000";

//Automatically type in the price according to the ticketPrices.
    const ticketBox = document.querySelector("#ctl00_cphLeftColumn_ctl01_txtTicketPrice");
    try {
    const fame = Array.from(document.querySelectorAll("#ppm-content a")).filter((el) => el.href.includes("/World/Popmundo.aspx/Help/Scoring/"))[0].title.split("/")[0];
        ticketBox.value = ticketPrices[fame];
    } catch { ticketBox.value = 5 }

    //Buttons to increase and decrease the prices.
    const buttonPlus = document.createElement("button");
    const buttonMinus = document.createElement("button");
    buttonMinus.style = "background: none;border: none; cursor: pointer;"
    buttonPlus.style = "background: none;border: none; cursor: pointer;"
    buttonPlus.innerText ="➕";
    buttonMinus.innerText ="➖";
    buttonPlus.type = "button";
    buttonMinus.type = "button";
    ticketBox.after(buttonPlus);
    ticketBox.before(buttonMinus);

    buttonPlus.addEventListener("click", function (e) {
ticketBox.value = parseInt(ticketBox.value) + 5;
e.stopPropagation();
});
    buttonMinus.addEventListener("click", function (e) {
        if (ticketBox.value <= 5) {
        ticketBox.value = 0.1;
        }
        else {
ticketBox.value = parseInt(ticketBox.value) - 5;
        }
e.stopPropagation();
});

})();
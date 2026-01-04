// ==UserScript==
// @name         Nova Castelijns Bilet Fiyatı Ayarlama
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @description  Konser davetlerinde bilet fiyatlarını otomatik belirleyin!
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/InviteArtist/*
// @license      MIT
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @downloadURL https://update.greasyfork.org/scripts/529932/Nova%20Castelijns%20Bilet%20Fiyat%C4%B1%20Ayarlama.user.js
// @updateURL https://update.greasyfork.org/scripts/529932/Nova%20Castelijns%20Bilet%20Fiyat%C4%B1%20Ayarlama.meta.js
// ==/UserScript==

(function() {
    'use strict';

// You can manually edit your prices from this list.
    const ticketPrices = {
        0: "0,10",
        1: "5",
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
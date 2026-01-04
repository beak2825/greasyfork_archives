// ==UserScript==
// @name         Laptop Couple Script
// @version      1.2.2
// @description  Laptop Couple Auto Script
// @author       Toni
// @match        http*://cdp.adserver.ai/*
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/380556/Laptop%20Couple%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/380556/Laptop%20Couple%20Script.meta.js
// ==/UserScript==

const sryMsg = "Sorry! This activity is unavailable at this time";

function doStuff() {
    if (document.documentElement.innerText.includes(sryMsg)) {
        var d = new Date()
        if (d.getMinutes() == 30) window.location.reload(false);
    }

    var nextButton = document.getElementsByClassName("btn btn-primary btn-lg");
    var nextButtonClass = nextButton[0].className
    if ((nextButtonClass == "btn btn-primary btn-lg") ||
        (nextButtonClass == "btn btn-primary btn-lg btn-success") ||
        (nextButtonClass == "btn btn-primary btn-lg btn-danger")) nextButton[0].click();
}

setInterval(doStuff, 2500);
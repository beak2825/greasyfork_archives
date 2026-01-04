// ==UserScript==otal
// @name         nCrave Shell 005
// @version      1.7
// @description  nCrave Shell 005 Script
// @author       Toni
// @match        http*://adserver.entertainow.com/promo/*
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/379357/nCrave%20Shell%20005.user.js
// @updateURL https://update.greasyfork.org/scripts/379357/nCrave%20Shell%20005.meta.js
// ==/UserScript==

function doStuff() {
    if (document.documentElement.innerText == "") {
        if (window.location.href.includes("SponsoredVideosTray")) {
            //window.location.href = "https://www.swagbucks.com/watch/sponsored";
        }
        else {
            window.location.reload();
        }
    }
    else {
        var restartBtn = document.getElementById("discoverMore");
        if (restartBtn.style.display != "none") restartBtn.click();
        else {
            var nextBtn = document.getElementById("startEarning");
            var progress = parseInt(document.getElementsByClassName("progress")[0].innerHTML);
            var total = parseInt(document.getElementsByClassName("total")[0].innerHTML)
            if ((nextBtn.innerText == "Start Earning" || nextBtn.innerText == "Next Page" || nextBtn.innerText == "Reopen URL") && progress <= total) nextBtn.click();
            var errMsg = document.getElementsByClassName("inactive-user")[0];
            if (errMsg.style.display != "none" || progress > total) {
                if (window.location.href.includes("utm_medium=activities")) {
                    window.location.href = "https://www.mypoints.com/ncrave";
                }
                else {
                    window.location.href = "https://www.swagbucks.com/watch/sponsored";
                }
            }
            //     var autoBtn = document.getElementsByClassName("playall");
            //     autoBtn.setAttribute("style","");
            //     if (autoBtn.className == "discovery-switch playall") {
            //         autoBtn.
            //     }
        }
    }
}

setInterval(doStuff, 2000)
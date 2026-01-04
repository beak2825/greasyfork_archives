// ==UserScript==
// @name         Daily Crave
// @version      4.1a
// @description  Daily Crave Script
// @author       Toni
// @match        http*://adserver.entertainow.com/promo3/*
// @match        http*://adserver.entertainow.com/encrave_error.html?errorMsg=
// @match        http*://adserver.entertainow.com/encrave_error.html?errorMsg=null
// @grant        none
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/379378/Daily%20Crave.user.js
// @updateURL https://update.greasyfork.org/scripts/379378/Daily%20Crave.meta.js
// ==/UserScript==

const errorURLs = ["https://adserver.entertainow.com/encrave_error.html?errorMsg=",
                  "https://adserver.entertainow.com/encrave_error.html?errorMsg=null"]
function doStuff() {
// Comment this out until Daily Crave is back
//     if (errorURLs.includes(window.location.href)) {
//         var d = new Date();
//         if (d.getHours() == 2) window.location.href = "https://www.swagbucks.com/watch/daily-crave";
//     }
//    else {
//        if (document.documentElement.innerText == "") {
//            window.location.href = "https://www.swagbucks.com/watch/daily-crave";
//        }
//        else {
    var d = new Date();
    var dHour = d.getHours();
    var dMin = d.getMinutes();
    var dSec = d.getSeconds();
    if ([2,6,10,14,18,22].includes(dHour) && dMin == 0 && dSec < 10) {
        window.location.href = "https://www.swagbucks.com/watch/sponsored";
    }
    else {
            if ((document.getElementById("sbWatchHeaderPopup").className.includes("active")) ||
                (document.getElementById("sbWatchHeaderNextTopicTimer") == null &&
                 parseInt(document.getElementById("sbWatchHeaderProgress").style.width.slice(0,-1)) >= 100)) {
                //document.getElementById("sbWatchHeaderNext").firstElementChild.click();
//                if (window.location.href.includes("DailyCrave")) {
//                    window.location.href = "https://www.swagbucks.com/watch/daily-crave";
//                }
//                else {
                    window.location.href = "https://www.swagbucks.com/watch/sponsored";
//                }
            }
            if (document.getElementById("sbWatchHeaderActionReopen").className.includes("active")) {
                document.getElementById("sbWatchHeaderReopen").firstElementChild.click()
            }
            if (document.getElementById("sbWatchHeaderNextTopicTimer") == null) {
                document.getElementsByClassName("sbWatchHeaderThumbButtonBlue")[0].click();
            }
    }
//        }
//    }
};

setInterval(doStuff, 3000);
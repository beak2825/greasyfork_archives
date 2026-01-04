// ==UserScript==
// @name         Sponsored Video Redirect
// @version      3.8a
// @description  Auto redirect to Shell 005
// @author       Toni
// @match        https://www.swagbucks.com/watch/sponsored
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/379358/Sponsored%20Video%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/379358/Sponsored%20Video%20Redirect.meta.js
// ==/UserScript==
const secondTierBoxes = ["Insightful Analysis",
                         "Trending Playlist",
                         "Sparking New Ideas",
                         "24 Hr. Content Just For You",
                         "Quick And Easy SBs",
                         "Business Matters",
                         "Wake Up",
                         "The Road Ahead",
                         "Let's Grow Together",
                         "Beauty"];

function doStuff() {
    var boxes = document.getElementsByClassName("sbTrayListItemHeaderImgContainer");
//    if (boxes.length > 1) {
        var flag1 = true;
        for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].firstElementChild.innerText == "News you can use!") {
                flag1 = false;
                boxes[i].click();
                clearInterval(myVar)
            }
        }
        if (flag1) {
            var flag2 = true;
            for (var j = 0; j < boxes.length; j++) {
                if (secondTierBoxes.includes(boxes[j].firstElementChild.innerText)) {
                    flag2 = false;
                    boxes[j].click();
                    clearInterval(myVar)
                }
            }
            if (flag2) {
                window.location.reload();
            }
//             for (var j = 0; j < boxes.length; j++) {
//                 if (boxes[j].firstElementChild.innerText == "Best Friends") {
//                     boxes[j].click();
//                     clearInterval(myVar)
//                 }
//             }
        }
//    }
}

var myVar = setInterval(doStuff, 5000);
setTimeout(function(){window.close()},45000);
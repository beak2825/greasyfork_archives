// ==UserScript==
// @name         myPoints nCrave Redirect
// @version      2.2
// @description  Auto redirect to Shell 005 on myPoints
// @author       Toni
// @match        https://www.mypoints.com/ncrave*
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/382159/myPoints%20nCrave%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/382159/myPoints%20nCrave%20Redirect.meta.js
// ==/UserScript==
const secondTierBoxes = ["Quick And Easy Points",
                         "Wake Up"];
function doStuff() {
    var boxes = document.getElementsByClassName("ncrave-tile");
    if (boxes.length > 1) {
        var flag1 = true;
        for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].lastElementChild.getAttribute("title") == "News you can use!") {
                flag1 = false;
                boxes[i].click();
                clearInterval(myVar);
            }
        }
        if (flag1) {
            var flag2 = true;
            for (var j = 0; j < boxes.length; j++) {
                if (secondTierBoxes.includes(boxes[j].lastElementChild.getAttribute("title"))) {
                    flag2 = false;
                    boxes[j].click();
                    clearInterval(myVar);
                }
            }
            if (flag2) {
                window.location.reload();
            }
        }
    }
}

var myVar = setInterval(doStuff, 5000);
setTimeout(function(){window.close()},60000);
// ==UserScript==
// @name         Pastebin Improved
// @namespace    https://greasyfork.org/users/166103
// @version      0.41
// @description  Some improvements to Pastebin.com, colored buttons etc.
// @author       https://github.com/Amarok24
// @match        https://pastebin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387337/Pastebin%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/387337/Pastebin%20Improved.meta.js
// ==/UserScript==

(function() {

"use strict";


var pbButtons = document.querySelectorAll(".buttonsm");
var nightModeAdvert = document.getElementById("pro_promo_text");

if (pbButtons) {

    var setButtonStyle = function(innerText, styleNameAndProperty) {
        var indexOfButton = null;

        for (let i = 0; i < pbButtons.length; i++) {
            if (pbButtons[i].innerText == innerText) {
                indexOfButton = i;
                break;
            }
        }

        if (indexOfButton !== null) {
            console.log("button found, index = " + indexOfButton);

            for (let z=0; z<styleNameAndProperty.length; z++) {
                for (let j in styleNameAndProperty[z]) {
                    //console.log(j);
                    //console.log(styleNameAndProperty[z][j]);
                    pbButtons[indexOfButton].style[j] = styleNameAndProperty[z][j];
                }
            }

        }
    };

    setButtonStyle("edit", [ {"backgroundColor" : "coral"}, {"fontWeight" : "700"}, {"color" : "white"} ] );
    setButtonStyle("raw", [ {"backgroundColor" : "darkgreen"}, {"color" : "white"} ] );
}

if (nightModeAdvert && nightModeAdvert.innerText.indexOf("Night")) {
    document.getElementById("float-box-frame").style.display = "none";
}

})();
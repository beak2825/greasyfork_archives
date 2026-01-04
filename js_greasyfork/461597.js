// ==UserScript==
// @name         Text Resize
// @namespace    Proba
// @version      0.1
// @description  Make text resizeable
// @author       Andreyka_MD
// @grant        GM_addStyle
// @match *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461597/Text%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/461597/Text%20Resize.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var increaseButton = document.createElement("button");
    increaseButton.innerHTML = "MAX";
    increaseButton.onclick = increaseTextSize;
    increaseButton.id = "text-resizer-increase-button";
    var decreaseButton = document.createElement("button");
    decreaseButton.innerHTML = "MIN";
    decreaseButton.onclick = decreaseTextSize;
    decreaseButton.id = "text-resizer-decrease-button";
    document.body.appendChild(increaseButton);
    document.body.appendChild(decreaseButton);

    increaseButton.style.position = "fixed";
    increaseButton.style.opacity = "0.5";
    increaseButton.style.top = "50%";
    increaseButton.style.right = "50px";
    increaseButton.style.transform = "translate(50%, -50%)";
    increaseButton.style.padding = "10px";
    increaseButton.style.fontSize = "20px";
    increaseButton.style.backgroundColor = "#fff";
    increaseButton.style.color = "#000";
    increaseButton.style.border = "1px solid #000";
    increaseButton.style.borderRadius = "5px";
    increaseButton.style.zIndex = "99999";
    increaseButton.style.cursor = "pointer";
    increaseButton.style.transition = "all 0.2s ease-in-out";

    decreaseButton.style.opacity = "0.5";
    decreaseButton.style.position = "fixed";
    decreaseButton.style.top = "calc(50% + 50px)";
    decreaseButton.style.right = "50px";
    decreaseButton.style.transform = "translate(50%, -50%)";
    decreaseButton.style.padding = "10px";
    decreaseButton.style.fontSize = "20px";
    decreaseButton.style.backgroundColor = "#fff";
    decreaseButton.style.color = "#000";
    decreaseButton.style.border = "1px solid #000";
    decreaseButton.style.borderRadius = "5px";
    decreaseButton.style.zIndex = "99999";
    decreaseButton.style.cursor = "pointer";
    decreaseButton.style.transition = "all 0.2s ease-in-out";

    function increaseTextSize() {
        var allTextElements = document.querySelectorAll("*:not(#text-resizer-increase-button):not(#text-resizer-decrease-button)");
        for (var i = 0; i < allTextElements.length; i++) {
            var computedStyle = window.getComputedStyle(allTextElements[i]);
            var fontSize = parseInt(computedStyle.fontSize);
            var lineHeight = parseInt(computedStyle.lineHeight);
            var newFontSize = fontSize + 2;
            var newLineHeight = lineHeight + 2;
            allTextElements[i].style.fontSize = newFontSize + "px";
            allTextElements[i].style.lineHeight = newLineHeight + "px";
        }
    }

    function decreaseTextSize() {
        var allTextElements = document.querySelectorAll("*:not(#text-resizer-increase-button):not(#text-resizer-decrease-button)");
        for (var i = 0; i < allTextElements.length; i++) {
            var computedStyle = window.getComputedStyle(allTextElements[i]);
            var fontSize = parseInt(computedStyle.fontSize);
            var lineHeight = parseInt(computedStyle.lineHeight);
            var newFontSize = fontSize - 2;
            var newLineHeight = lineHeight - 2;
            allTextElements[i].style.fontSize = newFontSize + "px";
            allTextElements[i].style.lineHeight = newLineHeight + "px";
        }
    }

})();
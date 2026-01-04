// ==UserScript==
// @name         Krunker.io Sky Color Changer
// @namespace    Made For Krunker.io / BrowserFPS.com
// @version      0.0.1
// @description  A sky changer for Krunker.io. Comes with a built-in GUI.
// @author       Noahantix#8270
// @match        *://krunker.io/*
// @match        https://*.browserfps.com/*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429046/Krunkerio%20Sky%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/429046/Krunkerio%20Sky%20Color%20Changer.meta.js
// ==/UserScript==

// This script is inspired by SkidLamer's original color picker
// script. This script includes a GUI in the bottom right so you
// can easily apply a new sky color and refresh the game.

if(window.localStorage.getItem("SkyColor") == null) {
    window.localStorage.setItem("SkyColor", "#000000");
}
else {
    Object.defineProperty(Object.prototype, "skyC", {
        enumerable: false,
        get() {
            return window.localStorage.getItem("SkyColor");
        }
    })
}

var MenuHTML = `<input type=color id="ColorPick" name="ColorPicker"></input> <label for="ColorPicker" style="color: white">Sky Color</label>`
var AppendHTMLElement = window.document.createElement("ColorPickAppend");
AppendHTMLElement.innerHTML = MenuHTML;
window.document.getElementById("termsInfo").appendChild(AppendHTMLElement);

document.getElementById("ColorPick").addEventListener("change", PickerWatch, false);

function PickerWatch(Event) {
    try {
        window.localStorage.setItem("SkyColor", Event.target.value);

        if(window.confirm("Would you like to refresh the page to see your changes?") == true) {
            window.location.assign("https://krunker.io/");
        }
        else {
            return;
        }
    }
    catch {
        console.log("Color picker failed to apply local change to storage.");
    }
}
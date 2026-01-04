// ==UserScript==
// @name         Fix Light/Dark Mode Formatting
// @namespace    http://tampermonkey.net/
// @version      2025-08-17-0
// @description  Removes Lightmode/Darkmode Background leftover from copy & pasting when on the other Mode
// @author       gaylie
// @match        https://xcreativeclashx.net/*
// @exclude      https://xcreativeclashx.net/forums/topic/*/?do=edit*
// @exclude      https://xcreativeclashx.net/submissions/*/*/?do=form*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xcreativeclashx.net
// @grant        none
// @run-at       document-start
// @license      GNU AGPLv3
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/538224/Fix%20LightDark%20Mode%20Formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/538224/Fix%20LightDark%20Mode%20Formatting.meta.js
// ==/UserScript==

$(document).ready(function() {
    var colorcodes = {
        lightHex: "#c6dfe1",
        lightRGB: "rgb(198,223,225)",
        darkHex: "#2d3037",
        darkRGB: "rgb(45,48,55)",
        darkHexAU: "#30333b",
        darkRGBAU: "rgb(48,51,59)",
    }

    for (let key in colorcodes) {
        var style = '[style*="background-color:' + colorcodes[key] + '"]';
        $('.cPost_contentWrap '+style).css({"background-color": "", "color": ""});
    }
});

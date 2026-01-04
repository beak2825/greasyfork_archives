// ==UserScript==
// @name         Pornhub Toggle Premium
// @namespace    https://greasyfork.org/users/45933
// @version      0.1.1
// @author       Fizzfaldt
// @description  Keyboard shortcut to toggle between regular pornhub and premium
// @run-at       document-start
// @grant        none
// @noframes
// @match        *://*.pornhub.com/*
// @match        *://*.pornhubpremium.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441942/Pornhub%20Toggle%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/441942/Pornhub%20Toggle%20Premium.meta.js
// ==/UserScript==

// Useful things:
//&& e.altKey
//&& e.shiftKey
//&& e.ctrlKey
function pornhub_toggle(e) {
    if (!e.ctrlKey) {
        return;
    }
    if (!e.shiftKey) {
        return;
    }
    switch (e.code) {
        case "ArrowUp":
            var newref;
            // location.href or document.URL? Both seem to work for READING
            if (document.URL.indexOf("pornhub.com") > -1) {
                newref = location.href.replace('pornhub.com', 'pornhubpremium.com');
            } else if (document.URL.indexOf("pornhubpremium.com") > -1) {
                newref = location.href.replace('pornhubpremium.com', 'pornhub.com');
            } else {
                alert("Does not match either pornhub site");
                return;
            }
            console.log("Switching from  ", document.URL, "to", newref);
            location.href = newref;
            break;
        default:
            break;
    }
}
if (document.URL != location.href) {
    alert("Document.URL [" + document.URL + "[ does not match location.href [" + location.href + "]");
}
document.addEventListener('keyup', pornhub_toggle, false);

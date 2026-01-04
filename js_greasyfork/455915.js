// ==UserScript==
// @name         no black
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  web no black
// @author       You
// @match        http://*/*
// @match        https://*/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455915/no%20black.user.js
// @updateURL https://update.greasyfork.org/scripts/455915/no%20black.meta.js
// ==/UserScript==

(function() {
    document.querySelector("html").style.filter = "none"
    document.querySelector("body").style.filter = "none"
    document.querySelectorAll(".big-event-gray").forEach( item => {
        item.style.filter="none"
    })
    document.querySelectorAll(".water-container").forEach( item => {
        item.style.filter="none"
    })
    // Your code here...
})();
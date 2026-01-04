// ==UserScript==
// @name         u.gg auto press profile update.
// @namespace    http://u.gg/
// @version      1.0
// @description  Automatically presses the update button upon loading the profile page.
// @author       Dolyfin
// @match        https://u.gg/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445373/ugg%20auto%20press%20profile%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/445373/ugg%20auto%20press%20profile%20update.meta.js
// ==/UserScript==

setTimeout(function() {
    document.getElementsByClassName("update-button")[0].click()
}, 1000)
setTimeout(function() {
    document.getElementsByClassName("update-button")[0].click()
}, 2000)
setTimeout(function() {
    document.getElementsByClassName("update-button")[0].click()
}, 4000)
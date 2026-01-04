// ==UserScript==
// @name         CDA Charter Grades Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script will aid in giving the CDA Charter grade portal a dark theme. To complete the look, please install this Stylish script:
// @author       Matthew Barrett
// @match        https://www.cdacharter.org/onlinegrades/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398482/CDA%20Charter%20Grades%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/398482/CDA%20Charter%20Grades%20Dark%20Theme.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setstyle() {
    await sleep(500)
    document.getElementById("title").style.color = "white"
    document.getElementById("maincontent").style.color="white"
    for (var b = 0; b < document.getElementsByTagName("a").length; b++) {
        document.getElementsByTagName("a")[b].style.color = "white"
    }
}
setstyle()

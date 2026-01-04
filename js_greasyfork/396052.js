// ==UserScript==
// @name         Wikipedia Drug invert
// @namespace    http://srsutherland.dev
// @version      2020.07.18
// @description  Invert Skeletal formula on wiki pages using Template:Chembox or Template:drugbox (for dark mode)
// @author       srsutherland
// @match        *://en.wikipedia.org/wiki/*
// @match        *://www.wikipedia.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396052/Wikipedia%20Drug%20invert.user.js
// @updateURL https://update.greasyfork.org/scripts/396052/Wikipedia%20Drug%20invert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Looking for drug infobox")
    //infoboxes should have one of these links
    const boxURLs = [
        {url:"/wiki/IUPAC_nomenclature_of_chemistry", box:"Template:drugbox"},
        {url:"/wiki/Chemical_nomenclature", box:"Template:Chembox"},
        {url:"/wiki/CAS_Registry_Number", box:"Template:drugbox or Template:Chembox"}
    ]
    let boxfound = false;
    for (let item of boxURLs) {
        if (document.querySelector(`.infobox a[href="${item.url}" i]`)) {
            boxfound = true;
            console.log(`Found ${item.box}`)
            break;
        }
    }
    if (boxfound) {
        let skeleton = document.querySelector('.infobox img[src*=".svg" i]')
        if (skeleton) {
            console.log("found skeleton svg")
            skeleton.style.filter = "invert(100%)"
        } else {
            console.log("Could not find skeleton SVG")
        }
    } else {
        console.log("No drugbox or chembox found")
    }
})();

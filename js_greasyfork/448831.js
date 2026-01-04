// ==UserScript==
// @name         AO3: [Wrangling] Show bin count change!
// @description  Show changes in the number of works in your bins!
// @version      1.0.0

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tag_wranglers/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/448831/AO3%3A%20%5BWrangling%5D%20Show%20bin%20count%20change%21.user.js
// @updateURL https://update.greasyfork.org/scripts/448831/AO3%3A%20%5BWrangling%5D%20Show%20bin%20count%20change%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const array = f => Array.prototype.slice.call(f, 0)

    //Checks if using dark mode
    const darkmode = window.getComputedStyle(document.body).backgroundColor == 'rgb(51, 51, 51)'

    let increased_count_color
    let decreased_count_color

    if (darkmode) {
        increased_count_color = "salmon"
        decreased_count_color = "limegreen"
    } else {
        increased_count_color = "brown"
        decreased_count_color = "CornflowerBlue"
    }

    //adds button to page
    const unwrangled_label = document.querySelector("#user-page > div.assigned.module > p");
    const btn = document.createElement("button")
    btn.innerText = "Show bin changes"
    btn.style.fontSize = "0.627rem"
    btn.style.float = "left"
    btn.style.marginTop = "5px";
    btn.style.marginBottom = "10px";
    var br = document.createElement("br");

    unwrangled_label.appendChild(document.createElement("br"))
    unwrangled_label.appendChild(btn)

    //Calculates the difference between two numbers, and sets the resulting text color based on that
    const calcDifference = function showdif(oldcount, newcount) {
        if (isNaN(oldcount) || isNaN(newcount)) {
            return null
        }
        if (oldcount == newcount) {
            return null
        }
        if (newcount > oldcount) {
            return ["+" + (newcount - oldcount), increased_count_color]
        }

        return [(newcount - oldcount), decreased_count_color]
    }

    //When button is clicked
    btn.addEventListener("click", function(e) {
        e.preventDefault()

        //gets all the unwrangled bins
        const currentbins = array(document.getElementsByTagName("td"))

        for (const bin of currentbins) {
            //eg like this: Fable SMP_unwrangled characters
            const key = bin.parentElement.firstElementChild.innerText + "_" + bin.title;

            //If the bin's info hasn't been saved by the user before, we will set the old value as 0
            const old_value = GM_getValue(key) || 0;

            //If the bin is empty, set the new value as 0
            const new_value = bin.innerText || 0;

            //Saves the current bin info across session use
            //https://wiki.greasespot.net/GM.setValue
            //On tapermonkey, you can see the info saved by opening the script and clicking storage!
            GM_setValue(key, new_value)

            const span = document.createElement("span")

            const resultcalc = calcDifference(parseInt(old_value), parseInt(new_value))
            if (resultcalc == null) {
                continue;
            }

            //Un-comment out for debugging
            //console.log(key + " - oldvalue: " + old_value + " newvalue: " + bin.innerText)

            //Adds and formats the bin change text
            const textbeginning = document.createTextNode(" (");
            const textToAdd = document.createTextNode(resultcalc[0])
            const textend = document.createTextNode(")");
            span.style.color = resultcalc[1];
            span.appendChild(textbeginning);
            span.appendChild(textToAdd);
            span.appendChild(textend);
            bin.appendChild(span);
        }

        unwrangled_label.removeChild(btn)
    });

    // Your code here...
})();
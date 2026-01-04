// ==UserScript==
// @name         AO3: [Wrangling] Random Bin Button!!
// @description  because what wrangler doesn't need a lil fun in their lives ;)
// @version      1.0.3

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tag_wranglers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445983/AO3%3A%20%5BWrangling%5D%20Random%20Bin%20Button%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/445983/AO3%3A%20%5BWrangling%5D%20Random%20Bin%20Button%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const array = f => Array.prototype.slice.call(f, 0)

    //adds random bin button to page
    const unwrangled_label = document.querySelector("#user-page > div.assigned.module > table > thead > tr > th:nth-child(3)");
    const btn = document.createElement("button")
    btn.innerText = "Random bin"
    btn.style.fontSize = "0.627rem"
    btn.style.float = "right"
    unwrangled_label.appendChild(btn)

    let t = 10 //time between each bin selected during the choosing bin animation loop
    let last = null //last bin selected by the choosing bin animation loop (not neccessarily the final winning bin)
    let interval = null; //interval winning bin will pulse at
    let choosing = false; //If button animation is curently ongoing

    //When button is clicked
    btn.addEventListener("click", function(e) {
        //Don't let user click button while our animation is already ongoing
        if (choosing) {
            return;
        }
        choosing = true;
        //resetting anything changed from previous random bin click
        t = 10;
        if (interval != null) {
            clearInterval(interval)
        }
        if (last != null) {
            last.style.backgroundColor = ""
        }
        e.preventDefault()

        //gets all the unwrangled bins (that aren't empty)
        const l = array(document.getElementsByTagName("td")).filter(o => o.title.indexOf("unwrangled") != -1 && o.children.length > 0)

        //let the games begin !!! may the odds be ever in your favor
        const fun = function fun() {
            //This makes the animation get slower and slower (by a factor of 1.4 times slower each loop)
            //So the closer we get to having selected our winning random bin, the longer the currently selected bin is highlighted
            t = t * 1.4

            //Resets the last bin that was temporarily highlighted in the 'choosing bin' animation'
            if (last != null) {
                last.style.backgroundColor = ""
            }

            //Selects the next random unwrangled bin to temporarily highlight in the 'choosing bin' animation', which is highlighted yellow
            last = l[Math.round(Math.random() * (l.length - 1))]
            last.style.backgroundColor = "yellow"

            //The first bin highlighed for more than 500 ms is our winner!
            if (t > 500) {
                //From then on, every 500 ms, the winning bin will pulse between yellow and lime to indicate the victor status
                interval = setInterval(() => {
                    last.style.backgroundColor = last.style.backgroundColor == "lime" ? "yellow" : "lime";
                }, 500);
                choosing = false;
            } else {
                //If the 'random bin' animation hasn't stayed on a bin for 500+ ms yet, we will loop this so that the animation continues
                //Waits t ms until the next iteration of the animation
                //Since we are increasing t each time we loop, this will make the animation get slower and slower
                setTimeout(fun, t)
            }
        }
        //What calls our fun function the first time
        setTimeout(fun, t);
    });

    // Your code here...
})();
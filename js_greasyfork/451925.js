// ==UserScript==
// @name         AO3: Sample character tag scraper!
// @description  Grabs every single char tag used by fics that you page through!
// @version      1.0.0

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/*TwoSet*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/451925/AO3%3A%20Sample%20character%20tag%20scraper%21.user.js
// @updateURL https://update.greasyfork.org/scripts/451925/AO3%3A%20Sample%20character%20tag%20scraper%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //I needed to grab a list of every single character tag used by works in the twoset violin
    //fandom, which had just recently been split off as its own fandom from Vlogging.
    //So I wrote this!
    //Everytime I page through a page of twoset fics (see the @match in the URL), this will
    //grab all the char tags on that page of results and save the unique ones
    //Then, on the last page of twoset fics, it pops up the resulting tag list!
    //So all I had to do was click through the 100ish pages of TwoSet works and then this script
    //did all the rest!

    //A couple of notes:
    //1) This is not a script I'd want always-on, after scraping the data be sure to disable the script again!
    //2) The data saved across page to page is not "reset" after it's displayed on the last page -
    //   In order to reset that, click the "Storage" tab on the top of this script in tapermonkey
    //   (next to the Editor and Settings tab), and manually change it to be {}
    //3) If you are wanting to make your own version of this script from scratch, be sure
    //   to include the @grant lines (lines 9-10), it's easy to overlook but this script
    //   won't work without those!
    //4) Also don't forget to change the @match statement to your needs!!
    //5) Feel free to ping me if you have questions, @owlwinter8 :)

    //Converts the document.querySelectorAll() results into an array
    const array = f => Array.prototype.slice.call(f, 0)

    var key = "twoset_chardict";
    let chartags;

    if (GM_getValue(key) == null) {
        //If there isn't any old data saved, we start fresh!
        chartags = new Set();
    } else {
        //If there is old data saved, we fetch it
        var raw = GM_getValue (key, null)
        var lessraw = JSON.parse(raw) || {};
        chartags = new Set(lessraw);
    }

    const worksOnPage = array(document.querySelectorAll("li.work"))
    //For each work on the page
    for (let a of worksOnPage) {
        //Grabs the character tags
        //If you want to, you could collect multiple tag types into multiple lists!
        let chars = array(a.querySelectorAll(".characters"))
        for (let b of chars) {
            let chartag = b.innerText;

            //Saves the ones we haven't seen before
            if (!chartags.has(chartag)) {
                chartags.add(chartag)
            }
        }
    }

    //Saves the dictionary data across pages
    //https://wiki.greasespot.net/GM.setValue
    //On tapermonkey, you can see the info saved by opening the script and clicking storage!
    var arrayeddata = Array.from(chartags)
    var formatteddata = JSON.stringify(arrayeddata)
    GM_setValue(key, formatteddata);

    //If on the last page of results, show them off~!!
    if (document.querySelector(".next .disabled") != null) {
        // for some reason this seems to always be present on the page, even if there is no content in it
        var flash = document.getElementsByClassName("flash")[0]
        flash.innerHTML = "";
        flash.classList.add("notice")

        flash.appendChild(document.createTextNode("The following tags were collected: "));
        var spacer = ""
        for (var tag of arrayeddata) {
            flash.appendChild(document.createTextNode(spacer + "\u000a"))
            const url_safe_tag = tag.replace("/", "*s*").replace(".", "*d*").replace("#", "*h*").replace("?", "*q*");
            const taga = document.createElement("a")
            taga.href = "/tags/" + url_safe_tag; // fingers crossed
            taga.target = "_blank"
            taga.innerText = tag;
            flash.appendChild(taga);
            spacer = ", "
        }
    }

})();
// ==UserScript==
// @name         [AO3] Fanfic Intensity Rating
// @namespace    https://greasyfork.org/en/users/1138163-dreambones
// @version      1.0
// @description  Colors the backgrounds of fanfics based on intensity of warnings, ratings and additional tags.
// @author       DREAMBONES
// @match        http*://archiveofourown.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      Can modify w/credit.
// @downloadURL https://update.greasyfork.org/scripts/471962/%5BAO3%5D%20Fanfic%20Intensity%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/471962/%5BAO3%5D%20Fanfic%20Intensity%20Rating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ONLY alter the numbers for this section.
    var mainTags = {
        "General Audiences": 0,
        "Teen And Up Audiences": 1,
        "Mature": 3,
        "Explicit": 6,
        "Not Rated": 0,

        "No Archive Warnings Apply": 0,
        "Choose Not To Use Archive Warnings": 0,
        "Graphic Depictions Of Violence": 2,
        "Major Character Death": 2,
        "Rape/Non-Con": 5,
        "Underage": 4
    }

    // Add or alter any keys in this section. Matches via regex, but all special characters are escaped before matched.
    var freeformTags = {
        "Transphob": 3, //-e, -ia, -ic
        "Homophob": 3, //-e, -ia, -ic
        "Racis": 3, // -ism, -ist
        "Bigot": 3,
        "Dead Dove: Do Not Eat": 4,
        "Suicide": 5,
        "Child Abuse": 3,
        "Self-Harm": 3,
        "Drug Use": 1,
        "Torture": 3,
        "Horror": 1,
        "Drinking": 1,
        "Blood": 2,
        "Death": 2,
        "PTSD": 2,
        "Angst": 1,
        "Slurs": 2,
        "Kidnapping": 1
    }

    var whitelist = []; // Tags will not count towards intensity rating if they're included here. NOT regex based match.

    // Tweak the threshold for fanfic rating highlights.
    var harmless = 2; // Anything lower than or equal to.
    var intense = 6; // Anything higher than or equal to.
    var extreme = 12; // Anything higher than or equal to.

    var domainRe = /https?:\/\/archiveofourown\.org\/(works|tags|users).*/i
    var pageType = document.URL.match(domainRe)[1];
    if (domainRe.test(document.URL)) {
        var worksQuery = "ol.work.index.group, ul.index.group, #user-series > ol.index.group"
        var worksList = document.querySelectorAll(worksQuery);
        for (let section of worksList) {
            for (let work of section.children) {
                var pts = 0;
                var ptList = [];

                var tempDict = Object.assign({}, freeformTags);

                var reqTags = work.querySelector(".required-tags").children;
                var rating = reqTags[0].firstElementChild.firstElementChild.firstElementChild.innerHTML;
                var warnings = (reqTags[1].firstElementChild.firstElementChild.firstElementChild.innerHTML).split(", ");
                var freeforms = work.querySelectorAll("li.freeforms > a");

                pts += mainTags[rating];
                if (mainTags[rating] != 0) {ptList.push(rating + ": " + mainTags[rating]);}
                for (let tag of warnings) {
                    pts += mainTags[tag];
                    if (mainTags[tag] != 0) {ptList.push(tag + ": " + mainTags[tag]);}
                }
                for (let tag of freeforms) {
                    var keys = Object.keys(tempDict);
                    for (var key of keys) {
                        var cleanKey = escapeRegExp(key);
                        var tagRe = new RegExp(cleanKey, "i");
                        if (tagRe.test(tag.innerHTML) && !(whitelist.includes(tag.innerHTML))) {
                            pts += tempDict[key];
                            if (tempDict[key] != 0) {ptList.push(tag.innerHTML + ": " + tempDict[key]);}
                            delete tempDict[key]; // Tags are only counted once to avoid racking up points for dupes.
                        }
                    }
                }


                var info = document.createElement("a");
                if (ptList.length) {info.title = ptList.join("\n");}
                else {info.title = "Nothing to report!";}
                info.innerHTML = "Intensity: " + pts;
                info.style.position = "absolute";
                var authorActions = work.querySelector("ul.actions, p.actions");
                if (!authorActions) {info.style.left = "10px";}
                else {info.style.left = `${authorActions.offsetWidth + 15}px`;}
                info.style.opacity = "0.5";
                info.style.padding = "0px"
                info.style.cursor = "help";
                var stats = work.querySelector("dl.stats");
                stats.insertBefore(info, stats.firstElementChild);
                // Change the values for background colors via hex color codes or color shorthands (like "red").
                if (pts <= harmless) {
                    work.style["background-color"] = "#1A5432"; // Low intensity (green).
                }
                else if (harmless < pts && pts < intense) {
                    work.style["background-color"] = "#626123"; // Medium intensity (yellow).
                }

                else if (intense <= pts && pts < extreme) {
                    work.style["background-color"] = "#581E1F"; // High intensity (red).
                }

                else if (pts >= extreme) {
                    work.style["background-color"] = "#160723"; // Extreme intensity (black).
                }
            }
        }
    }

    // https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
    function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
})();
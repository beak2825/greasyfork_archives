// ==UserScript==
// @name         PTP Box Office Detector
// @namespace    PTPBOD_HostileThingy
// @version      0.1
// @description  Finds a film's box office information when possible
// @author       HostileThingy
// @include      https://passthepopcorn.me/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37027/PTP%20Box%20Office%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/37027/PTP%20Box%20Office%20Detector.meta.js
// ==/UserScript==

/*****************
 * AUTHOR'S NOTE *
 *****************
 * Howdy! This script is designed for fetching box office information for any
 * given movie being viewed on PassThePopcorn. It does this by attempting to
 * determine the Wikipedia page for the movie and using whatever information
 * Wikipedia generously provides. This is done over using IMDB or BoxOfficeMojo
 * because those sites are served strictly over HTTP and cannot be retrieved
 * from PassThePopcorn's strict HTTPS pages via Ajax, which is how it has to
 * be done to the best of my knowledge.
 *
 * This script is surely not perfect and will need much refinement as more
 * eyes are on it. Please send any feedback my way; if you've found this
 * script, I'll assume you know where to reach me.
 *
 * Have a marvelous day!
 * 
 * - Hostile
 */

/***********
 * OPTIONS *
 ***********/

// tbd

/*****************
 * FUNCTIONALITY *
 *****************/

// Entry function, no return value due to asyncronosity
function findTitle(title, year) {
    $.ajax({
        type: 'GET',
        url: 'https://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            search: title,
            action: 'opensearch',
            format: 'json',
            formatversion: 2,
            namespace: 0,
            limit: 10,
            suggest: true
        },
        success: function(data) {
            if (data[1].length === 0) { return; }

            var options = data[1];
            var descriptions = data[2];
            var urls = data[3];

            var retrieving = false;

            for (var i in options) {
                // Prevent non-film results
                if (options[i].endsWith("(character)")
                      || options[i].endsWith("(soundtrack)")
                      || options[i].endsWith("(play)")
                      || options[i].endsWith("(disambiguation)")
                      || options[i].endsWith("(novel)")) {
                    continue;
                }
                if ((options[i].indexOf("film") > -1 || descriptions[i].indexOf("film") > -1) && descriptions[i].indexOf("" + year) > -1) {
                    if (options[i].indexOf("" + year) > -1 && options[i].indexOf("film") === -1) {
                        continue;
                    }
                    retrieving = true;
                    getBoxOfficeData(options[i]);
                }
            }

            if (!retrieving) {
                getBoxOfficeData(options[0]);
            }
        }
    });
}

// Takes decided upon suggestion and gets that title's box office data
// Takes Wikipedia title as the paramter
function getBoxOfficeData(title) {
   $.ajax({
        type: 'GET',
        url: 'https://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            titles: title,
            action: 'query',
            format: 'json',
            rvprop: 'content',
            rvsection: 0,
            prop: 'revisions'
        },
        success: function(data) {
            var infobox = data.query.pages[Object.keys(data.query.pages)[0]].revisions[0]['*'];
            
            // Check for redirect page
            if (infobox.startsWith("#REDIRECT [[")) {
                var newTarget = infobox.substr(12);
                newTarget = newTarget.substr(0, newTarget.length - 2);
                getBoxOfficeData(newTarget);
                return;
            }

            infobox = infobox.split("\n");
            
            var budgetRaw = "";
            var budget = "";
            var grossRaw = "";
            var gross = "";

            // TODO: Clean this mess up, ffs drunk me
            for (var i in infobox) {
                if (infobox[i].startsWith("| budget")) {
                    if (infobox[i].toLowerCase().indexOf("{{plainlist|") !== -1) {
                        var j = parseInt(i) + 1;
                        while (j < infobox.length && infobox[j].startsWith("* ")) {
                            infobox[i] += infobox[j];
                            j++;
                        }
                    }
                    budgetRaw = infobox[i];
                } else if (infobox[i].startsWith("| gross")) {
                    if (infobox[i].toLowerCase().indexOf("{{plainlist|") !== -1) {
                        var j = parseInt(i) + 1;
                        while (j < infobox.length && infobox[j].startsWith("* ")) {
                            infobox[i] += infobox[j];
                            j++;
                        }
                    }
                    grossRaw = infobox[i];
                }
            }

            // Remove any nbsp characters
            budgetRaw = budgetRaw.replace("{{nbsp}}", " ").replace("&nbsp;", " ");
            grossRaw = grossRaw.replace("{{nbsp}}", " ").replace("&nbsp;", " ");

            // The following clusterfuck of a regex was put together by trial
            // and error after analyzing many Wikipedia infobox budget and
            // box office numbers. It's probably not perfect and will be,
            // I suspect, the part of this script that needs the most
            // refinement over time.
            budget = budgetRaw.match(/(\$|£|€|₹)\d+((,\d{3})+|(\.\d+))?(–\d+((,\d{3})+|(\.\d+))?)? ?((m|b|tr)illion)?/);
            budget = budget !== null ? budget[0] : "Undetermined";
            
            gross = grossRaw.match(/(\$|£|€|₹)\d+((,\d{3})+|(\.\d+))?(–\d+((,\d{3})+|(\.\d+))?)? ?((m|b|tr)illion)?/);
            gross = gross !== null ? gross[0] : "Undetermined";

            if (budget !== "Undetermined" || gross !== "Undetermined") {
                addBoxOfficeData(budget, gross);
            }
        }
    });
}

// Adds box office data to movie infobox on PTP
function addBoxOfficeData(budget, gross) {
    var budgetDiv = document.createElement("DIV");
    var grossDiv = document.createElement("DIV");
    var budgetStrong = document.createElement("STRONG");
    var grossStrong = document.createElement("STRONG");
    budgetStrong.innerHTML = "Budget:";
    grossStrong.innerHTML = "Gross:";
    budgetDiv.appendChild(budgetStrong);
    grossDiv.appendChild(grossStrong);
    budgetDiv.innerHTML += " " + budget;
    grossDiv.innerHTML += " " + gross;
    $("#movieinfo > .panel__body").append(budgetDiv, grossDiv);
}

(function() {
    'use strict';

    var titleRaw = document.title;

    // Ignore the browse page
    if (titleRaw.startsWith("Browse Torrents")) { return; }

    var title;
    var year;
    var akaIndex = titleRaw.indexOf(" AKA ");
    var yearIndex = titleRaw.search(/ \[\d{4,}\] /);
    if (akaIndex !== -1 && akaIndex < yearIndex) {
        title = titleRaw.substr(akaIndex + 5, yearIndex - akaIndex - 5);
    } else if (yearIndex !== -1) {
        title = titleRaw.substr(0, yearIndex);
    } else {
        console.error("No year for film detected -- something has gone wrong, please notify HostileThingy with link to the page you're on");
    }

    year = titleRaw.match(/ \[(\d{4,})\] /)[1];

    findTitle(title, year);
})();
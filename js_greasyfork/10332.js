// ==UserScript==
// @name        Letterboxd Bio Modifier
// @namespace   https://github.com/soyguijarro/userscripts
// @description Adds visual bio summary and Wikipedia link to actors and directors pages
// @copyright   2015, Ramón Guijarro (http://soyguijarro.com)
// @homepageURL https://github.com/soyguijarro/userscripts
// @supportURL  https://github.com/soyguijarro/userscripts/issues
// @icon        https://raw.githubusercontent.com/soyguijarro/userscripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.2
// @include     *://letterboxd.com/director/*
// @include     *://letterboxd.com/actor/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/10332/Letterboxd%20Bio%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/10332/Letterboxd%20Bio%20Modifier.meta.js
// ==/UserScript==

var sidebarElt = document.getElementsByClassName("sidebar")[0],
    bioElt = sidebarElt.getElementsByClassName("tmdb-person-bio")[0],
    tmdbId = bioElt.getAttribute("data-tmdb-id"),
    tmdbBaseUrl = "http://themoviedb.org/person/",
    tmdbUrl = tmdbBaseUrl + tmdbId;

function showBioSummary(res) {
    var dom = new DOMParser().parseFromString(res.responseText, "text/html"),
        tmdbBirthplaceElt = dom.getElementById("place_of_birth"),
        tmdbBirthdayElt = dom.getElementById("birthday"),
        tmdbDeathdayElt = dom.getElementById("deathday"),
        creditsElt = dom.getElementById("leftCol").getElementsByTagName("p")[0],
        creditsMatch = creditsElt.textContent.match(/Known Credits: (\d+)/),
        gotRelevantData = isActualData(tmdbBirthplaceElt) ||
            isActualData(tmdbBirthdayElt),
        bioSummaryElt = document.createElement("section"),
        bioSummaryElts,
        bioInnerElt,
        cssRules = "section.panel-text.bio-summary {\
                        border-bottom: 1px solid #456;\
                    }\
                    section.panel-text.bio-summary p {\
                        padding-left: 25px;\
                        display: block;\
                    }";

    function getFormattedDate(date) {
        var monthNum = date.getMonth(),
            dayNum = date.getDate(),
            yearNum = date.getFullYear(),
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return monthNames[monthNum] + " " + dayNum + ", " + yearNum;
    }

    function isActualData(elt) {
        var data = elt.textContent,
            exp = /^-$/;

        return !(exp.test(data));
    }

    function showBirthplace() {
        var birthplace = tmdbBirthplaceElt.textContent,
            birthplaceElt = document.createElement("p"),
            birthplaceIconElt = document.createElement("span");

        // Fill element with data and apply styles
        birthplaceElt.classList.add("icon-location");
        birthplaceElt.textContent = birthplace.replace(/ - /g, ", ");
        birthplaceIconElt.style.marginLeft = "2px";

        // Insert element in section
        birthplaceElt.appendChild(birthplaceIconElt);
        bioSummaryElt.appendChild(birthplaceElt);
    }

    function showBornDeathDate() {
        var birthday = new Date(tmdbBirthdayElt.firstElementChild.textContent),
            dateElt = document.createElement("p"),
            dateIconElt = document.createElement("span"),
            msPerYear = 1000 * 60 * 60 * 24 * 365,
            refDate,
            date,
            age;

        // Fill element with data and apply styles
        if (tmdbDeathdayElt) {  // Person is dead
            // Use death date as reference to calculate age
            refDate = new Date(tmdbDeathdayElt.firstElementChild.textContent);
            date = refDate; // Show death date

            dateElt.classList.add("icon-hidden");
            dateIconElt.style.marginLeft = "3px";
        } else {    // Person is alive
            // Use today as reference to calculate age
            refDate = new Date();
            date = birthday;    // Show birthday

            dateElt.classList.add("icon-people");
        }
        age = Math.floor((refDate - birthday.getTime()) / msPerYear);
        dateElt.textContent = getFormattedDate(date) +
            " (age" + ((tmdbDeathdayElt) ? "d " : " ") + age + ")";

        // Insert element in section
        dateElt.appendChild(dateIconElt);
        bioSummaryElt.appendChild(dateElt);
    }

    function showNumCredits() {
        var numCredits = creditsMatch[1],
            creditsElt = document.createElement("p"),
            creditsIconElt = document.createElement("span");

        // Fill element with data and apply styles
        creditsElt.classList.add("icon-list-all");
        creditsElt.textContent = numCredits + " known credits";
        creditsIconElt.style.backgroundPosition = "-740px -110px";

        // Insert element in section
        creditsElt.appendChild(creditsIconElt);
        bioSummaryElt.appendChild(creditsElt);
    }

    // Set up section to be inserted in page
    bioSummaryElt.className = "section panel-text bio-summary";

    // Fill section with available data
    if (gotRelevantData) {
        if (isActualData(tmdbBirthplaceElt)) {
            showBirthplace();
        }
        if (isActualData(tmdbBirthdayElt)) {
            showBornDeathDate();
        }
        if (creditsMatch) {
            showNumCredits();
        }
    } else {
        return; // Abort if no relevant data at all is available
    }

    // Apply common styles to section elements
    bioSummaryElts = bioSummaryElt.children;
    for (var i = 0; i < bioSummaryElts.length; i++) {
        bioSummaryElts[i].classList.add("has-icon")
        bioSummaryElts[i].classList.add("icon-16");
        bioSummaryElts[i].firstElementChild.className = "icon";
    }

    // Insert section in page
    bioInnerElt = bioElt.getElementsByClassName("panel-text condensed")[0] ||
        bioElt.getElementsByClassName("panel-text")[0];

    if (bioInnerElt) {  // Already existing bio section
        bioInnerElt.insertBefore(bioSummaryElt, bioInnerElt.firstElementChild.nextSibling);
    } else {    // No bio section, add missing header
        var bioHeaderElt = document.createElement("h2");
        bioHeaderElt.className = "section-heading";
        bioHeaderElt.textContent = "Bio";

        bioElt.appendChild(bioHeaderElt);
        bioElt.appendChild(bioSummaryElt);
    }
    GM_addStyle(cssRules);
}

function showWikiLink() {
    var linksElt = document.getElementsByClassName("bio-link")[0],
        headerElt = document.getElementsByClassName("page-header")[0],
        personNameElt = headerElt.querySelector("h1.inline-heading.prettify em"),
        wikiLinkElt = document.createElement("li"),
        wikiLinkInnerElt = document.createElement("a"),
        personName = personNameElt.textContent,
        wikiBaseUrl = "https://en.wikipedia.org/wiki/",
        wikiUrl = wikiBaseUrl + personName,
        linksInnerElt;

    // Fill element with data and apply styles
    wikiLinkInnerElt.className = "box-link";
    wikiLinkInnerElt.href = wikiUrl;
    wikiLinkInnerElt.textContent = "Search on Wikipedia";
    wikiLinkElt.appendChild(wikiLinkInnerElt);

    // Insert section in page
    if (linksElt) { // Already existing link section
        linksInnerElt = linksElt.getElementsByTagName("ul")[0];
        linksInnerElt.insertBefore(wikiLinkElt, linksInnerElt.firstElementChild);
    } else {    // No link section, create first
        linksElt = document.createElement("section");
        linksInnerElt = document.createElement("ul");
        linksElt.className = "section bio-link";
        linksInnerElt.className = "box-link-list box-links";

        linksInnerElt.appendChild(wikiLinkElt);
        linksElt.appendChild(linksInnerElt);
        sidebarElt.insertBefore(linksElt,
            sidebarElt.getElementsByClassName("progresspanel")[0]);
    }
}

GM_xmlhttpRequest({
    method: "GET",
    url: tmdbUrl,
    onload: showBioSummary
});

showWikiLink();
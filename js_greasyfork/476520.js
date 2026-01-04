// ==UserScript==
// @name         srrDB releases lister v3
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  Adds a "Scene releases" button to torrents page
// @author       Sapphire
// @match        https://passthepopcorn.me/torrents.php?id=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/476520/srrDB%20releases%20lister%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/476520/srrDB%20releases%20lister%20v3.meta.js
// ==/UserScript==

/* globals $jq globalThis */

// TODO: local options
const options = {
    // Set this to false if you want to fetch srrDB before clicking the "Scene releases" tab (i.e. fetch srrDB automatically whenever you open a PTP page)
    clickBeforeLoadingReleases: true,
    // Set this to true if you want the scene releases tab below the torrents, false for its own tab next to Torrents / Requests / Encoding
    sceneReleasesBelowTorrents: false,
    // Set this to false if you want the script to search for movies using IMDb ID first THEN fallback to movie name if no results. True if you want a mix of both
    tryBothImdbIDAndMovieName: false,
    // Set this to true if you want to add the count of torrents in the tab switch
    showTorrentsCount: true,
    // Add other languages used in The Scene releases filenames in lowercase
    foreign: ["french", "truefrench", "german", "catalan", "basque", "nordic", "dutch", "arabic", "swedish", "polish", "italian", "spanish", "czech", "thai", "norwegian", "danish", "icelandic", "finnish"],
    // Order in which releases are checked to be sorted. Once a keyword is found in the list it stops there for that release.
    qualityKeywords: {
        other: ["extras", "bonus", "subpack", "subfix", "dirfix", "dvd-covers"],
        uhd: ["2160", "uhd", "complete.uhd"],
        hd: [ "720", "1080", "blu-ray", "bluray", "complete.bluray", "complete.uhd"],
        sd: ["cam", "dsr", "r5", "telesync", "screener", "divx", "dvdrip", "ntsc", "dvd9", "dvdr", "pdtv", "hdtv", "webrip", "web", "bdrip"],
        extra: ["?"],
    },
    // Names used for the categories/qualities separators
    categories: {
        sd: "Standard Definition",
        hd: "High Definition",
        uhd: "Ultra High Definition",
        other: "Other",
        extra: "?",
    },
    // Sorting for the sources
    sources: ["WEB", "DVD", "AHDTV", "HDTV", "HD-DVD", "Blu-ray", "???"],
    // Alphabetical sorting
    // sources: ["???", "AHDTV", "DVD", "Blu-ray", "HD-DVD", "HDTV", "WEB"],
    // Sorting for the foreign releases
    foreignSort: ["english", "maybeForeign", "foreign"],
};

// Overriding PTP's function to switch between Torrents / Requests / Encoding tabs
globalThis.toggleTab = (tabIndex) => {
    $jq("#torrent-table").ToggleHC(tabIndex == 0);
    $jq("#requests").ToggleHC(tabIndex == 1);
    $jq("#encode-offers-table").ToggleHC(tabIndex == 2);
    $jq("#scene-table").ToggleHC(tabIndex == 3);
};

// Utils

/**
 * @params {string} date
 * @returns {string} Date in the format "X time ago"
 */
const timeSince = (date) => {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (Math.floor(seconds) < 0) {
        return "In the future";
    }
    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";
};

/**
 * @params {number} ms
 * @returns {Promise}
 */
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Actual code

const tableHeadTextSelector = "table > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(1) > strong:nth-child(1)";

const customCSS = `<style type="text/css">
.pre-links, #toggleForeign {
    float: right;
}

.foreign-indicator {
    color: green;
}

.foreign-rls .foreign-indicator {
    color: red;
}

.maybe-foreign-rls .foreign-indicator {
    color: yellow;
}

#srr-links {
    display: flex;
    justify-content: space-between;
}
</style>`;

document.head.insertAdjacentHTML("beforeend", customCSS);

/**
 * @params {string} imdbID - Movie IMDb ID
 * @params {boolean} [idAvailable]
 * @returns {Promise<Array<Object>>} - JSON with all the data returned from srrDB
 */
const getReleases = async (imdbID, idAvailable = true) => {
    const fetchURL = idAvailable ? `https://api.srrdb.com/v1/search/imdb:${imdbID}` : `https://api.srrdb.com/v1/search/${imdbID.replaceAll(" ", "/")}`;
    let data = await fetch(fetchURL).then((response) => response.json()).catch((err) => {
        console.error(err)
        return false
    });

    // Filter releases that start by the name of the movie (with dots instead of spaces) directly followed by the year
    if (!idAvailable) {
        data.results = data.results.filter(({ release }) => {
            const year = imdbID.split(" ").at(-1);
            const movieName = imdbID.split(" ").slice(0, -1).join(" ");
            return release.toLowerCase().startsWith(`${movieName.toLowerCase().replaceAll(" ", ".")}.${year}`);
        });
    }

    return data.results.map(({ release, date }) => ({
        name: release,
        date: date,
        humanDate: timeSince(date),
        source: (release.toLowerCase().includes(".bluray") || release.toLowerCase().includes(".blu-ray") || release.toLowerCase().includes(".bdrip")) ? "Blu-ray"
        : (release.toLowerCase().includes(".hddvd")) ? "HD-DVD"
        : (release.toLowerCase().includes(".dvdrip") || release.toLowerCase().includes(".dvdr") || release.toLowerCase().includes(".mdvdr") || release.toLowerCase().includes(".dvd9")) ? "DVD"
        : (release.toLowerCase().includes(".ahdtv")) ? "AHDTV"
        : (release.toLowerCase().includes(".hdtv")) ? "HDTV"
        : (release.toLowerCase().includes(".web") || release.toLowerCase().includes(".webrip")) ? "WEB"
        : "???",
    }));
};

/**
 * @params {Object} release Release (that includes release.name)
 * @params {string} movieName Movie name
 * @returns {Number} 0 if not foreign, 1 if foreign, 2 if maybe foreign
 */
const isForeign = (release, movieName) => {
    const yearRegex = /\.[0-9]{4}\./gm; // used to get the "release info" part of scene releases names
    const rlsName = release.name.split(yearRegex) ? "." + release.name.toLowerCase().split(yearRegex).at(-1) : release.name.toLowerCase();
    // Check if it's a foreign release
    let isForeign = false;
    options.foreign.forEach((e) => {
        const languageInMovieName = (movieName.match(new RegExp(e, "gi")) || []).length;
        const languageInReleaseName = (release.name.match(new RegExp(e, "gi")) || []).length;
        if (
            (
                (
                    (rlsName.includes(`.${e}.`) || rlsName.includes(`-${e}-`) || rlsName.includes(`${e}.dub`)) // if release name includes ".language." or "-language-" or "language.dub"
                    &&
                    (languageInReleaseName !== languageInMovieName)
                )
                ||
                (languageInReleaseName > languageInMovieName) // or the language appears more times in the release name than in the movie name
            )
            &&
            (!(rlsName.includes("complete") && rlsName.includes("bluray"))) // and it doesn't include bluray + complete
            &&
            (!rlsName.includes(".multi.")) // and it doesn't include .multi.
            &&
            (!release.name.toLowerCase().includes(".dl.")) // nor .dl.
        ) {
            isForeign = true; // then it is foreign
        }
        return;
    });
    let isMaybeForeign = false;
    if (
        ((rlsName.includes("pl.bdrip") || rlsName.includes("pldub.bdrip")) && rlsName.includes("flame"))
    ) {
        isMaybeForeign = true;
    }
    return isMaybeForeign ? 2 : isForeign ? 1 : 0
};

// TODO clean qualityKeywords, may not be needed in its entire form because the sorting changed
/* TODO DOUBLE CHECK WHAT HAPPENS WRONG HERE
releases not included in 47 Ronin [2013]:
47.Ronin.2013.BDRip.x264-SPARKS
47.Ronin.2013.FRENCH.BDRip.x264-PRiDEHD
47.Ronin.2013.NTSC.MULTi.DVDR-CoCaCoLa
47.Ronin.2013.PAL.MULTI.DVDR-VIAZAC
47.Ronin.2013.TRUEFRENCH.BDRip.x264-Saturday19th
47.Ronin.2013.WEBRip.x264-FLS
47.Ronin.BDRip.Line.Dubbed.German.x264-VCF
47.Ronin.German.2013.DL.PAL.DVDR-CRiSP
47.Ronin.German.BDRiP.x264-EXQUiSiTE
*/
/**
 * @params {Array<Object>} releases - Releases (name + date)
 * @params {String} movieName
 * @returns {Object} - Releases sorted by quality
 */
const sortReleases = (releases, movieName) => {
    let qualityReleases = {
        sd: [],
        hd: [],
        uhd: [],
        other: [],
        extra: [],
    };

    let sorted = false;

    for (const release of releases.sort((a, b) => a.name - b.name)) {
        sorted = false;
        qualitiesLoop: for (const [quality, value] of Object.entries(options.qualityKeywords)) {
            for (const keyword of value) {
                if (release.name.toLowerCase().includes(keyword)) {
                    qualityReleases[quality].push({ release });
                    sorted = true;
                    break qualitiesLoop;
                }
            }
        }
        if (!sorted) qualityReleases.extra.push({ release });
    }

    // Sort releases by resolution, within each of their qualities, then by foreign/maybe foreign/not foreign
    const sortedReleases = {};

    Object.keys(qualityReleases).map((quality) => {
        sortedReleases[quality] = {
            english: {
                "???": [],
                "WEB": [],
                "DVD": [],
                "AHDTV": [],
                "HDTV": [],
                "HD-DVD": [],
                "Blu-ray": [],
            },
            maybeForeign: {
                "???": [],
                "WEB": [],
                "DVD": [],
                "AHDTV": [],
                "HDTV": [],
                "HD-DVD": [],
                "Blu-ray": [],
            },
            foreign: {
                "???": [],
                "WEB": [],
                "DVD": [],
                "AHDTV": [],
                "HDTV": [],
                "HD-DVD": [],
                "Blu-ray": [],
            },
            "???": {
                "???": [],
                "WEB": [],
                "DVD": [],
                "AHDTV": [],
                "HDTV": [],
                "HD-DVD": [],
                "Blu-ray": [],
            }
        };

        qualityReleases[quality].map((e) => {
            const foreign = isForeign(e.release, movieName);
            switch (foreign) {
                case 0:
                    sortedReleases[quality].english[e.release.source].push(e.release);
                    delete e;
                    break;
                case 1:
                    sortedReleases[quality].foreign[e.release.source].push(e.release);
                    delete e;
                    break;
                case 2:
                    sortedReleases[quality].maybeForeign[e.release.source].push(e.release);
                    delete e;
                    break;
                default:
                    sortedReleases[quality]["???"][e.release.source].push(e.release);
                    delete e;
                    break;
            }
        });
    });

    const finalSort = {};

    Object.keys(sortedReleases).map((e) => {
        Object.keys(sortedReleases[e]).map((f) => {
            Object.keys(sortedReleases[e][f]).map((g) => {
                if (sortedReleases[e][f][g].length > 0) {
                    if (Object.hasOwnProperty.call(finalSort, e) && Object.hasOwnProperty.call(finalSort[e], f)) {
                        finalSort[e][f][g] = sortedReleases[e][f][g].sort((a, b) => a.name - b.name);
                    } else {
                        if (Object.hasOwnProperty.call(finalSort, e)) {
                            finalSort[e][f] = {};
                            finalSort[e][f][g] = sortedReleases[e][f][g].sort((a, b) => a.name - b.name);
                        } else {
                            finalSort[e] = {};
                            finalSort[e][f] = {};
                            finalSort[e][f][g] = sortedReleases[e][f][g].sort((a, b) => a.name - b.name);
                        }
                    }
                }
            });
        });
    });

    return finalSort;
};

/**
 * Insert srrDB search links (movie, movie + name etc.)
 * @params {string} movieName
 * @params {string} imdbID
 * @params {boolean} imdbIDAvailable
 */
const displaySearchLinks = (movieName, imdbID, imdbIDAvailable) => {
    const movieNameWithoutYear = movieName.split(" ").slice(0, -1).join(" ");
    const year = movieName.split(" ").at(-1);
    const searchLinksHTML = `<tr><td colspan="2">
        <div id="srr-links">
            <div>
                <span style="color: green;">"Title + year" search </span><span>[ <a href="https://predb.me/?search=%22^${movieName}%22+cats%3A-music-audio%2C-games%2C-apps%2C-books%2C-xxx" title="Check on PreDB.me" target="_blank">.me</a> | <a href="https://predb.org/search/${movieName}/all" title="Check on PreDB.org" target="_blank">.org</a> | <a href="https://predb.pw/search.php?search=${movieName}" title="Check on predb.pw" target="_blank">.pw</a> | <a href="https://www.srrdb.com/browse/${movieName.replaceAll(" ", "/")}/1" title="Check on srrDB.com" target="_blank">srrDB</a> ]</span>
            </div>
            <div>
                <span style="color: red;">"Title" search </span><span>[ <a href="https://predb.me/?search=%22^${movieNameWithoutYear}%22+cats%3A-music-audio%2C-games%2C-apps%2C-books%2C-xxx" title="Check on PreDB.me" target="_blank">.me</a> | <a href="https://predb.org/search/${movieNameWithoutYear}/all" title="Check on PreDB.org" target="_blank">.org</a> | <a href="https://predb.pw/search.php?search=${movieNameWithoutYear}" title="Check on predb.pw" target="_blank">.pw</a> | <a href="https://www.srrdb.com/browse/${movieNameWithoutYear.replaceAll(" ", "/")}/1" title="Check on srrDB.com" target="_blank">srrDB</a> ]</span>
            </div>
            <span>[ <a href="${imdbIDAvailable ? `https://www.srrdb.com/browse/imdb:${imdbID}/1` : ``}" title="Browse releases on srrDB" target="_blank">Browse releases on srrDB</a> ]</span>
        </div>
    </td></tr>`;

    document.querySelector("#scene-table tbody").insertAdjacentHTML("beforeend", searchLinksHTML);
};

const addRelease = (release, foreign) => {
    const tbody = document.querySelector("#scene-table tbody");
    let isForeign = false;
    let isMaybeForeign = false;

    if (foreign === "foreign") {
        isForeign = true;
    } else if (foreign === "maybeForeign") {
        isMaybeForeign = true;
    }

    tbody.insertAdjacentHTML("beforeend", `<tr${ isMaybeForeign ? " class=\"maybe-foreign-rls\"" : isForeign ? " class=\"foreign-rls\"" :""}>
        <td>
            <span class="foreign-indicator" title="${isMaybeForeign ? "English friendly?" : isForeign ? "Foreign" : "English friendly"}">${isMaybeForeign ? "[E?]" : isForeign ? "[F]" : "[E]"}</span>
            <a href="https://www.srrdb.com/release/details/${release.name}" title="Check the release on srrDB.com" target="_blank">${release.source} / ${release.name}</a>
            <span class="pre-links">[ <a href="https://predb.me/?search=${release.name}" title="Check on PreDB.me" target="_blank">.me</a> | <a href="https://predb.org/search/${release.name}/all" title="Check on PreDB.org" target="_blank">.org</a> | <a href="https://predb.pw/search.php?search=${release.name}" title="Check on predb.pw" target="_blank">.pw</a> ]</span>
        </td>
        <td title="${release.date}">${release.humanDate}</td>
    </tr>`);
};

/**
 * Inserts the movie in the "Scene releases" tbody
 * @params {Array<Object>} Array of movie releases (name + date) sorted by quality
 * @params {string} movieName
 * @params {string} imdbID
 * @params {boolean} imdbIDAvailable
 */
const displayReleases = (releases, movieName, imdbID, imdbIDAvailable) => {
    const tbody = document.querySelector("#scene-table tbody");

    // Clear innerHTML to remove the "Fetching data..." thing
    tbody.innerHTML = ""

    // Display releases in the table
    Object.keys(options.categories).forEach((quality) => {
        if (releases[quality]) {
            // Sort by quality
            tbody.insertAdjacentHTML("beforeend", `<tr class="group_torrent"><td colspan="2"><strong>${options.categories[quality]}</strong></td></tr>`);

            options.foreignSort.forEach((f) => {
                if (releases[quality][f]) {
                    options.sources.forEach((s) => {
                        if (releases[quality][f][s]) {
                            releases[quality][f][s].forEach((rls) => {
                                addRelease(rls, f);
                            });
                        }
                    });
                }
            });
        }
    });

    // Toggle foreign releases visibility
    const foreignReleases = document.querySelectorAll(".foreign-rls");
    if (foreignReleases.length > 0) {
        document.querySelector("#scene-table > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(1) > strong:nth-child(1)").insertAdjacentHTML("beforeend", "<a href=\"#\" id=\"toggleForeign\">[Hide foreign]</a>");
        document.getElementById("toggleForeign").addEventListener("click", (e) => {
            e.preventDefault();
            const hidden = e.target.textContent.includes("Show");
            if (hidden) {
                document.getElementById("foreignStyle").remove();
                e.target.textContent = "[Hide foreign]";
            } else {
                document.head.insertAdjacentHTML("beforeend", `<style type="text/css" id="foreignStyle">
                    .foreign-rls {
                        display: none;
                    }
                </style>`);
                e.target.textContent = "[Show foreign]";
            }
        })
    }

    // Update the "Scene releases" links with the number of releases
    const releasesCount = document.querySelectorAll("#scene-table > tbody:nth-child(2) > tr > td:nth-child(1) > a:nth-child(2)").length;
    [...document.querySelectorAll(tableHeadTextSelector)].forEach((e) => {
        e.innerHTML = e.innerHTML.replace(`Scene releases${options.clickBeforeLoadingReleases ? " (?)" : ""}`, `Scene releases (${releasesCount})`);
    });

    displaySearchLinks(movieName, imdbID, !!imdbID, true);
};

(async () => {
    'use strict';

    const torrentsCount = document.querySelectorAll("tr[id^='group_torrent_header']").length;

    const tables = [...document.querySelectorAll(tableHeadTextSelector)].map((e) => e.closest("table"));

    // Last element before Scene tab
    const lastTable = tables.at(-1);

    // Get the HTML of the first tab to apply it to the new tab
    const newHeadHTML = tables[0].querySelector(tableHeadTextSelector.split(" > ").slice(1).join(" > ")).innerHTML.replace("Torrents", `<a href="#" onclick="toggleTab(0); return false;">Torrents${options.showTorrentsCount ? ` (${torrentsCount})` : ""}</a>`) + ` | Scene releases${options.clickBeforeLoadingReleases ? " (?)" : ""}`;

    // Change the table head of every tab (torrents / requests / encoding center) to add "Scene releases"
    if (!options.sceneReleasesBelowTorrents) {
        document.querySelectorAll(tableHeadTextSelector).forEach((tableHeadHTML) => {
            tableHeadHTML.innerHTML = tableHeadHTML.innerHTML.replaceAll("ToggleTorrentTabOnDetailsPage", "toggleTab") + ` | <a id="srrReleases" href="#" onclick="toggleTab(3); return false;">Scene releases${options.clickBeforeLoadingReleases ? " (?)" : ""}</a>`;
        });
    }

    if (options.showTorrentsCount) {
        document.querySelectorAll("table > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(1) > strong:nth-child(1)").forEach((e) => {
            e.innerHTML = e.innerHTML.replace("Torrents", `Torrents (${torrentsCount})`);
        });
    }

    // Building the base table that will be under the "Scene releases" tab
    const tableHTML = `<table id="scene-table" class="table table--panel-like table--bordered${options.sceneReleasesBelowTorrents ? "" : " hidden"}">
        <thead>
            <tr>
                <th width="85%">
                    <strong>
                        ${options.sceneReleasesBelowTorrents ? `Scene releases${options.clickBeforeLoadingReleases ? " (?)" : ""}` : newHeadHTML.replaceAll("ToggleTorrentTabOnDetailsPage", "toggleTab")}
                    </strong>
                </th>
                <th>
                    <strong>
                        Added
                    </strong>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${options.clickBeforeLoadingReleases && options.sceneReleasesBelowTorrents ? `<span>[ <a href="#" id="fetch-srrdb" title="Get srrDB search results">Fetch srrDB</a> ]</span>` : "Fetching data..."}</td>
                <td></td>
            </tr>
        </tbody>
        </table>`

    lastTable.insertAdjacentHTML("afterend", tableHTML);

    const imdbID = document.getElementById("imdb-title-link")?.href.split("/tt")[1].replace("/", "") || false;
    let movieName = document.querySelector("h2.page__title").textContent.split(" by")[0].normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[^a-zA-Z0-9 ]/g, "");
    movieName = movieName.includes(" AKA ") ? movieName.split(" AKA ").length > 2 ? movieName.split(" AKA ")[0] + " " + movieName.split(" ").at(-1) : movieName.split(" AKA ")[1] : movieName

    if (!options.searchLinksBelowSceneReleases) displaySearchLinks(movieName, imdbID, !!imdbID, false);

    const main = async (e = false) => {
        if (e) {
            e.preventDefault();
            const firstTd = document.querySelector("#scene-table > tbody:nth-child(2) > tr:nth-child(1) > td");
            firstTd.textContent = "Fetching data...";
        }
        if (document.querySelector("#scene-table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)").textContent !== "") return;

        const firstTd = document.querySelector("#scene-table > tbody:nth-child(2) > tr > td");

        // Get data from srrDB about that movie
        // Using IMDb ID or movie name
        let releases = await getReleases(imdbID ? imdbID : movieName, !!imdbID);
        // and also via movie name if option set as such, if there is an IMDb ID (otherwise it's redundant)
        if (options.tryBothImdbIDAndMovieName && !!imdbID) {
            await sleep(1000);
            const movieNameReleases = await getReleases(movieName, false);
            releases.push(...movieNameReleases);
            releases = releases.filter((value, index, array) => index === array.findIndex((t) => (t.name === value.name))); // remove dupes
        }

        // Case where there are no results
        if (releases.length === 0) {
            if (imdbID && (!options.tryBothImdbIDAndMovieName)) { // Try with movie name if no results with imdb id, unless tryBothImdbIDAndMovieName option is set to true
                firstTd.textContent = "Nothing found using the IMdb ID. Trying again with the movie name...";
                releases = await getReleases(movieName, false);
                // Error message if nothing found, plus search links
                if (releases.length === 0) {
                    firstTd.textContent = "No results.";
                    [...document.querySelectorAll(tableHeadTextSelector)].forEach((e) => {
                        e.innerHTML = e.innerHTML.replace(`Scene releases${options.clickBeforeLoadingReleases ? " (?)" : ""}`, `Scene releases (0)`);
                    });
                    if (options.searchLinksBelowSceneReleases) displaySearchLinks(movieName, imdbID, !!imdbID, false);
                    return false;
                }
            } else {
                firstTd.textContent = "No results.";[...document.querySelectorAll(tableHeadTextSelector)].forEach((e) => {
                    e.innerHTML = e.innerHTML.replace(`Scene releases${options.clickBeforeLoadingReleases ? " (?)" : ""}`, `Scene releases (0)`);
                });
                if (options.searchLinksBelowSceneReleases) displaySearchLinks(movieName, imdbID, !!imdbID, true);
                return false;
            }
        }

        // Sort releases by quality
        const sortedReleases = sortReleases(releases, movieName);

        // Build the table with the releases
        displayReleases(sortedReleases, movieName, imdbID, !!imdbID);
    };

    // Fetch data on click on the tab
    if (options.clickBeforeLoadingReleases) {
        document.getElementById(options.sceneReleasesBelowTorrents ? "fetch-srrdb" : "srrReleases").addEventListener("click", (e) => { main(e) });
    } else {
        main();
    }
})();
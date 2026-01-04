// ==UserScript==
// @name         PTP To Radarr
// @version      0.92
// @author       DirtyCajunRice
// @namespace    DirtyCajunRice
// @description  Easily add movies to radarr straight from PTP
// @homepage     https://passthepopcorn.me/forums.php?action=viewthread&threadid=35294
// @icon         https://ptpimg.me/19kcyv.png
// @supportURL   https://passthepopcorn.me/forums.php?action=viewthread&threadid=35294
// @match        https://passthepopcorn.me/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @copyright    2019, dirtycajunrice (https://openuserjs.org//users/dirtycajunrice)
// @license      MIT
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.openInTab
// @grant        GM.notification
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/443265/PTP%20To%20Radarr.user.js
// @updateURL https://update.greasyfork.org/scripts/443265/PTP%20To%20Radarr.meta.js
// ==/UserScript==

/*=========================  Version History  ==================================

Changelog 0.92   - Add extra check for wrong API key @hulkhorgen.

Changelog 0.91   - Support for Radarr v4 by @hulkhorgen.

Changelog 0.9   - Support for Radarr dev v3.1.0.4893 by @catsouce.

Changelog 0.8.9 - Debugging code cleanup by @catsouce.

Changelog 0.8.8 - Fix for non Chrome browsers. Updated to Greasemonkey v4 API by @catsouce.

Changelog 0.8.7 - Change of url for newer Radarr (openInTab) by @varovas.

Changelog 0.8.6 - Fix by @catsouce.

Changelog 0.8.5 - Fix by @bw.

Changelog 0.8.4 - Fixed href bug for covers
                  Fixed update logic

Changelog 0.8.3 - Major internal code refactor
                  Found lingering URL sanitization missed

Changelog 0.8.2 - Fixed autoupdate trying to update non-existant buttons

Changelog 0.8.1 - Fixed "Huge view" themeChecker for Raise
                  Fixed "Huge view" in collections
                  Added AutoUpdate for "Huge view"

Changelog 0.8.0 - Added "Huge view"

Changelog 0.7.1 - Fixed bug with GM_config iframe document access logic
                  Fixed bug with themeChecker

Changelog 0.7.0 - Added AutoSync to settings
                  Update buttons after a sync (manual and auto)

Changelog 0.6.1 - Added Stylesheet checking to fix cover buttons.
                  Confirmed working on all official and supported custom stylesheets + Raise

Changelog 0.6.0 - Added error checking to help debug issues
                  Added Radarr URL sanitization

*/

GM_config.init({
    "id": "PTPToRadarr",
    "title": "PTP To Radarr Settings",
    "css": `#PTPToRadarr {background: #333333;}
            #PTPToRadarr .field_label {color: #fff;}
            #PTPToRadarr .config_header {color: #fff; padding-bottom: 10px;}
            #PTPToRadarr .reset {color: #f00; text-align: center;}
            #PTPToRadarr .config_var {text-align: center;}
            #PTPToRadarr_radarr_syncbutton_var {float: left;}
            #PTPToRadarr .reset_holder {text-align: center;}
            #PTPToRadarr_radarr_minimumavailability_var {padding-right: 95;}
            #PTPToRadarr_radarr_apikey_var {padding-left: 49;}
            #PTPToRadarr_radarr_url_var {padding-left: 69;}
            #PTPToRadarr .saveclose_buttons {margin: 16px 10px 10px; padding: 2px 12px; background-color: #e7e7e7; color: black; text-decoration: none; border: none; border-radius: 6px;}
            #PTPToRadarr_field_radarr_syncbutton {background-color: #e7e7e7; color: black; text-decoration: none; border: none; border-radius: 6px; margin-left: 10px; margin-top: 16px; height: 20px;}`,
    "events": {
        "open": function(doc) {
            let style = this.frame.style;
            style.width = "400px";
            style.height = "295px";
            style.inset = "";
            style.top = "6%";
            style.right = "6%";
            style.borderRadius = "25px";
            doc.getElementById("PTPToRadarr_buttons_holder").prepend(doc.getElementById("PTPToRadarr_radarr_syncbutton_var"));
        }
    },
    "fields": {
        "radarr_url": {
            "label": "Radarr URL",
            "type": "text",
            "default": "https://domain.tld/radarr"
        },
        "radarr_apikey": {
            "label": "Radarr API Key",
            "type": "text",
            "default": ""
        },
        "radarr_profileid": {
            "label": "Radarr Quality Profile ID",
            "type": "text",
            "default": "1"
        },
        "radarr_rootfolderpath": {
            "label": "Radarr Root Folder Path",
            "type": "text",
            "default": "/mnt/movies"
        },
        "radarr_minimumavailability":
        {
            "label": "Minimum Availability",
            "type": "select",
            "options": ["announced", "inCinemas", "released"],
            "default": "released"
        },
        "radarr_searchformovie": {
            "label": "Search for movie on request",
            "type": "checkbox",
            "default": false
        },
        "radarr_sync_interval":
        {
            "label": "AutoSync Interval (Minutes)",
            "type": "select",
            "options": ["15", "30", "60", "120", "360", "1440", "Never"],
            "default": "Never"
        },
        "radarr_syncbutton": {
            "label": "Sync Radarr Movies",
            "type": "button",
            "click": get_radarr_movies
        }
    }
});

GM.registerMenuCommand("PTP To Radarr Settings",() => GM_config.open());

let url = window.location.href;
let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");

var current_page_type = "";
if (document.getElementById("torrent-table")) {
    current_page_type = "singletorrent";
}
else {
    current_page_type = "multi";
}
if (current_page_type) {
    set_html(false);
}

let interval = GM_config.get("radarr_sync_interval");
if (interval != "Never") {
    let millisecondInterval = Number(interval) * 60000;
    window.setTimeout(() => autoSync(millisecondInterval));
    window.setInterval(() => autoSync(millisecondInterval), millisecondInterval);
}

function themeChecker () {
    let typeAThemes = ["marcel.css", "ptp-raise"];
    typeAThemes.forEach((theme) => {
        if (document.head.querySelector("[href*=\"" + theme + "\"]")) {
            return true;
        }
    });
    return false;
}

function clickswap (imdbid, titleSlug) {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let button = document.getElementById("ptptoradarr-" + imdbid)
    button.firstChild.src = "https://ptpimg.me/19kcyv.png";
    button.removeEventListener("click", new_movie_lookup, false);
    button.addEventListener("click", function () {
        GM.openInTab(radarr_url.concat("/movie/", titleSlug), "active");
    }, false);
}

function set_html (update) {
    let theme = themeChecker();
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let coverView = document.querySelector(".cover-movie-list__container:not(.hidden)");
    let coverViewMovies = Array.from(document.getElementsByClassName("cover-movie-list__movie__rating-and-tags"));
    let listView = document.querySelector(".basic-movie-list");
    let listViewMovies = Array.from(document.getElementsByClassName("basic-movie-list__movie__ratings-and-tags"));
    let hugeView = document.querySelector(".huge-movie-list__movie");
    let hugeViewMovies = Array.from(document.getElementsByClassName("huge-movie-list__movie__ratings"));
    if (update) {
        let buttons = document.querySelectorAll("[id^=\"ptptoradarr-tt\"]");
        if (buttons.length === 0) {
            return;
        }
        buttons.forEach((button) => {
            window.setTimeout(function () {
                button.parentNode.removeChild(button);
            });
        });
    }
    if (current_page_type == "singletorrent") {
        let a = document.querySelector("[href*=\"://www.imdb.com/title/tt\"]");;
        let movie = document.querySelector(".panel__body");
        if (a) {
            buttonBuilder(movie, a.href, "single", theme);
        }
    }
    else if (current_page_type == "multi") {
        if (coverView && !coverView.classList.contains("hidden")) {
            coverViewMovies.forEach((movie) => {
                window.setTimeout(() => {
                    let a = movie.querySelector("[href*=\"://www.imdb.com/title/tt\"]");
                    if (a) {
                        buttonBuilder(movie, a.href, "medium", theme);
                    }
                });
            });
        }
        else if (listView && !listView.classList.contains("hidden")) {
            listViewMovies.forEach((movie) => {
                window.setTimeout(() => {
                    let a = movie.querySelector("[href*=\"://www.imdb.com/title/tt\"]");
                    if (a) {
                        buttonBuilder(movie, a.href, "small", theme);
                    }
                });
            });
        }
        else if (hugeView) {
            hugeViewMovies.forEach((movie) => {
                window.setTimeout(() => {
                    let a = movie.querySelector("[href*=\"://www.imdb.com/title/tt\"]");
                    if (a) {
                        buttonBuilder(movie, a.href, "large", theme);
                    }
                });
            });
        }
    }
}

async function buttonBuilder (movie, href, type, theme) {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let imdbid = href.match(/tt\d+/)[0];
    let exists = await check_exists(imdbid);
    let button = document.createElement("button");
    let img = document.createElement("img");
    button.id = "ptptoradarr-" + imdbid;
    button.type = type;
    Object.assign(button.style, {border: "none", backgroundColor: "transparent"});
    Object.assign(img.style, {border: "none", backgroundColor: "transparent"});
    Object.assign(img, {height: 32, width: 32});
    button.appendChild(img);
    img.imdbid = imdbid;
    if (type == "single") {
        Object.assign(button.style, {position: "absolute", top: "6%", zIndex: 10});
        movie.style.position = "relative";
        movie.prepend(button);
    }
    else if (type == "small") {
        Object.assign(img, {height: 16, width: 16});
        movie.appendChild(button);
    }
    else if (type == "medium") {
        let posterContainer = movie.closest(".cover-movie-list__movie");
        posterContainer.prepend(button);
        Object.assign(button.style, {position: "absolute", top: "3%", zIndex: 10});
        if (theme) {
            posterContainer.style.position = "relative";
        }
    }
    else if (type == "large") {
        let posterContainer = movie.closest(".huge-movie-list__movie").firstChild;
        posterContainer.prepend(button);
        Object.assign(button.style, {position: "absolute", top: "3%", zIndex: 10});
        if (theme) {
            button.style.left = "3%";
            posterContainer.style.position = "relative";
        }
    }
    if (exists) {
        img.src = "https://ptpimg.me/19kcyv.png";
        button.addEventListener("click", function () {
            GM.openInTab(radarr_url.concat("/movie/", exists[0].titleSlug), "active");
        }, false);
    }
    else {
        img.src = "https://ptpimg.me/0q4vvz.png";
        $(button).click(function() {
           new_movie_lookup(imdbid);
        });
    }
}

function errorNotificationHandler (error, expected, errormsg) {
    let prestring = "PTPToRadar::";
    if (expected) {
        console.log(prestring + "Error: " + errormsg + " Actual Error: " + error);
        GM.notification("Error: " + errormsg);
    }
    else {
        console.log(prestring + "Unexpected Error: Please report this error in the forum. Actual Error: " + error);
        GM.notification("Unexpected Error: Please report this error in the forum. Actual Error: " + error);
    }
}

function get_radarr_movies() {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let radarr_apikey = GM_config.get("radarr_apikey");
    GM.xmlHttpRequest({
        method: "GET",
        url: radarr_url.concat("/api/v3/movie"),
        headers: {
            "X-Api-Key": radarr_apikey,
            "Accept": "application/json"
        },
        onload: function(response) {
            let responseJSON = null;
            if (!response.responseJSON) {
                try {
                    responseJSON = JSON.parse(response.responseText);
                    if (responseJSON.error == "Unauthorized") {
                        throw "creds";
                    }
                    GM.setValue("existing_movies", JSON.stringify(responseJSON));
                    let timestamp = + new Date()
                    GM.setValue("last_sync_timestamp", timestamp)
                    console.log("PTPToRadarr::Sync: Setting last sync timestamp to " + timestamp)
                    GM.notification("Radarr Sync Complete!", "PTP To Radarr");
                    set_html(true);
                }
                catch (e) {
                    if (response.status == 401) {
                        errorNotificationHandler(e, true, "Invalid API Key. Please check your Radarr API Key")
                    }
                    if (e instanceof SyntaxError) {
                        errorNotificationHandler(e, true, "No JSON in response. Please check your Radarr URL.")
                    }
                    else if (e == "creds") {
                        errorNotificationHandler(e, true, "Invalid API Key. Please check your Radarr API Key")
                    }
                    else {
                        errorNotificationHandler(e, false)
                    }
                }
            }
        }
    });
};

async function check_exists (imdbid) {
    let movieliststr = await GM.getValue("existing_movies", "{}");
    let movie_list = JSON.parse(movieliststr);
    let filter = null
    try {
        filter = movie_list.filter(movie => movie.imdbId == imdbid);
    }
    catch (e) {
        if (e instanceof TypeError) {
            return false
        }
        else {
            errorNotificationHandler(e, false)
            return false
        }
    }
    if (!filter.length) {
        return false
    }
    else {
        return filter
    };
}

async function autoSync (interval) {
    let currentTimestamp = + new Date();
    let lastSyncTimestamp = await GM.getValue("last_sync_timestamp", 0);
    if (currentTimestamp - lastSyncTimestamp >= interval) {
        let notification = "It has been " + ((currentTimestamp - lastSyncTimestamp) / 60000).toFixed(1) +
            " minutes since your last sync which exceeds your threshold of " +
            (interval / 60000) + " minutes. AutoSyncing...";
        console.log(notification);
        GM.notification(notification);
        get_radarr_movies();
    }
}

function new_movie_lookup (imdbid) {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let radarr_apikey = GM_config.get("radarr_apikey");
    let movie = "";
    GM.xmlHttpRequest({
        method: "GET",
        url: radarr_url.concat("/api/v3/movie/lookup/imdb?imdbId=", imdbid),
        headers: {
            "X-Api-Key": radarr_apikey,
            "Accept": "application/json"
        },
        onload: function(response) {
            let responseJSON = null;
            if (!response.responseJSON) {
                if (!response.responseText) {
                    GM.notification("No results found");
                    return;
                }
                responseJSON = JSON.parse(response.responseText);
                add_movie(responseJSON, imdbid);
            }
        }
    })
}

function add_movie (movie, imdbid) {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let radarr_apikey = GM_config.get("radarr_apikey");
    movie.qualityProfileId = parseInt(GM_config.get("radarr_profileid"));
    movie.RootFolderPath = GM_config.get("radarr_rootfolderpath");
    movie.monitored = true;
    movie.minimumAvailability = GM_config.get("radarr_minimumavailability");;
    if (GM_config.get("radarr_searchformovie")) {
        movie.addOptions = {searchForMovie: true}
    }
    GM.xmlHttpRequest({
        method: "POST",
        url: radarr_url.concat("/api/v3/movie"),
        headers: {
            "X-Api-Key": radarr_apikey,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(movie),
        onload: function(response) {
            let responseJSON = null;
            if (!response.responseJSON) {
                responseJSON = JSON.parse(response.responseText);
                try {
                    if (!responseJSON.title && responseJSON[Object.keys(responseJSON)[0]].errorMessage == "This movie has already been added") throw "exists";
                    clickswap(imdbid, responseJSON.titleSlug);
                    GM.notification(responseJSON.title + " Sucessfully sent to Radarr", "PTP To Radarr")
                }
                catch (e) {
                    if (e == "exists") {
                        errorNotificationHandler(e, true, "Movie already exists in Radarr. Please resync your movies.");
                    }
                    else {
                        errorNotificationHandler(e, false);
                    }
                }
            }
        }
    });
}

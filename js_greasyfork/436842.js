// ==UserScript==
// @name         Wiki Summary
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @version      0.6.0
// @description  Display Wikipedia summary of the Geoguessr locations. Works with streaks, single player 5 round games and challenges.
// @author       semihM (aka rhinoooo_), MiniKochi
// @source       https://github.com/semihM/GeoGuessrScripts/blob/main/WikiSummary
// @supportURL   https://github.com/semihM/GeoGuessrScripts/issues
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/851187
// @downloadURL https://update.greasyfork.org/scripts/436842/Wiki%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/436842/Wiki%20Summary.meta.js
// ==/UserScript==


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// API KEYS : Get your keys from following sites
// - https://www.bigdatacloud.com/
// - https://opentripmap.io/
//
// After every update, these values will be reset. But since the script stores them as "cookies", they will still be replaced internally
// API Keys are not required to be updated in here after they get removed because of an auto-update
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// BigDataCloud for location information
let BigDataCloud_APIKEY = 'ENTER_API_KEY_HERE'; //Replace ENTER_API_KEY_HERE with yours from https://www.bigdatacloud.com/

// OpenTripMap for places nearby
let OpenTripMap_APIKEY = 'ENTER_API_KEY_HERE'; //Replace ENTER_API_KEY_HERE with yours from https://opentripmap.io/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETTINGS: Make sure UseSettingsBelow_InsteadOfCookies is set to true to use settings written here instead of previous one in cookies

// After every update, settings will be reset. But since the script stores them as "cookies", they will still be replaced internally
// There will be alerts prompted in the site after updates, make sure you read them!

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let Settings = {
    // Maximum fact text length, may exceed the limit if last sentence is long enough
    "MaximumFactMessageLength": 420,

    // Maximum amount of famous place facts to display
    "MaximumPlaceFactCountToDisplay": 5,
    // Maximum amount of facts(geographical + famous place) to display
    "MaximumFactCountToDisplay": 10,

    // Categories for nearby places, check https://opentripmap.io/catalog for other categories. Seperate categories with ',' commas
    "PlaceCategoriesToSearchFor": "historic,cultural,natural,architecture,religion",
    // Radius in meters to search for places nearby
    "PlaceSearchRadiusInMeters": 2000,

    // true: Display facts under the main green continue button; false: Display facts before continue button
    "DisplayFactsBelowButtons": true,

    // Fact's wiki title color for both geographical and famous place facts
    "FactWikiTitleColor": "lime",
    // Fact's wiki text color for both geographical and famous place facts
    "FactWikiTextColor": "white",

    // Geographical fact title
    "GeographyFactTitle": "Geographical",
    // Geographical fact title color name, lowercase
    "GeographyFactTitleColorName": "orange",

    // Famous place fact title
    "FamousPlaceFactTitle": "Famous Place",
    // Famous place fact text color name, lowercase
    "FamousPlaceFactTitleColorName": "cyan",

    // Source link color name, lowercase
    "SourceLinkColorName": "darkgray",

    // true: Display fact number after the title; false: Don't display fact number
    "DisplayFactNumber": true,

    // true: Open wiki links in new tab; false: Open in current tab
    "OpenInNewTab": true,

    // Exclude given wiki id's from facts
    "ExcludedWikiPageIds": [
        // Remove the first '//' before the wiki ids ( //12345, -> 12345, ) to exclude the wiki page from results
        // Add more by adding a ',' comma after the previous wiki id
        //83759, // USA
        //13530298, // UK
    ]
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const DEBUG_ENABLED = false // true: Console print enabled for debugging; false: Don't print any debug information

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const API_URL = "https://api.bigdatacloud.net/data/reverse-geocode?localityLanguage=en&"
const WIKI_URL = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles="
const WIKIDATA_URL = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&origin=*&props=sitelinks&sitefilter=enwiki&ids="
const OPENTRIP_URL = `https://api.opentripmap.com/0.1/en/places/radius?radius=${Settings.PlaceSearchRadiusInMeters}&limit=${Settings.MaximumPlaceFactCountToDisplay}&src_attr=wikidata&kinds=${encodeURIComponent(Settings.PlaceCategoriesToSearchFor)}&apikey=`

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const SettingsVersion = 6; // ONLY UPDATE WHILE RELEASING A NEW VERSION

const EMPTYAPIKEY = "ENTER_API_KEY_HERE"
const INVALIDLINK = "#";
const BIGDATACLOUD_APICOOKIE = "geoguessr_script_semihM_bigdatacloudkey"
const OPENTRIPMAP_APICOOKIE = "geoguessr_script_semihMopentripmapkey"
const SETTINGS_COOKIE = "geoguessr_script_semihM_WikiSummarySettings"
const SETTINGS_ASKED_COOKIE = "geoguessr_script_semihM_WikiSummarySettingsAsked"

const _id_fact_div = "location-fact"
const _class_roundResult_5roundGame = "round-result_actions__5j26U"
const _class_roundResult_streakGame = "streak-round-result_root__WxUU9"
const _class_roundResult_Bullseye = "round-score_container__avps2"
const _class_nextButton_Bullseye = "button_button__CnARx"
const _class_correct_loc = 'styles_circle__2tw8L styles_variantFloating__mawbd styles_colorWhite__2QcUQ styles_borderSizeFactorOne__2Di08'

const SummaryLoadingPlaceHolderInnerHtml = `<div id="${_id_fact_div}" style="text-align:center"><br><br>Loading wikipedia summaries...</div><br>`

const CookieDays = 365

let checked = parseInt(sessionStorage.getItem("FactLocationChecked"), 10);
let facts = []

let placeWikidataTitles = []
let needsWiki = true;

if (sessionStorage.getItem("FactLocationChecked") == null) {
    sessionStorage.setItem("FactLocationChecked", 0);
    checked = 0;
};

/////////////////////////
// Cookies
/////////////////////////
CheckCookiesForAPIKeys()
CheckCookiesForSettings()
    /////////////////////////

function debug(obj) {
    if (DEBUG_ENABLED) console.log(obj)
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function GetSettingsString() {
    return JSON.stringify(Settings)
}

function CheckCookiesForAPIKeys() {
    let key = ""
    if (BigDataCloud_APIKEY == EMPTYAPIKEY) {
        if (key = getCookie(BIGDATACLOUD_APICOOKIE)) BigDataCloud_APIKEY = key
        else if ((key = prompt("Couldn't find bigdatacloud.com API key, please enter your key")) != "") setCookie(BIGDATACLOUD_APICOOKIE, BigDataCloud_APIKEY = key, CookieDays);
        else return alert("Failed to initialize WikiSummary script. Make sure to add your key manually!")
    } else setCookie(BIGDATACLOUD_APICOOKIE, BigDataCloud_APIKEY, CookieDays)

    if (OpenTripMap_APIKEY == EMPTYAPIKEY) {
        if (key = getCookie(OPENTRIPMAP_APICOOKIE)) OpenTripMap_APIKEY = key
        else if ((key = prompt("Couldn't find opentripmap.io API key, please enter your key")) != "") setCookie(OPENTRIPMAP_APICOOKIE, OpenTripMap_APIKEY = key, CookieDays);
        else return alert("Failed to initialize WikiSummary script. Make sure to add your key manually!")
    } else setCookie(OPENTRIPMAP_APICOOKIE, OpenTripMap_APIKEY, CookieDays)
}

function CheckCookiesForSettings() {
    let settings = getCookie(SETTINGS_COOKIE)
    let asked = getCookie(SETTINGS_ASKED_COOKIE);

    if (settings == null || asked == null) // First time
    {
        setCookie(SETTINGS_COOKIE, JSON.stringify(Settings), CookieDays)
        setCookie(SETTINGS_ASKED_COOKIE, SettingsVersion, CookieDays)
    } else {
        let cookieSettings = JSON.parse(settings)
        if (asked != SettingsVersion) // There was an update
        {
            let restore = window.confirm("There was an update to WikiSummary(by rhino). Would you like to restore the old settings ? Click \"Cancel\" if you havent made any changes and use default settings.");

            setCookie(SETTINGS_ASKED_COOKIE, SettingsVersion, CookieDays)

            if (restore) {
                for (const [key, value] of Object.entries(Settings)) {
                    if (!(key in cookieSettings)) {
                        cookieSettings[key] = value
                    }
                }

                let cookiesets = JSON.stringify(cookieSettings)
                setCookie(SETTINGS_COOKIE, cookiesets, CookieDays) // Use from cookies

                let jsonframe = document.createElement("pre")
                jsonframe.innerHTML = "<pre>// Setting start around line 40\n// v COPY STARTING FROM THE LINE BELOW v\nlet Settings = " + JSON.stringify(cookieSettings, undefined, 2) + "</pre>"

                let myDialog = document.createElement("dialog");
                document.body.appendChild(myDialog)

                myDialog.appendChild(jsonframe);

                let closeBtn = document.createElement("p")
                closeBtn.style = "background-color: red; color: white; font-size:18px; border: 2px solid black; width: auto; text-align:center;"
                closeBtn.textContent = "Click here to close this frame"
                closeBtn.onclick = () => myDialog.remove()

                myDialog.appendChild(closeBtn);
                myDialog.appendChild(jsonframe);

                myDialog.showModal();

                alert("Old settings will be shown in a small window for copying, paste them into the Wiki Summary script!")
            } else {
                setCookie(SETTINGS_COOKIE, JSON.stringify(Settings), CookieDays) // Store new update's settings
            }
        } else {
            setCookie(SETTINGS_COOKIE, JSON.stringify(Settings), CookieDays) // Store currently written settings
        }
    }
}

function cleanPages(pages) {
    // Missing or invalid
    if (-1 in pages) delete pages[-1]
    if (-2 in pages) delete pages[-2]

    Settings.ExcludedWikiPageIds.forEach(idx => idx in pages ? delete pages[idx] : null);
}

function setNameToPostal(obj, name) {
    obj.name = name
    obj.description = name
}

function styleFact(name, desc) {
    if (desc.startsWith(". "))
        desc = desc.substring(2);
    return `<h3 style="color: ${Settings.FactWikiTitleColor}">${name}</h3><br>${desc}`
}

function getTitlesFromLocation() {
    return getLocationObject()
        .then(async loc => {
            debug(loc)

            needsWiki = true;
            placeWikidataTitles = [];

            if (loc == null || !("localityInfo" in loc)) return null

            let infos = loc.localityInfo.informative.concat(loc.localityInfo.administrative.filter(o => o.adminLevel >= 3))
                .sort((firstEl, secondEl) => firstEl.order > secondEl.order ? 1 : -1)

            if (infos.length == 0) return null

            let maxorder = infos[infos.length - 1].order

            debug("]infos")
            debug(infos)

            return await getNearByLocationsFromLatLng(loc.latitude, loc.longitude)
                .then(locs => {
                    debug("]locs")
                    debug(locs)
                    return locs.features.map(place =>
                        "wikidata" in place.properties ? {
                            "order": Math.floor(maxorder + (Math.random() * maxorder) / 2.0),
                            "name": place.properties.name,
                            "description": place.properties.name + "(" + place.properties.kinds + ")",
                            "wikidataId": place.properties.wikidata,
                            "isPlaceFact": true
                        } :
                        null).filter(o => o != null)
                })
                .then(async places => {

                    debug("]places")
                    debug(places)

                    infos = infos.concat(places)
                        .sort((firstEl, secondEl) => firstEl.order > secondEl.order ? 1 : -1);

                    debug("]infos")
                    debug(infos)

                    let len = Object.keys(infos).length;
                    if (len == 1) {
                        let info = infos[0]
                        if (info.order < 3) {
                            needsWiki = false;
                            return styleFact(info.name, info.description)
                        }
                        return info;
                    } else {
                        let filtered = infos.filter(o => o.order >= 3 && "wikidataId" in o);

                        if (filtered.length < Settings.MaximumFactCountToDisplay) {
                            filtered = infos.filter(o => o.order >= 2 && "wikidataId" in o);
                        }

                        filtered.forEach(obj => obj.description == "postal code" ? setNameToPostal(obj, loc.city == "" ? loc.principalSubdivision : loc.city) : null);
                        debug("]filtered infos")
                        debug(filtered)

                        if (filtered.length == 0) {
                            if (infos.length >= 1) {
                                facts = infos.map(obj => { return { "text": styleFact(obj.name, obj.description), "link": INVALIDLINK, "isGeoFact": true } })
                            }
                            needsWiki = false;
                            return null;
                        }

                        let red = []
                        let i = 0;
                        while (i < filtered.length) {
                            let curr = filtered[i];
                            let t = await fetch(WIKIDATA_URL + curr.wikidataId)
                                .then(res => res.json())
                                .then(out =>
                                    (out.success != 1 || "error" in out || !("enwiki" in out.entities[curr.wikidataId].sitelinks)) ?
                                    "" :
                                    processAndGetWikidataTitle(out, curr))

                            if (t != "" && red.indexOf(t) == -1) red.push(t);

                            i++;
                        }

                        return red.reverse().join("|")
                    }
                })
        })
}

function processAndGetWikidataTitle(data, obj) {
    let title = data.entities[obj.wikidataId].sitelinks.enwiki.title;

    if ("isPlaceFact" in obj) {
        if (placeWikidataTitles.indexOf(title) == -1) {
            debug("]place title processed: " + title)
            placeWikidataTitles.push(title)
        }
    } else debug("]geographic title processed: " + title)

    return encodeURIComponent(title)
}

async function btnClick(btn) {
    return new Promise(resolve => btn.onclick = () => resolve());
}

function getCorrectLocationDivForChallenge() {
    return document.querySelector('[alt="Correct location"]').parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
}

async function getLocationObjectGame() {
    const tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    const game_endpoint = "https://www.geoguessr.com/api/v3/games/" + tag
    const challenge_endpoint = "https://www.geoguessr.com/api/v3/challenges/" + tag + "/game"
    const api_url = isInChallange() ? challenge_endpoint : game_endpoint

    return fetch(api_url)
        .then(res => res.json())
        .then(out => {
            let guess_counter = out.player.guesses.length

            let lat = out.rounds[guess_counter - 1].lat;
            let lng = out.rounds[guess_counter - 1].lng;

            return getLocationFromLatLng(lat, lng);
        })
}

async function getLocationObjectBullseye() {
    const tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    const api_url = "https://game-server.geoguessr.com/api/bullseye/" + tag

    return fetch(api_url, { credentials: "include" })
        .then(res => res.json())
        .then(out => {
            let guess_counter = out.players[0].guesses.length

            let lat = out.rounds[guess_counter - 1].panorama.lat;
            let lng = out.rounds[guess_counter - 1].panorama.lng;

            return getLocationFromLatLng(lat, lng);
        })
}

async function getLocationObject() {
    return isInBullseye() ? getLocationObjectBullseye() : getLocationObjectGame()
}

function getNearByLocationsFromLatLng(lat, lng) {
    let api = OPENTRIP_URL + OpenTripMap_APIKEY + "&lat=" + lat + "&lon=" + lng
    return fetch(api)
        .then(res => res.json())
}

function getLocationFromLatLng(lat, lng) {
    let api = API_URL + "latitude=" + lat + "&longitude=" + lng + "&key=" + BigDataCloud_APIKEY
    return fetch(api)
        .then(res => res.json())
}

function getFactFromTitles(titles) {
    return fetch(WIKI_URL + titles)
        .then(res => res.json())
        .then(result => {

            facts = []
            let pages = result.query.pages;
            cleanPages(pages);

            debug("]cleaned pages");
            debug(pages)

            let keys = Object.keys(pages);
            if (keys.length == 0) return null

            let del = 0;

            keys.forEach(k => {
                if (facts.length >= Settings.MaximumFactCountToDisplay) return

                let fact = pages[k];
                if (fact == null) return

                let reduced = fact.extract;
                reduced = reduced.trimEnd("\n")
                if (reduced.endsWith("refer to:")) return

                if (reduced.length > Settings.MaximumFactMessageLength) {
                    let paragraphs = reduced.split(". ")
                    let j = 0
                    reduced = paragraphs.length != 0 ? "" : reduced

                    while (j < paragraphs.length && reduced.length <= Settings.MaximumFactMessageLength) {
                        reduced = reduced + ". " + paragraphs[j]
                        j++;
                    }

                    // TO-DO: Add "read more" button
                    //reduced = reduced.slice(0,Settings.MaximumFactMessageLength) + "..."
                }

                let f = {
                        "text": styleFact(fact.title, reduced),
                        "link": "https://en.wikipedia.org/?curid=" + fact.pageid,
                        "isGeoFact": placeWikidataTitles.indexOf(fact.title) == -1
                    }
                    //debug(f)
                facts.push(f)
            })

            return facts;
        });
}


function SetDisplayFact() {
    getTitlesFromLocation()
        .then(titles => {

            debug("]reduced titles result: " + titles)
            if (needsWiki) {
                getFactFromTitles(titles).then(facts => {
                    if (facts == null) {
                        facts = [{
                            "text": styleFact(titles.name, titles.description),
                            "link": INVALIDLINK,
                            "isGeoFact": true
                        }]
                    }
                    debug(facts)
                    setFactInnerHtml();
                })
            } else {
                needsWiki = true;
                if (titles != null) {
                    facts = [{
                        "text": titles,
                        "link": INVALIDLINK,
                        "isGeoFact": true
                    }]
                }
                setFactInnerHtml();
            }
        })
}

function getFactTitleColor(fact) {
    return fact.isGeoFact ? Settings.GeographyFactTitleColorName : Settings.FamousPlaceFactTitleColorName;
}

function getFactTitle(fact) {
    return fact.isGeoFact ? Settings.GeographyFactTitle : Settings.FamousPlaceFactTitle;
}

function getFactTextHtml(fact) {
    return `<div style="color: ${Settings.FactWikiTextColor}">` + fact.text.split(". ").reduce((prev, curr) => prev + "<br>" + curr) + "</div>";
}

function setFactInnerHtml() {
    const new_tab = Settings.OpenInNewTab ? ` target="_blank" rel="noopener noreferrer"` : ''
    const style_source_text = `color: ${Settings.SourceLinkColorName}; font-size: 12px;`;
    let str = facts
        .map((fact, i) => {
            return `<br><h2 style="color: ${getFactTitleColor(fact)}">${getFactTitle(fact)} Fact ${Settings.DisplayFactNumber ? (i+1) : ""}</h2><span style="${style_source_text}">(</span><u><a href="${fact.link}"${new_tab}; style="${style_source_text}"><i>source</i></a></u><span style="${style_source_text}">)</span><br><div style="text-align: justify;text-justify: inter-word;">${getFactTextHtml(fact)}</div>`
        })
        .join("<hr style='background: var(--ds-color-white-20, hsla(0,0%,100%,0.2)) ; height: .0625em ; border: 0 ; margin: 1rem 0 0.5rem 0'>")

    try {
        document.getElementById(_id_fact_div).innerHTML = str;
    } catch (error) { console.log(error); }
}

// 5 round game round summary div or null
function get5RoundGameSummaryDiv() {
    let div = document.getElementsByClassName(_class_roundResult_5roundGame);
    if (div.length == 0) return null
    else return div[0]
}

function set5RoundGameSummaryDivPlaceHolder() {
    let newDiv1 = document.createElement("div")
    let parent = get5RoundGameSummaryDiv();

    if (Settings.DisplayFactsBelowButtons) parent.parentElement.appendChild(newDiv1);
    else parent.insertBefore(newDiv1, parent.lastElementChild);

    newDiv1.innerHTML = SummaryLoadingPlaceHolderInnerHtml;
}

// Streak game round summary div or null
function getStreakGameSummaryDiv() {
    let div = document.getElementsByClassName(_class_roundResult_streakGame);
    if (div.length == 0) return null
    else return div[0]
}

function setStreakGameSummaryDivPlaceHolder() {
    let newDiv1 = document.createElement("div")
    let parent = getStreakGameSummaryDiv();

    if (Settings.DisplayFactsBelowButtons) parent.parentElement.appendChild(newDiv1);
    else parent.insertBefore(newDiv1, parent.lastElementChild);

    newDiv1.innerHTML = SummaryLoadingPlaceHolderInnerHtml;
}

// Bullseye round summary div or null
function getBullseyeGameSummaryDiv() {
    let div = document.getElementsByClassName(_class_roundResult_Bullseye);
    if (div.length == 0) return null
    else return div[0]
}

function setBullseyeGameSummaryDivPlaceHolder() {
    let newDiv1 = document.createElement("div")
    let parent = getBullseyeGameSummaryDiv();

    if (Settings.DisplayFactsBelowButtons) parent.appendChild(newDiv1);
    else parent.insertBefore(newDiv1, parent.lastElementChild);

    newDiv1.innerHTML = SummaryLoadingPlaceHolderInnerHtml;
}

function getBullseyeButtonDiv() {
    let div = document.getElementsByClassName(_class_nextButton_Bullseye);
    if (div.length == 0) return null
    else return div[0]
}

function setBullseyeButtonStyle() {
    let button = getBullseyeButtonDiv();
    button.style.padding = "var(--vertical-padding, 0.75rem) var(--horizontal-padding, 1.5rem)"
}

function factCheckStateAttempt(newDiv1) {
    if (document.getElementById(_id_fact_div) || !isValidGame() || !isInRoundResultPage()) return

    if (get5RoundGameSummaryDiv()) set5RoundGameSummaryDivPlaceHolder()
    else if (getStreakGameSummaryDiv()) setStreakGameSummaryDivPlaceHolder()
    else if (getBullseyeGameSummaryDiv()) setBullseyeGameSummaryDivPlaceHolder()

    if (getBullseyeButtonDiv()) setBullseyeButtonStyle()
};

function isInChallange() {
    return location.pathname.startsWith("/challenge/");
}

function isInBullseye() {
    return location.pathname.startsWith("/bullseye/");
}

function isInClassicGame() {
    return location.pathname.startsWith("/game/") || isInChallange();
}

function isValidGame() {
    return isInClassicGame() || isInBullseye();
}

function isInRoundResultPage() {
    if (isInClassicGame()) return !!document.querySelector('.result-layout_root__NfX12')
    else if (isInBullseye()) return !!document.querySelector('.round-score_container__avps2')
    return false
}

function isFactAlreadyChecked() {
    return sessionStorage.getItem("FactLocationChecked") != 0
}

function factCheckState() {
    if (isValidGame() && isInRoundResultPage() && !isFactAlreadyChecked()) {
        SetDisplayFact();
        checked = checked + 1;
        sessionStorage.setItem("FactLocationChecked", checked);
    } else if (isValidGame() && !isInRoundResultPage() && isFactAlreadyChecked()) {
        checked = 0;
        sessionStorage.setItem("FactLocationChecked", checked)
    };
}

function tryFactCheck() {
    factCheckState();

    setTimeout(factCheckState, 250);
    setTimeout(factCheckState, 500);
    setTimeout(factCheckState, 1200);
    setTimeout(factCheckState, 2000);

    setTimeout(factCheckStateAttempt, 300);
    setTimeout(factCheckStateAttempt, 500);
    setTimeout(factCheckStateAttempt, 1200);
    setTimeout(factCheckStateAttempt, 2000);
};

document.body.addEventListener('transitionend', () => {
    if (isValidGame() && isInRoundResultPage() != isFactAlreadyChecked())
        tryFactCheck()
});
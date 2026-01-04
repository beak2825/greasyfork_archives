// ==UserScript==
// @name         Geohub Country Streaks United
// @version      0.3.0
// @author       Jupaoqq
// @license      MIT
// @description  A modification to the geoguessr country streaks united created by Jupaoqq at: https://greasyfork.org/en/scripts/453710-geoguessr-country-streaks-united
// @match        https://www.geohub.gg/*
// @icon         https://www.geohub.gg/favicon.ico
// @namespace    geohub-country-streaks
// @downloadURL https://update.greasyfork.org/scripts/478296/Geohub%20Country%20Streaks%20United.user.js
// @updateURL https://update.greasyfork.org/scripts/478296/Geohub%20Country%20Streaks%20United.meta.js
// ==/UserScript==



// Credits: victheturtle, subsymmetry, slashP, emilyapocalypse

// ------------------------------------------------- MUST READ BELOW -------------------------------------------------

let ENABLED_ON_CHALLENGES = false; // Replace with true or false
let API_Key = ''; // Replace ENTER_API_KEY_HERE with your API key (so keep the quote marks)
let AUTOMATIC = true; // Replace with false for a manual counter. Without an API key, the counter will still be manual

// Map number: e.g. Capitals of the World (Bing Satellite [20]), link https://www.geoguessr.com/maps/62062fcf0f38ba000190be65, has map number of 62062fcf0f38ba000190be65.

/**
 * Manually Save Locations:
 * Press the z key (or change it to any other key) or click "save location" to save the location into a map of yours.
 *
 * You may replace manualKey with any key on your keyboard (by default it's key z).
 * e.g. do "let manualKey = 'x'; " will remap the key to x instead.
 * Press this key to save this location when the round result appears.
 *
 * You must replace MAP_LINK_HERE with your map number.
 * e.g. do "let manualSave = "61a189a5531c7c4d38a6ae1"; " will save locations to map https://www.geoguessr.com/maps/61a189a5531c7c4d38a6ae1
 * Such map must contain at least 5 unique locations.
 *
 */

let manualSave = "MAP_LINK_HERE";
let manualKey = 'z';

// --------------------------------------------------------------------------------------------------------------------


/**
 * Advanced Options
 */

// More than one option below may be set to true, and multiple values may use the same map number.

/**
 * goodGuesses:
 * For locations that you guessed the country correctly and received more points than the cutoff specified below.
 *
 * Replace MAP_LINK_HERE with your map number, e.g. do "let goodGuesses = "61a189a5531c7c4d38a6ae1"; "
 * Such map must contain at least 5 unique locations.
 *
 * To turn in on, do "let collectGoodGuesses = true;" To turn it off, do "let collectGoodGuesses = false;"
 * To change cutoff, do e.g. "let cutOffGood = 3500;" so every score higher than 3500 points (and you have to guess the country correctly) goes to this map.)
 */

let goodGuesses = "MAP_LINK_HERE";
let collectGoodGuesses = false;
let cutOffGood = 4000;

/**
 * okGuesses:
 * For locations that you guessed the country correctly and received less points than the cutoff specified below.
 *
 * Replace MAP_LINK_HERE with your map number, e.g. do "let okGuesses = "61a189a5531c7c4d38a6ae1"; "
 * Such map must contain at least 5 unique locations.
 *
 * To turn in on, do "let collectOkGuesses = true;" To turn it off, do "let collectOkGuesses = false;"
 * To change cutoff, do e.g. "let cutOffOk = 3500;" so every score lower than 3500 points (and you have to guess the country correctly) goes to this map.)
 */

let okGuesses = "MAP_LINK_HERE";
let collectOkGuesses = false;
let cutoffOk = 4000;

/**
 * badGuesses:
 * For locations that you guessed the country incorrectly.
 *
 * Replace MAP_LINK_HERE with your map number, e.g. do "let badGuesses = "61a189a5531c7c4d38a6ae1"; "
 * Such map must contain at least 5 unique locations.
 *
 * To turn in on, do "let collectBadGuesses = true;" To turn it off, do "let collectBadGuesses = false;"
 */

let badGuesses = "MAP_LINK_HERE";
let collectBadGuesses = false;

/**
 * GoodText: shows this text in result screen if you guess the country correctly with score exceeding your desired cutoff score.
 * OkText: shows this text in result screen if you guess the country correctly with score below your desired cutoff score.
 * BadText: shows this text in result screen if you guess the country incorrectly.
 * SaveText: shows this text in result screen if you manually saved the location.
 * defaultText: shows this text in result screen to remind you the manual option.
 * All of these fields are customizable, you may replace it with your custom text.
 */

let GoodText = "Location has been saved to your Good Guesses Map.";
let OkText = "Location has been saved to your Ok Guesses Map.";
let BadText = "Location has been saved to your Bad Guesses Map.";
let SaveText = "Location has been manually saved to your Map.";
let defaultText = "";

// Do not need to modify any code below.

let global_loc;
let LOC_SAVE = "save loc";

if (sessionStorage.getItem("Streak") == null) {
    sessionStorage.setItem("Streak", 0);
};
if (sessionStorage.getItem("StreakBackup") == null) {
    sessionStorage.setItem("StreakBackup", 0);
};
if (sessionStorage.getItem("Checked") == null) {
    sessionStorage.setItem("Checked", 0);
};

let streak = parseInt(sessionStorage.getItem("Streak"), 10);
let last_guess = [0,0];
const ERROR_RESP = -1000000;

var CountryDict = {
    AF: 'AF',
    AX: 'FI', // Aland Islands
    AL: 'AL',
    DZ: 'DZ',
    AS: 'US', // American Samoa
    AD: 'AD',
    AO: 'AO',
    AI: 'GB', // Anguilla
    AQ: 'AQ', // Antarctica
    AG: 'AG',
    AR: 'AR',
    AM: 'AM',
    AW: 'NL', // Aruba
    AU: 'AU',
    AT: 'AT',
    AZ: 'AZ',
    BS: 'BS',
    BH: 'BH',
    BD: 'BD',
    BB: 'BB',
    BY: 'BY',
    BE: 'BE',
    BZ: 'BZ',
    BJ: 'BJ',
    BM: 'GB', // Bermuda
    BT: 'BT',
    BO: 'BO',
    BQ: 'NL', // Bonaire, Sint Eustatius, Saba
    BA: 'BA',
    BW: 'BW',
    BV: 'NO', // Bouvet Island
    BR: 'BR',
    IO: 'GB', // British Indian Ocean Territory
    BN: 'BN',
    BG: 'BG',
    BF: 'BF',
    BI: 'BI',
    KH: 'KH',
    CM: 'CM',
    CA: 'CA',
    CV: 'CV',
    KY: 'UK', // Cayman Islands
    CF: 'CF',
    TD: 'TD',
    CL: 'CL',
    CN: 'CN',
    CX: 'AU', // Christmas Islands
    CC: 'AU', // Cocos (Keeling) Islands
    CO: 'CO',
    KM: 'KM',
    CG: 'CG',
    CD: 'CD',
    CK: 'NZ', // Cook Islands
    CR: 'CR',
    CI: 'CI',
    HR: 'HR',
    CU: 'CU',
    CW: 'NL', // Curacao
    CY: 'CY',
    CZ: 'CZ',
    DK: 'DK',
    DJ: 'DJ',
    DM: 'DM',
    DO: 'DO',
    EC: 'EC',
    EG: 'EG',
    SV: 'SV',
    GQ: 'GQ',
    ER: 'ER',
    EE: 'EE',
    ET: 'ET',
    FK: 'GB', // Falkland Islands
    FO: 'DK', // Faroe Islands
    FJ: 'FJ',
    FI: 'FI',
    FR: 'FR',
    GF: 'FR', // French Guiana
    PF: 'FR', // French Polynesia
    TF: 'FR', // French Southern Territories
    GA: 'GA',
    GM: 'GM',
    GE: 'GE',
    DE: 'DE',
    GH: 'GH',
    GI: 'UK', // Gibraltar
    GR: 'GR',
    GL: 'DK', // Greenland
    GD: 'GD',
    GP: 'FR', // Guadeloupe
    GU: 'US', // Guam
    GT: 'GT',
    GG: 'GB', // Guernsey
    GN: 'GN',
    GW: 'GW',
    GY: 'GY',
    HT: 'HT',
    HM: 'AU', // Heard Island and McDonald Islands
    VA: 'VA',
    HN: 'HN',
    HK: 'CN', // Hong Kong
    HU: 'HU',
    IS: 'IS',
    IN: 'IN',
    ID: 'ID',
    IR: 'IR',
    IQ: 'IQ',
    IE: 'IE',
    IM: 'GB', // Isle of Man
    IL: 'IL',
    IT: 'IT',
    JM: 'JM',
    JP: 'JP',
    JE: 'GB', // Jersey
    JO: 'JO',
    KZ: 'KZ',
    KE: 'KE',
    KI: 'KI',
    KR: 'KR',
    KW: 'KW',
    KG: 'KG',
    LA: 'LA',
    LV: 'LV',
    LB: 'LB',
    LS: 'LS',
    LR: 'LR',
    LY: 'LY',
    LI: 'LI',
    LT: 'LT',
    LU: 'LU',
    MO: 'CN', // Macao
    MK: 'MK',
    MG: 'MG',
    MW: 'MW',
    MY: 'MY',
    MV: 'MV',
    ML: 'ML',
    MT: 'MT',
    MH: 'MH',
    MQ: 'FR', // Martinique
    MR: 'MR',
    MU: 'MU',
    YT: 'FR', // Mayotte
    MX: 'MX',
    FM: 'FM',
    MD: 'MD',
    MC: 'MC',
    MN: 'MN',
    ME: 'ME',
    MS: 'GB', // Montserrat
    MA: 'MA',
    MZ: 'MZ',
    MM: 'MM',
    NA: 'NA',
    NR: 'NR',
    NP: 'NP',
    NL: 'NL',
    AN: 'NL', // Netherlands Antilles
    NC: 'FR', // New Caledonia
    NZ: 'NZ',
    NI: 'NI',
    NE: 'NE',
    NG: 'NG',
    NU: 'NZ', // Niue
    NF: 'AU', // Norfolk Island
    MP: 'US', // Northern Mariana Islands
    NO: 'NO',
    OM: 'OM',
    PK: 'PK',
    PW: 'PW',
    PS: 'IL', // Palestine
    PA: 'PA',
    PG: 'PG',
    PY: 'PY',
    PE: 'PE',
    PH: 'PH',
    PN: 'GB', // Pitcairn
    PL: 'PL',
    PT: 'PT',
    PR: 'US', // Puerto Rico
    QA: 'QA',
    RE: 'FR', // Reunion
    RO: 'RO',
    RU: 'RU',
    RW: 'RW',
    BL: 'FR', // Saint Barthelemy
    SH: 'GB', // Saint Helena
    KN: 'KN',
    LC: 'LC',
    MF: 'FR', // Saint Martin
    PM: 'FR', // Saint Pierre and Miquelon
    VC: 'VC',
    WS: 'WS',
    SM: 'SM',
    ST: 'ST',
    SA: 'SA',
    SN: 'SN',
    RS: 'RS',
    SC: 'SC',
    SL: 'SL',
    SG: 'SG',
    SX: 'NL', // Sint Maarten
    SK: 'SK',
    SI: 'SI',
    SB: 'SB',
    SO: 'SO',
    ZA: 'ZA',
    GS: 'GB', // South Georgia and the South Sandwich Islands
    ES: 'ES',
    LK: 'LK',
    SD: 'SD',
    SR: 'SR',
    SJ: 'NO', // Svalbard and Jan Mayen
    SZ: 'SZ',
    SE: 'SE',
    CH: 'CH',
    SY: 'SY',
    TW: 'TW', // Taiwan
    TJ: 'TJ',
    TZ: 'TZ',
    TH: 'TH',
    TL: 'TL',
    TG: 'TG',
    TK: 'NZ', // Tokelau
    TO: 'TO',
    TT: 'TT',
    TN: 'TN',
    TR: 'TR',
    TM: 'TM',
    TC: 'GB', // Turcs and Caicos Islands
    TV: 'TV',
    UG: 'UG',
    UA: 'UA',
    AE: 'AE',
    GB: 'GB',
    US: 'US',
    UM: 'US', // US Minor Outlying Islands
    UY: 'UY',
    UZ: 'UZ',
    VU: 'VU',
    VE: 'VE',
    VN: 'VN',
    VG: 'GB', // British Virgin Islands
    VI: 'US', // US Virgin Islands
    WF: 'FR', // Wallis and Futuna
    EH: 'MA', // Western Sahara
    YE: 'YE',
    ZM: 'ZM',
    ZW: 'ZW'
};

function hex2a(hexx) {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
    {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}


if (AUTOMATIC && (API_Key.length <= 24 || API_Key.match("^[a-fA-F0-9_]*$") == null)) {
    AUTOMATIC = false;
};

function checkGameMode() {
    return (location.pathname.startsWith("/game/") || (ENABLED_ON_CHALLENGES && location.pathname.startsWith("/challenge/")));
};

let _cndic = {};
function cn(classNameStart) { // cn("status_section__") -> "status_section__8uP8o"
    let memorized = _cndic[classNameStart];
    if (memorized != null) return memorized;
    let selected = document.querySelector(`div[class*="${classNameStart}"]`);
    if (selected == null) return classNameStart;
    for (let className of selected.classList) {
        if (className.startsWith(classNameStart)) {
            _cndic[classNameStart] = className;
            return className;
        }
    }
}

function geoguessrStyle(number) {
    return `<div class="${cn("guess-description-distance_distanceLabel__")}">
                <div class="${cn("slanted-wrapper_root__")} ${cn("slanted-wrapper_variantWhiteTransparent__")} ${cn("slanted-wrapper_roundnessSmall__")}">
                    <div class="${cn("slanted-wrapper_start__")} ${cn("slanted-wrapper_right__")}"></div>
                    <div class="${cn("guess-description-distance_distanceValue__")}">${number}</div>
                    <div class="${cn("slanted-wrapper_end__")} ${cn("slanted-wrapper_right__")}"></div>
                </div>
            </div>`;
};

function addCounter() {
    if (!checkGameMode()) {
        return;
    };
    /*
    let status_length = document.getElementsByClassName(cn("status_section__")).length;
    if (document.getElementById("country-streak") == null && status_length >= 3) {
        let position = (status_length >= 4 && document.getElementsByClassName(cn("status_label__"))[3].innerText == "TIME LEFT") ? 4 : 3;
        let newDiv0 = document.createElement("div");
        newDiv0.className = cn('status_section__');
        let statusBar = document.getElementsByClassName(cn("status_inner__"))[0];
        statusBar.insertBefore(newDiv0, statusBar.children[position]);
        newDiv0.innerHTML = `<div class="${cn("status_label__")}">Streak</div>
                             <div id="country-streak" class="${cn("status_value__")}">${streak}</div>`;
    };
    */

    if (document.getElementById("country-streak") == null) {
        let mapNameElement = document.getElementsByClassName("mapName")[0];
        if (mapNameElement) {
            let newDiv0 = document.createElement("div");
            newDiv0.className = "infoSection";


            let statusBar = mapNameElement.parentElement;

            statusBar.insertBefore(newDiv0, mapNameElement);
            newDiv0.innerHTML = `<div class="label"><span>Streak</span></div><div class="value"><span id="country-streak">${streak}</span></div>`;
        }
    }
};

function addStreakRoundResult() {
    console.log("addstreakresult");
    const wrapper = document.querySelector('div[class*="pointsWrapper"]');
    if (document.getElementById("country-streak2") == null && !!wrapper && !document.querySelector('div[class="buttons-wrapper"]')) {
        console.log("round result");
        let pageProps = JSON.parse(document.getElementById("__NEXT_DATA__").innerHTML).props.pageProps;
        if (pageProps.gamePlayedByCurrentUser != null && pageProps.gamePlayedByCurrentUser.mode == "streak") return;
        let newDiv = document.createElement("div");

        wrapper.parentElement.insertBefore(newDiv, wrapper.parentElement.children[3]);

        //wrapper.parentElement.appendChild(newDiv);
        //document.querySelector('div[data-qa="guess-description"]').appendChild(newDiv);
        newDiv.innerHTML = `<div id="country-streak2" style="text-align:center;margin-top:10px;"><h2><i>Country Streak: ${streak}</i></h2></div>`;
    };
};

function addStreakGameSummary() {
    if (document.getElementById("country-streak2") == null && !!document.querySelector('div[class="buttons-wrapper"]')) {
        console.log("game summary");
        let newDiv = document.createElement("div");
        //let progressSection = document.getElementsByClassName(cn("standard-final-result_progressSection__"))[0];
        const wrapper = document.querySelector('div[class*="pointsWrapper"]');
        wrapper.parentElement.insertBefore(newDiv, wrapper.parentElement.children[2]);

       // progressSection.parentNode.insertBefore(newDiv, progressSection.parentNode.children[2]);
       // progressSection.style.marginTop = "10px";
       // progressSection.style.marginBottom = "10px";
        newDiv.innerHTML = `<div id="country-streak2" style="text-align:center;margin-top:10px;"><h2><i>Country Streak: ${streak}</i></h2></div>`;
    };
};

function updateStreak(newStreak, cond, guessType) {
    if (newStreak === LOC_SAVE) {
        if (document.getElementById("country-streak2") != null && (!!document.querySelector('div[data-qa="guess-description"]'))) {
            document.getElementById("country-streak2").innerHTML = SaveText;
        }
        return;
    }
    else if (newStreak === ERROR_RESP) {
        if (document.getElementById("country-streak2") != null && (!!document.querySelector('div[data-qa="guess-description"]'))) {
            document.getElementById("country-streak2").innerHTML =
                `<div><i>Country codes could not be fetched. If your API key is new, it should activate soon.</i></div>
                 <div><i>Check for typos in the API key. You might also see this message if bigdatacloud is down</i></div>
                 <div><i>or in the unlikely event that you have exceeded you quota limit of 50,000 requests.</i></div>
                 <div><i>In the meantime, you can press 1 to count the country as correct, or press 0 otherwise.</i></div>`;
        }
        return;
    }
    sessionStorage.setItem("Streak", newStreak);
    console.log(newStreak);
    if (!(streak > 0 && newStreak == 0)) {
        sessionStorage.setItem("StreakBackup", newStreak);
    };
    if (document.getElementById("country-streak") != null) {
        document.getElementById("country-streak").innerHTML = newStreak;
    };
    if (document.getElementById("country-streak2") != null
        && (!!document.querySelector('div[data-qa="guess-description"]') || !!document.querySelector('div[class*="standard-final-result_section__"]'))) {

        let moreText1 = "";
        let moreText2 = "";
        if (collectGoodGuesses && guessType === "PERFECT")
        {
            moreText1 = GoodText;
        }

        else if (collectOkGuesses && guessType === "BAD")
        {
            moreText1 = OkText;
        }

        if (collectBadGuesses && guessType === "MISS")
        {
            moreText2 = BadText;
        }

        if (manualSave !== "MAP_LINK_HERE")
        {
            defaultText = `You may press the ${manualKey} key on your keyboard to save this location.`
        }

        document.getElementById("country-streak2").innerHTML = `<h2><i>Country Streak: ${newStreak}</i></h2> <br> ${defaultText} <br> ${moreText1}`;
        if (newStreak == 0 && !cond) {
            if (streak >= 2) {
                document.getElementById("country-streak2").innerHTML = `<h2><i>Country Streak: 0</i></h2>
                    Your streak ended after correctly guessing ${geoguessrStyle(streak)} countries in a row. <br> ${defaultText} <br> ${moreText2}`;
            } else if (streak == 1) {
                document.getElementById("country-streak2").innerHTML = `<h2><i>Country Streak: 0</i></h2>
                    Your streak ended after correctly guessing ${geoguessrStyle(1)} country. <br> ${defaultText} <br> ${moreText2}`;
            }
            else {
                document.getElementById("country-streak2").innerHTML = `<br><h2><i>Country Streak: 0</i></h2>
                    Your streak ended after correctly guessing ${geoguessrStyle(0)} country. <br> ${defaultText} <br> ${moreText2}`;
            };
        };
    };
    streak = newStreak;
};

async function getUserAsync(coords) {
    if (coords[0] <= -85.05) {
        return 'AQ';
    };
    let api = "https://api.bigdatacloud.net/data/reverse-geocode?latitude="+coords[0]+"&longitude="+coords[1]+"&localityLanguage=en&key="+API_Key
    let response = await fetch(api)
    .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
    .then(out => (out === ERROR_RESP) ? ERROR_RESP : CountryDict[out.countryCode]);
    return response;
};

function check() {
    console.log("checking");
    const game_tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    let api_url = ""
    if (location.pathname.startsWith("/game/")) {
        api_url = "https://geo-hub.vercel.app/api/games/"+game_tag;
    } else if (location.pathname.startsWith("/challenge/")) {
        api_url = "https://geo-hub.vercel.app/api/challenges/"+game_tag;
    };
    fetch(api_url)
        .then(res => res.json())
        .then((out) => {
        let guess_counter = out.game.guesses.length;
        let guess = [out.game.guesses[guess_counter-1].lat,out.game.guesses[guess_counter-1].lng];
        if (guess[0] == last_guess[0] && guess[1] == last_guess[1]) {
            return;
        };
        last_guess = guess;
        let round = [out.game.rounds[guess_counter-1].lat,out.game.rounds[guess_counter-1].lng];
        global_loc = out.game.rounds[guess_counter-1];
        getUserAsync(guess)
            .then(gue => {
            getUserAsync(round)
                .then(loc => {
                if (loc == ERROR_RESP || gue == ERROR_RESP) {
                    updateStreak(ERROR_RESP, true, "");
                } else if (loc == gue) {
                    let passStr = "";
                    if (out.game.guesses[guess_counter-1].points < cutoffOk)
                    {
                        if (collectOkGuesses && okGuesses !== "MAP_LINK_HERE")
                        {
                            toMap(global_loc, "BAD");
                            passStr = "BAD";
                        }
                    }
                    if (out.game.guesses[guess_counter-1].points > cutOffGood)
                    {
                        if (collectGoodGuesses && goodGuesses !== "MAP_LINK_HERE")
                        {
                            toMap(global_loc, "PERFECT");
                            passStr = "PERFECT";
                        }
                    }
                    updateStreak(streak + 1, true, passStr);
                } else {
                    updateStreak(0, false, "MISS");
                    if (collectBadGuesses && badGuesses !== "MAP_LINK_HERE")
                    {
                        toMap(global_loc, "MISS");
                    }
                };
            });
        });
    }).catch(err => { throw err });
};

function doCheck() {
    console.log("doCheck");
    if (!document.querySelector('div[class*="pointsWrapper"]')) {
        sessionStorage.setItem("Checked", 0);
    } else if (sessionStorage.getItem("Checked") == 0) {
        check();
        sessionStorage.setItem("Checked", 1);
    }
};

function tryAddCounter() {
    addCounter();
    for (let timeout of [400,1200,2000,3000,4000]) {
        if (document.getElementsByClassName(cn("status_section__")).length == 0) {
            setTimeout(addCounter, timeout);
        };
    }
};

function tryAddCounterOnRefresh() {
    setTimeout(addCounter, 50);
    setTimeout(addCounter, 300);
};

function tryAddStreak() {
    if (!checkGameMode()) {
        return;
    };
    if (AUTOMATIC) {
        doCheck();
        for (let timeout of [250,500,1200,2000]) {
            setTimeout(doCheck, timeout);
        }
    };
    for (let timeout of [250,500,1200,2000]) {
        setTimeout(addStreakRoundResult, timeout);
        setTimeout(addStreakGameSummary, timeout);
    }
};

document.addEventListener('keypress', (e) => {
    let streakBackup = parseInt(sessionStorage.getItem("StreakBackup"), 10);
    switch (e.key) {
        case '1':
            updateStreak(streak + 1, true, "");
            break;
        case '2':
            updateStreak(streak - 1, true, "");
            break;
        case '8':
            updateStreak(streakBackup + 1, true, "");
            break;
        case manualKey:
            toMap(global_loc, "SAVE");
            updateStreak(LOC_SAVE, true, "");
            break;
        case '0':
            updateStreak(0, true, "");
            sessionStorage.setItem("StreakBackup", 0);
    };
});

document.addEventListener('click', tryAddCounter, false);
document.addEventListener('click', tryAddStreak, false);
document.addEventListener('keyup', (e) => { if (e.key === " ") { tryAddStreak(); } });
document.addEventListener('load', tryAddCounterOnRefresh(), false);

function toMap(loc, type)
{
    let coordinates = [];
    let pId;
    if (loc.panoId)
    {
        pId = hex2a(loc.panoId);
    }
    const coordinate = {
        heading: loc.heading,
        pitch: loc.pitch,
        zoom:  loc.zoom,
        panoId: pId,
        countryCode: loc.streakLocationCode || null,
        stateCode: null,
        lat: loc.lat,
        lng: loc.lng
    };
    coordinates.push(coordinate);


    const mapText = JSON.stringify({
        customCoordinates: coordinates
    });
    importLocations(mapText, type);
}

let mapDataFromClipboard = null;
let existingMap = null;

const getExistingMapData = (type) => {
    let mId;
    if (type == "PERFECT")
    {
        mId = goodGuesses;
    }
    else if (type == "BAD")
    {
        mId = okGuesses;
    }
    else if (type == "MISS")
    {
        mId = badGuesses;
    }
    else if (type == "SAVE")
    {
        mId = manualSave;
    }
    return fetch(`https://www.geoguessr.com/api/v3/profiles/maps/${mId}`)
        .then(response => response.json())
        .then(map => ({
        id: map.id,
        name: map.name,
        description: map.description,
        avatar: map.avatar,
        highlighted: map.highlighted,
        published: map.published,
        customCoordinates: map.customCoordinates
    }));
}
const uniqueBy = (arr, selector) => {
    const flags = {};
    return arr.filter(entry => {
        if (flags[selector(entry)]) {
            return false;
        }
        flags[selector(entry)] = true;
        return true;
    });
};
const intersectionCount = (arr1, arr2, selector) => {
    var setB = new Set(arr2.map(selector));
    var intersection = arr1.map(selector).filter(x => setB.has(x));
    return intersection.length;
}
const exceptCount = (arr1, arr2, selector) => {
    var setB = new Set(arr2.map(selector));
    var except = arr1.map(selector).filter(x => !setB.has(x));
    return except.length;
}
const latLngSelector = x => `${x.lat},${x.lng}`;
const latLngHeadingPitchSelector = x => `${x.lat},${x.lng},${x.heading},${x.pitch}`;
const pluralize = (text, count) => count === 1 ? text : text + "s";

const importLocations = (text, type, mapAsObject) => {
    try {
        getExistingMapData(type)
            .then(map => {
            existingMap = map;
            mapDataFromClipboard = mapAsObject ? mapAsObject : JSON.parse(text);
            if (!mapDataFromClipboard?.customCoordinates?.length) {
                return;
            }
            const uniqueExistingLocations = uniqueBy(existingMap.customCoordinates, latLngSelector);
            const uniqueImportedLocations = uniqueBy(mapDataFromClipboard.customCoordinates, latLngSelector);
            const uniqueLocations = uniqueBy([...uniqueExistingLocations, ...uniqueImportedLocations], latLngSelector);
            const numberOfLocationsBeingAdded = uniqueLocations.length - uniqueExistingLocations.length;
            const numberOfUniqueLocationsImported = uniqueImportedLocations.length;
            const numberOfExactlyMatchingLocations = intersectionCount(uniqueExistingLocations, uniqueImportedLocations, latLngHeadingPitchSelector);
            const numberOfLocationsWithSameLatLng = intersectionCount(uniqueExistingLocations, uniqueImportedLocations, latLngSelector);
            const numberOfLocationEditions = numberOfLocationsWithSameLatLng - numberOfExactlyMatchingLocations;
            const numberOfLocationsNotInImportedList = exceptCount(uniqueExistingLocations, uniqueImportedLocations, latLngSelector);
            const numberOfLocationsNotInExistingMap = exceptCount(uniqueImportedLocations, uniqueExistingLocations, latLngSelector);

            const uniqueLocations2 = uniqueBy([...existingMap.customCoordinates, ...mapDataFromClipboard.customCoordinates], latLngSelector);
            const newMap = {
                ...existingMap,
                customCoordinates: uniqueLocations2
            };
            updateMap(newMap);

        }).catch(error => console.log(error));
    } catch (err) {
        console.log(err);
    }
}


function updateMap(newMap) {
    fetch(`https://www.geoguessr.com/api/v4/user-maps/drafts/${existingMap.id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMap)
    }).then(response => {
        if (!response.ok) {
            console.log("Something went wrong when calling the server.");
            return;
        }
        return response.json();
    }).then(mapResponse => {
        if (mapResponse.id) {
            console.log(`Map updated.`);
        }
    });
        fetch(`https://www.geoguessr.com/api/v3/profiles/maps/${existingMap.id}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMap)
    }).then(response => {
        if (!response.ok) {
            console.log("Something went wrong when calling the server.");
            return;
        }
        return response.json();
    }).then(mapResponse => {
        if (mapResponse.id) {
            console.log(`Map updated.`);
        }
    });
}
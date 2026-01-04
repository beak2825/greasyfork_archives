// ==UserScript==
// @name         Country Streak Counter
// @version      1.4.6
// @description  Adds a country streak counter to the GeoGuessr website
// @match        https://www.geoguessr.com/*
// @author       victheturtle#5159
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452760/Country%20Streak%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/452760/Country%20Streak%20Counter.meta.js
// ==/UserScript==
// Credits to subsymmetry for the original version of the Streak Counter

const AUTOMATIC = true;
//                ^^^^ Replace with false for a manual counter

const API_Key = 'INSERT_BIGDATACLOUD_API_KEY_HERE';
//               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Replace INSERT_BIGDATACLOUD_API_KEY_HERE with your API key (keep the quote marks)
//               THIS IS OPTIONAL: if you don't provide an API key, the script will use another method to get the country

const CountryDict = {
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

const ERROR_RESP = -1000000;
let streak = parseInt(sessionStorage.getItem("Streak") || 0, 10);

function checkGameMode() {
    return location.pathname.includes("/game/") || location.pathname.includes("/challenge/");
};

var style = document.createElement("style");
document.head.appendChild(style);
style.sheet.insertRule("div[class*='round-result_distanceIndicatorWrapper__'] { animation-delay: 0s, 0s; animation-duration: 0s, 0s; grid-area: 1 / 1 / span 1 / span 1; margin-right: 28px  }")
style.sheet.insertRule("div[class*='round-result_actions__'] { animation-delay: 0s; animation-duration: 0s; grid-area: 2 / 1 / span 1 / span 3; margin: 0px; margin-top: 10px; margin-bottom: 10px }")
style.sheet.insertRule("div[class*='round-result_pointsIndicatorWrapper__'] { animation-delay: 0s, 0s; animation-duration: 0s, 0s; grid-area: 1 / 2 / span 1 / span 1; margin-right: 28px }")
style.sheet.insertRule("div[class*='map-pin_largeMapPin__'] { height: 2rem; width: 2rem; margin-left: -1rem; margin-top: -1rem }")
style.sheet.insertRule("p[class*='round-result_label__'] { display: none }")
style.sheet.insertRule("div[class*='results-confetti_wrapper__'] { visibility: hidden }")
style.sheet.insertRule("div[class*='round-result_wrapper__'] { align-self: center; display: grid; flex-wrap: wrap }")
style.sheet.insertRule("div[class*='result-layout_contentNew__'] { display: flex; justify-content: center }")
style.sheet.insertRule("p[class*='standard-final-result_spacebarLabel__'] { display: none }")
style.sheet.insertRule("div[class*='standard-final-result_wrapper__'] { align-items: normal; justify-content: center }")
style.sheet.insertRule("div[class*='round-result_topPlayersButton__'] { position: absolute; bottom: 9rem }")
style.sheet.insertRule("div[class*='shadow-text_positiveTextShadow_CUSTOM_1_'] { text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-green-50),0 -.25rem .5rem var(--ds-color-green-50),-.25rem .5rem .5rem #77df9b,0 0.375rem 2rem var(--ds-color-green-50),0 0 0 var(--ds-color-green-50),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-green-50) }")
style.sheet.insertRule("div[class*='shadow-text_negativeTextShadow_CUSTOM_1_'] { text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-red-50),0 -.25rem .5rem var(--ds-color-red-50),-.25rem .5rem .5rem #b45862,0 0.375rem 2rem var(--ds-color-red-50),0 0 0 var(--ds-color-red-50),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-red-50) }")
style.sheet.insertRule("a[href*='github'] { display: none }");

function addStreakStatusBar() {
    const status_length = document.getElementsByClassName(cn("status_section__")).length;
    if (document.getElementById("country-streak") == null && status_length >= 3) {
        const newDiv = document.createElement("div");
        newDiv.className = cn('status_section__');
        newDiv.innerHTML = `<div class="${cn("status_label__")}">Streak</div>
        <div id="country-streak" class="${cn("status_value__")}">${streak}</div>`;
        const statusBar = document.getElementsByClassName(cn("status_inner__"))[0];
        statusBar.insertBefore(newDiv, statusBar.children[3]);
    };
};

const newFormat = (streak, positive) => `
    <div class="${cn("round-result_distanceUnitIndicator__")}">
      <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">${(!positive) ? "Lost at" : "Streak"}&nbsp;</div>
    </div>
    <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">
      <div><div>${streak}</div></div>
    </div>
`

const newFormatSummary = (streak, positive) => `
      <div class="${cn("round-result_distanceUnitIndicator__")}">
        <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">${(!positive) ? "Streak lost at" : "Country streak"}&nbsp;</div>
      </div>
      <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">
        <div><div>${streak}</div></div>
      </div>
`

function addStreakRoundResult() {
    if (document.getElementById("country-streak2") == null && !!document.querySelector('div[class*="round-result_distanceIndicatorWrapper__"]')) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div id="country-streak2" class="${cn("round-result_distanceWrapper__")}">${newFormat(streak, true)}</div>`;
        newDiv.style = "grid-area: 1 / 3 / span 1 / span 1; ";
        document.querySelector('div[class*="round-result_wrapper__"]').appendChild(newDiv);
    };
};

function addStreakGameSummary() {
    if (document.getElementById("country-streak3") == null && !!document.querySelector('div[class*="result-overlay_overlayTotalScore__"]')
        /*&& !document.querySelector('div[class*="result-overlay_overlayQuickPlayProgress__"]')*/) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div id="country-streak3" class="${cn("round-result_distanceWrapper__")}">${newFormatSummary(streak, true)}</div>`;
        newDiv.style = "display: flex; align-items: center;";
        const totalScore = document.querySelector('div[class*="result-overlay_overlayTotalScore__"]');
        totalScore.parentNode.insertBefore(newDiv, totalScore.parentNode.children[1]);
        totalScore.style.marginTop = "-20px";
    };
};

function updateStreak(newStreak) {
    if (newStreak === ERROR_RESP) {
        if (document.getElementById("country-streak2") != null && !!document.querySelector('div[class*="round-result_distanceIndicatorWrapper__"]')) {
            document.getElementById("country-streak2").innerHTML = "";
        }
        return;
    }
    sessionStorage.setItem("Streak", newStreak);
    if (!(streak > 0 && newStreak == 0)) {
        sessionStorage.setItem("StreakBackup", newStreak);
    };
    if (document.getElementById("country-streak") != null) {
        document.getElementById("country-streak").innerHTML = newStreak;
    };
    if (document.getElementById("country-streak2") != null) {
        document.getElementById("country-streak2").innerHTML = newFormat(newStreak, true);
        if (newStreak == 0 && streak > 0) {
            document.getElementById("country-streak2").innerHTML = newFormat(streak, false);
        };
    };
    if (document.getElementById("country-streak3") != null) {
        document.getElementById("country-streak3").innerHTML = newFormatSummary(newStreak, true);
        if (newStreak == 0 && streak > 0) {
            document.getElementById("country-streak3").innerHTML = newFormatSummary(streak, false);
        };
    };
    streak = newStreak;
};

async function getCountryCode(coords) {
    if (coords[0] <= -85.05) return 'AQ';
    if (API_Key.toLowerCase().match("^(bdc_)?[a-f0-9]{32}$") != null) {
        const api = "https://api.bigdatacloud.net/data/reverse-geocode?latitude="+coords.lat+"&longitude="+coords.lng+"&localityLanguage=en&key="+API_Key;
        return await fetch(api)
            .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
            .then(out => (out === ERROR_RESP) ? ERROR_RESP : CountryDict[out.countryCode]);
    } else {
        const api = `https://nominatim.openstreetmap.org/reverse.php?lat=${coords.lat}&lon=${coords.lng}&zoom=21&format=jsonv2&accept-language=en`;
        return await fetch(api)
            .then(res => (res.status !== 200) ? ERROR_RESP : res.json())
            .then(out => (out === ERROR_RESP) ? ERROR_RESP : CountryDict[out?.address?.country_code?.toUpperCase()]);
    }
};

let lastGuess = { lat: 91, lng: 0 };
function check() {
    const gameTag = location.href.substring(location.href.lastIndexOf('/') + 1)
    let apiUrl = "https://www.geoguessr.com/api/v3/games/"+gameTag;
    if (location.pathname.includes("/challenge/")) {
        apiUrl = "https://www.geoguessr.com/api/v3/challenges/"+gameTag+"/game";
    };
    fetch(apiUrl)
    .then(res => res.json())
    .then((out) => {
        const guessCounter = out.player.guesses.length;
        const round = out.rounds[guessCounter-1];
        const guess = out.player.guesses[guessCounter-1];
        if (guess.lat == lastGuess.lat && guess.lng == lastGuess.lng) return;
        lastGuess = guess;
        Promise.all([getCountryCode(guess), getCountryCode(round)]).then(codes => {
            if (codes[0] == ERROR_RESP || codes[1] == ERROR_RESP) {
                updateStreak(ERROR_RESP);
            } else if (codes[0] == codes[1]) {
                updateStreak(streak + 1);
            } else {
                updateStreak(0);
            };
        });
    }).catch(err => { throw err });
};

function doCheck() {
    if (!document.querySelector('div[class*="result-layout_root__"]')) {
        sessionStorage.setItem("Checked", 0);
    } else if ((sessionStorage.getItem("Checked") || 0) == 0) {
        check();
        sessionStorage.setItem("Checked", 1);
    }
};

let lastDoCheckCall = 0;
new MutationObserver(async (mutations) => {
    if (!checkGameMode() || lastDoCheckCall >= (Date.now() - 50)) return;
    lastDoCheckCall = Date.now();
    await scanStyles()
    if (AUTOMATIC) doCheck();
    addStreakStatusBar();
    addStreakRoundResult();
    addStreakGameSummary();
}).observe(document.body, { subtree: true, childList: true });

document.addEventListener('keypress', (e) => {
    if (e.key == '1') {
        updateStreak(streak + 1);
    } else if (e.key == '2') {
        updateStreak(streak - 1);
    } else if (e.key == '8') {
        const streakBackup = parseInt(sessionStorage.getItem("StreakBackup") || 0, 10);
        updateStreak(streakBackup + 1);
    } else if (e.key == '0') {
        updateStreak(0);
        sessionStorage.setItem("StreakBackup", 0);
    };
});

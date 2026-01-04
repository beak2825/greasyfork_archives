// ==UserScript==
// @name         GeoGuessr Country Streaks (Settings Page)
// @version      0.4.1
// @author       Han75, Jupaoqq
// @license      MIT
// @description  A fork of Jupaoqq's GeoGuessr country streak counter. Count streaks and save results to your maps. Includes a preferences page for ease of use. 
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    https://greasyfork.org/en/users/973646
// @downloadURL https://update.greasyfork.org/scripts/455958/GeoGuessr%20Country%20Streaks%20%28Settings%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455958/GeoGuessr%20Country%20Streaks%20%28Settings%20Page%29.meta.js
// ==/UserScript==
 
// Credits: victheturtle, subsymmetry, slashP, emilyapocalypse
 
// ------------------------------------------------- MUST READ BELOW -------------------------------------------------


/**
 * This version of the script is modified so that these settings can be changed at any time from the preferences page 
 * To open the preferences page, simply click on the score counter icon while in game,
 * or click on the tab that reads "Open Streak Counter Preferences" from the round results.
 * Alternatively, you can change the values below, but this is NOT RECOMMENDED
*/
let ENABLED_ON_CHALLENGES = false; // Replace with true or false
let API_Key = 'ENTER_API_KEY_HERE'; 

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

//Try to read saved api key from local storage
if(API_Key == 'ENTER_API_KEY_HERE'&&localStorage.getItem("_STREAK_API_KEY")!=null){
    //Comment out the line below if you want to use a different key. 
    API_Key = localStorage.getItem("_STREAK_API_KEY");
}else if(!(API_Key.length <= 24 || API_Key.match("^[a-fA-F0-9_]*$") == null)){
    localStorage.setItem("_STREAK_API_KEY",API_Key);
};
//try to read saved map ids from local storage
manualSave = (manualSave=="MAP_LINK_HERE"&&localStorage.getItem("_MANUAL_MAPID")!==null)?localStorage.getItem("_MANUAL_MAPID"):manualSave;
goodGuesses =  (goodGuesses=="MAP_LINK_HERE"&& localStorage.getItem("_GOOD_MAPID")!==null)?localStorage.getItem("_GOOD_MAPID"):goodGuesses;
okGuesses =  (okGuesses=="MAP_LINK_HERE"&& localStorage.getItem("_OK_MAPID")!==null)?localStorage.getItem("_OK_MAPID"):okGuesses;
badGuesses =  (badGuesses=="MAP_LINK_HERE"&& localStorage.getItem("_BAD_MAPID")!==null)?localStorage.getItem("_BAD_MAPID"):badGuesses;
//try to read "save to map" preferences from local storage
collectGoodGuesses = (localStorage.getItem("_STORE_GOOD")!==null)?(localStorage.getItem("_STORE_GOOD")=="true"):collectGoodGuesses;
collectOkGuesses = (localStorage.getItem("_STORE_OK")!==null)?(localStorage.getItem("_STORE_OK")=="true"):collectOkGuesses;
collectBadGuesses = (localStorage.getItem("_STORE_BAD")!==null)?(localStorage.getItem("_STORE_BAD")=="true"):collectBadGuesses;
//Try to read good and ok cutoffs from localStorage
cutOffGood = (localStorage.getItem("_CUTOFF_GOOD")!==null)?Number(localStorage.getItem("_CUTOFF_GOOOD")):cutOffGood;
cutoffOk = (localStorage.getItem("_CUTOFF_OK")!==null)?Number(localStorage.getItem("_CUTOFF_OK")):cutoffOk;



const MAPS_PUBLISHED = "https://www.geoguessr.com/api/v3/profiles/maps?page=0&count=40";
const MAPS_DRAFT     = "https://www.geoguessr.com/api/v4/user-maps/dangling-drafts";
//Gets all published and draft messages from geo api.
var myMaps = {};
getUserMaps();


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
/**
 * Opens a settings modal with the following functionality
 * 
 * 1) Add or change the API Key.
 * 2) Enable or disable saving good, ok, and bad guesses.
 * 3) Choose a map to save to from a dropdown for manual, good, ok, and bad.
 * The preferences are saved to localStorage, meaning they are persistent and are remembered upon reload or restart.
 * The settings window is accessed by clicking on the current streak indicator and by clicking a button on the round summary and game overview. 
 */
function openSettings(){
    if(document.getElementById("streaks-settings-container")!=null){
        document.getElementById("streaks-settings-container").style.display="flex";
    }else{
    let containerCSS = `position:absolute; display:flex; justify-content:center; align-items:center; z-index:1; width:100%; height:100%;`;
    let modalCSS=`background-color: #1e1d56; color:#fafafa; display:flex; flex-direction:column; width:100vmin;`;
    let modalContentCSS= `display:flex;flex-direction:column;justify-content:center;`;
    let headingCSS =  `text-align:center; font-weight:bold;`;
    let spanStyle = `display: flex; color: #aaa; float: right; font-size: 28px; margin-right: 1vmin;font-weight: bold; justify-content: flex-end;cursor:pointer;`;
    let bodyCSS= ` display:flex; flex-direction:column;`;
    let html = 
    `
    <style>
    .help-tip{
        position: absolute;
        top: -5px;
        right: -28px;
        text-align: center;
        background-color: #BCDBEA;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: 14px;
        line-height: 26px;
        cursor: default;
    }
    
    .help-tip:before{
        content:'?';
        font-weight: bold;
        color:#222;
    }
    
    .help-tip:hover p{
        display:block;
        transform-origin: 100% 0%;
    
        -webkit-animation: fadeIn1 0.3s ease-in-out;
        animation: fadeIn1 0.3s ease-in-out;
    
    }
    
    .help-tip p{    /* The tooltip */
        display: none;
        text-align: left;
        background-color: #1E2021;
        padding: 20px;
        width: 300px;
        position: absolute;
        border-radius: 3px;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
        right: -4px;
        color: #FFF;
        font-size: 13px;
        line-height: 1.4;
    }
    
    .help-tip p:before{ /* The pointer of the tooltip */
        position: absolute;
        content: '';
        width:0;
        height: 0;
        border:6px solid transparent;
        border-bottom-color:#1E2021;
        right:10px;
        top:-12px;
    }
    
    .help-tip p:after{ /* Prevents the tooltip from being hidden */
        width:100%;
        height:40px;
        content:'';
        position: absolute;
        top:-40px;
        left:0;
    }
    
    /* CSS animation */
    
    @-webkit-keyframes fadeIn1 {
        0% { 
            opacity:0; 
            transform: scale(0.6);
        }
    
        100% {
            opacity:100%;
            transform: scale(1);
        }
    }
    .selectTooltip{
        position:relative;
    }
    @keyframes fadeIn1 {
        0% { opacity:0; }
        100% { opacity:100%; }
    }
    </style>
    <div style="${modalCSS}" id="streaks-settings">
        <span style="${spanStyle}" id="close-modal">&times;</span>
        <div style="${modalContentCSS}">
            <div style="${headingCSS}">
                <h2>Country Streaks</h2>
                <h5>Created by Jupaoqq</h5>
                <h5>Credits to victheturtle, subsymmetry, slashP, emilyapocalypse, and Han75</h5>
            </div>
            <div style="${bodyCSS}">
                <div style="border:5px groove #0F0F0F; padding:5px;">
                    <label for="streak-API-key">Your API Key:</label>
                    <input type="password" style="padding:5px; float:right;" id="streak-API-key">
                    <br><br>
                    <button style="float:right;cursor:pointer;" id="streak-setkey">Set API Key</button>
                    <a style="float:right;text-decoration:underline;color:white;cursor:pointer;"id="showKey">Show</a>
                    <p id="status-text"></p>
                    <p>
                    Need a new API key? Make an account at <a style="text-decoration:underline;color:blue;" href = "https://www.bigdatacloud.com/" target="_blank">www.bigdatacloud.com</a>
                    </p>
                </div>
                <div style="border:5px groove #1F1F1F; padding:5px;">
                    <label class="selectTooltip" for="selectManual">Manually save locations to this map: </label> 
                    <select style="float:right;" id="selectManual">
                        <option value="MAP_LINK_HERE" selected>No Selection</option>
                    </select>
                    <br><br>
                    <label for="changeKeybind">Manual Save Keybind: </label>
                    <input type="text" style="float:right;padding:5px;width:50px;" id = "changeKeybind" value="${manualKey}" maxlength="1" >
                    <br><br>
                    <button style="float:right;cursor:pointer;"id="savePrefManual">Save Preferences</button>
                </div>
                <div style="border:5px groove #0F0F0F; padding:5px;">
                    <label class="selectTooltip" for="selectGood">Save <b>GOOD</b> guesses to this map:<div class="help-tip">
                    <p>A guess is counted as a good guess if the country is correct and the score is <i>higher</i> than the minimum score.</p>
                </div></label>
                    
                    <select style="float:right;" id="selectGood">
                        <option value="MAP_LINK_HERE" selected>No Selection</option>
                    </select>
                    <br><br>
                    <label for="goodThreshhold">Good guess minimum score:</label>
                    <input id="goodThreshhold" style="float:right;padding:5px;width:70px;" type="number" max="4999" value="${cutOffGood}">
                    <br><br>
                    <label for="toggleGood">Save <b>GOOD</b> guesses?</label>
                    <input type="checkbox" id="toggleGood" ${collectGoodGuesses?"checked":""}>
                    <button style="float:right;cursor:pointer;" id="savePrefGood">Save Preferences</button>
                </div>
                <div style="border:5px groove #0F0F0F; padding:5px;">
                    <label class="selectTooltip" for="selectOK">Save <b>OK</b> guesses to this map: <div class="help-tip">
                    <p>A guess is counted as an OK guess if the country is correct and the score is <i>lower</i> than the maximum score.</p>
                </div></label>
                    
                    <select style="float:right;" id="selectOK">
                        <option value="MAP_LINK_HERE" selected>No Selection</option>
                    </select>
                    <br><br>
                    <label for="okThreshhold"><b>OK</b> guess maximum score:</label>
                    <input id="okThreshhold" style="float:right;padding:5px;width:70px;" type="number" max="4999" value="${cutoffOk}">
                    <br><br>
                    <label for="toggleOk">Save <b>OK</b> guesses?</label>
                    <input type="checkbox" id="toggleOk" ${collectOkGuesses?"checked":""}>
                    <button style="float:right" id="savePrefOk">Save Preferences</button>
                </div>
                <div style="border:5px groove #0F0F0F; padding:5px;">
                    <label class="selectTooltip" for="selectBad">Save <b>BAD</b> guesses (incorrect country) to this map:<div class="help-tip">
                    <p>A guess is counted as a bad guess if the country is incorrect.</p>
                </div></label>
                    
                    <select style="float:right;" id="selectBad">
                        <option value="MAP_LINK_HERE" selected>No Selection</option>
                    </select>
                    <br><br>
                    <label for="toggleBad">Save <b>BAD</b> guesses?</label>
                    <input type="checkbox" id="toggleBad" ${collectBadGuesses?"checked":""}>
                    <button style="float:right;cursor:pointer;" id="savePrefBad">Save Preferences</button>
                </div>
            </div>
        </div>
    </div>
    `;
    //Put modal in main body container
    let main = document.getElementById("__next");
    let settingsDiv = document.createElement("div");
    settingsDiv.id="streaks-settings-container";
    settingsDiv.innerHTML=html;
    settingsDiv.style.cssText=containerCSS;
    main.insertBefore(settingsDiv,main.children[0]);
    //close button
    document.getElementById("showKey").addEventListener("click",(e)=>{
        keyInput=document.getElementById("streak-API-key");
        if(keyInput.type==="password"){
            keyInput.type="text";
            document.getElementById("showKey").innerText="Hide";
        }else{
            keyInput.type="password";
            document.getElementById("showKey").innerText="Show";
        }
    });
    document.getElementById("close-modal").addEventListener("click",(e)=>{
        document.getElementById("streaks-settings-container").style.display="none";
    });
    document.getElementById("")
    //Populate dropdown select boxes.
    let ids=["selectManual","selectGood","selectOK","selectBad"]
    for(const [mapID, mapName] of Object.entries(myMaps)){
        
        for(const id of ids){
            let option = document.createElement("option");
            option.value=mapID;
            option.innerText=mapName;
            document.getElementById(id).appendChild(option);
        }
    }
    //set api key button
    document.getElementById("streak-setkey").addEventListener("click",(e)=>{
        let tryKey = document.getElementById("streak-API-key").value;
        if(!(tryKey.length <= 24 || tryKey.match("^[a-fA-F0-9_]*$") == null)){
            API_Key=tryKey;
            AUTOMATIC=true;
            localStorage.setItem("_STREAK_API_KEY",API_Key);
            document.getElementById("status-text").innerText="Successfully set key.";
        }else{
            document.getElementById("status-text").innerText="The key you entered is invalid. Please try again."
        }
        setTimeout(function(){
            document.getElementById("status-text").innerText="";
        },5000)
    });
    //manual preferences button
    document.getElementById("savePrefManual").addEventListener("click",(e)=>{
        manualSave = document.getElementById("selectManual").value;
        manualKey = document.getElementById("changeKeybind").value;
        localStorage.setItem("_MANUAL_MAPID",manualSave);
        document.getElementById("savePrefManual").innerText = "Saved.";
        setTimeout(function(){
            document.getElementById("savePrefManual").innerText = "Save Preferences";
        },3000);
    });
    //good preferences button
    document.getElementById("savePrefGood").addEventListener("click",(e)=>{
        goodGuesses = document.getElementById("selectGood").value;
        localStorage.setItem("_GOOD_MAPID",goodGuesses);
        if(goodGuesses=="MAP_LINK_HERE"){
            document.getElementById("toggleGood").checked=false;
        }
        cutOffGood = document.getElementById("goodThreshhold").value;
        localStorage.setItem("_CUTOFF_GOOD",cutOffGood);
        collectGoodGuesses = document.getElementById("toggleGood").checked;
        localStorage.setItem("_STORE_GOOD",collectGoodGuesses.toString());
        document.getElementById("savePrefGood").innerText = "Saved.";
        setTimeout(function(){
            document.getElementById("savePrefGood").innerText = "Save Preferences";
        },3000);
    });
    //ok preferences button
    document.getElementById("savePrefOk").addEventListener("click",(e)=>{
        okGuesses = document.getElementById("selectOK").value;
        localStorage.setItem("_OK_MAPID",okGuesses);
        if(okGuesses=="MAP_LINK_HERE"){
            document.getElementById("toggleOk").checked=false;
        }
        cutoffOk = document.getElementById("okThreshhold").value;
        localStorage.setItem("_CUTOFF_OK",cutoffOk);
        collectOkGuesses = document.getElementById("toggleOk").checked;
        localStorage.setItem("_STORE_OK",collectOkGuesses.toString());
        document.getElementById("savePrefOk").innerText = "Saved.";
        setTimeout(function(){
            document.getElementById("savePrefOk").innerText = "Save Preferences";
        },3000);
    });
    //bad preferences button
    document.getElementById("savePrefBad").addEventListener("click",(e)=>{
        badGuesses = document.getElementById("selectBad").value;
        localStorage.setItem("_BAD_MAPID",badGuesses);
        if(badGuesses=="MAP_LINK_HERE"){
            document.getElementById("toggleBad").checked=false;
        }
        collectBadGuesses = document.getElementById("toggleBad").checked;
        localStorage.setItem("_STORE_BAD",collectBadGuesses.toString())
        document.getElementById("savePrefBad").innerText = "Saved.";
        setTimeout(function(){
            document.getElementById("savePrefBad").innerText = "Save Preferences";
        },3000);
    });
    }
    //Every time settings opened:
    //Populate api key box
    document.getElementById("streak-API-key").value=API_Key;
    //populate manual select box
    document.getElementById("selectManual").value=manualSave;
    document.getElementById("changeKeybind").value=manualKey;
    //Populate good select box
    document.getElementById("selectGood").value=goodGuesses;
    document.getElementById("goodThreshhold").value=cutOffGood;
    document.getElementById("toggleGood").checked=collectGoodGuesses;
    //populate ok select box
    document.getElementById("selectOK").value=okGuesses;
    document.getElementById("okThreshhold").value=cutoffOk;
    document.getElementById("toggleOk").checked=collectOkGuesses;
    //populate bad select box
    document.getElementById("selectBad").value=badGuesses;
    document.getElementById("toggleBad").checked=collectBadGuesses;
}
function addCounter() {
    if (!checkGameMode()) {
        return;
    };
    let status_length = document.getElementsByClassName(cn("status_section__")).length;
    if (document.getElementById("country-streak") == null && status_length >= 3) {
        let position = (status_length >= 4 && document.getElementsByClassName(cn("status_label__"))[3].innerText == "TIME LEFT") ? 4 : 3;
        let newDiv0 = document.createElement("div");
        newDiv0.className = cn('status_section__');
        let statusBar = document.getElementsByClassName(cn("status_inner__"))[0];
        statusBar.insertBefore(newDiv0, statusBar.children[position]);
        newDiv0.innerHTML = `<div class="${cn("status_label__")}">Streak</div>
                             <div id="country-streak" class="${cn("status_value__")}">${streak}</div>`;
        newDiv0.setAttribute("style","cursor:pointer;");
        newDiv0.addEventListener("click",openSettings);
    };
};
 
function addStreakRoundResult() {
    if (document.getElementById("country-streak2") == null && !!document.querySelector('div[data-qa="guess-description"]')
        && !document.querySelector('div[class*="standard-final-result_section__"]')) {
        let pageProps = JSON.parse(document.getElementById("__NEXT_DATA__").innerHTML).props.pageProps;
        if (pageProps.gamePlayedByCurrentUser != null && pageProps.gamePlayedByCurrentUser.mode == "streak") return;
        let newDiv = document.createElement("div");
        document.querySelector('div[data-qa="guess-description"]').appendChild(newDiv);
        newDiv.innerHTML = `<div id="country-streak2" style="text-align:center;margin-top:10px;"><h2><i>Country Streak: ${streak}</i></h2></div>`;
        let openS = document.createElement("h4");
        openS.innerText="Open Streak Counter Preferences";
        newDiv.insertBefore(openS,null);
        openS.setAttribute("style","text-decoration:underline;cursor:pointer;");
        openS.addEventListener("mouseover",function(){
            openS.setAttribute("style","color:blue;text-decoration:underline;cursor:pointer;");
        });
        openS.addEventListener("mouseout",function(){
            openS.setAttribute("style","color:white;text-decoration:underline;cursor:pointer;");
        });
        openS.addEventListener("click",openSettings);
    };
};
 
function addStreakGameSummary() {
    if (document.getElementById("country-streak2") == null && !!document.querySelector('div[class*="standard-final-result_section__"]')) {
        let newDiv = document.createElement("div");
        let progressSection = document.getElementsByClassName(cn("standard-final-result_progressSection__"))[0];
        progressSection.parentNode.insertBefore(newDiv, progressSection.parentNode.children[2]);
        progressSection.style.marginTop = "10px";
        progressSection.style.marginBottom = "10px";
        newDiv.innerHTML = `<div id="country-streak2" style="text-align:center;margin-top:10px;"><h2><i>Country Streak: ${streak}</i></h2></div>`;
        let openS = document.createElement("h4");
        openS.innerText="Open Streak Counter Preferences";
        newDiv.insertBefore(openS,null);
        openS.setAttribute("style","text-decoration:underline;cursor:pointer;");
        openS.addEventListener("mouseover",function(){
            openS.setAttribute("style","color:blue;text-decoration:underline;cursor:pointer;");
        });
        openS.addEventListener("mouseout",function(){
            openS.setAttribute("style","color:white;text-decoration:underline;cursor:pointer;");
        });
        openS.addEventListener("click",openSettings);
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
/**
 * Gets user's draft and published maps and stores (Map_ID,Map_Name) in variable myMaps 
 */
async function getUserMaps(){
    await fetch(MAPS_PUBLISHED).then(res=>(res.status!==200)?ERROR_RESP:res.json()).then(json=>{
        if(json!==ERROR_RESP){
            for(let i=0;i<json.length;i++){
                myMaps[json[i]["slug"]]=json[i]["name"];
            }
        }else console.log("error getting user published maps from geoguessr api");
    });
    await fetch(MAPS_DRAFT).then(res=>(res.status!==200)?ERROR_RESP:res.json()).then(json=>{
        if(json!==ERROR_RESP){
            for(let i=0;i<json.length;i++){
                myMaps[json[i]["slug"]]=json[i]["name"];
            }
        }else console.log("error getting user draft maps from geoguessr api");
    });

}
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
    const game_tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    let api_url = ""
    if (location.pathname.startsWith("/game/")) {
        api_url = "https://www.geoguessr.com/api/v3/games/"+game_tag;
    } else if (location.pathname.startsWith("/challenge/")) {
        api_url = "https://www.geoguessr.com/api/v3/challenges/"+game_tag+"/game";
    };
    fetch(api_url)
        .then(res => res.json())
        .then((out) => {
        let guess_counter = out.player.guesses.length;
        let guess = [out.player.guesses[guess_counter-1].lat,out.player.guesses[guess_counter-1].lng];
        if (guess[0] == last_guess[0] && guess[1] == last_guess[1]) {
            return;
        };
        last_guess = guess;
        let round = [out.rounds[guess_counter-1].lat,out.rounds[guess_counter-1].lng];
        global_loc = out.rounds[guess_counter-1];
        getUserAsync(guess)
            .then(gue => {
            getUserAsync(round)
                .then(loc => {
                if (loc == ERROR_RESP || gue == ERROR_RESP) {
                    updateStreak(ERROR_RESP, true, "");
                } else if (loc == gue) {
                    let passStr = "";
                    if (out.player.guesses[guess_counter-1].roundScore.amount < cutoffOk)
                    {
                        if (collectOkGuesses && okGuesses !== "MAP_LINK_HERE")
                        {
                            toMap(global_loc, "BAD");
                            passStr = "BAD";
                        }
                    }
                    if (out.player.guesses[guess_counter-1].roundScore.amount > cutOffGood)
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
    if (!document.querySelector('div[class*="result-layout_root__"]')) {
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
// ==UserScript==
// @name         Country Streak Counter (Automated) (FIXED)
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @version      0.0.3
// @description  Adds a country streak counter to the GeoGuessr website
// @source       https://github.com/semihM/GeoGuessrScripts/blob/main/CountryStreaksFixed
// @supportURL   https://github.com/semihM/GeoGuessrScripts/issues
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/851187
// @downloadURL https://update.greasyfork.org/scripts/442328/Country%20Streak%20Counter%20%28Automated%29%20%28FIXED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442328/Country%20Streak%20Counter%20%28Automated%29%20%28FIXED%29.meta.js
// ==/UserScript==

// THIS IS A FIXED CURRENT VERSION OF THE FOLLOWING SCRIPT
// ORIGINAL: https://www.reddit.com/r/geoguessr/comments/htgi42/country_streak_counter_script_automated_and/

// GET YOUR API KEY FROM: https://www.bigdatacloud.com/customer/account
let API_Key = 'ENTER_API_KEY_HERE'; //Replace ENTER_API_KEY_HERE with your API Key (so keep the quote marks)

var $ = window.jQuery
let streak = parseInt(sessionStorage.getItem("Streak"), 10);
let streakBackup = parseInt(sessionStorage.getItem("StreakBackup"), 10);
let checked = parseInt(sessionStorage.getItem("Checked"), 10);
let last_guess = [0,0];
let guess_btn = null;
let check_result = null;

if(sessionStorage.getItem("Streak") == null) {
    sessionStorage.setItem("Streak", 0);
    streak = 0;
};

if(sessionStorage.getItem("StreakBackup") == null) {
    sessionStorage.setItem("StreakBackup", 0);
    streakBackup = 0;
};

if(sessionStorage.getItem("Checked") == null) {
    sessionStorage.setItem("Checked", 0);
    checked = 0;
};

var CountryDict = {
    AF: 'AF',
    AX: 'FI',
    AL: 'AL',
    DZ: 'DZ',
    AS: 'US',
    AD: 'AD',
    AO: 'AO',
    AI: 'GB',
    AQ: 'AQ',
    AG: 'AG',
    AR: 'AR',
    AM: 'AM',
    AW: 'NL',
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
    BM: 'GB',
    BT: 'BT',
    BO: 'BO',
    BQ: 'NL',
    BA: 'BA',
    BW: 'BW',
    BV: 'NO',
    BR: 'BR',
    IO: 'GB',
    BN: 'BN',
    BG: 'BG',
    BF: 'BF',
    BI: 'BI',
    KH: 'KH',
    CM: 'CM',
    CA: 'CA',
    CV: 'CV',
    KY: 'UK',
    CF: 'CF',
    TD: 'TD',
    CL: 'CL',
    CN: 'CN',
    CX: 'AU',
    CC: 'AU',
    CO: 'CO',
    KM: 'KM',
    CG: 'CG',
    CD: 'CD',
    CK: 'NZ',
    CR: 'CR',
    CI: 'CI',
    HR: 'HR',
    CU: 'CU',
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
    FK: 'GB',
    FO: 'DK',
    FJ: 'FJ',
    FI: 'FI',
    FR: 'FR',
    GF: 'FR',
    PF: 'FR',
    TF: 'FR',
    GA: 'GA',
    GM: 'GM',
    GE: 'GE',
    DE: 'DE',
    GH: 'GH',
    GI: 'GI',
    GR: 'GR',
    GL: 'DK',
    GD: 'GD',
    GP: 'FR',
    GU: 'US',
    GT: 'GT',
    GG: 'GB',
    GN: 'GN',
    GW: 'GW',
    GY: 'GY',
    HT: 'HT',
    HM: 'AU',
    VA: 'VA',
    HN: 'HN',
    HK: 'CN',
    HU: 'HU',
    IS: 'IS',
    IN: 'IN',
    ID: 'ID',
    IR: 'IR',
    IQ: 'IQ',
    IE: 'IE',
    IM: 'GB',
    IL: 'IL',
    IT: 'IT',
    JM: 'JM',
    JP: 'JP',
    JE: 'GB',
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
    MO: 'CN',
    MK: 'MK',
    MG: 'MG',
    MW: 'MW',
    MY: 'MY',
    MV: 'MV',
    ML: 'ML',
    MT: 'MT',
    MH: 'MH',
    MQ: 'FR',
    MR: 'MR',
    MU: 'MU',
    YT: 'FR',
    MX: 'MX',
    FM: 'FM',
    MD: 'MD',
    MC: 'MC',
    MN: 'MN',
    ME: 'ME',
    MS: 'GB',
    MA: 'MA',
    MZ: 'MZ',
    MM: 'MM',
    NA: 'NA',
    NR: 'NR',
    NP: 'NP',
    NL: 'NL',
    AN: 'NL',
    NC: 'FR',
    NZ: 'NZ',
    NI: 'NI',
    NE: 'NE',
    NG: 'NG',
    NU: 'NZ',
    NF: 'AU',
    MP: 'US',
    NO: 'NO',
    OM: 'OM',
    PK: 'PK',
    PW: 'PA',
    PS: 'IL',
    PA: 'PA',
    PG: 'PG',
    PY: 'PY',
    PE: 'PE',
    PH: 'PH',
    PN: 'GB',
    PL: 'PL',
    PT: 'PT',
    PR: 'US',
    QA: 'QA',
    RE: 'FR',
    RO: 'RO',
    RU: 'RU',
    RW: 'RW',
    BL: 'FR',
    SH: 'GB',
    KN: 'KN',
    LC: 'LC',
    MF: 'FR',
    PM: 'FR',
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
    SK: 'SK',
    SI: 'SI',
    SB: 'SB',
    SO: 'SO',
    ZA: 'ZA',
    GS: 'GB',
    ES: 'ES',
    LK: 'LK',
    SD: 'SD',
    SR: 'SR',
    SJ: 'NO',
    SZ: 'SZ',
    SE: 'SE',
    CH: 'CH',
    SY: 'SY',
    TW: 'TW',
    TJ: 'TJ',
    TZ: 'TZ',
    TH: 'TH',
    TL: 'TL',
    TG: 'TG',
    TK: 'NZ',
    TO: 'TO',
    TT: 'TT',
    TN: 'TN',
    TR: 'TR',
    TM: 'TM',
    TC: 'GB',
    TV: 'TV',
    UG: 'UG',
    UA: 'UA',
    AE: 'AE',
    GB: 'GB',
    US: 'US',
    UM: 'US',
    UY: 'UY',
    UZ: 'UZ',
    VU: 'VU',
    VE: 'VE',
    VN: 'VN',
    VG: 'GB',
    VI: 'US',
    WF: 'FR',
    EH: 'MA',
    YE: 'YE',
    ZM: 'ZM',
    ZW: 'ZW',
    SX: 'NL',
    CW: 'NL'
};

function updateStreak(newVariable) {
    streak = newVariable;
    if(document.getElementById("country-streak") != null) {
        document.getElementById("country-streak").innerHTML = `<div id="country-streak"><div class="status_value__xZMNY">${streak}</div></div>`;
    };
    if(document.getElementById("country-streak2") != null && document.querySelector("[data-qa='guess-description']")) {
        document.getElementById("country-streak2").innerHTML = `<br><h2><i>Country Streak: ${streak}</i></h2>`;
    };
    if(document.getElementById("country-streak2") != null && !!document.querySelector('.standard-final-result_section___B3ne')) {
        document.getElementById("country-streak2").innerHTML = `<h2><i>Country Streak: ${streak}</i></h2>`;
    };
};

function addCounter(newDiv0) {
    if(document.getElementsByClassName("status_section__8uP8o").length == 3) {
        newDiv0 = document.createElement("div")
        newDiv0.className = 'status_section__8uP8o';
        document.getElementsByClassName("status_inner__1eytg")[0].appendChild(newDiv0);
        newDiv0.innerHTML = `<div class="status_label__SNHKT">Streak</div><div id="country-streak"><div class="status_value__xZMNY">${streak}</div></div>`;
     };
    if(document.getElementsByClassName("status_section__8uP8o").length == 4 && document.getElementsByClassName("status_label__SNHKT")[3].innerText == "TIME LEFT") {
        newDiv0 = document.createElement("div")
        newDiv0.className = 'status_section__8uP8o';
        document.getElementsByClassName("status_inner__1eytg")[0].appendChild(newDiv0);
        newDiv0.innerHTML = `<div class="status_label__SNHKT">Streak</div><div id="country-streak"><div class="status_value__xZMNY">${streak}</div></div>`;
    };
};

function addCounterOnRefresh() {
    setTimeout(function(){
        addCounter();
    },50);
    setTimeout(function(){
        addCounter();
    },300);
};

function addCounter2() {
    addCounter();
    if(document.getElementsByClassName("status_section__8uP8o").length == 0) {
        setTimeout(function() {
            addCounter();
            if(document.getElementsByClassName("status_section__8uP8o").length == 0) {
                setTimeout(function() {
                    addCounter();
                    if(document.getElementsByClassName("status_section__8uP8o").length == 0) {
                        setTimeout(function() {
                            addCounter();
                            if(document.getElementsByClassName("status_section__8uP8o").length == 0) {
                                setTimeout(function() {
                                    addCounter();
                                    if(document.getElementsByClassName("status_section__8uP8o").length == 0) {
                                        setTimeout(function() {
                                            addCounter();
                                        }, 4000);
                                    };
                                }, 3000);
                            };
                        }, 2000);
                    };
                }, 1200);
            };
        }, 400);
    };
};

async function getUserAsync(location) {
    if(location[0] <= -85.05) {
        return 'AQ';
    }
    else{
    let api = "https://api.bigdatacloud.net/data/reverse-geocode?latitude="+location[0]+"&longitude="+location[1]+"&localityLanguage=en&key="+API_Key
    let response = await fetch(api)
        .then(res => res.json())
        .then((out) => {
            return CountryDict[out.countryCode]
        })
    return response;
    };
};

function check(){
    const game_tag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    let api_url = isChallenge()
        ? "https://www.geoguessr.com/api/v3/challenges/"+game_tag+"/game"
        : "https://www.geoguessr.com/api/v3/games/"+game_tag;
    let rounds_tab = document.getElementsByClassName("status_value__xZMNY")
    let current_round = rounds_tab[1].innerHTML.substr(0, rounds_tab[1].innerHTML.indexOf('/')).trim();
    fetch(api_url)
    .then(res => res.json())
    .then((out) => {
        rounds_tab = document.getElementsByClassName("status_value__xZMNY")
        current_round = rounds_tab[1].innerHTML.substr(0, rounds_tab[1].innerHTML.indexOf('/')).trim();
        let guess_counter = out.player.guesses.length
        let guess = [out.player.guesses[guess_counter-1].lat,out.player.guesses[guess_counter-1].lng]
        if (guess[0] == last_guess[0] && guess[1] == last_guess[1]) {
            return;
        };
        last_guess = guess
        let location = [out.rounds[guess_counter-1].lat,out.rounds[guess_counter-1].lng]
        getUserAsync(guess)
        .then(gue => {
            getUserAsync(location)
            .then(loc => {
                if (gue == loc){
                    updateStreak(streak + 1);
                    sessionStorage.setItem("Streak", streak);
                    streakBackup = streak;
                    sessionStorage.setItem("StreakBackup", streak);
                }
                else {
                    if(streak == 0){
                        streakBackup = 0;
                        sessionStorage.setItem("StreakBackup", 0);
                    };
                    if(streak == 1){
                        updateStreak(0);
                        sessionStorage.setItem("Streak", 0);
                        document.getElementById("country-streak2").innerHTML = `<br><h2><i>Country Streak: ${streak}</i></h2>Your streak ended after correctly guessing <div class="round-result_distanceLabel__fZkMI"><div class="styles_root__FeWtm styles_variantWhiteTransparent__37k68 styles_roundnessSmall__2hAx_"><div class="styles_start__3IojM styles_right__KGcF4"></div><div class="round-result_distanceValue__3QaKg">${streakBackup}</div><div class="styles_end__3mGH8 styles_right__KGcF4"></div></div></div> country.`;
                    };
                    if(streak > 1){
                        updateStreak(0);
                        sessionStorage.setItem("Streak", 0);
                        document.getElementById("country-streak2").innerHTML = `<br><h2><i>Country Streak: ${streak}</i></h2>Your streak ended after correctly guessing <div class="round-result_distanceLabel__fZkMI"><div class="styles_root__FeWtm styles_variantWhiteTransparent__37k68 styles_roundnessSmall__2hAx_"><div class="styles_start__3IojM styles_right__KGcF4"></div><div class="round-result_distanceValue__3QaKg">${streakBackup}</div><div class="styles_end__3mGH8 styles_right__KGcF4"></div></div></div> countries in a row.`;
                    };
                };
            });
        });
    })
.catch(err => { throw err });

};

function isSingle()
{
    return location.pathname.startsWith("/game/")
}

function isChallenge()
{
    return location.pathname.startsWith("/challenge/")
}

function isInGame()
{
    return isSingle() || isChallenge()
}

function addStreak1(newDiv1) {
    if(document.getElementById("country-streak2") == null && document.querySelector("[data-qa='guess-description']") && isInGame()) {
        newDiv1 = document.createElement("div")
        document.querySelector("[data-qa='guess-description']").appendChild(newDiv1);
        newDiv1.innerHTML = `<div id="country-streak2" style="text-align:center"><br><h2><i>Country Streak: ${streak}</i></h2></div>`;
    };
};

function addStreak2(newDiv2) {
    if(document.getElementById("country-streak2") == null && !!document.querySelector('.standard-final-result_section___B3ne') && isInGame()) {
        newDiv2 = document.createElement("div")
        document.getElementsByClassName("progress-bar_background__A6ZDS progress-bar_expandHeight__W_59W")[0].appendChild(newDiv2);
        newDiv2.innerHTML = `<div id="country-streak2" style="text-align:center"><br><h2><i>Country Streak: ${streak}</i></h2></div>`;
    };
};

function addStreak() {
    if (!!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") == 0){
        check();
        checked = checked + 1;
        sessionStorage.setItem("Checked", checked);
    }
    else if (!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") != 0) {
        checked = 0;
        sessionStorage.setItem("Checked", checked)
    };
    setTimeout(function() {
        if (!!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") == 0){
            check();
            checked = checked + 1;
            sessionStorage.setItem("Checked", checked);
        }
        else if (!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") != 0) {
            checked = 0;
            sessionStorage.setItem("Checked", checked)
        };
    }, 250);
    setTimeout(function() {
        if (!!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") == 0){
            check();
            checked = checked + 1;
            sessionStorage.setItem("Checked", checked);
        }
        else if (!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") != 0) {
            checked = 0;
            sessionStorage.setItem("Checked", checked)
        };
    }, 500);
    setTimeout(function() {
        if (!!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") == 0){
            check();
            checked = checked + 1;
            sessionStorage.setItem("Checked", checked);
        }
        else if (!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") != 0) {
            checked = 0;
            sessionStorage.setItem("Checked", checked)
        };
    }, 1200);
    setTimeout(function() {
        if (!!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") == 0){
            check();
            checked = checked + 1;
            sessionStorage.setItem("Checked", checked);
        }
        else if (!document.querySelector('.result-layout_root__NfX12') && isInGame() && sessionStorage.getItem("Checked") != 0) {
            checked = 0;
            sessionStorage.setItem("Checked", checked)
        };
    }, 2000);
    setTimeout(function(){
        addStreak1();
    },300);
    setTimeout(function(){
        addStreak1();
    },500);
    setTimeout(function(){
        addStreak2();
    },200);
    setTimeout(function(){
        addStreak2();
    },400);
    setTimeout(function(){
        addStreak1();
        addStreak2();
    },1200);
    setTimeout(function(){
        addStreak1();
        addStreak2();
    },2000);
};

document.addEventListener('keypress', (e) => {

    switch (e.key) {
        case '1':
            updateStreak(streak + 1);
            sessionStorage.setItem("Streak", streak);
            streakBackup = streak;
            sessionStorage.setItem("StreakBackup", streak);
            break;
        case '2':
            updateStreak(streak - 1);
            sessionStorage.setItem("Streak", streak);
            streakBackup = streak;
            sessionStorage.setItem("StreakBackup", streak);
            break;
        case '8':
            updateStreak(streakBackup + 1);
            sessionStorage.setItem("Streak", streak);
            streakBackup = streak;
            sessionStorage.setItem("StreakBackup", streak);
            break;
        case '0':
            updateStreak(0);
            sessionStorage.setItem("Streak", 0);
            streakBackup = 0;
            sessionStorage.setItem("StreakBackup", 0);
            break;
    };
});

document.addEventListener('click', addCounter2, false);
document.addEventListener('click', addStreak, false);
document.addEventListener('load', addCounterOnRefresh(), false);

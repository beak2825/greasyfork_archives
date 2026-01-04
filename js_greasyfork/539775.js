// ==UserScript==
// @name         Climate Streak Counter
// @version      0.0.1
// @description  Adds a climate streak counter to the GeoGuessr website
// @match        https://www.geoguessr.com/*
// @author       victheturtle#5159, KaKa
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @grant        GM_xmlhttpRequest
// @connect      climateapi.scottpinkelman.com
// @downloadURL https://update.greasyfork.org/scripts/539775/Climate%20Streak%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/539775/Climate%20Streak%20Counter.meta.js
// ==/UserScript==
// Credits to subsymmetry for the original version of the Streak Counter

const AUTOMATIC = true;
//                ^^^^ Replace with false for a manual counter

const ERROR_RESP = -1000000;
const COUNTER={
    checking:false,
    streak:false,
    guess_clm:null,
    location_clm:null
}
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
style.sheet.insertRule("div[class*='result-layout_contentNew__'] { display: block; justify-content: center }")
style.sheet.insertRule("p[class*='standard-final-result_spacebarLabel__'] { display: none }")
style.sheet.insertRule("div[class*='standard-final-result_wrapper__'] { align-items: normal; justify-content: center }")
style.sheet.insertRule("div[class*='round-result_topPlayersButton__'] { position: absolute; bottom: 9rem }")
style.sheet.insertRule("div[class*='shadow-text_positiveTextShadow_CUSTOM_1_'] { text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-green-50),0 -.25rem .5rem var(--ds-color-green-50),-.25rem .5rem .5rem #77df9b,0 0.375rem 2rem var(--ds-color-green-50),0 0 0 var(--ds-color-green-50),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-green-50) }")
style.sheet.insertRule("div[class*='shadow-text_negativeTextShadow_CUSTOM_1_'] { text-shadow: 0 .25rem 0 var(--ds-color-black-50),.125rem .125rem .5rem var(--ds-color-red-50),0 -.25rem .5rem var(--ds-color-red-50),-.25rem .5rem .5rem #b45862,0 0.375rem 2rem var(--ds-color-red-50),0 0 0 var(--ds-color-red-50),0 0 1.5rem rgba(161,155,217,.65),.25rem .25rem 1rem var(--ds-color-red-50) }")
style.sheet.insertRule("a[href*='github'] { display: none }");

function addStreakStatusBar() {
    const status_length = document.getElementsByClassName(cn("status_section__")).length;
    if (document.getElementById("climate-streak") == null && status_length >= 3) {
        const newDiv = document.createElement("div");
        newDiv.className = cn('status_section__');
        newDiv.innerHTML = `<div class="${cn("status_label__")}">Streak</div>
        <div id="climate-streak" class="${cn("status_value__")}">${streak}</div>`;
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
        <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">${(!positive) ? "Streak lost at" : "Climate streak"}&nbsp;</div>
      </div>
      <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">
        <div><div>${streak}</div></div>
      </div>
`

function addStreakRoundResult() {
    if (document.getElementById("climate-streak2") == null && !!document.querySelector('div[class*="round-result_distanceIndicatorWrapper__"]')) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div id="climate-streak2" class="${cn("round-result_distanceWrapper__")}">${newFormat(streak, true)}</div>`;
        newDiv.style = "grid-area: 1 / 3 / span 1 / span 1; ";
        document.querySelector('div[class*="round-result_wrapper__"]').appendChild(newDiv);
    };
};

function addStreakGameSummary() {
    if (document.getElementById("climate-streak3") == null && !!document.querySelector('div[class*="result-overlay_overlayTotalScore__"]')
        /*&& !document.querySelector('div[class*="result-overlay_overlayQuickPlayProgress__"]')*/) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div id="climate-streak3" class="${cn("round-result_distanceWrapper__")}">${newFormatSummary(streak, true)}</div>`;
        newDiv.style = "display: flex; align-items: center;";
        const totalScore = document.querySelector('div[class*="result-overlay_overlayTotalScore__"]');
        totalScore.parentNode.insertBefore(newDiv, totalScore.parentNode.children[1]);
        totalScore.style.marginTop = "-20px";
    };
};

function createStreakText() {
    if (COUNTER.checking) return "Loading...";
    if (COUNTER.streak) return `It was indeed <span style="color:#6cb928">${COUNTER.guess_clm||COUNTER.location_clm}!`;

    let t = "";
    return COUNTER.guess_clm && COUNTER.location_clm && (t = `You guessed <span style="color:#f95252">${COUNTER.guess_clm}</span>, unfortunately it was <span style="color:#6cb928">${COUNTER.location_clm}</span>.`)

}

function getSummaryPanel() {
    return document.getElementById(`streak-score-panel-summary-climate`)
}
function createStreakElement() {
    let e = document.createElement("div");
    return e.style.fontSize = "18px",
        e.style.fontWeight = "500",
        e.style.color = "#fff",
        e.style.padding = "10px",
        e.style.paddingBottom = "0",
        e.style.background = "var(--ds-color-purple-100)",
        e;
}

function updateSummaryPanel() {
    const e = document.querySelector('div[class^="result-layout_root"] div[class^="round-result_wrapper__"]'),
          t = document.querySelector('div[class^="result-layout_root"] div[class^="result-layout_bottomNew__"]');
    if (t && (t.style.flex = "0", t.style.maxHeight = "none"), !e && !t) return;
    let s = getSummaryPanel();
    e && !s && (s = createStreakElement(), s.id = `streak-score-panel-summary-climate`, e.parentNode.insertBefore(s, e)), s && (s.innerHTML = createStreakText())
}

function updateStreak(newStreak) {
    if (newStreak === ERROR_RESP) {
        if (document.getElementById("climate-streak2") != null && !!document.querySelector('div[class*="round-result_distanceIndicatorWrapper__"]')) {
            document.getElementById("climate-streak2").innerHTML = "";
        }
        return;
    }
    sessionStorage.setItem("Streak", newStreak);
    if (!(streak > 0 && newStreak == 0)) {
        sessionStorage.setItem("StreakBackup", newStreak);
    };
    if (document.getElementById("climate-streak") != null) {
        document.getElementById("climate-streak").innerHTML = newStreak;
    };
    if (document.getElementById("climate-streak2") != null) {
        document.getElementById("climate-streak2").innerHTML = newFormat(newStreak, true);
        if (newStreak == 0 && streak > 0) {
            document.getElementById("climate-streak2").innerHTML = newFormat(streak, false);
        };
    };
    if (document.getElementById("climate-streak3") != null) {
        document.getElementById("climate-streak3").innerHTML = newFormatSummary(newStreak, true);
        if (newStreak == 0 && streak > 0) {
            document.getElementById("climate-streak3").innerHTML = newFormatSummary(streak, false);
        };
    };
    streak = newStreak;
};

async function getClimate(coords){
    return new Promise((resolve) => {
        const api = `http://climateapi.scottpinkelman.com/api/v1/location/${coords.lat}/${coords.lng}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: api,
            headers: {
                "Accept": "application/json"
            },
            onload: function (res) {
                if (res.status !== 200) {
                    console.warn(`Request failed with status: ${res.status}`);
                    return resolve(ERROR_RESP);
                }

                try {
                    const data = JSON.parse(res.responseText);

                    if (Array.isArray(data.return_values) && data.return_values.length > 0) {
                        return resolve(data.return_values[0]);
                    } else {
                        return resolve(ERROR_RESP);
                    }
                } catch (err) {
                    console.error("Failed to parse response:", err);
                    return resolve("Unknown");
                }
            },
            onerror: function (err) {
                console.error("Error fetching climate data:", err);
                return resolve(ERROR_RESP);
            }
        });
    });
}


let lastGuess = { lat: 91, lng: 0 };
function check() {
    COUNTER.checking=true
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
        Promise.all([getClimate(guess), getClimate(round)]).then(codes => {
            COUNTER.checking=false
            COUNTER.guess_clm=codes[0].zone_description
            COUNTER.location_clm=codes[1].zone_description
            if (codes[0] == ERROR_RESP || codes[1] == ERROR_RESP) {
                updateStreak(ERROR_RESP);
            } else if (codes[0].koppen_geiger_zone == codes[1].koppen_geiger_zone) {
                COUNTER.streak=true
                updateStreak(streak + 1);
            } else {
                COUNTER.streak=false
                updateStreak(0);
            };
            updateSummaryPanel()
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

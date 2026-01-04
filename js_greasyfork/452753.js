// ==UserScript==
// @name         Hedge Streak Counter (Automated)
// @version      1.4.3
// @description  Adds a hedge streak counter to the GeoGuessr website. Compatible with country streak counters if both scripts are at least v.1.3.0.
// @author       victheturtle#5159
// @license      MIT
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452753/Hedge%20Streak%20Counter%20%28Automated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452753/Hedge%20Streak%20Counter%20%28Automated%29.meta.js
// ==/UserScript==
// Credits to quarksauce for the original Hedge Streak Counter script

const HEDGE_THRESHOLD = 20000;
//                      ^^^^^ You can change the threshold for getting the streak here


let streak = parseInt(sessionStorage.getItem("HedgeStreak") || 0, 10);
let lastGameId = sessionStorage.getItem("HedgeLastGameId") || "";

function checkGameMode() {
    return (location.pathname.includes("/game/"));
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

const newFormatSummary = (streak, positive) => `
      <div class="${cn("round-result_distanceUnitIndicator__")}">
        <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">${(!positive) ? "Hedge streak lost at" : "Hedge streak"}&nbsp;</div>
      </div>
      <div class="${cn("shadow-text_root__")} shadow-text_${(!positive || streak == 0) ? "negative" : "positive"}TextShadow_CUSTOM_1_ ${cn("shadow-text_sizeSmallMedium__")}">
        <div><div>${streak}</div></div>
      </div>`;

function addStreakStatusBar() {
    if (document.getElementById("hedge-streak") == null && document.getElementsByClassName(cn("status_section__")).length >= 3) {
        const newDiv = document.createElement("div");
        newDiv.className = cn("status_section__");
        newDiv.innerHTML = `<div class="${cn("status_label__")}">Hedge</div><div id="hedge-streak" class="${cn("status_value__")}">${streak}</div>`;
        document.getElementsByClassName(cn("status_inner__"))[0].appendChild(newDiv);
    }
};

function addStreakGameSummary() {
    if (document.getElementById("hedge-streak3") == null && !!document.querySelector('div[class*="result-overlay_overlayTotalScore__"]')
           && !document.querySelector('div[class*="result-overlay_overlayQuickPlayProgress__"]')) {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `<div id="hedge-streak3" class="${cn("round-result_distanceWrapper__")}">${newFormatSummary(streak, true)}</div>`;
        newDiv.style = "display: flex; align-items: center;";
        const totalScore = document.querySelector('div[class*="result-overlay_overlayTotalScore__"]');
        totalScore.parentNode.insertBefore(newDiv, totalScore.parentNode.children[2]);
        totalScore.style.marginTop = "-20px";
        document.querySelector('div[class*="result-overlay_overlayXpBar__"]').style.bottom = "65%";
        document.querySelector('div[class*="result-overlay_overlayContent__"]').style.bottom = "75%";
    };
};

function updateStreak(newStreak) {
    sessionStorage.setItem("HedgeStreak", newStreak);
    if (document.getElementById("hedge-streak") != null) {
        document.getElementById("hedge-streak").innerHTML = newStreak;
    };
    if (document.getElementById("hedge-streak3") != null) {
        document.getElementById("hedge-streak3").innerHTML = newFormatSummary(newStreak, true);
        if (newStreak == 0 && streak > 0) {
            document.getElementById("hedge-streak3").innerHTML = newFormatSummary(streak, false);
        };
    };
    streak = newStreak;
};

function check() {
    const gameId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

    if (checkGameMode() && gameId != lastGameId) {
        const apiUrl = location.origin + "/api/v3/games/" + gameId;
        fetch(apiUrl)
        .then(res => res.json())
        .then((out) => {
            if (out.state == "finished") {
                if (parseInt(out.player.totalScore.amount, 10) >= HEDGE_THRESHOLD) {
                    updateStreak(streak+1);
                    lastGameId = gameId;
                    sessionStorage.setItem("HedgeLastGameId", lastGameId);
                } else {
                    updateStreak(0);
                }
            };
        }).catch(err => { throw err; });
    };
};

function doCheck() {
    if (!document.querySelector('div[class*="result-layout_root__"]')) {
        sessionStorage.setItem("HedgeChecked", 0);
    } else if ((sessionStorage.getItem("HedgeChecked") || 0) == 0) {
        check();
        sessionStorage.setItem("HedgeChecked", 1);
    }
};

let lastDoCheckCall = 0;
new MutationObserver(async (mutations) => {
    if (!checkGameMode() || lastDoCheckCall >= (Date.now() - 50)) return;
    lastDoCheckCall = Date.now();
    await scanStyles();
    doCheck();
    addStreakStatusBar();
    addStreakGameSummary();
}).observe(document.body, { subtree: true, childList: true });

document.addEventListener('keypress', (e) => {
    if (e.key == '5') {
        updateStreak(streak + 1);
    } else if (e.key =='6') {
        updateStreak(streak - 1);
    } else if (e.key == '9') {
        updateStreak(0);
    }
});

// ==UserScript==
// @name        GeoGuessr Team Duels Spec Mode
// @namespace   ggtdsm
// @description Prevent you to accidentally put a pin on the map (deactivatable) and allow you to guess Antarctica when you want to force the end of the round
// @version     0.4
// @match       https://www.geoguessr.com/*
// @require     https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/478254/GeoGuessr%20Team%20Duels%20Spec%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/478254/GeoGuessr%20Team%20Duels%20Spec%20Mode.meta.js
// ==/UserScript==

var style_pointer_events = document.createElement("style")
document.head.appendChild(style_pointer_events)
style_pointer_events.sheet.insertRule(".ggtdsm div[style*='z-index: 3'] { pointer-events: none; }")
style_pointer_events.disabled = false

var disabled = (localStorage["ggtdsm-disabled"] || "false") === "true"
style_pointer_events.disabled = disabled

function switchDisabled() {
  disabled = !disabled
  style_pointer_events.disabled = disabled
	localStorage["ggtdsm-disabled"] = disabled
  if (disabled) {
    buttonMap.querySelector("span").style = ""
  } else {
    buttonMap.querySelector("span").style = "filter: grayscale(100%);"
  }
}

async function fetchWithCors(url, method, body) {
    return await fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.8",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "x-client": "web"
        },
        "referrer": "https://www.geoguessr.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": (method == "GET") ? null : JSON.stringify(body),
        "method": method,
        "mode": "cors",
        "credentials": "include"
    });
};
 
const getGameId = () => location.pathname.split("/")[2];
const getRoundNumberApi = (gameId) => `https://game-server.geoguessr.com/api/duels/${gameId}/`;
const getRoundNumber = async () => await fetchWithCors(getRoundNumberApi(getGameId()), "GET")
                              .then(it => it.json()).then(it => it.currentRoundNumber);
const getGuessApi = (gameId) => `https://game-server.geoguessr.com/api/duels/${gameId}/guess`;
 
async function guessAntarctica() {
    const rn = await getRoundNumber();
    fetchWithCors(getGuessApi(getGameId()), "POST", {"lat": -90, "lng": 0, "roundNumber": rn})
  		.then(() => buttonGuess.style = "flex: 1; pointer-events: none; filter: grayscale(100%);")
};

var start
var buttonMap
var divTimer
var buttonGuess
function loop() {
  if (location.pathname.includes("/team-duels/") && document.querySelector("div[data-qa=guess-map]")) {
    if (!document.querySelector(".ggtdsm")) {
      start = Date.now()
      
      document.querySelector("div[data-qa=guess-map-canvas]").classList.add("ggtdsm")
      
      let div = document.createElement("div")
      div.className = "ggtdsm_controls"
      div.style = "margin-top: var(--button-gutter); display: flex; gap: var(--button-gutter);"

      buttonMap = document.createElement("button")
      buttonMap.style = "flex: 1;"
      buttonMap.type = "button"
      buttonMap.addEventListener("click", switchDisabled)

      let divMap = document.createElement("div")

      let spanMap = document.createElement("span")
      spanMap.innerText = "📌"
      if (!disabled) {
        spanMap.style = "filter: grayscale(100%);"
      }

      div.appendChild(buttonMap)
      buttonMap.appendChild(divMap)
      divMap.appendChild(spanMap)
      
      divTimer = document.createElement("div")
      divTimer.style = "flex: 1;"
      divTimer.innerText = 0
      div.appendChild(divTimer)

      buttonGuess = document.createElement("button")
      buttonGuess.style = "flex: 1;"
      buttonGuess.type = "button"
      buttonGuess.addEventListener("click", guessAntarctica)

      let divGuess = document.createElement("div")

      let spanGuess = document.createElement("span")
      spanGuess.innerText = "-90,0"

      div.appendChild(buttonGuess)
      buttonGuess.appendChild(divGuess)
      divGuess.appendChild(spanGuess)
      
      requireClassName("button_button__").then(textStyle => { buttonMap.classList.add(textStyle); buttonGuess.classList.add(textStyle); })
      requireClassName("button_variantPrimary__").then(textStyle => { buttonMap.classList.add(textStyle); buttonGuess.classList.add(textStyle); })
      requireClassName("button_wrapper__").then(textStyle => { divMap.classList.add(textStyle); divGuess.classList.add(textStyle); })
      requireClassName("button_label__").then(textStyle => { spanMap.classList.add(textStyle); spanGuess.classList.add(textStyle); })
      requireClassName("clock-timer_timer__").then(textStyle => { divTimer.classList.add(textStyle); })

      document.querySelector("div[class*=guess-map_guessMap_]").appendChild(div)
    } else {
      let s = Math.floor((Date.now() - start) / 1000)
      let m = Math.floor(s / 60)
      s = s % 60
      
      divTimer.innerText = ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2)
    }
  }
  
  setTimeout(loop, 100)
}

window.addEventListener("load", () => {
  scanStyles().then(loop)
});

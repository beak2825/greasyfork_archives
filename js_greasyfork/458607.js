// ==UserScript==
// @name         Geoguessr guess input field
// @description  Quick & dirty fix to the issue preventing players to guess on Unity Script maps
// @version      1.0.1
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.svgrepo.com/show/248540/ukraine.svg
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/458607/Geoguessr%20guess%20input%20field.user.js
// @updateURL https://update.greasyfork.org/scripts/458607/Geoguessr%20guess%20input%20field.meta.js
// ==/UserScript==

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

const getGameId = () => location.pathname.split("/")[2]
const getGuessApi = () => location.href.replace("game", "api/v3/games");

function guess() {
    const cgGuess = document.getElementById("guess-input").value.split(" ");
    const lat = parseFloat(cgGuess[3])
    const lng = parseFloat(cgGuess[4])
    fetchWithCors(getGuessApi(), "POST", {"token": getGameId(), "lat": lat, "lng": lng, "timedOut": false})
    setTimeout(window.location.reload.bind(window.location), 500);
};

document.guessFunc = guess;

function addGuessTextField() {
    if (!location.pathname.startsWith("/game/")) return;
    const guessMapDiv = document.getElementsByClassName("game-layout__guess-map")[0];
    if (guessMapDiv == null || guessMapDiv.childElementCount > 0) return;

    guessMapDiv.style = "display:flex; flex-direction: column; justify-content: flex-end";
    guessMapDiv.innerHTML = `
    <div class="form-field_formField__beWhf" style="margin-bottom: 10px">
        <div class="form-field_label__Yrcns"><a href="https://chatguessr.com/map/unity" target="_blank" rel="noreferrer noopener">Link to the CG map</a></div>
        <div >
            <input id="guess-input" type="text" name="guess" class="text-input_textInput__HPC_k text-input_light__d6fxi" placeholder="Click on the CG map and paste your guess here" maxlength="50" style="width:400px" autocomplete="off" value="">
        </div>
    </div>
    <div class="guess-map__guess-button">
        <button data-qa="perform-guess" type="button" class="button_button__CnARx button_variantPrimary__xc8Hp" onclick="guessFunc()">
            <div class="button_wrapper__NkcHZ">
                <span class="button_label__kpJrA">Guess</span>
            </div>
        </button>
    </div>`;
}

document.addEventListener('keypress', (e) => {
    if (e.key == 'g') {
        addGuessTextField();
    }
});

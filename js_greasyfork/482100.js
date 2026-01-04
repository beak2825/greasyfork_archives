// ==UserScript==
// @name         Geoguessr Team Duels Customise Multiplier Increment
// @description  Adds extra options to team duel settings.
// @version      0.1.0
// @author       @macca7224
// @license      MIT
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/865125
// @downloadURL https://update.greasyfork.org/scripts/482100/Geoguessr%20Team%20Duels%20Customise%20Multiplier%20Increment.user.js
// @updateURL https://update.greasyfork.org/scripts/482100/Geoguessr%20Team%20Duels%20Customise%20Multiplier%20Increment.meta.js
// ==/UserScript==

let cachedGameMode = '';
let cachedGameOptions = {};

const getGameId = () => {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
        if (script.src.includes('_buildManifest.js')) {
            return script.src.split('/')[5];
        }
    }
}

const gameMode = () => {
    return document.querySelector('.footer-controls_buttonTitle__PbvQo').textContent.toLowerCase();
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
        "body": JSON.stringify(body),
        "method": method,
        "mode": "cors",
        "credentials": "same-origin"
    })
}

window.modifySetting = (e, settingName) => {
    let newValue = e.value;
    if (settingName === 'multiplierIncrement') {
        newValue *= 10;
        newValue = Math.round(newValue);
    } else {
        newValue *= 1; // string to number conversion
        newValue = Math.round(newValue);
    }

    // Fetch the game options
    fetchWithCors(`https://www.geoguessr.com/_next/data/${getGameId()}/en/party.json`, "GET")
    .then((response) => response.json())
    .then((data) => {
        let gameOptions = data.pageProps.party.gameSettings;
        gameOptions[settingName] = newValue;
        // Push the updated options
        fetchWithCors(`https://www.geoguessr.com/api/v4/parties/v2/game-settings`, "PUT", gameOptions);
    });

    cachedGameMode = gameMode();
    cachedGameOptions[settingName] = e.value;
}

let optionTextInputInnerHTML = (id, settingName, text, icon) =>
    `<div class="numeric-option_wrapper__0fPwu"><div class="numeric-option_icon__Z0QPb"><img class="rule-icons_icon__dcLov" src="${icon}" alt="" width="48" height="48"></div><div class="numeric-option_label__doIV8">${text}</div><input type="text" id="${id}" onblur="modifySetting(this, '${settingName}')" style="text-align: center; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 60px; display: block;"></div></div>`;

function makeCustomTextInput(elt, id, settingName, text, icon) {
    elt.outerHTML = optionTextInputInnerHTML(id, settingName, text, icon);
    return elt;
}

function updateValue(inputId, option, gameOptions) {
    if (document.querySelector(inputId)) {
        if (gameMode() == cachedGameMode && option in cachedGameOptions) {
            document.querySelector(inputId).value = cachedGameOptions[option];
        } else {
            if (option == 'multiplierIncrement') {
                document.querySelector(inputId).value = gameOptions[option] / 10;
            } else {
                document.querySelector(inputId).value = gameOptions[option];
            }
        }
    }
}

let observer = new MutationObserver((mutations) => {
   if (window.location.href.includes('party') && document.querySelector('.numeric-option_wrapper__0fPwu') && !document.querySelector('#increment-input')) {
        if (gameMode().includes('duels')) {
            let multiplierIncrementBox = document.querySelectorAll('.numeric-option_wrapper__0fPwu')[1]
            makeCustomTextInput(multiplierIncrementBox, 'increment-input', 'multiplierIncrement', 'Multiplier increment', '/_next/static/images/multipliers-icon-94c4120e112cfbe8b287083d4e626842.svg');
        }

        fetchWithCors(`https://www.geoguessr.com/_next/data/${getGameId()}/en/party.json`, "GET")
        .then((response) => response.json())
        .then((data) => {
            let gameOptions = data.pageProps.party.gameSettings;

            updateValue('#increment-input', 'multiplierIncrement', gameOptions);
        });
    }
});


observer.observe(document.body, {
  characterDataOldValue: false,
  subtree: true,
  childList: true,
  characterData: false
});

document.addEventListener('keydown', (event) => {
    if (event.key == 'Escape' && document.querySelector('.party-modal_heading__UqkX6')) {
        document.activeElement.blur();
    }
});

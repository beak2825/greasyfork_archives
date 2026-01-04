// ==UserScript==
// @name         Geoguessr Team Duels Advanced Options
// @description  Adds extra options to team duel settings.
// @version      0.2.3
// @author       macca#8949
// @license      MIT
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @grant        none
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151654
// @namespace    https://greasyfork.org/en/scripts/452579-geoguessr-team-duels-advanced-options
// @downloadURL https://update.greasyfork.org/scripts/452579/Geoguessr%20Team%20Duels%20Advanced%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/452579/Geoguessr%20Team%20Duels%20Advanced%20Options.meta.js
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
    if (document.getElementsByClassName(cn('bars_content__')).length < 3) return '';
    const fullText = document.getElementsByClassName(cn('bars_content__'))[2].textContent;
    return fullText.substring(0, fullText.lastIndexOf(' ')).toLowerCase();
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

let optionTextInputInnerHTML = (id, settingName, text, icon, helpText) =>
    `<div class="${cn('numeric-option_wrapper__')} advanced-option-setting"><div class="${cn('numeric-option_icon__')}"><img alt="" loading="lazy" width="48" height="48" decoding="async" data-nimg="1" class="${cn('rule-icons_icon__')}" style="color: transparent;" src="${icon}"></div><div class="${cn('numeric-option_label__')}">${text}</div><div><input type="text" id="${id}" onblur="modifySetting(this, '${settingName}')" style="text-align: center; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 5px; width: 80px;"></div></div><p>${helpText}</p>`;

function makeCustomTextInput(elt, id, settingName, text, icon, helpText) {
    elt.parentElement.outerHTML = optionTextInputInnerHTML(id, settingName, text, icon, helpText);
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

let observer = new MutationObserver(async (mutations) => {
    if (document.querySelector('.advanced-option-setting')) return;

    await scanStyles();

    if (window.location.href.includes('party') && (document.getElementsByClassName(cn('slider-option_slider__')) || document.getElementsByClassName(cn('numeric-option_button__')))) {
        if (gameMode().includes('duels')) {
            let healthEl = document.evaluate('//div[text()="Initial health"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let multiplierEl = document.evaluate('//div[text()="Multiplier increase"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let timeAfterGuessEl = document.evaluate('//div[text()="Timer after guess"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let maxRoundTimeEl = document.evaluate('//div[text()="Max round time"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (healthEl) {
                 makeCustomTextInput(healthEl, 'health-input', 'initialHealth', 'Initial health', '/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fheart.3a3fd066.png&amp;w=96&amp;q=75', '');
             }
            if (multiplierEl) {
                makeCustomTextInput(multiplierEl, 'increment-input', 'multiplierIncrement', 'Multiplier increase', '/_next/static/media/multipliers-icon.63803925.svg', '(must be between 0.1 and 10)');
            }
            if (timeAfterGuessEl) {
                makeCustomTextInput(timeAfterGuessEl, 'time-after-guess-input', 'timeAfterGuess', 'Timer after guess', '/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftime-limit.8a68c82e.png&w=96&q=75', '(must be between 10 and 300 seconds)');
            }
            if (maxRoundTimeEl) {
                makeCustomTextInput(maxRoundTimeEl, 'max-round-time-input', 'maxRoundTime', 'Max round time', '/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftime-limit.8a68c82e.png&w=96&q=75', '(0 for no time limit)');
            }
        } else if (gameMode() == 'city streaks') {
            let gameTimeEl = document.evaluate('//div[text()="Game time"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (gameTimeEl) {
                makeCustomTextInput(gameTimeEl, 'time-input', 'duration', 'Game time', '/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftime-limit.8a68c82e.png&w=96&q=75', '(must be between 60 and 900 seconds)');
            }
        } else {
            let roundTimeEl = document.evaluate('//div[text()="Round time"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (roundTimeEl) {
                let settingName = 'roundTime';
                let helpText = '(must be between 10 and 600 seconds)';
                if (gameMode() == 'bullseye') {
                    settingName = 'bullseyeRoundTime';
                    helpText = '(must be less than 600 seconds, 0 for no time limit)';
                }
                makeCustomTextInput(roundTimeEl, 'time-input', settingName, 'Round time', '/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftime-limit.8a68c82e.png&w=96&q=75', helpText);
            }
        }

        fetchWithCors(`https://www.geoguessr.com/_next/data/${getGameId()}/en/party.json`, "GET")
        .then((response) => response.json())
        .then((data) => {
            let gameOptions = data.pageProps.party.gameSettings;

            if (gameMode() == 'city streaks') {
                updateValue('#time-input', 'duration', gameOptions);
            } else if (gameMode().includes('duels')) {
                updateValue('#health-input', 'initialHealth', gameOptions);
                updateValue('#increment-input', 'multiplierIncrement', gameOptions);
                updateValue('#time-after-guess-input', 'timeAfterGuess', gameOptions);
                updateValue('#max-round-time-input', 'maxRoundTime', gameOptions);
            } else if (gameMode() == 'bullseye') {
                updateValue('#time-input', 'bullseyeRoundTime', gameOptions);
            } else {
                updateValue('#time-input', 'roundTime', gameOptions);
            }
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
    if (event.key == 'Escape' && document.getElementsByClassName(cn('party-modal_heading__'))) {
        document.activeElement.blur();
    }
});

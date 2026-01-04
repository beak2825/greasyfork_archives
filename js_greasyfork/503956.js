// ==UserScript==
// @name        Predictive input checking
// @description Adds a toggle that will check your input as you type before submitting it
// @namespace   Violentmonkey Scripts
// @match       https://*.duolingo.com/*
// @grant       GM.log
// @grant       GM.listValues
// @version     0.1
// @author      neobrain
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503956/Predictive%20input%20checking.user.js
// @updateURL https://update.greasyfork.org/scripts/503956/Predictive%20input%20checking.meta.js
// ==/UserScript==

// Courtesy of https://greasyfork.org/en/scripts/491399-duohacker/code
const keys = () => {
    const d = (t) => `[data-test="${t}"]`;
    return {
        AUDIO_BUTTON: d('audio-button'),
        BLAME_INCORRECT: d('blame blame-incorrect'),
        CHALLENGE: '[data-test~="challenge"]',
        CHALLENGE_CHOICE: d('challenge-choice'),
        CHALLENGE_CHOICE_CARD: d('challenge-choice-card'),
        CHALLENGE_JUDGE_TEXT: d('challenge-judge-text'),
        CHALLENGE_LISTEN_SPELL: d('challenge challenge-listenSpell'),
        CHALLENGE_LISTEN_TAP: d('challenge-listenTap'),
        CHALLENGE_TAP_TOKEN: '[data-test*="challenge-tap-token"]',
        CHALLENGE_TAP_TOKEN_TEXT: d('challenge-tap-token-text'),
        CHALLENGE_TEXT_INPUT: d('challenge-text-input'),
        CHALLENGE_TRANSLATE_INPUT: d('challenge-translate-input'),
        CHALLENGE_TYPE_CLOZE: d('challenge challenge-typeCloze'),
        CHALLENGE_TYPE_CLOZE_TABLE: d('challenge challenge-typeClozeTable'),
        CHARACTER_MATCH: d('challenge challenge-characterMatch'),
        PLAYER_NEXT: [d('player-next'), d('story-start')].join(','),
        PLAYER_SKIP: d('player-skip'),
        STORIES_CHOICE: d('stories-choice'),
        STORIES_ELEMENT: d('stories-element'),
        STORIES_PLAYER_DONE: d('stories-player-done'),
        STORIES_PLAYER_NEXT: d('stories-player-continue'),
        STORIES_PLAYER_START: d('story-start'),
        TYPE_COMPLETE_TABLE: d('challenge challenge-typeCompleteTable'),
        WORD_BANK: d('word-bank'),
        PLUS_NO_THANKS: d('plus-no-thanks'),
        PRACTICE_HUB_AD_NO_THANKS_BUTTON: d('practice-hub-ad-no-thanks-button')
    };
};

function getElementIndex(element) {
    let result = null;
    if (element instanceof Array) {
        for (let i = 0; i < element.length; i++) {
            result = getElementIndex(element[i]);
            if (result) break;
        }
    } else {
        for (let prop in element) {
            if (prop == 'challenge') {
                if (typeof element[prop] == 'object')
                    return element;
                return element[prop];
            }
            if (element[prop] instanceof Object || element[prop] instanceof Array) {
                result = getElementIndex(element[prop]);
                if (result) break;
            }
        }
    }
    return result;
}

function getProps(element) {
    let propsClass = Object.keys(element).filter((att) => /^__reactProps/g.test(att))[0];
    return element[propsClass];
}

// Gets the Challenge
function getChallenge() {
    const dataTestDOM = document.querySelectorAll(keys().CHALLENGE);
    if (dataTestDOM.length > 0) {
        let current = 0;
        for (let i = 0; i < dataTestDOM.length; i++) {
            if (dataTestDOM[i].childNodes.length > 0)
                current = i;
        }
        const currentDOM = dataTestDOM[current];
        const propsValues = getProps(currentDOM);
        const { challenge } = getElementIndex(propsValues);
        return challenge;
      return;
    }
}

function handleInput(input, vertices, vtx, matchIdx) {
  if (vtx.length == 0) {
    GM.log("DONE!")
    return matchIdx;
  }

  const remInput = input.slice(matchIdx)

  let bestMatch = matchIdx;

  for (const prefix of vtx) {
    if (matchIdx >= input.length) {
      GM.log(`Option: ${prefix.lenient}`)
    }
    if (remInput.toLowerCase().startsWith(prefix.lenient.toLowerCase())) {
      const newMatchIdx = handleInput(input, vertices, vertices[prefix.to], matchIdx + prefix.lenient.length)
      if (newMatchIdx > bestMatch) {
        bestMatch = newMatchIdx
      }
      if (input.length == newMatchIdx) {
        return input.length
      }
    }
  }

  if (vtx == vertices[0]) {
    GM.log("FAIL!")
  }
  return bestMatch;
}

window.addEventListener('load', () => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          // TODO: Can check if immediate child has data-test="challenge challenge-translate"
          for (const challengeElem of node.querySelectorAll('textarea[data-test="challenge-translate-input"]')) {
            let refresh

            const helper = document.createElement('span')
            helper.className = '_1Z76W'
            helper.innerHTML = '&nbsp;'
            helper.style.display = 'flex'

            let enable = false
            const enableButton = document.createElement('input')
            enableButton.type = 'checkbox'
            enableButton.onclick = () => { refresh() }
            helper.appendChild(enableButton)

            const goodmsg = document.createElement('span')
            goodmsg.style.whiteSpaceCollapse = 'preserve'
            helper.appendChild(goodmsg)
            const errmsg = document.createElement('span')
            errmsg.style.backgroundColor = 'rgb(var(--color-walking-fish))'
            helper.appendChild(errmsg)

            challengeElem.parentNode.insertBefore(helper, challengeElem)
            refresh = () => {
              let input = challengeElem.value
              if (input.endsWith(".") || input.endsWith("!") || input.endsWith("?")) {
                enableButton.checked = true
              }

              if (!enableButton.checked) {
                goodmsg.innerText = ""
                errmsg.innerText = ""
                return
              }
              if (!challenge) {
                challenge = getChallenge()
              }

              input = input.toLowerCase().replaceAll(/[,.!?;\-]/g, " ").replaceAll(/ +/g, " ")
              const idx = handleInput(input, challenge.grader.vertices, challenge.grader.vertices[0], 0)
              goodmsg.innerText = input.slice(0, idx)
              if (idx < input.length) {
                errmsg.innerText = input.slice(idx)
              } else if (idx == input.length) {
                // TODO: Currently, this is also applied on a perfect match
                // errmsg.innerText = "…"
                errmsg.innerText = ""
              }
            };

            let challenge = undefined
            challengeElem.addEventListener('input', (event) => {
              refresh();
            });
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})

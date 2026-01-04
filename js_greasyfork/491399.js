// ==UserScript==
// @name duohacker
// @namespace https://www.duolingo.com
// @homepageURL https://github.com/elvisoliveira/duohacker
// @supportURL https://github.com/elvisoliveira/duohacker/issues
// @version 1.0.11
// @description there's cheats for Duolingo? what
// @author elvisoliveira
// @match https://www.duolingo.com/practice*
// @match https://www.duolingo.com/learn*
// @license MIT
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/491399/duohacker.user.js
// @updateURL https://update.greasyfork.org/scripts/491399/duohacker.meta.js
// ==/UserScript==

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

const TIME_OUT = 1500;

window.dynamicInput = (element, text) => {
    const tag = element.tagName === 'SPAN' ? 'textContent' : 'value';
    const input = element;
    const lastValue = input[tag];
    input[tag] = text;
    const event = new Event('input', { bubbles: true });
    event.simulated = true;
    const tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
};

window.clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
});

// https://stackoverflow.com/a/39165137
// https://github.com/Venryx/mobx-devtools-advanced/blob/master/Docs/TreeTraversal.md
window.getReactFiber = (dom) => {
    const key = Object.keys(dom).find((key) => {
        return (
            key.startsWith('__reactFiber$') || // react 17+
            key.startsWith('__reactInternalInstance$') // react <17
        );
    });
    return dom[key];
};

// Gets Challenge Object
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
    }
}

// Solves the Challenge
function classify() {
    const challenge = getChallenge();
    if (!challenge) return;
    window.actions[challenge.type](challenge);
}

function pressEnter() {
    const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
    });

    // Stops when an answer is incorrect
    const isIncorrect = document.querySelectorAll(keys().BLAME_INCORRECT).length > 0;
    if (isIncorrect) {
        terminal.log('Incorrect, stopped');
        clearInterval(mainInterval);
    }

    const isPlayerNext = document.querySelector(keys().PLAYER_NEXT);
    if (isPlayerNext !== null)
        isPlayerNext.dispatchEvent(clickEvent);

    if (/learn/gi.test(window.location.href) == true)
        window.location.replace('https://www.duolingo.com/practice');
}

// Main Function
function main() {
    try {
        const isPlayerNext = document.querySelectorAll(keys().PLAYER_NEXT);
        const isAdScreen = document.querySelector([keys().PLUS_NO_THANKS, keys().PRACTICE_HUB_AD_NO_THANKS_BUTTON].join(','));
        if (isPlayerNext !== null && isPlayerNext.length > 0) {
            if (isPlayerNext[0].getAttribute('aria-disabled') === 'true')
                classify();
        } else if (isAdScreen !== null && isAdScreen.length > 0) {
            isAdScreen.click();
        }
        setTimeout(pressEnter, 150); // pressEnter();
    } catch (e) {
        // terminal.log(e);
    }
}

// To not mess duolingo's own log
function setConsole() {
    const iframe = document.createElement('iframe');
    iframe.id = 'logger';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.terminal = iframe.contentWindow.console;
}

// Calls main()
let mainInterval;
function solveChallenge() {
    if (document.getElementById('logger') == null)
        setConsole();

    // Check if its a Skill / Alphabet / Checkpoint URL
    if (/lesson|practice/gi.test(window.location.href) == true) {
        clearInterval(mainInterval);
        mainInterval = setInterval(main, TIME_OUT);
    }

    if (/learn/gi.test(window.location.href) == true)
        window.location.replace('https://www.duolingo.com/practice');
}

(solveChallenge)();

window.keys = keys();
window.actions = {};

window.actions.assist =
window.actions.definition = (challenge) => {
    const { choices, correctIndex } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_CHOICE);
    tokens.forEach((e, i) => {
        if (i == correctIndex)
            e.dispatchEvent(clickEvent);
    });
    return { choices, correctIndex };
};

window.actions.characterMatch = (challenge) => {
    const { pairs } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN);
    pairs.forEach((pair) => {
        for (let i = 0; i < tokens.length; i++) {
            if (
                tokens[i].innerText === pair.fromToken ||
                tokens[i].innerText === pair.learningToken
            ) {
                tokens[i].dispatchEvent(clickEvent);
            }
        }
    });
    return { pairs };
};

window.actions.select =
window.actions.gapFill =
window.actions.readComprehension =
window.actions.selectPronunciation =
window.actions.listenComprehension =
window.actions.characterSelect = (challenge) => {
    const { choices, correctIndex } = challenge;
    const { CHALLENGE_CHOICE } = window.keys;
    document.querySelectorAll(CHALLENGE_CHOICE)[correctIndex].dispatchEvent(clickEvent);
    return { choices, correctIndex };
};

window.actions.completeReverseTranslation = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
    let i = 0;
    displayTokens.forEach((token) => {
        if (token.isBlank) {
            dynamicInput(tokens[i], token.text);
            i++;
        }
    });
    return { displayTokens };
};

window.actions.characterIntro =
window.actions.dialogue = (challenge) => {
    const { choices, correctIndex } = challenge;
    document.querySelectorAll(window.keys.CHALLENGE_JUDGE_TEXT)[correctIndex].dispatchEvent(clickEvent);
    return { choices, correctIndex };
};

window.actions.judge = (challenge) => {
    const { correctIndices } = challenge;
    document.querySelectorAll(window.keys.CHALLENGE_JUDGE_TEXT)[correctIndices[0]].dispatchEvent(clickEvent);
    return { correctIndices };
};

window.actions.listen = (challenge) => {
    const { prompt } = challenge;
    let textInputElement = document.querySelectorAll(window.keys.CHALLENGE_TRANSLATE_INPUT)[0];
    dynamicInput(textInputElement, prompt);
    return { prompt };
};

window.actions.listenComplete = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
    let i = 0;
    displayTokens.forEach((token) => {
        if (token.isBlank)
            dynamicInput(tokens[i], token.text);
    });
    return { displayTokens };
};

window.actions.listenIsolation = (challenge) => {
    const { correctIndex } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_CHOICE);
    tokens.forEach((e, i) => {
        if (i == correctIndex) {
            e.dispatchEvent(clickEvent);
        }
    });
    return { correctIndex };
};

window.actions.listenMatch = (challenge) => {
    const { pairs } = challenge;
    const tokens = document.querySelectorAll('button'.concat(window.keys.CHALLENGE_TAP_TOKEN));
    for (let i = 0; i <= 3; i++) {
        const dataset = getReactFiber(tokens[i]).return.child.stateNode.dataset.test;
        const word = dataset.split('-')[0];
        tokens[i].dispatchEvent(clickEvent);
        for (let j = 4; j <= 7; j++) {
            const text = tokens[j].querySelector(window.keys.CHALLENGE_TAP_TOKEN_TEXT).innerText;
            if (/\s/g.test(dataset) && text.endsWith(` ${word}`)) {
                tokens[j].dispatchEvent(clickEvent);
            } else if (text == word) {
                tokens[j].dispatchEvent(clickEvent);
            }
        }
    }
    return { pairs }
};

window.actions.listenSpell = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_LISTEN_SPELL.concat(' input[type="text"]:not([readonly])'));
    let i = 0;
    displayTokens.forEach((word) => {
        if (!isNaN(word.damageStart)) {
            for (let c of word.text.substring(word.damageStart, word.damageEnd ?? word.text.length)) {
                dynamicInput(tokens[i], c);
                i++;
            }
        }
    });
    return { displayTokens };
};

window.actions.listenTap = (challenge) => {
    const { correctTokens } = challenge;
    const tokens = Array.from(document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN)).filter(e => e.tagName === 'BUTTON');
    for (let word of correctTokens) {
        for (let i of Object.keys(tokens)) {
            if (tokens[i].innerText === word) {
                tokens[i].dispatchEvent(clickEvent);
                tokens.splice(i, 1);
                break;
            }
        }
    }
    return { correctTokens };
};

window.actions.match = (challenge) => {
    const { pairs } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
    pairs.forEach((pair) => {
        for (let i = 0; i < tokens.length; i++) {
            if (
                tokens[i].innerText === pair.fromToken ||
                tokens[i].innerText === pair.learningToken
            ) {
                tokens[i].dispatchEvent(clickEvent);
            }
        }
    });
    return { pairs };
};

window.actions.name = (challenge) => {
    const { correctSolutions, articles, grader } = challenge;
    let tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
    if (articles) {
        correctSolutions.forEach((solution) => {
            solution = solution.split(' ');
            solution.forEach((word) => {
                let i = articles.indexOf(word);
                if (i > -1) {
                    document.querySelectorAll(window.keys.CHALLENGE_CHOICE)[i].dispatchEvent(clickEvent);
                    solution.splice(solution.indexOf(word), 1);
                    dynamicInput(tokens[0], solution.join(' '));
                }
            });
        });
    } else {
        correctSolutions.forEach((solution) => {
            dynamicInput(tokens[0], solution);
        });
    }
    return { correctSolutions, articles, grader };
};

window.actions.partialReverseTranslate = (challenge) => {
    const { displayTokens, grader } = challenge;
    let tokens = document.querySelectorAll('[contenteditable=true]');
    let value = '';
    displayTokens.forEach((token) => {
        if (token.isBlank)
            value = value + token.text;
    });
    dynamicInput(tokens[0], value);
    return { displayTokens, grader };
};

window.actions.speak = (challenge) => {
    const { prompt } = challenge;
    document.querySelectorAll(window.keys.PLAYER_SKIP)[0].dispatchEvent(clickEvent);
    return { prompt };
};

window.actions.selectTranscription = (challenge) => {
    const { choices, correctIndex } = challenge;
    document.querySelectorAll(window.keys.CHALLENGE_JUDGE_TEXT)[correctIndex].dispatchEvent(clickEvent);
    return { choices, correctIndex };
};

window.actions.tapCloze = (challenge) => {
    const { choices, correctIndices } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN);
    for (let i = 0; i < correctIndices.length; i++) {
        choices.forEach((value, j) => {
            if (correctIndices[i] == j) {
                for (let k = 0; k < tokens.length; k++) {
                    if (tokens[k].innerText == value) {
                        tokens[k].dispatchEvent(clickEvent);
                    }
                }
            }
        });
    }
    return { choices, correctIndices };
};

window.actions.tapClozeTable = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
    displayTokens.forEach((line) => {
        line.forEach((column) => {
            column.forEach((word) => {
                if (word.damageStart) {
                    tokens.forEach((token) => {
                        if (token.innerText == word.text.substring(word.damageStart, word.text.length)) {
                            token.dispatchEvent(clickEvent);
                        }
                    });
                }
            });
        });
    });
    return { displayTokens };
};

window.actions.tapComplete = (challenge) => {
    const { choices, correctIndices } = challenge;
    const tokens = document.querySelectorAll(window.keys.WORD_BANK.concat(' ', window.keys.CHALLENGE_TAP_TOKEN_TEXT));
    correctIndices.forEach((i) => {
        tokens[i].dispatchEvent(clickEvent);
    });
    return { choices, correctIndices };
};

window.actions.tapCompleteTable = (challenge) => {
    const { choices, displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.WORD_BANK.concat(' ', window.keys.CHALLENGE_TAP_TOKEN));
    displayTokens.forEach((line) => {
        line.forEach((column) => {
            if (column[0].isBlank == true) {
                tokens.forEach((e) => {
                    if (e.innerText == column[0].text) {
                        e.dispatchEvent(clickEvent);
                    }
                });
            }
        });
    });
    return { choices, displayTokens };
};

window.actions.translate = (challenge) => {
    const { correctTokens, correctSolutions } = challenge;
    if (correctTokens) {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
        let ignoreTokeIndexes = [];
        for (let correctTokenIndex in correctTokens) {
            for (let tokenIndex in tokens) {
                const token = tokens[tokenIndex];
                if (ignoreTokeIndexes.includes(tokenIndex)) continue;
                if (token.innerText === correctTokens[correctTokenIndex]) {
                    token.dispatchEvent(clickEvent);
                    ignoreTokeIndexes.push(tokenIndex);
                    break;
                }
            }
        }
    } else if (correctSolutions) {
        let textInputElement = document.querySelectorAll(
            window.keys.CHALLENGE_TRANSLATE_INPUT
        )[0];
        dynamicInput(textInputElement, correctSolutions[0]);
    }
    return { correctTokens };
};

window.actions.typeCloze = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TYPE_CLOZE.concat(' input'));
    let i = 0;
    displayTokens.forEach((word) => {
        if (word.damageStart) {
            dynamicInput(tokens[i], word.text.substring(word.damageStart, word.text.length));
            i++;
        }
    });
    return { displayTokens };
};

window.actions.typeClozeTable = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.CHALLENGE_TYPE_CLOZE_TABLE.concat(' input'));
    let i = 0;
    displayTokens.forEach((line) => {
        line.forEach((column) => {
            column.forEach((word) => {
                if (word.damageStart) {
                    dynamicInput(tokens[i], word.text.substring(word.damageStart, word.text.length));
                    i++;
                }
            });
        });
    });
    return { displayTokens };
};

window.actions.typeCompleteTable = (challenge) => {
    const { displayTokens } = challenge;
    const tokens = document.querySelectorAll(window.keys.TYPE_COMPLETE_TABLE.concat(' input'));
    let index = 0;
    displayTokens.forEach((line) => {
        line.forEach((column) => {
            if (column[0].isBlank == true) {
                dynamicInput(tokens[index], column[0].text);
                index++;
            }
        });
    });
    return { displayTokens };
};

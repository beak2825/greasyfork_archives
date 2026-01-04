// ==UserScript==
// @name        Duohacker v5
// @namespace   Violentmonkey Scripts
// @match       https://*.duolingo.com/*
// @grant       none
// @version     1.0
// @author      Phạm Anh Khoa
// @description Duohacker v5[Auto hack in duolingo]
// @downloadURL https://update.greasyfork.org/scripts/475504/Duohacker%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/475504/Duohacker%20v5.meta.js
// ==/UserScript==

let solvingIntervalId;
let isAutoMode = true;
const debug = true;

function addButtons() {
    if (window.location.pathname === '/learn') {
        let button = document.querySelector('a[data-test="global-practice"]');
        if (button) {
            button.click();
        }
    }

    const solveAllButton = document.getElementById("solveAllButton");
    if (solveAllButton !== null) {
        solving();
        return;
    }

    const original = document.querySelectorAll('[data-test="player-next"]')[0];
    if (original === undefined) {
        const startButton = document.querySelector('[data-test="start-button"]');
        console.log(`Wrapper line: ${startButton}`);
        if (startButton === null) {
            return;
        }
        const wrapper = startButton.parentNode;
        const solveAllButton = document.createElement('a');
        solveAllButton.className = startButton.className;
        solveAllButton.id = "solveAllButton";
        solveAllButton.innerText = "COMPLETE SKILL";
        solveAllButton.removeAttribute('href');
        solveAllButton.addEventListener('click', () => {
            solving();
            setInterval(() => {
                const startButton = document.querySelector('[data-test="start-button"]');
                if (startButton && startButton.innerText.startsWith("START")) {
                    startButton.click();
                }
            }, 3000);
            startButton.click();
        });
        wrapper.appendChild(solveAllButton);
    } else {
        const wrapper = document.getElementsByClassName('_10vOG')[0];
        wrapper.style.display = "flex";

        const solveCopy = document.createElement('button');
        const pauseCopy = document.createElement('button');

        solveCopy.id = 'solveAllButton';
        solveCopy.innerHTML = solvingIntervalId ? 'PAUSE SOLVE' : 'SOLVE ALL';
        solveCopy.disabled = false;
        pauseCopy.innerHTML = 'SOLVE';

        const buttonStyle = `
      min-width: 150px;
      font-size: 17px;
      border:none;
      border-bottom: 4px solid #58a700;
      border-radius: 18px;
      padding: 13px 16px;
      transform: translateZ(0);
      transition: filter .2s;
      font-weight: 700;
      letter-spacing: .8px;
      background: #55CD2E;
      color:#fff;
      margin-left:20px;
      cursor:pointer;
    `;

        solveCopy.style.cssText = buttonStyle;
        pauseCopy.style.cssText = buttonStyle;

        [solveCopy, pauseCopy].forEach(button => {
            button.addEventListener("mousemove", () => {
                button.style.filter = "brightness(1.1)";
            });
        });

        [solveCopy, pauseCopy].forEach(button => {
            button.addEventListener("mouseleave", () => {
                button.style.filter = "none";
            });
        });

        original.parentElement.appendChild(pauseCopy);
        original.parentElement.appendChild(solveCopy);

        solveCopy.addEventListener('click', solving);
        pauseCopy.addEventListener('click', solve);

        solving();
    }
}


setInterval(addButtons, 3000);

function solving() {
    if (solvingIntervalId) {
        //clearInterval(solvingIntervalId);
        //solvingIntervalId = undefined;
        //document.getElementById("solveAllButton").innerText = "SOLVE ALL";
        //isAutoMode = false;
    } else {
        document.getElementById("solveAllButton").innerText = "PAUSE SOLVE";
        isAutoMode = true;
        solvingIntervalId = setInterval(solve, 500);
    }
}

function solve() {
    const selAgain = document.querySelectorAll('[data-test="player-practice-again"]');
    const practiceAgain = document.querySelector('[data-test="player-practice-again"]');
    if (selAgain.length === 1 && isAutoMode) {
        // Make sure it's the `practice again` button
        //if (selAgain[0].innerHTML.toLowerCase() === 'practice again') {
        // Click the `practice again` button
        selAgain[0].click();
        // Terminate
        return;
        //}
    }
    if (practiceAgain !== null && isAutoMode) {
        practiceAgain.click();
        return;
    }
    try {
        window.sol = findReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge;
    } catch {
        let next = document.querySelector('[data-test="player-next"]');
        if (next) {
            next.click();
        }
        return;
    }
    if (!window.sol) {
        return;
    }
    let nextButton = document.querySelector('[data-test="player-next"]');
    if (!nextButton) {
        return;
    }
    if (document.querySelectorAll('[data-test*="challenge-speak"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Speak';
        const buttonSkip = document.querySelector('button[data-test="player-skip"]');
        if (buttonSkip) {
            buttonSkip.click();
        }
    } else if (window.sol.type === 'listenMatch') {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Listen Match';

        console.log('hello');

        const nl = document.querySelectorAll('[data-test$="challenge-tap-token"]');
        window.sol.pairs?.forEach((pair) => {
            for (let i = 0; i < nl.length; i++) {
                let nlInnerText;
                if (nl[i].querySelectorAll('[data-test="challenge-tap-token-text"]').length > 1) {
                    nlInnerText = nl[i].querySelector('[data-test="challenge-tap-token-text"]').innerText.toLowerCase().trim();
                } else {
                    //nlInnerText = findSubReact(nl[i]).textContent.toLowerCase().trim();
                    nlInnerText = nl[i].getAttribute('data-test').split('-')[0].toLowerCase().trim();
                    console.log(nlInnerText);
                }
                if (
                    (
                        nlInnerText === pair.learningWord.toLowerCase().trim() ||
                        nlInnerText === pair.translation.toLowerCase().trim()
                    ) &&
                    !nl[i].disabled
                ) {
                    nl[i].click();
                }
            }
        });
    } else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
        // choice challenge
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Choice';
        if (window.sol.correctTokens !== undefined) {
            correctTokensRun();
            nextButton.click()
        } else if (window.sol.correctIndex !== undefined) {
            document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click();
            nextButton.click();
        }
    } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
        // match correct pairs challenge
        if (window.sol.pairs !== undefined) {
            if (debug)
                document.getElementById("solveAllButton").innerText = 'Pairs';
            let nl = document.querySelectorAll('[data-test$="challenge-tap-token"]');
            if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length
                === nl.length) {
                window.sol.pairs?.forEach((pair) => {
                    for (let i = 0; i < nl.length; i++) {
                        const nlInnerText = nl[i].querySelector('[data-test="challenge-tap-token-text"]').innerText.toLowerCase().trim();
                        try {
                            if (
                                (
                                    nlInnerText === pair.transliteration.toLowerCase().trim() ||
                                    nlInnerText === pair.character.toLowerCase().trim()
                                )
                                && !nl[i].disabled
                            ) {
                                nl[i].click()
                            }
                        } catch (TypeError) {
                            if (
                                (
                                    nlInnerText === pair.learningToken.toLowerCase().trim() ||
                                    nlInnerText === pair.fromToken.toLowerCase().trim()
                                )
                                && !nl[i].disabled
                            ) {
                                nl[i].click()
                            }
                        }
                    }
                })
            }
        } else if (window.sol.correctTokens !== undefined) {
            if (debug)
                document.getElementById("solveAllButton").innerText = 'Token Run';
            correctTokensRun();
            nextButton.click()
        } else if (window.sol.correctIndices !== undefined) {
            if (debug)
                document.getElementById("solveAllButton").innerText = 'Indices Run';
            correctIndicesRun();
        }
    } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Tap Token Text';
        // fill the gap challenge
        correctIndicesRun();
    } else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Text Input';
        let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
    } else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Partial Reverse';
        let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
        let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set
        nativeInputNodeTextSetter.call(elm, '"' + window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join()?.replaceAll(',', '') + '"');
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
    } else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) {
        if (debug)
            document.getElementById("solveAllButton").innerText = 'Challenge Translate Input';
        const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);

        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
    }
    nextButton.click()
}

function correctTokensRun() {
    const all_tokens = document.querySelectorAll('[data-test$="challenge-tap-token"]');
    const correct_tokens = window.sol.correctTokens;
    const clicked_tokens = [];
    correct_tokens.forEach(correct_token => {
        const matching_elements = Array.from(all_tokens).filter(element => element.textContent.trim() === correct_token.trim());
        if (matching_elements.length > 0) {
            const match_index = clicked_tokens.filter(token => token.textContent.trim() === correct_token.trim()).length;
            if (match_index < matching_elements.length) {
                matching_elements[match_index].click();
                clicked_tokens.push(matching_elements[match_index]);
            } else {
                clicked_tokens.push(matching_elements[0]);
            }
        }
    });
}

function correctIndicesRun() {
    if (window.sol.correctIndices) {
        window.sol.correctIndices?.forEach(index => {
            document.querySelectorAll('div[data-test="word-bank"] [data-test="challenge-tap-token-text"]')[index].click();
        });
        // nextButton.click();
    }
}

function findSubReact(dom, traverseUp = 0) {
    const key = Object.keys(dom).find(key => key.startsWith("__reactProps$"));
    return dom.parentElement[key].children.props;
}

function findReact(dom, traverseUp = 0) {
    let reactProps = Object.keys(dom.parentElement).find((key) => key.startsWith("__reactProps$"));
    while (traverseUp-- > 0 && dom.parentElement) {
        dom = dom.parentElement;
        reactProps = Object.keys(dom.parentElement).find((key) => key.startsWith("__reactProps$"));
    }
    if(dom?.parentElement?.[reactProps]?.children[0] == null){
return dom?.parentElement?.[reactProps]?.children[1]?._owner?.stateNode;
}
else{
return dom?.parentElement?.[reactProps]?.children[0]?._owner?.stateNode;
}
    //return dom?.parentElement?.[reactProps]?.children[0]?._owner?.stateNode;
}


window.findReact = findReact;

window.ss = solving;
 
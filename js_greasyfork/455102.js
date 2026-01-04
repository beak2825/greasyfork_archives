// ==UserScript==
// @name        duolingo auto-solve.
// @namespace   duolingo auto-solve.
// @match       https://*.duolingo.com/*
// @grant       0325skz
// @version     0.1
// @author      0325skz
// @description currently working on practice and some lessons. will try to update to the new layout soon. [duolingo cheat, duolingo hack, duolingo farmer, duolingo xp.]
// @license 0325skz

// @downloadURL https://update.greasyfork.org/scripts/455102/duolingo%20auto-solve.user.js
// @updateURL https://update.greasyfork.org/scripts/455102/duolingo%20auto-solve.meta.js
// ==/UserScript==

var intervalId;

function addButtons() {
    if (document.getElementById("solveAllButton") !== null) {
        return;
    }

    let original = document.querySelectorAll('[data-test="player-next"]')[0];
    let wrapper = document.getElementsByClassName('_10vOG')[0];
    if (original == undefined) {
        let startButton = document.querySelector('[data-test="start-button"]');
        if (startButton == undefined) {
            return;
        }
        let wrapper = startButton.parentNode;
        let autoComplete = document.createElement('a');
        autoComplete.className = startButton.className;
        autoComplete.id = "solveAllButton";
        autoComplete.innerText = "COMPLETE SKILL";
        autoComplete.removeAttribute('href');
        autoComplete.onclick = function () {
            startSolving();
            setInterval(function () {
                let startButton = document.querySelector('[data-test="start-button"]');
                if (startButton && startButton.innerText.startsWith("START")) {
                    startButton.click();
                }
            }, 500);
            startButton.click();
        };
        wrapper.appendChild(autoComplete);
    } else {

        wrapper.style.display = "flex";

        let solveCopy = document.createElement('button');
        let pauseCopy = document.createElement('button');

        solveCopy.id = 'solveAllButton';
        if (intervalId) {
            solveCopy.innerHTML = 'PAUSE SOLVE';
        } else {
            solveCopy.innerHTML = 'SOLVE ALL';
        }
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

        //Hover effect for buttons

        function mouseOver(x) {
            x.style.filter = "brightness(1.1)";
        }

        function mouseLeave(x) {
            x.style.filter = "none";
        }

        let buttons = [solveCopy, pauseCopy]

        buttons.forEach(button => {
            button.addEventListener("mousemove", () => {
                mouseOver(button);
            });
        });

        buttons.forEach(button => {
            button.addEventListener("mouseleave", () => {
                mouseLeave(button);
            });
        });



        original.parentElement.appendChild(pauseCopy);
        original.parentElement.appendChild(solveCopy);


        solveCopy.addEventListener('click', solving);
        pauseCopy.addEventListener('click', solve);
    }
}

setInterval(addButtons, 1500);

function solving() {
    if (intervalId) {
        pauseSolving();
    } else {
        startSolving();
    }
}

function startSolving() {
    if (intervalId) {
        return;
    }
    document.getElementById("solveAllButton").innerText = "PAUSE SOLVE";
    intervalId = setInterval(solve, 200);
}

function pauseSolving() {
    if (!intervalId) {
        return;
    }
    document.getElementById("solveAllButton").innerText = "SOLVE ALL";
    clearInterval(intervalId);
    intervalId = undefined;
}

function solve() {
    try {
        window.sol = FindReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge;
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
    let btn = null;

    let selNext = document.querySelectorAll('[data-test="player-next"]');
    let selAgain = document.getElementsByClassName('_3_pD1 _2ESN4 _2arQ0 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _1dlWz _2gnHr _2L5kw _3Ry1f')

    if (selAgain.length === 1) {
        // Make sure it's the `practice again` button
        if (selAgain[0].innerHTML.toLowerCase() === 'practice again') {
            // Click the `practice again` button
            selAgain[0].click();

            // Terminate
            return;
        }
    }

    if (selNext.length === 1) {
        // Save the button element
        btn = selNext[0];

        if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
            if (window.sol.correctIndices) {
                window.sol.correctIndices.forEach(index => {
                    document.querySelectorAll('[data-test="challenge-choice"]')[index].children[0].click();
                });
                // Click the first element
            } else if (window.sol.articles) {
                var article = '';
                for (var i = 0; i < window.sol.articles.length; i++) {
                    if (window.sol.correctSolutions[0].startsWith(window.sol.articles[i])) {
                        Array.from(document.querySelectorAll('[data-test="challenge-choice"]'))
                            .find((elm) =>
                                elm.querySelector('[data-test="challenge-judge-text"]').innerText == window.sol.articles[i]
                            ).click();
                        article = window.sol.articles[i];
                        break;
                    }
                }
                let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0].replace(article + ' ', '') : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
                let inputEvent = new Event('input', {
                    bubbles: true
                });

                elm.dispatchEvent(inputEvent);
            } else {
                document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click();
            }
            // Click the solve button
            btn.click();
        }

        if (document.querySelectorAll('[data-test="challenge-choice-card"]').length > 0) {
            // Click the first element
            if (window.sol.correctIndices) {
                window.sol.correctIndices.forEach(index => {
                    document.querySelectorAll('[data-test="challenge-choice-card"]')[index].children[0].click();
                });
            } else {
                document.querySelectorAll('[data-test="challenge-choice-card"]')[window.sol.correctIndex].click();
            }
            // Click the solve button
            btn.click();
        }

        if (window.sol.type == 'listenMatch') {
            let nl = document.querySelectorAll('[data-test="challenge-tap-token"]');
            window.sol.pairs.forEach((pair) => {
                for (let i = 0; i < nl.length; i++) {
                    let nlInnerText;
                    if (nl[i].querySelectorAll('[data-test="challenge-tap-token-text"]').length > 1) {
                        nlInnerText = nl[i].querySelector('[data-test="challenge-tap-token-text"]').innerText.toLowerCase().trim();
                    } else {
                        nlInnerText = FindSubReact(nl[i]).text.toLowerCase().trim();
                    }
                    if (
                        (
                            nlInnerText == pair.learningWord.toLowerCase().trim() ||
                            nlInnerText == pair.translation.toLowerCase().trim()
                        ) &&
                        !nl[i].disabled
                    ) {
                        nl[i].click();
                    }
                }
            });
        }

        if (window.sol.type == 'listenSpell') {
            let tokens = window.sol.displayTokens.filter(x => x.damageStart !== undefined);
            let elms = document.querySelectorAll('._2cjP3._2IKiF');
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

            var solutionCharacters = [];
            for (let tok of tokens) {
                for (let i = tok.damageStart; i < tok.damageEnd; i++) {
                    solutionCharacters.push(tok.text[i]);
                }
            }

            for (var elmIndex = 0; elmIndex < elms.length; elmIndex++) {
                nativeInputValueSetter.call(elms[elmIndex], solutionCharacters[elmIndex]);

                let inputEvent = new Event('input', {
                    bubbles: true
                });

                elms[elmIndex].dispatchEvent(inputEvent);
            }
        }

        if (document.querySelectorAll('[data-test="challenge-tap-token"]').length > 0) {
            // Click the first element
            if (window.sol.pairs) {
                let nl = document.querySelectorAll('[data-test="challenge-tap-token"]');
                if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length == document.querySelectorAll('[data-test="challenge-tap-token"]').length) {
                    window.sol.pairs.forEach((pair) => {
                        for (let i = 0; i < nl.length; i++) {
                            const nlInnerText = nl[i].querySelector('[data-test="challenge-tap-token-text"]').innerText.toLowerCase().trim();
                            if (
                                (
                                    nlInnerText == pair.learningToken.toLowerCase().trim() ||
                                    nlInnerText == pair.fromToken.toLowerCase().trim()
                                ) &&
                                !nl[i].disabled
                            ) {
                                nl[i].click();
                            }
                        }
                    });
                }
            } else {
                let clicked = {}
                let nl = document.querySelectorAll('[data-test="challenge-tap-token"]');
                window.sol.correctIndices.forEach(index => {
                    let correctAnswer = window.sol.correctTokens[index];
                    for (let i = 0; i < nl.length; i++) {
                        if ((nl[i].innerText).toLowerCase().trim() == correctAnswer.toLowerCase().trim() && !nl[i].disabled && !clicked[i]) {
                            clicked[i] = 1;
                            nl[i].click();
                            break;
                        }
                    }
                });
            }
            // Click the solve button
            btn.click();
        }

        if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {

            let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        }

        if (document.getElementsByTagName('textarea').length > 0) {
            let elm = document.getElementsByTagName('textarea')[0]

            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);

            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        }

        // Continue
        btn.click();
    }
}

function FindSubReact(dom, traverseUp = 0) {
    const key = Object.keys(dom).find(key => key.startsWith("__reactProps$"));
    return dom.parentElement[key].children.props;
}

function FindReact(dom, traverseUp = 0) {
    const key = Object.keys(dom.parentElement).find(key => key.startsWith("__reactProps$"));
    return dom.parentElement[key].children[0]._owner.stateNode;
}

window.findReact = FindReact;

window.ss = startSolving;
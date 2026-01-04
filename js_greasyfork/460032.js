// ==UserScript==
// @name        DuoFastRead
// @description  Duolingo Read and Help
// @namespace   JS Scripts
// @match       https://*.duolingo.com/*
// @grant       none
// @version     0.3.8
// @author      vanAmsen
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460032/DuoFastRead.user.js
// @updateURL https://update.greasyfork.org/scripts/460032/DuoFastRead.meta.js
// ==/UserScript==

// Challenge types
const CHARACTER_SELECT_TYPE = 'characterSelect';
const CHARACTER_MATCH_TYPE = 'characterMatch'; // not yet
const TRANSLATE_TYPE = 'translate';
const LISTEN_TAP_TYPE = 'listenTap';
const TAP_COMPLETE = 'tapComplete';
const NAME_TYPE = 'name';
const COMPLETE_REVERSE_TRANSLATION_TYPE = 'completeReverseTranslation';
const LISTEN_TYPE = 'listen';
const SELECT_TYPE = 'select';
const JUDGE_TYPE = 'judge';
const FORM_TYPE = 'form';
const ASSIST_TYPE = 'assist';
const LISTEN_MATCH_TYPE = 'listenMatch';
const LISTEN_COMPLETE = 'listenComplete';
const LISTEN_SPELL_TYPE = 'listenSpell';
const PART_REVTRANS_TYPE = 'partialReverseTranslate';
const LISTEN_COMPREHENSION_TYPE = 'listenComprehension';
const READ_COMPREHENSION_TYPE = 'readComprehension';
const CHARACTER_INTRO_TYPE = 'characterIntro';
const DIALOGUE_TYPE = 'dialogue';
const SELECT_TRANSCRIPTION_TYPE = 'selectTranscription';
const SPEAK_TYPE = 'speak';
const MATCH_TYPE = 'match';
const SELECT_PRONUNCIATION_TYPE = 'selectPronunciation';

// Query DOM keys
const CHALLENGE_CHOICE_CARD = '[data-test="challenge-choice-card"]';
const CHALLENGE_CHOICE = '[data-test="challenge-choice"]';
const CHALLENGE_TRANSLATE_INPUT = '[data-test="challenge-translate-input"]';
const CHALLENGE_LISTEN_TAP = '[data-test="challenge-listenTap"]';
const CHALLENGE_JUDGE_TEXT = '[data-test="challenge-judge-text"]';
const CHALLENGE_TEXT_INPUT = '[data-test="challenge-text-input"]';
const CHALLENGE_TAP_TOKEN = '[data-test="challenge-tap-token"]';
const CHALLENGE_TAP_TOKEN_TEXT = '[data-test="challenge-tap-token-text"]';
const CHALLENGE_PART_REVTRANS = '[data-test*="challenge-partialReverseTranslate"]';
const CHALLENGE_SPEAK = '[data-test*="challenge-speak"]';
const START_BUTTON = '[data-test="start-button"]';
const PLAYER_NEXT = '[data-test="player-next"]';
const PLAYER_SKIP = '[data-test="player-skip"]';
const PLAYER_PRACTICE = '[data-test="player-practice-again"]';
const BLAME_INCORRECT = '[data-test="blame blame-incorrect"]';
const CHARACTER_MATCH = '[data-test="challenge challenge-characterMatch"]';

const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
});


const intervalMS = 2500
let lastRead = "";
var intervalId;
var isAutoMode = false;
function addButtons() {
    /*
    if(window.location.pathname == '/learn'){
        let button = document.querySelector('a[data-test="global-practice"]');
        if(button){
            button.click();
            return;
        }
    }
    */
    if (document.getElementById("solveAllButton") !== null) {
        return;
    }

    let original = document.querySelectorAll(PLAYER_NEXT)[0];
    let wrapper = document.getElementsByClassName('_10vOG')[0];
    if (original == undefined) {
        let startButton = document.querySelector(START_BUTTON);
        if (startButton == undefined) {
            return;
        }
        let wrapper = startButton.parentNode;
        let autoComplete = document.createElement('a');
        autoComplete.className = startButton.className;
        autoComplete.id = "solveAllButton";
        autoComplete.innerText = "COMPLETE";
        autoComplete.removeAttribute('href');
        autoComplete.onclick = function () {
            startSolving();
            setInterval(function () {
                let startButton = document.querySelector(START_BUTTON);
                if (startButton && startButton.innerText.startsWith("START")) {
                    startButton.click();
                }
            }, intervalMS);
            startButton.click();
        };
        wrapper.appendChild(autoComplete);
    } else {

        wrapper.style.display = "flex";

        let solveCopy = document.createElement('button');
        let pauseCopy = document.createElement('button');

        solveCopy.id = 'solveAllButton';
        if (intervalId) {
            solveCopy.innerHTML = 'PAUSE';
        } else {
            solveCopy.innerHTML = 'AUTO';
        }
        solveCopy.disabled = false;
        pauseCopy.innerHTML = 'SOLVE';

        let styleMin = `
    min-width: ${(window.innerWidth - 60) / 3}px;
    font-size: 14px;
    padding: 12px 12px;
    margin-left:8px;
    border:none;
    border-bottom: 4px solid #58a700;
    border-radius: 12px;
    transform: translateZ(0);
    transition: filter .2s;
    font-weight: 700;
    letter-spacing: .8px;
    background: #55CD2E;
    color:#fff;
    cursor:pointer;
    `;

    let originalMin = `
    min-width: ${(window.innerWidth - 60) / 3}px;
    font-size: 14px;
    padding: 12px 12px;
    margin-left:8px;
    `;

        let styleMax = `
    min-width: 150px;
    font-size: 17px;
    padding: 13px 16px;
    margin-left:20px;
    border:none;
    border-bottom: 4px solid #58a700;
    border-radius: 18px;
    transform: translateZ(0);
    transition: filter .2s;
    font-weight: 700;
    letter-spacing: .8px;
    background: #55CD2E;
    color:#fff;
    cursor:pointer;
    `;

        let buttonStyle = (window.innerWidth <= 500) ? styleMin : styleMax;

        if (window.innerWidth <= 500){
            original.style.cssText = originalMin;
        }
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

setInterval(addButtons, 1000);

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
    document.getElementById("solveAllButton").innerText = "PAUSE";
    isAutoMode = true;
    intervalId = setInterval(solve, intervalMS);
}

function pauseSolving() {
    if (!intervalId) {
        return;
    }
    document.getElementById("solveAllButton").innerText = "AUTO";
    isAutoMode = false;
    clearInterval(intervalId);
    intervalId = undefined;
}

function getChallengeObj(theObject) {
    let result = null;
    if (theObject instanceof Array) {
        for (let i = 0; i < theObject.length; i++) {
            result = getChallengeObj(theObject[i]);
            if (result) {
                break;
            }
        }
    }
    else {
        for (let prop in theObject) {
            if (prop == 'challenge') {
                if (typeof theObject[prop] == 'object') {
                    return theObject;
                }
            }
            if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = getChallengeObj(theObject[prop]);
                if (result) {
                    break;
                }
            }
        }
    }
    return result;
}

function readAloud(text, lang) {

  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  speech.lang = lang;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}

function checkAndRead() {
    let targetLang = window.sol.metadata.learning_language
    let newRead = window.sol.metadata.text

    if (window.sol.type == NAME_TYPE){
        newRead = window.sol.correctSolutions[0]
    }

    if (window.sol.type == SELECT_TYPE){
        newRead = window.sol.metadata.phrase
    }

    if (window.sol.type == FORM_TYPE){
        newRead = window.sol.metadata.challenge_construction_insights['best_solution']
    }

    if (window.sol.type == ASSIST_TYPE){
        newRead = window.sol.metadata.word
    }

    if ( window.sol.metadata.target_language == targetLang ){
        newRead = window.sol.metadata.translation
    }

    if (window.sol.type == COMPLETE_REVERSE_TRANSLATION_TYPE){
        newRead = window.sol.metadata.challenge_construction_insights['best_solution']
    }

    if(window.sol.type == PART_REVTRANS_TYPE){
        newRead = window.sol?.displayTokens?.map(t=>t.text)?.join()?.replaceAll(',', '')
    }

     if (targetLang === 'dn') {
         targetLang = 'nl';
    }
     if (targetLang === 'zn') {
         targetLang = 'zh-CN';
    }
     if (targetLang === 'zs') {
         targetLang = 'zh-CN';
    }

    if (typeof newRead !== 'undefined' && targetLang !== window.sol.metadata.from_language && newRead !== lastRead) {
    lastRead = newRead
    readAloud(newRead, targetLang);
  }
}

function getChallenge() {
    const dataTestComponentClassName = 'e4VJZ';
    const dataTestDOM = document.getElementsByClassName(dataTestComponentClassName)[0];

    if (!dataTestDOM) {
        document.querySelectorAll(PLAYER_NEXT)[0].dispatchEvent(clickEvent);
        return null;
    } else {
        const dataTestAtrr = Object.keys(dataTestDOM).filter(att => /^__reactProps/g.test(att))[0];
        const childDataTestProps = dataTestDOM[dataTestAtrr];
        const { challenge } = getChallengeObj(childDataTestProps);
        return challenge;
    }
}

function openChest(){
    if (window.location.href.includes('/learn')) {
        const openChestButton = document.querySelector('button[aria-label="Open chest"]');
        if(openChestButton){
            openChestButton.click();
            return true;
        }
    }
    return false;
}

function nextLessonRefresh(){
 // Check if the URL contains "/lesson"
    if (window.location.href.includes('/lesson')) {
        // Find all buttons on the page
        const buttons = document.querySelectorAll('button');

        // Loop through the buttons and check their text content
        buttons.forEach(button => {
            if (button.textContent === 'Review lesson') {
                // Reload the website if the button is found
                window.location.href = '/lesson';
                    // If the "Review lesson" button is not found, return true to indicate that the next lesson is possible
                return true;
            }
        });

  }
  // If the URL does not contain "/lesson", return false to indicate that the next lesson is not possible
  return false;
}

function nextLesson(){
 // Check if the URL contains "/lesson"
    if (window.location.href.includes('/learn')) {

        if(openChest()){
            return true;
        }

        const startButton = Array.from(document.querySelectorAll('div._1KUxv.zylDf')).find(div => div.innerText === 'START');
        if (startButton) {
            startButton.click();
        }

        const lessonLink = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/lesson'));
        if (lessonLink) {
            lessonLink.click();
            return true;
        }
  }
  return false;
}

function nextPractice(){

    if (window.location.href.includes('/practice')) {
        let selAgain = document.querySelectorAll(PLAYER_PRACTICE);
        if (selAgain.length === 1) {
            // Make sure it's the `practice again` button
            //if (selAgain[0].innerHTML.toLowerCase() === 'practice again') {
            // Click the `practice again` button
            selAgain[0].click();
            // Terminate
            return true;
            //}
        }
    }
    return false;
}

let debugMode = false;

function solve() {

    if (isAutoMode){
        //console.log('AUTO MODE')
        if (nextLesson() || nextPractice()){
            return;
        }
    }

    try {
        // 'e4VJZ'
        //window.sol = FindReact(document.getElementsByClassName('e4VJZ')[0]).props.currentChallenge;

        window.sol = getChallenge()

    } catch {
        let next = document.querySelector(PLAYER_NEXT);
        if (next) {
            console.log('NEXT')
            next.click();
        }
        return;
    }
    if (!window.sol) {
        let selRandom = document.querySelectorAll(CHALLENGE_CHOICE);
        if(selRandom.length > 0){
            let randomIndex = Math.floor(Math.random() * selRandom.length);
            selRandom[randomIndex].click();
        }
        return;
    }else{
        checkAndRead();
    }
    let btn = null;

    //let selNext = document.querySelectorAll('[data-test="player-next"]');
    let selNext = document.querySelectorAll(PLAYER_NEXT);

    if (selNext.length === 1) {
        // Save the button element
        btn = selNext[0];
        if(document.querySelectorAll(CHALLENGE_SPEAK).length > 0){
            let buttonSkip = document.querySelector(PLAYER_SKIP);
            if(buttonSkip){
                buttonSkip.click();
            }
        }

        if (btn && btn.getAttribute("aria-disabled")=='false') {
            btn.click();
            if(debugMode){
                alert('Click');
            }
            return;
        }


        if(window.sol.type==LISTEN_COMPLETE){
            console.log(LISTEN_COMPLETE)
            if (document.querySelectorAll(CHALLENGE_TEXT_INPUT).length > 0) {

                let elm = document.querySelectorAll(CHALLENGE_TEXT_INPUT)[0];
                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
                let inputEvent = new Event('input', {
                    bubbles: true
                });

                elm.dispatchEvent(inputEvent);
            }
            // Click the solve button
            btn.click();
        }

        if (document.querySelectorAll(CHALLENGE_CHOICE).length > 0) {
            if (window.sol.correctIndices) {
                window.sol.correctIndices?.forEach(index => {
                    document.querySelectorAll(CHALLENGE_CHOICE)[index].children[0].click();
                });
                // Click the first element
            } else if (window.sol.articles) {
                var article = '';
                for (var i = 0; i < window.sol.articles.length; i++) {
                    if (window.sol.correctSolutions[0].startsWith(window.sol.articles[i])) {
                        Array.from(document.querySelectorAll(CHALLENGE_CHOICE))
                            .find((elm) =>
                                  elm.querySelector(CHALLENGE_JUDGE_TEXT).innerText == window.sol.articles[i]
                                 ).click();
                        article = window.sol.articles[i];
                        break;
                    }
                }
                let elm = document.querySelectorAll(CHALLENGE_TEXT_INPUT)[0];
                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0].replace(article + ' ', '') : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
                let inputEvent = new Event('input', {
                    bubbles: true
                });

                elm.dispatchEvent(inputEvent);
            } else {
                document.querySelectorAll(CHALLENGE_CHOICE)[window.sol.correctIndex].click();
            }
            // Click the solve button
            btn.click();
        }

        if (document.querySelectorAll(CHALLENGE_CHOICE_CARD).length > 0) {
            // Click the first element
            if (window.sol.correctIndices) {
                window.sol.correctIndices?.forEach(index => {
                    document.querySelectorAll(CHALLENGE_CHOICE_CARD)[index].children[0].click();
                });
            } else {
                document.querySelectorAll(CHALLENGE_CHOICE_CARD)[window.sol.correctIndex].click();
            }
            // Click the solve button
            btn.click();
        }

        if (window.sol.type == LISTEN_MATCH_TYPE) {
            let nl = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            if(nl.length>0){
                window.sol.pairs?.forEach((pair) => {
                    for (let i = 0; i < nl.length; i++) {
                        let nlInnerText;
                        if (nl[i].querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT).length > 1) {
                            nlInnerText = nl[i].querySelector(CHALLENGE_TAP_TOKEN_TEXT).innerText.toLowerCase().trim();
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
            }else{
                let de = document.querySelectorAll("div._3xyKe");
                let allButtons = Array.from(de).flatMap(div => Array.from(div.querySelectorAll("button")));
                let buttonGroups = {};

                allButtons.forEach(button => {
                    const dataTestValue = button.getAttribute("data-test");
                    if (dataTestValue) {
                        if (!buttonGroups[dataTestValue]) {
                            buttonGroups[dataTestValue] = [];
                        }
                        buttonGroups[dataTestValue].push(button);
                    }
                });

                for (const key in buttonGroups) {
                    const group = buttonGroups[key];
                    for (let i = 0; i < group.length - 1; i++) {
                        group[i].addEventListener("click", () => {
                            group[i + 1].click();
                        });
                        group[i+1].addEventListener("click", () => {
                            group[i].click();
                        });
                    }
                }

                for (const key in buttonGroups) {
                    const group = buttonGroups[key];
                    group[0].click();
                }
            }
            // Click the solve button
            btn.click();
        }

        if(window.sol.type==TAP_COMPLETE){
            //let nl = document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT);
            let dv = document.querySelectorAll('div._1yW4j._2LmyT');
            let tapButtons = Array.from(dv).flatMap(div => Array.from(div.querySelectorAll('button')));
            let correctIdx = window.sol.correctIndices;

            correctIdx.forEach(idx => {
                tapButtons[idx].click();
            });

            // Click the solve button
            btn.click();
        }

        if (window.sol.type == LISTEN_SPELL_TYPE) {
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

        if (document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT).length > 0) {
            if(!window.sol.correctTokens){
                if (window.sol.pairs) {
                    let nl = document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT);
                    window.sol.pairs?.forEach((pair) => {
                        for (let i = 0; i < nl.length; i++) {
                            const nlInnerText = nl[i].textContent.toLowerCase().trim();
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
            }else{
                let clicked = {}
                let nl = document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT);
                window.sol.correctIndices?.forEach(index => {
                    let correctAnswer = window.sol.choices[index];
                    for (let i = 0; i < nl.length; i++) {
                        if ((nl[i].innerText).toLowerCase().trim() == correctAnswer.text.toLowerCase().trim() && !nl[i].disabled && !clicked[i]) {
                            clicked[i] = 1;
                            nl[i].click();
                            break;
                        }
                    }
                });
            }
        }else if(window.sol.correctTokens){
            let clicked = {}
            let nl = document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT);
            window.sol.correctIndices?.forEach(index => {
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

    if (document.querySelectorAll(CHALLENGE_TAP_TOKEN).length > 0) {
        // Click the first element
        if (window.sol.pairs) {
            let nl = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            if (document.querySelectorAll(CHALLENGE_TAP_TOKEN_TEXT).length == document.querySelectorAll(CHALLENGE_TAP_TOKEN).length) {
                window.sol.pairs?.forEach((pair) => {
                    for (let i = 0; i < nl.length; i++) {
                        const nlInnerText = nl[i].querySelector(CHALLENGE_TAP_TOKEN_TEXT).innerText.toLowerCase().trim();
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
        } else if(!window.sol.correctTokens){
            let clicked = {}
            let nl = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            window.sol.correctIndices?.forEach(index => {
                let correctAnswer = window.sol.choices[index];
                for (let i = 0; i < nl.length; i++) {
                    if ((nl[i].innerText).toLowerCase().trim() == correctAnswer.text.toLowerCase().trim() && !nl[i].disabled && !clicked[i]) {
                        clicked[i] = 1;
                        nl[i].click();
                        break;
                    }
                }
            });
        } else {
            let clicked = {}
            let nl = document.querySelectorAll(CHALLENGE_TAP_TOKEN);
            window.sol.correctIndices?.forEach(index => {
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

    if (document.querySelectorAll(CHALLENGE_TEXT_INPUT).length > 0) {

        let elm = document.querySelectorAll(CHALLENGE_TEXT_INPUT)[0];
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
        let inputEvent = new Event('input', {
            bubbles: true
        });

        elm.dispatchEvent(inputEvent);
    }


    if (document.querySelectorAll(CHALLENGE_PART_REVTRANS).length > 0) {
        let elm = document.querySelector(CHALLENGE_PART_REVTRANS)?.querySelector("span[contenteditable]");
        let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set
        nativeInputNodeTextSetter.call(elm, window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t=>t.text)?.join()?.replaceAll(',', '') );
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
        if(debugMode){
            alert("Text3");
       }
    }
    //   if (typeof window.sol.correctSolutions !== 'undefined' && window.sol.targetLanguage !== 'en') {
    //       readAloud(window.sol.correctSolutions, window.sol.targetLanguage);
    //   }
    // Continue
        btn.click();
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
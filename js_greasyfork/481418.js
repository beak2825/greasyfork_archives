// ==UserScript==
// @name         ANKO! Bunpro with Anki Style Buttons
// @namespace    michael.cheung
// @version      1.0
// @description  Configure the Bunpro UI with simple Anki quiz style Easy/Hard answer buttons - demo at https://kyounojanaru.com/wanikani-and-bunpro/anko-anki-buttons-for-bunpro/
// @author       Michael Cheung
// @match        https://bunpro.jp/reviews*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/481418/ANKO%21%20Bunpro%20with%20Anki%20Style%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/481418/ANKO%21%20Bunpro%20with%20Anki%20Style%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (function init() {

        /* -------------------------------------------------------
            Wait until all the necesary elements have rendered...
        * ------------------------------------------------------ */
        const manualInput = document.querySelector('#manual-input');
        const section = document.querySelector('section');
        const footer = document.querySelector('footer');
		const answerDisplay = document.querySelector(".bp-quiz-question");
        const quizMetaDataDiv = document.querySelector('#quiz-metadata-element');

        if (manualInput && section && footer && answerDisplay && quizMetaDataDiv) {

            /* -------------------------------------------------------
                Go
            * ------------------------------------------------------ */
            setUpAnkoUI();
            manualInput.disabled = true;
            //setupKeyboardTriggers(); //experimental!

            /* -----------------------------------------------------------
                When the answer box gets the relevant class, click submit
            * ---------------------------------------------------------- */
            const submitButton = document.querySelector('.' + elSubmitButton);
            let lastClassName = manualInput.className;
            window.setInterval(function () {
                const className = manualInput.className;
                if (className.includes("text-correct")) {
                    submitButton.click();
                    lastClassName = className;
                }
            }, 10);
        }
        else {
            /* -------------------------------------------------------
                Polling for element renderings...
            * ------------------------------------------------------ */
            setTimeout(init, 0);
        }
    }
    )();


})();

let _ankoEnabled = true;

/* -------------------------------------------------------
   Configure keyboard buttons to trigger the UI
* ------------------------------------------------------ */
function setupKeyboardTriggers(){
	const manualInput = document.querySelector('#' + elManualInput);
	const submitButton = document.querySelector('.' + elSubmitButton);
    const ankiShowAnswer = document.querySelector("#" + elShowAnswer);
    const ankiDontKnow = document.querySelector("#" + elUnknown);
    const ankiKnow = document.querySelector("#" + elKnown);
    const ankiNext = document.querySelector("#" + elNext);
    /* -------------------------------------------------------
       Pressing [1] triggers "Don't know"
    * ------------------------------------------------------ */
    document.addEventListener("keydown", function (event) {
        if (event.key == '1') {
            if(ankiDontKnow.style.display != 'none'){
                //Initiate the first submit click (needs 2 clicks to continue)
                submitButton.click();
                ankiDontKnow.click();
                event.preventDefault();
                event.stopPropagation();
                manualInput.value = '';
            }
        }else{
            ankiShowAnswer.click();
        }
    });
    /* -------------------------------------------------------
       Pressing [2] triggers "Know"
    * ------------------------------------------------------ */
    document.addEventListener("keydown", function (event) {
        if (event.key == '2') {
            if(ankiKnow.style.display != 'none'){
                ankiKnow.click();
                event.preventDefault();
                event.stopPropagation();
                manualInput.focus();
                manualInput.value = '';
                manualInput.innerHTML = '';
            }
        }else{
            ankiShowAnswer.click();
        }
    });
    /* -------------------------------------------------------
       Pressing [3] triggers "Show answer"
    * ------------------------------------------------------ */
    document.addEventListener("keydown", function (event) {
        if (event.key == '3') {
            if(ankiShowAnswer.style.display != 'none'){
                displayAnswer();
                event.preventDefault();
                event.stopPropagation();
            }
        }
    });
    /* -------------------------------------------------------
       Pressing [4] triggers "Next"
    * ------------------------------------------------------ */
    document.addEventListener("keydown", function (event) {
        if (event.key == '4') {
            if(ankiNext.style.display != 'none'){
                ankiNext.click();
                event.preventDefault();
                event.stopPropagation();
            }
        }
    });
}


/* -------------------------------------------------------
   Display the 'Show answer' button only
* ------------------------------------------------------ */
function resetAnkiQuiz(){
    const quizConsole = document.querySelector('.' + elQuizConsole);
    const showBtn = document.querySelector('#' + elShowAnswer);
    const knowBtn = document.querySelector('#' + elKnown);
    const unknownBtn = document.querySelector('#' + elUnknown);
    const ankiButtonsSection = document.querySelector('#' + elAnkiButtons);
    const nextBtn = document.querySelector('#' + elNext);

    quizConsole.style.display = "flex";
    showBtn.style.display = 'block';
    knowBtn.style.display = 'none';
    unknownBtn.style.display = 'none';
    ankiButtonsSection.style.opacity = '1';
    nextBtn.style.display = 'none';

    enableButtons();
}

/* -------------------------------------------------------
   Show the 'Easy/Hard' buttons and hide 'Show answer'
* ------------------------------------------------------ */
function setAnkiQuiz(){
    const quizConsole = document.querySelector('.' + elQuizConsole);
    const showBtn = document.querySelector('#' + elShowAnswer);
    const knowBtn = document.querySelector('#' + elKnown);
    const unknownBtn = document.querySelector('#' + elUnknown);
    const ankiButtonsSection = document.querySelector('#' + elAnkiButtons);

    showBtn.style.display = 'none';
    knowBtn.style.display = 'inline-block';
    knowBtn.style.width = '49% !important';
    unknownBtn.querySelector('span.text-right').text = "Hard";
    unknownBtn.style.display = 'inline-block';
    unknownBtn.style.width = '49% !important';
    quizConsole.style.display = "flex";
    ankiButtonsSection.style.opacity = '1';

    enableButtons();
}

/* -------------------------------------------------------
   Show the 'Next' buttons and hide 'Easy/Hard'
* ------------------------------------------------------ */
function showNextButton(){
    const quizConsole = document.querySelector('.' + elQuizConsole);
    const showBtn = document.querySelector('#' + elShowAnswer);
    const knowBtn = document.querySelector('#' + elKnown);
    const unknownBtn = document.querySelector('#' + elUnknown);
    const nextBtn = document.querySelector('#' + elNext);

    showBtn.style.display = 'none';
    knowBtn.style.display = 'none';
    unknownBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    nextBtn.style.width = '100% !important';
    quizConsole.style.display = "flex";
}

/* -------------------------------------------------------
   Make the 'Easy/Hard' buttons unclickable
* ------------------------------------------------------ */
function disableButtons(){
    const knowBtn = document.querySelector('#' + elKnown);
    const unknownBtn = document.querySelector('#' + elUnknown);
    const ankiButtonsSection = document.querySelector('#' + elAnkiButtons);

    knowBtn.disabled = true;
    unknownBtn.disabled = true;
    ankiButtonsSection.style.opacity = '0.2';
}

/* -------------------------------------------------------
   Make the 'Easy/Hard' buttons clickable
* ------------------------------------------------------ */
function enableButtons(){
    const knowBtn = document.querySelector('#' + elKnown);
    const unknownBtn = document.querySelector('#' + elUnknown);
    const ankiButtonsSection = document.querySelector('#' + elAnkiButtons);

    knowBtn.disabled = false;
    unknownBtn.disabled = false;
    ankiButtonsSection.style.opacity = '1';
}

/* --------------------------------------------------------
    Create the Anki buttons and configure them
* -------------------------------------------------------*/
function setUpAnkoUI() {

    /* --------------------------------------------------------
        Insert the know/don't know buttons
     * -------------------------------------------------------*/
	const answerBox = document.querySelector('#' + elManualInput);
    answerBox.style.display = 'none';
    answerBox.insertAdjacentHTML('beforebegin', ankiButtonsHtml);

    /* --------------------------------------------------------
        Insert the anko settings buttons
     * -------------------------------------------------------*/
    const sideButtons = document.querySelector('ul.justify-end');
    sideButtons.insertAdjacentHTML('afterbegin', ankiSettingsButtonHtml);

    /* --------------------------------------------------------
        Insert the anko settings modal window
     * -------------------------------------------------------*/
    const footer = document.querySelector('footer');
    footer.insertAdjacentHTML('beforebegin', ankiSettingsModalHtml);

    /* --------------------------------------------------------
        Insert the next question countdown box
     * -------------------------------------------------------*/
    const ankiSettingsModal = document.querySelector('#' + elSettingsModal);
    ankiSettingsModal.insertAdjacentHTML('afterend', ankiCountdownHtml);
    ankiSettingsModal.style.display = 'none';
    const nextCountdown = document.querySelector('#' + elNextCountdown);
    nextCountdown.style.display = 'none';

    /* --------------------------------------------------------
        Set up anko settings window control
     * -------------------------------------------------------*/
    let ankiSettingsShown = false;
    const ankiSettingsButton = document.querySelector('#' + elSettingsBtn);
    ankiSettingsButton.addEventListener('click', function () {
        if (!ankiSettingsShown) {
            ankiSettingsModal.style.display = 'block';
            ankiSettingsShown = true;
        } else {
            ankiSettingsModal.style.display = 'none';
            ankiSettingsShown = false;
        }
    });
    const ankiSettingsModalClose = document.querySelector('.anki-settings-close');
    ankiSettingsModalClose.addEventListener('click', function () {
        ankiSettingsModal.style.display = 'none';
        ankiSettingsShown = false;
    });
    /* --------------------------------------------------------
        Set up the anko toggle on/off buttons
     * -------------------------------------------------------*/
    const ankoToggleOff = document.querySelector('#' + elBtnToggleOff);
    const ankoToggleOn = document.querySelector('#' + elBtnToggleOn);
    ankoToggleOff.addEventListener('click', function () {
        ankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
        ankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
		toggleAnko(false);
    });
    ankoToggleOn.addEventListener('click', function () {
        ankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
        ankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
		toggleAnko(true);
    });

    /* --------------------------------------------------------
        Disable the answer input when submit is clicked
     * -------------------------------------------------------*/
	const submitButton = document.querySelector('.' + elSubmitButton);
    submitButton.addEventListener('click', function () {
		if(_ankoEnabled){
			answerBox.disabled = true;
		}
    });
    submitButton.style.visibility = "hidden";

    /* --------------------------------------------------------
        Set up ank'Anko!' heading
     * -------------------------------------------------------*/
    const header = document.querySelector('header');
    const headerCentre = header.querySelector('ul');
    headerCentre.insertAdjacentHTML('afterend', ankoHeading);

    const ankoHeadingBanner = document.querySelector('#' + elAnkoheading);
    ankoHeadingBanner.addEventListener('click', function () {
        if (!ankiSettingsShown) {
            ankiSettingsModal.style.display = 'block';
            ankiSettingsShown = true;
        } else {
            ankiSettingsModal.style.display = 'none';
            ankiSettingsShown = false;
        }
    });

    /* --------------------------------------------------------
        The Anki 'Easy' button
     * -------------------------------------------------------*/
    const ankiKnow = document.querySelector("#" + elKnown);
    ankiKnow.addEventListener('click', function () {

        submitKnown();

    }, false);

    /* --------------------------------------------------------
        The Anki 'Hard' button
     * -------------------------------------------------------*/
    const ankiDontKnow = document.querySelector("#" + elUnknown);
    ankiDontKnow.addEventListener('click', function () {

        submitUnknown();

    }, false);

    /* --------------------------------------------------------
        The Anki 'Show answer' button
     * -------------------------------------------------------*/
    const showAnswer = document.querySelector("#" + elShowAnswer);
    showAnswer.addEventListener('click', function () {

        if(_ankoEnabled) {
          	displayAnswer();
		}
    }, false);

    /* --------------------------------------------------------
        When a new question appears, reset the anki buttons
    * -------------------------------------------------------*/
    const attempts = document.querySelector('[title="Correct question attempts over total attempts"]');
    const remaining = attempts.querySelector('p');
    const observer = new MutationObserver(() => {
        if(_ankoEnabled) {
			resetAnkiQuiz();
		}
    });
    observer.observe(remaining, { subtree: true, childList: true, characterData: true });

    resetAnkiQuiz();
}

function toggleAnko(enabled){

	const answerBox = document.querySelector('#' + elManualInput);
    const ankiKnow = document.querySelector("#" + elKnown);
    const ankiDontKnow = document.querySelector("#" + elUnknown);
    const showAnswer = document.querySelector("#" + elShowAnswer);
	const submitButton = document.querySelector('.' + elSubmitButton);

    const ankiButtons = document.querySelector("#" + elAnkiButtons);

    if(enabled){
        _ankoEnabled = true;
        answerBox.disabled = true;
        answerBox.style.display = 'none';

        //ankiKnow.style.display = 'inline-block';
        //ankiDontKnow.style.display = 'inline-block';
        showAnswer.style.display = 'inline-block';

        ankiButtons.display = 'grid';
    }else{
        _ankoEnabled = false;
        answerBox.disabled = false;
        answerBox.style.display = 'inline-block';
		answerBox.focus();
        submitButton.style.visibility = "visible";

        ankiKnow.style.display = 'none';
        ankiDontKnow.style.display = 'none';
        showAnswer.style.display = 'none';

        ankiButtons.display = 'none';
    }
}

function hideQuizConsole(milliseconds) {

    /* --------------------------------------------------------
        Hide the answer box area then re-appear
    * -------------------------------------------------------*/
    const quizConsole = document.querySelector('.' + elQuizConsole);
    quizConsole.style.display = "none";

    if(milliseconds > 0){
        setTimeout(function () {
            quizConsole.style.display = "flex";
        }, milliseconds);
    }
}

function displayAnswer() {
    /* --------------------------------------------------------
        Get the quiz answers and sanitise them
    * -------------------------------------------------------*/
    const quizElement = document.querySelector("#" + elQuizElement);
    const answers = quizElement.getAttribute('data-meta-answers-array');
    const answerDisplay = document.querySelector("." + elAnswerDisplay);
    const answerDisplayBtn = answerDisplay.querySelector('button');

    let answer = answers.split(',')[0];
    answer = answer.replace('"', '');
    answer = answer.replace('[', '');
    answer = answer.replace(']', '');
    answer = answer.replace('"', '');

    /* --------------------------------------------------------
       Display the quiz answer
    * -------------------------------------------------------*/
    answerDisplayBtn.innerHTML = '<span class=\"inline-block   text-correct\">' + answer + '</span>';

    /* --------------------------------------------------------
       Hide the toast element for notifications
    * -------------------------------------------------------*/
    setTimeout(function () {
        const toastElement = document.querySelector(".z-tooltip");
        if (toastElement) {
            toastElement.style.visibility = "hidden";
        }
    }, 10);

    /* --------------------------------------------------------
       Hide the answer box area then re-appear
    * -------------------------------------------------------*/
    const quizConsole = document.querySelector('.' + elQuizConsole);
    quizConsole.style.display = "none";

    setTimeout(function () {
        quizConsole.style.display = "flex";
        setAnkiQuiz();
        disableButtons();
    }, 300);
    setTimeout(function () {
        quizConsole.style.display = "flex";
        enableButtons();
    }, 2000);
}

function submitKnown(){

    /* --------------------------------------------------------
       Hide the answer box area then re-appear
    * -------------------------------------------------------*/
    hideQuizConsole(2000);

	const answerBox = document.querySelector('#' + elManualInput);
    answerBox.focus();
    answerBox.value = '';
    answerBox.innerHTML = '';
    const ankiKnow = document.querySelector("#" + elKnown);
    ankiKnow.style.fontSize = '1.2rem';

    /* --------------------------------------------------------
            Get the quiz answers and sanitise them
        * -------------------------------------------------------*/
    const quizElement = document.querySelector("#" + elQuizElement);
    const answers = quizElement.getAttribute('data-meta-answers-array');
    //const answerDisplay = document.querySelector(".bp-quiz-tense");

    let answer = answers.split(',')[0];
    answer = answer.replace('"', '');
    answer = answer.replace('[', '');
    answer = answer.replace(']', '');
    answer = answer.replace('"', '');

    setTimeout(function () {

        /* ----------------------------------------------------------
                Set the answer in the react generated input
             * -------------------------------------------------------- */
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
        ).set;
        nativeInputValueSetter.call(answerBox, answer);
        const inputEvent = new Event("input", { bubbles: true });
        answerBox.dispatchEvent(inputEvent);

        /* --------------------------------------------------------
               Hide the toast element for notifications
               (appears when keys are pressed)
            * -------------------------------------------------------*/
        const toastElement = document.querySelector(".z-tooltip");
        if (toastElement) {
            toastElement.style.visibility = "hidden";
        }
    }, 10);


    /* ----------------------------------------------------------
           Submit the answer after a couple of seconds
        * -------------------------------------------------------- */

	const submitButton = document.querySelector('.' + elSubmitButton);
    setTimeout(function () {
        submitButton.click();
        ankiKnow.style.fontSize = '1.0rem';
    }, 200);
}

function submitUnknown(){
    /* --------------------------------------------------------
       Hide the answer box area then re-appear
     * -------------------------------------------------------*/
	const submitButton = document.querySelector('.' + elSubmitButton);
    setTimeout(function () {
        showNextButton();
    }, 10);
    submitButton.click();

    /* --------------------------------------------------------
       Hide the toast element for notifications
    * -------------------------------------------------------*/
    setTimeout(function () {
        const toastElement = document.querySelector(".z-tooltip");
        if (toastElement) {
            toastElement.style.visibility = "hidden";
        }
    }, 10);

    /* --------------------------------------------------------
       Hide the toast element for notifications
    * -------------------------------------------------------*/
    setTimeout(function () {
        const toastElement = document.querySelector(".z-tooltip");
        if (toastElement) {
            toastElement.style.visibility = "hidden";
        }
    }, 4010);
}

/* --------------------------------------------------------
    The HTML elements
* -------------------------------------------------------*/

const ankiCustomCss = `

    .btn-anki {
        width: 49% !important;
    }
    div#next-countdown {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -50px;
        margin-left: -50px;
        width: 100px;
        height: 100px;
        font-size: 200%;
        border: 2px solid lightgrey;
        padding: 30px;
    }
    .anko{
       font-family: fantasy;
       background-color: #c54b4d;
       padding: 10px;
       border: 1px solid black;
    }
    .anko-svg{
       display: inline-block;
       width: 100%;
    }
    .anko-heading{
       font-size: 200%;
       color: #fff;
       cursor: pointer;
    }
    .anko-kanji{
       display: inline-block;
       font-size: 200%;
    }
    .svg-small {
       margin-right: 35px;
    }
    .svg-medium {
       margin-right: 44px;
    }
    .svg-large{
       margin-right: 70px;
    }
    #anki-settings-toggle {
       visibility: hidden
    }
    `;

const elAnkoheading = 'anko-heading';
const elToggleOn = 'anki-settings-toggle';
const elBtnToggleOff = 'anki-settings-toggle-off';
const elBtnToggleOn= 'anki-settings-toggle-on'
const elKnownAutoNext = 'anki-settings-known-auto-next';
const elUnknownCountdown = 'anki-settings-unknown-countdown';
const elUnknownAutoNext = 'anki-settings-unknown-auto-next';
const elKnownCountdown = 'anki-settings-known-countdown';
const elUnknown = 'anki-dontknow';
const elKnown = 'anki-know';
const elShowAnswer = 'anki-show';
const elCountdown = 'countdown';
const elSettingsBtn = 'anki-settings-button';
const elSettingsModal = 'anki-settings-modal';
const elNextCountdown= 'next-countdown';
const elAnkiButtons = 'anki-buttons';
const elNext = 'anki-next';
const elManualInput = 'manual-input';
const elQuizConsole = 'bp-quiz-console';
const elAnswerDisplay = 'bp-quiz-question';
const elQuizElement = 'quiz-metadata-element';
const elSubmitButton = 'InputManual__button';

const ankiButtonsHtml =
    `<style>` + ankiCustomCss + `</style>` +
    `<section id="` + elAnkiButtons + `" class="mx-auto grid w-full max-w-max-content-width items-center gap-6 px-12 text-center transition-all sm:w-[95%] md:gap-16 md:px-24">
         <div class="row">

         <button id="`+ elShowAnswer +`" class="w-full"><span class="justify-center items-center rounded flex text-primary-contrast bg-secondary-accent border-secondary-accent shadow text-body border min-h-button-min-height px-12 py-8">
         <span class="text-right">Show answer</span>
         <span class="ml-6">
             <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="undefined"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3Z" fill="currentColor"></path></svg>
         </span>
         </span>
         </button>

          <button id="`+ elUnknown +`" class="btn-anki w-1\/2">
            <span class="justify-center items-center rounded flex text-primary-accent border-primary-accent text-body border min-h-button-min-height px-12 py-8">
                <span class="text-right">Hard</span>
                <span class="ml-6">
                    <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="undefined">
                        <path d="M6.5 2c-1.1 0-1.99.9-1.99 2L4.5 20c0 1.1.89 2 1.99 2H18.5c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.83-4.83c-.37-.38-.88-.59-1.41-.59H6.5Zm7 6V3.5L19 9h-4.5c-.55 0-1-.45-1-1Z" fill="currentColor"></path>
                    </svg>
                </span>
            </span>
        </button>
        <button id="` + elKnown + `" class="btn-anki w-1\/2">
            <span class="justify-center items-center rounded flex text-primary-contrast bg-secondary-accent border-secondary-accent shadow text-body border min-h-button-min-height px-12 py-8">
                <span class="text-right">Easy</span>
                <span class="ml-6">
                    <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="undefined">
                        <path d="M17.8 6.3a.996.996 0 0 0-1.41 0l-5.64 5.64 1.41 1.41L17.8 7.7c.38-.38.38-1.02 0-1.4Zm4.24-.01-9.88 9.88-3.48-3.47a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L23.45 7.71a.996.996 0 0 0 0-1.41h-.01a.975.975 0 0 0-1.4-.01ZM1.62 14.12 5.8 18.3c.39.39 1.02.39 1.41 0l.7-.7-4.88-4.9a.996.996 0 0 0-1.41 0c-.39.39-.39 1.03 0 1.42Z" fill="currentColor"></path>
                    </svg>
                </span>
            </span>
        </button>

        <button id="` + elNext + `" class="btn-anki w-full">
            <span class="justify-center items-center rounded flex text-primary-contrast bg-secondary-accent border-secondary-accent shadow text-body border min-h-button-min-height px-12 py-8">
                <span class="text-right">Next</span>
                <span class="ml-6">
                    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="undefined">
                        <path d="M14.76 42.02c.98.98 2.56.98 3.54 0L34.92 25.4c.78-.78.78-2.04 0-2.82L18.3 5.96c-.98-.98-2.56-.98-3.54 0s-.98 2.56 0 3.54L29.24 24l-14.5 14.5c-.96.96-.96 2.56.02 3.52Z" fill="currentColor"></path>
                    </svg>
                </span>
            </span>
        </button>

        <span id="` + elCountdown + `"></span>
      </div>
    </section>`;
const ankiCountdownHtml =
    `<div class="row text-center" id="` + elNextCountdown + `"></div>`;

const dorayakiSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 368 256" enable-background="new 0 0 368 256" xml:space="preserve">
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M149.281693,232.176270
	C134.354294,230.709396 120.110901,228.292023 106.702858,222.394196
	C97.640823,218.408051 89.011154,213.750702 83.220276,205.242462
	C78.397881,198.157181 78.227768,190.965164 82.806938,183.731781
	C85.570206,179.366852 85.695236,174.893692 83.024918,170.626678
	C78.127144,162.800354 78.516678,155.154053 83.391068,147.636703
	C91.970169,134.405869 104.957031,126.919205 119.214508,121.731850
	C152.576996,109.593430 184.915985,112.154602 215.870667,129.845428
	C217.632553,130.852356 219.335327,131.708603 221.460831,131.666382
	C239.873688,131.300598 257.993683,129.364868 275.131165,121.958717
	C279.597809,120.028404 283.796356,117.644272 287.370514,114.322670
	C293.481049,108.643883 294.096008,103.588905 289.397156,96.652367
	C284.708466,89.730850 278.090363,84.989708 270.970215,80.844353
	C237.764740,61.512085 190.467575,64.223305 161.039917,87.294182
	C155.204041,91.869438 150.124069,97.093834 149.104416,105.051460
	C148.779129,107.590210 147.269333,109.566795 144.363358,108.989227
	C141.623474,108.444656 140.675842,106.219711 141.016403,103.647179
	C141.663223,98.761215 143.657288,94.401100 146.636017,90.477066
	C153.249527,81.764740 161.879318,75.519920 171.686157,71.076454
	C210.090759,53.675423 247.286041,55.702312 282.858582,78.858047
	C288.894531,82.787148 293.946899,87.948059 297.437744,94.390724
	C301.395294,101.694817 301.656616,108.876381 296.923828,116.086792
	C294.364044,119.986641 294.467377,124.283501 296.812134,128.327347
	C302.378265,137.926865 301.704529,145.579941 294.442627,153.909927
	C292.120056,156.574097 289.315247,158.653961 286.440460,160.656052
	C284.108673,162.280029 281.450378,163.608444 279.416412,160.759628
	C277.450745,158.006485 279.212006,155.840317 281.648804,154.111969
	C285.332886,151.498978 288.858063,148.657196 291.018402,144.571014
	C292.139435,142.450684 293.486511,140.214203 291.537079,137.022446
	C283.722778,142.554657 275.283630,146.307007 266.343750,148.936829
	C257.434784,151.557556 248.245529,152.857010 238.751434,154.228714
	C239.621918,159.073517 238.906128,163.273560 237.455643,167.937607
	C247.784027,167.709808 257.051544,164.756058 266.303192,161.690140
	C269.301361,160.696579 273.090942,157.965347 274.856842,162.590408
	C276.701202,167.420914 272.057861,168.152924 268.899506,169.345657
	C257.138824,173.786972 244.880371,175.992905 232.423752,177.227188
	C230.593109,177.408585 228.786835,177.429535 227.168930,178.505951
	C211.552200,188.896133 193.735291,192.321045 175.589722,194.052383
	C156.946884,195.831131 138.353455,194.789856 120.043434,190.433365
	C119.234703,190.240936 118.394844,190.135773 117.620201,189.851669
	C115.245758,188.980759 113.218803,187.585129 114.158958,184.726959
	C115.012024,182.133560 117.217468,181.380371 119.842339,182.061676
	C129.220108,184.495728 138.790192,185.846588 148.429138,186.287643
	C172.787918,187.402267 196.814026,185.742325 218.846115,173.969009
	C233.523392,166.125885 234.679489,157.306335 222.720184,145.783310
	C209.180267,132.737320 192.491989,125.871536 174.041718,123.525444
	C150.566742,120.540421 128.261826,124.483681 107.633118,136.421127
	C100.817238,140.365341 94.512192,145.002762 90.306358,151.921173
	C85.933228,159.114792 86.803978,164.468506 93.248840,169.940689
	C96.583122,172.771713 100.429420,174.770691 104.351372,176.621140
	C106.981956,177.862320 109.255913,179.504684 107.864723,182.708176
	C106.275467,186.367813 103.315331,185.211197 100.635773,183.982697
	C98.234932,182.881989 95.890762,181.657654 93.246628,180.352097
	C91.548180,184.754272 94.773376,186.305008 97.267944,187.847214
	C105.870728,193.165665 115.348038,196.298096 125.228447,198.164536
	C148.668167,202.592438 172.168488,203.277039 195.681503,198.750885
	C202.095139,197.516281 208.121155,195.094452 213.862747,191.964462
	C216.506470,190.523270 219.626190,188.501663 221.662064,192.237595
	C223.827148,196.210587 220.247070,197.802429 217.501923,199.353989
	C207.314606,205.111908 196.180634,208.089798 184.674103,208.960403
	C160.174789,210.814087 135.749329,210.509613 111.947258,203.199890
	C103.659302,200.654633 95.732208,197.250107 88.557571,191.691956
	C86.263100,195.944199 88.433899,198.881210 90.425591,201.582138
	C95.349480,208.259430 102.368889,212.257462 109.885437,215.099792
	C142.335724,227.370575 174.937332,227.375137 207.493271,215.456390
	C213.772003,213.157745 219.622559,209.879974 224.664017,205.403534
	C231.214325,199.587372 232.082245,194.996765 228.147293,187.437576
	C227.019424,185.270905 226.633377,183.288849 228.791412,181.668320
	C231.225800,179.840332 233.133743,181.082550 234.827057,183.010483
	C240.415680,189.373474 240.446915,198.413422 234.791046,206.022125
	C229.458817,213.195435 222.075867,217.702927 214.123856,221.312180
	C193.641556,230.608688 171.971954,233.077103 149.281693,232.176270
M273.737366,131.421280
	C259.728516,136.815460 244.988342,138.629776 230.030197,139.730896
	C231.996429,144.984543 235.548996,146.347473 240.193787,145.648102
	C244.629730,144.980164 249.099945,144.475693 253.490005,143.580185
	C263.967957,141.442825 274.226440,138.595261 283.260956,132.564072
	C285.455597,131.099014 288.258972,129.666489 286.480865,125.714050
	C282.281555,127.627411 278.379120,129.405502 273.737366,131.421280
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M220.640305,72.227730
	C235.478912,72.364555 248.936249,76.152374 261.473206,83.265404
	C263.920959,84.654175 266.180023,86.449120 264.961090,89.583061
	C263.612915,93.049301 260.950684,92.342552 258.359314,90.881500
	C249.138702,85.682770 239.398331,81.994820 228.811340,80.817520
	C226.501785,80.560699 224.179413,80.402634 221.859055,80.264061
	C219.463211,80.120972 217.557343,79.201050 217.065460,76.717102
	C216.587967,74.305832 218.188797,73.083771 220.640305,72.227730
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M156.682907,133.752380
	C154.313828,129.474640 156.145187,126.937691 160.019943,127.012039
	C175.089401,127.301216 189.153702,131.401672 201.933929,139.522034
	C203.782516,140.696594 204.629608,142.572067 203.454788,144.689514
	C202.223007,146.909576 200.197952,147.660797 197.970306,146.349548
	C185.999588,139.303299 173.159714,135.333862 159.227386,134.996307
	C158.466507,134.977875 157.720108,134.361206 156.682907,133.752380
z"/>
</svg>`;

const doraemonSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 720 496" enable-background="new 0 0 720 496" xml:space="preserve">
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M401.464661,497.000000
	C398.899200,493.423126 395.534119,490.798309 393.749786,486.938660
	C389.164703,477.021027 393.354919,469.337494 400.050629,461.778412
	C394.089447,458.876404 387.695068,457.905609 381.523071,456.319672
	C373.574768,454.277344 365.627563,451.890320 357.527222,450.897461
	C351.958466,450.214874 346.458832,449.045532 340.991577,448.098389
	C332.696320,446.661438 324.295135,446.215576 315.997223,445.111786
	C306.961945,443.909851 297.617157,442.298828 288.499969,447.836243
	C278.096710,454.154724 266.234863,457.629364 253.847672,455.947876
	C240.590775,454.148346 229.223618,447.794220 219.134628,439.090576
	C208.229645,429.683044 199.815964,418.365448 195.303818,404.750977
	C192.725342,396.970978 190.319290,388.602875 194.254791,380.261353
	C195.309830,378.025085 193.444290,376.794617 192.208893,375.644348
	C188.560791,372.247498 185.174149,368.682068 181.994888,364.801941
	C175.836258,357.285614 175.090927,348.535339 175.298309,339.539337
	C175.484238,331.474548 175.593948,323.370941 179.059784,315.735657
	C180.413345,312.753693 177.897095,311.412292 175.550552,310.145172
	C166.673584,305.351715 160.400665,298.445312 157.878510,288.386444
	C154.804108,276.125061 158.179794,265.637299 166.948120,257.067566
	C170.363998,253.729019 170.306549,250.974960 168.724884,247.143509
	C164.696976,237.386154 162.099274,227.177307 159.972961,216.870224
	C159.109802,212.686234 160.664352,209.080231 164.055618,206.243225
	C168.455399,202.562576 173.349213,199.706802 178.713593,197.874313
	C183.353668,196.289230 185.246078,193.690506 184.865509,188.677643
	C183.962173,176.778900 187.439651,166.046783 195.152039,156.960861
	C198.440323,153.086960 202.309158,149.466599 208.084854,149.640472
	C209.515915,149.683533 210.526443,148.918213 211.679031,148.196518
	C215.442093,145.840240 219.214798,143.763763 223.938858,143.405182
	C228.261902,143.077026 232.085220,141.650803 233.203049,136.088074
	C234.153732,131.357010 236.811539,126.918594 236.608780,121.924034
	C236.474640,118.620064 239.672684,117.918686 240.760818,115.467384
	C249.404831,95.994347 262.923889,80.385262 279.299927,66.920898
	C293.595551,55.167065 309.718414,46.776184 327.145111,41.365116
	C338.658203,37.790253 350.428802,33.915676 362.898682,34.722164
	C367.456085,35.016918 371.783020,33.184544 376.241394,33.059105
	C385.689056,32.793285 394.982300,34.357319 404.233398,36.193653
	C408.421814,37.025043 412.647827,37.427830 416.859711,38.439892
	C435.605591,42.944286 453.314026,49.861244 469.539398,60.239182
	C483.854828,69.395515 496.554626,80.490990 507.536316,93.547142
	C517.857422,105.817978 525.840637,119.397728 531.318726,134.445282
	C535.636475,146.305557 539.324219,158.195663 539.724487,171.114365
	C539.871094,175.846375 541.665833,180.832611 541.231506,185.768585
	C540.241394,197.020187 538.789490,208.154846 535.759705,219.158875
	C527.997803,247.349884 511.838440,269.674866 489.526123,287.965454
	C487.751007,289.420593 487.300995,290.563538 488.393463,292.989716
	C493.184753,303.630035 491.157928,309.261475 480.847046,314.820190
	C478.693176,315.981354 478.394775,317.605469 478.274567,319.728577
	C478.033051,323.994629 480.154114,327.883179 480.202515,332.010742
	C480.360504,345.475769 478.057343,358.806122 477.777344,372.299042
	C477.665894,377.668793 476.457245,383.247345 476.437469,389.067932
	C478.429626,389.207855 480.043793,389.321259 481.940186,389.454468
	C484.673737,382.067902 488.022583,375.398285 495.187012,370.940521
	C509.521973,362.021271 528.570190,372.094574 531.339355,386.447144
	C534.120117,400.859711 528.497131,411.667664 515.462830,416.602325
	C503.925629,420.970154 488.432953,412.986389 484.731232,402.839722
	C482.667664,397.183319 480.328918,396.068176 476.039276,398.368744
	C473.315399,399.829590 471.260681,408.413849 473.438477,410.831635
	C480.322388,418.474274 487.797668,425.217194 497.757721,429.023193
	C506.381744,432.318665 512.687622,437.828735 514.531860,448.042023
	C517.936096,466.894287 508.283234,479.201660 495.214325,490.151642
	C492.818390,492.159149 490.079956,493.753571 488.118408,496.687073
	C481.645599,497.000000 475.291199,497.000000 468.685059,496.710815
	C474.738525,493.629791 481.488953,491.655029 487.041992,487.429565
	C499.293152,478.107330 509.435852,467.547821 507.769348,450.328003
	C507.216949,444.620148 504.148224,440.904266 499.546936,438.076782
	C496.988403,436.504608 494.606354,437.330597 493.794800,439.815521
	C491.225311,447.683136 485.004181,451.472473 478.112915,454.415314
	C462.147766,461.233093 445.287567,463.676788 428.081787,463.235718
	C421.983795,463.079376 416.375153,464.990753 410.558472,465.812256
	C406.139282,466.436340 401.476898,468.752625 399.949554,474.330200
	C398.285248,480.407990 400.819336,487.628632 406.687378,491.663635
	C409.399200,493.528320 412.225555,495.226379 415.000000,497.000000
	C410.643097,497.000000 406.286194,497.000000 401.464661,497.000000
M185.558945,314.944580
	C183.130203,319.400665 182.855530,324.451477 181.521240,329.204010
	C178.923691,338.456207 179.616882,347.553650 183.550674,355.885742
	C190.695908,371.019897 204.584839,378.708618 219.013443,385.450836
	C220.116501,385.966278 221.321732,386.272156 222.251617,385.237640
	C226.945847,380.015137 233.463104,379.108734 239.788345,377.742065
	C243.089142,377.028870 245.871765,375.832611 246.079498,371.813293
	C246.239197,368.723328 248.321503,367.590485 251.031586,367.145355
	C257.017914,366.162079 261.084839,368.576447 263.699493,374.273193
	C267.757324,383.114197 269.254059,393.795624 280.187103,397.862762
	C280.314209,397.910065 280.250061,398.471527 280.278168,398.830811
	C279.217896,400.873566 276.623779,399.994507 274.865936,401.707092
	C279.842712,400.844421 283.863922,403.553925 288.374115,403.699707
	C300.491577,404.091431 312.347565,402.735504 324.199615,400.037079
	C336.243225,397.294952 347.001495,392.195343 356.882935,385.032166
	C365.782257,378.580994 371.740906,370.719604 370.826508,358.740540
	C370.298523,351.823212 370.220520,344.930756 368.836548,338.058929
	C368.186371,334.830475 367.338501,333.481506 363.966553,333.277222
	C355.227661,332.747803 347.585144,329.695648 341.200287,323.341980
	C332.176605,314.362457 329.058685,301.490143 333.318604,289.861023
	C338.837402,274.795349 350.094574,267.809265 366.793488,267.763977
	C372.721954,267.747925 373.268036,267.378662 372.530701,261.544312
	C371.188812,250.926407 368.678772,240.560333 365.301178,230.387772
	C362.283661,221.299530 361.095001,212.104507 364.208740,202.687546
	C365.062897,200.104340 365.317963,197.219254 363.828186,194.688919
	C361.638367,194.509003 360.563354,195.986954 359.212769,196.870682
	C344.814972,206.291504 329.456451,213.848816 313.099091,219.046570
	C299.373962,223.407867 285.373962,226.620880 271.045288,228.968124
	C257.894257,231.122467 244.618271,232.830750 231.487762,233.881607
	C213.486618,235.322266 195.085236,236.037796 177.283173,230.429749
	C174.641144,229.597443 172.173172,227.233124 168.878387,228.594925
	C170.712921,234.713791 172.639771,240.788071 174.324951,246.928650
	C175.034653,249.514694 175.733994,250.386414 178.786865,249.469818
	C185.747772,247.379913 193.192520,247.185944 199.939072,249.478592
	C212.471436,253.737381 222.989136,265.508881 222.477188,281.643616
	C222.017456,296.132324 209.576721,311.596649 194.158722,312.554047
	C191.441498,312.722778 188.424606,312.296295 185.558945,314.944580
M453.214294,127.189384
	C447.398010,120.058777 439.836945,114.882378 432.428802,108.470238
	C426.353333,118.993279 417.895630,126.334892 406.054810,129.345581
	C393.900391,132.436020 383.575867,129.156326 374.724579,120.052765
	C373.009003,122.895424 372.052399,125.302879 370.337463,127.350182
	C365.040070,133.674271 358.054474,133.847809 350.802155,133.292389
	C345.275421,132.869125 345.005707,138.031403 342.805176,140.935623
	C340.958221,143.373154 343.075684,145.611725 344.902252,147.293579
	C350.828308,152.750046 354.050598,159.723953 356.099152,167.285934
	C358.137115,174.808945 358.474792,175.364273 366.667023,176.539886
	C370.249481,177.054001 372.658508,178.724319 373.104187,182.337173
	C373.374634,184.529541 374.318970,185.179016 376.335724,185.936493
	C384.908966,189.156464 393.884125,190.923904 402.621246,193.530777
	C412.867279,196.587875 423.406433,198.657639 433.673615,201.652115
	C436.305023,202.419571 439.386688,202.045166 441.636749,204.139816
	C442.628723,205.063278 443.750366,205.862579 443.097229,207.478012
	C442.384399,209.241119 440.883331,209.503204 439.364471,209.098175
	C429.633698,206.503357 419.917084,203.854080 410.212616,201.162079
	C397.612213,197.666763 385.027466,194.114929 372.478241,190.599258
	C371.997864,191.281708 371.721436,191.680099 371.439301,192.074356
	C368.273041,196.498810 370.554657,202.022415 368.727570,206.527924
	C365.646973,214.124527 367.962097,220.945312 370.346710,227.953445
	C371.359467,230.929810 373.210205,231.743164 376.331635,231.755310
	C387.326172,231.798065 397.659485,228.711487 408.113007,225.906036
	C429.687927,220.115952 448.272644,209.679169 462.298615,191.937790
	C463.712952,190.148773 465.384613,188.879349 467.315002,190.326233
	C469.279053,191.798309 467.711273,193.367691 466.689972,194.986053
	C461.330902,203.478226 453.743134,209.643265 445.601105,215.130371
	C434.963593,222.299210 423.417999,227.379684 410.930634,230.754227
	C400.600128,233.545914 390.437347,236.523331 379.624786,236.383331
	C378.334564,236.366623 376.993256,236.733124 375.753815,237.152908
	C373.627808,237.872971 373.165222,239.218491 373.946198,241.452271
	C376.745758,249.459625 377.767578,257.862518 378.891602,266.209747
	C379.786621,272.855927 387.147949,279.985809 393.988159,279.574829
	C408.343079,278.712311 422.415039,282.629181 436.746613,281.782166
	C437.712219,281.725098 438.785370,281.941467 439.670898,282.337952
	C443.977081,284.265808 446.992249,282.587128 450.152008,279.516357
	C467.836212,262.330231 479.230286,241.639221 482.384979,217.294586
	C484.816437,198.531509 482.578308,179.766266 475.067566,162.101151
	C471.149231,152.885254 466.449371,144.003357 460.055328,136.448105
	C457.501068,137.273193 455.341248,138.447769 453.107269,138.611710
	C442.162842,139.414963 431.429535,141.816330 420.462402,142.578552
	C414.577240,142.987549 408.681641,144.126541 402.787384,144.920044
	C393.821503,146.127045 385.004425,148.493149 375.867584,148.300781
	C374.365967,148.269180 372.102997,148.995056 371.907410,146.506912
	C371.708710,143.979202 373.770508,143.925949 375.688141,143.645859
	C381.401581,142.811325 387.189301,142.237930 392.833313,141.300522
	C405.731537,139.158264 418.696472,137.636169 431.632080,135.843887
	C439.743835,134.719986 447.841034,133.491135 456.391571,132.244202
	C455.220703,130.276718 454.458832,128.996506 453.214294,127.189384
M518.781555,123.631073
	C505.667572,99.313629 487.259125,80.034836 463.943634,65.229996
	C444.102692,52.631443 422.355652,44.398216 399.367523,41.832783
	C376.092468,39.235329 352.448303,40.005768 329.652588,47.557850
	C301.934784,56.740616 278.778595,72.464462 260.973145,95.634605
	C256.967773,100.846764 252.961243,106.347839 251.025116,112.991234
	C256.677887,107.545746 262.678680,102.621910 268.784027,97.824112
	C270.187958,96.720863 270.512573,95.584862 269.593506,93.968605
	C268.734528,92.458084 268.275696,90.698593 269.880432,89.420677
	C271.480072,88.146790 273.004028,89.432007 274.534607,89.996750
	C276.603699,90.760208 278.275452,92.415741 281.017273,91.032532
	C290.047241,86.477036 299.541412,83.084846 309.309906,80.389664
	C312.797119,79.427521 315.318604,77.471863 316.926636,73.422638
	C322.401184,59.637287 330.494537,48.469677 346.974731,46.400921
	C359.174835,44.869438 368.944000,49.913353 373.400299,59.202446
	C374.968811,62.472027 376.621857,65.701073 378.521271,69.521896
	C389.453735,59.553230 401.704803,53.954536 416.091705,58.250465
	C431.131897,62.741474 437.076782,74.741577 438.799011,89.403297
	C440.408539,88.892822 439.321014,86.685234 441.285553,86.280685
	C444.293213,88.486229 443.663574,91.887253 444.083618,95.131615
	C444.881348,101.293236 442.654816,108.158081 447.564178,113.442062
	C455.016724,121.463371 462.950012,129.059448 468.741150,138.485825
	C470.220367,140.893600 472.043793,140.432602 473.731964,138.414764
	C475.837616,141.400253 477.859039,144.131851 477.331512,147.403458
	C476.278809,153.932632 479.576355,158.937759 483.142578,163.434097
	C485.840790,166.836075 487.443359,171.116302 487.360809,174.363129
	C487.213715,180.147369 487.823517,185.863297 488.446716,191.441772
	C490.356720,208.539352 488.170776,224.794724 482.087006,240.884918
	C478.314545,250.862274 472.789520,259.965912 468.904266,269.905548
	C467.115082,274.482758 464.715607,280.775238 457.546722,282.539276
	C462.947266,285.342621 468.328339,285.459137 473.378021,286.708435
	C476.054626,287.370605 478.502502,286.449890 480.853302,284.795654
	C495.986328,274.146759 507.971130,260.630829 517.478149,244.858734
	C523.674438,234.579102 527.062927,223.148193 530.574951,211.793167
	C533.216003,203.254044 531.639038,194.059250 534.535583,185.509674
	C535.083923,183.891266 535.075073,181.580048 534.309082,180.121033
	C532.483704,176.644165 532.280579,172.997269 532.741882,169.413147
	C533.449219,163.917908 531.344055,158.891342 530.072632,153.941437
	C527.455750,143.753342 524.101868,133.678711 518.781555,123.631073
M388.883453,339.540466
	C403.457031,346.976349 417.518616,355.526825 433.492310,359.910461
	C435.573303,360.481476 437.329102,361.952240 436.665375,364.229706
	C435.914490,366.806183 433.557495,366.227417 431.611206,365.646179
	C429.531799,365.025116 427.557678,363.579041 424.985992,364.982849
	C430.909454,368.210114 431.181458,371.277832 425.755035,374.623413
	C423.701477,375.889496 423.815002,377.605164 423.493713,379.243408
	C420.847595,392.735840 413.427277,402.958435 402.183655,410.544495
	C392.416840,417.134216 381.626892,421.225128 370.160950,423.884766
	C359.779358,426.292908 349.383881,428.038483 338.722839,426.998901
	C335.807922,426.714630 333.148987,425.069244 330.009888,425.241089
	C324.967621,425.517120 320.300110,423.497650 315.537140,422.210205
	C309.181061,420.492126 303.433594,417.176178 297.685028,414.503204
	C295.942169,416.354126 296.779968,417.848785 297.153809,419.209595
	C298.366486,423.623627 298.663452,428.145050 297.965027,432.581146
	C297.440674,435.911652 298.798553,436.734039 301.587372,436.934967
	C306.895142,437.317352 312.239624,437.493561 317.493225,438.268280
	C332.978516,440.551788 348.544220,442.123779 363.924347,445.382721
	C374.681824,447.662109 385.258972,450.617737 396.012939,452.836090
	C405.511810,454.795532 414.459259,459.374573 424.678986,457.932312
	C435.361237,456.424744 446.184540,455.910522 456.861328,454.372681
	C464.408600,453.285553 471.978638,451.740814 478.773895,447.896332
	C482.975433,445.519257 486.692871,442.664551 488.509247,437.041748
	C485.844604,438.183380 484.174286,437.563141 484.393829,435.256989
	C484.796265,431.029663 481.936676,429.047577 479.300079,426.791473
	C475.516602,423.554016 471.513031,420.551575 468.306732,416.688873
	C466.805664,414.880463 465.856720,412.966949 465.606750,410.451599
	C464.739075,401.718719 466.967499,393.211700 468.379456,384.869995
	C469.757233,376.729858 470.286438,368.468323 471.254700,360.367523
	C472.766144,347.722504 471.721802,334.764740 471.642303,321.940247
	C471.609131,316.588837 468.679108,313.824432 462.819580,313.281647
	C462.505188,314.929749 465.208862,316.467804 463.151184,318.120728
	C461.248810,319.648895 459.193115,318.676178 457.479797,317.895386
	C448.712952,313.900330 439.497314,311.380737 430.234589,308.873627
	C423.201691,306.970062 415.945770,306.228088 408.969452,304.345917
	C404.795837,303.219879 400.957184,303.272125 397.004944,303.734528
	C394.447052,315.320526 394.338989,315.484802 378.694031,331.747864
	C380.587219,335.854675 384.958923,336.829163 388.883453,339.540466
M275.160553,162.565842
	C271.215607,171.892471 268.645538,181.386810 271.368378,191.599045
	C271.957367,193.808029 272.753021,195.069977 275.356903,195.875366
	C285.213196,198.923843 294.588196,202.931900 301.143921,211.623993
	C303.309509,214.495361 306.375946,215.889450 310.285004,214.492706
	C323.362305,209.820038 336.163483,204.550018 348.381744,197.900726
	C350.884460,196.538727 352.862946,195.055222 352.930634,191.954453
	C353.133636,182.654068 353.330261,173.488174 349.806274,164.464554
	C343.851196,149.215698 328.784302,137.364410 313.838013,137.143127
	C295.565552,136.872574 283.148529,145.767822 275.160553,162.565842
M230.660141,396.999756
	C221.492416,393.973755 213.067657,389.395172 204.694656,384.683472
	C200.638443,382.400909 199.640671,383.135223 199.301422,387.791077
	C198.918015,393.052765 200.881241,397.816071 202.439987,402.585846
	C206.172852,414.008240 213.115097,423.367004 221.856293,431.537567
	C234.130798,443.010681 247.556320,450.417419 265.367889,447.973633
	C272.778839,446.956787 279.255646,444.460205 285.703766,441.304413
	C288.394623,439.987488 291.131287,438.078552 291.481781,434.870178
	C292.370789,426.732117 292.078033,418.638489 288.957428,410.878662
	C288.246918,409.111847 287.020569,408.284302 285.116974,408.350952
	C275.822083,408.676422 266.950623,406.176331 257.897675,404.642975
	C248.732147,403.090576 240.175873,399.945435 230.660141,396.999756
M422.767029,67.716827
	C415.389221,62.187492 407.809631,61.304939 398.667572,64.006927
	C381.495026,69.082359 367.812592,91.566818 375.314484,109.926918
	C380.992584,123.823402 394.926880,127.778046 406.014954,123.661339
	C425.146851,116.558182 432.056976,104.834778 431.659271,84.510696
	C431.526642,77.733665 428.540833,72.363724 422.767029,67.716827
M330.913757,112.714500
	C320.456818,108.478500 316.855103,99.315262 315.021790,89.409309
	C314.177032,84.844864 312.090881,84.821686 308.888519,85.833260
	C305.617676,86.866447 302.333435,87.960449 299.234558,89.411209
	C294.142303,91.795151 288.540649,93.266914 283.728760,97.056160
	C287.171783,99.595009 290.100098,101.738762 293.012085,103.904526
	C301.627899,110.312454 310.278503,116.675140 318.809967,123.193588
	C320.291229,124.325333 322.345734,126.102707 320.705353,128.188553
	C318.881653,130.507492 317.020721,128.225006 315.586975,127.183029
	C305.528839,119.873405 295.544739,112.461327 285.574249,105.031952
	C278.604584,99.838631 278.546295,99.668839 271.213318,104.290756
	C263.798401,108.964317 257.631348,115.096024 251.233871,121.863358
	C259.185181,124.924789 266.391602,127.990211 273.796326,130.461517
	C280.103333,132.566452 286.086395,135.065613 293.437042,133.933472
	C308.166138,131.664902 323.264740,129.720215 336.662292,139.563721
	C339.236542,136.350998 341.645050,133.479126 343.228302,129.769928
	C339.683716,126.793022 336.784302,123.155365 336.083130,118.758644
	C335.573029,115.560127 334.034393,114.214447 330.913757,112.714500
M206.630157,163.230988
	C200.284515,178.192230 200.707413,193.083878 206.792557,208.892990
	C218.896988,196.374481 233.249832,191.507858 249.543808,191.626587
	C252.797577,191.650299 253.471954,189.620728 253.593979,186.641449
	C253.841812,180.591217 252.528961,174.388153 255.383881,168.526276
	C256.285553,166.674896 255.454849,164.770935 254.040070,163.042526
	C250.205215,158.357574 245.857895,154.246918 240.543716,151.395370
	C233.887146,147.823502 227.014877,146.982300 219.659805,149.923752
	C213.472916,152.398041 210.192001,157.342575 206.630157,163.230988
M338.400360,303.998138
	C339.071930,306.008087 339.603912,308.078003 340.437531,310.018372
	C346.238342,323.520477 359.546021,329.592560 373.900482,323.949005
	C387.913239,318.439728 393.731323,303.156372 387.413635,289.575317
	C382.084961,278.120361 365.641724,269.469116 352.076111,278.031891
	C342.697601,283.951721 338.055054,292.098114 338.400360,303.998138
M184.086533,255.366379
	C173.328613,258.226929 165.613647,266.169678 164.573517,276.644592
	C163.508316,287.372253 166.347015,296.582794 176.609146,302.365051
	C185.213242,307.213104 193.807098,307.335632 202.174332,302.577362
	C210.821274,297.660004 215.496460,289.326172 215.315933,279.806183
	C215.166458,271.925537 211.137619,264.731812 204.333572,259.660065
	C198.468918,255.288574 191.859940,254.827194 184.086533,255.366379
M380.092163,415.524506
	C398.122864,409.043091 412.510315,398.850403 417.251678,378.901367
	C419.128784,371.003571 415.074524,359.243896 409.579590,356.764221
	C401.102203,352.938568 392.814056,348.832855 384.937378,343.803497
	C381.784271,341.790100 379.070496,338.606476 374.982483,338.062500
	C374.626160,347.900146 379.118835,357.253387 375.883057,367.047852
	C380.220703,369.703827 384.991669,369.803467 389.443298,370.849854
	C392.701477,371.615723 394.453186,373.032166 394.319763,376.565887
	C394.175964,380.373993 393.732544,383.979828 392.647736,387.758209
	C388.812500,401.116669 380.483337,410.433807 367.528046,414.286133
	C347.343353,420.288177 327.183472,419.644958 307.947937,409.914795
	C305.715790,408.785645 303.670471,407.602386 300.539734,409.326355
	C309.422394,415.363373 318.948181,419.544830 328.758423,420.312744
	C345.710175,421.639648 362.969391,422.411438 380.092163,415.524506
M340.900421,53.271824
	C326.787506,60.230289 319.564209,74.547974 321.177216,90.412193
	C322.183228,100.306396 327.251984,106.053352 336.063751,109.238243
	C338.123688,107.643547 337.881500,105.205849 339.261261,103.435806
	C344.794647,96.337372 351.931000,94.040131 360.433044,95.919838
	C363.160156,96.522774 365.298309,96.081024 366.263947,93.789360
	C369.637146,85.784088 372.950989,78.072533 371.033112,68.606117
	C368.067139,53.966373 353.905243,47.361912 340.900421,53.271824
M283.924469,221.254623
	C287.595184,219.906006 284.997101,218.072250 284.074402,216.773056
	C277.224365,207.127823 267.435760,200.813782 256.350067,198.778961
	C240.967087,195.955353 225.845444,198.167984 213.480148,209.472855
	C207.506287,214.934387 202.426315,220.991531 199.364380,228.798355
	C204.810852,229.862534 209.778946,230.002029 214.662384,228.889069
	C220.896469,227.468277 227.159821,227.354340 233.488678,227.654877
	C236.139572,227.780746 238.878891,228.001511 241.450607,227.511078
	C255.294312,224.871002 269.334229,223.648575 283.924469,221.254623
M375.084930,373.629028
	C367.999176,384.151611 358.536560,392.014587 347.267303,397.578339
	C337.449890,402.425354 327.179962,406.126953 314.927979,406.819611
	C318.518982,410.343781 322.340454,410.904144 325.736023,411.477386
	C336.907654,413.363434 348.184967,414.150574 359.388397,411.598846
	C368.770325,409.461975 376.674469,405.194855 382.476746,396.976746
	C386.166107,391.751282 387.007751,385.660461 389.445435,380.091492
	C390.563446,377.537384 388.392609,376.174469 386.045898,375.654236
	C382.644897,374.900299 379.223175,374.240112 375.084930,373.629028
M274.134094,140.817184
	C274.941711,139.829514 276.497070,139.521881 276.822144,137.416885
	C269.285980,134.680649 261.362396,132.515900 254.126923,128.953537
	C248.233475,126.051910 245.255142,128.038712 242.641998,132.831329
	C240.867416,136.085968 238.557037,139.262985 239.430649,143.269531
	C240.141449,146.529312 243.496613,146.586319 245.715347,148.049820
	C248.028809,149.575760 250.026825,151.572693 252.296173,153.174759
	C254.523697,154.747299 255.582153,157.641769 258.564026,158.774673
	C262.485901,151.847137 267.119965,145.722794 274.134094,140.817184
M168.315948,219.252441
	C174.783844,224.654251 182.361984,227.240997 190.655945,227.662415
	C194.160141,227.840469 195.616684,226.428101 193.542526,222.716522
	C190.485641,217.246490 188.220001,211.395615 186.713211,205.296036
	C186.098999,202.809631 184.516708,201.774216 182.321869,202.604980
	C177.513306,204.425064 172.642563,206.185364 168.722763,209.781479
	C165.682724,212.570496 164.697617,215.411804 168.315948,219.252441
M196.656342,183.521652
	C196.059799,175.906326 199.485748,168.875946 200.303787,161.008163
	C184.968323,175.080139 188.231918,205.174438 198.438644,218.917023
	C201.259140,215.741180 203.153732,213.046906 201.193878,207.991989
	C198.320648,200.581284 196.383194,192.660843 196.656342,183.521652
M267.479156,154.972122
	C259.996063,164.929321 257.301941,176.181030 258.326416,188.475433
	C258.532990,190.954529 257.963684,193.749847 261.780029,193.830719
	C265.827484,193.916504 265.734039,191.087601 265.578644,188.332397
	C264.998993,178.057510 266.332275,168.172821 270.654205,158.689133
	C272.977844,153.590317 276.685516,149.472549 280.628021,143.821930
	C274.759460,146.916229 270.706726,149.896759 267.479156,154.972122
M359.632111,103.188484
	C358.989075,103.290901 358.188965,103.691765 357.727661,103.448944
	C353.706970,101.332573 349.762238,102.752434 347.095001,105.213432
	C344.472198,107.633400 346.293121,111.474190 347.169952,114.666092
	C347.214020,114.826530 347.261322,114.986465 347.296387,115.148949
	C348.149048,119.100693 350.444061,119.438309 353.534515,117.586777
	C355.960846,116.133148 358.287384,114.354111 361.214447,114.192619
	C365.464722,113.958122 366.732758,110.993752 366.412720,107.721535
	C366.104950,104.574928 363.721344,102.653015 359.632111,103.188484
M280.012543,204.474884
	C283.204315,208.263992 287.396088,211.182861 289.939819,215.514648
	C292.341858,219.605179 295.461792,219.364182 299.891144,217.417679
	C293.753479,211.498947 288.534088,205.444290 280.012543,204.474884
M363.859039,186.457092
	C364.680328,185.251434 365.899872,184.239655 365.785675,182.578934
	C359.037354,179.211441 358.108643,180.240158 358.673248,190.418076
	C360.679077,189.841217 361.961609,188.274597 363.859039,186.457092
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M510.704041,68.077591
	C512.314209,68.309166 513.787598,68.137077 514.148560,70.159973
	C510.888031,72.790390 507.574677,70.745247 504.242859,70.337753
	C505.904877,68.338448 508.138275,68.271378 510.704041,68.077591
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M304.417725,318.498596
	C292.485535,325.962402 279.637970,330.124268 266.459869,333.336670
	C260.238983,334.853149 254.166962,337.207428 247.652740,337.303955
	C246.108124,337.326843 244.046173,337.842102 243.638062,335.462494
	C243.257233,333.241974 245.083954,332.624634 246.653687,332.155853
	C253.445160,330.127502 260.482086,329.188446 267.330231,327.268860
	C286.765289,321.821075 305.417908,315.036987 320.167999,300.464600
	C321.462952,299.185242 322.924377,298.032562 324.419769,299.447754
	C326.031342,300.972900 325.195160,302.717712 323.817719,304.246002
	C318.413513,310.242065 311.907043,314.728210 304.417725,318.498596
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M277.485291,283.332397
	C291.209717,281.582153 303.988495,277.978333 316.389771,272.959137
	C317.450012,272.530029 318.516479,271.963165 319.622345,271.840149
	C320.888519,271.699249 322.464691,271.599854 322.865997,273.349731
	C323.166992,274.662445 322.298340,275.395813 321.237396,276.108673
	C317.227295,278.803101 312.709045,280.557861 308.228851,281.959167
	C286.590454,288.727417 264.405579,292.257172 241.681107,292.004913
	C239.404526,291.979645 236.989838,292.286865 235.178757,289.998260
	C235.919876,286.787994 238.415527,286.707031 240.956268,286.781128
	C253.129089,287.135986 265.063568,284.962311 277.485291,283.332397
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M330.015503,376.726868
	C336.786133,377.687347 339.426392,379.749695 338.591553,383.148834
	C337.847717,386.177673 333.073853,387.762360 328.233459,386.493408
	C325.597107,385.802216 322.513397,384.742523 322.656769,381.679657
	C322.839386,377.777863 326.460480,377.211273 330.015503,376.726868
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M380.138489,167.306915
	C378.276794,167.113663 376.965668,166.701645 377.184296,164.912888
	C377.384827,163.272308 378.734070,162.781387 380.123749,162.814743
	C384.572968,162.921616 389.115051,161.886826 393.428345,163.892242
	C394.311401,164.302811 395.369446,164.677551 396.301880,164.590042
	C408.968750,163.401428 421.413788,166.259048 433.952576,167.040237
	C442.960449,167.601410 451.985901,168.560501 461.051758,168.779480
	C463.103546,168.829025 464.718628,170.040756 464.547974,172.186096
	C464.384125,174.245911 462.534058,175.878891 460.692596,175.132004
	C451.647308,171.463364 441.863800,174.972458 432.727448,171.871735
	C428.160706,170.321884 423.025024,172.142090 418.346436,171.226089
	C407.167267,169.037369 395.606781,170.643494 384.551270,167.518982
	C383.306427,167.167175 381.902496,167.378479 380.138489,167.306915
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M382.186768,87.548088
	C384.205231,85.337914 385.859222,83.211952 387.933594,81.641090
	C390.050171,80.038239 392.135773,77.699615 395.432861,79.344223
	C398.982544,81.114838 402.053040,83.046814 401.434753,87.794739
	C401.136444,90.085411 401.469849,92.493431 400.932556,94.706360
	C400.531586,96.357864 399.407196,98.378853 397.065735,97.527229
	C395.232117,96.860313 394.973785,95.120110 395.510101,93.336342
	C395.748413,92.543671 396.120697,91.788933 396.329193,90.990105
	C396.840546,89.031059 397.428528,86.835258 395.132721,85.726433
	C393.018555,84.705330 390.928192,85.264732 389.367004,87.188141
	C388.642151,88.081154 387.916199,88.973404 387.179016,89.856224
	C386.302399,90.906052 385.381104,91.756638 383.801178,91.341171
	C381.854736,90.829315 381.697113,89.499603 382.186768,87.548088
z"/>
<path fill="#000000" opacity="1.000000" stroke="none"
	d="
M349.938995,83.167374
	C348.380249,85.512283 346.636597,85.724876 344.595551,84.634468
	C345.529968,78.505096 350.490265,73.152481 356.156769,72.143517
	C359.886200,71.479454 362.804718,72.893005 364.371307,76.219475
	C365.964996,79.603645 366.137482,83.256088 364.114960,86.613846
	C363.462341,87.697243 362.367065,88.662857 360.765289,87.653114
	C359.526764,86.872383 358.581207,85.964752 359.089935,84.442390
	C359.873291,82.098251 362.579193,79.311005 358.817749,77.715385
	C355.344818,76.242157 353.047943,79.230530 350.902618,81.568748
	C350.573608,81.927338 350.386536,82.416138 349.938995,83.167374
z"/>
</svg>`;

const doraemonSvg2 = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 199 253" enable-background="new 0 0 199 253" xml:space="preserve">
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M98.500000,3.000000
	C89.333336,0.859273 80.061363,1.515425 71.022202,3.124692
	C52.913143,6.348699 36.576340,13.782132 23.560272,27.059088
	C7.159919,43.788162 0.382861,64.073685 1.911314,87.505783
	C3.572036,112.965645 15.174232,133.105270 33.476055,150.025894
	C34.575169,151.042068 35.754765,151.082413 36.998669,150.983292
	C52.810234,149.723328 68.649567,149.035919 84.498672,148.463211
	C92.506279,148.173859 100.493851,147.294067 108.501640,147.055054
	C117.391624,146.789688 126.105431,147.517044 132.500000,155.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M142.500000,156.500000
	C142.450241,162.579605 144.506210,168.369858 144.793930,174.486176
	C144.996857,178.799896 144.551758,182.855362 143.984985,186.997940
	C142.975403,194.376877 146.271790,201.028473 147.299942,208.029373
	C149.182663,220.849075 148.458786,233.533188 140.014557,244.511200
	C133.886124,252.478561 121.980103,255.934372 112.013802,251.965347
	C104.896667,249.130981 102.329414,243.118317 102.048584,235.998077
	C101.812309,230.007401 102.000000,224.000000 102.000000,218.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M56.500000,39.500000
	C44.589756,43.947021 34.805183,51.286049 28.076578,62.047878
	C19.117294,76.377487 19.483929,91.795685 23.982624,107.504974
	C28.593388,123.605598 38.245834,136.625000 49.000000,149.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M31.000000,222.500000
	C33.000000,227.166672 34.388733,232.232483 37.122959,236.419708
	C43.474949,246.147278 53.446098,250.452682 64.511894,251.909668
	C78.069267,253.694702 91.442192,252.088547 104.500000,248.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M116.500000,135.500000
	C118.241463,119.245033 108.233673,110.837379 95.477486,104.545654
	C81.800537,97.799797 66.702759,98.341713 55.000000,111.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M145.500000,197.000000
	C149.333328,197.166656 153.471039,196.475418 156.928345,197.701996
	C162.056335,199.521286 165.731247,203.454605 167.542297,208.986145
	C172.854752,225.212234 165.201523,241.874069 148.504059,246.016357
	C145.808441,246.685089 143.166672,246.785431 140.500000,246.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M29.000000,199.000000
	C21.669020,197.589218 15.205219,198.467026 11.524933,206.012161
	C9.644473,209.867401 10.199899,216.427078 14.453554,220.054459
	C17.857618,222.957352 25.132874,224.867218 28.474642,222.955673
	C30.265602,221.931213 30.986692,220.736588 30.699999,217.979202
	C29.087229,202.467545 29.908405,186.945221 32.023933,171.503281
	C32.529289,167.814514 33.333332,164.166672 34.000000,160.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M152.000000,131.500000
	C152.850662,137.518417 153.361771,143.301071 158.350052,148.154129
	C164.365723,154.006744 171.849258,154.995163 178.366531,153.052307
	C185.161362,151.026718 190.458893,144.791153 191.373413,136.985168
	C192.293106,129.135101 189.829529,122.609497 182.574097,117.886169
	C172.386932,111.254257 160.159775,114.569153 153.993683,125.996597
	C153.709549,126.523148 153.333328,127.000000 153.000000,127.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M189.500000,123.000000
	C196.196548,117.195404 200.016998,110.010803 199.427704,101.004730
	C199.207687,97.642166 198.332199,94.289085 197.456284,91.011688
	C196.459824,87.283257 193.518585,86.446281 190.560791,88.108185
	C187.128693,90.036568 183.603119,90.322426 180.009033,89.919479
	C176.524292,89.528801 173.429703,90.937340 171.171829,92.717888
	C169.212723,94.262833 166.802597,94.582283 165.550507,94.286308
	C156.301712,92.100090 147.993912,97.159042 139.003479,97.273537
	C132.443985,97.357079 130.282211,101.635239 132.053146,107.985176
	C134.171478,115.580734 137.117004,122.753517 144.475586,127.041901
	C145.862671,127.850258 147.150818,127.460159 148.500000,127.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M154.500000,81.000000
	C152.922531,79.941299 151.152740,80.515533 149.500549,80.538857
	C130.167801,80.811714 110.836708,79.971497 91.495636,80.910004
	C77.307854,81.598442 63.093445,81.586807 49.502239,86.506187
	C43.155800,88.803314 36.833336,91.166672 30.500002,93.500008
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M44.000000,90.000000
	C46.597870,101.877144 53.205791,111.526695 61.007500,120.493477
	C67.410248,127.852379 74.857811,134.068909 84.037323,137.397064
	C100.476578,143.357330 115.394623,139.881241 128.465256,128.460251
	C131.204178,126.066994 133.500000,123.166664 136.000000,120.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M90.000000,17.499998
	C88.166672,15.499997 86.426773,13.403604 84.482040,11.518522
	C79.179077,6.378215 72.872787,4.970352 66.022896,7.560544
	C59.046795,10.198461 55.194778,15.675384 54.563690,23.005484
	C53.711338,32.905510 56.713188,41.303856 64.978310,47.528801
	C76.572792,56.261284 92.880096,47.522316 93.737724,36.017723
	C94.033752,32.046589 93.860123,28.396168 92.399323,25.043873
	C88.688538,16.528240 91.384392,8.651908 98.500000,4.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M150.500000,51.500000
	C151.000000,50.833332 151.464142,50.135906 152.005524,49.504734
	C157.809555,42.738106 165.066071,44.021481 168.482010,52.507240
	C172.060516,61.396748 169.820526,73.701759 159.988129,78.475563
	C152.976364,81.879906 153.427429,89.187683 151.000000,95.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M85.500000,68.500008
	C69.833336,69.500008 54.163269,70.450958 38.502510,71.536224
	C34.818882,71.791496 31.166666,72.500000 27.500000,73.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M37.500000,52.499996
	C52.833332,54.666664 68.167046,56.830624 83.498718,59.009026
	C84.175400,59.105179 84.833336,59.333336 85.500000,59.500004
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M157.000000,44.500000
	C151.081619,29.247854 140.298325,18.415094 125.969002,11.060400
	C117.705170,6.818894 108.903366,3.985894 99.500000,3.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M117.500000,41.500000
	C114.258644,37.982708 110.888000,34.884949 105.495956,35.462200
	C100.248428,36.023975 94.003036,39.855762 94.941376,49.006012
	C95.440849,53.876648 101.764229,60.500000 106.500000,60.500000
	C114.086143,60.500000 119.729172,51.667427 118.000000,42.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M179.000000,154.000000
	C175.388748,174.623886 159.609680,180.155518 146.000000,180.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M161.500000,58.500000
	C150.368240,59.033802 139.558411,61.914520 128.513641,63.124458
	C127.556953,63.229259 126.486938,63.254948 125.500000,63.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M159.500000,75.500000
	C150.080368,75.633270 140.877609,73.390808 131.507721,72.862984
	C129.875793,72.771065 128.156326,72.770119 126.500000,72.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M133.500000,160.500000
	C125.106667,157.666534 116.823730,159.018250 108.479126,160.907822
	C106.427803,161.372314 104.290459,162.942642 102.000000,161.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M123.500000,147.000000
	C128.777390,145.771469 134.155670,146.193695 139.496613,145.931091
	C142.334091,145.791595 143.745804,147.736893 143.759949,149.501923
	C143.772064,151.011230 142.914398,152.783936 140.098984,153.779831
	C131.679123,156.758148 123.038826,156.104706 114.503525,157.032425
	C111.814285,157.324707 109.173347,158.040344 106.497299,158.483719
	C105.069588,158.720230 103.122169,160.378128 102.899048,157.006683
	C102.816139,155.753967 101.125595,155.931488 100.000206,156.003189
	C86.999886,156.831497 73.999641,157.661163 61.001038,158.515762
	C60.326332,158.560135 59.666668,158.833344 59.000000,159.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M143.000000,193.500000
	C141.209229,193.748199 140.161102,192.586777 138.986816,191.514450
	C129.340652,182.705688 123.018265,182.359528 112.500000,190.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M133.500000,157.000000
	C135.234406,162.949142 135.223755,168.727936 131.484009,173.988632
	C127.465218,179.641846 121.791229,181.273270 115.011635,181.689529
	C108.580849,182.084351 102.655045,180.808685 96.463539,179.704437
	C88.394157,178.265274 81.848396,181.575546 77.441391,188.965042
	C73.170563,196.126236 73.272278,203.320892 77.632065,209.912659
	C82.293007,216.959747 89.624672,219.666855 97.990776,218.437256
	C105.277489,217.366302 109.892784,212.333664 112.347610,205.941483
	C114.743736,199.702179 114.377319,193.186707 109.998901,187.500854
	C108.839508,185.995239 107.666664,184.500000 106.500000,183.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M135.000000,100.000000
	C135.261612,112.647125 141.191620,122.069130 151.500000,129.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M151.500000,38.500000
	C142.566727,42.377480 134.553452,47.930607 126.002441,52.504570
	C124.818054,53.138107 123.666664,53.833332 122.500000,54.499996
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M85.500000,180.500000
	C78.265274,171.116486 68.393806,165.040222 58.491482,159.013992
	C56.458511,157.776794 54.135860,158.460083 52.003632,158.570267
	C46.326286,158.863617 40.668476,159.521957 34.999062,159.988617
	C32.892921,160.161942 31.668310,158.955490 31.551548,156.996933
	C31.427238,154.911789 30.937504,152.609375 33.000000,151.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M116.000000,8.000002
	C117.666664,9.833335 119.275749,11.723246 121.011032,13.489162
	C125.797272,18.359921 127.518372,24.610287 127.768013,31.009050
	C127.879906,33.876850 125.816315,37.075115 122.989464,38.984402
	C121.381096,40.070717 119.666664,40.999996 118.000000,41.999996
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M74.000000,203.500000
	C65.411163,201.416855 58.354206,205.078262 51.500000,209.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M102.500000,159.000000
	C98.670380,164.733444 102.896065,175.142395 109.998833,179.002151
	C110.948616,179.518280 112.159508,179.717285 112.500000,181.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M129.000000,31.500000
	C136.020386,32.646980 143.064133,33.733234 148.500000,39.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M44.500000,194.500000
	C50.592369,197.610443 57.129879,199.593201 63.500000,202.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M106.499992,61.000000
	C107.499992,67.166664 108.499992,73.333336 109.499992,79.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M143.000000,183.500000
	C141.969147,181.777756 140.431854,181.487762 138.501678,181.436722
	C134.168762,181.322144 129.795822,182.141815 125.500000,181.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M87.500000,30.500002
	C87.000000,29.833336 86.554092,29.116400 85.989937,28.509354
	C84.244362,26.631058 82.024170,24.615202 79.561287,25.646379
	C76.436287,26.954781 74.063072,29.518587 74.500000,33.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M111.500000,25.500000
	C111.333336,25.166666 111.242622,24.753695 110.988869,24.511667
	C104.890961,18.695419 101.348564,19.731009 99.000000,28.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M164.000000,77.500000
	C165.448303,82.883804 163.553955,88.163147 163.500000,93.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M150.500000,131.000000
	C147.333328,135.833328 144.166656,140.666656 141.000000,145.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M83.500000,158.000000
	C79.891876,161.219803 75.703331,163.830170 73.000000,168.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000"
	d="
M112.500000,148.000000
	C109.190331,150.861176 105.301445,153.040909 102.500000,156.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M154.000000,143.500000
	C150.666656,145.333328 147.333328,147.166656 144.000000,149.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M85.500000,77.500000
	C82.272354,77.513802 79.338181,78.584114 76.500000,80.000000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.000000"
	d="
M136.500000,155.000000
	C138.000183,156.907181 139.910461,158.313141 142.000000,159.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M150.000000,39.500000
	C151.666672,41.166664 153.333328,42.833332 155.000000,44.500000
"/>
<path fill="none" opacity="1.000000" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.000000"
	d="
M95.000000,32.000000
	C97.363708,32.584114 96.927422,35.657108 99.000000,36.500000
"/>
</svg>`;

const ankoHeading =
    `<ul id='` + elAnkoheading + `' class="flex items-center gap-4 md:gap-12 anko" title="Bringing anki goodness to your bunpro goodness">` +
       `<li><span class="anko-svg svg-large">` + dorayakiSvg + `</span></li>` +
       `<li><span class="anko-svg svg-large">` + doraemonSvg + `</span></li>` +
       `<li><p class="anko-heading">ANKO!&nbsp&nbsp</p></li>` +
       `<li><span class="anko-svg svg-small">` + doraemonSvg2 + `</span></li>` +
       `<li><span class="anko-svg svg-large">` + dorayakiSvg + `</span></li>` +
    `</ul>`;



const ankiSettingsButtonHtml =
    `<li>
        <button id="` + elSettingsBtn + `" title="Anko settings">
            <span class="anko-svg svg-medium justify-center items-center rounded flex text-primary-fg border-rim text-body border min-h-button-min-height px-12 py-8">
                <span class="">` + dorayakiSvg + `</span>
            </span>
        </button>
    </li>`;

const ankiSettingsModalHtml =
    `<div class="bp-h-screen fixed inset-0 z-modal" id="` + elSettingsModal + `" style="opacity: 1;">
        <button aria-label="Close menu" class="anki-settings-close absolute inset-0 z-1 h-full w-full bg-modal-bg opacity-40"></button>
        <article style="display: inline-table;" class="bp-modal-container bg-secondary-bg">
            <div class="relative z-1 flex w-full flex-grow flex-col gap-24 p-24 sm:h-full">
                <article class="grid gap-24 text-secondary-fg sm:grid-cols-2 sm:gap-x-12">
                    <section class="sm:col-span-2">
                        <h2 class="mb-8 flex items-center gap-8 font-bold text-primary-fg">
                            <span>ANKO!</span>
                            <input type="checkbox" id="` + elToggleOn + `" class="anki-settings-toggles" checked>
                            <ul class="inline-flex overflow-hidden rounded border border-primary-accent ">
                              <li class="group">
                                 <button id='` + elBtnToggleOff +`' class="border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent">Off</button>
                              </li>
                             <li class="group">
                                 <button id='` + elBtnToggleOn +`' class="border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent">On</button>
                             </li>
                        </ul>
                        </h2>
                        <div class="sm:flex sm:gap-12">
                            <ul class="grid h-fit gap-8 sm:w-1/2">
                                <!--<li class="rounded bg-primary-bg px-12 py-8 text-small sm:py-10">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center justify-center gap-6">
                                            <p>Auto Next On Unknown</p><svg viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 undefined">
                                                <path
                                                    d="m3.4 20.4 17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91Z"
                                                    fill="currentColor"></path>
                                            </svg>
                                        </div><input type="checkbox" id="` + elUnknownAutoNext + `" class="anki-settings-toggles" checked>
                                    </div>
                                </li>-->
                                <!--<li class="rounded bg-primary-bg px-12 py-8 text-small sm:py-10">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center justify-center gap-6">
                                            <p>Countdown seconds</p>
                                        </div><select id="` + elUnknownCountdown + `" class="anki-settings-toggles">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3" selected>3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </li>-->
                            </ul>
                            <ul class="grid h-fit gap-8 sm:w-1/2">
                                <!--<li class="rounded bg-primary-bg px-12 py-8 text-small sm:py-10">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center justify-center gap-6">
                                            <p>Auto Next On Known</p><svg viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 undefined">
                                                <path
                                                    d="m3.4 20.4 17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91Z"
                                                    fill="currentColor"></path>
                                            </svg>
                                        </div><input type="checkbox" id="` + elKnownAutoNext + `" class="anki-settings-toggles" checked>
                                    </div>
                                </li>-->
                                <!--<li class="rounded bg-primary-bg px-12 py-8 text-small sm:py-10">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center justify-center gap-6">
                                            <p>Countdown seconds</p>
                                        </div><select id="` + elKnownCountdown + `" class="anki-settings-toggles">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3" selected>3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </li>-->
                            </ul>
                        </div>
                    </section>
                </article>
            </div>
            <footer id="floating-portal-modal-footer" class="sticky bottom-0 left-0 right-0 z-2">
			<span class="text-center"><p class="order-2 text-detail font-bold text-secondary-fg md:order-1 md:justify-self-start">Bringing Anki goodness into Bunpro goodness</p></span>
<span class="text-center"><p class="order-2 text-detail font-bold text-secondary-fg md:order-1 md:justify-self-start pad-bt-5">๑(◕‿◕)๑ Michael Cheung 2023 V1.0 ٩(＾◡＾)۶</p></span></footer>
        </article>
    </div>
    `;


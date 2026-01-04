// ==UserScript==
// @name         HANKO! Bunpro with Hangman Style Single Text Reveals
// @namespace    michael.cheung
// @version      1.0
// @description  Configure the Bunpro UI with 'Hangman' style single character at a time answer reveals - use anki buttons or manual input for submitting answers
// @author       Michael Cheung
// @match        https://bunpro.jp/reviews*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/481976/HANKO%21%20Bunpro%20with%20Hangman%20Style%20Single%20Text%20Reveals.user.js
// @updateURL https://update.greasyfork.org/scripts/481976/HANKO%21%20Bunpro%20with%20Hangman%20Style%20Single%20Text%20Reveals.meta.js
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
let _hankoEnabled = true;
let _numCharactersRevealed = 0;
let _answerRevealed = false;
let _showAllWasClicked = false;
let _show1WasClicked = false;

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
   Display the 'Show answer' button
* ------------------------------------------------------ */
function resetAnkiQuiz(){
    const quizConsole = document.querySelector('.' + elQuizConsole);
    const showBtn = document.querySelector('#' + elShowAnswer);
    const knowBtn = document.querySelector('#' + elKnown);
    const unknownBtn = document.querySelector('#' + elUnknown);
    const ankiButtonsSection = document.querySelector('#' + elAnkiButtons);
    const nextBtn = document.querySelector('#' + elNext);

    quizConsole.style.display = "flex";
    if(_ankoEnabled){
        showBtn.style.display = 'inline-block';
        knowBtn.style.display = 'none';
        unknownBtn.style.display = 'none';
        ankiButtonsSection.style.opacity = '1';
        nextBtn.style.display = 'none';
    }
    enableButtons();
	_showAllWasClicked = false;
	_show1WasClicked = false;
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
    const show1Answer = document.querySelector("#" + elShow1Answer);

    if(_ankoEnabled){
        showBtn.style.display = 'none';
        knowBtn.style.display = 'inline-block';
        knowBtn.style.width = '49% !important';
        unknownBtn.querySelector('span.text-right').text = "Hard";
        unknownBtn.style.display = 'inline-block';
        unknownBtn.style.width = '49% !important';
        ankiButtonsSection.style.opacity = '1';

        show1Answer.style.display = 'none';
        _numCharactersRevealed = 0;
        _answerRevealed = false;

        quizConsole.style.display = "flex";
        enableButtons();
    }
}

function setHankoButton(){
	if(_hankoEnabled){
		const show1Answer = document.querySelector('#' + elShow1Answer);
		show1Answer.style.display = 'inline-block';
		show1Answer.style.visbility = 'visible';
		show1Answer.style.opacity = 1.0;
		show1Answer.enabled = true;
		_show1WasClicked = false;
	}
}

/* -------------------------------------------------------
   Show the 'Next' buttons and hide 'Easy/Hard'
* ------------------------------------------------------ */
function showNextButton(){
    const quizConsole = document.querySelector('.' + elQuizConsole);
    const showBtn = document.querySelector('#' + elShowAnswer);
    const show1Btn = document.querySelector('#' + elShow1Answer);
    const knowBtn = document.querySelector('#' + elKnown);
    const unknownBtn = document.querySelector('#' + elUnknown);
    const nextBtn = document.querySelector('#' + elNext);

    showBtn.style.display = 'none';
    show1Btn.style.display = 'none';
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
		if(_ankoEnabled){
			ankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
			ankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
			toggleAnko(false);
		}else{
			ankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
			ankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
			toggleAnko(true);
		}
    });
    ankoToggleOn.addEventListener('click', function () {
		if(!_ankoEnabled){
			ankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
			ankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
			toggleAnko(true);
		}else{
			ankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
			ankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
			toggleAnko(true);
		}
    });

    const hankoToggleOff = document.querySelector('#' + elBtnHankoToggleOff);
    const hankoToggleOn = document.querySelector('#' + elBtnHankoToggleOn);
    hankoToggleOff.addEventListener('click', function () {
		if(_hankoEnabled){
			hankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
			hankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
			toggleHanko(false);
		}else{
			hankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
			hankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
			toggleHanko(true);
		}
    });
    hankoToggleOn.addEventListener('click', function () {
		if(!_hankoEnabled){
			hankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
			hankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
			toggleHanko(true);
		}else{
			hankoToggleOff.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent';
			hankoToggleOn.classList = 'border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent';
			toggleHanko(false);
		}
    });

    /* --------------------------------------------------------
        Disable the answer input when submit is clicked
     * -------------------------------------------------------*/
	const submitButton = document.querySelector('.' + elSubmitButton);
    submitButton.addEventListener('click', function () {
		if(_ankoEnabled || _hankoEnabled){
			answerBox.disabled = true;
			/* --------------------------------------------------------
				Hide the toast element for notifications
			* -------------------------------------------------------*/
			setTimeout(function () {
				const toastElement = document.querySelector(".z-tooltip");
				if (toastElement) {
					toastElement.style.visibility = "hidden";
				}
			}, 10);
		}
    });
    submitButton.style.visibility = "hidden";

    /* --------------------------------------------------------
        Set up ank'Hanko!' heading
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
		_showAllWasClicked = true;

        if(_ankoEnabled) {
			if(_show1WasClicked){
				/* ----------------------------------------------------------
					Set the answer  as blank in the react generated input
				* -------------------------------------------------------- */
    			const manualInput = document.querySelector("#" + elManualInput);
				const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
					window.HTMLInputElement.prototype,
					"value"
				).set;
				nativeInputValueSetter.call(manualInput, "");
				const inputEvent = new Event("input", { bubbles: true });
				manualInput.dispatchEvent(inputEvent);
			}
          	displayAnswer();
		}
    }, false);

    /* --------------------------------------------------------
        The 'Show 1 answer' button
     * -------------------------------------------------------*/
    const show1Answer = document.querySelector("#" + elShow1Answer);
    const manualInput = document.querySelector("#" + elManualInput);

    show1Answer.addEventListener('click', function () {
		_show1WasClicked = true;

        if(_hankoEnabled) {
          	display1Answer(_numCharactersRevealed);
            manualInput.focus();
		}
    }, false);

    /* --------------------------------------------------------
        When a new question appears, reset the anki buttons
    * -------------------------------------------------------*/
    const attempts = document.querySelector('[title="Correct question attempts over total attempts"]');
    const remaining = attempts.querySelector('p');
    const observer = new MutationObserver(() => {
        if(_ankoEnabled || _hankoEnabled) {
			resetAnkiQuiz();
			setHankoButton()
		}
    });
    observer.observe(remaining, { subtree: true, childList: true, characterData: true });

    resetAnkiQuiz();
	setHankoButton();
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
		submitButton.style.visibility = "hidden";
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

function toggleHanko(enabled){

    const show1Answer = document.querySelector("#" + elShow1Answer);

    if(enabled){
        _hankoEnabled = true;
        show1Answer.style.display = 'inline-block';
    }else{
        _hankoEnabled = false;
        show1Answer.style.display = 'none';
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
    const answerDisplay = document.querySelector("." + elAnswerDisplay);
    const answerDisplayBtn = answerDisplay.querySelector('button');

    let answer = getAnswer();

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
    }, 1000);
    setTimeout(function () {
        quizConsole.style.display = "flex";
        enableButtons();
    }, 2000);
}

function display1Answer() {

    //Disable the button for a second
    const show1Answer = document.querySelector("#" + elShow1Answer);
    show1Answer.disabled = true;
    show1Answer.style.opacity = 0.2;
    setTimeout(function () {
        show1Answer.disabled = false;
        show1Answer.style.opacity = 1.0;
    }, 500);

    /* --------------------------------------------------------
        Get the answer
    * -------------------------------------------------------*/
    const answer = getAnswer();

    /* --------------------------------------------------------
       Display 1 character of the answer
    * -------------------------------------------------------*/
    const answerDisplay = document.querySelector("." + elAnswerDisplay);
    const answerDisplayBtn = answerDisplay.querySelector('button');

    let partialAnswer = "";
    let partialAnswerPlusTrailing = "";
    for(var i in answer){

        if(i <= _numCharactersRevealed){
            partialAnswer += answer[i];
            partialAnswerPlusTrailing += answer[i];
        }
        else{
            partialAnswerPlusTrailing += "_";
        }
    }

    _numCharactersRevealed++;

    if(_numCharactersRevealed >= answer.length){
        setAnswerHasBeenRevealed();
    }
    answerDisplayBtn.innerHTML = '<span class=\"inline-block   text-correct\">' + partialAnswerPlusTrailing + '</span>';

    /* --------------------------------------------------------
       Hide the toast element for notifications
    * -------------------------------------------------------*/
    setTimeout(function () {
        const toastElement = document.querySelector(".z-tooltip");
        if (toastElement) {
            toastElement.style.visibility = "hidden";
        }
    }, 10);

    const manualInput = document.querySelector("#" + elManualInput);
    manualInput.value = partialAnswer;
    manualInput.focus();

    	/* ----------------------------------------------------------
		   Set the answer in the react generated input
		* -------------------------------------------------------- */
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
        ).set;
        nativeInputValueSetter.call(manualInput, partialAnswer);
        const inputEvent = new Event("input", { bubbles: true });
        manualInput.dispatchEvent(inputEvent);
}

function setAnswerHasBeenRevealed(){
    _answerRevealed = true;
    _numCharactersRevealed = 0;
    const show1Answer = document.querySelector("#" + elShow1Answer);
    show1Answer.disabled = true;
    show1Answer.style.opacity = 0.2;
    show1Answer.style.display = 'none';

    /* --------------------------------------------------------
       Hide the answer box area then re-appear
    * -------------------------------------------------------*/
    const quizConsole = document.querySelector('.' + elQuizConsole);
    quizConsole.style.display = "none";

    if(_ankoEnabled){
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
    if(_hankoEnabled){
        quizConsole.style.display = "flex";
        setHankoButton();
        disableButtons();
    }
}

function setupShow1Answer(){
    _answerRevealed = false;
    const show1Answer = document.querySelector("#" + elShow1Answer);
    show1Answer.disabled = false;
    show1Answer.style.opacity = 1.0;
    show1Answer.style.display = 'inline-block';
}

function getAnswer(){
    /* --------------------------------------------------------
        Get the quiz answers and sanitise them
    * -------------------------------------------------------*/
    const quizElement = document.querySelector("#" + elQuizElement);
    const answers = quizElement.getAttribute('data-meta-answers-array');

    let answer = answers.split(',')[0];
    answer = answer.replace('"', '');
    answer = answer.replace('[', '');
    answer = answer.replace(']', '');
    answer = answer.replace('"', '');

    return answer;
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
		Get the quiz answer
	* -------------------------------------------------------*/

    let answer = getAnswer();

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
        if(_showAllWasClicked){
			submitButton.click();
		}
        ankiKnow.style.fontSize = '1.0rem';
    }, 1000);
}

function submitUnknown(){
    /* --------------------------------------------------------
       Hide the answer box area then re-appear
     * -------------------------------------------------------*/
	const submitButton = document.querySelector('.' + elSubmitButton);
    setTimeout(function () {
        showNextButton();
    }, 10);

	if(_showAllWasClicked){
		submitButton.click();
	}else{
		/* ----------------------------------------------------------
			Set the blank answer in the react generated input
		* -------------------------------------------------------- */
		const manualInput = document.querySelector("#" + elManualInput);
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			"value"
		).set;
		nativeInputValueSetter.call(manualInput, "る");
		const inputEvent = new Event("input", { bubbles: true });
		manualInput.dispatchEvent(inputEvent);
	}

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
    #anki-settings-button{
       width: 57px;
    }
    #anki-settings-toggle {
       visibility: hidden
    }
    `;

const elAnkoheading = 'anko-heading';
const elToggleOn = 'anki-settings-toggle';
const elBtnToggleOff = 'anki-settings-toggle-off';
const elBtnToggleOn= 'anki-settings-toggle-on';
const elBtnHankoToggleOff = 'anki-settings-hanko-toggle-off';
const elBtnHankoToggleOn= 'anki-settings-hanko-toggle-on';
const elKnownAutoNext = 'anki-settings-known-auto-next';
const elUnknownCountdown = 'anki-settings-unknown-countdown';
const elUnknownAutoNext = 'anki-settings-unknown-auto-next';
const elKnownCountdown = 'anki-settings-known-countdown';
const elUnknown = 'anki-dontknow';
const elKnown = 'anki-know';
const elShowAnswer = 'anki-show-1';
const elShow1Answer = 'anki-show';
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

         <button id="`+ elShowAnswer +`" class="w-1/3" title="Reveal the full answer"><span class="justify-center items-center rounded flex text-primary-contrast bg-secondary-accent border-secondary-accent shadow text-body border min-h-button-min-height px-12 py-8">
         <span class="text-right">Show</span>
         <span class="ml-6">
             <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="undefined"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3Z" fill="currentColor"></path></svg>
         </span>
         </span>
         </button>

         <button id="`+ elShow1Answer +`" class="w-1/3" title="Reveal one character in the answer"><span class="justify-center items-center rounded flex text-primary-contrast bg-secondary-accent border-secondary-accent shadow text-body border min-h-button-min-height px-12 py-8">
         <span class="text-right">Peek</span>
         <span class="ml-6">
             <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="undefined"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" fill="currentColor"></path></svg>
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

const hankoSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 199 253" enable-background="new 0 0 199 253" xml:space="preserve">
<path fill="#FFFFFF" opacity="1.000000" stroke="none"
	d="
M132.000000,1.000000
	C169.310272,1.000000 206.620560,1.000000 243.965424,1.000000
	C243.965424,81.926918 243.965424,162.853851 243.965424,243.890396
	C163.123215,243.890396 82.246246,243.890396 1.000000,243.890396
	C1.000000,207.313263 1.000000,170.625290 1.390456,133.632492
	C2.483488,147.108490 6.892812,160.045609 12.390962,172.374069
	C17.415604,183.640793 24.278778,194.093536 33.015533,203.098114
	C41.472267,211.814072 50.436390,219.967545 61.270248,225.566864
	C68.657326,229.384766 76.415466,232.551346 84.187828,235.540817
	C94.701813,239.584778 105.713326,241.576035 116.970139,241.981079
	C131.796585,242.514542 146.028351,239.838364 160.166962,235.204453
	C174.069260,230.648041 186.599182,223.836868 197.617661,214.597504
	C206.392639,207.239365 214.285370,198.963547 220.797836,189.135010
	C228.038574,178.207367 233.267761,166.717346 237.042404,154.332062
	C241.733459,138.939850 243.228333,123.382057 241.092133,107.349968
	C239.326996,94.102669 235.573471,81.492447 229.928268,69.520721
	C226.644363,62.556580 222.631058,55.767616 217.941833,49.672321
	C209.820923,39.116310 200.442810,29.913208 189.183182,22.283550
	C177.204163,14.166443 164.487778,8.541318 150.662613,5.035312
	C144.497131,3.471769 138.224182,2.332066 132.000000,1.000000
z"/>
<path fill="#FFFFFF" opacity="1.000000" stroke="none"
	d="
M1.000000,110.000000
	C1.000000,73.739388 1.000000,37.478775 1.000000,1.000000
	C37.353935,1.000000 73.708313,1.000000 110.363663,1.393132
	C101.386864,3.848895 92.051750,5.685968 82.844604,8.026476
	C68.667786,11.630305 56.366756,19.157845 45.370239,28.410231
	C36.615982,35.776001 28.715887,44.023472 22.219677,53.851364
	C14.908150,64.912720 9.332789,76.428024 5.986813,89.120018
	C4.163172,96.037476 2.652062,103.037315 1.000000,110.000000
z"/>
<path fill="#FF0000" opacity="1.000000" stroke="none"
	d="
M1.000000,110.468620
	C2.652062,103.037315 4.163172,96.037476 5.986813,89.120018
	C9.332789,76.428024 14.908150,64.912720 22.219677,53.851364
	C28.715887,44.023472 36.615982,35.776001 45.370239,28.410231
	C56.366756,19.157845 68.667786,11.630305 82.844604,8.026476
	C92.051750,5.685968 101.386864,3.848895 110.832321,1.393132
	C117.687645,1.000000 124.375282,1.000000 131.531464,1.000000
	C138.224182,2.332066 144.497131,3.471769 150.662613,5.035312
	C164.487778,8.541318 177.204163,14.166443 189.183182,22.283550
	C200.442810,29.913208 209.820923,39.116310 217.941833,49.672321
	C222.631058,55.767616 226.644363,62.556580 229.928268,69.520721
	C235.573471,81.492447 239.326996,94.102669 241.092133,107.349968
	C243.228333,123.382057 241.733459,138.939850 237.042404,154.332062
	C233.267761,166.717346 228.038574,178.207367 220.797836,189.135010
	C214.285370,198.963547 206.392639,207.239365 197.617661,214.597504
	C186.599182,223.836868 174.069260,230.648041 160.166962,235.204453
	C146.028351,239.838364 131.796585,242.514542 116.970139,241.981079
	C105.713326,241.576035 94.701813,239.584778 84.187828,235.540817
	C76.415466,232.551346 68.657326,229.384766 61.270248,225.566864
	C50.436390,219.967545 41.472267,211.814072 33.015533,203.098114
	C24.278778,194.093536 17.415604,183.640793 12.390962,172.374069
	C6.892812,160.045609 2.483488,147.108490 1.390456,133.163834
	C1.000000,125.645744 1.000000,118.291496 1.000000,110.468620
M202.973114,206.518112
	C203.820328,205.627487 204.712479,204.775070 205.507294,203.839935
	C210.024445,198.525406 215.064987,193.554474 218.900436,187.783997
	C225.778061,177.436462 231.018784,166.243713 234.483551,154.182770
	C239.321777,137.340775 240.536331,120.219711 237.782867,103.100021
	C235.346512,87.951874 230.626038,73.260994 221.953018,60.331272
	C217.634567,53.893318 212.840927,47.666946 207.535431,42.028816
	C202.371475,36.541115 196.259872,31.948772 190.599457,26.923769
	C181.171600,18.554234 170.053268,13.322697 158.056656,10.058055
	C150.124252,7.899409 142.014160,5.728247 133.873093,5.167446
	C123.298615,4.439018 112.497856,4.405875 102.013992,5.765732
	C93.523758,6.866996 85.341911,10.417202 77.052094,12.974557
	C65.837837,16.434074 55.985146,22.551998 47.452015,30.318308
	C39.997929,37.102543 33.703117,45.150509 26.783686,52.534790
	C18.562664,61.308102 13.849842,72.144676 10.220206,83.183296
	C4.677186,100.041000 2.430925,117.415428 4.849511,135.349228
	C6.640333,148.628174 9.660890,161.501205 15.924081,173.219147
	C20.876432,182.484589 26.552536,191.671860 33.500668,199.475021
	C40.438564,207.266708 48.954800,213.866638 57.539516,219.908600
	C64.039909,224.483597 71.581032,227.715973 78.934761,230.911224
	C90.634995,235.995102 103.056847,238.708862 115.773743,238.852402
	C124.932388,238.955765 134.226929,238.383575 143.250427,236.863541
	C165.955002,233.038895 185.645432,222.813385 202.973114,206.518112
z"/>
<path fill="#FFFEFE" opacity="1.000000" stroke="none"
	d="
M202.673599,206.735413
	C185.645432,222.813385 165.955002,233.038895 143.250427,236.863541
	C134.226929,238.383575 124.932388,238.955765 115.773743,238.852402
	C103.056847,238.708862 90.634995,235.995102 78.934761,230.911224
	C71.581032,227.715973 64.039909,224.483597 57.539516,219.908600
	C48.954800,213.866638 40.438564,207.266708 33.500668,199.475021
	C26.552536,191.671860 20.876432,182.484589 15.924081,173.219147
	C9.660890,161.501205 6.640333,148.628174 4.849511,135.349228
	C2.430925,117.415428 4.677186,100.041000 10.220206,83.183296
	C13.849842,72.144676 18.562664,61.308102 26.783686,52.534790
	C33.703117,45.150509 39.997929,37.102543 47.452015,30.318308
	C55.985146,22.551998 65.837837,16.434074 77.052094,12.974557
	C85.341911,10.417202 93.523758,6.866996 102.013992,5.765732
	C112.497856,4.405875 123.298615,4.439018 133.873093,5.167446
	C142.014160,5.728247 150.124252,7.899409 158.056656,10.058055
	C170.053268,13.322697 181.171600,18.554234 190.599457,26.923769
	C196.259872,31.948772 202.371475,36.541115 207.535431,42.028816
	C212.840927,47.666946 217.634567,53.893318 221.953018,60.331272
	C230.626038,73.260994 235.346512,87.951874 237.782867,103.100021
	C240.536331,120.219711 239.321777,137.340775 234.483551,154.182770
	C231.018784,166.243713 225.778061,177.436462 218.900436,187.783997
	C215.064987,193.554474 210.024445,198.525406 205.507294,203.839935
	C204.712479,204.775070 203.820328,205.627487 202.673599,206.735413
M116.071480,155.124207
	C116.623085,155.625687 117.646469,156.119431 117.654823,156.629807
	C117.762802,163.226608 117.726295,169.825775 117.726295,176.615311
	C109.003357,177.072861 100.879730,177.625961 92.746712,177.894394
	C81.838577,178.254395 80.896927,177.252075 79.901230,166.431885
	C79.694778,164.188416 78.809738,162.007401 78.237442,159.797592
	C77.670517,159.887009 77.103584,159.976410 76.536659,160.065826
	C73.210617,164.898163 74.376595,170.193604 75.885788,175.356888
	C77.385277,180.487000 81.397461,182.764755 86.471306,182.919540
	C94.783607,183.173141 103.104721,183.141113 111.422203,183.219971
	C113.502563,183.239700 115.583275,183.222931 117.645920,183.222931
	C117.897781,202.485382 110.466621,213.617401 93.061661,219.965332
	C88.097267,221.775955 82.782661,222.607559 77.700142,224.127213
	C76.532791,224.476242 75.660271,225.811356 74.652077,226.692673
	C75.711571,227.343262 76.702415,228.320938 77.848000,228.561386
	C79.268753,228.859573 80.936897,228.899338 82.291534,228.440552
	C90.112625,225.791794 98.218788,223.661453 105.567146,220.020844
	C115.056725,215.319397 120.388832,206.871902 122.096596,196.377579
	C122.806503,192.015152 123.087135,187.582870 123.473511,184.009750
	C133.665222,184.009750 143.486588,184.019485 153.307938,184.005600
	C158.175797,183.998734 162.315643,182.329910 164.291885,177.669449
	C166.666916,172.068649 167.704514,166.237411 164.567932,160.470032
	C164.412247,160.183792 163.708313,160.195724 162.237045,159.779541
	C161.594284,163.800079 160.954468,167.595398 160.388809,171.401733
	C159.876358,174.849884 158.388123,177.859299 154.626663,177.841431
	C144.199631,177.791931 133.774658,177.306274 123.380630,176.993942
	C123.380630,169.422684 123.380630,162.501556 123.380630,155.475586
	C129.263245,155.475586 134.878479,155.415588 140.491730,155.495880
	C144.486069,155.553024 148.482040,155.996078 152.469391,155.908386
	C156.944214,155.809937 160.811584,153.902954 162.424011,149.599747
	C166.278824,139.311996 165.723648,127.799355 149.693741,127.146477
	C148.861328,127.112572 148.027847,127.087746 147.194855,127.087524
	C129.362167,127.082855 111.529305,127.041496 93.696991,127.123146
	C90.888237,127.136002 87.841934,127.133904 85.339264,128.178268
	C82.596230,129.322937 79.462280,131.154236 78.051865,133.586853
	C72.065750,143.911438 79.381958,156.171814 91.173592,155.972076
	C99.163910,155.836716 107.148880,155.386597 116.071480,155.124207
M97.078262,26.515396
	C97.078262,36.928463 97.078262,47.341530 97.078262,57.642498
	C89.861488,58.752346 82.642426,56.842014 75.873581,62.167023
	C83.198715,66.299347 90.400185,62.594444 96.756271,64.450500
	C96.756271,68.558617 96.756271,72.465744 96.756271,76.429123
	C89.102959,77.713882 81.006981,75.683113 73.349686,81.404518
	C81.780777,84.992546 89.319038,81.589951 97.078262,82.354286
	C97.078262,85.101448 97.062164,87.733925 97.081238,90.366150
	C97.141563,98.687904 97.110687,107.013008 97.386055,115.327850
	C97.432014,116.715591 98.831223,118.058517 99.605125,119.422150
	C100.540443,118.061073 102.203484,116.743034 102.286964,115.331566
	C102.679474,108.695435 102.665535,102.033958 102.742325,95.380905
	C102.793106,90.981400 102.751938,86.580826 102.751938,82.270088
	C110.879784,81.790726 118.352425,84.866119 126.992661,81.328087
	C118.801727,75.731926 110.681374,77.681656 103.012695,76.385506
	C103.012695,72.347450 103.012695,68.434311 103.012695,64.244133
	C108.232056,64.244133 113.353889,64.404114 118.454979,64.149109
	C120.037315,64.070007 121.563332,62.864399 123.115135,62.174534
	C121.661247,61.119755 120.314400,59.383373 118.733849,59.135159
	C113.529991,58.317932 108.241493,58.039707 102.750641,57.532780
	C102.750641,45.089100 102.782021,32.786751 102.722794,20.484840
	C102.711639,18.169313 102.506393,15.822079 102.053192,13.557010
	C101.865746,12.620186 100.789673,11.861158 100.117752,11.021263
	C99.288116,11.877752 97.840256,12.665719 97.736412,13.602654
	C97.298660,17.552174 97.261787,21.546124 97.078262,26.515396
M142.111938,13.255095
	C141.463120,13.404799 140.813797,13.552383 140.165558,13.704525
	C130.870560,15.886045 125.920517,27.375008 131.213242,35.358982
	C132.440765,37.210686 135.438812,38.533215 137.785873,38.837837
	C140.834778,39.233540 144.040436,38.231529 147.190842,38.071732
	C155.621048,37.644115 156.970871,38.733639 156.804993,47.140877
	C156.378372,68.764671 155.679398,90.383003 155.182266,112.005653
	C155.130920,114.238640 155.705017,116.486015 155.988892,118.726715
	C156.780182,118.820244 157.571457,118.913773 158.362732,119.007301
	C159.210983,116.402664 160.694397,113.824699 160.805069,111.189087
	C161.559067,93.231850 162.153763,75.265022 162.506195,57.295528
	C162.616577,51.667000 162.230591,45.954853 161.331650,40.400784
	C160.396332,34.622097 157.762192,32.833080 151.955780,33.024456
	C148.137360,33.150299 144.299042,34.064758 140.532791,33.782753
	C138.708389,33.646152 136.071289,31.934038 135.454361,30.308268
	C133.110443,24.131475 137.195770,18.326956 143.790054,18.102236
	C148.275146,17.949394 152.778824,18.409847 157.269989,18.336943
	C159.202774,18.305567 161.124924,17.618183 163.051895,17.228830
	C163.016220,16.726892 162.980530,16.224955 162.944855,15.723017
	C156.785660,11.792339 149.771500,13.216520 142.111938,13.255095
M134.001328,63.499569
	C133.352371,79.106209 132.609879,94.710136 132.158157,110.322487
	C132.092514,112.591049 133.417938,114.899864 134.099686,117.190056
	C135.255020,115.010696 136.972321,112.944588 137.439484,110.626534
	C138.221695,106.745270 138.404633,102.707642 138.492294,98.728172
	C138.861893,81.950409 139.173126,65.170227 139.275848,48.389530
	C139.285461,46.818485 137.681381,45.237564 136.826538,43.661228
	C135.935944,45.287849 134.420273,46.860706 134.274841,48.551426
	C133.877136,53.175083 134.056610,57.848392 134.001328,63.499569
M83.214218,20.095497
	C81.932274,30.349716 80.650330,40.603935 79.342499,51.065228
	C80.322510,50.877014 80.890274,50.917904 81.254837,50.665394
	C81.924423,50.201607 82.646088,49.666397 83.048210,48.985153
	C88.701714,39.407627 89.962776,29.091244 87.911224,18.305674
	C87.742104,17.416590 86.496254,16.732311 85.750687,15.952875
	C84.947128,17.049553 84.143562,18.146231 83.214218,20.095497
M117.996315,50.572380
	C122.456047,50.752331 120.392967,47.949650 120.072723,45.985474
	C118.698906,37.559330 117.342384,29.129944 115.882141,20.718655
	C115.573624,18.941534 114.855240,17.235567 114.225677,15.168357
	C107.713699,20.734285 109.959114,40.834949 117.996315,50.572380
z"/>
<path fill="#FF0808" opacity="1.000000" stroke="none"
	d="
M115.603867,155.100723
	C107.148880,155.386597 99.163910,155.836716 91.173592,155.972076
	C79.381958,156.171814 72.065750,143.911438 78.051865,133.586853
	C79.462280,131.154236 82.596230,129.322937 85.339264,128.178268
	C87.841934,127.133904 90.888237,127.136002 93.696991,127.123146
	C111.529305,127.041496 129.362167,127.082855 147.194855,127.087524
	C148.027847,127.087746 148.861328,127.112572 149.693741,127.146477
	C165.723648,127.799355 166.278824,139.311996 162.424011,149.599747
	C160.811584,153.902954 156.944214,155.809937 152.469391,155.908386
	C148.482040,155.996078 144.486069,155.553024 140.491730,155.495880
	C134.878479,155.415588 129.263245,155.475586 123.380630,155.475586
	C123.380630,162.501556 123.380630,169.422684 123.380630,176.993942
	C133.774658,177.306274 144.199631,177.791931 154.626663,177.841431
	C158.388123,177.859299 159.876358,174.849884 160.388809,171.401733
	C160.954468,167.595398 161.594284,163.800079 162.237045,159.779541
	C163.708313,160.195724 164.412247,160.183792 164.567932,160.470032
	C167.704514,166.237411 166.666916,172.068649 164.291885,177.669449
	C162.315643,182.329910 158.175797,183.998734 153.307938,184.005600
	C143.486588,184.019485 133.665222,184.009750 123.473511,184.009750
	C123.087135,187.582870 122.806503,192.015152 122.096596,196.377579
	C120.388832,206.871902 115.056725,215.319397 105.567146,220.020844
	C98.218788,223.661453 90.112625,225.791794 82.291534,228.440552
	C80.936897,228.899338 79.268753,228.859573 77.848000,228.561386
	C76.702415,228.320938 75.711571,227.343262 74.652069,226.692657
	C75.660271,225.811356 76.532791,224.476242 77.700142,224.127213
	C82.782661,222.607559 88.097267,221.775955 93.061661,219.965332
	C110.466621,213.617401 117.897781,202.485382 117.645920,183.222931
	C115.583275,183.222931 113.502563,183.239700 111.422203,183.219971
	C103.104721,183.141113 94.783607,183.173141 86.471306,182.919540
	C81.397461,182.764755 77.385277,180.487000 75.885788,175.356888
	C74.376595,170.193604 73.210617,164.898163 76.536659,160.065826
	C77.103584,159.976410 77.670517,159.887009 78.237442,159.797592
	C78.809738,162.007401 79.694778,164.188416 79.901230,166.431885
	C80.896927,177.252075 81.838577,178.254395 92.746712,177.894394
	C100.879730,177.625961 109.003357,177.072861 117.726295,176.615311
	C117.726295,169.825775 117.762802,163.226608 117.654823,156.629807
	C117.646469,156.119431 116.623085,155.625687 115.603867,155.100723
M120.500000,132.009888
	C110.192261,132.119583 99.873116,131.974152 89.581062,132.434464
	C83.380447,132.711792 81.550995,135.541245 82.001770,142.198975
	C82.444328,148.735367 84.815712,151.138046 90.855461,150.939423
	C97.327545,150.726562 103.797508,150.111420 110.264748,150.159729
	C123.706543,150.260147 137.145370,150.789291 150.586899,150.860611
	C152.647110,150.871521 156.088730,149.826996 156.518463,148.501389
	C157.736359,144.744324 158.557358,140.461090 157.971451,136.623764
	C157.330368,132.425293 152.899933,132.342834 149.433807,132.264404
	C140.125397,132.053772 130.811630,132.078629 120.500000,132.009888
z"/>
<path fill="#FF0F0F" opacity="1.000000" stroke="none"
	d="
M97.078262,26.019608
	C97.261787,21.546124 97.298660,17.552174 97.736412,13.602654
	C97.840256,12.665719 99.288116,11.877752 100.117752,11.021267
	C100.789673,11.861158 101.865746,12.620186 102.053192,13.557010
	C102.506393,15.822079 102.711639,18.169313 102.722794,20.484840
	C102.782021,32.786751 102.750641,45.089100 102.750641,57.532780
	C108.241493,58.039707 113.529991,58.317932 118.733849,59.135159
	C120.314400,59.383373 121.661247,61.119755 123.115135,62.174530
	C121.563332,62.864399 120.037315,64.070007 118.454979,64.149109
	C113.353889,64.404114 108.232056,64.244133 103.012695,64.244133
	C103.012695,68.434311 103.012695,72.347450 103.012695,76.385506
	C110.681374,77.681656 118.801727,75.731926 126.992661,81.328087
	C118.352425,84.866119 110.879784,81.790726 102.751938,82.270088
	C102.751938,86.580826 102.793106,90.981400 102.742325,95.380905
	C102.665535,102.033958 102.679474,108.695435 102.286964,115.331566
	C102.203484,116.743034 100.540443,118.061073 99.605125,119.422150
	C98.831223,118.058517 97.432014,116.715591 97.386055,115.327850
	C97.110687,107.013008 97.141563,98.687904 97.081238,90.366150
	C97.062164,87.733925 97.078262,85.101448 97.078262,82.354286
	C89.319038,81.589951 81.780777,84.992546 73.349686,81.404518
	C81.006981,75.683113 89.102959,77.713882 96.756271,76.429123
	C96.756271,72.465744 96.756271,68.558617 96.756271,64.450500
	C90.400185,62.594444 83.198715,66.299347 75.873581,62.167023
	C82.642426,56.842014 89.861488,58.752346 97.078262,57.642498
	C97.078262,47.341530 97.078262,36.928463 97.078262,26.019608
z"/>
<path fill="#FF0D0D" opacity="1.000000" stroke="none"
	d="
M142.553741,13.201854
	C149.771500,13.216520 156.785660,11.792339 162.944855,15.723017
	C162.980530,16.224955 163.016220,16.726892 163.051895,17.228830
	C161.124924,17.618183 159.202774,18.305567 157.269989,18.336943
	C152.778824,18.409847 148.275146,17.949394 143.790054,18.102236
	C137.195770,18.326956 133.110443,24.131475 135.454361,30.308268
	C136.071289,31.934038 138.708389,33.646152 140.532791,33.782753
	C144.299042,34.064758 148.137360,33.150299 151.955780,33.024456
	C157.762192,32.833080 160.396332,34.622097 161.331650,40.400784
	C162.230591,45.954853 162.616577,51.667000 162.506195,57.295528
	C162.153763,75.265022 161.559067,93.231850 160.805069,111.189087
	C160.694397,113.824699 159.210983,116.402664 158.362732,119.007301
	C157.571457,118.913773 156.780182,118.820244 155.988892,118.726715
	C155.705017,116.486015 155.130920,114.238640 155.182266,112.005653
	C155.679398,90.383003 156.378372,68.764671 156.804993,47.140877
	C156.970871,38.733639 155.621048,37.644115 147.190842,38.071732
	C144.040436,38.231529 140.834778,39.233540 137.785873,38.837837
	C135.438812,38.533215 132.440765,37.210686 131.213242,35.358982
	C125.920517,27.375008 130.870560,15.886045 140.165558,13.704525
	C140.813797,13.552383 141.463120,13.404799 142.553741,13.201854
z"/>
<path fill="#FF0D0D" opacity="1.000000" stroke="none"
	d="
M134.004425,63.000801
	C134.056610,57.848392 133.877136,53.175083 134.274841,48.551426
	C134.420273,46.860706 135.935944,45.287849 136.826538,43.661228
	C137.681381,45.237564 139.285461,46.818485 139.275848,48.389530
	C139.173126,65.170227 138.861893,81.950409 138.492294,98.728172
	C138.404633,102.707642 138.221695,106.745270 137.439484,110.626534
	C136.972321,112.944588 135.255020,115.010696 134.099670,117.190048
	C133.417938,114.899864 132.092514,112.591049 132.158157,110.322487
	C132.609879,94.710136 133.352371,79.106209 134.004425,63.000801
z"/>
<path fill="#FF0F0F" opacity="1.000000" stroke="none"
	d="
M83.277107,19.669201
	C84.143562,18.146231 84.947128,17.049553 85.750687,15.952873
	C86.496254,16.732311 87.742104,17.416590 87.911224,18.305674
	C89.962776,29.091244 88.701714,39.407627 83.048210,48.985153
	C82.646088,49.666397 81.924423,50.201607 81.254837,50.665394
	C80.890274,50.917904 80.322510,50.877014 79.342499,51.065228
	C80.650330,40.603935 81.932274,30.349716 83.277107,19.669201
z"/>
<path fill="#FF0F0F" opacity="1.000000" stroke="none"
	d="
M117.695450,50.359894
	C109.959114,40.834949 107.713699,20.734285 114.225677,15.168357
	C114.855240,17.235567 115.573624,18.941534 115.882141,20.718655
	C117.342384,29.129944 118.698906,37.559330 120.072723,45.985474
	C120.392967,47.949650 122.456047,50.752331 117.695450,50.359894
z"/>
<path fill="#FFFBFB" opacity="1.000000" stroke="none"
	d="
M121.000000,132.009918
	C130.811630,132.078629 140.125397,132.053772 149.433807,132.264404
	C152.899933,132.342834 157.330368,132.425293 157.971451,136.623764
	C158.557358,140.461090 157.736359,144.744324 156.518463,148.501389
	C156.088730,149.826996 152.647110,150.871521 150.586899,150.860611
	C137.145370,150.789291 123.706543,150.260147 110.264748,150.159729
	C103.797508,150.111420 97.327545,150.726562 90.855461,150.939423
	C84.815712,151.138046 82.444328,148.735367 82.001770,142.198975
	C81.550995,135.541245 83.380447,132.711792 89.581062,132.434464
	C99.873116,131.974152 110.192261,132.119583 121.000000,132.009918
z"/>
</svg>`;

const ankoHeading =
    `<ul id='` + elAnkoheading + `' class="flex items-center gap-4 md:gap-12 anko" title="Bringing anki goodness to your bunpro goodness">` +
       `<li><span class="anko-svg svg-small">` + hankoSvg + `</span></li>` +
       `<li><p class="anko-heading">HANKO!&nbsp&nbsp</p></li>` +
       `<li><span class="anko-svg svg-small">` + hankoSvg + `</span></li>` +
    `</ul>`;



const ankiSettingsButtonHtml =
    `<li>
        <button id="` + elSettingsBtn + `" title="Hanko settings">
            <span class="anko-svg svg-medium justify-center items-center rounded flex text-primary-fg border-rim text-body border min-h-button-min-height px-12 py-8">
                <span class="">` + hankoSvg + `</span>
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
						<span>Peek</span>
						</h2>
						<ul class="inline-flex overflow-hidden rounded border border-primary-accent ">
							<li class="group">
								<button id='` + elBtnHankoToggleOff +`' class="border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent">Off</button>
							</li>
							<li class="group">
								<button id='` + elBtnHankoToggleOn +`' class="border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent">On</button>
							</li>
						</ul>
						<h2 class="mb-8 flex items-center gap-8 font-bold text-primary-fg">
							<span>Anki</span>
						</h2>
						<ul class="inline-flex overflow-hidden rounded border border-primary-accent ">
							<li class="group">
								<button id='` + elBtnToggleOff +`' class="border-r border-primary-accent px-12 py-6 group-last:border-none text-primary-accent">Off</button>
							</li>
							<li class="group">
								<button id='` + elBtnToggleOn +`' class="border-r border-primary-accent px-12 py-6 group-last:border-none text-secondary-bg bg-primary-accent">On</button>
							</li>
						</ul>
						<div class="sm:flex sm:gap-12">
							<ul class="grid h-fit gap-8 sm:w-1/2">
							</ul>
							<ul class="grid h-fit gap-8 sm:w-1/2">
							</ul>
						</div>
					</section>
				</article>
			</div>
			<footer id="floating-portal-modal-footer" class="sticky bottom-0 left-0 right-0 z-2">
				<span class="text-center"><p class="order-2 text-detail font-bold text-secondary-fg md:order-1 md:justify-self-start pad-bt-5">HANKO! V1.0</p></span>
				<span class="text-center"><p class="order-2 text-detail font-bold text-secondary-fg md:order-1 md:justify-self-start pad-bt-5">๑(◕‿◕)๑ Michael Cheung 2023٩(＾◡＾)۶</p></span>
			</footer>
		</article>
	</div>
    `;

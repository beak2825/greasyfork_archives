// ==UserScript==
// @name         Moodle Quiz Shorcuts
// @namespace    http://tampermonkey.net/
// @version      2025-09-25
// @description  Enter/Shift-Enter for Next/Previous question, Up/Down for selecting multiple choice question, autoanswer
// @author       Lasu Shin
// @match        https://moodle.yerlan.top/mod/quiz/*
// @icon         https://moodle.yerlan.top/theme/image.php/boost/theme/1730285596/favicon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524310/Moodle%20Quiz%20Shorcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/524310/Moodle%20Quiz%20Shorcuts.meta.js
// ==/UserScript==

// ENABLE DEV MODE IN CHROME/EDGE TO USE (firefox is safe:)

//TODO
//return prev btn without taking away enter functionality

const prev_btn = document.getElementById('mod_quiz-prev-nav')
const text_field = document.getElementsByClassName('form-control d-inline')[0]
const options = document.getElementsByClassName('answer')[0]
let radios = []
let multiple_choice = false
let selected = null
if (prev_btn) {
    //remove button bec sometimes it goes back when pressing enter for some reason
    prev_btn.remove()
}

// if the question is a text field answer, select it
if (text_field) {
    text_field.select()
}
// if the question has multiple choices, add them to the list radios

else if (options) {
    const isRadio = options.children[0]?.children[0]?.type === "radio";
    multiple_choice = !isRadio; // Set multiple_choice to true if not radio

    for (let child of options.children) {
        // the radio button is index 0 for radios and 1 for multiple choice
        radios.push(isRadio ? child.children[0] : child.children[1]);
    }

    for (let i = 0; i < options.children.length; i++) {
        if (radios[i].checked) {
            selected = i
            break
        }
    }
    if (selected == null) {
        check(radios[0])
        selected = 0
    }
}



function check(radio) {
    if (multiple_choice) {
        radio.click()
    } else {
        radio.checked = true
    }
}

function normalize(text) {
    const words = text.trim().split(' ');
    const startIndex = words.indexOf('Answer');

    // If "Answer" is found, remove 3 words starting from it (Answer question X)
    if (startIndex !== -1) {
        return words
            .slice(0, startIndex) // Keep everything before "Answer"
            .concat(words.slice(startIndex + 3)) // Skip 3 words after "Answer"
            .join(' '); // Join back into a string
    }

    // If "Answer" isn't found, return the original text
    return text;
}


function saveQuizAnswers() {
    // Only run if we're on the correct page
    if (!window.location.href.startsWith('https://moodle.yerlan.top/mod/quiz/review.php')) {
        return;
    }

    const form = document.getElementById('region-main')
        .children[3]
        .children[1]
        .children[0]
        .children;

    if (form.length <=3) {
        return
    }

    const answers = {};

    for (let question of form) {
        if (!question || !question.children[1]) {
            continue
        }
        const questionElements = question.children[1].children;

        const questionText = normalize(questionElements[0].children[2].textContent.trim())
        const questionAnswer = questionElements[1].innerText.split(/: (.+)/)[1]; //only splits first ": "
        answers[questionText] = questionAnswer;
    }

    localStorage.setItem('lastReviewAnswers', JSON.stringify(answers));
    alert('SAVED ANSWERS');
    console.log(answers)
}

function handleNextButton() {
    const next_btn = document.getElementById('mod_quiz-next-nav')
    if (!next_btn) {
        console.log('Next button not found!')
        let submit_btn = document.getElementsByClassName('btn btn-primary')[0]
        let save_btn = document.querySelector('.btn.btn-primary[data-action=save]')
        if (!save_btn) {
            submit_btn.click()
        } else {
            save_btn.click()
        }
    } else {
        next_btn.click()
    }
}

function answer(savedAnswer) {
    if (text_field) {
        text_field.value = savedAnswer;
    } else if (radios.length > 0) {
        for (let radio of radios) {
            //if its a multiple choice, then the answer is the 3rd ([2]) element if its radios then [1]. substr 3 gets rid of the a. b. c. d.
            const answerText = radio.parentElement.children[multiple_choice ? 2 : 1].textContent.substr(3)
            if (answerText == savedAnswer) {
                radio.checked = true
            } else {
                radio.checked = false
            }
        }
    }
    handleNextButton()
}

function autoAnswer() {
    const questionElement = document.querySelector('.qtext');
    if (questionElement) {
        // Check if there are saved answers in localStorage
        const savedAnswers = localStorage.getItem('lastReviewAnswers');
        const answers = JSON.parse(savedAnswers) || {}

        let questionText = normalize(questionElement.textContent)
        let savedAnswer = answers[questionText];
        if (!savedAnswer && options && options.textContent.includes(questionText)) {
            savedAnswer = questionText
        }

        if (savedAnswer) {
            answer(savedAnswer)
        }
    }
}

//MAIN PROGRAM
autoAnswer()
saveQuizAnswers()

//focus on text field when returning to site from another tab
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
      if (text_field) {
          text_field.select()
      }
  }
});


// listen for keydown events (up, down, enter, backspace)
document.addEventListener( "keydown", function( e ) {
    var keyCode = e.keyCode || e.which;
    // check whether its a multiple choice question before checking for up and down arrows for movement
    if (options) {
        // DOWN ARROW - SELLECT PREVIOUS OPTION
        if (keyCode === 40 || keyCode === 74) {
            radios[selected].checked = false
            selected = (selected + 1) % radios.length
            check(radios[selected])

        // UP ARROW - SELECT NEXT OPTION
        } else if (keyCode === 38 || keyCode === 75) {
            radios[selected].checked = false
            selected = (selected + 3) % radios.length
            check(radios[selected])
        }
    }

    // SHIFT + ENTER - GO BACK
    if (e.shiftKey && keyCode === 13) {
        window.history.back();
    }
    // ENTER - NEXT QUESTION BUTTON
    else if (keyCode === 13) {
        handleNextButton();
    }

}, { capture: true });




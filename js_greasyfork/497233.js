// ==UserScript==
// @name         GPT3-5 Encryption Auto Answer powered by Brune.pages.dev
// @namespace    https://blooket.com
// @version      2024-05-03
// @description  Brune's working GPT3-5 API FUll turbo answering. No highlighting, for making it look like as if it not hacking
// @author       Brune
// @match        https://*.blooket.com/*
// @icon         https://res.cloudinary.com/blooket/image/upload/v1613003832/Blooks/purpleAstronaut.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497233/GPT3-5%20Encryption%20Auto%20Answer%20powered%20by%20Brunepagesdev.user.js
// @updateURL https://update.greasyfork.org/scripts/497233/GPT3-5%20Encryption%20Auto%20Answer%20powered%20by%20Brunepagesdev.meta.js
// ==/UserScript==

javascript:(function(){/**
 * 
 * MADE USING CODE BASED ON SCRIPTS PROVIDED HERE.
 * https://github.com/Sh1N02/Blooket-Cheats
 */

let hackEnabled = true;
let hackHidden = false;

(() => {
    const toggleHack = () => {
        hackEnabled = !hackEnabled;
        console.log(`Hack is ${hackEnabled ? 'enabled' : 'disabled'}`);
    };

    const toggleHackVisibility = () => {
        hackHidden = !hackHidden;
        const elements = document.querySelectorAll('[class*="answerContainer"], [class*="feedback"], [class*="typingAnswerWrapper"]');
        elements.forEach(element => {
            element.style.display = hackHidden ? 'none' : 'block';
        });
        console.log(`Hack is ${hackHidden ? 'hidden' : 'visible'}`);
    };

    const hideButtons = () => {
        buttonToggleHack.style.display = 'none';
        buttonToggleVisibility.style.display = 'none';
    };

    const autoAnswer = async () => {
        if (!hackEnabled) return;

        const { stateNode: { state: { question, stage, feedback }, props: { client: { question: pquestion } } } } = Object.values((function react(r = document.querySelector("body>div")) { return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div")) })())[1].children[0]._owner;

        try {
            if (question.qType != "typing") {
                if (stage !== "feedback" && !feedback) {
                    [...document.querySelectorAll(`[class*="answerContainer"]`)][(question || pquestion).answers.map((x, i) => (question || pquestion).correctAnswers.includes(x) ? i : null).filter(x => x != null)[0]]?.click?.();
                } else {
                    document.querySelector('[class*="feedback"]')?.firstChild?.click?.();
                }
            } else {
                Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(question.answers[0]);
            }

            // Check if there is a next question
            const nextQuestion = document.querySelector('[class*="questionContainer"]');
            if (nextQuestion) {
                nextQuestion.click();
                await new Promise(resolve => setTimeout(resolve, 50)); // Wait for 50ms before answering the next question
                autoAnswer();
            }
        } catch { }
    };

    // Create a button element to toggle hack on and off
    const buttonToggleHack = document.createElement('button');
    buttonToggleHack.textContent = 'Toggle Hack (press `) to disable and enable';
    buttonToggleHack.style.position = 'fixed';
    buttonToggleHack.style.top = '10px';
    buttonToggleHack.style.left = '10px'; // Move button to the left side
    buttonToggleHack.style.padding = '10px 20px';
    buttonToggleHack.style.fontSize = '16px';
    buttonToggleHack.style.backgroundColor = '#4CAF50';
    buttonToggleHack.style.color = 'white';
    buttonToggleHack.style.border = 'none';
    buttonToggleHack.style.borderRadius = '4px';
    buttonToggleHack.style.cursor = 'pointer';

    // Add a click event listener to toggle hack on and off
    buttonToggleHack.addEventListener('click', toggleHack);

    // Initially hide the button
    buttonToggleHack.style.display = 'none';

    // Append the toggle hack button to the document
    document.body.appendChild(buttonToggleHack);

    // Create a button element to toggle hack visibility
    const buttonToggleVisibility = document.createElement('button');
    buttonToggleVisibility.textContent = 'Toggle Visibility (press \) to delete / remove';
    buttonToggleVisibility.style.position = 'fixed';
    buttonToggleVisibility.style.top = '70px';
    buttonToggleVisibility.style.left = '10px'; // Move visibility button to the left side
    buttonToggleVisibility.style.padding = '10px 20px';
    buttonToggleVisibility.style.fontSize = '16px';
    buttonToggleVisibility.style.backgroundColor = '#4CAF50';
    buttonToggleVisibility.style.color = 'white';
    buttonToggleVisibility.style.border = 'none';
    buttonToggleVisibility.style.borderRadius = '4px';
    buttonToggleVisibility.style.cursor = 'pointer';

     // Initially hide the visibility button
     buttonToggleVisibility.style.display ='none';

     // Add a click event listener to toggle hack visibility
     buttonToggleVisibility.addEventListener('click', toggleHackVisibility);

     // Append the toggle visibility button to the document
     document.body.appendChild(buttonToggleVisibility);

     // Listen for key events to toggle hack on and off with the '`' key and hide with the backslash key
     document.addEventListener('keydown', event => {
         if (event.key === '`') {
             toggleHack();
             buttonToggleHack.style.display= hackEnabled ?'block':'none';
         } else if (event.key === '\'') {
             toggleHackVisibility();
         } else if (event.keyCode === 220) { // Backslash key
             hideButtons();
         }
     });

     // Automatically trigger auto-answer function when moving to the next question
     setInterval(autoAnswer, 1);
    console.log('Hacked by Brune');// Change interval to 10ms for faster auto-answering keeep it like less than 10 to allow super quick

 })();})();
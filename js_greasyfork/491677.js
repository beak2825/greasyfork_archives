// ==UserScript==
// @name         Quizlet
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Quizlet script (Read additional info)
// @author       You
// @match        https://quizlet.com/live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491677/Quizlet.user.js
// @updateURL https://update.greasyfork.org/scripts/491677/Quizlet.meta.js
// ==/UserScript==

(function() {

    console.log("Script loaded!");

    let obj = {};

    document.addEventListener('keydown', (event) => {
        if(event.key == "Enter" && event.metaKey) {
            event.preventDefault();
            getAnswerObj();
        }
        if(event.key == 'k') {
            if(Object.keys(obj).length == 0) {
                getAnswerObj(() => {plopAnswer(event.metaKey)});
            } else {
                plopAnswer(event.metaKey);
            }
        }
    });

    let plopAnswer = (click = false) => {
        let answer = document.querySelector('.StudentPrompt-text > div');
        let answerInfo = answer.innerHTML;
        let cards = [...document.querySelectorAll(".StudentAnswerOption div.StudentAnswerOption-text > div")];
        let cardsInfo = cards.map(card => card.innerHTML);

        let keys = Object.keys(obj);
        let values = keys.map(key => obj[key]);
        let div;
        if(keys.includes(answerInfo)) {
            let key = keys[keys.indexOf(answerInfo)];
            let correctAnswer = obj[key];
            let index = cardsInfo.indexOf(correctAnswer);
            div = [...document.querySelectorAll(".StudentAnswerOptions-optionCard")][index];
            div.style.border = '3px solid red';
        } else if(values.includes(answerInfo)){
            let value = values[values.indexOf(answerInfo)];
            let correctAnswer = keys[values.indexOf(answerInfo)];
            let index = cardsInfo.indexOf(correctAnswer);
            div = [...document.querySelectorAll(".StudentAnswerOptions-optionCard")][index];
            div.style.border = '3px solid red';
        } else {
            return;
        }

        if(click) {
            div.querySelector('div.StudentAnswerOption-text > div').click();
            div.style.border = '0px';
        } else {
            let handler = () => {
                div.style.border = '0px';
                div.removeEventListener('click', handler);
            }
            div.addEventListener('click', handler);
        }
    }

    async function getAnswerObj(callAfter = undefined) {
        if (navigator.clipboard) {
            try {
                const text = await navigator.clipboard.readText();
                let arr = text.split(";");
                for(let i = 0; i < arr.length; i++) {
                    let newArr = arr[i].split(',');
                    obj[newArr[0]] = newArr[1];
                }
            } catch (err) {
                console.error('Failed to read clipboard contents:', err);
                return; // Or handle the error as appropriate for your application
            }
        } else {
            console.error('Clipboard API not available.');
            return;
        }
        if(callAfter !== undefined) {
            callAfter();
        }
    }
})();
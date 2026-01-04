// ==UserScript==
// @name         Vocabulary.com Answer Bot - Brainiac
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  The more questions you answer the smarter it will get. Features: spelling-assistance & auto - complete, definitions and examples, actively learning bot.
// @author       GSRHackZ
// @match        https://www.vocabulary.com/*
// @icon         https://cdn.vocab.com/images/ach/L05-M1-tf7lsz.svg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531648/Vocabularycom%20Answer%20Bot%20-%20Brainiac.user.js
// @updateURL https://update.greasyfork.org/scripts/531648/Vocabularycom%20Answer%20Bot%20-%20Brainiac.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here

    // initiate variables
    let url = window.location.href;
    let practiceID = url.split('/')[4];

    // is it practice or mastery? 
    let isPractice = (url.split('/')[3] == 'lists') ? true : false;

    var stor = window.localStorage;
    var curList;
    var pLists = new Object();// an object, id:listObj

    var keyword = (isPractice) ? ".question" : ".box-question";
    var keyTypeIndex = (isPractice) ? 4 : 5;

    var choiceIndex = 0;


    // if the first time using it, create the array
    if (!stor.practiceLists) {
        stor.practiceLists = JSON.stringify(pLists);
    }
    pLists = JSON.parse(stor.practiceLists);// the object of the lists

    // reading current list
    if (!pLists.hasOwnProperty(practiceID)) {
        // if new, create it
        curList = new PracticeList(practiceID);
        pLists[practiceID] = curList;
        stor.practiceLists = JSON.stringify(pLists);//? is it necessary to update it every time?
    } else {
        curList = pLists[practiceID];
    }
    console.log("curList:" + curList.id);

    // repeat answering questions
    setInterval(answerQuestion, 250);
    // pressToAnswer();

    function answerQuestion() {
        // get the question
        let curQ = document.querySelectorAll(keyword);
        curQ = curQ[curQ.length - 1];

        // get the question type

        let qType = curQ.classList[1][keyTypeIndex].toUpperCase();// a string

        // if it's type T, it is easy
        if (qType == 'T') {
            answerTypeT(curQ);
            clickNext();
            return;
        }

        // get the question word, and set the answer word index
        let aIndex = 0;

        if (qType == 'P' || qType == 'L') {
            curQ.q = curQ.querySelector(".sentence").children[0].innerText;
            aIndex = 1;
        } else if (qType == 'H') {
            curQ.q = curQ.querySelector(".sentence").children[0].innerText;
        } else if (qType == 'F') {
            curQ.q = curQ.querySelector(".sentence").innerText.split(' ')[0];
        } else if (qType == 'I') {
            if (isPractice)
                curQ.q = curQ.querySelector(".wrapper").innerText.split('\n')[1];
            else
                curQ.q = curQ.querySelector(".box-word").innerText.split('\n')[1];
        } else if (qType == 'G') {
            curQ.q = curQ.querySelector(".questionContent").style.backgroundImage.split('/')[5];
        } else {
            curQ.q = curQ.querySelector(".instructions").querySelector("strong").innerText
        }
        if (qType == 'D') {
            aIndex = 3;
        }

        let choices = curQ.querySelector(".choices").children;

        // define the using list
        let qList;
        switch (qType) {
            case 'S':
                qList = curList.qTypeS;
                break;
            case 'D':
                qList = curList.qTypeD;
                break;
            case 'P':
                qList = curList.qTypeP;
                break;
            case 'H':
                qList = curList.qTypeH;
                break;
            case 'L':
                qList = curList.qTypeL;
                break;
            case 'A':
                qList = curList.qTypeA;
                break;
            case 'F':
                qList = curList.qTypeF;
                break;
            case 'I':
                qList = curList.qTypeI;
                break;
            case 'G':
                qList = curList.qTypeG;
                break;
            default:
                console.log("No such type of question");
                break;
        }

        // if does not exists
        if (!qList.hasOwnProperty(curQ.q)) {
            if (choiceIndex == 0)
                console.log("Type" + qType + " " + curQ.q + " does not exists. ");
            // try each answer
            choices[choiceIndex].click();
            // console.log(choiceIndex + " clicked. ");
            // if it's the answer
            if (choices[choiceIndex].className == 'correct' || choices[choiceIndex].className == 'correct is-disabled') {
                let answer;
                // save the first word as answer
                if (qType == 'I')// if it's an image question
                    answer = choices[choiceIndex].style.backgroundImage.split('/')[5];
                else
                    answer = choices[choiceIndex].innerText;

                qList[curQ.q] = answer;
                stor.practiceLists = JSON.stringify(pLists);
                console.log("record question: " + curQ.q + ", answer: " + answer);

                // go to the next question
                choiceIndex = 0;
                clickNext();
                return;
            }
            // if it's not the answer
            choiceIndex++;
            if (choiceIndex == 4) {
                choiceIndex = 0;// reset for error
                // clickNext();
            }

        } else {
            // if exists, click on the answer
            for (let i = 0; i < 4; i++) {
                if (choices[i].innerText == qList[curQ.q]) {
                    choices[i].click();
                    console.log("question recorded, answer: " + choices[i].innerText);
                    clickNext();
                    return;
                }
            }
            // if runs here, that means there is a new answer for the same question
            choices[choiceIndex].click();
            // if it's the answer
            if (choices[choiceIndex].className == 'correct' || choices[choiceIndex].className == 'correct is-disabled') {
                let answer;
                // save the first word as answer
                if (qType == 'I')// if it's an image question
                    answer = choices[choiceIndex].style.backgroundImage.split('/')[5];
                else
                    answer = choices[choiceIndex].innerText;
                qList[curQ.q] = answer;
                stor.practiceLists = JSON.stringify(pLists);
                console.log("record question: " + curQ.q + ", answer: " + answer);

                // go to the next question
                choiceIndex = 0;
                clickNext();
                return;
            }
            // if it's not the answer
            choiceIndex++;
            if (choiceIndex == 4) choiceIndex = 0;// reset for error
        }
    }

    function promiseAnswer() {
        return new Promise((resolve) => {
            document.addEventListener('keydown', enterPressed);
            function enterPressed(e) {
                if (e.keyCode == 75) {
                    console.log("enter pressed. ");
                    document.removeEventListener('keydown', enterPressed);
                    resolve();
                    answerQuestion();
                }
            }
        });
    }

    async function pressToAnswer() {
        while (true) await promiseAnswer();
    }

    // creating objects
    // represents a practice list, includes question-answer pairs
    function PracticeList(id) {
        this.id = id;
        this.qTypeD = new Object();
        this.qTypeS = new Object();
        this.qTypeP = new Object();
        this.qTypeH = new Object();
        this.qTypeL = new Object();
        this.qTypeA = new Object();
        this.qTypeF = new Object();
        this.qTypeI = new Object();
        this.qTypeG = new Object();
    }

    // object of a question
    function Q(q, a) {
        this.q = q;
        this.a = a;
    }

    function clickNext() {
        if (isPractice)
            document.querySelector(".next").click();
        else
            document.querySelector('.btn-next').click();
    }

    function answerTypeT(curQ) {
        let answer = curQ.querySelector('.complete').children[0].innerText;
        curQ.querySelector('input').value = answer;
        curQ.querySelector('.spellit').click();
    }

})();


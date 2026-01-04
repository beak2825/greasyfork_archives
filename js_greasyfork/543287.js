// ==UserScript==
// @name         Membean Utils
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes the membean experience smoother and easier.
// @match        https://membean.com/training_sessions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=membean.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543287/Membean%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/543287/Membean%20Utils.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href;

    // Create a function to check for URL changes
    function hasUrlChanged() {
        return url !== window.location.href;
    }

    // Function to get the progress bar
    function getProgressBar() {
        const progressBar = document.querySelector('div.x-progress-bar');
        if (progressBar) {
            return progressBar
        }
        return null;
    }

    var correctAnswerChecked = false
    var incorrectAnswerChecked = false
    var refreshing = false
    if (sessionStorage.getItem("countCorrect") == null) {
        sessionStorage.setItem("countCorrect","0")
    }
    if (sessionStorage.getItem("countIncorrect") == null) {
        sessionStorage.setItem("countIncorrect","0")
    }
    var countCorrect = parseInt(sessionStorage.getItem("countCorrect"))
    var countIncorrect = parseInt(sessionStorage.getItem("countIncorrect"))
    console.log(countCorrect)
    console.log(countIncorrect)
    var accuracy
    if (countCorrect + countIncorrect == 0) {
        accuracy = 0
    }
    else {
        accuracy = countCorrect/(countCorrect+countIncorrect)
    }
    let accuracyDisplay = document.createElement('div');
    accuracyDisplay.textContent = 'Accuracy: ' + countCorrect.toString() + "/" + (countCorrect+countIncorrect).toString() + " (" + Math.floor(accuracy*100).toString() + "%)";
    accuracyDisplay.style.position = 'absolute';
    accuracyDisplay.style.top = '60px';
    accuracyDisplay.style.left = '640px';
    accuracyDisplay.style.zIndex = '9999';
    accuracyDisplay.style.color = 'black'
    accuracyDisplay.style.fontSize = '32px';
    accuracyDisplay.style.fontFamily = 'Lexend';

    document.body.appendChild(accuracyDisplay)

    // Set up the loop
    let intervalId = setInterval(function() {
        if (hasUrlChanged()) {
            clearInterval(intervalId);
            console.log("Session ended, loop stopped");
        }
        else {
            let answerDisplay = document.getElementById('answer-status');
            let progressBar = getProgressBar()
            if (progressBar) {
                console.log("Progress bar found.")
            }
            else {
                console.log("Progress bar not found.")
            }
            if (answerDisplay) {
                let correctH1 = answerDisplay.querySelector('h1.correct');
                let incorrectH1 = answerDisplay.querySelector('h1.incorrect');
                let spellingErrorClass = answerDisplay.querySelector('div.spelling-error');
                if (correctH1 && progressBar) {
                    console.log("Correct Answer")
                    let correctText = correctH1.textContent;
                    if (correctText == "Correct!" && !correctAnswerChecked) {
                        countCorrect += 1
                        sessionStorage.setItem("countCorrect",String(countCorrect))
                        accuracy = countCorrect/(countCorrect+countIncorrect)
                        accuracyDisplay.textContent = 'Accuracy: ' + countCorrect.toString() + "/" + (countCorrect+countIncorrect).toString() + " (" + Math.floor(accuracy*100).toString() + "%)";
                        correctAnswerChecked = true
                    }
                }
                else if (spellingErrorClass && progressBar) {
                    console.log("Correct Answer")
                    let correctText = correctH1.textContent;
                    if (correctText == "Correct!" && !correctAnswerChecked) {
                        countCorrect += 1
                        sessionStorage.setItem("countCorrect",String(countCorrect))
                        accuracy = countCorrect/(countCorrect+countIncorrect)
                        accuracyDisplay.textContent = 'Accuracy: ' + countCorrect.toString() + "/" + (countCorrect+countIncorrect).toString() + " (" + Math.floor(accuracy*100).toString() + "%)";
                        correctAnswerChecked = true
                    }
                }
                else if (incorrectH1 && progressBar) {
                    console.log("Incorrect Answer")
                    let incorrectText = incorrectH1.textContent;
                    if (incorrectText == "Incorrect!" && !incorrectAnswerChecked) {
                        countIncorrect += 1
                        sessionStorage.setItem("countIncorrect",String(countIncorrect))
                        accuracy = countCorrect/(countCorrect+countIncorrect)
                        accuracyDisplay.textContent = 'Accuracy: ' + countCorrect.toString() + "/" + (countCorrect+countIncorrect).toString() + " (" + Math.floor(accuracy*100).toString() + "%)";
                        incorrectAnswerChecked = true
                    }
                }
                else {
                    correctAnswerChecked = false
                    incorrectAnswerChecked = false
                }
            }
            if (progressBar) {
                var progress = progressBar.offsetWidth;
                if (progress >= 240) {
                    if (!refreshing) {
                        location.reload();
                        console.log("Attempting Reload")
                        refreshing = true
                    }
                }
                else {
                    refreshing = false
                }
            }
        }
    }, 100); // Check every 100 milliseconds
})();
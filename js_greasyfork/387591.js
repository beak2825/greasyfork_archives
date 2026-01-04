// ==UserScript==
// @name         prawojazdy360.pl
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Script that adds keyboard shortcuts to the prawojazdy360.pl 'kurs' section.
// @author       Borowy Alan
// @match        *://www.prawo-jazdy-360.pl/kurs*
// @match        *://www.prawo-jazdy-360.pl/test*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387591/prawojazdy360pl.user.js
// @updateURL https://update.greasyfork.org/scripts/387591/prawojazdy360pl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let courseMode;
    let testMode;
    window.location.pathname == '/kurs'
        ? courseMode = true
        : testMode = true

    let video
    let yesButton
    let noButton
    let nextQuestionButton
    let firstAnswer
    let secondAnswer
    let thirdAnswer

    function initializeKeys() {
        video = courseMode
            ? document.getElementById('media-video')
            : document.getElementsByClassName('video-play')[0]
        yesButton = document.getElementById('Answers-0')
        noButton = document.getElementById('Answers-1')
        nextQuestionButton = courseMode
            ? document.getElementById('btn-next')
            : document.getElementsByClassName('btn-next')[1]
        firstAnswer = document.getElementById('Answers-0')
        secondAnswer = document.getElementById('Answers-1')
        thirdAnswer = document.getElementById('Answers-2')
    }

    initializeKeys();

    document.onkeyup = function(e) {
        if (e.code == 'KeyP') {
            if(courseMode){
                video.focus()
                video.play()
            } else {
                video.click()
            }
            
        } else if (e.code == 'KeyT') {
            yesButton.click()
            saveAnswer()
        } else if (e.code == 'KeyN') {
            noButton.click()
            saveAnswer()
        } else if (e.code == 'Enter') {
            nextQuestionButton.click()
            if (testMode) setTimeout(initializeKeys, 500)
        } else if (e.code =='KeyA' || e.code == 'Digit1' || e.code == 'Digit8') {
            firstAnswer.click()
            saveAnswer()
        }
        else if (e.code =='KeyB' || e.code == 'Digit2' || e.code == 'Digit9') {
            secondAnswer.click()
            saveAnswer()
        }
        else if (e.code =='KeyC' || e.code == 'Digit3' || e.code == 'Digit0') {
            thirdAnswer.click()
            saveAnswer()
        }
    };
})();
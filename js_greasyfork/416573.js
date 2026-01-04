// ==UserScript==
// @name         WaniKani Always Show Item Info + Read Pronunciation
// @namespace    http://tampermonkey.net/
// @version      1.08
// @description  Always show WaniKani item info during reviews without scrolling, no matter if your answer was correct or not. Then reads available pronunciations.
// @author       jaysm
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/lesson/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416573/WaniKani%20Always%20Show%20Item%20Info%20%2B%20Read%20Pronunciation.user.js
// @updateURL https://update.greasyfork.org/scripts/416573/WaniKani%20Always%20Show%20Item%20Info%20%2B%20Read%20Pronunciation.meta.js
// ==/UserScript==

(function() {
    'use strict';
         $.jStorage.listenKeyChange('questionCount', function (key, action) {
            showItemInfo();
      });
})();

function noscroll() {
    window.scrollTo( 0, 0 );
}

// expand item info
function showItemInfo(){

    window.addEventListener('scroll', noscroll);

    // expand item info
    setTimeout(function () {
        $('#option-item-info').click();
             // expand item info
             setTimeout(function () {
                 $('#all-info').click();
             }, 500);
    }, 100);

    setTimeout(function () {
        const element = document.querySelector("#option-audio");
        var isReadingDisabled = element.classList.contains("disabled");
        if (!isReadingDisabled) {
            //$('#option-audio').find('button').click();
            setTimeout(function () {
                readAll();
            }, 50);
        }
    }, 100);

    // Remove listener to disable scroll
    setTimeout(function () {
        window.removeEventListener('scroll', noscroll);
    }, 1000);
}

// some words have more than one pronunciation
// set to 2 to hear only main reading
const maximumNumberOfVoicesToRead = 8

// read the pronunciations
function readAll() {
    const col1Children = document.querySelector("#item-info-col1").childNodes;
    const readingsSection = Array.from(col1Children).find((node) => node.id === "item-info-reading");
    if (typeof readingsSection == 'undefined') {
        setTimeout(function () {
            readAll();
        }, 50);
    } else {
        const buttons = readingsSection.querySelectorAll("button");
        if (buttons.length > 0) {
            readVoice(buttons, 0);
        } else {
            setTimeout(function () {
                readAll();
            }, 50);
        }
    }
}

// read a voice, delay and read the next one
function readVoice(buttons, voiceIndex) {
    buttons[voiceIndex].click()
    if (voiceIndex < buttons.length && (voiceIndex+1) < maximumNumberOfVoicesToRead) {
        setTimeout(function(){readVoice(buttons, voiceIndex+1); }, 1500); // 1.5 second delay between voices
    }
}

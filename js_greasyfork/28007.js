// ==UserScript==
// @name         FreedomPop number filter
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  Only display numbers I like
// @author       You
// @match        https://www.freedompop.com/acct_manage_number
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28007/FreedomPop%20number%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/28007/FreedomPop%20number%20filter.meta.js
// ==/UserScript==

var seen;
var dummyElement;
var globalCount;
var failCount;
var intervalId;
var textBox;
var resetButton;
var maxFail = 500;
(function() {
    'use strict';
    seen = {};
    dummyElement = document.createElement('div');
    dummyElement.setAttribute('id', 'dummy');
    textBox = document.createElement('div');
    document.querySelector('div#newNumberSearchContainer').appendChild(textBox);
    resetButton = document.createElement('a');
    resetButton.setAttribute('class', 'btn-blue');
    resetButton.innerText = 'Restart';
    resetButton.addEventListener('click', reset, false);
    document.querySelector('form#chooseNumber').appendChild(resetButton);
    globalCount = 0;
    failCount = 0;
    console.log("Number filter loaded");
    intervalId = setInterval(check, 500);
})();

function reset() {
    failCount = 0;
    globalCount = 0;
    seen = {};
    if (!intervalId) {
        intervalId = setInterval(check, 500);
    }
    document.querySelector("a#submitPhoneNumberSearch").click();
}

function check() {
    document.querySelectorAll("div.productImage")[0].style.display = "none";
    document.querySelectorAll("div.productInfo")[0].style.display = "none";
    
    var dummyTest = document.querySelectorAll("div#dummy");
    // dummy div is added once all the numbers on the page have been processed. It will be cleared when new numbers are obtained.
    if (failCount === maxFail) {
        clearInterval(intervalId);
        intervalId = null;
        return;
    }
    if (dummyTest.length !== 0) {
        return;
    }
    ++globalCount;
    var l = document.querySelectorAll("div.phoneNum");
    var count = 0;
    var total = l.length;


    for (var i = 0; i < total; ++i) {
        var number = l[i].innerText;
        if (number.indexOf('4', 5) != -1 || number.indexOf('7', 10) != -1 || seen.hasOwnProperty(number)) {
            ++count;
            if (seen.hasOwnProperty(number)) {
                l[i].style.opacity = 0.5;
            } else {
                l[i].parentNode.parentNode.style.display = "none";
            }
        } else {
            l[i].style.color = "red";
            seen[number] = true;
            failCount = 0;
        }
    }
    document.querySelector("div#suggestedNumbersRight").appendChild(dummyElement);
    if (count >= total) {
        console.log("No desirable numbers. Getting new ones...");
        document.querySelector("a#submitPhoneNumberSearch").click();
        ++failCount;
    }
    var all_numbers = Object.getOwnPropertyNames(seen);
    console.log("Attempt %d: seen %d\n", globalCount, all_numbers.length);
    textBox.innerText = "Attempt " + globalCount + ": seen " + all_numbers.length + ", failed " + failCount + " times";
    console.log(all_numbers);
}
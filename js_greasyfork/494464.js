// ==UserScript==
// @name         masked Button Clicker AM Random
// @namespace    https://greasyfork.org/masked-button-clicker-Am-Random
// @version      3.6
// @description  Clicks a button at random intervals
// @license      MIT
// @match        https://*.apple.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494464/masked%20Button%20Clicker%20AM%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/494464/masked%20Button%20Clicker%20AM%20Random.meta.js
// ==/UserScript==

// Complex obscure functions and variables
(function() {
    var obscureModule = (function() {
        var obscureNamespace = {};

        obscureNamespace.getRandomValue = function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min);   };

        obscureNamespace.obscureClicker = function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.click(); } else {  console.log("Element not found:", selector);  }
        };  return obscureNamespace;  })();

    var complexObscureVariable = {
        data: [1, 2, 3, 4, 5],
        processData: function() {
            var sum = this.data.reduce(function(acc, val) { return acc + val; }, 0);
            console.log("Sum of data:", sum);  } };

    function obscureLoop() {
        var delay = obscureModule.getRandomValue(35000, 45000);
        console.log("Delay:", delay);
        setTimeout(function() {  complexObscureVariable.processData();
            obscureModule.obscureClicker('amp-playback-controls-item-skip.next');  obscureLoop();  }, delay);
    }

    obscureLoop();  })();

// 
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); }

function doSomething() {
    // Find the "Next" button using its class
    var nextButton = document.querySelector('amp-playback-controls-item-skip.next');
    if (nextButton) {  nextButton.click();  } else {  console.log("Next button not found.");
    }
}

(function loop() {
    var rand = getRandomInt(35000, 45000); console.log(rand); setTimeout(function() {
        doSomething();  loop();  }, rand); })();

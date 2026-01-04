// ==UserScript==  
// @name         Skip Gemini Paid Content and Use Advanced  
// @namespace    http://tampermonkey.net/  
// @version      1.0  
// @description  Skip paid content and use try Gemini Advanced button on gemini.google.com  
// @author       You  
// @match        https://gemini.google.com/*  
// @grant        none  
// @downloadURL https://update.greasyfork.org/scripts/514300/Skip%20Gemini%20Paid%20Content%20and%20Use%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/514300/Skip%20Gemini%20Paid%20Content%20and%20Use%20Advanced.meta.js
// ==/UserScript==    
  
(function() {  
    'use strict';  
  
    // Function to click the try Gemini Advanced button  
    function clickGeminiAdvancedButton() {  
        // Wait for the button to be available  
        const geminiAdvancedButton = document.querySelector('#tryGeminiAdvancedButton'); // Adjust the selector as needed  
        if (geminiAdvancedButton) {  
            // Simulate a click on the button  
            geminiAdvancedButton.click();  
            console.log('Clicked try Gemini Advanced button.');  
        } else {  
            console.warn('Try Gemini Advanced button not found!');  
        }  
    }  
  
    // Wait for the page to fully load before running the function  
    window.addEventListener('load', function() {  
        // Optionally, add a delay if the button appears after the page load  
        // setTimeout(clickGeminiAdvancedButton, 2000); // 2 seconds delay, adjust as needed  
        clickGeminiAdvancedButton();  
    });  
})();
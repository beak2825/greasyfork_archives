// ==UserScript==
// @name         PurposeGames Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Answers all games on PurposeGames in record Time (with adjustable slider)
// @author       longkidkoolstar
// @match        https://www.purposegames.com/*
// @icon         https://th.bing.com/th/id/R.201395eef044c88cd80bb137b6638932?rik=4SVeP8xG%2bGt2Tg&pid=ImgRaw&r=0
// @license      none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486387/PurposeGames%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/486387/PurposeGames%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previousValue = document.querySelector('#question-box').getAttribute('data-text');

    // Function to simulate click
    function simulateClick(element) {
        const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(clickEvent);
    }

    // Function to display the unit circle, the number to click, and the element
    function displayInfo() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            console.log(`Dot at (${dot.getAttribute('data-x')}, ${dot.getAttribute('data-y')}) represents ${dot.getAttribute('data-text')}`, dot);
        });
        
        const targetAngle = document.querySelector('#question-box').getAttribute('data-text');
        console.log(`Number to click: ${targetAngle}`);
        
        if (targetAngle !== previousValue) {
            solveUnitCircle();
            previousValue = targetAngle;
        }
    }

    // Main function to find and click the correct dot
    function solveUnitCircle() {
        const targetAngle = document.querySelector('#question-box').getAttribute('data-text');
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            if(dot.getAttribute('data-text') === targetAngle) {
                simulateClick(dot);
            }
        });
    }

    // Create GUI slider and popup
    function createSliderAndPopup() {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '1';
        slider.max = '100';
        slider.value = localStorage.getItem('sliderValue') || '10'; // Retrieve saved value or use default
        slider.style.position = 'fixed';
        slider.style.left = '0';
        slider.style.bottom = '0';
        document.body.appendChild(slider);

        // Popup for displaying the current slider value
        var popup = document.createElement('div');
        popup.classList.add('slider-popup');
        popup.style.position = 'fixed';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.padding = '5px 10px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '9999';
        popup.style.display = 'none'; // Initially hidden
        document.body.appendChild(popup);

        let intervalId;
        slider.oninput = function() {
            clearInterval(intervalId);
            const intervalTime = 1000 / this.value; // Calculate interval time based on slider value
            intervalId = setInterval(solveUnitCircle, intervalTime);
            localStorage.setItem('sliderValue', this.value); // Save slider value to localStorage

            // Show the popup with the current slider value
            popup.innerText = 'Speed: ' + this.value;
            popup.style.display = 'block';

            // Calculate slider position and adjust popup position
            var sliderRect = slider.getBoundingClientRect();
            var popupX = sliderRect.left + ((slider.value - slider.min) / (slider.max - slider.min)) * sliderRect.width - popup.clientWidth / 2;
            var popupY = sliderRect.top - popup.clientHeight - 10;

            popup.style.left = popupX + 'px';
            popup.style.top = popupY + 'px';

            // Start a timer to hide the popup after a certain duration (e.g., 2 seconds)
            setTimeout(function() {
                popup.style.display = 'none';
            }, 2000);
        };

        // Show popup when mouse hovers over the slider
        slider.onmouseover = function() {
            popup.style.display = 'block';
        };

        // Hide popup when mouse leaves the slider
        slider.onmouseout = function() {
            popup.style.display = 'none';
        };
    }
    createSliderAndPopup();

    //setInterval(displayInfo, 1000);
})();

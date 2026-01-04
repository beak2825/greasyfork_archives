// ==UserScript==
// @name         InQuizitive Hack
// @namespace    http://tampermonkey.net/
// @version      2024-09-01
// @description  Easily Complete Your Assigments
// @author       You
// @match        https://ncia.wwnorton.com/*
// @icon         data:image/png;base64,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
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/506326/InQuizitive%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/506326/InQuizitive%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitForScore() {
        if (unsafeWindow.Score !== undefined) {
            console.log("Score object is now accessible.");
            console.log(unsafeWindow.Score); 
            clearInterval(interval);
        } else {
            console.log("Waiting for Score object...");
            console.log(unsafeWindow.Score);
        }
    }


    var interval = setInterval(waitForScore, 100);
    GM_addStyle(`
        #tmGuiContainer input[type="range"], #tmGuiContainer input[type="text"], #tmGuiContainer button {
            display: block;
            margin-top: 10px;
            width: 200px;
        }

        #toggleButton {
            background-color: #f9f9f9; /* Light grey background */
            color: black;
            border: 1px solid #ccc;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            outline: none;
        }

        #toggleButton.active {
            background-color: #4CAF50; /* Green background for active state */
            color: white;
        }

        #tmGuiContainer input[type="range"] {
            -webkit-appearance: none; /* Override default CSS styles */
            appearance: none;
            width: 100%;
            height: 5px;
            background: #ddd; /* Light grey background */
            outline: none; /* Remove outline */
            opacity: 0.7; /* Partial transparency */
            transition: opacity .2s;
        }

        #tmGuiContainer input[type="range"]:hover {
            opacity: 1; /* Fully opaque on hover */
        }

        #tmGuiContainer input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; /* Override default styles */
            appearance: none;
            width: 20px; /* Set a specific slider handle width */
            height: 20px; /* Set a specific slider handle height */
            background: #800080; /* Purple background */
            cursor: pointer; /* Cursor on hover */
            border-radius: 50%; /* Circular handle */
        }

        #tmGuiContainer input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #800080;
            cursor: pointer;
            border-radius: 50%;
        }
    `);


    var guiContainer = document.createElement('div');
    guiContainer.id = "tmGuiContainer";
    guiContainer.style.position = "fixed";
    guiContainer.style.top = "10px";
    guiContainer.style.right = "10px";
    guiContainer.style.zIndex = "1000";
    guiContainer.style.padding = "10px";
    guiContainer.style.backgroundColor = "#f9f9f9";
    guiContainer.style.border = "1px solid #ccc";
    guiContainer.style.borderRadius = "5px";
    document.body.appendChild(guiContainer);

    var slider = document.createElement('input');
    slider.type = "range";
    slider.min = "0";
    slider.max = "100"; 
    slider.value = "50"; 
    slider.id = "betAmountSlider";
    slider.style.width = "200px";


    var label = document.createElement('label');
    label.htmlFor = "betAmountSlider";
    label.textContent = "Bet Amount: " + slider.value;
    label.style.display = "block";
    label.style.marginTop = "10px";

    guiContainer.appendChild(slider);
    guiContainer.appendChild(label);


    var maxBetInput = document.createElement('input');
    maxBetInput.type = "text"; 
    maxBetInput.value = slider.max;
    maxBetInput.style.marginTop = "10px";
    maxBetInput.style.display = "block";

    var maxBetLabel = document.createElement('label');
    maxBetLabel.textContent = "Set Max Bet:";
    maxBetLabel.style.display = "block";
    maxBetLabel.style.marginTop = "10px";

    var setMaxButton = document.createElement('button');
    setMaxButton.textContent = "Set Max";
    setMaxButton.style.marginTop = "5px";
    setMaxButton.onclick = function() {
        var newMax = parseInt(maxBetInput.value, 10);
        if (isNaN(newMax) || newMax < 0) {
            alert("Please enter a valid positive number.");
        } else {
            slider.max = newMax;
        }
    };

    guiContainer.appendChild(maxBetLabel);
    guiContainer.appendChild(maxBetInput);
    guiContainer.appendChild(setMaxButton);


    slider.oninput = function() {
        label.textContent = "Bet Amount: " + this.value;
        window.betAmount = parseInt(this.value, 10); 
        unsafeWindow.Score.set_bet(this.value);
    };
})();

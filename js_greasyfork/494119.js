// ==UserScript==
// @name         Deposit Script
// @version      2024-05-06
// @description  Creates a button that goes to faction armory, clicks autofill, and then clicks deposit on clicking
// @author       Yang_Cheng [2491889]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1297051
// @downloadURL https://update.greasyfork.org/scripts/494119/Deposit%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/494119/Deposit%20Script.meta.js
// ==/UserScript==

var doesntWork = 0;
var filled = 0;
// Function to create the button and attach it to the page
function addButton() {
    const zNode = document.createElement('div');
    zNode.innerHTML = '<button id="myButton" type="button">Deposit</button>';
    zNode.setAttribute('id', 'myContainer');
    document.body.appendChild(zNode);

    // Add clicking to the button
    document.getElementById("myButton").addEventListener("click", buttonClickAction, false);
}

// Function to handle actions when the button is clicked
function buttonClickAction() {
    if(window.location.href === 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury'){
        if(filled % 2 === 0){
            autofill();
        } else {
            deposit();
        }
    } else {
        window.location.href = "https://www.torn.com/factions.php?step=your&type=1#/tab=armoury";
    }
}

function autofill() {
    // Find the fill balance button
    const buttonsAutofill = document.querySelectorAll(".wai-btn");
    const buttonAutofill = buttonsAutofill[1];
    if (buttonAutofill) {
        // If its there, click it
        buttonAutofill.click();
        filled++;
        return;
    } else {
        // If not, try again in 100ms
        setTimeout(() => {
            if(doesntWork < 50){
                doesntWork++;
                autofill();
            }else{
                return;}
        }, 100);
    }
}

function deposit() {
    const buttons = document.querySelectorAll(".torn-btn");
    buttons.forEach(button => {
        // Check if the button's text content matches 'DEPOSIT MONEY'
        if (button.textContent.trim() === 'DEPOSIT MONEY') {
            // If it matches, click the button
            button.click();
            // Find confirmation link
            const link = document.querySelector('a[aria-label="Yes, I want to deposit"].yes.bold.t-blue.h.c-pointer');
            // Click it
            link.click();
            filled++;
            return;
        }
    });
    setTimeout(() => {
        // If it couldn't find the button, try again in 50ms.
        if(doesntWork < 50){
            doesntWork++;
            deposit();
        }else{
            return;}
    },50);
}

addButton();

GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    100px;
        left:                   100px;
        font-size:              20px;
        background:             white;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                1;
        z-index:                1000;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  white;
        background:             black;
    }
` );
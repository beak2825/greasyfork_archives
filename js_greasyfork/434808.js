// ==UserScript==
// @name         GetUndeployedMunzeeURLs
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Get Urls for The Munzee Skin Machine
// @author       CzPeet
// @match        https://www.munzee.com/print
// @icon         https://www.google.com/s2/favicons?domain=munzee.com
// @update       https://greasyfork.org/en/scripts/434808-getundeployedmunzeeurls
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434808/GetUndeployedMunzeeURLs.user.js
// @updateURL https://update.greasyfork.org/scripts/434808/GetUndeployedMunzeeURLs.meta.js
// ==/UserScript==

async function PrintYourMunzees()
{
    if (document.body.innerText.includes("Print Your Munzees"))
    {
        var mainForm = document.getElementsByClassName("form")[0];

        var URLDIV = document.createElement('DIV');
        URLDIV.setAttribute('style', 'margin-top: 20px');

        var URLsTextArea = document.createElement('TEXTAREA');
        URLsTextArea.setAttribute('id','urlArea');
        URLsTextArea.setAttribute('style','width: 100%;height: 350px;');

        URLDIV.appendChild(URLsTextArea);
        mainForm.appendChild(URLDIV);

        //EventListeners
        var check_batch = findButtonByText("Check");
        check_batch.addEventListener('click', chBoxCheckedChange);

        var check_all = findButtonByText("Check All");
        check_all.addEventListener('click', chBoxCheckedChange);

        var inputs = document.querySelectorAll('input[type="checkbox"]');
        for(var i = 0; i < inputs.length; i++) {
            if (inputs[i].value.includes("munzee.com"))
            {
                inputs[i].addEventListener('change', chBoxCheckedChange);
            }
        }
    }
}

function findButtonByText(text) {
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === text) {
            return buttons[i];
        }
    }
    return null; // Button with the specified text not found
}

async function chBoxCheckedChange()
{
    await new Promise(resolve => setTimeout(resolve, 250)); // Wait for 200 ms
    var selectedURLs = "";
    var ua = document.getElementById('urlArea');
    ua.setAttribute('value','');
    var inputs = document.querySelectorAll('.PrivateSwitchBase-input:checked');
    for(var i = 0; i < inputs.length; i++) {
         if (inputs[i].value.includes("munzee.com"))
         {
             selectedURLs += '\n' +inputs[i].value;
         }
    }
    ua.value = selectedURLs;
}

//###########################################//
//New FireBase adaptation DOM Loaded checking//
//###########################################//
var DOMLoaded = false;
var doc = "";
var equalCounter = 0;

async function delayedLoop() {
    while (!DOMLoaded)
    {
        if (doc == document)
        {
            equalCounter++;
        }
        else
        {
            doc = document;
            equalCounter = 0;
        }

        if (equalCounter == 10)
        {
            DOMLoaded = true;
        }

        await new Promise(resolve => setTimeout(resolve, 250)); // Wait for 200 ms
    }

    PrintYourMunzees();
}

delayedLoop();
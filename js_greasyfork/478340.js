// ==UserScript==
// @name         Advanced Search Bounty Tool
// @namespace    Torn
// @version      0.53
// @description  Outputs bounty and attack links from Advanced Search
// @author       MisterCow [2879457] & Echotte [2834135]. Bastardised by Terekhov and BoonieSteep
// @match        *://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478340/Advanced%20Search%20Bounty%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/478340/Advanced%20Search%20Bounty%20Tool.meta.js
// ==/UserScript==

// Variables that will probably change
var buttonName = "COPY NAMES";
var genericProfileLink = "www.torn.com/profiles.php?XID=";
var hiddenTag = "tt-hidden";

/* PREVIOUS CODE - NOT USED NOW
// Add a button
var zNode = document.createElement('div');
zNode.innerHTML = '<button id="myButton" type="button">' + buttonName + '</button>';
zNode.setAttribute('id', 'myContainer');
document.body.appendChild(zNode);

// Activate the newly added button.
document.getElementById("myButton").addEventListener ("click", ButtonClickAction, false);
*/

// NEW CODE
setTimeout(func, 1000);

//Adds a button to trigger the calls.
function func() {
    'use strict';
    let addBtn = document.querySelector("div.users-list-title.title-black.top-round.m-top10.clearfix"); //Adds the button BEFORE the title bar
    let btn = document.createElement('BUTTON');
    btn.id = "employ";
    btn.innerHTML = ' COPY IDS';
    btn.type = "button";
    btn.className = 'torn-btn';
    addBtn.insertAdjacentElement('beforebegin', btn);
    document.getElementById("employ").addEventListener("click", ButtonClickAction);
};
// END NEW CODE

function ButtonClickAction (zEvent) {
    var x = document.querySelectorAll("a");
    var copyString = "";
    var i = 0;
    var count = 1;

    while (copyString.length < 1900)
    {
        var cleanText = x[i].textContent.replace(/\s+/g, ' ').trim();
        var cleanLink = x[i].href;

        if(cleanLink.includes(genericProfileLink))
        {
            var parent = x[i].parentElement.parentElement.classList.value;
            if (parent.includes("user") && !parent.includes(hiddenTag))
            {
                // Format for proper pasting into excel/sheets
                copyString += (count + '.' + '\n' + 'https://www.torn.com/bounties.php?p=add&XID='+ cleanLink.substring(cleanLink.indexOf('XID=') + 4) + '\n' + 'https://www.torn.com/loader.php?sid=attack&user2ID=' + cleanLink.substring(cleanLink.indexOf('XID=') + 4) + '\n');
                count += 1
            }
        }
        i += 1;
    };

    try
    {
        setTimeout(async()=>console.log(await navigator.clipboard.writeText(copyString)), 250);
    }
    catch (err)
    {
        console.error('Failed to copy: ', err);
    }
}
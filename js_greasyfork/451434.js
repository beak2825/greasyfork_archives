// ==UserScript==
// @name The West - No oktober
// @author Anonymous
// @description The West Oktoberfest
// @include http*://nl12.the-west.*/game.php*
// @version 1.0
// @namespace https://greasyfork.org/users/959712
// @downloadURL https://update.greasyfork.org/scripts/451434/The%20West%20-%20No%20oktober.user.js
// @updateURL https://update.greasyfork.org/scripts/451434/The%20West%20-%20No%20oktober.meta.js
// ==/UserScript==


function getRandomNumber(){
    return Math.floor((Math.random() * 1750) + 10);

}

async function Disableoktoberfest() {
    var Doei = document.getElementsByClassName("ongoing_entry hasMousePopup")[0].style.display = "none"
await new Promise(r => setTimeout(r, (1070*1 + getRandomNumber())));
Disableoktoberfest();
}

async function DisablePretzelsoktoberfest() {
    var Doei = document.getElementsByClassName("custom_unit_counter Octoberfest hasMousePopup with_log")[0].style.display = "none"
await new Promise(r => setTimeout(r, (1070*1 + getRandomNumber())));
DisablePretzelsoktoberfest();
}

Disableoktoberfest();
DisablePretzelsoktoberfest();

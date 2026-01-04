// ==UserScript==
// @name        FlightRising Scrying Helper
// @description Adds Scrying Workshop related quality-of-life tweaks
// @include     https://www1.flightrising.com/scrying/predict*
// @include     https://flightrising.com/main.php?dragon=*
// @include     https://flightrising.com/main.php?p=lair*did=*
// @include     https://flightrising.com/main.php?p=view*did=*
// @version     1
// @grant       none
// @namespace   https://greasyfork.org/users/172627
// @downloadURL https://update.greasyfork.org/scripts/392041/FlightRising%20Scrying%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392041/FlightRising%20Scrying%20Helper.meta.js
// ==/UserScript==
/* jshint esversion:6 */

// auto updating scrying when drop downs are changed
if(window.location.href.indexOf('/scrying/predict') != -1) {
    const updateBtn = document.getElementById('scry-button');
    // all drop down menus are contained in the .scrying-options container, and the events bubble up
    document.querySelector('.scry-options').addEventListener('change', e => {
        if(e.target.matches('select')) {
            updateBtn.click();
        }
    });
}

// predict morphology link on dragon pages
else { // all urls other than the scrying page are various dragon pages
    const dragonId = window.location.href.match(/(?:dragon=\d+|did=\d+)/g)[0].split('=')[1];
    const infobox = document.getElementById('newname');

    // slight hack to create html from a string
    const btnHolder = document.createElement('div');
    btnHolder.innerHTML = `<a href="https://www1.flightrising.com/scrying/predict/${dragonId}" class="beigebutton thingbutton" style="width: 290px; text-align: center; float: right">Predict Morphology</a>`;
    const btn = btnHolder.firstChild;

    // checks if the "Edit description" button is present to determine whether you own the dragon or not
    // the page is styled subtle differently depending if it's your dragon, so the button margins have to be adjusted to account for this
    if(document.querySelectorAll('fieldset form .mb_button').length > 0) {
        btn.style.margin = '-20px 0 10px';
    }
    else {
        btn.style.margin = '-40px 0 15px';
    }

    infobox.parentNode.insertBefore(btn, infobox.nextSibling); // basically, insert after infobox
}
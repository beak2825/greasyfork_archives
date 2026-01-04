// ==UserScript==
// @name         [GC] Pet Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description Shows a button on every userlookup that will count the number of pets with an alert
// @author       Masterofdarkness
// @match        https://www.grundos.cafe/userlookup/?user=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license     MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/519916/%5BGC%5D%20Pet%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/519916/%5BGC%5D%20Pet%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

function countPetClasses() {
    const userPetList = document.getElementById('userPetList');
    if (!userPetList) {
        return 0; // Return 0 if the element with id 'userPetList' does not exist
    }

    const petClasses = Array.from(userPetList.getElementsByClassName('ul__pet')).length;
    alert(`Number of pets on this lookup: ${petClasses}`);
}

// Create a button that scrolls with the page
const button = document.createElement('button');
button.innerText = 'Count # of Pets';
button.style.position = 'fixed';
button.style.bottom = '20px';
button.style.right = '20px';
button.style.padding = '10px';
button.style.backgroundColor = '#4CAF50';
button.style.color = 'white';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';
button.onclick = countPetClasses;

document.body.appendChild(button);



})();
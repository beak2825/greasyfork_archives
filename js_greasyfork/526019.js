// ==UserScript==
// @name         CS Next 10 IDs
// @namespace    OreozHere
// @version      1.0
// @description  Opens the next 10 ChickenSmoothie pet IDs from the current one in new tabs
// @match        https://www.chickensmoothie.com/viewpet.php?id=*
// @downloadURL https://update.greasyfork.org/scripts/526019/CS%20Next%2010%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/526019/CS%20Next%2010%20IDs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentID() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentID = urlParams.get('id');
        return parseInt(currentID, 10);
    }

    function openNext20IDs() {
        const currentID = getCurrentID();
        for (let i = 1; i <= 10; i++) {
            const nextID = currentID + i;
            const url = `https://www.chickensmoothie.com/viewpet.php?id=${nextID}`;
            window.open(url, '_blank');
        }
    }
    const button = document.createElement('button');
    button.innerText = 'Open Next 10 IDs';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#cd7268';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', openNext20IDs);

    document.body.appendChild(button);
})();

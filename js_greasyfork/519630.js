    // ==UserScript==
    // @name         GetSniped Torn Target
    // @namespace    http://tampermonkey.net/
    // @version      420.69
    // @description  Randomly target not so random citizens
    // @author       NotWinston
    // @match        https://www.torn.com/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519630/GetSniped%20Torn%20Target.user.js
// @updateURL https://update.greasyfork.org/scripts/519630/GetSniped%20Torn%20Target.meta.js
    // ==/UserScript==

(function() {
    'use strict';

    // Predefined list of IDs - stored as a Set for O(1) lookup efficiency
    const targetIds = new Set([
        2665386, 2735600, 2269760, 2384982,
        2223342, 2534151, 2547681, 2510178,
        2708323, 2792606, 2760110, 2758063,
        1088707, 2542254, 2679208, 2489160,
        2249873, 2750150, 2671286, 2686759,
        1928078
    ]);

    // Convert Set to Array for random selection
    const idsArray = Array.from(targetIds);

    // Efficient random ID selection
    function getRandomId() {
        return idsArray[Math.floor(Math.random() * idsArray.length)];
    }

    // Create a button element
    const button = document.createElement('button');
    button.innerHTML = 'Chain';
    button.style.position = 'fixed';
    button.style.top = '27%';
    button.style.right = '0%';
    button.style.zIndex = '9999';

    // Add CSS styles for a green background
    button.style.backgroundColor = 'green';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '6px';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';

    // Add click event listener
    button.addEventListener('click', function() {
        const randID = getRandomId();
        const profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${randID}`;
        window.location.href = profileLink;
    });

    // Add the button to the page
    document.body.appendChild(button);
})();
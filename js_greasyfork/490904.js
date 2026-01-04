// ==UserScript==
// @name         More Racing Info (Mobile)
// @namespace    heartflower.torn.com
// @version      1.0.2
// @description  Show Torn's race name and start time on mobile view
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/490904/More%20Racing%20Info%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490904/More%20Racing%20Info%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addInfo() {
        // Check if page is fully loaded in yet
        let wrapper = document.body.querySelector('.racing-main-wrap');
        if (!wrapper) {
            setTimeout(addInfo, 100);
            return;
        }

        // Check if custom race tab
        let customEventsWrap = wrapper.querySelector('.custom-events-wrap');
        if (!customEventsWrap) {
            setTimeout(addInfo, 100);
            return;
        }

        // If already added, don't add again
        let existingDivs = document.body.querySelector('.hf-race-name');
        if (existingDivs) {
            return;
        }

        // Fetch all races
        let ul = customEventsWrap.querySelector('.events-list');
        let races = ul.children;

        // Loop through all races and get the correct information
        for (var i = 0; i < races.length; i++) {
            let race = races[i];

            // Fetch the header (visible info);
            let headerContainer = race.querySelector('.ui-accordion-header');
            let headerUL = headerContainer.querySelector('.event-info');

            // Fetch the current track information
            let trackLI = headerUL.querySelector('.track');
            trackLI.style.lineHeight = 'normal';

            // Fetch the current car information
            let carLI = headerUL.querySelector('.car');
            carLI.style.lineHeight = 'normal';

            // Fetch the info (visible upon click info)
            let infoContainer = race.querySelector('.ui-accordion-content');
            let infoUL = infoContainer.querySelector('.event-info');

            // Fetch the race name
            let nameElement = infoUL.querySelector('.name');
            let name = nameElement.textContent.trim();

            // Fetch the start time
            let startTimeElement = infoUL.querySelector('.startTime');
            let startTime = startTimeElement.textContent.trim();

            // Show the race name on the header, above the track
            let nameDiv = document.createElement('div');
            nameDiv.className = 'hf-race-name';
            nameDiv.textContent = name;
            nameDiv.style.color = '#15AABF';
            trackLI.insertBefore(nameDiv, trackLI.firstChild);

            // Show the race bame on the header, above the car requirement
            let startTimeDiv = document.createElement('div');
            startTimeDiv.className = 'hf-start-time';
            startTimeDiv.textContent = 'Start Time: ' + startTime;
            startTimeDiv.style.color = '#15AABF';
            carLI.insertBefore(startTimeDiv, carLI.firstChild);
        }
    }

    // Attach click event listener
    document.body.addEventListener('click', handleButtonClick);

    // Redo function when button is clicked
    function handleButtonClick(event) {
        const clickedElement = event.target;
        const isAnchor = clickedElement.tagName === 'a' || clickedElement.closest('a') !== null;

        if (isAnchor) {
            setTimeout(addInfo, 100);
        }
    }

    addInfo();

})();
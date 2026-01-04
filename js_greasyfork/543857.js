// ==UserScript==
// @name         Race Collector
// @namespace    heartflower.torn.racing
// @version      1.0.2
// @description  Extracts racing data
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543857/Race%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/543857/Race%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const existingData = localStorage.getItem('racesData');
    let alreadyExtracted = false; // Flag to prevent duplicate logging
    let extractedData = [];

    if (existingData) {
        extractedData = JSON.parse(existingData);
    }

    // Function to extract data
    function extractData() {
        if (!alreadyExtracted) {
            const driversScrollbar = document.getElementById('drivers-scrollbar');

            if (driversScrollbar) {
                const cars = driversScrollbar.querySelectorAll('li.car');
                cars.forEach(car => {
                    const userData = {}; // Object to store user data for each car

                    const carTitle = car.querySelector('img').getAttribute('title');
                    console.log('Car:', carTitle);

                    // Extracting data from the current car's name element
                    const nameElement = car.nextElementSibling;
                    const racingSkillElement = nameElement.querySelector('.rs-display');
                    if (nameElement && nameElement.classList.contains('name') && racingSkillElement) {
                        const nameContent = nameElement.textContent.trim().split(' ');
                        userData.userName = nameContent[0];
                        userData.position = nameContent[1].match(/\d+/)[0];
                        userData.finishTime = nameContent[2];

                        if (! userData.finishTime.includes("crashed")) {
                            userData.lapTime = nameContent[4].split(')')[0];
                        } else {
                            userData.lapTime = "crashed";
                            userData.finishTime = "crashed";
                        }

                        userData.racingSkill = racingSkillElement ? racingSkillElement.textContent.trim().match(/\d+/)[0] : '';
                        userData.userID = car.parentElement.parentElement.getAttribute('id').replace('lbr-','');
                        userData.carUsed = carTitle;
                    }

                    // Extracting event details for the current car
                    const carSelected = document.querySelector('.car-selected.left');
                    const ulElement = carSelected.querySelector('div.cont-black.bottom-round > ul');
                    const listItems = ulElement.querySelectorAll('li');

                    listItems.forEach(item => {
                        const titleElement = item.querySelector('.properties > .title');
                        const titleContent = titleElement.textContent.trim();

                        if (titleContent.startsWith('ID:')) {
                            userData.raceID = parseInt(titleContent.replace('ID:', '').trim());
                        }

                        if (titleContent.startsWith('Name:')) {
                            userData.raceName = titleContent.replace('Name:', '').trim();
                        }
                        if (titleContent.startsWith('Type:')) {
                            userData.eventType = titleContent.replace('Type:','').trim();
                        }
                        if (titleContent.startsWith('Time created:')) {
                            userData.timeCreated = titleContent.replace('Time created:','').trim();
                        }
                        if (titleContent.startsWith('Time started:')) {
                            userData.timeStarted = titleContent.replace('Time started:','').trim();
                        }
                        if (titleContent.startsWith('Time ended:')) {
                            userData.timeEnded = titleContent.replace('Time ended:','').trim();
                        }
                        if (titleContent.startsWith('Track:')) {
                            userData.trackName = titleContent.replace('Track:','').trim();
                        }
                        if (titleContent.startsWith('Laps:')) {
                            userData.lapsAmount = titleContent.replace('Laps:','').trim();
                        }
                        if (titleContent.startsWith('Participants:')) {
                            userData.participantsAmount = titleContent.replace('Participants:','').trim();
                        }
                        if (titleContent.startsWith('Drivers required:')) {
                            userData.driversRequired = titleContent.replace('Drivers required:','').trim();
                        }
                        if (titleContent.startsWith('Maximum Drivers:')) {
                            userData.maximumDrivers = titleContent.replace('Maximum Drivers:','').trim();
                        }
                        if (titleContent.startsWith('Cars allowed:')) {
                            userData.carsAllowed = titleContent.replace('Cars allowed:','').trim();
                        }
                        if (titleContent.startsWith('Upgrades allowed:')) {
                            userData.upgradesAllowed = titleContent.replace('Upgrades allowed:','').trim();
                        }
                        if (titleContent.startsWith('Bet amount:')) {
                            userData.betAmount = titleContent.replace('Bet amount:','').trim();
                        };
                    });

                    extractedData.push(userData); // Push the data for the current car

                });


                console.log(extractedData); // Display all extracted data for each car
                observer.disconnect();
                alreadyExtracted = true;
                localStorage.setItem('racesData', JSON.stringify(extractedData)); // Store data in localStorage

                createDownloadLink();
                createClearLink();
            }
        }
    }

        // Function to clear stored races from localStorage
    function clearStoredRaces() {
        localStorage.removeItem('racesData');
    }

    // Create a link to download the stored races as JSON
    function createDownloadLink() {
        const propertiesWrap = document.querySelector('ul.properties-wrap');
        if (propertiesWrap) {
            const downloadLink = document.createElement('li');
            downloadLink.innerHTML = `
                <li>
                    <div class="properties">
                        <div class="title"><a href="#" id="downloadLink">Download stored races as JSON</a></div>
                        <div class="bar-tpl-wrap active m-top5 m-bottom10"></div>
                        <div class="clear"></div>
                    </div>
                    <div class="t-delimiter"></div>
                    <div class="b-delimiter"></div>
                </li>
            `;
            propertiesWrap.appendChild(downloadLink);

            document.getElementById('downloadLink').addEventListener('click', function(event) {
                event.preventDefault();
                const racesData = localStorage.getItem('racesData');
                if (racesData) {
                    const blob = new Blob([racesData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const timeStamp = Math.round((new Date) / 1000);
                    a.download = 'race-information-' + timeStamp + '.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    clearStoredRaces();
                } else {
                    console.log('No stored races to download.');
                }
            });
        }
    }

    // Function to create a link to clear stored races
    function createClearLink() {
        const propertiesWrap = document.querySelector('ul.properties-wrap');
        if (propertiesWrap) {
            const clearLink = document.createElement('li');
            clearLink.innerHTML = `
                <li>
                    <div class="properties">
                        <div class="title"><a href="#" id="clearLink">Clear stored races</a></div>
                        <div class="bar-tpl-wrap active m-top5 m-bottom10"></div>
                        <div class="clear"></div>
                    </div>
                    <div class="t-delimiter"></div>
                    <div class="b-delimiter"></div>
                </li>
            `;
            propertiesWrap.appendChild(clearLink);

            document.getElementById('clearLink').addEventListener('click', function(event) {
                event.preventDefault();
                clearStoredRaces();
                console.log('Stored races cleared.');
            });
        }
    }


    // Create a MutationObserver to detect changes in the DOM related to span.rs-display
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('rs-display')) {
                        extractData();
                    }
                });
            }
        });
    });

    // Observe changes in the body element or any other parent element where span.rs-display might appear
    const body = document.querySelector('body'); // Change this selector as needed
    if (body) {
        observer.observe(body, { childList: true, subtree: true });
    }
})();
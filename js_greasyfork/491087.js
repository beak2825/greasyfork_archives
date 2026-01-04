// ==UserScript==
// @name         Attacking Extended
// @namespace    heartflower.torn.com
// @version      1.1.2
// @description  Shows hospital time and adds extra attack buttons
// @author       Heartflower [2626587]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491087/Attacking%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/491087/Attacking%20Extended.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HF] Attacking Extended running');

    // Added last action

    // Variable for the end-user to change
    let showRemoveKey = true; // Change 'true' to 'false' if you no longer want the "Remove API key" message to show!

    // Set variables to use later
    let url = new URL(window.location.href);
    let userID = url.searchParams.get("user2ID");
    let userName = 'Unknown';
    let hospitalTimestamp = 0;
    let status = 'Unknown';
    let apiKey = '';
    let selectedAttackInfo = 'Leave';
    let lastAction = 'unknown';

    // Check if the previous attack choice can be found in local storage
    let storedAttackInfo = localStorage.getItem('hf-attack-preference');
    if (storedAttackInfo) {
        selectedAttackInfo = storedAttackInfo;
    }

    function fetchAPIkey() {
        // Fetch API key
        let storedAPIKey = localStorage.getItem('hf-public-apiKey');

        if (storedAPIKey) {
            // API key already entered
            apiKey = storedAPIKey;
            createAPIlink('remove');
            fetchAPI();
            setInterval(fetchAPI, 30000);
        } else {
            // API key not entered yet
            createAPIlink('add');
        }
    }

    function createAPIlink(type) {
        let existingLink = document.body.querySelector('.hf-api-link');
        if (existingLink) {
            existingLink.remove();
        }

        let titleContainer = document.body.querySelector('.titleContainer___QrlWP');
        if (!titleContainer) {
            // If the page hasn't fully loaded in yet, try again in a few
            setTimeout(function() {
                createAPIlink(type);
            }, 100);
            return;
        }

        // Create the link to remove / add API key
        let a = document.createElement('a');
        a.className = 'hf-api-link';
        a.href = '#';
        a.style.marginLeft = '25px';

        if (type === 'remove') {
            if (showRemoveKey === true) {
                a.textContent = 'Remove your public API key!'

                a.addEventListener('click', function() {
                    removeAPIKey();
                });

                titleContainer.appendChild(a);
            }
        } else if (type === 'add') {
            a.textContent = 'Enter your public API key!'

            a.addEventListener('click', function() {
                setAPIkey();
            });

            titleContainer.appendChild(a);
        }
    }

    function setAPIkey() {
        let enterAPIKey = prompt('Enter a public API key here:');

        if (enterAPIKey !== null && enterAPIKey.trim() !== '') {
            localStorage.setItem('hf-public-apiKey', enterAPIKey);
            alert('API key set succesfully');
            createAPIlink('remove');
        } else {
            alert('No valid API key entered!');
        }
    }

    function removeAPIKey() {
        let areYouSure = confirm("Are you sure you want to remove your public API key?");

        // Check the user's response
        if (areYouSure) {
            localStorage.removeItem('hf-public-apiKey');
            alert("API key removed!");
            createAPIlink('add');
        } else {
            alert("API not removed!");
        }
    }

    function observePage() {
        let buttonContainer = document.body.querySelector('.dialogButtons___nX4Bz');
        if (!buttonContainer) {
            // If the attack button hasn't appeared yet, try again
            setTimeout(observePage, 100);
            return;
        }

        // Add CSS stylesheet to use later
        let styleSheet = document.createElement('style');
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet)

        // Copy buttons - once for each weapon
        let button = buttonContainer.querySelector('button');
        copyButton(button, 'primary');
        copyButton(button, 'secondary');
        copyButton(button, 'melee');
        copyButton(button, 'temporary');
        copyButton(button, 'fists');
        copyButton(button, 'kick');

        // Observer to detect removal of the original button
        let buttonRemovalObserver = new MutationObserver(() => {
            if (!document.body.contains(button)) {
                let copiedButtons = document.body.querySelectorAll('.hf-extra-button');
                copiedButtons.forEach(copiedButton => {
                    console.log('[HF-ATTACKING] Removing the button on the weapon ' + copiedButton.className);
                    copiedButton.remove();
                });

                checkForFinishButton(); // Start checking for the finish buttons to appear
                buttonRemovalObserver.disconnect(); // Disconnect the observer
            }
        });
        buttonRemovalObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Copy single button based on weapon
    function copyButton(originalButton, weapon) {
        let weaponList = document.body.querySelector('.weaponList___raakm');
        if (!weaponList) {
            // If the page hasn't fully loaded in yet, try again in a bit
            setTimeout(function() {
                copyButton(originalButton);
            }, 100);
            return;
        }

        let div = document.createElement('div');
        div.className = 'dialogButtons___nX4Bz';

        let button = document.createElement('button');
        button.type = 'submit';
        originalButton.classList.forEach(className => {
            button.classList.add(className);
        });
        button.classList.add('hf-extra-button');
        button.textContent = originalButton.textContent;

        if (originalButton.textContent == 'Hospitalize') {
            button.style.marginLeft = '-6px !important';
        }

        // Add class based on weapon type
        button.classList.add('hf-' + weapon + '-button');

        // How the weapons appear in the code
        let weaponElements = {
            'primary': 'weapon_main',
            'secondary': 'weapon_second',
            'melee': 'weapon_melee',
            'temporary': 'weapon_temp',
            'fists': 'weapon_fists',
            'kick': 'weapon_boots'
        };

        let elementId = weaponElements[weapon];
        if (elementId) {
            let element = document.getElementById(elementId);

            // If the weapon element can't be found, return - e.g. no kick
            if (!element) {
                return;
            }

            element.appendChild(button);
        }

        // If you click the copied button, make sure it clicks the original button for you
        button.addEventListener('click', function() {
            console.log('[HF-ATTACKING] Clicked the button on the weapon ' + weapon);
            originalButton.click();
            event.preventDefault();
        });

        // Create an observer to see if the class 'disabled' gets removed
        let observer = new MutationObserver((mutationsList, observer) => {
            observeClassChanges(originalButton, button, mutationsList, observer);
        });
        observer.observe(originalButton, { attributes: true });

        // Observe changes in textContent
        let observerText = new MutationObserver(() => {
            button.textContent = originalButton.textContent;
        });
        observerText.observe(originalButton, { characterData: true, subtree: true });
    }

    // Observe class changes and update copied button
    function observeClassChanges(originalButton, button, mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let disabled = originalButton.classList.contains('disabled');
                if (disabled) {
                    button.classList.remove('enabled');
                    button.classList.add('disabled');
                } else {
                    button.classList.remove('disabled');
                    button.classList.add('enabled');
                }
            }
        }
    }

    // Fetch status, hospitalTimestamp, userName
    function fetchAPI() {
        let apiUrl = `https://api.torn.com/user/${userID}?selections=profile&key=${apiKey}&comment=TryItPage`;

        // Make the API call
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            status = data.last_action.status;
            hospitalTimestamp = data.states.hospital_timestamp;
            userName = data.name;
            lastAction = data.last_action.relative;
        })
            .catch(error => console.error('[HF-ATTACKING] Error fetching data: ' + error));
    }

    fetchAPI();

    // Update timer
    function updateTimer() {
        let title = document.body.querySelector('.title___rhtB4');
        title.textContent = calculateTimeRemaining(hospitalTimestamp);
        title.classList.add('hf-hospital-timer');
    }

    // Calculate remaining hospital time based on timestamp
    function calculateTimeRemaining() {
        if (status === 'Unknown') {
            return "Unknown";
        }

        let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        let timeDifference = hospitalTimestamp - currentTime;

        if (timeDifference <= 0) {
            return "Out of hospital";
        }

        let days = Math.floor(timeDifference / (24 * 60 * 60));
        let hours = Math.floor((timeDifference % (24 * 60 * 60)) / (60 * 60));
        let minutes = Math.floor((timeDifference % (60 * 60)) / 60);
        let seconds = timeDifference % 60;

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        let remainingTime = '';

        // Days
        if (days > 0) {
            remainingTime += `${days}d `;
        }

        // Hours
        if (hours > 0) {
            remainingTime += `${hours}h `;
        }

        // Minutes
        if (minutes > 0) {
            remainingTime += `${minutes}m `;
        }

        // Seconds
        remainingTime += `${seconds}s`;

        return remainingTime.trim(); // Remove trailing space
    }

    function addStatus() {
        let titleContainer = document.querySelector('.titleContainer___QrlWP');
        if (!titleContainer) {
            // If the page hasn't fully loaded in yet, try again in a bit
            setTimeout(addStatus, 100);
            return;
        }

        let title = titleContainer.querySelector('.title___rhtB4');

        let circle = document.createElement('div');
        circle.id = 'hf-activity-circle';
        circle.style.background = 'purple';

        titleContainer.insertBefore(circle, title);

        setInterval(updateStatus, 100); // Keep updating the status
    }

    function updateStatus() {
        let statusColors = {
            'Unknown': 'purple',
            'Online': 'green',
            'Idle': 'orange',
            'Offline': 'red'
        };

        let circle = document.getElementById('hf-activity-circle');
        let color = statusColors[status];
        circle.style.background = color;
    }

    function createDropdown() {
        let titleContainer = document.body.querySelector('.titleContainer___QrlWP');

        if (!titleContainer) {
            // If the page hasn't fully loaded in yet, try again in a bit
            setTimeout(createDropdown, 100);
            return;
        }

        // Create the dropdown container
        let div = document.createElement('div');
        div.className = 'hf-attack-option';
        div.textContent = 'Attack option:';

        // Create the dropdown
        let dropdown = document.createElement('select');
        dropdown.className = 'hf-attack-dropdown';
        let attackOptions = ['Leave', 'Mug', 'Hospitalize'];

        // Create the dropdown options
        attackOptions.forEach(attackOption => {
            let option = document.createElement('option');
            option.text = attackOption;
            dropdown.add(option);
        });

        // Set the dropdown to the default value as chosen by the user
        dropdown.value = selectedAttackInfo;

        // Append to the document
        div.appendChild(dropdown);
        titleContainer.appendChild(div);

        // Create an eventlistener to see if the dropdown option changes
        dropdown.addEventListener('change', function() {
            let selectedOption = dropdown.options[dropdown.selectedIndex].text;
            selectedAttackInfo = selectedOption;
            localStorage.setItem('hf-attack-preference', selectedOption);
        });
    }

    function displayLastAction(retries = 30) {
        let dialogWrapper = document.body.querySelector('.dialogWrapper___KPjs5');
        if (!dialogWrapper) {
            if (retries > 0) {
                setTimeout(() => displayLastAction(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for dialog wrapper after 30 retries.');
            }
            return;
        }

        let div = document.createElement('div');
        div.classList.add('hf-last-action');
        div.textContent = `Last action: ${lastAction}`;

        dialogWrapper.appendChild(div);

        setInterval(function () {
            updateLastAction(div);
        }, 100);
    }

    function updateLastAction(div) {
        div.textContent = `Last action: ${lastAction}`;
    }

    // This function is called when the attack button is removed from the page
    function checkForFinishButton() {
        let targetButtons = document.body.querySelectorAll('.btn___RxE8_[type="submit"]');

        if (!targetButtons || targetButtons.length < 3) {
            // Finish buttons have not appeared yet, try again
            setTimeout(checkForFinishButton, 100);
            return;
        }

        // Coppy the buttons based on the selected info
        targetButtons.forEach(button => {
            console.log('[HF-ATTACKING] Finish button found for ' + button.textContent);
            if (button.textContent.trim() === selectedAttackInfo.toLowerCase()) {
                copyButton(button, 'primary');
                copyButton(button, 'secondary');
                copyButton(button, 'melee');
                copyButton(button, 'temporary');
                copyButton(button, 'fists');
                copyButton(button, 'kick');
            }
        });
    }

    /*
    CSS - You can change the positions here should it be necessary
    -> Top: 100px is lower than top: 10px
    -> Height: 100px is longer than height: 10px
    -> It will not go out of the container - for full primary/secondary/melee button on my PC, these values work:
       top: -8px !important;
       height: 96px !important;
    -> If you need help, don't hesitate to reach out to Heartflower!
    */
    let styles = `
        .titleContainer___QrlWP {
            justify-content: flex-start !important;
        }

        .hf-hospital-timer {
            line-height: 19px !important;
        }

        #hf-activity-circle {
            width: 25px;
            height: 25px;
            border-radius: 50px;
            margin-right: 5px;
        }

        .hf-attack-option {
            margin-left: 25px;
        }

        .hf-attack-dropdown {
            margin-left: 5px;
            font-size: inherit;
        }

        .hf-extra-button {
            position: absolute !important;
            width: 100% !important;
            line-height: normal !important;
        }

        .hf-primary-button, .hf-secondary-button, .hf-melee-button {
            top: 18px !important;
            height: 54px !important;
        }

        .hf-temporary-button {
            top: 8px !important;
            height: 64px !important;
        }

        .hf-fists-button, .hf-kick-button {
            top: -8px !important;
            height: 47px !important;
            font-size: smaller !important;
        }

        .hf-last-action {
          padding: 10px 0px;
          justify-self: center;
          padding-left: 5px;
        }

        @media only screen and (max-width: 785px) {
            #hf-activity-circle {
                width: 20px !important;
                height: 20px !important;
            }
        }

        @media only screen and (max-width: 600px) {
            .hf-primary-button, .hf-secondary-button {
                line-height: 13px !important;
                height: 31px !important;
            }

            .hf-melee-button {
                height: 45px !important;
            }

            .hf-temporary-button {
                top: 0px !important;
                height: 64px !important;
            }

            .hf-fists-button, .hf-kick-button {
                top: 0px !important;
                height: 64px !important;
            }
        }
    `

    // Run script upon page start
    observePage(); // Add CSS, copy buttons etc
    addStatus(); // Add the status circle
    setInterval(updateTimer, 100); // Set interval to update hospital timer
    createDropdown(); // Create 'Leave'/'Mug'/'Hospitalize' dropdown
    fetchAPIkey(); // Start script upon opening the page
    displayLastAction();
})();
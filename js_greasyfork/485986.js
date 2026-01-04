// ==UserScript==
// @name         Highlight Medical Items
// @namespace    heartflower.torn.com
// @version      5.3.1
// @description  Highlights medical items in inventory based on life and hospital time.
// @author       Heartflower [2626587]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/485986/Highlight%20Medical%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/485986/Highlight%20Medical%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let useApiKey = true;

    let showRemoveApiKey = false;
    let showChangeBloodType = false;
    let showPerksChange = true;

    const consoleComment = '[Highlight Medical Items] ';

    let lastChecked = localStorage.getItem('lastChecked') || 'unknown';
    let lastCheckedLife = localStorage.getItem('lastCheckedLife') || 'unknown';
    let lastCheckedTime = localStorage.getItem('lastCheckedTime') || 'unknown';

    let hospitalTime = '00:00:00';

    if (useApiKey == true) {
        hospitalTime = localStorage.getItem('hospitalTime') || '00:00:00';
    } else if (useApiKey == false) {
        let hospitalObject = localStorage.getItem('hospitalTimeObject');

        console.log('hospitalobject');

        if (hospitalObject) {
            console.log('object');
            hospitalObject = JSON.parse(hospitalObject);

            if (isTimestampOlderThanFiveMinutes(hospitalObject.timestamp)) {
                localStorage.removeItem('hospitalTimeObject');
            } else {
                hospitalTime = hospitalObject.time;
            }
        }

    }

    let currentMedicalCooldown = '00:00:00';
    let maximumMedicalCooldown = '06:00:00';

    let maximumLife = 0;
    let currentLife = 0;

    if (useApiKey == true) {
        maximumLife = localStorage.getItem('maximumLife') || 0;
        currentLife = localStorage.getItem('currentlife') || 0;
    } else if (useApiKey == false) {
        let currentLifeObject = localStorage.getItem('currentLifeObject');

        if (currentLifeObject) {
            currentLifeObject = JSON.parse(currentLifeObject);

            if (isTimestampOlderThanFiveMinutes(currentLifeObject.timestamp)) {
                localStorage.removeItem('currentLifeObject');
            } else {
                currentLife = currentLifeObject.time;
            }
        }

        let maximumLifeObject = localStorage.getItem('maximumLifeObject');

        if (maximumLifeObject) {
            maximumLifeObject = JSON.parse(maximumLifeObject);

            if (isTimestampOlderThanFiveMinutes(maximumLifeObject.timestamp)) {
                localStorage.removeItem('maximumLifeObject');
            } else {
                maximumLife = maximumLifeObject.time;
            }
        }
    }

    let bestItemForTime = '';
    let bestItemForLife = '';

    const bloodType = localStorage.getItem('bloodType');

    const backgroundForLife = 'linear-gradient(to right, rgba(63, 67, 207, 0.5)  50%, rgba(63, 67, 207, 0) 100%)';
    const backgroundForTime = 'linear-gradient(to right, rgba(195, 64, 21, 0.5) 50%, rgba(195,64,21,0) 100%)';
    const backgroundForBoth = 'linear-gradient(to right, rgba(129, 66, 114, 0.5) 50%, rgba(129, 66, 114, 0) 100%)';

    const colorForLife = 'rgba(63, 67, 207, 0.5)';
    const colorForTime = 'rgba(195, 64, 21, 0.5)';
    const colorForBoth = 'rgba(129, 66, 114, 0.5)';

    const simpleColorForLife = 'blue';
    const simpleColorForTime = 'red';
    const simpleColorForBoth = 'purple';

    let perksEffectiveness = localStorage.getItem('medicalEffectivenessPerks');

    console.log('perks:' + perksEffectiveness);

    const apiKey = localStorage.getItem('medicalHighlighterKey');

    if (useApiKey == false) {
        checkInterval();
    };

    if (!apiKey) {
        if (useApiKey == true) {
            setTimeout(apiKeyNotFound, 1000);
        }
    } else if (apiKey) {
        if (useApiKey == true) {
            if (window.location.href === 'https://www.torn.com/item.php' || window.location.href.includes('https://www.torn.com/factions.php')) {
                console.log(consoleComment + 'On items page');

                if (showRemoveApiKey == true) {
                    setTimeout(removeApiKeyDiv, 1000);
                }

                setTimeout(fetchProfileData, 100);
                setInterval(fetchProfileData, 30000);
                setInterval(calculateBestItem, 1000);
                fetchPerkData();
            }
        }
    }

    function apiKeyNotFound() {
        console.log(consoleComment + 'API key not found');
        let keyNotFoundElement = document.getElementById('MedicalHighlighterAPI');

        if (keyNotFoundElement) {
            keyNotFoundElement.remove();
        }

        // Find the div with class "title-black"
        let titleBlackDiv = document.querySelector('div.title-black');

        if (window.location.href.includes('https://www.torn.com/factions.php')) {
            titleBlackDiv = document.getElementById('faction-armoury-tabs');
            console.log('Title black div');
            console.log(titleBlackDiv);
        }

        // Check if the element is found
        if (titleBlackDiv) {
            // Create a span element
            let newDivElement = document.createElement('div');
            newDivElement.id = 'MedicalHighlighterAPI';
            newDivElement.className = 'title-black';
            newDivElement.innerHTML = `The "Highlight Medical Items" script needs <a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=Highlight%20Medical%20Items&user=perks,profile,timestamp">a minimal API key</a> to work flawlessly. Optionally, you can choose to ignore this message and use the script without an API key. Enter your API key `;
            newDivElement.style.color = 'var(--tutorial-title-color)';
            newDivElement.style.fontWeight = 'normal';
            newDivElement.style.background = simpleColorForBoth;
            newDivElement.style.background = colorForBoth;
            newDivElement.style.background = backgroundForBoth;
            newDivElement.style.height = 'fit-content';
            newDivElement.style.lineHeight = '1.5';
            newDivElement.style.padding = '6px 10px';

            GM.addStyle (`#factionQuickItems + #MedicalHighlighterAPI { margin-top: 10px }`)

            const apiKeyLink = document.createElement('a');
            apiKeyLink.href = 'javascript:void(0);';
            apiKeyLink.textContent = 'here';
            apiKeyLink.onclick = promptForAPIKey;

            // Append the anchor element to the div
            newDivElement.appendChild(apiKeyLink);

            let parentElement = titleBlackDiv.parentNode;

            // Check if the parent has more than one child
            if (parentElement.children.length > 1) {
                // Insert the new div as the second child
                parentElement.insertBefore(newDivElement, parentElement.children[1]);
            } else {
                // If there is only one child, simply append the new div
                parentElement.appendChild(newDivElement);
            }
        }
    }

    function removeApiKey() {
        localStorage.removeItem('medicalHighlighterKey');
    }

    function removeApiKeyDiv() {
        // Find the div with class "title-black"
        let titleBlackDiv = document.querySelector('div.title-black');

        if (window.location.href.includes('https://www.torn.com/factions.php')) {
            titleBlackDiv = document.getElementById('faction-armoury-tabs');
            console.log('Title black div');
            console.log(titleBlackDiv);
        }

        // Check if the element is found
        if (titleBlackDiv) {
            // Create a span element
            let newDivElement = document.createElement('div');
            newDivElement.id = 'MedicalHighlighterRemoveAPI';
            newDivElement.className = 'title-black';
            newDivElement.innerHTML = `Remove your API key for the "Highlight Medical Items" script `;
            newDivElement.style.color = 'var(--tutorial-title-color)';
            newDivElement.style.fontWeight = 'normal';
            newDivElement.style.background = simpleColorForBoth;
            newDivElement.style.background = colorForBoth;
            newDivElement.style.background = backgroundForBoth;
            newDivElement.style.height = 'fit-content';
            newDivElement.style.lineHeight = '1.5';
            newDivElement.style.padding = '6px 10px';

            GM.addStyle (`#factionQuickItems + #MedicalHighlighterRemoveAPI { margin-top: 10px }`)

            const apiKeyLink = document.createElement('a');
            apiKeyLink.href = 'javascript:void(0);';
            apiKeyLink.textContent = 'here';
            apiKeyLink.onclick = removeApiKey;

            // Append the anchor element to the div
            newDivElement.appendChild(apiKeyLink);

            let parentElement = titleBlackDiv.parentNode;

            // Check if the parent has more than one child
            if (parentElement.children.length > 1) {
                // Insert the new div as the second child
                parentElement.insertBefore(newDivElement, parentElement.children[1]);
            } else {
                // If there is only one child, simply append the new div
                parentElement.appendChild(newDivElement);
            }
        }
    }

    function bloodTypeNotFound() {
        console.log(consoleComment + 'Blood bag type not found');

        let existingBloodTypeDiv = document.getElementById('MedicalHighlighterBloodType');

        if (existingBloodTypeDiv) {
            existingBloodTypeDiv.remove();
        }

        // Find the div with class "title-black"
        let titleBlackDiv = document.querySelector('div.title-black');

        if (window.location.href.includes('https://www.torn.com/factions.php')) {
            titleBlackDiv = document.getElementById('faction-armoury-tabs');
            console.log('Title black div');
            console.log(titleBlackDiv);
        }

        // Check if the element is found
        if (titleBlackDiv) {
            // Create a span element
            let newDivElement = document.createElement('div');
            newDivElement.id = 'MedicalHighlighterBloodType';
            newDivElement.className = 'title-black';
            newDivElement.innerHTML = `Enter your blood type for the "Highlight Medical Items" script `;
            newDivElement.style.color = 'var(--tutorial-title-color)';
            newDivElement.style.fontWeight = 'normal';
            newDivElement.style.background = simpleColorForBoth;
            newDivElement.style.background = colorForBoth;
            newDivElement.style.background = backgroundForBoth;
            newDivElement.style.height = 'fit-content';
            newDivElement.style.lineHeight = '1.5';
            newDivElement.style.padding = '6px 10px';

            GM.addStyle (`#factionQuickItems + #MedicalHighlighterBloodType { margin-top: 10px }`)

            const link = document.createElement('a');
            link.href = 'javascript:void(0);';
            link.textContent = 'here';
            link.onclick = modalForBloodType;

            // Append the anchor element to the div
            newDivElement.appendChild(link);

            let parentElement = titleBlackDiv.parentNode;

            console.log(parentElement);

            console.log(newDivElement);

            // Check if the parent has more than one child
            if (parentElement.children.length > 1) {
                // Insert the new div as the second child
                parentElement.insertBefore(newDivElement, parentElement.children[1]);
                console.log(consoleComment + 'Appended 1');
            } else {
                // If there is only one child, simply append the new div
                parentElement.appendChild(newDivElement);
            }
        }
    }

    function changeBloodType() {
        console.log(consoleComment + 'Changing blood bag type');

        let existingBloodTypeDiv = document.getElementById('MedicalHighlighterChangeBloodType');

        if (existingBloodTypeDiv) {
            existingBloodTypeDiv.remove();
        }

        let titleBlackDiv = document.querySelector('div.title-black');

        if (window.location.href.includes('https://www.torn.com/factions.php')) {
            titleBlackDiv = document.getElementById('faction-armoury-tabs');
            console.log('Title black div');
            console.log(titleBlackDiv);
        }

        // Check if the element is found
        if (titleBlackDiv) {
            // Create a span element
            let newDivElement = document.createElement('div');
            newDivElement.id = 'MedicalHighlighterChangeBloodType';
            newDivElement.className = 'title-black';
            newDivElement.innerHTML = `Change your blood type for the "Highlight Medical Items" script `;
            newDivElement.style.color = 'var(--tutorial-title-color)';
            newDivElement.style.fontWeight = 'normal';
            newDivElement.style.background = simpleColorForBoth;
            newDivElement.style.background = colorForBoth;
            newDivElement.style.background = backgroundForBoth;
            newDivElement.style.height = 'fit-content';
            newDivElement.style.lineHeight = '1.5';
            newDivElement.style.padding = '6px 10px';

            GM.addStyle (`#factionQuickItems + #MedicalHighlighterChangeBloodType { margin-top: 10px }`)

            const link = document.createElement('a');
            link.href = 'javascript:void(0);';
            link.textContent = 'here';
            link.onclick = modalForBloodType;

            // Append the anchor element to the div
            newDivElement.appendChild(link);

            let parentElement = titleBlackDiv.parentNode;

            // Check if the parent has more than one child
            if (parentElement.children.length > 1) {
                // Insert the new div as the second child
                parentElement.insertBefore(newDivElement, parentElement.children[1]);
            } else {
                // If there is only one child, simply append the new div
                parentElement.appendChild(newDivElement);
            }


        }
    }

    function modalForBloodType() {
        // Create modal
        let modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.padding = '20px';
        modal.style.backgroundColor = 'rgb(255 255 255 / 70%)';
        modal.style.border = '2px solid black';
        modal.style.zIndex = '9999';

        // Title
        let titleContainer = document.createElement('div');
        titleContainer.textContent = 'Select your blood type';
        titleContainer.style.color = 'black';
        titleContainer.style.fontSize = '20px';
        titleContainer.style.fontWeight = 'bolder';
        titleContainer.style.paddingBottom = '12px';
        modal.appendChild(titleContainer);

        // Dropdown
        let dropdown = document.createElement('select');
        dropdown.style.width = '100%';
        dropdown.style.padding = '8px';
        dropdown.style.border = '1px solid';
        dropdown.innerHTML = `<option value="O-">O-</option><option value="O+">O+</option><option value="B-">B-</option><option value="B+">B+</option><option value="A-">A-</option><option value="A+">A+</option><option value="AB-">AB-</option><option value="AB+">AB+</option>`;
        modal.appendChild(dropdown);

        // Buttons
        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.paddingTop = '15px';
        modal.appendChild(buttonContainer);

        let cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.color = 'black';
        cancelButton.style.border = '1px solid black';
        cancelButton.style.padding = '4px';
        cancelButton.style.backgroundColor = 'white';
        cancelButton.addEventListener('click', function () {
            modal.style.display = 'none';
        });
        buttonContainer.appendChild(cancelButton);

        // Add hover effect
        cancelButton.style.cursor = 'pointer';
        cancelButton.addEventListener('mouseover', function () {
            cancelButton.style.fontWeight = 'bold';
        });
        cancelButton.addEventListener('mouseout', function () {
            cancelButton.style.fontWeight = '';
        });

        let doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.style.color = 'black';
        doneButton.style.border = '1px solid black';
        doneButton.style.padding = '4px';
        doneButton.style.backgroundColor = 'white';
        doneButton.addEventListener('click', function () {
            let selectedValue = dropdown.value;
            localStorage.setItem('bloodType', selectedValue);
            modal.style.display = 'none';
        });
        buttonContainer.appendChild(doneButton);

        // Add hover effect
        doneButton.style.cursor = 'pointer';
        doneButton.addEventListener('mouseover', function () {
            doneButton.style.fontWeight = 'bold';
        });
        doneButton.addEventListener('mouseout', function () {
            doneButton.style.fontWeight = '';
        });

        // Append modal to the body
        document.body.appendChild(modal);
    }

    // Function to prompt user for API key
    function promptForAPIKey() {
        const apiKey = prompt('Please enter your API key:');
        if (apiKey !== null) {
            // Check if the user clicked Cancel
            // If not, store the API key in localStorage
            localStorage.setItem('medicalHighlighterKey', apiKey);
            alert('API key set successfully!');
        }
    }

    function itemNotFound(type, itemName, background) {
        let splitItemName = encodeURIComponent(itemName).replace(/%2B/g, '+').replace(/%20/g, '+');
        let url = `https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=${splitItemName}`;

        let itemNotFoundElement = document.getElementById('MedicalHighlighter ' + itemName);

        if (itemNotFoundElement) {
            itemNotFoundElement.remove();
        }

        let color = '';
        let simpleColor = '';

        if (background === backgroundForLife) {
            color = colorForLife;
            simpleColor = simpleColorForLife
        } else if (background === backgroundForTime) {
            color = colorForTime;
            simpleColor = simpleColorForTime;
        } else if (background === backgroundForBoth) {
            color = colorForBoth;
            simpleColor = simpleColorForBoth;
        }

        // Find the div with class "title-black"
        let titleBlackDiv = document.querySelector('div.title-black');

        if (window.location.href.includes('https://www.torn.com/factions.php')) {
            titleBlackDiv = document.getElementById('faction-armoury-tabs');
            console.log('Title black div');
            console.log(titleBlackDiv);
        }

        // Check if the element is found
        if (titleBlackDiv) {
            // Create a span element
            let newDivElement = document.createElement('div');
            newDivElement.id = 'MedicalHighlighter ' + itemName;
            newDivElement.className = 'title-black';

            if (window.location.href === 'https://www.torn.com/item.php') {
                checkCategory();
            } else if (window.location.href.includes('https://www.torn.com/factions.php')) {
                checkArmory();
            }

            if (window.location.href === 'https://www.torn.com/item.php') {
                if (itemName.includes('Blood Bag')) {
                    newDivElement.innerHTML = `The ideal item for ${type} is ${itemName}. Unfortunately, this is not in your inventory. <a href=${url}>Buy one from the market</a> or <a href="https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=medical">loan one from the armory</a>. If you don't have the <a href="https://www.torn.com/page.php?sid=education&category=4&course=127">Intravenous Education</a> yet, it's best to opt for a Morphine instead.`;
                } else {
                    newDivElement.innerHTML = `The ideal item for ${type} is ${itemName}. Unfortunately, this is not in your inventory. <a href=${url}>Buy one from the market</a> or <a href="https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=medical">loan one from the armory</a>.`;
                }
            } else if (window.location.href.includes('https://www.torn.com/factions.php')) {
                if (itemName.includes('Blood Bag')) {
                    newDivElement.innerHTML = `The ideal item for ${type} is ${itemName}. Unfortunately, this is not in the faction's armory. <a href=${url}>Buy one from the market</a> or ask a faction friend to donate one. If you don't have the <a href="https://www.torn.com/page.php?sid=education&category=4&course=127">Intravenous Education</a> yet, it's best to opt for a Morphine instead.`;
                } else {
                    newDivElement.innerHTML = `The ideal item for ${type} is ${itemName}. Unfortunately, this is not in the faction's armory. <a href=${url}>Buy one from the market</a> or ask a faction friend to donate one.`;
                }
            }

            newDivElement.style.color = 'var(--tutorial-title-color)';
            newDivElement.style.fontWeight = 'normal';
            newDivElement.style.background = simpleColor;
            newDivElement.style.background = color;
            newDivElement.style.background = background;
            newDivElement.style.height = 'fit-content';
            newDivElement.style.lineHeight = '1.5';
            newDivElement.style.padding = '6px 10px';

            GM.addStyle (`#factionQuickItems + #MedicalHighlighter ` + itemName + ` { margin-top: 10px }`)


            let parentElement = titleBlackDiv.parentNode;

            // Check if the parent has more than one child
            if (parentElement.children.length > 1) {
                // Insert the new div as the second child
                parentElement.insertBefore(newDivElement, parentElement.children[1]);
            } else {
                // If there is only one child, simply append the new div
                parentElement.appendChild(newDivElement);
            }
        }
    }

    function popupForSteps(type, items) {
        // Create an object to store the counts
        let counts = {};

        // Count the occurrences of each item
        for (let item of items) {
            counts[item] = (counts[item] || 0) + 1;
        }

        // Convert the counts object into an array of objects
        let itemsArray = Object.entries(counts).map(([name, amount]) => ({ name, amount }));

        let gradientBackground = '';
        let rgbaBackground = '';
        let textBackground = '';
        let text = '';

        if (type == 'life') {
            gradientBackground = backgroundForLife;
            rgbaBackground = colorForLife;
            textBackground = simpleColorForLife;
            text = 'In order to fill your life as efficient as possible, take ';
        } else if (type == 'time') {
            gradientBackground = backgroundForTime;
            rgbaBackground = colorForTime;
            textBackground = simpleColorForTime;
            text = 'In order to get out of the hospital as efficient as possible, take ';
        };

        let existingDiv = document.querySelector('.itemsMessageDiv' + type);

        if (existingDiv) {
            existingDiv.remove();
        }

        // Create the main container div
        let infoMsgDiv = document.createElement('div');
        infoMsgDiv.className = 'info-msg-cont border-round m-top10 itemsMessageDiv' + type;
        infoMsgDiv.style.background = textBackground;
        infoMsgDiv.style.background = rgbaBackground;
        infoMsgDiv.style.background = gradientBackground;
        infoMsgDiv.style.marginBottom = '10px';

        // Create the inner div for the message content
        let innerDiv = document.createElement('div');
        innerDiv.className = 'info-msg border-round';

        // Create the icon element
        let iconElement = document.createElement('i');
        iconElement.className = 'hospital-info-icon';
        iconElement.style.margin = '9px 11px 0 10px';
        iconElement.style.display = 'inline-block';
        iconElement.style.height = '18px';
        iconElement.style.width = '10px';

        // Encode the SVG data
        let svgData = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18"><polygon points="6 1 6 7 0 7 0 11 6 11 6 17 10 17 10 11 16 11 16 7 10 7 10 1 6 1" fill="white"/></svg>');

        // Set the background property using backgroundImage
        iconElement.style.backgroundImage = `url('data:image/svg+xml;utf8,${svgData}')`;
        iconElement.style.backgroundPosition = '0px 4px';
        iconElement.style.backgroundRepeat = 'no-repeat';

        // Create the message container div
        let msgContainer = document.createElement('div');
        msgContainer.className = 'delimiter';

        // Create the message element
        let messageElement = document.createElement('div');
        messageElement.id = 'itemsMessageElement';
        messageElement.className = 'msg right-round itemsMessageElement';
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'assertive');
        messageElement.style.background = textBackground;
        messageElement.style.background = rgbaBackground;
        messageElement.style.background = gradientBackground;

        let textElement = document.createElement('div');
        textElement.id = 'textElement';
        textElement.className = 'itemsTextElement';
        let itemsText = itemsArray.map(({ name, amount }) => `${amount} ${name}${amount > 1 ? 's' : ''}`).join(' and ');
        let date = 'Unknown';

        if (useApiKey == true) {
            date = ' (API last called: ' + lastChecked + ')';
        } else if (useApiKey == false) {
            if (type == 'life') {
                date = ' (Life bar last fetched: ' + lastCheckedLife + ')';
            } else if (type == 'time') {
                date = ' (Hospital time last fetched: ' + lastCheckedTime + ')';
            }
        }

        textElement.textContent = text + itemsText + date;
        textElement.style.color = 'var(--default-color)';
        messageElement.appendChild(textElement);

        // Append elements to construct the message structure
        msgContainer.appendChild(messageElement);
        innerDiv.appendChild(iconElement);
        innerDiv.appendChild(msgContainer);
        infoMsgDiv.appendChild(innerDiv);

        // Get the reference element after which the new div should be inserted
        let referenceElement = document.querySelector('.content-title.m-bottom10');

        // Insert the new div after the reference element
        referenceElement.parentNode.insertBefore(infoMsgDiv, referenceElement.nextSibling);
    }

    // Function to calculate the best item to use
    function calculateBestItem() {
        // Blood Bag = 30 minutes; base 120 minutes hosp time, 30% life
        // Morphine = 20 minutes; base 70 minutes hosp time, 15% life
        // First Aid Kit = 15 minutes; base 40 minutes hosp time, 10% life
        // Small First Aid kit = 10 minutes; base 20 minutes hosp time, 5% life
        // Perks: perksEffectiveness = % amount
        // Formula: ((basepercentage * maxLife) + (perksEffectivenesspercentage x (basepercentage * maxLife))

        // Based on life
        let neededLife = maximumLife - currentLife;

        let bloodBagLife = (0.3 * maximumLife) + ((perksEffectiveness / 100) * (0.3 * maximumLife));
        let morphineLife = (0.15 * maximumLife) + ((perksEffectiveness / 100) * (0.15 * maximumLife));
        let firstAidKitLife = (0.1 * maximumLife) + ((perksEffectiveness / 100) * (0.1 * maximumLife));
        let smallFirstAidKitLife = (0.05 * maximumLife) + ((perksEffectiveness / 100) * (0.05 * maximumLife));

        let items = '';

        if (neededLife == 0) {
            let existingDiv = document.querySelector('.itemsMessageDivlife');

            if (existingDiv) {
                existingDiv.remove();
            }
        } else if (neededLife <= smallFirstAidKitLife) {
            bestItemForLife = 'Small First Aid Kit';
            items = ['Small First Aid Kit'];
            popupForSteps('life', items);
        } else if (neededLife <= firstAidKitLife) {
            bestItemForLife = 'First Aid Kit';
            items = ['First Aid Kit'];
            popupForSteps('life', items);
        } else if (neededLife <= morphineLife) {
            bestItemForLife = 'Morphine';
            items = ['Morphine'];
            popupForSteps('life', items);
        } else if (neededLife <= bloodBagLife) {
            bestItemForLife = 'Blood Bag'
            items = ['Blood Bag'];
            popupForSteps('life', items);
        } else if (neededLife > bloodBagLife) {
            bestItemForLife = 'Blood Bag';
            let remainingLife = neededLife - bloodBagLife;
            if (remainingLife <= smallFirstAidKitLife) {
                // BB + SFAK
                items = ['Blood Bag', 'Small First Aid Kit'];
                popupForSteps('life', items);
            } else if (remainingLife <= firstAidKitLife) {
                // BB + FAK
                items = ['Blood Bag', 'First Aid Kit'];
                popupForSteps('life', items);
            } else if (remainingLife <= morphineLife) {
                // BB + MORPH
                items = ['Blood Bag', 'Morphine'];
                popupForSteps('life', items);
            } else if (remainingLife <= bloodBagLife) {
                // BB + BB
                items = ['Blood Bag', 'Blood Bag'];
                popupForSteps('life', items);
            } else if (remainingLife > bloodBagLife) {
                remainingLife = remainingLife - bloodBagLife;
                if (remainingLife <= smallFirstAidKitLife) {
                    // BB + BB + SFAK
                    items = ['Blood Bag', 'Blood Bag', 'Small First Aid Kit'];
                    popupForSteps('life', items);
                } else if (remainingLife <= firstAidKitLife) {
                    // BB + BB + FAK
                    items = ['Blood Bag', 'Blood Bag', 'First Aid Kit'];
                    popupForSteps('life', items);
                } else if (remainingLife <= morphineLife) {
                    // BB + BB + MORPH
                    items = ['Blood Bag', 'Blood Bag', 'Morphine'];
                    popupForSteps('life', items);
                } else if (remainingLife <= bloodBagLife) {
                    // BB + BB + BB
                    items = ['Blood Bag', 'Blood Bag', 'Blood Bag'];
                    popupForSteps('life', items);
                } else if (remainingLife > bloodBagLife) {
                    remainingLife = remainingLife - bloodBagLife;
                    if (remainingLife <= smallFirstAidKitLife) {
                        // BB + BB + BB + SFAK
                        items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'Small First Aid Kit'];
                        popupForSteps('life', items);
                    } else if (remainingLife <= firstAidKitLife) {
                        // BB + BB + BB + FAK
                        items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'First Aid Kit'];
                        popupForSteps('life', items);
                    } else if (remainingLife <= morphineLife) {
                        // BB + BB + BB + MORPH
                        items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'Morphine'];
                        popupForSteps('life', items);
                    } else if (remainingLife <= bloodBagLife) {
                        // BB + BB + BB + BB
                        items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'Blood Bag'];
                        popupForSteps('life', items);
                    } else if (remainingLife > bloodBagLife) {
                        // BB + BB + BB + BB
                        items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'Blood Bag'];
                        popupForSteps('life', items);
                    }

                }
            }
        }

        // Based on time
        // 120 minutes hosp time = blood bag (30 min med cd)
        // 70 minutes hosp time = morphine (20 min med cd)
        // 40 minutes hosp time = first aid kit (15 min med cd)
        // 20 minutes hosp time = small first aid kit
        // Formula: (base minutes) * (1 + percentage)

        let bloodBagTime = 120 * (1 + (perksEffectiveness / 100));
        let morphineTime = 70 * (1 + (perksEffectiveness / 100));
        let firstAidKitTime = 40 * (1 + (perksEffectiveness / 100));
        let smallFirstAidKitTime = 20 * (1 + (perksEffectiveness / 100));

        let hospitalTimeMinutes = timeToMinutes(hospitalTime);

        if (hospitalTimeMinutes == 0) {
            let existingDiv = document.querySelector('.itemsMessageDivtime');

            if (existingDiv) {
                existingDiv.remove();
            }
        } else if (hospitalTimeMinutes <= smallFirstAidKitTime) {
            bestItemForTime = 'Small First Aid Kit';
            items = ['Small First Aid Kit'];
            popupForSteps('time', items);
        } else if (hospitalTimeMinutes <= firstAidKitTime) {
            bestItemForTime = 'First Aid Kit';
            items = ['First Aid Kit'];
            popupForSteps('time', items);
        } else if (hospitalTimeMinutes <= morphineTime) {
            bestItemForTime = 'Morphine';
            items = ['Morphine'];
            popupForSteps('time', items);
        } else if (hospitalTimeMinutes <= bloodBagTime) {
            bestItemForTime = 'Blood Bag';
            items = ['Blood Bag'];
            popupForSteps('time', items);
        } else if (hospitalTimeMinutes > bloodBagTime) {
            bestItemForTime = 'Blood Bag';
            let remainingTime = hospitalTimeMinutes - bloodBagTime;
            if (remainingTime <= smallFirstAidKitLife) {
                // BB + BB + SFAK
                items = ['Blood Bag', 'Blood Bag', 'Small First Aid Kit'];
                popupForSteps('time', items);
            } else if (remainingTime <= firstAidKitLife) {
                // BB + BB + FAK
                items = ['Blood Bag', 'Blood Bag', 'First Aid Kit'];
                popupForSteps('time', items);
            } else if (remainingTime <= morphineLife) {
                // BB + BB + MORPH
                items = ['Blood Bag', 'Blood Bag', 'Morphine'];
                popupForSteps('time', items);
            } else if (remainingTime <= bloodBagLife) {
                // BB + BB + BB
                items = ['Blood Bag', 'Blood Bag', 'Blood Bag'];
                popupForSteps('time', items);
            } else if (remainingTime > bloodBagLife) {
                remainingTime = remainingTime - bloodBagLife;
                if (remainingTime <= smallFirstAidKitLife) {
                    // BB + BB + BB + SFAK
                    items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'Small First Aid Kit'];
                    popupForSteps('time', items);
                } else if (remainingTime <= firstAidKitLife) {
                    // BB + BB + BB + FAK
                    items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'First Aid Kit'];
                    popupForSteps('time', items);
                } else if (remainingTime <= morphineLife) {
                    // BB + BB + BB + MORPH
                    items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'Morphine'];
                    popupForSteps('time', items);
                } else if (remainingTime <= bloodBagLife) {
                    // BB + BB + BB + BB
                    items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'Blood Bag'];
                    popupForSteps('time', items);
                } else if (remainingTime > bloodBagLife) {
                    // BB + BB + BB + BB
                    items = ['Blood Bag', 'Blood Bag', 'Blood Bag', 'Blood Bag'];
                    popupForSteps('time', items);
                }
            }
        }

        if (window.location.href === 'https://www.torn.com/item.php') {
            checkCategory();
        } else if (window.location.href.includes('https://www.torn.com/factions.php')) {
            checkArmory();
        }
    }

    // Function to convert hh:mm:ss to minutes
    function timeToMinutes(time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 60 + minutes + seconds / 60;
    }

    // Function to format seconds into hh:mm:ss
    function formatTime(seconds) {
        let hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
        let minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        let remainingSeconds = (seconds % 60).toString().padStart(2, '0');
        return hours + ':' + minutes + ':' + remainingSeconds;
    }

    // Function to calculate the time difference
    function calculateTimeDifference(timestamp) {
        // Get the current timestamp in seconds
        let currentTimestamp = Math.floor(Date.now() / 1000);

        // Calculate the difference
        let difference = timestamp - currentTimestamp;

        // Return the difference in seconds
        return difference;
    }

    function checkArmory() {
        let armoryWrap = document.querySelector('.faction-armoury');

        let itemNames = [];

        if (armoryWrap) {
            let medicalCategory = armoryWrap.querySelector('#armoury-medical');

            if (medicalCategory) {
                let medicalItemsUl = medicalCategory.querySelector('ul.item-list');

                if (medicalItemsUl) {

                    if (!bloodType) {
                        console.log('no blood type');
                        bloodTypeNotFound();
                    } else if (bloodType && showChangeBloodType == true) {
                        changeBloodType();
                    }

                    let medicalItemsList = medicalItemsUl.querySelectorAll('li');
                    medicalItemsList.forEach(function(li) {
                        let itemName = li.querySelector('.name');
                        if (itemName) {
                            let trimmedName = itemName.textContent.trim();

                            let itemNameParts = trimmedName.split('x');
                            let itemNameWithoutQty = itemNameParts[0].trim();

                            highlightItems(itemNameWithoutQty, li);
                            itemNames.push(itemNameWithoutQty);
                        }
                    });

                    if (bestItemForLife == 'Blood Bag' && !itemNames.includes('Blood Bag : ' + bloodType)) {
                        let item = 'Blood Bag : ' + bloodType;
                        itemNotFound('life', item, backgroundForLife);
                    } else if (bestItemForLife == 'Morphine' && !itemNames.includes('Morphine')) {
                        itemNotFound('life', 'Morphine', backgroundForLife);
                    } else if (bestItemForLife == 'First Aid Kit' && !itemNames.includes('First Aid Kit') && itemNames.includes('Small First Aid Kit') || !itemNames.includes('Small First Aid Kit')) {
                        itemNotFound('life', 'First Aid Kit', backgroundForLife);
                    } else if (bestItemForLife == 'Small First Aid Kit' && !itemNames.includes('Small First Aid Kit')) {
                        itemNotFound('life', 'Small First Aid Kit', backgroundForLife);
                    }

                    if (bestItemForTime == 'Blood Bag' && !itemNames.includes('Blood Bag : ' + bloodType)) {
                        let item = 'Blood Bag : ' + bloodType;
                        itemNotFound('hospital time', item, backgroundForTime);
                    } else if (bestItemForTime == 'Morphine' && !itemNames.includes('Morphine')) {
                        itemNotFound('hospital time', 'Morphine', backgroundForTime);
                    } else if (bestItemForTime == 'Small First Aid Kit' && !itemNames.includes('Small First Aid Kit')) {
                        itemNotFound('hospital time', 'Small First Aid Kit', backgroundForTime);
                    } else if (bestItemForTime == 'First Aid Kit' && !itemNames.includes('First Aid Kit') && itemNames.includes('Small First Aid Kit') || !itemNames.includes('Small First Aid Kit')) {
                        itemNotFound('hospital time', 'First Aid Kit', backgroundForTime);
                    }
                }
            }
        }
    }


    // Function to check the category in the inventory
    function checkCategory() {
        // Check if the 'items-wrap' div is on the page
        let itemsWrap = document.querySelector('.items-wrap');

        let itemNames = [];

        if (itemsWrap) {
            // Check if the 'title-black' div with 'items-name' span is present
            let titleBlack = itemsWrap.querySelector('.title-black span.items-name');
            if (titleBlack && titleBlack.textContent.trim() === 'Medical') {

                // Check if the 'category-wrap' div is present
                let categoryWrap = itemsWrap.querySelector('#category-wrap');
                if (categoryWrap) {
                    // Check if the 'medical-items' ul is present
                    let medicalItemsUl = categoryWrap.querySelector('ul#medical-items');
                    if (medicalItemsUl) {

                        if (!bloodType) {
                            console.log('no blood type');
                            bloodTypeNotFound();;
                        } else if (bloodType && showChangeBloodType == true) {
                            changeBloodType();
                        }

                        // Log the contents of the 'name' span for each LI
                        let medicalItemsList = medicalItemsUl.querySelectorAll('li');
                        medicalItemsList.forEach(function(li) {
                            let itemName = li.querySelector('.name');
                            if (itemName) {
                                let trimmedName = itemName.textContent.trim();
                                highlightItems(trimmedName, li);
                                itemNames.push(trimmedName);
                            }
                        });


                        if (bestItemForLife == 'Blood Bag' && !itemNames.includes('Blood Bag : ' + bloodType)) {
                            let item = 'Blood Bag : ' + bloodType;
                            itemNotFound('life', item, backgroundForLife);
                        } else if (bestItemForLife == 'Morphine' && !itemNames.includes('Morphine')) {
                            itemNotFound('life', 'Morphine', backgroundForLife);
                        } else if (bestItemForLife == 'First Aid Kit' && !itemNames.includes('First Aid Kit') && itemNames.includes('Small First Aid Kit') || !itemNames.includes('Small First Aid Kit')) {
                            itemNotFound('life', 'First Aid Kit', backgroundForLife);
                        } else if (bestItemForLife == 'Small First Aid Kit' && !itemNames.includes('Small First Aid Kit')) {
                            itemNotFound('life', 'Small First Aid Kit', backgroundForLife);
                        }

                        if (bestItemForTime == 'Blood Bag' && !itemNames.includes('Blood Bag : ' + bloodType)) {
                            let item = 'Blood Bag : ' + bloodType;
                            itemNotFound('hospital time', item, backgroundForTime);
                        } else if (bestItemForTime == 'Morphine' && !itemNames.includes('Morphine')) {
                            itemNotFound('hospital time', 'Morphine', backgroundForTime);
                        } else if (bestItemForTime == 'Small First Aid Kit' && !itemNames.includes('Small First Aid Kit')) {
                            itemNotFound('hospital time', 'Small First Aid Kit', backgroundForTime);
                        } else if (bestItemForTime == 'First Aid Kit' && !itemNames.includes('First Aid Kit') && itemNames.includes('Small First Aid Kit') || !itemNames.includes('Small First Aid Kit')) {
                            itemNotFound('hospital time', 'First Aid Kit', backgroundForTime);
                        }
                    } else {
                        console.log(consoleComment + 'No medical items found in category-wrap');
                    }
                } else {
                    console.log(consoleComment + 'No category-wrap found');
                }
            } else {
                console.log(consoleComment + 'Not medical');
            }
        } else {
            console.log(consoleComment + 'No items-wrap found');
        }
    }

    // Function to highlight items in the inventory based on "Best Item"
    function highlightItems(itemName, nameSpan) {

        GM.addStyle(`
            .bestItemForLife {
                background: ${simpleColorForLife} !important;
                background: ${colorForLife} !important;
                background: ${backgroundForLife} !important;
            }

            .bestItemForLife .title-wrap.ui-accordion-header-active > *, .bestItemForLife .cont-wrap.ui-accordion-content-active > * {
                background: none !important;
            }

            .bestItemForTime {
                background: ${simpleColorForTime} !important;
                background: ${colorForTime} !important;
                background: ${backgroundForTime} !important;
            }

            .bestItemForTime .title-wrap.ui-accordion-header-active > *, .bestItemForTime .cont-wrap.ui-accordion-content-active > * {
                background: none !important;
            }

            .bestItemForBoth {
                background: ${simpleColorForBoth} !important;
                background: ${colorForBoth} !important;
                background: ${backgroundForBoth} !important;
            }

            .bestItemForBoth .title-wrap.ui-accordion-header-active > *, .bestItemForBoth .cont-wrap.ui-accordion-content-active > * {
                background: none !important;
            }
        `);

        nameSpan.style.background = '';
        nameSpan.classList.remove('bestItemForLife');
        nameSpan.classList.remove('bestItemForTime');
        nameSpan.classList.remove('bestItemForBoth');

        // Best Item For Life
        if (bestItemForLife == 'Blood Bag') {
            if (itemName.includes('Blood Bag : ') && itemName !== 'Empty Blood Bag' && itemName !== 'Blood Bag : Irradiated') {
                if (bloodType === 'O-' && (itemName.includes('O-') && !itemName.includes('AB+') && !itemName.includes('AB-'))) {
                    // Compatible with O-
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                } else if (bloodType === 'O+' && (itemName.includes('O-') || itemName.includes('O+') && !itemName.includes('AB+') && !itemName.includes('AB-'))) {
                    // Compatible wiht O- and O+
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                } else if (bloodType === 'B-' && (itemName.includes('O-') || itemName.includes('B-') && !itemName.includes('AB+') && !itemName.includes('AB-'))){
                    // Compatible with O- and B-
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                } else if (bloodType === 'B+' && (itemName.includes('O-') || itemName.includes('O+') || itemName.includes ('B-') || itemName.includes('B+') && !itemName.includes('AB+') && !itemName.includes('AB-'))) {
                    // Compatible with O-, O+, B-, B+
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                } else if (bloodType === 'A-' && (itemName.includes('O-') || itemName.includes('A+') && !itemName.includes('AB+') && !itemName.includes('AB-'))) {
                    // Compatible with O-, A+
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                } else if (bloodType === 'A+' && (itemName.includes('O-') || itemName.includes('O+') || itemName.includes('A-') || itemName.includes('A+') && !itemName.includes('AB+') && !itemName.includes('AB-'))) {
                    // Compatible with O-, O+, A-, A+
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                } else if (bloodType === 'AB-' && (itemName.includes('O-') || itemName.includes('B-') || itemName.includes('A-') || itemName.includes('AB-') && !itemName.includes('AB+'))) {
                    // Compatible with O-, B-, A-, AB-
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                } else if (bloodType === 'AB+') {
                    // Compatible with everything
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                } else if (bloodType === '') {
                    nameSpan.classList.add('bestItemForLife');
                    nameSpan.style.background = simpleColorForLife;
                    nameSpan.style.background = colorForLife;
                    nameSpan.style.background = backgroundForLife;
                }
            }
        } else if (bestItemForLife == 'Morphine') {
            if (itemName == 'Morphine') {
                nameSpan.classList.add('bestItemForLife');
                nameSpan.style.background = simpleColorForLife;
                nameSpan.style.background = colorForLife;
                nameSpan.style.background = backgroundForLife;
            }
        } else if (bestItemForLife == 'First Aid Kit') {
            if (itemName == 'First Aid Kit') {
                nameSpan.classList.add('bestItemForLife');
                nameSpan.style.background = simpleColorForLife;
                nameSpan.style.background = colorForLife;
                nameSpan.style.background = backgroundForLife;
            }
        } else if (bestItemForLife == 'Small First Aid Kit') {
            if (itemName == 'Small First Aid Kit') {
                nameSpan.classList.add('bestItemForLife');
                nameSpan.style.background = simpleColorForLife;
                nameSpan.style.background = colorForLife;
                nameSpan.style.background = backgroundForLife;
            }
        }

        // Best Item For Time
        if (bestItemForTime == 'Blood Bag') {
            if (itemName.includes('Blood Bag : ' + bloodType) && itemName !== 'Empty Blood Bag' && itemName !== 'Blood Bag : Irradiated') {
                if (bloodType === 'O-' && itemName.includes('O-') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O-
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                } else if (bloodType === 'O+' && itemName.includes('O-') || itemName.includes('O+') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O- and O+
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                } else if (bloodType === 'B-' && itemName.includes('O-') || itemName.includes('B-') && !itemName.includes('AB+') && !itemName.includes('AB-')){
                    // Compatible with O- and B-
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                } else if (bloodType === 'B+' && itemName.includes('O-') || itemName.includes('O+') || itemName.includes ('B-') || itemName.includes('B+') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O-, O+, B-, B+
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                } else if (bloodType === 'A-' && itemName.includes('O-') || itemName.includes('A+') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O-, A+
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                } else if (bloodType === 'A+' && itemName.includes('O-') || itemName.includes('O+') || itemName.includes('A-') || itemName.includes('A+') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O-, O+, A-, A+
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                } else if (bloodType === 'AB-' && itemName.includes('O-') || itemName.includes('B-') || itemName.includes('A-') || itemName.includes('AB-') && !itemName.includes('AB+')) {
                    // Compatible with O-, B-, A-, AB-
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                } else if (bloodType === 'AB+') {
                    // Compatible with everything
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                } else if (bloodType === '') {
                    nameSpan.classList.add('bestItemForTime');
                    nameSpan.style.background = simpleColorForTime;
                    nameSpan.style.background = colorForTime;
                    nameSpan.style.background = backgroundForTime;
                }
            }
        } else if (bestItemForTime == 'Morphine') {
            if (itemName == 'Morphine') {
                nameSpan.classList.add('bestItemForTime');
                nameSpan.style.background = simpleColorForTime;
                nameSpan.style.background = colorForTime;
                nameSpan.style.background = backgroundForTime;
            }
        } else if (bestItemForTime == 'First Aid Kit') {
            if (itemName == 'First Aid Kit') {
                nameSpan.classList.add('bestItemForTime');
                nameSpan.style.background = simpleColorForTime;
                nameSpan.style.background = colorForTime;
                nameSpan.style.background = backgroundForTime;
            }
        } else if (bestItemForTime == 'Small First Aid Kit') {
            if (itemName == 'Small First Aid Kit') {
                nameSpan.classList.add('bestItemForTime');
                nameSpan.style.background = simpleColorForTime;
                nameSpan.style.background = colorForTime;
                nameSpan.style.background = backgroundForTime;
            }
        }

        // Best Item For Both
        if (bestItemForLife == 'Blood Bag' && bestItemForTime == 'Blood Bag') {
            if (itemName.includes('Blood Bag : ' + bloodType) && itemName !== 'Empty Blood Bag') {
                if (bloodType === 'O-' && itemName.includes('O-') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O-
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                } else if (bloodType === 'O+' && itemName.includes('O-') || itemName.includes('O+') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible wiht O- and O+
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                } else if (bloodType === 'B-' && itemName.includes('O-') || itemName.includes('B-') && !itemName.includes('AB+') && !itemName.includes('AB-')){
                    // Compatible with O- and B-
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                } else if (bloodType === 'B+' && itemName.includes('O-') || itemName.includes('O+') || itemName.includes ('B-') || itemName.includes('B+') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O-, O+, B-, B+
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                } else if (bloodType === 'A-' && itemName.includes('O-') || itemName.includes('A+') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O-, A+
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                } else if (bloodType === 'A+' && itemName.includes('O-') || itemName.includes('O+') || itemName.includes('A-') || itemName.includes('A+') && !itemName.includes('AB+') && !itemName.includes('AB-')) {
                    // Compatible with O-, O+, A-, A+
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                } else if (bloodType === 'AB-' && itemName.includes('O-') || itemName.includes('B-') || itemName.includes('A-') || itemName.includes('AB-') && !itemName.includes('AB+')) {
                    // Compatible with O-, B-, A-, AB-
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                } else if (bloodType === 'AB+') {
                    // Compatible with everything
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                } else if (bloodType === '') {
                    nameSpan.classList.add('bestItemForBoth');
                    nameSpan.style.background = simpleColorForBoth;
                    nameSpan.style.background = colorForBoth;
                    nameSpan.style.background = backgroundForBoth;
                }
            }
        } else if (bestItemForLife == 'Morphine') {
            if (bestItemForTime == 'Morphine' && itemName == 'Morphine') {
                nameSpan.classList.add('bestItemForBoth');
                nameSpan.style.background = simpleColorForBoth;
                nameSpan.style.background = colorForBoth;
                nameSpan.style.background = backgroundForBoth;
            }
        } else if (bestItemForLife == 'First Aid Kit') {
            if (bestItemForTime == 'First Aid Kit' && itemName == 'First Aid Kit') {
                nameSpan.classList.add('bestItemForBoth');
                nameSpan.style.background = simpleColorForBoth;
                nameSpan.style.background = colorForBoth;
                nameSpan.style.background = backgroundForBoth;
            }
        } else if (bestItemForLife == 'Small First Aid Kit') {
            if (bestItemForTime == 'Small First Aid Kit' && itemName == 'Small First Aid Kit') {
                nameSpan.classList.add('bestItemForBoth');
                nameSpan.style.background = simpleColorForBoth;
                nameSpan.style.background = colorForBoth;
                nameSpan.style.background = backgroundForBoth;
            }
        }

    }

    // Function to fetch perks from the API
    function fetchPerkData() {
        console.log(consoleComment + 'Fetching Perk data');
        const url = `https://api.torn.com/user/?selections=perks&key=${apiKey}&comment=HighlightMedicalItems`;

        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                console.log(consoleComment + 'Response:');
                const data = JSON.parse(response.responseText);

                perksEffectiveness = 0;

                // Log all individual perks
                async function processPerks() {
                    for (const category in data) {
                        if (Array.isArray(data[category])) {
                            for (const perk of data[category]) {
                                if (perk.includes('medical item effectiveness')) {
                                    const numbers = perk.match(/\d+/g);
                                    if (numbers) {
                                        perksEffectiveness += numbers.reduce((acc, num) => acc + parseInt(num), 0);
                                    }
                                }
                            }
                        }
                    }

                    console.log(consoleComment + 'perksEffectiveness: ' + perksEffectiveness);

                    localStorage.setItem('medicalEffectivenessPerks', perksEffectiveness);

                }

                // Use Promise to wait for the loop to complete
                Promise.resolve(processPerks());

            },

            onerror: function(error) {
                console.error(consoleComment + 'Error fetching API data:', error);
            }
        });
    }

    function fetchProfileData() {
        console.log(consoleComment + 'Fetching Profile data');
        const url = `https://api.torn.com/user/?selections=profile,timestamp&key=${apiKey}&comment=HighlightMedicalItems`;

        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const data = JSON.parse(response.responseText);

                console.log(data);
                console.log(consoleComment + 'Current life: ' + data.life.current + ' Maximum life: ' + data.life.maximum);

                localStorage.setItem('currentLife', data.life.current);
                localStorage.setItem('maximumLife', data.life.maximum);

                currentLife = data.life.current;
                maximumLife = data.life.maximum;

                let state = data.status.state
                if (state == 'Hospital') {
                    let description = data.status.description;
                    let timestamp = data.states.hospital_timestamp;
                    let timeDifference = calculateTimeDifference(timestamp);
                    let formattedTimeDifference = formatTime(timeDifference);
                    localStorage.setItem('hospitalTime', formattedTimeDifference);
                    hospitalTime = formattedTimeDifference;
                    console.log(consoleComment + 'Hospital time: ' + formattedTimeDifference);
                } else {
                    hospitalTime = '00:00:00';
                    localStorage.setItem('hospitalTime',hospitalTime);
                    console.log(consoleComment + 'Not in hospital at the moment.');
                }

                let timestamp = data.timestamp;
                console.log(timestamp);
                let dateFromTimestamp = new Date(timestamp * 1000);
                let formattedDate = `${dateFromTimestamp.getUTCDate().toString().padStart(2, '0')}/` +
                    `${(dateFromTimestamp.getUTCMonth() + 1).toString().padStart(2, '0')}/` +
                    `${dateFromTimestamp.getUTCFullYear()} ${dateFromTimestamp.getUTCHours().toString().padStart(2, '0')}:` +
                    `${dateFromTimestamp.getUTCMinutes().toString().padStart(2, '0')}:${dateFromTimestamp.getUTCSeconds().toString().padStart(2, '0')} TCT`;

                localStorage.setItem('lastChecked', formattedDate);
                lastChecked = formattedDate;

                console.log(consoleComment + formattedDate);
            },

            onerror: function(error) {
                console.error(consoleComment + 'Error fetching API data:', error);
            }
        });
    }


    function perksNotFound() {
        console.log(consoleComment + 'Perks not found');
        let keyNotFoundElement = document.getElementById('MedicalHighlighterPerks');

        if (keyNotFoundElement) {
            keyNotFoundElement.remove();
        }

        // Find the div with class "title-black"
        let titleBlackDiv = document.querySelector('div.title-black');

        if (window.location.href.includes('https://www.torn.com/factions.php')) {
            titleBlackDiv = document.getElementById('faction-armoury-tabs');
            console.log('Title black div');
            console.log(titleBlackDiv);
        }

        // Check if the element is found
        if (titleBlackDiv) {
            // Create a span element
            let newDivElement = document.createElement('div');
            newDivElement.id = 'MedicalHighlighterPerks';
            newDivElement.className = 'title-black';
            newDivElement.innerHTML = `You need to add your medical effectiveness in order for the "Highlight Medical Items" script to be accurate. You can do so `;
            newDivElement.style.color = 'var(--tutorial-title-color)';
            newDivElement.style.fontWeight = 'normal';
            newDivElement.style.background = simpleColorForBoth;
            newDivElement.style.background = colorForBoth;
            newDivElement.style.background = backgroundForBoth;
            newDivElement.style.height = 'fit-content';
            newDivElement.style.lineHeight = '1.5';
            newDivElement.style.padding = '6px 10px';

            GM.addStyle (`#factionQuickItems + #MedicalHighlighterPerks { margin-top: 10px }`)

            const link = document.createElement('a');
            link.href = 'javascript:void(0);';
            link.textContent = 'here';
            link.onclick = promptForPerks;

            // Append the anchor element to the div
            newDivElement.appendChild(link);

            let parentElement = titleBlackDiv.parentNode;

            // Check if the parent has more than one child
            if (parentElement.children.length > 1) {
                // Insert the new div as the second child
                parentElement.insertBefore(newDivElement, parentElement.children[1]);
            } else {
                // If there is only one child, simply append the new div
                parentElement.appendChild(newDivElement);
            }
        }
    }

    function promptForPerks() {
        let perks = prompt(`Please enter your medical effectiveness bonus. For example: if it's 20%, enter 20.`);
        if (perks !== null) {
            localStorage.setItem('medicalEffectivenessPerks', perks);
            perksEffectiveness = perks;
            alert('Medical effectiveness bonus set succesfully!');
        }
    }

    function changePerks() {
        console.log(consoleComment + 'Changing perks');

        // Find the div with class "title-black"
        let titleBlackDiv = document.querySelector('div.title-black');

        if (window.location.href.includes('https://www.torn.com/factions.php')) {
            titleBlackDiv = document.getElementById('faction-armoury-tabs');
            console.log('Title black div');
            console.log(titleBlackDiv);
        }

        // Check if the element is found
        if (titleBlackDiv) {
            // Create a span element
            let newDivElement = document.createElement('div');
            newDivElement.id = 'MedicalHighlighterChangePerks';
            newDivElement.className = 'title-black';
            newDivElement.innerHTML = `Change your medical effectiveness perks for the "Highlight Medical Items" script `;
            newDivElement.style.color = 'var(--tutorial-title-color)';
            newDivElement.style.fontWeight = 'normal';
            newDivElement.style.background = simpleColorForBoth;
            newDivElement.style.background = colorForBoth;
            newDivElement.style.background = backgroundForBoth;
            newDivElement.style.height = 'fit-content';
            newDivElement.style.lineHeight = '1.5';
            newDivElement.style.padding = '6px 10px';

            GM.addStyle (`#factionQuickItems + #MedicalHighlighterChangePerks { margin-top: 10px }`)

            const link = document.createElement('a');
            link.href = 'javascript:void(0);';
            link.textContent = 'here';
            link.onclick = promptForPerks;

            // Append the anchor element to the div
            newDivElement.appendChild(link);

            let parentElement = titleBlackDiv.parentNode;

            // Check if the parent has more than one child
            if (parentElement.children.length > 1) {
                // Insert the new div as the second child
                parentElement.insertBefore(newDivElement, parentElement.children[1]);
            } else {
                // If there is only one child, simply append the new div
                parentElement.appendChild(newDivElement);
            }
        }
    }

    // Function to check if a timestamp is older than 5 minutes
    function isTimestampOlderThanFiveMinutes(timestamp) {
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
        return new Date(timestamp) < fiveMinutesAgo;
    }

    // Function to repeatedly do functions at intervals
    function checkInterval() {
        if (window.location.href === 'https://www.torn.com/item.php' || window.location.href.includes('https://www.torn.com/factions.php')) {
            console.log(consoleComment + 'On items page');

            if (!perksEffectiveness) {
                if (useApiKey == false) {
                    console.log(consoleComment + 'No perks entered');
                    setTimeout(perksNotFound, 1000);
                }
            } else if (perksEffectiveness) {
                if (useApiKey == false) {
                    if (showPerksChange == true) {
                        setTimeout(changePerks, 1000);
                    }
                }
            }

            setInterval(lookForTooltips, 100);
            setInterval(getLifeValues, 1000);
            setInterval(calculateBestItem, 1000);
        } else if (window.location.href === 'https://www.torn.com/hospitalview.php') {
            console.log(consoleComment + 'On hospital page');
            setInterval(checkHospitalTime, 1000);
        }
    }

    // Function to check for the presence of tooltips
    function lookForTooltips() {
        // Check for div children with ids containing "floating-ui-x"
        const floatingUiDivs = document.querySelectorAll('[id^="floating-ui-"]');
        floatingUiDivs.forEach(floatingUiDiv => {
            // Check for a child with class "tooltip___aWICR"
            const tooltipElement = floatingUiDiv.querySelector('.tooltip___aWICR');
            if (tooltipElement) {
                // Iterate through child nodes and find text content
                for (let i = 0; i < tooltipElement.childNodes.length; i++) {
                    const node = tooltipElement.childNodes[i];

                    // Check if the node is a text node
                    if (node.nodeType === Node.TEXT_NODE) {
                        const textContent = node.textContent.trim();

                        if (textContent !== "") {
                            break; // Stop iterating after finding the first non-empty text node
                        }
                    }
                }
                // Extract relevant information from the tooltip text
                const tooltipText = tooltipElement.innerText;

                // Medical Cooldown
                const medicalCooldownMatch = tooltipText.match(/Medical Cooldown(\d{2}:\d{2}:\d{2}) \/ (\d{2}:\d{2}:\d{2})/);

                if (medicalCooldownMatch) {
                    // Extract currentMedicalCooldown and maximumMedicalCooldown
                    currentMedicalCooldown = medicalCooldownMatch[1];
                    maximumMedicalCooldown = medicalCooldownMatch[2];
                }

                // Hospital
                if (tooltipText.startsWith("Hospital")) {
                    // Split the tooltip content into three paragraphs
                    const paragraphs = tooltipElement.querySelectorAll('p');

                    if (paragraphs.length >= 2) {
                        // Extract hospitalReason and hospitalTime from the second and third paragraphs
                        const hospitalReason = paragraphs[0].textContent.trim();
                        const hospitalTimeMatch = paragraphs[1].textContent.match(/(\d{1,2} hours?, )?(\d{1,2} minutes? and )?(\d{1,2} seconds?)/);

                        if (hospitalTimeMatch) {
                            // Extract hours, minutes, and seconds
                            const hours = hospitalTimeMatch[1] ? parseInt(hospitalTimeMatch[1]) : 0;
                            const minutes = hospitalTimeMatch[2] ? parseInt(hospitalTimeMatch[2]) : 0;
                            const seconds = hospitalTimeMatch[3] ? parseInt(hospitalTimeMatch[3]) : 0;

                            // Calculate total time in seconds
                            const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

                            // Format time as hh:mm:ss
                            hospitalTime = new Date(totalTimeInSeconds * 1000).toISOString().substr(11, 8);

                            // Add timestamp to hospitalTime object
                            const timestamp = new Date().toISOString();
                            const hospitalTimeObject = { time: hospitalTime, timestamp: timestamp };

                            // Set item in localStorage
                            localStorage.setItem('hospitalTimeObject', JSON.stringify(hospitalTimeObject));

                            // Get the current date
                            let currentDate = new Date();

                            // Format the date as "DD/MM/YYYY HH:mm:ss UTC"
                            let formattedDate = `${currentDate.getUTCDate().toString().padStart(2, '0')}/` +
                                `${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}/` +
                                `${currentDate.getUTCFullYear()} ${currentDate.getUTCHours().toString().padStart(2, '0')}:` +
                                `${currentDate.getUTCMinutes().toString().padStart(2, '0')}:${currentDate.getUTCSeconds().toString().padStart(2, '0')} TCT`;

                            localStorage.setItem('lastCheckedTime', formattedDate);
                            lastCheckedTime = formattedDate;
                        }
                    }
                }

                if (tooltipText.startsWith("Life")) {
                    let regexResult = tooltipText.match(/Life: (\d+) \/ (\d+)/);

                    if (regexResult) {
                        // Parse the extracted values as integers
                        currentLife = parseInt(regexResult[1], 10);
                        maximumLife = parseInt(regexResult[2], 10);

                        // Set maximumLife in localStorage with timestamp
                        const maximumLifeTimestamp = new Date().toISOString();
                        const maximumLifeObject = { value: maximumLife, timestamp: maximumLifeTimestamp };
                        localStorage.setItem('maximumLifeObject', JSON.stringify(maximumLifeObject));

                        // Set currentLife in localStorage with timestamp
                        const currentLifeTimestamp = new Date().toISOString();
                        const currentLifeObject = { value: currentLife, timestamp: currentLifeTimestamp };
                        localStorage.setItem('currentLifeObject', JSON.stringify(currentLifeObject));

                        // Get the current date
                        let currentDate = new Date();

                        // Format the date as "DD/MM/YYYY HH:mm:ss UTC"
                        let formattedDate = `${currentDate.getUTCDate().toString().padStart(2, '0')}/` +
                            `${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}/` +
                            `${currentDate.getUTCFullYear()} ${currentDate.getUTCHours().toString().padStart(2, '0')}:` +
                            `${currentDate.getUTCMinutes().toString().padStart(2, '0')}:${currentDate.getUTCSeconds().toString().padStart(2, '0')} TCT`;

                        localStorage.setItem('lastCheckedLife', formattedDate);
                        lastCheckedLife = formattedDate;

                    } else {
                        console.log(consoleComment + 'Life values not found in tooltip content.');
                    }
                }

            }
        });

    }

    // Function to extract life values from the sidebar
    function getLifeValues() {
        // Find the anchor element with the specified class
        const anchorElement = document.querySelector('a.life___PlnzK');

        if (anchorElement) {
            // Find the div with the specified class
            let lifeDiv = anchorElement.querySelector('.bar-stats____l994');

            if (lifeDiv) {
                // Extract the current and maximum life values
                const lifeElement = lifeDiv.querySelector('.bar-value___NTdce');

                // Check if the elements are found
                if (lifeElement) {

                    let life = lifeElement.textContent;

                    // Extract currentLife and maximumLife
                    const match = life.match(/\d+/g);

                    if (match && match.length >= 2) {
                        currentLife = parseInt(match[0], 10);
                        maximumLife = parseInt(match[1], 10);

                        // Set maximumLife in localStorage with timestamp
                        const maximumLifeTimestamp = new Date().toISOString();
                        const maximumLifeObject = { value: maximumLife, timestamp: maximumLifeTimestamp };
                        localStorage.setItem('maximumLifeObject', JSON.stringify(maximumLifeObject));

                        // Set currentLife in localStorage with timestamp
                        const currentLifeTimestamp = new Date().toISOString();
                        const currentLifeObject = { value: currentLife, timestamp: currentLifeTimestamp };
                        localStorage.setItem('currentLifeObject', JSON.stringify(currentLifeObject));

                        // Get the current date
                        let currentDate = new Date();

                        // Format the date as "DD/MM/YYYY HH:mm:ss UTC"
                        let formattedDate = `${currentDate.getUTCDate().toString().padStart(2, '0')}/` +
                            `${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}/` +
                            `${currentDate.getUTCFullYear()} ${currentDate.getUTCHours().toString().padStart(2, '0')}:` +
                            `${currentDate.getUTCMinutes().toString().padStart(2, '0')}:${currentDate.getUTCSeconds().toString().padStart(2, '0')} TCT`;

                        localStorage.setItem('lastCheckedLife', formattedDate);
                        lastCheckedLife = formattedDate;
                    }
                }
            } else {
                console.log(consoleComment + 'Life DIV not found');
            }
        } else {
            console.log(consoleComment + 'Anchor element with class "life___PlnzK" not found.');
        }
    }

    // Function to check the hospital time when in the hospital
    function checkHospitalTime() {
        // Extract theCounter element
        const theCounterElement = document.getElementById('theCounter');

        if (theCounterElement) {
            // Extract the text content
            const counterText = theCounterElement.textContent.trim();

            // Extract hours, minutes, and seconds using regular expression
            const timeMatch = counterText.match(/(\d{1,2} hours?, )?(\d{1,2} minutes? and )?(\d{1,2} seconds?)/);

            if (timeMatch) {
                // Extract hours, minutes, and seconds from the match
                const hours = parseInt(timeMatch[1]) || 0;
                const minutes = parseInt(timeMatch[2]) || 0;
                const seconds = parseInt(timeMatch[3]) || 0;

                // Format time as hh:mm:ss
                hospitalTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                // Add timestamp to hospitalTime object
                const timestamp = new Date().toISOString();
                let hospitalTimeObject = { time: hospitalTime, timestamp: timestamp };

                // Set item in localStorage
                localStorage.setItem('hospitalTimeObject', JSON.stringify(hospitalTimeObject));

                let hospitalObject = hospitalTimeObject;

                // Log the formatted time
                console.log(consoleComment + 'Hospital Page:', hospitalTime);

                // Get the current date
                let currentDate = new Date();

                // Format the date as "DD/MM/YYYY HH:mm:ss UTC"
                let formattedDate = `${currentDate.getUTCDate().toString().padStart(2, '0')}/` +
                    `${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}/` +
                    `${currentDate.getUTCFullYear()} ${currentDate.getUTCHours().toString().padStart(2, '0')}:` +
                    `${currentDate.getUTCMinutes().toString().padStart(2, '0')}:${currentDate.getUTCSeconds().toString().padStart(2, '0')} TCT`;

                localStorage.setItem('lastCheckedTime', formattedDate);
                lastCheckedTime = formattedDate;
            }
        }
    }
})();

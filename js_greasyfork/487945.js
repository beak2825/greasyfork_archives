// ==UserScript==
// @name         Racing: Car Templates
// @namespace    heartflower.torn.com
// @version      1.3.4
// @description  Highlights cars and upgrades based on templates
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/487945/Racing%3A%20Car%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/487945/Racing%3A%20Car%20Templates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settings = 'new';
    let showAdaptRevert = true; // Set to 'false' if you don't want the adapt/revert link to show

    let savedSettings = localStorage.getItem('hf-car-settings');
    if (savedSettings) {
        settings = savedSettings;
    } else {
        localStorage.setItem('hf-car-settings', settings);
    }

    // When set to true, it will show you what the script entails
    let showExplanation = 'true';
    let storedShowExplanation = localStorage.getItem('hf-car-templates-explanation');

    // If it's the first time loading the script, always show the explanation
    if (!storedShowExplanation) {
        showExplanation = 'true';
        localStorage.setItem('hf-car-templates-explanation', 'true');
    } else {
        showExplanation = storedShowExplanation;
    }

    // Show background colours, by default set to true
    let redColor = 'true';
    let storedRedColor = localStorage.getItem('hf-car-templates-red-color');
    if (storedRedColor) {
        redColor = storedRedColor;
    }

    let blueColor = 'true';
    let storedBlueColor = localStorage.getItem('hf-car-templates-blue-color');
    if (storedBlueColor) {
        blueColor = storedBlueColor;
    }

    let greenColor = 'true';
    let storedGreenColor = localStorage.getItem('hf-car-templates-green-color');
    if (storedGreenColor) {
        greenColor = storedGreenColor;
    }

    // Declare some variables to use later
    let chosenCar = '';
    let selectedCar = '';
    let selectedTrack = '';
    let carType = '';
    let carRatio = '';
    let carTurbo = '';
    let possibleTemplates = [];
    let chosenTrack = '';

    // Set added car notes to false unless they've been added
    let addedCarNotes = false;

    // If the person chose a template already during this session, remember it
    let selectedTemplate = '';
    let storedTemplate = sessionStorage.getItem('selectedTemplate');

    if (storedTemplate) {
        selectedTemplate = storedTemplate;
    }

    // Create a set to store already logged title elements
    let loggedTitleElements = new Set();

    // Default Class A Car Templates as chosen by most racing guides
    let oldCarTemplates = [
        { name: 'Mudpit: Sierra Cosworth DS3', noteRecogniser: 'DS3' },
        { name: 'Two Islands: Honda NSX DL2', noteRecogniser: 'DL2' },
        { name: 'Parkland: Honda NSX DS3', noteRecogniser: 'DS3' },
        { name: 'Hammerhead: Honda NSX DS2', noteRecogniser: 'DS2' },
        { name: 'Stone Park: Audi R8 DS3', noteRecogniser: 'DS3' },
        { name: 'Withdrawal: Lexus LFA TL3', noteRecogniser: 'TL3' },
        { name: 'Speedway: Lexus LFA TL3', noteRecogniser: 'TL3' },
        { name: 'Uptown: Lexus LFA TL3', noteRecogniser: 'TL3' },
        { name: 'Underdog: Honda NSX TS2', noteRecogniser: 'TS2' },
        { name: 'Commerce: Honda NSX TS2', noteRecogniser: 'TS2' },
        { name: 'Sewage: Honda NSX TS2', noteRecogniser: 'TS2' },
        { name: 'Industrial: Honda NSX TS3', noteRecogniser: 'TS3' },
        { name: 'Vector: Honda NSX TS3', noteRecogniser: 'TS3' },
        { name: 'Meltdown: Honda NSX TS3', noteRecogniser: 'TS3' },
        { name: 'Docks: Ford GT40 TS3', noteRecogniser: 'TS3' },
        { name: 'Convict: Mercedes SLR TL3', noteRecogniser: 'TL3' },
    ];

    let newCarTemplates = [
        { name: 'Mudpit: Colina Tanprice DS3', noteRecogniser: 'DS3' },
        { name: 'Two Islands: Edomondo NSX DL2', noteRecogniser: 'DL2' },
        { name: 'Parkland: Edomondo NSX DS3', noteRecogniser: 'DS3' },
        { name: 'Hammerhead: Edomondo NSX DS2', noteRecogniser: 'DS2' },
        { name: 'Stone Park: Echo R8 DS3', noteRecogniser: 'DS3' },
        { name: 'Withdrawal: Veloria LFA TL3', noteRecogniser: 'TL3' },
        { name: 'Speedway: Veloria LFA TL3', noteRecogniser: 'TL3' },
        { name: 'Uptown: Veloria LFA TL3', noteRecogniser: 'TL3' },
        { name: 'Underdog: Edomondo NSX TS2', noteRecogniser: 'TS2' },
        { name: 'Commerce: Edomondo NSX TS2', noteRecogniser: 'TS2' },
        { name: 'Sewage: Edomondo NSX TS2', noteRecogniser: 'TS2' },
        { name: 'Industrial: Edomondo NSX TS3', noteRecogniser: 'TS3' },
        { name: 'Vector: Edomondo NSX TS3', noteRecogniser: 'TS3' },
        { name: 'Meltdown: Edomondo NSX TS3', noteRecogniser: 'TS3' },
        { name: 'Docks: Volt GT TS3', noteRecogniser: 'TS3' },
        { name: 'Convict: Mercia SLR TL3', noteRecogniser: 'TL3' },
    ];

    let carTemplates = newCarTemplates;

    if (settings === 'old') {
        carTemplates = oldCarTemplates;
    }

    // If the user already has their own templates, set those instead
    let storedCarTemplates = JSON.parse(localStorage.getItem('carTemplates'));

    if (storedCarTemplates) {
        carTemplates = storedCarTemplates;
    } else {
        carTemplates.sort(); // Order alphabetically for easiness
        localStorage.setItem('carTemplates', JSON.stringify(carTemplates)); // Set the default templates in storage
    }

    // Recommended upgrades to always have on the car
    const overallUpgrades = ['Air Forced Engine Cooling','Air Cooling Ducts for Brakes','Adjustable Rear Spoiler','Front Diffuser','Rear Diffuser','Fast Road Brake Fluid','Braided Brake Hoses',
                             'Grooved and Drilled Brake Discs','Competition Racing Brake Pads','Brake Balance Bias Control','6 Pot Uprated Brakes','Ported and Polished Head','Competition Racing Fuel Pump',
                             'Competition Polished Throttle Body','Bored Out Engine + Forged Pistons','Front Mounted Intercooler','Stage Three Remap','Competition Racing Camshaft','Full Exhaust System',
                             'Stainless Steel 4-1 Manifold','Custom Forced Induction Kit','Super Octane Fuel Plus Nitrous','Polyurethane Bushings Front','Polyurethane Bushings Rear','Upper Front Strut Brace',
                             'Lower Front Strut Brace','Rear Strut Brace','Front Adjustable Tie Rods','Adjustable Rear Control arms','Quick Shift','4 Pin Differential','Competition Racing Clutch','Ultra-Light Flywheel',
                             'Strip Out','Racing Steering Wheel','Lightweight Flocked Dash','Polycarbonate Windows','Carbon Fiber Roof','Carbon Fiber Trunk','Carbon Fiber Hood','Ultra-Lightweight Alloys'];

    // Recommended dirt upgrades
    const dirtLongRatioUpgrades = ['Group N Rally Suspension','Rally Gearbox (Long Ratio)','Rally Tires'];
    const dirtShortRatioUpgrades = ['Group N Rally Suspension','Rally Gearbox (Short Ratio)','Rally Tires'];

    // Recommended tarmac upgrades
    const tarmacLongRatioUpgrades = ['Adjustable Coilover Suspension','Paddle Shift Gearbox (Long Ratio)','Track Tires'];
    const tarmacShortRatioUpgrades = ['Adjustable Coilover Suspension','Paddle Shift Gearbox (Short Ratio)','Track Tires'];

    // Recommended turbo upgrades
    const turbo2Upgrades = ['Stage Two Turbo kit'];
    const turbo3Upgrades = ['Stage Three Turbo Kit'];

    // Set needed car upgrades by default to overall upgrades
    let carUpgrades = [...overallUpgrades];

    // All available tracks on Torn
    let trackNames = [
        'Commerce',
        'Convict',
        'Docks',
        'Hammerhead',
        'Industrial',
        'Meltdown',
        'Mudpit',
        'Parkland',
        'Sewage',
        'Speedway',
        'Stone Park',
        'Two Islands',
        'Underdog',
        'Uptown',
        'Vector',
        'Withdrawal',
    ];

    // All available cars on Torn
    let oldCarNames = [
        'Alfa Romeo 156',
        'Aston Martin One-77',
        'Audi R8',
        'Audi S3',
        'Audi S4',
        'Audi TT Quattro',
        'BMW M5',
        'BMW X5',
        'BMW Z8',
        'Bugatti Veyron',
        'Chevrolet Cavalier',
        'Chevrolet Corvette Z06',
        'Citroen Saxo',
        'Classic Mini',
        'Dodge Charger',
        'Ferrari 458',
        'Fiat Punto',
        'Ford Focus RS',
        'Ford GT40',
        'Ford Mustang',
        'Holden SS',
        'Honda Accord',
        'Honda Civic',
        'Honda Integra R',
        'Honda NSX',
        'Honda S2000',
        'Hummer H3',
        'Lamborghini Gallardo',
        'Lexus LFA',
        'Lotus Exige',
        'Mercedes SLR',
        'Mini Cooper S',
        'Mitsubishi Evo X',
        'Nissan GT-R',
        'Nissan Micra',
        'Peugeot 106',
        'Pontiac Firebird',
        'Porsche 911 GT3',
        'Reliant Robin',
        'Renault Clio',
        'Seat Leon Cupra',
        'Sierra Cosworth',
        'Subaru Impreza STI',
        'Toyota MR2',
        'TVR Sagaris',
        'Vauxhall Astra GSI',
        'Vauxhall Corsa',
        'Volkswagen Beetle',
        'Volkswagen Golf GTI',
        'Volvo 850'
    ];

    // Car names after the change
    let newCarNames = [
        'Mercia SLR',
        'Veloria LFA',
        'Weston Marlin 177',
        'Lambrini Torobravo',
        'Volt GT',
        'Edomondo NSX',
        'Zaibatsu GT-R',
        'Lolo 458',
        'Echo R8',
        'Volt MNG',
        'Bavaria M5',
        'Dart Rampager',
        'Echo S4',
        'Wington GGU ',
        'Tsubasa Impressor',
        'Yotsuhada EVX',
        'Colina Tanprice',
        'Cosmos EX',
        'Chevalier CZ06',
        'Oceania SS',
        'Knight Firebrand',
        'Sturmfahrt 111',
        'Edomondo S2',
        'Volt RS',
        'Bavaria Z8',
        'Edomondo IR',
        'Bedford Nova',
        'Echo S3',
        'Nano Cavalier',
        'Echo Quadrato',
        'Tabata RM2',
        'Chevalier CVR',
        'Edomondo ACD',
        'Bavaria X5',
        'Alpha Milano 156',
        'Invader H3',
        'Coche Basurero',
        'Edomondo Localé',
        'Verpestung Insecta',
        'Papani Colé',
        'Stålhög 860',
        'Verpestung Sport',
        'Zaibatsu Macro',
        'Çagoutte 10-6',
        'Nano Pioneer',
        'Trident',
        'Vita Bravo',
        'Limoen Saxon',
        'Bedford Racer',
    ];

    let carNames = newCarNames;

    if (settings === 'old') {
        carNames = oldCarNames;
    }

    // If the message element is there, add the necessary things to it
    function observeMessageElement() {
        const messageWrap = document.querySelector('.info-msg-cont');
        const categoriesWrap = document.querySelector('.pm-categories-wrap');

        if (categoriesWrap) {
            messageWrap.style.background = 'rgba(20, 113, 151, 0.5)';
            const messageElement = messageWrap.querySelector('.right-round');

            // Find the element containing the racing points text
            let racingPointsElement = document.getElementById('racing-points');

            if (racingPointsElement) {
                // Get the current racing points value
                let racingPoints = racingPointsElement.innerText;

                // Find the element containing the car name
                let carNameElement = document.querySelector('.msg.right-round b');
                if (carNameElement && addedCarNotes == false) {
                    // Get the car name
                    let carName = carNameElement.innerText;
                    selectedCar = carName;

                    // Update the text
                    let newText = carName + " (" + chosenCar + ")";

                    // Replace only the specific part of the text
                    let textNode = racingPointsElement.parentElement.childNodes[1]; // Assuming the second child node
                    textNode.textContent = newText;
                    racingPointsElement.parentElement.innerHTML;

                    addedCarNotes = true;
                }
            }

            // Only show the explanation if wanted and not already there
            let existingTextDiv = document.getElementById('carScriptTextDiv');

            if (!existingTextDiv && showExplanation == 'true') {
                let textDiv = document.createElement('div');
                textDiv.id = 'carScriptTextDiv';
                textDiv.style.paddingTop = '16px';
                textDiv.innerHTML = `The <b style="color:red; font-style:italic">Racing: Car Templates</b> script shows you what upgrades you have and/or are missing based on car templates.
            There are already a few car templates added based on some popular guides, but you're able to remove or add them as you please.
            Clicking the ✓ sets a new template, whilst clicking the X removes an existing template.<br><br>
            Upon setting a new template, you will be asked to enter a <span style='font-style:italic'>note recogniser</span>. This recogniser will be used to highlight the suggested car for a specific race you are joining or creating. You're also able to edit this note recogniser at any time by simply clicking the note button.<br><br>
            You can choose to show or not show background colours by simply clicking their colour.<br>
            A <b style="color:rgb(116, 184, 22)">green</b> background means that the upgrade is suggested and fitted.
            A <b style="color:rgb(20, 113, 151)">blue</b> background means that the upgrade is suggested, but not fitted.
            An <b style="color:rgb(247, 103, 7)">orange</b> background means that the upgrade is not suggested, but fitted.
            <br><br>
            <a href="#" id="removeExplanationLink">Click here to remove the explanation forever.</a>`;

                messageElement.appendChild(textDiv);

                let removeLink = document.getElementById('removeExplanationLink');
                if (removeLink) {
                    removeLink.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent the default behavior of the link
                        removeExplanation(); // Call the removeExplanation function
                    });
                };
            }

            // Create the radio buttons
            createRadioButtons(messageElement);

            // Create the datalist container
            let datalistContainer = document.querySelector('#racingScriptDatalistContainer');

            if (!datalistContainer) {
                datalistContainer = document.createElement('div');
                datalistContainer.id = 'racingScriptDatalistContainer';
                datalistContainer.style.display = 'flex';
                datalistContainer.style.flexWrap = 'wrap';
                datalistContainer.style.paddingTop = '15px';
                datalistContainer.style.paddingBottom = '10px';

                messageElement.appendChild(datalistContainer);
            }

            // Create other containers
            createCarNamesContainer(datalistContainer);
            createTrackNamesContainer(datalistContainer);
            createCarTemplatesContainer(datalistContainer);

            // Create the button container (template buttons) if not already there
            let buttonContainer = '';

            let existingButtonContainer = document.getElementById('racingButtonContainer');

            if (!existingButtonContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.id = 'racingButtonContainer';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.paddingTop = '8px';

                datalistContainer.appendChild(buttonContainer);

                // Add button for creating new template
                let createTemplateButtonDiv = document.createElement('div');
                createTemplateButtonDiv.style.paddingRight = '8px';

                buttonContainer.appendChild(createTemplateButtonDiv);

                let createTemplateButton = document.createElement('button');
                createTemplateButton.textContent = '✓';
                createTemplateButton.style.color = 'white';
                createTemplateButton.onclick = createNewTemplate;
                createTemplateButton.style.background = 'url(/images/v2/racing/header/stripy_bg.png) 0 0 repeat';
                createTemplateButton.style.cursor = 'pointer';
                createTemplateButton.style.borderRadius = '5px';
                createTemplateButton.style.transition = 'background-color 0.3s ease';

                // Add event listener to change background color on hover
                createTemplateButton.addEventListener('mouseenter', function(event) {
                    createTemplateButton.style.background = 'rgba(0, 191, 255, 0.5)';
                    createTemplateButton.style.color = 'var(--default-color)';
                });

                // Restore original background color when mouse leaves
                createTemplateButton.addEventListener('mouseleave', function() {
                    createTemplateButton.style.background = 'url(/images/v2/racing/header/stripy_bg.png) 0 0 repeat';
                    createTemplateButton.style.color = 'white';
                });

                createTemplateButtonDiv.appendChild(createTemplateButton);

                // Add button for removing selected template
                let removeTemplateButtonDiv = document.createElement('div');
                removeTemplateButtonDiv.style.paddingRight = '8px';

                buttonContainer.appendChild(removeTemplateButtonDiv);

                let removeTemplateButton = document.createElement('button');
                removeTemplateButton.textContent = 'X';
                removeTemplateButton.style.color = 'white';
                removeTemplateButton.onclick = removeSelectedTemplate;
                removeTemplateButton.style.background = 'url(/images/v2/racing/header/stripy_bg.png) 0 0 repeat';
                removeTemplateButton.style.cursor = 'pointer';
                removeTemplateButton.style.borderRadius = '5px';
                removeTemplateButton.style.transition = 'background-color 0.3s ease';

                // Add event listener to change background color on hover
                removeTemplateButtonDiv.addEventListener('mouseenter', function(event) {
                    removeTemplateButton.style.background = 'rgba(0, 191, 255, 0.5)';
                    removeTemplateButton.style.color = 'var(--default-color)';
                });

                // Restore original background color when mouse leaves
                removeTemplateButtonDiv.addEventListener('mouseleave', function() {
                    removeTemplateButton.style.background = 'url(/images/v2/racing/header/stripy_bg.png) 0 0 repeat';
                    removeTemplateButton.style.color = 'white';
                });

                removeTemplateButtonDiv.appendChild(removeTemplateButton);

                // Add button for editing noteRecogniser
                let changeNoteRecogniserButtonDiv = document.createElement('div');
                changeNoteRecogniserButtonDiv.style.width = '25px';
                changeNoteRecogniserButtonDiv.style.height = '21px';
                changeNoteRecogniserButtonDiv.style.background = 'url(/images/v2/racing/header/stripy_bg.png) 0 0 repeat';
                changeNoteRecogniserButtonDiv.style.borderRadius = '5px';

                buttonContainer.appendChild(changeNoteRecogniserButtonDiv);

                let changeNoteRecogniserButton = document.createElement('button');
                changeNoteRecogniserButton.textContent = ' ';
                changeNoteRecogniserButton.style.color = 'white';
                changeNoteRecogniserButton.onclick = function() {
                    // Get the input element
                    let input = document.querySelector('#carTemplatesContainer input');

                    // Get the selected template name
                    let selectedTemplateName = input.value;
                    changeTemplateNoteRecogniser(selectedTemplateName);
                };
                changeNoteRecogniserButton.style.background = 'url(/images/v2/racing/edit_car_name.svg) no-repeat';
                changeNoteRecogniserButton.style.backgroundPositionX = '2px';
                changeNoteRecogniserButton.style.backgroundPositionY = '1px';
                changeNoteRecogniserButton.style.width = '25px';
                changeNoteRecogniserButton.style.height = '18px';
                changeNoteRecogniserButton.style.cursor = 'pointer';
                changeNoteRecogniserButton.style.transition = 'background-color 0.3s ease';

                // Add event listener to change background color on hover
                changeNoteRecogniserButton.addEventListener('mouseenter', function(event) {
                    changeNoteRecogniserButton.style.backgroundPositionY = '-17px';
                    changeNoteRecogniserButtonDiv.style.background = 'rgba(0, 191, 255, 0.5)';
                });

                // Restore original background color when mouse leaves
                changeNoteRecogniserButton.addEventListener('mouseleave', function() {
                    changeNoteRecogniserButton.style.backgroundPositionY = '1px';
                    changeNoteRecogniserButton.style.color = 'white';
                    changeNoteRecogniserButtonDiv.style.background = 'url(/images/v2/racing/header/stripy_bg.png) 0 0 repeat';
                });

                changeNoteRecogniserButtonDiv.appendChild(changeNoteRecogniserButton);
            } else {
                buttonContainer = existingButtonContainer;
            }
        } else {
            // If the message container is not there yet, keep trying to find it
            setTimeout(() => {
                observeMessageElement();
            }, 100);
        }
    }

    // If the explanation is no longer wanted, remove it
    function removeExplanation() {
        showExplanation = false;
        localStorage.setItem('hf-car-templates-explanation', false);

        let existingTextDiv = document.getElementById('carScriptTextDiv');

        if (existingTextDiv) {
            existingTextDiv.remove();
        }
    }

    // Create the container and datalist for track names
    function createTrackNamesContainer(messageElement) {
        let existingDataListContainer = document.getElementById('trackNamesContainer');
        if (existingDataListContainer) {
            return;
        }

        let dataListContainer = document.createElement('div');
        dataListContainer.id = 'trackNamesContainer';
        dataListContainer.style.paddingRight = '16px';

        dataListContainer.style.display = 'flex';
        dataListContainer.style.alignItems = 'center';
        dataListContainer.style.paddingTop = '8px';
        let textContainer = document.createElement('p');
        textContainer.textContent = 'Track:';
        textContainer.style.fontWeight = 'bold';
        textContainer.style.paddingRight = '4px';

        dataListContainer.appendChild(textContainer);

        let input = document.createElement('input');
        input.style.border = '1px solid black';
        input.style.borderRadius = '5px';
        input.style.padding = '2px 4px';
        input.style.width = '100px';
        input.setAttribute('list', 'trackNames');

        // Add an input event listener
        input.addEventListener('input', function() {
            selectedTrack = input.value;
            observeTitleElements();
        });

        dataListContainer.appendChild(input);

        let dataList = document.createElement('datalist');
        dataList.id = 'trackNames';

        trackNames.forEach((track) => {
            let option = document.createElement('option');
            option.value = track;
            dataList.appendChild(option);
        });

        dataListContainer.appendChild(dataList);
        messageElement.appendChild(dataListContainer);
    }

    // Create the container and datalist for car names
    function createCarNamesContainer(messageElement) {
        let existingDataListContainer = document.getElementById('carNamesContainer');
        if (existingDataListContainer) {
            return;
        }

        let dataListContainer = document.createElement('div');
        dataListContainer.id = 'carNamesContainer';
        dataListContainer.style.paddingRight = '16px';
        dataListContainer.style.paddingTop = '8px';
        dataListContainer.style.display = 'flex';
        dataListContainer.style.alignItems = 'center';

        let textContainer = document.createElement('p');
        textContainer.textContent = 'Car:';
        textContainer.style.fontWeight = 'bold';
        textContainer.style.paddingRight = '4px';

        dataListContainer.appendChild(textContainer);

        let input = document.createElement('input');
        input.style.border = '1px solid black';
        input.style.borderRadius = '5px';
        input.style.padding = '2px 4px';
        input.setAttribute('list', 'carNames');

        // Add an input event listener
        input.addEventListener('input', function() {
            // Get the selected value from the input
            let selectedCar = input.value;
            observeTitleElements();
        });

        dataListContainer.appendChild(input);

        let dataList = document.createElement('datalist');
        dataList.id = 'carNames';

        carNames.forEach((car) => {
            let option = document.createElement('option');
            option.value = car;
            dataList.appendChild(option);
        });

        dataListContainer.appendChild(dataList);
        messageElement.appendChild(dataListContainer);
    }

    // Create the container and datalist for car templates
    function createCarTemplatesContainer(messageElement) {
        let existingDataListContainer = document.getElementById('carTemplatesContainer');
        if (existingDataListContainer) {
            return;
        }

        let dataListContainer = document.createElement('div');
        dataListContainer.id = 'carTemplatesContainer';
        dataListContainer.style.paddingRight = '8px';
        dataListContainer.style.paddingTop = '8px';
        dataListContainer.style.display = 'flex';
        dataListContainer.style.alignItems = 'center';

        let textContainer = document.createElement('p');
        textContainer.textContent = 'Template:';
        textContainer.style.fontWeight = 'bold';
        textContainer.style.paddingRight = '4px';

        dataListContainer.appendChild(textContainer);

        let input = document.createElement('input');
        input.style.border = '1px solid black';
        input.style.borderRadius = '5px';
        input.style.padding = '2px 4px';
        input.style.width = '189px';
        input.setAttribute('list', 'carTemplates');

        // Add an input event listener
        input.addEventListener('input', function() {
            selectedTemplate = input.value;
            changeUpgrades(selectedTemplate);
            observeTitleElements();
        });

        dataListContainer.appendChild(input);

        let dataList = document.createElement('datalist');
        dataList.id = 'carTemplates';

        carTemplates.forEach((template) => {
            let option = document.createElement('option');
            option.value = template.name;
            dataList.appendChild(option);
        });

        dataListContainer.appendChild(dataList);
        messageElement.appendChild(dataListContainer);

        changeCarNamesInput(selectedCar);
        writeCarInTemplates(selectedCar);
    }

    // Create a new template
    function createNewTemplate() {
        let type = '';
        let ratio = '';
        let turbo = '';

        if (carType == 'dirt') {
            type = 'D';
        } else if (carType == 'tarmac') {
            type = 'T';
        }

        if (carRatio == 'longRatio') {
            ratio = 'L';
        } else if (carRatio == 'shortRatio') {
            ratio = 'S';
        }

        if (carTurbo == 'turbo2') {
            turbo = '2';
        } else if (carTurbo == 'turbo3') {
            turbo = '3';
        }

        // Construct the new template name
        let newTemplateName = selectedTrack + ': ' + selectedCar + ' ' + type + ratio + turbo;

        // Check if the template already exists
        if (carTemplates.some(template => template.name === newTemplateName)) {
            alert('The template ' + newTemplateName + ' already exists, not adding again.');
            return; // Exit the function if the template already exists
        }

        if (selectedTrack == '') {
            alert('Please make sure to fill in a preferred track!');
            return;
        }

        if (selectedCar == '') {
            alert('Please make sure to fill in a preferred car!');
            return;
        }

        if (type == '') {
            alert('Please choose between dirt and tarmac!');
            return;
        }

        if (ratio == '') {
            alert('Please choose between long and short ratio!');
            return;
        }

        if (turbo == '') {
            alert('Please choose between turbo 2 and turbo 3!');
            return;
        }

        // Prompt the user to enter a note recogniser
        let noteRecogniser = prompt("Enter a note recogniser for the new template " + newTemplateName + ":");

        // Create an object representing the new template
        let newTemplate = {
            name: newTemplateName,
            noteRecogniser: noteRecogniser
        };

        carTemplates.push(newTemplate);
        carTemplates.sort();

        // Save updated carTemplates to localStorage
        localStorage.setItem('carTemplates', JSON.stringify(carTemplates));

        // Update the datalist options
        let dataList = document.getElementById('carTemplates');
        let option = document.createElement('option');
        option.value = newTemplateName;
        dataList.appendChild(option);

        writeCarInTemplates(newTemplateName);

        alert("Successfully added new template: " + newTemplateName + " with note recogniser " + noteRecogniser);
    }

    // Write the wanted car in templates to make it easier
    function writeCarInTemplates(selectedCar) {
        let input = document.querySelector('#carTemplatesContainer input');
        input.value = selectedCar;
    }

    // Remove an existing template
    function removeSelectedTemplate() {
        let selectedTemplateName = document.querySelector('#carTemplatesContainer input').value;

        // Find the index of the selected template in carTemplates
        let index = -1;
        for (let i = 0; i < carTemplates.length; i++) {
            if (carTemplates[i].name === selectedTemplateName) {
                index = i;
                break;
            }
        }

        // If the selected template is found, remove it
        if (index !== -1) {
            carTemplates.splice(index, 1);
            carTemplates.sort();

            // Save updated carTemplates to localStorage
            localStorage.setItem('carTemplates', JSON.stringify(carTemplates));

            // Update the datalist options
            let dataList = document.getElementById('carTemplates');
            let optionToRemove = dataList.querySelector(`option[value='${selectedTemplateName}']`);
            if (optionToRemove) {
                dataList.removeChild(optionToRemove);
                alert("Successfully removed template: " + selectedTemplateName);

                writeCarInTemplates(selectedCar);
            }
        }
    }

    // Change the upgrades based on a template
    function changeUpgrades(template) {
        let lastWord = selectedTemplate.split(' ').pop();

        let type = '';
        let ratio = '';
        let turbo = '';

        carUpgrades = [...overallUpgrades];

        if (lastWord.includes('D')) {
            type = 'dirt';
        } else if (lastWord.includes('T')) {
            type = 'tarmac';
        }

        if (lastWord.includes('S')) {
            ratio = 'shortRatio';
        } else if (lastWord.includes('L')) {
            ratio = 'longRatio';
        }

        if (lastWord.includes('2')) {
            turbo = 'turbo2';
        } else if (lastWord.includes('3')) {
            turbo = 'turbo3';
        }

        if (type == 'dirt' && ratio == 'shortRatio') {
            carUpgrades.push(...dirtShortRatioUpgrades);
        } else if (type == 'dirt' && ratio == 'longRatio') {
            carUpgrades.push(...dirtLongRatioUpgrades);
        } else if (type == 'tarmac' && ratio == 'shortRatio') {
            carUpgrades.push(...tarmacShortRatioUpgrades);
        } else if (type == 'tarmac' && ratio == 'longRatio') {
            carUpgrades.push(...tarmacLongRatioUpgrades);
        }

        if (turbo == 'turbo2') {
            carUpgrades.push(...turbo2Upgrades);
        } else if (turbo == 'turbo3') {
            carUpgrades.push(...turbo3Upgrades);
        }

        clickRadioButtons(type, ratio, turbo);
        changeCarNamesInput(selectedTemplate);
        changeTrackNamesInput(selectedTemplate);

        observeTitleElements();

        sessionStorage.setItem('selectedTemplate', selectedTemplate);
    }

    // Click radio buttons based on the wanted values
    function clickRadioButtons(typeValue, ratioValue, turboValue) {
        let typeRadioButton = document.querySelector(`input[value="${typeValue}"]`);
        let ratioRadioButton = document.querySelector(`input[value="${ratioValue}"]`);
        let turboRadioButton = document.querySelector(`input[value="${turboValue}"]`);

        if (typeRadioButton && ratioRadioButton && turboRadioButton) {
            typeRadioButton.checked = true;
            ratioRadioButton.checked = true;
            turboRadioButton.checked = true;

            // Trigger 'change' event on the radio buttons
            typeRadioButton.dispatchEvent(new Event('change'));
            ratioRadioButton.dispatchEvent(new Event('change'));
            turboRadioButton.dispatchEvent(new Event('change'));
        }
    }

    // Change car template input based on the wanted value
    function changeCarTemplatesInput(template) {
        let carTemplatesInput = document.querySelector('#carTemplatesContainer input');
        let carTemplatesDatalist = document.querySelector('#carTemplates');

        let matchedOption = null;

        // Loop through options in the datalist to find a match in the template
        for (let option of carTemplatesDatalist.options) {
            if (template.includes(option.value)) {
                matchedOption = option.value;
                break;
            }
        }

        if (matchedOption) {
            carTemplatesInput.value = matchedOption;
        } else {
            console.error('No matching option found in the template');
        }
    }

    // Change car name input based on the wanted value
    function changeCarNamesInput(template) {
        let carNamesInput = document.querySelector('#carNamesContainer input');
        let carNamesDatalist = document.querySelector('#carNames');

        let matchedOption = null;

        // Loop through options in the datalist to find a match in the template
        for (let option of carNamesDatalist.options) {
            if (template.includes(option.value)) {
                matchedOption = option.value;
                break;
            }
        }

        if (matchedOption) {
            carNamesInput.value = matchedOption;
            selectedCar = matchedOption;
        } else {
            console.error('No matching option found in the template');
        }
    }

    // Change track name input based on the wanted value
    function changeTrackNamesInput(template) {
        let trackNamesInput = document.querySelector('#trackNamesContainer input');
        let trackNamesDatalist = document.querySelector('#trackNames');

        let matchedOption = null;

        // Loop through options in the datalist to find a match in the template
        for (let option of trackNamesDatalist.options) {
            if (template.includes(option.value)) {
                matchedOption = option.value;
                break;
            }
        }

        if (matchedOption) {
            trackNamesInput.value = matchedOption;
            selectedTrack = matchedOption;
        } else {
            console.error('No matching option found in the template');
        }
    }

    // Create the radio buttons (type, turbo, ratio)
    function createRadioButtons(messageElement) {
        let existingRadioContainer = document.getElementById('carUpgradesRadioContainer');

        if (existingRadioContainer) {
            return;
        }

        let radioContainer = document.createElement('div');
        radioContainer.id = 'carUpgradesRadioContainer';
        radioContainer.style.display = 'flex';
        radioContainer.style.flexWrap = 'wrap';
        radioContainer.style.paddingTop = '10px';

        // Create Long/Short Ratio radio buttons
        let ratioContainer = document.createElement('div');
        ratioContainer.style.paddingRight = '16px';
        ratioContainer.style.paddingTop = '16px';
        ratioContainer.style.display = 'flex';
        createRadioButton(ratioContainer, 'longRatio', 'Long Ratio', 'ratio', 'left');
        createRadioButton(ratioContainer, 'shortRatio', 'Short Ratio', 'ratio', 'right');
        radioContainer.appendChild(ratioContainer);

        // Create Turbo 2/Turbo 3 radio buttons
        let turboContainer = document.createElement('div');
        turboContainer.style.paddingRight = '16px';
        turboContainer.style.paddingTop = '16px';
        turboContainer.style.display = 'flex';
        createRadioButton(turboContainer, 'turbo2', 'Turbo 2', 'turbo', 'left');
        createRadioButton(turboContainer, 'turbo3', 'Turbo 3', 'turbo', 'right');
        radioContainer.appendChild(turboContainer)

        // Create Dirt/Tarmac radio buttons
        let typeContainer = document.createElement('div');
        typeContainer.style.paddingRight = '16px';
        typeContainer.style.paddingTop = '16px';
        typeContainer.style.display = 'flex';
        createRadioButton(typeContainer, 'dirt', 'Dirt', 'type', 'left');
        createRadioButton(typeContainer, 'tarmac', 'Tarmac', 'type', 'right');
        radioContainer.appendChild(typeContainer);

        createCheckboxes(radioContainer);

        messageElement.appendChild(radioContainer);

        // Add event listener to update additional text based on radio buttons
        let radioOptions = document.querySelectorAll('.carScriptRadioButton');
        radioOptions.forEach(radio => {
            radio.addEventListener('change', function () {
                updateUpgradeBackgrounds();
                readRadioButtons();
                observeTitleElements();
            });
        });
    }

    // Create a single radio button couple
    function createRadioButton(parentElement, value, labelText, name, side) {
        let radioDiv = document.createElement('div');
        radioDiv.style.display = 'block';

        let radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = name;
        radioButton.value = value;
        radioButton.className = 'carScriptRadioButton';
        radioButton.id = name;
        radioButton.style.display = 'none';

        let labelDiv = document.createElement('div');
        let label = document.createElement('label');
        label.id = name + '-label';
        label.textContent = labelText;
        label.style.color = 'white';
        label.style.padding = '6px 10px';
        label.style.background = 'url(/images/v2/racing/header/stripy_bg.png) 0 0 repeat';
        label.style.cursor = 'pointer';

        if (side == 'left') {
            label.style.borderBottomLeftRadius = '5px';
            label.style.borderTopLeftRadius = '5px';
        } else if (side == 'right') {
            label.style.borderBottomRightRadius = '5px';
            label.style.borderTopRightRadius = '5px';
        }

        // Add click event listener to the label
        label.addEventListener('click', function () {
            radioButton.click(); // Trigger the associated radio button's click event
            observeTitleElements();
        });

        radioDiv.appendChild(radioButton);
        radioDiv.appendChild(label);

        parentElement.appendChild(radioDiv);
    }

    // Change upgrades based on which radio buttons are checked
    function readRadioButtons() {
        let radioOptions = document.querySelectorAll('.carScriptRadioButton');

        // Set car upgrades to default upgrades
        carUpgrades = [...overallUpgrades];

        radioOptions.forEach(radio => {
            if (radio.checked) {
                switch (radio.name) {
                    case 'type':
                        carType = radio.value;
                        break;
                    case 'ratio':
                        carRatio = radio.value;
                        break;
                    case 'turbo':
                        carTurbo = radio.value;
                        break;
                }
            }
        });

        if (carType == 'dirt' && carRatio == 'shortRatio') {
            carUpgrades.push(...dirtShortRatioUpgrades);
        } else if (carType == 'dirt' && carRatio == 'longRatio') {
            carUpgrades.push(...dirtLongRatioUpgrades);
        } else if (carType == 'tarmac' && carRatio == 'shortRatio') {
            carUpgrades.push(...tarmacShortRatioUpgrades);
        } else if (carType == 'tarmac' && carRatio == 'longRatio') {
            carUpgrades.push(...tarmacLongRatioUpgrades);
        }

        if (carTurbo == 'turbo2') {
            carUpgrades.push(...turbo2Upgrades);
        } else if (carTurbo == 'turbo3') {
            carUpgrades.push(...turbo3Upgrades);
        }
    }

    // Create checkboxes to show or don't show certain background colours
    function createCheckboxes(messageElement) {
        // If already there, don't add again
        let existingCheckboxDiv = document.getElementById('checkboxDiv');
        if (existingCheckboxDiv) {
            return;
        }

        let checkboxDiv = document.createElement('div');
        checkboxDiv.id = 'checkboxDiv';
        checkboxDiv.style.display = 'flex';
        checkboxDiv.style.paddingTop = '14px';
        checkboxDiv.style.paddingLeft = '16px';

        let textDiv = document.createElement('div');
        textDiv.textContent = 'Show background colors:';
        textDiv.style.fontWeight = 'bold';
        textDiv.style.alignSelf = 'center';
        textDiv.style.paddingRight = '4px';

        checkboxDiv.appendChild(textDiv);
        createCheckbox('green', checkboxDiv);
        createCheckbox('blue', checkboxDiv);
        createCheckbox('red', checkboxDiv);

        messageElement.appendChild(checkboxDiv);

        let checkboxOptions = document.querySelectorAll('.carScriptCheckbox');
        checkboxOptions.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                checkLabels();
                observeTitleElements();
            });
        });
    }

    // Create a single checkbox
    function createCheckbox(colour, checkboxDiv) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = colour + '-checkbox';
        checkbox.className = 'carScriptCheckbox';
        checkbox.style.display = 'none';

        let labelDiv = document.createElement('div');
        labelDiv.style.paddingRight = '4px';

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.style.width = '20px';
        label.style.height = '20px';
        label.style.display = 'inline-block';
        label.style.cursor = 'pointer';
        label.style.textAlign = 'center';
        label.style.lineHeight = '20px';
        label.style.fontSize = '14px';
        label.style.verticalAlign = 'middle';
        label.style.borderRadius = '5px';

        if (colour == 'red') {
            label.style.background = 'rgba(247,103,7,0.5)';
            if (redColor === true || redColor === 'true') {
                checkbox.checked = true;
                label.textContent = 'X';
            } else {
                checkbox.checked = false;
                label.textContent = '';
            }
        } else if (colour == 'blue') {
            label.style.background = 'rgba(20, 113, 151, 0.5)';
            if (blueColor === true || blueColor === 'true') {
                checkbox.checked = true;
                label.textContent = 'X';
            } else {
                checkbox.checked = false;
                label.textContent = '';
            }
        } else if (colour == 'green') {
            label.style.background = 'rgba(116,184,22,0.5)';
            if (greenColor === true || greenColor === 'true') {
                checkbox.checked = true;
                label.textContent = 'X';
            } else {
                checkbox.checked = false;
                label.textContent = '';
            }
        }

        // Add click event listener to the label
        label.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default label click behavior
            checkbox.checked = !checkbox.checked; // Toggle the 'checked' state of the associated checkbox
            checkbox.dispatchEvent(new Event('change')); // Dispatch a change event on the checkbox
            checkLabels(); // Update labels after toggling the checkbox
            observeTitleElements();
        });

        labelDiv.appendChild(checkbox);
        labelDiv.appendChild(label);
        checkboxDiv.appendChild(labelDiv);
    }

    // Keep checking the labels to see if any backgrounds need to be turned off
    function checkLabels() {
        let checkboxOptions = document.querySelectorAll('.carScriptCheckbox');

        checkboxOptions.forEach(checkbox => {
            let label = checkbox.nextElementSibling;

            if (checkbox.checked) {
                label.textContent = 'X';
                // Update color variables based on checkbox state
                if (checkbox.id === 'red-checkbox') {
                    redColor = true;
                    localStorage.setItem('hf-car-templates-red-color', 'true');
                } else if (checkbox.id === 'blue-checkbox') {
                    blueColor = true;
                    localStorage.setItem('hf-car-templates-blue-color', 'true');
                } else if (checkbox.id === 'green-checkbox') {
                    greenColor = true;
                    localStorage.setItem('hf-car-templates-green-color', 'true');
                }
            } else {
                label.textContent = '';
                // Update color variables based on checkbox state
                if (checkbox.id === 'red-checkbox') {
                    redColor = false;
                    localStorage.setItem('hf-car-templates-red-color', 'false');
                } else if (checkbox.id === 'blue-checkbox') {
                    blueColor = false;
                    localStorage.setItem('hf-car-templates-blue-color', 'false');
                } else if (checkbox.id === 'green-checkbox') {
                    greenColor = false;
                    localStorage.setItem('hf-car-templates-green-color', 'false');
                }
            }
        });
    }

    // Start observing the title elements until you found the racing wrap
    function observeTitleElements() {
        const pmItemsWraps = document.querySelectorAll('.pm-items-wrap');

        if (pmItemsWraps) {
            pmItemsWraps.forEach(function(pmItemsWrap) {

                // Find all title elements (car upgrades)
                const titleElements = pmItemsWrap.querySelectorAll('.title.t-overflow');

                titleElements.forEach(function(titleElement) {
                    highlightTitleContents(titleElement, pmItemsWrap);
                });
            });
        }
    }

    // Highlight upgrade titles based on the car upgrades
    function highlightTitleContents(titleElement, pmItemsWrap) {
        const titleText = titleElement.textContent.trim();

        // Check if not already included and if valid option
        if (carUpgrades.includes(titleText)) {
            loggedTitleElements.add(titleText); // Add to the set to avoid duplicate logging
            changeBackgroundColors(titleElement);
        } else {
            removeBackgroundColors(titleElement);
        }
    }

    // Remove previous background colours if upgrades are no longer wanted
    function removeBackgroundColors(titleElement) {
        const bgWrap = titleElement.closest('.bg-wrap');
        if (bgWrap) {
            // Check if the "info" div contains the specific text
            const infoDiv = bgWrap.querySelector('.info');
            if (infoDiv && infoDiv.textContent.trim() === 'Upgrade is already fitted to this car') {
                if (redColor === 'true' || redColor === true) {
                    bgWrap.style.background = 'rgba(247,103,7,0.15)'; // Red colour
                } else {
                    bgWrap.style.background = '';
                }
            } else {
                bgWrap.style.background = '';
            }
        }

        const boxWrap = titleElement.closest('.box-wrap');
        if (boxWrap) {
            const parentElement = boxWrap.parentElement; // Get the parent of box-wrap

            // Check if the "info" div contains the specific text
            const infoDiv = boxWrap.querySelector('.info');
            if (infoDiv && infoDiv.textContent.trim() === 'Upgrade is already fitted to this car') {
                if (redColor === 'true' || redColor === true) {
                    parentElement.style.background = 'rgba(247,103,7,0.15)'; // Red colour
                } else {
                    parentElement.style.background = '';
                }
            } else {
                parentElement.style.background = '';
            }
        }
    }

    // Change background colours for wanted  upgrades
    function changeBackgroundColors(titleElement) {
        const bgWrap = titleElement.closest('.bg-wrap');
        if (bgWrap) {

            // Check if the "info" div contains the specific text
            const infoDiv = bgWrap.querySelector('.info');
            if (infoDiv && infoDiv.textContent.trim() === 'Upgrade is already fitted to this car') {
                if (greenColor === 'true' || greenColor === true) {
                    bgWrap.style.background = 'rgba(116,184,22,0.15)'; // Green background
                } else {
                    bgWrap.style.background = '';
                }
            } else {
                if (blueColor === 'true' || blueColor === true) {
                    bgWrap.style.background = 'rgba(20, 113, 151, 0.15'; // Blue background
                } else {
                    bgWrap.style.background = '';
                }
            }
        }

        const boxWrap = titleElement.closest('.box-wrap');
        if (boxWrap) {
            const parentElement = boxWrap.parentElement; // Get the parent of box-wrap

            // Check if the "info" div contains the specific text
            const infoDiv = boxWrap.querySelector('.info');
            if (infoDiv && infoDiv.textContent.trim() === 'Upgrade is already fitted to this car') {
                if (greenColor === 'true' || greenColor === true) {
                    parentElement.style.background = 'rgba(116,184,22,0.15)'; // Green background
                } else {
                    parentElement.style.background = '';
                }
            } else {
                if (blueColor === 'true' || blueColor === true) {
                    parentElement.style.background = 'rgba(20, 113, 151, 0.15)'; // Blue background
                } else {
                    parentElement.style.background = '';
                }
            }
        }
    }

    // Change background colours based on radio buttons
    function updateUpgradeBackgrounds() {
        let radioOptions = document.querySelectorAll('.carScriptRadioButton');
        let selectedOptions = [];

        radioOptions.forEach(radio => {
            let container = radio.parentElement;

            if (radio.checked) {
                selectedOptions.push(radio.value);

                // Set the background color of all siblings to green
                Array.from(container.children).forEach(sibling => {
                    if (sibling !== radio) {
                        sibling.style.background = 'rgba(0, 191, 255, 0.5)';
                        sibling.style.color = 'var(--default-color)';
                    }
                });
            } else {
                // Reset the background color of all siblings to black
                Array.from(container.children).forEach(sibling => {
                    sibling.style.background = 'url(/images/v2/racing/header/stripy_bg.png) 0 0 repeat';
                    sibling.style.color = 'white';
                });
            }
        });
    }


    // Check if the user clicks 'Official Race' or 'Custom Race'
    function checkButtons() {
        let headerWrap = document.querySelector('.header-wrap');

        if (headerWrap) {
            document.querySelector('a[tab-value="race"]').addEventListener('click', function(event) {
                officialRace();
            });

            document.querySelector('a[tab-value="customrace"]').addEventListener('click', function(event) {
                customRace();
            });

        }
    }

    // When the user clicks 'Custom Race', check if they create or join a race
    function customRace() {
        const createRaceButtons = document.querySelectorAll('.btn-wrap.silver.c-pointer a.btn-action-tab');
        const joinRaceButtons = document.querySelectorAll('.join-wrap a.link.btn-action-tab');

        if (createRaceButtons && joinRaceButtons) {
            document.addEventListener('click', function(event) {
                const target = event.target;

                // Check if the clicked element is a "create race" button
                if (target.matches('.btn-wrap.silver.c-pointer a.btn-action-tab')) {
                    createCustomRace();
                }

                // Check if the clicked element is a "join race" button
                if (target.matches('.join-wrap a.link.btn-action-tab') || target.closest('.join-wrap a.link.btn-action-tab') || target.classList.contains('btn-action-form')) {

                    // Find the closest .active-row ancestor of the clicked button
                    const successRow = target.closest('.active-row');
                    if (successRow) {
                        // Find the track name within the success row element
                        const trackElement = successRow.querySelector('.track');
                        if (trackElement) {
                            let trackText = trackElement.textContent.trim();
                            chosenTrack = trackText.split('(')[0].trim();

                            let raceName = trackElement.querySelector('.hf-race-name');
                            if (raceName) {
                                let textContent = raceName.textContent;
                                chosenTrack = chosenTrack.replace(textContent, '').trim();
                            }

                            possibleTemplates = [];

                            for (let template of carTemplates) {
                                if (chosenTrack === template.name.split(':')[0].trim()) {
                                    possibleTemplates.push(template);
                                }
                            }

                            setTimeout(function() {
                                highlightSuggestedCar(possibleTemplates, chosenTrack);
                            }, 100);
                        } else {
                            setTimeout(customRace, 100)
                        }
                    } else {
                        console.error('[Racing: Car Templates] Something went wrong whilst trying to fetch the track name');
                    }
                }
            });
        } else {
            setTimeout(customRace, 100);
        }
    }

    // If the user creates a custom race, remember the track they choose
    function createCustomRace() {
        // Find the button by its class name
        let createButton = document.querySelector('[name="createCustomRace"]');

        if (createButton) {
            createButton.addEventListener('click', function() {
                let selectMenuStatus = document.querySelector('.ui-selectmenu');
                let mobileSelectMenu = document.querySelector('#select-racing-track');

                if (selectMenuStatus) {
                    chosenTrack = selectMenuStatus.textContent.trim();
                    possibleTemplates = [];

                    for (let template of carTemplates) {
                        if (template.name.includes(chosenTrack)) {
                            possibleTemplates.push(template);
                        }
                    }

                    setTimeout(function() {
                        highlightSuggestedCar(possibleTemplates, chosenTrack);
                    }, 100);
                } else if (mobileSelectMenu) {
                    let selectedOption = mobileSelectMenu.options[mobileSelectMenu.selectedIndex];
                    chosenTrack = selectedOption.textContent;

                    possibleTemplates = [];

                    for (let template of carTemplates) {
                        if (template.name.includes(chosenTrack)) {
                            possibleTemplates.push(template);
                        }
                    }

                    setTimeout(function() {
                        highlightSuggestedCar(possibleTemplates, chosenTrack);
                    }, 300);

                } else {
                    console.error('[Racing: Car Templates] Something went wrong whilst trying to fetch the track name');
                }
            });
        } else {
            setTimeout(createCustomRace, 100);
        }
    }

    // When the user clicks 'Official Race'
    function officialRace() {
        let joinButton = document.querySelector('a[href*="tab=race"][href*="section=changeRacingCar"][href*="step=getInRace"]');

        if (joinButton) {
            joinButton.addEventListener('click', function() {
                findOfficialTrack();
            });
        } else {
            setTimeout(officialRace, 100);
        }
    }

    // When the user joins an official race, remember the track they choose
    function findOfficialTrack() {
        let enlistWrap = document.querySelector('.enlist-wrap');

        if (enlistWrap) {
            let trackElement = document.querySelector('.enlisted-btn-wrap').textContent;

            if (trackElement) {
                chosenTrack = trackElement.split(' - Official race')[0].trim();

                possibleTemplates = [];

                for (let template of carTemplates) {
                    if (chosenTrack === template.name.split(':')[0].trim()) {
                        possibleTemplates.push(template);
                    }
                }

                setTimeout(function() {
                    highlightSuggestedCar(possibleTemplates, chosenTrack);
                }, 100);
            } else {
                console.error('[Racing: Car Templates] Something went wrong whilst trying to fetch the track name');
            }

        } else {
            setTimeout(findOfficialTrack, 100);
        }
    }

    // Display and highlight the suggested car based on the track and templates
    function highlightSuggestedCar(templates, chosenTrack) {
        if (chosenTrack == 'ENLIST ANOTHER CAR' || chosenTrack == '') {
            chosenTrack = 'unknown track';
            return;
        }

        let racingInfoWrap = document.querySelector('.racing-info-wrap');

        if (racingInfoWrap) {
            racingInfoWrap.style.paddingTop = '10px';

            let existingContainer = document.getElementById('hf-suggested-car-templates');
            if (existingContainer) {
                existingContainer.remove();
            }

            let container = document.createElement('div');

            container.id = 'hf-suggested-car-templates';
            container.style.background = 'linear-gradient(180deg, rgba(20, 113, 151, 0.5), rgba(20, 113, 151, 0.15))';
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';

            racingInfoWrap.appendChild(container);

            let textDivContainer = document.createElement('div');
            textDivContainer.style.padding = '8px';
            textDivContainer.style.borderRadius = '5px';

            let textDiv = document.createElement('p');
            textDiv.textContent = 'Suggested car template(s) for ' + chosenTrack + ':';
            textDiv.style.fontWeight = 'bold';
            textDiv.style.paddingBottom = '4px';

            textDivContainer.appendChild(textDiv);
            container.appendChild(textDivContainer);

            if (templates !== '') {

                templates.forEach(template => {
                    let templateName = template.name;
                    let noteRecogniser = template.noteRecogniser;

                    let index = templateName.indexOf(':');
                    if (index !== -1) {
                        let suggestedCar = templateName.substring(index + 1).trim();
                        let modelWithoutClass = suggestedCar.split(' ').slice(0, -1).join(' '); // Remove last word

                        let existingParagraph = document.getElementById('hf-racing-' + suggestedCar);

                        if (existingParagraph) {
                            existingParagraph.remove();
                        }

                        let paragraphContainer = document.createElement('div');
                        paragraphContainer.id = 'hf-racing-' + suggestedCar;
                        paragraphContainer.style.display = 'flex';
                        paragraphContainer.style.fontWeight = 'normal';

                        let paragraph = document.createElement('p');
                        paragraph.textContent = '\u2022 ' + suggestedCar + ' (' + noteRecogniser + ')';
                        paragraph.style.alignSelf = 'center';

                        paragraphContainer.appendChild(paragraph);

                        // Add button for editing noteRecogniser
                        let changeNoteRecogniserButton = document.createElement('button');
                        changeNoteRecogniserButton.textContent = ' ';
                        changeNoteRecogniserButton.style.color = 'white';
                        changeNoteRecogniserButton.onclick = function() {
                            changeTemplateNoteRecogniser(templateName, templates, chosenTrack);
                        };
                        changeNoteRecogniserButton.style.background = 'url(/images/v2/racing/edit_car_name.svg) no-repeat';
                        changeNoteRecogniserButton.style.width = '18px';
                        changeNoteRecogniserButton.style.height = '18px';
                        changeNoteRecogniserButton.style.cursor = 'pointer';
                        changeNoteRecogniserButton.style.transition = 'background-color 0.3s ease';
                        changeNoteRecogniserButton.style.marginTop = '6px';

                        // Add event listener to change background color on hover
                        changeNoteRecogniserButton.addEventListener('mouseenter', function(event) {
                            changeNoteRecogniserButton.style.backgroundPositionY = '-18px';
                        });

                        // Restore original background color when mouse leaves
                        changeNoteRecogniserButton.addEventListener('mouseleave', function() {
                            changeNoteRecogniserButton.style.backgroundPositionY = '0px';
                            changeNoteRecogniserButton.style.color = 'white';
                        });

                        paragraphContainer.appendChild(changeNoteRecogniserButton);

                        textDivContainer.appendChild(paragraphContainer);

                        // Loop through all the li elements
                        document.querySelectorAll('li').forEach(li => {
                            // Check if the list item contains modelWithoutClass
                            if (li.textContent.includes(modelWithoutClass)) {
                                if (li.textContent.includes(noteRecogniser)) {
                                    li.style.background = 'rgba(20, 113, 151, 0.15)';

                                    let enlistInfoWrap = li.querySelector('.enlist-info-wrap');
                                    enlistInfoWrap.style.background = 'rgba(20, 113, 151, 0.15';

                                    let enlistCar = li.querySelector('.enlist-car');
                                    enlistCar.style.background = 'rgba(20, 113, 151, 0.15';

                                    // Get the parent ul element
                                    let parentUl = li.parentNode;

                                    // Append li as first child
                                    parentUl.insertBefore(li, parentUl.firstChild);
                                }
                            } else {
                                li.style.background = '';

                                let enlistInfoWrap = li.querySelector('.enlist-info-wrap');

                                if (enlistInfoWrap) {
                                    enlistInfoWrap.style.background = '';
                                }

                                let enlistCar = li.querySelector('.enlist-car');

                                if (enlistCar) {
                                    enlistCar.style.background = '';
                                }

                            }
                        });
                    }
                });
            } else {
                let paragraph = document.createElement('p');
                paragraph.textContent = 'No template found for this track';
                paragraph.style.fontWeight = 'normal';
                paragraph.style.paddingTop = '4px';
            }
        } else {
            setTimeout(function() {
                highlightSuggestedCar(templates, chosenTrack);
            }, 100);
        }
    }

    // Deprecated, but leaving this here in case I do need it later
    function manuallyAddTrackName() {
        let existingContainer = document.getElementById('hf-racing-track-error');

        if (existingContainer) {
            return;
        }

        let enlistList = document.querySelector('.enlist-list');

        if (!enlistList) {
            setTimeout(manuallyAddTrackName, 100);
        }

        let delimiterElement = document.querySelector('.delimiter-999.m-top10');

        let container = document.createElement('div');
        container.id = 'hf-racing-track-error';
        container.style.paddingTop = '4px';

        let infoMsgDiv = document.createElement('div');
        infoMsgDiv.className = 'info-msg-cont border-round m-top10 factionMessageDiv';
        infoMsgDiv.style.background = 'red';

        // Create the inner div for the message content
        let innerDiv = document.createElement('div');
        innerDiv.className = 'info-msg border-round';

        // Create the icon element
        let iconElement = document.createElement('i');
        iconElement.className = 'info-icon';

        // Create the message container div
        let msgContainer = document.createElement('div');
        msgContainer.className = 'delimiter';

        // Create the message element
        let messageElement = document.createElement('div');
        messageElement.className = 'msg right-round';
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'assertive');

        let textElement = document.createElement('div');
        textElement.className = 'factionTextElement';
        textElement.textContent = 'There was an error fetching the track name. Click here to manually insert track Name';
        textElement.style.color = 'var(--default-red-color)';
        textElement.style.textDecoration = 'underline';

        textElement.addEventListener('click', function() {
            let manualTrack = prompt('Please manually enter the track name: ');

            if (manualTrack) {
                chosenTrack = manualTrack;
                container.remove();
                possibleTemplates = [];

                for (let template of carTemplates) {
                    if (chosenTrack.toLowerCase() === template.name.split(':')[0].trim().toLowerCase()) {
                        possibleTemplates.push(template);
                    }
                }

                setTimeout(function() {
                    highlightSuggestedCar(possibleTemplates, chosenTrack);
                }, 100);
            }
        });

        messageElement.appendChild(textElement);

        // Append elements to construct the message structure
        msgContainer.appendChild(messageElement);
        innerDiv.appendChild(iconElement);
        innerDiv.appendChild(msgContainer);
        infoMsgDiv.appendChild(innerDiv);
        container.appendChild(infoMsgDiv);
        delimiterElement.parentNode.insertBefore(container, delimiterElement);

    }

    // Function to handle the button click event
    function changeTemplateNoteRecogniser(selectedTemplateName, templates, chosenTrack) {
        // Find the corresponding template object
        let selectedTemplate = carTemplates.find(template => template.name === selectedTemplateName);

        // If template found, proceed
        if (selectedTemplate) {
            // Prompt with the current note recogniser pre-filled
            let newNoteRecogniser = prompt('Change the note recogniser for the template ' + selectedTemplate.name, selectedTemplate.noteRecogniser);

            // If user enters something and clicks OK
            if (newNoteRecogniser !== null) {
                // Update the note recogniser of the selected template
                selectedTemplate.noteRecogniser = newNoteRecogniser;

                // Save updated carTemplates to localStorage
                localStorage.setItem('carTemplates', JSON.stringify(carTemplates));

                // Alert the user
                alert("Note recogniser updated for " + selectedTemplateName);
            }

            if (templates && chosenTrack) {
                setTimeout(function() {
                    highlightSuggestedCar(templates, chosenTrack);
                }, 100);
            }
        } else {
            alert("No template selected.");
        }
    }

    // Initial script setup
    observeTitleElements();
    observeMessageElement();
    checkButtons();

    // Attach click event listener
    document.body.addEventListener('click', handleButtonClick);

    // Reconnect observer when a button is clicked
    function handleButtonClick(event) {
        const clickedElement = event.target;
        const isAnchor = clickedElement.tagName === 'a' || clickedElement.closest('a') !== null;

        if (isAnchor) {
            observeTitleElements();
            observeMessageElement();
            checkButtons();
            setTimeout(function() {
                if (clickedElement.classList.contains('page-number')) {
                    highlightSuggestedCar(possibleTemplates, chosenTrack);
                }
            }, 200);

            // Find the closest parent <li> element of the clicked <a> element
            const listItem = event.target.closest('li');

            // Check if listItem exists
            if (listItem) {
                const carNameSpan = listItem.querySelector('[class^="model-car-name-"]');

                if (carNameSpan) {
                    chosenCar = carNameSpan.textContent.trim();
                    addedCarNotes = false;
                }
            }
        }
    }

    let carChanges = {
        'Mitsubishi Evo X': 'Yotsuhada EVX',
        'Volvo 850': 'Stålhög 860',
        'Alfa Romeo 156': 'Alpha Milano 156',
        'BMW X5': 'Bavaria X5',
        'Seat Leon Cupra': 'Coche Basurero',
        'Vauxhall Astra GSI': 'Bedford Nova',
        'Volkswagen Golf GTI': 'Verpestung Sport',
        'Audi S3': 'Echo S3',
        'Ford Focus RS': 'Volt RS',
        'Honda s2': 'Edomondo S2',
        'Mini Cooper S': 'Nano Cavalier',
        'Sierra Cosworth': 'Colina Tanprice',
        'Lotus Exige': 'Cosmos EX',
        'Vauxhall Corsa': 'Bedford Racer',
        'Porsche 911 GT3': 'Sturmfahrt 111',
        'Subaru Impreza STI': 'Tsubasa Impressor',
        'TVR Sagaris': 'Wington GGU',
        'Aston Martin One-77': 'Weston Marlin 177',
        'Audi R8': 'Echo R8',
        'Bugatti Veyron': 'Stormatti Casteon',
        'Ferrari 458': 'Lolo 458',
        'Lamborghini Gallardo': 'Lambrini Torobravo',
        'Lexus LFA': 'Veloria LFA',
        'Mercedes SLR': 'Mercia SLR',
        'Nissan GT-R': 'Zaibatsu GT-R',
        'Honda Civic': 'Edomondo Localé',
        'Honda NSX': 'Edomondo NSX',
        'Audi TT Quattro': 'Echo Quadrato',
        'BMW M5': 'Bavaria M5',
        'BMW Z8': 'Bavaria Z8',
        'Chevrolet Corvette Z06': 'Chevalier CZ06',
        'Dodge Charger': 'Dart Rampager',
        'Pontiac Firebird': 'Knight Firebrand',
        'Ford GT40': 'Volt GT',
        'Hummer H3': 'Invader H3',
        'Audi S4': 'Echo S4',
        'Honda Integra R': 'Edomondo IR',
        'Honda Accord': 'Edomondo ACD',
        'Toyota MR2': 'Tabata RM2',
        'Volkswagen Beetle': 'Verpestung Insecta',
        'Chevrolet Cavalier': 'Chevalier CVR',
        'Ford Mustang': 'Volt MNG',
        'Reliant Robin': 'Trident',
        'Holden SS': 'Oceania SS',
        'Citroen Saxo': 'Limoen Saxon',
        'Classic Mini': 'Nano Pioneer',
        'Fiat Punto': 'Vita Bravo',
        'Nissan Micra': 'Zaibatsu Macro',
        'Peugeot 106': 'Çagoutte 10-6',
        'Renault Clio': 'Papani Colé',
    };

    // Function to replace one set of car names with another set in the templates
    function updateCarNames(oldName, newName) {
        let matchingTemplates = carTemplates.filter(template => {
            let templateName = template.name.toLowerCase();
            let searchTerm = oldName.toLowerCase();
            return templateName.includes(searchTerm);
        });

        matchingTemplates.forEach(template => {
            template.name = template.name.replace(oldName, newName);
        });
    }

    function adaptToNewCars() {
        settings = 'new';
        localStorage.setItem('hf-car-settings', settings);

        Object.entries(carChanges).forEach(([oldName, newName]) => {
            updateCarNames(oldName, newName);
        });

        carTemplates.sort(); // Order alphabetically for easiness

        localStorage.setItem('carTemplates', JSON.stringify(carTemplates)); // Set the default templates in storage

        location.reload();
    }

    function revertToOldCars() {
        settings = 'old';
        localStorage.setItem('hf-car-settings', settings);

        Object.entries(carChanges).forEach(([oldName, newName]) => {
            if (oldName === 'Volt GT40') {
                oldName = 'Volt GT';
            }

            updateCarNames(newName, oldName);
        });

        carTemplates.sort(); // Order alphabetically for easiness

        localStorage.setItem('carTemplates', JSON.stringify(carTemplates)); // Set the default templates in storage

        location.reload();
    }

    function addAdaptRevert() {
        let linksElement = document.getElementById('top-page-links-list');
        if (!linksElement) linksElement = document.body.querySelector('.linksContainer___LiOTN');

        if (!linksElement) {
            setTimeout(addAdaptRevert, 100);
            return;
        }

        linksElement.style.display = 'flex';
        linksElement.style.justifyContent = 'flex-end';
        linksElement.style.alignItems = 'center';

        let span = document.createElement('span');
        span.style.paddingRight = '8px';
        span.style.cursor = 'pointer';
        span.style.color = 'var(--default-blue-color)';

        linksElement.insertBefore(span, linksElement.children[0]);

        if (settings === 'old') {
            span.textContent = 'Adapt to new cars';
            span.onclick = adaptToNewCars;
        } else if (settings === 'new') {
            span.textContent = 'Revert to old cars';
            span.onclick = revertToOldCars;
        }
    }

    if (showAdaptRevert === true) {
        addAdaptRevert();
    }


})();

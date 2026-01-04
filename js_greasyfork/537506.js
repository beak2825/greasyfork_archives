// ==UserScript==
// @name         Education Perfect Uncummer - Track Ep Answers and Autoinput (list)
// @namespace    https://ep-uncum.surge.sh/
// @homepageURL  https://ep-uncum.surge.sh/
// @version      2.05
// @icon         https://ep-uncum.surge.sh/Fuck-Ep.svg
// @description  Extracts EP Answers and autoinput for vocabulary list activities - Semi Automatic Mode only - Autoclicker Supported
// @match        https://app.educationperfect.com/*
// @match        https://www.educationperfect.com/
// @grant        none
// @license      AGPL-3.0
// @author       Biggest Bricks
// @downloadURL https://update.greasyfork.org/scripts/537506/Education%20Perfect%20Uncummer%20-%20Track%20Ep%20Answers%20and%20Autoinput%20%28list%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537506/Education%20Perfect%20Uncummer%20-%20Track%20Ep%20Answers%20and%20Autoinput%20%28list%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var shit = false;
    var cum = false;
    var readbomb = false;
    var dash = false;
    var runningintervals = 0;
    var writing_continue = true;

    window.clear_ep_uncum_stats = function() {
        localStorage.setItem('answersripped', 0);
    }
    const storageKey = 'Answer_learning';
    window.help = function() {
        console.log("EP Uncum options:");
        console.log('Run clear_ep_uncum_stats() to clear the stats!');
        console.log('Run auto_change() to modify Full Auto Mode turn off or on');
        console.log('Run edit_learning() to modify the machine learning dictionary');

    }

    window.edit_learning = function() {
        // Fetch data from local storage
        let data = JSON.parse(localStorage.getItem(storageKey)) || [];

        // Wipe the current page's HTML
        document.body.innerHTML = '';

        // Create a container for the page content
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.maxWidth = '1000px';
        container.style.margin = 'auto';
        document.body.appendChild(container);

        // Add the main title (h1)
        const title = document.createElement('h2');
        title.innerText = 'Answer Learning Table';
        title.style.textAlign = 'center'; // Center the title
        title.style.marginBottom = '20px';
        container.appendChild(title);

        // Add the subheading (h2)
        const subheading = document.createElement('h1');
        subheading.innerText = 'Edit Lookup Table:';
        subheading.style.textAlign = 'center'; // Center the subheading
        subheading.style.marginBottom = '10px';
        subheading.style.fontSize = '13px';
        container.appendChild(subheading);

        // Display total number of keys (stats)
        const totalKeysText = document.createElement('p');
        totalKeysText.innerText = `Total keys: ${data.length}`;
        totalKeysText.style.textAlign = 'center'; // Center the stats
        totalKeysText.style.fontWeight = 'bold';
        totalKeysText.style.marginBottom = '20px';
        container.appendChild(totalKeysText);

        // Create a wrapper for scrollable content
        const scrollWrapper = document.createElement('div');
        scrollWrapper.style.maxHeight = '500px'; // Set max height to 500px (or adjust as needed)
        scrollWrapper.style.overflowY = 'auto'; // Enable vertical scrolling if content exceeds the height
        scrollWrapper.style.border = '1px solid #ccc'; // Add border for clarity
        scrollWrapper.style.padding = '10px';
        container.appendChild(scrollWrapper);

        // Create the table element
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '20px';
        scrollWrapper.appendChild(table);

        // Add table headers
        const headerRow = document.createElement('tr');
        const headers = ['Exact_Question', 'Correct_Answer', 'LIST_ID', 'Mode', 'Actions'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.innerText = headerText;
            th.style.border = '1px solid #ccc';
            th.style.padding = '10px';
            th.style.textAlign = 'left';
            th.style.backgroundColor = '#f4f4f4';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Render each row as editable
        data.forEach((item, index) => {
            const row = document.createElement('tr');

            // Create cells for each item field
            ['Exact_Question', 'Correct_Answer', 'LIST_ID', 'Mode'].forEach(field => {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = item[field];
                input.style.width = '100%';
                input.style.border = '1px solid #ccc';
                input.style.padding = '8px';
                td.appendChild(input);
                row.appendChild(td);

                // Update item value on input change
                input.addEventListener('input', () => {
                    item[field] = input.value;
                });
            });

            // Add Save button
            const actionTd = document.createElement('td');
            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.style.padding = '5px 10px';
            saveButton.style.marginRight = '5px';
            saveButton.style.cursor = 'pointer';
            saveButton.style.backgroundColor = '#4CAF50';
            saveButton.style.color = '#fff';
            saveButton.style.border = 'none';
            saveButton.style.borderRadius = '5px';
            actionTd.appendChild(saveButton);

            // Save changes for this row to local storage
            saveButton.addEventListener('click', () => {
                localStorage.setItem(storageKey, JSON.stringify(data));
                alert('Changes saved!');
            });

            // Add Delete button
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.backgroundColor = '#f44336';
            deleteButton.style.color = '#fff';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '5px';
            actionTd.appendChild(deleteButton);

            // Delete this row from local storage
            deleteButton.addEventListener('click', () => {
                data.splice(index, 1); // Remove the item at this index
                localStorage.setItem(storageKey, JSON.stringify(data)); // Update local storage
                row.remove(); // Remove the row from the table
                totalKeysText.innerText = `Total keys: ${data.length}`; // Update total keys count
                alert('Entry deleted!');
            });

            row.appendChild(actionTd);
            table.appendChild(row);
        });

        // Add a back button to restore the page (or you can navigate to a specific URL)
        const backButton = document.createElement('button');
        backButton.innerText = 'Back to EP';
        backButton.style.padding = '10px 15px';
        backButton.style.marginTop = '20px';
        backButton.style.cursor = 'pointer';
        backButton.style.backgroundColor = '#f44336';
        backButton.style.color = '#fff';
        backButton.style.border = 'none';
        backButton.style.borderRadius = '5px';
        container.appendChild(backButton);

        // Add an event listener to reload the original page content (for example, refresh)
        backButton.addEventListener('click', () => {
            location.reload();
        });
    };

    var fullauto = true;
    window.auto_change = function() {
        if (fullauto) {
            fullauto = false;
            console.log("fullauto mode set to:", false);
        } else {
            fullauto = true;
            console.log("fullauto mode set to:", true);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function sleepWholeProc(milliseconds) {
        const end = Date.now() + milliseconds;
        while (Date.now() < end) {
            // Tight loop that prevents any other code from running
        }
    }
    const warningTitleCSS = 'color:red; font-size:60px; font-weight: bold; -webkit-text-stroke: 1px black;';
    console.log('%cFuck Education Perfect!', warningTitleCSS);

    let inputField, copyButton;
    var answersripped = 0;
    var Local_Answers;

    var gamemode = null;

    if (localStorage.getItem('answersripped') != null) {
        answersripped = parseInt(localStorage.getItem('answersripped'));
        console.log('You have cheated: ' + answersripped + " answers in total!");
    } else {
        localStorage.setItem('answersripped', 0);
    }

    if (localStorage.getItem('Answer_learning') != null) {
        Local_Answers = JSON.parse(localStorage.getItem('Answer_learning'));
    } else {
        const starterlist = [{
            "Exact_Question": ".",
            "Correct_Answer": "sample",
            "LIST_ID": "1481608",
            "Mode": "Reading"
        }];
        localStorage.setItem('Answer_learning', JSON.stringify(starterlist));
        Local_Answers = starterlist;
    }

    var inputcreated = false;
    // Load Copyable Input Bar
    function addCopyableTextField(urltext) {
        const targetDiv = document.querySelector('#question-block');
        const containerDiv = document.createElement('div');
        containerDiv.style.marginTop = '10px';

        inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = urltext; // Initial text
        inputField.id = 'Copybar';
        inputField.style.width = '450px';
        inputField.style.padding = '10px';
        inputField.style.fontSize = '16px';
        inputField.setAttribute('readonly', true);

        copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Answer if entered wrong';
        copyButton.style.border = '1px solid #ccc';
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = '#fff';
        copyButton.style.padding = '10px 20px';
        copyButton.style.fontSize = '16px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.marginTop = '10px';

        const notification = document.createElement('div');
        notification.id = 'copyNotification';
        notification.textContent = 'Copied!';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#28a745';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';

        document.body.appendChild(notification);

        copyButton.addEventListener('click', () => {
            inputField.select();
            inputField.setSelectionRange(0, 99999);

            navigator.clipboard.writeText(inputField.value)
                .then(() => {
                    notification.style.opacity = '1';

                    setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 300);
                    }, 3000);
                })
                .catch(err => alert('Failed to copy text: ' + err));
        });

        containerDiv.appendChild(inputField);
        containerDiv.appendChild(copyButton);

        targetDiv.insertAdjacentElement('afterend', containerDiv);
    }

    // skip hint - this makes you get the question wrong, but it's better than waiting 30 secs
    function detectCheckSpellingHint() {
        const element = document.querySelector('.check-spelling-hint.shown');

        if (element) {

            var button = document.getElementById('submit-button');
            var scope = angular.element(button).scope();
            // Create a fake event object to pass into the function
            var fakeEvent = {
                originalEvent: {
                    isTrusted: true, // Mimic a trusted event
                    detail: 1, // Mimic a mouse event (detail != 0)
                    screenX: 100, // Mimic valid mouse coordinates
                    screenY: 100
                }
            };

            // Call the onSubmitClick function directly
            scope.self.onSubmitClick(fakeEvent);
        }
    }

    async function detect_incorrectanswers() {
        // Get the ExtractedAnswersDict from localStorage

        // Define a function to process the modal once the content is available
        function processModal() {
            var modal = document.querySelector('div[uib-modal-window="modal-window"].modal.modeless-answer-dialog.center-modal.fade.in');
            if (modal) {
                writing_continue = false;
                if (modal && !detected) {
                    const correctAnswerElementbrig = document.getElementById("correct-answer-field");

                    // Check if the correct answer element exists and has non-empty text content
                    if (correctAnswerElementbrig && correctAnswerElementbrig.textContent.trim() !== '') {

                        if (gamemode == "Reading" || gamemode == "Writing") {

                            var ExtractedAnswersDict = JSON.parse(localStorage.getItem('ExtractedAnswers'));
                            var correctAnswerbrig = correctAnswerElementbrig.textContent.trim();
                            console.log('Shit. I got an answer wrong. The question was ' + orig_question + '. The correct answer should be:', correctAnswerbrig);

                            var newstring;
                            const bricker = JSON.parse(localStorage.getItem("Answer_learning")) || [];

                            // Define the new item
                            const newItem = {
                                "Exact_Question": orig_question,
                                "Correct_Answer": correctAnswerbrig,
                                "LIST_ID": ExtractedAnswersDict.result.ID,
                                "Mode": gamemode
                            };

                            // Flag to check if the item was updated
                            let itemUpdated = false;

                            // Check if an item with the same Exact_Question exists
                            for (let i = 0; i < bricker.length; i++) {
                                if (bricker[i].Exact_Question === newItem.Exact_Question) {
                                    // Update the existing item
                                    bricker[i] = newItem;
                                    itemUpdated = true;
                                    break;
                                }
                            }

                            // If no item was updated, push the new item
                            if (!itemUpdated) {
                                bricker.push(newItem);
                            }

                            localStorage.setItem("Answer_learning", JSON.stringify(bricker));
                            Local_Answers = bricker;

                            console.log('Mistake learned from, should not happen again.');

                            // Set detected to true to prevent repeated actions
                            detected = true;
                            // for some reason this button was not important enough to be protected by anticheat
                            var bomb = document.getElementById("continue-button")
                            bomb.disabled = false;
                            bomb.click();
                        } else {
                            // click continue button
                            var bomb = document.getElementById("continue-button")
                            bomb.disabled = false;
                            bomb.click();
                        }
                    } else {
                        console.log('Correct answer field not found or still empty.');
                    }
                }
            } else {

                // If modal is not found, reset detected flag

                writing_continue = true;
                detected = false;
            }
        }

        // Use setInterval to periodically check for the modal and correct answer field
        const intervalId = setInterval(() => {
            if (detected) {
                const modal = document.querySelector('div.modal-content[uib-modal-transclude] div.modal-body.v-group.h-align-center.ng-scope table tbody tr.prompt td#question-label');
                if (!modal) {
                    detected = false;
                }
                clearInterval(intervalId); // Stop checking if detected is true
            } else {
                processModal(); // Check and process the modal content
            }
        }, 50); // Check every 500 milliseconds
    }


    var localselected = false;
    var machineselected = true;
    var lastseen = 0;

    // 'inject' known correct answers before the sound does
    function Locansinjector() {
        var ExtractedAnswersDict = JSON.parse(localStorage.getItem('ExtractedAnswers'));
        var questionbrig = "";
        const tmpelement = document.querySelector('#question-text');

        if (tmpelement) {
            questionbrig = tmpelement.textContent; // Fetch the question text
        }

        if (tmpelement) {
            let inputField = null;
            const allElements = document.querySelectorAll('#answer-text');

            // Get the input field
            allElements.forEach(element => {
                if (element.tagName === 'INPUT') {
                    inputField = element;
                }
            });

            // Process answers
            for (let i = 0; i < Local_Answers.length; i++) {
                if (Local_Answers[i].Exact_Question == questionbrig &&
                    ExtractedAnswersDict.result.ID == parseInt(Local_Answers[i].LIST_ID) &&
                    gamemode == Local_Answers[i].Mode) {

                    console.log("Found question in learn bank! Injecting it!");

                    // Clear the input field's value
                    inputField.value = ''; // Clear the field completely

                    // Set the correct answer
                    inputField.value = Local_Answers[i].Correct_Answer;

                    // Dispatch input and change events to simulate user interaction
                    inputField.dispatchEvent(new Event('input', {
                        bubbles: true
                    }));
                    inputField.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));

                    break;
                }
            }
        }
    }


    var firstanselect = false;

    // A variable to store the question in case it's wrong
    var orig_question = null;
    var last_question;
    // Writing mode logic - Was going to use same logic for reading but it's quite inaccurate
    async function writingreadinglogic() {
        var AnsTextElement = document.querySelector("#question-text");

        if (AnsTextElement && AnsTextElement.textContent != '') {
            var Question = AnsTextElement.textContent;
            // attempted to add in last question checks but now unnessecary
            var grant = true;
            var ticker = 0;



            if (Question != last_question || grant) {
                orig_question = Question;
                let inputField = null;
                const allElements = document.querySelectorAll('#answer-text');
                allElements.forEach(element => {
                    if (element.tagName === 'INPUT') {
                        inputField = element;
                    }
                });
                // attempt to flush the existing value
                if (inputField.value != '') {
                    if (fullauto) {
                        if (dash) {} else {
                            if (inputField.value != 'null') {
                                var button = document.getElementById('submit-button');
                                var scope = angular.element(button).scope();
                                // Create a fake event object to pass into the function
                                var fakeEvent = {
                                    originalEvent: {
                                        isTrusted: true, // Mimic a trusted event
                                        detail: 1, // Mimic a mouse event (detail != 0)
                                        screenX: 100, // Mimic valid mouse coordinates
                                        screenY: 100
                                    }
                                };

                                // Call the onSubmitClick function directly
                                scope.self.onSubmitClick(fakeEvent);
                                last_question = Question;
                            }
                        }
                    }
                }
                if (inputField.value == '' && writing_continue) {

                    const modal = document.querySelector('div.modal-content[uib-modal-transclude] div.modal-body.v-group.h-align-center.ng-scope table tbody tr.prompt td#question-label');

                    if (modal) {
                        return null;
                    }
                    lastseen = 0;
                    ExtractedAnswersDict = JSON.parse(localStorage.getItem('ExtractedAnswers'));
                    AnsTextElement = document.querySelector("#question-text");
                    Question = AnsTextElement.textContent;
                    var locans = null;
                    for (let i = 0; i < ExtractedAnswersDict.result.Translations.length; i++) {
                        if (ExtractedAnswersDict.result.Translations[i].TargetLanguageDefinitions[0].Text == Question || ExtractedAnswersDict.result.Translations[i].BaseLanguageDefinitions[0].Text == Question) {
                            if (ExtractedAnswersDict.result.Translations[i].BaseLanguageDefinitions[0].Text == Question) {
                                locans = ExtractedAnswersDict.result.Translations[i].TargetLanguageDefinitions[0].Text;
                            }
                        } else if (ExtractedAnswersDict.result.Translations[i].TargetLanguageDefinitions[0].Text == Question) {
                            locans = ExtractedAnswersDict.result.Translations[i].BaseLanguageDefinitions[0].Text;

                        }
                    }

                    inputField.value = ''; // Clear the field completely

                    // Set the correct answer
                    inputField.value = locans;

                    // Dispatch input and change events to simulate user interaction
                    inputField.dispatchEvent(new Event('input', {
                        bubbles: true
                    }));
                    inputField.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));

                    Locansinjector();

                    if (fullauto) {
                        if (dash) {

                        } else {
                            if (inputField.value != 'null') {

                                var button = document.getElementById('submit-button');
                                var scope = angular.element(button).scope();
                                // Create a fake event object to pass into the function
                                var fakeEvent = {
                                    originalEvent: {
                                        isTrusted: true, // Mimic a trusted event
                                        detail: 1, // Mimic a mouse event (detail != 0)
                                        screenX: 100, // Mimic valid mouse coordinates
                                        screenY: 100
                                    }
                                };

                                // Call the onSubmitClick function directly
                                scope.self.onSubmitClick(fakeEvent);
                                last_question = Question;
                            }
                        }
                    }

                }
            } else {}
        } else {
            if (window.location.href.includes("list-starter") == false && window.location.href.includes("dashboard") == false) {} else {
                lastseen = lastseen + 1;
                // Flush command after element not seen for 100 ticks, assume activity is finished
                if (lastseen > 50) {

                    clearInterval(runningintervals);
                    shit = false;
                    cum = false;
                }
            }
        }
    }
    // Disable button to use Autoclicker
    async function disablebuttonuntilfilled() {
        let inputField = null;
        const allElements = document.querySelectorAll('#answer-text');
        const dashbutton = document.querySelector('.submit-button.nice-button.positive-green');
        allElements.forEach(element => {
            if (element.tagName === 'INPUT') {
                inputField = element;
                if (inputField.value == '') {
                    try {
                        document.getElementById("submit-button").disabled = true;
                    } catch (e) {}

                    if (dashbutton) {
                        dashbutton.disabled = true;
                    }

                } else {
                    try {
                        sleep(105);
                        document.getElementById("submit-button").disabled = false;
                    } catch (e) {}
                    if (dashbutton) {
                        sleep(105);
                        dashbutton.disabled = false;
                    }
                }
            }
        });
    }

    let detected = false; // Global flag to ensure the function runs only once



    function lockdashmode() {
        // Find the currently selected learning mode
        var selectedMode = document.querySelector('#learning-mode-selector .item.selected');

        if (selectedMode) {
            // Save the selected mode text to the gamemode variable
            var bombtmp = selectedMode.querySelector('.main-text')
            gamemode = bombtmp.textContent.trim();
        } else {}
    }


    // get gamemode for dash mode only
    function checkIfDashSelected() {
        var dashElement = document.querySelector('li[type="Dash"]');
        if (dashElement && dashElement.classList.contains('selected')) {
            lockdashmode();
        }
    }


    // Get gamemode - for normal list
    function getSelectedGameMode() {

        var dashElement = document.querySelector('[type="Dash"]');
        if (dashElement) {
            if (dashElement.classList.contains('selected')) {
                dash = true;
            } else {
                dash = false;
            }
        }
        if (dash) {
            if (gamemode == "Writing") {

                clearInterval(runningintervals);
                alert("Writing may be less accurate due to less accurate logic implementation!");
                alert("Be advised that Full Auto mode does not work with Writing and Dash due to timing restrictions");
                last_question = '';
                runningintervals = setInterval(writingreadinglogic, 200);
                shit = true;
            } else if (gamemode == "Dictation") {
                last_question = ''
                clearInterval(runningintervals);
                console.log("Dictation recognised - reversing answer logic")
                cum = true;
            } else {
                last_question = ''
                clearInterval(runningintervals);
                shit = false;
                cum = false;
            }
            setInterval(disablebuttonuntilfilled, 50);
            return gamemode;
        } else {
            const selectedItem = document.querySelector('#learning-mode-selector .item.selected');
            if (selectedItem) {
                const mainText = selectedItem.querySelector('.main-text');
                if (mainText) {
                    gamemode = mainText.textContent.trim();
                    if (gamemode == "Writing") {
                        clearInterval(runningintervals);
                        last_question = ''
                        alert("Writing may be less accurate due to less accurate logic implementation!");
                        runningintervals = setInterval(writingreadinglogic, 200);
                        shit = true;
                    } else if (gamemode == "Dictation") {
                        last_question = ''
                        clearInterval(runningintervals);
                        console.log("Dictation recognised - reversing answer logic")
                        cum = true;
                    } else {
                        last_question = ''
                        clearInterval(runningintervals);
                        shit = false;
                        cum = false;
                    }
                    setInterval(disablebuttonuntilfilled, 50);
                    return mainText.textContent.trim();
                }
            }
            return null;
        }
    }

    function waitForElement(selector, callback) {
        var interval = setInterval(function() {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }



    function changeButtonText() {
        var button = document.getElementById('refresh-button');
        if (button) {
            var span = button.querySelector('span');
            if (span) {
                span.textContent = 'Click if Answer does not auto-generate!'; // Desired text
            }
        }
    }


    var mirroredobj = null;
    var firstclickhandled = false;
    var cheated = 0;

    // Main Logic
    var dictionarycreated = false;
    var answer = null;
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (method === 'POST' && url.includes('services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetPreGameDataForClassicActivity')) {
            this.addEventListener('load', function() {
                try {
                    const responseData = this.responseText;
                    var ExtractedAnswers = JSON.parse(responseData);
                    try {
                        localStorage.removeItem('ExtractedAnswers');
                    } catch (e) {}
                    localStorage.setItem('ExtractedAnswers', JSON.stringify(ExtractedAnswers));
                    console.log("Extracted Answers into local storage, JSON: ", ExtractedAnswers);
                    dictionarycreated = true
                } catch (e) {
                    console.error('Failed to store response:', e);
                }
            });
        }

        return originalOpen.apply(this, arguments);
    };

    if (dictionarycreated == false && cheated > 0) {
        alert("Dictionary Not Created! Reload to level start! (expect this on session start or page reload)");
    }

    if (gamemode == null && window.location.href.includes("list-starter") == false && window.location.href.includes("dashboard") == false && window.location.href.includes("activity-starter") == false && window.location.href.includes("www.educationperfect.com") == false && window.location.href.includes("learning") == false && window.location.href.includes("library") == false && window.location.href.includes("account") == false && (window.location.href.includes("game") == true || window.location.href.includes("dash") == true)) {
        alert("WARNING! Gamemode not detected, and script requires it! Exiting game!");
        open(window.location.href.replace("game", "list-starter").replace("dash", "list-starter"), "_self");
        // Set Autoclicker Support
        setInterval(disablebuttonuntilfilled, 5);
    }
    if (shit == true) {
        alert("Writing mode detected - Switching to legacy crap scripts");
    }


    console.log("Tracking Audio Playback for answer spoof");
    var ExtractedAnswersDict = JSON.parse(localStorage.getItem('ExtractedAnswers'));
    console.log(ExtractedAnswersDict);

    function hookHowler() {
        if (typeof Howl === 'undefined') {
            console.error('Howler.js is not loaded on this page.');
            return;
        }
        const originalPlay = Howl.prototype.play;
        Howl.prototype.play = async function() {
            const result = originalPlay.apply(this, arguments);
            const allElements = document.querySelectorAll('#answer-text');
            allElements.forEach(element => {
                if (element.tagName === 'INPUT') {
                    inputField = element;
                }
            });
            if (this._src && !shit) {
                ExtractedAnswersDict = JSON.parse(localStorage.getItem('ExtractedAnswers'));
                console.log('Tracked Audio file link:', this._src);
                var audiofilelink = this._src;
                if (audiofilelink.includes("https://static.educationperfect.com") || audiofilelink.includes("http://static.educationperfect.com")) {
                    const element = document.querySelector('#question-text');
                    if (element) {
                        const textContent = element.textContent;
                        orig_question = textContent;
                    }
                    var audiofile = audiofilelink.substring(audiofilelink.lastIndexOf('/') + 1);
                    var FolderIDe = audiofilelink.substring(0, audiofilelink.lastIndexOf('/') + 1).replace("educationperfect.com", "languageperfect.com");
                    FolderIDe = FolderIDe.substring(0, FolderIDe.length - 1)
                    // Catalog folderID

                    const FolderIDArray = new Array(ExtractedAnswersDict.result.SoundFileData.Folders.length).fill(null);
                    for (let i = 0; i < ExtractedAnswersDict.result.SoundFileData.Folders.length; i++) {
                        FolderIDArray[i] = ExtractedAnswersDict.result.SoundFileData.Folders[i].ID;

                    }
                    var SOUNDID = null;
                    var DEFID = null;
                    var locans = null;
                    var FOLDERID = null;
                    var definition = null;
                    var restriction = false;
                    var restriction_string = '';
                    var restrictiontype = null;
                    const foldidarr = [];
                    //detect multi-solution problems

                    const questionelement = document.querySelector('#question-text');
                    const textContent = questionelement.textContent;

                    detected = false;
                    for (let i = 0; i < ExtractedAnswersDict.result.SoundFileData.Folders.length; i++) {
                        if (FolderIDe == ExtractedAnswersDict.result.SoundFileData.Folders[i].Path) {
                            FOLDERID = ExtractedAnswersDict.result.SoundFileData.Folders[i].ID;
                            foldidarr[foldidarr.length] = FOLDERID;
                            console.log("Found FOLDERID:", FOLDERID);
                        }
                    }
                    if (FOLDERID == null) {
                        alert("Could not find FOLDERID of sound file. Try reloading the dictionary!")
                    } else {
                        for (let i = 0; i < ExtractedAnswersDict.result.SoundFileData.Files.length; i++) {
                            if (ExtractedAnswersDict.result.SoundFileData.Files[i].FilePath == audiofile && foldidarr.includes(ExtractedAnswersDict.result.SoundFileData.Files[i].FolderID)) {

                                SOUNDID = ExtractedAnswersDict.result.SoundFileData.Files[i].ID;
                                console.log("found ID :", SOUNDID);
                                break;
                            }
                        }
                        if (SOUNDID == null) {
                            alert("Could not find ID of sound file. Try reloading the dictionary!")
                        } else {
                            for (let i = 0; i < ExtractedAnswersDict.result.SoundFileData.Links.length; i++) {
                                if (ExtractedAnswersDict.result.SoundFileData.Links[i].SoundFiles[0] == SOUNDID) {
                                    DEFID = ExtractedAnswersDict.result.SoundFileData.Links[i].Definition;
                                    console.log("found DEFID : ", DEFID);
                                    break;
                                }
                            }
                            if (DEFID == null) {
                                alert("SOUND ID not found in dictionary")
                            } else {
                                for (let i = 0; i < ExtractedAnswersDict.result.Translations.length; i++) {
                                    for (let ig = 0; ig < ExtractedAnswersDict.result.Translations[i].TargetLanguageDefinitions.length; ig++) {

                                        if (ExtractedAnswersDict.result.Translations[i].TargetLanguageDefinitions[ig].ID == DEFID || ExtractedAnswersDict.result.Translations[i].BaseLanguageDefinitions[0].ID == DEFID) {
                                            if (ExtractedAnswersDict.result.Translations[i].BaseLanguageDefinitions[0].ID == DEFID) {

                                                // Check for exclusions
                                                if (cum == true) {
                                                    locans = ExtractedAnswersDict.result.Translations[i].BaseLanguageDefinitions[0].Text;
                                                } else {
                                                    locans = ExtractedAnswersDict.result.Translations[i].TargetLanguageDefinitions[0].Text;
                                                }
                                            } else if (ExtractedAnswersDict.result.Translations[i].TargetLanguageDefinitions[ig].ID == DEFID) {
                                                if (cum == true) {
                                                    locans = ExtractedAnswersDict.result.Translations[i].TargetLanguageDefinitions[ig].Text;
                                                } else {
                                                    locans = ExtractedAnswersDict.result.Translations[i].BaseLanguageDefinitions[0].Text;
                                                }
                                            }

                                            if (locans == null) {
                                                alert("ERROR - Error retriving answer! Please reload the game!")
                                            }

                                            console.log("answers found", locans);
                                            let inputField = null;
                                            const allElements = document.querySelectorAll('#answer-text');
                                            allElements.forEach(element => {
                                                if (element.tagName === 'INPUT') {
                                                    inputField = element;
                                                    cheated = cheated + 1;
                                                }
                                            });

                                            if (inputField.value == '') {

                                                inputField.value = locans;

                                                // Dispatch input and change events to simulate user interaction
                                                inputField.dispatchEvent(new Event('input', {
                                                    bubbles: true
                                                }));
                                                inputField.dispatchEvent(new Event('change', {
                                                    bubbles: true
                                                }));

                                                answersripped = parseInt(answersripped) + 1;
                                                localStorage.setItem('answersripped', answersripped);
                                                Locansinjector();
                                                const vbar = document.getElementById('Copybar');
                                                if (inputcreated == true) {
                                                    vbar.setAttribute('readonly', false);
                                                    vbar.value = locans;
                                                    vbar.setAttribute('readonly', true);
                                                } else {
                                                    addCopyableTextField(locans);
                                                    inputcreated = true;
                                                }
                                                // ChatGPT cracked EP's anticheat in seconds whereas I took a month unsuccessfully
                                                // Jonathan Morgan, Go fuck yourself
                                                if (fullauto) {
                                                    if (dash) {
                                                        var button = document.querySelector('.submit-button.nice-button.positive-green');

                                                        // Step 2: Retrieve the AngularJS scope for the button element
                                                        var scope = angular.element(button).scope();

                                                        // Step 3: Create a fake event object to mimic a real user action (trusted event)
                                                        var fakeEvent = {
                                                            originalEvent: {
                                                                isTrusted: true, // Mimic a trusted event
                                                                detail: 1, // Mimic a mouse event (detail != 0)
                                                                screenX: 100, // Mimic valid mouse coordinates
                                                                screenY: 100
                                                            }
                                                        };

                                                        // Step 4: Make sure `self.canSubmit` is true to bypass any disabling logic
                                                        scope.$apply(function() {
                                                            scope.self.canSubmit = true;
                                                        });

                                                        // Step 5: Call the `onSubmitClicked` function directly with the fake event
                                                        scope.self.onSubmitClicked(fakeEvent);
                                                    } else {
                                                        var button = document.getElementById('submit-button');
                                                        var scope = angular.element(button).scope();
                                                        // Create a fake event object to pass into the function
                                                        var fakeEvent = {
                                                            originalEvent: {
                                                                isTrusted: true, // Mimic a trusted event
                                                                detail: 1, // Mimic a mouse event (detail != 0)
                                                                screenX: 100, // Mimic valid mouse coordinates
                                                                screenY: 100
                                                            }
                                                        };

                                                        // Call the onSubmitClick function directly
                                                        scope.self.onSubmitClick(fakeEvent);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }

            }

            return result;
        };
    }

    // Wait for Howler.js to be available and then hook into it
    function waitForHowler() {
        if (typeof Howl !== 'undefined') {
            hookHowler();
        } else {
            setTimeout(waitForHowler, 100);
        }
    }
    setInterval(changeButtonText, 1000);
    // Start waiting for Howler.js
    waitForHowler();
    // Send the gamemode dunction when clicked
    function brick() {
        waitForElement('#start-button-main', function() {
            var startButton = document.getElementById('start-button-main');
            if (startButton) {
                inputcreated = false;
                startButton.addEventListener('click', getSelectedGameMode);
            }
        });
    }


    // Interval runners

    setInterval(checkIfDashSelected, 300);
    setInterval(brick, 1000);
    setInterval(detectCheckSpellingHint, 500);
    setInterval(detect_incorrectanswers, 300);


})();

// ==UserScript==
// @name         [V.O.T.T] Employee Addiction
// @namespace    http://tampermonkey.net/
// @version      1.2.10
// @description  Display employee addiction values and message them with text when click on name
// @author       DaoChauNghia [3029549]
// @match        https://www.torn.com/*php*
// @exclude      https://www.torn.com/preferences*
// @exclude      https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480492/%5BVOTT%5D%20Employee%20Addiction.user.js
// @updateURL https://update.greasyfork.org/scripts/480492/%5BVOTT%5D%20Employee%20Addiction.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    //////////////////////////////////// USER SETTINGS - CUSTOMIZE HERE /////////////////////////////////////

    /// Change the addiction caution threshold below - This will apply YELLOW when employee addiction come over this ///
    var addictionCautionThreshold = -8;

    /// Change the addiction danger threshold below - This will apply RED when employee addiction come over this ///
    var addictionDangerThreshold = -10;

    /// (unit: DAY) Change the last action threshold below - This will apply YELLOW and RED when user last action is equal and over, respectively  ///
    var lastActionThreshold = 2;

    //////////////////////////////////// USER SETTINGS - CUSTOMIZE HERE /////////////////////////////////////

    var controls = {}; // Initialize an empty dictionary to store control elements


    // #region Copy text and open mail page

    function copyTextAndOpenPage_addition(name, employeeId, addiction) {
        let copyText;
        if (addiction < addictionDangerThreshold) {
            copyText = `Good day my friend ${name}, your addict is ${addiction} which is high, time to go to rehab!`; /// Change the text here ///
        } else {
            copyText = ``;
        }

        // Copy text to clipboard
        copyToClipboard(copyText);

        // Display an alert
        alert(`Employee Addiction Text Content copied to clipboard! :)`);
        //alert(`Text "${copyText}" copied to clipboard! Opening new page to compose message.`);
        if (confirm("Do you want to open mail to this employee for pasting the copied text?")) {
            // Open new page
            const composeUrl = `https://www.torn.com/messages.php#/p=compose&XID=${employeeId}`;
            window.open(composeUrl, '_blank');
            //inputText(copyText);
        } else {
            // Code to cancel the deletion
        }
    }

    function copyTextAndOpenPage_relative(name, employeeId, relative) {
        let copyText;
        const relativeDate = parseInt(relative.split(" ")[0]); // Extract the numerical value from the relative string
        const relativeTime = relative.split(" ")[1]; // Extract the time unit from the relative string
        if (relativeTime === 'days') {
            if (!isNaN(relativeDate) && relativeDate > lastActionThreshold) {
                copyText = `Good day my friend ${name}, your last action is ${relative} which is not good for company performance. \nPlease help to maintain your online at least once a day. Your online is important to the company.`; /// Change the text here ///
            } else {
                copyText = ``;
            }
        }

        // Copy text to clipboard
        copyToClipboard(copyText);

        // Display an alert
        alert(`Employee Last Action Text Content copied to clipboard! :)`);
        //alert(`Text "${copyText}" copied to clipboard! Opening new page to compose message.`);
        if (confirm("Do you want to open mail to this employee for pasting the copied text?")) {
            // Open new page
            const composeUrl = `https://www.torn.com/messages.php#/p=compose&XID=${employeeId}`;
            window.open(composeUrl, '_blank');
            //inputText(copyText);
        } else {
            // Code to cancel the deletion
        }
    }

    // Function to input text to the mail page
    function inputText(Text, employeeId) {
        const composeUrl = `https://www.torn.com/messages.php#/p=compose&XID=${employeeId}`;
        const newWin = window.open(composeUrl, '_blank');
        var newDocument = newWin.document;
        newDocument.addEventListener('load', async function () {
            newDocument.querySelector('#tinymce.mce-content-body').innerHTML = Text;
        });


    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // #endregion

    // #region Collapse Settings

    // Function to save collapse/uncollapse state
    function saveCollapseState() {
        localStorage.employeeBox = JSON.stringify(controls);
    }

    // Function to retrieve collapse/uncollapse state
    function getCollapseState() {
        const storedControls = JSON.parse(localStorage.employeeBox || '{}');
        controls.boxMinimized = storedControls.boxMinimized || false;
    }

    // #endregion

    // #region API Key Validation

    // Function ask the user for the API key
    var storedApiKey = GM_getValue('apiKey');
    function askforapikey() {
        storedApiKey = prompt('Please enter your Torn API key (or click "Cancel" to skip):') || 'null';
        if (storedApiKey !== 'null') {
            GM_setValue('apiKey', storedApiKey);
            location.reload();
        } else {
            alert('You have chosen not to provide an API key. The script will not run.');
            GM_setValue('apiKey', storedApiKey);
        }
    }

    // Function to check the API key
    async function checkApiKey(apiKey) {
        const apiUrl = `https://api.torn.com/company/?selections=employees&key=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.error);
        }

        return response.json();
    }

    // Check if the API key is stored
    if (!storedApiKey || storedApiKey === 'null') {
        askforapikey();
    }

    // Check the API key everytime the website is loaded
    if (storedApiKey !== 'null') {
        try {
            const checkapi = await checkApiKey(storedApiKey);
            if (checkapi.error) {
                if (checkapi.error.code === 2 || checkapi.error.code === 16) {
                    alert(`Error. Please enter a valid limited Torn API key.`);
                    askforapikey();
                    return; // Terminate the script to prevent further execution
                } else if (checkapi.error.code === 6 || checkapi.error.code === 7) {
                    console.error(`[Employee Addiction] Error: ${checkapi.error.error}. \nAre you jobless or in TornJob? Script will not run.`);
                    return; // Terminate the script to prevent further execution
                }
            }
        } catch (error) {
            console.error(`Error during API key validation: ${error}`);

            // If access level is not high enough or incorrect key, re-ask the user for the API key
            if (error === 'Access level of this key is not high enough' || error === 'Incorrect key') {
                alert(`Error: ${error}. Please enter a valid Torn API key.`);
                GM_setValue('apiKey', 'null');
                return; // Terminate the script to prevent further execution
            }
        }
    }

    // #endregion

    getCollapseState();

    // #region Main Script

    // Fetch data using the validated API key
    if (storedApiKey !== 'null') {
        try {
            const data = await checkApiKey(storedApiKey);
            const companyEmployees = data.company_employees;
            const allEmployeeIds = Object.keys(companyEmployees);

            // Create a new div element
            const employBox = document.createElement('div');

            // Set attributes for the new div
            employBox.id = 'employBox';
            employBox.style.marginTop = '10px';

            // Create a new div element for the delimiter
            const delimiter = document.createElement('hr');
            delimiter.className = 'delimiter___neME6';

            // Append the delimiter as a child of the employBox
            employBox.appendChild(delimiter);

            // Add a box name "Addiction" at the top
            const boxName = document.createElement('span');
            boxName.style.fontWeight = '700';
            boxName.textContent = 'Addiction';

            // Create a button for collapse/uncollapse
            const collapseButton = document.createElement('a');
            collapseButton.className = 't-blue'; // Add the "t-blue" class
            if (controls.boxMinimized) {
                collapseButton.textContent = '[Show]';
            } else {
                collapseButton.textContent = '[Hide]';
            }
            collapseButton.style.marginLeft = '10px'; // Right margin set to 10px
            collapseButton.style.float = 'right'; // Float to the right

            // Create a div for the content below the box name
            const contentBelowBox = document.createElement('div');
            contentBelowBox.id = 'contentBelowBox';
            if (controls.boxMinimized) {
                contentBelowBox.style.display = 'none';
            } else {
                contentBelowBox.style.display = 'block';
            }

            // Toggle the visibility of the content below the box name and update the button text on click
            collapseButton.addEventListener('click', () => {
                controls.boxMinimized = !controls.boxMinimized;
                if (controls.boxMinimized) {
                    collapseButton.textContent = '[Show]';
                    contentBelowBox.style.display = 'none';
                } else {
                    collapseButton.textContent = '[Hide]';
                    contentBelowBox.style.display = 'block';
                }
                saveCollapseState();
            });

            // Append the box name and collapse/uncollapse button to the employBox
            employBox.appendChild(boxName);
            employBox.appendChild(collapseButton);

            // Append the contentBelowBox as a child of the employBox
            employBox.appendChild(contentBelowBox);

            // Initialize an empty dictionary to store employee names, addiction values, and relative values
            const Employ = {};

            allEmployeeIds.forEach(employeeId => {
                const employee = companyEmployees[employeeId];
                const name = employee.name;
                const addiction = employee.effectiveness.addiction || 0;
                const relative = employee.last_action.relative || "N/A"; // Default to "N/A" if relative is not present

                // Add employee name, addiction value, and relative value to the dictionary
                Employ[name] = { addict: addiction, relative: relative };

                // Create a row for each employee with name, addiction value, and relative value
                const row = document.createElement('p');
                row.style.lineHeight = '20px';
                row.style.textDecoration = 'none';
                row.id = `employee${employeeId}`;

                // Create a link element for copying to clipboard and opening a new page
                const copyLink = document.createElement('a');
                copyLink.className = 't-blue href desc';
                copyLink.style.display = 'block'; // Display as block to stack elements vertically
                copyLink.href = '#';
                copyLink.textContent = name;

                /*

                // Add a click event listener to copy the text and open a new page
                copyLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    copyTextAndOpenPage_addition(name, employeeId, addiction);
                });

                // Check if addiction value is below the threshold, and change the name color accordingly
                if (addiction < addictionDangerThreshold) {
                    copyLink.style.color = 'red';
                }

                */

                // Create a span element for the addiction value
                const addictionSpan = document.createElement('span');
                addictionSpan.style.cursor = 'pointer';
                addictionSpan.style.display = 'inline-block'; // Display as inline-block to be on the same line as the link
                addictionSpan.textContent = `Addiction: ${addiction}`;

                // Add a click event listener to copy the text and open a new page
                addictionSpan.addEventListener('click', (event) => {
                    event.preventDefault();
                    copyTextAndOpenPage_addition(name, employeeId, addiction);
                });

                // Check if addiction value is below the threshold, and change the name color accordingly
                if (addiction < addictionCautionThreshold && addiction > addictionDangerThreshold) {
                    addictionSpan.style.color = '#d4d400'; // Nerve color for values over threshold
                } else if (addiction < addictionDangerThreshold) {
                    addictionSpan.style.color = 'red'; // Color in red for values over threshold
                }

                // Create a span element for the relative value
                const relativeSpan = document.createElement('span');
                relativeSpan.style.cursor = 'pointer';
                relativeSpan.style.display = 'block'; // Display as block to move to the next line
                relativeSpan.textContent = `Last action: ${relative}`;

                // Add a click event listener to copy the text and open a new page
                relativeSpan.addEventListener('click', (event) => {
                    event.preventDefault();
                    copyTextAndOpenPage_relative(name, employeeId, relative);
                });

                // Check if ralative value is at the threshold, and change the name color accordingly
                const relativeDate = parseInt(relative.split(" ")[0]); // Extract the numerical value from the relative string
                const relativeTime = relative.split(" ")[1]; // Extract the time unit from the relative string
                if (relativeTime === 'days') {
                    if (!isNaN(relativeDate) && relativeDate === lastActionThreshold) {
                        relativeSpan.style.color = '#d4d400'; // Nerve color for values over 2 days ago
                    } else if (!isNaN(relativeDate) && relativeDate > lastActionThreshold) {
                        relativeSpan.style.color = 'red'; // Color in red for values over 3 days ago
                    }
                }

                // Append the link and spans to the row
                row.appendChild(copyLink);
                row.appendChild(addictionSpan);
                row.appendChild(relativeSpan);

                // Append the row to the contentBelowBox
                contentBelowBox.appendChild(row);

                console.log(`${name}'s addiction value: ${addiction}, relative value: ${relative}`);
            });

            // ... (your existing code)

            // Log the final dictionary
            console.log('Employ Dictionary:', Employ);

            // Append the employBox as a child of the element with class 'content___GVtZ_'
            document.querySelector('.content___GVtZ_').appendChild(employBox);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    } else {
        console.log('User has chosen not to provide an API key or entered an incorrect key.');

        // Clear stored API key so that the prompt is shown again on the next visit
        GM_setValue('apiKey', 'null');
    }

    // #endregion

})();

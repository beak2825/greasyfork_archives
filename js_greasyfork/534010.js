// ==UserScript==
// @name         Dead Frontier Alternative Launcher
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds buttons to extract the private key and launch Dead Frontier from a .bat - for windows or .sh file - for linux os
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534010/Dead%20Frontier%20Alternative%20Launcher.user.js
// @updateURL https://update.greasyfork.org/scripts/534010/Dead%20Frontier%20Alternative%20Launcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Variable to store the private key
    let privateKey = '';

    // Define a variable to control the default state of the "Erase launch file after running" checkbox
    const isCheckboxChecked = true; // Set to true for checked, false for unchecked

    /******************************************************
         * WINDOWS SETTINGS *
    ******************************************************/
    // Editable application path WINDOWS
    const applicationPathWindows = "C:\\Program Files (x86)\\Dead Frontier\\DeadFrontier.exe"; // Change this path as needed WINDOWS OS

    //command for .bat file to delete itself https://stackoverflow.com/questions/20329355/how-to-make-a-batch-file-delete-itself#20333575
    //if "Erase launch file after running" selected:
    const Bat_del_itself = `(goto) 2>nul & del "%~f0" & cmd /c exit /b 10\n`;
    /******************************************************
    ******************************************************/

    /******************************************************
         * LINUX SETTINGS *
    ******************************************************/
    const applicationPathLinux = "/home/xxxx/.wine/drive_c/Program Files (x86)/Dead Frontier/DeadFrontier.exe"; // Change this path as needed LINUX OS

    const Sh_del_itself = `rm -- "$0"\n`;//add command to .sh file delete itself https://stackoverflow.com/questions/8981164/self-deleting-shell-script
    /******************************************************
     * END OF SETTINGS*
    ******************************************************/

    // Create the button to show the private key
    const showKeyButton = document.createElement('button');
    showKeyButton.textContent = 'Show Authentication Token';
    showKeyButton.style = `
    display: inline-block; /* Change to inline-block */
    margin: 20px 10px; /* Adjust margin for spacing */
    padding: 10px 20px;
    font-size: 18px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

    // Create the "Copy Authentication Token" button
    const copyTokenButton = document.createElement('button');
    copyTokenButton.textContent = 'Copy Authentication Token';
    copyTokenButton.style = `
    display: inline-block; /* Change to inline-block */
    margin: 20px 10px; /* Adjust margin for spacing */
    padding: 10px 20px;
    font-size: 18px;
    background-color: #00BFFF; /* color for copy button */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;
    // Create the button to launch Dead Frontier
    const launchButton = document.createElement('button');
    launchButton.textContent = 'Launch Dead Frontier';
    launchButton.style = `
        display: block;
        margin: 20px;
        padding: 10px 20px;
        font-size: 18px;
        background-color: #28A745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;


    // Create a checkbox for automatic deletion
    const deleteCheckbox = document.createElement('input');
    deleteCheckbox.type = 'checkbox';
    deleteCheckbox.id = 'deleteCheckbox';
    deleteCheckbox.style = `
    width: 20px; /* Increase width for visibility */
    height: 20px; /* Increase height for visibility */
    margin-left: 3px; /* Space between checkbox and label */
    margin-right: 3px; /* Space between checkbox and button */
`;

    // Create a label for the checkbox
    const deleteLabel = document.createElement('label');
    deleteLabel.textContent = 'Erase launch file after running';
    deleteLabel.setAttribute('for', 'deleteCheckbox');
    deleteLabel.style = `
    font-size: 18px;
    color: white;
    margin-left: 3px; /* Space between checkbox and label */
    background-color: #000000; /* Background color */
    padding: 3px; /* Padding around the label */
    border-radius: 4px; /* Rounded corners */
`;

    // Create a textbox to display the extracted text
    const textBox = document.createElement('textarea');
    textBox.style = `
        display: block;
        margin: 10px auto;
        width: 30%;
        height: 18px; /* Adjusted height for better aesthetics */
        font-size: 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        text-align: center; /* Center the text */
        resize: none; /* Disable resizing */
        margin-top: -20px;
    `;
    textBox.readOnly = true;
    deleteCheckbox.checked = isCheckboxChecked; // This line sets the checkbox to be checked

    // Create a disclaimer element
    const disclaimer = document.createElement('div');
    disclaimer.textContent = "Disclaimer: The Authentication Token should not be shared with anyone!";
    disclaimer.style = `
        text-align: center;
        color: #FF0000; /* Red color for emphasis */
        margin-top: -53px;
        font-size: 14px;
    `;

    // Create a wrapper for the launch button and checkbox
    const launchWrapper = document.createElement('div');
    launchWrapper.style = `
    display: flex;
    align-items: center; /* Center vertically */
    justify-content: center; /* Center horizontally */
    margin: 0px 0 25px 0; /* Adjust margin for spacing (top, right, bottom, left) */
    `;
    // Create a wrapper for the show and copy buttons
    const tokenButtonWrapper = document.createElement('div');
    tokenButtonWrapper.style = `
    display: flex;
    align-items: center; /* Center vertically */
    justify-content: center; /* Center horizontally */
    margin: 0px 0 -30px 0; /* Adjust margin for spacing (top, right, bottom, left) */
    `;

    // Create a main wrapper for all elements
    const mainWrapper = document.createElement('div');
    mainWrapper.style = `
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    align-items: center; /* Center elements horizontally */
    margin: -165px; /* Add some margin */
    `;

    // Append the checkbox and label to the wrapper
    // Append the launch button to the wrapper
    tokenButtonWrapper.appendChild(launchButton);
    // Append the checkbox and label to the wrapper
    tokenButtonWrapper.appendChild(deleteCheckbox);
    tokenButtonWrapper.appendChild(deleteLabel);

    // Append elements to the body
    // Append the show key button and copy token button to the wrapper

    launchWrapper.appendChild(copyTokenButton);
    launchWrapper.appendChild(showKeyButton);

    // Append the token button wrapper and launch wrapper to the main wrapper
    mainWrapper.appendChild(tokenButtonWrapper);
    mainWrapper.appendChild(launchWrapper);

    // Append the textbox and disclaimer to the main wrapper
    mainWrapper.appendChild(textBox);
    mainWrapper.appendChild(disclaimer);

    // Finally, append the main wrapper to the body
    document.body.appendChild(mainWrapper);



    // Event listener for copying the token
    copyTokenButton.addEventListener('click', function() {
        const buttons = document.querySelectorAll('button[onclick]');
        let found = false; // Flag to check if a URL was found
        for (const button of buttons) {
            const onclickContent = button.getAttribute('onclick');
            const match = onclickContent.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
                privateKey = match[1]; // Store the private key in the variable
                //textBox.value = "\"" + privateKey + "\""; // Optionally display the private key
                found = true; // Set flag to true
                break; // No need to continue searching
            }
        }

        if (found) {
            navigator.clipboard.writeText(privateKey).then(function() {
                // Change button color to indicate success
                copyTokenButton.style.backgroundColor = '#32CD32'; // Change to green
                copyTokenButton.textContent = 'Successfully Copied Token'; // Change button text

                // Reset the button color and text after a delay
                setTimeout(() => {
                    copyTokenButton.style.backgroundColor = '#00BFFF'; // Reset to original color
                    copyTokenButton.textContent = 'Copy Authentication Token'; // Reset text
                }, 2000); // Change back after 2 seconds
            }, function() {
                const textarea = document.createElement('textarea');
                textarea.value = privateKey;
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                    document.execCommand('copy');
                    // Change button color to indicate success
                    copyTokenButton.style.backgroundColor = '#32CD32'; // Change to green
                    copyTokenButton.textContent = 'Successfully Copied Token'; // Change button text

                    // Reset the button color and text after a delay
                    setTimeout(() => {
                        copyTokenButton.style.backgroundColor = '#6C757D'; // Reset to original color
                        copyTokenButton.textContent = 'Copy Authentication Token'; // Reset text
                    }, 2000); // Change back after 2 seconds
                } catch (err) {
                    alert('Failed to copy the token. Please copy manually.');
                }
                document.body.removeChild(textarea);
            });
        } else {
            // Optionally, you can change the button color to indicate failure
            copyTokenButton.style.backgroundColor = '#dc3545'; // Change to red for error
            setTimeout(() => {
                copyTokenButton.style.backgroundColor = '#00BFFF'; // Reset to original color
            }, 2000); // Change back after 2 seconds
        }
    });

    // Event listener for showing the private key
    showKeyButton.addEventListener('click', function() {
        const buttons = document.querySelectorAll('button[onclick]');
        let found = false; // Flag to check if a URL was found
        for (const button of buttons) {
            const onclickContent = button.getAttribute('onclick');
            const match = onclickContent.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
                privateKey = match[1]; // Store the private key in the variable
                textBox.value = "\"" + privateKey + "\""; // Optionally display the private key
                found = true; // Set flag to true
                break; // No need to continue searching
            }
        }
        if (!found) {
            textBox.value = "No Authentication Token found."; // Display message if not found
        }
    });

    // Event listener for launching Dead Frontier
    launchButton.addEventListener('click', function() {
        const buttons = document.querySelectorAll('button[onclick]');
        let found = false; // Flag to check if a URL was found
        for (const button of buttons) {
            const onclickContent = button.getAttribute('onclick');
            const match = onclickContent.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
            if (match) {
                privateKey = match[1]; // Store the private key in the variable
                found = true; // Set flag to true
                break; // No need to continue searching
            }
        }

        if (found) {
            // Determine the operating system and create the appropriate file
            let fileContent;
            let fileName;

            if (navigator.userAgent.indexOf("Win") !== -1) {
                // Windows: Create a .bat file
                fileName = 'launch_dead_frontier.bat';
                //contents of the batch the script creates:
                const windowsBat = `@echo off
start "" "${applicationPathWindows}" "${privateKey}"
`;
                fileContent = windowsBat
                if (deleteCheckbox.checked) {
                    fileContent += Bat_del_itself
                }
            } else {
                // Assume Linux: Create a .sh file
                fileName = 'launch_dead_frontier.sh';
                //contents of the sh the script creates:
                const linuxSh = `#!/bin/bash
# Launch Dead Frontier using Wine

WINE_PATH="${applicationPathLinux}"
KEY="${privateKey}"

# Launch the game
wine "$WINE_PATH" "$KEY"
`;
                fileContent = linuxSh
                if (deleteCheckbox.checked) {
                    fileContent += Sh_del_itself
                }
            }

            const blob = new Blob([fileContent], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } else {
            alert("No Authentication Token found. Please ensure you are on the correct page."); // Alert if no key is found
        }
    });
})();
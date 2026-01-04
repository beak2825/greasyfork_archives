// ==UserScript==
// @name         NixOS Search Copy shell-command to clipboard button
// @namespace    https://greasyfork.org/en/users/1050283
// @version      1.0.1
// @description  Add a button when hovering over an element with the class shell-command. When the button is clicked it should copy the value of the element with the class shell-command to the clipboard
// @author       sbm202
// @match        *://search.nixos.org/*
// @icon         https://nixos.org/favicon.png
// @license      MIT
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/462898/NixOS%20Search%20Copy%20shell-command%20to%20clipboard%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/462898/NixOS%20Search%20Copy%20shell-command%20to%20clipboard%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy the value of a shell command element to the clipboard
    function copyShellCommand(shellCommand) {
        const commandText = shellCommand.innerText;
        GM_setClipboard(commandText);
    }

    // Function to add the "copy" button to a shell command element
    function addCopyButton(shellCommand) {
        // Create a button with a solid blue circle
        const button = document.createElement('button');
        button.style.backgroundColor = 'red';
        button.style.borderRadius = '50%';
        button.style.width = '20px';
        button.style.height = '20px';
        button.style.marginLeft = '5px';
        // button.style.border = 'none';
        shellCommand.appendChild(button);

        // Add a "click" event listener to the button to copy the command to the clipboard
        button.addEventListener('click', () => {
            copyShellCommand(shellCommand);
        });
    }

    // Function to add the "copy" button to all shell command elements on the page
    function addCopyButtonsToShellCommands() {
        const shellCommands = document.querySelectorAll('.shell-command');
        shellCommands.forEach((shellCommand) => {
            if (!shellCommand.querySelector('button')) {
                addCopyButton(shellCommand);
            }
        });
    }

    // Add the "copy" button to all shell command elements on the page when the script is first run
    addCopyButtonsToShellCommands();

    // Schedule the "addCopyButtonsToShellCommands" function to run every 5 seconds
    setInterval(addCopyButtonsToShellCommands, 1000);

    // Add styles for the button
    GM_addStyle(`
        .shell-command button {
            display: inline-block;
            vertical-align: middle;
        }
    `);
})();

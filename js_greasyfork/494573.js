// ==UserScript==
// @name         VSCode Extensions Installer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a persistent button to install extensions directly into VSCode Insiders from the marketplace.
// @author       @tonycody
// @match        https://marketplace.visualstudio.com/items*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494573/VSCode%20Extensions%20Installer.user.js
// @updateURL https://update.greasyfork.org/scripts/494573/VSCode%20Extensions%20Installer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // The selector for the install button
    const installButtonSelector = 'a.install';
    // A class to identify the Insiders button
    const insidersButtonClass = 'install-insiders';
    const labelClass = '.ms-Button-label'

    // Function to add the Insiders install button if it doesn't exist
    function addInsidersInstallButton() {
        const installButton = document.querySelector(installButtonSelector);
        const alreadyAdded = document.querySelector('.' + insidersButtonClass);

        // Only add the button if it doesn't already exist
        if (installButton && !alreadyAdded) {
            const insidersButton = installButton.cloneNode(true);
            // Add a class to identify the button
            insidersButton.classList.add(insidersButtonClass);
            insidersButton.setAttribute('href', insidersButton.getAttribute('href').replace('vscode:', 'vscode-insiders:'));
            insidersButton.style.marginLeft = '3px';
            const lbl = insidersButton.querySelector(labelClass)
            lbl.innerText = 'Install(Insiders)'
            installButton.parentNode.insertBefore(insidersButton, installButton.nextSibling);
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(function (mutations, me) {
        // Retry adding the Insiders install button
        addInsidersInstallButton();
    });

    // Start observing the document body and check for DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial try to add the button
    addInsidersInstallButton();
})();
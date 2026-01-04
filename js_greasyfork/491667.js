// ==UserScript==
// @name         Copy Reportee Details from Moddog
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy report details into a workpost format.
// @author       kloob
// @match        https://www.gaiaonline.com/moddog/report/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491667/Copy%20Reportee%20Details%20from%20Moddog.user.js
// @updateURL https://update.greasyfork.org/scripts/491667/Copy%20Reportee%20Details%20from%20Moddog.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to format content with BBCode
    function formatWithBBCode(element) {
        // Extract the text content with ID and username
        let userInfoText = element.childNodes[0].textContent.trim();

        // Extract the ID using a regular expression
        let idMatch = userInfoText.match(/\[([0-9]+)\]/);
        let id = idMatch ? idMatch[1] : '';

        // Extract the username by removing the ID and trimming any extra whitespace
        let username = userInfoText.replace(/\[\d+\]/, '').trim();

        // Start building the BBCode string, wrapping the username in [b] tags
        let bbCodeContent = `[b]${username}[/b] | [${id}]\n`;

        // Initialize variables to hold BBCode for links
        let profileToolsBBCode = '';
        let modDogBBCode = '';

        // Iterate over all anchor tags and format as BBCode
        element.querySelectorAll('a').forEach(link => {
            if (link.textContent === 'ProfileTools') {
                profileToolsBBCode = `[url=${link.href}]Profile Tools[/url]`;
            } else if (link.textContent === 'ModDog') {
                modDogBBCode = `[url=${link.href}]Moddog[/url]`;
            }
            // We are excluding 'Send PM' and 'Other Reports' from BBCode
        });

        // Add the BBCode for the links to the content, with a separator if both are present
        if (profileToolsBBCode && modDogBBCode) {
            bbCodeContent += profileToolsBBCode + ' | ' + modDogBBCode;
        } else {
            bbCodeContent += profileToolsBBCode + modDogBBCode; // One of them might be empty
        }

        return bbCodeContent;
    }

    // Find the 'td.fname' element containing 'Offender Id'
    var offenderLabel = Array.from(document.querySelectorAll('td.fname')).find(td => td.textContent.trim() === 'Offender Id');

    if (offenderLabel) {
        var copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Info';
        copyButton.style = 'margin-right: 10px; display: inline-block; vertical-align: middle;';

        // Style the offenderLabel to maintain center alignment
        offenderLabel.style.display = 'flex';
        offenderLabel.style.alignItems = 'center';
        offenderLabel.style.justifyContent = 'center';

        // Insert the button at the beginning of the offenderLabel element
        if (offenderLabel.firstChild) {
            offenderLabel.insertBefore(copyButton, offenderLabel.firstChild);
        } else {
            offenderLabel.appendChild(copyButton);
        }

        copyButton.addEventListener('click', function(event) {
            event.preventDefault();
            var targetElement = offenderLabel.nextElementSibling;
            if (targetElement) {
                const bbCodeContent = formatWithBBCode(targetElement);
                navigator.clipboard.writeText(bbCodeContent).then(function() {
                    console.log('BBCode copied to clipboard');
                }).catch(function(err) {
                    console.error('Could not copy BBCode: ', err);
                });
            }
        });
    }
})();
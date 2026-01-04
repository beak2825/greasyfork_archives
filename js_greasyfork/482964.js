// ==UserScript==
// @name         ProlificPoster
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables Easy Posting of Prolific Hits on BB Forum
// @author       TOFFisherman
// @match        *://*.prolific.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482964/ProlificPoster.user.js
// @updateURL https://update.greasyfork.org/scripts/482964/ProlificPoster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes('prolific.com' && 'https://app.prolific.com/studies')) {
        console.log('This is a Prolific study.');

        // Create a button element
        const button = document.createElement('button');
        button.innerHTML = 'OTTO Forum';
        Object.assign(button.style, {
            backgroundColor: '#0C4BBA',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            position: 'fixed',
            top: '20%',
            right: '5%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
        });

        // Add the study's information to the button's tooltip
        button.title = document.title;

        // Add the button to the web page
        document.body.appendChild(button);

        // Add a click event listener to the button
        button.addEventListener('click', () => {
            // Select the required elements
            const titleElement = document.querySelector('h3.title');
            const hostElement = document.querySelector('span.host');
            const rewardPerHourElement = document.querySelector('span.reward-per-hour');
            const timeElement = document.querySelector('span.time');
            const descriptionElement = document.querySelector('div.description');
            const listElements = document.querySelectorAll('ol li');

            // Create a temporary table element
            const tempTable = document.createElement('table');
            Object.assign(tempTable.style, {
                borderCollapse: 'collapse',
                width: '100%',
            });

            // Add the required information to the table
            tempTable.innerHTML = `<tr>
                <td style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                    <div style="position: relative;">
                        <h3 style="margin: 0; padding: 0;">${titleElement.textContent}</h3>
                        <p style="margin: 0; padding: 0;">Host: ${hostElement.textContent}</p>
                        ${rewardPerHourElement ? `<p style="margin: 0; padding: 0;">Reward per Hour: ${rewardPerHourElement.textContent}</p>` : ''}
                        <p style="margin: 0; padding: 0;">Time: ${timeElement.textContent}</p>
                        ${descriptionElement ? `<p style="margin: 0; padding: 0;">Description: ${descriptionElement.textContent}</p>` : ''}
                        <p style="position: absolute; top: 0; right: 0; margin: 0; padding: 0; color: #0C4BBA; font-size: 12px; font-weight: bold;">
                            <a href="https://app.prolific.com/studies" target="_blank" style="color: #0C4BBA; text-decoration: none;">From Prolific</a>
                        </p>
                        <ul style="margin: 0; padding: 0;">`;

            listElements.forEach(element => {
                tempTable.innerHTML += `<li style="margin: 0; padding: 0;">${element.textContent}</li>`;
            });

            tempTable.innerHTML += `</ul>
                    </div>
                </td>
            </tr>`;

            // Copy the content with a border
            tempTable.style.display = 'table';

            // Create a temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = tempTable.outerHTML;

            // Append the textarea to the body
            document.body.appendChild(textarea);

            // Select the text in the textarea
            textarea.select();
            document.execCommand('copy');

            // Remove the temporary table and textarea elements
            document.body.removeChild(tempTable);
            document.body.removeChild(textarea);
        });
    } else {
        console.log('This is not a Prolific study.');
    }
})();
// ==UserScript==
// @name         Runway Winners On Homepage - Gaia Online
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display contests, winner name, and winner avatar for each Runway contest
// @author       kloob
// @match        https://www.gaiaonline.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488040/Runway%20Winners%20On%20Homepage%20-%20Gaia%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/488040/Runway%20Winners%20On%20Homepage%20-%20Gaia%20Online.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Function to display winners
function displayWinners() {
    fetch('https://www.gaiaonline.com/runway/')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const winners = doc.querySelectorAll('.winnercontent'); // Assuming this is the class wrapping each winner's info

            let winnersHTML = '<div style="text-align:center;">';

winners.forEach((winner) => {
    // Extract the contest name.
    const contestName = winner.querySelector('.title_theme.bold')?.textContent.trim() || 'Unknown Contest';
    // Extract the winner's image source URL.
    const imgSrc = winner.querySelector('.child_avatar img').src;
    // Extract the link element for the winner's username and profile link.
    const userLinkElement = winner.querySelector('.title_user a');
    const username = userLinkElement.textContent.trim();
    const userLink = userLinkElement.getAttribute('href');
    const marginTop = '30px';

    // Build the HTML, placing the contest name underneath the image.
    winnersHTML += `
        <div style="margin-bottom:20px; margin-top: ${marginTop};">
            <img src="${imgSrc}" style="max-width:100%;height:auto;">
            <div style="margin-top:0px;"><b>${contestName}</b></div>
            <div class="title_user" style="margin-top:5px;"><span>Winner: </span><a href="https://www.gaiaonline.com${userLink}" class="museum_link">${username}</a></div>
        </div>
    `;
});


            // Add any additional elements here, such as the "Enter Today" button

winnersHTML += `
                <a id="yui-gen4" class="cta-button" href="https://www.gaiaonline.com/runway/" style="font-family: ITCAvantGardePro-Md, Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 700; line-height: 16px; text-align: center; background-color: #ff0e90; color: #FFF; height: auto; width: auto; min-width: 120px; margin: 4px; padding: 10px 20px; display: inline-flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 25px; text-decoration: none;">
                    <span class="link">compete today!</span>
                </a>
            `;
            winnersHTML += '</div>';

            const targetDiv = document.getElementById('image-contest-frame');
            if (targetDiv) {
                targetDiv.innerHTML = winnersHTML;

                // Add hover effect for the "Enter Today" button
                const enterTodayBtn = document.getElementById('yui-gen4');
                if (enterTodayBtn) {
                    enterTodayBtn.addEventListener('mouseover', function() {
                        this.style.backgroundColor = 'rgb(106, 205, 216)'; // Hover color
                    });
                    enterTodayBtn.addEventListener('mouseout', function() {
                        this.style.backgroundColor = '#ff0e90'; // Original color
                    });
                }
            } else {
                console.error('Target div not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching the winners page:', error);
        });
}



function replaceTextInSpecificContext(newText) {
    const parentElement = document.querySelector('image-contest'); // Replace with a stable parent element selector
    if (!parentElement) {
        console.error('Parent element not found.');
        return;
    }

    const targetElement = Array.from(parentElement.querySelectorAll('div')).find(el => el.textContent.trim() === "coming soon"); // Adjust the selector as needed
    if (targetElement) {
        targetElement.textContent = newText;
    } else {
        console.error('Target element not found within parent.');
    }
}


// Wait for the DOM to be fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => replaceTextInSpecificContext('runway winners'));
} else {
    replaceTextInSpecificContext('runway winners');
}

    // Initialize styles and functionalities
    displayWinners();
    replaceTextInSpecificContext('runway winners');

    // Assuming 'displayWinners' and button hover effect logic are already implemented within 'displayWinners'
})();
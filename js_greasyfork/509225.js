// ==UserScript==
// @name         Scroll to Top and Bottom
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds buttons to scroll to the top and bottom of the page
// @author       Rob Clayton
// @match        https://workplace.plus.net/tickets/ticket_show.html?ticket_id=*
// @match        https://workplace.plus.net/reports/tickets/open_tickets_report.html?strAction=breakdown&intPartnerID=0&strCallCentre=*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/509225/Scroll%20to%20Top%20and%20Bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/509225/Scroll%20to%20Top%20and%20Bottom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.right = '10px';
    buttonContainer.style.top = '50%';
    buttonContainer.style.transform = 'translateY(-50%)';
    buttonContainer.style.zIndex = '1000';

    // Create Scroll to Top button
    const topButton = document.createElement('button');
    topButton.innerHTML = '⬆️';
    topButton.style.display = 'block';
    topButton.style.marginBottom = '10px';
    topButton.style.padding = '20px';
    topButton.style.backgroundColor = '#007BFF';
    topButton.style.color = 'white';
    topButton.style.border = 'none';
    topButton.style.borderRadius = '5px';
    topButton.style.cursor = 'pointer';
    topButton.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Create Scroll to Bottom button
    const bottomButton = document.createElement('button');
    bottomButton.innerHTML = '⬇️';
    bottomButton.style.display = 'block';
    bottomButton.style.padding = '20px';
    bottomButton.style.backgroundColor = '#007BFF';
    bottomButton.style.color = 'white';
    bottomButton.style.border = 'none';
    bottomButton.style.borderRadius = '5px';
    bottomButton.style.cursor = 'pointer';
    bottomButton.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    // Append buttons to the container
    buttonContainer.appendChild(topButton);
    buttonContainer.appendChild(bottomButton);

    // Append container to the body
    document.body.appendChild(buttonContainer);
   // Function to check if scrolling is possible
    function checkScrollability() {
        const scrollHeight = document.body.scrollHeight;
        const clientHeight = window.innerHeight;

        if (scrollHeight > clientHeight) {
            buttonContainer.style.display = 'block';  // Show buttons if content is scrollable
        } else {
            buttonContainer.style.display = 'none';   // Hide buttons if content is not scrollable
        }
    }

    // Check scrollability when the page loads and when resizing
    window.addEventListener('load', checkScrollability);
    window.addEventListener('resize', checkScrollability);
})();

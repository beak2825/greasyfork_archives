// ==UserScript==
// @name         Handshake Hide Jobs
// @namespace    https://github.com/bhackel
// @version      1.3
// @description  Add a button to hide jobs on Handshake
// @author       bhackel
// @match        https://*.joinhandshake.com/stu/postings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=joinhandshake.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483307/Handshake%20Hide%20Jobs.user.js
// @updateURL https://update.greasyfork.org/scripts/483307/Handshake%20Hide%20Jobs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const savedHiddenJobIds = GM_getValue('hiddenJobIds', '[]');
    // Convert the retrieved string back to an array
    let hiddenJobIds = JSON.parse(savedHiddenJobIds);

    function addButtonToDivs() {
        let targetDiv = document.querySelector("#skip-to-content > div:nth-child(4) > div > div:nth-child(1) > div > div > form > div:nth-child(2) > div > div > div > div:nth-child(3) > div > div");

        // 1st Page is different than others
        if (targetDiv === null) {
            targetDiv = document.querySelector("#skip-to-content > div:nth-child(4) > div > div:nth-child(1) > div > div > form > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div");
        }

        const childrenArray = [...targetDiv.children]; // convert from nodelist to array

        childrenArray.forEach(div => {
            // Ignore spacing divs
            if (div.querySelectorAll('div').length <= 1) {
                return;
            }
            // Unique identifier for each job
            let jobId = div.children[0].id;
            if (div.style.display !== 'none' && hiddenJobIds.includes(jobId)) {
                console.log("Hiding previously hidden job " + jobId);
                div.style.display = 'none';
            }

            // Check if div already contains a button
            const existingButton = div.querySelector('.bhackel-button');

            if (!existingButton) {
                const newButton = document.createElement('button');
                newButton.textContent = 'Hide';
                newButton.classList.add('bhackel-button'); // Add the class 'bhackel-button'
                newButton.addEventListener('click', () => {
                    console.log("Hiding job " + jobId);
                    div.style.display = 'none';
                    hiddenJobIds.push(jobId);
                    // Attempt to click the job below this one
                    let nextJobDiv = div.nextElementSibling.nextElementSibling;
                    setTimeout(function() {
                        nextJobDiv?.children[0]?.click();
                    }, 500);
                });
                div?.children[0]?.appendChild(newButton);
            }
        });

        GM_setValue('hiddenJobIds', JSON.stringify(hiddenJobIds));

    }

    // Check for new divs and add buttons every 5 seconds (you can adjust the interval)
    setInterval(addButtonToDivs, 5000);

})();
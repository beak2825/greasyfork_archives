// ==UserScript==
// @name         PP BOOSTER ACTIVATOR
// @version      2025-01-07
// @description  try to activate the privillage!
// @author       somebody like me
// @match        https://www.erepublik.com/id
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        none
// @namespace https://greasyfork.org/users/1144622
// @downloadURL https://update.greasyfork.org/scripts/523087/PP%20BOOSTER%20ACTIVATOR.user.js
// @updateURL https://update.greasyfork.org/scripts/523087/PP%20BOOSTER%20ACTIVATOR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const _token = csrfToken;

    const captcha = checkSessionValidationExists()
    if (!captcha) {
        observeAndCreateModal();
    }


    // Define the function outside createModal
async function activateBooster(index, activatedAmount) {
    const urlActivate = `https://www.erepublik.com/id/main/activateBooster`;
    const payload = ppbooster(_token);
    console.log(payload);
    await PostRequest(payload, urlActivate);
    console.log(`Activating booster #${index + 1}`);

    const responseText2 = document.getElementById('responseText2');
    if (responseText2) {
        responseText2.textContent = `${index + 1}/${activatedAmount} booster(s) activated`;
        responseText2.style.display = 'block';
    }
}

// MODAL BOX - - - - - - - - - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -
async function createModal(result) {
    // Check if the modal already exists
    if (document.getElementById('myModal')) {
        return; // Exit if modal is already present
    }

    // Create modal HTML with one input box and two buttons (Save and Travel)
    const modalHTML = `
    <div id="myModal" style="display:block; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
        <div style="background-color:white; margin:15% auto; padding:20px; border:1px solid #888; width:400px; max-width:90%; position:relative; display:flex; flex-direction:column;">
            <span id="closeModal" style="position:absolute; top:10px; right:10px; cursor:pointer; font-size:20px;">&times;</span>

            <h3 style="align-items:center;">TEMPORARY PP BOOSTER ACTIVATOR</h3>
            <h4>Booster amount: ${result.amount}</h4><br>

            <label for="target" style="font-size:16px; margin-bottom:5px;">Amount of booster to activate:</label>
            <input
                type="number"
                id="target"
                value="${result.amount}"
                max="${result.amount}"
                style="width:20%; padding:10px; font-size:16px; border:1px solid #ccc; border-radius:5px; box-shadow:0px 2px 4px rgba(0, 0, 0, 0.1);">

            <div style="display:flex; gap:10px; margin-top:20px;">
                <button type="button" id="activate" style="padding:10px 15px; font-size:16px; background-color:#007BFF; color:white; border:none; border-radius:5px; cursor:pointer; transition:0.3s;">Activate</button>
            </div>
            <!-- Placeholder for dynamic text -->
            <p id="responseText2" style="display:none; margin-top:10px; font-size:16px; color:blue;"></p>
            <p id="responseText1" style="display:none; margin-top:20px; font-size:16px; color:green;"></p>
        </div>
    </div>
    `;

    // Append modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get modal and close elements
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementById('closeModal');
    const activateButton = document.getElementById('activate');
    const targetInput = document.getElementById('target');
    const responseText1 = document.getElementById('responseText1');
    const responseText2 = document.getElementById('responseText2');

    // Show modal
    modal.style.display = 'block';

    // Close modal when 'X' is clicked
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of the modal content
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Input validation for the `max` attribute
    targetInput.addEventListener('input', function () {
        const max = parseInt(targetInput.max, 10);
        const value = parseInt(targetInput.value, 10);

        if (value > max) {
            targetInput.value = max; // Reset to max if exceeded
        }
    });

    // Button functionality
    activateButton.onclick = function() {
        const activatedAmount = parseInt(targetInput.value, 10);
        console.log(`Activating ${activatedAmount} boosters`);
        const time = activatedAmount * 3;

        // For loop to call the function and update the response text dynamically
        for (let i = 0; i < activatedAmount; i++) {
            setTimeout(() => {
                // Call the external function
                activateBooster(i, activatedAmount);

                // Final message
                if (i === activatedAmount - 1) {
                    responseText1.textContent = `Successfully activated ${activatedAmount} boosters!`;
                    responseText1.style.display = 'block';
                }
            }, i * 2800); // Delay for visible progress
        }
    };
}


//OBSERVER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Function to observe DOM changes and create the modal
    async function observeAndCreateModal() {
        await delay(1000);
        // Introduce a delay before starting to observe
        const inventory = await fetchData(`https://www.erepublik.com/id/economy/inventory-json`);
        const targetId = "100_prestige_points_1_180_temporary";
        const result = findObjectById(inventory, targetId);

        console.log(result);
        await delay(1000);

        let triggerCount = 0; // Counter for MutationObserver triggers
        const maxTriggers = 2; // Limit for triggers


        const observer = new MutationObserver((mutationsList) => {
            console.log(triggerCount);
            triggerCount += 1;

            // Check if the modal already exists
            if (!document.getElementById('myModal')) {
                createModal(result);
            }

            // Stop observing after reaching the trigger limit
            if (triggerCount >= maxTriggers) {
                observer.disconnect();
            }
        });

        // Start observing the document for changes
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }


    //functions
    function checkSessionValidationExists() {
        if (typeof SERVER_DATA !== 'undefined' && SERVER_DATA.sessionValidation !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function reloadPage() {
        const refresh = getLocalStorageData('refresh');
        const now = getCurrentUnixTimestamp();
        const next = now + 900;
        saveToLocalStorage('refresh', next);
        await delay(200);

        const culture = erepublik.settings.culture;
        window.location.href = `https://www.erepublik.com/${culture}`;
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            reloadPage();
            throw new Error(`Failed to fetch data from ${url}: ${error.message}`);

        }
    }

    // Function to send the payload using POST request
    async function PostRequest(payload, url) {
        try {
            await delay(1000);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: Object.keys(payload)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
                    .join('&')
            });

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error("Error:", error);
            reloadPage();
            return null;
        }
    }

    function getCurrentUnixTimestamp() {
        const currentTime = new Date();
        const unixTimestamp = Math.floor(currentTime.getTime() / 1000); // Convert milliseconds to seconds
        return unixTimestamp;
    }

    function findObjectById(data, targetId) {
        for (const category of data) {
            if (category.items) {
                const found = category.items.find(item => item.id === targetId);
                if (found) {
                    return found;
                }
            }
        }
        return null; // Return null if the object is not found
    }



    //payload
    function ppbooster(_token) {
        const type = "prestige_points";
        const quality = 1;
        const duration = 180;
        const amount = 1;
        const unit = "m";
        const value = 3;

        return {
            type,
            quality,
            duration,
            amount,
            unit,
            value,
            _token
        };
    }
})();
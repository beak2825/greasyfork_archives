// ==UserScript==
// @name         Cartel Empire - Robbery API Data Compiler
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fetch and process job API data for robberies with custom timestamp ranges and display it once done.
// @author       Baccy
// @match        https://cartelempire.online/Jobs
// @match        https://cartelempire.online/jobs
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518169/Cartel%20Empire%20-%20Robbery%20API%20Data%20Compiler.user.js
// @updateURL https://update.greasyfork.org/scripts/518169/Cartel%20Empire%20-%20Robbery%20API%20Data%20Compiler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // USER SETTINGS - Timestamps are in seconds, not milliseconds. Make sure you do not enter an end timestamp of milliseconds or you will be stuck in an infinite request loop
    const apiKey = 'APIKEY'; // Enter your Private - All API Key inside the '', replacing APIKEY
    const startTimestamp = 1731561852; // First from parameter. Enter your latest prestige timestamp or when you want to count from. Ensure you enter a valid timestamp.
    const endTimestamp = Date.now() / 1000; // End timestamp. Replace (Date.now() / 1000) with a single timestamp if there's a place you want to stop.
    const rangeIncrement = 45000; // Increment range in seconds. This is 100 x 7.5 minute farm robberies to ensure none are skipped and maximize each api request.
    const apiLimit = 75; // Maximum requests allowed in a minute. As of making this, we are allowed 200/min.

    // Rate limiting variables
    let fetchCounter = 0;
    let startTime = Date.now();

    // Create and add the button to the page
    const button = document.createElement('button');
    button.textContent = 'Fetch Job Data';
    button.style.marginRight = '10px';
    button.style.background = '#28a745';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '8px 12px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    // Append the button to the navbar
    setTimeout(() => {
        const container = document.querySelector('.navbar.navbar-expand-lg.navbar-dark.navbar-game.pb-sm-2.pb-0 > .container-fluid');
        if (container) {
            container.insertBefore(button, container.firstChild); // Insert the button as the first child
        }

        updateDisplay(); // Update with saved data if it exists
    }, 500);

    // Replace farm robbery description with data
    function updateDisplay() {
        // Define robbery types and their display titles
        const robberyTypes = {
            farm: "Farm Robbery",
            agave: "Agave Storehouse Robbery",
            coca: "Coca Paste Robbery",
            construction: "Construction Robbery"
        };

        // Iterate through each robbery type to update its respective card
        Object.keys(robberyTypes).forEach(type => {
            const robberyName = robberyTypes[type];
            const successCount = localStorage.getItem(`${type}RobberySuccessCount`);
            const failureCounts = JSON.parse(localStorage.getItem(`${type}RobberyFailureCounts`));
            const totalRewards = JSON.parse(localStorage.getItem(`${type}RobberyRewards`)) || {};
            const totalRep = localStorage.getItem(`${type}RobberyRepTotal`);

            console.log(robberyName, successCount, failureCounts, totalRewards, totalRep);

            if (successCount && failureCounts) {
                const robberyHeaders = document.querySelectorAll('.card-title.text-center.mb-2');
                robberyHeaders.forEach(header => {
                    if (header.textContent.trim() === robberyName) {
                        const cardText = header.nextElementSibling;

                        if (cardText && cardText.classList.contains('card-text') && cardText.classList.contains('flex-grow-1')) {
                            const startTimestamp = parseInt(localStorage.getItem('robberyStartTimestamp'));
                            const endTimestamp = parseInt(localStorage.getItem('robberyFetchTimestamp'));

                            // Format start and end dates
                            const startDate = new Date(startTimestamp * 1000);
                            const startDay = startDate.getUTCDate();
                            const startMonth = startDate.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });

                            const endDate = new Date(endTimestamp * 1000);
                            const endDay = endDate.getUTCDate();
                            const endMonth = endDate.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });

                            // Prepare the updated text
                            let updatedText = `${startDay} ${startMonth} - ${endDay} ${endMonth}\n`;
                            updatedText += `Success: ${successCount}\n`;

                            Object.keys(totalRewards).forEach(reward => {
                                updatedText += `${reward}: ${totalRewards[reward] || 0}\n`;
                            });

                            updatedText += `Rep: ${totalRep || 0}\n`;

                            if (failureCounts) {
                                updatedText += `Failed: ${failureCounts.failed}\n`;
                                updatedText += `Jailed: ${failureCounts.caught}\n`;
                                updatedText += `Hospitalised: ${failureCounts.hospitalised}\n`;
                            }

                            cardText.innerText = updatedText.trim();
                        }
                    }
                });
            }
        });
    }


    // Fetch data and process after completion
    async function fetchDataAndProcess(from, to) {
        let allData = [];

        while (from <= endTimestamp) {
            // Check for rate limiting
            if (fetchCounter >= apiLimit) {
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime < 60000) {
                    console.log(`Rate limit exceeded. Pausing for ${60 - Math.floor(elapsedTime / 1000)} seconds.`);
                    await new Promise(resolve => setTimeout(resolve, 60000 - elapsedTime)); // Wait for the remaining time
                }
                // Reset counter and timestamp
                fetchCounter = 0;
                startTime = Date.now();
            }

            const url = `https://cartelempire.online/api/user?type=events&key=${apiKey}&category=Jobs&from=${from}&to=${to}`;

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        onload: (res) => resolve(res),
                        onerror: (err) => reject(err),
                    });
                });

                const data = JSON.parse(response.responseText);

                fetchCounter++; // Increment fetch counter
                console.log(`Fetch #${fetchCounter} complete.`);

                if (data.events && data.events.length > 0) {
                    console.log('Fetched events:', data.events);

                    // Save data temporarily in memory
                    allData = allData.concat(data.events);

                    // Determine the next range
                    const lastEventCreated = data.events[0].created; // First event has the latest timestamp
                    const nextFrom = lastEventCreated + 1; // Add 1 second to avoid duplicate data

                    if (nextFrom <= endTimestamp) {
                        from = nextFrom;
                        to = Math.min(nextFrom + rangeIncrement, endTimestamp); // Ensure `to` doesn't exceed `endTimestamp`
                    } else {
                        console.log('Reached endTimestamp.');
                        break;
                    }
                } else {
                    console.warn(`No events found for range: ${from} to ${to}`);
                    from = to + 1; // Increment range to avoid infinite loop
                    to = Math.min(from + rangeIncrement, endTimestamp);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                break; // Exit on error to avoid infinite loop
            }
        }

        // After fetching is complete, process the data
        if (allData.length > 0) {
            console.log('All data fetched. Processing...');
            localStorage.setItem('eventsData', JSON.stringify(allData));

            // Counters for Farm Robbery results
            let totalFertilizer = 0;
            let totalMoney = 0;
            let totalRep = 0;

            // Define types of robberies and their failure messages
            const robberyTypes = {
                farm: {
                    success: 'You completed the Farm Robbery job',
                    failures: {
                        failed: 'You failed the Farm Robbery job!',
                        caught: 'You were caught by the police during the Farm Robbery job!',
                        hospitalised: 'You were hospitalised whilst attempting the Farm Robbery job!'
                    },
                    rewards: {
                        Fertiliser: /x(\d+)\s(Bag of Fertiliser)/
                    }
                },
                agave: {
                    success: 'You completed the Agave Storehouse Robbery job',
                    failures: {
                        failed: 'You failed the Agave',
                        caught: 'You were caught by the police during the Agave',
                        hospitalised: 'You were hospitalised whilst attempting the Agave'
                    },
                    rewards: {
                        Agave: /x(\d+)\s(Agave)/
                    }
                },
                coca: {
                    success: 'You completed the Coca Paste Robbery job',
                    failures: {
                        failed: 'You failed the Coca',
                        caught: 'You were caught by the police during the Coca',
                        hospitalised: 'You were hospitalised whilst attempting the Coca'
                    },
                    rewards: {
                        Coca: /x(\d+)\s(Coca)/
                    }
                },
                construction: {
                    success: 'You completed the Construction Robbery job',
                    failures: {
                        failed: 'You failed the Construction',
                        caught: 'You were caught by the police during the Construction',
                        hospitalised: 'You were hospitalised whilst attempting the Construction'
                    },
                    rewards: {
                        Nails: /x(\d+)\s(Nails)/,
                        Concrete: /x(\d+)\s(Concrete Bags)/,
                        Bricks: /x(\d+)\s(Bricks)/,
                        Steel: /x(\d+)\s(Steel)/
                    }
                }
            };

            const results = {};

            // Iterate through robbery types
            Object.keys(robberyTypes).forEach(type => {
                const robbery = robberyTypes[type];
                let totalRewards = {};
                let totalRep = 0;

                // Count successes
                const successEvents = allData.filter(event =>
                                                     event.description.includes(robbery.success)
                                                    );

                // Count rewards
                successEvents.forEach(event => {
                    Object.entries(robbery.rewards).forEach(([rewardKey, rewardRegex]) => {
                        const match = event.description.match(rewardRegex);
                        if (match) {
                            const rewardQuantity = parseInt(match[1]); // Capture the quantity (xN)
                            totalRewards[rewardKey] = (totalRewards[rewardKey] || 0) + rewardQuantity;
                        }
                    });

                    // Count reputation rewards
                    const matchRep = event.description.match(/and (\d+) rep/);
                    if (matchRep) {
                        totalRep += parseInt(matchRep[1]);
                    }
                });

                // Count failures
                const failureCounts = {};
                Object.keys(robbery.failures).forEach(failureType => {
                    failureCounts[failureType] = allData.filter(event =>
                                                                event.description.includes(robbery.failures[failureType])
                                                               ).length;
                });

                // Save results for this robbery type
                results[type] = {
                    successCount: successEvents.length,
                    rewards: totalRewards,
                    rep: totalRep,
                    failures: failureCounts
                };

                console.log("Results for", type, results[type]); // Debugging
            });

            // Save results to localStorage
            Object.keys(results).forEach(type => {
                const robberyResult = results[type];
                localStorage.setItem(`${type}RobberySuccessCount`, robberyResult.successCount);
                localStorage.setItem(`${type}RobberyRewards`, JSON.stringify(robberyResult.rewards));
                localStorage.setItem(`${type}RobberyRepTotal`, robberyResult.rep);
                localStorage.setItem(`${type}RobberyFailureCounts`, JSON.stringify(robberyResult.failures));
            });

            localStorage.setItem('robberyStartTimestamp', startTimestamp);
            localStorage.setItem('robberyFetchTimestamp', endTimestamp);

            updateDisplay(); // Display data once compiled
        } else {
            console.log('No data fetched. Nothing to process.');
            button.textContent = 'No Data Found';
        }

    }

    // Button click handler
    button.addEventListener('click', () => {
        const from = startTimestamp;
        const to = Math.min(from + rangeIncrement, endTimestamp);

        // Reset data and start fetching
        localStorage.setItem('eventsData', JSON.stringify([])); // Clear previous data
        fetchDataAndProcess(from, to);
    });
})();
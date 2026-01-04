// ==UserScript==
// @name         Cartel Empire - API Robbery Data Compiler
// @namespace    baccy.ce
// @version      0.2
// @description  Fetch job data and compile successes/failures/rewards for robbery jobs
// @author       Baccy
// @match        https://cartelempire.online/Jobs*
// @match        https://cartelempire.online/jobs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520260/Cartel%20Empire%20-%20API%20Robbery%20Data%20Compiler.user.js
// @updateURL https://update.greasyfork.org/scripts/520260/Cartel%20Empire%20-%20API%20Robbery%20Data%20Compiler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const button = document.createElement('button');
    button.textContent = 'Fetch Job Data';
    button.style.marginRight = '10px';
    button.style.background = '#28a745';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '8px 12px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    const container = document.querySelector('.navbar.navbar-expand-lg.navbar-dark.navbar-game.pb-sm-2.pb-0 > .container-fluid');
    if (container) {
        container.insertBefore(button, container.firstChild);
        updateDisplay();
    }

    async function fetchJobData() {
        let apiKey = localStorage.getItem("robberyAPIkey");
        if (!apiKey) {
            apiKey = prompt("Enter your API key:");
            if (!apiKey) {
                console.error("API key is required!");
                return;
            }
            localStorage.setItem("robberyAPIkey", apiKey);
        }
        console.log("API key loaded:", apiKey);

        const apiBaseUrl = "https://cartelempire.online/api/user";
        const jobCategory = "Jobs";
        const maxRequestsPerMinute = 75;
        const timeIncrement = 45000;
        const delayBetweenRequests = 60000 / maxRequestsPerMinute;
        const now = Math.floor(Date.now() / 1000);

        const storageKey = "robberyJobDatabase";
        let jobDatabase = JSON.parse(localStorage.getItem(storageKey)) || [];

        async function fetchJobs(params) {
            const url = `${apiBaseUrl}?type=events&key=${apiKey}&category=${jobCategory}&${new URLSearchParams(params)}`;
            const response = await fetch(url);
            if (!response.ok) {
                console.error("Failed to fetch data:", response.statusText);
                return [];
            }
            const data = await response.json();
            return data.events || [];
        }

        function saveDatabase() {
            localStorage.setItem(storageKey, JSON.stringify(jobDatabase));
        }

        if (jobDatabase.length === 0) {
            console.log("Fetching initial job data...");
            const initialData = await fetchJobs({ to: now });
            jobDatabase = [...initialData]; 
            saveDatabase();
        }

        let lastCreatedValue = (Math.max(...jobDatabase.map(job => job.created)) + 1);
        let toTime = lastCreatedValue + timeIncrement;

        while (lastCreatedValue < now) {
            console.log(`Fetching jobs from ${lastCreatedValue} to ${toTime}...`);
            const newJobs = await fetchJobs({ from: lastCreatedValue, to: toTime });

            const newLastCreatedValue = newJobs.length > 0 ? Math.max(...newJobs.map(job => job.created)) : lastCreatedValue;

            if (newJobs.length > 0 && newLastCreatedValue !== lastCreatedValue) {
                jobDatabase.push(...newJobs.reverse());
                saveDatabase();

                lastCreatedValue = newLastCreatedValue + 1;
                toTime = lastCreatedValue + timeIncrement;
            } else {
                console.log("No new data or progress detected, moving to next interval.");
                lastCreatedValue = toTime;
                toTime += timeIncrement;
            }

            await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
        }

        processJobData();

        console.log("Job database update complete!");
        alert("Job database update complete!");
    }

    function updateDisplay() {
        const robberyTypes = {
            farm: "Farm Robbery",
            agave: "Agave Storehouse Robbery",
            coca: "Coca Paste Robbery",
            construction: "Construction Robbery"
        };

        const processedResults = JSON.parse(localStorage.getItem('processedResults'));
        if (!processedResults) {
            console.error("No processed results found in localStorage.");
            return;
        }

        Object.keys(robberyTypes).forEach(type => {
            const robberyName = robberyTypes[type];
            const robberyData = processedResults[type];

            if (robberyData) {
                const { successCount, rewards, rep, failures } = robberyData;

                const robberyHeaders = document.querySelectorAll('.card-title.text-center.mb-2');
                robberyHeaders.forEach(header => {
                    if (header.childNodes[0].nodeValue.trim() === robberyName) {
                        const cardText = header.nextElementSibling;

                        if (cardText && cardText.classList.contains('card-text') && cardText.classList.contains('flex-grow-1')) {

                            let updatedText = '';
                            updatedText += `Success: ${successCount}\n`;

                            Object.keys(rewards).forEach(reward => {
                                updatedText += `${reward}: ${rewards[reward] || 0}\n`;
                            });

                            updatedText += `Rep: ${rep || 0}\n`;

                            if (failures) {
                                updatedText += `Failed: ${failures.failed || 0}\n`;
                                updatedText += `Jailed: ${failures.caught || 0}\n`;
                                updatedText += `Hospitalised: ${failures.hospitalised || 0}\n`;
                            }

                            cardText.innerText = updatedText.trim();
                        }
                    }
                });
            } else {
                console.warn(`No data found for robbery type: ${type}`);
            }
        });
    }

    function processJobData() {
        const storedData = localStorage.getItem('robberyJobDatabase');
        if (!storedData) {
            alert('No job data found in storage!');
            return;
        }

        const allData = JSON.parse(storedData);

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

        Object.keys(robberyTypes).forEach(type => {
            const robbery = robberyTypes[type];
            let totalRewards = {};
            let totalRep = 0;

            const successEvents = allData.filter(event =>
                event.description.includes(robbery.success)
            );

            successEvents.forEach(event => {
                Object.entries(robbery.rewards).forEach(([rewardKey, rewardRegex]) => {
                    const match = event.description.match(rewardRegex);
                    if (match) {
                        const rewardQuantity = parseInt(match[1]);
                        totalRewards[rewardKey] = (totalRewards[rewardKey] || 0) + rewardQuantity;
                    }
                });

                const matchRep = event.description.match(/and (\d+) rep/);
                if (matchRep) {
                    totalRep += parseInt(matchRep[1]);
                }
            });

            const failureCounts = {};
            Object.keys(robbery.failures).forEach(failureType => {
                failureCounts[failureType] = allData.filter(event =>
                    event.description.includes(robbery.failures[failureType])
                ).length;
            });

            results[type] = {
                successCount: successEvents.length,
                rewards: totalRewards,
                rep: totalRep,
                failures: failureCounts
            };
        });

        localStorage.setItem('processedResults', JSON.stringify(results));

        console.log('Processed Results:', results);
        updateDisplay();
    }

    button.addEventListener('click', fetchJobData);
})();

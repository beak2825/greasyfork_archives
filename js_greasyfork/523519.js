// ==UserScript==
// @name         Torn - City Job Upgrade Notice
// @namespace    baccy.nz
// @version      0.3
// @description  Makes an api request after 6:30pm TCT to check your current job, work stats and job points to see if you are able to upgrade to the next position, and displays a notice at the top of the page if you can upgrade. Click 'Fetch New Data' after upgrading to remove the notice. Toggle script button on job page.
// @author       Baccy
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523519/Torn%20-%20City%20Job%20Upgrade%20Notice.user.js
// @updateURL https://update.greasyfork.org/scripts/523519/Torn%20-%20City%20Job%20Upgrade%20Notice.meta.js
// ==/UserScript==

// An input for a minimal access API key will be displayed at the top of the in-game page if not found in storage

(function() {
    'use strict';

    const jobRequirements = {
        army: [
            { position: 'Private', manual_labor: 50, intelligence: 15, endurance: 20 },
            { position: 'Corporal', manual_labor: 120, intelligence: 35, endurance: 50 },
            { position: 'Sergeant', manual_labor: 325, intelligence: 60, endurance: 115 },
            { position: 'Master Sergeant', manual_labor: 700, intelligence: 160, endurance: 300 },
            { position: 'Warrant Officer', manual_labor: 1300, intelligence: 360, endurance: 595 },
            { position: 'Lieutenant', manual_labor: 2550, intelligence: 490, endurance: 900 },
            { position: 'Major', manual_labor: 4150, intelligence: 600, endurance: 1100 },
            { position: 'Colonel', manual_labor: 7500, intelligence: 1350, endurance: 2530 },
            { position: 'Brigadier', manual_labor: 10000, intelligence: 2000, endurance: 4000 },
            { position: 'General', manual_labor: null, intelligence: null, endurance: null }
        ],
        grocer: [
            { position: 'Bag Boy', manual_labor: 30, intelligence: 15, endurance: 50 },
            { position: 'Price Labeller', manual_labor: 50, intelligence: 35, endurance: 120 },
            { position: 'Cashier', manual_labor: 120, intelligence: 60, endurance: 225 },
            { position: 'Food Delivery', manual_labor: 250, intelligence: 200, endurance: 500 },
            { position: 'Manager', manual_labor: null, intelligence: null, endurance: null }
        ],
        casino: [
            { position: 'Dealer', manual_labor: 35, intelligence: 50, endurance: 120 },
            { position: 'Gaming Consultant', manual_labor: 60, intelligence: 115, endurance: 325 },
            { position: 'Marketing Manager', manual_labor: 360, intelligence: 595, endurance: 1300 },
            { position: 'Revenue Manager', manual_labor: 490, intelligence: 900, endurance: 2550 },
            { position: 'Casino Manager', manual_labor: 755, intelligence: 1100, endurance: 4150 },
            { position: 'Casino President', manual_labor: null, intelligence: null, endurance: null }
        ],
        medical: [
            { position: 'Medical Student', manual_labor: 100, intelligence: 600, endurance: 150 },
            { position: 'Houseman', manual_labor: 175, intelligence: 1000, endurance: 275 },
            { position: 'Senior Houseman', manual_labor: 300, intelligence: 1500, endurance: 500 },
            { position: 'GP', manual_labor: 600, intelligence: 2500, endurance: 1000 },
            { position: 'Consultant', manual_labor: 1300, intelligence: 5000, endurance: 2000 },
            { position: 'Surgeon', manual_labor: 2600, intelligence: 10000, endurance: 4000 },
            { position: 'Brain Surgeon', manual_labor: null, intelligence: null, endurance: null }
        ],
        education: [
            { position: 'Recess Supervisor', manual_labor: 300, intelligence: 750, endurance: 500 },
            { position: 'Substitute Teacher', manual_labor: 600, intelligence: 1000, endurance: 700 },
            { position: 'Elementary Teacher', manual_labor: 1000, intelligence: 1300, endurance: 1000 },
            { position: 'Secondary Teacher', manual_labor: 1500, intelligence: 2000, endurance: 1500 },
            { position: 'Professor', manual_labor: 1500, intelligence: 3000, endurance: 1500 },
            { position: 'Vice Principal', manual_labor: 1500, intelligence: 5000, endurance: 1500 },
            { position: 'Principal', manual_labor: null, intelligence: null, endurance: null }
        ],
        law: [
            { position: 'Law Student', manual_labor: 1750, intelligence: 2500, endurance: 5000 },
            { position: 'Paralegal', manual_labor: 2500, intelligence: 5000, endurance: 7500 },
            { position: 'Probate Lawyer', manual_labor: 3500, intelligence: 6500, endurance: 7750 },
            { position: 'Trial Lawyer', manual_labor: 4000, intelligence: 7250, endurance: 10000 },
            { position: 'Circuit Court Judge', manual_labor: 6000, intelligence: 9000, endurance: 15000 },
            { position: 'Federal Judge', manual_labor: null, intelligence: null, endurance: null }
        ]
    };

    let apiKey;
    let scriptEnabled;
    let cityJobUpgradeData = {};

    function checkTime() {
        const now = new Date();
        const jobUpdateTime = new Date(now);
        jobUpdateTime.setUTCHours(18, 30, 0, 0);
        if (now < jobUpdateTime) jobUpdateTime.setUTCDate(jobUpdateTime.getUTCDate() - 1);
        const lastFetchedJobTime = cityJobUpgradeData.fetchTime ? new Date(cityJobUpgradeData.fetchTime) : null;
        if (!lastFetchedJobTime || lastFetchedJobTime < jobUpdateTime) fetchData();
        else checkRequirements();
    }

    function jobPage() {
        if (window.location.href.toLowerCase().includes('https://www.torn.com/jobs.php')) {
            const toggleButton = document.createElement('button');
            toggleButton.innerText = 'Toggle Job Upgrade Notice';
            toggleButton.style = scriptEnabled ? 'padding: 5px 10px; border-radius: 5px; background-color: #555555; color: lightgreen; border: none; cursor: pointer;' : 'padding: 5px 10px; border-radius: 5px; background-color: #555555; color: white; border: none; cursor: pointer;'
            toggleButton.onclick = () => {
                scriptEnabled = !scriptEnabled;
                localStorage.setItem('cityJobUpgradeNoticeEnabled', scriptEnabled);
                if (scriptEnabled) toggleButton.style.color = 'lightgreen';
                else toggleButton.style.color = 'white';
            };
            const pageTitle = document.querySelector('div.content-title > h4');
            if (pageTitle) pageTitle.appendChild(toggleButton);
        }
    }

    function checkRequirements() {
        const positions = jobRequirements[cityJobUpgradeData.job_type.toLowerCase()];
        if (!positions) return;
        const currentIndex = positions.findIndex(pos => pos.position === cityJobUpgradeData.job_position);
        if (currentIndex === -1 || currentIndex >= positions.length - 1) return;
        const nextPositionRequirements = positions[currentIndex];
        const pointsRequired = (currentIndex + 1) * 5;
        const canUpgrade = cityJobUpgradeData.job_points >= pointsRequired &&
              cityJobUpgradeData.manual_labor >= nextPositionRequirements.manual_labor &&
              cityJobUpgradeData.intelligence >= nextPositionRequirements.intelligence &&
              cityJobUpgradeData.endurance >= nextPositionRequirements.endurance;

        if (canUpgrade) displayNotice(`You can upgrade to ${positions[currentIndex + 1].position}.`);
    }

    function displayApiKeyInput() {
        const banner = document.querySelector('#topHeaderBanner');
        if (banner && !document.querySelector('#minimal-api-key-message')) {
            const apiKeyInput = document.createElement('div');
            apiKeyInput.innerHTML = `<div id="minimal-api-key-message" style="font-size: 16px; color: white; background-color: #222; text-align: center;"><p>Please enter your minimal access API key to continue.</p><input type="text" id="minimal-api-key-input" placeholder="Enter API Key" style="background-color: #333; color: white;"><button id="minimal-api-key-save" style="padding: 3px 10px; margin-left: 5px; background-color: #333; color: white; cursor: pointer;">Save API Key</button></div>`;
            banner.appendChild(apiKeyInput);
            const saveButton = document.querySelector('#minimal-api-key-save');
            saveButton.addEventListener('click', () => {
                const inputField = document.querySelector('#minimal-api-key-input');
                const apiKeyValue = inputField.value.trim();
                if (apiKeyValue) {
                    apiKey = apiKeyValue;
                    localStorage.setItem('minimalAPIKey', apiKeyValue);
                    checkTime();
                    apiKeyInput.remove();
                }
            });
        }
    }

    function displayNotice(message) {
        const banner = document.querySelector('#topHeaderBanner');
        if (banner && !document.querySelector('#city-job-upgrade-notice')) {
            const jobNotice = document.createElement('div');
            jobNotice.innerHTML = `<label id="city-job-upgrade-notice" style="font-size: 16px; color: white; background-color: #222; text-align: center;">${message}</label><button id="job-notice-fetch" style="padding: 3px 10px; margin-left: 5px; background-color: #333; color: white; cursor: pointer;">Fetch New Data</button>`;
            banner.appendChild(jobNotice);
            const fetchButton = document.querySelector('#job-notice-fetch');
            fetchButton.addEventListener('click', () => {
                fetchData();
                jobNotice.remove();
            });
        }
    }

    async function fetchData() {
        const response = await fetch(`https://api.torn.com/v2/user?key=${apiKey}&selections=jobpoints,profile,workstats&comment=JobUpgrade`);
        const result = await response.json();
        if (result.error && (result.error.code === 2 || result.error.code === 16)) {
            await localStorage.removeItem('minimalAPIKey');
            alert('Your API key is incorrect or access is not high enough. Please enter a new minimal access key.');
            displayApiKeyInput();
            return;
        }
        const job_points = result.jobpoints.jobs[result.job.job] || 0;
        cityJobUpgradeData = {
            manual_labor: result.manual_labor,
            intelligence: result.intelligence,
            endurance: result.endurance,
            job_type: result.job.job,
            job_position: result.job.position,
            job_points: job_points,
            fetchTime: new Date().toISOString(),
        };
        await localStorage.setItem('cityJobUpgradeData', JSON.stringify(cityJobUpgradeData));
        checkRequirements();
    }

    async function init() {
        scriptEnabled = await JSON.parse(localStorage.getItem('cityJobUpgradeNoticeEnabled')) ?? true;
        jobPage();
        console.log('City Job Upgrade Script Enabled: ', scriptEnabled);
        if (scriptEnabled) {
            apiKey = await localStorage.getItem('minimalAPIKey') || '';
            if (!apiKey) displayApiKeyInput();
            else {
                cityJobUpgradeData = await JSON.parse(localStorage.getItem('cityJobUpgradeData')) || {};
                checkTime();
            }
        }
    }

    init();
})();
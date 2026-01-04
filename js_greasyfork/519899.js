// ==UserScript==
// @name        Torn Crime Reward Tracker with Auto-Update
// @namespace   https://github.com/Armourheart/-CrimeRewardSpotter/edit/main/rewardSpotterTool
// @description A tool to track crimes and their potential rewards in Torn, with auto-update capability
// @author      Armorheart [1920801]
// @match       https://www.torn.com/loader.php?sid=crimes*
// @version     1.7.1
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/519899/Torn%20Crime%20Reward%20Tracker%20with%20Auto-Update.user.js
// @updateURL https://update.greasyfork.org/scripts/519899/Torn%20Crime%20Reward%20Tracker%20with%20Auto-Update.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const crimeDatabase = [
    {
      crime_name: "Pickpocketing",
      subsets: [
        { name: "Mugging", rewards: ["$100", "Diamond"] },
        { name: "Snatching", rewards: ["Watch"] }
      ]
    },
    {
      crime_name: "Arson",
      subsets: [
        { name: "Car Fire", rewards: ["Molotov Cocktail", "Ash"] }
      ]
    }
  ];

  function getCurrentCrimeDetails() {
    const crimeNameElement = document.querySelector('.crime-name-class'); // Top-level crime selector
    const subsetCrimeElement = document.querySelector('.subset-crime-class'); // Subset crime selector (adjust as needed)

    if (!crimeNameElement) {
      console.warn('Crime name element not found!');
      return null;
    }

    const crimeName = crimeNameElement.textContent.trim();
    const subsetCrime = subsetCrimeElement ? subsetCrimeElement.textContent.trim() : null;

    return { crimeName, subsetCrime };
  }

  function addRewardToCrime(crimeName, subsetCrime, reward) {
    let crime = crimeDatabase.find(crime => crime.crime_name.toLowerCase() === crimeName.toLowerCase());

    if (!crime) {
      console.log(`Crime "${crimeName}" not found. Adding new crime with subset and reward.`);
      crime = { crime_name: crimeName, subsets: [] };
      crimeDatabase.push(crime);
    }

    let subset = crime.subsets.find(sub => sub.name.toLowerCase() === subsetCrime?.toLowerCase());

    if (!subset && subsetCrime) {
      console.log(`Subset "${subsetCrime}" not found for crime "${crimeName}". Adding new subset.`);
      subset = { name: subsetCrime, rewards: [] };
      crime.subsets.push(subset);
    }

    if (subset && !subset.rewards.includes(reward)) {
      subset.rewards.push(reward);
      console.log(`Added reward "${reward}" to subset "${subsetCrime}" of crime "${crimeName}".`);
    }
  }

  function monitorRewards() {
    const targetNode = document.querySelector('.crime-reward-container'); // Update selector as necessary
    if (!targetNode) {
      console.error('Reward container not found. Please check the selector.');
      return;
    }

    let mutationTimeout;
    const observer = new MutationObserver(() => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => {
        const rewardElements = targetNode.querySelectorAll('.reward-selector-class');
        const crimeDetails = getCurrentCrimeDetails();

        if (!crimeDetails) return;

        const { crimeName, subsetCrime } = crimeDetails;

        rewardElements.forEach(el => {
          const rewardText = el.textContent.trim();
          addRewardToCrime(crimeName, subsetCrime, rewardText);
        });
      }, 100); // Debounce updates
    });

    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('Monitoring rewards for updates...');
  } // <-- Added this closing bracket

  function highlightCrimesBasedOnRewards() {
    const crimeElements = document.querySelectorAll('.crime-option-class'); // Replace with the actual class for crime options

    if (!crimeElements.length) {
      console.warn('No crime options found for highlighting.');
      return;
    }

    crimeElements.forEach(crimeElement => {
      const normalizedCrimeName = crimeElement.textContent.trim().toLowerCase();
      const matchingCrime = crimeDatabase.find(crime => crime.crime_name.toLowerCase() === normalizedCrimeName);

      if (matchingCrime) {
        // Highlight crimes that have rewards in the database
        crimeElement.style.border = '2px solid green';
        crimeElement.title = `Possible Rewards: ${matchingCrime.rewards.join(', ')}`;
      } else {
        // Optionally style crimes without known rewards
        crimeElement.style.border = '2px solid red';
        crimeElement.title = 'No known rewards for this crime.';
      }
    });
  }

  function createUIPanel() {
    const panel = document.createElement('div');
    panel.id = 'crime-reward-tracker';
    panel.style.position = 'fixed';
    panel.style.top = '100px';
    panel.style.right = '20px';
    panel.style.width = '300px';
    panel.style.backgroundColor = '#333';
    panel.style.color = '#fff';
    panel.style.padding = '10px';
    panel.style.borderRadius = '5px';
    panel.style.zIndex = '1000';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.innerHTML = `
      <h3 style="margin-top: 0;">Crime Reward Tracker</h3>
      <p style="font-size: 12px; color: #bbb;">
        This script works only on the current page and updates data based on your actions.
        No additional requests are made to Torn servers.
      </p>
      <label for="reward-search">Search Reward:</label>
      <input type="text" id="reward-search" style="width: 100%; margin-bottom: 10px;" />
      <button id="search-button" style="width: 100%;">Search</button>
      <div id="search-results" style="margin-top: 10px; max-height: 200px; overflow-y: auto;"></div>
    `;
    document.body.appendChild(panel);

    document.getElementById('search-button').addEventListener('click', () => {
      const query = document.getElementById('reward-search').value;
      const results = crimeDatabase.filter(crime =>
        crime.subsets.some(sub => sub.rewards.some(reward => reward.toLowerCase().includes(query.toLowerCase())))
      );

      const resultsDiv = document.getElementById('search-results');
      resultsDiv.innerHTML = '';

      if (results.length > 0) {
        results.forEach(crime => {
          crime.subsets.forEach(subset => {
            if (subset.rewards.some(reward => reward.toLowerCase().includes(query.toLowerCase()))) {
              const crimeDiv = document.createElement('div');
              crimeDiv.style.marginBottom = '10px';
              crimeDiv.innerHTML = `<strong>${crime.crime_name} (${subset.name})</strong>: ${subset.rewards.join(', ')}`;
              resultsDiv.appendChild(crimeDiv);
            }
          });
        });
      } else {
        resultsDiv.innerHTML = '<em>No crimes found for this reward.</em>';
      }
    });
  }

  function init() {
    console.log('Torn Crime Reward Tracker with Auto-Update loaded');
    createUIPanel();
    monitorRewards();
    highlightCrimesBasedOnRewards();
  }

  window.addEventListener('load', init);
})();

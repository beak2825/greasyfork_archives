// ==UserScript==
// @name        Torn Auto Gym
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/gym.php*
// @grant       none
// @version     1.0
// @author      shockingchick
// @description This script train your lowest battle stat when your energy over 25, while you're in the gym for torn.com
// @license WasrCommunity
// @downloadURL https://update.greasyfork.org/scripts/510547/Torn%20Auto%20Gym.user.js
// @updateURL https://update.greasyfork.org/scripts/510547/Torn%20Auto%20Gym.meta.js
// ==/UserScript==

// Function to monitor energy and train the lowest stat if energy is over 25
function monitorEnergyAndTrain() {
  // Select the element containing the energy value
  const energyElement = document.querySelector('.bar-value___NTdce');

  if (energyElement) {
    // Extract the energy value
    const energyValue = parseInt(energyElement.textContent.split('/')[0], 10);

    // Check if the energy value is more than 25
    if (energyValue > 25) {
      console.log(`Energy is ${energyValue}, training the lowest stat...`);
      // Call the function to train the lowest stat
      trainLowestStat();
    } else {
      console.log(`Energy is ${energyValue}, waiting until it's over 25...`);
    }
  } else {
    console.error("Energy element not found.");
  }
}

// Function to check the property values and click the TRAIN button for the lowest one
function trainLowestStat() {
  // Select the elements containing the property values
  const stats = [
    {
      name: 'Speed',
      valueElement: document.querySelector('.speed___qNMTy .propertyValue___wopyE'),
      trainButton: document.querySelector('.speed___qNMTy button[aria-label="Train speed"]')
    },
    {
      name: 'Dexterity',
      valueElement: document.querySelector('.dexterity___6ayVQ .propertyValue___wopyE'),
      trainButton: document.querySelector('.dexterity___6ayVQ button[aria-label="Train dexterity"]')
    },
    {
      name: 'Strength',
      valueElement: document.querySelector('.strength___UwX1Y .propertyValue___wopyE'),
      trainButton: document.querySelector('.strength___UwX1Y button[aria-label="Train strength"]')
    },
    {
      name: 'Defense',
      valueElement: document.querySelector('.defense___LITyA .propertyValue___wopyE'),
      trainButton: document.querySelector('.defense___LITyA button[aria-label="Train defense"]')
    }
  ];

  // Filter out stats that don't exist on the page
  const validStats = stats.filter(stat => stat.valueElement && stat.trainButton);

  if (validStats.length === 0) {
    console.error("No valid stats found.");
    return;
  }

  // Find the stat with the lowest value
  let lowestStat = validStats[0];
  validStats.forEach(stat => {
    const statValue = parseFloat(stat.valueElement.textContent);
    if (statValue < parseFloat(lowestStat.valueElement.textContent)) {
      lowestStat = stat;
    }
  });

  // Log the stat with the lowest value
  console.log(`Lowest stat is: ${lowestStat.name} with value ${lowestStat.valueElement.textContent}`);

  // Click the corresponding TRAIN button
  lowestStat.trainButton.click();
  console.log(`${lowestStat.name} TRAIN button clicked.`);
}

// Start a loop to monitor the energy every 5 seconds
setInterval(monitorEnergyAndTrain, 5000);

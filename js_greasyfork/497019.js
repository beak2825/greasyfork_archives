// ==UserScript==
// @name         Resource Timer
// @namespace    http://tampermonkey.net/
// @version      2024-06-04
// @description  shows how long it takes to gather enough resources to build a building
// @author       penguinblaze
// @match        https://*.travian.com/build.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=travian.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497019/Resource%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/497019/Resource%20Timer.meta.js
// ==/UserScript==


/* global resources */

(function() {
    'use strict';

    console.log('Resource Timer');
})();

// Extend Date prototype to add hours
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}

// Formatting options for date
const dateFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
};

// Function to get required resources from DOM
function getRequiredResources(wrapper) {
  return {
    wood: parseInt(wrapper.children[0].children[1].innerHTML),
    clay: parseInt(wrapper.children[1].children[1].innerHTML),
    iron: parseInt(wrapper.children[2].children[1].innerHTML),
    wheat: parseInt(wrapper.children[3].children[1].innerHTML),
  };
}

// Function to check if storage capacity is sufficient
function isStorageSufficient(requiredResources, maxStorage) {
  return (
    maxStorage.l1 >= requiredResources.wood &&
    maxStorage.l2 >= requiredResources.clay &&
    maxStorage.l3 >= requiredResources.iron &&
    maxStorage.l4 >= requiredResources.wheat
  );
}

// Function to calculate total resources and production
function calculateTotals(resources) {
  const totalResources = resources.storage.l1 + resources.storage.l2 + resources.storage.l3 + resources.storage.l4;
  const totalProduction = resources.production.l1 + resources.production.l2 + resources.production.l3 + resources.production.l4;
  return { totalResources, totalProduction };
}

// Main function to handle resource check and message display
function handleResourceCheck() {
  const upgradeBlocked = document.getElementsByClassName('upgradeBlocked')[0];
  if (!upgradeBlocked) {
    console.error('Element with class "upgradeBlocked" not found.');
    return;
  }

  if (upgradeBlocked.innerHTML.replace(/\s/g, "").length === 0) {
    console.log('Building can be upgraded');
    return; // Travian handles this already
  }

  const requiredResourcesWrapper = document.getElementsByClassName('resourceWrapper')[0];
  if (!requiredResourcesWrapper) {
    console.error('Element with class "resourceWrapper" not found.');
    return;
  }

  const requiredResources = getRequiredResources(requiredResourcesWrapper);
  if (!isStorageSufficient(requiredResources, resources.maxStorage)) {
    console.log('Not enough storage');
    return; // Travian handles this already
  }

  const { totalResources, totalProduction } = calculateTotals(resources);
  const totalRequiredResources = Object.values(requiredResources).reduce((sum, value) => sum + value, 0);

  if (totalResources >= totalRequiredResources) {
    console.log('You have enough resources already');
    return; // Travian handles this already
  }

  const timeRequiredInHours = (totalRequiredResources - totalResources) / totalProduction;
  const formattedDate = new Date().addHours(timeRequiredInHours).toLocaleString('en-GB', dateFormatOptions).replace(',', ' -');

  const enoughResourceMessage = upgradeBlocked.appendChild(document.createElement("div"));
  enoughResourceMessage.classList.add('errorMessage');
  enoughResourceMessage.innerHTML = "Enough resources at: " + formattedDate;
}

// Add event listener for window load
window.addEventListener('load', handleResourceCheck, false);

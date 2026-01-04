// ==UserScript==
// @name         (UGC SNIPER)pain sniper
// @namespace    http://tampermonkey.net/
// @version      7.8.3
// @description  fixed for bundles
// @author       fishcat#2431
// @match        https://web.roblox.com/catalog/*
// @match        https://web.roblox.com/bundles/*
// @match        https://www.roblox.com/catalog/*
// @match        https://www.roblox.com/bundles/*
// @icon         https://web.roblox.com/catalog/*
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/464935/%28UGC%20SNIPER%29pain%20sniper.user.js
// @updateURL https://update.greasyfork.org/scripts/464935/%28UGC%20SNIPER%29pain%20sniper.meta.js
// ==/UserScript==

// Default settings
const defaultSettings = {
  check_price: true,
  max_price: 10,
  reload_interval: 1000, // Default reload interval of 1 second
};

const hardcodemaxprice = 9e14;//For the people who want the extra security (default 9e9) change 9e14 to whatever number you want

// GUI variables
let guiContainer;
let titleElement;
let settingsContainer;
let settingsContent;
let settingsOpen = false;
let checkPriceCheckbox;
let maxPriceInput;
let reloadIntervalInput;
let startSniperButton;
let stopSniperButton;

// Sniper variable
let sniperIntervalId;

// Load settings from local storage or use default settings
const settings = JSON.parse(localStorage.getItem('painSniperSettings')) || defaultSettings;

// Save settings to local storage
function saveSettings() {
  localStorage.setItem('painSniperSettings', JSON.stringify(settings));
}

// Update settings based on GUI inputs
function updateSettings() {
  settings.check_price = checkPriceCheckbox.checked;
  settings.max_price = Number(maxPriceInput.value);
  settings.reload_interval = Number(reloadIntervalInput.value);
  saveSettings();
}

// Start the sniper
function startSniper() {
  checkButtonAndExecuteFunction();
  sniperIntervalId = setInterval(checkButtonAndExecuteFunction, settings.reload_interval);
  startSniperButton.disabled = true; // Disable the button after starting
  stopSniperButton.disabled = false; // Enable the stop button
  console.log('Sniper started');
}

// Stop the sniper
function stopSniper() {
  clearInterval(sniperIntervalId);
  startSniperButton.disabled = false; // Enable the start button
  stopSniperButton.disabled = true; // Disable the button after stopping
  console.log('Sniper stopped');
}

// Create the GUI
function createGUI() {
  // Create GUI container
  guiContainer = document.createElement('div');
  guiContainer.style.position = 'fixed';
  guiContainer.style.top = '10px';
  guiContainer.style.right = '10px';
  guiContainer.style.padding = '10px';
  guiContainer.style.background = '#222'; // Dark background color
  guiContainer.style.border = '1px solid #ccc';
  guiContainer.style.zIndex = '9999';
  guiContainer.style.color = '#fff'; // Light text color
  guiContainer.style.borderRadius = '6px'; // Rounded corners
  document.body.appendChild(guiContainer);

  // Create title
  titleElement = document.createElement('h2');
  titleElement.textContent = 'Pain Sniper (Debug)';
  titleElement.style.marginTop = '0';
  guiContainer.appendChild(titleElement);

  // Create settings container
  settingsContainer = document.createElement('div');
  settingsContainer.style.marginTop = '10px';
  guiContainer.appendChild(settingsContainer);

  // Create settings toggle button
  const settingsToggleButton = document.createElement('button');
  settingsToggleButton.textContent = 'Settings';
  settingsToggleButton.style.marginBottom = '10px';
  settingsToggleButton.style.width = '100%';
  settingsToggleButton.style.borderRadius = '4px';
  settingsToggleButton.style.padding = '6px 12px';
  settingsToggleButton.style.backgroundColor = '#444';
  settingsToggleButton.style.border = 'none';
  settingsToggleButton.style.color = '#fff';
  settingsToggleButton.style.cursor = 'pointer';
  settingsToggleButton.addEventListener('click', toggleSettings);
  settingsContainer.appendChild(settingsToggleButton);

  // Create settings content
  settingsContent = document.createElement('div');
  settingsContent.style.display = 'none';
  settingsContent.style.background = '#fff'; // White background color
  settingsContent.style.padding = '10px';
  settingsContainer.appendChild(settingsContent);

  // Create check price checkbox
  const checkPriceLabel = document.createElement('label');
  checkPriceLabel.textContent = 'Check price: ';
  checkPriceLabel.style.color = '#000'; // Dark text color
  checkPriceCheckbox = document.createElement('input');
  checkPriceCheckbox.type = 'checkbox';
  checkPriceCheckbox.checked = settings.check_price;
  checkPriceCheckbox.addEventListener('change', updateSettings);
  checkPriceLabel.appendChild(checkPriceCheckbox);
  settingsContent.appendChild(checkPriceLabel);

  // Create max price input
  const maxPriceLabel = document.createElement('label');
  maxPriceLabel.textContent = 'Max price: ';
  maxPriceLabel.style.color = '#000'; // Dark text color
  maxPriceInput = document.createElement('input');
  maxPriceInput.type = 'number';
  maxPriceInput.value = settings.max_price;
  maxPriceInput.min = '0';
  maxPriceInput.addEventListener('input', updateSettings);
  maxPriceLabel.appendChild(maxPriceInput);
  settingsContent.appendChild(maxPriceLabel);

  // Create reload interval input
  const reloadIntervalLabel = document.createElement('label');
  reloadIntervalLabel.textContent = 'Reload interval (ms): ';
  reloadIntervalLabel.style.color = '#000'; // Dark text color
  reloadIntervalInput = document.createElement('input');
  reloadIntervalInput.type = 'number';
  reloadIntervalInput.value = settings.reload_interval;
  reloadIntervalInput.min = '100'; // Minimum reload interval of 100ms
  reloadIntervalInput.addEventListener('input', updateSettings);
  reloadIntervalLabel.appendChild(reloadIntervalInput);
  settingsContent.appendChild(reloadIntervalLabel);

  // Create Start Sniper button
  startSniperButton = document.createElement('button');
  startSniperButton.textContent = 'Start Sniper';
  startSniperButton.addEventListener('click', startSniper);
  startSniperButton.style.backgroundColor = '#000'; // Black background color
  startSniperButton.style.color = '#fff'; // White text color
  guiContainer.appendChild(startSniperButton);

  // Create Stop Sniper button
  stopSniperButton = document.createElement('button');
  stopSniperButton.textContent = 'Stop Sniper';
  stopSniperButton.addEventListener('click', stopSniper);
  stopSniperButton.style.backgroundColor = '#000'; // Black background color
  stopSniperButton.style.color = '#fff'; // White text color
  stopSniperButton.disabled = true;
  guiContainer.appendChild(stopSniperButton);

  // Create author label
  const authorLabel = document.createElement('p');
  authorLabel.textContent = 'by fishcat2431';
  authorLabel.style.fontSize = '12px';
  authorLabel.style.color = '#fff'; // Light text color
  authorLabel.style.textAlign = 'center';
  authorLabel.style.marginTop = '10px';
  authorLabel.style.fontStyle = 'italic';
  guiContainer.appendChild(authorLabel);
}

function snipeItem() {
  const itemPriceElement = document.getElementsByClassName('item-price-value')[0];
  const itemPrice = itemPriceElement ? Number(itemPriceElement.innerText.replace(/[^0-9.-]+/g, "")) : 0;
  const buttons = document.querySelectorAll('button');
  const buyButton = Array.from(buttons).find((button) => button.textContent === 'Buy');
  const refreshB = document.getElementById('refresh-details-button');
  const alertMessage = `Item price too high. Price: ${itemPrice}`;

  if (itemPriceElement === 'Free') {
    console.log('Item is free. Attempting to purchase...');
    buyButton.click();
    setTimeout(() => {
      const buttons2 = document.querySelectorAll('button');
      const buyButton2 = document.getElementsByClassName('modal-button btn-primary-md btn-min-width')[0]; // Use [0] to access the first element
      buyButton2.click();
      refreshB.click();
      console.log('Purchase successful!');
    }, 500);
} else {
  if (settings.check_price && itemPrice <= hardcodemaxprice && itemPrice <= settings.max_price) {
    console.log('Item price within range. Attempting to purchase...');
    buyButton.click();
    setTimeout(() => {
      const buttons2 = document.querySelectorAll('button');
      const buyButton2 = document.getElementsByClassName('modal-button btn-primary-md btn-min-width')[0]; // Use [0] to access the first element
      buyButton2.click();
      refreshB.click();
      console.log('Purchase successful!');
    }, 500);
  } else {
    console.log('Price too high. Skipping purchase.');
    alert(alertMessage);
    stopSniper();
  }
  }
}

function checkButtonAndExecuteFunction() {
  var button = document.getElementsByClassName('PurchaseButton')[0];
  // all this simplified into one line
  /* const IsBundle = document.getElementsByClassName("font-body text wait-for-i18n-format-render")[1];
  var button = document.getElementsByClassName('btn-growth-lg btn-fixed-width-lg PurchaseButton')[0];

  if (IsBundle.innerText == 'Bundle') {
    console.log('is bundle')
    var button = document.getElementsByClassName("shopping-cart-buy-button btn-growth-lg PurchaseButton")[0];
  } else {
    console.log('non bundle')
    var button = document.getElementsByClassName('btn-growth-lg btn-fixed-width-lg PurchaseButton')[0];
  } */

  if (button !== null && button instanceof HTMLButtonElement) {
    console.log('Buy button found. Checking item...');
    snipeItem();
  } else {
    console.log('Buy button not found. Refreshing page...');
    setTimeout(() => {
      document.getElementById('refresh-details-button').click();
    }, settings.reload_interval); // Wait for the reload interval before refreshing
  }
}

function toggleSettings() {
  settingsOpen = !settingsOpen;
  if (settingsOpen) {
    settingsContent.style.display = 'block';
  } else {
    settingsContent.style.display = 'none';
  }
}

window.addEventListener('load', function () {
  // Create the GUI
  createGUI();

  console.log('Script loaded!');
  // Start the sniper if it was previously running
  if (startSniperButton.disabled) {
    sniperIntervalId = setInterval(checkButtonAndExecuteFunction, settings.reload_interval);
    console.log('Sniper started');
  }
});
// ==UserScript==
// @name        GC - SDB Contents Collection
// @namespace   https://greasyfork.org/en/users/1278031-crystalflame
// @match       https://www.grundos.cafe/safetydeposit/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.addStyle
// @license     MIT
// @version     1.4
// @author      CrystalFlame and Cupkait
// @icon        https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @description Export your SDB contents for use in Virtupets checklists or as CSV for any other use cases you come up with!
// @downloadURL https://update.greasyfork.org/scripts/547251/GC%20-%20SDB%20Contents%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/547251/GC%20-%20SDB%20Contents%20Collection.meta.js
// ==/UserScript==
 
// State variables
let collect = false;
let active = false;
let customSearchUrl = null;
 
// Constants
const MAIN_SELECTOR = 'main .sdb-info';
 
// Initialize style and UI
const sdbStyle = addStyles();
const collectContainer = createCollectContainer();
document.querySelector(MAIN_SELECTOR).append(collectContainer);
 
// Start script
initialize();
 
async function initialize() {
  collect = await GM.getValue('collect', false);
  active = await GM.getValue('active', false);
  customSearchUrl = await GM.getValue('customSearchUrl', null);
 
  if (collect) {
    showNextButtons();
  } else if (active) {
    enableNextPageNavigation();
  } else {
    showEnableButton();
  }
}
 
function addStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    .collect-sdb {
      text-align: center;
      margin: 10px;
    }
    .collect-sdb a {
      background-color: var(--grid_head);
      border: 1px solid grey;
      padding: 5px 15px;
      margin: 10px;
      cursor: pointer;
      display: inline-block;
    }
    .completion-message {
      color: green;
      font-weight: bold;
    }
    .add-custom-search {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: var(--grid_head);
      border: 1px solid grey;
      cursor: pointer;
      font-size: 20px;
      vertical-align: middle;
      margin: 10px;
    }
    .custom-search-container {
      margin: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    .custom-search-input {
      padding: 5px;
      margin-right: 10px;
      width: 60%;
      border: 1px solid grey;
    }
    .custom-search-button {
      background-color: var(--grid_head);
      border: 1px solid grey;
      padding: 5px 15px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
  return style;
}
 
function createCollectContainer() {
  const container = document.createElement('div');
  container.classList.add('collect-sdb');
  return container;
}
 
function createButton(text, onClick) {
  const button = document.createElement('a');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}
 
function removeAllButtons() {
  collectContainer.innerHTML = '';
}
 
function showEnableButton() {
  collectContainer.append(createButton('Begin SDB Data Collection', async () => {
    await GM.setValue('collect', true);
    showNextButtons();
  }));
}
 
function showNextButtons() {
  removeAllButtons();
 
  // Add standard collection buttons
  collectContainer.append(
    createButton('Collect full SDB', () => setActiveAndNavigate('https://www.grundos.cafe/safetydeposit/')),
    createButton('Collect quest only', () => setActiveAndNavigate('https://www.grundos.cafe/safetydeposit/?page=1&&max_rarity=89&view=100'))
  );
 
  // Add custom search button if a URL exists
  if (customSearchUrl) {
    const customButton = createButton('Custom Search', () => setActiveAndNavigate(customSearchUrl));
    const resetButton = createButton('Reset Custom', resetCustomSearch);
    collectContainer.append(customButton, resetButton);
  } else {
    // Add the plus button to add a custom search
    const addButton = document.createElement('span');
    addButton.innerHTML = '&#43;'; // Plus sign
    addButton.title = 'Add custom search URL';
    addButton.classList.add('add-custom-search');
    addButton.addEventListener('click', showCustomSearchInput);
    collectContainer.append(addButton);
  }
}
 
function showCustomSearchInput() {
  // Remove the plus button
  const plusButton = document.querySelector('.add-custom-search');
  if (plusButton) plusButton.remove();
 
  // Create container for input and save button
  const customContainer = document.createElement('div');
  customContainer.classList.add('custom-search-container');
 
  // Create input for URL
  const urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.placeholder = 'Paste your custom scan URL here and save';
  urlInput.classList.add('custom-search-input');
 
  // Create save button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.classList.add('custom-search-button');
  saveButton.addEventListener('click', () => saveCustomSearch(urlInput.value));
 
  // Create cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.classList.add('custom-search-button');
  cancelButton.style.marginLeft = '5px';
  cancelButton.addEventListener('click', () => {
    customContainer.remove();
    showNextButtons(); // Re-show the buttons including the plus sign
  });
 
  // Append elements
  customContainer.append(urlInput, saveButton, cancelButton);
  collectContainer.append(customContainer);
 
  // Focus the input
  urlInput.focus();
}
 
async function saveCustomSearch(url) {
  if (!url || !url.trim()) {
    displayMessage('Please enter a valid URL');
    return;
  }
 
  // Validate URL format
  if (!url.startsWith('https://www.grundos.cafe/safetydeposit/')) {
    displayMessage('URL must start with https://www.grundos.cafe/safetydeposit/');
    return;
  }
 
  // Save the URL
  customSearchUrl = url.trim();
  await GM.setValue('customSearchUrl', customSearchUrl);
 
  // Remove the input container
  const customContainer = document.querySelector('.custom-search-container');
  if (customContainer) customContainer.remove();
 
  // Show success message
  displayMessage('Custom search URL saved!');
 
  // Redisplay buttons
  showNextButtons();
}
 
async function resetCustomSearch() {
  customSearchUrl = null;
  await GM.setValue('customSearchUrl', null);
  showNextButtons();
  displayMessage('Custom search has been reset.');
}
 
async function setActiveAndNavigate(url) {
  await Promise.all([
    GM.setValue('collect', false),
    GM.setValue('active', true)
  ]);
  window.location.href = url;
}
 
function enableNextPageNavigation() {
  removeAllButtons();
  collectContainer.append(createButton('Cancel/Restart Collection', cancelCollection));
  initTableProcessing();
}
 
function appendMessage(messageText) {
  const message = document.createElement('p');
  message.innerHTML = messageText;
  collectContainer.append(message);
}
 
async function initTableProcessing() {
  await processTableData();
  displayPageInfo();
  setupKeyboardNavigation();
}
 
async function loadSdbContents() {
  return await GM.getValue('sdbContents', []);
}
 
async function saveSdbContents(contents) {
  await GM.setValue('sdbContents', contents);
}
 
async function processTableData() {
  const sdbContents = await loadSdbContents();
  const data = document.querySelectorAll('.data');
  const rows = [];
 
  for (let i = 0; i < data.length; i += 7) {
    if (!data[i + 1] || !data[i + 2] || !data[i + 3] || !data[i + 4]) continue;
 
    const row = createRow(data, i);
    if (!row) continue;
 
    const existingItemIndex = sdbContents.findIndex(item => item.n === row.n);
    if (existingItemIndex > -1) {
      sdbContents[existingItemIndex] = row;
    } else {
      sdbContents.push(row);
    }
    rows.push(row);
  }
 
  await saveSdbContents(sdbContents);
}
 
function createRow(data, index) {
  try {
    const nameElement = data[index + 1].querySelector('strong');
    const rarityElement = data[index + 1].querySelector('span');
    const imageElement = data[index + 2].querySelector('img');
    const quantityElement = data[index + 3];
    const typeElement = data[index + 4].querySelector('strong');
 
    if (!nameElement || !rarityElement || !imageElement || !quantityElement || !typeElement) {
      return null;
    }
 
    const rarityMatch = rarityElement.textContent.match(/\d+/);
    if (!rarityMatch) return null;
 
    return {
      n: nameElement.textContent,
      r: parseInt(rarityMatch[0]),
      p: imageElement.src.split('/').pop(),
      q: parseInt(quantityElement.textContent) || 0,
      t: typeElement.textContent,
    };
  } catch (error) {
    console.error('Error creating row:', error);
    return null;
  }
}
 
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      const nextPageLink = [...document.querySelectorAll('.center a')].find(link =>
        link.textContent.trim().startsWith('Next'));
      if (nextPageLink) nextPageLink.click();
    }
  });
}
 
async function displayPageInfo() {
  const pageOptions = document.querySelectorAll('#page option');
  const pageCount = pageOptions.length;
  const currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
  const sdbContents = await loadSdbContents();
  const totalItems = sdbContents.length;
 
  // Get end total (if available)
  let endTotal = 0;
  const totalText = document.querySelector('main div:nth-child(6)')?.childNodes[4]?.textContent;
  if (totalText) {
    endTotal = parseFloat(totalText.replace(/[^0-9.]/g, '').replace(/,/g, ''));
  }
 
  appendMessage(`Total items collected: <strong>${totalItems.toLocaleString()}</strong>  <br>You are viewing page <strong>${currentPage.toLocaleString()}</strong> / <strong>${pageCount.toLocaleString()}</strong>.`);
  appendMessage(`Click "Next" or press the right arrow key to go to the next page.`);
 
  // Always show export buttons
  appendExportButtons();
}
 
function appendExportButtons() {
  // Check if buttons already exist
  if (!document.querySelector('.collect-sdb .export-csv-button') &&
      !document.querySelector('.collect-sdb .copy-clipboard-button')) {
 
    const csvButton = createButton('Export to CSV', exportToCSV);
    csvButton.classList.add('export-csv-button');
 
    const clipboardButton = createButton('Copy to Clipboard', copyToClipboard);
    clipboardButton.classList.add('copy-clipboard-button');
 
    collectContainer.append(csvButton, clipboardButton);
    appendMessage(`Export to CSV to make a spreadsheet of the results. Copy to Clipboard to paste into a Virtupets.net Checklist.`);
  }
}
 
async function exportToCSV() {
  try {
    const sdbContents = await loadSdbContents();
    if (sdbContents.length === 0) {
      displayMessage('No data to export. Please collect some data first.');
      return;
    }
 
    const csvContent = "data:text/csv;charset=utf-8," +
                      "Name,Rarity,Image,Quantity,Type\n" +
                      sdbContents.map(e => Object.values(e).join(",")).join("\n");
 
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `sdbContents_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
 
    displayMessage('Export complete!');
  } catch (err) {
    console.error('Error exporting to CSV:', err);
    displayMessage('Error exporting to CSV. Check console for details.');
  }
}
 
async function copyToClipboard() {
  try {
    const sdbContents = await loadSdbContents();
    if (sdbContents.length === 0) {
      displayMessage('No data to copy. Please collect some data first.');
      return;
    }
 
    await navigator.clipboard.writeText(JSON.stringify(sdbContents));
    displayMessage('Copy complete!');
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    displayMessage('Error copying to clipboard. Check console for details.');
  }
}
 
function displayMessage(text) {
  let message = collectContainer.querySelector('.completion-message');
 
  if (!message) {
    message = document.createElement('p');
    message.classList.add('completion-message');
    collectContainer.append(message);
  }
  message.innerHTML = text;
 
  // Auto-clear message after 5 seconds
  setTimeout(() => {
    if (message.parentNode) {
      message.innerHTML = '';
    }
  }, 5000);
}
 
async function cancelCollection() {
  await Promise.all([
    GM.setValue('active', false),
    GM.setValue('sdbContents', [])
  ]);
  window.location.href = 'https://www.grundos.cafe/safetydeposit/';
}
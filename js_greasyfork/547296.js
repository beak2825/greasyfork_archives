// ==UserScript==
// @name        [GC][Backup] - Underwater Fishing Mods
// @namespace   Grundo's Cafe
// @match       https://www.grundos.cafe/water/fishing/
// @match       https://www.grundos.cafe/help/userscripts/
// @grant       GM.getValue
// @grant     	GM.setValue
// @grant       GM.addStyle
// @grant       GM.xmlHttpRequest
// @version     1.1.1
// @license     MIT
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description Fishing rewards sorting and logging with combined results.
// @require https://update.greasyfork.org/scripts/489454/1588028/%5BGC%5D%20-%20Underwater%20Fishing%20Prizes%20Library.js
// @require https://update.greasyfork.org/scripts/514423/1554918/GC%20-%20Universal%20Userscripts%20Settings.js
// @downloadURL https://update.greasyfork.org/scripts/547296/%5BGC%5D%5BBackup%5D%20-%20Underwater%20Fishing%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/547296/%5BGC%5D%5BBackup%5D%20-%20Underwater%20Fishing%20Mods.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CACHED_SELECTORS = {
    userName: '#user-info-username',
    buttonFishAll: 'input[value="Fish with Everyone!"]',
    buttonFishOne: 'input[value="Reel in Your Line"]',
    pageContent: 'div#page_content > main',
    centerItems: '.center-items',
    resultsDiv: '.flex-column'
  };

  const DOM = {};

  function initializeDOMCache() {
    Object.entries(CACHED_SELECTORS).forEach(([key, selector]) => {
      DOM[key] = document.querySelector(selector);
    });
  }

  const SCRIPT_CATEGORY = "Underwater Fishing";
  const SETTING_ENABLE_HIGHLIGHTING = "enableHighlighting";
  const SETTING_ENABLE_LOGGING = "enableLogging";
  const SETTING_ENABLE_WEBHOOKS = "enableWebhooks";
  const SETTING_ENABLE_ANONYMIZE = "enableAnonymize";
  const SETTING_WEBHOOKS = "webHooks";

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  if (window.location.href.includes('/help/userscripts/')) {
    addCheckboxInput({
      categoryName: SCRIPT_CATEGORY,
      settingName: SETTING_ENABLE_HIGHLIGHTING,
      labelText: "Enable Highlighting",
      labelTooltip: "When enabled, notable prizes will be highlighted at the top of the fishing results page.",
      defaultSetting: true
    });

    addCheckboxInput({
      categoryName: SCRIPT_CATEGORY,
      settingName: SETTING_ENABLE_LOGGING,
      labelText: "Enable Data Logging",
      labelTooltip: "When enabled, your fishing results will be sent to the fishing data collector for statistics and analysis.",
      defaultSetting: true
    });

    addCheckboxInput({
      categoryName: SCRIPT_CATEGORY,
      settingName: SETTING_ENABLE_WEBHOOKS,
      labelText: "Enable Webhooks",
      labelTooltip: "When enabled, your fishing results will be sent to the specified webhook URLs.",
      defaultSetting: false
    });

    addCheckboxInput({
      categoryName: SCRIPT_CATEGORY,
      settingName: SETTING_ENABLE_ANONYMIZE,
      labelText: "Anonymize Data",
      labelTooltip: "When enabled, your username and pet names will be anonymized in the data collection. This does not affect webhooks.",
      defaultSetting: false
    });

    addTextInput({
      categoryName: SCRIPT_CATEGORY,
      settingName: SETTING_WEBHOOKS,
      labelText: "Webhooks",
      labelTooltip: "Separate different webhook URLs with commas. Example: https://webhook1.com, https://webhook2.com",
      defaultSetting: "",
    });
  }

  if (!window.location.href.includes('/water/fishing/')) {
    return;
  }

  const userName = document.querySelector('#user-info-username')?.textContent;
  const buttonFishAll = document.querySelector('input[value="Fish with Everyone!"]');
  const buttonFishOne = document.querySelector('input[value="Reel in Your Line"]');
  const pageContent = document.querySelector("div#page_content > main");

  async function getCurrentPetLevels() {
    try {
      const response = await fetch("https://www.grundos.cafe/quickref/");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const petList = doc.querySelector("#quickref_petlist")?.children;

      if (!petList) {
        throw new Error('Pet list not found');
      }

      const petLevels = {};
      Array.from(petList).forEach(pet => {
        const petrefNameMatch = pet.querySelector("a")?.getAttribute("href")?.match(/_name=(.*?)$/);
        const fishingLevelMatch = pet.querySelectorAll("span")[12]?.textContent.match(/Fishing : (.*?)$/);

        if (petrefNameMatch && fishingLevelMatch) {
          petLevels[petrefNameMatch[1]] = fishingLevelMatch[1];
        }
      });

      sessionStorage.setItem('petLevels', JSON.stringify(petLevels));
      return petLevels;
    } catch (error) {
      console.error("Error fetching pet levels:", error);
      return null;
    }
  }

  function createStatusDisplay(message) {
    const existingDisplay = document.getElementById("displayResults");
    if (existingDisplay) {
      existingDisplay.innerHTML = message;
      return existingDisplay;
    }

    const displayResults = document.createElement("div");
    displayResults.innerHTML = message;
    displayResults.id = "displayResults";
    displayResults.style.cssText =
      "color: green; text-align: center; link-color:green; font-size:14px; font-weight:bold; margin: 10px 0;";
    pageContent?.insertAdjacentElement("beforebegin", displayResults);
    return displayResults;
  }

  function extractResultData(resultElement) {
    try {
      const pet = resultElement.querySelector('strong')?.textContent;
      const paragraphText = resultElement.querySelector('p')?.textContent;
      
      // Check if pet caught something or nothing
      let item;
      if (paragraphText?.includes('caught nothing')) {
        item = 'Nothing';
      } else {
        const itemMatch = paragraphText?.match(/ a (.*?)!/);
        item = itemMatch ? itemMatch[1] : 'Nothing';
      }
      
      const cooldown = resultElement.querySelectorAll('strong')[1]?.textContent;
      const image = resultElement.querySelectorAll('img')[1]?.src;

      const levelUpText = resultElement.querySelectorAll("p")[1]?.textContent;
      const newlevel = levelUpText && levelUpText.includes("fishing level") ?
        levelUpText.match(/ \d+/)[0] : null;

      const storedLevels = JSON.parse(sessionStorage.getItem('petLevels') || '{}');
      const oldlevel = storedLevels[pet] || null;

      if (!pet || !cooldown) {
        return null;
      }

      return { pet, item, cooldown, image, oldlevel, newlevel };
    } catch (error) {
      console.error("Error extracting result data:", error);
      return null;
    }
  }

  function extractSingleResult() {
    try {
      const resultSingle = document.querySelector('#page_content .center');
      if (!resultSingle) return null;

      // Check if this is the "cast your line again" page (no results) - before fishing
      if (resultSingle.querySelector('form input[value="Cast Your Line Again"]') && 
          !resultSingle.querySelector('img[alt]')) {
        return null; // This is not a results page
      }

      // For single pet results, extract data from the specific structure
      const paragraphs = resultSingle.querySelectorAll('p');
      
      let pet = null;
      let item = 'Nothing';
      let cooldown = null;
      let image = null;

      // Look for item image (med-image class) vs pet image (big-image class)
      const itemImgElement = resultSingle.querySelector("img.med-image[alt]");
      const petImgElement = resultSingle.querySelector("img.big-image[alt]");

      // Extract item name and image (if there's an item)
      if (itemImgElement) {
        item = itemImgElement.alt;
        image = itemImgElement.src;
      }

      // Get pet name from pet image if available
      if (petImgElement) {
        pet = petImgElement.alt;
      }

      // If no item image but has paragraphs, check for "caught nothing" case
      if (!itemImgElement && paragraphs.length > 0) {
        for (const p of paragraphs) {
          if (p.textContent.includes('caught nothing')) {
            item = 'Nothing';
            break;
          }
        }
      }

      // Extract pet name and cooldown from the cooldown paragraph
      for (const p of paragraphs) {
        const cooldownMatch = p.textContent.match(/(\w+) might be able to cast again in about.*?(\d+).*?hours?/);
        if (cooldownMatch) {
          if (!pet) pet = cooldownMatch[1]; // Only use if not already found from image
          cooldown = cooldownMatch[2];
          break;
        }
      }

      // If no cooldown found, try to get it from a strong element
      if (!cooldown) {
        cooldown = resultSingle.querySelector('strong')?.textContent;
      }

      // For "nothing" results, we need to assume a default cooldown if none is found
      // This typically happens when there's no explicit cooldown text
      if (!cooldown && pet && item === 'Nothing') {
        cooldown = '0'; // Default cooldown for nothing results
      }

      // Try alternative pet name sources if not found
      if (!pet) {
        pet = document.querySelector('.user-info-pet')?.textContent ||
              document.querySelector('#user-info-username')?.textContent;
      }

      const levelUpText = Array.from(paragraphs).find(p => p.textContent.includes("fishing level"))?.textContent;
      const newlevel = levelUpText && levelUpText.includes("fishing level") ?
        levelUpText.match(/ \d+/)[0] : null;

      const storedLevels = JSON.parse(sessionStorage.getItem('petLevels') || '{}');
      const oldlevel = storedLevels[pet] || null;

      if (!pet || !cooldown) {
        return null;
      }

      return { pet, item, cooldown, image, oldlevel, newlevel };
    } catch (error) {
      console.error("Error extracting single result:", error);
      return null;
    }
  }

async function highlightNotablePrizes(results, resultsDiv) {
  const highlightingEnabled = await GM.getValue(SETTING_ENABLE_HIGHLIGHTING, true);
  if (!highlightingEnabled || !results.length || !resultsDiv) return;

  const goodPrizes = document.createElement('div');
  let hasHighlights = false;
  
  const fragment = document.createDocumentFragment();
  
  Array.from(document.querySelectorAll(CACHED_SELECTORS.centerItems))
    .filter(element => {
      const paragraphElement = element.querySelector('p');
      if (!paragraphElement) return false;
      
      const itemMatch = paragraphElement.textContent.match(/ a (.*?)!/);
      if (!itemMatch) return false;
      
      const itemName = itemMatch[1];
      return prizes?.[itemName]?.h === true;
    })
    .forEach(element => {
      hasHighlights = true;
      element.style.borderLeft = "5px solid aquamarine";
      fragment.appendChild(element);
    });

  if (hasHighlights) {
    goodPrizes.appendChild(fragment);
    goodPrizes.classList.add("center-items");
    Object.assign(goodPrizes.style, {
      backgroundColor: "#efef404f",
      border: "2px solid black",
      marginBottom: "15px",
      padding: "10px"
    });
    goodPrizes.innerHTML = "<h3>Notable Prizes</h3>" + goodPrizes.innerHTML;
    resultsDiv.insertAdjacentElement('beforebegin', goodPrizes);
  }
}

  function createStandardEntry(result, shouldAnonymize = false) {
    const cooldownMinutes = parseInt(result.cooldown?.match(/\d+/)?.[0] || "0", 10);

    let itemId = 0;
    if (typeof result.item === 'string' && prizes?.[result.item]?.iid) {
      itemId = prizes[result.item].iid;
    }

    return {
      "petname": shouldAnonymize ? hashString(result.pet || "").toString() : (result.pet || ""),
      "currentlevel": parseInt(result.oldlevel || "0", 10),
      "newlevel": parseInt(result.newlevel || result.oldlevel || "0", 10),
      "itemid": itemId,
      "cooldown": cooldownMinutes
    };
  }

  async function submitResultsToLogger(formattedData) {
    const loggingEnabled = await GM.getValue(SETTING_ENABLE_LOGGING, true);
    if (!loggingEnabled) {
      console.log("Data logging is disabled. Skipping data submission.");
      return "Logging disabled";
    }

    try {
      const response = await fetch('https://somethinghashappened.com/gc/log.php', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      try {
        const responseText = await response.json();
        console.log('Server response:', responseText);
        return responseText;
      } catch (readError) {
        return 'Request sent';
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      return null;
    }
  }

  async function generatePrizeWebhooks(name, oldlevel, item, image) {
    if (!item || !prizes[item] || prizes[item].h !== true) {
      return null;
    }
  
    const webhooksString = await GM.getValue(SETTING_WEBHOOKS, "");
    if (!webhooksString.trim()) {
      return null;
    }
  
    const webHooks = webhooksString
      .split(',')
      .map(url => url.trim())
      .filter(url => url && url.startsWith('http'));
  
    const hook = {
      content: null,
      embeds: [{
        description: `${userName} got a ${item}?\nWhat a great prize!`,
        color: 7844437,
        author: {
          name: `${userName} took ${name} fishing...`,
        },
        thumbnail: {
          url: `${image}`,
        },
      }],
      username: "Underwater Fishing Prizes",
      avatar_url: "https://i.imgur.com/4Hm2e6z.png",
      attachments: [],
    };
  
    const results = await Promise.allSettled(
      webHooks.map(webhook => sendMessage(hook, webhook))
    );
  
    const summary = results.reduce((acc, result, index) => {
      const webhookUrl = webHooks[index].substring(0, 30) + '...';
      if (result.status === 'fulfilled') {
        acc.success.push(webhookUrl);
      } else {
        acc.failed.push(webhookUrl);
      }
      return acc;
    }, { success: [], failed: [] });
  
    let statusMessage = [];
    if (summary.success.length) {
      statusMessage.push(`Sent to ${summary.success.length} webhook${summary.success.length !== 1 ? 's' : ''}`);
    }
    if (summary.failed.length) {
      statusMessage.push(`Failed ${summary.failed.length} webhook${summary.failed.length !== 1 ? 's' : ''}`);
    }
  
    return statusMessage.length ? statusMessage.join(', ') : null;
  }

  async function sendMessage(hook, webhook) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "POST",
        url: webhook,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(hook),
        onload: function(response) {
          if (response.status >= 200 && response.status < 300) {
            resolve(response.responseText);
          } else {
            reject(new Error(`Request failed with status ${response.status}`));
          }
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }

  async function submitResultsToWebhooks(formattedData) {
    const webhooksEnabled = await GM.getValue(SETTING_ENABLE_WEBHOOKS, false);
    if (!webhooksEnabled) {
      return "Webhooks disabled";
    }

    const results = [];

    for (const entry of formattedData.entries) {
      const result = await generatePrizeWebhooks(
        entry.petname,
        entry.currentlevel,
        Object.keys(prizes).find(key => prizes[key].iid === entry.itemid) || "Unknown Item",
        "https://i.imgur.com/4Hm2e6z.png"
      );

      if (result) {
        results.push(result);
      }
    }

    return results.length > 0 ? results.join(', ') : "No notable prizes";
  }

  async function collectFishingResults() {
    const displayResults = createStatusDisplay("Loading results... please wait.");
    const results = [];
    const originalResults = [];

    const resultsList = document.querySelectorAll('.center-items');
    const resultsDiv = document.querySelector('.flex-column');

    if (resultsList.length > 0) {
      resultsList.forEach(result => {
        const resultData = extractResultData(result);
        if (resultData) {
          results.push(resultData);
          originalResults.push({...resultData});
        }
      });

      if (results.length > 0) {
        await highlightNotablePrizes(results, resultsDiv);
      }
    } else {
      const singleResult = extractSingleResult();
      if (singleResult) {
        results.push(singleResult);
        originalResults.push({...singleResult});
      }
    }

    if (results.length > 0) {
      const anonymizeEnabled = await GM.getValue(SETTING_ENABLE_ANONYMIZE, false);
      const formattedEntries = results.map(result => createStandardEntry(result, anonymizeEnabled));

      const formattedData = {
        "username": anonymizeEnabled ? hashString(userName || "").toString() : (userName || "USERNAMEHERE"),
        "entries": formattedEntries
      };

      const loggingEnabled = await GM.getValue(SETTING_ENABLE_LOGGING, true);
      const highlightingEnabled = await GM.getValue(SETTING_ENABLE_HIGHLIGHTING, true);
      const webhooksEnabled = await GM.getValue(SETTING_ENABLE_WEBHOOKS, false);

      let statusMessage = `${results.length} pet${results.length !== 1 ? 's' : ''} participated.`;
      let statusParts = [];

      if (loggingEnabled) {
        const serverResponse = await submitResultsToLogger(formattedData);
        statusParts.push("Your fishing results have been submitted");
      } else {
        statusParts.push("Data logging is disabled");
      }

      if (webhooksEnabled) {
        const webhookPromises = originalResults.map(result =>
          generatePrizeWebhooks(
            result.pet,
            result.oldlevel,
            result.item,
            result.image
          )
        );

        const webhookResponses = await Promise.all(webhookPromises);
        const completedWebhooks = webhookResponses.filter(r => r !== null);

        if (completedWebhooks.length > 0) {
          statusParts.push("Webhooks sent for notable prizes");
        }
      }

      statusMessage = `${statusParts.join(", ")}. ${statusMessage}`;

      if (!highlightingEnabled) {
        statusMessage += " (Prize highlighting is disabled)";
      }

      displayResults.innerHTML = statusMessage;
    } else {
      displayResults.innerHTML = "No fishing results were detected.";
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedCollectResults = debounce(collectFishingResults, 250);

  async function init() {
    initializeDOMCache();
    
    const isResultPage = document.referrer.endsWith("/water/fishing/") &&
      DOM.pageContent?.textContent.includes("You reel in your line and get");
      
    if (isResultPage) {
      debouncedCollectResults();
    }

    if (DOM.buttonFishOne || DOM.buttonFishAll) {
      const handleFishingClick = async function(event) {
        const isTargetButton = event.target === DOM.buttonFishOne || 
                              event.target === DOM.buttonFishAll;
        
        if (isTargetButton) {
          event.preventDefault();
          await getCurrentPetLevels();
          event.target.form.submit();
        }
      };

      document.addEventListener("click", handleFishingClick);
    }
  }

  init();

})();
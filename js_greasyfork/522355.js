// ==UserScript==
// @name         Show Weapon Bonuses on Market (No API needed)
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Shows the weapon bonuses for all applicable items on the item market
// @author       Weav3r
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/522355/Show%20Weapon%20Bonuses%20on%20Market%20%28No%20API%20needed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522355/Show%20Weapon%20Bonuses%20on%20Market%20%28No%20API%20needed%29.meta.js
// ==/UserScript==

//////// GLOBAL VARIABLES ////////
const GLOBAL_STATE = {
  userSettings: {
    highlightItemColors: true,
  },
};

// To prevent processing the same item multiple times
const processedItems = new WeakSet();

// Cache to store already extracted bonus percentages based on bonus elements
const bonusPercentageCache = new WeakMap();

//////// VIEW ////////
const stylesheet = `
  <style>
    .enhanced-item--yellow {
      --item-bgc: rgba(252, 247, 94, 0.1);
      --item-outline: #fcf75e;
    }

    .enhanced-item--red {
      --item-bgc: rgba(255, 0, 0, 0.1);
      --item-outline: #ff0000;
    }

    .enhanced-item--orange {
      --item-bgc: rgba(255, 165, 0, 0.1);
      --item-outline: #ffa500;
    }

    .enhanced-item {
      background: var(--item-bgc);
      outline: 2px solid var(--item-outline);
      outline-offset: -2px;
      border-radius: 5px;
    }

    .bonus-row {
      display: block;
      font-size: 0.85em;
      color: #777;
      margin: 2px 0;
      line-height: 1.2;
    }

    .bonus-item {
      display: inline-block;
      margin-right: 8px;
      font-weight: bold;      /* Makes the text bold */
      font-style: italic;     /* Makes the text italic */
    }

    .bonus-item:not(:last-child)::after {
      content: '•';
      margin-left: 8px;
    }
  </style>
`;

function renderStylesheet() {
  if (!document.getElementById('item-enhancement-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'item-enhancement-styles';
    styleEl.textContent = stylesheet;
    document.head.appendChild(styleEl);
    console.log('Item Enhancement Stylesheet added.');
  }
}

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Helper function to simulate hover and extract percentage
function getBonusPercentage(bonusEl, bonusName) {
  return new Promise((resolve) => {
    if (!bonusEl) {
      console.warn(`Bonus element for "${bonusName}" not found.`);
      return resolve('');
    }

    // If the percentage for this bonus element is already cached, return it
    if (bonusPercentageCache.has(bonusEl)) {
      const cachedPercentage = bonusPercentageCache.get(bonusEl);
      console.log(`Percentage for "${bonusName}" fetched from cache: ${cachedPercentage}`);
      return resolve(cachedPercentage);
    }

    // Function to handle tooltip extraction
    const extractPercentage = () => {
      const tooltipId = bonusEl.getAttribute('aria-describedby');
      if (!tooltipId) {
        console.warn(`No aria-describedby found for bonus "${bonusName}".`);
        return false;
      }

      const tooltipEl = document.getElementById(tooltipId);
      if (!tooltipEl) {
        console.warn(`Tooltip element with id "${tooltipId}" not found for bonus "${bonusName}".`);
        return false;
      }

      const tooltipText = tooltipEl.innerText;
      if (!tooltipText.toLowerCase().includes(bonusName.toLowerCase())) {
        console.warn(`Tooltip text does not include the bonus name "${bonusName}".`);
        return false;
      }

      // Extract percentage using regex (e.g., "16% chance", "128% increased")
      const match = tooltipText.match(/(\d+%)/);
      if (match && match[1]) {
        const percentage = match[1];
        bonusPercentageCache.set(bonusEl, percentage); // Cache the result
        console.log(`Extracted percentage for "${bonusName}": ${percentage}`);
        resolve(percentage);
        return true;
      } else {
        console.warn(`No percentage found in tooltip for bonus "${bonusName}".`);
        resolve('');
        return true;
      }
    };

    // Simulate mouseenter to trigger tooltip
    const mouseEnterEvent = new Event('mouseenter', { bubbles: true });
    bonusEl.dispatchEvent(mouseEnterEvent);
    console.log(`Simulated mouseenter for bonus "${bonusName}".`);

    // Polling mechanism to wait for tooltip to appear and contain the correct bonus name
    const startTime = Date.now();
    const maxWait = 300; // Maximum wait time of 300ms
    const intervalTime = 10; // Check every 10ms

    const interval = setInterval(() => {
      const isExtracted = extractPercentage();
      if (isExtracted) {
        clearInterval(interval);
        // Simulate mouseleave to hide the tooltip
        const mouseLeaveEvent = new Event('mouseleave', { bubbles: true });
        bonusEl.dispatchEvent(mouseLeaveEvent);
        console.log(`Simulated mouseleave for bonus "${bonusName}".`);
      } else if (Date.now() - startTime > maxWait) {
        // Timed out
        clearInterval(interval);
        console.warn(`Timed out extracting percentage for bonus "${bonusName}".`);
        // Simulate mouseleave to hide the tooltip
        const mouseLeaveEvent = new Event('mouseleave', { bubbles: true });
        bonusEl.dispatchEvent(mouseLeaveEvent);
        resolve('');
      }
    }, intervalTime);
  });
}

//////// MAIN ////////
async function processItem(itemEl) {
  if (!itemEl || processedItems.has(itemEl)) return;

  const bonusElements = itemEl.querySelectorAll('.bonuses___a8gmz i');
  if (bonusElements.length === 0) return;

  const titleContainer = itemEl.querySelector('.title___bQI0h');
  const priceElement = titleContainer?.querySelector('.priceAndTotal___eEVS7');
  if (!titleContainer || !priceElement) return;

  // Create bonus-row only if it doesn't exist
  let bonusRow = titleContainer.querySelector('.bonus-row');
  if (!bonusRow) {
    bonusRow = document.createElement('div');
    bonusRow.className = 'bonus-row';
  } else {
    // If bonus-row exists, clear its content to update
    bonusRow.innerHTML = '';
  }

  // Process bonuses sequentially to ensure correct tooltip association
  for (const bonus of bonusElements) {
    // Extract bonus name from aria-label
    const bonusName = bonus.getAttribute('aria-label');
    if (!bonusName) {
      console.warn('Bonus element missing aria-label attribute.');
      continue;
    }

    // Get percentage by simulating hover
    const percentage = await getBonusPercentage(bonus, bonusName);

    const displayText = percentage ? `${percentage} ${bonusName}` : bonusName;

    const bonusSpan = document.createElement('span');
    bonusSpan.className = 'bonus-item';
    bonusSpan.textContent = displayText;
    bonusRow.appendChild(bonusSpan);
  }

  // Append the bonus-row to the titleContainer before the priceElement
  titleContainer.insertBefore(bonusRow, priceElement);
  console.log(`Appended bonus-row for item "${titleContainer.querySelector('.name___ukdHN').innerText}".`);

  // Add highlighting based on glow color
  if (GLOBAL_STATE.userSettings.highlightItemColors) {
    const imageWrapper = itemEl.querySelector('.imageWrapper___RqvUg');
    if (imageWrapper) {
      // Extract glow color from class (e.g., "glow-yellow-border")
      const glowClass = [...imageWrapper.classList].find(cls => cls.startsWith('glow-'));
      if (glowClass) {
        // Normalize the class by removing '-border' to extract the color
        const normalizedClass = glowClass.replace('-border', '');
        // Extract color using regex
        const colorMatch = normalizedClass.match(/glow-([a-z]+)/i);
        if (colorMatch && colorMatch[1]) {
          const color = colorMatch[1].toLowerCase();
          // Define valid colors
          const validColors = ['yellow', 'red', 'orange']; // Extend this array with more colors if needed
          if (validColors.includes(color)) {
            itemEl.classList.add('enhanced-item', `enhanced-item--${color}`);
            console.log(`Added highlighting class: enhanced-item--${color} for item "${titleContainer.querySelector('.name___ukdHN').innerText}".`);
          } else {
            console.warn(`Color "${color}" not defined in CSS. Skipping highlight for item "${titleContainer.querySelector('.name___ukdHN').innerText}".`);
          }
        } else {
          console.warn(`Failed to extract color from glow class "${normalizedClass}" for item "${titleContainer.querySelector('.name___ukdHN').innerText}".`);
        }
      } else {
        console.warn(`No glow class found on imageWrapper for item "${titleContainer.querySelector('.name___ukdHN').innerText}".`);
      }
    } else {
      console.warn(`No imageWrapper found for item "${titleContainer.querySelector('.name___ukdHN').innerText}".`);
    }
  }

  // Mark this item as processed
  processedItems.add(itemEl);
  console.log(`Processed item: "${titleContainer.querySelector('.name___ukdHN').innerText}".`);
}

async function processExistingItems() {
  const itemList = document.querySelector('.itemList___u4Hg1');
  if (!itemList) return;

  const items = itemList.querySelectorAll('.itemTile___cbw7w');
  for (const item of items) {
    await processItem(item);
  }
}

(function() {
  renderStylesheet();
  processExistingItems();

  // Set up a single MutationObserver to watch for new items anywhere in the document
  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      // Check if new nodes are added
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          // If the added node is an item list, process its items
          if (node.matches('.itemList___u4Hg1')) {
            const items = node.querySelectorAll('.itemTile___cbw7w');
            for (const item of items) {
              await processItem(item);
            }
          }

          // If the added node is an individual item, process it
          if (node.matches && node.matches('.itemTile___cbw7w')) {
            await processItem(node);
          }

          // Additionally, check within the added node for any items
          const nestedItems = node.querySelectorAll('.itemTile___cbw7w');
          for (const item of nestedItems) {
            await processItem(item);
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Item Display Enhancement script initialized.');
})();

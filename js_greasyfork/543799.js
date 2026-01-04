// ==UserScript==
// @name         Item Market Auto Price
// @namespace    dev.kwack.torn.imarket-auto-price
// @version      1.1.3
// @description  Automatically set the price of items relative to the current market with settings menu
// @author       Kwack (original), Mr_Awaken (modified)
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @connect      api.torn.com
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/543799/Item%20Market%20Auto%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/543799/Item%20Market%20Auto%20Price.meta.js
// ==/UserScript==

// @ts-check

const inputSelector = `
  div[class*=itemRowWrapper] div[class*=priceInputWrapper]
  > div.input-money-group > input.input-money:not([type=hidden]):not(.kw--price-set),
  div[class*=itemRowWrapper] div[class*=amountInputWrapper][class*=hideMaxButton]
  > div.input-money-group > input.input-money:not([type=hidden]):not(.kw--price-set)
`;

const diff = 5;

let mainCalled = false;

// Function to show API key modal
function showApiKeyModal() {
  console.log("Showing API key modal");
  const modalHTML = `
    <div id="kw-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
         background: rgba(0, 0, 0, 0.8); z-index: 9999; display: flex; justify-content: center; align-items: center;">
      <div style="background: #1c1c1c; padding: 30px; border-radius: 8px; width: 400px; max-width: 90%;
          color: #fff; text-align: center; font-family: Arial, sans-serif;">
        <h2 style="margin-bottom: 10px;">🔐 Enter Your Torn API Key</h2>
        <p style="font-size: 14px; color: #ccc; margin-bottom: 20px;">
          We'll store it securely in your browser and only use it for fetching item market prices.
        </p>
        <input id="kw-api-input" type="text" value="${localStorage.getItem("tornAutoPriceAPIKey") || ''}" placeholder="Your API Key..." style="
          width: 100%; padding: 10px; border-radius: 4px; border: none; font-size: 16px;
          margin-bottom: 20px;" />
        <button id="kw-save-api" style="
          background: #00ccff; border: none; color: #000; padding: 10px 20px;
          font-weight: bold; border-radius: 5px; cursor: pointer;">
          Save & Continue
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document.getElementById("kw-save-api").addEventListener("click", () => {
    const input = /** @type {HTMLInputElement} */ (document.getElementById("kw-api-input"));
    const value = input.value.trim();
    if (value.length >= 16) {
      localStorage.setItem("tornAutoPriceAPIKey", value);
      document.getElementById("kw-modal").remove();
      console.log("API key saved:", value);
      main();
    } else {
      input.style.border = "2px solid red";
    }
  });
}

// Function to get API key from localStorage or show modal
function getApiKey() {
  const key = localStorage.getItem("tornAutoPriceAPIKey");
  if (!key) {
    showApiKeyModal();
  } else {
    console.log("API key retrieved:", key);
    main();
  }
}

// Add settings menu item
function addMarketAutoPriceSettingsMenuItem() {
  const menu = document.querySelector('.settings-menu');
  if (!menu || document.querySelector('.market-auto-price-settings-button')) return;
  const li = document.createElement('li');
  li.className = 'link market-auto-price-settings-button';
  const a = document.createElement('a');
  a.href = '#';
  const iconDiv = document.createElement('div');
  iconDiv.className = 'icon-wrapper';
  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('class', 'default');
  svgIcon.setAttribute('fill', '#fff');
  svgIcon.setAttribute('stroke', 'transparent');
  svgIcon.setAttribute('stroke-width', '0');
  svgIcon.setAttribute('width', '16');
  svgIcon.setAttribute('height', '16');
  svgIcon.setAttribute('viewBox', '0 0 512 512');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z');
  svgIcon.appendChild(path);
  iconDiv.appendChild(svgIcon);
  const span = document.createElement('span');
  span.textContent = 'Item Market Auto Price Settings';
  a.appendChild(iconDiv);
  a.appendChild(span);
  li.appendChild(a);
  a.addEventListener('click', e => {
    e.preventDefault();
    document.body.click();
    showApiKeyModal();
  });
  const logoutButton = menu.querySelector('li.logout');
  if (logoutButton) {
    menu.insertBefore(li, logoutButton);
  } else {
    menu.appendChild(li);
  }
}

const menuObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('settings-menu')) {
          addMarketAutoPriceSettingsMenuItem();
          break;
        }
      }
    }
  });
});
menuObserver.observe(document.body, { childList: true, subtree: true });

addMarketAutoPriceSettingsMenuItem();

// Wait for the specific elements to be present
function waitForElements(selector, callback) {
  const observer = new MutationObserver(() => {
    if (document.querySelector(selector)) {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Main function to set up event listeners
function main() {
  if (mainCalled) return;
  mainCalled = true;
  console.log("Running main");
  $(document).on("click", inputSelector, (e) => {
    const input = e.target;
    if (input.getAttribute("placeholder") === "Qty") {
      addQuantity(input).catch((e) => handleError(e, input));
    } else {
      addPrice(input).catch((e) => handleError(e, input));
    }
  });
}

// Function to get the lowest price from the API
function getLowestPrice(itemId, apiKey) {
  const baseURL = "https://api.torn.com/v2/market";
  const searchParams = new URLSearchParams({
    selections: "itemmarket",
    key: apiKey,
    id: itemId,
    offset: "0",
  });
  const url = new URL(`?${searchParams.toString()}`, baseURL);
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if ("error" in data) throw new Error(data.error.error);
      const price = data?.itemmarket?.listings?.[0]?.price;
      if (typeof price === "number" && price >= 1) return price;
      throw new Error(`Invalid price: ${price}`);
    });
}

// Function to update the input field
function updateInput(input, value) {
  input.value = `${value}`;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

// Function to set the price
async function addPrice(input) {
  if (!(input instanceof HTMLInputElement))
    throw new Error("Input is not an HTMLInputElement");
  const apiKey = localStorage.getItem("tornAutoPriceAPIKey");
  if (!apiKey) {
    throw new Error("API key not set. Please set it in the settings.");
  }
  const row = input.closest("div[class*=itemRowWrapper]");
  const image = row?.querySelector("img");
  if (!image) throw new Error("Could not find image element");
  if (image.parentElement?.matches("[class*='glow-']"))
    throw new Warning("Skipping a glowing RW item");
  const itemId = image.src?.match(/\/images\/items\/([\d]+)\//)?.[1];
  if (!itemId) throw new Error("Could not find item ID");
  const currentLowestPrice = await getLowestPrice(itemId, apiKey);
  const priceToSet = Math.max(1, currentLowestPrice - diff);
  updateInput(input, priceToSet);
  input.classList.add("kw--price-set");
}

// Function to set the quantity to max
async function addQuantity(input) {
  if (!(input instanceof HTMLInputElement))
    throw new Error("Input is not an HTMLInputElement");
  updateInput(input, "max");
  input.classList.add("kw--price-set");
}

// Error handling
function handleError(e, input) {
  if (e instanceof Warning) {
    console.warn(e);
    input.style.outline = "2px solid yellow";
  } else {
    console.error(e);
    input.style.outline = "2px solid red";
  }
}

// Custom Warning class
class Warning extends Error {}

// Start the script by waiting for the elements
waitForElements(inputSelector, getApiKey);
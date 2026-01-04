// ==UserScript==
// @name         show item market bonuses
// @namespace    show-bonuses.zero.nao
// @version      0.1
// @description  shows bonuses in the item market
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/526247/show%20item%20market%20bonuses.user.js
// @updateURL https://update.greasyfork.org/scripts/526247/show%20item%20market%20bonuses.meta.js
// ==/UserScript==

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const [resource, config] = args;
  const url = resource instanceof Request ? resource.url : resource;

  if (url.includes("step=getShopList")) {
    console.log("[ARMORYBONAOS] Request:", { url, config });

    try {
      const response = await originalFetch(...args);

      const clone = response.clone();

      const jsonResponse = await clone.json();
      console.log("[ARMORYBONAOS] Original Response:", jsonResponse);

      jsonResponse.items.forEach((item) => {
        let bonusString = [];
        item.bonuses.forEach((bonus) => {
          if (bonus.title) {
            const bonusValue =
              bonus.description.match(/[0-9]+%/)?.[0].replace("%", "") || "";
            if (bonusValue) {
              bonusString.push(`${bonusValue}`);
            }
          }
        });

        bonusString = bonusString.join(" | ");
        item.itemName = bonusString
          ? `[${bonusString}] ${item.itemName} `
          : item.itemName;
      });

      console.log("[ARMORYBONAOS] Modified Response:", jsonResponse);

      const modifiedResponse = new Response(JSON.stringify(jsonResponse), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      return modifiedResponse;
    } catch (error) {
      console.error("[ARMORYBONAOS] Error:", error);
      return originalFetch(...args);
    }
  }

  return originalFetch(...args);
};

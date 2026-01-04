// ==UserScript==
// @name         execute
// @namespace    execute.zero.nao
// @version      0.3
// @description  execute highlight
// @author       nao [2669774]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522868/execute.user.js
// @updateURL https://update.greasyfork.org/scripts/522868/execute.meta.js
// ==/UserScript==

const { fetch: origFetch } = window;
let percentage = 0;

window.fetch = async (...args) => {
  const response = await origFetch(...args);

  // Check if the response URL matches the desired endpoint
  if (response.url.includes("loader.php?sid=attackData")) {
    try {
      // Clone the response and parse it as JSON
      //
      console.log("Intercepted fetch response:", response);
      const body = await response.clone().json();

      const bonuses =
        body?.DB?.attackerItems?.[2]?.item?.[0]?.currentBonuses || {};
      console.log(bonuses);
      for (const bonus in bonuses) {
        const bonusData = bonuses[bonus];
        if (bonusData.title === "Execute") {
          const executePercent = bonusData.value;
          const defenderLife = body?.DB?.defenderUser?.life || 0;
          const maxLife = body?.DB?.defenderUser?.maxlife - 0 || 0;
          const executeThreshold = (maxLife * executePercent) / 100;
          percentage = executePercent;
          insert();

          console.log(executePercent, defenderLife, maxLife);

          if (defenderLife < executeThreshold) {
            const weaponElement = document.querySelector("#weapon_second");
            if (weaponElement) {
              weaponElement.style.backgroundColor = "red";
            } else {
              console.warn("#weapon_second element not found");
            }
          }
        }
      }
    } catch (err) {
      console.error("Error processing response:", err);
    }
  }

  // Return the original response
  return response;
};

function insert() {
  if ($(".pbWrap___K0uUO ").length > 0) {
    const rect = `<div class="percentzero" style="width: ${percentage}%;height: 10px;position: absolute;z-index: 5;border-right: 2px solid black;"></div>`;
    $(".pbWrap___K0uUO ").prepend(rect);
  } else {
    setTimeout(insert, 300);
  }
}

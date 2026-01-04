// ==UserScript==
// @name        Copy Bank Balance
// @match       https://www.torn.com/factions.php*
// @grant       none
// @version     1.0
// @author      IAmBatman [2885239]
// @description Copy faction bank balance
// @namespace https://greasyfork.org/users/1362698
// @downloadURL https://update.greasyfork.org/scripts/522122/Copy%20Bank%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/522122/Copy%20Bank%20Balance.meta.js
// ==/UserScript==

(function () {
  const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector(".input-money")) {
      const inputMoney = document.querySelector(".input-money");
      obs.disconnect();

      inputMoney.addEventListener("focus", () => {
        const username = document.querySelector(
          "[class^=menu-value___]"
        ).textContent;
        const nameEls = document.querySelectorAll(".user.name");

        nameEls.forEach((nameEl) => {
          if (nameEl.dataset.placeholder.includes(username)) {
            const userMoney =
              nameEl.parentElement.querySelector(".money")?.dataset.value;

            if (userMoney) {
              navigator.clipboard.writeText(userMoney);
            }
          }
        });
      });

      return;
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

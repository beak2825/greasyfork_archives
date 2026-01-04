// ==UserScript==
// @name         Weapon & Armor UID Faction
// @namespace    https://torn.report/userscripts/
// @version      0.1
// @description  Displays weapon and armor UID on the Faction Armory page.
// @author       Skeletron [318855]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478314/Weapon%20%20Armor%20UID%20Faction.user.js
// @updateURL https://update.greasyfork.org/scripts/478314/Weapon%20%20Armor%20UID%20Faction.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const armory = "#faction-armoury";
  const weapons = "#armoury-weapons > ul.item-list";
  const armor = "#armoury-armour > ul.item-list";
  const parent = document.querySelector(armory);
  const weaponsNode = parent.querySelector(weapons);
  const armourNode = parent.querySelector(armor);

  if (!weaponsNode || !armourNode) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.matches && node.matches(weapons)) {
              addUID(node);
            } else if (node.matches && node.matches(armor)) {
              addUID(node);
            }
          });
        }
      });
    });
    observer.observe(parent, { childList: true, subtree: true });
  }

  function addUID(node) {
    const items = Array.from(node.children);
    items.forEach((item) => {
      const UID = item
        .querySelector("li div.img-wrap")
        .getAttribute("data-armoryid");
      const itemName = item.querySelector("li div.name");
      if (UID && itemName && !itemName.classList.contains("uid-added")) {
        itemName.innerHTML += ` [${UID}]`;
        itemName.classList.add("uid-added");
      }
    });
  }
})();

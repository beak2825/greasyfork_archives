// ==UserScript==
// @name         Weapon & Armor UID
// @namespace    https://torn.report/userscripts/
// @version      0.5
// @description  Displays weapon and armor UID & adds details export button on the Items page.
// @author       Skeletron [318855]
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478313/Weapon%20%20Armor%20UID.user.js
// @updateURL https://update.greasyfork.org/scripts/478313/Weapon%20%20Armor%20UID.meta.js
// ==/UserScript==

const cont = document.createElement("div");
cont.className = "tutorial-cont";

const titleCont = document.createElement("div");
titleCont.className = "title-gray top-round";
titleCont.setAttribute("role", "heading");
titleCont.setAttribute("aria-level", "5");

const title = document.createElement("span");
title.className = "tutorial-title";
title.innerHTML = "torn.report - Weapons & Armor Details";

titleCont.appendChild(title);
cont.appendChild(titleCont);

const desc = document.createElement("div");
desc.className = "tutorial-desc bottom-round cont-gray p10";
desc.innerHTML = `
  <p>Export your weapons and armor details here to have them on the Item Stats page!</p>
  <p>Make sure to scroll down completely on each page to load all items, then click the Copy to Clipboard button. This can be repeated for new weapons, or if you missed some weapons/armor.</p>
  <p>Once copied, simply paste them on the Item Stats page using the paste icon in the top right.</p>`;

const btnWrap = document.createElement("div");
btnWrap.style.display = "flex";
btnWrap.style.justifyContent = "start";
btnWrap.style.marginTop = "10px";

const btn = document.createElement("div");
btn.className = "torn-btn";
btn.innerHTML = "Copy to Clipboard";
btn.style.width = "120px";
btn.style.display = "flex";
btn.style.alignItems = "center";
btn.style.justifyContent = "center";

btnWrap.appendChild(btn);
desc.appendChild(btnWrap);
cont.appendChild(desc);

const delim = document.createElement("hr");
delim.className = "delimiter-999 m-top10 m-bottom10";

const bonusTypes = {
  Bloodlust: (bonus) => bonus.title.split(" of")[0].split("by ")[1],
  Disarm: (bonus) => bonus.title.split(" turns")[0].split("for ")[1],
  Eviscerate: (bonus) => bonus.title.split(" extra")[0].split("them ")[1],
  Execute: (bonus) => bonus.title.split(" life")[0].split("below ")[1],
  Irradiate: () => "",
  Penetrate: (bonus) => bonus.title.split(" of")[0].split("Ignores ")[1],
  Radiation: () => "",
  Smash: () => "",
};

(function () {
  "use strict";

  const items = {};

  const targetNodes = document.querySelectorAll(
    "ul#primary-items, ul#secondary-items, ul#melee-items, ul#armour-items"
  );

  const config = {
    childList: true,
  };

  const callback = (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        Array.from(mutation.target.children).forEach((listing) => {
          let color;
          const UID = listing.getAttribute("data-armoryid");
          const ID = listing.getAttribute("data-item");
          const type = listing.getAttribute("data-category");
          const nameEl = listing.querySelector(".name");
          const itemName = listing
            .querySelector("div.thumbnail-wrap")
            .getAttribute("aria-label");
          const glow = listing.querySelector('[class*="glow-"]');
          if (glow) {
            for (const className of glow.classList) {
              if (className.startsWith("glow-")) {
                color =
                  className.slice(5).charAt(0).toUpperCase() +
                  className.slice(6);
              }
            }
          }
          if (UID && nameEl && !nameEl.classList.contains("uid-added")) {
            nameEl.classList.add("uid-added");
            nameEl.innerHTML = itemName + ` [${UID}]`;
            const item = { ID, UID, type, name: itemName };
            color && (item.rarity = color);
            const details = listing.querySelectorAll("li.left");
            let bonuses;
            if (mutation.target.getAttribute("id") !== "armour-items") {
              item.damage = parseFloat(
                details[0].querySelector("span").innerHTML
              );
              item.accuracy = parseFloat(
                details[1].querySelector("span").innerHTML
              );
              bonuses = details[3].querySelectorAll("i");
            } else {
              item.armor = parseFloat(
                details[0].querySelector("span").innerHTML
              );
              bonuses = details[2].querySelectorAll("i");
            }
            bonuses.forEach((bonus) => {
              if (bonus.title) {
                const name = bonus.title.split(">")[1].split("<")[0];
                let value = bonus.title.split("%")[0].split(">")[3];
                const tooltip = bonus.title;
                const icon = bonus.className;
                if (name in bonusTypes) {
                  value = bonusTypes[name](bonus);
                }
                item.bonuses
                  ? item.bonuses.push({
                      name,
                      value: parseInt(value),
                      tooltip,
                      icon,
                    })
                  : (item.bonuses = [
                      { name, value: parseInt(value), tooltip, icon },
                    ]);
              }
            });
            items[UID] = item;
          }
        });
      }
    });
  };

  const observer = new MutationObserver(callback);

  targetNodes.forEach((targetNode) => {
    observer.observe(targetNode, config);
  });

  document
    .getElementById("category-wrap")
    .insertAdjacentElement("afterend", delim)
    .insertAdjacentElement("afterend", cont);

  btn.addEventListener("click", () => {
    copyToClipboard(JSON.stringify(items));
  });
})();

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      updateButtonText("Done!");
    })
    .catch((err) => {
      console.log(err);
      updateButtonText("Error Copying!");
    });
}

function updateButtonText(text) {
  btn.innerHTML = text;
  setTimeout(() => {
    btn.innerHTML = "Copy to Clipboard";
  }, 2000);
}

// ==UserScript==
// @name        GazelleGames pet leveling info with last dropped item and TZ Adjustment
// @namespace   v3rrrr82xk1c96vvo1c6
// @match       https://gazellegames.net/user.php?id=*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @version     1.5.1.1
// @description Adds pet leveling info and last dropped item to your own profile page
// @author      lunboks & modified by InspireToExpire, Tweaked by HerrKomissar
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/521052/GazelleGames%20pet%20leveling%20info%20with%20last%20dropped%20item%20and%20TZ%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/521052/GazelleGames%20pet%20leveling%20info%20with%20last%20dropped%20item%20and%20TZ%20Adjustment.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  //Timezone and DST Adjustment
  const TZAdj = -5; //Standard time adjustment from UTC (EST by default)
  const DSTToggle = 0; //Currently in Daylight Savings

  const theirUserID = new URLSearchParams(location.search).get("id");
  const ownUserID = await GM.getValue("you").then((yourID) => {
    if (yourID) {
      return yourID;
    }

    return new Promise((resolve) => {
      window.addEventListener("DOMContentLoaded", () => {
        yourID = new URLSearchParams(
          document.body.querySelector("#nav_userinfo a.username").search
        ).get("id");
        GM.setValue("you", yourID);
        resolve(yourID);
      });
    });
  });

  if (theirUserID !== ownUserID) {
    return;
  }

  let apiKey = await GM.getValue("apiKey");

  if (!apiKey) {
    if (
      !(apiKey = prompt(
        "Please enter an API key with the 'Items' and 'User' permission to use this script."
      )?.trim())
    ) {
      return;
    }
    GM.setValue("apiKey", apiKey);
  }

  const equipEndpoint =
    "https://gazellegames.net/api.php?request=items&type=users_equipped&include_info=true";
  const options = {
    method: "GET",
    mode: "same-origin",
    credentials: "omit",
    redirect: "error",
    referrerPolicy: "no-referrer",
    headers: {
      "X-API-Key": apiKey,
    },
  };

  const equipment = await (await fetch(equipEndpoint, options)).json();

  if (equipment.status !== "success") {
    if (equipment.status === 401) {
      GM.deleteValue("apiKey");
    }
    return;
  }

  const userlogEndpoint = `https://gazellegames.net/api.php?request=userlog&search=dropped`;
  const userLog = await (await fetch(userlogEndpoint, options)).json();

  if (userLog.status !== "success") {
    if (equipment.status === 401) {
      GM.deleteValue("apiKey");
    }
    return;
  }

  function toInt(value) {
    return typeof value === "number" ? value : parseInt(value, 10);
  }

  const levelingPetIDs = new Set([
    "2509",
    "2510",
    "2511",
    "2512",
    "2513",
    "2514",
    "2515",
    "2521",
    "2522",
    "2523",
    "2524",
    "2525",
    "2529",
    "2583",
    "2927",
    "2928",
    "2929",
    "2933",
    "3215",
    "3216",
    "3237",
    "3322",
    "3323",
    "3324",
    "3369",
    "3370",
    "3371",
    "3373",
  ]);
  const pets = [];

  for (const equip of equipment.response) {
    const type = equip.item.equipType;

    if (
      type &&
      String(type) === "18" &&
      (levelingPetIDs.has(equip.itemid) || equip.experience > 0)
    ) {
      pets.push({
        name: equip.item.name,
        xp: toInt(equip.experience),
        lv: toInt(equip.level),
        id: String(equip.itemid),
        slot: toInt(equip.slotid),
      });
    }
  }

  if (!pets.length) return;

  pets.sort((first, second) => first.slot - second.slot);

  const box = document.createElement("div");
  const innerBox = document.createElement("div");
  const list = document.createElement("ul");
  const heading = document.createElement("div");

  box.className = "box_personal_history";
  innerBox.className = "box";
  heading.className = "head colhead_dark";
  list.className = "stats nobullet";
  list.style.lineHeight = "1.5";

  heading.append("Pet Leveling");
  innerBox.append(heading, list);
  box.append(innerBox);

  function totalXP(lv) {
    return Math.ceil((lv * lv * 625) / 9);
  }

  function xpToTimeString(xp) {
    const days = Math.floor(xp / 24);
    const hours = xp % 24;
    let timeString = "";

    if (days) {
      const s = days === 1 ? "" : "s";
      timeString = `${days} day${s}`;
    }
    if (hours) {
      if (timeString) {
        timeString += " ";
      }
      const s = hours === 1 ? "" : "s";
      timeString += `${hours} hour${s}`;
    } else if (!timeString) {
      timeString = "0 hours";
    }

    return timeString;
  }

  const listItems = [];

  for (const pet of pets) {
    const liItem = document.createElement("li");
    const liLevelInput = document.createElement("li");
    const liTimeOutput = document.createElement("li");
    const shopLink = document.createElement("a");

    if (listItems.length > 0) {
      const hr = document.createElement("hr");
      listItems.push(hr);
    }

    liItem.style.marginTop = "0.6em";
    liLevelInput.style.paddingLeft = "10px";
    liTimeOutput.style.paddingLeft = "10px";

    shopLink.style.fontWeight = "bold";
    shopLink.href = `/shop.php?ItemID=${pet.id}`;
    shopLink.referrerPolicy = "no-referrer";
    shopLink.title = "Shop for this pet";

    const nextLevel = pet.lv + 1;

    const targetLevelInput = document.createElement("input");
    targetLevelInput.type = "number";
    targetLevelInput.required = true;
    targetLevelInput.inputmode = "numeric";
    targetLevelInput.style.width = "3em";
    targetLevelInput.min = nextLevel;
    targetLevelInput.max = Math.max(999, nextLevel);
    targetLevelInput.value = nextLevel;

    const displayTimeDifference = (toLevel) => {
      const missingXP = totalXP(toLevel) - pet.xp;
      liTimeOutput.textContent = xpToTimeString(missingXP);
    };

    displayTimeDifference(nextLevel);

    targetLevelInput.addEventListener("input", function () {
      if (this.checkValidity()) {
        displayTimeDifference(parseInt(this.value, 10));
      }
    });

    targetLevelInput.addEventListener("change", function () {
      setTimeout(() => {
        if (!this.reportValidity()) {
          liTimeOutput.textContent = "";
        }
      });
    });

    shopLink.append(pet.name);
    liItem.append(shopLink);
    liLevelInput.append(`Level ${pet.lv} → `, targetLevelInput);

    listItems.push(liItem, liLevelInput, liTimeOutput);

    const userLogResponseArray = await userLog.response;

    let lastDroppedItem = "No items found";

    function extractPetDetails(message) {
      const petNameMatch = message.match(/level \d+ (.+?) \(\w+ slot\)/);
      const petSlotMatch = message.match(/\((\w+) slot\)/);
      if (!petNameMatch || !petSlotMatch) return null;

      const itemName = message.match(/dropped(?:\s+a)? (.+)\.$/);
      if (!itemName) return null;

      const petLevelMatch = message.match(/level (\d+)/);
      const petLevel = petLevelMatch ? petLevelMatch[1] : "Unknown";
      const petSlot =
        petSlotMatch[1] === "Left"
          ? 14
          : petSlotMatch[1] === "Right"
          ? 15
          : "Unknown";

      return {
        itemName: itemName[1],
        petName: petNameMatch[1],
        petLevel,
        petSlot,
      };
    }

    function getTimeAgoString(timeDifferenceMs) {
      const seconds = Math.floor(timeDifferenceMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        return `${days} Day${days > 1 ? "s" : ""} ${hours % 24} Hour${
          hours % 24 > 1 ? "s" : ""
        } ${minutes % 60} Minute${minutes % 60 > 1 ? "s" : ""} Ago`;
      } else if (hours > 0) {
        return `${hours} Hour${hours > 1 ? "s" : ""} ${minutes % 60} Minute${
          minutes % 60 > 1 ? "s" : ""
        } Ago`;
      } else if (minutes > 0) {
        return `${minutes} Minute${minutes > 1 ? "s" : ""} ${
          seconds % 60
        } Second${seconds % 60 > 1 ? "s" : ""} Ago`;
      } else {
        return `${seconds} Second${seconds > 1 ? "s" : ""} Ago`;
      }
    }

    if (userLogResponseArray.length > 0) {
      for (const petDropLog of userLogResponseArray) {
        const petDropInfo = extractPetDetails(petDropLog.message);
        if (!petDropInfo) continue;
        const { itemName, petName, petLevel, petSlot } = petDropInfo;

        if (
          itemName &&
          petName &&
          petSlot === pet.slot &&
          petName.toLowerCase().includes(pet.name.toLowerCase())
        ) {
          const dropTime = new Date(petDropLog.time);
          dropTime.setHours(dropTime.getHours() + TZAdj + DSTToggle);
          const timeAgoString = getTimeAgoString(
            Date.now() - dropTime.getTime()
          );
          lastDroppedItem = `Last dropped a ${itemName} (${timeAgoString})`;
          break;
        }
      }
    }

    const lastDroppedItemInfo = document.createElement("li");
    lastDroppedItemInfo.textContent = lastDroppedItem;
    lastDroppedItemInfo.style.paddingBottom = "10px";
    listItems.push(lastDroppedItemInfo);
  }

  list.append(...listItems);

  function insert() {
    document.getElementsByName("user_info")[0]?.after(box);
    return box.isConnected;
  }

  if (!insert()) {
    window.addEventListener("DOMContentLoaded", insert);
  }
})();

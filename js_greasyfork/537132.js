// ==UserScript==
// @name         FRPG HUD
// @namespace    AppleBottomJeans.FRPG.HUD
// @version      2025-07-26
// @description  Live inventory monitoring, meal timers and more!
// @author       AppleBottomJeans
// @match        https://farmrpg.com/index.php
// @match        https://farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @license      GNU GPLv3
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537132/FRPG%20HUD.user.js
// @updateURL https://update.greasyfork.org/scripts/537132/FRPG%20HUD.meta.js
// ==/UserScript==


(function() {
  "use strict";
  var _a;
  const STORAGE_KEYS = {
    INVENTORY: "frpg.inventory",
    INVENTORY_LIMIT: "frpg.inventory-limit",
    RECIPES: "frpg.recipes",
    RETURN_RATE: "frpg.return-rate",
    LOCATION_PREFIX: "frpg.location",
    QUICK_ACTIONS: "frpg.quick-actions",
    TOWNSFOLK: "frpg.townsfolk",
    HUD_STATUS: "frpg.hud-status",
    HUD_ITEMS: "frpg.hud-items",
    HUD_URL: "frpg.hud-url",
    HUD_STASH: "frpg.hud-stash",
    HUD_TIMERS: "frpg.hud-timers",
    SUPPLY_PACKS: "frpg.supply-packs",
    NEW_ITEM: "frpg.new-item",
    CRAFTWORKS: "frpg.craftworks",
    SETTINGS: "frpg.settings",
    PRODUCTION: "frpg.production",
    PRODUCTION_LAST_UPDATE: "frpg.production-last-update",
    PRODUCTION_LOCK: "frpg.production-lock"
  };
  const HUD_DISPLAY_MODES = {
    INVENTORY: "INVENTORY",
    MEAL: "MEAL",
    TIMER: "TIMER"
  };
  const seedCrop = {
    "14": "13",
    // Eggplant
    "16": "15",
    // Tomato
    "20": "19",
    // Carrot
    "30": "29",
    // Cucumber
    "32": "31",
    // Radish
    "34": "33",
    // Onion
    "47": "46",
    // Hops
    "49": "48",
    // Potato
    "51": "50",
    // Leek
    "60": "59",
    // Watermelon
    "64": "65",
    // Corn
    "66": "67",
    // Cabbage
    "68": "69",
    // Pumpkin
    "70": "71",
    // Wheat
    "160": "159",
    // Gold Carrot
    "190": "189",
    // Gold Cucumber
    "255": "254",
    // Cotton
    "257": "256",
    // Broccoli
    "352": "262",
    // Gold Eggplant
    "374": "373",
    // Sunflower
    "449": "450",
    // Beet
    "631": "630",
    // Rice
    "158": "157",
    // Gold Pepper
    "162": "161",
    // Gold Pea
    "588": "450",
    // Mega Beet
    "741": "254",
    // Mega Cotton
    "589": "373",
    // Mega Sunflower
    "395": "43",
    // Mushroom
    "28": "27",
    // Pea
    "12": "11",
    // Pepper
    "410": "409"
    // Pine
  };
  const staminaItems = ["Apple", "Orange Juice"];
  const mealTimeExceptions = {
    "Breakfast Boost": 2 * 60,
    "Cabbage Stew": 2 * 60,
    "Lemon Cream Pie": 2 * 60,
    "Crunchy Omelette": 2 * 60,
    "Hickory Omelette": 60 * 60
  };
  const loadouts = {
    "Hourly": {
      items: ["Stone", "Coal", "Wood", "Board", "Sandstone", "Straw", "Steel", "Steel Wire"]
    },
    "Reset": {
      items: ["Apple", "Grapes", "Lemon", "Orange", "Antler", "Milk", "Eggs", "Feathers", "Black Truffle", "White Truffle", "Steak", "Steak Kabob"]
    },
    "Meals": {
      items: ["Mushroom Stew", "Shrimp-a-Plenty", "Quandary Chowder", "Neigh", "Lemon Cream Pie", "Cabbage Stew", "Cat's Meow", "Sea Pincher Special", "Hickory Omelette", "Breakfast Boost", "Over The Moon", "Onion Soup"],
      displayMode: HUD_DISPLAY_MODES.MEAL
    },
    "Cookies": {
      items: ["Mushroom Stew", "Breakfast Boost", "Happy Cookies", "Spooky Cookies", "Lovely Cookies"],
      displayMode: HUD_DISPLAY_MODES.MEAL
    }
  };
  const mealNames = /* @__PURE__ */ new Set([...loadouts.Meals.items, ...loadouts.Cookies.items]);
  const wheelItems = ["Apple", "Apple Cider", "Orange Juice", "Lemonade", "Fishing Net", "Rope", "Mushroom Paste", "Yarn"];
  const unsellableItems = ["White Truffle", "Black Truffle"];
  const darkModeActive = (((_a = document.querySelector("#dark_mode")) == null ? void 0 : _a.innerText.trim()) ?? "1") === "1";
  const defaultSettings = {
    mealTimersEnabled: {
      label: "Display meal timers",
      default: true
    },
    processCraftworks: {
      label: "Run craftworks simulation",
      default: true
    }
  };
  const farmProductionKeys = {
    "Worms": "Worms",
    "Gummy Worms": "Gummies",
    "Mealworms": "Mealworms",
    "Grubs": "Grubs",
    "Minnows": "Minnows",
    "Wood": "Wood",
    "Board": "Boards",
    "Oak": "Oak",
    "Steel": "Steel",
    "Steel Wire": "Wire",
    "Straw": "Straw",
    "Stone": "Stone",
    "Sandstone": "Stone",
    "Coal": "Coal Hourly"
  };
  const tenMinuteProductionItems = ["Straw", "Stone", "Sandstone"];
  const hourlyProductionItems = ["Wood", "Board", "Coal", "Steel", "Steel Wire", "Oak", "Worms", "Gummy Worms", "Mealworms", "Grubs", "Minnows"];
  const parseHtml = (htmlString) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    return tempElement;
  };
  function debounceHudUpdate(fn, delay) {
    let timer = null;
    let lastArgs = null;
    let lastThis = null;
    let invoked = false;
    return function(...args) {
      lastArgs = args;
      lastThis = this;
      const callNow = !invoked || args[0];
      if (timer) {
        clearTimeout(timer);
      }
      if (callNow) {
        fn.apply(lastThis, lastArgs);
        invoked = true;
      }
      timer = setTimeout(() => {
        fn.apply(lastThis, lastArgs);
        timer = null;
        invoked = false;
      }, delay);
    };
  }
  const refreshInventory = () => {
    myApp.showIndicator();
    $.ajax({
      url: `inventory.php`,
      method: "GET"
    }).done(() => {
      myApp.hideIndicator();
    });
  };
  const getDefaultTextColor = () => darkModeActive ? "white" : "black";
  const getMaterialsDelta = (recipe, amountConsumed) => {
    const delta = {};
    for (const [materialName, requiredPerCraft] of Object.entries(recipe)) {
      if (["Iron", "Nails"].includes(materialName)) continue;
      delta[materialName] = requiredPerCraft * amountConsumed * -1;
    }
    return delta;
  };
  const getMaxCraftable = (recipe, inventory) => {
    return Math.min(...Object.entries(recipe).map(([materialName, requiredPerCraft]) => {
      var _a2;
      const materialId = itemNameIdMap.get(materialName);
      return Math.floor((((_a2 = inventory[materialId]) == null ? void 0 : _a2.count) ?? 0) / requiredPerCraft);
    }));
  };
  const getCraftResult = (remainingSlots, maxCraftable, returnRate2) => {
    maxCraftable = Math.min(maxCraftable, remainingSlots);
    const amountCrafted = Math.min(remainingSlots, Math.round(maxCraftable * returnRate2));
    const materialsUsed = Math.round(amountCrafted / returnRate2);
    return { amountCrafted, materialsUsed };
  };
  let returnRate = GM_getValue(STORAGE_KEYS.RETURN_RATE, 1.45);
  const setReturnRate = (rate) => returnRate = rate;
  let recipes = GM_getValue(STORAGE_KEYS.RECIPES, {});
  const setRecipes = (newRecipes) => recipes = newRecipes;
  const craftworksDependencies = /* @__PURE__ */ new Set();
  let craftworks = GM_getValue(STORAGE_KEYS.CRAFTWORKS, []);
  const setCraftworks = (value) => {
    craftworks = value;
    generateDependencies();
  };
  const generateDependencies = () => {
    craftworksDependencies.clear();
    for (const { item, enabled } of craftworks) {
      if (!enabled) continue;
      craftworksDependencies.add(item);
      const itemName = inventoryCache[item].name;
      const recipe = recipes[itemName];
      if (!recipe) continue;
      Object.keys(recipe).forEach((materialName) => craftworksDependencies.add(itemNameIdMap.get(materialName)));
    }
  };
  const numberFormatter = Intl.NumberFormat("en-GB");
  const parseNumberWithCommas = (text) => {
    return Number(text.replaceAll(",", ""));
  };
  const getFormattedNumber = (number) => {
    return Number.isNaN(number) ? "0" : numberFormatter.format(number);
  };
  let statsData = [];
  const setStatsData = (data) => statsData = data;
  let statsHtml = "";
  const setStatsHtml = (html) => statsHtml = html;
  let hudStatus = GM_getValue(STORAGE_KEYS.HUD_STATUS, false);
  const setHudStatus = (status) => hudStatus = status;
  let hudItems = GM_getValue(STORAGE_KEYS.HUD_ITEMS, []);
  const setHudItems = (items) => hudItems = items;
  let hudTimers = GM_getValue(STORAGE_KEYS.HUD_TIMERS, {});
  let hudStash = GM_getValue(STORAGE_KEYS.HUD_STASH, null);
  const setHudStash = (value) => hudStash = value;
  let hudTimerInterval = null;
  const handleHudTimerUpdate = (value) => {
    hudTimers = value;
    clearInterval(hudTimerInterval);
    if (Object.keys(value).length > 0 && settings.mealTimersEnabled) {
      hudTimerInterval = setInterval(updateHudDisplay, 1e3);
    }
    return true;
  };
  setTimeout(() => handleHudTimerUpdate(hudTimers));
  let hudUrl = GM_getValue(STORAGE_KEYS.HUD_URL, null);
  const setHudUrl = (url) => hudUrl = url;
  const toggleHudStatus = () => {
    GM_setValue(STORAGE_KEYS.HUD_STATUS, !hudStatus);
  };
  unsafeWindow.toggleHudStatus = toggleHudStatus;
  const addHudItems = (items) => {
    const seenIds = /* @__PURE__ */ new Set();
    const updatedItems = [];
    for (const item of [...hudItems, ...items]) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        updatedItems.push(item);
      }
    }
    if (updatedItems.length > hudItems.length) GM_setValue(STORAGE_KEYS.HUD_ITEMS, updatedItems);
  };
  const setHudDetails = (items, url) => {
    items = items.filter((item) => !["Iron", "Nails"].includes(item.name));
    GM_setValue(STORAGE_KEYS.HUD_ITEMS, items);
    if (url) {
      GM_setValue(STORAGE_KEYS.HUD_URL, url);
    }
  };
  const setHudItemsByName = (items, displayMode = HUD_DISPLAY_MODES.INVENTORY) => {
    setHudDetails(items.map((item) => {
      return { ...inventoryCache[itemNameIdMap.get(item)], displayMode };
    }).filter((item) => item.id));
  };
  const removeHudItem = (items) => {
    const updatedItems = hudItems.filter((item) => !items.includes(item.id));
    GM_setValue(STORAGE_KEYS.HUD_ITEMS, updatedItems);
  };
  const restoreHudItems = () => {
    if (hudStash === null) return;
    setHudItemsByName(hudStash);
    GM_setValue(STORAGE_KEYS.HUD_STASH, null);
  };
  const formatRemainingTime = (timer, currentTime) => {
    const remainingSeconds = Math.max(0, Math.floor((timer - currentTime) / 1e3));
    if (remainingSeconds < 60) {
      return `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
    } else if (remainingSeconds < 3600) {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      return `${minutes} mins ${seconds.toString().padStart(2, "0")} secs`;
    } else {
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor(remainingSeconds % 3600 / 60);
      const seconds = remainingSeconds % 60;
      return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
    }
  };
  const hudHtmlCallbacks = {
    [HUD_DISPLAY_MODES.INVENTORY]: ({ image, count }) => {
      let textColour = getDefaultTextColor();
      if (count >= inventoryLimit) textColour = "red";
      else if (count >= inventoryLimit * 0.8) {
        const percent = count / inventoryLimit;
        const green = Math.round(255 - (percent - 0.8) / 0.2 * (255 - 100));
        textColour = `rgb(255, ${green}, 50);`;
      }
      return `
            <span style="color: ${textColour};">
                <img src="${image}" class="itemimgmini" style="width:15px; vertical-align:middle; padding-right:1px">
                ${getFormattedNumber(count)} / ${getFormattedNumber(inventoryLimit)} &nbsp;
            </span>`;
    },
    [HUD_DISPLAY_MODES.MEAL]: ({ name, image, count }) => {
      const textColour = count === 0 ? "red" : getDefaultTextColor();
      return `
            <span style="color: ${textColour};">
                <img src="${image}" class="itemimgmini" style="width:15px; vertical-align:middle; padding-right:1px">
                ${name} (${getFormattedNumber(count)}) &nbsp;
            </span>`;
    },
    [HUD_DISPLAY_MODES.TIMER]: ({ name, image, timer, showName }) => {
      const currentTime = Date.now();
      const textColour = currentTime > timer ? "orange" : getDefaultTextColor();
      const remainingTime = currentTime > timer ? "Finished!" : formatRemainingTime(timer, currentTime);
      const timerText = showName ? `${name} (${remainingTime})` : remainingTime;
      return `
            <span style="color: ${textColour};">
                <img src="${image}" class="itemimgmini" style="width:15px; vertical-align:middle; padding-right:1px">
                ${timerText} &nbsp;
            </span>`;
    }
  };
  const getHudItemHtml = (item) => {
    const callback = hudHtmlCallbacks[item.displayMode] ?? hudHtmlCallbacks[HUD_DISPLAY_MODES.INVENTORY];
    const itemContent = callback(item);
    return `<td style="padding: 0px">
                <a class="frpg-hud-item" href="item.php?id=${item.id}"
                data-id="${item.id}" data-count="${item.count}" data-remove="${item.removeOnQuickSell ?? false}">
                    ${itemContent}
                    <span class="fill-animation" 
                    style="position: absolute; left: 0; top: -3px; width: 0; height: 125%; background-color: rgba(255, 0, 0, 0.5); 
                    z-index: 1; border-radius: 3px;"></span>
                </a>
            </td>`;
  };
  const getHudTable = (items, perRowItems) => {
    let hudHtml = '<table style="width: 100%;">';
    for (let start = 0; start < items.length; start += perRowItems) {
      hudHtml += "<tr>";
      items.slice(start, start + perRowItems).forEach((item) => {
        hudHtml += getHudItemHtml(item);
      });
      hudHtml += "</tr>";
    }
    hudHtml += "</table>";
    return hudHtml;
  };
  unsafeWindow.refreshInventory = refreshInventory;
  unsafeWindow.restoreHudItems = restoreHudItems;
  const getHudHtml = () => {
    const hudHasItems = hudItems.length > 0;
    const filteredTimers = Object.fromEntries(
      Object.entries(hudTimers).filter(([, timer]) => Date.now() - timer <= 15 * 1e3)
    );
    const timersCount = Object.keys(filteredTimers).length;
    const displayTimers = timersCount > 0 && settings.mealTimersEnabled;
    const perRowItems = hudItems.length > 12 ? 3 : 2;
    const timerRows = Math.ceil(timersCount / perRowItems);
    const itemRows = Math.ceil(hudItems.length / perRowItems);
    const totalRows = timerRows * displayTimers + itemRows + (hudHasItems && displayTimers);
    const hudTranslateY = 50 + 4 * (totalRows - 1);
    let hudHtml = `<div id="frpg-hud" style="
            margin: 0;
            position: absolute;
            background: ${darkModeActive ? "#111111" : "#ffffff"};
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            border: 1px solid ${darkModeActive ? "#555555" : "#dddddd"};
            padding: 5px;
            transform: translateY(-${hudTranslateY}%) translateX(-8px);
            line-height: 18px;
            z-index: 99999;
        ">
            ${statsData.join("")}
        <hr>`;
    const hudSegments = [];
    if (displayTimers) {
      const showName = timersCount === 1;
      const timerItems = Object.entries(filteredTimers).map(([id, timer]) => {
        return {
          ...inventoryCache[id],
          timer,
          showName,
          displayMode: HUD_DISPLAY_MODES.TIMER
        };
      });
      hudSegments.push(getHudTable(timerItems, perRowItems));
    }
    if (hudHasItems) {
      const detailedItems = hudItems.map((item) => {
        return { ...item, ...inventoryCache[item.id] };
      });
      hudSegments.push(getHudTable(detailedItems, perRowItems));
    }
    if (!displayTimers && !hudHasItems) {
      hudSegments.push("<span>HUD empty!</span>");
    }
    hudHtml += hudSegments.join("<hr />");
    const continueButton = `<a class="button" style="margin-left: 2%; height: 22px; line-height: 20px; white-space: nowrap;" href="${hudUrl}">C</a>`;
    const restoreButton = `<a class="button" style="margin-left: 2%; height: 22px; line-height: 20px; white-space: nowrap;" onclick="restoreHudItems()">R</a>`;
    hudHtml += `<div style="display: flex; margin-top: 5px; margin-bottom: 15px;">
                    <a class="button" style="height: 22px; line-height: 20px; width: 42%;" onclick="refreshInventory()">Refresh</a>
                    <a href="explore.php" class="button" style="margin-left: 2%; height: 22px; line-height: 20px; width: 42%;">Explore</a>
                    ${hudStash === null ? continueButton : restoreButton}
                </div>`;
    hudHtml += `</div>`;
    return hudHtml;
  };
  const _updateHudDisplay = (forceUpdate = false) => {
    if (document.hidden && !forceUpdate) return;
    const parentElement = document.querySelector("#statszone");
    if (!parentElement) return;
    if (!hudStatus) {
      if (forceUpdate) parentElement.innerHTML = statsHtml;
      return;
    }
    const hudElement = getHudHtml();
    parentElement.innerHTML = hudElement;
  };
  const updateHudDisplay = debounceHudUpdate(_updateHudDisplay, 100);
  const hudRemovalTimeouts = {};
  const cancelHudRemoval = (itemId) => {
    clearTimeout(hudRemovalTimeouts[itemId]);
  };
  const getCleanupCallback = (target) => {
    return (removeItem = true) => {
      const targetStyle = target.firstElementChild.style;
      targetStyle.color = getDefaultTextColor();
      if (removeItem && target.dataset.remove === "true") {
        const itemId = target.dataset.id;
        hudRemovalTimeouts[itemId] = setTimeout(() => {
          removeHudItem([itemId]);
        }, 2500);
      }
      return true;
    };
  };
  const getApplicableInventory = (recipeDetails, triggerItem) => {
    var _a2;
    const applicableInventory = {};
    const bypassReserve = quickActions[triggerItem].bypassReserve ?? false;
    const globalReserve = getGlobalReserveAmount();
    for (const materialName of Object.keys(recipeDetails)) {
      const materialId = itemNameIdMap.get(materialName);
      const itemCount = inventoryCache[materialId].count;
      applicableInventory[materialId] = { count: itemCount };
      if (["Iron", "Nails"].includes(materialName)) continue;
      if (materialName === triggerItem || !bypassReserve) {
        applicableInventory[materialId].count = Math.max(0, itemCount - (((_a2 = quickActions[materialName]) == null ? void 0 : _a2.reserve) ?? globalReserve));
      }
    }
    return applicableInventory;
  };
  const handleItemCraft$1 = (itemName, action, cleanup) => {
    const targetItemName = action.item;
    if (targetItemName === "Select") {
      myApp.addNotification({ title: "No item selected to craft!", subtitle: "Please go to item details and select the item to craft into" });
      return cleanup(false);
    }
    const targetItemId = itemNameIdMap.get(targetItemName);
    const targetItem = inventoryCache[targetItemId];
    const recipe = recipes[targetItemName];
    if (!recipe) {
      myApp.addNotification({ title: "Recipe not found!", subtitle: "Please go to the workshop to refresh recipes or select another item to craft" });
      return cleanup(false);
    }
    const inventoryLeft = inventoryLimit - targetItem.count;
    if (inventoryLeft === 0) {
      addHudItems([{ ...targetItem, removeOnQuickSell: true }]);
      return cleanup(false) && refreshInventory();
    }
    cancelHudRemoval(itemNameIdMap.get(targetItemName));
    const applicableInventory = getApplicableInventory(recipe, itemName);
    const maxCraftable = getMaxCraftable(recipe, applicableInventory);
    const craftCount = Math.min(maxCraftable, inventoryLeft);
    if (craftCount === 0) {
      return cleanup(false) && refreshInventory();
    }
    $.ajax({
      url: `worker.php?go=craftitem&id=${targetItemId}&qty=${craftCount}`,
      method: "POST"
    }).done(
      function(data) {
        if (data === "success") {
          addHudItems([{ ...targetItem, removeOnQuickSell: true }]);
        } else if (data === "cannotafford") {
          myApp.addNotification({ title: "Cannot afford error", subtitle: "Inventory most likely out of sync" });
        } else {
          myApp.addNotification({ title: "Something went wrong...", subtitle: `Unexpected server response: ${data}` });
        }
        return cleanup();
      }
    );
  };
  const useMeal = (mealId, mealName) => {
    $.ajax({
      url: `worker.php?go=useitem&id=${mealId}`,
      method: "POST"
    }).done(function(data) {
      switch (data) {
        case "success":
          myApp.addNotification({ title: "Delicious", subtitle: `${mealName} successfully used` });
          break;
        case "limit":
          myApp.addNotification({ title: "Meal limit reached!", subtitle: "Cancel some meals or buy more slots" });
          break;
        case "error":
          myApp.addNotification({ title: "Cannot use meals right now!", subtitle: "Try again later when reset is over" });
          break;
        default:
          myApp.addNotification({ title: "Something went wrong...", subtitle: `Unexpected server response: ${data}` });
          break;
      }
    });
  };
  const confirmMealUse = (mealId, mealName) => {
    const actions = [
      {
        text: `Are you sure you want to eat ${mealName}?`,
        label: true
      },
      {
        text: "Yes",
        onClick: () => useMeal(mealId, mealName)
      },
      {
        text: "Cancel",
        color: "red",
        onClick: refreshInventory
      }
    ];
    myApp.actions(actions);
  };
  const getSellUrlParams = (itemId, itemName, count) => {
    switch (itemName) {
      case "Steak":
        return `sellsteaks&amt=${count}`;
      case "Steak Kabob":
        return `sellkabobs&amt=${count}`;
      default:
        return `sellitem&id=${itemId}&qty=${count}`;
    }
  };
  const handleItemSell = (itemId, itemName, count, cleanup) => {
    const urlParameters = getSellUrlParams(itemId, itemName, count);
    $.ajax({
      url: `worker.php?go=${urlParameters}`,
      method: "POST"
    }).done((data) => {
      if (data === "error") {
        myApp.addNotification({ title: "Error selling item!", subtitle: "Inventory most likely out of sync. Craftworks?" });
      }
      cleanup();
    });
  };
  let townsfolk = GM_getValue(STORAGE_KEYS.TOWNSFOLK, {});
  const setTownsfolk = (newTownsfolk) => townsfolk = newTownsfolk;
  const parseQuickSend = (panelRows) => {
    const quickGiveRow = panelRows.find((row) => row.innerHTML.includes("npclevels.php"));
    if (!quickGiveRow) return;
    const updatedTownsfolk = {};
    const options = quickGiveRow.querySelector(".quickgivedd").options;
    Array.from(options).slice(1).forEach((opt) => {
      const name = opt.innerText.split("(")[0].trim();
      updatedTownsfolk[name] = opt.value;
    });
    GM_setValue(STORAGE_KEYS.TOWNSFOLK, updatedTownsfolk);
  };
  const handleItemSend$1 = (itemId, count, action, cleanup) => {
    const sendTarget = action.townsfolk;
    const targetId = townsfolk[sendTarget];
    if (!targetId) {
      myApp.addNotification({
        title: "Invalid townsfolk selected",
        subtitle: "The townsfolk set for this item does not exist"
      });
      return cleanup(false);
    }
    $.ajax({
      url: `worker.php?go=givemailitem&id=${itemId}&to=${targetId}&qty=${count}&rs=1`,
      method: "POST"
    }).done((data) => {
      if (data === "cannotrec") {
        myApp.addNotification({
          title: "Error!",
          subtitle: "This NPC cannot accept this item"
        });
      }
      cleanup();
    });
  };
  const handleItemUse = (itemName, count, cleanup) => {
    if (!staminaItems.includes(itemName)) {
      myApp.addNotification({ title: "This shouldn't be possible...", subtitle: "Cannot use this item" });
      return cleanup();
    }
    const method = itemName === "Apple" ? "eatxapples" : "drinkxojs";
    $.ajax({
      url: `worker.php?go=${method}&amt=${count}`,
      method: "POST"
    }).done(function() {
      return cleanup();
    });
  };
  let quickActions = GM_getValue(STORAGE_KEYS.QUICK_ACTIONS, {});
  const setQuickActions = (actions) => quickActions = actions;
  const updateQuickAction = (itemName, actionDetails) => {
    quickActions[itemName] = actionDetails;
    GM_setValue(STORAGE_KEYS.QUICK_ACTIONS, quickActions);
  };
  const confirmSell = (itemName, count, target, cleanup) => {
    const confirmationTitle = `Sell ${getFormattedNumber(count)}x ${itemName}?`;
    const confirmationSubtitle = `Global reserve value of ${getFormattedNumber(getGlobalReserveAmount())} applied`;
    const callbackAccept = () => {
      updateQuickAction(itemName, { action: "sell" });
      handleQuickAction(target);
    };
    myApp.confirm(confirmationSubtitle, confirmationTitle, callbackAccept, refreshInventory);
    return cleanup(false);
  };
  const handleQuickAction = (target) => {
    const itemId = target.dataset.id;
    const itemCount = target.dataset.count;
    const itemName = inventoryCache[itemId].name;
    const isMeal = mealNames.has(itemName);
    if (isMeal) return confirmMealUse(itemId, itemName);
    const itemAction = quickActions[itemName];
    const applicableCount = itemCount - ((itemAction == null ? void 0 : itemAction.reserve) ?? getGlobalReserveAmount());
    const targetStyle = target.firstElementChild.style;
    const cleanup = getCleanupCallback(target);
    if (applicableCount <= 0 || (itemAction == null ? void 0 : itemAction.action) === "none") return cleanup(false) && refreshInventory();
    if (itemAction == null ? void 0 : itemAction.action) {
      const action = itemAction.action;
      targetStyle.color = {
        "send": "cyan",
        "craft": "skyblue",
        "sell": "green",
        "use": "orange"
      }[action] ?? getDefaultTextColor();
      if (action === "send") {
        return handleItemSend$1(itemId, applicableCount, itemAction, cleanup);
      } else if (action === "craft") {
        return handleItemCraft$1(itemName, itemAction, cleanup);
      } else if (action === "use") {
        return handleItemUse(itemName, applicableCount, cleanup);
      } else if (action === "sell") {
        return handleItemSell(itemId, itemName, applicableCount, cleanup);
      }
      return;
    }
    if (unsellableItems.includes(itemName)) {
      myApp.addNotification({ title: "Cannot sell this item", subtitle: "Please sell it manually" });
    }
    return confirmSell(itemName, applicableCount, target, cleanup);
  };
  let _settings = GM_getValue(STORAGE_KEYS.SETTINGS, {});
  const settings = new Proxy(_settings, {
    get(target, key) {
      if (key in target) return target[key];
      if (typeof key === "string" && key in defaultSettings) {
        return defaultSettings[key].default;
      }
      return void 0;
    }
  });
  const setSettings = (value) => _settings = value;
  const toggleSetting = (key) => {
    settings[key] = !(settings[key] ?? defaultSettings[key].default);
    GM_setValue(STORAGE_KEYS.SETTINGS, settings);
    if (key === "mealTimersEnabled") {
      handleHudTimerUpdate(hudTimers);
    }
  };
  const exportQuickActions = () => {
    const quickActionsString = JSON.stringify(quickActions);
    GM_setClipboard(quickActionsString, "text");
    myApp.addNotification({ title: "Successfully exported QuickActions!", subtitle: `Exported ${Object.keys(quickActions).length} entries` });
  };
  const importQuickActions = () => {
    const input = prompt("Paste the QuickAction export:");
    try {
      const parsedActions = JSON.parse(input);
      if (typeof parsedActions !== "object" || Array.isArray(parsedActions) || parsedActions === null) {
        throw new Error("Invalid paste");
      }
      GM_setValue(STORAGE_KEYS.QUICK_ACTIONS, { ...quickActions, ...parsedActions });
      myApp.addNotification({ title: "Succesfully imported QuickActions!", subtitle: `Imported ${Object.keys(quickActions).length} entries` });
    } catch (error) {
      myApp.addNotification({ title: "Error importing QuickActions!", subtitle: `Please paste the full string from the export | ${error}` });
    }
  };
  const showSettings = () => {
    const settingActions = [
      ...Object.keys(defaultSettings).map((key) => {
        return {
          text: `${defaultSettings[key].label}: ${settings[key] ?? defaultSettings[key].default ? "Yes" : "No"}`,
          onClick: () => {
            toggleSetting(key);
            showSettings();
          }
        };
      }),
      {
        text: "Export QuickActions",
        onClick: exportQuickActions
      },
      {
        text: "Import QuickActions",
        onClick: importQuickActions
      },
      {
        text: "Exit",
        color: "red"
      }
    ];
    myApp.actions(settingActions);
  };
  let inventoryCache = GM_getValue(STORAGE_KEYS.INVENTORY, {});
  const setInventory = (inventory) => inventoryCache = inventory;
  let inventoryLimit = GM_getValue(STORAGE_KEYS.INVENTORY_LIMIT, 1e3);
  const setInventoryLimit = (limit) => inventoryLimit = limit;
  const getGlobalReserveAmount = () => {
    return Math.floor(inventoryLimit / 5);
  };
  const itemNameIdMap = /* @__PURE__ */ new Map();
  const populateItemNameIdMap = () => {
    for (const [itemId, item] of Object.entries(inventoryCache)) {
      itemNameIdMap.set(item.name, itemId);
    }
  };
  populateItemNameIdMap();
  const resolveItemNames = (updateBatch) => {
    const resolvedBatch = {};
    for (const itemName of Object.keys(updateBatch)) {
      const itemId = itemNameIdMap.get(itemName);
      if (!itemId) continue;
      resolvedBatch[itemId] = updateBatch[itemName];
    }
    return resolvedBatch;
  };
  const applyUpdateBatch = (inventory, updateBatch, { isAbsolute = false, isDetailed = false }) => {
    let newItem = false;
    for (const itemId of Object.keys(updateBatch)) {
      if (isDetailed) {
        if (!inventory[itemId]) newItem = true;
        inventory[itemId] = { ...inventory[itemId], ...updateBatch[itemId] };
      } else if (isAbsolute) {
        inventory[itemId].count = updateBatch[itemId];
      } else {
        inventory[itemId].count = Math.max(0, Math.min(
          inventoryLimit,
          (inventory[itemId].count ?? 0) + updateBatch[itemId]
        ));
      }
    }
    return newItem;
  };
  generateDependencies();
  const simulateCraftworks = (inventory) => {
    for (const { item: recipeId, enabled } of craftworks) {
      if (!enabled) continue;
      const itemDetails = inventory[recipeId];
      if (!itemDetails) continue;
      const recipe = recipes[itemDetails.name];
      if (!recipe) continue;
      const remainingSlots = inventoryLimit - itemDetails.count;
      if (remainingSlots === 0) continue;
      const maxCraftable = getMaxCraftable(recipe, inventory);
      if (maxCraftable === 0) continue;
      const { amountCrafted, materialsUsed } = getCraftResult(remainingSlots, maxCraftable, returnRate);
      const materialsDelta = getMaterialsDelta(recipe, materialsUsed);
      const resolvedDelta = resolveItemNames({ ...materialsDelta, [itemDetails.name]: amountCrafted });
      applyUpdateBatch(inventory, resolvedDelta, { isAbsolute: false, isDetailed: false });
    }
  };
  const updateInventory = (updateBatch, { isAbsolute = false, isDetailed = false, resolveNames = false, overwriteMissing = false, processCraftworks = false }) => {
    const inventory = inventoryCache;
    if (resolveNames) {
      updateBatch = resolveItemNames(updateBatch);
    }
    const newItem = applyUpdateBatch(inventory, updateBatch, { isAbsolute, isDetailed });
    if (overwriteMissing) {
      for (const itemId of Object.keys(inventory)) {
        if (!updateBatch[itemId]) {
          inventory[itemId].count = 0;
        }
      }
    }
    if (processCraftworks && settings.processCraftworks) {
      const dependencyUpdated = Object.keys(updateBatch).some((itemId) => craftworksDependencies.has(itemId));
      if (dependencyUpdated) simulateCraftworks(inventory);
    }
    GM_setValue(STORAGE_KEYS.INVENTORY, inventory);
    if (newItem) {
      GM_setValue(STORAGE_KEYS.NEW_ITEM, Date.now());
    }
  };
  const parseInventory = (response) => {
    const parsedInventory = parseHtml(response);
    const items = parsedInventory.querySelectorAll(".list-group > ul a.item-link");
    const currentLimit = Number(parsedInventory.querySelector(".card-content-inner > strong").innerText.replaceAll(",", ""));
    const updatedInventory = {};
    for (const item of items) {
      const itemId = item.href.split("?id=")[1];
      const name = item.querySelector(".item-title > strong").innerText;
      const image = item.querySelector(".item-media > img").src;
      const count = parseNumberWithCommas(item.getElementsByClassName("item-after")[0].innerText);
      updatedInventory[itemId] = {
        id: itemId,
        name,
        image,
        count
      };
    }
    updateInventory(updatedInventory, { isDetailed: true, overwriteMissing: true });
    GM_setValue(STORAGE_KEYS.INVENTORY_LIMIT, currentLimit);
    GM_setValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, Date.now());
    return response;
  };
  const inventoryListener = {
    name: "Inventory",
    callback: parseInventory,
    urlMatch: [/^inventory\.php/],
    passive: true
  };
  const handleItemCraft = (response, parameters) => {
    if (response !== "success") return;
    const itemId = parameters.get("id");
    const craftCount = Number(parameters.get("qty"));
    if (Number.isNaN(craftCount) || craftCount <= 0) return;
    const itemDetails = inventoryCache[itemId];
    if (!itemDetails) return;
    const itemName = itemDetails.name;
    const recipe = recipes[itemName];
    if (!recipe) return;
    const inventoryLeft = inventoryLimit - itemDetails.count;
    const { amountCrafted, materialsUsed } = getCraftResult(inventoryLeft, craftCount, returnRate);
    const materialsDelta = getMaterialsDelta(recipe, materialsUsed);
    updateInventory({ ...materialsDelta, [itemName]: amountCrafted }, { isAbsolute: false, resolveNames: true, processCraftworks: true });
  };
  const handleCraftworksReorder = (response, parameters) => {
    var _a2;
    if (response !== "success") return;
    const newOrder = parameters.get("ords");
    if (!newOrder) return;
    const updatedCraftworks = [];
    for (const item of newOrder.split("|")) {
      if (!item) break;
      const [itemId, itemIndex] = item.split(",");
      updatedCraftworks[Number(itemIndex) - 1] = {
        item: itemId,
        enabled: ((_a2 = craftworks.find((entry) => entry.item === itemId)) == null ? void 0 : _a2.enabled) ?? false
      };
    }
    GM_setValue(STORAGE_KEYS.CRAFTWORKS, updatedCraftworks);
  };
  const craftingWorkers = [
    {
      action: "craftitem",
      listener: handleItemCraft
    },
    {
      action: "setcwitemorder",
      listener: handleCraftworksReorder
    }
  ];
  const extractNumber = (element) => parseNumberWithCommas(element.innerText.trim());
  const handleExploration = (response, parameters) => {
    if (response.startsWith("You need at least")) return;
    const parsedResponse = parseHtml(response);
    const foundItems = parsedResponse.querySelectorAll(`img[src^="/img/items/"]`);
    const updateBatch = {};
    const ciderUsed = parameters.get("cider");
    const lemonadeUsed = parameters.get("go") === "drinklm";
    for (const itemImage of foundItems) {
      const itemName = itemImage.alt.trim();
      let itemCount = updateBatch[itemName] ?? 0;
      if (itemImage.style.filter.includes("grayscale")) {
        itemCount = inventoryLimit;
      } else if (itemImage.nextSibling && (ciderUsed || lemonadeUsed)) {
        itemCount += parseNumberWithCommas(itemImage.nextSibling.textContent.trim().split("x")[1].slice(0, -1));
      } else {
        itemCount += 1;
      }
      updateBatch[itemName] = itemCount;
    }
    const updateItemDifference = (itemName, selector) => {
      const count = extractNumber(parsedResponse.querySelector(selector));
      const difference = count - inventoryCache[itemNameIdMap.get(itemName)].count;
      updateBatch[itemName] = difference;
    };
    if (ciderUsed || lemonadeUsed) {
      const itemUsed = ciderUsed ? "Apple Cider" : parsedResponse.querySelector("#lmtyp").innerText.trim();
      const countSelector = ciderUsed ? "#cidercnt" : "#lmcnt";
      updateItemDifference(itemUsed, countSelector);
    }
    updateItemDifference("Apple", "#applecnt");
    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true, processCraftworks: true });
  };
  const explorationWorkers = [
    {
      action: "drinklm",
      listener: handleExploration
    },
    {
      action: "explore",
      listener: handleExploration
    }
  ];
  const handleFarmHarvest = (response) => {
    const parsedResponse = JSON.parse(response);
    const updatedInventory = {};
    for (const cropId of Object.keys(parsedResponse.drops)) {
      updatedInventory[cropId] = parsedResponse.drops[cropId].qty;
    }
    updateInventory(updatedInventory, { isAbsolute: false });
    try {
      unsafeWindow.updateCropCount({ target: document.querySelector(".seedid") });
    } catch (error) {
      console.log("Error while updating crop counts", error);
    }
  };
  const farmWorkers = [
    {
      action: "harvestall",
      listener: handleFarmHarvest
    }
  ];
  const handleManualFish = (response) => {
    const parsedResponse = parseHtml(response);
    const fishName = parsedResponse.querySelector("img").alt;
    parsedResponse.lastElementChild.remove();
    let caughtCount;
    if (parsedResponse.innerText.trim() === fishName) {
      caughtCount = 1;
    } else {
      caughtCount = parseNumberWithCommas(parsedResponse.innerText.split("x")[1].slice(0, -1));
      if (Number.isNaN(caughtCount)) {
        return;
      }
    }
    updateInventory({ [fishName]: caughtCount }, { isAbsolute: false, resolveNames: true });
  };
  const handleNetFish = (response) => {
    const parsedResponse = parseHtml(response);
    const updateBatch = {};
    const caughtFish = parsedResponse.querySelectorAll(`img[src^="/img/items/"]`);
    for (const fishImage of caughtFish) {
      let fishName = fishImage.alt;
      if (!fishName) {
        const fishDetails = hudItems.find((item) => item.image.includes(fishImage.src));
        if (!fishDetails) continue;
        fishName = fishDetails.name;
      }
      const quantityNode = fishImage.nextSibling;
      let caughtCount = updateBatch[fishName] ?? 0;
      if (fishImage.style.filter.includes("grayscale")) {
        caughtCount = inventoryLimit;
      } else if ((quantityNode == null ? void 0 : quantityNode.nodeType) === 3 && quantityNode.textContent.trim() !== "") {
        caughtCount += Number(quantityNode.textContent.split("x")[1].trim().slice(0, -1));
      } else {
        caughtCount += 1;
      }
      updateBatch[fishName] = caughtCount;
    }
    const itemUsed = parsedResponse.querySelector("#nettyp").innerText.trim();
    const count = parseNumberWithCommas(parsedResponse.querySelector("#netcnt").innerText.trim());
    const difference = count - inventoryCache[itemNameIdMap.get(itemUsed)].count;
    updateBatch[itemUsed] = difference;
    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true });
  };
  const fishingWorkers = [
    {
      action: "fishcaught",
      listener: handleManualFish
    },
    {
      action: "castnet",
      listener: handleNetFish
    }
  ];
  const handleFishSell = () => {
    const updatedInventory = {};
    for (const item of hudItems) {
      const itemId = item.id;
      const itemDetails = inventoryCache[itemId];
      if (itemDetails.locked === false) {
        updatedInventory[itemId] = -itemDetails.count;
      }
    }
    updateInventory(updatedInventory, { isAbsolute: false });
  };
  const handleItemSale = (response, parameters) => {
    if (response === "error") return;
    const itemId = parameters.get("id");
    const itemCount = parameters.get("qty");
    updateInventory({ [itemId]: -itemCount }, { isAbsolute: false });
  };
  const handleKabobSale = (response, parameters) => {
    if (response === "cannotafford") return;
    const amount = parameters.get("amt");
    updateInventory({ "Steak Kabob": -amount }, { isAbsolute: false, resolveNames: true });
  };
  const handleSteakSale = (response, parameters) => {
    if (response === "cannotafford") return;
    const amount = parameters.get("amt");
    updateInventory({ "Steak": -amount }, { isAbsolute: false, resolveNames: true });
  };
  const itemSellWorkers = [
    {
      action: "sellitem",
      listener: handleItemSale
    },
    {
      action: "sellalluserfish",
      listener: handleFishSell
    },
    {
      action: "sellkabobs",
      listener: handleKabobSale
    },
    {
      action: "sellsteaks",
      listener: handleSteakSale
    }
  ];
  const handleItemSend = (response, parameters) => {
    if (response !== "success") return;
    const itemId = parameters.get("id");
    const itemCount = parameters.get("qty");
    updateInventory({ [itemId]: -itemCount }, { isAbsolute: false });
  };
  const itemSendWorkers = [
    {
      action: "givemailitem",
      listener: handleItemSend
    }
  ];
  let supplyPacks = GM_getValue(STORAGE_KEYS.SUPPLY_PACKS, {});
  const setSupplyPacks = (packs) => supplyPacks = packs;
  const parseSupplyPack = (titleRows, itemName) => {
    const supplyPackTitle = titleRows.find(
      (row) => row.innerText.trim().toLowerCase() === "item contents"
    );
    if (!supplyPackTitle) return;
    const supplyPackItems = {};
    const updatedInventory = {};
    const itemListElement = supplyPackTitle.nextElementSibling.nextElementSibling;
    const itemList = itemListElement.querySelectorAll("a.item-link");
    for (const item of itemList) {
      const itemId = item.href.split("id=")[1];
      const image = item.querySelector("img.itemimg").src;
      const name = item.querySelector(".item-title > strong").innerText.trim();
      const count = Number(item.querySelector(".item-after").innerText.trim().slice(0, -1));
      if (name === "Gold") continue;
      supplyPackItems[name] = count;
      updatedInventory[itemId] = { id: itemId, name, image };
    }
    updateInventory(updatedInventory, { isDetailed: true });
    const updatedSupplyPacks = { ...supplyPacks, [itemName]: supplyPackItems };
    GM_setValue(STORAGE_KEYS.SUPPLY_PACKS, updatedSupplyPacks);
  };
  const handleMealUse = (response, parameters) => {
    if (!response === "success") return;
    const itemId = parameters.get("id");
    const itemDetails = inventoryCache[itemId];
    if (!itemDetails) return;
    const mealTimeSeconds = mealTimeExceptions[itemDetails.name] ?? 5 * 60;
    const endTime = Date.now() + mealTimeSeconds * 1e3;
    const updatedTimers = hudTimers;
    hudTimers[itemId] = endTime;
    GM_setValue(STORAGE_KEYS.HUD_TIMERS, updatedTimers);
    updateInventory({ [itemId]: -1 }, { isAbsolute: false });
  };
  const handleLocksmithOpen = (response, parameters) => {
    var _a2;
    const parsedResponse = parseHtml(response);
    const updatedInventory = {};
    const supplyPackId = parameters.get("id");
    const supplyPackName = (_a2 = inventoryCache[supplyPackId]) == null ? void 0 : _a2.name;
    const supplyPackData = supplyPacks[supplyPackName] ?? {};
    let updateSupplyPacks = false;
    for (const itemRow of parsedResponse.querySelectorAll("img")) {
      const itemDetails = itemRow.nextSibling;
      const [nameText, countText] = itemDetails.textContent.split("x");
      const itemName = nameText.trim();
      const itemCount = parseNumberWithCommas(countText);
      if (!Object.keys(supplyPackData).includes(itemName)) {
        supplyPackData[itemName] = 0;
        updateSupplyPacks = true;
      }
      updatedInventory[itemName] = itemCount;
    }
    updateInventory(updatedInventory, { isAbsolute: false, resolveNames: true, processCraftworks: true });
    if (updateSupplyPacks && supplyPackName && supplyPackName !== "Void Bag") {
      GM_setValue(STORAGE_KEYS.SUPPLY_PACKS, { ...supplyPacks, [supplyPackName]: supplyPackData });
    }
  };
  const handleOrangeJuiceUse = (response, parameters) => {
    if (!response.toLowerCase().includes("you drank")) return;
    const amount = parameters.get("amt");
    updateInventory({ "Orange Juice": -amount }, { isAbsolute: false, resolveNames: true });
  };
  const handleAppleUse = (response, parameters) => {
    if (!response.toLowerCase().includes("you ate")) return;
    const amount = parameters.get("amt");
    updateInventory({ Apple: -amount }, { isAbsolute: false, resolveNames: true });
  };
  const handleAllAppleUse = (response) => {
    if (!response.toLowerCase().includes("you ate")) return;
    updateInventory({ Apple: 0 }, { isAbsolute: true, resolveNames: true });
  };
  const handleAllOrangeJuiceUse = (response) => {
    if (!response.toLowerCase().includes("you drank")) return;
    updateInventory({ "Orange Juice": 0 }, { isAbsolute: true, resolveNames: true });
  };
  const itemUseWorkers = [
    {
      action: "useitem",
      listener: handleMealUse
    },
    {
      action: "openitem",
      listener: handleLocksmithOpen
    },
    {
      action: "drinkxojs",
      listener: handleOrangeJuiceUse
    },
    {
      action: "eatxapples",
      listener: handleAppleUse
    },
    {
      action: "eatapple",
      listener: (response) => handleAppleUse(response, { get: () => 1 })
    },
    {
      action: "drinkoj",
      listener: (response) => handleOrangeJuiceUse(response, { get: () => 1 })
    },
    {
      action: "eatapples",
      listener: handleAllAppleUse
    },
    {
      action: "drinkojs",
      listener: handleAllOrangeJuiceUse
    }
  ];
  const parseItemCount = (itemString) => {
    let [itemName, countText] = itemString.split("(x");
    itemName = itemName.trim();
    const itemCount = parseNumberWithCommas(countText.split(")")[0]);
    return [itemName, itemCount];
  };
  const handleWheelSpin = (response) => {
    const parsedResponse = parseHtml(response.split("|")[1]);
    const rewardText = parsedResponse.innerText.split(":")[1];
    let [itemName, itemCount] = parseItemCount(rewardText);
    if (itemName === "Apples") itemName = "Apple";
    updateInventory({ [itemName]: itemCount }, { isAbsolute: false, resolveNames: true });
  };
  const handleWishingWellThrow = (response, parameters) => {
    var _a2;
    if (response === "cannotafford") return;
    const thrownId = parameters.get("id");
    const thrownCount = Number(parameters.get("amt"));
    const thrownItemName = (_a2 = inventoryCache[thrownId]) == null ? void 0 : _a2.name;
    const parsedResponse = parseHtml(response);
    const updateBatch = {};
    const items = parsedResponse.querySelectorAll("img");
    for (const item of items) {
      let [itemName, itemCount] = parseItemCount(item.nextSibling.textContent);
      updateBatch[itemName] = itemCount;
    }
    if (thrownItemName) {
      updateBatch[thrownItemName] = -thrownCount;
    }
    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true });
  };
  const miscWorkers = [
    {
      action: "spinfirst",
      listener: handleWheelSpin
    },
    {
      action: "tossmanyintowell",
      listener: handleWishingWellThrow
    }
  ];
  const handleBeachball = (response) => {
    try {
      const itemMatch = response.match(/<strong>(.*?)<\\\/strong>/);
      const quantityMatch = response.match(/class='itemimg'> x(\d+)/);
      if (itemMatch && itemMatch[1]) {
        const itemName = itemMatch[1];
        const quantity = quantityMatch && quantityMatch[1] ? parseInt(quantityMatch[1]) : 1;
        updateInventory({ [itemName]: quantity }, { isAbsolute: false, resolveNames: true });
      }
    } catch (error) {
      console.error("Error processing beachball response:", error);
    }
  };
  const beachballWorkers = [
    {
      action: "beachball",
      listener: handleBeachball
    }
  ];
  const workers = [
    ...explorationWorkers,
    ...fishingWorkers,
    ...itemSellWorkers,
    ...craftingWorkers,
    ...itemUseWorkers,
    ...itemSendWorkers,
    ...miscWorkers,
    ...farmWorkers,
    ...beachballWorkers
  ];
  const activeWorkers = /* @__PURE__ */ new Map();
  const workerActions = /* @__PURE__ */ new Set();
  for (const worker of workers) {
    workerActions.add(worker.action);
    activeWorkers.set(worker.action, worker.listener);
  }
  const actionString = Array.from(workerActions).join("|");
  const urlMatch = new RegExp(`worker\\.php\\?.*go=(${actionString})`);
  const handleWorkerEvents = (response, url) => {
    const urlParameters = new URLSearchParams(url.split("?")[1]);
    const action = urlParameters.get("go");
    const worker = activeWorkers.get(action);
    worker(response, urlParameters);
    return response;
  };
  const workerListener = {
    name: "Worker Events",
    callback: handleWorkerEvents,
    urlMatch: [urlMatch],
    passive: true
  };
  const fetchLocationData = (type, id) => {
    return GM_getValue(`${STORAGE_KEYS.LOCATION_PREFIX}.${type}-${id}`, null);
  };
  const setLocationData = (type, id, data) => {
    const locationItems = [];
    for (const itemId of Object.keys(data)) {
      locationItems.push({
        id: itemId,
        name: data[itemId].name,
        image: data[itemId].image
      });
    }
    GM_setValue(`${STORAGE_KEYS.LOCATION_PREFIX}.${type}-${id}`, locationItems);
  };
  const parseArea = (response, url) => {
    const urlParameters = new URLSearchParams(url.split("?")[1]);
    const locationId = urlParameters.get("id");
    const type = url.startsWith("area.php") ? "explore" : "fishing";
    const locationData = fetchLocationData(type, locationId);
    if (locationData === null) {
      myApp.addNotification({ title: "New location detected", subtitle: "Please visit the location details to track items with HUD!" });
      return response;
    }
    setHudDetails(locationData, url);
    GM_setValue(STORAGE_KEYS.HUD_STASH, null);
    return response;
  };
  const areaListener = {
    name: "Areas",
    callback: parseArea,
    urlMatch: [/^area\.php.*/, /^fishing\.php.*/],
    passive: true
  };
  const parseCraftworks = (response) => {
    const parsedResponse = parseHtml(response);
    const itemList = parsedResponse.querySelectorAll(".close-panel[data-id]");
    const craftworksItems = [];
    const inventoryUpdate = {};
    for (const element of itemList) {
      const itemId = element.dataset.id;
      const enabled = Array.from(element.querySelectorAll("button")).some((button) => button.classList.contains("pausecwbtn"));
      craftworksItems.push({ item: itemId, enabled });
      const titleChildren = element.querySelector(".item-title").children;
      const countText = titleChildren[titleChildren.length - 1].firstChild.textContent.split(":")[1].trim();
      const itemCount = parseNumberWithCommas(countText);
      inventoryUpdate[itemId] = itemCount;
    }
    GM_setValue(STORAGE_KEYS.CRAFTWORKS, craftworksItems);
    updateInventory(inventoryUpdate, { isAbsolute: true });
    return response;
  };
  const craftworksListener = {
    name: "Craftworks",
    callback: parseCraftworks,
    urlMatch: [/^craftworks\.php/],
    passive: true
  };
  const parseHome = (response) => {
    const parsedResponse = parseHtml(response);
    const timers = parsedResponse.querySelectorAll(`[data-countdown-to]`);
    const updatedTimers = {};
    for (const element of timers) {
      const linkElement = element.closest(".item-link");
      if (!linkElement) continue;
      try {
        const itemId = new URLSearchParams(linkElement.href.split("?")[1]).get("id");
        const rawTime = element.dataset.countdownTo;
        const parsedTime = luxon.DateTime.fromISO(rawTime, { zone: "America/Chicago" });
        const time = new Date(parsedTime.toISO());
        updatedTimers[itemId] = +time;
      } catch {
        continue;
      }
    }
    GM_setValue(STORAGE_KEYS.HUD_TIMERS, { ...hudTimers, ...updatedTimers });
    return response;
  };
  const homeListener = {
    name: "Home Page",
    callback: parseHome,
    urlMatch: [/^index\.php/],
    passive: true
  };
  const explorationHud = (response) => {
    const parsedHud = parseHtml(response);
    const statsDiv = parsedHud.firstElementChild;
    const toggleHtml = `<span><a id="frpg-hud-toggle" style="padding: 3px 5px 2px 5px; border: 1px solid; border-radius: 5px;" onclick="toggleHudStatus()" href="#">HUD</span>`;
    const hrElement = statsDiv.querySelector("hr");
    if (hrElement) {
      hrElement.insertAdjacentHTML("beforeBegin", toggleHtml);
    } else {
      statsDiv.insertAdjacentHTML("beforeEnd", toggleHtml);
    }
    setStatsData(Array.from(parsedHud.firstElementChild.children).filter((element) => element.tagName === "SPAN").slice(0, 4).map((i) => i.innerHTML));
    setStatsHtml(parsedHud.innerHTML);
    if (hudStatus) {
      return getHudHtml();
    }
    return parsedHud.innerHTML;
  };
  const hudListener = {
    name: "Exploration HUD",
    callback: explorationHud,
    urlMatch: [/worker\.php\?.*go=getstats/],
    passive: false
  };
  const cloneRowAfter = (row, title, subtitle, afterValue = "", img = "/img/items/7211.png") => {
    var _a2;
    const newRow = row.cloneNode(true);
    const titleElement = newRow.querySelector(".item-title");
    const titleNode = titleElement.childNodes[0];
    titleNode.textContent = title;
    const subtitleNode = titleNode.nextSibling.nextSibling;
    subtitleNode.style.textWrap = "wrap";
    subtitleNode.textContent = subtitle;
    newRow.querySelector("img.itemimg").src = img;
    newRow.querySelector(".item-after").innerHTML = afterValue;
    (_a2 = newRow.querySelector(".progressbar")) == null ? void 0 : _a2.remove();
    row.after(newRow);
    return newRow;
  };
  const clearRowsAfter = (settingsRow) => {
    let node = settingsRow.nextElementSibling;
    while (node) {
      const element = node;
      node = node.nextElementSibling;
      element.remove();
    }
  };
  const quickActionChangeHandler = (target, ignoreUpdate = false) => {
    var _a2, _b;
    const settingsRow = target.closest("#frpg-quick-action");
    const itemName = settingsRow.dataset.name;
    clearRowsAfter(settingsRow);
    const itemAction = quickActions[itemName] ?? {};
    const selectedAction = ((_a2 = target.value) == null ? void 0 : _a2.trim()) ?? "none";
    const getListenerString = (value, itemName2) => `updateQuickActionParameter('${value}', '${itemName2}', event.target.value)`;
    const reserveValue = itemAction.reserve ?? getGlobalReserveAmount();
    const reserveInputHtml = `
        <input type="number" class="inlineinputlg" min="-1" onclick="$(this).select()" onchange="${getListenerString("reserve", itemName)}" value="${reserveValue}" />
        `;
    const reserveRow = cloneRowAfter(settingsRow, "Reserve Amount", "Amount to keep in reserve while performing quick actions", reserveInputHtml);
    if (selectedAction === "none") {
      if (ignoreUpdate) return;
      updateQuickAction(itemName, {
        ...itemAction,
        action: "none"
      });
      return;
    }
    if (selectedAction === "send") {
      let selectedTownsfolk = itemAction.townsfolk;
      if (!selectedTownsfolk) {
        const quickGiveSelector = (_b = reserveRow.closest("ul")) == null ? void 0 : _b.querySelector(".quickgivedd");
        const selectedOption = quickGiveSelector == null ? void 0 : quickGiveSelector.selectedOptions[0];
        if (!selectedOption || selectedOption.innerText.startsWith("-")) {
          selectedTownsfolk = Object.keys(townsfolk)[0];
        } else {
          selectedTownsfolk = selectedOption.innerText.split("(")[0].trim();
        }
      }
      const townsfolkOptions = Object.keys(townsfolk).map((t) => `<option value="${t}" ${selectedTownsfolk === t ? "selected" : ""}>${t}</option>`).join("");
      const townsfolkSelectHtml = `
                <select class="inlineinputlg" onchange="${getListenerString("townsfolk", itemName)}">${townsfolkOptions}</select>
            `;
      cloneRowAfter(reserveRow, "Target Townsfolk", "Who would like this gift", townsfolkSelectHtml, "/img/items/icon_mail.png?1");
      if (ignoreUpdate) return;
      if (!selectedTownsfolk) return;
      updateQuickAction(itemName, { ...itemAction, action: selectedAction, townsfolk: selectedTownsfolk });
      return;
    } else if (selectedAction === "craft") {
      const craftableItems = [];
      for (const [recipeName, recipeDetails] of Object.entries(recipes)) {
        if (Object.keys(recipeDetails).includes(itemName)) craftableItems.push(recipeName);
      }
      let selectedRecipe = itemAction.item;
      if (!selectedRecipe && craftableItems.length > 0) selectedRecipe = craftableItems[0];
      const recipeOptions = craftableItems.map((recipe) => `<option value="${recipe}" ${recipe === selectedRecipe ? "selected" : ""}>${recipe}</option>"`);
      const recipeSelectHtml = `<select class="inlineinputlg" onchange="${getListenerString("item", itemName)}">${recipeOptions}</select>`;
      const bypassReserve = itemAction.bypassReserve ?? false;
      const bypassSelectHtml = `
            <select class="inlineinputlg" onchange="${getListenerString("bypassReserve", itemName)}">
                <option value="false" ${bypassReserve ? "" : "selected"}>No</option>
                <option value="true" ${bypassReserve ? "selected" : ""}>Yes</option>
            </select>
            `;
      const itemRow = cloneRowAfter(reserveRow, "Item", "Which item to craft this into", recipeSelectHtml, "/img/items/5868.png");
      cloneRowAfter(itemRow, "Bypass Material Reserve", "Ignore reserve values of other materials", bypassSelectHtml, "/img/items/5868.png");
      if (ignoreUpdate) return;
      if (!selectedRecipe) return;
      updateQuickAction(itemName, { ...itemAction, action: selectedAction, item: selectedRecipe, bypassReserve });
      return;
    } else {
      if (ignoreUpdate) return;
      updateQuickAction(itemName, { ...itemAction, action: selectedAction });
      return;
    }
  };
  const updateQuickActionParameter = (updateValue, itemName, newValue) => {
    const itemData = quickActions[itemName] ?? {};
    if (updateValue === "reserve") {
      newValue = Number(newValue);
      if (Number.isNaN(newValue) || newValue < 0) newValue = getGlobalReserveAmount();
    } else if (updateValue === "bypassReserve") {
      newValue = newValue === "true";
    }
    itemData[updateValue] = newValue;
    quickActions[itemName] = itemData;
    GM_setValue(STORAGE_KEYS.QUICK_ACTIONS, quickActions);
  };
  const getPanelRows = (parsedResponse) => Array.from(parsedResponse.querySelectorAll(".list-block > ul > li.close-panel"));
  const getTitleRows = (parsedResponse) => Array.from(parsedResponse.querySelectorAll(".content-block-title"));
  const detectSendableItem = (panelRows) => panelRows.some((row) => row.innerHTML.includes("/img/items/icon_mail.png?")) && Object.keys(townsfolk).length !== 0;
  const detectCraftableItem = (titleRows) => titleRows.some((row) => row.innerText.trim().toLowerCase() === "crafting use");
  const detectUsableItem = (itemName) => mealNames.has(itemName);
  const detectSellableItem = (panelRows, itemName) => {
    if (unsellableItems.includes(itemName)) return false;
    const hasQuickSell = panelRows.some((row) => row.innerHTML.includes("market.php"));
    return hasQuickSell || ["Steak", "Steak Kabob"].includes(itemName);
  };
  const generateQuickActionOptions = (flags, itemQuickActions) => {
    const { itemSendable, itemCraftable, itemSellable, itemUsable } = flags;
    const actions = {
      "None": true,
      "Use": itemUsable,
      "Send": itemSendable,
      "Craft": itemCraftable,
      "Sell": itemSellable
    };
    return Object.entries(actions).map(([option, show]) => {
      if (!show) return "";
      const selected = (itemQuickActions == null ? void 0 : itemQuickActions.action) === option.toLowerCase() ? "selected" : "";
      return `<option value="${option.toLowerCase()}" ${selected}>${option}</option>`;
    }).join("");
  };
  const wrapDropdownHtml = (options) => `<select onchange="quickActionChangeHandler(event.target)" class="inlineinputlg" id="frpg-quick-action-value">
        ${options}
    </select>`;
  const appendQuickActionRow = (lastRow, itemName, itemId, dropdownHtml) => {
    const row = cloneRowAfter(lastRow, "Quick Action", "Select the action on middle click or tap and hold", dropdownHtml);
    row.setAttribute("id", "frpg-quick-action");
    row.setAttribute("data-id", itemId);
    row.setAttribute("data-name", itemName);
    return row;
  };
  const addQuickActionDropdown = (panelRows, itemName, itemId, flags) => {
    const lastRow = panelRows[panelRows.length - 1];
    const itemQuickActions = quickActions[itemName];
    const optionsHtml = generateQuickActionOptions(flags, itemQuickActions);
    const dropdownHtml = wrapDropdownHtml(optionsHtml);
    const settingRow = appendQuickActionRow(lastRow, itemName, itemId, dropdownHtml);
    const selectElement = settingRow.querySelector("#frpg-quick-action-value");
    quickActionChangeHandler(selectElement, true);
  };
  const displayItemConfig = (parsedResponse, itemName, itemId) => {
    const panelRows = getPanelRows(parsedResponse);
    const titleRows = getTitleRows(parsedResponse);
    const itemSendable = detectSendableItem(panelRows);
    const itemCraftable = detectCraftableItem(titleRows);
    const itemUsable = detectUsableItem(itemName);
    const itemSellable = detectSellableItem(panelRows, itemName);
    parseSupplyPack(titleRows, itemName);
    if (itemSendable) parseQuickSend(panelRows);
    if (itemSendable || itemSellable || itemCraftable || itemUsable) {
      addQuickActionDropdown(panelRows, itemName, itemId, {
        itemSendable,
        itemCraftable,
        itemSellable,
        itemUsable
      });
    }
  };
  unsafeWindow.updateQuickActionParameter = updateQuickActionParameter;
  unsafeWindow.quickActionChangeHandler = quickActionChangeHandler;
  const extractItemId = (url) => new URLSearchParams(url.split("?")[1]).get("id");
  const extractItemName = (parsedHtml) => {
    var _a2;
    return (_a2 = parsedHtml.querySelector(".navbar-inner > .center.sliding")) == null ? void 0 : _a2.innerText.trim();
  };
  const extractItemCount = (parsedHtml) => {
    var _a2;
    const inventoryLink = parsedHtml.querySelector(`a[href="inventory.php"]`);
    const inventoryRow = inventoryLink == null ? void 0 : inventoryLink.closest(".item-content");
    const countText = ((_a2 = inventoryRow == null ? void 0 : inventoryRow.querySelector(".item-after")) == null ? void 0 : _a2.innerText.trim()) || "0";
    return parseNumberWithCommas(countText);
  };
  const extractItemImage = (parsedHtml) => {
    var _a2;
    return ((_a2 = parsedHtml.querySelector(".itemimglg")) == null ? void 0 : _a2.src) || null;
  };
  const parseItem = (response, url) => {
    const parsedResponse = parseHtml(response);
    const itemId = extractItemId(url);
    const itemName = extractItemName(parsedResponse);
    const itemCount = extractItemCount(parsedResponse);
    const itemImage = extractItemImage(parsedResponse);
    const itemDetails = {
      id: itemId,
      name: itemName,
      count: itemCount,
      ...itemImage && { image: itemImage }
    };
    updateInventory({ [itemId]: itemDetails }, { isDetailed: true });
    displayItemConfig(parsedResponse, itemName, itemId);
    return parsedResponse.innerHTML;
  };
  const itemListener = {
    name: "Items",
    callback: parseItem,
    urlMatch: [/^item\.php\?id=\d+/],
    passive: false
  };
  const parseLocationDetails = (response, url) => {
    const urlParameters = new URLSearchParams(url.split("?")[1]);
    const type = urlParameters.get("type");
    const locationId = urlParameters.get("id");
    const parsedLocation = parseHtml(response);
    const items = parsedLocation.querySelectorAll(".card-content-inner > .row > .col-25");
    const updatedInventory = {};
    for (const item of items) {
      if (item.querySelector(`a[href^="item.php"]`) === null) continue;
      const itemId = item.firstElementChild.href.split("=")[1];
      let node = item.firstElementChild;
      while (node.nodeType !== Node.TEXT_NODE) {
        node = node.nextSibling;
      }
      const name = node.textContent.trim();
      const image = item.firstElementChild.firstElementChild.src;
      const count = parseNumberWithCommas(item.children[item.children.length - 1].textContent.trim().split(" ")[0]);
      const itemData = {
        id: itemId,
        name,
        image,
        count
      };
      const lockElement = item.querySelector("span > .f7-icons");
      if (lockElement) {
        itemData.locked = lockElement.parentElement.title === "Item locked";
      }
      updatedInventory[itemId] = itemData;
    }
    updateInventory(updatedInventory, { isDetailed: true });
    setLocationData(type, locationId, updatedInventory);
    return response;
  };
  const locationListener = {
    name: "Location",
    callback: parseLocationDetails,
    urlMatch: [/^location\.php.*/],
    passive: true
  };
  const trackSupplyPack = (target) => {
    const itemContainer = target.closest(".item-content");
    const supplyPackName = itemContainer.querySelector(".item-title > strong").childNodes[0].textContent.trim();
    const supplyPackDetails = supplyPacks[supplyPackName];
    if (!supplyPackDetails) return;
    setHudItemsByName(Object.keys(supplyPackDetails));
  };
  unsafeWindow.trackSupplyPack = trackSupplyPack;
  const parseLocksmith = (response) => {
    const parsedResponse = parseHtml(response);
    const itemList = parsedResponse.querySelectorAll(".close-panel");
    for (const item of itemList) {
      item.setAttribute("onclick", "trackSupplyPack(event.target)");
    }
    return parsedResponse.innerHTML;
  };
  const locksmithListener = {
    name: "Locksmith",
    callback: parseLocksmith,
    urlMatch: [/^locksmith\.php/],
    passive: false
  };
  const parseTownsfolk = (response) => {
    const parsedResponse = parseHtml(response);
    const mailboxLinks = parsedResponse.querySelectorAll('a[href^="mailbox.php?id"]');
    const updatedTownsfolk = {};
    for (const link of mailboxLinks) {
      const townsfolkName = link.nextElementSibling.nextElementSibling.innerText.trim();
      const townsfolkId = new URLSearchParams(link.href.split("?")[1]).get("id");
      updatedTownsfolk[townsfolkName] = townsfolkId;
    }
    if (!("Captain Thomas" in updatedTownsfolk)) {
      updatedTownsfolk["Captain Thomas"] = updatedTownsfolk["Cpt Thomas"];
      delete updatedTownsfolk["Cpt Thomas"];
    }
    GM_setValue(STORAGE_KEYS.TOWNSFOLK, updatedTownsfolk);
    return response;
  };
  const townsfolkListener = {
    name: "Townsfolk",
    callback: parseTownsfolk,
    urlMatch: [/^npclevels\.php/],
    passive: true
  };
  const wheelSpin = (response) => {
    setHudItemsByName(wheelItems);
    const parsedResponse = parseHtml(response);
    const spinElement = parsedResponse.querySelector(`.card-content-inner > a[href="wheelhistory.php"]`).parentElement;
    const spinCount = Number(spinElement.children[3].innerText);
    const spinCost = 5 / 2 * spinCount * Math.max(0, spinCount - 1);
    spinElement.innerHTML = spinElement.innerHTML.replace("</strong> time(s)", `</strong> time(s) for a total of <strong>${getFormattedNumber(spinCost)}</strong> coins`);
    return parsedResponse.innerHTML;
  };
  const spinListener = {
    name: "Wheel Spin",
    callback: wheelSpin,
    urlMatch: [/^spin\.php/]
  };
  const parseWorkshop = (response) => {
    const parsedWorkshop = parseHtml(response);
    const recipeItems = {};
    const materialItems = {};
    const recipes2 = {};
    const recipeList = parsedWorkshop.querySelectorAll("ul > li.close-panel");
    for (const recipe of recipeList) {
      const recipeId = recipe.dataset.id;
      const recipeName = recipe.dataset.name;
      if (recipeId === void 0) continue;
      recipeItems[recipeId] = {
        id: recipeId,
        name: recipeName,
        image: recipe.querySelector(".itemimg").src,
        count: Number(recipe.querySelector(".item-title > strong > span").textContent.replace(/(,|\(|\))/g, ""))
      };
      let materialName;
      let materialCount;
      let materialRequired;
      const recipeMaterials = {};
      const materialDetails = recipe.querySelector(".item-title > span");
      let node = materialDetails.firstChild;
      while (node !== null) {
        if (node.nodeName === "BR") {
          node = node.nextSibling;
          continue;
        }
        if (node.nodeName === "SPAN" && node.style.color === "red") {
          const parts = node.textContent.split(" ");
          materialCount = parseNumberWithCommas(parts[0]);
          materialRequired = parseNumberWithCommas(parts[2]);
          materialName = parts.slice(3).join(" ");
        } else {
          const amountNode = node.nextSibling;
          const nameNode = amountNode.nextSibling;
          materialCount = Number(node.textContent.replace(/(,|\/)/g, "").trim());
          materialRequired = Number(amountNode.dataset.amt);
          materialName = nameNode.textContent.trim();
          node = nameNode;
        }
        materialItems[materialName] = materialCount;
        recipeMaterials[materialName] = materialRequired;
        node = node.nextSibling;
      }
      recipes2[recipeName] = recipeMaterials;
    }
    for (const card of parsedWorkshop.querySelectorAll(".card-content-inner")) {
      const cardText = card.innerText.trim();
      const regex = /resource saver perk is (\d{1,2})%/;
      const result = regex.exec(cardText);
      if (result) {
        const newRateText = result[1];
        const newRate = 1 + Number(newRateText) / 100;
        GM_setValue(STORAGE_KEYS.RETURN_RATE, newRate);
        break;
      }
    }
    updateInventory(recipeItems, { isAbsolute: true, isDetailed: true });
    updateInventory(materialItems, { isAbsolute: true, resolveNames: true });
    GM_setValue(STORAGE_KEYS.RECIPES, recipes2);
    GM_setValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, Date.now());
    return response;
  };
  const workshopListener = {
    name: "Workshop",
    callback: parseWorkshop,
    urlMatch: [/^workshop\.php$/],
    passive: true
  };
  let production = GM_getValue(STORAGE_KEYS.PRODUCTION, {});
  const setProduction = (value) => production = value;
  let productionTimeout = null;
  const acquireLock = () => {
    const currentTime = Date.now();
    const lockTimeout = 10 * 1e3;
    const lockTime = GM_getValue(STORAGE_KEYS.PRODUCTION_LOCK, 0);
    if (lockTime > currentTime - lockTimeout) return false;
    GM_setValue(STORAGE_KEYS.PRODUCTION_LOCK, currentTime);
    const newLockTime = GM_getValue(STORAGE_KEYS.PRODUCTION_LOCK);
    return newLockTime === currentTime;
  };
  const releaseLock = () => {
    GM_setValue(STORAGE_KEYS.PRODUCTION_LOCK, 0);
  };
  const tenMinuteProduction = (productionTime) => {
    const updateBatch = Object.fromEntries(tenMinuteProductionItems.map((itemName) => [itemName, production[itemName] ?? 0]));
    const hickoryActive = hudTimers[itemNameIdMap.get("Hickory Omelette")] > productionTime;
    if (hickoryActive) {
      updateBatch["Wood"] = Math.floor(production["Wood"] / 5);
      updateBatch["Board"] = Math.floor(production["Board"] / 5);
    }
    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true, processCraftworks: true });
  };
  const hourlyProduction = () => {
    const updateBatch = Object.fromEntries(hourlyProductionItems.map((itemName) => [itemName, production[itemName] ?? 0]));
    updateInventory(updateBatch, { isAbsolute: false, resolveNames: true, processCraftworks: true });
  };
  const getNextUpdate = (lastUpdate) => {
    const nextUpdate = new Date(lastUpdate);
    const isTenMinuteMark = nextUpdate.getUTCMinutes() % 10 === 0;
    const productionNotYetRan = nextUpdate.getSeconds() < 15;
    nextUpdate.setSeconds(15);
    nextUpdate.setMilliseconds(0);
    const shouldRunThisMinute = isTenMinuteMark && productionNotYetRan;
    if (!shouldRunThisMinute) {
      nextUpdate.setUTCMinutes(Math.ceil((nextUpdate.getUTCMinutes() + 1) / 10) * 10);
    }
    return nextUpdate;
  };
  const handleProduction = () => {
    if (!acquireLock()) return scheduleProduction();
    const lastUpdate = GM_getValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, Date.now());
    const nextUpdate = getNextUpdate(lastUpdate);
    const currentTime = /* @__PURE__ */ new Date();
    let finishedUpdate = null;
    while (nextUpdate < currentTime) {
      const updateMinute = nextUpdate.getUTCMinutes();
      if (updateMinute % 10 === 0) {
        tenMinuteProduction(nextUpdate);
      }
      if (updateMinute === 0) {
        hourlyProduction();
      }
      finishedUpdate = +nextUpdate;
      nextUpdate.setUTCMinutes(Math.ceil((updateMinute + 1) / 10) * 10);
    }
    if (finishedUpdate) GM_setValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, finishedUpdate);
    scheduleProduction();
    releaseLock();
  };
  const scheduleProduction = () => {
    const lastUpdate = GM_getValue(STORAGE_KEYS.PRODUCTION_LAST_UPDATE, Date.now());
    const nextUpdate = getNextUpdate(lastUpdate);
    const currentTime = Date.now();
    const delay = Math.max(nextUpdate - currentTime, 0);
    clearTimeout(productionTimeout);
    productionTimeout = setTimeout(handleProduction, delay);
  };
  const parseProductionSection = (possibleSections, items) => {
    const parsedProductions = {};
    for (const itemName of items) {
      const itemDetails = inventoryCache[itemNameIdMap.get(itemName)];
      if (!itemDetails) continue;
      const sections = Array.from(possibleSections);
      const targetSection = sections.find((section) => {
        var _a2;
        return ((_a2 = section.querySelector("img.itemimg")) == null ? void 0 : _a2.src) === itemDetails.image;
      });
      if (!targetSection) continue;
      const addButton = targetSection.querySelector(".item-after > button.button");
      if (!addButton) continue;
      parsedProductions[itemName] = Number(addButton.dataset.current);
    }
    return parsedProductions;
  };
  const parseProductionChildren = (children) => {
    const output = {};
    for (const child of children) {
      if (child.nodeType !== 3) continue;
      const productionText = child.textContent.trim();
      const spaceIndex = productionText.indexOf(" ");
      if (spaceIndex === -1) continue;
      const itemName = productionText.slice(spaceIndex + 1).trim();
      const countString = productionText.slice(0, spaceIndex);
      const itemCount = parseNumberWithCommas(countString);
      if (Number.isNaN(itemCount)) {
        continue;
      }
      output[itemName] = itemCount;
    }
    return output;
  };
  const parseProductionRows = (parsedResponse) => {
    var _a2;
    const sections = Array.from(parsedResponse.querySelectorAll(".content-block-title"));
    const targetSection = sections.find((section) => section.innerText === "Around Your Farm");
    if (!targetSection) return;
    let parsedProductionMap = {};
    const buildingLinks = (_a2 = targetSection.nextElementSibling) == null ? void 0 : _a2.querySelectorAll(".item-link");
    for (const buildingLink of buildingLinks) {
      const detailsElement = buildingLink.querySelector(".item-after > span");
      if (!detailsElement) continue;
      const buildingProduction = parseProductionChildren(detailsElement.childNodes);
      parsedProductionMap = { ...parsedProductionMap, ...buildingProduction };
    }
    const updatedProduction = { ...production };
    for (const [itemName, key] of Object.entries(farmProductionKeys)) {
      updatedProduction[itemName] = parsedProductionMap[key] ?? 0;
    }
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
  };
  const updateCropCount = (event) => {
    var _a2, _b;
    const selectElement = event.target;
    const targetElement = selectElement.parentElement.parentElement.firstElementChild;
    const seedId = selectElement.value;
    const cropName = (_a2 = selectElement.selectedOptions[0].dataset.name) == null ? void 0 : _a2.slice(0, -6);
    if (!cropName) {
      targetElement.innerText = "No crop selected";
      return;
    }
    const cropId = seedCrop[seedId] || null;
    const cropInventory = cropId === null ? "??" : ((_b = inventoryCache[cropId]) == null ? void 0 : _b.count) ?? "??";
    targetElement.innerText = `${cropInventory} ${cropName} in inventory`;
  };
  unsafeWindow.updateCropCount = updateCropCount;
  const parseFarm = (response) => {
    const parsedResponse = parseHtml(response);
    const cropSelect = parsedResponse.querySelector("select.seedid");
    cropSelect.setAttribute("onchange", "updateCropCount(event)");
    updateCropCount({ target: cropSelect });
    parseProductionRows(parsedResponse);
    return parsedResponse.innerHTML;
  };
  const xfarmListener = {
    name: "Farm",
    callback: parseFarm,
    urlMatch: [/^xfarm\.php\?id=/],
    passive: false
  };
  const parseSawmill = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));
    const parsedProductions = parseProductionSection(sections, ["Wood", "Board", "Oak"]);
    const updatedProduction = { ...production, ...parsedProductions };
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
  };
  const sawmillListener = {
    name: "Sawmill",
    callback: parseSawmill,
    urlMatch: [/^sawmill\.php/],
    passive: true
  };
  const parseQuarry = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));
    const parsedProductions = parseProductionSection(sections, ["Stone", "Coal"]);
    if (parsedProductions["Stone"]) {
      parsedProductions["Sandstone"] = parsedProductions["Stone"];
    }
    const updatedProduction = { ...production, ...parsedProductions };
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
  };
  const quarryListener = {
    name: "Quarry",
    callback: parseQuarry,
    urlMatch: [/^quarry\.php/],
    passive: true
  };
  const parseHayfield = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));
    const parsedProductions = parseProductionSection(sections, ["Straw"]);
    const updatedProduction = { ...production, ...parsedProductions };
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
  };
  const hayfieldListener = {
    name: "Hayfield",
    callback: parseHayfield,
    urlMatch: [/^hayfield\.php/],
    passive: true
  };
  const parseSteelworks = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));
    const parsedProductions = parseProductionSection(sections, ["Steel"]);
    if (parsedProductions["Steel"]) {
      parsedProductions["Steel Wire"] = Math.round(parsedProductions["Steel"] * 1 / 3);
    }
    const updatedProduction = { ...production, ...parsedProductions };
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
  };
  const steelworksListener = {
    name: "Steelworks",
    callback: parseSteelworks,
    urlMatch: [/^steelworks\.php/],
    passive: true
  };
  const parseTroutFarm = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));
    const parsedProductions = parseProductionSection(sections, ["Grubs", "Minnows"]);
    const updatedProduction = { ...production, ...parsedProductions };
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
  };
  const troutFarmListener = {
    name: "Trout Farm",
    callback: parseTroutFarm,
    urlMatch: [/^troutfarm\.php/],
    passive: true
  };
  const parseWormHabitat = (response) => {
    const parsedResponse = parseHtml(response);
    const sections = Array.from(parsedResponse.querySelectorAll("li > .item-content"));
    const parsedProductions = parseProductionSection(sections, ["Worms", "Gummy Worms", "Mealworms"]);
    const updatedProduction = { ...production, ...parsedProductions };
    GM_setValue(STORAGE_KEYS.PRODUCTION, updatedProduction);
    return response;
  };
  const wormHabitatListener = {
    name: "Worm Habitat",
    callback: parseWormHabitat,
    urlMatch: [/^hab\.php/],
    passive: true
  };
  const interceptXHR = (handler) => {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
      this._interceptedUrl = url;
      return originalOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function() {
      this.addEventListener("readystatechange", () => {
        if (this.readyState === 4 && this.status === 200) {
          const originalResponse = this.responseText;
          const modified = handler(originalResponse, this._interceptedUrl, "ajax");
          Object.defineProperty(this, "responseText", {
            get: () => modified
          });
        }
      }, false);
      return originalSend.apply(this, arguments);
    };
  };
  const interceptFetch = (handler) => {
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = (input, init) => {
      const req = new Request(input, init);
      return originalFetch(input, init).then((response) => {
        const cloned = response.clone();
        return cloned.text().then((text) => {
          const modifiedText = handler(text, req.url, "fetch");
          return new Response(modifiedText, {
            status: cloned.status,
            statusText: cloned.statusText,
            headers: cloned.headers
          });
        });
      });
    };
  };
  const showLoadout = (loadout) => {
    if (hudStash === null) {
      const currentItemNames = hudItems.map((item) => item.name);
      GM_setValue(STORAGE_KEYS.HUD_STASH, currentItemNames);
    }
    setHudItemsByName(
      loadout.items,
      loadout.displayMode ?? HUD_DISPLAY_MODES.INVENTORY
    );
    if (!hudStatus) toggleHudStatus();
  };
  const showLoadouts = () => {
    const loadoutActions = [
      {
        text: "Change script settings",
        onClick: showSettings
      },
      {
        text: "Select the loadout to activate",
        label: true
      },
      ...Object.keys(loadouts).map((loadoutName) => {
        return {
          text: loadoutName,
          onClick: () => showLoadout(loadouts[loadoutName])
        };
      }),
      {
        text: "Craftworks",
        onClick: () => showLoadout({ items: craftworks.map((entry) => inventoryCache[entry.item].name) })
      },
      {
        text: "Cancel",
        color: "red",
        onClick: refreshInventory
      }
    ];
    myApp.actions(loadoutActions);
  };
  const preventDefaultContextMenu = () => {
    document.addEventListener("contextmenu", function(e) {
      if (e.target.id === "frpg-hud-toggle") e.preventDefault();
      if (e.target.closest("a.frpg-hud-item")) e.preventDefault();
    }, false);
  };
  const setupDOMContentLoadedHandlers = () => {
    document.addEventListener("DOMContentLoaded", () => {
      setupAuxClickHandler();
      setupTouchHandlers();
    });
  };
  const setupAuxClickHandler = () => {
    document.body.addEventListener("auxclick", (event) => {
      if (event.target.id === "frpg-hud-toggle") {
        event.preventDefault();
        event.stopPropagation();
        return showLoadouts();
      }
      const target = event.target.closest("a.frpg-hud-item");
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      handleQuickAction(target);
    });
  };
  const setupTouchHandlers = () => {
    let quickActionTimeout;
    let animationElement;
    const clearAnimation = () => {
      if (animationElement) {
        animationElement.classList.remove("active");
        animationElement = null;
      }
    };
    document.body.addEventListener("touchstart", (event) => {
      if (event.target.id === "frpg-hud-toggle") {
        clearTimeout(quickActionTimeout);
        quickActionTimeout = setTimeout(() => {
          showLoadouts();
        }, 500);
      }
      const target = event.target.closest("a.frpg-hud-item");
      if (!target) return;
      animationElement = target.querySelector(".fill-animation");
      if (animationElement) animationElement.classList.add("active");
      clearTimeout(quickActionTimeout);
      quickActionTimeout = setTimeout(() => {
        clearAnimation();
        handleQuickAction(target);
      }, 500);
    }, { passive: true });
    const cancelTouch = () => {
      if (quickActionTimeout) {
        clearTimeout(quickActionTimeout);
        quickActionTimeout = null;
      }
      clearAnimation();
    };
    document.body.addEventListener("touchend", cancelTouch);
    document.body.addEventListener("touchmove", cancelTouch);
  };
  const addAnimationStyle = () => {
    GM_addStyle(`
        .frpg-hud-item .fill-animation.active {
            animation: fillUp 500ms forwards;
        }
        
        @keyframes fillUp {
            from { width: 0; }
            to { width: 95%; }
        }
    `);
  };
  const setupVisibilityChangeListener = () => {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        updateHudDisplay(true);
      }
    });
  };
  const setupEventListeners = () => {
    addAnimationStyle();
    preventDefaultContextMenu();
    setupDOMContentLoadedHandlers();
    setupVisibilityChangeListener();
  };
  const storageListeners = {
    [STORAGE_KEYS.HUD_URL]: (value) => {
      setHudUrl(value);
      return true;
    },
    [STORAGE_KEYS.HUD_ITEMS]: (value) => {
      setHudItems(value);
      return true;
    },
    [STORAGE_KEYS.HUD_TIMERS]: handleHudTimerUpdate,
    [STORAGE_KEYS.HUD_STATUS]: (value) => {
      setHudStatus(value);
      return true;
    },
    [STORAGE_KEYS.HUD_STASH]: (value) => {
      setHudStash(value);
      return true;
    },
    [STORAGE_KEYS.INVENTORY]: (value) => {
      setInventory(value);
      return true;
    },
    [STORAGE_KEYS.INVENTORY_LIMIT]: (value) => {
      setInventoryLimit(value);
      return true;
    },
    [STORAGE_KEYS.SETTINGS]: (value) => {
      setSettings(value);
      return true;
    },
    [STORAGE_KEYS.QUICK_ACTIONS]: (value) => {
      setQuickActions(value);
      return false;
    },
    [STORAGE_KEYS.TOWNSFOLK]: (value) => {
      setTownsfolk(value);
      return false;
    },
    [STORAGE_KEYS.RECIPES]: (value) => {
      setRecipes(value);
      return false;
    },
    [STORAGE_KEYS.RETURN_RATE]: (value) => {
      setReturnRate(value);
      return false;
    },
    [STORAGE_KEYS.SUPPLY_PACKS]: (value) => {
      setSupplyPacks(value);
      return false;
    },
    [STORAGE_KEYS.NEW_ITEM]: () => {
      populateItemNameIdMap();
      return false;
    },
    [STORAGE_KEYS.CRAFTWORKS]: (value) => {
      setCraftworks(value);
      return false;
    },
    [STORAGE_KEYS.PRODUCTION]: (value) => {
      setProduction(value);
      return false;
    }
  };
  const setupStorageListeners = () => {
    for (const [key, handler] of Object.entries(storageListeners)) {
      GM_addValueChangeListener(key, (k, _oldVal, newVal) => {
        if (handler(newVal)) updateHudDisplay(k === STORAGE_KEYS.HUD_STATUS);
      });
    }
  };
  const listeners = [
    workerListener,
    hudListener,
    xfarmListener,
    areaListener,
    homeListener,
    itemListener,
    inventoryListener,
    workshopListener,
    locationListener,
    craftworksListener,
    locksmithListener,
    spinListener,
    townsfolkListener,
    sawmillListener,
    quarryListener,
    hayfieldListener,
    steelworksListener,
    troutFarmListener,
    wormHabitatListener
  ];
  const responseHandler = (response, url, type) => {
    for (const listener of listeners) {
      for (const regex of listener.urlMatch) {
        if (!regex.test(url)) continue;
        if (listener.passive) {
          setTimeout(listener.callback, null, response, url, type);
          return response;
        }
        try {
          const modifiedResponse = listener.callback(response, url, type);
          return modifiedResponse ?? response;
        } catch (error) {
          console.error("Error while calling callback for", listener, error);
          return response;
        }
      }
    }
    return response;
  };
  scheduleProduction();
  setupEventListeners();
  setupStorageListeners();
  interceptXHR(responseHandler);
  interceptFetch(responseHandler);
})();
// ==UserScript==
// @name         TORN: Mission Reward Information
// @namespace    dekleinekobini.missionrewardinformatiom
// @version      2.1.2
// @author       DeKleineKobini [2114440]
// @description  Give some information about mission rewards.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/loader.php?sid=missions*
// @connect      tornplayground.eu
// @connect      api.torn.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/395668/TORN%3A%20Mission%20Reward%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/395668/TORN%3A%20Mission%20Reward%20Information.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const d=document.createElement("style");d.textContent=o,document.head.append(d)})(' .playground__tornapi__api-prompt{margin-bottom:10px}.playground__tornapi__api-prompt header{background-image:linear-gradient(90deg,transparent 50%,rgba(0,0,0,.07) 0px);background-color:#90b02e;background-size:4px;display:flex;align-items:center;color:#fff;font-size:13px;letter-spacing:1px;text-shadow:rgba(0,0,0,.65) 1px 1px 2px;padding:6px 10px;border-radius:5px}.playground__tornapi__api-prompt .playground__tornapi__title{flex-grow:1;box-sizing:border-box}.playground__tornapi__api-prompt .playground__tornapi__save-button{padding:2px 10px;text-shadow:rgba(0,0,0,.05) 1px 1px 2px;cursor:pointer;box-shadow:#ffffff80 0 1px 1px inset,#00000040 0 1px 1px 1px;border:none;border-radius:4px;background-color:#ffffff26;color:#fff}body[data-playground-device=DESKTOP] .mod-description.playground-modified li:nth-child(3):after,body[data-playground-device=DESKTOP] .mod-description.playground-modified li:nth-child(4):after{content:" ";position:absolute;display:block;width:100%;height:1px;bottom:0;left:0;border-bottom:1px solid #000}body[data-playground-device=DESKTOP] .mod-description.playground-modified li:nth-child(3){margin-right:3px}body[data-playground-device=DESKTOP] .mod-description.playground-modified li:nth-child(5):before,body[data-playground-device=DESKTOP] .mod-description.playground-modified li:nth-child(6):before{content:" ";position:absolute;display:block;width:100%;height:1px;top:0;left:0;border-top:1px solid #323232} ');

(function () {
  'use strict';

  function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }
  function isHTMLElement(node) {
    return isElement(node) && node instanceof HTMLElement;
  }
  function formatNumber(original, decimals = 2) {
    const pattern = `\\d(?=(\\d{3})+${decimals > 0 ? "\\." : "$"})`;
    return original.toFixed(Math.max(0, ~~decimals)).replace(new RegExp(pattern, "g"), "$&,");
  }
  function notNull(value) {
    return value != null;
  }
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function fetchGM(url, options) {
    const method = (options == null ? void 0 : options.method) || "GET";
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method,
        url,
        headers: options == null ? void 0 : options.headers,
        data: options == null ? void 0 : options.body,
        onload: (response) => {
          response.status === 200 ? resolve(JSON.parse(response.responseText)) : reject(new Error(`Request failed with status: ${response.status} - ${response.statusText}`));
        },
        onerror: (response) => reject(new Error(`Request failed with status: ${response.status} - ${response.statusText} or error: ${response.error}`)),
        ontimeout: () => reject(new Error("Request timed out")),
        onabort: () => reject(new Error("Request aborted"))
      });
    });
  }
  function readableErrorMessage(error) {
    return error instanceof TypeError && error.message.includes("Failed to fetch") ? "Couldn't connect to the server." : error instanceof Error ? error.message : error.toString();
  }
  const apiPrompt = "playground__tornapi__api-prompt", title = "playground__tornapi__title", saveButton = "playground__tornapi__save-button", styles = {
    "api-prompt": "playground__tornapi__api-prompt",
    apiPrompt,
    title,
    "save-button": "playground__tornapi__save-button",
    saveButton
  };
  function hasKeyInStorage() {
    return "###PDA-APIKEY###".startsWith("###") ? localStorage.getItem("dkkutils_apikey") !== null : true;
  }
  function getKeyFromStorage() {
    const pdaKey = "###PDA-APIKEY###";
    return pdaKey.startsWith("###") ? localStorage.getItem("dkkutils_apikey") || void 0 : pdaKey;
  }
  function initializeTornAPI() {
    const key = getKeyFromStorage();
    if (key && isValid(key))
      return;
    let selector;
    switch (window.location.pathname) {
      case "/christmas_town.php":
        selector = ".content-wrapper div[id*='root'] > div > div:eq(0)";
        break;
      default:
        selector = ".content-title";
        break;
    }
    const createPrompt = () => {
      if (document.getElementById("dkkapi-prompt"))
        return;
      const title2 = document.createElement("span");
      title2.className = styles.title, title2.textContent = "API Prompt";
      const input = document.createElement("input");
      input.type = "text", input.style.marginRight = "8px";
      const saveButton2 = document.createElement("button");
      saveButton2.className = styles.saveButton, saveButton2.textContent = "Save", saveButton2.addEventListener("click", (event) => {
        event.preventDefault();
        const inputKey = input.value;
        isValid(inputKey) ? (widget.remove(), localStorage.setItem("dkkutils_apikey", inputKey)) : input.value = "";
      });
      const header = document.createElement("header");
      header.appendChild(title2), header.appendChild(input), header.appendChild(saveButton2);
      const widget = document.createElement("div");
      widget.className = styles.apiPrompt, widget.id = "dkkapi-prompt", widget.appendChild(header);
      const clearDiv = document.createElement("div");
      clearDiv.className = "clear";
      const selectorElement = document.querySelector(selector);
      selectorElement.parentNode.insertBefore(widget, selectorElement.nextSibling), selectorElement.parentNode.insertBefore(clearDiv, selectorElement.nextSibling);
    };
    document.querySelector(selector) ? createPrompt() : new MutationObserver((_, observer) => {
      document.querySelector(selector) && (createPrompt(), observer.disconnect());
    }).observe(document, { childList: true, subtree: true });
  }
  function isValid(key) {
    return !key || key === "undefined" || key === null || key === "null" || key === "" ? false : key.length === 16;
  }
  function apiRequest(providedOptions) {
    const options = fillOptions(providedOptions), url = `https://api.torn.com/${options.section}/${options.id}?selections=${options.selections}&comment=${options.comment}&key=${options.key}`;
    return new Promise((resolve, reject) => {
      fetchGM(url).then((data) => resolve(handleApiResponse(data))).catch((reason) => reject({ type: "other", reason }));
    });
  }
  async function handleApiResponse(data) {
    if ("error" in data)
      throw {
        type: "api",
        code: data.error.code,
        message: data.error.error
      };
    return data;
  }
  function isApiError(error) {
    return "type" in error && ["api", "http", "timeout"].includes(error.type);
  }
  function fillOptions(options) {
    let key;
    if ("key" in options && options.key)
      key = options.key;
    else if (hasKeyInStorage())
      key = getKeyFromStorage();
    else
      throw new Error("Missing API key");
    return {
      section: options.section,
      id: options.id ?? "",
      selections: options.selections.join(","),
      key,
      comment: options.comment || "Sandbox"
    };
  }
  const rewardHandlers = [];
  const refreshHandlers = [];
  function setupMissionObservers() {
    new MutationObserver((mutations) => {
      const foundDescription = mutations.flatMap((mutation) => [...mutation.addedNodes]).filter(isHTMLElement).filter((element) => element.classList.contains("show-item-info")).find((element) => !!element);
      if (!foundDescription)
        return;
      const itemElement = document.querySelector(".rewards-list > li.act");
      rewardHandlers.forEach((onReward) => onReward(foundDescription, JSON.parse(itemElement.dataset.ammoInfo)));
    }).observe(document.body, { subtree: true, childList: true });
    refreshHandlers.forEach((onRefresh) => onRefresh());
    ["#viewMissionsRewardsContainer", ".rewards-wrap", ".rewards-slider-underlayer", ".rewards-slider", ".rewards-slider .slide", ".rewards-list"].map((selector) => document.querySelector(selector)).filter(notNull).forEach((element) => {
      new MutationObserver((mutations) => {
        console.log("DKK mission MO", element.className, mutations);
      }).observe(element, { childList: true });
    });
  }
  function registerRewardHandler(handler) {
    rewardHandlers.push(handler);
  }
  function registerRefreshHandler(handler) {
    refreshHandlers.push(handler);
  }
  const BASE_URL = "https://tornplayground.eu/";
  function getWeaponMod(name) {
    return new Promise((resolve, reject) => {
      fetchGM(`${BASE_URL}api/missionrewards/weaponmods/${name}`).then((response) => resolve(response)).catch((error) => {
        if (error.message.includes("404")) {
          resolve(null);
          return;
        }
        reject(readableErrorMessage(error));
      });
    });
  }
  function sendWeaponMods(update) {
    return new Promise((resolve, reject) => {
      fetchGM(`${BASE_URL}api/missionrewards/weaponmods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update)
      }).then((response) => resolve(response)).catch((error) => reject(readableErrorMessage(error)));
    });
  }
  function sendSpecialAmmo(update) {
    return new Promise((resolve, reject) => {
      fetchGM(`${BASE_URL}api/missionrewards/ammo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update)
      }).then((response) => resolve(response)).catch((error) => reject(readableErrorMessage(error)));
    });
  }
  async function showWeaponModData(name, modInfo) {
    if (modInfo.dataset.wpmInit === "true")
      return;
    modInfo.dataset.wpmInit = "true";
    try {
      const prices = await getWeaponMod(name);
      if (!prices)
        return;
      const priceHtml = `<li><span>Price Range:</span> <span class="bold">${prices.minPrice} - ${prices.maxPrice}</span></li>`;
      const specialHtml = `<li><span>Special Offer Range:</span> <span class="bold">${prices.minSpecialPrice} - ${prices.maxSpecialPrice}</span></li>`;
      const description = modInfo.querySelector(".mod-description");
      description.classList.add("playground-modified");
      description.children[1].insertAdjacentHTML("afterend", priceHtml);
      description.children[2].insertAdjacentHTML("afterend", specialHtml);
    } catch (error) {
      console.error("[MRI] Failed to show weapon mod prices.", error);
    }
  }
  function sendAllData() {
    queryAllMods().forEach(sendWeaponModData);
    querySpecialAmmo().forEach(sendSpecialAmmoData);
  }
  function queryAllMods() {
    return [...document.querySelectorAll(".rewards-list li.mod-wrap[data-ammo-info]")].filter((element) => !element.classList.contains("playground-mod")).map((element) => ({ element, data: JSON.parse(element.dataset.ammoInfo) })).filter((item) => item.data.type === "weaponUpgrade");
  }
  function sendWeaponModData(query) {
    const { name, points } = query.data;
    const isSpecialOffer = query.data.label === "special-offer";
    query.element.classList.add("playground-mod");
    sendWeaponMods({ name, price: points, special: isSpecialOffer }).then((response) => {
      if (response.value) {
        console.log(`[MRI] Your current price for ${name} at ${points} has been recorded.`);
      } else
        console.log(`[MRI] Your current price for ${name} at ${points} has been NOT recorded because it falls within the known range.`);
    }).catch((cause) => {
      console.warn(`[MRI] Failed to record your current price for ${name}.`, cause);
    });
  }
  function querySpecialAmmo() {
    return [...document.querySelectorAll(".rewards-list li.ammo-wrap[data-ammo-info]")].filter((element) => !element.classList.contains("playground-ammo")).map((element) => ({ element, data: JSON.parse(element.dataset.ammoInfo) })).filter((item) => item.data.basicType === "Ammo");
  }
  function sendSpecialAmmoData(query) {
    const { amount, name, ammoType, points: price } = query.data;
    const type = ammoType.toUpperCase().replace(" ", "_");
    query.element.classList.add("playground-ammo");
    sendSpecialAmmo({ name, type, amount, price }).then((response) => {
      if (response.value) {
        console.log(`[MRI] Your current price for ${name} ${type} at ${price} has been recorded.`);
      } else
        console.log(`[MRI] Your current price for ${name} ${type} at ${price} has been NOT recorded because it falls within the known range.`);
    }).catch((cause) => {
      console.warn(`[MRI] Failed to record your current price for ${name} ${type}.`, cause);
    });
  }
  const minTabletSize = 386;
  const maxTabletSize = 784;
  const maxTabletSizeWithoutSidebar = 1e3;
  const minTabletSizeWithoutSidebar = 600;
  function isPageWithoutSidebar() {
    return document.body.classList.contains("without-sidebar") || false;
  }
  function getScreenWidth() {
    return window.innerWidth;
  }
  function getMaxTabletSize() {
    return isPageWithoutSidebar() ? maxTabletSizeWithoutSidebar : maxTabletSize;
  }
  function getMinTabletSize() {
    return isPageWithoutSidebar() ? minTabletSizeWithoutSidebar : minTabletSize;
  }
  function hasSidebar() {
    const hasDesktopScreen = getScreenWidth() > 1e3;
    return hasDesktopScreen && !isPageWithoutSidebar();
  }
  function getCurrentScreenSize() {
    const width = getScreenWidth();
    if (width > getMaxTabletSize()) {
      return "DESKTOP";
    }
    if (width <= getMinTabletSize()) {
      return "MOBILE";
    }
    return "TABLET";
  }
  function updateScreenSize() {
    document.body.dataset.playgroundDevice = getCurrentScreenSize();
    document.body.dataset.playgroundSidebar = `${hasSidebar()}`;
  }
  function setupScreenSize() {
    if (document.body.dataset.playgroundScreenSizeInitialized === "true") {
      return;
    }
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    document.body.dataset.playgroundScreenSizeInitialized = "true";
  }
  initializeTornAPI();
  setupScreenSize();
  registerRefreshHandler(sendAllData);
  registerRewardHandler((element, data) => {
    if (data.type === "weaponUpgrade") {
      showWeaponModData(data.name, element).catch((cause) => console.error("[MRI] Failed to show weapon mod prices.", cause));
    } else if (data.basicType === "Item") {
      showItemInfo(data.points, data.amount);
    } else if (data.basicType === "Ammo") {
      void showAmmoAmount(data.ammoType, data.name);
    } else {
      console.debug("[MRI] Opened another item type.", data);
    }
  });
  setupMissionObservers();
  async function showAmmoAmount(type, size) {
    const owned = await getAmmoAmount(type, size) ?? "api not loaded";
    document.querySelector(".ammo-description").insertAdjacentHTML(
      "beforeend",
      `
        <li>
            <span>Owned:</span>
            <span class="bold">${owned}</span>
        </li>
    `
    );
  }
  async function getAmmoAmount(type, size) {
    const apiAmmo = await apiRequest({ section: "user", selections: ["ammo"] });
    if (isApiError(apiAmmo))
      return void 0;
    const ownedAmmo = apiAmmo.ammo.find((ammo) => ammo.size === size && ammo.type === type);
    return (ownedAmmo == null ? void 0 : ownedAmmo.quantity) ?? 0;
  }
  function showItemInfo(points, amount) {
    if (document.querySelector(".show-item-info .info-wrap"))
      show();
    else {
      new MutationObserver((_, observer) => {
        if (!document.querySelector(".show-item-info"))
          return;
        show();
        observer.disconnect();
      }).observe(document.querySelector(".show-item-info"), { childList: true });
    }
    function show() {
      const valueElement = document.querySelector(".show-item-info li:first-child .desc");
      const value = parseInt(valueElement.innerText.replaceAll("$", "").replaceAll(",", ""), 10);
      const valueCredits = value * amount / points;
      const fields = document.querySelectorAll(".show-item-info .info-cont > li:not(.clear)");
      let field = fields.item(fields.length - 1);
      if (field.innerHTML.length > 0) {
        const newField = document.createElement("li");
        newField.classList.add("t-left");
        field.after(newField);
        field = newField;
      }
      field.insertAdjacentHTML(
        "beforeend",
        `
                <div class='title'>Money / Credit:</div>
                <div class='desc'>${formatNumber(valueCredits)}</div>
                <div class='clear'></div>
            `
      );
    }
  }

})();
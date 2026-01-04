// ==UserScript==
// @name        Counter-Strike 2 Script
// @namespace   https://github.com/Citrinate
// @author      Citrinate
// @description Manage your CS2 storage units and inspect items
// @license     Apache-2.0
// @version     1.1.0.1
// @match       https://steamcommunity.com/id/*/inventory*
// @match       https://steamcommunity.com/profiles/*/inventory*
// @match       https://steamcommunity.com/market/listings/*
// @connect     localhost
// @connect     127.0.0.1
// @connect     *
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// @homepageURL https://github.com/Citrinate/CS2Script
// @supportURL  https://github.com/Citrinate/CS2Script/issues
// @downloadURL https://update.greasyfork.org/scripts/541555/Counter-Strike%202%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/541555/Counter-Strike%202%20Script.meta.js
// ==/UserScript==
(() => {
  // src/core/settings.js
  var SETTING_ASF_SERVER = "SETTING_ASF_SERVER";
  var SETTING_ASF_PORT = "SETTING_ASF_PORT";
  var SETTING_ASF_PASSWORD = "SETTING_ASF_PASSWORD";
  var SETTING_INSPECT_ITEMS = "SETTING_INSPECT_ITEMS";
  var SETTING_INSPECT_CACHE_TIME_HOURS = "SETTING_INSPECT_CACHE_TIME_HOURS";
  var SETTING_INTERFACE_AUTOSTOP_MINUTES = "SETTING_INTERFACE_AUTOSTOP_MINUTES";
  var DEFAULT_SETTINGS = {
    SETTING_ASF_SERVER: "http://localhost",
    SETTING_ASF_PORT: "1242",
    SETTING_ASF_PASSWORD: "",
    SETTING_INSPECT_ITEMS: true,
    SETTING_INSPECT_CACHE_TIME_HOURS: -1,
    SETTING_INTERFACE_AUTOSTOP_MINUTES: 15
  };
  function GetSetting(name) {
    return GM_getValue(name, DEFAULT_SETTINGS[name]);
  }
  function SetSetting(name, value) {
    GM_setValue(name, value);
  }

  // src/core/asf.js
  var asf_default = {
    Send: async function(operation, path, http_method, bot, data) {
      let payload = null;
      let parameters = "";
      if (data) {
        if (http_method === "GET") {
          parameters = "?" + new URLSearchParams(data).toString();
        } else if (http_method === "POST") {
          payload = JSON.stringify(data);
        }
      }
      const xhrResponse = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url: `${GetSetting(SETTING_ASF_SERVER)}:${GetSetting(SETTING_ASF_PORT)}/Api/${operation}/${bot}/${path}${parameters}`,
          method: http_method,
          data: payload,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authentication": GetSetting(SETTING_ASF_PASSWORD)
          },
          onload: (response) => {
            let parsedResponse;
            try {
              parsedResponse = JSON.parse(response.responseText.replace(/:(\s*)(\d{16,})/g, ':"$2"'));
            } catch {
              parsedResponse = response.response;
            }
            resolve({ ...response, response: parsedResponse });
          },
          onerror: (e) => {
            const error = new Error(`(${e.status}) Request error from /Api/${operation}/${path}`);
            error.code = e.status;
            reject(error);
          },
          ontimeout: (e) => {
            const error = new Error(`(${e.status}) Request timed out on /Api/${operation}/${path}`);
            error.code = e.status;
            reject(error);
          }
        });
      });
      if (xhrResponse.status === 401) {
        const error = new Error(`(401) Missing or incorrect ASF IPC password. Please check your settings and verify your ASF IPC password.`);
        error.code = xhrResponse.status;
        error.response = xhrResponse.response;
        throw error;
      }
      if (xhrResponse.status === 403) {
        let errorMessage;
        if (!GetSetting(SETTING_ASF_SERVER).includes("127.0.0.1") && !GetSetting(SETTING_ASF_SERVER).toLowerCase().includes("localhost") && !GetSetting(SETTING_ASF_PASSWORD)) {
          errorMessage = "(403) You must use an ASF IPC password when connecting to ASF remotely.";
        } else {
          errorMessage = "(403) The ASF IPC password you entered was incorrect. Please wait or restart ASF, and then try again.";
        }
        const error = new Error(errorMessage);
        error.code = xhrResponse.status;
        error.response = xhrResponse.response;
        throw error;
      }
      if (!xhrResponse.response || xhrResponse.status !== 200) {
        let errorMessage = `(${xhrResponse.status}) ASF request error from /Api/${operation}/${path}`;
        if (xhrResponse.response?.Message) {
          errorMessage += `: ${xhrResponse.response?.Message}`;
        } else if (xhrResponse.status >= 500) {
          errorMessage += `: Please check your ASF logs for errors`;
        }
        const error = new Error(errorMessage);
        error.code = xhrResponse.status;
        error.response = xhrResponse.response;
        throw error;
      }
      if (!xhrResponse.response.Success) {
        let errorMessage = `(${xhrResponse.status}) ASF response error from /Api/${operation}/${path}`;
        if (xhrResponse.response.Message) {
          errorMessage += `: ${xhrResponse.response.Message}`;
        }
        const error = new Error(errorMessage);
        error.code = xhrResponse.status;
        error.response = xhrResponse.response;
        throw error;
      }
      return xhrResponse.response.Result ?? xhrResponse.response;
    },
    GetBot: async function(steamID, includePluginStatus = true) {
      if (steamID === false) {
        return;
      }
      const bots = await this.Send("Bot", "", "GET", "ASF");
      let pluginStatus;
      if (includePluginStatus) {
        pluginStatus = await this.GetPluginStatus();
      }
      const mergedBots = Object.fromEntries(
        Object.entries(bots).map(([key, value]) => [
          key,
          {
            ASF: value,
            Plugin: pluginStatus?.[key]
          }
        ])
      );
      if (steamID) {
        return Object.values(mergedBots).find((bot) => bot.ASF.SteamID == steamID);
      }
      return mergedBots;
    },
    GetPluginStatus: async function(botName) {
      const bots = await this.Send("CS2Interface", "Status", "GET", "ASF", { "refreshAutoStop": "true" });
      if (botName) {
        return bots[botName];
      }
      return bots;
    }
  };

  // src/cs2/constants.js
  var CS2_APPID = 730;
  var INVENTORY_ITEM_LIMIT = 1e3;
  var STORAGE_UNIT_ITEM_LIMIT = 1e3;
  var MAX_PURCHASE_QUANTITY = 20;
  var STICKER_MAX_COUNT = 5;
  var KEYCHAIN_MAX_COUNT = 1;
  var SEED_RANGE = { min: 0, max: 1e5 };
  var FLOAT_RANGE = { min: 0, max: 1 };
  var WEARS = [
    { min: 0, max: 0.07, name: "FN", nameLong: "Factory New" },
    { min: 0.07, max: 0.15, name: "MW", nameLong: "Minimum Wear" },
    { min: 0.15, max: 0.38, name: "FT", nameLong: "Field-Tested" },
    { min: 0.38, max: 0.45, name: "WW", nameLong: "Well-Worn" },
    { min: 0.45, max: 1, name: "BS", nameLong: "Battle-Scarred" }
  ];
  var QUALITIES = {
    "normal": 0,
    "genuine": 1,
    "vintage": 2,
    "unusual": 3,
    "unique": 4,
    "community": 5,
    "developer": 6,
    "selfmade": 7,
    "customized": 8,
    "strange": 9,
    "completed": 10,
    "haunted": 11,
    "tournament": 12,
    "highlight": 13,
    "volatile": 14
  };
  var RARITIES = {
    "Rarity_Default": 0,
    "Rarity_Default_Weapon": 0,
    "Rarity_Default_Character": 0,
    "Rarity_Common": 1,
    "Rarity_Common_Weapon": 1,
    "Rarity_Common_Character": 1,
    "Rarity_Uncommon": 2,
    "Rarity_Uncommon_Weapon": 2,
    "Rarity_Uncommon_Character": 2,
    "Rarity_Rare": 3,
    "Rarity_Rare_Weapon": 3,
    "Rarity_Rare_Character": 3,
    "Rarity_Mythical": 4,
    "Rarity_Mythical_Weapon": 4,
    "Rarity_Mythical_Character": 4,
    "Rarity_Legendary": 5,
    "Rarity_Legendary_Weapon": 5,
    "Rarity_Legendary_Character": 5,
    "Rarity_Ancient": 6,
    "Rarity_Ancient_Weapon": 6,
    "Rarity_Ancient_Character": 6,
    "Rarity_Contraband": 7,
    "Rarity_Contraband_Weapon": 7,
    "Rarity_Contraband_Character": 7,
    "Unusual": 99,
    "Rarity_Unusual": 99
  };
  var TOURNAMENT_MAPS = {
    2: "Dust II",
    3: "Train",
    5: "Inferno",
    6: "Nuke",
    7: "Vertigo",
    23: "Mirage",
    32: "Overpass",
    91: "Anubis",
    101: "Ancient"
  };

  // src/utils/cache.js
  var Cache = class {
    static #dbName = "cs2_script";
    static #storeName = "kvp";
    static #version = 1;
    static #initPromise = null;
    static #keyName = "DB_ENCRYPTION_KEY";
    static #key = null;
    static async #Init() {
      if (this.#initPromise) {
        return this.#initPromise;
      }
      this.#initPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(this.#dbName, this.#version);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.#storeName)) {
            db.createObjectStore(this.#storeName);
          }
        };
        request.onsuccess = async () => {
          const db = request.result;
          const testKey = "cache_validity_test";
          const testValue = 42;
          const storedKey = GM_getValue(this.#keyName, null);
          if (storedKey) {
            try {
              const raw = Uint8Array.from(atob(storedKey), (c) => c.charCodeAt(0));
              this.#key = await crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
              await this.#Encrypt({ test: true });
              if (await this.#Get(db, testKey) !== testValue) {
                throw new Error("Cache failed to validate");
              }
            } catch (e) {
              script_default.ShowError({ level: ERROR_LEVEL.MEDIUM }, e, new Error("Clearing cache"));
              this.#key = null;
            }
          }
          if (!this.#key) {
            const rawKey = crypto.getRandomValues(new Uint8Array(32));
            this.#key = await crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
            GM_setValue(this.#keyName, btoa(String.fromCharCode(...rawKey)));
            await this.#Clear(db);
          }
          await this.#Set(db, testKey, testValue);
          resolve(db);
        };
        request.onerror = () => {
          reject(request.error);
        };
      });
      return this.#initPromise;
    }
    static async #Encrypt(data) {
      const encoded = new TextEncoder().encode(JSON.stringify(data));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, this.#key, encoded);
      const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(ciphertext), iv.byteLength);
      return combined.buffer;
    }
    static async #decrypt(buffer) {
      const combined = new Uint8Array(buffer);
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      const encoded = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, this.#key, ciphertext);
      return JSON.parse(new TextDecoder().decode(encoded));
    }
    static async #Clear(db) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.#storeName, "readwrite");
        const store = tx.objectStore(this.#storeName);
        const req = store.clear();
        req.onsuccess = () => {
          resolve();
        };
        req.onerror = () => {
          reject(req.error);
        };
      });
    }
    static async #Get(db, key, defaultValue = null) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.#storeName, "readonly");
        const store = tx.objectStore(this.#storeName);
        const req = store.get(key);
        req.onsuccess = async () => {
          if (!req.result) {
            resolve(defaultValue);
            return;
          }
          try {
            resolve(await this.#decrypt(req.result));
          } catch (e) {
            script_default.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
            resolve(defaultValue);
          }
        };
        req.onerror = () => {
          reject(req.error);
        };
      });
    }
    static async #Set(db, key, value) {
      const encrypted = await this.#Encrypt(value);
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.#storeName, "readwrite");
        const store = tx.objectStore(this.#storeName);
        const req = store.put(encrypted, key);
        req.onsuccess = () => {
          resolve();
        };
        req.onerror = () => {
          reject(req.error);
        };
      });
    }
    static async GetValue(key, defaultValue = null) {
      return this.#Get(await this.#Init(), key, defaultValue);
    }
    static async SetValue(key, value) {
      return this.#Set(await this.#Init(), key, value);
    }
  };

  // src/utils/helpers.js
  function Request(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(`Request failed with status: ${xhr.status}`));
        }
      };
      xhr.onerror = function() {
        reject(new Error("Network error occurred"));
      };
      xhr.ontimeout = function() {
        reject(new Error("Request timed out"));
      };
      xhr.send();
    });
  }
  function CreateElement(tag, options) {
    const el = document.createElement(tag);
    if (options) {
      for (const [key, value] of Object.entries(options)) {
        if (key === "class") {
          el.className = value;
        } else if (key === "html") {
          el.innerHTML = value;
        } else if (key === "text") {
          el.innerText = value;
        } else if (key === "hide" && value) {
          el.hide();
        } else if (key === "style") {
          Object.assign(el.style, value);
        } else if (key === "vars") {
          for (const [varName, varValue] of Object.entries(value)) {
            el.style.setProperty(`--${varName}`, varValue);
          }
        } else if (key === "dataset") {
          Object.assign(el.dataset, value);
        } else if (key === "disabled") {
          el.disabled = value;
        } else if (key === "selected") {
          el.selected = value;
        } else if (key.startsWith("on") && typeof value === "function") {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === "htmlChildren") {
          for (const child of value) {
            if (!child) {
              continue;
            }
            el.insertAdjacentHTML("beforeend", child);
          }
        } else if (key === "children") {
          for (const child of value) {
            if (!child) {
              continue;
            }
            el.append(child instanceof Node ? child : document.createTextNode(child));
          }
        } else {
          el.setAttribute(key, value);
        }
      }
    }
    return el;
  }
  function CreateCachedAsyncFunction(asyncFunction) {
    let cache = null;
    let inProgress = null;
    const wrapped = async () => {
      if (cache !== null) {
        return cache;
      }
      if (inProgress) {
        return inProgress;
      }
      inProgress = asyncFunction().then((result) => {
        cache = result;
        return result;
      });
      return inProgress;
    };
    wrapped.willReturnImmediately = () => {
      return cache !== null;
    };
    return wrapped;
  }
  function BindTooltip(element, text, options = {}) {
    if (element.unbindTooltip) {
      element.unbindTooltip();
    }
    const tooltip = CreateElement("div", {
      class: "cs2s_tooltip",
      text
    });
    let fadeOutAnimation = null;
    if (options.showStyle ?? true) {
      element.classList.add(`cs2s_has_tooltip`);
    }
    function onMouseEnter() {
      if (fadeOutAnimation) {
        fadeOutAnimation.cancel();
        fadeOutAnimation = null;
      }
      const rect = element.getBoundingClientRect();
      document.body.appendChild(tooltip);
      void tooltip.offsetWidth;
      tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
      tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      Fade(tooltip, { from: 0, to: 1, duration: 200 });
    }
    function onMouseLeave() {
      fadeOutAnimation = Fade(tooltip, {
        from: 1,
        to: 0,
        duration: 200,
        onfinish: () => {
          tooltip.isConnected && tooltip.remove();
        }
      });
    }
    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);
    element.unbindTooltip = () => {
      element.removeEventListener("mouseenter", onMouseEnter);
      element.removeEventListener("mouseleave", onMouseLeave);
      element.classList.remove(`cs2s_has_tooltip`);
      element.unbindTooltip = null;
      tooltip.isConnected && tooltip.remove();
    };
    return tooltip;
  }
  function Fade(element, options) {
    const to = options.to ?? 1;
    if (typeof options.from !== "undefined") {
      element.style.opacity = options.from;
    }
    const animation = element.animate({
      opacity: to
    }, {
      duration: options.duration ?? 250,
      easing: "ease",
      fill: "forwards"
    });
    if (typeof options.onfinish === "function") {
      animation.onfinish = () => {
        options.onfinish();
      };
    }
    return animation;
  }
  function Sleep(milliseconds) {
    if (milliseconds <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  function Random(min, max) {
    return Math.random() * (max - min) + min;
  }
  function CompareVersions(v1, v2) {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);
    const length = Math.max(parts1.length, parts2.length);
    for (let i = 0; i < length; i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  }
  function WaitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    });
  }

  // src/cs2/items/icons.js
  var Icons = class _Icons {
    static URLs = {};
    static #cacheID = "icon_urls";
    static #BLANK_STORE_ICON = "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa5zlu_XrnbxcykJzXFvQUm9dGsu1yxRxj1zMC2qHQIv6CqbPFrJfXDXzSWwu936LRtGHvh2w0ptHt7bgdE";
    static async LoadCachedIcons() {
      if (Object.keys(_Icons.URLs).length != 0) {
        return;
      }
      this.URLs = await Cache.GetValue(this.#cacheID, {});
    }
    static SetIcon(hash, icon_url) {
      this.URLs[hash] = icon_url;
      Cache.SetValue(this.#cacheID, this.URLs);
    }
    static GetIconURL(hash, size) {
      if (!this.URLs[hash]) {
        return null;
      }
      return `https://community.fastly.steamstatic.com/economy/image/${this.URLs[hash]}/${size}`;
    }
    // Scrape icon urls from market listing pages
    static async FetchMarketIcons(hashes, progressCallback) {
      if (hashes.size == 0) {
        return;
      }
      const iconsToFetch = hashes.size;
      let iconsFetched = 0;
      progressCallback("Fetching Item Icons", 0);
      for (const hash of hashes) {
        let success = false;
        const url = `${window.location.origin}/market/listings/${CS2_APPID}/${encodeURIComponent(hash)}`;
        for (let attempt = 0; attempt < 5; attempt++) {
          try {
            const listingPage = await Request(url);
            if (listingPage.includes("g_rgAssets = []")) {
              if (!listingPage.includes("Market_LoadOrderSpread")) {
                success = true;
                this.SetIcon(hash, null);
                hashes.delete(hash);
                continue;
              }
              await Sleep(Random(1e3, 2e3));
              continue;
            }
            const matches = listingPage.match(/g_rgAssets\s*=\s*({.*?});/);
            if (!matches) {
              script_default.ShowError({ level: ERROR_LEVEL.LOW }, new Error(`Failed to find g_rgAssets at ${url}`));
              console.log(listingPage);
              return;
            }
            if (matches.length > 1) {
              let assets;
              try {
                assets = JSON.parse(matches[1]);
              } catch {
                script_default.ShowError({ level: ERROR_LEVEL.LOW }, new Error(`Failed to parse g_rgAssets at ${url}`));
                console.log(matches);
                return;
              }
              const asset = Object.values(assets?.[CS2_APPID]?.[2] ?? assets?.[CS2_APPID]?.[0] ?? {})?.[0];
              if (asset?.icon_url) {
                success = true;
                this.SetIcon(hash, asset?.icon_url);
                hashes.delete(hash);
              }
            }
            break;
          } catch (e) {
            script_default.ShowError({ level: ERROR_LEVEL.LOW }, e);
            await Sleep(Random(1e3, 2e3));
          }
        }
        if (!success) {
          script_default.ShowError({ level: ERROR_LEVEL.LOW }, new Error(`Failed to get item icon at ${url}`));
        }
        iconsFetched++;
        progressCallback(`Fetching Item Icons (${iconsFetched}/${iconsToFetch})`, iconsFetched / iconsToFetch);
      }
    }
    // Scrape icon urls in batches from the multisell page (only works with commodity items)
    static async FetchMarketCommodityIcons(hashes, progressCallback) {
      if (hashes.size == 0) {
        return;
      }
      const itemLimit = 25;
      const chunkedHashes = Array.from(
        { length: Math.ceil(hashes.size / itemLimit) },
        (_, index) => [...hashes].slice(index * itemLimit, (index + 1) * itemLimit)
      );
      const iconsToFetch = hashes.size;
      let iconsFetched = 0;
      progressCallback("Fetching Commodity Item Icons", 0);
      for (const chunk of chunkedHashes) {
        const query = new URLSearchParams({
          appid: String(CS2_APPID),
          contextid: "2"
        });
        for (const hash of chunk) {
          query.append("items[]", hash);
        }
        const url = `${window.location.origin}/market/multisell?${query.toString()}`;
        let success = false;
        for (let attempt = 0; attempt < 5; attempt++) {
          try {
            const multiSellPage = await Request(url);
            if (multiSellPage.includes("error_ctn")) {
              continue;
            }
            const matches = multiSellPage.match(/g_rgAssets\s*=\s*({.*?});/);
            if (!matches) {
              script_default.ShowError({ level: ERROR_LEVEL.LOW }, new Error(`Failed to find g_rgAssets at ${url}`));
              console.log(multiSellPage);
              return;
            }
            if (matches.length > 1) {
              let assets;
              try {
                assets = JSON.parse(matches[1]);
              } catch (e) {
                script_default.ShowError({ level: ERROR_LEVEL.LOW }, e, new Error(`Failed to parse g_rgAssets at ${url}`));
                console.log(matches);
                return;
              }
              for (const asset of Object.values(assets?.[CS2_APPID]?.[2])) {
                for (const hash of chunk) {
                  if (asset?.description?.market_hash_name == hash && asset?.description?.icon_url) {
                    this.SetIcon(hash, asset.description.icon_url);
                    hashes.delete(hash);
                    break;
                  }
                }
              }
              success = true;
            }
            break;
          } catch (e) {
            script_default.ShowError({ level: ERROR_LEVEL.LOW }, e);
            await Sleep(Random(1e3, 2e3));
          }
        }
        if (!success) {
          script_default.ShowError({ level: ERROR_LEVEL.LOW }, new Error(`Failed to get item icons at ${url}`));
        }
        iconsFetched += chunk.length;
        progressCallback(`Fetching Commodity Item Icons (${iconsFetched}/${iconsToFetch})`, iconsFetched / iconsToFetch);
      }
    }
    static async FetchStoreIcons(hashes, progressCallback) {
      if (Object.values(hashes).length == 0) {
        return;
      }
      progressCallback("Fetching Store Item Icons", 0);
      const itemsToGetIconsFor = {};
      {
        let assets;
        try {
          const assetPrices = await asf_default.Send("CS2Interface", `GetAssetPrices`, "GET", "ASF");
          if (!assetPrices?.result?.success || !assetPrices?.result?.assets) {
            console.log(assetPrices);
            throw new Error(`Failed to get store asset data`);
          }
          assets = assetPrices.result.assets;
        } catch (e) {
          script_default.ShowError({ level: ERROR_LEVEL.LOW }, e);
          return;
        }
        for (const asset of assets) {
          const defID = Number(asset.class.find((x) => x.name == "def_index").value);
          if (!defID || !hashes[defID]) {
            continue;
          }
          itemsToGetIconsFor[asset.classid] = { def_index: defID, hash: hashes[defID] };
        }
      }
      const classIDs = Object.keys(itemsToGetIconsFor);
      if (classIDs.length == 0) {
        return;
      }
      const sizeLimit = 100;
      const iconsToFetch = classIDs.length;
      let iconsFetched = 0;
      const chunkedClassIDs = Array.from(
        { length: Math.ceil(iconsToFetch / sizeLimit) },
        (_, index) => classIDs.slice(index * sizeLimit, (index + 1) * sizeLimit)
      );
      for (const chunk of chunkedClassIDs) {
        let assets;
        try {
          const assetClassInfo = await asf_default.Send("CS2Interface", `GetAssetClassInfo`, "GET", "ASF", { classIDs: chunk.join(",") });
          if (!assetClassInfo.result.success) {
            script_default.ShowError({ level: ERROR_LEVEL.LOW }, assets.error);
          }
          assets = assetClassInfo.result;
        } catch (e) {
          script_default.ShowError({ level: ERROR_LEVEL.LOW }, e);
          continue;
        }
        for (const classID of chunk) {
          const iconUrl = assets[classID]?.icon_url;
          if (iconUrl && iconUrl != this.#BLANK_STORE_ICON) {
            const hash = itemsToGetIconsFor[classID].hash;
            const def_index = itemsToGetIconsFor[classID].def_index;
            this.SetIcon(hash, iconUrl);
            delete hashes[def_index];
          }
        }
        iconsFetched += chunk.length;
        progressCallback(`Fetching Store Item Icons (${iconsFetched}/${iconsToFetch})`, iconsFetched / iconsToFetch);
      }
    }
  };

  // src/cs2/items/inventory.js
  var Inventory = class {
    items;
    storedItems;
    loadedFromCache;
    constructor(items, loadedFromCache = false) {
      this.items = items;
      this.storedItems = [];
      this.loadedFromCache = loadedFromCache;
    }
    async LoadCrateContents(progressCallback) {
      let cratesOpened = 0;
      const numCrates = this.items.filter((item) => item.iteminfo.def_index === 1201).length;
      progressCallback(`Loading Storage Unit Contents (${cratesOpened}/${numCrates})`, cratesOpened / numCrates);
      await Icons.LoadCachedIcons();
      for (const item of this.items) {
        if (item.iteminfo.def_index == 1201) {
          const storedItems = await this.#OpenCrate(item);
          if (storedItems) {
            this.storedItems = this.storedItems.concat(storedItems);
          }
          cratesOpened++;
          progressCallback(`Loading Storage Unit Contents (${cratesOpened}/${numCrates})`, cratesOpened / numCrates);
        }
        if (!Icons.URLs[item.full_name]) {
          for (const contextId in unsafeWindow.g_rgAppContextData[CS2_APPID].rgContexts) {
            const asset = unsafeWindow.g_rgAppContextData[CS2_APPID].rgContexts[contextId].inventory.m_rgAssets[item.iteminfo.id];
            if (asset) {
              Icons.SetIcon(item.full_name, asset.description.icon_url);
              break;
            }
          }
        }
      }
      const marketItemsToGetIconsFor = /* @__PURE__ */ new Set();
      const commodityMarketItemsToGetIconsFor = /* @__PURE__ */ new Set();
      for (const item of [...this.items, ...this.storedItems]) {
        item.id = item.iteminfo.id;
        item.name = !!item.wear_name && item.full_name.includes(item.wear_name) ? item.full_name.slice(0, -(item.wear_name.length + 3)) : item.full_name;
        item.name_normalized = !item.name ? void 0 : item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        item.collection_name = (item.iteminfo.def_index == 1355 && Object.values(item.stickers).length > 0 ? Object.values(item.stickers)[0].set_name ?? Object.values(item.stickers)[0].crate_name : item.set_name ?? item.crate_name)?.replace(/( Autograph Capsule)$/, " Autographs").replace(/( Capsule)$/, "");
        item.collection = item.collection_name?.replace(/^(The )/, "").replace(/( Collection)$/, "").replace(/^(Operation )/, "").replace(/( Autographs)$/, "");
        item.rarity = item.collection || item.iteminfo.rarity > 1 ? item.iteminfo.rarity : void 0;
        item.seed = item.attributes["set item texture seed"] ? Math.floor(item.attributes["set item texture seed"]) : item.attributes["keychain slot 0 seed"];
        if (item.iteminfo.quality == 8) {
          item.quality = 4;
        } else if (item.iteminfo.quality == 3) {
          item.quality = 5 + Number(item.stattrak === true);
        } else if (item.iteminfo.quality == 12) {
          item.quality = 1;
        } else if (item.iteminfo.quality == 13) {
          item.quality = 3;
        } else {
          item.quality = Number(item.stattrak === true) * 2;
        }
        if (item.casket_id) {
          item.casket_name = this.items.find((x) => x.iteminfo.id == item.casket_id)?.attributes["custom name attr"] ?? item.casket_id;
        }
        if (item.stickers) {
          for (const sticker of Object.values(item.stickers)) {
            if (Icons.URLs[sticker.full_name] || Icons.URLs[sticker.full_name] === null) {
              continue;
            }
            commodityMarketItemsToGetIconsFor.add(sticker.full_name);
          }
        }
        if (item.keychains) {
          for (const keychain of Object.values(item.keychains)) {
            if (Icons.URLs[keychain.full_name] || Icons.URLs[keychain.full_name] === null) {
              continue;
            }
            marketItemsToGetIconsFor.add(keychain.full_name);
          }
        }
        if (!item.moveable || Icons.URLs[item.full_name] || Icons.URLs[item.full_name] === null) {
          continue;
        }
        if (item.commodity) {
          commodityMarketItemsToGetIconsFor.add(item.full_name);
        } else {
          marketItemsToGetIconsFor.add(item.full_name);
        }
      }
      await Icons.FetchMarketCommodityIcons(commodityMarketItemsToGetIconsFor, progressCallback);
      await Icons.FetchMarketIcons(/* @__PURE__ */ new Set([...marketItemsToGetIconsFor, ...commodityMarketItemsToGetIconsFor]), progressCallback);
    }
    async #OpenCrate(item) {
      if (item.iteminfo.def_index != 1201) {
        return;
      }
      const assetID = item.iteminfo.id;
      const attributes = item.attributes;
      const cache_id = `crate_${assetID}`;
      const cache = await Cache.GetValue(cache_id, null);
      if (cache) {
        if (this.loadedFromCache || cache.attributes["modification date"] >= attributes["modification date"] && cache.attributes["items count"] == attributes["items count"]) {
          return cache.items;
        }
      }
      if (this.loadedFromCache) {
        const error2 = new Error(`Failed to load crate ${assetID} from cache`);
        error2.OPERATION_ERROR = OPERATION_ERROR.INTERFACE_NOT_CONNECTED;
        throw error2;
      }
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const storedItems = await asf_default.Send("CS2Interface", `GetCrateContents/${assetID}`, "GET", script_default.Bot.ASF.BotName);
          if (!storedItems) {
            break;
          }
          const crate = {
            attributes,
            items: storedItems
          };
          Cache.SetValue(cache_id, crate);
          await Sleep(2e3);
          return storedItems;
        } catch (e) {
          script_default.ShowError({ level: ERROR_LEVEL.LOW }, e);
          if (e.code === 504) {
            script_default.ShowError({ level: ERROR_LEVEL.LOW }, new Error("Timed out while opening storage unit, reconnecting to interface"));
            if (!await script_default.RestartInterface({ showProgress: false, errorLevel: ERROR_LEVEL.LOW })) {
              break;
            }
          }
        }
      }
      const error = new Error(`Failed to open crate ${assetID}`);
      error.OPERATION_ERROR = OPERATION_ERROR.FAILED_TO_LOAD;
      throw error;
    }
    async StoreItem(asset, crateAsset) {
      const result = await asf_default.Send("CS2Interface", `StoreItem/${crateAsset.iteminfo.id}/${asset.iteminfo.id}`, "GET", script_default.Bot.ASF.BotName);
      if (result.Success) {
        const casket_cache_id = `crate_${crateAsset.iteminfo.id}`;
        const casket_cache = await Cache.GetValue(casket_cache_id, null);
        const inventory_cache_id = `inventory_${unsafeWindow.g_steamID}`;
        const inventory_cache = await Cache.GetValue(inventory_cache_id, null);
        if (!casket_cache || !inventory_cache) {
          return;
        }
        asset.casket_id = crateAsset.iteminfo.id;
        casket_cache.items.push(asset);
        casket_cache.items.sort((a, b) => b.iteminfo.id - a.iteminfo.id);
        casket_cache.attributes["items count"]++;
        casket_cache.attributes["modification date"] = Math.floor(Date.now() / 1e3);
        Cache.SetValue(casket_cache_id, casket_cache);
        const index = inventory_cache.findIndex((obj) => obj.iteminfo.id === asset.iteminfo.id);
        inventory_cache.splice(index, 1);
        Cache.SetValue(inventory_cache_id, inventory_cache);
      }
    }
    async RetrieveItem(asset) {
      const result = await asf_default.Send("CS2Interface", `RetrieveItem/${asset.casket_id}/${asset.iteminfo.id}`, "GET", script_default.Bot.ASF.BotName);
      if (result.Success) {
        const casket_cache_id = `crate_${asset.casket_id}`;
        const casket_cache = await Cache.GetValue(casket_cache_id, null);
        const inventory_cache_id = `inventory_${unsafeWindow.g_steamID}`;
        const inventory_cache = await Cache.GetValue(inventory_cache_id, null);
        if (!casket_cache || !inventory_cache) {
          return;
        }
        const index = casket_cache.items.findIndex((obj) => obj.iteminfo.id === asset.iteminfo.id);
        casket_cache.items.splice(index, 1);
        casket_cache.attributes["items count"]--;
        casket_cache.attributes["modification date"] = Math.floor(Date.now() / 1e3);
        Cache.SetValue(casket_cache_id, casket_cache);
        delete asset.casket_id;
        inventory_cache.push(asset);
        inventory_cache.sort((a, b) => b.iteminfo.id - a.iteminfo.id);
        Cache.SetValue(inventory_cache_id, inventory_cache);
      }
    }
    async LabelStorageUnit(casket, name) {
      const result = await asf_default.Send("CS2Interface", `NameItem`, "GET", script_default.Bot.ASF.BotName, { itemID: casket.iteminfo.id, name });
      if (result.Success) {
        const casket_cache_id = `crate_${casket.iteminfo.id}`;
        const casket_cache = await Cache.GetValue(casket_cache_id, null);
        if (!casket_cache) {
          return;
        }
        casket_cache.attributes["modification date"] = Math.floor(Date.now() / 1e3);
        Cache.SetValue(casket_cache_id, casket_cache);
      }
    }
  };

  // src/components/popup.js
  var Popup = class _Popup {
    static #numPopups = 0;
    #popoverMode;
    #onopen;
    #onclose;
    #fade;
    #popupContainer;
    #background;
    #visible = false;
    constructor(options) {
      this.#popoverMode = options.popoverMode ?? false;
      this.#onopen = options.onopen ?? false;
      this.#onclose = options.onclose ?? false;
      this.#fade = options.fade ?? true;
      _Popup.#numPopups++;
      const title = CreateElement("div", {
        class: "cs2s_popup_title",
        text: options.title ?? "",
        children: options.titleChildren ?? []
      });
      const simpleMode = options.simpleMode ?? false;
      const disableClose = options.disableClose ?? false;
      const closeButton = !simpleMode && CreateElement("div", {
        class: "cs2s_popup_close_button",
        onclick: () => {
          this.Hide();
        }
      });
      const popupBody = CreateElement("div", {
        class: `cs2s_popup_body`,
        children: [
          !disableClose && closeButton,
          title,
          ...options.body ?? []
        ]
      });
      if (simpleMode) {
        popupBody.classList.add("cs2s_popup_body_simple");
      }
      if (this.#popoverMode) {
        popupBody.classList.add("cs2s_popup_body_popover");
      }
      this.#background = CreateElement("div", {
        class: "cs2s_popup_background",
        style: {
          zIndex: 1e3 + _Popup.#numPopups
        }
      });
      this.#popupContainer = CreateElement("div", {
        class: "cs2s_popup_container",
        style: {
          zIndex: 1e3 + _Popup.#numPopups
        },
        children: [
          popupBody
        ]
      });
      if (!disableClose) {
        this.#popupContainer.addEventListener("dblclick", (event) => {
          const box = popupBody.getBoundingClientRect();
          const style = getComputedStyle(popupBody);
          if (event.clientY < box.top || event.clientX < box.left || event.clientY > box.bottom + parseInt(style.marginBottom) || event.clientX > box.right) {
            this.Hide();
          }
        });
        document.addEventListener("keydown", (event) => {
          if (!this.#visible) {
            return;
          }
          if (event.key === "Escape") {
            event.preventDefault();
            this.Hide();
          }
        });
      }
    }
    Show() {
      if (this.#visible) {
        return;
      }
      this.#visible = true;
      if (typeof this.#onopen === "function") {
        this.#onopen();
      }
      unsafeWindow.document.body.append(this.#background, this.#popupContainer);
      if (!this.#popoverMode) {
        if (this.#fade) {
          Fade(this.#background, {
            from: 0,
            to: getComputedStyle(this.#background).opacity
          });
        }
        unsafeWindow.document.body.classList.add("cs2s_popup_opened");
      }
    }
    Hide() {
      if (!this.#visible) {
        return;
      }
      this.#visible = false;
      if (typeof this.#onclose === "function") {
        this.#onclose();
      }
      if (this.#fade) {
        Fade(this.#background, {
          from: getComputedStyle(this.#background).opacity,
          to: 0,
          onfinish: () => {
            this.#background.isConnected && this.#background.remove();
          }
        });
      } else {
        this.#background.isConnected && this.#background.remove();
      }
      this.#popupContainer.isConnected && this.#popupContainer.remove();
      if (!this.#popoverMode) {
        unsafeWindow.document.body.classList.remove("cs2s_popup_opened");
      }
    }
  };

  // src/cs2/items/store.js
  var Store = class {
    items;
    inventoryLoaded = false;
    inventoryLoadedFromCache;
    #storeData;
    #tournamentData;
    #walletCurrencyData = null;
    #walletCurrencyCode;
    #walletCountry;
    constructor(storeData, tournamentData) {
      this.items = [];
      this.#storeData = storeData;
      this.#tournamentData = tournamentData;
      this.#walletCountry = unsafeWindow.g_rgWalletInfo.wallet_country;
    }
    async LoadStoreContents(progressCallback) {
      let wallet_currency_id = unsafeWindow.g_rgWalletInfo.wallet_currency;
      if (!wallet_currency_id) {
        throw new Error(`Undefined wallet currency`);
      }
      for (const code in unsafeWindow.g_rgCurrencyData) {
        if (unsafeWindow.g_rgCurrencyData[code].eCurrencyCode == wallet_currency_id) {
          this.#walletCurrencyData = unsafeWindow.g_rgCurrencyData[code];
          this.#walletCurrencyCode = this.#walletCurrencyData.strCode;
          break;
        }
      }
      if (!this.#walletCurrencyData) {
        throw new Error(`Invalid wallet currency: ${wallet_currency_id}`);
      }
      if (!this.#storeData.price_sheet.currencies[this.#walletCurrencyCode]) {
        throw new Error(`Currency not supported by the Counter-Strike 2 store: ${this.#walletCurrencyCode}`);
      }
      await Icons.LoadCachedIcons();
      const storeItemsToGetIconsFor = {};
      const marketItemsToGetIconsFor = /* @__PURE__ */ new Set();
      const marketableCutoffTime = Date.now() / 1e3 - 8 * 24 * 60 * 60;
      const highlightSectionIDStart = this.#tournamentData?.tournamentinfo.sections[this.#tournamentData.tournamentinfo.sections.length - 3].sectionid;
      const highlightsReleased = !!Object.values(this.#storeData.price_sheet_items).find((item) => item.tournament_id && item.name_id.includes("_champions"));
      for (const key in this.#storeData.price_sheet.entries) {
        const entry = this.#storeData.price_sheet.entries[key];
        const item = this.#storeData.price_sheet_items[entry.item_link];
        const hash_name = this.#GetHashName(item);
        const type = item.loot_list?.[0]?.type_name ?? item.type_name;
        if (!Icons.URLs[hash_name]) {
          storeItemsToGetIconsFor[item.def_index] = hash_name;
        }
        if (!item.requires_supplemental_data) {
          this.items.push({
            id: item.def_index,
            name: item.item_name,
            name_normalized: item.item_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
            image_name: hash_name,
            hash_name,
            type,
            price: entry.sale_prices?.[this.#walletCurrencyCode] ?? entry.prices[this.#walletCurrencyCode],
            original_price: entry.prices[this.#walletCurrencyCode],
            discount: entry.sale_prices?.[this.#walletCurrencyCode] ? Math.round((1 - entry.sale_prices[this.#walletCurrencyCode] / entry.prices[this.#walletCurrencyCode]) * 100) : null,
            layout_format: this.#storeData.price_sheet.store_banner_layout[item.def_index]?.custom_format,
            layout_weight: this.#storeData.price_sheet.store_banner_layout[item.def_index]?.w,
            tournament_id: item.tournament_id,
            requires_supplemental_data: item.requires_supplemental_data
          });
        } else if (this.#tournamentData) {
          for (const match of this.#tournamentData.matches) {
            const map_name = TOURNAMENT_MAPS[match.roundstats_legacy.map_id];
            const stage_id = match.roundstats_legacy.reservation.tournament_event.event_stage_id;
            const section = this.#tournamentData.tournamentinfo.sections.find((section2) => section2.groups.find((group) => group.stage_ids.includes(stage_id)));
            const team_1 = match.roundstats_legacy.reservation.tournament_teams[0];
            const team_2 = match.roundstats_legacy.reservation.tournament_teams[1];
            const is_highlight = section.sectionid >= highlightSectionIDStart;
            const souvenir_hash_name = this.#GetHashName(item, map_name, is_highlight);
            const souvenir_non_highlight_hash_name = this.#GetHashName(item, map_name);
            if (is_highlight && !highlightsReleased) {
              continue;
            }
            if (souvenir_non_highlight_hash_name) {
              if (!Icons.URLs[souvenir_non_highlight_hash_name] && !marketItemsToGetIconsFor.has(souvenir_non_highlight_hash_name)) {
                if (match.matchtime < marketableCutoffTime) {
                  marketItemsToGetIconsFor.add(souvenir_non_highlight_hash_name);
                }
              }
            }
            this.items.push({
              id: item.def_index,
              supplemental_data: match.matchid,
              name: souvenir_hash_name,
              name_normalized: souvenir_hash_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
              image_name: hash_name,
              // A default image will be shown when we don't have the true image (because the item isn't on the market yet)
              alt_image_name: souvenir_non_highlight_hash_name,
              hash_name: souvenir_hash_name,
              type,
              price: entry.sale_prices?.[this.#walletCurrencyCode] ?? entry.prices[this.#walletCurrencyCode],
              original_price: entry.prices[this.#walletCurrencyCode],
              discount: entry.sale_prices?.[this.#walletCurrencyCode] ? Math.round((1 - entry.sale_prices[this.#walletCurrencyCode] / entry.prices[this.#walletCurrencyCode]) * 100) : null,
              layout_format: this.#storeData.price_sheet.store_banner_layout[item.def_index]?.custom_format,
              layout_weight: this.#storeData.price_sheet.store_banner_layout[item.def_index]?.w,
              tournament_id: item.tournament_id,
              requires_supplemental_data: item.requires_supplemental_data,
              stage_id,
              section_id: section.sectionid,
              section_name: section.name,
              team_1: team_1.team_name,
              team_1_id: team_1.team_id,
              team_1_score: match.roundstats_legacy.team_scores[0],
              team_2: team_2.team_name,
              team_2_id: team_2.team_id,
              team_2_score: match.roundstats_legacy.team_scores[1],
              teams_normalized: `${team_1.team_name} ${team_2.team_name}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
              match_result: match.roundstats_legacy.match_result
            });
          }
        }
      }
      await Icons.FetchStoreIcons(storeItemsToGetIconsFor, progressCallback);
      const commodityMarketItemsToGetIconsFor = /* @__PURE__ */ new Set();
      for (const hash_name of Object.values(storeItemsToGetIconsFor)) {
        if (Icons.URLs[hash_name] == null) {
          commodityMarketItemsToGetIconsFor.add(hash_name);
        }
      }
      await Icons.FetchMarketCommodityIcons(commodityMarketItemsToGetIconsFor, progressCallback);
      await Icons.FetchMarketIcons(/* @__PURE__ */ new Set([...commodityMarketItemsToGetIconsFor, ...marketItemsToGetIconsFor]), progressCallback);
    }
    LoadInventory(inventory) {
      for (const item of this.items) {
        item.owned = [...inventory.items, ...inventory.storedItems].filter((x) => {
          if (x.iteminfo.def_index == item.id) {
            return true;
          }
          if (!item.requires_supplemental_data && item.hash_name && x.full_name == item.hash_name) {
            return true;
          }
          if (item.requires_supplemental_data && x.full_name == item.hash_name && x.attributes["tournament event stage id"] == item.stage_id && x.attributes["tournament event team0 id"] == item.team_1_id && x.attributes["tournament event team1 id"] == item.team_2_id) {
            return true;
          }
          return false;
        }).length;
      }
      this.inventoryLoaded = true;
      this.inventoryLoadedFromCache = inventory.loadedFromCache;
    }
    FormatCurrency(valueInCents) {
      let currencyFormat = (valueInCents / 100).toFixed(2);
      if (this.#walletCurrencyData.bWholeUnitsOnly) {
        currencyFormat = currencyFormat.replace(".00", "");
      }
      if (this.#walletCurrencyData.strDecimalSymbol != ".") {
        currencyFormat = currencyFormat.replace(".", this.#walletCurrencyData.strDecimalSymbol);
      }
      var currencyReturn = this.#walletCurrencyData.bSymbolIsPrefix ? this.#walletCurrencyData.strSymbol + this.#walletCurrencyData.strSymbolAndNumberSeparator + currencyFormat : currencyFormat + this.#walletCurrencyData.strSymbolAndNumberSeparator + this.#walletCurrencyData.strSymbol;
      if (this.#walletCurrencyCode == "USD" && typeof this.#walletCountry != "undefined" && this.#walletCountry != "US") {
        return currencyReturn + " USD";
      } else if (this.#walletCurrencyCode == "EUR") {
        return currencyReturn.replace(",00", ",--");
      } else {
        return currencyReturn;
      }
    }
    // Get market hash name for item (if the item exists on the market)
    #GetHashName(item, mapName = null, isHighlight = false) {
      if (item.loot_list?.[0]?.full_name) {
        return item.loot_list?.[0]?.full_name;
      }
      if (item.tournament_id && !item.requires_supplemental_data) {
        return item.item_name;
      }
      if (item.requires_supplemental_data && mapName) {
        let hash_name = item.item_name;
        hash_name = hash_name.replace("Souvenir Package", `${mapName} Souvenir Package`);
        if (isHighlight) {
          hash_name = hash_name.replace("Souvenir Package", "Souvenir Highlight Package");
        }
        return hash_name;
      }
      return item.item_name;
    }
    async InitializePurchase(item, quantity) {
      const params = {
        itemID: item.id,
        quantity,
        cost: item.price * quantity
      };
      if (item.supplemental_data) {
        params.supplementalData = item.supplemental_data;
      }
      const result = await asf_default.Send("CS2Interface", `InitializePurchase`, "GET", script_default.Bot.ASF.BotName, params);
      if (!result.PurchaseUrl) {
        throw new Error(`Failed to get purchase URL`);
      }
      return result.PurchaseUrl;
    }
  };

  // src/core/script.js
  var OPERATION_ERROR = {
    INTERFACE_NOT_CONNECTED: 0,
    FAILED_TO_LOAD: 1
  };
  var ERROR_LEVEL = {
    HIGH: 0,
    // Popup notification
    MEDIUM: 1,
    // Navigation menu glow
    LOW: 2
    // Log error only
  };
  var Script = class _Script {
    static MIN_PLUGIN_VERSION = "1.2.0.1";
    Bot;
    AccountsConnected = 0;
    #inventory = null;
    #store = null;
    #statusUpdateListeners = [];
    #navigationButton;
    #navigationStatus;
    #navigationMenu;
    #errorTableBody;
    constructor() {
      const globalNavigation = unsafeWindow.document.getElementById(`account_dropdown`);
      if (!globalNavigation) {
        return;
      }
      this.#navigationStatus = CreateElement("span", {
        class: "account_name",
        text: "???"
      });
      this.#navigationButton = CreateElement("span", {
        class: "popup_menu_item cs2s_navigation_popup_menu_item",
        onmouseenter: () => {
          this.#ShowNavigationMenu();
        },
        onmouseleave: () => {
          this.#HideNavigationMenu();
        },
        children: [
          CreateElement("span", {
            html: (
              /*html*/
              `
					<span class="cs2s_navigation_icon">
						<svg
							width="173.27321"
							height="42.757812"
							viewBox="0 0 173.27321 42.757812"
							fill="currentColor"
							preserveAspectRatio="xMinYMin">
							<path
								d="m 79.808179,0 c -6.1207,1e-7 -11.646256,3.6370293 -14.035156,9.2363278 l -1.595704,3.7402352 -1.140625,2.667969 c -2.1334,4.9951 1.555679,10.533203 7.017579,10.533203 h 2.800781 22.875 l -2.935547,6.835937 H 58.10896 c -1.5238,0 -2.898,0.901969 -3.5,2.292969 l -3.222656,7.451172 h 39.164062 c 6.105704,0 11.625494,-3.621172 14.021494,-9.201172 l 2.87109,-6.683594 c 2.147,-4.9966 -1.54372,-10.548828 -7.01172,-10.548828 H 74.780835 l 1.884766,-4.402344 -4.792969,-2.3105472 h 40.464848 c 1.528,0 2.91081,-0.906287 3.50781,-2.304687 L 118.97029,0 Z M 24.497632,0.00195 C 18.410132,4.7e-4 12.905279,3.5995237 10.495679,9.1542936 L 0.6167727,32.216794 c -2.139226,4.9966 1.5490919,10.541016 7.0136719,10.541016 H 39.798413 c 1.5267,0 2.904906,-0.905381 3.503906,-2.300781 l 3.197266,-7.441404 H 12.644116 L 21.696851,11.923828 16.780835,9.6152348 h 37.253906 c 1.5267,0 2.904907,-0.905482 3.503906,-2.300782 L 60.679273,0.0058594 Z M 127.8824,0.00976 123.79451,9.6191351 h 37.17188 l -2.85157,6.7109369 h -27.21289 c -6.0365,0 -11.49792,3.620914 -13.86914,9.197266 l -0.0742,0.175781 -7.24804,17.052735 h 49.26758 l 1.89843,-4.466797 v -0.002 l 0.0742,-0.173828 v -0.01367 c 0.88057,-2.42168 -0.94013,-5.083985 -3.54101,-5.083985 h -31.46289 l 2.90625,-6.835937 h 32.1914 0.15039 0.01 c 2.95431,-0.06268 5.61224,-1.859402 6.77539,-4.597656 l 0.0742,-0.175782 4.61328,-10.851562 C 174.77935,5.5862411 171.10481,0.0097657 165.73201,0.0097657 Z" />
						</svg>
					</span>
				`
            )
          }),
          "CS2Script: ",
          this.#navigationStatus
        ]
      });
      globalNavigation.children[0].append(this.#navigationButton);
      GM_registerMenuCommand("Set ASF IPC Password", () => {
        const password = prompt("Enter ASF IPC Password", GetSetting(SETTING_ASF_PASSWORD));
        if (password !== null) {
          SetSetting(SETTING_ASF_PASSWORD, password);
          window.location.reload();
        }
      });
    }
    async #UpdateConnectionStatus() {
      try {
        const status = await asf_default.GetBot();
        if (this.Bot) {
          const oldBot = this.Bot;
          this.Bot = status[this.Bot.ASF.BotName];
          for (const listener of this.#statusUpdateListeners) {
            listener(this.Bot, oldBot);
          }
        }
        const currentAccountConnected = this.Bot && status[this.Bot.ASF.BotName].Plugin?.Connected;
        const numOtherAccountsConnected = Object.values(status).filter((x) => x.Plugin?.Connected).length - currentAccountConnected;
        const numOtherAccounts = Object.values(status).length - Number(this.Bot !== null);
        this.AccountsConnected = currentAccountConnected ? numOtherAccountsConnected + 1 : numOtherAccountsConnected;
        if (!this.#navigationStatus.tooltip) {
          this.#navigationStatus.tooltip = BindTooltip(this.#navigationStatus, "");
        }
        this.#navigationStatus.innerText = currentAccountConnected ? "1" : "0";
        this.#navigationStatus.tooltip.innerHTML = "Interface status for this account: ";
        if (currentAccountConnected) {
          this.#navigationStatus.tooltip.innerHTML += "<strong>Connected</strong>";
        } else {
          this.#navigationStatus.tooltip.innerHTML += "<strong>Not Connected</strong>";
        }
        if (numOtherAccounts > 0) {
          this.#navigationStatus.innerText += ` + ${numOtherAccountsConnected}`;
          this.#navigationStatus.tooltip.innerHTML += `<br>Interface is connected on <strong>${numOtherAccountsConnected}/${numOtherAccounts}</strong> other accounts`;
        }
      } catch (e) {
        this.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
      }
    }
    AddStatusUpdateListener(listener) {
      this.#statusUpdateListeners.push(listener);
    }
    RemoveStatusUpdateListener(listener) {
      this.#statusUpdateListeners = this.#statusUpdateListeners.filter((x) => x !== listener);
    }
    #ShowNavigationMenu(fade = true) {
      if (this.#navigationMenu && this.#navigationMenu.isConnected) {
        if (this.#navigationMenu.fade) {
          this.#navigationMenu.fade.cancel();
          this.#navigationMenu.fade = null;
        }
        Fade(this.#navigationMenu, {
          to: 1,
          duration: 200
        });
        return;
      }
      const errorButton = CreateElement("a", {
        class: "popup_menu_item",
        text: "View Errors",
        onclick: () => {
          unsafeWindow.document.body.click();
          this.ShowErrors();
        }
      });
      if (this.#navigationButton.classList.contains("cs2s_navigation_status_error_glow")) {
        errorButton.classList.add("cs2s_navigation_status_error_glow");
      }
      const botConnected = this.Bot?.Plugin?.Connected;
      const interfaceToggleButton = CreateElement("a", {
        class: "popup_menu_item",
        text: !botConnected ? "Start Interface" : "Stop Interface",
        onclick: () => {
          unsafeWindow.document.body.click();
          if (!botConnected) {
            this.StartInterface();
          } else {
            this.StopInterface();
          }
        }
      });
      const settingsButton = CreateElement("a", {
        class: "popup_menu_item",
        text: "Settings",
        onclick: () => {
          unsafeWindow.document.body.click();
          this.ShowSettings();
        }
      });
      this.#navigationMenu = CreateElement("div", {
        class: "popup_block_new",
        children: [
          CreateElement("div", {
            class: "popup_body popup_menu",
            children: [
              interfaceToggleButton,
              settingsButton,
              this.#errorTableBody && errorButton
            ]
          })
        ]
      });
      this.#navigationButton.append(this.#navigationMenu);
      this.#navigationMenu.style.top = `${this.#navigationButton.offsetTop}px`;
      this.#navigationMenu.style.left = `-${this.#navigationMenu.offsetWidth}px`;
      if (fade) {
        Fade(this.#navigationMenu, {
          from: 0,
          to: 1,
          duration: 200
        });
      }
    }
    #HideNavigationMenu() {
      if (!this.#navigationMenu) {
        return;
      }
      this.#navigationMenu.fade = Fade(this.#navigationMenu, {
        to: 0,
        duration: 200,
        onfinish: () => {
          this.#navigationMenu.isConnected && this.#navigationMenu.remove();
        }
      });
    }
    async VerifyConnection() {
      try {
        await asf_default.GetBot(null, false);
      } catch (e) {
        this.ShowError({ level: ERROR_LEVEL.MEDIUM }, e, new Error('ArchiSteamFarm is not running or cannot be reached. Please verify that ASF is running. Under "Settings", verify that your ASF server, port, and password settings are all correct.'));
        return false;
      }
      try {
        await asf_default.GetPluginStatus();
      } catch (e) {
        this.ShowError({ level: ERROR_LEVEL.MEDIUM }, e, new Error("CS2 Interface plugin is not installed"));
        return false;
      }
      try {
        const bot = await asf_default.GetBot(unsafeWindow.g_steamID);
        if (!bot) {
          throw new Error("ASF bot for this account was not found. If ASF was recently started, please wait until your bots come online and then reload the page.");
        }
        if (CompareVersions(_Script.MIN_PLUGIN_VERSION, bot.Plugin.Version ?? "0") > 0) {
          this.ShowError({ level: ERROR_LEVEL.MEDIUM }, new Error(`CS2 Interface plugin is outdated, please update to version ${_Script.MIN_PLUGIN_VERSION} or newer`));
        }
        this.Bot = bot;
      } catch (e) {
        this.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
        return false;
      }
      this.#UpdateConnectionStatus();
      setInterval(() => {
        if (unsafeWindow.document.visibilityState === "hidden") {
          return;
        }
        this.#UpdateConnectionStatus();
      }, 1e3);
      return true;
    }
    ShowMessage(options, ...messages) {
      const popup = new Popup({
        title: options.title ?? "Counter-Strike 2 Script Message",
        simpleMode: true,
        popoverMode: true,
        fade: false,
        body: [
          CreateElement("div", {
            class: "cs2s_action_body",
            children: [
              CreateElement("div", {
                class: "cs2s_action_message_tall cs2s_action_multi_message",
                children: [
                  ...messages.map(
                    (message) => CreateElement("div", {
                      class: "cs2s_action_message",
                      text: message
                    })
                  )
                ]
              }),
              CreateElement("div", {
                class: "cs2s_action_buttons",
                children: [
                  CreateElement("div", {
                    class: "cs2s_grey_long_button",
                    text: "Close",
                    onclick: () => {
                      popup.Hide();
                    }
                  })
                ]
              })
            ]
          })
        ]
      });
      popup.Show();
    }
    ShowError(options, ...errors) {
      if (!this.#errorTableBody) {
        this.#errorTableBody = CreateElement("tbody");
      }
      for (const error of errors) {
        console.log(error);
        this.#errorTableBody.prepend(
          CreateElement("tr", {
            children: [
              CreateElement("td", {
                text: (/* @__PURE__ */ new Date()).toLocaleString()
              }),
              CreateElement("td", {
                text: options.level == ERROR_LEVEL.HIGH ? "High" : options.level == ERROR_LEVEL.MEDIUM ? "Medium" : "Low"
              }),
              CreateElement("td", {
                text: error.message
              })
            ]
          })
        );
      }
      if (this.#errorTableBody.isConnected) {
        return;
      }
      if (options.level === ERROR_LEVEL.HIGH) {
        this.ShowMessage({ title: "Counter-Strike 2 Script Error" }, ...errors.map((error) => error.message));
      } else if (options.level === ERROR_LEVEL.MEDIUM) {
        const globalNavigationButton = unsafeWindow.document.getElementById(`account_pulldown`);
        this.#navigationButton.classList.add("cs2s_navigation_status_error_glow");
        globalNavigationButton && globalNavigationButton.classList.add("cs2s_navigation_status_error_pulse");
      }
    }
    ShowErrors() {
      const globalNavigationButton = unsafeWindow.document.getElementById(`account_pulldown`);
      this.#navigationButton.classList.remove("cs2s_navigation_status_error_glow");
      globalNavigationButton && globalNavigationButton.classList.remove("cs2s_navigation_status_error_pulse");
      const popup = new Popup({
        title: "Counter-Strike 2 Script Errors",
        body: [
          CreateElement("div", {
            text: "More detailed information can be found in your browser's developer console",
            style: {
              padding: "0px 0px 16px 16px",
              fontStyle: "italic"
            }
          }),
          CreateElement("div", {
            class: "cs2s_table_container cs2s_error_table_container",
            children: [
              CreateElement("table", {
                class: "cs2s_table",
                children: [
                  CreateElement("thead", {
                    children: [
                      CreateElement("tr", {
                        children: [
                          CreateElement("th", {
                            text: "Time"
                          }),
                          CreateElement("th", {
                            text: "Severity"
                          }),
                          CreateElement("th", {
                            text: "Error"
                          })
                        ]
                      })
                    ]
                  }),
                  this.#errorTableBody
                ]
              })
            ]
          })
        ]
      });
      popup.Show();
    }
    ShowSettings() {
      const form = CreateElement("form", {
        class: "cs2s_settings_form",
        html: (
          /*html*/
          `
				<div class="cs2s_settings_form_group_title">
					ASF Settings
				</div>
				<div class="cs2s_settings_form_group">
					<div class="cs2s_settings_form_group_item">
						<label for="${SETTING_ASF_SERVER}">
							ASF Server
						</label>
						<input type="text" name="${SETTING_ASF_SERVER}" placeholder="${DEFAULT_SETTINGS[SETTING_ASF_SERVER]}" value="${GetSetting(SETTING_ASF_SERVER)}">
					</div>
					<div class="cs2s_settings_form_group_item">
						<label for="${SETTING_ASF_PORT}">
							ASF Port
						</label>
						<input type="number" name="${SETTING_ASF_PORT}" placeholder="${DEFAULT_SETTINGS[SETTING_ASF_PORT]}" min="0" value="${GetSetting(SETTING_ASF_PORT)}">
					</div>
					<div class="cs2s_settings_form_group_item">
						<label>
							ASF IPC Password
						</label>
						<div class="cs2s_settings_form_message">
							This setting can be configured from your userscript manager's popup menu, found in your browser's extensions toolbar
						</div>
					</div>
				</div>

				<div class="cs2s_settings_form_group_title">
					Script Features
				</div>
				<div class="cs2s_settings_form_group">
					<div class="cs2s_settings_form_group_item cs2s_settings_form_group_item_checkbox">
						<input type="checkbox" name="${SETTING_INSPECT_ITEMS}" id="${SETTING_INSPECT_ITEMS}" ${GetSetting(SETTING_INSPECT_ITEMS) ? "checked" : ""}>							
						<label for="${SETTING_INSPECT_ITEMS}">
							Inspect Items
						</label>
					</div>
				</div>

				<div class="cs2s_settings_form_group_title">
					Script Settings
				</div>
				<div class="cs2s_settings_form_group">
					<div class="cs2s_settings_form_group_item">
						<label for="${SETTING_INTERFACE_AUTOSTOP_MINUTES}">
							Auto-stop interface if inactive for (minutes; 0 = never auto-stop${this.Bot?.Plugin?.Connected ? "; changes will apply on next start" : ""})
						</label>
						<input type="number" name="${SETTING_INTERFACE_AUTOSTOP_MINUTES}" placeholder="${DEFAULT_SETTINGS[SETTING_INTERFACE_AUTOSTOP_MINUTES]}" min="0" value="${GetSetting(SETTING_INTERFACE_AUTOSTOP_MINUTES)}">
					</div>
					<div class="cs2s_settings_form_group_item">
						<label for="${SETTING_INSPECT_CACHE_TIME_HOURS}">
							Re-inspect items after (hours; -1 = never re-inspect)
						</label>
						<input type="number" name="${SETTING_INSPECT_CACHE_TIME_HOURS}" placeholder="${DEFAULT_SETTINGS[SETTING_INSPECT_CACHE_TIME_HOURS]}" min="-1" value="${GetSetting(SETTING_INSPECT_CACHE_TIME_HOURS)}">
					</div>
				</div>
				
				<div class="cs2s_settings_form_submit_group">
					<button class="cs2s_blue_long_button" type="submit">Save</button>
					<button class="cs2s_grey_long_button" id="form_cancel" type="button">Cancel</button>
				</div>
			`
        ),
        onsubmit: (event) => {
          event.preventDefault();
          for (const element of event.target) {
            if (!element.name || !element.value && !element.placeholder) {
              continue;
            }
            const value = element.type === "checkbox" ? element.checked : element.value || element.placeholder;
            SetSetting(element.name, value);
          }
          window.location.reload();
        }
      });
      const popup = new Popup({
        title: "Counter-Strike 2 Script Settings",
        body: [form]
      });
      form.querySelector("#form_cancel").onclick = () => {
        popup.Hide();
      };
      popup.Show();
    }
    async StartInterface(options = {}) {
      const showProgress = options.showProgress ?? true;
      const errorLevel = options.errorLevel ?? ERROR_LEVEL.HIGH;
      if (!this.Bot) {
        this.ShowError({ level: errorLevel }, new Error("Cannot start interface. Check the error log for more information."));
        return false;
      }
      const loadingBody = CreateElement("div", {
        class: "cs2s_action_body",
        children: [
          CreateElement("div", {
            class: "cs2s_action_spinner"
          })
        ]
      });
      const successButton = CreateElement("div", {
        class: "cs2s_blue_long_button",
        text: "OK"
      });
      const successBody = CreateElement("div", {
        class: "cs2s_action_body",
        children: [
          CreateElement("div", {
            class: "cs2s_action_message cs2s_action_message_tall",
            text: "Interface successfully started"
          }),
          successButton
        ]
      });
      let interfaceStarted = false;
      const popup = new Popup({
        simpleMode: true,
        disableClose: true,
        popoverMode: options.popoverMode ?? false,
        fade: false,
        title: "Starting Interface",
        body: [
          loadingBody,
          successBody
        ],
        onopen: options.onopen,
        onclose: () => {
          if (typeof options.onclose === "function") {
            options.onclose();
          }
          if (interfaceStarted) {
            if (typeof options.onconnected === "function") {
              options.onconnected();
              return interfaceStarted;
            }
            window.location.reload();
          }
        }
      });
      successBody.hide();
      successButton.onclick = () => {
        popup.Hide();
      };
      if (showProgress) {
        popup.Show();
      }
      try {
        const response = await asf_default.Send("CS2Interface", `Start`, "GET", this.Bot.ASF.BotName, { autoStop: GetSetting(SETTING_INTERFACE_AUTOSTOP_MINUTES) });
        if (!response || !response[this.Bot.ASF.BotName]?.Success) {
          popup.Hide();
          this.ShowError({ level: errorLevel }, new Error("Interface failed to start"));
          return interfaceStarted;
        }
        let status = await asf_default.GetPluginStatus(this.Bot.ASF.BotName);
        while (status && status.Connected && !status.InventoryLoaded) {
          await Sleep(1e3);
          status = await asf_default.GetPluginStatus(this.Bot.ASF.BotName);
        }
        if (!status || !status.Connected || !status.InventoryLoaded) {
          popup.Hide();
          this.ShowError({ level: errorLevel }, new Error("Interface failed to start: Interface stopped while waiting for inventory to loaded"));
          return interfaceStarted;
        }
      } catch (e) {
        popup.Hide();
        this.ShowError({ level: errorLevel }, new Error(e.response?.Result?.[this.Bot.ASF.BotName]?.Message ?? e.message));
        return interfaceStarted;
      }
      interfaceStarted = true;
      if (options.autoClose) {
        popup.Hide();
        return interfaceStarted;
      }
      loadingBody.hide();
      successBody.show();
      return interfaceStarted;
    }
    async StopInterface(options = {}) {
      const showProgress = options.showProgress ?? true;
      const errorLevel = options.errorLevel ?? ERROR_LEVEL.HIGH;
      const loadingBody = CreateElement("div", {
        class: "cs2s_action_body",
        children: [
          CreateElement("div", {
            class: "cs2s_action_spinner"
          })
        ]
      });
      const successButton = CreateElement("div", {
        class: "cs2s_blue_long_button",
        text: "OK"
      });
      const successBody = CreateElement("div", {
        class: "cs2s_action_body",
        children: [
          CreateElement("div", {
            class: "cs2s_action_message cs2s_action_message_tall",
            text: "Interface successfully stopped"
          }),
          successButton
        ]
      });
      let interfaceStopped = false;
      const popup = new Popup({
        simpleMode: true,
        title: "Stopping Interface",
        body: [
          loadingBody,
          successBody
        ],
        onclose: () => {
          if (interfaceStopped) {
            window.location.reload();
          }
        }
      });
      successBody.hide();
      successButton.onclick = () => {
        popup.Hide();
      };
      if (showProgress) {
        popup.Show();
      }
      try {
        const response = await asf_default.Send("CS2Interface", `Stop`, "GET", this.Bot.ASF.BotName);
        if (!response || !response[this.Bot.ASF.BotName]?.Success) {
          popup.Hide();
          this.ShowError({ level: errorLevel }, new Error("Interface failed to stop"));
          return interfaceStopped;
        }
      } catch (e) {
        popup.Hide();
        this.ShowError({ level: errorLevel }, e);
        return interfaceStopped;
      }
      interfaceStopped = true;
      loadingBody.hide();
      successBody.show();
      return interfaceStopped;
    }
    async RestartInterface(options = {}) {
      return await this.StopInterface(options) && await this.StartInterface(options);
    }
    ShowStartInterfacePrompt(options = {}) {
      const popup = new Popup({
        title: "Start Interface?",
        simpleMode: true,
        popoverMode: options.popoverMode ?? false,
        onopen: options.onopen,
        onclose: options.onclose,
        fade: options.fade,
        body: [
          CreateElement("div", {
            class: "cs2s_action_body",
            children: [
              CreateElement("div", {
                class: "cs2s_action_message cs2s_action_message_tall",
                text: options.message ?? "Start the interface?"
              }),
              CreateElement("div", {
                class: "cs2s_action_buttons",
                children: [
                  CreateElement("div", {
                    class: "cs2s_blue_long_button",
                    text: "Start Interface",
                    onclick: () => {
                      popup.Hide();
                      this.StartInterface(options);
                    }
                  }),
                  CreateElement("div", {
                    class: "cs2s_grey_long_button",
                    text: "Cancel",
                    onclick: () => {
                      popup.Hide();
                    }
                  })
                ]
              })
            ]
          })
        ]
      });
      popup.Show();
    }
    async GetInventory(options = {}) {
      if (this.#inventory === null) {
        const progressMessage = CreateElement("div", {
          class: "cs2s_action_message"
        });
        const progressBar = CreateElement("div", {
          class: "cs2s_action_progress_bar",
          vars: {
            "percentage": "0%"
          }
        });
        const progressCallback = (message, progress) => {
          progressMessage.innerText = message;
          progressBar.style.setProperty("--percentage", `${(progress * 100).toFixed(0)}%`);
        };
        this.GetInventory.closeButton = CreateElement("div", {
          class: "cs2s_grey_long_button",
          text: "Close"
        });
        this.GetInventory.progressBody = CreateElement("div", {
          class: "cs2s_action_body",
          children: [
            progressMessage,
            progressBar,
            this.GetInventory.closeButton
          ]
        });
        this.#inventory = CreateCachedAsyncFunction(async () => {
          const cache_id = `inventory_${unsafeWindow.g_steamID}`;
          const cache = await Cache.GetValue(cache_id, null);
          let inventory;
          if (this.Bot) {
            try {
              let status = await asf_default.GetPluginStatus(this.Bot.ASF.BotName);
              if (status && status.Connected && status.InventoryLoaded) {
                if (!status.InventoryLoaded) {
                  progressCallback("Waiting for inventory to load", 0);
                  do {
                    await Sleep(1e3);
                    status = await asf_default.GetPluginStatus(this.Bot.ASF.BotName);
                  } while (status && status.Connected && !status.InventoryLoaded);
                  progressCallback("Waiting for inventory to load", 1);
                }
                if (status && status.Connected && status.InventoryLoaded) {
                  progressCallback("Fetching inventory items", 0);
                  const itemList = await asf_default.Send("CS2Interface", "Inventory", "GET", this.Bot.ASF.BotName);
                  progressCallback("Fetching inventory items", 1);
                  if (itemList) {
                    inventory = new Inventory(itemList);
                    Cache.SetValue(cache_id, itemList);
                  }
                }
              }
            } catch (e) {
              this.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
            }
          }
          if (!inventory) {
            if (!cache) {
              return OPERATION_ERROR.INTERFACE_NOT_CONNECTED;
            }
            inventory = new Inventory(cache, true);
          }
          try {
            await inventory.LoadCrateContents(progressCallback);
            return inventory;
          } catch (e) {
            this.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
            return e.OPERATION_ERROR ?? OPERATION_ERROR.FAILED_TO_LOAD;
          }
        });
      }
      let cancelled = false;
      const popup = new Popup({
        title: "Loading Inventory",
        body: [this.GetInventory.progressBody],
        simpleMode: true,
        onclose: () => {
          cancelled = true;
        }
      });
      this.GetInventory.closeButton.onclick = () => {
        popup.Hide();
      };
      const alreadyFinished = this.#inventory.willReturnImmediately();
      if (options.showProgress && !alreadyFinished) {
        popup.Show();
      }
      const result = await this.#inventory();
      if (cancelled || result === void 0) {
        return;
      }
      const success = result instanceof Inventory;
      if (options.showProgress && !alreadyFinished) {
        if (success) {
          await Sleep(500);
        }
        popup.Hide();
      }
      return await this.#inventory();
    }
    async GetStore(options = {}) {
      if (this.#store === null || this.#store.willReturnImmediately() && await this.#store() === OPERATION_ERROR.INTERFACE_NOT_CONNECTED) {
        const progressMessage = CreateElement("div", {
          class: "cs2s_action_message"
        });
        const progressBar = CreateElement("div", {
          class: "cs2s_action_progress_bar",
          vars: {
            "percentage": "0%"
          }
        });
        const progressCallback = (message, progress) => {
          progressMessage.innerText = message;
          progressBar.style.setProperty("--percentage", `${(progress * 100).toFixed(0)}%`);
        };
        this.GetStore.closeButton = CreateElement("div", {
          class: "cs2s_grey_long_button",
          text: "Close"
        });
        this.GetStore.progressBody = CreateElement("div", {
          class: "cs2s_action_body",
          children: [
            progressMessage,
            progressBar,
            this.GetStore.closeButton
          ]
        });
        this.#store = CreateCachedAsyncFunction(async () => {
          if (this.AccountsConnected == 0) {
            return OPERATION_ERROR.INTERFACE_NOT_CONNECTED;
          }
          let store;
          try {
            progressCallback("Fetching store items", 0);
            const storeData = await asf_default.Send("CS2Interface", "GetStoreData", "GET", "ASF");
            if (storeData) {
              let tournamentData = null;
              const item = Object.values(storeData.price_sheet_items).find((item2) => item2.requires_supplemental_data);
              if (item && item.tournament_id) {
                progressCallback("Fetching store items", 0.5);
                tournamentData = await asf_default.Send("CS2Interface", `GetTournamentInfo/${item.tournament_id}`, "GET", "ASF");
              }
              store = new Store(storeData, tournamentData);
            }
            progressCallback("Fetching store items", 1);
          } catch (e) {
            this.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
          }
          if (!store) {
            return OPERATION_ERROR.FAILED_TO_LOAD;
          }
          const inventory = await this.GetInventory(options);
          try {
            await store.LoadStoreContents(progressCallback);
          } catch (e) {
            this.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
            return e.OPERATION_ERROR ?? OPERATION_ERROR.FAILED_TO_LOAD;
          }
          if (inventory instanceof Inventory) {
            store.LoadInventory(inventory);
          }
          return store;
        });
      }
      let cancelled = false;
      const popup = new Popup({
        title: "Loading Store",
        body: [this.GetStore.progressBody],
        simpleMode: true,
        onclose: () => {
          cancelled = true;
        }
      });
      this.GetStore.closeButton.onclick = () => {
        popup.Hide();
      };
      const alreadyFinished = this.#store.willReturnImmediately();
      if (options.showProgress && !alreadyFinished) {
        popup.Show();
      }
      const result = await this.#store();
      if (cancelled || result === void 0) {
        return;
      }
      const success = result instanceof Store;
      if (options.showProgress && !alreadyFinished) {
        if (success) {
          await Sleep(500);
        }
        popup.Hide();
      }
      return await this.#store();
    }
  };
  var instance = new Script();
  var script_default = instance;

  // src/css/style.css
  var style_default = `:root {
	--cs2s-wear-fn-color: #35cdff;
	--cs2s-wear-mw-color: #0bb52f;
	--cs2s-wear-ft-color: #e8c805;
	--cs2s-wear-ww-color: #e86f24;
	--cs2s-wear-bs-color: #ea2828;
	--cs2s-stattrak-color: #cf6a32;
	--cs2s-souvenir-color: #ffd700;
	--cs2s-highlight-color: #ffd7aa;
	--cs2s-rarity-7-color: #e4ae33;
	--cs2s-rarity-6-color: #eb4b4b;
	--cs2s-rarity-5-color: #d32ce6;
	--cs2s-rarity-4-color: #8847ff;
	--cs2s-rarity-3-color: #4b69ff;
	--cs2s-rarity-2-color: #5e98d9;
	--cs2s-rarity-1-color: #b0c3d9;
}

.cs2s_color_wear_fn { color: var(--cs2s-wear-fn-color) !important; }
.cs2s_color_wear_mw { color: var(--cs2s-wear-mw-color) !important; }
.cs2s_color_wear_ft { color: var(--cs2s-wear-ft-color) !important; }
.cs2s_color_wear_ww { color: var(--cs2s-wear-ww-color) !important; }
.cs2s_color_wear_bs { color: var(--cs2s-wear-bs-color) !important; }
.cs2s_color_rarity_7 { color: var(--cs2s-rarity-7-color) !important; }
.cs2s_color_rarity_6 { color: var(--cs2s-rarity-6-color) !important; }
.cs2s_color_rarity_5 { color: var(--cs2s-rarity-5-color) !important; }
.cs2s_color_rarity_4 { color: var(--cs2s-rarity-4-color) !important; }
.cs2s_color_rarity_3 { color: var(--cs2s-rarity-3-color) !important; }
.cs2s_color_rarity_2 { color: var(--cs2s-rarity-2-color) !important; }
.cs2s_color_rarity_1 { color: var(--cs2s-rarity-1-color) !important; }
.cs2s_color_quality_1 { color: var(--cs2s-souvenir-color) !important; }
.cs2s_color_quality_2 { color: var(--cs2s-stattrak-color) !important; }
.cs2s_color_quality_3  { color: var(--cs2s-highlight-color) !important; }

.cs2s_asset_wear {
	position: absolute;
	bottom: 1px;
	right: 1px;
	left: 1px;
	padding-right: 4px;
	text-align: right;
	text-overflow: ellipsis;
	font-size: 8pt;
	max-width: 100%;
	color: #b7becd;

	&::after {
		content: "";
		position: absolute;
		top: 0px;
		right: 0px;
		left: 0px;
		height: 6px;
		opacity: 85%;
	}

	&.cs2s_asset_wear_fn {
		color: color-mix(in srgb, var(--cs2s-wear-fn-color), #cdcdcd 66%);
		text-shadow: -3px -1px 10px var(--cs2s-wear-fn-color);
		background: repeating-linear-gradient(transparent, color-mix(in srgb, var(--cs2s-wear-fn-color), transparent 85%) 2px, transparent, color-mix(in srgb, var(--cs2s-wear-fn-color), transparent 85%) 2px);

		&::after {
			background: linear-gradient(180deg, color-mix(in srgb, var(--cs2s-wear-fn-color), transparent 40%), transparent);
		}
	}

	&.cs2s_asset_wear_mw {
		color: color-mix(in srgb, var(--cs2s-wear-mw-color), #cdcdcd 66%);
		text-shadow: -3px -1px 10px var(--cs2s-wear-mw-color);
		background: repeating-linear-gradient(transparent, color-mix(in srgb, var(--cs2s-wear-mw-color), transparent 85%) 2px, transparent, color-mix(in srgb, var(--cs2s-wear-mw-color), transparent 85%) 2px);

		&::after {
			background: linear-gradient(180deg, color-mix(in srgb, var(--cs2s-wear-mw-color), transparent 40%), transparent);
		}
	}
	&.cs2s_asset_wear_ft {
		color: color-mix(in srgb, var(--cs2s-wear-ft-color), #cdcdcd 66%);
		text-shadow: -3px -1px 10px var(--cs2s-wear-ft-color);
		background: repeating-linear-gradient(transparent, color-mix(in srgb, var(--cs2s-wear-ft-color), transparent 85%) 2px, transparent, color-mix(in srgb, var(--cs2s-wear-ft-color), transparent 85%) 2px);

		&::after {
			background: linear-gradient(180deg, color-mix(in srgb, var(--cs2s-wear-ft-color), transparent 40%), transparent);
		}
	}
	&.cs2s_asset_wear_ww {
		color: color-mix(in srgb, var(--cs2s-wear-ww-color), #cdcdcd 66%);
		text-shadow: -3px -1px 10px var(--cs2s-wear-ww-color);
		background: repeating-linear-gradient(transparent, color-mix(in srgb, var(--cs2s-wear-ww-color), transparent 85%) 2px, transparent, color-mix(in srgb, var(--cs2s-wear-ww-color), transparent 85%) 2px);

		&::after {
			background: linear-gradient(180deg, color-mix(in srgb, var(--cs2s-wear-ww-color), transparent 40%), transparent);
		}
	}
	&.cs2s_asset_wear_bs {
		color: color-mix(in srgb, var(--cs2s-wear-bs-color), #cdcdcd 66%);
		text-shadow: -3px -1px 10px var(--cs2s-wear-bs-color);
		background: repeating-linear-gradient(transparent, color-mix(in srgb, var(--cs2s-wear-bs-color), transparent 85%) 2px, transparent, color-mix(in srgb, var(--cs2s-wear-bs-color), transparent 85%) 2px);

		&::after {
			background: linear-gradient(180deg, color-mix(in srgb, var(--cs2s-wear-bs-color), transparent 40%), transparent);
		}
	}
}

.cs2s_asset_seed {
	position: absolute;
	top: 0px;
	right: 0px;
	padding-right: 4px;
	font-size: 8pt;
	max-width: 100%;
}

.cs2s_asset_rarity {
	position: absolute;
	top: 0px;
	left: 0px;
	bottom: 11px;
	right: 6px;
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 15px 20px 0 0;
	border-color: transparent;

	&::before, &::after {
		font-size: 8pt;
		font-weight: 500;
	}

	&::before {
		position: absolute;
		left: 4px;
		top: -15px;
		text-shadow: 0px 2px 4px #00000044;
	}

	&::after {
		position: absolute;
		top: -15px;
		left: 17px;
	}

	&.cs2s_asset_stattrak {
		&::after {
			color: var(--cs2s-stattrak-color) !important;
			content: "StatTrak";
		}
	}

	&.cs2s_asset_unusual {
		&::before {
			content: '\u2605' !important;
		}
	}

	&.cs2s_asset_souvenir {
		&::after {
			color: var(--cs2s-souvenir-color) !important;
			content: "Souvenir";
		}
	}

	&.cs2s_asset_rarity_7 {
		border-top-color: color-mix(in srgb, var(--cs2s-rarity-7-color), transparent 65%);

		&::before {
			content: '7';
			color: var(--cs2s-rarity-7-color);
		}
	}

	&.cs2s_asset_rarity_6 {
		border-top-color: color-mix(in srgb, var(--cs2s-rarity-6-color), transparent 65%);

		&::before {
			content: '6';
			color: var(--cs2s-rarity-6-color);
		}
	}

	&.cs2s_asset_rarity_5 {
		border-top-color: color-mix(in srgb, var(--cs2s-rarity-5-color), transparent 65%);

		&::before {
			content: '5';
			color: var(--cs2s-rarity-5-color);
		}
	}

	&.cs2s_asset_rarity_4 {
		border-top-color: color-mix(in srgb, var(--cs2s-rarity-4-color), transparent 65%);

		&::before {
			content: '4';
			color: var(--cs2s-rarity-4-color);
		}
	}

	&.cs2s_asset_rarity_3 {
		border-top-color: color-mix(in srgb, var(--cs2s-rarity-3-color), transparent 65%);

		&::before {
			content: '3';
			color: var(--cs2s-rarity-3-color);
		}
	}

	&.cs2s_asset_rarity_2 {
		border-top-color: color-mix(in srgb, var(--cs2s-rarity-2-color), transparent 65%);

		&::before {
			content: '2';
			color: var(--cs2s-rarity-2-color);
		}
	}

	&.cs2s_asset_rarity_1 {
		border-top-color: color-mix(in srgb, var(--cs2s-rarity-1-color), transparent 65%);

		&::before {
			content: '1';
			color: var(--cs2s-rarity-1-color);
		}
	}
}

.cs2s_asset_quantity {
	position: absolute;
	top: 0px;
	left: 0px;
	padding-left: 4px;
	font-size: 8pt;
	max-width: 100%;
}

.cs2s_asset_name {
	position: absolute;
	bottom: 0px;
	left: 0px;
	right: 0px;
	padding: 1px 4px 0px 4px;
	overflow: hidden;
	margin: 4px;
	border-radius: 2px;
	border-bottom: 2px solid #5f6a76;
	font-size: 9pt;
	max-width: 100%;
	color: #b7becd;
	text-shadow: 0px 2px 4px #000000bf;
	text-overflow: ellipsis;
	text-align: center;
	background: #505050bf;
	background-image: radial-gradient( #b7becd0d 1px, transparent 0);
	background-size: 4px 4px;
	background-position: -4px -3px;
}

.cs2s_asset_cosmetics {
	position: absolute;
	bottom: 14px;
	left: 0px;

	img {
		height: 19px;
		width: 25px !important;
		filter: drop-shadow(0px 0px 0px #1c1c23);
	}
	
	&:has(> :nth-child(2)):has(> :nth-child(-n+5):last-child) img:nth-child(n+2) {
		margin-left: -8px;
	}

	&:has(> :nth-child(6)) img:nth-child(n+2) {
		margin-left: -12px;
	}

	&.cs2s_asset_trade_protected {
		left: 28px;

		&:has(> :nth-child(2)):has(> :nth-child(-n+3):last-child) img:nth-child(n+2) {
			margin-left: -8px;
		}

		&:has(> :nth-child(4)):has(> :nth-child(-n+5):last-child) img:nth-child(n+2) {
			margin-left: -12px;
		}

		&:has(> :nth-child(5)):has(> :nth-child(-n+5):last-child) img:nth-child(n+2) {
			margin-left: -15px;
		}

		&:has(> :nth-child(6)) img:nth-child(n+2) {
			margin-left: -17px;
		}
	}
}

.cs2s_asset_sticker_wear, .cs2s_asset_charm_template {
	position: relative;
	display: inline-block;
	padding-bottom: 16px;

	&::before {
		position: absolute;
		bottom: 0px;
		left: 0px;
		right: 0px;
	}

	&.cs2s_asset_cosmetic_small {
		padding-bottom: 0px;
		top: -6px;

		&::before {
			bottom: -12px;
			font-size: 11px;
			text-align: center;
		}
	}
}

.cs2s_asset_sticker_wear::before {
	content: attr(wear) '%';
}

.cs2s_asset_charm_template::before {
	content: attr(template);
}

.cs2s_asset_wear_range {
	margin: 0px 0px 8px 4px;

	& > div {
		width: 50px;
		height: 4px;
		display: inline-block;
		position: relative;
		background: linear-gradient(360deg, rgb(50 50 50 / 40%), transparent);

		&:not(:last-child) {
			border-right: 1px solid #1d1d1dbf;
		}

		&.cs2s_asset_wear_range_left, &.cs2s_asset_wear_range_right, &.cs2s_asset_wear_range_empty  {
			background-color: #91919180 !important;
		}

		&.cs2s_asset_wear_range_left::before, &.cs2s_asset_wear_range_right::before {
			content: "";
			width: var(--wear-percentage);
			height: 100%;
			display: block;
			position: absolute;
			background: linear-gradient(360deg, rgb(50 50 50 / 40%), transparent);
		}

		&.cs2s_asset_wear_range_left::before {
			left: 0px;
		}
		&.cs2s_asset_wear_range_right::before {
			right: 0px;
		}

		&.cs2s_asset_wear_range_fn {
			border-radius: 4px 0px 0px 4px;
			background-color: var(--cs2s-wear-fn-color);

			&::before {
				background-color: var(--cs2s-wear-fn-color);
			}

			& .cs2s_asset_wear_range_low, .cs2s_asset_wear_range_high {
				background-color: var(--cs2s-wear-fn-color);
			}
		}

		&.cs2s_asset_wear_range_mw {
			background-color: var(--cs2s-wear-mw-color);

			&::before {
				background-color: var(--cs2s-wear-mw-color);
			}

			& .cs2s_asset_wear_range_low, .cs2s_asset_wear_range_high {
				background-color: var(--cs2s-wear-mw-color);
			}
		}

		&.cs2s_asset_wear_range_ft {
			background-color: var(--cs2s-wear-ft-color);

			&::before {
				background-color: var(--cs2s-wear-ft-color);
			}

			& .cs2s_asset_wear_range_low, .cs2s_asset_wear_range_high {
				background-color: var(--cs2s-wear-ft-color);
			}
		}

		&.cs2s_asset_wear_range_ww {
			background-color: var(--cs2s-wear-ww-color);

			&::before {
				background-color: var(--cs2s-wear-ww-color);
			}

			& .cs2s_asset_wear_range_low, .cs2s_asset_wear_range_high {
				background-color: var(--cs2s-wear-ww-color);
			}
		}

		&.cs2s_asset_wear_range_bs {
			border-radius: 0px 4px 4px 0px;
			background-color: var(--cs2s-wear-bs-color);

			&::before {
				background-color: var(--cs2s-wear-bs-color);
			}

			& .cs2s_asset_wear_range_low, .cs2s_asset_wear_range_high {
				background-color: var(--cs2s-wear-bs-color);
			}
		}
	}

	& .cs2s_asset_wear_range_low, .cs2s_asset_wear_range_high {
		position: absolute;
		top: -2px;
		bottom: -2px;
		width: 2px;

		&::before {
			content: attr(wear_value);
			position: absolute;
			bottom: 6px;
			left: -2px;
			font-size: 8pt;
		}
	}

	& .cs2s_asset_wear_range_low {
		right: var(--wear-percentage);
		transform: translate(50%, 0%);
	}

	& .cs2s_asset_wear_range_high {
		left: var(--wear-percentage);
		transform: translate(-50%, 0%);
	}

	& .cs2s_asset_wear_range_marker {
		position: absolute;
		top: 3px;
		left: var(--wear-percentage);
		transform: translate(-50%, 0%);
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0px 5px 5px 5px;
		border-color: transparent;
		border-bottom-color: white;
	}
}

.cs2s_descriptor_blue {
	color: #b0c3d9;
}

.cs2s_button_row {
	display: flex !important;
	flex-direction: row !important;
	flex-wrap: wrap;
	gap: 8px;
}

.cs2s_small_grey_button {
	background-color: #3d4450;
	color: #ffffff;
	height: 24px;
	padding: 0px 12px;
	border-radius: 2px;
	display: inline-flex;
	align-items: center;
	transition-property: opacity,background,color,box-shadow;
	transition-duration: .2s;
	transition-timing-function: ease-out;

	&:hover {
		background-color: #67707b;
	}
}

.cs2s_asset_rank_gold {
	background: linear-gradient( #ffe34b 50%, #ff8f00);
	background-clip: text;
	-webkit-text-fill-color: transparent;
	text-shadow: 1px 1px 10px #ffe34b40, 1px 1px 10px #ff8f0040;
	border-color: #ffe34b;
}

.cs2s_asset_rank_silver {
	background: linear-gradient( #ffffff 50%, #fdfdfd40);
	background-clip: text;
	-webkit-text-fill-color: transparent;
	text-shadow: 1px 1px 10px #ffffff40, 1px 1px 10px #fdfdfd40;
	border-color: #ffffff;
}

.cs2s_asset_rank_bronze {
	background: linear-gradient( #e7913d 50%, #bb2f0f);
	background-clip: text;
	-webkit-text-fill-color: transparent;
	text-shadow: 1px 1px 10px #e7913d40, 1px 1px 10px #bb2f0f40;
	border-color: #e7913d;
}

.cs2s_asset_rank_rust {
	background: linear-gradient( #ff5716 50%, #daddb2);
	background-clip: text;
	-webkit-text-fill-color: transparent;
	text-shadow: 1px 1px 10px #ff57161a, 1px 1px 10px #daddb21a, #9d242480 -1px -1px 0px;
	border-color: #ff5716;
}

.cs2s_listing_info {
	width: 250px;
	padding: 10px 8px 0px 0px;
	font-size: 14px;

	& + br + div {
		border-left: 1px solid #404040;
		padding-left: 16px !important;
	}
}

.cs2s_has_tooltip {
	border-bottom-width: 1px;
	border-bottom-style: dashed;
}

.cs2s_tooltip {
	position: absolute;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.2s;
	z-index: 9999;
	background: #c2c2c2;
	color: #3d3d3f;
	font-size: 11px;
	border-radius: 3px;
	padding: 5px;
	max-width: 300px;
	white-space: normal;
	box-shadow: 0 0 3px #000000;
}

.cs2s_popup_opened {
	overflow: hidden;
}

.cs2s_popup_background {
	position: fixed;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	background: #000000;
	opacity: 80%;
}

.cs2s_popup_container {
	position: fixed;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.cs2s_popup_body {
	position: fixed;
	background: radial-gradient(circle at top left, rgba(74, 81, 92, 0.4) 0%, rgba(75, 81, 92, 0) 60%), #25282e;
	
	&:not(.cs2s_popup_body_simple) {
		padding-top: 3px;
		
		&::after {
			content: "";
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			height: 1px;
			background: linear-gradient(to right, #00ccff, #3366ff);
		}
		
		.cs2s_popup_title {
			padding: 24px;
			font-size: 22px;
			font-weight: 700;
			color: #ffffff;
		}
	}
	
	&.cs2s_popup_body_simple .cs2s_popup_title {
		min-width: 400px;
		padding: 16px;
		font-size: 20px;
		font-weight: 500;
		text-align: center;
		color: #fff;
		background: #1b1b2280;
	}

	&.cs2s_popup_body_popover {
		box-shadow: 0px 0px 16px 8px #00000060;
	}
	
	&:has(.cs2s_popup_footer) {
		border-radius: 0px 0px 10px 10px;
		margin-bottom: 64px;
	}
}

.cs2s_popup_close_button {
	float: right;
	height: 16px;
	width: 16px;
	margin-top: 9px;
	margin-right: 9px;			
	cursor: pointer;
	opacity: 70%;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVBREZBRDlBNzdCNzExRTI5ODAzRUE3MDU0Mzk5MjM5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVBREZBRDlCNzdCNzExRTI5ODAzRUE3MDU0Mzk5MjM5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUFERkFEOTg3N0I3MTFFMjk4MDNFQTcwNTQzOTkyMzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUFERkFEOTk3N0I3MTFFMjk4MDNFQTcwNTQzOTkyMzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4iulRzAAABPElEQVR42mI8cuQIAyWABUqbAXEylH0fiDtwqI8FYhsoewEQH4cZcBaI64DYG8p/AVWADDyAeD4QMwPxJiA+BRJkgkr+BeJoIL4D5U8DYi0kzepAvAKq+TJU7V9kA0DgIxD7Q2lOIF4NpfmBeAuUfg3EPkD8BaaJCc2Z14A4EcoGuWAC1NkqQPwLqvkRsgYmLAG1HoiboOw0IA6EshNh/iZkAAjUA/FBJP5KIF6GTSEuAwygUQsDflAxogwQAuJ10AAExcpNKHsjEIsSMoAZGl2K0EALBeIIKFsOKSpxGtACxK5Qdi4QX4DiAqiYExB34TIgBIgrkAJtFpLcdKgYCBQBcRRMghGamUBxfhKIeaB+NkFOLFAAkjsDTZXfgdgK5DpYXvBGiqYpWDQzQMVAYZKDlDcuMFKanQECDAAqw0LA+GRiqAAAAABJRU5ErkJggg==);
	
	&:hover {
		opacity: 100%;
	}
}

.cs2s_table_title_item {
	color: #919191;
	&::before {
		content: "";
		background: var(--image-url);
		width: 66px;
		height: 45px;
		display: inline-block;
		vertical-align: middle;
		filter: drop-shadow(0px 0px 0px #bdbdbd) drop-shadow(2px 4px 6px #1c1c23);
		background-repeat: no-repeat;
		padding-right: 6px;
	}
}

.cs2s_table_title_casket {
	color: #919191;
	&::before {
		content: "";
		background: url(https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxqAhWSVieFOX71szWCgwsdlZRsuz0L1M1iqrOIGUauNiyzdmKxKWsMrnXkjlQsIthhO5eh9dfdg/66x45);
		width: 66px;
		height: 45px;
		display: inline-block;
		vertical-align: middle;
		filter: drop-shadow(0px 0px 0px #bdbdbd) drop-shadow(2px 4px 6px #1c1c23);
	}
	&.cs2s_table_title_casket_multiple {
		position: relative;
		margin-left: 16px;
		&::before {
			margin-right: 12px;
		}
		&::after {
			content: "";
			background: url(https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXX7gNTPcUxqAhWSVieFOX71szWCgwsdlZRsuz0L1M1iqrOIGUauNiyzdmKxKWsMrnXkjlQsIthhO5eh9dfdg/45x31);
			width: 82px;
			height: 31px;
			display: inline-block;
			vertical-align: middle;
			filter: drop-shadow(0px 0px 0px #bdbdbd) drop-shadow(2px 4px 6px #1c1c23);
			position: absolute;
			left: -14px;
			top: -1px;
			z-index: -1;
			opacity: 85%;
		}
	}
}

.cs2s_table_container {
	outline: 0;
	overflow-y: scroll;
	border-radius: 0px 0px 10px 10px;
}

.cs2s_table {
	user-select: none;
	width: 100%;
	border-spacing: 0px;

	.cs2s_table_image_column {
		width: 93px;
	}

	.cs2s_table_name_column {
		width: 350px;
	}

	.cs2s_table_collection_column {
		width: 250px;
	}

	.cs2s_table_float_column {
		width: 275px;
	}

	.cs2s_table_seed_column {
		width: 150px;
	}

	.cs2s_table_crate_column {
		width: 230px;
		padding-right: 20px;
		white-space: nowrap;
	}

	.cs2s_table_store_name_column {
		width: 475px;
	}

	.cs2s_table_store_type_match_column {
		width: 450px;
	}

	.cs2s_table_store_owned_column {
		width: 165px;

		.cs2s_has_tooltip {
			color: #737373;
		}
	}

	.cs2s_table_store_price_column {
		width: 200px;

		.cs2s_table_store_discount {
			margin-right: 4px;

			.cs2s_table_store_discount_percentage {
				background: linear-gradient(to bottom, #0fa45a, #24955d);
        		border: 1px solid #0fa45a;
				font-weight: 600;
				color: #e8e8e8;
				padding: 4px;
				margin-right: 4px;
			}

			.cs2s_table_store_discount_original_price {
				position: relative;
				color: #738895;
				font-size: 8pt;

				&:before {
					content: '';
					left: -2px;
					right: -2px;
					position: absolute;
					top: 49%;
					border-bottom: 1.5px solid;
					transform: skewY(-10deg);
				}
			}
		}
	}

	td {
		border-bottom: 1px solid #1c1c23;

		&:nth-child(n+2) {
			padding-left: 8px;
		}
	}

	thead {
		tr {
			height: 30px;
		}

		th {
			position: sticky;
			top: 1px;
			background: #1c1c23;
			z-index: 2;
			text-align: left;

			&:nth-child(n+2) {
				padding-left: 8px;
				border-left: 1px solid #3d3d3d;
			}

			&:before {
				content: "";
				position: absolute;
				top: -1px;
				left: -1px;
				right: 0px;
				height: 1px;
				background: #1c1c23;
				border-left: 1px solid #3d3d3d;
			}
		}
	}

	tbody {
  		will-change: transform;
	}

	tbody tr {
		height: 69px;
		color: #bdbdbd;
		user-select: none;

		&.cs2s_table_row_selected {
			background: #a3cbe3;
			color: #3c3f44;

			td {
				border-color: #badbdb
			}
		}

		.cs2s_table_image_column {
			position: relative;
			padding-left: 4px;

			img {
				height: 62px;
				width: 93px;
				display: block;
			}

			.cs2s_table_image_column_cosmetics {
				position: absolute;
				bottom: -2px;
				left: 2px;
				white-space: nowrap;

				img {
					width: 25px;
					height: 19px;
					display: inline-block;
				}

				&:has(> :nth-child(2)):has(> :nth-child(-n+5):last-child) img:nth-child(n+2) {
					margin-left: -8px;
				}

				&:has(> :nth-child(6)) img:nth-child(n+2) {
					margin-left: -12px;
				}
			}
		}

		&:not(.cs2s_table_row_selected) .cs2s_table_image_column {
			& > img {
				filter: drop-shadow(0px 0px 0px #bdbdbd) drop-shadow(2px 4px 6px #1c1c23);
				clip-path: rect(0px 100px 66px 0px);
			}

			.cs2s_table_image_column_cosmetics img {
				filter: drop-shadow(0px 0px 0px #bdbdbd) drop-shadow(4px 0px 4px #1c1c23);
			}
		}

		.cs2s_table_name_column {
			a {
				position: relative;
				top: 1px;
				left: 2px;
				opacity: 75%;
				color: #ffffff;

				svg {
					height: 12px;
					width: 12px;
				}
			}
		}

		&.cs2s_table_row_selected .cs2s_table_name_column a {
			color: #000000;
		}
		
		.cs2s_table_collection_column {
			padding-left: 30px !important;

			&.cs2s_table_collection_column_has_rarity {
				position: relative;

				&::after{
					position: absolute;
					font-size: 8pt;
					font-weight: 800;
					left: 5px;
					top: 50%;
					width: 21px;
					text-align: center;
					transform: translate(0%, -50%);
				}

				&.cs2s_table_collection_column_rarity_7::after {
					content: "7";
					color: var(--cs2s-rarity-7-color);
				}

				&.cs2s_table_collection_column_rarity_6::after {
					content: "6";
					color: var(--cs2s-rarity-6-color);
				}

				&.cs2s_table_collection_column_rarity_5::after {
					content: "5";
					color: var(--cs2s-rarity-5-color);
				}

				&.cs2s_table_collection_column_rarity_4::after {
					content: "4";
					color: var(--cs2s-rarity-4-color);
				}

				&.cs2s_table_collection_column_rarity_3::after {
					content: "3";
					color: var(--cs2s-rarity-3-color);
				}

				&.cs2s_table_collection_column_rarity_2::after {
					content: "2";
					color: var(--cs2s-rarity-2-color);
				}

				&.cs2s_table_collection_column_rarity_1::after {
					content: "1";
					color: var(--cs2s-rarity-1-color);
				}

				&.cs2s_table_collection_column_stattrak::after {
					color: var(--cs2s-stattrak-color);
				}

				&.cs2s_table_collection_column_quality_3::after {
					content: "\u2605";
				}

				&.cs2s_table_collection_column_quality_12::after {
					color: var(--cs2s-souvenir-color);
				}
			}
		}

		&.cs2s_table_row_selected .cs2s_table_collection_column_has_rarity::after {
			color: #3c3f44 !important;
		}

		&:not(.cs2s_table_row_selected) .cs2s_table_collection_column_has_rarity::after {
			text-shadow: 2px 4px 6px #1c1c23;
		}

		.cs2s_table_float_column {
			padding-left: 36px !important;
			font-variant-numeric: tabular-nums;
			
			&.cs2s_table_float_column_has_float {
				position: relative;

				&::after{
					position: absolute;
					font-size: 8pt;
					font-weight: 800;
					top: 50%;
					left: 8px;
					width: 22px;
					text-align: center;
					transform: translate(0%, -50%);
				}

				&.cs2s_table_float_column_float_fn::after {
					content: "FN";
					color: var(--cs2s-wear-fn-color);
				}

				&.cs2s_table_float_column_float_mw::after {
					content: "MW";
					color: var(--cs2s-wear-mw-color);
				}

				&.cs2s_table_float_column_float_ft::after {
					content: "FT";
					color: var(--cs2s-wear-ft-color);
				}

				&.cs2s_table_float_column_float_ww::after {
					content: "WW";
					color: var(--cs2s-wear-ww-color);
				}

				&.cs2s_table_float_column_float_bs::after {
					content: "BS";
					color: var(--cs2s-wear-bs-color);
				}
			}
		}

		&.cs2s_table_row_selected .cs2s_table_float_column_has_float::after {
			color: #3c3f44 !important;
		}

		&:not(.cs2s_table_row_selected) .cs2s_table_float_column_has_float::after {
			text-shadow: 2px 4px 6px #1c1c23;
		}

		.cs2s_table_empty {
			height: 150px;
			font-size: 20px;
			font-weight: 500;
			text-align: center;
			border-bottom-width: 0px;
		}
	}

	.cs2s_table_column {
		cursor: pointer;
		user-select: none;

		&:hover {
			color: #ffffff;
		}

		&:has(.cs2s_table_column_sort_asc), &:has(.cs2s_table_column_sort_desc) {
			color: #3a8dde;

			&:hover {
				color: #4aa6ff;
			}
		}
	}

	.cs2s_table_column_sort {
		position: relative;
		display: inline-block;
		height: 15px;
		width: 15px;
		vertical-align: text-bottom;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23595959' width='800px' height='800px' viewBox='0 0 36.678 36.678' %3E%3Cg%3E%3Cpath d='M29.696,20.076c0.088,0.16,0.08,0.354-0.021,0.51L19.395,36.449c-0.091,0.139-0.241,0.224-0.407,0.229 c-0.004,0-0.008,0-0.015,0c-0.157,0-0.31-0.076-0.403-0.205L6.998,20.609c-0.11-0.15-0.127-0.354-0.041-0.521 c0.085-0.168,0.257-0.272,0.444-0.272h21.855C29.443,19.814,29.609,19.914,29.696,20.076z M7.401,16.865h21.855 c0.008,0,0.017,0,0.021,0c0.275,0,0.5-0.225,0.5-0.5c0-0.156-0.07-0.295-0.184-0.388L18.086,0.205 C17.989,0.072,17.821,0.002,17.668,0c-0.165,0.005-0.315,0.09-0.406,0.229L6.982,16.094c-0.101,0.152-0.105,0.35-0.021,0.512 C7.05,16.765,7.218,16.865,7.401,16.865z'/%3E%3C/g%3E%3C/svg%3E");
		background-size: 15px 15px;
		margin: 0px 4px;
		pointer-events: none;

		&.cs2s_table_column_sort_asc::before, &.cs2s_table_column_sort_desc::before {
			content: "";
			position: absolute;
			inset: 0;
			display: block;
			height: 7px;
			width: 15px;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%233a8dde' width='800px' height='800px' viewBox='0 0 36.678 36.678' %3E%3Cg%3E%3Cpath d='M29.696,20.076c0.088,0.16,0.08,0.354-0.021,0.51L19.395,36.449c-0.091,0.139-0.241,0.224-0.407,0.229 c-0.004,0-0.008,0-0.015,0c-0.157,0-0.31-0.076-0.403-0.205L6.998,20.609c-0.11-0.15-0.127-0.354-0.041-0.521 c0.085-0.168,0.257-0.272,0.444-0.272h21.855C29.443,19.814,29.609,19.914,29.696,20.076z M7.401,16.865h21.855 c0.008,0,0.017,0,0.021,0c0.275,0,0.5-0.225,0.5-0.5c0-0.156-0.07-0.295-0.184-0.388L18.086,0.205 C17.989,0.072,17.821,0.002,17.668,0c-0.165,0.005-0.315,0.09-0.406,0.229L6.982,16.094c-0.101,0.152-0.105,0.35-0.021,0.512 C7.05,16.765,7.218,16.865,7.401,16.865z'/%3E%3C/g%3E%3C/svg%3E");
			background-size: 15px 15px;
		}

		&.cs2s_table_column_sort_desc::before {
			top: 8px;
			background-position-y: 7px;
		}
	}

	.cs2s_table_column_search {
		position: relative;
		margin-left: 2px;
		font-weight: normal;
		font-size: 13px;
		max-width: 275px;
		height: 20px;

		&::before {
			content: "";
			display: inline-block;
			position: absolute;
			top: 4px;
			left: 4px;
			height: 13px;
			width: 13px;
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2396969696' width='800px' height='800px' viewBox='0 0 24 24'%3E%3Cpath d='M23.46,20.38l-5.73-5.73a9.52,9.52,0,1,0-2.83,2.83l5.73,5.73a1,1,0,0,0,1.41,0l1.41-1.41A1,1,0,0,0,23.46,20.38ZM9.75,15a5.5,5.5,0,1,1,5.5-5.5A5.51,5.51,0,0,1,9.75,15Z'/%3E%3C/svg%3E");
			background-size: 13px;
			pointer-events: none;
		}

		&::after {
			padding-left: 42px;
		}

		input {
			background: transparent;
			border: none;
			outline: none;
			color: #969696;
			border-bottom: 1px dashed #96969696;
			padding-left: 22px;
			font-family: inherit;
			width: 100px;
			min-width: 120px;

			&::-webkit-search-cancel-button {
				-webkit-appearance: none;
				position: relative;
				top: 1px;
				height: 8px;
				width: 8px;
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M1 1L11 11M11 1L1 11' stroke='%233a8dde' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
				cursor: pointer;
			}
		}

		&:has(input:not(:placeholder-shown)) {
			&::before {
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%233a8dde' width='800px' height='800px' viewBox='0 0 24 24'%3E%3Cpath d='M23.46,20.38l-5.73-5.73a9.52,9.52,0,1,0-2.83,2.83l5.73,5.73a1,1,0,0,0,1.41,0l1.41-1.41A1,1,0,0,0,23.46,20.38ZM9.75,15a5.5,5.5,0,1,1,5.5-5.5A5.51,5.51,0,0,1,9.75,15Z'/%3E%3C/svg%3E");
			}

			input {
				color: #3a8dde;
				border-color: #3a8dde;
			}
		}
	}
}

.cs2s_table_footer {
	height: 64px;
	position: absolute;
	top: 100%;
	left: 0px;
	right: 0px;
	color: #bdbdbd;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&::before {
		content: "";
		position: absolute;
		left: 0px;
		top: 0px;
		right: 0px;
		bottom: 0px;
		background: radial-gradient(ellipse at 68% 40%, #1c1c2380 -24%, #05080b80 66%);
		backdrop-filter: blur(10px);
		z-index: -1;
		mask: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 40%, transparent);
	}

	a, button {
		border-radius: 20px;

		& > span {
			border-radius: 20px;
		}
	}
}

.cs2s_table_footer_element_left > * {
	margin-right: 24px;
}

.cs2s_table_footer_element_right > * {
	margin-left: 24px;
}

.cs2s_table_footer_selection_count {
	font-weight: bold;
}

.cs2s_table_footer_action_link {
	display: inline-block;
	padding: 0px 18px 0px 12px;
	margin-right: 8px;
	border: 0px;
	line-height: 28px;
	background: #d7d7d7;
	color: #272727;
	font-size: 14px;
	font-weight: bold;
	text-shadow: none;
	opacity: 95%;
	cursor: pointer;
	user-select: none;

	&.cs2s_table_footer_action_link_no_icon {
		padding-left: 24px;
		padding-right: 24px;
	}

	&.cs2s_table_footer_action_link_active {
		background: #3a8dde;
		color: #fff;

		&:hover {
			background: #43a2ff;
		}
	}

	&:hover {
		background: #fff;
	}

	span {
		display: inline-block;

		svg {
			height: 21px;
			width: 21px;
			display: inline-block;
			vertical-align: top;
			margin-right: 2px;
			margin-top: 3px;
		}
	}
}

.cs2s_table_footer_input {
	font-weight: bold;

	input {
		outline: none;
		padding: 0px;
		border-bottom: 1px dashed !important;
		color: inherit !important;

		&::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	}
}

.cs2s_resizable_input {
	display: inline-grid;

	input {
		font-size: inherit;
		font-weight: inherit;
		font-family: inherit;
		grid-area: 1 / 2;
		appearance: textfield;
	}

	&:after {
		content: attr(data-value);
		visibility: hidden;
		grid-area: 1 / 2;
		white-space: nowrap;
	}
}

.cs2s_error_table_container {
	max-height: 80vh;
	width: 1250px;
	user-select: auto;

	table, tbody, tr, th, td {
		user-select: auto !important;
	}

	th:first-child, td:first-child {
		width: 250px;
		padding-left: 16px;
		white-space: nowrap;
	}

	th:nth-child(2), td:nth-child(2) {
		width: 150px;
	}
}

.cs2s_action_body {
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;

	& > div {
		margin: 0px auto;
	}
}

.cs2s_action_item_window {
	height: 120px;
	width: 120px;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	border-radius: 100%;
	overflow: hidden;
	background: #1b1b2280;
}

.cs2s_action_item_window_image {
	display: inline-flex;
	position: absolute;
	left: 0px;
	transform: translate(13px, 0px);

	& > img {
		filter: drop-shadow(0px 0px 0px #bdbdbd) drop-shadow(2px 4px 6px #1c1c23);
	}

	.cs2s_table_image_column_cosmetics {
		position: absolute;
		bottom: -5px;
		left: -2px;
		white-space: nowrap;

		img {
			width: 25px;
			height: 19px;
			display: inline-block;
		}

		&:has(> :nth-child(2)):has(> :nth-child(-n+5):last-child) img:nth-child(n+2) {
			margin-left: -8px;
		}

		&:has(> :nth-child(6)) img:nth-child(n+2) {
			margin-left: -12px;
		}
	}

	
}

.cs2s_action_message {
	color: #969696;
	font-size: 16px;
}

.cs2s_action_message_tall {
	padding: 8px 64px 12px;
}

.cs2s_action_multi_message {
	max-width: 500px;
	padding-left: 16px;
	padding-right: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.cs2s_action_buttons {
	div:not(:first-child) {
		margin-left: 16px;
	}
}

.cs2s_action_progress_bar {
	background: #1b1b2280;
	padding: 6px;
	border-radius: 12px;
	width: 300px;
	height: 25px;

	&::before {
		content: "";
		display: block;
		height: 100%;
		width: var(--percentage);
		min-width: 1px;
		border-radius: 6px;
		background: linear-gradient(to right, #47bfff 0%, #1a44c2 60%);
		background-position: 25%;
		background-size: 330% 100%;
		transition: width 0.3s ease-in-out;
	}
}

.cs2s_action_spinner {
	width: 50px;
	height: 50px;
	border: 5px solid #a6a6ad80;
	border-top-color: transparent;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

.cs2s_settings_form {
	overflow-y: auto;
	padding: 0px 24px 24px 24px;
	width: 900px;
	max-height: 85vh;
}

.cs2s_settings_filter {
	input::placeholder {
		opacity: .75;
	}

	input[type=text]:not(:placeholder-shown), input[type=number]:not(:placeholder-shown), select:has(option:checked:not([value=""]):not([value="custom"])) {
		outline: 1px solid #3a8dde;
	}
}

.cs2s_settings_form_group_title {
	padding: 0px 0px 6px 10px;
	border-bottom: 2px solid rgba(228, 228, 228, .1);
	font-size: 16px;
	line-height: 28px;
	text-transform: uppercase;
	letter-spacing: 0;
	color: #e4e4e4;
}

.cs2s_settings_form_group {
	flex: 1;
	padding: 24px 20px;
	align-items: center;
}

.cs2s_settings_form_group_row {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	gap: 32px;

	.cs2s_settings_form_group_item {
		flex: 1;
	}
}

.cs2s_settings_form_group_half_row {
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	gap: 32px;
}

.cs2s_settings_form_group_collection {
	flex: 1;
	position: relative;
	margin: 8px 0px 10px;

	&::before {
		content: "";
		position: absolute;
		z-index: -1;
		top: -4px;
		bottom: 12px;
		left: -12px;
		right: -12px;
		background-color: #2e3137;
	}
}

.cs2s_settings_form_submit_group {
	display: flex;
	flex-direction: row-reverse;

	button {
		margin: 2px 0 2px 12px;
	}
}

.cs2s_settings_form_group_item {
	display: flex;
	flex-direction: column;
	margin-bottom: 22px;

	label {
		display: block;
		margin-bottom: 4px;
		font-size: 13px;
		font-weight: 300;
		line-height: 19px;
		color: #acb2b8;
		text-transform: uppercase;
		letter-spacing: initial;
		user-select: none;
	}

	&.cs2s_settings_form_group_item_checkbox {
		flex-direction: row;

		label {
			flex: 1;
			margin: 0;
			padding: 4px 0px;
			cursor: pointer;
			white-space: nowrap;
		}
	}

	input[type=text], input[type=number] {
		display: block;
		padding: 10px;
		font-size: 14px;
		line-height: 22px;
		color: #909090;
		background-color: rgba(0, 0, 0, .25);
		border: none;
		box-shadow: inset 1px 1px 0px #000a;
		outline: 0;

		&:disabled {
			appearance: textfield;
		}
	}

	input[type=checkbox] {
		float: left;
		width: 22px;
		height: 22px;
		margin-right: 8px;
		padding: 0;
		border-radius: 2px;
		appearance: none;
		background-color: #0004;
		box-shadow: inset 1px .5px 3px rgba(1, 1, 1, .4);
		cursor: pointer;

		&:not(:disabled):hover {
			background-color: #090909;
		}

		&:checked {
			background-image: url('data:image/svg+xml,<svg version="1.1" id="base" xmlns="http://www.w3.org/2000/svg" class="SVGIcon_Button SVGIcon_DialogCheck" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 256 256"><defs><linearGradient id="svgid_0" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2300ccff"></stop><stop offset="100%" stop-color="%232d73ff"></stop></linearGradient><filter id="svgid_1" x="0" y="0" width="200%" height="200%"><feOffset result="offOut" in="SourceAlpha" dx="20" dy="20"></feOffset><feGaussianBlur result="blurOut" in="offOut" stdDeviation="10"></feGaussianBlur><feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend></filter></defs><path fill="none" stroke="url(%23svgid_0)" stroke-width="24" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="10" d="M206.5,45.25L95,210.75l-45.5-63" stroke-dasharray="365.19 365.19" stroke-dashoffset="0.00"></path><path fill="none" opacity=".2" filter="url(%23svgid_1)" stroke="url(%23svgid_0)" stroke-width="24" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="10" d="M206.5,45.25L95,210.75l-45.5-63" stroke-dasharray="365.19 365.19" stroke-dashoffset="0.00"></path></svg>');
			background-repeat: no-repeat;
			background-position: 50% 50%;
		}
	}

	select {
		display: block;
		padding: 10px;
		font-size: 14px;
		height: 42px;
		color: #909090;
		background-color: rgba(0, 0, 0, .25);
		border: none;
		border-right: 4px solid transparent;
		box-shadow: inset 1px 1px 0px #000a;
		outline: 0;

		option, optgroup {
			color: #909090;
			background-color: #262931;
		}
	}
}

.cs2s_settings_form_message {
	font-style: italic;
	color: #909090;
}

.cs2s_settings_form_separator {
	align-content: center;
	font-weight: 800;
	opacity: 0.5;
	user-select: none;
}

.cs2s_settings_form_disabled {
	opacity: 0.5;

	input, select, label {
		cursor: default !important;
		outline: 0 !important;
	}
}

.popup_menu_item {
	display: block;
}

.cs2s_navigation_icon {
	display: inline-block;
	vertical-align: text-top;
	height: 16px;
	width: 47px;

	svg {
		height: 11px;
		width: 50px;
	}
}

.cs2s_navigation_status_error_glow {
	animation: cs2s_glow 2s infinite ease-in-out;
}

@keyframes cs2s_glow {
	0%, 100% {
		box-shadow: 0 0 5px rgba(102, 192, 244, 0.4);
	}
	20% {
		box-shadow: 0 0 10px rgba(102, 192, 244, 0.6);
	}
	40% {
		box-shadow: 0 0 20px rgba(102, 192, 244, 0.9);
	}
	60% {
		box-shadow: 0 0 5px rgba(102, 192, 244, 0.3);
	}
	80% {
		box-shadow: 0 0 15px rgba(102, 192, 244, 0.8);
	}
}

.cs2s_navigation_status_error_pulse {
	animation: cs2s_pulse 2s infinite ease-in-out;
}

@keyframes cs2s_pulse {
	0% {
		transform: scale(1);
		opacity: 0.75;
		box-shadow: 0 0 0 0 rgba(102, 192, 244, 0.75);
	}
	50% {
		transform: scale(1.1);
		opacity: 1;
		box-shadow: 0 0 10px 10px rgba(102, 192, 244, 0.3);
		color: #66c0f4
	}
	100% {
		transform: scale(1);
		opacity: 0.75;
		box-shadow: 0 0 0 0 rgba(102, 192, 244, 0);
	}
}

.cs2s_grey_long_button {
	display: inline-block;
	width: 200px;
	padding: 0;
	line-height: 32px;
	text-align: center;
	font-size: 14px;
	color: #dfe3e6;
	background-color: #3d4450;
	border: 0;
	border-radius: 2px;
	cursor: pointer;

	&:hover {
		color: #ffffff;
		background-color: #464d58;
	}
}

.cs2s_blue_long_button {
	display: inline-block;
	width: 200px;
	padding: 0;
	line-height: 32px;
	text-align: center;
	font-size: 14px;
	color: #dfe3e6;
	background: linear-gradient(to right, #47bfff 0%, #1a44c2 60%);
	background-position: 25%;
	background-size: 330% 100%;
	border: 0;
	border-radius: 2px;
	cursor: pointer;

	&:hover {
		background: linear-gradient(to right, #47bfff 0%, #1a44c2 60%);
		background-position: 0%;
		background-size: 330% 100%;
	}
}

.cs2s_green_button {
	padding: 1px;
	display: inline-block;
	cursor: pointer;
	color: #D2E885;
	background: linear-gradient(to bottom, #07d03f 5%, #04692f 95%);
	border-bottom-width: 0px;

	span {
		display: block;
		padding: 0 24px;
		font-size: 15px;
		line-height: 30px;
		background: linear-gradient(to bottom, #059917 5%, #04693b 95%);
	}

	&:not(.cs2s_button_disabled) {
		&:hover {
			color: #ffffff;
			background: linear-gradient(to bottom, #08d92b 5%, #06a030 95%);

			span {
				background: linear-gradient(to bottom, #07bf2b 5%, #06a05e 95%);
			}
		}
	}

	&.cs2s_button_disabled {
		opacity: 45%;
		cursor: default;
	}
}
`;

  // src/utils/worker.js
  var Worker = class {
    #queue = [];
    #activeTasks = 0;
    #concurrentLimit;
    #delay;
    #running = false;
    cancelled = false;
    constructor(options = {}) {
      const { concurrentLimit = 1, delay = 0 } = options;
      this.#concurrentLimit = typeof concurrentLimit === "function" ? concurrentLimit : () => concurrentLimit;
      this.#delay = delay;
    }
    Add(task, options = {}) {
      if (this.cancelled) {
        return;
      }
      if (options.priority ?? false) {
        this.#queue.unshift(task);
      } else {
        this.#queue.push(task);
      }
    }
    Run() {
      if (this.#running) {
        return;
      }
      this.#running = true;
      (async () => {
        while (this.#queue.length > 0) {
          if (this.#activeTasks < this.#concurrentLimit()) {
            const task = this.#queue.shift();
            this.#activeTasks++;
            (async () => {
              try {
                await task();
              } finally {
                this.#activeTasks--;
              }
            })();
          } else {
            await Sleep(50);
          }
          if (this.#queue.length > 0) {
            await Sleep(this.#delay);
          }
        }
        this.#running = false;
      })();
    }
    async Finish() {
      while (this.#activeTasks > 0 || this.#queue.length > 0) {
        await Sleep(50);
      }
    }
    async Cancel() {
      this.cancelled = true;
      this.#queue.length = 0;
      await this.Finish();
    }
  };

  // src/cs2/items/assets/asset.js
  var Asset = class _Asset {
    _assetid;
    _type = _Asset.TYPE.OTHER;
    _inspectLink;
    _inspectData;
    _wearData;
    static _inspectionWorker = new Worker({
      concurrentLimit: () => {
        return script_default.AccountsConnected;
      }
    });
    static TYPE = {
      WEARABLE: 0,
      KEYCHAIN: 1,
      STORAGE_UNIT: 2,
      OTHER: 3
    };
    ShouldInspect() {
      return this._type == _Asset.TYPE.WEARABLE && this._inspectLink != "undefined";
    }
    async _Inspect(options = {}) {
      if (!this.ShouldInspect() || !this._assetid) {
        return;
      }
      const cacheOnly = options.cacheOnly ?? false;
      const cache_id = `item_${this._assetid}`;
      const cache = await Cache.GetValue(cache_id, null);
      if (cache) {
        const ageHours = (+/* @__PURE__ */ new Date() - cache.created) / 36e5;
        const maxAgeHours = GetSetting(SETTING_INSPECT_CACHE_TIME_HOURS);
        const cacheExpired = maxAgeHours >= 0 && ageHours >= maxAgeHours;
        if (!cacheExpired) {
          this._inspectData = cache;
        }
      }
      if (!this._inspectData) {
        if (cacheOnly) {
          return false;
        }
        let inspectData;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            inspectData = await asf_default.Send("CS2Interface", "InspectItem", "GET", "ASF", { url: this._inspectLink });
            break;
          } catch (e) {
            if (e.code === 504) {
              script_default.ShowError({ level: ERROR_LEVEL.LOW }, e);
            } else {
              throw e;
            }
          }
        }
        if (!inspectData) {
          throw new Error(`Failed to inspect item: ${this._inspectLink}`);
        }
        if (!inspectData.iteminfo) {
          console.log(inspectData);
          throw new Error(`Invalid inspect data, check browser logs, ${this._inspectLink}`);
        }
        this._inspectData = {
          created: +/* @__PURE__ */ new Date()
        };
        if (typeof inspectData.wear !== "undefined" && typeof inspectData.wear_min !== "undefined" && typeof inspectData.wear_max !== "undefined") {
          this._inspectData.wear = inspectData.wear;
          this._inspectData.wearMin = inspectData.wear_min;
          this._inspectData.wearMax = inspectData.wear_max;
        }
        if (typeof inspectData.iteminfo.paintseed !== "undefined") {
          this._inspectData.seed = inspectData.iteminfo.paintseed;
        }
        if (typeof inspectData.iteminfo.rarity !== "undefined") {
          this._inspectData.rarity = inspectData.iteminfo.rarity;
        }
        if (typeof inspectData.iteminfo.quality !== "undefined") {
          this._inspectData.quality = inspectData.iteminfo.quality;
        }
        if (inspectData.stattrak === true) {
          this._inspectData.stattrak = true;
        }
        if ((inspectData.iteminfo.stickers?.length ?? 0) > 0) {
          this._inspectData.stickers = inspectData.iteminfo.stickers.map((sticker) => sticker.wear ?? 0);
        }
        if ((inspectData.iteminfo.keychains?.length ?? 0) > 0) {
          this._inspectData.charm = inspectData.iteminfo.keychains[0].pattern;
        }
        Cache.SetValue(cache_id, this._inspectData);
      }
      if (typeof this._inspectData.wear !== "undefined") {
        this._wearData = _Asset.GetWear(this._inspectData.wear);
        if (!this._wearData) {
          throw new Error(`Invalid item wear: ${this._inspectData.wear}, ${this._inspectLink}`);
        }
      }
      return true;
    }
    static GetWear(wearValue) {
      for (const wear of WEARS) {
        if (wearValue >= wear.min && wearValue <= wear.max) {
          return wear;
        }
      }
    }
    static GetPercentileElement(wear, wearValue, wearMin, wearMax, options = {}) {
      const showTooltip = options.showTooltip ?? false;
      const showRounded = options.rounded ?? true;
      const exteriorWearMin = Math.max(wearMin, wear.min);
      const exteriorWearMax = Math.min(wearMax, wear.max);
      const percentile = (1 - (wearValue - exteriorWearMin) / (exteriorWearMax - exteriorWearMin)) * 100;
      const percentileRounded = Math.min(99, Math.round(percentile));
      const percentileFixed = Math.min(99.99, parseFloat(percentile.toFixed(2)));
      const bestWear = _Asset.GetWear(wearMin);
      const worstWear = _Asset.GetWear(wearMax);
      let rank;
      if (wear == bestWear) {
        if (percentileFixed >= 99.9) {
          rank = "gold";
        } else if (percentileFixed >= 99.5) {
          rank = "silver";
        } else if (percentileRounded >= 99) {
          rank = "bronze";
        }
      } else if (wear == worstWear && percentileRounded == 0) {
        rank = "rust";
      }
      const percentileElement = CreateElement("span", {
        text: showRounded ? `(${percentileRounded}%)` : `(${percentileFixed}%)`
      });
      if (rank) {
        percentileElement.classList.add(`cs2s_asset_rank_${rank}`);
      }
      if (showTooltip) {
        BindTooltip(percentileElement, `Better than ${percentileFixed}% of ${wear.nameLong} floats`);
      }
      return percentileElement;
    }
    static GetNumCosmetics(item) {
      if (typeof item.cosmetics !== "undefined") {
        return item.cosmetics;
      }
      let count = 0;
      if (item.keychains) {
        count++;
      }
      if (item.stickers) {
        for (let slotNum = 0; slotNum < STICKER_MAX_COUNT; slotNum++) {
          let stickerID = item.attributes[`sticker slot ${slotNum} id`];
          if (stickerID) {
            count++;
          }
        }
      }
      item.cosmetics = count;
      return item.cosmetics;
    }
    _GetPercentileElement(options = {}) {
      if (!this._inspectData || !this._wearData) {
        return;
      }
      return _Asset.GetPercentileElement(this._wearData, this._inspectData.wear, this._inspectData.wearMin, this._inspectData.wearMax, options);
    }
    _GetWearRangeElement(highlightHalfwayPoint = false) {
      if (!this._inspectData.wear) {
        return;
      }
      const wearRangeElement = CreateElement("div", {
        class: "descriptor cs2s_asset_wear_range cs2s_element"
      });
      for (const wear of WEARS) {
        const { wearMin, wearMax, wear: actualWear } = this._inspectData;
        const range = wear.max - wear.min;
        const isMinWear = wearMin > 0 && wearMin >= wear.min && wearMin < wear.max;
        const isMaxWear = wearMax < 1 && wearMax > wear.min && wearMax <= wear.max;
        const isRollableWear = wearMax > wear.min && wearMin < wear.max;
        const wearGroupElement = CreateElement("div", {
          class: `cs2s_asset_wear_range_${wear.name.toLowerCase()}`
        });
        wearRangeElement.append(wearGroupElement);
        if (isMinWear) {
          const percentage = (1 - (wearMin - wear.min) / range) * 100;
          wearGroupElement.classList.add("cs2s_asset_wear_range_right");
          wearGroupElement.style.setProperty("--wear-percentage", `${percentage.toFixed(0)}%`);
          wearGroupElement.append(
            CreateElement("div", {
              class: "cs2s_asset_wear_range_low",
              wear_value: wearMin.toFixed(2),
              vars: {
                "wear-percentage": `${percentage.toFixed(0)}%`
              }
            })
          );
        }
        if (isMaxWear) {
          const percentage = (wearMax - wear.min) / range * 100;
          wearGroupElement.classList.add("cs2s_asset_wear_range_left");
          wearGroupElement.style.setProperty("--wear-percentage", `${percentage.toFixed(0)}%`);
          wearGroupElement.append(
            CreateElement("div", {
              class: "cs2s_asset_wear_range_high",
              wear_value: wearMax.toFixed(2),
              vars: {
                "wear-percentage": `${percentage.toFixed(0)}%`
              }
            })
          );
        }
        if (isRollableWear && !isMinWear && !isMaxWear) {
          wearGroupElement.classList.add("cs2s_asset_wear_range_full");
        }
        if (!isRollableWear) {
          wearGroupElement.classList.add("cs2s_asset_wear_range_empty");
        }
        if (this._wearData == wear) {
          let percentage;
          if (highlightHalfwayPoint) {
            const halfWayPoint = (Math.min(wear.max, wearMax) + Math.max(wear.min, wearMin)) / 2;
            percentage = (halfWayPoint - wear.min) / range * 100;
          } else {
            percentage = (actualWear - wear.min) / range * 100;
          }
          wearGroupElement.append(
            CreateElement("div", {
              class: "cs2s_asset_wear_range_marker",
              vars: {
                "wear-percentage": `${percentage.toFixed(0)}%`
              }
            })
          );
        }
      }
      return wearRangeElement;
    }
  };

  // src/components/table.js
  var Table = class _Table {
    _data;
    _filteredData;
    #rowElements = [];
    #lastStartRow;
    _sortColumns = null;
    _sortDirection = null;
    #defaultSort;
    static #ROW_HEIGHT = 69;
    static #BUFFER_ROWS = 3;
    #VISIBLE_ROWS;
    get #NUM_ROW_ELEMENTS() {
      return this.#VISIBLE_ROWS + _Table.#BUFFER_ROWS * 2;
    }
    #popup;
    _tableContainerElement;
    #tableElement;
    #tableBodyElement;
    #spacerElement;
    static SORT_DIRECTION = {
      ASC: 0,
      DESC: 1
    };
    constructor() {
      this.#VISIBLE_ROWS = Math.max(1, Math.floor(unsafeWindow.innerHeight * 0.66 / _Table.#ROW_HEIGHT));
    }
    _CreateTable(tableData, tableHeaderElement, tableFooterElement, options) {
      this._data = tableData;
      this._filteredData = tableData;
      this.#defaultSort = options.defaultSort ?? null;
      this._data.map((item) => delete item.element);
      this.#tableBodyElement = CreateElement("tbody");
      this.#spacerElement = CreateElement("div");
      this.#tableElement = CreateElement("table", {
        class: "cs2s_table",
        children: [
          tableHeaderElement,
          this.#tableBodyElement,
          this.#spacerElement
        ]
      });
      this._tableContainerElement = CreateElement("div", {
        class: "cs2s_table_container",
        style: {
          height: `${(this.#VISIBLE_ROWS + 1) * _Table.#ROW_HEIGHT}px`
        },
        onscroll: () => {
          this.#UpdateRows();
        },
        children: [this.#tableElement]
      });
      this.#popup = new Popup({
        title: options.popupTitle,
        titleChildren: options.popupTitleChildren,
        body: [this._tableContainerElement, tableFooterElement],
        onclose: options.popupOnClose
      });
    }
    Show() {
      this.#popup.Show();
      this._FilterRows();
      this._UpdateTable();
      this._tableContainerElement.focus();
      this._tableContainerElement.style.width = `${this._tableContainerElement.offsetWidth}px`;
      this._tableContainerElement.querySelectorAll("thead th").forEach((th) => {
        th.style.width = getComputedStyle(th).width;
      });
    }
    _GetRowElement(_item) {
      throw new Error("Subclasses must implement _GetRowElement");
    }
    _UpdateTable() {
      this.#lastStartRow = Number.POSITIVE_INFINITY;
      for (let i = 0; i < this.#rowElements.length; i++) {
        this.#rowElements[i].remove();
      }
      this.#rowElements = [];
      for (let i = 0; i < this.#NUM_ROW_ELEMENTS; i++) {
        if (i >= this._filteredData.length) {
          break;
        }
        const rowElement = this._GetRowElement(this._filteredData[i]);
        this.#rowElements.push(rowElement);
        this.#tableBodyElement.append(rowElement);
      }
      this.#spacerElement.style.height = "0px";
      this.#spacerElement.style.height = `${this._filteredData.length * _Table.#ROW_HEIGHT - this.#tableElement.clientHeight + 31}px`;
      this.#UpdateRows();
      this._UpdateFooter();
    }
    #UpdateRows() {
      const startRow = Math.max(
        0,
        Math.min(
          this._filteredData.length - this.#NUM_ROW_ELEMENTS,
          Math.floor(this._tableContainerElement.scrollTop / _Table.#ROW_HEIGHT) - _Table.#BUFFER_ROWS
        )
      );
      if (startRow == this.#lastStartRow) {
        return;
      }
      const diff = Math.max(
        -this.#NUM_ROW_ELEMENTS,
        Math.min(
          this.#NUM_ROW_ELEMENTS,
          startRow - this.#lastStartRow
        )
      );
      this.#lastStartRow = startRow;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          const dataIndex = startRow + this.#NUM_ROW_ELEMENTS - diff + i;
          if (dataIndex >= this._filteredData.length || dataIndex < 0) {
            continue;
          }
          const oldRow = this.#rowElements.shift();
          oldRow.remove();
          const newRow = this._GetRowElement(this._filteredData[dataIndex]);
          this.#rowElements.push(newRow);
          this.#tableBodyElement.append(newRow);
        }
      } else {
        for (let i = 0; i < Math.abs(diff); i++) {
          const dataIndex = startRow - diff - i - 1;
          if (dataIndex >= this._filteredData.length || dataIndex < 0) {
            continue;
          }
          const oldRow = this.#rowElements.pop();
          oldRow.remove();
          const newRow = this._GetRowElement(this._filteredData[dataIndex]);
          this.#rowElements.unshift(newRow);
          this.#tableBodyElement.prepend(newRow);
        }
      }
      this.#tableBodyElement.style.transform = `translate3d(0, ${startRow * _Table.#ROW_HEIGHT}px, 0)`;
    }
    _UpdateFooter() {
      throw new Error("Subclasses must implement _UpdateFooter");
    }
    _SortRows(options = {}) {
      if (this._data.length == 0) {
        return;
      }
      if (options.columns) {
        if (this._sortDirection != null && this._sortColumns[0] != options.columns[0]) {
          this._sortDirection = null;
        }
        this._sortColumns = options.columns;
      }
      let resetSort = false;
      if (options.event) {
        if (this._sortDirection === _Table.SORT_DIRECTION.DESC) {
          if (this.#defaultSort) {
            this._sortColumns = this.#defaultSort.columns;
            this._sortDirection = this.#defaultSort.direction;
            resetSort = true;
          } else {
            this._sortDirection = _Table.SORT_DIRECTION.ASC;
          }
        } else if (this._sortDirection === _Table.SORT_DIRECTION.ASC) {
          this._sortDirection = _Table.SORT_DIRECTION.DESC;
        }
      }
      if (!this._sortColumns) {
        return;
      }
      if (!this._sortDirection) {
        this._sortDirection = _Table.SORT_DIRECTION.ASC;
      }
      const asc = this._sortDirection === _Table.SORT_DIRECTION.ASC;
      this._filteredData.sort((a, b) => {
        for (const column of this._sortColumns) {
          let valueA = a[column];
          let valueB = b[column];
          if (valueA === valueB) {
            continue;
          }
          if (typeof valueA === "undefined") {
            return 1;
          }
          if (typeof valueB === "undefined") {
            return -1;
          }
          if (typeof valueA === "string") {
            return asc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
          }
          return asc ? valueA - valueB : valueB - valueA;
        }
        return 0;
      });
      if (options.event) {
        this._tableContainerElement.querySelectorAll(".cs2s_table_column_sort_asc").forEach((el) => {
          el.classList.remove("cs2s_table_column_sort_asc");
        });
        this._tableContainerElement.querySelectorAll(".cs2s_table_column_sort_desc").forEach((el) => {
          el.classList.remove("cs2s_table_column_sort_desc");
        });
        if (!resetSort) {
          if (asc) {
            options.event.currentTarget.querySelector(".cs2s_table_column_sort").classList.add("cs2s_table_column_sort_asc");
          } else {
            options.event.currentTarget.querySelector(".cs2s_table_column_sort").classList.add("cs2s_table_column_sort_desc");
          }
        }
      }
      this._UpdateTable();
    }
    _FilterRow(_item) {
      throw new Error("Subclasses must implement _Filter");
    }
    _FilterRows() {
      if (this._data.length == 0) {
        return;
      }
      this._filteredData = this._data.filter(this._FilterRow.bind(this));
      this._tableContainerElement.scrollTop = 0;
      this._SortRows();
      this._UpdateTable();
    }
  };

  // src/components/item_table.js
  var ItemTable = class _ItemTable extends Table {
    #inventory;
    #mode;
    #casket;
    #multiCasket;
    #selectionLimit;
    #selectedRows = /* @__PURE__ */ new Set();
    #selectedRowsSaved = /* @__PURE__ */ new Set();
    #lastRowClicked = null;
    #lastRowSelected = null;
    #inventoryChanged = false;
    #filterables = null;
    #filter = null;
    #searchQuery = null;
    #defaultSort = {
      columns: ["casket_id", "id"],
      direction: Table.SORT_DIRECTION.DESC
    };
    #selectionLimitCountElement;
    #selectionCountElement;
    #clearSelectionButtonElement;
    #filterCountElement;
    #actionButtonElement;
    static MODE = {
      STORE: 0,
      RETRIEVE: 1
    };
    static SORT_DIRECTION = {
      ASC: 0,
      DESC: 1
    };
    constructor(items, inventory, options) {
      super();
      this.#inventory = inventory;
      this.#mode = options.mode;
      this.#casket = options.casket ?? null;
      this.#multiCasket = options.multiCasket ?? false;
      const tableHeaderElement = CreateElement("thead", {
        children: [
          CreateElement("tr", {
            children: [
              CreateElement("th", {
                class: "cs2s_table_image_column"
              }),
              CreateElement("th", {
                class: "cs2s_table_name_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    text: "Name",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["name", "wear"] });
                    }
                  }),
                  CreateElement("span", {
                    class: "cs2s_table_column_search cs2s_resizable_input",
                    children: [
                      CreateElement("input", {
                        type: "search",
                        placeholder: "Search",
                        oninput: (event) => {
                          event.target.style.width = "0px";
                          event.target.parentNode.dataset.value = event.target.value || event.target.placeholder;
                          event.target.style.width = `${event.target.parentNode.clientWidth}px`;
                          this.#searchQuery = event.currentTarget.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ").filter((word) => word.length > 0);
                          this._FilterRows();
                        }
                      })
                    ]
                  })
                ]
              }),
              CreateElement("th", {
                class: "cs2s_table_collection_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    text: "Quality",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["rarity", "quality", "collection", "name", "wear"] });
                    }
                  }),
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    text: "Collection",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["collection", "rarity", "quality", "name", "wear"] });
                    }
                  })
                ]
              }),
              CreateElement("th", {
                class: "cs2s_table_float_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    text: "Float",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["wear"] });
                    }
                  })
                ]
              }),
              CreateElement("th", {
                class: "cs2s_table_seed_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    text: "Seed",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["seed"] });
                    }
                  })
                ]
              }),
              this.#multiCasket && CreateElement("th", {
                class: "cs2s_table_crate_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    text: "Storage Unit",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["casket_name", "id"] });
                    }
                  })
                ]
              })
            ]
          })
        ]
      });
      if (this.#mode === _ItemTable.MODE.RETRIEVE) {
        this.#selectionLimit = INVENTORY_ITEM_LIMIT - inventory.items.filter((x) => typeof x.attributes["trade protected escrow date"] === "undefined").length;
      } else {
        this.#selectionLimit = STORAGE_UNIT_ITEM_LIMIT - inventory.storedItems.filter((x) => x.casket_id == this.#casket.iteminfo.id).length;
      }
      const onStatusUpdate = (status) => {
        if (this.#mode !== _ItemTable.MODE.RETRIEVE || typeof status.Plugin?.UnprotectedInventorySize === "undefined") {
          return;
        }
        this.#selectionLimit = INVENTORY_ITEM_LIMIT - status.Plugin.UnprotectedInventorySize;
        this._UpdateFooter();
      };
      this.#filterCountElement = CreateElement("span", {
        class: "cs2s_table_footer_selection_count"
      });
      this.#selectionLimitCountElement = CreateElement("span", {
        class: "cs2s_table_footer_selection_count"
      });
      this.#selectionCountElement = CreateElement("span", {
        class: "cs2s_table_footer_selection_count"
      });
      this.#clearSelectionButtonElement = CreateElement("a", {
        class: "cs2s_table_footer_action_link",
        onclick: () => {
          this.#DeselectAll();
          this._tableContainerElement.focus();
        },
        children: [
          CreateElement("span", {
            htmlChildren: [
              /*html*/
              `
						<svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true" stroke="none" fill="currentColor">
							<path d="m 15.5,29.5 c -7.18,0 -13,-5.82 -13,-13 0,-7.18 5.82,-13 13,-13 7.18,0 13,5.82 13,13 0,7.18 -5.82,13 -13,13 z m 6.438,-13.562 c 0,-0.552 -0.448,-1 -1,-1 h -11 c -0.553,0 -1,0.448 -1,1 v 1 c 0,0.553 0.447,1 1,1 h 11 c 0.552,0 1,-0.447 1,-1 z"></path>
						</svg>
					`
            ],
            children: [
              "Clear"
            ]
          })
        ]
      });
      this.#actionButtonElement = CreateElement("a", {
        class: "cs2s_green_button cs2s_button_disabled",
        html: "<span>Proceed...</span>",
        onclick: () => {
          if (this.#actionButtonElement.classList.contains("cs2s_button_disabled")) {
            return;
          }
          if (!script_default.Bot?.Plugin?.Connected) {
            script_default.ShowStartInterfacePrompt({
              message: this.#mode === _ItemTable.MODE.RETRIEVE ? "Interface must be running to retrieve items" : "Interface must be running to store items",
              autoClose: true,
              popoverMode: true,
              fade: false,
              onclose: () => {
                this._tableContainerElement.focus();
              },
              onconnected: () => {
                this.#inventoryChanged = true;
                this.#ProcessSelected();
              }
            });
            return;
          }
          this.#ProcessSelected();
        }
      });
      const tableFooterElement = CreateElement("div", {
        class: "cs2s_table_footer cs2s_popup_footer",
        children: [
          CreateElement("div", {
            class: "cs2s_table_footer_element_left",
            children: [
              CreateElement("span", {
                children: [
                  CreateElement("a", {
                    class: "cs2s_table_footer_action_link",
                    onclick: (event) => {
                      this.#ShowFilters(event.currentTarget);
                    },
                    children: [
                      CreateElement("span", {
                        htmlChildren: [
                          /*html*/
                          `
												<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
													<path d="m 3,5 h 18 a 1,1 0 1 1 0,2 H 3 A 1,1 0 1 1 3,5 Z m 3,6 h 12 a 1,1 0 1 1 0,2 H 6 a 1,1 0 1 1 0,-2 z m 3,6 h 6 a 1,1 0 1 1 0,2 H 9 a 1,1 0 1 1 0,-2 z"/>
												</svg>
											`
                        ],
                        children: [
                          "Filter"
                        ]
                      })
                    ]
                  }),
                  this.#filterCountElement,
                  " Item(s)"
                ]
              }),
              CreateElement("span", {
                children: [
                  CreateElement("form", {
                    style: {
                      display: "inline-block"
                    },
                    onsubmit: (event) => {
                      event.preventDefault();
                      const countInput = event.target.elements["count"];
                      const count = parseInt(countInput.value || countInput.placeholder);
                      this.#SelectFirst(count);
                    },
                    children: [
                      CreateElement("button", {
                        class: "cs2s_table_footer_action_link",
                        children: [
                          CreateElement("span", {
                            htmlChildren: [
                              /*html*/
                              `
														<svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true" stroke="none" fill="currentColor">
															<path d="M15.5 29.5c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM21.938 15.938c0-0.552-0.448-1-1-1h-4v-4c0-0.552-0.447-1-1-1h-1c-0.553 0-1 0.448-1 1v4h-4c-0.553 0-1 0.448-1 1v1c0 0.553 0.447 1 1 1h4v4c0 0.553 0.447 1 1 1h1c0.553 0 1-0.447 1-1v-4h4c0.552 0 1-0.447 1-1v-1z"></path>
														</svg>
													`
                            ],
                            children: [
                              "Select"
                            ]
                          })
                        ]
                      }),
                      CreateElement("span", {
                        onclick: (event) => {
                          const input = event.target.querySelector("input");
                          input && input.focus();
                        },
                        children: [
                          "First ",
                          CreateElement("span", {
                            class: "cs2s_table_footer_input cs2s_resizable_input",
                            children: [
                              CreateElement("input", {
                                type: "number",
                                name: "count",
                                min: 0,
                                placeholder: 0,
                                style: {
                                  width: "10px"
                                },
                                oninput: (event) => {
                                  event.target.style.width = "0px";
                                  event.target.parentNode.dataset.value = event.target.value || event.target.placeholder;
                                  event.target.style.width = `${event.target.parentNode.clientWidth}px`;
                                }
                              })
                            ]
                          }),
                          " Item(s)"
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),
          CreateElement("div", {
            class: "cs2s_table_footer_element_right",
            children: [
              CreateElement("span", {
                children: [
                  this.#clearSelectionButtonElement,
                  this.#selectionCountElement,
                  " Item(s) Selected"
                ]
              }),
              CreateElement("span", {
                children: [
                  this.#selectionLimitCountElement,
                  " Space(s) Available"
                ]
              }),
              this.#actionButtonElement
            ]
          })
        ]
      });
      const popupTitle = this.#mode === _ItemTable.MODE.RETRIEVE ? "Select items to retrieve from " : "Select items to move into ";
      const cachedNotification = CreateElement("span", {
        text: "(Cached)"
      });
      BindTooltip(cachedNotification, "The information below was loaded from cache and may no longer be accurate.");
      const popupTitleCrateNameElement = CreateElement("span", {
        class: "cs2s_table_title_casket",
        text: this.#multiCasket ? options.casketName : `"${options.casketName}"`,
        children: [
          this.#inventory.loadedFromCache && " ",
          this.#inventory.loadedFromCache && cachedNotification
        ]
      });
      if (this.#multiCasket) {
        popupTitleCrateNameElement.classList.add("cs2s_table_title_casket_multiple");
      }
      script_default.AddStatusUpdateListener(onStatusUpdate);
      this._CreateTable(
        items,
        tableHeaderElement,
        tableFooterElement,
        {
          defaultSort: this.#defaultSort,
          popupTitle,
          popupTitleChildren: [
            popupTitleCrateNameElement
          ],
          popupOnClose: () => {
            script_default.RemoveStatusUpdateListener(onStatusUpdate);
            if (this.#inventoryChanged) {
              window.location.reload();
            }
          }
        }
      );
    }
    _GetRowElement(item, buildIfDoesntExist = true) {
      if (item.element) {
        return item.element;
      }
      if (!buildIfDoesntExist) {
        return;
      }
      const cosmetics = CreateElement("div", {
        class: "cs2s_table_image_column_cosmetics"
      });
      if (item.keychains) {
        let keychainID = item.attributes[`keychain slot 0 id`];
        if (keychainID) {
          const keychain = item.keychains[keychainID];
          const keychainSeed = item.attributes[`keychain slot 0 seed`];
          const keychainIMG = CreateElement("img", {
            src: Icons.GetIconURL(keychain.full_name, "25fx19f")
          });
          if (typeof keychainSeed !== "undefined") {
            BindTooltip(keychainIMG, `${keychain.full_name} (${keychainSeed})`, { showStyle: false });
          } else {
            BindTooltip(keychainIMG, keychain.full_name, { showStyle: false });
          }
          cosmetics.append(keychainIMG);
        }
      }
      if (item.stickers) {
        for (let slotNum = 0; slotNum < STICKER_MAX_COUNT; slotNum++) {
          let stickerID = item.attributes[`sticker slot ${slotNum} id`];
          if (stickerID) {
            const sticker = item.stickers[stickerID];
            const stickerIMG = CreateElement("img", {
              src: Icons.GetIconURL(sticker.full_name, "25fx19f")
            });
            BindTooltip(stickerIMG, sticker.full_name, { showStyle: false });
            cosmetics.append(stickerIMG);
          }
        }
      }
      const imageTD = CreateElement("td", {
        class: "cs2s_table_image_column",
        children: [
          CreateElement("img", {
            src: Icons.GetIconURL(item.full_name, "93fx62f")
          }),
          cosmetics
        ]
      });
      const nameTD = CreateElement("td", {
        class: "cs2s_table_name_column",
        text: item.name,
        children: [
          CreateElement("a", {
            href: `https://steamcommunity.com/market/listings/${CS2_APPID}/${encodeURIComponent(item.full_name)}`,
            target: "_blank",
            html: (
              /*html*/
              `
						<svg viewBox="0 0 64 64" stroke-width="3" stroke="currentColor" fill="none">
							<path d="M55.4,32V53.58a1.81,1.81,0,0,1-1.82,1.82H10.42A1.81,1.81,0,0,1,8.6,53.58V10.42A1.81,1.81,0,0,1,10.42,8.6H32"/>
							<polyline points="40.32 8.6 55.4 8.6 55.4 24.18"/>
							<line x1="19.32" y1="45.72" x2="54.61" y2="8.91"/>
						</svg>
					`
            )
          })
        ]
      });
      const collectionTD = CreateElement("td", {
        class: "cs2s_table_collection_column"
      });
      if (item.collection) {
        collectionTD.innerText = item.collection;
      }
      if (item.collection || item.rarity > 1) {
        collectionTD.classList.add("cs2s_table_collection_column_has_rarity");
        collectionTD.classList.add(`cs2s_table_collection_column_rarity_${item.rarity}`);
        collectionTD.classList.add(`cs2s_table_collection_column_quality_${item.iteminfo.quality}`);
        if (item.stattrak) {
          collectionTD.classList.add(`cs2s_table_collection_column_stattrak`);
        }
      }
      const floatTD = CreateElement("td", {
        class: "cs2s_table_float_column"
      });
      if (typeof item.wear !== "undefined") {
        const wearData = Asset.GetWear(item.wear);
        floatTD.classList.add("cs2s_table_float_column_has_float");
        floatTD.classList.add(`cs2s_table_float_column_float_${wearData.name.toLowerCase()}`);
        floatTD.innerText = item.wear.toFixed(14);
        floatTD.append(" ");
        floatTD.append(Asset.GetPercentileElement(wearData, item.wear, item.wear_min, item.wear_max));
      }
      const seedTD = CreateElement("td", {
        class: "cs2s_table_seed_column",
        text: item.seed ?? ""
      });
      const casketTD = this.#multiCasket && CreateElement("td", {
        class: "cs2s_table_crate_column",
        text: item.casket_name
      });
      item.element = CreateElement("tr", {
        onmousedown: (event) => {
          if (event.target.nodeName === "A" || event.target.parentElement.nodeName === "A" || event.button !== 0) {
            return;
          }
          this.#SelectItem(event, item);
        },
        children: [
          imageTD,
          nameTD,
          collectionTD,
          floatTD,
          seedTD,
          casketTD
        ]
      });
      if (this.#selectedRows.has(item.iteminfo.id)) {
        item.element.classList.add("cs2s_table_row_selected");
      }
      return item.element;
    }
    _UpdateFooter() {
      this.#selectionLimitCountElement.innerText = this.#selectionLimit.toLocaleString();
      this.#selectionCountElement.innerText = this.#selectedRows.size.toLocaleString();
      this.#filterCountElement.innerText = this._filteredData.length.toLocaleString();
      if (this.#selectedRows.size <= 0) {
        this.#actionButtonElement.classList.add("cs2s_button_disabled");
        if (!this.#actionButtonElement.tooltip) {
          this.#actionButtonElement.tooltip = BindTooltip(this.#actionButtonElement, "No items selected");
        } else {
          this.#actionButtonElement.tooltip.innerText = "No items selected";
        }
      } else if (this.#selectedRows.size > this.#selectionLimit) {
        this.#actionButtonElement.classList.add("cs2s_button_disabled");
        if (!this.#actionButtonElement.tooltip) {
          this.#actionButtonElement.tooltip = BindTooltip(this.#actionButtonElement, "Too many items selected");
        } else {
          this.#actionButtonElement.tooltip.innerText = "Too many items selected";
        }
      } else {
        this.#actionButtonElement.classList.remove("cs2s_button_disabled");
        this.#actionButtonElement.unbindTooltip && this.#actionButtonElement.unbindTooltip();
        this.#actionButtonElement.tooltip = null;
      }
      if (this.#selectedRows.size > 0) {
        this.#clearSelectionButtonElement.show();
      } else {
        this.#clearSelectionButtonElement.hide();
      }
    }
    #SelectItem(event, item) {
      if (event.shiftKey) {
        if (!this.#lastRowClicked || this.#lastRowClicked == item || this.#lastRowSelected === null) {
          return;
        }
        const start = this._filteredData.indexOf(this.#lastRowClicked);
        const end = this._filteredData.indexOf(item);
        if (start < 0 || end < 0) {
          return;
        }
        const from = Math.min(start, end);
        const to = Math.max(start, end);
        for (let i = from; i <= to; i++) {
          const rowItem = this._filteredData[i];
          const row = this._GetRowElement(rowItem, false);
          const assetID = rowItem.iteminfo.id;
          if (!this.#lastRowSelected && this.#selectedRows.has(assetID)) {
            this.#selectedRows.delete(assetID);
            row && row.classList.remove("cs2s_table_row_selected");
          } else if (this.#lastRowSelected) {
            this.#selectedRows.add(assetID);
            row && row.classList.add("cs2s_table_row_selected");
          }
        }
      } else {
        const row = this._GetRowElement(item);
        const assetID = item.iteminfo.id;
        if (this.#selectedRows.has(assetID)) {
          this.#lastRowSelected = false;
          this.#selectedRows.delete(assetID);
          row.classList.remove("cs2s_table_row_selected");
        } else {
          this.#lastRowSelected = true;
          this.#selectedRows.add(assetID);
          row.classList.add("cs2s_table_row_selected");
        }
      }
      this.#lastRowClicked = item;
      this._UpdateFooter();
    }
    #SelectFirst(count) {
      for (let i = 0; i < count; i++) {
        if (i >= this._filteredData.length) {
          break;
        }
        const rowItem = this._filteredData[i];
        const row = this._GetRowElement(rowItem, false);
        const assetID = rowItem.iteminfo.id;
        if (!this.#selectedRows.has(assetID)) {
          this.#selectedRows.add(assetID);
          row && row.classList.add("cs2s_table_row_selected");
        }
      }
      this.#lastRowClicked = null;
      this._UpdateFooter();
    }
    #DeselectAll() {
      for (const item of this._data) {
        const assetID = item.iteminfo.id;
        if (!this.#selectedRows.has(assetID)) {
          continue;
        }
        this.#selectedRows.delete(assetID);
        const row = this._GetRowElement(item, false);
        row && row.classList.remove("cs2s_table_row_selected");
      }
      this.#lastRowClicked = null;
      this._UpdateFooter();
    }
    _FilterRow(item) {
      const inRange = (value, { min, max }) => {
        return !(typeof value === "undefined" || min != null && value < min || max != null && value > max);
      };
      if (this.#filter?.selected && !this.#selectedRowsSaved.has(item.iteminfo.id)) {
        return false;
      }
      if (this.#filter?.float && !inRange(item.wear, this.#filter.float)) {
        return false;
      }
      if (this.#filter?.seed && !inRange(item.seed, this.#filter.seed)) {
        return false;
      }
      if (this.#filter?.cosmetics && !inRange(item.cosmetics, this.#filter.cosmetics)) {
        return false;
      }
      if (this.#filter?.quality != null && item.quality !== this.#filter.quality) {
        return false;
      }
      if (this.#filter?.rarity) {
        switch (this.#filter.rarity.key) {
          case "weapons":
            if (typeof item.wear === "undefined" || item.type_name === "Gloves") {
              return false;
            }
            break;
          case "agents":
            if (item.type_name !== "Agent") {
              return false;
            }
            break;
          case "other":
            if (typeof item.wear !== "undefined" && item.type_name !== "Gloves" || item.type_name === "Agent") {
              return false;
            }
            break;
        }
        if (item.iteminfo.rarity !== this.#filter.rarity.value) {
          return false;
        }
      }
      if (this.#filter?.type) {
        switch (this.#filter.type.key) {
          case "weapons":
            if (item.weapon_name !== this.#filter.type.value) {
              return false;
            }
            break;
          case "other":
            if (item.type_name !== this.#filter.type.value) {
              return false;
            }
            break;
        }
      }
      if (this.#filter?.collection && item.collection_name !== this.#filter.collection) {
        return false;
      }
      if (this.#searchQuery && this.#searchQuery.length > 0) {
        for (const word of this.#searchQuery) {
          if (!item.name_normalized.includes(word)) {
            return false;
          }
        }
      }
      return true;
    }
    #ShowFilters(button) {
      if (this.#filterables == null) {
        this.#filterables = {
          types: {
            weapons: /* @__PURE__ */ new Set(),
            other: /* @__PURE__ */ new Set()
          },
          qualities: {},
          rarities: {
            weapons: {},
            agents: {},
            other: {}
          },
          float: {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY,
            wears: {}
          },
          seed: {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY
          },
          cosmetics: {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY
          },
          collections: {
            empty_exists: false,
            weapons: /* @__PURE__ */ new Set(),
            stickers: /* @__PURE__ */ new Set(),
            charms: /* @__PURE__ */ new Set(),
            agents: /* @__PURE__ */ new Set(),
            patches: /* @__PURE__ */ new Set(),
            graffiti: /* @__PURE__ */ new Set(),
            other: /* @__PURE__ */ new Set()
          }
        };
        for (const item of this._data) {
          if (item.type_name) {
            this.#filterables.types.other.add(item.type_name);
          }
          if (item.weapon_name) {
            this.#filterables.types.weapons.add(item.weapon_name);
          }
          if (item.quality_name) {
            this.#filterables.qualities[item.quality_name] = item.quality;
          }
          if (item.rarity_name) {
            if (typeof item.wear !== "undefined" && item.type_name !== "Gloves") {
              this.#filterables.rarities.weapons[item.rarity_name] = item.iteminfo.rarity;
            } else if (item.type_name === "Agent") {
              this.#filterables.rarities.agents[item.rarity_name] = item.iteminfo.rarity;
            } else {
              this.#filterables.rarities.other[item.rarity_name] = item.iteminfo.rarity;
            }
          }
          if (typeof item.wear != "undefined") {
            this.#filterables.float.min = Math.min(this.#filterables.float.min, item.wear);
            this.#filterables.float.max = Math.max(this.#filterables.float.max, item.wear);
            this.#filterables.float.wears[Asset.GetWear(item.wear).name] = true;
          }
          if (typeof item.seed != "undefined") {
            this.#filterables.seed.min = Math.min(this.#filterables.seed.min, item.seed);
            this.#filterables.seed.max = Math.max(this.#filterables.seed.max, item.seed);
          }
          {
            const count = Asset.GetNumCosmetics(item);
            this.#filterables.cosmetics.min = Math.min(this.#filterables.cosmetics.min, count);
            this.#filterables.cosmetics.max = Math.max(this.#filterables.cosmetics.max, count);
          }
          if (item.collection_name) {
            if (typeof item.wear !== "undefined") {
              this.#filterables.collections.weapons.add(item.collection_name);
            } else if (item.type_name === "Sticker") {
              this.#filterables.collections.stickers.add(item.collection_name);
            } else if (item.type_name === "Charm") {
              this.#filterables.collections.charms.add(item.collection_name);
            } else if (item.type_name === "Agent") {
              this.#filterables.collections.agents.add(item.collection_name);
            } else if (item.type_name === "Patch") {
              this.#filterables.collections.patches.add(item.collection_name);
            } else if (item.type_name === "Graffiti") {
              this.#filterables.collections.graffiti.add(item.collection_name);
            } else {
              this.#filterables.collections.other.add(item.collection_name);
            }
          } else {
            this.#filterables.collections.empty_exists = true;
          }
        }
        this.#filterables.float.min = Math.floor(this.#filterables.float.min * 100) / 100;
        this.#filterables.float.max = Math.ceil(this.#filterables.float.max * 100) / 100;
      }
      const floatMinValue = FLOAT_RANGE.min;
      const floatMaxValue = FLOAT_RANGE.max;
      const seedMinValue = SEED_RANGE.min;
      const seedMaxValue = SEED_RANGE.max;
      const cosmeticsMinValue = 0;
      const cosmeticsMaxValue = STICKER_MAX_COUNT + KEYCHAIN_MAX_COUNT;
      const type = CreateElement("select", {
        id: "type",
        disabled: Object.values(this.#filterables.types).reduce((sum, set) => sum + (set.size ?? 0), 0) < 2,
        children: [
          CreateElement("option", {
            value: ""
          }),
          ...[
            { key: "other", label: "Base Types" },
            { key: "weapons", label: "Weapon Types" }
          ].filter(({ key }) => this.#filterables.types[key].size > 0).map(
            ({ key, label }) => CreateElement("optgroup", {
              label,
              children: [...this.#filterables.types[key]].sort().map(
                (name) => CreateElement("option", {
                  text: name,
                  value: name,
                  selected: this.#filter?.type?.key === key && this.#filter?.type?.value === name,
                  dataset: {
                    key
                  }
                })
              )
            })
          )
        ]
      });
      if (type.disabled) {
        type.selectedIndex = type.options.length - 1;
      }
      const quality = CreateElement("select", {
        id: "quality",
        disabled: Object.keys(this.#filterables.qualities).length < 2,
        children: [
          CreateElement("option", {
            value: ""
          }),
          ...Object.entries(this.#filterables.qualities).sort(([, v1], [, v2]) => v1 - v2).map(
            ([qualityName, qualityValue]) => CreateElement("option", {
              text: qualityValue == 0 ? "Normal" : qualityName,
              value: qualityValue,
              selected: this.#filter?.quality === qualityValue,
              class: `cs2s_color_quality_${qualityValue}`
            })
          )
        ]
      });
      if (quality.disabled) {
        quality.selectedIndex = quality.options.length - 1;
      }
      const rarity = CreateElement("select", {
        id: "rarity",
        disabled: Object.values(this.#filterables.rarities).reduce((sum, obj) => sum + Object.keys(obj).length, 0) < 2,
        children: [
          CreateElement("option", {
            value: ""
          }),
          ...[
            { key: "weapons", label: "Weapon Qualities" },
            { key: "agents", label: "Agent Qualities" },
            { key: "other", label: "Base Qualities" }
          ].filter(({ key }) => Object.keys(this.#filterables.rarities[key]).length > 0).map(
            ({ key, label }) => CreateElement("optgroup", {
              label,
              children: Object.entries(this.#filterables.rarities[key]).sort(([, v1], [, v2]) => v1 - v2).map(
                ([rarityName, rarityValue]) => CreateElement("option", {
                  text: rarityName,
                  value: rarityValue,
                  selected: this.#filter?.rarity?.key === key && this.#filter?.rarity?.value === rarityValue,
                  class: `cs2s_color_rarity_${rarityValue}`,
                  dataset: {
                    key
                  }
                })
              )
            })
          )
        ]
      });
      if (rarity.disabled) {
        rarity.selectedIndex = rarity.options.length - 1;
      }
      const collection = CreateElement("select", {
        id: "collection",
        disabled: Object.values(this.#filterables.collections).reduce((sum, set) => sum + (set.size ?? 0), 0) < 2 - this.#filterables.collections.empty_exists,
        children: [
          CreateElement("option", {
            value: ""
          }),
          ...[
            { key: "weapons", label: "Weapon Collections" },
            { key: "agents", label: "Agent Collections" },
            { key: "stickers", label: "Sticker Collections" },
            { key: "patches", label: "Patch Collections" },
            { key: "charms", label: "Charm Collections" },
            { key: "graffiti", label: "Graffiti Collections" },
            { key: "other", label: "Other Collections" }
          ].filter(({ key }) => this.#filterables.collections[key].size > 0).map(
            ({ key, label }) => CreateElement("optgroup", {
              label,
              children: [...this.#filterables.collections[key]].sort().map(
                (name) => CreateElement("option", {
                  text: name,
                  value: name,
                  selected: this.#filter?.collection === name
                })
              )
            })
          )
        ]
      });
      if (collection.disabled) {
        collection.selectedIndex = collection.options.length - 1;
      }
      const floatMin = CreateElement("input", {
        id: "float_min",
        type: "number",
        step: 0.01,
        min: floatMinValue,
        max: floatMaxValue,
        placeholder: this.#filterables.float.min === Number.POSITIVE_INFINITY ? "" : this.#filterables.float.min,
        disabled: this.#filterables.float.min === Number.POSITIVE_INFINITY,
        oninput: () => {
          float.value = "custom";
          const value = floatMin.value;
          if (floatMin.checkValidity()) {
            if (value === "") {
              floatMax.min = floatMinValue;
            } else {
              floatMax.min = value;
            }
          }
        }
      });
      const floatMax = CreateElement("input", {
        id: "float_max",
        type: "number",
        step: 0.01,
        min: floatMinValue,
        max: floatMaxValue,
        placeholder: this.#filterables.float.max === Number.NEGATIVE_INFINITY ? "" : this.#filterables.float.max,
        disabled: this.#filterables.float.max === Number.NEGATIVE_INFINITY,
        oninput: () => {
          float.value = "custom";
          const value = floatMax.value;
          if (floatMax.checkValidity()) {
            if (value === "") {
              floatMin.max = floatMaxValue;
            } else {
              floatMin.max = value;
            }
          }
        }
      });
      if (typeof this.#filter?.float?.min !== "undefined" && this.#filter.float.min !== null) {
        floatMin.value = floatMax.min = this.#filter.float.min;
      }
      if (typeof this.#filter?.float?.max !== "undefined" && this.#filter.float.max !== null) {
        floatMax.value = floatMin.max = this.#filter.float.max;
      }
      const float = CreateElement("select", {
        id: "float",
        disabled: this.#filterables.float.max === Number.NEGATIVE_INFINITY,
        children: [
          CreateElement("option", {
            value: ""
          }),
          CreateElement("option", {
            hidden: true,
            value: "custom"
          }),
          ...WEARS.filter((wear) => this.#filterables.float.wears[wear.name] === true).map((wear) => CreateElement("option", {
            value: wear.name,
            text: wear.nameLong,
            selected: this.#filter?.wear === wear.name,
            class: `cs2s_color_wear_${wear.name.toLowerCase()}`
          }))
        ],
        onchange: (event) => {
          const value = event.target.value;
          if (value === "") {
            floatMin.value = "";
            floatMax.value = "";
            floatMin.max = floatMaxValue;
            floatMax.min = floatMinValue;
            return;
          }
          for (const wear of WEARS) {
            if (wear.name === value) {
              floatMin.value = wear.min;
              floatMax.value = wear.max;
              floatMin.max = floatMax.value;
              floatMax.min = floatMin.value;
              return;
            }
          }
        }
      });
      const seedMin = CreateElement("input", {
        id: "seed_min",
        type: "number",
        step: 1,
        min: seedMinValue,
        max: seedMaxValue,
        placeholder: this.#filterables.seed.min === Number.POSITIVE_INFINITY ? "" : this.#filterables.seed.min,
        disabled: this.#filterables.seed.min === Number.POSITIVE_INFINITY,
        oninput: () => {
          const value = seedMin.value;
          if (seedMin.checkValidity()) {
            if (value === "") {
              seedMax.min = seedMinValue;
            } else {
              seedMax.min = value;
            }
          }
        }
      });
      const seedMax = CreateElement("input", {
        id: "seed_max",
        type: "number",
        step: 1,
        min: seedMinValue,
        max: seedMaxValue,
        placeholder: this.#filterables.seed.max === Number.NEGATIVE_INFINITY ? "" : this.#filterables.seed.max,
        disabled: this.#filterables.seed.max === Number.NEGATIVE_INFINITY,
        oninput: () => {
          const value = seedMax.value;
          if (seedMax.checkValidity()) {
            if (value === "") {
              seedMin.max = seedMaxValue;
            } else {
              seedMin.max = value;
            }
          }
        }
      });
      if (typeof this.#filter?.seed?.min !== "undefined" && this.#filter.seed.min !== null) {
        seedMin.value = seedMax.min = this.#filter.seed.min;
      }
      if (typeof this.#filter?.seed?.max !== "undefined" && this.#filter.seed.max !== null) {
        seedMax.value = seedMin.max = this.#filter.seed.max;
      }
      const cosmeticsMin = CreateElement("input", {
        id: "cosmetics_min",
        type: "number",
        step: 1,
        min: cosmeticsMinValue,
        max: cosmeticsMaxValue,
        placeholder: this.#filterables.cosmetics.max === Number.NEGATIVE_INFINITY || this.#filterables.cosmetics.max === 0 ? "" : this.#filterables.cosmetics.min,
        disabled: this.#filterables.cosmetics.max === Number.NEGATIVE_INFINITY || this.#filterables.cosmetics.max === 0,
        oninput: () => {
          const value = cosmeticsMin.value;
          if (cosmeticsMin.checkValidity()) {
            if (value === "") {
              cosmeticsMax.min = cosmeticsMinValue;
            } else {
              cosmeticsMax.min = value;
            }
          }
        }
      });
      const cosmeticsMax = CreateElement("input", {
        id: "cosmetics_max",
        type: "number",
        step: 1,
        min: cosmeticsMinValue,
        max: cosmeticsMaxValue,
        placeholder: this.#filterables.cosmetics.max === Number.NEGATIVE_INFINITY || this.#filterables.cosmetics.max === 0 ? "" : this.#filterables.cosmetics.max,
        disabled: this.#filterables.cosmetics.max === Number.NEGATIVE_INFINITY || this.#filterables.cosmetics.max === 0,
        oninput: () => {
          const value = cosmeticsMax.value;
          if (cosmeticsMax.checkValidity()) {
            if (value === "") {
              cosmeticsMin.max = cosmeticsMaxValue;
            } else {
              cosmeticsMin.max = value;
            }
          }
        }
      });
      if (typeof this.#filter?.cosmetics?.min !== "undefined" && this.#filter.cosmetics.min !== null) {
        cosmeticsMin.value = cosmeticsMax.min = this.#filter.cosmetics.min;
      }
      if (typeof this.#filter?.cosmetics?.max !== "undefined" && this.#filter.cosmetics.max !== null) {
        cosmeticsMax.value = cosmeticsMin.max = this.#filter.cosmetics.max;
      }
      const selected = CreateElement("input", {
        id: "selected",
        type: "checkbox",
        disabled: this.#selectedRows.size == 0
      });
      if (this.#filter?.selected && this.#selectedRows.size > 0) {
        selected.checked = true;
      }
      const form = CreateElement("form", {
        class: "cs2s_settings_form cs2s_settings_filter",
        onreset: () => {
          floatMin.max = floatMaxValue;
          floatMax.min = floatMinValue;
          seedMin.max = seedMaxValue;
          seedMax.min = seedMinValue;
          cosmeticsMin.max = cosmeticsMaxValue;
          cosmeticsMax.min = cosmeticsMinValue;
        },
        children: [
          CreateElement("div", {
            class: "cs2s_settings_form_group_title" + (type.disabled && quality.disabled && rarity.disabled ? " cs2s_settings_form_disabled" : ""),
            text: "Base Filters"
          }),
          CreateElement("div", {
            class: "cs2s_settings_form_group",
            children: [
              CreateElement("div", {
                class: "cs2s_settings_form_group_row",
                children: [
                  CreateElement("div", {
                    class: "cs2s_settings_form_group_item" + (type.disabled ? " cs2s_settings_form_disabled" : ""),
                    children: [
                      CreateElement("label", {
                        text: "Type",
                        for: "type"
                      }),
                      type
                    ]
                  }),
                  CreateElement("div", {
                    class: "cs2s_settings_form_group_item" + (quality.disabled ? " cs2s_settings_form_disabled" : ""),
                    children: [
                      CreateElement("label", {
                        text: "Category",
                        for: "quality"
                      }),
                      quality
                    ]
                  }),
                  CreateElement("div", {
                    class: "cs2s_settings_form_group_item" + (rarity.disabled ? " cs2s_settings_form_disabled" : ""),
                    children: [
                      CreateElement("label", {
                        text: "Quality",
                        for: "rarity"
                      }),
                      rarity
                    ]
                  })
                ]
              })
            ]
          }),
          CreateElement("div", {
            class: "cs2s_settings_form_group_title" + (floatMax.disabled && seedMax.disabled && cosmeticsMax.disabled ? " cs2s_settings_form_disabled" : ""),
            text: "Skin Filters"
          }),
          CreateElement("div", {
            class: "cs2s_settings_form_group",
            children: [
              CreateElement("div", {
                class: "cs2s_settings_form_group_row cs2s_settings_form_group_collection" + (floatMax.disabled ? " cs2s_settings_form_disabled" : ""),
                children: [
                  CreateElement("div", {
                    class: "cs2s_settings_form_group_item",
                    children: [
                      CreateElement("label", {
                        text: "Exterior",
                        for: "float"
                      }),
                      float
                    ]
                  }),
                  CreateElement("div", {
                    class: "cs2s_settings_form_group_item",
                    children: [
                      CreateElement("label", {
                        text: "Float Min",
                        for: "float_min"
                      }),
                      floatMin
                    ]
                  }),
                  CreateElement("div", {
                    class: "cs2s_settings_form_separator",
                    text: "\u2014"
                  }),
                  CreateElement("div", {
                    class: "cs2s_settings_form_group_item",
                    children: [
                      CreateElement("label", {
                        text: "Float Max",
                        for: "float_max"
                      }),
                      floatMax
                    ]
                  })
                ]
              }),
              CreateElement("div", {
                class: "cs2s_settings_form_group_row",
                children: [
                  CreateElement("div", {
                    class: "cs2s_settings_form_group_row cs2s_settings_form_group_collection" + (seedMax.disabled ? " cs2s_settings_form_disabled" : ""),
                    children: [
                      CreateElement("div", {
                        class: "cs2s_settings_form_group_item",
                        children: [
                          CreateElement("label", {
                            text: "Seed Min",
                            for: "seed_min"
                          }),
                          seedMin
                        ]
                      }),
                      CreateElement("div", {
                        class: "cs2s_settings_form_separator",
                        text: "\u2014"
                      }),
                      CreateElement("div", {
                        class: "cs2s_settings_form_group_item",
                        children: [
                          CreateElement("label", {
                            text: "Seed Max",
                            for: "seed_max"
                          }),
                          seedMax
                        ]
                      })
                    ]
                  }),
                  CreateElement("div", {
                    class: "cs2s_settings_form_separator",
                    text: " "
                  }),
                  CreateElement("div", {
                    class: "cs2s_settings_form_group_row cs2s_settings_form_group_collection" + (cosmeticsMax.disabled ? " cs2s_settings_form_disabled" : ""),
                    children: [
                      CreateElement("div", {
                        class: "cs2s_settings_form_group_item",
                        children: [
                          CreateElement("label", {
                            text: "Num Cosmetics Min",
                            for: "cosmetics_min"
                          }),
                          cosmeticsMin
                        ]
                      }),
                      CreateElement("div", {
                        class: "cs2s_settings_form_separator",
                        text: "\u2014"
                      }),
                      CreateElement("div", {
                        class: "cs2s_settings_form_group_item",
                        children: [
                          CreateElement("label", {
                            text: "Num Cosmetics Max",
                            for: "cosmetics_max"
                          }),
                          cosmeticsMax
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),
          CreateElement("div", {
            class: "cs2s_settings_form_group_title" + (collection.disabled && selected.disabled ? " cs2s_settings_form_disabled" : ""),
            text: "Group Filters"
          }),
          CreateElement("div", {
            class: "cs2s_settings_form_group",
            children: [
              CreateElement("div", {
                class: "cs2s_settings_form_group_item" + (collection.disabled ? " cs2s_settings_form_disabled" : ""),
                children: [
                  CreateElement("label", {
                    text: "Collection",
                    for: "collection"
                  }),
                  collection
                ]
              }),
              CreateElement("div", {
                class: "cs2s_settings_form_group_item cs2s_settings_form_group_item_checkbox" + (selected.disabled ? " cs2s_settings_form_disabled" : ""),
                children: [
                  selected,
                  CreateElement("label", {
                    text: "Show only selected items",
                    for: "selected"
                  })
                ]
              })
            ]
          }),
          CreateElement("div", {
            class: "cs2s_settings_form_submit_group",
            children: [
              CreateElement("button", {
                class: "cs2s_blue_long_button",
                type: "submit",
                text: "Filter"
              }),
              CreateElement("button", {
                class: "cs2s_grey_long_button",
                type: "reset",
                text: "Reset"
              }),
              CreateElement("button", {
                class: "cs2s_grey_long_button",
                id: "form_cancel",
                text: "Cancel"
              })
            ]
          })
        ]
      });
      const popup = new Popup({
        title: "Filter Items",
        body: [form],
        popoverMode: true,
        onclose: () => {
          this._tableContainerElement.focus();
        }
      });
      form.querySelector("#form_cancel").onclick = () => {
        popup.Hide();
      };
      form.onsubmit = (event) => {
        event.preventDefault();
        this.#filter = {
          type: type.disabled || type.selectedIndex == 0 ? null : {
            key: type.selectedOptions[0].dataset.key,
            value: type.value
          },
          quality: quality.disabled || quality.selectedIndex == 0 ? null : parseInt(quality.value),
          rarity: rarity.disabled || rarity.selectedIndex == 0 ? null : {
            key: rarity.selectedOptions[0].dataset.key,
            value: parseInt(rarity.value)
          },
          wear: float.value == "" ? null : float.value,
          float: floatMin.value == "" && floatMax.value == "" ? null : {
            min: floatMin.value == "" ? null : parseFloat(floatMin.value),
            max: floatMax.value == "" ? null : parseFloat(floatMax.value)
          },
          seed: seedMin.value == "" && seedMax.value == "" ? null : {
            min: seedMin.value == "" ? null : parseInt(seedMin.value),
            max: seedMax.value == "" ? null : parseInt(seedMax.value)
          },
          cosmetics: cosmeticsMin.value == "" && cosmeticsMax.value == "" ? null : {
            min: cosmeticsMin.value == "" ? null : parseInt(cosmeticsMin.value),
            max: cosmeticsMax.value == "" ? null : parseInt(cosmeticsMax.value)
          },
          collection: collection.disabled || collection.selectedIndex == 0 ? null : collection.value,
          selected: selected.checked ? true : null
        };
        this.#selectedRowsSaved = new Set(this.#selectedRows);
        if (Object.values(this.#filter).every((value) => value === null)) {
          this.#filter = null;
        }
        if (this.#filter === null) {
          button.classList.remove("cs2s_table_footer_action_link_active");
        } else {
          button.classList.add("cs2s_table_footer_action_link_active");
        }
        popup.Hide();
        this._FilterRows();
      };
      popup.Show();
    }
    async #ProcessSelected() {
      if (this.#selectedRows.size == 0) {
        return;
      }
      const numItemsToProcess = this.#selectedRows.size;
      const itemWindow = CreateElement("div", {
        class: "cs2s_action_item_window"
      });
      const progressMessage = CreateElement("div", {
        class: "cs2s_action_message",
        text: this.#mode == _ItemTable.MODE.RETRIEVE ? "Retrieving Items" : "Storing Items"
      });
      const progressBar = CreateElement("div", {
        class: "cs2s_action_progress_bar",
        vars: {
          "percentage": "0%"
        }
      });
      const closeButton = CreateElement("div", {
        class: "cs2s_grey_long_button",
        text: "Cancel"
      });
      const popupBody = CreateElement("div", {
        class: "cs2s_action_body",
        children: [
          itemWindow,
          progressMessage,
          progressBar,
          closeButton
        ]
      });
      const worker = new Worker({
        concurrentLimit: 6,
        delay: 1e3 / 6
      });
      const popup = new Popup({
        title: this.#mode == _ItemTable.MODE.RETRIEVE ? "Retrieving From Storage Unit" : "Moving To Storage Unit",
        body: [popupBody],
        simpleMode: true,
        popoverMode: true,
        onclose: () => {
          this._tableContainerElement.focus();
          worker.Cancel();
        }
      });
      closeButton.onclick = () => {
        popup.Hide();
      };
      popup.Show();
      let numItemsProcessed = 0;
      for (const assetID of this.#selectedRows) {
        worker.Add(async () => {
          const item = this._data.find((item2) => item2.iteminfo.id == assetID);
          const itemImage = CreateElement("div", {
            class: "cs2s_action_item_window_image",
            html: this._GetRowElement(item).children[0].innerHTML
          });
          const maxAttempts = 3;
          for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (worker.cancelled) {
              return;
            }
            try {
              if (this.#mode == _ItemTable.MODE.RETRIEVE) {
                await this.#inventory.RetrieveItem(item);
              } else {
                await this.#inventory.StoreItem(item, this.#casket);
              }
              break;
            } catch (e) {
              if (worker.cancelled || e.code === 504 && attempt < maxAttempts) {
                script_default.ShowError({ level: ERROR_LEVEL.LOW }, e);
                await Sleep(Random(1e3, 2e3));
                continue;
              }
              worker.Cancel();
              popup.Hide();
              script_default.ShowError({ level: ERROR_LEVEL.HIGH }, e, new Error(`Failed to ${this.#mode == _ItemTable.MODE.RETRIEVE ? "retrieve" : "store"} "${item.full_name}".  If errors persist, reload the page and try again.`));
              return;
            }
          }
          const dataIndex = this._data.findIndex((item2) => item2.iteminfo.id == assetID);
          this._data.splice(dataIndex, 1);
          const filteredDataIndex = this._filteredData.findIndex((item2) => item2.iteminfo.id == assetID);
          filteredDataIndex != -1 && this._filteredData.splice(filteredDataIndex, 1);
          this.#selectedRows.delete(assetID);
          this.#selectionLimit--;
          this.#inventoryChanged = true;
          this._UpdateTable();
          numItemsProcessed++;
          progressMessage.innerText = (this.#mode == _ItemTable.MODE.RETRIEVE ? "Retrieving Items" : "Storing Items") + ` (${numItemsProcessed}/${numItemsToProcess})`;
          progressBar.style.setProperty("--percentage", `${(numItemsProcessed / numItemsToProcess * 100).toFixed(2)}%`);
          itemWindow.append(itemImage);
          const transform = getComputedStyle(itemImage).transform;
          itemImage.style.transformOrigin = "50% 700%";
          const rotateStart = Random(-20, -10);
          const rotateEnd = Random(10, 20);
          const scaleEnd = Random(0.7, 0.8);
          const translateYEnd = Random(-215, -165);
          const duration = Random(700, 800);
          const itemAnimationIn = itemImage.animate([
            { transform: `${transform} rotate(${rotateStart}deg)`, opacity: 0.75, offset: 0 },
            { opacity: 1, filter: "brightness(1)", offset: 0.5 },
            { transform: `${transform} rotate(${rotateEnd}deg) scale(${scaleEnd}) translateY(${translateYEnd}%)`, opacity: 0.5, filter: "brightness(0.1)", offset: 1 }
          ], {
            duration,
            easing: "cubic-bezier(.15, .50, .85, .50)"
          });
          itemAnimationIn.onfinish = () => {
            itemImage.remove();
          };
        });
      }
      worker.Run();
      await worker.Finish();
      await Sleep(1e3);
      popup.Hide();
    }
  };

  // src/components/label_popup.js
  var LabelPopup = class {
    #casket;
    #inventory;
    constructor(casket, inventory) {
      this.#casket = casket;
      this.#inventory = inventory;
    }
    Show() {
      let prompt2;
      let placeholder;
      if (this.#casket.attributes["custom name attr"]) {
        prompt2 = `Enter a new descriptive label for this Storage Unit.`;
        placeholder = this.#casket.attributes["custom name attr"];
      } else {
        prompt2 = "Enter a descriptive label for your personal Storage Unit and start using it for storing items.";
        placeholder = "New name";
      }
      const renameForm = CreateElement("form", {
        class: "cs2s_settings_form",
        html: (
          /*html*/
          `
					<div class="cs2s_settings_form_group_item">
						<label for="storage_unit_name">
							${prompt2}
						</label>
						<input type="text" name="storage_unit_name" placeholder="${placeholder}" maxlength="20">
					</div>
				
				<div class="cs2s_settings_form_submit_group">
					<button class="cs2s_blue_long_button" type="submit">Personalize</button>
					<button class="cs2s_grey_long_button" id="form_cancel" type="button">Cancel</button>
				</div>
			`
        ),
        onsubmit: async (event) => {
          event.preventDefault();
          let name = renameForm.elements["storage_unit_name"].value || renameForm.elements["storage_unit_name"].placeholder;
          if (!script_default.Bot?.Plugin?.Connected) {
            script_default.ShowStartInterfacePrompt({
              message: "Interface must be running to personalize storage units",
              autoClose: true,
              popoverMode: true,
              fade: false,
              onconnected: () => {
                popup.Hide();
                this.#LabelItem(name);
              }
            });
            return;
          }
          popup.Hide();
          this.#LabelItem(name);
        }
      });
      const popup = new Popup({
        title: "Personalize Your Storage Unit",
        fade: false,
        body: [CreateElement("div", {
          class: "cs2s_action_body",
          children: [
            renameForm
          ]
        })]
      });
      renameForm.querySelector("#form_cancel").onclick = () => {
        popup.Hide();
      };
      popup.Show();
    }
    async #LabelItem(name) {
      const loadingBody = CreateElement("div", {
        class: "cs2s_action_body",
        children: [
          CreateElement("div", {
            class: "cs2s_action_spinner"
          })
        ]
      });
      const successButton = CreateElement("div", {
        class: "cs2s_blue_long_button",
        text: "OK"
      });
      const successBody = CreateElement("div", {
        class: "cs2s_action_body",
        children: [
          CreateElement("div", {
            class: "cs2s_action_message cs2s_action_message_tall",
            text: "Storage Unit successfully labeled"
          }),
          successButton
        ]
      });
      let storageUnitRenamed = false;
      const progressPopup = new Popup({
        simpleMode: true,
        disableClose: true,
        fade: false,
        title: "Labeling Storage Unit",
        body: [
          loadingBody,
          successBody
        ],
        onclose: () => {
          if (storageUnitRenamed) {
            window.location.reload();
          }
        }
      });
      successBody.hide();
      successButton.onclick = () => {
        progressPopup.Hide();
      };
      progressPopup.Show();
      try {
        await this.#inventory.LabelStorageUnit(this.#casket, name);
        storageUnitRenamed = true;
      } catch (e) {
        progressPopup.Hide();
        script_default.ShowError({ level: ERROR_LEVEL.HIGH }, e, new Error(`Failed to label storage unit.`));
        return;
      }
      loadingBody.hide();
      successBody.show();
    }
  };

  // src/cs2/items/assets/inventory_asset.js
  var InventoryAsset = class _InventoryAsset extends Asset {
    _asset;
    #isTradeProtected;
    static #inventoryWorker = new Worker({
      concurrentLimit: 100
    });
    constructor(asset) {
      super();
      this._asset = asset;
      this._assetid = asset.assetid;
      this.#isTradeProtected = asset.contextid == 16;
      if (asset.description.market_hash_name == "Storage Unit") {
        this._type = Asset.TYPE.STORAGE_UNIT;
      } else {
        for (const tag of asset.description.tags) {
          if (tag.category == "Weapon" || tag.internal_name == "Type_Hands") {
            this._type = Asset.TYPE.WEARABLE;
            break;
          } else if (tag.internal_name == "CSGO_Tool_Keychain") {
            this._type = Asset.TYPE.KEYCHAIN;
            break;
          }
        }
      }
      if (this._type == Asset.TYPE.WEARABLE) {
        for (const action of asset.description.actions) {
          if (action.link.includes("steam://rungame")) {
            this._inspectLink = action.link.replace("%owner_steamid%", unsafeWindow.g_ActiveUser.strSteamId).replace("%assetid%", asset.assetid);
            break;
          }
        }
      }
    }
    // Add additional information to each inventory item square
    async BuildInventoryUI() {
      if (this.ShouldInspect() && GetSetting(SETTING_INSPECT_ITEMS)) {
        const float = parseFloat(this.GetProperty(2)?.float_value);
        const seed = this.GetProperty(1)?.int_value;
        const rarity = RARITIES[this.GetTags("Rarity")[0]?.internal_name];
        const qualities = this.GetTags("Quality").map((tag) => QUALITIES[tag.internal_name]);
        const unusual = qualities.includes(3);
        const stattrak = qualities.includes(9);
        const souvenir = qualities.includes(12);
        const keychainInfo = this.GetDescription("keychain_info");
        const stickerInfo = this.GetDescription("sticker_info");
        let floatElement;
        if (float || float === 0) {
          floatElement = CreateElement("div", {
            class: `cs2s_asset_wear cs2s_asset_wear_${Asset.GetWear(float).name.toLowerCase()}`,
            text: float.toFixed(this.#isTradeProtected ? 7 : 11)
          });
          this._asset.element.append(floatElement);
        }
        if (seed || seed === 0) {
          this._asset.element.append(
            CreateElement("div", {
              class: "cs2s_asset_seed",
              text: seed
            })
          );
        }
        if (rarity || rarity === 0) {
          const rarityElement = CreateElement("div", {
            class: `cs2s_asset_rarity cs2s_asset_rarity_${rarity}`
          });
          if (unusual) {
            rarityElement.classList.add("cs2s_asset_unusual");
          }
          if (stattrak) {
            rarityElement.classList.add("cs2s_asset_stattrak");
          }
          if (souvenir) {
            rarityElement.classList.add("cs2s_asset_souvenir");
          }
          this._asset.element.append(rarityElement);
        }
        if (keychainInfo || stickerInfo) {
          const keychainElements = [];
          if (keychainInfo) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(keychainInfo, "text/html");
            for (const img of doc.querySelectorAll("img")) {
              keychainElements.push(CreateElement("img", {
                src: img.src
              }));
            }
          }
          const stickerElements = [];
          if (stickerInfo) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(stickerInfo, "text/html");
            for (const img of doc.querySelectorAll("img")) {
              stickerElements.push(CreateElement("img", {
                src: img.src
              }));
            }
          }
          if (keychainElements.length > 0 || stickerElements.length > 0) {
            this._asset.element.append(
              CreateElement("div", {
                class: "cs2s_asset_cosmetics" + (this.#isTradeProtected ? " cs2s_asset_trade_protected" : ""),
                children: [...keychainElements, ...stickerElements]
              })
            );
          }
        }
        {
          const build = () => {
            if (!this._inspectData) {
              return;
            }
            if (floatElement && this._inspectData.wear && this._wearData) {
              floatElement.innerText = this._inspectData.wear.toFixed(this.#isTradeProtected ? 2 : 6);
              floatElement.append(" ", this._GetPercentileElement());
            }
          };
          let cached;
          try {
            cached = await this._Inspect({ cacheOnly: true });
          } catch (e) {
            script_default.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
            return;
          }
          if (cached) {
            build();
          } else {
            Asset._inspectionWorker.Add(async () => {
              try {
                await this._Inspect();
              } catch (e) {
                script_default.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
                return;
              }
              build();
            });
            Asset._inspectionWorker.Run();
          }
        }
      } else if (this._type == Asset.TYPE.KEYCHAIN && GetSetting(SETTING_INSPECT_ITEMS)) {
        const template = this.GetProperty(3)?.int_value;
        if (template) {
          this._asset.element.append(
            CreateElement("div", {
              class: "cs2s_asset_seed",
              text: template
            })
          );
        }
      } else if (this._type == Asset.TYPE.STORAGE_UNIT) {
        const itemCount = this.GetDescription("attr: items count", /\d+/)?.[0];
        if (itemCount) {
          this._asset.element.append(
            CreateElement("div", {
              class: "cs2s_asset_quantity",
              text: itemCount
            })
          );
        }
        _InventoryAsset.#inventoryWorker.Add(async () => {
          const inventory = await script_default.GetInventory();
          if (!(inventory instanceof Inventory)) {
            return;
          }
          const nameTag = inventory.items.find((x) => x.iteminfo.id == this._assetid)?.attributes["custom name attr"];
          if (nameTag) {
            this._asset.element.append(
              CreateElement("div", {
                class: "cs2s_asset_name",
                text: nameTag
              })
            );
          }
        });
        _InventoryAsset.#inventoryWorker.Run();
      }
    }
    // Add additional information the currently selected inventory item
    async BuildSelectedUI() {
      const selectedItem = unsafeWindow.iActiveSelectView;
      const descriptionsElement = unsafeWindow.document.getElementById(`iteminfo${selectedItem}`).querySelector(":scope > div > div > div > div > div > div:nth-child(5)");
      const stickerElements = descriptionsElement.getElementsBySelector("#sticker_info img");
      const charmElements = descriptionsElement.getElementsBySelector("#keychain_info img");
      const ownerActionsElement = unsafeWindow.document.getElementById(`iteminfo${selectedItem}`).querySelector(":scope > div > div > div > div > div > div:nth-child(7)");
      if (this.ShouldInspect() && GetSetting(SETTING_INSPECT_ITEMS)) {
        const build = () => {
          if (selectedItem != unsafeWindow.iActiveSelectView || this._asset != unsafeWindow.g_ActiveInventory.selectedItem || !this._inspectData) {
            return;
          }
          if (this._inspectData.wear && this._inspectData.seed) {
            descriptionsElement.prepend(
              this._GetWearRangeElement(),
              CreateElement("div", {
                class: "cs2s_descriptor cs2s_element",
                text: `Float: ${this._inspectData.wear.toFixed(14)}`,
                children: [
                  " ",
                  this._GetPercentileElement({ showTooltip: true, rounded: false })
                ]
              }),
              CreateElement("div", {
                class: "cs2s_descriptor cs2s_element",
                text: `Seed: ${this._inspectData.seed}`
              }),
              CreateElement("div", {
                class: "cs2s_descriptor cs2s_element",
                text: "\xA0"
              })
            );
          }
          if (this._inspectData.stickers) {
            for (let i = 0; i < this._inspectData.stickers.length; i++) {
              if (typeof stickerElements[i] == "undefined") {
                break;
              }
              stickerElements[i].wrap(
                CreateElement("span", {
                  class: "cs2s_asset_sticker_wear cs2s_element",
                  wear: Math.round(this._inspectData.stickers[i] * 100)
                })
              );
            }
          }
          if (this._inspectData.charm) {
            if (typeof charmElements[0] != "undefined") {
              charmElements[0].wrap(
                CreateElement("span", {
                  class: "cs2s_asset_charm_template cs2s_element",
                  template: this._inspectData.charm
                })
              );
            }
          }
        };
        let cached;
        try {
          cached = await this._Inspect({ cacheOnly: true });
        } catch (e) {
          script_default.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
          return;
        }
        if (cached) {
          build();
        } else {
          Asset._inspectionWorker.Add(async () => {
            try {
              await this._Inspect();
            } catch (e) {
              script_default.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
              return;
            }
            build();
          }, {
            priority: true
          });
          Asset._inspectionWorker.Run();
        }
      } else if (this._type == Asset.TYPE.STORAGE_UNIT) {
        const isLabeled = !!this.GetDescription("attr: items count");
        if (isLabeled) {
          ownerActionsElement.classList.add("cs2s_button_row");
          ownerActionsElement.append(
            CreateElement("a", {
              class: "cs2s_small_grey_button cs2s_element",
              html: "<span>Retrieve Items</span>",
              onclick: async () => {
                const inventory = await script_default.GetInventory({ showProgress: true });
                if (inventory === OPERATION_ERROR.INTERFACE_NOT_CONNECTED) {
                  script_default.ShowStartInterfacePrompt({
                    message: "Inventory not cached.  Please start the interface",
                    fade: false
                  });
                  return;
                }
                if (inventory === OPERATION_ERROR.FAILED_TO_LOAD) {
                  script_default.ShowError({ level: ERROR_LEVEL.HIGH }, new Error("Inventory failed to load, check error logs and refresh the page to try again"));
                  return;
                }
                if (!(inventory instanceof Inventory)) {
                  return;
                }
                const casket = inventory.items.find((x) => x.iteminfo.id == this._assetid);
                if (!casket) {
                  script_default.ShowStartInterfacePrompt({
                    message: "Storage unit not cached.  Please start the interface",
                    autoClose: true,
                    popoverMode: true,
                    fade: false,
                    onconnected: () => {
                      window.location.reload();
                    }
                  });
                  return;
                }
                const casketItems = inventory.storedItems.filter((x) => x.casket_id == this._assetid);
                if (casketItems.length == 0) {
                  script_default.ShowMessage({}, "Storage Unit is empty");
                  return;
                }
                const table = new ItemTable(casketItems, inventory, {
                  mode: ItemTable.MODE.RETRIEVE,
                  casket,
                  casketName: casket.attributes["custom name attr"]
                });
                table.Show();
              }
            }),
            CreateElement("a", {
              class: "cs2s_small_grey_button cs2s_element",
              html: "<span>Deposit Items</span>",
              onclick: async () => {
                const inventory = await script_default.GetInventory({ showProgress: true });
                if (inventory === OPERATION_ERROR.INTERFACE_NOT_CONNECTED) {
                  script_default.ShowStartInterfacePrompt({
                    message: "Inventory not cached.  Please start the interface"
                  });
                  return;
                }
                if (inventory === OPERATION_ERROR.FAILED_TO_LOAD) {
                  script_default.ShowError({ level: ERROR_LEVEL.HIGH }, new Error("Inventory failed to load, check error logs and refresh the page to try again"));
                  return;
                }
                if (!(inventory instanceof Inventory)) {
                  return;
                }
                const casket = inventory.items.find((x) => x.iteminfo.id == this._assetid);
                if (!casket) {
                  script_default.ShowStartInterfacePrompt({
                    message: "Storage unit not cached.  Please start the interface",
                    autoClose: true,
                    popoverMode: true,
                    fade: false,
                    onconnected: () => {
                      window.location.reload();
                    }
                  });
                  return;
                }
                const moveableItems = inventory.items.filter((x) => x.moveable);
                if (moveableItems.length == 0) {
                  script_default.ShowMessage({}, "Inventory has no storable items");
                  return;
                }
                const table = new ItemTable(moveableItems, inventory, {
                  mode: ItemTable.MODE.STORE,
                  casket,
                  casketName: casket.attributes["custom name attr"]
                });
                table.Show();
              }
            }),
            CreateElement("a", {
              class: "cs2s_small_grey_button cs2s_element",
              html: "<span>Change Label</span>",
              onclick: async () => {
                const inventory = await script_default.GetInventory({ showProgress: true });
                if (inventory === OPERATION_ERROR.INTERFACE_NOT_CONNECTED) {
                  script_default.ShowStartInterfacePrompt({
                    message: "Inventory not cached.  Please start the interface"
                  });
                  return;
                }
                if (inventory === OPERATION_ERROR.FAILED_TO_LOAD) {
                  script_default.ShowError({ level: ERROR_LEVEL.HIGH }, new Error("Inventory failed to load, check error logs and refresh the page to try again"));
                  return;
                }
                if (!(inventory instanceof Inventory)) {
                  return;
                }
                const casket = inventory.items.find((x) => x.iteminfo.id == this._assetid);
                if (!casket) {
                  script_default.ShowStartInterfacePrompt({
                    message: "Storage unit not cached.  Please start the interface",
                    autoClose: true,
                    popoverMode: true,
                    fade: false,
                    onconnected: () => {
                      window.location.reload();
                    }
                  });
                  return;
                }
                const nameForm = new LabelPopup(casket, inventory);
                nameForm.Show();
              }
            })
          );
          _InventoryAsset.#inventoryWorker.Add(async () => {
            const inventory = await script_default.GetInventory();
            if (!(inventory instanceof Inventory)) {
              return;
            }
            if (selectedItem != unsafeWindow.iActiveSelectView || this._asset != unsafeWindow.g_ActiveInventory.selectedItem) {
              return;
            }
            const nameTag = inventory.items.find((x) => x.iteminfo.id == this._assetid)?.attributes["custom name attr"];
            if (nameTag) {
              descriptionsElement.prepend(
                CreateElement("div", {
                  class: "cs2s_descriptor_blue cs2s_element",
                  text: `Name Tag: "${nameTag}"`
                }),
                CreateElement("div", {
                  class: "cs2s_descriptor cs2s_element",
                  text: "\xA0"
                })
              );
            }
          });
          _InventoryAsset.#inventoryWorker.Run();
        } else {
          ownerActionsElement.classList.add("cs2s_button_row");
          ownerActionsElement.append(
            CreateElement("a", {
              class: "cs2s_small_grey_button cs2s_element",
              html: "<span>Start Using This Unit</span>",
              onclick: async () => {
                const inventory = await script_default.GetInventory({ showProgress: true });
                if (inventory === OPERATION_ERROR.INTERFACE_NOT_CONNECTED) {
                  script_default.ShowStartInterfacePrompt({
                    message: "Inventory not cached.  Please start the interface"
                  });
                  return;
                }
                if (inventory === OPERATION_ERROR.FAILED_TO_LOAD) {
                  script_default.ShowError({ level: ERROR_LEVEL.HIGH }, new Error("Inventory failed to load, check error logs and refresh the page to try again"));
                  return;
                }
                if (!(inventory instanceof Inventory)) {
                  return;
                }
                const casket = inventory.items.find((x) => x.iteminfo.id == this._assetid);
                if (!casket) {
                  script_default.ShowStartInterfacePrompt({
                    message: "Storage unit not cached.  Please start the interface",
                    autoClose: true,
                    popoverMode: true,
                    fade: false,
                    onconnected: () => {
                      window.location.reload();
                    }
                  });
                  return;
                }
                const nameForm = new LabelPopup(casket, inventory);
                nameForm.Show();
              }
            })
          );
        }
      }
    }
    GetDescription(name, regex = null) {
      if (!this._asset.description?.descriptions) {
        return;
      }
      for (const description of this._asset.description.descriptions) {
        if (description.name == name) {
          if (regex) {
            const matches = description.value.match(regex);
            if (!matches) {
              return null;
            }
            return matches;
          }
          return description.value;
        }
      }
    }
    GetProperty(id) {
      if (!this._asset.asset_properties) {
        return;
      }
      for (const property of this._asset.asset_properties) {
        if (property.propertyid == id) {
          return property;
        }
      }
    }
    GetTags(category) {
      if (!this._asset.description?.tags) {
        return;
      }
      let tags = [];
      for (const tag of this._asset.description.tags) {
        if (tag.category == category) {
          tags.push(tag);
        }
      }
      return tags;
    }
  };

  // src/components/store_table.js
  var StoreTable = class _StoreTable extends Table {
    #store;
    #tab = _StoreTable.TAB.GENERAL;
    #selectedItem = null;
    #inventoryChanged = false;
    #searchQuery = null;
    #teamsSearchQuery = null;
    #defaultSort = {
      columns: ["default_sort_order"],
      direction: Table.SORT_DIRECTION.ASC
    };
    #actionButtonElement;
    #oldNotificationElement;
    static TAB = {
      GENERAL: 0,
      TOOLS: 1,
      TOURNAMENT_CAPSULES: 2,
      TOURNAMENT_SOUVENIRS: 3
    };
    constructor(store) {
      super();
      this.#store = store;
      this.#store.items.sort((a, b) => {
        if (a.discount && !b.discount) {
          return -1;
        }
        if (!a.discount && b.discount) {
          return 1;
        }
        if (a.layout_weight !== b.layout_weight) {
          if (typeof a.layout_weight === "undefined") {
            return 1;
          }
          if (typeof b.layout_weight === "undefined") {
            return -1;
          }
          return b.layout_weight - a.layout_weight;
        }
        if (a.supplemental_data && b.supplemental_data) {
          if (a.supplemental_data > b.supplemental_data) {
            return -1;
          }
          if (a.supplemental_data < b.supplemental_data) {
            return 1;
          }
        }
        return a.id - b.id;
      });
      for (let i = 0; i < this.#store.items.length; i++) {
        this.#store.items[i].default_sort_order = i;
      }
      const cachedNotificationElement = CreateElement("span", {
        text: "(Cached)"
      });
      BindTooltip(cachedNotificationElement, "The information below was loaded from cache and may no longer be accurate.");
      this.#oldNotificationElement = CreateElement("span", {
        text: "(Old)",
        style: {
          display: "none"
        }
      });
      BindTooltip(this.#oldNotificationElement, "The information below may be outdated and will be updated when the page is refreshed.");
      const tableHeaderElement = CreateElement("thead", {
        children: [
          CreateElement("tr", {
            children: [
              CreateElement("th", {
                class: "cs2s_table_image_column"
              }),
              CreateElement("th", {
                class: "cs2s_table_store_name_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    text: "Name",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["name", "default_sort_order"] });
                    }
                  }),
                  CreateElement("span", {
                    class: "cs2s_table_column_search cs2s_resizable_input",
                    children: [
                      CreateElement("input", {
                        type: "search",
                        placeholder: "Search",
                        oninput: (event) => {
                          event.target.style.width = "0px";
                          event.target.parentNode.dataset.value = event.target.value || event.target.placeholder;
                          event.target.style.width = `${event.target.parentNode.clientWidth}px`;
                          this.#searchQuery = event.currentTarget.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ").filter((word) => word.length > 0);
                          this._FilterRows();
                        }
                      })
                    ]
                  })
                ]
              }),
              CreateElement("th", {
                class: "cs2s_table_store_type_match_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    id: "type_column",
                    text: "Type",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["type", "name", "default_sort_order"] });
                    }
                  }),
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    id: "teams_column",
                    style: {
                      "display": "none"
                    },
                    text: "Match",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["supplemental_data"] });
                    }
                  }),
                  CreateElement("span", {
                    class: "cs2s_table_column_search cs2s_resizable_input",
                    id: "teams_search",
                    style: {
                      "display": "none"
                    },
                    children: [
                      CreateElement("input", {
                        type: "search",
                        placeholder: "Team Search",
                        oninput: (event) => {
                          event.target.style.width = "0px";
                          event.target.parentNode.dataset.value = event.target.value || event.target.placeholder;
                          event.target.style.width = `${event.target.parentNode.clientWidth}px`;
                          this.#teamsSearchQuery = event.currentTarget.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ").filter((word) => word.length > 0);
                          this._FilterRows();
                        }
                      })
                    ]
                  })
                ]
              }),
              this.#store.inventoryLoaded && CreateElement("th", {
                class: "cs2s_table_store_owned_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    id: "owned_column",
                    text: "Owned",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["owned"] });
                    }
                  }),
                  this.#store.inventoryLoadedFromCache && cachedNotificationElement,
                  this.#oldNotificationElement
                ]
              }),
              CreateElement("th", {
                class: "cs2s_table_store_price_column",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_column",
                    text: "Price",
                    children: [
                      CreateElement("div", {
                        class: "cs2s_table_column_sort"
                      })
                    ],
                    onclick: (event) => {
                      this._SortRows({ event, columns: ["price", "default_sort_order"] });
                    }
                  })
                ]
              })
            ]
          })
        ]
      });
      this.#actionButtonElement = CreateElement("a", {
        class: "cs2s_green_button cs2s_button_disabled",
        html: "<span>Proceed...</span>",
        onclick: () => {
          if (this.#actionButtonElement.classList.contains("cs2s_button_disabled")) {
            return;
          }
          this.#ProcessSelected();
        }
      });
      const tableFooterElement = CreateElement("div", {
        class: "cs2s_table_footer cs2s_popup_footer",
        children: [
          CreateElement("div", {
            class: "cs2s_table_footer_element_left",
            children: [
              CreateElement("a", {
                class: "cs2s_table_footer_action_link cs2s_table_footer_action_link_no_icon cs2s_table_footer_action_link_active",
                text: "General",
                onclick: (event) => {
                  this.#ChangeTab(event.currentTarget, _StoreTable.TAB.GENERAL);
                }
              }),
              CreateElement("a", {
                class: "cs2s_table_footer_action_link cs2s_table_footer_action_link_no_icon",
                text: "Tools",
                onclick: (event) => {
                  this.#ChangeTab(event.currentTarget, _StoreTable.TAB.TOOLS);
                }
              }),
              this.#store.items.find((item) => item.tournament_id) && CreateElement("a", {
                class: "cs2s_table_footer_action_link cs2s_table_footer_action_link_no_icon",
                text: "Tournament",
                onclick: (event) => {
                  this.#ChangeTab(event.currentTarget, _StoreTable.TAB.TOURNAMENT_CAPSULES);
                }
              }),
              this.#store.items.find((item) => item.requires_supplemental_data) && CreateElement("a", {
                class: "cs2s_table_footer_action_link cs2s_table_footer_action_link_no_icon",
                text: "Tournament Souvenirs",
                onclick: (event) => {
                  this.#ChangeTab(event.currentTarget, _StoreTable.TAB.TOURNAMENT_SOUVENIRS);
                }
              })
            ]
          }),
          CreateElement("div", {
            class: "cs2s_table_footer_element_right",
            children: [
              this.#actionButtonElement
            ]
          })
        ]
      });
      this._CreateTable(
        this.#store.items,
        tableHeaderElement,
        tableFooterElement,
        {
          defaultSort: this.#defaultSort,
          popupTitle: "Select an item to purchase",
          popupOnClose: () => {
            if (this.#inventoryChanged) {
              window.location.reload();
            }
          }
        }
      );
    }
    _GetRowElement(item) {
      if (item.element) {
        return item.element;
      }
      item.element = CreateElement("tr", {
        onmousedown: (event) => {
          if (event.target.nodeName === "A" || event.target.parentElement.nodeName === "A" || event.button !== 0) {
            return;
          }
          this.#SelectItem(item);
        },
        children: [
          CreateElement("td", {
            class: "cs2s_table_image_column",
            children: [
              CreateElement("img", {
                src: item.requires_supplemental_data ? Icons.GetIconURL(item.alt_image_name, "93fx62f") ?? Icons.GetIconURL(item.image_name, "93fx62f") : Icons.GetIconURL(item.image_name, "93fx62f")
              })
            ]
          }),
          CreateElement("td", {
            class: "cs2s_table_name_column cs2s_table_store_name_column",
            text: item.name,
            children: [
              CreateElement("a", {
                href: `https://steamcommunity.com/market/listings/${CS2_APPID}/${encodeURIComponent(item.hash_name)}`,
                target: "_blank",
                html: (
                  /*html*/
                  `
								<svg viewBox="0 0 64 64" stroke-width="3" stroke="currentColor" fill="none">
									<path d="M55.4,32V53.58a1.81,1.81,0,0,1-1.82,1.82H10.42A1.81,1.81,0,0,1,8.6,53.58V10.42A1.81,1.81,0,0,1,10.42,8.6H32"/>
									<polyline points="40.32 8.6 55.4 8.6 55.4 24.18"/>
									<line x1="19.32" y1="45.72" x2="54.61" y2="8.91"/>
								</svg>
							`
                )
              })
            ]
          }),
          !item.requires_supplemental_data ? CreateElement("td", {
            class: "cs2s_table_store_type_match_column",
            text: item.type
          }) : CreateElement("td", {
            class: "cs2s_table_store_type_match_column",
            html: `${item.section_name} &mdash; ${item.team_1} (${item.team_1_score}) &mdash; ${item.team_2} (${item.team_2_score})`
          }),
          this.#store.inventoryLoaded && CreateElement("td", {
            class: "cs2s_table_store_owned_column",
            text: item.owned
          }),
          CreateElement("td", {
            class: "cs2s_table_store_price_column",
            children: [
              item.discount && CreateElement("span", {
                class: "cs2s_table_store_discount",
                children: [
                  CreateElement("span", {
                    class: "cs2s_table_store_discount_percentage",
                    text: `-${item.discount}%`
                  }),
                  CreateElement("span", {
                    class: "cs2s_table_store_discount_original_price",
                    text: this.#store.FormatCurrency(item.original_price)
                  })
                ]
              }),
              this.#store.FormatCurrency(item.price)
            ]
          })
        ]
      });
      if (this.#selectedItem == item) {
        item.element.classList.add("cs2s_table_row_selected");
      }
      return item.element;
    }
    _UpdateFooter() {
      if (!this.#selectedItem) {
        this.#actionButtonElement.classList.add("cs2s_button_disabled");
        if (!this.#actionButtonElement.tooltip) {
          this.#actionButtonElement.tooltip = BindTooltip(this.#actionButtonElement, "No items selected");
        } else {
          this.#actionButtonElement.tooltip.innerText = "No items selected";
        }
      } else {
        this.#actionButtonElement.classList.remove("cs2s_button_disabled");
        this.#actionButtonElement.unbindTooltip && this.#actionButtonElement.unbindTooltip();
        this.#actionButtonElement.tooltip = null;
      }
    }
    #SelectItem(item) {
      if (this.#selectedItem) {
        this._GetRowElement(this.#selectedItem).classList.remove("cs2s_table_row_selected");
      }
      if (this.#selectedItem == item) {
        this.#selectedItem = null;
      } else {
        this.#selectedItem = item;
        this._GetRowElement(item).classList.add("cs2s_table_row_selected");
      }
      this._UpdateFooter();
    }
    _FilterRow(item) {
      if (this.#tab === _StoreTable.TAB.GENERAL && typeof item.layout_weight === "undefined") {
        return false;
      }
      if (this.#tab === _StoreTable.TAB.TOOLS && item.layout_format !== "single") {
        return false;
      }
      if (this.#tab === _StoreTable.TAB.TOURNAMENT_CAPSULES && (!item.tournament_id || item.requires_supplemental_data)) {
        return false;
      }
      if (this.#tab === _StoreTable.TAB.TOURNAMENT_SOUVENIRS && (!item.tournament_id || !item.requires_supplemental_data)) {
        return false;
      }
      if (this.#searchQuery && this.#searchQuery.length > 0) {
        for (const word of this.#searchQuery) {
          if (!item.name_normalized.includes(word)) {
            return false;
          }
        }
      }
      if (this.#teamsSearchQuery && this.#teamsSearchQuery.length > 0 && this.#tab === _StoreTable.TAB.TOURNAMENT_SOUVENIRS) {
        for (const word of this.#teamsSearchQuery) {
          if (!item.teams_normalized.includes(word)) {
            return false;
          }
        }
      }
      return true;
    }
    #ChangeTab(button, newTab) {
      if (this.#tab == newTab) {
        return;
      }
      this.#tab = newTab;
      button.parentElement.querySelectorAll(".cs2s_table_footer_action_link").forEach((el) => {
        el.classList.remove("cs2s_table_footer_action_link_active");
      });
      button.classList.add("cs2s_table_footer_action_link_active");
      if (newTab === _StoreTable.TAB.TOURNAMENT_SOUVENIRS) {
        this._tableContainerElement.querySelector("#teams_column").style.display = "";
        this._tableContainerElement.querySelector("#teams_search").style.display = "";
        this._tableContainerElement.querySelector("#type_column").style.display = "none";
      } else {
        this._tableContainerElement.querySelector("#teams_column").style.display = "none";
        this._tableContainerElement.querySelector("#teams_search").style.display = "none";
        this._tableContainerElement.querySelector("#type_column").style.display = "";
      }
      this._sortColumns = ["default_sort_order"];
      this._sortDirection = Table.SORT_DIRECTION.ASC;
      this._tableContainerElement.querySelectorAll(".cs2s_table_column_sort_asc").forEach((el) => {
        el.classList.remove("cs2s_table_column_sort_asc");
      });
      this._tableContainerElement.querySelectorAll(".cs2s_table_column_sort_desc").forEach((el) => {
        el.classList.remove("cs2s_table_column_sort_desc");
      });
      this.#searchQuery = null;
      this.#teamsSearchQuery = null;
      this._tableContainerElement.querySelectorAll('thead input[type="search"]').forEach((input) => input.value = "");
      if (this.#selectedItem) {
        this._GetRowElement(this.#selectedItem).classList.remove("cs2s_table_row_selected");
        this.#selectedItem = null;
      }
      this._FilterRows();
    }
    async #ProcessSelected() {
      if (!this.#selectedItem) {
        return;
      }
      const purchaseButton = CreateElement("button", {
        class: "cs2s_blue_long_button",
        type: "submit",
        text: this.#store.FormatCurrency(this.#selectedItem.price)
      });
      const closeButton = CreateElement("button", {
        class: "cs2s_grey_long_button",
        id: "form_cancel",
        type: "button",
        text: "Cancel"
      });
      const purchaseForm = CreateElement("form", {
        class: "cs2s_settings_form cs2s_settings_form_enclosed_submit",
        children: [
          CreateElement("div", {
            class: "cs2s_settings_form_group_item",
            children: [
              CreateElement("label", {
                for: "storage_unit_name",
                text: "Quantity"
              }),
              CreateElement("select", {
                id: "quantity",
                children: Array.from(
                  { length: MAX_PURCHASE_QUANTITY },
                  (_, i) => CreateElement("option", {
                    value: i + 1,
                    text: i + 1
                  })
                ),
                onchange: (event) => {
                  const value = event.target.value;
                  purchaseButton.innerText = this.#store.FormatCurrency(this.#selectedItem.price * value);
                }
              })
            ]
          }),
          CreateElement("div", {
            class: "cs2s_settings_form_submit_group",
            children: [
              purchaseButton,
              closeButton
            ]
          })
        ],
        onsubmit: async (event) => {
          event.preventDefault();
          const initializePurchase = async () => {
            const newTab = unsafeWindow.open("", "_blank");
            if (newTab) {
              newTab.document.write(
                /*html*/
                `
							<!DOCTYPE html>
							<html>
							<head>
								<title>Initializing Purchase</title>
								<style>
									body {
										font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
										background: radial-gradient(circle at top left, rgba(74, 81, 92, 0.4) 0%, rgba(75, 81, 92, 0) 60%), #25282e;
										color: #bdbdbd;
										display: flex;
										justify-content: center;
										align-items: center;
										height: 100vh;
										margin: 0;
										text-align: center;
									}
									.spinner {
										width: 50px;
										height: 50px;
										border: 5px solid #a6a6ad80;
										border-top-color: transparent;
										border-radius: 50%;
										animation: spin 1s linear infinite;
										margin: 0 auto 20px;
									}
									@keyframes spin {
										0% { transform: rotate(0deg); }
										100% { transform: rotate(360deg); }
									}
								</style>
							</head>
							<body>
								<div>
									<div class="spinner"></div>
									<h1>Initializing Purchase...</h1>
								</div>
							</body>
							</html>
						`
              );
            }
            const loadingPopup = new Popup({
              simpleMode: true,
              disableClose: true,
              popoverMode: true,
              fade: false,
              title: "Initializing Purchase",
              body: [
                CreateElement("div", {
                  class: "cs2s_action_body",
                  children: [
                    CreateElement("div", {
                      class: "cs2s_action_spinner"
                    })
                  ]
                })
              ]
            });
            try {
              loadingPopup.Show();
              const quantity = purchaseForm.elements["quantity"].value;
              const purchaseUrl = await this.#store.InitializePurchase(this.#selectedItem, quantity);
              if (!newTab || newTab.closed) {
                throw new Error("Popup was closed.  Please try again.");
              }
              newTab.location.href = purchaseUrl;
              if (!this.#inventoryChanged) {
                this.#inventoryChanged = true;
                if (this.#store.inventoryLoaded && !this.#store.inventoryLoadedFromCache) {
                  this.#oldNotificationElement.style.display = "";
                }
              }
              loadingPopup.Hide();
            } catch (e) {
              loadingPopup.Hide();
              newTab?.close();
              script_default.ShowError({ level: ERROR_LEVEL.HIGH }, new Error(`Failed to initialize purchase.`), e);
            }
          };
          if (!script_default.Bot?.Plugin?.Connected) {
            script_default.ShowStartInterfacePrompt({
              message: "Interface must be running to purchase items from the store",
              autoClose: false,
              popoverMode: true,
              fade: false,
              onconnected: () => {
                initializePurchase();
              }
            });
          } else {
            initializePurchase();
          }
        }
      });
      const popupBody = CreateElement("div", {
        class: "cs2s_action_body",
        children: [
          purchaseForm
        ]
      });
      const itemName = CreateElement("span", {
        text: this.#selectedItem.name
      });
      if (this.#selectedItem.requires_supplemental_data) {
        BindTooltip(itemName, `From the ${this.#selectedItem.section_name} match between ${this.#selectedItem.team_1} and ${this.#selectedItem.team_2}.`);
      }
      const popup = new Popup({
        title: "Purchase ",
        titleChildren: [
          CreateElement("span", {
            class: "cs2s_table_title_item",
            children: [itemName],
            vars: {
              "image-url": `url(${this.#selectedItem.requires_supplemental_data ? Icons.GetIconURL(this.#selectedItem.alt_image_name, "66fx45f") ?? Icons.GetIconURL(this.#selectedItem.image_name, "66fx45f") : Icons.GetIconURL(this.#selectedItem.image_name, "66fx45f")})`
            }
          })
        ],
        body: [popupBody],
        simpleMode: true,
        popoverMode: true,
        onclose: () => {
          this._tableContainerElement.focus();
        }
      });
      closeButton.onclick = () => {
        popup.Hide();
      };
      popup.Show();
    }
  };

  // src/handlers/inventory_handlers.js
  function HandleShowItemInventory() {
    const initInventory = () => {
      if (initInventory.initialized) {
        return;
      }
      initInventory.initialized = true;
      script_default.GetInventory();
    };
    const allCratesButton = CreateElement("a", {
      class: "btn_darkblue_white_innerfade btn_medium",
      style: {
        marginRight: "12px"
      },
      html: "<span>Retrieve All Stored Items</span>",
      onclick: async () => {
        const inventory = await script_default.GetInventory({ showProgress: true });
        if (inventory === OPERATION_ERROR.INTERFACE_NOT_CONNECTED) {
          script_default.ShowStartInterfacePrompt({
            message: "Interface must be running to fetch stored items",
            fade: false
          });
          return;
        }
        if (inventory === OPERATION_ERROR.FAILED_TO_LOAD) {
          script_default.ShowError({ level: ERROR_LEVEL.HIGH }, new Error("Inventory failed to load, check error logs and refresh the page to try again"));
          return;
        }
        if (!(inventory instanceof Inventory)) {
          return;
        }
        if (inventory.storedItems.length == 0) {
          script_default.ShowMessage({}, "No stored items found");
          return;
        }
        const table = new ItemTable(inventory.storedItems.slice(), inventory, {
          mode: ItemTable.MODE.RETRIEVE,
          casketName: "All Storage Units",
          multiCasket: true
        });
        table.Show();
      }
    });
    const storeButton = CreateElement("a", {
      class: "btn_darkblue_white_innerfade btn_medium",
      style: {
        marginRight: "12px"
      },
      html: "<span>View Store</span>",
      onclick: async () => {
        const store = await script_default.GetStore({ showProgress: true });
        if (store === OPERATION_ERROR.INTERFACE_NOT_CONNECTED) {
          script_default.ShowStartInterfacePrompt({
            message: "Interface must be running on one of your accounts to view the in-game store.",
            fade: false
          });
          return;
        }
        if (store === OPERATION_ERROR.FAILED_TO_LOAD) {
          script_default.ShowError({ level: ERROR_LEVEL.HIGH }, new Error("Store failed to load, check error logs and refresh the page to try again"));
          return;
        }
        if (!(store instanceof Store)) {
          return;
        }
        if (store.items.length == 0) {
          script_default.ShowMessage({}, "No items found in the store");
          return;
        }
        const table = new StoreTable(store);
        table.Show();
      }
    });
    const handler = (appid) => {
      if (appid == CS2_APPID) {
        initInventory();
        !storeButton.isConnected && unsafeWindow.document.getElementsByClassName("inventory_rightnav")[0].prepend(storeButton);
        !allCratesButton.isConnected && unsafeWindow.document.getElementsByClassName("inventory_rightnav")[0].prepend(allCratesButton);
      } else {
        storeButton.isConnected && storeButton.remove();
        allCratesButton.isConnected && allCratesButton.remove();
      }
    };
    const originalShowItemInventory = unsafeWindow.ShowItemInventory;
    unsafeWindow.ShowItemInventory = function(appid) {
      const result = originalShowItemInventory.call(this, ...arguments);
      handler(appid);
      return result;
    };
    handler(unsafeWindow.g_ActiveInventory.appid);
  }
  function HandleAddInventoryData() {
    const handler = () => {
      if (!handler.handledAssetIDs) {
        handler.handledAssetIDs = /* @__PURE__ */ new Set();
      }
      const contexts = unsafeWindow.g_rgAppContextData?.[CS2_APPID]?.rgContexts;
      if (!contexts) {
        return;
      }
      for (const contextId in contexts) {
        const inventory = contexts[contextId].inventory;
        if (!inventory?.m_rgItemElements) {
          continue;
        }
        for (const element of inventory.m_rgItemElements) {
          const asset = element?.[0]?.rgItem;
          if (!asset) {
            continue;
          }
          const assetid = asset.assetid;
          if (handler.handledAssetIDs.has(assetid)) {
            continue;
          }
          handler.handledAssetIDs.add(assetid);
          const inventoryAsset = new InventoryAsset(asset);
          inventoryAsset.BuildInventoryUI();
        }
      }
    };
    const originalAddInventoryData = unsafeWindow.CInventory.prototype.AddInventoryData;
    unsafeWindow.CInventory.prototype.AddInventoryData = function(data) {
      const result = originalAddInventoryData.call(this, ...arguments);
      if (data?.assets?.[0]?.appid == CS2_APPID) {
        handler();
      }
      return result;
    };
    handler();
  }
  function HandleSelectItem() {
    const handler = (asset) => {
      WaitForElm(`#iteminfo${unsafeWindow.iActiveSelectView} > div`).then((element) => {
        element.querySelectorAll(`.cs2s_element`).forEach((e) => e.remove());
        const inventoryAsset = new InventoryAsset(asset);
        inventoryAsset.BuildSelectedUI();
      });
    };
    const originalSelectItem = unsafeWindow.CInventory.prototype.SelectItem;
    unsafeWindow.CInventory.prototype.SelectItem = function(a, b, asset) {
      const result = originalSelectItem.call(this, ...arguments);
      if (asset.appid == CS2_APPID) {
        handler(asset);
      }
      return result;
    };
    if (unsafeWindow.g_ActiveInventory.selectedItem?.appid == CS2_APPID) {
      handler(unsafeWindow.g_ActiveInventory.selectedItem);
    }
  }

  // src/cs2/items/assets/market_asset.js
  var MarketAsset = class _MarketAsset extends Asset {
    _asset;
    _listingid;
    static #builtItemPageUI = false;
    constructor(asset, listing) {
      super();
      this._asset = asset;
      this._assetid = asset.id;
      this._listingid = listing?.listingid;
      for (const description of asset.descriptions) {
        if (description.name == "exterior_wear") {
          this._type = Asset.TYPE.WEARABLE;
          break;
        }
      }
      if (this._type == Asset.TYPE.WEARABLE) {
        for (const action of asset.market_actions) {
          if (action.link.includes("steam://rungame")) {
            this._inspectLink = action.link.replace("%assetid%", this._assetid);
            break;
          }
        }
      }
    }
    // Add additional information to each individual listing
    async BuildListingUI() {
      const listingDetailsElement = unsafeWindow.document.getElementById(`listing_${this._listingid}_details`);
      const stickerElements = listingDetailsElement.getElementsBySelector("#sticker_info img");
      const charmElements = listingDetailsElement.getElementsBySelector("#keychain_info img");
      if (this.ShouldInspect() && GetSetting(SETTING_INSPECT_ITEMS)) {
        const float = parseFloat(this.GetProperty(2)?.float_value);
        const seed = this.GetProperty(1)?.int_value;
        let floatElement;
        if ((float || float === 0) && (seed || seed === 0)) {
          floatElement = CreateElement("div", {
            text: `Float: ${float.toFixed(14)}`
          });
          listingDetailsElement.prepend(
            CreateElement("div", {
              class: "cs2s_listing_info",
              children: [
                floatElement,
                CreateElement("div", {
                  text: `Seed: ${seed}`
                })
              ]
            })
          );
        }
        const build = () => {
          if (!this._inspectData) {
            return;
          }
          this.#BuildItemPageUI();
          if (!listingDetailsElement.isConnected) {
            return;
          }
          if (floatElement && this._inspectData.wear && this._inspectData.seed) {
            if (floatElement && this._inspectData.wear && this._wearData) {
              floatElement.innerText = `Float: ${this._inspectData.wear.toFixed(14)}`;
              floatElement.append(" ", this._GetPercentileElement({ showTooltip: true, rounded: false }));
            }
          }
          if (this._inspectData.stickers) {
            for (let i = 0; i < this._inspectData.stickers.length; i++) {
              if (typeof stickerElements[i] == "undefined") {
                break;
              }
              stickerElements[i].wrap(
                CreateElement("span", {
                  class: "cs2s_asset_sticker_wear cs2s_asset_cosmetic_small",
                  wear: Math.round(this._inspectData.stickers[i] * 100)
                })
              );
            }
          }
          if (this._inspectData.charm) {
            if (typeof charmElements[0] != "undefined") {
              charmElements[0].wrap(
                CreateElement("span", {
                  class: "cs2s_asset_charm_template cs2s_asset_cosmetic_small",
                  template: this._inspectData.charm
                })
              );
            }
          }
        };
        let cached;
        try {
          cached = await this._Inspect({ cacheOnly: true });
        } catch (e) {
          script_default.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
          return;
        }
        if (cached) {
          build();
        } else {
          Asset._inspectionWorker.Add(async () => {
            try {
              await this._Inspect();
            } catch (e) {
              script_default.ShowError({ level: ERROR_LEVEL.MEDIUM }, e);
              return;
            }
            build();
          });
          Asset._inspectionWorker.Run();
        }
      }
    }
    // Add general item information to the top of the page
    #BuildItemPageUI() {
      if (_MarketAsset.#builtItemPageUI) {
        return;
      }
      _MarketAsset.#builtItemPageUI = true;
      if (this._inspectData.wear && this._inspectData.seed) {
        const descriptionsElement = unsafeWindow.document.querySelector(".largeiteminfo_react_placeholder > div > div > div > div > div:nth-child(2) > div:nth-child(3)");
        if (descriptionsElement) {
          descriptionsElement.prepend(this._GetWearRangeElement(true));
        }
      }
    }
    GetProperty(id) {
      if (!this._asset.asset_properties) {
        return;
      }
      for (const property of this._asset.asset_properties) {
        if (property.propertyid == id) {
          return property;
        }
      }
    }
  };

  // src/handlers/market_listing_handlers.js
  function HandleOnResponseRenderResults() {
    const handler = () => {
      if (!unsafeWindow.g_rgAssets?.[CS2_APPID]?.[2] || !unsafeWindow.g_rgListingInfo) {
        return;
      }
      for (const listing of Object.values(unsafeWindow.g_rgListingInfo)) {
        const asset = unsafeWindow.g_rgAssets[CS2_APPID][2][listing.asset?.id];
        if (!asset) {
          continue;
        }
        WaitForElm(`.largeiteminfo_react_placeholder > div`).then(() => {
          const marketAsset = new MarketAsset(asset, listing);
          marketAsset.BuildListingUI();
        });
      }
    };
    const originalOnResponseRenderResults = unsafeWindow.CAjaxPagingControls.prototype.OnResponseRenderResults;
    unsafeWindow.CAjaxPagingControls.prototype.OnResponseRenderResults = function() {
      const result = originalOnResponseRenderResults.call(this, ...arguments);
      handler();
      return result;
    };
    handler();
  }

  // src/utils/tampermonkey_fix.js
  function TamperMonkeyConcurrentRequestsFix() {
    const HAS_GM = typeof GM !== "undefined";
    const NEW_GM = ((scope, GM2) => {
      if (GM_info.scriptHandler !== "Tampermonkey" || compareVersions(GM_info.version, "5.3.2") < 0) return;
      const GM_xmlhttpRequestOrig = GM_xmlhttpRequest;
      const GM_xmlHttpRequestOrig = GM2.xmlHttpRequest;
      function compareVersions(v1, v2) {
        const parts1 = v1.split(".").map(Number);
        const parts2 = v2.split(".").map(Number);
        const length = Math.max(parts1.length, parts2.length);
        for (let i = 0; i < length; i++) {
          const num1 = parts1[i] || 0;
          const num2 = parts2[i] || 0;
          if (num1 > num2) return 1;
          if (num1 < num2) return -1;
        }
        return 0;
      }
      function GM_xmlhttpRequestWrapper(odetails) {
        if (odetails.redirect !== void 0) {
          return GM_xmlhttpRequestOrig(odetails);
        }
        if (odetails.onprogress || odetails.fetch === false) {
          console.warn("Fetch mode does not support onprogress in the background.");
        }
        const {
          onload,
          onloadend,
          onerror,
          onabort,
          ontimeout,
          ...details
        } = odetails;
        const handleRedirects = (initialDetails) => {
          const request = GM_xmlhttpRequestOrig({
            ...initialDetails,
            redirect: "manual",
            onload: function(response) {
              if (response.status >= 300 && response.status < 400) {
                const m = response.responseHeaders.match(/Location:\s*(\S+)/i);
                const redirectUrl = m && m[1];
                if (redirectUrl) {
                  const absoluteUrl = new URL(redirectUrl, initialDetails.url).href;
                  handleRedirects({ ...initialDetails, url: absoluteUrl });
                  return;
                }
              }
              if (onload) onload.call(this, response);
              if (onloadend) onloadend.call(this, response);
            },
            onerror: function(response) {
              if (onerror) onerror.call(this, response);
              if (onloadend) onloadend.call(this, response);
            },
            onabort: function(response) {
              if (onabort) onabort.call(this, response);
              if (onloadend) onloadend.call(this, response);
            },
            ontimeout: function(response) {
              if (ontimeout) ontimeout.call(this, response);
              if (onloadend) onloadend.call(this, response);
            }
          });
          return request;
        };
        return handleRedirects(details);
      }
      function GM_xmlHttpRequestWrapper(odetails) {
        let abort;
        const p = new Promise((resolve, reject) => {
          const { onload, ontimeout, onerror, ...send } = odetails;
          send.onerror = function(r) {
            if (onerror) {
              resolve(r);
              onerror.call(this, r);
            } else {
              reject(r);
            }
          };
          send.ontimeout = function(r) {
            if (ontimeout) {
              resolve(r);
              ontimeout.call(this, r);
            } else {
              reject(r);
            }
          };
          send.onload = function(r) {
            resolve(r);
            if (onload) onload.call(this, r);
          };
          const a = GM_xmlhttpRequestWrapper(send).abort;
          if (abort === true) {
            a();
          } else {
            abort = a;
          }
        });
        p.abort = () => {
          if (typeof abort === "function") {
            abort();
          } else {
            abort = true;
          }
        };
        return p;
      }
      GM_xmlhttpRequest = GM_xmlhttpRequestWrapper;
      scope.GM_xmlhttpRequestOrig = GM_xmlhttpRequestOrig;
      const gopd = Object.getOwnPropertyDescriptor(GM2, "xmlHttpRequest");
      if (gopd && gopd.configurable === false) {
        return {
          __proto__: GM2,
          xmlHttpRequest: GM_xmlHttpRequestWrapper,
          xmlHttpRequestOrig: GM_xmlHttpRequestOrig
        };
      } else {
        GM2.xmlHttpRequest = GM_xmlHttpRequestWrapper;
        GM2.xmlHttpRequestOrig = GM_xmlHttpRequestOrig;
      }
    })(window, HAS_GM ? GM : {});
    if (HAS_GM && NEW_GM) GM = NEW_GM;
  }

  // src/main.js
  TamperMonkeyConcurrentRequestsFix();
  (async function() {
    GM_addStyle(style_default);
    await script_default.VerifyConnection();
    const PAGE_INVENTORY = 0;
    const PAGE_MARKET_LISTING = 1;
    let currentPage = null;
    if (window.location.href.includes("/market/listings")) {
      currentPage = PAGE_MARKET_LISTING;
    } else if (window.location.href.includes("/inventory")) {
      currentPage = PAGE_INVENTORY;
    }
    if (currentPage == PAGE_INVENTORY) {
      const IS_OWN_INVENTORY = unsafeWindow.g_ActiveUser.strSteamId == unsafeWindow.g_steamID;
      if (IS_OWN_INVENTORY) {
        HandleShowItemInventory();
      }
      HandleAddInventoryData();
      HandleSelectItem();
    } else if (currentPage == PAGE_MARKET_LISTING) {
      const IS_CS2_ITEM = !!unsafeWindow.g_rgAppContextData?.[CS2_APPID];
      const HAS_INDIVIDUAL_LISTINGS = Object.values(unsafeWindow.g_rgAssets?.[CS2_APPID]?.[2])[0]?.commodity == 0;
      if (!IS_CS2_ITEM || !HAS_INDIVIDUAL_LISTINGS) {
        return;
      }
      HandleOnResponseRenderResults();
    }
  })();
})();

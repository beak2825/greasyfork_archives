// ==UserScript==
// @name          Stores to Agent
// @namespace     https://www.reddit.com/user/RobotOilInc
// @version       5.2.3
// @author        RobotOilInc
// @source        https://gitlab.com/robotoilinc/stores-to-agents/
// @license       MIT
// @require       https://unpkg.com/@trim21/gm-fetch@0.1.15/dist/gm_fetch.js#sha384-P0KSVCS+YC1OEOII7FniE0zZ0+xpXAOHHT5aY++HbYNTnJbp8R933m5CVq4XJv4O
// @require       https://unpkg.com/gm-storage@2.0.3/dist/index.umd.min.js#sha384-IforrfCAVNj1KYlzIXNAyX2RADvDkkufuRfcM0qT57QMNdEonuvBRK2WfL8Co3JV
// @require       https://unpkg.com/gm4-polyfill@1.0.1/gm4-polyfill.js#sha384-nDSbBzN1Jn1VgjQjt5u2BxaPO1pbMS9Gxyi5+yIsKYWzqkYOEh11iQdomqywYPaN
// @require       https://unpkg.com/jquery@3.7.0/dist/jquery.min.js#sha384-NXgwF8Kv9SSAr+jemKKcbvQsz+teULH/a5UNJvZc6kP47hZgl62M1vGnw6gHQhb1
// @require       https://unpkg.com/js-logger@1.6.1/src/logger.min.js#sha384-CGmI56C3Kvs2e+Ftr3UpFkkMgOAXBUkLKS/KVkxDEuGSUYF8qki7CzwWWBz4QM60
// @require       https://greasyfork.org/scripts/11562-gm-config-8/code/GM_config%208+.js?version=66657#sha256-229668ef83cd26ac207e9d780e2bba6658e1506ac0b23fb29dc94ae531dd31fb
// @description   Adds an order directly from stores to your agent
// @homepageURL   https://greasyfork.org/en/scripts/427774-stores-to-agent
// @supportURL    https://greasyfork.org/en/scripts/427774-stores-to-agent
// @match         https://detail.1688.com/offer/*
// @match         https://*.taobao.com/item.htm*
// @match         https://*.v.weidian.com/?userid=*
// @match         https://*.weidian.com/item.html*
// @match         https://*.yupoo.com/albums/*
// @match         https://detail.tmall.com/item.htm*
// @match         https://weidian.com/*itemID=*
// @match         https://weidian.com/?userid=*
// @match         https://weidian.com/item.html*
// @match         https://*.pandabuy.com/*
// @match         https://www.pandabuy.com/*
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_webRequest
// @grant         GM_xmlhttpRequest
// @grant         GM_deleteValue
// @grant         GM_listValues
// @connect       basetao.com
// @connect       cssbuy.com
// @connect       superbuy.com
// @connect       ytaopal.com
// @connect       wegobuy.com
// @connect       pandabuy.com
// @webRequest    [{ "selector": "*thor.weidian.com/stardust/*", "action": "cancel" }]
// @icon          https://i.imgur.com/2lQXuqv.png
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/427774/Stores%20to%20Agent.user.js
// @updateURL https://update.greasyfork.org/scripts/427774/Stores%20to%20Agent.meta.js
// ==/UserScript==

/*! @robotoilinc/stores-to-agents v5.2.3 has been created by RobotOilInc. All rights reserved. */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/object-to-formdata/src/index.js":
/***/ ((module) => {

function isUndefined(value) {
  return value === undefined;
}
function isNull(value) {
  return value === null;
}
function isBoolean(value) {
  return typeof value === 'boolean';
}
function isObject(value) {
  return value === Object(value);
}
function isArray(value) {
  return Array.isArray(value);
}
function isDate(value) {
  return value instanceof Date;
}
function isBlob(value, isReactNative) {
  return isReactNative ? isObject(value) && !isUndefined(value.uri) : isObject(value) && typeof value.size === 'number' && typeof value.type === 'string' && typeof value.slice === 'function';
}
function isFile(value, isReactNative) {
  return isBlob(value, isReactNative) && typeof value.name === 'string' && (isObject(value.lastModifiedDate) || typeof value.lastModified === 'number');
}
function initCfg(value) {
  return isUndefined(value) ? false : value;
}
function serialize(obj, cfg, fd, pre) {
  cfg = cfg || {};
  fd = fd || new FormData();
  cfg.indices = initCfg(cfg.indices);
  cfg.nullsAsUndefineds = initCfg(cfg.nullsAsUndefineds);
  cfg.booleansAsIntegers = initCfg(cfg.booleansAsIntegers);
  cfg.allowEmptyArrays = initCfg(cfg.allowEmptyArrays);
  cfg.noAttributesWithArrayNotation = initCfg(cfg.noAttributesWithArrayNotation);
  cfg.noFilesWithArrayNotation = initCfg(cfg.noFilesWithArrayNotation);
  cfg.dotsForObjectNotation = initCfg(cfg.dotsForObjectNotation);
  const isReactNative = typeof fd.getParts === 'function';
  if (isUndefined(obj)) {
    return fd;
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, '');
    }
  } else if (isBoolean(obj)) {
    if (cfg.booleansAsIntegers) {
      fd.append(pre, obj ? 1 : 0);
    } else {
      fd.append(pre, obj);
    }
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value, index) => {
        let key = pre + '[' + (cfg.indices ? index : '') + ']';
        if (cfg.noAttributesWithArrayNotation || cfg.noFilesWithArrayNotation && isFile(value, isReactNative)) {
          key = pre;
        }
        serialize(value, cfg, fd, key);
      });
    } else if (cfg.allowEmptyArrays) {
      fd.append(cfg.noAttributesWithArrayNotation ? pre : pre + '[]', '');
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString());
  } else if (isObject(obj) && !isBlob(obj, isReactNative)) {
    Object.keys(obj).forEach(prop => {
      const value = obj[prop];
      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2);
        }
      }
      const key = pre ? cfg.dotsForObjectNotation ? pre + '.' + prop : pre + '[' + prop + ']' : prop;
      serialize(value, cfg, fd, key);
    });
  } else {
    fd.append(pre, obj);
  }
  return fd;
}
module.exports = {
  serialize
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: external "Logger"
const external_Logger_namespaceObject = Logger;
var external_Logger_default = /*#__PURE__*/__webpack_require__.n(external_Logger_namespaceObject);
;// CONCATENATED MODULE: external "GMStorage"
const external_GMStorage_namespaceObject = GMStorage;
var external_GMStorage_default = /*#__PURE__*/__webpack_require__.n(external_GMStorage_namespaceObject);
;// CONCATENATED MODULE: ./src/Constants.ts
const PandaBuyToken = "PANDABUY_TOKEN";
const PandaBuyUserInfo = "PANDABUY_USERINFO";
;// CONCATENATED MODULE: ./src/exceptions/PandaBuyError.ts
class PandaBuyError extends Error {
  constructor(message) {
    super(message);
    this.name = "PandaBuyError";
  }
}
;// CONCATENATED MODULE: ./src/helpers/StorageHelper.ts
class LocalStorage {
  constructor() {
    this.localStorageSupported = typeof window["localStorage"] != "undefined" && window["localStorage"] != null;
  }

  // add value to storage
  add(key, item) {
    if (this.localStorageSupported) {
      localStorage.setItem(key, item);
    }
  }

  // get one item by key from storage
  get(key) {
    if (this.localStorageSupported) {
      return localStorage.getItem(key);
    }
    return null;
  }

  // remove value from storage
  remove(key) {
    if (this.localStorageSupported) {
      localStorage.removeItem(key);
    }
  }

  // clear storage (remove all items from it)
  clear() {
    if (this.localStorageSupported) {
      localStorage.clear();
    }
  }
}
;// CONCATENATED MODULE: ./src/agents/login/Pandabuy.ts





class PandaBuyLogin {
  constructor() {
    this.store = new (external_GMStorage_default())();
    this.localStorage = new LocalStorage();
  }
  supports(hostname) {
    return hostname.includes("pandabuy.com");
  }
  process() {
    // If we already have a token, don't bother
    const currentToken = this.store.get(PandaBuyToken, null);
    if (currentToken !== null && currentToken.length !== 0) {
      return;
    }

    // Don't bother with getting the token, if we aren't loggeed in yet
    const userInfo = this.localStorage.get(PandaBuyUserInfo);
    if (userInfo === null || userInfo.length === 0) {
      return;
    }

    // The token should now exist
    const updatedToken = this.localStorage.get(PandaBuyToken);
    if (updatedToken === null || updatedToken.length === 0) {
      throw new PandaBuyError("Could not retrieve token");
    }

    // Store it internally
    this.store.set(PandaBuyToken, updatedToken);
    external_Logger_default().info("Updated the PandaBuy Authorization Token");
  }
}
;// CONCATENATED MODULE: ./src/agents/login/Logins.ts

function getLogin(hostname) {
  const agents = [new PandaBuyLogin()];
  let agent = null;
  Object.values(agents).forEach(value => {
    if (value.supports(hostname)) {
      agent = value;
    }
  });
  return agent;
}
// EXTERNAL MODULE: ./node_modules/object-to-formdata/src/index.js
var src = __webpack_require__("./node_modules/object-to-formdata/src/index.js");
;// CONCATENATED MODULE: ./src/exceptions/BaseTaoError.ts
class BaseTaoError extends Error {
  constructor(message) {
    super(message);
    this.name = "BaseTaoError";
  }
}
;// CONCATENATED MODULE: ./src/helpers/DetermineStoreSource.ts
/**
 * Determines on website we are buying something. Used for BaseTao and Pandabuy.
 */
const determineStoreSource = function () {
  if (window.location.hostname.includes("1688.com")) {
    return "1688";
  }

  // Check more specific TaoBao pages first
  if (window.location.hostname.includes("market.m.taobao.com") || window.location.hostname.includes("2.taobao.com")) {
    return "xianyu";
  }
  if (window.location.hostname.includes("taobao.com")) {
    return "taobao";
  }
  if (window.location.hostname.includes("weidian.com") || window.location.hostname.includes("koudai.com")) {
    return "wd";
  }
  if (window.location.hostname.includes("yupoo.com")) {
    return "yupoo";
  }
  if (window.location.hostname.includes("detail.tmall.com")) {
    return "tmall";
  }
  throw new Error(`Could not determine store source ${window.location.hostname}`);
};
;// CONCATENATED MODULE: ./node_modules/@trim21/gm-fetch/dist/index.mjs
function parseRawHeaders(h) {
    const s = h.trim();
    if (!s) {
        return new Headers();
    }
    const array = s.split("\r\n").map((value) => {
        let s = value.split(":");
        return [s[0].trim(), s[1].trim()];
    });
    return new Headers(array);
}
function parseGMResponse(req, res) {
    return new ResImpl(res.response, {
        statusCode: res.status,
        statusText: res.statusText,
        headers: parseRawHeaders(res.responseHeaders),
        finalUrl: res.finalUrl,
        redirected: res.finalUrl === req.url,
    });
}
class ResImpl {
    constructor(body, init) {
        this.rawBody = body;
        this.init = init;
        this.body = toReadableStream(body);
        const { headers, statusCode, statusText, finalUrl, redirected } = init;
        this.headers = headers;
        this.status = statusCode;
        this.statusText = statusText;
        this.url = finalUrl;
        this.type = "basic";
        this.redirected = redirected;
        this._bodyUsed = false;
    }
    get bodyUsed() {
        return this._bodyUsed;
    }
    get ok() {
        return this.status < 300;
    }
    arrayBuffer() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.arrayBuffer();
    }
    blob() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        // `slice` will use empty string as default value, so need to pass all arguments.
        return Promise.resolve(this.rawBody.slice(0, this.rawBody.size, this.rawBody.type));
    }
    clone() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");
        }
        return new ResImpl(this.rawBody, this.init);
    }
    formData() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.text().then(decode);
    }
    async json() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return JSON.parse(await this.rawBody.text());
    }
    text() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.text();
    }
}
function decode(body) {
    const form = new FormData();
    body
        .trim()
        .split("&")
        .forEach(function (bytes) {
        if (bytes) {
            const split = bytes.split("=");
            const name = split.shift()?.replace(/\+/g, " ");
            const value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
    });
    return form;
}
function toReadableStream(value) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(value);
            controller.close();
        },
    });
}

async function GM_fetch(input, init) {
    const request = new Request(input, init);
    let data;
    if (init?.body) {
        data = await request.text();
    }
    return await XHR(request, init, data);
}
function XHR(request, init, data) {
    return new Promise((resolve, reject) => {
        if (request.signal && request.signal.aborted) {
            return reject(new DOMException("Aborted", "AbortError"));
        }
        GM.xmlHttpRequest({
            url: request.url,
            method: gmXHRMethod(request.method.toUpperCase()),
            headers: Object.fromEntries(new Headers(init?.headers).entries()),
            data: data,
            responseType: "blob",
            onload(res) {
                resolve(parseGMResponse(request, res));
            },
            onabort() {
                reject(new DOMException("Aborted", "AbortError"));
            },
            ontimeout() {
                reject(new TypeError("Network request failed, timeout"));
            },
            onerror(err) {
                reject(new TypeError("Failed to fetch: " + err.finalUrl));
            },
        });
    });
}
const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "TRACE", "OPTIONS", "CONNECT"];
// a ts type helper to narrow type
function includes(array, element) {
    return array.includes(element);
}
function gmXHRMethod(method) {
    if (includes(httpMethods, method)) {
        return method;
    }
    throw new Error(`unsupported http method ${method}`);
}


//# sourceMappingURL=index.mjs.map

;// CONCATENATED MODULE: ./src/helpers/Fetch.ts

function get(url, init) {
  return GM_fetch(url, {
    ...init,
    method: "GET"
  });
}
function post(url, request) {
  return GM_fetch(url, {
    ...request,
    method: "POST"
  });
}
;// CONCATENATED MODULE: ./src/helpers/RemoveEmoji.ts
/**
 * Removes all emojis from the input text.
 *
 * @param string {string}
 */
const removeEmoji = string => string.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "");
;// CONCATENATED MODULE: ./src/agents/BaseTao.ts






const CSRF_REQUIRED_ERROR = "You need to be logged in on BaseTao to use this extension (CSRF required).";
class BaseTao {
  constructor() {
    this.parser = new DOMParser();
  }
  get name() {
    return "BaseTao";
  }
  async send(order) {
    // Get proper domain to use
    const properDomain = await this._getDomain();

    // Build the purchase data
    const purchaseData = await this._buildPurchaseData(properDomain, order);
    external_Logger_default().info("Sending order to BaseTao...", properDomain, order);

    // Do the actual call
    const response = await post(`${properDomain}/best-taobao-agent-service/bt_action/add_cart`, {
      body: new URLSearchParams((0,src.serialize)(purchaseData)),
      referrer: `${properDomain}/best-taobao-agent-service/how_make/buy_order.html`,
      headers: {
        origin: `${properDomain}`,
        referrer: `${properDomain}/best-taobao-agent-service/how_make/buy_order.html`,
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36",
        "x-requested-with": "XMLHttpRequest"
      }
    });
    const responseData = await response.json();
    if (responseData.value === "1") {
      return;
    }
    external_Logger_default().error("Item could not be added", response);
    throw new BaseTaoError("Item could not be added, make sure you are logged in");
  }
  async _getDomain() {
    // Try HTTPS (with WWW) first
    let response = await get("https://www.basetao.com/best-taobao-agent-service/how_make/buy_order.html");
    let doc = this.parser.parseFromString(await response.text(), "text/html");
    let csrfToken = doc.querySelector("input[name=bt_sb_token]");
    if (csrfToken && csrfToken.value.length !== 0) {
      return "https://www.basetao.com";
    }

    // Try HTTPS (without WWW) after
    response = await get("https://basetao.com/best-taobao-agent-service/how_make/buy_order.html");
    doc = this.parser.parseFromString(await response.text(), "text/html");
    csrfToken = doc.querySelector("input[name=bt_sb_token]");
    console.log(csrfToken);
    if (csrfToken && csrfToken.value.length !== 0) {
      return "https://basetao.com";
    }

    // User is not logged in/there is an issue
    throw new Error(CSRF_REQUIRED_ERROR);
  }
  async _buildPurchaseData(properDomain, order) {
    // Get the CSRF token
    const csrf = await this._getCSRF(properDomain);

    // Build the data we will send
    const data = {
      addtime: Date.now(),
      goodscolor: order.item.color ?? "-",
      goodsimg: order.item.imageUrl,
      goodsname: removeEmoji(order.item.name),
      goodsnum: 1,
      goodsprice: order.price,
      goodsremark: this._buildRemark(order) ?? "",
      goodsseller: removeEmoji(order.shop.name ?? ""),
      goodssite: determineStoreSource(),
      goodssize: order.item.size ?? "-",
      goodsurl: window.location.href,
      item_id: order.item.id,
      sellerurl: order.shop.url ?? "",
      sendprice: order.shipping,
      siteurl: window.location.hostname,
      sku_id: 0,
      type: 1
    };
    return {
      bt_sb_token: csrf,
      data: JSON.stringify(data)
    };
  }
  async _getCSRF(properDomain) {
    // Grab data from BaseTao
    const response = await get(`${properDomain}/best-taobao-agent-service/how_make/buy_order.html`);

    // Check if user is actually logged in
    const data = await response.text();
    if (data.includes("please sign in again")) {
      throw new Error(CSRF_REQUIRED_ERROR);
    }
    const doc = this.parser.parseFromString(data, "text/html");
    const csrfToken = doc.querySelector("input[name=bt_sb_token]");
    if (csrfToken && csrfToken.value.length !== 0) {
      return csrfToken.value;
    }

    // Return CSRF
    throw new Error(CSRF_REQUIRED_ERROR);
  }
  _buildRemark(order) {
    const descriptionParts = [];
    if (order.item.model !== null) descriptionParts.push(`Model: ${order.item.model}`);
    if (order.item.other.length !== 0) descriptionParts.push(order.item.other);
    let description = null;
    if (descriptionParts.length !== 0) {
      description = descriptionParts.join(" / ");
    }
    return description;
  }
}
;// CONCATENATED MODULE: ./src/exceptions/CSSBuyError.ts
class CSSBuyError extends Error {
  constructor(message) {
    super(message);
    this.name = "CSSBuyError";
  }
}
;// CONCATENATED MODULE: ./src/agents/CSSBuy.ts




class CSSBuy {
  get name() {
    return "CSSBuy";
  }
  async send(order) {
    // Build the purchase data
    const purchaseData = this._buildPurchaseData(order);
    external_Logger_default().info("Sending order to CSSBuy...", purchaseData);

    // Do the actual call
    const response = await post("https://www.cssbuy.com/ajax/fast_ajax.php?action=buyone", {
      body: new URLSearchParams((0,src.serialize)(purchaseData)),
      referrer: `https://www.cssbuy.com/?go=item&url=${encodeURIComponent(purchaseData.data.href)}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "nl,en-US;q=0.9,en;q=0.8,de;q=0.7,und;q=0.6",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "referrer": `https://www.cssbuy.com/?go=item&url=${encodeURIComponent(purchaseData.data.href)}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "x-requested-with": "XMLHttpRequest"
      }
    });
    if ((await response.json()).ret === 0) {
      return;
    }
    external_Logger_default().error("Item could not be added", response);
    throw new CSSBuyError("Item could not be added");
  }
  _buildPurchaseData(order) {
    // Build the description
    const description = this._buildRemark(order);

    // Create the purchasing data
    return {
      data: {
        buynum: 1,
        shopid: order.shop.id,
        picture: order.item.imageUrl,
        defaultimg: order.item.imageUrl,
        freight: order.shipping,
        price: order.price,
        color: order.item.color,
        size: order.item.size,
        total: order.price + order.shipping,
        buyyourself: 0,
        seller: order.shop.name,
        href: window.location.href,
        title: order.item.name,
        note: description,
        option: description
      }
    };
  }
  _buildRemark(order) {
    const descriptionParts = [];
    if (order.item.model !== null) descriptionParts.push(`Model: ${order.item.model}`);
    if (order.item.color !== null) descriptionParts.push(`Color: ${order.item.color}`);
    if (order.item.size !== null) descriptionParts.push(`Size: ${order.item.size}`);
    if (order.item.other.length !== 0) descriptionParts.push(`${order.item.other}`);
    let description = null;
    if (descriptionParts.length !== 0) {
      description = descriptionParts.join(" / ");
    }
    return description;
  }
}
;// CONCATENATED MODULE: ./src/agents/PandaBuy.ts






class PandaBuy {
  constructor() {
    this.store = new (external_GMStorage_default())();
  }
  get name() {
    return "PandaBuy";
  }
  async send(order) {
    const token = this.store.get(PandaBuyToken, null);
    if (token === null || token.length === 0) {
      throw new PandaBuyError("We do not have your PandaBuy authorization token yet. Please visit PandaBuy (and login if needed)");
    }

    // Build the purchase data
    const purchaseData = this._buildPurchaseData(order);
    external_Logger_default().info("Sending order to PandaBuy...", purchaseData);

    // Do the actual call
    await post("https://www.pandabuy.com/gateway/user/cart/add", {
      credentials: "include",
      mode: "cors",
      referrer: `https://www.pandabuy.com/uniorder?text=${encodeURIComponent(window.location.href)}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify(purchaseData),
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "nl,en-US;q=0.9,en;q=0.8,de;q=0.7,und;q=0.6",
        "authorization": `Bearer ${token}`,
        "content-type": "application/json;charset=UTF-8",
        "currency": "CNY",
        "device": "pc",
        "lang": "en"
      }
    }).then(async response => {
      const data = await response.json();
      if (response.status === 200 && data.msg === null) {
        return;
      }

      // Our token has expired
      if (response.status === 401) {
        // Reset the current token
        GM_setValue(PandaBuyToken, null);
        external_Logger_default().error("PandaBuy authorization token has expired");
        throw new PandaBuyError("Your PandaBuy authorization token has expired. Please visit PandaBuy (or login at PandaBuy) again");
      }
      external_Logger_default().error("Item could not be added", data.msg);
      throw new PandaBuyError("Item could not be added");
    }).catch(err => {
      // If the error is our own, just rethrow it
      if (err instanceof PandaBuyError) {
        throw err;
      }
      external_Logger_default().error("An error happened when uploading the order", err);
      throw new Error("An error happened when adding the order");
    });
  }
  _buildPurchaseData(order) {
    // Build the description
    const description = this._buildRemark(order);

    // Create the purchasing data
    return {
      storeName: order.shop.name,
      storeId: order.shop.id,
      goodsUrl: window.location.href,
      goodsName: order.item.name,
      goodsNameCn: order.item.name,
      goodsAttr: description,
      goodsAttrCn: description,
      storageNo: 1,
      goodsPrice: order.price,
      goodsNum: 1,
      fare: order.shipping,
      remark: "",
      selected: 1,
      purchaseType: 1,
      goodsImg: order.item.imageUrl,
      servicePrice: "0.00",
      writePrice: order.price,
      actPrice: order.price,
      storeSource: determineStoreSource(),
      goodsId: order.item.id,
      seller: order.shop.name,
      storeUrl: "https://weidian.com/?userid=" + order.shop.id
    };
  }
  _buildRemark(order) {
    const descriptionParts = [];
    if (order.item.model !== null && order.item.model.length !== 0) descriptionParts.push(`Model: ${order.item.model}`);
    if (order.item.color !== null && order.item.color.length !== 0) descriptionParts.push(`Color: ${order.item.color}`);
    if (order.item.size !== null && order.item.size.length !== 0) descriptionParts.push(`Size: ${order.item.size}`);
    if (order.item.other.length !== 0) descriptionParts.push(`${order.item.other}`);
    let description = null;
    if (descriptionParts.length !== 0) {
      description = descriptionParts.join(" / ");
    }
    return description;
  }
}
;// CONCATENATED MODULE: ./src/exceptions/SuperBuyError.ts
class SuperBuyError extends Error {
  constructor(message) {
    super(message);
    this.name = "SuperBuyError";
  }
}
;// CONCATENATED MODULE: ./src/helpers/BuildTaoCarts.ts
class BuildTaoCarts {
  purchaseData(order) {
    // Build the description
    const description = this._buildRemark(order);

    // Generate an SKU based on the description
    let sku = null;
    if (description !== null && description.length !== 0) {
      sku = description.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0) | 0, 0);
    }

    // Create the purchasing data
    return {
      type: 1,
      shopItems: [{
        shopLink: "",
        shopSource: "NOCRAWLER",
        shopNick: "",
        shopId: "",
        goodsItems: [{
          beginCount: 0,
          count: 1,
          desc: description,
          freight: order.shipping,
          freightServiceCharge: 0,
          goodsAddTime: Math.floor(Date.now() / 1000),
          goodsCode: `NOCRAWLER-${sku}`,
          goodsId: window.location.href,
          goodsLink: window.location.href,
          goodsName: order.item.name,
          goodsPrifex: "NOCRAWLER",
          goodsRemark: description,
          guideGoodsId: "",
          is1111Yushou: "no",
          picture: order.item.imageUrl,
          platForm: "pc",
          price: order.price,
          priceNote: "",
          serviceCharge: 0,
          sku: order.item.imageUrl,
          spm: "",
          warehouseId: "1"
        }]
      }]
    };
  }
  _buildRemark(order) {
    const descriptionParts = [];
    if (order.item.model !== null) descriptionParts.push(`Model: ${order.item.model}`);
    if (order.item.color !== null) descriptionParts.push(`Color: ${order.item.color}`);
    if (order.item.size !== null) descriptionParts.push(`Size: ${order.item.size}`);
    if (order.item.other.length !== 0) descriptionParts.push(`${order.item.other}`);
    let description = null;
    if (descriptionParts.length !== 0) {
      description = descriptionParts.join(" / ");
    }
    return description;
  }
}
;// CONCATENATED MODULE: ./src/agents/SuperBuy.ts




class SuperBuy {
  constructor() {
    this._builder = new BuildTaoCarts();
  }
  get name() {
    return "SuperBuy";
  }
  async send(order) {
    // Build the purchase data
    const purchaseData = this._builder.purchaseData(order);
    external_Logger_default().info("Sending order to SuperBuy...", purchaseData);

    // Do the actual call
    const response = await post("https://front.superbuy.com/cart/add-cart", {
      body: JSON.stringify(purchaseData),
      headers: {
        origin: "https://www.superbuy.com",
        referer: "https://www.superbuy.com/",
        "content-type": "application/json;charset=UTF-8",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36"
      }
    });
    const data = await response.json();
    if (data.state === 0 && data.msg === "Success") {
      return;
    }
    external_Logger_default().error("Item could not be added", data.msg);
    throw new SuperBuyError("Item could not be added");
  }
}
;// CONCATENATED MODULE: ./src/exceptions/WeGoBuyError.ts
class WeGoBuyError extends Error {
  constructor(message) {
    super(message);
    this.name = "WeGoBuyError";
  }
}
;// CONCATENATED MODULE: ./src/agents/WeGoBuy.ts




class WeGoBuy {
  constructor() {
    this._builder = new BuildTaoCarts();
  }
  get name() {
    return "WeGoBuy";
  }
  async send(order) {
    // Build the purchase data
    const purchaseData = this._builder.purchaseData(order);
    external_Logger_default().info("Sending order to WeGoBuy...", purchaseData);

    // Do the actual call
    const response = await post("https://front.wegobuy.com/cart/add-cart", {
      body: JSON.stringify(purchaseData),
      headers: {
        origin: "https://www.superbuy.com",
        referer: "https://www.superbuy.com/",
        "content-type": "application/json;charset=UTF-8",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36"
      }
    });
    const data = await response.json();
    if (data.state === 0 && data.msg === "Success") {
      return;
    }
    external_Logger_default().error("Item could not be added", data.msg);
    throw new WeGoBuyError("Item could not be added");
  }
}
;// CONCATENATED MODULE: ./src/agents/Agents.ts





const getAgent = selection => {
  switch (selection) {
    case "basetao":
      return new BaseTao();
    case "cssbuy":
      return new CSSBuy();
    case "pandabuy":
      return new PandaBuy();
    case "superbuy":
      return new SuperBuy();
    case "wegobuy":
      return new WeGoBuy();
    default:
      throw new Error(`Agent '${selection}' is not implemented`);
  }
};
;// CONCATENATED MODULE: ./src/classes/Item.ts
class Item {
  constructor(id, name, imageUrl, model, color, size, others) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.model = model;
    this.color = color;
    this.size = size;
    this.others = others;
  }
  get other() {
    return this.others.join("\n");
  }
}
;// CONCATENATED MODULE: ./src/classes/Order.ts
class Order {
  constructor(shop, item, price, shipping) {
    this.shop = shop;
    this.item = item;
    this.price = price;
    this.shipping = shipping;
  }
}
;// CONCATENATED MODULE: ./src/classes/Shop.ts
class Shop {
  constructor(id, name, url) {
    this.id = id;
    this.name = name;
    this.url = url;
  }
}
;// CONCATENATED MODULE: ./src/helpers/ElementReady.ts
/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 */
const elementReady = function (selector) {
  return new Promise(resolve => {
    // Check if the element already exists
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
    }

    // It doesn't so, so let's make a mutation observer and wait
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach(foundElement => {
        // Resolve the element that we found
        resolve(foundElement);

        // Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
};
;// CONCATENATED MODULE: ./src/helpers/RemoveWhitespaces.ts
/**
 * Trims the input text and removes all in between spaces as well.
 *
 * @param string {string}
 */
const removeWhitespaces = string => string.trim().replace(/\s(?=\s)/g, "");
;// CONCATENATED MODULE: ./src/helpers/Snackbar.ts

const Snackbar = function (toast) {
  // Log the snackbar, for ease of debugging
  external_Logger_default().info(toast);

  // Setup toast element
  const $toast = $(`<div style="background-color:#333;border-radius:2px;bottom:50%;color:#fff;display:block;font-size:16px;left:50%;margin-left:-150px;min-width:250px;opacity:1;padding:16px;position:fixed;right:50%;text-align:center;transition:background .2s;width:300px;z-index:2147483647">${toast}</div>`);

  // Append to the body
  $("body").append($toast);

  // Set a timeout to remove the toast
  setTimeout(() => $toast.fadeOut("slow", () => $toast.remove()), 5000);
};
;// CONCATENATED MODULE: ./src/stores/1688.ts








class Store1688 {
  constructor() {
    this.store = new (external_GMStorage_default())();
  }
  attach($document, localWindow) {
    elementReady(".order-button-wrapper > .order-button-children > .order-button-children-list").then(element => {
      const button = this._buildButton($document, localWindow);
      if (button === null) {
        return;
      }
      $(element).prepend(button);
    });
  }
  supports(hostname) {
    return hostname.includes("1688.com");
  }
  _buildButton($document, window) {
    // Force someone to select an agent
    if (this.store.get("agentSelection") === "empty") {
      GM_config.open();
      Snackbar("Please select what agent you use");
      return null;
    }

    // Get the agent related to our config
    const agent = getAgent(this.store.get("agentSelection", ""));

    // Create button
    const $button = $(`<button id="agent-button" class="order-normal-button order-button">Add to ${agent.name}</button>`);
    $button.on("click", async () => {
      // Disable button to prevent double clicks and show clear message
      $button.attr("disabled", "disabled").text("Processing...");

      // Try to build and send the order
      try {
        await agent.send(this._buildOrder($document, window));
      } catch (err) {
        $button.attr("disabled", null).text(`Add to ${agent.name}`);
        return Snackbar(err);
      }
      $button.attr("disabled", null).text(`Add to ${agent.name}`);

      // Success, tell the user
      return Snackbar("Item has been added, be sure to double check it");
    });
    return $('<div class="order-button-tip-wrapper"></div>').append($button);
  }
  _buildShop(window) {
    const id = window.__GLOBAL_DATA.offerBaseInfo.sellerUserId;
    const name = window.__GLOBAL_DATA.offerBaseInfo.sellerLoginId;
    const url = new URL(window.__GLOBAL_DATA.offerBaseInfo.sellerWinportUrl, window.location).toString();
    return new Shop(id, name, url);
  }
  _buildItem($document, window) {
    // Build item information
    const id = window.__GLOBAL_DATA.tempModel.offerId;
    const name = removeWhitespaces(window.__GLOBAL_DATA.tempModel.offerTitle);

    // Build image information
    const imageUrl = new URL(window.__GLOBAL_DATA.images[0].size310x310ImageURI, window.location).toString();

    // Retrieve the dynamic selected item
    const skus = this._processSku($document);
    return new Item(id, name, imageUrl, null, null, null, skus);
  }
  _buildPrice($document) {
    const itemPrice = Number(removeWhitespaces($document.find(".order-price-wrapper .total-price .value").text()));
    if (Number.isNaN(itemPrice)) {
      return 0;
    }
    return itemPrice;
  }
  _buildShipping($document) {
    const shippingPrice = Number(removeWhitespaces($document.find(".logistics-express .logistics-express-price").text()));
    if (Number.isNaN(shippingPrice)) {
      return 0;
    }
    return shippingPrice;
  }
  _buildOrder($document, window) {
    return new Order(this._buildShop(window), this._buildItem($document, window), this._buildPrice($document), this._buildShipping($document));
  }
  _processSku($document) {
    const selectedItems = [];

    // Grab the module that holds the selected data
    const skuData = this._findModule($document.find(".pc-sku-wrapper")[0]).getSkuData();

    // Grab the map we can use to find names
    const skuMap = skuData.skuState.skuSpecIdMap;

    // Parse all the selected items
    const selectedData = skuData.skuPannelInfo.getSubmitData().submitData;

    // Ensure at least one item is selected
    if (typeof selectedData.find(item => item.specId !== null) === "undefined") {
      throw new Error("Make sure to select at least one item");
    }

    // Process all selections
    selectedData.forEach(item => {
      const sku = skuMap[item.specId];

      // Build the proper name
      let name = removeWhitespaces(sku.firstProp);
      if (sku.secondProp != null && sku.secondProp.length !== 0) {
        name = `${name} - ${removeWhitespaces(sku.secondProp)}`;
      }

      // Add it to the list with quantity
      selectedItems.push(`${name}: ${item.quantity}x`);
    });
    return selectedItems;
  }
  _findModule($element) {
    const instanceKey = Object.keys($element).find(key => key.startsWith("__reactInternalInstance$"));
    const internalInstance = $element[instanceKey];
    if (internalInstance == null) return null;
    return internalInstance.return.ref.current;
  }
}
;// CONCATENATED MODULE: ./src/helpers/Capitalize.ts
/**
 * @param s {string|undefined}
 * @returns {string}
 */
const capitalize = s => s && s[0].toUpperCase() + s.slice(1) || "";
;// CONCATENATED MODULE: ./src/Enums.ts
class Enum {
  _model = ["型号", "模型", "模型", "model", "type"];
  _colors = ["颜色", "彩色", "色", "色彩", "配色", "配色方案", "color", "colour", "color scheme"];
  _sizing = ["尺寸", "尺码", "型号尺寸", "大小", "浆液", "码数", "码", "size", "sizing"];
  isModel(item) {
    return this._arrayContains(this._model, item);
  }
  isColor(item) {
    return this._arrayContains(this._colors, item);
  }
  isSize(item) {
    return this._arrayContains(this._sizing, item);
  }
  _arrayContains(array, query) {
    return array.filter(item => query.toLowerCase().indexOf(item.toLowerCase()) !== -1).length !== 0;
  }
}
;// CONCATENATED MODULE: ./src/helpers/RetrieveDynamicInformation.ts



const retrieveDynamicInformation = ($document, rowCss, rowTitleCss, selectedItemCss) => {
  // Create dynamic items
  let model = null;
  let color = null;
  let size = null;
  const others = [];

  // Load dynamic items
  $document.find(rowCss).each((key, value) => {
    const _enum = new Enum();
    const rowTitle = $(value).find(rowTitleCss).text();
    const selectedItem = $(value).find(selectedItemCss);

    // Check if this is model
    if (_enum.isModel(rowTitle)) {
      if (selectedItem.length === 0) {
        throw new Error("Model is missing");
      }
      model = removeWhitespaces(selectedItem.text());
      return;
    }

    // Check if this is color
    if (_enum.isColor(rowTitle)) {
      if (selectedItem.length === 0) {
        throw new Error("Color is missing");
      }
      color = removeWhitespaces(selectedItem.text());
      return;
    }

    // Check if this is size
    if (_enum.isSize(rowTitle)) {
      if (selectedItem.length === 0) {
        throw new Error("Sizing is missing");
      }
      size = removeWhitespaces(selectedItem.text());
      return;
    }
    others.push(`${capitalize(rowTitle)}: ${removeWhitespaces(selectedItem.text())}`);
  });
  return {
    model,
    color,
    size,
    others
  };
};
;// CONCATENATED MODULE: ./src/stores/TaoBao.ts








class TaoBao {
  attach($document, localWindow) {
    // If not logged in, show a snackbar
    elementReady("[class^=SecurityContent--rightTips]").then(() => {
      Snackbar("Please login before you use this script");
    });

    // If logged in, just continue
    elementReady("[class^=Actions--root]").then(element => {
      const button = this._buildButton($document, localWindow);
      if (button === null) {
        return;
      }
      $(element).after(button);
    });
  }
  supports(hostname) {
    return hostname.includes("taobao.com");
  }
  _buildButton($document, window) {
    // Force someone to select an agent
    if (GM_config.get("agentSelection") === "empty") {
      GM_config.open();
      Snackbar("Please select what agent you use");
      return null;
    }

    // Get the agent related to our config
    const agent = getAgent(GM_config.get("agentSelection"));
    const $button = $(`<button id="agent-button">Add to ${agent.name}</button>`).css("width", "288px").css("color", "#FFF").css("border-color", "#F40").css("background", "#F40").css("cursor", "pointer").css("text-align", "center").css("font-family", '"Hiragino Sans GB","microsoft yahei",sans-serif').css("font-size", "16px").css("line-height", "38px").css("border-width", "1px").css("border-style", "solid").css("border-radius", "2px");
    $button.on("click", async () => {
      // Disable button to prevent double clicks and show clear message
      $button.attr("disabled", "disabled").text("Processing...");

      // Try to build and send the order
      try {
        await agent.send(this._buildOrder($document, window));
      } catch (err) {
        $button.attr("disabled", null).text(`Add to ${agent.name}`);
        return Snackbar(err);
      }
      $button.attr("disabled", null).text(`Add to ${agent.name}`);

      // Success, tell the user
      return Snackbar("Item has been added, be sure to double check it");
    });
    return $('<div class="tb-btn-add-agent" style="margin-top: 20px"></div>').append($button);
  }
  _buildShop($document, window) {
    const storeURL = $document.find("a[class^=ShopHeader]").first().attr("href");
    const authorMatches = storeURL.match(/\/\/(.+)\.taobao\.com/);
    const id = authorMatches ? authorMatches[1] : storeURL;
    const name = $document.find("[class*=-shopName-]").text();
    const url = new URL(storeURL, window.location).toString();
    return new Shop(id, name, url);
  }
  _buildItem($document, window) {
    // Build item information
    const id = new URLSearchParams(window.location.search).get("id");
    const name = $document.find("h1[class^=ItemTitle--mainTitle]").text();

    // Build image information
    const picSrc = $document.find("img[class^=PicGallery--mainPic]").first().attr("src");
    const imageUrl = new URL(picSrc, window.location).toString();

    // Retrieve the dynamic selected item
    const {
      model,
      color,
      size,
      others
    } = retrieveDynamicInformation($document, "[class^=SkuContent--skuItem]", "[class^=ItemLabel--labelText]", "[class*=SkuContent--isSelected]");
    return new Item(id, name, imageUrl, model, color, size, others);
  }
  _buildPrice($document) {
    return Number(removeWhitespaces($document.find("[class^=Price--priceText]").text()));
  }
  _buildShipping($document) {
    const postageText = removeWhitespaces($document.find("#J_WlServiceInfo").first().text());

    // Check for free shipping
    if (postageText.includes("快递 免运费")) {
      return 0;
    }

    // Try and get postage from text
    const postageMatches = postageText.match(/([\d.]+)/);

    // If we can't find any numbers, assume free as well, agents will fix it
    return postageMatches !== null ? Number(postageMatches[0]) : 0;
  }
  _buildOrder($document, window) {
    return new Order(this._buildShop($document, window), this._buildItem($document, window), this._buildPrice($document), this._buildShipping($document));
  }
}
;// CONCATENATED MODULE: ./src/stores/Tmall.ts







class Tmall {
  attach($document, localWindow) {
    const button = this._buildButton($document, localWindow);
    if (button === null) {
      return;
    }
    $document.find(".tb-btn-basket.tb-btn-sku").before(button);
  }
  supports(hostname) {
    return hostname === "detail.tmall.com";
  }
  _buildButton($document, window) {
    // Force someone to select an agent
    if (GM_config.get("agentSelection") === "empty") {
      GM_config.open();
      Snackbar("Please select what agent you use");
      return null;
    }

    // Get the agent related to our config
    const agent = getAgent(GM_config.get("agentSelection"));
    const $button = $(`<button id="agent-button">Add to ${agent.name}</button>`).css("width", "180px").css("color", "#FFF").css("border-color", "#F40").css("background", "#F40").css("cursor", "pointer").css("text-align", "center").css("font-family", '"Hiragino Sans GB","microsoft yahei",sans-serif').css("font-size", "16px").css("line-height", "38px").css("border-width", "1px").css("border-style", "solid").css("border-radius", "2px");
    $button.on("click", async () => {
      // Disable button to prevent double clicks and show clear message
      $button.attr("disabled", "disabled").text("Processing...");

      // Try to build and send the order
      try {
        await agent.send(this._buildOrder($document, window));
      } catch (err) {
        $button.attr("disabled", null).text(`Add to ${agent.name}`);
        return Snackbar(err);
      }
      $button.attr("disabled", null).text(`Add to ${agent.name}`);

      // Success, tell the user
      return Snackbar("Item has been added, be sure to double check it");
    });
    return $('<div class="tb-btn-add-agent"></div>').append($button);
  }
  _buildShop(window) {
    const id = window.g_config.shopId;
    const name = window.g_config.sellerNickName;
    const url = new URL(window.g_config.shopUrl, window.location).toString();
    return new Shop(id, name, url);
  }
  _buildItem($document, window) {
    // Build item information
    const id = window.g_config.itemId;
    const name = removeWhitespaces($document.find("#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-detail-hd > h1").text());

    // Build image information
    const imageUrl = $document.find("#J_ImgBooth").first().attr("src");

    // Retrieve the dynamic selected item
    const {
      model,
      color,
      size,
      others
    } = retrieveDynamicInformation($document, ".tb-skin > .tb-sku > .tb-prop", ".tb-metatit", ".tb-selected");
    return new Item(id, name, imageUrl, model, color, size, others);
  }
  _buildPrice($document) {
    let price = Number(removeWhitespaces($document.find(".tm-price").first().text()));
    $document.find(".tm-price").each((key, element) => {
      const currentPrice = Number(removeWhitespaces(element.textContent));
      if (price > currentPrice) price = currentPrice;
    });
    return price;
  }
  _buildShipping($document) {
    const postageText = removeWhitespaces($document.find("#J_PostageToggleCont > p > .tm-yen").first().text());

    // Check for free shipping
    if (postageText.includes("快递 免运费")) {
      return 0;
    }

    // Try and get postage from text
    const postageMatches = postageText.match(/([\d.]+)/);

    // If we can't find any numbers, assume free as well, agents will fix it
    return postageMatches !== null ? Number(postageMatches[0]) : 0;
  }
  _buildOrder($document, window) {
    return new Order(this._buildShop(window), this._buildItem($document, window), this._buildPrice($document), this._buildShipping($document));
  }
}
;// CONCATENATED MODULE: ./src/stores/Weidian.ts








class Weidian {
  attach($document, localWindow) {
    $document.find(".footer-btn-container > span").add(".item-container > .sku-button").on("click", () => {
      // Force someone to select an agent
      if (GM_config.get("agentSelection") === "empty") {
        alert("Please select what agent you use");
        GM_config.open();
        return;
      }
      this._attachFooter($document, localWindow);
      this._attachFooterBuyNow($document, localWindow);
    });

    // Setup for storefront
    $document.on("mousedown", "div.base-ct.img-wrapper", () => {
      // Force new tab for shopping cart (must be done using actual window and by overwriting window.API.Bus)
      localWindow.API.Bus.on("onActiveSku", t => localWindow.open(`https://weidian.com/item.html?itemID=${t}&frb=open`).focus());
    });

    // Check if we are a focused screen (because of storefront handler) and open the cart right away
    if (new URLSearchParams(localWindow.location.search).get("frb") === "open") {
      $document.find("[data-spider-action-name='add_Cart']").trigger("click");
    }
  }
  supports(hostname) {
    return hostname.includes("weidian.com");
  }
  _attachFooter($document, window) {
    // Attach button the footer (buy with options or cart)
    elementReady(".sku-footer").then(element => {
      const $element = $(element);

      // Only add the button if it doesn't exist
      if ($element.parent().find("#agent-button").length !== 0) {
        return;
      }

      // Add the agent button, if we have one
      const button = this._attachButton($document, window);
      if (button === null) {
        return;
      }
      $element.after(button);
    });
  }
  _attachFooterBuyNow($document, window) {
    // Attach button the footer (buy now)
    elementReady("#login_quickLogin_wrapper").then(element => {
      const $parent = $(element).parent();

      // Only add the button if it doesn't exist
      if ($parent.parent().find("#agent-button").length !== 0) {
        return;
      }

      // Add the agent button, if we have one
      const button = this._attachButton($document, window);
      if (button === null) {
        return;
      }
      $parent.after(button);
    });
  }
  _attachButton($document, window) {
    // Force someone to select an agent
    if (GM_config.get("agentSelection") === "empty") {
      GM_config.open();
      Snackbar("Please select what agent you use");
      return null;
    }

    // Get the agent related to our config
    const agent = getAgent(GM_config.get("agentSelection"));
    const $button = $(`<button id="agent-button">Add to ${agent.name}</button>`).css("background", "#f29800").css("color", "#FFFFFF").css("font-size", "15px").css("text-align", "center").css("padding", "15px 0").css("width", "100%").css("height", "100%").css("cursor", "pointer");
    $button.on("click", async () => {
      // Disable button to prevent double clicks and show clear message
      $button.attr("disabled", "disabled").text("Processing...");

      // Try to build and send the order
      try {
        await agent.send(this._buildOrder($document, window));
      } catch (err) {
        $button.attr("disabled", null).text(`Add to ${agent.name}`);
        Snackbar(err);
        return;
      }
      $button.attr("disabled", null).text(`Add to ${agent.name}`);

      // Success, tell the user
      Snackbar("Item has been added, be sure to double check it");
      return;
    });
    return $button;
  }
  _buildShop($document, window) {
    // Setup default values for variables
    let id = null;
    let name = null;
    let url = null;

    // Try and fill the variables
    let $shop = $document.find(".shop-toggle-header-name").first();
    if ($shop.length !== 0) {
      name = removeWhitespaces($shop.text());
    }
    $shop = $document.find(".item-header-logo").first();
    if ($shop.length !== 0) {
      url = new URL($shop.attr("href"), window.location.href).toString();
      id = url.replace(/^\D+/g, "");
      name = removeWhitespaces($shop.text());
    }
    $shop = $document.find(".shop-name-str").first();
    if ($shop.length !== 0) {
      url = new URL($shop.parents("a").first().attr("href"), window.location.href).toString();
      id = url.replace(/^\D+/g, "");
      name = removeWhitespaces($shop.text());
    }

    // If no shop name is defined, just set shop ID
    if ((name === null || name.length === 0) && id !== null) {
      name = id;
    }
    return new Shop(id, name, url);
  }
  _buildItem($document, window) {
    // Build item information
    const id = window.location.href.match(/[?&]itemId=(\d+)/i)[1];
    const name = removeWhitespaces($document.find(".item-title").first().text());

    // Build image information
    let $itemImage = $document.find("img#skuPic");
    if ($itemImage.length === 0) $itemImage = $document.find("img.item-img");
    const imageUrl = $itemImage.first().attr("src");
    const {
      model,
      color,
      size,
      others
    } = retrieveDynamicInformation($document, ".sku-content .sku-row", ".row-title", ".sku-item.selected");
    return new Item(id, name, imageUrl, model, color, size, others);
  }
  _buildPrice($document) {
    let $currentPrice = $document.find(".sku-cur-price");
    if ($currentPrice.length === 0) $currentPrice = $document.find(".cur-price");
    return Number(removeWhitespaces($currentPrice.first().text()).replace(/(\D+)/, ""));
  }
  _buildShipping($document) {
    const $postageBlock = $document.find(".postage-block").first();
    const postageMatches = removeWhitespaces($postageBlock.text()).match(/([\d.]+)/);

    // If we can't find any numbers, assume free, agents will fix it
    return postageMatches !== null ? Number(postageMatches[0]) : 0;
  }
  _buildOrder($document, window) {
    return new Order(this._buildShop($document, window), this._buildItem($document, window), this._buildPrice($document), this._buildShipping($document));
  }
}
;// CONCATENATED MODULE: ./src/stores/Yupoo.ts






class Yupoo {
  attach($document, localWindow) {
    // Setup for item page
    const button = this._buildButton($document, localWindow);
    if (button === null) {
      return;
    }
    $document.find(".showalbumheader__tabgroup").prepend(button);
  }
  supports(hostname) {
    return hostname.includes("yupoo.com");
  }
  _buildButton($document, window) {
    // Force someone to select an agent
    if (GM_config.get("agentSelection") === "empty") {
      GM_config.open();
      Snackbar("Please select what agent you use");
      return null;
    }

    // Get the agent related to our config
    const agent = getAgent(GM_config.get("agentSelection"));
    const $button = $(`<a id="agent-button" class="button showalbumheader__copy" style="background: rgb(242, 152, 0); color: rgb(255, 255, 255);">Add to ${agent.name}</a>`);
    $button.on("click", async () => {
      // Disable button to prevent double clicks and show clear message
      $button.attr("disabled", "disabled").text("Processing...");

      // Try to build and send the order
      try {
        await agent.send(this._buildOrder($document, window));
      } catch (err) {
        $button.attr("disabled", null).text(`Add to ${agent.name}`);
        return Snackbar(err);
      }
      $button.attr("disabled", null).text(`Add to ${agent.name}`);

      // Success, tell the user
      return Snackbar("Item has been added, be sure to double check it");
    });
    return $button;
  }
  _buildShop($document, window) {
    // Setup default values for variables
    const author = window.location.hostname.replace(".x.yupoo.com", "");
    const name = $document.find(".showheader__headerTop > h1").first().text();
    const url = `https://${author}.x.yupoo.com/albums`;
    return new Shop(author, name, url);
  }
  _buildItem($document, window) {
    // Build item information
    const id = window.location.href.match(/albums\/(\d+)/i)[1];
    const name = removeWhitespaces($document.find("h2 > .showalbumheader__gallerytitle").first().text());

    // Build image information
    const $itemImage = $document.find(".showalbumheader__gallerycover > img").first();
    const imageUrl = new URL($itemImage.attr("src").replace("photo.yupoo.com/", "cdn.fashionreps.page/yupoo/"), window.location.href).toString();

    // Ask for dynamic information
    let color = prompt("What color (leave blank if not needed)?");
    if (color !== null && removeWhitespaces(color).length === 0) {
      color = null;
    }
    let size = prompt("What size (leave blank if not needed)?");
    if (size !== null && removeWhitespaces(size).length === 0) {
      size = null;
    }
    return new Item(id, name, imageUrl, null, color, size, []);
  }
  _buildPrice($document) {
    const priceHolder = $document.find("h2 > .showalbumheader__gallerytitle");
    let currentPrice = "0";

    // Try and find the price of the item
    const priceMatcher = priceHolder.text().match(/¥?(\d+)¥?/i);
    if (priceHolder && priceMatcher && priceMatcher.length !== 0) {
      currentPrice = priceMatcher[1];
    }
    const predeterminedPrice = Number(removeWhitespaces(currentPrice).replace(/(\D+)/, ""));
    const price = prompt("How much is the item?", String(predeterminedPrice));
    if (price === null || removeWhitespaces(price).length === 0) {
      return predeterminedPrice;
    }
    return Number(removeWhitespaces(price));
  }
  _buildOrder($document, window) {
    return new Order(this._buildShop($document, window), this._buildItem($document, window), this._buildPrice($document), 10);
  }
}
;// CONCATENATED MODULE: ./src/stores/Stores.ts





function getStore(hostname) {
  const agents = [new Store1688(), new TaoBao(), new Tmall(), new Yupoo(), new Weidian()];
  let agent = null;
  Object.values(agents).forEach(value => {
    if (value.supports(hostname)) {
      agent = value;
    }
  });
  return agent;
}
;// CONCATENATED MODULE: ./src/index.ts




// Inject config styling
GM_addStyle("div.config-dialog.config-dialog-ani { z-index: 2147483647; }");

// Setup proper settings menu
GM_config.init("Settings", {
  agentSection: {
    label: "Select your agent",
    type: "section"
  },
  agentSelection: {
    label: "Your agent",
    type: "select",
    default: "empty",
    options: {
      empty: "Select your agent...",
      basetao: "BaseTao",
      cssbuy: "CSSBuy",
      pandabuy: "PandaBuy",
      superbuy: "SuperBuy",
      wegobuy: "WeGoBuy"
    }
  }
});

// Reload page if config changed
GM_config.onclose = saveFlag => {
  if (saveFlag) {
    window.location.reload();
  }
};

// Register menu within GM
GM_registerMenuCommand("Settings", GM_config.open);

// eslint-disable-next-line func-names
(async function () {
  // Setup the logger.
  external_Logger_default().useDefaults();

  // Log the start of the script.
  external_Logger_default().info(`Starting extension '${GM_info.script.name}', version ${GM_info.script.version}`);

  // Check if we are on a store
  const store = getStore(window.location.hostname);
  if (store !== null) {
    // If we have a store handler, attach and start
    store.attach($(window.document), window.unsafeWindow);
    return;
  }

  // Check if we are on a reshipping agent
  const login = getLogin(window.location.hostname);
  if (login !== null) {
    // If we are on one, execute whatever needed for that
    login.process();
    return;
  }
  external_Logger_default().error("Unsupported website");
})();
})();

/******/ })()
;
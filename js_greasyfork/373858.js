// ==UserScript==
// @namespace    https://github.com/Sv443-Network/UserUtils
// @exclude      *
// @author       Sv443
// @supportURL   https://github.com/Sv443-Network/UserUtils/issues
// @homepageURL  https://github.com/Sv443-Network/UserUtils

// ==UserLibrary==
// @name         UserUtils
// @description  General purpose DOM/GreaseMonkey library that allows you to register listeners for when CSS selectors exist, intercept events, create persistent & synchronous data stores, modify the DOM more easily and much more
// @version      9.4.4
// @license      MIT
// @copyright    Sv443 (https://github.com/Sv443)

// ==/UserScript==
// ==/UserLibrary==

// ==OpenUserJS==
// @author       Sv443
// ==/OpenUserJS==

var UserUtils = (function (exports) {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // lib/math.ts
  function clamp(value, min, max) {
    if (typeof max !== "number") {
      max = min;
      min = 0;
    }
    return Math.max(Math.min(value, max), min);
  }
  function mapRange(value, range1min, range1max, range2min, range2max) {
    if (typeof range2min === "undefined" || typeof range2max === "undefined") {
      range2max = range1max;
      range1max = range1min;
      range2min = range1min = 0;
    }
    if (Number(range1min) === 0 && Number(range2min) === 0)
      return value * (range2max / range1max);
    return (value - range1min) * ((range2max - range2min) / (range1max - range1min)) + range2min;
  }
  function randRange(...args) {
    let min, max, enhancedEntropy = false;
    if (typeof args[0] === "number" && typeof args[1] === "number")
      [min, max] = args;
    else if (typeof args[0] === "number" && typeof args[1] !== "number") {
      min = 0;
      [max] = args;
    } else
      throw new TypeError(`Wrong parameter(s) provided - expected (number, boolean|undefined) or (number, number, boolean|undefined) but got (${args.map((a) => typeof a).join(", ")}) instead`);
    if (typeof args[2] === "boolean")
      enhancedEntropy = args[2];
    else if (typeof args[1] === "boolean")
      enhancedEntropy = args[1];
    min = Number(min);
    max = Number(max);
    if (isNaN(min) || isNaN(max))
      return NaN;
    if (min > max)
      throw new TypeError(`Parameter "min" can't be bigger than "max"`);
    if (enhancedEntropy) {
      const uintArr = new Uint8Array(1);
      crypto.getRandomValues(uintArr);
      return Number(Array.from(
        uintArr,
        (v) => Math.round(mapRange(v, 0, 255, min, max)).toString(10)
      ).join(""));
    } else
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function digitCount(num, withDecimals = true) {
    num = Number(!["string", "number"].includes(typeof num) ? String(num) : num);
    if (typeof num === "number" && isNaN(num))
      return NaN;
    const [intPart, decPart] = num.toString().split(".");
    const intDigits = intPart === "0" ? 1 : Math.floor(Math.log10(Math.abs(Number(intPart))) + 1);
    const decDigits = withDecimals && decPart ? decPart.length : 0;
    return intDigits + decDigits;
  }
  function roundFixed(num, fractionDigits) {
    const scale = 10 ** fractionDigits;
    return Math.round(num * scale) / scale;
  }
  function bitSetHas(bitSet, checkVal) {
    return (bitSet & checkVal) === checkVal;
  }

  // lib/array.ts
  function randomItem(array) {
    return randomItemIndex(array)[0];
  }
  function randomItemIndex(array) {
    if (array.length === 0)
      return [undefined, undefined];
    const idx = randRange(array.length - 1);
    return [array[idx], idx];
  }
  function takeRandomItem(arr) {
    const [itm, idx] = randomItemIndex(arr);
    if (idx === undefined)
      return undefined;
    arr.splice(idx, 1);
    return itm;
  }
  function randomizeArray(array) {
    const retArray = [...array];
    if (array.length === 0)
      return retArray;
    for (let i = retArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [retArray[i], retArray[j]] = [retArray[j], retArray[i]];
    }
    return retArray;
  }

  // lib/colors.ts
  function hexToRgb(hex) {
    hex = (hex.startsWith("#") ? hex.slice(1) : hex).trim();
    const a = hex.length === 8 || hex.length === 4 ? parseInt(hex.slice(-(hex.length / 4)), 16) / (hex.length === 8 ? 255 : 15) : undefined;
    if (!isNaN(Number(a)))
      hex = hex.slice(0, -(hex.length / 4));
    if (hex.length === 3 || hex.length === 4)
      hex = hex.split("").map((c) => c + c).join("");
    const bigint = parseInt(hex, 16);
    const r = bigint >> 16 & 255;
    const g = bigint >> 8 & 255;
    const b = bigint & 255;
    return [clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255), typeof a === "number" ? clamp(a, 0, 1) : undefined];
  }
  function rgbToHex(red, green, blue, alpha, withHash = true, upperCase = false) {
    const toHexVal = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0")[upperCase ? "toUpperCase" : "toLowerCase"]();
    return `${withHash ? "#" : ""}${toHexVal(red)}${toHexVal(green)}${toHexVal(blue)}${alpha ? toHexVal(alpha * 255) : ""}`;
  }
  function lightenColor(color, percent, upperCase = false) {
    return darkenColor(color, percent * -1, upperCase);
  }
  function darkenColor(color, percent, upperCase = false) {
    var _a;
    color = color.trim();
    const darkenRgb = (r2, g2, b2, percent2) => {
      r2 = Math.max(0, Math.min(255, r2 - r2 * percent2 / 100));
      g2 = Math.max(0, Math.min(255, g2 - g2 * percent2 / 100));
      b2 = Math.max(0, Math.min(255, b2 - b2 * percent2 / 100));
      return [r2, g2, b2];
    };
    let r, g, b, a;
    const isHexCol = color.match(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/);
    if (isHexCol)
      [r, g, b, a] = hexToRgb(color);
    else if (color.startsWith("rgb")) {
      const rgbValues = (_a = color.match(/\d+(\.\d+)?/g)) == null ? undefined : _a.map(Number);
      if (!rgbValues)
        throw new TypeError("Invalid RGB/RGBA color format");
      [r, g, b, a] = rgbValues;
    } else
      throw new TypeError("Unsupported color format");
    [r, g, b] = darkenRgb(r, g, b, percent);
    if (isHexCol)
      return rgbToHex(r, g, b, a, color.startsWith("#"), upperCase);
    else if (color.startsWith("rgba"))
      return `rgba(${r}, ${g}, ${b}, ${a != null ? a : NaN})`;
    else if (color.startsWith("rgb"))
      return `rgb(${r}, ${g}, ${b})`;
    else
      throw new TypeError("Unsupported color format");
  }

  // lib/errors.ts
  var UUError = class extends Error {
    constructor(message, options) {
      super(message, options);
      __publicField(this, "date");
      this.date = /* @__PURE__ */ new Date();
    }
  };
  var ChecksumMismatchError = class extends UUError {
    constructor(message, options) {
      super(message, options);
      this.name = "ChecksumMismatchError";
    }
  };
  var MigrationError = class extends UUError {
    constructor(message, options) {
      super(message, options);
      this.name = "MigrationError";
    }
  };
  var PlatformError = class extends UUError {
    constructor(message, options) {
      super(message, options);
      this.name = "PlatformError";
    }
  };

  // lib/dom.ts
  var domReady = false;
  document.addEventListener("DOMContentLoaded", () => domReady = true);
  function getUnsafeWindow() {
    try {
      return unsafeWindow;
    } catch (e) {
      return window;
    }
  }
  function addParent(element, newParent) {
    const oldParent = element.parentNode;
    if (!oldParent)
      throw new Error("Element doesn't have a parent node");
    oldParent.replaceChild(newParent, element);
    newParent.appendChild(element);
    return newParent;
  }
  function addGlobalStyle(style) {
    const styleElem = document.createElement("style");
    setInnerHtmlUnsafe(styleElem, style);
    document.head.appendChild(styleElem);
    return styleElem;
  }
  function preloadImages(srcUrls, rejects = false) {
    const promises = srcUrls.map((src) => new Promise((res, rej) => {
      const image = new Image();
      image.addEventListener("load", () => res(image));
      image.addEventListener("error", (evt) => rejects && rej(evt));
      image.src = src;
    }));
    return Promise.allSettled(promises);
  }
  function openInNewTab(href, background, additionalProps) {
    try {
      if (typeof window.GM === "object")
        GM.openInTab(href, background);
    } catch (e) {
      const openElem = document.createElement("a");
      Object.assign(openElem, __spreadValues({
        className: "userutils-open-in-new-tab",
        target: "_blank",
        rel: "noopener noreferrer",
        tabIndex: -1,
        ariaHidden: "true",
        href
      }, additionalProps));
      Object.assign(openElem.style, {
        display: "none",
        pointerEvents: "none"
      });
      document.body.appendChild(openElem);
      openElem.click();
      setTimeout(() => {
        try {
          openElem.remove();
        } catch (e2) {
        }
      }, 0);
    }
  }
  function interceptEvent(eventObject, eventName, predicate = () => true) {
    var _a;
    if (typeof window.GM === "object" && ((_a = GM == null ? undefined : GM.info) == null ? undefined : _a.scriptHandler) && GM.info.scriptHandler === "FireMonkey" && (eventObject === window || eventObject === getUnsafeWindow()))
      throw new PlatformError("Intercepting window events is not supported on FireMonkey due to the isolated context the userscript runs in.");
    Error.stackTraceLimit = Math.max(Error.stackTraceLimit, 100);
    if (isNaN(Error.stackTraceLimit))
      Error.stackTraceLimit = 100;
    (function(original) {
      eventObject.__proto__.addEventListener = function(...args) {
        var _a2, _b;
        const origListener = typeof args[1] === "function" ? args[1] : (_b = (_a2 = args[1]) == null ? undefined : _a2.handleEvent) != null ? _b : () => undefined;
        args[1] = function(...a) {
          if (args[0] === eventName && predicate(Array.isArray(a) ? a[0] : a))
            return;
          else
            return origListener.apply(this, a);
        };
        original.apply(this, args);
      };
    })(eventObject.__proto__.addEventListener);
  }
  function interceptWindowEvent(eventName, predicate = () => true) {
    return interceptEvent(getUnsafeWindow(), eventName, predicate);
  }
  function isScrollable(element) {
    const { overflowX, overflowY } = getComputedStyle(element);
    return {
      vertical: (overflowY === "scroll" || overflowY === "auto") && element.scrollHeight > element.clientHeight,
      horizontal: (overflowX === "scroll" || overflowX === "auto") && element.scrollWidth > element.clientWidth
    };
  }
  function observeElementProp(element, property, callback) {
    const elementPrototype = Object.getPrototypeOf(element);
    if (elementPrototype.hasOwnProperty(property)) {
      const descriptor = Object.getOwnPropertyDescriptor(elementPrototype, property);
      Object.defineProperty(element, property, {
        get: function() {
          var _a;
          return (_a = descriptor == null ? undefined : descriptor.get) == null ? undefined : _a.apply(this, arguments);
        },
        set: function() {
          var _a;
          const oldValue = this[property];
          (_a = descriptor == null ? undefined : descriptor.set) == null ? undefined : _a.apply(this, arguments);
          const newValue = this[property];
          if (typeof callback === "function") {
            callback.bind(this, oldValue, newValue);
          }
          return newValue;
        }
      });
    }
  }
  function getSiblingsFrame(refElement, siblingAmount, refElementAlignment = "center-top", includeRef = true) {
    var _a, _b;
    const siblings = [...(_b = (_a = refElement.parentNode) == null ? undefined : _a.childNodes) != null ? _b : []];
    const elemSiblIdx = siblings.indexOf(refElement);
    if (elemSiblIdx === -1)
      throw new Error("Element doesn't have a parent node");
    if (refElementAlignment === "top")
      return [...siblings.slice(elemSiblIdx + Number(!includeRef), elemSiblIdx + siblingAmount + Number(!includeRef))];
    else if (refElementAlignment.startsWith("center-")) {
      const halfAmount = (refElementAlignment === "center-bottom" ? Math.ceil : Math.floor)(siblingAmount / 2);
      const startIdx = Math.max(0, elemSiblIdx - halfAmount);
      const topOffset = Number(refElementAlignment === "center-top" && siblingAmount % 2 === 0 && includeRef);
      const btmOffset = Number(refElementAlignment === "center-bottom" && siblingAmount % 2 !== 0 && includeRef);
      const startIdxWithOffset = startIdx + topOffset + btmOffset;
      return [
        ...siblings.filter((_, idx) => includeRef || idx !== elemSiblIdx).slice(startIdxWithOffset, startIdxWithOffset + siblingAmount)
      ];
    } else if (refElementAlignment === "bottom")
      return [...siblings.slice(elemSiblIdx - siblingAmount + Number(includeRef), elemSiblIdx + Number(includeRef))];
    return [];
  }
  var ttPolicy;
  function setInnerHtmlUnsafe(element, html) {
    var _a, _b, _c;
    if (!ttPolicy && typeof ((_a = window == null ? undefined : window.trustedTypes) == null ? undefined : _a.createPolicy) === "function") {
      ttPolicy = window.trustedTypes.createPolicy("_uu_set_innerhtml_unsafe", {
        createHTML: (unsafeHtml) => unsafeHtml
      });
    }
    element.innerHTML = (_c = (_b = ttPolicy == null ? undefined : ttPolicy.createHTML) == null ? undefined : _b.call(ttPolicy, html)) != null ? _c : html;
    return element;
  }
  function probeElementStyle(probeStyle, element, hideOffscreen = true, parentElement = document.body) {
    const el = element ? typeof element === "function" ? element() : element : document.createElement("span");
    if (hideOffscreen) {
      el.style.position = "absolute";
      el.style.left = "-9999px";
      el.style.top = "-9999px";
      el.style.zIndex = "-9999";
    }
    el.classList.add("_uu_probe_element");
    parentElement.appendChild(el);
    const style = window.getComputedStyle(el);
    const result = probeStyle(style, el);
    setTimeout(() => el.remove(), 1);
    return result;
  }
  function isDomLoaded() {
    return domReady;
  }
  function onDomLoad(cb) {
    return new Promise((res) => {
      if (domReady) {
        cb == null ? undefined : cb();
        res();
      } else
        document.addEventListener("DOMContentLoaded", () => {
          cb == null ? undefined : cb();
          res();
        });
    });
  }

  // lib/crypto.ts
  function compress(input, compressionFormat, outputType = "string") {
    return __async(this, null, function* () {
      const byteArray = typeof input === "string" ? new TextEncoder().encode(input) : input;
      const comp = new CompressionStream(compressionFormat);
      const writer = comp.writable.getWriter();
      writer.write(byteArray);
      writer.close();
      const buf = yield new Response(comp.readable).arrayBuffer();
      return outputType === "arrayBuffer" ? buf : ab2str(buf);
    });
  }
  function decompress(input, compressionFormat, outputType = "string") {
    return __async(this, null, function* () {
      const byteArray = typeof input === "string" ? str2ab(input) : input;
      const decomp = new DecompressionStream(compressionFormat);
      const writer = decomp.writable.getWriter();
      writer.write(byteArray);
      writer.close();
      const buf = yield new Response(decomp.readable).arrayBuffer();
      return outputType === "arrayBuffer" ? buf : new TextDecoder().decode(buf);
    });
  }
  function ab2str(buf) {
    return getUnsafeWindow().btoa(
      new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  }
  function str2ab(str) {
    return Uint8Array.from(getUnsafeWindow().atob(str), (c) => c.charCodeAt(0));
  }
  function computeHash(input, algorithm = "SHA-256") {
    return __async(this, null, function* () {
      let data;
      if (typeof input === "string") {
        const encoder = new TextEncoder();
        data = encoder.encode(input);
      } else
        data = input;
      const hashBuffer = yield crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
      return hashHex;
    });
  }
  function randomId(length = 16, radix = 16, enhancedEntropy = false, randomCase = true) {
    if (length < 1)
      throw new RangeError("The length argument must be at least 1");
    if (radix < 2 || radix > 36)
      throw new RangeError("The radix argument must be between 2 and 36");
    let arr = [];
    const caseArr = randomCase ? [0, 1] : [0];
    if (enhancedEntropy) {
      const uintArr = new Uint8Array(length);
      crypto.getRandomValues(uintArr);
      arr = Array.from(
        uintArr,
        (v) => mapRange(v, 0, 255, 0, radix).toString(radix).substring(0, 1)
      );
    } else {
      arr = Array.from(
        { length },
        () => Math.floor(Math.random() * radix).toString(radix)
      );
    }
    if (!arr.some((v) => /[a-zA-Z]/.test(v)))
      return arr.join("");
    return arr.map((v) => caseArr[randRange(0, caseArr.length - 1, enhancedEntropy)] === 1 ? v.toUpperCase() : v).join("");
  }

  // lib/DataStore.ts
  var DataStore = class {
    /**
     * Creates an instance of DataStore to manage a sync & async database that is cached in memory and persistently saved across sessions.  
     * Supports migrating data from older versions to newer ones and populating the cache with default data if no persistent data is found.  
     *   
     * - ⚠️ Requires the directives `@grant GM.getValue` and `@grant GM.setValue` if the storageMethod is left as the default of `"GM"`  
     * - ⚠️ Make sure to call {@linkcode loadData()} at least once after creating an instance, or the returned data will be the same as `options.defaultData`
     * 
     * @template TData The type of the data that is saved in persistent storage for the currently set format version (will be automatically inferred from `defaultData` if not provided) - **This has to be a JSON-compatible object!** (no undefined, circular references, etc.)
     * @param options The options for this DataStore instance
     */
    constructor(options) {
      __publicField(this, "id");
      __publicField(this, "formatVersion");
      __publicField(this, "defaultData");
      __publicField(this, "encodeData");
      __publicField(this, "decodeData");
      __publicField(this, "storageMethod");
      __publicField(this, "cachedData");
      __publicField(this, "migrations");
      __publicField(this, "migrateIds", []);
      var _a;
      this.id = options.id;
      this.formatVersion = options.formatVersion;
      this.defaultData = options.defaultData;
      this.cachedData = options.defaultData;
      this.migrations = options.migrations;
      if (options.migrateIds)
        this.migrateIds = Array.isArray(options.migrateIds) ? options.migrateIds : [options.migrateIds];
      this.storageMethod = (_a = options.storageMethod) != null ? _a : "GM";
      this.encodeData = options.encodeData;
      this.decodeData = options.decodeData;
    }
    //#region public
    /**
     * Loads the data saved in persistent storage into the in-memory cache and also returns it.  
     * Automatically populates persistent storage with default data if it doesn't contain any data yet.  
     * Also runs all necessary migration functions if the data format has changed since the last time the data was saved.
     */
    loadData() {
      return __async(this, null, function* () {
        try {
          if (this.migrateIds.length > 0) {
            yield this.migrateId(this.migrateIds);
            this.migrateIds = [];
          }
          const gmData = yield this.getValue(`_uucfg-${this.id}`, JSON.stringify(this.defaultData));
          let gmFmtVer = Number(yield this.getValue(`_uucfgver-${this.id}`, NaN));
          if (typeof gmData !== "string") {
            yield this.saveDefaultData();
            return __spreadValues({}, this.defaultData);
          }
          const isEncoded = Boolean(yield this.getValue(`_uucfgenc-${this.id}`, false));
          let saveData = false;
          if (isNaN(gmFmtVer)) {
            yield this.setValue(`_uucfgver-${this.id}`, gmFmtVer = this.formatVersion);
            saveData = true;
          }
          let parsed = yield this.deserializeData(gmData, isEncoded);
          if (gmFmtVer < this.formatVersion && this.migrations)
            parsed = yield this.runMigrations(parsed, gmFmtVer);
          if (saveData)
            yield this.setData(parsed);
          this.cachedData = __spreadValues({}, parsed);
          return this.cachedData;
        } catch (err) {
          console.warn("Error while parsing JSON data, resetting it to the default value.", err);
          yield this.saveDefaultData();
          return this.defaultData;
        }
      });
    }
    /**
     * Returns a copy of the data from the in-memory cache.  
     * Use {@linkcode loadData()} to get fresh data from persistent storage (usually not necessary since the cache should always exactly reflect persistent storage).
     * @param deepCopy Whether to return a deep copy of the data (default: `false`) - only necessary if your data object is nested and may have a bigger performance impact if enabled
     */
    getData(deepCopy = false) {
      return deepCopy ? this.deepCopy(this.cachedData) : __spreadValues({}, this.cachedData);
    }
    /** Saves the data synchronously to the in-memory cache and asynchronously to the persistent storage */
    setData(data) {
      this.cachedData = data;
      const useEncoding = this.encodingEnabled();
      return new Promise((resolve) => __async(this, null, function* () {
        yield Promise.all([
          this.setValue(`_uucfg-${this.id}`, yield this.serializeData(data, useEncoding)),
          this.setValue(`_uucfgver-${this.id}`, this.formatVersion),
          this.setValue(`_uucfgenc-${this.id}`, useEncoding)
        ]);
        resolve();
      }));
    }
    /** Saves the default data passed in the constructor synchronously to the in-memory cache and asynchronously to persistent storage */
    saveDefaultData() {
      return __async(this, null, function* () {
        this.cachedData = this.defaultData;
        const useEncoding = this.encodingEnabled();
        return new Promise((resolve) => __async(this, null, function* () {
          yield Promise.all([
            this.setValue(`_uucfg-${this.id}`, yield this.serializeData(this.defaultData, useEncoding)),
            this.setValue(`_uucfgver-${this.id}`, this.formatVersion),
            this.setValue(`_uucfgenc-${this.id}`, useEncoding)
          ]);
          resolve();
        }));
      });
    }
    /**
     * Call this method to clear all persistently stored data associated with this DataStore instance.  
     * The in-memory cache will be left untouched, so you may still access the data with {@linkcode getData()}  
     * Calling {@linkcode loadData()} or {@linkcode setData()} after this method was called will recreate persistent storage with the cached or default data.  
     *   
     * - ⚠️ This requires the additional directive `@grant GM.deleteValue` if the storageMethod is left as the default of `"GM"`
     */
    deleteData() {
      return __async(this, null, function* () {
        yield Promise.all([
          this.deleteValue(`_uucfg-${this.id}`),
          this.deleteValue(`_uucfgver-${this.id}`),
          this.deleteValue(`_uucfgenc-${this.id}`)
        ]);
      });
    }
    /** Returns whether encoding and decoding are enabled for this DataStore instance */
    encodingEnabled() {
      return Boolean(this.encodeData && this.decodeData);
    }
    //#region migrations
    /**
     * Runs all necessary migration functions consecutively and saves the result to the in-memory cache and persistent storage and also returns it.  
     * This method is automatically called by {@linkcode loadData()} if the data format has changed since the last time the data was saved.  
     * Though calling this method manually is not necessary, it can be useful if you want to run migrations for special occasions like a user importing potentially outdated data that has been previously exported.  
     *   
     * If one of the migrations fails, the data will be reset to the default value if `resetOnError` is set to `true` (default). Otherwise, an error will be thrown and no data will be saved.
     */
    runMigrations(oldData, oldFmtVer, resetOnError = true) {
      return __async(this, null, function* () {
        if (!this.migrations)
          return oldData;
        let newData = oldData;
        const sortedMigrations = Object.entries(this.migrations).sort(([a], [b]) => Number(a) - Number(b));
        let lastFmtVer = oldFmtVer;
        for (const [fmtVer, migrationFunc] of sortedMigrations) {
          const ver = Number(fmtVer);
          if (oldFmtVer < this.formatVersion && oldFmtVer < ver) {
            try {
              const migRes = migrationFunc(newData);
              newData = migRes instanceof Promise ? yield migRes : migRes;
              lastFmtVer = oldFmtVer = ver;
            } catch (err) {
              if (!resetOnError)
                throw new MigrationError(`Error while running migration function for format version '${fmtVer}'`, { cause: err });
              yield this.saveDefaultData();
              return this.getData();
            }
          }
        }
        yield Promise.all([
          this.setValue(`_uucfg-${this.id}`, yield this.serializeData(newData)),
          this.setValue(`_uucfgver-${this.id}`, lastFmtVer),
          this.setValue(`_uucfgenc-${this.id}`, this.encodingEnabled())
        ]);
        return this.cachedData = __spreadValues({}, newData);
      });
    }
    /**
     * Tries to migrate the currently saved persistent data from one or more old IDs to the ID set in the constructor.  
     * If no data exist for the old ID(s), nothing will be done, but some time may still pass trying to fetch the non-existent data.
     */
    migrateId(oldIds) {
      return __async(this, null, function* () {
        const ids = Array.isArray(oldIds) ? oldIds : [oldIds];
        yield Promise.all(ids.map((id) => __async(this, null, function* () {
          const data = yield this.getValue(`_uucfg-${id}`, JSON.stringify(this.defaultData));
          const fmtVer = Number(yield this.getValue(`_uucfgver-${id}`, NaN));
          const isEncoded = Boolean(yield this.getValue(`_uucfgenc-${id}`, false));
          if (data === undefined || isNaN(fmtVer))
            return;
          const parsed = yield this.deserializeData(data, isEncoded);
          yield Promise.allSettled([
            this.setValue(`_uucfg-${this.id}`, yield this.serializeData(parsed)),
            this.setValue(`_uucfgver-${this.id}`, fmtVer),
            this.setValue(`_uucfgenc-${this.id}`, isEncoded),
            this.deleteValue(`_uucfg-${id}`),
            this.deleteValue(`_uucfgver-${id}`),
            this.deleteValue(`_uucfgenc-${id}`)
          ]);
        })));
      });
    }
    //#region serialization
    /** Serializes the data using the optional this.encodeData() and returns it as a string */
    serializeData(data, useEncoding = true) {
      return __async(this, null, function* () {
        const stringData = JSON.stringify(data);
        if (!this.encodingEnabled() || !useEncoding)
          return stringData;
        const encRes = this.encodeData(stringData);
        if (encRes instanceof Promise)
          return yield encRes;
        return encRes;
      });
    }
    /** Deserializes the data using the optional this.decodeData() and returns it as a JSON object */
    deserializeData(data, useEncoding = true) {
      return __async(this, null, function* () {
        let decRes = this.encodingEnabled() && useEncoding ? this.decodeData(data) : undefined;
        if (decRes instanceof Promise)
          decRes = yield decRes;
        return JSON.parse(decRes != null ? decRes : data);
      });
    }
    /** Copies a JSON-compatible object and loses all its internal references in the process */
    deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
    //#region storage
    /** Gets a value from persistent storage - can be overwritten in a subclass if you want to use something other than the default storage methods */
    getValue(name, defaultValue) {
      return __async(this, null, function* () {
        var _a, _b;
        switch (this.storageMethod) {
          case "localStorage":
            return (_a = localStorage.getItem(name)) != null ? _a : defaultValue;
          case "sessionStorage":
            return (_b = sessionStorage.getItem(name)) != null ? _b : defaultValue;
          default:
            return GM.getValue(name, defaultValue);
        }
      });
    }
    /**
     * Sets a value in persistent storage - can be overwritten in a subclass if you want to use something other than the default storage methods.  
     * The default storage engines will stringify all passed values like numbers or booleans, so be aware of that.
     */
    setValue(name, value) {
      return __async(this, null, function* () {
        switch (this.storageMethod) {
          case "localStorage":
            return localStorage.setItem(name, String(value));
          case "sessionStorage":
            return sessionStorage.setItem(name, String(value));
          default:
            return GM.setValue(name, String(value));
        }
      });
    }
    /** Deletes a value from persistent storage - can be overwritten in a subclass if you want to use something other than the default storage methods */
    deleteValue(name) {
      return __async(this, null, function* () {
        switch (this.storageMethod) {
          case "localStorage":
            return localStorage.removeItem(name);
          case "sessionStorage":
            return sessionStorage.removeItem(name);
          default:
            return GM.deleteValue(name);
        }
      });
    }
  };

  // lib/DataStoreSerializer.ts
  var DataStoreSerializer = class _DataStoreSerializer {
    constructor(stores, options = {}) {
      __publicField(this, "stores");
      __publicField(this, "options");
      if (!getUnsafeWindow().crypto || !getUnsafeWindow().crypto.subtle)
        throw new Error("DataStoreSerializer has to run in a secure context (HTTPS)!");
      this.stores = stores;
      this.options = __spreadValues({
        addChecksum: true,
        ensureIntegrity: true
      }, options);
    }
    /** Calculates the checksum of a string */
    calcChecksum(input) {
      return __async(this, null, function* () {
        return computeHash(input, "SHA-256");
      });
    }
    /**
     * Serializes only a subset of the data stores into a string.  
     * @param stores An array of store IDs or functions that take a store ID and return a boolean
     * @param useEncoding Whether to encode the data using each DataStore's `encodeData()` method
     * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
     */
    serializePartial(stores, useEncoding = true, stringified = true) {
      return __async(this, null, function* () {
        const serData = [];
        for (const storeInst of this.stores.filter((s) => typeof stores === "function" ? stores(s.id) : stores.includes(s.id))) {
          const data = useEncoding && storeInst.encodingEnabled() ? yield storeInst.encodeData(JSON.stringify(storeInst.getData())) : JSON.stringify(storeInst.getData());
          serData.push({
            id: storeInst.id,
            data,
            formatVersion: storeInst.formatVersion,
            encoded: useEncoding && storeInst.encodingEnabled(),
            checksum: this.options.addChecksum ? yield this.calcChecksum(data) : undefined
          });
        }
        return stringified ? JSON.stringify(serData) : serData;
      });
    }
    /**
     * Serializes the data stores into a string.  
     * @param useEncoding Whether to encode the data using each DataStore's `encodeData()` method
     * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
     */
    serialize(useEncoding = true, stringified = true) {
      return __async(this, null, function* () {
        return this.serializePartial(this.stores.map((s) => s.id), useEncoding, stringified);
      });
    }
    /**
     * Deserializes the data exported via {@linkcode serialize()} and imports only a subset into the DataStore instances.  
     * Also triggers the migration process if the data format has changed.
     */
    deserializePartial(stores, data) {
      return __async(this, null, function* () {
        const deserStores = typeof data === "string" ? JSON.parse(data) : data;
        if (!Array.isArray(deserStores) || !deserStores.every(_DataStoreSerializer.isSerializedDataStoreObj))
          throw new TypeError("Invalid serialized data format! Expected an array of SerializedDataStore objects.");
        for (const storeData of deserStores.filter((s) => typeof stores === "function" ? stores(s.id) : stores.includes(s.id))) {
          const storeInst = this.stores.find((s) => s.id === storeData.id);
          if (!storeInst)
            throw new Error(`DataStore instance with ID "${storeData.id}" not found! Make sure to provide it in the DataStoreSerializer constructor.`);
          if (this.options.ensureIntegrity && typeof storeData.checksum === "string") {
            const checksum = yield this.calcChecksum(storeData.data);
            if (checksum !== storeData.checksum)
              throw new ChecksumMismatchError(`Checksum mismatch for DataStore with ID "${storeData.id}"!
Expected: ${storeData.checksum}
Has: ${checksum}`);
          }
          const decodedData = storeData.encoded && storeInst.encodingEnabled() ? yield storeInst.decodeData(storeData.data) : storeData.data;
          if (storeData.formatVersion && !isNaN(Number(storeData.formatVersion)) && Number(storeData.formatVersion) < storeInst.formatVersion)
            yield storeInst.runMigrations(JSON.parse(decodedData), Number(storeData.formatVersion), false);
          else
            yield storeInst.setData(JSON.parse(decodedData));
        }
      });
    }
    /**
     * Deserializes the data exported via {@linkcode serialize()} and imports the data into all matching DataStore instances.  
     * Also triggers the migration process if the data format has changed.
     */
    deserialize(data) {
      return __async(this, null, function* () {
        return this.deserializePartial(this.stores.map((s) => s.id), data);
      });
    }
    /**
     * Loads the persistent data of the DataStore instances into the in-memory cache.  
     * Also triggers the migration process if the data format has changed.
     * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be loaded
     * @returns Returns a PromiseSettledResult array with the results of each DataStore instance in the format `{ id: string, data: object }`
     */
    loadStoresData(stores) {
      return __async(this, null, function* () {
        return Promise.allSettled(
          this.getStoresFiltered(stores).map((store) => __async(this, null, function* () {
            return {
              id: store.id,
              data: yield store.loadData()
            };
          }))
        );
      });
    }
    /**
     * Resets the persistent and in-memory data of the DataStore instances to their default values.
     * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be affected
     */
    resetStoresData(stores) {
      return __async(this, null, function* () {
        return Promise.allSettled(
          this.getStoresFiltered(stores).map((store) => store.saveDefaultData())
        );
      });
    }
    /**
     * Deletes the persistent data of the DataStore instances.  
     * Leaves the in-memory data untouched.  
     * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be affected
     */
    deleteStoresData(stores) {
      return __async(this, null, function* () {
        return Promise.allSettled(
          this.getStoresFiltered(stores).map((store) => store.deleteData())
        );
      });
    }
    /** Checks if a given value is an array of SerializedDataStore objects */
    static isSerializedDataStoreObjArray(obj) {
      return Array.isArray(obj) && obj.every((o) => typeof o === "object" && o !== null && "id" in o && "data" in o && "formatVersion" in o && "encoded" in o);
    }
    /** Checks if a given value is a SerializedDataStore object */
    static isSerializedDataStoreObj(obj) {
      return typeof obj === "object" && obj !== null && "id" in obj && "data" in obj && "formatVersion" in obj && "encoded" in obj;
    }
    /** Returns the DataStore instances whose IDs match the provided array or function */
    getStoresFiltered(stores) {
      return this.stores.filter((s) => typeof stores === "undefined" ? true : Array.isArray(stores) ? stores.includes(s.id) : stores(s.id));
    }
  };

  // node_modules/.pnpm/nanoevents@9.1.0/node_modules/nanoevents/index.js
  var createNanoEvents = () => ({
    emit(event, ...args) {
      for (let callbacks = this.events[event] || [], i = 0, length = callbacks.length; i < length; i++) {
        callbacks[i](...args);
      }
    },
    events: {},
    on(event, cb) {
      var _a;
      ((_a = this.events)[event] || (_a[event] = [])).push(cb);
      return () => {
        var _a2;
        this.events[event] = (_a2 = this.events[event]) == null ? undefined : _a2.filter((i) => cb !== i);
      };
    }
  });

  // lib/NanoEmitter.ts
  var NanoEmitter = class {
    /** Creates a new instance of NanoEmitter - a lightweight event emitter with helper methods and a strongly typed event map */
    constructor(options = {}) {
      __publicField(this, "events", createNanoEvents());
      __publicField(this, "eventUnsubscribes", []);
      __publicField(this, "emitterOptions");
      this.emitterOptions = __spreadValues({
        publicEmit: false
      }, options);
    }
    /**
     * Subscribes to an event and calls the callback when it's emitted.  
     * @param event The event to subscribe to. Use `as "_"` in case your event names aren't thoroughly typed (like when using a template literal, e.g. \`event-${val}\` as "_")
     * @returns Returns a function that can be called to unsubscribe the event listener
     * @example ```ts
     * const emitter = new NanoEmitter<{
     *   foo: (bar: string) => void;
     * }>({
     *   publicEmit: true,
     * });
     * 
     * let i = 0;
     * const unsub = emitter.on("foo", (bar) => {
     *   // unsubscribe after 10 events:
     *   if(++i === 10) unsub();
     *   console.log(bar);
     * });
     * 
     * emitter.emit("foo", "bar");
     * ```
     */
    on(event, cb) {
      let unsub;
      const unsubProxy = () => {
        if (!unsub)
          return;
        unsub();
        this.eventUnsubscribes = this.eventUnsubscribes.filter((u) => u !== unsub);
      };
      unsub = this.events.on(event, cb);
      this.eventUnsubscribes.push(unsub);
      return unsubProxy;
    }
    /**
     * Subscribes to an event and calls the callback or resolves the Promise only once when it's emitted.  
     * @param event The event to subscribe to. Use `as "_"` in case your event names aren't thoroughly typed (like when using a template literal, e.g. \`event-${val}\` as "_")
     * @param cb The callback to call when the event is emitted - if provided or not, the returned Promise will resolve with the event arguments
     * @returns Returns a Promise that resolves with the event arguments when the event is emitted
     * @example ```ts
     * const emitter = new NanoEmitter<{
     *   foo: (bar: string) => void;
     * }>();
     * 
     * // Promise syntax:
     * const [bar] = await emitter.once("foo");
     * console.log(bar);
     * 
     * // Callback syntax:
     * emitter.once("foo", (bar) => console.log(bar));
     * ```
     */
    once(event, cb) {
      return new Promise((resolve) => {
        let unsub;
        const onceProxy = (...args) => {
          cb == null ? undefined : cb(...args);
          unsub == null ? undefined : unsub();
          resolve(args);
        };
        unsub = this.events.on(event, onceProxy);
        this.eventUnsubscribes.push(unsub);
      });
    }
    /**
     * Emits an event on this instance.  
     * ⚠️ Needs `publicEmit` to be set to true in the NanoEmitter constructor or super() call!
     * @param event The event to emit
     * @param args The arguments to pass to the event listeners
     * @returns Returns true if `publicEmit` is true and the event was emitted successfully
     */
    emit(event, ...args) {
      if (this.emitterOptions.publicEmit) {
        this.events.emit(event, ...args);
        return true;
      }
      return false;
    }
    /** Unsubscribes all event listeners from this instance */
    unsubscribeAll() {
      for (const unsub of this.eventUnsubscribes)
        unsub();
      this.eventUnsubscribes = [];
    }
  };

  // lib/Debouncer.ts
  var Debouncer = class extends NanoEmitter {
    /**
     * Creates a new debouncer with the specified timeout and edge type.
     * @param timeout Timeout in milliseconds between letting through calls - defaults to 200
     * @param type The edge type to use for the debouncer - see {@linkcode DebouncerType} for details or [the documentation for an explanation and diagram](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#debouncer) - defaults to "immediate"
     */
    constructor(timeout = 200, type = "immediate") {
      super();
      this.timeout = timeout;
      this.type = type;
      /** All registered listener functions and the time they were attached */
      __publicField(this, "listeners", []);
      /** The currently active timeout */
      __publicField(this, "activeTimeout");
      /** The latest queued call */
      __publicField(this, "queuedCall");
    }
    //#region listeners
    /** Adds a listener function that will be called on timeout */
    addListener(fn) {
      this.listeners.push(fn);
    }
    /** Removes the listener with the specified function reference */
    removeListener(fn) {
      const idx = this.listeners.findIndex((l) => l === fn);
      idx !== -1 && this.listeners.splice(idx, 1);
    }
    /** Removes all listeners */
    removeAllListeners() {
      this.listeners = [];
    }
    /** Returns all registered listeners */
    getListeners() {
      return this.listeners;
    }
    //#region timeout
    /** Sets the timeout for the debouncer */
    setTimeout(timeout) {
      this.emit("change", this.timeout = timeout, this.type);
    }
    /** Returns the current timeout */
    getTimeout() {
      return this.timeout;
    }
    /** Whether the timeout is currently active, meaning any latest call to the {@linkcode call()} method will be queued */
    isTimeoutActive() {
      return typeof this.activeTimeout !== "undefined";
    }
    //#region type
    /** Sets the edge type for the debouncer */
    setType(type) {
      this.emit("change", this.timeout, this.type = type);
    }
    /** Returns the current edge type */
    getType() {
      return this.type;
    }
    //#region call
    /** Use this to call the debouncer with the specified arguments that will be passed to all listener functions registered with {@linkcode addListener()} */
    call(...args) {
      const cl = (...a) => {
        this.queuedCall = undefined;
        this.emit("call", ...a);
        this.listeners.forEach((l) => l.call(this, ...a));
      };
      const setRepeatTimeout = () => {
        this.activeTimeout = setTimeout(() => {
          if (this.queuedCall) {
            this.queuedCall();
            setRepeatTimeout();
          } else
            this.activeTimeout = undefined;
        }, this.timeout);
      };
      switch (this.type) {
        case "immediate":
          if (typeof this.activeTimeout === "undefined") {
            cl(...args);
            setRepeatTimeout();
          } else
            this.queuedCall = () => cl(...args);
          break;
        case "idle":
          if (this.activeTimeout)
            clearTimeout(this.activeTimeout);
          this.activeTimeout = setTimeout(() => {
            cl(...args);
            this.activeTimeout = undefined;
          }, this.timeout);
          break;
        default:
          throw new TypeError(`Invalid debouncer type: ${this.type}`);
      }
    }
  };
  function debounce(fn, timeout = 200, type = "immediate") {
    const debouncer = new Debouncer(timeout, type);
    debouncer.addListener(fn);
    const func = (...args) => debouncer.call(...args);
    func.debouncer = debouncer;
    return func;
  }

  // lib/Dialog.ts
  var defaultDialogCss = `.uu-no-select {
  user-select: none;
}

.uu-dialog-bg {
  --uu-dialog-bg: #333333;
  --uu-dialog-bg-highlight: #252525;
  --uu-scroll-indicator-bg: rgba(10, 10, 10, 0.7);
  --uu-dialog-separator-color: #797979;
  --uu-dialog-border-radius: 10px;
}

.uu-dialog-bg {
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.6);
}

.uu-dialog {
  --uu-calc-dialog-height: calc(min(100vh - 40px, var(--uu-dialog-height-max)));
  position: absolute;
  display: flex;
  flex-direction: column;
  width: calc(min(100% - 60px, var(--uu-dialog-width-max)));
  border-radius: var(--uu-dialog-border-radius);
  height: auto;
  max-height: var(--uu-calc-dialog-height);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  color: #fff;
  background-color: var(--uu-dialog-bg);
}

.uu-dialog.align-top {
  top: 0;
  transform: translate(-50%, 40px);
}

.uu-dialog.align-bottom {
  top: 100%;
  transform: translate(-50%, -100%);
}

.uu-dialog-body {
  font-size: 1.5rem;
  padding: 20px;
}

.uu-dialog-body.small {
  padding: 15px;
}

#uu-dialog-opts {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 30px 0px;
  overflow-y: auto;
}

.uu-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  padding: 15px 20px 15px 20px;
  background-color: var(--uu-dialog-bg);
  border: 2px solid var(--uu-dialog-separator-color);
  border-style: none none solid none !important;
  border-radius: var(--uu-dialog-border-radius) var(--uu-dialog-border-radius) 0px 0px;
}

.uu-dialog-header.small {
  padding: 10px 15px;
  border-style: none none solid none !important;
}

.uu-dialog-header-pad {
  content: " ";
  min-height: 32px;
}

.uu-dialog-header-pad.small {
  min-height: 24px;
}

.uu-dialog-titlecont {
  display: flex;
  align-items: center;
}

.uu-dialog-titlecont-no-title {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.uu-dialog-title {
  position: relative;
  display: inline-block;
  font-size: 22px;
}

.uu-dialog-close {
  cursor: pointer;
}

.uu-dialog-header-img,
.uu-dialog-close
{
  width: 32px;
  height: 32px;
}

.uu-dialog-header-img.small,
.uu-dialog-close.small
{
  width: 24px;
  height: 24px;
}

.uu-dialog-footer {
  font-size: 17px;
  text-decoration: underline;
}

.uu-dialog-footer.hidden {
  display: none;
}

.uu-dialog-footer-cont {
  margin-top: 6px;
  padding: 15px 20px;
  background: var(--uu-dialog-bg);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, var(--uu-dialog-bg) 30%, var(--uu-dialog-bg) 100%);
  border: 2px solid var(--uu-dialog-separator-color);
  border-style: solid none none none !important;
  border-radius: 0px 0px var(--uu-dialog-border-radius) var(--uu-dialog-border-radius);
}

.uu-dialog-footer-buttons-cont button:not(:last-of-type) {
  margin-right: 15px;
}`;
  exports.currentDialogId = null;
  var openDialogs = [];
  var defaultStrings = {
    closeDialogTooltip: "Click to close the dialog"
  };
  var Dialog = class _Dialog extends NanoEmitter {
    constructor(options) {
      super();
      /** Options passed to the dialog in the constructor */
      __publicField(this, "options");
      /** ID that gets added to child element IDs - has to be unique and conform to HTML ID naming rules! */
      __publicField(this, "id");
      /** Strings used in the dialog (used for translations) */
      __publicField(this, "strings");
      __publicField(this, "dialogOpen", false);
      __publicField(this, "dialogMounted", false);
      const _a = options, { strings } = _a, opts = __objRest(_a, ["strings"]);
      this.strings = __spreadValues(__spreadValues({}, defaultStrings), strings != null ? strings : {});
      this.options = __spreadValues({
        closeOnBgClick: true,
        closeOnEscPress: true,
        destroyOnClose: false,
        unmountOnClose: true,
        removeListenersOnDestroy: true,
        small: false,
        verticalAlign: "center"
      }, opts);
      this.id = opts.id;
    }
    //#region public
    /** Call after DOMContentLoaded to pre-render the dialog and invisibly mount it in the DOM */
    mount() {
      return __async(this, null, function* () {
        var _a;
        if (this.dialogMounted)
          return;
        this.dialogMounted = true;
        if (!document.querySelector("style.uu-dialog-css"))
          addGlobalStyle((_a = this.options.dialogCss) != null ? _a : defaultDialogCss).classList.add("uu-dialog-css");
        const bgElem = document.createElement("div");
        bgElem.id = `uu-${this.id}-dialog-bg`;
        bgElem.classList.add("uu-dialog-bg");
        if (this.options.closeOnBgClick)
          bgElem.ariaLabel = bgElem.title = this.getString("closeDialogTooltip");
        bgElem.style.setProperty("--uu-dialog-width-max", `${this.options.width}px`);
        bgElem.style.setProperty("--uu-dialog-height-max", `${this.options.height}px`);
        bgElem.style.visibility = "hidden";
        bgElem.style.display = "none";
        bgElem.inert = true;
        bgElem.appendChild(yield this.getDialogContent());
        document.body.appendChild(bgElem);
        this.attachListeners(bgElem);
        this.events.emit("render");
        return bgElem;
      });
    }
    /** Closes the dialog and clears all its contents (unmounts elements from the DOM) in preparation for a new rendering call */
    unmount() {
      var _a;
      this.close();
      this.dialogMounted = false;
      const clearSelectors = [
        `#uu-${this.id}-dialog-bg`,
        `#uu-style-dialog-${this.id}`
      ];
      for (const sel of clearSelectors)
        (_a = document.querySelector(sel)) == null ? undefined : _a.remove();
      this.events.emit("clear");
    }
    /** Clears the DOM of the dialog and then renders it again */
    remount() {
      return __async(this, null, function* () {
        this.unmount();
        yield this.mount();
      });
    }
    /**
     * Opens the dialog - also mounts it if it hasn't been mounted yet  
     * Prevents default action and immediate propagation of the passed event
     */
    open(e) {
      return __async(this, null, function* () {
        var _a;
        e == null ? undefined : e.preventDefault();
        e == null ? undefined : e.stopImmediatePropagation();
        if (this.isOpen())
          return;
        this.dialogOpen = true;
        if (openDialogs.includes(this.id))
          throw new Error(`A dialog with the same ID of '${this.id}' already exists and is open!`);
        if (!this.isMounted())
          yield this.mount();
        const dialogBg = document.querySelector(`#uu-${this.id}-dialog-bg`);
        if (!dialogBg)
          return console.warn(`Couldn't find background element for dialog with ID '${this.id}'`);
        dialogBg.style.visibility = "visible";
        dialogBg.style.display = "block";
        dialogBg.inert = false;
        exports.currentDialogId = this.id;
        openDialogs.unshift(this.id);
        for (const dialogId of openDialogs)
          if (dialogId !== this.id)
            (_a = document.querySelector(`#uu-${dialogId}-dialog-bg`)) == null ? undefined : _a.setAttribute("inert", "true");
        document.body.classList.remove("uu-no-select");
        document.body.setAttribute("inert", "true");
        this.events.emit("open");
        return dialogBg;
      });
    }
    /** Closes the dialog - prevents default action and immediate propagation of the passed event */
    close(e) {
      var _a, _b;
      e == null ? undefined : e.preventDefault();
      e == null ? undefined : e.stopImmediatePropagation();
      if (!this.isOpen())
        return;
      this.dialogOpen = false;
      const dialogBg = document.querySelector(`#uu-${this.id}-dialog-bg`);
      if (!dialogBg)
        return console.warn(`Couldn't find background element for dialog with ID '${this.id}'`);
      dialogBg.style.visibility = "hidden";
      dialogBg.style.display = "none";
      dialogBg.inert = true;
      openDialogs.splice(openDialogs.indexOf(this.id), 1);
      exports.currentDialogId = (_a = openDialogs[0]) != null ? _a : null;
      if (exports.currentDialogId)
        (_b = document.querySelector(`#uu-${exports.currentDialogId}-dialog-bg`)) == null ? undefined : _b.removeAttribute("inert");
      if (openDialogs.length === 0) {
        document.body.classList.add("uu-no-select");
        document.body.removeAttribute("inert");
      }
      this.events.emit("close");
      if (this.options.destroyOnClose)
        this.destroy();
      else if (this.options.unmountOnClose)
        this.unmount();
    }
    /** Returns true if the dialog is currently open */
    isOpen() {
      return this.dialogOpen;
    }
    /** Returns true if the dialog is currently mounted */
    isMounted() {
      return this.dialogMounted;
    }
    /** Clears the DOM of the dialog and removes all event listeners */
    destroy() {
      this.unmount();
      this.events.emit("destroy");
      this.options.removeListenersOnDestroy && this.unsubscribeAll();
    }
    //#region static
    /** Returns the ID of the top-most dialog (the dialog that has been opened last) */
    static getCurrentDialogId() {
      return exports.currentDialogId;
    }
    /** Returns the IDs of all currently open dialogs, top-most first */
    static getOpenDialogs() {
      return openDialogs;
    }
    //#region protected
    getString(key) {
      var _a;
      return (_a = this.strings[key]) != null ? _a : defaultStrings[key];
    }
    /** Called once to attach all generic event listeners */
    attachListeners(bgElem) {
      if (this.options.closeOnBgClick) {
        bgElem.addEventListener("click", (e) => {
          var _a;
          if (this.isOpen() && ((_a = e.target) == null ? undefined : _a.id) === `uu-${this.id}-dialog-bg`)
            this.close(e);
        });
      }
      if (this.options.closeOnEscPress) {
        document.body.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && this.isOpen() && _Dialog.getCurrentDialogId() === this.id)
            this.close(e);
        });
      }
    }
    //#region protected
    /**
     * Adds generic, accessible interaction listeners to the passed element.  
     * All listeners have the default behavior prevented and stop propagation (for keyboard events only as long as the captured key is valid).
     * @param listenerOptions Provide a {@linkcode listenerOptions} object to configure the listeners
     */
    onInteraction(elem, listener, listenerOptions) {
      const _a = listenerOptions != null ? listenerOptions : {}, { preventDefault = true, stopPropagation = true } = _a, listenerOpts = __objRest(_a, ["preventDefault", "stopPropagation"]);
      const interactionKeys = ["Enter", " ", "Space"];
      const proxListener = (e) => {
        if (e instanceof KeyboardEvent) {
          if (interactionKeys.includes(e.key)) {
            preventDefault && e.preventDefault();
            stopPropagation && e.stopPropagation();
          } else return;
        } else if (e instanceof MouseEvent) {
          preventDefault && e.preventDefault();
          stopPropagation && e.stopPropagation();
        }
        (listenerOpts == null ? undefined : listenerOpts.once) && e.type === "keydown" && elem.removeEventListener("click", proxListener, listenerOpts);
        (listenerOpts == null ? undefined : listenerOpts.once) && e.type === "click" && elem.removeEventListener("keydown", proxListener, listenerOpts);
        listener(e);
      };
      elem.addEventListener("click", proxListener, listenerOpts);
      elem.addEventListener("keydown", proxListener, listenerOpts);
    }
    /** Returns the dialog content element and all its children */
    getDialogContent() {
      return __async(this, null, function* () {
        var _a, _b, _c, _d;
        const header = (_b = (_a = this.options).renderHeader) == null ? undefined : _b.call(_a);
        const footer = (_d = (_c = this.options).renderFooter) == null ? undefined : _d.call(_c);
        const dialogWrapperEl = document.createElement("div");
        dialogWrapperEl.id = `uu-${this.id}-dialog`;
        dialogWrapperEl.classList.add("uu-dialog");
        dialogWrapperEl.ariaLabel = dialogWrapperEl.title = "";
        dialogWrapperEl.role = "dialog";
        dialogWrapperEl.setAttribute("aria-labelledby", `uu-${this.id}-dialog-title`);
        dialogWrapperEl.setAttribute("aria-describedby", `uu-${this.id}-dialog-body`);
        if (this.options.verticalAlign !== "center")
          dialogWrapperEl.classList.add(`align-${this.options.verticalAlign}`);
        const headerWrapperEl = document.createElement("div");
        headerWrapperEl.classList.add("uu-dialog-header");
        this.options.small && headerWrapperEl.classList.add("small");
        if (header) {
          const headerTitleWrapperEl = document.createElement("div");
          headerTitleWrapperEl.id = `uu-${this.id}-dialog-title`;
          headerTitleWrapperEl.classList.add("uu-dialog-title-wrapper");
          headerTitleWrapperEl.role = "heading";
          headerTitleWrapperEl.ariaLevel = "1";
          headerTitleWrapperEl.appendChild(header instanceof Promise ? yield header : header);
          headerWrapperEl.appendChild(headerTitleWrapperEl);
        } else {
          const padEl = document.createElement("div");
          padEl.classList.add("uu-dialog-header-pad", this.options.small ? "small" : "");
          headerWrapperEl.appendChild(padEl);
        }
        if (this.options.renderCloseBtn) {
          const closeBtnEl = yield this.options.renderCloseBtn();
          closeBtnEl.classList.add("uu-dialog-close");
          this.options.small && closeBtnEl.classList.add("small");
          closeBtnEl.tabIndex = 0;
          if (closeBtnEl.hasAttribute("alt"))
            closeBtnEl.setAttribute("alt", this.getString("closeDialogTooltip"));
          closeBtnEl.title = closeBtnEl.ariaLabel = this.getString("closeDialogTooltip");
          this.onInteraction(closeBtnEl, () => this.close());
          headerWrapperEl.appendChild(closeBtnEl);
        }
        dialogWrapperEl.appendChild(headerWrapperEl);
        const dialogBodyElem = document.createElement("div");
        dialogBodyElem.id = `uu-${this.id}-dialog-body`;
        dialogBodyElem.classList.add("uu-dialog-body");
        this.options.small && dialogBodyElem.classList.add("small");
        const body = this.options.renderBody();
        dialogBodyElem.appendChild(body instanceof Promise ? yield body : body);
        dialogWrapperEl.appendChild(dialogBodyElem);
        if (footer) {
          const footerWrapper = document.createElement("div");
          footerWrapper.classList.add("uu-dialog-footer-cont");
          dialogWrapperEl.appendChild(footerWrapper);
          footerWrapper.appendChild(footer instanceof Promise ? yield footer : footer);
        }
        return dialogWrapperEl;
      });
    }
  };

  // lib/misc.ts
  function autoPlural(term, num, pluralType = "auto") {
    let n = num;
    if (typeof n !== "number")
      n = getListLength(n, false);
    if (!["-s", "-ies"].includes(pluralType))
      pluralType = "auto";
    if (isNaN(n))
      n = 2;
    const pType = pluralType === "auto" ? String(term).endsWith("y") ? "-ies" : "-s" : pluralType;
    switch (pType) {
      case "-s":
        return `${term}${n === 1 ? "" : "s"}`;
      case "-ies":
        return `${String(term).slice(0, -1)}${n === 1 ? "y" : "ies"}`;
    }
  }
  function insertValues(input, ...values) {
    return input.replace(/%\d/gm, (match) => {
      var _a, _b;
      const argIndex = Number(match.substring(1)) - 1;
      return (_b = (_a = values[argIndex]) != null ? _a : match) == null ? undefined : _b.toString();
    });
  }
  function pauseFor(time, signal, rejectOnAbort = false) {
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => res(), time);
      signal == null ? undefined : signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        rejectOnAbort ? rej(new Error("The pause was aborted")) : res();
      });
    });
  }
  function fetchAdvanced(_0) {
    return __async(this, arguments, function* (input, options = {}) {
      const { timeout = 1e4 } = options;
      const ctl = new AbortController();
      const _a = options, { signal } = _a, restOpts = __objRest(_a, ["signal"]);
      signal == null ? undefined : signal.addEventListener("abort", () => ctl.abort());
      let sigOpts = {}, id = undefined;
      if (timeout >= 0) {
        id = setTimeout(() => ctl.abort(), timeout);
        sigOpts = { signal: ctl.signal };
      }
      try {
        const res = yield fetch(input, __spreadValues(__spreadValues({}, restOpts), sigOpts));
        typeof id !== "undefined" && clearTimeout(id);
        return res;
      } catch (err) {
        typeof id !== "undefined" && clearTimeout(id);
        throw new Error("Error while calling fetch", { cause: err });
      }
    });
  }
  function consumeGen(valGen) {
    return __async(this, null, function* () {
      return yield typeof valGen === "function" ? valGen() : valGen;
    });
  }
  function consumeStringGen(strGen) {
    return __async(this, null, function* () {
      return typeof strGen === "string" ? strGen : String(
        typeof strGen === "function" ? yield strGen() : strGen
      );
    });
  }
  function getListLength(obj, zeroOnInvalid = true) {
    return "length" in obj ? obj.length : "size" in obj ? obj.size : "count" in obj ? obj.count : zeroOnInvalid ? 0 : NaN;
  }
  function purifyObj(obj) {
    return Object.assign(/* @__PURE__ */ Object.create(null), obj);
  }

  // lib/Mixins.ts
  var Mixins = class {
    /**
     * Creates a new Mixins instance.
     * @param config Configuration object to customize the behavior.
     */
    constructor(config = {}) {
      /** List of all registered mixins */
      __publicField(this, "mixins", []);
      /** Default configuration object for mixins */
      __publicField(this, "defaultMixinCfg");
      /** Whether the priorities should auto-increment if not specified */
      __publicField(this, "autoIncPrioEnabled");
      /** The current auto-increment priority counter */
      __publicField(this, "autoIncPrioCounter", /* @__PURE__ */ new Map());
      var _a, _b, _c;
      this.defaultMixinCfg = purifyObj({
        priority: (_a = config.defaultPriority) != null ? _a : 0,
        stopPropagation: (_b = config.defaultStopPropagation) != null ? _b : false,
        signal: config.defaultSignal
      });
      this.autoIncPrioEnabled = (_c = config.autoIncrementPriority) != null ? _c : false;
    }
    //#region public
    /**
     * Adds a mixin function to the given {@linkcode mixinKey}.  
     * If no priority is specified, it will be calculated via the protected method {@linkcode calcPriority()} based on the constructor configuration, or fall back to the default priority.
     * @param mixinKey The key to identify the mixin function.
     * @param mixinFn The function to be called to apply the mixin. The first argument is the input value, the second argument is the context object (if any).
     * @param config Configuration object to customize the mixin behavior, or just the priority if a number is passed.
     * @returns Returns a cleanup function, to be called when this mixin is no longer needed.
     */
    add(mixinKey, mixinFn, config = purifyObj({})) {
      const calcPrio = typeof config === "number" ? config : this.calcPriority(mixinKey, config);
      const mixin = purifyObj(__spreadValues(__spreadValues(__spreadProps(__spreadValues({}, this.defaultMixinCfg), {
        key: mixinKey,
        fn: mixinFn
      }), typeof config === "object" ? config : {}), typeof calcPrio === "number" && !isNaN(calcPrio) ? { priority: calcPrio } : {}));
      this.mixins.push(mixin);
      const rem = () => {
        this.mixins = this.mixins.filter((m) => m !== mixin);
      };
      if (mixin.signal)
        mixin.signal.addEventListener("abort", rem, { once: true });
      return rem;
    }
    /** Returns a list of all added mixins with their keys and configuration objects, but not their functions */
    list() {
      return this.mixins.map((_a) => {
        var _b = _a, rest = __objRest(_b, ["fn"]);
        return rest;
      });
    }
    /**
     * Applies all mixins with the given key to the input value, respecting the priority and stopPropagation settings.  
     * If additional context is set in the MixinMap, it will need to be passed as the third argument.  
     * @returns The modified value after all mixins have been applied.
     */
    resolve(mixinKey, inputValue, ...inputCtx) {
      const mixins = this.mixins.filter((m) => m.key === mixinKey);
      const sortedMixins = [...mixins].sort((a, b) => b.priority - a.priority);
      let result = inputValue;
      for (let i = 0; i < sortedMixins.length; i++) {
        const mixin = sortedMixins[i];
        result = mixin.fn(result, ...inputCtx);
        if (result instanceof Promise) {
          return (() => __async(this, null, function* () {
            result = yield result;
            if (mixin.stopPropagation)
              return result;
            for (let j = i + 1; j < sortedMixins.length; j++) {
              const mixin2 = sortedMixins[j];
              result = yield mixin2.fn(result, ...inputCtx);
              if (mixin2.stopPropagation)
                break;
            }
            return result;
          }))();
        } else if (mixin.stopPropagation)
          break;
      }
      return result;
    }
    //#region protected
    /** Calculates the priority for a mixin based on the given configuration and the current auto-increment state of the instance */
    calcPriority(mixinKey, config) {
      var _a;
      if (config.priority !== undefined)
        return undefined;
      if (!this.autoIncPrioEnabled)
        return (_a = config.priority) != null ? _a : this.defaultMixinCfg.priority;
      if (!this.autoIncPrioCounter.has(mixinKey))
        this.autoIncPrioCounter.set(mixinKey, this.defaultMixinCfg.priority);
      let prio = this.autoIncPrioCounter.get(mixinKey);
      while (this.mixins.some((m) => m.key === mixinKey && m.priority === prio))
        prio++;
      this.autoIncPrioCounter.set(mixinKey, prio + 1);
      return prio;
    }
    /** Removes all mixins with the given key */
    removeAll(mixinKey) {
      this.mixins.filter((m) => m.key === mixinKey);
      this.mixins = this.mixins.filter((m) => m.key !== mixinKey);
    }
  };

  // lib/SelectorObserver.ts
  var SelectorObserver = class {
    constructor(baseElement, options = {}) {
      __publicField(this, "enabled", false);
      __publicField(this, "baseElement");
      __publicField(this, "observer");
      __publicField(this, "observerOptions");
      __publicField(this, "customOptions");
      __publicField(this, "listenerMap");
      this.baseElement = baseElement;
      this.listenerMap = /* @__PURE__ */ new Map();
      const _a = options, {
        defaultDebounce,
        defaultDebounceType,
        disableOnNoListeners,
        enableOnAddListener
      } = _a, observerOptions = __objRest(_a, [
        "defaultDebounce",
        "defaultDebounceType",
        "disableOnNoListeners",
        "enableOnAddListener"
      ]);
      this.observerOptions = __spreadValues({
        childList: true,
        subtree: true
      }, observerOptions);
      this.customOptions = {
        defaultDebounce: defaultDebounce != null ? defaultDebounce : 0,
        defaultDebounceType: defaultDebounceType != null ? defaultDebounceType : "immediate",
        disableOnNoListeners: disableOnNoListeners != null ? disableOnNoListeners : false,
        enableOnAddListener: enableOnAddListener != null ? enableOnAddListener : true
      };
      if (typeof this.customOptions.checkInterval !== "number") {
        this.observer = new MutationObserver(() => this.checkAllSelectors());
      } else {
        this.checkAllSelectors();
        setInterval(() => this.checkAllSelectors(), this.customOptions.checkInterval);
      }
    }
    /** Call to check all selectors in the {@linkcode listenerMap} using {@linkcode checkSelector()} */
    checkAllSelectors() {
      if (!this.enabled || !isDomLoaded())
        return;
      for (const [selector, listeners] of this.listenerMap.entries())
        this.checkSelector(selector, listeners);
    }
    /** Checks if the element(s) with the given {@linkcode selector} exist in the DOM and calls the respective {@linkcode listeners} accordingly */
    checkSelector(selector, listeners) {
      var _a;
      if (!this.enabled)
        return;
      const baseElement = typeof this.baseElement === "string" ? document.querySelector(this.baseElement) : this.baseElement;
      if (!baseElement)
        return;
      const all = listeners.some((listener) => listener.all);
      const one = listeners.some((listener) => !listener.all);
      const allElements = all ? baseElement.querySelectorAll(selector) : null;
      const oneElement = one ? baseElement.querySelector(selector) : null;
      for (const options of listeners) {
        if (options.all) {
          if (allElements && allElements.length > 0) {
            options.listener(allElements);
            if (!options.continuous)
              this.removeListener(selector, options);
          }
        } else {
          if (oneElement) {
            options.listener(oneElement);
            if (!options.continuous)
              this.removeListener(selector, options);
          }
        }
        if (((_a = this.listenerMap.get(selector)) == null ? undefined : _a.length) === 0)
          this.listenerMap.delete(selector);
        if (this.listenerMap.size === 0 && this.customOptions.disableOnNoListeners)
          this.disable();
      }
    }
    /**
     * Starts observing the children of the base element for changes to the given {@linkcode selector} according to the set {@linkcode options}
     * @param selector The selector to observe
     * @param options Options for the selector observation
     * @param options.listener Gets called whenever the selector was found in the DOM
     * @param [options.all] Whether to use `querySelectorAll()` instead - default is false
     * @param [options.continuous] Whether to call the listener continuously instead of just once - default is false
     * @param [options.debounce] Whether to debounce the listener to reduce calls to `querySelector` or `querySelectorAll` - set undefined or <=0 to disable (default)
     * @returns Returns a function that can be called to remove this listener more easily
     */
    addListener(selector, options) {
      options = __spreadValues({
        all: false,
        continuous: false,
        debounce: 0
      }, options);
      if (options.debounce && options.debounce > 0 || this.customOptions.defaultDebounce && this.customOptions.defaultDebounce > 0) {
        options.listener = debounce(
          options.listener,
          options.debounce || this.customOptions.defaultDebounce,
          options.debounceType || this.customOptions.defaultDebounceType
        );
      }
      if (this.listenerMap.has(selector))
        this.listenerMap.get(selector).push(options);
      else
        this.listenerMap.set(selector, [options]);
      if (this.enabled === false && this.customOptions.enableOnAddListener)
        this.enable();
      this.checkSelector(selector, [options]);
      return () => this.removeListener(selector, options);
    }
    /** Disables the observation of the child elements */
    disable() {
      var _a;
      if (!this.enabled)
        return;
      this.enabled = false;
      (_a = this.observer) == null ? undefined : _a.disconnect();
    }
    /**
     * Enables or reenables the observation of the child elements.
     * @param immediatelyCheckSelectors Whether to immediately check if all previously registered selectors exist (default is true)
     * @returns Returns true when the observation was enabled, false otherwise (e.g. when the base element wasn't found)
     */
    enable(immediatelyCheckSelectors = true) {
      var _a;
      const baseElement = typeof this.baseElement === "string" ? document.querySelector(this.baseElement) : this.baseElement;
      if (this.enabled || !baseElement)
        return false;
      this.enabled = true;
      (_a = this.observer) == null ? undefined : _a.observe(baseElement, this.observerOptions);
      if (immediatelyCheckSelectors)
        this.checkAllSelectors();
      return true;
    }
    /** Returns whether the observation of the child elements is currently enabled */
    isEnabled() {
      return this.enabled;
    }
    /** Removes all listeners that have been registered with {@linkcode addListener()} */
    clearListeners() {
      this.listenerMap.clear();
    }
    /**
     * Removes all listeners for the given {@linkcode selector} that have been registered with {@linkcode addListener()}
     * @returns Returns true when all listeners for the associated selector were found and removed, false otherwise
     */
    removeAllListeners(selector) {
      return this.listenerMap.delete(selector);
    }
    /**
     * Removes a single listener for the given {@linkcode selector} and {@linkcode options} that has been registered with {@linkcode addListener()}
     * @returns Returns true when the listener was found and removed, false otherwise
     */
    removeListener(selector, options) {
      const listeners = this.listenerMap.get(selector);
      if (!listeners)
        return false;
      const index = listeners.indexOf(options);
      if (index > -1) {
        listeners.splice(index, 1);
        return true;
      }
      return false;
    }
    /** Returns all listeners that have been registered with {@linkcode addListener()} */
    getAllListeners() {
      return this.listenerMap;
    }
    /** Returns all listeners for the given {@linkcode selector} that have been registered with {@linkcode addListener()} */
    getListeners(selector) {
      return this.listenerMap.get(selector);
    }
  };

  // lib/translation.ts
  var trans = {};
  var valTransforms = [];
  var fallbackLang;
  function translate(language, key, ...trArgs) {
    if (typeof language !== "string")
      language = fallbackLang != null ? fallbackLang : "";
    const trObj = trans[language];
    if (typeof language !== "string" || language.length === 0 || typeof trObj !== "object" || trObj === null)
      return fallbackLang && language !== fallbackLang ? translate(fallbackLang, key, ...trArgs) : key;
    const transformTrVal = (trKey, trValue) => {
      const tfs = valTransforms.filter(({ regex }) => new RegExp(regex).test(String(trValue)));
      if (tfs.length === 0)
        return String(trValue);
      let retStr = String(trValue);
      for (const tf of tfs) {
        const re = new RegExp(tf.regex);
        const matches = [];
        let execRes;
        while ((execRes = re.exec(trValue)) !== null) {
          if (matches.some((m) => m[0] === (execRes == null ? undefined : execRes[0]) && m.index === (execRes == null ? undefined : execRes.index)))
            break;
          matches.push(execRes);
        }
        retStr = String(tf.fn({
          language,
          trValue,
          currentValue: retStr,
          matches,
          trKey,
          trArgs
        }));
      }
      return retStr;
    };
    const keyParts = key.split(".");
    let value = trObj;
    for (const part of keyParts) {
      if (typeof value !== "object" || value === null) {
        value = undefined;
        break;
      }
      value = value == null ? undefined : value[part];
    }
    if (typeof value === "string")
      return transformTrVal(key, value);
    value = trObj == null ? undefined : trObj[key];
    if (typeof value === "string")
      return transformTrVal(key, value);
    return fallbackLang && language !== fallbackLang ? translate(fallbackLang, key, ...trArgs) : key;
  }
  function trFor(language, key, ...args) {
    const txt = translate(language, key, ...args);
    if (txt === key)
      return fallbackLang ? translate(fallbackLang, key, ...args) : key;
    return txt;
  }
  function useTr(language) {
    return (key, ...args) => translate(language, key, ...args);
  }
  function hasKey(language = fallbackLang != null ? fallbackLang : "", key) {
    return tr.for(language, key) !== key;
  }
  function addTranslations(language, translations) {
    trans[language] = JSON.parse(JSON.stringify(translations));
  }
  function getTranslations(language = fallbackLang != null ? fallbackLang : "") {
    return trans[language];
  }
  var deleteTranslations = (language) => {
    if (language in trans) {
      delete trans[language];
      return true;
    }
    return false;
  };
  function setFallbackLanguage(fallbackLanguage) {
    fallbackLang = fallbackLanguage;
  }
  function getFallbackLanguage() {
    return fallbackLang;
  }
  function addTransform(transform) {
    const [regex, fn] = transform;
    valTransforms.push({
      fn,
      regex
    });
  }
  function deleteTransform(patternOrFn) {
    const idx = valTransforms.findIndex(
      (t) => typeof patternOrFn === "function" ? t.fn === patternOrFn : t.regex === patternOrFn
    );
    if (idx !== -1) {
      valTransforms.splice(idx, 1);
      return true;
    }
    return false;
  }
  var templateLiteralTransform = [
    /\$\{([a-zA-Z0-9$_-]+)\}/gm,
    ({ matches, trArgs, trValue }) => {
      const patternStart = "${", patternEnd = "}", patternRegex = /\$\{.+\}/m;
      let str = String(trValue);
      const eachKeyInTrString = (keys) => keys.every((key) => trValue.includes(`${patternStart}${key}${patternEnd}`));
      const namedMapping = () => {
        var _a;
        if (!str.includes(patternStart) || typeof trArgs[0] === "undefined" || typeof trArgs[0] !== "object" || !eachKeyInTrString(Object.keys((_a = trArgs[0]) != null ? _a : {})))
          return;
        for (const match of matches) {
          const repl = match[1] !== undefined ? trArgs[0][match[1]] : undefined;
          if (typeof repl !== "undefined")
            str = str.replace(match[0], String(repl));
        }
      };
      const positionalMapping = () => {
        if (!patternRegex.test(str) || !trArgs[0])
          return;
        let matchNum = -1;
        for (const match of matches) {
          matchNum++;
          if (typeof trArgs[matchNum] !== "undefined")
            str = str.replace(match[0], String(trArgs[matchNum]));
        }
      };
      let notStringifiable = false;
      try {
        String(trArgs[0]);
      } catch (e) {
        notStringifiable = true;
      }
      const isArgsObject = trArgs[0] && typeof trArgs[0] === "object" && trArgs[0] !== null && (notStringifiable || String(trArgs[0]).startsWith("[object"));
      if (isArgsObject && eachKeyInTrString(Object.keys(trArgs[0])))
        namedMapping();
      else
        positionalMapping();
      return str;
    }
  ];
  var percentTransform = [
    /%(\d+)/gm,
    ({ matches, trArgs, trValue }) => {
      let str = String(trValue);
      for (const match of matches) {
        const repl = match[1] !== undefined ? trArgs == null ? undefined : trArgs[Number(match[1]) - 1] : undefined;
        if (typeof repl !== "undefined")
          str = str.replace(match[0], String(repl));
      }
      return str;
    }
  ];
  var tr = {
    for: (...params) => trFor(...params),
    use: (...params) => useTr(...params),
    hasKey: (language = fallbackLang != null ? fallbackLang : "", key) => hasKey(language, key),
    addTranslations,
    getTranslations,
    deleteTranslations,
    setFallbackLanguage,
    getFallbackLanguage,
    addTransform,
    deleteTransform,
    transforms: {
      templateLiteral: templateLiteralTransform,
      percent: percentTransform
    }
  };

  exports.ChecksumMismatchError = ChecksumMismatchError;
  exports.DataStore = DataStore;
  exports.DataStoreSerializer = DataStoreSerializer;
  exports.Debouncer = Debouncer;
  exports.Dialog = Dialog;
  exports.MigrationError = MigrationError;
  exports.Mixins = Mixins;
  exports.NanoEmitter = NanoEmitter;
  exports.PlatformError = PlatformError;
  exports.SelectorObserver = SelectorObserver;
  exports.UUError = UUError;
  exports.addGlobalStyle = addGlobalStyle;
  exports.addParent = addParent;
  exports.autoPlural = autoPlural;
  exports.bitSetHas = bitSetHas;
  exports.clamp = clamp;
  exports.compress = compress;
  exports.computeHash = computeHash;
  exports.consumeGen = consumeGen;
  exports.consumeStringGen = consumeStringGen;
  exports.darkenColor = darkenColor;
  exports.debounce = debounce;
  exports.decompress = decompress;
  exports.defaultDialogCss = defaultDialogCss;
  exports.defaultStrings = defaultStrings;
  exports.digitCount = digitCount;
  exports.fetchAdvanced = fetchAdvanced;
  exports.getListLength = getListLength;
  exports.getSiblingsFrame = getSiblingsFrame;
  exports.getUnsafeWindow = getUnsafeWindow;
  exports.hexToRgb = hexToRgb;
  exports.insertValues = insertValues;
  exports.interceptEvent = interceptEvent;
  exports.interceptWindowEvent = interceptWindowEvent;
  exports.isDomLoaded = isDomLoaded;
  exports.isScrollable = isScrollable;
  exports.lightenColor = lightenColor;
  exports.mapRange = mapRange;
  exports.observeElementProp = observeElementProp;
  exports.onDomLoad = onDomLoad;
  exports.openDialogs = openDialogs;
  exports.openInNewTab = openInNewTab;
  exports.pauseFor = pauseFor;
  exports.preloadImages = preloadImages;
  exports.probeElementStyle = probeElementStyle;
  exports.purifyObj = purifyObj;
  exports.randRange = randRange;
  exports.randomId = randomId;
  exports.randomItem = randomItem;
  exports.randomItemIndex = randomItemIndex;
  exports.randomizeArray = randomizeArray;
  exports.rgbToHex = rgbToHex;
  exports.roundFixed = roundFixed;
  exports.setInnerHtmlUnsafe = setInnerHtmlUnsafe;
  exports.takeRandomItem = takeRandomItem;
  exports.tr = tr;

  return exports;

})({});

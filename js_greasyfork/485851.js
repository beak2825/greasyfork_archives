// ==UserScript==
// @name         e-hentai images overload
// @namespace    owowed.moe
// @version      1.4.5
// @author       owowed <island@owowed.moe>
// @description  preload and cache next pages for faster loading time!
// @license      GPL-2.0-or-later
// @copyright    Licensed under GPL-2.0-or-later. View license at https://spdx.org/licenses/GPL-2.0-or-later.html
// @homepageURL  https://gitgud.io/owowed/e-hentai-images-overload
// @source       https://gitgud.io/owowed/e-hentai-images-overload
// @supportURL   https://gitgud.io/owowed/e-hentai-images-overload/-/issues
// @match        *://e-hentai.org/s/*
// @require      https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.1.15/dist/gm_fetch.js#sha256-Q0UpKw6Eod6c9OWELIjizD2ejwO+8/EaFxnb8IsSCN0=
// @require      https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js#sha256-aSPPIlJfSHQ5T7wunbPcp7tM0rlq5dHoUGeN8O5odMg=
// @require      https://cdn.jsdelivr.net/npm/scheduler-polyfill@1.3.0/dist/scheduler-polyfill.js#sha256-+XYU52DQs86+Q2ZhzBEZ3exNykj4fm8GIE9SHiATIGY=
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_deleteValues
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/485851/e-hentai%20images%20overload.user.js
// @updateURL https://update.greasyfork.org/scripts/485851/e-hentai%20images%20overload.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(' :root{--ehp-popover-bg: aquamarine}.ehp-styling .mini-button{all:unset;background-color:#fff;border:1px solid black;padding:4px;margin:2px;font-size:small;cursor:pointer;-webkit-user-select:none;user-select:none}.ehp-styling .mini-button:hover{background-color:#fffbbb}.ehp-styling .link-button{all:unset;display:block;cursor:pointer;-webkit-user-select:none;user-select:none}.ehp-styling .link-button:hover{color:#8f4701}.ehp-styling .link-button:before{content:"[ "}.ehp-styling .link-button:after{content:" ]"}.ehp-styling h1,.ehp-styling .h1{font-size:14pt;margin:0}.ehp-styling h2{font-size:12pt;margin:0}.ehp-styling input{width:5em;text-align:center}.ehp-styling .note{font-style:italic}.ehp-popover{background:#7fffd4;border:1px solid #5C0D12;z-index:69420;font-size:9pt;text-wrap:auto!important;padding:12px 6px;margin:0;resize:both}.ehp-popover:not(:popover-open,.open){display:none}#i3 #img[data-auto-fit]{height:var(--final-height)!important;width:var(--final-width)!important}#i3 #img[data-margin-left-center=true]{margin-left:var(--margin-left-center)!important}#ehp-status-bar{display:grid;grid-template-columns:auto auto;width:100%;position:absolute;font-size:small;margin-bottom:5px}#ehp-status-bar>*{margin:0 6px}#ehp-status-bar>.activator-list{display:flex;gap:5px}#ehp-settings-activator,#ehp-gallery-explorer-activator{justify-self:left}#ehp-status-indicator{justify-self:right}#ehp-status-indicator[data-status=fetching]{color:#2f4f4f}#ehp-status-indicator[data-status=fetched]{color:#daa520}#ehp-status-indicator[data-status=fetched-fast]{color:violet}#ehp-settings-page{position:absolute;margin:4px}:where(#ehp-settings-page){display:flex;flex-flow:column;gap:8px;width:550px;min-width:200px}#ehp-settings-page .ehp-settings-entry .description:not(.active){display:none}#ehp-settings-page .detail-button{display:inline}#ehp-settings-page .popup-title{font-weight:700;font-style:italic}#ehp-settings-page .credits{display:flex;justify-content:center;align-items:center}#ehp-settings-page .credits:before,#ehp-settings-page .credits:after{content:"~";margin:0 4px}#ehp-settings-page .credits :first-child{margin-right:2px}#ehp-settings-page .version{position:absolute;right:16px;bottom:1px}#ehp-gallery-explorer{margin:auto;overflow-y:scroll!important;width:96lvw;height:96lvh;min-width:400px;max-height:100lvh;max-width:100lvw}:where(#ehp-gallery-explorer){display:grid;grid-auto-rows:max-content}#ehp-gallery-explorer:after{content:"";height:10em}#ehp-gallery-explorer .package-file-status:not(.display){display:none}#ehp-gallery-explorer .toolbar{position:sticky;top:1px;z-index:100;justify-self:center;display:flex;flex-direction:row;align-items:center;gap:5px;background-color:var(--ehp-popover-bg);font-size:medium;padding:10px}#ehp-gallery-explorer .exit-button-container{position:absolute;top:10px;right:10px;z-index:100;font-size:12pt;height:var(--ehp-gallery-explorer-height)}#ehp-gallery-explorer .exit-button-container .exit-button{position:sticky;top:1px;background-color:var(--ehp-popover-bg);padding:10px}#ehp-gallery-explorer .gallery-panel{-webkit-backdrop-filter:contrast(85%);backdrop-filter:contrast(85%)}#ehp-gallery-explorer .gallery-panel:not(:last-child){margin-bottom:5px}#ehp-gallery-explorer .gallery-panel .panel-title{display:flex;flex-direction:row;gap:5px;align-items:center}#ehp-gallery-explorer .gallery-panel .page-list{display:grid;gap:5px;grid-template-columns:repeat(auto-fit,minmax(var(--gallery-page-list-min-column-size, 400px),1fr));justify-content:center}#ehp-gallery-explorer .gallery-panel .page-list:not(.open){display:none}#ehp-gallery-explorer .gallery-page,#ehp-gallery-explorer .gallery-page img{width:100%}#ehp-gallery-explorer .gallery-page .page-title{overflow:hidden;text-overflow:ellipsis;background-color:#ffb6c166}#ehp-gallery-explorer .gallery-page .page-image{position:relative}#ehp-gallery-explorer .gallery-page .unblur-button{display:none;margin:0;position:absolute;left:50%;top:50%;transform:translate(-50%) translateY(-50%)}#ehp-gallery-explorer .gallery-page:not(.unblur):not(:first-child) .page-image>img{filter:blur(20px);clip-path:inset(0)}#ehp-gallery-explorer .gallery-page:not(.unblur):not(:first-child) .unblur-button{display:block}#owo-icon-pfp{display:inline-block;width:20px;height:20px;background:url(https://files.catbox.moe/gg9tzd.jpg);background-size:contain} ');

(async function (schedulerPolyfill, GM_fetch, React, JSZip) {
  'use strict';

  var _a, _b;
  {
    await( eval(`
        (async () => {
            React = await import("https://cdn.jsdelivr.net/npm/jsx-dom@8.1.5/index.min.js");
        })();
    `));
  }
  const storeOmitLastArgument = Symbol();
  function store(key, newValue = storeOmitLastArgument) {
    if (newValue == storeOmitLastArgument) {
      return GM_getValue(key);
    } else {
      GM_setValue(key, newValue);
    }
  }
  function storeList() {
    return GM_listValues();
  }
  function storeDelete(...keys) {
    if (keys.length == 1) GM_deleteValue(keys[0]);
    else {
      if (typeof GM_deleteValues == "undefined") {
        for (const k of keys) GM_deleteValue(k);
      } else {
        GM_deleteValues(keys);
      }
    }
  }
  function storeOnChange(key, callback) {
    GM_addValueChangeListener(key, callback);
  }
  store("script-store-version", 1);
  const ONE_DAY_MILLISECONDS = 864e5;
  const ONE_SECOND_MILLISECONDS = 1e3;
  const settingsDefaults = {
    "debug-log": false,
    "debug-properties": false,
    "info-log": true,
    "timing-log": false,
    "image-caching-limit": 100,
    "concurrent-image-caching-limit": 10,
    "background-session-image-caching-limit": 3,
    "image-caching-cooldown": 3 * ONE_SECOND_MILLISECONDS,
    get "image-caching-cooldown-nth"() {
      return store("concurrent-image-caching-limit") ?? settingsDefaults["concurrent-image-caching-limit"];
    },
    "lazy-image-caching-minimum-cached": 5,
    "preload-cached-image": 10,
    "persistent-cache-timeout": 2 * ONE_DAY_MILLISECONDS,
    "persistent-cache-limit": 800,
    "persistent-cache-storage-type": ((_a = GM_info.platform) == null ? void 0 : _a.browserName.toLowerCase().includes("chrom")) || window.chrome || ((_b = window.navigator.userAgentData) == null ? void 0 : _b.brands.some((data) => data.brand == "Chromium")) ? "file" : "key-value",
    "persistent-cache-fetch-nth-save": 5,
    "persistent-cache-loading-nth-scheduler-yield": 40,
    "ui-gallery-explorer-image-zoom": 400,
    "ui-gallery-explorer-unblur-all": false,
    "image-auto-fit": true
  };
  const settingsOmitLastArgument = Symbol();
  function settings(key, newValue = settingsOmitLastArgument) {
    if (newValue == settingsOmitLastArgument) {
      return GM_getValue(key, settingsDefaults[key]);
    } else {
      GM_setValue(key, newValue);
    }
  }
  function createSettingsLogSetter(key) {
    const settingsKey = key.split("owo-")[1];
    return (newValue) => {
      settings(settingsKey, newValue);
    };
  }
  unsafeWindow["owo-debug-log"] = createSettingsLogSetter("owo-debug-log");
  unsafeWindow["owo-info-log"] = createSettingsLogSetter("owo-info-log");
  unsafeWindow["owo-timing-log"] = createSettingsLogSetter("owo-timing-log");
  function getGalleryPageId(galleryPage) {
    return `p${galleryPage.index}_g${galleryPage.galleryId}_x${galleryPage.pageId}`;
  }
  function parseGalleryPageInfo(galleryPageId) {
    const [index, galleryId, pageId] = galleryPageId.split("_").map((i) => i.slice(1));
    return {
      galleryId: parseInt(galleryId),
      pageId,
      index: parseInt(index)
    };
  }
  function getCurrentGalleryPageInfo() {
    var _a2, _b2;
    return {
      galleryId: unsafeWindow.gid,
      pageId: ((_a2 = unsafeWindow.history.state) == null ? void 0 : _a2.imgkey) ?? unsafeWindow.startkey,
      index: ((_b2 = unsafeWindow.history.state) == null ? void 0 : _b2.page) ?? unsafeWindow.startpage
    };
  }
  function domParse(str, type = "text/html") {
    const parser = new DOMParser();
    return parser.parseFromString(str, type);
  }
  function saveGalleryMetadata(collection) {
    if (collection.revision != void 0) {
      store(`m_${collection.galleryId}`, {
        revision: collection.revision
      });
    }
  }
  function loadGalleryMetadata(collection) {
    var _a2;
    if (collection.revision == void 0) {
      collection.revision = (_a2 = store(`m_${collection.galleryId}`)) == null ? void 0 : _a2.revision;
    }
  }
  const galleryCollectionShelf = /* @__PURE__ */ new Map();
  function getGalleryCollection(galleryId = getCurrentGalleryPageInfo().galleryId, collectionShelf = galleryCollectionShelf) {
    const galleryCollection = collectionShelf.get(galleryId);
    if (galleryCollection != void 0) {
      return galleryCollection;
    }
    const newGalleryCollection = {
      galleryId,
      sources: /* @__PURE__ */ new Map(),
      blobs: /* @__PURE__ */ new Map()
    };
    loadGalleryMetadata(newGalleryCollection);
    collectionShelf.set(galleryId, newGalleryCollection);
    return newGalleryCollection;
  }
  function getGalleryCollectionItem(index, galleryId, collectionShelf = galleryCollectionShelf) {
    const collection = getGalleryCollection(galleryId, collectionShelf);
    const source = collection.sources.get(index);
    if (source == void 0) return;
    return {
      source,
      blob: collection.blobs.get(index)
    };
  }
  function setGalleryCollectionItem(index, item, collectionShelf = galleryCollectionShelf) {
    const collection = getGalleryCollection(item.page.galleryId, collectionShelf);
    if (isGalleryPageImageBlob(item)) {
      collection.blobs.set(index, item);
      collection.sources.set(index, item.source);
    } else {
      collection.sources.set(index, item);
    }
  }
  function deleteGalleryCollectionItem(index, galleryId = getCurrentGalleryPageInfo().galleryId, collectionShelf = galleryCollectionShelf) {
    const collection = getGalleryCollection(galleryId, collectionShelf);
    collection.blobs.delete(index);
    collection.sources.delete(index);
  }
  const serviceApiUrl = unsafeWindow.api_url ?? "https://api.e-hentai.org/api.php";
  const serviceShowKey = unsafeWindow.showkey;
  const galleryApiDataShelf = /* @__PURE__ */ new Map();
  function getGalleryPageApiData(apiDataRaw) {
    return {
      navigator: apiDataRaw.n,
      galleryReturn: apiDataRaw.i5,
      footer: apiDataRaw.i6,
      pageStage: apiDataRaw.i3,
      pageId: apiDataRaw.k,
      pageIndex: apiDataRaw.p,
      pagePath: apiDataRaw.s
    };
  }
  async function fetchGalleryPageApiData({ galleryId, pageId, index }) {
    const apiDataRaw = await fetch(serviceApiUrl, {
      method: "POST",
      body: JSON.stringify({
        gid: galleryId,
        imgkey: pageId,
        method: "showpage",
        page: index,
        showkey: serviceShowKey
      })
    }).then((r) => r.json());
    const apiData = getGalleryPageApiData(apiDataRaw);
    galleryApiDataShelf.set(getGalleryPageId({ galleryId, pageId, index }), apiData);
    const galleryReturnFragment = domParse(apiData.galleryReturn);
    const galleryReturnPathname = galleryReturnFragment.querySelector("a[href*='/g/']").pathname;
    const [_, _g, _galleryIdStr, revision] = galleryReturnPathname.split("/");
    getGalleryCollection(galleryId).revision = revision;
    return apiData;
  }
  async function resolveGalleryPageApiData(pageInfo) {
    const galleryPageApiDataShelved = galleryApiDataShelf.get(getGalleryPageId(pageInfo));
    if (galleryPageApiDataShelved) {
      return galleryPageApiDataShelved;
    }
    return fetchGalleryPageApiData(pageInfo);
  }
  async function serializeBlobDataUrl(blob) {
    const { promise, resolve, reject } = Promise.withResolvers();
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
    return `blob-data-url:${await promise}`;
  }
  async function deserializeBlobDataUrl(serializedBlob) {
    const [_, url] = serializedBlob.split("blob-data-url:");
    const [mimeString, base64Data] = url.split("data:")[1].split(";base64,");
    const uint8array = Uint8Array.from(atob(base64Data), (char) => char.charCodeAt(0));
    const blob = new Blob([uint8array], { type: mimeString || void 0 });
    return blob;
  }
  const directoryRoot = "e-hentai images preload";
  async function getUserscriptDirectoryAvailability() {
    return getUserscriptDirectory().then(async (d) => {
      const testFileName = `test-write-${Math.random()}.blob`;
      await d.getFileHandle(testFileName, { create: true });
      await d.removeEntry(testFileName);
      return "available";
    }).catch(() => "unavailable-by-error");
  }
  async function getUserscriptDirectory() {
    return navigator.storage.getDirectory().then((dir) => dir.getDirectoryHandle(directoryRoot, { create: true }));
  }
  const debugLogStyle = `
    background: gold;
    padding: 2px;
    border-radius: 5px;
    color: black;
    font-weight: bold;
`;
  const infoLogStyle = `
    background: #ff7de9;
    padding: 2px;
    border-radius: 5px;
    color: black;
    font-weight: bold;
`;
  function createDebugLog(fn) {
    if (settings("debug-log")) {
      return Function.prototype.bind.call(
        fn,
        console,
        "%cehp%c",
        debugLogStyle,
        "all: initial;"
      );
    } else {
      return () => {
      };
    }
  }
  function createInfoLog(fn) {
    if (settings("info-log")) {
      return Function.prototype.bind.call(
        fn,
        console,
        "%cehp%c",
        infoLogStyle,
        "all: initial;"
      );
    } else {
      return () => {
      };
    }
  }
  function createTimeLog(fn) {
    if (settings("timing-log")) {
      return Function.prototype.bind.call(
        fn,
        console,
        "[ehp-timing]"
      );
    } else {
      return () => {
      };
    }
  }
  const log = createDebugLog(console.log);
  const info = createInfoLog(console.info);
  createDebugLog(console.debug);
  const warn = createDebugLog(console.warn);
  createDebugLog(console.group);
  createDebugLog(console.groupCollapsed);
  createDebugLog(console.groupEnd);
  createTimeLog(console.time);
  createTimeLog(console.timeLog);
  createTimeLog(console.timeEnd);
  async function serializeBlobFileRef(blob) {
    const availability = await getUserscriptDirectoryAvailability();
    if (availability != "available") {
      if (availability == "unavailable-by-error") {
        warn("Unable serialize blob to because origin private filesystem (OPFS) is inaccessible by the browser.");
      }
      return serializeBlobDataUrl(blob);
    }
    const directory = await getUserscriptDirectory();
    const refId = crypto.randomUUID();
    const writer = await directory.getFileHandle(refId, { create: true }).then((file) => file.createWritable()).then((w) => w.getWriter());
    await writer.ready;
    await writer.write(blob);
    await writer.ready;
    await writer.close();
    return `blob-file-ref:${refId}`;
  }
  async function deserializeBlobFileRef(serializedBlob) {
    const availability = await getUserscriptDirectoryAvailability();
    if (availability != "available") {
      if (availability == "unavailable-by-error") {
        warn("Unable deserialize blob to because origin private filesystem (OPFS) is inaccessible by the browser.");
      }
      return void 0;
    }
    const [_, refId] = serializedBlob.split("blob-file-ref:");
    const directory = await getUserscriptDirectory();
    return directory.getFileHandle(refId).then((file) => file.getFile()).catch(() => void 0);
  }
  function serializeBlob(blob) {
    if (settings("persistent-cache-storage-type") == "key-value") {
      return serializeBlobDataUrl(blob);
    } else if (settings("persistent-cache-storage-type") == "file") {
      return serializeBlobFileRef(blob);
    }
    return serializeBlobDataUrl(blob);
  }
  function deserializeBlob(serializeBlob2) {
    if (serializeBlob2.startsWith("blob-data-url")) {
      return deserializeBlobDataUrl(serializeBlob2);
    } else if (serializeBlob2.startsWith("blob-file-ref")) {
      return deserializeBlobFileRef(serializeBlob2);
    }
  }
  var e = class extends EventTarget {
    dispatchTypedEvent(s, t) {
      return super.dispatchEvent(t);
    }
  };
  const galleryCollectionStoreEvent = new e();
  async function saveGalleryCollectionShelf(shelf) {
    if (settings("persistent-cache-limit") == -1) return;
    const collectionItems = shelf.values().map((collection) => {
      saveGalleryMetadata(collection);
      return collection.sources.entries().map(([index, source]) => ({
        source,
        blob: collection.blobs.get(index)
      })).toArray();
    });
    for (const items of collectionItems) {
      await saveGalleryCollectionItems(items);
    }
  }
  async function saveGalleryCollectionItems(galleryCollectionItems) {
    if (settings("persistent-cache-limit") == -1) return;
    let iteration = 0;
    for (const item of galleryCollectionItems) {
      await saveGalleryCollectionItem(item);
      iteration++;
      if (iteration % settings("persistent-cache-loading-nth-scheduler-yield") == 0) {
        await scheduler.yield();
      }
      galleryCollectionStoreEvent.dispatchTypedEvent("save", new Event("save"));
    }
  }
  const loadGalleryCollectionShelf = (shelf) => {
    return Array.fromAsync(loadGalleryCollectionsGenerator(shelf, [], false, true));
  };
  async function* loadGalleryCollectionsGenerator(shelf, galleryIds, fetchBlob = false, loadAnyGallery = false) {
    let iteration = 0;
    for (const key of storeList()) {
      if (key.startsWith("s_")) {
        const [_, ...galleryPageIdSplit] = key.split("_");
        const galleryPageId = galleryPageIdSplit.join("_");
        const galleryPageInfo = parseGalleryPageInfo(galleryPageId);
        if (!galleryIds.includes(galleryPageInfo.galleryId) && !loadAnyGallery) continue;
        const storedItem = getGalleryCollectionItem(galleryPageInfo.index, galleryPageInfo.galleryId, shelf);
        if (storedItem != void 0 && !(storedItem.blob == void 0 && fetchBlob)) {
          yield storedItem;
          continue;
        }
        yield loadGalleryCollectionItem(galleryPageInfo, shelf, fetchBlob);
        iteration++;
        if (iteration % settings("persistent-cache-loading-nth-scheduler-yield") == 0) {
          await scheduler.yield();
        }
      }
    }
  }
  const loadGalleryCollections = (shelf, galleryIds, loadBlobs = false) => {
    return Array.fromAsync(loadGalleryCollectionsGenerator(shelf, galleryIds, loadBlobs));
  };
  async function saveGalleryCollectionItem(item) {
    const { source, blob } = item;
    const galleryPageId = getGalleryPageId(source.page);
    store(`s_${galleryPageId}`, {
      nextPage: getGalleryPageId(source.nextPage),
      imagePageUrl: source.imagePageUrl,
      imageOriginalUrl: source.imageOriginalUrl,
      filename: blob == null ? void 0 : blob.filename,
      blob: blob && await serializeBlob(blob.blob)
    });
  }
  async function loadGalleryCollectionItem(pageInfo, shelf, loadBlobs = true) {
    const galleryPageId = getGalleryPageId(pageInfo);
    const galleryPageSave = store(`s_${galleryPageId}`);
    if (galleryPageSave == void 0) return void 0;
    getGalleryCollection(pageInfo.galleryId, shelf);
    const imageSource = {
      ...galleryPageSave,
      page: pageInfo,
      nextPage: parseGalleryPageInfo(galleryPageSave.nextPage)
    };
    setGalleryCollectionItem(pageInfo.index, imageSource, shelf);
    if (galleryPageSave.filename == void 0 || galleryPageSave.blob == void 0 || !loadBlobs) return { source: imageSource, blob: void 0 };
    const blob = await deserializeBlob(galleryPageSave.blob);
    if (blob == void 0) return { source: imageSource, blob: void 0 };
    const imageBlob = {
      filename: galleryPageSave.filename,
      source: imageSource,
      page: pageInfo,
      blob
    };
    setGalleryCollectionItem(pageInfo.index, imageBlob, shelf);
    return {
      source: imageSource,
      blob: imageBlob
    };
  }
  function getGalleryCollectionShelfSize() {
    return storeList().filter((key) => key.startsWith("s_")).length;
  }
  function limitGalleryCollectionShelf(maxSize, collectionShelf) {
    const size = getGalleryCollectionShelfSize();
    if (settings("persistent-cache-storage-type") == "key-value") {
      maxSize = 200;
    }
    if (size > maxSize) {
      return rotateDeleteGalleryCollectionShelf(size - maxSize, collectionShelf);
    }
  }
  async function rotateDeleteGalleryCollectionShelf(maxIteration, collectionShelf) {
    const pendingDeletion = [];
    let iteration = 0;
    for (const key of storeList()) {
      if (iteration == maxIteration) break;
      if (key.startsWith("s_")) {
        const [_, ...galleryPageIdSplit] = key.split("_");
        const galleryPageId = galleryPageIdSplit.join("_");
        const galleryPage = parseGalleryPageInfo(galleryPageId);
        if (galleryPage.galleryId == getCurrentGalleryPageInfo().galleryId) continue;
        deleteGalleryCollectionItem(galleryPage.index, galleryPage.galleryId, collectionShelf);
        pendingDeletion.push(key);
        iteration++;
      }
    }
    storeDelete(...pendingDeletion);
  }
  function clearGalleryCollectionShelf(collectionShelf, galleryId) {
    const pendingDeletion = storeList().filter((key) => key.startsWith("s_") && (galleryId ? key.includes(`g${galleryId}`) : true));
    storeDelete(...pendingDeletion);
    if (galleryId == void 0) {
      collectionShelf.clear();
      info("Delete all gallery collections!");
      galleryCollectionStoreEvent.dispatchTypedEvent("clear-all", new Event("clear-all"));
    } else {
      collectionShelf.delete(galleryId);
      info("Delete gallery collection with id:", galleryId);
    }
  }
  function initGalleryCollectionTimeout() {
    const galleryCollectionTimeoutStartStoreKey = "gallery-collection-timeout-start";
    if (store(galleryCollectionTimeoutStartStoreKey) == void 0) {
      store(galleryCollectionTimeoutStartStoreKey, Date.now());
    }
    if (settings("persistent-cache-timeout") == -1) {
      return;
    }
    if (Date.now() - (store(galleryCollectionTimeoutStartStoreKey) + settings("persistent-cache-timeout")) > 0) {
      info("Clearing gallery collection due to timeout.");
      clearGalleryCollectionShelf(galleryCollectionShelf);
      store(galleryCollectionTimeoutStartStoreKey, Date.now());
    }
    storeOnChange("persistent-cache-timeout", () => {
      store(galleryCollectionTimeoutStartStoreKey, Date.now());
    });
  }
  function initGalleryCollectionLimit() {
    storeOnChange("persistent-cache-limit", () => {
      limitGalleryCollectionShelf(settings("persistent-cache-limit"), galleryCollectionShelf);
    });
  }
  function parseGalleryPageImageSource(galleryPage, apiData) {
    var _a2;
    const navigatorFragment = domParse(apiData.navigator);
    const navigatorNext = navigatorFragment.querySelector("#next");
    const navigatorNextUrl = new URL(navigatorNext.href);
    const [_, _s, nextPageId, nextGalleryIdIdx] = navigatorNextUrl.pathname.split("/");
    const [nextGalleryIdStr, nextIndexStr] = nextGalleryIdIdx.split("-");
    const nextGalleryPage = {
      galleryId: parseInt(nextGalleryIdStr),
      pageId: nextPageId,
      index: parseInt(nextIndexStr)
    };
    const pageStageFragment = domParse(apiData.pageStage);
    const imagePageUrl = pageStageFragment.querySelector("img#img").src;
    const footerFragment = domParse(apiData.footer);
    const imageOriginalUrl = (_a2 = footerFragment.querySelector("a[href*='fullimg']")) == null ? void 0 : _a2.href;
    const galleryPageImageSource = {
      page: galleryPage,
      nextPage: nextGalleryPage,
      imagePageUrl,
      imageOriginalUrl
    };
    return galleryPageImageSource;
  }
  async function fetchGalleryPageImageSource(pageInfo) {
    const galleryPageImageSource = parseGalleryPageImageSource(pageInfo, await resolveGalleryPageApiData(pageInfo));
    setGalleryCollectionItem(pageInfo.index, galleryPageImageSource);
    return galleryPageImageSource;
  }
  async function resolveGalleryPageImageSource(galleryPage) {
    var _a2;
    const galleryPageImageSourceShelved = (_a2 = getGalleryCollectionItem(galleryPage.index, galleryPage.galleryId)) == null ? void 0 : _a2.source;
    if (galleryPageImageSourceShelved) {
      return galleryPageImageSourceShelved;
    }
    const item = await loadGalleryCollectionItem(galleryPage, galleryCollectionShelf, true);
    if (item) return item.source;
    return fetchGalleryPageImageSource(galleryPage);
  }
  async function fetchGalleryPageImageBlob(galleryPage) {
    const imageSource = await resolveGalleryPageImageSource(galleryPage);
    const blob = await GM_fetch(imageSource.imagePageUrl).then((r) => r.blob());
    const galleryPageImageBlob = {
      page: galleryPage,
      filename: new URL(imageSource.imagePageUrl).pathname.split("/").at(-1),
      source: imageSource,
      blob
    };
    setGalleryCollectionItem(imageSource.page.index, galleryPageImageBlob);
    return galleryPageImageBlob;
  }
  async function resolveGalleryPageImageBlob(galleryPage) {
    var _a2;
    const galleryPageImageBlobShelved = (_a2 = getGalleryCollectionItem(galleryPage.index, galleryPage.galleryId)) == null ? void 0 : _a2.blob;
    if (galleryPageImageBlobShelved) {
      return galleryPageImageBlobShelved;
    }
    const item = await loadGalleryCollectionItem(galleryPage, galleryCollectionShelf);
    if (item == null ? void 0 : item.blob) return item.blob;
    return fetchGalleryPageImageBlob(galleryPage);
  }
  function isGalleryPageImageBlob(item) {
    return "blob" in item && "source" in item && !("nextPage" in item);
  }
  function delay(intervalMs) {
    const { resolve, promise } = Promise.withResolvers();
    setTimeout(() => resolve(), intervalMs);
    return promise;
  }
  const fetchingGalleryPages = [];
  const fetchingGalleryPagesUnsaved = [];
  const galleryPageFetchStatus = {};
  const galleryPageFetchStatusEvent = new e();
  function updateFetchStatus(galleryPage, status) {
    galleryPageFetchStatus[getGalleryPageId(galleryPage)] = status;
    galleryPageFetchStatusEvent.dispatchTypedEvent("status-update", new CustomEvent("status-update", {
      detail: {
        description: galleryPage,
        status
      }
    }));
  }
  async function fetchGalleryPages(startPage, maxPageCount, {
    abortSignal,
    collectionShelf = galleryCollectionShelf,
    lazy = true,
    force = false,
    assertStartPageIsCurrentPage = false
  } = {}) {
    const lockSharedLimit = settings("background-session-image-caching-limit");
    return await window.navigator.locks.request("fetching-images", {
      mode: "shared",
      signal: abortSignal
    }, async () => {
      const stImageSource = await resolveGalleryPageImageSource(startPage);
      let galleryCollectionStoreClear = false;
      Promise.resolve(resolveGalleryPageImageBlob(stImageSource.page)).then(() => {
        updateFetchStatus(stImageSource.page, "fetched");
      });
      galleryCollectionStoreEvent.addEventListener("clear-all", () => {
        galleryCollectionStoreClear = true;
      });
      for (let i = 0, itImageSource = stImageSource, cachedImageCount = 0; i < Math.min(maxPageCount, settings("persistent-cache-limit")); i++) {
        const lockHeldCount = await window.navigator.locks.query().then((locks) => {
          var _a2;
          return ((_a2 = locks.held) == null ? void 0 : _a2.filter((l) => l.name == "fetching-images")) ?? [];
        }).then((locks) => locks.length);
        if (lockHeldCount >= lockSharedLimit && document.visibilityState == "hidden") {
          lazySaveFetchingImages(collectionShelf, itImageSource.page);
          info("Fetching images stopped because the session is inactive.");
          return {};
        }
        if (galleryCollectionStoreClear) {
          lazySaveFetchingImages(collectionShelf, itImageSource.page);
          info("Fetching images stopped because the gallery collection store is cleared.");
          return {};
        }
        if (abortSignal == null ? void 0 : abortSignal.aborted) {
          info("Fetching images aborted.");
          return {};
        }
        if (getGalleryPageId(startPage) != getGalleryPageId(getCurrentGalleryPageInfo()) && assertStartPageIsCurrentPage) {
          info("Fetching images aborted because the startPage is not the current page.");
          return {};
        }
        if (fetchingGalleryPages.length > settings("concurrent-image-caching-limit")) {
          await Promise.all(fetchingGalleryPages);
        }
        const collectionItem = getGalleryCollectionItem(itImageSource.page.index + 1, startPage.galleryId);
        let nextPageSource;
        if (collectionItem && !force) {
          nextPageSource = collectionItem.source;
          info("Load saved cache started, page index", nextPageSource.page.index);
          cachedImageCount++;
          if (cachedImageCount == settings("lazy-image-caching-minimum-cached") && lazy) {
            info(`Fetching images lazily stopped because script has saved ${settings("lazy-image-caching-minimum-cached")} future pages.`);
            return {};
          }
        } else {
          const nextPage = itImageSource.nextPage;
          cachedImageCount = 0;
          if (i % settings("image-caching-cooldown-nth") == 0 && settings("image-caching-cooldown") != -1) {
            info("Cooldown started", settings("image-caching-cooldown"));
            await delay(settings("image-caching-cooldown"));
          }
          if (force) {
            deleteGalleryCollectionItem(nextPage.index);
          }
          updateFetchStatus(nextPage, "fetching");
          info("Download cache started, page index", nextPage.index);
          nextPageSource = await resolveGalleryPageImageSource(nextPage);
          const promiseResult = resolveGalleryPageImageBlob(nextPage).then((imageBlob) => {
            updateFetchStatus(nextPage, "fetched");
            return imageBlob;
          });
          promiseResult.catch(() => {
            info("Failed to load image", nextPage.index);
          }).finally(() => {
            fetchingGalleryPages.splice(fetchingGalleryPages.indexOf(promiseResult));
          });
          fetchingGalleryPages.push(promiseResult);
          fetchingGalleryPagesUnsaved.push(promiseResult);
        }
        if (itImageSource.page.index == nextPageSource.page.index) {
          lazySaveFetchingImages(collectionShelf, itImageSource.page);
          info("Reached the last page.");
          return { lastPageIndex: nextPageSource.page.index };
        }
        if ((i + 1) % settings("persistent-cache-fetch-nth-save") == 0) {
          scheduler.postTask(() => lazySaveFetchingImages(collectionShelf, itImageSource.page), { priority: "background" });
        }
        if (i == maxPageCount - 1) {
          await lazySaveFetchingImages(collectionShelf, itImageSource.page);
        }
        itImageSource = nextPageSource;
      }
      return {};
    });
  }
  async function lazySaveFetchingImages(collectionShelf, pageInfo) {
    const imageBlobs = await Promise.allSettled(fetchingGalleryPagesUnsaved).then(
      (promises) => promises.map((settled) => {
        if (settled.status == "rejected") {
          warn("Some image cannot be saved due to likely fetching error", settled.reason);
        }
        return settled;
      }).filter((settled) => settled.status == "fulfilled").map((fulfilled) => fulfilled.value)
    );
    const items = imageBlobs.map((blob) => ({
      source: blob.source,
      blob
    }));
    fetchingGalleryPagesUnsaved.length = 0;
    saveGalleryMetadata(getGalleryCollection(pageInfo.galleryId));
    await saveGalleryCollectionItems(items).then(() => limitGalleryCollectionShelf(settings("persistent-cache-limit"), collectionShelf));
  }
  function observeGalleryPageChange(callback) {
    if (typeof window.navigation == "undefined") {
      const comicPageContainer = document.querySelector("#i3");
      if (comicPageContainer == null) {
        return void 0;
      }
      const observer = new MutationObserver(() => {
        callback();
      });
      observer.observe(comicPageContainer, {
        childList: true
      });
    } else {
      window.navigation.addEventListener("navigate", () => {
        callback();
      });
    }
  }
  function updateImageAutoFit() {
    const image = document.querySelector("#i3 #img");
    const stage = document.getElementById("i1");
    const statusBar = document.getElementById("ehp-status-bar");
    if (image == void 0 || stage == void 0 || statusBar == void 0) return;
    image.dataset.autoFit = String(settings("image-auto-fit"));
    if (!settings("image-auto-fit")) return;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - statusBar.clientHeight * 2;
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    const aspectRatio = naturalWidth / naturalHeight;
    let finalWidth, finalHeight;
    if (screenWidth / screenHeight > aspectRatio) {
      finalHeight = screenHeight;
      finalWidth = screenHeight * aspectRatio;
    } else {
      finalWidth = screenWidth;
      finalHeight = screenWidth / aspectRatio;
    }
    image.style.setProperty("--final-width", `${finalWidth}px`);
    image.style.setProperty("--final-height", `${finalHeight}px`);
    image.dataset.marginLeftCenter = String(finalWidth > stage.clientWidth && settings("image-auto-fit"));
    if (finalWidth > stage.clientWidth) {
      image.style.setProperty("--margin-left-center", `${-Math.abs((finalWidth - stage.clientWidth) / 2)}px`);
    }
    if (statusBar.dataset.autoFocus != "true") {
      statusBar.scrollIntoView(true);
      statusBar.dataset.autoFocus = "true";
    }
  }
  function setAutoFocusDirty() {
    const statusBar = document.getElementById("ehp-status-bar");
    if (statusBar) statusBar.dataset.autoFocus = "false";
  }
  function initImageAutoFit() {
    patchImageAutoFit();
    window.addEventListener("load", () => {
      updateImageAutoFit();
    });
    window.addEventListener("resize", () => {
      setAutoFocusDirty();
      updateImageAutoFit();
    });
    const animationFrame = () => {
      updateImageAutoFit();
      window.requestAnimationFrame(() => animationFrame());
    };
    window.requestAnimationFrame(() => {
      animationFrame();
    });
    observeGalleryPageChange(() => setAutoFocusDirty());
  }
  function patchImageAutoFit() {
    unsafeWindow.update_window_extents = () => {
      updateImageAutoFit();
    };
  }
  const preloadedImages = /* @__PURE__ */ new Map();
  function preloadCachedImages() {
    const pageInfo = getCurrentGalleryPageInfo();
    const collection = getGalleryCollection(pageInfo.galleryId);
    const preloaded = Array.from(document.querySelectorAll("link")).filter((link) => link.id.startsWith("s_p"));
    for (const link of preloaded) {
      const linkInfo = parseGalleryPageInfo(link.id.split("s_")[1]);
      if (linkInfo.index < pageInfo.index - settings("preload-cached-image") || linkInfo.index > pageInfo.index + settings("preload-cached-image")) {
        link.remove();
      }
    }
    for (let idx = pageInfo.index - settings("preload-cached-image"); idx <= pageInfo.index + settings("preload-cached-image"); idx++) {
      const imageBlob = collection.blobs.get(idx);
      if (imageBlob == void 0) continue;
      if (preloaded.find((link) => link.id.includes(`s_${getGalleryPageId(imageBlob.page)}`))) continue;
      const linkPreload = document.createElement("link");
      const imageUrl = URL.createObjectURL(imageBlob.blob);
      const pageId = getGalleryPageId(imageBlob.page);
      linkPreload.id = `s_${pageId}`;
      linkPreload.rel = "preload";
      linkPreload.as = "image";
      linkPreload.href = imageUrl;
      preloadedImages.set(pageId, imageUrl);
      document.head.appendChild(linkPreload);
    }
  }
  function getImageUrlFast(galleryPage) {
    const preload = preloadedImages.get(getGalleryPageId(galleryPage));
    if (preload) {
      galleryPageFetchStatus[getGalleryPageId(galleryPage)] = "fetched";
      return preload;
    } else {
      return (async () => {
        const quickLoad = await loadGalleryCollectionItem(galleryPage, galleryCollectionShelf);
        const imageBlob = (quickLoad == null ? void 0 : quickLoad.blob) ?? await resolveGalleryPageImageBlob(getCurrentGalleryPageInfo());
        galleryPageFetchStatus[getGalleryPageId(galleryPage)] = "fetched";
        saveGalleryCollectionItems([{
          source: imageBlob.source,
          blob: imageBlob
        }]);
        return URL.createObjectURL(imageBlob.blob);
      })();
    }
  }
  function waitImageElement() {
    const imageTag = document.querySelector("#i3 #img");
    if (imageTag) {
      return imageTag;
    } else {
      const { resolve, promise } = Promise.withResolvers();
      const interval = setInterval(() => {
        const imageTag2 = document.querySelector("#i3 #img");
        if (imageTag2 != null) {
          resolve(imageTag2);
          clearInterval(interval);
        }
      });
      return promise;
    }
  }
  async function patchCacheImage(force = false) {
    const galleryPage = getCurrentGalleryPageInfo();
    const imageTag = await waitImageElement();
    if (!imageTag.src.startsWith("blob:") || force) {
      const imageUrl = await getImageUrlFast(galleryPage);
      imageTag.src = imageUrl;
    }
    log("Image patched.");
  }
  const texts = {
    // Credits
    "script-title": "e-hentai images overload",
    "made-by": "made with pleasure by",
    "script-author": "owowed",
    // StatusBar
    "status-bar.button.preload-settings": "preload settings",
    "status-bar.button.gallery-explorer": "gallery explorer",
    // StatusIndicator
    "image-status.fetching": "image cache downloading",
    "image-status.fetched": "image cached",
    // SettingsPage
    "settings-page.button.refetch-pages": "Refetch Pages",
    "settings-page.button.save-data": "Save Data",
    "settings-page.button.reset-data": "Reset Data",
    // you may need to refresh
    "you-may-need-to-refresh": "you may need to refresh the page for some settings to apply",
    // SettingsEntry
    "settings-entry.toggle.true": "true",
    "settings-entry.toggle.false": "false",
    "settings-entry.button.detail": "detail",
    "settings.image-caching-limit.title": "Image caching limit",
    "settings.image-caching-limit.summary": "Set how many images are cached.",
    "settings.image-caching-limit.description": "Note that image caching may be delayed by image caching limit, which you can disabled by setting it to -1. Image caching feature cannot be disabled.",
    "settings.image-caching-cooldown.title": "Image caching cooldown",
    "settings.image-caching-cooldown.summary": "Set cooldown before the script caches another set of images.",
    "settings.image-caching-cooldown.description": "The script delays fetching images every Nth images, in whicn the N is the concurrent image caching limit. This can be useful to work around a site ban. Set to -1 to disable this.",
    "settings.background-session-image-caching-limit.title": "Background session image caching limit",
    "settings.background-session-image-caching-limit.summary": "Set how many background sessions (browser tabs that aren't in used by the user) can cache image simultaneously.",
    "settings.background-session-image-caching-limit.description": "When you switch to other session or browser tab, the previous session still runs image fetching and caching in your browser. This setting limits how many background session that can still run image caching. This can be useful to reduce bandwidth and preventing a site ban.",
    "settings.concurrent-image-caching-limit.title": "Concurrent image caching limit",
    "settings.concurrent-image-caching-limit.summary": "Set how many images can be downloaded and cached concurrently.",
    "settings.concurrent-image-caching-limit.description": "Images can be downloaded and cached concurrently each session (browser tabs), it means a single session can fetch and cache multiple pages at once. If it reaches the limit, the script waits for previous image caching to be done. Be careful setting the limit; setting it too high can essentially spam/DoS the e-hentai servers and lead to a temporary site ban.",
    "settings.persistent-cache-limit.title": "Persistent cache size limit",
    "settings.persistent-cache-limit.summary": "Set how many images can be saved in the userscript's storage across different sessions.",
    "settings.persistent-cache-limit.description": "Persistent cache stores are saved in your userscript's storage, and can re-used later for faster loading time between tabs and page refresh. Set to -1 to disable the persistent cache store. Hard limit is set for key-value type storage (200 entries max).",
    "settings.persistent-cache-storage-type.title": "Persistent cache storage type",
    "settings.persistent-cache-storage-type.summary": "Set how persistent cache are saved on your computer.",
    "settings.persistent-cache-storage-type.description": "By default, persistent cache are saved by file based storage type on Chromium browsers. However, some browsers may not support this, and the script fallbacks to key-value based storage type. File based storage is recommended because it directly stores the image data into a file, while key-value based storage serializes the image data to Base64, which may slow performance.",
    "settings.persistent-cache-storage-type.option.file": "File based (OPFS)",
    "settings.persistent-cache-storage-type.option.key-value": "Key-value based (Base64)",
    "settings.persistent-cache-timeout.title": "Persistent cache timeout",
    "settings.persistent-cache-timeout.summary": "Set timeout when the userscript resets the persistent cache.",
    "settings.persistent-cache-timeout.description": "If you set it to 3 days, then the script will reset the persistent cache 3 days from when that value was set. Set to -1 to disable this. The script will reset the persistent cache in %{reset_date}%, reset the setting to start over.",
    "settings.image-auto-fit.title": "Image Auto Fit",
    "settings.image-auto-fit.summary": "Ensure image auto fit into the browser window's width and height",
    "settings.image-auto-fit.description": "May fix oversized image, or too small.",
    // GalleryExplorer
    "gallery-explorer.title": "Gallery Explorer",
    "gallery-explorer.description": "View your saved pages in the persistent cache.",
    "gallery-explorer.package-status.packaging": "Packaging images to a zip file for download, this might take a while...",
    "gallery-explorer.package-status.completed": "Download for the zip file has started.",
    "gallery-explorer.image-zoom": "Image zoom: ",
    "gallery-explorer.stat-summary": "Total of %{gallery_total}% saved galleries and with %{pages_total}% saved pages.",
    "gallery-explorer.current-gallery-marker": "(current)",
    "gallery-explorer.button.toggle-unblur": "Toggle Unblur",
    "gallery-explorer.button.reload-data": "Reload Data",
    "gallery-explorer.button.download-data": "Download Data",
    "gallery-explorer.button.reset-data": "Reset Data",
    "gallery-explorer.button.exit": "exit",
    // GalleryPanel
    "gallery-panel.gallery-title": "Gallery #%{gallery_id}%",
    "gallery-panel.pages-count": "%{pages_count}% pages",
    "gallery-panel.button.unblur": "unblur",
    "gallery-panel.button.reload": "reload",
    "gallery-panel.button.download": "download",
    "gallery-panel.button.delete": "delete",
    "gallery-panel.button.collapse": "collapse",
    "gallery-panel.button.show": "show",
    "gallery-panel.button.fetch-more": "fetch more",
    // GalleryPage
    "gallery-page.title": "%{filename}% [%{index}%]",
    "gallery-page.button.unblur": "unblur"
  };
  function txt(prop, replacements) {
    return replacements ? stringFindReplace(texts[prop], replacements) : texts[prop];
  }
  function stringFindReplace(template, variables) {
    return template.replace(/\\?%\{(\w+)\}%/g, (match, variableName) => {
      if (match.startsWith("\\")) {
        return `%{${variableName}}%`;
      }
      return variables[variableName] !== void 0 ? String(variables[variableName]) : match;
    });
  }
  function StatusIndicator() {
    const [statusText, setStatusText] = React.useText(txt("image-status.fetching"));
    const statusBar = React.useRef(null);
    const fetchedFast = galleryPageFetchStatus[getGalleryPageId(getCurrentGalleryPageInfo())] == "fetched";
    if (!fetchedFast) {
      galleryPageFetchStatusEvent.addEventListener("status-update", ({ detail }) => {
        if (getGalleryPageId(detail.description) == getGalleryPageId(getCurrentGalleryPageInfo())) {
          setStatusText(txt(`image-status.${detail.status}`));
          statusBar.current.dataset.status = detail.status;
        }
      });
    } else {
      setStatusText(txt("image-status.fetched"));
      setTimeout(() => statusBar.current.dataset.status = "fetched-fast");
    }
    return /* @__PURE__ */ React.createElement("div", { id: "ehp-status-indicator", title: fetchedFast ? "image cached very fast!" : "", ref: statusBar }, statusText);
  }
  function StatusBar() {
    return /* @__PURE__ */ React.createElement("div", { id: "ehp-status-bar", class: "ehp-styling" }, /* @__PURE__ */ React.createElement("div", { class: "activator-list" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        id: "ehp-settings-activator",
        class: "link-button",
        onClick: () => {
          const settingsPage = document.querySelector("#ehp-settings-page");
          settingsPage == null ? void 0 : settingsPage.classList.toggle("open");
        }
      },
      txt("status-bar.button.preload-settings")
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        id: "ehp-gallery-explorer-activator",
        class: "link-button",
        popovertarget: "ehp-gallery-explorer",
        onClick: () => {
          const galleryExplorer = document.querySelector("#ehp-gallery-explorer");
          galleryExplorer == null ? void 0 : galleryExplorer.dispatchEvent(new CustomEvent("reload"));
        }
      },
      txt("status-bar.button.gallery-explorer")
    )), /* @__PURE__ */ React.createElement(StatusIndicator, null));
  }
  function SettingsEntry({
    type,
    title,
    summary,
    description,
    unit,
    key,
    options,
    transform = (v) => v,
    transformBack = (v) => v
  }) {
    const settingsEntryInput = React.useRef(null);
    const settingsEntrySelect = React.useRef(null);
    const settingsEntryDetailButton = React.useRef(null);
    const settingsDescription = React.useRef(null);
    const handleInput = () => {
      if (type == "text") {
        settings(key, transform(String(settingsEntryInput.current.value)));
      }
      if (type == "number") {
        settings(key, transform(parseInt(settingsEntryInput.current.value)));
      }
      if (type == "selector") {
        settings(key, transform(String(settingsEntrySelect.current.value)));
      }
      if (type == "toggle") {
        settings(key, transform(settingsEntrySelect.current.value == "true"));
      }
    };
    const handleDetailClick = () => {
      settingsDescription.current.classList.toggle("active");
    };
    let inputBox = /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "this should not appear, report to the devs!!", readOnly: true });
    if (type == "selector") {
      inputBox = /* @__PURE__ */ React.createElement("select", { ref: settingsEntrySelect, onChange: handleInput }, options == null ? void 0 : options.map((opt) => /* @__PURE__ */ React.createElement("option", { value: opt.value, selected: settings("persistent-cache-storage-type") == opt.value }, opt.title)));
    } else if (type == "toggle") {
      inputBox = /* @__PURE__ */ React.createElement("select", { ref: settingsEntrySelect, onChange: handleInput }, /* @__PURE__ */ React.createElement("option", { value: "true", selected: settings(key) == true }, txt("settings-entry.toggle.true")), /* @__PURE__ */ React.createElement("option", { value: "false", selected: settings(key) == false }, txt("settings-entry.toggle.false")));
    } else {
      inputBox = /* @__PURE__ */ React.createElement("input", { type, value: String(transformBack(settings(key))), onChange: handleInput, ref: settingsEntryInput });
    }
    return /* @__PURE__ */ React.createElement("div", { class: "ehp-settings-entry" }, /* @__PURE__ */ React.createElement("h2", null, title), /* @__PURE__ */ React.createElement("p", { class: "summary" }, summary, " ", description && /* @__PURE__ */ React.createElement("button", { class: "link-button detail-button", onClick: handleDetailClick, ref: settingsEntryDetailButton }, txt("settings-entry.button.detail"))), description && /* @__PURE__ */ React.createElement("p", { class: "description", ref: settingsDescription }, description), inputBox, " ", unit);
  }
  function SettingsPage() {
    const refetchPages = async () => {
      await fetchGalleryPages(getCurrentGalleryPageInfo(), settings("image-caching-limit"), { lazy: false });
      await patchCacheImage(true);
    };
    const saveData = () => saveGalleryCollectionShelf(galleryCollectionShelf);
    const resetData = () => clearGalleryCollectionShelf(galleryCollectionShelf);
    return /* @__PURE__ */ React.createElement("div", { id: "ehp-settings-page", class: "ehp-popover ehp-styling" }, /* @__PURE__ */ React.createElement("div", { class: "header" }, /* @__PURE__ */ React.createElement("h2", { class: "popup-title" }, txt("script-title")), /* @__PURE__ */ React.createElement("div", { class: "note credits" }, /* @__PURE__ */ React.createElement("div", null, txt("made-by")), /* @__PURE__ */ React.createElement("div", { id: "owo-icon-pfp" }), /* @__PURE__ */ React.createElement("div", null, txt("script-author")))), /* @__PURE__ */ React.createElement("div", { class: "settings-button" }, /* @__PURE__ */ React.createElement("button", { class: "mini-button", onClick: refetchPages }, txt("settings-page.button.refetch-pages")), /* @__PURE__ */ React.createElement("button", { class: "mini-button", onClick: saveData }, txt("settings-page.button.save-data")), /* @__PURE__ */ React.createElement("button", { class: "mini-button", onClick: resetData }, txt("settings-page.button.reset-data"))), /* @__PURE__ */ React.createElement(
      SettingsEntry,
      {
        key: "image-caching-limit",
        type: "number",
        unit: "pages",
        title: txt("settings.image-caching-limit.title"),
        summary: txt("settings.image-caching-limit.summary"),
        description: txt("settings.image-caching-limit.description")
      }
    ), /* @__PURE__ */ React.createElement(
      SettingsEntry,
      {
        key: "concurrent-image-caching-limit",
        type: "number",
        unit: "pages",
        title: txt("settings.concurrent-image-caching-limit.title"),
        summary: txt("settings.concurrent-image-caching-limit.summary"),
        description: txt("settings.concurrent-image-caching-limit.description")
      }
    ), /* @__PURE__ */ React.createElement(
      SettingsEntry,
      {
        key: "background-session-image-caching-limit",
        type: "number",
        unit: "background session",
        title: txt("settings.background-session-image-caching-limit.title"),
        summary: txt("settings.background-session-image-caching-limit.summary"),
        description: txt("settings.background-session-image-caching-limit.description")
      }
    ), /* @__PURE__ */ React.createElement(
      SettingsEntry,
      {
        key: "image-caching-cooldown",
        type: "number",
        unit: "seconds",
        title: txt("settings.image-caching-cooldown.title"),
        summary: txt("settings.image-caching-cooldown.summary"),
        description: txt("settings.image-caching-cooldown.description"),
        transform: (second) => second == -1 ? second : second * ONE_SECOND_MILLISECONDS,
        transformBack: (ms) => ms == -1 ? ms : ms / ONE_SECOND_MILLISECONDS
      }
    ), /* @__PURE__ */ React.createElement(
      SettingsEntry,
      {
        key: "persistent-cache-limit",
        type: "number",
        unit: "pages",
        title: txt("settings.persistent-cache-limit.title"),
        summary: txt("settings.persistent-cache-limit.summary"),
        description: txt("settings.persistent-cache-limit.description")
      }
    ), /* @__PURE__ */ React.createElement(
      SettingsEntry,
      {
        key: "persistent-cache-storage-type",
        type: "selector",
        title: txt("settings.persistent-cache-storage-type.title"),
        summary: txt("settings.persistent-cache-storage-type.summary"),
        description: txt("settings.persistent-cache-storage-type.description"),
        options: [
          {
            title: txt("settings.persistent-cache-storage-type.option.file"),
            value: "file"
          },
          {
            title: txt("settings.persistent-cache-storage-type.option.key-value"),
            value: "key-value"
          }
        ]
      }
    ), /* @__PURE__ */ React.createElement(
      SettingsEntry,
      {
        key: "persistent-cache-timeout",
        type: "number",
        unit: "days",
        title: txt("settings.persistent-cache-timeout.title"),
        summary: txt("settings.persistent-cache-timeout.summary"),
        description: txt("settings.persistent-cache-timeout.description", {
          reset_date: new Intl.DateTimeFormat(navigator.language, {
            year: "numeric",
            month: "long",
            day: "numeric"
          }).format(new Date(store("gallery-collection-timeout-start") + settings("persistent-cache-timeout")))
        }),
        transform: (dayCount) => dayCount == -1 ? dayCount : dayCount * ONE_DAY_MILLISECONDS,
        transformBack: (dayMilliseconds) => dayMilliseconds == -1 ? dayMilliseconds : dayMilliseconds / ONE_DAY_MILLISECONDS
      }
    ), /* @__PURE__ */ React.createElement(
      SettingsEntry,
      {
        key: "image-auto-fit",
        type: "toggle",
        title: txt("settings.image-auto-fit.title"),
        summary: txt("settings.image-auto-fit.summary"),
        description: txt("settings.image-auto-fit.description")
      }
    ), /* @__PURE__ */ React.createElement("div", { class: "note" }, txt("you-may-need-to-refresh")), /* @__PURE__ */ React.createElement("div", { class: "note version" }, "v", GM_info.script.version));
  }
  function GalleryPage({ index, imageBlob }) {
    const { pageId, galleryId } = imageBlob.page;
    const galleryPage = React.useRef(null);
    const unblurClick = () => {
      galleryPage.current.classList.toggle("unblur", true);
    };
    return /* @__PURE__ */ React.createElement("div", { class: "gallery-page", ref: galleryPage }, /* @__PURE__ */ React.createElement("div", { class: "page-title", title: imageBlob.filename }, /* @__PURE__ */ React.createElement("a", { href: `https://e-hentai.org/s/${pageId}/${galleryId}-${index}` }, txt("gallery-page.title", { filename: imageBlob.filename, index }))), /* @__PURE__ */ React.createElement("div", { class: "page-image" }, /* @__PURE__ */ React.createElement("img", { src: URL.createObjectURL(imageBlob.blob), alt: "" }), /* @__PURE__ */ React.createElement("button", { class: "mini-button unblur-button", onClick: unblurClick }, txt("gallery-page.button.unblur"))));
  }
  function GalleryPanel({ collectionShelf, galleryId }) {
    const pageListRef = React.useRef(null);
    const packageStatus = React.useRef(null);
    let unblurAll = false;
    const [pageCount, setPageCount] = React.useText(txt("gallery-panel.pages-count", { pages_count: 0 }));
    const [packageFileStatus, setPackageFileStatus] = React.useText(txt("gallery-explorer.package-status.packaging"));
    const [showCollapse, setShowCollapse] = React.useText("show");
    const collapsePages = () => {
      pageListRef.current.classList.toggle("open");
      const isOpen = pageListRef.current.classList.contains("open");
      setShowCollapse(isOpen ? txt("gallery-panel.button.collapse") : txt("gallery-panel.button.show"));
      if (isOpen) {
        reloadPages();
      }
    };
    const unblurPages = () => {
      unblurAll = !unblurAll;
      for (const child of pageListRef.current.children) {
        child.classList.toggle("unblur", unblurAll);
      }
    };
    const downloadPages = async () => {
      var _a2;
      const collectionItem = getGalleryCollection(galleryId, collectionShelf);
      const zip = new JSZip();
      info("Preparing zip for pages download...");
      setPackageFileStatus(txt("gallery-explorer.package-status.packaging"));
      (_a2 = packageStatus.current) == null ? void 0 : _a2.classList.toggle("display", true);
      for (const [_, imageBlob] of collectionItem.blobs) {
        zip.file(`${getGalleryPageId(imageBlob.page)}_${imageBlob.filename}`, imageBlob.blob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      setPackageFileStatus(txt("gallery-explorer.package-status.completed"));
      setTimeout(() => {
        var _a3;
        return (_a3 = packageStatus.current) == null ? void 0 : _a3.classList.toggle("display", false);
      }, 4e3);
      GM_download({
        name: `gallery-${galleryId}.zip`,
        url: URL.createObjectURL(blob)
      });
    };
    const fetchMorePagesButton = /* @__PURE__ */ React.createElement("button", { class: "mini-button fetch-more" }, txt("gallery-panel.button.fetch-more"));
    const fetchMorePagesButtonContainer = /* @__PURE__ */ React.createElement("div", { class: "gallery-page" }, fetchMorePagesButton);
    let lastFetchedPageIndex = 0;
    fetchMorePagesButton.addEventListener("click", async () => {
      const { lastPageIndex } = await fetchGalleryPages({
        ...getCurrentGalleryPageInfo(),
        index: lastFetchedPageIndex
      }, settings("image-caching-limit"));
      if (lastPageIndex != void 0) lastFetchedPageIndex = lastPageIndex;
      await saveGalleryCollectionShelf(collectionShelf);
      await reloadPages();
    });
    const loadedPages = /* @__PURE__ */ new Map();
    galleryCollectionStoreEvent.addEventListener("clear-all", () => loadedPages.clear());
    galleryCollectionStoreEvent.addEventListener("save", () => reloadPages());
    const reloadPages = async () => {
      const pageList = pageListRef.current;
      for await (const item of loadGalleryCollectionsGenerator(collectionShelf, [galleryId], true)) {
        const pageId = getGalleryPageId(item.source.page);
        if (item.blob == void 0) continue;
        if (loadedPages.has(pageId)) continue;
        const element = GalleryPage({
          index: item.source.page.index,
          imageBlob: item.blob
        });
        loadedPages.set(
          pageId,
          element
        );
        pageList.appendChild(element);
        lastFetchedPageIndex = item.source.page.index;
        setPageCount(txt("gallery-panel.pages-count", { pages_count: loadedPages.size }));
      }
      const sortedPages = loadedPages.entries().toArray().sort(([pageId, _el], [pageIdx, _elx]) => parseGalleryPageInfo(pageId).index - parseGalleryPageInfo(pageIdx).index).map(([_pageId, el]) => el);
      pageList.replaceChildren(...sortedPages);
      if (getCurrentGalleryPageInfo().galleryId == galleryId) {
        pageList.appendChild(fetchMorePagesButtonContainer);
      }
    };
    const galleryRevision = getGalleryCollection(galleryId).revision;
    const result = /* @__PURE__ */ React.createElement("div", { class: "gallery-panel" }, /* @__PURE__ */ React.createElement("div", { class: "panel-title" }, /* @__PURE__ */ React.createElement("h2", null, galleryRevision ? /* @__PURE__ */ React.createElement("a", { href: `https://e-hentai.org/g/${galleryId}/${galleryRevision}` }, txt("gallery-panel.gallery-title", { gallery_id: galleryId })) : txt("gallery-panel.gallery-title", { gallery_id: galleryId })), /* @__PURE__ */ React.createElement("span", null, pageCount), /* @__PURE__ */ React.createElement("button", { class: "link-button", onClick: () => collapsePages() }, showCollapse), /* @__PURE__ */ React.createElement("button", { class: "link-button", onClick: () => unblurPages() }, txt("gallery-panel.button.unblur")), /* @__PURE__ */ React.createElement("button", { class: "link-button", onClick: () => reloadPages() }, txt("gallery-panel.button.reload")), /* @__PURE__ */ React.createElement("button", { class: "link-button", onClick: () => downloadPages() }, txt("gallery-panel.button.download")), /* @__PURE__ */ React.createElement("button", { class: "link-button", onClick: () => {
      clearGalleryCollectionShelf(collectionShelf, galleryId);
      result.remove();
    } }, txt("gallery-panel.button.delete")), galleryId == getCurrentGalleryPageInfo().galleryId && txt("gallery-explorer.current-gallery-marker"), /* @__PURE__ */ React.createElement("p", { class: "package-file-status", ref: packageStatus }, packageFileStatus)), /* @__PURE__ */ React.createElement("div", { class: "page-list", ref: pageListRef }));
    reloadPages();
    return result;
  }
  function GalleryExplorer({ collectionShelf }) {
    const popoverRef = React.useRef(null);
    const panelGridRef = React.useRef(null);
    const packageStatusRef = React.useRef(null);
    const updateImageZoomChange = (event) => {
      var _a2;
      const newSize = event.currentTarget.valueAsNumber * 100;
      settings("ui-gallery-explorer-image-zoom", newSize);
      (_a2 = panelGridRef.current) == null ? void 0 : _a2.style.setProperty("--gallery-page-list-min-column-size", `${newSize}px`);
    };
    const panelEvent = new e();
    const reloadGalleryPages = () => {
      panelEvent.dispatchTypedEvent("reload", new Event("reload"));
    };
    const loadedPanels = /* @__PURE__ */ new Set();
    galleryCollectionStoreEvent.addEventListener("clear-all", () => {
      var _a2;
      loadedPanels.clear();
      (_a2 = panelGridRef.current) == null ? void 0 : _a2.replaceChildren();
    });
    galleryCollectionStoreEvent.addEventListener("save", () => {
      reloadGalleryPanels();
    });
    const [statSummary, setStatSummary] = React.useText(txt("gallery-explorer.stat-summary", { gallery_total: 0, pages_total: 0 }));
    const [packageFileStatus, setPackageFileStatus] = React.useText(txt("gallery-explorer.package-status.packaging"));
    const reloadGalleryPanels = async () => {
      const panelGrid = panelGridRef.current;
      await loadGalleryCollectionShelf(collectionShelf);
      if (!loadedPanels.has(getCurrentGalleryPageInfo().galleryId)) {
        const panelCurrentGallery = GalleryPanel({
          collectionShelf,
          galleryId: getCurrentGalleryPageInfo().galleryId
        });
        panelGridRef.current.append(panelCurrentGallery);
        loadedPanels.add(getCurrentGalleryPageInfo().galleryId);
      }
      for (const [galleryId, collection] of collectionShelf) {
        if (loadedPanels.has(galleryId)) continue;
        if (collection.sources.size == 0) continue;
        panelGrid.append(GalleryPanel({ collectionShelf, galleryId }));
        loadedPanels.add(galleryId);
      }
      reloadGalleryPages();
      toggleUnblur(settings("ui-gallery-explorer-unblur-all"));
      setStatSummary(txt("gallery-explorer.stat-summary", {
        gallery_total: collectionShelf.size,
        pages_total: collectionShelf.values().map((i) => i.sources.values().toArray().length).reduce((x, y) => x + y, 0)
      }));
    };
    const downloadData = async () => {
      var _a2;
      if (collectionShelf.size == 0) {
        return;
      }
      const zip = new JSZip();
      info("Preparing zip for gallery collection download...");
      setPackageFileStatus(txt("gallery-explorer.package-status.packaging"));
      (_a2 = packageStatusRef.current) == null ? void 0 : _a2.classList.toggle("display", true);
      for (const [galleryId, collection] of collectionShelf) {
        for (const [_, imageBlob] of collection.blobs) {
          zip.file(`gallery-${galleryId}/${getGalleryPageId(imageBlob.page)}_${imageBlob.filename}`, imageBlob.blob);
        }
      }
      const blob = await zip.generateAsync({ type: "blob" });
      setPackageFileStatus(txt("gallery-explorer.package-status.completed"));
      setTimeout(() => {
        var _a3;
        return (_a3 = packageStatusRef.current) == null ? void 0 : _a3.classList.toggle("display", false);
      }, 4e3);
      GM_download({
        name: `collection-${Date.now()}.zip`,
        url: URL.createObjectURL(blob)
      });
    };
    const resetData = async () => {
      await clearGalleryCollectionShelf(collectionShelf);
      await reloadGalleryPanels();
    };
    const toggleUnblur = (force) => {
      const pages = panelGridRef.current.querySelectorAll(".gallery-page");
      settings("ui-gallery-explorer-unblur-all", force ?? !settings("ui-gallery-explorer-unblur-all"));
      for (const page of pages) {
        page.classList.toggle("unblur", settings("ui-gallery-explorer-unblur-all"));
      }
    };
    const result = /* @__PURE__ */ React.createElement("div", { id: "ehp-gallery-explorer", class: "ehp-popover ehp-styling", popover: true, ref: popoverRef }, /* @__PURE__ */ React.createElement("h1", { class: "h1" }, txt("gallery-explorer.title")), /* @__PURE__ */ React.createElement("p", null, txt("gallery-explorer.description")), /* @__PURE__ */ React.createElement("div", { class: "toolbar" }, /* @__PURE__ */ React.createElement("div", null, txt("gallery-explorer.image-zoom"), /* @__PURE__ */ React.createElement("input", { type: "number", value: settings("ui-gallery-explorer-image-zoom") / 100, onChange: updateImageZoomChange }), "x"), /* @__PURE__ */ React.createElement("button", { class: "mini-button", onClick: () => toggleUnblur() }, txt("gallery-explorer.button.toggle-unblur")), /* @__PURE__ */ React.createElement("button", { className: "mini-button", onClick: () => downloadData() }, txt("gallery-explorer.button.download-data")), /* @__PURE__ */ React.createElement("button", { class: "mini-button", onClick: () => resetData() }, txt("gallery-explorer.button.reset-data"))), /* @__PURE__ */ React.createElement("p", { class: "package-file-status", ref: packageStatusRef }, packageFileStatus), /* @__PURE__ */ React.createElement("div", { class: "exit-button-container" }, /* @__PURE__ */ React.createElement("button", { class: "link-button exit-button", onClick: () => {
      var _a2;
      return (_a2 = popoverRef.current) == null ? void 0 : _a2.togglePopover(false);
    } }, txt("gallery-explorer.button.exit"))), /* @__PURE__ */ React.createElement("div", { class: "panel-list", ref: panelGridRef }), /* @__PURE__ */ React.createElement("div", { class: "stat-summary" }, statSummary));
    reloadGalleryPanels();
    panelGridRef.current.style.setProperty("--gallery-page-list-min-column-size", `${settings("ui-gallery-explorer-image-zoom")}px`);
    popoverRef.current.addEventListener("reload", () => {
      reloadGalleryPanels();
    });
    setInterval(() => {
      const popoverElem = popoverRef.current;
      popoverElem.style.setProperty("--ehp-gallery-explorer-height", `${popoverElem.scrollHeight - popoverElem.offsetHeight + 100}px`);
    });
    return result;
  }
  function patchStatusBar() {
    if (document.getElementById("ehp-status-bar")) return;
    const statusBar = StatusBar();
    const i2 = document.querySelector("#i2 > .sn");
    i2 == null ? void 0 : i2.insertAdjacentElement("afterend", statusBar);
    return statusBar;
  }
  function patchSettingsPage() {
    if (document.getElementById("ehp-settings-page")) return;
    const settingsPage = SettingsPage();
    const i2 = document.querySelector("#i2");
    i2 == null ? void 0 : i2.append(settingsPage);
    return settingsPage;
  }
  function patchGalleryExplorer() {
    if (document.getElementById("ehp-gallery-explorer")) return;
    const galleryExplorer = GalleryExplorer({ collectionShelf: galleryCollectionShelf });
    const i2 = document.querySelector("#i2");
    i2 == null ? void 0 : i2.append(galleryExplorer);
    return galleryExplorer;
  }
  function waitDocumentLoaded() {
    const { resolve, promise } = Promise.withResolvers();
    if (document.readyState == "complete") {
      resolve();
      return promise;
    }
    document.addEventListener("readystatechange", () => {
      if (document.readyState == "complete") {
        resolve();
      }
    });
    return promise;
  }
  const elementInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
  Object.defineProperty(Element.prototype, "innerHTML", {
    set: function(value) {
      var _a2;
      if (this.id == "i3") {
        (async () => {
          var _a3;
          const parsedDom = domParse(value);
          const galleryPage = getCurrentGalleryPageInfo();
          const imageUrl = await getImageUrlFast(galleryPage);
          parsedDom.querySelector("img").src = imageUrl;
          (_a3 = elementInnerHTML == null ? void 0 : elementInnerHTML.set) == null ? void 0 : _a3.call(this, parsedDom.body.innerHTML);
        })();
      } else {
        (_a2 = elementInnerHTML == null ? void 0 : elementInnerHTML.set) == null ? void 0 : _a2.call(this, value);
      }
    }
  });
  const windowSetTimeout = window.setTimeout;
  unsafeWindow.setTimeout = function(handler, timeout) {
    if (handler.toString().includes("load_cooldown")) {
      timeout = 100;
    }
    return windowSetTimeout(handler, timeout);
  };
  const xhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(...args) {
    var _a2;
    const [apiSend] = args;
    const {
      gid: galleryId,
      imgkey: pageId,
      page: index
    } = JSON.parse(apiSend);
    if (galleryId == void 0 || pageId == void 0) {
      return xhrSend.apply(this, args);
    }
    const pageInfo = {
      galleryId,
      index,
      pageId
    };
    this.addEventListener("loadend", () => {
      const apiDataRaw = JSON.parse(this.responseText);
      const galleryPageImageSource = parseGalleryPageImageSource(pageInfo, getGalleryPageApiData(apiDataRaw));
      setGalleryCollectionItem(galleryPageImageSource.page.index, galleryPageImageSource);
    });
    (_a2 = this.onreadystatechange) == null ? void 0 : _a2.call(this, new Event("readystatechange"));
    return xhrSend.apply(this, args);
  };
  async function init() {
    initImageAutoFit();
    await update();
  }
  async function update() {
    patchCacheImage();
    await waitDocumentLoaded();
    initGalleryCollectionLimit();
    initGalleryCollectionTimeout();
    setAutoFocusDirty();
    scheduler.postTask(() => {
      patchStatusBar();
      patchSettingsPage();
      patchGalleryExplorer();
    }, { priority: "user-visible" });
    scheduler.postTask(async () => {
      const pageInfo = getCurrentGalleryPageInfo();
      loadGalleryCollections(galleryCollectionShelf, [pageInfo.galleryId], true).then(() => {
        preloadCachedImages();
      });
      await fetchGalleryPages(pageInfo, settings("image-caching-limit"), {
        assertStartPageIsCurrentPage: true
      });
      preloadCachedImages();
      await limitGalleryCollectionShelf(settings("persistent-cache-limit"), galleryCollectionShelf);
      info(`Storage size: ${getGalleryCollectionShelfSize()}/${settings("persistent-cache-limit")}`);
    }, { priority: "background" });
  }
  await( init());
  observeGalleryPageChange(async () => {
    await update();
  });

})(scheduler, GM_fetch, undefined, JSZip);
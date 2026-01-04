// ==UserScript==
// @name         Background for c.ai
// @namespace    c.ai Background Image Customizer
// @match        https://character.ai/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @version      2.2.0
// @description  Custom backgrounds for Character.AI: URL / Upload (IndexedDB) / Unsplash (search+browse+select), overlay, modes, sticky scroll, import/export, optional per-chat backgrounds.
// @icon         https://i.imgur.com/ynjBqKW.png
// @downloadURL https://update.greasyfork.org/scripts/501065/Background%20for%20cai.user.js
// @updateURL https://update.greasyfork.org/scripts/501065/Background%20for%20cai.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const VERSION = "2.2.0";

  // Backward compatible with v2.0/v2.1 global prefs
  const LS_KEY_GLOBAL = "cai_bg_customizer_v2";
  // New: per-chat overrides live here
  const LS_KEY_CHAT_PREFIX = "cai_bg_customizer_v2_chat_";

  // Key storage (encrypted-at-rest if possible)
  const LS_SECRET_UNSPLASH = "cai_bg_customizer_v2_unsplash_secret_v1";
  const LS_SECRET_FALLBACK = "cai_bg_customizer_v2_unsplash_key_plain_fallback";

  // IndexedDB for uploaded images + crypto key
  const DB_NAME = "caiBgCustomizer";
  const DB_VERSION = 1;
  const STORE_IMAGES = "images";
  const STORE_KEYS = "keys";

  // Global-only keys (never per chat)
  const GLOBAL_ONLY_KEYS = new Set(["enabled", "blurBehindUI", "dimUI", "perChatEnabled"]);

  // Per-chat keys (overrides apply only when perChatEnabled && chatId)
  const CHAT_KEYS = new Set([
    "imageSource",
    "imageUrl",
    "uploadImageId",
    "uploadImageName",
    "unsplashSelected",
    "overlayOpacity",
    "attachment",
    "position",
    "imageType",
  ]);

  const DEFAULTS = {
    // Global-only
    enabled: true,
    blurBehindUI: false,
    dimUI: false,
    perChatEnabled: false,

    // Image source selection (can be per chat)
    imageSource: "url", // "url" | "upload" | "unsplash"

    // URL source
    imageUrl: "",

    // Upload source
    uploadImageId: null,
    uploadImageName: "",

    // Unsplash
    unsplashSelected: null, // { id, regularUrl, fullUrl, thumbUrl, userName, userProfile, attributionText, downloadLocation } | null

    // Background behavior
    overlayOpacity: 0.35, // 0..1
    attachment: "fixed",  // "fixed" | "scroll"
    position: "center center",
    imageType: "Stretch", // "Stretch" | "Distort" | "ContainSingle" | "ContainRepeat"
  };

  /** ---------------------------
   *  Utilities
   *  --------------------------- */
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function safeQS(sel) {
    try { return document.querySelector(sel); } catch { return null; }
  }

  function looksLikeUrl(s) {
    if (!s) return true;
    const v = String(s).trim();
    if (!v) return true;
    if (v.startsWith("data:image/")) return true;
    try {
      const u = new URL(v, location.href);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function uid(prefix = "id") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function bufToB64(buf) {
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  function b64ToBuf(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  async function blobToDataUrl(blob) {
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error || new Error("FileReader failed"));
      r.readAsDataURL(blob);
    });
  }

  async function dataUrlToBlob(dataUrl) {
    const res = await fetch(dataUrl);
    return await res.blob();
  }

  /** ---------------------------
   *  Chat ID from URL
   *  --------------------------- */
  function getChatIdFromUrl() {
    const m = location.pathname.match(/^\/chat\/([^\/?#]+)/);
    return m ? m[1] : null;
  }

  let currentChatId = getChatIdFromUrl();

  /** ---------------------------
   *  Global + per-chat storage
   *  --------------------------- */
  function migrateSettings(s) {
    const merged = { ...DEFAULTS, ...(s || {}) };

    // sanity
    if (!["url", "upload", "unsplash"].includes(merged.imageSource)) merged.imageSource = "url";
    if (!["fixed", "scroll"].includes(merged.attachment)) merged.attachment = "fixed";
    if (!["Stretch", "Distort", "ContainSingle", "ContainRepeat"].includes(merged.imageType)) merged.imageType = "Stretch";

    merged.overlayOpacity = clamp(Number(merged.overlayOpacity ?? DEFAULTS.overlayOpacity), 0, 1);
    merged.position = (merged.position || DEFAULTS.position).trim() || DEFAULTS.position;

    merged.enabled = !!merged.enabled;
    merged.blurBehindUI = !!merged.blurBehindUI;
    merged.dimUI = !!merged.dimUI;
    merged.perChatEnabled = !!merged.perChatEnabled;

    return merged;
  }

  function loadGlobalSettings() {
    try {
      const raw = localStorage.getItem(LS_KEY_GLOBAL);
      if (!raw) return { ...DEFAULTS };
      return migrateSettings(JSON.parse(raw));
    } catch {
      return { ...DEFAULTS };
    }
  }

  function saveGlobalSettings(next) {
    localStorage.setItem(LS_KEY_GLOBAL, JSON.stringify(next));
  }

  function loadChatOverrides(chatId) {
    if (!chatId) return {};
    try {
      const raw = localStorage.getItem(LS_KEY_CHAT_PREFIX + chatId);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      // only allow known keys
      const clean = {};
      for (const k of Object.keys(parsed || {})) {
        if (CHAT_KEYS.has(k)) clean[k] = parsed[k];
      }
      return clean;
    } catch {
      return {};
    }
  }

  function saveChatOverrides(chatId, overrides) {
    if (!chatId) return;
    const clean = {};
    for (const k of Object.keys(overrides || {})) {
      if (CHAT_KEYS.has(k)) clean[k] = overrides[k];
    }
    localStorage.setItem(LS_KEY_CHAT_PREFIX + chatId, JSON.stringify(clean));
  }

  function clearChatOverrides(chatId) {
    if (!chatId) return;
    localStorage.removeItem(LS_KEY_CHAT_PREFIX + chatId);
  }

  function clearAllChatOverrides() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS_KEY_CHAT_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  }

  function getAllChatOverridesMap() {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(LS_KEY_CHAT_PREFIX)) continue;
      const chatId = k.slice(LS_KEY_CHAT_PREFIX.length);
      try {
        out[chatId] = JSON.parse(localStorage.getItem(k) || "{}") || {};
      } catch {
        out[chatId] = {};
      }
    }
    return out;
  }

  let globalSettings = loadGlobalSettings();

  function isChatScoped() {
    return !!(globalSettings.perChatEnabled && currentChatId);
  }

  function getEffectiveSettings() {
    if (!isChatScoped()) return globalSettings;
    const overrides = loadChatOverrides(currentChatId);
    return migrateSettings({ ...globalSettings, ...overrides });
  }

  /** ---------------------------
   *  IndexedDB (uploads + crypto key)
   *  --------------------------- */
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_IMAGES)) db.createObjectStore(STORE_IMAGES, { keyPath: "id" });
        if (!db.objectStoreNames.contains(STORE_KEYS)) db.createObjectStore(STORE_KEYS, { keyPath: "name" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("IndexedDB open failed"));
    });
    return dbPromise;
  }

  async function idbPut(store, value) {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error("IDB transaction failed"));
      tx.objectStore(store).put(value);
    });
  }

  async function idbGet(store, key) {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readonly");
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error || new Error("IDB get failed"));
    });
  }

  async function idbDelete(store, key) {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error("IDB delete failed"));
      tx.objectStore(store).delete(key);
    });
  }

  async function storeUploadedBlob({ id, name, type, blob }) {
    const rec = {
      id: id || uid("img"),
      name: name || "",
      type: type || blob.type || "image/*",
      size: blob.size || 0,
      updatedAt: Date.now(),
      blob
    };
    await idbPut(STORE_IMAGES, rec);
    return rec;
  }

  async function storeUploadedFile(file, forcedId = null) {
    return await storeUploadedBlob({ id: forcedId, name: file.name || "", type: file.type || "image/*", blob: file });
  }

  async function getUploadedImageBlob(id) {
    if (!id) return null;
    const rec = await idbGet(STORE_IMAGES, id);
    return rec?.blob || null;
  }

  /** ---------------------------
   *  Unsplash key: encrypted-at-rest if possible
   *  --------------------------- */
  async function getAesKey() {
    if (!crypto?.subtle) return null;

    const existing = await idbGet(STORE_KEYS, "aes_gcm_v1").catch(() => null);
    if (existing?.key) return existing.key;

    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    await idbPut(STORE_KEYS, { name: "aes_gcm_v1", key }).catch(() => {});
    return key;
  }

  async function encryptSecret(plaintext) {
    const key = await getAesKey();
    if (!key) return null;

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder().encode(plaintext);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc);
    return { iv: bufToB64(iv.buffer), ct: bufToB64(ct) };
  }

  async function decryptSecret(payload) {
    const key = await getAesKey();
    if (!key) return null;
    const iv = new Uint8Array(b64ToBuf(payload.iv));
    const ct = b64ToBuf(payload.ct);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    return new TextDecoder().decode(pt);
  }

  let unsplashAccessKeyCache = null;

  async function loadUnsplashKey() {
    if (unsplashAccessKeyCache !== null) return unsplashAccessKeyCache;

    try {
      const raw = localStorage.getItem(LS_SECRET_UNSPLASH);
      if (raw) {
        const payload = JSON.parse(raw);
        const key = await decryptSecret(payload);
        if (key) {
          unsplashAccessKeyCache = key;
          return key;
        }
      }
    } catch {}

    const fallback = localStorage.getItem(LS_SECRET_FALLBACK);
    unsplashAccessKeyCache = fallback ? String(fallback) : "";
    return unsplashAccessKeyCache;
  }

  async function saveUnsplashKey(nextKey) {
    unsplashAccessKeyCache = String(nextKey || "").trim();
    localStorage.removeItem(LS_SECRET_UNSPLASH);
    localStorage.removeItem(LS_SECRET_FALLBACK);

    if (!unsplashAccessKeyCache) return;

    const enc = await encryptSecret(unsplashAccessKeyCache);
    if (enc) localStorage.setItem(LS_SECRET_UNSPLASH, JSON.stringify(enc));
    else localStorage.setItem(LS_SECRET_FALLBACK, unsplashAccessKeyCache);
  }

  /** ---------------------------
   *  Unsplash API
   *  --------------------------- */
  async function unsplashFetch(path, params = {}) {
    const key = await loadUnsplashKey();
    if (!key) throw new Error("Missing Unsplash Access Key");

    const url = new URL(`https://api.unsplash.com${path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    const res = await fetch(url.toString(), { headers: { Authorization: `Client-ID ${key}` } });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Unsplash error ${res.status}: ${text.slice(0, 200)}`);
    }
    return await res.json();
  }

  async function unsplashSearch(query) {
    return await unsplashFetch("/search/photos", { query, per_page: 24, orientation: "landscape" });
  }

  async function unsplashBrowse() {
    return await unsplashFetch("/photos", { per_page: 24, order_by: "popular" });
  }

  async function unsplashTrackDownload(downloadLocation) {
    const key = await loadUnsplashKey();
    if (!key || !downloadLocation) return;
    try {
      await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${key}` } });
    } catch {}
  }

  function normalizeUnsplashItem(item) {
    const userName = item?.user?.name || item?.user?.username || "Unknown";
    const userProfile = item?.user?.links?.html || item?.user?.portfolio_url || "";
    const attributionText = `Photo by ${userName} on Unsplash`;

    return {
      id: item.id,
      regularUrl: item?.urls?.regular || "",
      fullUrl: item?.urls?.full || "",
      thumbUrl: item?.urls?.thumb || item?.urls?.small || "",
      userName,
      userProfile,
      attributionText,
      downloadLocation: item?.links?.download_location || ""
    };
  }

  /** ---------------------------
   *  DOM target selection (userstyle-inspired)
   *  --------------------------- */
  function findAppContainer() {
    const primary = safeQS("body > div > div:has(main)");
    if (primary) return primary;

    const byMain = safeQS("main")?.closest("div");
    if (byMain) return byMain;

    return safeQS("#__next") || safeQS("[id*='root']") || document.body;
  }

  /** ---------------------------
   *  Effective image URL resolution
   *  --------------------------- */
  let uploadObjectUrl = null;
  let uploadObjectUrlId = null;

  async function getEffectiveImageUrl(eff) {
    if (!eff.enabled) return "";

    if (eff.imageSource === "url") {
      const url = (eff.imageUrl || "").trim();
      return looksLikeUrl(url) ? url : "";
    }

    if (eff.imageSource === "upload") {
      const id = eff.uploadImageId;
      if (!id) return "";
      if (uploadObjectUrl && uploadObjectUrlId === id) return uploadObjectUrl;

      if (uploadObjectUrl) {
        try { URL.revokeObjectURL(uploadObjectUrl); } catch {}
        uploadObjectUrl = null;
        uploadObjectUrlId = null;
      }

      const blob = await getUploadedImageBlob(id);
      if (!blob) return "";
      uploadObjectUrl = URL.createObjectURL(blob);
      uploadObjectUrlId = id;
      return uploadObjectUrl;
    }

    if (eff.imageSource === "unsplash") {
      const sel = eff.unsplashSelected;
      if (!sel) return "";
      return (sel.regularUrl || sel.fullUrl || "").trim();
    }

    return "";
  }

  /** ---------------------------
   *  CSS injection
   *  --------------------------- */
  const STYLE_ID = "cai-bg-customizer-style-v22";

  function computeBackgroundCss(eff, imageUrl) {
    if (!eff.enabled || !imageUrl) {
      return `
        :root { --cai-bg-enabled: 0; }
        .cai-bg-target { background: none !important; }
      `;
    }

    const overlay = clamp(Number(eff.overlayOpacity ?? 0.35), 0, 1);
    const attach = eff.attachment === "scroll" ? "scroll" : "fixed";
    const pos = (eff.position || "center center").trim() || "center center";

    let size = "cover";
    let repeat = "no-repeat";

    switch (eff.imageType) {
      case "Distort":
        size = "100vw 100vh";
        repeat = "no-repeat";
        break;
      case "ContainSingle":
        size = "contain";
        repeat = "no-repeat";
        break;
      case "ContainRepeat":
        size = "contain";
        repeat = "repeat";
        break;
      case "Stretch":
      default:
        size = "cover";
        repeat = "no-repeat";
        break;
    }

    const safeUrl = String(imageUrl).replace(/"/g, '\\"');

    return `
      :root {
        --cai-bg-enabled: 1;
        --cai-bg-overlay: ${overlay};
        --cai-bg-attachment: ${attach};
        --cai-bg-position: ${pos};
        --cai-bg-size: ${size};
        --cai-bg-repeat: ${repeat};
      }

      .cai-bg-target {
        background-image:
          linear-gradient(
            rgba(0,0,0,var(--cai-bg-overlay)),
            rgba(0,0,0,var(--cai-bg-overlay))
          ),
          url("${safeUrl}") !important;
        background-attachment: var(--cai-bg-attachment) !important;
        background-position: var(--cai-bg-position) !important;
        background-size: var(--cai-bg-size) !important;
        background-repeat: var(--cai-bg-repeat) !important;
      }
    `;
  }

  function computeUiOverrideCss(eff) {
    const disableBlur = !eff.blurBehindUI;
    const dimUI = !!eff.dimUI;

    return `
      #cai-bg-ui-host { position: fixed; inset: 0; pointer-events: none; z-index: 2147483647; }
      #cai-bg-ui { pointer-events: auto; }

      ${disableBlur ? `
      .max-w-2xl:has(textarea) > * { backdrop-filter: none !important; }
      ` : ""}

      .max-w-2xl:has(textarea) > * {
        background: transparent !important;
      }

      main > div:has(title) > div > div.pb-4 {
        background-color: transparent !important;
      }

      ${dimUI ? `
      main [class*="bg-"], header [class*="bg-"] {
        background-color: rgba(0,0,0,0.25) !important;
      }
      ` : ""}
    `;
  }

  let applySeq = 0;
  let applyTimer = null;

  function requestApply() {
    clearTimeout(applyTimer);
    applyTimer = setTimeout(() => applyStyles(), 30);
  }

  async function applyStyles() {
    const seq = ++applySeq;

    const eff = getEffectiveSettings();
    const target = findAppContainer();
    target.classList.add("cai-bg-target");

    const imageUrl = await getEffectiveImageUrl(eff);
    if (seq !== applySeq) return;

    let styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      ${computeBackgroundCss(eff, imageUrl)}
      ${computeUiOverrideCss(eff)}
    `;
  }

  /** ---------------------------
   *  Import / Export
   *  --------------------------- */
  async function buildExportObject() {
    const key = await loadUnsplashKey();
    const chats = getAllChatOverridesMap();

    // gather referenced upload IDs (global + all chat overrides)
    const ids = new Set();
    if (globalSettings.uploadImageId) ids.add(globalSettings.uploadImageId);
    Object.values(chats).forEach((o) => {
      if (o?.uploadImageId) ids.add(o.uploadImageId);
    });

    const uploads = [];
    for (const id of ids) {
      const blob = await getUploadedImageBlob(id);
      if (!blob) continue;
      uploads.push({
        id,
        name: "", // name is stored in settings, not IDB (but we don't need it here)
        type: blob.type || "image/*",
        dataUrl: await blobToDataUrl(blob)
      });
    }

    return {
      format: "cai-bg-customizer",
      version: VERSION,
      exportedAt: new Date().toISOString(),
      global: { ...globalSettings },
      chats,
      secrets: { unsplashAccessKey: key || "" },
      assets: { uploads }
    };
  }

  async function importFromObject(obj) {
    if (!obj || obj.format !== "cai-bg-customizer") {
      throw new Error("Not a cai-bg-customizer export.");
    }

    // overwrite global
    globalSettings = migrateSettings(obj.global || {});
    saveGlobalSettings(globalSettings);

    // overwrite all chat overrides
    clearAllChatOverrides();
    const chats = obj.chats || {};
    for (const [chatId, overrides] of Object.entries(chats)) {
      saveChatOverrides(chatId, overrides || {});
    }

    // restore key
    if (obj?.secrets?.unsplashAccessKey) {
      await saveUnsplashKey(obj.secrets.unsplashAccessKey);
    }

    // restore uploads (keep same IDs so references stay valid)
    const uploads = obj?.assets?.uploads || [];
    for (const up of uploads) {
      if (!up?.id || !up?.dataUrl) continue;
      const blob = await dataUrlToBlob(up.dataUrl);
      await storeUploadedBlob({ id: up.id, name: up.name || "", type: up.type || blob.type, blob });
    }
  }

  /** ---------------------------
   *  UI (Shadow DOM)
   *  --------------------------- */
  const UI_HOST_ID = "cai-bg-ui-host";
  const UI_ID = "cai-bg-ui";
  const PANEL_ID = "cai-bg-panel";
  const BTN_ID = "cai-bg-btn";
  const TOAST_ID = "cai-bg-toast";

  function ensureUI() {
    let host = document.getElementById(UI_HOST_ID);
    if (host) return host;

    host = document.createElement("div");
    host.id = UI_HOST_ID;

    const ui = document.createElement("div");
    ui.id = UI_ID;

    const shadow = ui.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { all: initial; }

        .wrap {
          position: fixed;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Montserrat", sans-serif;
        }

        button, input, select { font-family: inherit; }

        button {
          all: unset;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
        }

        .btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(20,20,20,0.75);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          color: white;
          font-size: 18px;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn:active { transform: translateY(0px); }

        .panel {
          width: min(560px, calc(100vw - 24px));
          border-radius: 18px;
          background: rgba(20,20,20,0.88);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          box-shadow: 0 18px 60px rgba(0,0,0,0.45);
          color: white;
          padding: 14px;
          display: none;

          /* FIX: scroll when content grows */
          max-height: calc(100vh - 90px);
          overflow: auto;
          overscroll-behavior: contain;
        }
        .panel.open { display: block; }

        .row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: center;
        }

        .title {
          font-size: 14px;
          opacity: 0.95;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .badge {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          opacity: 0.85;
        }

        .tabs { display: flex; gap: 8px; margin-top: 12px; }
        .tab {
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          font-size: 12px;
          color: white;
          opacity: 0.9;
        }
        .tab.active {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.22);
          opacity: 1;
        }

        .field { display: grid; gap: 6px; margin-top: 12px; }
        label { font-size: 12px; opacity: 0.85; }

        input[type="text"], input[type="password"], select {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.07);
          color: white;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 10px 12px;
          outline: none;
          font-size: 13px;
        }
        input[type="range"] { width: 100%; accent-color: white; }
        .hint { font-size: 11px; opacity: 0.65; line-height: 1.35; }

        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 480px) { .grid2 { grid-template-columns: 1fr; } }

        .toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .pill {
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          font-size: 12px;
          color: white;
        }
        .pill:hover { background: rgba(255,255,255,0.14); }
        .pill.danger { background: rgba(255,70,70,0.18); border-color: rgba(255,70,70,0.35); }
        .pill.danger:hover { background: rgba(255,70,70,0.25); }

        .actions {
          display: flex;
          gap: 10px;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .actions .left, .actions .right { display: flex; gap: 10px; flex-wrap: wrap; }

        .toast {
          position: fixed;
          bottom: 14px;
          right: 14px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(20,20,20,0.88);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          color: white;
          font-size: 12px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 140ms ease, transform 140ms ease;
          pointer-events: none;
        }
        .toast.show { opacity: 1; transform: translateY(0); }

        .tabContent { display: none; }
        .tabContent.active { display: block; }

        .unsplashBar {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 10px;
          align-items: center;
        }
        @media (max-width: 520px) { .unsplashBar { grid-template-columns: 1fr; } }

        .results {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 560px) { .results { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 420px) { .results { grid-template-columns: repeat(2, 1fr); } }

        .card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          aspect-ratio: 1 / 1;
        }
        .card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .card .selectGlow {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(255,255,255,0.65);
          border-radius: 12px;
          pointer-events: none;
          opacity: 0;
        }
        .card.selected .selectGlow { opacity: 1; }

        .footer {
          margin-top: 12px;
          font-size: 11px;
          opacity: 0.7;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .footer a {
          color: white;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      </style>

      <div class="wrap">
        <button class="btn" id="${BTN_ID}" title="Background settings">🖼️</button>

        <div class="panel" id="${PANEL_ID}" role="dialog" aria-label="Background settings">
          <div class="row">
            <div class="title">
              <strong>Background</strong>
              <span class="badge">v${VERSION}</span>
            </div>
            <button class="pill" id="closeBtn" title="Close (Esc)">Close</button>
          </div>

          <div class="tabs" role="tablist" aria-label="Image source">
            <button class="tab" id="tabUrlBtn" data-tab="url">URL</button>
            <button class="tab" id="tabUploadBtn" data-tab="upload">Upload</button>
            <button class="tab" id="tabUnsplashBtn" data-tab="unsplash">Unsplash</button>
          </div>

          <div class="tabContent" id="tab_url">
            <div class="field">
              <label>Image URL</label>
              <input id="imgUrl" type="text" placeholder="https://... or data:image/..." />
              <div class="hint">Direct image URL required. If it breaks randomly, your host is hotlink-blocking you.</div>
            </div>
          </div>

          <div class="tabContent" id="tab_upload">
            <div class="field">
              <label>Upload local image (stored in browser via IndexedDB)</label>
              <div class="grid2">
                <button class="pill" id="pickUploadBtn">Choose image</button>
                <button class="pill danger" id="deleteUploadBtn" title="Delete stored upload">Delete stored</button>
              </div>
              <div class="hint" id="uploadStatus">No image uploaded.</div>
              <input id="uploadInput" type="file" accept="image/*" style="display:none" />
              <div class="hint">Yes, it stays in your browser. No, it’s not magically synced. Also: don’t upload a 40MB jpeg and cry.</div>
            </div>
          </div>

          <div class="tabContent" id="tab_unsplash">
            <div class="field">
              <label>Unsplash Access Key</label>
              <div class="grid2">
                <input id="unsplashKey" type="password" placeholder="Paste your Unsplash access key" />
                <button class="pill" id="saveUnsplashKeyBtn">Save key</button>
              </div>
              <div class="hint">Stored encrypted-at-rest if supported. Still: anything running on this page could potentially use it.</div>
            </div>

            <div class="field">
              <label>Search / Browse</label>
              <div class="unsplashBar">
                <input id="unsplashQuery" type="text" placeholder="Search (e.g. neon city, noir, retro)" />
                <button class="pill" id="unsplashSearchBtn">Search</button>
                <button class="pill" id="unsplashBrowseBtn">Browse</button>
              </div>
              <div class="hint" id="unsplashStatus">Enter a key to search.</div>
              <div class="results" id="unsplashResults"></div>
              <div class="hint" id="unsplashCredit" style="margin-top:10px;"></div>
            </div>
          </div>

          <div class="grid2">
            <div class="field">
              <label>Overlay darkness</label>
              <input id="overlay" type="range" min="0" max="1" step="0.01" />
              <div class="hint"><span id="overlayVal"></span></div>
            </div>

            <div class="field">
              <label>Attachment</label>
              <select id="attach">
                <option value="fixed">Sticky (fixed)</option>
                <option value="scroll">Scroll</option>
              </select>
            </div>
          </div>

          <div class="grid2">
            <div class="field">
              <label>Image mode</label>
              <select id="type">
                <option value="Stretch">Stretch (cover)</option>
                <option value="Distort">Distort (100vw 100vh)</option>
                <option value="ContainSingle">Contain (single)</option>
                <option value="ContainRepeat">Contain (repeat)</option>
              </select>
            </div>

            <div class="field">
              <label>Position</label>
              <input id="pos" type="text" placeholder="center center / top center / 20% 30% ..." />
              <div class="hint">Any valid CSS background-position string.</div>
            </div>
          </div>

          <div class="field">
            <div class="toggle">
              <div>
                <div style="font-size: 12px; opacity: 0.9;">Enabled</div>
                <div class="hint">Toggle background on/off (global)</div>
              </div>
              <input id="enabled" type="checkbox" />
            </div>
          </div>

          <div class="field">
            <div class="toggle">
              <div>
                <div style="font-size: 12px; opacity: 0.9;">Per-chat backgrounds</div>
                <div class="hint" id="perChatHint"></div>
              </div>
              <input id="perChat" type="checkbox" />
            </div>
          </div>

          <div class="grid2">
            <div class="field">
              <div class="toggle">
                <div>
                  <div style="font-size: 12px; opacity: 0.9;">Keep CAI blur</div>
                  <div class="hint">Global. If off, disables blur near input</div>
                </div>
                <input id="blurUI" type="checkbox" />
              </div>
            </div>

            <div class="field">
              <div class="toggle">
                <div>
                  <div style="font-size: 12px; opacity: 0.9;">Dim panels</div>
                  <div class="hint">Global. Extra contrast help</div>
                </div>
                <input id="dimUI" type="checkbox" />
              </div>
            </div>
          </div>

          <div class="actions">
            <div class="left">
              <button class="pill" id="importBtn" title="Import from file">Import</button>
              <button class="pill" id="exportBtn" title="Export to file">Export</button>
              <input id="importInput" type="file" accept="application/json" style="display:none" />
            </div>
            <div class="right">
              <button class="pill" id="resetBtn" title="Reset">Reset</button>
              <button class="pill danger" id="clearBtn" title="Clear current image">Clear image</button>
            </div>
          </div>

          <div class="footer">
            <div>Made by <a href="https://greasyfork.org/en/users/1226710-mr005k" target="_blank" rel="noopener noreferrer">Mr005K</a></div>
            <div style="opacity:0.7;">
              Scope: <span id="scopeBadge"></span> · Source: <span id="sourceBadge"></span>
            </div>
          </div>
        </div>

        <div class="toast" id="${TOAST_ID}"></div>
      </div>
    `;

    host.appendChild(ui);
    document.body.appendChild(host);
    wireUI(shadow);
    return host;
  }

  function wireUI(shadow) {
    const btn = shadow.getElementById(BTN_ID);
    const panel = shadow.getElementById(PANEL_ID);
    const toast = shadow.getElementById(TOAST_ID);

    // Tabs
    const tabUrlBtn = shadow.getElementById("tabUrlBtn");
    const tabUploadBtn = shadow.getElementById("tabUploadBtn");
    const tabUnsplashBtn = shadow.getElementById("tabUnsplashBtn");
    const tabUrl = shadow.getElementById("tab_url");
    const tabUpload = shadow.getElementById("tab_upload");
    const tabUnsplash = shadow.getElementById("tab_unsplash");

    // Badges
    const sourceBadge = shadow.getElementById("sourceBadge");
    const scopeBadge = shadow.getElementById("scopeBadge");

    // URL tab
    const imgUrl = shadow.getElementById("imgUrl");

    // Upload tab
    const pickUploadBtn = shadow.getElementById("pickUploadBtn");
    const deleteUploadBtn = shadow.getElementById("deleteUploadBtn");
    const uploadInput = shadow.getElementById("uploadInput");
    const uploadStatus = shadow.getElementById("uploadStatus");

    // Unsplash tab
    const unsplashKey = shadow.getElementById("unsplashKey");
    const saveUnsplashKeyBtn = shadow.getElementById("saveUnsplashKeyBtn");
    const unsplashQuery = shadow.getElementById("unsplashQuery");
    const unsplashSearchBtn = shadow.getElementById("unsplashSearchBtn");
    const unsplashBrowseBtn = shadow.getElementById("unsplashBrowseBtn");
    const unsplashResults = shadow.getElementById("unsplashResults");
    const unsplashStatus = shadow.getElementById("unsplashStatus");
    const unsplashCredit = shadow.getElementById("unsplashCredit");

    // Common controls
    const overlay = shadow.getElementById("overlay");
    const overlayVal = shadow.getElementById("overlayVal");
    const attach = shadow.getElementById("attach");
    const type = shadow.getElementById("type");
    const pos = shadow.getElementById("pos");
    const enabled = shadow.getElementById("enabled");
    const perChat = shadow.getElementById("perChat");
    const perChatHint = shadow.getElementById("perChatHint");
    const blurUI = shadow.getElementById("blurUI");
    const dimUI = shadow.getElementById("dimUI");

    // Actions
    const closeBtn = shadow.getElementById("closeBtn");
    const resetBtn = shadow.getElementById("resetBtn");
    const clearBtn = shadow.getElementById("clearBtn");
    const importBtn = shadow.getElementById("importBtn");
    const exportBtn = shadow.getElementById("exportBtn");
    const importInput = shadow.getElementById("importInput");

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1400);
    }

    function pickTab(id) {
      const map = {
        url: { btn: tabUrlBtn, el: tabUrl },
        upload: { btn: tabUploadBtn, el: tabUpload },
        unsplash: { btn: tabUnsplashBtn, el: tabUnsplash }
      };
      Object.entries(map).forEach(([k, v]) => {
        v.btn.classList.toggle("active", k === id);
        v.el.classList.toggle("active", k === id);
      });
    }

    function syncBadges(eff) {
      sourceBadge.textContent = eff.imageSource === "url" ? "URL" : eff.imageSource === "upload" ? "Upload" : "Unsplash";
      scopeBadge.textContent = isChatScoped() ? `This chat (${currentChatId.slice(0, 8)}…)` : "Global";
      perChatHint.textContent = globalSettings.perChatEnabled
        ? (currentChatId ? "ON: image settings are saved per chat." : "ON: (you’re not in a chat page right now)")
        : "OFF: same background everywhere.";
    }

    function splitPatch(patch) {
      const g = {};
      const c = {};
      for (const [k, v] of Object.entries(patch)) {
        if (GLOBAL_ONLY_KEYS.has(k)) g[k] = v;
        else if (CHAT_KEYS.has(k)) c[k] = v;
        else g[k] = v;
      }
      return { globalPatch: g, chatPatch: c };
    }

    function commit(patch, toastMsg) {
      const { globalPatch, chatPatch } = splitPatch(patch);

      // Always apply global patch
      if (Object.keys(globalPatch).length) {
        globalSettings = migrateSettings({ ...globalSettings, ...globalPatch });
        saveGlobalSettings(globalSettings);
      }

      // Apply chat patch only if we're in chat scope
      if (Object.keys(chatPatch).length) {
        if (isChatScoped()) {
          const prev = loadChatOverrides(currentChatId);
          saveChatOverrides(currentChatId, { ...prev, ...chatPatch });
        } else {
          // If not chat scoped, treat chat keys as global edits (so UI doesn't feel broken)
          globalSettings = migrateSettings({ ...globalSettings, ...chatPatch });
          saveGlobalSettings(globalSettings);
        }
      }

      if (toastMsg) showToast(toastMsg);
      requestApply();
      syncInputsFromState();
    }

    function openPanel() {
      panel.classList.add("open");
      syncInputsFromState();
    }
    function closePanel() {
      panel.classList.remove("open");
    }

    async function syncInputsFromState() {
      // refresh route context (in case SPA nav happened)
      currentChatId = getChatIdFromUrl();

      const eff = getEffectiveSettings();

      pickTab(eff.imageSource);
      syncBadges(eff);

      // URL
      imgUrl.value = eff.imageUrl || "";

      // Upload status
      if (eff.uploadImageId) uploadStatus.textContent = `Selected: ${eff.uploadImageName || eff.uploadImageId}`;
      else uploadStatus.textContent = "No image uploaded/selected.";

      // Unsplash key UI: don't reveal
      const key = await loadUnsplashKey();
      unsplashKey.value = key ? "••••••••••••••••" : "";
      unsplashStatus.textContent = key ? "Ready. Search or browse." : "Enter a key to search.";
      renderUnsplashCredit(eff);

      // Common (NOTE: overlay/attachment/position/type are per-chat overridable)
      overlay.value = String(clamp(Number(eff.overlayOpacity ?? 0.35), 0, 1));
      overlayVal.textContent = `Overlay: ${Math.round(Number(overlay.value) * 100)}%`;
      attach.value = eff.attachment === "scroll" ? "scroll" : "fixed";
      type.value = eff.imageType || "Stretch";
      pos.value = eff.position || "center center";

      // Global-only
      enabled.checked = !!globalSettings.enabled;
      perChat.checked = !!globalSettings.perChatEnabled;
      blurUI.checked = !!globalSettings.blurBehindUI;
      dimUI.checked = !!globalSettings.dimUI;
    }

    function renderUnsplashCredit(eff) {
      const sel = eff.unsplashSelected;
      if (!sel) { unsplashCredit.textContent = ""; return; }
      const profile = sel.userProfile ? ` — ${sel.userProfile}` : "";
      unsplashCredit.textContent = `${sel.attributionText}${profile}`;
    }

    // Open/close
    btn.addEventListener("click", () => panel.classList.contains("open") ? closePanel() : openPanel());
    closeBtn.addEventListener("click", closePanel);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
    });

    // Tabs set imageSource (chat-scoped if enabled)
    tabUrlBtn.addEventListener("click", () => commit({ imageSource: "url" }, "Source: URL"));
    tabUploadBtn.addEventListener("click", () => commit({ imageSource: "upload" }, "Source: Upload"));
    tabUnsplashBtn.addEventListener("click", () => commit({ imageSource: "unsplash" }, "Source: Unsplash"));

    // URL input
    imgUrl.addEventListener("input", () => {
      const v = imgUrl.value.trim();
      if (!looksLikeUrl(v)) return showToast("That doesn’t look like a usable URL.");
      commit({ imageUrl: v, imageSource: "url" }, "Updated URL");
    });

    // Upload
    pickUploadBtn.addEventListener("click", () => uploadInput.click());
    uploadInput.addEventListener("change", async () => {
      const file = uploadInput.files?.[0];
      uploadInput.value = "";
      if (!file) return;

      try {
        const meta = await storeUploadedFile(file);
        commit({ uploadImageId: meta.id, uploadImageName: meta.name || meta.id, imageSource: "upload" }, "Uploaded & selected");
      } catch (e) {
        showToast(`Upload failed: ${String(e?.message || e)}`);
      }
    });

    deleteUploadBtn.addEventListener("click", async () => {
      const eff = getEffectiveSettings();
      const id = eff.uploadImageId;
      if (!id) return showToast("Nothing to delete.");

      try { await idbDelete(STORE_IMAGES, id); } catch {}

      if (uploadObjectUrl) {
        try { URL.revokeObjectURL(uploadObjectUrl); } catch {}
        uploadObjectUrl = null;
        uploadObjectUrlId = null;
      }

      // delete stored upload + unselect
      commit({ uploadImageId: null, uploadImageName: "" }, "Deleted upload");
    });

    // Unsplash key
    saveUnsplashKeyBtn.addEventListener("click", async () => {
      const raw = unsplashKey.value.trim();
      if (!raw || raw.startsWith("•")) {
        const existing = await loadUnsplashKey();
        if (existing) return showToast("Key already saved.");
        return showToast("Paste the actual key first.");
      }
      await saveUnsplashKey(raw);
      unsplashKey.value = "••••••••••••••••";
      showToast("Unsplash key saved");
      unsplashStatus.textContent = "Saved. Search or browse.";
    });

    async function runUnsplash(query, mode) {
      unsplashStatus.textContent = "Loading…";
      unsplashResults.innerHTML = "";

      try {
        const k = await loadUnsplashKey();
        if (!k) throw new Error("No access key saved.");

        const data = mode === "browse" ? await unsplashBrowse() : await unsplashSearch(query);
        const items = Array.isArray(data) ? data : (data?.results || []);
        if (!items.length) { unsplashStatus.textContent = "No results."; return; }

        unsplashStatus.textContent = `${items.length} results. Click to select.`;
        renderUnsplashResults(items.map(normalizeUnsplashItem));
      } catch (e) {
        unsplashStatus.textContent = "Failed.";
        showToast(String(e?.message || e));
      }
    }

    function renderUnsplashResults(items) {
      const eff = getEffectiveSettings();
      const selectedId = eff.unsplashSelected?.id || null;

      unsplashResults.innerHTML = "";
      items.forEach((it) => {
        const div = document.createElement("div");
        div.className = "card" + (it.id === selectedId ? " selected" : "");
        div.innerHTML = `
          <img alt="" src="${it.thumbUrl.replace(/"/g, "&quot;")}" />
          <div class="selectGlow"></div>
        `;
        div.addEventListener("click", async () => {
          commit({ unsplashSelected: it, imageSource: "unsplash" }, "Selected Unsplash image");
          if (it.downloadLocation) await unsplashTrackDownload(it.downloadLocation);
          // highlight
          [...unsplashResults.querySelectorAll(".card")].forEach((c) => c.classList.remove("selected"));
          div.classList.add("selected");
        });
        unsplashResults.appendChild(div);
      });
    }

    unsplashSearchBtn.addEventListener("click", () => runUnsplash(unsplashQuery.value.trim(), "search"));
    unsplashBrowseBtn.addEventListener("click", () => runUnsplash("", "browse"));
    unsplashQuery.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runUnsplash(unsplashQuery.value.trim(), "search");
    });

    // Common controls
    overlay.addEventListener("input", () => {
      overlayVal.textContent = `Overlay: ${Math.round(Number(overlay.value) * 100)}%`;
      commit({ overlayOpacity: clamp(Number(overlay.value), 0, 1) });
    });
    attach.addEventListener("change", () => commit({ attachment: attach.value }, "Attachment updated"));
    type.addEventListener("change", () => commit({ imageType: type.value }, "Mode updated"));
    pos.addEventListener("input", () => commit({ position: pos.value.trim() || "center center" }));

    // Global-only toggles
    enabled.addEventListener("change", () => commit({ enabled: enabled.checked }, enabled.checked ? "Enabled" : "Disabled"));

    perChat.addEventListener("change", () => {
      commit({ perChatEnabled: perChat.checked }, perChat.checked ? "Per-chat enabled" : "Per-chat disabled");
      // When flipping, resync and reapply immediately
      syncInputsFromState();
      requestApply();
    });

    blurUI.addEventListener("change", () => commit({ blurBehindUI: blurUI.checked }, "UI blur updated"));
    dimUI.addEventListener("change", () => commit({ dimUI: dimUI.checked }, "Panel dim updated"));

    // Clear image (scope-aware via commit split)
    clearBtn.addEventListener("click", () => {
      const eff = getEffectiveSettings();
      if (eff.imageSource === "url") return commit({ imageUrl: "" }, "Cleared URL");
      if (eff.imageSource === "unsplash") return commit({ unsplashSelected: null }, "Cleared Unsplash selection");
      if (eff.imageSource === "upload") return commit({ uploadImageId: null, uploadImageName: "" }, "Unselected upload");
    });

    // Reset:
    // - If per-chat enabled and in chat => reset THIS chat overrides (back to global)
    // - Else reset global settings (keep Unsplash key)
    resetBtn.addEventListener("click", () => {
      if (isChatScoped()) {
        clearChatOverrides(currentChatId);
        showToast("Reset this chat to global defaults");
        syncInputsFromState();
        requestApply();
      } else {
        const keepKey = globalSettings.perChatEnabled; // not a secret, just preference
        globalSettings = migrateSettings({ ...DEFAULTS, perChatEnabled: keepKey });
        saveGlobalSettings(globalSettings);
        showToast("Reset global settings");
        syncInputsFromState();
        requestApply();
      }
    });

    // Export / Import
    exportBtn.addEventListener("click", async () => {
      try {
        const exportObj = await buildExportObject();
        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cai-bg-customizer-export-v${VERSION}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        showToast("Exported (global + per-chat + uploads + key)");
      } catch (e) {
        showToast(`Export failed: ${String(e?.message || e)}`);
      }
    });

    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", async () => {
      const file = importInput.files?.[0];
      importInput.value = "";
      if (!file) return;

      try {
        const txt = await file.text();
        await importFromObject(JSON.parse(txt));
        showToast("Imported settings");
        syncInputsFromState();
        requestApply();
      } catch (e) {
        showToast(`Import failed: ${String(e?.message || e)}`);
      }
    });

    // initial sync
    syncInputsFromState();
  }

  /** ---------------------------
   *  Resilience: observer + SPA nav
   *  --------------------------- */
  let observer = null;

  function startObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver(() => {
      if (!document.getElementById(UI_HOST_ID)) ensureUI();

      // Refresh chat id (SPA can change it)
      const nextChatId = getChatIdFromUrl();
      if (nextChatId !== currentChatId) {
        currentChatId = nextChatId;
        requestApply();
      }

      const target = findAppContainer();
      if (target && !target.classList.contains("cai-bg-target")) target.classList.add("cai-bg-target");

      if (!document.getElementById(STYLE_ID)) requestApply();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function hookHistory() {
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;

    function onNav() {
      setTimeout(() => {
        globalSettings = loadGlobalSettings(); // pick up any changes
        const nextChatId = getChatIdFromUrl();
        currentChatId = nextChatId;
        ensureUI();
        requestApply();
      }, 60);
    }

    history.pushState = function (...args) {
      const out = _pushState.apply(this, args);
      onNav();
      return out;
    };
    history.replaceState = function (...args) {
      const out = _replaceState.apply(this, args);
      onNav();
      return out;
    };
    window.addEventListener("popstate", onNav);
  }

  /** ---------------------------
   *  Boot
   *  --------------------------- */
  function boot() {
    ensureUI();
    requestApply();
    startObserver();
    hookHistory();
  }

  boot();
})();

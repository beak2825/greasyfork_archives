// ==UserScript==
// @name        Dynamic NQ
// @namespace   seq.wtf
// @match       *://mppclone.com/*
// @match       *://mpp.8448.space/*
// @match       *://multiplayerpiano.net/*
// @match       *://multiplayerpiano.org/*
// @match       *://beta-mpp.cedms.jp/*
// @match       *://beta-mpp.csys64.com/*
// @match       *://mpp.terrium.net/*
// @match       *://mppfork.netlify.app/*
// @match       *://mpp.hri7566.info/*
// @match       *://www.multiplayerpiano.dev/*
// @match       *://mc.hri7566.info:8080/*
// @match       *://mpp176.tk/*
// @match       *://piano.ourworldofpixels.com/*
// @match       *://mpp.lapishusky.dev/*
// @match       *://mpp.hyye.tk/*
// @match       *://openmpp.tk/*
// @match       *://staging-mpp.sad.ovh/*
// @run-at      document-start
// @grant       none
// @version     1.0.2
// @author      Seq
// @description Smoother Note Quota for MPP
// @license     Beerware
// @downloadURL https://update.greasyfork.org/scripts/546476/Dynamic%20NQ.user.js
// @updateURL https://update.greasyfork.org/scripts/546476/Dynamic%20NQ.meta.js
// ==/UserScript==

class NoteQuota {
  // allowance and maxHistLen are unused but kept for backwards compatibility
  static PARAMS_LOBBY = { allowance: 200, max: 600, maxHistLen: 3 };
  static PARAMS_NORMAL = { allowance: 400, max: 1200, maxHistLen: 3 };
  static PARAMS_RIDICULOUS = { allowance: 600, max: 1800, maxHistLen: 3 };
  static PARAMS_OFFLINE = { allowance: 8000, max: 24000, maxHistLen: 3 };
  static PARAMS_UNLIMITED = { allowance: 1000000, max: 3000000, maxHistLen: 3 };
  static PARAMS_INFINITE = { allowance: Infinity, max: Infinity, maxHistLen: 3 };

  #points = 0;
  #cachedPoints = 0;
  #regenRate = 0; // pts/ms; dynamic based on max
  #cacheTimestamp = 0; // 0 = invalid
  #lastUpdateTimestamp = 0;

  #recalc(timestamp) {
    const timeElapsed = timestamp - this.#lastUpdateTimestamp;
    const regeneratedPoints = timeElapsed > 0 ? timeElapsed * this.#regenRate : 0;
    return Math.min(this.#points + regeneratedPoints, this.max);
  }

  constructor(cb, params) {
    // this.cb = cb; // UPDATES MANUALLY -> updateQuotaBar()
    this.max = 0;

    this.CACHE_DURATION_MS = 10;

    this.setParams(params);
  }

  get points() {
    const now = Date.now();

    if (this.#cacheTimestamp > 0 && now - this.#cacheTimestamp < this.CACHE_DURATION_MS) {
      return this.#cachedPoints;
    }

    const currentPoints = this.#recalc(now);

    // prime cache
    this.#cachedPoints = currentPoints;
    this.#cacheTimestamp = now;

    return currentPoints;
  }

  getParams() {
    return {
      m: "nq",
      allowance: this.max / 3,
      max: this.max,
      maxHistLen: 3
    };
  }

  setParams(params) {
    params = params || NoteQuota.PARAMS_OFFLINE;
    const max = params.max || this.max || NoteQuota.PARAMS_OFFLINE.max;

    if (max !== this.max) {
      this.max = max;
      this.#regenRate = max / 6000;
      this.resetPoints();
      return true;
    }
    return false;
  }

  resetPoints() {
    this.#points = this.max;
    this.#lastUpdateTimestamp = Date.now();

    // invalidate cache
    // priming would also work, but this is rarely called,
    // so invalidating is acceptable
    this.#cacheTimestamp = 0;

    if (this.cb) this.cb(this.points);
  }

  spend(needed) {
    const now = Date.now();

    // saves a Date.now() call over just using this.points
    const currentPoints = this.#recalc(now);

    if (currentPoints < needed) return false;

    this.#points = currentPoints - needed;
    this.#lastUpdateTimestamp = now;

    // prime cache
    this.#cachedPoints = this.#points;
    this.#cacheTimestamp = now;

    if (this.cb) this.cb(this.#points);
    return true;
  }

  // legacy
  tick() {
    // the MPP client will call this every two seconds
    // do nothing
  }

  get allowance() {
    return this.max / 3;
  }

  get maxHistLen() {
    return 3;
  }

  get history() {
    const p = this.points;
    return [p, p, p];
  }
}

// trap the NoteQuota definition
let patched = false;
Object.defineProperty(window, "NoteQuota", {
  configurable: true,
  enumerable: true,
  get: () => NoteQuota,
  set: () => {
    patched = true;
    delete window.NoteQuota;
    window.NoteQuota = NoteQuota;
  }
});

// very cursed race condition fallback
// (the MPP object could become initialized before we get the chance to hijack the NoteQuota object)
const fallbackInterval = setInterval(() => {
  if (patched || window.MPP?.noteQuota?.CACHE_DURATION_MS) return clearInterval(fallbackInterval); // patched successfully
  if (!window.MPP?.noteQuota) return; // not initialized yet

  console.warn("[DynamicNQ] Race condition lost! Post-patching...");

  const originalInstance = window.MPP.noteQuota;
  const customInstance = new NoteQuota(originalInstance.cb);

  const customProps = new Set([
    ...Object.getOwnPropertyNames(customInstance),
    ...Object.getOwnPropertyNames(NoteQuota.prototype)
  ]);

  for (const prop of customProps) {
    if (prop === "constructor") continue;

    const descriptor = Object.getOwnPropertyDescriptor(customInstance, prop) ||
                       Object.getOwnPropertyDescriptor(NoteQuota.prototype, prop);

    if (typeof descriptor.value === 'function') {
      originalInstance[prop] = descriptor.value.bind(customInstance);
    } else {
      Object.defineProperty(originalInstance, prop, {
        configurable: true,
        get: () => customInstance[prop],
        set: v => customInstance[prop] = v,
      });
    }
  }

  delete originalInstance.cb;

  patched = true;
  clearInterval(fallbackInterval);
});

let nqBar = null;
(function updateQuotaBar() {
  window.requestAnimationFrame(updateQuotaBar);
  if (!window.$ || !window.MPP?.noteQuota) return;
  if (!nqBar) nqBar = $("#quota .value");
  const nq = window.MPP.noteQuota;
  nqBar.css("width", `${(nq.points / nq.max) * 100}%`);
})();
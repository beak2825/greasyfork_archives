// ==UserScript==
// @name         WuolahExtra
// @namespace    Violentmonkey Scripts
// @version      1.4.2
// @author       Pablo Ferreiro
// @description  UserScript para Wuolah
// @license      MIT
// @homepage     https://github.com/pablouser1/WuolahExtra
// @homepageURL  https://github.com/pablouser1/WuolahExtra
// @match        https://wuolah.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      data:application/javascript,window.GM_config%3DGM_config
// @require      https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @resource     gulag-wasm  https://cdn.jsdelivr.net/npm/gulagcleaner_wasm@0.12.2/gulagcleaner_wasm_bg.wasm
// @grant        GM.addStyle
// @grant        GM.getResourceUrl
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/487195/WuolahExtra.user.js
// @updateURL https://update.greasyfork.org/scripts/487195/WuolahExtra.meta.js
// ==/UserScript==

(function (pdfLib) {
  'use strict';

  // src/native/alias.ts
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var _monkeyWindow = /* @__PURE__ */ (() => window)();

  var ClearMethods = /* @__PURE__ */ ((ClearMethods2) => {
    ClearMethods2["NONE"] = "none";
    ClearMethods2["PARAMS"] = "params";
    ClearMethods2["GULAG"] = "gulag";
    ClearMethods2["PDFLIB"] = "pdflib";
    return ClearMethods2;
  })(ClearMethods || {});

  var Log = /* @__PURE__ */ ((Log2) => {
    Log2[Log2["DEBUG"] = 0] = "DEBUG";
    Log2[Log2["INFO"] = 1] = "INFO";
    return Log2;
  })(Log || {});

  let wasm;

  let cachedUint8Memory0 = null;

  function getUint8Memory0() {
      if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
          cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
      }
      return cachedUint8Memory0;
  }

  let WASM_VECTOR_LEN = 0;

  function passArray8ToWasm0(arg, malloc) {
      const ptr = malloc(arg.length * 1, 1) >>> 0;
      getUint8Memory0().set(arg, ptr / 1);
      WASM_VECTOR_LEN = arg.length;
      return ptr;
  }

  let cachedInt32Memory0 = null;

  function getInt32Memory0() {
      if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
          cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
      }
      return cachedInt32Memory0;
  }

  function getArrayU8FromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
  }
  /**
  * @param {Uint8Array} data
  * @param {boolean} force_naive
  * @returns {Uint8Array}
  */
  function clean_pdf(data, force_naive) {
      try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
          const len0 = WASM_VECTOR_LEN;
          wasm.clean_pdf(retptr, ptr0, len0, force_naive);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var v2 = getArrayU8FromWasm0(r0, r1).slice();
          wasm.__wbindgen_free(r0, r1 * 1, 1);
          return v2;
      } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
      }
  }

  function __wbg_get_imports() {
      const imports = {};
      imports.wbg = {};

      return imports;
  }

  function __wbg_finalize_init(instance, module) {
      wasm = instance.exports;
      cachedInt32Memory0 = null;
      cachedUint8Memory0 = null;


      return wasm;
  }

  function initSync(module) {
      if (wasm !== undefined) return wasm;

      const imports = __wbg_get_imports();

      if (!(module instanceof WebAssembly.Module)) {
          module = new WebAssembly.Module(module);
      }

      const instance = new WebAssembly.Instance(module, imports);

      return __wbg_finalize_init(instance);
  }

  class Misc {
    static logValues = Object.values(Log);
    static log(msg, mode = Log.DEBUG) {
      const data = `[WuolahExtra] (${Misc.logValues[mode]}) ${msg}`;
      switch (mode) {
        case Log.DEBUG:
          if (c$1().get("debug")) {
            console.debug(data);
          }
          break;
        case Log.INFO:
          console.log(data);
          break;
      }
    }
    static getPath(url_str) {
      try {
        const url = new URL(url_str);
        const path = url.pathname;
        return path;
      } catch {
        return url_str;
      }
    }
    static isPdf(data) {
      const arr = new Uint8Array(data).subarray(0, 5);
      let header = "";
      for (const b of arr) {
        header += b.toString(16);
      }
      return header === "255044462d";
    }
    static async initGulag() {
      Misc.log("Injecting WASM", Log.DEBUG);
      const url = await _GM.getResourceUrl("gulag-wasm");
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      initSync(buf);
    }
  }

  const { createObjectURL: origcreateObjectURL } = window.URL;
  const openBlob = (obj) => {
    const url = origcreateObjectURL(obj);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.click();
  };
  const clearGulag = (buf) => {
    return clean_pdf(new Uint8Array(buf), false);
  };
  const clearPDFLib = async (buf) => {
    const doc = await pdfLib.PDFDocument.load(buf);
    doc.removePage(0);
    const data = await doc.save();
    return data;
  };
  const objectURLWrapper = (obj) => {
    if (!(obj instanceof Blob && obj.type === "application/octet-stream")) {
      return origcreateObjectURL(obj);
    }
    obj.arrayBuffer().then(async (buf) => {
      if (!Misc.isPdf(buf)) {
        openBlob(obj);
        return;
      }
      Misc.log("Limpiando documento", Log.INFO);
      let data;
      const clearMethod = c$1().get("clear_pdf").toString();
      switch (clearMethod) {
        case ClearMethods.PDFLIB:
          data = await clearPDFLib(buf);
          break;
        case ClearMethods.GULAG:
          data = clearGulag(buf);
          break;
        default:
          alert("Invalid clear method! Fallback to original pdf");
          data = buf;
      }
      const newBlob = new Blob([data]);
      openBlob(newBlob);
    });
    return "javascript:void(0)";
  };

  const clean_ui = "#social-community{display:none}#community_layout main div.css-4p83pq,#community_layout main hr,#community_layout main div.chakra-stack.css-n21gh5,#community_layout main div.css-8nthb6{display:none}#subject_layout div.chakra-stack.css-vhl2wk,#subject_layout div.css-l0afcj{display:none}";

  const addOptions = () => {
    _GM.registerMenuCommand(
      "Configuración",
      () => c$1().open(),
      "c"
    );
  };
  const cleanUI = () => _GM.addStyle(clean_ui);

  let _c;
  const init = (fetchHook) => {
    _c = _monkeyWindow.GM_config({
      id: "wuolahextra",
      fields: {
        debug: {
          type: "checkbox",
          label: "Modo debugging",
          default: false
        },
        clear_pdf: {
          type: "select",
          label: "Método de limpieza de PDF",
          options: Object.values(ClearMethods),
          default: ClearMethods.GULAG
        },
        clean_ui: {
          type: "checkbox",
          label: "Limpia distracciones en la interfaz",
          default: false
        },
        no_analytics: {
          type: "checkbox",
          label: "Desactivar analíticas",
          default: true
        }
      },
      events: {
        init: () => {
          if (_c.get("debug")) {
            fetchHook.setDebug(true);
          }
          const clearMethod = _c.get("clear_pdf").toString();
          if (clearMethod === ClearMethods.PDFLIB || clearMethod === ClearMethods.GULAG) {
            Misc.log("Overriding createObjectURL", Log.DEBUG);
            _unsafeWindow.URL.createObjectURL = objectURLWrapper;
          }
          if (_c.get("clean_ui")) {
            Misc.log("Injecting CSS", Log.DEBUG);
            cleanUI();
          }
          if (clearMethod === ClearMethods.GULAG) {
            Misc.initGulag();
          }
        },
        save: () => {
          const ok = confirm("Los cambios se han guardado, ¿quieres refrescar la página para aplicar los cambios?");
          if (ok) {
            window.location.reload();
          }
        }
      }
    });
  };
  const c = () => _c;
  const c$1 = c;

  class Hooks {
    static BEFORE = [
      {
        id: "force-download",
        endpoint: /^\/v2\/download$/,
        func: Hooks.forceOldDownload,
        cond: () => c$1().get("clear_pdf").toString() === ClearMethods.PARAMS
      },
      {
        id: "no-analytics",
        endpoint: /^\/v2\/events$/,
        func: Hooks.noAnalytics,
        cond: () => c$1().get("no_analytics")
      }
    ];
    static AFTER = [
      {
        id: "make-pro",
        endpoint: /^\/v2\/me$/,
        func: Hooks.makePro
      },
      {
        id: "no-ui-ads",
        endpoint: /^\/v2\/a-d-s$/,
        func: Hooks.noUiAds,
        cond: () => c$1().get("clean_ui")
      }
    ];
    // -- Before -- //
    static forceOldDownload(input, init) {
      Misc.log("Redirecting download to old endpoint", Log.INFO);
      if (!(init && init.body)) {
        Misc.log("No body on forceOldDownload", Log.DEBUG);
        return;
      }
      if (!(input instanceof URL)) {
        Misc.log("Input on forceOldDownload is not URL", Log.DEBUG);
        return;
      }
      const oldBody = JSON.parse(init.body.toString());
      input.pathname = `/v2/documents/${oldBody.fileId}/download`;
      const newBody = {
        "source": "W3",
        "premium": 1,
        "blocked": true,
        "ubication17ExpectedPubs": 0,
        "ubication1ExpectedPubs": 0,
        "ubication2ExpectedPubs": 0,
        "ubication3ExpectedPubs": 0,
        "ubication17RequestedPubs": 0,
        "ubication1RequestedPubs": 0,
        "ubication2RequestedPubs": 0,
        "ubication3RequestedPubs": 0
      };
      init.body = JSON.stringify(newBody);
    }
    static noAnalytics(_input, init) {
      if (init) {
        Misc.log("Removing events", Log.INFO);
        init.body = JSON.stringify({
          events: []
        });
      }
    }
    // -- After -- //
    static makePro(res) {
      if (res.ok) {
        Misc.log("Making user client-side pro V2", Log.INFO);
        const json = () => res.clone().json().then((d) => ({ ...d, isPro: true }));
        res.json = json;
      }
    }
    static noUiAds(res) {
      if (res.ok) {
        Misc.log("Wiping ui ads array", Log.INFO);
        const json = async () => {
          return { items: [] };
        };
        res.json = json;
      }
    }
  }

  const { fetch: origFetch } = window;
  class FetchHook {
    debug = false;
    before = [];
    after = [];
    addHooks(h) {
      if (h.before !== void 0) {
        this.before = h.before;
      }
      if (h.after !== void 0) {
        this.after = h.after;
      }
    }
    async entrypoint(input, init) {
      if (typeof input === "string" && input.includes("/v2/download")) {
        input = new URL(input);
      }
      this.beforeHandler(input, init);
      const res = await origFetch(input, init);
      this.afterHandler(res);
      return res;
    }
    setDebug(debug) {
      this.debug = debug;
    }
    beforeHandler(input, init) {
      const path = Misc.getPath(input.toString());
      const h = this.before.find((item) => this._finder(item, path));
      if (h !== void 0) {
        if (this.debug) {
          console.log(`${h.id} PRE`, { input, init });
        }
        h.func(input, init);
        if (this.debug) {
          console.log(`${h.id} POST`, { input, init });
        }
      }
    }
    afterHandler(res) {
      const path = Misc.getPath(res.url);
      const h = this.after.find((item) => this._finder(item, path));
      if (h !== void 0) {
        if (this.debug) {
          console.log(`${h.id} PRE`, { res });
        }
        h.func(res);
        if (this.debug) {
          console.log(`${h.id} POST`, { res });
        }
      }
    }
    _finder(item, path) {
      const found = item.endpoint.test(path);
      if (found) {
        return item.cond === void 0 ? true : item.cond();
      }
      return false;
    }
  }

  Misc.log("STARTING", Log.INFO);
  const fetchHook = new FetchHook();
  fetchHook.addHooks({
    before: Hooks.BEFORE,
    after: Hooks.AFTER
  });
  init(fetchHook);
  _unsafeWindow.fetch = (...args) => fetchHook.entrypoint(...args);
  addOptions();

})(PDFLib);
// ==UserScript==
// @name         超星学习通助手，自动跳转任务点，自动答题超全题库ai答题，视频，章节测试，考试自动处理
// @namespace    helper
// @version      2.1.2
// @author       helper
// @description  学习助手-支持学习通，目前已完成：视频自动播放，自动切换任务点，deepseek智能AI赋能，章节测试，作业自动完成，期末考试处理，自动保存
// @match        *://*.chaoxing.com/*
// @resource     Table  https://www.forestpolice.org/ttf/2.0/table.json
// @connect      autohelper.top
// @connect      localhost
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536403/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%BB%BB%E5%8A%A1%E7%82%B9%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93ai%E7%AD%94%E9%A2%98%EF%BC%8C%E8%A7%86%E9%A2%91%EF%BC%8C%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%EF%BC%8C%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/536403/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%BB%BB%E5%8A%A1%E7%82%B9%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93ai%E7%AD%94%E9%A2%98%EF%BC%8C%E8%A7%86%E9%A2%91%EF%BC%8C%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%EF%BC%8C%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const a=document.createElement("style");a.textContent=t,document.head.append(a)})(' @charset "UTF-8";.draggable-dialog[data-v-f537400f]{width:400px;position:fixed;top:0;left:0;background-color:#fff;border-radius:8px;box-shadow:0 4px 12px #00000026;overflow:hidden;z-index:1000}.draggable-dialog .draggable-title[data-v-f537400f]{cursor:move;display:flex;height:56px;line-height:56px;background:#4a90e2}.draggable-dialog .draggable-title .avatar-name[data-v-f537400f]{font-size:18px;font-weight:700;font-family:Roboto;font-weight:600;letter-spacing:0px;font-feature-settings:"kern" on;color:#fff;margin:4px 4px 0 16px}.draggable-dialog .draggable-title .header-settings[data-v-f537400f]{color:#fff;margin-top:20px}.draggable-dialog .draggable-title .header-settings .tips[data-v-f537400f]{width:18px;height:18px;cursor:pointer;font-size:14px}.draggable-dialog .main-content[data-v-f537400f]{background:#0000}.tab-bar[data-v-ba63fdae]{display:flex;gap:8px;width:100%;padding:9px 8px;box-sizing:border-box}.tab-bar .tab-bar-item[data-v-ba63fdae]{flex:1;display:flex;align-items:center;justify-content:center;gap:4px;cursor:pointer;padding:6px 12px;border-radius:4px;text-align:center;font-size:14px;line-height:21px}.tab-bar .tab-bar-item[data-v-ba63fdae]:hover,.tab-bar .tab-bar-item.active[data-v-ba63fdae]{background-color:#e6f7ff;color:#4a90e2}.content-body[data-v-ba63fdae]{padding:12px;box-sizing:border-box;background-color:#f5f5f5}.body-box[data-v-ba63fdae]{border-radius:8px;opacity:1;display:flex;flex-direction:column;padding:12px;gap:0px 10px;flex-wrap:wrap;align-content:flex-start;background:linear-gradient(0deg,#0000,#0000),#fff;box-shadow:0 1px 3px #0000001a}.card-title[data-v-ba63fdae]{display:flex;align-items:center;gap:4px;font-family:Roboto;font-size:14px;font-weight:600;line-height:21px;letter-spacing:0px;font-feature-settings:"kern" on;color:#333;margin-bottom:8px}.start-parse[data-v-ba63fdae]{cursor:pointer;height:40px;line-height:40px;border-radius:4px;opacity:1;margin:18px 0;background:#3b82f6;font-size:14px;font-weight:500;text-align:center;letter-spacing:0px;color:#fff}.log-generation[data-v-ba63fdae]{box-sizing:border-box;box-shadow:0 1px 3px #0000001a;background:linear-gradient(0deg,#0000,#0000),#fff;margin-top:16px}.log-generation .log-generation-content[data-v-ba63fdae]{width:100%;max-height:120px;overflow-y:auto}.log-generation .log-generation-content[data-v-ba63fdae]::-webkit-scrollbar{width:2px}.log-generation .value[data-v-ba63fdae]{color:#000;font-size:13px;font-weight:400;line-height:20px;letter-spacing:0px;font-feature-settings:"kern" on;font-family:Roboto}.settings-main[data-v-ba63fdae]{width:100%;display:flex;flex-direction:column;gap:10px}.settings-section[data-v-ba63fdae]{width:100%;display:flex;align-items:center}.settings-section .settings-switch[data-v-ba63fdae]{margin-left:auto}.settings-section .title[data-v-ba63fdae]{display:flex;flex-direction:column;gap:4px}.settings-section .title .title-text[data-v-ba63fdae]{background:#0000;opacity:1;font-family:Roboto;font-size:14px;font-weight:400;letter-spacing:0px;font-feature-settings:"kern" on;color:#000}.settings-section .title .sub-title[data-v-ba63fdae]{opacity:1;font-family:Roboto;font-size:12px;font-weight:400;line-height:18px;letter-spacing:0px;font-feature-settings:"kern" on;color:#666}.guide .guide-content[data-v-ba63fdae]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.guide .guide-content .guide-content-item[data-v-ba63fdae]{display:flex;align-items:start;gap:10px}.guide .guide-content .guide-content-item .guide-content-index[data-v-ba63fdae]{width:20px;height:20px;text-align:center;line-height:20px;border-radius:50%;background-color:#e6f7ff;color:#53aeed}.guide .guide-content .guide-content-item .guide-content-content[data-v-ba63fdae]{flex:1;color:#333;font-size:13px}.guide .section p[data-v-ba63fdae]{line-height:24px;color:#303133}.guide .tip[data-v-ba63fdae]{margin:10px 0}.guide .tip .title[data-v-ba63fdae]{font-weight:700;margin-bottom:10px}.guide .tip p[data-v-ba63fdae]{color:#dc3545}.keys .userinfo[data-v-ba63fdae]{margin:20px 0 0}.keys .userinfo .el-row[data-v-ba63fdae]{margin-bottom:10px}.keys .validate-key[data-v-ba63fdae]{margin:10px 0 0;display:flex;gap:10px}.keys .key-btn[data-v-ba63fdae]{cursor:pointer;width:100%;margin:18px auto} ');

(function (vue, ElementPlus, pinia$1) {
  'use strict';

  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
  const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
  function jsonParseTransform(key, value) {
    if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
      warnKeyDropped(key);
      return;
    }
    return value;
  }
  function warnKeyDropped(key) {
    console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
  }
  function destr(value, options = {}) {
    if (typeof value !== "string") {
      return value;
    }
    if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
      return value.slice(1, -1);
    }
    const _value = value.trim();
    if (_value.length <= 9) {
      switch (_value.toLowerCase()) {
        case "true": {
          return true;
        }
        case "false": {
          return false;
        }
        case "undefined": {
          return void 0;
        }
        case "null": {
          return null;
        }
        case "nan": {
          return Number.NaN;
        }
        case "infinity": {
          return Number.POSITIVE_INFINITY;
        }
        case "-infinity": {
          return Number.NEGATIVE_INFINITY;
        }
      }
    }
    if (!JsonSigRx.test(value)) {
      if (options.strict) {
        throw new SyntaxError("[destr] Invalid JSON");
      }
      return value;
    }
    try {
      if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
        if (options.strict) {
          throw new Error("[destr] Possible prototype pollution");
        }
        return JSON.parse(value, jsonParseTransform);
      }
      return JSON.parse(value);
    } catch (error) {
      if (options.strict) {
        throw error;
      }
      return value;
    }
  }
  function get(obj, path) {
    if (obj == null)
      return void 0;
    let value = obj;
    for (let i = 0; i < path.length; i++) {
      if (value == null || value[path[i]] == null)
        return void 0;
      value = value[path[i]];
    }
    return value;
  }
  function set(obj, value, path) {
    if (path.length === 0)
      return value;
    const idx = path[0];
    if (path.length > 1) {
      value = set(
        typeof obj !== "object" || obj === null || !Object.prototype.hasOwnProperty.call(obj, idx) ? Number.isInteger(Number(path[1])) ? [] : {} : obj[idx],
        value,
        Array.prototype.slice.call(path, 1)
      );
    }
    if (Number.isInteger(Number(idx)) && Array.isArray(obj))
      return obj.slice()[idx];
    return Object.assign({}, obj, { [idx]: value });
  }
  function unset(obj, path) {
    if (obj == null || path.length === 0)
      return obj;
    if (path.length === 1) {
      if (obj == null)
        return obj;
      if (Number.isInteger(path[0]) && Array.isArray(obj))
        return Array.prototype.slice.call(obj, 0).splice(path[0], 1);
      const result = {};
      for (const p in obj)
        result[p] = obj[p];
      delete result[path[0]];
      return result;
    }
    if (obj[path[0]] == null) {
      if (Number.isInteger(path[0]) && Array.isArray(obj))
        return Array.prototype.concat.call([], obj);
      const result = {};
      for (const p in obj)
        result[p] = obj[p];
      return result;
    }
    return set(
      obj,
      unset(
        obj[path[0]],
        Array.prototype.slice.call(path, 1)
      ),
      [path[0]]
    );
  }
  function deepPickUnsafe(obj, paths) {
    return paths.map((p) => p.split(".")).map((p) => [p, get(obj, p)]).filter((t) => t[1] !== void 0).reduce((acc, cur) => set(acc, cur[1], cur[0]), {});
  }
  function deepOmitUnsafe(obj, paths) {
    return paths.map((p) => p.split(".")).reduce((acc, cur) => unset(acc, cur), obj);
  }
  function hydrateStore(store, {
    storage,
    serializer,
    key,
    debug,
    pick,
    omit,
    beforeHydrate,
    afterHydrate
  }, context, runHooks = true) {
    try {
      if (runHooks)
        beforeHydrate == null ? void 0 : beforeHydrate(context);
      const fromStorage = storage.getItem(key);
      if (fromStorage) {
        const deserialized = serializer.deserialize(fromStorage);
        const picked = pick ? deepPickUnsafe(deserialized, pick) : deserialized;
        const omitted = omit ? deepOmitUnsafe(picked, omit) : picked;
        store.$patch(omitted);
      }
      if (runHooks)
        afterHydrate == null ? void 0 : afterHydrate(context);
    } catch (error) {
      if (debug)
        console.error("[pinia-plugin-persistedstate]", error);
    }
  }
  function persistState(state, {
    storage,
    serializer,
    key,
    debug,
    pick,
    omit
  }) {
    try {
      const picked = pick ? deepPickUnsafe(state, pick) : state;
      const omitted = omit ? deepOmitUnsafe(picked, omit) : picked;
      const toStorage = serializer.serialize(omitted);
      storage.setItem(key, toStorage);
    } catch (error) {
      if (debug)
        console.error("[pinia-plugin-persistedstate]", error);
    }
  }
  function createPersistence(context, optionsParser, auto) {
    const { pinia: pinia2, store, options: { persist = auto } } = context;
    if (!persist)
      return;
    if (!(store.$id in pinia2.state.value)) {
      const originalStore = pinia2._s.get(store.$id.replace("__hot:", ""));
      if (originalStore)
        Promise.resolve().then(() => originalStore.$persist());
      return;
    }
    const persistenceOptions = Array.isArray(persist) ? persist : persist === true ? [{}] : [persist];
    const persistences = persistenceOptions.map(optionsParser);
    store.$hydrate = ({ runHooks = true } = {}) => {
      persistences.forEach((p) => {
        hydrateStore(store, p, context, runHooks);
      });
    };
    store.$persist = () => {
      persistences.forEach((p) => {
        persistState(store.$state, p);
      });
    };
    persistences.forEach((p) => {
      hydrateStore(store, p, context);
      store.$subscribe(
        (_mutation, state) => persistState(state, p),
        { detached: true }
      );
    });
  }
  function createPersistedState(options = {}) {
    return function(context) {
      createPersistence(
        context,
        (p) => ({
          key: (options.key ? options.key : (x) => x)(p.key ?? context.store.$id),
          debug: p.debug ?? options.debug ?? false,
          serializer: p.serializer ?? options.serializer ?? {
            serialize: (data) => JSON.stringify(data),
            deserialize: (data) => destr(data)
          },
          storage: p.storage ?? options.storage ?? window.localStorage,
          beforeHydrate: p.beforeHydrate,
          afterHydrate: p.afterHydrate,
          pick: p.pick,
          omit: p.omit
        }),
        options.auto ?? false
      );
    };
  }
  var src_default = createPersistedState();
  const pinia = pinia$1.createPinia();
  pinia.use(src_default);
  /*! Element Plus Icons Vue v2.3.1 */
  var comment_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Comment",
    __name: "comment",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M736 504a56 56 0 1 1 0-112 56 56 0 0 1 0 112m-224 0a56 56 0 1 1 0-112 56 56 0 0 1 0 112m-224 0a56 56 0 1 1 0-112 56 56 0 0 1 0 112M128 128v640h192v160l224-160h352V128z"
        })
      ]));
    }
  });
  var comment_default = comment_vue_vue_type_script_setup_true_lang_default;
  var key_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Key",
    __name: "key",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M448 456.064V96a32 32 0 0 1 32-32.064L672 64a32 32 0 0 1 0 64H512v128h160a32 32 0 0 1 0 64H512v128a256 256 0 1 1-64 8.064M512 896a192 192 0 1 0 0-384 192 192 0 0 0 0 384"
        })
      ]));
    }
  });
  var key_default = key_vue_vue_type_script_setup_true_lang_default;
  var list_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "List",
    __name: "list",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M704 192h160v736H160V192h160v64h384zM288 512h448v-64H288zm0 256h448v-64H288zm96-576V96h256v96z"
        })
      ]));
    }
  });
  var list_default = list_vue_vue_type_script_setup_true_lang_default;
  var notebook_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Notebook",
    __name: "notebook",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M192 128v768h640V128zm-32-64h704a32 32 0 0 1 32 32v832a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M672 128h64v768h-64zM96 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32"
        })
      ]));
    }
  });
  var notebook_default = notebook_vue_vue_type_script_setup_true_lang_default;
  var operation_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Operation",
    __name: "operation",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M389.44 768a96.064 96.064 0 0 1 181.12 0H896v64H570.56a96.064 96.064 0 0 1-181.12 0H128v-64zm192-288a96.064 96.064 0 0 1 181.12 0H896v64H762.56a96.064 96.064 0 0 1-181.12 0H128v-64zm-320-288a96.064 96.064 0 0 1 181.12 0H896v64H442.56a96.064 96.064 0 0 1-181.12 0H128v-64z"
        })
      ]));
    }
  });
  var operation_default = operation_vue_vue_type_script_setup_true_lang_default;
  var question_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "QuestionFilled",
    __name: "question-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m23.744 191.488c-52.096 0-92.928 14.784-123.2 44.352-30.976 29.568-45.76 70.4-45.76 122.496h80.256c0-29.568 5.632-52.8 17.6-68.992 13.376-19.712 35.2-28.864 66.176-28.864 23.936 0 42.944 6.336 56.32 19.712 12.672 13.376 19.712 31.68 19.712 54.912 0 17.6-6.336 34.496-19.008 49.984l-8.448 9.856c-45.76 40.832-73.216 70.4-82.368 89.408-9.856 19.008-14.08 42.24-14.08 68.992v9.856h80.96v-9.856c0-16.896 3.52-31.68 10.56-45.76 6.336-12.672 15.488-24.64 28.16-35.2 33.792-29.568 54.208-48.576 60.544-55.616 16.896-22.528 26.048-51.392 26.048-86.592 0-42.944-14.08-76.736-42.24-101.376-28.16-25.344-65.472-37.312-111.232-37.312zm-12.672 406.208a54.272 54.272 0 0 0-38.72 14.784 49.408 49.408 0 0 0-15.488 38.016c0 15.488 4.928 28.16 15.488 38.016A54.848 54.848 0 0 0 523.072 768c15.488 0 28.16-4.928 38.72-14.784a51.52 51.52 0 0 0 16.192-38.72 51.968 51.968 0 0 0-15.488-38.016 55.936 55.936 0 0 0-39.424-14.784z"
        })
      ]));
    }
  });
  var question_filled_default = question_filled_vue_vue_type_script_setup_true_lang_default;
  var tools_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Tools",
    __name: "tools",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0"
        })
      ]));
    }
  });
  var tools_default = tools_vue_vue_type_script_setup_true_lang_default;
  var warning_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Warning",
    __name: "warning",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768m48-176a48 48 0 1 1-96 0 48 48 0 0 1 96 0m-48-464a32 32 0 0 1 32 32v288a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32"
        })
      ]));
    }
  });
  var warning_default = warning_vue_vue_type_script_setup_true_lang_default;
  const useUserInfoStore = pinia$1.defineStore("userInfo", {
    persist: true,
    // 持久化
    state: () => ({
      key: null,
      questionList: []
    })
  });
  const tips = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20t='1748439493458'%20class='icon'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20p-id='1849'%20width='32'%20height='32'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cpath%20d='M512%20128c212.064%200%20384%20171.936%20384%20384s-171.936%20384-384%20384S128%20724.064%20128%20512%20299.936%20128%20512%20128z%20m0%2064C335.296%20192%20192%20335.296%20192%20512s143.296%20320%20320%20320%20320-143.296%20320-320S688.704%20192%20512%20192z%20m6.848%20429.728a48%2048%200%201%201%200%2096%2048%2048%200%200%201%200-96zM516.576%20320a32%2032%200%200%201%2032%2032v182.848a32%2032%200%201%201-64%200V352a32%2032%200%200%201%2032-32z'%20fill='%23ffffff'%20p-id='1850'%3e%3c/path%3e%3c/svg%3e";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$1 = { class: "avatar-name" };
  const _hoisted_2$1 = { class: "header-settings" };
  const _hoisted_3$1 = ["src"];
  const _hoisted_4$1 = {
    key: 0,
    class: "main-content"
  };
  const _sfc_main$2 = {
    __name: "draggableDialog",
    props: {
      title: {
        type: String,
        default: "网课助手"
      },
      width: {
        type: String,
        default: "336px"
      },
      height: {
        type: String,
        default: "260px"
      },
      boundary: {
        type: Boolean,
        default: true
      },
      axis: {
        type: String,
        default: "both",
        // 限制拖拽方向：both | x | y | none
        validator: (value) => ["both", "x", "y", "none"].includes(value)
      }
    },
    setup(__props) {
      const props = __props;
      const position = vue.ref({ x: 0, y: 0 });
      const isDragging = vue.ref(false);
      const startPos = vue.ref({ x: 0, y: 0 });
      const dragStartOffset = vue.ref({ x: 0, y: 0 });
      const windowSize = vue.ref({ width: 0, height: 0 });
      const isMinimize = vue.ref(false);
      const updateWindowSize = () => {
        windowSize.value = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        const dialogWidth = parseInt(props.width) || 400;
        const dialogHeight = parseInt(props.height) || 300;
        position.value.x = Math.max(0, (windowSize.value.width - dialogWidth) / 2);
        position.value.y = Math.max(0, (windowSize.value.height - dialogHeight) / 2);
      };
      const startDrag = (e) => {
        if (props.axis === "none") return;
        e.preventDefault();
        e.stopPropagation();
        isDragging.value = true;
        startPos.value = { x: e.clientX, y: e.clientY };
        dragStartOffset.value = { x: position.value.x, y: position.value.y };
        document.addEventListener("mousemove", onDrag, { passive: false });
        document.addEventListener("mouseup", stopDrag, { passive: false });
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
      };
      const onDrag = (e) => {
        if (!isDragging.value) return;
        e.preventDefault();
        let dx = e.clientX - startPos.value.x;
        let dy = e.clientY - startPos.value.y;
        if (props.axis === "x") dy = 0;
        if (props.axis === "y") dx = 0;
        let newX = dragStartOffset.value.x + dx;
        let newY = dragStartOffset.value.y + dy;
        if (props.boundary) {
          const dialogWidth = parseInt(props.width) || 400;
          const dialogHeight = parseInt(props.height) || 300;
          newX = Math.max(0, Math.min(newX, windowSize.value.width - dialogWidth));
          newY = Math.max(0, Math.min(newY, windowSize.value.height - dialogHeight));
        }
        position.value = { x: newX, y: newY };
      };
      const stopDrag = (e) => {
        if (!isDragging.value) return;
        isDragging.value = false;
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", stopDrag);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      vue.onMounted(() => {
        updateWindowSize();
        window.addEventListener("resize", updateWindowSize);
        const dialogWidth = parseInt(props.width) || 400;
        const dialogHeight = parseInt(props.height) || 300;
        position.value = {
          x: (windowSize.value.width - dialogWidth) / 2,
          y: (windowSize.value.height - dialogHeight) / 2
        };
        if (props.boundary) {
          position.value.x = Math.max(
            0,
            Math.min(position.value.x, windowSize.value.width - dialogWidth)
          );
          position.value.y = Math.max(
            0,
            Math.min(position.value.y, windowSize.value.height - dialogHeight)
          );
        }
      });
      vue.onUnmounted(() => {
        window.removeEventListener("resize", updateWindowSize);
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", stopDrag);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "draggable-dialog",
          style: vue.normalizeStyle({
            transform: `translate(${position.value.x}px, ${position.value.y}px)`
          })
        }, [
          vue.createElementVNode("div", {
            class: "draggable-title",
            onMousedown: startDrag
          }, [
            vue.createElementVNode("div", _hoisted_1$1, vue.toDisplayString(__props.title), 1),
            vue.createElementVNode("div", _hoisted_2$1, [
              vue.createVNode(vue.unref(ElementPlus.ElTooltip), {
                placement: "bottom",
                content: "请及时更新最新版、避免使用旧版本导致无法使用"
              }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("img", {
                    src: vue.unref(tips),
                    alt: "",
                    class: "tips",
                    srcset: ""
                  }, null, 8, _hoisted_3$1)
                ]),
                _: 1
              })
            ])
          ], 32),
          !isMinimize.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$1, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])) : vue.createCommentVNode("", true)
        ], 4);
      };
    }
  };
  const DraggableDialog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f537400f"]]);
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var Typr$1 = {};
  var Typr = {};
  Typr.parse = function(buff) {
    var bin = Typr._bin;
    var data = new Uint8Array(buff);
    var tag = bin.readASCII(data, 0, 4);
    if (tag == "ttcf") {
      var offset = 4;
      bin.readUshort(data, offset);
      offset += 2;
      bin.readUshort(data, offset);
      offset += 2;
      var numF = bin.readUint(data, offset);
      offset += 4;
      var fnts = [];
      for (var i = 0; i < numF; i++) {
        var foff = bin.readUint(data, offset);
        offset += 4;
        fnts.push(Typr._readFont(data, foff));
      }
      return fnts;
    } else
      return [Typr._readFont(data, 0)];
  };
  Typr._readFont = function(data, offset) {
    var bin = Typr._bin;
    var ooff = offset;
    bin.readFixed(data, offset);
    offset += 4;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var tags = [
      "cmap",
      "head",
      "hhea",
      "maxp",
      "hmtx",
      "name",
      "OS/2",
      "post",
      //"cvt",
      //"fpgm",
      "loca",
      "glyf",
      "kern",
      //"prep"
      //"gasp"
      "CFF ",
      "GPOS",
      "GSUB",
      "SVG "
      //"VORG",
    ];
    var obj = { _data: data, _offset: ooff };
    var tabs = {};
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      var length = bin.readUint(data, offset);
      offset += 4;
      tabs[tag] = { offset: toffset, length };
    }
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (tabs[t])
        obj[t.trim()] = Typr[t.trim()].parse(data, tabs[t].offset, tabs[t].length, obj);
    }
    return obj;
  };
  Typr._tabOffset = function(data, tab, foff) {
    var bin = Typr._bin;
    var numTables = bin.readUshort(data, foff + 4);
    var offset = foff + 12;
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      if (tag == tab)
        return toffset;
    }
    return 0;
  };
  Typr._bin = {
    readFixed: function(data, o) {
      return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
    },
    readF2dot14: function(data, o) {
      var num = Typr._bin.readShort(data, o);
      return num / 16384;
    },
    readInt: function(buff, p) {
      return Typr._bin._view(buff).getInt32(p);
    },
    readInt8: function(buff, p) {
      return Typr._bin._view(buff).getInt8(p);
    },
    readShort: function(buff, p) {
      return Typr._bin._view(buff).getInt16(p);
    },
    readUshort: function(buff, p) {
      return Typr._bin._view(buff).getUint16(p);
    },
    readUshorts: function(buff, p, len) {
      var arr = [];
      for (var i = 0; i < len; i++)
        arr.push(Typr._bin.readUshort(buff, p + i * 2));
      return arr;
    },
    readUint: function(buff, p) {
      return Typr._bin._view(buff).getUint32(p);
    },
    readUint64: function(buff, p) {
      return Typr._bin.readUint(buff, p) * (4294967295 + 1) + Typr._bin.readUint(buff, p + 4);
    },
    readASCII: function(buff, p, l) {
      var s = "";
      for (var i = 0; i < l; i++)
        s += String.fromCharCode(buff[p + i]);
      return s;
    },
    readUnicode: function(buff, p, l) {
      var s = "";
      for (var i = 0; i < l; i++) {
        var c = buff[p++] << 8 | buff[p++];
        s += String.fromCharCode(c);
      }
      return s;
    },
    _tdec: typeof window !== "undefined" && window["TextDecoder"] ? new window["TextDecoder"]() : null,
    readUTF8: function(buff, p, l) {
      var tdec = Typr._bin._tdec;
      if (tdec && p == 0 && l == buff.length)
        return tdec["decode"](buff);
      return Typr._bin.readASCII(buff, p, l);
    },
    readBytes: function(buff, p, l) {
      var arr = [];
      for (var i = 0; i < l; i++)
        arr.push(buff[p + i]);
      return arr;
    },
    readASCIIArray: function(buff, p, l) {
      var s = [];
      for (var i = 0; i < l; i++)
        s.push(String.fromCharCode(buff[p + i]));
      return s;
    },
    _view: function(buff) {
      return buff._dataView || (buff._dataView = buff.buffer ? new DataView(buff.buffer, buff.byteOffset, buff.byteLength) : new DataView(new Uint8Array(buff).buffer));
    }
  };
  Typr._lctf = {};
  Typr._lctf.parse = function(data, offset, length, font, subt) {
    var bin = Typr._bin;
    var obj = {};
    var offset0 = offset;
    bin.readFixed(data, offset);
    offset += 4;
    var offScriptList = bin.readUshort(data, offset);
    offset += 2;
    var offFeatureList = bin.readUshort(data, offset);
    offset += 2;
    var offLookupList = bin.readUshort(data, offset);
    offset += 2;
    obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList);
    obj.featureList = Typr._lctf.readFeatureList(data, offset0 + offFeatureList);
    obj.lookupList = Typr._lctf.readLookupList(data, offset0 + offLookupList, subt);
    return obj;
  };
  Typr._lctf.readLookupList = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);
      obj.push(lut);
    }
    return obj;
  };
  Typr._lctf.readLookupTable = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = { tabs: [] };
    obj.ltype = bin.readUshort(data, offset);
    offset += 2;
    obj.flag = bin.readUshort(data, offset);
    offset += 2;
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    var ltype = obj.ltype;
    for (var i = 0; i < cnt; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var tab = subt(data, ltype, offset0 + noff, obj);
      obj.tabs.push(tab);
    }
    return obj;
  };
  Typr._lctf.numOfOnes = function(n) {
    var num = 0;
    for (var i = 0; i < 32; i++)
      if ((n >>> i & 1) != 0)
        num++;
    return num;
  };
  Typr._lctf.readClassDef = function(data, offset) {
    var bin = Typr._bin;
    var obj = [];
    var format = bin.readUshort(data, offset);
    offset += 2;
    if (format == 1) {
      var startGlyph = bin.readUshort(data, offset);
      offset += 2;
      var glyphCount = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < glyphCount; i++) {
        obj.push(startGlyph + i);
        obj.push(startGlyph + i);
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    if (format == 2) {
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    return obj;
  };
  Typr._lctf.getInterval = function(tab, val) {
    for (var i = 0; i < tab.length; i += 3) {
      var start = tab[i], end = tab[i + 1];
      tab[i + 2];
      if (start <= val && val <= end)
        return i;
    }
    return -1;
  };
  Typr._lctf.readCoverage = function(data, offset) {
    var bin = Typr._bin;
    var cvg = {};
    cvg.fmt = bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    if (cvg.fmt == 1)
      cvg.tab = bin.readUshorts(data, offset, count);
    if (cvg.fmt == 2)
      cvg.tab = bin.readUshorts(data, offset, count * 3);
    return cvg;
  };
  Typr._lctf.coverageIndex = function(cvg, val) {
    var tab = cvg.tab;
    if (cvg.fmt == 1)
      return tab.indexOf(val);
    if (cvg.fmt == 2) {
      var ind = Typr._lctf.getInterval(tab, val);
      if (ind != -1)
        return tab[ind + 2] + (val - tab[ind]);
    }
    return -1;
  };
  Typr._lctf.readFeatureList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var feat = Typr._lctf.readFeatureTable(data, offset0 + noff);
      feat.tag = tag.trim();
      obj.push(feat);
    }
    return obj;
  };
  Typr._lctf.readFeatureTable = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var feat = {};
    var featureParams = bin.readUshort(data, offset);
    offset += 2;
    if (featureParams > 0) {
      feat.featureParams = offset0 + featureParams;
    }
    var lookupCount = bin.readUshort(data, offset);
    offset += 2;
    feat.tab = [];
    for (var i = 0; i < lookupCount; i++)
      feat.tab.push(bin.readUshort(data, offset + 2 * i));
    return feat;
  };
  Typr._lctf.readScriptList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
    }
    return obj;
  };
  Typr._lctf.readScriptTable = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var defLangSysOff = bin.readUshort(data, offset);
    offset += 2;
    if (defLangSysOff > 0) {
      obj["default"] = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
    }
    var langSysCount = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < langSysCount; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var langSysOff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
    }
    return obj;
  };
  Typr._lctf.readLangSysTable = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    obj.reqFeature = bin.readUshort(data, offset);
    offset += 2;
    var featureCount = bin.readUshort(data, offset);
    offset += 2;
    obj.features = bin.readUshorts(data, offset, featureCount);
    return obj;
  };
  Typr.CFF = {};
  Typr.CFF.parse = function(data, offset, length) {
    var bin = Typr._bin;
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    var ninds = [];
    offset = Typr.CFF.readIndex(data, offset, ninds);
    var names = [];
    for (var i = 0; i < ninds.length - 1; i++)
      names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    offset += ninds[ninds.length - 1];
    var tdinds = [];
    offset = Typr.CFF.readIndex(data, offset, tdinds);
    var topDicts = [];
    for (var i = 0; i < tdinds.length - 1; i++)
      topDicts.push(Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    offset += tdinds[tdinds.length - 1];
    var topdict = topDicts[0];
    var sinds = [];
    offset = Typr.CFF.readIndex(data, offset, sinds);
    var strings = [];
    for (var i = 0; i < sinds.length - 1; i++)
      strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    offset += sinds[sinds.length - 1];
    Typr.CFF.readSubrs(data, offset, topdict);
    if (topdict.CharStrings) {
      offset = topdict.CharStrings;
      var sinds = [];
      offset = Typr.CFF.readIndex(data, offset, sinds);
      var cstr = [];
      for (var i = 0; i < sinds.length - 1; i++)
        cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
      topdict.CharStrings = cstr;
    }
    if (topdict.ROS) {
      offset = topdict.FDArray;
      var fdind = [];
      offset = Typr.CFF.readIndex(data, offset, fdind);
      topdict.FDArray = [];
      for (var i = 0; i < fdind.length - 1; i++) {
        var dict = Typr.CFF.readDict(data, offset + fdind[i], offset + fdind[i + 1]);
        Typr.CFF._readFDict(data, dict, strings);
        topdict.FDArray.push(dict);
      }
      offset += fdind[fdind.length - 1];
      offset = topdict.FDSelect;
      topdict.FDSelect = [];
      var fmt = data[offset];
      offset++;
      if (fmt == 3) {
        var rns = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < rns + 1; i++) {
          topdict.FDSelect.push(bin.readUshort(data, offset), data[offset + 2]);
          offset += 3;
        }
      } else
        throw fmt;
    }
    if (topdict.Encoding)
      topdict.Encoding = Typr.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length);
    if (topdict.charset)
      topdict.charset = Typr.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length);
    Typr.CFF._readFDict(data, topdict, strings);
    return topdict;
  };
  Typr.CFF._readFDict = function(data, dict, ss) {
    var offset;
    if (dict.Private) {
      offset = dict.Private[1];
      dict.Private = Typr.CFF.readDict(data, offset, offset + dict.Private[0]);
      if (dict.Private.Subrs)
        Typr.CFF.readSubrs(data, offset + dict.Private.Subrs, dict.Private);
    }
    for (var p in dict)
      if (["FamilyName", "FontName", "FullName", "Notice", "version", "Copyright"].indexOf(p) != -1)
        dict[p] = ss[dict[p] - 426 + 35];
  };
  Typr.CFF.readSubrs = function(data, offset, obj) {
    var bin = Typr._bin;
    var gsubinds = [];
    offset = Typr.CFF.readIndex(data, offset, gsubinds);
    var bias, nSubrs = gsubinds.length;
    if (nSubrs < 1240)
      bias = 107;
    else if (nSubrs < 33900)
      bias = 1131;
    else
      bias = 32768;
    obj.Bias = bias;
    obj.Subrs = [];
    for (var i = 0; i < gsubinds.length - 1; i++)
      obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
  };
  Typr.CFF.tableSE = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    0,
    111,
    112,
    113,
    114,
    0,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    0,
    123,
    0,
    124,
    125,
    126,
    127,
    128,
    129,
    130,
    131,
    0,
    132,
    133,
    0,
    134,
    135,
    136,
    137,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    138,
    0,
    139,
    0,
    0,
    0,
    0,
    140,
    141,
    142,
    143,
    0,
    0,
    0,
    0,
    0,
    144,
    0,
    0,
    0,
    145,
    0,
    0,
    146,
    147,
    148,
    149,
    0,
    0,
    0,
    0
  ];
  Typr.CFF.glyphByUnicode = function(cff, code) {
    for (var i = 0; i < cff.charset.length; i++)
      if (cff.charset[i] == code)
        return i;
    return -1;
  };
  Typr.CFF.glyphBySE = function(cff, charcode) {
    if (charcode < 0 || charcode > 255)
      return -1;
    return Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
  };
  Typr.CFF.readEncoding = function(data, offset, num) {
    Typr._bin;
    var array = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      var nCodes = data[offset];
      offset++;
      for (var i = 0; i < nCodes; i++)
        array.push(data[offset + i]);
    } else
      throw "error: unknown encoding format: " + format;
    return array;
  };
  Typr.CFF.readCharset = function(data, offset, num) {
    var bin = Typr._bin;
    var charset = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      for (var i = 0; i < num; i++) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        charset.push(first);
      }
    } else if (format == 1 || format == 2) {
      while (charset.length < num) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        var nLeft = 0;
        if (format == 1) {
          nLeft = data[offset];
          offset++;
        } else {
          nLeft = bin.readUshort(data, offset);
          offset += 2;
        }
        for (var i = 0; i <= nLeft; i++) {
          charset.push(first);
          first++;
        }
      }
    } else
      throw "error: format: " + format;
    return charset;
  };
  Typr.CFF.readIndex = function(data, offset, inds) {
    var bin = Typr._bin;
    var count = bin.readUshort(data, offset) + 1;
    offset += 2;
    var offsize = data[offset];
    offset++;
    if (offsize == 1)
      for (var i = 0; i < count; i++)
        inds.push(data[offset + i]);
    else if (offsize == 2)
      for (var i = 0; i < count; i++)
        inds.push(bin.readUshort(data, offset + i * 2));
    else if (offsize == 3)
      for (var i = 0; i < count; i++)
        inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215);
    else if (count != 1)
      throw "unsupported offset size: " + offsize + ", count: " + count;
    offset += count * offsize;
    return offset - 1;
  };
  Typr.CFF.getCharString = function(data, offset, o) {
    var bin = Typr._bin;
    var b0 = data[offset], b1 = data[offset + 1];
    data[offset + 2];
    data[offset + 3];
    data[offset + 4];
    var vs = 1;
    var op = null, val = null;
    if (b0 <= 20) {
      op = b0;
      vs = 1;
    }
    if (b0 == 12) {
      op = b0 * 100 + b1;
      vs = 2;
    }
    if (21 <= b0 && b0 <= 27) {
      op = b0;
      vs = 1;
    }
    if (b0 == 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }
    if (29 <= b0 && b0 <= 31) {
      op = b0;
      vs = 1;
    }
    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }
    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }
    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }
    if (b0 == 255) {
      val = bin.readInt(data, offset + 1) / 65535;
      vs = 5;
    }
    o.val = val != null ? val : "o" + op;
    o.size = vs;
  };
  Typr.CFF.readCharString = function(data, offset, length) {
    var end = offset + length;
    var bin = Typr._bin;
    var arr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var op = null, val = null;
      if (b0 <= 20) {
        op = b0;
        vs = 1;
      }
      if (b0 == 12) {
        op = b0 * 100 + b1;
        vs = 2;
      }
      if (b0 == 19 || b0 == 20) {
        op = b0;
        vs = 2;
      }
      if (21 <= b0 && b0 <= 27) {
        op = b0;
        vs = 1;
      }
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (29 <= b0 && b0 <= 31) {
        op = b0;
        vs = 1;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
      }
      arr.push(val != null ? val : "o" + op);
      offset += vs;
    }
    return arr;
  };
  Typr.CFF.readDict = function(data, offset, end) {
    var bin = Typr._bin;
    var dict = {};
    var carr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var key = null, val = null;
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (b0 == 29) {
        val = bin.readInt(data, offset + 1);
        vs = 5;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
        throw "unknown number";
      }
      if (b0 == 30) {
        var nibs = [];
        vs = 1;
        while (true) {
          var b = data[offset + vs];
          vs++;
          var nib0 = b >> 4, nib1 = b & 15;
          if (nib0 != 15)
            nibs.push(nib0);
          if (nib1 != 15)
            nibs.push(nib1);
          if (nib1 == 15)
            break;
        }
        var s = "";
        var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"];
        for (var i = 0; i < nibs.length; i++)
          s += chars[nibs[i]];
        val = parseFloat(s);
      }
      if (b0 <= 21) {
        var keys = [
          "version",
          "Notice",
          "FullName",
          "FamilyName",
          "Weight",
          "FontBBox",
          "BlueValues",
          "OtherBlues",
          "FamilyBlues",
          "FamilyOtherBlues",
          "StdHW",
          "StdVW",
          "escape",
          "UniqueID",
          "XUID",
          "charset",
          "Encoding",
          "CharStrings",
          "Private",
          "Subrs",
          "defaultWidthX",
          "nominalWidthX"
        ];
        key = keys[b0];
        vs = 1;
        if (b0 == 12) {
          var keys = [
            "Copyright",
            "isFixedPitch",
            "ItalicAngle",
            "UnderlinePosition",
            "UnderlineThickness",
            "PaintType",
            "CharstringType",
            "FontMatrix",
            "StrokeWidth",
            "BlueScale",
            "BlueShift",
            "BlueFuzz",
            "StemSnapH",
            "StemSnapV",
            "ForceBold",
            0,
            0,
            "LanguageGroup",
            "ExpansionFactor",
            "initialRandomSeed",
            "SyntheticBase",
            "PostScript",
            "BaseFontName",
            "BaseFontBlend",
            0,
            0,
            0,
            0,
            0,
            0,
            "ROS",
            "CIDFontVersion",
            "CIDFontRevision",
            "CIDFontType",
            "CIDCount",
            "UIDBase",
            "FDArray",
            "FDSelect",
            "FontName"
          ];
          key = keys[b1];
          vs = 2;
        }
      }
      if (key != null) {
        dict[key] = carr.length == 1 ? carr[0] : carr;
        carr = [];
      } else
        carr.push(val);
      offset += vs;
    }
    return dict;
  };
  Typr.cmap = {};
  Typr.cmap.parse = function(data, offset, length) {
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    var offs = [];
    obj.tables = [];
    for (var i = 0; i < numTables; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUint(data, offset);
      offset += 4;
      var id = "p" + platformID + "e" + encodingID;
      var tind = offs.indexOf(noffset);
      if (tind == -1) {
        tind = obj.tables.length;
        var subt;
        offs.push(noffset);
        var format = bin.readUshort(data, noffset);
        if (format == 0)
          subt = Typr.cmap.parse0(data, noffset);
        else if (format == 4)
          subt = Typr.cmap.parse4(data, noffset);
        else if (format == 6)
          subt = Typr.cmap.parse6(data, noffset);
        else if (format == 12)
          subt = Typr.cmap.parse12(data, noffset);
        else
          console.warn("unknown format: " + format, platformID, encodingID, noffset);
        obj.tables.push(subt);
      }
      if (obj[id] != null)
        throw "multiple tables for one platform+encoding";
      obj[id] = tind;
    }
    return obj;
  };
  Typr.cmap.parse0 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var len = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.map = [];
    for (var i = 0; i < len - 6; i++)
      obj.map.push(data[offset + i]);
    return obj;
  };
  Typr.cmap.parse4 = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var segCountX2 = bin.readUshort(data, offset);
    offset += 2;
    var segCount = segCountX2 / 2;
    obj.searchRange = bin.readUshort(data, offset);
    offset += 2;
    obj.entrySelector = bin.readUshort(data, offset);
    offset += 2;
    obj.rangeShift = bin.readUshort(data, offset);
    offset += 2;
    obj.endCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    offset += 2;
    obj.startCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.idDelta = [];
    for (var i = 0; i < segCount; i++) {
      obj.idDelta.push(bin.readShort(data, offset));
      offset += 2;
    }
    obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.glyphIdArray = [];
    while (offset < offset0 + length) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse6 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.firstCode = bin.readUshort(data, offset);
    offset += 2;
    var entryCount = bin.readUshort(data, offset);
    offset += 2;
    obj.glyphIdArray = [];
    for (var i = 0; i < entryCount; i++) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse12 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    offset += 2;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    var nGroups = bin.readUint(data, offset);
    offset += 4;
    obj.groups = [];
    for (var i = 0; i < nGroups; i++) {
      var off = offset + i * 12;
      var startCharCode = bin.readUint(data, off + 0);
      var endCharCode = bin.readUint(data, off + 4);
      var startGlyphID = bin.readUint(data, off + 8);
      obj.groups.push([startCharCode, endCharCode, startGlyphID]);
    }
    return obj;
  };
  Typr.glyf = {};
  Typr.glyf.parse = function(data, offset, length, font) {
    var obj = [];
    for (var g = 0; g < font.maxp.numGlyphs; g++)
      obj.push(null);
    return obj;
  };
  Typr.glyf._parseGlyf = function(font, g) {
    var bin = Typr._bin;
    var data = font._data;
    var offset = Typr._tabOffset(data, "glyf", font._offset) + font.loca[g];
    if (font.loca[g] == font.loca[g + 1])
      return null;
    var gl = {};
    gl.noc = bin.readShort(data, offset);
    offset += 2;
    gl.xMin = bin.readShort(data, offset);
    offset += 2;
    gl.yMin = bin.readShort(data, offset);
    offset += 2;
    gl.xMax = bin.readShort(data, offset);
    offset += 2;
    gl.yMax = bin.readShort(data, offset);
    offset += 2;
    if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax)
      return null;
    if (gl.noc > 0) {
      gl.endPts = [];
      for (var i = 0; i < gl.noc; i++) {
        gl.endPts.push(bin.readUshort(data, offset));
        offset += 2;
      }
      var instructionLength = bin.readUshort(data, offset);
      offset += 2;
      if (data.length - offset < instructionLength)
        return null;
      gl.instructions = bin.readBytes(data, offset, instructionLength);
      offset += instructionLength;
      var crdnum = gl.endPts[gl.noc - 1] + 1;
      gl.flags = [];
      for (var i = 0; i < crdnum; i++) {
        var flag = data[offset];
        offset++;
        gl.flags.push(flag);
        if ((flag & 8) != 0) {
          var rep = data[offset];
          offset++;
          for (var j = 0; j < rep; j++) {
            gl.flags.push(flag);
            i++;
          }
        }
      }
      gl.xs = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
        if (i8) {
          gl.xs.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.xs.push(0);
          else {
            gl.xs.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      gl.ys = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
        if (i8) {
          gl.ys.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.ys.push(0);
          else {
            gl.ys.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      var x = 0, y = 0;
      for (var i = 0; i < crdnum; i++) {
        x += gl.xs[i];
        y += gl.ys[i];
        gl.xs[i] = x;
        gl.ys[i] = y;
      }
    } else {
      var ARG_1_AND_2_ARE_WORDS = 1 << 0;
      var ARGS_ARE_XY_VALUES = 1 << 1;
      var WE_HAVE_A_SCALE = 1 << 3;
      var MORE_COMPONENTS = 1 << 5;
      var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
      var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
      var WE_HAVE_INSTRUCTIONS = 1 << 8;
      gl.parts = [];
      var flags;
      do {
        flags = bin.readUshort(data, offset);
        offset += 2;
        var part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
        gl.parts.push(part);
        part.glyphIndex = bin.readUshort(data, offset);
        offset += 2;
        if (flags & ARG_1_AND_2_ARE_WORDS) {
          var arg1 = bin.readShort(data, offset);
          offset += 2;
          var arg2 = bin.readShort(data, offset);
          offset += 2;
        } else {
          var arg1 = bin.readInt8(data, offset);
          offset++;
          var arg2 = bin.readInt8(data, offset);
          offset++;
        }
        if (flags & ARGS_ARE_XY_VALUES) {
          part.m.tx = arg1;
          part.m.ty = arg2;
        } else {
          part.p1 = arg1;
          part.p2 = arg2;
        }
        if (flags & WE_HAVE_A_SCALE) {
          part.m.a = part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.b = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.c = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        }
      } while (flags & MORE_COMPONENTS);
      if (flags & WE_HAVE_INSTRUCTIONS) {
        var numInstr = bin.readUshort(data, offset);
        offset += 2;
        gl.instr = [];
        for (var i = 0; i < numInstr; i++) {
          gl.instr.push(data[offset]);
          offset++;
        }
      }
    }
    return gl;
  };
  Typr.GPOS = {};
  Typr.GPOS.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
  };
  Typr.GPOS.subt = function(data, ltype, offset, ltable) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.fmt = bin.readUshort(data, offset);
    offset += 2;
    if (ltype == 1 || ltype == 2 || ltype == 3 || ltype == 7 || ltype == 8 && tab.fmt <= 2) {
      var covOff = bin.readUshort(data, offset);
      offset += 2;
      tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    }
    if (ltype == 1 && tab.fmt == 1) {
      var valFmt1 = bin.readUshort(data, offset);
      offset += 2;
      var ones1 = Typr._lctf.numOfOnes(valFmt1);
      if (valFmt1 != 0)
        tab.pos = Typr.GPOS.readValueRecord(data, offset, valFmt1);
    } else if (ltype == 2 && tab.fmt >= 1 && tab.fmt <= 2) {
      var valFmt1 = bin.readUshort(data, offset);
      offset += 2;
      var valFmt2 = bin.readUshort(data, offset);
      offset += 2;
      var ones1 = Typr._lctf.numOfOnes(valFmt1);
      var ones2 = Typr._lctf.numOfOnes(valFmt2);
      if (tab.fmt == 1) {
        tab.pairsets = [];
        var psc = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < psc; i++) {
          var psoff = offset0 + bin.readUshort(data, offset);
          offset += 2;
          var pvc = bin.readUshort(data, psoff);
          psoff += 2;
          var arr = [];
          for (var j = 0; j < pvc; j++) {
            var gid2 = bin.readUshort(data, psoff);
            psoff += 2;
            var value1, value2;
            if (valFmt1 != 0) {
              value1 = Typr.GPOS.readValueRecord(data, psoff, valFmt1);
              psoff += ones1 * 2;
            }
            if (valFmt2 != 0) {
              value2 = Typr.GPOS.readValueRecord(data, psoff, valFmt2);
              psoff += ones2 * 2;
            }
            arr.push({ gid2, val1: value1, val2: value2 });
          }
          tab.pairsets.push(arr);
        }
      }
      if (tab.fmt == 2) {
        var classDef1 = bin.readUshort(data, offset);
        offset += 2;
        var classDef2 = bin.readUshort(data, offset);
        offset += 2;
        var class1Count = bin.readUshort(data, offset);
        offset += 2;
        var class2Count = bin.readUshort(data, offset);
        offset += 2;
        tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1);
        tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2);
        tab.matrix = [];
        for (var i = 0; i < class1Count; i++) {
          var row = [];
          for (var j = 0; j < class2Count; j++) {
            var value1 = null, value2 = null;
            if (valFmt1 != 0) {
              value1 = Typr.GPOS.readValueRecord(data, offset, valFmt1);
              offset += ones1 * 2;
            }
            if (valFmt2 != 0) {
              value2 = Typr.GPOS.readValueRecord(data, offset, valFmt2);
              offset += ones2 * 2;
            }
            row.push({ val1: value1, val2: value2 });
          }
          tab.matrix.push(row);
        }
      }
    } else if (ltype == 9 && tab.fmt == 1) {
      var extType = bin.readUshort(data, offset);
      offset += 2;
      var extOffset = bin.readUint(data, offset);
      offset += 4;
      if (ltable.ltype == 9) {
        ltable.ltype = extType;
      } else if (ltable.ltype != extType) {
        throw "invalid extension substitution";
      }
      return Typr.GPOS.subt(data, ltable.ltype, offset0 + extOffset);
    } else
      console.warn("unsupported GPOS table LookupType", ltype, "format", tab.fmt);
    return tab;
  };
  Typr.GPOS.readValueRecord = function(data, offset, valFmt) {
    var bin = Typr._bin;
    var arr = [];
    arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 1 ? 2 : 0;
    arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 2 ? 2 : 0;
    arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 4 ? 2 : 0;
    arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 8 ? 2 : 0;
    return arr;
  };
  Typr.GSUB = {};
  Typr.GSUB.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
  };
  Typr.GSUB.subt = function(data, ltype, offset, ltable) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.fmt = bin.readUshort(data, offset);
    offset += 2;
    if (ltype != 1 && ltype != 4 && ltype != 5 && ltype != 6)
      return null;
    if (ltype == 1 || ltype == 4 || ltype == 5 && tab.fmt <= 2 || ltype == 6 && tab.fmt <= 2) {
      var covOff = bin.readUshort(data, offset);
      offset += 2;
      tab.coverage = Typr._lctf.readCoverage(data, offset0 + covOff);
    }
    if (ltype == 1 && tab.fmt >= 1 && tab.fmt <= 2) {
      if (tab.fmt == 1) {
        tab.delta = bin.readShort(data, offset);
        offset += 2;
      } else if (tab.fmt == 2) {
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        tab.newg = bin.readUshorts(data, offset, cnt);
        offset += tab.newg.length * 2;
      }
    } else if (ltype == 4) {
      tab.vals = [];
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < cnt; i++) {
        var loff = bin.readUshort(data, offset);
        offset += 2;
        tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
      }
    } else if (ltype == 5 && tab.fmt == 2) {
      if (tab.fmt == 2) {
        var cDefOffset = bin.readUshort(data, offset);
        offset += 2;
        tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset);
        tab.scset = [];
        var subClassSetCount = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < subClassSetCount; i++) {
          var scsOff = bin.readUshort(data, offset);
          offset += 2;
          tab.scset.push(scsOff == 0 ? null : Typr.GSUB.readSubClassSet(data, offset0 + scsOff));
        }
      }
    } else if (ltype == 6 && tab.fmt == 3) {
      if (tab.fmt == 3) {
        for (var i = 0; i < 3; i++) {
          var cnt = bin.readUshort(data, offset);
          offset += 2;
          var cvgs = [];
          for (var j = 0; j < cnt; j++)
            cvgs.push(Typr._lctf.readCoverage(data, offset0 + bin.readUshort(data, offset + j * 2)));
          offset += cnt * 2;
          if (i == 0)
            tab.backCvg = cvgs;
          if (i == 1)
            tab.inptCvg = cvgs;
          if (i == 2)
            tab.ahedCvg = cvgs;
        }
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        tab.lookupRec = Typr.GSUB.readSubstLookupRecords(data, offset, cnt);
      }
    } else if (ltype == 7 && tab.fmt == 1) {
      var extType = bin.readUshort(data, offset);
      offset += 2;
      var extOffset = bin.readUint(data, offset);
      offset += 4;
      if (ltable.ltype == 9) {
        ltable.ltype = extType;
      } else if (ltable.ltype != extType) {
        throw "invalid extension substitution";
      }
      return Typr.GSUB.subt(data, ltable.ltype, offset0 + extOffset);
    } else
      console.warn("unsupported GSUB table LookupType", ltype, "format", tab.fmt);
    return tab;
  };
  Typr.GSUB.readSubClassSet = function(data, offset) {
    var rUs = Typr._bin.readUshort, offset0 = offset, lset = [];
    var cnt = rUs(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = rUs(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readSubClassRule = function(data, offset) {
    var rUs = Typr._bin.readUshort, rule = {};
    var gcount = rUs(data, offset);
    offset += 2;
    var scount = rUs(data, offset);
    offset += 2;
    rule.input = [];
    for (var i = 0; i < gcount - 1; i++) {
      rule.input.push(rUs(data, offset));
      offset += 2;
    }
    rule.substLookupRecords = Typr.GSUB.readSubstLookupRecords(data, offset, scount);
    return rule;
  };
  Typr.GSUB.readSubstLookupRecords = function(data, offset, cnt) {
    var rUs = Typr._bin.readUshort;
    var out = [];
    for (var i = 0; i < cnt; i++) {
      out.push(rUs(data, offset), rUs(data, offset + 2));
      offset += 4;
    }
    return out;
  };
  Typr.GSUB.readChainSubClassSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readChainSubClassRule = function(data, offset) {
    var bin = Typr._bin, rule = {};
    var pps = ["backtrack", "input", "lookahead"];
    for (var pi = 0; pi < pps.length; pi++) {
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      if (pi == 1)
        cnt--;
      rule[pps[pi]] = bin.readUshorts(data, offset, cnt);
      offset += rule[pps[pi]].length * 2;
    }
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    rule.subst = bin.readUshorts(data, offset, cnt * 2);
    offset += rule.subst.length * 2;
    return rule;
  };
  Typr.GSUB.readLigatureSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var lcnt = bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < lcnt; j++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readLigature = function(data, offset) {
    var bin = Typr._bin, lig = { chain: [] };
    lig.nglyph = bin.readUshort(data, offset);
    offset += 2;
    var ccnt = bin.readUshort(data, offset);
    offset += 2;
    for (var k = 0; k < ccnt - 1; k++) {
      lig.chain.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return lig;
  };
  Typr.head = {};
  Typr.head.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.fontRevision = bin.readFixed(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    obj.flags = bin.readUshort(data, offset);
    offset += 2;
    obj.unitsPerEm = bin.readUshort(data, offset);
    offset += 2;
    obj.created = bin.readUint64(data, offset);
    offset += 8;
    obj.modified = bin.readUint64(data, offset);
    offset += 8;
    obj.xMin = bin.readShort(data, offset);
    offset += 2;
    obj.yMin = bin.readShort(data, offset);
    offset += 2;
    obj.xMax = bin.readShort(data, offset);
    offset += 2;
    obj.yMax = bin.readShort(data, offset);
    offset += 2;
    obj.macStyle = bin.readUshort(data, offset);
    offset += 2;
    obj.lowestRecPPEM = bin.readUshort(data, offset);
    offset += 2;
    obj.fontDirectionHint = bin.readShort(data, offset);
    offset += 2;
    obj.indexToLocFormat = bin.readShort(data, offset);
    offset += 2;
    obj.glyphDataFormat = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hhea = {};
  Typr.hhea.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.ascender = bin.readShort(data, offset);
    offset += 2;
    obj.descender = bin.readShort(data, offset);
    offset += 2;
    obj.lineGap = bin.readShort(data, offset);
    offset += 2;
    obj.advanceWidthMax = bin.readUshort(data, offset);
    offset += 2;
    obj.minLeftSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.minRightSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.xMaxExtent = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRise = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRun = bin.readShort(data, offset);
    offset += 2;
    obj.caretOffset = bin.readShort(data, offset);
    offset += 2;
    offset += 4 * 2;
    obj.metricDataFormat = bin.readShort(data, offset);
    offset += 2;
    obj.numberOfHMetrics = bin.readUshort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hmtx = {};
  Typr.hmtx.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = {};
    obj.aWidth = [];
    obj.lsBearing = [];
    var aw = 0, lsb = 0;
    for (var i = 0; i < font.maxp.numGlyphs; i++) {
      if (i < font.hhea.numberOfHMetrics) {
        aw = bin.readUshort(data, offset);
        offset += 2;
        lsb = bin.readShort(data, offset);
        offset += 2;
      }
      obj.aWidth.push(aw);
      obj.lsBearing.push(lsb);
    }
    return obj;
  };
  Typr.kern = {};
  Typr.kern.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var version = bin.readUshort(data, offset);
    offset += 2;
    if (version == 1)
      return Typr.kern.parseV1(data, offset - 2, length, font);
    var nTables = bin.readUshort(data, offset);
    offset += 2;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map);
      else
        throw "unknown kern table format: " + format;
    }
    return map;
  };
  Typr.kern.parseV1 = function(data, offset, length, font) {
    var bin = Typr._bin;
    bin.readFixed(data, offset);
    offset += 4;
    var nTables = bin.readUint(data, offset);
    offset += 4;
    var map = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      bin.readUint(data, offset);
      offset += 4;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map);
      else
        throw "unknown kern table format: " + format;
    }
    return map;
  };
  Typr.kern.readFormat0 = function(data, offset, map) {
    var bin = Typr._bin;
    var pleft = -1;
    var nPairs = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < nPairs; j++) {
      var left = bin.readUshort(data, offset);
      offset += 2;
      var right = bin.readUshort(data, offset);
      offset += 2;
      var value = bin.readShort(data, offset);
      offset += 2;
      if (left != pleft) {
        map.glyph1.push(left);
        map.rval.push({ glyph2: [], vals: [] });
      }
      var rval = map.rval[map.rval.length - 1];
      rval.glyph2.push(right);
      rval.vals.push(value);
      pleft = left;
    }
    return offset;
  };
  Typr.loca = {};
  Typr.loca.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = [];
    var ver = font.head.indexToLocFormat;
    var len = font.maxp.numGlyphs + 1;
    if (ver == 0)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
    if (ver == 1)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUint(data, offset + (i << 2)));
    return obj;
  };
  Typr.maxp = {};
  Typr.maxp.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    var ver = bin.readUint(data, offset);
    offset += 4;
    obj.numGlyphs = bin.readUshort(data, offset);
    offset += 2;
    if (ver == 65536) {
      obj.maxPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositePoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositeContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxZones = bin.readUshort(data, offset);
      offset += 2;
      obj.maxTwilightPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStorage = bin.readUshort(data, offset);
      offset += 2;
      obj.maxFunctionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxInstructionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStackElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxSizeOfInstructions = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentDepth = bin.readUshort(data, offset);
      offset += 2;
    }
    return obj;
  };
  Typr.name = {};
  Typr.name.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var names = [
      "copyright",
      "fontFamily",
      "fontSubfamily",
      "ID",
      "fullName",
      "version",
      "postScriptName",
      "trademark",
      "manufacturer",
      "designer",
      "description",
      "urlVendor",
      "urlDesigner",
      "licence",
      "licenceURL",
      "---",
      "typoFamilyName",
      "typoSubfamilyName",
      "compatibleFull",
      "sampleText",
      "postScriptCID",
      "wwsFamilyName",
      "wwsSubfamilyName",
      "lightPalette",
      "darkPalette"
    ];
    var offset0 = offset;
    for (var i = 0; i < count; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var languageID = bin.readUshort(data, offset);
      offset += 2;
      var nameID = bin.readUshort(data, offset);
      offset += 2;
      var slen = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUshort(data, offset);
      offset += 2;
      var cname = names[nameID];
      var soff = offset0 + count * 12 + noffset;
      var str;
      if (platformID == 0)
        str = bin.readUnicode(data, soff, slen / 2);
      else if (platformID == 3 && encodingID == 0)
        str = bin.readUnicode(data, soff, slen / 2);
      else if (encodingID == 0)
        str = bin.readASCII(data, soff, slen);
      else if (encodingID == 1)
        str = bin.readUnicode(data, soff, slen / 2);
      else if (encodingID == 3)
        str = bin.readUnicode(data, soff, slen / 2);
      else if (platformID == 1) {
        str = bin.readASCII(data, soff, slen);
        console.warn("reading unknown MAC encoding " + encodingID + " as ASCII");
      } else
        throw "unknown encoding " + encodingID + ", platformID: " + platformID;
      var tid = "p" + platformID + "," + languageID.toString(16);
      if (obj[tid] == null)
        obj[tid] = {};
      obj[tid][cname !== void 0 ? cname : nameID] = str;
      obj[tid]._lang = languageID;
    }
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 1033)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 0)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 3084)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null)
        return obj[p];
    var tname;
    for (var p in obj) {
      tname = p;
      break;
    }
    console.warn("returning name table with languageID " + obj[tname]._lang);
    return obj[tname];
  };
  Typr["OS/2"] = {};
  Typr["OS/2"].parse = function(data, offset, length) {
    var bin = Typr._bin;
    var ver = bin.readUshort(data, offset);
    offset += 2;
    var obj = {};
    if (ver == 0)
      Typr["OS/2"].version0(data, offset, obj);
    else if (ver == 1)
      Typr["OS/2"].version1(data, offset, obj);
    else if (ver == 2 || ver == 3 || ver == 4)
      Typr["OS/2"].version2(data, offset, obj);
    else if (ver == 5)
      Typr["OS/2"].version5(data, offset, obj);
    else
      throw "unknown OS/2 table version: " + ver;
    return obj;
  };
  Typr["OS/2"].version0 = function(data, offset, obj) {
    var bin = Typr._bin;
    obj.xAvgCharWidth = bin.readShort(data, offset);
    offset += 2;
    obj.usWeightClass = bin.readUshort(data, offset);
    offset += 2;
    obj.usWidthClass = bin.readUshort(data, offset);
    offset += 2;
    obj.fsType = bin.readUshort(data, offset);
    offset += 2;
    obj.ySubscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutSize = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutPosition = bin.readShort(data, offset);
    offset += 2;
    obj.sFamilyClass = bin.readShort(data, offset);
    offset += 2;
    obj.panose = bin.readBytes(data, offset, 10);
    offset += 10;
    obj.ulUnicodeRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange2 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange3 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange4 = bin.readUint(data, offset);
    offset += 4;
    obj.achVendID = [bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3)];
    offset += 4;
    obj.fsSelection = bin.readUshort(data, offset);
    offset += 2;
    obj.usFirstCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.usLastCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.sTypoAscender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoDescender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoLineGap = bin.readShort(data, offset);
    offset += 2;
    obj.usWinAscent = bin.readUshort(data, offset);
    offset += 2;
    obj.usWinDescent = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version1 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version0(data, offset, obj);
    obj.ulCodePageRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulCodePageRange2 = bin.readUint(data, offset);
    offset += 4;
    return offset;
  };
  Typr["OS/2"].version2 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version1(data, offset, obj);
    obj.sxHeight = bin.readShort(data, offset);
    offset += 2;
    obj.sCapHeight = bin.readShort(data, offset);
    offset += 2;
    obj.usDefault = bin.readUshort(data, offset);
    offset += 2;
    obj.usBreak = bin.readUshort(data, offset);
    offset += 2;
    obj.usMaxContext = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version5 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version2(data, offset, obj);
    obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr.post = {};
  Typr.post.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    obj.version = bin.readFixed(data, offset);
    offset += 4;
    obj.italicAngle = bin.readFixed(data, offset);
    offset += 4;
    obj.underlinePosition = bin.readShort(data, offset);
    offset += 2;
    obj.underlineThickness = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.SVG = {};
  Typr.SVG.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = { entries: [] };
    var offset0 = offset;
    bin.readUshort(data, offset);
    offset += 2;
    var svgDocIndexOffset = bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    offset = svgDocIndexOffset + offset0;
    var numEntries = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < numEntries; i++) {
      var startGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var endGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var svgDocOffset = bin.readUint(data, offset);
      offset += 4;
      var svgDocLength = bin.readUint(data, offset);
      offset += 4;
      var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
      var svg = bin.readUTF8(sbuf, 0, sbuf.length);
      for (var f = startGlyphID; f <= endGlyphID; f++) {
        obj.entries[f] = svg;
      }
    }
    return obj;
  };
  Typr.SVG.toPath = function(str) {
    var pth = { cmds: [], crds: [] };
    if (str == null)
      return pth;
    var prsr = new DOMParser();
    var doc = prsr["parseFromString"](str, "image/svg+xml");
    var svg = doc.firstChild;
    while (svg.tagName != "svg")
      svg = svg.nextSibling;
    var vb = svg.getAttribute("viewBox");
    if (vb)
      vb = vb.trim().split(" ").map(parseFloat);
    else
      vb = [0, 0, 1e3, 1e3];
    Typr.SVG._toPath(svg.children, pth);
    for (var i = 0; i < pth.crds.length; i += 2) {
      var x = pth.crds[i], y = pth.crds[i + 1];
      x -= vb[0];
      y -= vb[1];
      y = -y;
      pth.crds[i] = x;
      pth.crds[i + 1] = y;
    }
    return pth;
  };
  Typr.SVG._toPath = function(nds, pth, fill) {
    for (var ni = 0; ni < nds.length; ni++) {
      var nd = nds[ni], tn = nd.tagName;
      var cfl = nd.getAttribute("fill");
      if (cfl == null)
        cfl = fill;
      if (tn == "g")
        Typr.SVG._toPath(nd.children, pth, cfl);
      else if (tn == "path") {
        pth.cmds.push(cfl ? cfl : "#000000");
        var d = nd.getAttribute("d");
        var toks = Typr.SVG._tokens(d);
        Typr.SVG._toksToPath(toks, pth);
        pth.cmds.push("X");
      } else if (tn == "defs") ;
      else
        console.warn(tn, nd);
    }
  };
  Typr.SVG._tokens = function(d) {
    var ts = [], off = 0, rn = false, cn = "";
    while (off < d.length) {
      var cc = d.charCodeAt(off), ch = d.charAt(off);
      off++;
      var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-";
      if (rn) {
        if (ch == "-") {
          ts.push(parseFloat(cn));
          cn = ch;
        } else if (isNum)
          cn += ch;
        else {
          ts.push(parseFloat(cn));
          if (ch != "," && ch != " ")
            ts.push(ch);
          rn = false;
        }
      } else {
        if (isNum) {
          cn = ch;
          rn = true;
        } else if (ch != "," && ch != " ")
          ts.push(ch);
      }
    }
    if (rn)
      ts.push(parseFloat(cn));
    return ts;
  };
  Typr.SVG._toksToPath = function(ts, pth) {
    var i = 0, x = 0, y = 0, ox = 0, oy = 0;
    var pc = { "M": 2, "L": 2, "H": 1, "V": 1, "S": 4, "C": 6 };
    var cmds = pth.cmds, crds = pth.crds;
    while (i < ts.length) {
      var cmd = ts[i];
      i++;
      if (cmd == "z") {
        cmds.push("Z");
        x = ox;
        y = oy;
      } else {
        var cmu = cmd.toUpperCase();
        var ps = pc[cmu], reps = Typr.SVG._reps(ts, i, ps);
        for (var j = 0; j < reps; j++) {
          var xi = 0, yi = 0;
          if (cmd != cmu) {
            xi = x;
            yi = y;
          }
          if (cmu == "M") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("M");
            crds.push(x, y);
            ox = x;
            oy = y;
          } else if (cmu == "L") {
            x = xi + ts[i++];
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "H") {
            x = xi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "V") {
            y = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y);
          } else if (cmu == "C") {
            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else if (cmu == "S") {
            var co = Math.max(crds.length - 4, 0);
            var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
            var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y2, x3, y3);
            x = x3;
            y = y3;
          } else
            console.warn("Unknown SVG command " + cmd);
        }
      }
    }
  };
  Typr.SVG._reps = function(ts, off, ps) {
    var i = off;
    while (i < ts.length) {
      if (typeof ts[i] == "string")
        break;
      i += ps;
    }
    return (i - off) / ps;
  };
  if (Typr == null)
    Typr = {};
  if (Typr.U == null)
    Typr.U = {};
  Typr.U.codeToGlyph = function(font, code) {
    var cmap = font.cmap;
    for (var _i = 0, _a = [cmap.p0e4, cmap.p3e1, cmap.p3e10, cmap.p0e3, cmap.p1e0]; _i < _a.length; _i++) {
      var tind = _a[_i];
      if (tind == null)
        continue;
      var tab = cmap.tables[tind];
      if (tab.format == 0) {
        if (code >= tab.map.length)
          continue;
        return tab.map[code];
      } else if (tab.format == 4) {
        var sind = -1;
        for (var i = 0; i < tab.endCount.length; i++) {
          if (code <= tab.endCount[i]) {
            sind = i;
            break;
          }
        }
        if (sind == -1)
          continue;
        if (tab.startCount[sind] > code)
          continue;
        var gli = 0;
        if (tab.idRangeOffset[sind] != 0) {
          gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
        } else {
          gli = code + tab.idDelta[sind];
        }
        return gli & 65535;
      } else if (tab.format == 12) {
        if (code > tab.groups[tab.groups.length - 1][1])
          continue;
        for (var i = 0; i < tab.groups.length; i++) {
          var grp = tab.groups[i];
          if (grp[0] <= code && code <= grp[1])
            return grp[2] + (code - grp[0]);
        }
        continue;
      } else {
        throw "unknown cmap table format " + tab.format;
      }
    }
    return 0;
  };
  Typr.U.glyphToPath = function(font, gid) {
    var path = { cmds: [], crds: [] };
    if (font.SVG && font.SVG.entries[gid]) {
      var p = font.SVG.entries[gid];
      if (p == null)
        return path;
      if (typeof p == "string") {
        p = Typr.SVG.toPath(p);
        font.SVG.entries[gid] = p;
      }
      return p;
    } else if (font.CFF) {
      var state = { x: 0, y: 0, stack: [], nStems: 0, haveWidth: false, width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0, open: false };
      var cff = font.CFF, pdct = font.CFF.Private;
      if (cff.ROS) {
        var gi = 0;
        while (cff.FDSelect[gi + 2] <= gid)
          gi += 2;
        pdct = cff.FDArray[cff.FDSelect[gi + 1]].Private;
      }
      Typr.U._drawCFF(font.CFF.CharStrings[gid], state, cff, pdct, path);
    } else if (font.glyf) {
      Typr.U._drawGlyf(gid, font, path);
    }
    return path;
  };
  Typr.U._drawGlyf = function(gid, font, path) {
    var gl = font.glyf[gid];
    if (gl == null)
      gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
    if (gl != null) {
      if (gl.noc > -1) {
        Typr.U._simpleGlyph(gl, path);
      } else {
        Typr.U._compoGlyph(gl, font, path);
      }
    }
  };
  Typr.U._simpleGlyph = function(gl, p) {
    for (var c = 0; c < gl.noc; c++) {
      var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
      var il = gl.endPts[c];
      for (var i = i0; i <= il; i++) {
        var pr = i == i0 ? il : i - 1;
        var nx = i == il ? i0 : i + 1;
        var onCurve = gl.flags[i] & 1;
        var prOnCurve = gl.flags[pr] & 1;
        var nxOnCurve = gl.flags[nx] & 1;
        var x = gl.xs[i], y = gl.ys[i];
        if (i == i0) {
          if (onCurve) {
            if (prOnCurve) {
              Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
            } else {
              Typr.U.P.moveTo(p, x, y);
              continue;
            }
          } else {
            if (prOnCurve) {
              Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
            } else {
              Typr.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
            }
          }
        }
        if (onCurve) {
          if (prOnCurve)
            Typr.U.P.lineTo(p, x, y);
        } else {
          if (nxOnCurve) {
            Typr.U.P.qcurveTo(p, x, y, gl.xs[nx], gl.ys[nx]);
          } else {
            Typr.U.P.qcurveTo(p, x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2);
          }
        }
      }
      Typr.U.P.closePath(p);
    }
  };
  Typr.U._compoGlyph = function(gl, font, p) {
    for (var j = 0; j < gl.parts.length; j++) {
      var path = { cmds: [], crds: [] };
      var prt = gl.parts[j];
      Typr.U._drawGlyf(prt.glyphIndex, font, path);
      var m = prt.m;
      for (var i = 0; i < path.crds.length; i += 2) {
        var x = path.crds[i], y = path.crds[i + 1];
        p.crds.push(x * m.a + y * m.b + m.tx);
        p.crds.push(x * m.c + y * m.d + m.ty);
      }
      for (var i = 0; i < path.cmds.length; i++) {
        p.cmds.push(path.cmds[i]);
      }
    }
  };
  Typr.U._getGlyphClass = function(g, cd) {
    var intr = Typr._lctf.getInterval(cd, g);
    return intr == -1 ? 0 : cd[intr + 2];
  };
  Typr.U.getPairAdjustment = function(font, g1, g2) {
    var hasGPOSkern = false;
    if (font.GPOS) {
      var gpos = font["GPOS"];
      var llist = gpos.lookupList, flist = gpos.featureList;
      var tused = [];
      for (var i = 0; i < flist.length; i++) {
        var fl = flist[i];
        if (fl.tag != "kern")
          continue;
        hasGPOSkern = true;
        for (var ti = 0; ti < fl.tab.length; ti++) {
          if (tused[fl.tab[ti]])
            continue;
          tused[fl.tab[ti]] = true;
          var tab = llist[fl.tab[ti]];
          for (var j = 0; j < tab.tabs.length; j++) {
            if (tab.tabs[j] == null)
              continue;
            var ltab = tab.tabs[j], ind;
            if (ltab.coverage) {
              ind = Typr._lctf.coverageIndex(ltab.coverage, g1);
              if (ind == -1)
                continue;
            }
            if (tab.ltype == 1) ;
            else if (tab.ltype == 2) {
              var adj = null;
              if (ltab.fmt == 1) {
                var right = ltab.pairsets[ind];
                for (var i = 0; i < right.length; i++) {
                  if (right[i].gid2 == g2)
                    adj = right[i];
                }
              } else if (ltab.fmt == 2) {
                var c1 = Typr.U._getGlyphClass(g1, ltab.classDef1);
                var c2 = Typr.U._getGlyphClass(g2, ltab.classDef2);
                adj = ltab.matrix[c1][c2];
              }
              if (adj) {
                var offset = 0;
                if (adj.val1 && adj.val1[2])
                  offset += adj.val1[2];
                if (adj.val2 && adj.val2[0])
                  offset += adj.val2[0];
                return offset;
              }
            }
          }
        }
      }
    }
    if (font.kern && !hasGPOSkern) {
      var ind1 = font.kern.glyph1.indexOf(g1);
      if (ind1 != -1) {
        var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
        if (ind2 != -1)
          return font.kern.rval[ind1].vals[ind2];
      }
    }
    return 0;
  };
  Typr.U.stringToGlyphs = function(font, str) {
    var gls = [];
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      if (cc > 65535)
        i++;
      gls.push(Typr.U.codeToGlyph(font, cc));
    }
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      if (cc == 2367) {
        var t = gls[i - 1];
        gls[i - 1] = gls[i];
        gls[i] = t;
      }
      if (cc > 65535)
        i++;
    }
    var gsub = font["GSUB"];
    if (gsub == null)
      return gls;
    var llist = gsub.lookupList, flist = gsub.featureList;
    var cligs = [
      "rlig",
      "liga",
      "mset",
      "isol",
      "init",
      "fina",
      "medi",
      "half",
      "pres",
      "blws"
      /* Tibetan fonts like Himalaya.ttf */
    ];
    var tused = [];
    for (var fi = 0; fi < flist.length; fi++) {
      var fl = flist[fi];
      if (cligs.indexOf(fl.tag) == -1)
        continue;
      for (var ti = 0; ti < fl.tab.length; ti++) {
        if (tused[fl.tab[ti]])
          continue;
        tused[fl.tab[ti]] = true;
        var tab = llist[fl.tab[ti]];
        for (var ci = 0; ci < gls.length; ci++) {
          var feat = Typr.U._getWPfeature(str, ci);
          if ("isol,init,fina,medi".indexOf(fl.tag) != -1 && fl.tag != feat)
            continue;
          Typr.U._applySubs(gls, ci, tab, llist);
        }
      }
    }
    return gls;
  };
  Typr.U._getWPfeature = function(str, ci) {
    var wsep = '\n	" ,.:;!?()  ،';
    var R = "آأؤإاةدذرزوٱٲٳٵٶٷڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙۀۃۄۅۆۇۈۉۊۋۍۏےۓەۮۯܐܕܖܗܘܙܞܨܪܬܯݍݙݚݛݫݬݱݳݴݸݹࡀࡆࡇࡉࡔࡧࡩࡪࢪࢫࢬࢮࢱࢲࢹૅેૉ૊૎૏ૐ૑૒૝ૡ૤૯஁ஃ஄அஉ஌எஏ஑னப஫஬";
    var L = "ꡲ્૗";
    var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
    var srgt = ci == str.length - 1 || wsep.indexOf(str[ci + 1]) != -1;
    if (!slft && R.indexOf(str[ci - 1]) != -1)
      slft = true;
    if (!srgt && R.indexOf(str[ci]) != -1)
      srgt = true;
    if (!srgt && L.indexOf(str[ci + 1]) != -1)
      srgt = true;
    if (!slft && L.indexOf(str[ci]) != -1)
      slft = true;
    var feat = null;
    if (slft) {
      feat = srgt ? "isol" : "init";
    } else {
      feat = srgt ? "fina" : "medi";
    }
    return feat;
  };
  Typr.U._applySubs = function(gls, ci, tab, llist) {
    var rlim = gls.length - ci - 1;
    for (var j = 0; j < tab.tabs.length; j++) {
      if (tab.tabs[j] == null)
        continue;
      var ltab = tab.tabs[j], ind;
      if (ltab.coverage) {
        ind = Typr._lctf.coverageIndex(ltab.coverage, gls[ci]);
        if (ind == -1)
          continue;
      }
      if (tab.ltype == 1) {
        gls[ci];
        if (ltab.fmt == 1)
          gls[ci] = gls[ci] + ltab.delta;
        else
          gls[ci] = ltab.newg[ind];
      } else if (tab.ltype == 4) {
        var vals = ltab.vals[ind];
        for (var k = 0; k < vals.length; k++) {
          var lig = vals[k], rl = lig.chain.length;
          if (rl > rlim)
            continue;
          var good = true, em1 = 0;
          for (var l = 0; l < rl; l++) {
            while (gls[ci + em1 + (1 + l)] == -1)
              em1++;
            if (lig.chain[l] != gls[ci + em1 + (1 + l)])
              good = false;
          }
          if (!good)
            continue;
          gls[ci] = lig.nglyph;
          for (var l = 0; l < rl + em1; l++)
            gls[ci + l + 1] = -1;
          break;
        }
      } else if (tab.ltype == 5 && ltab.fmt == 2) {
        var cind = Typr._lctf.getInterval(ltab.cDef, gls[ci]);
        var cls = ltab.cDef[cind + 2], scs = ltab.scset[cls];
        for (var i = 0; i < scs.length; i++) {
          var sc = scs[i], inp = sc.input;
          if (inp.length > rlim)
            continue;
          var good = true;
          for (var l = 0; l < inp.length; l++) {
            var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);
            if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l]) {
              good = false;
              break;
            }
          }
          if (!good)
            continue;
          var lrs = sc.substLookupRecords;
          for (var k = 0; k < lrs.length; k += 2) {
            lrs[k];
            lrs[k + 1];
          }
        }
      } else if (tab.ltype == 6 && ltab.fmt == 3) {
        if (!Typr.U._glsCovered(gls, ltab.backCvg, ci - ltab.backCvg.length))
          continue;
        if (!Typr.U._glsCovered(gls, ltab.inptCvg, ci))
          continue;
        if (!Typr.U._glsCovered(gls, ltab.ahedCvg, ci + ltab.inptCvg.length))
          continue;
        var lr = ltab.lookupRec;
        for (var i = 0; i < lr.length; i += 2) {
          var cind = lr[i], tab2 = llist[lr[i + 1]];
          Typr.U._applySubs(gls, ci + cind, tab2, llist);
        }
      }
    }
  };
  Typr.U._glsCovered = function(gls, cvgs, ci) {
    for (var i = 0; i < cvgs.length; i++) {
      var ind = Typr._lctf.coverageIndex(cvgs[i], gls[ci + i]);
      if (ind == -1)
        return false;
    }
    return true;
  };
  Typr.U.glyphsToPath = function(font, gls, clr) {
    var tpath = { cmds: [], crds: [] };
    var x = 0;
    for (var i = 0; i < gls.length; i++) {
      var gid = gls[i];
      if (gid == -1)
        continue;
      var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
      var path = Typr.U.glyphToPath(font, gid);
      for (var j = 0; j < path.crds.length; j += 2) {
        tpath.crds.push(path.crds[j] + x);
        tpath.crds.push(path.crds[j + 1]);
      }
      if (clr)
        tpath.cmds.push(clr);
      for (var j = 0; j < path.cmds.length; j++)
        tpath.cmds.push(path.cmds[j]);
      if (clr)
        tpath.cmds.push("X");
      x += font.hmtx.aWidth[gid];
      if (i < gls.length - 1)
        x += Typr.U.getPairAdjustment(font, gid, gid2);
    }
    return tpath;
  };
  Typr.U.pathToSVG = function(path, prec) {
    if (prec == null)
      prec = 5;
    var out = [], co = 0, lmap = { "M": 2, "L": 2, "Q": 4, "C": 6 };
    for (var i = 0; i < path.cmds.length; i++) {
      var cmd = path.cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
      out.push(cmd);
      while (co < cn) {
        var c = path.crds[co++];
        out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
      }
    }
    return out.join("");
  };
  Typr.U.pathToContext = function(path, ctx) {
    var c = 0, crds = path.crds;
    for (var j = 0; j < path.cmds.length; j++) {
      var cmd = path.cmds[j];
      if (cmd == "M") {
        ctx.moveTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "L") {
        ctx.lineTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "C") {
        ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
        c += 6;
      } else if (cmd == "Q") {
        ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
        c += 4;
      } else if (cmd.charAt(0) == "#") {
        ctx.beginPath();
        ctx.fillStyle = cmd;
      } else if (cmd == "Z") {
        ctx.closePath();
      } else if (cmd == "X") {
        ctx.fill();
      }
    }
  };
  Typr.U.P = {};
  Typr.U.P.moveTo = function(p, x, y) {
    p.cmds.push("M");
    p.crds.push(x, y);
  };
  Typr.U.P.lineTo = function(p, x, y) {
    p.cmds.push("L");
    p.crds.push(x, y);
  };
  Typr.U.P.curveTo = function(p, a, b, c, d, e, f) {
    p.cmds.push("C");
    p.crds.push(a, b, c, d, e, f);
  };
  Typr.U.P.qcurveTo = function(p, a, b, c, d) {
    p.cmds.push("Q");
    p.crds.push(a, b, c, d);
  };
  Typr.U.P.closePath = function(p) {
    p.cmds.push("Z");
  };
  Typr.U._drawCFF = function(cmds, state, font, pdct, p) {
    var stack = state.stack;
    var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
    var i = 0;
    var x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
    var o = { val: 0, size: 0 };
    while (i < cmds.length) {
      Typr.CFF.getCharString(cmds, i, o);
      var v = o.val;
      i += o.size;
      if (v == "o1" || v == "o18") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o3" || v == "o23") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v == "o4") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
          haveWidth = true;
        }
        if (open)
          Typr.U.P.closePath(p);
        y += stack.pop();
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o5") {
        while (stack.length > 0) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o6" || v == "o7") {
        var count = stack.length;
        var isX = v == "o6";
        for (var j = 0; j < count; j++) {
          var sval = stack.shift();
          if (isX) {
            x += sval;
          } else {
            y += sval;
          }
          isX = !isX;
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o8" || v == "o24") {
        var count = stack.length;
        var index = 0;
        while (index + 6 <= count) {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 6;
        }
        if (v == "o24") {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
      } else if (v == "o11") {
        break;
      } else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
        if (v == "o1234") {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = y;
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1235") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          y = c4y + stack.shift();
          stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1236") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
        if (v == "o1237") {
          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
            x = c4x + stack.shift();
          } else {
            y = c4y + stack.shift();
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
        }
      } else if (v == "o14") {
        if (stack.length > 0 && !haveWidth) {
          width = stack.shift() + font.nominalWidthX;
          haveWidth = true;
        }
        if (stack.length == 4) {
          var adx = stack.shift();
          var ady = stack.shift();
          var bchar = stack.shift();
          var achar = stack.shift();
          var bind = Typr.CFF.glyphBySE(font, bchar);
          var aind = Typr.CFF.glyphBySE(font, achar);
          Typr.U._drawCFF(font.CharStrings[bind], state, font, pdct, p);
          state.x = adx;
          state.y = ady;
          Typr.U._drawCFF(font.CharStrings[aind], state, font, pdct, p);
        }
        if (open) {
          Typr.U.P.closePath(p);
          open = false;
        }
      } else if (v == "o19" || v == "o20") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
        i += nStems + 7 >> 3;
      } else if (v == "o21") {
        if (stack.length > 2 && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
          haveWidth = true;
        }
        y += stack.pop();
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o22") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
          haveWidth = true;
        }
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y);
        open = true;
      } else if (v == "o25") {
        while (stack.length > 6) {
          x += stack.shift();
          y += stack.shift();
          Typr.U.P.lineTo(p, x, y);
        }
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y = c2y + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
      } else if (v == "o26") {
        if (stack.length % 2) {
          x += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x;
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x;
          y = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o27") {
        if (stack.length % 2) {
          y += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y;
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        }
      } else if (v == "o10" || v == "o29") {
        var obj = v == "o10" ? pdct : font;
        if (stack.length == 0) {
          console.warn("error: empty stack");
        } else {
          var ind = stack.pop();
          var subr = obj.Subrs[ind + obj.Bias];
          state.x = x;
          state.y = y;
          state.nStems = nStems;
          state.haveWidth = haveWidth;
          state.width = width;
          state.open = open;
          Typr.U._drawCFF(subr, state, font, pdct, p);
          x = state.x;
          y = state.y;
          nStems = state.nStems;
          haveWidth = state.haveWidth;
          width = state.width;
          open = state.open;
        }
      } else if (v == "o30" || v == "o31") {
        var count, count1 = stack.length;
        var index = 0;
        var alternate = v == "o31";
        count = count1 & -3;
        index += count1 - count;
        while (index < count) {
          if (alternate) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            if (count - index == 5) {
              x = c2x + stack.shift();
              index++;
            } else {
              x = c2x;
            }
            alternate = false;
          } else {
            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            if (count - index == 5) {
              y = c2y + stack.shift();
              index++;
            } else {
              y = c2y;
            }
            alternate = true;
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
          index += 4;
        }
      } else if ((v + "").charAt(0) == "o") {
        console.warn("Unknown operation: " + v, cmds);
        throw v;
      } else
        stack.push(v);
    }
    state.x = x;
    state.y = y;
    state.nStems = nStems;
    state.haveWidth = haveWidth;
    state.width = width;
    state.open = open;
  };
  Typr$1.Typr = Typr;
  var Typr_js_1 = Typr$1;
  var friendlyTags = { "aalt": "Access All Alternates", "abvf": "Above-base Forms", "abvm": "Above - base Mark Positioning", "abvs": "Above - base Substitutions", "afrc": "Alternative Fractions", "akhn": "Akhands", "blwf": "Below - base Forms", "blwm": "Below - base Mark Positioning", "blws": "Below - base Substitutions", "calt": "Contextual Alternates", "case": "Case - Sensitive Forms", "ccmp": "Glyph Composition / Decomposition", "cfar": "Conjunct Form After Ro", "cjct": "Conjunct Forms", "clig": "Contextual Ligatures", "cpct": "Centered CJK Punctuation", "cpsp": "Capital Spacing", "cswh": "Contextual Swash", "curs": "Cursive Positioning", "c2pc": "Petite Capitals From Capitals", "c2sc": "Small Capitals From Capitals", "dist": "Distances", "dlig": "Discretionary Ligatures", "dnom": "Denominators", "dtls": "Dotless Forms", "expt": "Expert Forms", "falt": "Final Glyph on Line Alternates", "fin2": "Terminal Forms #2", "fin3": "Terminal Forms #3", "fina": "Terminal Forms", "flac": "Flattened accent forms", "frac": "Fractions", "fwid": "Full Widths", "half": "Half Forms", "haln": "Halant Forms", "halt": "Alternate Half Widths", "hist": "Historical Forms", "hkna": "Horizontal Kana Alternates", "hlig": "Historical Ligatures", "hngl": "Hangul", "hojo": "Hojo Kanji Forms(JIS X 0212 - 1990 Kanji Forms)", "hwid": "Half Widths", "init": "Initial Forms", "isol": "Isolated Forms", "ital": "Italics", "jalt": "Justification Alternates", "jp78": "JIS78 Forms", "jp83": "JIS83 Forms", "jp90": "JIS90 Forms", "jp04": "JIS2004 Forms", "kern": "Kerning", "lfbd": "Left Bounds", "liga": "Standard Ligatures", "ljmo": "Leading Jamo Forms", "lnum": "Lining Figures", "locl": "Localized Forms", "ltra": "Left - to - right alternates", "ltrm": "Left - to - right mirrored forms", "mark": "Mark Positioning", "med2": "Medial Forms #2", "medi": "Medial Forms", "mgrk": "Mathematical Greek", "mkmk": "Mark to Mark Positioning", "mset": "Mark Positioning via Substitution", "nalt": "Alternate Annotation Forms", "nlck": "NLC Kanji Forms", "nukt": "Nukta Forms", "numr": "Numerators", "onum": "Oldstyle Figures", "opbd": "Optical Bounds", "ordn": "Ordinals", "ornm": "Ornaments", "palt": "Proportional Alternate Widths", "pcap": "Petite Capitals", "pkna": "Proportional Kana", "pnum": "Proportional Figures", "pref": "Pre - Base Forms", "pres": "Pre - base Substitutions", "pstf": "Post - base Forms", "psts": "Post - base Substitutions", "pwid": "Proportional Widths", "qwid": "Quarter Widths", "rand": "Randomize", "rclt": "Required Contextual Alternates", "rkrf": "Rakar Forms", "rlig": "Required Ligatures", "rphf": "Reph Forms", "rtbd": "Right Bounds", "rtla": "Right - to - left alternates", "rtlm": "Right - to - left mirrored forms", "ruby": "Ruby Notation Forms", "rvrn": "Required Variation Alternates", "salt": "Stylistic Alternates", "sinf": "Scientific Inferiors", "size": "Optical size", "smcp": "Small Capitals", "smpl": "Simplified Forms", "ssty": "Math script style alternates", "stch": "Stretching Glyph Decomposition", "subs": "Subscript", "sups": "Superscript", "swsh": "Swash", "titl": "Titling", "tjmo": "Trailing Jamo Forms", "tnam": "Traditional Name Forms", "tnum": "Tabular Figures", "trad": "Traditional Forms", "twid": "Third Widths", "unic": "Unicase", "valt": "Alternate Vertical Metrics", "vatu": "Vattu Variants", "vert": "Vertical Writing", "vhal": "Alternate Vertical Half Metrics", "vjmo": "Vowel Jamo Forms", "vkna": "Vertical Kana Alternates", "vkrn": "Vertical Kerning", "vpal": "Proportional Alternate Vertical Metrics", "vrt2": "Vertical Alternates and Rotation", "vrtr": "Vertical Alternates for Rotation", "zero": "Slashed Zero" };
  var Font = (
    /** @class */
    function() {
      function Font2(data) {
        var obj = Typr_js_1.Typr.parse(data);
        if (!obj.length || typeof obj[0] !== "object" || typeof obj[0].hasOwnProperty !== "function") {
          throw "unable to parse font";
        }
        for (var n in obj[0]) {
          this[n] = obj[0][n];
        }
        this.enabledGSUB = {};
      }
      Font2.prototype.getFamilyName = function() {
        return this.name && (this.name.typoFamilyName || this.name.fontFamily) || "";
      };
      Font2.prototype.getSubFamilyName = function() {
        return this.name && (this.name.typoSubfamilyName || this.name.fontSubfamily) || "";
      };
      Font2.prototype.glyphToPath = function(gid) {
        return Typr_js_1.Typr.U.glyphToPath(this, gid);
      };
      Font2.prototype.getPairAdjustment = function(gid1, gid2) {
        return Typr_js_1.Typr.U.getPairAdjustment(this, gid1, gid2);
      };
      Font2.prototype.stringToGlyphs = function(str) {
        return Typr_js_1.Typr.U.stringToGlyphs(this, str);
      };
      Font2.prototype.glyphsToPath = function(gls) {
        return Typr_js_1.Typr.U.glyphsToPath(this, gls);
      };
      Font2.prototype.pathToSVG = function(path, prec) {
        return Typr_js_1.Typr.U.pathToSVG(path, prec);
      };
      Font2.prototype.pathToContext = function(path, ctx) {
        return Typr_js_1.Typr.U.pathToContext(path, ctx);
      };
      Font2.prototype.lookupFriendlyName = function(table, feature) {
        if (this[table] !== void 0) {
          var tbl = this[table];
          var feat = tbl.featureList[feature];
          return this.featureFriendlyName(feat);
        }
        return "";
      };
      Font2.prototype.featureFriendlyName = function(feature) {
        if (friendlyTags[feature.tag]) {
          return friendlyTags[feature.tag];
        }
        if (feature.tag.match(/ss[0-2][0-9]/)) {
          var name_1 = "Stylistic Set " + Number(feature.tag.substr(2, 2)).toString();
          if (feature.featureParams) {
            var version = Typr_js_1.Typr._bin.readUshort(this._data, feature.featureParams);
            if (version === 0) {
              var nameID = Typr_js_1.Typr._bin.readUshort(this._data, feature.featureParams + 2);
              if (this.name && this.name[nameID] !== void 0) {
                return name_1 + " - " + this.name[nameID];
              }
            }
          }
          return name_1;
        }
        if (feature.tag.match(/cv[0-9][0-9]/)) {
          return "Character Variant " + Number(feature.tag.substr(2, 2)).toString();
        }
        return "";
      };
      Font2.prototype.enableGSUB = function(featureNumber) {
        if (this.GSUB) {
          var feature = this.GSUB.featureList[featureNumber];
          if (feature) {
            for (var i = 0; i < feature.tab.length; ++i) {
              this.enabledGSUB[feature.tab[i]] = (this.enabledGSUB[feature.tab[i]] || 0) + 1;
            }
          }
        }
      };
      Font2.prototype.disableGSUB = function(featureNumber) {
        if (this.GSUB) {
          var feature = this.GSUB.featureList[featureNumber];
          if (feature) {
            for (var i = 0; i < feature.tab.length; ++i) {
              if (this.enabledGSUB[feature.tab[i]] > 1) {
                --this.enabledGSUB[feature.tab[i]];
              } else {
                delete this.enabledGSUB[feature.tab[i]];
              }
            }
          }
        }
      };
      Font2.prototype.codeToGlyph = function(code) {
        var g = Typr_js_1.Typr.U.codeToGlyph(this, code);
        if (this.GSUB) {
          var gls = [g];
          for (var n in this.enabledGSUB) {
            var l = this.GSUB.lookupList[n];
            Typr_js_1.Typr.U._applySubs(gls, 0, l, this.GSUB.lookupList);
          }
          if (gls.length === 1)
            return gls[0];
        }
        return g;
      };
      return Font2;
    }()
  );
  var Font_1 = Font;
  var md5$1 = { exports: {} };
  var crypt = { exports: {} };
  (function() {
    var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", crypt$1 = {
      // Bit-wise rotation left
      rotl: function(n, b) {
        return n << b | n >>> 32 - b;
      },
      // Bit-wise rotation right
      rotr: function(n, b) {
        return n << 32 - b | n >>> b;
      },
      // Swap big-endian to little-endian and vice versa
      endian: function(n) {
        if (n.constructor == Number) {
          return crypt$1.rotl(n, 8) & 16711935 | crypt$1.rotl(n, 24) & 4278255360;
        }
        for (var i = 0; i < n.length; i++)
          n[i] = crypt$1.endian(n[i]);
        return n;
      },
      // Generate an array of any length of random bytes
      randomBytes: function(n) {
        for (var bytes = []; n > 0; n--)
          bytes.push(Math.floor(Math.random() * 256));
        return bytes;
      },
      // Convert a byte array to big-endian 32-bit words
      bytesToWords: function(bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
          words[b >>> 5] |= bytes[i] << 24 - b % 32;
        return words;
      },
      // Convert big-endian 32-bit words to a byte array
      wordsToBytes: function(words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
          bytes.push(words[b >>> 5] >>> 24 - b % 32 & 255);
        return bytes;
      },
      // Convert a byte array to a hex string
      bytesToHex: function(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 15).toString(16));
        }
        return hex.join("");
      },
      // Convert a hex string to a byte array
      hexToBytes: function(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
      },
      // Convert a byte array to a base-64 string
      bytesToBase64: function(bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
          var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
          for (var j = 0; j < 4; j++)
            if (i * 8 + j * 6 <= bytes.length * 8)
              base64.push(base64map.charAt(triplet >>> 6 * (3 - j) & 63));
            else
              base64.push("=");
        }
        return base64.join("");
      },
      // Convert a base-64 string to a byte array
      base64ToBytes: function(base64) {
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
          if (imod4 == 0) continue;
          bytes.push((base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
        }
        return bytes;
      }
    };
    crypt.exports = crypt$1;
  })();
  var cryptExports = crypt.exports;
  var charenc = {
    // UTF-8 encoding
    utf8: {
      // Convert a string to a byte array
      stringToBytes: function(str) {
        return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
      },
      // Convert a byte array to a string
      bytesToString: function(bytes) {
        return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
      }
    },
    // Binary encoding
    bin: {
      // Convert a string to a byte array
      stringToBytes: function(str) {
        for (var bytes = [], i = 0; i < str.length; i++)
          bytes.push(str.charCodeAt(i) & 255);
        return bytes;
      },
      // Convert a byte array to a string
      bytesToString: function(bytes) {
        for (var str = [], i = 0; i < bytes.length; i++)
          str.push(String.fromCharCode(bytes[i]));
        return str.join("");
      }
    }
  };
  var charenc_1 = charenc;
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  var isBuffer_1 = function(obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
  };
  function isBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
  }
  function isSlowBuffer(obj) {
    return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
  }
  (function() {
    var crypt2 = cryptExports, utf8 = charenc_1.utf8, isBuffer2 = isBuffer_1, bin = charenc_1.bin, md52 = function(message, options) {
      if (message.constructor == String)
        if (options && options.encoding === "binary")
          message = bin.stringToBytes(message);
        else
          message = utf8.stringToBytes(message);
      else if (isBuffer2(message))
        message = Array.prototype.slice.call(message, 0);
      else if (!Array.isArray(message) && message.constructor !== Uint8Array)
        message = message.toString();
      var m = crypt2.bytesToWords(message), l = message.length * 8, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
      for (var i = 0; i < m.length; i++) {
        m[i] = (m[i] << 8 | m[i] >>> 24) & 16711935 | (m[i] << 24 | m[i] >>> 8) & 4278255360;
      }
      m[l >>> 5] |= 128 << l % 32;
      m[(l + 64 >>> 9 << 4) + 14] = l;
      var FF = md52._ff, GG = md52._gg, HH = md52._hh, II = md52._ii;
      for (var i = 0; i < m.length; i += 16) {
        var aa = a, bb = b, cc = c, dd = d;
        a = FF(a, b, c, d, m[i + 0], 7, -680876936);
        d = FF(d, a, b, c, m[i + 1], 12, -389564586);
        c = FF(c, d, a, b, m[i + 2], 17, 606105819);
        b = FF(b, c, d, a, m[i + 3], 22, -1044525330);
        a = FF(a, b, c, d, m[i + 4], 7, -176418897);
        d = FF(d, a, b, c, m[i + 5], 12, 1200080426);
        c = FF(c, d, a, b, m[i + 6], 17, -1473231341);
        b = FF(b, c, d, a, m[i + 7], 22, -45705983);
        a = FF(a, b, c, d, m[i + 8], 7, 1770035416);
        d = FF(d, a, b, c, m[i + 9], 12, -1958414417);
        c = FF(c, d, a, b, m[i + 10], 17, -42063);
        b = FF(b, c, d, a, m[i + 11], 22, -1990404162);
        a = FF(a, b, c, d, m[i + 12], 7, 1804603682);
        d = FF(d, a, b, c, m[i + 13], 12, -40341101);
        c = FF(c, d, a, b, m[i + 14], 17, -1502002290);
        b = FF(b, c, d, a, m[i + 15], 22, 1236535329);
        a = GG(a, b, c, d, m[i + 1], 5, -165796510);
        d = GG(d, a, b, c, m[i + 6], 9, -1069501632);
        c = GG(c, d, a, b, m[i + 11], 14, 643717713);
        b = GG(b, c, d, a, m[i + 0], 20, -373897302);
        a = GG(a, b, c, d, m[i + 5], 5, -701558691);
        d = GG(d, a, b, c, m[i + 10], 9, 38016083);
        c = GG(c, d, a, b, m[i + 15], 14, -660478335);
        b = GG(b, c, d, a, m[i + 4], 20, -405537848);
        a = GG(a, b, c, d, m[i + 9], 5, 568446438);
        d = GG(d, a, b, c, m[i + 14], 9, -1019803690);
        c = GG(c, d, a, b, m[i + 3], 14, -187363961);
        b = GG(b, c, d, a, m[i + 8], 20, 1163531501);
        a = GG(a, b, c, d, m[i + 13], 5, -1444681467);
        d = GG(d, a, b, c, m[i + 2], 9, -51403784);
        c = GG(c, d, a, b, m[i + 7], 14, 1735328473);
        b = GG(b, c, d, a, m[i + 12], 20, -1926607734);
        a = HH(a, b, c, d, m[i + 5], 4, -378558);
        d = HH(d, a, b, c, m[i + 8], 11, -2022574463);
        c = HH(c, d, a, b, m[i + 11], 16, 1839030562);
        b = HH(b, c, d, a, m[i + 14], 23, -35309556);
        a = HH(a, b, c, d, m[i + 1], 4, -1530992060);
        d = HH(d, a, b, c, m[i + 4], 11, 1272893353);
        c = HH(c, d, a, b, m[i + 7], 16, -155497632);
        b = HH(b, c, d, a, m[i + 10], 23, -1094730640);
        a = HH(a, b, c, d, m[i + 13], 4, 681279174);
        d = HH(d, a, b, c, m[i + 0], 11, -358537222);
        c = HH(c, d, a, b, m[i + 3], 16, -722521979);
        b = HH(b, c, d, a, m[i + 6], 23, 76029189);
        a = HH(a, b, c, d, m[i + 9], 4, -640364487);
        d = HH(d, a, b, c, m[i + 12], 11, -421815835);
        c = HH(c, d, a, b, m[i + 15], 16, 530742520);
        b = HH(b, c, d, a, m[i + 2], 23, -995338651);
        a = II(a, b, c, d, m[i + 0], 6, -198630844);
        d = II(d, a, b, c, m[i + 7], 10, 1126891415);
        c = II(c, d, a, b, m[i + 14], 15, -1416354905);
        b = II(b, c, d, a, m[i + 5], 21, -57434055);
        a = II(a, b, c, d, m[i + 12], 6, 1700485571);
        d = II(d, a, b, c, m[i + 3], 10, -1894986606);
        c = II(c, d, a, b, m[i + 10], 15, -1051523);
        b = II(b, c, d, a, m[i + 1], 21, -2054922799);
        a = II(a, b, c, d, m[i + 8], 6, 1873313359);
        d = II(d, a, b, c, m[i + 15], 10, -30611744);
        c = II(c, d, a, b, m[i + 6], 15, -1560198380);
        b = II(b, c, d, a, m[i + 13], 21, 1309151649);
        a = II(a, b, c, d, m[i + 4], 6, -145523070);
        d = II(d, a, b, c, m[i + 11], 10, -1120210379);
        c = II(c, d, a, b, m[i + 2], 15, 718787259);
        b = II(b, c, d, a, m[i + 9], 21, -343485551);
        a = a + aa >>> 0;
        b = b + bb >>> 0;
        c = c + cc >>> 0;
        d = d + dd >>> 0;
      }
      return crypt2.endian([a, b, c, d]);
    };
    md52._ff = function(a, b, c, d, x, s, t) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._gg = function(a, b, c, d, x, s, t) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._hh = function(a, b, c, d, x, s, t) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._ii = function(a, b, c, d, x, s, t) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
      return (n << s | n >>> 32 - s) + b;
    };
    md52._blocksize = 16;
    md52._digestsize = 16;
    md5$1.exports = function(message, options) {
      if (message === void 0 || message === null)
        throw new Error("Illegal argument " + message);
      var digestbytes = crypt2.wordsToBytes(md52(message, options));
      return options && options.asBytes ? digestbytes : options && options.asString ? bin.bytesToString(digestbytes) : crypt2.bytesToHex(digestbytes);
    };
  })();
  var md5Exports = md5$1.exports;
  const md5 = /* @__PURE__ */ getDefaultExportFromCjs(md5Exports);
  // @license      MIT
  const crackFont = async (iframeDocument) => {
    await decrypt(iframeDocument);
  };
  const decrypt = async (iframeDocument) => {
    let _tc, _b, _c;
    const styles = iframeDocument.querySelectorAll("style");
    let tip;
    for (let i = 0; i < styles.length; i++) {
      if ((_tc = styles[i].textContent) == null ? 0 : _tc.includes("font-cxsecret")) {
        tip = styles[i];
        break;
      }
    }
    if (!tip)
      return;
    const fontData = (_c = (_b = tip.textContent) == null ? 0 : _b.match(/base64,([\w\W]+?)'/)) == null ? 0 : _c[1];
    if (!fontData)
      return;
    const fontArray = base64ToUint8Array(fontData);
    const font = new Font_1(fontArray);
    const table = JSON.parse(GM_getResourceText("Table"));
    const match = {};
    for (let i = 19968; i < 40870; i++) {
      const glyph = font.codeToGlyph(i);
      if (!glyph)
        continue;
      const path = font.glyphToPath(glyph);
      const hash = md5(JSON.stringify(path)).slice(24);
      match[i] = table[hash];
    }
    const elements = iframeDocument.querySelectorAll(".font-cxsecret");
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      let html = el.innerHTML;
      for (const key in match) {
        const value = String.fromCharCode(match[key]);
        const regExp = new RegExp(String.fromCharCode(Number(key)), "g");
        html = html.replace(regExp, value);
      }
      el.innerHTML = html;
      el.classList.remove("font-cxsecret");
    }
    function base64ToUint8Array(base64) {
      const data = window.atob(base64);
      const buffer = new Uint8Array(data.length);
      for (let i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
      }
      return buffer;
    }
  };
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms * 1e3));
  };
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const request = (url, method = "GET", headers, data, onSuccess, onError) => {
    _GM_xmlhttpRequest({
      method,
      headers,
      url,
      // timeout: 20000, // 5秒超时
      data: method === "POST" ? data : null,
      onload: function(response) {
        if (response.status >= 200 && response.status < 300) {
          if (onSuccess) {
            const resp = JSON.parse(response.responseText);
            if (resp.code === 200) {
              onSuccess(resp.data);
            } else {
              onError(new Error(resp.msg));
            }
          }
        } else {
          if (onError) {
            onError(new Error(`Request failed with status ${response.status}`));
          }
        }
      },
      onerror: function(error) {
        if (onError) {
          onError(error);
        }
      }
    });
  };
  const inputNumberAttr = {
    step: 1,
    "step-strictly": true,
    size: "small"
  };
  const tabBars = [
    {
      value: "settings",
      label: "配置"
    },
    {
      value: "key",
      label: "卡密"
    },
    {
      value: "help",
      label: "帮助"
    },
    {
      value: "protocol",
      label: "协议"
    }
  ];
  const settings = [
    // {
    //   name: '自动下一题',
    //   desc: '开启后，自动进入下一题',
    //   value: 'autoNext',
    //   type: 'switch',
    // },
    // {
    //   name: '答题模式',
    //   desc: '只答题，不做其他',
    //   value: 'answeringMode',
    //   type: 'switch',
    // },
    {
      name: "答题正确率",
      desc: "满足答题率后自动提交",
      value: "rate",
      type: "input"
    },
    {
      name: "答题后切换间隔",
      desc: "答题、切换间隔(秒)",
      value: "interval",
      type: "inputNumber"
    }
  ];
  const guide = [
    // {
    //   index: 1,
    //   content: '本脚本完全免费，无任何付费项目',
    // },
    {
      index: 1,
      content: "使用第三方题库资源，内容准确率非100%，仅供参考"
    },
    {
      index: 2,
      content: "请先打开需要处理的课程视频或作业页面"
    },
    {
      index: 3,
      content: "根据实际需求，配置相应的自动化选项"
    },
    {
      index: 4,
      content: "进入答题页面后，等待解析完成后自动进入答题流程"
    },
    {
      index: 5,
      content: "自动答题需要填写卡密，获取方法如下"
    },
    {
      index: 6,
      content: "微信搜索「AT搜题」公众号，免费获取卡密"
    },
    {
      index: 7,
      content: "点击「答题」标签页 → 输入卡密并验证 → 刷新页面"
    }
  ];
  const protocol = [
    {
      index: 1,
      content: "本脚本仅供学习和研究目的使用，并应在24小时内删除。脚本的使用不应违反任何法律法规及学术道德标准。"
    },
    {
      index: 2,
      content: "用户在使用脚本时，必须遵守所有适用的法律法规。任何由于使用脚本而引起的违法行为或不当行为，其产生的一切后果由用户自行承担。"
    },
    {
      index: 4,
      content: "开发者不对用户使用脚本所产生的任何直接或间接后果负责。用户应自行评估使用脚本的风险，并对任何可能的负面影响承担全责。"
    },
    {
      index: 5,
      content: "本声明的目的在于提醒用户注意相关法律法规与风险，确保用户在明智、合法的前提下使用脚本。"
    },
    {
      index: 6,
      content: "如用户在使用脚本的过程中有任何疑问，建议立即停止使用，并删除所有相关文件。"
    },
    {
      index: 7,
      content: "本免责声明的最终解释权归脚本开发者所有。"
    }
  ];
  const types = {
    0: "单选题",
    1: "多选题",
    3: "判断题"
  };
  const simulateRequest = async (url, params, _self, keys) => {
    return new Promise((resolve) => {
      const data = JSON.stringify({
        ...params,
        typeText: types[params.type],
        key: keys
      });
      let { author, version } = GM_info.script;
      request(
        `${url}?s=${author}&v=${version}`,
        "POST",
        {
          "Content-Type": "application/json",
          referer: params.refer,
          u: _self.uid || _self.getCookie("UID") || _self.getCookie("_uid") || "",
          t: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3).toString()
        },
        data,
        (response) => {
          resolve(response);
        },
        (error) => {
          resolve(error);
        }
      );
    });
  };
  const _hoisted_1 = { class: "tab-bar" };
  const _hoisted_2 = ["size", "onClick"];
  const _hoisted_3 = { class: "content-body" };
  const _hoisted_4 = {
    key: 0,
    class: "validate-key body-box"
  };
  const _hoisted_5 = { class: "card-title" };
  const _hoisted_6 = { style: { "margin-top": "16px" } };
  const _hoisted_7 = { class: "card-title" };
  const _hoisted_8 = {
    key: 1,
    class: "body-box"
  };
  const _hoisted_9 = { class: "card-title" };
  const _hoisted_10 = { class: "settings-main" };
  const _hoisted_11 = { class: "title" };
  const _hoisted_12 = { class: "title-text" };
  const _hoisted_13 = {
    key: 2,
    class: "guide body-box"
  };
  const _hoisted_14 = { class: "card-title" };
  const _hoisted_15 = { class: "guide-content" };
  const _hoisted_16 = { class: "guide-content-index" };
  const _hoisted_17 = { class: "guide-content-content" };
  const _hoisted_18 = {
    key: 3,
    class: "guide body-box"
  };
  const _hoisted_19 = { class: "card-title" };
  const _hoisted_20 = { class: "guide-content" };
  const _hoisted_21 = { class: "guide-content-index" };
  const _hoisted_22 = { class: "guide-content-content" };
  const _hoisted_23 = {
    key: 4,
    class: "log-generation body-box"
  };
  const _hoisted_24 = { class: "card-title" };
  const _hoisted_25 = { class: "log-generation-content" };
  const _hoisted_26 = { class: "value" };
  const _sfc_main$1 = {
    __name: "index",
    setup(__props) {
      const userInfoStore = useUserInfoStore();
      const configStore = vue.reactive({
        isShow: true,
        platformParams: {
          cx: {
            autoNext: true,
            // 自动切换
            answeringMode: false
            // 只答题
          }
        },
        // 入参
        otherParams: {
          interval: false,
          // 答题后切换间隔
          timeInterval: 3,
          // 切换、答题间隔，单位秒
          rate: 85,
          // 正确率达到多少自动提交
          name: "其他参数"
        },
        rate: 80,
        // 完成率
        currentPageTabs: [],
        // 当前任务章节 tab
        nowIdx: 0,
        // 当前tab索引
        title: "AT助手",
        logData: [],
        // 日志
        isfalse: false,
        sizes: "small",
        activeTab: "settings",
        // avatarSrc:
        //   'https://public.readdy.ai/ai/img_res/2d58579252345596c10002ce85d4f6f8.jpg',
        workUrl: window.location.href,
        key: userInfoStore.key,
        // keys
        validatedKeys: false,
        // 是否验证
        url: "https://autohelper.top/prod-api/question/dpQuestion"
      });
      const column = [
        {
          prop: "title",
          label: "题目"
        },
        {
          prop: "answer",
          label: "答案",
          width: "140"
        }
      ];
      const __defProp = Object.defineProperty;
      const __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
      }) : obj[key] = value;
      const __publicField = (obj, key, value) => {
        __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
        return value;
      };
      const _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
      const addLog = (obj) => {
        configStore.logData.unshift({
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          ...obj
        });
      };
      const waitIframeLoad = async (iframe) => {
        return new Promise((resolve) => {
          const intervalId = setInterval(async () => {
            var _a;
            if (((_a = iframe.contentDocument) == null ? void 0 : _a.readyState) === "complete") {
              resolve();
              clearInterval(intervalId);
            }
          }, 500);
        });
      };
      const processIframe = async (iframe) => {
        var _a;
        const iframeSrc = iframe.src;
        const iframeDocument = iframe.contentDocument;
        const iframeWindow = iframe.contentWindow;
        if (!iframeDocument || !iframeWindow) {
          return Promise.resolve();
        }
        if (iframeSrc.includes("javascript:")) {
          return Promise.resolve();
        }
        await waitIframeLoad(iframe);
        const parentClass = ((_a = iframe.parentElement) == null ? void 0 : _a.className) || "";
        if (parentClass.includes("ans-job-finished")) {
          addLog({
            value: `发现一个已完成任务点`,
            type: "success"
          });
          return Promise.resolve();
        }
        if (iframeSrc.includes("api/work")) {
          return await processWork(iframe, iframeDocument, iframeWindow);
        }
        if (configStore.platformParams.cx.answeringMode) {
          addLog({
            value: `只答题模式已开，可在设置里调整`,
            type: "warning"
          });
        } else {
          const ansJobIcon = iframe.parentElement ? iframe.parentElement.querySelector(".ans-job-icon") : "";
          if (ansJobIcon) {
            if (iframeSrc.includes("video")) {
              return processMedia("video", iframeDocument);
            } else if (iframeSrc.includes("audio")) {
              return processMedia("audio", iframeDocument);
            } else if (["ppt", "doc", "pptx", "docx", "pdf"].some(
              (type) => iframeSrc.includes("modules/" + type)
            )) {
              return processPpt();
            } else if (["innerbook"].some((type) => iframeSrc.includes("modules/" + type))) {
              return processBook(iframeWindow);
            }
          }
        }
        return Promise.resolve();
      };
      const processMedia = async (mediaType, iframeDocument) => {
        return new Promise(async (resolve) => {
          addLog({
            value: `发现一个${mediaType}，正在解析`,
            type: "warning"
          });
          addLog({
            value: `正在尝试播放${mediaType}，请稍等`,
            type: "warning"
          });
          await sleep(1);
          let isExecuted = false;
          addLog({
            value: `播放成功`,
            type: "success"
          });
          const intervalId = setInterval(async () => {
            const mediaElement = iframeDocument.documentElement.querySelector(mediaType);
            if (mediaElement && !isExecuted) {
              await mediaElement.pause();
              mediaElement.muted = true;
              await mediaElement.play();
              const listener = async () => {
                await sleep(3);
                await mediaElement.play();
              };
              mediaElement.addEventListener("pause", listener);
              mediaElement.addEventListener("ended", () => {
                addLog({
                  value: `${mediaType}已播放完成`,
                  type: "success"
                });
                mediaElement.removeEventListener("pause", listener);
                resolve();
              });
              isExecuted = true;
              clearInterval(intervalId);
            }
          }, 2500);
        });
      };
      const processPpt = async (iframeWindow) => {
        return Promise.resolve();
      };
      const processBook = async (iframeWindow) => {
        var _a;
        addLog({
          value: `发现一个电子书，正在解析`,
          type: "warning"
        });
        (_a = _unsafeWindow == null ? void 0 : _unsafeWindow.top) == null ? void 0 : _a.onchangepage(iframeWindow.getFrameAttr("end"));
        addLog({
          value: `阅读完成`,
          type: "success"
        });
        return Promise.resolve();
      };
      class BaseQuestionHandler {
        constructor() {
          __publicField(this, "_document", document);
          __publicField(this, "_window", _unsafeWindow);
          __publicField(this, "questions", []);
          __publicField(this, "correctNum", 0);
          __publicField(this, "parseHtml", () => {
            throw new Error("请使用继承类的重写方法");
          });
          __publicField(this, "fillQuestion", (question) => {
            throw new Error("请使用继承类的重写方法");
          });
          __publicField(this, "questionType", {
            单选题: "0",
            A1型题: "0",
            多选题: "1",
            X型题: "1",
            填空题: "2",
            判断题: "3",
            简答题: "4",
            名词解释: "5",
            论述题: "6",
            计算题: "7"
          });
          __publicField(this, "removeHtml", (html) => {
            if (html == null) {
              return "";
            }
            return html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").replace(/<br\s*\/?>/g, "\n").replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>').trim();
          });
          __publicField(this, "clean", (str) => {
            return str.replace(/^【.*?】\s*/, "").replace(/\s*（\d+\.\d+分）$/, "");
          });
        }
      }
      class CxQuestionHandler extends BaseQuestionHandler {
        constructor(type, iframe) {
          super();
          __publicField(this, "type");
          __publicField(this, "init", async () => {
            this.questions = [];
            this.parseHtml();
            if (this.questions.length) {
              addLog({
                value: `成功解析到${this.questions.length}个题目`,
                type: "success"
              });
              for (const [index, question] of this.questions.entries()) {
                try {
                  const resp = await simulateRequest(
                    configStore.url,
                    question,
                    _unsafeWindow,
                    configStore.key
                  );
                  const { answer, count } = resp;
                  question.source = resp.source;
                  if (answer == null ? void 0 : answer.length) {
                    question.answer = answer;
                    this.fillQuestion(question);
                    addLog({
                      value: `第${index + 1}道题、搜索成功，剩余次数：${count}`,
                      type: "success"
                    });
                    this.correctNum += 1;
                  } else {
                    addLog({
                      value: `第${index + 1}道题、题库为空`,
                      type: "warning"
                    });
                  }
                  userInfoStore.questionList = [question];
                } catch (error) {
                  addLog({
                    value: `第${index + 1}道题、搜索失败`,
                    type: "error"
                  });
                } finally {
                  if (!this._document) {
                    let _a = this._document;
                    await _a.querySelectorAll(".switch-btn-box > button")[1].click();
                  }
                  await sleep(2);
                }
              }
            }
            if (this.questions.length === 0) {
              addLog({
                value: `未解析到题目，请进入正确页面`,
                type: "warning"
              });
            }
            return Promise.resolve(this.correctNum / this.questions.length * 100);
          });
          __publicField(this, "parseHtml", () => {
            if (!this._document) return [];
            if (["zj"].includes(this.type)) {
              const questionElements = this._document.querySelectorAll(".TiMu");
              this.addQuestions(questionElements);
            } else if (["zy", "ks"].includes(this.type)) {
              const questionElements = this._document.querySelectorAll(".questionLi");
              this.addQuestions(questionElements);
            }
          });
          __publicField(this, "fillQuestion", (question) => {
            var _a, _b;
            if (!this._window) return;
            if (question.type === "0" || question.type === "1") {
              question.answer.forEach((answer) => {
                for (const key in question.options) {
                  if (key === this.removeHtml(answer)) {
                    if (["zj", "zy"].includes(this.type)) {
                      const optionElement = question.options[key];
                      if (optionElement.getAttribute("aria-checked") === "true") {
                        return;
                      }
                      optionElement == null ? void 0 : optionElement.click();
                    } else if (["ks"].includes(this.type)) {
                      const optionElement = question.options[key];
                      if (optionElement.querySelector(".check_answer") || optionElement.querySelector(".check_answer_dx")) {
                        return;
                      }
                      optionElement == null ? void 0 : optionElement.click();
                    }
                  }
                }
              });
            } else if (question.type === "2") {
              const textareaElements = question.element.querySelectorAll("textarea");
              if (textareaElements.length === 0) return;
              textareaElements.forEach((textareaElement, index) => {
                try {
                  const ueditor = this._window.UE.getEditor(textareaElement.name);
                  ueditor.setContent(question.answer[index]);
                } catch (e) {
                  textareaElement.value = "";
                }
              });
            } else if (question.type === "3") {
              let answer = "true";
              if (question.answer[0].match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/)) {
                answer = "true";
              } else if (question.answer[0].toString().match(/(^|,)(错误|否|错|×|F|wr|wrong|false)(,|$)/)) {
                answer = "false";
              }
              const trueOrFalse = {
                true: "对",
                false: "错"
              };
              for (const key in question.options) {
                if (["zj", "zy"].includes(this.type)) {
                  if ((_a = question.options[key].getAttribute("aria-label")) == null ? void 0 : _a.includes(`${trueOrFalse[answer]}选择`)) {
                    if (question.options[key].getAttribute("aria-checked") === "true")
                      return;
                    (_b = question.options[key]) == null ? void 0 : _b.click();
                  }
                } else if (["ks"].includes(this.type)) {
                  const optionElement = question.options[key].querySelector(
                    `span[data='${answer}']`
                  );
                  if (optionElement == null ? void 0 : optionElement.querySelector(".check_answer"))
                    return;
                  optionElement == null ? void 0 : optionElement.click();
                }
              }
            } else if (question.type === "4" || question.type === "6") {
              const textareaElement = question.element.querySelector("textarea");
              if (!textareaElement) return;
              const ueditor = this._window.UE.getEditor(textareaElement.name);
              ueditor.setContent(question.answer[0]);
            } else ;
          });
          this.type = type;
          if (iframe) {
            this._document = iframe.contentDocument;
            this._window = iframe.contentWindow;
          }
        }
        extractOptions(optionElements, optionSelector) {
          const optionsObject = {};
          const optionTexts = [];
          optionElements.forEach((optionElement) => {
            var _a;
            const optionTextContent = this.removeHtml(
              ((_a = optionElement.querySelector(optionSelector)) == null ? void 0 : _a.innerHTML) || ""
            );
            optionsObject[optionTextContent] = optionElement;
            optionTexts.push(optionTextContent);
          });
          return [optionsObject, optionTexts];
        }
        addQuestions(questionElements) {
          questionElements.forEach((questionElement) => {
            var _a2, _b2;
            var _a, _b, _c, _d;
            let questionTitle = "";
            let questionTypeText = "";
            let optionElements;
            let optionsObject = {};
            let optionTexts = [];
            if (["zy", "ks"].includes(this.type)) {
              const titleElement = ((_a = questionElement == null ? void 0 : questionElement.querySelector("h3")) == null ? void 0 : _a.innerHTML) || "";
              const colorShallowElement = ((_b = questionElement.querySelector(".colorShallow")) == null ? void 0 : _b.outerHTML) || "";
              if (["zy"].includes(this.type)) {
                questionTypeText = (questionElement == null ? void 0 : questionElement.getAttribute("typename")) || "";
              } else if (["ks"].includes(this.type)) {
                questionTypeText = this.removeHtml(colorShallowElement).slice(1, 4) || "";
              }
              questionTitle = this.removeHtml(
                titleElement.split(colorShallowElement || "")[1] || ""
              );
              optionElements = questionElement.querySelectorAll(".answerBg");
              [optionsObject, optionTexts] = this.extractOptions(
                optionElements,
                ".answer_p"
              );
            } else if (["zj"].includes(this.type)) {
              questionTitle = this.removeHtml(
                ((_c = questionElement.querySelector(".fontLabel")) == null ? void 0 : _c.innerHTML) || ""
              );
              questionTypeText = this.removeHtml(
                ((_d = questionElement.querySelector(".newZy_TItle")) == null ? void 0 : _d.innerHTML) || ""
              );
              optionElements = questionElement.querySelectorAll(
                '[class*="before-after"]'
              );
              [optionsObject, optionTexts] = this.extractOptions(
                optionElements,
                ".fl.after"
              );
            }
            this.questions.push({
              element: questionElement,
              type: this.questionType[questionTypeText.replace("【", "").replace("】", "")] || "999",
              title: this.clean(questionTitle),
              optionsText: optionTexts,
              options: optionsObject,
              answer: [],
              workType: this.type,
              refer: (_b2 = (_a2 = this._window) == null ? void 0 : _a2.location) == null ? void 0 : _b2.href
            });
          });
        }
      }
      const processWork = async (iframe, iframeDocument, iframeWindow) => {
        addLog({
          value: `处理作业任务点`,
          type: "info"
        });
        addLog({
          value: `发现一个作业，正在解析`,
          type: "warning"
        });
        return new Promise(async (resolve) => {
          var _a;
          if (!iframeDocument) return resolve();
          if (iframeDocument.documentElement.innerText.includes("已完成") || iframeDocument.documentElement.innerText.includes("待批阅")) {
            addLog({
              value: `作业已经完成，跳过`,
              type: "success"
            });
            return resolve();
          }
          crackFont(iframeDocument);
          addLog({
            value: `题目列表获取成功`,
            type: "success"
          });
          await sleep(2);
          const correctRate = await ((_a = new CxQuestionHandler("zj", iframe)) == null ? void 0 : _a.init());
          if (configStore.platformParams.cx.autoNext) {
            addLog({
              value: `自动提交已开启，尝试提交`,
              type: "warning"
            });
            if (correctRate < configStore.otherParams.rate) {
              addLog({
                value: `正确率小于${configStore.otherParams.rate}%，暂存`,
                type: "error"
              });
              await iframeWindow.noSubmit();
            } else {
              addLog({
                value: `正确率大于${configStore.otherParams.rate}%，提交`,
                type: "success"
              });
              await iframeWindow.btnBlueSubmit();
              await sleep(configStore.otherParams.timeInterval / 2);
              await iframeWindow.submitCheckTimes();
              addLog({
                value: `提交成功`,
                type: "success"
              });
            }
          } else {
            addLog({
              value: `未开启自动提交，暂存`,
              type: "warning"
            });
            await iframeWindow.noSubmit();
          }
          addLog({
            value: `作业已完成`,
            type: "success"
          });
          return resolve();
        });
      };
      const getAllNestedIframes = (documentElement) => {
        const iframes = [];
        const scan = (doc) => {
          const frames = doc.querySelectorAll("iframe");
          frames.forEach((iframe) => {
            try {
              iframes.push(iframe);
              if (iframe.contentDocument) {
                scan(iframe.contentDocument);
              }
            } catch (e) {
              console.warn("无法访问跨域 iframe:", iframe.src);
            }
          });
        };
        scan(documentElement);
        return iframes;
      };
      const watchIframe = (documentElement) => {
        const iframes = getAllNestedIframes(documentElement);
        iframes.reduce((promiseChain, iframe) => {
          return promiseChain.then(() => processIframe(iframe));
        }, Promise.resolve()).then(async () => {
          var _a;
          addLog({
            value: `本页任务点已全部完成，正前往下一章节`,
            type: "success"
          });
          await sleep(2);
          if (configStore.platformParams.cx.autoNext) {
            const nextBtn = documentElement.querySelector("#prevNextFocusNext");
            if (!nextBtn || nextBtn.style.display === "none") {
              addLog({
                value: `已经到达最后一章节，无法跳转`,
                type: "error"
              });
            } else {
              await sleep(2);
              (_a = document == null ? void 0 : document.querySelector(".jb_btn.jb_btn_92.fr.fs14.nextChapter")) == null ? void 0 : _a.click();
            }
          } else {
            addLog({
              value: `已经关闭自动下一章节，在设置里可更改`,
              type: "error"
            });
          }
        });
      };
      const processIframeTask = () => {
        const documentElement = document.documentElement;
        const iframe = documentElement.querySelector("iframe");
        if (!iframe) {
          console.warn("No iframe found.");
          return;
        }
        watchIframe(documentElement);
        iframe.addEventListener("load", function() {
          watchIframe(documentElement);
        });
      };
      const setupInterceptor = () => {
        let currentUrl2 = window.location.href;
        setInterval(() => {
          if (currentUrl2 !== window.location.href) {
            currentUrl2 = window.location.href;
            processIframeTask();
          }
        }, 5e3);
      };
      const useCxChapterFunc = () => {
        const init = () => {
          if (!window.location.href.includes("&mooc2=1")) {
            window.location.href = currentUrl + "&mooc2=1";
          }
          addLog({
            value: `检测到用户进入到章节学习页面`,
            type: "success"
          });
          addLog({
            value: `正在解析任务点，请稍等（如长时间没有反应，请刷新页面）`,
            type: "warning"
          });
        };
        init();
        processIframeTask();
        setupInterceptor();
      };
      const useCxWorkLogicFunc = async () => {
        addLog({
          value: `进入新版作业页面，开始准备答题`,
          type: "success"
        });
        addLog({
          value: `正在解析题目, 请等待`,
          type: "warning"
        });
        await new CxQuestionHandler("zy").init();
      };
      const useCxExamLogicFunc = async () => {
        addLog({
          value: `进入新版考试页面，开始准备答题`,
          type: "warning"
        });
        addLog({
          value: `正在解析题目, 请等待`,
          type: "warning"
        });
        await new CxQuestionHandler("ks").init();
        if (configStore.platformParams.cx.autoNext) {
          addLog({
            value: `自动切换已开启，正在前往下一题`,
            type: "warning"
          });
          await sleep(configStore.otherParams.timeInterval);
          _unsafeWindow.getTheNextQuestion(1);
        } else {
          addLog({
            value: `已经关闭自动切换，在设置里可更改`,
            type: "warning"
          });
        }
      };
      const getFunc = () => {
        const urlLogicPairs = [
          { keyword: "/mycourse/studentstudy", logic: useCxChapterFunc },
          { keyword: "/mooc2/work/dowork", logic: useCxWorkLogicFunc },
          { keyword: "/exam-ans/exam", logic: useCxExamLogicFunc },
          { keyword: "/exam-ans/mooc2/exam/preview", logic: useCxExamLogicFunc },
          {
            keyword: "mycourse/stu?courseid",
            logic: () => {
              addLog({
                value: `该页面无任务，请进入章节或答题页面使用`,
                type: "error"
              });
            }
          }
          // { keyword: '/stuExamWeb.html', logic: useZhsAnswerLogicFunc },
        ];
        const executeLogicByUrl = () => {
          for (const { keyword, logic } of urlLogicPairs) {
            if (window.location.href.includes(keyword)) {
              logic();
              configStore.isShow = true;
              return;
            }
          }
          configStore.isShow = false;
        };
        executeLogicByUrl();
      };
      const validateKey = () => {
        if (!configStore.key) {
          addLog({
            value: `请先输入卡密`,
            type: "warning"
          });
          return;
        }
        userInfoStore.key = configStore.key;
        addLog({
          value: `验证成功`,
          type: "success"
        });
      };
      const clearKey = () => {
        userInfoStore.key = null;
      };
      vue.onMounted(() => {
        userInfoStore.questionList = [];
        addLog({
          value: `请不要多个脚本同时使用，会有脚本冲突问题`,
          type: "warning"
        });
        addLog({
          value: `如果脚本出现异常，请用谷歌、火狐等浏览器`,
          type: "warning"
        });
        addLog({
          value: `脚本加载成功，正在解析网页`,
          type: "success"
        });
        getFunc();
      });
      return (_ctx, _cache) => {
        return configStore.isShow ? (vue.openBlock(), vue.createBlock(DraggableDialog, {
          key: 0,
          boundary: true,
          axis: "both"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(tabBars), (tab) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: tab.value,
                  size: configStore.sizes,
                  onClick: ($event) => configStore.activeTab = tab.value,
                  class: vue.normalizeClass(["tab-bar-item", [configStore.activeTab === tab.value ? "active" : ""]])
                }, [
                  vue.createVNode(vue.unref(ElementPlus.ElIcon), null, {
                    default: vue.withCtx(() => [
                      tab.value === "key" ? (vue.openBlock(), vue.createBlock(vue.unref(key_default), { key: 0 })) : vue.createCommentVNode("", true),
                      tab.value === "settings" ? (vue.openBlock(), vue.createBlock(vue.unref(tools_default), { key: 1 })) : vue.createCommentVNode("", true),
                      tab.value === "help" ? (vue.openBlock(), vue.createBlock(vue.unref(question_filled_default), { key: 2 })) : vue.createCommentVNode("", true),
                      tab.value === "protocol" ? (vue.openBlock(), vue.createBlock(vue.unref(warning_default), { key: 3 })) : vue.createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1024),
                  vue.createTextVNode(" " + vue.toDisplayString(tab.label), 1)
                ], 10, _hoisted_2);
              }), 128))
            ]),
            vue.createElementVNode("div", _hoisted_3, [
              configStore.activeTab === "key" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
                vue.createElementVNode("div", _hoisted_5, [
                  vue.createVNode(vue.unref(ElementPlus.ElIcon), {
                    size: 18,
                    color: "#4a90e2"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(key_default))
                    ]),
                    _: 1
                  }),
                  _cache[4] || (_cache[4] = vue.createTextVNode("授权管理 "))
                ]),
                vue.createVNode(vue.unref(ElementPlus.ElInput), {
                  modelValue: configStore.key,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => configStore.key = $event),
                  modelModifiers: { trim: true },
                  style: { "width": "100%" },
                  placeholder: "输入卡密、获取方式在帮助中查看",
                  clearable: "",
                  onClear: clearKey
                }, null, 8, ["modelValue"]),
                vue.createElementVNode("div", {
                  class: "start-parse",
                  onClick: validateKey
                }, "验证卡密"),
                vue.createElementVNode("div", _hoisted_6, [
                  vue.createElementVNode("div", _hoisted_7, [
                    vue.createVNode(vue.unref(ElementPlus.ElIcon), {
                      size: 18,
                      color: "#4a90e2"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(list_default))
                      ]),
                      _: 1
                    }),
                    _cache[5] || (_cache[5] = vue.createTextVNode("题目列表 "))
                  ]),
                  vue.createVNode(vue.unref(ElementPlus.ElTable), {
                    data: vue.unref(userInfoStore).questionList,
                    style: { "width": "100%" },
                    "empty-text": "暂无题目"
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(column, (c) => {
                        return vue.createVNode(vue.unref(ElementPlus.ElTableColumn), vue.mergeProps({
                          key: c,
                          ref_for: true
                        }, c), null, 16);
                      }), 64))
                    ]),
                    _: 1
                  }, 8, ["data"])
                ])
              ])) : vue.createCommentVNode("", true),
              configStore.activeTab === "settings" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [
                vue.createElementVNode("div", _hoisted_9, [
                  vue.createVNode(vue.unref(ElementPlus.ElIcon), {
                    size: 18,
                    color: "#4a90e2"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(operation_default))
                    ]),
                    _: 1
                  }),
                  _cache[6] || (_cache[6] = vue.createTextVNode("功能配置 "))
                ]),
                vue.createElementVNode("div", _hoisted_10, [
                  vue.createElementVNode("div", null, [
                    vue.createVNode(vue.unref(ElementPlus.ElCheckbox), {
                      modelValue: configStore.platformParams.cx.answeringMode,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => configStore.platformParams.cx.answeringMode = $event),
                      label: "只答题，不做其他",
                      size: "small"
                    }, null, 8, ["modelValue"])
                  ]),
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(settings), (setting) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      class: "settings-section",
                      key: setting.value
                    }, [
                      vue.createElementVNode("div", _hoisted_11, [
                        vue.createElementVNode("span", _hoisted_12, vue.toDisplayString(setting.desc), 1)
                      ]),
                      setting.value === "rate" ? (vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElInputNumber), vue.mergeProps({
                        key: 0,
                        class: "settings-switch",
                        modelValue: configStore.otherParams.rate,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => configStore.otherParams.rate = $event),
                        ref_for: true
                      }, { inputNumberAttr: vue.unref(inputNumberAttr) }, {
                        min: 60,
                        max: 90
                      }), null, 16, ["modelValue"])) : vue.createCommentVNode("", true),
                      setting.value === "interval" ? (vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElInputNumber), vue.mergeProps({
                        key: 1,
                        class: "settings-switch",
                        modelValue: configStore.otherParams.timeInterval,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => configStore.otherParams.timeInterval = $event),
                        ref_for: true
                      }, { inputNumberAttr: vue.unref(inputNumberAttr) }, {
                        min: 3,
                        max: 10
                      }), null, 16, ["modelValue"])) : vue.createCommentVNode("", true)
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("", true),
              configStore.activeTab === "help" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [
                vue.createElementVNode("div", _hoisted_14, [
                  vue.createVNode(vue.unref(ElementPlus.ElIcon), {
                    size: 18,
                    color: "#4a90e2"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(notebook_default))
                    ]),
                    _: 1
                  }),
                  _cache[7] || (_cache[7] = vue.createTextVNode("使用指南 "))
                ]),
                vue.createElementVNode("div", _hoisted_15, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(guide), (item) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: item.index,
                      class: "guide-content-item"
                    }, [
                      vue.createElementVNode("div", _hoisted_16, vue.toDisplayString(item.index), 1),
                      vue.createElementVNode("div", _hoisted_17, vue.toDisplayString(item.content), 1)
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("", true),
              configStore.activeTab === "protocol" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18, [
                vue.createElementVNode("div", _hoisted_19, [
                  vue.createVNode(vue.unref(ElementPlus.ElIcon), {
                    size: 18,
                    color: "#f56c6c"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(warning_default))
                    ]),
                    _: 1
                  }),
                  _cache[8] || (_cache[8] = vue.createTextVNode("协议 "))
                ]),
                vue.createElementVNode("div", _hoisted_20, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(protocol), (item) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: item.index,
                      class: "guide-content-item"
                    }, [
                      vue.createElementVNode("div", _hoisted_21, vue.toDisplayString(item.index), 1),
                      vue.createElementVNode("div", _hoisted_22, vue.toDisplayString(item.content), 1)
                    ]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("", true),
              configStore.activeTab !== "protocol" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_23, [
                vue.createElementVNode("div", _hoisted_24, [
                  vue.createVNode(vue.unref(ElementPlus.ElIcon), { size: 18 }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(comment_default))
                    ]),
                    _: 1
                  }),
                  _cache[9] || (_cache[9] = vue.createTextVNode(" 操作反馈 "))
                ]),
                vue.createElementVNode("div", _hoisted_25, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(configStore.logData, (item) => {
                    return vue.openBlock(), vue.createBlock(vue.unref(ElementPlus.ElAlert), {
                      key: item.time,
                      title: item.value,
                      type: item.type,
                      "show-icon": "",
                      closable: false,
                      style: { "margin-bottom": "8px", "border-radius": "4px" }
                    }, {
                      title: vue.withCtx(() => [
                        vue.createElementVNode("span", _hoisted_26, vue.toDisplayString(item.value), 1)
                      ]),
                      _: 2
                    }, 1032, ["title", "type"]);
                  }), 128))
                ])
              ])) : vue.createCommentVNode("", true)
            ])
          ]),
          _: 1
        })) : vue.createCommentVNode("", true);
      };
    }
  };
  const HomeIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ba63fdae"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(HomeIndex);
      };
    }
  });
  function initApp() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mountApp);
    } else {
      mountApp();
    }
  }
  function mountApp() {
    if (!document.body) {
      setTimeout(mountApp, 10);
      return;
    }
    const app = vue.createApp(_sfc_main);
    app.use(ElementPlus);
    app.use(pinia);
    const container = document.createElement("div");
    document.body.append(container);
    app.mount(container);
  }
  initApp();

})(Vue, ElementPlus, Pinia);
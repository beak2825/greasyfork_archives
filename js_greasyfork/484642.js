// ==UserScript==
// @name         yapi-to-ts
// @namespace    http://172.16.101.32:7700/project/*/interface/api/*
// @version      0.3.4
// @author       monkey
// @description  yapi to ts
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        http://172.16.101.32:7700/project/*/interface/api/*
// @match        http://172.16.101.32:7700/project/*/interface/api
// @match        https://yapi.doveaz.xyz:1443/project/*/interface/api
// @match        https://yapi.doveaz.xyz:1443/project/*/interface/api
// @require      https://cdn.jsdelivr.net/npm/json-schema-to-typescript-for-browser@11.0.3/dist/bundle.min.js
// @require      https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.10.0/highlight.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.38/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.5.1/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.5.1/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/484642/yapi-to-ts.user.js
// @updateURL https://update.greasyfork.org/scripts/484642/yapi-to-ts.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" body .el-notification__content p{white-space:pre}body .el-notification{width:430px!important}body .interface-title{display:flex;align-items:center}body .component-label>div{display:flex;align-items:center;justify-content:space-between}body .interface-title+button+div>div{display:flex;align-items:center;justify-content:space-between}body .ant-layout-sider{position:sticky;top:30px}.settings[data-v-5b8f5f30]{display:flex;padding-left:15px}.settings[data-v-5b8f5f30]>*[data-v-5b8f5f30]{flex-shrink:0}.settings[data-v-5b8f5f30]>.el-input[data-v-5b8f5f30]{margin-left:15px} ");

(function (ElementPlus, vue) {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  const jsttCompileConfigOptions = {
    bannerComment: "",
    format: false,
    style: {
      bracketSpacing: false,
      printWidth: 120,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: "none",
      useTabs: false
    },
    strictIndexSignatures: true
  };
  function compileJSONSchema2TS(schema, name) {
    return jstt.compile(schema, name, jsttCompileConfigOptions).then((code) => formatComment2SingleLine(code)).catch((err) => console.error(err));
  }
  function formatComment2SingleLine(content = "") {
    return content.replace(
      /\/\*([^/]*)\*\//gm,
      (_2, p1) => `/** ${p1.replace(/[*\s\n]/gm, "")} */`
    ).replaceAll("string &", "");
  }
  const getDetail = (id) => {
    return fetch(`http://172.16.101.32:7700/api/interface/get?id=${id}`).then((res) => res.json()).then((res) => {
      return res.data;
    });
  };
  const fetchData = () => {
    if (!location.href.includes("api/cat_")) {
      return getDetail(location.href.match(/api\/(\d+)/)[1]);
    } else {
      return Promise.reject(new Error("请在接口详情页使用"));
    }
  };
  function copy(text) {
    text = text.replaceAll("number & string", "number");
    text = text.replaceAll("boolean & string", "boolean");
    ElementPlus.ElNotification({
      title: "复制成功",
      dangerouslyUseHTMLString: true,
      message: hljs.highlight(text, { language: "typescript" }).value,
      type: "success"
    });
    _GM_setClipboard(text);
  }
  function requestName(item) {
    const functionNamePrefix = localStorage.getItem(window.projectId + "-function-name-prefix") || "";
    return _.camelCase(
      (functionNamePrefix ? functionNamePrefix + "_" : "") + item.path.replace(/\{(.*)\}$/, "_by_$1").replaceAll("/", "_").replace(/^_/, "").replace(/_$/, "")
    );
  }
  function paramsDto(item) {
    return _.upperFirst(requestName(item)) + "ParamsDto";
  }
  function dataDto(item) {
    return _.upperFirst(requestName(item)) + "DataDto";
  }
  function convertType(type) {
    return {
      int32: "number",
      int64: "number"
    }[type] || type || "any";
  }
  function isCate() {
    const matched = location.href.match(/cat_(\d+)$/);
    return !!matched;
  }
  function isAll() {
    const matched = location.href.match(/interface\/api$/);
    return !!matched;
  }
  async function copyRequest(item, noReturn = false) {
    const data = item || await fetchData();
    const name = requestName(data);
    let arg = "";
    let argType = "";
    if (_.size(data.req_query)) {
      arg = "params";
      argType = ": " + (settingsVm.anyType ? "any" : paramsDto(data));
    }
    if (_.size(data.req_body_other)) {
      arg = "data";
      argType = ": " + (settingsVm.anyType ? "any" : dataDto(data));
    }
    let pathArg = "";
    if (_.size(data.req_params)) {
      data.req_params.forEach((item2) => {
        pathArg += `${item2.name}: ${convertType(item2.type)},`;
      });
    }
    const responseDto = settingsVm.anyType || !data.res_body ? "any" : _.upperFirst(name) + "ResponseDto";
    let text = `
  // ${data.title}  作者: ${data.username} http://172.16.101.32:7700/project/${data.project_id}/interface/api/${data._id}
  `;
    const nativeAxios = localStorage.getItem(window.projectId + "-axios-native") === "true";
    const arrowFunction = localStorage.getItem(window.projectId + "-arrow-function") === "true";
    const requestFunctionName = localStorage.getItem(window.projectId + "-request-function-name") || "axiosRequest";
    const extractData = localStorage.getItem(window.projectId + "-extract-data") === "true";
    const extractDataString = extractData ? `['data']` : "";
    const functionDeclareText = arrowFunction ? `${name} : (${pathArg}${arg}${argType}): Promise<${responseDto}${extractDataString}> => ` : `export function ${name}(${pathArg}${arg}${argType}): Promise<${responseDto}${extractDataString}>`;
    const arrowPatternStart = !arrowFunction ? `{
    return` : "";
    const arrowPatternEnd = !arrowFunction ? `}` : "";
    if (nativeAxios) {
      text += `${functionDeclareText} ${arrowPatternStart} ${requestFunctionName}({
      url: \`${data.path.replaceAll("{", "${")}\`,
      method: '${_.toLower(data.method)}',
      ${arg}
    })
  ${arrowPatternEnd}`;
    } else {
      text += `${functionDeclareText}  ${arrowPatternStart} ${requestFunctionName}.${_.toLower(data.method)}({
      url: \`${data.path.replaceAll("{", "${")}\`,
      ${arg}
    })
  ${arrowPatternEnd}`;
    }
    if (item) {
      return text;
    } else {
      copy(text);
    }
  }
  async function copyGroupRequest() {
    const arrowFunction = localStorage.getItem(window.projectId + "-arrow-function") === "true";
    const href = location.href;
    const matched = href.match(/cat_(\d+)$/);
    const id = matched == null ? void 0 : matched[1];
    const list = await fetch(
      id ? `http://172.16.101.32:7700/api/interface/list_cat?page=1&limit=9999&catid=${id}` : `http://172.16.101.32:7700/api/interface/list?page=1&limit=9999&project_id=${projectId}`
    ).then((res) => res.json()).then((res) => {
      return res.data.list;
    });
    let text = "";
    const resList = await Promise.all(list.map((item) => getDetail(item._id)));
    for (const data of resList) {
      text += await copyRequest(data) + (arrowFunction ? "," : "");
    }
    copy(text);
  }
  async function copyInterface(item) {
    const data = item || await fetchData();
    const name = requestName(data);
    const noExport = localStorage.getItem(window.projectId + "-no-export") === "true";
    let text = `// ${data.title} 作者: ${data.username}  http://172.16.101.32:7700/project/${data.project_id}/interface/api/${data._id}`;
    let text1 = "";
    let text2 = "";
    if (data.req_query && data.req_query.length) {
      const interfaceString = data.req_query.map(
        (item2) => `/** ${item2.desc} **/
${item2.name}${item2.required === "1" ? "" : "?"}: string`
      ).join(";");
      text2 += `export interface ${paramsDto(data)}  {
    ${interfaceString}
    }`;
    }
    if (data.req_body_other || data.req_body) {
      text2 += await compileJSONSchema2TS(
        JSON.parse(data.req_body_other || data.req_body),
        dataDto(data)
      );
    }
    let text3 = "";
    if (data.res_body) {
      text3 += await compileJSONSchema2TS(
        JSON.parse(data.res_body),
        `${_.upperFirst(name)}ResponseDto`
      );
    }
    text3 = text3.replaceAll("?: ", ": ");
    if (noExport) {
      text2 = text2.replace("export ", "");
      text3 = text3.replace("export ", "");
    }
    const result = _.compact([text, text1, text2, text3]).join("\n");
    if (item) {
      return result;
    } else {
      copy(result);
    }
  }
  async function copyGroupInterface(event) {
    const href = location.href;
    const matched = href.match(/cat_(\d+)$/);
    const id = matched == null ? void 0 : matched[1];
    const list = await fetch(
      id ? `http://172.16.101.32:7700/api/interface/list_cat?page=1&limit=9999&catid=${id}` : `http://172.16.101.32:7700/api/interface/list?page=1&limit=9999&project_id=${projectId}`
    ).then((res) => res.json()).then((res) => {
      return res.data.list;
    });
    let text = "";
    const resList = await Promise.all(list.map((item) => getDetail(item._id)));
    for (const data of resList) {
      text += await copyInterface(data);
    }
    copy(text);
  }
  async function copyResponseParameterInterface() {
    const data = await fetchData();
    const text = ``;
    const name = requestName(data);
    const noExport = localStorage.getItem(window.projectId + "-no-export") === "true";
    let content = await compileJSONSchema2TS(
      JSON.parse(data.res_body),
      _.upperFirst(name) + "ResponseDto"
    );
    content = content.replaceAll("?: ", ": ");
    if (noExport) {
      content = content.replace("export ", "");
    }
    copy(text + content);
  }
  async function copyBodyParameterInterface() {
    const data = await fetchData();
    const text = ``;
    requestName(data);
    const noExport = localStorage.getItem(window.projectId + "-no-export") === "true";
    let content = await compileJSONSchema2TS(
      JSON.parse(data.req_body_other),
      dataDto(data)
    );
    if (noExport) {
      content = content.replace("export ", "");
    }
    copy(text + content);
  }
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function toValue(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
      });
    }
    return wrapper;
  }
  const bypassFilter = (invoke) => {
    return invoke();
  };
  function pausableFilter(extendFilter = bypassFilter) {
    const isActive = vue.ref(true);
    function pause() {
      isActive.value = false;
    }
    function resume() {
      isActive.value = true;
    }
    const eventFilter = (...args) => {
      if (isActive.value)
        extendFilter(...args);
    };
    return { isActive: vue.readonly(isActive), pause, resume, eventFilter };
  }
  function getLifeCycleTarget(target) {
    return target || vue.getCurrentInstance();
  }
  function watchWithFilter(source, cb, options = {}) {
    const {
      eventFilter = bypassFilter,
      ...watchOptions
    } = options;
    return vue.watch(
      source,
      createFilterWrapper(
        eventFilter,
        cb
      ),
      watchOptions
    );
  }
  function watchPausable(source, cb, options = {}) {
    const {
      eventFilter: filter,
      ...watchOptions
    } = options;
    const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
    const stop = watchWithFilter(
      source,
      cb,
      {
        ...watchOptions,
        eventFilter
      }
    );
    return { stop, pause, resume, isActive };
  }
  function tryOnMounted(fn, sync = true, target) {
    const instance = getLifeCycleTarget();
    if (instance)
      vue.onMounted(fn, target);
    else if (sync)
      fn();
    else
      vue.nextTick(fn);
  }
  function unrefElement(elRef) {
    var _a;
    const plain = toValue(elRef);
    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  function useEventListener(...args) {
    let target;
    let events;
    let listeners;
    let options;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      [events, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events))
      events = [events];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(
      () => [unrefElement(target), toValue(options)],
      ([el, options2]) => {
        cleanup();
        if (!el)
          return;
        const optionsClone = isObject(options2) ? { ...options2 } : options2;
        cleanups.push(
          ...events.flatMap((event) => {
            return listeners.map((listener) => register(el, event, listener, optionsClone));
          })
        );
      },
      { immediate: true, flush: "post" }
    );
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  const handlers = /* @__PURE__ */ getHandlers();
  function getHandlers() {
    if (!(globalKey in _global))
      _global[globalKey] = _global[globalKey] || {};
    return _global[globalKey];
  }
  function getSSRHandler(key, fallback) {
    return handlers[key] || fallback;
  }
  function guessSerializerType(rawInit) {
    return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
  }
  const StorageSerializers = {
    boolean: {
      read: (v) => v === "true",
      write: (v) => String(v)
    },
    object: {
      read: (v) => JSON.parse(v),
      write: (v) => JSON.stringify(v)
    },
    number: {
      read: (v) => Number.parseFloat(v),
      write: (v) => String(v)
    },
    any: {
      read: (v) => v,
      write: (v) => String(v)
    },
    string: {
      read: (v) => v,
      write: (v) => String(v)
    },
    map: {
      read: (v) => new Map(JSON.parse(v)),
      write: (v) => JSON.stringify(Array.from(v.entries()))
    },
    set: {
      read: (v) => new Set(JSON.parse(v)),
      write: (v) => JSON.stringify(Array.from(v))
    },
    date: {
      read: (v) => new Date(v),
      write: (v) => v.toISOString()
    }
  };
  const customStorageEventName = "vueuse-storage";
  function useStorage(key, defaults, storage, options = {}) {
    var _a;
    const {
      flush = "pre",
      deep = true,
      listenToStorageChanges = true,
      writeDefaults = true,
      mergeDefaults = false,
      shallow,
      window: window2 = defaultWindow,
      eventFilter,
      onError = (e) => {
        console.error(e);
      },
      initOnMounted
    } = options;
    const data = (shallow ? vue.shallowRef : vue.ref)(typeof defaults === "function" ? defaults() : defaults);
    if (!storage) {
      try {
        storage = getSSRHandler("getDefaultStorage", () => {
          var _a2;
          return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
        })();
      } catch (e) {
        onError(e);
      }
    }
    if (!storage)
      return data;
    const rawInit = toValue(defaults);
    const type = guessSerializerType(rawInit);
    const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
    const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
      data,
      () => write(data.value),
      { flush, deep, eventFilter }
    );
    if (window2 && listenToStorageChanges) {
      tryOnMounted(() => {
        if (storage instanceof Storage)
          useEventListener(window2, "storage", update);
        else
          useEventListener(window2, customStorageEventName, updateFromCustomEvent);
        if (initOnMounted)
          update();
      });
    }
    if (!initOnMounted)
      update();
    function dispatchWriteEvent(oldValue, newValue) {
      if (window2) {
        const payload = {
          key,
          oldValue,
          newValue,
          storageArea: storage
        };
        window2.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, {
          detail: payload
        }));
      }
    }
    function write(v) {
      try {
        const oldValue = storage.getItem(key);
        if (v == null) {
          dispatchWriteEvent(oldValue, null);
          storage.removeItem(key);
        } else {
          const serialized = serializer.write(v);
          if (oldValue !== serialized) {
            storage.setItem(key, serialized);
            dispatchWriteEvent(oldValue, serialized);
          }
        }
      } catch (e) {
        onError(e);
      }
    }
    function read(event) {
      const rawValue = event ? event.newValue : storage.getItem(key);
      if (rawValue == null) {
        if (writeDefaults && rawInit != null)
          storage.setItem(key, serializer.write(rawInit));
        return rawInit;
      } else if (!event && mergeDefaults) {
        const value = serializer.read(rawValue);
        if (typeof mergeDefaults === "function")
          return mergeDefaults(value, rawInit);
        else if (type === "object" && !Array.isArray(value))
          return { ...rawInit, ...value };
        return value;
      } else if (typeof rawValue !== "string") {
        return rawValue;
      } else {
        return serializer.read(rawValue);
      }
    }
    function update(event) {
      if (event && event.storageArea !== storage)
        return;
      if (event && event.key == null) {
        data.value = rawInit;
        return;
      }
      if (event && event.key !== key)
        return;
      pauseWatch();
      try {
        if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
          data.value = read(event);
      } catch (e) {
        onError(e);
      } finally {
        if (event)
          vue.nextTick(resumeWatch);
        else
          resumeWatch();
      }
    }
    function updateFromCustomEvent(event) {
      update(event.detail);
    }
    return data;
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "settings" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const nativeAxios = useStorage(window.projectId + "-axios-native", false);
      const arrowFunction = useStorage(window.projectId + "-arrow-function", false);
      const noExport = useStorage(window.projectId + "-no-export", false);
      const extractData = useStorage(window.projectId + "-extract-data", false);
      const requestFunctionName = useStorage(
        window.projectId + "-request-function-name",
        "axiosRequest"
      );
      const functionNamePrefix = useStorage(window.projectId + "-function-name-prefix", "");
      return (_ctx, _cache) => {
        const _component_el_checkbox = vue.resolveComponent("el-checkbox");
        const _component_el_input = vue.resolveComponent("el-input");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(_component_el_checkbox, {
            modelValue: vue.unref(nativeAxios),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(nativeAxios) ? nativeAxios.value = $event : null),
            title: "use axios({...}) replace axios.post(...)"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("native axios")
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_checkbox, {
            modelValue: vue.unref(arrowFunction),
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(arrowFunction) ? arrowFunction.value = $event : null)
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("arrow function")
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_checkbox, {
            modelValue: vue.unref(noExport),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.isRef(noExport) ? noExport.value = $event : null)
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("no export")
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_checkbox, {
            modelValue: vue.unref(extractData),
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.isRef(extractData) ? extractData.value = $event : null)
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("extract data")
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_input, {
            modelValue: vue.unref(requestFunctionName),
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.isRef(requestFunctionName) ? requestFunctionName.value = $event : null),
            modelModifiers: { trim: true },
            style: { "width": "160px" },
            placeholder: "request function name"
          }, null, 8, ["modelValue"]),
          vue.createVNode(_component_el_input, {
            modelValue: vue.unref(functionNamePrefix),
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(functionNamePrefix) ? functionNamePrefix.value = $event : null),
            modelModifiers: { trim: true },
            style: { "width": "160px" },
            placeholder: "function name prefix"
          }, null, 8, ["modelValue"])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5b8f5f30"]]);
  _GM_addStyle(
    "@import url('https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.10.0/styles/atom-one-dark.min.css');"
  );
  _GM_addStyle(
    "@import url('https://cdn.jsdelivr.net/npm/element-plus@2.8.0/dist/index.min.css');"
  );
  window.settingsVm = {};
  function insertButton() {
    if (document.querySelector(".copy-request")) {
      return;
    }
    if (!document.querySelector(".interface-title")) {
      return;
    }
    const requestParams = $(".interface-title:contains('基本信息')");
    if (requestParams.length) {
      requestParams.append(
        '<button class="copy-request ant-btn ant-btn-primary ant-btn-md" style="margin-left:10px;">req</button>'
      );
      requestParams.append(
        '<button class="copy-interface ant-btn ant-btn-primary ant-btn-md" style="margin-left:10px;">ts</button>'
      );
      requestParams.append('<div id="yapi-app-vue"></div>');
      addSettingsButton("#yapi-app-vue");
      document.querySelector(".copy-request").addEventListener("click", () => copyRequest());
      document.querySelector(".copy-interface").addEventListener("click", () => copyInterface());
    }
    const bodyParameter = $(".col-title:contains('Body:')");
    if (bodyParameter.length) {
      bodyParameter.append(
        '<button class="body-parameter-copy-request ant-btn ant-btn-primary ant-btn-md" style="margin-left:10px;">ts</button>'
      );
      document.querySelector(".body-parameter-copy-request").addEventListener("click", copyBodyParameterInterface);
    }
    const responseParameter = $(".interface-title:contains('返回数据')");
    if (responseParameter.length) {
      responseParameter.append(
        '<button class="response-parameter-copy-request ant-btn ant-btn-primary ant-btn-md" style="margin-left:10px;">ts</button>'
      );
      document.querySelector(".response-parameter-copy-request").addEventListener("click", copyResponseParameterInterface);
    }
  }
  function insertGroupButton() {
    if (document.querySelector(".group-copy-request")) {
      return;
    }
    if (document.querySelector(".group-copy-interface")) {
      return;
    }
    const title = $(".interface-title").next().next().children();
    if (isAll()) {
      title.append(`<div></div>`);
    }
    title.append(`“
  <div style="display: flex;gap: 12px;">
  <div id="yapi-app-vue-group"></div>
  <button class="group-copy-request ant-btn ant-btn-primary ant-btn-md" style="padding: 1px 6px;font-size: 12px;width: 60px">req</button>
  <button class="group-copy-interface ant-btn ant-btn-primary ant-btn-md" style="padding: 1px 6px;font-size: 12px;width: 60px">ts</button>
</div>
`);
    addSettingsButton("#yapi-app-vue-group");
    $(".group-copy-request").on("click", copyGroupRequest);
    $(".group-copy-interface").on("click", copyGroupInterface);
  }
  function insertPathName() {
    $(".copy-request-func").remove();
    const funcName = requestName({
      path: $(".interface-url-icon").prev().text()
    });
    $(".interface-url-icon").parent().append(
      `<button  class="copy-request-func ant-btn ant-btn-primary ant-btn-md"  style="margin-left:10px;">${funcName}</button>`
    );
    document.querySelector(".copy-request-func").addEventListener("click", () => copy(funcName));
  }
  const path = vue.ref("");
  setInterval(() => {
    path.value = location.pathname;
  }, 100);
  vue.watch(path, async (val) => {
    var _a;
    window.projectId = (_a = location.href.match(/project\/(\d+)/)) == null ? void 0 : _a[1];
    if (isCate() || isAll()) {
      setTimeout(() => {
        insertGroupButton();
      }, 100);
    } else {
      setTimeout(() => {
        insertButton();
        insertPathName();
      }, 100);
    }
  });
  function addSettingsButton(el) {
    const app = vue.createApp(App);
    app.use(ElementPlus);
    app.mount(el);
  }

})(ElementPlus, Vue);
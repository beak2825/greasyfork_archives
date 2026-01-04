// ==UserScript==
// @name         网页清洁工
// @namespace    非主流小明
// @version      0.0.1
// @author       非主流小明
// @description  清洁 B 站、虎牙
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @defaulticon  https://avatars.githubusercontent.com/u/114138419?s=200&v=4
// @homepage     https://greasyfork.org/zh-CN/users/816325-非主流小明
// @homepageURL  https://github.com/nicepkg/nice-scripts/tree/master/packages/site-cleaner
// @website      https://space.bilibili.com/83540912
// @source       https://github.com/nicepkg/nice-scripts/tree/master/packages/site-cleaner
// @supportURL   https://github.com/nicepkg/nice-scripts/issues
// @match        *://www.bilibili.com/*
// @match        *://www.huya.com/*
// @match        *://stackoverflow.com/*
// @match        *://www.baidu.com/*
// @match        *://image.baidu.com/*
// @match        *://www.google.com/*
// @match        *://*.csdn.net/*
// @match        *://*.zhihu.com/*
// @match        *://m.baidu.com/*
// @match        *://baijiahao.baidu.com/*
// @match        *://baike.baidu.com/*
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_cookie
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_removeValueChangeListener
// @grant        GM_saveTab
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/482867/%E7%BD%91%E9%A1%B5%E6%B8%85%E6%B4%81%E5%B7%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/482867/%E7%BD%91%E9%A1%B5%E6%B8%85%E6%B4%81%E5%B7%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isMatchSite = (matcher, siteUrl = window.location.href) => {
    const siteMatch = typeof matcher === "string" || matcher instanceof RegExp ? [matcher] : matcher;
    if (!siteMatch)
      return true;
    return siteMatch.some((site) => siteUrl.match(site));
  };
  const insertCss = (css, options) => {
    const { win = window, keepStyle = false } = options || {};
    let style;
    const createStyle = () => {
      style = win.document.createElement("style");
      style.innerHTML = css;
      style.type = "text/css";
      win.document.head.appendChild(style);
    };
    createStyle();
    let observer;
    if (keepStyle) {
      observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.removedNodes.length && Array.from(mutation.removedNodes).includes(style)) {
            createStyle();
          }
        }
      });
      observer.observe(win.document.head, {
        childList: true
      });
    }
    return () => {
      style.remove();
      observer == null ? void 0 : observer.disconnect();
    };
  };
  const hasOwn = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  const $doms = (selector, win = window) => Array.from(win.document.querySelectorAll(selector) || []);
  const noop = () => {
  };
  const DEFAULT_GM_API_NAMESPACE = "__NICE_SCRIPTS_GM_API__";
  const initGMApi = (gmApi, namespace = DEFAULT_GM_API_NAMESPACE) => {
    if (!gmApi.unsafeWindow) {
      throw new Error("initGMApi unsafeWindow is required");
    }
    if (!self.document.__UNSAFE_WINDOW__) {
      self.document.__UNSAFE_WINDOW__ = gmApi.unsafeWindow;
    }
    const win = self.document.__UNSAFE_WINDOW__;
    if (!(win == null ? void 0 : win[namespace])) {
      win[namespace] = gmApi;
      return;
    }
    Object.entries(gmApi).forEach(([key, value]) => {
      if ((!win[namespace])[key]) {
        win[namespace][key] = value;
      }
    });
  };
  const getGMApi = (namespace = DEFAULT_GM_API_NAMESPACE) => {
    const win = self.document.__UNSAFE_WINDOW__;
    if (!(win == null ? void 0 : win[namespace])) {
      console.warn("GM API is not initialized");
    }
    return (win == null ? void 0 : win[namespace]) || {};
  };
  const getUnsafeWindow = (defaultWindow = window, namespace = DEFAULT_GM_API_NAMESPACE) => {
    return getGMApi(namespace).unsafeWindow || defaultWindow;
  };
  const watchElementDisplay = (selector, callback, options) => {
    var _a;
    const { win = getUnsafeWindow() } = options || {};
    if (!(win == null ? void 0 : win.__OBSERVER_CONFIG__)) {
      win.__OBSERVER_CONFIG__ = {};
    }
    const defaultConfig = {
      queue: /* @__PURE__ */ new Map(),
      observer: void 0,
      dispose: void 0
    };
    win.__OBSERVER_CONFIG__ ?? (win.__OBSERVER_CONFIG__ = {
      watchElementDisplay: defaultConfig
    });
    (_a = win.__OBSERVER_CONFIG__).watchElementDisplay ?? (_a.watchElementDisplay = defaultConfig);
    const queue = win.__OBSERVER_CONFIG__.watchElementDisplay.queue;
    if (!queue.get(selector)) {
      queue.set(selector, /* @__PURE__ */ new Set());
    }
    queue.get(selector).add(callback);
    if (win.__OBSERVER_CONFIG__.watchElementDisplay.observer)
      return noop;
    win.__OBSERVER_CONFIG__.watchElementDisplay.observer = new MutationObserver((mutationsList) => {
      var _a2, _b;
      const queue2 = (_b = (_a2 = win.__OBSERVER_CONFIG__) == null ? void 0 : _a2.watchElementDisplay) == null ? void 0 : _b.queue;
      if (!(queue2 == null ? void 0 : queue2.size))
        return;
      const addedElements = /* @__PURE__ */ new Set();
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              addedElements.add(node);
            }
          });
        }
      }
      for (const [selector2, callbacks] of queue2.entries()) {
        for (const el of addedElements) {
          if (el.matches(selector2)) {
            callbacks.forEach((callback2) => callback2(el));
          } else {
            const targetElement = el.querySelector(selector2);
            if (targetElement) {
              callbacks.forEach((callback2) => callback2(targetElement));
            }
          }
        }
      }
    });
    win.__OBSERVER_CONFIG__.watchElementDisplay.observer.observe(document, {
      childList: true,
      subtree: true
    });
    return () => {
      var _a2, _b, _c, _d, _e;
      (_a2 = queue.get(selector)) == null ? void 0 : _a2.delete(callback);
      if (!((_b = queue.get(selector)) == null ? void 0 : _b.size)) {
        queue.delete(selector);
      }
      if (!queue.size && win.__OBSERVER_CONFIG__) {
        (_e = (_d = (_c = win.__OBSERVER_CONFIG__.watchElementDisplay) == null ? void 0 : _c.observer) == null ? void 0 : _d.disconnect) == null ? void 0 : _e.call(_d);
        win.__OBSERVER_CONFIG__.watchElementDisplay = void 0;
      }
    };
  };
  const hideElCssMap = {
    "display-none": `{
    display: none !important;
  }`,
    "zero-size": `{
    width: 0 !important;
    height: 0 !important;
    padding: 0 !important;
    opacity: 0 !important;
    overflow: hidden !important;
    visibility: hidden !important;
    cursor: none !important;
    pointer-events: none !important;
  }`,
    "visibility-hidden": `{
    visibility: hidden !important;
    opacity: 0 !important;
    cursor: none !important;
    pointer-events: none !important;
  }`
  };
  const hideEl = (options) => {
    const { selector, type = "display-none", keepStyle = true, win = window } = options;
    const els = $doms(selector);
    const removeEls = () => {
      els.forEach((el) => {
        el.remove();
      });
    };
    if (els.length) {
      switch (type) {
        case "remove-once":
          removeEls();
          break;
        case "remove-realtime":
          removeEls();
          return watchElementDisplay(selector, (el) => {
            var _a;
            (_a = el == null ? void 0 : el.remove) == null ? void 0 : _a.call(el);
          });
        case "display-none":
        case "zero-size":
        case "visibility-hidden":
        default:
          return insertCss(`
        ${selector} ${hideElCssMap[type || "display-none"]}}`, {
            keepStyle,
            win
          });
      }
    }
    return noop;
  };
  const hideEls = (configs) => {
    const disposes = [];
    configs.forEach((config) => {
      if (!config)
        return;
      const { siteMatch, type, selectors, keepStyle = true, win = window } = config;
      if (!isMatchSite(siteMatch))
        return;
      let css = "";
      selectors.forEach((selector) => {
        if (!selector)
          return;
        const shouldInsertCss = hideElCssMap[type];
        if (shouldInsertCss) {
          css += `
          ${selector} ${shouldInsertCss}
        `;
          return;
        }
        disposes.push(hideEl({
          selector,
          type,
          keepStyle,
          win
        }));
      });
      if (css)
        disposes.push(insertCss(css, {
          keepStyle,
          win
        }));
    });
    return () => {
      disposes.forEach((dispose) => {
        dispose();
      });
    };
  };
  const JSM_APP_CONFIG_CHANGE_ARRAY_EVENT_NAME = "jsm-app-config-array-change";
  const JSM_GM_API_NAMESPACE = "__JSM_GM_API__";
  const JSM_APP_CONFIGS = "__JSM_APP_CONFIGS__";
  var RoutePaths;
  (function(RoutePaths2) {
    RoutePaths2["ScriptsSettingsList"] = "/scripts-settings-list";
    RoutePaths2["ScriptsMarket"] = "/scripts-market";
    RoutePaths2["SiteNavigation"] = "/site-navigation";
    RoutePaths2["NotFound"] = "/404";
  })(RoutePaths || (RoutePaths = {}));
  class GMStorage {
    constructor(namespace = DEFAULT_GM_API_NAMESPACE) {
      this.setItem = (key, value) => {
        var _a, _b;
        return (_b = (_a = this.gmApi).GM_setValue) == null ? void 0 : _b.call(_a, key, value);
      };
      this.getItem = (key, defaultValue) => {
        var _a, _b;
        return ((_b = (_a = this.gmApi) == null ? void 0 : _a.GM_getValue) == null ? void 0 : _b.call(_a, key, defaultValue)) ?? defaultValue ?? null;
      };
      this.removeItem = (key) => {
        var _a, _b;
        (_b = (_a = this.gmApi) == null ? void 0 : _a.GM_deleteValue) == null ? void 0 : _b.call(_a, key);
      };
      this.key = (index) => {
        var _a, _b;
        const keys = ((_b = (_a = this.gmApi) == null ? void 0 : _a.GM_listValues) == null ? void 0 : _b.call(_a)) || [];
        return index < keys.length ? keys[index] : null;
      };
      this.clear = () => {
        var _a, _b;
        const keys = ((_b = (_a = this.gmApi) == null ? void 0 : _a.GM_listValues) == null ? void 0 : _b.call(_a)) || [];
        keys.forEach((key) => {
          var _a2, _b2;
          (_b2 = (_a2 = this.gmApi) == null ? void 0 : _a2.GM_deleteValue) == null ? void 0 : _b2.call(_a2, key);
        });
      };
      this.namespace = namespace;
    }
    get gmApi() {
      return getGMApi(this.namespace);
    }
    // Get the number of stored items
    get length() {
      var _a, _b, _c;
      return ((_c = (_b = (_a = this.gmApi) == null ? void 0 : _a.GM_listValues) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.length) || 0;
    }
  }
  const getJsmUnsafeWindow = () => {
    return getUnsafeWindow(window, JSM_GM_API_NAMESPACE);
  };
  const jsmGmStorage = new GMStorage(JSM_GM_API_NAMESPACE);
  const getJsmAppConfigsFromWindow = () => {
    if (!document[JSM_APP_CONFIGS]) {
      document[JSM_APP_CONFIGS] = [];
    }
    return document[JSM_APP_CONFIGS];
  };
  const emitUpdateApp = () => {
    getJsmUnsafeWindow().dispatchEvent(new Event(JSM_APP_CONFIG_CHANGE_ARRAY_EVENT_NAME));
  };
  const createAppStorageKey = (namespace) => {
    return namespace;
  };
  const createPageStorageKey = (options) => {
    if (hasOwn(options, "prefix")) {
      return options.prefix + "/" + options.pageId;
    } else {
      return options.namespace + "/" + options.pageId;
    }
  };
  const createFormStorageKey = (options) => {
    if (hasOwn(options, "prefix")) {
      return options.prefix + "/" + options.formId;
    } else {
      return options.namespace + "/" + options.pageId + "/" + options.formId;
    }
  };
  const createFieldStorageKey = (options) => {
    if (hasOwn(options, "prefix")) {
      return options.prefix + "/" + options.fieldName;
    } else {
      return options.namespace + "/" + options.pageId + "/" + options.formId + "/" + options.fieldName;
    }
  };
  const updateAppStorageKey = (app, options) => {
    app.namespace = createAppStorageKey(options.namespace);
    if (options.deep) {
      updatePagesStorageKey(app.pages || [], {
        ...options,
        namespace: app.namespace
      });
    }
    return app.namespace;
  };
  const updatePageStorageKey = (page, options) => {
    page.__storageKeyPrefix__ = createPageStorageKey({
      ...options,
      pageId: page.id
    });
    if (options.deep) {
      updateFormsStorageKey(page.forms || [], {
        ...options,
        pageId: page.id
      });
    }
    return page.__storageKeyPrefix__;
  };
  const updateFormStorageKey = (form, options) => {
    form.__storageKeyPrefix__ = createFormStorageKey({
      ...options,
      formId: form.id
    });
    if (options.deep) {
      updateFieldsStorageKey(form.fields || [], {
        ...options,
        formId: form.id
      });
    }
    return form.__storageKeyPrefix__;
  };
  const updateFieldStorageKey = (field, options) => {
    field.__storageKeyPrefix__ = createFieldStorageKey({
      ...options,
      fieldName: field.name
    });
    return field.__storageKeyPrefix__;
  };
  const updateFieldsStorageKey = (fields, options) => {
    fields.forEach((field) => {
      return updateFieldStorageKey(field, options);
    });
  };
  const updateFormsStorageKey = (forms, options) => {
    forms.forEach((form) => {
      updateFormStorageKey(form, options);
      if (options.deep) {
        updateFieldsStorageKey(form.fields || [], {
          ...options,
          formId: form.id
        });
      }
    });
  };
  const updatePagesStorageKey = (pages, options) => {
    pages.forEach((page) => {
      updatePageStorageKey(page, options);
      if (options.deep) {
        updateFormsStorageKey(page.forms || [], {
          ...options,
          pageId: page.id
        });
      }
    });
  };
  const getFormDefaultValues = ({ initialValues, fields }) => {
    const _defaultValues = { ...initialValues };
    fields.forEach((field) => {
      if (["switch", "checkbox", "radio", "checkbox-group", "radio-group"].includes(field.type)) {
        _defaultValues[field.name] = field.defaultChecked ?? (initialValues == null ? void 0 : initialValues[field.name]);
      } else {
        _defaultValues[field.name] = field.defaultValue ?? (initialValues == null ? void 0 : initialValues[field.name]);
      }
    });
    return _defaultValues;
  };
  class JsmForm {
    constructor(form, options) {
      this.updateStoragePrefixKey = (options2) => {
        return updateFormStorageKey(this.data, {
          deep: true,
          ...options2
        });
      };
      this.deepUpdateChildrenStorageKey = () => {
        updateFieldsStorageKey(this.data.fields || [], {
          prefix: this.data.__storageKeyPrefix__ || ""
        });
      };
      this.storageKey = () => {
        return this.data.__storageKeyPrefix__;
      };
      this.findFieldByName = (fieldName) => {
        return this.data.fields.find((field) => field.name === fieldName) || null;
      };
      this.getDefaultValueByFieldName = (fieldName) => {
        const defaultValues = getFormDefaultValues({
          fields: this.data.fields,
          initialValues: this.data.initialValues
        });
        return defaultValues[fieldName] ?? void 0;
      };
      this.addField = (field) => {
        updateFieldStorageKey(field, {
          prefix: this.data.__storageKeyPrefix__ || ""
        });
        this.data.fields.push(field);
        emitUpdateApp();
        return JsmForm.createFieldController(field.__storageKeyPrefix__, this.getDefaultValueByFieldName(field.name));
      };
      this.deleteFieldByName = (fieldName) => {
        this.data.fields.splice(this.data.fields.findIndex((field) => field.name === fieldName), 1);
        emitUpdateApp();
      };
      this.updateFieldByName = (fieldName, updater) => {
        const field = this.findFieldByName(fieldName);
        let finalField = field;
        if (field) {
          const newField = typeof updater === "function" ? updater(field) : updater;
          finalField = newField;
          this.data.fields.splice(this.data.fields.findIndex((field2) => field2.name === fieldName), 1, newField);
        }
        if (!finalField)
          return JsmForm.createFieldController();
        updateFieldStorageKey(finalField, {
          prefix: this.data.__storageKeyPrefix__ || ""
        });
        emitUpdateApp();
        return JsmForm.createFieldController(finalField.__storageKeyPrefix__, this.getDefaultValueByFieldName(finalField.name));
      };
      const { updateStoragePrefixKey = false, deepUpdateChildrenStorageKey = true } = options || {};
      this.data = form instanceof JsmForm ? form.data : form;
      updateStoragePrefixKey && this.updateStoragePrefixKey(updateStoragePrefixKey);
      const isDeep = hasOwn(updateStoragePrefixKey, "deep") ? updateStoragePrefixKey.deep !== false : true;
      if (deepUpdateChildrenStorageKey && !isDeep) {
        deepUpdateChildrenStorageKey && this.deepUpdateChildrenStorageKey();
      }
    }
  }
  JsmForm.createFieldController = (fieldStorageKey, defaultValue) => {
    return [
      () => {
        if (fieldStorageKey) {
          return jsmGmStorage.getItem(fieldStorageKey, defaultValue);
        }
        return null;
      },
      (value) => {
        if (fieldStorageKey) {
          jsmGmStorage.setItem(fieldStorageKey, value);
        }
      }
    ];
  };
  class JsmPage {
    constructor(page, options) {
      this.updateStoragePrefixKey = (options2) => {
        return updatePageStorageKey(this.data, {
          deep: true,
          ...options2
        });
      };
      this.deepUpdateChildrenStorageKey = () => {
        updateFormsStorageKey(this.data.forms || [], {
          prefix: this.data.__storageKeyPrefix__ || "",
          deep: true
        });
      };
      this.storageKey = () => {
        return this.data.__storageKeyPrefix__;
      };
      this.findFormById = (formId) => {
        var _a, _b;
        if (!((_a = this.data.forms) == null ? void 0 : _a.length))
          return null;
        const form = (_b = this.data.forms) == null ? void 0 : _b.find((form2) => form2.id === formId);
        return form ? new JsmForm(form, {
          deepUpdateChildrenStorageKey: false
        }) : null;
      };
      this.addForm = (form) => {
        const newForm = new JsmForm(form, {
          updateStoragePrefixKey: {
            prefix: this.data.__storageKeyPrefix__ || ""
          }
        });
        const currentForm = this.findFormById(newForm.data.id);
        if (currentForm) {
          return currentForm;
        }
        if (!this.data.forms) {
          this.data.forms = [];
        }
        this.data.forms.push(newForm.data);
        emitUpdateApp();
        return newForm;
      };
      this.deleteFormById = (formId) => {
        var _a, _b;
        if (!((_a = this.data.forms) == null ? void 0 : _a.length))
          return;
        this.data.forms.splice((_b = this.data.forms) == null ? void 0 : _b.findIndex((form) => form.id === formId), 1);
        emitUpdateApp();
      };
      this.updateFormById = (formId, updater) => {
        var _a;
        if (!((_a = this.data.forms) == null ? void 0 : _a.length))
          return null;
        const form = this.findFormById(formId);
        let finalForm = form;
        if (form) {
          const newFormData = updater instanceof JsmForm ? updater.data : typeof updater === "function" ? updater(form.data) : updater;
          finalForm = new JsmForm(newFormData, {
            updateStoragePrefixKey: {
              prefix: this.data.__storageKeyPrefix__ || ""
            }
          });
          this.data.forms.splice(this.data.forms.findIndex((form2) => form2.id === formId), 1, finalForm.data);
        }
        if (!finalForm)
          return null;
        emitUpdateApp();
        return finalForm;
      };
      this.findFieldByName = (fieldName, formId) => {
        var _a;
        if (!((_a = this.data.forms) == null ? void 0 : _a.length))
          return null;
        const jsmForm = this.findFormById(formId || this.data.forms[0].id);
        return (jsmForm == null ? void 0 : jsmForm.findFieldByName(fieldName)) || null;
      };
      this.addField = (field, formId) => {
        var _a;
        if (!((_a = this.data.forms) == null ? void 0 : _a.length)) {
          console.warn("addField: No form found", { field, formId });
          return JsmForm.createFieldController();
        }
        const jsmForm = this.findFormById(formId || this.data.forms[0].id);
        if (!jsmForm) {
          console.warn("addField: No form found", { field, formId });
          return JsmForm.createFieldController();
        }
        return jsmForm.addField(field);
      };
      this.deleteField = (fieldName, formId) => {
        var _a;
        if (!((_a = this.data.forms) == null ? void 0 : _a.length)) {
          return;
        }
        const jsmForm = this.findFormById(formId || this.data.forms[0].id);
        return jsmForm == null ? void 0 : jsmForm.deleteFieldByName(fieldName);
      };
      this.updateFieldByName = (fieldName, updater, formId) => {
        var _a;
        if (!((_a = this.data.forms) == null ? void 0 : _a.length)) {
          console.warn("updateFieldByName: No form found", {
            fieldName,
            formId
          });
          return JsmForm.createFieldController();
        }
        const jsmForm = this.findFormById(formId || this.data.forms[0].id);
        if (!jsmForm) {
          console.warn("updateFieldByName: No form found", {
            fieldName,
            formId
          });
          return JsmForm.createFieldController();
        }
        return jsmForm.updateFieldByName(fieldName, updater);
      };
      const { updateStoragePrefixKey = false, deepUpdateChildrenStorageKey = true } = options || {};
      this.data = page instanceof JsmPage ? page.data : page;
      updateStoragePrefixKey && this.updateStoragePrefixKey(updateStoragePrefixKey);
      const isDeep = hasOwn(updateStoragePrefixKey, "deep") ? updateStoragePrefixKey.deep !== false : true;
      if (deepUpdateChildrenStorageKey && !isDeep) {
        deepUpdateChildrenStorageKey && this.deepUpdateChildrenStorageKey();
      }
    }
  }
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var eventemitter3 = { exports: {} };
  (function(module) {
    var has = Object.prototype.hasOwnProperty, prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    {
      module.exports = EventEmitter2;
    }
  })(eventemitter3);
  var eventemitter3Exports = eventemitter3.exports;
  const EventEmitter = /* @__PURE__ */ getDefaultExportFromCjs(eventemitter3Exports);
  class Jsm extends EventEmitter {
    constructor(appConfig, options) {
      super();
      this.deepUpdateChildrenStorageKey = () => {
        updatePagesStorageKey(this.data.pages, {
          namespace: this.data.namespace,
          deep: true
        });
      };
      this.updateStoragePrefixKey = (options2) => {
        return updateAppStorageKey(this.data, {
          deep: true,
          ...options2
        });
      };
      this.init = () => {
        var _a;
        if ((_a = getJsmAppConfigsFromWindow()) == null ? void 0 : _a.find((config) => config.namespace === this.data.namespace)) {
          console.warn(`Jsm: namespace "${this.data.namespace}" already exists.`);
          return;
        }
        getJsmAppConfigsFromWindow().push(this.data);
        emitUpdateApp();
      };
      this.storageKey = () => {
        return createAppStorageKey(this.data.namespace);
      };
      this.goToPage = (pageId) => {
        this.emit("goToPage", pageId);
      };
      this.findPageById = (pageId) => {
        const page = this.data.pages.find((page2) => page2.id === pageId);
        return page ? new JsmPage(page, {
          deepUpdateChildrenStorageKey: false
        }) : null;
      };
      this.addPage = (page) => {
        const newPage = new JsmPage(page, {
          updateStoragePrefixKey: {
            namespace: this.data.namespace
          }
        });
        const currentPage = this.findPageById(newPage.data.id);
        if (currentPage) {
          return currentPage;
        }
        this.data.pages.push(newPage.data);
        emitUpdateApp();
        return newPage;
      };
      this.deletePageById = (pageId) => {
        this.data.pages.splice(this.data.pages.findIndex((page) => page.id === pageId), 1);
        emitUpdateApp();
      };
      this.updatePageById = (pageId, updater) => {
        const page = this.findPageById(pageId);
        let finalPage = page;
        if (page) {
          const newPageData = updater instanceof JsmPage ? updater.data : typeof updater === "function" ? updater(page.data) : updater;
          finalPage = new JsmPage(newPageData, {
            updateStoragePrefixKey: {
              namespace: this.data.namespace
            }
          });
          this.data.pages.splice(this.data.pages.findIndex((page2) => page2.id === pageId), 1, finalPage.data);
        }
        if (!finalPage)
          return null;
        emitUpdateApp();
        return finalPage;
      };
      const { updateStoragePrefixKey = false, deepUpdateChildrenStorageKey = true } = options || {};
      if (appConfig.namespace.includes("/")) {
        throw new Error(`Jsm: namespace "${appConfig.namespace}" should not include "/"`);
      }
      this.data = { ...appConfig, emitter: this };
      updateStoragePrefixKey && this.updateStoragePrefixKey(updateStoragePrefixKey);
      const isDeep = hasOwn(updateStoragePrefixKey, "deep") ? updateStoragePrefixKey.deep !== false : true;
      if (deepUpdateChildrenStorageKey && !isDeep) {
        deepUpdateChildrenStorageKey && this.deepUpdateChildrenStorageKey();
      }
    }
  }
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
  var _GM_getTab = /* @__PURE__ */ (() => typeof GM_getTab != "undefined" ? GM_getTab : void 0)();
  var _GM_getTabs = /* @__PURE__ */ (() => typeof GM_getTabs != "undefined" ? GM_getTabs : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
  var _GM_saveTab = /* @__PURE__ */ (() => typeof GM_saveTab != "undefined" ? GM_saveTab : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _GM_webRequest = /* @__PURE__ */ (() => typeof GM_webRequest != "undefined" ? GM_webRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var _monkeyWindow = /* @__PURE__ */ (() => window)();
  const GMApi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    GM: _GM,
    GM_addElement: _GM_addElement,
    GM_addStyle: _GM_addStyle,
    GM_addValueChangeListener: _GM_addValueChangeListener,
    GM_cookie: _GM_cookie,
    GM_deleteValue: _GM_deleteValue,
    GM_download: _GM_download,
    GM_getResourceText: _GM_getResourceText,
    GM_getResourceURL: _GM_getResourceURL,
    GM_getTab: _GM_getTab,
    GM_getTabs: _GM_getTabs,
    GM_getValue: _GM_getValue,
    GM_info: _GM_info,
    GM_listValues: _GM_listValues,
    GM_log: _GM_log,
    GM_notification: _GM_notification,
    GM_openInTab: _GM_openInTab,
    GM_registerMenuCommand: _GM_registerMenuCommand,
    GM_removeValueChangeListener: _GM_removeValueChangeListener,
    GM_saveTab: _GM_saveTab,
    GM_setClipboard: _GM_setClipboard,
    GM_setValue: _GM_setValue,
    GM_unregisterMenuCommand: _GM_unregisterMenuCommand,
    GM_webRequest: _GM_webRequest,
    GM_xmlhttpRequest: _GM_xmlhttpRequest,
    monkeyWindow: _monkeyWindow,
    unsafeWindow: _unsafeWindow
  }, Symbol.toStringTag, { value: "Module" }));
  const jsm = new Jsm({
    namespace: _GM_info.script.namespace + "-" + _GM_info.script.name,
    name: _GM_info.script.name,
    author: _GM_info.script.author,
    authorAvatarUrl: "https://i1.hdslb.com/bfs/face/0cda8249c100d380c505e13494aa87f7c1acde5f.jpg@120w_120h_1c.webp",
    description: _GM_info.script.description,
    iconUrl: _GM_info.script.icon,
    pages: []
  });
  const cleanMobileBaidu = () => {
    const siteMatch = ["m.baidu.com", "www.baidu.com"];
    const imageSiteMatch = ["image.baidu.com", "m.baidu.com"];
    const baijiaSiteMatch = ["baijiahao.baidu.com"];
    const baikeSiteMatch = ["baike.baidu.com"];
    const cleanBaiduSettingPage = new JsmPage({
      id: "clean-mobile-baidu-setting",
      title: "百度手机版去广告设置",
      forms: [
        {
          id: "clean-mobile-baidu-setting-form",
          siteMatchers: [
            siteMatch,
            imageSiteMatch,
            baijiaSiteMatch,
            baikeSiteMatch
          ],
          fields: []
        }
      ]
    });
    jsm.addPage(cleanBaiduSettingPage);
    const [getCleanTextSearchAd] = cleanBaiduSettingPage.addField({
      type: "switch",
      name: "去除文字搜索页面广告",
      defaultChecked: true
    });
    const [getCleanImageSearchAd] = cleanBaiduSettingPage.addField({
      type: "switch",
      name: "去除图片搜索页面广告",
      defaultChecked: true
    });
    const [getCleanBaijiaAd] = cleanBaiduSettingPage.addField({
      type: "switch",
      name: "去除百家号广告",
      defaultChecked: true
    });
    const [getCleanBaikeAd] = cleanBaiduSettingPage.addField({
      type: "switch",
      name: "去除百科广告",
      defaultChecked: true
    });
    hideEls([
      getCleanTextSearchAd() && {
        siteMatch,
        type: "zero-size",
        selectors: [".ec_wise_ad", ".short-mini-wrapper"]
      },
      getCleanTextSearchAd() && {
        siteMatch,
        type: "display-none",
        selectors: [
          "#header > #navs+script+div",
          ".tab-news-content",
          ".square-enterance",
          ".tab_news",
          "#bottom",
          ".callicon-wrap",
          ".his-no-rec",
          ".rw-list-container .c-line-clamp1",
          ".c-atom-afterclick-recomm-wrap .c-line-clamp1",
          "#copyright + div",
          "#page-copyright",
          ".sfc-video-page-info-bottom-line",
          ".sfc-video-page-info-bottom-line + div",
          ".sfc-video-page-info-bottom-line + div + div"
        ]
      },
      getCleanImageSearchAd() && {
        siteMatch: imageSiteMatch,
        type: "display-none",
        selectors: [
          ".sfc-image-content-ad-xg-cell",
          ".icon-download",
          ".icon-download + div"
        ]
      },
      getCleanBaijiaAd() && {
        siteMatch: baijiaSiteMatch,
        type: "display-none",
        selectors: [
          ".newHeadDeflectorContainer",
          "#searchwordSdk + div",
          "#bdrainrwDragButton",
          "#wise-invoke-interact-bar",
          ".invokeAppBtnWrapper",
          "#content_wrapper  .horizontal",
          ".newFollowSuper"
        ]
      },
      getCleanBaikeAd() && {
        siteMatch: baikeSiteMatch,
        type: "display-none",
        selectors: [".BK-after-content-wrapper", '[class*="lemma-attention"]']
      }
    ]);
    if (isMatchSite(siteMatch) && getCleanTextSearchAd()) {
      watchElementDisplay(".result", (el) => {
        var _a, _b;
        if ((_b = (_a = el.querySelector(".se_st_footer")) == null ? void 0 : _a.innerText) == null ? void 0 : _b.match("百度APP内打开")) {
          el.remove();
        }
      });
    }
    insertCss(
      `
  body {
    background-color: #fff;
    min-height: 100vh;
  }
  `,
      {
        keepStyle: true
      }
    );
  };
  const cleanPCBaidu = () => {
    const siteMatch = ["www.baidu.com"];
    const imageSiteMatch = ["image.baidu.com"];
    const cleanBaiduSettingPage = new JsmPage({
      id: "clean-pc-baidu-setting",
      title: "百度电脑版去广告设置",
      forms: [
        {
          id: "clean-pc-baidu-setting-form",
          siteMatchers: [siteMatch, imageSiteMatch],
          fields: []
        }
      ]
    });
    jsm.addPage(cleanBaiduSettingPage);
    const [getCleanTextSearchAd] = cleanBaiduSettingPage.addField({
      type: "switch",
      name: "去除文字搜索页面广告",
      defaultChecked: true
    });
    const [getCleanImageSearchAd] = cleanBaiduSettingPage.addField({
      type: "switch",
      name: "去除图片搜索页面广告",
      defaultChecked: true
    });
    hideEls([
      getCleanTextSearchAd() && {
        siteMatch,
        type: "zero-size",
        selectors: ["[data-placeid]"]
      },
      getCleanTextSearchAd() && {
        siteMatch,
        type: "display-none",
        selectors: [
          "#s_main",
          ".tenon_pc_material",
          "#content_right",
          "#foot",
          "#searchTag"
        ]
      },
      getCleanImageSearchAd() && {
        siteMatch: imageSiteMatch,
        type: "display-none",
        selectors: [".newfcImgli"]
      }
    ]);
    if (isMatchSite(siteMatch) && getCleanTextSearchAd()) {
      watchElementDisplay(".result", (el) => {
        var _a, _b;
        if ((_b = (_a = el.querySelector(".se_st_footer")) == null ? void 0 : _a.innerText) == null ? void 0 : _b.match("广告")) {
          el.remove();
        }
      });
    }
  };
  const cleanPCBilibili = () => {
    const siteMatch = ["www.bilibili.com"];
    const cleanBilibiliSettingPage = new JsmPage({
      id: "clean-pc-bilibili-setting",
      title: "B站电脑版去广告设置",
      forms: [
        {
          id: "clean-pc-bilibili-setting-form",
          siteMatchers: [siteMatch],
          fields: []
        }
      ]
    });
    jsm.addPage(cleanBilibiliSettingPage);
    const [getCleanCommonAd] = cleanBilibiliSettingPage.addField({
      type: "switch",
      name: "去除B站普通广告",
      defaultChecked: true
    });
    hideEls([
      getCleanCommonAd() && {
        siteMatch,
        type: "display-none",
        selectors: [
          ".floor-single-card",
          ".bili-header__bar li.v-popover-wrap:last-child",
          "[data-loc-id]",
          ".left-loc-entry",
          ".vip-wrap",
          ".storage-box",
          ".international-footer"
        ]
      }
    ]);
    if (isMatchSite(siteMatch) && getCleanCommonAd()) {
      watchElementDisplay(".bili-video-card", (el) => {
        var _a;
        if (el == null ? void 0 : el.querySelector(".bili-video-card__info--ad")) {
          el.remove();
          if ((_a = el.parentElement) == null ? void 0 : _a.classList.contains("feed-card")) {
            el.parentElement.remove();
          }
        }
      });
    }
  };
  const cleanPCCsdn = () => {
    const siteMatch = [/\.csdn\.net/];
    const cleanCsdnSettingPage = new JsmPage({
      id: "clean-pc-csdn-setting",
      title: "CSDN电脑版去广告设置",
      forms: [
        {
          id: "clean-pc-csdn-setting-form",
          siteMatchers: [siteMatch],
          fields: []
        }
      ]
    });
    jsm.addPage(cleanCsdnSettingPage);
    const [getCleanCommonAd] = cleanCsdnSettingPage.addField({
      type: "switch",
      name: "去除CSDN普通广告",
      defaultChecked: true
    });
    hideEls([
      getCleanCommonAd() && {
        siteMatch,
        type: "display-none",
        selectors: [
          "#asideWriteGuide",
          "#csdn-toolbar-write",
          ".toolbar-btns.onlyUser",
          ".toolbar-menus.csdn-toolbar-fl",
          ".csdn-toolbar-creative-mp",
          ".programmer1Box",
          ".csdn-side-toolbar",
          ".left-toolbox",
          ".aside-content",
          "#asideHotArticle",
          "#asideCategory",
          "#asideNewComments",
          "#asideNewNps",
          "#asideArchive",
          ".passport-login-container",
          "#treeSkill",
          ".more-toolbox-new",
          ".recommend-box",
          "#recommendNps"
        ]
      },
      getCleanCommonAd() && {
        siteMatch,
        type: "zero-size",
        selectors: [".kind_person", "#asideSearchArticle", "#asideArchive"]
      }
    ]);
  };
  const cleanPCGoogle = () => {
    const siteMatch = ["www.google.com"];
    const cleanGoogleSettingPage = new JsmPage({
      id: "clean-pc-google-setting",
      title: "谷歌电脑版去广告设置",
      forms: [
        {
          id: "clean-pc-google-setting-form",
          siteMatchers: [siteMatch],
          fields: []
        }
      ]
    });
    jsm.addPage(cleanGoogleSettingPage);
    const [getCleanCommonAd] = cleanGoogleSettingPage.addField({
      type: "switch",
      name: "去除谷歌普通广告",
      defaultChecked: true
    });
    hideEls([
      getCleanCommonAd() && {
        siteMatch,
        type: "display-none",
        selectors: [
          '[aria-label="Ads"]',
          "#tvcap",
          '[data-id^="Carousel"]',
          "#atvcap"
        ]
      }
    ]);
  };
  const cleanPCHuya = () => {
    const siteMatch = ["www.huya.com"];
    const cleanHuyaSettingPage = new JsmPage({
      id: "clean-pc-huya-setting",
      title: "虎牙电脑版去广告设置",
      forms: [
        {
          id: "clean-pc-huya-setting-form",
          siteMatchers: [siteMatch],
          fields: []
        }
      ]
    });
    jsm.addPage(cleanHuyaSettingPage);
    const [getCleanCommonAd] = cleanHuyaSettingPage.addField({
      type: "switch",
      name: "去除虎牙普通广告",
      defaultChecked: true
    });
    hideEls([
      getCleanCommonAd() && {
        siteMatch,
        type: "display-none",
        selectors: [
          ".hy-nav-item-youliao",
          'div[class*="helperbar-root"]',
          ".mod-sidebar .sidebar-banner",
          ".sidebar-bottom",
          ".hy-nav-item-game",
          ".hy-nav-item-cloudGame",
          'div[class*="NavKaiBo"]',
          'div[class*="NavDownload"]',
          ".room-gg-chat",
          ".room-gg-top",
          ".gamePromote-bd",
          ".player-app-qrcode",
          ".room-youlike",
          ".room-moments",
          ".jump-to-phone",
          ".room-gamePromote",
          ".illegal-report",
          ".share-entrance",
          ".room-gg-1",
          '[class*="Ad--"]',
          '[class*="taskTips--"]',
          '[class*="GuangG--"]',
          '[class*="game-filter-tips--"]',
          '.chat-wrap-panel.wrap-ext [class*="popup"]',
          ".room-footer",
          ".danmu-report-tips",
          ".xxSlider",
          ".list-adx",
          ".liveList-header-r",
          ".hy-nav-item-match",
          ".huya-footer",
          ".mod-news-section",
          "a.third-clickstat",
          ".mod-index-recommend",
          "#player-download-guide-tip",
          ".player-banner-gift",
          "#player-marquee-wrap",
          ".room-business-game"
        ]
      }
    ]);
  };
  const cleanPCStackoverflow = () => {
    const siteMatch = ["stackoverflow.com"];
    const cleanStackoverflowSettingPage = new JsmPage({
      id: "clean-pc-stackoverflow-setting",
      title: "Stackoverflow电脑版去广告设置",
      forms: [
        {
          id: "clean-pc-stackoverflow-setting-form",
          siteMatchers: [siteMatch],
          fields: []
        }
      ]
    });
    jsm.addPage(cleanStackoverflowSettingPage);
    const [getCleanCommonAd] = cleanStackoverflowSettingPage.addField({
      type: "switch",
      name: "去除Stackoverflow普通广告",
      defaultChecked: true
    });
    hideEls([
      getCleanCommonAd() && {
        siteMatch,
        type: "display-none",
        selectors: [
          ".js-zone-container",
          ".show-votes",
          "#left-sidebar",
          ".js-dismissable-hero",
          "#footer",
          ".s-navigation",
          ".js-consent-banner"
        ]
      }
    ]);
  };
  const cleanPCZhihu = () => {
    const siteMatch = [/\.zhihu\.com/];
    const cleanZhihuSettingPage = new JsmPage({
      id: "clean-pc-zhihu-setting",
      title: "知乎电脑版去广告设置",
      forms: [
        {
          id: "clean-pc-zhihu-setting-form",
          siteMatchers: [siteMatch],
          fields: []
        }
      ]
    });
    jsm.addPage(cleanZhihuSettingPage);
    const [getCleanCommonAd] = cleanZhihuSettingPage.addField({
      type: "switch",
      name: "去除知乎普通广告",
      defaultChecked: true
    });
    hideEls([
      getCleanCommonAd() && {
        siteMatch,
        type: "display-none",
        selectors: [
          ".Business-Card-PcRightBanner-link",
          '[data-za-detail-view-path-module="RightSideBar"] div.Card:nth-child(2)',
          "footer",
          ".GlobalSideBar-serviceItem",
          ".GlobalSideBar-help-centerItem",
          ".GlobalSideBar-copyrightItem"
        ]
      }
    ]);
    if (isMatchSite(siteMatch) && getCleanCommonAd()) {
      watchElementDisplay(".Banner-link", (el) => {
        var _a;
        if ((_a = el.parentElement) == null ? void 0 : _a.classList.contains("Pc-card")) {
          el.parentElement.remove();
        }
        el.remove();
      });
    }
  };
  const onEarliestPageLoad = (callback, win = window) => {
    let isLoad = false;
    const load = () => {
      if (isLoad) {
        return;
      }
      isLoad = true;
      callback();
    };
    win.document.addEventListener("DOMContentLoaded", load);
    win.addEventListener("load", load);
  };
  initGMApi(GMApi);
  onEarliestPageLoad(() => {
    cleanPCBilibili();
    cleanPCHuya();
    cleanPCStackoverflow();
    cleanPCBaidu();
    cleanMobileBaidu();
    cleanPCGoogle();
    cleanPCCsdn();
    cleanPCZhihu();
    jsm.init();
  });

})();
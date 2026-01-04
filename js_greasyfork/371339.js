// ==UserScript==
// @name gm-webext-pref
// @version 0.4.2
// @description A config library powered by webext-pref.
// @license MIT
// @author eight04 <eight04@gmail.com>
// @homepageURL https://github.com/eight04/GM_webextPref
// @supportURL https://github.com/eight04/GM_webextPref/issues
// @namespace eight04.blogspot.com
// @grant GM_getValue
// @grant GM.getValue
// @grant GM_setValue
// @grant GM.setValue
// @grant GM_deleteValue
// @grant GM.deleteValue
// @grant GM_addValueChangeListener
// @grant GM_registerMenuCommand
// @grant GM.registerMenuCommand
// @include *
// ==/UserScript==

var GM_webextPref = (function () {
  'use strict';

  /**
   * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
   *
   * @copyright Yusuke Kawasaki
   * @license MIT
   * @constructor
   * @see https://github.com/kawanet/event-lite
   * @see http://kawanet.github.io/event-lite/EventLite.html
   * @example
   * var EventLite = require("event-lite");
   *
   * function MyClass() {...}             // your class
   *
   * EventLite.mixin(MyClass.prototype);  // import event methods
   *
   * var obj = new MyClass();
   * obj.on("foo", function() {...});     // add event listener
   * obj.once("bar", function() {...});   // add one-time event listener
   * obj.emit("foo");                     // dispatch event
   * obj.emit("bar");                     // dispatch another event
   * obj.off("foo");                      // remove event listener
   */

  function EventLite() {
    if (!(this instanceof EventLite)) return new EventLite();
  }

  const _module_ = {exports: {}};
  (function(EventLite) {
    // export the class for node.js
    if ("undefined" !== typeof _module_) _module_.exports = EventLite;

    // property name to hold listeners
    var LISTENERS = "listeners";

    // methods to export
    var methods = {
      on: on,
      once: once,
      off: off,
      emit: emit
    };

    // mixin to self
    mixin(EventLite.prototype);

    // export mixin function
    EventLite.mixin = mixin;

    /**
     * Import on(), once(), off() and emit() methods into target object.
     *
     * @function EventLite.mixin
     * @param target {Prototype}
     */

    function mixin(target) {
      for (var key in methods) {
        target[key] = methods[key];
      }
      return target;
    }

    /**
     * Add an event listener.
     *
     * @function EventLite.prototype.on
     * @param type {string}
     * @param func {Function}
     * @returns {EventLite} Self for method chaining
     */

    function on(type, func) {
      getListeners(this, type).push(func);
      return this;
    }

    /**
     * Add one-time event listener.
     *
     * @function EventLite.prototype.once
     * @param type {string}
     * @param func {Function}
     * @returns {EventLite} Self for method chaining
     */

    function once(type, func) {
      var that = this;
      wrap.originalListener = func;
      getListeners(that, type).push(wrap);
      return that;

      function wrap() {
        off.call(that, type, wrap);
        func.apply(this, arguments);
      }
    }

    /**
     * Remove an event listener.
     *
     * @function EventLite.prototype.off
     * @param [type] {string}
     * @param [func] {Function}
     * @returns {EventLite} Self for method chaining
     */

    function off(type, func) {
      var that = this;
      var listners;
      if (!arguments.length) {
        delete that[LISTENERS];
      } else if (!func) {
        listners = that[LISTENERS];
        if (listners) {
          delete listners[type];
          if (!Object.keys(listners).length) return off.call(that);
        }
      } else {
        listners = getListeners(that, type, true);
        if (listners) {
          listners = listners.filter(ne);
          if (!listners.length) return off.call(that, type);
          that[LISTENERS][type] = listners;
        }
      }
      return that;

      function ne(test) {
        return test !== func && test.originalListener !== func;
      }
    }

    /**
     * Dispatch (trigger) an event.
     *
     * @function EventLite.prototype.emit
     * @param type {string}
     * @param [value] {*}
     * @returns {boolean} True when a listener received the event
     */

    function emit(type, value) {
      var that = this;
      var listeners = getListeners(that, type, true);
      if (!listeners) return false;
      var arglen = arguments.length;
      if (arglen === 1) {
        listeners.forEach(zeroarg);
      } else if (arglen === 2) {
        listeners.forEach(onearg);
      } else {
        var args = Array.prototype.slice.call(arguments, 1);
        listeners.forEach(moreargs);
      }
      return !!listeners.length;

      function zeroarg(func) {
        func.call(that);
      }

      function onearg(func) {
        func.call(that, value);
      }

      function moreargs(func) {
        func.apply(that, args);
      }
    }

    /**
     * @ignore
     */

    function getListeners(that, type, readonly) {
      if (readonly && !that[LISTENERS]) return;
      var listeners = that[LISTENERS] || (that[LISTENERS] = {});
      return listeners[type] || (listeners[type] = []);
    }

  })(EventLite);
  var EventLite$1 = _module_.exports;

  function createPref(DEFAULT, sep = "/") {
    let storage;
    let currentScope = "global";
    let scopeList = ["global"];
    const events = new EventLite$1;
    const globalCache = {};
    let scopedCache = {};
    let currentCache = Object.assign({}, DEFAULT);
    let initializing;
    
    return Object.assign(events, {
      // storage,
      // ready,
      connect,
      disconnect,
      get,
      getAll,
      set,
      getCurrentScope,
      setCurrentScope,
      addScope,
      deleteScope,
      getScopeList,
      import: import_,
      export: export_,
      has
    });
    
    function import_(input) {
      const newScopeList = input.scopeList || scopeList.slice();
      const scopes = new Set(newScopeList);
      if (!scopes.has("global")) {
        throw new Error("invalid scopeList");
      }
      const changes = {
        scopeList: newScopeList
      };
      for (const [scopeName, scope] of Object.entries(input.scopes)) {
        if (!scopes.has(scopeName)) {
          continue;
        }
        for (const [key, value] of Object.entries(scope)) {
          if (DEFAULT[key] == undefined) {
            continue;
          }
          changes[`${scopeName}${sep}${key}`] = value;
        }
      }
      return storage.setMany(changes);
    }
    
    function export_() {
      const keys = [];
      for (const scope of scopeList) {
        keys.push(...Object.keys(DEFAULT).map(k => `${scope}${sep}${k}`));
      }
      keys.push("scopeList");
      return storage.getMany(keys)
        .then(changes => {
          const _scopeList = changes.scopeList || scopeList.slice();
          const scopes = new Set(_scopeList);
          const output = {
            scopeList: _scopeList,
            scopes: {}
          };
          for (const [key, value] of Object.entries(changes)) {
            const sepIndex = key.indexOf(sep);
            if (sepIndex < 0) {
              continue;
            }
            const scope = key.slice(0, sepIndex);
            const realKey = key.slice(sepIndex + sep.length);
            if (!scopes.has(scope)) {
              continue;
            }
            if (DEFAULT[realKey] == undefined) {
              continue;
            }
            if (!output.scopes[scope]) {
              output.scopes[scope] = {};
            }
            output.scopes[scope][realKey] = value;
          }
          return output;
        });
    }
    
    function connect(_storage) {
      storage = _storage;
      initializing = storage.getMany(
        Object.keys(DEFAULT).map(k => `global${sep}${k}`).concat(["scopeList"])
      )
        .then(updateCache);
      storage.on("change", updateCache);
      return initializing;
    }
    
    function disconnect() {
      storage.off("change", updateCache);
      storage = null;
    }
    
    function updateCache(changes, rebuildCache = false) {
      if (changes.scopeList) {
        scopeList = changes.scopeList;
        events.emit("scopeListChange", scopeList);
        if (!scopeList.includes(currentScope)) {
          return setCurrentScope("global");
        }
      }
      const changedKeys = new Set;
      for (const [key, value] of Object.entries(changes)) {
        const [scope, realKey] = key.startsWith(`global${sep}`) ? ["global", key.slice(6 + sep.length)] :
          key.startsWith(`${currentScope}${sep}`) ? [currentScope, key.slice(currentScope.length + sep.length)] :
            [null, null];
        if (!scope || DEFAULT[realKey] == null) {
          continue;
        }
        if (scope === "global") {
          changedKeys.add(realKey);
          globalCache[realKey] = value;
        }
        if (scope === currentScope) {
          changedKeys.add(realKey);
          scopedCache[realKey] = value;
        }
      }
      if (rebuildCache) {
        Object.keys(DEFAULT).forEach(k => changedKeys.add(k));
      }
      const realChanges = {};
      let isChanged = false;
      for (const key of changedKeys) {
        const value = scopedCache[key] != null ? scopedCache[key] :
          globalCache[key] != null ? globalCache[key] :
          DEFAULT[key];
        if (currentCache[key] !== value) {
          realChanges[key] = value;
          currentCache[key] = value;
          isChanged = true;
        }
      }
      if (isChanged) {
        events.emit("change", realChanges);
      }
    }
    
    function has(key) {
      return currentCache.hasOwnProperty(key);
    }
    
    function get(key) {
      return currentCache[key];
    }
    
    function getAll() {
      return Object.assign({}, currentCache);
    }
    
    function set(key, value) {
      return storage.setMany({
        [`${currentScope}${sep}${key}`]: value
      });
    }
    
    function getCurrentScope() {
      return currentScope;
    }
    
    function setCurrentScope(newScope) {
      if (currentScope === newScope) {
        return Promise.resolve(true);
      }
      if (!scopeList.includes(newScope)) {
        return Promise.resolve(false);
      }
      return storage.getMany(Object.keys(DEFAULT).map(k => `${newScope}${sep}${k}`))
        .then(changes => {
          currentScope = newScope;
          scopedCache = {};
          events.emit("scopeChange", currentScope);
          updateCache(changes, true);
          return true;
        });
    }
    
    function addScope(scope) {
      if (scopeList.includes(scope)) {
        return Promise.reject(new Error(`${scope} already exists`));
      }
      if (scope.includes(sep)) {
        return Promise.reject(new Error(`invalid word: ${sep}`));
      }
      return storage.setMany({
        scopeList: scopeList.concat([scope])
      });
    }
    
    function deleteScope(scope) {
      if (scope === "global") {
        return Promise.reject(new Error(`cannot delete global`));
      }
      return Promise.all([
        storage.setMany({
          scopeList: scopeList.filter(s => s != scope)
        }),
        storage.deleteMany(Object.keys(DEFAULT).map(k => `${scope}${sep}${k}`))
      ]);
    }
    
    function getScopeList() {
      return scopeList;
    }
  }

  const keys = Object.keys;
  function isBoolean(val) {
    return typeof val === "boolean"
  }
  function isElement(val) {
    return val && typeof val.nodeType === "number"
  }
  function isString(val) {
    return typeof val === "string"
  }
  function isNumber(val) {
    return typeof val === "number"
  }
  function isObject(val) {
    return typeof val === "object" ? val !== null : isFunction(val)
  }
  function isFunction(val) {
    return typeof val === "function"
  }
  function isArrayLike(obj) {
    return isObject(obj) && typeof obj.length === "number" && typeof obj.nodeType !== "number"
  }
  function forEach(value, fn) {
    if (!value) return

    for (const key of keys(value)) {
      fn(value[key], key);
    }
  }
  function isRef(maybeRef) {
    return isObject(maybeRef) && "current" in maybeRef
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {}
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue
      target[key] = source[key];
    }

    return target
  }

  const isUnitlessNumber = {
    animationIterationCount: 0,
    borderImageOutset: 0,
    borderImageSlice: 0,
    borderImageWidth: 0,
    boxFlex: 0,
    boxFlexGroup: 0,
    boxOrdinalGroup: 0,
    columnCount: 0,
    columns: 0,
    flex: 0,
    flexGrow: 0,
    flexPositive: 0,
    flexShrink: 0,
    flexNegative: 0,
    flexOrder: 0,
    gridArea: 0,
    gridRow: 0,
    gridRowEnd: 0,
    gridRowSpan: 0,
    gridRowStart: 0,
    gridColumn: 0,
    gridColumnEnd: 0,
    gridColumnSpan: 0,
    gridColumnStart: 0,
    fontWeight: 0,
    lineClamp: 0,
    lineHeight: 0,
    opacity: 0,
    order: 0,
    orphans: 0,
    tabSize: 0,
    widows: 0,
    zIndex: 0,
    zoom: 0,
    fillOpacity: 0,
    floodOpacity: 0,
    stopOpacity: 0,
    strokeDasharray: 0,
    strokeDashoffset: 0,
    strokeMiterlimit: 0,
    strokeOpacity: 0,
    strokeWidth: 0,
  };

  function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1)
  }

  const prefixes = ["Webkit", "ms", "Moz", "O"];
  keys(isUnitlessNumber).forEach((prop) => {
    prefixes.forEach((prefix) => {
      isUnitlessNumber[prefixKey(prefix, prop)] = 0;
    });
  });

  const SVGNamespace = "http://www.w3.org/2000/svg";
  const XLinkNamespace = "http://www.w3.org/1999/xlink";
  const XMLNamespace = "http://www.w3.org/XML/1998/namespace";

  function isVisibleChild(value) {
    return !isBoolean(value) && value != null
  }

  function className(value) {
    if (Array.isArray(value)) {
      return value.map(className).filter(Boolean).join(" ")
    } else if (isObject(value)) {
      return keys(value)
        .filter((k) => value[k])
        .join(" ")
    } else if (isVisibleChild(value)) {
      return "" + value
    } else {
      return ""
    }
  }
  const svg = {
    animate: 0,
    circle: 0,
    clipPath: 0,
    defs: 0,
    desc: 0,
    ellipse: 0,
    feBlend: 0,
    feColorMatrix: 0,
    feComponentTransfer: 0,
    feComposite: 0,
    feConvolveMatrix: 0,
    feDiffuseLighting: 0,
    feDisplacementMap: 0,
    feDistantLight: 0,
    feFlood: 0,
    feFuncA: 0,
    feFuncB: 0,
    feFuncG: 0,
    feFuncR: 0,
    feGaussianBlur: 0,
    feImage: 0,
    feMerge: 0,
    feMergeNode: 0,
    feMorphology: 0,
    feOffset: 0,
    fePointLight: 0,
    feSpecularLighting: 0,
    feSpotLight: 0,
    feTile: 0,
    feTurbulence: 0,
    filter: 0,
    foreignObject: 0,
    g: 0,
    image: 0,
    line: 0,
    linearGradient: 0,
    marker: 0,
    mask: 0,
    metadata: 0,
    path: 0,
    pattern: 0,
    polygon: 0,
    polyline: 0,
    radialGradient: 0,
    rect: 0,
    stop: 0,
    svg: 0,
    switch: 0,
    symbol: 0,
    text: 0,
    textPath: 0,
    tspan: 0,
    use: 0,
    view: 0,
  };
  function createElement(tag, attr, ...children) {
    if (isString(attr) || Array.isArray(attr)) {
      children.unshift(attr);
      attr = {};
    }

    attr = attr || {};

    if (!attr.namespaceURI && svg[tag] === 0) {
      attr = Object.assign({}, attr, {
        namespaceURI: SVGNamespace,
      });
    }

    if (attr.children != null && !children.length) {
      var _attr = attr
      ;({ children } = _attr);
      attr = _objectWithoutPropertiesLoose(_attr, ["children"]);
    }

    let node;

    if (isString(tag)) {
      node = attr.namespaceURI
        ? document.createElementNS(attr.namespaceURI, tag)
        : document.createElement(tag);
      attributes(attr, node);
      appendChild(children, node);
    } else if (isFunction(tag)) {
      if (isObject(tag.defaultProps)) {
        attr = Object.assign({}, tag.defaultProps, attr);
      }

      node = tag(
        Object.assign({}, attr, {
          children,
        })
      );
    }

    if (isRef(attr.ref)) {
      attr.ref.current = node;
    } else if (isFunction(attr.ref)) {
      attr.ref(node);
    }

    return node
  }

  function appendChild(child, node) {
    if (isArrayLike(child)) {
      appendChildren(child, node);
    } else if (isString(child) || isNumber(child)) {
      appendChildToNode(document.createTextNode(child), node);
    } else if (child === null) {
      appendChildToNode(document.createComment(""), node);
    } else if (isElement(child)) {
      appendChildToNode(child, node);
    }
  }

  function appendChildren(children, node) {
    for (const child of children) {
      appendChild(child, node);
    }

    return node
  }

  function appendChildToNode(child, node) {
    if (node instanceof window.HTMLTemplateElement) {
      node.content.appendChild(child);
    } else {
      node.appendChild(child);
    }
  }

  function normalizeAttribute(s) {
    return s.replace(/[A-Z\d]/g, (match) => ":" + match.toLowerCase())
  }

  function attribute(key, value, node) {
    switch (key) {
      case "xlinkActuate":
      case "xlinkArcrole":
      case "xlinkHref":
      case "xlinkRole":
      case "xlinkShow":
      case "xlinkTitle":
      case "xlinkType":
        attrNS(node, XLinkNamespace, normalizeAttribute(key), value);
        return

      case "xmlnsXlink":
        attr(node, normalizeAttribute(key), value);
        return

      case "xmlBase":
      case "xmlLang":
      case "xmlSpace":
        attrNS(node, XMLNamespace, normalizeAttribute(key), value);
        return
    }

    switch (key) {
      case "htmlFor":
        attr(node, "for", value);
        return

      case "dataset":
        forEach(value, (dataValue, dataKey) => {
          if (dataValue != null) {
            node.dataset[dataKey] = dataValue;
          }
        });
        return

      case "innerHTML":
      case "innerText":
      case "textContent":
        node[key] = value;
        return

      case "spellCheck":
        node.spellcheck = value;
        return

      case "class":
      case "className":
        if (isFunction(value)) {
          value(node);
        } else {
          attr(node, "class", className(value));
        }

        return

      case "ref":
      case "namespaceURI":
        return

      case "style":
        if (isObject(value)) {
          forEach(value, (val, key) => {
            if (isNumber(val) && isUnitlessNumber[key] !== 0) {
              node.style[key] = val + "px";
            } else {
              node.style[key] = val;
            }
          });
          return
        }
    }

    if (isFunction(value)) {
      if (key[0] === "o" && key[1] === "n") {
        node[key.toLowerCase()] = value;
      }
    } else if (value === true) {
      attr(node, key, "");
    } else if (value !== false && value != null) {
      attr(node, key, value);
    }
  }

  function attr(node, key, value) {
    node.setAttribute(key, value);
  }

  function attrNS(node, namespace, key, value) {
    node.setAttributeNS(namespace, key, value);
  }

  function attributes(attr, node) {
    for (const key of keys(attr)) {
      attribute(key, attr[key], node);
    }

    return node
  }

  function messageGetter({
    getMessage,
    DEFAULT
  }) {
    return (key, params) => {
      const message = getMessage(key, params);
      if (message) return message;
      const defaultMessage = DEFAULT[key];
      if (!defaultMessage) return "";
      if (!params) return defaultMessage;

      if (!Array.isArray(params)) {
        params = [params];
      }

      return defaultMessage.replace(/\$(\d+)/g, (m, n) => params[n - 1]);
    };
  }

  function fallback(getMessage) {
    return messageGetter({
      getMessage,
      DEFAULT: {
        currentScopeLabel: "Current scope",
        addScopeLabel: "Add new scope",
        deleteScopeLabel: "Delete current scope",
        learnMoreButton: "Learn more",
        importButton: "Import",
        exportButton: "Export",
        addScopePrompt: "Add new scope",
        deleteScopeConfirm: "Delete scope $1?",
        importPrompt: "Paste settings",
        exportPrompt: "Copy settings"
      }
    });
  }

  const VALID_CONTROL = new Set(["import", "export", "scope-list", "add-scope", "delete-scope"]);

  class DefaultMap extends Map {
    constructor(getDefault) {
      super();
      this.getDefault = getDefault;
    }

    get(key) {
      let item = super.get(key);

      if (!item) {
        item = this.getDefault();
        super.set(key, item);
      }

      return item;
    }

  }

  function bindInputs(pref, inputs) {
    const bounds = [];

    const onPrefChange = change => {
      for (const key in change) {
        if (!inputs.has(key)) {
          continue;
        }

        for (const input of inputs.get(key)) {
          updateInput(input, change[key]);
        }
      }
    };

    pref.on("change", onPrefChange);
    bounds.push(() => pref.off("change", onPrefChange));

    for (const [key, list] of inputs.entries()) {
      for (const input of list) {
        const evt = input.hasAttribute("realtime") ? "input" : "change";

        const onChange = () => updatePref(key, input);

        input.addEventListener(evt, onChange);
        bounds.push(() => input.removeEventListener(evt, onChange));
      }
    }

    onPrefChange(pref.getAll());
    return () => {
      for (const unbind of bounds) {
        unbind();
      }
    };

    function updatePref(key, input) {
      if (!input.checkValidity()) {
        return;
      }

      if (input.type === "checkbox") {
        pref.set(key, input.checked);
        return;
      }

      if (input.type === "radio") {
        if (input.checked) {
          pref.set(key, input.value);
        }

        return;
      }

      if (input.nodeName === "SELECT" && input.multiple) {
        pref.set(key, [...input.options].filter(o => o.selected).map(o => o.value));
        return;
      }

      if (input.type === "number" || input.type === "range") {
        pref.set(key, Number(input.value));
        return;
      }

      pref.set(key, input.value);
    }

    function updateInput(input, value) {
      if (input.nodeName === "INPUT" && input.type === "radio") {
        input.checked = input.value === value;
        return;
      }

      if (input.type === "checkbox") {
        input.checked = value;
        return;
      }

      if (input.nodeName === "SELECT" && input.multiple) {
        const checked = new Set(value);

        for (const option of input.options) {
          option.selected = checked.has(option.value);
        }

        return;
      }

      input.value = value;
    }
  }

  function bindFields(pref, fields) {
    const onPrefChange = change => {
      for (const key in change) {
        if (!fields.has(key)) {
          continue;
        }

        for (const field of fields.get(key)) {
          field.disabled = field.dataset.bindToValue ? field.dataset.bindToValue !== change[key] : !change[key];
        }
      }
    };

    pref.on("change", onPrefChange);
    onPrefChange(pref.getAll());
    return () => pref.off("change", onPrefChange);
  }

  function bindControls({
    pref,
    controls,
    alert: _alert = alert,
    confirm: _confirm = confirm,
    prompt: _prompt = prompt,
    getMessage = () => {},
    getNewScope = () => ""
  }) {
    const CONTROL_METHODS = {
      "import": ["click", doImport],
      "export": ["click", doExport],
      "scope-list": ["change", updateCurrentScope],
      "add-scope": ["click", addScope],
      "delete-scope": ["click", deleteScope]
    };

    for (const type in CONTROL_METHODS) {
      for (const el of controls.get(type)) {
        el.addEventListener(CONTROL_METHODS[type][0], CONTROL_METHODS[type][1]);
      }
    }

    pref.on("scopeChange", updateCurrentScopeEl);
    pref.on("scopeListChange", updateScopeList);
    updateScopeList();
    updateCurrentScopeEl();

    const _ = fallback(getMessage);

    return unbind;

    function unbind() {
      pref.off("scopeChange", updateCurrentScopeEl);
      pref.off("scopeListChange", updateScopeList);

      for (const type in CONTROL_METHODS) {
        for (const el of controls.get(type)) {
          el.removeEventListener(CONTROL_METHODS[type][0], CONTROL_METHODS[type][1]);
        }
      }
    }

    async function doImport() {
      try {
        const input = await _prompt(_("importPrompt"));

        if (input == null) {
          return;
        }

        const settings = JSON.parse(input);
        return pref.import(settings);
      } catch (err) {
        await _alert(err.message);
      }
    }

    async function doExport() {
      try {
        const settings = await pref.export();
        await _prompt(_("exportPrompt"), JSON.stringify(settings));
      } catch (err) {
        await _alert(err.message);
      }
    }

    function updateCurrentScope(e) {
      pref.setCurrentScope(e.target.value);
    }

    async function addScope() {
      try {
        let scopeName = await _prompt(_("addScopePrompt"), getNewScope());

        if (scopeName == null) {
          return;
        }

        scopeName = scopeName.trim();

        if (!scopeName) {
          throw new Error("the value is empty");
        }

        await pref.addScope(scopeName);
        pref.setCurrentScope(scopeName);
      } catch (err) {
        await _alert(err.message);
      }
    }

    async function deleteScope() {
      try {
        const scopeName = pref.getCurrentScope();
        const result = await _confirm(_("deleteScopeConfirm", scopeName));

        if (result) {
          return pref.deleteScope(scopeName);
        }
      } catch (err) {
        await _alert(err.message);
      }
    }

    function updateCurrentScopeEl() {
      const scopeName = pref.getCurrentScope();

      for (const el of controls.get("scope-list")) {
        el.value = scopeName;
      }
    }

    function updateScopeList() {
      const scopeList = pref.getScopeList();

      for (const el of controls.get("scope-list")) {
        el.innerHTML = "";
        el.append(...scopeList.map(scope => {
          const option = document.createElement("option");
          option.value = scope;
          option.textContent = scope;
          return option;
        }));
      }
    }
  }

  function createBinding({
    pref,
    root,
    elements = root.querySelectorAll("input, textarea, select, fieldset, button"),
    keyPrefix = "pref-",
    controlPrefix = "webext-pref-",
    alert,
    confirm,
    prompt,
    getMessage,
    getNewScope
  }) {
    const inputs = new DefaultMap(() => []);
    const fields = new DefaultMap(() => []);
    const controls = new DefaultMap(() => []);

    for (const element of elements) {
      const id = element.id && stripPrefix(element.id, keyPrefix);

      if (id && pref.has(id)) {
        inputs.get(id).push(element);
        continue;
      }

      if (element.nodeName === "INPUT" && element.type === "radio") {
        const name = element.name && stripPrefix(element.name, keyPrefix);

        if (name && pref.has(name)) {
          inputs.get(name).push(element);
          continue;
        }
      }

      if (element.nodeName === "FIELDSET" && element.dataset.bindTo) {
        fields.get(element.dataset.bindTo).push(element);
        continue;
      }

      const controlType = findControlType(element.classList);

      if (controlType) {
        controls.get(controlType).push(element);
      }
    }

    const bounds = [bindInputs(pref, inputs), bindFields(pref, fields), bindControls({
      pref,
      controls,
      alert,
      confirm,
      prompt,
      getMessage,
      getNewScope
    })];
    return () => {
      for (const unbind of bounds) {
        unbind();
      }
    };

    function stripPrefix(id, prefix) {
      if (!prefix) {
        return id;
      }

      return id.startsWith(prefix) ? id.slice(prefix.length) : "";
    }

    function findControlType(list) {
      for (const name of list) {
        const controlType = stripPrefix(name, controlPrefix);

        if (VALID_CONTROL.has(controlType)) {
          return controlType;
        }
      }
    }
  }

  function createUI({
    body,
    getMessage = () => {},
    toolbar = true,
    navbar = true,
    keyPrefix = "pref-",
    controlPrefix = "webext-pref-"
  }) {
    const root = document.createDocumentFragment();

    const _ = fallback(getMessage);

    if (toolbar) {
      root.append(createToolbar());
    }

    if (navbar) {
      root.append(createNavbar());
    }

    root.append( /*#__PURE__*/createElement("div", {
      class: controlPrefix + "body"
    }, body.map(item => {
      if (!item.hLevel) {
        item.hLevel = 3;
      }

      return createItem(item);
    })));
    return root;

    function createToolbar() {
      return /*#__PURE__*/createElement("div", {
        class: controlPrefix + "toolbar"
      }, /*#__PURE__*/createElement("button", {
        type: "button",
        class: [controlPrefix + "import", "browser-style"]
      }, _("importButton")), /*#__PURE__*/createElement("button", {
        type: "button",
        class: [controlPrefix + "export", "browser-style"]
      }, _("exportButton")));
    }

    function createNavbar() {
      return /*#__PURE__*/createElement("div", {
        class: controlPrefix + "nav"
      }, /*#__PURE__*/createElement("select", {
        class: [controlPrefix + "scope-list", "browser-style"],
        title: _("currentScopeLabel")
      }), /*#__PURE__*/createElement("button", {
        type: "button",
        class: [controlPrefix + "delete-scope", "browser-style"],
        title: _("deleteScopeLabel")
      }, "\xD7"), /*#__PURE__*/createElement("button", {
        type: "button",
        class: [controlPrefix + "add-scope", "browser-style"],
        title: _("addScopeLabel")
      }, "+"));
    }

    function createItem(p) {
      if (p.type === "section") {
        return createSection(p);
      }

      if (p.type === "checkbox") {
        return createCheckbox(p);
      }

      if (p.type === "radiogroup") {
        return createRadioGroup(p);
      }

      return createInput(p);
    }

    function createInput(p) {
      const key = keyPrefix + p.key;
      let input;
      const onChange = p.validate ? e => {
        try {
          p.validate(e.target.value);
          e.target.setCustomValidity("");
        } catch (err) {
          e.target.setCustomValidity(err.message || String(err));
        }
      } : null;

      if (p.type === "select") {
        input = /*#__PURE__*/createElement("select", {
          multiple: p.multiple,
          class: "browser-style",
          id: key,
          onChange: onChange
        }, Object.entries(p.options).map(([value, label]) => /*#__PURE__*/createElement("option", {
          value: value
        }, label)));
      } else if (p.type === "textarea") {
        input = /*#__PURE__*/createElement("textarea", {
          rows: "8",
          class: "browser-style",
          id: key,
          onChange: onChange
        });
      } else {
        input = /*#__PURE__*/createElement("input", {
          type: p.type,
          id: key,
          onChange: onChange
        });
      }

      return /*#__PURE__*/createElement("div", {
        class: [`${controlPrefix}${p.type}`, "browser-style", p.className]
      }, /*#__PURE__*/createElement("label", {
        htmlFor: key
      }, p.label), p.learnMore && /*#__PURE__*/createElement(LearnMore, {
        url: p.learnMore
      }), input, p.help && /*#__PURE__*/createElement(Help, {
        content: p.help
      }));
    }

    function createRadioGroup(p) {
      return /*#__PURE__*/createElement("div", {
        class: [`${controlPrefix}${p.type}`, "browser-style", p.className]
      }, /*#__PURE__*/createElement("div", {
        class: controlPrefix + "radio-title"
      }, p.label), p.learnMore && /*#__PURE__*/createElement(LearnMore, {
        url: p.learnMore
      }), p.help && /*#__PURE__*/createElement(Help, {
        content: p.help
      }), p.children.map(c => {
        c.parentKey = p.key;
        return createCheckbox(inheritProp(p, c));
      }));
    }

    function Help({
      content
    }) {
      return /*#__PURE__*/createElement("p", {
        class: controlPrefix + "help"
      }, content);
    }

    function LearnMore({
      url
    }) {
      return /*#__PURE__*/createElement("a", {
        href: url,
        class: controlPrefix + "learn-more",
        target: "_blank",
        rel: "noopener noreferrer"
      }, _("learnMoreButton"));
    }

    function createCheckbox(p) {
      const id = p.parentKey ? `${keyPrefix}${p.parentKey}-${p.value}` : keyPrefix + p.key;
      return /*#__PURE__*/createElement("div", {
        class: [`${controlPrefix}${p.type}`, "browser-style", p.className]
      }, /*#__PURE__*/createElement("input", {
        type: p.type,
        id: id,
        name: p.parentKey ? keyPrefix + p.parentKey : null,
        value: p.value
      }), /*#__PURE__*/createElement("label", {
        htmlFor: id
      }, p.label), p.learnMore && /*#__PURE__*/createElement(LearnMore, {
        url: p.learnMore
      }), p.help && /*#__PURE__*/createElement(Help, {
        content: p.help
      }), p.children && /*#__PURE__*/createElement("fieldset", {
        class: controlPrefix + "checkbox-children",
        dataset: {
          bindTo: p.parentKey || p.key,
          bindToValue: p.value
        }
      }, p.children.map(c => createItem(inheritProp(p, c)))));
    }

    function createSection(p) {
      const Header = `h${p.hLevel}`;
      p.hLevel++;
      return (
        /*#__PURE__*/
        // FIXME: do we need browser-style for section?
        createElement("div", {
          class: [controlPrefix + p.type, p.className]
        }, /*#__PURE__*/createElement(Header, {
          class: controlPrefix + "header"
        }, p.label), p.help && /*#__PURE__*/createElement(Help, {
          content: p.help
        }), p.children && p.children.map(c => createItem(inheritProp(p, c))))
      );
    }

    function inheritProp(parent, child) {
      child.hLevel = parent.hLevel;
      return child;
    }
  }

  /* eslint-env greasemonkey */

  function createGMStorage() {
    const setValue = typeof GM_setValue === "function" ?
      promisify(GM_setValue) : GM.setValue.bind(GM);
    const getValue = typeof GM_getValue === "function" ?
      promisify(GM_getValue) : GM.getValue.bind(GM);
    const deleteValue = typeof GM_deleteValue === "function" ?
      promisify(GM_deleteValue) : GM.deleteValue.bind(GM);
    const events = new EventLite$1;
    
    if (typeof GM_addValueChangeListener === "function") {
      GM_addValueChangeListener("webext-pref-message", (name, oldValue, newValue) => {
        const changes = JSON.parse(newValue);
        for (const key of Object.keys(changes)) {
          if (typeof changes[key] === "object" && changes[key].$undefined) {
            changes[key] = undefined;
          }
        }
        events.emit("change", changes);
      });
    }
    
    return Object.assign(events, {getMany, setMany, deleteMany});
    
    function getMany(keys) {
      return Promise.all(keys.map(k => 
        getValue(`webext-pref/${k}`)
          .then(value => [k, typeof value === "string" ? JSON.parse(value) : value])
      ))
        .then(entries => {
          const output = {};
          for (const [key, value] of entries) {
            output[key] = value;
          }
          return output;
        });
    }
    
    function setMany(changes) {
      return Promise.all(Object.entries(changes).map(([key, value]) => 
        setValue(`webext-pref/${key}`, JSON.stringify(value))
      ))
        .then(() => {
          if (typeof GM_addValueChangeListener === "function") {
            return setValue("webext-pref-message", JSON.stringify(changes));
          }
          events.emit("change", changes);
        });
    }
    
    function deleteMany(keys) {
      return Promise.all(keys.map(k => deleteValue(`webext-pref/${k}`)))
        .then(() => {
          if (typeof GM_addValueChangeListener === "function") {
            const changes = {};
            for (const key of keys) {
              changes[key] = {
                $undefined: true
              };
            }
            return setValue("webext-pref-message", JSON.stringify(changes));
          }
          const changes = {};
          for (const key of keys) {
            changes[key] = undefined;
          }
          events.emit("change", changes);
        });
    }
    
    function promisify(fn) {
      return (...args) => {
        try {
          return Promise.resolve(fn(...args));
        } catch (err) {
          return Promise.reject(err);
        }
      };
    }
  }

  /* eslint-env greasemonkey */

  function GM_webextPref({
    default: default_,
    separator,
    css = "",
    ...options
  }) {
    const pref = createPref(default_, separator);
    const initializing = pref.connect(createGMStorage());
    let isOpen = false;
    
    const registerMenu = 
      typeof GM_registerMenuCommand === "function" ? GM_registerMenuCommand :
      typeof GM !== "undefined" && GM && GM.registerMenuCommand ? GM.registerMenuCommand.bind(GM) :
      undefined;
      
    if (registerMenu) {
      registerMenu(`${getTitle()} - Configure`, openDialog);
    }
    
    return Object.assign(pref, {
      ready: () => initializing,
      openDialog
    });
    
    function openDialog() {
      if (isOpen) {
        return;
      }
      isOpen = true;
      
      let destroyView;
      
      const modal = document.createElement("div");
      modal.className = "webext-pref-modal";
      modal.onclick = () => {
        modal.classList.remove("webext-pref-modal-open");
        modal.addEventListener("transitionend", () => {
          if (destroyView) {
            destroyView();
          }
          modal.remove();
          isOpen = false;
        });
      };
      
      const style = document.createElement("style");
      style.textContent = "body{overflow:hidden}.webext-pref-modal{position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.5);overflow:auto;z-index:999999;opacity:0;transition:opacity .2s linear;display:flex}.webext-pref-modal-open{opacity:1}.webext-pref-modal::after,.webext-pref-modal::before{content:\"\";display:block;height:30px;visibility:hidden}.webext-pref-iframe-wrap{margin:auto}.webext-pref-iframe{margin:30px 0;display:inline-block;width:100%;max-width:100%;background:#fff;border-width:0;box-shadow:0 0 30px #000;transform:translateY(-20px);transition:transform .2s linear}.webext-pref-modal-open .webext-pref-iframe{transform:none}" + `
      body {
        padding-right: ${window.innerWidth - document.documentElement.offsetWidth}px;
      }
    `;
      
      const iframe = document.createElement("iframe");
      iframe.className = "webext-pref-iframe";
      iframe.srcdoc = `
      <html>
        <head>
          <style class="dialog-style"></style>
        </head>
        <body>
          <div class="dialog-body"></div>
        </body>
      </html>
    `;
      
      const wrap = document.createElement("div");
      wrap.className = "webext-pref-iframe-wrap";
      
      wrap.append(iframe);
      modal.append(style, wrap);
      document.body.appendChild(modal);
      
      iframe.onload = () => {
        iframe.onload = null;
        
        iframe.contentDocument.querySelector(".dialog-style").textContent = "body{display:inline-block;font-size:16px;font-family:sans-serif;white-space:nowrap;overflow:hidden;margin:0;color:#3d3d3d;line-height:1}input[type=number],input[type=text],select,textarea{display:block;width:100%;box-sizing:border-box;height:2em;font:inherit;padding:0 .3em;border:1px solid #9e9e9e;cursor:pointer}select[multiple],textarea{height:6em}input[type=number]:hover,input[type=text]:hover,select:hover,textarea:hover{border-color:#d5d5d5}input[type=number]:focus,input[type=text]:focus,select:focus,textarea:focus{cursor:auto;border-color:#3a93ee}textarea{line-height:1.5}input[type=checkbox],input[type=radio]{display:inline-block;width:1em;height:1em;font:inherit;margin:0}button{box-sizing:border-box;height:2em;font:inherit;border:1px solid #9e9e9e;cursor:pointer;background:0 0}button:hover{border-color:#d5d5d5}button:focus{border-color:#3a93ee}.dialog-body{margin:2em}.webext-pref-toolbar{display:flex;align-items:center;margin-bottom:1em}.dialog-title{font-size:1.34em;margin:0 2em 0 0;flex-grow:1}.webext-pref-toolbar button{font-size:.7em;margin-left:.5em}.webext-pref-nav{display:flex;margin-bottom:1em}.webext-pref-nav select{text-align:center;text-align-last:center}.webext-pref-nav button{width:2em}.webext-pref-number,.webext-pref-radiogroup,.webext-pref-select,.webext-pref-text,.webext-pref-textarea{margin:1em 0}.webext-pref-body>:first-child{margin-top:0}.webext-pref-body>:last-child{margin-bottom:0}.webext-pref-number>input,.webext-pref-select>select,.webext-pref-text>input,.webext-pref-textarea>textarea{margin:.3em 0}.webext-pref-checkbox,.webext-pref-radio{margin:.5em 0;padding-left:1.5em}.webext-pref-checkbox>input,.webext-pref-radio>input{margin-left:-1.5em;margin-right:.5em;vertical-align:middle}.webext-pref-checkbox>label,.webext-pref-radio>label{cursor:pointer;vertical-align:middle}.webext-pref-checkbox>label:hover,.webext-pref-radio>label:hover{color:#707070}.webext-pref-checkbox-children,.webext-pref-radio-children{margin:.7em 0 0;padding:0;border-width:0}.webext-pref-checkbox-children[disabled],.webext-pref-radio-children[disabled]{opacity:.5}.webext-pref-checkbox-children>:first-child,.webext-pref-radio-children>:first-child{margin-top:0}.webext-pref-checkbox-children>:last-child,.webext-pref-radio-children>:last-child{margin-bottom:0}.webext-pref-checkbox-children>:last-child>:last-child,.webext-pref-radio-children>:last-child>:last-child{margin-bottom:0}.webext-pref-help{color:#969696}.responsive{white-space:normal}.responsive .dialog-body{margin:1em}.responsive .webext-pref-toolbar{display:block}.responsive .dialog-title{margin:0 0 1em 0}.responsive .webext-pref-toolbar button{font-size:1em}.responsive .webext-pref-nav{display:block}" + css;
        
        const root = iframe.contentDocument.querySelector(".dialog-body");
        root.append(createUI(options));
        
        destroyView = createBinding({
          pref,
          root,
          ...options
        });
        
        const title = document.createElement("h2");
        title.className = "dialog-title";
        title.textContent = getTitle();
        iframe.contentDocument.querySelector(".webext-pref-toolbar").prepend(title);
        
        if (iframe.contentDocument.body.offsetWidth > modal.offsetWidth) {
          iframe.contentDocument.body.classList.add("responsive");
        }
        
        // calc iframe size
        iframe.style = `
        width: ${iframe.contentDocument.body.offsetWidth}px;
        height: ${iframe.contentDocument.body.scrollHeight}px;
      `;
        
        modal.classList.add("webext-pref-modal-open");
      };
    }
    
    function getTitle() {
      return typeof GM_info === "object" ?
        GM_info.script.name : GM.info.script.name;
    }
  }

  return GM_webextPref;

}());

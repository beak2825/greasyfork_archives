// ==UserScript==
// @name         BetterBlacket
// @description  the best client mod for blacket.
// @version      3.0.8.5
// @icon         https://blacket.org/content/logo.png

// @author       Death / VillainsRule
// @namespace    https://bb.villainsrule.xyz

// @match        *://blacket.org/*
// @match        *://blacket.xotic.org/*
// @match        *://blacket.monkxy.com/*
// @match        *://dashboard.iblooket.com/*
// @match        *://b.blooketis.life/*
// @match        *://b.fart.services/*

// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538353/BetterBlacket.user.js
// @updateURL https://update.greasyfork.org/scripts/538353/BetterBlacket.meta.js
// ==/UserScript==

/* eslint-disable */

var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var _subscriptions;
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const { iterator, toStringTag } = Symbol;
const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
const typeOfTest = (type) => (thing) => typeof thing === type;
const { isArray } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString = typeOfTest("string");
const isFunction = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject(val) && isFunction(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({ source, data }) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);
    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === "function",
  isFunction(_global.postMessage)
);
const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
const isIterable = (thing) => thing != null && isFunction(thing[iterator]);
const utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};
function AxiosError$1(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
utils$1.inherits(AxiosError$1, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const prototype$1 = AxiosError$1.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError$1, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError$1.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils$1.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError$1.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
const httpAdapter = null;
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}
function removeBrackets(key) {
  return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData$1(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new FormData();
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils$1.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
  if (!utils$1.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils$1.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
    }
    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils$1.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index2) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index2, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils$1.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils$1.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils$1.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$1(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData$1(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode;
  if (utils$1.isFunction(options)) {
    options = {
      serialize: options
    };
  }
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id2) {
    if (this.handlers[id2]) {
      this.handlers[id2] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
const platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
const _navigator = typeof navigator === "object" && navigator || void 0;
const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
const hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const origin = hasBrowserEnv && window.location.href || "http://localhost";
const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, hasBrowserEnv, hasStandardBrowserEnv, hasStandardBrowserWebWorkerEnv, navigator: _navigator, origin }, Symbol.toStringTag, { value: "Module" }));
const platform = {
  ...utils,
  ...platform$1
};
function toURLEncodedForm(data, options) {
  return toFormData$1(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}
function parsePropPath(name) {
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index2) {
    let name = path[index2++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index2 >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index2);
    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};
    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils$1.isObject(data);
    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils$1.isFormData(data);
    if (isFormData2) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData$1(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }
    if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
const ignoreDuplicateOf = utils$1.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens2 = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens2[match[1]] = match[2];
  }
  return tokens2;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils$1.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils$1.isString(value)) return;
  if (utils$1.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils$1.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
let AxiosHeaders$1 = class AxiosHeaders2 {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils$1.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils$1.isArray(entry)) {
          throw TypeError("Object iterator must return a key-value pair");
        }
        obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
      }
      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$1.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$1.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils$1.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils$1.freezeMethods(AxiosHeaders$1);
function transformData(fns, response) {
  const config = this || defaults;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel$1(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError$1(message, config, request) {
  AxiosError$1.call(this, message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils$1.inherits(CanceledError$1, AxiosError$1, {
  __CANCEL__: true
});
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError$1(
      "Request failed with status code " + response.status,
      [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args2, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args2);
  };
  const throttled = (...args2) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args2, now);
    } else {
      lastArgs = args2;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return throttle((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data);
  }, freq);
};
const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};
const asyncDecorator = (fn) => (...args2) => utils$1.asap(() => fn(...args2));
const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
  url = new URL(url, platform.origin);
  return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;
const cookies = platform.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + "=" + encodeURIComponent(value)];
      utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
      utils$1.isString(path) && cookie.push("path=" + path);
      utils$1.isString(domain) && cookie.push("domain=" + domain);
      secure === true && cookie.push("secure");
      document.cookie = cookie.join("; ");
    },
    read(name) {
      const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
function mergeConfig$1(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({ caseless }, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(void 0, a, prop, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
const resolveConfig = (config) => {
  const newConfig = mergeConfig$1({}, config);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders$1.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
    );
  }
  let contentType;
  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if ((contentType = headers.getContentType()) !== false) {
      const [type, ...tokens2] = contentType ? contentType.split(";").map((token) => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || "multipart/form-data", ...tokens2].join("; "));
    }
  }
  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let { responseType, onUploadProgress, onDownloadProgress } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload();
      flushDownload && flushDownload();
      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener("abort", onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError$1(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
      request.addEventListener("progress", downloadThrottled);
    }
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
      request.upload.addEventListener("progress", uploadThrottled);
      request.upload.addEventListener("loadend", flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};
const composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils$1.asap(unsubscribe);
    return signal;
  }
};
const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader = stream.getReader();
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator2 = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done: done2, value } = await iterator2.next();
        if (done2) {
          _onFinish();
          controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator2.return();
    }
  }, {
    highWaterMark: 2
  });
};
const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
const test = (fn, ...args2) => {
  try {
    return !!fn(...args2);
  } catch (e) {
    return false;
  }
};
const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;
  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      duplexAccessed = true;
      return "half";
    }
  }).headers.has("Content-Type");
  return duplexAccessed && !hasContentType;
});
const DEFAULT_CHUNK_SIZE = 64 * 1024;
const supportsResponseStream = isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};
isFetchSupported && ((res) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res2) => res2[type]() : (_, config) => {
      throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
    });
  });
})(new Response());
const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }
  if (utils$1.isBlob(body)) {
    return body.size;
  }
  if (utils$1.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: "POST",
      body
    });
    return (await _request.arrayBuffer()).byteLength;
  }
  if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
    return body.byteLength;
  }
  if (utils$1.isURLSearchParams(body)) {
    body = body + "";
  }
  if (utils$1.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};
const resolveBodyLength = async (headers, body) => {
  const length = utils$1.toFiniteNumber(headers.getContentLength());
  return length == null ? getBodyLength(body) : length;
};
const fetchAdapter = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = "same-origin",
    fetchOptions
  } = resolveConfig(config);
  responseType = responseType ? (responseType + "").toLowerCase() : "text";
  let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
  let request;
  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
    composedSignal.unsubscribe();
  });
  let requestContentLength;
  try {
    if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
      let _request = new Request(url, {
        method: "POST",
        body: data,
        duplex: "half"
      });
      let contentTypeHeader;
      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
        headers.setContentType(contentTypeHeader);
      }
      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );
        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }
    if (!utils$1.isString(withCredentials)) {
      withCredentials = withCredentials ? "include" : "omit";
    }
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : void 0
    });
    let response = await fetch(request);
    const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
    if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
      const options = {};
      ["status", "statusText", "headers"].forEach((prop) => {
        options[prop] = response[prop];
      });
      const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];
      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }
    responseType = responseType || "text";
    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
    !isStreamResponse && unsubscribe && unsubscribe();
    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    });
  } catch (err) {
    unsubscribe && unsubscribe();
    if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      );
    }
    throw AxiosError$1.from(err, err && err.code, config, request);
  }
});
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};
utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const renderReason = (reason) => `- ${reason}`;
const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
const adapters = {
  getAdapter: (adapters2) => {
    adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters2[i];
      let id2;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id2 = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError$1(`Unknown adapter '${id2}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id2 || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id2, state]) => `adapter ${id2} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError$1(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders$1.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel$1(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const VERSION$1 = "1.9.0";
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError$1(
        formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
        AxiosError$1.ERR_DEPRECATED
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator2 = schema[opt];
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError$1("option " + opt + " must be " + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
let Axios$1 = class Axios2 {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack;
          }
        } catch (e) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig$1(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    if (config.allowAbsoluteUrls !== void 0) ;
    else if (this.defaults.allowAbsoluteUrls !== void 0) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    validator.assertOptions(config, {
      baseUrl: validators.spelling("baseURL"),
      withXsrfToken: validators.spelling("withXSRFToken")
    }, true);
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );
    headers && utils$1.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios$1.prototype[method] = generateHTTPMethod();
  Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
});
let CancelToken$1 = class CancelToken2 {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners) return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError$1(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index2 = this._listeners.indexOf(listener);
    if (index2 !== -1) {
      this._listeners.splice(index2, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken2(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
function spread$1(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError$1(payload) {
  return utils$1.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode$1 = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
  HttpStatusCode$1[value] = key;
});
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);
  utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
  utils$1.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError$1;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel$1;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData$1;
axios.AxiosError = AxiosError$1;
axios.Cancel = axios.CanceledError;
axios.all = function all2(promises) {
  return Promise.all(promises);
};
axios.spread = spread$1;
axios.isAxiosError = isAxiosError$1;
axios.mergeConfig = mergeConfig$1;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig
} = axios;
class Patcher {
  constructor() {
    __publicField(this, "blacklistedKeywords", ["cdn-cgi", "jquery", "jscolor"]);
    __publicField(this, "patched", []);
    __publicField(this, "observer");
  }
  start() {
    console.log("Called Patcher.start()...");
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(async (node) => {
            if (node.tagName === "SCRIPT" && !this.blacklistedKeywords.some((k) => node.src.includes(k)) && node.src.includes(location.host) && !this.patched.includes(node.src)) {
              console.log("MutationObserver Blocked script", node.src);
              this.patched.push(node.src);
              node.removeAttribute("src");
            }
          });
        }
      });
    });
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    [...document.querySelectorAll("script")].forEach((script) => {
      if (!this.blacklistedKeywords.some((k) => script.src.includes(k)) && script.src.includes(location.host) && !this.patched.includes(script.src)) {
        console.log("QuerySelector Blocked script", script.src);
        this.patched.push(script.src);
        script.removeAttribute("src");
      }
    });
  }
  async patch() {
    if (!window.$) {
      console.log("Called patch(), but jQuery was not detected. Waiting 100ms...");
      return setTimeout(() => this.patch(), 100);
    }
    console.log("Detected jQuery! Disconnecting Observer & Patching...");
    this.observer.disconnect();
    this.patched.forEach(async (script) => {
      try {
        let { data } = await axios.get(script);
        let filePatches = bb.patches.filter((e) => script.replace(location.origin, "").startsWith(e.file));
        for (const patch of filePatches) for (const replacement of patch.replacement) {
          if (replacement.setting && bb.plugins.settings[patch.plugin]?.[replacement.setting] === false) {
            console.log("Setting", replacement.setting, "is not active, ignoring...");
            continue;
          } else if (replacement.setting) console.log("Setting", replacement.setting, "is active, applying...");
          const matchRegex = new RegExp(replacement.match, "gm");
          if (!matchRegex.test(data)) {
            console.log(`Patch did nothing! Plugin: ${patch.plugin}; Regex: \`${replacement.match}\`.`);
            continue;
          }
          ;
          data = data.replaceAll(matchRegex, replacement.replace.replaceAll("$self", `bb.plugins.list.find(a => a.name === '${patch.plugin}')`));
        }
        ;
        const url = URL.createObjectURL(new Blob([
          `// ${script.replace(location.origin, "")}${filePatches.map((p) => p.replacement).flat().length >= 1 ? ` - Patched by ${filePatches.map((p) => p.plugin).join(", ")}` : ``}
`,
          data
        ]));
        console.log(`Patched ${script.replace(location.origin, "")}!`);
        let newScript = document.createElement("script");
        newScript.src = url;
        newScript.setAttribute("__nopatch", true);
        newScript.setAttribute("__src", newScript);
        document.head.appendChild(newScript);
      } catch (error) {
        console.error(`Error patching ${script}, ignoring file.`, error);
      }
    });
    let activeStyles = Object.entries(bb.plugins.styles).filter((style) => bb.plugins.active.includes(style[0])).map((s) => s[1]);
    document.head.insertAdjacentHTML("beforeend", `<style>${activeStyles.join("\n\n")}</style>`);
    console.log("Finished Patcher.start() & plugin style injection!");
  }
}
const patcher = new Patcher();
class Events {
  constructor() {
    __privateAdd(this, _subscriptions, /* @__PURE__ */ new Map());
    __publicField(this, "listen", (event, callback) => {
      console.log(`Listening to event '${event}'...`);
      if (!__privateGet(this, _subscriptions).has(event)) __privateGet(this, _subscriptions).set(event, /* @__PURE__ */ new Set());
      __privateGet(this, _subscriptions).get(event).add(callback);
    });
    __publicField(this, "dispatch", (event, payload) => {
      console.log(`Dispatching event '${event}'...`);
      if (__privateGet(this, _subscriptions).has(event))
        __privateGet(this, _subscriptions).get(event).forEach((callback) => callback(payload));
    });
  }
}
_subscriptions = new WeakMap();
const events = new Events();
class Modal {
  constructor({
    title,
    description,
    inputs,
    buttons,
    autoClose = true
  }) {
    __publicField(this, "element");
    __publicField(this, "autoClose");
    __publicField(this, "listening");
    __publicField(this, "listen", async () => {
      this.listening = true;
      return new Promise((resolve) => {
        [...document.querySelectorAll('[id*="bb_modalButton-"]')].forEach((button) => {
          button.addEventListener("click", () => {
            resolve({
              button: button.id.split("bb_modalButton-")[1],
              inputs: [...document.querySelectorAll('[id*="bb_modalInput-"]')].map((a) => {
                return {
                  name: a.placeholder,
                  value: a.value
                };
              })
            });
            if (this.autoClose) this.close();
          });
        });
      });
    });
    __publicField(this, "close", () => this.element.remove());
    if (document.querySelector("#modal")) return console.error("Cannot open more than one modal at once.");
    document.body.insertAdjacentHTML("beforeend", `
            <div class="arts__modal___VpEAD-camelCase" id="modal">
                <form class="styles__container___1BPm9-camelCase">
                    <div class="styles__text___KSL4--camelCase">${title}</div>
                    ${description ? `<div class="bb_modalDescription">${description}</div>` : ""}
                    <div class="styles__holder___3CEfN-camelCase">
                        ${inputs ? `<div style="flex-direction: column;" class="styles__numRow___xh98F-camelCase">
                            ${inputs.map(({ placeholder }, i) => `
                                <div class="bb_modalOuterInput">
                                    <input class="bb_modalInput" placeholder="${placeholder}" type="text" value="" id="${"bb_modalInput-" + i}" />
                                </div>
                            `).join("<br>")}
                        </div>` : ""}
                        ${buttons ? `<div class="styles__buttonContainer___2EaVD-camelCase">
                            ${buttons.map(({ text }, i) => `
                                <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                    <div class="styles__shadow___3GMdH-camelCase"></div>
                                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                    <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;" id="${"bb_modalButton-" + i}">${text}</div>
                                </div>
                            `).join("")}
                        </div>` : ""}
                    </div>
                </form>
            </div>
        `);
    this.element = document.querySelector("#modal");
    this.autoClose = autoClose;
    [...document.querySelectorAll('[id*="bb_modalButton-"]')].forEach((b) => b.addEventListener("click", () => !this.listening ? this.close() : null));
  }
}
class Storage {
  constructor() {
    __publicField(this, "storage", {});
    __publicField(this, "refresh", () => {
      Object.keys(localStorage).forEach((key) => delete localStorage[key]);
      Object.entries(this.storage).forEach(([key, value]) => localStorage.setItem(key, value));
      return this.storage;
    });
    __publicField(this, "get", (key, parse, fallback = null) => {
      if (!this.storage[key]) return fallback;
      if (parse) return JSON.parse(this.storage[key]);
      return this.storage[key];
    });
    __publicField(this, "set", (key, value, stringify) => {
      if (stringify) this.storage[key] = JSON.stringify(value);
      else this.storage[key] = value;
      return this.refresh();
    });
    Object.entries(localStorage).forEach(([key, value]) => this.storage[key] = value);
  }
}
const storage = new Storage();
const loadThemes = async (single) => {
  console.log("Called loadThemes()");
  bb.themes.list = [];
  bb.themes.broken = [];
  [...document.querySelectorAll("[id*='bb-theme']")].forEach((v) => v.remove());
  let themes = storage.get("bb_themeData", true).active.filter((a) => a.trim() !== "");
  for (let theme of themes) axios.get(theme).then(async (res) => {
    let data = res.data;
    let meta = {};
    const matches = data.match(/\/\*\*\s*\n([\s\S]*?)\*\//s)[1].split("\n");
    if (matches) matches.forEach((input) => {
      let match = /@(\w+)\s+([\s\S]+)/g.exec(input);
      if (match) meta[match[1]] = match[2].trim();
    });
    else return bb.themes.broken.push({
      url: theme,
      reason: "Theme metadata could not be found."
    });
    const themeStyle = document.createElement("style");
    themeStyle.id = `bb-theme-${btoa(Math.random().toString(36).slice(2))}`;
    themeStyle.innerHTML = data;
    bb.themes.list.push({
      element: themeStyle,
      name: meta.name,
      meta,
      url: theme
    });
    document.head.appendChild(themeStyle);
    console.log(`Loaded theme "${meta.name}".`);
    bb.events.dispatch("themeUpdate");
  }).catch((err) => {
    console.log("Failed to load theme: " + theme + " - ", err.message);
    bb.themes.broken.push({
      url: theme,
      reason: "Theme could not be loaded."
    });
    bb.events.dispatch("themeUpdate");
  });
  if (single) console.log("Reloaded themes.");
  else console.log("Finished initial theme load function.");
};
const createPlugin = ({
  name,
  description,
  authors,
  patches,
  settings,
  styles,
  onLoad,
  onStart,
  required,
  disabled,
  ...custom
}) => {
  if (!name || !authors?.length || !onLoad && !onStart && !patches && !styles) return console.error(`ERROR: Plugin does not have a title, authors, or executable functions.`);
  let plugin = {
    name,
    description: description || "No description.",
    authors,
    patches: patches || [],
    settings: settings || [],
    styles: styles || ``,
    onLoad: onLoad || (() => {
    }),
    onStart: onStart || (() => {
    }),
    required: required || false,
    disabled: disabled || false,
    ...custom
  };
  return plugin;
};
const index$l = () => createPlugin({
  name: "Advanced Opener",
  description: "the fastest way to mass open blacket packs.",
  authors: [
    { name: "Syfe", avatar: "https://i.imgur.com/OKpOipQ.gif", url: "https://github.com/ItsSyfe" },
    { name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }
  ],
  styles: `
        .bb_openModal {
            font-family: "Nunito", sans-serif;
            font-size: 1vw;
            height: 40vw;
            width: 22vw;
            border: 3px solid #262626;
            background: #2f2f2f;
            position: absolute;
            bottom: 1vw;
            right: 1vw;
            border-radius: 7.5px;
            text-align: center;
            color: white;
            overflow: auto;
            padding: 2vw;
        }

        .bb_openIcons {
            position: absolute;
            right: 1vw;
            top: 1vw;
            font-size: 1.5vw;
        }

        .bb_openIcon {
            cursor: pointer;
        }

        .bb_openTitle {
            font-size: 2vw;
            font-weight: 1000;
        }

        .bb_openedCount {
            font-weight: 800;
            font-size: 1.5vw;
            margin-top: 1vw;
            padding-bottom: 1vw;
        }

        .bb_opened {
            margin-top: 1.5vw;
            height: 27vw;
            overflow: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .bb_opened::-webkit-scrollbar {
            display: none;
        }

        .bb_openResult {
            font-size: 1.55vw;
            margin-top: 0.5vw;
            font-weight: 600;
        }

        .bb_openButtons {
            position: absolute;
            bottom: 1.25vw;
            display: flex;
            align-items: center;
            width: calc(100% - 4vw);
        }

        .bb_openButton {
            font-size: 1.8vw;
            cursor: pointer;
            width: 100%;
            height: 2.6vw;
            border: 4px solid white;
            border-radius: 0.4vw;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `,
  onStart: () => {
    if (!location.pathname.startsWith("/market")) return;
    bb.plugins.massopen = {};
    bb.plugins.massopen.start = async () => {
      let packModal = new bb.Modal({
        title: "Mass Open",
        inputs: [{ placeholder: "Pack" }],
        buttons: [{ text: "Next" }, { text: "Cancel" }]
      });
      let packResponse = await packModal.listen();
      if (packResponse.button !== "0") return;
      let pack = packResponse.inputs[0].value;
      if (!blacket.packs[pack]) return new bb.Modal({
        title: "I cannot find that pack.",
        buttons: [{ text: "Close" }]
      });
      let countModal = new bb.Modal({
        title: "Mass Open",
        inputs: [{ placeholder: "Quantity" }],
        buttons: [{ text: "Next" }, { text: "Cancel" }]
      });
      let countResponse = await countModal.listen();
      if (countResponse.button !== "0") return;
      let qty = Number(countResponse.inputs[0].value) || null;
      if (qty === NaN) return new bb.Modal({
        title: "Invalid quantity.",
        buttons: [{ text: "Close" }]
      });
      let cost = blacket.packs[pack].price * qty;
      if (blacket.user.tokens < cost) return new bb.Modal({
        title: "You do not have enough tokens to open that many packs!",
        buttons: [{ text: "Close" }]
      });
      let extraDelayModal = new bb.Modal({
        title: "Mass Open",
        description: "you can leave this at zero (nothing) if you're not going to be using blacket while running the opener, otherwise recommended is 50-75",
        inputs: [{ placeholder: "Extra Delay" }],
        buttons: [{ text: "Next" }, { text: "Cancel" }]
      });
      let extraDelayResponse = await extraDelayModal.listen();
      if (extraDelayResponse.button !== "0") return;
      let extraDelay = Number(extraDelayResponse.inputs[0].value);
      if (extraDelay === NaN) return new bb.Modal({
        title: "Invalid Extra Delay.",
        buttons: [{ text: "Close" }]
      });
      let confirmModal = new bb.Modal({
        title: "Mass Open",
        description: `Are you sure you want to open ${qty.toLocaleString()}x ${pack}? This will cost ${cost.toLocaleString()} tokens!`,
        buttons: [{ text: "Start!" }, { text: "Cancel" }]
      });
      let confirmResponse = await confirmModal.listen();
      if (confirmResponse.button !== "0") return;
      document.querySelector(".bb_openButton").innerText = "Stop Opening";
      let maxDelay = Object.values(blacket.rarities).map((x) => x.wait).reduce((curr, prev) => curr > prev ? curr : prev) + extraDelay;
      let opened = [];
      let openedCount = 0;
      let openPack = async () => new Promise((resolve, reject) => {
        blacket.requests.post("/worker3/open", { pack }, (data) => {
          if (data.error) reject();
          resolve(data.blook);
        });
      });
      document.querySelector(".bb_openButton").innerText = "Stop Opening";
      document.querySelector(".bb_openButton").onclick = () => openedCount = qty;
      while (openedCount < qty) {
        try {
          const attainedBlook = await openPack();
          blacket.user.tokens -= blacket.packs[pack].price;
          $("#tokenBalance").html(`<img loading="lazy" src="/content/tokenIcon.webp" alt="Token" class="styles__tokenBalanceIcon___3MGhs-camelCase" draggable="false"><div>${blacket.user.tokens.toLocaleString()}</div>`);
          const delay = blacket.rarities[blacket.blooks[attainedBlook].rarity].wait - 45 + extraDelay;
          opened.push(attainedBlook);
          openedCount = opened.length;
          let count = opened.reduce((acc, blook) => {
            acc[blook] = (acc[blook] || 0) + 1;
            return acc;
          }, {});
          Object.entries(count).map((x) => `    ${x[1]} ${x[0]}`).join(`
`);
          document.querySelector(".bb_openedCount").innerHTML = `${pack} | ${openedCount}/${qty} opened`;
          document.querySelector(".bb_opened").innerHTML = Object.entries(count).map(([blook, qtyOf]) => {
            return `<div class="bb_openResult" style="color: ${blacket.rarities[blacket.blooks[blook].rarity].color};">${blook} x${qtyOf}</div>`;
          }).join("");
          await new Promise((r) => setTimeout(r, delay));
        } catch (err) {
          console.log(err);
          await new Promise((r) => setTimeout(r, maxDelay));
        }
      }
      alert(`Open Complete! Opened ${qty}x ${pack}, spending ${cost.toLocaleString()} tokens!`);
      document.querySelector(".bb_openedCount").innerHTML = "Opening ended!";
      document.querySelector(".bb_openButton").onclick = () => bb.plugins.massopen.start();
      document.querySelector(".bb_openButton").innerText = "Start Opening";
    };
    document.body.insertAdjacentHTML("beforeend", `
            <div class="bb_openModal">
                <div class="bb_openIcons">
                    <i class="fas fa-arrows-up-down-left-right bb_openIcon" id="bb_openDragger"></i>
                    <i class="fas fa-x bb_openIcon" onclick="document.querySelector('.bb_openModal').remove()"></i>
                </div>
                <div class="bb_openTitle">Pack Opening</div>
                <div class="bb_openedCount">Waiting to open...</div>
                <hr>
                <div class="bb_opened"></div>
                <div class="bb_openButtons">
                    <div class="bb_openButton" onclick="bb.plugins.massopen.start()">Start Opening</div>
                </div>
            </div>
        `);
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let modal = document.querySelector(".bb_openModal");
    let dragger = document.querySelector("#bb_openDragger");
    dragger.onmousedown = (e) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      document.onmousemove = (e2) => {
        e2.preventDefault();
        pos1 = pos3 - e2.clientX;
        pos2 = pos4 - e2.clientY;
        pos3 = e2.clientX;
        pos4 = e2.clientY;
        let top = modal.offsetTop - pos2 > 0 ? modal.offsetTop - pos2 : 0;
        let left = modal.offsetLeft - pos1 > 0 ? modal.offsetLeft - pos1 : 0;
        if (top + modal.offsetHeight + 15 <= window.innerHeight) modal.style.top = top + "px";
        if (left + modal.offsetWidth + 15 <= window.innerWidth) modal.style.left = left + "px";
      };
    };
    window.onresize = () => modal.style.top = modal.style.left = "";
  }
});
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$l }, Symbol.toStringTag, { value: "Module" }));
const index$k = () => createPlugin({
  name: "April Fools 2023",
  description: "returns the 2023 april fools update.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  styles: `
        .styles__sidebar___1XqWi-camelCase,
        .styles__left___9beun-camelCase,
        .styles__postsContainer___39_IQ-camelCase,
        .styles__middleWrapper___hjUyY-camelCase,
        .styles__header___22Ne2-camelCase,
        .styles__container___2VzTy-camelCase,
        .styles__input___2XTSp-camelCase {
            background-color: #dcd9d9;
        }

        .styles__background___2J-JA-camelCase,
        .styles__background___2J-JA-camelCase,
        .styles__blookGridContainer___AK47P-camelCase {
            background-color: #b5b5b5;
        }

        .styles__headerBadges___ffKa4-camelCase,
        .styles__statsContainer___QnrRB-camelCase,
        .styles__profileContainer___CSuIE-camelCase,
        .styles__tokenBalance___1FHgT-camelCase,
        .styles__infoContainer___2uI-S-camelCase,
        .styles__header___2O21B-camelCase,
        .styles__cardContainer___NGmjp-camelCase,
        .styles__plan___1OEy4-camelCase,
        .styles__perkContainer___2rw2I-camelCase,
        .styles__headerSide___1r1-b-camelCase,
        .styles__signUpButton___3_ch3-camelCase,
        .styles__loginButton___1e3jI-camelCase,
        .styles__chatEmojiButton___8RFa2-camelCase,
        .styles__button___2hNZo-camelCase,
        .styles__tradingContainer___B1ABS-camelCase,
        .styles__otherTokenAmount___SEGGS-camelCase,
        .styles__myTokenAmount___ANKHA-camelCase,
        .styles__horizontalBlookGridLine___4SAvz-camelCase,
        .styles__verticalBlookGridLine___rQWaZ-camelCase,
        .styles__profileDropdownMenu___2jUAA-camelCase,
        .styles__profileDropdownOption___ljZXD-camelCase {
            background-color: #9d9d9d;
        }

        .styles__button___2hNZo-camelCase {
            color: #3a3a3a;
        }

        .styles__pageButton___1wFuu-camelCase,
        .styles__bottomIcon___3Fswk-camelCase,
        .styles__containerHeaderInside___2omQm-camelCase,
        .styles__statNum___5RYSd-camelCase {
            color: #5f5a5a;
        }
        .styles__statContainer___QKuOF-camelCase,
        .styles__containerHeaderInside___2omQm-camelCase,
        .styles__containerHeader___3xghM-camelCase,
        .styles__containerHeaderRight___3xghM-camelCase {
            background-color: #d5d4d4;
        }

        #chatBox,
        .styles__chatInputContainer___gkR4A-camelCase  {
            background-color: #d2cccc;
        }

        .styles__setText___1PQLQ-camelCase {
            color: #3a3939;
        }

        .styles__edge___3eWfq-camelCase,
        .styles__buttonFilled___23Dcn-camelCase {
            background-color: #ffffff;
            border-color: #ffffff;
        }

        .styles__lockedBlook___3oGaX-camelCase {
            filter: brightness(0.3);
        }

        #packSelector::-webkit-scrollbar,
        #blookSelector::-webkit-scrollbar,
        .styles__bazaarItems___KmNa2-camelCase::-webkit-scrollbar {
            display: none;
        }

        .styles__bazaarItems___KmNa2-camelCase {
            background-color: rgba(0, 0, 0, 0.33);
        }

        .styles__bazaarItem___Meg69-camelCase {
            background-color: #9d9d9d;
        }

        .styles__bazaarItem___Meg69-camelCase:hover {
            background-color: #3a3939;
        }

        .styles__container___3St5B-camelCase {
            background-color: #808080;
        }
    `,
  onLoad: () => {
    if (document.getElementsByClassName("styles__topRightRow___dQvxc-camelCase")[0] && location.pathname === "/market") {
      document.getElementsByClassName("styles__topRightRow___dQvxc-camelCase")[0].children[0].style.backgroundColor = "#9d9d9d";
    }
    if (document.getElementsByClassName("styles__front___vcvuy-camelCase")[0] && location.pathname === "/blooks" || location.pathname === "/store" || location.pathname === "/bazaar") {
      Array.from(document.getElementsByClassName("styles__front___vcvuy-camelCase")).forEach((a) => {
        a.style.backgroundColor = "#9d9d9d";
      });
      Array.from(document.getElementsByClassName("styles__edge___3eWfq-camelCase")).forEach((a) => {
        a.style.backgroundColor = "#9d9a9a";
      });
      setInterval(() => {
        Array.from(document.getElementsByClassName("styles__front___vcvuy-camelCase")).forEach((a) => {
          a.style.backgroundColor = "#9d9d9d";
        });
        Array.from(document.getElementsByClassName("styles__edge___3eWfq-camelCase")).forEach((a) => {
          a.style.backgroundColor = "#9d9a9a";
        });
      }, 25);
    }
    if (document.getElementsByTagName("div")[0] && location.pathname === "/404" || location.pathname === "/502/" || location.pathname === "/blacklisted") {
      document.getElementsByTagName("div")[0].style.backgroundColor = "#b5b5b5";
      document.getElementsByTagName("div")[2].style.backgroundColor = "#d5d4d4";
      document.getElementsByTagName("div")[2].style.filter = "drop-shadow(white 0px 1px 3px)";
    }
    if (document.getElementsByClassName("styles__background___2J-JA-camelCase")[0] && location.pathname === "/trade" || location.pathname === "/store") {
      document.getElementsByClassName("styles__background___2J-JA-camelCase")[0].style.backgroundColor = "#b5b5b5";
    }
    Array.from(document.getElementsByTagName("input")).forEach((n) => {
      n.style.backgroundColor = "#9d9d9d";
    });
    setInterval(() => {
      Array.from(document.getElementsByTagName("div")).forEach((n) => {
        n.style.fontFamily = "Comic Sans MS";
      });
      Array.from(document.getElementsByTagName("a")).forEach((n) => {
        n.style.fontFamily = "Comic Sans MS";
      });
      Array.from(document.getElementsByTagName("text")).forEach((n) => {
        n.style.fontFamily = "Comic Sans MS";
      });
      Array.from(document.getElementsByTagName("div")).forEach((n) => {
        let textNodes = Array.from(n.childNodes).filter((node) => node.nodeType === 3);
        textNodes.forEach((node) => node.nodeValue = node.nodeValue.toLowerCase());
      });
      Array.from(document.getElementsByTagName("a")).forEach((n) => {
        let textNodes = Array.from(n.childNodes).filter((node) => node.nodeType === 3);
        textNodes.forEach((node) => node.nodeValue = node.nodeValue.toLowerCase());
      });
      Array.from(document.getElementsByTagName("text")).forEach((n) => {
        let textNodes = Array.from(n.childNodes).filter((node) => node.nodeType === 3);
        textNodes.forEach((node) => node.nodeValue = node.nodeValue.toLowerCase());
      });
    }, 25);
    setTimeout(() => {
      Array.from(document.getElementsByTagName("div")).forEach((n) => {
        let textNodes = Array.from(n.childNodes).filter((node) => node.nodeType === 3);
        textNodes.forEach((node) => {
          let letters = node.nodeValue.split("");
          let randomIndex = Math.floor(Math.random() * letters.length);
          let randomIndex2 = Math.floor(Math.random() * letters.length);
          let temp = letters[randomIndex];
          letters[randomIndex] = letters[randomIndex2];
          letters[randomIndex2] = temp;
          node.nodeValue = letters.join("");
        });
      });
      Array.from(document.getElementsByTagName("a")).forEach((n) => {
        let textNodes = Array.from(n.childNodes).filter((node) => node.nodeType === 3);
        textNodes.forEach((node) => {
          let letters = node.nodeValue.split("");
          let randomIndex = Math.floor(Math.random() * letters.length);
          let randomIndex2 = Math.floor(Math.random() * letters.length);
          let temp = letters[randomIndex];
          letters[randomIndex] = letters[randomIndex2];
          letters[randomIndex2] = temp;
          node.nodeValue = letters.join("");
        });
      });
      Array.from(document.getElementsByTagName("text")).forEach((n) => {
        let textNodes = Array.from(n.childNodes).filter((node) => node.nodeType === 3);
        textNodes.forEach((node) => {
          let letters = node.nodeValue.split("");
          let randomIndex = Math.floor(Math.random() * letters.length);
          let randomIndex2 = Math.floor(Math.random() * letters.length);
          let temp = letters[randomIndex];
          letters[randomIndex] = letters[randomIndex2];
          letters[randomIndex2] = temp;
          node.nodeValue = letters.join("");
        });
      });
    }, 500);
  }
});
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$k }, Symbol.toStringTag, { value: "Module" }));
const index$j = () => createPlugin({
  name: "Bazaar Sniper",
  description: "pew pew! sniped right off the bazaar!",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  onStart: () => {
    let checkBazaar = setInterval(() => {
      if (blacket.login || blacket.config.path === "") return clearInterval(checkBazaar);
      if (!blacket.user) return;
      axios.get("/worker/bazaar").then((bazaar) => {
        bazaar.data.bazaar.forEach((bazaarItem) => {
          let blookData = blacket.blooks[bazaarItem.item];
          if (!!!blookData || blookData.price < bazaarItem.price || bazaarItem.seller === blacket.user.username) return;
          axios.post("/worker/bazaar/buy", { id: bazaarItem.id }).then((purchase) => {
            if (purchase.data.error) return console.log(`[Bazaar Sniper] Error sniping Blook`, bazaarItem, purchase);
            console.log(`[Bazaar Sniper] Sniped a blook!`, bazaarItem);
            blacket.createToast({ message: `Sniped Blook ${bazaarItem.item} from seller ${bazaarItem.seller} with price ${bazaarItem.price}!` });
          });
        });
      });
    }, 750);
  }
});
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$j }, Symbol.toStringTag, { value: "Module" }));
const index$i = () => createPlugin({
  name: "Better Chat",
  description: "enhances your chatting experience!",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /id="\${randomUsernameId}"/,
          replace: "",
          setting: "Click 2 Clan"
        },
        {
          match: /style="color: \${data\.author\.co/,
          replace: `id="\${randomUsernameId}" style="color: \${data.author.co`,
          setting: "Click 2 Clan"
        },
        {
          match: /style="color: \${data\.author\.clan\.color};"/,
          replace: `onclick="window.open('/clans/discover?name=\${encodeURIComponent(data.author.clan.name)}');" style="color: \${data.author.clan.color};"`,
          setting: "Click 2 Clan"
        },
        {
          match: /\$\{blacket\.config\.path !== "trade" \? `<div class="styles__contextMenuItemContainer___m3Xa3-camelCase" id="message-context-quote">/,
          replace: `\${(data.author.id !== blacket.user.id) && blacket.config.path !== "trade" ? \`<div class="styles__contextMenuItemContainer___m3Xa3-camelCase" id="message-context-trade">
                        <div class="styles__contextMenuItemName___vj9a3-camelCase">Trade</div>
                        <i class="styles__contextMenuItemIcon___2Zq3a-camelCase fas fa-hand-holding"></i>
                    </div>\` : ""}

                    \${blacket.config.path !== "trade" ? \`<div class="styles__contextMenuItemContainer___m3Xa3-camelCase" id="message-context-quote">`
        },
        {
          match: /\$\(`#message-context-copy-id`\)\.click\(\(\) => navigator\.clipboard\.writeText\(data\.message\.id\)\);/,
          replace: `$('message-context-trade').click(() => blacket.tradeUser(data.author.id));
                    $(\`#message-context-copy-id\`).click(() => navigator.clipboard.writeText(data.message.id));`
        }
      ]
    }
  ],
  styles: `
        .styles__chatMessageContainer__G1Z4P-camelCase {
            padding: 1vw 1.5vw;
        }

        .styles__chatContainer___iA8ZU-camelCase {
            height: calc(100% - 4.25vw);
        }

        div[style="position: absolute;bottom: 0;width: 100%;"] {
            bottom: 1.25vw !important;
            left: 2vw;
            width: calc(100% - 3vw) !important;
        }

        .styles__chatInputContainer___gkR4A-camelCase {
            border-radius: 10vw;
        }

        .styles__chatUploadButton___g39Ac-camelCase,
        .styles__chatEmojiButton___8RFa2-camelCase {
            border-radius: 50%;
        }

        .styles__chatEmojiPickerContainer___KR4aN-camelCase {
            border-radius: 0 0 0.5vw 0.5vw;
            bottom: 3.3vw;
            background-color: #2f2f2f;
            width: 19vw;
        }

        .styles__chatEmojiPickerBody___KR4aN-camelCase {
            left: unset;
            gap: 0.5vw;
            justify-content: center;
        }

        .styles__chatEmojiPickerHeader___FK4Ac-camelCase {
            font-size: 1.15vw;
            height: 3vw;
            font-weight: 800;
            background-color: #3f3f3f;
        }
    `,
  settings: [{
    name: "Click 2 Clan",
    default: true
  }]
});
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$i }, Symbol.toStringTag, { value: "Module" }));
const index$h = () => createPlugin({
  name: "Better Notifications",
  description: "a new and improved notification system.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/all.js",
      replacement: [
        {
          match: /\.styles__toastContainer___o4pCa-camelCase/,
          replace: `.toastMessage`
        },
        {
          match: /\$\("body"\)\.append\(`<div class="s.*?<\/div><\/div>`\)/,
          replace: "bb.plugins.notifications(toast.title, toast.message, toast.audio);return;"
        }
      ]
    },
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /Notification\.permission == "granted"/,
          replace: "false",
          setting: "Disable Desktop"
        },
        {
          match: /Notification\.permission !== "granted" && Notification\.permission !== "denied"/,
          replace: "false",
          setting: "Disable Desktop"
        },
        {
          match: /3500/,
          replace: "1000"
        },
        {
          match: /flyOut 0\.35s ease-in-out/,
          replace: `styles__oldGrowOut___3FTko-camelCase 0.5s linear`
        },
        {
          match: /flyIn 0.35s ease-in-out/,
          replace: `styles__oldGrowIn___3FTko-camelCase 0.5s linear`
        }
      ]
    }
  ],
  styles: `
        .toastMessage {
            animation: styles__oldGrowIn___3FTko-camelCase 0.5s linear forwards;
            background-color: #1f1f1f;
            border-radius: 5px;
            left: 0;
            right: 0;
            text-align: center;
            top: 20px;
            display: flex;
            flex-direction: column;
            padding: 5px 20px 10px 20px;
            position: absolute;
            margin: 0 auto;
            height: fit-content;
            cursor: pointer;
        }
    `,
  onLoad: () => {
    bb.plugins.notifications = (title, message, audio = true) => {
      let id2 = Math.random().toString(36).substring(2, 15);
      $("#app").append(`
                <div id='${id2}' class='toastMessage'>
                    ${title ? `<text style='color: white; font-size:25px;'>${title}</text>` : ""}
                    ${message ? `<text style='color: white; font-size:20px;'>${message}</text>` : ""}
                </div>
            `);
      if (audio) new Audio("/content/notification.ogg").play();
      let timeout = setTimeout(() => {
        document.getElementById(id2).onclick = null;
        $(`#${id2}`).attr("style", "animation: styles__oldGrowOut___3FTko-camelCase 0.5s linear forwards;");
        setTimeout(() => {
          $(`#${id2}`).remove();
          blacket.toasts.shift();
          if (blacket.toasts.length > 0) blacket.createToast(blacket.toasts[0], true);
        }, 1e3);
      }, 5e3);
      document.getElementById(id2).onclick = () => {
        clearTimeout(timeout);
        $(`#${id2}`).remove();
        blacket.toasts.shift();
        if (blacket.toasts.length > 0) blacket.createToast(blacket.toasts[0], true);
      };
    };
  },
  settings: [{
    name: "Disable Desktop",
    default: false
  }]
});
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$h }, Symbol.toStringTag, { value: "Module" }));
const index$g = () => createPlugin({
  name: "Better Replies",
  description: "overhauls the message reply system.",
  authors: [
    { name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" },
    { name: "Syfe", avatar: "https://i.imgur.com/OKpOipQ.gif", url: "https://github.com/ItsSyfe" }
  ],
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /var tem \= document\.querySelector\('\#chatContainer \.styles__chatMessageContainer__G1Z4P\-camelCase\:last\-child'\);/,
          replace: `
                        message = message.replace(/&lt;\\/gradient=.*&gt;/, '');
                        message = message.replace(/&lt;gradient=.*&gt;/, '');
                        message = message.replace(/&lt;\\/#.*&gt;/, '');
                        message = message.replace(/&lt;#.*&gt;/, '');
                        var tem = document.querySelector('#chatContainer .styles__chatMessageContainer__G1Z4P-camelCase:last-child');
                    `
        },
        {
          match: /quote`\).click\(\(\) => \{/,
          replace: `quote\`).click(() => {return;`
        },
        {
          match: /\$\(`\#message-context-copy`\)/,
          replace: `$('#message-context-quote').click(() => $self.quote(data));$('#message-context-copy')`
        },
        {
          match: /\$\(`\#message-\$\{data.message.id\}-r/,
          replace: `$(\`#message-\${data.message.id}-quote\`).click(() => $self.quote(data));$(\`#message-\${data.message.id}-r`
        },
        {
          match: /let delay = 0;/,
          replace: `window.blacket.chat.update = () => chatBoxUpdate();let delay = 0;`
        }
      ]
    }
  ],
  quote: (data) => {
    let msg = `Γò¡ From <@${data.author.id}> ${localStorage.getItem("chatColor") ? "</c>" : ""}${data.author.clan ? `**<${data.author.clan.color}>[ ${data.author.clan.name} ]</c>**` : ""} ${data.message.content}
${localStorage.getItem("chatColor") ? `<${localStorage.getItem("chatColor")}>` : ""}`;
    document.querySelector("#chatBox").value = msg;
    document.querySelector("#chatBox").focus();
    blacket.chat.update();
  }
});
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$g }, Symbol.toStringTag, { value: "Module" }));
const index$f = () => createPlugin({
  name: "Blook Utilities",
  description: "enhances the blook manager experience.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/blooks.js",
      replacement: [
        {
          match: /\`\$\{blacket\.user\.blooks\[blook\]\.toLocaleString\(\)\} Owned\`/,
          replace: `bb.plugins.blookutils ? bb.plugins.blookutils.blooks[blook].toLocaleString() + ' Owned' : \`\${blacket.user.blooks[blook].toLocaleString()} Owned\``
        },
        {
          match: /let packBlooks/,
          replace: "window.packBlooks"
        },
        {
          match: />List<\/div>/,
          replace: `>Next</div>`
        },
        {
          match: /blacket\.listBlook\(\$\(.*?\)\.val\(\)\);/,
          replace: `
                        let amount = $('.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)').val();
                        $('.arts__modal___VpEAD-camelCase').remove();
                        document.querySelector('body').insertAdjacentHTML('beforeend', \`<div class='arts__modal___VpEAD-camelCase'>
                            <form class='styles__container___1BPm9-camelCase'>
                                <div class='styles__text___KSL4--camelCase'>List \${blacket.blooks.selected} Blook how many times?</div>
                                <div class='styles__holder___3CEfN-camelCase'>
                                    <div class='styles__numRow___xh98F-camelCase'>
                                        <div style='border: 0.156vw solid rgba(0, 0, 0, 0.17);border-radius: 0.313vw;width: 90%;height: 2.604vw;margin: 0.000vw;display: flex;flex-direction: row;align-items: center;'>
                                            <input style='  border: none;height: 2.083vw;line-height: 2.083vw;font-size: 1.458vw;text-align: center;font-weight: 700;font-family: Nunito, sans-serif;color: #ffffff;background-color: #3f3f3f;outline: none;width: 100%;' placeholder='Price' maxlength='3' value='1'>
                                        </div>
                                    </div>
                                    <div class='styles__buttonContainer___2EaVD-camelCase'>
                                        <div id='yesButton' class='styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase' role='button' tabindex='0'>
                                         <div class='styles__shadow___3GMdH-camelCase'></div>
                                            <div class='styles__edge___3eWfq-camelCase' style='background-color: #2f2f2f;'></div>
                                            <div class='styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase' style='background-color: #2f2f2f;'>List</div>
                                        </div>
                                        <div id='noButton' class='styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase' role='button' tabindex='0'>
                                            <div class='styles__shadow___3GMdH-camelCase'></div>
                                            <div class='styles__edge___3eWfq-camelCase' style='background-color: #2f2f2f;'></div>
                                            <div class='styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase' style='background-color: #2f2f2f;'>Cancel</div>
                                        </div>
                                    </div>
                                </div>
                                <input type='submit' style='opacity: 0; display: none;' />
                            </form>
                        </div>\`);
                        $('.styles__container___1BPm9-camelCase').submit((event) => {
                            event.preventDefault();
                            blacket.listBlook($('.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)').val());
                        });
                        $('.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)').focus();
                        $('#yesButton').click(async () => {
                            let times = parseInt($('.styles__numRow___xh98F-camelCase > div:nth-child(1) > input:nth-child(1)').val());
                            blacket.startLoading();
                            for (let i = 0; i < times; i++) {
                                blacket.listBlook(amount);
                                await new Promise(resolve => setTimeout(resolve, 500 * times));
                            };
                            blacket.stopLoading();
                        });
                        $('#noButton').click(() => {
                            $('.arts__modal___VpEAD-camelCase').remove();
                        });
                    `
        }
      ]
    }
  ],
  onStart: () => {
    if (!location.pathname.startsWith("/blooks")) return;
    blacket.listBlook = (price) => {
      if (price == `` || price == 0) return;
      $(".arts__modal___VpEAD-camelCase").remove();
      axios.post("/worker/bazaar/list", {
        item: blacket.blooks.selected,
        price
      }).then((list) => {
        if (list.data.error) {
          blacket.createToast({
            title: "Error",
            message: list.data.reason,
            icon: "/content/blooks/Error.png",
            time: 5e3
          });
          return blacket.stopLoading();
        }
        blacket.user.blooks[blacket.blooks.selected] -= 1;
        if (blacket.user.blooks[blacket.blooks.selected] < 1) {
          $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(2)`).remove();
          $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")}`).append(`<i class='fas fa-lock styles__blookLock___3Kgua-camelCase' aria-hidden='true'></i>`);
          $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")}`).attr("style", "cursor: auto;");
          $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(1)`).attr("class", "styles__blookContainer___36LK2-camelCase styles__blook___bNr_t-camelCase styles__lockedBlook___3oGaX-camelCase");
          delete blacket.user.blooks[blacket.blooks.selected];
          blacket.blooks.selected = Object.keys(blacket.user.blooks)[Math.floor(Math.random() * Object.keys(blacket.user.blooks).length)];
        } else $(`#${blacket.blooks.selected.replaceAll(" ", "-").replaceAll("'", "_")} > div:nth-child(2)`).html(blacket.user.blooks[blacket.blooks.selected].toLocaleString());
        blacket.selectBlook(blacket.blooks.selected);
      });
    };
    $(`<style>.styles__left___9beun-camelCase {
            height: calc(100% - 6.125vw);
            top: 4.563vw;
        }

        .bb_dupeManager {
            display: flex;
            justify-content: space-between;
            gap: 3vw;
            position: absolute;
            left: 2.5%;
            width: calc(95% - 22.396vw);
        }

        .bb_dupeManager > .styles__button___1_E-G-camelCase {
            width: 100%;
            margin-left: 0;
            text-align: center;
            top: 1vw;
        }

        .bb_userSelector {
            position: absolute;
            top: calc(50% + 15.417vw);
            right: 2.5%;
            width: 20.833vw;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
        }

        .bb_userSelectBtn {
            margin: 0.521vw;
            width: 100%;
        }

        .bb_userSelectText {
            width: 80%;
            justify-content: space-between;
        }

        #bb_userSelectUsername {
            font-family: 'Titan One';
        }</style>

        <div class='bb_userSelector'>
            <div id='sellButton' class='styles__button___1_E-G-camelCase bb_userSelectBtn' role='button' tabindex='0'>
                <div class='styles__shadow___3GMdH-camelCase'></div>
                <div class='styles__edge___3eWfq-camelCase' style='background-color: #2f2f2f;'></div>
                <div class='styles__front___vcvuy-camelCase' style='background-color: #2f2f2f;'>
                    <div class='styles__rightButtonInside___14imT-camelCase bb_userSelectText'>
                        <span id='bb_userSelectUsername'>User: ${blacket.user.username}</span>
                        <i class='bb_userSelectIcon fas fa-caret-down'></i>
                    </div>
                </div>
            </div>
        </div>`).insertAfter($(".styles__rightButtonRow___3a0GF-camelCase"));
    document.querySelector(".bb_userSelectBtn").onclick = async () => {
      let modal = new bb.Modal({
        title: "Blook Viewer",
        description: "Enter a username to search their blooks.",
        inputs: [{ placeholder: "Username" }],
        buttons: [{ text: "Search" }, { text: "Cancel" }]
      });
      let result = await modal.listen();
      if (result.button.toString() === "0") {
        axios.get("/worker2/user/" + result.inputs[0].value).then((u) => {
          if (u.data.error) return new bb.Modal({
            title: "User not found.",
            buttons: [{
              text: "Close"
            }]
          });
          const lock = (blook) => {
            let element = document.getElementById(blook.replaceAll("'", "_").replaceAll(" ", "-"));
            if (!element) return;
            element.children[0].classList.add("styles__lockedBlook___3oGaX-camelCase");
            element.children[1].outerHTML = `<i class='fas fa-lock styles__blookLock___3Kgua-camelCase' aria-hidden='true'></i>`;
          };
          const unlock = (blook, qty, rarity) => {
            let element = document.getElementById(blook.replaceAll("'", "_").replaceAll(" ", "-"));
            if (!element) return;
            element.children[0].classList.remove("styles__lockedBlook___3oGaX-camelCase");
            element.children[1].outerHTML = `<div class='styles__blookText___3AMdK-camelCase' style='background-color: ${blacket.rarities[rarity].color};'>${qty}</div>`;
          };
          let blooks2 = [...document.querySelectorAll(".styles__blookContainer___3JrKb-camelCase")].map((a) => a.id);
          blooks2.forEach((b) => lock(b));
          let containers = [...document.querySelectorAll(".styles__setBlooks___3xamH-camelCase")];
          let miscList = containers[containers.length - 1];
          miscList.replaceChildren();
          let user = u.data.user;
          bb.plugins.blookutils = {
            viewingSelf: false,
            blooks: user.blooks
          };
          document.querySelector("#bb_userSelectUsername").innerText = `User: ${user.username}`;
          Object.entries(user.blooks).forEach((blook) => {
            if (packBlooks.includes(blook[0])) return unlock(blook[0], blook[1], blacket.blooks[blook[0]].rarity);
            if (!blacket.blooks[blook[0]]) return;
            let quantity;
            if (blacket.rarities[blacket.blooks[blook[0]].rarity] && blacket.rarities[blacket.blooks[blook[0]].rarity].color == "rainbow") quantity = `<div class='styles__blookText___3AMdK-camelCase' style='background-image: url('/content/rainbow.gif');'>${blook[1].toLocaleString()}</div></div>`;
            else quantity = `<div class='styles__blookText___3AMdK-camelCase' style='background-color: ${blacket.rarities[blacket.blooks[blook[0]].rarity].color};'>${blook[1].toLocaleString()}</div></div>`;
            miscList.insertAdjacentHTML("beforeend", `<div id='${blook[0].replaceAll(" ", "-").replaceAll("'", "_")}' class='styles__blookContainer___3JrKb-camelCase' style='cursor: pointer' role='button' tabindex='0'><div class='styles__blookContainer___36LK2-camelCase styles__blook___bNr_t-camelCase'><img loading='lazy' src='${blacket.blooks[blook[0]].image}' draggable='false' class='styles__blook___1R6So-camelCase' /></div>${quantity}`);
            document.getElementById(blook[0].replaceAll(" ", "-").replaceAll("'", "_")).addEventListener("click", () => blacket.selectBlook(blook[0]));
          });
        });
        modal.close();
      } else modal.close();
    };
    document.querySelector(".arts__profileBody___eNPbH-camelCase").insertAdjacentHTML("afterbegin", `
            <div class="bb_dupeManager">
                <div id='checkDupes' class='styles__button___1_E-G-camelCase' role='button' tabindex='0'>
                    <div class='styles__shadow___3GMdH-camelCase'></div>
                    <div class='styles__edge___3eWfq-camelCase' style='background-color: #2f2f2f;'></div>
                    <div class='styles__front___vcvuy-camelCase' style='background-color: #2f2f2f;'>
                        <div class='styles__rightButtonInside___14imT-camelCase'>Check Dupes</div>
                    </div>
                </div>
            </div>
        `);
    document.querySelector("#checkDupes").onclick = () => {
      new bb.Modal({
        title: "Duplicate Blooks",
        description: Object.entries(blacket.user.blooks).filter((blook) => blook[1] > 1).map(([blook, qty]) => `<span style="color: ${blacket.rarities[blacket.blooks[blook].rarity].color}">${blook}: ${qty.toLocaleString()}</span>`).join(" | "),
        buttons: [{ text: "Close" }]
      });
    };
  }
});
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$f }, Symbol.toStringTag, { value: "Module" }));
const badges = async (...args2) => {
  if (args2[0]) axios.get("/worker2/user/" + args2[0]).then((u) => {
    if (u.data.error) bb.plugins.deafbot.send(`Error fetching user ${args2[0]}: **${u.data.reason}**`);
    else bb.plugins.deafbot.send(`**${u.data.user.username}**'s Badges: ${u.data.user.badges.join(" ")}`);
  });
  else bb.plugins.deafbot.send(`Your Badges: ${blacket.user.badges.join(" ")}`);
};
const blocks = async (...args2) => {
  switch (args2[0]) {
    case "list":
      axios.get("/worker2/friends").then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error fetching blocks: **${f.data.reason}**`);
        else bb.plugins.deafbot.send(`**${f.data.blocks.length}** blocks: ${f.data.blocks.map((f2) => f2.username).join(", ")}`);
      });
      break;
    case "add":
      if (!args2[1]) return bb.plugins.deafbot.send(`Whoa - you want to block yourself or something? Tell me who to block!`);
      axios.post("/worker/friends/block", { user: args2[1] }).then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error blocking user: **${f.data.reason}**. I guess they get mercy for now.`);
        else bb.plugins.deafbot.send(`Blocked **${args2[1]}**. You must be in a GREAT mood!`);
      });
      break;
    case "remove":
      if (!args2[1]) return bb.plugins.deafbot.send(`Tell me to remove, or keep hating people. I don't care.`);
      axios.post("/worker/friends/unblock", { user: args2[1] }).then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error removing block: **${f.data.reason}**. L them.`);
        else bb.plugins.deafbot.send(`You are no longer blocking **${args2[1]}**. How nice you must feel today!`);
      });
      break;
    case "check":
      if (!args2[1]) return bb.plugins.deafbot.send(`Specify a username to check.`);
      axios.get("/worker2/friends").then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error fetching blocks: **${f.data.reason}**`);
        else bb.plugins.deafbot.send(`**${args2[1]}** is **${f.data.blocks.map((a) => a.username).map((a) => a.toLowerCase()).includes(args2[1].toLowerCase()) ? "blocked" : "not blocked"}**.`);
      });
      break;
    default:
      bb.plugins.deafbot.send(`Subcommands: **list** ~ **add** ~ **remove** ~ **check**`);
      break;
  }
};
const blooks = async (...args2) => {
  if (!args2[0]) return bb.plugins.deafbot.send(`You have **${Object.keys(blacket.user.blooks).length}** unique blooks (**${Object.values(blacket.user.blooks).reduce((partialSum, a) => partialSum + a, 0)}** total), consisting of **${Object.keys(blacket.user.blooks).filter((b) => blacket.blooks[b].rarity === "Uncommon").length}** Uncommons, **${Object.keys(blacket.user.blooks).filter((b) => blacket.blooks[b].rarity === "Rare").length}** Rares, **${Object.keys(blacket.user.blooks).filter((b) => blacket.blooks[b].rarity === "Epic").length}** Epics, **${Object.keys(blacket.user.blooks).filter((b) => blacket.blooks[b].rarity === "Legendary").length}** Legendaries, **${Object.keys(blacket.user.blooks).filter((b) => blacket.blooks[b].rarity === "Chroma").length}** Chromas, and **${Object.keys(blacket.user.blooks).filter((b) => blacket.blooks[b].rarity === "Mystical").length}** Mysticals.`);
  if (args2[0] === "check" && args2[1]?.length) {
    let blook = blacket.blooks[args2.slice(1).join(" ")];
    if (!blook) return bb.plugins.deafbot.send(`No blook found for **${args2.slice(1).join(" ")}**. This is case-sensitive.`);
    if (blacket.user.blooks[args2.slice(1).join(" ")]) return bb.plugins.deafbot.send(`You have **${blacket.user.blooks[args2.slice(1).join(" ")]}x** ${args2.slice(1).join(" ")}.`);
    else return bb.plugins.deafbot.send(`You don't have **${args2.slice(1).join(" ")}**.`);
  }
  axios.get("/worker2/user/" + args2[0]).then((u) => {
    if (u.data.error) bb.plugins.deafbot.send(`Error fetching user ${args2[0]}: **${u.data.reason}**`);
    if (args2[1]) {
      let blook = blacket.blooks[args2.slice(1).join(" ")];
      if (!blook) return bb.plugins.deafbot.send(`No blook found for **${args2.slice(1).join(" ")}**. This is case-sensitive.`);
      if (u.data.user.blooks[args2.slice(1).join(" ")]) return bb.plugins.deafbot.send(`**${u.data.user.username}** has **${u.data.user.blooks[args2.slice(1).join(" ")]}x** ${args2.slice(1).join(" ")}.`);
      else return bb.plugins.deafbot.send(`**${u.data.user.username}** doesn't have **${args2.slice(1).join(" ")}**.`);
    }
    bb.plugins.deafbot.send(`**${u.data.user.username}** has **${Object.keys(u.data.user.blooks).length}** unique blooks (**${Object.values(u.data.user.blooks).reduce((partialSum, a) => partialSum + a, 0)}** total), consisting of **${Object.keys(u.data.user.blooks).filter((b) => blacket.blooks[b].rarity === "Uncommon").length}** Uncommons, **${Object.keys(u.data.user.blooks).filter((b) => blacket.blooks[b].rarity === "Rare").length}** Rares, **${Object.keys(u.data.user.blooks).filter((b) => blacket.blooks[b].rarity === "Epic").length}** Epics, **${Object.keys(u.data.user.blooks).filter((b) => blacket.blooks[b].rarity === "Legendary").length}** Legendaries, **${Object.keys(u.data.user.blooks).filter((b) => blacket.blooks[b].rarity === "Chroma").length}** Chromas, and **${Object.keys(u.data.user.blooks).filter((b) => blacket.blooks[b].rarity === "Mystical").length}** Mysticals.`);
  });
};
const booster = async () => {
  let b = await axios.get("/data/index.json");
  if (!b.data.booster.active) return bb.plugins.deafbot.send("There is no active booster.");
  let u = await axios.get("/worker2/user/" + b.data.booster.user);
  bb.plugins.deafbot.send(`<@${u.data.user.id}> (${u.data.user.username}) is boosting with a ${b.data.booster.multiplier}x booster until ${new Date(b.data.booster.time * 1e3).toLocaleTimeString().replaceAll("ΓÇ»", " ")}!`);
};
const cheapest = async (...args2) => {
  axios.get("/worker/bazaar?item=" + args2.join(" ")).then((b) => {
    if (b.data.error) return bb.plugins.deafbot.send(`Error fetching bazaar: **${b.data.reason}**`);
    let items = b.data.bazaar.filter((i) => i.item.toLowerCase() === args2.join(" ").toLowerCase());
    if (!items.length) return bb.plugins.deafbot.send(`No items found for **${args2.join(" ")}**.`);
    let cheapest2 = items.sort((a, b2) => a.price - b2.price)[0];
    bb.plugins.deafbot.send(`The cheapest listing for **${cheapest2.item}** costs **${cheapest2.price.toLocaleString()}** tokens & is sold by **${cheapest2.seller}**.`);
  });
};
const claim = async () => {
  let claim2 = await axios.get("/worker/claim");
  if (claim2.data.error) bb.plugins.deafbot.send(`Error: **${claim2.data.reason}**`);
  else bb.plugins.deafbot.send(`Claimed **${blacket.config.rewards[claim2.data.reward - 1]}** tokens!`);
};
const clan = async (...args2) => {
  if (!args2[0]) axios.get("/worker/clans").then((clan2) => {
    if (clan2.data.error) return bb.plugins.deafbot.send(`Error fetching your clan: **${clan2.data.reason}**`);
    let clanData = clan2.data.clan;
    bb.plugins.deafbot.send(`You are in the ${clanData.members.map((a) => a.username).includes("Death") ? "esteemed " : ""}**${clanData.name}** clan, owned by **${clanData.owner.username}**. You have **${clanData.members.length}** (**${clanData.online}** online) members, and **[REDACTED]** investments. The clan **${clanData.safe ? "is" : "is not"}** in safe mode.`);
  });
  else axios.get("/worker/clans/discover/name/" + args2.join(" ")).then((clan2) => {
    if (clan2.data.error) return bb.plugins.deafbot.send(`Error fetching clan: **${clan2.data.reason}**`);
    clan2 = clan2.data.clans[0];
    bb.plugins.deafbot.send(`The ${clan2.members.map((a) => a.username).includes("Death") ? "esteemed " : ""}**${clan2.name}** clan is owned by **${clan2.owner.username}**. They have **${clan2.members.length}** (**${clan2.online}** online) members, and **[REDACTED]** investments. The clan **${clan2.safe ? "is" : "is not"}** in safe mode.`);
  });
};
const color = async (...args2) => {
  if (!args2[0]) return bb.plugins.deafbot.send(`Choose a subcommand: **name** or **text**.`);
  if (args2[0].toLowerCase() === "name") axios.post("https://blacket.org/worker/settings/color", {
    color: `#${args2[1].replace("#", "")}`
  }).then((r) => {
    if (r.data.error) return bb.plugins.deafbot.send(`Error changing name color: **${r.data.reason}**`);
    bb.plugins.deafbot.send(`Name color was set to **#${args2[1].replace("#", "")}**!`);
  });
  if (args2[0].toLowerCase() === "text") {
    if (args2[1] === "gradient") {
      let formed = `${args2[1]}=[${args2[2]}: ${args2.slice(3).join(", ")}]`;
      localStorage.setItem("chatColor", formed);
      bb.plugins.deafbot.send(`Gradient was updated!`);
    } else {
      localStorage.setItem("chatColor", args2[1]);
      bb.plugins.deafbot.send(`Text color was set to **${args2[1]}**!`);
    }
  }
};
const $eval = async (...args) => {
  eval(`
        let send = (msg) => bb.plugins.deafbot.send(msg);
        ${args.join(" ")}
    `);
};
const friends = async (...args2) => {
  switch (args2[0]) {
    case "list":
      axios.get("/worker2/friends").then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error fetching friends: **${f.data.reason}**`);
        else bb.plugins.deafbot.send(`You have **${f.data.friends.length}** friends: ${f.data.friends.map((f2) => f2.username).join(", ")}`);
      });
      break;
    case "request":
      if (!args2[1]) return bb.plugins.deafbot.send(`Tell me who you actually want to request, you friendless fool.`);
      axios.post("/worker/friends/request", { user: args2[1] }).then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error friending: **${f.data.reason}** - ig you just don't want friends.`);
        else bb.plugins.deafbot.send(`Sent a friend request to **${args2[1]}**. How kind of you :3`);
      });
      break;
    case "accept":
      if (!args2[1]) return bb.plugins.deafbot.send(`Tell me who you actually want to accept, you friendless fool.`);
      axios.post("/worker/friends/accept", { user: args2[1] }).then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error accepting: **${f.data.reason}** - ig you just don't want friends.`);
        else bb.plugins.deafbot.send(`Accepted **${args2[1]}**'s friend request! How kind of you :3`);
      });
      break;
    case "remove":
      if (!args2[1]) return bb.plugins.deafbot.send(`So you want to KEEP all your bad friends? Tell me who to get rid of!`);
      axios.post("/worker/friends/remove", { user: args2[1] }).then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error removing: **${f.data.reason}** - L you. With them forever.`);
        else bb.plugins.deafbot.send(`You are no longer friended to **${args2[1]}**. How nice you must feel today!`);
      });
      break;
    case "check":
      if (!args2[1]) return bb.plugins.deafbot.send(`Specify a username to check.`);
      axios.get("/worker2/friends").then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error fetching friends: **${f.data.reason}**`);
        else bb.plugins.deafbot.send(`**${args2[1]}** **${f.data.friends.map((a) => a.username).map((a) => a.toLowerCase()).includes(args2[1].toLowerCase()) ? "is" : "isn't"}** your friend.`);
      });
      break;
    case "requests":
    case "incoming":
    case "pending":
    case "recieving":
      axios.get("/worker2/friends").then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error fetching friends: **${f.data.reason}**`);
        else bb.plugins.deafbot.send(`You have **${f.data.receiving.length}** incoming requests: ${f.data.receiving.map((f2) => f2.username).join(", ")}`);
      });
      break;
    case "requested":
    case "outgoing":
    case "sending":
      axios.get("/worker2/friends").then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error fetching friends: **${f.data.reason}**`);
        else bb.plugins.deafbot.send(`You have **${f.data.sending.length}** outgoing requests: ${f.data.sending.map((f2) => f2.username).join(", ")}`);
      });
      break;
    case "mutual":
      if (!args2[1]) return bb.plugins.deafbot.send(`Tell me who you want to check for mutual friends, fool.`);
      axios.get("/worker2/user/" + args2[1]).then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error: **${f.data.reason}**`);
        else bb.plugins.deafbot.send(`You and **${f.data.user.username}** have **${f.data.user.friends.length}** mutual friends: ${f.data.user.friends.map((f2) => blacket.friends.friends.find((fr) => fr.id === f2)).map((a) => a?.username).filter((a) => a).join(", ")}`);
      });
      break;
    case "count":
      axios.get("/worker2/friends").then((f) => {
        if (f.data.error) bb.plugins.deafbot.send(`Error fetching friends: **${f.data.reason}**`);
        else bb.plugins.deafbot.send(`You have **${f.data.friends.length}** friends.`);
      });
      break;
    default:
      bb.plugins.deafbot.send(`Subcommands: **list** ~ **request** ~ **accept** ~ **remove** ~ **check** ~ **mutual** ~ **requests** ~ **sending** ~ **count**`);
      break;
  }
};
const id = async (...args2) => {
  if (args2[0]) axios.get("/worker2/user/" + args2[0]).then((u) => {
    if (u.data.error) bb.plugins.deafbot.send(`Error: **${u.data.reason}**`);
    else bb.plugins.deafbot.send(`**${u.data.user.username}**'s ID: ${u.data.user.id}`);
  });
  else bb.plugins.deafbot.send(`Your ID: ${blacket.user.id}`);
};
const level = async (...args2) => {
  let calculate = (exp) => {
    let level2 = 0;
    let needed = 0;
    for (let i = 0; i <= 27915; i++) {
      needed = 5 * Math.pow(level2, blacket.config.exp.difficulty) * level2;
      if (exp >= needed) {
        exp -= needed;
        level2++;
      }
    }
    return { level: level2, needed, exp };
  };
  if (args2[0]) return axios.get("/worker2/user/" + args2[0]).then((u) => {
    if (u.data.error) return bb.plugins.deafbot.send(`Error fetching user ${args2[0]}: **${u.data.reason}**`);
    let levelData2 = calculate(u.data.user.exp);
    bb.plugins.deafbot.send(`**${u.data.user.username}** is level **${levelData2.level}**. They need **${Math.round(levelData2.needed).toLocaleString()} XP** to advance, and they're currently **${Math.round(levelData2.exp / levelData2.needed * 100)}%** complete.`);
  });
  let levelData = blacket.user.level && blacket.user.needed ? blacket.user : calculate(blacket.user.exp);
  bb.plugins.deafbot.send(`You are level **${levelData.level}**. You need **${Math.round(levelData.needed).toLocaleString()} XP** to advance, and you're currently **${Math.round(levelData.exp / levelData.needed * 100)}%** complete.`);
};
const tokens = async (...args2) => {
  if (args2[0]) axios.get("/worker2/user/" + args2[0]).then((u) => {
    if (u.data.error) bb.plugins.deafbot.send(`Error fetching user ${args2[0]}: **${u.data.reason}**`);
    else bb.plugins.deafbot.send(`**${u.data.user.username}** currently has **${u.data.user.tokens.toLocaleString()}** tokens.`);
  });
  else bb.plugins.deafbot.send(`You currently have **${blacket.user.tokens.toLocaleString()}** tokens.`);
};
const trade = async (...args2) => {
  if (!args2[0]) return bb.plugins.deafbot.send(`Who are you trying to trade, yourself?`);
  axios.get("/worker2/user/" + args2[0]).then((u) => {
    if (u.data.error) return bb.plugins.deafbot.send(`Error fetching user ${args2[0]}: **${u.data.reason}**`);
    axios.post("/worker/trades/requests/send", { user: u.data.user.id.toString() }).then((r) => {
      if (r.data.error) bb.plugins.deafbot.send(`Error sending trade request to ${u.data.user.username}: **${r.data.reason}**`);
      else bb.plugins.deafbot.send(`Sent a trade request to **${u.data.user.username}**.`);
    });
  });
};
const commands = {
  badges,
  blocks,
  blooks,
  booster,
  cheapest,
  claim,
  clan,
  color,
  eval: $eval,
  friends,
  id,
  level,
  tokens,
  trade
};
const index$e = () => createPlugin({
  name: "DeafBot",
  description: "the chatbot you know and love.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /blacket\.sendMessage =\ async \((.*?)\) => \{/,
          replace: `blacket.sendMessage = async (room, content, instantSend) => {
                        let rawContent = content.replace(/<(gradient=\\[(?:up|down|left|right|\\d{1,3}deg)(?: |):(?: |)(?:(?:(?:black|lime|white|brown|magenta|cyan|turquoise|red|orange|yellow|green|blue|purple|\\#[0-9a-fA-F]{6})(?:, |,| ,| , |)){2,7})\\]|black|lime|white|brown|magenta|cyan|turquoise|red|orange|yellow|green|blue|purple|(\\#[0-9a-fA-F]{6}))>(.+?)<\\/([^&]+?)>/g, (...args) => {
                            return args[3];
                        });
                        if (rawContent.startsWith(' ')) rawContent = rawContent.slice(1);

                        if (rawContent.startsWith(atob('JA==')) && !instantSend) {
                            let data = rawContent.split(' ');
                            let command = data[0].slice(1);
                            let args = data.slice(1);
                            console.log(\`Executed BB command "\${command}" with args\`, args);
                            if (!bb.plugins.deafbot.commands[command]) return bb.plugins.deafbot.send('Command not found.');
                            bb.plugins.deafbot.commands[command](...args);
                            return;
                        };
                    `
        }
      ]
    }
  ],
  onLoad: () => {
    bb.plugins.deafbot = {
      send: (msg) => {
        let prefix = "**$ sudo node deafbot.js** > > > ";
        blacket.sendMessage(blacket.chat.room, prefix + msg, true);
      },
      commands
    };
  }
});
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$e }, Symbol.toStringTag, { value: "Module" }));
const index$d = () => createPlugin({
  name: "Double Leaderboard",
  description: "see both leaderboards together.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/leaderboard.js",
      replacement: [
        {
          match: /div:nth-child\(4\) > div:nth-child\(1\)/,
          replace: "div:nth-child(3) > div:nth-child(2)"
        },
        {
          match: /\$\(".styles__containerHeaderRight___3xghM-camelCase"/,
          replace: `
                        document.querySelector('.styles__topStats___3qffP-camelCase').insertAdjacentHTML('afterend', \`<div class="styles__topStats___3qffP-camelCase" style="text-align: center;font-size: 2.604vw;margin-top: 0.521vw;display:block;"></div>\`);
                        document.querySelector('.styles__statsContainer___QnrRB-camelCase > div:nth-child(4)').remove();

                        $(".styles__containerHeaderRight___3xghM-camelCase"
                    `
        },
        {
          match: / \(\$\{data.me.exp.ex(.*?)">\)/,
          replace: ""
        },
        {
          match: / \(\$\{data.ex(.*?)">\)/,
          replace: ""
        }
      ]
    }
  ],
  onStart: () => {
    if (location.pathname.includes("leaderboard")) document.body.insertAdjacentHTML("beforeend", `<style>
            .styles__statsContainer___QnrRB-camelCase > div:nth-child(3) {
                display: flex;
                gap: 2vw;
                padding: 2vw 1.5vw;
            }

            .styles__topStats___3qffP-camelCase {
                font-size: 1.8vw !important;
            }

            .styles__containerHeaderRight___3xghM-camelCase {
                display: none;
            }
        </style>`);
  }
});
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$d }, Symbol.toStringTag, { value: "Module" }));
const index$c = () => createPlugin({
  name: "Extra Stats",
  description: "gives you extra stats for users.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/stats.js",
      replacement: [
        {
          match: /\$\("#messages"\)\.html\(`\$\{user\.misc\.messages\.toLocaleString\(\)\}`\);/,
          replace: `
                        $("#messages").html(user.misc.messages.toLocaleString());
                        $("#stat_id").html(user.id);
                        $("#stat_created").html(new Date(user.created * 1000).toLocaleString('en-US', {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit',
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        }));
                        $("#stat_lastonline").removeAttr('timestamped');
                        $("#stat_lastonline").text(\`<t:\${user.modified}:R>\`);
                    `
        }
      ]
    }
  ],
  onLoad: () => {
    if (location.pathname.startsWith("/stats")) document.querySelector(".styles__statsContainer___QnrRB-camelCase").insertAdjacentHTML("afterend", `
            <div class="styles__statsContainer___QnrRB-camelCase">
                <div class="styles__containerHeader___3xghM-camelCase">
                    <div class="styles__containerHeaderInside___2omQm-camelCase">Account</div>
                </div>
                <div class="styles__topStats___3qffP-camelCase">
                    <div class="styles__statContainer___QKuOF-camelCase" currentitem="false">
                        <div class="styles__statTitle___z4wSV-camelCase">ID</div>
                        <div id="stat_id" class="styles__statNum___5RYSd-camelCase">0</div>
                        <img loading="lazy" src="https://cdn-icons-png.flaticon.com/512/3596/3596097.png" class="styles__statImg___3DBXt-camelCase" draggable="false">
                    </div>
                    <div class="styles__statContainer___QKuOF-camelCase" currentitem="false">
                        <div class="styles__statTitle___z4wSV-camelCase">Created</div>
                        <div id="stat_created" class="styles__statNum___5RYSd-camelCase">0/0/0</div>
                        <img loading="lazy" src="https://cdn-icons-png.flaticon.com/512/4305/4305432.png" class="styles__statImg___3DBXt-camelCase" draggable="false">
                    </div>
                    <div class="styles__statContainer___QKuOF-camelCase" currentitem="false">
                        <div class="styles__statTitle___z4wSV-camelCase">Last Online</div>
                        <div id="stat_lastonline" class="styles__statNum___5RYSd-camelCase" style="font-size: 0.9vw;text-align:center;">0/0/0</div>
                        <img loading="lazy" src="https://cdn.discordapp.com/emojis/1102897525192663050.png?size=2048&quality=lossless" class="styles__statImg___3DBXt-camelCase" draggable="false">
                    </div>
                </div>
            </div>
        `);
  }
});
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$c }, Symbol.toStringTag, { value: "Module" }));
const index$b = () => createPlugin({
  name: "Highlight Rarity",
  description: "displays the rarity of Bazaar blooks.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/bazaar.js",
      replacement: [
        {
          match: /"\/content\/blooks\/Error\.png"\}" /,
          replace: `"/content/blooks/Error.png"}" style="filter: drop-shadow(0 0 7px \${blacket.rarities[blacket.blooks[blook].rarity].color});" `
        },
        {
          match: /class="styles__bazaarItemImage___KriA4-camelCase" /,
          replace: `class="styles__bazaarItemImage___KriA4-camelCase" \${blacket.blooks[listing.item] ? \`style="filter: drop-shadow(0 0 7px \${blacket.rarities[blacket.blooks[listing.item].rarity].color});"\` : ''} `
        }
      ]
    }
  ]
});
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$b }, Symbol.toStringTag, { value: "Module" }));
const index$a = () => createPlugin({
  name: "Internals",
  description: "the internals of BetterBlacket.",
  authors: [{ name: "Internal" }],
  required: true,
  patches: [
    {
      file: "/lib/js/home.js",
      replacement: [
        {
          match: /blacket\.stopLoading\(\);/,
          replace: "blacket.stopLoading();bb.events.dispatch('pageInit');"
        },
        {
          match: /if \(blacket\.config\)/,
          replace: "if (window?.blacket?.config)"
        }
      ]
    },
    {
      file: "/lib/js/auth.js",
      replacement: [
        {
          match: /blacket\.htmlEncode\s*=\s*\(\s*s\s*\)\s*=>\s*{/,
          replace: "bb.events.dispatch('pageInit');blacket.htmlEncode = (s) => {"
        },
        {
          match: /blacket\.config/,
          replace: "window?.blacket?.config"
        }
      ]
    },
    {
      file: "/lib/js/terms.js",
      replacement: [
        {
          match: /blacket\.stopLoading\(\);/,
          replace: "blacket.stopLoading();bb.events.dispatch('pageInit');"
        },
        {
          match: /blacket\.config/,
          replace: "window?.blacket?.config"
        }
      ]
    },
    {
      file: "/lib/js/stats.js",
      replacement: [
        {
          match: /blacket\.setUser\(blacket\.user\)\;/,
          replace: "blacket.setUser(blacket.user);bb.events.dispatch('pageInit');"
        },
        {
          match: /blacket\.user\s*&&\s*blacket\.friends/,
          replace: "window?.blacket?.user && window?.blacket?.friends"
        }
      ]
    },
    {
      file: "/lib/js/leaderboard.js",
      replacement: [
        {
          match: /blacket\.stopLoading\(\);/,
          replace: "blacket.stopLoading();bb.events.dispatch('pageInit');"
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        }
      ]
    },
    {
      file: "/lib/js/clans/my-clan.js",
      replacement: [
        {
          match: /\$\("#clanInvestmentsButton"\)\.click\(\(\) \=\> \{/,
          replace: `bb.events.dispatch('pageInit');$("#clanInvestmentsButton").click(() => {`
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        },
        {
          match: /item.user\).avatar/,
          replace: `item.user)?.avatar || '/content/blooks/Error.png'`
        }
      ]
    },
    {
      file: "/lib/js/clans/discover.js",
      replacement: [
        {
          match: /blacket\.stopLoading\(\)\;/,
          replace: "blacket.stopLoading();bb.events.dispatch('pageInit');"
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        }
      ]
    },
    {
      file: "/lib/js/market.js",
      replacement: [
        {
          match: /blacket\.showBuyItemModal =/,
          replace: "bb.events.dispatch('pageInit');blacket.showBuyItemModal ="
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        }
      ]
    },
    {
      file: "/lib/js/blooks.js",
      replacement: [
        {
          match: /blacket\.appendBlooks\(\)\;/,
          replace: "blacket.appendBlooks();bb.events.dispatch('pageInit');"
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        }
      ]
    },
    {
      file: "/lib/js/bazaar.js",
      replacement: [
        {
          match: /\}\);\s*blacket\.getBazaar\(\);/,
          replace: "});blacket.getBazaar();bb.events.dispatch('pageInit');"
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        }
      ]
    },
    {
      file: "/lib/js/inventory.js",
      replacement: [
        {
          match: /blacket\.stopLoading\(\);\s*\}\s*else\s*setTimeout\(reset,\s*1\);/,
          replace: "blacket.stopLoading();bb.events.dispatch('pageInit');} else setTimeout(reset, 1);"
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        }
      ]
    },
    {
      file: "/lib/js/settings.js",
      replacement: [
        {
          match: /\$\(\"#tradeRequestsButton\"\).click\(\(\) \=\> \{/,
          replace: `bb.events.dispatch('pageInit');$("#tradeRequestsButton").click(() => {`
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        }
      ]
    },
    {
      file: "/lib/js/store.js",
      replacement: [
        {
          match: /\$\("#buy1hBoosterButton"\)\.click\(\(\) => \{/,
          replace: `bb.events.dispatch('pageInit');$("#buy1hBoosterButton").click(() => {`
        },
        {
          match: /if \(blacket\.user\) \{/,
          replace: "if (window?.blacket?.user) {"
        }
      ]
    },
    {
      file: "/lib/js/credits.js",
      replacement: [
        {
          match: /blacket\.stopLoading\(\)\;/,
          replace: "blacket.stopLoading();bb.events.dispatch('pageInit');"
        },
        {
          match: /blacket\.config/,
          replace: "window?.blacket?.config"
        }
      ]
    },
    {
      file: "/lib/js/trade.js",
      replacement: [
        {
          match: /blacket\.appendBlooks\(\)\;/,
          replace: "blacket.appendBlooks();bb.events.dispatch('pageInit');"
        },
        {
          match: /blacket\.user\s*&&\s*blacket\.trade/,
          replace: "window?.blacket?.user && window?.blacket?.trade"
        }
      ]
    },
    {
      file: "/lib/js/all.js",
      replacement: [
        {
          match: /blacket\s*=\s*{/,
          replace: "window.blacket = {"
        },
        {
          match: /mutation\.type === "childList" \? replace/,
          replace: "false ? "
        }
      ]
    },
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /blacket\.config\s*&&\s*blacket\.socket/,
          replace: "window?.blacket?.config && window?.blacket?.socket"
        },
        {
          match: /data\.author\.badges = \[/,
          replace: `if (typeof data.author.badges !== 'object' && !data?.author?.badges?.length) data.author.badges = [`
        },
        {
          match: /data\.friends/,
          replace: `data.friends.filter(f => f.username !== '┬ú')`
        },
        {
          match: /forEach\(post \=\> \{/,
          replace: `forEach(post => {blacket.news[post].body=blacket.news[post].body.replace(/\\<iframe.*?iframe>/, '');`
        }
      ]
    },
    {
      file: "/lib/js/panel/home.js",
      replacement: [
        {
          match: /blacket\.user\)/,
          replace: "window.blacket?.user)"
        },
        {
          match: /Loading\(\)/,
          replace: `Loading();bb.events.dispatch('pageInit')`
        }
      ]
    },
    {
      file: "/lib/js/panel/console.js",
      replacement: [
        {
          match: /blacket\.user && blacket\.socket/,
          replace: `window.blacket?.user && window.blacket?.socket`
        },
        {
          match: /blacket\.socket\.on/,
          replace: `bb.events.dispatch('pageInit');blacket.socket.on`
        }
      ]
    },
    {
      file: "/lib/js/panel/blooks.js",
      replacement: [
        {
          match: /blacket\.config/,
          replace: "window?.blacket?.config"
        },
        {
          match: /\$\("#createButtonBlook"\)\.c/,
          replace: `bb.events.dispatch('pageInit');$("#createButtonBlook").c`
        }
      ]
    },
    {
      file: "/lib/js/panel/rarities.js",
      replacement: [
        {
          match: /blacket\.config && blacket\.user && blacket\.rarities/,
          replace: "window?.blacket?.config && window?.blacket?.user && window?.blacket?.rarities"
        },
        {
          match: /\$\("\#createButtonRarity"\)\.c/,
          replace: `bb.events.dispatch('pageInit');$("#createButtonRarity").c`
        }
      ]
    },
    {
      file: "/lib/js/panel/badges.js",
      replacement: [
        {
          match: /blacket\.config/,
          replace: "window?.blacket?.config"
        },
        {
          match: /blacket\.createBadge \=/,
          replace: `bb.events.dispatch('pageInit');blacket.createBadge = `
        }
      ]
    },
    {
      file: "/lib/js/panel/banners.js",
      replacement: [
        {
          match: /blacket\.config && blacket\.banners/,
          replace: "window?.blacket?.config && window?.blacket?.banners"
        },
        {
          match: /\$\("\#createButtonBanner"\)\.c/,
          replace: `bb.events.dispatch('pageInit');$("#createButtonBanner").c`
        }
      ]
    },
    {
      file: "/lib/js/panel/news.js",
      replacement: [
        {
          match: /blacket\.user && blacket\.news/,
          replace: "window?.blacket?.user && window?.blacket?.news"
        },
        {
          match: /localStorage/,
          replace: "bb.events.dispatch('pageInit');localStorage"
        }
      ]
    },
    {
      file: "/lib/js/panel/emojis.js",
      replacement: [
        {
          match: /blacket\.config/,
          replace: "window?.blacket?.config"
        },
        {
          match: /blacket.showEditModal =/,
          replace: "bb.events.dispatch('pageInit');blacket.showEditModal ="
        }
      ]
    },
    {
      file: "/lib/js/panel/users.js",
      replacement: [
        {
          match: /blacket\.user\) \{/,
          replace: "window?.blacket?.user) {"
        },
        {
          match: /blacket.setUser =/,
          replace: "bb.events.dispatch('pageInit');blacket.setUser ="
        }
      ]
    },
    {
      file: "/lib/js/panel/forms.js",
      replacement: [
        {
          match: /blacket.config/,
          replace: "window?.blacket?.config"
        },
        {
          match: /blacket.reject =/,
          replace: "bb.events.dispatch('pageInit');blacket.reject ="
        }
      ]
    }
  ],
  styles: `
        .bb_topLeftRow {
            position: absolute;
            top: 0;
            left: 11.5vw;
            display: flex;
            flex-direction: row;
            z-index: 14;
            margin: 0.5vw;
            gap: 0.5vw;
        }

        .bb_backButtonContainer {
            position: relative;
            cursor: pointer;
            outline: none;
            user-select: none;
            text-decoration: none;
            transition: filter 0.25s;
            margin-left: 0.521vw;
            margin: auto;
        }

        .bb_settingsContainer {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            margin: 0.260vw calc(5% - 0.625vw);
            width: calc(90% - 1.250vw);
            max-width: 62.500vw;
        }

        .bb_pluginContainer {
            border-radius: 0.365vw;
            background-color: #2f2f2f;
            padding: 0.781vw 1.042vw 1.146vw;
            box-shadow: inset 0 -0.365vw rgba(0, 0, 0, 0.2), 0 0 0.208vw rgba(0, 0, 0, 0.15);
            margin: 0.625vw;
            min-width: 23.958vw;
            display: flex;
            flex-direction: column;
            color: #ffffff;
            width: 27.5vw;
        }

        .bb_pluginHeader {
            display: flex;
            align-items: center;
            gap: 1vw;
        }

        .bb_pluginTitle {
            width: 100%;
        }

        .bb_pluginDescription {
            margin-top: 0.7vh;
            font-size: 2.3vh;
        }

        .switch {
            position: relative;
            display: inline-block;
            min-width: 30px;
            max-width: 30px;
            height: 17px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 13px;
            min-width: 13px;
            max-width: 13px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
            transform: translateX(13px);
        }

        .bb_requiredPluginSlider {
            background-color: #075c9f;
            cursor: not-allowed;
        }

        .bb_pluginIcon {
            cursor: pointer;
        }

        .bb_pluginAuthors {
            display: flex;
            justify-content: center;
            cursor: pointer;
            margin-top: 1vw;
            margin-right: 6px;
            font-weight: bold;
        }

        .bb_pluginAuthor {
            height: 22px;
            border-radius: 50%;
            margin-right: -6px;
            border: 2px solid #3f3f3f;
        }

        .bb_themeInfo {
            font-family: Nunito, sans-serif;
            line-height: 1.823vw;
            margin: 1.5vh 0 5px 0;
            color: #ffffff;
            font-size: 1.6vw;
        }

        .bb_themeHeader {
            font-family: Nunito, sans-serif;
            line-height: 1.823vw;
            margin: 3.5vw 0 5px 0;
            color: #ffffff;
            font-size: 2.75vw;
        }

        .bb_themeTextarea {
            min-height: 30vh;
            height: auto;
            width: 100%;
            background: #2f2f2f;
            border: 2px solid #1f1f1f;
            border-radius: 3px;
            color: white;
            padding: 10px;
            margin-top: 2.5vh;
            outline: none;
            resize: none;
        }

        .styles__container___1BPm9-camelCase {
            width: 25vw;
        }

        .bb_bigModal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50%;
            background-color: #3f3f3f;
            border-radius: 0.365vw;
            text-align: center;
            box-sizing: border-box;
            padding-bottom: 0.365vw;
            box-shadow: inset 0 -0.365vw rgba(0, 0, 0, 0.2), 0 0 0.208vw rgba(0, 0, 0, 0.15);
        }

        .bb_bigModalTitle {
            font-family: Nunito, sans-serif;
            font-size: 2.8vw;
            line-height: 1.823vw;
            font-weight: 700;
            margin: 2vw 1.563vw;
            color: #ffffff;
        }

        .bb_bigModalDescription {
            font-family: Nunito, sans-serif;
            line-height: 1.823vw;
            font-weight: 700;
            margin: -3px 0 5px 0;
            color: #ffffff;
            font-size: 1.6vw;
        }

        .bb_bigModalDivider {
            height: 1.5px;
            border-top: 1px solid var(--ss-white);
            border-radius: 10px;
            width: 90%;
            margin: 2vh 5%;
        }

        .bb_bigModalHeader {
            font-family: Nunito, sans-serif;
            font-size: 2vw;
            line-height: 1.823vw;
            font-weight: 700;
            margin: 1.8vw 1.3vw;
            color: #ffffff;
        }

        .bb_modalDescription {
            font-family: Nunito, sans-serif;
            line-height: 1.823vw;
            font-weight: 700;
            margin: -7px 0 5px 0;
            color: #ffffff;
            font-size: 1vw;
            padding: 0 1vw;
        }

        .bb_modalOuterInput {
            border: 0.156vw solid rgba(0, 0, 0, 0.17);
            border-radius: 0.313vw;
            width: 90%;
            height: 2.604vw;
            margin: 0.000vw;
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .bb_modalInput {
            border: none;
            height: 2.083vw;
            line-height: 2.083vw;
            font-size: 1.458vw;
            text-align: center;
            font-weight: 700;
            font-family: Nunito, sans-serif;
            color: #ffffff;
            background-color: #3f3f3f;
            outline: none;
            width: 100%;
        }

        .bb_pluginSettings {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 1vh;
        }

        .bb_pluginSetting {
            display: flex;
            align-items: center;
            gap: 1.5vw;
        }

        .bb_settingName {
            color: white;
            font-size: 1.8vw;
        }
    `,
  onStart: () => {
    let mods = {
      "BetterBlacket v2": () => !!(window.pr || window.addCSS),
      "Flybird": () => !!window.gold,
      "Themeify": () => !!document.querySelector("#themifyButton"),
      "Blacket++": () => !!(window.BPP || window.bpp)
    };
    if (Object.entries(mods).some((mod2) => mod2[1]() ? true : false)) return document.body.insertAdjacentHTML("beforeend", `
            <div class="arts__modal___VpEAD-camelCase" id="bigModal">
                <div class="bb_bigModal">
                    <div class="bb_bigModalTitle">External Mod Detected</div>
                    <div class="bb_bigModalDescription" style="padding-bottom: 1vw;">Our automated systems believe you are running the ${mod[0]} mod. We require that only BetterBlacket v3 is running. This prevents unneeded "IP abuse bans" from Blacket's systems.</div>
                </div>
            </div>
        `);
    if (!location.pathname.startsWith("/settings")) return;
    console.log("Internals started! Patching settings...");
    document.querySelector(".styles__mainContainer___4TLvi-camelCase").id = "settings-main";
    $(`
            <div class="styles__infoContainer___2uI-S-camelCase">
                <div class="styles__headerRow___1tdPa-camelCase">
                    <i class="fas fa-code styles__headerIcon___1ykdN-camelCase" aria-hidden="true"></i>
                    <div class="styles__infoHeader___1lsZY-camelCase">BetterBlacket</div>
                </div>
                <div><a id="pluginsButton" class="styles__link___5UR6_-camelCase">Manage Plugins</a></div>
                <div><a id="themesButton" class="styles__link___5UR6_-camelCase">Manage Themes</a></div>
                <div><a id="resetDataButton" class="styles__link___5UR6_-camelCase">Reset Data</a></div>
            </div>
        `).insertBefore($(".styles__infoContainer___2uI-S-camelCase")[0]);
    document.querySelector("#app > div > div").insertAdjacentHTML("beforeend", `
            <div class="bb_topLeftRow">
                <div class="bb_backButtonContainer" style="display: none;">
                    <div class="styles__shadow___3GMdH-camelCase"></div>
                    <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                    <div class="styles__front___vcvuy-camelCase styles__buttonInsideNoMinWidth___39vdp-camelCase" style="background-color: #2f2f2f;">
                        <i class="fas fa-reply" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        `);
    $("#resetDataButton").click(async () => {
      Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
      location.reload();
    });
    $("#pluginsButton").click(() => {
      document.querySelector("#settings-main").style.display = "none";
      document.querySelector("#plugins-main").style.display = "";
      document.querySelector(".styles__header___WE435-camelCase").innerHTML = "Settings | Plugins";
      document.querySelector(".styles__header___WE435-camelCase").style.textAlign = "center";
      document.querySelector(".bb_backButtonContainer").style.display = "";
    });
    $("#themesButton").click(() => {
      document.querySelector("#settings-main").style.display = "none";
      document.querySelector("#themes-main").style.display = "";
      document.querySelector(".styles__header___WE435-camelCase").innerHTML = "Settings | Themes";
      document.querySelector(".styles__header___WE435-camelCase").style.textAlign = "center";
      document.querySelector(".bb_backButtonContainer").style.display = "";
    });
    $(".bb_backButtonContainer").click(() => {
      document.querySelector("#settings-main").style.display = "";
      document.querySelector("#plugins-main").style.display = "none";
      document.querySelector("#themes-main").style.display = "none";
      document.querySelector(".styles__header___WE435-camelCase").innerHTML = "Settings";
      document.querySelector(".styles__header___WE435-camelCase").style.textAlign = "";
      document.querySelector(".bb_backButtonContainer").style.display = "none";
    });
    let activePlugins = bb.storage.get("bb_pluginData", true).active;
    let themeData = bb.storage.get("bb_themeData", true);
    $(".arts__profileBody___eNPbH-camelCase").append(`
            <div class="bb_settingsContainer" id="plugins-main" style="display: none;">
                ${bb.plugins.list.filter((p) => !p.required && !p.disabled).map((p) => `
                    <div class="bb_pluginContainer">
                        <div class="bb_pluginHeader">
                            <div class="bb_pluginTitle">${p.name}</div>
                            ${p.settings.length ? `<i id="bb_pluginIcon_${p.name.replaceAll(" ", "-")}" class="fas fa-gear bb_pluginIcon" aria-hidden="true"></i>` : `<i id="bb_pluginIcon_${p.name.replaceAll(" ", "-")}" class="far fa-circle-info bb_pluginIcon" aria-hidden="true"></i>`}
                            <label class="switch">
                                <input type="checkbox" ${activePlugins.includes(p.name) || p.required ? "checked" : ""} id="bb_pluginCheckbox_${p.name.replaceAll(" ", "-")}">
                                <span class="${p.required ? "slider bb_requiredPluginSlider" : "slider"}"></span>
                            </label>
                        </div>
                        <div class="bb_pluginDescription">${p.description}</div>
                    </div>
                `).join("")}
            </div>

            <div class="bb_settingsContainer" id="themes-main" style="display: none;">
                <div class="bb_themeInfo"><b>Paste CSS file links here.</b><br>    - Paste one link per line.<br>    - Use raw CSS files, like from "raw.githubusercontent.com" or "github.io".<br>    - Put "//" in front of a theme link to ignore it.</div>
                <textarea class="bb_themeTextarea">${themeData?.textarea ? themeData.textarea : "https://blacket.org/lib/css/all.css\nhttps://blacket.org/lib/css/game.css"}</textarea>
                <div class="bb_themeHeader">Theme Checker</div>
                <div class="bb_themeValidation">
                    ${bb.themes.list.map((t) => `<div class="bb_themeInfo" style="color: green;">${t.name} | ${t.url}</div>`).join("")}
                    ${bb.themes.broken.map((t) => `<div class="bb_themeInfo" style="color: red;">${t.url} - ${t.reason}</div>`).join("")}
                </div>
            </div>
        `);
    document.querySelector(".bb_themeTextarea").oninput = (ev) => {
      bb.storage.set("bb_themeData", {
        active: ev.target.value.split("\\n").filter((a) => !a.startsWith("//")),
        textarea: ev.target.value
      }, true);
      bb.themes.reload();
    };
    bb.events.listen("themeUpdate", () => {
      document.querySelector(".bb_themeValidation").innerHTML = `
                ${bb.themes.list.map((t) => `<div class="bb_themeInfo" style="color: green;">${t.name} | ${t.url}</div>`).join("")}
                ${bb.themes.broken.map((t) => `<div class="bb_themeInfo" style="color: red;">${t.url} - ${t.reason}</div>`).join("")}
            `;
    });
    let storedPluginData = bb.storage.get("bb_pluginData", true);
    bb.plugins.list.forEach((p) => {
      if (p.required || p.disabled) return;
      document.querySelector(`#bb_pluginCheckbox_${p.name.replaceAll(" ", "-")}`).onchange = (ev) => {
        if (p.required) return ev.target.checked = true;
        const inform = () => blacket.createToast({
          title: "Pending Changes",
          message: "You have changes in your plugins you have not applied. Reload to apply.",
          time: 5e3
        });
        inform();
        setInterval(() => inform(), 1e4);
        bb.plugins.pendingChanges = true;
        if (storedPluginData.active.includes(p.name)) storedPluginData.active.splice(storedPluginData.active.indexOf(p.name), 1);
        else storedPluginData.active.push(p.name);
        bb.storage.set("bb_pluginData", storedPluginData, true);
      };
      document.querySelector(`#bb_pluginIcon_${p.name.replaceAll(" ", "-")}`).onclick = () => {
        document.body.insertAdjacentHTML("beforeend", `
                    <div class="arts__modal___VpEAD-camelCase" id="bigModal">
                        <div class="bb_bigModal">
                            <div class="bb_bigModalTitle">${p.name}</div>
                            <div class="bb_bigModalDescription">${p.description}</div>
                            <div class="bb_pluginAuthors">${p.authors.map((a) => `<img src="${a.avatar}" onclick="window.open('${a.url}', '_blank')" class="bb_pluginAuthor" />`).join("")}</div>
                            <hr class="bb_bigModalDivider" />
                            <div class="bb_bigModalHeader">Settings</div>
                            ${p.settings.length ? `<div class="bb_pluginSettings">
                                ${p.settings.map((set) => `
                                    <div class="bb_pluginSetting">
                                        <div class="bb_settingName">${set.name}</div>
                                        <label class="switch">
                                            <input type="checkbox" ${typeof storedPluginData.settings?.[p.name]?.[set.name] === "boolean" ? storedPluginData.settings?.[p.name]?.[set.name] ? "checked" : "" : set.default ? "checked" : ""} id="bb_settingCheck_${p.name.replaceAll(" ", "-")}_${set.name.replaceAll(" ", "-")}">
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                `).join("")}
                            </div>` : `<div class="bb_modalDescription">This plugin has no settings.</div>`}
                            <hr class="bb_bigModalDivider" />
                            <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0" onclick="document.getElementById('bigModal').remove()" style="width: 30%;margin-bottom: 1.5vh;">
                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Close</div>
                            </div>
                        </div>
                    </div>
                `);
        p.settings.forEach((setting) => {
          document.querySelector(`#bb_settingCheck_${p.name.replaceAll(" ", "-")}_${setting.name.replaceAll(" ", "-")}`).onchange = (ev) => {
            if (!storedPluginData.settings) storedPluginData.settings = {};
            if (!storedPluginData.settings[p.name]) storedPluginData.settings[p.name] = {};
            storedPluginData.settings[p.name][setting.name] = ev.target.checked;
            bb.plugins.settings[p.name][setting.name] = ev.target.checked;
            bb.storage.set("bb_pluginData", storedPluginData, true);
          };
        });
      };
    });
  }
});
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$a }, Symbol.toStringTag, { value: "Module" }));
const index$9 = () => createPlugin({
  name: "Message Logger",
  description: "view deleted messages like a staff would.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  disabled: true,
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /blacket\.user\.perms\.includes\("delete_messages"\) \|\| blacket\.user\.perms\.includes\("\*"\)/,
          replace: "true"
        }
      ]
    }
  ]
});
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$9 }, Symbol.toStringTag, { value: "Module" }));
const index$8 = () => createPlugin({
  name: "No Chat Color",
  description: "disables color in chat.",
  authors: [{ name: "Syfe", avatar: "https://i.imgur.com/OKpOipQ.gif", url: "https://github.com/ItsSyfe" }],
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /\$\{data\.author\.color/,
          replace: `\${"#ffffff"`,
          setting: "No Username Colors"
        },
        {
          match: /\$\{blacket\.chat\.cached\.users\[id\]\.color/,
          replace: `\${"#ffffff"`,
          setting: "No Mention Colors"
        },
        {
          match: /\!data\.author\.permissions\.includes\("use_chat_colors"\)/,
          replace: `bb.plugins.settings['No Chat Color']?.['No Message Colors'] ?? true`,
          setting: "No Message Colors"
        },
        {
          match: /\$\{data\.author\.clan\.color\}/,
          replace: `\${"#ffffff"}`,
          setting: "No Clan Colors"
        }
      ]
    }
  ],
  settings: [
    { name: "No Username Colors", default: true },
    { name: "No Mention Colors", default: true },
    { name: "No Message Colors", default: true },
    { name: "No Clan Colors", default: true }
  ]
});
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$8 }, Symbol.toStringTag, { value: "Module" }));
const index$7 = () => createPlugin({
  name: "No Chat Ping",
  description: "prevents you from being pinged in chat.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /message\.message\.mentions\.includes\(\w+\.user\.id\.toString\(\)\)/,
          replace: "false"
        },
        {
          match: /data\.data\.message\.mentions\.includes\(blacket\.user\.id\.toString\(\)\)/,
          replace: "false"
        },
        {
          match: /\$\{mentioned/,
          replace: `\${bb.plugins.settings['No Chat Ping']?.['Keep Highlight'] && rawMessage.includes(blacket.user.id.toString()) || mentioned`
        }
      ]
    }
  ],
  settings: [
    {
      name: "Keep Highlight",
      default: false
    }
  ]
});
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$7 }, Symbol.toStringTag, { value: "Module" }));
const index$6 = () => createPlugin({
  name: "No Devtools Warning",
  description: "disables the warning in the console.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/all.js",
      replacement: [
        {
          match: /console\.log\(`%cWARNING!`, `font-size: 35px;`\);\s*console\.log\(`%cThis is a browser feature intended for developers\. If someone told you to copy and paste something here to enable a \${blacket\.config\.name} feature or "hack" someone else's account, it is most likely a scam and will give them access to your account\.`, `font-size: 20px;`\);\s*console\.log\(`%cIf you ignore this message and the script does work, PLEASE contact a \${blacket\.config\.name} developer immediately\.`, `font-size: 20px;`\);\s*/s,
          replace: ""
        }
      ]
    }
  ]
});
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$6 }, Symbol.toStringTag, { value: "Module" }));
const index$5 = () => createPlugin({
  name: "OldBadges",
  description: "reverts the first badge upgrade, returning many badges to the original state.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/all.js",
      replacement: [
        {
          match: /Object.assign/,
          replace: `data=$self.modify(data);Object.assign`
        }
      ]
    }
  ],
  modify: (data) => {
    let oldBadges = {
      Plus: "https://i.imgur.com/qu3WJQ6.png",
      Owner: "https://i.imgur.com/w5PV2jw.png",
      Artist: "https://i.imgur.com/2EGHbLG.png",
      "Legacy Ankh": "https://i.imgur.com/m0Vin3j.png",
      Booster: "https://i.imgur.com/7E20vLD.png",
      Verified: "https://i.imgur.com/RwlUTSe.png",
      "Verified Bot": "https://i.imgur.com/0eLB3Xz.png",
      Tester: "https://i.imgur.com/0K816Nj.png",
      Staff: "https://i.imgur.com/dmJ2lIB.png",
      OG: "https://i.imgur.com/kWNfORf.png",
      "Big Spender": "https://i.imgur.com/bpr9QoT.png"
    };
    if (bb.plugins.settings["OldBadges"]["Co-Owner to Owner"]) oldBadges["Co-Owner"] = oldBadges["Owner"];
    Object.entries(oldBadges).forEach(([badge, url]) => data.badges[badge].image = url);
    return data;
  },
  settings: [{
    name: "Co-Owner to Owner",
    default: false
  }]
});
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$5 }, Symbol.toStringTag, { value: "Module" }));
const index$4 = () => createPlugin({
  name: "Quick CSS",
  description: "edit CSS for the game and have it applied instantly.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  styles: `
        .bb_customCSSBox {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            min-width: 5vw;
            height: 2.865vw;
            border-bottom-left-radius: 0.521vw;
            border-bottom-right-radius: 0.521vw;
            box-sizing: border-box;
            box-shadow: inset 0 -0.417vw rgba(0, 0, 0, 0.2), 0 0 0.208vw rgba(0, 0, 0, 0.15);
            padding: 0 0.521vw 0.417vw;
            font-size: 1.042vw;
            color: white;
            background: #2f2f2f;
        }

        .bb_customCSSIcon {
            margin: -0.2vw 0 0 0;
            padding: 0;
            font-size: 1.5vw;
        }

        .bb_customCSSCorner {
            position: absolute;
            bottom: 1vw;
            right: 1vw;
            padding: 10px;
        }

        .bb_customCSSCornerIcon {
            font-size: 2.5vw;
        }

        .bb_customCSSTextarea {
            min-height: 30vh;
            height: 40vh;
            width: 80%;
            background: #2f2f2f;
            border: 2px solid #1f1f1f;
            border-radius: 3px;
            color: white;
            padding: 10px;
            margin-top: 2.5vh;
            outline: none;
            resize: none;
        }
    `,
  onStart: () => {
    let storage2 = bb.storage.get("bb_pluginData", true);
    if ([
      "stats",
      "leaderboard",
      "clans/discover",
      "market",
      "blooks",
      "bazaar",
      "inventory",
      "settings"
    ].some((path) => location.pathname.startsWith(`/${path}`))) {
      document.querySelector("#app > div > div > div").insertAdjacentHTML("afterbegin", `
                <div class="bb_customCSSBox">
                    <i class="bb_customCSSIcon fas fa-palette"></i>
                </div>
            `);
    } else if ([
      "trade",
      "store",
      "register",
      "login"
    ].some((path) => location.pathname.startsWith(`/${path}`))) {
      document.querySelector(".arts__body___3acI_-camelCase").insertAdjacentHTML("beforeend", `
                <div class='bb_customCSSCorner styles__button___1_E-G-camelCase' role='button' tabindex='0'>
                    <div class='styles__shadow___3GMdH-camelCase'></div>
                    <div class='styles__edge___3eWfq-camelCase' style='background-color: #2f2f2f;'></div>
                    <div class='styles__front___vcvuy-camelCase''>
                        <i class="bb_customCSSCornerIcon fas fa-palette"></i>
                    </div>
                </div>
            `);
    } else if (location.pathname.includes("my-clan")) {
      document.querySelector("#clanLeaveButton").insertAdjacentHTML("afterend", `
                <div class="bb_customCSSBox">
                    <i class="bb_customCSSIcon fas fa-palette"></i>
                </div>
            `);
    } else return;
    document.body.insertAdjacentHTML("beforeend", `<style id="bb_quickCSS">${storage2?.quickcss || ""}</style>`);
    (document.querySelector(".bb_customCSSBox") || document.querySelector(".bb_customCSSCorner") || document.querySelector(".bb_customCSSSmallBox")).onclick = () => {
      document.body.insertAdjacentHTML("beforeend", `
                <div class="arts__modal___VpEAD-camelCase" id="bigModal">
                    <div class="bb_bigModal">
                        <div class="bb_bigModalTitle">QuickCSS</div>
                        <div class="bb_bigModalDescription">Quickly modify the CSS of Blacket.</div>
                        <hr class="bb_bigModalDivider" />
                        <textarea class="bb_customCSSTextarea">${document.querySelector("#bb_quickCSS")?.innerHTML || ""}</textarea>
                        <hr class="bb_bigModalDivider" />
                        <div class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0" onclick="document.getElementById('bigModal').remove()" style="width: 30%;margin-bottom: 1.5vh;">
                            <div class="styles__shadow___3GMdH-camelCase"></div>
                            <div class="styles__edge___3eWfq-camelCase" style="background-color: #2f2f2f;"></div>
                            <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: #2f2f2f;">Close</div>
                        </div>
                    </div>
                </div>
            `);
      document.querySelector(".bb_customCSSTextarea").oninput = (e) => {
        document.querySelector("#bb_quickCSS").innerHTML = e.target.value;
        let storage3 = bb.storage.get("bb_pluginData", true);
        storage3.quickcss = e.target.value;
        bb.storage.set("bb_pluginData", storage3, true);
      };
    };
    (document.querySelector(".bb_customCSSBox") || document.querySelector(".bb_customCSSCorner") || document.querySelector(".bb_customCSSSmallBox")).oncontextmenu = (r) => {
      r.preventDefault();
      bb.themes.reload();
    };
  }
});
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$4 }, Symbol.toStringTag, { value: "Module" }));
const index$3 = () => createPlugin({
  name: "Real Total blooks",
  description: "displays the true number of total blooks on the stats page.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/stats.js",
      replacement: [
        {
          match: /maxBlooks\.toLocaleString\(\)/,
          replace: `Object.keys(blacket.blooks).length`
        }
      ]
    }
  ]
});
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$3 }, Symbol.toStringTag, { value: "Module" }));
const index$2 = () => createPlugin({
  name: "Staff Tags",
  description: "gives staff who speak in chat a special tag.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /\$\{badges\}/,
          replace: `\${badges} \${['Owner', 'Admin', 'Moderator', 'Helper'].includes(data.author.role) || bb.plugins.settings['Staff Tags']?.['Show Artists'] && data.author.role === 'Artist' || bb.plugins.settings['Staff Tags']?.['Show Testers'] && data.author.role === 'Tester' ? \`<span class="bb_roleTag">\${data.author.role}</span>\` : ''}`
        }
      ]
    }
  ],
  styles: `
        .bb_roleTag {
            margin-left: 0.208vw;
            background: #2f2f2f;
            padding: 1px 8px;
            border-radius: 10px;
            font-size: 1vw;
            color: white;
        }
    `,
  settings: [
    {
      name: "Show Testers",
      default: true
    },
    {
      name: "Show Artists",
      default: true
    }
  ]
});
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$2 }, Symbol.toStringTag, { value: "Module" }));
const index$1 = () => createPlugin({
  name: "Test Admin",
  description: "allows anyone to access the forced admin panel.",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /perm == "none"/,
          replace: `perm == "none" || page === "Panel"`
        }
      ]
    },
    {
      file: "/lib/js/panel/home.js",
      replacement: [
        {
          match: /\("\*"\)/,
          replace: `("*") || !blacket.panel.buttons[button].disabled`
        },
        {
          match: /"edit_presets"/,
          replace: `"edit_presets",disabled:true`
        },
        {
          match: /\/\*"/,
          replace: `"`
        },
        {
          match: /_packs"/,
          replace: `_packs",disabled:true`
        },
        {
          match: /_reports"/,
          replace: `_reports",disabled:true`
        },
        {
          match: /\},\*\//,
          replace: "},"
        }
      ]
    },
    {
      file: "/lib/js/panel/users.js",
      replacement: [
        {
          match: /let online/,
          replace: `
                        user.mute = { muted: Math.random() < 0.6 };
                        user.ban = { banned: Math.random() < 0.6 };
                        let online
                    `
        },
        {
          match: /\("ban_users"\)/,
          replace: `("ban_users") || true`
        }
      ]
    },
    {
      file: "/lib/js/panel/console.js",
      replacement: [
        {
          match: /\$\("\#commandInputBox"\).k/,
          replace: `
                        [
                            '[Blacket] Started!',
                            '[Blacket] Type "help" for commands.',
                            '[Blacket] Type "clear" to clear the console.',
                            '[Blacket] Type "exit" to exit the console.',
                            '[Blacket] Please note that this is populated data written by BetterBlacket',
                            '[Blacket] To disable these populations, turn off the TestAdmin plugin.'
                        ].forEach(p => blacket.appendConsoleLine(p));
                        $('#commandInputBox').k`
        }
      ]
    },
    {
      file: "/lib/js/panel/forms.js",
      replacement: [
        {
          match: /currentPage = 1/,
          replace: `currentPage = 0`
        },
        {
          match: /return blacket/,
          replace: `blacket`
        },
        {
          match: /maxPages = data\.pages/,
          replace: `maxPages = 5`
        },
        {
          match: /blacket\.currentPage = data\.page/,
          replace: `blacket.currentPage++`
        },
        {
          match: /data\.forms\.length/,
          replace: `Math.round(Math.random() * 20)`
        },
        {
          match: /data\.total/,
          replace: `Math.round(Math.random() * 70)`
        },
        {
          match: /data.forms/,
          replace: `
                        let createAge = () => Math.round(Math.random() * 3) + 13;
                        let createUsername = () => 'Username' + Math.round(Math.random() * 1000);
                        let discord = () => 'username' + Math.round(Math.random() * 1000);
                        let body = () => 'This body was generated by the Test Admin BetterBlacket Plugin. This is NOT a real form. If you are a staff, you can see real forms by disabling this plugin. '.repeat(Math.round(Math.random() * 3));

                        let createForm = () => ({
                            username: createUsername(),
                            age: createAge(),
                            discord: discord(),
                            body: body()
                        });

                        new Array(69).fill().map(() => createForm())`
        }
      ]
    }
  ]
});
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index$1 }, Symbol.toStringTag, { value: "Module" }));
const index = () => createPlugin({
  name: "Tokens Everywhere",
  description: "shows your token count on ALL pages!",
  authors: [{ name: "Death", avatar: "https://i.imgur.com/PrvNWub.png", url: "https://villainsrule.xyz" }],
  patches: [
    {
      file: "/lib/js/game.js",
      replacement: [
        {
          match: /\$\("#roomDropdownGlobal"\)/,
          replace: `$self.updateTokens();$("#roomDropdownGlobal")`
        }
      ]
    },
    {
      file: "/lib/js/blooks.js",
      replacement: [
        {
          match: /-= quantity;/,
          replace: `-= quantity;blacket.user.tokens += blacket.blooks[blacket.blooks.selected].price*quantity;$self.updateTokens();`
        }
      ]
    }
  ],
  updateTokens: () => $("#tokenBalance > div:nth-child(2)").html(blacket.user.tokens.toLocaleString()),
  onLoad: () => {
    if ([
      "leaderboard",
      "clans/discover",
      "blooks",
      "inventory",
      "settings"
    ].some((path) => location.pathname.startsWith(`/${path}`))) {
      document.querySelector(".styles__topRightRow___dQvxc-camelCase").insertAdjacentHTML("afterbegin", `
                <div id="tokenBalance" class="styles__tokenBalance___1FHgT-camelCase">
                    <img loading="lazy" src="/content/tokenIcon.webp" alt="Token" class="styles__tokenBalanceIcon___3MGhs-camelCase" draggable="false">
                    <div>tokens</div>
                </div>
            `);
    }
  }
});
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: index }, Symbol.toStringTag, { value: "Module" }));
const loadPlugins = async () => {
  console.log("Called loadPlugins()");
  let pluginData = storage.get("bb_pluginData", true);
  let contentLoaded = false;
  await Promise.all(Object.values(/* @__PURE__ */ Object.assign({ "../plugins/advancedopen/index.js": __vite_glob_0_0, "../plugins/aprilfools/index.js": __vite_glob_0_1, "../plugins/bazaarsniper/index.js": __vite_glob_0_2, "../plugins/betterchat/index.js": __vite_glob_0_3, "../plugins/betternotifications/index.js": __vite_glob_0_4, "../plugins/betterreplies/index.js": __vite_glob_0_5, "../plugins/blookutils/index.js": __vite_glob_0_6, "../plugins/deafbot/index.js": __vite_glob_0_7, "../plugins/doubleleaderboard/index.js": __vite_glob_0_8, "../plugins/extrastats/index.js": __vite_glob_0_9, "../plugins/highlightrarity/index.js": __vite_glob_0_10, "../plugins/internals/index.js": __vite_glob_0_11, "../plugins/messagelogger/index.js": __vite_glob_0_12, "../plugins/nochatcolor/index.js": __vite_glob_0_13, "../plugins/nochatping/index.js": __vite_glob_0_14, "../plugins/nodevtoolswarn/index.js": __vite_glob_0_15, "../plugins/oldbadges/index.js": __vite_glob_0_16, "../plugins/quickcss/index.js": __vite_glob_0_17, "../plugins/realtotalblooks/index.js": __vite_glob_0_18, "../plugins/stafftags/index.js": __vite_glob_0_19, "../plugins/testadmin/index.js": __vite_glob_0_20, "../plugins/tokenseverywhere/index.js": __vite_glob_0_21 })).map(async (pluginFile) => {
    let plugin = pluginFile.default();
    bb.plugins.list.push(plugin);
    if (!!plugin.styles) bb.plugins.styles[plugin.name] = plugin.styles;
  }));
  bb.plugins.active = [...pluginData.active, ...bb.plugins.list.filter((p) => p.required).map((p) => p.name)];
  bb.plugins.settings = pluginData.settings;
  console.log(`Detected readyState ${document.readyState}. Running onLoad listeners...`);
  document.addEventListener("DOMContentLoaded", () => {
    if (contentLoaded) return;
    contentLoaded = true;
    bb.plugins.list.forEach((plugin) => {
      if (pluginData.active.includes(plugin.name) || plugin.required) plugin.onLoad?.();
    });
  });
  if (document.readyState !== "loading" && !contentLoaded) {
    contentLoaded = true;
    bb.plugins.list.forEach((plugin) => {
      if (pluginData.active.includes(plugin.name) || plugin.required) plugin.onLoad?.();
    });
  }
  events.listen("pageInit", () => {
    console.log(`Plugins got pageInit. Starting plugins...`);
    bb.plugins.list.forEach((plugin) => {
      if (pluginData.active.includes(plugin.name) || plugin.required) plugin.onStart?.();
    });
  });
  bb.plugins.list.forEach((plugin) => {
    if (pluginData.active.includes(plugin.name) || plugin.required) plugin.patches.forEach((patch) => bb.patches.push({
      ...patch,
      plugin: plugin.name
    }));
    if (!bb.plugins.settings[plugin.name]) bb.plugins.settings[plugin.name] = {};
    plugin.settings.forEach((setting) => {
      if (!bb.plugins.settings[plugin.name][setting.name]) bb.plugins.settings[plugin.name][setting.name] = setting.default;
    });
  });
  console.log("Done with loadPlugins(), running Patcher.patch()...");
  patcher.patch();
};
patcher.start();
if (!storage.get("bb_pluginData")) storage.set("bb_pluginData", { active: [], settings: {} }, true);
if (!storage.get("bb_themeData")) storage.set("bb_themeData", { active: [] }, true);
window.bb = {
  axios,
  events,
  Modal,
  storage,
  plugins: {
    list: [],
    settings: {},
    styles: {},
    pendingChanges: false
  },
  themes: {
    list: [],
    broken: [],
    reload: () => loadThemes(true)
  },
  patches: []
};
console.log('Defined global "bb" variable:', bb);
setTimeout(() => loadThemes(), 0);
setTimeout(() => loadPlugins(), 0);

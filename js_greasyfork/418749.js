// ==UserScript==
// @name                    Response Proxy
// @namespace               daief
// @version                 0.0.1
// @description             一款代理请求（包括 XMLHttpRequest 和 fetch）响应结果的油猴脚本，即 mock 请求的响应。
// @author                  daief
// @email                   defeng_mail@163.com
// @match                   *://*/*
// @homepage                https://github.com/daief/gm-response-proxy
// @homepageURL             https://github.com/daief/gm-response-proxy
// @supportURL              https://github.com/daief/gm-response-proxy/issues
// @run-at                  document-start
// @connect                 cdn.jsdelivr.net
// @require                 https://cdn.jsdelivr.net/npm/vue@3.0.0/dist/vue.global.js
// @grant                   unsafeWindow
// @grant                   GM_setValue
// @grant                   GM_getValue
// @grant                   GM_log
// @downloadURL https://update.greasyfork.org/scripts/418749/Response%20Proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/418749/Response%20Proxy.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 261:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(898);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 798:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(799),
    isArguments = __webpack_require__(206),
    isArray = __webpack_require__(515),
    isBuffer = __webpack_require__(391),
    isIndex = __webpack_require__(640),
    isTypedArray = __webpack_require__(781);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ 511:
/***/ ((module) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ 322:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(261),
    getRawTag = __webpack_require__(49),
    objectToString = __webpack_require__(70);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 807:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(322),
    isObjectLike = __webpack_require__(446);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ 180:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(322),
    isLength = __webpack_require__(235),
    isObjectLike = __webpack_require__(446);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ 503:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(157),
    nativeKeys = __webpack_require__(83);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ 799:
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ 498:
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ 761:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayMap = __webpack_require__(511);

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;


/***/ }),

/***/ 476:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ 49:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(261);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 640:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ 157:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ 83:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(703);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ 700:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(476);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ 70:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 703:
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ 898:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(476);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 213:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(336),
    now = __webpack_require__(205),
    toNumber = __webpack_require__(598);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),

/***/ 206:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(807),
    isObjectLike = __webpack_require__(446);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ 515:
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 750:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(183),
    isLength = __webpack_require__(235);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ 391:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(898),
    stubFalse = __webpack_require__(372);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ 183:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(322),
    isObject = __webpack_require__(336);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ 235:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ 336:
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 446:
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 735:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(322),
    isObjectLike = __webpack_require__(446);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 781:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(180),
    baseUnary = __webpack_require__(498),
    nodeUtil = __webpack_require__(700);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ 615:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(798),
    baseKeys = __webpack_require__(503),
    isArrayLike = __webpack_require__(750);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ 205:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(898);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),

/***/ 372:
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ 598:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(336),
    isSymbol = __webpack_require__(735);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ 319:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseValues = __webpack_require__(761),
    keys = __webpack_require__(615);

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;


/***/ }),

/***/ 424:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);
/* harmony import */ var _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".gm-rp__root[data-v-3204fa8a] {\n  overflow: hidden auto;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  outline: none;\n  position: fixed;\n  z-index: 1000;\n  background-color: rgba(0, 0, 0, 0.65);\n}\n.gm-rp__root--ctrl-type-wrap[data-v-3204fa8a] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 40px;\n}\n.gm-rp__root--container[data-v-3204fa8a] {\n  position: absolute;\n  left: 50%;\n  box-sizing: border-box;\n  pointer-events: auto;\n  top: 40%;\n  transform: translate(-50%, -40%);\n  background: #fff;\n  border-radius: 4px;\n  box-shadow: 0 0 24px 0 rgba(102, 102, 102, 0.08);\n  height: 640px;\n  max-height: 100%;\n  max-width: 100%;\n  width: 720px;\n  overflow-y: auto;\n}\n.gm-rp__root--set-wrap[data-v-3204fa8a] {\n  border: #36cfc9 1px solid;\n  border-radius: 4px;\n  margin: 15px 30px;\n  padding: 16px;\n  position: relative;\n}\n.gm-rp__root--set-del[data-v-3204fa8a] {\n  position: absolute;\n  top: -12px;\n  right: -12px;\n}\n.gm-rp__root--set-domain-input[data-v-3204fa8a] {\n  width: 300px;\n  margin-right: 10px;\n}\n.gm-rp__root--set-domain-head[data-v-3204fa8a] {\n  height: 40px;\n  display: flex;\n  align-items: center;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 551:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);
/* harmony import */ var _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".gm-rp__button[data-v-535fafc8] {\n  appearance: none;\n  text-transform: none;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  white-space: nowrap;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n  user-select: none;\n  touch-action: manipulation;\n  height: 32px;\n  padding: 0 15px;\n  font-size: 14px;\n  border-radius: 2px;\n  border: 1px solid #d9d9d9;\n  outline: 0;\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);\n  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);\n}\n.gm-rp__button--primary[data-v-535fafc8] {\n  background-color: #13c2c2;\n  border-color: #13c2c2;\n}\n.gm-rp__button--primary[data-v-535fafc8]:hover {\n  background-color: #36cfc9;\n  border-color: #36cfc9;\n}\n.gm-rp__button--primary[data-v-535fafc8]:active {\n  background-color: #00474f;\n  border-color: #00474f;\n}\n.gm-rp__button--secondary[data-v-535fafc8] {\n  color: rgba(0, 0, 0, 0.65);\n  background-color: #fff;\n  border-color: #bfbfbf;\n}\n.gm-rp__button--secondary[data-v-535fafc8]:hover {\n  border-color: #36cfc9;\n  color: #36cfc9;\n}\n.gm-rp__button--secondary[data-v-535fafc8]:active {\n  border-color: #006d75;\n  color: #006d75;\n}\n.gm-rp__button--size-default[data-v-535fafc8] {\n  min-width: 32px;\n}\n.gm-rp__button--size-small[data-v-535fafc8] {\n  height: 24px;\n  min-width: 24px;\n  padding: 0 12px;\n}\n.gm-rp__button--shape-circle[data-v-535fafc8] {\n  border-radius: 50%;\n  padding: 0;\n}\n.gm-rp__button--shape-round[data-v-535fafc8] {\n  border-radius: 32px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 935:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);
/* harmony import */ var _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _yarn_$$virtual_css_loader_virtual_cfb3398efa_5_yarn_berry_cache_css_loader_npm_5_0_1_d2034d30e0_7_zip_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "[class*='gm-rp__'] {\n  font-size: 14px;\n  font-family: Penrose, 'PingFang SC', 'Hiragino Sans GB', Tahoma, Arial, 'Lantinghei SC', 'Microsoft YaHei', '\\5FAE软雅黑', sans-serif;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  font-feature-settings: 'tnum';\n  font-weight: 400;\n}\n.gm-rp__page-root-fixed-button {\n  position: fixed;\n  top: 148px;\n  left: 0;\n  width: 40px;\n  height: 40px;\n  z-index: 4000;\n  cursor: pointer;\n  opacity: 0.5;\n  transition: opacity 0.3s;\n  box-shadow: 0 0 10px 0px rgb(0 0 0 / 35%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-color: #b5f5ec;\n  color: rgba(0, 0, 0, 0.65);\n}\n.gm-rp__page-root-fixed-button:hover {\n  opacity: 1;\n}\n.gm-rp__page-root-fixed-button.hidden {\n  opacity: 0;\n  pointer-events: none;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 173:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 123:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
(() => {
"use strict";

;// CONCATENATED MODULE: ./src/common/ctx.ts
const vmCtx = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

;// CONCATENATED MODULE: ./src/common/utils.ts

function safeParse(str) {
    try {
        return JSON.parse(str);
    }
    catch (error) {
        return str;
    }
}
function isPromise(obj) {
    return (!!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function');
}
function uuid4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function isMatchUrl(matchRule, url) {
    if (/^\/.*\/$/.test(matchRule)) {
        return new RegExp(matchRule, 'ig').test(url);
    }
    return url.includes(matchRule);
}
function findPageOriginList(deep = 3) {
    const result = [];
    result.push(vmCtx.location.origin);
    function walkIn(doc, lvl = 1) {
        if (lvl >= deep || !doc) {
            return;
        }
        doc.querySelectorAll('iframe').forEach(ife => {
            if ((ife === null || ife === void 0 ? void 0 : ife.src) && /^http/i.test(ife.src)) {
                result.push(ife.src);
            }
            walkIn(ife.contentDocument, lvl + 1);
        });
    }
    walkIn(document, 1);
    return [...new Set(result)];
}

;// CONCATENATED MODULE: ./src/common/index.ts



const cache = new WeakMap();
const NAMESPACE = vmCtx.location.origin;
const PREFIX = 'gm-rp';
function ns(c = '') {
    return `${PREFIX}__${c}`;
}

// EXTERNAL MODULE: ../../../../.yarn/berry/cache/lodash-npm-4.17.20-c0db62021c-7.zip/node_modules/lodash/values.js
var values = __webpack_require__(319);
var values_default = /*#__PURE__*/__webpack_require__.n(values);
// EXTERNAL MODULE: ../../../../.yarn/berry/cache/lodash-npm-4.17.20-c0db62021c-7.zip/node_modules/lodash/debounce.js
var debounce = __webpack_require__(213);
var debounce_default = /*#__PURE__*/__webpack_require__.n(debounce);
;// CONCATENATED MODULE: ./src/data/index.ts



// const _key = (k: string) => `${NAMESPACE}_${k}`;
const KEY_SET = 'all_set';
const Store = {
    NAMESPACE: NAMESPACE,
    getStoreObject() {
        return GM_getValue(KEY_SET) || {};
    },
    getSetList() {
        let res = values_default()(Store.getStoreObject());
        res = Array.isArray(res) ? res : [];
        return res;
    },
    getMatchedSetList() {
        const origins = findPageOriginList();
        return Store.getSetList().filter(it => origins.some(origin => isMatchUrl(it.domainTest, origin)));
    },
    findCurrentSet() {
        const ruleSet = Store.getSetList().find(it => new RegExp(it.domainTest, 'ig').test(NAMESPACE)) || {
            id: uuid4(),
            domainTest: NAMESPACE,
            rules: [],
        };
        return ruleSet;
    },
    updateSetList: debounce_default()((input) => {
        const store = Store.getStoreObject();
        input.forEach(it => {
            const target = store[it.id];
            store[it.id] = target ? Object.assign(target, it) : it;
        });
        GM_setValue(KEY_SET, store);
    }, 2000),
    deleteSetList(ids) {
        const store = Store.getStoreObject();
        ids.forEach(id => {
            delete store[id];
        });
        GM_setValue(KEY_SET, store);
    },
};

;// CONCATENATED MODULE: ./src/proxy/fetch.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function proxyRes(response) {
    const ruleSet = Store.findCurrentSet();
    const matchedRule = ruleSet.rules.find(it => isMatchUrl(it.apiTest, response.url));
    return matchedRule === null || matchedRule === void 0 ? void 0 : matchedRule.response;
}
function log({ method, url, status, response }) {
    GM_log(`❗️ [fetch] Response is proxyed:\n`);
    (console.table || GM_log)({
        method,
        url,
        status,
        'proxyed response': response,
    });
}
if (typeof Response !== 'undefined') {
    const nativeFetch = vmCtx.fetch;
    const nativeJson = Response.prototype.json;
    const nativeText = Response.prototype.text;
    Response.prototype.json = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeRes = yield nativeJson.apply(this, args);
            const payload = cache.get(this);
            if (payload === null || payload === void 0 ? void 0 : payload.proxyedResponse) {
                log({
                    method: payload.method,
                    url: this.url,
                    status: this.status,
                    response: payload.proxyedResponse,
                });
                return JSON.parse(payload.proxyedResponse);
            }
            return nativeRes;
        });
    };
    Response.prototype.text = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeRes = yield nativeText.apply(this, args);
            const payload = cache.get(this);
            if (payload === null || payload === void 0 ? void 0 : payload.proxyedResponse) {
                log({
                    method: payload.method,
                    url: this.url,
                    status: this.status,
                    response: payload.proxyedResponse,
                });
                return payload.proxyedResponse;
            }
            return nativeRes;
        });
    };
    vmCtx.fetch = function (input, init, ...rest) {
        return __awaiter(this, void 0, void 0, function* () {
            let method = 'GET';
            if (input instanceof Request) {
                method = input.method;
            }
            else {
                method = (init === null || init === void 0 ? void 0 : init.method) || method;
            }
            const res = yield nativeFetch.apply(this, [input, init, ...rest]);
            const proxyedResponse = proxyRes(res);
            cache.set(res, {
                method,
                url: res.url,
                proxyedResponse,
            });
            return res;
        });
    };
}

;// CONCATENATED MODULE: ./src/proxy/xhr.ts
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _mockResponse, _url, _method, _a;


const NativeXMLHttpRequest = vmCtx.XMLHttpRequest;
vmCtx.XMLHttpRequest = (_a = class extends (NativeXMLHttpRequest) {
        constructor() {
            super();
            _mockResponse.set(this, void 0);
            _url.set(this, void 0);
            _method.set(this, void 0);
            this.addEventListener('readystatechange', () => {
                if (this.readyState !== 4)
                    return;
                const ruleSet = Store.findCurrentSet();
                const matchedRule = ruleSet.rules.find(it => isMatchUrl(it.apiTest, __classPrivateFieldGet(this, _url)));
                if (!(matchedRule === null || matchedRule === void 0 ? void 0 : matchedRule.response)) {
                    return;
                }
                __classPrivateFieldSet(this, _mockResponse, matchedRule.response);
                GM_log(`❗️ [XHR] Response is proxyed:\n`);
                (console.table || GM_log)({
                    method: __classPrivateFieldGet(this, _method),
                    url: __classPrivateFieldGet(this, _url),
                    status: this.status,
                    'proxyed response': __classPrivateFieldGet(this, _mockResponse),
                });
            });
        }
        get response() {
            return __classPrivateFieldGet(this, _mockResponse) || super.response;
        }
        get responseText() {
            return __classPrivateFieldGet(this, _mockResponse) || super.responseText;
        }
        open(method, url, ...rest) {
            __classPrivateFieldSet(this, _method, method);
            __classPrivateFieldSet(this, _url, url);
            if (/^(https?:\/\/)|(\/\/)/.test(url)) {
                __classPrivateFieldSet(this, _url, url);
            }
            else {
                __classPrivateFieldSet(this, _url, `${location.origin}/${url.replace(/^\//, '')}`);
            }
            // @ts-ignore
            return super.open(method, url, ...rest);
        }
    },
    _mockResponse = new WeakMap(),
    _url = new WeakMap(),
    _method = new WeakMap(),
    _a);

// EXTERNAL MODULE: ./.yarn/$$virtual/style-loader-virtual-9cffe23b25/5/.yarn/berry/cache/style-loader-npm-2.0.0-b9a5c4a2aa-7.zip/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(123);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./.yarn/$$virtual/css-loader-virtual-cfb3398efa/5/.yarn/berry/cache/css-loader-npm-5.0.1-d2034d30e0-7.zip/node_modules/css-loader/dist/cjs.js!./.yarn/$$virtual/less-loader-virtual-ecae940d78/5/.yarn/berry/cache/less-loader-npm-7.1.0-515a1e35fe-7.zip/node_modules/less-loader/dist/cjs.js??clonedRuleSet-2.use[2]!./src/global.less
var global = __webpack_require__(935);
;// CONCATENATED MODULE: ./src/global.less

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = injectStylesIntoStyleTag_default()(global/* default */.Z, options);



/* harmony default export */ const src_global = (global/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: external "Vue"
const external_Vue_namespaceObject = Vue;
;// CONCATENATED MODULE: ../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./src/Setting/Root.vue?vue&type=template&id=3204fa8a&scoped=true

const _withId = /*#__PURE__*/(0,external_Vue_namespaceObject.withScopeId)("data-v-3204fa8a")

;(0,external_Vue_namespaceObject.pushScopeId)("data-v-3204fa8a")
const _hoisted_1 = /*#__PURE__*/(0,external_Vue_namespaceObject.createTextVNode)(" + 新增规则集合 ")
const _hoisted_2 = /*#__PURE__*/(0,external_Vue_namespaceObject.createTextVNode)(" X ")
const _hoisted_3 = /*#__PURE__*/(0,external_Vue_namespaceObject.createVNode)("label", null, "域名匹配规则：", -1)
const _hoisted_4 = /*#__PURE__*/(0,external_Vue_namespaceObject.createTextVNode)(" 添加 Api 规则 ")
const _hoisted_5 = /*#__PURE__*/(0,external_Vue_namespaceObject.createVNode)("hr", null, null, -1)
const _hoisted_6 = /*#__PURE__*/(0,external_Vue_namespaceObject.createTextVNode)(" X ")
const _hoisted_7 = /*#__PURE__*/(0,external_Vue_namespaceObject.createTextVNode)(" Api 匹配规则： ")
const _hoisted_8 = /*#__PURE__*/(0,external_Vue_namespaceObject.createVNode)("br", null, null, -1)
const _hoisted_9 = /*#__PURE__*/(0,external_Vue_namespaceObject.createTextVNode)(" Mock Response（仅 JSON）： ")
const _hoisted_10 = /*#__PURE__*/(0,external_Vue_namespaceObject.createVNode)("br", null, null, -1)
;(0,external_Vue_namespaceObject.popScopeId)()

const render = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_Button = (0,external_Vue_namespaceObject.resolveComponent)("Button")

  return (0,external_Vue_namespaceObject.withDirectives)(((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createBlock)("div", {
    class: _ctx.cls,
    onClick: _cache[1] || (_cache[1] = (0,external_Vue_namespaceObject.withModifiers)((...args) => (_ctx.close && _ctx.close(...args)), ["self"]))
  }, [
    (0,external_Vue_namespaceObject.createVNode)("div", {
      class: `${_ctx.cls}--container`
    }, [
      (0,external_Vue_namespaceObject.createVNode)("div", {
        class: `${_ctx.cls}--ctrl-type-wrap`
      }, [
        ((0,external_Vue_namespaceObject.openBlock)(true), (0,external_Vue_namespaceObject.createBlock)(external_Vue_namespaceObject.Fragment, null, (0,external_Vue_namespaceObject.renderList)(_ctx.ctrlList, (item, index) => {
          return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createBlock)(_component_Button, {
            key: index,
            onClick: $event => (_ctx.showType = item[0]),
            type: _ctx.showType === item[0] ? 'primary' : 'secondary',
            style: {"width":"120px"}
          }, {
            default: _withId(() => [
              (0,external_Vue_namespaceObject.createTextVNode)((0,external_Vue_namespaceObject.toDisplayString)(item[1]) + " " + (0,external_Vue_namespaceObject.toDisplayString)(_ctx.showType === item[0] ? _ctx.state.matchedSetList.length : ''), 1)
            ]),
            _: 2
          }, 1032, ["onClick", "type"]))
        }), 128))
      ], 2),
      (0,external_Vue_namespaceObject.createVNode)(_component_Button, {
        type: "primary",
        onClick: _ctx.handleAddSet,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
        }
      }, {
        default: _withId(() => [
          _hoisted_1
        ]),
        _: 1
      }, 8, ["onClick"]),
      ((0,external_Vue_namespaceObject.openBlock)(true), (0,external_Vue_namespaceObject.createBlock)(external_Vue_namespaceObject.Fragment, null, (0,external_Vue_namespaceObject.renderList)(_ctx.state.matchedSetList, (it, idx) => {
        return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createBlock)("div", {
          key: it.id,
          class: `${_ctx.cls}--set-wrap`
        }, [
          (0,external_Vue_namespaceObject.createVNode)(_component_Button, {
            class: `${_ctx.cls}--set-del`,
            size: "small",
            shape: "circle",
            onClick: $event => (_ctx.handleDelSet(it, _ctx.i))
          }, {
            default: _withId(() => [
              _hoisted_2
            ]),
            _: 2
          }, 1032, ["class", "onClick"]),
          (0,external_Vue_namespaceObject.createVNode)("div", {
            class: `${_ctx.cls}--set-domain-head`
          }, [
            _hoisted_3,
            (0,external_Vue_namespaceObject.withDirectives)((0,external_Vue_namespaceObject.createVNode)("input", {
              "onUpdate:modelValue": $event => (it.domainTest = $event),
              class: `${_ctx.cls}--set-domain-input`,
              placeholder: "请输入"
            }, null, 10, ["onUpdate:modelValue"]), [
              [external_Vue_namespaceObject.vModelText, it.domainTest]
            ]),
            (0,external_Vue_namespaceObject.createVNode)(_component_Button, {
              type: "primary",
              onClick: () => _ctx.handleAddRule(idx),
              size: "small"
            }, {
              default: _withId(() => [
                _hoisted_4
              ]),
              _: 2
            }, 1032, ["onClick"])
          ], 2),
          _hoisted_5,
          ((0,external_Vue_namespaceObject.openBlock)(true), (0,external_Vue_namespaceObject.createBlock)(external_Vue_namespaceObject.Fragment, null, (0,external_Vue_namespaceObject.renderList)(it.rules, (rule, idx2) => {
            return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createBlock)("div", {
              key: rule.id,
              style: {"padding":"0 10px","margin":"10px 0"}
            }, [
              (0,external_Vue_namespaceObject.createVNode)("div", null, [
                (0,external_Vue_namespaceObject.createVNode)("label", null, [
                  (0,external_Vue_namespaceObject.createTextVNode)(" Rule " + (0,external_Vue_namespaceObject.toDisplayString)(idx2 + 1) + " ---- ", 1),
                  (0,external_Vue_namespaceObject.createVNode)(_component_Button, {
                    class: `${_ctx.cls}--set-del-rule`,
                    size: "small",
                    shape: "circle",
                    onClick: $event => (_ctx.handleDelRule(rule, idx, idx2))
                  }, {
                    default: _withId(() => [
                      _hoisted_6
                    ]),
                    _: 2
                  }, 1032, ["class", "onClick"])
                ]),
                (0,external_Vue_namespaceObject.createVNode)("div", null, [
                  _hoisted_7,
                  _hoisted_8,
                  (0,external_Vue_namespaceObject.withDirectives)((0,external_Vue_namespaceObject.createVNode)("input", {
                    "onUpdate:modelValue": $event => (rule.apiTest = $event),
                    style: {"width":"100%","padding":"8px"},
                    placeholder: "请输入"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [external_Vue_namespaceObject.vModelText, rule.apiTest]
                  ])
                ]),
                (0,external_Vue_namespaceObject.createVNode)("div", null, [
                  _hoisted_9,
                  _hoisted_10,
                  (0,external_Vue_namespaceObject.withDirectives)((0,external_Vue_namespaceObject.createVNode)("textarea", {
                    "onUpdate:modelValue": $event => (rule.response = $event),
                    placeholder: "请输入",
                    rows: "6",
                    style: {"width":"100%","max-width":"100%","padding":"8px","resize":"vertical"}
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [external_Vue_namespaceObject.vModelText, rule.response]
                  ])
                ])
              ])
            ]))
          }), 128))
        ], 2))
      }), 128))
    ], 2)
  ], 2)), [
    [external_Vue_namespaceObject.vShow, _ctx.show]
  ])
})
;// CONCATENATED MODULE: ./src/Setting/Root.vue?vue&type=template&id=3204fa8a&scoped=true

;// CONCATENATED MODULE: ../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./src/compts/Button.vue?vue&type=template&id=535fafc8&scoped=true

const Buttonvue_type_template_id_535fafc8_scoped_true_withId = /*#__PURE__*/(0,external_Vue_namespaceObject.withScopeId)("data-v-535fafc8")

const Buttonvue_type_template_id_535fafc8_scoped_true_render = /*#__PURE__*/Buttonvue_type_template_id_535fafc8_scoped_true_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createBlock)("button", {
    class: [
      _ctx.cls,
      `${_ctx.cls}--${_ctx.type}`,
      `${_ctx.cls}--size-${_ctx.size}`,
      `${_ctx.cls}--shape-${_ctx.shape}`,
    ],
    onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.handleClick && _ctx.handleClick(...args)))
  }, [
    (0,external_Vue_namespaceObject.renderSlot)(_ctx.$slots, "default")
  ], 2))
})
;// CONCATENATED MODULE: ./src/compts/Button.vue?vue&type=template&id=535fafc8&scoped=true

;// CONCATENATED MODULE: ./.yarn/$$virtual/ts-loader-virtual-bae4e07acc/5/.yarn/berry/cache/ts-loader-npm-8.0.11-a6f1286fbd-7.zip/node_modules/ts-loader/index.js??clonedRuleSet-1.use!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./src/compts/Button.vue?vue&type=script&lang=ts
var Buttonvue_type_script_lang_ts_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


/* harmony default export */ const Buttonvue_type_script_lang_ts = ((0,external_Vue_namespaceObject.defineComponent)({
    name: 'RPButton',
    props: {
        type: {
            type: String,
            default: 'secondary',
        },
        size: {
            type: String,
            default: 'default',
        },
        shape: {
            type: String,
            default: 'default',
        },
        onClick: {
            type: Function,
            default: () => null,
        },
    },
    setup(props, _ctx) {
        const innerLoading = (0,external_Vue_namespaceObject.ref)(false);
        const handleClick = (e) => Buttonvue_type_script_lang_ts_awaiter(this, void 0, void 0, function* () {
            // ctx.emit('click', e);
            if (innerLoading.value)
                return;
            try {
                innerLoading.value = true;
                yield props.onClick(e); // ? 能触发 @click
            }
            catch (_) {
            }
            finally {
                innerLoading.value = false;
            }
        });
        return {
            cls: ns('button'),
            handleClick,
        };
    },
}));

;// CONCATENATED MODULE: ./src/compts/Button.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./.yarn/$$virtual/css-loader-virtual-cfb3398efa/5/.yarn/berry/cache/css-loader-npm-5.0.1-d2034d30e0-7.zip/node_modules/css-loader/dist/cjs.js!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/stylePostLoader.js!./.yarn/$$virtual/less-loader-virtual-ecae940d78/5/.yarn/berry/cache/less-loader-npm-7.1.0-515a1e35fe-7.zip/node_modules/less-loader/dist/cjs.js??clonedRuleSet-2.use[2]!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./src/compts/Button.vue?vue&type=style&index=0&id=535fafc8&scoped=true&lang=less
var Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less = __webpack_require__(551);
;// CONCATENATED MODULE: ./.yarn/$$virtual/style-loader-virtual-9cffe23b25/5/.yarn/berry/cache/style-loader-npm-2.0.0-b9a5c4a2aa-7.zip/node_modules/style-loader/dist/cjs.js!./.yarn/$$virtual/css-loader-virtual-cfb3398efa/5/.yarn/berry/cache/css-loader-npm-5.0.1-d2034d30e0-7.zip/node_modules/css-loader/dist/cjs.js!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/stylePostLoader.js!./.yarn/$$virtual/less-loader-virtual-ecae940d78/5/.yarn/berry/cache/less-loader-npm-7.1.0-515a1e35fe-7.zip/node_modules/less-loader/dist/cjs.js??clonedRuleSet-2.use[2]!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./src/compts/Button.vue?vue&type=style&index=0&id=535fafc8&scoped=true&lang=less

            

var Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less_options = {};

Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less_options.insert = "head";
Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less_options.singleton = false;

var Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less_update = injectStylesIntoStyleTag_default()(Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less/* default */.Z, Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less_options);



/* harmony default export */ const compts_Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less = (Buttonvue_type_style_index_0_id_535fafc8_scoped_true_lang_less/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./src/compts/Button.vue?vue&type=style&index=0&id=535fafc8&scoped=true&lang=less

;// CONCATENATED MODULE: ./src/compts/Button.vue




;
Buttonvue_type_script_lang_ts.render = Buttonvue_type_template_id_535fafc8_scoped_true_render
Buttonvue_type_script_lang_ts.__scopeId = "data-v-535fafc8"

/* harmony default export */ const Button = (Buttonvue_type_script_lang_ts);
;// CONCATENATED MODULE: ./.yarn/$$virtual/ts-loader-virtual-bae4e07acc/5/.yarn/berry/cache/ts-loader-npm-8.0.11-a6f1286fbd-7.zip/node_modules/ts-loader/index.js??clonedRuleSet-1.use!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./src/Setting/Root.vue?vue&type=script&lang=ts




/* harmony default export */ const Rootvue_type_script_lang_ts = ((0,external_Vue_namespaceObject.defineComponent)({
    components: { Button: Button },
    setup() {
        const state = (0,external_Vue_namespaceObject.reactive)({
            matchedSetList: [],
        });
        const show = (0,external_Vue_namespaceObject.ref)(false);
        const showType = (0,external_Vue_namespaceObject.ref)('CURRENT');
        const isAll = (0,external_Vue_namespaceObject.computed)(() => showType.value === 'ALL');
        (0,external_Vue_namespaceObject.watch)(() => state.matchedSetList, () => {
            Store.updateSetList(state.matchedSetList);
        }, { deep: true });
        (0,external_Vue_namespaceObject.watch)(isAll, () => {
            state.matchedSetList = isAll.value
                ? Store.getSetList()
                : Store.getMatchedSetList();
        }, { immediate: true });
        return {
            cls: ns('root'),
            state,
            show,
            showType,
            isAll,
            ctrlList: [
                ['CURRENT', '当前匹配'],
                ['ALL', '所有规则'],
            ],
            open: () => {
                show.value = true;
            },
            close: () => {
                show.value = false;
            },
            handleAddSet: () => {
                state.matchedSetList.unshift({
                    domainTest: location.hostname,
                    rules: [],
                    id: uuid4(),
                });
            },
            handleAddRule: (i) => {
                state.matchedSetList[i].rules.push({
                    id: uuid4(),
                    apiTest: '',
                    response: '',
                    disabled: false,
                });
            },
            handleDelSet: (item) => {
                if (confirm('是否删除该集合，包括其下所有 Api 配置？')) {
                    Store.deleteSetList([item.id]);
                    state.matchedSetList = state.matchedSetList.filter(it => it !== item);
                }
            },
            handleDelRule: (item, setIdx, _ruleIdx) => {
                state.matchedSetList[setIdx].rules = state.matchedSetList[setIdx].rules.filter(it => it !== item);
            },
        };
    },
}));

;// CONCATENATED MODULE: ./src/Setting/Root.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./.yarn/$$virtual/css-loader-virtual-cfb3398efa/5/.yarn/berry/cache/css-loader-npm-5.0.1-d2034d30e0-7.zip/node_modules/css-loader/dist/cjs.js!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/stylePostLoader.js!./.yarn/$$virtual/less-loader-virtual-ecae940d78/5/.yarn/berry/cache/less-loader-npm-7.1.0-515a1e35fe-7.zip/node_modules/less-loader/dist/cjs.js??clonedRuleSet-2.use[2]!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./src/Setting/Root.vue?vue&type=style&index=0&id=3204fa8a&scoped=true&lang=less
var Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less = __webpack_require__(424);
;// CONCATENATED MODULE: ./.yarn/$$virtual/style-loader-virtual-9cffe23b25/5/.yarn/berry/cache/style-loader-npm-2.0.0-b9a5c4a2aa-7.zip/node_modules/style-loader/dist/cjs.js!./.yarn/$$virtual/css-loader-virtual-cfb3398efa/5/.yarn/berry/cache/css-loader-npm-5.0.1-d2034d30e0-7.zip/node_modules/css-loader/dist/cjs.js!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/stylePostLoader.js!./.yarn/$$virtual/less-loader-virtual-ecae940d78/5/.yarn/berry/cache/less-loader-npm-7.1.0-515a1e35fe-7.zip/node_modules/less-loader/dist/cjs.js??clonedRuleSet-2.use[2]!../../../../.yarn/berry/cache/vue-loader-npm-16.0.0-8cfe737dff-7.zip/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./src/Setting/Root.vue?vue&type=style&index=0&id=3204fa8a&scoped=true&lang=less

            

var Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less_options = {};

Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less_options.insert = "head";
Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less_options.singleton = false;

var Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less_update = injectStylesIntoStyleTag_default()(Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less/* default */.Z, Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less_options);



/* harmony default export */ const Setting_Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less = (Rootvue_type_style_index_0_id_3204fa8a_scoped_true_lang_less/* default.locals */.Z.locals || {});
;// CONCATENATED MODULE: ./src/Setting/Root.vue?vue&type=style&index=0&id=3204fa8a&scoped=true&lang=less

;// CONCATENATED MODULE: ./src/Setting/Root.vue




;
Rootvue_type_script_lang_ts.render = render
Rootvue_type_script_lang_ts.__scopeId = "data-v-3204fa8a"

/* harmony default export */ const Root = (Rootvue_type_script_lang_ts);
;// CONCATENATED MODULE: ./src/Setting/index.ts


function Setting_render(el) {
    const vm = (0,external_Vue_namespaceObject.createApp)(Root);
    const $root = vm.mount(el);
    return {
        $root,
        open: () => {
            return $root.open();
        },
        close: () => {
            return $root.close();
        },
    };
}

;// CONCATENATED MODULE: ./src/index.ts
var src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





// const lazeloadModules = (): Promise<{ Vue: typeof import('vue') }> => {
//   return new Promise((resolve, reject) => {
//     GM_xmlhttpRequest({
//       url: '',
//       onload: e => {
//         if (e.status !== 200) {
//           reject(e);
//           return;
//         }
//         try {
//           const Vue = new Function(`${e.responseText}; return Vue;`)();
//           resolve({ Vue });
//         } catch (error) {
//           reject(error);
//         }
//       },
//       onerror: reject,
//     });
//   });
// };
function bootstrap() {
    if (vmCtx.top !== vmCtx) {
        // 只在顶层页面展示操作
        return;
    }
    let handler;
    let isDrag = false;
    let isMove = false;
    let tX = 0;
    let tY = 0;
    let elRect = null;
    const el = document.createElement('div');
    el.innerText = 'o_O||';
    el.className = 'gm-rp__page-root-fixed-button';
    function onClickEl(_e) {
        if (isMove) {
            return;
        }
        if (!handler) {
            handler = Setting_render(elForMount);
            handler.$root.$watch('show', (newVal) => {
                el.classList[newVal ? 'add' : 'remove']('hidden');
            });
        }
        handler.open();
    }
    el.addEventListener('mousedown', e => {
        isDrag = true;
        isMove = false;
        elRect = el.getBoundingClientRect();
        tX = e.clientX - elRect.left;
        tY = e.clientY - elRect.top;
    });
    vmCtx.addEventListener('mouseup', (e) => src_awaiter(this, void 0, void 0, function* () {
        isDrag = false;
        if (isMove) {
            isMove = false;
            return;
        }
        // mock click event
        if (e.target === el) {
            yield onClickEl(e);
        }
    }));
    vmCtx.addEventListener('mousemove', e => {
        isMove = true;
        if (!isDrag) {
            return;
        }
        e.preventDefault();
        let left = e.clientX - tX;
        left = Math.min(left, vmCtx.innerWidth - elRect.width);
        left = Math.max(left, 0);
        let top = e.clientY - tY;
        top = Math.min(top, vmCtx.innerHeight - elRect.height);
        top = Math.max(top, 0);
        el.style.left = left + 'px';
        el.style.top = top + 'px';
    });
    const elForMount = document.createElement('div');
    document.body.appendChild(el);
    document.body.appendChild(elForMount);
}
if (document.readyState === 'loading') {
    vmCtx.addEventListener('DOMContentLoaded', () => {
        bootstrap();
    });
}
else {
    bootstrap();
}

})();

/******/ })()
;
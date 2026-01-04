// ==UserScript==
// @name         修复copymanga图片错误
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/copymanga
// @version      1.7.0
// @license      MIT
// @description  处理图片资源加载失败时自动重新加载
// @author       IronKinoko
// @match        https://www.mangacopy.com/*
// @match        https://www.2025copy.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.mangacopy.com
// @grant        GM_xmlhttpRequest
// @connect      userscripts-proxy.vercel.app
// @noframes
// @require      https://unpkg.com/jquery@3.6.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430447/%E4%BF%AE%E5%A4%8Dcopymanga%E5%9B%BE%E7%89%87%E9%94%99%E8%AF%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/430447/%E4%BF%AE%E5%A4%8Dcopymanga%E5%9B%BE%E7%89%87%E9%94%99%E8%AF%AF.meta.js
// ==/UserScript==
(function () {
  'use strict';

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$4.toString;

  /** Built-in value references. */
  var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto$3.toString;

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

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

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

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

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
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

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

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /* Built-in method references that are verified to be native. */
  var nativeCreate = getNative(Object, 'create');

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? undefined : result;
    }
    return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /* Built-in method references that are verified to be native. */
  var Map = getNative(root, 'Map');

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Error message constants. */
  var FUNC_ERROR_TEXT$2 = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT$2);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = MapCache;

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

  /** Error message constants. */
  var FUNC_ERROR_TEXT$1 = 'Expected a function';

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
      throw new TypeError(FUNC_ERROR_TEXT$1);
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

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a throttled function that only invokes `func` at most once per
   * every `wait` milliseconds. The throttled function comes with a `cancel`
   * method to cancel delayed `func` invocations and a `flush` method to
   * immediately invoke them. Provide `options` to indicate whether `func`
   * should be invoked on the leading and/or trailing edge of the `wait`
   * timeout. The `func` is invoked with the last arguments provided to the
   * throttled function. Subsequent calls to the throttled function return the
   * result of the last `func` invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the throttled function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.throttle` and `_.debounce`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to throttle.
   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=true]
   *  Specify invoking on the leading edge of the timeout.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * // Avoid excessively updating the position while scrolling.
   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
   *
   * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
   * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
   * jQuery(element).on('click', throttled);
   *
   * // Cancel the trailing throttled invocation.
   * jQuery(window).on('popstate', throttled.cancel);
   */
  function throttle(func, wait, options) {
    var leading = true,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
      leading = 'leading' in options ? !!options.leading : leading;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
      'leading': leading,
      'maxWait': wait,
      'trailing': trailing
    });
  }

  function sleep(ms) {
    if (!ms) {
      return new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
    }
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function wait(selector) {
    let bool = await selector();
    while (!bool) {
      await sleep();
      bool = await selector();
    }
  }

  function createStorage(storage) {
    function getItem(key, defaultValue) {
      try {
        const value = storage.getItem(key);
        if (value)
          return JSON.parse(value);
        return defaultValue;
      } catch (error) {
        return defaultValue;
      }
    }
    return {
      getItem,
      setItem(key, value) {
        storage.setItem(key, JSON.stringify(value));
      },
      removeItem: storage.removeItem.bind(storage),
      clear: storage.clear.bind(storage)
    };
  }
  createStorage(window.sessionStorage);
  const local = createStorage(window.localStorage);

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function request(opts) {
    let _a = opts, { url, method = "GET", params, responseType = "json" } = _a, rest = __objRest(_a, ["url", "method", "params", "responseType"]);
    if (params) {
      let u = new URL(url);
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== void 0 && value !== null) {
          u.searchParams.set(key, params[key]);
        }
      });
      url = u.toString();
    }
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest(__spreadProps(__spreadValues({
        url,
        method,
        responseType
      }, rest), {
        onload: (res) => {
          console.log(res);
          resolve(res);
        },
        onerror: reject
      }));
    });
  }
  let gm = {};
  try {
    gm.setItem = GM_setValue;
    gm.getItem = GM_getValue;
  } catch (error) {
    gm.setItem = local.setItem;
    gm.getItem = local.getItem;
  }
  gm.request = request;

  function normalizeKeyEvent(e) {
    const SPECIAL_KEY_EN = "`-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?".split("");
    const SPECIAL_KEY_ZH = "\xB7-=\u3010\u3011\u3001\uFF1B\u2018\uFF0C\u3002/\uFF5E\uFF01@#\xA5%\u2026&*\uFF08\uFF09\u2014+\u300C\u300D\uFF5C\uFF1A\u201C\u300A\u300B\uFF1F".split("");
    let key = e.key;
    if (e.code === "Space") {
      key = "Space";
    }
    if (/^[a-z]$/.test(key)) {
      key = key.toUpperCase();
    } else if (SPECIAL_KEY_ZH.includes(key)) {
      key = SPECIAL_KEY_EN[SPECIAL_KEY_ZH.indexOf(key)];
    }
    let keyArr = [];
    e.ctrlKey && keyArr.push("ctrl");
    e.metaKey && keyArr.push("meta");
    e.shiftKey && !SPECIAL_KEY_EN.includes(key) && keyArr.push("shift");
    e.altKey && keyArr.push("alt");
    if (!/Control|Meta|Shift|Alt/i.test(key))
      keyArr.push(key);
    keyArr = [...new Set(keyArr)];
    return keyArr.join("+");
  }
  function keybind(keys, keydown, keyup) {
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    keys = keys.filter((key) => !key.includes(isMac ? "ctrl" : "meta"));
    function createProcess(callback) {
      return function(e) {
        var _a;
        if (((_a = document.activeElement) == null ? void 0 : _a.tagName) === "INPUT")
          return;
        const normalizedKey = normalizeKeyEvent(e).toLowerCase();
        for (const key of keys) {
          if (key.toLowerCase() === normalizedKey)
            callback(e, key);
        }
      };
    }
    window.addEventListener("keydown", createProcess(keydown));
    if (keyup)
      window.addEventListener("keyup", createProcess(keyup));
  }

  async function waitDOM(selector, root = document) {
    await wait(() => !!root.querySelector(selector));
    return root.querySelector(selector);
  }

  function matcher(source, regexp) {
    if (typeof regexp === "string")
      return source.includes(regexp);
    return !!source.match(regexp);
  }
  function router(config) {
    const opts = {
      domain: "",
      routes: []
    };
    if ("routes" in config) {
      opts.domain = config.domain;
      opts.routes = config.routes;
    } else {
      opts.routes = Array.isArray(config) ? config : [config];
    }
    if (opts.domain) {
      const domains = Array.isArray(opts.domain) ? opts.domain : [opts.domain];
      const match = domains.some(
        (domain) => matcher(window.location.origin, domain)
      );
      if (!match)
        return;
    }
    const pathSource = window.location.pathname + window.location.search + window.location.hash;
    if (typeof opts.routes === "function") {
      opts.routes();
      return;
    }
    const routes = Array.isArray(opts.routes) ? opts.routes : [opts.routes];
    const runRoutes = routes.filter((route) => {
      let match = true;
      if (route.path) {
        match = matcher(pathSource, route.path);
      }
      if (route.pathname) {
        match = matcher(window.location.pathname, route.pathname);
      }
      if (route.search) {
        match = matcher(window.location.search, route.search);
      }
      if (route.hash) {
        match = matcher(window.location.hash, route.hash);
      }
      return match;
    });
    runRoutes.forEach((route) => {
      if (route.setup)
        route.setup();
    });
    function run() {
      runRoutes.forEach((route) => {
        if (route.run)
          route.run();
      });
    }
    if (window.document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run);
    }
  }

  function execInUnsafeWindow(fn) {
    return new Promise((resolve, reject) => {
      const contextId = Math.random().toFixed(16).slice(2);
      window.addEventListener("message", function listener(e) {
        if (e.data && e.data.contextId === contextId) {
          const data = e.data.data;
          resolve(data);
          window.removeEventListener("message", listener);
          script.remove();
        }
      });
      const code = `
    ;(async function runInUnsafeWindow() {
      const data = await (${fn.toString()})()
      window.postMessage({ contextId: '${contextId}', data }, '*')
    })()
    `;
      const script = document.createElement("script");
      script.textContent = code;
      document.body.appendChild(script);
    });
  }

  function addErrorListener(img) {
    if (img.dataset.errorFix === "true")
      return;
    img.dataset.errorFix = "true";
    img.onerror = () => {
      const url = new URL(img.src);
      let v = parseInt(url.searchParams.get("v")) || 0;
      if (v > 5)
        return img.onerror = null;
      url.searchParams.set("v", ++v + "");
      img.src = url.toString();
      img.alt = "\u56FE\u7247\u52A0\u8F7D\u51FA\u9519";
    };
  }
  function h5URLToPC(href) {
    const url = new URL(href);
    const re = new RegExp("\\/h5\\/comicContent\\/(?<comicId>.*?)\\/(?<chapterId>.*)");
    const match = url.pathname.match(re);
    if (match) {
      const { comicId, chapterId } = match.groups;
      return `https://userscripts-proxy.vercel.app/api/copymanga/comic/${comicId}/chapter/${chapterId}`;
    }
    return null;
  }
  const getChapterInfoFromURL = memoize(async (url) => {
    const res = await gm.request({ url });
    return res.response;
  });
  async function getChapterInfo() {
    const url = h5URLToPC(window.location.href);
    if (!url)
      throw new Error("\u8BF7\u5728\u79FB\u52A8\u7AEF\u8FD0\u884C");
    try {
      const data = await getChapterInfoFromURL(url);
      if (!data.ok)
        throw new Error(data.message);
      if (data.next) {
        const { comicId, chapterId } = data.next;
        const url2 = `https://userscripts-proxy.vercel.app/api/copymanga/comic/${comicId}/chapter/${chapterId}`;
        getChapterInfoFromURL(url2);
      }
      return data;
    } catch (error) {
      console.error(error);
      alert(`\u63A5\u53E3\u8C03\u7528\u5931\u8D25 ${error.message}`);
      return { ok: false, manga: [] };
    }
  }

  var T = {"Actions":"<div id=\"Actions\" class=\"k-actions\">\n  <div class=\"k-icon k-next\">\n    <svg       viewBox=\"0 0 1024 1024\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"1em\"\n      height=\"1em\"\n    >\n      <path         d=\"M769.792 476.032 416.48 125.92c-18.848-18.656-49.216-18.528-67.872 0.32-18.656 18.816-18.528 49.216 0.32 67.872l319.456 316.576-318.176 321.056c-18.656 18.816-18.528 49.216 0.32 67.872 9.344 9.28 21.568 13.92 33.792 13.92 12.352 0 24.704-4.736 34.08-14.208l350.112-353.312c0.512-0.512 0.672-1.248 1.184-1.792 0.128-0.128 0.288-0.16 0.416-0.288C788.736 525.088 788.64 494.688 769.792 476.032z\"\n      ></path>\n    </svg>\n  </div>\n  <div class=\"k-icon k-split\">\n    <svg       viewBox=\"0 0 1024 1024\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"1em\"\n      height=\"1em\"\n    >\n      <path         d=\"M132.939294 481.882353h227.20753v60.235294H132.939294l99.147294 99.147294-42.586353 42.586353L17.648941 512l171.91153-171.911529 42.586353 42.586353L132.939294 481.882353z m701.560471-141.793882l-42.586353 42.586353L891.060706 481.882353h-227.20753v60.235294h227.20753l-99.147294 99.147294 42.586353 42.586353L1006.351059 512l-171.851294-171.911529zM481.882353 1024h60.235294V0H481.882353v1024z\"\n      ></path>\n    </svg>\n  </div>\n  <div class=\"k-icon k-merge\">\n    <svg       viewBox=\"0 0 1024 1024\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"1em\"\n      height=\"1em\"\n    >\n      <path         d=\"M362.375529 613.556706a29.033412 29.033412 0 0 1-20.720941-8.613647l-0.963764-1.024a33.611294 33.611294 0 0 1-0.90353-45.116235l45.296941-47.706353h-224.677647V445.620706h224.195765l-44.393412-46.742588a33.611294 33.611294 0 0 1-0.903529-45.056l0.903529-1.084236a29.274353 29.274353 0 0 1 42.405647-1.084235l120.591059 126.976-119.145412 125.289412a28.912941 28.912941 0 0 1-21.684706 9.637647m340.931765 0a29.033412 29.033412 0 0 1-20.781176-8.613647L561.995294 478.027294l119.024941-125.289412a29.274353 29.274353 0 0 1 42.405647-1.084235l0.90353 1.084235a33.310118 33.310118 0 0 1 0.963764 44.754824l-45.357176 47.706353h224.256v65.897412h-224.075294l44.333176 46.742588a33.129412 33.129412 0 0 1 0.963765 44.634353l-0.963765 1.084235v0.481882a27.587765 27.587765 0 0 1-21.202823 9.517177m-579.102118 358.821647c-41.441882-3.553882-73.246118-39.152941-73.246117-83.727059V93.364706C50.898824 46.381176 86.136471 9.216 131.011765 9.216h267.986823c44.875294 0 80.112941 36.984471 80.112941 84.208941V177.694118h-62.644705V93.424941a19.456 19.456 0 0 0-4.818824-13.191529 18.672941 18.672941 0 0 0-12.528941-5.662118H130.951529a18.010353 18.010353 0 0 0-12.468705 5.541647 17.106824 17.106824 0 0 0-4.818824 12.769883v794.563764c0 11.685647 6.264471 18.251294 17.287529 18.251294h268.047059a18.010353 18.010353 0 0 0 12.468706-5.541647 17.106824 17.106824 0 0 0 4.818824-12.649411v-84.208942h62.223058v84.148706c0 47.224471-35.237647 84.208941-80.112941 84.208941H124.084706l0.12047 0.722824z m542.479059 0.481882c-44.815059 0-80.052706-36.984471-80.052706-84.208941v-84.208941h62.644706v84.208941c0 11.625412 6.264471 18.251294 17.287529 18.251294h268.649412a19.937882 19.937882 0 0 0 17.28753-18.251294V93.906824c0-11.625412-6.264471-18.251294-17.28753-18.251295h-268.528941a19.937882 19.937882 0 0 0-17.287529 18.251295V180.705882H586.691765V93.967059c0-47.224471 35.237647-84.208941 80.112941-84.208941h267.986823c44.875294 0 80.112941 36.984471 80.112942 84.208941v794.74447c0 47.224471-35.237647 84.208941-80.112942 84.208942h-268.167529z\"\n      ></path>\n    </svg>\n  </div>\n  <div class=\"k-icon k-magnetic\">\n    <svg       viewBox=\"0 0 16 16\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"1em\"\n      height=\"1em\"\n      style=\"transform: rotate(180deg)\"\n    >\n      <path         d=\"M8 1a7 7 0 0 0-7 7v3h4V8a3 3 0 0 1 6 0v3h4V8a7 7 0 0 0-7-7m7 11h-4v3h4zM5 12H1v3h4zM0 8a8 8 0 1 1 16 0v8h-6V8a2 2 0 1 0-4 0v8H0z\"\n      ></path>\n    </svg>\n  </div>\n</div>"};

  async function openControl() {
    const li = await waitDOM("li.comicContentPopupImageItem");
    li.dispatchEvent(fakeClickEvent());
    await sleep(0);
    li.dispatchEvent(fakeClickEvent());
  }
  function fakeClickEvent() {
    const { width, height } = document.body.getBoundingClientRect();
    return new MouseEvent("click", { clientX: width / 2, clientY: height / 2 });
  }
  function getCurrentPage() {
    const scrollHeight = document.scrollingElement.scrollTop;
    const list = document.querySelectorAll("li.comicContentPopupImageItem");
    let height = 0;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      height += item.getBoundingClientRect().height;
      if (height - 100 > scrollHeight) {
        return i;
      }
    }
    return 0;
  }
  async function updatePageIndicator() {
    try {
      if (!/h5\/comicContent\/.*/.test(location.href))
        return;
      const list = document.querySelectorAll("li.comicContentPopupImageItem");
      const currentPage = getCurrentPage();
      const dom = document.querySelector(".comicContentPopup .comicFixed");
      dom.textContent = `${currentPage + 1}/${list.length}`;
    } catch (e) {
    }
  }
  async function restoreTabIdx() {
    if (!/h5\/details\/comic\/.*/.test(location.pathname))
      return;
    const LocalKey = "k-copymanga-tab-store";
    const [, id] = location.pathname.match(/h5\/details\/comic\/(.*)/);
    const store = local.getItem(LocalKey, {});
    await waitDOM(
      ".detailsTextContentTabs.van-tabs.van-tabs--line .van-tab:nth-child(2).van-tab--active"
    );
    const root = await waitDOM(".van-tabs");
    (async () => {
      var _a, _b;
      const prevActiveIdx = store[id];
      if (prevActiveIdx) {
        const [navIdx, itemIdx] = prevActiveIdx;
        if (navIdx) {
          const nav = await waitDOM(".van-tabs__nav");
          (_a = nav.children.item(navIdx)) == null ? void 0 : _a.click();
          if (itemIdx) {
            const nav2 = await waitDOM(
              `.van-tabs__content div:nth-child(${navIdx + 1}) .van-tabs__nav`
            );
            if (nav2) {
              (_b = nav2.children.item(itemIdx)) == null ? void 0 : _b.click();
            }
          }
        }
      }
    })();
    function getActiveIdx() {
      let idx = [];
      const list = root.querySelectorAll(".van-tabs__nav");
      list.forEach((nav, navIdx) => {
        Array.from(nav.children).forEach((item, itemIdx) => {
          if (item.classList.contains("van-tab--active")) {
            idx[navIdx] = itemIdx;
          }
        });
      });
      return idx;
    }
    const ob = new MutationObserver(() => {
      const idx = getActiveIdx();
      store[id] = idx;
      local.setItem(LocalKey, store);
    });
    ob.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }
  let trackId = { current: 0 };
  async function runH5main() {
    try {
      restoreTabIdx();
      if (!/h5\/comicContent\/.*/.test(location.href))
        return;
      let runTrackId = ++trackId.current;
      const ulDom = await waitDOM(".comicContentPopupImageList");
      if (runTrackId !== trackId.current)
        return;
      const uuid = getComicId();
      const domUUID = ulDom.dataset.uuid;
      if (domUUID !== uuid) {
        ulDom.dataset.uuid = uuid;
      }
      await openControl();
      await injectImageData();
      const main = ulDom.parentElement;
      main.style.position = "unset";
      main.style.overflowY = "unset";
      createActionsUI();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async function createActionsUI() {
    let actionsDom = document.querySelector(".k-actions");
    if (!actionsDom) {
      actionsDom = $(T.Actions)[0];
      document.body.appendChild(actionsDom);
      addDragEvent(actionsDom);
      intiNextPartEvent();
      initSplitEvent();
      initMergeEvent();
      initMagneticEvent();
    }
    if (!/h5\/comicContent\/.*/.test(location.href)) {
      actionsDom == null ? void 0 : actionsDom.classList.add("hide");
      return;
    } else {
      actionsDom.classList.remove("hide");
      $(".k-icon").filter(":not(.k-magnetic)").removeClass("active");
    }
  }
  async function initSplitEvent() {
    $(".k-split").on("click", (e) => {
      var _a;
      const isActive = e.currentTarget.classList.toggle("active");
      const list = $("[data-k]");
      const currentPage = getCurrentPage();
      for (const item of list) {
        item.style.overflowX = "hidden";
        const imgs = $(item).find("[data-img-lazy]");
        if (isActive) {
          const url = imgs.attr("src");
          imgs.last().css({
            clipPath: "polygon(50% 0%, 50% 100%, 0% 100%, 0% 0%)",
            width: "200%",
            display: "block"
          });
          $('<img data-img-lazy loading="lazy"/>').attr("src", url).css({
            clipPath: "polygon(100% 0%, 100% 100%, 50% 100%, 50% 0%)",
            width: "200%",
            display: "block",
            transform: "translateX(-50%)"
          }).prependTo(item);
        } else {
          imgs.last().removeAttr("style");
          imgs.first().remove();
        }
      }
      (_a = $(`[data-idx="${currentPage}"]`).get(0)) == null ? void 0 : _a.scrollIntoView();
    });
  }
  async function initMergeEvent() {
    let activeArr = [];
    function run(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const li = e.currentTarget;
      const isActive = li.classList.toggle("merge-active");
      if (isActive) {
        activeArr.push(li);
      } else {
        activeArr = activeArr.filter((item) => item !== li);
      }
      if (activeArr.length === 2) {
        const [first, second] = activeArr;
        $(second).find("[data-img-lazy]").prependTo($(first));
        $(first).css({ display: "flex" });
        $(first).find("[data-img-lazy]").css({ width: "50%" });
        cleanup();
        $(".k-merge").removeClass("active");
      }
    }
    function setup() {
      document.querySelectorAll("[data-k]").forEach((item) => {
        item.addEventListener("click", run, { capture: true });
      });
    }
    function cleanup() {
      activeArr = [];
      document.querySelectorAll("[data-k]").forEach((item) => {
        item.removeEventListener("click", run, { capture: true });
        item.classList.remove("merge-active");
      });
    }
    $(".k-merge").on("click", (e) => {
      const isActive = e.currentTarget.classList.toggle("active");
      cleanup();
      if (isActive) {
        setup();
      }
    });
  }
  const MAGNETIC_KEY = "k-copymanga-magnetic";
  async function initMagneticEvent() {
    $(".k-magnetic").toggleClass("active", local.getItem(MAGNETIC_KEY, false)).on("click", (e) => {
      const isActive = e.currentTarget.classList.toggle("active");
      local.setItem(MAGNETIC_KEY, isActive);
    });
  }
  async function intiNextPartEvent() {
    let fixedNextBtn = document.querySelector(".k-next");
    fixedNextBtn.onclick = async (e) => {
      var _a;
      e.stopPropagation();
      let nextButton = document.querySelector(
        ".comicControlBottomTop > div:nth-child(3) > span"
      );
      if (!nextButton) {
        await openControl();
        nextButton = document.querySelector(
          ".comicControlBottomTop > div:nth-child(3) > span"
        );
      }
      if ((_a = nextButton == null ? void 0 : nextButton.parentElement) == null ? void 0 : _a.classList.contains("noneUuid")) {
        const comicHomeBtn = document.querySelector(
          ".comicControlBottomBottom > .comicControlBottomBottomItem:nth-child(1)"
        );
        comicHomeBtn == null ? void 0 : comicHomeBtn.click();
      } else {
        nextButton == null ? void 0 : nextButton.click();
      }
      document.scrollingElement.scrollTop = 0;
    };
  }
  function addDragEvent(fxiedDom) {
    let prevY = 0;
    let storeY = 0;
    const key = "next-part-btn-fixed-position";
    let position = local.getItem(key, {
      top: document.documentElement.clientHeight / 4,
      left: document.documentElement.clientWidth
    });
    const size = fxiedDom.getBoundingClientRect();
    const safeArea = {
      top: (y) => Math.min(
        Math.max(y, 0),
        document.documentElement.clientHeight - size.height
      ),
      left: (x) => Math.min(
        Math.max(x, 0),
        document.documentElement.clientWidth - size.width
      )
    };
    const setPosition = (position2, isMoving) => {
      fxiedDom.classList.remove("left", "right");
      fxiedDom.style.transition = isMoving ? "none" : "";
      fxiedDom.style.top = `${position2.top}px`;
      fxiedDom.style.left = `${position2.left}px`;
      if (!isMoving) {
        const halfScreenWidth = document.documentElement.clientWidth / 2;
        fxiedDom.classList.add(
          position2.left > halfScreenWidth ? "right" : "left"
        );
        fxiedDom.style.left = position2.left > halfScreenWidth ? `${document.documentElement.clientWidth - size.width}px` : "0px";
      }
    };
    setPosition(position, false);
    fxiedDom.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      const { top, left } = fxiedDom.getBoundingClientRect();
      const diffX = clientX - left;
      const diffY = clientY - top;
      const move = (e2) => {
        e2.preventDefault();
        e2.stopPropagation();
        const touch2 = e2.touches[0];
        const { clientX: clientX2, clientY: clientY2 } = touch2;
        const x = safeArea.left(clientX2 - diffX);
        const y = safeArea.top(clientY2 - diffY);
        position = { top: y, left: x };
        setPosition(position, true);
      };
      const end = () => {
        local.setItem(key, position);
        setPosition(position, false);
        fxiedDom.style.removeProperty("transition");
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
      };
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", end);
    });
    window.addEventListener(
      "scroll",
      throttle(() => {
        if (!/h5\/comicContent\/.*/.test(location.href)) {
          fxiedDom == null ? void 0 : fxiedDom.classList.add("hide");
          return;
        }
        const dom = document.scrollingElement;
        const currentY = dom.scrollTop;
        let diffY = currentY - storeY;
        if (currentY < 50 || currentY + dom.clientHeight > dom.scrollHeight - 800 || diffY < -30) {
          fxiedDom == null ? void 0 : fxiedDom.classList.remove("hide");
        } else {
          fxiedDom == null ? void 0 : fxiedDom.classList.add("hide");
        }
        if (currentY > prevY) {
          storeY = currentY;
        }
        prevY = currentY;
      }, 100)
    );
  }
  function getComicId() {
    const [, uuid] = location.href.match(/h5\/comicContent\/.*\/(.*)/);
    return uuid;
  }
  async function addH5HistoryListener() {
    execInUnsafeWindow(() => {
      const _historyWrap = function(type) {
        const orig = history[type];
        const e = new Event(type);
        return function() {
          const rv = orig.apply(this, arguments);
          window.dispatchEvent(e);
          return rv;
        };
      };
      history.pushState = _historyWrap("pushState");
      history.replaceState = _historyWrap("replaceState");
    });
    window.addEventListener("pushState", runH5main);
    window.addEventListener("replaceState", runH5main);
    window.addEventListener("popstate", runH5main);
    window.addEventListener("scroll", throttle(updatePageIndicator, 100));
    runH5main();
  }
  async function injectImageData() {
    $(".comicContentPopup .comicFixed").addClass("loading");
    const info = await getChapterInfo();
    $(".comicContentPopup .comicFixed").removeClass("loading");
    let html = "";
    info.manga.forEach(({ url }, idx) => {
      html += `
    <li class="comicContentPopupImageItem k-loading" data-k data-idx="${idx}">
      <img src="${url}" data-img-lazy loading="lazy" data-idx="${idx}" onload="this.parentElement.classList.remove('k-loading')" />
    </li>
    `;
    });
    await waitDOM(".comicContentPopupImageList .comicContentPopupImageItem");
    $(".comicContentPopupImageItem").attr("class", "k-open-control-item").hide();
    $("[data-k]").remove();
    $(".comicContentPopupImageList").prepend(html);
    $(".comicContentPopupImageItem").on("click", (e) => {
      const { innerWidth, innerHeight } = window;
      const xp = e.clientX / innerWidth;
      const yp = e.clientY / innerHeight;
      const t = 0.3;
      const h = window.innerHeight * 0.8;
      const map = [
        -1,
        -1,
        1,
        -1,
        0,
        1,
        -1,
        1,
        1
      ];
      const isOpen = $(".comicContentPopup .comicControlTop").css("display") !== "none";
      if (isOpen) {
        const li = $(".k-open-control-item").get(0);
        li == null ? void 0 : li.dispatchEvent(fakeClickEvent());
        return;
      }
      const getRegionIndex = (p) => p < t ? 0 : p > 1 - t ? 2 : 1;
      const idx = getRegionIndex(xp) + getRegionIndex(yp) * 3;
      if (idx < 0 || idx >= map.length)
        return;
      const v = map[idx];
      const isMagnetic = local.getItem(MAGNETIC_KEY, false);
      const movePage = (delta) => {
        var _a;
        const list = document.querySelectorAll("li.comicContentPopupImageItem");
        const current = getCurrentPage();
        const next = Math.min(Math.max(current + delta, 0), list.length - 1);
        (_a = $(`[data-idx="${next}"]`).get(0)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      if (v === -1) {
        if (isMagnetic)
          movePage(-1);
        else
          window.scrollBy({ top: -h, behavior: "smooth" });
      } else if (v === 1) {
        if (isMagnetic)
          movePage(1);
        else
          window.scrollBy({ top: h, behavior: "smooth" });
      } else {
        const li = $(".k-open-control-item").get(0);
        li == null ? void 0 : li.dispatchEvent(fakeClickEvent());
      }
    });
    updatePageIndicator();
  }
  function h5() {
    addH5HistoryListener();
  }

  function replaceHeader() {
    const header = document.querySelector(
      ".container.header-log .row"
    );
    if (header) {
      header.style.flexWrap = "nowrap";
      $(header).find("div:nth-child(6)").replaceWith(
        `<div class="col-1">
          <div class="log-txt">
            <a href="/web/person/shujia">\u6211\u7684\u4E66\u67B6</a>
            <div class="log-unboder"></div>
          </div>
        </div>`
      );
      $(header).find("div:nth-child(7)").replaceWith(
        `<div class="col-1">
          <div class="log-txt">
            <a href="/web/person/liulan">\u6211\u7684\u6D4F\u89C8</a>
            <div class="log-unboder"></div>
          </div>
        </div>`
      );
      header.querySelector("div:nth-child(8)").className = "col";
      header.querySelector(
        "div.col > div > div"
      ).style.justifyContent = "flex-end";
    }
  }
  async function injectFixImg() {
    const listDOM = await waitDOM("ul.comicContent-list");
    async function injectEvent2() {
      const imgs = document.querySelectorAll("ul li img");
      imgs.forEach(addErrorListener);
    }
    const ob = new MutationObserver(injectEvent2);
    ob.observe(listDOM, { childList: true, subtree: true });
    injectEvent2();
  }
  async function injectFastLoadImg() {
    const $list = await waitDOM(".comicContent-list");
    function fastLoad() {
      const $imgs = $list.querySelectorAll("li img");
      $imgs.forEach(($img) => {
        if ($img.dataset.fastLoad === "true")
          return;
        $img.dataset.fastLoad = "true";
        $img.src = $img.dataset.src;
      });
    }
    const ob = new MutationObserver(fastLoad);
    ob.observe($list, { childList: true, subtree: true });
  }
  async function removeMouseupEvent() {
    await wait(() => !!document.body.onmouseup);
    document.body.onmouseup = null;
  }
  async function injectEvent() {
    keybind(["z", "x"], (e, key) => {
      var _a, _b;
      switch (key) {
        case "z": {
          (_a = document.querySelector(`[class='comicContent-prev'] a`)) == null ? void 0 : _a.click();
          break;
        }
        case "x": {
          (_b = document.querySelector(`[class='comicContent-next'] a`)) == null ? void 0 : _b.click();
          break;
        }
      }
    });
  }
  function pc() {
    if (/comic\/.*\/chapter/.test(location.href)) {
      injectFixImg();
      injectFastLoadImg();
      removeMouseupEvent();
      injectEvent();
    }
    replaceHeader();
  }

  /** @type {HTMLElement[]} */
  var containers = [];
  /** @type {{prepend:HTMLStyleElement,append:HTMLStyleElement}[]} */

  var styleTags = [];
  /**
   * @param {string} css
   * @param {object} options
   * @param {boolean} [options.prepend]
   * @param {boolean} [options.singleTag]
   * @param {string} [options.container]
   * @param {Record<string,string>} [options.attributes]
   * @returns {void}
   */

  function injectCss (css, options) {
    if (!css || typeof document === "undefined") return;
    var position = options.prepend === true ? "prepend" : "append";
    var singleTag = options.singleTag === true;
    var container = typeof options.container === "string" ? document.querySelector(options.container) : document.getElementsByTagName("head")[0];

    function createStyleTag() {
      var styleTag = document.createElement("style");
      styleTag.setAttribute("type", "text/css");

      if (options.attributes) {
        var k = Object.keys(options.attributes);

        for (var i = 0; i < k.length; i++) {
          styleTag.setAttribute(k[i], options.attributes[k[i]]);
        }
      }

      var pos = position === "prepend" ? "afterbegin" : "beforeend";
      container.insertAdjacentElement(pos, styleTag);
      return styleTag;
    }
    /** @type {HTMLStyleElement} */


    var styleTag;

    if (singleTag) {
      var id = containers.indexOf(container);

      if (id === -1) {
        id = containers.push(container) - 1;
        styleTags[id] = {};
      }

      if (styleTags[id] && styleTags[id][position]) {
        styleTag = styleTags[id][position];
      } else {
        styleTag = styleTags[id][position] = createStyleTag();
      }
    } else {
      styleTag = createStyleTag();
    } // strip potential UTF-8 BOM if css was read from a file


    if (css.charCodeAt(0) === 0xfeff) css = css.substring(1);

    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText += css;
    } else {
      styleTag.appendChild(document.createTextNode(css));
    }
  }

  var css = ".k-copymanga .k-actions {\n  position: fixed;\n  font-size: 20px;\n  transition: all 0.2s ease;\n  transform: translateX(0);\n  border-radius: 4px;\n  opacity: 1;\n  box-sizing: border-box;\n  overflow: hidden;\n  box-shadow: rgba(0, 0, 0, 0.2) -1px 1px 10px 0px;\n  background: white;\n}\n.k-copymanga .k-actions .k-icon {\n  padding: 8px;\n}\n.k-copymanga .k-actions .k-icon svg {\n  display: block;\n  fill: currentColor;\n}\n.k-copymanga .k-actions .k-icon.active {\n  background: rgb(44, 174, 254);\n  color: white;\n}\n.k-copymanga .k-actions .k-icon + .k-icon {\n  border-top: 1px solid #eee;\n}\n.k-copymanga .k-actions .k-next {\n  padding: 16px 8px;\n}\n.k-copymanga .k-actions.left {\n  border-radius: 0 4px 4px 0;\n  --transform-x: -100%;\n}\n.k-copymanga .k-actions.right {\n  border-radius: 4px 0 0 4px;\n  --transform-x: 100%;\n}\n.k-copymanga .k-actions.hide {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateX(var(--transform-x));\n}\n.k-copymanga .merge-active {\n  opacity: 0.5;\n  border: 1px solid red;\n}\n.k-copymanga .comicContentPopup .comicContentPopupImageList .comicContentPopupImageItem img {\n  display: block;\n  float: none;\n}\n.k-copymanga .comicContentPopup .comicContentPopupImageList > li[style] [role=alert],\n.k-copymanga .comicContentPopup .comicContentPopupImageList > li[style] [role=alert] + button {\n  display: none;\n}\n.k-copymanga .comicContentPopup .comicFixed {\n  position: fixed;\n  top: unset;\n  bottom: env(safe-area-inset-bottom);\n}\n.k-copymanga .comicContentPopup .comicFixed.loading {\n  width: auto;\n  min-width: 1.4rem;\n  padding: 0 1em;\n}\n.k-copymanga .comicContentPopup .comicFixed.loading::before {\n  content: \"Loading...\";\n  padding-right: 1em;\n}\n.k-copymanga .k-loading {\n  position: relative;\n}\n.k-copymanga .k-loading img {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  z-index: 2;\n}\n.k-copymanga .k-loading::before {\n  content: \"\";\n  display: block;\n  width: 100%;\n  padding-top: 142.1487603306%;\n}\n.k-copymanga .k-loading::after {\n  content: attr(data-idx);\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1;\n  color: #999;\n  font-size: 80px;\n}";
  injectCss(css,{});

  document.body.classList.add("k-copymanga");
  wait(() => execInUnsafeWindow(() => !!window.aboutBlank)).then(() => {
    execInUnsafeWindow(() => {
      window.aboutBlank = () => {
      };
    });
  });
  router([
    { pathname: /^\/h5/, run: h5 },
    { pathname: /^(?!\/h5)/, run: pc }
  ]);

})();

// ==UserScript==
// @name         Cow
// @description  gives you magical powers (fixed by Wealthy)
// @version      1
// @author       Yendis
// @match        *://*.moomoo.io/*
// @grant        none
// @icon         https://moomoo.io/img/animals/cow_1.png
// @license      MIT
// @namespace https://greasyfork.org/users/1360517
// @downloadURL https://update.greasyfork.org/scripts/507012/Cow.user.js
// @updateURL https://update.greasyfork.org/scripts/507012/Cow.meta.js
// ==/UserScript==

const gridSize = 40,
      stackTexts = true;

//addEventListener("DOMContentLoaded", window.FRVR.bootstrapper.complete);

const require = [{
    name: "msgpack",
    url: "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js",
    data: "msgpack"
}];

const required = {};

(async () => {
    let index = 0;

    while(index < require.length) {
        const lib = require[index];

        try {
            await fetch(lib.url).then(response => response.text()).then(response => eval(response));

            required[lib.name] = window[lib.data];
        } catch(event){}

        index += 1;
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    /******/ (function(modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/ 	var installedModules = {};
        /******/
        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {
            /******/
            /******/ 		// Check if module is in cache
            /******/ 		if(installedModules[moduleId]) {
                /******/ 			return installedModules[moduleId].exports;
                /******/ 		}
            /******/ 		// Create a new module (and put it into the cache)
            /******/ 		var module = installedModules[moduleId] = {
                /******/ 			i: moduleId,
                /******/ 			l: false,
                /******/ 			exports: {}
                /******/ 		};
            /******/
            /******/ 		// Execute the module function
            console.log(moduleId)
            /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ 		// Flag the module as loaded
            /******/ 		module.l = true;
            /******/
            /******/ 		// Return the exports of the module
            /******/ 		return module.exports;
            /******/ 	}
        /******/
        /******/
        /******/ 	// expose the modules object (__webpack_modules__)
        /******/ 	__webpack_require__.m = modules;
        /******/
        /******/ 	// expose the module cache
        /******/ 	__webpack_require__.c = installedModules;
        /******/
        /******/ 	// define getter function for harmony exports
        /******/ 	__webpack_require__.d = function(exports, name, getter) {
            /******/ 		if(!__webpack_require__.o(exports, name)) {
                /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
                /******/ 		}
            /******/ 	};
        /******/
        /******/ 	// define __esModule on exports
        /******/ 	__webpack_require__.r = function(exports) {
            /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /******/ 		}
            /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
            /******/ 	};
        /******/
        /******/ 	// create a fake namespace object
        /******/ 	// mode & 1: value is a module id, require it
        /******/ 	// mode & 2: merge all properties of value into the ns
        /******/ 	// mode & 4: return value when already ns object
        /******/ 	// mode & 8|1: behave like require
        /******/ 	__webpack_require__.t = function(value, mode) {
            /******/ 		if(mode & 1) value = __webpack_require__(value);
            /******/ 		if(mode & 8) return value;
            /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
            /******/ 		var ns = Object.create(null);
            /******/ 		__webpack_require__.r(ns);
            /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
            /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
            /******/ 		return ns;
            /******/ 	};
        /******/
        /******/ 	// getDefaultExport function for compatibility with non-harmony modules
        /******/ 	__webpack_require__.n = function(module) {
            /******/ 		var getter = module && module.__esModule ?
                /******/ 			function getDefault() { return module['default']; } :
            /******/ 			function getModuleExports() { return module; };
            /******/ 		__webpack_require__.d(getter, 'a', getter);
            /******/ 		return getter;
            /******/ 	};
        /******/
        /******/ 	// Object.prototype.hasOwnProperty.call
        /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
        /******/
        /******/ 	// __webpack_public_path__
        /******/ 	__webpack_require__.p = "";
        /******/
        /******/
        /******/ 	// Load entry module and return exports
        /******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/app.js");
        /******/ })
    ({
        /******/ "./node_modules/buffer/node_modules/isarray/index.js": (function(module, exports) {

            var toString = {}.toString;

            module.exports = Array.isArray || function (arr) {
                return toString.call(arr) == '[object Array]';
            };


            /***/ }),

        /***/ "./node_modules/process/browser.js":
        /*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            // shim for using process in browser
            var process = module.exports = {};

            // cached from whatever global is present so that test runners that stub it
            // don't break things.  But we need to wrap it in a try catch in case it is
            // wrapped in strict mode code which doesn't define any globals.  It's inside a
            // function because try/catches deoptimize in certain engines.

            var cachedSetTimeout;
            var cachedClearTimeout;

            function defaultSetTimout() {
                throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout () {
                throw new Error('clearTimeout has not been defined');
            }
            (function () {
                try {
                    if (typeof setTimeout === 'function') {
                        cachedSetTimeout = setTimeout;
                    } else {
                        cachedSetTimeout = defaultSetTimout;
                    }
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout;
                }
                try {
                    if (typeof clearTimeout === 'function') {
                        cachedClearTimeout = clearTimeout;
                    } else {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                } catch (e) {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } ())
            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    //normal enviroments in sane situations
                    return setTimeout(fun, 0);
                }
                // if setTimeout wasn't available but was latter defined
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedSetTimeout(fun, 0);
                } catch(e){
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch(e){
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }


            }
            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    //normal enviroments in sane situations
                    return clearTimeout(marker);
                }
                // if clearTimeout wasn't available but was latter defined
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedClearTimeout(marker);
                } catch (e){
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                        return cachedClearTimeout.call(null, marker);
                    } catch (e){
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                        return cachedClearTimeout.call(this, marker);
                    }
                }



            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;

            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return;
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }

            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;

                var len = queue.length;
                while(len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
            }

            process.nextTick = function (fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue);
                }
            };

            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = ''; // empty string to avoid regexp issues
            process.versions = {};

            function noop() {}

            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.prependListener = noop;
            process.prependOnceListener = noop;

            process.listeners = function (name) { return [] }

            process.binding = function (name) {
                throw new Error('process.binding is not supported');
            };

            process.cwd = function () { return '/' };
            process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function() { return 0; };


            /***/ }),

        /***/ "./node_modules/punycode/punycode.js":
        /*!*******************************************!*\
  !*** ./node_modules/punycode/punycode.js ***!
  \*******************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            /* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
                                                                  ;(function(root) {

                                                                      /** Detect free variables */
                                                                      var freeExports =  true && exports &&
                                                                          !exports.nodeType && exports;
                                                                      var freeModule =  true && module &&
                                                                          !module.nodeType && module;
                                                                      var freeGlobal = typeof global == 'object' && global;
                                                                      if (
                                                                          freeGlobal.global === freeGlobal ||
                                                                          freeGlobal.window === freeGlobal ||
                                                                          freeGlobal.self === freeGlobal
                                                                      ) {
                                                                          root = freeGlobal;
                                                                      }

                                                                      /**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
                                                                      var punycode,

                                                                          /** Highest positive signed 32-bit float value */
                                                                          maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

                                                                          /** Bootstring parameters */
                                                                          base = 36,
                                                                          tMin = 1,
                                                                          tMax = 26,
                                                                          skew = 38,
                                                                          damp = 700,
                                                                          initialBias = 72,
                                                                          initialN = 128, // 0x80
                                                                          delimiter = '-', // '\x2D'

                                                                          /** Regular expressions */
                                                                          regexPunycode = /^xn--/,
                                                                          regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
                                                                          regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

                                                                          /** Error messages */
                                                                          errors = {
                                                                              'overflow': 'Overflow: input needs wider integers to process',
                                                                              'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
                                                                              'invalid-input': 'Invalid input'
                                                                          },

                                                                          /** Convenience shortcuts */
                                                                          baseMinusTMin = base - tMin,
                                                                          floor = Math.floor,
                                                                          stringFromCharCode = String.fromCharCode,

                                                                          /** Temporary variable */
                                                                          key;

                                                                      /*--------------------------------------------------------------------------*/

                                                                      /**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
                                                                      function error(type) {
                                                                          throw new RangeError(errors[type]);
                                                                      }

                                                                      /**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
                                                                      function map(array, fn) {
                                                                          var length = array.length;
                                                                          var result = [];
                                                                          while (length--) {
                                                                              result[length] = fn(array[length]);
                                                                          }
                                                                          return result;
                                                                      }

                                                                      /**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
                                                                      function mapDomain(string, fn) {
                                                                          var parts = string.split('@');
                                                                          var result = '';
                                                                          if (parts.length > 1) {
                                                                              // In email addresses, only the domain name should be punycoded. Leave
                                                                              // the local part (i.e. everything up to `@`) intact.
                                                                              result = parts[0] + '@';
                                                                              string = parts[1];
                                                                          }
                                                                          // Avoid `split(regex)` for IE8 compatibility. See #17.
                                                                          string = string.replace(regexSeparators, '\x2E');
                                                                          var labels = string.split('.');
                                                                          var encoded = map(labels, fn).join('.');
                                                                          return result + encoded;
                                                                      }

                                                                      /**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
                                                                      function ucs2decode(string) {
                                                                          var output = [],
                                                                              counter = 0,
                                                                              length = string.length,
                                                                              value,
                                                                              extra;
                                                                          while (counter < length) {
                                                                              value = string.charCodeAt(counter++);
                                                                              if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                                                                                  // high surrogate, and there is a next character
                                                                                  extra = string.charCodeAt(counter++);
                                                                                  if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                                                                                      output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                                                                                  } else {
                                                                                      // unmatched surrogate; only append this code unit, in case the next
                                                                                      // code unit is the high surrogate of a surrogate pair
                                                                                      output.push(value);
                                                                                      counter--;
                                                                                  }
                                                                              } else {
                                                                                  output.push(value);
                                                                              }
                                                                          }
                                                                          return output;
                                                                      }

                                                                      /**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
                                                                      function ucs2encode(array) {
                                                                          return map(array, function(value) {
                                                                              var output = '';
                                                                              if (value > 0xFFFF) {
                                                                                  value -= 0x10000;
                                                                                  output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                                                                                  value = 0xDC00 | value & 0x3FF;
                                                                              }
                                                                              output += stringFromCharCode(value);
                                                                              return output;
                                                                          }).join('');
                                                                      }

                                                                      /**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
                                                                      function basicToDigit(codePoint) {
                                                                          if (codePoint - 48 < 10) {
                                                                              return codePoint - 22;
                                                                          }
                                                                          if (codePoint - 65 < 26) {
                                                                              return codePoint - 65;
                                                                          }
                                                                          if (codePoint - 97 < 26) {
                                                                              return codePoint - 97;
                                                                          }
                                                                          return base;
                                                                      }

                                                                      /**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
                                                                      function digitToBasic(digit, flag) {
                                                                          //  0..25 map to ASCII a..z or A..Z
                                                                          // 26..35 map to ASCII 0..9
                                                                          return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
                                                                      }

                                                                      /**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
                                                                      function adapt(delta, numPoints, firstTime) {
                                                                          var k = 0;
                                                                          delta = firstTime ? floor(delta / damp) : delta >> 1;
                                                                          delta += floor(delta / numPoints);
                                                                          for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
                                                                              delta = floor(delta / baseMinusTMin);
                                                                          }
                                                                          return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
                                                                      }

                                                                      /**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
                                                                      function decode(input) {
                                                                          // Don't use UCS-2
                                                                          var output = [],
                                                                              inputLength = input.length,
                                                                              out,
                                                                              i = 0,
                                                                              n = initialN,
                                                                              bias = initialBias,
                                                                              basic,
                                                                              j,
                                                                              index,
                                                                              oldi,
                                                                              w,
                                                                              k,
                                                                              digit,
                                                                              t,
                                                                              /** Cached calculation results */
                                                                              baseMinusT;

                                                                          // Handle the basic code points: let `basic` be the number of input code
                                                                          // points before the last delimiter, or `0` if there is none, then copy
                                                                          // the first basic code points to the output.

                                                                          basic = input.lastIndexOf(delimiter);
                                                                          if (basic < 0) {
                                                                              basic = 0;
                                                                          }

                                                                          for (j = 0; j < basic; ++j) {
                                                                              // if it's not a basic code point
                                                                              if (input.charCodeAt(j) >= 0x80) {
                                                                                  error('not-basic');
                                                                              }
                                                                              output.push(input.charCodeAt(j));
                                                                          }

                                                                          // Main decoding loop: start just after the last delimiter if any basic code
                                                                          // points were copied; start at the beginning otherwise.

                                                                          for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

                                                                              // `index` is the index of the next character to be consumed.
                                                                              // Decode a generalized variable-length integer into `delta`,
                                                                              // which gets added to `i`. The overflow checking is easier
                                                                              // if we increase `i` as we go, then subtract off its starting
                                                                              // value at the end to obtain `delta`.
                                                                              for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

                                                                                  if (index >= inputLength) {
                                                                                      error('invalid-input');
                                                                                  }

                                                                                  digit = basicToDigit(input.charCodeAt(index++));

                                                                                  if (digit >= base || digit > floor((maxInt - i) / w)) {
                                                                                      error('overflow');
                                                                                  }

                                                                                  i += digit * w;
                                                                                  t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

                                                                                  if (digit < t) {
                                                                                      break;
                                                                                  }

                                                                                  baseMinusT = base - t;
                                                                                  if (w > floor(maxInt / baseMinusT)) {
                                                                                      error('overflow');
                                                                                  }

                                                                                  w *= baseMinusT;

                                                                              }

                                                                              out = output.length + 1;
                                                                              bias = adapt(i - oldi, out, oldi == 0);

                                                                              // `i` was supposed to wrap around from `out` to `0`,
                                                                              // incrementing `n` each time, so we'll fix that now:
                                                                              if (floor(i / out) > maxInt - n) {
                                                                                  error('overflow');
                                                                              }

                                                                              n += floor(i / out);
                                                                              i %= out;

                                                                              // Insert `n` at position `i` of the output
                                                                              output.splice(i++, 0, n);

                                                                          }

                                                                          return ucs2encode(output);
                                                                      }

                                                                      /**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
                                                                      function encode(input) {
                                                                          var n,
                                                                              delta,
                                                                              handledCPCount,
                                                                              basicLength,
                                                                              bias,
                                                                              j,
                                                                              m,
                                                                              q,
                                                                              k,
                                                                              t,
                                                                              currentValue,
                                                                              output = [],
                                                                              /** `inputLength` will hold the number of code points in `input`. */
                                                                              inputLength,
                                                                              /** Cached calculation results */
                                                                              handledCPCountPlusOne,
                                                                              baseMinusT,
                                                                              qMinusT;

                                                                          // Convert the input in UCS-2 to Unicode
                                                                          input = ucs2decode(input);

                                                                          // Cache the length
                                                                          inputLength = input.length;

                                                                          // Initialize the state
                                                                          n = initialN;
                                                                          delta = 0;
                                                                          bias = initialBias;

                                                                          // Handle the basic code points
                                                                          for (j = 0; j < inputLength; ++j) {
                                                                              currentValue = input[j];
                                                                              if (currentValue < 0x80) {
                                                                                  output.push(stringFromCharCode(currentValue));
                                                                              }
                                                                          }

                                                                          handledCPCount = basicLength = output.length;

                                                                          // `handledCPCount` is the number of code points that have been handled;
                                                                          // `basicLength` is the number of basic code points.

                                                                          // Finish the basic string - if it is not empty - with a delimiter
                                                                          if (basicLength) {
                                                                              output.push(delimiter);
                                                                          }

                                                                          // Main encoding loop:
                                                                          while (handledCPCount < inputLength) {

                                                                              // All non-basic code points < n have been handled already. Find the next
                                                                              // larger one:
                                                                              for (m = maxInt, j = 0; j < inputLength; ++j) {
                                                                                  currentValue = input[j];
                                                                                  if (currentValue >= n && currentValue < m) {
                                                                                      m = currentValue;
                                                                                  }
                                                                              }

                                                                              // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                                                                              // but guard against overflow
                                                                              handledCPCountPlusOne = handledCPCount + 1;
                                                                              if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                                                                                  error('overflow');
                                                                              }

                                                                              delta += (m - n) * handledCPCountPlusOne;
                                                                              n = m;

                                                                              for (j = 0; j < inputLength; ++j) {
                                                                                  currentValue = input[j];

                                                                                  if (currentValue < n && ++delta > maxInt) {
                                                                                      error('overflow');
                                                                                  }

                                                                                  if (currentValue == n) {
                                                                                      // Represent delta as a generalized variable-length integer
                                                                                      for (q = delta, k = base; /* no condition */; k += base) {
                                                                                          t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                                                                                          if (q < t) {
                                                                                              break;
                                                                                          }
                                                                                          qMinusT = q - t;
                                                                                          baseMinusT = base - t;
                                                                                          output.push(
                                                                                              stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                                                                                          );
                                                                                          q = floor(qMinusT / baseMinusT);
                                                                                      }

                                                                                      output.push(stringFromCharCode(digitToBasic(q, 0)));
                                                                                      bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                                                                                      delta = 0;
                                                                                      ++handledCPCount;
                                                                                  }
                                                                              }

                                                                              ++delta;
                                                                              ++n;

                                                                          }
                                                                          return output.join('');
                                                                      }

                                                                      /**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
                                                                      function toUnicode(input) {
                                                                          return mapDomain(input, function(string) {
                                                                              return regexPunycode.test(string)
                                                                                  ? decode(string.slice(4).toLowerCase())
                                                                              : string;
                                                                          });
                                                                      }

                                                                      /**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
                                                                      function toASCII(input) {
                                                                          return mapDomain(input, function(string) {
                                                                              return regexNonASCII.test(string)
                                                                                  ? 'xn--' + encode(string)
                                                                              : string;
                                                                          });
                                                                      }

                                                                      /*--------------------------------------------------------------------------*/

                                                                      /** Define the public API */
                                                                      punycode = {
                                                                          /**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
                                                                          'version': '1.4.1',
                                                                          /**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
                                                                          'ucs2': {
                                                                              'decode': ucs2decode,
                                                                              'encode': ucs2encode
                                                                          },
                                                                          'decode': decode,
                                                                          'encode': encode,
                                                                          'toASCII': toASCII,
                                                                          'toUnicode': toUnicode
                                                                      };

                                                                      /** Expose `punycode` */
                                                                      // Some AMD build optimizers, like r.js, check for specific condition patterns
                                                                      // like the following:
                                                                      if (
                                                                          true
                                                                      ) {
                                                                          !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
                                                                              return punycode;
                                                                          }).call(exports, __webpack_require__, exports, module),
                                                                            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                                                                      } else {}

                                                                  }(this));

                                                                  /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module), __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

            /***/ }),

        /***/ "./node_modules/querystring-es3/decode.js":
        /*!************************************************!*\
  !*** ./node_modules/querystring-es3/decode.js ***!
  \************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.



            // If obj.hasOwnProperty has been overridden, then calling
            // obj.hasOwnProperty(prop) will break.
            // See: https://github.com/joyent/node/issues/1707
            function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }

            module.exports = function(qs, sep, eq, options) {
                sep = sep || '&';
                eq = eq || '=';
                var obj = {};

                if (typeof qs !== 'string' || qs.length === 0) {
                    return obj;
                }

                var regexp = /\+/g;
                qs = qs.split(sep);

                var maxKeys = 1000;
                if (options && typeof options.maxKeys === 'number') {
                    maxKeys = options.maxKeys;
                }

                var len = qs.length;
                // maxKeys <= 0 means that we should not limit keys count
                if (maxKeys > 0 && len > maxKeys) {
                    len = maxKeys;
                }

                for (var i = 0; i < len; ++i) {
                    var x = qs[i].replace(regexp, '%20'),
                        idx = x.indexOf(eq),
                        kstr, vstr, k, v;

                    if (idx >= 0) {
                        kstr = x.substr(0, idx);
                        vstr = x.substr(idx + 1);
                    } else {
                        kstr = x;
                        vstr = '';
                    }

                    k = decodeURIComponent(kstr);
                    v = decodeURIComponent(vstr);

                    if (!hasOwnProperty(obj, k)) {
                        obj[k] = v;
                    } else if (isArray(obj[k])) {
                        obj[k].push(v);
                    } else {
                        obj[k] = [obj[k], v];
                    }
                }

                return obj;
            };

            var isArray = Array.isArray || function (xs) {
                return Object.prototype.toString.call(xs) === '[object Array]';
            };


            /***/ }),

        /***/ "./node_modules/querystring-es3/encode.js":
        /*!************************************************!*\
  !*** ./node_modules/querystring-es3/encode.js ***!
  \************************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.



            var stringifyPrimitive = function(v) {
                switch (typeof v) {
                    case 'string':
                        return v;

                    case 'boolean':
                        return v ? 'true' : 'false';

                    case 'number':
                        return isFinite(v) ? v : '';

                    default:
                        return '';
                }
            };

            module.exports = function(obj, sep, eq, name) {
                sep = sep || '&';
                eq = eq || '=';
                if (obj === null) {
                    obj = undefined;
                }

                if (typeof obj === 'object') {
                    return map(objectKeys(obj), function(k) {
                        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                        if (isArray(obj[k])) {
                            return map(obj[k], function(v) {
                                return ks + encodeURIComponent(stringifyPrimitive(v));
                            }).join(sep);
                        } else {
                            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                        }
                    }).join(sep);

                }

                if (!name) return '';
                return encodeURIComponent(stringifyPrimitive(name)) + eq +
                    encodeURIComponent(stringifyPrimitive(obj));
            };

            var isArray = Array.isArray || function (xs) {
                return Object.prototype.toString.call(xs) === '[object Array]';
            };

            function map (xs, f) {
                if (xs.map) return xs.map(f);
                var res = [];
                for (var i = 0; i < xs.length; i++) {
                    res.push(f(xs[i], i));
                }
                return res;
            }

            var objectKeys = Object.keys || function (obj) {
                var res = [];
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
                }
                return res;
            };


            /***/ }),

        /***/ "./node_modules/querystring-es3/index.js":
        /*!***********************************************!*\
  !*** ./node_modules/querystring-es3/index.js ***!
  \***********************************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            // exports.decode = exports.parse = __webpack_require__(/*! ./decode */ "./node_modules/querystring-es3/decode.js");
            // exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "./node_modules/querystring-es3/encode.js");


            /***/ }),

        /***/ "./node_modules/url/url.js":
        /*!*********************************!*\
  !*** ./node_modules/url/url.js ***!
  \*********************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";
            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.



            var punycode = __webpack_require__(/*! punycode */ "./node_modules/punycode/punycode.js");
            var util = __webpack_require__(/*! ./util */ "./node_modules/url/util.js");

            exports.parse = urlParse;
            exports.resolve = urlResolve;
            exports.resolveObject = urlResolveObject;
            exports.format = urlFormat;

            exports.Url = Url;

            function Url() {
                this.protocol = null;
                this.slashes = null;
                this.auth = null;
                this.host = null;
                this.port = null;
                this.hostname = null;
                this.hash = null;
                this.search = null;
                this.query = null;
                this.pathname = null;
                this.path = null;
                this.href = null;
            }

            // Reference: RFC 3986, RFC 1808, RFC 2396

            // define these here so at least they only have to be
            // compiled once on the first module load.
            var protocolPattern = /^([a-z0-9.+-]+:)/i,
                portPattern = /:[0-9]*$/,

                // Special case for a simple path URL
                simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

                // RFC 2396: characters reserved for delimiting URLs.
                // We actually just auto-escape these.
                delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

                // RFC 2396: characters not allowed for various reasons.
                unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

                // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
                autoEscape = ['\''].concat(unwise),
                // Characters that are never ever allowed in a hostname.
                // Note that any invalid chars are also handled, but these
                // are the ones that are *expected* to be seen, so we fast-path
                // them.
                nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
                hostEndingChars = ['/', '?', '#'],
                hostnameMaxLen = 255,
                hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
                hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
                // protocols that can allow "unsafe" and "unwise" chars.
                unsafeProtocol = {
                    'javascript': true,
                    'javascript:': true
                },
                // protocols that never have a hostname.
                hostlessProtocol = {
                    'javascript': true,
                    'javascript:': true
                },
                // protocols that always contain a // bit.
                slashedProtocol = {
                    'http': true,
                    'https': true,
                    'ftp': true,
                    'gopher': true,
                    'file': true,
                    'http:': true,
                    'https:': true,
                    'ftp:': true,
                    'gopher:': true,
                    'file:': true
                },
                querystring = __webpack_require__(/*! querystring */ "./node_modules/querystring-es3/index.js");

            function urlParse(url, parseQueryString, slashesDenoteHost) {
                if (url && util.isObject(url) && url instanceof Url) return url;

                var u = new Url;
                u.parse(url, parseQueryString, slashesDenoteHost);
                return u;
            }

            Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
                if (!util.isString(url)) {
                    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
                }

                // Copy chrome, IE, opera backslash-handling behavior.
                // Back slashes before the query string get converted to forward slashes
                // See: https://code.google.com/p/chromium/issues/detail?id=25916
                var queryIndex = url.indexOf('?'),
                    splitter =
                    (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
                    uSplit = url.split(splitter),
                    slashRegex = /\\/g;
                uSplit[0] = uSplit[0].replace(slashRegex, '/');
                url = uSplit.join(splitter);

                var rest = url;

                // trim before proceeding.
                // This is to support parse stuff like "  http://foo.com  \n"
                rest = rest.trim();

                if (!slashesDenoteHost && url.split('#').length === 1) {
                    // Try fast path regexp
                    var simplePath = simplePathPattern.exec(rest);
                    if (simplePath) {
                        this.path = rest;
                        this.href = rest;
                        this.pathname = simplePath[1];
                        if (simplePath[2]) {
                            this.search = simplePath[2];
                            if (parseQueryString) {
                                this.query = querystring.parse(this.search.substr(1));
                            } else {
                                this.query = this.search.substr(1);
                            }
                        } else if (parseQueryString) {
                            this.search = '';
                            this.query = {};
                        }
                        return this;
                    }
                }

                var proto = protocolPattern.exec(rest);
                if (proto) {
                    proto = proto[0];
                    var lowerProto = proto.toLowerCase();
                    this.protocol = lowerProto;
                    rest = rest.substr(proto.length);
                }

                // figure out if it's got a host
                // user@server is *always* interpreted as a hostname, and url
                // resolution will treat //foo/bar as host=foo,path=bar because that's
                // how the browser resolves relative URLs.
                if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    var slashes = rest.substr(0, 2) === '//';
                    if (slashes && !(proto && hostlessProtocol[proto])) {
                        rest = rest.substr(2);
                        this.slashes = true;
                    }
                }

                if (!hostlessProtocol[proto] &&
                    (slashes || (proto && !slashedProtocol[proto]))) {

                    // there's a hostname.
                    // the first instance of /, ?, ;, or # ends the host.
                    //
                    // If there is an @ in the hostname, then non-host chars *are* allowed
                    // to the left of the last @ sign, unless some host-ending character
                    // comes *before* the @-sign.
                    // URLs are obnoxious.
                    //
                    // ex:
                    // http://a@b@c/ => user:a@b host:c
                    // http://a@b?@c => user:a host:c path:/?@c

                    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
                    // Review our test case against browsers more comprehensively.

                    // find the first instance of any hostEndingChars
                    var hostEnd = -1;
                    for (var i = 0; i < hostEndingChars.length; i++) {
                        var hec = rest.indexOf(hostEndingChars[i]);
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                            hostEnd = hec;
                    }

                    // at this point, either we have an explicit point where the
                    // auth portion cannot go past, or the last @ char is the decider.
                    var auth, atSign;
                    if (hostEnd === -1) {
                        // atSign can be anywhere.
                        atSign = rest.lastIndexOf('@');
                    } else {
                        // atSign must be in auth portion.
                        // http://a@b/c@d => host:b auth:a path:/c@d
                        atSign = rest.lastIndexOf('@', hostEnd);
                    }

                    // Now we have a portion which is definitely the auth.
                    // Pull that off.
                    if (atSign !== -1) {
                        auth = rest.slice(0, atSign);
                        rest = rest.slice(atSign + 1);
                        this.auth = decodeURIComponent(auth);
                    }

                    // the host is the remaining to the left of the first non-host char
                    hostEnd = -1;
                    for (var i = 0; i < nonHostChars.length; i++) {
                        var hec = rest.indexOf(nonHostChars[i]);
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                            hostEnd = hec;
                    }
                    // if we still have not hit it, then the entire thing is a host.
                    if (hostEnd === -1)
                        hostEnd = rest.length;

                    this.host = rest.slice(0, hostEnd);
                    rest = rest.slice(hostEnd);

                    // pull out port.
                    this.parseHost();

                    // we've indicated that there is a hostname,
                    // so even if it's empty, it has to be present.
                    this.hostname = this.hostname || '';

                    // if hostname begins with [ and ends with ]
                    // assume that it's an IPv6 address.
                    var ipv6Hostname = this.hostname[0] === '[' &&
                        this.hostname[this.hostname.length - 1] === ']';

                    // validate a little.
                    if (!ipv6Hostname) {
                        var hostparts = this.hostname.split(/\./);
                        for (var i = 0, l = hostparts.length; i < l; i++) {
                            var part = hostparts[i];
                            if (!part) continue;
                            if (!part.match(hostnamePartPattern)) {
                                var newpart = '';
                                for (var j = 0, k = part.length; j < k; j++) {
                                    if (part.charCodeAt(j) > 127) {
                                        // we replace non-ASCII char with a temporary placeholder
                                        // we need this to make sure size of hostname is not
                                        // broken by replacing non-ASCII by nothing
                                        newpart += 'x';
                                    } else {
                                        newpart += part[j];
                                    }
                                }
                                // we test again with ASCII char only
                                if (!newpart.match(hostnamePartPattern)) {
                                    var validParts = hostparts.slice(0, i);
                                    var notHost = hostparts.slice(i + 1);
                                    var bit = part.match(hostnamePartStart);
                                    if (bit) {
                                        validParts.push(bit[1]);
                                        notHost.unshift(bit[2]);
                                    }
                                    if (notHost.length) {
                                        rest = '/' + notHost.join('.') + rest;
                                    }
                                    this.hostname = validParts.join('.');
                                    break;
                                }
                            }
                        }
                    }

                    if (this.hostname.length > hostnameMaxLen) {
                        this.hostname = '';
                    } else {
                        // hostnames are always lower case.
                        this.hostname = this.hostname.toLowerCase();
                    }

                    if (!ipv6Hostname) {
                        // IDNA Support: Returns a punycoded representation of "domain".
                        // It only converts parts of the domain name that
                        // have non-ASCII characters, i.e. it doesn't matter if
                        // you call it with a domain that already is ASCII-only.
                        this.hostname = punycode.toASCII(this.hostname);
                    }

                    var p = this.port ? ':' + this.port : '';
                    var h = this.hostname || '';
                    this.host = h + p;
                    this.href += this.host;

                    // strip [ and ] from the hostname
                    // the host field still retains them, though
                    if (ipv6Hostname) {
                        this.hostname = this.hostname.substr(1, this.hostname.length - 2);
                        if (rest[0] !== '/') {
                            rest = '/' + rest;
                        }
                    }
                }

                // now rest is set to the post-host stuff.
                // chop off any delim chars.
                if (!unsafeProtocol[lowerProto]) {

                    // First, make 100% sure that any "autoEscape" chars get
                    // escaped, even if encodeURIComponent doesn't think they
                    // need to be.
                    for (var i = 0, l = autoEscape.length; i < l; i++) {
                        var ae = autoEscape[i];
                        if (rest.indexOf(ae) === -1)
                            continue;
                        var esc = encodeURIComponent(ae);
                        if (esc === ae) {
                            esc = escape(ae);
                        }
                        rest = rest.split(ae).join(esc);
                    }
                }


                // chop off from the tail first.
                var hash = rest.indexOf('#');
                if (hash !== -1) {
                    // got a fragment string.
                    this.hash = rest.substr(hash);
                    rest = rest.slice(0, hash);
                }
                var qm = rest.indexOf('?');
                if (qm !== -1) {
                    this.search = rest.substr(qm);
                    this.query = rest.substr(qm + 1);
                    if (parseQueryString && querystring.parse) {
                        this.query = querystring.parse(this.query);
                    }
                    rest = rest.slice(0, qm);
                } else if (parseQueryString) {
                    // no query string, but parseQueryString still requested
                    this.search = '';
                    this.query = {};
                }
                if (rest) this.pathname = rest;
                if (slashedProtocol[lowerProto] &&
                    this.hostname && !this.pathname) {
                    this.pathname = '/';
                }

                //to support http.request
                if (this.pathname || this.search) {
                    var p = this.pathname || '';
                    var s = this.search || '';
                    this.path = p + s;
                }

                // finally, reconstruct the href based on what has been validated.
                this.href = this.format();
                return this;
            };

            // format a parsed object into a url string
            function urlFormat(obj) {
                // ensure it's an object, and not a string url.
                // If it's an obj, this is a no-op.
                // this way, you can call url_format() on strings
                // to clean up potentially wonky urls.
                if (util.isString(obj)) obj = urlParse(obj);
                if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
                return obj.format();
            }

            Url.prototype.format = function() {
                var auth = this.auth || '';
                if (auth) {
                    auth = encodeURIComponent(auth);
                    auth = auth.replace(/%3A/i, ':');
                    auth += '@';
                }

                var protocol = this.protocol || '',
                    pathname = this.pathname || '',
                    hash = this.hash || '',
                    host = false,
                    query = '';

                if (this.host) {
                    host = auth + this.host;
                } else if (this.hostname) {
                    host = auth + (this.hostname.indexOf(':') === -1 ?
                                   this.hostname :
                                   '[' + this.hostname + ']');
                    if (this.port) {
                        host += ':' + this.port;
                    }
                }

                if (this.query &&
                    util.isObject(this.query) &&
                    Object.keys(this.query).length) {
                    query = querystring.stringify(this.query);
                }

                var search = this.search || (query && ('?' + query)) || '';

                if (protocol && protocol.substr(-1) !== ':') protocol += ':';

                // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
                // unless they had them to begin with.
                if (this.slashes ||
                    (!protocol || slashedProtocol[protocol]) && host !== false) {
                    host = '//' + (host || '');
                    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
                } else if (!host) {
                    host = '';
                }

                if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
                if (search && search.charAt(0) !== '?') search = '?' + search;

                pathname = pathname.replace(/[?#]/g, function(match) {
                    return encodeURIComponent(match);
                });
                search = search.replace('#', '%23');

                return protocol + host + pathname + search + hash;
            };

            function urlResolve(source, relative) {
                return urlParse(source, false, true).resolve(relative);
            }

            Url.prototype.resolve = function(relative) {
                return this.resolveObject(urlParse(relative, false, true)).format();
            };

            function urlResolveObject(source, relative) {
                if (!source) return relative;
                return urlParse(source, false, true).resolveObject(relative);
            }

            Url.prototype.resolveObject = function(relative) {
                if (util.isString(relative)) {
                    var rel = new Url();
                    rel.parse(relative, false, true);
                    relative = rel;
                }

                var result = new Url();
                var tkeys = Object.keys(this);
                for (var tk = 0; tk < tkeys.length; tk++) {
                    var tkey = tkeys[tk];
                    result[tkey] = this[tkey];
                }

                // hash is always overridden, no matter what.
                // even href="" will remove it.
                result.hash = relative.hash;

                // if the relative url is empty, then there's nothing left to do here.
                if (relative.href === '') {
                    result.href = result.format();
                    return result;
                }

                // hrefs like //foo/bar always cut to the protocol.
                if (relative.slashes && !relative.protocol) {
                    // take everything except the protocol from relative
                    var rkeys = Object.keys(relative);
                    for (var rk = 0; rk < rkeys.length; rk++) {
                        var rkey = rkeys[rk];
                        if (rkey !== 'protocol')
                            result[rkey] = relative[rkey];
                    }

                    //urlParse appends trailing / to urls like http://www.example.com
                    if (slashedProtocol[result.protocol] &&
                        result.hostname && !result.pathname) {
                        result.path = result.pathname = '/';
                    }

                    result.href = result.format();
                    return result;
                }

                if (relative.protocol && relative.protocol !== result.protocol) {
                    // if it's a known url protocol, then changing
                    // the protocol does weird things
                    // first, if it's not file:, then we MUST have a host,
                    // and if there was a path
                    // to begin with, then we MUST have a path.
                    // if it is file:, then the host is dropped,
                    // because that's known to be hostless.
                    // anything else is assumed to be absolute.
                    if (!slashedProtocol[relative.protocol]) {
                        var keys = Object.keys(relative);
                        for (var v = 0; v < keys.length; v++) {
                            var k = keys[v];
                            result[k] = relative[k];
                        }
                        result.href = result.format();
                        return result;
                    }

                    result.protocol = relative.protocol;
                    if (!relative.host && !hostlessProtocol[relative.protocol]) {
                        var relPath = (relative.pathname || '').split('/');
                        while (relPath.length && !(relative.host = relPath.shift()));
                        if (!relative.host) relative.host = '';
                        if (!relative.hostname) relative.hostname = '';
                        if (relPath[0] !== '') relPath.unshift('');
                        if (relPath.length < 2) relPath.unshift('');
                        result.pathname = relPath.join('/');
                    } else {
                        result.pathname = relative.pathname;
                    }
                    result.search = relative.search;
                    result.query = relative.query;
                    result.host = relative.host || '';
                    result.auth = relative.auth;
                    result.hostname = relative.hostname || relative.host;
                    result.port = relative.port;
                    // to support http.request
                    if (result.pathname || result.search) {
                        var p = result.pathname || '';
                        var s = result.search || '';
                        result.path = p + s;
                    }
                    result.slashes = result.slashes || relative.slashes;
                    result.href = result.format();
                    return result;
                }

                var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
                    isRelAbs = (
                        relative.host ||
                        relative.pathname && relative.pathname.charAt(0) === '/'
                    ),
                    mustEndAbs = (isRelAbs || isSourceAbs ||
                                  (result.host && relative.pathname)),
                    removeAllDots = mustEndAbs,
                    srcPath = result.pathname && result.pathname.split('/') || [],
                    relPath = relative.pathname && relative.pathname.split('/') || [],
                    psychotic = result.protocol && !slashedProtocol[result.protocol];

                // if the url is a non-slashed url, then relative
                // links like ../.. should be able
                // to crawl up to the hostname, as well.  This is strange.
                // result.protocol has already been set by now.
                // Later on, put the first path part into the host field.
                if (psychotic) {
                    result.hostname = '';
                    result.port = null;
                    if (result.host) {
                        if (srcPath[0] === '') srcPath[0] = result.host;
                        else srcPath.unshift(result.host);
                    }
                    result.host = '';
                    if (relative.protocol) {
                        relative.hostname = null;
                        relative.port = null;
                        if (relative.host) {
                            if (relPath[0] === '') relPath[0] = relative.host;
                            else relPath.unshift(relative.host);
                        }
                        relative.host = null;
                    }
                    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
                }

                if (isRelAbs) {
                    // it's absolute.
                    result.host = (relative.host || relative.host === '') ?
                        relative.host : result.host;
                    result.hostname = (relative.hostname || relative.hostname === '') ?
                        relative.hostname : result.hostname;
                    result.search = relative.search;
                    result.query = relative.query;
                    srcPath = relPath;
                    // fall through to the dot-handling below.
                } else if (relPath.length) {
                    // it's relative
                    // throw away the existing file, and take the new path instead.
                    if (!srcPath) srcPath = [];
                    srcPath.pop();
                    srcPath = srcPath.concat(relPath);
                    result.search = relative.search;
                    result.query = relative.query;
                } else if (!util.isNullOrUndefined(relative.search)) {
                    // just pull out the search.
                    // like href='?foo'.
                    // Put this after the other two cases because it simplifies the booleans
                    if (psychotic) {
                        result.hostname = result.host = srcPath.shift();
                        //occationaly the auth can get stuck only in host
                        //this especially happens in cases like
                        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                        var authInHost = result.host && result.host.indexOf('@') > 0 ?
                            result.host.split('@') : false;
                        if (authInHost) {
                            result.auth = authInHost.shift();
                            result.host = result.hostname = authInHost.shift();
                        }
                    }
                    result.search = relative.search;
                    result.query = relative.query;
                    //to support http.request
                    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                        result.path = (result.pathname ? result.pathname : '') +
                            (result.search ? result.search : '');
                    }
                    result.href = result.format();
                    return result;
                }

                if (!srcPath.length) {
                    // no path at all.  easy.
                    // we've already handled the other stuff above.
                    result.pathname = null;
                    //to support http.request
                    if (result.search) {
                        result.path = '/' + result.search;
                    } else {
                        result.path = null;
                    }
                    result.href = result.format();
                    return result;
                }

                // if a url ENDs in . or .., then it must get a trailing slash.
                // however, if it ends in anything else non-slashy,
                // then it must NOT get a trailing slash.
                var last = srcPath.slice(-1)[0];
                var hasTrailingSlash = (
                    (result.host || relative.host || srcPath.length > 1) &&
                    (last === '.' || last === '..') || last === '');

                // strip single dots, resolve double dots to parent dir
                // if the path tries to go above the root, `up` ends up > 0
                var up = 0;
                for (var i = srcPath.length; i >= 0; i--) {
                    last = srcPath[i];
                    if (last === '.') {
                        srcPath.splice(i, 1);
                    } else if (last === '..') {
                        srcPath.splice(i, 1);
                        up++;
                    } else if (up) {
                        srcPath.splice(i, 1);
                        up--;
                    }
                }

                // if the path is allowed to go above the root, restore leading ..s
                if (!mustEndAbs && !removeAllDots) {
                    for (; up--; up) {
                        srcPath.unshift('..');
                    }
                }

                if (mustEndAbs && srcPath[0] !== '' &&
                    (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
                    srcPath.unshift('');
                }

                if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
                    srcPath.push('');
                }

                var isAbsolute = srcPath[0] === '' ||
                    (srcPath[0] && srcPath[0].charAt(0) === '/');

                // put the host back
                if (psychotic) {
                    result.hostname = result.host = isAbsolute ? '' :
                    srcPath.length ? srcPath.shift() : '';
                    //occationaly the auth can get stuck only in host
                    //this especially happens in cases like
                    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                        result.host.split('@') : false;
                    if (authInHost) {
                        result.auth = authInHost.shift();
                        result.host = result.hostname = authInHost.shift();
                    }
                }

                mustEndAbs = mustEndAbs || (result.host && srcPath.length);

                if (mustEndAbs && !isAbsolute) {
                    srcPath.unshift('');
                }

                if (!srcPath.length) {
                    result.pathname = null;
                    result.path = null;
                } else {
                    result.pathname = srcPath.join('/');
                }

                //to support request.http
                if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
                    result.path = (result.pathname ? result.pathname : '') +
                        (result.search ? result.search : '');
                }
                result.auth = relative.auth || result.auth;
                result.slashes = result.slashes || relative.slashes;
                result.href = result.format();
                return result;
            };

            Url.prototype.parseHost = function() {
                var host = this.host;
                var port = portPattern.exec(host);
                if (port) {
                    port = port[0];
                    if (port !== ':') {
                        this.port = port.substr(1);
                    }
                    host = host.substr(0, host.length - port.length);
                }
                if (host) this.hostname = host;
            };


            /***/ }),

        /***/ "./node_modules/url/util.js":
        /*!**********************************!*\
  !*** ./node_modules/url/util.js ***!
  \**********************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            module.exports = {
                isString: function(arg) {
                    return typeof(arg) === 'string';
                },
                isObject: function(arg) {
                    return typeof(arg) === 'object' && arg !== null;
                },
                isNull: function(arg) {
                    return arg === null;
                },
                isNullOrUndefined: function(arg) {
                    return arg == null;
                }
            };


            /***/ }),

        /***/ "./node_modules/webpack/buildin/global.js":
        /*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            var g;

            // This works in non-strict mode
            g = (function() {
                return this;
            })();

            try {
                // This works if eval is allowed (see CSP)
                g = g || new Function("return this")();
            } catch (e) {
                // This works if the window reference is available
                if (typeof window === "object") g = window;
            }

            // g can still be undefined, but nothing to do about it...
            // We return undefined, instead of nothing here, so it's
            // easier to handle this case. if(!global) { ...}

            module.exports = g;


            /***/ }),

        /***/ "./node_modules/webpack/buildin/module.js":
        /*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            module.exports = function(module) {
                if (!module.webpackPolyfill) {
                    module.deprecate = function() {};
                    module.paths = [];
                    // module.parent = undefined by default
                    if (!module.children) module.children = [];
                    Object.defineProperty(module, "loaded", {
                        enumerable: true,
                        get: function() {
                            return module.l;
                        }
                    });
                    Object.defineProperty(module, "id", {
                        enumerable: true,
                        get: function() {
                            return module.i;
                        }
                    });
                    module.webpackPolyfill = 1;
                }
                return module;
            };


            /***/ }),

        /***/ "./src/js/app.js":
        /*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            "use strict";


            window.loadedScript = true;

            // ENV:
            var isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");

            // IMPORTS:
            __webpack_require__(/*! ./libs/modernizr.js */ "./src/js/libs/modernizr.js");
            var io = __webpack_require__(/*! ./libs/io-client.js */ "./src/js/libs/io-client.js");
            var UTILS = __webpack_require__(/*! ./libs/utils.js */ "./src/js/libs/utils.js");
            var animText = __webpack_require__(/*! ./libs/animText.js */ "./src/js/libs/animText.js");
            var config = __webpack_require__(/*! ./config.js */ "./src/js/config.js");
            var GameObject = __webpack_require__(/*! ./data/gameObject.js */ "./src/js/data/gameObject.js");
            var items = __webpack_require__(/*! ./data/items.js */ "./src/js/data/items.js");
            var MapManager = __webpack_require__(/*! ./data/mapManager.js */ "./src/js/data/mapManager.js");
            var ObjectManager = __webpack_require__(/*! ./data/objectManager.js */ "./src/js/data/objectManager.js");
            var Player = __webpack_require__(/*! ./data/player.js */ "./src/js/data/player.js");
            var store = __webpack_require__(/*! ./data/store.js */ "./src/js/data/store.js");
            var Projectile = __webpack_require__(/*! ./data/projectile.js */ "./src/js/data/projectile.js");
            var ProjectileManager = __webpack_require__(/*! ./data/projectileManager.js */ "./src/js/data/projectileManager.js");
            var SoundManager = __webpack_require__(/*! ./libs/soundManager.js */ "./src/js/libs/soundManager.js").obj;
            var textManager = new animText.TextManager();

            // VULTR:
            //var VultrClient = null//__webpack_require__(/*! ../../vultr/VultrClient.js */ "./vultr/VultrClient.js");
            //var vultrClient = new VultrClient("moomoo.io", 3000, config.maxPlayers, 5, false);
            //vultrClient.debugLog = false;

            // URL PARAMS:
            function getParameterByName(name, url) {
                if (!url) {
                    url = window.location.href;
                }
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }

            // SOCKET & CONNECTION:
            var connected = false;
            var startedConnecting = false;
            function connectSocketIfReady(server) {
                if(server) bestServer = server;

                // MAKE SURE IT'S READY:
                if (!didLoad || !captchaReady || !bestServer) return;
                startedConnecting = true;

                // GET TOKEN:
                if (isProd) {
                    /*window.turnstileToken ? connectSocket(window.turnstileToken) : */window.grecaptcha
                        .execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
                        action: "homepage",
                    })
                        .then(function(token) {
                        // CONNECT SOCKET:
                        connectSocket(`re:${token}`, server);
                    })
                } else {
                    // CONNECT SOCKET:
                    connectSocket(null);
                }
            }
            function connectSocket(token, server) {
                if(server) bestServer = server;

                // CONNECT SOCKET:
                let ip = `${bestServer.key}.${bestServer.region}`;

                // CREATE ADDRESS:
                let wsAddress = `wss://${ip}.moomoo.io/`
			 if (token) wsAddress += "?token=" + encodeURIComponent(token);

                usedServer = bestServer;
                // CONNECT:
                io.connect(wsAddress, function(error) {
                    pingSocket();

                    setInterval(pingSocket, 500);

                    if (error) {
                        startedConnecting = false;
                        disconnect(error);
                    } else {
                        connected = true;
                        startGame();
                    }
                }, {
                    "A": setInitData,
                    "B": disconnect,
                    "C": setupGame,
                    "D": addPlayer,
                    "E": removePlayer,
                    "a": updatePlayers,
                    "G": updateLeaderboard,
                    "H": loadGameObject,
                    "I": loadAI,
                    "J": animateAI,
                    "K": gatherAnimation,
                    "L": wiggleGameObject,
                    "M": shootTurret,
                    "N": updatePlayerValue,
                    "O": updateHealth,
                    "P": killPlayer,
                    "Q": killObject,
                    "R": killObjects,
                    "S": updateItemCounts,
                    "T": updateAge,
                    "U": updateUpgrades,
                    "V": updateItems,
                    "X": addProjectile,
                    "Y": remProjectile,
                    "Z": serverShutdownNotice,
                    "g": addAlliance,
                    "1": deleteAlliance,
                    "2": allianceNotification,
                    "3": setPlayerTeam,
                    "4": setAlliancePlayers,
                    "5": updateStoreItems,
                    "6": receiveChat,
                    "7": updateMinimap,
                    "8": showText,
                    "9": pingMap,
                    "0": pingSocketResponse
                });
            }
            function socketReady() {
                return (io.connected);
            }
            function joinParty() {
                var currentKey = serverBrowser.value;
                var key = prompt("party key", currentKey);
                if (key) {
                    window.onbeforeunload = undefined; // Don't ask to leave
                    window.location.href = "/?server=" + key;
                }
            }/**/

            // SOUND:
            var Sound = new SoundManager(config, UTILS);
            function toggleSound(active) {
                if (active == undefined)
                    active = !Sound.active;
                Sound.active = active;
                //Sound.toggleMute("menu", !active);
                saveVal("moo_moosic", active?1:0);
            }

            // MATHS:
            var mathPI = Math.PI;
            var mathPI2 = mathPI * 2;
            var mathPI3 = mathPI * 3;
            Math.lerpAngle = function (value1, value2, amount) {
                var difference = Math.abs(value2 - value1);
                if (difference > mathPI) {
                    if (value1 > value2) {
                        value2 += mathPI2;
                    } else {
                        value1 += mathPI2;
                    }
                }
                var value = (value2 + ((value1 - value2) * amount));
                if (value >= 0 && value <= mathPI2)
                    return value;
                return (value % mathPI2);
            }

            // REOUNDED RECTANGLE:
            CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                if (r < 0)
                    r = 0;
                this.beginPath();
                this.moveTo(x+r, y);
                this.arcTo(x+w, y, x+w, y+h, r);
                this.arcTo(x+w, y+h, x, y+h, r);
                this.arcTo(x, y+h, x, y, r);
                this.arcTo(x, y, x+w, y, r);
                this.closePath();
                return this;
            }

            // STORAGE:
            var canStore;
            if (typeof(Storage) !== "undefined") {
                canStore = true;
            }
            function saveVal(name, val) {
                if (canStore)
                    localStorage.setItem(name, val);
            }
            function deleteVal(name) {
                if (canStore)
                    localStorage.removeItem(name);
            }
            function getSavedVal(name) {
                if (canStore)
                    return localStorage.getItem(name);
                return null;
            }

            // TERMS:

            window.checkTerms = function(yes) {
                if (yes) {
                    consentBlock.style.display = "none";
                    saveVal("consent", 1);
                } else $("#consentShake").effect("shake");
            };

            // GLOBAL VALUES:
            var moofoll = getSavedVal("moofoll");
            function follmoo() {
                if (!moofoll) {
                    moofoll = true;
                    saveVal("moofoll", 1);
                }
            }
            var useNativeResolution;
            var showPing;
            var playSound;
            var pixelDensity = 1;
            var delta, now, lastSent;
            var lastUpdate = Date.now();
            var keys, attackState;
            var ais = [];
            var players = [];
            var alliances = [];
            var gameObjects = [];
            var projectiles = [];
            var projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
            var AiManager = __webpack_require__(/*! ./data/aiManager.js */ "./src/js/data/aiManager.js");
            var AI = __webpack_require__(/*! ./data/ai.js */ "./src/js/data/ai.js");
            var aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
            var player, playerSID, tmpObj;
            var waterMult = 1;
            var waterPlus = 0;
            var mouseX = 0;
            var mouseY = 0;
            var controllingTouch = {
                id: -1,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0
            };
            var attackingTouch = {
                id: -1,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0
            };
            var camX, camY;
            var tmpDir;
            var skinColor = 0;
            var maxScreenWidth = config.maxScreenWidth;
            var maxScreenHeight = config.maxScreenHeight;
            var screenWidth, screenHeight;
            var inGame = false;
            var adContainer = document.getElementById("ad-container");
            var mainMenu = document.getElementById("mainMenu");
            var enterGameButton = document.getElementById("enterGame");
            var promoImageButton = document.getElementById("promoImg");
            var partyButton = document.getElementById("partyButton");
            var joinPartyButton = document.getElementById("joinPartyButton");
            var settingsButton = document.getElementById("settingsButton");
            var settingsButtonTitle = settingsButton.getElementsByTagName("span")[0];
            var allianceButton = document.getElementById("allianceButton");
            var storeButton = document.getElementById("storeButton");
            var chatButton = document.getElementById("chatButton");
            var gameCanvas = document.getElementById("gameCanvas");
            var mainContext = gameCanvas.getContext("2d");
            var serverBrowser = document.getElementById("serverBrowser");
            var nativeResolutionCheckbox = document.getElementById("nativeResolution");
            var showPingCheckbox = document.getElementById("showPing");
            var playMusicCheckbox = document.getElementById("playMusic");
            var pingDisplay = document.getElementById("pingDisplay");
            var shutdownDisplay = document.getElementById("shutdownDisplay");
            var menuCardHolder = document.getElementById("menuCardHolder");
            var guideCard = document.getElementById("guideCard");
            var loadingText = document.getElementById("loadingText");
            var gameUI = document.getElementById("gameUI");
            var actionBar = document.getElementById("actionBar");
            var scoreDisplay = document.getElementById("scoreDisplay");
            var foodDisplay = document.getElementById("foodDisplay");
            var woodDisplay = document.getElementById("woodDisplay");
            var stoneDisplay = document.getElementById("stoneDisplay");
            var killCounter = document.getElementById("killCounter");
            var leaderboardData = document.getElementById("leaderboardData");
            var nameInput = document.getElementById("nameInput");
            var itemInfoHolder = document.getElementById("itemInfoHolder");
            var ageText = document.getElementById("ageText");
            var ageBarBody = document.getElementById("ageBarBody");
            var upgradeHolder = document.getElementById("upgradeHolder");
            var upgradeCounter = document.getElementById("upgradeCounter");
            var allianceMenu = document.getElementById("allianceMenu");
            var allianceHolder = document.getElementById("allianceHolder");
            var allianceManager = document.getElementById("allianceManager");
            var mapDisplay = document.getElementById("mapDisplay");
            var diedText = document.getElementById("diedText");
            var skinColorHolder = document.getElementById("skinColorHolder");
            var mapContext = mapDisplay.getContext("2d");
            mapDisplay.width = 300;
            mapDisplay.height = 300;
            var storeMenu = document.getElementById("storeMenu");
            var storeHolder = document.getElementById("storeHolder");
            var noticationDisplay = document.getElementById("noticationDisplay");
            var hats = store.hats;
            var accessories = store.accessories;
            var objectManager = new ObjectManager(GameObject, gameObjects, UTILS, config);
            var outlineColor = "#525252";
            var darkOutlineColor = "#3d3f42";
            var outlineWidth = 5.5;

            // SET INIT DATA:
            function setInitData(data) {
                alliances = data.teams;
            }

            // YOUTUBERS:
            var featuredYoutuber = document.getElementById('featuredYoutube');
            var youtuberList = [{
                name: "Corrupt X",
                link: "https://www.youtube.com/channel/UC0UH2LfQvBSeH24bmtbmITw"
            }, {
                name: "Tweak Big",
                link: "https://www.youtube.com/channel/UCbwvzJ38AndDTkoX8sD9YOw"
            }, {
                name: "Arena Closer",
                link: "https://www.youtube.com/channel/UCazucVSJqW-kiHMIhQhD-QQ"
            }, {
                name: "Godenot",
                link: "https://www.youtube.com/user/SirGodenot"
            }, {
                name: "RajNoobTV",
                link: "https://www.youtube.com/channel/UCVLo9brXBWrCttMaGzvm0-Q"
            }, {
                name: "TomNotTom",
                link: "https://www.youtube.com/channel/UC7z97RgHFJRcv2niXgArBDw"
            }, {
                name: "Nation",
                link: "https://www.youtube.com/channel/UCSl-MBn3qzjrIvLNESQRk-g"
            }, {
                name: "Pidyohago",
                link: "https://www.youtube.com/channel/UC04p8Mg8nDaDx04A9is2B8Q"
            }, {
                name: "Enigma",
                link: "https://www.youtube.com/channel/UC5HhLbs3sReHo8Bb9NDdFrg"
            }, {
                name: "Bauer",
                link: "https://www.youtube.com/channel/UCwU2TbJx3xTSlPqg-Ix3R1g"
            }, {
                name: "iStealth",
                link: "https://www.youtube.com/channel/UCGrvlEOsQFViZbyFDE6t69A"
            }, {
                name: "SICKmania",
                link: "https://www.youtube.com/channel/UCvVI98ezn4TpX5wDMZjMa3g"
            }, {
                name: "LightThief",
                link: "https://www.youtube.com/channel/UCj6C_tiDeATiKd3GX127XoQ"
            }, {
                name: "Fortish",
                link: "https://www.youtube.com/channel/UCou6CLU-szZA3Tb340TB9_Q"
            }, {
                name: "巧克力",
                link: "https://www.youtube.com/channel/UCgL6J6oL8F69vm-GcPScmwg"
            }, {
                name: "i Febag",
                link: "https://www.youtube.com/channel/UCiU6WZwiKbsnt5xmwr0OFbg"
            }, {
                name: "GoneGaming",
                link: "https://www.youtube.com/channel/UCOcQthRanYcwYY0XVyVeK0g"
            }];
            var tmpYoutuber = youtuberList[UTILS.randInt(0, youtuberList.length - 1)];
            featuredYoutuber = document.createElement("div");
            featuredYoutuber.innerHTML = "<a target='_blank' class='ytLink' href='" + tmpYoutuber.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + tmpYoutuber.name + "</a>";

            // ON LOAD:
            var inWindow = true;
            var didLoad = false;
            var captchaReady = false;
            window.onblur = function() {
                inWindow = false;
            };
            window.onfocus = function() {
                inWindow = true;
                if (player && player.alive) {
                    resetMoveDir();
                }
            };
            window.onload = function() {
                didLoad = true;
                connectSocketIfReady();

                setTimeout(function() {
                    if (!startedConnecting) {
                        alert("Captcha failed to load");
                        window.location.reload();
                    }
                }, 20 * 1000);
            };
            window.captchaCallback = function() {
                captchaReady = true;
                connectSocketIfReady();
            };
            gameCanvas.oncontextmenu = function() {
                return false;
            };
            function disconnect(reason) {
                connected = false;
                io.close();
                showLoadingText(reason);
            }
            function showLoadingText(text) {
                mainMenu.style.display = "block";
                gameUI.style.display = "none";
                menuCardHolder.style.display = "none";
                diedText.style.display = "none";
                loadingText.style.display = "block";
                loadingText.innerHTML = text +
                    "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>";
            }

            // BUTTON EVENTS:
            function bindEvents() {
                enterGameButton.onclick = UTILS.checkTrusted(enterGame);
                UTILS.hookTouchEvents(enterGameButton);
                promoImageButton.onclick = UTILS.checkTrusted(function() {
                    openLink('https://krunker.io/?play=SquidGame_KB');
                });
                UTILS.hookTouchEvents(promoImageButton);
                joinPartyButton.onclick = UTILS.checkTrusted(function() {
                    setTimeout(function() { joinParty(); }, 10);
                });
                UTILS.hookTouchEvents(joinPartyButton);
                settingsButton.onclick = UTILS.checkTrusted(function() {
                    toggleSettings();
                });
                UTILS.hookTouchEvents(settingsButton);
                allianceButton.onclick = UTILS.checkTrusted(function() {
                    toggleAllianceMenu();
                });
                UTILS.hookTouchEvents(allianceButton);
                storeButton.onclick = UTILS.checkTrusted(function() {
                    toggleStoreMenu();
                });
                UTILS.hookTouchEvents(storeButton);
                chatButton.onclick = UTILS.checkTrusted(function() {
                    toggleChat();
                });
                UTILS.hookTouchEvents(chatButton);
                mapDisplay.onclick = UTILS.checkTrusted(function() {
                    sendMapPing();
                });
                UTILS.hookTouchEvents(mapDisplay);
            }

            // SETUP SERVER SELECTOR:
            let gamesPerServer = 1,
                serverData, bestServer, usedServer;

            function setupServerStatus() {
                const { host } = window.location;
                const parent = host.split(".")[0];

                let url = "";

                switch(parent) {
                    case "sandbox":
                        url = "https://api-sandbox.moomoo.io"
                        break;
                    case "dev":
                        url = "https://api-dev.moomoo.io";
                        break;
                    default:
                        url = "https://api.moomoo.io"
                        break;
                }

                fetch(`${url}/servers?v=1.22`).then((res) => res.json()).then((parsed) => {
                    serverData = parsed;

                    for(let server of serverData) {
                        const start = Date.now();

                        fetch(`https://${server.key}.${server.region}.moomoo.io/ping`).then(res => res.text()).then(res => {
                            server.ping = Date.now() - start;
                        }).catch((event) => {});
                    }

                    setTimeout(() => updateServerList(true), 2e3);
                })
            }

            const fastServer = (servers) => {
                const availableServers = servers.filter(server => server.playerCount !== server.playerCapacity);

                if(!availableServers.length) return null;

                const bestPing = Math.min(...serverData.map(server => server.ping || Infinity));

                const bestPingServers = availableServers.filter(server => (!usedServer || (server.key !== usedServer)) && server.ping === bestPing);

                if(!bestPingServers.length) return null;

                const result = bestPingServers.reduce((bestServer, currentServer) => {
                    return bestServer.playerCount > currentServer.playerCount ? bestServer : currentServer
                });

                return result;
            }

            const regionInfo = {
                0: {
                    name: "Local",
                    latitude: 0,
                    longitude: 0,
                },
                "us-east": {
                    name: "Miami",
                    latitude: 40.1393329,
                    longitude: -75.8521818,
                },
                "us-west": {
                    name: "Silicon Valley",
                    latitude: 47.6149942,
                    longitude: -122.4759879,
                },
                gb: {
                    name: "London",
                    latitude: 51.5283063,
                    longitude: -0.382486,
                },
                "eu-west": {
                    name: "Frankfurt",
                    latitude: 50.1211273,
                    longitude: 8.496137,
                },
                au: {
                    name: "Sydney",
                    latitude: -33.8479715,
                    longitude: 150.651084,
                },
                sg: {
                    name: "Singapore",
                    latitude: 1.3147268,
                    longitude: 103.7065876,
                },
            };

            function stripRegionPrefix(region) {
                if (region.startsWith("vultr:")) {
                    return region.slice(6);
                } else if (region.startsWith("do:")) {
                    return region.slice(3);
                } else {
                    return region;
                }
            }

            let listOpen;

            function updateServerList(html) {
                if(!html) return setupServerStatus();

                if(!startedConnecting && !connected) bestServer = fastServer(serverData);

                if(listOpen) return;
                var tmpHTML = `<select id="serverSelector">`;

                // ADD SERVER SELECTOR:
                var overallTotal = 0;
                var regionCounter = 0;

                let lastRegion;

                for (var index in serverData) {
                    var server = serverData[index];

                    // ADD REGION LABELS:
                    var regionName = regionInfo[server.region].name;

                    // COUNT PLAYERS:
                    if(regionName !== lastRegion) {
                        var totalPlayers = 0;

                        serverData.forEach(server_ => {
                            if(server_.region === server.region) totalPlayers += server_.playerCount;
                        });

                        overallTotal += totalPlayers;

                        if(lastRegion) tmpHTML += `<option disabled></option>`;

                        tmpHTML += "<option disabled>" + regionName + " - " + totalPlayers + " players</option>"
                    }

                    let isSelected = bestServer && bestServer.region === server.region && bestServer.key === server.key ? "selected" : "";
                    let serverID = stripRegionPrefix(server.region) + ":" + server.key;
                    let serverLabel = `${regionName} ${server.name} [${server.playerCount}/${server.playerCapacity}] ${(server.ping || Infinity)}ms`;

                    if (isSelected) partyButton.getElementsByTagName("span")[0].innerText = server.name;

                    tmpHTML += `<option value=${serverID} ${isSelected}>${serverLabel}</option>`;

                    // ADD BREAK AFTER EACH SERVER:
                    if(lastRegion !== regionName) {
                        lastRegion = regionName;
                        // tmpHTML += "<option disabled></option>";

                        // INCREMENT COUNTER:
                        regionCounter++;
                    }
                }

                // ADD TOTAL PLAYERS:
                tmpHTML += "<option disabled></option><option disabled>All Servers - " + overallTotal + " players</option></select>";

                // SET HTML:
                serverBrowser.innerHTML = tmpHTML;

                // ALT SERVER:
                var altServerText;
                var altServerURL;
                if (location.hostname == "sandbox.moomoo.io") {
                    altServerText = "Back to MooMoo";
                    altServerURL = "//moomoo.io/";
                } else {
                    altServerText = "Try the sandbox";
                    altServerURL = "//sandbox.moomoo.io/";
                }

                document.getElementById("altServer").innerHTML = "<a href='" + altServerURL + "'>" + altServerText + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";

                let selector = document.getElementById("serverSelector");

                const events = [{
                    name: "change",
                    start: function(event){
                        let part = this.value.split(":");

                        this.blur();

                        io.close();
                        disconnect("disconnected");

                        setTimeout(() => {
                            showLoadingText("Loading...");

                            inGame = false;
                            player = null;
                            playerSID = null;
                            players = [];
                            gameObjects = [];
                            alliances = [];
                            GameObject = __webpack_require__(/*! ./data/gameObject.js */ "./src/js/data/gameObject.js");
                            MapManager = __webpack_require__(/*! ./data/mapManager.js */ "./src/js/data/mapManager.js");
                            objectManager = new ObjectManager(GameObject, gameObjects, UTILS, config);
                            Player = __webpack_require__(/*! ./data/player.js */ "./src/js/data/player.js");
                            store = __webpack_require__(/*! ./data/store.js */ "./src/js/data/store.js");
                            Projectile = __webpack_require__(/*! ./data/projectile.js */ "./src/js/data/projectile.js");
                            SoundManager = __webpack_require__(/*! ./libs/soundManager.js */ "./src/js/libs/soundManager.js").obj;
                            textManager = new animText.TextManager();
                            prepareMenuBackground();

                            let server = serverData.find(server => server.region === part[0] && server.key === part[1]);

                            let region = regionInfo[server.region].name.toLowerCase(),
                                name = server.name;

                            connectSocketIfReady(server);
                        }, 2e3);
                    }
                },{
                    name: "blur",
                    start: function(event){
                        listOpen = false;
                    }
                },{
                    name: "focus",
                    start: function(event){
                        listOpen = true;
                    }
                },{
                    name: "keyup",
                    start: function(event){
                        listOpen = true;
                    }
                }];

                for(let event of events) {
                    document.getElementById("serverSelector").addEventListener(event.name, function(){
                        event.start.call(this, event);
                    })
                }
            }

            updateServerList();
            setInterval(updateServerList, 3e3);
            // SERVER SELECTOR CHANGE LISTENER:
            serverBrowser.addEventListener("change", UTILS.checkTrusted(function() {
                //  let parts = serverBrowser.value.split(":");
                //   console.log(serverBrowser.value)
                //  vultrClient.switchServer(parts[0], parts[1], parts[2]);
            }));

            // SHOW ITEM INFO:
            function showItemInfo(item, isWeapon, isStoreItem) {
                if (player && item) {
                    UTILS.removeAllChildren(itemInfoHolder);
                    itemInfoHolder.classList.add("visible");
                    // chatButton.classList.add("hide");
                    UTILS.generateElement({
                        id: "itemInfoName",
                        text: UTILS.capitalizeFirst(item.name),
                        parent: itemInfoHolder
                    });
                    UTILS.generateElement({
                        id: "itemInfoDesc",
                        text: item.desc,
                        parent: itemInfoHolder
                    });
                    if (isStoreItem) {

                    } else if (isWeapon) {
                        UTILS.generateElement({
                            class: "itemInfoReq",
                            text: !item.type?"primary":"secondary",
                            parent: itemInfoHolder
                        });
                    } else {
                        for (var i = 0; i < item.req.length; i += 2) {
                            UTILS.generateElement({
                                class: "itemInfoReq",
                                html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                                parent: itemInfoHolder
                            });
                        }
                        if (item.group.limit) {
                            UTILS.generateElement({
                                class: "itemInfoLmt",
                                text: (player.itemCounts[item.group.id]||0) + "/" + item.group.limit,
                                parent: itemInfoHolder
                            });
                        }
                    }
                } else {
                    itemInfoHolder.classList.remove("visible");
                    // chatButton.classList.remove("hide");
                }
            }

            // SHOW ALLIANCE MENU:
            var allianceNotifications = [];
            var alliancePlayers = [];

            function ally(sid){
                if(sid === player.sid) return true;

                if(!alliancePlayers.length) return false;

                for(let index = 0; index < alliancePlayers.length; index += 2){
                    const _sid = alliancePlayers[index];

                    if(sid == _sid) return true;
                }
                return false;
            }

            function allianceNotification(sid, name) {
                allianceNotifications.push({
                    sid: sid,
                    name: name
                });
                updateNotifications();
            }
            function updateNotifications() {
                if (allianceNotifications[0]) {
                    var tmpN = allianceNotifications[0];
                    UTILS.removeAllChildren(noticationDisplay);
                    noticationDisplay.style.display = "block";
                    UTILS.generateElement({
                        class: "notificationText",
                        text: tmpN.name,
                        parent: noticationDisplay
                    });
                    UTILS.generateElement({
                        class: "notifButton",
                        html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
                        parent: noticationDisplay,
                        onclick: function() { aJoinReq(0); },
                        hookTouch: true
                    });
                    UTILS.generateElement({
                        class: "notifButton",
                        html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
                        parent: noticationDisplay,
                        onclick: function() { aJoinReq(1); },
                        hookTouch: true
                    });
                } else {
                    noticationDisplay.style.display = "none";
                }
            }
            function addAlliance(data) {
                alliances.push(data);
                if (allianceMenu.style.display == "block")
                    showAllianceMenu();
            }
            function setPlayerTeam(team, isOwner) {
                if (player) {
                    player.team = team;
                    player.isOwner = isOwner;
                    if (allianceMenu.style.display == "block")
                        showAllianceMenu();
                }
            }
            function setAlliancePlayers(data) {
                alliancePlayers = data;
                if (allianceMenu.style.display == "block")
                    showAllianceMenu();
            }
            function deleteAlliance(sid) {
                for (var i = alliances.length - 1; i >= 0; i--) {
                    if (alliances[i].sid == sid)
                        alliances.splice(i, 1);
                }
                if (allianceMenu.style.display == "block")
                    showAllianceMenu();
            }
            function toggleAllianceMenu() {
                resetMoveDir();
                if (allianceMenu.style.display != "block") {
                    showAllianceMenu();
                } else {
                    allianceMenu.style.display = "none";
                }
            }
            function showAllianceMenu() {
                if (player && player.alive) {
                    closeChat();
                    storeMenu.style.display = "none";
                    allianceMenu.style.display = "block";
                    UTILS.removeAllChildren(allianceHolder);
                    if (player.team) {
                        for (var i = 0; i < alliancePlayers.length; i+=2) {
                            (function(i) {
                                var tmp = UTILS.generateElement({
                                    class: "allianceItem",
                                    style: "color:" + (alliancePlayers[i]==player.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: alliancePlayers[i+1],
                                    parent: allianceHolder
                                });
                                if (player.isOwner && alliancePlayers[i] != player.sid) {
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        text: "Kick",
                                        onclick: function() { kickFromClan(alliancePlayers[i]); },
                                        hookTouch: true,
                                        parent: tmp
                                    });
                                }
                            })(i);
                        }
                    } else {
                        if (alliances.length) {
                            for (var i = 0; i < alliances.length; ++i) {
                                (function(i) {
                                    var tmp = UTILS.generateElement({
                                        class: "allianceItem",
                                        style: "color:" + (alliances[i].sid==player.team ? "#fff" : "rgba(255,255,255,0.6)"),
                                        text: alliances[i].sid,
                                        parent: allianceHolder
                                    });
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        text: "Join",
                                        onclick: function() { sendJoin(i); },
                                        hookTouch: true,
                                        parent: tmp
                                    });
                                })(i);
                            }
                        } else {
                            UTILS.generateElement({
                                class: "allianceItem",
                                text: "No Tribes Yet",
                                parent: allianceHolder
                            });
                        }
                    }
                    UTILS.removeAllChildren(allianceManager);
                    if (player.team) {
                        UTILS.generateElement({
                            class: "allianceButtonM",
                            style: "width: 360px",
                            text: player.isOwner? "Delete Tribe" : "Leave Tribe",
                            onclick: function() { leaveAlliance() },
                            hookTouch: true,
                            parent: allianceManager
                        });
                    } else {
                        UTILS.generateElement({
                            tag: "input",
                            type: "text",
                            id: "allianceInput",
                            maxLength: 7,
                            placeholder: "unique name",
                            ontouchstart: function(ev) {
                                ev.preventDefault();
                                var newValue = prompt("unique name", ev.currentTarget.value);
                                ev.currentTarget.value = newValue.slice(0, 7);
                            },
                            parent: allianceManager
                        });
                        UTILS.generateElement({
                            tag: "div",
                            class: "allianceButtonM",
                            style: "width: 140px;",
                            text: "Create",
                            onclick: function() { createAlliance(); },
                            hookTouch: true,
                            parent: allianceManager
                        });
                    }
                }
            }
            function aJoinReq(join) {
                io.send("11", allianceNotifications[0].sid, join);
                allianceNotifications.splice(0, 1);
                updateNotifications();
            }
            function kickFromClan(sid) {
                io.send("12", sid);
            }
            function sendJoin(index) {
                io.send("10", alliances[index].sid);
            }
            function createAlliance() {
                io.send("8", document.getElementById("allianceInput").value);
            }
            function leaveAlliance() {
                allianceNotifications = [];
                updateNotifications();
                io.send("9");
            }

            // window.testRateLimiting = function() {
            //     setInterval(() => {
            //         if (Math.random() > 0.5) {
            //             io.send("8", "test");
            //         } else {
            //             io.send("9");
            //         }
            //     }, 50);
            // }

            // MINIMAP:
            var lastDeath;
            var minimapData;
            var mapMarker;
            var mapPings = [];
            var tmpPing;
            function MapPing() {
                this.init = function(x, y) {
                    this.scale = 0;
                    this.x = x;
                    this.y = y;
                    this.active = true;
                };
                this.update = function(ctxt, delta) {
                    if (this.active) {
                        this.scale += 0.05 * delta;
                        if (this.scale >= config.mapPingScale) {
                            this.active = false;
                        } else {
                            ctxt.globalAlpha = (1-Math.max(0, this.scale/config.mapPingScale));
                            ctxt.beginPath();
                            ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale)
                                     * mapDisplay.width, this.scale, 0, 2 * Math.PI);
                            ctxt.stroke();
                        }
                    }
                };
            }
            function pingMap(x, y) {
                for (var i = 0; i < mapPings.length; ++i) {
                    if (!mapPings[i].active) {
                        tmpPing = mapPings[i];
                        break;
                    }
                }
                if (!tmpPing) {
                    tmpPing = new MapPing();
                    mapPings.push(tmpPing);
                }
                tmpPing.init(x, y);
            }
            function updateMapMarker() {
                if (!mapMarker)
                    mapMarker = {};
                mapMarker.x = player.x;
                mapMarker.y = player.y;
            }
            function updateMinimap(data) {
                minimapData = data;
            }
            function renderMinimap(delta) {
                if (player && player.alive) {
                    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);

                    // RENDER PINGS:
                    mapContext.strokeStyle = "#fff";
                    mapContext.lineWidth = 4;
                    for (var i = 0; i < mapPings.length; ++i) {
                        tmpPing = mapPings[i];
                        tmpPing.update(mapContext, delta);
                    }

                    // RENDER PLAYERS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#fff";
                    renderCircle((player.x/config.mapScale)*mapDisplay.width,
                                 (player.y/config.mapScale)*mapDisplay.height, 7, mapContext, true);
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (var i = 0; i < minimapData.length;) {
                            renderCircle((minimapData[i]/config.mapScale)*mapDisplay.width,
                                         (minimapData[i+1]/config.mapScale)*mapDisplay.height, 7, mapContext, true);
                            i+=2;
                        }
                    }

                    // DEATH LOCATION:
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x/config.mapScale)*mapDisplay.width,
                                            (lastDeath.y/config.mapScale)*mapDisplay.height);
                    }

                    // MAP MARKER:
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x/config.mapScale)*mapDisplay.width,
                                            (mapMarker.y/config.mapScale)*mapDisplay.height);
                    }
                }
            }

            // STORE MENU:
            var currentStoreIndex = 0;
            var playerItems = {};
            function changeStoreIndex(index) {
                if (currentStoreIndex != index) {
                    currentStoreIndex = index;
                    generateStoreList();
                }
            }
            function toggleStoreMenu() {
                if (storeMenu.style.display != "block") {
                    storeMenu.style.display = "block";
                    allianceMenu.style.display = "none";
                    closeChat();
                    generateStoreList();
                } else {
                    storeMenu.style.display = "none";
                }
            }
            function updateStoreItems(type, id, index) {
                if (index) {
                    if (!type)
                        player.tails[id] = 1;
                    else
                        player.tailIndex = id;
                } else {
                    if (!type)
                        player.skins[id] = 1;
                    else
                        player.skinIndex = id;
                }
                if (storeMenu.style.display == "block")
                    generateStoreList();
            }
            function generateStoreList() {
                if (player) {
                    UTILS.removeAllChildren(storeHolder);
                    var index = currentStoreIndex;
                    var tmpArray = index?accessories:hats;
                    for (var i = 0; i < tmpArray.length; ++i) {
                        if (!tmpArray[i].dontSell) {
                            (function(i) {
                                var tmp = UTILS.generateElement({
                                    id: "storeDisplay" + i,
                                    class: "storeItem",
                                    onmouseout: function() { showItemInfo(); },
                                    onmouseover: function() { showItemInfo(tmpArray[i], false, true); },
                                    parent: storeHolder
                                });
                                UTILS.hookTouchEvents(tmp, true);
                                UTILS.generateElement({
                                    tag: "img",
                                    class: "hatPreview",
                                    src: "../img/" + (index?"accessories/access_":"hats/hat_") + tmpArray[i].id + (tmpArray[i].topSprite?"_p":"") + ".png",
                                    parent: tmp
                                });
                                UTILS.generateElement({
                                    tag: "span",
                                    text: tmpArray[i].name,
                                    parent: tmp
                                });
                                if (index?(!player.tails[tmpArray[i].id]):(!player.skins[tmpArray[i].id])) {
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        style: "margin-top: 5px",
                                        text: "Buy",
                                        onclick: function() { storeBuy(tmpArray[i].id, index); },
                                        hookTouch: true,
                                        parent: tmp
                                    });
                                    UTILS.generateElement({
                                        tag: "span",
                                        class: "itemPrice",
                                        text: tmpArray[i].price,
                                        parent: tmp
                                    })
                                } else if ((index?player.tailIndex:player.skinIndex)==tmpArray[i].id) {
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        style: "margin-top: 5px",
                                        text: "Unequip",
                                        onclick: function() { storeEquip(0, index); },
                                        hookTouch: true,
                                        parent: tmp
                                    });
                                } else {
                                    UTILS.generateElement({
                                        class: "joinAlBtn",
                                        style: "margin-top: 5px",
                                        text: "Equip",
                                        onclick: function() { storeEquip(tmpArray[i].id, index); },
                                        hookTouch: true,
                                        parent: tmp
                                    });
                                }
                            })(i);
                        }
                    }
                }
            }
            function storeEquip(id, index) {
                io.send("13c", 0, id, index);
            }
            function storeBuy(id, index) {
                io.send("13c", 1, id, index);
            }

            // HIDE WINDOWS:
            function hideAllWindows() {
                storeMenu.style.display = "none";
                allianceMenu.style.display = "none";
                closeChat();
            }

            // PREPARE UI:
            function prepareUI() {

                // NATIVE RESOLUTION:
                var savedNativeValue = getSavedVal("native_resolution");
                if (!savedNativeValue) {
                    setUseNativeResolution(typeof cordova !== "undefined"); // Only default to native if on mobile
                } else {
                    setUseNativeResolution(savedNativeValue == "true");
                }

                // SHOW PING:
                showPing = getSavedVal("show_ping") == "true";
                pingDisplay.hidden = !showPing;

                // LOAD SOUND SETTING:
                playSound = getSavedVal("moo_moosic")||0;

                // SKIN COLOR PICKER:
                updateSkinColorPicker();

                // ACTION BAR:
                UTILS.removeAllChildren(actionBar);
                for (var i = 0; i < (items.weapons.length+items.list.length); ++i) {
                    (function(i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none",
                            onmouseout: function() {
                                showItemInfo();
                            },
                            parent: actionBar
                        });
                    })(i);
                }
                for (var i = 0; i < (items.list.length + items.weapons.length); ++i) {
                    (function(i) {
                        var tmpCanvas = document.createElement('canvas');
                        tmpCanvas.width = tmpCanvas.height = 66;
                        var tmpContext = tmpCanvas.getContext('2d');
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.imageSmoothingEnabled = false;
                        tmpContext.webkitImageSmoothingEnabled = false;
                        tmpContext.mozImageSmoothingEnabled = false;
                        if (items.weapons[i]) {
                            tmpContext.rotate((Math.PI/4)+Math.PI);
                            var tmpSprite = new Image();
                            toolSprites[items.weapons[i].src] = tmpSprite;
                            tmpSprite.onload = function() {
                                this.isLoaded = true;
                                var tmpPad = 1 / (this.height / this.width);
                                var tmpMlt = (items.weapons[i].iPad || 1);
                                tmpContext.drawImage(this, -(tmpCanvas.width*tmpMlt*config.iconPad*tmpPad)/2, -(tmpCanvas.height*tmpMlt*config.iconPad)/2,
                                                     tmpCanvas.width*tmpMlt*tmpPad*config.iconPad, tmpCanvas.height*tmpMlt*config.iconPad);
                                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                                tmpContext.globalCompositeOperation = "source-atop";
                                tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                                document.getElementById('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            };
                            tmpSprite.src = ".././img/weapons/" + items.weapons[i].src + ".png";
                            var tmpUnit = document.getElementById('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectToBuild(i, true);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            var tmpSprite = getItemSprite(items.list[i-items.weapons.length], true);
                            var tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                            tmpContext.globalAlpha = 1;
                            tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            document.getElementById('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            var tmpUnit = document.getElementById('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.list[i-items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectToBuild(i-items.weapons.length);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        }
                    })(i);
                }

                // MOBILE NAME INPUT:
                nameInput.ontouchstart = UTILS.checkTrusted(function(e) {
                    e.preventDefault();
                    var newValue = prompt("enter name", e.currentTarget.value);
                    e.currentTarget.value = newValue.slice(0, 15);
                });

                // SETTINGS:
                nativeResolutionCheckbox.checked = useNativeResolution;
                nativeResolutionCheckbox.onchange = UTILS.checkTrusted(function(e) {
                    setUseNativeResolution(e.target.checked);
                });
                showPingCheckbox.checked = showPing;
                showPingCheckbox.onchange = UTILS.checkTrusted(function(e) {
                    showPing = showPingCheckbox.checked;
                    pingDisplay.hidden = !showPing;
                    saveVal("show_ping", showPing ? "true" : "false");
                });

                // PLAY MENU SOUND:
                // Sound.play("menu", 1, true);
            }
            function updateItems(data, wpn) {
                if (data) {
                    if (wpn) player.weapons = data;
                    else player.items = data;
                }
                for (var i = 0; i < items.list.length; ++i) {
                    var tmpI = (items.weapons.length + i);
                    document.getElementById("actionBarItem" + tmpI).style.display = (player.items.indexOf(items.list[i].id)>=0)?"inline-block":"none";
                }
                for (var i = 0; i < items.weapons.length; ++i) {
                    document.getElementById("actionBarItem" + i).style.display =
                        (player.weapons[items.weapons[i].type]==items.weapons[i].id)?"inline-block":"none";
                }
            }
            function setUseNativeResolution(useNative) {
                useNativeResolution = useNative;
                pixelDensity = useNative ? (window.devicePixelRatio || 1) : 1;
                nativeResolutionCheckbox.checked = useNative;
                saveVal("native_resolution", useNative.toString());
                resize();
            }
            function updateGuide() {
                if (usingTouch) {
                    guideCard.classList.add("touch");
                } else {
                    guideCard.classList.remove("touch");
                }
            }

            // SETTINGS STUFF:
            function toggleSettings() {
                if (guideCard.classList.contains("showing")) {
                    guideCard.classList.remove("showing");
                    settingsButtonTitle.innerText = "Settings";
                } else {
                    guideCard.classList.add("showing");
                    settingsButtonTitle.innerText = "Close";
                }
            }

            // SELECT SKIN COLOR:
            function updateSkinColorPicker() {
                var tmpHTML = "";
                for (var i = 0; i < config.skinColors.length; ++i) {
                    if (i == skinColor) {
                        tmpHTML += ("<div class='skinColorItem activeSkin' style='background-color:" +
                                    config.skinColors[i] + "' onclick='selectSkinColor(" + i + ")'></div>");
                    } else {
                        tmpHTML += ("<div class='skinColorItem' style='background-color:" +
                                    config.skinColors[i] + "' onclick='selectSkinColor(" + i + ")'></div>");
                    }
                }
                skinColorHolder.innerHTML = tmpHTML;
            }
            function selectSkinColor(index) {
                skinColor = index;
                updateSkinColorPicker();
            }

            // CHAT STUFF:
            var chatBox = document.getElementById("chatBox");
            var chatHolder = document.getElementById("chatHolder");
            function toggleChat() {
                if (!usingTouch) {
                    if (chatHolder.style.display == "block") {
                        if (chatBox.value) {
                            sendChat(chatBox.value);
                        }
                        closeChat();
                    } else {
                        storeMenu.style.display = "none";
                        allianceMenu.style.display = "none";
                        chatHolder.style.display = "block";
                        chatBox.focus();
                        resetMoveDir();
                    }
                } else {
                    setTimeout(function() { // Timeout lets the `hookTouchEvents` function exit
                        var chatMessage = prompt("chat message");
                        if (chatMessage) {
                            sendChat(chatMessage);
                        }
                    }, 1);
                }
                chatBox.value = "";
            }
            function sendChat(message) {
                io.send("ch", message.slice(0, 30));
            }
            function closeChat() {
                chatBox.value = "";
                chatHolder.style.display = "none";
            }

            // SEND MESSAGE:
            var profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
            function checkProfanityString(text) {
                var tmpString;
                for (var i = 0; i < profanityList.length; ++i) {
                    if (text.indexOf(profanityList[i]) > -1) {
                        tmpString = "";
                        for (var y = 0; y < profanityList[i].length; ++y) {
                            tmpString += tmpString.length?"o":"M";
                        }
                        var re = new RegExp(profanityList[i], 'g');
                        text = text.replace(re, tmpString);
                    }
                }
                return text;
            }
            function receiveChat(sid, message) {
                var tmpPlayer = findPlayerBySID(sid);
                if (tmpPlayer) {
                    tmpPlayer.chatMessage = checkProfanityString(message);
                    tmpPlayer.chatCountdown = config.chatCountdown;
                }
            }

            // RESIZE:
            window.addEventListener('resize', UTILS.checkTrusted(resize));
            function resize() {
                screenWidth = window.innerWidth;
                screenHeight = window.innerHeight;
                var scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
                gameCanvas.width = screenWidth * pixelDensity;
                gameCanvas.height = screenHeight * pixelDensity;
                gameCanvas.style.width = screenWidth + "px";
                gameCanvas.style.height = screenHeight + "px";
                mainContext.setTransform(
                    scaleFillNative, 0,
                    0, scaleFillNative,
                    (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
                    (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
                );
            }
            resize();

            // TOUCH INPUT:
            var usingTouch;
            setUsingTouch(false);
            function setUsingTouch(using) {
                usingTouch = using;
                updateGuide();
                // if (using) {
                //     chatButton.classList.add("mobile");
                // } else {
                //     chatButton.classList.remove("mobile");
                // }
            }
            window.setUsingTouch = setUsingTouch;

            gameCanvas.addEventListener('touchmove', UTILS.checkTrusted(touchMove), false);
            function touchMove(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                setUsingTouch(true);
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    var t = ev.changedTouches[i];
                    if (t.identifier == controllingTouch.id) {
                        controllingTouch.currentX = t.pageX;
                        controllingTouch.currentY = t.pageY;
                        sendMoveDir();
                    } else if (t.identifier == attackingTouch.id) {
                        attackingTouch.currentX = t.pageX;
                        attackingTouch.currentY = t.pageY;
                        attackState = 1;
                    }
                }
            }
            gameCanvas.addEventListener('touchstart', UTILS.checkTrusted(touchStart), false);
            function touchStart(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                setUsingTouch(true);
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    var t = ev.changedTouches[i];
                    if (t.pageX < document.body.scrollWidth / 2 && controllingTouch.id == -1) {
                        controllingTouch.id = t.identifier;
                        controllingTouch.startX = controllingTouch.currentX = t.pageX;
                        controllingTouch.startY = controllingTouch.currentY = t.pageY;
                        sendMoveDir();
                    } else if (t.pageX > document.body.scrollWidth / 2 && attackingTouch.id == -1) {
                        attackingTouch.id = t.identifier;
                        attackingTouch.startX = attackingTouch.currentX = t.pageX;
                        attackingTouch.startY = attackingTouch.currentY = t.pageY;
                        if (player.buildIndex < 0) {
                            attackState = 1;
                            sendAtckState();
                        }
                    }
                }
            }
            gameCanvas.addEventListener('touchend', UTILS.checkTrusted(touchEnd), false);
            gameCanvas.addEventListener('touchcancel', UTILS.checkTrusted(touchEnd), false);
            gameCanvas.addEventListener('touchleave', UTILS.checkTrusted(touchEnd), false);
            function touchEnd(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                setUsingTouch(true);
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    var t = ev.changedTouches[i];
                    if (t.identifier == controllingTouch.id) {
                        controllingTouch.id = -1;
                        sendMoveDir();
                    } else if (t.identifier == attackingTouch.id) {
                        attackingTouch.id = -1;
                        if (player.buildIndex >= 0) {
                            attackState = 1;
                            sendAtckState();
                        }
                        attackState = 0;
                        sendAtckState();
                    }
                }
            }


            // MOUSE INPUT:
            gameCanvas.addEventListener('mousemove', gameInput, false);
            function gameInput(e) {
                e.preventDefault();
                e.stopPropagation();
                setUsingTouch(false);
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            gameCanvas.addEventListener('mousedown', mouseDown, false);
            function mouseDown(e) {
                setUsingTouch(false);
                if (attackState != 1) {
                    attackState = 1;
                    sendAtckState();
                }
            }
            gameCanvas.addEventListener('mouseup', mouseUp, false);
            function mouseUp(e) {
                setUsingTouch(false);
                if (attackState != 0) {
                    attackState = 0;
                    sendAtckState();
                }
            }

            // INPUT UTILS:
            function getMoveDir() {
                var dx = 0;
                var dy = 0;
                if (controllingTouch.id != -1) {
                    dx += controllingTouch.currentX - controllingTouch.startX;
                    dy += controllingTouch.currentY - controllingTouch.startY;
                } else {
                    for (var key in moveKeys) {
                        var tmpDir = moveKeys[key];
                        dx += !!keys[key] * tmpDir[0];
                        dy += !!keys[key] * tmpDir[1];
                    }
                }
                return (dx == 0 && dy == 0) ? undefined : UTILS.fixTo(Math.atan2(dy, dx), 2);
            }
            var lastDir;
            function getAttackDir() {
                if (!player)
                    return 0;
                if (attackingTouch.id != -1) {
                    lastDir = Math.atan2(
                        attackingTouch.currentY - attackingTouch.startY,
                        attackingTouch.currentX - attackingTouch.startX
                    );
                } else if (!player.lockDir && !usingTouch) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return UTILS.fixTo(lastDir || 0, 2);
            }

            // KEYS:
            var keys = {};
            var moveKeys = {
                87: [0,-1],
                38: [0,-1],
                83: [0,1],
                40: [0,1],
                65: [-1,0],
                37: [-1,0],
                68: [1,0],
                39: [1,0]
            };
            function resetMoveDir() {
                keys = {};
                io.send("rmd");
            }
            function keysActive() {
                return (allianceMenu.style.display != "block"
                        && chatHolder.style.display != "block");
            }
            function keyDown(event) {
                var keyNum = event.which||event.keyCode||0;
                if (keyNum == 27) {
                    hideAllWindows();
                } else if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (keyNum == 88) {
                            sendLockDir();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            selectToBuild(player.weapons[keyNum - 49], true);
                        } else if (player.items[keyNum - 49 - player.weapons.length] != undefined) {
                            selectToBuild(player.items[keyNum - 49 - player.weapons.length]);
                        } else if (keyNum == 81) {
                            selectToBuild(player.items[0]);
                        } else if (keyNum == 82) {
                            sendMapPing();
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (keyNum == 32) {
                            attackState = 1;
                            sendAtckState();
                        }
                    }
                }
            }
            window.addEventListener('keydown', UTILS.checkTrusted(keyDown));
            function keyUp(event) {
                if (player && player.alive) {
                    var keyNum = event.which||event.keyCode||0;
                    if (keyNum == 13) {
                        toggleChat();
                    } else if (keysActive()) {
                        if (keys[keyNum]) {
                            keys[keyNum] = 0;
                            if (moveKeys[keyNum]) {
                                sendMoveDir();
                            } else if (keyNum == 32) {
                                attackState = 0;
                                sendAtckState();
                            }
                        }
                    }
                }
            }
            window.addEventListener('keyup',  UTILS.checkTrusted(keyUp));
            function sendAtckState() {
                if (player && player.alive) {
                    io.send("c", attackState, (player.buildIndex >= 0?getAttackDir():null));
                }
            }
            var lastMoveDir = undefined;
            function sendMoveDir() {
                var newMoveDir = getMoveDir();
                if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                    io.send("33", newMoveDir);
                    lastMoveDir = newMoveDir;
                }
            }
            function sendLockDir() {
                player.lockDir = player.lockDir?0:1;
                io.send("7", 0);
            }
            function sendMapPing() {
                io.send("14", 1);
            }
            function sendAutoGather() {
                io.send("7", 1);
            }
            function selectToBuild(index, wpn) {
                io.send("5", index, wpn);
            }

            // ENTER GAME:
            function enterGame() {
                window.FRVR && window.FRVR.tracker.levelStart("game_start")

                const sandbox = window.location.host.includes("sandbox");

                if(sandbox) {
                    let elements = document.getElementsByClassName("resourceDisplay");
                    let index = 0, length = elements.length;

                    while(index < length) {
                        const element = elements[index];

                        if(element) {
                            element.style.display = "block";
                            if(element.id !== "killCounter") element.style.display = "none";
                        }

                        index += 1;
                    }
                }

                saveVal("moo_name", nameInput.value);
                if (!inGame && socketReady()) {
                    inGame = true;
                    Sound.stop("menu");
                    showLoadingText("Loading...");
                    io.send("sp", {
                        name: nameInput.value,
                        moofoll: moofoll,
                        skin: skinColor
                    });
                }
            }

            // SETUP GAME:
            var firstSetup = true;
            function setupGame(yourSID) {
                loadingText.style.display = "none";
                menuCardHolder.style.display = "block";
                mainMenu.style.display = "none";
                keys = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                //if (firstSetup) {
                firstSetup = false;
                gameObjects.length = 0;
                //}
            }

            // SHOW ANIM TEXT:
            function showText(x, y, value, obj, safe) {
                if(stackTexts) {
                    const north = value >= 0 ? "plus" : "minus";

                    if(typeof safe !== "bigint") {
                        if(north === "minus") return; // remove heal text

                        let similar = storage.findIndex(text => text.function == showText && text.data[0] === x && text.data[1] === y);

                        if(similar > -1) {
                            let item = storage[similar];

                            item.data[3][north] += value;

                            return;
                        }

                        const obj = {
                            plus: Math.max(value, 0),
                            minus: Math.min(value, 0)
                        };

                        return storage.push({function: showText, data: [x, y, value, obj]});
                    }

                    value = obj[north];
                }

                const textSize = Math.abs(value).toString().length * 25 * (value / 100);

                textManager.showText(x, y, textSize, 0.18, 500, Math.abs(value), (value>=0)?"#fff":"#8ecc51");
            }

            // KILL PLAYER:
            var deathTextScale = 99999;
            function killPlayer() {
                inGame = false;
                try {
                    factorem.refreshAds([2], true);
                } catch (e) {};
                gameUI.style.display = "none";
                hideAllWindows();
                lastDeath = {
                    x: player.x,
                    y: player.y
                };
                loadingText.style.display = "none";
                diedText.style.display = "block";
                diedText.style.fontSize = "0px";
                deathTextScale = 0;
                setTimeout(function() {
                    menuCardHolder.style.display = "block";
                    mainMenu.style.display = "block";
                    // Sound.play("menu", 1, true);
                    diedText.style.display = "none";
                }, config.deathFadeout);
            }

            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }

            // KILL OBJECT:
            function killObject(sid) {
                objectManager.disableBySid(sid);
            }

            // UPDATE SCORE DISPLAY:
            function updateStatusDisplay() {
                scoreDisplay.innerText = player.points;
                foodDisplay.innerText = player.food;;
                woodDisplay.innerText = player.wood;
                stoneDisplay.innerText = player.stone;
                killCounter.innerText = player.kills;
            }

            // ICONS:
            var iconSprites = {};
            var icons = ["crown", "skull"];
            function loadIcons() {
                for (var i = 0; i < icons.length; ++i) {
                    var tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = ".././img/icons/" + icons[i] + ".png";
                    iconSprites[icons[i]] = tmpSprite;
                }
            }

            // UPDATE UPGRADES:
            var tmpList = [];
            function updateUpgrades(points, age) {
                player.upgradePoints = points;
                player.upgrAge = age;
                if (points > 0) {
                    tmpList.length = 0;
                    UTILS.removeAllChildren(upgradeHolder);
                    for (var i = 0; i < items.weapons.length; ++i) {
                        if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                            var e = UTILS.generateElement({
                                id: "upgradeItem" + i,
                                class: "actionBarItem",
                                onmouseout: function() { showItemInfo(); },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = document.getElementById("actionBarItem" + i).style.backgroundImage;
                            tmpList.push(i);
                        }
                    }
                    for (var i = 0; i < items.list.length; ++i) {
                        if (items.list[i].age == age && (items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                            var tmpI = (items.weapons.length + i);
                            var e = UTILS.generateElement({
                                id: "upgradeItem" + tmpI,
                                class: "actionBarItem",
                                onmouseout: function() { showItemInfo(); },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = document.getElementById("actionBarItem" + tmpI).style.backgroundImage;
                            tmpList.push(tmpI);
                        }
                    }
                    for (var i = 0; i < tmpList.length; i++) {
                        (function(i) {
                            var tmpItem = document.getElementById('upgradeItem' + i);
                            tmpItem.onmouseover = function() {
                                if (items.weapons[i]) {
                                    showItemInfo(items.weapons[i], true);
                                } else {
                                    showItemInfo(items.list[i-items.weapons.length]);
                                }
                            };
                            tmpItem.onclick = UTILS.checkTrusted(function() {
                                io.send("6", i);
                            });
                            UTILS.hookTouchEvents(tmpItem);
                        })(tmpList[i]);
                    }
                    if (tmpList.length) {
                        upgradeHolder.style.display = "block";
                        upgradeCounter.style.display = "block";
                        upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
                    } else {
                        upgradeHolder.style.display = "none";
                        upgradeCounter.style.display = "none";
                        showItemInfo();
                    }
                } else {
                    upgradeHolder.style.display = "none";
                    upgradeCounter.style.display = "none";
                    showItemInfo();
                }
            }
            function sendUpgrade(index) {
                io.send("6", index);
            }

            // UPDATE AGE:
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
                if (age == config.maxAge) {
                    ageText.innerHTML = "MAX AGE";
                    ageBarBody.style.width = "100%";
                } else {
                    ageText.innerHTML = "AGE " + player.age;
                    ageBarBody.style.width = ((player.XP/player.maxXP) * 100) + "%";
                }
            }

            // UPDATE LEADERBOARD:
            function updateLeaderboard(data) {
                UTILS.removeAllChildren(leaderboardData);
                var tmpC = 1;
                for (var i = 0; i < data.length; i += 3) {
                    (function(i) {
                        UTILS.generateElement({
                            class: "leaderHolder",
                            parent: leaderboardData,
                            children: [
                                UTILS.generateElement({
                                    class: "leaderboardItem",
                                    style: "color:" + ((data[i] == playerSID) ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: tmpC + ". " + (data[i+1] != "" ? data[i+1] : "unknown")
                                }),
                                UTILS.generateElement({
                                    class: "leaderScore",
                                    text: UTILS.kFormat(data[i+2]) || "0"
                                })
                            ]
                        });
                    })(i);
                    tmpC++;
                }
            }

            const Volcano = {
                animationTime: 0,
                land: null,
                lava: null,
                x: config.volcano.x,
                y: config.volcano.y
            };

            const renderVolcano = (x, y) => {
                const circleScale = config.volcanoScale * 3.2;

                mainContext.beginPath();
                mainContext.strokeStyle = "red";
                mainContext.globalAlpha = 0.2;

                mainContext.arc(config.volcano.x - x, config.volcano.y - y, circleScale, 0, Math.PI * 2, false);
                mainContext.fill();

                mainContext.closePath();
            }

            const drawBar = (be, tmpObj, x, y, color, min, limit, width = 0) => {
                be.fillStyle = darkOutlineColor;
                be.roundRect(x - config.healthBarWidth - config.healthBarPad, y + tmpObj.scale + config.nameY, 2 * (config.healthBarWidth + width) + 2 * config.healthBarPad, 17, 8);
                be.fill();
                be.fillStyle = color;
                be.roundRect(x - config.healthBarWidth, y + tmpObj.scale + config.nameY + config.healthBarPad, 2 * (config.healthBarWidth + width) * (min / limit), 17 - 2 * config.healthBarPad, 7);
                be.fill();

                if(tmpObj.isItem) {
                    be.fillStyle = "#fff";
                    be.lineJoin = "round";
                    be.font = "8px Hammersmith One";
                    be.strokeStyle = darkOutlineColor;
                    be.lineWidth = 3;
                    be.strokeText(`HP: ${Math.floor(min)}/${Math.floor(limit)}`,x,y + tmpObj.scale + config.nameY + config.healthBarPad - 2);
                    be.fillText(`HP: ${Math.floor(min)}/${Math.floor(limit)}`,x,y + tmpObj.scale + config.nameY + config.healthBarPad - 2);
                }
            }

            // UPDATE GAME:
            function updateGame() {
                if (true) {

                    // UPDATE DIRECTION:
                    if (player) {
                        if (!lastSent || now - lastSent >= (1000 / config.clientSendRate)) {
                            lastSent = now;
                            io.send("2", getAttackDir());
                        }
                    }

                    // DEATH TEXT:
                    if (deathTextScale < 120) {
                        deathTextScale += 0.1 * delta;
                        diedText.style.fontSize = Math.min(Math.round(deathTextScale), 120) + "px";
                    }

                    // MOVE CAMERA:
                    if (player) {
                        var tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
                        var tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
                        var camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                        if (tmpDist > 0.05) {
                            camX += camSpd * Math.cos(tmpDir);
                            camY += camSpd * Math.sin(tmpDir);
                        } else {
                            camX = player.x;
                            camY = player.y;
                        }
                    } else {
                        camX = config.mapScale / 2;
                        camY = config.mapScale / 2;
                    }

                    // INTERPOLATE PLAYERS AND AI:
                    var lastTime = now - (1000 / config.serverUpdateRate);
                    var tmpDiff;
                    for (var i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i]||ais[i-players.length];
                        if (tmpObj && tmpObj.visible) {
                            if (tmpObj.forcePos) {
                                tmpObj.x = tmpObj.x2;
                                tmpObj.y = tmpObj.y2;
                                tmpObj.dir = tmpObj.d2;
                            } else {
                                var total = tmpObj.t2 - tmpObj.t1;
                                var fraction = lastTime - tmpObj.t1;
                                var ratio = (fraction / total);
                                var rate = 170;
                                tmpObj.dt += delta;
                                var tmpRate = Math.min(1.7, tmpObj.dt / rate);
                                var tmpDiff = (tmpObj.x2 - tmpObj.x1);
                                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                                tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                            }
                        }
                    }

                    // RENDER CORDS:
                    var xOffset = camX - (maxScreenWidth / 2);
                    var yOffset = camY - (maxScreenHeight / 2);

                    // RENDER BACKGROUND:
                    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= 0) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                                             maxScreenHeight - (config.snowBiomeTop - yOffset));
                    } else {
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth,
                                             (config.mapScale - config.snowBiomeTop - yOffset));
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                                             maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
                    }

                    // RENDER WATER AREAS:
                    if (!firstSetup) {
                        waterMult += waterPlus * config.waveSpeed * delta;
                        if (waterMult >= config.waveMax) {
                            waterMult = config.waveMax;
                            waterPlus = -1;
                        } else if (waterMult <= 1) {
                            waterMult = waterPlus = 1;
                        }
                        mainContext.globalAlpha = 1;
                        mainContext.fillStyle = "#dbc666";
                        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
                        mainContext.fillStyle = "#91b2db";
                        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
                    }

                    // RENDER VOLCANO:
                    mainContext.beginPath();

                    const lineWidth = 20;

                    mainContext.lineWidth = lineWidth;
                    mainContext.strokeStyle = "red";
                    mainContext.globalAlpha = 0.2;

                    mainContext.moveTo(12400 - xOffset, 12400 - yOffset);
                    mainContext.lineTo(14400 - xOffset, 12400 - yOffset);

                    mainContext.moveTo(12400 - xOffset, 12400 - lineWidth/2 - yOffset);
                    mainContext.lineTo(12400 - xOffset, 14400 - yOffset);

                    mainContext.stroke();
                    mainContext.closePath();

                    renderVolcano(xOffset, yOffset);

                    // RENDER GRID:
                    if(gridSize) {
                        mainContext.lineWidth = 4;
                        mainContext.strokeStyle = "#000";
                        mainContext.globalAlpha = 0.06;
                        mainContext.beginPath();
                        for (var x = -camX; x < maxScreenWidth; x += maxScreenHeight / gridSize) {
                            if (x > 0) {
                                mainContext.moveTo(x, 0);
                                mainContext.lineTo(x, maxScreenHeight);
                            }
                        }
                        for (var y = -camY; y < maxScreenHeight; y += maxScreenHeight / gridSize) {
                            if (x > 0) {
                                mainContext.moveTo(0, y);
                                mainContext.lineTo(maxScreenWidth, y);
                            }
                        }
                        mainContext.stroke();
                    }

                    // RENDER BOTTOM LAYER:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);

                    // RENDER PROJECTILES:
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);

                    // RENDER PLAYERS:
                    renderPlayers(xOffset, yOffset, 0);

                    // RENDER AI:
                    mainContext.globalAlpha = 1;
                    for (var i = 0; i < ais.length; ++i) {
                        tmpObj = ais[i];
                        if (tmpObj.active && tmpObj.visible) {
                            tmpObj.animate(delta);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir+tmpObj.dirPlus-(Math.PI/2));
                            renderAI(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }

                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);

                    // MAP BOUNDARIES:
                    mainContext.fillStyle = "#000";
                    mainContext.globalAlpha = 0.09;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    } if (config.mapScale - xOffset <= maxScreenWidth) {
                        var tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    } if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    } if (config.mapScale - yOffset <= maxScreenHeight) {
                        var tmpX = Math.max(0, -xOffset);
                        var tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }

                    // RENDER DAY/NIGHT TIME:
                    mainContext.globalAlpha = 1;
                    mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);

                    // RENDER PLAYER AND AI UI:
                    mainContext.strokeStyle = darkOutlineColor;
                    for (var i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i]||ais[i-players.length];
                        if (tmpObj.visible) {

                            // NAME AND HEALTH:
                            if (tmpObj.skinIndex != 10 || (tmpObj==player) || (tmpObj.team && tmpObj.team==player.team)) {
                                var tmpText = (tmpObj.team?"["+tmpObj.team+"] ":"")+(tmpObj.name||"");
                                if (tmpText != "") {
                                    mainContext.font = (tmpObj.nameScale||30) + "px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                    mainContext.lineJoin = "round";
                                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    } if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    }
                                } if (tmpObj.health > 0) {
                                    const peace = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team));

                                    // HEALTH BAR:
                                    let color = peace ? "#8ecc51" : "#cc5151",
                                        fillCount = tmpObj.health,
                                        fillLimit = tmpObj.maxHealth;

                                    drawBar(mainContext, tmpObj, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY + 75, color, fillCount, fillLimit);

                                    if(tmpObj.isPlayer) {
                                        // PRIMARY BAR:
                                        color = tmpObj.reloads[0].ready ? (peace ? "#8ecc51" : "#cc5151") : (peace ? "#b7cc51" : "#b66868");
                                        fillCount = Math.min(tmpObj.reloads[0].limit_, Date.now() - (tmpObj.reloads[0].date || 0));
                                        fillLimit = tmpObj.reloads[0].limit_;

                                        drawBar(mainContext, tmpObj, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY + 60, color, fillCount, fillLimit, -26.5);

                                        // SECONDARY BAR:
                                        color = tmpObj.reloads[1].ready ? (peace ? "#8ecc51" : "#cc5151") : (peace ? "#b7cc51" : "#b66868");
                                        fillCount = Math.min(tmpObj.reloads[1].limit_, Date.now() - (tmpObj.reloads[1].date || 0));
                                        fillLimit = tmpObj.reloads[1].limit_;

                                        drawBar(mainContext, tmpObj, tmpObj.x - xOffset + 52.5, tmpObj.y - yOffset - tmpObj.scale - config.nameY + 60, color, fillCount, fillLimit, -26.5);
                                    }
                                }
                            }
                        }
                    }

                    // RENDER ANIM TEXTS:
                    textManager.update(delta, mainContext, xOffset, yOffset);

                    // RENDER CHAT MESSAGES:
                    for (var i = 0; i < players.length; ++i) {
                        tmpObj = players[i];
                        if (tmpObj.visible && tmpObj.chatCountdown > 0) {
                            tmpObj.chatCountdown -= delta;
                            if (tmpObj.chatCountdown <= 0)
                                tmpObj.chatCountdown = 0;
                            mainContext.font = "32px Hammersmith One";
                            var tmpSize = mainContext.measureText(tmpObj.chatMessage);
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            var tmpX = tmpObj.x - xOffset;
                            var tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                            var tmpH = 47;
                            var tmpW = tmpSize.width + 17;
                            mainContext.fillStyle = "rgba(0,0,0,0.2)";
                            mainContext.roundRect(tmpX-tmpW/2, tmpY-tmpH/2, tmpW, tmpH, 6);
                            mainContext.fill();
                            mainContext.fillStyle = "#fff";
                            mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                        }
                    }
                }

                // RENDER MINIMAP:
                renderMinimap(delta);

                // RENDER CONTROLS:
                if (controllingTouch.id !== -1) {
                    renderControl(
                        controllingTouch.startX, controllingTouch.startY,
                        controllingTouch.currentX, controllingTouch.currentY
                    );
                }
                if (attackingTouch.id !== -1) {
                    renderControl(
                        attackingTouch.startX, attackingTouch.startY,
                        attackingTouch.currentX, attackingTouch.currentY
                    );
                }
            }

            // RENDER CONTROL:
            function renderControl(startX, startY, currentX, currentY) {
                mainContext.save();
                mainContext.setTransform(1, 0, 0, 1, 0, 0);
                // mainContext.resetTransform();
                mainContext.scale(pixelDensity, pixelDensity);
                var controlRadius = 50;
                mainContext.beginPath();
                mainContext.arc(startX, startY, controlRadius, 0, Math.PI * 2, false);
                mainContext.closePath();
                mainContext.fillStyle = "rgba(255, 255, 255, 0.3)";
                mainContext.fill();
                var controlRadius = 50;
                var offsetX = currentX - startX;
                var offsetY = currentY - startY;
                var mag = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
                var divisor = mag > controlRadius ? (mag / controlRadius) : 1;
                offsetX /= divisor;
                offsetY /= divisor;
                mainContext.beginPath();
                mainContext.arc(startX + offsetX, startY + offsetY, controlRadius * 0.5, 0, Math.PI * 2, false);
                mainContext.closePath();
                mainContext.fillStyle = "white";
                mainContext.fill();
                mainContext.restore();
            }

            // RENDER PROJECTILES:
            function renderProjectiles(layer, xOffset, yOffset) {
                for (var i = 0; i < projectiles.length; ++i) {
                    tmpObj = projectiles[i];
                    if (tmpObj.active && tmpObj.layer == layer) {
                        tmpObj.update(delta);
                        if (tmpObj.active && isOnScreen(tmpObj.x-xOffset, tmpObj.y-yOffset, tmpObj.scale)) {
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir);
                            renderProjectile(0, 0, tmpObj, mainContext, 1);
                            mainContext.restore();
                        }
                    }
                }
            }

            // RENDER PROJECTILE:
            var projectileSprites = {};
            function renderProjectile(x, y, obj, ctxt, debug) {
                if (obj.src) {
                    var tmpSrc = items.projectiles[obj.indx].src;
                    var tmpSprite = projectileSprites[tmpSrc];
                    if (!tmpSprite) {
                        tmpSprite = new Image();
                        tmpSprite.onload = function() {
                            this.isLoaded = true;
                        }
                        tmpSprite.src = ".././img/weapons/" + tmpSrc + ".png";
                        projectileSprites[tmpSrc] = tmpSprite;
                    }
                    if (tmpSprite.isLoaded)
                        ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
                } else if (obj.indx == 1) {
                    ctxt.fillStyle = "#939393";
                    renderCircle(x, y, obj.scale, ctxt);
                }
            }

            // RENDER WATER BODIES:
            function renderWaterBodies(xOffset, yOffset, ctxt, padding) {

                // MIDDLE RIVER:
                var tmpW = config.riverWidth + padding;
                var tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }

            // RENDER GAME OBJECTS:
            function renderGameObjects(layer, xOffset, yOffset) {
                var tmpSprite, tmpX, tmpY;
                for (var i = 0; i < gameObjects.length; ++i) {
                    tmpObj = gameObjects[i];
                    if (tmpObj.active) {
                        tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                        tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                        if (layer == 0) {
                            tmpObj.update(delta);
                        }
                        if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker||0))) {
                            mainContext.globalAlpha = tmpObj.hideFromEnemy?0.6:1;
                            if (tmpObj.isItem) {
                                tmpSprite = getItemSprite(tmpObj);
                                mainContext.save();
                                mainContext.translate(tmpX, tmpY);
                                mainContext.rotate(tmpObj.dir);
                                mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
                                if (tmpObj.blocker) {
                                    mainContext.strokeStyle = "#db6e6e";
                                    mainContext.globalAlpha = 0.3;
                                    mainContext.lineWidth = 6;
                                    renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                                }

                                mainContext.restore();

                                // HEALTH BAR:
                                let color = ally(tmpObj.owner.sid) ? "#8ecc51" : "#cc5151",
                                    fillCount = tmpObj.health,
                                    fillLimit = tmpObj.maxHealth;

                                drawBar(mainContext, tmpObj, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale - config.nameY + 75, color, fillCount, fillLimit);
                            } else {
                                tmpSprite = getResSprite(tmpObj);
                                mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                            }
                        }
                    }
                }
            }

            // GATHER ANIMATION:
            function gatherAnimation(sid, didHit, index, safe) {
                if(typeof safe !== "bigint") return storage.push({function: gatherAnimation, data: arguments});

                tmpObj = findPlayerBySID(sid);
                if (tmpObj) tmpObj.startAnim(didHit, index);
            }

            // RENDER PLAYERS:
            function renderPlayers(xOffset, yOffset, zIndex) {
                mainContext.globalAlpha = 1;
                for (var i = 0; i < players.length; ++i) {
                    tmpObj = players[i];
                    if (tmpObj.zIndex == zIndex) {
                        tmpObj.animate(delta);
                        if (tmpObj.visible) {
                            tmpObj.skinRot += (0.002 * delta);
                            tmpDir = ((tmpObj == player)?getAttackDir():tmpObj.dir) + tmpObj.dirPlus;
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);

                            // RENDER PLAYER:
                            mainContext.rotate(tmpDir);
                            renderPlayer(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                }
            }

            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                var handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                var oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                var oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI/2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }
            }

            // RENDER SKINS:
            var skinSprites = {};
            var skinPointers = {};
            var tmpSkin;
            function renderSkin(index, ctxt, parentSkin, owner) {
                tmpSkin = skinSprites[index];
                if (!tmpSkin) {
                    var tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = ".././img/hats/hat_" + index + ".png";
                    skinSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                var tmpObj = parentSkin||skinPointers[index];
                if (!tmpObj) {
                    for (var i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }

            // RENDER TAIL:
            var accessSprites = {};
            var accessPointers = {};
            function renderTail(index, ctxt, owner) {
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    var tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = ".././img/accessories/access_" + index + ".png";
                    accessSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                var tmpObj = accessPointers[index];
                if (!tmpObj) {
                    for (var i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff||0), 0);
                    if (tmpObj.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }

            // RENDER TOOL:
            var toolSprites = {};
            function renderTool(obj, variant, x, y, ctxt) {
                var tmpSrc = obj.src + (variant||"");
                var tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    tmpSprite.src = ".././img/weapons/" + tmpSrc + ".png";
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x+obj.xOff-(obj.length/2), y+obj.yOff-(obj.width/2), obj.length, obj.width);
            }

            // RENDER GAME OBJECTS:
            var gameObjectSprites = {};
            function getResSprite(obj) {
                var biomeID = (obj.y>=config.mapScale-config.snowBiomeTop)?2:((obj.y<=config.snowBiomeTop)?1:0);
                var tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
                var tmpSprite = gameObjectSprites[tmpIndex];
                if (!tmpSprite) {
                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
                    var tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                    tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (obj.type == 0) {
                        var tmpScale;
                        for (var i = 0; i < 2; ++i) {
                            tmpScale = tmpObj.scale * (!i?1:0.5);
                            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !biomeID?(!i?"#9ebf57":"#b4db62"):(!i?"#e3f1f4":"#fff");
                            tmpContext.fill();
                            if (!i)
                                tmpContext.stroke();
                        }
                    } else if (obj.type == 1) {
                        if (biomeID == 2) {
                            tmpContext.fillStyle = "#606060";
                            renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#89a54c";
                            renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                            tmpContext.fillStyle = "#a5c65b";
                            renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                        } else {
                            renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                            tmpContext.fillStyle = biomeID?"#e3f1f4":"#89a54c";
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = biomeID?"#6a64af":"#c15555";
                            var tmpRange;
                            var berries = 4;
                            var rotVal = mathPI2 / berries;
                            for (var i = 0; i < berries; ++i) {
                                tmpRange = UTILS.randInt(tmpObj.scale/3.5, tmpObj.scale/2.3);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(10, 12), tmpContext);
                            }
                        }
                    } else if (obj.type == 2 || obj.type == 3) {
                        tmpContext.fillStyle = (obj.type==2)?(biomeID==2?"#938d77":"#939393"):"#e0c655";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = (obj.type==2)?(biomeID==2?"#b2ab90":"#bcbcbc"):"#ebdca3";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    gameObjectSprites[tmpIndex] = tmpSprite;
                }
                return tmpSprite;
            }

            // GET ITEM SPRITE:
            var itemSprites = [];
            function getItemSprite(obj, asIcon) {
                var tmpSprite = itemSprites[obj.id];
                if (!tmpSprite || asIcon) {
                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.5) + outlineWidth +
                        (items.list[obj.id].spritePadding||0);
                    var tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                    tmpContext.rotate(asIcon?0:(Math.PI/2));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth * (asIcon?(tmpCanvas.width/81):1);
                    if (obj.name == "apple") {
                        tmpContext.fillStyle = "#c15555";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#89a54c";
                        var leafDir = -(Math.PI / 2);
                        renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                                   25, leafDir + Math.PI/2, tmpContext);
                    } else if (obj.name == "cookie") {
                        tmpContext.fillStyle = "#cca861";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#937c4b";
                        var chips = 4;
                        var rotVal = mathPI2 / chips;
                        var tmpRange;
                        for (var i = 0; i < chips; ++i) {
                            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                         UTILS.randInt(4, 5), tmpContext, true);
                        }
                    } else if (obj.name == "cheese") {
                        tmpContext.fillStyle = "#f4f3ac";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#c3c28b";
                        var chips = 4;
                        var rotVal = mathPI2 / chips;
                        var tmpRange;
                        for (var i = 0; i < chips; ++i) {
                            tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                            renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                         UTILS.randInt(4, 5), tmpContext, true);
                        }
                    } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                        tmpContext.fillStyle = (obj.name == "castle wall")?"#83898e":(obj.name=="wood wall")?
                            "#a5974c":"#939393";
                        var sides = (obj.name == "castle wall")?4:3;
                        renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = (obj.name == "castle wall")?"#9da4aa":(obj.name=="wood wall")?
                            "#c9b758":"#bcbcbc";
                        renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes"
                               || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = (obj.name == "poison spikes")?"#7b935d":"#939393";
                        var tmpScale = (obj.scale * 0.6);
                        renderStar(tmpContext, (obj.name == "spikes")?5:6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#c9b758";
                        renderCircle(0, 0, tmpScale/2, tmpContext, true);
                    } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fillStyle = "#c9b758";
                        renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, obj.scale * 0.5, tmpContext);
                    } else if (obj.name == "mine") {
                        tmpContext.fillStyle = "#939393";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#bcbcbc";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    } else if (obj.name == "sapling") {
                        for (var i = 0; i < 2; ++i) {
                            var tmpScale = obj.scale * (!i?1:0.5);
                            renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = (!i?"#9ebf57":"#b4db62");
                            tmpContext.fill();
                            if (!i) tmpContext.stroke();
                        }
                    } else if (obj.name == "pit trap") {
                        tmpContext.fillStyle = "#a5974c";
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = outlineColor;
                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    } else if (obj.name == "boost pad") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderRect(0, 0, obj.scale*2, obj.scale*2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#dbd97d";
                        renderTriangle(obj.scale * 1, tmpContext);
                    } else if (obj.name == "turret") {
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#939393";
                        var tmpLen = 50;
                        renderRect(0, -tmpLen/2, obj.scale * 0.9, tmpLen, tmpContext);
                        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                    } else if (obj.name == "platform") {
                        tmpContext.fillStyle = "#cebd5f";
                        var tmpCount = 4;
                        var tmpS = obj.scale * 2;
                        var tmpW = tmpS / tmpCount;
                        var tmpX = -(obj.scale/2);
                        for (var i = 0; i < tmpCount; ++i) {
                            renderRect(tmpX - (tmpW/2), 0, tmpW, obj.scale*2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpX += tmpS / tmpCount;
                        }
                    } else if (obj.name == "healing pad") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderRect(0, 0, obj.scale*2, obj.scale*2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#db6e6e";
                        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                    } else if (obj.name == "spawn pad") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderRect(0, 0, obj.scale*2, obj.scale*2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#71aad6";
                        renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    } else if (obj.name == "blocker") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.rotate(Math.PI / 4);
                        tmpContext.fillStyle = "#db6e6e";
                        renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                    }  else if (obj.name == "teleporter") {
                        tmpContext.fillStyle = "#7e7f82";
                        renderCircle(0, 0, obj.scale, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.rotate(Math.PI / 4);
                        tmpContext.fillStyle = "#d76edb";
                        renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                    }
                    tmpSprite = tmpCanvas;
                    if (!asIcon)
                        itemSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }

            // RENDER LEAF:
            function renderLeaf(x, y, l, r, ctxt) {
                var endX = x + (l * Math.cos(r));
                var endY = y + (l * Math.sin(r));
                var width = l * 0.4;
                ctxt.moveTo(x, y);
                ctxt.beginPath();
                ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI/2)),
                                      ((y + endY) / 2) + (width * Math.sin(r + Math.PI/2)), endX, endY);
                ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI/2)),
                                      ((y + endY) / 2) - (width * Math.sin(r + Math.PI/2)), x, y);
                ctxt.closePath();
                ctxt.fill();
                ctxt.stroke();
            }

            // RENDER CIRCLE:
            function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext||mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }

            // RENDER STAR SHAPE:
            function renderStar(ctxt, spikes, outer, inner) {
                var rot = Math.PI / 2 * 3;
                var x, y;
                var step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (var i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }

            // RENDER RECTANGLE:
            function renderRect(x, y, w, h, ctxt, stroke) {
                ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!stroke)
                    ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }

            // RENDER RECTCIRCLE:
            function renderRectCircle(x, y, s, sw, seg, ctxt, stroke) {
                ctxt.save();
                ctxt.translate(x, y);
                seg = Math.ceil(seg / 2);
                for (var i = 0; i < seg; i++) {
                    renderRect(0, 0, s * 2, sw, ctxt, stroke);
                    ctxt.rotate(Math.PI / seg);
                }
                ctxt.restore();
            }

            // RENDER BLOB:
            function renderBlob(ctxt, spikes, outer, inner) {
                var rot = Math.PI / 2 * 3;
                var x, y;
                var step = Math.PI / spikes;
                var tmpOuter;
                ctxt.beginPath();
                ctxt.moveTo(0, -inner);
                for (var i = 0; i < spikes; i++) {
                    tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
                    ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
                                          Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
                    rot += step * 2;
                }
                ctxt.lineTo(0, -inner);
                ctxt.closePath();
            }

            // RENDER TRIANGLE:
            function renderTriangle(s, ctx) {
                ctx = ctx||mainContext;
                var h = s * (Math.sqrt(3)/2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo( -s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }

            // PREPARE MENU BACKGROUND:
            function prepareMenuBackground() {}

            // LOAD GAME OBJECT:
            function loadGameObject(data) {
                for (var i = 0; i < data.length;) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                      data[i + 5], items.list[data[i + 6]], true, (data[i + 7]>=0?{sid:data[i + 7]}:null));
                    i+=8;
                }
            }

            // WIGGLE GAME OBJECT:
            function wiggleGameObject(dir, sid) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
                }
            }

            // SHOOT TURRET:
            function shootTurret(sid, dir) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.dir = dir;
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir+Math.PI);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir+Math.PI);
                }
            }

            // ADD PROJECTILE:
            function addProjectile(x, y, dir, range, speed, indx, layer, sid, safe) {
                if(typeof safe !== "bigint") {
                    if(inWindow) projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer).sid = sid;

                    return storage.push({function: addProjectile, data: arguments});
                }


                const turret = Number(range == 700 && speed == 1.5);

                let index = 0, length = players.length;

                while(index < length) {
                    let player = players[index];

                    if(player.visible) {
                        const dist = Math.round(Math.hypot(player.y2 - y, player.x2 - x));
                        const Turret = (turret && player.reloads[2].ready && player.skinIndex === 53 && Number(dist) <= 5);
                        const Secondary = !turret && [9, 12, 13, 15].includes(player.weaponIndex) && !Number(player.d2 - dir) && [69, 70, 71, 72].includes(dist);

                        if(player.visible && (Secondary || Turret)) {
                            //send("game", `${player.name} shots ${player.weapon.name}.`);

                            if(turret){
                                player.reloads[2].date = Date.now();
                                player.reloads[2].count = 0;
                                player.reloads[2].ready = false;
                            } else {
                                player.reloads[1].date = Date.now();
                                player.reloads[1].count = 0;
                                player.reloads[1].ready = false;
                            }
                        }
                    }

                    index += 1;
                }
            }

            // REMOVE PROJECTILE:
            function remProjectile(sid, range) {
                for (var i = 0; i < projectiles.length; ++i) {
                    if (projectiles[i].sid == sid) {
                        projectiles[i].range = range;
                    }
                }
            }

            // ANIMATE AI:
            function animateAI(sid) {
                tmpObj = findAIBySID(sid);
                if (tmpObj) tmpObj.startAnim();
            }

            // ADD AI:
            function loadAI(data) {
                for (var i = 0; i < ais.length; ++i) {
                    ais[i].forcePos = !ais[i].visible;
                    ais[i].visible = false;
                }
                if (data) {
                    var tmpTime = Date.now();
                    for (var i = 0; i < data.length;) {
                        tmpObj = findAIBySID(data[i]);
                        if (tmpObj) {
                            tmpObj.index = data[i + 1];
                            tmpObj.t1 = (tmpObj.t2===undefined)?tmpTime:tmpObj.t2;
                            tmpObj.t2 = tmpTime;
                            tmpObj.x1 = tmpObj.x;
                            tmpObj.y1 = tmpObj.y;
                            tmpObj.x2 = data[i + 2];
                            tmpObj.y2 = data[i + 3];
                            tmpObj.d1 = (tmpObj.d2===undefined)?data[i + 4]:tmpObj.d2;
                            tmpObj.d2 = data[i + 4];
                            tmpObj.health = data[i + 5];
                            tmpObj.dt = 0;
                            tmpObj.visible = true;
                        } else {
                            tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            tmpObj.x2 = tmpObj.x;
                            tmpObj.y2 = tmpObj.y;
                            tmpObj.d2 = tmpObj.dir;
                            tmpObj.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                tmpObj.name = config.cowNames[data[i + 6]];
                            tmpObj.forcePos = true;
                            tmpObj.sid = data[i];
                            tmpObj.visible = true;
                        }
                        i+=7;
                    }
                }
            }

            // RENDER AI:
            var aiSprites = {};
            function renderAI(obj, ctxt) {
                var tmpIndx = obj.index;
                var tmpSprite = aiSprites[tmpIndx];
                if (!tmpSprite) {
                    var tmpImg = new Image();
                    tmpImg.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImg.src = ".././img/animals/" + obj.src + ".png";
                    tmpSprite = tmpImg;
                    aiSprites[tmpIndx] = tmpSprite;
                }
                if (tmpSprite.isLoaded) {
                    var tmpScale = obj.scale * 1.2 * (obj.spriteMlt||1);
                    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale*2, tmpScale*2);
                }
            }

            // OBJECT ON SCREEN:
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && y - s <= maxScreenHeight)
            }

            // ADD NEW PLAYER:
            function addPlayer(data, isYou) {
                var tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                                           objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                }
                tmpPlayer.spawn(isYou?moofoll:null);
                tmpPlayer.visible = false;
                tmpPlayer.x2 = undefined;
                tmpPlayer.y2 = undefined;
                tmpPlayer.setData(data);
                if (isYou) {
                    player = tmpPlayer;
                    camX = player.x;
                    camY = player.y;
                    updateItems();
                    updateStatusDisplay();
                    updateAge();
                    updateUpgrades(0);
                    gameUI.style.display = "block";
                }
            }

            // REMOVE PLAYER:
            function removePlayer(id) {
                for (var i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        players.splice(i, 1);
                        break;
                    }
                }
            }

            // UPDATE PLAYER ITEM VALUES:
            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                }
            }

            // UPDATE PLAYER VALUE:
            function updatePlayerValue(index, value, updateView) {
                if (player) {
                    player[index] = value;
                    if (updateView)
                        updateStatusDisplay();
                }
            }

            // UPDATE HEALTH:
            function updateHealth(sid, value) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.health = value;
                }
            }

            // UPDATE PLAYER DATA:
            function updatePlayers(data) {
                var tmpTime = Date.now();
                for (var i = 0; i < players.length; ++i) {
                    players[i].forcePos = !players[i].visible;
                    players[i].visible = false;
                }
                for (var i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        tmpObj.t1 = (tmpObj.t2===undefined)?tmpTime:tmpObj.t2;
                        tmpObj.t2 = tmpTime;
                        tmpObj.x1 = tmpObj.x;
                        tmpObj.y1 = tmpObj.y;
                        // console.log("b", data[i + 1] - tmpObj.x2, data[i + 2] - tmpObj.y2)
                        tmpObj.x2 = data[i + 1];
                        tmpObj.y2 = data[i + 2];
                        tmpObj.d1 = (tmpObj.d2===undefined)?data[i + 3]:tmpObj.d2;
                        tmpObj.d2 = data[i + 3];
                        tmpObj.dt = 0;
                        tmpObj.buildIndex = data[i + 4];
                        tmpObj.weaponIndex = data[i + 5];
                        tmpObj.weaponVariant = data[i + 6];
                        tmpObj.team = data[i + 7];
                        tmpObj.isLeader = data[i + 8];
                        tmpObj.skinIndex = data[i + 9];
                        tmpObj.tailIndex = data[i + 10];
                        tmpObj.iconIndex = data[i + 11];
                        tmpObj.zIndex = data[i + 12];
                        tmpObj.visible = true;
                        tmpObj.skin = hats.find(hat => hat.id === tmpObj.skinIndex);
                        tmpObj.tail = accessories.find(acc => acc.id === tmpObj.tailIndex);
                    }
                    i+=13;
                }

                tick();
            }

            let storage = [];

            // UPDATE EVERY TICK
            function tick() {
                let index = 0, length = storage.length;

                while(index < length) {
                    storage[index] && storage[index].function(...storage[index].data, 2n);

                    index += 1;
                }

                storage = [];

                player.moveDir = getMoveDir();
                for(let player of players) {
                    let delta = Date.now() - (player.lastTouch || 0);

                    player.visible && player.update(delta);

                    player.lastTouch = Date.now()
                }
            }

            // FIND OBJECTS BY ID/SID:
            function findPlayerByID(id) {
                for (var i = 0; i < players.length; ++i) {
                    if (players[i].id == id) {
                        return players[i];
                    }
                } return null;
            }
            function findPlayerBySID(sid) {
                for (var i = 0; i < players.length; ++i) {
                    if (players[i].sid == sid) {
                        return players[i];
                    }
                } return null;
            }
            function findAIBySID(sid) {
                for (var i = 0; i < ais.length; ++i) {
                    if (ais[i].sid == sid) {
                        return ais[i];
                    }
                } return null;
            }
            function findObjectBySid(sid) {
                for (var i = 0; i < gameObjects.length; ++i) {
                    if (gameObjects[i].sid == sid) {
                        return gameObjects[i];
                    }
                } return null;
            }

            // PING:
            var lastPing = -1;
            function pingSocketResponse() {
                var pingTime = Date.now() - lastPing;
                window.pingTime = pingTime;
                // pingDisplay.innerText = "Ping: " + pingTime + " ms"
            }

            document.updateInfoBar = function() {
                pingDisplay.innerText = `PPS: [${io.pps.length}]\nPing: ${window.pingTime} ms`;
            }

            function pingSocket() {
                lastPing = Date.now();
                io.send("pp");
            }

            // SERVER SHUTDOWN NOTICE:
            function serverShutdownNotice(countdown) {
                if (countdown < 0) return;

                var minutes = Math.floor(countdown / 60);
                var seconds = countdown % 60;
                seconds = ("0" + seconds).slice(-2);

                shutdownDisplay.innerText = "Server restarting in " + minutes + ":" + seconds;
                shutdownDisplay.hidden = false;
            }

            // UPDATE & ANIMATE:
            window.requestAnimFrame = (function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();
            function doUpdate() {
                now = Date.now();
                delta = now - lastUpdate;
                lastUpdate = now;
                updateGame();
                requestAnimFrame(doUpdate);
            }

            // START GAME:
            function startGame() {
                bindEvents();
                loadIcons();
                loadingText.style.display = "none";
                menuCardHolder.style.display = "block";
                nameInput.value = getSavedVal("moo_name")||"";
                prepareUI();
            }
            prepareMenuBackground();
            doUpdate();

            // OPEN LINK:
            function openLink(link) {
                window.open(link, "_blank")
            }

            // EXPORT VALUES:
            window.openLink = openLink;
            window.aJoinReq = aJoinReq;
            window.follmoo = follmoo;
            window.kickFromClan = kickFromClan;
            window.sendJoin = sendJoin;
            window.leaveAlliance = leaveAlliance;
            window.createAlliance = createAlliance;
            window.storeBuy = storeBuy;
            window.storeEquip = storeEquip;
            window.showItemInfo = showItemInfo;
            window.selectSkinColor = selectSkinColor;
            window.changeStoreIndex = changeStoreIndex;
            window.config = config;


            /***/ }),

        /***/ "./src/js/config.js":
        /*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            /* WEBPACK VAR INJECTION */(function(process) {
                // RENDER:
                module.exports.maxScreenWidth = 1920;
                module.exports.maxScreenHeight = 1080;

                // SERVER:
                module.exports.serverUpdateRate = 9;
                module.exports.maxPlayers =  (process && process.argv.indexOf("--largeserver") != -1) ? 80 : 40;
                module.exports.maxPlayersHard =  module.exports.maxPlayers + 10;
                module.exports.collisionDepth = 6;
                module.exports.minimapRate = 3000;

                // COLLISIONS:
                module.exports.colGrid = 10;

                // CLIENT:
                module.exports.clientSendRate = 5;

                // UI:
                module.exports.healthBarWidth = 50;
                module.exports.healthBarPad = 4.5;
                module.exports.iconPadding = 15;
                module.exports.iconPad = 0.9;
                module.exports.deathFadeout = 3000;
                module.exports.crownIconScale = 60;
                module.exports.crownPad = 35;

                // CHAT:
                module.exports.chatCountdown = 3000;
                module.exports.chatCooldown = 500;

                // SANDBOX:
                module.exports.inSandbox = process && process.env.VULTR_SCHEME === "mm_exp";;

                // PLAYER:
                module.exports.maxAge = 100;
                module.exports.gatherAngle = Math.PI/2.6;
                module.exports.gatherWiggle = 10;
                module.exports.hitReturnRatio = 0.25;
                module.exports.hitAngle = Math.PI / 2;
                module.exports.playerScale = 35;
                module.exports.playerSpeed = 0.0016;
                module.exports.playerDecel = 0.993;
                module.exports.nameY = 34;

                // CUSTOMIZATION:
                module.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                                             "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                             "#8bc373"];

                // ANIMALS:
                module.exports.animalCount = 7;
                module.exports.aiTurnRandom = 0.06;
                module.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper",
                                           "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"];

                // WEAPONS:
                module.exports.shieldAngle = Math.PI/3;
                module.exports.weaponVariants = [{
                    id: 0,
                    src: "",
                    xp: 0,
                    val: 1
                }, {
                    id: 1,
                    src: "_g",
                    xp: 3000,
                    val: 1.1
                }, {
                    id: 2,
                    src: "_d",
                    xp: 7000,
                    val: 1.18
                }, {
                    id: 3,
                    src: "_r",
                    poison: true,
                    xp: 12000,
                    val: 1.18
                }];
                module.exports.fetchVariant = function(player) {
                    var tmpXP = player.weaponXP[player.weaponIndex]||0;
                    for (var i = module.exports.weaponVariants.length - 1; i >= 0; --i) {
                        if (tmpXP >= module.exports.weaponVariants[i].xp)
                            return module.exports.weaponVariants[i];
                    }
                };

                // NATURE:
                module.exports.resourceTypes = ["wood", "food", "stone", "points"];
                module.exports.areaCount = 7;
                module.exports.treesPerArea = 9;
                module.exports.bushesPerArea = 3;
                module.exports.totalRocks = 32;
                module.exports.goldOres = 7;
                module.exports.riverWidth = 724;
                module.exports.riverPadding = 114;
                module.exports.waterCurrent = 0.0011;
                module.exports.waveSpeed = 0.0001;
                module.exports.waveMax = 1.3;
                module.exports.treeScales = [150, 160, 165, 175];
                module.exports.bushScales = [80, 85, 95];
                module.exports.rockScales = [80, 85, 90];

                // BIOME DATA:
                module.exports.snowBiomeTop = 2400;
                module.exports.snowSpeed = 0.75;

                // DATA:
                module.exports.maxNameLength = 15;

                // MAP:
                module.exports.mapScale = 14400;
                module.exports.mapPingScale = 40;
                module.exports.mapPingTime = 2200;

                // VOLCANO:
                module.exports.volcanoScale = 100;
                module.exports.volcano = {
                    x: 14400 - 440,
                    y: 14400 - 440
                };

                /* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

            /***/ }),

        /***/ "./src/js/data/ai.js":
        /*!***************************!*\
  !*** ./src/js/data/ai.js ***!
  \***************************/
        /*! no static exports found */
        /***/ (function(module, exports) {


            var PI2 = Math.PI * 2;
            module.exports = function(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
                this.sid = sid;
                this.isAI = true;
                this.nameIndex = UTILS.randInt(0, config.cowNames.length-1);

                // INIT:
                this.init = function(x, y, dir, index, data) {
                    this.x = x;
                    this.y = y;
                    this.startX = data.fixedSpawn?x:null;
                    this.startY = data.fixedSpawn?y:null;
                    this.xVel = 0;
                    this.yVel = 0;
                    this.zIndex = 0;
                    this.dir = dir;
                    this.dirPlus = 0;
                    this.index = index;
                    this.src = data.src;
                    if (data.name) this.name = data.name;
                    this.weightM = data.weightM;
                    this.speed = data.speed;
                    this.killScore = data.killScore;
                    this.turnSpeed = data.turnSpeed;
                    this.scale = data.scale;
                    this.maxHealth = data.health;
                    this.leapForce = data.leapForce;
                    this.health = this.maxHealth;
                    this.chargePlayer = data.chargePlayer;
                    this.viewRange = data.viewRange;
                    this.drop = data.drop;
                    this.dmg = data.dmg;
                    this.hostile = data.hostile;
                    this.dontRun = data.dontRun;
                    this.hitRange = data.hitRange;
                    this.hitDelay = data.hitDelay;
                    this.hitScare = data.hitScare;
                    this.spriteMlt = data.spriteMlt;
                    this.nameScale = data.nameScale;
                    this.colDmg = data.colDmg;
                    this.noTrap = data.noTrap;
                    this.spawnDelay = data.spawnDelay;
                    this.hitWait = 0;
                    this.waitCount = 1000;
                    this.moveCount = 0;
                    this.targetDir = 0;
                    this.active = true;
                    this.alive = true;
                    this.runFrom = null;
                    this.chargeTarget = null;
                    this.dmgOverTime = {};
                };

                // UPDATE:
                var timerCount = 0;
                this.update = function(delta) {
                    if (this.active) {

                        // SPAWN DELAY:
                        if (this.spawnCounter) {
                            this.spawnCounter -= delta;
                            if (this.spawnCounter <= 0) {
                                this.spawnCounter = 0;
                                this.x = this.startX||UTILS.randInt(0, config.mapScale);
                                this.y = this.startY||UTILS.randInt(0, config.mapScale);
                            }
                            return;
                        }

                        // REGENS AND AUTO:
                        timerCount -= delta;
                        if (timerCount <= 0) {
                            if (this.dmgOverTime.dmg) {
                                //  this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
                                this.dmgOverTime.time -= 1;
                                if (this.dmgOverTime.time <= 0)
                                    this.dmgOverTime.dmg = 0;
                            }
                            timerCount = 1000;
                        }

                        // BEHAVIOUR:
                        var charging = false;
                        var slowMlt = 1;
                        if (!this.zIndex && !this.lockMove && this.y >= (config.mapScale / 2) - (config.riverWidth / 2) &&
                            this.y <= (config.mapScale / 2) + (config.riverWidth / 2)) {
                            slowMlt = 0.33;
                            this.xVel += config.waterCurrent * delta;
                        }
                        if (this.lockMove) {
                            this.xVel = 0;
                            this.yVel = 0;
                        } else if (this.waitCount > 0) {
                            this.waitCount -= delta;
                            if (this.waitCount <= 0) {
                                if (this.chargePlayer) {
                                    var tmpPlayer, bestDst, tmpDist;
                                    for (var i = 0; i < players.length; ++i) {
                                        if (players[i].visible && !(players[i].skin && players[i].skin.bullRepel)) {
                                            tmpDist = UTILS.getDistance(this.x, this.y, players[i].x, players[i].y);
                                            if (tmpDist <= this.viewRange && (!tmpPlayer || tmpDist < bestDst)) {
                                                bestDst = tmpDist;
                                                tmpPlayer = players[i];
                                            }
                                        }
                                    }
                                    if (tmpPlayer) {
                                        this.chargeTarget = tmpPlayer;
                                        this.moveCount = UTILS.randInt(8000, 12000);
                                    } else {
                                        this.moveCount = UTILS.randInt(1000, 2000);
                                        this.targetDir = UTILS.randFloat(-Math.PI, Math.PI);
                                    }
                                } else {
                                    this.moveCount = UTILS.randInt(4000, 10000);
                                    this.targetDir = UTILS.randFloat(-Math.PI, Math.PI);
                                }
                            }
                        } else if (this.moveCount > 0) {
                            var tmpSpd = this.speed * slowMlt;
                            if (this.runFrom && this.runFrom.active && !(this.runFrom.isPlayer && !this.runFrom.alive)) {
                                this.targetDir = UTILS.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y);
                                tmpSpd *= 1.42;
                            } else if (this.chargeTarget && this.chargeTarget.alive) {
                                this.targetDir = UTILS.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y);
                                tmpSpd *= 1.75;
                                charging = true;
                            } if (this.hitWait) {
                                tmpSpd *= 0.3;
                            }
                            if (this.dir != this.targetDir) {
                                this.dir %= PI2;
                                var netAngle = (this.dir - this.targetDir + PI2) % PI2;
                                var amnt = Math.min(Math.abs(netAngle - PI2), netAngle, this.turnSpeed * delta);
                                var sign = (netAngle - Math.PI)>=0?1:-1;
                                this.dir += sign * amnt + PI2;
                            }
                            this.dir %= PI2;
                            this.xVel += (tmpSpd * delta) * Math.cos(this.dir);
                            this.yVel += (tmpSpd * delta) * Math.sin(this.dir);
                            this.moveCount -= delta;
                            if (this.moveCount <= 0) {
                                this.runFrom = null;
                                this.chargeTarget = null;
                                this.waitCount = this.hostile?1500:UTILS.randInt(1500, 6000);
                            }
                        }

                        // OBJECT COLL:
                        this.zIndex = 0;
                        this.lockMove = false;
                        var tmpList;
                        var tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
                        var depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
                        var tMlt = 1 / depth;
                        for (var i = 0; i < depth; ++i) {
                            if (this.xVel)
                                this.x += (this.xVel * delta) * tMlt;
                            if (this.yVel)
                                this.y += (this.yVel * delta) * tMlt;
                            tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                            for (var x = 0; x < tmpList.length; ++x) {
                                for (var y = 0; y < tmpList[x].length; ++y) {
                                    if (tmpList[x][y].active)
                                        objectManager.checkCollision(this, tmpList[x][y], tMlt);
                                }
                            }
                        }

                        // HITTING:
                        var hitting = false;
                        if (this.hitWait > 0) {
                            this.hitWait -= delta;
                            if (this.hitWait <= 0) {
                                hitting = true;
                                this.hitWait = 0;
                                if (this.leapForce && !UTILS.randInt(0, 2)) {
                                    this.xVel += this.leapForce * Math.cos(this.dir);
                                    this.yVel += this.leapForce * Math.sin(this.dir);
                                }
                                var tmpList = objectManager.getGridArrays(this.x, this.y, this.hitRange);
                                var tmpObj, tmpDst;
                                for (var t = 0; t < tmpList.length; ++t) {
                                    for (var x = 0; x < tmpList[t].length; ++x) {
                                        tmpObj = tmpList[t][x];
                                        if (tmpObj.health) {
                                            tmpDst = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y);
                                            if (tmpDst < tmpObj.scale + this.hitRange) {
                                                if (tmpObj.changeHealth(-this.dmg * 5) && false) objectManager.disableObj(tmpObj);
                                                objectManager.hitObj(tmpObj, UTILS.getDirection(this.x, this.y, tmpObj.x, tmpObj.y));
                                            }
                                        }
                                    }
                                }
                                for (var x = 0; x < players.length; ++x) {
                                    if (players[x].canSee(this)) {
                                        server.send(players[x].id, "aa", this.sid);
                                    }
                                }
                            }
                        }

                        // PLAYER COLLISIONS:
                        if (charging || hitting) {
                            var tmpObj, tmpDst, tmpDir;
                            for (var i = 0; i < players.length; ++i) {
                                tmpObj = players[i];
                                if (tmpObj && tmpObj.alive) {
                                    tmpDst = UTILS.getDistance(this.x, this.y, tmpObj.x, tmpObj.y);
                                    if (this.hitRange) {
                                        if  (!this.hitWait && tmpDst <= this.hitRange + tmpObj.scale) {
                                            if (hitting) {
                                                tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                                tmpObj.changeHealth(-this.dmg);
                                                tmpObj.xVel += 0.6 * Math.cos(tmpDir);
                                                tmpObj.yVel += 0.6 * Math.sin(tmpDir);
                                                this.runFrom = null;
                                                this.chargeTarget = null;
                                                this.waitCount = 3000;
                                                this.hitWait = (!UTILS.randInt(0, 2)?600:0);
                                            } else this.hitWait = this.hitDelay;
                                        }
                                    } else if (tmpDst <= this.scale + tmpObj.scale) {
                                        tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x, this.y);
                                        tmpObj.changeHealth(-this.dmg);
                                        tmpObj.xVel += 0.55 * Math.cos(tmpDir);
                                        tmpObj.yVel += 0.55 * Math.sin(tmpDir);
                                    }
                                }
                            }
                        }

                        // DECEL:
                        if (this.xVel)
                            this.xVel *= Math.pow(config.playerDecel, delta);
                        if (this.yVel)
                            this.yVel *= Math.pow(config.playerDecel, delta);

                        // MAP BOUNDARIES:
                        var tmpScale = this.scale;
                        if (this.x - tmpScale < 0) {
                            this.x = tmpScale;
                            this.xVel = 0;
                        } else if (this.x + tmpScale > config.mapScale) {
                            this.x = config.mapScale - tmpScale;
                            this.xVel = 0;
                        } if (this.y - tmpScale < 0) {
                            this.y = tmpScale;
                            this.yVel = 0;
                        } else if (this.y + tmpScale > config.mapScale) {
                            this.y = config.mapScale - tmpScale;
                            this.yVel = 0;
                        }

                    }
                };

                // CAN SEE:
                this.canSee = function(other) {
                    if (!other) return false;
                    if (other.skin && other.skin.invisTimer && other.noMovTimer
                        >= other.skin.invisTimer) return false;
                    var dx = Math.abs(other.x - this.x) - other.scale;
                    var dy = Math.abs(other.y - this.y) - other.scale;
                    return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                };

                var tmpRatio = 0;
                var animIndex = 0;
                this.animate = function(delta) {
                    if (this.animTime > 0) {
                        this.animTime -= delta;
                        if (this.animTime <= 0) {
                            this.animTime = 0;
                            this.dirPlus = 0;
                            tmpRatio = 0;
                            animIndex = 0;
                        } else {
                            if (animIndex == 0) {
                                tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                if (tmpRatio >= 1) {
                                    tmpRatio = 1;
                                    animIndex = 1;
                                }
                            } else {
                                tmpRatio -= delta / (this.animSpeed * (1-config.hitReturnRatio));
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                            }
                        }
                    }
                };

                // ANIMATION:
                this.startAnim = function() {
                    this.animTime = this.animSpeed = 600;
                    this.targetAngle = Math.PI * 0.8;
                    tmpRatio = 0;
                    animIndex = 0;
                };

                // CHANGE HEALTH:
                this.changeHealth = function(val, doer, runFrom) {
                    return
                    if (this.active) {
                        this.health += val;
                        if (runFrom) {
                            if (this.hitScare && !UTILS.randInt(0, this.hitScare)) {
                                this.runFrom = runFrom;
                                this.waitCount = 0;
                                this.moveCount = 2000;
                            } else if (this.hostile && this.chargePlayer && runFrom.isPlayer) {
                                this.chargeTarget = runFrom;
                                this.waitCount = 0;
                                this.moveCount = 8000;
                            } else if (!this.dontRun) {
                                this.runFrom = runFrom;
                                this.waitCount = 0;
                                this.moveCount = 2000;
                            }
                        }
                        if (val < 0 && this.hitRange && UTILS.randInt(0, 1)) this.hitWait = 500;
                        if (doer && doer.canSee(this) && val < 0) {
                            server.send(doer.id, "t", Math.round(this.x),
                                        Math.round(this.y), Math.round(-val), 1);
                        } if (this.health <= 0) {
                            if (this.spawnDelay) {
                                this.spawnCounter = this.spawnDelay;
                                this.x = -1000000;
                                this.y = -1000000;
                            } else {
                                this.x = this.startX||UTILS.randInt(0, config.mapScale);
                                this.y = this.startY||UTILS.randInt(0, config.mapScale);
                            }
                            this.health = this.maxHealth;
                            this.runFrom = null;
                            if (doer) {
                                scoreCallback(doer, this.killScore);
                                if (this.drop) {
                                    for (var i = 0; i < this.drop.length;) {
                                        doer.addResource(config.resourceTypes.indexOf(this.drop[i]), this.drop[i+1]);
                                        i+=2;
                                    }
                                }
                            }
                        }
                    }
                };

            };


            /***/ }),

        /***/ "./src/js/data/aiManager.js":
        /*!**********************************!*\
  !*** ./src/js/data/aiManager.js ***!
  \**********************************/
        /*! no static exports found */
        /***/ (function(module, exports) {


            // AI MANAGER:
            module.exports = function(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {

                // AI TYPES:
                this.aiTypes = [{
                    id: 0,
                    src: "cow_1",
                    killScore: 150,
                    health: 500,
                    weightM: 0.8,
                    speed: 0.00095,
                    turnSpeed: 0.001,
                    scale: 72,
                    drop: ["food", 50]
                }, {
                    id: 1,
                    src: "pig_1",
                    killScore: 200,
                    health: 800,
                    weightM: 0.6,
                    speed: 0.00085,
                    turnSpeed: 0.001,
                    scale: 72,
                    drop: ["food", 80]
                }, {
                    id: 2,
                    name: "Bull",
                    src: "bull_2",
                    hostile: true,
                    dmg: 20,
                    killScore: 1000,
                    health: 1800,
                    weightM: 0.5,
                    speed: 0.00094,
                    turnSpeed: 0.00074,
                    scale: 78,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 100]
                }, {
                    id: 3,
                    name: "Bully",
                    src: "bull_1",
                    hostile: true,
                    dmg: 20,
                    killScore: 2000,
                    health: 2800,
                    weightM: 0.45,
                    speed: 0.001,
                    turnSpeed: 0.0008,
                    scale: 90,
                    viewRange: 900,
                    chargePlayer: true,
                    drop: ["food", 400]
                }, {
                    id: 4,
                    name: "Wolf",
                    src: "wolf_1",
                    hostile: true,
                    dmg: 8,
                    killScore: 500,
                    health: 300,
                    weightM: 0.45,
                    speed: 0.001,
                    turnSpeed: 0.002,
                    scale: 84,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 200]
                }, {
                    id: 5,
                    name: "Quack",
                    src: "chicken_1",
                    dmg: 8,
                    killScore: 2000,
                    noTrap: true,
                    health: 300,
                    weightM: 0.2,
                    speed: 0.0018,
                    turnSpeed: 0.006,
                    scale: 70,
                    drop: ["food", 100]
                }, {
                    id: 6,
                    name: "MOOSTAFA",
                    nameScale: 50,
                    src: "enemy",
                    hostile: true,
                    dontRun: true,
                    fixedSpawn: true,
                    spawnDelay: 60000,
                    noTrap: true,
                    colDmg: 100,
                    dmg: 40,
                    killScore: 8000,
                    health: 18000,
                    weightM: 0.4,
                    speed: 0.0007,
                    turnSpeed: 0.01,
                    scale: 80,
                    spriteMlt: 1.8,
                    leapForce: 0.9,
                    viewRange: 1000,
                    hitRange: 210,
                    hitDelay: 1000,
                    chargePlayer: true,
                    drop: ["food", 100]
                }, {
                    id: 7,
                    name: "Treasure",
                    hostile: true,
                    nameScale: 35,
                    src: "crate_1",
                    fixedSpawn: true,
                    spawnDelay: 120000,
                    colDmg: 200,
                    killScore: 5000,
                    health: 20000,
                    weightM: 0.1,
                    speed: 0.0,
                    turnSpeed: 0.0,
                    scale: 70,
                    spriteMlt: 1.0
                }, {
                    id: 8,
                    name: "MOOFIE",
                    src: "wolf_2",
                    hostile: true,
                    fixedSpawn: true,
                    dontRun: true,
                    hitScare: 4,
                    spawnDelay: 30000,
                    noTrap: true,
                    nameScale: 35,
                    dmg: 10,
                    colDmg: 100,
                    killScore: 3000,
                    health: 7000,
                    weightM: 0.45,
                    speed: 0.0015,
                    turnSpeed: 0.002,
                    scale: 90,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 1000]
                },
                                {
                                    id: 9,
                                    name: "MOOFIE",
                                    src: "wolf_2",
                                    hostile: !0,
                                    fixedSpawn: !0,
                                    dontRun: !0,
                                    hitScare: 50,
                                    spawnDelay: 6e4,
                                    noTrap: !0,
                                    nameScale: 35,
                                    dmg: 12,
                                    colDmg: 100,
                                    killScore: 3e3,
                                    health: 9e3,
                                    weightM: 0.45,
                                    speed: 0.0015,
                                    turnSpeed: 0.0025,
                                    scale: 94,
                                    viewRange: 1440,
                                    chargePlayer: !0,
                                    drop: ["food", 3e3],
                                    minSpawnRange: 0.85,
                                    maxSpawnRange: 0.9,
                                },
                                {
                                    id: 10,
                                    name: "Wolf",
                                    src: "wolf_1",
                                    hostile: !0,
                                    fixedSpawn: !0,
                                    dontRun: !0,
                                    hitScare: 50,
                                    spawnDelay: 3e4,
                                    dmg: 10,
                                    killScore: 700,
                                    health: 500,
                                    weightM: 0.45,
                                    speed: 0.00115,
                                    turnSpeed: 0.0025,
                                    scale: 88,
                                    viewRange: 1440,
                                    chargePlayer: !0,
                                    drop: ["food", 400],
                                    minSpawnRange: 0.85,
                                    maxSpawnRange: 0.9,
                                },
                                {
                                    id: 11,
                                    name: "Bully",
                                    src: "bull_1",
                                    hostile: !0,
                                    fixedSpawn: !0,
                                    dontRun: !0,
                                    hitScare: 50,
                                    dmg: 20,
                                    killScore: 5e3,
                                    health: 5e3,
                                    spawnDelay: 1e5,
                                    weightM: 0.45,
                                    speed: 0.00115,
                                    turnSpeed: 0.0025,
                                    scale: 94,
                                    viewRange: 1440,
                                    chargePlayer: !0,
                                    drop: ["food", 800],
                                    minSpawnRange: 0.85,
                                    maxSpawnRange: 0.9,
                                },
                               ];

                // SPAWN AI:
                this.spawn = function(x, y, dir, index) {
                    var tmpObj;
                    for (var i = 0; i < ais.length; ++i) {
                        if (!ais[i].active) {
                            tmpObj = ais[i];
                            break;
                        }
                    }
                    if (!tmpObj) {
                        tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                        ais.push(tmpObj);
                    }

                    tmpObj.init(x, y, dir, index, this.aiTypes[index]);
                    return tmpObj;
                };

            };


            /***/ }),

        /***/ "./src/js/data/gameObject.js":
        /*!***********************************!*\
  !*** ./src/js/data/gameObject.js ***!
  \***********************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            module.exports = function (sid) {
                this.sid = sid;

                // INIT:
                this.init = function(x, y, dir, scale, type, data, owner) {
                    data = data||{};
                    this.sentTo = {};
                    this.gridLocations = [];
                    this.active = true;
                    this.doUpdate = data.doUpdate;
                    this.x = x;
                    this.y = y;
                    this.dir = dir;
                    this.xWiggle = 0;
                    this.yWiggle = 0;
                    this.scale = scale;
                    this.type = type;
                    this.id = data.id;
                    this.owner = owner;
                    this.name = data.name;
                    this.isItem = (this.id!=undefined);
                    this.group = data.group;
                    this.health = data.health;
                    this.maxHealth = data.health;
                    this.layer = 2;
                    if (this.group != undefined) {
                        this.layer = this.group.layer;
                    } else if (this.type == 0) {
                        this.layer = 3;
                    } else if (this.type == 2) {
                        this.layer = 0;
                    }  else if (this.type == 4) {
                        this.layer = -1;
                    }
                    this.colDiv = data.colDiv||1;
                    this.blocker = data.blocker;
                    this.ignoreCollision = data.ignoreCollision;
                    this.dontGather = data.dontGather;
                    this.hideFromEnemy = data.hideFromEnemy;
                    this.friction = data.friction;
                    this.projDmg = data.projDmg;
                    this.dmg = data.dmg;
                    this.pDmg = data.pDmg;
                    this.pps = data.pps;
                    this.zIndex = data.zIndex||0;
                    this.turnSpeed = data.turnSpeed;
                    this.req = data.req;
                    this.trap = data.trap;
                    this.healCol = data.healCol;
                    this.teleport = data.teleport;
                    this.boostSpeed = data.boostSpeed;
                    this.projectile = data.projectile;
                    this.shootRange = data.shootRange;
                    this.shootRate = data.shootRate;
                    this.shootCount = this.shootRate;
                    this.spawnPoint = data.spawnPoint;
                };

                // GET HIT:
                this.changeHealth = function(amount, doer) {
                    this.health += amount;
                    return (this.health <= 0);
                };

                // GET SCALE:
                this.getScale = function(sM, ig) {
                    sM = sM||1;
                    return this.scale * ((this.isItem||this.type==2||this.type==3||this.type==4)
                                         ?1:(0.6*sM)) * (ig?1:this.colDiv);
                };

                // VISIBLE TO PLAYER:
                this.visibleToPlayer = function(player) {
                    return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                    (this.owner.team && player.team == this.owner.team)));
                };

                // UPDATE:
                this.update = function(delta) {
                    if (this.active) {
                        if (this.xWiggle) {
                            this.xWiggle *= Math.pow(0.99, delta);
                        } if (this.yWiggle) {
                            this.yWiggle *= Math.pow(0.99, delta);
                        }
                        if (this.turnSpeed) {
                            this.dir += this.turnSpeed * delta;
                        }
                    }
                };
            };


            /***/ }),

        /***/ "./src/js/data/items.js":
        /*!******************************!*\
  !*** ./src/js/data/items.js ***!
  \******************************/
        /*! no static exports found */
        /***/ (function(module, exports) {


            // ITEM GROUPS:
            module.exports.groups = [{
                id: 0,
                name: "food",
                layer: 0
            }, {
                id: 1,
                name: "walls",
                place: true,
                limit: 30,
                layer: 0
            }, {
                id: 2,
                name: "spikes",
                place: true,
                limit: 15,
                layer: 0
            }, {
                id: 3,
                name: "mill",
                place: true,
                limit: 7,
                layer: 1
            }, {
                id: 4,
                name: "mine",
                place: true,
                limit: 1,
                layer: 0
            }, {
                id: 5,
                name: "trap",
                place: true,
                limit: 6,
                layer: -1
            }, {
                id: 6,
                name: "booster",
                place: true,
                limit: 12,
                layer: -1
            }, {
                id: 7,
                name: "turret",
                place: true,
                limit: 2,
                layer: 1
            }, {
                id: 8,
                name: "watchtower",
                place: true,
                limit: 12,
                layer: 1
            }, {
                id: 9,
                name: "buff",
                place: true,
                limit: 4,
                layer: -1
            }, {
                id: 10,
                name: "spawn",
                place: true,
                limit: 1,
                layer: -1
            }, {
                id: 11,
                name: "sapling",
                place: true,
                limit: 2,
                layer: 0
            }, {
                id: 12,
                name: "blocker",
                place: true,
                limit: 3,
                layer: -1
            }, {
                id: 13,
                name: "teleporter",
                place: true,
                limit: 2,
                layer: -1
            }];

            // PROJECTILES:
            exports.projectiles = [{
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 25,
                speed: 1.6,
                scale: 103,
                range: 1000
            }, {
                indx: 1,
                layer: 1,
                dmg: 25,
                scale: 20
            }, {
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 35,
                speed: 2.5,
                scale: 103,
                range: 1200
            }, {
                indx: 0,
                layer: 0,
                src: "arrow_1",
                dmg: 30,
                speed: 2,
                scale: 103,
                range: 1200
            }, {
                indx: 1,
                layer: 1,
                dmg: 16,
                scale: 20
            }, {
                indx: 0,
                layer: 0,
                src: "bullet_1",
                dmg: 50,
                speed: 3.6,
                scale: 160,
                range: 1400
            }];

            // WEAPONS:
            exports.weapons = [{
                id: 0,
                type: 0,
                name: "tool hammer",
                desc: "tool for gathering all resources",
                src: "hammer_1",
                length: 140,
                width: 140,
                xOff: -3,
                yOff: 18,
                dmg: 25,
                range: 65,
                gather: 1,
                speed: 300
            }, {
                id: 1,
                type: 0,
                age: 2,
                name: "hand axe",
                desc: "gathers resources at a higher rate",
                src: "axe_1",
                length: 140,
                width: 140,
                xOff: 3,
                yOff: 24,
                dmg: 30,
                spdMult: 1,
                range: 70,
                gather: 2,
                speed: 400
            }, {
                id: 2,
                type: 0,
                age: 8,
                pre: 1,
                name: "great axe",
                desc: "deal more damage and gather more resources",
                src: "great_axe_1",
                length: 140,
                width: 140,
                xOff: -8,
                yOff: 25,
                dmg: 35,
                spdMult: 1,
                range: 75,
                gather: 4,
                speed: 400
            }, {
                id: 3,
                type: 0,
                age: 2,
                name: "short sword",
                desc: "increased attack power but slower move speed",
                src: "sword_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 46,
                dmg: 35,
                spdMult: 0.85,
                range: 110,
                gather: 1,
                speed: 300
            }, {
                id: 4,
                type: 0,
                age: 8,
                pre: 3,
                name: "katana",
                desc: "greater range and damage",
                src: "samurai_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 59,
                dmg: 40,
                spdMult: 0.8,
                range: 118,
                gather: 1,
                speed: 300
            }, {
                id: 5,
                type: 0,
                age: 2,
                name: "polearm",
                desc: "long range melee weapon",
                src: "spear_1",
                iPad: 1.3,
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 53,
                dmg: 45,
                knock: 0.2,
                spdMult: 0.82,
                range: 142,
                gather: 1,
                speed: 700
            }, {
                id: 6,
                type: 0,
                age: 2,
                name: "bat",
                desc: "fast long range melee weapon",
                src: "bat_1",
                iPad: 1.3,
                length: 110,
                width: 180,
                xOff: -8,
                yOff: 53,
                dmg: 20,
                knock: 0.7,
                range: 110,
                gather: 1,
                speed: 300
            }, {
                id: 7,
                type: 0,
                age: 2,
                name: "daggers",
                desc: "really fast short range weapon",
                src: "dagger_1",
                iPad: 0.8,
                length: 110,
                width: 110,
                xOff: 18,
                yOff: 0,
                dmg: 20,
                knock: 0.1,
                range: 65,
                gather: 1,
                hitSlow: 0.1,
                spdMult: 1.13,
                speed: 100
            }, {
                id: 8,
                type: 0,
                age: 2,
                name: "stick",
                desc: "great for gathering but very weak",
                src: "stick_1",
                length: 140,
                width: 140,
                xOff: 3,
                yOff: 24,
                dmg: 1,
                spdMult: 1,
                range: 70,
                gather: 7,
                speed: 400
            }, {
                id: 9,
                type: 1,
                age: 6,
                name: "hunting bow",
                desc: "bow used for ranged combat and hunting",
                src: "bow_1",
                req: ["wood", 4],
                length: 120,
                width: 120,
                xOff: -6,
                yOff: 0,
                projectile: 0,
                spdMult: 0.75,
                speed: 600
            }, {
                id: 10,
                type: 1,
                age: 6,
                name: "great hammer",
                desc: "hammer used for destroying structures",
                src: "great_hammer_1",
                length: 140,
                width: 140,
                xOff: -9,
                yOff: 25,
                dmg: 10,
                spdMult: 0.88,
                range: 75,
                sDmg: 7.5,
                gather: 1,
                speed: 400
            }, {
                id: 11,
                type: 1,
                age: 6,
                name: "wooden shield",
                desc: "blocks projectiles and reduces melee damage",
                src: "shield_1",
                length: 120,
                width: 120,
                shield: 0.2,
                xOff: 6,
                yOff: 0,
                spdMult: 0.7
            }, {
                id: 12,
                type: 1,
                age: 8,
                pre: 9,
                name: "crossbow",
                desc: "deals more damage and has greater range",
                src: "crossbow_1",
                req: ["wood", 5],
                aboveHand: true,
                armS: 0.75,
                length: 120,
                width: 120,
                xOff: -4,
                yOff: 0,
                projectile: 2,
                spdMult: 0.7,
                speed: 700
            }, {
                id: 13,
                type: 1,
                age: 9,
                pre: 12,
                name: "repeater crossbow",
                desc: "high firerate crossbow with reduced damage",
                src: "crossbow_2",
                req: ["wood", 10],
                aboveHand: true,
                armS: 0.75,
                length: 120,
                width: 120,
                xOff: -4,
                yOff: 0,
                projectile: 3,
                spdMult: 0.7,
                speed: 230
            }, {
                id: 14,
                type: 1,
                age: 6,
                name: "mc grabby",
                desc: "steals resources from enemies",
                src: "grab_1",
                length: 130,
                width: 210,
                xOff: -8,
                yOff: 53,
                dmg: 0,
                steal: 250,
                knock: 0.2,
                spdMult: 1.05,
                range: 125,
                gather: 0,
                speed: 700
            }, {
                id: 15,
                type: 1,
                age: 9,
                pre: 12,
                name: "musket",
                desc: "slow firerate but high damage and range",
                src: "musket_1",
                req: ["stone", 10],
                aboveHand: true,
                rec: 0.35,
                armS: 0.6,
                hndS: 0.3,
                hndD: 1.6,
                length: 205,
                width: 205,
                xOff: 25,
                yOff: 0,
                projectile: 5,
                hideProjectile: true,
                spdMult: 0.6,
                speed: 1500
            }];

            // ITEMS:
            module.exports.list = [{
                group: module.exports.groups[0],
                name: "apple",
                desc: "restores 20 health when consumed",
                req: ["food", 10],
                consume: function(doer) {
                    return doer.changeHealth(20, doer);
                },
                scale: 22,
                holdOffset: 15
            }, {
                age: 3,
                group: module.exports.groups[0],
                name: "cookie",
                desc: "restores 40 health when consumed",
                req: ["food", 15],
                consume: function(doer) {
                    return doer.changeHealth(40, doer);
                },
                scale: 27,
                holdOffset: 15
            }, {
                age: 7,
                group: module.exports.groups[0],
                name: "cheese",
                desc: "restores 30 health and another 50 over 5 seconds",
                req: ["food", 25],
                consume: function(doer) {
                    if (doer.changeHealth(30, doer) || doer.health < 100) {
                        doer.dmgOverTime.dmg = -10;
                        doer.dmgOverTime.doer = doer;
                        doer.dmgOverTime.time = 5;
                        return true;
                    }
                    return false;
                },
                scale: 27,
                holdOffset: 15
            }, {
                group: module.exports.groups[1],
                name: "wood wall",
                desc: "provides protection for your village",
                req: ["wood", 10],
                projDmg: true,
                health: 380,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 3,
                group: module.exports.groups[1],
                name: "stone wall",
                desc: "provides improved protection for your village",
                req: ["stone", 25],
                health: 900,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                pre: 1,
                group: module.exports.groups[1],
                name: "castle wall",
                desc: "provides powerful protection for your village",
                req: ["stone", 35],
                health: 1500,
                scale: 52,
                holdOffset: 20,
                placeOffset: -5
            }, {
                group: module.exports.groups[2],
                name: "spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 20, "stone", 5],
                health: 400,
                dmg: 20,
                scale: 49,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 5,
                group: module.exports.groups[2],
                name: "greater spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 30, "stone", 10],
                health: 500,
                dmg: 35,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 9,
                pre: 1,
                group: module.exports.groups[2],
                name: "poison spikes",
                desc: "poisons enemies when they touch them",
                req: ["wood", 35, "stone", 15],
                health: 600,
                dmg: 30,
                pDmg: 5,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                age: 9,
                pre: 2,
                group: module.exports.groups[2],
                name: "spinning spikes",
                desc: "damages enemies when they touch them",
                req: ["wood", 30, "stone", 20],
                health: 500,
                dmg: 45,
                turnSpeed: 0.003,
                scale: 52,
                spritePadding: -23,
                holdOffset: 8,
                placeOffset: -5
            }, {
                group: module.exports.groups[3],
                name: "windmill",
                desc: "generates gold over time",
                req: ["wood", 50, "stone", 10],
                health: 400,
                pps: 1,
                turnSpeed: 0.0016,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 45,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 5,
                pre: 1,
                group: module.exports.groups[3],
                name: "faster windmill",
                desc: "generates more gold over time",
                req: ["wood", 60, "stone", 20],
                health: 500,
                pps: 1.5,
                turnSpeed: 0.0025,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 47,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 8,
                pre: 1,
                group: module.exports.groups[3],
                name: "power mill",
                desc: "generates more gold over time",
                req: ["wood", 100, "stone", 50],
                health: 800,
                pps: 2,
                turnSpeed: 0.005,
                spritePadding: 25,
                iconLineMult: 12,
                scale: 47,
                holdOffset: 20,
                placeOffset: 5
            }, {
                age: 5,
                group: module.exports.groups[4],
                type: 2,
                name: "mine",
                desc: "allows you to mine stone",
                req: ["wood", 20, "stone", 100],
                iconLineMult: 12,
                scale: 65,
                holdOffset: 20,
                placeOffset: 0
            }, {
                age: 5,
                group: module.exports.groups[11],
                type: 0,
                name: "sapling",
                desc: "allows you to farm wood",
                req: ["wood", 150],
                iconLineMult: 12,
                colDiv: 0.5,
                scale: 110,
                holdOffset: 50,
                placeOffset: -15
            }, {
                age: 4,
                group: module.exports.groups[5],
                name: "pit trap",
                desc: "pit that traps enemies if they walk over it",
                req: ["wood", 30, "stone", 30],
                trap: true,
                ignoreCollision: true,
                hideFromEnemy: true,
                health: 500,
                colDiv: 0.2,
                scale: 50,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 4,
                group: module.exports.groups[6],
                name: "boost pad",
                desc: "provides boost when stepped on",
                req: ["stone", 20, "wood", 5],
                ignoreCollision: true,
                boostSpeed: 1.5,
                health: 150,
                colDiv: 0.7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: module.exports.groups[7],
                doUpdate: true,
                name: "turret",
                desc: "defensive structure that shoots at enemies",
                req: ["wood", 200, "stone", 150],
                health: 800,
                projectile: 1,
                shootRange: 700,
                shootRate: 2200,
                scale: 43,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: module.exports.groups[8],
                name: "platform",
                desc: "platform to shoot over walls and cross over water",
                req: ["wood", 20],
                ignoreCollision: true,
                zIndex: 1,
                health: 300,
                scale: 43,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: module.exports.groups[9],
                name: "healing pad",
                desc: "standing on it will slowly heal you",
                req: ["wood", 30, "food", 10],
                ignoreCollision: true,
                healCol: 15,
                health: 400,
                colDiv: 0.7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 9,
                group: module.exports.groups[10],
                name: "spawn pad",
                desc: "you will spawn here when you die but it will dissapear",
                req: ["wood", 100, "stone", 100],
                health: 400,
                ignoreCollision: true,
                spawnPoint: true,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: module.exports.groups[12],
                name: "blocker",
                desc: "blocks building in radius",
                req: ["wood", 30, "stone", 25],
                ignoreCollision: true,
                blocker: 300,
                health: 400,
                colDiv: 0.7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }, {
                age: 7,
                group: module.exports.groups[13],
                name: "teleporter",
                desc: "teleports you to a random point on the map",
                req: ["wood", 60, "stone", 60],
                ignoreCollision: true,
                teleport: true,
                health: 200,
                colDiv: 0.7,
                scale: 45,
                holdOffset: 20,
                placeOffset: -5
            }];

            // ASSIGN IDS:
            for (var i = 0; i < module.exports.list.length; ++i) {
                module.exports.list[i].id = i;
                if (module.exports.list[i].pre) module.exports.list[i].pre = i - module.exports.list[i].pre;
            }

            // TROLOLOLOL:
            if (typeof window !== "undefined") {
                function shuffle(a) {
                    for (let i = a.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [a[i], a[j]] = [a[j], a[i]];
                    }
                    return a;
                }
            }


            /***/ }),

        /***/ "./src/js/data/mapManager.js":
        /*!***********************************!*\
  !*** ./src/js/data/mapManager.js ***!
  \***********************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            // GLOBAL MAPMANAGER:
            module.exports = {}

            /***/ }),

        /***/ "./src/js/data/objectManager.js":
        /*!**************************************!*\
  !*** ./src/js/data/objectManager.js ***!
  \**************************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            var mathFloor = Math.floor;
            var mathABS = Math.abs;
            var mathCOS = Math.cos;
            var mathSIN = Math.sin;
            var mathPOW = Math.pow;
            var mathSQRT = Math.sqrt;
            module.exports = function (GameObject, gameObjects, UTILS, config, players, server) {
                this.objects = gameObjects;
                this.grids = {};
                this.updateObjects = [];

                // SET OBJECT GRIDS:
                var tmpX, tmpY;
                var tmpS = config.mapScale/config.colGrid;
                this.setObjectGrids = function(obj) {
                    var objX = Math.min(config.mapScale, Math.max(0, obj.x));
                    var objY = Math.min(config.mapScale, Math.max(0, obj.y));
                    for (var x = 0; x < config.colGrid; ++x) {
                        tmpX = x * tmpS;
                        for (var y = 0; y < config.colGrid; ++y) {
                            tmpY = y * tmpS;
                            if (objX + obj.scale >= tmpX && objX - obj.scale <= tmpX + tmpS &&
                                objY + obj.scale >= tmpY && objY - obj.scale <= tmpY + tmpS) {
                                if (!this.grids[x + "_" + y])
                                    this.grids[x + "_" + y] = [];
                                this.grids[x + "_" + y].push(obj);
                                obj.gridLocations.push(x + "_" + y);
                            }
                        }
                    }
                };

                // REMOVE OBJECT FROM GRID:
                this.removeObjGrid = function(obj) {
                    var tmpIndx;
                    for (var i = 0; i < obj.gridLocations.length; ++i) {
                        tmpIndx = this.grids[obj.gridLocations[i]].indexOf(obj);
                        if (tmpIndx >= 0) {
                            this.grids[obj.gridLocations[i]].splice(tmpIndx, 1);
                        }
                    }
                };

                // DISABLE OBJ:
                this.disableObj = function(obj) {
                    obj.active = false;
                    if (server) {
                        if (obj.owner && obj.pps) obj.owner.pps -= obj.pps;
                        this.removeObjGrid(obj);
                        var tmpIndx = this.updateObjects.indexOf(obj);
                        if (tmpIndx >= 0) {
                            this.updateObjects.splice(tmpIndx, 1);
                        }
                    }
                };

                // HIT OBJECT:
                this.hitObj = function(tmpObj, tmpDir) {
                    for (var p = 0; p < players.length; ++p) {
                        if (players[p].active) {
                            if (tmpObj.sentTo[players[p].id]) {
                                if (!tmpObj.active) server.send(players[p].id, "12", tmpObj.sid);
                                else if (players[p].canSee(tmpObj))
                                    server.send(players[p].id, "8", UTILS.fixTo(tmpDir, 1), tmpObj.sid);
                            } if (!tmpObj.active && tmpObj.owner == players[p])
                                players[p].changeItemCount(tmpObj.group.id, -1);
                        }
                    }
                };

                // GET GRID ARRAY:
                var tmpArray = [];
                var tmpGrid;
                this.getGridArrays = function(xPos, yPos, s) {
                    tmpX = mathFloor(xPos / tmpS);
                    tmpY = mathFloor(yPos / tmpS);
                    tmpArray.length = 0;
                    try {
                        if (this.grids[tmpX + "_" + tmpY])
                            tmpArray.push(this.grids[tmpX + "_" + tmpY]);
                        if (xPos + s >= (tmpX + 1) * tmpS) { // RIGHT
                            tmpGrid = this.grids[(tmpX + 1) + "_" + tmpY];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                            if (tmpY && yPos - s <= tmpY * tmpS) { // TOP RIGHT
                                tmpGrid = this.grids[(tmpX + 1) + "_" + (tmpY - 1)];
                                if (tmpGrid) tmpArray.push(tmpGrid);
                            } else if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM RIGHT
                                tmpGrid = this.grids[(tmpX + 1) + "_" + (tmpY + 1)];
                                if (tmpGrid) tmpArray.push(tmpGrid);
                            }
                        } if (tmpX && xPos - s <= tmpX * tmpS) { // LEFT
                            tmpGrid = this.grids[(tmpX - 1) + "_" + tmpY];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                            if (tmpY && yPos - s <= tmpY * tmpS) { // TOP LEFT
                                tmpGrid = this.grids[(tmpX - 1) + "_" + (tmpY - 1)];
                                if (tmpGrid) tmpArray.push(tmpGrid);
                            } else if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM LEFT
                                tmpGrid = this.grids[(tmpX - 1) + "_" + (tmpY + 1)];
                                if (tmpGrid) tmpArray.push(tmpGrid);
                            }
                        } if (yPos + s >= (tmpY + 1) * tmpS) { // BOTTOM
                            tmpGrid = this.grids[tmpX + "_" + (tmpY + 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        } if (tmpY && yPos - s <= tmpY * tmpS) { // TOP
                            tmpGrid = this.grids[tmpX + "_" + (tmpY - 1)];
                            if (tmpGrid) tmpArray.push(tmpGrid);
                        }
                    } catch (e) {}
                    return tmpArray;
                };

                // ADD NEW:
                var tmpObj;
                this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                    tmpObj = null;
                    for (var i = 0; i < gameObjects.length; ++i) {
                        if (gameObjects[i].sid == sid) {
                            tmpObj = gameObjects[i];
                            break;
                        }
                    } if (!tmpObj) {
                        for (var i = 0; i < gameObjects.length; ++i) {
                            if (!gameObjects[i].active) {
                                tmpObj = gameObjects[i];
                                break;
                            }
                        }
                    } if (!tmpObj) {
                        tmpObj = new GameObject(sid);
                        gameObjects.push(tmpObj);
                    }
                    if (setSID)
                        tmpObj.sid = sid;
                    tmpObj.init(x, y, dir, s, type, data, owner);
                    if (true) {
                        this.setObjectGrids(tmpObj);
                        if (tmpObj.doUpdate)
                            this.updateObjects.push(tmpObj);
                    }
                };

                // DISABLE BY SID:
                this.disableBySid = function(sid) {
                    for (var i = 0; i < gameObjects.length; ++i) {
                        if (gameObjects[i].sid == sid) {
                            this.disableObj(gameObjects[i]);
                            break;
                        }
                    }
                };

                // REMOVE ALL FROM PLAYER:
                this.removeAllItems = function(sid, server) {
                    for (var i = 0; i < gameObjects.length; ++i) {
                        if (gameObjects[i].active && gameObjects[i].owner && gameObjects[i].owner.sid == sid) {
                            this.disableObj(gameObjects[i]);
                        }
                    }
                    if (server) {
                        server.broadcast("13", sid);
                    }
                };

                // FETCH SPAWN OBJECT:
                this.fetchSpawnObj = function(sid) {
                    var tmpLoc = null;
                    for (var i = 0; i < gameObjects.length; ++i) {
                        tmpObj = gameObjects[i];
                        if (tmpObj.active && tmpObj.owner && tmpObj.owner.sid == sid && tmpObj.spawnPoint) {
                            tmpLoc = [tmpObj.x, tmpObj.y];
                            this.disableObj(tmpObj);
                            server.broadcast("12", tmpObj.sid);
                            if (tmpObj.owner) {
                                tmpObj.owner.changeItemCount(tmpObj.group.id, -1);
                            }
                            break;
                        }
                    }
                    return tmpLoc;
                };

                // CHECK IF PLACABLE:
                this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
                    for (var i = 0; i < gameObjects.length; ++i) {
                        var blockS = (gameObjects[i].blocker?
                                      gameObjects[i].blocker:gameObjects[i].getScale(sM, gameObjects[i].isItem));
                        if (gameObjects[i].active && UTILS.getDistance(x, y, gameObjects[i].x,
                                                                       gameObjects[i].y) < (s + blockS))
                            return false;
                    } if (!ignoreWater && indx != 18 && y >= (config.mapScale / 2) - (config.riverWidth / 2) && y <=
                          (config.mapScale / 2) + (config.riverWidth / 2)) {
                        return false;
                    }
                    return true;
                };

                // ADD PROJECTILE:
                this.addProjectile = function(x, y, dir, range, indx) {
                    var tmpData = items.projectiles[indx];
                    var tmpProj;
                    for (var i = 0; i < projectiles.length; ++i) {
                        if (!projectiles[i].active) {
                            tmpProj = projectiles[i];
                            break;
                        }
                    }
                    if (!tmpProj) {
                        tmpProj = new Projectile(players, UTILS);
                        projectiles.push(tmpProj);
                    }
                    tmpProj.init(indx, x, y, dir, tmpData.speed, range, tmpData.scale);
                };

                // CHECK PLAYER COLLISION:
                this.checkCollision = function(player, other, delta) {
                    delta = delta||1;
                    var dx = player.x2 - other.x;
                    var dy = player.y2 - other.y;
                    var tmpLen = player.scale + other.scale;
                    if (mathABS(dx) <= tmpLen || mathABS(dy) <= tmpLen) {
                        tmpLen = player.scale + (other.getScale?other.getScale():other.scale);
                        var tmpInt = mathSQRT(dx * dx + dy * dy) - tmpLen;
                        if (tmpInt <= 0) {
                            if (!other.ignoreCollision) {
                                var tmpDir = UTILS.getDirection(player.x2, player.y2, other.x, other.y);
                                var tmpDist = UTILS.getDistance(player.x2, player.y2, other.x, other.y);
                                if (other.isPlayer) {
                                    tmpInt = (tmpInt * -1) / 2;
                                    // player.x += (tmpInt * mathCOS(tmpDir));
                                    // player.y += (tmpInt * mathSIN(tmpDir));
                                    // other.x -= (tmpInt * mathCOS(tmpDir));
                                    // other.y -= (tmpInt * mathSIN(tmpDir));
                                } else {
                                    // player.x = other.x + (tmpLen * mathCOS(tmpDir));
                                    //  player.y = other.y + (tmpLen * mathSIN(tmpDir));
                                    player.xVel *= 0.75;
                                    player.yVel *= 0.75;
                                }
                                if (other.dmg && other.owner != player && !(other.owner &&
                                                                            other.owner.team && other.owner.team == player.team)) {
                                    player.changeHealth(-other.dmg, other.owner, other);
                                    var tmpSpd = 1.5 * (other.weightM||1);
                                    player.xVel += tmpSpd * mathCOS(tmpDir);
                                    player.yVel += tmpSpd * mathSIN(tmpDir);
                                    if (other.pDmg && !(player.skin && player.skin.poisonRes)) {
                                        player.dmgOverTime.dmg = other.pDmg;
                                        player.dmgOverTime.time = 5;
                                        player.dmgOverTime.doer = other.owner;
                                    }
                                    if (player.colDmg && other.health) {
                                        //if (other.changeHealth(-player.colDmg)) this.disableObj(other);
                                        this.hitObj(other, UTILS.getDirection(player.x2, player.y2, other.x, other.y));
                                    }
                                }
                            } else if (other.trap && !player.noTrap && other.owner != player && !(other.owner &&
                                                                                                  other.owner.team && other.owner.team == player.team)) {
                                player.lockMove = true;
                                other.hideFromEnemy = false;
                            } else if (other.boostSpeed) {
                                player.xVel += (delta * other.boostSpeed * (other.weightM||1)) * mathCOS(other.dir);
                                player.yVel += (delta * other.boostSpeed * (other.weightM||1)) * mathSIN(other.dir);
                            } else if (other.healCol) {
                                player.healCol = other.healCol;
                            } else if (other.teleport) {
                                // player.x = UTILS.randInt(0, config.mapScale);
                                // player.y = UTILS.randInt(0, config.mapScale);
                            }
                            if (other.zIndex > player.zIndex) player.zIndex = other.zIndex;
                            return true;
                        }
                    }
                    return false;
                };

            };


            /***/ }),

        /***/ "./src/js/data/player.js":
        /*!*******************************!*\
  !*** ./src/js/data/player.js ***!
  \*******************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            var mathABS = Math.abs;
            var mathCOS = Math.cos;
            var mathSIN = Math.sin;
            var mathPOW = Math.pow;
            var mathSQRT = Math.sqrt;
            module.exports = function(id, sid, config, UTILS, projectileManager,
                                       objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
                this.id = id;
                this.sid = sid;
                this.tmpScore = 0;
                this.team = null;
                this.skinIndex = 0;
                this.tailIndex = 0;
                this.hitTime = 0;
                this.tails = {};
                for (var i = 0; i < accessories.length; ++i) {
                    if (accessories[i].price <= 0)
                        this.tails[accessories[i].id] = 1;
                }
                this.skins = {};
                for (var i = 0; i < hats.length; ++i) {
                    if (hats[i].price <= 0)
                        this.skins[hats[i].id] = 1;
                }
                this.points = 0;
                this.dt = 0;
                this.hidden = false;
                this.itemCounts = {};
                this.isPlayer = true;
                this.pps = 0;
                this.moveDir = undefined;
                this.skinRot = 0;
                this.lastPing = 0;
                this.iconIndex = 0;
                this.skinColor = 0;

                // SPAWN:
                this.spawn = function(moofoll) {
                    this.active = true;
                    this.alive = true;
                    this.lockMove = false;
                    this.lockDir = false;
                    this.minimapCounter = 0;
                    this.chatCountdown = 0;
                    this.shameCount = 0;
                    this.shameTimer = 0;
                    this.sentTo = {};
                    this.gathering = 0;
                    this.autoGather = 0;
                    this.animTime = 0;
                    this.animSpeed = 0;
                    this.mouseState = 0;
                    this.buildIndex = -1;
                    this.weaponIndex = 0;
                    this.dmgOverTime = {};
                    this.noMovTimer = 0;
                    this.maxXP = 300;
                    this.XP = 0;
                    this.age = 1;
                    this.kills = 0;
                    this.upgrAge = 2;
                    this.upgradePoints = 0;
                    this.x = 0;
                    this.y = 0;
                    this.zIndex = 0;
                    this.xVel = 0;
                    this.yVel = 0;
                    this.slowMult = 1;
                    this.dir = 0;
                    this.dirPlus = 0;
                    this.targetDir = 0;
                    this.targetAngle = 0;
                    this.maxHealth = 100;
                    this.health = this.maxHealth;
                    this.scale = config.playerScale;
                    this.speed = config.playerSpeed;
                    this.resetMoveDir();
                    this.resetResources(moofoll);
                    this.items = [0, 3, 6, 10];
                    this.weapons = [0];
                    this.shootCount = 0;
                    this.weaponXP = [];
                    this.reloads = [{count: Math.ceil(300 / 111), date: 0, limit: Math.ceil(300 / 111), limit_: 300, ready: true, id: 5, val: 0},
                                    {count: Math.ceil(1500 / 111), date: 0, limit: Math.ceil(1500 / 111), limit_: 1500, ready: true, id: 15, val: 0},
                                    {count: 23, date: 0, limit: 23, ready: true, limit_: 2500}];
                };

                // RESET MOVE DIR:
                this.resetMoveDir = function() {
                    this.moveDir = undefined;
                };

                // RESET RESOURCES:
                this.resetResources = function(moofoll) {
                    for (var i = 0; i < config.resourceTypes.length; ++i) {
                        this[config.resourceTypes[i]] = moofoll?100:0;
                    }
                };

                // ADD ITEM:
                this.addItem = function(id) {
                    var tmpItem = items.list[id];
                    if (tmpItem) {
                        for (var i = 0; i < this.items.length; ++i) {
                            if (items.list[this.items[i]].group == tmpItem.group) {
                                if (this.buildIndex == this.items[i])
                                    this.buildIndex = id;
                                this.items[i] = id;
                                return true;
                            }
                        }
                        this.items.push(id);
                        return true;
                    }
                    return false;
                };

                // SET USER DATA:
                this.setUserData = function(data) {
                    if (data) {
                        // SET INITIAL NAME:
                        this.name = "unknown";

                        // VALIDATE NAME:
                        var name = data.name + "";
                        name = name.slice(0, config.maxNameLength);
                        name = name.replace(/[^\w:\(\)\/? -]+/gmi, " ");  // USE SPACE SO WE CAN CHECK PROFANITY
                        name = name.replace(/[^\x00-\x7F]/g, " ");
                        name = name.trim();

                        // CHECK IF IS PROFANE:
                        var isProfane = false;

                        if (name.length > 0 && !isProfane) {
                            this.name = name;
                        }

                        // SKIN:
                        this.skinColor = 0;
                        if (config.skinColors[data.skin])
                            this.skinColor = data.skin;
                    }
                };

                // GET DATA TO SEND:
                this.getData = function() {
                    return [
                        this.id,
                        this.sid,
                        this.name,
                        UTILS.fixTo(this.x, 2),
                        UTILS.fixTo(this.y, 2),
                        UTILS.fixTo(this.dir, 3),
                        this.health,
                        this.maxHealth,
                        this.scale,
                        this.skinColor
                    ];
                };

                // SET DATA:
                this.setData = function(data) {
                    this.id = data[0];
                    this.sid = data[1];
                    this.name = data[2];
                    this.x = data[3];
                    this.y = data[4];
                    this.dir = data[5];
                    this.health = data[6];
                    this.maxHealth = data[7];
                    this.scale = data[8];
                    this.skinColor = data[9];
                };

                // UPDATE:
                var timerCount = 0;
                this.update = function(delta) {
                    if (!this.alive) return;

                    const Weapon = items.weapons[this.weaponIndex];
                    let Reload = this.reloads[Number(this.weaponIndex > 8)]; /* Secondary / Primary */

                    const variantValue = (() => {
                        const variants = [1, 1.1, 1.18, 1.18];

                        return variants[this.weaponVariant];
                    })();

                    if(Reload.id != Weapon.id) {
                        Reload.id = Weapon.id;
                        Reload.limit = Weapon.speed ? (Math.ceil(Weapon.speed / (1e3 / 9))) : 0;
                        Reload.limit_ = Weapon.speed;
                        Reload.count = Reload.limit;
                        Reload.ready = true;
                        Reload.val = variantValue;
                    }

                    if(variantValue != Reload.val) Reload.val = variantValue;

                    if(Reload.count < Reload.limit && this.buildIndex == -1){
                        Reload.count += 1;
                        Reload.ready = Reload.count == Reload.limit;
                    }

                    this.reloads[Number(this.weaponIndex > 8)] = Reload;
                    if(this.reloads[2].count < 23) {
                        this.reloads[2].count += 1;
                        if(this.reloads[2].count === 23) this.reloads[2].ready = true;
                    }

                    // SHAME SHAME SHAME:
                    if (this.shameTimer > 0) {
                        this.shameTimer -= delta;
                        if (this.shameTimer <= 0) {
                            this.shameTimer = 0;
                            this.shameCount = 0;
                        }
                    }

                    // REGENS AND AUTO:
                    timerCount -= delta;
                    if (timerCount <= 0) {
                        var regenAmount = (this.skin && this.skin.healthRegen?this.skin.healthRegen:0) +
                            (this.tail && this.tail.healthRegen?this.tail.healthRegen:0);
                        if (regenAmount) {
                            console.log("regenAmnt", regenAmount);
                            //  this.changeHealth(regenAmount, this);
                        } if (this.dmgOverTime.dmg) {
                            console.log("dOT", -this.dmgOverTime.dmg);
                            // this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer);
                            this.dmgOverTime.time -= 1;
                            if (this.dmgOverTime.time <= 0)
                                this.dmgOverTime.dmg = 0;
                        } if (this.healCol) {
                            console.log("hc", this.healCol);
                            //   this.changeHealth(this.healCol, this);
                        }
                        timerCount = 1000;
                    }

                    // CHECK KILL:
                    //if (!this.alive) return;

                    // SLOWER:
                    if (this.slowMult < 1) {
                        this.slowMult += 0.0008 * delta;
                        if (this.slowMult > 1)
                            this.slowMult = 1;
                    }

                    // MOVE:
                    this.noMovTimer += delta;
                    if (this.xVel || this.yVel) this.noMovTimer = 0;
                    if (this.lockMove) {
                        this.xVel = 0;
                        this.yVel = 0;
                    } else {
                        var spdMult = ((this.buildIndex>=0)?0.5:1) * (items.weapons[this.weaponIndex].spdMult||1) *
                            (this.skin?(this.skin.spdMult||1):1) * (this.tail?(this.tail.spdMult||1):1) * (this.y2<=config.snowBiomeTop?
                                                                                                           ((this.skin&&this.skin.coldM)?1:config.snowSpeed):1) * this.slowMult;
                        if (!this.zIndex && this.y2 >= (config.mapScale / 2) - (config.riverWidth / 2) &&
                            this.y2 <= (config.mapScale / 2) + (config.riverWidth / 2)) {
                            if (this.skin && this.skin.watrImm) {
                                spdMult *= 0.75;
                                this.xVel += config.waterCurrent * 0.4 * delta;
                            } else {
                                spdMult *= 0.33;
                                this.xVel += config.waterCurrent * delta;
                            }
                        }
                        var xVel = (this.moveDir!=undefined)?mathCOS(this.moveDir):0;
                        var yVel = (this.moveDir!=undefined)?mathSIN(this.moveDir):0;
                        var length = mathSQRT(xVel * xVel + yVel * yVel);
                        if (length != 0) {
                            xVel /= length;
                            yVel /= length;
                        }

                        if (xVel) this.xVel += xVel * this.speed * spdMult * delta;
                        if (yVel) this.yVel += yVel * this.speed * spdMult * delta;
                    }

                    // OBJECT COLL:
                    this.zIndex = 0;
                    this.lockMove = false;
                    this.healCol = 0;
                    var tmpList;
                    var tmpSpeed = UTILS.getDistance(0, 0, this.xVel * delta, this.yVel * delta);
                    var depth = Math.min(4, Math.max(1, Math.round(tmpSpeed / 40)));
                    var tMlt = 1 / depth;
                    for (var i = 0; i < depth; ++i) {
                        if (this.xVel){
                            // this.x += (this.xVel * delta) * tMlt;
                        }
                        if (this.yVel){
                            //console.log("yVel", (this.yVel * delta) * tMlt)
                            //  this.y += (this.yVel * delta) * tMlt;
                        }
                        tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                        for (var x = 0; x < tmpList.length; ++x) {
                            for (var y = 0; y < tmpList[x].length; ++y) {
                                if (tmpList[x][y].active) objectManager.checkCollision(this, tmpList[x][y], tMlt);
                            }
                        }
                    }

                    // PLAYER COLLISIONS:
                    var tmpIndx = players.indexOf(this);
                    for (var i = tmpIndx + 1; i < players.length; ++i) {
                        if (players[i] != this && players[i].alive) objectManager.checkCollision(this, players[i]);
                    }

                    // DECEL:
                    if (this.xVel) {
                        this.xVel *= mathPOW(config.playerDecel, delta);
                        if (this.xVel <= 0.01 && this.xVel >= -0.01) this.xVel = 0;
                    } if (this.yVel) {
                        this.yVel *= mathPOW(config.playerDecel, delta);
                        if (this.yVel <= 0.01 && this.yVel >= -0.01) this.yVel = 0;
                    }

                    // MAP BOUNDARIES:
                    /* if (this.x - this.scale < 0) {
                        this.x = this.scale;
                    } else if (this.x + this.scale > config.mapScale) {
                        this.x = config.mapScale - this.scale;
                    } if (this.y - this.scale < 0) {
                        this.y = this.scale;
                    } else if (this.y + this.scale > config.mapScale) {
                        this.y = config.mapScale - this.scale;
                    }*/

                    // USE WEAPON OR TOOL:
                    if (this.buildIndex < 0) {
                        if (this.reloads[this.weaponIndex] > 0) {
                            // this.reloads[this.weaponIndex] -= delta;
                            this.gathering = this.mouseState;
                        } else if (this.gathering || this.autoGather) {
                            var worked = true;
                            if (items.weapons[this.weaponIndex].gather != undefined) {
                                //   this.gather(players);
                            } else if (items.weapons[this.weaponIndex].projectile != undefined &&
                                       this.hasRes(items.weapons[this.weaponIndex], (this.skin?this.skin.projCost:0))) {
                                //   this.useRes(items.weapons[this.weaponIndex], (this.skin?this.skin.projCost:0));
                                this.noMovTimer = 0;
                                var tmpIndx = items.weapons[this.weaponIndex].projectile;
                                var projOffset = this.scale * 2;
                                var aMlt = (this.skin&&this.skin.aMlt)?this.skin.aMlt:1;
                                if (items.weapons[this.weaponIndex].rec) {
                                    this.xVel -= items.weapons[this.weaponIndex].rec * mathCOS(this.dir);
                                    this.yVel -= items.weapons[this.weaponIndex].rec * mathSIN(this.dir);
                                }
                                /* projectileManager.addProjectile(this.x+(projOffset*mathCOS(this.dir)),
                                                                this.y+(projOffset*mathSIN(this.dir)), this.dir, items.projectiles[tmpIndx].range*aMlt,
                                                                items.projectiles[tmpIndx].speed*aMlt, tmpIndx, this, null, this.zIndex);*/
                            } else {
                                worked = false;
                            }
                            this.gathering = this.mouseState;
                            if (worked) {
                                // this.reloads[this.weaponIndex] = items.weapons[this.weaponIndex].speed*(this.skin?(this.skin.atkSpd||1):1);
                            }
                        }
                    }

                    // console.log("a", Math.round(this.xVel * 240), Math.round(this.yVel * 240))
                };

                // ADD WEAPON XP:
                this.addWeaponXP = function(amnt) {
                    if (!this.weaponXP[this.weaponIndex])
                        this.weaponXP[this.weaponIndex] = 0;
                    this.weaponXP[this.weaponIndex] += amnt;
                };

                // EARN XP:
                this.earnXP = function(amount) {
                    if (this.age < config.maxAge) {
                        this.XP += amount;
                        if (this.XP >= this.maxXP) {
                            if (this.age < config.maxAge) {
                                this.age++;
                                this.XP = 0;
                                this.maxXP *= 1.2;
                            } else {
                                this.XP = this.maxXP;
                            }
                            this.upgradePoints++;
                            server.send(this.id, "16", this.upgradePoints, this.upgrAge);
                            server.send(this.id, "15", this.XP, UTILS.fixTo(this.maxXP, 1), this.age);
                        } else {
                            server.send(this.id, "15", this.XP);
                        }
                    }
                };

                // CHANGE HEALTH:
                this.changeHealth = function(amount, doer) {
                    return
                    if (amount > 0 && this.health >= this.maxHealth)
                        return false
                    if (amount < 0 && this.skin)
                        amount *= this.skin.dmgMult||1;
                    if (amount < 0 && this.tail)
                        amount *= this.tail.dmgMult||1;
                    if (amount < 0)
                        this.hitTime = Date.now();
                    this.health += amount;
                    if (this.health > this.maxHealth) {
                        amount -= (this.health - this.maxHealth);
                        this.health = this.maxHealth;
                    }
                    /*if (this.health <= 0)
                        this.kill(doer);
                    for (var i = 0; i < players.length; ++i) {
                        if (this.sentTo[players[i].id])
                            server.send(players[i].id, "h", this.sid, Math.round(this.health));
                    }
                    if (doer && doer.canSee(this) && !(doer == this && amount < 0)) {
                        server.send(doer.id, "t", Math.round(this.x),
                                    Math.round(this.y), Math.round(-amount), 1);
                    }*/
                    return true;
                };

                // KILL:
                this.kill = function(doer) {
                    if (doer && doer.alive) {
                        doer.kills++;
                        if (doer.skin && doer.skin.goldSteal) scoreCallback(doer, Math.round(this.points / 2));
                        else scoreCallback(doer, Math.round(this.age*100*((doer.skin&&doer.skin.kScrM)?doer.skin.kScrM:1)));
                        server.send(doer.id, "9", "kills", doer.kills, 1);
                    }
                    this.alive = false;
                    server.send(this.id, "11");
                    iconCallback();
                };

                // ADD RESOURCE:
                this.addResource = function(type, amount, auto) {
                    if (!auto && amount > 0)
                        this.addWeaponXP(amount);
                    if (type == 3) {
                        scoreCallback(this, amount, true);
                    } else {
                        this[config.resourceTypes[type]] += amount;
                        server.send(this.id, "9", config.resourceTypes[type], this[config.resourceTypes[type]], 1);
                    }
                };

                // CHANGE ITEM COUNT:
                this.changeItemCount = function(index, value) {
                    this.itemCounts[index] = this.itemCounts[index]||0;
                    this.itemCounts[index] += value;
                    server.send(this.id, "14", index, this.itemCounts[index]);
                };

                // BUILD:
                this.buildItem = function(item) {
                    var tmpS = (this.scale + item.scale + (item.placeOffset||0));
                    var tmpX = this.x + (tmpS * mathCOS(this.dir));
                    var tmpY = this.y + (tmpS * mathSIN(this.dir));
                    if (this.canBuild(item) && !(item.consume && (this.skin && this.skin.noEat))
                        && (item.consume || objectManager.checkItemLocation(tmpX, tmpY, item.scale,
                                                                            0.6, item.id, false, this))) {
                        var worked = false;
                        if (item.consume) {
                            if (this.hitTime) {
                                var timeSinceHit = Date.now() - this.hitTime;
                                this.hitTime = 0;
                                if (timeSinceHit <= 120) {
                                    this.shameCount++;
                                    if (this.shameCount >= 8) {
                                        this.shameTimer = 30000;
                                        this.shameCount = 0;
                                    }
                                } else {
                                    this.shameCount -= 2;
                                    if (this.shameCount <= 0) {
                                        this.shameCount = 0;
                                    }
                                }
                            }
                            if (this.shameTimer <= 0)
                                worked = item.consume(this);
                        } else {
                            worked = true;
                            if (item.group.limit) {
                                this.changeItemCount(item.group.id, 1);
                            }
                            if (item.pps)
                                this.pps += item.pps;
                            objectManager.add(objectManager.objects.length, tmpX, tmpY, this.dir, item.scale,
                                              item.type, item, false, this);
                        }
                        if (worked) {
                            this.useRes(item);
                            this.buildIndex = -1;
                        }
                    }
                };

                // HAS RESOURCES:
                this.hasRes = function(item, mult) {
                    for (var i = 0; i < item.req.length;) {
                        if (this[item.req[i]] < Math.round(item.req[i + 1] * (mult||1)))
                            return false;
                        i+=2;
                    }
                    return true;
                };

                // USE RESOURCES:
                this.useRes = function(item, mult) {
                    if (config.inSandbox)
                        return;
                    for (var i = 0; i < item.req.length;) {
                        this.addResource(config.resourceTypes.indexOf(item.req[i]), -Math.round(item.req[i+1]*(mult||1)));
                        i+=2;
                    }
                };

                // CAN BUILD:
                this.canBuild = function(item) {
                    if (config.inSandbox)
                        return true;
                    if (item.group.limit && this.itemCounts[item.group.id] >= item.group.limit)
                        return false;
                    return this.hasRes(item);
                };

                // GATHER:
                this.gather = function() {

                    // SHOW:
                    this.noMovTimer = 0;

                    // SLOW MOVEMENT:
                    this.slowMult -= (items.weapons[this.weaponIndex].hitSlow||0.3);
                    if (this.slowMult < 0) this.slowMult = 0;

                    // VARIANT DMG:
                    var tmpVariant = config.fetchVariant(this);
                    var applyPoison = tmpVariant.poison;
                    var variantDmg = tmpVariant.val;

                    // CHECK IF HIT GAME OBJECT:
                    var hitObjs = {};
                    var tmpDist, tmpDir, tmpObj, hitSomething;
                    var tmpList = objectManager.getGridArrays(this.x2, this.y2, items.weapons[this.weaponIndex].range);

                    for (var t = 0; t < tmpList.length; ++t) {
                        for (var i = 0; i < tmpList[t].length; ++i) {
                            tmpObj = tmpList[t][i];
                            if (tmpObj.active && !tmpObj.dontGather && !hitObjs[tmpObj.sid] && tmpObj.visibleToPlayer(this)) {
                                tmpDist = UTILS.getDistance(this.x2, this.y2, tmpObj.x, tmpObj.y) - tmpObj.scale;
                                if (tmpDist <= items.weapons[this.weaponIndex].range) {
                                    tmpDir = UTILS.getDirection(tmpObj.x, tmpObj.y, this.x2, this.y2);
                                    if (UTILS.getAngleDist(tmpDir, this.d2) <= config.gatherAngle) {
                                        hitObjs[tmpObj.sid] = 1;
                                        if (tmpObj.health) {
                                            tmpObj.changeHealth(-items.weapons[this.weaponIndex].dmg*(variantDmg)*
                                                                (items.weapons[this.weaponIndex].sDmg||1)*(this.skinIndex === 40 ? 3.3 : 1), this)
                                            //  console.log("bl", tmpObj.health);
                                        } else {
                                            /*this.earnXP(4*items.weapons[this.weaponIndex].gather);
                                            var count = items.weapons[this.weaponIndex].gather+(tmpObj.type==3?4:0);
                                            if (this.skin && this.skin.extraGold) {
                                                this.addResource(3, 1);
                                            } this.addResource(tmpObj.type, count);*/
                                        }
                                        hitSomething = true;
                                        //objectManager.hitObj(tmpObj, tmpDir);
                                    }
                                }
                            }
                        }
                    }

                    // CHECK IF HIT PLAYER:
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i]||ais[i-players.length];
                        if (tmpObj != this && tmpObj.visible && !(tmpObj.team && tmpObj.team == this.team)) {
                            tmpDist = UTILS.getDistance(this.x2, this.y2, tmpObj.x2, tmpObj.y2) - (tmpObj.scale * 1.8);
                            if (tmpDist <= items.weapons[this.weaponIndex].range) {
                                tmpDir = UTILS.getDirection(tmpObj.x2, tmpObj.y2, this.x2, this.y2);
                                if (UTILS.getAngleDist(tmpDir, this.d2) <= config.gatherAngle) {

                                    // STEAL RESOURCES:
                                    var stealCount = items.weapons[this.weaponIndex].steal;
                                    if (stealCount && tmpObj.addResource) {
                                        /*stealCount = Math.min((tmpObj.points||0), stealCount);
                                        this.addResource(3, stealCount);
                                        tmpObj.addResource(3, -stealCount);*/
                                    }

                                    // MELEE HIT PLAYER:
                                    var dmgMlt = variantDmg;
                                    if (tmpObj.weaponIndex != undefined && items.weapons[tmpObj.weaponIndex].shield &&
                                        UTILS.getAngleDist(tmpDir+Math.PI, tmpObj.dir) <= config.shieldAngle) {
                                        dmgMlt = items.weapons[tmpObj.weaponIndex].shield;
                                    }
                                    var dmgVal = items.weapons[this.weaponIndex].dmg *
                                        (this.skin && this.skin.dmgMultO?this.skin.dmgMultO:1) *
                                        (this.tail && this.tail.dmgMultO?this.tail.dmgMultO:1);
                                    var tmpSpd = (0.3 * (tmpObj.weightM||1)) + (items.weapons[this.weaponIndex].knock||0);
                                    tmpObj.xVel += tmpSpd * mathCOS(tmpDir);
                                    tmpObj.yVel += tmpSpd * mathSIN(tmpDir);

                                    let dmg = 0;

                                    if (this.skin && this.skin.healD) dmg = dmgVal * dmgMlt * this.skin.healD;
                                    if (this.tail && this.tail.healD) dmg = dmgVal * dmgMlt * this.tail.healD;
                                    if (tmpObj.skin && tmpObj.skin.dmg && dmgMlt == 1) dmg = -dmgVal * tmpObj.skin.dmg;
                                    if (tmpObj.tail && tmpObj.tail.dmg && dmgMlt == 1) dmg = -dmgVal * tmpObj.tail.dmg;
                                    if (tmpObj.dmgOverTime && this.skin && this.skin.poisonDmg &&
                                        !(tmpObj.skin && tmpObj.skin.poisonRes)) {
                                        tmpObj.dmgOverTime.dmg = this.skin.poisonDmg;
                                        tmpObj.dmgOverTime.time = this.skin.poisonTime||1;
                                        tmpObj.dmgOverTime.doer = this;
                                    } if (tmpObj.dmgOverTime && applyPoison &&
                                          !(tmpObj.skin && tmpObj.skin.poisonRes)) {
                                        tmpObj.dmgOverTime.dmg = 5;
                                        tmpObj.dmgOverTime.time = 5;
                                        tmpObj.dmgOverTime.doer = this;
                                    } if (tmpObj.skin && tmpObj.skin.dmgK) {
                                        this.xVel -= tmpObj.skin.dmgK * mathCOS(tmpDir);
                                        this.yVel -= tmpObj.skin.dmgK * mathSIN(tmpDir);
                                    }

                                    dmg = -dmgVal * dmgMlt;

                                    console.log(`${this.name} -> ${tmpObj.name}`, dmg)
                                }
                            }
                        }
                    }

                    // SEND FOR ANIMATION:
                    // this.sendAnimation(hitSomething?1:0);
                };

                // SEND ANIMATION:
                this.sendAnimation = function(hit) {
                    for (var i = 0; i < players.length; ++i) {
                        if (this.sentTo[players[i].id] && this.canSee(players[i])) {
                            server.send(players[i].id, "7", this.sid, hit?1:0, this.weaponIndex);
                        }
                    }
                };

                // ANIMATE:
                var tmpRatio = 0;
                var animIndex = 0;
                this.animate = function(delta) {
                    if (this.animTime > 0) {
                        this.animTime -= delta;
                        if (this.animTime <= 0) {
                            this.animTime = 0;
                            this.dirPlus = 0;
                            tmpRatio = 0;
                            animIndex = 0;
                        } else {
                            if (animIndex == 0) {
                                tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                if (tmpRatio >= 1) {
                                    tmpRatio = 1;
                                    animIndex = 1;
                                }
                            } else {
                                tmpRatio -= delta / (this.animSpeed * (1-config.hitReturnRatio));
                                this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                            }
                        }
                    }
                };

                // GATHER ANIMATION:
                this.startAnim = function(didHit, index) {
                    this.animTime = this.animSpeed = items.weapons[index].speed;
                    this.targetAngle = (didHit?-config.hitAngle:-Math.PI);
                    tmpRatio = 0;
                    animIndex = 0;

                    const variantValue = (() => {
                        const variants = [1, 1.1, 1.18, 1.18];

                        return variants[this.weaponVariant];
                    })();

                    const angleDist = (e, t) => {
                        const i = Math.abs(t - e) % (Math.PI * 2);
                        return i > Math.PI ? Math.PI * 2 - i : i
                    }

                    const weapon = items.weapons[this.weaponIndex];
                    let reload = this.reloads[Number(index > 8)];

                    reload.count = 0;
                    reload.date = Date.now();
                    reload.ready = false;

                    this.gather();
                };

                // CAN SEE:
                this.canSee = function(other) {
                    if (!other) return false;
                    if (other.skin && other.skin.invisTimer && other.noMovTimer
                        >= other.skin.invisTimer) return false;
                    var dx = mathABS(other.x - this.x) - other.scale;
                    var dy = mathABS(other.y - this.y) - other.scale;
                    return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                };

            };


            /***/ }),

        /***/ "./src/js/data/projectile.js":
        /*!***********************************!*\
  !*** ./src/js/data/projectile.js ***!
  \***********************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            module.exports = function (players, ais, objectManager, items, config, UTILS, server) {

                // INIT:
                this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
                    this.active = true;
                    this.indx = indx;
                    this.x = x;
                    this.y = y;
                    this.dir = dir;
                    this.skipMov = true;
                    this.speed = spd;
                    this.dmg = dmg;
                    this.scale = scl;
                    this.range = rng;
                    this.owner = owner;
                    if (server)
                        this.sentTo = {};
                };

                // UPDATE:
                var objectsHit = [];
                var tmpObj;
                this.update = function(delta) {
                    if (this.active) {
                        var tmpSpeed = this.speed * delta;
                        var tmpScale;
                        if (!this.skipMov) {
                            this.x += tmpSpeed * Math.cos(this.dir);
                            this.y += tmpSpeed * Math.sin(this.dir);
                            this.range -= tmpSpeed;
                            if (this.range <= 0) {
                                this.x += this.range * Math.cos(this.dir);
                                this.y += this.range * Math.sin(this.dir);
                                tmpSpeed = 1;
                                this.range = 0;
                                this.active = false;
                            }
                        } else {
                            this.skipMov = false;
                        }
                        if (server) {
                            for (var i = 0; i < players.length; ++i) {
                                if (!this.sentTo[players[i].id] && players[i].canSee(this)) {
                                    this.sentTo[players[i].id] = 1;
                                    server.send(players[i].id, "18", UTILS.fixTo(this.x, 1), UTILS.fixTo(this.y, 1),
                                                UTILS.fixTo(this.dir, 2), UTILS.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid);
                                }
                            }
                            objectsHit.length = 0;
                            for (var i = 0; i < players.length + ais.length; ++i) {
                                tmpObj = players[i]||ais[i-players.length];
                                if (tmpObj.visible && tmpObj != this.owner && !(this.owner.team && tmpObj.team == this.owner.team)) {
                                    if (UTILS.lineInRect(tmpObj.x-tmpObj.scale, tmpObj.y-tmpObj.scale, tmpObj.x+tmpObj.scale,
                                                         tmpObj.y+tmpObj.scale, this.x, this.y, this.x+(tmpSpeed*Math.cos(this.dir)),
                                                         this.y+(tmpSpeed*Math.sin(this.dir)))) {
                                        objectsHit.push(tmpObj);
                                    }
                                }
                            }
                            var tmpList = objectManager.getGridArrays(this.x, this.y, this.scale);
                            for (var x = 0; x < tmpList.length; ++x) {
                                for (var y = 0; y < tmpList[x].length; ++y) {
                                    tmpObj = tmpList[x][y];
                                    tmpScale = tmpObj.getScale();
                                    if (tmpObj.active && !(this.ignoreObj == tmpObj.sid) && (this.layer <= tmpObj.layer) &&
                                        objectsHit.indexOf(tmpObj) < 0 && !tmpObj.ignoreCollision && UTILS.lineInRect(tmpObj.x-tmpScale, tmpObj.y-tmpScale, tmpObj.x+tmpScale, tmpObj.y+tmpScale,
                                                                                                                      this.x, this.y, this.x+(tmpSpeed*Math.cos(this.dir)), this.y+(tmpSpeed*Math.sin(this.dir)))) {
                                        objectsHit.push(tmpObj);
                                    }
                                }
                            }

                            // HIT OBJECTS:
                            if (objectsHit.length > 0) {
                                var hitObj = null;
                                var shortDist = null;
                                var tmpDist = null;
                                for (var i = 0; i < objectsHit.length; ++i) {
                                    tmpDist = UTILS.getDistance(this.x, this.y, objectsHit[i].x, objectsHit[i].y);
                                    if (shortDist == null || tmpDist < shortDist) {
                                        shortDist = tmpDist;
                                        hitObj = objectsHit[i];
                                    }
                                }
                                if (hitObj.isPlayer || hitObj.isAI) {
                                    var tmpSd = 0.3 * (hitObj.weightM||1);
                                    hitObj.xVel += tmpSd * Math.cos(this.dir);
                                    hitObj.yVel += tmpSd * Math.sin(this.dir);
                                    if (hitObj.weaponIndex == undefined || (!(items.weapons[hitObj.weaponIndex].shield &&
                                                                              UTILS.getAngleDist(this.dir+Math.PI, hitObj.dir) <= config.shieldAngle))) {
                                        hitObj.changeHealth(-this.dmg, this.owner, this.owner);
                                    }
                                } else {
                                    if (hitObj.projDmg && hitObj.health && hitObj.changeHealth(-this.dmg)) {
                                        objectManager.disableObj(hitObj);
                                    }
                                    for (var i = 0; i < players.length; ++i) {
                                        if (players[i].active) {
                                            if (hitObj.sentTo[players[i].id]) {
                                                if (hitObj.active) {
                                                    if (players[i].canSee(hitObj))
                                                        server.send(players[i].id, "8", UTILS.fixTo(this.dir, 2), hitObj.sid);
                                                } else {
                                                    server.send(players[i].id, "12", hitObj.sid);
                                                }
                                            }
                                            if (!hitObj.active && hitObj.owner == players[i])
                                                players[i].changeItemCount(hitObj.group.id, -1);
                                        }

                                    }
                                }
                                this.active = false;
                                for (var i = 0; i < players.length; ++i) {
                                    if (this.sentTo[players[i].id])
                                        server.send(players[i].id, "19", this.sid, UTILS.fixTo(shortDist, 1));
                                }
                            }
                        }
                    }
                };
            };


            /***/ }),

        /***/ "./src/js/data/projectileManager.js":
        /*!******************************************!*\
  !*** ./src/js/data/projectileManager.js ***!
  \******************************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            module.exports = function (Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
                this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer) {
                    var tmpData = items.projectiles[indx];
                    var tmpProj;
                    for (var i = 0; i < projectiles.length; ++i) {
                        if (!projectiles[i].active) {
                            tmpProj = projectiles[i];
                            break;
                        }
                    } if (!tmpProj) {
                        tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                        tmpProj.sid = projectiles.length;
                        projectiles.push(tmpProj);
                    }
                    tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                    tmpProj.ignoreObj = ignoreObj;
                    tmpProj.layer = layer||tmpData.layer;
                    tmpProj.src = tmpData.src;
                    return tmpProj;
                };
            };


            /***/ }),

        /***/ "./src/js/data/store.js":
        /*!******************************!*\
  !*** ./src/js/data/store.js ***!
  \******************************/
        /*! no static exports found */
        /***/ (function(module, exports) {


            // STORE HATS:
            module.exports.hats = [{
                id: 45,
                name: "Shame!",
                dontSell: true,
                price: 0,
                scale: 120,
                desc: "hacks are for losers"
            }, {
                id: 51,
                name: "Moo Cap",
                price: 0,
                scale: 120,
                desc: "coolest mooer around"
            }, {
                id: 50,
                name: "Apple Cap",
                price: 0,
                scale: 120,
                desc: "apple farms remembers"
            }, {
                id: 28,
                name: "Moo Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 29,
                name: "Pig Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 30,
                name: "Fluff Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 36,
                name: "Pandou Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 37,
                name: "Bear Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 38,
                name: "Monkey Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 44,
                name: "Polar Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 35,
                name: "Fez Hat",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 42,
                name: "Enigma Hat",
                price: 0,
                scale: 120,
                desc: "join the enigma army"
            }, {
                id: 43,
                name: "Blitz Hat",
                price: 0,
                scale: 120,
                desc: "hey everybody i'm blitz"
            }, {
                id: 49,
                name: "Bob XIII Hat",
                price: 0,
                scale: 120,
                desc: "like and subscribe"
            }, {
                id: 57,
                name: "Pumpkin",
                price: 50,
                scale: 120,
                desc: "Spooooky"
            }, {
                id: 8,
                name: "Bummle Hat",
                price: 100,
                scale: 120,
                desc: "no effect"
            }, {
                id: 2,
                name: "Straw Hat",
                price: 500,
                scale: 120,
                desc: "no effect"
            }, {
                id: 15,
                name: "Winter Cap",
                price: 600,
                scale: 120,
                desc: "allows you to move at normal speed in snow",
                coldM: 1
            }, {
                id: 5,
                name: "Cowboy Hat",
                price: 1000,
                scale: 120,
                desc: "no effect"
            }, {
                id: 4,
                name: "Ranger Hat",
                price: 2000,
                scale: 120,
                desc: "no effect"
            }, {
                id: 18,
                name: "Explorer Hat",
                price: 2000,
                scale: 120,
                desc: "no effect"
            }, {
                id: 31,
                name: "Flipper Hat",
                price: 2500,
                scale: 120,
                desc: "have more control while in water",
                watrImm: true
            }, {
                id: 1,
                name: "Marksman Cap",
                price: 3000,
                scale: 120,
                desc: "increases arrow speed and range",
                aMlt: 1.3
            }, {
                id: 10,
                name: "Bush Gear",
                price: 3000,
                scale: 160,
                desc: "allows you to disguise yourself as a bush"
            }, {
                id: 48,
                name: "Halo",
                price: 3000,
                scale: 120,
                desc: "no effect"
            }, {
                id: 6,
                name: "Soldier Helmet",
                price: 4000,
                scale: 120,
                desc: "reduces damage taken but slows movement",
                spdMult: 0.94,
                dmgMult: 0.75
            }, {
                id: 23,
                name: "Anti Venom Gear",
                price: 4000,
                scale: 120,
                desc: "makes you immune to poison",
                poisonRes: 1
            }, {
                id: 13,
                name: "Medic Gear",
                price: 5000,
                scale: 110,
                desc: "slowly regenerates health over time",
                healthRegen: 3
            }, {
                id: 9,
                name: "Miners Helmet",
                price: 5000,
                scale: 120,
                desc: "earn 1 extra gold per resource",
                extraGold: 1
            }, {
                id: 32,
                name: "Musketeer Hat",
                price: 5000,
                scale: 120,
                desc: "reduces cost of projectiles",
                projCost: 0.5
            }, {
                id: 7,
                name: "Bull Helmet",
                price: 6000,
                scale: 120,
                desc: "increases damage done but drains health",
                healthRegen: -5,
                dmgMultO: 1.5,
                spdMult: 0.96
            }, {
                id: 22,
                name: "Emp Helmet",
                price: 6000,
                scale: 120,
                desc: "turrets won't attack but you move slower",
                antiTurret: 1,
                spdMult: 0.7
            }, {
                id: 12,
                name: "Booster Hat",
                price: 6000,
                scale: 120,
                desc: "increases your movement speed",
                spdMult: 1.16
            }, {
                id: 26,
                name: "Barbarian Armor",
                price: 8000,
                scale: 120,
                desc: "knocks back enemies that attack you",
                dmgK: 0.6
            }, {
                id: 21,
                name: "Plague Mask",
                price: 10000,
                scale: 120,
                desc: "melee attacks deal poison damage",
                poisonDmg: 5,
                poisonTime: 6
            }, {
                id: 46,
                name: "Bull Mask",
                price: 10000,
                scale: 120,
                desc: "bulls won't target you unless you attack them",
                bullRepel: 1
            }, {
                id: 14,
                name: "Windmill Hat",
                topSprite: true,
                price: 10000,
                scale: 120,
                desc: "generates points while worn",
                pps: 1.5
            }, {
                id: 11,
                name: "Spike Gear",
                topSprite: true,
                price: 10000,
                scale: 120,
                desc: "deal damage to players that damage you",
                dmg: 0.45
            }, {
                id: 53,
                name: "Turret Gear",
                topSprite: true,
                price: 10000,
                scale: 120,
                desc: "you become a walking turret",
                turret: {
                    proj: 1,
                    range: 700,
                    rate: 2500
                },
                spdMult: 0.7
            }, {
                id: 20,
                name: "Samurai Armor",
                price: 12000,
                scale: 120,
                desc: "increased attack speed and fire rate",
                atkSpd: 0.78
            }, {
                id: 58,
                name: "Dark Knight",
                price: 12000,
                scale: 120,
                desc: "restores health when you deal damage",
                healD: 0.4
            }, {
                id: 27,
                name: "Scavenger Gear",
                price: 15000,
                scale: 120,
                desc: "earn double points for each kill",
                kScrM: 2
            }, {
                id: 40,
                name: "Tank Gear",
                price: 15000,
                scale: 120,
                desc: "increased damage to buildings but slower movement",
                spdMult: 0.3,
                bDmg: 3.3
            }, {
                id: 52,
                name: "Thief Gear",
                price: 15000,
                scale: 120,
                desc: "steal half of a players gold when you kill them",
                goldSteal: 0.5
            }, {
                id: 55,
                name: "Bloodthirster",
                price: 20000,
                scale: 120,
                desc: "Restore Health when dealing damage. And increased damage",
                healD: 0.25,
                dmgMultO: 1.2,
            }, {
                id: 56,
                name: "Assassin Gear",
                price: 20000,
                scale: 120,
                desc: "Go invisible when not moving. Can't eat. Increased speed",
                noEat: true,
                spdMult: 1.1,
                invisTimer: 1000
            }];

            // STORE ACCESSORIES:
            module.exports.accessories = [{
                id: 12,
                name: "Snowball",
                price: 1000,
                scale: 105,
                xOff: 18,
                desc: "no effect"
            }, {
                id: 9,
                name: "Tree Cape",
                price: 1000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 10,
                name: "Stone Cape",
                price: 1000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 3,
                name: "Cookie Cape",
                price: 1500,
                scale: 90,
                desc: "no effect"
            }, {
                id: 8,
                name: "Cow Cape",
                price: 2000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 11,
                name: "Monkey Tail",
                price: 2000,
                scale: 97,
                xOff: 25,
                desc: "Super speed but reduced damage",
                spdMult: 1.35,
                dmgMultO: 0.2
            }, {
                id: 17,
                name: "Apple Basket",
                price: 3000,
                scale: 80,
                xOff: 12,
                desc: "slowly regenerates health over time",
                healthRegen: 1
            }, {
                id: 6,
                name: "Winter Cape",
                price: 3000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 4,
                name: "Skull Cape",
                price: 4000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 5,
                name: "Dash Cape",
                price: 5000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 2,
                name: "Dragon Cape",
                price: 6000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 1,
                name: "Super Cape",
                price: 8000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 7,
                name: "Troll Cape",
                price: 8000,
                scale: 90,
                desc: "no effect"
            }, {
                id: 14,
                name: "Thorns",
                price: 10000,
                scale: 115,
                xOff: 20,
                desc: "no effect"
            }, {
                id: 15,
                name: "Blockades",
                price: 10000,
                scale: 95,
                xOff: 15,
                desc: "no effect"
            }, {
                id: 20,
                name: "Devils Tail",
                price: 10000,
                scale: 95,
                xOff: 20,
                desc: "no effect"
            }, {
                id: 16,
                name: "Sawblade",
                price: 12000,
                scale: 90,
                spin: true,
                xOff: 0,
                desc: "deal damage to players that damage you",
                dmg: 0.15
            }, {
                id: 13,
                name: "Angel Wings",
                price: 15000,
                scale: 138,
                xOff: 22,
                desc: "slowly regenerates health over time",
                healthRegen: 3
            }, {
                id: 19,
                name: "Shadow Wings",
                price: 15000,
                scale: 138,
                xOff: 22,
                desc: "increased movement speed",
                spdMult: 1.1
            }, {
                id: 18,
                name: "Blood Wings",
                price: 20000,
                scale: 178,
                xOff: 26,
                desc: "restores health when you deal damage",
                healD: 0.2
            }, {
                id: 21,
                name: "Corrupt X Wings",
                price: 20000,
                scale: 178,
                xOff: 26,
                desc: "deal damage to players that damage you",
                dmg: 0.25
            }];


            /***/ }),

        /***/ "./src/js/libs/animText.js":
        /*!*********************************!*\
  !*** ./src/js/libs/animText.js ***!
  \*********************************/
        /*! no static exports found */
        /***/ (function(module, exports) {


            // ANIMATED TEXT:
            module.exports.AnimText = function() {

                // INIT:
                this.init = function(x, y, scale, speed, life, text, color) {
                    this.x = x;
                    this.y = y;
                    this.color = color;
                    this.scale = scale;
                    this.initialScale = this.scale + 15;
                    this.minScale = 30;
                    this.scaleSpeed = 0.7;
                    this.speed = speed * 0.5;
                    this.life = 1500;
                    this.text = text;

                };

                // UPDATE:
                this.update = function(delta) {
                    if (this.life) {
                        this.life -= delta;
                        this.y -= this.speed * delta;

                        this.scale *= 0.98;

                        if (this.scale < this.minScale) {
                            this.scale = this.minScale;
                            this.scaleSpeed *= -15;
                        } else if (this.scale >= this.startScale) {
                            this.scale = this.startScale;
                            this.scaleSpeed = 0;
                        }

                        if (this.life <= 0) {
                            this.life = 0;
                        }
                    }
                };

                // RENDER:
                this.render = function(ctxt, xOff, yOff) {
                    ctxt.strokeStyle = '#3d3f42';
                    ctxt.fillStyle = this.color;
                    ctxt.font = `${this.scale}px Hammersmith One`;
                    ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
                    ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                };

            }

            // TEXT MANAGER:
            module.exports.TextManager = function() {
                this.texts = [];

                // UPDATE:
                this.update = function(delta, ctxt, xOff, yOff) {
                    ctxt.textBaseline = "middle";
                    ctxt.textAlign = "center";
                    for (var i = 0; i < this.texts.length; ++i) {
                        if (this.texts[i].life) {
                            this.texts[i].update(delta);
                            this.texts[i].render(ctxt, xOff, yOff);
                        }
                    }
                };

                // SHOW TEXT:
                this.showText = function(x, y, scale, speed, life, text, color) {
                    var tmpText;
                    for (var i = 0; i < this.texts.length; ++i) {
                        if (!this.texts[i].life) {
                            tmpText = this.texts[i];
                            break;
                        }
                    }
                    if (!tmpText) {
                        tmpText = new module.exports.AnimText();
                        this.texts.push(tmpText);
                    }
                    tmpText.init(x, y, scale, speed, life, text, color);
                };
            }


            /***/ }),

        /***/ "./src/js/libs/io-client.js":
        /*!**********************************!*\
  !*** ./src/js/libs/io-client.js ***!
  \**********************************/
        /*! no static exports found */
        /***/ (function(module, exports, __webpack_require__) {

            let msgpack = required.msgpack;
            let config = __webpack_require__(/*! ../config */ "./src/js/config.js");

            module.exports = {
                socket: null,
                connected: false,
                socketId: -1,
                connect: function(address, callback, events) {
                    // if (this.socket) return;

                    // CREATE SOCKET:
                    var _this = this;
                    try {
                        var socketError = false;
                        var socketAddress = address;
                        this.pps = [];
                        this.socket = new WebSocket(socketAddress);
                        this.socket.binaryType = "arraybuffer";
                        this.socket.onmessage = function(message) {

                            // PARSE MESSAGE:
                            var data = new Uint8Array(message.data);
                            var parsed = msgpack.decode(data);
                            var type = parsed[0];
                            var data = parsed[1];

                            // CALL EVENT:
                            if (type == "io-init") {
                                _this.socketId = data[0];
                            } else {
                                events[type].apply(undefined, data);
                            }
                        };
                        this.socket.onopen = function() {
                            console.log("ws open!")
                            _this.connected = true;
                            callback();
                        };
                        this.socket.onclose = function(event) {
                            console.log("ws closed!", event.code)
                            _this.connected = false;
                            if (event.code == 4001) {
                                callback("Invalid Connection");
                            } else if (!socketError) {
                                callback("disconnected");
                            }
                        };
                        this.socket.onerror = function(error) {
                            console.log("ws error!")
                            if (this.socket && this.socket.readyState != WebSocket.OPEN) {
                                socketError = true;
                                console.error("Socket error", arguments);
                                callback("Socket error");
                            }
                        };
                    } catch(e) {
                        console.warn("Socket connection error:", e);
                        callback(e);
                    }
                },
                send: function(type) {
                    if(this.socket.readyState !== 1) return

                    /* replace item with new item */
                    const old = [
                        ["pp", "0"],
                        ["sp", "M"],
                        ["2", "D"],
                        ["7", "K"],
                        ["c", "d"],
                        ["5", "G"],
                        ["13c", "c"],
                        ["33", "a"],
                        ["6", "H"],
                        ["8", "L"],
                        ["9", "N"],
                        ["10", "b"],
                        ["rmd", "e"],
                        ["ch", "6"],
                        //  ["pp"]
                    ]

                    let index = 0, length = old.length;

                    while(index < length) {
                        let item = old[index];

                        if(item[0] === type) {
                            type = item[1];

                            break;
                        }

                        index += 1;
                    }

                    for(let packet of this.pps) {
                        const outdated = (Date.now() - packet >= 1e3);

                        if(outdated) this.pps.shift();
                    }

                    if(this.pps.length < 85) {
                        this.pps.push(Date.now());

                        this.original_send(...arguments);
                    }

                    document.updateInfoBar();
                },
                original_send: function(type) {
                    // EXTRACT DATA ARRAY:
                    var data = Array.prototype.slice.call(arguments, 1);

                    // SEND MESSAGE:
                    var binary = msgpack.encode([type, data]);

                    this.socket.send(binary);
                },
                socketReady: function() {
                    return (this.socket && this.connected);
                },
                close: function() {
                    this.socket && this.socket.close();
                }
            };


            /***/ }),

        /***/ "./src/js/libs/modernizr.js":
        /*!**********************************!*\
  !*** ./src/js/libs/modernizr.js ***!
  \**********************************/
        /*! no static exports found */
        /***/ (function(module, exports) {

            !function(e,n,s){function o(e,n){return typeof e===n}function a(){var e,n,s,a,t,f,l;for(var c in r)if(r.hasOwnProperty(c)){if(e=[],n=r[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(a=o(n.fn,"function")?n.fn():n.fn,t=0;t<e.length;t++)f=e[t],l=f.split("."),1===l.length?Modernizr[l[0]]=a:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=a),i.push((a?"":"no-")+l.join("-"))}}function t(e){var n=l.className,s=Modernizr._config.classPrefix||"";if(c&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(o,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),c?l.className.baseVal=n:l.className=n)}var i=[],r=[],f={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){r.push({name:e,fn:n,options:s})},addAsyncTest:function(e){r.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=f,Modernizr=new Modernizr;var l=n.documentElement,c="svg"===l.nodeName.toLowerCase();Modernizr.addTest("passiveeventlisteners",function(){var n=!1;try{var s=Object.defineProperty({},"passive",{get:function(){n=!0}});e.addEventListener("test",null,s)}catch(o){}return n}),a(),t(i),delete f.addTest,delete f.addAsyncTest;for(var u=0;u<Modernizr._q.length;u++)Modernizr._q[u]();e.Modernizr=Modernizr}(window,document);


            /***/ }),

        /***/ "./src/js/libs/soundManager.js":
        /*!*************************************!*\
  !*** ./src/js/libs/soundManager.js ***!
  \*************************************/
        /*! no static exports found */
        /***/ (function(module, exports) {


            // PLAYER MANAGER:
            module.exports.obj = function(config, UTILS) {

                // INIT:
                var tmpSound;
                this.sounds = [];
                this.active = true;

                // PLAY SOUND:
                this.play = function(id, volume, loop) {
                    if (!volume || !this.active) return;
                    tmpSound = this.sounds[id];
                    if (!tmpSound) {
                        tmpSound = new Howl({
                            src: ".././sound/" + id + ".mp3"
                        });
                        this.sounds[id] = tmpSound;
                    }
                    if (!loop || !tmpSound.isPlaying) {
                        tmpSound.isPlaying = true;
                        tmpSound.play();
                        tmpSound.volume((volume||1)*config.volumeMult);
                        tmpSound.loop(loop);
                    }
                };

                // TOGGLE MUTE:
                this.toggleMute = function(id, mute) {
                    tmpSound = this.sounds[id];
                    if (tmpSound) tmpSound.mute(mute);
                };

                // STOP SOUND:
                this.stop = function(id) {
                    tmpSound = this.sounds[id];
                    if (tmpSound) {
                        tmpSound.stop();
                        tmpSound.isPlaying = false;
                    }
                };

            };


            /***/ }),

        /***/ "./src/js/libs/utils.js":
        /*!******************************!*\
  !*** ./src/js/libs/utils.js ***!
  \******************************/
        /*! no static exports found */
        /***/ (function(module, exports) {


            // MATH UTILS:
            var mathABS = Math.abs;
            var mathCOS = Math.cos;
            var mathSIN = Math.sin;
            var mathPOW = Math.pow;
            var mathSQRT = Math.sqrt;
            var mathABS = Math.abs;
            var mathATAN2 = Math.atan2;
            var mathPI = Math.PI;

            // GLOBAL UTILS:
            module.exports.randInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            module.exports.randFloat = function (min, max) {
                return Math.random() * (max - min + 1) + min;
            };
            module.exports.lerp = function (value1, value2, amount) {
                return value1 + (value2 - value1) * amount;
            };
            module.exports.decel = function (val, cel) {
                if (val > 0)
                    val = Math.max(0, val - cel);
                else if (val < 0)
                    val = Math.min(0, val + cel);
                return val;
            };
            module.exports.getDistance = function (x1, y1, x2, y2) {
                return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
            };
            module.exports.getDirection = function (x1, y1, x2, y2) {
                return mathATAN2(y1 - y2, x1 - x2);
            };
            module.exports.getAngleDist = function (a, b) {
                var p = mathABS(b - a) % (mathPI * 2);
                return (p > mathPI ? (mathPI * 2) - p : p);
            };
            module.exports.isNumber = function (n) {
                return (typeof n == "number" && !isNaN(n) && isFinite(n));
            };
            module.exports.isString = function (s) {
                return (s && typeof s == "string");
            };
            module.exports.kFormat = function (num) {
                return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
            };
            module.exports.capitalizeFirst = function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };
            module.exports.fixTo = function (n, v) {
                return parseFloat(n.toFixed(v));
            };
            module.exports.sortByPoints = function (a, b) {
                return parseFloat(b.points) - parseFloat(a.points);
            };
            module.exports.lineInRect = function (recX, recY, recX2, recY2, x1, y1, x2, y2) {
                var minX = x1;
                var maxX = x2;
                if (x1 > x2) {
                    minX = x2;
                    maxX = x1;
                }
                if (maxX > recX2)
                    maxX = recX2;
                if (minX < recX)
                    minX = recX;
                if (minX > maxX)
                    return false;
                var minY = y1;
                var maxY = y2;
                var dx = x2 - x1;
                if (Math.abs(dx) > 0.0000001) {
                    var a = (y2 - y1) / dx;
                    var b = y1 - a * x1;
                    minY = a * minX + b;
                    maxY = a * maxX + b;
                }
                if (minY > maxY) {
                    var tmp = maxY;
                    maxY = minY;
                    minY = tmp;
                }
                if (maxY > recY2)
                    maxY = recY2;
                if (minY < recY)
                    minY = recY;
                if (minY > maxY)
                    return false;
                return true;
            };
            module.exports.containsPoint = function (element, x, y) {
                var bounds = element.getBoundingClientRect();
                var left = bounds.left + window.scrollX;
                var top = bounds.top + window.scrollY;
                var width = bounds.width;
                var height = bounds.height;

                var insideHorizontal = x > left && x < left + width;
                var insideVertical = y > top && y < top + height;
                return insideHorizontal && insideVertical;
            };
            module.exports.mousifyTouchEvent = function(event) {
                var touch = event.changedTouches[0];
                event.screenX = touch.screenX;
                event.screenY = touch.screenY;
                event.clientX = touch.clientX;
                event.clientY = touch.clientY;
                event.pageX = touch.pageX;
                event.pageY = touch.pageY;
            };
            module.exports.hookTouchEvents = function (element, skipPrevent) {
                var preventDefault = !skipPrevent;
                var isHovering = false;
                // var passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
                var passive = false;
                element.addEventListener("touchstart", module.exports.checkTrusted(touchStart), passive);
                element.addEventListener("touchmove", module.exports.checkTrusted(touchMove), passive);
                element.addEventListener("touchend", module.exports.checkTrusted(touchEnd), passive);
                element.addEventListener("touchcancel", module.exports.checkTrusted(touchEnd), passive);
                element.addEventListener("touchleave", module.exports.checkTrusted(touchEnd), passive);
                function touchStart(e) {
                    module.exports.mousifyTouchEvent(e);
                    window.setUsingTouch(true);
                    if (preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (element.onmouseover)
                        element.onmouseover(e);
                    isHovering = true;
                }
                function touchMove(e) {
                    module.exports.mousifyTouchEvent(e);
                    window.setUsingTouch(true);
                    if (preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (module.exports.containsPoint(element, e.pageX, e.pageY)) {
                        if (!isHovering) {
                            if (element.onmouseover)
                                element.onmouseover(e);
                            isHovering = true;
                        }
                    } else {
                        if (isHovering) {
                            if (element.onmouseout)
                                element.onmouseout(e);
                            isHovering = false;
                        }
                    }
                }
                function touchEnd(e) {
                    module.exports.mousifyTouchEvent(e);
                    window.setUsingTouch(true);
                    if (preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (isHovering) {
                        if (element.onclick)
                            element.onclick(e);
                        if (element.onmouseout)
                            element.onmouseout(e);
                        isHovering = false;
                    }
                }
            };
            module.exports.removeAllChildren = function (element) {
                while (element.hasChildNodes()) {
                    element.removeChild(element.lastChild);
                }
            };
            module.exports.generateElement = function (config) {
                var element = document.createElement(config.tag || "div");
                function bind(configValue, elementValue) {
                    if (config[configValue])
                        element[elementValue] = config[configValue];
                }
                bind("text", "textContent");
                bind("html", "innerHTML");
                bind("class", "className");
                for (var key in config) {
                    switch (key) {
                        case "tag":
                        case "text":
                        case "html":
                        case "class":
                        case "style":
                        case "hookTouch":
                        case "parent":
                        case "children":
                            continue;
                        default:
                            break;
                    }
                    element[key] = config[key];
                }
                if (element.onclick)
                    element.onclick = module.exports.checkTrusted(element.onclick);
                if (element.onmouseover)
                    element.onmouseover = module.exports.checkTrusted(element.onmouseover);
                if (element.onmouseout)
                    element.onmouseout = module.exports.checkTrusted(element.onmouseout);
                if (config.style) {
                    element.style.cssText = config.style;
                }
                if (config.hookTouch) {
                    module.exports.hookTouchEvents(element);
                }
                if (config.parent) {
                    config.parent.appendChild(element);
                }
                if (config.children) {
                    for (var i = 0; i < config.children.length; i++) {
                        element.appendChild(config.children[i]);
                    }
                }
                return element;
            }
            module.exports.eventIsTrusted = function(ev) {
                if (ev && typeof ev.isTrusted == "boolean") {
                    return ev.isTrusted;
                } else {
                    return true;
                }
            }
            module.exports.checkTrusted = function(callback) {
                return function(ev) {
                    if (ev && ev instanceof Event && module.exports.eventIsTrusted(ev)) {
                        callback(ev);
                    } else {
                        //console.error("Event is not trusted.", ev);
                    }
                }
            }
            module.exports.randomString = function(length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            };
            module.exports.countInArray = function(array, val) {
                var count = 0;
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === val) count++;
                } return count;
            };


            /***/ })

        /******/ });
    //# sourceMappingURL=bundle.js.map
})();
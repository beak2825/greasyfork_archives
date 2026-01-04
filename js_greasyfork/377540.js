// ==UserScript==
// @name           Iwara Custom Sort
// @version        1.1.0
// @description    Automatically sort teaser images on /videos, /images, /subscriptions, /users, /playlist, and sidebars using customizable sort function. Can load and sort multiple pages at once.
// @match          http://ecchi.iwara.tv/*
// @match          https://ecchi.iwara.tv/*
// @match          http://www.iwara.tv/*
// @match          https://www.iwara.tv/*
// @name:ja        Iwara Custom ソート
// @run-at         document-end
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM.deleteValue
// @grant          GM.listValues
// @license        AGPL-3.0-or-later
// @description:ja /videos、/images、/subscriptions、/users、/playlistとサイドバーのサムネイルを自動的にソートします。ソート方法はカスタマイズすることができます、一度に複数のページを読み込んでソートすることができます。
// @require        https://cdn.jsdelivr.net/npm/sweetalert2@11.0.18/dist/sweetalert2.all.min.js#sha384-EoPspU1QiQ0II6WaHKy5pERCBPBD1VqZByJ29O7fDUJxGXwWLyEREDpvym8c4v2S
// @require        https://unpkg.com/loglevel@1.7.0/dist/loglevel.min.js#sha384-7gGuWfek8Ql6j/uNDFrS0BCe4x2ZihD4B68w9Eu580OVHJBV+bl3rZmEWC7q5/Gj
// @require        https://unpkg.com/rxjs@7.3.0/dist/bundles/rxjs.umd.min.js#sha384-B2HMABdZA26zJ9QwbG/c5zrcdr6+Zs8J4MgKs7udycjXgvRDA5nZKLzJ1vXWzJyH
// @require        https://unpkg.com/mithril@2.0.4/mithril.min.js#sha384-vo9crXih40MlEv6JWHqS7SsPiFp+76csaWQFOF2UU0/xI58Jm/ZvK/1UtpaicJT9
// @namespace      https://greasyfork.org/users/245195
// @downloadURL https://update.greasyfork.org/scripts/377540/Iwara%20Custom%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/377540/Iwara%20Custom%20Sort.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

;(() => {
  var __webpack_modules__ = {
      494: function (module, exports, __webpack_require__) {
        var __WEBPACK_AMD_DEFINE_RESULT__
        !(function (globals) {
          "use strict"
          var messages,
            predicates,
            functions,
            assert,
            not,
            maybe,
            collections,
            hasOwnProperty,
            toString,
            keys,
            slice,
            isArray,
            neginf,
            posinf,
            haveSymbols,
            haveMaps,
            haveSets
          function assigned(data) {
            return null != data
          }
          function number(data) {
            return "number" == typeof data && data > neginf && data < posinf
          }
          function integer(data) {
            return "number" == typeof data && data % 1 == 0
          }
          function greater(lhs, rhs) {
            return number(lhs) && lhs > rhs
          }
          function less(lhs, rhs) {
            return number(lhs) && lhs < rhs
          }
          function greaterOrEqual(lhs, rhs) {
            return number(lhs) && lhs >= rhs
          }
          function lessOrEqual(lhs, rhs) {
            return number(lhs) && lhs <= rhs
          }
          function string(data) {
            return "string" == typeof data
          }
          function nonEmptyString(data) {
            return string(data) && "" !== data
          }
          function object(data) {
            return "[object Object]" === toString.call(data)
          }
          function some(data, predicate) {
            for (var key in data)
              if (hasOwnProperty.call(data, key) && predicate(key, data[key]))
                return !0
            return !1
          }
          function instanceStrict(data, prototype) {
            try {
              return data instanceof prototype
            } catch (error) {
              return !1
            }
          }
          function like(data, archetype) {
            var name
            for (name in archetype)
              if (hasOwnProperty.call(archetype, name)) {
                if (
                  !1 === hasOwnProperty.call(data, name) ||
                  typeof data[name] != typeof archetype[name]
                )
                  return !1
                if (
                  object(data[name]) &&
                  !1 === like(data[name], archetype[name])
                )
                  return !1
              }
            return !0
          }
          function arrayLike(data) {
            return assigned(data) && data.length >= 0
          }
          function iterable(data) {
            return haveSymbols
              ? assigned(data) && isFunction(data[Symbol.iterator])
              : arrayLike(data)
          }
          function contains(data, value) {
            var iterator, iteration
            if (!assigned(data)) return !1
            if (haveSets && instanceStrict(data, Set)) return data.has(value)
            if (string(data)) return -1 !== data.indexOf(value)
            if (
              haveSymbols &&
              data[Symbol.iterator] &&
              isFunction(data.values)
            ) {
              iterator = data.values()
              do {
                if ((iteration = iterator.next()).value === value) return !0
              } while (!iteration.done)
              return !1
            }
            return some(data, function (key, dataValue) {
              return dataValue === value
            })
          }
          function containsKey(data, key) {
            return (
              !!assigned(data) &&
              (haveMaps && instanceStrict(data, Map)
                ? data.has(key)
                : !(iterable(data) && !number(+key)) && !!data[key])
            )
          }
          function isFunction(data) {
            return "function" == typeof data
          }
          function forEach(object, action) {
            for (var key in object)
              hasOwnProperty.call(object, key) && action(key, object[key])
          }
          function testArray(data, result) {
            var i
            for (i = 0; i < data.length; i += 1)
              if (data[i] === result) return result
            return !result
          }
          function testObject(data, result) {
            var key, value
            for (key in data)
              if (hasOwnProperty.call(data, key)) {
                if (
                  object((value = data[key])) &&
                  testObject(value, result) === result
                )
                  return result
                if (value === result) return result
              }
            return !result
          }
          function mixin(target, source) {
            return (
              forEach(source, function (key, value) {
                target[key] = value
              }),
              target
            )
          }
          function assertModifier(predicate, defaultMessage) {
            return function () {
              var args = arguments,
                argCount = predicate.l || predicate.length,
                message = args[argCount],
                ErrorType = args[argCount + 1]
              return (
                assertImpl(
                  predicate.apply(null, args),
                  nonEmptyString(message)
                    ? message
                    : defaultMessage
                        .replace("{a}", messageFormatter(args[0]))
                        .replace("{e}", messageFormatter(args[1]))
                        .replace("{e2}", messageFormatter(args[2]))
                        .replace("{t}", function () {
                          var arg = args[1]
                          return arg && arg.name ? arg.name : arg
                        }),
                  isFunction(ErrorType) ? ErrorType : TypeError
                ),
                args[0]
              )
            }
          }
          function messageFormatter(arg) {
            return function () {
              return string(arg)
                ? '"' + arg.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'
                : arg &&
                  !0 !== arg &&
                  arg.constructor &&
                  !instanceStrict(arg, RegExp) &&
                  "number" != typeof arg
                ? arg.constructor.name
                : arg
            }
          }
          function assertImpl(value, message, ErrorType) {
            if (value) return value
            throw new (ErrorType || Error)(message || "assert failed")
          }
          function notModifier(predicate) {
            var modifiedPredicate = function () {
              return notImpl(predicate.apply(null, arguments))
            }
            return (modifiedPredicate.l = predicate.length), modifiedPredicate
          }
          function notImpl(value) {
            return !value
          }
          function ofModifier(target, type, predicate) {
            var modifiedPredicate = function () {
              var collection, args
              if (
                ((collection = arguments[0]),
                "maybe" === target && not.assigned(collection))
              )
                return !0
              if (!type(collection)) return !1
              ;(collection = coerceCollection(type, collection)),
                (args = slice.call(arguments, 1))
              try {
                collection.forEach(function (item) {
                  if (
                    ("maybe" !== target || assigned(item)) &&
                    !predicate.apply(null, [item].concat(args))
                  )
                    throw 0
                })
              } catch (ignore) {
                return !1
              }
              return !0
            }
            return (modifiedPredicate.l = predicate.length), modifiedPredicate
          }
          function coerceCollection(type, collection) {
            switch (type) {
              case arrayLike:
                return slice.call(collection)
              case object:
                return keys(collection).map(function (key) {
                  return collection[key]
                })
              default:
                return collection
            }
          }
          function createModifiedPredicates(modifier, object) {
            return createModifiedFunctions([modifier, predicates, object, ""])
          }
          function createModifiedFunctions(args) {
            var modifier, messageModifier, object
            return (
              (modifier = args.shift()),
              (messageModifier = args.pop()),
              (object = args.pop()),
              forEach(args.pop(), function (key, fn) {
                var message = messages[key]
                message &&
                  messageModifier &&
                  (message = message.replace("to", messageModifier + "to")),
                  Object.defineProperty(object, key, {
                    configurable: !1,
                    enumerable: !0,
                    writable: !1,
                    value: modifier.apply(null, args.concat(fn, message)),
                  })
              }),
              object
            )
          }
          function createModifiedModifier(modifier, modified, messageModifier) {
            return createModifiedFunctions([
              modifier,
              modified,
              {},
              messageModifier,
            ])
          }
          function createOfModifiers(base, modifier) {
            collections.forEach(function (key) {
              base[key].of = createModifiedModifier(
                modifier,
                predicates[key].of
              )
            })
          }
          ;(messages = {}),
            (predicates = {}),
            [
              {
                n: "equal",
                f: function (lhs, rhs) {
                  return lhs === rhs
                },
                s: "equal {e}",
              },
              {
                n: "undefined",
                f: function (data) {
                  return void 0 === data
                },
                s: "be undefined",
              },
              {
                n: "null",
                f: function (data) {
                  return null === data
                },
                s: "be null",
              },
              { n: "assigned", f: assigned, s: "be assigned" },
              {
                n: "primitive",
                f: function (data) {
                  var type
                  switch (data) {
                    case null:
                    case void 0:
                    case !1:
                    case !0:
                      return !0
                  }
                  return (
                    "string" === (type = typeof data) ||
                    "number" === type ||
                    (haveSymbols && "symbol" === type)
                  )
                },
                s: "be primitive type",
              },
              { n: "contains", f: contains, s: "contain {e}" },
              {
                n: "in",
                f: function (value, data) {
                  return contains(data, value)
                },
                s: "be in {e}",
              },
              { n: "containsKey", f: containsKey, s: "contain key {e}" },
              {
                n: "keyIn",
                f: function (key, data) {
                  return containsKey(data, key)
                },
                s: "be key in {e}",
              },
              {
                n: "zero",
                f: function (data) {
                  return 0 === data
                },
                s: "be 0",
              },
              {
                n: "one",
                f: function (data) {
                  return 1 === data
                },
                s: "be 1",
              },
              {
                n: "infinity",
                f: function (data) {
                  return data === neginf || data === posinf
                },
                s: "be infinity",
              },
              { n: "number", f: number, s: "be Number" },
              { n: "integer", f: integer, s: "be integer" },
              {
                n: "float",
                f: function (data) {
                  return number(data) && data % 1 != 0
                },
                s: "be non-integer number",
              },
              {
                n: "even",
                f: function (data) {
                  return "number" == typeof data && data % 2 == 0
                },
                s: "be even number",
              },
              {
                n: "odd",
                f: function (data) {
                  return integer(data) && data % 2 != 0
                },
                s: "be odd number",
              },
              { n: "greater", f: greater, s: "be greater than {e}" },
              { n: "less", f: less, s: "be less than {e}" },
              {
                n: "between",
                f: function (data, x, y) {
                  if (x < y) return greater(data, x) && data < y
                  return less(data, x) && data > y
                },
                s: "be between {e} and {e2}",
              },
              {
                n: "greaterOrEqual",
                f: greaterOrEqual,
                s: "be greater than or equal to {e}",
              },
              {
                n: "lessOrEqual",
                f: lessOrEqual,
                s: "be less than or equal to {e}",
              },
              {
                n: "inRange",
                f: function (data, x, y) {
                  if (x < y) return greaterOrEqual(data, x) && data <= y
                  return lessOrEqual(data, x) && data >= y
                },
                s: "be in the range {e} to {e2}",
              },
              {
                n: "positive",
                f: function (data) {
                  return greater(data, 0)
                },
                s: "be positive number",
              },
              {
                n: "negative",
                f: function (data) {
                  return less(data, 0)
                },
                s: "be negative number",
              },
              { n: "string", f: string, s: "be String" },
              {
                n: "emptyString",
                f: function (data) {
                  return "" === data
                },
                s: "be empty string",
              },
              {
                n: "nonEmptyString",
                f: nonEmptyString,
                s: "be non-empty string",
              },
              {
                n: "match",
                f: function (data, regex) {
                  return string(data) && !!data.match(regex)
                },
                s: "match {e}",
              },
              {
                n: "boolean",
                f: function (data) {
                  return !1 === data || !0 === data
                },
                s: "be Boolean",
              },
              { n: "object", f: object, s: "be Object" },
              {
                n: "emptyObject",
                f: function (data) {
                  return (
                    object(data) &&
                    !some(data, function () {
                      return !0
                    })
                  )
                },
                s: "be empty object",
              },
              {
                n: "nonEmptyObject",
                f: function (data) {
                  return (
                    object(data) &&
                    some(data, function () {
                      return !0
                    })
                  )
                },
                s: "be non-empty object",
              },
              {
                n: "instanceStrict",
                f: instanceStrict,
                s: "be instanceof {t}",
              },
              {
                n: "thenable",
                f: function (data) {
                  return assigned(data) && isFunction(data.then)
                },
                s: "be promise-like",
              },
              {
                n: "instance",
                f: function (data, prototype) {
                  try {
                    return (
                      instanceStrict(data, prototype) ||
                      data.constructor.name === prototype.name ||
                      toString.call(data) === "[object " + prototype.name + "]"
                    )
                  } catch (error) {
                    return !1
                  }
                },
                s: "be {t}",
              },
              { n: "like", f: like, s: "be like {e}" },
              {
                n: "array",
                f: function (data) {
                  return isArray(data)
                },
                s: "be Array",
              },
              {
                n: "emptyArray",
                f: function (data) {
                  return isArray(data) && 0 === data.length
                },
                s: "be empty array",
              },
              {
                n: "nonEmptyArray",
                f: function (data) {
                  return isArray(data) && data.length > 0
                },
                s: "be non-empty array",
              },
              { n: "arrayLike", f: arrayLike, s: "be array-like" },
              { n: "iterable", f: iterable, s: "be iterable" },
              {
                n: "date",
                f: function (data) {
                  return instanceStrict(data, Date) && integer(data.getTime())
                },
                s: "be valid Date",
              },
              { n: "function", f: isFunction, s: "be Function" },
              {
                n: "hasLength",
                f: function (data, length) {
                  return assigned(data) && data.length === length
                },
                s: "have length {e}",
              },
              {
                n: "throws",
                f: function (data) {
                  if (!isFunction(data)) return !1
                  try {
                    data()
                  } catch (error) {
                    return !0
                  }
                  return !1
                },
                s: "throw",
              },
            ].map(function (data) {
              var n = data.n
              ;(messages[n] = "assert failed: expected {a} to " + data.s),
                (predicates[n] = data.f)
            }),
            (functions = {
              map: function map(data, predicates) {
                var result
                result = isArray(data) ? [] : {}
                if (isFunction(predicates))
                  forEach(data, function (key, value) {
                    result[key] = predicates(value)
                  })
                else {
                  isArray(predicates) || assert.object(predicates)
                  var dataKeys = keys(data || {})
                  forEach(predicates, function (key, predicate) {
                    dataKeys.some(function (dataKey, index) {
                      return dataKey === key && (dataKeys.splice(index, 1), !0)
                    }),
                      isFunction(predicate)
                        ? not.assigned(data)
                          ? (result[key] = !!predicate.m)
                          : (result[key] = predicate(data[key]))
                        : (result[key] = map(data[key], predicate))
                  })
                }
                return result
              },
              all: function (data) {
                if (isArray(data)) return testArray(data, !1)
                return assert.object(data), testObject(data, !1)
              },
              any: function (data) {
                if (isArray(data)) return testArray(data, !0)
                return assert.object(data), testObject(data, !0)
              },
            }),
            (collections = ["array", "arrayLike", "iterable", "object"]),
            (hasOwnProperty = Object.prototype.hasOwnProperty),
            (toString = Object.prototype.toString),
            (keys = Object.keys),
            (slice = Array.prototype.slice),
            (isArray = Array.isArray),
            (neginf = Number.NEGATIVE_INFINITY),
            (posinf = Number.POSITIVE_INFINITY),
            (haveSymbols = "function" == typeof Symbol),
            (haveMaps = "function" == typeof Map),
            (haveSets = "function" == typeof Set),
            (functions = mixin(functions, predicates)),
            (assert = createModifiedPredicates(assertModifier, assertImpl)),
            (not = createModifiedPredicates(notModifier, notImpl)),
            (maybe = createModifiedPredicates(
              function (predicate) {
                var modifiedPredicate = function () {
                  return (
                    !!not.assigned(arguments[0]) ||
                    predicate.apply(null, arguments)
                  )
                }
                return (
                  (modifiedPredicate.l = predicate.length),
                  (modifiedPredicate.m = !0),
                  modifiedPredicate
                )
              },
              function (value) {
                if (!1 === assigned(value)) return !0
                return value
              }
            )),
            (assert.not = createModifiedModifier(assertModifier, not, "not ")),
            (assert.maybe = createModifiedModifier(
              assertModifier,
              maybe,
              "maybe "
            )),
            collections.forEach(function (key) {
              predicates[key].of = createModifiedFunctions([
                ofModifier.bind(null, null),
                predicates[key],
                predicates,
                {},
                "",
              ])
            }),
            createOfModifiers(assert, assertModifier),
            createOfModifiers(not, notModifier),
            collections.forEach(function (key) {
              ;(maybe[key].of = createModifiedFunctions([
                ofModifier.bind(null, "maybe"),
                predicates[key],
                predicates,
                {},
                "",
              ])),
                (assert.maybe[key].of = createModifiedModifier(
                  assertModifier,
                  maybe[key].of
                )),
                (assert.not[key].of = createModifiedModifier(
                  assertModifier,
                  not[key].of
                ))
            }),
            (function (functions) {
              void 0 ===
                (__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                  return functions
                }.call(exports, __webpack_require__, exports, module)) ||
                (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)
            })(mixin(functions, { assert, not, maybe }))
        })()
      },
      228: module => {
        "use strict"
        const createAbortError = () => {
            const error = new Error("Delay aborted")
            return (error.name = "AbortError"), error
          },
          createDelay =
            ({ clearTimeout: defaultClear, setTimeout: set, willResolve }) =>
            (ms, { value, signal } = {}) => {
              if (signal && signal.aborted)
                return Promise.reject(createAbortError())
              let timeoutId, settle, rejectFn
              const clear = defaultClear || clearTimeout,
                signalListener = () => {
                  clear(timeoutId), rejectFn(createAbortError())
                },
                delayPromise = new Promise((resolve, reject) => {
                  ;(settle = () => {
                    signal &&
                      signal.removeEventListener("abort", signalListener),
                      willResolve ? resolve(value) : reject(value)
                  }),
                    (rejectFn = reject),
                    (timeoutId = (set || setTimeout)(settle, ms))
                })
              return (
                signal &&
                  signal.addEventListener("abort", signalListener, {
                    once: !0,
                  }),
                (delayPromise.clear = () => {
                  clear(timeoutId), (timeoutId = null), settle()
                }),
                delayPromise
              )
            },
          delay = createDelay({ willResolve: !0 })
        ;(delay.reject = createDelay({ willResolve: !1 })),
          (delay.range = (minimum, maximum, options) =>
            delay(
              ((minimum, maximum) =>
                Math.floor(Math.random() * (maximum - minimum + 1) + minimum))(
                minimum,
                maximum
              ),
              options
            )),
          (delay.createWithTimers = ({ clearTimeout, setTimeout }) => {
            const delay = createDelay({
              clearTimeout,
              setTimeout,
              willResolve: !0,
            })
            return (
              (delay.reject = createDelay({
                clearTimeout,
                setTimeout,
                willResolve: !1,
              })),
              delay
            )
          }),
          (module.exports = delay),
          (module.exports.default = delay)
      },
      633: () => {},
    },
    __webpack_module_cache__ = {}
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId]
    if (void 0 !== cachedModule) return cachedModule.exports
    var module = (__webpack_module_cache__[moduleId] = { exports: {} })
    return (
      __webpack_modules__[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ),
      module.exports
    )
  }
  ;(__webpack_require__.n = module => {
    var getter =
      module && module.__esModule ? () => module.default : () => module
    return __webpack_require__.d(getter, { a: getter }), getter
  }),
    (__webpack_require__.d = (exports, definition) => {
      for (var key in definition)
        __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key) &&
          Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key],
          })
    }),
    (__webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop)),
    (() => {
      "use strict"
      const external_log_namespaceObject = log
      const lib = __webpack_require__(494).assert,
        tapNonNull = x => (lib(null != x), x)
      function sleep(time) {
        return (
          time || (time = 0),
          new Promise(function (res) {
            return setTimeout(res, time)
          })
        )
      }
      function randomToken() {
        return Math.random().toString(36).substring(2)
      }
      var lastMs = 0,
        additional = 0
      function microSeconds() {
        var ms = new Date().getTime()
        return ms === lastMs
          ? 1e3 * ms + ++additional
          : ((lastMs = ms), (additional = 0), 1e3 * ms)
      }
      var isNode =
        "[object process]" ===
        Object.prototype.toString.call(
          "undefined" != typeof process ? process : 0
        )
      const methods_native = {
        create: function (channelName) {
          var state = {
            messagesCallback: null,
            bc: new BroadcastChannel(channelName),
            subFns: [],
          }
          return (
            (state.bc.onmessage = function (msg) {
              state.messagesCallback && state.messagesCallback(msg.data)
            }),
            state
          )
        },
        close: function (channelState) {
          channelState.bc.close(), (channelState.subFns = [])
        },
        onMessage: function (channelState, fn) {
          channelState.messagesCallback = fn
        },
        postMessage: function (channelState, messageJson) {
          try {
            return (
              channelState.bc.postMessage(messageJson, !1), Promise.resolve()
            )
          } catch (err) {
            return Promise.reject(err)
          }
        },
        canBeUsed: function () {
          if (isNode && "undefined" == typeof window) return !1
          if ("function" == typeof BroadcastChannel) {
            if (BroadcastChannel._pubkey)
              throw new Error(
                "BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill"
              )
            return !0
          }
          return !1
        },
        type: "native",
        averageResponseTime: function () {
          return 150
        },
        microSeconds,
      }
      var ObliviousSet = (function () {
        function ObliviousSet(ttl) {
          ;(this.ttl = ttl), (this.set = new Set()), (this.timeMap = new Map())
        }
        return (
          (ObliviousSet.prototype.has = function (value) {
            return this.set.has(value)
          }),
          (ObliviousSet.prototype.add = function (value) {
            var _this = this
            this.timeMap.set(value, now()),
              this.set.add(value),
              setTimeout(function () {
                !(function (obliviousSet) {
                  var olderThen = now() - obliviousSet.ttl,
                    iterator = obliviousSet.set[Symbol.iterator]()
                  for (;;) {
                    var value = iterator.next().value
                    if (!value) return
                    if (!(obliviousSet.timeMap.get(value) < olderThen)) return
                    obliviousSet.timeMap.delete(value),
                      obliviousSet.set.delete(value)
                  }
                })(_this)
              }, 0)
          }),
          (ObliviousSet.prototype.clear = function () {
            this.set.clear(), this.timeMap.clear()
          }),
          ObliviousSet
        )
      })()
      function now() {
        return new Date().getTime()
      }
      function options_fillOptionsWithDefaults() {
        var originalOptions =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          options = JSON.parse(JSON.stringify(originalOptions))
        return (
          void 0 === options.webWorkerSupport &&
            (options.webWorkerSupport = !0),
          options.idb || (options.idb = {}),
          options.idb.ttl || (options.idb.ttl = 45e3),
          options.idb.fallbackInterval || (options.idb.fallbackInterval = 150),
          originalOptions.idb &&
            "function" == typeof originalOptions.idb.onclose &&
            (options.idb.onclose = originalOptions.idb.onclose),
          options.localstorage || (options.localstorage = {}),
          options.localstorage.removeTimeout ||
            (options.localstorage.removeTimeout = 6e4),
          originalOptions.methods &&
            (options.methods = originalOptions.methods),
          options.node || (options.node = {}),
          options.node.ttl || (options.node.ttl = 12e4),
          void 0 === options.node.useFastPath &&
            (options.node.useFastPath = !0),
          options
        )
      }
      function getIdb() {
        if ("undefined" != typeof indexedDB) return indexedDB
        if ("undefined" != typeof window) {
          if (void 0 !== window.mozIndexedDB) return window.mozIndexedDB
          if (void 0 !== window.webkitIndexedDB) return window.webkitIndexedDB
          if (void 0 !== window.msIndexedDB) return window.msIndexedDB
        }
        return !1
      }
      function getMessagesHigherThan(db, lastCursorId) {
        var objectStore = db.transaction("messages").objectStore("messages"),
          ret = []
        return new Promise(function (res) {
          ;(function () {
            try {
              var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, 1 / 0)
              return objectStore.openCursor(keyRangeValue)
            } catch (e) {
              return objectStore.openCursor()
            }
          })().onsuccess = function (ev) {
            var cursor = ev.target.result
            cursor
              ? cursor.value.id < lastCursorId + 1
                ? cursor.continue(lastCursorId + 1)
                : (ret.push(cursor.value), cursor.continue())
              : res(ret)
          }
        })
      }
      function cleanOldMessages(db, ttl) {
        return (function (db, ttl) {
          var olderThen = new Date().getTime() - ttl,
            objectStore = db.transaction("messages").objectStore("messages"),
            ret = []
          return new Promise(function (res) {
            objectStore.openCursor().onsuccess = function (ev) {
              var cursor = ev.target.result
              if (cursor) {
                var msgObk = cursor.value
                if (!(msgObk.time < olderThen)) return void res(ret)
                ret.push(msgObk), cursor.continue()
              } else res(ret)
            }
          })
        })(db, ttl).then(function (tooOld) {
          return Promise.all(
            tooOld.map(function (msgObj) {
              return (function (db, id) {
                var request = db
                  .transaction(["messages"], "readwrite")
                  .objectStore("messages")
                  .delete(id)
                return new Promise(function (res) {
                  request.onsuccess = function () {
                    return res()
                  }
                })
              })(db, msgObj.id)
            })
          )
        })
      }
      function _readLoop(state) {
        state.closed ||
          readNewMessages(state)
            .then(function () {
              return sleep(state.options.idb.fallbackInterval)
            })
            .then(function () {
              return _readLoop(state)
            })
      }
      function readNewMessages(state) {
        return state.closed
          ? Promise.resolve()
          : state.messagesCallback
          ? getMessagesHigherThan(state.db, state.lastCursorId).then(function (
              newerMessages
            ) {
              return (
                newerMessages
                  .filter(function (msgObj) {
                    return !!msgObj
                  })
                  .map(function (msgObj) {
                    return (
                      msgObj.id > state.lastCursorId &&
                        (state.lastCursorId = msgObj.id),
                      msgObj
                    )
                  })
                  .filter(function (msgObj) {
                    return (function (msgObj, state) {
                      return !(
                        msgObj.uuid === state.uuid ||
                        state.eMIs.has(msgObj.id) ||
                        msgObj.data.time < state.messagesCallbackTime
                      )
                    })(msgObj, state)
                  })
                  .sort(function (msgObjA, msgObjB) {
                    return msgObjA.time - msgObjB.time
                  })
                  .forEach(function (msgObj) {
                    state.messagesCallback &&
                      (state.eMIs.add(msgObj.id),
                      state.messagesCallback(msgObj.data))
                  }),
                Promise.resolve()
              )
            })
          : Promise.resolve()
      }
      const indexed_db = {
        create: function (channelName, options) {
          return (
            (options = options_fillOptionsWithDefaults(options)),
            (function (channelName) {
              var dbName = "pubkey.broadcast-channel-0-" + channelName,
                openRequest = getIdb().open(dbName, 1)
              return (
                (openRequest.onupgradeneeded = function (ev) {
                  ev.target.result.createObjectStore("messages", {
                    keyPath: "id",
                    autoIncrement: !0,
                  })
                }),
                new Promise(function (res, rej) {
                  ;(openRequest.onerror = function (ev) {
                    return rej(ev)
                  }),
                    (openRequest.onsuccess = function () {
                      res(openRequest.result)
                    })
                })
              )
            })(channelName).then(function (db) {
              var state = {
                closed: !1,
                lastCursorId: 0,
                channelName,
                options,
                uuid: randomToken(),
                eMIs: new ObliviousSet(2 * options.idb.ttl),
                writeBlockPromise: Promise.resolve(),
                messagesCallback: null,
                readQueuePromises: [],
                db,
              }
              return (
                (db.onclose = function () {
                  ;(state.closed = !0),
                    options.idb.onclose && options.idb.onclose()
                }),
                _readLoop(state),
                state
              )
            })
          )
        },
        close: function (channelState) {
          ;(channelState.closed = !0), channelState.db.close()
        },
        onMessage: function (channelState, fn, time) {
          ;(channelState.messagesCallbackTime = time),
            (channelState.messagesCallback = fn),
            readNewMessages(channelState)
        },
        postMessage: function (channelState, messageJson) {
          return (
            (channelState.writeBlockPromise = channelState.writeBlockPromise
              .then(function () {
                return (function (db, readerUuid, messageJson) {
                  var writeObject = {
                      uuid: readerUuid,
                      time: new Date().getTime(),
                      data: messageJson,
                    },
                    transaction = db.transaction(["messages"], "readwrite")
                  return new Promise(function (res, rej) {
                    ;(transaction.oncomplete = function () {
                      return res()
                    }),
                      (transaction.onerror = function (ev) {
                        return rej(ev)
                      }),
                      transaction.objectStore("messages").add(writeObject)
                  })
                })(channelState.db, channelState.uuid, messageJson)
              })
              .then(function () {
                0 ===
                  (function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1) + min)
                  })(0, 10) &&
                  cleanOldMessages(
                    channelState.db,
                    channelState.options.idb.ttl
                  )
              })),
            channelState.writeBlockPromise
          )
        },
        canBeUsed: function () {
          return !isNode && !!getIdb()
        },
        type: "idb",
        averageResponseTime: function (options) {
          return 2 * options.idb.fallbackInterval
        },
        microSeconds,
      }
      function getLocalStorage() {
        var localStorage
        if ("undefined" == typeof window) return null
        try {
          ;(localStorage = window.localStorage),
            (localStorage =
              window["ie8-eventlistener/storage"] || window.localStorage)
        } catch (e) {}
        return localStorage
      }
      function storageKey(channelName) {
        return "pubkey.broadcastChannel-" + channelName
      }
      function localstorage_canBeUsed() {
        if (isNode) return !1
        var ls = getLocalStorage()
        if (!ls) return !1
        try {
          var key = "__broadcastchannel_check"
          ls.setItem(key, "works"), ls.removeItem(key)
        } catch (e) {
          return !1
        }
        return !0
      }
      const localstorage = {
        create: function (channelName, options) {
          if (
            ((options = options_fillOptionsWithDefaults(options)),
            !localstorage_canBeUsed())
          )
            throw new Error("BroadcastChannel: localstorage cannot be used")
          var uuid = randomToken(),
            eMIs = new ObliviousSet(options.localstorage.removeTimeout),
            state = { channelName, uuid, eMIs }
          return (
            (state.listener = (function (channelName, fn) {
              var key = storageKey(channelName),
                listener = function (ev) {
                  ev.key === key && fn(JSON.parse(ev.newValue))
                }
              return window.addEventListener("storage", listener), listener
            })(channelName, function (msgObj) {
              state.messagesCallback &&
                msgObj.uuid !== uuid &&
                msgObj.token &&
                !eMIs.has(msgObj.token) &&
                ((msgObj.data.time &&
                  msgObj.data.time < state.messagesCallbackTime) ||
                  (eMIs.add(msgObj.token), state.messagesCallback(msgObj.data)))
            })),
            state
          )
        },
        close: function (channelState) {
          var listener
          ;(listener = channelState.listener),
            window.removeEventListener("storage", listener)
        },
        onMessage: function (channelState, fn, time) {
          ;(channelState.messagesCallbackTime = time),
            (channelState.messagesCallback = fn)
        },
        postMessage: function (channelState, messageJson) {
          return new Promise(function (res) {
            sleep().then(function () {
              var key = storageKey(channelState.channelName),
                writeObj = {
                  token: randomToken(),
                  time: new Date().getTime(),
                  data: messageJson,
                  uuid: channelState.uuid,
                },
                value = JSON.stringify(writeObj)
              getLocalStorage().setItem(key, value)
              var ev = document.createEvent("Event")
              ev.initEvent("storage", !0, !0),
                (ev.key = key),
                (ev.newValue = value),
                window.dispatchEvent(ev),
                res()
            })
          })
        },
        canBeUsed: localstorage_canBeUsed,
        type: "localstorage",
        averageResponseTime: function () {
          var userAgent = navigator.userAgent.toLowerCase()
          return userAgent.includes("safari") && !userAgent.includes("chrome")
            ? 240
            : 120
        },
        microSeconds,
      }
      var simulate_microSeconds = microSeconds,
        SIMULATE_CHANNELS = new Set()
      const simulate = {
        create: function (channelName) {
          var state = { name: channelName, messagesCallback: null }
          return SIMULATE_CHANNELS.add(state), state
        },
        close: function (channelState) {
          SIMULATE_CHANNELS.delete(channelState)
        },
        onMessage: function (channelState, fn) {
          channelState.messagesCallback = fn
        },
        postMessage: function (channelState, messageJson) {
          return new Promise(function (res) {
            return setTimeout(function () {
              Array.from(SIMULATE_CHANNELS)
                .filter(function (channel) {
                  return channel.name === channelState.name
                })
                .filter(function (channel) {
                  return channel !== channelState
                })
                .filter(function (channel) {
                  return !!channel.messagesCallback
                })
                .forEach(function (channel) {
                  return channel.messagesCallback(messageJson)
                }),
                res()
            }, 5)
          })
        },
        canBeUsed: function () {
          return !0
        },
        type: "simulate",
        averageResponseTime: function () {
          return 5
        },
        microSeconds: simulate_microSeconds,
      }
      var METHODS = [methods_native, indexed_db, localstorage]
      if (isNode) {
        var NodeMethod = __webpack_require__(633)
        "function" == typeof NodeMethod.canBeUsed && METHODS.push(NodeMethod)
      }
      var ENFORCED_OPTIONS,
        broadcast_channel_BroadcastChannel = function (name, options) {
          var channel, maybePromise, obj
          ;(this.name = name),
            ENFORCED_OPTIONS && (options = ENFORCED_OPTIONS),
            (this.options = options_fillOptionsWithDefaults(options)),
            (this.method = (function (options) {
              var chooseMethods = []
                .concat(options.methods, METHODS)
                .filter(Boolean)
              if (options.type) {
                if ("simulate" === options.type) return simulate
                var ret = chooseMethods.find(function (m) {
                  return m.type === options.type
                })
                if (ret) return ret
                throw new Error("method-type " + options.type + " not found")
              }
              options.webWorkerSupport ||
                isNode ||
                (chooseMethods = chooseMethods.filter(function (m) {
                  return "idb" !== m.type
                }))
              var useMethod = chooseMethods.find(function (method) {
                return method.canBeUsed()
              })
              if (useMethod) return useMethod
              throw new Error(
                "No useable methode found:" +
                  JSON.stringify(
                    METHODS.map(function (m) {
                      return m.type
                    })
                  )
              )
            })(this.options)),
            (this._iL = !1),
            (this._onML = null),
            (this._addEL = { message: [], internal: [] }),
            (this._uMP = new Set()),
            (this._befC = []),
            (this._prepP = null),
            (maybePromise = (channel = this).method.create(
              channel.name,
              channel.options
            )),
            (obj = maybePromise) && "function" == typeof obj.then
              ? ((channel._prepP = maybePromise),
                maybePromise.then(function (s) {
                  channel._state = s
                }))
              : (channel._state = maybePromise)
        }
      function _post(broadcastChannel, type, msg) {
        var msgObj = {
          time: broadcastChannel.method.microSeconds(),
          type,
          data: msg,
        }
        return (
          broadcastChannel._prepP ? broadcastChannel._prepP : Promise.resolve()
        ).then(function () {
          var sendPromise = broadcastChannel.method.postMessage(
            broadcastChannel._state,
            msgObj
          )
          return (
            broadcastChannel._uMP.add(sendPromise),
            sendPromise.catch().then(function () {
              return broadcastChannel._uMP.delete(sendPromise)
            }),
            sendPromise
          )
        })
      }
      function _hasMessageListeners(channel) {
        return (
          channel._addEL.message.length > 0 ||
          channel._addEL.internal.length > 0
        )
      }
      function _addListenerObject(channel, type, obj) {
        channel._addEL[type].push(obj),
          (function (channel) {
            if (!channel._iL && _hasMessageListeners(channel)) {
              var listenerFn = function (msgObj) {
                  channel._addEL[msgObj.type].forEach(function (obj) {
                    msgObj.time >= obj.time && obj.fn(msgObj.data)
                  })
                },
                time = channel.method.microSeconds()
              channel._prepP
                ? channel._prepP.then(function () {
                    ;(channel._iL = !0),
                      channel.method.onMessage(channel._state, listenerFn, time)
                  })
                : ((channel._iL = !0),
                  channel.method.onMessage(channel._state, listenerFn, time))
            }
          })(channel)
      }
      function _removeListenerObject(channel, type, obj) {
        ;(channel._addEL[type] = channel._addEL[type].filter(function (o) {
          return o !== obj
        })),
          (function (channel) {
            if (channel._iL && !_hasMessageListeners(channel)) {
              channel._iL = !1
              var time = channel.method.microSeconds()
              channel.method.onMessage(channel._state, null, time)
            }
          })(channel)
      }
      ;(broadcast_channel_BroadcastChannel._pubkey = !0),
        (broadcast_channel_BroadcastChannel.prototype = {
          postMessage: function (msg) {
            if (this.closed)
              throw new Error(
                "BroadcastChannel.postMessage(): Cannot post message after channel has closed"
              )
            return _post(this, "message", msg)
          },
          postInternal: function (msg) {
            return _post(this, "internal", msg)
          },
          set onmessage(fn) {
            var listenObj = { time: this.method.microSeconds(), fn }
            _removeListenerObject(this, "message", this._onML),
              fn && "function" == typeof fn
                ? ((this._onML = listenObj),
                  _addListenerObject(this, "message", listenObj))
                : (this._onML = null)
          },
          addEventListener: function (type, fn) {
            _addListenerObject(this, type, {
              time: this.method.microSeconds(),
              fn,
            })
          },
          removeEventListener: function (type, fn) {
            _removeListenerObject(
              this,
              type,
              this._addEL[type].find(function (obj) {
                return obj.fn === fn
              })
            )
          },
          close: function () {
            var _this = this
            if (!this.closed) {
              this.closed = !0
              var awaitPrepare = this._prepP ? this._prepP : Promise.resolve()
              return (
                (this._onML = null),
                (this._addEL.message = []),
                awaitPrepare
                  .then(function () {
                    return Promise.all(Array.from(_this._uMP))
                  })
                  .then(function () {
                    return Promise.all(
                      _this._befC.map(function (fn) {
                        return fn()
                      })
                    )
                  })
                  .then(function () {
                    return _this.method.close(_this._state)
                  })
              )
            }
          },
          get type() {
            return this.method.type
          },
          get isClosed() {
            return this.closed
          },
        })
      var delay = __webpack_require__(228),
        delay_default = __webpack_require__.n(delay)
      function function_identity(a) {
        return a
      }
      function constant(a) {
        return function () {
          return a
        }
      }
      function function_pipe(
        a,
        ab,
        bc,
        cd,
        de,
        ef,
        fg,
        gh,
        hi,
        ij,
        jk,
        kl,
        lm,
        mn,
        no,
        op,
        pq,
        qr,
        rs,
        st
      ) {
        switch (arguments.length) {
          case 1:
            return a
          case 2:
            return ab(a)
          case 3:
            return bc(ab(a))
          case 4:
            return cd(bc(ab(a)))
          case 5:
            return de(cd(bc(ab(a))))
          case 6:
            return ef(de(cd(bc(ab(a)))))
          case 7:
            return fg(ef(de(cd(bc(ab(a))))))
          case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))))
          case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))))
          case 10:
            return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))
          case 11:
            return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))
          case 12:
            return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))
          case 13:
            return lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))
          case 14:
            return mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))
          case 15:
            return no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))
          case 16:
            return op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))
          case 17:
            return pq(
              op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))
            )
          case 18:
            return qr(
              pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))
            )
          case 19:
            return rs(
              qr(
                pq(
                  op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))
                )
              )
            )
          case 20:
            return st(
              rs(
                qr(
                  pq(
                    op(
                      no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))
                    )
                  )
                )
              )
            )
        }
      }
      const getTeaserContainers = node =>
          Array.from(
            node.querySelectorAll(
              ".views-responsive-grid, .node-playlist .field-name-field-videos"
            )
          ).filter(grid =>
            grid.querySelector(
              ".node-teaser, .node-sidebar_teaser, .node-wide_teaser"
            )
          ),
        scriptIdentifier = "iwara-custom-sort-1340362664231628",
        partial_lib =
          (f, ...headArgs) =>
          (...restArgs) =>
            f(...headArgs, ...restArgs),
        tapIs = (constructor, x) => (lib(x instanceof constructor), x)
      function flap(F) {
        return function (a) {
          return function (fab) {
            return F.map(fab, function (f) {
              return f(a)
            })
          }
        }
      }
      var isSome = function (fa) {
          return "Some" === fa._tag
        },
        none = { _tag: "None" },
        some = function (a) {
          return { _tag: "Some", value: a }
        },
        emptyReadonlyArray = []
      Object.prototype.hasOwnProperty, constant(0)
      var a
      a = void 0
      var ReadonlyNonEmptyArray_spreadArray = function (to, from) {
          for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i]
          return to
        },
        ReadonlyNonEmptyArray_empty = emptyReadonlyArray,
        appendW = function (end) {
          return function (init) {
            return ReadonlyNonEmptyArray_spreadArray(
              ReadonlyNonEmptyArray_spreadArray([], init),
              [end]
            )
          }
        },
        append = appendW
      var _map = function (fa, f) {
          return function_pipe(fa, ReadonlyNonEmptyArray_map(f))
        },
        ReadonlyNonEmptyArray_map = function (f) {
          return mapWithIndex(function (_, a) {
            return f(a)
          })
        },
        mapWithIndex = function (f) {
          return function (as) {
            for (
              var out = [f(0, ReadonlyNonEmptyArray_head(as))], i = 1;
              i < as.length;
              i++
            )
              out.push(f(i, as[i]))
            return out
          }
        },
        extract = function (as) {
          return as[0]
        },
        Functor = { URI: "ReadonlyNonEmptyArray", map: _map },
        ReadonlyNonEmptyArray_head = (flap(Functor), extract)
      var NonEmptyArray_spreadArray = function (to, from) {
          for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i]
          return to
        },
        NonEmptyArray_appendW = function (end) {
          return function (init) {
            return NonEmptyArray_spreadArray(
              NonEmptyArray_spreadArray([], init),
              [end]
            )
          }
        },
        NonEmptyArray_append = NonEmptyArray_appendW
      var NonEmptyArray_map = function (fa, f) {
          return function_pipe(fa, es6_NonEmptyArray_map(f))
        },
        es6_NonEmptyArray_map = function (f) {
          return es6_NonEmptyArray_mapWithIndex(function (_, a) {
            return f(a)
          })
        },
        es6_NonEmptyArray_mapWithIndex = function (f) {
          return function (as) {
            for (
              var out = [f(0, NonEmptyArray_head(as))], i = 1;
              i < as.length;
              i++
            )
              out.push(f(i, as[i]))
            return out
          }
        },
        NonEmptyArray_Functor = {
          URI: "NonEmptyArray",
          map: NonEmptyArray_map,
        },
        NonEmptyArray_head =
          (flap(NonEmptyArray_Functor), ReadonlyNonEmptyArray_head)
      var separated = function (left, right) {
          return { left, right }
        },
        es6_Separated_map = function (f) {
          return function (fa) {
            return separated(Separated_left(fa), f(Separated_right(fa)))
          }
        },
        Separated_left =
          (flap({
            URI: "Separated",
            map: function (fa, f) {
              return function_pipe(fa, es6_Separated_map(f))
            },
          }),
          function (s) {
            return s.left
          }),
        Separated_right = function (s) {
          return s.right
        }
      function wiltDefault(T, C) {
        return function (F) {
          var traverseF = T.traverse(F)
          return function (wa, f) {
            return F.map(traverseF(wa, f), C.separate)
          }
        }
      }
      function witherDefault(T, C) {
        return function (F) {
          var traverseF = T.traverse(F)
          return function (wa, f) {
            return F.map(traverseF(wa, f), C.compact)
          }
        }
      }
      var ReadonlyArray_append = append
      var ReadonlyArray_map = function (fa, f) {
          return function_pipe(fa, es6_ReadonlyArray_map(f))
        },
        ReadonlyArray_reduce = function (fa, b, f) {
          return function_pipe(fa, es6_ReadonlyArray_reduce(b, f))
        },
        ReadonlyArray_foldMap = function (M) {
          var foldMapM = es6_ReadonlyArray_foldMap(M)
          return function (fa, f) {
            return function_pipe(fa, foldMapM(f))
          }
        },
        ReadonlyArray_reduceRight = function (fa, b, f) {
          return function_pipe(fa, es6_ReadonlyArray_reduceRight(b, f))
        },
        ReadonlyArray_traverse = function (F) {
          var traverseF = es6_ReadonlyArray_traverse(F)
          return function (ta, f) {
            return function_pipe(ta, traverseF(f))
          }
        },
        zero = function () {
          return ReadonlyArray_empty
        },
        es6_ReadonlyArray_map = function (f) {
          return function (fa) {
            return fa.map(function (a) {
              return f(a)
            })
          }
        },
        separate = function (fa) {
          for (
            var left = [], right = [], _i = 0, fa_1 = fa;
            _i < fa_1.length;
            _i++
          ) {
            var e = fa_1[_i]
            "Left" === e._tag ? left.push(e.left) : right.push(e.right)
          }
          return separated(left, right)
        },
        filterMapWithIndex = function (f) {
          return function (fa) {
            for (var out = [], i = 0; i < fa.length; i++) {
              var optionB = f(i, fa[i])
              isSome(optionB) && out.push(optionB.value)
            }
            return out
          }
        },
        filterMap = function (f) {
          return filterMapWithIndex(function (_, a) {
            return f(a)
          })
        },
        compact = filterMap(function_identity),
        es6_ReadonlyArray_foldMapWithIndex = function (M) {
          return function (f) {
            return function (fa) {
              return fa.reduce(function (b, a, i) {
                return M.concat(b, f(i, a))
              }, M.empty)
            }
          }
        },
        es6_ReadonlyArray_reduce = function (b, f) {
          return es6_ReadonlyArray_reduceWithIndex(b, function (_, b, a) {
            return f(b, a)
          })
        },
        es6_ReadonlyArray_foldMap = function (M) {
          var foldMapWithIndexM = es6_ReadonlyArray_foldMapWithIndex(M)
          return function (f) {
            return foldMapWithIndexM(function (_, a) {
              return f(a)
            })
          }
        },
        es6_ReadonlyArray_reduceWithIndex = function (b, f) {
          return function (fa) {
            for (var len = fa.length, out = b, i = 0; i < len; i++)
              out = f(i, out, fa[i])
            return out
          }
        },
        es6_ReadonlyArray_reduceRight = function (b, f) {
          return es6_ReadonlyArray_reduceRightWithIndex(b, function (_, a, b) {
            return f(a, b)
          })
        },
        es6_ReadonlyArray_reduceRightWithIndex = function (b, f) {
          return function (fa) {
            return fa.reduceRight(function (b, a, i) {
              return f(i, a, b)
            }, b)
          }
        },
        es6_ReadonlyArray_traverse = function (F) {
          var traverseWithIndexF = es6_ReadonlyArray_traverseWithIndex(F)
          return function (f) {
            return traverseWithIndexF(function (_, a) {
              return f(a)
            })
          }
        },
        ReadonlyArray_sequence = function (F) {
          return function (ta) {
            return ReadonlyArray_reduce(ta, F.of(zero()), function (fas, fa) {
              return F.ap(
                F.map(fas, function (as) {
                  return function (a) {
                    return function_pipe(as, ReadonlyArray_append(a))
                  }
                }),
                fa
              )
            })
          }
        },
        es6_ReadonlyArray_traverseWithIndex = function (F) {
          return function (f) {
            return es6_ReadonlyArray_reduceWithIndex(
              F.of(zero()),
              function (i, fbs, a) {
                return F.ap(
                  F.map(fbs, function (bs) {
                    return function (b) {
                      return function_pipe(bs, ReadonlyArray_append(b))
                    }
                  }),
                  f(i, a)
                )
              }
            )
          }
        },
        ReadonlyArray_Functor = {
          URI: "ReadonlyArray",
          map: ReadonlyArray_map,
        },
        Compactable =
          (flap(ReadonlyArray_Functor),
          { URI: "ReadonlyArray", compact, separate }),
        ReadonlyArray_Traversable = {
          URI: "ReadonlyArray",
          map: ReadonlyArray_map,
          reduce: ReadonlyArray_reduce,
          foldMap: ReadonlyArray_foldMap,
          reduceRight: ReadonlyArray_reduceRight,
          traverse: ReadonlyArray_traverse,
          sequence: ReadonlyArray_sequence,
        },
        ReadonlyArray_empty =
          (witherDefault(ReadonlyArray_Traversable, Compactable),
          wiltDefault(ReadonlyArray_Traversable, Compactable),
          ReadonlyNonEmptyArray_empty),
        Array_append = NonEmptyArray_append
      var Array_map = function (fa, f) {
          return function_pipe(fa, es6_Array_map(f))
        },
        Array_reduce = function (fa, b, f) {
          return function_pipe(fa, es6_Array_reduce(b, f))
        },
        Array_foldMap = function (M) {
          var foldMapM = es6_Array_foldMap(M)
          return function (fa, f) {
            return function_pipe(fa, foldMapM(f))
          }
        },
        Array_reduceRight = function (fa, b, f) {
          return function_pipe(fa, es6_Array_reduceRight(b, f))
        },
        Array_traverse = function (F) {
          var traverseF = es6_Array_traverse(F)
          return function (ta, f) {
            return function_pipe(ta, traverseF(f))
          }
        },
        es6_Array_map = function (f) {
          return function (fa) {
            return fa.map(function (a) {
              return f(a)
            })
          }
        },
        es6_Array_filterMapWithIndex = function (f) {
          return function (fa) {
            for (var out = [], i = 0; i < fa.length; i++) {
              var optionB = f(i, fa[i])
              isSome(optionB) && out.push(optionB.value)
            }
            return out
          }
        },
        es6_Array_filterMap = function (f) {
          return es6_Array_filterMapWithIndex(function (_, a) {
            return f(a)
          })
        },
        Array_compact = es6_Array_filterMap(function_identity),
        Array_separate = function (fa) {
          for (
            var left = [], right = [], _i = 0, fa_1 = fa;
            _i < fa_1.length;
            _i++
          ) {
            var e = fa_1[_i]
            "Left" === e._tag ? left.push(e.left) : right.push(e.right)
          }
          return separated(left, right)
        },
        es6_Array_filter = function (predicate) {
          return function (as) {
            return as.filter(predicate)
          }
        },
        es6_Array_foldMap = es6_ReadonlyArray_foldMap,
        es6_Array_reduce = es6_ReadonlyArray_reduce,
        es6_Array_reduceWithIndex = es6_ReadonlyArray_reduceWithIndex,
        es6_Array_reduceRight = es6_ReadonlyArray_reduceRight,
        es6_Array_traverse = function (F) {
          var traverseWithIndexF = es6_Array_traverseWithIndex(F)
          return function (f) {
            return traverseWithIndexF(function (_, a) {
              return f(a)
            })
          }
        },
        Array_sequence = function (F) {
          return function (ta) {
            return Array_reduce(ta, F.of([]), function (fas, fa) {
              return F.ap(
                F.map(fas, function (as) {
                  return function (a) {
                    return function_pipe(as, Array_append(a))
                  }
                }),
                fa
              )
            })
          }
        },
        es6_Array_traverseWithIndex = function (F) {
          return function (f) {
            return es6_Array_reduceWithIndex(F.of([]), function (i, fbs, a) {
              return F.ap(
                F.map(fbs, function (bs) {
                  return function (b) {
                    return function_pipe(bs, Array_append(b))
                  }
                }),
                f(i, a)
              )
            })
          }
        },
        Array_Functor = { URI: "Array", map: Array_map },
        Array_Compactable =
          (flap(Array_Functor),
          { URI: "Array", compact: Array_compact, separate: Array_separate }),
        Array_Traversable = {
          URI: "Array",
          map: Array_map,
          reduce: Array_reduce,
          foldMap: Array_foldMap,
          reduceRight: Array_reduceRight,
          traverse: Array_traverse,
          sequence: Array_sequence,
        },
        Option_none =
          (witherDefault(Array_Traversable, Array_Compactable),
          wiltDefault(Array_Traversable, Array_Compactable),
          none),
        Option_some = some
      var es6_Option_map = function (f) {
          return function (fa) {
            return Option_isNone(fa) ? Option_none : Option_some(f(fa.value))
          }
        },
        Option_of = Option_some,
        Option_isNone = function (fa) {
          return "None" === fa._tag
        },
        getOrElse = function (onNone) {
          return function (ma) {
            return Option_isNone(ma) ? onNone() : ma.value
          }
        },
        fromNullable = function (a) {
          return null == a ? Option_none : Option_some(a)
        }
      Option_of(emptyReadonlyArray)
      const external_m_namespaceObject = m
      var external_m_default = __webpack_require__.n(external_m_namespaceObject)
      const external_rxjs_namespaceObject = rxjs,
        external_Swal_namespaceObject = Swal
      var external_Swal_default = __webpack_require__.n(
        external_Swal_namespaceObject
      )
      const forward_to_lib = observer => value => {
          observer.next(value)
        },
        classAttr = classNames => classNames.map(x => `.${x}`).join(""),
        conditionPresets = {
          "Default Condition":
            "(Math.asinh(ratio * 15) / 15 / (private * 1.8 + 1) + Math.log(likes) / 230) / (image + 8)",
          Newest: "-index",
          Oldest: "index",
          "Likes / Views": "ratio",
          "Most Liked": "likes",
          "Most Viewed": "views",
        },
        getInputValue = event$ =>
          event$.pipe(
            (0, external_rxjs_namespaceObject.pluck)("currentTarget"),
            (0, external_rxjs_namespaceObject.map)(
              partial_lib(tapIs, HTMLInputElement)
            ),
            (0, external_rxjs_namespaceObject.pluck)("value")
          ),
        getPageParam = URL_ =>
          ((URL_, name) => {
            const param = URL_.searchParams.get(name)
            return param ? Number.parseInt(param, 10) : 0
          })(URL_, "page"),
        reloadImage = image => {
          const { src } = image
          ;(image.src = ""), (image.src = src)
        },
        removeEmbeddedPage = page => {
          ;(page.src = ""), page.remove()
        },
        getTeaserValue = (info, condition) => {
          const sortParamPairs = [
            ["index", info.initialIndex],
            ["views", info.viewCount],
            ["likes", info.likeCount],
            [
              "ratio",
              Math.min(info.likeCount / Math.max(1, info.viewCount), 1),
            ],
            ["image", info.imageFactor],
            ["gallery", info.galleryFactor],
            ["private", info.privateFactor],
          ]
          return new Function(
            ...sortParamPairs.map(([name]) => name),
            `return (${condition})`
          )(...sortParamPairs.map(pair => pair[1]))
        },
        changeAnchorPageParam = (anchor, value) =>
          ((anchor, name, value) => {
            const newURL = new URL(anchor.href, window.location.href)
            newURL.searchParams.set(name, value), (anchor.href = newURL.href)
          })(anchor, "page", value.toString()),
        groupPageItems = pageItems => {
          const group = document.createElement("li")
          pageItems[0].before(group),
            (pageItems[0].style.marginLeft = "0"),
            pageItems.forEach(item => {
              item.classList.replace("pager-item", "pager-current")
            })
          const groupList = external_m_default()("ul", {
            style: {
              display: "inline",
              backgroundColor: "hsla(0, 0%, 75%, 50%)",
            },
            oncreate(vnode) {
              vnode.dom.append(...pageItems)
            },
          })
          external_m_default().render(group, groupList)
        },
        adjustPager = ({ container, pageCount }) => {
          const currentPage = getPageParam(new URL(window.location.href)),
            nextPage = currentPage + pageCount
          var predicate
          ;[
            ...[
              () => [
                tapNonNull(container.querySelector(".pager-previous a")),
                Math.max(0, currentPage - pageCount),
              ],
            ].filter(() => currentPage > 0),
            ...(() => {
              const nextPageAnchor = container.querySelector(".pager-next a"),
                lastPageAnchor = container.querySelector(".pager-last a")
              if (lastPageAnchor) {
                const reachedLastPage =
                    getPageParam(
                      new URL(lastPageAnchor.href, window.location.href)
                    ) < nextPage,
                  display = reachedLastPage ? "none" : ""
                if (
                  ((lastPageAnchor.style.display = display),
                  lib(nextPageAnchor),
                  (nextPageAnchor.style.display = display),
                  !reachedLastPage)
                )
                  return [() => [nextPageAnchor, nextPage]]
              } else if (nextPageAnchor)
                return [() => [nextPageAnchor, nextPage]]
              return []
            })(),
          ].forEach(getArgs => changeAnchorPageParam(...getArgs())),
            function_pipe(
              Array.from(container.querySelectorAll(".pager-item a")),
              es6_Array_filter(anchor => {
                const page = getPageParam(
                  new URL(anchor.href, window.location.href)
                )
                return page >= currentPage && page < nextPage
              }),
              ((predicate = currentPageAnchors =>
                currentPageAnchors.length > 0),
              function (a) {
                return predicate(a) ? Option_some(a) : Option_none
              }),
              es6_Option_map(anchors => [
                ...Array.from(container.querySelectorAll(".pager-current")),
                ...anchors.map(anchor => tapNonNull(anchor.parentElement)),
              ]),
              es6_Option_map(groupPageItems)
            )
        },
        getBrokenImages = () =>
          getTeaserContainers(document)
            .flatMap(container => Array.from(container.querySelectorAll("img")))
            .filter(img => img.complete && 0 === img.naturalWidth),
        createPreloadPage = (createContainer, parentPageId, url) => {
          const container = createContainer()
          return (
            (container.src = url.toString()),
            (container.style.display = "none"),
            container.classList.add(parentPageId),
            container
          )
        },
        createPreloadUrl = (startURL, page) => {
          const preloadURL = new URL("", startURL)
          return (
            preloadURL.searchParams.set("page", page.toString()), preloadURL
          )
        },
        preloadUrlStream = (startURL, pageCount$) =>
          pageCount$.pipe(
            (0, external_rxjs_namespaceObject.scan)(
              (max, value) => Math.max(max, value),
              1
            ),
            (0, external_rxjs_namespaceObject.startWith)(1),
            (0, external_rxjs_namespaceObject.bufferCount)(2, 1),
            (0, external_rxjs_namespaceObject.mergeMap)(([last, current]) =>
              (0, external_rxjs_namespaceObject.from)(
                [...Array(current - last).keys()].map(
                  i => getPageParam(startURL) + last + i
                )
              )
            ),
            (0, external_rxjs_namespaceObject.map)(
              partial_lib(createPreloadUrl, startURL)
            )
          ),
        trySortTeasers = condition$ =>
          condition$.pipe(
            (0, external_rxjs_namespaceObject.map)(condition => [
              getTeaserContainers(document),
              condition,
            ]),
            (0, external_rxjs_namespaceObject.mergeMap)(x =>
              (0, external_rxjs_namespaceObject.of)(x).pipe(
                (0, external_rxjs_namespaceObject.tap)(
                  ([containers, condition]) =>
                    containers.forEach(container =>
                      ((container, condition) => {
                        const teaserDivs = Array.from(
                            container.querySelectorAll(
                              ".node-teaser, .node-sidebar_teaser, .node-wide_teaser"
                            )
                          ),
                          sortedTeaserCount = container.dataset
                            .sortedTeaserCount
                            ? parseInt(container.dataset.sortedTeaserCount, 10)
                            : 0
                        teaserDivs
                          .filter(({ dataset }) => !dataset.initialIndex)
                          .forEach(({ dataset }, index) => {
                            dataset.initialIndex = (
                              sortedTeaserCount + index
                            ).toString()
                          }),
                          (container.dataset.sortedTeaserCount =
                            teaserDivs.length.toString())
                        const getNearbyNumber = element => {
                            return (
                              (str = element.nextSibling.wholeText.replace(
                                /,/g,
                                ""
                              )),
                              Number.parseFloat(str) *
                                (str.includes("k") ? 1e3 : 1)
                            )
                            var str
                          },
                          nearbyNumberOrZero = element =>
                            function_pipe(
                              fromNullable(element),
                              es6_Option_map(getNearbyNumber),
                              getOrElse(() => 0)
                            ),
                          divValuePairs = teaserDivs
                            .map(div => ({
                              initialIndex: parseInt(
                                tapNonNull(div.dataset.initialIndex),
                                10
                              ),
                              viewCount: nearbyNumberOrZero(
                                div.querySelector(".glyphicon-eye-open")
                              ),
                              likeCount: nearbyNumberOrZero(
                                div.querySelector(".glyphicon-heart")
                              ),
                              imageFactor: div.querySelector(
                                ".field-type-image"
                              )
                                ? 1
                                : 0,
                              galleryFactor: div.querySelector(
                                ".glyphicon-th-large"
                              )
                                ? 1
                                : 0,
                              privateFactor: div.querySelector(".private-video")
                                ? 1
                                : 0,
                            }))
                            .map((info, index) => [
                              teaserDivs[index],
                              getTeaserValue(info, condition),
                            ])
                        divValuePairs.sort(
                          (itemA, itemB) => itemB[1] - itemA[1]
                        ),
                          teaserDivs.forEach(div =>
                            div.after(document.createElement("span"))
                          ),
                          teaserDivs
                            .map(div => tapNonNull(div.nextSibling))
                            .forEach((anchor, index) =>
                              anchor.replaceWith(divValuePairs[index][0])
                            )
                      })(container, condition)
                    )
                ),
                (0, external_rxjs_namespaceObject.catchError)(
                  error => (
                    external_Swal_default().fire(
                      "Sorting Failed",
                      `An error accured while sorting: ${error}`
                    ),
                    external_log_namespaceObject.error(error),
                    external_rxjs_namespaceObject.EMPTY
                  )
                )
              )
            ),
            (0, external_rxjs_namespaceObject.map)(([containers]) => ({
              containersCount: containers.length,
            }))
          ),
        initParent = async () => {
          if (0 === getTeaserContainers(document).length) return
          const initialCondition = tapNonNull(
              await GM.getValue(
                "sortValue",
                conditionPresets["Default Condition"]
              )
            ),
            pageCount = tapNonNull(await GM.getValue("pageCount", 1)),
            haveMorePages = Boolean(
              document.querySelector(".pager") &&
                !document.querySelector("#comments")
            ),
            sortComponent = new (class {
              constructor(initialCondition, initialPageCount) {
                ;(this.conditionInputInput$ =
                  new external_rxjs_namespaceObject.Subject()),
                  (this.conditionInputChange$ =
                    new external_rxjs_namespaceObject.Subject()),
                  (this.conditionInputKeydown$ =
                    new external_rxjs_namespaceObject.Subject()),
                  (this.sortButtonClick$ =
                    new external_rxjs_namespaceObject.Subject()),
                  (this.presetSelectChange$ =
                    new external_rxjs_namespaceObject.Subject()),
                  (this.pageCountInputInput$ =
                    new external_rxjs_namespaceObject.Subject()),
                  (this.pageCountInputChange$ =
                    new external_rxjs_namespaceObject.Subject()),
                  (this.conditionInputEnterDown$ =
                    this.conditionInputKeydown$.pipe(
                      (0, external_rxjs_namespaceObject.filter)(
                        e => "Enter" === e.key
                      )
                    )),
                  (this.conditionChange$ = (0,
                  external_rxjs_namespaceObject.merge)(
                    this.conditionInputEnterDown$,
                    this.presetSelectChange$,
                    this.conditionInputChange$
                  )),
                  (this.sort$ = (0, external_rxjs_namespaceObject.merge)(
                    this.sortButtonClick$,
                    this.conditionInputEnterDown$,
                    this.presetSelectChange$
                  ).pipe(
                    (0, external_rxjs_namespaceObject.map)(
                      () => this.state.condition
                    )
                  )),
                  (this.condition$ = this.conditionChange$.pipe(
                    (0, external_rxjs_namespaceObject.startWith)(void 0),
                    (0, external_rxjs_namespaceObject.map)(
                      () => this.state.condition
                    )
                  )),
                  (this.pageCount$ = this.pageCountInputChange$.pipe(
                    (0, external_rxjs_namespaceObject.startWith)(void 0),
                    (0, external_rxjs_namespaceObject.map)(
                      () => this.state.pageCount
                    )
                  )),
                  (this.state = {
                    condition: initialCondition,
                    pageCount: initialPageCount,
                    loadedPageCount: 0,
                  }),
                  (0, external_rxjs_namespaceObject.merge)(
                    this.conditionInputInput$.pipe(
                      getInputValue,
                      (0, external_rxjs_namespaceObject.tap)(value => {
                        this.state.condition = value
                      })
                    ),
                    (0, external_rxjs_namespaceObject.merge)(
                      this.conditionChange$,
                      this.presetSelectChange$.pipe(
                        (0, external_rxjs_namespaceObject.tap)(e => {
                          this.state.condition = tapIs(
                            HTMLSelectElement,
                            e.currentTarget
                          ).value
                        })
                      )
                    ).pipe(
                      (0, external_rxjs_namespaceObject.map)(
                        () => this.state.condition
                      ),
                      (0, external_rxjs_namespaceObject.tap)(value =>
                        GM.setValue("sortValue", value)
                      )
                    ),
                    this.pageCountInputInput$.pipe(
                      getInputValue,
                      (0, external_rxjs_namespaceObject.map)(value =>
                        Number.parseInt(value, 10)
                      ),
                      (0, external_rxjs_namespaceObject.tap)(pageCount => {
                        this.state.pageCount = pageCount
                      })
                    ),
                    this.pageCountInputChange$.pipe(
                      (0, external_rxjs_namespaceObject.tap)(() =>
                        GM.setValue("pageCount", this.state.pageCount)
                      )
                    )
                  ).subscribe()
              }
              view() {
                const commonStyle = { margin: "5px 2px" },
                  presetOptions = Object.entries(conditionPresets).map(
                    ([name, value]) =>
                      external_m_default()("option", { value }, name)
                  ),
                  uiChildren = {
                    conditionInput: external_m_default()(
                      `input${classAttr(["form-control", "input-sm"])}`,
                      {
                        size: 60,
                        value: this.state.condition,
                        style: commonStyle,
                        list: "iwara-custom-sort-conditions",
                        oninput: forward_to_lib(this.conditionInputInput$),
                        onchange: forward_to_lib(this.conditionInputChange$),
                        onkeydown: forward_to_lib(this.conditionInputKeydown$),
                      }
                    ),
                    conditionDatalist: external_m_default()(
                      "datalist",
                      { id: "iwara-custom-sort-conditions" },
                      presetOptions
                    ),
                    presetSelect: external_m_default()(
                      `select${classAttr(["btn", "btn-sm", "btn-info"])}`,
                      {
                        onupdate: vnode => {
                          tapIs(HTMLSelectElement, vnode.dom).selectedIndex = 0
                        },
                        style: { width: "95px", ...commonStyle },
                        onchange: forward_to_lib(this.presetSelectChange$),
                      },
                      [
                        external_m_default()(
                          "option",
                          { hidden: !0 },
                          "Presets"
                        ),
                        ...presetOptions,
                      ]
                    ),
                    sortButton: external_m_default()(
                      `button${classAttr(["btn", "btn-sm", "btn-primary"])}`,
                      {
                        style: commonStyle,
                        onclick: forward_to_lib(this.sortButtonClick$),
                      },
                      "Sort"
                    ),
                    label1: external_m_default()(
                      `label${classAttr(["text-primary"])}`,
                      { style: commonStyle },
                      "load"
                    ),
                    pageCountInput: external_m_default()(
                      `input${classAttr(["form-control", "input-sm"])}`,
                      {
                        type: "number",
                        value: this.state.pageCount,
                        min: 1,
                        max: 500,
                        step: 1,
                        style: { width: "7rem", ...commonStyle },
                        oninput: forward_to_lib(this.pageCountInputInput$),
                        onchange: forward_to_lib(this.pageCountInputChange$),
                      }
                    ),
                    label2: external_m_default()(
                      `label${classAttr(["text-primary"])}`,
                      { style: commonStyle },
                      "pages. "
                    ),
                    statusLabel: external_m_default()(
                      `label${classAttr(["text-primary"])}`,
                      { style: commonStyle },
                      this.state.loadedPageCount < this.state.pageCount
                        ? `${this.state.loadedPageCount} of ${this.state.pageCount} pages done`
                        : "All pages done"
                    ),
                  }
                return external_m_default()(
                  `div${classAttr(["form-inline", "container"])}`,
                  { style: { display: "inline-block" } },
                  Object.values(uiChildren)
                )
              }
              addLoadedPageCount() {
                ;(this.state.loadedPageCount += 1),
                  external_m_default().redraw()
              }
            })(initialCondition, pageCount),
            preloadUrl$ = (
              haveMorePages
                ? sortComponent.pageCount$
                : (0, external_rxjs_namespaceObject.of)(1)
            ).pipe(
              partial_lib(preloadUrlStream, new URL(window.location.href))
            ),
            channel = new broadcast_channel_BroadcastChannel(scriptIdentifier),
            parentPageId = `t-${performance.now().toString()}`,
            pageLoad$ = (0, external_rxjs_namespaceObject.fromEvent)(
              channel,
              "message"
            ).pipe(
              (0, external_rxjs_namespaceObject.filter)(
                data => data.parentPageId === parentPageId
              )
            ),
            teaserPageLoad$ = pageLoad$.pipe(
              (0, external_rxjs_namespaceObject.filter)(
                message => message.hasTeasers
              )
            ),
            pageFromUrl = new Map(),
            unsortedTeasers$ = teaserPageLoad$.pipe(
              (0, external_rxjs_namespaceObject.mapTo)(void 0),
              (0, external_rxjs_namespaceObject.startWith)(void 0)
            ),
            clonedClass = `${scriptIdentifier}-cloned`,
            allStreams = {
              adjustPager$: sortComponent.pageCount$.pipe(
                (0, external_rxjs_namespaceObject.mergeMap)(count =>
                  (0, external_rxjs_namespaceObject.from)(
                    document.querySelectorAll(`.pager:not(.${clonedClass})`)
                  ).pipe(
                    (0, external_rxjs_namespaceObject.tap)(pager => {
                      pager.style.display = "none"
                    }),
                    (0, external_rxjs_namespaceObject.map)(pager => {
                      const clonedPager = tapIs(
                        HTMLElement,
                        pager.cloneNode(!0)
                      )
                      return (
                        (clonedPager.style.display = ""), [pager, clonedPager]
                      )
                    }),
                    (0, external_rxjs_namespaceObject.tap)(
                      ([pager, clonedPager]) => {
                        const sibling = pager.previousElementSibling
                        sibling && sibling.matches(`.${clonedClass}`)
                          ? sibling.replaceWith(clonedPager)
                          : pager.before(clonedPager)
                      }
                    ),
                    (0, external_rxjs_namespaceObject.tap)(
                      ([, clonedPager]) => {
                        clonedPager.classList.add(clonedClass)
                      }
                    ),
                    (0, external_rxjs_namespaceObject.map)(
                      ([, clonedPager]) => ({
                        container: clonedPager,
                        pageCount: count,
                      })
                    )
                  )
                ),
                (0, external_rxjs_namespaceObject.tap)(adjustPager)
              ),
              logPageLoad$: pageLoad$.pipe(
                (0, external_rxjs_namespaceObject.tap)(
                  external_log_namespaceObject.info
                )
              ),
              reloadBrokenImages$: unsortedTeasers$.pipe(
                (0, external_rxjs_namespaceObject.mergeMap)(() =>
                  (0, external_rxjs_namespaceObject.timer)(0, 8e3).pipe(
                    (0, external_rxjs_namespaceObject.take)(2)
                  )
                ),
                (0, external_rxjs_namespaceObject.auditTime)(6e3),
                (0, external_rxjs_namespaceObject.map)(getBrokenImages),
                (0, external_rxjs_namespaceObject.tap)(images =>
                  images.forEach(reloadImage)
                ),
                (0, external_rxjs_namespaceObject.map)(
                  images => `Reload ${images.length} broken image(s)`
                ),
                (0, external_rxjs_namespaceObject.tap)(
                  external_log_namespaceObject.info
                )
              ),
              sortTeasers$: (0, external_rxjs_namespaceObject.merge)(
                unsortedTeasers$.pipe(
                  (0, external_rxjs_namespaceObject.withLatestFrom)(
                    sortComponent.condition$
                  ),
                  (0, external_rxjs_namespaceObject.map)(
                    ([, condition]) => condition
                  ),
                  (0, external_rxjs_namespaceObject.tap)(() =>
                    sortComponent.addLoadedPageCount()
                  )
                ),
                sortComponent.sort$
              ).pipe(
                trySortTeasers,
                (0, external_rxjs_namespaceObject.map)(
                  result => `${result.containersCount} containers sorted`
                ),
                (0, external_rxjs_namespaceObject.tap)(
                  external_log_namespaceObject.info
                )
              ),
              removeLoadedPage$: pageLoad$.pipe(
                (0, external_rxjs_namespaceObject.map)(({ url }) => ({
                  url,
                  container: pageFromUrl.get(url),
                })),
                (0, external_rxjs_namespaceObject.tap)(({ url }) =>
                  pageFromUrl.delete(url)
                ),
                (0, external_rxjs_namespaceObject.pluck)("container"),
                (0, external_rxjs_namespaceObject.map)(tapNonNull),
                (0, external_rxjs_namespaceObject.tap)(removeEmbeddedPage)
              ),
              addHiddenPreload$: (0, external_rxjs_namespaceObject.zip)(
                preloadUrl$,
                teaserPageLoad$.pipe(
                  (0, external_rxjs_namespaceObject.scan)(
                    countDown => (countDown > 0 ? countDown - 1 : countDown),
                    5
                  ),
                  (0, external_rxjs_namespaceObject.map)(countDown =>
                    countDown > 0 ? 2 : 1
                  ),
                  (0, external_rxjs_namespaceObject.startWith)(2),
                  (0, external_rxjs_namespaceObject.mergeMap)(createPageCount =>
                    (0, external_rxjs_namespaceObject.of)(
                      ...Array.from({ length: createPageCount }, () => {})
                    )
                  )
                )
              ).pipe(
                (0, external_rxjs_namespaceObject.map)(([url]) => [
                  url,
                  () => {
                    return (
                      (userAgent = window.navigator.userAgent),
                      document.createElement(
                        userAgent.indexOf("Firefox") > -1 ? "embed" : "iframe"
                      )
                    )
                    var userAgent
                  },
                ]),
                (0, external_rxjs_namespaceObject.map)(
                  ([url, createContainer]) => [
                    url.toString(),
                    createPreloadPage(createContainer, parentPageId, url),
                  ]
                ),
                (0, external_rxjs_namespaceObject.tap)(entry =>
                  pageFromUrl.set(...entry)
                ),
                (0, external_rxjs_namespaceObject.tap)(([, container]) =>
                  document.body.append(container)
                )
              ),
            }
          ;(0, external_rxjs_namespaceObject.merge)(
            ...Object.values(allStreams)
          ).subscribe()
          const sortComponentContainer = document.createElement("div")
          tapNonNull(document.querySelector("#user-links")).after(
            sortComponentContainer
          ),
            external_m_default().mount(sortComponentContainer, sortComponent),
            external_log_namespaceObject.debug(await GM.listValues())
        },
        initialize = async () => {
          const isParent = window === window.parent
          external_log_namespaceObject.debug(
            `${isParent ? "Parent" : "Child"}: ${window.location.href}`
          ),
            await (isParent
              ? initParent()
              : (async () => {
                  var _a
                  const teaserContainers = getTeaserContainers(document),
                    channel = new broadcast_channel_BroadcastChannel(
                      scriptIdentifier
                    ),
                    hasTeasers = teaserContainers.length > 0,
                    message = {
                      url: window.location.href,
                      parentPageId: Array.from(
                        tapNonNull(window.frameElement).classList
                      ).filter(x => x.startsWith("t-"))[0],
                      hasTeasers,
                    }
                  hasTeasers &&
                    (await delay_default()(500),
                    ((children, parents) => {
                      for (
                        let i = 0, j = 0;
                        i < parents.length && j < children.length;
                        i += 1
                      ) {
                        const parent = parents[i],
                          child = children[j]
                        parent.className === child.className &&
                          ((child.className = ""),
                          parent.append(child),
                          (j += 1))
                      }
                    })(
                      teaserContainers,
                      function_pipe(
                        null === (_a = window.parent) || void 0 === _a
                          ? void 0
                          : _a.document,
                        x => (x ? getTeaserContainers(x) : [])
                      )
                    )),
                    channel.postMessage(message)
                })())
        }
      ;(async () => {
        external_log_namespaceObject.setLevel("debug")
        try {
          await initialize()
        } catch (error) {
          external_log_namespaceObject.error(error)
        }
      })()
    })()
})()

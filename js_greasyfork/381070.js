// ==UserScript==
// @name     小説家になろう book downloader
// @namespace https://github.com/NateScarlet/Scripts/tree/master/user-script
// @description Add `download all chapter` button to syosetu.com (you need login to download chapters )
// @grant    GM.xmlHttpRequest
// @include	 /^https?://ncode\.syosetu\.com/\w+/$/
// @include	 /^https?://novel18\.syosetu\.com/\w+/$/
// @run-at   document-end
// @version   2025.07.19+4b2dfe06
// @downloadURL https://update.greasyfork.org/scripts/381070/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20book%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/381070/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20book%20downloader.meta.js
// ==/UserScript==

"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __knownSymbol = (name, symbol) => {
    if (symbol = Symbol[name])
      return symbol;
    throw Error("Symbol." + name + " is not defined");
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var __using = (stack, value, async) => {
    if (value != null) {
      if (typeof value !== "object")
        throw TypeError("Object expected");
      var dispose;
      if (async)
        dispose = value[__knownSymbol("asyncDispose")];
      if (dispose === void 0)
        dispose = value[__knownSymbol("dispose")];
      if (typeof dispose !== "function")
        throw TypeError("Object not disposable");
      stack.push([async, dispose, value]);
    } else if (async) {
      stack.push([async]);
    }
    return value;
  };
  var __callDispose = (stack, error, hasError) => {
    var E = typeof SuppressedError === "function" ? SuppressedError : function(e, s, m, _) {
      return _ = Error(m), _.name = "SuppressedError", _.error = e, _.suppressed = s, _;
    };
    var fail = (e) => error = hasError ? new E(e, error, "An error was suppressed during disposal") : (hasError = true, e);
    var next = (it) => {
      while (it = stack.pop()) {
        try {
          var result = it[1] && it[1].call(it[2]);
          if (it[0])
            return Promise.resolve(result).then(next, (e) => (fail(e), next()));
        } catch (e) {
          fail(e);
        }
      }
      if (hasError)
        throw error;
    };
    return next();
  };

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/global-this.js
  var require_global_this = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/global-this.js"(exports, module) {
      "use strict";
      var check = function(it) {
        return it && it.Math === Math && it;
      };
      module.exports = // eslint-disable-next-line es/no-global-this -- safe
      check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || // eslint-disable-next-line no-restricted-globals -- safe
      check(typeof self == "object" && self) || check(typeof global == "object" && global) || check(typeof exports == "object" && exports) || // eslint-disable-next-line no-new-func -- fallback
      function() {
        return this;
      }() || Function("return this")();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/fails.js
  var require_fails = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/fails.js"(exports, module) {
      "use strict";
      module.exports = function(exec) {
        try {
          return !!exec();
        } catch (error) {
          return true;
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/descriptors.js
  var require_descriptors = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/descriptors.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      module.exports = !fails(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] !== 7;
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-bind-native.js
  var require_function_bind_native = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-bind-native.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      module.exports = !fails(function() {
        var test = function() {
        }.bind();
        return typeof test != "function" || test.hasOwnProperty("prototype");
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-call.js
  var require_function_call = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-call.js"(exports, module) {
      "use strict";
      var NATIVE_BIND = require_function_bind_native();
      var call = Function.prototype.call;
      module.exports = NATIVE_BIND ? call.bind(call) : function() {
        return call.apply(call, arguments);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-property-is-enumerable.js
  var require_object_property_is_enumerable = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-property-is-enumerable.js"(exports) {
      "use strict";
      var $propertyIsEnumerable = {}.propertyIsEnumerable;
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);
      exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
        var descriptor = getOwnPropertyDescriptor(this, V);
        return !!descriptor && descriptor.enumerable;
      } : $propertyIsEnumerable;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/create-property-descriptor.js
  var require_create_property_descriptor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/create-property-descriptor.js"(exports, module) {
      "use strict";
      module.exports = function(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value
        };
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-uncurry-this.js
  var require_function_uncurry_this = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-uncurry-this.js"(exports, module) {
      "use strict";
      var NATIVE_BIND = require_function_bind_native();
      var FunctionPrototype = Function.prototype;
      var call = FunctionPrototype.call;
      var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
      module.exports = NATIVE_BIND ? uncurryThisWithBind : function(fn) {
        return function() {
          return call.apply(fn, arguments);
        };
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/classof-raw.js
  var require_classof_raw = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/classof-raw.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var toString = uncurryThis({}.toString);
      var stringSlice = uncurryThis("".slice);
      module.exports = function(it) {
        return stringSlice(toString(it), 8, -1);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/indexed-object.js
  var require_indexed_object = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/indexed-object.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var classof = require_classof_raw();
      var $Object = Object;
      var split = uncurryThis("".split);
      module.exports = fails(function() {
        return !$Object("z").propertyIsEnumerable(0);
      }) ? function(it) {
        return classof(it) === "String" ? split(it, "") : $Object(it);
      } : $Object;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-null-or-undefined.js
  var require_is_null_or_undefined = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-null-or-undefined.js"(exports, module) {
      "use strict";
      module.exports = function(it) {
        return it === null || it === void 0;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/require-object-coercible.js
  var require_require_object_coercible = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/require-object-coercible.js"(exports, module) {
      "use strict";
      var isNullOrUndefined = require_is_null_or_undefined();
      var $TypeError = TypeError;
      module.exports = function(it) {
        if (isNullOrUndefined(it))
          throw new $TypeError("Can't call method on " + it);
        return it;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-indexed-object.js
  var require_to_indexed_object = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-indexed-object.js"(exports, module) {
      "use strict";
      var IndexedObject = require_indexed_object();
      var requireObjectCoercible = require_require_object_coercible();
      module.exports = function(it) {
        return IndexedObject(requireObjectCoercible(it));
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-callable.js
  var require_is_callable = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-callable.js"(exports, module) {
      "use strict";
      var documentAll = typeof document == "object" && document.all;
      module.exports = typeof documentAll == "undefined" && documentAll !== void 0 ? function(argument) {
        return typeof argument == "function" || argument === documentAll;
      } : function(argument) {
        return typeof argument == "function";
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-object.js
  var require_is_object = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-object.js"(exports, module) {
      "use strict";
      var isCallable = require_is_callable();
      module.exports = function(it) {
        return typeof it == "object" ? it !== null : isCallable(it);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-built-in.js
  var require_get_built_in = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-built-in.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var isCallable = require_is_callable();
      var aFunction = function(argument) {
        return isCallable(argument) ? argument : void 0;
      };
      module.exports = function(namespace, method) {
        return arguments.length < 2 ? aFunction(globalThis2[namespace]) : globalThis2[namespace] && globalThis2[namespace][method];
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-is-prototype-of.js
  var require_object_is_prototype_of = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-is-prototype-of.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      module.exports = uncurryThis({}.isPrototypeOf);
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-user-agent.js
  var require_environment_user_agent = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-user-agent.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var navigator = globalThis2.navigator;
      var userAgent = navigator && navigator.userAgent;
      module.exports = userAgent ? String(userAgent) : "";
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-v8-version.js
  var require_environment_v8_version = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-v8-version.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var userAgent = require_environment_user_agent();
      var process = globalThis2.process;
      var Deno2 = globalThis2.Deno;
      var versions = process && process.versions || Deno2 && Deno2.version;
      var v8 = versions && versions.v8;
      var match;
      var version;
      if (v8) {
        match = v8.split(".");
        version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
      }
      if (!version && userAgent) {
        match = userAgent.match(/Edge\/(\d+)/);
        if (!match || match[1] >= 74) {
          match = userAgent.match(/Chrome\/(\d+)/);
          if (match)
            version = +match[1];
        }
      }
      module.exports = version;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/symbol-constructor-detection.js
  var require_symbol_constructor_detection = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/symbol-constructor-detection.js"(exports, module) {
      "use strict";
      var V8_VERSION = require_environment_v8_version();
      var fails = require_fails();
      var globalThis2 = require_global_this();
      var $String = globalThis2.String;
      module.exports = !!Object.getOwnPropertySymbols && !fails(function() {
        var symbol = Symbol("symbol detection");
        return !$String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
        !Symbol.sham && V8_VERSION && V8_VERSION < 41;
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/use-symbol-as-uid.js
  var require_use_symbol_as_uid = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/use-symbol-as-uid.js"(exports, module) {
      "use strict";
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-symbol.js
  var require_is_symbol = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-symbol.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      var isCallable = require_is_callable();
      var isPrototypeOf = require_object_is_prototype_of();
      var USE_SYMBOL_AS_UID = require_use_symbol_as_uid();
      var $Object = Object;
      module.exports = USE_SYMBOL_AS_UID ? function(it) {
        return typeof it == "symbol";
      } : function(it) {
        var $Symbol = getBuiltIn("Symbol");
        return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/try-to-string.js
  var require_try_to_string = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/try-to-string.js"(exports, module) {
      "use strict";
      var $String = String;
      module.exports = function(argument) {
        try {
          return $String(argument);
        } catch (error) {
          return "Object";
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/a-callable.js
  var require_a_callable = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/a-callable.js"(exports, module) {
      "use strict";
      var isCallable = require_is_callable();
      var tryToString = require_try_to_string();
      var $TypeError = TypeError;
      module.exports = function(argument) {
        if (isCallable(argument))
          return argument;
        throw new $TypeError(tryToString(argument) + " is not a function");
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-method.js
  var require_get_method = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-method.js"(exports, module) {
      "use strict";
      var aCallable = require_a_callable();
      var isNullOrUndefined = require_is_null_or_undefined();
      module.exports = function(V, P) {
        var func = V[P];
        return isNullOrUndefined(func) ? void 0 : aCallable(func);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/ordinary-to-primitive.js
  var require_ordinary_to_primitive = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/ordinary-to-primitive.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var isCallable = require_is_callable();
      var isObject = require_is_object();
      var $TypeError = TypeError;
      module.exports = function(input, pref) {
        var fn, val;
        if (pref === "string" && isCallable(fn = input.toString) && !isObject(val = call(fn, input)))
          return val;
        if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input)))
          return val;
        if (pref !== "string" && isCallable(fn = input.toString) && !isObject(val = call(fn, input)))
          return val;
        throw new $TypeError("Can't convert object to primitive value");
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-pure.js
  var require_is_pure = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-pure.js"(exports, module) {
      "use strict";
      module.exports = false;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/define-global-property.js
  var require_define_global_property = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/define-global-property.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var defineProperty = Object.defineProperty;
      module.exports = function(key, value) {
        try {
          defineProperty(globalThis2, key, { value, configurable: true, writable: true });
        } catch (error) {
          globalThis2[key] = value;
        }
        return value;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/shared-store.js
  var require_shared_store = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/shared-store.js"(exports, module) {
      "use strict";
      var IS_PURE = require_is_pure();
      var globalThis2 = require_global_this();
      var defineGlobalProperty = require_define_global_property();
      var SHARED = "__core-js_shared__";
      var store = module.exports = globalThis2[SHARED] || defineGlobalProperty(SHARED, {});
      (store.versions || (store.versions = [])).push({
        version: "3.44.0",
        mode: IS_PURE ? "pure" : "global",
        copyright: "© 2014-2025 Denis Pushkarev (zloirock.ru)",
        license: "https://github.com/zloirock/core-js/blob/v3.44.0/LICENSE",
        source: "https://github.com/zloirock/core-js"
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/shared.js
  var require_shared = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/shared.js"(exports, module) {
      "use strict";
      var store = require_shared_store();
      module.exports = function(key, value) {
        return store[key] || (store[key] = value || {});
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-object.js
  var require_to_object = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-object.js"(exports, module) {
      "use strict";
      var requireObjectCoercible = require_require_object_coercible();
      var $Object = Object;
      module.exports = function(argument) {
        return $Object(requireObjectCoercible(argument));
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/has-own-property.js
  var require_has_own_property = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/has-own-property.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var toObject = require_to_object();
      var hasOwnProperty = uncurryThis({}.hasOwnProperty);
      module.exports = Object.hasOwn || function hasOwn(it, key) {
        return hasOwnProperty(toObject(it), key);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/uid.js
  var require_uid = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/uid.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var id = 0;
      var postfix = Math.random();
      var toString = uncurryThis(1.1.toString);
      module.exports = function(key) {
        return "Symbol(" + (key === void 0 ? "" : key) + ")_" + toString(++id + postfix, 36);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/well-known-symbol.js
  var require_well_known_symbol = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/well-known-symbol.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var shared = require_shared();
      var hasOwn = require_has_own_property();
      var uid = require_uid();
      var NATIVE_SYMBOL = require_symbol_constructor_detection();
      var USE_SYMBOL_AS_UID = require_use_symbol_as_uid();
      var Symbol2 = globalThis2.Symbol;
      var WellKnownSymbolsStore = shared("wks");
      var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol2["for"] || Symbol2 : Symbol2 && Symbol2.withoutSetter || uid;
      module.exports = function(name) {
        if (!hasOwn(WellKnownSymbolsStore, name)) {
          WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol2, name) ? Symbol2[name] : createWellKnownSymbol("Symbol." + name);
        }
        return WellKnownSymbolsStore[name];
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-primitive.js
  var require_to_primitive = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-primitive.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var isObject = require_is_object();
      var isSymbol = require_is_symbol();
      var getMethod = require_get_method();
      var ordinaryToPrimitive = require_ordinary_to_primitive();
      var wellKnownSymbol = require_well_known_symbol();
      var $TypeError = TypeError;
      var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
      module.exports = function(input, pref) {
        if (!isObject(input) || isSymbol(input))
          return input;
        var exoticToPrim = getMethod(input, TO_PRIMITIVE);
        var result;
        if (exoticToPrim) {
          if (pref === void 0)
            pref = "default";
          result = call(exoticToPrim, input, pref);
          if (!isObject(result) || isSymbol(result))
            return result;
          throw new $TypeError("Can't convert object to primitive value");
        }
        if (pref === void 0)
          pref = "number";
        return ordinaryToPrimitive(input, pref);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-property-key.js
  var require_to_property_key = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-property-key.js"(exports, module) {
      "use strict";
      var toPrimitive = require_to_primitive();
      var isSymbol = require_is_symbol();
      module.exports = function(argument) {
        var key = toPrimitive(argument, "string");
        return isSymbol(key) ? key : key + "";
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/document-create-element.js
  var require_document_create_element = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/document-create-element.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var isObject = require_is_object();
      var document2 = globalThis2.document;
      var EXISTS = isObject(document2) && isObject(document2.createElement);
      module.exports = function(it) {
        return EXISTS ? document2.createElement(it) : {};
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/ie8-dom-define.js
  var require_ie8_dom_define = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/ie8-dom-define.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var fails = require_fails();
      var createElement = require_document_create_element();
      module.exports = !DESCRIPTORS && !fails(function() {
        return Object.defineProperty(createElement("div"), "a", {
          get: function() {
            return 7;
          }
        }).a !== 7;
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-get-own-property-descriptor.js
  var require_object_get_own_property_descriptor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-get-own-property-descriptor.js"(exports) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var call = require_function_call();
      var propertyIsEnumerableModule = require_object_property_is_enumerable();
      var createPropertyDescriptor = require_create_property_descriptor();
      var toIndexedObject = require_to_indexed_object();
      var toPropertyKey = require_to_property_key();
      var hasOwn = require_has_own_property();
      var IE8_DOM_DEFINE = require_ie8_dom_define();
      var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPropertyKey(P);
        if (IE8_DOM_DEFINE)
          try {
            return $getOwnPropertyDescriptor(O, P);
          } catch (error) {
          }
        if (hasOwn(O, P))
          return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/v8-prototype-define-bug.js
  var require_v8_prototype_define_bug = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/v8-prototype-define-bug.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var fails = require_fails();
      module.exports = DESCRIPTORS && fails(function() {
        return Object.defineProperty(function() {
        }, "prototype", {
          value: 42,
          writable: false
        }).prototype !== 42;
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/an-object.js
  var require_an_object = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/an-object.js"(exports, module) {
      "use strict";
      var isObject = require_is_object();
      var $String = String;
      var $TypeError = TypeError;
      module.exports = function(argument) {
        if (isObject(argument))
          return argument;
        throw new $TypeError($String(argument) + " is not an object");
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-define-property.js
  var require_object_define_property = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-define-property.js"(exports) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var IE8_DOM_DEFINE = require_ie8_dom_define();
      var V8_PROTOTYPE_DEFINE_BUG = require_v8_prototype_define_bug();
      var anObject = require_an_object();
      var toPropertyKey = require_to_property_key();
      var $TypeError = TypeError;
      var $defineProperty = Object.defineProperty;
      var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var ENUMERABLE = "enumerable";
      var CONFIGURABLE = "configurable";
      var WRITABLE = "writable";
      exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPropertyKey(P);
        anObject(Attributes);
        if (typeof O === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
          var current = $getOwnPropertyDescriptor(O, P);
          if (current && current[WRITABLE]) {
            O[P] = Attributes.value;
            Attributes = {
              configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
              enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
              writable: false
            };
          }
        }
        return $defineProperty(O, P, Attributes);
      } : $defineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPropertyKey(P);
        anObject(Attributes);
        if (IE8_DOM_DEFINE)
          try {
            return $defineProperty(O, P, Attributes);
          } catch (error) {
          }
        if ("get" in Attributes || "set" in Attributes)
          throw new $TypeError("Accessors not supported");
        if ("value" in Attributes)
          O[P] = Attributes.value;
        return O;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/create-non-enumerable-property.js
  var require_create_non_enumerable_property = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/create-non-enumerable-property.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var definePropertyModule = require_object_define_property();
      var createPropertyDescriptor = require_create_property_descriptor();
      module.exports = DESCRIPTORS ? function(object, key, value) {
        return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
      } : function(object, key, value) {
        object[key] = value;
        return object;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-name.js
  var require_function_name = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-name.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var hasOwn = require_has_own_property();
      var FunctionPrototype = Function.prototype;
      var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
      var EXISTS = hasOwn(FunctionPrototype, "name");
      var PROPER = EXISTS && function something() {
      }.name === "something";
      var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, "name").configurable);
      module.exports = {
        EXISTS,
        PROPER,
        CONFIGURABLE
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/inspect-source.js
  var require_inspect_source = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/inspect-source.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var isCallable = require_is_callable();
      var store = require_shared_store();
      var functionToString = uncurryThis(Function.toString);
      if (!isCallable(store.inspectSource)) {
        store.inspectSource = function(it) {
          return functionToString(it);
        };
      }
      module.exports = store.inspectSource;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/weak-map-basic-detection.js
  var require_weak_map_basic_detection = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/weak-map-basic-detection.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var isCallable = require_is_callable();
      var WeakMap = globalThis2.WeakMap;
      module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/shared-key.js
  var require_shared_key = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/shared-key.js"(exports, module) {
      "use strict";
      var shared = require_shared();
      var uid = require_uid();
      var keys = shared("keys");
      module.exports = function(key) {
        return keys[key] || (keys[key] = uid(key));
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/hidden-keys.js
  var require_hidden_keys = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/hidden-keys.js"(exports, module) {
      "use strict";
      module.exports = {};
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/internal-state.js
  var require_internal_state = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/internal-state.js"(exports, module) {
      "use strict";
      var NATIVE_WEAK_MAP = require_weak_map_basic_detection();
      var globalThis2 = require_global_this();
      var isObject = require_is_object();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var hasOwn = require_has_own_property();
      var shared = require_shared_store();
      var sharedKey = require_shared_key();
      var hiddenKeys = require_hidden_keys();
      var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
      var TypeError2 = globalThis2.TypeError;
      var WeakMap = globalThis2.WeakMap;
      var set;
      var get;
      var has;
      var enforce = function(it) {
        return has(it) ? get(it) : set(it, {});
      };
      var getterFor = function(TYPE) {
        return function(it) {
          var state;
          if (!isObject(it) || (state = get(it)).type !== TYPE) {
            throw new TypeError2("Incompatible receiver, " + TYPE + " required");
          }
          return state;
        };
      };
      if (NATIVE_WEAK_MAP || shared.state) {
        store = shared.state || (shared.state = new WeakMap());
        store.get = store.get;
        store.has = store.has;
        store.set = store.set;
        set = function(it, metadata) {
          if (store.has(it))
            throw new TypeError2(OBJECT_ALREADY_INITIALIZED);
          metadata.facade = it;
          store.set(it, metadata);
          return metadata;
        };
        get = function(it) {
          return store.get(it) || {};
        };
        has = function(it) {
          return store.has(it);
        };
      } else {
        STATE = sharedKey("state");
        hiddenKeys[STATE] = true;
        set = function(it, metadata) {
          if (hasOwn(it, STATE))
            throw new TypeError2(OBJECT_ALREADY_INITIALIZED);
          metadata.facade = it;
          createNonEnumerableProperty(it, STATE, metadata);
          return metadata;
        };
        get = function(it) {
          return hasOwn(it, STATE) ? it[STATE] : {};
        };
        has = function(it) {
          return hasOwn(it, STATE);
        };
      }
      var store;
      var STATE;
      module.exports = {
        set,
        get,
        has,
        enforce,
        getterFor
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/make-built-in.js
  var require_make_built_in = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/make-built-in.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var isCallable = require_is_callable();
      var hasOwn = require_has_own_property();
      var DESCRIPTORS = require_descriptors();
      var CONFIGURABLE_FUNCTION_NAME = require_function_name().CONFIGURABLE;
      var inspectSource = require_inspect_source();
      var InternalStateModule = require_internal_state();
      var enforceInternalState = InternalStateModule.enforce;
      var getInternalState = InternalStateModule.get;
      var $String = String;
      var defineProperty = Object.defineProperty;
      var stringSlice = uncurryThis("".slice);
      var replace = uncurryThis("".replace);
      var join = uncurryThis([].join);
      var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function() {
        return defineProperty(function() {
        }, "length", { value: 8 }).length !== 8;
      });
      var TEMPLATE = String(String).split("String");
      var makeBuiltIn = module.exports = function(value, name, options) {
        if (stringSlice($String(name), 0, 7) === "Symbol(") {
          name = "[" + replace($String(name), /^Symbol\(([^)]*)\).*$/, "$1") + "]";
        }
        if (options && options.getter)
          name = "get " + name;
        if (options && options.setter)
          name = "set " + name;
        if (!hasOwn(value, "name") || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
          if (DESCRIPTORS)
            defineProperty(value, "name", { value: name, configurable: true });
          else
            value.name = name;
        }
        if (CONFIGURABLE_LENGTH && options && hasOwn(options, "arity") && value.length !== options.arity) {
          defineProperty(value, "length", { value: options.arity });
        }
        try {
          if (options && hasOwn(options, "constructor") && options.constructor) {
            if (DESCRIPTORS)
              defineProperty(value, "prototype", { writable: false });
          } else if (value.prototype)
            value.prototype = void 0;
        } catch (error) {
        }
        var state = enforceInternalState(value);
        if (!hasOwn(state, "source")) {
          state.source = join(TEMPLATE, typeof name == "string" ? name : "");
        }
        return value;
      };
      Function.prototype.toString = makeBuiltIn(function toString() {
        return isCallable(this) && getInternalState(this).source || inspectSource(this);
      }, "toString");
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/define-built-in.js
  var require_define_built_in = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/define-built-in.js"(exports, module) {
      "use strict";
      var isCallable = require_is_callable();
      var definePropertyModule = require_object_define_property();
      var makeBuiltIn = require_make_built_in();
      var defineGlobalProperty = require_define_global_property();
      module.exports = function(O, key, value, options) {
        if (!options)
          options = {};
        var simple = options.enumerable;
        var name = options.name !== void 0 ? options.name : key;
        if (isCallable(value))
          makeBuiltIn(value, name, options);
        if (options.global) {
          if (simple)
            O[key] = value;
          else
            defineGlobalProperty(key, value);
        } else {
          try {
            if (!options.unsafe)
              delete O[key];
            else if (O[key])
              simple = true;
          } catch (error) {
          }
          if (simple)
            O[key] = value;
          else
            definePropertyModule.f(O, key, {
              value,
              enumerable: false,
              configurable: !options.nonConfigurable,
              writable: !options.nonWritable
            });
        }
        return O;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/math-trunc.js
  var require_math_trunc = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/math-trunc.js"(exports, module) {
      "use strict";
      var ceil = Math.ceil;
      var floor = Math.floor;
      module.exports = Math.trunc || function trunc(x) {
        var n = +x;
        return (n > 0 ? floor : ceil)(n);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-integer-or-infinity.js
  var require_to_integer_or_infinity = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-integer-or-infinity.js"(exports, module) {
      "use strict";
      var trunc = require_math_trunc();
      module.exports = function(argument) {
        var number = +argument;
        return number !== number || number === 0 ? 0 : trunc(number);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-absolute-index.js
  var require_to_absolute_index = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-absolute-index.js"(exports, module) {
      "use strict";
      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var max = Math.max;
      var min = Math.min;
      module.exports = function(index, length) {
        var integer = toIntegerOrInfinity(index);
        return integer < 0 ? max(integer + length, 0) : min(integer, length);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-length.js
  var require_to_length = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-length.js"(exports, module) {
      "use strict";
      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var min = Math.min;
      module.exports = function(argument) {
        var len = toIntegerOrInfinity(argument);
        return len > 0 ? min(len, 9007199254740991) : 0;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/length-of-array-like.js
  var require_length_of_array_like = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/length-of-array-like.js"(exports, module) {
      "use strict";
      var toLength = require_to_length();
      module.exports = function(obj) {
        return toLength(obj.length);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/array-includes.js
  var require_array_includes = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/array-includes.js"(exports, module) {
      "use strict";
      var toIndexedObject = require_to_indexed_object();
      var toAbsoluteIndex = require_to_absolute_index();
      var lengthOfArrayLike = require_length_of_array_like();
      var createMethod = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
          var O = toIndexedObject($this);
          var length = lengthOfArrayLike(O);
          if (length === 0)
            return !IS_INCLUDES && -1;
          var index = toAbsoluteIndex(fromIndex, length);
          var value;
          if (IS_INCLUDES && el !== el)
            while (length > index) {
              value = O[index++];
              if (value !== value)
                return true;
            }
          else
            for (; length > index; index++) {
              if ((IS_INCLUDES || index in O) && O[index] === el)
                return IS_INCLUDES || index || 0;
            }
          return !IS_INCLUDES && -1;
        };
      };
      module.exports = {
        // `Array.prototype.includes` method
        // https://tc39.es/ecma262/#sec-array.prototype.includes
        includes: createMethod(true),
        // `Array.prototype.indexOf` method
        // https://tc39.es/ecma262/#sec-array.prototype.indexof
        indexOf: createMethod(false)
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-keys-internal.js
  var require_object_keys_internal = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-keys-internal.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var hasOwn = require_has_own_property();
      var toIndexedObject = require_to_indexed_object();
      var indexOf = require_array_includes().indexOf;
      var hiddenKeys = require_hidden_keys();
      var push = uncurryThis([].push);
      module.exports = function(object, names) {
        var O = toIndexedObject(object);
        var i = 0;
        var result = [];
        var key;
        for (key in O)
          !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
        while (names.length > i)
          if (hasOwn(O, key = names[i++])) {
            ~indexOf(result, key) || push(result, key);
          }
        return result;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/enum-bug-keys.js
  var require_enum_bug_keys = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/enum-bug-keys.js"(exports, module) {
      "use strict";
      module.exports = [
        "constructor",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "toLocaleString",
        "toString",
        "valueOf"
      ];
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-get-own-property-names.js
  var require_object_get_own_property_names = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-get-own-property-names.js"(exports) {
      "use strict";
      var internalObjectKeys = require_object_keys_internal();
      var enumBugKeys = require_enum_bug_keys();
      var hiddenKeys = enumBugKeys.concat("length", "prototype");
      exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return internalObjectKeys(O, hiddenKeys);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-get-own-property-symbols.js
  var require_object_get_own_property_symbols = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-get-own-property-symbols.js"(exports) {
      "use strict";
      exports.f = Object.getOwnPropertySymbols;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/own-keys.js
  var require_own_keys = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/own-keys.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      var uncurryThis = require_function_uncurry_this();
      var getOwnPropertyNamesModule = require_object_get_own_property_names();
      var getOwnPropertySymbolsModule = require_object_get_own_property_symbols();
      var anObject = require_an_object();
      var concat = uncurryThis([].concat);
      module.exports = getBuiltIn("Reflect", "ownKeys") || function ownKeys(it) {
        var keys = getOwnPropertyNamesModule.f(anObject(it));
        var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
        return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/copy-constructor-properties.js
  var require_copy_constructor_properties = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/copy-constructor-properties.js"(exports, module) {
      "use strict";
      var hasOwn = require_has_own_property();
      var ownKeys = require_own_keys();
      var getOwnPropertyDescriptorModule = require_object_get_own_property_descriptor();
      var definePropertyModule = require_object_define_property();
      module.exports = function(target, source, exceptions) {
        var keys = ownKeys(source);
        var defineProperty = definePropertyModule.f;
        var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
            defineProperty(target, key, getOwnPropertyDescriptor(source, key));
          }
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-forced.js
  var require_is_forced = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-forced.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      var isCallable = require_is_callable();
      var replacement = /#|\.prototype\./;
      var isForced = function(feature, detection) {
        var value = data[normalize(feature)];
        return value === POLYFILL ? true : value === NATIVE ? false : isCallable(detection) ? fails(detection) : !!detection;
      };
      var normalize = isForced.normalize = function(string) {
        return String(string).replace(replacement, ".").toLowerCase();
      };
      var data = isForced.data = {};
      var NATIVE = isForced.NATIVE = "N";
      var POLYFILL = isForced.POLYFILL = "P";
      module.exports = isForced;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/export.js
  var require_export = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/export.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var getOwnPropertyDescriptor = require_object_get_own_property_descriptor().f;
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var defineBuiltIn = require_define_built_in();
      var defineGlobalProperty = require_define_global_property();
      var copyConstructorProperties = require_copy_constructor_properties();
      var isForced = require_is_forced();
      module.exports = function(options, source) {
        var TARGET = options.target;
        var GLOBAL = options.global;
        var STATIC = options.stat;
        var FORCED, target, key, targetProperty, sourceProperty, descriptor;
        if (GLOBAL) {
          target = globalThis2;
        } else if (STATIC) {
          target = globalThis2[TARGET] || defineGlobalProperty(TARGET, {});
        } else {
          target = globalThis2[TARGET] && globalThis2[TARGET].prototype;
        }
        if (target)
          for (key in source) {
            sourceProperty = source[key];
            if (options.dontCallGetSet) {
              descriptor = getOwnPropertyDescriptor(target, key);
              targetProperty = descriptor && descriptor.value;
            } else
              targetProperty = target[key];
            FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
            if (!FORCED && targetProperty !== void 0) {
              if (typeof sourceProperty == typeof targetProperty)
                continue;
              copyConstructorProperties(sourceProperty, targetProperty);
            }
            if (options.sham || targetProperty && targetProperty.sham) {
              createNonEnumerableProperty(sourceProperty, "sham", true);
            }
            defineBuiltIn(target, key, sourceProperty, options);
          }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-apply.js
  var require_function_apply = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-apply.js"(exports, module) {
      "use strict";
      var NATIVE_BIND = require_function_bind_native();
      var FunctionPrototype = Function.prototype;
      var apply = FunctionPrototype.apply;
      var call = FunctionPrototype.call;
      module.exports = typeof Reflect == "object" && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function() {
        return call.apply(apply, arguments);
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-uncurry-this-accessor.js
  var require_function_uncurry_this_accessor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-uncurry-this-accessor.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var aCallable = require_a_callable();
      module.exports = function(object, key, method) {
        try {
          return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
        } catch (error) {
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-possible-prototype.js
  var require_is_possible_prototype = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-possible-prototype.js"(exports, module) {
      "use strict";
      var isObject = require_is_object();
      module.exports = function(argument) {
        return isObject(argument) || argument === null;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/a-possible-prototype.js
  var require_a_possible_prototype = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/a-possible-prototype.js"(exports, module) {
      "use strict";
      var isPossiblePrototype = require_is_possible_prototype();
      var $String = String;
      var $TypeError = TypeError;
      module.exports = function(argument) {
        if (isPossiblePrototype(argument))
          return argument;
        throw new $TypeError("Can't set " + $String(argument) + " as a prototype");
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-set-prototype-of.js
  var require_object_set_prototype_of = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-set-prototype-of.js"(exports, module) {
      "use strict";
      var uncurryThisAccessor = require_function_uncurry_this_accessor();
      var isObject = require_is_object();
      var requireObjectCoercible = require_require_object_coercible();
      var aPossiblePrototype = require_a_possible_prototype();
      module.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var CORRECT_SETTER = false;
        var test = {};
        var setter;
        try {
          setter = uncurryThisAccessor(Object.prototype, "__proto__", "set");
          setter(test, []);
          CORRECT_SETTER = test instanceof Array;
        } catch (error) {
        }
        return function setPrototypeOf(O, proto) {
          requireObjectCoercible(O);
          aPossiblePrototype(proto);
          if (!isObject(O))
            return O;
          if (CORRECT_SETTER)
            setter(O, proto);
          else
            O.__proto__ = proto;
          return O;
        };
      }() : void 0);
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/proxy-accessor.js
  var require_proxy_accessor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/proxy-accessor.js"(exports, module) {
      "use strict";
      var defineProperty = require_object_define_property().f;
      module.exports = function(Target, Source, key) {
        key in Target || defineProperty(Target, key, {
          configurable: true,
          get: function() {
            return Source[key];
          },
          set: function(it) {
            Source[key] = it;
          }
        });
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/inherit-if-required.js
  var require_inherit_if_required = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/inherit-if-required.js"(exports, module) {
      "use strict";
      var isCallable = require_is_callable();
      var isObject = require_is_object();
      var setPrototypeOf = require_object_set_prototype_of();
      module.exports = function($this, dummy, Wrapper) {
        var NewTarget, NewTargetPrototype;
        if (
          // it can work only with native `setPrototypeOf`
          setPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
          isCallable(NewTarget = dummy.constructor) && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype
        )
          setPrototypeOf($this, NewTargetPrototype);
        return $this;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-string-tag-support.js
  var require_to_string_tag_support = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-string-tag-support.js"(exports, module) {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var test = {};
      test[TO_STRING_TAG] = "z";
      module.exports = String(test) === "[object z]";
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/classof.js
  var require_classof = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/classof.js"(exports, module) {
      "use strict";
      var TO_STRING_TAG_SUPPORT = require_to_string_tag_support();
      var isCallable = require_is_callable();
      var classofRaw = require_classof_raw();
      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var $Object = Object;
      var CORRECT_ARGUMENTS = classofRaw(function() {
        return arguments;
      }()) === "Arguments";
      var tryGet = function(it, key) {
        try {
          return it[key];
        } catch (error) {
        }
      };
      module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function(it) {
        var O, tag, result;
        return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) === "Object" && isCallable(O.callee) ? "Arguments" : result;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-string.js
  var require_to_string = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-string.js"(exports, module) {
      "use strict";
      var classof = require_classof();
      var $String = String;
      module.exports = function(argument) {
        if (classof(argument) === "Symbol")
          throw new TypeError("Cannot convert a Symbol value to a string");
        return $String(argument);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/normalize-string-argument.js
  var require_normalize_string_argument = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/normalize-string-argument.js"(exports, module) {
      "use strict";
      var toString = require_to_string();
      module.exports = function(argument, $default) {
        return argument === void 0 ? arguments.length < 2 ? "" : $default : toString(argument);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/install-error-cause.js
  var require_install_error_cause = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/install-error-cause.js"(exports, module) {
      "use strict";
      var isObject = require_is_object();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      module.exports = function(O, options) {
        if (isObject(options) && "cause" in options) {
          createNonEnumerableProperty(O, "cause", options.cause);
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/error-stack-clear.js
  var require_error_stack_clear = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/error-stack-clear.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var $Error = Error;
      var replace = uncurryThis("".replace);
      var TEST = function(arg) {
        return String(new $Error(arg).stack);
      }("zxcasd");
      var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
      var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);
      module.exports = function(stack, dropEntries) {
        if (IS_V8_OR_CHAKRA_STACK && typeof stack == "string" && !$Error.prepareStackTrace) {
          while (dropEntries--)
            stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, "");
        }
        return stack;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/error-stack-installable.js
  var require_error_stack_installable = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/error-stack-installable.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      var createPropertyDescriptor = require_create_property_descriptor();
      module.exports = !fails(function() {
        var error = new Error("a");
        if (!("stack" in error))
          return true;
        Object.defineProperty(error, "stack", createPropertyDescriptor(1, 7));
        return error.stack !== 7;
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/error-stack-install.js
  var require_error_stack_install = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/error-stack-install.js"(exports, module) {
      "use strict";
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var clearErrorStack = require_error_stack_clear();
      var ERROR_STACK_INSTALLABLE = require_error_stack_installable();
      var captureStackTrace = Error.captureStackTrace;
      module.exports = function(error, C, stack, dropEntries) {
        if (ERROR_STACK_INSTALLABLE) {
          if (captureStackTrace)
            captureStackTrace(error, C);
          else
            createNonEnumerableProperty(error, "stack", clearErrorStack(stack, dropEntries));
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/wrap-error-constructor-with-cause.js
  var require_wrap_error_constructor_with_cause = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/wrap-error-constructor-with-cause.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      var hasOwn = require_has_own_property();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var isPrototypeOf = require_object_is_prototype_of();
      var setPrototypeOf = require_object_set_prototype_of();
      var copyConstructorProperties = require_copy_constructor_properties();
      var proxyAccessor = require_proxy_accessor();
      var inheritIfRequired = require_inherit_if_required();
      var normalizeStringArgument = require_normalize_string_argument();
      var installErrorCause = require_install_error_cause();
      var installErrorStack = require_error_stack_install();
      var DESCRIPTORS = require_descriptors();
      var IS_PURE = require_is_pure();
      module.exports = function(FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
        var STACK_TRACE_LIMIT = "stackTraceLimit";
        var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
        var path = FULL_NAME.split(".");
        var ERROR_NAME = path[path.length - 1];
        var OriginalError = getBuiltIn.apply(null, path);
        if (!OriginalError)
          return;
        var OriginalErrorPrototype = OriginalError.prototype;
        if (!IS_PURE && hasOwn(OriginalErrorPrototype, "cause"))
          delete OriginalErrorPrototype.cause;
        if (!FORCED)
          return OriginalError;
        var BaseError = getBuiltIn("Error");
        var WrappedError = wrapper(function(a, b) {
          var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, void 0);
          var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
          if (message !== void 0)
            createNonEnumerableProperty(result, "message", message);
          installErrorStack(result, WrappedError, result.stack, 2);
          if (this && isPrototypeOf(OriginalErrorPrototype, this))
            inheritIfRequired(result, this, WrappedError);
          if (arguments.length > OPTIONS_POSITION)
            installErrorCause(result, arguments[OPTIONS_POSITION]);
          return result;
        });
        WrappedError.prototype = OriginalErrorPrototype;
        if (ERROR_NAME !== "Error") {
          if (setPrototypeOf)
            setPrototypeOf(WrappedError, BaseError);
          else
            copyConstructorProperties(WrappedError, BaseError, { name: true });
        } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
          proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
          proxyAccessor(WrappedError, OriginalError, "prepareStackTrace");
        }
        copyConstructorProperties(WrappedError, OriginalError);
        if (!IS_PURE)
          try {
            if (OriginalErrorPrototype.name !== ERROR_NAME) {
              createNonEnumerableProperty(OriginalErrorPrototype, "name", ERROR_NAME);
            }
            OriginalErrorPrototype.constructor = WrappedError;
          } catch (error) {
          }
        return WrappedError;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.error.cause.js
  var require_es_error_cause = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.error.cause.js"() {
      "use strict";
      var $ = require_export();
      var globalThis2 = require_global_this();
      var apply = require_function_apply();
      var wrapErrorConstructorWithCause = require_wrap_error_constructor_with_cause();
      var WEB_ASSEMBLY = "WebAssembly";
      var WebAssembly = globalThis2[WEB_ASSEMBLY];
      var FORCED = new Error("e", { cause: 7 }).cause !== 7;
      var exportGlobalErrorCauseWrapper = function(ERROR_NAME, wrapper) {
        var O = {};
        O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
        $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
      };
      var exportWebAssemblyErrorCauseWrapper = function(ERROR_NAME, wrapper) {
        if (WebAssembly && WebAssembly[ERROR_NAME]) {
          var O = {};
          O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + "." + ERROR_NAME, wrapper, FORCED);
          $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
        }
      };
      exportGlobalErrorCauseWrapper("Error", function(init) {
        return function Error2(message) {
          return apply(init, this, arguments);
        };
      });
      exportGlobalErrorCauseWrapper("EvalError", function(init) {
        return function EvalError(message) {
          return apply(init, this, arguments);
        };
      });
      exportGlobalErrorCauseWrapper("RangeError", function(init) {
        return function RangeError2(message) {
          return apply(init, this, arguments);
        };
      });
      exportGlobalErrorCauseWrapper("ReferenceError", function(init) {
        return function ReferenceError2(message) {
          return apply(init, this, arguments);
        };
      });
      exportGlobalErrorCauseWrapper("SyntaxError", function(init) {
        return function SyntaxError(message) {
          return apply(init, this, arguments);
        };
      });
      exportGlobalErrorCauseWrapper("TypeError", function(init) {
        return function TypeError2(message) {
          return apply(init, this, arguments);
        };
      });
      exportGlobalErrorCauseWrapper("URIError", function(init) {
        return function URIError(message) {
          return apply(init, this, arguments);
        };
      });
      exportWebAssemblyErrorCauseWrapper("CompileError", function(init) {
        return function CompileError(message) {
          return apply(init, this, arguments);
        };
      });
      exportWebAssemblyErrorCauseWrapper("LinkError", function(init) {
        return function LinkError(message) {
          return apply(init, this, arguments);
        };
      });
      exportWebAssemblyErrorCauseWrapper("RuntimeError", function(init) {
        return function RuntimeError(message) {
          return apply(init, this, arguments);
        };
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/error-to-string.js
  var require_error_to_string = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/error-to-string.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var fails = require_fails();
      var anObject = require_an_object();
      var normalizeStringArgument = require_normalize_string_argument();
      var nativeErrorToString = Error.prototype.toString;
      var INCORRECT_TO_STRING = fails(function() {
        if (DESCRIPTORS) {
          var object = Object.create(Object.defineProperty({}, "name", { get: function() {
            return this === object;
          } }));
          if (nativeErrorToString.call(object) !== "true")
            return true;
        }
        return nativeErrorToString.call({ message: 1, name: 2 }) !== "2: 1" || nativeErrorToString.call({}) !== "Error";
      });
      module.exports = INCORRECT_TO_STRING ? function toString() {
        var O = anObject(this);
        var name = normalizeStringArgument(O.name, "Error");
        var message = normalizeStringArgument(O.message);
        return !name ? message : !message ? name : name + ": " + message;
      } : nativeErrorToString;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.error.to-string.js
  var require_es_error_to_string = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.error.to-string.js"() {
      "use strict";
      var defineBuiltIn = require_define_built_in();
      var errorToString = require_error_to_string();
      var ErrorPrototype = Error.prototype;
      if (ErrorPrototype.toString !== errorToString) {
        defineBuiltIn(ErrorPrototype, "toString", errorToString);
      }
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-to-string.js
  var require_object_to_string = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-to-string.js"(exports, module) {
      "use strict";
      var TO_STRING_TAG_SUPPORT = require_to_string_tag_support();
      var classof = require_classof();
      module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
        return "[object " + classof(this) + "]";
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.object.to-string.js
  var require_es_object_to_string = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.object.to-string.js"() {
      "use strict";
      var TO_STRING_TAG_SUPPORT = require_to_string_tag_support();
      var defineBuiltIn = require_define_built_in();
      var toString = require_object_to_string();
      if (!TO_STRING_TAG_SUPPORT) {
        defineBuiltIn(Object.prototype, "toString", toString, { unsafe: true });
      }
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/correct-prototype-getter.js
  var require_correct_prototype_getter = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/correct-prototype-getter.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      module.exports = !fails(function() {
        function F() {
        }
        F.prototype.constructor = null;
        return Object.getPrototypeOf(new F()) !== F.prototype;
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-get-prototype-of.js
  var require_object_get_prototype_of = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-get-prototype-of.js"(exports, module) {
      "use strict";
      var hasOwn = require_has_own_property();
      var isCallable = require_is_callable();
      var toObject = require_to_object();
      var sharedKey = require_shared_key();
      var CORRECT_PROTOTYPE_GETTER = require_correct_prototype_getter();
      var IE_PROTO = sharedKey("IE_PROTO");
      var $Object = Object;
      var ObjectPrototype = $Object.prototype;
      module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function(O) {
        var object = toObject(O);
        if (hasOwn(object, IE_PROTO))
          return object[IE_PROTO];
        var constructor = object.constructor;
        if (isCallable(constructor) && object instanceof constructor) {
          return constructor.prototype;
        }
        return object instanceof $Object ? ObjectPrototype : null;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-keys.js
  var require_object_keys = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-keys.js"(exports, module) {
      "use strict";
      var internalObjectKeys = require_object_keys_internal();
      var enumBugKeys = require_enum_bug_keys();
      module.exports = Object.keys || function keys(O) {
        return internalObjectKeys(O, enumBugKeys);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-define-properties.js
  var require_object_define_properties = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-define-properties.js"(exports) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var V8_PROTOTYPE_DEFINE_BUG = require_v8_prototype_define_bug();
      var definePropertyModule = require_object_define_property();
      var anObject = require_an_object();
      var toIndexedObject = require_to_indexed_object();
      var objectKeys = require_object_keys();
      exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
        anObject(O);
        var props = toIndexedObject(Properties);
        var keys = objectKeys(Properties);
        var length = keys.length;
        var index = 0;
        var key;
        while (length > index)
          definePropertyModule.f(O, key = keys[index++], props[key]);
        return O;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/html.js
  var require_html = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/html.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      module.exports = getBuiltIn("document", "documentElement");
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-create.js
  var require_object_create = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/object-create.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      var definePropertiesModule = require_object_define_properties();
      var enumBugKeys = require_enum_bug_keys();
      var hiddenKeys = require_hidden_keys();
      var html = require_html();
      var documentCreateElement = require_document_create_element();
      var sharedKey = require_shared_key();
      var GT = ">";
      var LT = "<";
      var PROTOTYPE = "prototype";
      var SCRIPT = "script";
      var IE_PROTO = sharedKey("IE_PROTO");
      var EmptyConstructor = function() {
      };
      var scriptTag = function(content) {
        return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
      };
      var NullProtoObjectViaActiveX = function(activeXDocument2) {
        activeXDocument2.write(scriptTag(""));
        activeXDocument2.close();
        var temp = activeXDocument2.parentWindow.Object;
        activeXDocument2 = null;
        return temp;
      };
      var NullProtoObjectViaIFrame = function() {
        var iframe = documentCreateElement("iframe");
        var JS = "java" + SCRIPT + ":";
        var iframeDocument;
        iframe.style.display = "none";
        html.appendChild(iframe);
        iframe.src = String(JS);
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(scriptTag("document.F=Object"));
        iframeDocument.close();
        return iframeDocument.F;
      };
      var activeXDocument;
      var NullProtoObject = function() {
        try {
          activeXDocument = new ActiveXObject("htmlfile");
        } catch (error) {
        }
        NullProtoObject = typeof document != "undefined" ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument);
        var length = enumBugKeys.length;
        while (length--)
          delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
        return NullProtoObject();
      };
      hiddenKeys[IE_PROTO] = true;
      module.exports = Object.create || function create(O, Properties) {
        var result;
        if (O !== null) {
          EmptyConstructor[PROTOTYPE] = anObject(O);
          result = new EmptyConstructor();
          EmptyConstructor[PROTOTYPE] = null;
          result[IE_PROTO] = O;
        } else
          result = NullProtoObject();
        return Properties === void 0 ? result : definePropertiesModule.f(result, Properties);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.suppressed-error.constructor.js
  var require_es_suppressed_error_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.suppressed-error.constructor.js"() {
      "use strict";
      var $ = require_export();
      var globalThis2 = require_global_this();
      var isPrototypeOf = require_object_is_prototype_of();
      var getPrototypeOf = require_object_get_prototype_of();
      var setPrototypeOf = require_object_set_prototype_of();
      var copyConstructorProperties = require_copy_constructor_properties();
      var create = require_object_create();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var createPropertyDescriptor = require_create_property_descriptor();
      var installErrorStack = require_error_stack_install();
      var normalizeStringArgument = require_normalize_string_argument();
      var wellKnownSymbol = require_well_known_symbol();
      var fails = require_fails();
      var IS_PURE = require_is_pure();
      var NativeSuppressedError = globalThis2.SuppressedError;
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var $Error = Error;
      var WRONG_ARITY = !!NativeSuppressedError && NativeSuppressedError.length !== 3;
      var EXTRA_ARGS_SUPPORT = !!NativeSuppressedError && fails(function() {
        return new NativeSuppressedError(1, 2, 3, { cause: 4 }).cause === 4;
      });
      var PATCH = WRONG_ARITY || EXTRA_ARGS_SUPPORT;
      var $SuppressedError = function SuppressedError2(error, suppressed, message) {
        var isInstance = isPrototypeOf(SuppressedErrorPrototype, this);
        var that;
        if (setPrototypeOf) {
          that = PATCH && (!isInstance || getPrototypeOf(this) === SuppressedErrorPrototype) ? new NativeSuppressedError() : setPrototypeOf(new $Error(), isInstance ? getPrototypeOf(this) : SuppressedErrorPrototype);
        } else {
          that = isInstance ? this : create(SuppressedErrorPrototype);
          createNonEnumerableProperty(that, TO_STRING_TAG, "Error");
        }
        if (message !== void 0)
          createNonEnumerableProperty(that, "message", normalizeStringArgument(message));
        installErrorStack(that, $SuppressedError, that.stack, 1);
        createNonEnumerableProperty(that, "error", error);
        createNonEnumerableProperty(that, "suppressed", suppressed);
        return that;
      };
      if (setPrototypeOf)
        setPrototypeOf($SuppressedError, $Error);
      else
        copyConstructorProperties($SuppressedError, $Error, { name: true });
      var SuppressedErrorPrototype = $SuppressedError.prototype = PATCH ? NativeSuppressedError.prototype : create($Error.prototype, {
        constructor: createPropertyDescriptor(1, $SuppressedError),
        message: createPropertyDescriptor(1, ""),
        name: createPropertyDescriptor(1, "SuppressedError")
      });
      if (PATCH && !IS_PURE)
        SuppressedErrorPrototype.constructor = $SuppressedError;
      $({ global: true, constructor: true, arity: 3, forced: PATCH }, {
        SuppressedError: $SuppressedError
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/an-instance.js
  var require_an_instance = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/an-instance.js"(exports, module) {
      "use strict";
      var isPrototypeOf = require_object_is_prototype_of();
      var $TypeError = TypeError;
      module.exports = function(it, Prototype) {
        if (isPrototypeOf(Prototype, it))
          return it;
        throw new $TypeError("Incorrect invocation");
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/define-built-ins.js
  var require_define_built_ins = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/define-built-ins.js"(exports, module) {
      "use strict";
      var defineBuiltIn = require_define_built_in();
      module.exports = function(target, src, options) {
        for (var key in src)
          defineBuiltIn(target, key, src[key], options);
        return target;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/define-built-in-accessor.js
  var require_define_built_in_accessor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/define-built-in-accessor.js"(exports, module) {
      "use strict";
      var makeBuiltIn = require_make_built_in();
      var defineProperty = require_object_define_property();
      module.exports = function(target, name, descriptor) {
        if (descriptor.get)
          makeBuiltIn(descriptor.get, name, { getter: true });
        if (descriptor.set)
          makeBuiltIn(descriptor.set, name, { setter: true });
        return defineProperty.f(target, name, descriptor);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-uncurry-this-clause.js
  var require_function_uncurry_this_clause = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-uncurry-this-clause.js"(exports, module) {
      "use strict";
      var classofRaw = require_classof_raw();
      var uncurryThis = require_function_uncurry_this();
      module.exports = function(fn) {
        if (classofRaw(fn) === "Function")
          return uncurryThis(fn);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-bind-context.js
  var require_function_bind_context = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/function-bind-context.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this_clause();
      var aCallable = require_a_callable();
      var NATIVE_BIND = require_function_bind_native();
      var bind = uncurryThis(uncurryThis.bind);
      module.exports = function(fn, that) {
        aCallable(fn);
        return that === void 0 ? fn : NATIVE_BIND ? bind(fn, that) : function() {
          return fn.apply(that, arguments);
        };
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/add-disposable-resource.js
  var require_add_disposable_resource = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/add-disposable-resource.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      var call = require_function_call();
      var uncurryThis = require_function_uncurry_this();
      var bind = require_function_bind_context();
      var anObject = require_an_object();
      var aCallable = require_a_callable();
      var isNullOrUndefined = require_is_null_or_undefined();
      var getMethod = require_get_method();
      var wellKnownSymbol = require_well_known_symbol();
      var ASYNC_DISPOSE = wellKnownSymbol("asyncDispose");
      var DISPOSE = wellKnownSymbol("dispose");
      var push = uncurryThis([].push);
      var getDisposeMethod = function(V, hint) {
        if (hint === "async-dispose") {
          var method = getMethod(V, ASYNC_DISPOSE);
          if (method !== void 0)
            return method;
          method = getMethod(V, DISPOSE);
          if (method === void 0)
            return method;
          return function() {
            var O = this;
            var Promise2 = getBuiltIn("Promise");
            return new Promise2(function(resolve) {
              call(method, O);
              resolve(void 0);
            });
          };
        }
        return getMethod(V, DISPOSE);
      };
      var createDisposableResource = function(V, hint, method) {
        if (arguments.length < 3 && !isNullOrUndefined(V)) {
          method = aCallable(getDisposeMethod(anObject(V), hint));
        }
        return method === void 0 ? function() {
          return void 0;
        } : bind(method, V);
      };
      module.exports = function(disposable, V, hint, method) {
        var resource;
        if (arguments.length < 4) {
          if (isNullOrUndefined(V) && hint === "sync-dispose")
            return;
          resource = createDisposableResource(V, hint);
        } else {
          resource = createDisposableResource(void 0, hint, method);
        }
        push(disposable.stack, resource);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.disposable-stack.constructor.js
  var require_es_disposable_stack_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.disposable-stack.constructor.js"() {
      "use strict";
      var $ = require_export();
      var DESCRIPTORS = require_descriptors();
      var getBuiltIn = require_get_built_in();
      var aCallable = require_a_callable();
      var anInstance = require_an_instance();
      var defineBuiltIn = require_define_built_in();
      var defineBuiltIns = require_define_built_ins();
      var defineBuiltInAccessor = require_define_built_in_accessor();
      var wellKnownSymbol = require_well_known_symbol();
      var InternalStateModule = require_internal_state();
      var addDisposableResource = require_add_disposable_resource();
      var SuppressedError2 = getBuiltIn("SuppressedError");
      var $ReferenceError = ReferenceError;
      var DISPOSE = wellKnownSymbol("dispose");
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var DISPOSABLE_STACK = "DisposableStack";
      var setInternalState = InternalStateModule.set;
      var getDisposableStackInternalState = InternalStateModule.getterFor(DISPOSABLE_STACK);
      var HINT = "sync-dispose";
      var DISPOSED = "disposed";
      var PENDING = "pending";
      var getPendingDisposableStackInternalState = function(stack) {
        var internalState = getDisposableStackInternalState(stack);
        if (internalState.state === DISPOSED)
          throw new $ReferenceError(DISPOSABLE_STACK + " already disposed");
        return internalState;
      };
      var $DisposableStack = function DisposableStack2() {
        setInternalState(anInstance(this, DisposableStackPrototype), {
          type: DISPOSABLE_STACK,
          state: PENDING,
          stack: []
        });
        if (!DESCRIPTORS)
          this.disposed = false;
      };
      var DisposableStackPrototype = $DisposableStack.prototype;
      defineBuiltIns(DisposableStackPrototype, {
        dispose: function dispose() {
          var internalState = getDisposableStackInternalState(this);
          if (internalState.state === DISPOSED)
            return;
          internalState.state = DISPOSED;
          if (!DESCRIPTORS)
            this.disposed = true;
          var stack = internalState.stack;
          var i = stack.length;
          var thrown = false;
          var suppressed;
          while (i) {
            var disposeMethod = stack[--i];
            stack[i] = null;
            try {
              disposeMethod();
            } catch (errorResult) {
              if (thrown) {
                suppressed = new SuppressedError2(errorResult, suppressed);
              } else {
                thrown = true;
                suppressed = errorResult;
              }
            }
          }
          internalState.stack = null;
          if (thrown)
            throw suppressed;
        },
        use: function use(value) {
          addDisposableResource(getPendingDisposableStackInternalState(this), value, HINT);
          return value;
        },
        adopt: function adopt(value, onDispose) {
          var internalState = getPendingDisposableStackInternalState(this);
          aCallable(onDispose);
          addDisposableResource(internalState, void 0, HINT, function() {
            onDispose(value);
          });
          return value;
        },
        defer: function defer(onDispose) {
          var internalState = getPendingDisposableStackInternalState(this);
          aCallable(onDispose);
          addDisposableResource(internalState, void 0, HINT, onDispose);
        },
        move: function move() {
          var internalState = getPendingDisposableStackInternalState(this);
          var newDisposableStack = new $DisposableStack();
          getDisposableStackInternalState(newDisposableStack).stack = internalState.stack;
          internalState.stack = [];
          internalState.state = DISPOSED;
          if (!DESCRIPTORS)
            this.disposed = true;
          return newDisposableStack;
        }
      });
      if (DESCRIPTORS)
        defineBuiltInAccessor(DisposableStackPrototype, "disposed", {
          configurable: true,
          get: function disposed() {
            return getDisposableStackInternalState(this).state === DISPOSED;
          }
        });
      defineBuiltIn(DisposableStackPrototype, DISPOSE, DisposableStackPrototype.dispose, { name: "dispose" });
      defineBuiltIn(DisposableStackPrototype, TO_STRING_TAG, DISPOSABLE_STACK, { nonWritable: true });
      $({ global: true, constructor: true }, {
        DisposableStack: $DisposableStack
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterators-core.js
  var require_iterators_core = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterators-core.js"(exports, module) {
      "use strict";
      var fails = require_fails();
      var isCallable = require_is_callable();
      var isObject = require_is_object();
      var create = require_object_create();
      var getPrototypeOf = require_object_get_prototype_of();
      var defineBuiltIn = require_define_built_in();
      var wellKnownSymbol = require_well_known_symbol();
      var IS_PURE = require_is_pure();
      var ITERATOR = wellKnownSymbol("iterator");
      var BUGGY_SAFARI_ITERATORS = false;
      var IteratorPrototype;
      var PrototypeOfArrayIteratorPrototype;
      var arrayIterator;
      if ([].keys) {
        arrayIterator = [].keys();
        if (!("next" in arrayIterator))
          BUGGY_SAFARI_ITERATORS = true;
        else {
          PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
          if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
            IteratorPrototype = PrototypeOfArrayIteratorPrototype;
        }
      }
      var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function() {
        var test = {};
        return IteratorPrototype[ITERATOR].call(test) !== test;
      });
      if (NEW_ITERATOR_PROTOTYPE)
        IteratorPrototype = {};
      else if (IS_PURE)
        IteratorPrototype = create(IteratorPrototype);
      if (!isCallable(IteratorPrototype[ITERATOR])) {
        defineBuiltIn(IteratorPrototype, ITERATOR, function() {
          return this;
        });
      }
      module.exports = {
        IteratorPrototype,
        BUGGY_SAFARI_ITERATORS
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.dispose.js
  var require_es_iterator_dispose = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.dispose.js"() {
      "use strict";
      var call = require_function_call();
      var defineBuiltIn = require_define_built_in();
      var getMethod = require_get_method();
      var hasOwn = require_has_own_property();
      var wellKnownSymbol = require_well_known_symbol();
      var IteratorPrototype = require_iterators_core().IteratorPrototype;
      var DISPOSE = wellKnownSymbol("dispose");
      if (!hasOwn(IteratorPrototype, DISPOSE)) {
        defineBuiltIn(IteratorPrototype, DISPOSE, function() {
          var $return = getMethod(this, "return");
          if ($return)
            call($return, this);
        });
      }
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/path.js
  var require_path = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/path.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      module.exports = globalThis2;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/es/disposable-stack/index.js
  var require_disposable_stack = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/es/disposable-stack/index.js"(exports, module) {
      "use strict";
      require_es_error_cause();
      require_es_error_to_string();
      require_es_object_to_string();
      require_es_suppressed_error_constructor();
      require_es_disposable_stack_constructor();
      require_es_iterator_dispose();
      var path = require_path();
      module.exports = path.DisposableStack;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/stable/disposable-stack/index.js
  var require_disposable_stack2 = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/stable/disposable-stack/index.js"(exports, module) {
      "use strict";
      var parent = require_disposable_stack();
      module.exports = parent;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.suppressed-error.constructor.js
  var require_esnext_suppressed_error_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.suppressed-error.constructor.js"() {
      "use strict";
      require_es_suppressed_error_constructor();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.disposable-stack.constructor.js
  var require_esnext_disposable_stack_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.disposable-stack.constructor.js"() {
      "use strict";
      require_es_disposable_stack_constructor();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.dispose.js
  var require_esnext_iterator_dispose = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.dispose.js"() {
      "use strict";
      require_es_iterator_dispose();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/actual/disposable-stack/index.js
  var require_disposable_stack3 = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/actual/disposable-stack/index.js"(exports, module) {
      "use strict";
      var parent = require_disposable_stack2();
      require_esnext_suppressed_error_constructor();
      require_esnext_disposable_stack_constructor();
      require_esnext_iterator_dispose();
      module.exports = parent;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/add-to-unscopables.js
  var require_add_to_unscopables = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/add-to-unscopables.js"(exports, module) {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      var create = require_object_create();
      var defineProperty = require_object_define_property().f;
      var UNSCOPABLES = wellKnownSymbol("unscopables");
      var ArrayPrototype = Array.prototype;
      if (ArrayPrototype[UNSCOPABLES] === void 0) {
        defineProperty(ArrayPrototype, UNSCOPABLES, {
          configurable: true,
          value: create(null)
        });
      }
      module.exports = function(key) {
        ArrayPrototype[UNSCOPABLES][key] = true;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterators.js
  var require_iterators = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterators.js"(exports, module) {
      "use strict";
      module.exports = {};
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/set-to-string-tag.js
  var require_set_to_string_tag = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/set-to-string-tag.js"(exports, module) {
      "use strict";
      var defineProperty = require_object_define_property().f;
      var hasOwn = require_has_own_property();
      var wellKnownSymbol = require_well_known_symbol();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      module.exports = function(target, TAG, STATIC) {
        if (target && !STATIC)
          target = target.prototype;
        if (target && !hasOwn(target, TO_STRING_TAG)) {
          defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-create-constructor.js
  var require_iterator_create_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-create-constructor.js"(exports, module) {
      "use strict";
      var IteratorPrototype = require_iterators_core().IteratorPrototype;
      var create = require_object_create();
      var createPropertyDescriptor = require_create_property_descriptor();
      var setToStringTag = require_set_to_string_tag();
      var Iterators = require_iterators();
      var returnThis = function() {
        return this;
      };
      module.exports = function(IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
        var TO_STRING_TAG = NAME + " Iterator";
        IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
        setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
        Iterators[TO_STRING_TAG] = returnThis;
        return IteratorConstructor;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-define.js
  var require_iterator_define = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-define.js"(exports, module) {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var IS_PURE = require_is_pure();
      var FunctionName = require_function_name();
      var isCallable = require_is_callable();
      var createIteratorConstructor = require_iterator_create_constructor();
      var getPrototypeOf = require_object_get_prototype_of();
      var setPrototypeOf = require_object_set_prototype_of();
      var setToStringTag = require_set_to_string_tag();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var defineBuiltIn = require_define_built_in();
      var wellKnownSymbol = require_well_known_symbol();
      var Iterators = require_iterators();
      var IteratorsCore = require_iterators_core();
      var PROPER_FUNCTION_NAME = FunctionName.PROPER;
      var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
      var IteratorPrototype = IteratorsCore.IteratorPrototype;
      var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
      var ITERATOR = wellKnownSymbol("iterator");
      var KEYS = "keys";
      var VALUES = "values";
      var ENTRIES = "entries";
      var returnThis = function() {
        return this;
      };
      module.exports = function(Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
        createIteratorConstructor(IteratorConstructor, NAME, next);
        var getIterationMethod = function(KIND) {
          if (KIND === DEFAULT && defaultIterator)
            return defaultIterator;
          if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype)
            return IterablePrototype[KIND];
          switch (KIND) {
            case KEYS:
              return function keys() {
                return new IteratorConstructor(this, KIND);
              };
            case VALUES:
              return function values() {
                return new IteratorConstructor(this, KIND);
              };
            case ENTRIES:
              return function entries() {
                return new IteratorConstructor(this, KIND);
              };
          }
          return function() {
            return new IteratorConstructor(this);
          };
        };
        var TO_STRING_TAG = NAME + " Iterator";
        var INCORRECT_VALUES_NAME = false;
        var IterablePrototype = Iterable.prototype;
        var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
        var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
        var anyNativeIterator = NAME === "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
        var CurrentIteratorPrototype, methods, KEY;
        if (anyNativeIterator) {
          CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
          if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
            if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
              if (setPrototypeOf) {
                setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
              } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
                defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
              }
            }
            setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
            if (IS_PURE)
              Iterators[TO_STRING_TAG] = returnThis;
          }
        }
        if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
          if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
            createNonEnumerableProperty(IterablePrototype, "name", VALUES);
          } else {
            INCORRECT_VALUES_NAME = true;
            defaultIterator = function values() {
              return call(nativeIterator, this);
            };
          }
        }
        if (DEFAULT) {
          methods = {
            values: getIterationMethod(VALUES),
            keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
            entries: getIterationMethod(ENTRIES)
          };
          if (FORCED)
            for (KEY in methods) {
              if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
              }
            }
          else
            $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
        }
        if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
          defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
        }
        Iterators[NAME] = defaultIterator;
        return methods;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/create-iter-result-object.js
  var require_create_iter_result_object = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/create-iter-result-object.js"(exports, module) {
      "use strict";
      module.exports = function(value, done) {
        return { value, done };
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.array.iterator.js
  var require_es_array_iterator = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.array.iterator.js"(exports, module) {
      "use strict";
      var toIndexedObject = require_to_indexed_object();
      var addToUnscopables = require_add_to_unscopables();
      var Iterators = require_iterators();
      var InternalStateModule = require_internal_state();
      var defineProperty = require_object_define_property().f;
      var defineIterator = require_iterator_define();
      var createIterResultObject = require_create_iter_result_object();
      var IS_PURE = require_is_pure();
      var DESCRIPTORS = require_descriptors();
      var ARRAY_ITERATOR = "Array Iterator";
      var setInternalState = InternalStateModule.set;
      var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);
      module.exports = defineIterator(Array, "Array", function(iterated, kind) {
        setInternalState(this, {
          type: ARRAY_ITERATOR,
          target: toIndexedObject(iterated),
          // target
          index: 0,
          // next index
          kind
          // kind
        });
      }, function() {
        var state = getInternalState(this);
        var target = state.target;
        var index = state.index++;
        if (!target || index >= target.length) {
          state.target = null;
          return createIterResultObject(void 0, true);
        }
        switch (state.kind) {
          case "keys":
            return createIterResultObject(index, false);
          case "values":
            return createIterResultObject(target[index], false);
        }
        return createIterResultObject([index, target[index]], false);
      }, "values");
      var values = Iterators.Arguments = Iterators.Array;
      addToUnscopables("keys");
      addToUnscopables("values");
      addToUnscopables("entries");
      if (!IS_PURE && DESCRIPTORS && values.name !== "values")
        try {
          defineProperty(values, "name", { value: "values" });
        } catch (error) {
        }
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/string-multibyte.js
  var require_string_multibyte = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/string-multibyte.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var toString = require_to_string();
      var requireObjectCoercible = require_require_object_coercible();
      var charAt = uncurryThis("".charAt);
      var charCodeAt = uncurryThis("".charCodeAt);
      var stringSlice = uncurryThis("".slice);
      var createMethod = function(CONVERT_TO_STRING) {
        return function($this, pos) {
          var S = toString(requireObjectCoercible($this));
          var position = toIntegerOrInfinity(pos);
          var size = S.length;
          var first, second;
          if (position < 0 || position >= size)
            return CONVERT_TO_STRING ? "" : void 0;
          first = charCodeAt(S, position);
          return first < 55296 || first > 56319 || position + 1 === size || (second = charCodeAt(S, position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? charAt(S, position) : first : CONVERT_TO_STRING ? stringSlice(S, position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
        };
      };
      module.exports = {
        // `String.prototype.codePointAt` method
        // https://tc39.es/ecma262/#sec-string.prototype.codepointat
        codeAt: createMethod(false),
        // `String.prototype.at` method
        // https://github.com/mathiasbynens/String.prototype.at
        charAt: createMethod(true)
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.string.iterator.js
  var require_es_string_iterator = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.string.iterator.js"() {
      "use strict";
      var charAt = require_string_multibyte().charAt;
      var toString = require_to_string();
      var InternalStateModule = require_internal_state();
      var defineIterator = require_iterator_define();
      var createIterResultObject = require_create_iter_result_object();
      var STRING_ITERATOR = "String Iterator";
      var setInternalState = InternalStateModule.set;
      var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
      defineIterator(String, "String", function(iterated) {
        setInternalState(this, {
          type: STRING_ITERATOR,
          string: toString(iterated),
          index: 0
        });
      }, function next() {
        var state = getInternalState(this);
        var string = state.string;
        var index = state.index;
        var point;
        if (index >= string.length)
          return createIterResultObject(void 0, true);
        point = charAt(string, index);
        state.index += point.length;
        return createIterResultObject(point, false);
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/create-property.js
  var require_create_property = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/create-property.js"(exports, module) {
      "use strict";
      var DESCRIPTORS = require_descriptors();
      var definePropertyModule = require_object_define_property();
      var createPropertyDescriptor = require_create_property_descriptor();
      module.exports = function(object, key, value) {
        if (DESCRIPTORS)
          definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
        else
          object[key] = value;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.constructor.js
  var require_es_iterator_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.constructor.js"() {
      "use strict";
      var $ = require_export();
      var globalThis2 = require_global_this();
      var anInstance = require_an_instance();
      var anObject = require_an_object();
      var isCallable = require_is_callable();
      var getPrototypeOf = require_object_get_prototype_of();
      var defineBuiltInAccessor = require_define_built_in_accessor();
      var createProperty = require_create_property();
      var fails = require_fails();
      var hasOwn = require_has_own_property();
      var wellKnownSymbol = require_well_known_symbol();
      var IteratorPrototype = require_iterators_core().IteratorPrototype;
      var DESCRIPTORS = require_descriptors();
      var IS_PURE = require_is_pure();
      var CONSTRUCTOR = "constructor";
      var ITERATOR = "Iterator";
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var $TypeError = TypeError;
      var NativeIterator = globalThis2[ITERATOR];
      var FORCED = IS_PURE || !isCallable(NativeIterator) || NativeIterator.prototype !== IteratorPrototype || !fails(function() {
        NativeIterator({});
      });
      var IteratorConstructor = function Iterator2() {
        anInstance(this, IteratorPrototype);
        if (getPrototypeOf(this) === IteratorPrototype)
          throw new $TypeError("Abstract class Iterator not directly constructable");
      };
      var defineIteratorPrototypeAccessor = function(key, value) {
        if (DESCRIPTORS) {
          defineBuiltInAccessor(IteratorPrototype, key, {
            configurable: true,
            get: function() {
              return value;
            },
            set: function(replacement) {
              anObject(this);
              if (this === IteratorPrototype)
                throw new $TypeError("You can't redefine this property");
              if (hasOwn(this, key))
                this[key] = replacement;
              else
                createProperty(this, key, replacement);
            }
          });
        } else
          IteratorPrototype[key] = value;
      };
      if (!hasOwn(IteratorPrototype, TO_STRING_TAG))
        defineIteratorPrototypeAccessor(TO_STRING_TAG, ITERATOR);
      if (FORCED || !hasOwn(IteratorPrototype, CONSTRUCTOR) || IteratorPrototype[CONSTRUCTOR] === Object) {
        defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor);
      }
      IteratorConstructor.prototype = IteratorPrototype;
      $({ global: true, constructor: true, forced: FORCED }, {
        Iterator: IteratorConstructor
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-iterator-direct.js
  var require_get_iterator_direct = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-iterator-direct.js"(exports, module) {
      "use strict";
      module.exports = function(obj) {
        return {
          iterator: obj,
          next: obj.next,
          done: false
        };
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/not-a-nan.js
  var require_not_a_nan = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/not-a-nan.js"(exports, module) {
      "use strict";
      var $RangeError = RangeError;
      module.exports = function(it) {
        if (it === it)
          return it;
        throw new $RangeError("NaN is not allowed");
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-positive-integer.js
  var require_to_positive_integer = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/to-positive-integer.js"(exports, module) {
      "use strict";
      var toIntegerOrInfinity = require_to_integer_or_infinity();
      var $RangeError = RangeError;
      module.exports = function(it) {
        var result = toIntegerOrInfinity(it);
        if (result < 0)
          throw new $RangeError("The argument can't be less than 0");
        return result;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-close.js
  var require_iterator_close = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-close.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var anObject = require_an_object();
      var getMethod = require_get_method();
      module.exports = function(iterator, kind, value) {
        var innerResult, innerError;
        anObject(iterator);
        try {
          innerResult = getMethod(iterator, "return");
          if (!innerResult) {
            if (kind === "throw")
              throw value;
            return value;
          }
          innerResult = call(innerResult, iterator);
        } catch (error) {
          innerError = true;
          innerResult = error;
        }
        if (kind === "throw")
          throw value;
        if (innerError)
          throw innerResult;
        anObject(innerResult);
        return value;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-close-all.js
  var require_iterator_close_all = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-close-all.js"(exports, module) {
      "use strict";
      var iteratorClose = require_iterator_close();
      module.exports = function(iters, kind, value) {
        for (var i = iters.length - 1; i >= 0; i--) {
          if (iters[i] === void 0)
            continue;
          try {
            value = iteratorClose(iters[i].iterator, kind, value);
          } catch (error) {
            kind = "throw";
            value = error;
          }
        }
        if (kind === "throw")
          throw value;
        return value;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-create-proxy.js
  var require_iterator_create_proxy = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-create-proxy.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var create = require_object_create();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var defineBuiltIns = require_define_built_ins();
      var wellKnownSymbol = require_well_known_symbol();
      var InternalStateModule = require_internal_state();
      var getMethod = require_get_method();
      var IteratorPrototype = require_iterators_core().IteratorPrototype;
      var createIterResultObject = require_create_iter_result_object();
      var iteratorClose = require_iterator_close();
      var iteratorCloseAll = require_iterator_close_all();
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var ITERATOR_HELPER = "IteratorHelper";
      var WRAP_FOR_VALID_ITERATOR = "WrapForValidIterator";
      var NORMAL = "normal";
      var THROW = "throw";
      var setInternalState = InternalStateModule.set;
      var createIteratorProxyPrototype = function(IS_ITERATOR) {
        var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);
        return defineBuiltIns(create(IteratorPrototype), {
          next: function next() {
            var state = getInternalState(this);
            if (IS_ITERATOR)
              return state.nextHandler();
            if (state.done)
              return createIterResultObject(void 0, true);
            try {
              var result = state.nextHandler();
              return state.returnHandlerResult ? result : createIterResultObject(result, state.done);
            } catch (error) {
              state.done = true;
              throw error;
            }
          },
          "return": function() {
            var state = getInternalState(this);
            var iterator = state.iterator;
            state.done = true;
            if (IS_ITERATOR) {
              var returnMethod = getMethod(iterator, "return");
              return returnMethod ? call(returnMethod, iterator) : createIterResultObject(void 0, true);
            }
            if (state.inner)
              try {
                iteratorClose(state.inner.iterator, NORMAL);
              } catch (error) {
                return iteratorClose(iterator, THROW, error);
              }
            if (state.openIters)
              try {
                iteratorCloseAll(state.openIters, NORMAL);
              } catch (error) {
                return iteratorClose(iterator, THROW, error);
              }
            if (iterator)
              iteratorClose(iterator, NORMAL);
            return createIterResultObject(void 0, true);
          }
        });
      };
      var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
      var IteratorHelperPrototype = createIteratorProxyPrototype(false);
      createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, "Iterator Helper");
      module.exports = function(nextHandler, IS_ITERATOR, RETURN_HANDLER_RESULT) {
        var IteratorProxy = function Iterator2(record, state) {
          if (state) {
            state.iterator = record.iterator;
            state.next = record.next;
          } else
            state = record;
          state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
          state.returnHandlerResult = !!RETURN_HANDLER_RESULT;
          state.nextHandler = nextHandler;
          state.counter = 0;
          state.done = false;
          setInternalState(this, state);
        };
        IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;
        return IteratorProxy;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-helper-throws-on-invalid-iterator.js
  var require_iterator_helper_throws_on_invalid_iterator = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-helper-throws-on-invalid-iterator.js"(exports, module) {
      "use strict";
      module.exports = function(methodName, argument) {
        var method = typeof Iterator == "function" && Iterator.prototype[methodName];
        if (method)
          try {
            method.call({ next: null }, argument).next();
          } catch (error) {
            return true;
          }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-helper-without-closing-on-early-error.js
  var require_iterator_helper_without_closing_on_early_error = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterator-helper-without-closing-on-early-error.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      module.exports = function(METHOD_NAME, ExpectedError) {
        var Iterator2 = globalThis2.Iterator;
        var IteratorPrototype = Iterator2 && Iterator2.prototype;
        var method = IteratorPrototype && IteratorPrototype[METHOD_NAME];
        var CLOSED = false;
        if (method)
          try {
            method.call({
              next: function() {
                return { done: true };
              },
              "return": function() {
                CLOSED = true;
              }
            }, -1);
          } catch (error) {
            if (!(error instanceof ExpectedError))
              CLOSED = false;
          }
        if (!CLOSED)
          return method;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.drop.js
  var require_es_iterator_drop = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.drop.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var notANaN = require_not_a_nan();
      var toPositiveInteger = require_to_positive_integer();
      var iteratorClose = require_iterator_close();
      var createIteratorProxy = require_iterator_create_proxy();
      var iteratorHelperThrowsOnInvalidIterator = require_iterator_helper_throws_on_invalid_iterator();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var IS_PURE = require_is_pure();
      var DROP_WITHOUT_THROWING_ON_INVALID_ITERATOR = !IS_PURE && !iteratorHelperThrowsOnInvalidIterator("drop", 0);
      var dropWithoutClosingOnEarlyError = !IS_PURE && !DROP_WITHOUT_THROWING_ON_INVALID_ITERATOR && iteratorHelperWithoutClosingOnEarlyError("drop", RangeError);
      var FORCED = IS_PURE || DROP_WITHOUT_THROWING_ON_INVALID_ITERATOR || dropWithoutClosingOnEarlyError;
      var IteratorProxy = createIteratorProxy(function() {
        var iterator = this.iterator;
        var next = this.next;
        var result, done;
        while (this.remaining) {
          this.remaining--;
          result = anObject(call(next, iterator));
          done = this.done = !!result.done;
          if (done)
            return;
        }
        result = anObject(call(next, iterator));
        done = this.done = !!result.done;
        if (!done)
          return result.value;
      });
      $({ target: "Iterator", proto: true, real: true, forced: FORCED }, {
        drop: function drop(limit) {
          anObject(this);
          var remaining;
          try {
            remaining = toPositiveInteger(notANaN(+limit));
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (dropWithoutClosingOnEarlyError)
            return call(dropWithoutClosingOnEarlyError, this, remaining);
          return new IteratorProxy(getIteratorDirect(this), {
            remaining
          });
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-array-iterator-method.js
  var require_is_array_iterator_method = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-array-iterator-method.js"(exports, module) {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      var Iterators = require_iterators();
      var ITERATOR = wellKnownSymbol("iterator");
      var ArrayPrototype = Array.prototype;
      module.exports = function(it) {
        return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-iterator-method.js
  var require_get_iterator_method = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-iterator-method.js"(exports, module) {
      "use strict";
      var classof = require_classof();
      var getMethod = require_get_method();
      var isNullOrUndefined = require_is_null_or_undefined();
      var Iterators = require_iterators();
      var wellKnownSymbol = require_well_known_symbol();
      var ITERATOR = wellKnownSymbol("iterator");
      module.exports = function(it) {
        if (!isNullOrUndefined(it))
          return getMethod(it, ITERATOR) || getMethod(it, "@@iterator") || Iterators[classof(it)];
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-iterator.js
  var require_get_iterator = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-iterator.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var tryToString = require_try_to_string();
      var getIteratorMethod = require_get_iterator_method();
      var $TypeError = TypeError;
      module.exports = function(argument, usingIterator) {
        var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
        if (aCallable(iteratorMethod))
          return anObject(call(iteratorMethod, argument));
        throw new $TypeError(tryToString(argument) + " is not iterable");
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterate.js
  var require_iterate = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/iterate.js"(exports, module) {
      "use strict";
      var bind = require_function_bind_context();
      var call = require_function_call();
      var anObject = require_an_object();
      var tryToString = require_try_to_string();
      var isArrayIteratorMethod = require_is_array_iterator_method();
      var lengthOfArrayLike = require_length_of_array_like();
      var isPrototypeOf = require_object_is_prototype_of();
      var getIterator = require_get_iterator();
      var getIteratorMethod = require_get_iterator_method();
      var iteratorClose = require_iterator_close();
      var $TypeError = TypeError;
      var Result = function(stopped, result) {
        this.stopped = stopped;
        this.result = result;
      };
      var ResultPrototype = Result.prototype;
      module.exports = function(iterable, unboundFunction, options) {
        var that = options && options.that;
        var AS_ENTRIES = !!(options && options.AS_ENTRIES);
        var IS_RECORD = !!(options && options.IS_RECORD);
        var IS_ITERATOR = !!(options && options.IS_ITERATOR);
        var INTERRUPTED = !!(options && options.INTERRUPTED);
        var fn = bind(unboundFunction, that);
        var iterator, iterFn, index, length, result, next, step;
        var stop = function(condition) {
          if (iterator)
            iteratorClose(iterator, "normal");
          return new Result(true, condition);
        };
        var callFn = function(value) {
          if (AS_ENTRIES) {
            anObject(value);
            return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
          }
          return INTERRUPTED ? fn(value, stop) : fn(value);
        };
        if (IS_RECORD) {
          iterator = iterable.iterator;
        } else if (IS_ITERATOR) {
          iterator = iterable;
        } else {
          iterFn = getIteratorMethod(iterable);
          if (!iterFn)
            throw new $TypeError(tryToString(iterable) + " is not iterable");
          if (isArrayIteratorMethod(iterFn)) {
            for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
              result = callFn(iterable[index]);
              if (result && isPrototypeOf(ResultPrototype, result))
                return result;
            }
            return new Result(false);
          }
          iterator = getIterator(iterable, iterFn);
        }
        next = IS_RECORD ? iterable.next : iterator.next;
        while (!(step = call(next, iterator)).done) {
          try {
            result = callFn(step.value);
          } catch (error) {
            iteratorClose(iterator, "throw", error);
          }
          if (typeof result == "object" && result && isPrototypeOf(ResultPrototype, result))
            return result;
        }
        return new Result(false);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.every.js
  var require_es_iterator_every = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.every.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var iterate = require_iterate();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var iteratorClose = require_iterator_close();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var everyWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError("every", TypeError);
      $({ target: "Iterator", proto: true, real: true, forced: everyWithoutClosingOnEarlyError }, {
        every: function every(predicate) {
          anObject(this);
          try {
            aCallable(predicate);
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (everyWithoutClosingOnEarlyError)
            return call(everyWithoutClosingOnEarlyError, this, predicate);
          var record = getIteratorDirect(this);
          var counter = 0;
          return !iterate(record, function(value, stop) {
            if (!predicate(value, counter++))
              return stop();
          }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/call-with-safe-iteration-closing.js
  var require_call_with_safe_iteration_closing = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/call-with-safe-iteration-closing.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      var iteratorClose = require_iterator_close();
      module.exports = function(iterator, fn, value, ENTRIES) {
        try {
          return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
        } catch (error) {
          iteratorClose(iterator, "throw", error);
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.filter.js
  var require_es_iterator_filter = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.filter.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var createIteratorProxy = require_iterator_create_proxy();
      var callWithSafeIterationClosing = require_call_with_safe_iteration_closing();
      var IS_PURE = require_is_pure();
      var iteratorClose = require_iterator_close();
      var iteratorHelperThrowsOnInvalidIterator = require_iterator_helper_throws_on_invalid_iterator();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR = !IS_PURE && !iteratorHelperThrowsOnInvalidIterator("filter", function() {
      });
      var filterWithoutClosingOnEarlyError = !IS_PURE && !FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR && iteratorHelperWithoutClosingOnEarlyError("filter", TypeError);
      var FORCED = IS_PURE || FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR || filterWithoutClosingOnEarlyError;
      var IteratorProxy = createIteratorProxy(function() {
        var iterator = this.iterator;
        var predicate = this.predicate;
        var next = this.next;
        var result, done, value;
        while (true) {
          result = anObject(call(next, iterator));
          done = this.done = !!result.done;
          if (done)
            return;
          value = result.value;
          if (callWithSafeIterationClosing(iterator, predicate, [value, this.counter++], true))
            return value;
        }
      });
      $({ target: "Iterator", proto: true, real: true, forced: FORCED }, {
        filter: function filter(predicate) {
          anObject(this);
          try {
            aCallable(predicate);
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (filterWithoutClosingOnEarlyError)
            return call(filterWithoutClosingOnEarlyError, this, predicate);
          return new IteratorProxy(getIteratorDirect(this), {
            predicate
          });
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.find.js
  var require_es_iterator_find = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.find.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var iterate = require_iterate();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var iteratorClose = require_iterator_close();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var findWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError("find", TypeError);
      $({ target: "Iterator", proto: true, real: true, forced: findWithoutClosingOnEarlyError }, {
        find: function find(predicate) {
          anObject(this);
          try {
            aCallable(predicate);
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (findWithoutClosingOnEarlyError)
            return call(findWithoutClosingOnEarlyError, this, predicate);
          var record = getIteratorDirect(this);
          var counter = 0;
          return iterate(record, function(value, stop) {
            if (predicate(value, counter++))
              return stop(value);
          }, { IS_RECORD: true, INTERRUPTED: true }).result;
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-iterator-flattenable.js
  var require_get_iterator_flattenable = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/get-iterator-flattenable.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var getIteratorMethod = require_get_iterator_method();
      module.exports = function(obj, stringHandling) {
        if (!stringHandling || typeof obj !== "string")
          anObject(obj);
        var method = getIteratorMethod(obj);
        return getIteratorDirect(anObject(method !== void 0 ? call(method, obj) : obj));
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.flat-map.js
  var require_es_iterator_flat_map = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.flat-map.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var getIteratorFlattenable = require_get_iterator_flattenable();
      var createIteratorProxy = require_iterator_create_proxy();
      var iteratorClose = require_iterator_close();
      var IS_PURE = require_is_pure();
      var iteratorHelperThrowsOnInvalidIterator = require_iterator_helper_throws_on_invalid_iterator();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var FLAT_MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR = !IS_PURE && !iteratorHelperThrowsOnInvalidIterator("flatMap", function() {
      });
      var flatMapWithoutClosingOnEarlyError = !IS_PURE && !FLAT_MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR && iteratorHelperWithoutClosingOnEarlyError("flatMap", TypeError);
      var FORCED = IS_PURE || FLAT_MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR || flatMapWithoutClosingOnEarlyError;
      var IteratorProxy = createIteratorProxy(function() {
        var iterator = this.iterator;
        var mapper = this.mapper;
        var result, inner;
        while (true) {
          if (inner = this.inner)
            try {
              result = anObject(call(inner.next, inner.iterator));
              if (!result.done)
                return result.value;
              this.inner = null;
            } catch (error) {
              iteratorClose(iterator, "throw", error);
            }
          result = anObject(call(this.next, iterator));
          if (this.done = !!result.done)
            return;
          try {
            this.inner = getIteratorFlattenable(mapper(result.value, this.counter++), false);
          } catch (error) {
            iteratorClose(iterator, "throw", error);
          }
        }
      });
      $({ target: "Iterator", proto: true, real: true, forced: FORCED }, {
        flatMap: function flatMap(mapper) {
          anObject(this);
          try {
            aCallable(mapper);
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (flatMapWithoutClosingOnEarlyError)
            return call(flatMapWithoutClosingOnEarlyError, this, mapper);
          return new IteratorProxy(getIteratorDirect(this), {
            mapper,
            inner: null
          });
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.for-each.js
  var require_es_iterator_for_each = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.for-each.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var iterate = require_iterate();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var iteratorClose = require_iterator_close();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var forEachWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError("forEach", TypeError);
      $({ target: "Iterator", proto: true, real: true, forced: forEachWithoutClosingOnEarlyError }, {
        forEach: function forEach(fn) {
          anObject(this);
          try {
            aCallable(fn);
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (forEachWithoutClosingOnEarlyError)
            return call(forEachWithoutClosingOnEarlyError, this, fn);
          var record = getIteratorDirect(this);
          var counter = 0;
          iterate(record, function(value) {
            fn(value, counter++);
          }, { IS_RECORD: true });
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.from.js
  var require_es_iterator_from = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.from.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var toObject = require_to_object();
      var isPrototypeOf = require_object_is_prototype_of();
      var IteratorPrototype = require_iterators_core().IteratorPrototype;
      var createIteratorProxy = require_iterator_create_proxy();
      var getIteratorFlattenable = require_get_iterator_flattenable();
      var IS_PURE = require_is_pure();
      var FORCED = IS_PURE || function() {
        try {
          Iterator.from({ "return": null })["return"]();
        } catch (error) {
          return true;
        }
      }();
      var IteratorProxy = createIteratorProxy(function() {
        return call(this.next, this.iterator);
      }, true);
      $({ target: "Iterator", stat: true, forced: FORCED }, {
        from: function from(O) {
          var iteratorRecord = getIteratorFlattenable(typeof O == "string" ? toObject(O) : O, true);
          return isPrototypeOf(IteratorPrototype, iteratorRecord.iterator) ? iteratorRecord.iterator : new IteratorProxy(iteratorRecord);
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.map.js
  var require_es_iterator_map = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.map.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var createIteratorProxy = require_iterator_create_proxy();
      var callWithSafeIterationClosing = require_call_with_safe_iteration_closing();
      var iteratorClose = require_iterator_close();
      var iteratorHelperThrowsOnInvalidIterator = require_iterator_helper_throws_on_invalid_iterator();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var IS_PURE = require_is_pure();
      var MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR = !IS_PURE && !iteratorHelperThrowsOnInvalidIterator("map", function() {
      });
      var mapWithoutClosingOnEarlyError = !IS_PURE && !MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR && iteratorHelperWithoutClosingOnEarlyError("map", TypeError);
      var FORCED = IS_PURE || MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR || mapWithoutClosingOnEarlyError;
      var IteratorProxy = createIteratorProxy(function() {
        var iterator = this.iterator;
        var result = anObject(call(this.next, iterator));
        var done = this.done = !!result.done;
        if (!done)
          return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
      });
      $({ target: "Iterator", proto: true, real: true, forced: FORCED }, {
        map: function map(mapper) {
          anObject(this);
          try {
            aCallable(mapper);
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (mapWithoutClosingOnEarlyError)
            return call(mapWithoutClosingOnEarlyError, this, mapper);
          return new IteratorProxy(getIteratorDirect(this), {
            mapper
          });
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.reduce.js
  var require_es_iterator_reduce = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.reduce.js"() {
      "use strict";
      var $ = require_export();
      var iterate = require_iterate();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var iteratorClose = require_iterator_close();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var apply = require_function_apply();
      var fails = require_fails();
      var $TypeError = TypeError;
      var FAILS_ON_INITIAL_UNDEFINED = fails(function() {
        [].keys().reduce(function() {
        }, void 0);
      });
      var reduceWithoutClosingOnEarlyError = !FAILS_ON_INITIAL_UNDEFINED && iteratorHelperWithoutClosingOnEarlyError("reduce", $TypeError);
      $({ target: "Iterator", proto: true, real: true, forced: FAILS_ON_INITIAL_UNDEFINED || reduceWithoutClosingOnEarlyError }, {
        reduce: function reduce(reducer) {
          anObject(this);
          try {
            aCallable(reducer);
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          var noInitial = arguments.length < 2;
          var accumulator = noInitial ? void 0 : arguments[1];
          if (reduceWithoutClosingOnEarlyError) {
            return apply(reduceWithoutClosingOnEarlyError, this, noInitial ? [reducer] : [reducer, accumulator]);
          }
          var record = getIteratorDirect(this);
          var counter = 0;
          iterate(record, function(value) {
            if (noInitial) {
              noInitial = false;
              accumulator = value;
            } else {
              accumulator = reducer(accumulator, value, counter);
            }
            counter++;
          }, { IS_RECORD: true });
          if (noInitial)
            throw new $TypeError("Reduce of empty iterator with no initial value");
          return accumulator;
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.some.js
  var require_es_iterator_some = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.some.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var iterate = require_iterate();
      var aCallable = require_a_callable();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var iteratorClose = require_iterator_close();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var someWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError("some", TypeError);
      $({ target: "Iterator", proto: true, real: true, forced: someWithoutClosingOnEarlyError }, {
        some: function some(predicate) {
          anObject(this);
          try {
            aCallable(predicate);
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (someWithoutClosingOnEarlyError)
            return call(someWithoutClosingOnEarlyError, this, predicate);
          var record = getIteratorDirect(this);
          var counter = 0;
          return iterate(record, function(value, stop) {
            if (predicate(value, counter++))
              return stop();
          }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.take.js
  var require_es_iterator_take = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.take.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var anObject = require_an_object();
      var getIteratorDirect = require_get_iterator_direct();
      var notANaN = require_not_a_nan();
      var toPositiveInteger = require_to_positive_integer();
      var createIteratorProxy = require_iterator_create_proxy();
      var iteratorClose = require_iterator_close();
      var iteratorHelperWithoutClosingOnEarlyError = require_iterator_helper_without_closing_on_early_error();
      var IS_PURE = require_is_pure();
      var takeWithoutClosingOnEarlyError = !IS_PURE && iteratorHelperWithoutClosingOnEarlyError("take", RangeError);
      var IteratorProxy = createIteratorProxy(function() {
        var iterator = this.iterator;
        if (!this.remaining--) {
          this.done = true;
          return iteratorClose(iterator, "normal", void 0);
        }
        var result = anObject(call(this.next, iterator));
        var done = this.done = !!result.done;
        if (!done)
          return result.value;
      });
      $({ target: "Iterator", proto: true, real: true, forced: IS_PURE || takeWithoutClosingOnEarlyError }, {
        take: function take(limit) {
          anObject(this);
          var remaining;
          try {
            remaining = toPositiveInteger(notANaN(+limit));
          } catch (error) {
            iteratorClose(this, "throw", error);
          }
          if (takeWithoutClosingOnEarlyError)
            return call(takeWithoutClosingOnEarlyError, this, remaining);
          return new IteratorProxy(getIteratorDirect(this), {
            remaining
          });
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.to-array.js
  var require_es_iterator_to_array = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.iterator.to-array.js"() {
      "use strict";
      var $ = require_export();
      var anObject = require_an_object();
      var iterate = require_iterate();
      var getIteratorDirect = require_get_iterator_direct();
      var push = [].push;
      $({ target: "Iterator", proto: true, real: true }, {
        toArray: function toArray() {
          var result = [];
          iterate(getIteratorDirect(anObject(this)), push, { that: result, IS_RECORD: true });
          return result;
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/es/iterator/index.js
  var require_iterator = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/es/iterator/index.js"(exports, module) {
      "use strict";
      require_es_array_iterator();
      require_es_object_to_string();
      require_es_string_iterator();
      require_es_iterator_constructor();
      require_es_iterator_dispose();
      require_es_iterator_drop();
      require_es_iterator_every();
      require_es_iterator_filter();
      require_es_iterator_find();
      require_es_iterator_flat_map();
      require_es_iterator_for_each();
      require_es_iterator_from();
      require_es_iterator_map();
      require_es_iterator_reduce();
      require_es_iterator_some();
      require_es_iterator_take();
      require_es_iterator_to_array();
      var path = require_path();
      module.exports = path.Iterator;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/dom-iterables.js
  var require_dom_iterables = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/dom-iterables.js"(exports, module) {
      "use strict";
      module.exports = {
        CSSRuleList: 0,
        CSSStyleDeclaration: 0,
        CSSValueList: 0,
        ClientRectList: 0,
        DOMRectList: 0,
        DOMStringList: 0,
        DOMTokenList: 1,
        DataTransferItemList: 0,
        FileList: 0,
        HTMLAllCollection: 0,
        HTMLCollection: 0,
        HTMLFormElement: 0,
        HTMLSelectElement: 0,
        MediaList: 0,
        MimeTypeArray: 0,
        NamedNodeMap: 0,
        NodeList: 1,
        PaintRequestList: 0,
        Plugin: 0,
        PluginArray: 0,
        SVGLengthList: 0,
        SVGNumberList: 0,
        SVGPathSegList: 0,
        SVGPointList: 0,
        SVGStringList: 0,
        SVGTransformList: 0,
        SourceBufferList: 0,
        StyleSheetList: 0,
        TextTrackCueList: 0,
        TextTrackList: 0,
        TouchList: 0
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/dom-token-list-prototype.js
  var require_dom_token_list_prototype = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/dom-token-list-prototype.js"(exports, module) {
      "use strict";
      var documentCreateElement = require_document_create_element();
      var classList = documentCreateElement("span").classList;
      var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;
      module.exports = DOMTokenListPrototype === Object.prototype ? void 0 : DOMTokenListPrototype;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/web.dom-collections.iterator.js
  var require_web_dom_collections_iterator = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/web.dom-collections.iterator.js"() {
      "use strict";
      var globalThis2 = require_global_this();
      var DOMIterables = require_dom_iterables();
      var DOMTokenListPrototype = require_dom_token_list_prototype();
      var ArrayIteratorMethods = require_es_array_iterator();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var setToStringTag = require_set_to_string_tag();
      var wellKnownSymbol = require_well_known_symbol();
      var ITERATOR = wellKnownSymbol("iterator");
      var ArrayValues = ArrayIteratorMethods.values;
      var handlePrototype = function(CollectionPrototype, COLLECTION_NAME2) {
        if (CollectionPrototype) {
          if (CollectionPrototype[ITERATOR] !== ArrayValues)
            try {
              createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
            } catch (error) {
              CollectionPrototype[ITERATOR] = ArrayValues;
            }
          setToStringTag(CollectionPrototype, COLLECTION_NAME2, true);
          if (DOMIterables[COLLECTION_NAME2])
            for (var METHOD_NAME in ArrayIteratorMethods) {
              if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME])
                try {
                  createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
                } catch (error) {
                  CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
                }
            }
        }
      };
      for (COLLECTION_NAME in DOMIterables) {
        handlePrototype(globalThis2[COLLECTION_NAME] && globalThis2[COLLECTION_NAME].prototype, COLLECTION_NAME);
      }
      var COLLECTION_NAME;
      handlePrototype(DOMTokenListPrototype, "DOMTokenList");
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/stable/iterator/index.js
  var require_iterator2 = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/stable/iterator/index.js"(exports, module) {
      "use strict";
      var parent = require_iterator();
      require_web_dom_collections_iterator();
      module.exports = parent;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment.js
  var require_environment = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var userAgent = require_environment_user_agent();
      var classof = require_classof_raw();
      var userAgentStartsWith = function(string) {
        return userAgent.slice(0, string.length) === string;
      };
      module.exports = function() {
        if (userAgentStartsWith("Bun/"))
          return "BUN";
        if (userAgentStartsWith("Cloudflare-Workers"))
          return "CLOUDFLARE";
        if (userAgentStartsWith("Deno/"))
          return "DENO";
        if (userAgentStartsWith("Node.js/"))
          return "NODE";
        if (globalThis2.Bun && typeof Bun.version == "string")
          return "BUN";
        if (globalThis2.Deno && typeof Deno.version == "object")
          return "DENO";
        if (classof(globalThis2.process) === "process")
          return "NODE";
        if (globalThis2.window && globalThis2.document)
          return "BROWSER";
        return "REST";
      }();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-is-node.js
  var require_environment_is_node = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-is-node.js"(exports, module) {
      "use strict";
      var ENVIRONMENT = require_environment();
      module.exports = ENVIRONMENT === "NODE";
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/set-species.js
  var require_set_species = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/set-species.js"(exports, module) {
      "use strict";
      var getBuiltIn = require_get_built_in();
      var defineBuiltInAccessor = require_define_built_in_accessor();
      var wellKnownSymbol = require_well_known_symbol();
      var DESCRIPTORS = require_descriptors();
      var SPECIES = wellKnownSymbol("species");
      module.exports = function(CONSTRUCTOR_NAME) {
        var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
        if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
          defineBuiltInAccessor(Constructor, SPECIES, {
            configurable: true,
            get: function() {
              return this;
            }
          });
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-constructor.js
  var require_is_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/is-constructor.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      var fails = require_fails();
      var isCallable = require_is_callable();
      var classof = require_classof();
      var getBuiltIn = require_get_built_in();
      var inspectSource = require_inspect_source();
      var noop = function() {
      };
      var construct = getBuiltIn("Reflect", "construct");
      var constructorRegExp = /^\s*(?:class|function)\b/;
      var exec = uncurryThis(constructorRegExp.exec);
      var INCORRECT_TO_STRING = !constructorRegExp.test(noop);
      var isConstructorModern = function isConstructor(argument) {
        if (!isCallable(argument))
          return false;
        try {
          construct(noop, [], argument);
          return true;
        } catch (error) {
          return false;
        }
      };
      var isConstructorLegacy = function isConstructor(argument) {
        if (!isCallable(argument))
          return false;
        switch (classof(argument)) {
          case "AsyncFunction":
          case "GeneratorFunction":
          case "AsyncGeneratorFunction":
            return false;
        }
        try {
          return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
        } catch (error) {
          return true;
        }
      };
      isConstructorLegacy.sham = true;
      module.exports = !construct || fails(function() {
        var called;
        return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function() {
          called = true;
        }) || called;
      }) ? isConstructorLegacy : isConstructorModern;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/a-constructor.js
  var require_a_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/a-constructor.js"(exports, module) {
      "use strict";
      var isConstructor = require_is_constructor();
      var tryToString = require_try_to_string();
      var $TypeError = TypeError;
      module.exports = function(argument) {
        if (isConstructor(argument))
          return argument;
        throw new $TypeError(tryToString(argument) + " is not a constructor");
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/species-constructor.js
  var require_species_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/species-constructor.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      var aConstructor = require_a_constructor();
      var isNullOrUndefined = require_is_null_or_undefined();
      var wellKnownSymbol = require_well_known_symbol();
      var SPECIES = wellKnownSymbol("species");
      module.exports = function(O, defaultConstructor) {
        var C = anObject(O).constructor;
        var S;
        return C === void 0 || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/array-slice.js
  var require_array_slice = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/array-slice.js"(exports, module) {
      "use strict";
      var uncurryThis = require_function_uncurry_this();
      module.exports = uncurryThis([].slice);
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/validate-arguments-length.js
  var require_validate_arguments_length = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/validate-arguments-length.js"(exports, module) {
      "use strict";
      var $TypeError = TypeError;
      module.exports = function(passed, required) {
        if (passed < required)
          throw new $TypeError("Not enough arguments");
        return passed;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-is-ios.js
  var require_environment_is_ios = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-is-ios.js"(exports, module) {
      "use strict";
      var userAgent = require_environment_user_agent();
      module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/task.js
  var require_task = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/task.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var apply = require_function_apply();
      var bind = require_function_bind_context();
      var isCallable = require_is_callable();
      var hasOwn = require_has_own_property();
      var fails = require_fails();
      var html = require_html();
      var arraySlice = require_array_slice();
      var createElement = require_document_create_element();
      var validateArgumentsLength = require_validate_arguments_length();
      var IS_IOS = require_environment_is_ios();
      var IS_NODE = require_environment_is_node();
      var set = globalThis2.setImmediate;
      var clear = globalThis2.clearImmediate;
      var process = globalThis2.process;
      var Dispatch = globalThis2.Dispatch;
      var Function2 = globalThis2.Function;
      var MessageChannel = globalThis2.MessageChannel;
      var String2 = globalThis2.String;
      var counter = 0;
      var queue = {};
      var ONREADYSTATECHANGE = "onreadystatechange";
      var $location;
      var defer;
      var channel;
      var port;
      fails(function() {
        $location = globalThis2.location;
      });
      var run = function(id) {
        if (hasOwn(queue, id)) {
          var fn = queue[id];
          delete queue[id];
          fn();
        }
      };
      var runner = function(id) {
        return function() {
          run(id);
        };
      };
      var eventListener = function(event) {
        run(event.data);
      };
      var globalPostMessageDefer = function(id) {
        globalThis2.postMessage(String2(id), $location.protocol + "//" + $location.host);
      };
      if (!set || !clear) {
        set = function setImmediate(handler) {
          validateArgumentsLength(arguments.length, 1);
          var fn = isCallable(handler) ? handler : Function2(handler);
          var args = arraySlice(arguments, 1);
          queue[++counter] = function() {
            apply(fn, void 0, args);
          };
          defer(counter);
          return counter;
        };
        clear = function clearImmediate(id) {
          delete queue[id];
        };
        if (IS_NODE) {
          defer = function(id) {
            process.nextTick(runner(id));
          };
        } else if (Dispatch && Dispatch.now) {
          defer = function(id) {
            Dispatch.now(runner(id));
          };
        } else if (MessageChannel && !IS_IOS) {
          channel = new MessageChannel();
          port = channel.port2;
          channel.port1.onmessage = eventListener;
          defer = bind(port.postMessage, port);
        } else if (globalThis2.addEventListener && isCallable(globalThis2.postMessage) && !globalThis2.importScripts && $location && $location.protocol !== "file:" && !fails(globalPostMessageDefer)) {
          defer = globalPostMessageDefer;
          globalThis2.addEventListener("message", eventListener, false);
        } else if (ONREADYSTATECHANGE in createElement("script")) {
          defer = function(id) {
            html.appendChild(createElement("script"))[ONREADYSTATECHANGE] = function() {
              html.removeChild(this);
              run(id);
            };
          };
        } else {
          defer = function(id) {
            setTimeout(runner(id), 0);
          };
        }
      }
      module.exports = {
        set,
        clear
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/safe-get-built-in.js
  var require_safe_get_built_in = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/safe-get-built-in.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var DESCRIPTORS = require_descriptors();
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      module.exports = function(name) {
        if (!DESCRIPTORS)
          return globalThis2[name];
        var descriptor = getOwnPropertyDescriptor(globalThis2, name);
        return descriptor && descriptor.value;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/queue.js
  var require_queue = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/queue.js"(exports, module) {
      "use strict";
      var Queue = function() {
        this.head = null;
        this.tail = null;
      };
      Queue.prototype = {
        add: function(item) {
          var entry = { item, next: null };
          var tail = this.tail;
          if (tail)
            tail.next = entry;
          else
            this.head = entry;
          this.tail = entry;
        },
        get: function() {
          var entry = this.head;
          if (entry) {
            var next = this.head = entry.next;
            if (next === null)
              this.tail = null;
            return entry.item;
          }
        }
      };
      module.exports = Queue;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-is-ios-pebble.js
  var require_environment_is_ios_pebble = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-is-ios-pebble.js"(exports, module) {
      "use strict";
      var userAgent = require_environment_user_agent();
      module.exports = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != "undefined";
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-is-webos-webkit.js
  var require_environment_is_webos_webkit = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/environment-is-webos-webkit.js"(exports, module) {
      "use strict";
      var userAgent = require_environment_user_agent();
      module.exports = /web0s(?!.*chrome)/i.test(userAgent);
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/microtask.js
  var require_microtask = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/microtask.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var safeGetBuiltIn = require_safe_get_built_in();
      var bind = require_function_bind_context();
      var macrotask = require_task().set;
      var Queue = require_queue();
      var IS_IOS = require_environment_is_ios();
      var IS_IOS_PEBBLE = require_environment_is_ios_pebble();
      var IS_WEBOS_WEBKIT = require_environment_is_webos_webkit();
      var IS_NODE = require_environment_is_node();
      var MutationObserver = globalThis2.MutationObserver || globalThis2.WebKitMutationObserver;
      var document2 = globalThis2.document;
      var process = globalThis2.process;
      var Promise2 = globalThis2.Promise;
      var microtask = safeGetBuiltIn("queueMicrotask");
      var notify;
      var toggle;
      var node;
      var promise;
      var then;
      if (!microtask) {
        queue = new Queue();
        flush = function() {
          var parent, fn;
          if (IS_NODE && (parent = process.domain))
            parent.exit();
          while (fn = queue.get())
            try {
              fn();
            } catch (error) {
              if (queue.head)
                notify();
              throw error;
            }
          if (parent)
            parent.enter();
        };
        if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document2) {
          toggle = true;
          node = document2.createTextNode("");
          new MutationObserver(flush).observe(node, { characterData: true });
          notify = function() {
            node.data = toggle = !toggle;
          };
        } else if (!IS_IOS_PEBBLE && Promise2 && Promise2.resolve) {
          promise = Promise2.resolve(void 0);
          promise.constructor = Promise2;
          then = bind(promise.then, promise);
          notify = function() {
            then(flush);
          };
        } else if (IS_NODE) {
          notify = function() {
            process.nextTick(flush);
          };
        } else {
          macrotask = bind(macrotask, globalThis2);
          notify = function() {
            macrotask(flush);
          };
        }
        microtask = function(fn) {
          if (!queue.head)
            notify();
          queue.add(fn);
        };
      }
      var queue;
      var flush;
      module.exports = microtask;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/host-report-errors.js
  var require_host_report_errors = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/host-report-errors.js"(exports, module) {
      "use strict";
      module.exports = function(a, b) {
        try {
          arguments.length === 1 ? console.error(a) : console.error(a, b);
        } catch (error) {
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/perform.js
  var require_perform = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/perform.js"(exports, module) {
      "use strict";
      module.exports = function(exec) {
        try {
          return { error: false, value: exec() };
        } catch (error) {
          return { error: true, value: error };
        }
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/promise-native-constructor.js
  var require_promise_native_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/promise-native-constructor.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      module.exports = globalThis2.Promise;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/promise-constructor-detection.js
  var require_promise_constructor_detection = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/promise-constructor-detection.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var NativePromiseConstructor = require_promise_native_constructor();
      var isCallable = require_is_callable();
      var isForced = require_is_forced();
      var inspectSource = require_inspect_source();
      var wellKnownSymbol = require_well_known_symbol();
      var ENVIRONMENT = require_environment();
      var IS_PURE = require_is_pure();
      var V8_VERSION = require_environment_v8_version();
      var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
      var SPECIES = wellKnownSymbol("species");
      var SUBCLASSING = false;
      var NATIVE_PROMISE_REJECTION_EVENT = isCallable(globalThis2.PromiseRejectionEvent);
      var FORCED_PROMISE_CONSTRUCTOR = isForced("Promise", function() {
        var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor);
        var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
        if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66)
          return true;
        if (IS_PURE && !(NativePromisePrototype["catch"] && NativePromisePrototype["finally"]))
          return true;
        if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
          var promise = new NativePromiseConstructor(function(resolve) {
            resolve(1);
          });
          var FakePromise = function(exec) {
            exec(function() {
            }, function() {
            });
          };
          var constructor = promise.constructor = {};
          constructor[SPECIES] = FakePromise;
          SUBCLASSING = promise.then(function() {
          }) instanceof FakePromise;
          if (!SUBCLASSING)
            return true;
        }
        return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === "BROWSER" || ENVIRONMENT === "DENO") && !NATIVE_PROMISE_REJECTION_EVENT;
      });
      module.exports = {
        CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
        REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
        SUBCLASSING
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/new-promise-capability.js
  var require_new_promise_capability = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/new-promise-capability.js"(exports, module) {
      "use strict";
      var aCallable = require_a_callable();
      var $TypeError = TypeError;
      var PromiseCapability = function(C) {
        var resolve, reject;
        this.promise = new C(function($$resolve, $$reject) {
          if (resolve !== void 0 || reject !== void 0)
            throw new $TypeError("Bad Promise constructor");
          resolve = $$resolve;
          reject = $$reject;
        });
        this.resolve = aCallable(resolve);
        this.reject = aCallable(reject);
      };
      module.exports.f = function(C) {
        return new PromiseCapability(C);
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.constructor.js
  var require_es_promise_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.constructor.js"() {
      "use strict";
      var $ = require_export();
      var IS_PURE = require_is_pure();
      var IS_NODE = require_environment_is_node();
      var globalThis2 = require_global_this();
      var path = require_path();
      var call = require_function_call();
      var defineBuiltIn = require_define_built_in();
      var setPrototypeOf = require_object_set_prototype_of();
      var setToStringTag = require_set_to_string_tag();
      var setSpecies = require_set_species();
      var aCallable = require_a_callable();
      var isCallable = require_is_callable();
      var isObject = require_is_object();
      var anInstance = require_an_instance();
      var speciesConstructor = require_species_constructor();
      var task = require_task().set;
      var microtask = require_microtask();
      var hostReportErrors = require_host_report_errors();
      var perform = require_perform();
      var Queue = require_queue();
      var InternalStateModule = require_internal_state();
      var NativePromiseConstructor = require_promise_native_constructor();
      var PromiseConstructorDetection = require_promise_constructor_detection();
      var newPromiseCapabilityModule = require_new_promise_capability();
      var PROMISE = "Promise";
      var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
      var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
      var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
      var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
      var setInternalState = InternalStateModule.set;
      var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
      var PromiseConstructor = NativePromiseConstructor;
      var PromisePrototype = NativePromisePrototype;
      var TypeError2 = globalThis2.TypeError;
      var document2 = globalThis2.document;
      var process = globalThis2.process;
      var newPromiseCapability = newPromiseCapabilityModule.f;
      var newGenericPromiseCapability = newPromiseCapability;
      var DISPATCH_EVENT = !!(document2 && document2.createEvent && globalThis2.dispatchEvent);
      var UNHANDLED_REJECTION = "unhandledrejection";
      var REJECTION_HANDLED = "rejectionhandled";
      var PENDING = 0;
      var FULFILLED = 1;
      var REJECTED = 2;
      var HANDLED = 1;
      var UNHANDLED = 2;
      var Internal;
      var OwnPromiseCapability;
      var PromiseWrapper;
      var nativeThen;
      var isThenable = function(it) {
        var then;
        return isObject(it) && isCallable(then = it.then) ? then : false;
      };
      var callReaction = function(reaction, state) {
        var value = state.value;
        var ok = state.state === FULFILLED;
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED)
                onHandleUnhandled(state);
              state.rejection = HANDLED;
            }
            if (handler === true)
              result = value;
            else {
              if (domain)
                domain.enter();
              result = handler(value);
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(new TypeError2("Promise-chain cycle"));
            } else if (then = isThenable(result)) {
              call(then, result, resolve, reject);
            } else
              resolve(result);
          } else
            reject(value);
        } catch (error) {
          if (domain && !exited)
            domain.exit();
          reject(error);
        }
      };
      var notify = function(state, isReject) {
        if (state.notified)
          return;
        state.notified = true;
        microtask(function() {
          var reactions = state.reactions;
          var reaction;
          while (reaction = reactions.get()) {
            callReaction(reaction, state);
          }
          state.notified = false;
          if (isReject && !state.rejection)
            onUnhandled(state);
        });
      };
      var dispatchEvent = function(name, promise, reason) {
        var event, handler;
        if (DISPATCH_EVENT) {
          event = document2.createEvent("Event");
          event.promise = promise;
          event.reason = reason;
          event.initEvent(name, false, true);
          globalThis2.dispatchEvent(event);
        } else
          event = { promise, reason };
        if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis2["on" + name]))
          handler(event);
        else if (name === UNHANDLED_REJECTION)
          hostReportErrors("Unhandled promise rejection", reason);
      };
      var onUnhandled = function(state) {
        call(task, globalThis2, function() {
          var promise = state.facade;
          var value = state.value;
          var IS_UNHANDLED = isUnhandled(state);
          var result;
          if (IS_UNHANDLED) {
            result = perform(function() {
              if (IS_NODE) {
                process.emit("unhandledRejection", value, promise);
              } else
                dispatchEvent(UNHANDLED_REJECTION, promise, value);
            });
            state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
            if (result.error)
              throw result.value;
          }
        });
      };
      var isUnhandled = function(state) {
        return state.rejection !== HANDLED && !state.parent;
      };
      var onHandleUnhandled = function(state) {
        call(task, globalThis2, function() {
          var promise = state.facade;
          if (IS_NODE) {
            process.emit("rejectionHandled", promise);
          } else
            dispatchEvent(REJECTION_HANDLED, promise, state.value);
        });
      };
      var bind = function(fn, state, unwrap) {
        return function(value) {
          fn(state, value, unwrap);
        };
      };
      var internalReject = function(state, value, unwrap) {
        if (state.done)
          return;
        state.done = true;
        if (unwrap)
          state = unwrap;
        state.value = value;
        state.state = REJECTED;
        notify(state, true);
      };
      var internalResolve = function(state, value, unwrap) {
        if (state.done)
          return;
        state.done = true;
        if (unwrap)
          state = unwrap;
        try {
          if (state.facade === value)
            throw new TypeError2("Promise can't be resolved itself");
          var then = isThenable(value);
          if (then) {
            microtask(function() {
              var wrapper = { done: false };
              try {
                call(
                  then,
                  value,
                  bind(internalResolve, wrapper, state),
                  bind(internalReject, wrapper, state)
                );
              } catch (error) {
                internalReject(wrapper, error, state);
              }
            });
          } else {
            state.value = value;
            state.state = FULFILLED;
            notify(state, false);
          }
        } catch (error) {
          internalReject({ done: false }, error, state);
        }
      };
      if (FORCED_PROMISE_CONSTRUCTOR) {
        PromiseConstructor = function Promise2(executor) {
          anInstance(this, PromisePrototype);
          aCallable(executor);
          call(Internal, this);
          var state = getInternalPromiseState(this);
          try {
            executor(bind(internalResolve, state), bind(internalReject, state));
          } catch (error) {
            internalReject(state, error);
          }
        };
        PromisePrototype = PromiseConstructor.prototype;
        Internal = function Promise2(executor) {
          setInternalState(this, {
            type: PROMISE,
            done: false,
            notified: false,
            parent: false,
            reactions: new Queue(),
            rejection: false,
            state: PENDING,
            value: null
          });
        };
        Internal.prototype = defineBuiltIn(PromisePrototype, "then", function then(onFulfilled, onRejected) {
          var state = getInternalPromiseState(this);
          var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
          state.parent = true;
          reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
          reaction.fail = isCallable(onRejected) && onRejected;
          reaction.domain = IS_NODE ? process.domain : void 0;
          if (state.state === PENDING)
            state.reactions.add(reaction);
          else
            microtask(function() {
              callReaction(reaction, state);
            });
          return reaction.promise;
        });
        OwnPromiseCapability = function() {
          var promise = new Internal();
          var state = getInternalPromiseState(promise);
          this.promise = promise;
          this.resolve = bind(internalResolve, state);
          this.reject = bind(internalReject, state);
        };
        newPromiseCapabilityModule.f = newPromiseCapability = function(C) {
          return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
        };
        if (!IS_PURE && isCallable(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
          nativeThen = NativePromisePrototype.then;
          if (!NATIVE_PROMISE_SUBCLASSING) {
            defineBuiltIn(NativePromisePrototype, "then", function then(onFulfilled, onRejected) {
              var that = this;
              return new PromiseConstructor(function(resolve, reject) {
                call(nativeThen, that, resolve, reject);
              }).then(onFulfilled, onRejected);
            }, { unsafe: true });
          }
          try {
            delete NativePromisePrototype.constructor;
          } catch (error) {
          }
          if (setPrototypeOf) {
            setPrototypeOf(NativePromisePrototype, PromisePrototype);
          }
        }
      }
      $({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
        Promise: PromiseConstructor
      });
      PromiseWrapper = path.Promise;
      setToStringTag(PromiseConstructor, PROMISE, false, true);
      setSpecies(PROMISE);
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/check-correctness-of-iteration.js
  var require_check_correctness_of_iteration = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/check-correctness-of-iteration.js"(exports, module) {
      "use strict";
      var wellKnownSymbol = require_well_known_symbol();
      var ITERATOR = wellKnownSymbol("iterator");
      var SAFE_CLOSING = false;
      try {
        called = 0;
        iteratorWithReturn = {
          next: function() {
            return { done: !!called++ };
          },
          "return": function() {
            SAFE_CLOSING = true;
          }
        };
        iteratorWithReturn[ITERATOR] = function() {
          return this;
        };
        Array.from(iteratorWithReturn, function() {
          throw 2;
        });
      } catch (error) {
      }
      var called;
      var iteratorWithReturn;
      module.exports = function(exec, SKIP_CLOSING) {
        try {
          if (!SKIP_CLOSING && !SAFE_CLOSING)
            return false;
        } catch (error) {
          return false;
        }
        var ITERATION_SUPPORT = false;
        try {
          var object = {};
          object[ITERATOR] = function() {
            return {
              next: function() {
                return { done: ITERATION_SUPPORT = true };
              }
            };
          };
          exec(object);
        } catch (error) {
        }
        return ITERATION_SUPPORT;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/promise-statics-incorrect-iteration.js
  var require_promise_statics_incorrect_iteration = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/promise-statics-incorrect-iteration.js"(exports, module) {
      "use strict";
      var NativePromiseConstructor = require_promise_native_constructor();
      var checkCorrectnessOfIteration = require_check_correctness_of_iteration();
      var FORCED_PROMISE_CONSTRUCTOR = require_promise_constructor_detection().CONSTRUCTOR;
      module.exports = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration(function(iterable) {
        NativePromiseConstructor.all(iterable).then(void 0, function() {
        });
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.all.js
  var require_es_promise_all = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.all.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var aCallable = require_a_callable();
      var newPromiseCapabilityModule = require_new_promise_capability();
      var perform = require_perform();
      var iterate = require_iterate();
      var PROMISE_STATICS_INCORRECT_ITERATION = require_promise_statics_incorrect_iteration();
      $({ target: "Promise", stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
        all: function all(iterable) {
          var C = this;
          var capability = newPromiseCapabilityModule.f(C);
          var resolve = capability.resolve;
          var reject = capability.reject;
          var result = perform(function() {
            var $promiseResolve = aCallable(C.resolve);
            var values = [];
            var counter = 0;
            var remaining = 1;
            iterate(iterable, function(promise) {
              var index = counter++;
              var alreadyCalled = false;
              remaining++;
              call($promiseResolve, C, promise).then(function(value) {
                if (alreadyCalled)
                  return;
                alreadyCalled = true;
                values[index] = value;
                --remaining || resolve(values);
              }, reject);
            });
            --remaining || resolve(values);
          });
          if (result.error)
            reject(result.value);
          return capability.promise;
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.catch.js
  var require_es_promise_catch = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.catch.js"() {
      "use strict";
      var $ = require_export();
      var IS_PURE = require_is_pure();
      var FORCED_PROMISE_CONSTRUCTOR = require_promise_constructor_detection().CONSTRUCTOR;
      var NativePromiseConstructor = require_promise_native_constructor();
      var getBuiltIn = require_get_built_in();
      var isCallable = require_is_callable();
      var defineBuiltIn = require_define_built_in();
      var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
      $({ target: "Promise", proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
        "catch": function(onRejected) {
          return this.then(void 0, onRejected);
        }
      });
      if (!IS_PURE && isCallable(NativePromiseConstructor)) {
        method = getBuiltIn("Promise").prototype["catch"];
        if (NativePromisePrototype["catch"] !== method) {
          defineBuiltIn(NativePromisePrototype, "catch", method, { unsafe: true });
        }
      }
      var method;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.race.js
  var require_es_promise_race = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.race.js"() {
      "use strict";
      var $ = require_export();
      var call = require_function_call();
      var aCallable = require_a_callable();
      var newPromiseCapabilityModule = require_new_promise_capability();
      var perform = require_perform();
      var iterate = require_iterate();
      var PROMISE_STATICS_INCORRECT_ITERATION = require_promise_statics_incorrect_iteration();
      $({ target: "Promise", stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
        race: function race(iterable) {
          var C = this;
          var capability = newPromiseCapabilityModule.f(C);
          var reject = capability.reject;
          var result = perform(function() {
            var $promiseResolve = aCallable(C.resolve);
            iterate(iterable, function(promise) {
              call($promiseResolve, C, promise).then(capability.resolve, reject);
            });
          });
          if (result.error)
            reject(result.value);
          return capability.promise;
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.reject.js
  var require_es_promise_reject = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.reject.js"() {
      "use strict";
      var $ = require_export();
      var newPromiseCapabilityModule = require_new_promise_capability();
      var FORCED_PROMISE_CONSTRUCTOR = require_promise_constructor_detection().CONSTRUCTOR;
      $({ target: "Promise", stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
        reject: function reject(r) {
          var capability = newPromiseCapabilityModule.f(this);
          var capabilityReject = capability.reject;
          capabilityReject(r);
          return capability.promise;
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/promise-resolve.js
  var require_promise_resolve = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/promise-resolve.js"(exports, module) {
      "use strict";
      var anObject = require_an_object();
      var isObject = require_is_object();
      var newPromiseCapability = require_new_promise_capability();
      module.exports = function(C, x) {
        anObject(C);
        if (isObject(x) && x.constructor === C)
          return x;
        var promiseCapability = newPromiseCapability.f(C);
        var resolve = promiseCapability.resolve;
        resolve(x);
        return promiseCapability.promise;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.resolve.js
  var require_es_promise_resolve = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.resolve.js"() {
      "use strict";
      var $ = require_export();
      var getBuiltIn = require_get_built_in();
      var IS_PURE = require_is_pure();
      var NativePromiseConstructor = require_promise_native_constructor();
      var FORCED_PROMISE_CONSTRUCTOR = require_promise_constructor_detection().CONSTRUCTOR;
      var promiseResolve = require_promise_resolve();
      var PromiseConstructorWrapper = getBuiltIn("Promise");
      var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;
      $({ target: "Promise", stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
        resolve: function resolve(x) {
          return promiseResolve(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.js
  var require_es_promise = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/es.promise.js"() {
      "use strict";
      require_es_promise_constructor();
      require_es_promise_all();
      require_es_promise_catch();
      require_es_promise_race();
      require_es_promise_reject();
      require_es_promise_resolve();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.constructor.js
  var require_esnext_iterator_constructor = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.constructor.js"() {
      "use strict";
      require_es_iterator_constructor();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.drop.js
  var require_esnext_iterator_drop = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.drop.js"() {
      "use strict";
      require_es_iterator_drop();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.every.js
  var require_esnext_iterator_every = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.every.js"() {
      "use strict";
      require_es_iterator_every();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.filter.js
  var require_esnext_iterator_filter = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.filter.js"() {
      "use strict";
      require_es_iterator_filter();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.find.js
  var require_esnext_iterator_find = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.find.js"() {
      "use strict";
      require_es_iterator_find();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.flat-map.js
  var require_esnext_iterator_flat_map = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.flat-map.js"() {
      "use strict";
      require_es_iterator_flat_map();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.for-each.js
  var require_esnext_iterator_for_each = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.for-each.js"() {
      "use strict";
      require_es_iterator_for_each();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.from.js
  var require_esnext_iterator_from = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.from.js"() {
      "use strict";
      require_es_iterator_from();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.map.js
  var require_esnext_iterator_map = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.map.js"() {
      "use strict";
      require_es_iterator_map();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.reduce.js
  var require_esnext_iterator_reduce = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.reduce.js"() {
      "use strict";
      require_es_iterator_reduce();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.some.js
  var require_esnext_iterator_some = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.some.js"() {
      "use strict";
      require_es_iterator_some();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.take.js
  var require_esnext_iterator_take = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.take.js"() {
      "use strict";
      require_es_iterator_take();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.to-array.js
  var require_esnext_iterator_to_array = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.to-array.js"() {
      "use strict";
      require_es_iterator_to_array();
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/async-iterator-prototype.js
  var require_async_iterator_prototype = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/async-iterator-prototype.js"(exports, module) {
      "use strict";
      var globalThis2 = require_global_this();
      var shared = require_shared_store();
      var isCallable = require_is_callable();
      var create = require_object_create();
      var getPrototypeOf = require_object_get_prototype_of();
      var defineBuiltIn = require_define_built_in();
      var wellKnownSymbol = require_well_known_symbol();
      var IS_PURE = require_is_pure();
      var USE_FUNCTION_CONSTRUCTOR = "USE_FUNCTION_CONSTRUCTOR";
      var ASYNC_ITERATOR = wellKnownSymbol("asyncIterator");
      var AsyncIterator = globalThis2.AsyncIterator;
      var PassedAsyncIteratorPrototype = shared.AsyncIteratorPrototype;
      var AsyncIteratorPrototype;
      var prototype;
      if (PassedAsyncIteratorPrototype) {
        AsyncIteratorPrototype = PassedAsyncIteratorPrototype;
      } else if (isCallable(AsyncIterator)) {
        AsyncIteratorPrototype = AsyncIterator.prototype;
      } else if (shared[USE_FUNCTION_CONSTRUCTOR] || globalThis2[USE_FUNCTION_CONSTRUCTOR]) {
        try {
          prototype = getPrototypeOf(getPrototypeOf(getPrototypeOf(Function("return async function*(){}()")())));
          if (getPrototypeOf(prototype) === Object.prototype)
            AsyncIteratorPrototype = prototype;
        } catch (error) {
        }
      }
      if (!AsyncIteratorPrototype)
        AsyncIteratorPrototype = {};
      else if (IS_PURE)
        AsyncIteratorPrototype = create(AsyncIteratorPrototype);
      if (!isCallable(AsyncIteratorPrototype[ASYNC_ITERATOR])) {
        defineBuiltIn(AsyncIteratorPrototype, ASYNC_ITERATOR, function() {
          return this;
        });
      }
      module.exports = AsyncIteratorPrototype;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/async-from-sync-iterator.js
  var require_async_from_sync_iterator = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/async-from-sync-iterator.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var anObject = require_an_object();
      var create = require_object_create();
      var getMethod = require_get_method();
      var defineBuiltIns = require_define_built_ins();
      var InternalStateModule = require_internal_state();
      var iteratorClose = require_iterator_close();
      var getBuiltIn = require_get_built_in();
      var AsyncIteratorPrototype = require_async_iterator_prototype();
      var createIterResultObject = require_create_iter_result_object();
      var Promise2 = getBuiltIn("Promise");
      var ASYNC_FROM_SYNC_ITERATOR = "AsyncFromSyncIterator";
      var setInternalState = InternalStateModule.set;
      var getInternalState = InternalStateModule.getterFor(ASYNC_FROM_SYNC_ITERATOR);
      var asyncFromSyncIteratorContinuation = function(result, resolve, reject, syncIterator, closeOnRejection) {
        var done = result.done;
        Promise2.resolve(result.value).then(function(value) {
          resolve(createIterResultObject(value, done));
        }, function(error) {
          if (!done && closeOnRejection) {
            try {
              iteratorClose(syncIterator, "throw", error);
            } catch (error2) {
              error = error2;
            }
          }
          reject(error);
        });
      };
      var AsyncFromSyncIterator = function AsyncIterator(iteratorRecord) {
        iteratorRecord.type = ASYNC_FROM_SYNC_ITERATOR;
        setInternalState(this, iteratorRecord);
      };
      AsyncFromSyncIterator.prototype = defineBuiltIns(create(AsyncIteratorPrototype), {
        next: function next() {
          var state = getInternalState(this);
          return new Promise2(function(resolve, reject) {
            var result = anObject(call(state.next, state.iterator));
            asyncFromSyncIteratorContinuation(result, resolve, reject, state.iterator, true);
          });
        },
        "return": function() {
          var iterator = getInternalState(this).iterator;
          return new Promise2(function(resolve, reject) {
            var $return = getMethod(iterator, "return");
            if ($return === void 0)
              return resolve(createIterResultObject(void 0, true));
            var result = anObject(call($return, iterator));
            asyncFromSyncIteratorContinuation(result, resolve, reject, iterator);
          });
        }
      });
      module.exports = AsyncFromSyncIterator;
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/async-iterator-create-proxy.js
  var require_async_iterator_create_proxy = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/async-iterator-create-proxy.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var perform = require_perform();
      var anObject = require_an_object();
      var create = require_object_create();
      var createNonEnumerableProperty = require_create_non_enumerable_property();
      var defineBuiltIns = require_define_built_ins();
      var wellKnownSymbol = require_well_known_symbol();
      var InternalStateModule = require_internal_state();
      var getBuiltIn = require_get_built_in();
      var getMethod = require_get_method();
      var AsyncIteratorPrototype = require_async_iterator_prototype();
      var createIterResultObject = require_create_iter_result_object();
      var iteratorClose = require_iterator_close();
      var Promise2 = getBuiltIn("Promise");
      var TO_STRING_TAG = wellKnownSymbol("toStringTag");
      var ASYNC_ITERATOR_HELPER = "AsyncIteratorHelper";
      var WRAP_FOR_VALID_ASYNC_ITERATOR = "WrapForValidAsyncIterator";
      var setInternalState = InternalStateModule.set;
      var createAsyncIteratorProxyPrototype = function(IS_ITERATOR) {
        var IS_GENERATOR = !IS_ITERATOR;
        var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER);
        var getStateOrEarlyExit = function(that) {
          var stateCompletion = perform(function() {
            return getInternalState(that);
          });
          var stateError = stateCompletion.error;
          var state = stateCompletion.value;
          if (stateError || IS_GENERATOR && state.done) {
            return { exit: true, value: stateError ? Promise2.reject(state) : Promise2.resolve(createIterResultObject(void 0, true)) };
          }
          return { exit: false, value: state };
        };
        return defineBuiltIns(create(AsyncIteratorPrototype), {
          next: function next() {
            var stateCompletion = getStateOrEarlyExit(this);
            var state = stateCompletion.value;
            if (stateCompletion.exit)
              return state;
            var handlerCompletion = perform(function() {
              return anObject(state.nextHandler(Promise2));
            });
            var handlerError = handlerCompletion.error;
            var value = handlerCompletion.value;
            if (handlerError)
              state.done = true;
            return handlerError ? Promise2.reject(value) : Promise2.resolve(value);
          },
          "return": function() {
            var stateCompletion = getStateOrEarlyExit(this);
            var state = stateCompletion.value;
            if (stateCompletion.exit)
              return state;
            state.done = true;
            var iterator = state.iterator;
            var returnMethod, result;
            var completion = perform(function() {
              if (state.inner)
                try {
                  iteratorClose(state.inner.iterator, "normal");
                } catch (error) {
                  return iteratorClose(iterator, "throw", error);
                }
              return getMethod(iterator, "return");
            });
            returnMethod = result = completion.value;
            if (completion.error)
              return Promise2.reject(result);
            if (returnMethod === void 0)
              return Promise2.resolve(createIterResultObject(void 0, true));
            completion = perform(function() {
              return call(returnMethod, iterator);
            });
            result = completion.value;
            if (completion.error)
              return Promise2.reject(result);
            return IS_ITERATOR ? Promise2.resolve(result) : Promise2.resolve(result).then(function(resolved) {
              anObject(resolved);
              return createIterResultObject(void 0, true);
            });
          }
        });
      };
      var WrapForValidAsyncIteratorPrototype = createAsyncIteratorProxyPrototype(true);
      var AsyncIteratorHelperPrototype = createAsyncIteratorProxyPrototype(false);
      createNonEnumerableProperty(AsyncIteratorHelperPrototype, TO_STRING_TAG, "Async Iterator Helper");
      module.exports = function(nextHandler, IS_ITERATOR) {
        var AsyncIteratorProxy = function AsyncIterator(record, state) {
          if (state) {
            state.iterator = record.iterator;
            state.next = record.next;
          } else
            state = record;
          state.type = IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER;
          state.nextHandler = nextHandler;
          state.counter = 0;
          state.done = false;
          setInternalState(this, state);
        };
        AsyncIteratorProxy.prototype = IS_ITERATOR ? WrapForValidAsyncIteratorPrototype : AsyncIteratorHelperPrototype;
        return AsyncIteratorProxy;
      };
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/async-iterator-wrap.js
  var require_async_iterator_wrap = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/internals/async-iterator-wrap.js"(exports, module) {
      "use strict";
      var call = require_function_call();
      var createAsyncIteratorProxy = require_async_iterator_create_proxy();
      module.exports = createAsyncIteratorProxy(function() {
        return call(this.next, this.iterator);
      }, true);
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.to-async.js
  var require_esnext_iterator_to_async = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/modules/esnext.iterator.to-async.js"() {
      "use strict";
      var $ = require_export();
      var anObject = require_an_object();
      var AsyncFromSyncIterator = require_async_from_sync_iterator();
      var WrapAsyncIterator = require_async_iterator_wrap();
      var getIteratorDirect = require_get_iterator_direct();
      $({ target: "Iterator", proto: true, real: true, forced: true }, {
        toAsync: function toAsync() {
          return new WrapAsyncIterator(getIteratorDirect(new AsyncFromSyncIterator(getIteratorDirect(anObject(this)))));
        }
      });
    }
  });

  // node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/actual/iterator/index.js
  var require_iterator3 = __commonJS({
    "node_modules/.pnpm/core-js@3.44.0/node_modules/core-js/actual/iterator/index.js"(exports, module) {
      "use strict";
      var parent = require_iterator2();
      require_es_promise();
      require_esnext_iterator_constructor();
      require_esnext_iterator_dispose();
      require_esnext_iterator_drop();
      require_esnext_iterator_every();
      require_esnext_iterator_filter();
      require_esnext_iterator_find();
      require_esnext_iterator_flat_map();
      require_esnext_iterator_for_each();
      require_esnext_iterator_from();
      require_esnext_iterator_map();
      require_esnext_iterator_reduce();
      require_esnext_iterator_some();
      require_esnext_iterator_take();
      require_esnext_iterator_to_array();
      require_esnext_iterator_to_async();
      module.exports = parent;
    }
  });

  // src/utils/urlLastPart.ts
  function urlLastPart(url) {
    return url.split("/").filter((i) => i).slice(-1)[0];
  }

  // src/utils/downloadFile.ts
  function downloadFile(file, filename = `${urlLastPart(location.pathname)} ${document.title}.md`) {
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(file);
    anchor.download = filename;
    anchor.style["display"] = "none";
    document.body.append(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(anchor.href);
    }, 0);
  }

  // src/utils/canvasToMarkdown.ts
  function canvasToMarkdown(canvas, alt = "", title = "") {
    return `![${alt}](${canvas.toDataURL()} "${title}")`;
  }

  // src/utils/isCanvasTainted.ts
  function isCanvasTainted(canvas) {
    try {
      canvas.getContext("2d").getImageData(0, 0, 1, 1);
      return false;
    } catch (err) {
      return err instanceof DOMException && err.name === "SecurityError";
    }
  }

  // src/utils/imageToCanvas.ts
  function imageToCanvas(_0) {
    return __async(this, arguments, function* (img, {
      background
    } = {}) {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      if (img.src && img.crossOrigin !== "anonymous" && isCanvasTainted(canvas)) {
        const corsImage = new Image();
        corsImage.crossOrigin = "anonymous";
        corsImage.src = img.src;
        yield corsImage.decode();
        return imageToCanvas(corsImage, { background });
      }
      return canvas;
    });
  }

  // src/utils/imageToMarkdown.ts
  function imageToMarkdown(_0) {
    return __async(this, arguments, function* (img, {
      background
    } = {}) {
      return canvasToMarkdown(
        yield imageToCanvas(img, { background }),
        img.alt,
        img.title
      );
    });
  }

  // src/utils/loadImageCORS.ts
  var import_disposable_stack = __toESM(require_disposable_stack3());
  var import_iterator = __toESM(require_iterator3());

  // src/utils/parseHeader.ts
  function parseHeader(headers) {
    const ret = /* @__PURE__ */ new Map();
    for (const line of headers.split("\r\n")) {
      if (!line) {
        continue;
      }
      const match = /^(.+?): ?(.+)$/.exec(line);
      if (!match) {
        throw new Error(`malformed header: ${line}`);
      }
      const [_, key, value] = match;
      if (!ret.has(key)) {
        ret.set(key, []);
      }
      ret.get(key).push(value);
    }
    return ret;
  }

  // src/utils/loadImageCORS.ts
  function loadImageCORS(url) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "GET",
          url,
          // https://github.com/greasemonkey/greasemonkey/issues/1834#issuecomment-37084558
          overrideMimeType: "text/plain; charset=x-user-defined",
          onload: (_0) => __async(this, [_0], function* ({ responseText, responseHeaders }) {
            var _a, _b;
            var _stack = [];
            try {
              const stack = __using(_stack, new DisposableStack());
              try {
                const headers = parseHeader(responseHeaders);
                const data = new Blob(
                  [
                    Uint8Array.from(
                      Iterator.from(responseText).map((i) => i.charCodeAt(0))
                    )
                  ],
                  { type: (_b = (_a = headers.get("content-type")) == null ? void 0 : _a[0]) != null ? _b : "image/jpeg" }
                );
                const src = stack.adopt(
                  URL.createObjectURL(data),
                  URL.revokeObjectURL
                );
                const img = new Image();
                img.src = src;
                img.alt = url;
                yield img.decode();
                resolve(img);
              } catch (err) {
                reject(err);
              }
            } catch (_) {
              var _error = _, _hasError = true;
            } finally {
              __callDispose(_stack, _error, _hasError);
            }
          }),
          onerror: (response) => {
            reject(response);
          }
        });
      });
    });
  }

  // src/utils/sleep.ts
  function sleep(duration) {
    return __async(this, null, function* () {
      return new Promise((resolve) => {
        setTimeout(resolve, duration);
      });
    });
  }

  // src/syosetu.com/download.user.ts
  var __name__ = "小説家になろう book downloader";
  var statusIndicator = document.createElement("span");
  var finishedCount = 0;
  var totalCount = 0;
  function log(...v) {
    console.log(`${__name__}:`, ...v);
  }
  var messageNodes = [];
  function addMessage(text, title, color = "red") {
    const div = document.createElement("div");
    div.className = `ui ${color} message`;
    statusIndicator.after(div);
    messageNodes.push(div);
    if (title) {
      const header = document.createElement("div");
      header.innerText = title;
      header.className = "header";
      div.appendChild(header);
    }
    const lines = (typeof text === "string" ? [text] : text) || [];
    for (const i of lines) {
      const p = document.createElement("p");
      p.innerText = i;
      div.appendChild(p);
    }
  }
  function chapterImageToMarkdown(line) {
    return __async(this, null, function* () {
      const match = line.match(/^<(.+)\|(.+)>$/);
      if (match) {
        const url = `https://${match[2]}.mitemin.net/userpageimage/viewimagebig/icode/${match[1]}/`;
        try {
          return imageToMarkdown(yield loadImageCORS(url));
        } catch (err) {
          addMessage([url, JSON.stringify(err)], "Image download failed", "orange");
          return `![${line}](${url})`;
        }
      }
      return line;
    });
  }
  function updateStatus() {
    statusIndicator.innerText = `(${finishedCount}/${totalCount})`;
  }
  function downloadChapter(ncode, chapter) {
    return __async(this, null, function* () {
      const url = `https://${location.host}/txtdownload/dlstart/ncode/${ncode}/?no=${chapter}&hankaku=0&code=utf-8&kaigyo=lf`;
      log(`fetch chapter: ${chapter}: ${url}`);
      const resp = yield fetch(url);
      if (resp.status !== 200) {
        addMessage(
          [`${resp.status} ${resp.statusText}`, url],
          "Fetch chapter failed"
        );
        throw new Error(
          `Fetch chapter failed: ${resp.status} ${resp.statusText} : ${url}`
        );
      }
      return yield resp.text();
    });
  }
  function clearMessage() {
    while (messageNodes.length) {
      messageNodes.pop().remove();
    }
  }
  function getMetaData() {
    const data = {
      link: document.location.href
    };
    const authorContainer = document.querySelector(".novel_writername");
    const authorAnchor = document.querySelector(
      ".novel_writername > a:nth-child(1)"
    );
    if (authorAnchor instanceof HTMLAnchorElement) {
      data["author"] = authorAnchor.innerText;
      data["author_link"] = authorAnchor.href;
    } else if (authorContainer instanceof HTMLDivElement) {
      data["author"] = authorContainer.innerText.replace(/^作者：/, "");
    }
    return [
      "---",
      ...Object.entries(data).map(([k, v]) => `${k}: ${v}`),
      "---"
    ].join("\n");
  }
  function downloadChapterChunk(ncode, chapters) {
    return __async(this, null, function* () {
      return Promise.all(
        chapters.map(
          (i) => function() {
            return __async(this, null, function* () {
              const ret = yield Promise.all(
                (yield downloadChapter(ncode, i.chapter)).split("\n").map((i2) => i2.trim()).filter((i2) => i2.length > 0).map(chapterImageToMarkdown)
              );
              ret.splice(0, 0, `# ${i.title}`);
              finishedCount += 1;
              updateStatus();
              return ret;
            });
          }()
        )
      ).then((i) => {
        const ret = [];
        i.map((j) => {
          ret.push(...j);
        });
        return ret;
      });
    });
  }
  function main(button) {
    return __async(this, null, function* () {
      clearMessage();
      const ncode = urlLastPart(
        document.querySelector(
          "#novel_footer > ul:nth-child(1) > li:nth-child(3) > a:nth-child(1)"
        ).href
      );
      log(`start downloading: ${ncode}`);
      const chapters = [];
      for (const i of document.querySelectorAll(
        "dl.novel_sublist2 > dd:nth-child(1) > a:nth-child(1)"
      )) {
        chapters.push({ chapter: urlLastPart(i.href), title: i.innerText });
      }
      finishedCount = 0;
      totalCount = chapters.length;
      updateStatus();
      const lines = [];
      const chunkSize = 10;
      for (let i = 0; i < chapters.length; i += chunkSize) {
        lines.push(
          ...yield downloadChapterChunk(ncode, chapters.slice(i, i + chunkSize))
        );
        yield sleep(5e3);
      }
      log(`got ${lines.length} lines`);
      function download() {
        downloadFile(
          new Blob([getMetaData(), "\n\n", lines.join("\n\n")], {
            type: "text/markdown"
          })
        );
      }
      button.onclick = download;
      download();
    });
  }
  (function() {
    return __async(this, null, function* () {
      const button = document.createElement("button");
      button.innerText = "Download all chapters";
      button.className = "button";
      button.onclick = () => __async(this, null, function* () {
        try {
          button.disabled = true;
          button.style.opacity = "50%";
          yield main(button);
        } catch (err) {
          console.error(err);
        } finally {
          button.disabled = false;
          button.style.opacity = "";
        }
      });
      document.querySelector("#novel_ex").after(button, statusIndicator);
      log("activated");
    });
  })();
})();

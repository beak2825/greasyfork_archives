// ==UserScript==
// @name         Skribbl Essentials 2.5
// @match        *://skribbl.io/*
// @author       Databones
// @description  Provides a list of potential words for skribbl.io
// @namespace    https://discord.gg/jepPDJS7ra
// @version      2.5
// @license      MIT
// @icon         https://raw.githubusercontent.com/Databones/SkribblEssentials/main/logoGIF.gif
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484829/Skribbl%20Essentials%2025.user.js
// @updateURL https://update.greasyfork.org/scripts/484829/Skribbl%20Essentials%2025.meta.js
// ==/UserScript==

// ──  FEATURES  ──
// 📄 Suggestions tab: Generate a smart list of potential guesses.
// 🖼️ Themes: Customize the background to your liking.
// 📦 Compact chat: Have the chat more instant and compact.
// 💾 Saveable private room settings: Save and load the settings you use for private rooms.
// 🎩 Hats: Allows you to wear hats seen by other players using only ASCII characters
// #️⃣ Special character usernames: Allows you to use all special characters by spoofing with lookalikes.
// 🔤 Fixed character limit: Enjoy an extended 14-character username.

// ──  2.5 CHANGES  ──
// Suggestions tab guessing improved: Now accounts for the hint's capitalization.
// Skribbl Essentials is made more compatible with older browsers.

"use strict";

function _typeof(obj) {
   "@babel/helpers - typeof";
   return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
   } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
   }, _typeof(obj);
}

function _regeneratorRuntime() {
   "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
   _regeneratorRuntime = function _regeneratorRuntime() {
      return exports;
   };
   var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
         obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

   function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
         value: value,
         enumerable: !0,
         configurable: !0,
         writable: !0
      }), obj[key];
   }
   try {
      define({}, "");
   } catch (err) {
      define = function define(obj, key, value) {
         return obj[key] = value;
      };
   }

   function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
         generator = Object.create(protoGenerator.prototype),
         context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
         value: makeInvokeMethod(innerFn, self, context)
      }), generator;
   }

   function tryCatch(fn, obj, arg) {
      try {
         return {
            type: "normal",
            arg: fn.call(obj, arg)
         };
      } catch (err) {
         return {
            type: "throw",
            arg: err
         };
      }
   }
   exports.wrap = wrap;
   var ContinueSentinel = {};

   function Generator() {}

   function GeneratorFunction() {}

   function GeneratorFunctionPrototype() {}
   var IteratorPrototype = {};
   define(IteratorPrototype, iteratorSymbol, function () {
      return this;
   });
   var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
   NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
   var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

   function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
         define(prototype, method, function (arg) {
            return this._invoke(method, arg);
         });
      });
   }

   function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
         var record = tryCatch(generator[method], generator, arg);
         if ("throw" !== record.type) {
            var result = record.arg,
               value = result.value;
            return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
               invoke("next", value, resolve, reject);
            }, function (err) {
               invoke("throw", err, resolve, reject);
            }) : PromiseImpl.resolve(value).then(function (unwrapped) {
               result.value = unwrapped, resolve(result);
            }, function (error) {
               return invoke("throw", error, resolve, reject);
            });
         }
         reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
         value: function value(method, arg) {
            function callInvokeWithMethodAndArg() {
               return new PromiseImpl(function (resolve, reject) {
                  invoke(method, arg, resolve, reject);
               });
            }
            return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
         }
      });
   }

   function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
         if ("executing" === state) throw new Error("Generator is already running");
         if ("completed" === state) {
            if ("throw" === method) throw arg;
            return doneResult();
         }
         for (context.method = method, context.arg = arg;;) {
            var delegate = context.delegate;
            if (delegate) {
               var delegateResult = maybeInvokeDelegate(delegate, context);
               if (delegateResult) {
                  if (delegateResult === ContinueSentinel) continue;
                  return delegateResult;
               }
            }
            if ("next" === context.method) context.sent = context._sent = context.arg;
            else if ("throw" === context.method) {
               if ("suspendedStart" === state) throw state = "completed", context.arg;
               context.dispatchException(context.arg);
            } else "return" === context.method && context.abrupt("return", context.arg);
            state = "executing";
            var record = tryCatch(innerFn, self, context);
            if ("normal" === record.type) {
               if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
               return {
                  value: record.arg,
                  done: context.done
               };
            }
            "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
         }
      };
   }

   function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
         method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
   }

   function pushTryEntry(locs) {
      var entry = {
         tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
   }

   function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
   }

   function Context(tryLocsList) {
      this.tryEntries = [{
         tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
   }

   function values(iterable) {
      if (iterable) {
         var iteratorMethod = iterable[iteratorSymbol];
         if (iteratorMethod) return iteratorMethod.call(iterable);
         if ("function" == typeof iterable.next) return iterable;
         if (!isNaN(iterable.length)) {
            var i = -1,
               next = function next() {
                  for (; ++i < iterable.length;)
                     if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
                  return next.value = undefined, next.done = !0, next;
               };
            return next.next = next;
         }
      }
      return {
         next: doneResult
      };
   }

   function doneResult() {
      return {
         value: undefined,
         done: !0
      };
   }
   return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
   }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
   }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
   }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
   }, exports.awrap = function (arg) {
      return {
         __await: arg
      };
   }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
   }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
         return result.done ? result.value : iter.next();
      });
   }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
   }), define(Gp, "toString", function () {
      return "[object Generator]";
   }), exports.keys = function (val) {
      var object = Object(val),
         keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(),
         function next() {
            for (; keys.length;) {
               var key = keys.pop();
               if (key in object) return next.value = key, next.done = !1, next;
            }
            return next.done = !0, next;
         };
   }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
         if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset)
            for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function stop() {
         this.done = !0;
         var rootRecord = this.tryEntries[0].completion;
         if ("throw" === rootRecord.type) throw rootRecord.arg;
         return this.rval;
      },
      dispatchException: function dispatchException(exception) {
         if (this.done) throw exception;
         var context = this;

         function handle(loc, caught) {
            return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
         }
         for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i],
               record = entry.completion;
            if ("root" === entry.tryLoc) return handle("end");
            if (entry.tryLoc <= this.prev) {
               var hasCatch = hasOwn.call(entry, "catchLoc"),
                  hasFinally = hasOwn.call(entry, "finallyLoc");
               if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
                  if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
               } else if (hasCatch) {
                  if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
               } else {
                  if (!hasFinally) throw new Error("try statement without catch or finally");
                  if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
               }
            }
         }
      },
      abrupt: function abrupt(type, arg) {
         for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
               var finallyEntry = entry;
               break;
            }
         }
         finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
         var record = finallyEntry ? finallyEntry.completion : {};
         return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function complete(record, afterLoc) {
         if ("throw" === record.type) throw record.arg;
         return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function finish(finallyLoc) {
         for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
         }
      },
      "catch": function _catch(tryLoc) {
         for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
               var record = entry.completion;
               if ("throw" === record.type) {
                  var thrown = record.arg;
                  resetTryEntry(entry);
               }
               return thrown;
            }
         }
         throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
         return this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
         }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
   }, exports;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
   var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
   if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
         if (it) o = it;
         var i = 0;
         var F = function F() {};
         return {
            s: F,
            n: function n() {
               if (i >= o.length) return {
                  done: true
               };
               return {
                  done: false,
                  value: o[i++]
               };
            },
            e: function e(_e) {
               throw _e;
            },
            f: F
         };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
   }
   var normalCompletion = true,
      didErr = false,
      err;
   return {
      s: function s() {
         it = it.call(o);
      },
      n: function n() {
         var step = it.next();
         normalCompletion = step.done;
         return step;
      },
      e: function e(_e2) {
         didErr = true;
         err = _e2;
      },
      f: function f() {
         try {
            if (!normalCompletion && it["return"] != null) it["return"]();
         } finally {
            if (didErr) throw err;
         }
      }
   };
}

function _unsupportedIterableToArray(o, minLen) {
   if (!o) return;
   if (typeof o === "string") return _arrayLikeToArray(o, minLen);
   var n = Object.prototype.toString.call(o).slice(8, -1);
   if (n === "Object" && o.constructor) n = o.constructor.name;
   if (n === "Map" || n === "Set") return Array.from(o);
   if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
   if (len == null || len > arr.length) len = arr.length;
   for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
   return arr2;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
   try {
      var info = gen[key](arg);
      var value = info.value;
   } catch (error) {
      reject(error);
      return;
   }
   if (info.done) {
      resolve(value);
   } else {
      Promise.resolve(value).then(_next, _throw);
   }
}

function _asyncToGenerator(fn) {
   return function () {
      var self = this,
         args = arguments;
      return new Promise(function (resolve, reject) {
         var gen = fn.apply(self, args);

         function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
         }

         function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
         }
         _next(undefined);
      });
   };
}
(function () {
   'use strict';

   var versionFileURL = 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/version';
   var redirectURL = 'https://github.com/Databones/SkribblEssentials/raw/main/Skribbl%20Essentials.user.js';

   function fetchRemoteVersion() {
      return _fetchRemoteVersion.apply(this, arguments);
   }

   function _fetchRemoteVersion() {
      _fetchRemoteVersion = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime().mark(function _callee() {
         var response, remoteVersion, currentVersion;
         return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
               case 0:
                  _context.next = 2;
                  return fetch(versionFileURL);
               case 2:
                  response = _context.sent;
                  _context.next = 5;
                  return response.text();
               case 5:
                  remoteVersion = _context.sent;
                  currentVersion = GM_info.script.version;
                  if (remoteVersion.trim() !== currentVersion.trim()) {
                     window.location.href = redirectURL;
                  }
               case 8:
               case "end":
                  return _context.stop();
            }
         }, _callee);
      }));
      return _fetchRemoteVersion.apply(this, arguments);
   }
   if (typeof GM_info !== 'undefined' && GM_info.script) {
      fetchRemoteVersion();
   }

   function addStyles(styles) {
      var style = document.createElement('style');
      style.textContent = styles;
      document.head.appendChild(style);
   }
   addStyles("\n  .powered-by-skribbl-essentials {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n    font: inherit;\n    margin-top: 10px;\n  }\n");
   var logoLink = document.createElement('a');
   logoLink.href = 'https://github.com/Databones/SkribblEssentials';
   logoLink.target = '_blank';
   logoLink.style.textDecoration = 'none';
   var customLogoDiv = document.createElement('div');
   customLogoDiv.className = 'powered-by-skribbl-essentials';
   customLogoDiv.style.userSelect = 'none';
   customLogoDiv.style.pointerEvents = 'none';
   customLogoDiv.innerHTML = "\n  Powered by Skribbl Essentials 2.5\n  <img src=\"https://raw.githubusercontent.com/Databones/SkribblEssentials/main/logoGIF.gif\" alt=\"Skribbl Essentials Icon\" style=\"width: 25px; margin-left: 5px;\">\n";
   logoLink.appendChild(customLogoDiv);
   var logoBigDiv = document.querySelector('div.logo-big');
   if (logoBigDiv) {
      logoBigDiv.appendChild(logoLink);
   }

   function changeBackground(imageURL, repeat) {
      var img = new Image();
      img.src = imageURL;
      img.onload = function () {
         var isSquare = img.width === img.height;
         document.body.style.backgroundImage = "url(".concat(imageURL, ")");
         document.body.style.backgroundRepeat = isSquare ? 'repeat' : 'no-repeat';
         document.body.style.backgroundSize = isSquare ? 'auto' : 'cover';
         var svgElements = document.querySelectorAll('svg[viewBox="0 0 1 1"][preserveAspectRatio="none"]');
         svgElements.forEach(function (element) {
            element.remove();
            var styleElement = document.createElement('style');
            styleElement.innerHTML = ':root { --COLOR_PANEL_BG: rgba(12, 44, 150, 0.0) !important; }';
            document.head.appendChild(styleElement);
         });
      };
   }

   function handleThemingButtonClick() {
      var imageURL = prompt("Enter the image URL:");
      if (imageURL) {
         GM_setValue('backgroundImageURL', imageURL);
         GM_setValue('backgroundRepeat', false);
         changeBackground(imageURL, false);
      }
   }

   function handleResetButtonClick() {
      var defaultBackgroundImageURL = '/img/background.png';
      var defaultBackgroundRepeat = true;
      changeBackground(defaultBackgroundImageURL, defaultBackgroundRepeat);
      GM_setValue('backgroundImageURL', defaultBackgroundImageURL);
      GM_setValue('backgroundRepeat', defaultBackgroundRepeat);
   }

   function toggleSuggestions() {
      var currentSetting = GM_getValue('suggestions', true);
      var newSetting = !currentSetting;
      GM_setValue('suggestions', newSetting);
      updateToggleButton(newSetting);
      window.location.reload();
   }

   function toggleCompactChat() {
      var currentSetting = GM_getValue('compactChat', false);
      var newSetting = !currentSetting;
      GM_setValue('compactChat', newSetting);
      updateCompactChatButton(newSetting);
      window.location.reload();
   }

   function updateToggleButton(enabled) {
      var toggleButton = document.getElementById('suggestionsToggleButton');
      if (enabled) {
         toggleButton.style.backgroundColor = 'green';
      } else {
         toggleButton.style.backgroundColor = 'red';
      }
   }

   function updateCompactChatButton(enabled) {
      var compactChatButton = document.getElementById('compactChatToggleButton');
      if (enabled) {
         compactChatButton.style.backgroundColor = 'green';
      } else {
         compactChatButton.style.backgroundColor = 'red';
      }
   }
   var sectionContainers = document.querySelectorAll('.section-container');
   sectionContainers.forEach(function (container) {
      while (container.firstChild) {
         container.removeChild(container.firstChild);
      }
      var buttons = [createButton('Add custom background', handleThemingButtonClick), createButton('Reset', handleResetButtonClick)];
      var suggestionsToggleButton = createButton('Suggestions Tab', toggleSuggestions);
      suggestionsToggleButton.id = 'suggestionsToggleButton';
      buttons.push(suggestionsToggleButton);
      var compactChatToggleButton = createButton('Compact Chat', toggleCompactChat);
      compactChatToggleButton.id = 'compactChatToggleButton';
      buttons.push(compactChatToggleButton);
      buttons.forEach(function (button) {
         return container.appendChild(button);
      });
   });
   var savedImageURL = GM_getValue('backgroundImageURL');
   var backgroundRepeat = GM_getValue('backgroundRepeat');
   if (savedImageURL) {
      changeBackground(savedImageURL, backgroundRepeat);
   }
   var suggestionsEnabled = GM_getValue('suggestions', true);
   updateToggleButton(suggestionsEnabled);
   var compactChatEnabled = GM_getValue('compactChat', false);
   updateCompactChatButton(compactChatEnabled);

   function createButton(text, clickHandler) {
      var button = document.createElement('button');
      button.textContent = text;
      Object.assign(button.style, {
         borderRadius: '5px',
         padding: '5 5px',
         margin: '10 5px',
         color: 'black'
      });
      button.addEventListener('click', clickHandler);
      return button;
   }

   function changeMaxLength() {
      var inputElements = document.querySelectorAll('input.input-name[data-translate="placeholder"]');
      inputElements.forEach(function (element) {
         return element.setAttribute('maxlength', '14');
      });
   }

   function loadSettings() {
      var settingIds = ["item-settings-rounds", "item-settings-slots", "item-settings-language", "item-settings-drawtime", "item-settings-wordcount", "item-settings-hints"];
      for (var _i = 0, _settingIds = settingIds; _i < _settingIds.length; _i++) {
         var settingId = _settingIds[_i];
         var value = GM_getValue(settingId);
         if (value !== undefined) {
            var element = document.getElementById(settingId);
            if (element && element.tagName === "SELECT") {
               element.value = value;
               var event = new Event("change", {
                  bubbles: true
               });
               element.dispatchEvent(event);
            }
         }
      }
      var customWordsOnlyCheckbox = document.getElementById("item-settings-customwordsonly");
      if (customWordsOnlyCheckbox) {
         var checkboxValue = GM_getValue("item-settings-customwordsonly");
         if (checkboxValue !== undefined) {
            customWordsOnlyCheckbox.checked = checkboxValue === "on";
            customWordsOnlyCheckbox.dispatchEvent(new Event("change", {
               bubbles: true
            }));
         }
      }
      var customWordsTextarea = document.getElementById("item-settings-customwords");
      if (customWordsTextarea && customWordsTextarea.dataset.loaded !== "true") {
         var textareaValue = GM_getValue("item-settings-customwords");
         if (textareaValue !== undefined) {
            customWordsTextarea.value = textareaValue;
            customWordsTextarea.dispatchEvent(new Event("input", {
               bubbles: true
            }));
            customWordsTextarea.dataset.loaded = "true";
         }
      }
   }

   function storeSetting(settingId, value) {
      GM_setValue(settingId, value);
   }
   document.addEventListener("change", function (event) {
      if (event.target.matches("select, input[type='checkbox'], textarea")) {
         var settingId = event.target.id;
         var value = event.target.type === "checkbox" ? event.target.checked ? "on" : "off" : event.target.value;
         storeSetting(settingId, value);
      }
   });

   function checkForRoomShow() {
      var roomShowDiv = document.querySelector("div.room.show");
      if (roomShowDiv) {
         loadSettings();
      }
   }
   var observer = new MutationObserver(checkForRoomShow);
   var observerConfig = {
      childList: true,
      subtree: true
   };
   observer.observe(document, observerConfig);
   var compactChat = GM_getValue('compactChat', false);
   if (compactChat) {
      GM_addStyle("\n            #game-chat .chat-container .chat-content p {\n                padding: 0 !important;\n                animation: none !important;\n                transition: none !important;\n            }\n        ");
   }
   var replacements = {
      'dz': 'ǳ',
      '\\.': '․',
      'Dz': 'ǲ',
      'DZ': 'Ǳ',
      'LJ': 'Ǉ',
      'Lj': 'ǈ',
      'lj': 'ǉ',
      'NJ': 'Ǌ',
      'Nj': 'ǋ',
      'nj': 'ǌ',
      '\\$': '＄',
      '#': 'ⵌ',
      '%': '％',
      '&': '＆',
      '\\(': '（',
      '\\)': '）',
      '\\+': '＋',
      ',': '，',
      '\\/': '／',
      '\\\\': '＼',
      ':': '׃',
      '\\?': '？',
      '\\{': '｛',
      '｝': '}',
      '<': 'ᐸ',
      '>': 'ᐳ',
      "'": '՚',
      '"': '‟'
   };

   function replaceCharacterCombinations(e) {
      var inputElement = e.target;
      var newValue = inputElement.value;
      for (var pattern in replacements) {
         if (replacements.hasOwnProperty(pattern)) {
            var regex = new RegExp(pattern, 'g');
            newValue = newValue.replace(regex, replacements[pattern]);
         }
      }
      inputElement.value = newValue;
   }
   var inputField = document.querySelector('input.input-name[type="text"][placeholder="Enter your name"]');
   if (inputField) {
      inputField.addEventListener('input', replaceCharacterCombinations);
   }

   function modifyPlayerName() {
      var targetDiv = document.querySelector('div.player-name.me');
      if (targetDiv) {
         targetDiv.classList.remove('me');
         targetDiv.classList.add('player-name');
         targetDiv.textContent = targetDiv.textContent.replace(' (You)', '');
      }
   }
   var observer2 = new MutationObserver(function (mutationsList) {
      var _iterator = _createForOfIteratorHelper(mutationsList),
         _step;
      try {
         for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var mutation = _step.value;
            if (mutation.type === 'childList') {
               modifyPlayerName();
            }
         }
      } catch (err) {
         _iterator.e(err);
      } finally {
         _iterator.f();
      }
   });
   var targetNode = document.body;
   var config = {
      childList: true,
      subtree: true
   };
   observer2.observe(targetNode, config);
   var avatars = [{
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Eyeball.png',
      avatarData: [0, 3, 0],
      name: 'ǱǱǱ       👁👁',
      partsToChange: [1]
   }, {
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Dark.png',
      avatarData: [0, 26, 0],
      name: 'ﾠﾠ          ⬤⬤',
      partsToChange: [1]
   }, {
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Creepy.png',
      avatarData: [0, 42, 0],
      name: 'ﾠﾠ          ◉◉',
      partsToChange: [1]
   }, {
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Pupils.png',
      avatarData: [0, 35, 0],
      name: 'ﾠﾠ          ⬤⬤',
      partsToChange: [1]
   }, {
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Nose.png',
      avatarData: [0, 0, 0],
      name: 'ﾠﾠ          👃',
      partsToChange: [-1]
   }, {
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/PigSnout.png',
      avatarData: [0, 0, 0],
      name: 'ﾠﾠ          🐽',
      partsToChange: [-1]
   }, {
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Sweat.png',
      avatarData: [0, 0, 0],
      name: 'ㅤ       ㅤ💧',
      partsToChange: [-1]
   }, {
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Lips.png',
      avatarData: [0, 0, 6],
      name: 'ﾠﾠ          👄',
      partsToChange: [2]
   }, {
      imageUrl: 'https://raw.githubusercontent.com/Databones/SkribblEssentials/main/avatars/Stars.png',
      avatarData: [0, 0, 0],
      name: 'ㅤ       ✨',
      partsToChange: [-1]
   }];
   var panelRightElements = document.querySelectorAll('.panel-right .ad-side');
   var _iterator2 = _createForOfIteratorHelper(panelRightElements),
      _step2;
   try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
         var panelRightElement = _step2.value;
         panelRightElement.parentElement.removeChild(panelRightElement);
      }
   } catch (err) {
      _iterator2.e(err);
   } finally {
      _iterator2.f();
   }

   function applyAvatar(avatar) {
      var currentAvatarData = JSON.parse(localStorage.getItem('ava'));
      avatar.partsToChange.forEach(function (index) {
         currentAvatarData[index] = avatar.avatarData[index];
      });
      localStorage.setItem('ava', JSON.stringify(currentAvatarData));
      if (avatar.name) {
         localStorage.setItem('name', avatar.name);
      }
      window.location.reload();
   }
   var numRows = 3;
   var numCols = 5;
   var panelRight = document.querySelector('.panel-right');
   for (var i = 0; i < numRows; i++) {
      var row = document.createElement('div');
      row.className = 'avatar-row';
      var _loop = function _loop() {
         var index = i * numCols + j;
         if (index < avatars.length) {
            var avatar = avatars[index];
            var button = document.createElement('button');
            button.style.cursor = 'pointer';
            var image = document.createElement('img');
            image.src = avatar.imageUrl;
            image.draggable = false;
            image.style.userSelect = 'none';
            button.style = "\n                width: 92px;\n                height: 111px;\n                padding: 10px;\n                background-color: transparent;\n                border: none;\n                margin: 5px;\n            ";
            button.appendChild(image);
            button.addEventListener('click', function () {
               applyAvatar(avatar);
            });
            row.appendChild(button);
         }
      };
      for (var j = 0; j < numCols; j++) {
         _loop();
      }
      panelRight.appendChild(row);
   }
   var isSuggestionsEnabled = GM_getValue('suggestions', true);
   if (!isSuggestionsEnabled) {
      return;
   }
   var form = document.querySelector('form');
   var chatInput = document.querySelector('form input[placeholder="Type your guess here..."]');
   var chatContent = document.querySelector('.chat-content');
   var hintsContainer = document.querySelector('.hints .container');
   var suggestionsDiv = document.createElement('div');
   suggestionsDiv.className = 'suggestions';
   suggestionsDiv.style.maxHeight = '150px';
   suggestionsDiv.style.overflowY = 'auto';
   form.appendChild(suggestionsDiv);
   var clickedButtons = new Set();
   var wordList = [];

   function isWordListValid() {
      var storedData = localStorage.getItem("wordListData");
      if (storedData) {
         var _JSON$parse = JSON.parse(storedData),
            timestamp = _JSON$parse.timestamp,
            data = _JSON$parse.data;
         var now = new Date().getTime();
         if (now - timestamp <= 24 * 60 * 60 * 1000) {
            wordList = data.split('\n');
            return true;
         }
      }
      return false;
   }

   function fetchWordList() {
      if (!isWordListValid()) {
         fetch("https://raw.githubusercontent.com/Databones/SkribblEssentials/main/wordList").then(function (response) {
            return response.text();
         }).then(function (data) {
            var timestamp = new Date().getTime();
            localStorage.setItem("wordListData", JSON.stringify({
               timestamp: timestamp,
               data: data
            }));
            wordList = data.split('\n');
            updateSuggestions();
         })["catch"](function (error) {
            console.error("Error fetching data:", error);
         });
      }
   }

   function updateSuggestions() {
      var inputText = chatInput.value.trim().toLowerCase();
      var hintElements = hintsContainer.querySelectorAll('.hint');
      var hintText = Array.from(hintElements).map(function (element) {
         if (element.classList.contains('uncover')) {
            return element.textContent;
         } else {
            return element.textContent.replace(/_/g, '[^\\s-]');
         }
      }).join('');
      var hintRegExp = new RegExp("^".concat(hintText, "$"));
      var chatTextSpans = chatContent.querySelectorAll('p[style*="var(--COLOR_CHAT_TEXT_BASE)"] span');
      var chatText = Array.from(chatTextSpans).map(function (span) {
         return span.textContent.trim().toLowerCase();
      });
      var filteredWords = wordList.filter(function (word) {
         return hintRegExp.test(word) && !chatText.includes(word.toLowerCase()) && !clickedButtons.has(word);
      });
      suggestionsDiv.innerHTML = '';
      var fragment = document.createDocumentFragment();
      filteredWords.forEach(function (word) {
         if (word.toLowerCase().includes(inputText)) {
            var button = document.createElement('button');
            button.textContent = word;
            button.style.color = 'black';
            button.style.margin = '5px';
            button.style.borderRadius = '5px';
            button.style.userSelect = 'none';
            fragment.appendChild(button);
         }
      });
      suggestionsDiv.appendChild(fragment);
   }
   var debounceTimeout;
   chatInput.addEventListener('input', function () {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(updateSuggestions, 50);
   });
   suggestionsDiv.addEventListener('mousedown', function (event) {
      if (event.target.tagName === 'BUTTON') {
         event.preventDefault();
         var lowercaseWord = event.target.textContent.toLowerCase();
         chatInput.value = lowercaseWord;
         clickedButtons.add(lowercaseWord);
         var inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true
         });
         chatInput.dispatchEvent(inputEvent);
         var submitEvent = new Event('submit', {
            bubbles: true,
            cancelable: true
         });
         form.dispatchEvent(submitEvent);
      }
   });
   var observerConfig3 = {
      subtree: true,
      childList: true
   };
   var observer3 = new MutationObserver(updateSuggestions);
   observer3.observe(hintsContainer, observerConfig3);
   var chatObserver = new MutationObserver(updateSuggestions);
   chatObserver.observe(chatContent, {
      childList: true,
      subtree: true
   });
   fetchWordList();
   updateSuggestions();
   window.addEventListener('load', changeMaxLength);
   window.addEventListener('load', modifyPlayerName);
})();
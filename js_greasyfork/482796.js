// ==UserScript==
// @name         Make Jig Better
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Make life just a little easier.
// @author       Todd Coleman
// @match        https://*.workamajig.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workamajig.com
// @downloadURL https://update.greasyfork.org/scripts/482796/Make%20Jig%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/482796/Make%20Jig%20Better.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/card-highlighter.js":
/*!*********************************!*\
  !*** ./src/card-highlighter.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cardHighlighter: () => (/* binding */ cardHighlighter)
/* harmony export */ });
/* harmony import */ var _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/xconsole */ "./src/helpers/xconsole.js");
/* harmony import */ var _helpers_cssHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/cssHelper */ "./src/helpers/cssHelper.js");


var cardHighlighter = {
  init: function init() {
    document.body.addEventListener("click", function (e) {
      // check if this element is or is a descendant of a taskcard
      var taskcard = e.target.closest("taskcard");
      if (taskcard !== null) {
        // Perform your action here
        _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log(" A taskcard was clicked!", taskcard);
        var dataKey = taskcard.getAttribute("data-key");
        _helpers_cssHelper__WEBPACK_IMPORTED_MODULE_1__.cssHelper.createOrUpdateStyle("mjb", "taskcard[data-key='".concat(dataKey, "'] .card-border { box-shadow: 2px 2px 3px 3px #3498db; }"));
      }
    });
  }
};

/***/ }),

/***/ "./src/helpers/cssHelper.js":
/*!**********************************!*\
  !*** ./src/helpers/cssHelper.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cssHelper: () => (/* binding */ cssHelper)
/* harmony export */ });
/* harmony import */ var _xconsole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xconsole */ "./src/helpers/xconsole.js");

var cssHelper = {
  createOrUpdateStyle: function createOrUpdateStyle(id, css) {
    var styleElement = document.getElementById(id);
    if (styleElement) {
      // If the style element already exists, update its content
      styleElement.innerHTML = css;
    } else {
      // If the style element doesn't exist, create it
      styleElement = document.createElement("style");
      styleElement.id = id;
      styleElement.innerHTML = css;
      document.head.appendChild(styleElement);
    }
  }
};

/***/ }),

/***/ "./src/helpers/pageEvents.js":
/*!***********************************!*\
  !*** ./src/helpers/pageEvents.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pageEvents: () => (/* binding */ pageEvents)
/* harmony export */ });
/* harmony import */ var _xconsole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xconsole */ "./src/helpers/xconsole.js");

var eventQueue = [];
var pagesQueue = [];
var readyPagesQueue = [];
var started = false;
var pageEvents = {
  init: function init() {
    //  listen for new page elements that are added to the #pageContainer object

    var pageContainer = document.querySelector("#pageContainer");
    var observer = new MutationObserver(function (mutations) {
      // xconsole.log("mutations", mutations);
      mutations.forEach(function (mutation) {
        //  trigger page open
        mutation.addedNodes.forEach(function (node) {
          //  is this node a page element?
          if (node.nodeName.toLocaleLowerCase() == "page") {
            //  trigger page open
            _xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("page element added", node);

            //  add observer to this page element for when the data-state="ready"
            var _observer = new MutationObserver(function (mutations) {
              // xconsole.log("node mutations", mutations);
              mutations.filter(function (mutation) {
                return mutation.attributeName == "data-state";
              }).map(function (mutation) {
                return mutation.target;
              }).filter(function (node) {
                return node.getAttribute("data-state") == "ready";
              }).forEach(function (readyPage) {
                // xconsole.log("readyPage", readyPage);
                var cEvent = {
                  node: readyPage,
                  event: new CustomEvent("pageOpen", {
                    bubbles: true
                  })
                };
                if (started) {
                  _xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("triggering ready page open event", cEvent.event);
                  node.dispatchEvent(cEvent.event);
                } else {
                  _xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("queueing ready page open event");
                  eventQueue.push(cEvent);
                }
              });
            });
            _observer.observe(node, {
              attributes: true
            });
          }
        });
      });
    });
    observer.observe(pageContainer, {
      childList: true
    });
  },
  start: function start() {
    started = true;
    _xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("start", eventQueue);
    //  trigger all items in the queue
    eventQueue.forEach(function (item) {
      _xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("triggering page open event", item.event);
      item.node.dispatchEvent(item.event);
    });
  }
};

/***/ }),

/***/ "./src/helpers/xconsole.js":
/*!*********************************!*\
  !*** ./src/helpers/xconsole.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   xconsole: () => (/* binding */ xconsole)
/* harmony export */ });
var _IS_PRODUCTION;
var prefix = "TC:";
var enabled = !((_IS_PRODUCTION = true) !== null && _IS_PRODUCTION !== void 0 ? _IS_PRODUCTION : true);
var xconsole = {
  log: function log() {
    var _console;
    for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
      messages[_key] = arguments[_key];
    }
    if (enabled) (_console = console).log.apply(_console, [prefix].concat(messages));
  },
  error: function error() {
    var _console2;
    for (var _len2 = arguments.length, messages = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      messages[_key2] = arguments[_key2];
    }
    if (enabled) (_console2 = console).error.apply(_console2, [prefix].concat(messages));
  },
  warn: function warn() {
    var _console3;
    for (var _len3 = arguments.length, messages = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      messages[_key3] = arguments[_key3];
    }
    if (enabled) (_console3 = console).warn.apply(_console3, [prefix].concat(messages));
  },
  info: function info() {
    var _console4;
    for (var _len4 = arguments.length, messages = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      messages[_key4] = arguments[_key4];
    }
    if (enabled) (_console4 = console).info.apply(_console4, [prefix].concat(messages));
  }
};

/***/ }),

/***/ "./src/notification-dedup.js":
/*!***********************************!*\
  !*** ./src/notification-dedup.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   notificationDedup: () => (/* binding */ notificationDedup)
/* harmony export */ });
/* harmony import */ var _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/xconsole */ "./src/helpers/xconsole.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

var markOthers = function markOthers(el) {
  el.stopPropagation();
  //click the others with the same text
  var itemNode = el.target.closest("li").querySelector("div");
  var itemText = itemNode.textContent;
  // xconsole.log(itemText);
  //if (itemText == "clear") return;
  // xconsole.log("markOthers", itemText);

  var dataKey = el.target.closest("li").getAttribute("data-key");
  function clickNextButton(itemNode, ignoreDataKey) {
    // Check if there are more buttons to click
    var lists = itemNode.closest("listview");
    var items = lists === null || lists === void 0 ? void 0 : lists.querySelectorAll("ul li");
    if (!items) return;
    var sameItems = Array.from(items).filter(function (i) {
      return i.querySelector("div:first-child").textContent == itemText;
    });
    _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("itemcheck", items, sameItems, itemText);
    if (sameItems.length > 0) {
      var sameItem = sameItems[0];
      var _dataKey = sameItem.getAttribute("data-key");
      if (_dataKey != ignoreDataKey) {
        var button = sameItem.querySelector('button[data-action="clearSingle"]');
        _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("clickNextButton click clear", button);
        button.click();
      }
    } else {
      // Stop the interval if all buttons have been clicked
      _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("clickNextButton done");
      //  run dedup again
      clearInterval(intervalId);
      var _lists = Array(itemNode.closest("listview"));
      dedup(_lists);
    }
  }

  // click the buttons
  var intervalId = setInterval(function () {
    clickNextButton(itemNode, dataKey);
  }, 500);
};
var dedup = function dedup(lists) {
  var _iterator = _createForOfIteratorHelper(lists),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var list = _step.value;
      var uniqueTexts = {};
      //dedup the items
      //xconsole.log("",list);
      var listItems = list.querySelectorAll("ul li");
      var _iterator2 = _createForOfIteratorHelper(listItems),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var listItem = _step2.value;
          //xconsole.log("",listItem);

          //  deduplicate the links
          var textContent = listItem.querySelector("div:first-child").textContent;
          var clearButton = listItem.querySelector('button[data-action="clearSingle"]');
          if (uniqueTexts[textContent]) {
            // If it's a duplicate, hide the list item
            listItem.style.display = "none";
          } else {
            // If it's not a duplicate, mark it as seen
            listItem.addEventListener("click", markOthers);
            //  listen for clear event too
            // clearButton.addEventListener('click', markOthers);
            uniqueTexts[textContent] = true;
          }

          // add  view link, if it doesn't already exist

          if (!listItem.querySelector(".view-button")) {
            // Get the existing clear button and its data-key attribute
            var dataKey = clearButton.getAttribute("data-key");

            // Create the new button element
            var viewButton = document.createElement("button");
            viewButton.setAttribute("type", "button");
            viewButton.setAttribute("class", "btn-action text mini view-button");
            viewButton.setAttribute("data-action", "viewSingle");
            viewButton.setAttribute("data-key", dataKey); // Copy the data-key attribute
            viewButton.textContent = "view";

            // Create the new div element for the view button
            var viewButtonDiv = document.createElement("div");
            viewButtonDiv.setAttribute("class", "flex-none x1 text-center");
            viewButtonDiv.appendChild(viewButton);

            // Get the existing div that contains the "clear" button
            var clearButtonDiv = listItem.querySelector(".flex-none.x1.text-center");

            // Append the new div to the existing list item
            clearButtonDiv.parentNode.insertBefore(viewButtonDiv, clearButtonDiv);
            viewButton.addEventListener("click", function (e) {
              // if not view button, bail
              if (e.target.innerText != "view") return false;
              e.stopPropagation();
              var dataKey = e.target.getAttribute("data-key");
              _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("view clicked", e, dataKey);
              var request = indexedDB.open('wjappDB', 17);

              // Step 2: Setup event handlers for success, error, and onupgradeneeded
              request.onerror = function (event) {
                console.error(" Error opening database:", event.target.error);
              };
              request.onupgradeneeded = function (event) {
                var db = event.target.result;

                // Step 3: Create an object store if it doesn't exist
                if (!db.objectStoreNames.contains('wjappDB')) {
                  db.createObjectStore('wjappDB', {
                    keyPath: 'key'
                  });
                }
              };
              request.onsuccess = function (event) {
                var db = event.target.result;

                // Step 4: Create a transaction and get the object store
                var transaction = db.transaction(["ModuleStorage"], "readonly");
                var objectStore = transaction.objectStore("ModuleStorage");

                // Step 5: Use a request to get the data from the object store
                var getRequest = objectStore.get("common.notifications");
                getRequest.onsuccess = function (event) {
                  var result = event.target.result;
                  _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("dataKey", dataKey);
                  if (result) {
                    var messages = result.messages;
                    var item = messages.find(function (m) {
                      return m.EmailSendLogKey == dataKey;
                    });
                    if (item) {
                      _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("EntityKey", item.EntityKey);
                      Views.openPage(new Action("projects.diary.thread", item.EntityKey, null), "page");
                    }
                  } else {
                    _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log(" No data found for the specified key.");
                  }

                  // Step 6: Close the database connection
                  db.close();
                };
                getRequest.onerror = function (event) {
                  console.error(" Error reading data:", event.target.error);
                  db.close();
                };
              };
            });
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
var notificationDedup = {
  init: function init() {
    window.addEventListener("pageOpen", function (e) {
      // xconsole.log("transitionend", e.target);

      if (e.target.dataset.aid == "common.notifications" && e.target.dataset.state == "ready") {
        //get the events
        var lists = e.target.querySelectorAll("listview[data-source='messages']");
        dedup(lists);
      }
    });
  }
};

/***/ }),

/***/ "./src/pinned-items.js":
/*!*****************************!*\
  !*** ./src/pinned-items.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pinnedItems: () => (/* binding */ pinnedItems)
/* harmony export */ });
/* harmony import */ var _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/xconsole */ "./src/helpers/xconsole.js");
/* harmony import */ var _helpers_cssHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/cssHelper */ "./src/helpers/cssHelper.js");
/* harmony import */ var store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! store */ "./node_modules/store/dist/store.legacy.js");
/* harmony import */ var store__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(store__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var dexie__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dexie */ "./node_modules/dexie/dist/modern/dexie.mjs");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }




var db = new dexie__WEBPACK_IMPORTED_MODULE_3__["default"]("mjbPinsDB");

// Helper function to create "li" elements for messages
function createMessageLiElement(key, message) {
  var hidden = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var li = document.createElement("li");
  li.classList.add("hbox", "pad-tb-m");
  li.setAttribute("data-key", key);
  var flexMessage = document.createElement("div");
  flexMessage.setAttribute("data-key", key);
  flexMessage.classList.add("flex");
  flexMessage.textContent = message;

  //  event handler
  flexMessage.addEventListener("click", function (e) {
    var entityKey = e.target.getAttribute("data-key");
    Views.openPage(new Action("projects.diary.thread", entityKey, null), "page");
  });
  var flexNoneX1TextCenterView = document.createElement("div");
  flexNoneX1TextCenterView.classList.add("flex-none", "x1", "text-center");
  flexNoneX1TextCenterView.innerHTML = '<button type="button" class="btn-action text mini view-button" data-key="' + key + '">view</button>';
  flexNoneX1TextCenterView.addEventListener("click", function (e) {
    var entityKey = e.target.getAttribute("data-key");
    Views.openPage(new Action("projects.diary.thread", entityKey, null), "page");
  });
  var flexNoneX1TextCenterClear = document.createElement("div");
  flexNoneX1TextCenterClear.classList.add("flex-none", "x1", "text-center");
  flexNoneX1TextCenterClear.innerHTML = '<button type="button" class="btn-action text mini" data-key="' + key + '">unpin</button>';
  flexNoneX1TextCenterClear.addEventListener("click", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
      var pins, entityKey, pinCount;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return db.pins.toArray();
          case 2:
            pins = _context.sent;
            entityKey = e.target.getAttribute("data-key");
            if (!pins.length) {
              _context.next = 12;
              break;
            }
            _context.next = 7;
            return db.pins.where("entityKey").equals(entityKey)["delete"]();
          case 7:
            e.target.closest("li").remove();
            _context.next = 10;
            return db.pins.count();
          case 10:
            pinCount = _context.sent;
            if (pinCount == 0) {
              document.querySelector("#pin-container").remove();
            }
          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  li.appendChild(flexMessage);
  li.appendChild(flexNoneX1TextCenterView);
  li.appendChild(flexNoneX1TextCenterClear);
  if (hidden) {
    li.style.display = "none";
  }
  return li;
}
var pinnedItems = {
  init: function init() {
    db.version(1).stores({
      pins: "&entityKey"
    });
    db.on("populate", function () {
      var _store$get;
      //  add old pins into indexedb

      var oldPins = (_store$get = store__WEBPACK_IMPORTED_MODULE_2___default().get("mjb_pins")) !== null && _store$get !== void 0 ? _store$get : [];
      _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log(oldPins);
      if (oldPins.length > 0) {
        oldPins.forEach(function (pin) {
          db.pins.put(pin);
        });
      }
    });
    _helpers_cssHelper__WEBPACK_IMPORTED_MODULE_1__.cssHelper.createOrUpdateStyle("mjb_pins", "button.i-pin::before {\n            content: \"\";\n            background-image: url(\"data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1200 1200' style='enable-background:new 0 0 1200 1200;' xml:space='preserve'%3E%3Cpath d='M715.2,524.1l-19.8-312.6c32.2-19.4,58.2-48.2,73.5-81.8c1.7-3.7,1.4-8-0.8-11.5c-2.2-3.4-6-5.5-10.1-5.5l-316,0c-4.1,0-7.9,2.1-10.1,5.5c-2.2,3.4-2.5,7.8-0.8,11.5c15.4,33.6,41.3,62.3,73.5,81.7l-19.8,312.6c-113.2,47.4-132.3,155.5-133.1,160.2c-0.6,3.5,0.4,7,2.7,9.7c2.3,2.7,5.6,4.2,9.2,4.2l195.6,0l28.8,377h24l28.8-377h195.7c3.5,0,6.9-1.5,9.2-4.2c2.3-2.7,3.3-6.2,2.7-9.7C847.5,679.6,828.4,571.5,715.2,524.1L715.2,524.1z' fill='%230997d5'/%3E%3C/svg%3E\");\n          }");

    //  get pinned item from store

    //  see if we have a full-page refresh that landed on a thread

    window.addEventListener("pageOpen", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(e) {
        var page, container, pinContainer, pins, scrollableDiv, padSection, hbox, flex1, flexNoneX1TextCenter, listview, li, hboxLi, ul, _iterator, _step, pin, pinli, _page, menu, _page$getAttribute, _page$querySelector$i, _page$querySelector, _pins, pinButton, replyButton, entityKey, projectTitle, convoTitle, alreadyPinned, item;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("pageOpen", e.target);
              if (!(e.target.dataset.aid == "common.notifications" && e.target.dataset.state == "ready")) {
                _context4.next = 11;
                break;
              }
              _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("retrieve pins", e.target);
              page = e.target;
              container = page.querySelector("page-body > section > div");
              pinContainer = container.querySelector("#pin-container");
              _context4.next = 8;
              return db.pins.toArray();
            case 8:
              pins = _context4.sent;
              if (pinContainer) pinContainer.remove();
              if (pins.length) {
                _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("ADD PINS", pins);
                //  create pins section
                scrollableDiv = document.createElement("div");
                scrollableDiv.id = "pin-container";
                scrollableDiv.classList.add("scrollable");

                // Create the outer div with class "pad-section"
                padSection = document.createElement("div");
                padSection.classList.add("pad-section");
                scrollableDiv.appendChild(padSection);

                // Create the inner div with class "hbox"
                hbox = document.createElement("div");
                hbox.classList.add("hbox");

                // Create the first inner div with class "flex"
                flex1 = document.createElement("div");
                flex1.classList.add("flex");
                flex1.innerHTML = "<h2>Pins</h2>";

                // Create the second inner div with classes "flex-none x1 text-center"
                flexNoneX1TextCenter = document.createElement("div");
                flexNoneX1TextCenter.classList.add("flex-none", "x1", "text-center");
                flexNoneX1TextCenter.innerHTML = '<button type="button" class="btn-action text bind" data-bind-visible="messages.length" >unpin all</button>';
                flexNoneX1TextCenter.addEventListener("click", /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(e) {
                    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                      while (1) switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return db.pins.clear();
                        case 2:
                          document.querySelector("#pin-container").remove();
                        case 3:
                        case "end":
                          return _context2.stop();
                      }
                    }, _callee2);
                  }));
                  return function (_x3) {
                    return _ref3.apply(this, arguments);
                  };
                }());

                // Append the inner divs to the "hbox"
                hbox.appendChild(flex1);
                hbox.appendChild(flexNoneX1TextCenter);

                // Append the "hbox" to the "padSection"
                padSection.appendChild(hbox);

                // Create the "listview" element with the specified attributes
                listview = document.createElement("listview");
                listview.setAttribute("data-source", "messages");
                listview.setAttribute("data-list-action", "page");
                listview.setAttribute("data-select-mode", "none");
                listview.setAttribute("data-tmpl", "common.notifications.layout95");
                listview.setAttribute("data-id", "");
                listview.classList.add("listview", "ctx", "list");

                // Create the "li" element with class "pad-b-l"
                li = document.createElement("li");
                li.classList.add("pad-b-l");

                // Create the inner divs for the "li" element
                hboxLi = document.createElement("div");
                hboxLi.classList.add("hbox");

                // Append the "hboxLi" to the "li"
                li.appendChild(hboxLi);

                // Create the "ul" element with class "hover-blue" and data-list-action attribute
                ul = document.createElement("ul");
                ul.classList.add("hover-blue");
                ul.setAttribute("data-list-action", "openMessage");

                //  loop through the pins and add them
                _iterator = _createForOfIteratorHelper(pins);
                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    pin = _step.value;
                    pinli = createMessageLiElement(pin.entityKey, "[".concat(pin.projectTitle, "] ").concat(pin.convoTitle));
                    ul.appendChild(pinli);
                  }

                  // Append the "ul" to the "li"
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
                li.appendChild(ul);

                // Append the "li" to the "listview"
                listview.appendChild(li);

                // Append all elements to the document body (or any other container element you desire)
                padSection.appendChild(listview);
                container.prepend(scrollableDiv);
              }
            case 11:
              if (!(e.target.dataset.aid == "projects.diary.thread" && e.target.dataset.state == "ready")) {
                _context4.next = 34;
                break;
              }
              _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("add pin button", e.target);
              _page = e.target;
              menu = e.target.querySelector("header > menu"); //  add pin button if it doesn't aready exist
              if (menu.querySelector(".i-pin")) {
                _context4.next = 34;
                break;
              }
              _context4.next = 18;
              return db.pins.toArray();
            case 18:
              _pins = _context4.sent;
              pinButton = document.createElement("button");
              replyButton = menu.querySelector('[data-action="reply"]');
              entityKey = replyButton ? replyButton.getAttribute("data-key") : "";
              projectTitle = (_page$getAttribute = _page.getAttribute("data-title")) !== null && _page$getAttribute !== void 0 ? _page$getAttribute : "";
              convoTitle = (_page$querySelector$i = (_page$querySelector = _page.querySelector('[data-bind-text="dp@Subject"]')) === null || _page$querySelector === void 0 ? void 0 : _page$querySelector.innerText.trim()) !== null && _page$querySelector$i !== void 0 ? _page$querySelector$i : ""; //  if already pinned, change text to Unpin
              alreadyPinned = _pins.some(function (p) {
                return p.entityKey == entityKey;
              });
              pinButton.classList.add("i-btn");
              pinButton.classList.add("icon-l");
              pinButton.classList.add("text");
              pinButton.classList.add("i-pin");
              pinButton.innerText = alreadyPinned ? "Unpin" : "Pin";
              pinButton.setAttribute("data-key", entityKey); // Copy the data-key attribute
              item = {
                entityKey: entityKey,
                projectTitle: projectTitle,
                convoTitle: convoTitle
              };
              pinButton.addEventListener("click", /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(e) {
                  var pinButton, entityKey, alreadyPinned;
                  return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                    while (1) switch (_context3.prev = _context3.next) {
                      case 0:
                        pinButton = e.target;
                        entityKey = pinButton ? pinButton.getAttribute("data-key") : "";
                        _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("pin", pinButton, entityKey);

                        //  get and store entity key
                        _context3.next = 5;
                        return db.pins.get(entityKey);
                      case 5:
                        alreadyPinned = _context3.sent;
                        if (!alreadyPinned) {
                          _context3.next = 12;
                          break;
                        }
                        _context3.next = 9;
                        return db.pins.where("entityKey").equals(entityKey)["delete"]();
                      case 9:
                        pinButton.innerText = "Pin";
                        _context3.next = 15;
                        break;
                      case 12:
                        _context3.next = 14;
                        return db.pins.put(item);
                      case 14:
                        pinButton.innerText = "Unpin";
                      case 15:
                      case "end":
                        return _context3.stop();
                    }
                  }, _callee3);
                }));
                return function (_x4) {
                  return _ref4.apply(this, arguments);
                };
              }());
              menu.appendChild(pinButton);
            case 34:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  }
};

/***/ }),

/***/ "./node_modules/store/dist/store.legacy.js":
/*!*************************************************!*\
  !*** ./node_modules/store/dist/store.legacy.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var engine = __webpack_require__(/*! ../src/store-engine */ "./node_modules/store/src/store-engine.js")

var storages = __webpack_require__(/*! ../storages/all */ "./node_modules/store/storages/all.js")
var plugins = [__webpack_require__(/*! ../plugins/json2 */ "./node_modules/store/plugins/json2.js")]

module.exports = engine.createStore(storages, plugins)


/***/ }),

/***/ "./node_modules/store/plugins/json2.js":
/*!*********************************************!*\
  !*** ./node_modules/store/plugins/json2.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = json2Plugin

function json2Plugin() {
	__webpack_require__(/*! ./lib/json2 */ "./node_modules/store/plugins/lib/json2.js")
	return {}
}


/***/ }),

/***/ "./node_modules/store/plugins/lib/json2.js":
/*!*************************************************!*\
  !*** ./node_modules/store/plugins/lib/json2.js ***!
  \*************************************************/
/***/ (() => {

/* eslint-disable */

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + "-" +
                        f(this.getUTCMonth() + 1) + "-" +
                        f(this.getUTCDate()) + "T" +
                        f(this.getUTCHours()) + ":" +
                        f(this.getUTCMinutes()) + ":" +
                        f(this.getUTCSeconds()) + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
                typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value)
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" +
                            ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());

/***/ }),

/***/ "./node_modules/store/src/store-engine.js":
/*!************************************************!*\
  !*** ./node_modules/store/src/store-engine.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(/*! ./util */ "./node_modules/store/src/util.js")
var slice = util.slice
var pluck = util.pluck
var each = util.each
var bind = util.bind
var create = util.create
var isList = util.isList
var isFunction = util.isFunction
var isObject = util.isObject

module.exports = {
	createStore: createStore
}

var storeAPI = {
	version: '2.0.12',
	enabled: false,
	
	// get returns the value of the given key. If that value
	// is undefined, it returns optionalDefaultValue instead.
	get: function(key, optionalDefaultValue) {
		var data = this.storage.read(this._namespacePrefix + key)
		return this._deserialize(data, optionalDefaultValue)
	},

	// set will store the given value at key and returns value.
	// Calling set with value === undefined is equivalent to calling remove.
	set: function(key, value) {
		if (value === undefined) {
			return this.remove(key)
		}
		this.storage.write(this._namespacePrefix + key, this._serialize(value))
		return value
	},

	// remove deletes the key and value stored at the given key.
	remove: function(key) {
		this.storage.remove(this._namespacePrefix + key)
	},

	// each will call the given callback once for each key-value pair
	// in this store.
	each: function(callback) {
		var self = this
		this.storage.each(function(val, namespacedKey) {
			callback.call(self, self._deserialize(val), (namespacedKey || '').replace(self._namespaceRegexp, ''))
		})
	},

	// clearAll will remove all the stored key-value pairs in this store.
	clearAll: function() {
		this.storage.clearAll()
	},

	// additional functionality that can't live in plugins
	// ---------------------------------------------------

	// hasNamespace returns true if this store instance has the given namespace.
	hasNamespace: function(namespace) {
		return (this._namespacePrefix == '__storejs_'+namespace+'_')
	},

	// createStore creates a store.js instance with the first
	// functioning storage in the list of storage candidates,
	// and applies the the given mixins to the instance.
	createStore: function() {
		return createStore.apply(this, arguments)
	},
	
	addPlugin: function(plugin) {
		this._addPlugin(plugin)
	},
	
	namespace: function(namespace) {
		return createStore(this.storage, this.plugins, namespace)
	}
}

function _warn() {
	var _console = (typeof console == 'undefined' ? null : console)
	if (!_console) { return }
	var fn = (_console.warn ? _console.warn : _console.log)
	fn.apply(_console, arguments)
}

function createStore(storages, plugins, namespace) {
	if (!namespace) {
		namespace = ''
	}
	if (storages && !isList(storages)) {
		storages = [storages]
	}
	if (plugins && !isList(plugins)) {
		plugins = [plugins]
	}

	var namespacePrefix = (namespace ? '__storejs_'+namespace+'_' : '')
	var namespaceRegexp = (namespace ? new RegExp('^'+namespacePrefix) : null)
	var legalNamespaces = /^[a-zA-Z0-9_\-]*$/ // alpha-numeric + underscore and dash
	if (!legalNamespaces.test(namespace)) {
		throw new Error('store.js namespaces can only have alphanumerics + underscores and dashes')
	}
	
	var _privateStoreProps = {
		_namespacePrefix: namespacePrefix,
		_namespaceRegexp: namespaceRegexp,

		_testStorage: function(storage) {
			try {
				var testStr = '__storejs__test__'
				storage.write(testStr, testStr)
				var ok = (storage.read(testStr) === testStr)
				storage.remove(testStr)
				return ok
			} catch(e) {
				return false
			}
		},

		_assignPluginFnProp: function(pluginFnProp, propName) {
			var oldFn = this[propName]
			this[propName] = function pluginFn() {
				var args = slice(arguments, 0)
				var self = this

				// super_fn calls the old function which was overwritten by
				// this mixin.
				function super_fn() {
					if (!oldFn) { return }
					each(arguments, function(arg, i) {
						args[i] = arg
					})
					return oldFn.apply(self, args)
				}

				// Give mixing function access to super_fn by prefixing all mixin function
				// arguments with super_fn.
				var newFnArgs = [super_fn].concat(args)

				return pluginFnProp.apply(self, newFnArgs)
			}
		},

		_serialize: function(obj) {
			return JSON.stringify(obj)
		},

		_deserialize: function(strVal, defaultVal) {
			if (!strVal) { return defaultVal }
			// It is possible that a raw string value has been previously stored
			// in a storage without using store.js, meaning it will be a raw
			// string value instead of a JSON serialized string. By defaulting
			// to the raw string value in case of a JSON parse error, we allow
			// for past stored values to be forwards-compatible with store.js
			var val = ''
			try { val = JSON.parse(strVal) }
			catch(e) { val = strVal }

			return (val !== undefined ? val : defaultVal)
		},
		
		_addStorage: function(storage) {
			if (this.enabled) { return }
			if (this._testStorage(storage)) {
				this.storage = storage
				this.enabled = true
			}
		},

		_addPlugin: function(plugin) {
			var self = this

			// If the plugin is an array, then add all plugins in the array.
			// This allows for a plugin to depend on other plugins.
			if (isList(plugin)) {
				each(plugin, function(plugin) {
					self._addPlugin(plugin)
				})
				return
			}

			// Keep track of all plugins we've seen so far, so that we
			// don't add any of them twice.
			var seenPlugin = pluck(this.plugins, function(seenPlugin) {
				return (plugin === seenPlugin)
			})
			if (seenPlugin) {
				return
			}
			this.plugins.push(plugin)

			// Check that the plugin is properly formed
			if (!isFunction(plugin)) {
				throw new Error('Plugins must be function values that return objects')
			}

			var pluginProperties = plugin.call(this)
			if (!isObject(pluginProperties)) {
				throw new Error('Plugins must return an object of function properties')
			}

			// Add the plugin function properties to this store instance.
			each(pluginProperties, function(pluginFnProp, propName) {
				if (!isFunction(pluginFnProp)) {
					throw new Error('Bad plugin property: '+propName+' from plugin '+plugin.name+'. Plugins should only return functions.')
				}
				self._assignPluginFnProp(pluginFnProp, propName)
			})
		},
		
		// Put deprecated properties in the private API, so as to not expose it to accidential
		// discovery through inspection of the store object.
		
		// Deprecated: addStorage
		addStorage: function(storage) {
			_warn('store.addStorage(storage) is deprecated. Use createStore([storages])')
			this._addStorage(storage)
		}
	}

	var store = create(_privateStoreProps, storeAPI, {
		plugins: []
	})
	store.raw = {}
	each(store, function(prop, propName) {
		if (isFunction(prop)) {
			store.raw[propName] = bind(store, prop)			
		}
	})
	each(storages, function(storage) {
		store._addStorage(storage)
	})
	each(plugins, function(plugin) {
		store._addPlugin(plugin)
	})
	return store
}


/***/ }),

/***/ "./node_modules/store/src/util.js":
/*!****************************************!*\
  !*** ./node_modules/store/src/util.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assign = make_assign()
var create = make_create()
var trim = make_trim()
var Global = (typeof window !== 'undefined' ? window : __webpack_require__.g)

module.exports = {
	assign: assign,
	create: create,
	trim: trim,
	bind: bind,
	slice: slice,
	each: each,
	map: map,
	pluck: pluck,
	isList: isList,
	isFunction: isFunction,
	isObject: isObject,
	Global: Global
}

function make_assign() {
	if (Object.assign) {
		return Object.assign
	} else {
		return function shimAssign(obj, props1, props2, etc) {
			for (var i = 1; i < arguments.length; i++) {
				each(Object(arguments[i]), function(val, key) {
					obj[key] = val
				})
			}			
			return obj
		}
	}
}

function make_create() {
	if (Object.create) {
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			return assign.apply(this, [Object.create(obj)].concat(assignArgsList))
		}
	} else {
		function F() {} // eslint-disable-line no-inner-declarations
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			F.prototype = obj
			return assign.apply(this, [new F()].concat(assignArgsList))
		}
	}
}

function make_trim() {
	if (String.prototype.trim) {
		return function trim(str) {
			return String.prototype.trim.call(str)
		}
	} else {
		return function trim(str) {
			return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
		}
	}
}

function bind(obj, fn) {
	return function() {
		return fn.apply(obj, Array.prototype.slice.call(arguments, 0))
	}
}

function slice(arr, index) {
	return Array.prototype.slice.call(arr, index || 0)
}

function each(obj, fn) {
	pluck(obj, function(val, key) {
		fn(val, key)
		return false
	})
}

function map(obj, fn) {
	var res = (isList(obj) ? [] : {})
	pluck(obj, function(v, k) {
		res[k] = fn(v, k)
		return false
	})
	return res
}

function pluck(obj, fn) {
	if (isList(obj)) {
		for (var i=0; i<obj.length; i++) {
			if (fn(obj[i], i)) {
				return obj[i]
			}
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn(obj[key], key)) {
					return obj[key]
				}
			}
		}
	}
}

function isList(val) {
	return (val != null && typeof val != 'function' && typeof val.length == 'number')
}

function isFunction(val) {
	return val && {}.toString.call(val) === '[object Function]'
}

function isObject(val) {
	return val && {}.toString.call(val) === '[object Object]'
}


/***/ }),

/***/ "./node_modules/store/storages/all.js":
/*!********************************************!*\
  !*** ./node_modules/store/storages/all.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = [
	// Listed in order of usage preference
	__webpack_require__(/*! ./localStorage */ "./node_modules/store/storages/localStorage.js"),
	__webpack_require__(/*! ./oldFF-globalStorage */ "./node_modules/store/storages/oldFF-globalStorage.js"),
	__webpack_require__(/*! ./oldIE-userDataStorage */ "./node_modules/store/storages/oldIE-userDataStorage.js"),
	__webpack_require__(/*! ./cookieStorage */ "./node_modules/store/storages/cookieStorage.js"),
	__webpack_require__(/*! ./sessionStorage */ "./node_modules/store/storages/sessionStorage.js"),
	__webpack_require__(/*! ./memoryStorage */ "./node_modules/store/storages/memoryStorage.js")
]


/***/ }),

/***/ "./node_modules/store/storages/cookieStorage.js":
/*!******************************************************!*\
  !*** ./node_modules/store/storages/cookieStorage.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// cookieStorage is useful Safari private browser mode, where localStorage
// doesn't work but cookies do. This implementation is adopted from
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global
var trim = util.trim

module.exports = {
	name: 'cookieStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var doc = Global.document

function read(key) {
	if (!key || !_has(key)) { return null }
	var regexpStr = "(?:^|.*;\\s*)" +
		escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
		"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
	return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
}

function each(callback) {
	var cookies = doc.cookie.split(/; ?/g)
	for (var i = cookies.length - 1; i >= 0; i--) {
		if (!trim(cookies[i])) {
			continue
		}
		var kvp = cookies[i].split('=')
		var key = unescape(kvp[0])
		var val = unescape(kvp[1])
		callback(val, key)
	}
}

function write(key, data) {
	if(!key) { return }
	doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/"
}

function remove(key) {
	if (!key || !_has(key)) {
		return
	}
	doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}

function clearAll() {
	each(function(_, key) {
		remove(key)
	})
}

function _has(key) {
	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
}


/***/ }),

/***/ "./node_modules/store/storages/localStorage.js":
/*!*****************************************************!*\
  !*** ./node_modules/store/storages/localStorage.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global

module.exports = {
	name: 'localStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

function localStorage() {
	return Global.localStorage
}

function read(key) {
	return localStorage().getItem(key)
}

function write(key, data) {
	return localStorage().setItem(key, data)
}

function each(fn) {
	for (var i = localStorage().length - 1; i >= 0; i--) {
		var key = localStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return localStorage().removeItem(key)
}

function clearAll() {
	return localStorage().clear()
}


/***/ }),

/***/ "./node_modules/store/storages/memoryStorage.js":
/*!******************************************************!*\
  !*** ./node_modules/store/storages/memoryStorage.js ***!
  \******************************************************/
/***/ ((module) => {

// memoryStorage is a useful last fallback to ensure that the store
// is functions (meaning store.get(), store.set(), etc will all function).
// However, stored values will not persist when the browser navigates to
// a new page or reloads the current page.

module.exports = {
	name: 'memoryStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var memoryStorage = {}

function read(key) {
	return memoryStorage[key]
}

function write(key, data) {
	memoryStorage[key] = data
}

function each(callback) {
	for (var key in memoryStorage) {
		if (memoryStorage.hasOwnProperty(key)) {
			callback(memoryStorage[key], key)
		}
	}
}

function remove(key) {
	delete memoryStorage[key]
}

function clearAll(key) {
	memoryStorage = {}
}


/***/ }),

/***/ "./node_modules/store/storages/oldFF-globalStorage.js":
/*!************************************************************!*\
  !*** ./node_modules/store/storages/oldFF-globalStorage.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// oldFF-globalStorage provides storage for Firefox
// versions 6 and 7, where no localStorage, etc
// is available.

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global

module.exports = {
	name: 'oldFF-globalStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var globalStorage = Global.globalStorage

function read(key) {
	return globalStorage[key]
}

function write(key, data) {
	globalStorage[key] = data
}

function each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		fn(globalStorage[key], key)
	}
}

function remove(key) {
	return globalStorage.removeItem(key)
}

function clearAll() {
	each(function(key, _) {
		delete globalStorage[key]
	})
}


/***/ }),

/***/ "./node_modules/store/storages/oldIE-userDataStorage.js":
/*!**************************************************************!*\
  !*** ./node_modules/store/storages/oldIE-userDataStorage.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// oldIE-userDataStorage provides storage for Internet Explorer
// versions 6 and 7, where no localStorage, sessionStorage, etc
// is available.

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global

module.exports = {
	name: 'oldIE-userDataStorage',
	write: write,
	read: read,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var storageName = 'storejs'
var doc = Global.document
var _withStorageEl = _makeIEStorageElFunction()
var disable = (Global.navigator ? Global.navigator.userAgent : '').match(/ (MSIE 8|MSIE 9|MSIE 10)\./) // MSIE 9.x, MSIE 10.x

function write(unfixedKey, data) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.setAttribute(fixedKey, data)
		storageEl.save(storageName)
	})
}

function read(unfixedKey) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	var res = null
	_withStorageEl(function(storageEl) {
		res = storageEl.getAttribute(fixedKey)
	})
	return res
}

function each(callback) {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		for (var i=attributes.length-1; i>=0; i--) {
			var attr = attributes[i]
			callback(storageEl.getAttribute(attr.name), attr.name)
		}
	})
}

function remove(unfixedKey) {
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.removeAttribute(fixedKey)
		storageEl.save(storageName)
	})
}

function clearAll() {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		storageEl.load(storageName)
		for (var i=attributes.length-1; i>=0; i--) {
			storageEl.removeAttribute(attributes[i].name)
		}
		storageEl.save(storageName)
	})
}

// Helpers
//////////

// In IE7, keys cannot start with a digit or contain certain chars.
// See https://github.com/marcuswestin/store.js/issues/40
// See https://github.com/marcuswestin/store.js/issues/83
var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
function fixKey(key) {
	return key.replace(/^\d/, '___$&').replace(forbiddenCharsRegex, '___')
}

function _makeIEStorageElFunction() {
	if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
		return null
	}
	var scriptTag = 'script',
		storageOwner,
		storageContainer,
		storageEl

	// Since #userData storage applies only to specific paths, we need to
	// somehow link our data to a specific path.  We choose /favicon.ico
	// as a pretty safe option, since all browsers already make a request to
	// this URL anyway and being a 404 will not hurt us here.  We wrap an
	// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
	// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
	// since the iframe access rules appear to allow direct access and
	// manipulation of the document element, even for a 404 page.  This
	// document can be used instead of the current document (which would
	// have been limited to the current path) to perform #userData storage.
	try {
		/* global ActiveXObject */
		storageContainer = new ActiveXObject('htmlfile')
		storageContainer.open()
		storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
		storageContainer.close()
		storageOwner = storageContainer.w.frames[0].document
		storageEl = storageOwner.createElement('div')
	} catch(e) {
		// somehow ActiveXObject instantiation failed (perhaps some special
		// security settings or otherwse), fall back to per-path storage
		storageEl = doc.createElement('div')
		storageOwner = doc.body
	}

	return function(storeFunction) {
		var args = [].slice.call(arguments, 0)
		args.unshift(storageEl)
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		storageOwner.appendChild(storageEl)
		storageEl.addBehavior('#default#userData')
		storageEl.load(storageName)
		storeFunction.apply(this, args)
		storageOwner.removeChild(storageEl)
		return
	}
}


/***/ }),

/***/ "./node_modules/store/storages/sessionStorage.js":
/*!*******************************************************!*\
  !*** ./node_modules/store/storages/sessionStorage.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global

module.exports = {
	name: 'sessionStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll
}

function sessionStorage() {
	return Global.sessionStorage
}

function read(key) {
	return sessionStorage().getItem(key)
}

function write(key, data) {
	return sessionStorage().setItem(key, data)
}

function each(fn) {
	for (var i = sessionStorage().length - 1; i >= 0; i--) {
		var key = sessionStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return sessionStorage().removeItem(key)
}

function clearAll() {
	return sessionStorage().clear()
}


/***/ }),

/***/ "./node_modules/dexie/dist/modern/dexie.mjs":
/*!**************************************************!*\
  !*** ./node_modules/dexie/dist/modern/dexie.mjs ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dexie: () => (/* binding */ Dexie$1),
/* harmony export */   RangeSet: () => (/* binding */ RangeSet),
/* harmony export */   "default": () => (/* binding */ Dexie$1),
/* harmony export */   liveQuery: () => (/* binding */ liveQuery),
/* harmony export */   mergeRanges: () => (/* binding */ mergeRanges),
/* harmony export */   rangesOverlap: () => (/* binding */ rangesOverlap)
/* harmony export */ });
/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version 3.2.7, Wed Mar 20 2024
 *
 * https://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */
 
const _global = typeof globalThis !== 'undefined' ? globalThis :
    typeof self !== 'undefined' ? self :
        typeof window !== 'undefined' ? window :
            global;

const keys = Object.keys;
const isArray = Array.isArray;
if (typeof Promise !== 'undefined' && !_global.Promise) {
    _global.Promise = Promise;
}
function extend(obj, extension) {
    if (typeof extension !== 'object')
        return obj;
    keys(extension).forEach(function (key) {
        obj[key] = extension[key];
    });
    return obj;
}
const getProto = Object.getPrototypeOf;
const _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
    return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
    if (typeof extension === 'function')
        extension = extension(getProto(proto));
    (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(key => {
        setProp(proto, key, extension[key]);
    });
}
const defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
    defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
        { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
        { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
    return {
        from: function (Parent) {
            Child.prototype = Object.create(Parent.prototype);
            setProp(Child.prototype, "constructor", Child);
            return {
                extend: props.bind(null, Child.prototype)
            };
        }
    };
}
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
    const pd = getOwnPropertyDescriptor(obj, prop);
    let proto;
    return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
const _slice = [].slice;
function slice(args, start, end) {
    return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
    return overridedFactory(origFunc);
}
function assert(b) {
    if (!b)
        throw new Error("Assertion Failed");
}
function asap$1(fn) {
    if (_global.setImmediate)
        setImmediate(fn);
    else
        setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
    return array.reduce((result, item, i) => {
        var nameAndValue = extractor(item, i);
        if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
        return result;
    }, {});
}
function tryCatch(fn, onerror, args) {
    try {
        fn.apply(null, args);
    }
    catch (ex) {
        onerror && onerror(ex);
    }
}
function getByKeyPath(obj, keyPath) {
    if (typeof keyPath === 'string' && hasOwn(obj, keyPath))
        return obj[keyPath];
    if (!keyPath)
        return obj;
    if (typeof keyPath !== 'string') {
        var rv = [];
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            var val = getByKeyPath(obj, keyPath[i]);
            rv.push(val);
        }
        return rv;
    }
    var period = keyPath.indexOf('.');
    if (period !== -1) {
        var innerObj = obj[keyPath.substr(0, period)];
        return innerObj == null ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return undefined;
}
function setByKeyPath(obj, keyPath, value) {
    if (!obj || keyPath === undefined)
        return;
    if ('isFrozen' in Object && Object.isFrozen(obj))
        return;
    if (typeof keyPath !== 'string' && 'length' in keyPath) {
        assert(typeof value !== 'string' && 'length' in value);
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            setByKeyPath(obj, keyPath[i], value[i]);
        }
    }
    else {
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var currentKeyPath = keyPath.substr(0, period);
            var remainingKeyPath = keyPath.substr(period + 1);
            if (remainingKeyPath === "")
                if (value === undefined) {
                    if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                        obj.splice(currentKeyPath, 1);
                    else
                        delete obj[currentKeyPath];
                }
                else
                    obj[currentKeyPath] = value;
            else {
                var innerObj = obj[currentKeyPath];
                if (!innerObj || !hasOwn(obj, currentKeyPath))
                    innerObj = (obj[currentKeyPath] = {});
                setByKeyPath(innerObj, remainingKeyPath, value);
            }
        }
        else {
            if (value === undefined) {
                if (isArray(obj) && !isNaN(parseInt(keyPath)))
                    obj.splice(keyPath, 1);
                else
                    delete obj[keyPath];
            }
            else
                obj[keyPath] = value;
        }
    }
}
function delByKeyPath(obj, keyPath) {
    if (typeof keyPath === 'string')
        setByKeyPath(obj, keyPath, undefined);
    else if ('length' in keyPath)
        [].map.call(keyPath, function (kp) {
            setByKeyPath(obj, kp, undefined);
        });
}
function shallowClone(obj) {
    var rv = {};
    for (var m in obj) {
        if (hasOwn(obj, m))
            rv[m] = obj[m];
    }
    return rv;
}
const concat = [].concat;
function flatten(a) {
    return concat.apply([], a);
}
const intrinsicTypeNames = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey"
    .split(',').concat(flatten([8, 16, 32, 64].map(num => ["Int", "Uint", "Float"].map(t => t + num + "Array")))).filter(t => _global[t]);
const intrinsicTypes = intrinsicTypeNames.map(t => _global[t]);
arrayToObject(intrinsicTypeNames, x => [x, true]);
let circularRefs = null;
function deepClone(any) {
    circularRefs = typeof WeakMap !== 'undefined' && new WeakMap();
    const rv = innerDeepClone(any);
    circularRefs = null;
    return rv;
}
function innerDeepClone(any) {
    if (!any || typeof any !== 'object')
        return any;
    let rv = circularRefs && circularRefs.get(any);
    if (rv)
        return rv;
    if (isArray(any)) {
        rv = [];
        circularRefs && circularRefs.set(any, rv);
        for (var i = 0, l = any.length; i < l; ++i) {
            rv.push(innerDeepClone(any[i]));
        }
    }
    else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
        rv = any;
    }
    else {
        const proto = getProto(any);
        rv = proto === Object.prototype ? {} : Object.create(proto);
        circularRefs && circularRefs.set(any, rv);
        for (var prop in any) {
            if (hasOwn(any, prop)) {
                rv[prop] = innerDeepClone(any[prop]);
            }
        }
    }
    return rv;
}
const { toString } = {};
function toStringTag(o) {
    return toString.call(o).slice(8, -1);
}
const iteratorSymbol = typeof Symbol !== 'undefined' ?
    Symbol.iterator :
    '@@iterator';
const getIteratorOf = typeof iteratorSymbol === "symbol" ? function (x) {
    var i;
    return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function () { return null; };
const NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
    var i, a, x, it;
    if (arguments.length === 1) {
        if (isArray(arrayLike))
            return arrayLike.slice();
        if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
            return [arrayLike];
        if ((it = getIteratorOf(arrayLike))) {
            a = [];
            while ((x = it.next()), !x.done)
                a.push(x.value);
            return a;
        }
        if (arrayLike == null)
            return [arrayLike];
        i = arrayLike.length;
        if (typeof i === 'number') {
            a = new Array(i);
            while (i--)
                a[i] = arrayLike[i];
            return a;
        }
        return [arrayLike];
    }
    i = arguments.length;
    a = new Array(i);
    while (i--)
        a[i] = arguments[i];
    return a;
}
const isAsyncFunction = typeof Symbol !== 'undefined'
    ? (fn) => fn[Symbol.toStringTag] === 'AsyncFunction'
    : () => false;

var debug = typeof location !== 'undefined' &&
    /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
    debug = value;
    libraryFilter = filter;
}
var libraryFilter = () => true;
const NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
    if (NEEDS_THROW_FOR_STACK)
        try {
            getErrorWithStack.arguments;
            throw new Error();
        }
        catch (e) {
            return e;
        }
    return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
    var stack = exception.stack;
    if (!stack)
        return "";
    numIgnoredFrames = (numIgnoredFrames || 0);
    if (stack.indexOf(exception.name) === 0)
        numIgnoredFrames += (exception.name + exception.message).split('\n').length;
    return stack.split('\n')
        .slice(numIgnoredFrames)
        .filter(libraryFilter)
        .map(frame => "\n" + frame)
        .join('');
}

var dexieErrorNames = [
    'Modify',
    'Bulk',
    'OpenFailed',
    'VersionChange',
    'Schema',
    'Upgrade',
    'InvalidTable',
    'MissingAPI',
    'NoSuchDatabase',
    'InvalidArgument',
    'SubTransaction',
    'Unsupported',
    'Internal',
    'DatabaseClosed',
    'PrematureCommit',
    'ForeignAwait'
];
var idbDomErrorNames = [
    'Unknown',
    'Constraint',
    'Data',
    'TransactionInactive',
    'ReadOnly',
    'Version',
    'NotFound',
    'InvalidState',
    'InvalidAccess',
    'Abort',
    'Timeout',
    'QuotaExceeded',
    'Syntax',
    'DataClone'
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
    VersionChanged: "Database version changed by other database connection",
    DatabaseClosed: "Database has been closed",
    Abort: "Transaction aborted",
    TransactionInactive: "Transaction has already completed or failed",
    MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
};
function DexieError(name, msg) {
    this._e = getErrorWithStack();
    this.name = name;
    this.message = msg;
}
derive(DexieError).from(Error).extend({
    stack: {
        get: function () {
            return this._stack ||
                (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
        }
    },
    toString: function () { return this.name + ": " + this.message; }
});
function getMultiErrorMessage(msg, failures) {
    return msg + ". Errors: " + Object.keys(failures)
        .map(key => failures[key].toString())
        .filter((v, i, s) => s.indexOf(v) === i)
        .join('\n');
}
function ModifyError(msg, failures, successCount, failedKeys) {
    this._e = getErrorWithStack();
    this.failures = failures;
    this.failedKeys = failedKeys;
    this.successCount = successCount;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
    this._e = getErrorWithStack();
    this.name = "BulkError";
    this.failures = Object.keys(failures).map(pos => failures[pos]);
    this.failuresByPos = failures;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce((obj, name) => (obj[name] = name + "Error", obj), {});
const BaseException = DexieError;
var exceptions = errorList.reduce((obj, name) => {
    var fullName = name + "Error";
    function DexieError(msgOrInner, inner) {
        this._e = getErrorWithStack();
        this.name = fullName;
        if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
        }
        else if (typeof msgOrInner === 'string') {
            this.message = `${msgOrInner}${!inner ? '' : '\n ' + inner}`;
            this.inner = inner || null;
        }
        else if (typeof msgOrInner === 'object') {
            this.message = `${msgOrInner.name} ${msgOrInner.message}`;
            this.inner = msgOrInner;
        }
    }
    derive(DexieError).from(BaseException);
    obj[name] = DexieError;
    return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce((obj, name) => {
    obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
function mapError(domError, message) {
    if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
        return domError;
    var rv = new exceptionMap[domError.name](message || domError.message, domError);
    if ("stack" in domError) {
        setProp(rv, "stack", { get: function () {
                return this.inner.stack;
            } });
    }
    return rv;
}
var fullNameExceptions = errorList.reduce((obj, name) => {
    if (["Syntax", "Type", "Range"].indexOf(name) === -1)
        obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;

function nop() { }
function mirror(val) { return val; }
function pureFunctionChain(f1, f2) {
    if (f1 == null || f1 === mirror)
        return f2;
    return function (val) {
        return f2(f1(val));
    };
}
function callBoth(on1, on2) {
    return function () {
        on1.apply(this, arguments);
        on2.apply(this, arguments);
    };
}
function hookCreatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res !== undefined)
            arguments[0] = res;
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res2 !== undefined ? res2 : res;
    };
}
function hookDeletingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        f1.apply(this, arguments);
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = this.onerror = null;
        f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    };
}
function hookUpdatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function (modifications) {
        var res = f1.apply(this, arguments);
        extend(modifications, res);
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res === undefined ?
            (res2 === undefined ? undefined : res2) :
            (extend(res, res2));
    };
}
function reverseStoppableEventChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        if (f2.apply(this, arguments) === false)
            return false;
        return f1.apply(this, arguments);
    };
}
function promisableChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res && typeof res.then === 'function') {
            var thiz = this, i = arguments.length, args = new Array(i);
            while (i--)
                args[i] = arguments[i];
            return res.then(function () {
                return f2.apply(thiz, args);
            });
        }
        return f2.apply(this, arguments);
    };
}

var INTERNAL = {};
const LONG_STACKS_CLIP_LIMIT = 100,
MAX_LONG_STACKS = 20, ZONE_ECHO_LIMIT = 100, [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] = typeof Promise === 'undefined' ?
    [] :
    (() => {
        let globalP = Promise.resolve();
        if (typeof crypto === 'undefined' || !crypto.subtle)
            return [globalP, getProto(globalP), globalP];
        const nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [
            nativeP,
            getProto(nativeP),
            globalP
        ];
    })(), nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
const NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
const patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ?
    () => { resolvedGlobalPromise.then(physicalTick); }
    :
        _global.setImmediate ?
            setImmediate.bind(null, physicalTick) :
            _global.MutationObserver ?
                () => {
                    var hiddenDiv = document.createElement("div");
                    (new MutationObserver(() => {
                        physicalTick();
                        hiddenDiv = null;
                    })).observe(hiddenDiv, { attributes: true });
                    hiddenDiv.setAttribute('i', '1');
                } :
                () => { setTimeout(physicalTick, 0); };
var asap = function (callback, args) {
    microtickQueue.push([callback, args]);
    if (needsNewPhysicalTick) {
        schedulePhysicalTick();
        needsNewPhysicalTick = false;
    }
};
var isOutsideMicroTick = true,
needsNewPhysicalTick = true,
unhandledErrors = [],
rejectingErrors = [],
currentFulfiller = null, rejectionMapper = mirror;
var globalPSD = {
    id: 'global',
    global: true,
    ref: 0,
    unhandleds: [],
    onunhandled: globalError,
    pgp: false,
    env: {},
    finalize: function () {
        this.unhandleds.forEach(uh => {
            try {
                globalError(uh[0], uh[1]);
            }
            catch (e) { }
        });
    }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
    if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
    this._listeners = [];
    this.onuncatched = nop;
    this._lib = false;
    var psd = (this._PSD = PSD);
    if (debug) {
        this._stackHolder = getErrorWithStack();
        this._prev = null;
        this._numPrev = 0;
    }
    if (typeof fn !== 'function') {
        if (fn !== INTERNAL)
            throw new TypeError('Not a function');
        this._state = arguments[1];
        this._value = arguments[2];
        if (this._state === false)
            handleRejection(this, this._value);
        return;
    }
    this._state = null;
    this._value = null;
    ++psd.ref;
    executePromiseTask(this, fn);
}
const thenProp = {
    get: function () {
        var psd = PSD, microTaskId = totalEchoes;
        function then(onFulfilled, onRejected) {
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            const cleanup = possibleAwait && !decrementExpectedAwaits();
            var rv = new DexiePromise((resolve, reject) => {
                propagateToListener(this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
            });
            debug && linkToPreviousPromise(rv, this);
            return rv;
        }
        then.prototype = INTERNAL;
        return then;
    },
    set: function (value) {
        setProp(this, 'then', value && value.prototype === INTERNAL ?
            thenProp :
            {
                get: function () {
                    return value;
                },
                set: thenProp.set
            });
    }
};
props(DexiePromise.prototype, {
    then: thenProp,
    _then: function (onFulfilled, onRejected) {
        propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
    },
    catch: function (onRejected) {
        if (arguments.length === 1)
            return this.then(null, onRejected);
        var type = arguments[0], handler = arguments[1];
        return typeof type === 'function' ? this.then(null, err =>
        err instanceof type ? handler(err) : PromiseReject(err))
            : this.then(null, err =>
            err && err.name === type ? handler(err) : PromiseReject(err));
    },
    finally: function (onFinally) {
        return this.then(value => {
            onFinally();
            return value;
        }, err => {
            onFinally();
            return PromiseReject(err);
        });
    },
    stack: {
        get: function () {
            if (this._stack)
                return this._stack;
            try {
                stack_being_generated = true;
                var stacks = getStack(this, [], MAX_LONG_STACKS);
                var stack = stacks.join("\nFrom previous: ");
                if (this._state !== null)
                    this._stack = stack;
                return stack;
            }
            finally {
                stack_being_generated = false;
            }
        }
    },
    timeout: function (ms, msg) {
        return ms < Infinity ?
            new DexiePromise((resolve, reject) => {
                var handle = setTimeout(() => reject(new exceptions.Timeout(msg)), ms);
                this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
            }) : this;
    }
});
if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
    setProp(DexiePromise.prototype, Symbol.toStringTag, 'Dexie.Promise');
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
    this.psd = zone;
}
props(DexiePromise, {
    all: function () {
        var values = getArrayOf.apply(null, arguments)
            .map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve, reject) {
            if (values.length === 0)
                resolve([]);
            var remaining = values.length;
            values.forEach((a, i) => DexiePromise.resolve(a).then(x => {
                values[i] = x;
                if (!--remaining)
                    resolve(values);
            }, reject));
        });
    },
    resolve: value => {
        if (value instanceof DexiePromise)
            return value;
        if (value && typeof value.then === 'function')
            return new DexiePromise((resolve, reject) => {
                value.then(resolve, reject);
            });
        var rv = new DexiePromise(INTERNAL, true, value);
        linkToPreviousPromise(rv, currentFulfiller);
        return rv;
    },
    reject: PromiseReject,
    race: function () {
        var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise((resolve, reject) => {
            values.map(value => DexiePromise.resolve(value).then(resolve, reject));
        });
    },
    PSD: {
        get: () => PSD,
        set: value => PSD = value
    },
    totalEchoes: { get: () => totalEchoes },
    newPSD: newScope,
    usePSD: usePSD,
    scheduler: {
        get: () => asap,
        set: value => { asap = value; }
    },
    rejectionMapper: {
        get: () => rejectionMapper,
        set: value => { rejectionMapper = value; }
    },
    follow: (fn, zoneProps) => {
        return new DexiePromise((resolve, reject) => {
            return newScope((resolve, reject) => {
                var psd = PSD;
                psd.unhandleds = [];
                psd.onunhandled = reject;
                psd.finalize = callBoth(function () {
                    run_at_end_of_this_or_next_physical_tick(() => {
                        this.unhandleds.length === 0 ? resolve() : reject(this.unhandleds[0]);
                    });
                }, psd.finalize);
                fn();
            }, zoneProps, resolve, reject);
        });
    }
});
if (NativePromise) {
    if (NativePromise.allSettled)
        setProp(DexiePromise, "allSettled", function () {
            const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(resolve => {
                if (possiblePromises.length === 0)
                    resolve([]);
                let remaining = possiblePromises.length;
                const results = new Array(remaining);
                possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then(value => results[i] = { status: "fulfilled", value }, reason => results[i] = { status: "rejected", reason })
                    .then(() => --remaining || resolve(results)));
            });
        });
    if (NativePromise.any && typeof AggregateError !== 'undefined')
        setProp(DexiePromise, "any", function () {
            const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise((resolve, reject) => {
                if (possiblePromises.length === 0)
                    reject(new AggregateError([]));
                let remaining = possiblePromises.length;
                const failures = new Array(remaining);
                possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then(value => resolve(value), failure => {
                    failures[i] = failure;
                    if (!--remaining)
                        reject(new AggregateError(failures));
                }));
            });
        });
}
function executePromiseTask(promise, fn) {
    try {
        fn(value => {
            if (promise._state !== null)
                return;
            if (value === promise)
                throw new TypeError('A promise cannot be resolved with itself.');
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === 'function') {
                executePromiseTask(promise, (resolve, reject) => {
                    value instanceof DexiePromise ?
                        value._then(resolve, reject) :
                        value.then(resolve, reject);
                });
            }
            else {
                promise._state = true;
                promise._value = value;
                propagateAllListeners(promise);
            }
            if (shouldExecuteTick)
                endMicroTickScope();
        }, handleRejection.bind(null, promise));
    }
    catch (ex) {
        handleRejection(promise, ex);
    }
}
function handleRejection(promise, reason) {
    rejectingErrors.push(reason);
    if (promise._state !== null)
        return;
    var shouldExecuteTick = promise._lib && beginMicroTickScope();
    reason = rejectionMapper(reason);
    promise._state = false;
    promise._value = reason;
    debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(() => {
        var origProp = getPropertyDescriptor(reason, "stack");
        reason._promise = promise;
        setProp(reason, "stack", {
            get: () => stack_being_generated ?
                origProp && (origProp.get ?
                    origProp.get.apply(reason) :
                    origProp.value) :
                promise.stack
        });
    });
    addPossiblyUnhandledError(promise);
    propagateAllListeners(promise);
    if (shouldExecuteTick)
        endMicroTickScope();
}
function propagateAllListeners(promise) {
    var listeners = promise._listeners;
    promise._listeners = [];
    for (var i = 0, len = listeners.length; i < len; ++i) {
        propagateToListener(promise, listeners[i]);
    }
    var psd = promise._PSD;
    --psd.ref || psd.finalize();
    if (numScheduledCalls === 0) {
        ++numScheduledCalls;
        asap(() => {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
        }, []);
    }
}
function propagateToListener(promise, listener) {
    if (promise._state === null) {
        promise._listeners.push(listener);
        return;
    }
    var cb = promise._state ? listener.onFulfilled : listener.onRejected;
    if (cb === null) {
        return (promise._state ? listener.resolve : listener.reject)(promise._value);
    }
    ++listener.psd.ref;
    ++numScheduledCalls;
    asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
    try {
        currentFulfiller = promise;
        var ret, value = promise._value;
        if (promise._state) {
            ret = cb(value);
        }
        else {
            if (rejectingErrors.length)
                rejectingErrors = [];
            ret = cb(value);
            if (rejectingErrors.indexOf(value) === -1)
                markErrorAsHandled(promise);
        }
        listener.resolve(ret);
    }
    catch (e) {
        listener.reject(e);
    }
    finally {
        currentFulfiller = null;
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        --listener.psd.ref || listener.psd.finalize();
    }
}
function getStack(promise, stacks, limit) {
    if (stacks.length === limit)
        return stacks;
    var stack = "";
    if (promise._state === false) {
        var failure = promise._value, errorName, message;
        if (failure != null) {
            errorName = failure.name || "Error";
            message = failure.message || failure;
            stack = prettyStack(failure, 0);
        }
        else {
            errorName = failure;
            message = "";
        }
        stacks.push(errorName + (message ? ": " + message : "") + stack);
    }
    if (debug) {
        stack = prettyStack(promise._stackHolder, 2);
        if (stack && stacks.indexOf(stack) === -1)
            stacks.push(stack);
        if (promise._prev)
            getStack(promise._prev, stacks, limit);
    }
    return stacks;
}
function linkToPreviousPromise(promise, prev) {
    var numPrev = prev ? prev._numPrev + 1 : 0;
    if (numPrev < LONG_STACKS_CLIP_LIMIT) {
        promise._prev = prev;
        promise._numPrev = numPrev;
    }
}
function physicalTick() {
    beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
    var wasRootExec = isOutsideMicroTick;
    isOutsideMicroTick = false;
    needsNewPhysicalTick = false;
    return wasRootExec;
}
function endMicroTickScope() {
    var callbacks, i, l;
    do {
        while (microtickQueue.length > 0) {
            callbacks = microtickQueue;
            microtickQueue = [];
            l = callbacks.length;
            for (i = 0; i < l; ++i) {
                var item = callbacks[i];
                item[0].apply(null, item[1]);
            }
        }
    } while (microtickQueue.length > 0);
    isOutsideMicroTick = true;
    needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
    var unhandledErrs = unhandledErrors;
    unhandledErrors = [];
    unhandledErrs.forEach(p => {
        p._PSD.onunhandled.call(null, p._value, p);
    });
    var finalizers = tickFinalizers.slice(0);
    var i = finalizers.length;
    while (i)
        finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
    function finalizer() {
        fn();
        tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
    }
    tickFinalizers.push(finalizer);
    ++numScheduledCalls;
    asap(() => {
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
    }, []);
}
function addPossiblyUnhandledError(promise) {
    if (!unhandledErrors.some(p => p._value === promise._value))
        unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
    var i = unhandledErrors.length;
    while (i)
        if (unhandledErrors[--i]._value === promise._value) {
            unhandledErrors.splice(i, 1);
            return;
        }
}
function PromiseReject(reason) {
    return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
    var psd = PSD;
    return function () {
        var wasRootExec = beginMicroTickScope(), outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn.apply(this, arguments);
        }
        catch (e) {
            errorCatcher && errorCatcher(e);
        }
        finally {
            switchToZone(outerScope, false);
            if (wasRootExec)
                endMicroTickScope();
        }
    };
}
const task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props, a1, a2) {
    var parent = PSD, psd = Object.create(parent);
    psd.parent = parent;
    psd.ref = 0;
    psd.global = false;
    psd.id = ++zone_id_counter;
    var globalEnv = globalPSD.env;
    psd.env = patchGlobalPromise ? {
        Promise: DexiePromise,
        PromiseProp: { value: DexiePromise, configurable: true, writable: true },
        all: DexiePromise.all,
        race: DexiePromise.race,
        allSettled: DexiePromise.allSettled,
        any: DexiePromise.any,
        resolve: DexiePromise.resolve,
        reject: DexiePromise.reject,
        nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
        gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
    } : {};
    if (props)
        extend(psd, props);
    ++parent.ref;
    psd.finalize = function () {
        --this.parent.ref || this.parent.finalize();
    };
    var rv = usePSD(psd, fn, a1, a2);
    if (psd.ref === 0)
        psd.finalize();
    return rv;
}
function incrementExpectedAwaits() {
    if (!task.id)
        task.id = ++taskCounter;
    ++task.awaits;
    task.echoes += ZONE_ECHO_LIMIT;
    return task.id;
}
function decrementExpectedAwaits() {
    if (!task.awaits)
        return false;
    if (--task.awaits === 0)
        task.id = 0;
    task.echoes = task.awaits * ZONE_ECHO_LIMIT;
    return true;
}
if (('' + nativePromiseThen).indexOf('[native code]') === -1) {
    incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
    if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
        incrementExpectedAwaits();
        return possiblePromise.then(x => {
            decrementExpectedAwaits();
            return x;
        }, e => {
            decrementExpectedAwaits();
            return rejection(e);
        });
    }
    return possiblePromise;
}
function zoneEnterEcho(targetZone) {
    ++totalEchoes;
    if (!task.echoes || --task.echoes === 0) {
        task.echoes = task.id = 0;
    }
    zoneStack.push(PSD);
    switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
    var zone = zoneStack[zoneStack.length - 1];
    zoneStack.pop();
    switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
    var currentZone = PSD;
    if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
        enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
    }
    if (targetZone === PSD)
        return;
    PSD = targetZone;
    if (currentZone === globalPSD)
        globalPSD.env = snapShot();
    if (patchGlobalPromise) {
        var GlobalPromise = globalPSD.env.Promise;
        var targetEnv = targetZone.env;
        nativePromiseProto.then = targetEnv.nthen;
        GlobalPromise.prototype.then = targetEnv.gthen;
        if (currentZone.global || targetZone.global) {
            Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
            GlobalPromise.all = targetEnv.all;
            GlobalPromise.race = targetEnv.race;
            GlobalPromise.resolve = targetEnv.resolve;
            GlobalPromise.reject = targetEnv.reject;
            if (targetEnv.allSettled)
                GlobalPromise.allSettled = targetEnv.allSettled;
            if (targetEnv.any)
                GlobalPromise.any = targetEnv.any;
        }
    }
}
function snapShot() {
    var GlobalPromise = _global.Promise;
    return patchGlobalPromise ? {
        Promise: GlobalPromise,
        PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
        all: GlobalPromise.all,
        race: GlobalPromise.race,
        allSettled: GlobalPromise.allSettled,
        any: GlobalPromise.any,
        resolve: GlobalPromise.resolve,
        reject: GlobalPromise.reject,
        nthen: nativePromiseProto.then,
        gthen: GlobalPromise.prototype.then
    } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
    var outerScope = PSD;
    try {
        switchToZone(psd, true);
        return fn(a1, a2, a3);
    }
    finally {
        switchToZone(outerScope, false);
    }
}
function enqueueNativeMicroTask(job) {
    nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
    return typeof fn !== 'function' ? fn : function () {
        var outerZone = PSD;
        if (possibleAwait)
            incrementExpectedAwaits();
        switchToZone(zone, true);
        try {
            return fn.apply(this, arguments);
        }
        finally {
            switchToZone(outerZone, false);
            if (cleanup)
                enqueueNativeMicroTask(decrementExpectedAwaits);
        }
    };
}
function getPatchedPromiseThen(origThen, zone) {
    return function (onResolved, onRejected) {
        return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
    };
}
const UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
    var rv;
    try {
        rv = promise.onuncatched(err);
    }
    catch (e) { }
    if (rv !== false)
        try {
            var event, eventData = { promise: promise, reason: err };
            if (_global.document && document.createEvent) {
                event = document.createEvent('Event');
                event.initEvent(UNHANDLEDREJECTION, true, true);
                extend(event, eventData);
            }
            else if (_global.CustomEvent) {
                event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                extend(event, eventData);
            }
            if (event && _global.dispatchEvent) {
                dispatchEvent(event);
                if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                    try {
                        _global.onunhandledrejection(event);
                    }
                    catch (_) { }
            }
            if (debug && event && !event.defaultPrevented) {
                console.warn(`Unhandled rejection: ${err.stack || err}`);
            }
        }
        catch (e) { }
}
var rejection = DexiePromise.reject;

function tempTransaction(db, mode, storeNames, fn) {
    if (!db.idbdb || (!db._state.openComplete && (!PSD.letThrough && !db._vip))) {
        if (db._state.openComplete) {
            return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
        }
        if (!db._state.isBeingOpened) {
            if (!db._options.autoOpen)
                return rejection(new exceptions.DatabaseClosed());
            db.open().catch(nop);
        }
        return db._state.dbReadyPromise.then(() => tempTransaction(db, mode, storeNames, fn));
    }
    else {
        var trans = db._createTransaction(mode, storeNames, db._dbSchema);
        try {
            trans.create();
            db._state.PR1398_maxLoop = 3;
        }
        catch (ex) {
            if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                console.warn('Dexie: Need to reopen db');
                db._close();
                return db.open().then(() => tempTransaction(db, mode, storeNames, fn));
            }
            return rejection(ex);
        }
        return trans._promise(mode, (resolve, reject) => {
            return newScope(() => {
                PSD.trans = trans;
                return fn(resolve, reject, trans);
            });
        }).then(result => {
            return trans._completion.then(() => result);
        });
    }
}

const DEXIE_VERSION = '3.2.7';
const maxString = String.fromCharCode(65535);
const minKey = -Infinity;
const INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
const STRING_EXPECTED = "String expected.";
const connections = [];
const isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
const hasIEDeleteObjectStoreBug = isIEOrEdge;
const hangsOnDeleteLargeKeyRange = isIEOrEdge;
const dexieStackFrameFilter = frame => !/(dexie\.js|dexie\.min\.js)/.test(frame);
const DBNAMES_DB = '__dbnames';
const READONLY = 'readonly';
const READWRITE = 'readwrite';

function combine(filter1, filter2) {
    return filter1 ?
        filter2 ?
            function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
            filter1 :
        filter2;
}

const AnyRange = {
    type: 3 ,
    lower: -Infinity,
    lowerOpen: false,
    upper: [[]],
    upperOpen: false
};

function workaroundForUndefinedPrimKey(keyPath) {
    return typeof keyPath === "string" && !/\./.test(keyPath)
        ? (obj) => {
            if (obj[keyPath] === undefined && (keyPath in obj)) {
                obj = deepClone(obj);
                delete obj[keyPath];
            }
            return obj;
        }
        : (obj) => obj;
}

class Table {
    _trans(mode, fn, writeLocked) {
        const trans = this._tx || PSD.trans;
        const tableName = this.name;
        function checkTableInTransaction(resolve, reject, trans) {
            if (!trans.schema[tableName])
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            return fn(trans.idbtrans, trans);
        }
        const wasRootExec = beginMicroTickScope();
        try {
            return trans && trans.db === this.db ?
                trans === PSD.trans ?
                    trans._promise(mode, checkTableInTransaction, writeLocked) :
                    newScope(() => trans._promise(mode, checkTableInTransaction, writeLocked), { trans: trans, transless: PSD.transless || PSD }) :
                tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
        }
        finally {
            if (wasRootExec)
                endMicroTickScope();
        }
    }
    get(keyOrCrit, cb) {
        if (keyOrCrit && keyOrCrit.constructor === Object)
            return this.where(keyOrCrit).first(cb);
        return this._trans('readonly', (trans) => {
            return this.core.get({ trans, key: keyOrCrit })
                .then(res => this.hook.reading.fire(res));
        }).then(cb);
    }
    where(indexOrCrit) {
        if (typeof indexOrCrit === 'string')
            return new this.db.WhereClause(this, indexOrCrit);
        if (isArray(indexOrCrit))
            return new this.db.WhereClause(this, `[${indexOrCrit.join('+')}]`);
        const keyPaths = keys(indexOrCrit);
        if (keyPaths.length === 1)
            return this
                .where(keyPaths[0])
                .equals(indexOrCrit[keyPaths[0]]);
        const compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(ix => {
            if (ix.compound &&
                keyPaths.every(keyPath => ix.keyPath.indexOf(keyPath) >= 0)) {
                for (let i = 0; i < keyPaths.length; ++i) {
                    if (keyPaths.indexOf(ix.keyPath[i]) === -1)
                        return false;
                }
                return true;
            }
            return false;
        }).sort((a, b) => a.keyPath.length - b.keyPath.length)[0];
        if (compoundIndex && this.db._maxKey !== maxString) {
            const keyPathsInValidOrder = compoundIndex.keyPath.slice(0, keyPaths.length);
            return this
                .where(keyPathsInValidOrder)
                .equals(keyPathsInValidOrder.map(kp => indexOrCrit[kp]));
        }
        if (!compoundIndex && debug)
            console.warn(`The query ${JSON.stringify(indexOrCrit)} on ${this.name} would benefit of a ` +
                `compound index [${keyPaths.join('+')}]`);
        const { idxByName } = this.schema;
        const idb = this.db._deps.indexedDB;
        function equals(a, b) {
            try {
                return idb.cmp(a, b) === 0;
            }
            catch (e) {
                return false;
            }
        }
        const [idx, filterFunction] = keyPaths.reduce(([prevIndex, prevFilterFn], keyPath) => {
            const index = idxByName[keyPath];
            const value = indexOrCrit[keyPath];
            return [
                prevIndex || index,
                prevIndex || !index ?
                    combine(prevFilterFn, index && index.multi ?
                        x => {
                            const prop = getByKeyPath(x, keyPath);
                            return isArray(prop) && prop.some(item => equals(value, item));
                        } : x => equals(value, getByKeyPath(x, keyPath)))
                    : prevFilterFn
            ];
        }, [null, null]);
        return idx ?
            this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                .filter(filterFunction) :
            compoundIndex ?
                this.filter(filterFunction) :
                this.where(keyPaths).equals('');
    }
    filter(filterFunction) {
        return this.toCollection().and(filterFunction);
    }
    count(thenShortcut) {
        return this.toCollection().count(thenShortcut);
    }
    offset(offset) {
        return this.toCollection().offset(offset);
    }
    limit(numRows) {
        return this.toCollection().limit(numRows);
    }
    each(callback) {
        return this.toCollection().each(callback);
    }
    toArray(thenShortcut) {
        return this.toCollection().toArray(thenShortcut);
    }
    toCollection() {
        return new this.db.Collection(new this.db.WhereClause(this));
    }
    orderBy(index) {
        return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ?
            `[${index.join('+')}]` :
            index));
    }
    reverse() {
        return this.toCollection().reverse();
    }
    mapToClass(constructor) {
        this.schema.mappedClass = constructor;
        const readHook = obj => {
            if (!obj)
                return obj;
            const res = Object.create(constructor.prototype);
            for (var m in obj)
                if (hasOwn(obj, m))
                    try {
                        res[m] = obj[m];
                    }
                    catch (_) { }
            return res;
        };
        if (this.schema.readHook) {
            this.hook.reading.unsubscribe(this.schema.readHook);
        }
        this.schema.readHook = readHook;
        this.hook("reading", readHook);
        return constructor;
    }
    defineClass() {
        function Class(content) {
            extend(this, content);
        }
        return this.mapToClass(Class);
    }
    add(obj, key) {
        const { auto, keyPath } = this.schema.primKey;
        let objToAdd = obj;
        if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
        }
        return this._trans('readwrite', trans => {
            return this.core.mutate({ trans, type: 'add', keys: key != null ? [key] : null, values: [objToAdd] });
        }).then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult)
            .then(lastResult => {
            if (keyPath) {
                try {
                    setByKeyPath(obj, keyPath, lastResult);
                }
                catch (_) { }
            }
            return lastResult;
        });
    }
    update(keyOrObject, modifications) {
        if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
            const key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
            if (key === undefined)
                return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
            try {
                if (typeof modifications !== "function") {
                    keys(modifications).forEach(keyPath => {
                        setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
                    });
                }
                else {
                    modifications(keyOrObject, { value: keyOrObject, primKey: key });
                }
            }
            catch (_a) {
            }
            return this.where(":id").equals(key).modify(modifications);
        }
        else {
            return this.where(":id").equals(keyOrObject).modify(modifications);
        }
    }
    put(obj, key) {
        const { auto, keyPath } = this.schema.primKey;
        let objToAdd = obj;
        if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
        }
        return this._trans('readwrite', trans => this.core.mutate({ trans, type: 'put', values: [objToAdd], keys: key != null ? [key] : null }))
            .then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult)
            .then(lastResult => {
            if (keyPath) {
                try {
                    setByKeyPath(obj, keyPath, lastResult);
                }
                catch (_) { }
            }
            return lastResult;
        });
    }
    delete(key) {
        return this._trans('readwrite', trans => this.core.mutate({ trans, type: 'delete', keys: [key] }))
            .then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined);
    }
    clear() {
        return this._trans('readwrite', trans => this.core.mutate({ trans, type: 'deleteRange', range: AnyRange }))
            .then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined);
    }
    bulkGet(keys) {
        return this._trans('readonly', trans => {
            return this.core.getMany({
                keys,
                trans
            }).then(result => result.map(res => this.hook.reading.fire(res)));
        });
    }
    bulkAdd(objects, keysOrOptions, options) {
        const keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
        options = options || (keys ? undefined : keysOrOptions);
        const wantResults = options ? options.allKeys : undefined;
        return this._trans('readwrite', trans => {
            const { auto, keyPath } = this.schema.primKey;
            if (keyPath && keys)
                throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (keys && keys.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            const numObjects = objects.length;
            let objectsToAdd = keyPath && auto ?
                objects.map(workaroundForUndefinedPrimKey(keyPath)) :
                objects;
            return this.core.mutate({ trans, type: 'add', keys: keys, values: objectsToAdd, wantResults })
                .then(({ numFailures, results, lastResult, failures }) => {
                const result = wantResults ? results : lastResult;
                if (numFailures === 0)
                    return result;
                throw new BulkError(`${this.name}.bulkAdd(): ${numFailures} of ${numObjects} operations failed`, failures);
            });
        });
    }
    bulkPut(objects, keysOrOptions, options) {
        const keys = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
        options = options || (keys ? undefined : keysOrOptions);
        const wantResults = options ? options.allKeys : undefined;
        return this._trans('readwrite', trans => {
            const { auto, keyPath } = this.schema.primKey;
            if (keyPath && keys)
                throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (keys && keys.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            const numObjects = objects.length;
            let objectsToPut = keyPath && auto ?
                objects.map(workaroundForUndefinedPrimKey(keyPath)) :
                objects;
            return this.core.mutate({ trans, type: 'put', keys: keys, values: objectsToPut, wantResults })
                .then(({ numFailures, results, lastResult, failures }) => {
                const result = wantResults ? results : lastResult;
                if (numFailures === 0)
                    return result;
                throw new BulkError(`${this.name}.bulkPut(): ${numFailures} of ${numObjects} operations failed`, failures);
            });
        });
    }
    bulkDelete(keys) {
        const numKeys = keys.length;
        return this._trans('readwrite', trans => {
            return this.core.mutate({ trans, type: 'delete', keys: keys });
        }).then(({ numFailures, lastResult, failures }) => {
            if (numFailures === 0)
                return lastResult;
            throw new BulkError(`${this.name}.bulkDelete(): ${numFailures} of ${numKeys} operations failed`, failures);
        });
    }
}

function Events(ctx) {
    var evs = {};
    var rv = function (eventName, subscriber) {
        if (subscriber) {
            var i = arguments.length, args = new Array(i - 1);
            while (--i)
                args[i - 1] = arguments[i];
            evs[eventName].subscribe.apply(null, args);
            return ctx;
        }
        else if (typeof (eventName) === 'string') {
            return evs[eventName];
        }
    };
    rv.addEventType = add;
    for (var i = 1, l = arguments.length; i < l; ++i) {
        add(arguments[i]);
    }
    return rv;
    function add(eventName, chainFunction, defaultFunction) {
        if (typeof eventName === 'object')
            return addConfiguredEvents(eventName);
        if (!chainFunction)
            chainFunction = reverseStoppableEventChain;
        if (!defaultFunction)
            defaultFunction = nop;
        var context = {
            subscribers: [],
            fire: defaultFunction,
            subscribe: function (cb) {
                if (context.subscribers.indexOf(cb) === -1) {
                    context.subscribers.push(cb);
                    context.fire = chainFunction(context.fire, cb);
                }
            },
            unsubscribe: function (cb) {
                context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
            }
        };
        evs[eventName] = rv[eventName] = context;
        return context;
    }
    function addConfiguredEvents(cfg) {
        keys(cfg).forEach(function (eventName) {
            var args = cfg[eventName];
            if (isArray(args)) {
                add(eventName, cfg[eventName][0], cfg[eventName][1]);
            }
            else if (args === 'asap') {
                var context = add(eventName, mirror, function fire() {
                    var i = arguments.length, args = new Array(i);
                    while (i--)
                        args[i] = arguments[i];
                    context.subscribers.forEach(function (fn) {
                        asap$1(function fireEvent() {
                            fn.apply(null, args);
                        });
                    });
                });
            }
            else
                throw new exceptions.InvalidArgument("Invalid event config");
        });
    }
}

function makeClassConstructor(prototype, constructor) {
    derive(constructor).from({ prototype });
    return constructor;
}

function createTableConstructor(db) {
    return makeClassConstructor(Table.prototype, function Table(name, tableSchema, trans) {
        this.db = db;
        this._tx = trans;
        this.name = name;
        this.schema = tableSchema;
        this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
            "creating": [hookCreatingChain, nop],
            "reading": [pureFunctionChain, mirror],
            "updating": [hookUpdatingChain, nop],
            "deleting": [hookDeletingChain, nop]
        });
    });
}

function isPlainKeyRange(ctx, ignoreLimitFilter) {
    return !(ctx.filter || ctx.algorithm || ctx.or) &&
        (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
    ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
    var curr = ctx.replayFilter;
    ctx.replayFilter = curr ? () => combine(curr(), factory()) : factory;
    ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
    ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
    if (ctx.isPrimKey)
        return coreSchema.primaryKey;
    const index = coreSchema.getIndexByKeyPath(ctx.index);
    if (!index)
        throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
    return index;
}
function openCursor(ctx, coreTable, trans) {
    const index = getIndexOrStore(ctx, coreTable.schema);
    return coreTable.openCursor({
        trans,
        values: !ctx.keysOnly,
        reverse: ctx.dir === 'prev',
        unique: !!ctx.unique,
        query: {
            index,
            range: ctx.range
        }
    });
}
function iter(ctx, fn, coreTrans, coreTable) {
    const filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
    if (!ctx.or) {
        return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
    }
    else {
        const set = {};
        const union = (item, cursor, advance) => {
            if (!filter || filter(cursor, advance, result => cursor.stop(result), err => cursor.fail(err))) {
                var primaryKey = cursor.primaryKey;
                var key = '' + primaryKey;
                if (key === '[object ArrayBuffer]')
                    key = '' + new Uint8Array(primaryKey);
                if (!hasOwn(set, key)) {
                    set[key] = true;
                    fn(item, cursor, advance);
                }
            }
        };
        return Promise.all([
            ctx.or._iterate(union, coreTrans),
            iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
        ]);
    }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
    var mappedFn = valueMapper ? (x, c, a) => fn(valueMapper(x), c, a) : fn;
    var wrappedFn = wrap(mappedFn);
    return cursorPromise.then(cursor => {
        if (cursor) {
            return cursor.start(() => {
                var c = () => cursor.continue();
                if (!filter || filter(cursor, advancer => c = advancer, val => { cursor.stop(val); c = nop; }, e => { cursor.fail(e); c = nop; }))
                    wrappedFn(cursor.value, cursor, advancer => c = advancer);
                c();
            });
        }
    });
}

function cmp(a, b) {
    try {
        const ta = type(a);
        const tb = type(b);
        if (ta !== tb) {
            if (ta === 'Array')
                return 1;
            if (tb === 'Array')
                return -1;
            if (ta === 'binary')
                return 1;
            if (tb === 'binary')
                return -1;
            if (ta === 'string')
                return 1;
            if (tb === 'string')
                return -1;
            if (ta === 'Date')
                return 1;
            if (tb !== 'Date')
                return NaN;
            return -1;
        }
        switch (ta) {
            case 'number':
            case 'Date':
            case 'string':
                return a > b ? 1 : a < b ? -1 : 0;
            case 'binary': {
                return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
            }
            case 'Array':
                return compareArrays(a, b);
        }
    }
    catch (_a) { }
    return NaN;
}
function compareArrays(a, b) {
    const al = a.length;
    const bl = b.length;
    const l = al < bl ? al : bl;
    for (let i = 0; i < l; ++i) {
        const res = cmp(a[i], b[i]);
        if (res !== 0)
            return res;
    }
    return al === bl ? 0 : al < bl ? -1 : 1;
}
function compareUint8Arrays(a, b) {
    const al = a.length;
    const bl = b.length;
    const l = al < bl ? al : bl;
    for (let i = 0; i < l; ++i) {
        if (a[i] !== b[i])
            return a[i] < b[i] ? -1 : 1;
    }
    return al === bl ? 0 : al < bl ? -1 : 1;
}
function type(x) {
    const t = typeof x;
    if (t !== 'object')
        return t;
    if (ArrayBuffer.isView(x))
        return 'binary';
    const tsTag = toStringTag(x);
    return tsTag === 'ArrayBuffer' ? 'binary' : tsTag;
}
function getUint8Array(a) {
    if (a instanceof Uint8Array)
        return a;
    if (ArrayBuffer.isView(a))
        return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    return new Uint8Array(a);
}

class Collection {
    _read(fn, cb) {
        var ctx = this._ctx;
        return ctx.error ?
            ctx.table._trans(null, rejection.bind(null, ctx.error)) :
            ctx.table._trans('readonly', fn).then(cb);
    }
    _write(fn) {
        var ctx = this._ctx;
        return ctx.error ?
            ctx.table._trans(null, rejection.bind(null, ctx.error)) :
            ctx.table._trans('readwrite', fn, "locked");
    }
    _addAlgorithm(fn) {
        var ctx = this._ctx;
        ctx.algorithm = combine(ctx.algorithm, fn);
    }
    _iterate(fn, coreTrans) {
        return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
    }
    clone(props) {
        var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
        if (props)
            extend(ctx, props);
        rv._ctx = ctx;
        return rv;
    }
    raw() {
        this._ctx.valueMapper = null;
        return this;
    }
    each(fn) {
        var ctx = this._ctx;
        return this._read(trans => iter(ctx, fn, trans, ctx.table.core));
    }
    count(cb) {
        return this._read(trans => {
            const ctx = this._ctx;
            const coreTable = ctx.table.core;
            if (isPlainKeyRange(ctx, true)) {
                return coreTable.count({
                    trans,
                    query: {
                        index: getIndexOrStore(ctx, coreTable.schema),
                        range: ctx.range
                    }
                }).then(count => Math.min(count, ctx.limit));
            }
            else {
                var count = 0;
                return iter(ctx, () => { ++count; return false; }, trans, coreTable)
                    .then(() => count);
            }
        }).then(cb);
    }
    sortBy(keyPath, cb) {
        const parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
        function getval(obj, i) {
            if (i)
                return getval(obj[parts[i]], i - 1);
            return obj[lastPart];
        }
        var order = this._ctx.dir === "next" ? 1 : -1;
        function sorter(a, b) {
            var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
            return aVal < bVal ? -order : aVal > bVal ? order : 0;
        }
        return this.toArray(function (a) {
            return a.sort(sorter);
        }).then(cb);
    }
    toArray(cb) {
        return this._read(trans => {
            var ctx = this._ctx;
            if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                const { valueMapper } = ctx;
                const index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                    trans,
                    limit: ctx.limit,
                    values: true,
                    query: {
                        index,
                        range: ctx.range
                    }
                }).then(({ result }) => valueMapper ? result.map(valueMapper) : result);
            }
            else {
                const a = [];
                return iter(ctx, item => a.push(item), trans, ctx.table.core).then(() => a);
            }
        }, cb);
    }
    offset(offset) {
        var ctx = this._ctx;
        if (offset <= 0)
            return this;
        ctx.offset += offset;
        if (isPlainKeyRange(ctx)) {
            addReplayFilter(ctx, () => {
                var offsetLeft = offset;
                return (cursor, advance) => {
                    if (offsetLeft === 0)
                        return true;
                    if (offsetLeft === 1) {
                        --offsetLeft;
                        return false;
                    }
                    advance(() => {
                        cursor.advance(offsetLeft);
                        offsetLeft = 0;
                    });
                    return false;
                };
            });
        }
        else {
            addReplayFilter(ctx, () => {
                var offsetLeft = offset;
                return () => (--offsetLeft < 0);
            });
        }
        return this;
    }
    limit(numRows) {
        this._ctx.limit = Math.min(this._ctx.limit, numRows);
        addReplayFilter(this._ctx, () => {
            var rowsLeft = numRows;
            return function (cursor, advance, resolve) {
                if (--rowsLeft <= 0)
                    advance(resolve);
                return rowsLeft >= 0;
            };
        }, true);
        return this;
    }
    until(filterFunction, bIncludeStopEntry) {
        addFilter(this._ctx, function (cursor, advance, resolve) {
            if (filterFunction(cursor.value)) {
                advance(resolve);
                return bIncludeStopEntry;
            }
            else {
                return true;
            }
        });
        return this;
    }
    first(cb) {
        return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
    }
    last(cb) {
        return this.reverse().first(cb);
    }
    filter(filterFunction) {
        addFilter(this._ctx, function (cursor) {
            return filterFunction(cursor.value);
        });
        addMatchFilter(this._ctx, filterFunction);
        return this;
    }
    and(filter) {
        return this.filter(filter);
    }
    or(indexName) {
        return new this.db.WhereClause(this._ctx.table, indexName, this);
    }
    reverse() {
        this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
        if (this._ondirectionchange)
            this._ondirectionchange(this._ctx.dir);
        return this;
    }
    desc() {
        return this.reverse();
    }
    eachKey(cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        return this.each(function (val, cursor) { cb(cursor.key, cursor); });
    }
    eachUniqueKey(cb) {
        this._ctx.unique = "unique";
        return this.eachKey(cb);
    }
    eachPrimaryKey(cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
    }
    keys(cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        var a = [];
        return this.each(function (item, cursor) {
            a.push(cursor.key);
        }).then(function () {
            return a;
        }).then(cb);
    }
    primaryKeys(cb) {
        var ctx = this._ctx;
        if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
            return this._read(trans => {
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                    trans,
                    values: false,
                    limit: ctx.limit,
                    query: {
                        index,
                        range: ctx.range
                    }
                });
            }).then(({ result }) => result).then(cb);
        }
        ctx.keysOnly = !ctx.isMatch;
        var a = [];
        return this.each(function (item, cursor) {
            a.push(cursor.primaryKey);
        }).then(function () {
            return a;
        }).then(cb);
    }
    uniqueKeys(cb) {
        this._ctx.unique = "unique";
        return this.keys(cb);
    }
    firstKey(cb) {
        return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
    }
    lastKey(cb) {
        return this.reverse().firstKey(cb);
    }
    distinct() {
        var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
        if (!idx || !idx.multi)
            return this;
        var set = {};
        addFilter(this._ctx, function (cursor) {
            var strKey = cursor.primaryKey.toString();
            var found = hasOwn(set, strKey);
            set[strKey] = true;
            return !found;
        });
        return this;
    }
    modify(changes) {
        var ctx = this._ctx;
        return this._write(trans => {
            var modifyer;
            if (typeof changes === 'function') {
                modifyer = changes;
            }
            else {
                var keyPaths = keys(changes);
                var numKeys = keyPaths.length;
                modifyer = function (item) {
                    var anythingModified = false;
                    for (var i = 0; i < numKeys; ++i) {
                        var keyPath = keyPaths[i], val = changes[keyPath];
                        if (getByKeyPath(item, keyPath) !== val) {
                            setByKeyPath(item, keyPath, val);
                            anythingModified = true;
                        }
                    }
                    return anythingModified;
                };
            }
            const coreTable = ctx.table.core;
            const { outbound, extractKey } = coreTable.schema.primaryKey;
            const limit = this.db._options.modifyChunkSize || 200;
            const totalFailures = [];
            let successCount = 0;
            const failedKeys = [];
            const applyMutateResult = (expectedCount, res) => {
                const { failures, numFailures } = res;
                successCount += expectedCount - numFailures;
                for (let pos of keys(failures)) {
                    totalFailures.push(failures[pos]);
                }
            };
            return this.clone().primaryKeys().then(keys => {
                const nextChunk = (offset) => {
                    const count = Math.min(limit, keys.length - offset);
                    return coreTable.getMany({
                        trans,
                        keys: keys.slice(offset, offset + count),
                        cache: "immutable"
                    }).then(values => {
                        const addValues = [];
                        const putValues = [];
                        const putKeys = outbound ? [] : null;
                        const deleteKeys = [];
                        for (let i = 0; i < count; ++i) {
                            const origValue = values[i];
                            const ctx = {
                                value: deepClone(origValue),
                                primKey: keys[offset + i]
                            };
                            if (modifyer.call(ctx, ctx.value, ctx) !== false) {
                                if (ctx.value == null) {
                                    deleteKeys.push(keys[offset + i]);
                                }
                                else if (!outbound && cmp(extractKey(origValue), extractKey(ctx.value)) !== 0) {
                                    deleteKeys.push(keys[offset + i]);
                                    addValues.push(ctx.value);
                                }
                                else {
                                    putValues.push(ctx.value);
                                    if (outbound)
                                        putKeys.push(keys[offset + i]);
                                }
                            }
                        }
                        const criteria = isPlainKeyRange(ctx) &&
                            ctx.limit === Infinity &&
                            (typeof changes !== 'function' || changes === deleteCallback) && {
                            index: ctx.index,
                            range: ctx.range
                        };
                        return Promise.resolve(addValues.length > 0 &&
                            coreTable.mutate({ trans, type: 'add', values: addValues })
                                .then(res => {
                                for (let pos in res.failures) {
                                    deleteKeys.splice(parseInt(pos), 1);
                                }
                                applyMutateResult(addValues.length, res);
                            })).then(() => (putValues.length > 0 || (criteria && typeof changes === 'object')) &&
                            coreTable.mutate({
                                trans,
                                type: 'put',
                                keys: putKeys,
                                values: putValues,
                                criteria,
                                changeSpec: typeof changes !== 'function'
                                    && changes
                            }).then(res => applyMutateResult(putValues.length, res))).then(() => (deleteKeys.length > 0 || (criteria && changes === deleteCallback)) &&
                            coreTable.mutate({
                                trans,
                                type: 'delete',
                                keys: deleteKeys,
                                criteria
                            }).then(res => applyMutateResult(deleteKeys.length, res))).then(() => {
                            return keys.length > offset + count && nextChunk(offset + limit);
                        });
                    });
                };
                return nextChunk(0).then(() => {
                    if (totalFailures.length > 0)
                        throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                    return keys.length;
                });
            });
        });
    }
    delete() {
        var ctx = this._ctx, range = ctx.range;
        if (isPlainKeyRange(ctx) &&
            ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || range.type === 3 ))
         {
            return this._write(trans => {
                const { primaryKey } = ctx.table.core.schema;
                const coreRange = range;
                return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then(count => {
                    return ctx.table.core.mutate({ trans, type: 'deleteRange', range: coreRange })
                        .then(({ failures, lastResult, results, numFailures }) => {
                        if (numFailures)
                            throw new ModifyError("Could not delete some values", Object.keys(failures).map(pos => failures[pos]), count - numFailures);
                        return count - numFailures;
                    });
                });
            });
        }
        return this.modify(deleteCallback);
    }
}
const deleteCallback = (value, ctx) => ctx.value = null;

function createCollectionConstructor(db) {
    return makeClassConstructor(Collection.prototype, function Collection(whereClause, keyRangeGenerator) {
        this.db = db;
        let keyRange = AnyRange, error = null;
        if (keyRangeGenerator)
            try {
                keyRange = keyRangeGenerator();
            }
            catch (ex) {
                error = ex;
            }
        const whereCtx = whereClause._ctx;
        const table = whereCtx.table;
        const readingHook = table.hook.reading.fire;
        this._ctx = {
            table: table,
            index: whereCtx.index,
            isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
            range: keyRange,
            keysOnly: false,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: true,
            isMatch: null,
            offset: 0,
            limit: Infinity,
            error: error,
            or: whereCtx.or,
            valueMapper: readingHook !== mirror ? readingHook : null
        };
    });
}

function simpleCompare(a, b) {
    return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
    return a > b ? -1 : a === b ? 0 : 1;
}

function fail(collectionOrWhereClause, err, T) {
    var collection = collectionOrWhereClause instanceof WhereClause ?
        new collectionOrWhereClause.Collection(collectionOrWhereClause) :
        collectionOrWhereClause;
    collection._ctx.error = T ? new T(err) : new TypeError(err);
    return collection;
}
function emptyCollection(whereClause) {
    return new whereClause.Collection(whereClause, () => rangeEqual("")).limit(0);
}
function upperFactory(dir) {
    return dir === "next" ?
        (s) => s.toUpperCase() :
        (s) => s.toLowerCase();
}
function lowerFactory(dir) {
    return dir === "next" ?
        (s) => s.toLowerCase() :
        (s) => s.toUpperCase();
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
    var length = Math.min(key.length, lowerNeedle.length);
    var llp = -1;
    for (var i = 0; i < length; ++i) {
        var lwrKeyChar = lowerKey[i];
        if (lwrKeyChar !== lowerNeedle[i]) {
            if (cmp(key[i], upperNeedle[i]) < 0)
                return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
            if (cmp(key[i], lowerNeedle[i]) < 0)
                return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
            if (llp >= 0)
                return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
            return null;
        }
        if (cmp(key[i], lwrKeyChar) < 0)
            llp = i;
    }
    if (length < lowerNeedle.length && dir === "next")
        return key + upperNeedle.substr(key.length);
    if (length < key.length && dir === "prev")
        return key.substr(0, upperNeedle.length);
    return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
    var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
    if (!needles.every(s => typeof s === 'string')) {
        return fail(whereClause, STRING_EXPECTED);
    }
    function initDirection(dir) {
        upper = upperFactory(dir);
        lower = lowerFactory(dir);
        compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
        var needleBounds = needles.map(function (needle) {
            return { lower: lower(needle), upper: upper(needle) };
        }).sort(function (a, b) {
            return compare(a.lower, b.lower);
        });
        upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
        lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
        direction = dir;
        nextKeySuffix = (dir === "next" ? "" : suffix);
    }
    initDirection("next");
    var c = new whereClause.Collection(whereClause, () => createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix));
    c._ondirectionchange = function (direction) {
        initDirection(direction);
    };
    var firstPossibleNeedle = 0;
    c._addAlgorithm(function (cursor, advance, resolve) {
        var key = cursor.key;
        if (typeof key !== 'string')
            return false;
        var lowerKey = lower(key);
        if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
            return true;
        }
        else {
            var lowestPossibleCasing = null;
            for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                if (casing === null && lowestPossibleCasing === null)
                    firstPossibleNeedle = i + 1;
                else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                    lowestPossibleCasing = casing;
                }
            }
            if (lowestPossibleCasing !== null) {
                advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
            }
            else {
                advance(resolve);
            }
            return false;
        }
    });
    return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
    return {
        type: 2 ,
        lower,
        upper,
        lowerOpen,
        upperOpen
    };
}
function rangeEqual(value) {
    return {
        type: 1 ,
        lower: value,
        upper: value
    };
}

class WhereClause {
    get Collection() {
        return this._ctx.table.db.Collection;
    }
    between(lower, upper, includeLower, includeUpper) {
        includeLower = includeLower !== false;
        includeUpper = includeUpper === true;
        try {
            if ((this._cmp(lower, upper) > 0) ||
                (this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                return emptyCollection(this);
            return new this.Collection(this, () => createRange(lower, upper, !includeLower, !includeUpper));
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
    }
    equals(value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, () => rangeEqual(value));
    }
    above(value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, () => createRange(value, undefined, true));
    }
    aboveOrEqual(value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, () => createRange(value, undefined, false));
    }
    below(value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, () => createRange(undefined, value, false, true));
    }
    belowOrEqual(value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, () => createRange(undefined, value));
    }
    startsWith(str) {
        if (typeof str !== 'string')
            return fail(this, STRING_EXPECTED);
        return this.between(str, str + maxString, true, true);
    }
    startsWithIgnoreCase(str) {
        if (str === "")
            return this.startsWith(str);
        return addIgnoreCaseAlgorithm(this, (x, a) => x.indexOf(a[0]) === 0, [str], maxString);
    }
    equalsIgnoreCase(str) {
        return addIgnoreCaseAlgorithm(this, (x, a) => x === a[0], [str], "");
    }
    anyOfIgnoreCase() {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return emptyCollection(this);
        return addIgnoreCaseAlgorithm(this, (x, a) => a.indexOf(x) !== -1, set, "");
    }
    startsWithAnyOfIgnoreCase() {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return emptyCollection(this);
        return addIgnoreCaseAlgorithm(this, (x, a) => a.some(n => x.indexOf(n) === 0), set, maxString);
    }
    anyOf() {
        const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        let compare = this._cmp;
        try {
            set.sort(compare);
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        if (set.length === 0)
            return emptyCollection(this);
        const c = new this.Collection(this, () => createRange(set[0], set[set.length - 1]));
        c._ondirectionchange = direction => {
            compare = (direction === "next" ?
                this._ascending :
                this._descending);
            set.sort(compare);
        };
        let i = 0;
        c._addAlgorithm((cursor, advance, resolve) => {
            const key = cursor.key;
            while (compare(key, set[i]) > 0) {
                ++i;
                if (i === set.length) {
                    advance(resolve);
                    return false;
                }
            }
            if (compare(key, set[i]) === 0) {
                return true;
            }
            else {
                advance(() => { cursor.continue(set[i]); });
                return false;
            }
        });
        return c;
    }
    notEqual(value) {
        return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
    }
    noneOf() {
        const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return new this.Collection(this);
        try {
            set.sort(this._ascending);
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        const ranges = set.reduce((res, val) => res ?
            res.concat([[res[res.length - 1][1], val]]) :
            [[minKey, val]], null);
        ranges.push([set[set.length - 1], this.db._maxKey]);
        return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
    }
    inAnyRange(ranges, options) {
        const cmp = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
        if (ranges.length === 0)
            return emptyCollection(this);
        if (!ranges.every(range => range[0] !== undefined &&
            range[1] !== undefined &&
            ascending(range[0], range[1]) <= 0)) {
            return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
        }
        const includeLowers = !options || options.includeLowers !== false;
        const includeUppers = options && options.includeUppers === true;
        function addRange(ranges, newRange) {
            let i = 0, l = ranges.length;
            for (; i < l; ++i) {
                const range = ranges[i];
                if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                    range[0] = min(range[0], newRange[0]);
                    range[1] = max(range[1], newRange[1]);
                    break;
                }
            }
            if (i === l)
                ranges.push(newRange);
            return ranges;
        }
        let sortDirection = ascending;
        function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
        let set;
        try {
            set = ranges.reduce(addRange, []);
            set.sort(rangeSorter);
        }
        catch (ex) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        let rangePos = 0;
        const keyIsBeyondCurrentEntry = includeUppers ?
            key => ascending(key, set[rangePos][1]) > 0 :
            key => ascending(key, set[rangePos][1]) >= 0;
        const keyIsBeforeCurrentEntry = includeLowers ?
            key => descending(key, set[rangePos][0]) > 0 :
            key => descending(key, set[rangePos][0]) >= 0;
        function keyWithinCurrentRange(key) {
            return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
        }
        let checkKey = keyIsBeyondCurrentEntry;
        const c = new this.Collection(this, () => createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers));
        c._ondirectionchange = direction => {
            if (direction === "next") {
                checkKey = keyIsBeyondCurrentEntry;
                sortDirection = ascending;
            }
            else {
                checkKey = keyIsBeforeCurrentEntry;
                sortDirection = descending;
            }
            set.sort(rangeSorter);
        };
        c._addAlgorithm((cursor, advance, resolve) => {
            var key = cursor.key;
            while (checkKey(key)) {
                ++rangePos;
                if (rangePos === set.length) {
                    advance(resolve);
                    return false;
                }
            }
            if (keyWithinCurrentRange(key)) {
                return true;
            }
            else if (this._cmp(key, set[rangePos][1]) === 0 || this._cmp(key, set[rangePos][0]) === 0) {
                return false;
            }
            else {
                advance(() => {
                    if (sortDirection === ascending)
                        cursor.continue(set[rangePos][0]);
                    else
                        cursor.continue(set[rangePos][1]);
                });
                return false;
            }
        });
        return c;
    }
    startsWithAnyOf() {
        const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (!set.every(s => typeof s === 'string')) {
            return fail(this, "startsWithAnyOf() only works with strings");
        }
        if (set.length === 0)
            return emptyCollection(this);
        return this.inAnyRange(set.map((str) => [str, str + maxString]));
    }
}

function createWhereClauseConstructor(db) {
    return makeClassConstructor(WhereClause.prototype, function WhereClause(table, index, orCollection) {
        this.db = db;
        this._ctx = {
            table: table,
            index: index === ":id" ? null : index,
            or: orCollection
        };
        const indexedDB = db._deps.indexedDB;
        if (!indexedDB)
            throw new exceptions.MissingAPI();
        this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
        this._descending = (a, b) => indexedDB.cmp(b, a);
        this._max = (a, b) => indexedDB.cmp(a, b) > 0 ? a : b;
        this._min = (a, b) => indexedDB.cmp(a, b) < 0 ? a : b;
        this._IDBKeyRange = db._deps.IDBKeyRange;
    });
}

function eventRejectHandler(reject) {
    return wrap(function (event) {
        preventDefault(event);
        reject(event.target.error);
        return false;
    });
}
function preventDefault(event) {
    if (event.stopPropagation)
        event.stopPropagation();
    if (event.preventDefault)
        event.preventDefault();
}

const DEXIE_STORAGE_MUTATED_EVENT_NAME = 'storagemutated';
const STORAGE_MUTATED_DOM_EVENT_NAME = 'x-storagemutated-1';
const globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);

class Transaction {
    _lock() {
        assert(!PSD.global);
        ++this._reculock;
        if (this._reculock === 1 && !PSD.global)
            PSD.lockOwnerFor = this;
        return this;
    }
    _unlock() {
        assert(!PSD.global);
        if (--this._reculock === 0) {
            if (!PSD.global)
                PSD.lockOwnerFor = null;
            while (this._blockedFuncs.length > 0 && !this._locked()) {
                var fnAndPSD = this._blockedFuncs.shift();
                try {
                    usePSD(fnAndPSD[1], fnAndPSD[0]);
                }
                catch (e) { }
            }
        }
        return this;
    }
    _locked() {
        return this._reculock && PSD.lockOwnerFor !== this;
    }
    create(idbtrans) {
        if (!this.mode)
            return this;
        const idbdb = this.db.idbdb;
        const dbOpenError = this.db._state.dbOpenError;
        assert(!this.idbtrans);
        if (!idbtrans && !idbdb) {
            switch (dbOpenError && dbOpenError.name) {
                case "DatabaseClosedError":
                    throw new exceptions.DatabaseClosed(dbOpenError);
                case "MissingAPIError":
                    throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                default:
                    throw new exceptions.OpenFailed(dbOpenError);
            }
        }
        if (!this.active)
            throw new exceptions.TransactionInactive();
        assert(this._completion._state === null);
        idbtrans = this.idbtrans = idbtrans ||
            (this.db.core
                ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })
                : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
        idbtrans.onerror = wrap(ev => {
            preventDefault(ev);
            this._reject(idbtrans.error);
        });
        idbtrans.onabort = wrap(ev => {
            preventDefault(ev);
            this.active && this._reject(new exceptions.Abort(idbtrans.error));
            this.active = false;
            this.on("abort").fire(ev);
        });
        idbtrans.oncomplete = wrap(() => {
            this.active = false;
            this._resolve();
            if ('mutatedParts' in idbtrans) {
                globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
            }
        });
        return this;
    }
    _promise(mode, fn, bWriteLock) {
        if (mode === 'readwrite' && this.mode !== 'readwrite')
            return rejection(new exceptions.ReadOnly("Transaction is readonly"));
        if (!this.active)
            return rejection(new exceptions.TransactionInactive());
        if (this._locked()) {
            return new DexiePromise((resolve, reject) => {
                this._blockedFuncs.push([() => {
                        this._promise(mode, fn, bWriteLock).then(resolve, reject);
                    }, PSD]);
            });
        }
        else if (bWriteLock) {
            return newScope(() => {
                var p = new DexiePromise((resolve, reject) => {
                    this._lock();
                    const rv = fn(resolve, reject, this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p.finally(() => this._unlock());
                p._lib = true;
                return p;
            });
        }
        else {
            var p = new DexiePromise((resolve, reject) => {
                var rv = fn(resolve, reject, this);
                if (rv && rv.then)
                    rv.then(resolve, reject);
            });
            p._lib = true;
            return p;
        }
    }
    _root() {
        return this.parent ? this.parent._root() : this;
    }
    waitFor(promiseLike) {
        var root = this._root();
        const promise = DexiePromise.resolve(promiseLike);
        if (root._waitingFor) {
            root._waitingFor = root._waitingFor.then(() => promise);
        }
        else {
            root._waitingFor = promise;
            root._waitingQueue = [];
            var store = root.idbtrans.objectStore(root.storeNames[0]);
            (function spin() {
                ++root._spinCount;
                while (root._waitingQueue.length)
                    (root._waitingQueue.shift())();
                if (root._waitingFor)
                    store.get(-Infinity).onsuccess = spin;
            }());
        }
        var currentWaitPromise = root._waitingFor;
        return new DexiePromise((resolve, reject) => {
            promise.then(res => root._waitingQueue.push(wrap(resolve.bind(null, res))), err => root._waitingQueue.push(wrap(reject.bind(null, err)))).finally(() => {
                if (root._waitingFor === currentWaitPromise) {
                    root._waitingFor = null;
                }
            });
        });
    }
    abort() {
        if (this.active) {
            this.active = false;
            if (this.idbtrans)
                this.idbtrans.abort();
            this._reject(new exceptions.Abort());
        }
    }
    table(tableName) {
        const memoizedTables = (this._memoizedTables || (this._memoizedTables = {}));
        if (hasOwn(memoizedTables, tableName))
            return memoizedTables[tableName];
        const tableSchema = this.schema[tableName];
        if (!tableSchema) {
            throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
        }
        const transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
        transactionBoundTable.core = this.db.core.table(tableName);
        memoizedTables[tableName] = transactionBoundTable;
        return transactionBoundTable;
    }
}

function createTransactionConstructor(db) {
    return makeClassConstructor(Transaction.prototype, function Transaction(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
        this.db = db;
        this.mode = mode;
        this.storeNames = storeNames;
        this.schema = dbschema;
        this.chromeTransactionDurability = chromeTransactionDurability;
        this.idbtrans = null;
        this.on = Events(this, "complete", "error", "abort");
        this.parent = parent || null;
        this.active = true;
        this._reculock = 0;
        this._blockedFuncs = [];
        this._resolve = null;
        this._reject = null;
        this._waitingFor = null;
        this._waitingQueue = null;
        this._spinCount = 0;
        this._completion = new DexiePromise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this._completion.then(() => {
            this.active = false;
            this.on.complete.fire();
        }, e => {
            var wasActive = this.active;
            this.active = false;
            this.on.error.fire(e);
            this.parent ?
                this.parent._reject(e) :
                wasActive && this.idbtrans && this.idbtrans.abort();
            return rejection(e);
        });
    });
}

function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
    return {
        name,
        keyPath,
        unique,
        multi,
        auto,
        compound,
        src: (unique && !isPrimKey ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + nameFromKeyPath(keyPath)
    };
}
function nameFromKeyPath(keyPath) {
    return typeof keyPath === 'string' ?
        keyPath :
        keyPath ? ('[' + [].join.call(keyPath, '+') + ']') : "";
}

function createTableSchema(name, primKey, indexes) {
    return {
        name,
        primKey,
        indexes,
        mappedClass: null,
        idxByName: arrayToObject(indexes, index => [index.name, index])
    };
}

function safariMultiStoreFix(storeNames) {
    return storeNames.length === 1 ? storeNames[0] : storeNames;
}
let getMaxKey = (IdbKeyRange) => {
    try {
        IdbKeyRange.only([[]]);
        getMaxKey = () => [[]];
        return [[]];
    }
    catch (e) {
        getMaxKey = () => maxString;
        return maxString;
    }
};

function getKeyExtractor(keyPath) {
    if (keyPath == null) {
        return () => undefined;
    }
    else if (typeof keyPath === 'string') {
        return getSinglePathKeyExtractor(keyPath);
    }
    else {
        return obj => getByKeyPath(obj, keyPath);
    }
}
function getSinglePathKeyExtractor(keyPath) {
    const split = keyPath.split('.');
    if (split.length === 1) {
        return obj => obj[keyPath];
    }
    else {
        return obj => getByKeyPath(obj, keyPath);
    }
}

function arrayify(arrayLike) {
    return [].slice.call(arrayLike);
}
let _id_counter = 0;
function getKeyPathAlias(keyPath) {
    return keyPath == null ?
        ":id" :
        typeof keyPath === 'string' ?
            keyPath :
            `[${keyPath.join('+')}]`;
}
function createDBCore(db, IdbKeyRange, tmpTrans) {
    function extractSchema(db, trans) {
        const tables = arrayify(db.objectStoreNames);
        return {
            schema: {
                name: db.name,
                tables: tables.map(table => trans.objectStore(table)).map(store => {
                    const { keyPath, autoIncrement } = store;
                    const compound = isArray(keyPath);
                    const outbound = keyPath == null;
                    const indexByKeyPath = {};
                    const result = {
                        name: store.name,
                        primaryKey: {
                            name: null,
                            isPrimaryKey: true,
                            outbound,
                            compound,
                            keyPath,
                            autoIncrement,
                            unique: true,
                            extractKey: getKeyExtractor(keyPath)
                        },
                        indexes: arrayify(store.indexNames).map(indexName => store.index(indexName))
                            .map(index => {
                            const { name, unique, multiEntry, keyPath } = index;
                            const compound = isArray(keyPath);
                            const result = {
                                name,
                                compound,
                                keyPath,
                                unique,
                                multiEntry,
                                extractKey: getKeyExtractor(keyPath)
                            };
                            indexByKeyPath[getKeyPathAlias(keyPath)] = result;
                            return result;
                        }),
                        getIndexByKeyPath: (keyPath) => indexByKeyPath[getKeyPathAlias(keyPath)]
                    };
                    indexByKeyPath[":id"] = result.primaryKey;
                    if (keyPath != null) {
                        indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                    }
                    return result;
                })
            },
            hasGetAll: tables.length > 0 && ('getAll' in trans.objectStore(tables[0])) &&
                !(typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
                    !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
                    [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
        };
    }
    function makeIDBKeyRange(range) {
        if (range.type === 3 )
            return null;
        if (range.type === 4 )
            throw new Error("Cannot convert never type to IDBKeyRange");
        const { lower, upper, lowerOpen, upperOpen } = range;
        const idbRange = lower === undefined ?
            upper === undefined ?
                null :
                IdbKeyRange.upperBound(upper, !!upperOpen) :
            upper === undefined ?
                IdbKeyRange.lowerBound(lower, !!lowerOpen) :
                IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
        return idbRange;
    }
    function createDbCoreTable(tableSchema) {
        const tableName = tableSchema.name;
        function mutate({ trans, type, keys, values, range }) {
            return new Promise((resolve, reject) => {
                resolve = wrap(resolve);
                const store = trans.objectStore(tableName);
                const outbound = store.keyPath == null;
                const isAddOrPut = type === "put" || type === "add";
                if (!isAddOrPut && type !== 'delete' && type !== 'deleteRange')
                    throw new Error("Invalid operation type: " + type);
                const { length } = keys || values || { length: 1 };
                if (keys && values && keys.length !== values.length) {
                    throw new Error("Given keys array must have same length as given values array.");
                }
                if (length === 0)
                    return resolve({ numFailures: 0, failures: {}, results: [], lastResult: undefined });
                let req;
                const reqs = [];
                const failures = [];
                let numFailures = 0;
                const errorHandler = event => {
                    ++numFailures;
                    preventDefault(event);
                };
                if (type === 'deleteRange') {
                    if (range.type === 4 )
                        return resolve({ numFailures, failures, results: [], lastResult: undefined });
                    if (range.type === 3 )
                        reqs.push(req = store.clear());
                    else
                        reqs.push(req = store.delete(makeIDBKeyRange(range)));
                }
                else {
                    const [args1, args2] = isAddOrPut ?
                        outbound ?
                            [values, keys] :
                            [values, null] :
                        [keys, null];
                    if (isAddOrPut) {
                        for (let i = 0; i < length; ++i) {
                            reqs.push(req = (args2 && args2[i] !== undefined ?
                                store[type](args1[i], args2[i]) :
                                store[type](args1[i])));
                            req.onerror = errorHandler;
                        }
                    }
                    else {
                        for (let i = 0; i < length; ++i) {
                            reqs.push(req = store[type](args1[i]));
                            req.onerror = errorHandler;
                        }
                    }
                }
                const done = event => {
                    const lastResult = event.target.result;
                    reqs.forEach((req, i) => req.error != null && (failures[i] = req.error));
                    resolve({
                        numFailures,
                        failures,
                        results: type === "delete" ? keys : reqs.map(req => req.result),
                        lastResult
                    });
                };
                req.onerror = event => {
                    errorHandler(event);
                    done(event);
                };
                req.onsuccess = done;
            });
        }
        function openCursor({ trans, values, query, reverse, unique }) {
            return new Promise((resolve, reject) => {
                resolve = wrap(resolve);
                const { index, range } = query;
                const store = trans.objectStore(tableName);
                const source = index.isPrimaryKey ?
                    store :
                    store.index(index.name);
                const direction = reverse ?
                    unique ?
                        "prevunique" :
                        "prev" :
                    unique ?
                        "nextunique" :
                        "next";
                const req = values || !('openKeyCursor' in source) ?
                    source.openCursor(makeIDBKeyRange(range), direction) :
                    source.openKeyCursor(makeIDBKeyRange(range), direction);
                req.onerror = eventRejectHandler(reject);
                req.onsuccess = wrap(ev => {
                    const cursor = req.result;
                    if (!cursor) {
                        resolve(null);
                        return;
                    }
                    cursor.___id = ++_id_counter;
                    cursor.done = false;
                    const _cursorContinue = cursor.continue.bind(cursor);
                    let _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                    if (_cursorContinuePrimaryKey)
                        _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                    const _cursorAdvance = cursor.advance.bind(cursor);
                    const doThrowCursorIsNotStarted = () => { throw new Error("Cursor not started"); };
                    const doThrowCursorIsStopped = () => { throw new Error("Cursor not stopped"); };
                    cursor.trans = trans;
                    cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                    cursor.fail = wrap(reject);
                    cursor.next = function () {
                        let gotOne = 1;
                        return this.start(() => gotOne-- ? this.continue() : this.stop()).then(() => this);
                    };
                    cursor.start = (callback) => {
                        const iterationPromise = new Promise((resolveIteration, rejectIteration) => {
                            resolveIteration = wrap(resolveIteration);
                            req.onerror = eventRejectHandler(rejectIteration);
                            cursor.fail = rejectIteration;
                            cursor.stop = value => {
                                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                                resolveIteration(value);
                            };
                        });
                        const guardedCallback = () => {
                            if (req.result) {
                                try {
                                    callback();
                                }
                                catch (err) {
                                    cursor.fail(err);
                                }
                            }
                            else {
                                cursor.done = true;
                                cursor.start = () => { throw new Error("Cursor behind last entry"); };
                                cursor.stop();
                            }
                        };
                        req.onsuccess = wrap(ev => {
                            req.onsuccess = guardedCallback;
                            guardedCallback();
                        });
                        cursor.continue = _cursorContinue;
                        cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                        cursor.advance = _cursorAdvance;
                        guardedCallback();
                        return iterationPromise;
                    };
                    resolve(cursor);
                }, reject);
            });
        }
        function query(hasGetAll) {
            return (request) => {
                return new Promise((resolve, reject) => {
                    resolve = wrap(resolve);
                    const { trans, values, limit, query } = request;
                    const nonInfinitLimit = limit === Infinity ? undefined : limit;
                    const { index, range } = query;
                    const store = trans.objectStore(tableName);
                    const source = index.isPrimaryKey ? store : store.index(index.name);
                    const idbKeyRange = makeIDBKeyRange(range);
                    if (limit === 0)
                        return resolve({ result: [] });
                    if (hasGetAll) {
                        const req = values ?
                            source.getAll(idbKeyRange, nonInfinitLimit) :
                            source.getAllKeys(idbKeyRange, nonInfinitLimit);
                        req.onsuccess = event => resolve({ result: event.target.result });
                        req.onerror = eventRejectHandler(reject);
                    }
                    else {
                        let count = 0;
                        const req = values || !('openKeyCursor' in source) ?
                            source.openCursor(idbKeyRange) :
                            source.openKeyCursor(idbKeyRange);
                        const result = [];
                        req.onsuccess = event => {
                            const cursor = req.result;
                            if (!cursor)
                                return resolve({ result });
                            result.push(values ? cursor.value : cursor.primaryKey);
                            if (++count === limit)
                                return resolve({ result });
                            cursor.continue();
                        };
                        req.onerror = eventRejectHandler(reject);
                    }
                });
            };
        }
        return {
            name: tableName,
            schema: tableSchema,
            mutate,
            getMany({ trans, keys }) {
                return new Promise((resolve, reject) => {
                    resolve = wrap(resolve);
                    const store = trans.objectStore(tableName);
                    const length = keys.length;
                    const result = new Array(length);
                    let keyCount = 0;
                    let callbackCount = 0;
                    let req;
                    const successHandler = event => {
                        const req = event.target;
                        if ((result[req._pos] = req.result) != null)
                            ;
                        if (++callbackCount === keyCount)
                            resolve(result);
                    };
                    const errorHandler = eventRejectHandler(reject);
                    for (let i = 0; i < length; ++i) {
                        const key = keys[i];
                        if (key != null) {
                            req = store.get(keys[i]);
                            req._pos = i;
                            req.onsuccess = successHandler;
                            req.onerror = errorHandler;
                            ++keyCount;
                        }
                    }
                    if (keyCount === 0)
                        resolve(result);
                });
            },
            get({ trans, key }) {
                return new Promise((resolve, reject) => {
                    resolve = wrap(resolve);
                    const store = trans.objectStore(tableName);
                    const req = store.get(key);
                    req.onsuccess = event => resolve(event.target.result);
                    req.onerror = eventRejectHandler(reject);
                });
            },
            query: query(hasGetAll),
            openCursor,
            count({ query, trans }) {
                const { index, range } = query;
                return new Promise((resolve, reject) => {
                    const store = trans.objectStore(tableName);
                    const source = index.isPrimaryKey ? store : store.index(index.name);
                    const idbKeyRange = makeIDBKeyRange(range);
                    const req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                    req.onsuccess = wrap(ev => resolve(ev.target.result));
                    req.onerror = eventRejectHandler(reject);
                });
            }
        };
    }
    const { schema, hasGetAll } = extractSchema(db, tmpTrans);
    const tables = schema.tables.map(tableSchema => createDbCoreTable(tableSchema));
    const tableMap = {};
    tables.forEach(table => tableMap[table.name] = table);
    return {
        stack: "dbcore",
        transaction: db.transaction.bind(db),
        table(name) {
            const result = tableMap[name];
            if (!result)
                throw new Error(`Table '${name}' not found`);
            return tableMap[name];
        },
        MIN_KEY: -Infinity,
        MAX_KEY: getMaxKey(IdbKeyRange),
        schema
    };
}

function createMiddlewareStack(stackImpl, middlewares) {
    return middlewares.reduce((down, { create }) => ({ ...down, ...create(down) }), stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, { IDBKeyRange, indexedDB }, tmpTrans) {
    const dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
    return {
        dbcore
    };
}
function generateMiddlewareStacks({ _novip: db }, tmpTrans) {
    const idbdb = tmpTrans.db;
    const stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
    db.core = stacks.dbcore;
    db.tables.forEach(table => {
        const tableName = table.name;
        if (db.core.schema.tables.some(tbl => tbl.name === tableName)) {
            table.core = db.core.table(tableName);
            if (db[tableName] instanceof db.Table) {
                db[tableName].core = table.core;
            }
        }
    });
}

function setApiOnPlace({ _novip: db }, objs, tableNames, dbschema) {
    tableNames.forEach(tableName => {
        const schema = dbschema[tableName];
        objs.forEach(obj => {
            const propDesc = getPropertyDescriptor(obj, tableName);
            if (!propDesc || ("value" in propDesc && propDesc.value === undefined)) {
                if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                    setProp(obj, tableName, {
                        get() { return this.table(tableName); },
                        set(value) {
                            defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
                        }
                    });
                }
                else {
                    obj[tableName] = new db.Table(tableName, schema);
                }
            }
        });
    });
}
function removeTablesApi({ _novip: db }, objs) {
    objs.forEach(obj => {
        for (let key in obj) {
            if (obj[key] instanceof db.Table)
                delete obj[key];
        }
    });
}
function lowerVersionFirst(a, b) {
    return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
    const globalSchema = db._dbSchema;
    const trans = db._createTransaction('readwrite', db._storeNames, globalSchema);
    trans.create(idbUpgradeTrans);
    trans._completion.catch(reject);
    const rejectTransaction = trans._reject.bind(trans);
    const transless = PSD.transless || PSD;
    newScope(() => {
        PSD.trans = trans;
        PSD.transless = transless;
        if (oldVersion === 0) {
            keys(globalSchema).forEach(tableName => {
                createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
            });
            generateMiddlewareStacks(db, idbUpgradeTrans);
            DexiePromise.follow(() => db.on.populate.fire(trans)).catch(rejectTransaction);
        }
        else
            updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
    });
}
function updateTablesAndIndexes({ _novip: db }, oldVersion, trans, idbUpgradeTrans) {
    const queue = [];
    const versions = db._versions;
    let globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
    let anyContentUpgraderHasRun = false;
    const versToRun = versions.filter(v => v._cfg.version >= oldVersion);
    versToRun.forEach(version => {
        queue.push(() => {
            const oldSchema = globalSchema;
            const newSchema = version._cfg.dbschema;
            adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
            adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
            globalSchema = db._dbSchema = newSchema;
            const diff = getSchemaDiff(oldSchema, newSchema);
            diff.add.forEach(tuple => {
                createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
            });
            diff.change.forEach(change => {
                if (change.recreate) {
                    throw new exceptions.Upgrade("Not yet support for changing primary key");
                }
                else {
                    const store = idbUpgradeTrans.objectStore(change.name);
                    change.add.forEach(idx => addIndex(store, idx));
                    change.change.forEach(idx => {
                        store.deleteIndex(idx.name);
                        addIndex(store, idx);
                    });
                    change.del.forEach(idxName => store.deleteIndex(idxName));
                }
            });
            const contentUpgrade = version._cfg.contentUpgrade;
            if (contentUpgrade && version._cfg.version > oldVersion) {
                generateMiddlewareStacks(db, idbUpgradeTrans);
                trans._memoizedTables = {};
                anyContentUpgraderHasRun = true;
                let upgradeSchema = shallowClone(newSchema);
                diff.del.forEach(table => {
                    upgradeSchema[table] = oldSchema[table];
                });
                removeTablesApi(db, [db.Transaction.prototype]);
                setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema), upgradeSchema);
                trans.schema = upgradeSchema;
                const contentUpgradeIsAsync = isAsyncFunction(contentUpgrade);
                if (contentUpgradeIsAsync) {
                    incrementExpectedAwaits();
                }
                let returnValue;
                const promiseFollowed = DexiePromise.follow(() => {
                    returnValue = contentUpgrade(trans);
                    if (returnValue) {
                        if (contentUpgradeIsAsync) {
                            var decrementor = decrementExpectedAwaits.bind(null, null);
                            returnValue.then(decrementor, decrementor);
                        }
                    }
                });
                return (returnValue && typeof returnValue.then === 'function' ?
                    DexiePromise.resolve(returnValue) : promiseFollowed.then(() => returnValue));
            }
        });
        queue.push(idbtrans => {
            if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                const newSchema = version._cfg.dbschema;
                deleteRemovedTables(newSchema, idbtrans);
            }
            removeTablesApi(db, [db.Transaction.prototype]);
            setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
            trans.schema = db._dbSchema;
        });
    });
    function runQueue() {
        return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
            DexiePromise.resolve();
    }
    return runQueue().then(() => {
        createMissingTables(globalSchema, idbUpgradeTrans);
    });
}
function getSchemaDiff(oldSchema, newSchema) {
    const diff = {
        del: [],
        add: [],
        change: []
    };
    let table;
    for (table in oldSchema) {
        if (!newSchema[table])
            diff.del.push(table);
    }
    for (table in newSchema) {
        const oldDef = oldSchema[table], newDef = newSchema[table];
        if (!oldDef) {
            diff.add.push([table, newDef]);
        }
        else {
            const change = {
                name: table,
                def: newDef,
                recreate: false,
                del: [],
                add: [],
                change: []
            };
            if ((
            '' + (oldDef.primKey.keyPath || '')) !== ('' + (newDef.primKey.keyPath || '')) ||
                (oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge))
             {
                change.recreate = true;
                diff.change.push(change);
            }
            else {
                const oldIndexes = oldDef.idxByName;
                const newIndexes = newDef.idxByName;
                let idxName;
                for (idxName in oldIndexes) {
                    if (!newIndexes[idxName])
                        change.del.push(idxName);
                }
                for (idxName in newIndexes) {
                    const oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                    if (!oldIdx)
                        change.add.push(newIdx);
                    else if (oldIdx.src !== newIdx.src)
                        change.change.push(newIdx);
                }
                if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                    diff.change.push(change);
                }
            }
        }
    }
    return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
    const store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ?
        { keyPath: primKey.keyPath, autoIncrement: primKey.auto } :
        { autoIncrement: primKey.auto });
    indexes.forEach(idx => addIndex(store, idx));
    return store;
}
function createMissingTables(newSchema, idbtrans) {
    keys(newSchema).forEach(tableName => {
        if (!idbtrans.db.objectStoreNames.contains(tableName)) {
            createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
        }
    });
}
function deleteRemovedTables(newSchema, idbtrans) {
    [].slice.call(idbtrans.db.objectStoreNames).forEach(storeName => newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName));
}
function addIndex(store, idx) {
    store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
    const globalSchema = {};
    const dbStoreNames = slice(idbdb.objectStoreNames, 0);
    dbStoreNames.forEach(storeName => {
        const store = tmpTrans.objectStore(storeName);
        let keyPath = store.keyPath;
        const primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
        const indexes = [];
        for (let j = 0; j < store.indexNames.length; ++j) {
            const idbindex = store.index(store.indexNames[j]);
            keyPath = idbindex.keyPath;
            var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
            indexes.push(index);
        }
        globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
    });
    return globalSchema;
}
function readGlobalSchema({ _novip: db }, idbdb, tmpTrans) {
    db.verno = idbdb.version / 10;
    const globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
    db._storeNames = slice(idbdb.objectStoreNames, 0);
    setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db, tmpTrans) {
    const installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
    const diff = getSchemaDiff(installedSchema, db._dbSchema);
    return !(diff.add.length || diff.change.some(ch => ch.add.length || ch.change.length));
}
function adjustToExistingIndexNames({ _novip: db }, schema, idbtrans) {
    const storeNames = idbtrans.db.objectStoreNames;
    for (let i = 0; i < storeNames.length; ++i) {
        const storeName = storeNames[i];
        const store = idbtrans.objectStore(storeName);
        db._hasGetAll = 'getAll' in store;
        for (let j = 0; j < store.indexNames.length; ++j) {
            const indexName = store.indexNames[j];
            const keyPath = store.index(indexName).keyPath;
            const dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
            if (schema[storeName]) {
                const indexSpec = schema[storeName].idxByName[dexieName];
                if (indexSpec) {
                    indexSpec.name = indexName;
                    delete schema[storeName].idxByName[dexieName];
                    schema[storeName].idxByName[indexName] = indexSpec;
                }
            }
        }
    }
    if (typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
        !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
        _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
        [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
        db._hasGetAll = false;
    }
}
function parseIndexSyntax(primKeyAndIndexes) {
    return primKeyAndIndexes.split(',').map((index, indexNum) => {
        index = index.trim();
        const name = index.replace(/([&*]|\+\+)/g, "");
        const keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
        return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
    });
}

class Version {
    _parseStoresSpec(stores, outSchema) {
        keys(stores).forEach(tableName => {
            if (stores[tableName] !== null) {
                var indexes = parseIndexSyntax(stores[tableName]);
                var primKey = indexes.shift();
                if (primKey.multi)
                    throw new exceptions.Schema("Primary key cannot be multi-valued");
                indexes.forEach(idx => {
                    if (idx.auto)
                        throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                    if (!idx.keyPath)
                        throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                });
                outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
            }
        });
    }
    stores(stores) {
        const db = this.db;
        this._cfg.storesSource = this._cfg.storesSource ?
            extend(this._cfg.storesSource, stores) :
            stores;
        const versions = db._versions;
        const storesSpec = {};
        let dbschema = {};
        versions.forEach(version => {
            extend(storesSpec, version._cfg.storesSource);
            dbschema = (version._cfg.dbschema = {});
            version._parseStoresSpec(storesSpec, dbschema);
        });
        db._dbSchema = dbschema;
        removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
        setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
        db._storeNames = keys(dbschema);
        return this;
    }
    upgrade(upgradeFunction) {
        this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
        return this;
    }
}

function createVersionConstructor(db) {
    return makeClassConstructor(Version.prototype, function Version(versionNumber) {
        this.db = db;
        this._cfg = {
            version: versionNumber,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
        };
    });
}

function getDbNamesTable(indexedDB, IDBKeyRange) {
    let dbNamesDB = indexedDB["_dbNamesDB"];
    if (!dbNamesDB) {
        dbNamesDB = indexedDB["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
            addons: [],
            indexedDB,
            IDBKeyRange,
        });
        dbNamesDB.version(1).stores({ dbnames: "name" });
    }
    return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB) {
    return indexedDB && typeof indexedDB.databases === "function";
}
function getDatabaseNames({ indexedDB, IDBKeyRange, }) {
    return hasDatabasesNative(indexedDB)
        ? Promise.resolve(indexedDB.databases()).then((infos) => infos
            .map((info) => info.name)
            .filter((name) => name !== DBNAMES_DB))
        : getDbNamesTable(indexedDB, IDBKeyRange).toCollection().primaryKeys();
}
function _onDatabaseCreated({ indexedDB, IDBKeyRange }, name) {
    !hasDatabasesNative(indexedDB) &&
        name !== DBNAMES_DB &&
        getDbNamesTable(indexedDB, IDBKeyRange).put({ name }).catch(nop);
}
function _onDatabaseDeleted({ indexedDB, IDBKeyRange }, name) {
    !hasDatabasesNative(indexedDB) &&
        name !== DBNAMES_DB &&
        getDbNamesTable(indexedDB, IDBKeyRange).delete(name).catch(nop);
}

function vip(fn) {
    return newScope(function () {
        PSD.letThrough = true;
        return fn();
    });
}

function idbReady() {
    var isSafari = !navigator.userAgentData &&
        /Safari\//.test(navigator.userAgent) &&
        !/Chrom(e|ium)\//.test(navigator.userAgent);
    if (!isSafari || !indexedDB.databases)
        return Promise.resolve();
    var intervalId;
    return new Promise(function (resolve) {
        var tryIdb = function () { return indexedDB.databases().finally(resolve); };
        intervalId = setInterval(tryIdb, 100);
        tryIdb();
    }).finally(function () { return clearInterval(intervalId); });
}

function dexieOpen(db) {
    const state = db._state;
    const { indexedDB } = db._deps;
    if (state.isBeingOpened || db.idbdb)
        return state.dbReadyPromise.then(() => state.dbOpenError ?
            rejection(state.dbOpenError) :
            db);
    debug && (state.openCanceller._stackHolder = getErrorWithStack());
    state.isBeingOpened = true;
    state.dbOpenError = null;
    state.openComplete = false;
    const openCanceller = state.openCanceller;
    function throwIfCancelled() {
        if (state.openCanceller !== openCanceller)
            throw new exceptions.DatabaseClosed('db.open() was cancelled');
    }
    let resolveDbReady = state.dbReadyResolve,
    upgradeTransaction = null, wasCreated = false;
    const tryOpenDB = () => new DexiePromise((resolve, reject) => {
        throwIfCancelled();
        if (!indexedDB)
            throw new exceptions.MissingAPI();
        const dbName = db.name;
        const req = state.autoSchema ?
            indexedDB.open(dbName) :
            indexedDB.open(dbName, Math.round(db.verno * 10));
        if (!req)
            throw new exceptions.MissingAPI();
        req.onerror = eventRejectHandler(reject);
        req.onblocked = wrap(db._fireOnBlocked);
        req.onupgradeneeded = wrap(e => {
            upgradeTransaction = req.transaction;
            if (state.autoSchema && !db._options.allowEmptyDB) {
                req.onerror = preventDefault;
                upgradeTransaction.abort();
                req.result.close();
                const delreq = indexedDB.deleteDatabase(dbName);
                delreq.onsuccess = delreq.onerror = wrap(() => {
                    reject(new exceptions.NoSuchDatabase(`Database ${dbName} doesnt exist`));
                });
            }
            else {
                upgradeTransaction.onerror = eventRejectHandler(reject);
                var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                wasCreated = oldVer < 1;
                db._novip.idbdb = req.result;
                runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
            }
        }, reject);
        req.onsuccess = wrap(() => {
            upgradeTransaction = null;
            const idbdb = db._novip.idbdb = req.result;
            const objectStoreNames = slice(idbdb.objectStoreNames);
            if (objectStoreNames.length > 0)
                try {
                    const tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), 'readonly');
                    if (state.autoSchema)
                        readGlobalSchema(db, idbdb, tmpTrans);
                    else {
                        adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                        if (!verifyInstalledSchema(db, tmpTrans)) {
                            console.warn(`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.`);
                        }
                    }
                    generateMiddlewareStacks(db, tmpTrans);
                }
                catch (e) {
                }
            connections.push(db);
            idbdb.onversionchange = wrap(ev => {
                state.vcFired = true;
                db.on("versionchange").fire(ev);
            });
            idbdb.onclose = wrap(ev => {
                db.on("close").fire(ev);
            });
            if (wasCreated)
                _onDatabaseCreated(db._deps, dbName);
            resolve();
        }, reject);
    }).catch(err => {
        if (err && err.name === 'UnknownError' && state.PR1398_maxLoop > 0) {
            state.PR1398_maxLoop--;
            console.warn('Dexie: Workaround for Chrome UnknownError on open()');
            return tryOpenDB();
        }
        else {
            return DexiePromise.reject(err);
        }
    });
    return DexiePromise.race([
        openCanceller,
        (typeof navigator === 'undefined' ? DexiePromise.resolve() : idbReady()).then(tryOpenDB)
    ]).then(() => {
        throwIfCancelled();
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(() => db.on.ready.fire(db.vip))).then(function fireRemainders() {
            if (state.onReadyBeingFired.length > 0) {
                let remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
                state.onReadyBeingFired = [];
                return DexiePromise.resolve(vip(() => remainders(db.vip))).then(fireRemainders);
            }
        });
    }).finally(() => {
        state.onReadyBeingFired = null;
        state.isBeingOpened = false;
    }).then(() => {
        return db;
    }).catch(err => {
        state.dbOpenError = err;
        try {
            upgradeTransaction && upgradeTransaction.abort();
        }
        catch (_a) { }
        if (openCanceller === state.openCanceller) {
            db._close();
        }
        return rejection(err);
    }).finally(() => {
        state.openComplete = true;
        resolveDbReady();
    });
}

function awaitIterator(iterator) {
    var callNext = result => iterator.next(result), doThrow = error => iterator.throw(error), onSuccess = step(callNext), onError = step(doThrow);
    function step(getNext) {
        return (val) => {
            var next = getNext(val), value = next.value;
            return next.done ? value :
                (!value || typeof value.then !== 'function' ?
                    isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) :
                    value.then(onSuccess, onError));
        };
    }
    return step(callNext)();
}

function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
    var i = arguments.length;
    if (i < 2)
        throw new exceptions.InvalidArgument("Too few arguments");
    var args = new Array(i - 1);
    while (--i)
        args[i - 1] = arguments[i];
    scopeFunc = args.pop();
    var tables = flatten(args);
    return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
    return DexiePromise.resolve().then(() => {
        const transless = PSD.transless || PSD;
        const trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
        const zoneProps = {
            trans: trans,
            transless: transless
        };
        if (parentTransaction) {
            trans.idbtrans = parentTransaction.idbtrans;
        }
        else {
            try {
                trans.create();
                db._state.PR1398_maxLoop = 3;
            }
            catch (ex) {
                if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                    console.warn('Dexie: Need to reopen db');
                    db._close();
                    return db.open().then(() => enterTransactionScope(db, mode, storeNames, null, scopeFunc));
                }
                return rejection(ex);
            }
        }
        const scopeFuncIsAsync = isAsyncFunction(scopeFunc);
        if (scopeFuncIsAsync) {
            incrementExpectedAwaits();
        }
        let returnValue;
        const promiseFollowed = DexiePromise.follow(() => {
            returnValue = scopeFunc.call(trans, trans);
            if (returnValue) {
                if (scopeFuncIsAsync) {
                    var decrementor = decrementExpectedAwaits.bind(null, null);
                    returnValue.then(decrementor, decrementor);
                }
                else if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                    returnValue = awaitIterator(returnValue);
                }
            }
        }, zoneProps);
        return (returnValue && typeof returnValue.then === 'function' ?
            DexiePromise.resolve(returnValue).then(x => trans.active ?
                x
                : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")))
            : promiseFollowed.then(() => returnValue)).then(x => {
            if (parentTransaction)
                trans._resolve();
            return trans._completion.then(() => x);
        }).catch(e => {
            trans._reject(e);
            return rejection(e);
        });
    });
}

function pad(a, value, count) {
    const result = isArray(a) ? a.slice() : [a];
    for (let i = 0; i < count; ++i)
        result.push(value);
    return result;
}
function createVirtualIndexMiddleware(down) {
    return {
        ...down,
        table(tableName) {
            const table = down.table(tableName);
            const { schema } = table;
            const indexLookup = {};
            const allVirtualIndexes = [];
            function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
                const keyPathAlias = getKeyPathAlias(keyPath);
                const indexList = (indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || []);
                const keyLength = keyPath == null ? 0 : typeof keyPath === 'string' ? 1 : keyPath.length;
                const isVirtual = keyTail > 0;
                const virtualIndex = {
                    ...lowLevelIndex,
                    isVirtual,
                    keyTail,
                    keyLength,
                    extractKey: getKeyExtractor(keyPath),
                    unique: !isVirtual && lowLevelIndex.unique
                };
                indexList.push(virtualIndex);
                if (!virtualIndex.isPrimaryKey) {
                    allVirtualIndexes.push(virtualIndex);
                }
                if (keyLength > 1) {
                    const virtualKeyPath = keyLength === 2 ?
                        keyPath[0] :
                        keyPath.slice(0, keyLength - 1);
                    addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
                }
                indexList.sort((a, b) => a.keyTail - b.keyTail);
                return virtualIndex;
            }
            const primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
            indexLookup[":id"] = [primaryKey];
            for (const index of schema.indexes) {
                addVirtualIndexes(index.keyPath, 0, index);
            }
            function findBestIndex(keyPath) {
                const result = indexLookup[getKeyPathAlias(keyPath)];
                return result && result[0];
            }
            function translateRange(range, keyTail) {
                return {
                    type: range.type === 1  ?
                        2  :
                        range.type,
                    lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                    lowerOpen: true,
                    upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                    upperOpen: true
                };
            }
            function translateRequest(req) {
                const index = req.query.index;
                return index.isVirtual ? {
                    ...req,
                    query: {
                        index,
                        range: translateRange(req.query.range, index.keyTail)
                    }
                } : req;
            }
            const result = {
                ...table,
                schema: {
                    ...schema,
                    primaryKey,
                    indexes: allVirtualIndexes,
                    getIndexByKeyPath: findBestIndex
                },
                count(req) {
                    return table.count(translateRequest(req));
                },
                query(req) {
                    return table.query(translateRequest(req));
                },
                openCursor(req) {
                    const { keyTail, isVirtual, keyLength } = req.query.index;
                    if (!isVirtual)
                        return table.openCursor(req);
                    function createVirtualCursor(cursor) {
                        function _continue(key) {
                            key != null ?
                                cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) :
                                req.unique ?
                                    cursor.continue(cursor.key.slice(0, keyLength)
                                        .concat(req.reverse
                                        ? down.MIN_KEY
                                        : down.MAX_KEY, keyTail)) :
                                    cursor.continue();
                        }
                        const virtualCursor = Object.create(cursor, {
                            continue: { value: _continue },
                            continuePrimaryKey: {
                                value(key, primaryKey) {
                                    cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey);
                                }
                            },
                            primaryKey: {
                                get() {
                                    return cursor.primaryKey;
                                }
                            },
                            key: {
                                get() {
                                    const key = cursor.key;
                                    return keyLength === 1 ?
                                        key[0] :
                                        key.slice(0, keyLength);
                                }
                            },
                            value: {
                                get() {
                                    return cursor.value;
                                }
                            }
                        });
                        return virtualCursor;
                    }
                    return table.openCursor(translateRequest(req))
                        .then(cursor => cursor && createVirtualCursor(cursor));
                }
            };
            return result;
        }
    };
}
const virtualIndexMiddleware = {
    stack: "dbcore",
    name: "VirtualIndexMiddleware",
    level: 1,
    create: createVirtualIndexMiddleware
};

function getObjectDiff(a, b, rv, prfx) {
    rv = rv || {};
    prfx = prfx || '';
    keys(a).forEach((prop) => {
        if (!hasOwn(b, prop)) {
            rv[prfx + prop] = undefined;
        }
        else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === 'object' && typeof bp === 'object' && ap && bp) {
                const apTypeName = toStringTag(ap);
                const bpTypeName = toStringTag(bp);
                if (apTypeName !== bpTypeName) {
                    rv[prfx + prop] = b[prop];
                }
                else if (apTypeName === 'Object') {
                    getObjectDiff(ap, bp, rv, prfx + prop + '.');
                }
                else if (ap !== bp) {
                    rv[prfx + prop] = b[prop];
                }
            }
            else if (ap !== bp)
                rv[prfx + prop] = b[prop];
        }
    });
    keys(b).forEach((prop) => {
        if (!hasOwn(a, prop)) {
            rv[prfx + prop] = b[prop];
        }
    });
    return rv;
}

function getEffectiveKeys(primaryKey, req) {
    if (req.type === 'delete')
        return req.keys;
    return req.keys || req.values.map(primaryKey.extractKey);
}

const hooksMiddleware = {
    stack: "dbcore",
    name: "HooksMiddleware",
    level: 2,
    create: (downCore) => ({
        ...downCore,
        table(tableName) {
            const downTable = downCore.table(tableName);
            const { primaryKey } = downTable.schema;
            const tableMiddleware = {
                ...downTable,
                mutate(req) {
                    const dxTrans = PSD.trans;
                    const { deleting, creating, updating } = dxTrans.table(tableName).hook;
                    switch (req.type) {
                        case 'add':
                            if (creating.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', () => addPutOrDelete(req), true);
                        case 'put':
                            if (creating.fire === nop && updating.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', () => addPutOrDelete(req), true);
                        case 'delete':
                            if (deleting.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', () => addPutOrDelete(req), true);
                        case 'deleteRange':
                            if (deleting.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', () => deleteRange(req), true);
                    }
                    return downTable.mutate(req);
                    function addPutOrDelete(req) {
                        const dxTrans = PSD.trans;
                        const keys = req.keys || getEffectiveKeys(primaryKey, req);
                        if (!keys)
                            throw new Error("Keys missing");
                        req = req.type === 'add' || req.type === 'put' ?
                            { ...req, keys } :
                            { ...req };
                        if (req.type !== 'delete')
                            req.values = [...req.values];
                        if (req.keys)
                            req.keys = [...req.keys];
                        return getExistingValues(downTable, req, keys).then(existingValues => {
                            const contexts = keys.map((key, i) => {
                                const existingValue = existingValues[i];
                                const ctx = { onerror: null, onsuccess: null };
                                if (req.type === 'delete') {
                                    deleting.fire.call(ctx, key, existingValue, dxTrans);
                                }
                                else if (req.type === 'add' || existingValue === undefined) {
                                    const generatedPrimaryKey = creating.fire.call(ctx, key, req.values[i], dxTrans);
                                    if (key == null && generatedPrimaryKey != null) {
                                        key = generatedPrimaryKey;
                                        req.keys[i] = key;
                                        if (!primaryKey.outbound) {
                                            setByKeyPath(req.values[i], primaryKey.keyPath, key);
                                        }
                                    }
                                }
                                else {
                                    const objectDiff = getObjectDiff(existingValue, req.values[i]);
                                    const additionalChanges = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans);
                                    if (additionalChanges) {
                                        const requestedValue = req.values[i];
                                        Object.keys(additionalChanges).forEach(keyPath => {
                                            if (hasOwn(requestedValue, keyPath)) {
                                                requestedValue[keyPath] = additionalChanges[keyPath];
                                            }
                                            else {
                                                setByKeyPath(requestedValue, keyPath, additionalChanges[keyPath]);
                                            }
                                        });
                                    }
                                }
                                return ctx;
                            });
                            return downTable.mutate(req).then(({ failures, results, numFailures, lastResult }) => {
                                for (let i = 0; i < keys.length; ++i) {
                                    const primKey = results ? results[i] : keys[i];
                                    const ctx = contexts[i];
                                    if (primKey == null) {
                                        ctx.onerror && ctx.onerror(failures[i]);
                                    }
                                    else {
                                        ctx.onsuccess && ctx.onsuccess(req.type === 'put' && existingValues[i] ?
                                            req.values[i] :
                                            primKey
                                        );
                                    }
                                }
                                return { failures, results, numFailures, lastResult };
                            }).catch(error => {
                                contexts.forEach(ctx => ctx.onerror && ctx.onerror(error));
                                return Promise.reject(error);
                            });
                        });
                    }
                    function deleteRange(req) {
                        return deleteNextChunk(req.trans, req.range, 10000);
                    }
                    function deleteNextChunk(trans, range, limit) {
                        return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit })
                            .then(({ result }) => {
                            return addPutOrDelete({ type: 'delete', keys: result, trans }).then(res => {
                                if (res.numFailures > 0)
                                    return Promise.reject(res.failures[0]);
                                if (result.length < limit) {
                                    return { failures: [], numFailures: 0, lastResult: undefined };
                                }
                                else {
                                    return deleteNextChunk(trans, { ...range, lower: result[result.length - 1], lowerOpen: true }, limit);
                                }
                            });
                        });
                    }
                }
            };
            return tableMiddleware;
        },
    })
};
function getExistingValues(table, req, effectiveKeys) {
    return req.type === "add"
        ? Promise.resolve([])
        : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
}

function getFromTransactionCache(keys, cache, clone) {
    try {
        if (!cache)
            return null;
        if (cache.keys.length < keys.length)
            return null;
        const result = [];
        for (let i = 0, j = 0; i < cache.keys.length && j < keys.length; ++i) {
            if (cmp(cache.keys[i], keys[j]) !== 0)
                continue;
            result.push(clone ? deepClone(cache.values[i]) : cache.values[i]);
            ++j;
        }
        return result.length === keys.length ? result : null;
    }
    catch (_a) {
        return null;
    }
}
const cacheExistingValuesMiddleware = {
    stack: "dbcore",
    level: -1,
    create: (core) => {
        return {
            table: (tableName) => {
                const table = core.table(tableName);
                return {
                    ...table,
                    getMany: (req) => {
                        if (!req.cache) {
                            return table.getMany(req);
                        }
                        const cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                        if (cachedResult) {
                            return DexiePromise.resolve(cachedResult);
                        }
                        return table.getMany(req).then((res) => {
                            req.trans["_cache"] = {
                                keys: req.keys,
                                values: req.cache === "clone" ? deepClone(res) : res,
                            };
                            return res;
                        });
                    },
                    mutate: (req) => {
                        if (req.type !== "add")
                            req.trans["_cache"] = null;
                        return table.mutate(req);
                    },
                };
            },
        };
    },
};

function isEmptyRange(node) {
    return !("from" in node);
}
const RangeSet = function (fromOrTree, to) {
    if (this) {
        extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
    }
    else {
        const rv = new RangeSet();
        if (fromOrTree && ("d" in fromOrTree)) {
            extend(rv, fromOrTree);
        }
        return rv;
    }
};
props(RangeSet.prototype, {
    add(rangeSet) {
        mergeRanges(this, rangeSet);
        return this;
    },
    addKey(key) {
        addRange(this, key, key);
        return this;
    },
    addKeys(keys) {
        keys.forEach(key => addRange(this, key, key));
        return this;
    },
    [iteratorSymbol]() {
        return getRangeSetIterator(this);
    }
});
function addRange(target, from, to) {
    const diff = cmp(from, to);
    if (isNaN(diff))
        return;
    if (diff > 0)
        throw RangeError();
    if (isEmptyRange(target))
        return extend(target, { from, to, d: 1 });
    const left = target.l;
    const right = target.r;
    if (cmp(to, target.from) < 0) {
        left
            ? addRange(left, from, to)
            : (target.l = { from, to, d: 1, l: null, r: null });
        return rebalance(target);
    }
    if (cmp(from, target.to) > 0) {
        right
            ? addRange(right, from, to)
            : (target.r = { from, to, d: 1, l: null, r: null });
        return rebalance(target);
    }
    if (cmp(from, target.from) < 0) {
        target.from = from;
        target.l = null;
        target.d = right ? right.d + 1 : 1;
    }
    if (cmp(to, target.to) > 0) {
        target.to = to;
        target.r = null;
        target.d = target.l ? target.l.d + 1 : 1;
    }
    const rightWasCutOff = !target.r;
    if (left && !target.l) {
        mergeRanges(target, left);
    }
    if (right && rightWasCutOff) {
        mergeRanges(target, right);
    }
}
function mergeRanges(target, newSet) {
    function _addRangeSet(target, { from, to, l, r }) {
        addRange(target, from, to);
        if (l)
            _addRangeSet(target, l);
        if (r)
            _addRangeSet(target, r);
    }
    if (!isEmptyRange(newSet))
        _addRangeSet(target, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
    const i1 = getRangeSetIterator(rangeSet2);
    let nextResult1 = i1.next();
    if (nextResult1.done)
        return false;
    let a = nextResult1.value;
    const i2 = getRangeSetIterator(rangeSet1);
    let nextResult2 = i2.next(a.from);
    let b = nextResult2.value;
    while (!nextResult1.done && !nextResult2.done) {
        if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
            return true;
        cmp(a.from, b.from) < 0
            ? (a = (nextResult1 = i1.next(b.from)).value)
            : (b = (nextResult2 = i2.next(a.from)).value);
    }
    return false;
}
function getRangeSetIterator(node) {
    let state = isEmptyRange(node) ? null : { s: 0, n: node };
    return {
        next(key) {
            const keyProvided = arguments.length > 0;
            while (state) {
                switch (state.s) {
                    case 0:
                        state.s = 1;
                        if (keyProvided) {
                            while (state.n.l && cmp(key, state.n.from) < 0)
                                state = { up: state, n: state.n.l, s: 1 };
                        }
                        else {
                            while (state.n.l)
                                state = { up: state, n: state.n.l, s: 1 };
                        }
                    case 1:
                        state.s = 2;
                        if (!keyProvided || cmp(key, state.n.to) <= 0)
                            return { value: state.n, done: false };
                    case 2:
                        if (state.n.r) {
                            state.s = 3;
                            state = { up: state, n: state.n.r, s: 0 };
                            continue;
                        }
                    case 3:
                        state = state.up;
                }
            }
            return { done: true };
        },
    };
}
function rebalance(target) {
    var _a, _b;
    const diff = (((_a = target.r) === null || _a === void 0 ? void 0 : _a.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
    const r = diff > 1 ? "r" : diff < -1 ? "l" : "";
    if (r) {
        const l = r === "r" ? "l" : "r";
        const rootClone = { ...target };
        const oldRootRight = target[r];
        target.from = oldRootRight.from;
        target.to = oldRootRight.to;
        target[r] = oldRootRight[r];
        rootClone[r] = oldRootRight[l];
        target[l] = rootClone;
        rootClone.d = computeDepth(rootClone);
    }
    target.d = computeDepth(target);
}
function computeDepth({ r, l }) {
    return (r ? (l ? Math.max(r.d, l.d) : r.d) : l ? l.d : 0) + 1;
}

const observabilityMiddleware = {
    stack: "dbcore",
    level: 0,
    create: (core) => {
        const dbName = core.schema.name;
        const FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
        return {
            ...core,
            table: (tableName) => {
                const table = core.table(tableName);
                const { schema } = table;
                const { primaryKey } = schema;
                const { extractKey, outbound } = primaryKey;
                const tableClone = {
                    ...table,
                    mutate: (req) => {
                        const trans = req.trans;
                        const mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
                        const getRangeSet = (indexName) => {
                            const part = `idb://${dbName}/${tableName}/${indexName}`;
                            return (mutatedParts[part] ||
                                (mutatedParts[part] = new RangeSet()));
                        };
                        const pkRangeSet = getRangeSet("");
                        const delsRangeSet = getRangeSet(":dels");
                        const { type } = req;
                        let [keys, newObjs] = req.type === "deleteRange"
                            ? [req.range]
                            : req.type === "delete"
                                ? [req.keys]
                                : req.values.length < 50
                                    ? [[], req.values]
                                    : [];
                        const oldCache = req.trans["_cache"];
                        return table.mutate(req).then((res) => {
                            if (isArray(keys)) {
                                if (type !== "delete")
                                    keys = res.results;
                                pkRangeSet.addKeys(keys);
                                const oldObjs = getFromTransactionCache(keys, oldCache);
                                if (!oldObjs && type !== "add") {
                                    delsRangeSet.addKeys(keys);
                                }
                                if (oldObjs || newObjs) {
                                    trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                                }
                            }
                            else if (keys) {
                                const range = { from: keys.lower, to: keys.upper };
                                delsRangeSet.add(range);
                                pkRangeSet.add(range);
                            }
                            else {
                                pkRangeSet.add(FULL_RANGE);
                                delsRangeSet.add(FULL_RANGE);
                                schema.indexes.forEach(idx => getRangeSet(idx.name).add(FULL_RANGE));
                            }
                            return res;
                        });
                    },
                };
                const getRange = ({ query: { index, range }, }) => {
                    var _a, _b;
                    return [
                        index,
                        new RangeSet((_a = range.lower) !== null && _a !== void 0 ? _a : core.MIN_KEY, (_b = range.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY),
                    ];
                };
                const readSubscribers = {
                    get: (req) => [primaryKey, new RangeSet(req.key)],
                    getMany: (req) => [primaryKey, new RangeSet().addKeys(req.keys)],
                    count: getRange,
                    query: getRange,
                    openCursor: getRange,
                };
                keys(readSubscribers).forEach(method => {
                    tableClone[method] = function (req) {
                        const { subscr } = PSD;
                        if (subscr) {
                            const getRangeSet = (indexName) => {
                                const part = `idb://${dbName}/${tableName}/${indexName}`;
                                return (subscr[part] ||
                                    (subscr[part] = new RangeSet()));
                            };
                            const pkRangeSet = getRangeSet("");
                            const delsRangeSet = getRangeSet(":dels");
                            const [queriedIndex, queriedRanges] = readSubscribers[method](req);
                            getRangeSet(queriedIndex.name || "").add(queriedRanges);
                            if (!queriedIndex.isPrimaryKey) {
                                if (method === "count") {
                                    delsRangeSet.add(FULL_RANGE);
                                }
                                else {
                                    const keysPromise = method === "query" &&
                                        outbound &&
                                        req.values &&
                                        table.query({
                                            ...req,
                                            values: false,
                                        });
                                    return table[method].apply(this, arguments).then((res) => {
                                        if (method === "query") {
                                            if (outbound && req.values) {
                                                return keysPromise.then(({ result: resultingKeys }) => {
                                                    pkRangeSet.addKeys(resultingKeys);
                                                    return res;
                                                });
                                            }
                                            const pKeys = req.values
                                                ? res.result.map(extractKey)
                                                : res.result;
                                            if (req.values) {
                                                pkRangeSet.addKeys(pKeys);
                                            }
                                            else {
                                                delsRangeSet.addKeys(pKeys);
                                            }
                                        }
                                        else if (method === "openCursor") {
                                            const cursor = res;
                                            const wantValues = req.values;
                                            return (cursor &&
                                                Object.create(cursor, {
                                                    key: {
                                                        get() {
                                                            delsRangeSet.addKey(cursor.primaryKey);
                                                            return cursor.key;
                                                        },
                                                    },
                                                    primaryKey: {
                                                        get() {
                                                            const pkey = cursor.primaryKey;
                                                            delsRangeSet.addKey(pkey);
                                                            return pkey;
                                                        },
                                                    },
                                                    value: {
                                                        get() {
                                                            wantValues && pkRangeSet.addKey(cursor.primaryKey);
                                                            return cursor.value;
                                                        },
                                                    },
                                                }));
                                        }
                                        return res;
                                    });
                                }
                            }
                        }
                        return table[method].apply(this, arguments);
                    };
                });
                return tableClone;
            },
        };
    },
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
    function addAffectedIndex(ix) {
        const rangeSet = getRangeSet(ix.name || "");
        function extractKey(obj) {
            return obj != null ? ix.extractKey(obj) : null;
        }
        const addKeyOrKeys = (key) => ix.multiEntry && isArray(key)
            ? key.forEach(key => rangeSet.addKey(key))
            : rangeSet.addKey(key);
        (oldObjs || newObjs).forEach((_, i) => {
            const oldKey = oldObjs && extractKey(oldObjs[i]);
            const newKey = newObjs && extractKey(newObjs[i]);
            if (cmp(oldKey, newKey) !== 0) {
                if (oldKey != null)
                    addKeyOrKeys(oldKey);
                if (newKey != null)
                    addKeyOrKeys(newKey);
            }
        });
    }
    schema.indexes.forEach(addAffectedIndex);
}

class Dexie$1 {
    constructor(name, options) {
        this._middlewares = {};
        this.verno = 0;
        const deps = Dexie$1.dependencies;
        this._options = options = {
            addons: Dexie$1.addons,
            autoOpen: true,
            indexedDB: deps.indexedDB,
            IDBKeyRange: deps.IDBKeyRange,
            ...options
        };
        this._deps = {
            indexedDB: options.indexedDB,
            IDBKeyRange: options.IDBKeyRange
        };
        const { addons, } = options;
        this._dbSchema = {};
        this._versions = [];
        this._storeNames = [];
        this._allTables = {};
        this.idbdb = null;
        this._novip = this;
        const state = {
            dbOpenError: null,
            isBeingOpened: false,
            onReadyBeingFired: null,
            openComplete: false,
            dbReadyResolve: nop,
            dbReadyPromise: null,
            cancelOpen: nop,
            openCanceller: null,
            autoSchema: true,
            PR1398_maxLoop: 3
        };
        state.dbReadyPromise = new DexiePromise(resolve => {
            state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise((_, reject) => {
            state.cancelOpen = reject;
        });
        this._state = state;
        this.name = name;
        this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
        this.on.ready.subscribe = override(this.on.ready.subscribe, subscribe => {
            return (subscriber, bSticky) => {
                Dexie$1.vip(() => {
                    const state = this._state;
                    if (state.openComplete) {
                        if (!state.dbOpenError)
                            DexiePromise.resolve().then(subscriber);
                        if (bSticky)
                            subscribe(subscriber);
                    }
                    else if (state.onReadyBeingFired) {
                        state.onReadyBeingFired.push(subscriber);
                        if (bSticky)
                            subscribe(subscriber);
                    }
                    else {
                        subscribe(subscriber);
                        const db = this;
                        if (!bSticky)
                            subscribe(function unsubscribe() {
                                db.on.ready.unsubscribe(subscriber);
                                db.on.ready.unsubscribe(unsubscribe);
                            });
                    }
                });
            };
        });
        this.Collection = createCollectionConstructor(this);
        this.Table = createTableConstructor(this);
        this.Transaction = createTransactionConstructor(this);
        this.Version = createVersionConstructor(this);
        this.WhereClause = createWhereClauseConstructor(this);
        this.on("versionchange", ev => {
            if (ev.newVersion > 0)
                console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`);
            else
                console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`);
            this.close();
        });
        this.on("blocked", ev => {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                console.warn(`Dexie.delete('${this.name}') was blocked`);
            else
                console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${ev.oldVersion / 10}`);
        });
        this._maxKey = getMaxKey(options.IDBKeyRange);
        this._createTransaction = (mode, storeNames, dbschema, parentTransaction) => new this.Transaction(mode, storeNames, dbschema, this._options.chromeTransactionDurability, parentTransaction);
        this._fireOnBlocked = ev => {
            this.on("blocked").fire(ev);
            connections
                .filter(c => c.name === this.name && c !== this && !c._state.vcFired)
                .map(c => c.on("versionchange").fire(ev));
        };
        this.use(virtualIndexMiddleware);
        this.use(hooksMiddleware);
        this.use(observabilityMiddleware);
        this.use(cacheExistingValuesMiddleware);
        this.vip = Object.create(this, { _vip: { value: true } });
        addons.forEach(addon => addon(this));
    }
    version(versionNumber) {
        if (isNaN(versionNumber) || versionNumber < 0.1)
            throw new exceptions.Type(`Given version is not a positive number`);
        versionNumber = Math.round(versionNumber * 10) / 10;
        if (this.idbdb || this._state.isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, versionNumber);
        const versions = this._versions;
        var versionInstance = versions.filter(v => v._cfg.version === versionNumber)[0];
        if (versionInstance)
            return versionInstance;
        versionInstance = new this.Version(versionNumber);
        versions.push(versionInstance);
        versions.sort(lowerVersionFirst);
        versionInstance.stores({});
        this._state.autoSchema = false;
        return versionInstance;
    }
    _whenReady(fn) {
        return (this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip)) ? fn() : new DexiePromise((resolve, reject) => {
            if (this._state.openComplete) {
                return reject(new exceptions.DatabaseClosed(this._state.dbOpenError));
            }
            if (!this._state.isBeingOpened) {
                if (!this._options.autoOpen) {
                    reject(new exceptions.DatabaseClosed());
                    return;
                }
                this.open().catch(nop);
            }
            this._state.dbReadyPromise.then(resolve, reject);
        }).then(fn);
    }
    use({ stack, create, level, name }) {
        if (name)
            this.unuse({ stack, name });
        const middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
        middlewares.push({ stack, create, level: level == null ? 10 : level, name });
        middlewares.sort((a, b) => a.level - b.level);
        return this;
    }
    unuse({ stack, name, create }) {
        if (stack && this._middlewares[stack]) {
            this._middlewares[stack] = this._middlewares[stack].filter(mw => create ? mw.create !== create :
                name ? mw.name !== name :
                    false);
        }
        return this;
    }
    open() {
        return dexieOpen(this);
    }
    _close() {
        const state = this._state;
        const idx = connections.indexOf(this);
        if (idx >= 0)
            connections.splice(idx, 1);
        if (this.idbdb) {
            try {
                this.idbdb.close();
            }
            catch (e) { }
            this._novip.idbdb = null;
        }
        state.dbReadyPromise = new DexiePromise(resolve => {
            state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise((_, reject) => {
            state.cancelOpen = reject;
        });
    }
    close() {
        this._close();
        const state = this._state;
        this._options.autoOpen = false;
        state.dbOpenError = new exceptions.DatabaseClosed();
        if (state.isBeingOpened)
            state.cancelOpen(state.dbOpenError);
    }
    delete() {
        const hasArguments = arguments.length > 0;
        const state = this._state;
        return new DexiePromise((resolve, reject) => {
            const doDelete = () => {
                this.close();
                var req = this._deps.indexedDB.deleteDatabase(this.name);
                req.onsuccess = wrap(() => {
                    _onDatabaseDeleted(this._deps, this.name);
                    resolve();
                });
                req.onerror = eventRejectHandler(reject);
                req.onblocked = this._fireOnBlocked;
            };
            if (hasArguments)
                throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
            if (state.isBeingOpened) {
                state.dbReadyPromise.then(doDelete);
            }
            else {
                doDelete();
            }
        });
    }
    backendDB() {
        return this.idbdb;
    }
    isOpen() {
        return this.idbdb !== null;
    }
    hasBeenClosed() {
        const dbOpenError = this._state.dbOpenError;
        return dbOpenError && (dbOpenError.name === 'DatabaseClosed');
    }
    hasFailed() {
        return this._state.dbOpenError !== null;
    }
    dynamicallyOpened() {
        return this._state.autoSchema;
    }
    get tables() {
        return keys(this._allTables).map(name => this._allTables[name]);
    }
    transaction() {
        const args = extractTransactionArgs.apply(this, arguments);
        return this._transaction.apply(this, args);
    }
    _transaction(mode, tables, scopeFunc) {
        let parentTransaction = PSD.trans;
        if (!parentTransaction || parentTransaction.db !== this || mode.indexOf('!') !== -1)
            parentTransaction = null;
        const onlyIfCompatible = mode.indexOf('?') !== -1;
        mode = mode.replace('!', '').replace('?', '');
        let idbMode, storeNames;
        try {
            storeNames = tables.map(table => {
                var storeName = table instanceof this.Table ? table.name : table;
                if (typeof storeName !== 'string')
                    throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                return storeName;
            });
            if (mode == "r" || mode === READONLY)
                idbMode = READONLY;
            else if (mode == "rw" || mode == READWRITE)
                idbMode = READWRITE;
            else
                throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
            if (parentTransaction) {
                if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                    if (onlyIfCompatible) {
                        parentTransaction = null;
                    }
                    else
                        throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                }
                if (parentTransaction) {
                    storeNames.forEach(storeName => {
                        if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                            if (onlyIfCompatible) {
                                parentTransaction = null;
                            }
                            else
                                throw new exceptions.SubTransaction("Table " + storeName +
                                    " not included in parent transaction.");
                        }
                    });
                }
                if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                    parentTransaction = null;
                }
            }
        }
        catch (e) {
            return parentTransaction ?
                parentTransaction._promise(null, (_, reject) => { reject(e); }) :
                rejection(e);
        }
        const enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
        return (parentTransaction ?
            parentTransaction._promise(idbMode, enterTransaction, "lock") :
            PSD.trans ?
                usePSD(PSD.transless, () => this._whenReady(enterTransaction)) :
                this._whenReady(enterTransaction));
    }
    table(tableName) {
        if (!hasOwn(this._allTables, tableName)) {
            throw new exceptions.InvalidTable(`Table ${tableName} does not exist`);
        }
        return this._allTables[tableName];
    }
}

const symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol
    ? Symbol.observable
    : "@@observable";
class Observable {
    constructor(subscribe) {
        this._subscribe = subscribe;
    }
    subscribe(x, error, complete) {
        return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
    }
    [symbolObservable]() {
        return this;
    }
}

function extendObservabilitySet(target, newSet) {
    keys(newSet).forEach(part => {
        const rangeSet = target[part] || (target[part] = new RangeSet());
        mergeRanges(rangeSet, newSet[part]);
    });
    return target;
}

function liveQuery(querier) {
    let hasValue = false;
    let currentValue = undefined;
    const observable = new Observable((observer) => {
        const scopeFuncIsAsync = isAsyncFunction(querier);
        function execute(subscr) {
            if (scopeFuncIsAsync) {
                incrementExpectedAwaits();
            }
            const exec = () => newScope(querier, { subscr, trans: null });
            const rv = PSD.trans
                ?
                    usePSD(PSD.transless, exec)
                : exec();
            if (scopeFuncIsAsync) {
                rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
            }
            return rv;
        }
        let closed = false;
        let accumMuts = {};
        let currentObs = {};
        const subscription = {
            get closed() {
                return closed;
            },
            unsubscribe: () => {
                closed = true;
                globalEvents.storagemutated.unsubscribe(mutationListener);
            },
        };
        observer.start && observer.start(subscription);
        let querying = false, startedListening = false;
        function shouldNotify() {
            return keys(currentObs).some((key) => accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]));
        }
        const mutationListener = (parts) => {
            extendObservabilitySet(accumMuts, parts);
            if (shouldNotify()) {
                doQuery();
            }
        };
        const doQuery = () => {
            if (querying || closed)
                return;
            accumMuts = {};
            const subscr = {};
            const ret = execute(subscr);
            if (!startedListening) {
                globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
                startedListening = true;
            }
            querying = true;
            Promise.resolve(ret).then((result) => {
                hasValue = true;
                currentValue = result;
                querying = false;
                if (closed)
                    return;
                if (shouldNotify()) {
                    doQuery();
                }
                else {
                    accumMuts = {};
                    currentObs = subscr;
                    observer.next && observer.next(result);
                }
            }, (err) => {
                querying = false;
                hasValue = false;
                observer.error && observer.error(err);
                subscription.unsubscribe();
            });
        };
        doQuery();
        return subscription;
    });
    observable.hasValue = () => hasValue;
    observable.getValue = () => currentValue;
    return observable;
}

let domDeps;
try {
    domDeps = {
        indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
        IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
    };
}
catch (e) {
    domDeps = { indexedDB: null, IDBKeyRange: null };
}

const Dexie = Dexie$1;
props(Dexie, {
    ...fullNameExceptions,
    delete(databaseName) {
        const db = new Dexie(databaseName, { addons: [] });
        return db.delete();
    },
    exists(name) {
        return new Dexie(name, { addons: [] }).open().then(db => {
            db.close();
            return true;
        }).catch('NoSuchDatabaseError', () => false);
    },
    getDatabaseNames(cb) {
        try {
            return getDatabaseNames(Dexie.dependencies).then(cb);
        }
        catch (_a) {
            return rejection(new exceptions.MissingAPI());
        }
    },
    defineClass() {
        function Class(content) {
            extend(this, content);
        }
        return Class;
    },
    ignoreTransaction(scopeFunc) {
        return PSD.trans ?
            usePSD(PSD.transless, scopeFunc) :
            scopeFunc();
    },
    vip,
    async: function (generatorFn) {
        return function () {
            try {
                var rv = awaitIterator(generatorFn.apply(this, arguments));
                if (!rv || typeof rv.then !== 'function')
                    return DexiePromise.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        };
    },
    spawn: function (generatorFn, args, thiz) {
        try {
            var rv = awaitIterator(generatorFn.apply(thiz, args || []));
            if (!rv || typeof rv.then !== 'function')
                return DexiePromise.resolve(rv);
            return rv;
        }
        catch (e) {
            return rejection(e);
        }
    },
    currentTransaction: {
        get: () => PSD.trans || null
    },
    waitFor: function (promiseOrFunction, optionalTimeout) {
        const promise = DexiePromise.resolve(typeof promiseOrFunction === 'function' ?
            Dexie.ignoreTransaction(promiseOrFunction) :
            promiseOrFunction)
            .timeout(optionalTimeout || 60000);
        return PSD.trans ?
            PSD.trans.waitFor(promise) :
            promise;
    },
    Promise: DexiePromise,
    debug: {
        get: () => debug,
        set: value => {
            setDebug(value, value === 'dexie' ? () => true : dexieStackFrameFilter);
        }
    },
    derive: derive,
    extend: extend,
    props: props,
    override: override,
    Events: Events,
    on: globalEvents,
    liveQuery,
    extendObservabilitySet,
    getByKeyPath: getByKeyPath,
    setByKeyPath: setByKeyPath,
    delByKeyPath: delByKeyPath,
    shallowClone: shallowClone,
    deepClone: deepClone,
    getObjectDiff: getObjectDiff,
    cmp,
    asap: asap$1,
    minKey: minKey,
    addons: [],
    connections: connections,
    errnames: errnames,
    dependencies: domDeps,
    semVer: DEXIE_VERSION,
    version: DEXIE_VERSION.split('.')
        .map(n => parseInt(n))
        .reduce((p, c, i) => p + (c / Math.pow(10, i * 2))),
});
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);

if (typeof dispatchEvent !== 'undefined' && typeof addEventListener !== 'undefined') {
    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, updatedParts => {
        if (!propagatingLocally) {
            let event;
            if (isIEOrEdge) {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
            }
            else {
                event = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
                    detail: updatedParts
                });
            }
            propagatingLocally = true;
            dispatchEvent(event);
            propagatingLocally = false;
        }
    });
    addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, ({ detail }) => {
        if (!propagatingLocally) {
            propagateLocally(detail);
        }
    });
}
function propagateLocally(updateParts) {
    let wasMe = propagatingLocally;
    try {
        propagatingLocally = true;
        globalEvents.storagemutated.fire(updateParts);
    }
    finally {
        propagatingLocally = wasMe;
    }
}
let propagatingLocally = false;

if (typeof BroadcastChannel !== 'undefined') {
    const bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
    if (typeof bc.unref === 'function') {
        bc.unref();
    }
    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
        if (!propagatingLocally) {
            bc.postMessage(changedParts);
        }
    });
    bc.onmessage = (ev) => {
        if (ev.data)
            propagateLocally(ev.data);
    };
}
else if (typeof self !== 'undefined' && typeof navigator !== 'undefined') {
    globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
        try {
            if (!propagatingLocally) {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
                        trig: Math.random(),
                        changedParts,
                    }));
                }
                if (typeof self['clients'] === 'object') {
                    [...self['clients'].matchAll({ includeUncontrolled: true })].forEach((client) => client.postMessage({
                        type: STORAGE_MUTATED_DOM_EVENT_NAME,
                        changedParts,
                    }));
                }
            }
        }
        catch (_a) { }
    });
    if (typeof addEventListener !== 'undefined') {
        addEventListener('storage', (ev) => {
            if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
                const data = JSON.parse(ev.newValue);
                if (data)
                    propagateLocally(data.changedParts);
            }
        });
    }
    const swContainer = self.document && navigator.serviceWorker;
    if (swContainer) {
        swContainer.addEventListener('message', propagateMessageLocally);
    }
}
function propagateMessageLocally({ data }) {
    if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
        propagateLocally(data.changedParts);
    }
}

DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);


//# sourceMappingURL=dexie.mjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/******/ 				() => (module['default']) :
/******/ 				() => (module);
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
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/xconsole */ "./src/helpers/xconsole.js");
/* harmony import */ var _card_highlighter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./card-highlighter */ "./src/card-highlighter.js");
/* harmony import */ var _notification_dedup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./notification-dedup */ "./src/notification-dedup.js");
/* harmony import */ var _pinned_items__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pinned-items */ "./src/pinned-items.js");
/* harmony import */ var _helpers_pageEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/pageEvents */ "./src/helpers/pageEvents.js");







_helpers_xconsole__WEBPACK_IMPORTED_MODULE_0__.xconsole.log("Loaded Make Jig Better Script");
_helpers_pageEvents__WEBPACK_IMPORTED_MODULE_4__.pageEvents.init();
window.onload = function () {
  //  Init the card highlighter
  _card_highlighter__WEBPACK_IMPORTED_MODULE_1__.cardHighlighter.init();

  //  Init the dedup logic & view link
  _notification_dedup__WEBPACK_IMPORTED_MODULE_2__.notificationDedup.init();

  //  Init the pin system
  _pinned_items__WEBPACK_IMPORTED_MODULE_3__.pinnedItems.init();

  //  Replay and start listening to page events
  _helpers_pageEvents__WEBPACK_IMPORTED_MODULE_4__.pageEvents.start();
};
})();

/******/ })()
;
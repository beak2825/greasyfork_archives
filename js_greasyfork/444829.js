// ==UserScript==
// @name         uooc/优课/智慧树 查题小组手
// @namespace    http://tampermonkey.net/
// @version      0.0.9
// @description  进入做题界面自动查询答案并且填充内容
// @author       shulan
// @match        *://www.uooc.net.cn/exam/*
// @match        *://www.uooconline.com/exam/*
// @match        *://*.zhihuishu.com/*
// @match        *://*.chaoxing.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        window.onload
// @grant        window.console
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444829/uooc%E4%BC%98%E8%AF%BE%E6%99%BA%E6%85%A7%E6%A0%91%20%E6%9F%A5%E9%A2%98%E5%B0%8F%E7%BB%84%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444829/uooc%E4%BC%98%E8%AF%BE%E6%99%BA%E6%85%A7%E6%A0%91%20%E6%9F%A5%E9%A2%98%E5%B0%8F%E7%BB%84%E6%89%8B.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 312:
/***/ ((module) => {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ 293:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function cancelAttachShadow() {
    var callback = function () { };
    callback.toString = function () {
        return 'function () { [native code] }';
    };
    // @ts-ignore
    (unsafeWindow || window).Element.prototype.attachShadow = callback;
}
exports["default"] = cancelAttachShadow;


/***/ }),

/***/ 233:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function cancelAttachShadowByVueInstance() {
    for (var _i = 0, _a = Array.from(document.querySelectorAll('.subject_describe > div')); _i < _a.length; _i++) {
        var div = _a[_i];
        // @ts-ignore
        div.__vue__.$el.innerHTML = div.__vue__._data.shadowDom.textContent;
    }
}
exports["default"] = cancelAttachShadowByVueInstance;


/***/ }),

/***/ 73:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdapaterManager = exports.AdapterManagerEventEmitType = void 0;
var eventEmitter_1 = __importDefault(__webpack_require__(873));
var lifecycle_1 = __webpack_require__(199);
var AdapterManagerEventEmitType;
(function (AdapterManagerEventEmitType) {
    AdapterManagerEventEmitType["ADAPTER_CHANGE"] = "ADAPTER_CHANGE";
})(AdapterManagerEventEmitType = exports.AdapterManagerEventEmitType || (exports.AdapterManagerEventEmitType = {}));
var AdapaterManager = /** @class */ (function (_super) {
    __extends(AdapaterManager, _super);
    function AdapaterManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.adapters = [];
        return _this;
    }
    AdapaterManager.prototype.register = function (adapter) {
        if (!this.test(adapter))
            return;
        if (!this.adapter)
            this.adapter = adapter;
        this.adapters.push(adapter);
        if (adapter instanceof lifecycle_1.LifeCycleEvents) {
            adapter.emit('after_register');
        }
    };
    AdapaterManager.prototype.use = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        this.emit(AdapaterManager.EVENT_EMIT_TYPE.ADAPTER_CHANGE);
    };
    AdapaterManager.prototype.getAdapters = function () {
        return this.adapters;
    };
    AdapaterManager.prototype.getAdapter = function () {
        return this.adapter;
    };
    AdapaterManager.prototype.test = function (adapter) {
        return true;
    };
    AdapaterManager.ERROR = {
        ADAPTER_NOT_FOUND: /** @class */ (function (_super) {
            __extends(ADAPTER_NOT_FOUND, _super);
            function ADAPTER_NOT_FOUND() {
                return _super.call(this, '[adapter manager]: ADAPTER_NOT_FOUND') || this;
            }
            return ADAPTER_NOT_FOUND;
        }(Error)),
    };
    AdapaterManager.EVENT_EMIT_TYPE = AdapterManagerEventEmitType;
    return AdapaterManager;
}(eventEmitter_1.default));
exports.AdapaterManager = AdapaterManager;


/***/ }),

/***/ 873:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = new Map();
    }
    EventEmitter.prototype.on = function (key, callback) {
        if (!this.events.has(key)) {
            this.events.set(key, []);
        }
        var eventList = this.events.get(key);
        eventList.push(callback);
    };
    EventEmitter.prototype.emit = function (key) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.events.has(key))
            return;
        var eventList = this.events.get(key);
        eventList.forEach(function (fn) { return fn.apply(_this, args); });
    };
    EventEmitter.prototype.once = function (key, callback) {
        var _this = this;
        var handle = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            callback.apply(_this, args);
        };
        this.on(key, handle);
        return function () {
            _this.events.set(key, _this.events.get(key).filter(function (fn) { return fn !== handle; }));
        };
    };
    return EventEmitter;
}());
exports["default"] = EventEmitter;


/***/ }),

/***/ 683:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionMatchStatus = exports.QuestionType = exports.QuestionAdapter = exports.Question = void 0;
var lifecycle_1 = __webpack_require__(199);
var Question = /** @class */ (function () {
    function Question(question, options, type) {
        if (question === void 0) { question = ''; }
        if (options === void 0) { options = []; }
        if (type === void 0) { type = QuestionType.Radio; }
        this.question = question;
        this.options = options;
        this.type = type;
    }
    Question.prototype.set_answer = function (answer) {
        this.answer = answer;
    };
    Question.prototype.match_answer = function (answers, format) {
        var _this = this;
        return this.options
            .map(function (item, index) { return [format(_this.type, item.body), index]; })
            .filter(function (_a) {
            var option = _a[0];
            return answers.some(function (answer) { return option.includes(answer) || option === answer; });
        })
            .map(function (_a) {
            var _ = _a[0], index = _a[1];
            return index;
        });
    };
    return Question;
}());
exports.Question = Question;
var QuestionAdapter = /** @class */ (function (_super) {
    __extends(QuestionAdapter, _super);
    function QuestionAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuestionAdapter;
}(lifecycle_1.LifeCycleEvents));
exports.QuestionAdapter = QuestionAdapter;
var QuestionType;
(function (QuestionType) {
    /** 单选 */
    QuestionType[QuestionType["Radio"] = 0] = "Radio";
    /** 多选 */
    QuestionType[QuestionType["Checkbox"] = 1] = "Checkbox";
    /** 判断 */
    QuestionType[QuestionType["Judge"] = 3] = "Judge";
    /** 填空 */
    QuestionType[QuestionType["InBlank"] = 2] = "InBlank";
})(QuestionType = exports.QuestionType || (exports.QuestionType = {}));
var QuestionMatchStatus;
(function (QuestionMatchStatus) {
    QuestionMatchStatus[QuestionMatchStatus["NOTFOUND"] = 0] = "NOTFOUND";
    QuestionMatchStatus[QuestionMatchStatus["NOTMATCH"] = 1] = "NOTMATCH";
    QuestionMatchStatus[QuestionMatchStatus["MATCHED"] = 2] = "MATCHED";
})(QuestionMatchStatus = exports.QuestionMatchStatus || (exports.QuestionMatchStatus = {}));


/***/ }),

/***/ 928:
/***/ (function(__unused_webpack_module, exports) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Service = void 0;
var Service = /** @class */ (function () {
    function Service() {
    }
    Service.fetch = function (params) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest(__assign(__assign({}, params), { onload: function (data) {
                    resolve(data);
                }, onerror: function (error) {
                    reject(error);
                } }));
        });
    };
    return Service;
}());
exports.Service = Service;


/***/ }),

/***/ 181:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventEmitType = exports.QuestionIterable = void 0;
var index_1 = __webpack_require__(377);
var index_2 = __webpack_require__(352);
var index_3 = __webpack_require__(49);
var view_1 = __webpack_require__(855);
var adapterManager_1 = __webpack_require__(73);
var WindowController_1 = __webpack_require__(915);
var SearchController_1 = __webpack_require__(412);
var AnswerView_1 = __webpack_require__(695);
var ServiceAdapterChange_1 = __webpack_require__(723);
var index_4 = __webpack_require__(682);
var icodef_1 = __webpack_require__(819);
var Message_1 = __webpack_require__(489);
var Questions = /** @class */ (function () {
    function Questions(quetions) {
        this.quetions = quetions;
    }
    Questions.from = function (adapter) {
        return new Questions(adapter.parse());
    };
    Questions.registerAdapter = function (adapter) {
        var instance = new adapter();
        if (!instance.match())
            return;
        this.questionAdapter.push(instance);
    };
    Questions.questionAdapter = [];
    return Questions;
}());
Questions.registerAdapter(index_1.QuestionItemFromMooc);
Questions.registerAdapter(index_2.QuestionItemFromZHIHUISHU);
Questions.registerAdapter(index_3.QuestionItemFromChaoxing);
var QuestionIterable = /** @class */ (function () {
    function QuestionIterable(adapter) {
        var _this = this;
        this.adapter = adapter;
        this.adapter.on(adapterManager_1.AdapaterManager.EVENT_EMIT_TYPE.ADAPTER_CHANGE, function () {
            _this.resetContext();
        });
        this.resetContext();
    }
    QuestionIterable.prototype.syncContextWithAdapter = function () {
        var adapter = this.adapter.getAdapter();
        adapter.emit('before_match_questions');
        Object.assign(this.runningContext, {
            data: adapter.parse(),
        });
        adapter.emit('after_match_questions');
    };
    QuestionIterable.prototype.next = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, index, status, running;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log(__assign({}, this.runningContext));
                        _a = this.runningContext, data = _a.data, index = _a.index, status = _a.status, running = _a.running;
                        if (status === 'done' || status === 'pause' || running)
                            return [2 /*return*/];
                        else if (status !== 'running') {
                            this.setStatus('running');
                        }
                        this.runningContext.running = true;
                        if (index >= data.length)
                            return [2 /*return*/];
                        return [4 /*yield*/, callback(data[index], index)];
                    case 1:
                        _b.sent();
                        index += 1;
                        if (index >= data.length) {
                            this.setStatus('done');
                        }
                        Object.assign(this.runningContext, { running: false, index: index });
                        this.next(callback);
                        return [2 /*return*/];
                }
            });
        });
    };
    QuestionIterable.prototype.pause = function () {
        this.setStatus('pause');
    };
    QuestionIterable.prototype.resetContext = function () {
        this.runningContext = {
            index: 0,
            status: 'canplay',
            data: [],
            running: false,
        };
        this.syncContextWithAdapter();
    };
    QuestionIterable.prototype.setStatus = function (status) {
        this.runningContext.status = status;
    };
    return QuestionIterable;
}());
exports.QuestionIterable = QuestionIterable;
var EventEmitType;
(function (EventEmitType) {
    EventEmitType["USER_SEARCH"] = "USERSEARCH";
    EventEmitType["USER_SEARCH_RESULT"] = "USER_SEARCH_RESULT";
    EventEmitType["AUTO_FIND_PAUSE"] = "AUTO_FIND_PAUSE";
    EventEmitType["AUTO_FIND_PLAY"] = "AUTO_FIND_PLAY";
    EventEmitType["REFIND_QUESTION"] = "REFIND_QUETION";
})(EventEmitType = exports.EventEmitType || (exports.EventEmitType = {}));
window.addEventListener('load', function () {
    var application = new view_1.View();
    var serviceAdapterManager = index_4.ServiceAdapterManager.getInstance();
    serviceAdapterManager.register(new icodef_1.ICodef());
    application.register(new WindowController_1.WindowController());
    application.register(new ServiceAdapterChange_1.ServiceAdapterChange());
    application.register(new SearchController_1.SearchController());
    application.register(new Message_1.Message());
    application.register(new AnswerView_1.AnswerView());
    application.start();
    $(document.body).append(application.container);
});


/***/ }),

/***/ 199:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LifeCycleEvents = void 0;
var eventEmitter_1 = __importDefault(__webpack_require__(873));
var LifeCycleEvents = /** @class */ (function (_super) {
    __extends(LifeCycleEvents, _super);
    function LifeCycleEvents() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LifeCycleEvents;
}(eventEmitter_1.default));
exports.LifeCycleEvents = LifeCycleEvents;


/***/ }),

/***/ 49:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionOfChaoxing = exports.QuestionItemFromChaoxing = void 0;
var question_1 = __webpack_require__(683);
var cancelAttachShadow_1 = __importDefault(__webpack_require__(293));
function questions2json(questions) {
    return questions
        .map(function (index, question) { return ({
        type: question_1.QuestionType.Radio,
        question: (function () {
            var _a, _b;
            var nodes = (_a = $(question).find('.mark_name').get(0)) === null || _a === void 0 ? void 0 : _a.childNodes;
            if (!nodes || !nodes.length)
                return '';
            return ((_b = nodes[nodes.length - 1]) === null || _b === void 0 ? void 0 : _b.textContent) || '';
        })(),
        options: $(question)
            .find('.mark_letter')
            .map(function (index, option) {
            var optionel = $(option).text();
            var firstSpot = optionel.indexOf('.');
            var prefix = optionel.slice(0, firstSpot);
            var body = optionel.slice(firstSpot);
            return {
                prefix: prefix.slice(0),
                body: body,
            };
        })
            .toArray(),
    }); })
        .toArray();
}
var QuestionItemFromChaoxing = /** @class */ (function (_super) {
    __extends(QuestionItemFromChaoxing, _super);
    function QuestionItemFromChaoxing() {
        var _this = _super.call(this) || this;
        _this.on('after_register', function () {
            (0, cancelAttachShadow_1.default)();
        });
        return _this;
    }
    QuestionItemFromChaoxing.prototype.parse = function () {
        var questionItem = questions2json($('.questionLi'));
        console.log(questionItem);
        return questionItem.map(function (item, index) { return new QuestionOfChaoxing(index, { question: item.question, options: item.options, type: item.type }); });
    };
    QuestionItemFromChaoxing.prototype.match = function () {
        return /^(.)*:\/\/(.)*\.chaoxing\.com\/mooc2\/work/.test(location.href);
    };
    return QuestionItemFromChaoxing;
}(question_1.QuestionAdapter));
exports.QuestionItemFromChaoxing = QuestionItemFromChaoxing;
var QuestionOfChaoxing = /** @class */ (function (_super) {
    __extends(QuestionOfChaoxing, _super);
    function QuestionOfChaoxing(position, question) {
        var _this = _super.call(this, question.question, question.options, question.type) || this;
        _this.position = position;
        return _this;
    }
    QuestionOfChaoxing.prototype.select = function () {
        var _this = this;
        var _a;
        if (typeof this.position !== 'number')
            return;
        (_a = this.answer) === null || _a === void 0 ? void 0 : _a.map(function (index) {
            $(".queBox .ti-alist:eq(".concat(_this.position, ") .ti-a .ti-a-i [type=radio]:eq(").concat(index, ")")).click();
        });
    };
    return QuestionOfChaoxing;
}(question_1.Question));
exports.QuestionOfChaoxing = QuestionOfChaoxing;


/***/ }),

/***/ 769:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionAdapterManager = void 0;
var adapterManager_1 = __webpack_require__(73);
var QuestionAdapterManager = /** @class */ (function (_super) {
    __extends(QuestionAdapterManager, _super);
    function QuestionAdapterManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.index = 0;
        return _this;
    }
    QuestionAdapterManager.prototype.use = function () {
        this.adapter = this.adapters[this.index];
        _super.prototype.use.call(this);
    };
    QuestionAdapterManager.prototype.test = function (adapter) {
        return adapter.match();
    };
    return QuestionAdapterManager;
}(adapterManager_1.AdapaterManager));
exports.QuestionAdapterManager = QuestionAdapterManager;


/***/ }),

/***/ 377:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionOfMooc = exports.QuestionItemFromMooc = void 0;
var question_1 = __webpack_require__(683);
var cancelAttachShadow_1 = __importDefault(__webpack_require__(293));
function questions2json(questions) {
    return questions
        .map(function (index, question) { return ({
        type: question_1.QuestionType.Radio,
        question: $(question).find('.ti-q-c').text(),
        options: $(question)
            .find('.ti-alist .ti-a')
            .map(function (index, option) {
            var optionel = $(option);
            var prefix = optionel.find('.ti-a-i').text().trim();
            var body = optionel.find('.ti-a-c').text().trim();
            return {
                prefix: prefix.slice(0, prefix.indexOf('.')),
                body: body,
            };
        })
            .toArray(),
    }); })
        .toArray();
}
var QuestionItemFromMooc = /** @class */ (function (_super) {
    __extends(QuestionItemFromMooc, _super);
    function QuestionItemFromMooc() {
        var _this = _super.call(this) || this;
        _this.on('after_register', function () {
            (0, cancelAttachShadow_1.default)();
        });
        return _this;
    }
    QuestionItemFromMooc.prototype.parse = function () {
        var questionItem = questions2json($('.queBox'));
        return questionItem.map(function (item, index) { return new QuestionOfMooc(index, { question: item.question, options: item.options, type: item.type }); });
    };
    QuestionItemFromMooc.prototype.match = function () {
        return /^(.)*:\/\/(.)*\.(uooc\.net\.cn|uooconline\.com)\/exam/.test(location.href);
    };
    return QuestionItemFromMooc;
}(question_1.QuestionAdapter));
exports.QuestionItemFromMooc = QuestionItemFromMooc;
var QuestionOfMooc = /** @class */ (function (_super) {
    __extends(QuestionOfMooc, _super);
    function QuestionOfMooc(position, question) {
        var _this = _super.call(this, question.question, question.options, question.type) || this;
        _this.position = position;
        return _this;
    }
    QuestionOfMooc.prototype.select = function () {
        var _this = this;
        var _a;
        if (typeof this.position !== 'number')
            return;
        (_a = this.answer) === null || _a === void 0 ? void 0 : _a.map(function (index) {
            $(".queBox .ti-alist:eq(".concat(_this.position, ") .ti-a .ti-a-i [type=radio]:eq(").concat(index, ")")).click();
        });
    };
    return QuestionOfMooc;
}(question_1.Question));
exports.QuestionOfMooc = QuestionOfMooc;


/***/ }),

/***/ 352:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuestionItemFromZHIHUISHU = exports.QuestionOfZHIHUISHU = void 0;
var question_1 = __webpack_require__(683);
var delay_1 = __importDefault(__webpack_require__(225));
var cancelAttachShadowByVueInstance_1 = __importDefault(__webpack_require__(233));
var typeRegList = [
    [question_1.QuestionType.Radio, /单选题/],
    [question_1.QuestionType.Checkbox, /多选题/],
];
function questions2json(questions) {
    return questions
        .map(function (index, question) {
        var typeText = $(question).find('.subject_type').text();
        var type = typeRegList.reduce(function (result, rule) {
            if (rule[1].test(typeText))
                return rule[0];
            return result;
        }, question_1.QuestionType.Radio);
        return {
            type: type,
            question: $(question).find('.subject_stem .subject_describe').text(),
            options: $(question)
                .find('.subject_node .nodeLab')
                .map(function (index, option) {
                var optionel = $(option);
                var prefix = optionel.find('.ABCase').text().trim();
                var body = optionel.find('.node_detail').text().trim();
                return {
                    prefix: prefix.slice(0, prefix.indexOf('.')),
                    body: body,
                };
            })
                .toArray(),
        };
    })
        .toArray();
}
var QuestionOfZHIHUISHU = /** @class */ (function (_super) {
    __extends(QuestionOfZHIHUISHU, _super);
    function QuestionOfZHIHUISHU(position, question) {
        var _this = _super.call(this, question.question, question.options, question.type) || this;
        _this.position = position;
        return _this;
    }
    QuestionOfZHIHUISHU.prototype.select = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var answer, _b, _c, _d, _i, index, el, _e, answer_1, index;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (typeof this.position !== 'number')
                            return [2 /*return*/];
                        answer = this.answer || [];
                        _b = this.type;
                        switch (_b) {
                            case question_1.QuestionType.Checkbox: return [3 /*break*/, 1];
                            case question_1.QuestionType.Radio: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        _c = [];
                        for (_d in this.options)
                            _c.push(_d);
                        _i = 0;
                        _f.label = 2;
                    case 2:
                        if (!(_i < _c.length)) return [3 /*break*/, 5];
                        index = _c[_i];
                        el = $(".examPaper_subject:eq(".concat(this.position, ") .subject_node .nodeLab input[type]:eq(").concat(index, ")"));
                        if (!((_a = el.get(0)) === null || _a === void 0 ? void 0 : _a.checked)) return [3 /*break*/, 4];
                        el.click();
                        return [4 /*yield*/, (0, delay_1.default)(1000)];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 6];
                    case 6:
                        _e = 0, answer_1 = answer;
                        _f.label = 7;
                    case 7:
                        if (!(_e < answer_1.length)) return [3 /*break*/, 10];
                        index = answer_1[_e];
                        $(".examPaper_subject:eq(".concat(this.position, ") .subject_node .nodeLab input[type]:eq(").concat(index, ")")).click();
                        return [4 /*yield*/, (0, delay_1.default)(1000)];
                    case 8:
                        _f.sent();
                        _f.label = 9;
                    case 9:
                        _e++;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return QuestionOfZHIHUISHU;
}(question_1.Question));
exports.QuestionOfZHIHUISHU = QuestionOfZHIHUISHU;
var QuestionItemFromZHIHUISHU = /** @class */ (function (_super) {
    __extends(QuestionItemFromZHIHUISHU, _super);
    function QuestionItemFromZHIHUISHU() {
        var _this = _super.call(this) || this;
        _this.on('before_match_questions', function () {
            (0, cancelAttachShadowByVueInstance_1.default)();
        });
        return _this;
    }
    QuestionItemFromZHIHUISHU.prototype.parse = function () {
        var questionItem = questions2json($('.examPaper_subject'));
        return questionItem.map(function (item, index) { return new QuestionOfZHIHUISHU(index, { question: item.question, options: item.options, type: item.type }); });
    };
    QuestionItemFromZHIHUISHU.prototype.match = function () {
        return /^(.)*:\/\/onlineexamh5new\.zhihuishu\.com\/stuExamWeb\.html.*/.test(location.href);
    };
    return QuestionItemFromZHIHUISHU;
}(question_1.QuestionAdapter));
exports.QuestionItemFromZHIHUISHU = QuestionItemFromZHIHUISHU;


/***/ }),

/***/ 819:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICodef = void 0;
var question_1 = __webpack_require__(683);
var service_1 = __webpack_require__(928);
var ICodef = /** @class */ (function (_super) {
    __extends(ICodef, _super);
    function ICodef() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'icodef';
        return _this;
    }
    ICodef.prototype.fetch = function (question) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service_1.Service.fetch({
                            method: 'POST',
                            url: 'http://cx.icodef.com/wyn-nb',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                Authorization: '',
                            },
                            data: "question=".concat(encodeURIComponent(question.question), "&type=").concat(question.type),
                        })];
                    case 1:
                        response = _a.sent();
                        data = JSON.parse(response.responseText);
                        resolve(data);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ICodef.prototype.format_answer = function (type, data) {
        var answers = [];
        switch (type) {
            case question_1.QuestionType.Checkbox:
                var datas = data.split('#');
                answers.push.apply(answers, datas.map(function (item) { return item.trim(); }));
                break;
            case question_1.QuestionType.Radio:
                answers.push(data.trim());
                break;
        }
        return {
            answers: answers,
        };
    };
    ICodef.prototype.format_option = function (type, option) {
        return option.trim().replace(/，/g, ',').replace(/。/g, '.').replace(/（/g, '(').replace(/）/g, ')').replace(/(“|”)/g, '"');
    };
    return ICodef;
}(service_1.Service));
exports.ICodef = ICodef;


/***/ }),

/***/ 682:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceAdapterManager = void 0;
var adapterManager_1 = __webpack_require__(73);
var ServiceAdapterManager = /** @class */ (function (_super) {
    __extends(ServiceAdapterManager, _super);
    function ServiceAdapterManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServiceAdapterManager.prototype.use = function (index) {
        if (!this.adapters.length) {
            throw new adapterManager_1.AdapaterManager.ERROR.ADAPTER_NOT_FOUND();
        }
        this.adapter = this.adapters[index];
    };
    ServiceAdapterManager.getInstance = function () {
        if (this.__SIMPLE__)
            return this.__SIMPLE__;
        return (this.__SIMPLE__ = new ServiceAdapterManager());
    };
    return ServiceAdapterManager;
}(adapterManager_1.AdapaterManager));
exports.ServiceAdapterManager = ServiceAdapterManager;


/***/ }),

/***/ 225:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var delay = function (time) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(undefined); }, time); }); };
exports["default"] = delay;


/***/ }),

/***/ 695:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnswerView = exports.ANSWER_EVENT_TYPE = void 0;
var __1 = __webpack_require__(181);
var question_1 = __webpack_require__(683);
var platform_1 = __webpack_require__(769);
var chaoxing_1 = __webpack_require__(49);
var mooc_1 = __webpack_require__(377);
var zhihuishu_1 = __webpack_require__(352);
var delay_1 = __importDefault(__webpack_require__(225));
var _1 = __webpack_require__(855);
var index_1 = __webpack_require__(682);
var background = (_a = {},
    _a[question_1.QuestionMatchStatus.NOTFOUND] = 'rgba(255, 0, 0, 0.3)',
    _a[question_1.QuestionMatchStatus.NOTMATCH] = 'rgba(0, 255, 0, 0.3)',
    _a[question_1.QuestionMatchStatus.MATCHED] = 'rgba(0, 0, 255, 0.3)',
    _a);
var ANSWER_EVENT_TYPE;
(function (ANSWER_EVENT_TYPE) {
    ANSWER_EVENT_TYPE["FOLD"] = "FOLD";
})(ANSWER_EVENT_TYPE = exports.ANSWER_EVENT_TYPE || (exports.ANSWER_EVENT_TYPE = {}));
var AnswerView = /** @class */ (function (_super) {
    __extends(AnswerView, _super);
    function AnswerView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'answer-view';
        return _this;
    }
    AnswerView.prototype.apply = function (view) {
        var element = (this.container = this.createElement());
        this.view = view;
        this.register(element, view);
        view.common.append(element);
        this.autoFind();
    };
    AnswerView.prototype.createElement = function () {
        return $("\n            <div class=\"\">\n                <div style=\"display: flex; align-items: center;\">\n                    \u672A\u5B8C\u5168\u5339\u914D\u7B54\u6848<div style=\"margin-right: 10px; width: 10px; height: 10px; background: ".concat(background[question_1.QuestionMatchStatus.NOTMATCH], "\"></div>\n                    \u672A\u627E\u5230\u7B54\u6848<div style=\"margin-right: 10px; width: 10px; height: 10px; background: ").concat(background[question_1.QuestionMatchStatus.NOTFOUND], "\"></div>\n                    \u5339\u914D\u5230\u7B54\u6848<div style=\"margin-right: 10px; width: 10px; height: 10px; background: ").concat(background[question_1.QuestionMatchStatus.MATCHED], "\"></div>\n                </div>\n                <div class=\"autoFindController\">\n                    <button class=\"pause\">\u6682\u505C</button>\n                    <button class=\"play\">\u5F00\u59CB</button>\n                    <button class=\"reset\">\u91CD\u65B0\u6536\u96C6\u9898\u76EE</button>\n                </div>\n                <table class=\"header-fixed\" style=\"height: 20px; width: 100%;background: #fff;\">\n                    <tr>\n                        <td width=\"50px\">\u5E8F\u53F7</td>\n                        <td width=\"300px\" style=\"padding: 5px 10px\" >\u95EE\u9898</td>\n                        <td width=\"150px\">\u7B54\u6848</td>\n                    </tr>\n                </table>\n                <div class=\"list-body\" style=\"overflow: hidden auto; max-height: 300px;\">\n                    <table class=\"listarea\"></table>\n                </div>\n            </div>\n        "));
    };
    AnswerView.prototype.register = function (element, view) {
        var _this = this;
        this.container.find('.pause').on('click', function () {
            view.emit(__1.EventEmitType.AUTO_FIND_PAUSE);
        });
        this.container.find('.play').on('click', function () {
            view.emit(__1.EventEmitType.AUTO_FIND_PLAY);
        });
        this.container.find('.reset').on('click', function () {
            _this.resetQuestions();
            view.emit(__1.EventEmitType.REFIND_QUESTION);
        });
        view.on(AnswerView.event.FOLD, function () {
            _this.container.toggle();
        });
    };
    AnswerView.prototype.autoFind = function () {
        var self = this;
        var view = this.view;
        var questionAdapterManager = new platform_1.QuestionAdapterManager();
        questionAdapterManager.register(new mooc_1.QuestionItemFromMooc());
        questionAdapterManager.register(new chaoxing_1.QuestionItemFromChaoxing());
        questionAdapterManager.register(new zhihuishu_1.QuestionItemFromZHIHUISHU());
        var questionInterable = new __1.QuestionIterable(questionAdapterManager);
        function questionProcessHandler(question, index) {
            return __awaiter(this, void 0, void 0, function () {
                var status, service, questionAnswer, answers, answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            service = index_1.ServiceAdapterManager.getInstance().getAdapter();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 4, 6]);
                            console.group("".concat(Number(index) + 1, ": ").concat(question.question));
                            return [4 /*yield*/, service.fetch({
                                    question: question.question,
                                    type: question.type,
                                    options: question.options,
                                })];
                        case 2:
                            questionAnswer = _a.sent();
                            console.log(questionAnswer.data);
                            status = question_1.QuestionMatchStatus.NOTFOUND;
                            if (questionAnswer.code !== 1) {
                                if (questionAnswer.code === 0) {
                                    console.log('发生错误');
                                }
                                else if (questionAnswer.code === -1) {
                                    console.log('未找到答案');
                                }
                                return [2 /*return*/];
                            }
                            answers = service.format_answer(question.type, questionAnswer.data);
                            console.log(answers.answers);
                            question.rawAnswer = answers.answers;
                            answer = question.match_answer(answers.answers, service.format_option);
                            console.log(answer);
                            status = question_1.QuestionMatchStatus.NOTMATCH;
                            if (!answer.length) {
                                console.log('没匹配到答案');
                                return [2 /*return*/];
                            }
                            status = question_1.QuestionMatchStatus.MATCHED;
                            question.set_answer(answer);
                            return [4 /*yield*/, question.select()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            console.groupEnd();
                            self.appendQuestion(question, status);
                            return [4 /*yield*/, (0, delay_1.default)(3000)];
                        case 5:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        questionInterable.next(questionProcessHandler);
        view.on(__1.EventEmitType.AUTO_FIND_PAUSE, function () {
            questionInterable.pause();
        });
        view.on(__1.EventEmitType.AUTO_FIND_PLAY, function () {
            questionInterable.setStatus('canplay');
            questionInterable.next(questionProcessHandler);
        });
        view.on(__1.EventEmitType.REFIND_QUESTION, function () {
            self.resetQuestions();
            questionInterable.resetContext();
            questionInterable.next(questionProcessHandler);
        });
    };
    AnswerView.prototype.appendQuestion = function (question, status) {
        var position = question.position, title = question.question, rawAnswer = question.rawAnswer;
        this.container.find('.listarea').append($("\n            <tr style=\"background: ".concat(background[status], "; color: rgba(0,0,0, 0.71);\">\n                <td width=\"50px\">").concat(position + 1, "</td>\n                <td width=\"300px\" style=\"padding: 5px 10px\">").concat(title, "</td>\n                <td width=\"150px\">").concat((rawAnswer === null || rawAnswer === void 0 ? void 0 : rawAnswer.length) ? rawAnswer.join('<br/><br/>') : '未找到答案', "</td>\n            </tr>\n        ")));
        this.container.find('.list-body').scrollTop(Number.MAX_SAFE_INTEGER);
    };
    AnswerView.prototype.resetQuestions = function () {
        this.container.find('.listarea').html('');
    };
    AnswerView.event = ANSWER_EVENT_TYPE;
    return AnswerView;
}(_1.ViewPlugin));
exports.AnswerView = AnswerView;


/***/ }),

/***/ 489:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Message = void 0;
var index_1 = __webpack_require__(855);
var MessageEvent;
(function (MessageEvent) {
    MessageEvent["MESSAGE"] = "MESSAGE";
})(MessageEvent || (MessageEvent = {}));
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    function Message() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'message-view';
        return _this;
    }
    Message.prototype.apply = function (view) {
        var element = (this.container = this.createElement());
        this.register(element, view);
        view.common.append(element);
    };
    Message.prototype.createElement = function () {
        return $("\n                <div class=\"message\">\u7ED3\u679C\uFF1A<pre class=\"message-view\"></pre></div>\n            ");
    };
    Message.prototype.register = function (element, view) {
        view.on(MessageEvent.MESSAGE, function (message) {
            element.find('.message-view').text(message);
        });
    };
    Message.show = function (view, message) {
        view.emit(MessageEvent.MESSAGE, message);
    };
    return Message;
}(index_1.ViewPlugin));
exports.Message = Message;


/***/ }),

/***/ 412:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchController = void 0;
var _1 = __webpack_require__(855);
var index_1 = __webpack_require__(682);
var question_1 = __webpack_require__(683);
var Message_1 = __webpack_require__(489);
var SearchController = /** @class */ (function (_super) {
    __extends(SearchController, _super);
    function SearchController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'search-controller';
        return _this;
    }
    SearchController.prototype.apply = function (view) {
        var element = this.createElement();
        this.register(element, view);
        view.common.append(element);
    };
    SearchController.prototype.createElement = function () {
        return $("\n                <div class=\"search-controller\">\n                    <input class=\"search-input\" />\n                    <button class=\"search-btn\">\u641C\u7D22</button>\n                </div>\n            ");
    };
    SearchController.prototype.register = function (element, view) {
        var _this = this;
        var input = element.find('.search-input');
        element.find('.search-btn').on('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var value, service, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        value = input.val();
                        if (!value) {
                            Message_1.Message.show(view, '请输入内容');
                            return [2 /*return*/];
                        }
                        service = index_1.ServiceAdapterManager.getInstance().getAdapter();
                        return [4 /*yield*/, service.fetch({
                                question: value,
                                type: question_1.QuestionType.Radio,
                                options: [],
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.code !== 1) {
                            if (response.code === 0) {
                                Message_1.Message.show(view, '发生错误');
                            }
                            else if (response.code === -1) {
                                Message_1.Message.show(view, '未找到答案');
                            }
                            return [2 /*return*/];
                        }
                        data = service.format_answer(question_1.QuestionType.Checkbox, response.data).answers;
                        Message_1.Message.show(view, data.join('\n'));
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return SearchController;
}(_1.ViewPlugin));
exports.SearchController = SearchController;


/***/ }),

/***/ 723:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceAdapterChange = void 0;
var _1 = __webpack_require__(855);
var service_1 = __webpack_require__(682);
var ServiceAdapterChange = /** @class */ (function (_super) {
    __extends(ServiceAdapterChange, _super);
    function ServiceAdapterChange() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'service-adapter-change';
        return _this;
    }
    ServiceAdapterChange.prototype.apply = function (view) {
        var element = this.createElement();
        this.register(element, view);
        view.common.append(element);
    };
    ServiceAdapterChange.prototype.createElement = function () {
        var adapters = service_1.ServiceAdapterManager.getInstance().getAdapters();
        var names = adapters.map(function (adapter) { return adapter.name; });
        return $("\n                <div class=\"service-adapter-controller\">\n                    <select class=\"service-adapter-select\">\n                        ".concat(names.map(function (name, index) { return "<option value=\"".concat(index, "\">").concat(name, "</option>"); }), "\n                    </select>\n                </div>\n            "));
    };
    ServiceAdapterChange.prototype.register = function (element, view) {
        element.find('.service-adapter-select').on('input', function () {
            var index = Number(element.find('.service-adapter-select').val());
            service_1.ServiceAdapterManager.getInstance().use(index);
        });
    };
    return ServiceAdapterChange;
}(_1.ViewPlugin));
exports.ServiceAdapterChange = ServiceAdapterChange;


/***/ }),

/***/ 915:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WindowController = void 0;
var _1 = __webpack_require__(855);
var AnswerView_1 = __webpack_require__(695);
var WindowController = /** @class */ (function (_super) {
    __extends(WindowController, _super);
    function WindowController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'window-controller';
        return _this;
    }
    WindowController.prototype.apply = function (view) {
        var element = this.createElement();
        this.register(element, view);
        view.controller.append(element);
        console.log(view, element, 'window - controller register');
    };
    WindowController.prototype.createElement = function () {
        return $("\n        <div style=\"display: flex; justify-content: flex-end; width: 100%; align-items: center; align-content: center; font-size: 24px;\">\n            <div style=\"cursor: pointer; height: 20px; padding-left: 5px; line-height: 20px; font-size: .7em;\" class=\"fold\">\u6298\u53E0\u7B54\u6848\u533A\u57DF</div>\n            <div style=\"cursor: pointer; width: 20px; height: 20px; padding-left: 5px; line-height: 20px;\" class=\"windowToMin\">-</div>\n            <div style=\"cursor: pointer; width: 20px; height: 20px; padding-left: 5px; line-height: 20px;\" class=\"windowClose\">x</div>\n        </div>\n        ");
    };
    WindowController.prototype.register = function (element, view) {
        var openIcon = $("<div class=\"openIcon\" style=\"z-index: 1000; width: 20px; height: 20px; position: fixed; right: 50px; top: 50px; background: red;\"></div>");
        var container = view.container;
        $(document.body).append(openIcon);
        openIcon.hide();
        openIcon.on('click', function () {
            container.show();
        });
        element.find('.windowClose').on('click', function () {
            container.hide();
        });
        element.find('.windowToMin').on('click', function () {
            container.hide();
            openIcon.show();
        });
        element.find('.fold').on('click', function () {
            view.emit(AnswerView_1.AnswerView.event.FOLD);
        });
    };
    return WindowController;
}(_1.ViewPlugin));
exports.WindowController = WindowController;


/***/ }),

/***/ 855:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.View = exports.ViewPlugin = void 0;
var eventemitter3_1 = __importDefault(__webpack_require__(312));
var ViewPlugin = /** @class */ (function () {
    function ViewPlugin() {
    }
    return ViewPlugin;
}());
exports.ViewPlugin = ViewPlugin;
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View() {
        var _this = _super.call(this) || this;
        _this.plugins = [];
        _this.container = _this.creatElement();
        _this.controller = _this.container.find('.top-container');
        _this.common = _this.container.find('.common');
        return _this;
    }
    View.prototype.register = function (view) {
        this.plugins.push(view);
    };
    View.prototype.creatElement = function () {
        return $("\n                <div style=\"z-index: 1000; position: fixed;right: 0;top: 0;width: 500px;max-height: 400px;background: #fff;overflow: hidden auto;\" class=\"container\">\n                    <div class=\"top-container\"></div>\n                    <div class=\"common\"></div>\n                </div>\n            ");
    };
    View.prototype.start = function () {
        var _this = this;
        this.plugins.forEach(function (plugin) {
            console.log(plugin.name, 'will register');
            plugin.apply(_this);
            console.log(plugin.name, 'did register');
        });
    };
    return View;
}(eventemitter3_1.default));
exports.View = View;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(181);
/******/ 	
/******/ })()
;
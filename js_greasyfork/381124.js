// ==UserScript==
// @name            Evernote Editor Preview
// @namespace       https://github.com/Amourspirit/Evernote-Preview
// @version         1.0.0
// @description     Adds a preview option to Evernote Editor
// @author          Paul Moss
// @run-at          document-end
// @match           https://www.evernote.com/Home.action*
// @match           https://www.evernote.com/u/0/Home.action*
// @match           https://app.yinxiang.com/Home.action*
// @match           https://app.yinxiang.com/u/0/Home.action*
// @noframes
// @homepageURL     https://github.com/Amourspirit/Evernote-Preview
// @update          https://github.com/Amourspirit/Evernote-Preview/raw/master/dist/EvernotePreview.user.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @require         https://code.jquery.com/jquery-latest.min.js
// @contributionURL https://bit.ly/1QIN2Cs
// @license         MIT
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/381124/Evernote%20Editor%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/381124/Evernote%20Editor%20Preview.meta.js
// ==/UserScript==
(function ($) {
    'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
    var DebugLevel;
    (function (DebugLevel) {
        DebugLevel[DebugLevel["debug"] = 0] = "debug";
        DebugLevel[DebugLevel["error"] = 1] = "error";
        DebugLevel[DebugLevel["warn"] = 2] = "warn";
        DebugLevel[DebugLevel["info"] = 3] = "info";
        DebugLevel[DebugLevel["none"] = 4] = "none";
    })(DebugLevel || (DebugLevel = {}));
    var ScriptLinkType;
    (function (ScriptLinkType) {
        ScriptLinkType[ScriptLinkType["css"] = 0] = "css";
        ScriptLinkType[ScriptLinkType["cssLink"] = 1] = "cssLink";
        ScriptLinkType[ScriptLinkType["linkedJs"] = 2] = "linkedJs";
    })(ScriptLinkType || (ScriptLinkType = {}));
    var ElementLocation;
    (function (ElementLocation) {
        ElementLocation[ElementLocation["head"] = 0] = "head";
        ElementLocation[ElementLocation["body"] = 1] = "body";
        ElementLocation[ElementLocation["other"] = 2] = "other";
    })(ElementLocation || (ElementLocation = {}));

    var appSettings = {
        debugLevel: DebugLevel.none,
        shortName: 'ENPV',
        buttonId: 'bb_btn_en_pv',
        preKey: 'enpv_',
        menuName: "Evernote Preview Options"
    };

    var Log =  (function () {
        function Log() {
        }
        Log.message = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.info) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.log.apply(console, [msg].concat(params));
        };
        Log.warn = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.warn) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.warn.apply(console, [msg].concat(params));
        };
        Log.error = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.error) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.error.apply(console, [msg].concat(params));
        };
        Log.debug = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.debug) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.log.apply(console, [appSettings.shortName + ": Debug: " + msg].concat(params));
        };
        Log.debugWarn = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.debug) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.warn.apply(console, [appSettings.shortName + ": Debug: " + msg].concat(params));
        };
        return Log;
    }());

    var utilCreateElement = function (tag) {
        var D = document;
        var node = D.createElement(tag);
        return node;
    };
    var elementCreate = function (args) {
        var methodName = 'elementCreate';
        var appDebugLevel = appSettings.debugLevel;
        var levelDebug = DebugLevel.debug;
        if (appDebugLevel >= levelDebug) {
            Log.debug(methodName + ": Entered.");
        }
        var htmlNode = utilCreateElement(args.tag); // D.createElement('script');
        if (args.attrib) {
            for (var key in args.attrib) {
                if (args.attrib.hasOwnProperty(key)) {
                    var value = args.attrib[key];
                    htmlNode.setAttribute(key, value);
                }
            }
        }
        if (args.html && args.html.length > 0) {
            htmlNode.innerHTML = args.html;
        }
        if (args.text && args.text.length > 0) {
            htmlNode.textContent = args.text;
        }
        if (appDebugLevel >= levelDebug) {
            Log.debug(methodName + ": Leaving");
        }
        return htmlNode;
    };
    var elementsCreate = function (args) {
        var methodName = 'elementsCreate';
        var appDebugLevel = appSettings.debugLevel;
        var levelDebug = DebugLevel.debug;
        if (appDebugLevel >= levelDebug) {
            Log.debug(methodName + ": Entered");
        }
        var parentEl = elementCreate(args);
        if (args.children) {
            addElementRecursive(parentEl, args.children);
        }
        if (appDebugLevel >= levelDebug) {
            Log.debug(methodName + ": Leaving");
        }
        return parentEl;
    };
    var addElementRecursive = function (parentElement, args) {
        if (args && args.length > 0) {
            for (var i = 0; i < args.length; i++) {
                var el = args[i];
                var childEl = elementCreate(el);
                parentElement.appendChild(childEl);
                if (el.children) {
                    addElementRecursive(childEl, args[i].children);
                }
            }
        }
    };

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var management = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventManagement =  (function () {
        function EventManagement(unsub) {
            this.unsub = unsub;
            this.propagationStopped = false;
        }
        EventManagement.prototype.stopPropagation = function () {
            this.propagationStopped = true;
        };
        return EventManagement;
    }());
    exports.EventManagement = EventManagement;
    });

    unwrapExports(management);
    var management_1 = management.EventManagement;

    var subscription = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Subscription =  (function () {
        function Subscription(handler, isOnce) {
            this.handler = handler;
            this.isOnce = isOnce;
            this.isExecuted = false;
        }
        Subscription.prototype.execute = function (executeAsync, scope, args) {
            if (!this.isOnce || !this.isExecuted) {
                this.isExecuted = true;
                var fn = this.handler;
                if (executeAsync) {
                    setTimeout(function () {
                        fn.apply(scope, args);
                    }, 1);
                }
                else {
                    fn.apply(scope, args);
                }
            }
        };
        return Subscription;
    }());
    exports.Subscription = Subscription;
    });

    unwrapExports(subscription);
    var subscription_1 = subscription.Subscription;

    var dispatching = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var DispatcherBase =  (function () {
        function DispatcherBase() {
            this._wrap = new DispatcherWrapper(this);
            this._subscriptions = new Array();
        }
        DispatcherBase.prototype.subscribe = function (fn) {
            var _this = this;
            if (fn) {
                this._subscriptions.push(new subscription.Subscription(fn, false));
            }
            return function () {
                _this.unsubscribe(fn);
            };
        };
        DispatcherBase.prototype.sub = function (fn) {
            return this.subscribe(fn);
        };
        DispatcherBase.prototype.one = function (fn) {
            var _this = this;
            if (fn) {
                this._subscriptions.push(new subscription.Subscription(fn, true));
            }
            return function () {
                _this.unsubscribe(fn);
            };
        };
        DispatcherBase.prototype.has = function (fn) {
            if (!fn)
                return false;
            return this._subscriptions.some(function (sub) { return sub.handler == fn; });
        };
        DispatcherBase.prototype.unsubscribe = function (fn) {
            if (!fn)
                return;
            for (var i = 0; i < this._subscriptions.length; i++) {
                if (this._subscriptions[i].handler == fn) {
                    this._subscriptions.splice(i, 1);
                    break;
                }
            }
        };
        DispatcherBase.prototype.unsub = function (fn) {
            this.unsubscribe(fn);
        };
        DispatcherBase.prototype._dispatch = function (executeAsync, scope, args) {
            var _this = this;
            var _loop_1 = function (sub) {
                var ev = new management.EventManagement(function () { return _this.unsub(sub.handler); });
                var nargs = Array.prototype.slice.call(args);
                nargs.push(ev);
                sub.execute(executeAsync, scope, nargs);
                this_1.cleanup(sub);
                if (!executeAsync && ev.propagationStopped) {
                    return "break";
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this._subscriptions.slice(); _i < _a.length; _i++) {
                var sub = _a[_i];
                var state_1 = _loop_1(sub);
                if (state_1 === "break")
                    break;
            }
        };
        DispatcherBase.prototype.cleanup = function (sub) {
            if (sub.isOnce && sub.isExecuted) {
                var i = this._subscriptions.indexOf(sub);
                if (i > -1) {
                    this._subscriptions.splice(i, 1);
                }
            }
        };
        DispatcherBase.prototype.asEvent = function () {
            return this._wrap;
        };
        DispatcherBase.prototype.clear = function () {
            this._subscriptions.splice(0, this._subscriptions.length);
        };
        return DispatcherBase;
    }());
    exports.DispatcherBase = DispatcherBase;
    var EventListBase =  (function () {
        function EventListBase() {
            this._events = {};
        }
        EventListBase.prototype.get = function (name) {
            var event = this._events[name];
            if (event) {
                return event;
            }
            event = this.createDispatcher();
            this._events[name] = event;
            return event;
        };
        EventListBase.prototype.remove = function (name) {
            delete this._events[name];
        };
        return EventListBase;
    }());
    exports.EventListBase = EventListBase;
    var DispatcherWrapper =  (function () {
        function DispatcherWrapper(dispatcher) {
            this._subscribe = function (fn) { return dispatcher.subscribe(fn); };
            this._unsubscribe = function (fn) { return dispatcher.unsubscribe(fn); };
            this._one = function (fn) { return dispatcher.one(fn); };
            this._has = function (fn) { return dispatcher.has(fn); };
            this._clear = function () { return dispatcher.clear(); };
        }
        DispatcherWrapper.prototype.subscribe = function (fn) {
            return this._subscribe(fn);
        };
        DispatcherWrapper.prototype.sub = function (fn) {
            return this.subscribe(fn);
        };
        DispatcherWrapper.prototype.unsubscribe = function (fn) {
            this._unsubscribe(fn);
        };
        DispatcherWrapper.prototype.unsub = function (fn) {
            this.unsubscribe(fn);
        };
        DispatcherWrapper.prototype.one = function (fn) {
            return this._one(fn);
        };
        DispatcherWrapper.prototype.has = function (fn) {
            return this._has(fn);
        };
        DispatcherWrapper.prototype.clear = function () {
            this._clear();
        };
        return DispatcherWrapper;
    }());
    exports.DispatcherWrapper = DispatcherWrapper;
    });

    unwrapExports(dispatching);
    var dispatching_1 = dispatching.DispatcherBase;
    var dispatching_2 = dispatching.EventListBase;
    var dispatching_3 = dispatching.DispatcherWrapper;

    var dist = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", { value: true });

    exports.DispatcherBase = dispatching.DispatcherBase;
    exports.DispatcherWrapper = dispatching.DispatcherWrapper;
    exports.EventListBase = dispatching.EventListBase;

    exports.Subscription = subscription.Subscription;
    });

    unwrapExports(dist);
    var dist_1 = dist.DispatcherBase;
    var dist_2 = dist.DispatcherWrapper;
    var dist_3 = dist.EventListBase;
    var dist_4 = dist.Subscription;

    var events = createCommonjsModule(function (module, exports) {
    var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventDispatcher =  (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            return _super.call(this) || this;
        }
        EventDispatcher.prototype.dispatch = function (sender, args) {
            this._dispatch(false, this, arguments);
        };
        EventDispatcher.prototype.dispatchAsync = function (sender, args) {
            this._dispatch(true, this, arguments);
        };
        EventDispatcher.prototype.asEvent = function () {
            return _super.prototype.asEvent.call(this);
        };
        return EventDispatcher;
    }(dist.DispatcherBase));
    exports.EventDispatcher = EventDispatcher;
    var EventList =  (function (_super) {
        __extends(EventList, _super);
        function EventList() {
            return _super.call(this) || this;
        }
        EventList.prototype.createDispatcher = function () {
            return new EventDispatcher();
        };
        return EventList;
    }(dist.EventListBase));
    exports.EventList = EventList;
    var EventHandlingBase =  (function () {
        function EventHandlingBase() {
            this._events = new EventList();
        }
        Object.defineProperty(EventHandlingBase.prototype, "events", {
            get: function () {
                return this._events;
            },
            enumerable: true,
            configurable: true
        });
        EventHandlingBase.prototype.subscribe = function (name, fn) {
            this._events.get(name).subscribe(fn);
        };
        EventHandlingBase.prototype.sub = function (name, fn) {
            this.subscribe(name, fn);
        };
        EventHandlingBase.prototype.unsubscribe = function (name, fn) {
            this._events.get(name).unsubscribe(fn);
        };
        EventHandlingBase.prototype.unsub = function (name, fn) {
            this.unsubscribe(name, fn);
        };
        EventHandlingBase.prototype.one = function (name, fn) {
            this._events.get(name).one(fn);
        };
        EventHandlingBase.prototype.has = function (name, fn) {
            return this._events.get(name).has(fn);
        };
        return EventHandlingBase;
    }());
    exports.EventHandlingBase = EventHandlingBase;
    });

    unwrapExports(events);
    var events_1 = events.EventDispatcher;
    var events_2 = events.EventList;
    var events_3 = events.EventHandlingBase;

    var dist$1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.EventDispatcher = events.EventDispatcher;
    exports.EventHandlingBase = events.EventHandlingBase;
    exports.EventList = events.EventList;
    });

    unwrapExports(dist$1);
    var dist_1$1 = dist$1.EventDispatcher;
    var dist_2$1 = dist$1.EventHandlingBase;
    var dist_3$1 = dist$1.EventList;

    var simpleEvents = createCommonjsModule(function (module, exports) {
    var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimpleEventDispatcher =  (function (_super) {
        __extends(SimpleEventDispatcher, _super);
        function SimpleEventDispatcher() {
            return _super.call(this) || this;
        }
        SimpleEventDispatcher.prototype.dispatch = function (args) {
            this._dispatch(false, this, arguments);
        };
        SimpleEventDispatcher.prototype.dispatchAsync = function (args) {
            this._dispatch(true, this, arguments);
        };
        SimpleEventDispatcher.prototype.asEvent = function () {
            return _super.prototype.asEvent.call(this);
        };
        return SimpleEventDispatcher;
    }(dist.DispatcherBase));
    exports.SimpleEventDispatcher = SimpleEventDispatcher;
    var SimpleEventList =  (function (_super) {
        __extends(SimpleEventList, _super);
        function SimpleEventList() {
            return _super.call(this) || this;
        }
        SimpleEventList.prototype.createDispatcher = function () {
            return new SimpleEventDispatcher();
        };
        return SimpleEventList;
    }(dist.EventListBase));
    exports.SimpleEventList = SimpleEventList;
    var SimpleEventHandlingBase =  (function () {
        function SimpleEventHandlingBase() {
            this._events = new SimpleEventList();
        }
        Object.defineProperty(SimpleEventHandlingBase.prototype, "events", {
            get: function () {
                return this._events;
            },
            enumerable: true,
            configurable: true
        });
        SimpleEventHandlingBase.prototype.subscribe = function (name, fn) {
            this._events.get(name).subscribe(fn);
        };
        SimpleEventHandlingBase.prototype.sub = function (name, fn) {
            this.subscribe(name, fn);
        };
        SimpleEventHandlingBase.prototype.one = function (name, fn) {
            this._events.get(name).one(fn);
        };
        SimpleEventHandlingBase.prototype.has = function (name, fn) {
            return this._events.get(name).has(fn);
        };
        SimpleEventHandlingBase.prototype.unsubscribe = function (name, fn) {
            this._events.get(name).unsubscribe(fn);
        };
        SimpleEventHandlingBase.prototype.unsub = function (name, fn) {
            this.unsubscribe(name, fn);
        };
        return SimpleEventHandlingBase;
    }());
    exports.SimpleEventHandlingBase = SimpleEventHandlingBase;
    });

    unwrapExports(simpleEvents);
    var simpleEvents_1 = simpleEvents.SimpleEventDispatcher;
    var simpleEvents_2 = simpleEvents.SimpleEventList;
    var simpleEvents_3 = simpleEvents.SimpleEventHandlingBase;

    var dist$2 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.SimpleEventDispatcher = simpleEvents.SimpleEventDispatcher;
    exports.SimpleEventHandlingBase = simpleEvents.SimpleEventHandlingBase;
    exports.SimpleEventList = simpleEvents.SimpleEventList;
    });

    unwrapExports(dist$2);
    var dist_1$2 = dist$2.SimpleEventDispatcher;
    var dist_2$2 = dist$2.SimpleEventHandlingBase;
    var dist_3$2 = dist$2.SimpleEventList;

    var signals = createCommonjsModule(function (module, exports) {
    var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var SignalDispatcher =  (function (_super) {
        __extends(SignalDispatcher, _super);
        function SignalDispatcher() {
            return _super.call(this) || this;
        }
        SignalDispatcher.prototype.dispatch = function () {
            this._dispatch(false, this, arguments);
        };
        SignalDispatcher.prototype.dispatchAsync = function () {
            this._dispatch(true, this, arguments);
        };
        SignalDispatcher.prototype.asEvent = function () {
            return _super.prototype.asEvent.call(this);
        };
        return SignalDispatcher;
    }(dist.DispatcherBase));
    exports.SignalDispatcher = SignalDispatcher;
    var SignalList =  (function (_super) {
        __extends(SignalList, _super);
        function SignalList() {
            return _super.call(this) || this;
        }
        SignalList.prototype.createDispatcher = function () {
            return new SignalDispatcher();
        };
        return SignalList;
    }(dist.EventListBase));
    exports.SignalList = SignalList;
    var SignalHandlingBase =  (function () {
        function SignalHandlingBase() {
            this._events = new SignalList();
        }
        Object.defineProperty(SignalHandlingBase.prototype, "events", {
            get: function () {
                return this._events;
            },
            enumerable: true,
            configurable: true
        });
        SignalHandlingBase.prototype.one = function (name, fn) {
            this._events.get(name).one(fn);
        };
        SignalHandlingBase.prototype.has = function (name, fn) {
            return this._events.get(name).has(fn);
        };
        SignalHandlingBase.prototype.subscribe = function (name, fn) {
            this._events.get(name).subscribe(fn);
        };
        SignalHandlingBase.prototype.sub = function (name, fn) {
            this.subscribe(name, fn);
        };
        SignalHandlingBase.prototype.unsubscribe = function (name, fn) {
            this._events.get(name).unsubscribe(fn);
        };
        SignalHandlingBase.prototype.unsub = function (name, fn) {
            this.unsubscribe(name, fn);
        };
        return SignalHandlingBase;
    }());
    exports.SignalHandlingBase = SignalHandlingBase;
    });

    unwrapExports(signals);
    var signals_1 = signals.SignalDispatcher;
    var signals_2 = signals.SignalList;
    var signals_3 = signals.SignalHandlingBase;

    var dist$3 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.SignalDispatcher = signals.SignalDispatcher;
    exports.SignalHandlingBase = signals.SignalHandlingBase;
    exports.SignalList = signals.SignalList;
    });

    unwrapExports(dist$3);
    var dist_1$3 = dist$3.SignalDispatcher;
    var dist_2$3 = dist$3.SignalHandlingBase;
    var dist_3$3 = dist$3.SignalList;

    var dist$4 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", { value: true });

    exports.DispatcherBase = dist.DispatcherBase;
    exports.DispatcherWrapper = dist.DispatcherWrapper;
    exports.EventListBase = dist.EventListBase;
    exports.Subscription = dist.Subscription;

    exports.EventDispatcher = dist$1.EventDispatcher;
    exports.EventHandlingBase = dist$1.EventHandlingBase;
    exports.EventList = dist$1.EventList;

    exports.SimpleEventDispatcher = dist$2.SimpleEventDispatcher;
    exports.SimpleEventHandlingBase = dist$2.SimpleEventHandlingBase;
    exports.SimpleEventList = dist$2.SimpleEventList;

    exports.SignalDispatcher = dist$3.SignalDispatcher;
    exports.SignalHandlingBase = dist$3.SignalHandlingBase;
    exports.SignalList = dist$3.SignalList;
    });

    unwrapExports(dist$4);
    var dist_1$4 = dist$4.DispatcherBase;
    var dist_2$4 = dist$4.DispatcherWrapper;
    var dist_3$4 = dist$4.EventListBase;
    var dist_4$1 = dist$4.Subscription;
    var dist_5 = dist$4.EventDispatcher;
    var dist_6 = dist$4.EventHandlingBase;
    var dist_7 = dist$4.EventList;
    var dist_8 = dist$4.SimpleEventDispatcher;
    var dist_9 = dist$4.SimpleEventHandlingBase;
    var dist_10 = dist$4.SimpleEventList;
    var dist_11 = dist$4.SignalDispatcher;
    var dist_12 = dist$4.SignalHandlingBase;
    var dist_13 = dist$4.SignalList;
    var EventArgs =  (function () {
        function EventArgs() {
            this.cancel = false;
        }
        return EventArgs;
    }());

    var ToolbarButton =  (function () {
        function ToolbarButton(btnId) {
            this.eventBtnClick = new dist_5();
            this.lPreviousTbBtnSel = '#gwt-debug-FormattingBar-outdentButton';
            this.lBtnLoaded = false;
            this.lBtnId = btnId;
        }
        Object.defineProperty(ToolbarButton.prototype, "isLoaded", {
            get: function () {
                return this.isLoaded;
            },
            enumerable: true,
            configurable: true
        });
        ToolbarButton.prototype.init = function () {
            if (this.lBtnLoaded === false) {
                this.lBtnLoaded = this.load();
            }
        };
        ToolbarButton.prototype.onButtonClick = function () {
            return this.eventBtnClick.asEvent();
        };
        ToolbarButton.prototype.load = function () {
            var _this = this;
            var prev = $(this.lPreviousTbBtnSel).parent();
            if (prev.length === 0) {
                return false;
            }
            var code = {
                tag: 'div',
                attrib: {
                    id: this.lBtnId
                }
            };
            var btnEl = elementsCreate(code);
            prev.after(btnEl);
            var btn = $("#" + this.lBtnId);
            btn.addClass(prev.attr('class') + '');
            btn.attr('style', prev.attr('style') + '');
            var btnChild = prev.find('div').first().clone();
            btnChild.attr('id', this.lBtnId + "_child");
            btnChild.attr('title', 'Fullscreen Preview');
            btn.append(btnChild);
            btnChild.appendTo(btn);
            var inp = btn.find('input');
            if (inp.length > 0) {
                inp.remove();
            }
            btn.on('click', function () {
                var args = new EventArgs();
                _this.eventBtnClick.dispatch(_this, args);
            });
            return true;
        };
        return ToolbarButton;
    }());


    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var IntervalEventArgs =  (function () {
        function IntervalEventArgs(ticks, interval) {
            if (interval === void 0) { interval = 0; }
            this.cancel = false;
            this.lCount = ticks;
            this.lInterval = interval;
        }
        Object.defineProperty(IntervalEventArgs.prototype, "count", {
            get: function () {
                return this.lCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IntervalEventArgs.prototype, "interval", {
            get: function () {
                return this.lInterval;
            },
            enumerable: true,
            configurable: true
        });
        return IntervalEventArgs;
    }());
    var Interval =  (function () {
        function Interval(interval, maxCount) {
            var _this = this;
            this.edOnTick = new dist_5();
            this.edOnTickExpired = new dist_5();
            this.lTick = 0;
            this.lIsDisposed = false;
            this.isAtInterval = function () {
                return _this.lTick > _this.lMaxTick;
            };
            this.lMaxTick = maxCount;
            this.lIntervalTime = interval;
            if (this.lIntervalTime < 1) {
                throw new RangeError('interval arg must be greater than 0');
            }
            if (this.lMaxTick < 1) {
                return;
            }
            this.startInterval();
        }
        Interval.prototype.onTick = function () {
            return this.edOnTick.asEvent();
        };
        Interval.prototype.onExpired = function () {
            return this.edOnTickExpired.asEvent();
        };
        Interval.prototype.dispose = function () {
            if (this.lIsDisposed === true) {
                return;
            }
            try {
                if (this.lInterval) {
                    clearInterval(this.lInterval);
                }
            }
            finally {
                this.lMaxTick = 0;
                this.lIntervalTime = 0;
                this.lMaxTick = 0;
                this.lIsDisposed = true;
            }
        };
        Object.defineProperty(Interval.prototype, "isDisposed", {
            get: function () {
                return this.lIsDisposed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Interval.prototype, "count", {
            get: function () {
                return this.lTick;
            },
            enumerable: true,
            configurable: true
        });
        Interval.prototype.startInterval = function () {
            var _this = this;
            this.lInterval = setInterval(function () {
                _this.tick();
            }, this.lIntervalTime);
        };
        Interval.prototype.onTickTock = function (eventArgs) {
            if (eventArgs.cancel === true) {
                return;
            }
            return;
        };
        Interval.prototype.onTicks = function (eventArgs) {
            if (eventArgs.cancel === true) {
                return;
            }
            return;
        };
        Interval.prototype.onTickExpired = function (eventArgs) {
            if (eventArgs.cancel === true) {
                return;
            }
            return;
        };
        Interval.prototype.tick = function () {
            this.lTick += 1;
            var eventArgs = new IntervalEventArgs(this.lTick, this.lIntervalTime);
            this.onTicks(eventArgs);
            if (this.isAtInterval()) {
                if (this.lInterval) {
                    clearInterval(this.lInterval);
                }
                this.onTickExpired(eventArgs);
                if (eventArgs.cancel === true) {
                    return;
                }
                this.edOnTickExpired.dispatch(this, eventArgs);
            }
            else {
                this.onTickTock(eventArgs);
                if (eventArgs.cancel === true) {
                    return;
                }
                this.edOnTick.dispatch(this, eventArgs);
            }
        };
        return Interval;
    }());
    var IntervalManual =  (function (_super) {
        __extends(IntervalManual, _super);
        function IntervalManual(interval, maxCount) {
            var _this = _super.call(this, interval, maxCount) || this;
            _this.lIsStarted = false;
            return _this;
        }
        IntervalManual.prototype.start = function () {
            if (this.isStarted === true) {
                return;
            }
            this.lIsStarted = true;
            _super.prototype.startInterval.call(this);
        };
        IntervalManual.prototype.dispose = function () {
            this.lIsStarted = false;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(IntervalManual.prototype, "isStarted", {
            get: function () {
                return this.lIsStarted;
            },
            enumerable: true,
            configurable: true
        });
        IntervalManual.prototype.startInterval = function () {
        };
        return IntervalManual;
    }(Interval));

    var GmConfig =  (function () {
        function GmConfig() {
            this.gmConfig = GM_config;
        }
        Object.defineProperty(GmConfig.prototype, "fullscreenPadding", {
            get: function () {
                return parseInt(this.gmConfig.get('fullscreenPadding'), 10);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "fullscreenPaddingType", {
            get: function () {
                return this.gmConfig.get('fullscreenPaddingType');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "fullScreenDisplayTitle", {
            get: function () {
                return this.gmConfig.get('fullScreenDisplayTitle');
            },
            enumerable: true,
            configurable: true
        });
        GmConfig.prototype.init = function () {
            var strTitle = appSettings.menuName;
            if (GM_info && GM_info.script && GM_info.script.version) {
                strTitle = appSettings.menuName + ": Version: " + GM_info.script.version;
            }
            var initValues = {
                id: appSettings.preKey + 'Config',
                title: strTitle,
                fields: // Fields object
                {
                    fullscreenPadding: {
                        section: ['Full Screen Optons'],
                        label: 'Specify the amount left and right padding for full screen mode',
                        type: 'int',
                        min: 0,
                        max: 200,
                        default: 5 // Default value if user doesnt change it
                    },
                    fullscreenPaddingType: {
                        label: 'Select the type of padding',
                        type: 'select',
                        options: ['percent', 'px', 'em'],
                        default: ['px']
                    },
                    fullScreenDisplayTitle: {
                        type: 'checkbox',
                        label: 'Display Title in full screen',
                        default: true
                    },
                },
            };
            GM_config.init(initValues);
        };
        return GmConfig;
    }());
    var Fullscreen =  (function () {
        function Fullscreen() {
            var _this = this;
            this.lFullScreen = false;
            this.lDivFsId = 'en_fs_prev';
            this.lDivFsInnerId = 'en_fs_prev_inner';
            this.lDivTitleId = 'en_fs_prev_title';
            this.lIframeId = 'en_fs_frame';
            this.lNoteTitleSel = '#gwt-debug-NoteTitleView-textBox';
            this.lConfig = new GmConfig();
            this.fullScreenChange = function () {
                if (document.fullscreenEnabled ||
                    document.webkitIsFullScreen ||
                    document.mozFullScreen ||
                    document.msFullscreenElement) {
                    _this.lFullScreen = !_this.lFullScreen;
                    _this.toogleDivFsStyle();
                    _this.toggleElements();
                }
                else {
                }
            };
            this.addDoucmentEvent();
            $('body').append(this.getFullScreenHtml());
        }
        Fullscreen.prototype.requestFullscreen = function () {
            if (this.lFullScreen === true) {
                return;
            }
            var jqDiv = $("#" + this.lDivFsId);
            if (jqDiv.length !== 1) {
                Log.error(appSettings.shortName + ": DIV: " + this.lDivFsId + " is required and not found.");
                return;
            }
            if (this.lConfig.fullScreenDisplayTitle === true) {
                var jqFsTitle = $("#" + this.lDivTitleId);
                jqFsTitle.text(this.getTitleText());
            }
            var div = jqDiv[0];
            if (div.requestFullscreen) {
                div.requestFullscreen();
            }
            else if (div.webkitRequestFullscreen) {
                div.webkitRequestFullscreen();
            }
            else if (div.mozRequestFullScreen) {
                div.mozRequestFullScreen();
            }
            else if (div.msRequestFullscreen) {
                div.msRequestFullscreen();
            }
            var jqIframe = $("#" + this.lIframeId);
            var url = this.getIframeSrc();
            jqIframe.attr('src', url);
        };
        Fullscreen.prototype.addDoucmentEvent = function () {
            if (document.fullscreenEnabled) {
                document.addEventListener('fullscreenchange', this.fullScreenChange);
            }
            else if (document.webkitExitFullscreen) {
                document.addEventListener('webkitfullscreenchange', this.fullScreenChange);
            }
            else if (document.mozRequestFullScreen) {
                document.addEventListener('mozfullscreenchange', this.fullScreenChange);
            }
            else if (document.msRequestFullscreen) {
                document.addEventListener('MSFullscreenChange', this.fullScreenChange);
            }
        };
        Object.defineProperty(Fullscreen.prototype, "isInFullscreen", {
            get: function () {
                return this.lFullScreen;
            },
            enumerable: true,
            configurable: true
        });
        Fullscreen.prototype.toggleElements = function () {
            if (this.lFullScreen === false) {
                var jqIframe = $("#" + this.lIframeId);
                jqIframe.attr('src', 'about:blank');
                var jqFsTitle = $("#" + this.lDivTitleId);
                jqFsTitle.text('');
            }
        };
        Fullscreen.prototype.toogleDivFsStyle = function () {
            var el = document.getElementById(this.lDivFsId);
            if (el) {
                if (this.lFullScreen === true) {
                    var fsStyle = "width:100%;background-color:#fff;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-ms-flex-direction:column;-moz-flex-direction:column;-webkit-flex-direction:column;flex-direction:column;justify-content:center;align-self:flex-start;";
                    el.setAttribute('style', fsStyle);
                }
                else {
                    el.setAttribute('style', 'display:none');
                }
            }
        };
        Fullscreen.prototype.getFullScreenHtml = function () {
            var h = {
                tag: 'div',
                attrib: {
                    id: this.lDivFsId,
                    style: 'display:none;'
                },
                children: [{
                        tag: 'div',
                        attrib: {
                            id: this.lDivTitleId,
                            style: this.getTitleStyle(),
                            class: this.getTitleClasses()
                        }
                    },
                    {
                        tag: 'div',
                        attrib: {
                            id: this.lDivFsInnerId,
                            style: this.getDivFsInnerStyle()
                        },
                        children: [{
                                tag: 'iframe',
                                attrib: {
                                    id: this.lIframeId,
                                    src: 'about:blank',
                                    style: "top:0;left:0;right:0;bottom:0;overflow:auto;-webkit-overflow-scrolling:touch;width:100%;height:100%;"
                                }
                            }]
                    }]
            };
            return elementsCreate(h);
        };
        Fullscreen.prototype.getTitleStyle = function () {
            if (this.lConfig.fullScreenDisplayTitle === true) {
                return "position:relative;text-align:center;display:block;width:100%;";
            }
            return 'display:none;';
        };
        Fullscreen.prototype.getDivFsInnerStyle = function () {
            var style = "-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;";
            if (this.lConfig.fullscreenPadding > 0) {
                var pad = this.lConfig.fullscreenPadding;
                switch (this.lConfig.fullscreenPaddingType) {
                    case 'px':
                        style += "padding-left:" + pad + "px;padding-right:" + pad + "px;";
                        break;
                    case 'em':
                        style += "padding-left:" + pad + "em;padding-right:" + pad + "em;";
                        break;
                    default:
                        if (pad > 45) {
                            pad = 45;
                        }
                        style += "padding-left:" + pad + "%;padding-right:" + pad + "%;";
                        break;
                }
            }
            return style;
        };
        Fullscreen.prototype.getTitleText = function () {
            var jqEl = $(this.lNoteTitleSel);
            if (jqEl.length === 0) {
                Log.warn(appSettings.shortName + ": Element for Evernote Title was not found");
                return '';
            }
            return jqEl.val() + '';
        };
        Fullscreen.prototype.getTitleClasses = function () {
            if (this.lConfig.fullScreenDisplayTitle === false) {
                return '';
            }
            var jqEl = $(this.lNoteTitleSel);
            if (jqEl.length === 0) {
                Log.warn(appSettings.shortName + ": Element for Evernote Title was not found");
                return '';
            }
            return jqEl.attr('class') + '';
        };
        Fullscreen.prototype.getEvernoteParamByName = function (name, url) {
            if (!url) {
                url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[#&]' + name + '(=([^&#]*)|&|$)');
            var results = regex.exec(url);
            if (!results) {
                return '';
            }
            if (!results[2]) {
                return '';
            }
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        };
        Fullscreen.prototype.getIframeSrc = function () {
            var n = this.getEvernoteParamByName('n');
            var strUrl = __EVERNOTE_ACTIONBEAN__.thriftEndpointBuilderConfig.shardUrlPrefix;
            strUrl += __EVERNOTE_ACTIONBEAN__.userShardId;
            strUrl += '/nl/';
            strUrl += __EVERNOTE_ACTIONBEAN__.currentUserId + '/';
            strUrl += n;
            strUrl += '?content=';
            return strUrl;
        };
        return Fullscreen;
    }());
    var ElementCssNode =  (function () {
        function ElementCssNode(args) {
            this.lArgs = args;
        }
        ElementCssNode.prototype.start = function () {
            if (this.lArgs.textContent.length === 0) {
                Log.warn("ElementCssNode.addCssNode: Not content for css injection. Empty style element will be created.");
            }
            var D = document;
            var scriptNode = D.createElement('style');
            scriptNode.type = 'text/css';
            scriptNode.textContent = this.lArgs.textContent;
            var targ;
            switch (this.lArgs.scriptLocation) {
                case ElementLocation.body:
                    targ = D.getElementsByTagName('body')[0] || D.body;
                    break;
                case ElementLocation.head:
                    targ = D.getElementsByTagName('head')[0] || D.head;
                    break;
                default:
                    targ = D.getElementsByTagName('body')[0] || D.body || D.documentElement;
                    break;
            }
            targ.appendChild(scriptNode);
        };
        return ElementCssNode;
    }());

    var validateIfTop = function () {
        return window.top === window.self;
    };
    var main = function (tb) {
        var fs = new Fullscreen();
        tb.onButtonClick().subscribe(function (sender, args) {
            fs.requestFullscreen();
        });
    };
    if (validateIfTop()) {
        $(document).ready(function () {
            var elBtn = new ElementCssNode({
                scriptLocation: ElementLocation.body,
                textContent: "div#bb_btn_en_pv_child{background:rgba(0,0,0,0) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAABCklEQVR42mNgoCJgAmJWJMyERQ0jmhpmdAV+QPwVCd8CYkEkeZCGnWhqqtANCQTi/0D8D4inArE3FptsgLgWiL9D1dZjM+QPEB8D4mdAbI7FO3JAfB6IbwPxU2yGgLzzA4jloc4GGaSNJC8MxOeA+BoQa0LZNeiG8AGxLzRAQWExC4jNkOQlgXgJEKtA+XZQlw0RwAxNF8iAhZAmCSDOhyoE+XU3EDsjySsC8VForIEMjwZiPXRDAoD4FxDrQKPxGjSmYIAXiHdAY80WiC8AcR22dPIXmlKvI8UCMhCERv8rIH6NK7HBUiwoKnOAmA0t30QA8RR8KdYF6gIY3g1NO8gBPQ9NTfbgSw8AJPU70zS+7cQAAAAASUVORK5CYII=);width:17px;height:17px;background-size:17px 17px;background-repeat:no-repeat;background-position-x:0;background-position-y:0;background-attachment:scroll;overflow:hidden}div#bb_btn_en_pv_child:hover{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAABjElEQVR42mNgoBqokWcGYi4kzIKhplqeCU0NK6qCJTpBDCt0v8HxEp3nDFPUxODy9QqsDIu1j6KomavZi25IGFDiPxgv0FrKME8rjKFTGdWm2ZruDAu1uhmW6fwFq5urNRnTkOVAicXal4GK3jHM0HDB8M50dTWGJdp3wK5cqvMe05DF2sFAzf8YpmuoA9nHgey3QE3mcPlp6hJA8dtAzQ8ZpqqbAQ26DfTOBFRDJqoKM8zSiGXoVWVmmKAqAfTSGhTXTFdXAIptY5ipoQsMH0Yg7QsMM3WGIQLqFdgY6uQZUcQaFNjxa5qmIQeM1npg2LCBY2Gx9glgGAXB5WdoaAID8wI4nBoUmIBqM4DhYokexSHgKJ6lYQqORlAsTFPXgMtPVhNiWKR9DBxr09T9gJbcBcbOJOzpZInOM7ABM4CxgA5AsQaK/qU6n4D4C/bEBkux87T2ABXUMvSocMLlQeEzVzMNiNcAXfMHe4qdp+XHsFD7NRzP17oMTFRCKHlngdZGFDUzNVoGX4oAAHLMocmSO/IzAAAAAElFTkSuQmCC)}"
            });
            elBtn.start();
            var tb = new ToolbarButton(appSettings.buttonId);
            tb.init();
            var iv = new IntervalManual(500, 30);
            iv.onTick().subscribe(function (sender, args) {
                if ($("#" + appSettings.buttonId).length === 1) {
                    iv.dispose();
                    main(tb);
                }
                else {
                    tb.init();
                }
            });
            iv.onExpired().subscribe(function (sender, args) {
                iv.dispose();
                Log.message(appSettings.shortName + ": Unable to find injected button");
            });
            iv.start();
        });
        var gConfig = new GmConfig();
        gConfig.init();
        if (typeof GM_registerMenuCommand === 'function') {
            Log.message(appSettings.shortName + ': Entry Script: Registering: Open ' + appSettings.shortName + ' Options Menu');
            GM_registerMenuCommand(appSettings.menuName, function () {
                GM_config.open();
                Log.message(appSettings.shortName + ': Entry Script: Registered: Open ' + appSettings.shortName + ' Options Menu');
            });
        }
        else {
            Log.warn(appSettings.shortName + "': Entry Script: Unable to Register: Open " + appSettings.shortName + " Options Menu: GM_registerMenuCommand not found!");
        }
    }

}($));

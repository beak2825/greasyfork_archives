// ==UserScript==
// @name            Evernote Full Screen View
// @namespace       https://github.com/Amourspirit/Evernote-Fullscreen
// @version         1.2.0
// @description     Adds a full screen option to view Evernote Notes in view mode.
// @author          Paul Moss
// @run-at          document-end
// @include         /^https?:\/\/www\.evernote\.com\/shard\/[a-z0-9]+\/nl\/.*$/
// @include         /^https?:\/\/www\.evernote\.com\/shard\/[a-z0-9]+\/client\/snv\?.*$/
// @include         /^https?:\/\/app\.yinxiang\.com\/shard\/[a-z0-9]+\/nl\/.*$/
// @include         /^https?:\/\/app\.yinxiang\.com\/shard\/[a-z0-9]+\/client\/snv\?.*$/
// @match           https://www.evernote.com/shard/*
// @match           https://app.yinxiang.com/shard/*
// @noframes
// @homepageURL     https://github.com/Amourspirit/Evernote-Fullscreen
// @update          https://github.com/Amourspirit/Evernote-Fullscreen/raw/master/dist/EvernoteFullscreenView.user.js
// @contributionURL https://bit.ly/1QIN2Cs
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/380500/Evernote%20Full%20Screen%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/380500/Evernote%20Full%20Screen%20View.meta.js
// ==/UserScript==
(function () {
    'use strict';


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
        shortName: 'ENFS',
        buttonPlacementSelector: 'body',
        buttonId: 'enote-btn-id',
        iframeSelector: '#container iframe',
        fsIframeID: 'enote-iframe-id'
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
    var utilFnAsStringExist = function (fnstring) {
        var fn = window[fnstring];
        if (typeof fn === 'function') {
            return true;
        }
        else {
            return false;
        }
    };
    var utilCreateElement = function (tag) {
        var D = document;
        var node = D.createElement(tag);
        return node;
    };

    var elementAddToDoc = function (e, nodeLocation) {
        var D = document;
        var targ;
        switch (nodeLocation) {
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
        targ.appendChild(e);
    };
    var elementCreate = function (args) {
        var htmlNode = utilCreateElement(args.elementTag); // D.createElement('script');
        if (args.elementAttributes) {
            for (var key in args.elementAttributes) {
                if (args.elementAttributes.hasOwnProperty(key)) {
                    var value = args.elementAttributes[key];
                    htmlNode.setAttribute(key, value);
                }
            }
        }
        if (args.elementText && args.elementText.length > 0) {
            htmlNode.textContent = args.elementText;
        }
        return htmlNode;
    };
    var BaseEvernoteFullscreen =  (function () {
        function BaseEvernoteFullscreen() {
            var _this = this;
            this.inFullScreen = false;
            this.fullScreenChange = function () {
                if (document.fullscreenEnabled ||
                    document.webkitIsFullScreen ||
                    document.mozFullScreen ||
                    document.msFullscreenElement) {
                    _this.inFullScreen = !_this.inFullScreen;
                }
                else {
                }
                _this.toggleDisplay();
            };
        }
        BaseEvernoteFullscreen.prototype.init = function () {
            this.addDoucmentEvent();
        };
        BaseEvernoteFullscreen.prototype.toggleDisplay = function () {
            throw new Error('Must be overriden in extended classes');
        };
        BaseEvernoteFullscreen.prototype.addDoucmentEvent = function () {
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
        return BaseEvernoteFullscreen;
    }());
    var EvernoteFsPrivate =  (function (_super) {
        __extends(EvernoteFsPrivate, _super);
        function EvernoteFsPrivate() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EvernoteFsPrivate.prototype.init = function () {
            _super.prototype.init.call(this);
            this.injectButton();
            this.injectIframe();
            this.addBtnClick();
        };
        EvernoteFsPrivate.prototype.toggleDisplay = function () {
            var fsIframe = document.getElementById(appSettings.fsIframeID);
            if (!fsIframe) {
                return;
            }
            if (this.inFullScreen === true) {
                var ifrmElment = document.querySelector(appSettings.iframeSelector);
                if (!ifrmElment) {
                    return;
                }
                var ifrmSrc = ifrmElment.getAttribute('src');
                if (fsIframe !== null) {
                    fsIframe.setAttribute('class', 'enfs-if-show');
                    fsIframe.setAttribute('src', ifrmSrc || '');
                }
            }
            else {
                if (fsIframe !== null) {
                    fsIframe.setAttribute('class', 'enfs-if-noshow');
                    fsIframe.setAttribute('src', '');
                }
            }
        };
        EvernoteFsPrivate.prototype.injectButton = function () {
            var divBtnHolder = jQ(appSettings.buttonPlacementSelector);
            if (!divBtnHolder.length) {
                Log.error(appSettings.shortName + " could not find where to place button: selector: " + appSettings.buttonPlacementSelector);
                return;
            }
            var btnHtml = this.getButton();
            divBtnHolder.append(btnHtml);
        };
        EvernoteFsPrivate.prototype.injectIframe = function () {
            var divBtnHolder = jQ(appSettings.buttonPlacementSelector);
            if (!divBtnHolder.length) {
                Log.error(appSettings.shortName + " could not find where to place button: selector: " + appSettings.buttonPlacementSelector);
                return;
            }
            var ifrm = this.getIFrame();
            divBtnHolder.append(ifrm);
        };
        EvernoteFsPrivate.prototype.getButton = function () {
            var innerSpan = elementCreate({
                elementTag: 'span',
                elementAttributes: {
                    class: 'enfs-btntooltip'
                },
                elementText: 'Click to open note in full screen view'
            });
            var btnDiv = elementCreate({
                elementTag: 'div',
                elementAttributes: {
                    id: appSettings.buttonId,
                    class: 'enfs-button-priv'
                }
            });
            btnDiv.appendChild(innerSpan);
            return btnDiv;
        };
        EvernoteFsPrivate.prototype.getIFrame = function () {
            var ifrm = elementCreate({
                elementTag: 'iframe',
                elementAttributes: {
                    id: appSettings.fsIframeID,
                    class: 'enfs-if-noshow',
                    scrolling: 'yes',
                    frameborder: '0',
                    src: ''
                }
            });
            return ifrm;
        };
        EvernoteFsPrivate.prototype.addBtnClick = function () {
            var intTick = new IntervalManual(500, 30);
            intTick.onTick().subscribe(function () {
                var divBtn = jQ("#" + appSettings.buttonId);
                if (!divBtn.length) {
                    Log.message("try no: " + intTick.count + " looking for button: " + appSettings.buttonId);
                    return;
                }
                Log.message("Found button " + appSettings.buttonId + " on try " + intTick.count);
                intTick.dispose();
                divBtn.on('click', function () {
                    var fsIframe = document.getElementById(appSettings.fsIframeID);
                    if (!fsIframe) {
                        return;
                    }
                    if (fsIframe.requestFullscreen) {
                        fsIframe.requestFullscreen();
                    }
                    else if (fsIframe.webkitRequestFullscreen) {
                        fsIframe.webkitRequestFullscreen();
                    }
                    else if (fsIframe.mozRequestFullScreen) {
                        fsIframe.mozRequestFullScreen();
                    }
                    else if (fsIframe.msRequestFullscreen) {
                        fsIframe.msRequestFullscreen();
                    }
                });
            });
            intTick.onExpired().subscribe(function () {
                Log.warn("Unable to find button " + appSettings.buttonId);
            });
            intTick.start();
        };
        return EvernoteFsPrivate;
    }(BaseEvernoteFullscreen));
    var BaseElementLoad =  (function (_super) {
        __extends(BaseElementLoad, _super);
        function BaseElementLoad(interval, maxCount) {
            if (interval === void 0) { interval = 500; }
            if (maxCount === void 0) { maxCount = 30; }
            var _this = _super.call(this, interval, maxCount) || this;
            _this.ptIsLoaded = false;
            _this.edOnScriptAdded = new dist_1$1();
            return _this;
        }
        BaseElementLoad.prototype.onScriptLoaded = function () {
            return this.edOnScriptAdded.asEvent();
        };
        BaseElementLoad.prototype.fnAsStringExist = function (fnstring) {
            return utilFnAsStringExist(fnstring);
        };
        return BaseElementLoad;
    }(IntervalManual));

    var ElementJsNode =  (function (_super) {
        __extends(ElementJsNode, _super);
        function ElementJsNode(args) {
            var _this = _super.call(this) || this;
            var textContent = args && args.textContent || '';
            var src = args && args.src || '';
            _this.lTestFuncton = args && args.tyepName || '';
            if (textContent.length + src.length === 0) {
                throw new Error('src or textContent muse included in the args');
            }
            var eArgs = {
                elementTag: 'script',
                elementText: args.textContent,
                elementAttributes: {
                    src: (args.src || ''),
                    type: 'text/javascript'
                }
            };
            var eHtml = elementCreate(eArgs); // this.elementCreateScript(eArgs);
            var functionToRun = args && args.functionToRun || '';
            if (functionToRun.length > 0) {
                eHtml.addEventListener('load', function () {
                    var functionHtml = elementCreate({
                        elementTag: 'script',
                        elementText: functionToRun,
                        elementAttributes: {
                            type: 'text/javascript'
                        }
                    }); // document.createElement('script');
                    elementAddToDoc(functionHtml, args.scriptLocation);
                });
            }
            elementAddToDoc(eHtml, args.scriptLocation);
            return _this;
        }
        ElementJsNode.prototype.onTickTock = function (eventArgs) {
            if (this.lTestFuncton.length > 0) {
                if (this.fnAsStringExist(this.lTestFuncton) === true) {
                    this.edOnScriptAdded.dispatch(this, eventArgs);
                    this.dispose();
                }
                else {
                    this.edOnScriptAdded.dispatch(this, eventArgs);
                    this.dispose();
                }
            }
            else {
                this.edOnScriptAdded.dispatch(this, eventArgs);
                this.dispose();
            }
        };
        ElementJsNode.prototype.onTickExpired = function (eventArgs) {
            return;
        };
        return ElementJsNode;
    }(BaseElementLoad));
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
    var EvernoteFsPubilc =  (function (_super) {
        __extends(EvernoteFsPubilc, _super);
        function EvernoteFsPubilc() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.lprevSet = {
                class: '',
                scrolling: 'yes',
                style: '',
                frameborder: '0'
            };
            return _this;
        }
        EvernoteFsPubilc.prototype.init = function () {
            _super.prototype.init.call(this);
            this.injectButton();
            this.addBtnClick();
        };
        EvernoteFsPubilc.prototype.toggleDisplay = function () {
            var ifrmElment = document.querySelector(appSettings.iframeSelector);
            if (!ifrmElment) {
                return;
            }
            if (this.inFullScreen === true) {
                this.lprevSet.class = ifrmElment.getAttribute('class') || '';
                this.lprevSet.scrolling = ifrmElment.getAttribute('scrolling') || '';
                this.lprevSet.style = ifrmElment.getAttribute('style') || '';
                this.lprevSet.frameborder = ifrmElment.getAttribute('frameborder') || '';
                ifrmElment.setAttribute('class', 'enfs-if-show');
                ifrmElment.setAttribute('scrolling', 'yes');
                ifrmElment.setAttribute('style', '');
                ifrmElment.setAttribute('frameborder', '0');
            }
            else {
                ifrmElment.setAttribute('class', this.lprevSet.class);
                ifrmElment.setAttribute('scrolling', this.lprevSet.scrolling);
                ifrmElment.setAttribute('style', this.lprevSet.style);
                ifrmElment.setAttribute('frameborder', this.lprevSet.frameborder);
            }
        };
        EvernoteFsPubilc.prototype.injectButton = function () {
            var divBtnHolder = jQ(appSettings.buttonPlacementSelector);
            if (!divBtnHolder.length) {
                Log.error(appSettings.shortName + " could not find where to place button: selector: " + appSettings.buttonPlacementSelector);
                return;
            }
            var btnHtml = this.getButton();
            divBtnHolder.append(btnHtml);
        };
        EvernoteFsPubilc.prototype.getButton = function () {
            var innerSpan = elementCreate({
                elementTag: 'span',
                elementAttributes: {
                    class: 'enfs-btntooltip'
                },
                elementText: 'Click to open note in full screen view'
            });
            var btnDiv = elementCreate({
                elementTag: 'div',
                elementAttributes: {
                    id: appSettings.buttonId,
                    class: 'enfs-button-pub'
                }
            });
            btnDiv.appendChild(innerSpan);
            return btnDiv;
        };
        EvernoteFsPubilc.prototype.addBtnClick = function () {
            var intTick = new IntervalManual(500, 30);
            intTick.onTick().subscribe(function () {
                var divBtn = jQ("#" + appSettings.buttonId);
                if (!divBtn.length) {
                    Log.message("try no: " + intTick.count + " looking for button: " + appSettings.buttonId);
                    return;
                }
                Log.message("Found button " + appSettings.buttonId + " on try " + intTick.count);
                intTick.dispose();
                divBtn.on('click', function () {
                    var ifrmElment = document.querySelector(appSettings.iframeSelector);
                    if (!ifrmElment) {
                        return;
                    }
                    if (ifrmElment !== null) {
                        if (ifrmElment.requestFullscreen) {
                            ifrmElment.requestFullscreen();
                        }
                        else if (ifrmElment.webkitRequestFullscreen) {
                            ifrmElment.webkitRequestFullscreen();
                        }
                        else if (ifrmElment.mozRequestFullScreen) {
                            ifrmElment.mozRequestFullScreen();
                        }
                        else if (ifrmElment.msRequestFullscreen) {
                            ifrmElment.msRequestFullscreen();
                        }
                    }
                });
            });
            intTick.onExpired().subscribe(function () {
                Log.warn("Unable to find button " + appSettings.buttonId);
            });
            intTick.start();
        };
        return EvernoteFsPubilc;
    }(BaseEvernoteFullscreen));

    var validateIfTop = function () {
        return window.top === window.self;
    };
    var main = function () {
        Log.message(appSettings.shortName + ': Start loading...');
        var url = window.location.href;
        if (url.indexOf('/client/') > 0) {
            Log.debug('found client in url');
            var enPub = new EvernoteFsPubilc();
            enPub.init();
        }
        else {
            Log.debug('client not found in url');
            var enPriv = new EvernoteFsPrivate();
            enPriv.init();
        }
        Log.message(appSettings.shortName + ': End loading...');
    };
    if (validateIfTop()) {
        var elBtn = new ElementCssNode({
            scriptLocation: ElementLocation.body,
            textContent: ".enfs-button-priv::after,.enfs-button-pub::after{content:\"\";background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACk0lEQVR42mNgGAWjYBSMUFAlx8RQI69IJJanyK5qOS4S7BIjzfAaeVmGFbr/icYLtH4zNClmkOyJXpXjDEt1iLdnktp92noEhGdqfCTJjnoFV5LtoItHpqu/JcmOOnnzgfXIciBerP0PBc/QeA8MYTeSk1aH8mKGeVo/UcxaovOPfh5pVeqhSSEDyvhT1B7TL2nRwjMQTzyhbdICOXyZDu08g8sT6CUaxR4BpdtWpS6aeAaXJ+Zq/mBoV5pLfY+AALU9g88TtfJaDC2KDbTxCH7P9FHVEyBABY9IoxiwGMkj+DzTrFhOtB2T1O7h9QRVPAICoGYHzIAZGh8w5LF5ZqbGJ7JrdXRPYFPXrbKHdI80KiSBPTBd/Q3YQGygVakbxTNT1V8SZXatvCE4BvF5AgbalRYyzNb8yjBR9SZDtbwI7VrKTYrF4HbWVPUXwGaHPdH62pQmMczS+AxMLneBntAY7XKMglEwCkbBKBgFgwY0KIQCa3UbElu/LOBmEK6mCZUdGAJsZznjbYpPVnsAb/22K80j0hNs4AELWC8Q1GbDrZYH6OEU8j3cp3oW3qjrVN5AVH9ituY3IhuksUR1zqrl+BhmaX6B94lAMUhyp2c52kgiMZ2iycAREOJavzoY/XFsnmlSLERRM0H1OvV6iPh7dsS3YonpNtOsq0tM95QUQMgzNPEItT1BjGdo4hFaeIKQZyaq3ab9IDa1PIHPMzQfMqW2J4j1DFU9ArKoQ3kleBwLgnuAlaYHmQN0fMAitgDJrD6wYwd0fqRDeRmJnmADDx8NuokeYmt1RPMnfHDOWE1Uu0myHfgmdajiEdBAGKi5QRx+BBwB3EXW4BkoVvpVLxNtV6fy2tGuxigYBaNg+AAAZ7k6IXnaMaQAAAAASUVORK5CYII=);background-size:cover;opacity:.4;top:0;left:0;bottom:0;right:0;position:absolute;z-index:100;-webkit-filter:grayscale(1);filter:grayscale(1)}.enfs-button-priv{width:50px;height:50px;position:absolute;top:0;left:160px;z-index:101}.enfs-button-priv:hover{cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0);-webkit-filter:drop-shadow(4px 4px 4px #5c5c5c);filter:drop-shadow(4px 4px 4px #5c5c5c)}.enfs-button-priv:hover::after{content:\"\";cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0)}.enfs-button-priv .enfs-btntooltip{visibility:hidden;width:120px;background-color:#08ab33;color:#fff;text-align:center;border-radius:6px;padding:5px 0;position:absolute;z-index:1;top:115%;left:50%;margin-left:-60px;opacity:0;transition:opacity 1s}.enfs-button-priv:hover .enfs-btntooltip{visibility:visible;opacity:1}.enfs-button-priv .enfs-btntooltip::after{content:\"\";position:absolute;bottom:100%;left:50%;margin-left:-5px;border-width:5px;border-style:solid;border-color:transparent transparent #08ab33 transparent}.enfs-button-pub{width:36px;height:36px;position:fixed;top:20px;left:200px;z-index:101}.enfs-button-pub:hover{cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0);-webkit-filter:drop-shadow(4px 4px 4px #5c5c5c);filter:drop-shadow(4px 4px 4px #5c5c5c)}.enfs-button-pub:hover::after{content:\"\";cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0)}.enfs-button-pub .enfs-btntooltip{visibility:hidden;width:120px;background-color:#08ab33;color:#fff;text-align:center;border-radius:6px;padding:5px 0;position:absolute;z-index:1;top:115%;left:50%;margin-left:-60px;opacity:0;transition:opacity 1s}.enfs-button-pub:hover .enfs-btntooltip{visibility:visible;opacity:1}.enfs-button-pub .enfs-btntooltip::after{content:\"\";position:absolute;bottom:100%;left:50%;margin-left:-5px;border-width:5px;border-style:solid;border-color:transparent transparent #08ab33 transparent}.enfs-if-noshow{margin:0;width:0;height:0;display:none}.enfs-if-show{display:block;border:0;background-color:#fff;object-fit:contain;position:fixed;top:0;right:0;bottom:0;left:0;box-sizing:border-box;min-width:0;max-width:none;min-height:0;max-height:none;width:100%;height:100%;transform:none;margin:0}"
        });
        elBtn.start();
        var loadJs = new ElementJsNode({
            scriptLocation: ElementLocation.body,
            functionToRun: 'window.jQ=jQuery.noConflict(true);',
            tyepName: 'jQ',
            src: '//cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js'
        });
        loadJs.onTick().subscribe(function (sender, args) {
            Log.message("ScriptJsNode Tick " + args.count);
        });
        loadJs.onExpired().subscribe(function (sender, args) {
            Log.message("ScriptJsNode Tick Expired " + args.count);
        });
        loadJs.onScriptLoaded().subscribe(function (sender, args) {
            Log.message("ScriptJsNode Found Script for jquery count was " + args.count);
            main();
        });
        loadJs.start();
    }

}());

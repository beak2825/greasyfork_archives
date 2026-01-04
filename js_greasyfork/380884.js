// ==UserScript==
// @name            Zen for www.memozor.com games
// @namespace       https://github.com/Amourspirit/memozor-zen
// @version         1.1.3
// @description     Userscript that allows clean fullscreen game play at memozor.com
// @author          Paul Moss
// @run-at          document-end
// @include         /^https?:\/\/www\.memozor\.com\/.*$/
// @include         /^https?:\/\/memozor\.com\/.*$/
// @noframes
// @license         MIT
// @homepageURL     https://github.com/Amourspirit/memozor-zen/
// @update          https://github.com/Amourspirit/memozor-zen/raw/master/dist/zen-www-memozor-com.user.js
// @contributionURL https://bit.ly/1QIN2Cs
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/380884/Zen%20for%20wwwmemozorcom%20games.user.js
// @updateURL https://update.greasyfork.org/scripts/380884/Zen%20for%20wwwmemozorcom%20games.meta.js
// ==/UserScript==
(function ($) {
    'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

    var PriorityLevel;
    (function (PriorityLevel) {
        PriorityLevel[PriorityLevel["none"] = 0] = "none";
        PriorityLevel[PriorityLevel["now"] = 1] = "now";
        PriorityLevel[PriorityLevel["med"] = 2] = "med";
        PriorityLevel[PriorityLevel["high"] = 3] = "high";
    })(PriorityLevel || (PriorityLevel = {}));
    var DebugLevel;
    (function (DebugLevel) {
        DebugLevel[DebugLevel["debug"] = 0] = "debug";
        DebugLevel[DebugLevel["error"] = 1] = "error";
        DebugLevel[DebugLevel["warn"] = 2] = "warn";
        DebugLevel[DebugLevel["info"] = 3] = "info";
        DebugLevel[DebugLevel["none"] = 4] = "none";
    })(DebugLevel || (DebugLevel = {}));
    var ElementLocation;
    (function (ElementLocation) {
        ElementLocation[ElementLocation["head"] = 0] = "head";
        ElementLocation[ElementLocation["body"] = 1] = "body";
        ElementLocation[ElementLocation["other"] = 2] = "other";
    })(ElementLocation || (ElementLocation = {}));

    var appSettings = {
        debugLevel: DebugLevel.none,
        buttonId: 'fsmc-btn',
        shortName: 'fsmc',
        preKey: 'fsmc_',
        gameBoardSelector: 'div#game',
        buttonPlacementSelector: 'body',
        controlSelector: 'div#control'
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

    var ElementLoaderEventArgs =  (function (_super) {
        __extends(ElementLoaderEventArgs, _super);
        function ElementLoaderEventArgs(key, elmArgs) {
            var _this = _super.call(this) || this;
            _this.loadFailed = false;
            _this.lInterval = 0;
            _this.lCount = 0;
            _this.lkey = key;
            _this.elementArgs = elmArgs;
            _this.lCount = elmArgs.count;
            _this.lInterval = elmArgs.interval;
            return _this;
        }
        Object.defineProperty(ElementLoaderEventArgs.prototype, "count", {
            get: function () {
                return this.lCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementLoaderEventArgs.prototype, "key", {
            get: function () {
                return this.lkey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementLoaderEventArgs.prototype, "interval", {
            get: function () {
                return this.lInterval;
            },
            enumerable: true,
            configurable: true
        });
        return ElementLoaderEventArgs;
    }(EventArgs));
    var ElementsLoadedArgs =  (function (_super) {
        __extends(ElementsLoadedArgs, _super);
        function ElementsLoadedArgs(numOfScripts) {
            var _this = _super.call(this) || this;
            _this.lTotalScripts = 0;
            _this.lTotalScripts = numOfScripts;
            return _this;
        }
        Object.defineProperty(ElementsLoadedArgs.prototype, "totalNumberOfScripts", {
            get: function () {
                return this.lTotalScripts;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsLoadedArgs;
    }(EventArgs));
    var ElementsLoadFailArgs =  (function (_super) {
        __extends(ElementsLoadFailArgs, _super);
        function ElementsLoadFailArgs(numOfScripts, remainingScripts) {
            var _this = _super.call(this, numOfScripts) || this;
            _this.lRemainingEvents = remainingScripts;
            return _this;
        }
        Object.defineProperty(ElementsLoadFailArgs.prototype, "remainingEvents", {
            get: function () {
                return this.lRemainingEvents;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsLoadFailArgs;
    }(ElementsLoadedArgs));

    var ElementLoader =  (function () {
        function ElementLoader() {
            this.lTotalScripts = 0; 
            this.lEventsFailed = [];
            this.lOnElementLoaded = new dist_5();
            this.lOnAllElementLoaded = new dist_5();
            this.lOnElementLoadFail = new dist_5();
            this.lOnTick = new dist_5();
            this.lOnTickExpired = new dist_5();
            this.lEvents = {};
        }
        ElementLoader.prototype.addElement = function (key, e) {
            if (key.length === 0) {
                Log.error(appSettings.shortName + ": addElement: key argument can not be an empty string");
                return;
            }
            if (this.lEvents.hasOwnProperty(key)) {
                Log.error(appSettings.shortName + ": addElement: key " + key + " is already in the list of elemets and can not be added again");
                return;
            }
            this.lEvents[key] = e;
            this.lTotalScripts++;
        };
        ElementLoader.prototype.hasElement = function (key) {
            if (key.length === 0) {
                Log.debugWarn(appSettings.shortName + ": addElement: key is empty");
                return false;
            }
            var reslut = this.lEvents.hasOwnProperty(key);
            return reslut;
        };
        ElementLoader.prototype.onAllElementsLoaded = function () {
            return this.lOnAllElementLoaded.asEvent();
        };
        ElementLoader.prototype.onElementsLoadFail = function () {
            return this.lOnElementLoadFail.asEvent();
        };
        ElementLoader.prototype.onElementLoaded = function () {
            return this.lOnElementLoaded.asEvent();
        };
        ElementLoader.prototype.onTick = function () {
            return this.lOnTick.asEvent();
        };
        ElementLoader.prototype.onTickExpired = function () {
            return this.lOnTickExpired.asEvent();
        };
        ElementLoader.prototype.start = function () {
            var _this = this;
            var onBeforeStartEventArgs = new EventArgs();
            this.onBeforeStart(onBeforeStartEventArgs);
            if (onBeforeStartEventArgs.cancel === true) {
                return;
            }
            var _loop_1 = function (key) {
                if (this_1.lEvents.hasOwnProperty(key)) {
                    var element = this_1.lEvents[key];
                    element.onTick().subscribe(function (sender, args) {
                        var eArgs = new ElementLoaderEventArgs(key, args);
                        _this.tick(eArgs);
                        if (eArgs.cancel === true) {
                            return;
                        }
                        _this.lOnTick.dispatch(_this, eArgs);
                    });
                    element.onExpired().subscribe(function (sender, args) {
                        var eArgs = new ElementLoaderEventArgs(key, args);
                        sender.dispose();
                        _this.tickExpired(eArgs);
                        if (eArgs.cancel === true) {
                            return;
                        }
                        _this.lOnTickExpired.dispatch(_this, eArgs);
                    });
                    element.onElementLoaded().subscribe(function (sender, args) {
                        var eArgs = new ElementLoaderEventArgs(key, args);
                        sender.dispose();
                        _this.elementLoaded(eArgs);
                        if (eArgs.cancel === true) {
                            return;
                        }
                        _this.lOnElementLoaded.dispatch(_this, eArgs);
                    });
                    element.start();
                }
            };
            var this_1 = this;
            for (var key in this.lEvents) {
                _loop_1(key);
            }
            this.onAfterStart(new EventArgs());
        };
        ElementLoader.prototype.dispose = function () {
            for (var key in this.lEvents) {
                if (this.lEvents.hasOwnProperty(key)) {
                    var el = this.lEvents[key];
                    if (el.isDisposed === false) {
                        el.dispose();
                    }
                }
            }
            this.lEvents = {};
        };
        ElementLoader.prototype.onBeforeStart = function (args) {
            return;
        };
        ElementLoader.prototype.onAfterStart = function (args) {
            return;
        };
        ElementLoader.prototype.elementLoaded = function (args) {
            if (this.lEvents.hasOwnProperty(args.key) === false) {
                Log.error(appSettings.shortName + ": elementLoaded: key " + args.key + " was not found to delete. This may be a serious error");
                return;
            }
            else {
                delete this.lEvents[args.key];
            }
            this.goForFinish();
        };
        ElementLoader.prototype.tick = function (args) {
            return;
        };
        ElementLoader.prototype.tickExpired = function (args) {
            args.loadFailed = true;
            this.lEventsFailed.push(args.key);
            if (this.lEvents.hasOwnProperty(args.key) === false) {
                Log.error(appSettings.shortName + ": tickExpired: key " + args.key + " was not found to delete. This may be a serious error");
                return;
            }
            else {
                delete this.lEvents[args.key];
            }
            this.goForFinish();
            return;
        };
        ElementLoader.prototype.allElementsLoaded = function (args) {
            if (this.lEventsFailed.length > 0) {
                args.cancel = true;
                var eArgs = new ElementsLoadFailArgs(this.lTotalScripts, this.lEventsFailed);
                this.lOnElementLoadFail.dispatch(this, eArgs);
            }
            return;
        };
        ElementLoader.prototype.goForFinish = function () {
            var done = this.isElementsLoaded();
            if (done) {
                var eArgs = new ElementsLoadedArgs(this.lTotalScripts);
                this.allElementsLoaded(eArgs);
                if (eArgs.cancel === false) {
                    this.lOnAllElementLoaded.dispatch(this, eArgs);
                }
            }
            else {
            }
        };
        ElementLoader.prototype.isElementsLoaded = function () {
            for (var key in this.lEvents) {
                if (this.lEvents[key]) {
                    return false;
                }
            }
            return true;
        };
        return ElementLoader;
    }());

    var IntervalEventArgs =  (function (_super) {
        __extends(IntervalEventArgs, _super);
        function IntervalEventArgs(ticks, interval) {
            if (interval === void 0) { interval = 0; }
            var _this = _super.call(this) || this;
            _this.lCount = ticks;
            _this.lInterval = interval;
            return _this;
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
    }(EventArgs));
    var exceptionMessages = {
        argLessThenZero: 'Argument "{0}" must to be zero or greater',
        argLessThenOne: 'Argument "{0}" must be one or greater',
        argEmptyString: 'Argument "{0}" is not allowed to be an empty string',
        argKeyExist: 'Argument "{0}" invalid key. Key "{1}" already exist.'
    };

    Number.prototype.thousandsSeperator = function () {
        return Number(this).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    String.Format = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return str.replace(/{(\d+)}/g, function (match, index) { return args[index] || ''; });
    };
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
            if (this.lIntervalTime < 0) {
                throw new RangeError(String.Format(exceptionMessages.argLessThenZero, 'interval'));
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
    var utilFnArrayExist = function (fnArray) {
        if (fnArray.length === 0) {
            return true;
        }
        var result = true;
        for (var fn in fnArray) {
            if (fnArray.hasOwnProperty(fn)) {
                var testFn = fnArray[fn];
                result = result && utilFnAsStringExist(testFn);
            }
        }
        return result;
    };
    var utilCreateElement = function (tag) {
        var D = document;
        var node = D.createElement(tag);
        return node;
    };
    var BaseElementLoad =  (function (_super) {
        __extends(BaseElementLoad, _super);
        function BaseElementLoad(interval, maxCount) {
            if (interval === void 0) { interval = 500; }
            if (maxCount === void 0) { maxCount = 30; }
            var _this = _super.call(this, interval, maxCount) || this;
            _this.ptIsLoaded = false;
            _this.elementLoaded = new dist_1$1();
            return _this;
        }
        BaseElementLoad.prototype.onElementLoaded = function () {
            return this.elementLoaded.asEvent();
        };
        BaseElementLoad.prototype.fnAsStringExist = function (fnstring) {
            return utilFnAsStringExist(fnstring);
        };
        BaseElementLoad.prototype.fnArrayExist = function (fnArray) {
            return utilFnArrayExist(fnArray);
        };
        return BaseElementLoad;
    }(IntervalManual));

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
        var htmlNode = utilCreateElement(args.elementTag); 
        if (args.elementAttributes) {
            for (var key in args.elementAttributes) {
                if (args.elementAttributes.hasOwnProperty(key)) {
                    var value = args.elementAttributes[key];
                    htmlNode.setAttribute(key, value);
                }
            }
        }
        if (args.elementHtml && args.elementHtml.length > 0) {
            htmlNode.innerHTML = args.elementHtml;
        }
        if (args.elementText && args.elementText.length > 0) {
            htmlNode.textContent = args.elementText;
        }
        return htmlNode;
    };
    var elementsCreate = function (args) {
        var parentEl = elementCreate(args);
        if (args.childElements) {
            addElementRecursive(parentEl, args.childElements);
        }
        return parentEl;
    };
    var addElementRecursive = function (parentElement, args) {
        if (args && args.length > 0) {
            for (var i = 0; i < args.length; i++) {
                var el = args[i];
                var childEl = elementCreate(el);
                parentElement.appendChild(childEl);
                if (el.childElements) {
                    addElementRecursive(childEl, args[i].childElements);
                }
            }
        }
    };
    var ElementLoad =  (function (_super) {
        __extends(ElementLoad, _super);
        function ElementLoad(args) {
            var _this = _super.call(this, 0, 1) || this;
            _this.lArgs = args;
            return _this;
        }
        ElementLoad.prototype.onTickTock = function (eventArgs) {
            if (eventArgs.count > 1) {
                eventArgs.cancel = true;
                return;
            }
            if (this.lArgs.elementCreate.childElements) {
                var multiHtml = elementsCreate(this.lArgs.elementCreate);
                elementAddToDoc(multiHtml, this.lArgs.scriptLocation);
            }
            else {
                var eHtml = elementCreate(this.lArgs.elementCreate);
                elementAddToDoc(eHtml, this.lArgs.scriptLocation);
            }
            this.elementLoaded.dispatch(this, eventArgs);
            this.dispose();
        };
        ElementLoad.prototype.onTickExpired = function (eventArgs) {
            return;
        };
        return ElementLoad;
    }(BaseElementLoad));

    var MainElementLoader =  (function (_super) {
        __extends(MainElementLoader, _super);
        function MainElementLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainElementLoader.prototype.onBeforeStart = function (args) {
            if (args.cancel === true) {
                return;
            }
            this.addStyleCss();
        };
        MainElementLoader.prototype.addStyleCss = function () {
            this.addStyle('styleCss', this.getStyleCss(), ElementLocation.head);
        };
        MainElementLoader.prototype.getStyleCss = function () {
            var css = '.mem-fs-button::after{content:"";background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACk0lEQVR42mNgGAWjYBSMUFAlx8RQI69IJJanyK5qOS4S7BIjzfAaeVmGFbr/icYLtH4zNClmkOyJXpXjDEt1iLdnktp92noEhGdqfCTJjnoFV5LtoItHpqu/JcmOOnnzgfXIciBerP0PBc/QeA8MYTeSk1aH8mKGeVo/UcxaovOPfh5pVeqhSSEDyvhT1B7TL2nRwjMQTzyhbdICOXyZDu08g8sT6CUaxR4BpdtWpS6aeAaXJ+Zq/mBoV5pLfY+AALU9g88TtfJaDC2KDbTxCH7P9FHVEyBABY9IoxiwGMkj+DzTrFhOtB2T1O7h9QRVPAICoGYHzIAZGh8w5LF5ZqbGJ7JrdXRPYFPXrbKHdI80KiSBPTBd/Q3YQGygVakbxTNT1V8SZXatvCE4BvF5AgbalRYyzNb8yjBR9SZDtbwI7VrKTYrF4HbWVPUXwGaHPdH62pQmMczS+AxMLneBntAY7XKMglEwCkbBKBgFgwY0KIQCa3UbElu/LOBmEK6mCZUdGAJsZznjbYpPVnsAb/22K80j0hNs4AELWC8Q1GbDrZYH6OEU8j3cp3oW3qjrVN5AVH9ituY3IhuksUR1zqrl+BhmaX6B94lAMUhyp2c52kgiMZ2iycAREOJavzoY/XFsnmlSLERRM0H1OvV6iPh7dsS3YonpNtOsq0tM95QUQMgzNPEItT1BjGdo4hFaeIKQZyaq3ab9IDa1PIHPMzQfMqW2J4j1DFU9ArKoQ3kleBwLgnuAlaYHmQN0fMAitgDJrD6wYwd0fqRDeRmJnmADDx8NuokeYmt1RPMnfHDOWE1Uu0myHfgmdajiEdBAGKi5QRx+BBwB3EXW4BkoVvpVLxNtV6fy2tGuxigYBaNg+AAAZ7k6IXnaMaQAAAAASUVORK5CYII=);background-size:cover;opacity:.4;top:0;left:0;bottom:0;right:0;position:absolute;z-index:100;-webkit-filter:grayscale(1);filter:grayscale(1)}.mem-fs-button-parent{width:50px;height:50px;position:fixed;top:10px;right:10px;z-index:101}.mem-fs-button{position:absolute;top:0;left:0;right:0;bottom:0}.mem-fs-button:hover{cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0);-webkit-filter:drop-shadow(4px 4px 4px #d107c0);filter:drop-shadow(4px 4px 4px #d107c0)}.mem-fs-button:hover::after{content:"";cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0)}.mem-fs-button-parent .mem-fs-btntooltip{visibility:hidden;width:120px;background-color:#272822;color:#fff;text-align:center;border-radius:6px;padding:5px 0;position:absolute;z-index:1;top:2px;right:105%;opacity:0;transition:opacity 1s}.mem-fs-button-parent:hover .mem-fs-btntooltip{visibility:visible;opacity:1}.mem-fs-button-parent .mem-fs-btntooltip::after{content:"";position:absolute;top:50%;left:100%;margin-top:-5px;border-width:5px;border-style:solid;border-color:transparent transparent transparent #272822}.mem-fs-game{background-color:#8d6b15}.mem-fs-game-gobs{background-color:#e0d7e3}.mem-fs-game-sg{background-color:#000}.mem-fs-game-swg{background-color:#ede8ee}.mem-fs-no-sel{-webkit-user-select:none;user-select:none;-o-user-select:none;-webkit-touch-callout:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none}.mem-fs-wrap-ctl{background-color:brown}div.mem-fs-ctl{display:block;width:100%;text-align:center}div#mem-ctl-wrap div.mem-fs-ctl{display:inline-block;margin:0 0 10px 0}div.mem-fs-toggle-ctl{display:inline-block;width:100%;text-align:center}div.mem-fs-div-tog{display:inline-block}div.mem-fs-div-tog:hover{cursor:pointer}i.mem-fs-tog{border:solid #000;border-width:0 3px 3px 0;display:inline-block;padding:3px}i.mem-fs-tog.right{transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}i.mem-fs-tog.left{transform:rotate(135deg);-webkit-transform:rotate(135deg)}i.mem-fs-tog.up{transform:rotate(-135deg);-webkit-transform:rotate(-135deg)}i.mem-fs-tog.down{transform:rotate(45deg);-webkit-transform:rotate(45deg)}';
            return css;
        };
        MainElementLoader.prototype.addStyle = function (key, styelcontent, elementLocation) {
            if (elementLocation === void 0) { elementLocation = ElementLocation.head; }
            var elCss = new ElementLoad({
                scriptLocation: elementLocation,
                elementCreate: {
                    elementTag: 'style',
                    elementText: styelcontent,
                    elementAttributes: {
                        type: 'text/css'
                    }
                }
            });
            this.addElement(key, elCss);
        };
        return MainElementLoader;
    }(ElementLoader));
    var Fullscreen =  (function () {
        function Fullscreen() {
            var _this = this;
            this.inFullScreen = false;
            this.lWrapDivId = 'mem-fs-game-wrap';
            this.fullScreenChange = function () {
                if (document.fullscreenEnabled ||
                    document.webkitIsFullScreen ||
                    document.mozFullScreen ||
                    document.msFullscreenElement) {
                    _this.inFullScreen = !_this.inFullScreen;
                    _this.toggleClass();
                    _this.toggleDisplay();
                }
                else {
                }
            };
        }
        Fullscreen.prototype.init = function () {
            this.addDoucmentEvent();
            this.injectButton();
            this.addBtnClick();
        };
        Fullscreen.prototype.toggleDisplay = function () {
            var jqGameBoard = $(appSettings.gameBoardSelector);
            if (jqGameBoard.length !== 1) {
                return;
            }
        };
        Fullscreen.prototype.injectButton = function () {
            var divBtnHolder = $(appSettings.buttonPlacementSelector);
            if (!divBtnHolder.length) {
                Log.error(appSettings.shortName + " could not find where to place button: selector: " + appSettings.buttonPlacementSelector);
                return;
            }
            var btnHtml = this.getButton();
            divBtnHolder.append(btnHtml);
        };
        Fullscreen.prototype.getButton = function () {
            var htmlArgs = {
                elementTag: 'div',
                elementAttributes: {
                    class: 'mem-fs-button-parent'
                },
                childElements: [{
                        elementTag: 'div',
                        elementAttributes: {
                            id: appSettings.buttonId,
                            class: 'mem-fs-button'
                        }
                    },
                    {
                        elementTag: 'span',
                        elementAttributes: {
                            class: 'mem-fs-btntooltip'
                        },
                        elementText: 'Click to open game in full screen view'
                    }]
            };
            var btnDiv = elementsCreate(htmlArgs);
            return btnDiv;
        };
        Fullscreen.prototype.addBtnClick = function () {
            var _this = this;
            var intTick = new IntervalManual(500, 30);
            intTick.onTick().subscribe(function () {
                var divBtn = $("#" + appSettings.buttonId);
                if (!divBtn.length) {
                    Log.message("try no: " + intTick.count + " looking for button: " + appSettings.buttonId);
                    return;
                }
                Log.message("Found button " + appSettings.buttonId + " on try " + intTick.count);
                intTick.dispose();
                divBtn.on('click', function () {
                    var jqGameBoard = $(appSettings.gameBoardSelector);
                    if (jqGameBoard.length !== 1) {
                        return;
                    }
                    jqGameBoard.wrap(_this.getGameWrapper());
                    var gmBoard = $("#" + _this.lWrapDivId)[0];
                    if (gmBoard) {
                        if (gmBoard.requestFullscreen) {
                            gmBoard.requestFullscreen();
                        }
                        else if (gmBoard.webkitRequestFullscreen) {
                            gmBoard.webkitRequestFullscreen();
                        }
                        else if (gmBoard.mozRequestFullScreen) {
                            gmBoard.mozRequestFullScreen();
                        }
                        else if (gmBoard.msRequestFullscreen) {
                            gmBoard.msRequestFullscreen();
                        }
                    }
                });
            });
            intTick.onExpired().subscribe(function () {
                Log.warn("Unable to find button " + appSettings.buttonId);
            });
            intTick.start();
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
        Fullscreen.prototype.getGameWrapper = function () {
            var htmlArgs = {
                elementTag: 'div',
                elementAttributes: {
                    id: this.lWrapDivId,
                    class: "mem-fs-no-sel " + this.getWrapperBgClass()
                }
            };
            return elementsCreate(htmlArgs);
        };
        Fullscreen.prototype.getWrapperBgClass = function () {
            var loc = window.location.href;
            var result;
            if (loc.includes('grids-of-black-squares')
                || loc.includes('abacus-games')
                || loc.includes('grids-of-pictures')) {
                result = 'mem-fs-game-gobs';
            }
            else if (loc.includes('simon-games')) {
                result = 'mem-fs-game-sg';
            }
            else if (loc.includes('sight-word-games')) {
                result = 'mem-fs-game-swg';
            }
            else {
                result = 'mem-fs-game';
            }
            return result;
        };
        Fullscreen.prototype.toggleClass = function () {
            var elBoard = $(appSettings.gameBoardSelector);
            if (elBoard.length !== 1) {
                return;
            }
            if (this.inFullScreen === false) {
                elBoard.unwrap();
            }
        };
        return Fullscreen;
    }());

    var ControlToggle =  (function () {
        function ControlToggle() {
            this.lDivWrapId = 'mem-ctl-wrap';
            this.lDivtoggleId = 'mem-div-tog';
            this.lVisible = true;
        }
        ControlToggle.prototype.init = function () {
            if (this.controlExist() === true) {
                this.wrapControl();
                this.addControlClass();
                this.insertToggle();
                this.addOnClick();
            }
            else {
                Log.message("Selector " + appSettings.controlSelector + " is not found on this page");
            }
        };
        ControlToggle.prototype.addControlClass = function () {
            $(appSettings.controlSelector).addClass('mem-fs-ctl');
        };
        ControlToggle.prototype.addOnClick = function () {
            var _this = this;
            $("#" + this.lDivtoggleId).on('click', function () {
                _this.toggle();
            });
        };
        ControlToggle.prototype.controlExist = function () {
            return $(appSettings.controlSelector).length === 1;
        };
        ControlToggle.prototype.insertToggle = function () {
            var html = {
                elementTag: 'div',
                elementAttributes: {
                    id: this.lDivtoggleId,
                    class: 'mem-fs-div-tog'
                },
                childElements: [{
                        elementTag: 'i',
                        elementAttributes: {
                            class: 'mem-fs-tog up'
                        }
                    }]
            };
            var arrow = elementsCreate(html);
            $("#" + this.lDivWrapId).prepend(arrow);
        };
        ControlToggle.prototype.wrapControl = function () {
            var htmlWrap = {
                elementTag: 'div',
                elementAttributes: {
                    id: this.lDivWrapId,
                    class: 'mem-fs-toggle-ctl'
                }
            };
            var wrapDiv = elementsCreate(htmlWrap);
            $(appSettings.controlSelector).wrap(wrapDiv);
        };
        ControlToggle.prototype.toggle = function () {
            var el = $('i.mem-fs-tog');
            if (this.lVisible) {
                $(appSettings.controlSelector).slideUp('slow', function () {
                    el.removeClass('up');
                    el.addClass('down');
                });
            }
            else {
                $(appSettings.controlSelector).slideDown('slow', function () {
                    el.removeClass('down');
                    el.addClass('up');
                });
            }
            this.lVisible = !this.lVisible;
        };
        return ControlToggle;
    }());

    var validateIfTop = function () {
        return window.top === window.self;
    };
    var main = function () {
        Log.message(appSettings.shortName + ": Start main...");
        var ctlTog = new ControlToggle();
        ctlTog.init();
        var fs = new Fullscreen();
        fs.init();
        Log.message(appSettings.shortName + ": End main...");
    };
    if (validateIfTop()) {
        Log.message(appSettings.shortName + ': Entry Script: Start loading...');
        var iv_1 = new IntervalManual(500, 30);
        iv_1.onTick().subscribe(function (s, a) {
            if ($(appSettings.gameBoardSelector).length === 1) {
                iv_1.dispose();
                var loader_1 = new MainElementLoader();
                loader_1.onAllElementsLoaded().subscribe(function (sender, args) {
                    loader_1.dispose();
                    Log.message(appSettings.shortName + ": Entry Script: All Scripts loaded. Total count: " + args.totalNumberOfScripts);
                    main();
                });
                loader_1.onElementsLoadFail().subscribe(function (sender, args) {
                    loader_1.dispose();
                    Log.error(appSettings.shortName + ": Entry Script: The neceassary elements were note loaded. Failed:", args.remainingEvents);
                });
                loader_1.onElementLoaded().subscribe(function (sender, args) {
                    Log.message(appSettings.shortName + ": Entry Script: Element with Key value of '" + args.key + "' has loaded");
                });
                loader_1.onTickExpired().subscribe(function (sender, args) {
                    Log.warn(appSettings.shortName + ": Entry Script: Element with Key value of '" + args.key + "' has failed to load");
                });
                loader_1.start();
            }
        });
        iv_1.onExpired().subscribe(function (sender, args) {
            Log.message(appSettings.shortName + ": No game board found on this page");
        });
        iv_1.start();
        Log.message(appSettings.shortName + ': Entry Script: End loading...');
    }

}($));

// ==UserScript==
// @name            MWI Helper 
// @version         1.0.0-2025-10-24_265c3c0
// @description     MilkyWayIdle Helper
// @author          wang-x-xia
// @homepage        https://github.com/wang-x-xia/t-web-plugins
// @license         ISC
// @run-at          document-start
// @match           https://www.milkywayidle.com/*
// @match           https://test.milkywayidle.com/*
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @namespace https://greasyfork.org/users/1483969
// @downloadURL https://update.greasyfork.org/scripts/539485/MWI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/539485/MWI%20Helper.meta.js
// ==/UserScript==

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MWI_SHARED = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
        function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
        function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function isFunction(value) {
        return typeof value === 'function';
    }

    function createErrorClass(createImpl) {
        var _super = function (instance) {
            Error.call(instance);
            instance.stack = new Error().stack;
        };
        var ctorFunc = createImpl(_super);
        ctorFunc.prototype = Object.create(Error.prototype);
        ctorFunc.prototype.constructor = ctorFunc;
        return ctorFunc;
    }

    var UnsubscriptionError = createErrorClass(function (_super) {
        return function UnsubscriptionErrorImpl(errors) {
            _super(this);
            this.message = errors
                ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
                : '';
            this.name = 'UnsubscriptionError';
            this.errors = errors;
        };
    });

    function arrRemove(arr, item) {
        if (arr) {
            var index = arr.indexOf(item);
            0 <= index && arr.splice(index, 1);
        }
    }

    var Subscription = (function () {
        function Subscription(initialTeardown) {
            this.initialTeardown = initialTeardown;
            this.closed = false;
            this._parentage = null;
            this._finalizers = null;
        }
        Subscription.prototype.unsubscribe = function () {
            var e_1, _a, e_2, _b;
            var errors;
            if (!this.closed) {
                this.closed = true;
                var _parentage = this._parentage;
                if (_parentage) {
                    this._parentage = null;
                    if (Array.isArray(_parentage)) {
                        try {
                            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                                var parent_1 = _parentage_1_1.value;
                                parent_1.remove(this);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    else {
                        _parentage.remove(this);
                    }
                }
                var initialFinalizer = this.initialTeardown;
                if (isFunction(initialFinalizer)) {
                    try {
                        initialFinalizer();
                    }
                    catch (e) {
                        errors = e instanceof UnsubscriptionError ? e.errors : [e];
                    }
                }
                var _finalizers = this._finalizers;
                if (_finalizers) {
                    this._finalizers = null;
                    try {
                        for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                            var finalizer = _finalizers_1_1.value;
                            try {
                                execFinalizer(finalizer);
                            }
                            catch (err) {
                                errors = errors !== null && errors !== void 0 ? errors : [];
                                if (err instanceof UnsubscriptionError) {
                                    errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                                }
                                else {
                                    errors.push(err);
                                }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                if (errors) {
                    throw new UnsubscriptionError(errors);
                }
            }
        };
        Subscription.prototype.add = function (teardown) {
            var _a;
            if (teardown && teardown !== this) {
                if (this.closed) {
                    execFinalizer(teardown);
                }
                else {
                    if (teardown instanceof Subscription) {
                        if (teardown.closed || teardown._hasParent(this)) {
                            return;
                        }
                        teardown._addParent(this);
                    }
                    (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
                }
            }
        };
        Subscription.prototype._hasParent = function (parent) {
            var _parentage = this._parentage;
            return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
        };
        Subscription.prototype._addParent = function (parent) {
            var _parentage = this._parentage;
            this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
        };
        Subscription.prototype._removeParent = function (parent) {
            var _parentage = this._parentage;
            if (_parentage === parent) {
                this._parentage = null;
            }
            else if (Array.isArray(_parentage)) {
                arrRemove(_parentage, parent);
            }
        };
        Subscription.prototype.remove = function (teardown) {
            var _finalizers = this._finalizers;
            _finalizers && arrRemove(_finalizers, teardown);
            if (teardown instanceof Subscription) {
                teardown._removeParent(this);
            }
        };
        Subscription.EMPTY = (function () {
            var empty = new Subscription();
            empty.closed = true;
            return empty;
        })();
        return Subscription;
    }());
    var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
    function isSubscription(value) {
        return (value instanceof Subscription ||
            (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
    }
    function execFinalizer(finalizer) {
        if (isFunction(finalizer)) {
            finalizer();
        }
        else {
            finalizer.unsubscribe();
        }
    }

    var config = {
        Promise: undefined};

    var timeoutProvider = {
        setTimeout: function (handler, timeout) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
        },
        clearTimeout: function (handle) {
            return (clearTimeout)(handle);
        },
        delegate: undefined,
    };

    function reportUnhandledError(err) {
        timeoutProvider.setTimeout(function () {
            {
                throw err;
            }
        });
    }

    function noop() { }

    function errorContext(cb) {
        {
            cb();
        }
    }

    var Subscriber = (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destination) {
            var _this = _super.call(this) || this;
            _this.isStopped = false;
            if (destination) {
                _this.destination = destination;
                if (isSubscription(destination)) {
                    destination.add(_this);
                }
            }
            else {
                _this.destination = EMPTY_OBSERVER;
            }
            return _this;
        }
        Subscriber.create = function (next, error, complete) {
            return new SafeSubscriber(next, error, complete);
        };
        Subscriber.prototype.next = function (value) {
            if (this.isStopped) ;
            else {
                this._next(value);
            }
        };
        Subscriber.prototype.error = function (err) {
            if (this.isStopped) ;
            else {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber.prototype.complete = function () {
            if (this.isStopped) ;
            else {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (!this.closed) {
                this.isStopped = true;
                _super.prototype.unsubscribe.call(this);
                this.destination = null;
            }
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            try {
                this.destination.error(err);
            }
            finally {
                this.unsubscribe();
            }
        };
        Subscriber.prototype._complete = function () {
            try {
                this.destination.complete();
            }
            finally {
                this.unsubscribe();
            }
        };
        return Subscriber;
    }(Subscription));
    var ConsumerObserver = (function () {
        function ConsumerObserver(partialObserver) {
            this.partialObserver = partialObserver;
        }
        ConsumerObserver.prototype.next = function (value) {
            var partialObserver = this.partialObserver;
            if (partialObserver.next) {
                try {
                    partialObserver.next(value);
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
        };
        ConsumerObserver.prototype.error = function (err) {
            var partialObserver = this.partialObserver;
            if (partialObserver.error) {
                try {
                    partialObserver.error(err);
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
            else {
                handleUnhandledError(err);
            }
        };
        ConsumerObserver.prototype.complete = function () {
            var partialObserver = this.partialObserver;
            if (partialObserver.complete) {
                try {
                    partialObserver.complete();
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
        };
        return ConsumerObserver;
    }());
    var SafeSubscriber = (function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            var partialObserver;
            if (isFunction(observerOrNext) || !observerOrNext) {
                partialObserver = {
                    next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                    error: error !== null && error !== void 0 ? error : undefined,
                    complete: complete !== null && complete !== void 0 ? complete : undefined,
                };
            }
            else {
                {
                    partialObserver = observerOrNext;
                }
            }
            _this.destination = new ConsumerObserver(partialObserver);
            return _this;
        }
        return SafeSubscriber;
    }(Subscriber));
    function handleUnhandledError(error) {
        {
            reportUnhandledError(error);
        }
    }
    function defaultErrorHandler(err) {
        throw err;
    }
    var EMPTY_OBSERVER = {
        closed: true,
        next: noop,
        error: defaultErrorHandler,
        complete: noop,
    };

    var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();

    function identity(x) {
        return x;
    }

    function pipeFromArray(fns) {
        if (fns.length === 0) {
            return identity;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, input);
        };
    }

    var Observable = (function () {
        function Observable(subscribe) {
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable.prototype.lift = function (operator) {
            var observable = new Observable();
            observable.source = this;
            observable.operator = operator;
            return observable;
        };
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var _this = this;
            var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
            errorContext(function () {
                var _a = _this, operator = _a.operator, source = _a.source;
                subscriber.add(operator
                    ?
                        operator.call(subscriber, source)
                    : source
                        ?
                            _this._subscribe(subscriber)
                        :
                            _this._trySubscribe(subscriber));
            });
            return subscriber;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                sink.error(err);
            }
        };
        Observable.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscriber = new SafeSubscriber({
                    next: function (value) {
                        try {
                            next(value);
                        }
                        catch (err) {
                            reject(err);
                            subscriber.unsubscribe();
                        }
                    },
                    error: reject,
                    complete: resolve,
                });
                _this.subscribe(subscriber);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            var _a;
            return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
        };
        Observable.prototype[observable] = function () {
            return this;
        };
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            return pipeFromArray(operations)(this);
        };
        Observable.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
            });
        };
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());
    function getPromiseCtor(promiseCtor) {
        var _a;
        return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
    }
    function isObserver(value) {
        return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
    }
    function isSubscriber(value) {
        return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
    }

    function hasLift(source) {
        return isFunction(source === null || source === void 0 ? void 0 : source.lift);
    }
    function operate(init) {
        return function (source) {
            if (hasLift(source)) {
                return source.lift(function (liftedSource) {
                    try {
                        return init(liftedSource, this);
                    }
                    catch (err) {
                        this.error(err);
                    }
                });
            }
            throw new TypeError('Unable to lift unknown Observable type');
        };
    }

    function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
        return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
    }
    var OperatorSubscriber = (function (_super) {
        __extends(OperatorSubscriber, _super);
        function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
            var _this = _super.call(this, destination) || this;
            _this.onFinalize = onFinalize;
            _this.shouldUnsubscribe = shouldUnsubscribe;
            _this._next = onNext
                ? function (value) {
                    try {
                        onNext(value);
                    }
                    catch (err) {
                        destination.error(err);
                    }
                }
                : _super.prototype._next;
            _this._error = onError
                ? function (err) {
                    try {
                        onError(err);
                    }
                    catch (err) {
                        destination.error(err);
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
                : _super.prototype._error;
            _this._complete = onComplete
                ? function () {
                    try {
                        onComplete();
                    }
                    catch (err) {
                        destination.error(err);
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
                : _super.prototype._complete;
            return _this;
        }
        OperatorSubscriber.prototype.unsubscribe = function () {
            var _a;
            if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                var closed_1 = this.closed;
                _super.prototype.unsubscribe.call(this);
                !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
            }
        };
        return OperatorSubscriber;
    }(Subscriber));

    var ObjectUnsubscribedError = createErrorClass(function (_super) {
        return function ObjectUnsubscribedErrorImpl() {
            _super(this);
            this.name = 'ObjectUnsubscribedError';
            this.message = 'object unsubscribed';
        };
    });

    var Subject = (function (_super) {
        __extends(Subject, _super);
        function Subject() {
            var _this = _super.call(this) || this;
            _this.closed = false;
            _this.currentObservers = null;
            _this.observers = [];
            _this.isStopped = false;
            _this.hasError = false;
            _this.thrownError = null;
            return _this;
        }
        Subject.prototype.lift = function (operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        };
        Subject.prototype._throwIfClosed = function () {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
        };
        Subject.prototype.next = function (value) {
            var _this = this;
            errorContext(function () {
                var e_1, _a;
                _this._throwIfClosed();
                if (!_this.isStopped) {
                    if (!_this.currentObservers) {
                        _this.currentObservers = Array.from(_this.observers);
                    }
                    try {
                        for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var observer = _c.value;
                            observer.next(value);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            });
        };
        Subject.prototype.error = function (err) {
            var _this = this;
            errorContext(function () {
                _this._throwIfClosed();
                if (!_this.isStopped) {
                    _this.hasError = _this.isStopped = true;
                    _this.thrownError = err;
                    var observers = _this.observers;
                    while (observers.length) {
                        observers.shift().error(err);
                    }
                }
            });
        };
        Subject.prototype.complete = function () {
            var _this = this;
            errorContext(function () {
                _this._throwIfClosed();
                if (!_this.isStopped) {
                    _this.isStopped = true;
                    var observers = _this.observers;
                    while (observers.length) {
                        observers.shift().complete();
                    }
                }
            });
        };
        Subject.prototype.unsubscribe = function () {
            this.isStopped = this.closed = true;
            this.observers = this.currentObservers = null;
        };
        Object.defineProperty(Subject.prototype, "observed", {
            get: function () {
                var _a;
                return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
            },
            enumerable: false,
            configurable: true
        });
        Subject.prototype._trySubscribe = function (subscriber) {
            this._throwIfClosed();
            return _super.prototype._trySubscribe.call(this, subscriber);
        };
        Subject.prototype._subscribe = function (subscriber) {
            this._throwIfClosed();
            this._checkFinalizedStatuses(subscriber);
            return this._innerSubscribe(subscriber);
        };
        Subject.prototype._innerSubscribe = function (subscriber) {
            var _this = this;
            var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
            if (hasError || isStopped) {
                return EMPTY_SUBSCRIPTION;
            }
            this.currentObservers = null;
            observers.push(subscriber);
            return new Subscription(function () {
                _this.currentObservers = null;
                arrRemove(observers, subscriber);
            });
        };
        Subject.prototype._checkFinalizedStatuses = function (subscriber) {
            var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
            if (hasError) {
                subscriber.error(thrownError);
            }
            else if (isStopped) {
                subscriber.complete();
            }
        };
        Subject.prototype.asObservable = function () {
            var observable = new Observable();
            observable.source = this;
            return observable;
        };
        Subject.create = function (destination, source) {
            return new AnonymousSubject(destination, source);
        };
        return Subject;
    }(Observable));
    var AnonymousSubject = (function (_super) {
        __extends(AnonymousSubject, _super);
        function AnonymousSubject(destination, source) {
            var _this = _super.call(this) || this;
            _this.destination = destination;
            _this.source = source;
            return _this;
        }
        AnonymousSubject.prototype.next = function (value) {
            var _a, _b;
            (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        };
        AnonymousSubject.prototype.error = function (err) {
            var _a, _b;
            (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
        };
        AnonymousSubject.prototype.complete = function () {
            var _a, _b;
            (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
        AnonymousSubject.prototype._subscribe = function (subscriber) {
            var _a, _b;
            return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
        };
        return AnonymousSubject;
    }(Subject));

    var dateTimestampProvider = {
        now: function () {
            return (dateTimestampProvider.delegate || Date).now();
        },
        delegate: undefined,
    };

    var ReplaySubject = (function (_super) {
        __extends(ReplaySubject, _super);
        function ReplaySubject(_bufferSize, _windowTime, _timestampProvider) {
            if (_bufferSize === void 0) { _bufferSize = Infinity; }
            if (_windowTime === void 0) { _windowTime = Infinity; }
            if (_timestampProvider === void 0) { _timestampProvider = dateTimestampProvider; }
            var _this = _super.call(this) || this;
            _this._bufferSize = _bufferSize;
            _this._windowTime = _windowTime;
            _this._timestampProvider = _timestampProvider;
            _this._buffer = [];
            _this._infiniteTimeWindow = true;
            _this._infiniteTimeWindow = _windowTime === Infinity;
            _this._bufferSize = Math.max(1, _bufferSize);
            _this._windowTime = Math.max(1, _windowTime);
            return _this;
        }
        ReplaySubject.prototype.next = function (value) {
            var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
            if (!isStopped) {
                _buffer.push(value);
                !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
            }
            this._trimBuffer();
            _super.prototype.next.call(this, value);
        };
        ReplaySubject.prototype._subscribe = function (subscriber) {
            this._throwIfClosed();
            this._trimBuffer();
            var subscription = this._innerSubscribe(subscriber);
            var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
            var copy = _buffer.slice();
            for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
                subscriber.next(copy[i]);
            }
            this._checkFinalizedStatuses(subscriber);
            return subscription;
        };
        ReplaySubject.prototype._trimBuffer = function () {
            var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
            var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
            _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
            if (!_infiniteTimeWindow) {
                var now = _timestampProvider.now();
                var last = 0;
                for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
                    last = i;
                }
                last && _buffer.splice(0, last + 1);
            }
        };
        return ReplaySubject;
    }(Subject));

    var EMPTY = new Observable(function (subscriber) { return subscriber.complete(); });

    function isScheduler(value) {
        return value && isFunction(value.schedule);
    }

    function last(arr) {
        return arr[arr.length - 1];
    }
    function popResultSelector(args) {
        return isFunction(last(args)) ? args.pop() : undefined;
    }
    function popScheduler(args) {
        return isScheduler(last(args)) ? args.pop() : undefined;
    }

    var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

    function isPromise(value) {
        return isFunction(value === null || value === void 0 ? void 0 : value.then);
    }

    function isInteropObservable(input) {
        return isFunction(input[observable]);
    }

    function isAsyncIterable(obj) {
        return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
    }

    function createInvalidObservableTypeError(input) {
        return new TypeError("You provided " + (input !== null && typeof input === 'object' ? 'an invalid object' : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
    }

    function getSymbolIterator() {
        if (typeof Symbol !== 'function' || !Symbol.iterator) {
            return '@@iterator';
        }
        return Symbol.iterator;
    }
    var iterator = getSymbolIterator();

    function isIterable(input) {
        return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
    }

    function readableStreamLikeToAsyncGenerator(readableStream) {
        return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
            var reader, _a, value, done;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reader = readableStream.getReader();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 9, 10]);
                        _b.label = 2;
                    case 2:
                        return [4, __await(reader.read())];
                    case 3:
                        _a = _b.sent(), value = _a.value, done = _a.done;
                        if (!done) return [3, 5];
                        return [4, __await(void 0)];
                    case 4: return [2, _b.sent()];
                    case 5: return [4, __await(value)];
                    case 6: return [4, _b.sent()];
                    case 7:
                        _b.sent();
                        return [3, 2];
                    case 8: return [3, 10];
                    case 9:
                        reader.releaseLock();
                        return [7];
                    case 10: return [2];
                }
            });
        });
    }
    function isReadableStreamLike(obj) {
        return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
    }

    function innerFrom(input) {
        if (input instanceof Observable) {
            return input;
        }
        if (input != null) {
            if (isInteropObservable(input)) {
                return fromInteropObservable(input);
            }
            if (isArrayLike(input)) {
                return fromArrayLike(input);
            }
            if (isPromise(input)) {
                return fromPromise(input);
            }
            if (isAsyncIterable(input)) {
                return fromAsyncIterable(input);
            }
            if (isIterable(input)) {
                return fromIterable(input);
            }
            if (isReadableStreamLike(input)) {
                return fromReadableStreamLike(input);
            }
        }
        throw createInvalidObservableTypeError(input);
    }
    function fromInteropObservable(obj) {
        return new Observable(function (subscriber) {
            var obs = obj[observable]();
            if (isFunction(obs.subscribe)) {
                return obs.subscribe(subscriber);
            }
            throw new TypeError('Provided object does not correctly implement Symbol.observable');
        });
    }
    function fromArrayLike(array) {
        return new Observable(function (subscriber) {
            for (var i = 0; i < array.length && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        });
    }
    function fromPromise(promise) {
        return new Observable(function (subscriber) {
            promise
                .then(function (value) {
                if (!subscriber.closed) {
                    subscriber.next(value);
                    subscriber.complete();
                }
            }, function (err) { return subscriber.error(err); })
                .then(null, reportUnhandledError);
        });
    }
    function fromIterable(iterable) {
        return new Observable(function (subscriber) {
            var e_1, _a;
            try {
                for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                    var value = iterable_1_1.value;
                    subscriber.next(value);
                    if (subscriber.closed) {
                        return;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            subscriber.complete();
        });
    }
    function fromAsyncIterable(asyncIterable) {
        return new Observable(function (subscriber) {
            process(asyncIterable, subscriber).catch(function (err) { return subscriber.error(err); });
        });
    }
    function fromReadableStreamLike(readableStream) {
        return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
    }
    function process(asyncIterable, subscriber) {
        var asyncIterable_1, asyncIterable_1_1;
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var value, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 11]);
                        asyncIterable_1 = __asyncValues(asyncIterable);
                        _b.label = 1;
                    case 1: return [4, asyncIterable_1.next()];
                    case 2:
                        if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
                        value = asyncIterable_1_1.value;
                        subscriber.next(value);
                        if (subscriber.closed) {
                            return [2];
                        }
                        _b.label = 3;
                    case 3: return [3, 1];
                    case 4: return [3, 11];
                    case 5:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 11];
                    case 6:
                        _b.trys.push([6, , 9, 10]);
                        if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
                        return [4, _a.call(asyncIterable_1)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [3, 10];
                    case 9:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 10: return [7];
                    case 11:
                        subscriber.complete();
                        return [2];
                }
            });
        });
    }

    function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
        if (delay === void 0) { delay = 0; }
        if (repeat === void 0) { repeat = false; }
        var scheduleSubscription = scheduler.schedule(function () {
            work();
            if (repeat) {
                parentSubscription.add(this.schedule(null, delay));
            }
            else {
                this.unsubscribe();
            }
        }, delay);
        parentSubscription.add(scheduleSubscription);
        if (!repeat) {
            return scheduleSubscription;
        }
    }

    function observeOn(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        return operate(function (source, subscriber) {
            source.subscribe(createOperatorSubscriber(subscriber, function (value) { return executeSchedule(subscriber, scheduler, function () { return subscriber.next(value); }, delay); }, function () { return executeSchedule(subscriber, scheduler, function () { return subscriber.complete(); }, delay); }, function (err) { return executeSchedule(subscriber, scheduler, function () { return subscriber.error(err); }, delay); }));
        });
    }

    function subscribeOn(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        return operate(function (source, subscriber) {
            subscriber.add(scheduler.schedule(function () { return source.subscribe(subscriber); }, delay));
        });
    }

    function scheduleObservable(input, scheduler) {
        return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
    }

    function schedulePromise(input, scheduler) {
        return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
    }

    function scheduleArray(input, scheduler) {
        return new Observable(function (subscriber) {
            var i = 0;
            return scheduler.schedule(function () {
                if (i === input.length) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(input[i++]);
                    if (!subscriber.closed) {
                        this.schedule();
                    }
                }
            });
        });
    }

    function scheduleIterable(input, scheduler) {
        return new Observable(function (subscriber) {
            var iterator$1;
            executeSchedule(subscriber, scheduler, function () {
                iterator$1 = input[iterator]();
                executeSchedule(subscriber, scheduler, function () {
                    var _a;
                    var value;
                    var done;
                    try {
                        (_a = iterator$1.next(), value = _a.value, done = _a.done);
                    }
                    catch (err) {
                        subscriber.error(err);
                        return;
                    }
                    if (done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(value);
                    }
                }, 0, true);
            });
            return function () { return isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return(); };
        });
    }

    function scheduleAsyncIterable(input, scheduler) {
        if (!input) {
            throw new Error('Iterable cannot be null');
        }
        return new Observable(function (subscriber) {
            executeSchedule(subscriber, scheduler, function () {
                var iterator = input[Symbol.asyncIterator]();
                executeSchedule(subscriber, scheduler, function () {
                    iterator.next().then(function (result) {
                        if (result.done) {
                            subscriber.complete();
                        }
                        else {
                            subscriber.next(result.value);
                        }
                    });
                }, 0, true);
            });
        });
    }

    function scheduleReadableStreamLike(input, scheduler) {
        return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
    }

    function scheduled(input, scheduler) {
        if (input != null) {
            if (isInteropObservable(input)) {
                return scheduleObservable(input, scheduler);
            }
            if (isArrayLike(input)) {
                return scheduleArray(input, scheduler);
            }
            if (isPromise(input)) {
                return schedulePromise(input, scheduler);
            }
            if (isAsyncIterable(input)) {
                return scheduleAsyncIterable(input, scheduler);
            }
            if (isIterable(input)) {
                return scheduleIterable(input, scheduler);
            }
            if (isReadableStreamLike(input)) {
                return scheduleReadableStreamLike(input, scheduler);
            }
        }
        throw createInvalidObservableTypeError(input);
    }

    function from(input, scheduler) {
        return scheduler ? scheduled(input, scheduler) : innerFrom(input);
    }

    function map(project, thisArg) {
        return operate(function (source, subscriber) {
            var index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                subscriber.next(project.call(thisArg, value, index++));
            }));
        });
    }

    var isArray$1 = Array.isArray;
    function callOrApply(fn, args) {
        return isArray$1(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
    }
    function mapOneOrManyArgs(fn) {
        return map(function (args) { return callOrApply(fn, args); });
    }

    var isArray = Array.isArray;
    var getPrototypeOf = Object.getPrototypeOf, objectProto = Object.prototype, getKeys = Object.keys;
    function argsArgArrayOrObject(args) {
        if (args.length === 1) {
            var first_1 = args[0];
            if (isArray(first_1)) {
                return { args: first_1, keys: null };
            }
            if (isPOJO(first_1)) {
                var keys = getKeys(first_1);
                return {
                    args: keys.map(function (key) { return first_1[key]; }),
                    keys: keys,
                };
            }
        }
        return { args: args, keys: null };
    }
    function isPOJO(obj) {
        return obj && typeof obj === 'object' && getPrototypeOf(obj) === objectProto;
    }

    function createObject(keys, values) {
        return keys.reduce(function (result, key, i) { return ((result[key] = values[i]), result); }, {});
    }

    function combineLatest() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var scheduler = popScheduler(args);
        var resultSelector = popResultSelector(args);
        var _a = argsArgArrayOrObject(args), observables = _a.args, keys = _a.keys;
        if (observables.length === 0) {
            return from([], scheduler);
        }
        var result = new Observable(combineLatestInit(observables, scheduler, keys
            ?
                function (values) { return createObject(keys, values); }
            :
                identity));
        return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
    }
    function combineLatestInit(observables, scheduler, valueTransform) {
        if (valueTransform === void 0) { valueTransform = identity; }
        return function (subscriber) {
            maybeSchedule(scheduler, function () {
                var length = observables.length;
                var values = new Array(length);
                var active = length;
                var remainingFirstValues = length;
                var _loop_1 = function (i) {
                    maybeSchedule(scheduler, function () {
                        var source = from(observables[i], scheduler);
                        var hasFirstValue = false;
                        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                            values[i] = value;
                            if (!hasFirstValue) {
                                hasFirstValue = true;
                                remainingFirstValues--;
                            }
                            if (!remainingFirstValues) {
                                subscriber.next(valueTransform(values.slice()));
                            }
                        }, function () {
                            if (!--active) {
                                subscriber.complete();
                            }
                        }));
                    }, subscriber);
                };
                for (var i = 0; i < length; i++) {
                    _loop_1(i);
                }
            }, subscriber);
        };
    }
    function maybeSchedule(scheduler, execute, subscription) {
        if (scheduler) {
            executeSchedule(subscription, scheduler, execute);
        }
        else {
            execute();
        }
    }

    function take(count) {
        return count <= 0
            ?
                function () { return EMPTY; }
            : operate(function (source, subscriber) {
                var seen = 0;
                source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                    if (++seen <= count) {
                        subscriber.next(value);
                        if (count <= seen) {
                            subscriber.complete();
                        }
                    }
                }));
            });
    }

    // Hook
    const Request$ = new ReplaySubject(Infinity, 300000);
    const Response$ = new ReplaySubject(Infinity, 300000);
    // Request
    const BuyMooPassWithCowbells$ = new Subject();
    const ClaimAllMarketListings$ = new Subject();
    const ClaimCharacterQuest$ = new Subject();
    const ClaimMarketListing$ = new Subject();
    const OpenLoot$ = new Subject();
    const PostMarketOrder$ = new Subject();
    // Response
    const InitCharacterId$ = new Subject();
    const InitCharacterData$ = new ReplaySubject(1);
    const LootLogData$ = new ReplaySubject(1);
    const ActionCompleteData$ = new Subject();
    const ItemUpdatedData$ = new Subject();
    const ActionsUpdatedData$ = new Subject();
    const LootOpened$ = new Subject();
    const CharacterLoadedEvent = InitCharacterData$.pipe(take(1));
    const MarketLoaded$ = new Subject();
    const AllLoadedEvent = combineLatest([CharacterLoadedEvent, MarketLoaded$]);
    const InitCharacterSubject = InitCharacterData$;
    const InitClientSubject = new ReplaySubject(1);
    const LootLogSubject = LootLogData$;
    const ActionCompleteEvent = new Subject();

    exports.A = ActionsUpdatedData$;
    exports.B = BuyMooPassWithCowbells$;
    exports.C = ClaimAllMarketListings$;
    exports.I = InitCharacterId$;
    exports.L = LootLogData$;
    exports.M = MarketLoaded$;
    exports.O = OpenLoot$;
    exports.P = PostMarketOrder$;
    exports.R = Response$;
    exports.S = Subject;
    exports._ = __extends;
    exports.a = Request$;
    exports.b = InitCharacterData$;
    exports.c = createOperatorSubscriber;
    exports.d = InitClientSubject;
    exports.e = ActionCompleteData$;
    exports.f = from;
    exports.g = ClaimMarketListing$;
    exports.h = ClaimCharacterQuest$;
    exports.i = combineLatest;
    exports.j = ItemUpdatedData$;
    exports.k = ActionCompleteEvent;
    exports.l = LootOpened$;
    exports.m = map;
    exports.n = __awaiter;
    exports.o = operate;
    exports.p = popScheduler;
    exports.q = AllLoadedEvent;
    exports.r = LootLogSubject;
    exports.s = InitCharacterSubject;

}));

(function (shared_js) {
	'use strict';

	var lzString = {exports: {}};

	var hasRequiredLzString;

	function requireLzString () {
		if (hasRequiredLzString) return lzString.exports;
		hasRequiredLzString = 1;
		(function (module) {
			// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
			// This work is free. You can redistribute it and/or modify it
			// under the terms of the WTFPL, Version 2
			// For more information see LICENSE.txt or http://www.wtfpl.net/
			//
			// For more information, the home page:
			// http://pieroxy.net/blog/pages/lz-string/testing.html
			//
			// LZ-based compression algorithm, version 1.4.5
			var LZString = (function() {

			// private property
			var f = String.fromCharCode;
			var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
			var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
			var baseReverseDic = {};

			function getBaseValue(alphabet, character) {
			  if (!baseReverseDic[alphabet]) {
			    baseReverseDic[alphabet] = {};
			    for (var i=0 ; i<alphabet.length ; i++) {
			      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
			    }
			  }
			  return baseReverseDic[alphabet][character];
			}

			var LZString = {
			  compressToBase64 : function (input) {
			    if (input == null) return "";
			    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
			    switch (res.length % 4) { // To produce valid Base64
			    default: // When could this happen ?
			    case 0 : return res;
			    case 1 : return res+"===";
			    case 2 : return res+"==";
			    case 3 : return res+"=";
			    }
			  },

			  decompressFromBase64 : function (input) {
			    if (input == null) return "";
			    if (input == "") return null;
			    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
			  },

			  compressToUTF16 : function (input) {
			    if (input == null) return "";
			    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
			  },

			  decompressFromUTF16: function (compressed) {
			    if (compressed == null) return "";
			    if (compressed == "") return null;
			    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
			  },

			  //compress into uint8array (UCS-2 big endian format)
			  compressToUint8Array: function (uncompressed) {
			    var compressed = LZString.compress(uncompressed);
			    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

			    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
			      var current_value = compressed.charCodeAt(i);
			      buf[i*2] = current_value >>> 8;
			      buf[i*2+1] = current_value % 256;
			    }
			    return buf;
			  },

			  //decompress from uint8array (UCS-2 big endian format)
			  decompressFromUint8Array:function (compressed) {
			    if (compressed===null || compressed===undefined){
			        return LZString.decompress(compressed);
			    } else {
			        var buf=new Array(compressed.length/2); // 2 bytes per character
			        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
			          buf[i]=compressed[i*2]*256+compressed[i*2+1];
			        }

			        var result = [];
			        buf.forEach(function (c) {
			          result.push(f(c));
			        });
			        return LZString.decompress(result.join(''));

			    }

			  },


			  //compress into a string that is already URI encoded
			  compressToEncodedURIComponent: function (input) {
			    if (input == null) return "";
			    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
			  },

			  //decompress from an output of compressToEncodedURIComponent
			  decompressFromEncodedURIComponent:function (input) {
			    if (input == null) return "";
			    if (input == "") return null;
			    input = input.replace(/ /g, "+");
			    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
			  },

			  compress: function (uncompressed) {
			    return LZString._compress(uncompressed, 16, function(a){return f(a);});
			  },
			  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
			    if (uncompressed == null) return "";
			    var i, value,
			        context_dictionary= {},
			        context_dictionaryToCreate= {},
			        context_c="",
			        context_wc="",
			        context_w="",
			        context_enlargeIn= 2, // Compensate for the first entry which should not count
			        context_dictSize= 3,
			        context_numBits= 2,
			        context_data=[],
			        context_data_val=0,
			        context_data_position=0,
			        ii;

			    for (ii = 0; ii < uncompressed.length; ii += 1) {
			      context_c = uncompressed.charAt(ii);
			      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
			        context_dictionary[context_c] = context_dictSize++;
			        context_dictionaryToCreate[context_c] = true;
			      }

			      context_wc = context_w + context_c;
			      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
			        context_w = context_wc;
			      } else {
			        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
			          if (context_w.charCodeAt(0)<256) {
			            for (i=0 ; i<context_numBits ; i++) {
			              context_data_val = (context_data_val << 1);
			              if (context_data_position == bitsPerChar-1) {
			                context_data_position = 0;
			                context_data.push(getCharFromInt(context_data_val));
			                context_data_val = 0;
			              } else {
			                context_data_position++;
			              }
			            }
			            value = context_w.charCodeAt(0);
			            for (i=0 ; i<8 ; i++) {
			              context_data_val = (context_data_val << 1) | (value&1);
			              if (context_data_position == bitsPerChar-1) {
			                context_data_position = 0;
			                context_data.push(getCharFromInt(context_data_val));
			                context_data_val = 0;
			              } else {
			                context_data_position++;
			              }
			              value = value >> 1;
			            }
			          } else {
			            value = 1;
			            for (i=0 ; i<context_numBits ; i++) {
			              context_data_val = (context_data_val << 1) | value;
			              if (context_data_position ==bitsPerChar-1) {
			                context_data_position = 0;
			                context_data.push(getCharFromInt(context_data_val));
			                context_data_val = 0;
			              } else {
			                context_data_position++;
			              }
			              value = 0;
			            }
			            value = context_w.charCodeAt(0);
			            for (i=0 ; i<16 ; i++) {
			              context_data_val = (context_data_val << 1) | (value&1);
			              if (context_data_position == bitsPerChar-1) {
			                context_data_position = 0;
			                context_data.push(getCharFromInt(context_data_val));
			                context_data_val = 0;
			              } else {
			                context_data_position++;
			              }
			              value = value >> 1;
			            }
			          }
			          context_enlargeIn--;
			          if (context_enlargeIn == 0) {
			            context_enlargeIn = Math.pow(2, context_numBits);
			            context_numBits++;
			          }
			          delete context_dictionaryToCreate[context_w];
			        } else {
			          value = context_dictionary[context_w];
			          for (i=0 ; i<context_numBits ; i++) {
			            context_data_val = (context_data_val << 1) | (value&1);
			            if (context_data_position == bitsPerChar-1) {
			              context_data_position = 0;
			              context_data.push(getCharFromInt(context_data_val));
			              context_data_val = 0;
			            } else {
			              context_data_position++;
			            }
			            value = value >> 1;
			          }


			        }
			        context_enlargeIn--;
			        if (context_enlargeIn == 0) {
			          context_enlargeIn = Math.pow(2, context_numBits);
			          context_numBits++;
			        }
			        // Add wc to the dictionary.
			        context_dictionary[context_wc] = context_dictSize++;
			        context_w = String(context_c);
			      }
			    }

			    // Output the code for w.
			    if (context_w !== "") {
			      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
			        if (context_w.charCodeAt(0)<256) {
			          for (i=0 ; i<context_numBits ; i++) {
			            context_data_val = (context_data_val << 1);
			            if (context_data_position == bitsPerChar-1) {
			              context_data_position = 0;
			              context_data.push(getCharFromInt(context_data_val));
			              context_data_val = 0;
			            } else {
			              context_data_position++;
			            }
			          }
			          value = context_w.charCodeAt(0);
			          for (i=0 ; i<8 ; i++) {
			            context_data_val = (context_data_val << 1) | (value&1);
			            if (context_data_position == bitsPerChar-1) {
			              context_data_position = 0;
			              context_data.push(getCharFromInt(context_data_val));
			              context_data_val = 0;
			            } else {
			              context_data_position++;
			            }
			            value = value >> 1;
			          }
			        } else {
			          value = 1;
			          for (i=0 ; i<context_numBits ; i++) {
			            context_data_val = (context_data_val << 1) | value;
			            if (context_data_position == bitsPerChar-1) {
			              context_data_position = 0;
			              context_data.push(getCharFromInt(context_data_val));
			              context_data_val = 0;
			            } else {
			              context_data_position++;
			            }
			            value = 0;
			          }
			          value = context_w.charCodeAt(0);
			          for (i=0 ; i<16 ; i++) {
			            context_data_val = (context_data_val << 1) | (value&1);
			            if (context_data_position == bitsPerChar-1) {
			              context_data_position = 0;
			              context_data.push(getCharFromInt(context_data_val));
			              context_data_val = 0;
			            } else {
			              context_data_position++;
			            }
			            value = value >> 1;
			          }
			        }
			        context_enlargeIn--;
			        if (context_enlargeIn == 0) {
			          context_enlargeIn = Math.pow(2, context_numBits);
			          context_numBits++;
			        }
			        delete context_dictionaryToCreate[context_w];
			      } else {
			        value = context_dictionary[context_w];
			        for (i=0 ; i<context_numBits ; i++) {
			          context_data_val = (context_data_val << 1) | (value&1);
			          if (context_data_position == bitsPerChar-1) {
			            context_data_position = 0;
			            context_data.push(getCharFromInt(context_data_val));
			            context_data_val = 0;
			          } else {
			            context_data_position++;
			          }
			          value = value >> 1;
			        }


			      }
			      context_enlargeIn--;
			      if (context_enlargeIn == 0) {
			        context_enlargeIn = Math.pow(2, context_numBits);
			        context_numBits++;
			      }
			    }

			    // Mark the end of the stream
			    value = 2;
			    for (i=0 ; i<context_numBits ; i++) {
			      context_data_val = (context_data_val << 1) | (value&1);
			      if (context_data_position == bitsPerChar-1) {
			        context_data_position = 0;
			        context_data.push(getCharFromInt(context_data_val));
			        context_data_val = 0;
			      } else {
			        context_data_position++;
			      }
			      value = value >> 1;
			    }

			    // Flush the last char
			    while (true) {
			      context_data_val = (context_data_val << 1);
			      if (context_data_position == bitsPerChar-1) {
			        context_data.push(getCharFromInt(context_data_val));
			        break;
			      }
			      else context_data_position++;
			    }
			    return context_data.join('');
			  },

			  decompress: function (compressed) {
			    if (compressed == null) return "";
			    if (compressed == "") return null;
			    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
			  },

			  _decompress: function (length, resetValue, getNextValue) {
			    var dictionary = [],
			        enlargeIn = 4,
			        dictSize = 4,
			        numBits = 3,
			        entry = "",
			        result = [],
			        i,
			        w,
			        bits, resb, maxpower, power,
			        c,
			        data = {val:getNextValue(0), position:resetValue, index:1};

			    for (i = 0; i < 3; i += 1) {
			      dictionary[i] = i;
			    }

			    bits = 0;
			    maxpower = Math.pow(2,2);
			    power=1;
			    while (power!=maxpower) {
			      resb = data.val & data.position;
			      data.position >>= 1;
			      if (data.position == 0) {
			        data.position = resetValue;
			        data.val = getNextValue(data.index++);
			      }
			      bits |= (resb>0 ? 1 : 0) * power;
			      power <<= 1;
			    }

			    switch (bits) {
			      case 0:
			          bits = 0;
			          maxpower = Math.pow(2,8);
			          power=1;
			          while (power!=maxpower) {
			            resb = data.val & data.position;
			            data.position >>= 1;
			            if (data.position == 0) {
			              data.position = resetValue;
			              data.val = getNextValue(data.index++);
			            }
			            bits |= (resb>0 ? 1 : 0) * power;
			            power <<= 1;
			          }
			        c = f(bits);
			        break;
			      case 1:
			          bits = 0;
			          maxpower = Math.pow(2,16);
			          power=1;
			          while (power!=maxpower) {
			            resb = data.val & data.position;
			            data.position >>= 1;
			            if (data.position == 0) {
			              data.position = resetValue;
			              data.val = getNextValue(data.index++);
			            }
			            bits |= (resb>0 ? 1 : 0) * power;
			            power <<= 1;
			          }
			        c = f(bits);
			        break;
			      case 2:
			        return "";
			    }
			    dictionary[3] = c;
			    w = c;
			    result.push(c);
			    while (true) {
			      if (data.index > length) {
			        return "";
			      }

			      bits = 0;
			      maxpower = Math.pow(2,numBits);
			      power=1;
			      while (power!=maxpower) {
			        resb = data.val & data.position;
			        data.position >>= 1;
			        if (data.position == 0) {
			          data.position = resetValue;
			          data.val = getNextValue(data.index++);
			        }
			        bits |= (resb>0 ? 1 : 0) * power;
			        power <<= 1;
			      }

			      switch (c = bits) {
			        case 0:
			          bits = 0;
			          maxpower = Math.pow(2,8);
			          power=1;
			          while (power!=maxpower) {
			            resb = data.val & data.position;
			            data.position >>= 1;
			            if (data.position == 0) {
			              data.position = resetValue;
			              data.val = getNextValue(data.index++);
			            }
			            bits |= (resb>0 ? 1 : 0) * power;
			            power <<= 1;
			          }

			          dictionary[dictSize++] = f(bits);
			          c = dictSize-1;
			          enlargeIn--;
			          break;
			        case 1:
			          bits = 0;
			          maxpower = Math.pow(2,16);
			          power=1;
			          while (power!=maxpower) {
			            resb = data.val & data.position;
			            data.position >>= 1;
			            if (data.position == 0) {
			              data.position = resetValue;
			              data.val = getNextValue(data.index++);
			            }
			            bits |= (resb>0 ? 1 : 0) * power;
			            power <<= 1;
			          }
			          dictionary[dictSize++] = f(bits);
			          c = dictSize-1;
			          enlargeIn--;
			          break;
			        case 2:
			          return result.join('');
			      }

			      if (enlargeIn == 0) {
			        enlargeIn = Math.pow(2, numBits);
			        numBits++;
			      }

			      if (dictionary[c]) {
			        entry = dictionary[c];
			      } else {
			        if (c === dictSize) {
			          entry = w + w.charAt(0);
			        } else {
			          return null;
			        }
			      }
			      result.push(entry);

			      // Add w+entry[0] to the dictionary.
			      dictionary[dictSize++] = w + entry.charAt(0);
			      enlargeIn--;

			      w = entry;

			      if (enlargeIn == 0) {
			        enlargeIn = Math.pow(2, numBits);
			        numBits++;
			      }

			    }
			  }
			};
			  return LZString;
			})();

			if( module != null ) {
			  module.exports = LZString;
			} else if( typeof angular !== 'undefined' && angular != null ) {
			  angular.module('LZString', [])
			  .factory('LZString', function () {
			    return LZString;
			  });
			} 
		} (lzString));
		return lzString.exports;
	}

	var lzStringExports = requireLzString();

	unsafeWindow.WebSocket = new Proxy(WebSocket, {
	    construct(target, args) {
	        const ws = new target(...args);
	        ws.addEventListener("message", (event) => {
	            shared_js.R.next(JSON.parse(event.data));
	        });
	        const _send = ws.send.bind(ws);
	        ws.send = (data) => {
	            shared_js.a.next(JSON.parse(data));
	            _send(data);
	        };
	        return ws;
	    },
	});
	if (localStorage.getItem("initClientData") != null) {
	    try {
	        const decompressedClientData = lzStringExports.decompressFromUTF16(localStorage.getItem("initClientData"));
	        shared_js.R.next(JSON.parse(decompressedClientData));
	    }
	    catch (e) {
	        shared_js.R.next(JSON.parse(localStorage.getItem("initClientData")));
	    }
	}

})(MWI_SHARED);

async function main() {
const REACT = await import ('https://esm.sh/react@19.1.0?');
const REACT_DOM = await import ('https://esm.sh/react-dom@19.1.0?deps=scheduler@0.26.0,react@19.1.0');
const REACT_DOM_CLIENT = await import ('https://esm.sh/react-dom@19.1.0/client?deps=scheduler@0.26.0,react@19.1.0');
const RECHARTS = await import ('https://esm.sh/recharts@3.1.0?deps=@standard-schema/spec@1.0.0,@standard-schema/utils@0.3.0,immer@10.1.1,redux@5.0.1,redux-thunk@3.1.0,reselect@5.1.1,react@19.1.0,@types/use-sync-external-store@0.0.6,use-sync-external-store@1.5.0,csstype@3.1.3,@types/react@19.1.6,react-redux@9.2.0,@reduxjs/toolkit@2.8.2,clsx@1.2.1,decimal.js-light@2.5.1,es-toolkit@1.39.7,eventemitter3@4.0.7,tiny-invariant@1.3.3,@types/d3-array@3.2.1,@types/d3-ease@3.0.2,@types/d3-color@3.1.3,@types/d3-interpolate@3.0.4,@types/d3-time@3.0.4,@types/d3-scale@4.0.9,@types/d3-path@3.1.1,@types/d3-shape@3.1.7,@types/d3-timer@3.0.2,internmap@2.0.3,d3-array@3.2.4,d3-ease@3.0.1,d3-color@3.1.0,d3-interpolate@3.0.1,d3-format@3.1.0,d3-time@3.1.0,d3-time-format@4.1.0,d3-scale@4.0.2,d3-path@3.1.0,d3-shape@3.2.0,d3-timer@3.0.1,victory-vendor@37.3.6,scheduler@0.26.0,react-dom@19.1.0,react-is@16.13.1');

(function (React, client, require$$2, shared_js, recharts) {
	'use strict';

	function _interopNamespaceDefault(e) {
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		}
		n.default = e;
		return Object.freeze(n);
	}

	var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	const log$1 = info;
	function info(event, args) {
	    {
	        return;
	    }
	}
	function warn(event, args) {
	    {
	        return;
	    }
	}

	var BehaviorSubject = (function (_super) {
	    shared_js._(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        var _this = _super.call(this) || this;
	        _this._value = _value;
	        return _this;
	    }
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function () {
	            return this.getValue();
	        },
	        enumerable: false,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        !subscription.closed && subscriber.next(this._value);
	        return subscription;
	    };
	    BehaviorSubject.prototype.getValue = function () {
	        var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
	        if (hasError) {
	            throw thrownError;
	        }
	        this._throwIfClosed();
	        return _value;
	    };
	    BehaviorSubject.prototype.next = function (value) {
	        _super.prototype.next.call(this, (this._value = value));
	    };
	    return BehaviorSubject;
	}(shared_js.S));

	function of() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	    }
	    var scheduler = shared_js.p(args);
	    return shared_js.f(args, scheduler);
	}

	function filter(predicate, thisArg) {
	    return shared_js.o(function (source, subscriber) {
	        var index = 0;
	        source.subscribe(shared_js.c(subscriber, function (value) { return predicate.call(thisArg, value, index++) && subscriber.next(value); }));
	    });
	}

	var cjs = {exports: {}};

	var Draggable$1 = {};

	var propTypes = {exports: {}};

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var ReactPropTypesSecret_1;
	var hasRequiredReactPropTypesSecret;

	function requireReactPropTypesSecret () {
		if (hasRequiredReactPropTypesSecret) return ReactPropTypesSecret_1;
		hasRequiredReactPropTypesSecret = 1;

		var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

		ReactPropTypesSecret_1 = ReactPropTypesSecret;
		return ReactPropTypesSecret_1;
	}

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var factoryWithThrowingShims;
	var hasRequiredFactoryWithThrowingShims;

	function requireFactoryWithThrowingShims () {
		if (hasRequiredFactoryWithThrowingShims) return factoryWithThrowingShims;
		hasRequiredFactoryWithThrowingShims = 1;

		var ReactPropTypesSecret = /*@__PURE__*/ requireReactPropTypesSecret();

		function emptyFunction() {}
		function emptyFunctionWithReset() {}
		emptyFunctionWithReset.resetWarningCache = emptyFunction;

		factoryWithThrowingShims = function() {
		  function shim(props, propName, componentName, location, propFullName, secret) {
		    if (secret === ReactPropTypesSecret) {
		      // It is still safe when called from React.
		      return;
		    }
		    var err = new Error(
		      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
		      'Use PropTypes.checkPropTypes() to call them. ' +
		      'Read more at http://fb.me/use-check-prop-types'
		    );
		    err.name = 'Invariant Violation';
		    throw err;
		  }	  shim.isRequired = shim;
		  function getShim() {
		    return shim;
		  }	  // Important!
		  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
		  var ReactPropTypes = {
		    array: shim,
		    bigint: shim,
		    bool: shim,
		    func: shim,
		    number: shim,
		    object: shim,
		    string: shim,
		    symbol: shim,

		    any: shim,
		    arrayOf: getShim,
		    element: shim,
		    elementType: shim,
		    instanceOf: getShim,
		    node: shim,
		    objectOf: getShim,
		    oneOf: getShim,
		    oneOfType: getShim,
		    shape: getShim,
		    exact: getShim,

		    checkPropTypes: emptyFunctionWithReset,
		    resetWarningCache: emptyFunction
		  };

		  ReactPropTypes.PropTypes = ReactPropTypes;

		  return ReactPropTypes;
		};
		return factoryWithThrowingShims;
	}

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var hasRequiredPropTypes;

	function requirePropTypes () {
		if (hasRequiredPropTypes) return propTypes.exports;
		hasRequiredPropTypes = 1;
		{
		  // By explicitly using `prop-types` you are opting into new production behavior.
		  // http://fb.me/prop-types-in-prod
		  propTypes.exports = /*@__PURE__*/ requireFactoryWithThrowingShims()();
		}
		return propTypes.exports;
	}

	function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);else for(t in e)e[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var e,t,f=0,n="";f<arguments.length;)(e=arguments[f++])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

	var clsx_m = /*#__PURE__*/Object.freeze({
		__proto__: null,
		clsx: clsx,
		default: clsx
	});

	var require$$3 = /*@__PURE__*/getAugmentedNamespace(clsx_m);

	var domFns = {};

	var shims = {};

	var hasRequiredShims;

	function requireShims () {
		if (hasRequiredShims) return shims;
		hasRequiredShims = 1;

		Object.defineProperty(shims, "__esModule", {
		  value: true
		});
		shims.dontSetMe = dontSetMe;
		shims.findInArray = findInArray;
		shims.int = int;
		shims.isFunction = isFunction;
		shims.isNum = isNum;
		// @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
		function findInArray(array /*: Array<any> | TouchList*/, callback /*: Function*/) /*: any*/{
		  for (let i = 0, length = array.length; i < length; i++) {
		    if (callback.apply(callback, [array[i], i, array])) return array[i];
		  }
		}
		function isFunction(func /*: any*/) /*: boolean %checks*/{
		  // $FlowIgnore[method-unbinding]
		  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
		}
		function isNum(num /*: any*/) /*: boolean %checks*/{
		  return typeof num === 'number' && !isNaN(num);
		}
		function int(a /*: string*/) /*: number*/{
		  return parseInt(a, 10);
		}
		function dontSetMe(props /*: Object*/, propName /*: string*/, componentName /*: string*/) /*: ?Error*/{
		  if (props[propName]) {
		    return new Error("Invalid prop ".concat(propName, " passed to ").concat(componentName, " - do not set this, set it on the child."));
		  }
		}
		return shims;
	}

	var getPrefix = {};

	var hasRequiredGetPrefix;

	function requireGetPrefix () {
		if (hasRequiredGetPrefix) return getPrefix;
		hasRequiredGetPrefix = 1;

		Object.defineProperty(getPrefix, "__esModule", {
		  value: true
		});
		getPrefix.browserPrefixToKey = browserPrefixToKey;
		getPrefix.browserPrefixToStyle = browserPrefixToStyle;
		getPrefix.default = void 0;
		getPrefix.getPrefix = getPrefix$1;
		const prefixes = ['Moz', 'Webkit', 'O', 'ms'];
		function getPrefix$1() /*: string*/{
		  var _window$document;
		  let prop /*: string*/ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';
		  // Ensure we're running in an environment where there is actually a global
		  // `window` obj
		  if (typeof window === 'undefined') return '';

		  // If we're in a pseudo-browser server-side environment, this access
		  // path may not exist, so bail out if it doesn't.
		  const style = (_window$document = window.document) === null || _window$document === void 0 || (_window$document = _window$document.documentElement) === null || _window$document === void 0 ? void 0 : _window$document.style;
		  if (!style) return '';
		  if (prop in style) return '';
		  for (let i = 0; i < prefixes.length; i++) {
		    if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
		  }
		  return '';
		}
		function browserPrefixToKey(prop /*: string*/, prefix /*: string*/) /*: string*/{
		  return prefix ? "".concat(prefix).concat(kebabToTitleCase(prop)) : prop;
		}
		function browserPrefixToStyle(prop /*: string*/, prefix /*: string*/) /*: string*/{
		  return prefix ? "-".concat(prefix.toLowerCase(), "-").concat(prop) : prop;
		}
		function kebabToTitleCase(str /*: string*/) /*: string*/{
		  let out = '';
		  let shouldCapitalize = true;
		  for (let i = 0; i < str.length; i++) {
		    if (shouldCapitalize) {
		      out += str[i].toUpperCase();
		      shouldCapitalize = false;
		    } else if (str[i] === '-') {
		      shouldCapitalize = true;
		    } else {
		      out += str[i];
		    }
		  }
		  return out;
		}

		// Default export is the prefix itself, like 'Moz', 'Webkit', etc
		// Note that you may have to re-test for certain things; for instance, Chrome 50
		// can handle unprefixed `transform`, but not unprefixed `user-select`
		getPrefix.default = (getPrefix$1() /*: string*/);
		return getPrefix;
	}

	var hasRequiredDomFns;

	function requireDomFns () {
		if (hasRequiredDomFns) return domFns;
		hasRequiredDomFns = 1;

		Object.defineProperty(domFns, "__esModule", {
		  value: true
		});
		domFns.addClassName = addClassName;
		domFns.addEvent = addEvent;
		domFns.addUserSelectStyles = addUserSelectStyles;
		domFns.createCSSTransform = createCSSTransform;
		domFns.createSVGTransform = createSVGTransform;
		domFns.getTouch = getTouch;
		domFns.getTouchIdentifier = getTouchIdentifier;
		domFns.getTranslation = getTranslation;
		domFns.innerHeight = innerHeight;
		domFns.innerWidth = innerWidth;
		domFns.matchesSelector = matchesSelector;
		domFns.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
		domFns.offsetXYFromParent = offsetXYFromParent;
		domFns.outerHeight = outerHeight;
		domFns.outerWidth = outerWidth;
		domFns.removeClassName = removeClassName;
		domFns.removeEvent = removeEvent;
		domFns.removeUserSelectStyles = removeUserSelectStyles;
		var _shims = requireShims();
		var _getPrefix = _interopRequireWildcard(requireGetPrefix());
		function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
		function _interopRequireWildcard(obj, nodeInterop) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
		/*:: import type {ControlPosition, PositionOffsetControlPosition, MouseTouchEvent} from './types';*/
		let matchesSelectorFunc = '';
		function matchesSelector(el /*: Node*/, selector /*: string*/) /*: boolean*/{
		  if (!matchesSelectorFunc) {
		    matchesSelectorFunc = (0, _shims.findInArray)(['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'], function (method) {
		      // $FlowIgnore: Doesn't think elements are indexable
		      return (0, _shims.isFunction)(el[method]);
		    });
		  }

		  // Might not be found entirely (not an Element?) - in that case, bail
		  // $FlowIgnore: Doesn't think elements are indexable
		  if (!(0, _shims.isFunction)(el[matchesSelectorFunc])) return false;

		  // $FlowIgnore: Doesn't think elements are indexable
		  return el[matchesSelectorFunc](selector);
		}

		// Works up the tree to the draggable itself attempting to match selector.
		function matchesSelectorAndParentsTo(el /*: Node*/, selector /*: string*/, baseNode /*: Node*/) /*: boolean*/{
		  let node = el;
		  do {
		    if (matchesSelector(node, selector)) return true;
		    if (node === baseNode) return false;
		    // $FlowIgnore[incompatible-type]
		    node = node.parentNode;
		  } while (node);
		  return false;
		}
		function addEvent(el /*: ?Node*/, event /*: string*/, handler /*: Function*/, inputOptions /*: Object*/) /*: void*/{
		  if (!el) return;
		  const options = {
		    capture: true,
		    ...inputOptions
		  };
		  // $FlowIgnore[method-unbinding]
		  if (el.addEventListener) {
		    el.addEventListener(event, handler, options);
		  } else if (el.attachEvent) {
		    el.attachEvent('on' + event, handler);
		  } else {
		    // $FlowIgnore: Doesn't think elements are indexable
		    el['on' + event] = handler;
		  }
		}
		function removeEvent(el /*: ?Node*/, event /*: string*/, handler /*: Function*/, inputOptions /*: Object*/) /*: void*/{
		  if (!el) return;
		  const options = {
		    capture: true,
		    ...inputOptions
		  };
		  // $FlowIgnore[method-unbinding]
		  if (el.removeEventListener) {
		    el.removeEventListener(event, handler, options);
		  } else if (el.detachEvent) {
		    el.detachEvent('on' + event, handler);
		  } else {
		    // $FlowIgnore: Doesn't think elements are indexable
		    el['on' + event] = null;
		  }
		}
		function outerHeight(node /*: HTMLElement*/) /*: number*/{
		  // This is deliberately excluding margin for our calculations, since we are using
		  // offsetTop which is including margin. See getBoundPosition
		  let height = node.clientHeight;
		  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
		  height += (0, _shims.int)(computedStyle.borderTopWidth);
		  height += (0, _shims.int)(computedStyle.borderBottomWidth);
		  return height;
		}
		function outerWidth(node /*: HTMLElement*/) /*: number*/{
		  // This is deliberately excluding margin for our calculations, since we are using
		  // offsetLeft which is including margin. See getBoundPosition
		  let width = node.clientWidth;
		  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
		  width += (0, _shims.int)(computedStyle.borderLeftWidth);
		  width += (0, _shims.int)(computedStyle.borderRightWidth);
		  return width;
		}
		function innerHeight(node /*: HTMLElement*/) /*: number*/{
		  let height = node.clientHeight;
		  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
		  height -= (0, _shims.int)(computedStyle.paddingTop);
		  height -= (0, _shims.int)(computedStyle.paddingBottom);
		  return height;
		}
		function innerWidth(node /*: HTMLElement*/) /*: number*/{
		  let width = node.clientWidth;
		  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
		  width -= (0, _shims.int)(computedStyle.paddingLeft);
		  width -= (0, _shims.int)(computedStyle.paddingRight);
		  return width;
		}
		/*:: interface EventWithOffset {
		  clientX: number, clientY: number
		}*/
		// Get from offsetParent
		function offsetXYFromParent(evt /*: EventWithOffset*/, offsetParent /*: HTMLElement*/, scale /*: number*/) /*: ControlPosition*/{
		  const isBody = offsetParent === offsetParent.ownerDocument.body;
		  const offsetParentRect = isBody ? {
		    left: 0,
		    top: 0
		  } : offsetParent.getBoundingClientRect();
		  const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
		  const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
		  return {
		    x,
		    y
		  };
		}
		function createCSSTransform(controlPos /*: ControlPosition*/, positionOffset /*: PositionOffsetControlPosition*/) /*: Object*/{
		  const translation = getTranslation(controlPos, positionOffset, 'px');
		  return {
		    [(0, _getPrefix.browserPrefixToKey)('transform', _getPrefix.default)]: translation
		  };
		}
		function createSVGTransform(controlPos /*: ControlPosition*/, positionOffset /*: PositionOffsetControlPosition*/) /*: string*/{
		  const translation = getTranslation(controlPos, positionOffset, '');
		  return translation;
		}
		function getTranslation(_ref /*:: */, positionOffset /*: PositionOffsetControlPosition*/, unitSuffix /*: string*/) /*: string*/{
		  let {
		    x,
		    y
		  } /*: ControlPosition*/ = _ref /*: ControlPosition*/;
		  let translation = "translate(".concat(x).concat(unitSuffix, ",").concat(y).concat(unitSuffix, ")");
		  if (positionOffset) {
		    const defaultX = "".concat(typeof positionOffset.x === 'string' ? positionOffset.x : positionOffset.x + unitSuffix);
		    const defaultY = "".concat(typeof positionOffset.y === 'string' ? positionOffset.y : positionOffset.y + unitSuffix);
		    translation = "translate(".concat(defaultX, ", ").concat(defaultY, ")") + translation;
		  }
		  return translation;
		}
		function getTouch(e /*: MouseTouchEvent*/, identifier /*: number*/) /*: ?{clientX: number, clientY: number}*/{
		  return e.targetTouches && (0, _shims.findInArray)(e.targetTouches, t => identifier === t.identifier) || e.changedTouches && (0, _shims.findInArray)(e.changedTouches, t => identifier === t.identifier);
		}
		function getTouchIdentifier(e /*: MouseTouchEvent*/) /*: ?number*/{
		  if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
		  if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
		}

		// User-select Hacks:
		//
		// Useful for preventing blue highlights all over everything when dragging.

		// Note we're passing `document` b/c we could be iframed
		function addUserSelectStyles(doc /*: ?Document*/) {
		  if (!doc) return;
		  let styleEl = doc.getElementById('react-draggable-style-el');
		  if (!styleEl) {
		    styleEl = doc.createElement('style');
		    styleEl.type = 'text/css';
		    styleEl.id = 'react-draggable-style-el';
		    styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
		    styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit;}\n';
		    doc.getElementsByTagName('head')[0].appendChild(styleEl);
		  }
		  if (doc.body) addClassName(doc.body, 'react-draggable-transparent-selection');
		}
		function removeUserSelectStyles(doc /*: ?Document*/) {
		  if (!doc) return;
		  try {
		    if (doc.body) removeClassName(doc.body, 'react-draggable-transparent-selection');
		    // $FlowIgnore: IE
		    if (doc.selection) {
		      // $FlowIgnore: IE
		      doc.selection.empty();
		    } else {
		      // Remove selection caused by scroll, unless it's a focused input
		      // (we use doc.defaultView in case we're in an iframe)
		      const selection = (doc.defaultView || window).getSelection();
		      if (selection && selection.type !== 'Caret') {
		        selection.removeAllRanges();
		      }
		    }
		  } catch (e) {
		    // probably IE
		  }
		}
		function addClassName(el /*: HTMLElement*/, className /*: string*/) {
		  if (el.classList) {
		    el.classList.add(className);
		  } else {
		    if (!el.className.match(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)")))) {
		      el.className += " ".concat(className);
		    }
		  }
		}
		function removeClassName(el /*: HTMLElement*/, className /*: string*/) {
		  if (el.classList) {
		    el.classList.remove(className);
		  } else {
		    el.className = el.className.replace(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)"), 'g'), '');
		  }
		}
		return domFns;
	}

	var positionFns = {};

	var hasRequiredPositionFns;

	function requirePositionFns () {
		if (hasRequiredPositionFns) return positionFns;
		hasRequiredPositionFns = 1;

		Object.defineProperty(positionFns, "__esModule", {
		  value: true
		});
		positionFns.canDragX = canDragX;
		positionFns.canDragY = canDragY;
		positionFns.createCoreData = createCoreData;
		positionFns.createDraggableData = createDraggableData;
		positionFns.getBoundPosition = getBoundPosition;
		positionFns.getControlPosition = getControlPosition;
		positionFns.snapToGrid = snapToGrid;
		var _shims = requireShims();
		var _domFns = requireDomFns();
		/*:: import type Draggable from '../Draggable';*/
		/*:: import type {Bounds, ControlPosition, DraggableData, MouseTouchEvent} from './types';*/
		/*:: import type DraggableCore from '../DraggableCore';*/
		function getBoundPosition(draggable /*: Draggable*/, x /*: number*/, y /*: number*/) /*: [number, number]*/{
		  // If no bounds, short-circuit and move on
		  if (!draggable.props.bounds) return [x, y];

		  // Clone new bounds
		  let {
		    bounds
		  } = draggable.props;
		  bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
		  const node = findDOMNode(draggable);
		  if (typeof bounds === 'string') {
		    const {
		      ownerDocument
		    } = node;
		    const ownerWindow = ownerDocument.defaultView;
		    let boundNode;
		    if (bounds === 'parent') {
		      boundNode = node.parentNode;
		    } else {
		      boundNode = ownerDocument.querySelector(bounds);
		    }
		    if (!(boundNode instanceof ownerWindow.HTMLElement)) {
		      throw new Error('Bounds selector "' + bounds + '" could not find an element.');
		    }
		    const boundNodeEl /*: HTMLElement*/ = boundNode; // for Flow, can't seem to refine correctly
		    const nodeStyle = ownerWindow.getComputedStyle(node);
		    const boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl);
		    // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
		    bounds = {
		      left: -node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingLeft) + (0, _shims.int)(nodeStyle.marginLeft),
		      top: -node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingTop) + (0, _shims.int)(nodeStyle.marginTop),
		      right: (0, _domFns.innerWidth)(boundNodeEl) - (0, _domFns.outerWidth)(node) - node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingRight) - (0, _shims.int)(nodeStyle.marginRight),
		      bottom: (0, _domFns.innerHeight)(boundNodeEl) - (0, _domFns.outerHeight)(node) - node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingBottom) - (0, _shims.int)(nodeStyle.marginBottom)
		    };
		  }

		  // Keep x and y below right and bottom limits...
		  if ((0, _shims.isNum)(bounds.right)) x = Math.min(x, bounds.right);
		  if ((0, _shims.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom);

		  // But above left and top limits.
		  if ((0, _shims.isNum)(bounds.left)) x = Math.max(x, bounds.left);
		  if ((0, _shims.isNum)(bounds.top)) y = Math.max(y, bounds.top);
		  return [x, y];
		}
		function snapToGrid(grid /*: [number, number]*/, pendingX /*: number*/, pendingY /*: number*/) /*: [number, number]*/{
		  const x = Math.round(pendingX / grid[0]) * grid[0];
		  const y = Math.round(pendingY / grid[1]) * grid[1];
		  return [x, y];
		}
		function canDragX(draggable /*: Draggable*/) /*: boolean*/{
		  return draggable.props.axis === 'both' || draggable.props.axis === 'x';
		}
		function canDragY(draggable /*: Draggable*/) /*: boolean*/{
		  return draggable.props.axis === 'both' || draggable.props.axis === 'y';
		}

		// Get {x, y} positions from event.
		function getControlPosition(e /*: MouseTouchEvent*/, touchIdentifier /*: ?number*/, draggableCore /*: DraggableCore*/) /*: ?ControlPosition*/{
		  const touchObj = typeof touchIdentifier === 'number' ? (0, _domFns.getTouch)(e, touchIdentifier) : null;
		  if (typeof touchIdentifier === 'number' && !touchObj) return null; // not the right touch
		  const node = findDOMNode(draggableCore);
		  // User can provide an offsetParent if desired.
		  const offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
		  return (0, _domFns.offsetXYFromParent)(touchObj || e, offsetParent, draggableCore.props.scale);
		}

		// Create an data object exposed by <DraggableCore>'s events
		function createCoreData(draggable /*: DraggableCore*/, x /*: number*/, y /*: number*/) /*: DraggableData*/{
		  const isStart = !(0, _shims.isNum)(draggable.lastX);
		  const node = findDOMNode(draggable);
		  if (isStart) {
		    // If this is our first move, use the x and y as last coords.
		    return {
		      node,
		      deltaX: 0,
		      deltaY: 0,
		      lastX: x,
		      lastY: y,
		      x,
		      y
		    };
		  } else {
		    // Otherwise calculate proper values.
		    return {
		      node,
		      deltaX: x - draggable.lastX,
		      deltaY: y - draggable.lastY,
		      lastX: draggable.lastX,
		      lastY: draggable.lastY,
		      x,
		      y
		    };
		  }
		}

		// Create an data exposed by <Draggable>'s events
		function createDraggableData(draggable /*: Draggable*/, coreData /*: DraggableData*/) /*: DraggableData*/{
		  const scale = draggable.props.scale;
		  return {
		    node: coreData.node,
		    x: draggable.state.x + coreData.deltaX / scale,
		    y: draggable.state.y + coreData.deltaY / scale,
		    deltaX: coreData.deltaX / scale,
		    deltaY: coreData.deltaY / scale,
		    lastX: draggable.state.x,
		    lastY: draggable.state.y
		  };
		}

		// A lot faster than stringify/parse
		function cloneBounds(bounds /*: Bounds*/) /*: Bounds*/{
		  return {
		    left: bounds.left,
		    top: bounds.top,
		    right: bounds.right,
		    bottom: bounds.bottom
		  };
		}
		function findDOMNode(draggable /*: Draggable | DraggableCore*/) /*: HTMLElement*/{
		  const node = draggable.findDOMNode();
		  if (!node) {
		    throw new Error('<DraggableCore>: Unmounted during event!');
		  }
		  // $FlowIgnore we can't assert on HTMLElement due to tests... FIXME
		  return node;
		}
		return positionFns;
	}

	var DraggableCore = {};

	var log = {};

	var hasRequiredLog;

	function requireLog () {
		if (hasRequiredLog) return log;
		hasRequiredLog = 1;

		Object.defineProperty(log, "__esModule", {
		  value: true
		});
		log.default = log$1;
		/*eslint no-console:0*/
		function log$1() {
		}
		return log;
	}

	var hasRequiredDraggableCore;

	function requireDraggableCore () {
		if (hasRequiredDraggableCore) return DraggableCore;
		hasRequiredDraggableCore = 1;

		Object.defineProperty(DraggableCore, "__esModule", {
		  value: true
		});
		DraggableCore.default = void 0;
		var React$1 = _interopRequireWildcard(React);
		var _propTypes = _interopRequireDefault(/*@__PURE__*/ requirePropTypes());
		var _reactDom = _interopRequireDefault(require$$2);
		var _domFns = requireDomFns();
		var _positionFns = requirePositionFns();
		var _shims = requireShims();
		var _log = _interopRequireDefault(requireLog());
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
		function _interopRequireWildcard(obj, nodeInterop) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
		function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
		function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
		function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
		/*:: import type {EventHandler, MouseTouchEvent} from './utils/types';*/
		/*:: import type {Element as ReactElement} from 'react';*/
		// Simple abstraction for dragging events names.
		const eventsFor = {
		  touch: {
		    start: 'touchstart',
		    move: 'touchmove',
		    stop: 'touchend'
		  },
		  mouse: {
		    start: 'mousedown',
		    move: 'mousemove',
		    stop: 'mouseup'
		  }
		};

		// Default to mouse events.
		let dragEventFor = eventsFor.mouse;
		/*:: export type DraggableData = {
		  node: HTMLElement,
		  x: number, y: number,
		  deltaX: number, deltaY: number,
		  lastX: number, lastY: number,
		};*/
		/*:: export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void | false;*/
		/*:: export type ControlPosition = {x: number, y: number};*/
		/*:: export type PositionOffsetControlPosition = {x: number|string, y: number|string};*/
		/*:: export type DraggableCoreDefaultProps = {
		  allowAnyClick: boolean,
		  disabled: boolean,
		  enableUserSelectHack: boolean,
		  onStart: DraggableEventHandler,
		  onDrag: DraggableEventHandler,
		  onStop: DraggableEventHandler,
		  onMouseDown: (e: MouseEvent) => void,
		  scale: number,
		};*/
		/*:: export type DraggableCoreProps = {
		  ...DraggableCoreDefaultProps,
		  cancel: string,
		  children: ReactElement<any>,
		  offsetParent: HTMLElement,
		  grid: [number, number],
		  handle: string,
		  nodeRef?: ?React.ElementRef<any>,
		};*/
		//
		// Define <DraggableCore>.
		//
		// <DraggableCore> is for advanced usage of <Draggable>. It maintains minimal internal state so it can
		// work well with libraries that require more control over the element.
		//

		let DraggableCore$1 = class DraggableCore extends React$1.Component /*:: <DraggableCoreProps>*/{
		  constructor() {
		    super(...arguments);
		    _defineProperty(this, "dragging", false);
		    // Used while dragging to determine deltas.
		    _defineProperty(this, "lastX", NaN);
		    _defineProperty(this, "lastY", NaN);
		    _defineProperty(this, "touchIdentifier", null);
		    _defineProperty(this, "mounted", false);
		    _defineProperty(this, "handleDragStart", e => {
		      // Make it possible to attach event handlers on top of this one.
		      this.props.onMouseDown(e);

		      // Only accept left-clicks.
		      if (!this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false;

		      // Get nodes. Be sure to grab relative document (could be iframed)
		      const thisNode = this.findDOMNode();
		      if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
		        throw new Error('<DraggableCore> not mounted on DragStart!');
		      }
		      const {
		        ownerDocument
		      } = thisNode;

		      // Short circuit if handle or cancel prop was provided and selector doesn't match.
		      if (this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.handle, thisNode) || this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.cancel, thisNode)) {
		        return;
		      }

		      // Prevent scrolling on mobile devices, like ipad/iphone.
		      // Important that this is after handle/cancel.
		      if (e.type === 'touchstart') e.preventDefault();

		      // Set touch identifier in component state if this is a touch event. This allows us to
		      // distinguish between individual touches on multitouch screens by identifying which
		      // touchpoint was set to this element.
		      const touchIdentifier = (0, _domFns.getTouchIdentifier)(e);
		      this.touchIdentifier = touchIdentifier;

		      // Get the current drag point from the event. This is used as the offset.
		      const position = (0, _positionFns.getControlPosition)(e, touchIdentifier, this);
		      if (position == null) return; // not possible but satisfies flow
		      const {
		        x,
		        y
		      } = position;

		      // Create an event object with all the data parents need to make a decision here.
		      const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
		      (0, _log.default)('DraggableCore: handleDragStart: %j', coreEvent);

		      // Call event handler. If it returns explicit false, cancel.
		      (0, _log.default)('calling', this.props.onStart);
		      const shouldUpdate = this.props.onStart(e, coreEvent);
		      if (shouldUpdate === false || this.mounted === false) return;

		      // Add a style to the body to disable user-select. This prevents text from
		      // being selected all over the page.
		      if (this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument);

		      // Initiate dragging. Set the current x and y as offsets
		      // so we know how much we've moved during the drag. This allows us
		      // to drag elements around even if they have been moved, without issue.
		      this.dragging = true;
		      this.lastX = x;
		      this.lastY = y;

		      // Add events to the document directly so we catch when the user's mouse/touch moves outside of
		      // this element. We use different events depending on whether or not we have detected that this
		      // is a touch-capable device.
		      (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, this.handleDrag);
		      (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, this.handleDragStop);
		    });
		    _defineProperty(this, "handleDrag", e => {
		      // Get the current drag point from the event. This is used as the offset.
		      const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
		      if (position == null) return;
		      let {
		        x,
		        y
		      } = position;

		      // Snap to grid if prop has been provided
		      if (Array.isArray(this.props.grid)) {
		        let deltaX = x - this.lastX,
		          deltaY = y - this.lastY;
		        [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
		        if (!deltaX && !deltaY) return; // skip useless drag
		        x = this.lastX + deltaX, y = this.lastY + deltaY;
		      }
		      const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
		      (0, _log.default)('DraggableCore: handleDrag: %j', coreEvent);

		      // Call event handler. If it returns explicit false, trigger end.
		      const shouldUpdate = this.props.onDrag(e, coreEvent);
		      if (shouldUpdate === false || this.mounted === false) {
		        try {
		          // $FlowIgnore
		          this.handleDragStop(new MouseEvent('mouseup'));
		        } catch (err) {
		          // Old browsers
		          const event = ((document.createEvent('MouseEvents') /*: any*/) /*: MouseTouchEvent*/);
		          // I see why this insanity was deprecated
		          // $FlowIgnore
		          event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		          this.handleDragStop(event);
		        }
		        return;
		      }
		      this.lastX = x;
		      this.lastY = y;
		    });
		    _defineProperty(this, "handleDragStop", e => {
		      if (!this.dragging) return;
		      const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
		      if (position == null) return;
		      let {
		        x,
		        y
		      } = position;

		      // Snap to grid if prop has been provided
		      if (Array.isArray(this.props.grid)) {
		        let deltaX = x - this.lastX || 0;
		        let deltaY = y - this.lastY || 0;
		        [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
		        x = this.lastX + deltaX, y = this.lastY + deltaY;
		      }
		      const coreEvent = (0, _positionFns.createCoreData)(this, x, y);

		      // Call event handler
		      const shouldContinue = this.props.onStop(e, coreEvent);
		      if (shouldContinue === false || this.mounted === false) return false;
		      const thisNode = this.findDOMNode();
		      if (thisNode) {
		        // Remove user-select hack
		        if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(thisNode.ownerDocument);
		      }
		      (0, _log.default)('DraggableCore: handleDragStop: %j', coreEvent);

		      // Reset the el.
		      this.dragging = false;
		      this.lastX = NaN;
		      this.lastY = NaN;
		      if (thisNode) {
		        // Remove event handlers
		        (0, _log.default)('DraggableCore: Removing handlers');
		        (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
		        (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
		      }
		    });
		    _defineProperty(this, "onMouseDown", e => {
		      dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

		      return this.handleDragStart(e);
		    });
		    _defineProperty(this, "onMouseUp", e => {
		      dragEventFor = eventsFor.mouse;
		      return this.handleDragStop(e);
		    });
		    // Same as onMouseDown (start drag), but now consider this a touch device.
		    _defineProperty(this, "onTouchStart", e => {
		      // We're on a touch device now, so change the event handlers
		      dragEventFor = eventsFor.touch;
		      return this.handleDragStart(e);
		    });
		    _defineProperty(this, "onTouchEnd", e => {
		      // We're on a touch device now, so change the event handlers
		      dragEventFor = eventsFor.touch;
		      return this.handleDragStop(e);
		    });
		  }
		  componentDidMount() {
		    this.mounted = true;
		    // Touch handlers must be added with {passive: false} to be cancelable.
		    // https://developers.google.com/web/updates/2017/01/scrolling-intervention
		    const thisNode = this.findDOMNode();
		    if (thisNode) {
		      (0, _domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
		        passive: false
		      });
		    }
		  }
		  componentWillUnmount() {
		    this.mounted = false;
		    // Remove any leftover event handlers. Remove both touch and mouse handlers in case
		    // some browser quirk caused a touch event to fire during a mouse move, or vice versa.
		    const thisNode = this.findDOMNode();
		    if (thisNode) {
		      const {
		        ownerDocument
		      } = thisNode;
		      (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
		      (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
		      (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
		      (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
		      (0, _domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
		        passive: false
		      });
		      if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(ownerDocument);
		    }
		  }

		  // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
		  // the underlying DOM node ourselves. See the README for more information.
		  findDOMNode() /*: ?HTMLElement*/{
		    var _this$props, _this$props2;
		    return (_this$props = this.props) !== null && _this$props !== void 0 && _this$props.nodeRef ? (_this$props2 = this.props) === null || _this$props2 === void 0 || (_this$props2 = _this$props2.nodeRef) === null || _this$props2 === void 0 ? void 0 : _this$props2.current : _reactDom.default.findDOMNode(this);
		  }
		  render() /*: React.Element<any>*/{
		    // Reuse the child provided
		    // This makes it flexible to use whatever element is wanted (div, ul, etc)
		    return /*#__PURE__*/React$1.cloneElement(React$1.Children.only(this.props.children), {
		      // Note: mouseMove handler is attached to document so it will still function
		      // when the user drags quickly and leaves the bounds of the element.
		      onMouseDown: this.onMouseDown,
		      onMouseUp: this.onMouseUp,
		      // onTouchStart is added on `componentDidMount` so they can be added with
		      // {passive: false}, which allows it to cancel. See
		      // https://developers.google.com/web/updates/2017/01/scrolling-intervention
		      onTouchEnd: this.onTouchEnd
		    });
		  }
		};
		DraggableCore.default = DraggableCore$1;
		_defineProperty(DraggableCore$1, "displayName", 'DraggableCore');
		_defineProperty(DraggableCore$1, "propTypes", {
		  /**
		   * `allowAnyClick` allows dragging using any mouse button.
		   * By default, we only accept the left button.
		   *
		   * Defaults to `false`.
		   */
		  allowAnyClick: _propTypes.default.bool,
		  children: _propTypes.default.node.isRequired,
		  /**
		   * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
		   * with the exception of `onMouseDown`, will not fire.
		   */
		  disabled: _propTypes.default.bool,
		  /**
		   * By default, we add 'user-select:none' attributes to the document body
		   * to prevent ugly text selection during drag. If this is causing problems
		   * for your app, set this to `false`.
		   */
		  enableUserSelectHack: _propTypes.default.bool,
		  /**
		   * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
		   * instead of using the parent node.
		   */
		  offsetParent: function (props /*: DraggableCoreProps*/, propName /*: $Keys<DraggableCoreProps>*/) {
		    if (props[propName] && props[propName].nodeType !== 1) {
		      throw new Error('Draggable\'s offsetParent must be a DOM Node.');
		    }
		  },
		  /**
		   * `grid` specifies the x and y that dragging should snap to.
		   */
		  grid: _propTypes.default.arrayOf(_propTypes.default.number),
		  /**
		   * `handle` specifies a selector to be used as the handle that initiates drag.
		   *
		   * Example:
		   *
		   * ```jsx
		   *   let App = React.createClass({
		   *       render: function () {
		   *         return (
		   *            <Draggable handle=".handle">
		   *              <div>
		   *                  <div className="handle">Click me to drag</div>
		   *                  <div>This is some other content</div>
		   *              </div>
		   *           </Draggable>
		   *         );
		   *       }
		   *   });
		   * ```
		   */
		  handle: _propTypes.default.string,
		  /**
		   * `cancel` specifies a selector to be used to prevent drag initialization.
		   *
		   * Example:
		   *
		   * ```jsx
		   *   let App = React.createClass({
		   *       render: function () {
		   *           return(
		   *               <Draggable cancel=".cancel">
		   *                   <div>
		   *                     <div className="cancel">You can't drag from here</div>
		   *                     <div>Dragging here works fine</div>
		   *                   </div>
		   *               </Draggable>
		   *           );
		   *       }
		   *   });
		   * ```
		   */
		  cancel: _propTypes.default.string,
		  /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
		   * Unfortunately, in order for <Draggable> to work properly, we need raw access
		   * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
		   * as in this example:
		   *
		   * function MyComponent() {
		   *   const nodeRef = React.useRef(null);
		   *   return (
		   *     <Draggable nodeRef={nodeRef}>
		   *       <div ref={nodeRef}>Example Target</div>
		   *     </Draggable>
		   *   );
		   * }
		   *
		   * This can be used for arbitrarily nested components, so long as the ref ends up
		   * pointing to the actual child DOM node and not a custom component.
		   */
		  nodeRef: _propTypes.default.object,
		  /**
		   * Called when dragging starts.
		   * If this function returns the boolean false, dragging will be canceled.
		   */
		  onStart: _propTypes.default.func,
		  /**
		   * Called while dragging.
		   * If this function returns the boolean false, dragging will be canceled.
		   */
		  onDrag: _propTypes.default.func,
		  /**
		   * Called when dragging stops.
		   * If this function returns the boolean false, the drag will remain active.
		   */
		  onStop: _propTypes.default.func,
		  /**
		   * A workaround option which can be passed if onMouseDown needs to be accessed,
		   * since it'll always be blocked (as there is internal use of onMouseDown)
		   */
		  onMouseDown: _propTypes.default.func,
		  /**
		   * `scale`, if set, applies scaling while dragging an element
		   */
		  scale: _propTypes.default.number,
		  /**
		   * These properties should be defined on the child, not here.
		   */
		  className: _shims.dontSetMe,
		  style: _shims.dontSetMe,
		  transform: _shims.dontSetMe
		});
		_defineProperty(DraggableCore$1, "defaultProps", {
		  allowAnyClick: false,
		  // by default only accept left click
		  disabled: false,
		  enableUserSelectHack: true,
		  onStart: function () {},
		  onDrag: function () {},
		  onStop: function () {},
		  onMouseDown: function () {},
		  scale: 1
		});
		return DraggableCore;
	}

	var hasRequiredDraggable;

	function requireDraggable () {
		if (hasRequiredDraggable) return Draggable$1;
		hasRequiredDraggable = 1;
		(function (exports) {

			Object.defineProperty(exports, "__esModule", {
			  value: true
			});
			Object.defineProperty(exports, "DraggableCore", {
			  enumerable: true,
			  get: function () {
			    return _DraggableCore.default;
			  }
			});
			exports.default = void 0;
			var React$1 = _interopRequireWildcard(React);
			var _propTypes = _interopRequireDefault(/*@__PURE__*/ requirePropTypes());
			var _reactDom = _interopRequireDefault(require$$2);
			var _clsx = _interopRequireDefault(require$$3);
			var _domFns = requireDomFns();
			var _positionFns = requirePositionFns();
			var _shims = requireShims();
			var _DraggableCore = _interopRequireDefault(requireDraggableCore());
			var _log = _interopRequireDefault(requireLog());
			function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
			function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
			function _interopRequireWildcard(obj, nodeInterop) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
			function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
			function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
			function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
			function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /*:: import type {ControlPosition, PositionOffsetControlPosition, DraggableCoreProps, DraggableCoreDefaultProps} from './DraggableCore';*/
			/*:: import type {Bounds, DraggableEventHandler} from './utils/types';*/
			/*:: import type {Element as ReactElement} from 'react';*/
			/*:: type DraggableState = {
			  dragging: boolean,
			  dragged: boolean,
			  x: number, y: number,
			  slackX: number, slackY: number,
			  isElementSVG: boolean,
			  prevPropsPosition: ?ControlPosition,
			};*/
			/*:: export type DraggableDefaultProps = {
			  ...DraggableCoreDefaultProps,
			  axis: 'both' | 'x' | 'y' | 'none',
			  bounds: Bounds | string | false,
			  defaultClassName: string,
			  defaultClassNameDragging: string,
			  defaultClassNameDragged: string,
			  defaultPosition: ControlPosition,
			  scale: number,
			};*/
			/*:: export type DraggableProps = {
			  ...DraggableCoreProps,
			  ...DraggableDefaultProps,
			  positionOffset: PositionOffsetControlPosition,
			  position: ControlPosition,
			};*/
			//
			// Define <Draggable>
			//
			class Draggable extends React$1.Component /*:: <DraggableProps, DraggableState>*/{
			  // React 16.3+
			  // Arity (props, state)
			  static getDerivedStateFromProps(_ref /*:: */, _ref2 /*:: */) /*: ?Partial<DraggableState>*/{
			    let {
			      position
			    } /*: DraggableProps*/ = _ref /*: DraggableProps*/;
			    let {
			      prevPropsPosition
			    } /*: DraggableState*/ = _ref2 /*: DraggableState*/;
			    // Set x/y if a new position is provided in props that is different than the previous.
			    if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
			      (0, _log.default)('Draggable: getDerivedStateFromProps %j', {
			        position,
			        prevPropsPosition
			      });
			      return {
			        x: position.x,
			        y: position.y,
			        prevPropsPosition: {
			          ...position
			        }
			      };
			    }
			    return null;
			  }
			  constructor(props /*: DraggableProps*/) {
			    super(props);
			    _defineProperty(this, "onDragStart", (e, coreData) => {
			      (0, _log.default)('Draggable: onDragStart: %j', coreData);

			      // Short-circuit if user's callback killed it.
			      const shouldStart = this.props.onStart(e, (0, _positionFns.createDraggableData)(this, coreData));
			      // Kills start event on core as well, so move handlers are never bound.
			      if (shouldStart === false) return false;
			      this.setState({
			        dragging: true,
			        dragged: true
			      });
			    });
			    _defineProperty(this, "onDrag", (e, coreData) => {
			      if (!this.state.dragging) return false;
			      (0, _log.default)('Draggable: onDrag: %j', coreData);
			      const uiData = (0, _positionFns.createDraggableData)(this, coreData);
			      const newState = {
			        x: uiData.x,
			        y: uiData.y,
			        slackX: 0,
			        slackY: 0
			      };

			      // Keep within bounds.
			      if (this.props.bounds) {
			        // Save original x and y.
			        const {
			          x,
			          y
			        } = newState;

			        // Add slack to the values used to calculate bound position. This will ensure that if
			        // we start removing slack, the element won't react to it right away until it's been
			        // completely removed.
			        newState.x += this.state.slackX;
			        newState.y += this.state.slackY;

			        // Get bound position. This will ceil/floor the x and y within the boundaries.
			        const [newStateX, newStateY] = (0, _positionFns.getBoundPosition)(this, newState.x, newState.y);
			        newState.x = newStateX;
			        newState.y = newStateY;

			        // Recalculate slack by noting how much was shaved by the boundPosition handler.
			        newState.slackX = this.state.slackX + (x - newState.x);
			        newState.slackY = this.state.slackY + (y - newState.y);

			        // Update the event we fire to reflect what really happened after bounds took effect.
			        uiData.x = newState.x;
			        uiData.y = newState.y;
			        uiData.deltaX = newState.x - this.state.x;
			        uiData.deltaY = newState.y - this.state.y;
			      }

			      // Short-circuit if user's callback killed it.
			      const shouldUpdate = this.props.onDrag(e, uiData);
			      if (shouldUpdate === false) return false;
			      this.setState(newState);
			    });
			    _defineProperty(this, "onDragStop", (e, coreData) => {
			      if (!this.state.dragging) return false;

			      // Short-circuit if user's callback killed it.
			      const shouldContinue = this.props.onStop(e, (0, _positionFns.createDraggableData)(this, coreData));
			      if (shouldContinue === false) return false;
			      (0, _log.default)('Draggable: onDragStop: %j', coreData);
			      const newState /*: Partial<DraggableState>*/ = {
			        dragging: false,
			        slackX: 0,
			        slackY: 0
			      };

			      // If this is a controlled component, the result of this operation will be to
			      // revert back to the old position. We expect a handler on `onDragStop`, at the least.
			      const controlled = Boolean(this.props.position);
			      if (controlled) {
			        const {
			          x,
			          y
			        } = this.props.position;
			        newState.x = x;
			        newState.y = y;
			      }
			      this.setState(newState);
			    });
			    this.state = {
			      // Whether or not we are currently dragging.
			      dragging: false,
			      // Whether or not we have been dragged before.
			      dragged: false,
			      // Current transform x and y.
			      x: props.position ? props.position.x : props.defaultPosition.x,
			      y: props.position ? props.position.y : props.defaultPosition.y,
			      prevPropsPosition: {
			        ...props.position
			      },
			      // Used for compensating for out-of-bounds drags
			      slackX: 0,
			      slackY: 0,
			      // Can only determine if SVG after mounting
			      isElementSVG: false
			    };
			    if (props.position && !(props.onDrag || props.onStop)) {
			      // eslint-disable-next-line no-console
			      console.warn('A `position` was applied to this <Draggable>, without drag handlers. This will make this ' + 'component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the ' + '`position` of this element.');
			    }
			  }
			  componentDidMount() {
			    // Check to see if the element passed is an instanceof SVGElement
			    if (typeof window.SVGElement !== 'undefined' && this.findDOMNode() instanceof window.SVGElement) {
			      this.setState({
			        isElementSVG: true
			      });
			    }
			  }
			  componentWillUnmount() {
			    this.setState({
			      dragging: false
			    }); // prevents invariant if unmounted while dragging
			  }

			  // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
			  // the underlying DOM node ourselves. See the README for more information.
			  findDOMNode() /*: ?HTMLElement*/{
			    var _this$props$nodeRef$c, _this$props;
			    return (_this$props$nodeRef$c = (_this$props = this.props) === null || _this$props === void 0 || (_this$props = _this$props.nodeRef) === null || _this$props === void 0 ? void 0 : _this$props.current) !== null && _this$props$nodeRef$c !== void 0 ? _this$props$nodeRef$c : _reactDom.default.findDOMNode(this);
			  }
			  render() /*: ReactElement<any>*/{
			    const {
			      axis,
			      bounds,
			      children,
			      defaultPosition,
			      defaultClassName,
			      defaultClassNameDragging,
			      defaultClassNameDragged,
			      position,
			      positionOffset,
			      scale,
			      ...draggableCoreProps
			    } = this.props;
			    let style = {};
			    let svgTransform = null;

			    // If this is controlled, we don't want to move it - unless it's dragging.
			    const controlled = Boolean(position);
			    const draggable = !controlled || this.state.dragging;
			    const validPosition = position || defaultPosition;
			    const transformOpts = {
			      // Set left if horizontal drag is enabled
			      x: (0, _positionFns.canDragX)(this) && draggable ? this.state.x : validPosition.x,
			      // Set top if vertical drag is enabled
			      y: (0, _positionFns.canDragY)(this) && draggable ? this.state.y : validPosition.y
			    };

			    // If this element was SVG, we use the `transform` attribute.
			    if (this.state.isElementSVG) {
			      svgTransform = (0, _domFns.createSVGTransform)(transformOpts, positionOffset);
			    } else {
			      // Add a CSS transform to move the element around. This allows us to move the element around
			      // without worrying about whether or not it is relatively or absolutely positioned.
			      // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
			      // has a clean slate.
			      style = (0, _domFns.createCSSTransform)(transformOpts, positionOffset);
			    }

			    // Mark with class while dragging
			    const className = (0, _clsx.default)(children.props.className || '', defaultClassName, {
			      [defaultClassNameDragging]: this.state.dragging,
			      [defaultClassNameDragged]: this.state.dragged
			    });

			    // Reuse the child provided
			    // This makes it flexible to use whatever element is wanted (div, ul, etc)
			    return /*#__PURE__*/React$1.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
			      onStart: this.onDragStart,
			      onDrag: this.onDrag,
			      onStop: this.onDragStop
			    }), /*#__PURE__*/React$1.cloneElement(React$1.Children.only(children), {
			      className: className,
			      style: {
			        ...children.props.style,
			        ...style
			      },
			      transform: svgTransform
			    }));
			  }
			}
			exports.default = Draggable;
			_defineProperty(Draggable, "displayName", 'Draggable');
			_defineProperty(Draggable, "propTypes", {
			  // Accepts all props <DraggableCore> accepts.
			  ..._DraggableCore.default.propTypes,
			  /**
			   * `axis` determines which axis the draggable can move.
			   *
			   *  Note that all callbacks will still return data as normal. This only
			   *  controls flushing to the DOM.
			   *
			   * 'both' allows movement horizontally and vertically.
			   * 'x' limits movement to horizontal axis.
			   * 'y' limits movement to vertical axis.
			   * 'none' limits all movement.
			   *
			   * Defaults to 'both'.
			   */
			  axis: _propTypes.default.oneOf(['both', 'x', 'y', 'none']),
			  /**
			   * `bounds` determines the range of movement available to the element.
			   * Available values are:
			   *
			   * 'parent' restricts movement within the Draggable's parent node.
			   *
			   * Alternatively, pass an object with the following properties, all of which are optional:
			   *
			   * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
			   *
			   * All values are in px.
			   *
			   * Example:
			   *
			   * ```jsx
			   *   let App = React.createClass({
			   *       render: function () {
			   *         return (
			   *            <Draggable bounds={{right: 300, bottom: 300}}>
			   *              <div>Content</div>
			   *           </Draggable>
			   *         );
			   *       }
			   *   });
			   * ```
			   */
			  bounds: _propTypes.default.oneOfType([_propTypes.default.shape({
			    left: _propTypes.default.number,
			    right: _propTypes.default.number,
			    top: _propTypes.default.number,
			    bottom: _propTypes.default.number
			  }), _propTypes.default.string, _propTypes.default.oneOf([false])]),
			  defaultClassName: _propTypes.default.string,
			  defaultClassNameDragging: _propTypes.default.string,
			  defaultClassNameDragged: _propTypes.default.string,
			  /**
			   * `defaultPosition` specifies the x and y that the dragged item should start at
			   *
			   * Example:
			   *
			   * ```jsx
			   *      let App = React.createClass({
			   *          render: function () {
			   *              return (
			   *                  <Draggable defaultPosition={{x: 25, y: 25}}>
			   *                      <div>I start with transformX: 25px and transformY: 25px;</div>
			   *                  </Draggable>
			   *              );
			   *          }
			   *      });
			   * ```
			   */
			  defaultPosition: _propTypes.default.shape({
			    x: _propTypes.default.number,
			    y: _propTypes.default.number
			  }),
			  positionOffset: _propTypes.default.shape({
			    x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
			    y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
			  }),
			  /**
			   * `position`, if present, defines the current position of the element.
			   *
			   *  This is similar to how form elements in React work - if no `position` is supplied, the component
			   *  is uncontrolled.
			   *
			   * Example:
			   *
			   * ```jsx
			   *      let App = React.createClass({
			   *          render: function () {
			   *              return (
			   *                  <Draggable position={{x: 25, y: 25}}>
			   *                      <div>I start with transformX: 25px and transformY: 25px;</div>
			   *                  </Draggable>
			   *              );
			   *          }
			   *      });
			   * ```
			   */
			  position: _propTypes.default.shape({
			    x: _propTypes.default.number,
			    y: _propTypes.default.number
			  }),
			  /**
			   * These properties should be defined on the child, not here.
			   */
			  className: _shims.dontSetMe,
			  style: _shims.dontSetMe,
			  transform: _shims.dontSetMe
			});
			_defineProperty(Draggable, "defaultProps", {
			  ..._DraggableCore.default.defaultProps,
			  axis: 'both',
			  bounds: false,
			  defaultClassName: 'react-draggable',
			  defaultClassNameDragging: 'react-draggable-dragging',
			  defaultClassNameDragged: 'react-draggable-dragged',
			  defaultPosition: {
			    x: 0,
			    y: 0
			  },
			  scale: 1
			}); 
		} (Draggable$1));
		return Draggable$1;
	}

	var hasRequiredCjs;

	function requireCjs () {
		if (hasRequiredCjs) return cjs.exports;
		hasRequiredCjs = 1;

		const {
		  default: Draggable,
		  DraggableCore
		} = requireDraggable();

		// Previous versions of this lib exported <Draggable> as the root export. As to no-// them, or TypeScript, we export *both* as the root and as 'default'.
		// See https://github.com/mzabriskie/react-draggable/pull/254
		// and https://github.com/mzabriskie/react-draggable/issues/266
		cjs.exports = Draggable;
		cjs.exports.default = Draggable;
		cjs.exports.DraggableCore = DraggableCore;
		return cjs.exports;
	}

	var cjsExports = requireCjs();
	var Draggable = /*@__PURE__*/getDefaultExportFromCjs(cjsExports);

	var jsxRuntime = {exports: {}};

	var reactJsxRuntime_production = {};

	/**
	 * @license React
	 * react-jsx-runtime.production.js
	 *
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var hasRequiredReactJsxRuntime_production;

	function requireReactJsxRuntime_production () {
		if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
		hasRequiredReactJsxRuntime_production = 1;
		var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
		  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
		function jsxProd(type, config, maybeKey) {
		  var key = null;
		  void 0 !== maybeKey && (key = "" + maybeKey);
		  void 0 !== config.key && (key = "" + config.key);
		  if ("key" in config) {
		    maybeKey = {};
		    for (var propName in config)
		      "key" !== propName && (maybeKey[propName] = config[propName]);
		  } else maybeKey = config;
		  config = maybeKey.ref;
		  return {
		    $$typeof: REACT_ELEMENT_TYPE,
		    type: type,
		    key: key,
		    ref: void 0 !== config ? config : null,
		    props: maybeKey
		  };
		}
		reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
		reactJsxRuntime_production.jsx = jsxProd;
		reactJsxRuntime_production.jsxs = jsxProd;
		return reactJsxRuntime_production;
	}

	var hasRequiredJsxRuntime;

	function requireJsxRuntime () {
		if (hasRequiredJsxRuntime) return jsxRuntime.exports;
		hasRequiredJsxRuntime = 1;

		{
		  jsxRuntime.exports = requireReactJsxRuntime_production();
		}
		return jsxRuntime.exports;
	}

	var jsxRuntimeExports = requireJsxRuntime();

	var __assign$2 = function () {
	    __assign$2 = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$2.apply(this, arguments);
	};
	var rowSizeBase = {
	    width: '100%',
	    height: '10px',
	    top: '0px',
	    left: '0px',
	    cursor: 'row-resize',
	};
	var colSizeBase = {
	    width: '10px',
	    height: '100%',
	    top: '0px',
	    left: '0px',
	    cursor: 'col-resize',
	};
	var edgeBase = {
	    width: '20px',
	    height: '20px',
	    position: 'absolute',
	    zIndex: 1,
	};
	var styles = {
	    top: __assign$2(__assign$2({}, rowSizeBase), { top: '-5px' }),
	    right: __assign$2(__assign$2({}, colSizeBase), { left: undefined, right: '-5px' }),
	    bottom: __assign$2(__assign$2({}, rowSizeBase), { top: undefined, bottom: '-5px' }),
	    left: __assign$2(__assign$2({}, colSizeBase), { left: '-5px' }),
	    topRight: __assign$2(__assign$2({}, edgeBase), { right: '-10px', top: '-10px', cursor: 'ne-resize' }),
	    bottomRight: __assign$2(__assign$2({}, edgeBase), { right: '-10px', bottom: '-10px', cursor: 'se-resize' }),
	    bottomLeft: __assign$2(__assign$2({}, edgeBase), { left: '-10px', bottom: '-10px', cursor: 'sw-resize' }),
	    topLeft: __assign$2(__assign$2({}, edgeBase), { left: '-10px', top: '-10px', cursor: 'nw-resize' }),
	};
	var Resizer = React.memo(function (props) {
	    var onResizeStart = props.onResizeStart, direction = props.direction, children = props.children, replaceStyles = props.replaceStyles, className = props.className;
	    var onMouseDown = React.useCallback(function (e) {
	        onResizeStart(e, direction);
	    }, [onResizeStart, direction]);
	    var onTouchStart = React.useCallback(function (e) {
	        onResizeStart(e, direction);
	    }, [onResizeStart, direction]);
	    var style = React.useMemo(function () {
	        return __assign$2(__assign$2({ position: 'absolute', userSelect: 'none' }, styles[direction]), (replaceStyles !== null && replaceStyles !== void 0 ? replaceStyles : {}));
	    }, [replaceStyles, direction]);
	    return (jsxRuntimeExports.jsx("div", { className: className || undefined, style: style, onMouseDown: onMouseDown, onTouchStart: onTouchStart, children: children }));
	});

	var __extends$1 = (function () {
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
	var __assign$1 = function () {
	    __assign$1 = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$1.apply(this, arguments);
	};
	var DEFAULT_SIZE = {
	    width: 'auto',
	    height: 'auto',
	};
	var clamp = function (n, min, max) { return Math.max(Math.min(n, max), min); };
	var snap = function (n, size, gridGap) {
	    var v = Math.round(n / size);
	    return v * size + gridGap * (v - 1);
	};
	var hasDirection = function (dir, target) {
	    return new RegExp(dir, 'i').test(target);
	};
	// INFO: In case of window is a Proxy and does not porxy Events correctly, use isTouchEvent & isMouseEvent to distinguish event type instead of `instanceof`.
	var isTouchEvent = function (event) {
	    return Boolean(event.touches && event.touches.length);
	};
	var isMouseEvent = function (event) {
	    return Boolean((event.clientX || event.clientX === 0) &&
	        (event.clientY || event.clientY === 0));
	};
	var findClosestSnap = function (n, snapArray, snapGap) {
	    if (snapGap === void 0) { snapGap = 0; }
	    var closestGapIndex = snapArray.reduce(function (prev, curr, index) { return (Math.abs(curr - n) < Math.abs(snapArray[prev] - n) ? index : prev); }, 0);
	    var gap = Math.abs(snapArray[closestGapIndex] - n);
	    return snapGap === 0 || gap < snapGap ? snapArray[closestGapIndex] : n;
	};
	var getStringSize = function (n) {
	    n = n.toString();
	    if (n === 'auto') {
	        return n;
	    }
	    if (n.endsWith('px')) {
	        return n;
	    }
	    if (n.endsWith('%')) {
	        return n;
	    }
	    if (n.endsWith('vh')) {
	        return n;
	    }
	    if (n.endsWith('vw')) {
	        return n;
	    }
	    if (n.endsWith('vmax')) {
	        return n;
	    }
	    if (n.endsWith('vmin')) {
	        return n;
	    }
	    return "".concat(n, "px");
	};
	var getPixelSize = function (size, parentSize, innerWidth, innerHeight) {
	    if (size && typeof size === 'string') {
	        if (size.endsWith('px')) {
	            return Number(size.replace('px', ''));
	        }
	        if (size.endsWith('%')) {
	            var ratio = Number(size.replace('%', '')) / 100;
	            return parentSize * ratio;
	        }
	        if (size.endsWith('vw')) {
	            var ratio = Number(size.replace('vw', '')) / 100;
	            return innerWidth * ratio;
	        }
	        if (size.endsWith('vh')) {
	            var ratio = Number(size.replace('vh', '')) / 100;
	            return innerHeight * ratio;
	        }
	    }
	    return size;
	};
	var calculateNewMax = function (parentSize, innerWidth, innerHeight, maxWidth, maxHeight, minWidth, minHeight) {
	    maxWidth = getPixelSize(maxWidth, parentSize.width, innerWidth, innerHeight);
	    maxHeight = getPixelSize(maxHeight, parentSize.height, innerWidth, innerHeight);
	    minWidth = getPixelSize(minWidth, parentSize.width, innerWidth, innerHeight);
	    minHeight = getPixelSize(minHeight, parentSize.height, innerWidth, innerHeight);
	    return {
	        maxWidth: typeof maxWidth === 'undefined' ? undefined : Number(maxWidth),
	        maxHeight: typeof maxHeight === 'undefined' ? undefined : Number(maxHeight),
	        minWidth: typeof minWidth === 'undefined' ? undefined : Number(minWidth),
	        minHeight: typeof minHeight === 'undefined' ? undefined : Number(minHeight),
	    };
	};
	/**
	 * transform T | [T, T] to [T, T]
	 * @param val
	 * @returns
	 */
	// tslint:disable-next-line
	var normalizeToPair = function (val) { return (Array.isArray(val) ? val : [val, val]); };
	var definedProps = [
	    'as',
	    'ref',
	    'style',
	    'className',
	    'grid',
	    'gridGap',
	    'snap',
	    'bounds',
	    'boundsByDirection',
	    'size',
	    'defaultSize',
	    'minWidth',
	    'minHeight',
	    'maxWidth',
	    'maxHeight',
	    'lockAspectRatio',
	    'lockAspectRatioExtraWidth',
	    'lockAspectRatioExtraHeight',
	    'enable',
	    'handleStyles',
	    'handleClasses',
	    'handleWrapperStyle',
	    'handleWrapperClass',
	    'children',
	    'onResizeStart',
	    'onResize',
	    'onResizeStop',
	    'handleComponent',
	    'scale',
	    'resizeRatio',
	    'snapGap',
	];
	// HACK: This class is used to calculate % size.
	var baseClassName = '__resizable_base__';
	var Resizable = /** @class */ (function (_super) {
	    __extends$1(Resizable, _super);
	    function Resizable(props) {
	        var _a, _b, _c, _d;
	        var _this = _super.call(this, props) || this;
	        _this.ratio = 1;
	        _this.resizable = null;
	        // For parent boundary
	        _this.parentLeft = 0;
	        _this.parentTop = 0;
	        // For boundary
	        _this.resizableLeft = 0;
	        _this.resizableRight = 0;
	        _this.resizableTop = 0;
	        _this.resizableBottom = 0;
	        // For target boundary
	        _this.targetLeft = 0;
	        _this.targetTop = 0;
	        _this.delta = {
	            width: 0,
	            height: 0,
	        };
	        _this.appendBase = function () {
	            if (!_this.resizable || !_this.window) {
	                return null;
	            }
	            var parent = _this.parentNode;
	            if (!parent) {
	                return null;
	            }
	            var element = _this.window.document.createElement('div');
	            element.style.width = '100%';
	            element.style.height = '100%';
	            element.style.position = 'absolute';
	            element.style.transform = 'scale(0, 0)';
	            element.style.left = '0';
	            element.style.flex = '0 0 100%';
	            if (element.classList) {
	                element.classList.add(baseClassName);
	            }
	            else {
	                element.className += baseClassName;
	            }
	            parent.appendChild(element);
	            return element;
	        };
	        _this.removeBase = function (base) {
	            var parent = _this.parentNode;
	            if (!parent) {
	                return;
	            }
	            parent.removeChild(base);
	        };
	        _this.state = {
	            isResizing: false,
	            width: (_b = (_a = _this.propsSize) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 'auto',
	            height: (_d = (_c = _this.propsSize) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 'auto',
	            direction: 'right',
	            original: {
	                x: 0,
	                y: 0,
	                width: 0,
	                height: 0,
	            },
	            backgroundStyle: {
	                height: '100%',
	                width: '100%',
	                backgroundColor: 'rgba(0,0,0,0)',
	                cursor: 'auto',
	                opacity: 0,
	                position: 'fixed',
	                zIndex: 9999,
	                top: '0',
	                left: '0',
	                bottom: '0',
	                right: '0',
	            },
	            flexBasis: undefined,
	        };
	        _this.onResizeStart = _this.onResizeStart.bind(_this);
	        _this.onMouseMove = _this.onMouseMove.bind(_this);
	        _this.onMouseUp = _this.onMouseUp.bind(_this);
	        return _this;
	    }
	    Object.defineProperty(Resizable.prototype, "parentNode", {
	        get: function () {
	            if (!this.resizable) {
	                return null;
	            }
	            return this.resizable.parentNode;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Resizable.prototype, "window", {
	        get: function () {
	            if (!this.resizable) {
	                return null;
	            }
	            if (!this.resizable.ownerDocument) {
	                return null;
	            }
	            return this.resizable.ownerDocument.defaultView;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Resizable.prototype, "propsSize", {
	        get: function () {
	            return this.props.size || this.props.defaultSize || DEFAULT_SIZE;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Resizable.prototype, "size", {
	        get: function () {
	            var width = 0;
	            var height = 0;
	            if (this.resizable && this.window) {
	                var orgWidth = this.resizable.offsetWidth;
	                var orgHeight = this.resizable.offsetHeight;
	                // HACK: Set position `relative` to get parent size.
	                //       This is because when re-resizable set `absolute`, I can not get base width correctly.
	                var orgPosition = this.resizable.style.position;
	                if (orgPosition !== 'relative') {
	                    this.resizable.style.position = 'relative';
	                }
	                // INFO: Use original width or height if set auto.
	                width = this.resizable.style.width !== 'auto' ? this.resizable.offsetWidth : orgWidth;
	                height = this.resizable.style.height !== 'auto' ? this.resizable.offsetHeight : orgHeight;
	                // Restore original position
	                this.resizable.style.position = orgPosition;
	            }
	            return { width: width, height: height };
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Resizable.prototype, "sizeStyle", {
	        get: function () {
	            var _this = this;
	            var size = this.props.size;
	            var getSize = function (key) {
	                var _a;
	                if (typeof _this.state[key] === 'undefined' || _this.state[key] === 'auto') {
	                    return 'auto';
	                }
	                if (_this.propsSize && _this.propsSize[key] && ((_a = _this.propsSize[key]) === null || _a === void 0 ? void 0 : _a.toString().endsWith('%'))) {
	                    if (_this.state[key].toString().endsWith('%')) {
	                        return _this.state[key].toString();
	                    }
	                    var parentSize = _this.getParentSize();
	                    var value = Number(_this.state[key].toString().replace('px', ''));
	                    var percent = (value / parentSize[key]) * 100;
	                    return "".concat(percent, "%");
	                }
	                return getStringSize(_this.state[key]);
	            };
	            var width = size && typeof size.width !== 'undefined' && !this.state.isResizing
	                ? getStringSize(size.width)
	                : getSize('width');
	            var height = size && typeof size.height !== 'undefined' && !this.state.isResizing
	                ? getStringSize(size.height)
	                : getSize('height');
	            return { width: width, height: height };
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Resizable.prototype.getParentSize = function () {
	        if (!this.parentNode) {
	            if (!this.window) {
	                return { width: 0, height: 0 };
	            }
	            return { width: this.window.innerWidth, height: this.window.innerHeight };
	        }
	        var base = this.appendBase();
	        if (!base) {
	            return { width: 0, height: 0 };
	        }
	        // INFO: To calculate parent width with flex layout
	        var wrapChanged = false;
	        var wrap = this.parentNode.style.flexWrap;
	        if (wrap !== 'wrap') {
	            wrapChanged = true;
	            this.parentNode.style.flexWrap = 'wrap';
	            // HACK: Use relative to get parent padding size
	        }
	        base.style.position = 'relative';
	        base.style.minWidth = '100%';
	        base.style.minHeight = '100%';
	        var size = {
	            width: base.offsetWidth,
	            height: base.offsetHeight,
	        };
	        if (wrapChanged) {
	            this.parentNode.style.flexWrap = wrap;
	        }
	        this.removeBase(base);
	        return size;
	    };
	    Resizable.prototype.bindEvents = function () {
	        if (this.window) {
	            this.window.addEventListener('mouseup', this.onMouseUp);
	            this.window.addEventListener('mousemove', this.onMouseMove);
	            this.window.addEventListener('mouseleave', this.onMouseUp);
	            this.window.addEventListener('touchmove', this.onMouseMove, {
	                capture: true,
	                passive: false,
	            });
	            this.window.addEventListener('touchend', this.onMouseUp);
	        }
	    };
	    Resizable.prototype.unbindEvents = function () {
	        if (this.window) {
	            this.window.removeEventListener('mouseup', this.onMouseUp);
	            this.window.removeEventListener('mousemove', this.onMouseMove);
	            this.window.removeEventListener('mouseleave', this.onMouseUp);
	            this.window.removeEventListener('touchmove', this.onMouseMove, true);
	            this.window.removeEventListener('touchend', this.onMouseUp);
	        }
	    };
	    Resizable.prototype.componentDidMount = function () {
	        if (!this.resizable || !this.window) {
	            return;
	        }
	        var computedStyle = this.window.getComputedStyle(this.resizable);
	        this.setState({
	            width: this.state.width || this.size.width,
	            height: this.state.height || this.size.height,
	            flexBasis: computedStyle.flexBasis !== 'auto' ? computedStyle.flexBasis : undefined,
	        });
	    };
	    Resizable.prototype.componentWillUnmount = function () {
	        if (this.window) {
	            this.unbindEvents();
	        }
	    };
	    Resizable.prototype.createSizeForCssProperty = function (newSize, kind) {
	        var propsSize = this.propsSize && this.propsSize[kind];
	        return this.state[kind] === 'auto' &&
	            this.state.original[kind] === newSize &&
	            (typeof propsSize === 'undefined' || propsSize === 'auto')
	            ? 'auto'
	            : newSize;
	    };
	    Resizable.prototype.calculateNewMaxFromBoundary = function (maxWidth, maxHeight) {
	        var boundsByDirection = this.props.boundsByDirection;
	        var direction = this.state.direction;
	        var widthByDirection = boundsByDirection && hasDirection('left', direction);
	        var heightByDirection = boundsByDirection && hasDirection('top', direction);
	        var boundWidth;
	        var boundHeight;
	        if (this.props.bounds === 'parent') {
	            var parent_1 = this.parentNode;
	            if (parent_1) {
	                boundWidth = widthByDirection
	                    ? this.resizableRight - this.parentLeft
	                    : parent_1.offsetWidth + (this.parentLeft - this.resizableLeft);
	                boundHeight = heightByDirection
	                    ? this.resizableBottom - this.parentTop
	                    : parent_1.offsetHeight + (this.parentTop - this.resizableTop);
	            }
	        }
	        else if (this.props.bounds === 'window') {
	            if (this.window) {
	                boundWidth = widthByDirection ? this.resizableRight : this.window.innerWidth - this.resizableLeft;
	                boundHeight = heightByDirection ? this.resizableBottom : this.window.innerHeight - this.resizableTop;
	            }
	        }
	        else if (this.props.bounds) {
	            boundWidth = widthByDirection
	                ? this.resizableRight - this.targetLeft
	                : this.props.bounds.offsetWidth + (this.targetLeft - this.resizableLeft);
	            boundHeight = heightByDirection
	                ? this.resizableBottom - this.targetTop
	                : this.props.bounds.offsetHeight + (this.targetTop - this.resizableTop);
	        }
	        if (boundWidth && Number.isFinite(boundWidth)) {
	            maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
	        }
	        if (boundHeight && Number.isFinite(boundHeight)) {
	            maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
	        }
	        return { maxWidth: maxWidth, maxHeight: maxHeight };
	    };
	    Resizable.prototype.calculateNewSizeFromDirection = function (clientX, clientY) {
	        var scale = this.props.scale || 1;
	        var _a = normalizeToPair(this.props.resizeRatio || 1), resizeRatioX = _a[0], resizeRatioY = _a[1];
	        var _b = this.state, direction = _b.direction, original = _b.original;
	        var _c = this.props, lockAspectRatio = _c.lockAspectRatio, lockAspectRatioExtraHeight = _c.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _c.lockAspectRatioExtraWidth;
	        var newWidth = original.width;
	        var newHeight = original.height;
	        var extraHeight = lockAspectRatioExtraHeight || 0;
	        var extraWidth = lockAspectRatioExtraWidth || 0;
	        if (hasDirection('right', direction)) {
	            newWidth = original.width + ((clientX - original.x) * resizeRatioX) / scale;
	            if (lockAspectRatio) {
	                newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
	            }
	        }
	        if (hasDirection('left', direction)) {
	            newWidth = original.width - ((clientX - original.x) * resizeRatioX) / scale;
	            if (lockAspectRatio) {
	                newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
	            }
	        }
	        if (hasDirection('bottom', direction)) {
	            newHeight = original.height + ((clientY - original.y) * resizeRatioY) / scale;
	            if (lockAspectRatio) {
	                newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
	            }
	        }
	        if (hasDirection('top', direction)) {
	            newHeight = original.height - ((clientY - original.y) * resizeRatioY) / scale;
	            if (lockAspectRatio) {
	                newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
	            }
	        }
	        return { newWidth: newWidth, newHeight: newHeight };
	    };
	    Resizable.prototype.calculateNewSizeFromAspectRatio = function (newWidth, newHeight, max, min) {
	        var _a = this.props, lockAspectRatio = _a.lockAspectRatio, lockAspectRatioExtraHeight = _a.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _a.lockAspectRatioExtraWidth;
	        var computedMinWidth = typeof min.width === 'undefined' ? 10 : min.width;
	        var computedMaxWidth = typeof max.width === 'undefined' || max.width < 0 ? newWidth : max.width;
	        var computedMinHeight = typeof min.height === 'undefined' ? 10 : min.height;
	        var computedMaxHeight = typeof max.height === 'undefined' || max.height < 0 ? newHeight : max.height;
	        var extraHeight = lockAspectRatioExtraHeight || 0;
	        var extraWidth = lockAspectRatioExtraWidth || 0;
	        if (lockAspectRatio) {
	            var extraMinWidth = (computedMinHeight - extraHeight) * this.ratio + extraWidth;
	            var extraMaxWidth = (computedMaxHeight - extraHeight) * this.ratio + extraWidth;
	            var extraMinHeight = (computedMinWidth - extraWidth) / this.ratio + extraHeight;
	            var extraMaxHeight = (computedMaxWidth - extraWidth) / this.ratio + extraHeight;
	            var lockedMinWidth = Math.max(computedMinWidth, extraMinWidth);
	            var lockedMaxWidth = Math.min(computedMaxWidth, extraMaxWidth);
	            var lockedMinHeight = Math.max(computedMinHeight, extraMinHeight);
	            var lockedMaxHeight = Math.min(computedMaxHeight, extraMaxHeight);
	            newWidth = clamp(newWidth, lockedMinWidth, lockedMaxWidth);
	            newHeight = clamp(newHeight, lockedMinHeight, lockedMaxHeight);
	        }
	        else {
	            newWidth = clamp(newWidth, computedMinWidth, computedMaxWidth);
	            newHeight = clamp(newHeight, computedMinHeight, computedMaxHeight);
	        }
	        return { newWidth: newWidth, newHeight: newHeight };
	    };
	    Resizable.prototype.setBoundingClientRect = function () {
	        var adjustedScale = 1 / (this.props.scale || 1);
	        // For parent boundary
	        if (this.props.bounds === 'parent') {
	            var parent_2 = this.parentNode;
	            if (parent_2) {
	                var parentRect = parent_2.getBoundingClientRect();
	                this.parentLeft = parentRect.left * adjustedScale;
	                this.parentTop = parentRect.top * adjustedScale;
	            }
	        }
	        // For target(html element) boundary
	        if (this.props.bounds && typeof this.props.bounds !== 'string') {
	            var targetRect = this.props.bounds.getBoundingClientRect();
	            this.targetLeft = targetRect.left * adjustedScale;
	            this.targetTop = targetRect.top * adjustedScale;
	        }
	        // For boundary
	        if (this.resizable) {
	            var _a = this.resizable.getBoundingClientRect(), left = _a.left, top_1 = _a.top, right = _a.right, bottom = _a.bottom;
	            this.resizableLeft = left * adjustedScale;
	            this.resizableRight = right * adjustedScale;
	            this.resizableTop = top_1 * adjustedScale;
	            this.resizableBottom = bottom * adjustedScale;
	        }
	    };
	    Resizable.prototype.onResizeStart = function (event, direction) {
	        if (!this.resizable || !this.window) {
	            return;
	        }
	        var clientX = 0;
	        var clientY = 0;
	        if (event.nativeEvent && isMouseEvent(event.nativeEvent)) {
	            clientX = event.nativeEvent.clientX;
	            clientY = event.nativeEvent.clientY;
	        }
	        else if (event.nativeEvent && isTouchEvent(event.nativeEvent)) {
	            clientX = event.nativeEvent.touches[0].clientX;
	            clientY = event.nativeEvent.touches[0].clientY;
	        }
	        if (this.props.onResizeStart) {
	            if (this.resizable) {
	                var startResize = this.props.onResizeStart(event, direction, this.resizable);
	                if (startResize === false) {
	                    return;
	                }
	            }
	        }
	        // Fix #168
	        if (this.props.size) {
	            if (typeof this.props.size.height !== 'undefined' && this.props.size.height !== this.state.height) {
	                this.setState({ height: this.props.size.height });
	            }
	            if (typeof this.props.size.width !== 'undefined' && this.props.size.width !== this.state.width) {
	                this.setState({ width: this.props.size.width });
	            }
	        }
	        // For lockAspectRatio case
	        this.ratio =
	            typeof this.props.lockAspectRatio === 'number' ? this.props.lockAspectRatio : this.size.width / this.size.height;
	        var flexBasis;
	        var computedStyle = this.window.getComputedStyle(this.resizable);
	        if (computedStyle.flexBasis !== 'auto') {
	            var parent_3 = this.parentNode;
	            if (parent_3) {
	                var dir = this.window.getComputedStyle(parent_3).flexDirection;
	                this.flexDir = dir.startsWith('row') ? 'row' : 'column';
	                flexBasis = computedStyle.flexBasis;
	            }
	        }
	        // For boundary
	        this.setBoundingClientRect();
	        this.bindEvents();
	        var state = {
	            original: {
	                x: clientX,
	                y: clientY,
	                width: this.size.width,
	                height: this.size.height,
	            },
	            isResizing: true,
	            backgroundStyle: __assign$1(__assign$1({}, this.state.backgroundStyle), { cursor: this.window.getComputedStyle(event.target).cursor || 'auto' }),
	            direction: direction,
	            flexBasis: flexBasis,
	        };
	        this.setState(state);
	    };
	    Resizable.prototype.onMouseMove = function (event) {
	        var _this = this;
	        if (!this.state.isResizing || !this.resizable || !this.window) {
	            return;
	        }
	        if (this.window.TouchEvent && isTouchEvent(event)) {
	            try {
	                event.preventDefault();
	                event.stopPropagation();
	            }
	            catch (e) {
	                // Ignore on fail
	            }
	        }
	        var _a = this.props, maxWidth = _a.maxWidth, maxHeight = _a.maxHeight, minWidth = _a.minWidth, minHeight = _a.minHeight;
	        var clientX = isTouchEvent(event) ? event.touches[0].clientX : event.clientX;
	        var clientY = isTouchEvent(event) ? event.touches[0].clientY : event.clientY;
	        var _b = this.state, direction = _b.direction, original = _b.original, width = _b.width, height = _b.height;
	        var parentSize = this.getParentSize();
	        var max = calculateNewMax(parentSize, this.window.innerWidth, this.window.innerHeight, maxWidth, maxHeight, minWidth, minHeight);
	        maxWidth = max.maxWidth;
	        maxHeight = max.maxHeight;
	        minWidth = max.minWidth;
	        minHeight = max.minHeight;
	        // Calculate new size
	        var _c = this.calculateNewSizeFromDirection(clientX, clientY), newHeight = _c.newHeight, newWidth = _c.newWidth;
	        // Calculate max size from boundary settings
	        var boundaryMax = this.calculateNewMaxFromBoundary(maxWidth, maxHeight);
	        if (this.props.snap && this.props.snap.x) {
	            newWidth = findClosestSnap(newWidth, this.props.snap.x, this.props.snapGap);
	        }
	        if (this.props.snap && this.props.snap.y) {
	            newHeight = findClosestSnap(newHeight, this.props.snap.y, this.props.snapGap);
	        }
	        // Calculate new size from aspect ratio
	        var newSize = this.calculateNewSizeFromAspectRatio(newWidth, newHeight, { width: boundaryMax.maxWidth, height: boundaryMax.maxHeight }, { width: minWidth, height: minHeight });
	        newWidth = newSize.newWidth;
	        newHeight = newSize.newHeight;
	        if (this.props.grid) {
	            var newGridWidth = snap(newWidth, this.props.grid[0], this.props.gridGap ? this.props.gridGap[0] : 0);
	            var newGridHeight = snap(newHeight, this.props.grid[1], this.props.gridGap ? this.props.gridGap[1] : 0);
	            var gap = this.props.snapGap || 0;
	            var w = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth;
	            var h = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
	            newWidth = w;
	            newHeight = h;
	        }
	        var delta = {
	            width: newWidth - original.width,
	            height: newHeight - original.height,
	        };
	        this.delta = delta;
	        if (width && typeof width === 'string') {
	            if (width.endsWith('%')) {
	                var percent = (newWidth / parentSize.width) * 100;
	                newWidth = "".concat(percent, "%");
	            }
	            else if (width.endsWith('vw')) {
	                var vw = (newWidth / this.window.innerWidth) * 100;
	                newWidth = "".concat(vw, "vw");
	            }
	            else if (width.endsWith('vh')) {
	                var vh = (newWidth / this.window.innerHeight) * 100;
	                newWidth = "".concat(vh, "vh");
	            }
	        }
	        if (height && typeof height === 'string') {
	            if (height.endsWith('%')) {
	                var percent = (newHeight / parentSize.height) * 100;
	                newHeight = "".concat(percent, "%");
	            }
	            else if (height.endsWith('vw')) {
	                var vw = (newHeight / this.window.innerWidth) * 100;
	                newHeight = "".concat(vw, "vw");
	            }
	            else if (height.endsWith('vh')) {
	                var vh = (newHeight / this.window.innerHeight) * 100;
	                newHeight = "".concat(vh, "vh");
	            }
	        }
	        var newState = {
	            width: this.createSizeForCssProperty(newWidth, 'width'),
	            height: this.createSizeForCssProperty(newHeight, 'height'),
	        };
	        if (this.flexDir === 'row') {
	            newState.flexBasis = newState.width;
	        }
	        else if (this.flexDir === 'column') {
	            newState.flexBasis = newState.height;
	        }
	        var widthChanged = this.state.width !== newState.width;
	        var heightChanged = this.state.height !== newState.height;
	        var flexBaseChanged = this.state.flexBasis !== newState.flexBasis;
	        var changed = widthChanged || heightChanged || flexBaseChanged;
	        if (changed) {
	            // For v18, update state sync
	            require$$2.flushSync(function () {
	                _this.setState(newState);
	            });
	        }
	        if (this.props.onResize) {
	            if (changed) {
	                this.props.onResize(event, direction, this.resizable, delta);
	            }
	        }
	    };
	    Resizable.prototype.onMouseUp = function (event) {
	        var _a, _b;
	        var _c = this.state, isResizing = _c.isResizing, direction = _c.direction; _c.original;
	        if (!isResizing || !this.resizable) {
	            return;
	        }
	        if (this.props.onResizeStop) {
	            this.props.onResizeStop(event, direction, this.resizable, this.delta);
	        }
	        if (this.props.size) {
	            this.setState({ width: (_a = this.props.size.width) !== null && _a !== void 0 ? _a : 'auto', height: (_b = this.props.size.height) !== null && _b !== void 0 ? _b : 'auto' });
	        }
	        this.unbindEvents();
	        this.setState({
	            isResizing: false,
	            backgroundStyle: __assign$1(__assign$1({}, this.state.backgroundStyle), { cursor: 'auto' }),
	        });
	    };
	    Resizable.prototype.updateSize = function (size) {
	        var _a, _b;
	        this.setState({ width: (_a = size.width) !== null && _a !== void 0 ? _a : 'auto', height: (_b = size.height) !== null && _b !== void 0 ? _b : 'auto' });
	    };
	    Resizable.prototype.renderResizer = function () {
	        var _this = this;
	        var _a = this.props, enable = _a.enable, handleStyles = _a.handleStyles, handleClasses = _a.handleClasses, handleWrapperStyle = _a.handleWrapperStyle, handleWrapperClass = _a.handleWrapperClass, handleComponent = _a.handleComponent;
	        if (!enable) {
	            return null;
	        }
	        var resizers = Object.keys(enable).map(function (dir) {
	            if (enable[dir] !== false) {
	                return (jsxRuntimeExports.jsx(Resizer, { direction: dir, onResizeStart: _this.onResizeStart, replaceStyles: handleStyles && handleStyles[dir], className: handleClasses && handleClasses[dir], children: handleComponent && handleComponent[dir] ? handleComponent[dir] : null }, dir));
	            }
	            return null;
	        });
	        // #93 Wrap the resize box in span (will not break 100% width/height)
	        return (jsxRuntimeExports.jsx("div", { className: handleWrapperClass, style: handleWrapperStyle, children: resizers }));
	    };
	    Resizable.prototype.render = function () {
	        var _this = this;
	        var extendsProps = Object.keys(this.props).reduce(function (acc, key) {
	            if (definedProps.indexOf(key) !== -1) {
	                return acc;
	            }
	            acc[key] = _this.props[key];
	            return acc;
	        }, {});
	        var style = __assign$1(__assign$1(__assign$1({ position: 'relative', userSelect: this.state.isResizing ? 'none' : 'auto' }, this.props.style), this.sizeStyle), { maxWidth: this.props.maxWidth, maxHeight: this.props.maxHeight, minWidth: this.props.minWidth, minHeight: this.props.minHeight, boxSizing: 'border-box', flexShrink: 0 });
	        if (this.state.flexBasis) {
	            style.flexBasis = this.state.flexBasis;
	        }
	        var Wrapper = this.props.as || 'div';
	        return (jsxRuntimeExports.jsxs(Wrapper, __assign$1({ style: style, className: this.props.className }, extendsProps, { 
	            // `ref` is after `extendsProps` to ensure this one wins over a version
	            // passed in
	            ref: function (c) {
	                if (c) {
	                    _this.resizable = c;
	                }
	            }, children: [this.state.isResizing && jsxRuntimeExports.jsx("div", { style: this.state.backgroundStyle }), this.props.children, this.renderResizer()] })));
	    };
	    Resizable.defaultProps = {
	        as: 'div',
	        onResizeStart: function () { },
	        onResize: function () { },
	        onResizeStop: function () { },
	        enable: {
	            top: true,
	            right: true,
	            bottom: true,
	            left: true,
	            topRight: true,
	            bottomRight: true,
	            bottomLeft: true,
	            topLeft: true,
	        },
	        style: {},
	        grid: [1, 1],
	        gridGap: [0, 0],
	        lockAspectRatio: false,
	        lockAspectRatioExtraWidth: 0,
	        lockAspectRatioExtraHeight: 0,
	        scale: 1,
	        resizeRatio: 1,
	        snapGap: 0,
	    };
	    return Resizable;
	}(React.PureComponent));

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

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

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	}

	var resizableStyle = {
	    width: "auto",
	    height: "auto",
	    display: "inline-block",
	    position: "absolute",
	    top: 0,
	    left: 0,
	};
	var getEnableResizingByFlag = function (flag) { return ({
	    bottom: flag,
	    bottomLeft: flag,
	    bottomRight: flag,
	    left: flag,
	    right: flag,
	    top: flag,
	    topLeft: flag,
	    topRight: flag,
	}); };
	var Rnd = /** @class */ (function (_super) {
	    __extends(Rnd, _super);
	    function Rnd(props) {
	        var _this = _super.call(this, props) || this;
	        _this.resizingPosition = { x: 0, y: 0 };
	        _this.offsetFromParent = { left: 0, top: 0 };
	        _this.resizableElement = { current: null };
	        _this.originalPosition = { x: 0, y: 0 };
	        _this.state = {
	            resizing: false,
	            bounds: {
	                top: 0,
	                right: 0,
	                bottom: 0,
	                left: 0,
	            },
	            maxWidth: props.maxWidth,
	            maxHeight: props.maxHeight,
	        };
	        _this.onResizeStart = _this.onResizeStart.bind(_this);
	        _this.onResize = _this.onResize.bind(_this);
	        _this.onResizeStop = _this.onResizeStop.bind(_this);
	        _this.onDragStart = _this.onDragStart.bind(_this);
	        _this.onDrag = _this.onDrag.bind(_this);
	        _this.onDragStop = _this.onDragStop.bind(_this);
	        _this.getMaxSizesFromProps = _this.getMaxSizesFromProps.bind(_this);
	        return _this;
	    }
	    Rnd.prototype.componentDidMount = function () {
	        this.updateOffsetFromParent();
	        var _a = this.offsetFromParent, left = _a.left, top = _a.top;
	        var _b = this.getDraggablePosition(), x = _b.x, y = _b.y;
	        this.draggable.setState({
	            x: x - left,
	            y: y - top,
	        });
	        // HACK: Apply position adjustment
	        this.forceUpdate();
	    };
	    // HACK: To get `react-draggable` state x and y.
	    Rnd.prototype.getDraggablePosition = function () {
	        var _a = this.draggable.state, x = _a.x, y = _a.y;
	        return { x: x, y: y };
	    };
	    Rnd.prototype.getParent = function () {
	        return this.resizable && this.resizable.parentNode;
	    };
	    Rnd.prototype.getParentSize = function () {
	        return this.resizable.getParentSize();
	    };
	    Rnd.prototype.getMaxSizesFromProps = function () {
	        var maxWidth = typeof this.props.maxWidth === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxWidth;
	        var maxHeight = typeof this.props.maxHeight === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxHeight;
	        return { maxWidth: maxWidth, maxHeight: maxHeight };
	    };
	    Rnd.prototype.getSelfElement = function () {
	        return this.resizable && this.resizable.resizable;
	    };
	    Rnd.prototype.getOffsetHeight = function (boundary) {
	        var scale = this.props.scale;
	        switch (this.props.bounds) {
	            case "window":
	                return window.innerHeight / scale;
	            case "body":
	                return document.body.offsetHeight / scale;
	            default:
	                return boundary.offsetHeight;
	        }
	    };
	    Rnd.prototype.getOffsetWidth = function (boundary) {
	        var scale = this.props.scale;
	        switch (this.props.bounds) {
	            case "window":
	                return window.innerWidth / scale;
	            case "body":
	                return document.body.offsetWidth / scale;
	            default:
	                return boundary.offsetWidth;
	        }
	    };
	    Rnd.prototype.onDragStart = function (e, data) {
	        if (this.props.onDragStart) {
	            this.props.onDragStart(e, data);
	        }
	        var pos = this.getDraggablePosition();
	        this.originalPosition = pos;
	        if (!this.props.bounds)
	            return;
	        var parent = this.getParent();
	        var scale = this.props.scale;
	        var boundary;
	        if (this.props.bounds === "parent") {
	            boundary = parent;
	        }
	        else if (this.props.bounds === "body") {
	            var parentRect_1 = parent.getBoundingClientRect();
	            var parentLeft_1 = parentRect_1.left;
	            var parentTop_1 = parentRect_1.top;
	            var bodyRect = document.body.getBoundingClientRect();
	            var left_1 = -(parentLeft_1 - parent.offsetLeft * scale - bodyRect.left) / scale;
	            var top_1 = -(parentTop_1 - parent.offsetTop * scale - bodyRect.top) / scale;
	            var right = (document.body.offsetWidth - this.resizable.size.width * scale) / scale + left_1;
	            var bottom = (document.body.offsetHeight - this.resizable.size.height * scale) / scale + top_1;
	            return this.setState({ bounds: { top: top_1, right: right, bottom: bottom, left: left_1 } });
	        }
	        else if (this.props.bounds === "window") {
	            if (!this.resizable)
	                return;
	            var parentRect_2 = parent.getBoundingClientRect();
	            var parentLeft_2 = parentRect_2.left;
	            var parentTop_2 = parentRect_2.top;
	            var left_2 = -(parentLeft_2 - parent.offsetLeft * scale) / scale;
	            var top_2 = -(parentTop_2 - parent.offsetTop * scale) / scale;
	            var right = (window.innerWidth - this.resizable.size.width * scale) / scale + left_2;
	            var bottom = (window.innerHeight - this.resizable.size.height * scale) / scale + top_2;
	            return this.setState({ bounds: { top: top_2, right: right, bottom: bottom, left: left_2 } });
	        }
	        else if (typeof this.props.bounds === "string") {
	            boundary = document.querySelector(this.props.bounds);
	        }
	        else if (this.props.bounds instanceof HTMLElement) {
	            boundary = this.props.bounds;
	        }
	        if (!(boundary instanceof HTMLElement) || !(parent instanceof HTMLElement)) {
	            return;
	        }
	        var boundaryRect = boundary.getBoundingClientRect();
	        var boundaryLeft = boundaryRect.left;
	        var boundaryTop = boundaryRect.top;
	        var parentRect = parent.getBoundingClientRect();
	        var parentLeft = parentRect.left;
	        var parentTop = parentRect.top;
	        var left = (boundaryLeft - parentLeft) / scale;
	        var top = boundaryTop - parentTop;
	        if (!this.resizable)
	            return;
	        this.updateOffsetFromParent();
	        var offset = this.offsetFromParent;
	        this.setState({
	            bounds: {
	                top: top - offset.top,
	                right: left + (boundary.offsetWidth - this.resizable.size.width) - offset.left / scale,
	                bottom: top + (boundary.offsetHeight - this.resizable.size.height) - offset.top,
	                left: left - offset.left / scale,
	            },
	        });
	    };
	    Rnd.prototype.onDrag = function (e, data) {
	        if (!this.props.onDrag)
	            return;
	        var _a = this.offsetFromParent, left = _a.left, top = _a.top;
	        if (!this.props.dragAxis || this.props.dragAxis === "both") {
	            return this.props.onDrag(e, __assign(__assign({}, data), { x: data.x + left, y: data.y + top }));
	        }
	        else if (this.props.dragAxis === "x") {
	            return this.props.onDrag(e, __assign(__assign({}, data), { x: data.x + left, y: this.originalPosition.y + top, deltaY: 0 }));
	        }
	        else if (this.props.dragAxis === "y") {
	            return this.props.onDrag(e, __assign(__assign({}, data), { x: this.originalPosition.x + left, y: data.y + top, deltaX: 0 }));
	        }
	    };
	    Rnd.prototype.onDragStop = function (e, data) {
	        if (!this.props.onDragStop)
	            return;
	        var _a = this.offsetFromParent, left = _a.left, top = _a.top;
	        if (!this.props.dragAxis || this.props.dragAxis === "both") {
	            return this.props.onDragStop(e, __assign(__assign({}, data), { x: data.x + left, y: data.y + top }));
	        }
	        else if (this.props.dragAxis === "x") {
	            return this.props.onDragStop(e, __assign(__assign({}, data), { x: data.x + left, y: this.originalPosition.y + top, deltaY: 0 }));
	        }
	        else if (this.props.dragAxis === "y") {
	            return this.props.onDragStop(e, __assign(__assign({}, data), { x: this.originalPosition.x + left, y: data.y + top, deltaX: 0 }));
	        }
	    };
	    Rnd.prototype.onResizeStart = function (e, dir, elementRef) {
	        e.stopPropagation();
	        this.setState({
	            resizing: true,
	        });
	        var scale = this.props.scale;
	        var offset = this.offsetFromParent;
	        var pos = this.getDraggablePosition();
	        this.resizingPosition = { x: pos.x + offset.left, y: pos.y + offset.top };
	        this.originalPosition = pos;
	        if (this.props.bounds) {
	            var parent_1 = this.getParent();
	            var boundary = void 0;
	            if (this.props.bounds === "parent") {
	                boundary = parent_1;
	            }
	            else if (this.props.bounds === "body") {
	                boundary = document.body;
	            }
	            else if (this.props.bounds === "window") {
	                boundary = window;
	            }
	            else if (typeof this.props.bounds === "string") {
	                boundary = document.querySelector(this.props.bounds);
	            }
	            else if (this.props.bounds instanceof HTMLElement) {
	                boundary = this.props.bounds;
	            }
	            var self_1 = this.getSelfElement();
	            if (self_1 instanceof Element &&
	                (boundary instanceof HTMLElement || boundary === window) &&
	                parent_1 instanceof HTMLElement) {
	                var _a = this.getMaxSizesFromProps(), maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
	                var parentSize = this.getParentSize();
	                if (maxWidth && typeof maxWidth === "string") {
	                    if (maxWidth.endsWith("%")) {
	                        var ratio = Number(maxWidth.replace("%", "")) / 100;
	                        maxWidth = parentSize.width * ratio;
	                    }
	                    else if (maxWidth.endsWith("px")) {
	                        maxWidth = Number(maxWidth.replace("px", ""));
	                    }
	                }
	                if (maxHeight && typeof maxHeight === "string") {
	                    if (maxHeight.endsWith("%")) {
	                        var ratio = Number(maxHeight.replace("%", "")) / 100;
	                        maxHeight = parentSize.height * ratio;
	                    }
	                    else if (maxHeight.endsWith("px")) {
	                        maxHeight = Number(maxHeight.replace("px", ""));
	                    }
	                }
	                var selfRect = self_1.getBoundingClientRect();
	                var selfLeft = selfRect.left;
	                var selfTop = selfRect.top;
	                var boundaryRect = this.props.bounds === "window" ? { left: 0, top: 0 } : boundary.getBoundingClientRect();
	                var boundaryLeft = boundaryRect.left;
	                var boundaryTop = boundaryRect.top;
	                var offsetWidth = this.getOffsetWidth(boundary);
	                var offsetHeight = this.getOffsetHeight(boundary);
	                var hasLeft = dir.toLowerCase().endsWith("left");
	                var hasRight = dir.toLowerCase().endsWith("right");
	                var hasTop = dir.startsWith("top");
	                var hasBottom = dir.startsWith("bottom");
	                if ((hasLeft || hasTop) && this.resizable) {
	                    var max = (selfLeft - boundaryLeft) / scale + this.resizable.size.width;
	                    this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
	                }
	                // INFO: To set bounds in `lock aspect ratio with bounds` case. See also that story.
	                if (hasRight || (this.props.lockAspectRatio && !hasLeft && !hasTop)) {
	                    var max = offsetWidth + (boundaryLeft - selfLeft) / scale;
	                    this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
	                }
	                if ((hasTop || hasLeft) && this.resizable) {
	                    var max = (selfTop - boundaryTop) / scale + this.resizable.size.height;
	                    this.setState({
	                        maxHeight: max > Number(maxHeight) ? maxHeight : max,
	                    });
	                }
	                // INFO: To set bounds in `lock aspect ratio with bounds` case. See also that story.
	                if (hasBottom || (this.props.lockAspectRatio && !hasTop && !hasLeft)) {
	                    var max = offsetHeight + (boundaryTop - selfTop) / scale;
	                    this.setState({
	                        maxHeight: max > Number(maxHeight) ? maxHeight : max,
	                    });
	                }
	            }
	        }
	        else {
	            this.setState({
	                maxWidth: this.props.maxWidth,
	                maxHeight: this.props.maxHeight,
	            });
	        }
	        if (this.props.onResizeStart) {
	            this.props.onResizeStart(e, dir, elementRef);
	        }
	    };
	    Rnd.prototype.onResize = function (e, direction, elementRef, delta) {
	        var _this = this;
	        // INFO: Apply x and y position adjustments caused by resizing to draggable
	        var newPos = { x: this.originalPosition.x, y: this.originalPosition.y };
	        var left = -delta.width;
	        var top = -delta.height;
	        var directions = ["top", "left", "topLeft", "bottomLeft", "topRight"];
	        if (directions.includes(direction)) {
	            if (direction === "bottomLeft") {
	                newPos.x += left;
	            }
	            else if (direction === "topRight") {
	                newPos.y += top;
	            }
	            else {
	                newPos.x += left;
	                newPos.y += top;
	            }
	        }
	        var draggableState = this.draggable.state;
	        if (newPos.x !== draggableState.x || newPos.y !== draggableState.y) {
	            require$$2.flushSync(function () {
	                _this.draggable.setState(newPos);
	            });
	        }
	        this.updateOffsetFromParent();
	        var offset = this.offsetFromParent;
	        var x = this.getDraggablePosition().x + offset.left;
	        var y = this.getDraggablePosition().y + offset.top;
	        this.resizingPosition = { x: x, y: y };
	        if (!this.props.onResize)
	            return;
	        this.props.onResize(e, direction, elementRef, delta, {
	            x: x,
	            y: y,
	        });
	    };
	    Rnd.prototype.onResizeStop = function (e, direction, elementRef, delta) {
	        this.setState({
	            resizing: false,
	        });
	        var _a = this.getMaxSizesFromProps(), maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
	        this.setState({ maxWidth: maxWidth, maxHeight: maxHeight });
	        if (this.props.onResizeStop) {
	            this.props.onResizeStop(e, direction, elementRef, delta, this.resizingPosition);
	        }
	    };
	    Rnd.prototype.updateSize = function (size) {
	        if (!this.resizable)
	            return;
	        this.resizable.updateSize({ width: size.width, height: size.height });
	    };
	    Rnd.prototype.updatePosition = function (position) {
	        this.draggable.setState(position);
	    };
	    Rnd.prototype.updateOffsetFromParent = function () {
	        var scale = this.props.scale;
	        var parent = this.getParent();
	        var self = this.getSelfElement();
	        if (!parent || self === null) {
	            return {
	                top: 0,
	                left: 0,
	            };
	        }
	        var parentRect = parent.getBoundingClientRect();
	        var parentLeft = parentRect.left;
	        var parentTop = parentRect.top;
	        var selfRect = self.getBoundingClientRect();
	        var position = this.getDraggablePosition();
	        var scrollLeft = parent.scrollLeft;
	        var scrollTop = parent.scrollTop;
	        this.offsetFromParent = {
	            left: selfRect.left - parentLeft + scrollLeft - position.x * scale,
	            top: selfRect.top - parentTop + scrollTop - position.y * scale,
	        };
	    };
	    Rnd.prototype.render = function () {
	        var _this = this;
	        var _a = this.props, disableDragging = _a.disableDragging, style = _a.style, dragHandleClassName = _a.dragHandleClassName, position = _a.position, onMouseDown = _a.onMouseDown, onMouseUp = _a.onMouseUp, dragAxis = _a.dragAxis, dragGrid = _a.dragGrid, bounds = _a.bounds, enableUserSelectHack = _a.enableUserSelectHack, cancel = _a.cancel, children = _a.children; _a.onResizeStart; _a.onResize; _a.onResizeStop; _a.onDragStart; _a.onDrag; _a.onDragStop; var resizeHandleStyles = _a.resizeHandleStyles, resizeHandleClasses = _a.resizeHandleClasses, resizeHandleComponent = _a.resizeHandleComponent, enableResizing = _a.enableResizing, resizeGrid = _a.resizeGrid, resizeHandleWrapperClass = _a.resizeHandleWrapperClass, resizeHandleWrapperStyle = _a.resizeHandleWrapperStyle, scale = _a.scale, allowAnyClick = _a.allowAnyClick, dragPositionOffset = _a.dragPositionOffset, resizableProps = __rest(_a, ["disableDragging", "style", "dragHandleClassName", "position", "onMouseDown", "onMouseUp", "dragAxis", "dragGrid", "bounds", "enableUserSelectHack", "cancel", "children", "onResizeStart", "onResize", "onResizeStop", "onDragStart", "onDrag", "onDragStop", "resizeHandleStyles", "resizeHandleClasses", "resizeHandleComponent", "enableResizing", "resizeGrid", "resizeHandleWrapperClass", "resizeHandleWrapperStyle", "scale", "allowAnyClick", "dragPositionOffset"]);
	        var defaultValue = this.props.default ? __assign({}, this.props.default) : undefined;
	        // Remove unknown props, see also https://reactjs.org/warnings/unknown-prop.html
	        delete resizableProps.default;
	        var cursorStyle = disableDragging || dragHandleClassName ? { cursor: "auto" } : { cursor: "move" };
	        var innerStyle = __assign(__assign(__assign({}, resizableStyle), cursorStyle), style);
	        var _b = this.offsetFromParent, left = _b.left, top = _b.top;
	        var draggablePosition;
	        if (position) {
	            draggablePosition = {
	                x: position.x - left,
	                y: position.y - top,
	            };
	        }
	        // INFO: Make uncontorolled component when resizing to control position by setPostion.
	        var pos = this.state.resizing ? undefined : draggablePosition;
	        var dragAxisOrUndefined = this.state.resizing ? "both" : dragAxis;
	        return (React.createElement(Draggable, { ref: function (c) {
	                if (!c)
	                    return;
	                _this.draggable = c;
	            }, handle: dragHandleClassName ? ".".concat(dragHandleClassName) : undefined, defaultPosition: defaultValue, onMouseDown: onMouseDown, 
	            // @ts-expect-error
	            onMouseUp: onMouseUp, onStart: this.onDragStart, onDrag: this.onDrag, onStop: this.onDragStop, axis: dragAxisOrUndefined, disabled: disableDragging, grid: dragGrid, bounds: bounds ? this.state.bounds : undefined, position: pos, enableUserSelectHack: enableUserSelectHack, cancel: cancel, scale: scale, allowAnyClick: allowAnyClick, nodeRef: this.resizableElement, positionOffset: dragPositionOffset },
	            React.createElement(Resizable, __assign({}, resizableProps, { ref: function (c) {
	                    if (!c)
	                        return;
	                    _this.resizable = c;
	                    _this.resizableElement.current = c.resizable;
	                }, defaultSize: defaultValue, size: this.props.size, enable: typeof enableResizing === "boolean" ? getEnableResizingByFlag(enableResizing) : enableResizing, onResizeStart: this.onResizeStart, onResize: this.onResize, onResizeStop: this.onResizeStop, style: innerStyle, minWidth: this.props.minWidth, minHeight: this.props.minHeight, maxWidth: this.state.resizing ? this.state.maxWidth : this.props.maxWidth, maxHeight: this.state.resizing ? this.state.maxHeight : this.props.maxHeight, grid: resizeGrid, handleWrapperClass: resizeHandleWrapperClass, handleWrapperStyle: resizeHandleWrapperStyle, lockAspectRatio: this.props.lockAspectRatio, lockAspectRatioExtraWidth: this.props.lockAspectRatioExtraWidth, lockAspectRatioExtraHeight: this.props.lockAspectRatioExtraHeight, handleStyles: resizeHandleStyles, handleClasses: resizeHandleClasses, handleComponent: resizeHandleComponent, scale: this.props.scale }), children)));
	    };
	    Rnd.defaultProps = {
	        maxWidth: Number.MAX_SAFE_INTEGER,
	        maxHeight: Number.MAX_SAFE_INTEGER,
	        scale: 1,
	        onResizeStart: function () { },
	        onResize: function () { },
	        onResizeStop: function () { },
	        onDragStart: function () { },
	        onDrag: function () { },
	        onDragStop: function () { },
	    };
	    return Rnd;
	}(React.PureComponent));

	function useLatestValue(obs) {
	    const [value, setValue] = React.useState(null);
	    React.useEffect(() => {
	        const subscription = obs.subscribe(setValue);
	        return () => {
	            subscription.unsubscribe();
	        };
	    }, [obs]);
	    return value;
	}
	function useLatestOrDefault(obs, defaultValue) {
	    const [value, setValue] = React.useState(defaultValue);
	    React.useEffect(() => {
	        const subscription = obs.subscribe(setValue);
	        return () => {
	            subscription.unsubscribe();
	        };
	    }, [obs]);
	    return value;
	}

	function getStringValue(key, defaultValue) {
	    {
	        return GM_getValue(key, defaultValue);
	    }
	}
	function setStringValue(key, value) {
	    {
	        GM_setValue(key, value);
	    }
	}

	const SettingUpdate$ = new shared_js.S();
	function createStringSelectSetting({ id, name, defaultValue }, options) {
	    return {
	        id, name, defaultValue,
	        value: {
	            type: "select",
	            options: options.map(({ name, value }) => ({ id: value, name, value })),
	        },
	    };
	}
	function createNumberSetting({ id, name, defaultValue }, mode, { min = null, max = null, step = null } = {}) {
	    return {
	        id, name, defaultValue,
	        value: {
	            type: mode,
	            min, max, step
	        },
	    };
	}
	function createBoolSetting(id, name, defaultValue) {
	    return {
	        id, name, defaultValue,
	        value: {
	            type: "bool",
	        },
	    };
	}
	function createInternalSetting(id, name, defaultValue) {
	    return {
	        id, name, defaultValue,
	        value: {
	            type: "internal",
	        },
	    };
	}
	function updateSetting(setting, value) {
	    setStringValue(setting.id, JSON.stringify(createValue(setting, value)));
	    SettingUpdate$.next({ setting, value });
	}
	function createValue(setting, value) {
	    return {
	        __version: 1,
	        time: Date.now(),
	        value,
	    };
	}
	function getSetting(setting) {
	    const data = getValue(setting);
	    if (data === null) {
	        return setting.defaultValue;
	    }
	    else if (checkSetting(setting, data.value)) {
	        return data.value;
	    }
	    else {
	        return setting.defaultValue;
	    }
	}
	function getValue(setting) {
	    const raw = getStringValue(setting.id, null);
	    if (raw === null) {
	        return null;
	    }
	    const data = JSON.parse(raw);
	    if (data.hasOwnProperty("__version")) {
	        return data;
	    }
	    else {
	        return {
	            __version: 0,
	            time: 0,
	            value: data,
	        };
	    }
	}
	function checkSetting(setting, value) {
	    if (setting.value.type === "select") {
	        return setting.value.options.some(option => option.value === value);
	    }
	    if (setting.value.type === "bool") {
	        return (typeof value) === "boolean";
	    }
	    if (setting.value.type === "integer" || setting.value.type === "float") {
	        if (typeof value !== "number") {
	            return false;
	        }
	        if (setting.value.type === "integer" && !Number.isInteger(value)) {
	            return false;
	        }
	        if (setting.value.min !== null && value < setting.value.min) {
	            return false;
	        }
	        // noinspection RedundantIfStatementJS
	        if (setting.value.max !== null && value > setting.value.max) {
	            return false;
	        }
	        return true;
	    }
	    return true;
	}
	function useSetting(setting) {
	    const [value, setValue] = React.useState(getSetting(setting));
	    React.useEffect(() => {
	        const subscription = SettingUpdate$.subscribe({
	            next: ({ setting: updatedSetting, value }) => {
	                if (setting.id === updatedSetting.id) {
	                    setValue(value);
	                }
	            }
	        });
	        return () => subscription.unsubscribe();
	    }, [setting.id]);
	    return value;
	}
	function ShowSettingValue({ setting }) {
	    const value = useSetting(setting);
	    if (setting.value.type === "select") {
	        return React__namespace.createElement("select", { value: value, onChange: e => updateSetting(setting, e.target.value) }, setting.value.options.map(option => React__namespace.createElement("option", { key: option.id, value: option.value }, option.name)));
	    }
	    if (setting.value.type === "bool") {
	        return React__namespace.createElement("input", { type: "checkbox", checked: value, onChange: e => updateSetting(setting, e.target.checked) });
	    }
	    if (setting.value.type === "string") {
	        return React__namespace.createElement("input", { value: value, onChange: e => updateSetting(setting, e.target.value) });
	    }
	    return React__namespace.createElement(React__namespace.Fragment, null, value);
	}

	function styleInject(css, ref) {
	  if ( ref === void 0 ) ref = {};
	  var insertAt = ref.insertAt;

	  if (typeof document === 'undefined') { return; }

	  var head = document.head || document.getElementsByTagName('head')[0];
	  var style = document.createElement('style');
	  style.type = 'text/css';

	  if (insertAt === 'top') {
	    if (head.firstChild) {
	      head.insertBefore(style, head.firstChild);
	    } else {
	      head.appendChild(style);
	    }
	  } else {
	    head.appendChild(style);
	  }

	  if (style.styleSheet) {
	    style.styleSheet.cssText = css;
	  } else {
	    style.appendChild(document.createTextNode(css));
	  }
	}

	var css_248z = ".view-module_container__hqmeS {\n    z-index: 1000000;\n}\n\n.view-module_app__xwTlu {\n    padding: 2px;\n    font-size: 14px;\n    background: white;\n    height: 100%;\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n}\n\n.view-module_app__xwTlu table {\n    border-collapse: collapse;\n}\n\n.view-module_app__xwTlu table th {\n    border: 1px solid black;\n}\n\n.view-module_app__xwTlu table td {\n    border: 1px solid black;\n}\n\n.view-module_app__xwTlu table ul {\n    margin: 2px;\n    padding-left: 1.5em;\n}\n\n.view-module_row-group__U-OKb {\n    display: flex;\n    flex-direction: row;\n    align-items: baseline;\n\n    > * {\n        padding: 0 3px;\n    }\n}\n\n.view-module_header__BOR8s {\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 5px 10px;\n    font-weight: bold;\n    background: gray;\n}\n\n.view-module_content__cOUeR {\n    background: white;\n    overflow: auto;\n    flex-grow: 1;\n    padding: 2px;\n}\n\n.view-module_child__xmQwV {\n    border: 1px solid black;\n    padding: 2px;\n    margin: 2px;\n}\n\n.view-module_child-content__tQGPj {\n    overflow-x: auto;\n    overflow-y: hidden;\n}\n";
	var viewStyles = {"container":"view-module_container__hqmeS","app":"view-module_app__xwTlu","row-group":"view-module_row-group__U-OKb","header":"view-module_header__BOR8s","content":"view-module_content__cOUeR","child":"view-module_child__xmQwV","child-content":"view-module_child-content__tQGPj"};
	styleInject(css_248z);

	function createApp({ id = "app", name, body = document.body }) {
	    const container = document.createElement("div");
	    container.id = id;
	    document.body.insertBefore(container, body.firstChild);
	    client.createRoot(container).render(React__namespace.createElement(App, { name: name }));
	}
	const Views$ = new BehaviorSubject([]);
	function AddView(child) {
	    const previous = Views$.getValue();
	    if (previous.find((c) => c.id === child.id)) ;
	    else {
	        Views$.next([...previous, child]);
	    }
	}
	const POSITION_SETTINGS = createInternalSetting("view.position", "Position", { x: 0, y: 0, width: "400px", height: "400px" });
	function App({ name }) {
	    const [show, setShow] = React.useState(true);
	    const [editMode, setEditMode] = React.useState(false);
	    const position = React.useRef(getSetting(POSITION_SETTINGS));
	    if (!show) {
	        // Add a button to the top left corner
	        return React__namespace.createElement("button", { style: {
	                position: "absolute",
	                left: 0,
	                top: 0,
	                zIndex: 1000000,
	                margin: "10px",
	            }, onClick: () => {
	                setShow(true);
	            } }, name || "Click to show");
	    }
	    return React__namespace.createElement(Rnd, { default: position.current, bounds: "window", className: viewStyles.container, disableDragging: !editMode, enableResizing: editMode, onResizeStop: (_event, _direction, ref) => {
	            position.current.width = ref.style.width;
	            position.current.height = ref.style.height;
	        }, onDragStop: (_, data) => {
	            position.current.x = data.x;
	            position.current.y = data.y;
	        } },
	        React__namespace.createElement("div", { className: viewStyles.app },
	            React__namespace.createElement("div", { className: viewStyles.header },
	                name === undefined ? React__namespace.createElement(React__namespace.Fragment, null) : React__namespace.createElement("div", null, name),
	                React__namespace.createElement("div", null,
	                    React__namespace.createElement("button", { onClick: () => {
	                            setEditMode(!editMode);
	                            if (editMode) {
	                                updateSetting(POSITION_SETTINGS, position.current);
	                            }
	                        } }, editMode ? "Save" : "Move"),
	                    React__namespace.createElement("button", { onClick: () => {
	                            setShow(false);
	                        } }, "-"))),
	            React__namespace.createElement(Views, null)));
	}
	function Views() {
	    const children = useLatestOrDefault(Views$, []);
	    return React__namespace.createElement("div", { className: viewStyles.content }, children.map((child) => React__namespace.createElement(ViewChild, Object.assign({ key: child.id }, child))));
	}
	function ViewChild({ id, name, node }) {
	    const setting = React.useMemo(() => createBoolSetting(`view.${id}.show`, `Show ${name}`, true), [id, name]);
	    const show = useSetting(setting);
	    if (!show) {
	        return React__namespace.createElement("div", { className: viewStyles.child },
	            name,
	            React__namespace.createElement("button", { onClick: () => updateSetting(setting, true) }, "+"));
	    }
	    return React__namespace.createElement("div", { className: viewStyles.child },
	        React__namespace.createElement("div", null,
	            name,
	            React__namespace.createElement("button", { onClick: () => updateSetting(setting, false) }, "-")),
	        React__namespace.createElement("div", { className: viewStyles["child-content"] },
	            React__namespace.createElement(ViewSandbox, null, node)));
	}
	class ViewSandbox extends React__namespace.Component {
	    constructor(props) {
	        super(props);
	        this.state = { hasError: false };
	    }
	    static getDerivedStateFromError(error) {
	        return { hasError: true };
	    }
	    componentDidCatch(error, info) {
	        warn("error-boundary", { ownerStack: React__namespace.captureOwnerStack(), });
	    }
	    render() {
	        if (this.state.hasError) {
	            // You can render any custom fallback UI
	            return React__namespace.createElement(React__namespace.Fragment, null, "Error");
	        }
	        return this.props.children;
	    }
	}

	function jsonCopy(obj) {
	    return JSON.parse(JSON.stringify(obj));
	}

	const StoreSizeChange$ = new shared_js.S();
	const initData = {};
	function createStore(store) {
	    function createStoreSubject() {
	        const { defaultValue } = store;
	        const subject = new BehaviorSubject(defaultValue);
	        function initStoreData() {
	            const data = getStoreData(store);
	            if (data.data !== null) {
	                initData[store.id] = data;
	                subject.next(data.data);
	            }
	        }
	        store.path$.subscribe(path => {
	            if (path !== null) {
	                initStoreData();
	            }
	            else {
	                subject.next(defaultValue);
	            }
	        });
	        return subject;
	    }
	    const result = store;
	    result.data$ = createStoreSubject();
	    result.update = (data) => {
	        let next;
	        if (typeof data === "function") {
	            const previousData = result.data$.getValue();
	            next = data(previousData);
	            if (next === previousData) {
	                return;
	            }
	        }
	        else {
	            next = data;
	        }
	        // Save it first
	        saveStoreData(store, next);
	        result.data$.next(next);
	        return;
	    };
	    result.reset = () => {
	        saveStoreData(store, store.defaultValue);
	        result.data$.next(store.defaultValue);
	    };
	    return result;
	}
	function getStoreKey(store) {
	    const path = store.path$.getValue();
	    if (path === null) {
	        throw new Error("no-store-path");
	    }
	    if (path === "") {
	        return `store.${store.id}`;
	    }
	    else {
	        return `store.${store.id}.${path}`;
	    }
	}
	function getStoreData(store) {
	    const { defaultValue } = store;
	    const data = getStringValue(getStoreKey(store), null);
	    if (data === null) {
	        return {
	            updated: 0,
	            data: defaultValue
	        };
	    }
	    return JSON.parse(data);
	}
	function saveStoreData(store, data) {
	    const storedData = { updated: Date.now(), data };
	    const json = JSON.stringify(storedData);
	    setStringValue(getStoreKey(store), json);
	    StoreSizeChange$.next({ store, size: json.length });
	}
	function exportStore(store) {
	    const blob = new Blob([JSON.stringify(getStoreData(store))], { type: "application/json;charset=utf-8" });
	    window.open(window.URL.createObjectURL(blob));
	}
	function getStoreSize(store) {
	    const data = getStoreData(store);
	    return JSON.stringify(data).length;
	}

	function isTestServer() {
	    return window.location.host === "test.milkywayidle.com";
	}

	const CharacterId$ = new BehaviorSubject(null);
	shared_js.I.subscribe(data => {
	    CharacterId$.next(`character.${data}`);
	});
	function defineStore(def) {
	    const storeDef = def;
	    storeDef.path$ = def.characterBased ? CharacterId$ :
	        isTestServer() ? new BehaviorSubject("test") : new BehaviorSubject("");
	    const store = createStore(storeDef);
	    store.enableSetting = def.enableSettings ? createBoolSetting(`store.${store.id}.enable`, store.name, true) : null;
	    return store;
	}

	const ActionQueueStore = defineStore({
	    id: "action-queue",
	    name: "Action Queue",
	    defaultValue: [],
	    enableSettings: false,
	    characterBased: true,
	});
	shared_js.b.subscribe(data => {
	    ActionQueueStore.update((prev) => {
	        if (prev.length > 0) {
	            OfflineChanges$.next(prev.flatMap(from => {
	                const to = data.characterActions.find(it => it.id === from.id);
	                return to ? [{ from, to }] : [];
	            }));
	        }
	        return data.characterActions;
	    });
	});
	shared_js.A.subscribe(({ endCharacterActions }) => {
	    ActionQueueStore.update((prev) => {
	        return updateActionQueue(prev, endCharacterActions);
	    });
	});
	function updateActionQueue(actions, changes) {
	    const queue = jsonCopy(actions);
	    for (const action of changes) {
	        const item = queue.find(it => it.id === action.id);
	        if (item) {
	            if (action.isDone) {
	                queue.splice(queue.indexOf(item), 1);
	            }
	            else {
	                queue[queue.indexOf(item)] = action;
	            }
	        }
	        else {
	            queue.push(action);
	        }
	    }
	    queue.sort((a, b) => a.ordinal - b.ordinal);
	    return queue;
	}
	function updateActionData(change) {
	    const previous = ActionQueueStore.data$.getValue();
	    const action = previous.find(it => it.id === change.id);
	    ActionQueueStore.update(updateActionQueue(previous, [change]));
	    if (action) {
	        return change.currentCount - action.currentCount;
	    }
	    else {
	        return 0;
	    }
	}
	const OfflineChanges$ = new shared_js.S();

	let clientData = null;
	function getClientData() {
	    if (!clientData) {
	        throw new Error("Client data not initialized");
	    }
	    return clientData;
	}
	shared_js.d.subscribe((data) => {
	    clientData = data;
	});

	function getItemName(itemHrid) {
	    var _a, _b;
	    return (_b = (_a = getClientData().itemDetailMap[itemHrid]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : itemHrid;
	}
	var SpecialItems;
	(function (SpecialItems) {
	    SpecialItems["Coin"] = "/items/coin";
	    SpecialItems["CowBell"] = "/items/cowbell";
	    SpecialItems["BagOf10CowBells"] = "/items/bag_of_10_cowbells";
	})(SpecialItems || (SpecialItems = {}));
	var ItemCategory;
	(function (ItemCategory) {
	    ItemCategory["AbilityBook"] = "/item_categories/ability_book";
	    ItemCategory["Currency"] = "/item_categories/currency";
	    ItemCategory["Drink"] = "/item_categories/drink";
	    ItemCategory["Equipment"] = "/item_categories/equipment";
	    ItemCategory["Food"] = "/item_categories/food";
	    ItemCategory["Key"] = "/item_categories/key";
	    ItemCategory["Loot"] = "/item_categories/loot";
	    ItemCategory["Resource"] = "/item_categories/resource";
	    ItemCategory["Unknown"] = "/item_categories/unknown";
	})(ItemCategory || (ItemCategory = {}));
	function isItemOpenable(itemHrid) {
	    return getClientData().openableLootDropMap[itemHrid] !== undefined;
	}
	function getOpenableItemDropTable(itemHrid) {
	    var _a;
	    return (_a = getClientData().openableLootDropMap[itemHrid]) !== null && _a !== void 0 ? _a : null;
	}
	function getOpenableItem(itemHrid) {
	    if (!isItemOpenable(itemHrid)) {
	        return null;
	    }
	    const dropInfos = getClientData().openableLootDropMap[itemHrid];
	    const selfDrop = dropInfos.filter((dropInfo) => dropInfo.itemHrid === itemHrid)
	        .reduce((acc, dropInfo) => acc +
	        (dropInfo.dropRate * (dropInfo.maxCount + dropInfo.minCount) / 2), 0);
	    const drops = dropInfos.filter((dropInfo) => dropInfo.itemHrid !== itemHrid)
	        .reduce((acc, dropInfo) => {
	        var _a;
	        acc[dropInfo.itemHrid] = ((_a = acc[dropInfo.itemHrid]) !== null && _a !== void 0 ? _a : 0) + dropInfo.dropRate * (dropInfo.maxCount + dropInfo.minCount) / 2;
	        return acc;
	    }, {});
	    return {
	        hrid: itemHrid,
	        selfDrop,
	        drops,
	    };
	}
	function getItemCategory(itemHrid) {
	    var _a, _b;
	    return (_b = (_a = getClientData().itemDetailMap[itemHrid]) === null || _a === void 0 ? void 0 : _a.categoryHrid) !== null && _b !== void 0 ? _b : ItemCategory.Unknown;
	}

	const InventoryData$ = new BehaviorSubject(null);
	shared_js.b.pipe(shared_js.m(data => {
	    const localInventory = {};
	    data.characterItems.forEach((item) => {
	        var _a;
	        if (item.itemLocationHrid !== "/item_locations/inventory") {
	            return;
	        }
	        localInventory[item.itemHrid] = (_a = localInventory[item.itemHrid]) !== null && _a !== void 0 ? _a : {};
	        localInventory[item.itemHrid][item.enhancementLevel] = item.count;
	    });
	    return {
	        characterId: data.character.id,
	        inventory: localInventory
	    };
	})).subscribe(InventoryData$);
	const ItemChangeCause$ = new BehaviorSubject({ "type": "unknown" });
	shared_js.e.subscribe(({ endCharacterAction }) => {
	    // This is the changes for food and drink
	    ItemChangeCause$.next({ "type": "action", "action": endCharacterAction.actionHrid });
	});
	shared_js.B.subscribe(() => {
	    ItemChangeCause$.next({ "type": "cowbell-store" });
	});
	shared_js.C.subscribe(() => {
	    ItemChangeCause$.next({ "type": "market" });
	});
	shared_js.g.subscribe(() => {
	    ItemChangeCause$.next({ "type": "market" });
	});
	shared_js.P.subscribe(() => {
	    ItemChangeCause$.next({ "type": "market" });
	});
	shared_js.h.subscribe(() => {
	    ItemChangeCause$.next({ "type": "quest" });
	});
	shared_js.O.subscribe(() => {
	    ItemChangeCause$.next({ "type": "loot" });
	});
	function mergeItemChangesData(left, right) {
	    if (!left) {
	        return right;
	    }
	    function mergeItemChangeData(left, right) {
	        const total = jsonCopy(left);
	        for (const item of right) {
	            const index = total.findIndex(it => it.hrid === item.hrid);
	            if (index >= 0) {
	                total[index].count += item.count;
	            }
	            else {
	                total.push(item);
	            }
	        }
	        return total;
	    }
	    return {
	        added: mergeItemChangeData(left.added, right.added),
	        removed: mergeItemChangeData(left.removed, right.removed)
	    };
	}
	const InventoryItemChanges$ = new shared_js.S();
	shared_js.i({ changes: OfflineChanges$, data: shared_js.b }).subscribe(({ changes, data }) => {
	    if (data.offlineItems.length === 0) {
	        return;
	    }
	    InventoryItemChanges$.next({
	        added: data.offlineItems
	            .filter(it => it.itemLocationHrid === "/item_locations/inventory")
	            .filter(it => it.offlineCount > 0)
	            .map(it => ({
	            hrid: it.itemHrid,
	            count: it.offlineCount,
	            level: it.enhancementLevel,
	        })),
	        removed: data.offlineItems
	            .filter(it => it.itemLocationHrid === "/item_locations/inventory")
	            .filter(it => it.offlineCount < 0)
	            .map(it => ({
	            hrid: it.itemHrid,
	            count: it.offlineCount,
	            level: it.enhancementLevel,
	        })),
	        cause: { "type": "action", "action": "Offline" },
	        time: Date.now(),
	    });
	});
	shared_js.j.subscribe(({ endCharacterItems }) => {
	    if (endCharacterItems === null) {
	        return;
	    }
	    let cause = ItemChangeCause$.getValue();
	    if (cause.type === "action") {
	        // Post checker of drink and food
	        if (!endCharacterItems.every(it => [ItemCategory.Drink, ItemCategory.Food].includes(getItemCategory(it.itemHrid)))) {
	            // Some items are not tea or food
	            cause = { "type": "unknown" };
	        }
	    }
	    updateInventory(endCharacterItems, cause);
	    ItemChangeCause$.next({ "type": "unknown" });
	});
	function updateInventory(endCharacterItems, cause) {
	    const before = InventoryData$.getValue();
	    const inventoryBefore = before.inventory;
	    const inventoryAfter = jsonCopy(inventoryBefore);
	    const diffs = endCharacterItems
	        .filter(item => item.itemLocationHrid === "/item_locations/inventory")
	        .map((item) => {
	        var _a, _b, _c;
	        inventoryAfter[item.itemHrid] = (_a = inventoryBefore[item.itemHrid]) !== null && _a !== void 0 ? _a : {};
	        const before = (_c = (_b = inventoryBefore[item.itemHrid]) === null || _b === void 0 ? void 0 : _b[item.enhancementLevel]) !== null && _c !== void 0 ? _c : 0;
	        const diff = item.count - before;
	        inventoryAfter[item.itemHrid][item.enhancementLevel] = item.count;
	        return { hrid: item.itemHrid, level: item.enhancementLevel, count: diff };
	    });
	    InventoryData$.next(Object.assign(Object.assign({}, before), { inventory: inventoryAfter }));
	    const result = {
	        added: diffs.filter(diff => diff.count > 0),
	        removed: diffs.filter(diff => diff.count < 0),
	        cause,
	        time: Date.now(),
	    };
	    InventoryItemChanges$.next(result);
	    return result;
	}

	function setupEngineHook() {
	    shared_js.a.subscribe(processRequest);
	    shared_js.R.subscribe(processResponse);
	}
	function processRequest(data) {
	    if (!data.hasOwnProperty("type") || typeof data.type !== "string") {
	        // ignore unknown messages
	        return;
	    }
	    if (["ping"].includes(data.type)) {
	        // ignore chat messages
	        return;
	    }
	    log$1("handle-request", { "type": data.type});
	    tryPublish(data, shared_js.B, "buy_moo_pass_with_cowbells") ||
	        tryPublish(data, shared_js.C, "claim_all_market_listings") ||
	        tryPublish(data, shared_js.h, "claim_character_quest") ||
	        tryPublish(data, shared_js.g, "claim_market_listing") ||
	        tryPublish(data, shared_js.O, "open_loot") ||
	        tryPublish(data, shared_js.P, "post_market_order");
	}
	function processResponse(data) {
	    if (!data.hasOwnProperty("type") || typeof data.type !== "string") {
	        // ignore unknown messages
	        return;
	    }
	    if (["chat_message_updated", "chat_message_received", "pong"].includes(data.type)) {
	        // ignore chat messages
	        return;
	    }
	    log$1("handle-response", { "type": data.type});
	    if (checkType(data, "init_character_data")) {
	        shared_js.I.next(data.character.id);
	        shared_js.b.next(data);
	        return;
	    }
	    if (tryPublish(data, shared_js.e, "action_completed")) {
	        processActionComplete(data);
	        return;
	    }
	    tryPublish(data, shared_js.A, "actions_updated") ||
	        tryPublish(data, shared_js.d, "init_client_data") ||
	        tryPublish(data, shared_js.j, "items_updated") ||
	        tryPublish(data, shared_js.L, "loot_log_updated") ||
	        tryPublish(data, shared_js.l, "loot_opened");
	}
	function checkType(data, type) {
	    return data.type === type;
	}
	function tryPublish(data, source, type) {
	    if (!checkType(data, type)) {
	        return false;
	    }
	    source.next(data);
	    return true;
	}
	function processActionComplete(data) {
	    var _a;
	    const count = updateActionData(data.endCharacterAction);
	    const { added, removed } = updateInventory((_a = data.endCharacterItems) !== null && _a !== void 0 ? _a : [], {
	        type: "action",
	        action: data.endCharacterAction.actionHrid,
	    });
	    shared_js.k.next({
	        hrid: data.endCharacterAction.actionHrid,
	        updatedAt: data.endCharacterAction.updatedAt,
	        added, removed, count,
	    });
	}

	const MarketSource = "game_data/marketplace.json";
	function getMarketData() {
	    return MarketDataStore.data$.getValue();
	}
	function getSellPriceByHrid(hrid, enhancementLevel = 0, marketData = undefined) {
	    const price = getPriceByHrid(hrid, "b", enhancementLevel, marketData !== null && marketData !== void 0 ? marketData : getMarketData());
	    return (price < 0) ? 0 : price;
	}
	function getBuyPriceByHrid(hrid, enhancementLevel = 0, marketData = undefined) {
	    const price = getPriceByHrid(hrid, "a", enhancementLevel, marketData !== null && marketData !== void 0 ? marketData : getMarketData());
	    return (price < 0) ? 1e9 : price;
	}
	function getPriceByHrid(hrid, field, enhancementLevel = 0, marketData) {
	    var _a, _b;
	    if (hrid === SpecialItems.Coin) {
	        // Coin is always 1
	        return 1;
	    }
	    if (hrid === SpecialItems.CowBell) {
	        return getPriceByHrid(SpecialItems.BagOf10CowBells, field, enhancementLevel, marketData) / 10;
	    }
	    if (marketData.marketData[hrid] === undefined) {
	        if (isItemOpenable(hrid) && ![SpecialItems.BagOf10CowBells].includes(hrid)) {
	            const openableItem = getOpenableItem(hrid);
	            const otherSellAmount = Object.entries(openableItem.drops).reduce((acc, [dropHrid, dropCount]) => acc +
	                getPriceByHrid(dropHrid, field, 0, marketData) * dropCount, 0);
	            // The other sell amount is the remaining part except self-drop
	            return otherSellAmount / (1 - openableItem.selfDrop);
	        }
	        return 0;
	    }
	    return (_b = (_a = marketData.marketData[hrid][enhancementLevel.toString()]) === null || _a === void 0 ? void 0 : _a[field]) !== null && _b !== void 0 ? _b : -1;
	}
	const MarketDataStore = defineStore({
	    id: "market",
	    name: "Market",
	    characterBased: false,
	    enableSettings: false,
	    defaultValue: {
	        marketData: {},
	        timestamp: 0,
	    },
	});
	function setupMarketData() {
	    return shared_js.n(this, void 0, void 0, function* () {
	        let marketData = MarketDataStore.data$.getValue();
	        if (marketData.timestamp !== 0) {
	            shared_js.M.complete();
	            if (Date.now() / 1000 - marketData.timestamp <= 6 * 60 * 60) {
	                return;
	            }
	        }
	        marketData = (yield (yield fetch(MarketSource)).json());
	        setStringValue("marketdata", JSON.stringify(marketData));
	        MarketDataStore.update(marketData);
	        shared_js.M.complete();
	    });
	}

	function uniqueStrings(arr) {
	    return Array.from(new Set(arr)).sort();
	}
	function sum(arr) {
	    return arr.reduce((acc, b) => acc + b, 0);
	}

	function Expandable({ children, defaultExpand }) {
	    const [expanded, setExpanded] = React.useState(defaultExpand !== null && defaultExpand !== void 0 ? defaultExpand : false);
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement("button", { onClick: () => setExpanded(!expanded) }, expanded ? "-" : "+"),
	        React__namespace.createElement("div", { style: expanded ? {} : { display: "none" } }, children));
	}

	function ShowItem({ hrid, enhancementLevel }) {
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        getItemName(hrid),
	        (enhancementLevel && enhancementLevel > 0) ? ` +${enhancementLevel}` : "");
	}

	var NumberFormat;
	(function (NumberFormat) {
	    NumberFormat["Short"] = "short";
	    NumberFormat["Full"] = "full";
	})(NumberFormat || (NumberFormat = {}));
	const NUMBER_FORMAT_SETTING = createStringSelectSetting({ id: "number.format", name: "Number format", defaultValue: NumberFormat.Short }, [
	    { name: "Short", value: NumberFormat.Short },
	    { name: "Full", value: NumberFormat.Full },
	]);
	function ShowNumber({ value }) {
	    const format = useSetting(NUMBER_FORMAT_SETTING);
	    switch (format) {
	        default:
	        case NumberFormat.Short:
	            return React__namespace.createElement(React__namespace.Fragment, null, formatWithSuffixes(value));
	        case NumberFormat.Full:
	            return React__namespace.createElement(React__namespace.Fragment, null, formatWithThousandsSeparators(value));
	    }
	}
	function formatNumber(value) {
	    switch (getSetting(NUMBER_FORMAT_SETTING)) {
	        default:
	        case NumberFormat.Short:
	            return formatWithSuffixes(value);
	        case NumberFormat.Full:
	            return formatWithThousandsSeparators(value);
	    }
	}
	function formatWithThousandsSeparators(num) {
	    if (num < 1e-2) {
	        return new Intl.NumberFormat("en-US", { useGrouping: true, maximumFractionDigits: 6 }).format(num);
	    }
	    else if (num < 1) {
	        return new Intl.NumberFormat("en-US", { useGrouping: true, maximumFractionDigits: 4 }).format(num);
	    }
	    else {
	        return new Intl.NumberFormat("en-US", { useGrouping: true, maximumFractionDigits: 2 }).format(num);
	    }
	}
	function formatWithSuffixes(num) {
	    if (num === 0) {
	        return '0';
	    }
	    const absNum = Math.abs(num);
	    if (absNum >= 1e13) {
	        // >= 10T
	        return formatWithThousandsSeparators(num / 1e12) + 'T';
	    }
	    if (absNum >= 1e10) {
	        // >= 10B
	        return formatWithThousandsSeparators(num / 1e9) + 'B';
	    }
	    if (absNum >= 1e7) {
	        // >= 10M
	        return formatWithThousandsSeparators(num / 1e6) + 'M';
	    }
	    if (absNum >= 1e4) {
	        // >= 10K
	        return formatWithThousandsSeparators(num / 1e3) + 'K';
	    }
	    return formatWithThousandsSeparators(num);
	}
	function ShowPercent({ value }) {
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        (value * 100).toPrecision(4),
	        "%");
	}
	function ShowSize({ value }) {
	    return React__namespace.createElement(React__namespace.Fragment, null, formatSize(value));
	}
	function formatSize(num) {
	    if (num === 0) {
	        return '0';
	    }
	    const absNum = Math.abs(num);
	    if (absNum >= 1e13) {
	        // >= 10TB
	        return formatWithThousandsSeparators(num / 1e12) + 'TB';
	    }
	    if (absNum >= 1e10) {
	        // >= 10GB
	        return formatWithThousandsSeparators(num / 1e9) + 'GB';
	    }
	    if (absNum >= 1e7) {
	        // >= 10MB
	        return formatWithThousandsSeparators(num / 1e6) + 'MB';
	    }
	    if (absNum >= 1e4) {
	        // >= 10KB
	        return formatWithThousandsSeparators(num / 1e3) + 'KB';
	    }
	    return formatWithThousandsSeparators(num) + 'B';
	}

	function ShowStoreActions({ store }) {
	    const { id, name } = store;
	    const size$ = React.useMemo(() => StoreSizeChange$.pipe(filter(it => it.store.id === id), shared_js.m(it => it.size)), [id]);
	    const size = useLatestOrDefault(size$, getStoreSize(store));
	    return React__namespace.createElement("div", { className: viewStyles["row-group"] },
	        React__namespace.createElement("span", null,
	            name,
	            " store"),
	        store.enableSetting !== null ? React__namespace.createElement("span", null,
	            "Enabled:",
	            React__namespace.createElement(ShowSettingValue, { setting: store.enableSetting })) : React__namespace.createElement(React__namespace.Fragment, null),
	        React__namespace.createElement("span", null,
	            "Used space: ",
	            React__namespace.createElement(ShowSize, { value: size })),
	        React__namespace.createElement("button", { onClick: () => store.reset() }, "Clear"),
	        React__namespace.createElement("button", { onClick: () => exportStore(store) }, "Save as"));
	}

	function getActionTypeByTypeHrid(hrid) {
	    return Object.values(AllActionType).find((action) => action === hrid) || null;
	}
	/**
	 * @param itemHrid like /items/sugar::0
	 */
	function resolveItemHrid(itemHrid) {
	    try {
	        const [hrid, enhancementLevel] = itemHrid.split("::");
	        return {
	            hrid,
	            enhancementLevel: Number(enhancementLevel),
	        };
	    }
	    catch (e) {
	        console.error(e);
	        return {
	            hrid: itemHrid,
	            enhancementLevel: 0,
	        };
	    }
	}
	/**
	 * @param itemHash like 000000::/item_locations/inventory::/items/sugar::0
	 */
	function resolveItemHash(itemHash) {
	    try {
	        const [_character_id, _inventory, hrid, enhancementLevel] = itemHash.split("::");
	        return {
	            hrid,
	            enhancementLevel: Number(enhancementLevel),
	        };
	    }
	    catch (e) {
	        console.error(e);
	        return {
	            hrid: itemHash,
	            enhancementLevel: 0,
	        };
	    }
	}

	function getAlchemyInputs(actionHrid, primaryItemHash, secondaryItemHash) {
	    var _a;
	    if (!primaryItemHash) {
	        return [];
	    }
	    const { hrid } = resolveItemHash(primaryItemHash);
	    const alchemyDetail = (_a = getClientData().itemDetailMap[hrid]) === null || _a === void 0 ? void 0 : _a.alchemyDetail;
	    if (!alchemyDetail) {
	        console.error("Alchemy not found for", primaryItemHash);
	        return [];
	    }
	    return [
	        { hrid: hrid, count: alchemyDetail.bulkMultiplier },
	    ];
	}

	var CollectActionType;
	(function (CollectActionType) {
	    CollectActionType["Milking"] = "/action_types/milking";
	    CollectActionType["Foraging"] = "/action_types/foraging";
	    CollectActionType["Woodcutting"] = "/action_types/woodcutting";
	})(CollectActionType || (CollectActionType = {}));
	var ManufacturingActionType;
	(function (ManufacturingActionType) {
	    ManufacturingActionType["Cheesesmithing"] = "/action_types/cheesesmithing";
	    ManufacturingActionType["Crafting"] = "/action_types/crafting";
	    ManufacturingActionType["Tailoring"] = "/action_types/tailoring";
	    ManufacturingActionType["Cooking"] = "/action_types/cooking";
	    ManufacturingActionType["Brewing"] = "/action_types/brewing";
	})(ManufacturingActionType || (ManufacturingActionType = {}));
	var AlchemyActionType;
	(function (AlchemyActionType) {
	    AlchemyActionType["Alchemy"] = "/action_types/alchemy";
	})(AlchemyActionType || (AlchemyActionType = {}));
	var EnhancingActionType;
	(function (EnhancingActionType) {
	    EnhancingActionType["Enhancing"] = "/action_types/enhancing";
	})(EnhancingActionType || (EnhancingActionType = {}));
	var CombatActionType;
	(function (CombatActionType) {
	    CombatActionType["Combat"] = "/action_types/combat";
	})(CombatActionType || (CombatActionType = {}));
	const AllActionType = Object.assign(Object.assign(Object.assign(Object.assign({}, AlchemyActionType), CollectActionType), CombatActionType), ManufacturingActionType);
	function getActionName(actionHrid) {
	    var _a, _b;
	    return (_b = (_a = getClientData().actionDetailMap[actionHrid]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : actionHrid;
	}
	function getActionTypeByAction(actionHrid) {
	    var _a;
	    const typeHrid = (_a = getClientData().actionDetailMap[actionHrid]) === null || _a === void 0 ? void 0 : _a.type;
	    if (typeHrid === undefined) {
	        return null;
	    }
	    return getActionTypeByTypeHrid(typeHrid);
	}
	function getActionInputs(actionHrid, primaryItemHash, secondaryItemHash) {
	    var _a, _b, _c;
	    switch (getActionTypeByAction(actionHrid)) {
	        default:
	            return (_c = (_b = (_a = getClientData().actionDetailMap[actionHrid]) === null || _a === void 0 ? void 0 : _a.inputItems) === null || _b === void 0 ? void 0 : _b.map(inputItem => ({
	                hrid: inputItem.itemHrid,
	                count: inputItem.count,
	            }))) !== null && _c !== void 0 ? _c : [];
	        case AlchemyActionType.Alchemy:
	            return getAlchemyInputs(actionHrid, primaryItemHash);
	    }
	}

	const ActionStatStore = defineStore({
	    id: "action-stat",
	    name: "Action Stat",
	    characterBased: true,
	    enableSettings: true,
	    defaultValue: [],
	});
	const ActionStat$ = ActionStatStore.data$;
	shared_js.k.subscribe((event) => {
	    if (event.count === 0) {
	        return;
	    }
	    ActionStat$.next([...ActionStat$.getValue(), event]);
	});
	function actionStatPlugin() {
	    migration();
	    shared_js.q.subscribe({
	        complete: () => {
	            AddView({
	                id: "action-stat",
	                name: "Action Stat",
	                node: React__namespace.createElement(React__namespace.Fragment, null,
	                    React__namespace.createElement(ShowStoreActions, { store: ActionStatStore }),
	                    React__namespace.createElement(ShowActionStat, null)),
	            });
	        },
	    });
	}
	function migration() {
	    let legacy = JSON.parse(getStringValue("character-store.action-stat.events", "[]"));
	    if (legacy) {
	        GM_deleteValue("character-store.action-stat.events");
	        if (legacy.find(it => [it.added, it.removed].find(it => it.itemHrid))) {
	            // Migrate from itemHrid to hrid
	            legacy = legacy.map(it => {
	                return Object.assign(Object.assign({}, it), { added: it.added.map(it => {
	                        var _a, _b;
	                        return ({
	                            hrid: (_a = it.itemHrid) !== null && _a !== void 0 ? _a : it.hrid,
	                            level: (_b = it.level) !== null && _b !== void 0 ? _b : 0,
	                            count: it.count
	                        });
	                    }), removed: it.removed.map(it => {
	                        var _a, _b;
	                        return ({
	                            hrid: (_a = it.itemHrid) !== null && _a !== void 0 ? _a : it.hrid,
	                            level: (_b = it.level) !== null && _b !== void 0 ? _b : 0,
	                            count: it.count
	                        });
	                    }) });
	            });
	        }
	        ActionStat$.next(legacy);
	    }
	}
	function ShowActionStat() {
	    var _a;
	    const events = (_a = useLatestValue(ActionStat$)) !== null && _a !== void 0 ? _a : [];
	    if (events.length === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null, "No Action");
	    }
	    const groupedAction = events.reduce((map, event) => {
	        const action = event.hrid;
	        if (action in map) {
	            map[action].push(event);
	        }
	        else {
	            map[action] = [event];
	        }
	        return map;
	    }, {});
	    return React__namespace.createElement("table", null,
	        React__namespace.createElement("thead", null,
	            React__namespace.createElement("tr", null,
	                React__namespace.createElement("th", null, "Action"),
	                React__namespace.createElement("th", null, "Efficiency"),
	                React__namespace.createElement("th", null, "Item Changes"))),
	        React__namespace.createElement("tbody", null, Object.entries(groupedAction).map(([hrid, events]) => React__namespace.createElement("tr", { key: hrid },
	            React__namespace.createElement("th", null,
	                getActionName(hrid),
	                React__namespace.createElement("button", { onClick: () => ActionStat$.next(ActionStat$.getValue().filter(it => it.hrid !== hrid)) }, "x")),
	            React__namespace.createElement(ShowEfficiencyStat, { events: events }),
	            React__namespace.createElement(ShowEventStats, { events: events })))));
	}
	function ShowEfficiencyStat({ events }) {
	    const rows = [];
	    events.forEach(it => {
	        let row = rows.find(row => row.count === it.count);
	        if (!row) {
	            row = { count: it.count, times: 0, timesPercent: 0, action: 0, actionPercent: 0 };
	            rows.push(row);
	        }
	        row.times++;
	        row.action += it.count;
	    });
	    rows.sort((a, b) => a.count - b.count);
	    const total = rows.reduce((sum, it) => sum + it.action, 0);
	    rows.forEach(it => it.actionPercent = it.action / total);
	    rows.forEach(it => it.timesPercent = it.times / events.length);
	    return React__namespace.createElement("td", null,
	        React__namespace.createElement("table", null,
	            React__namespace.createElement("thead", null,
	                React__namespace.createElement("tr", null,
	                    React__namespace.createElement("th", null, "Count"),
	                    React__namespace.createElement("th", null, "Times"),
	                    React__namespace.createElement("th", null, "%"),
	                    React__namespace.createElement("th", null, "Actions"),
	                    React__namespace.createElement("th", null, "%"))),
	            React__namespace.createElement("tbody", null, rows.map(it => React__namespace.createElement("tr", { key: it.count },
	                React__namespace.createElement("th", null, it.count),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: it.times })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowPercent, { value: it.timesPercent })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: it.action })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowPercent, { value: it.actionPercent }))))),
	            React__namespace.createElement("tfoot", null,
	                React__namespace.createElement("tr", null,
	                    React__namespace.createElement("th", null, "Total"),
	                    React__namespace.createElement("th", null,
	                        React__namespace.createElement(ShowNumber, { value: events.length })),
	                    React__namespace.createElement("th", null),
	                    React__namespace.createElement("th", null,
	                        React__namespace.createElement(ShowNumber, { value: total })),
	                    React__namespace.createElement("th", null)),
	                React__namespace.createElement("tr", null,
	                    React__namespace.createElement("th", { colSpan: 3 }, "Efficiency"),
	                    React__namespace.createElement("th", null,
	                        React__namespace.createElement(ShowNumber, { value: total / events.length })),
	                    React__namespace.createElement("th", null)))));
	}
	function ShowEventStats({ events }) {
	    const items = uniqueStrings(events.flatMap(it => [...it.added, ...it.removed].map(it => it.hrid)));
	    return React__namespace.createElement("td", null,
	        React__namespace.createElement("table", null,
	            React__namespace.createElement("thead", null,
	                React__namespace.createElement("tr", null, items.map(hrid => React__namespace.createElement("th", { key: hrid },
	                    React__namespace.createElement(ShowItem, { hrid: hrid }))))),
	            React__namespace.createElement("tbody", null,
	                React__namespace.createElement("tr", null, items.map(hrid => React__namespace.createElement("td", { key: hrid },
	                    React__namespace.createElement(Expandable, { defaultExpand: hrid !== SpecialItems.Coin },
	                        React__namespace.createElement(ShowItemStat, { itemHrid: hrid, events: events }))))))));
	}
	function ShowItemStat({ itemHrid, events }) {
	    const rows = [];
	    const subtotalActions = {};
	    events.forEach(event => {
	        var _a, _b, _c;
	        const itemCount = (_b = (_a = [...event.added, ...event.removed].find(item => item.hrid === itemHrid)) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
	        let row = rows.find(row => row.action === event.count && row.itemCount === itemCount);
	        if (!row) {
	            row = {
	                action: event.count,
	                itemCount: itemCount,
	                times: 0,
	                timesPercent: 0,
	                subtotal: 0,
	            };
	            rows.push(row);
	        }
	        row.times += 1;
	        subtotalActions[row.action] = ((_c = subtotalActions[row.action]) !== null && _c !== void 0 ? _c : 0) + 1;
	    });
	    rows.forEach(row => row.timesPercent = row.times / subtotalActions[row.action]);
	    const totalActions = events.reduce((acc, event) => acc + event.count, 0);
	    rows.forEach(row => row.subtotal = row.times * row.itemCount);
	    const total = rows.reduce((acc, row) => acc + row.subtotal, 0);
	    rows.sort((a, b) => a.action - b.action || a.itemCount - b.itemCount);
	    return React__namespace.createElement("table", null,
	        React__namespace.createElement("thead", null,
	            React__namespace.createElement("tr", null,
	                React__namespace.createElement("th", null, "Count"),
	                React__namespace.createElement("th", null, "Times"),
	                React__namespace.createElement("th", null, "%"),
	                React__namespace.createElement("th", null, "Subtotal"))),
	        React__namespace.createElement("tbody", null, rows.map(row => React__namespace.createElement("tr", { key: `${row.action}-${row.itemCount}` },
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: row.itemCount }),
	                " ",
	                "/",
	                " ",
	                React__namespace.createElement(ShowNumber, { value: row.action })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: row.times })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowPercent, { value: row.timesPercent })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: row.subtotal }))))),
	        React__namespace.createElement("tfoot", null,
	            React__namespace.createElement("tr", null,
	                React__namespace.createElement("th", null, "Avg"),
	                React__namespace.createElement("th", null,
	                    React__namespace.createElement(ShowNumber, { value: total / totalActions })),
	                React__namespace.createElement("th", null, "Total"),
	                React__namespace.createElement("th", null,
	                    React__namespace.createElement(ShowNumber, { value: total })))));
	}

	function ShowTimestamp({ value }) {
	    return React__namespace.createElement(React__namespace.Fragment, null, formatTimestamp(value));
	}
	function formatTimestamp(value) {
	    return `${formatDate(value)} ${formatTime(value)}`;
	}
	function formatDate(value) {
	    const date = new Date(value);
	    const month = String(date.getMonth() + 1).padStart(2, '0');
	    const day = String(date.getDate()).padStart(2, '0');
	    return `${(date.getFullYear())}-${month}-${day}`;
	}
	function formatTime(value) {
	    const date = new Date(value);
	    const hours = String(date.getHours()).padStart(2, '0');
	    const minutes = String(date.getMinutes()).padStart(2, '0');
	    const seconds = String(date.getSeconds()).padStart(2, '0');
	    return `${hours}:${minutes}:${seconds}`;
	}

	function refineTotal(data) {
	    data.cowbell.total = data.cowbell.price * data.cowbell.count;
	    data.items.forEach(it => it.total = it.price * it.count);
	    data.itemTotal = sum(data.items.map(it => it.total));
	    return data;
	}
	const AssertStore = defineStore({
	    id: "assert",
	    name: "Assert",
	    characterBased: true,
	    enableSettings: true,
	    defaultValue: [],
	});
	shared_js.i({ inventory: InventoryData$, market: MarketDataStore.data$ }).subscribe(({ inventory, market }) => {
	    var _a, _b, _c;
	    if (inventory === null) {
	        return;
	    }
	    const inventoryTime = new Date().setMinutes(0, 0, 0);
	    const tradableCowbell = ((_a = inventory.inventory[SpecialItems.BagOf10CowBells][0]) !== null && _a !== void 0 ? _a : 0) * 10;
	    const untradableCowbell = ((_b = inventory.inventory[SpecialItems.CowBell][0]) !== null && _b !== void 0 ? _b : 0);
	    const cowbellPrice = getSellPriceByHrid(SpecialItems.BagOf10CowBells, 0, market) / 10;
	    const assetData = {
	        inventoryTime,
	        marketTime: market.timestamp,
	        coin: (_c = inventory.inventory[SpecialItems.Coin][0]) !== null && _c !== void 0 ? _c : 0,
	        cowbell: {
	            tradable: tradableCowbell,
	            price: cowbellPrice,
	            count: untradableCowbell + tradableCowbell,
	            total: 0,
	        },
	        items: Object.entries(inventory.inventory).flatMap(([hrid, leveledCount]) => {
	            if ([SpecialItems.Coin, SpecialItems.BagOf10CowBells, SpecialItems.CowBell].includes(hrid)) {
	                return [];
	            }
	            const category = getItemCategory(hrid);
	            if ([ItemCategory.Unknown, ItemCategory.Equipment, ItemCategory.Currency].includes(category)) {
	                return [];
	            }
	            if (leveledCount[0] === undefined) {
	                return [];
	            }
	            const count = leveledCount[0];
	            const price = getSellPriceByHrid(hrid, 0, market);
	            return [{
	                    hrid,
	                    category,
	                    price,
	                    count,
	                    total: 0,
	                }];
	        }),
	        itemTotal: 0,
	    };
	    refineTotal(assetData);
	    function checkAndApplyNearMarket(assetData) {
	        if (Math.abs(assetData.inventoryTime - market.timestamp) >= (Math.abs(assetData.inventoryTime - assetData.marketTime))) {
	            return assetData;
	        }
	        // The input market data is nearer than the market data in inventory data
	        const result = jsonCopy(assetData);
	        result.marketTime = market.timestamp;
	        result.cowbell.price = getSellPriceByHrid(SpecialItems.BagOf10CowBells, 0, market) / 10;
	        result.items.forEach(it => it.price = getSellPriceByHrid(it.hrid, 0, market));
	        refineTotal(result);
	        return result;
	    }
	    AssertStore.update((prev) => {
	        const result = [
	            ...prev.filter(it => it.inventoryTime !== inventoryTime)
	                .map(it => checkAndApplyNearMarket(it)),
	            assetData,
	        ];
	        result.sort((a, b) => b.inventoryTime - a.inventoryTime);
	        return result;
	    });
	});
	function assetPlugin() {
	    shared_js.q.subscribe({
	        complete: () => {
	            AddView({
	                id: "asset",
	                name: "Asset",
	                node: React__namespace.createElement(React__namespace.Fragment, null,
	                    React__namespace.createElement(ShowStoreActions, { store: AssertStore }),
	                    React__namespace.createElement(ShowAssert, null))
	            });
	        },
	    });
	}
	function ShowAssert() {
	    const asserts = useLatestOrDefault(AssertStore.data$, []);
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement(recharts.AreaChart, { width: 800, height: 400, data: asserts },
	            React__namespace.createElement(recharts.CartesianGrid, { strokeDasharray: "3 3" }),
	            React__namespace.createElement(recharts.XAxis, { dataKey: "inventoryTime", tickFormatter: it => formatTimestamp(it) }),
	            React__namespace.createElement(recharts.YAxis, { tickFormatter: it => formatNumber(it) }),
	            React__namespace.createElement(recharts.Tooltip, { labelFormatter: it => formatTimestamp(it), formatter: value => formatNumber(value) }),
	            React__namespace.createElement(recharts.Area, { name: "Items", dataKey: "itemTotal", stackId: "1", stroke: "#63EBB1", fill: "#63EBB1" }),
	            React__namespace.createElement(recharts.Area, { name: "Cowbell", dataKey: it => it.cowbell.total, stackId: "1", stroke: "#63EBDF", fill: "#63EBDF" }),
	            React__namespace.createElement(recharts.Area, { name: "Coin", dataKey: "coin", stackId: "1", stroke: "#63CAEB", fill: "#63CAEB" })));
	}

	function prepareSellItems(inputs) {
	    return prepareItems(inputs, getSellPriceByHrid);
	}
	function prepareBuyItems(inputs) {
	    return prepareItems(inputs, getBuyPriceByHrid);
	}
	function prepareItems(inputs, priceFunc) {
	    const items = inputs.map((input) => {
	        var _a, _b;
	        const price = priceFunc(input.hrid, (_a = input.enhancementLevel) !== null && _a !== void 0 ? _a : 0);
	        return ({
	            hrid: input.hrid,
	            enhancementLevel: (_b = input.enhancementLevel) !== null && _b !== void 0 ? _b : 0,
	            count: input.count,
	            price,
	            subtotal: input.count * price,
	            percent: 0,
	        });
	    });
	    const total = items.reduce((acc, item) => acc + item.subtotal, 0);
	    items.forEach((item) => item.percent = item.subtotal / total);
	    return { items, total, };
	}
	function BuyItemTable({ items, defaultExpand }) {
	    const { items: preparedItems } = prepareBuyItems(items);
	    return React__namespace.createElement(ExpandableItemTable, { items: preparedItems, defaultExpand: defaultExpand });
	}
	function SellItemTable({ items, defaultExpand }) {
	    const { items: preparedItems } = prepareSellItems(items);
	    return React__namespace.createElement(ExpandableItemTable, { items: preparedItems, defaultExpand: defaultExpand });
	}
	function ExpandableItemTable({ items, defaultExpand }) {
	    const [expanded, setExpanded] = React.useState(defaultExpand !== null && defaultExpand !== void 0 ? defaultExpand : false);
	    if (expanded) {
	        return React__namespace.createElement(React__namespace.Fragment, null,
	            React__namespace.createElement("button", { onClick: () => setExpanded(!expanded) }, "-"),
	            React__namespace.createElement(ItemTable, { items: items }));
	    }
	    else {
	        return React__namespace.createElement(React__namespace.Fragment, null,
	            React__namespace.createElement("button", { onClick: () => setExpanded(!expanded) }, "+"),
	            React__namespace.createElement(ShowNumber, { value: sum(items.map(item => item.subtotal)) }));
	    }
	}
	function ItemTable({ items }) {
	    if (items.length === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null);
	    }
	    return React__namespace.createElement("table", null,
	        React__namespace.createElement("thead", null,
	            React__namespace.createElement("tr", null,
	                React__namespace.createElement("th", null, "Name"),
	                React__namespace.createElement("th", null, "Count"),
	                React__namespace.createElement("th", null, "Price"),
	                React__namespace.createElement("th", null, "Subtotal"),
	                React__namespace.createElement("th", null, "Radio"))),
	        React__namespace.createElement("tbody", null, items.map((row) => React__namespace.createElement("tr", { key: `${row.hrid}-${row.enhancementLevel}` },
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowItem, { hrid: row.hrid, enhancementLevel: row.enhancementLevel })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: row.count })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: row.price })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: row.subtotal })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowPercent, { value: row.percent }))))));
	}

	function inventoryChangesPlugin() {
	    shared_js.q.subscribe({
	        complete: () => {
	            AddView({
	                id: "inventory-changes",
	                name: "Inventory Changes",
	                node: React__namespace.createElement(React__namespace.Fragment, null,
	                    React__namespace.createElement(ShowStoreActions, { store: ItemChangesStore }),
	                    React__namespace.createElement(ShowInventoryChanges, null)),
	            });
	        },
	    });
	}
	const ItemChangesStore = defineStore({
	    id: "item-changes",
	    name: "Item Changes",
	    enableSettings: true,
	    characterBased: true,
	    defaultValue: [],
	});
	InventoryItemChanges$.subscribe(({ added, removed, cause, time }) => {
	    const hour = Math.floor(time / 1000 / 60 / 60) * 1000 * 60 * 60;
	    let result = jsonCopy(ItemChangesStore.data$.getValue());
	    let entry = result.find(it => it.time === hour);
	    if (!entry) {
	        entry = {
	            time: hour,
	            action: {},
	            market: { added: [], removed: [] },
	            quest: { added: [], removed: [] },
	            loot: { added: [], removed: [] },
	            other: { added: [], removed: [] },
	            unknown: { added: [], removed: [] },
	        };
	        result = [...result, entry];
	    }
	    if (cause.type === "action") {
	        entry.action[cause.action] = mergeItemChangesData(entry.action[cause.action], { added, removed });
	    }
	    else if (cause.type === "market") {
	        entry.market = mergeItemChangesData(entry.market, { added, removed });
	    }
	    else if (cause.type === "quest") {
	        entry.quest = mergeItemChangesData(entry.quest, { added, removed });
	    }
	    else if (cause.type === "loot") {
	        entry.loot = mergeItemChangesData(entry.loot, { added, removed });
	    }
	    else if (cause.type === "unknown") {
	        entry.unknown = mergeItemChangesData(entry.unknown, { added, removed });
	    }
	    else {
	        entry.other = mergeItemChangesData(entry.other, { added, removed });
	    }
	    // Reverse order
	    result.sort((a, b) => b.time - a.time);
	    ItemChangesStore.update(result);
	});
	function ShowInventoryChanges() {
	    const changes = useLatestOrDefault(ItemChangesStore.data$, []);
	    return React__namespace.createElement("table", null,
	        React__namespace.createElement("thead", null,
	            React__namespace.createElement("tr", null,
	                React__namespace.createElement("th", null, "Time"),
	                React__namespace.createElement("th", null, "Action"),
	                React__namespace.createElement("th", null, "Other"))),
	        React__namespace.createElement("tbody", null, changes.map((it) => React__namespace.createElement("tr", { key: it.time },
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowTimestamp, { value: it.time }),
	                React__namespace.createElement("button", { onClick: () => ItemChangesStore.update(prev => prev.filter(({ time }) => time !== it.time)) }, "x")),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement("table", null,
	                    React__namespace.createElement("thead", null,
	                        React__namespace.createElement("tr", null,
	                            React__namespace.createElement("th", null, "Action"),
	                            React__namespace.createElement("th", null, "Added"),
	                            React__namespace.createElement("th", null, "Removed"))),
	                    React__namespace.createElement("tbody", null, Object.entries(it.action).map(([action, changes]) => React__namespace.createElement("tr", { key: action },
	                        React__namespace.createElement("td", null, getActionName(action)),
	                        React__namespace.createElement("td", null,
	                            React__namespace.createElement(BuyItemTable, { items: changes.added })),
	                        React__namespace.createElement("td", null,
	                            React__namespace.createElement(SellItemTable, { items: changes.removed }))))))),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement("table", null,
	                    React__namespace.createElement("thead", null,
	                        React__namespace.createElement("tr", null,
	                            React__namespace.createElement("th", null, "Type"),
	                            React__namespace.createElement("th", null, "Added"),
	                            React__namespace.createElement("th", null, "Removed"))),
	                    React__namespace.createElement("tbody", null,
	                        React__namespace.createElement(ShowChangeRow, { changes: it.market, name: "Market" }),
	                        React__namespace.createElement(ShowChangeRow, { changes: it.quest, name: "Quest" }),
	                        React__namespace.createElement(ShowChangeRow, { changes: it.loot, name: "Loot" }),
	                        React__namespace.createElement(ShowChangeRow, { changes: it.other, name: "Other" }),
	                        React__namespace.createElement(ShowChangeRow, { changes: it.unknown, name: "Unknown" }))))))));
	}
	function ShowChangeRow({ changes, name }) {
	    if (changes && changes.added.length && changes.removed.length) {
	        return React__namespace.createElement("tr", null,
	            React__namespace.createElement("td", null, name),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(BuyItemTable, { items: changes.added.map(({ hrid, level, count }) => ({
	                        hrid, enhancementLevel: level, count,
	                    })) })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(SellItemTable, { items: changes.removed.map(({ hrid, level, count }) => ({
	                        hrid, enhancementLevel: level, count,
	                    })) })));
	    }
	    else {
	        return React__namespace.createElement(React__namespace.Fragment, null);
	    }
	}

	function lootTrackerPlugin() {
	    const subscription = shared_js.r.subscribe(({ lootLog }) => {
	        AddView({
	            id: "loot-tracker",
	            name: "Loot Tracker",
	            node: React__namespace.createElement(ShowLootTracker, null)
	        });
	        subscription.unsubscribe();
	    });
	}
	const MODE_SETTING = createStringSelectSetting({
	    id: "loot-tracker.mode",
	    name: "Mode", defaultValue: "hour"
	}, [
	    { name: "All", value: "all" },
	    { name: "Hourly", value: "hour" }
	]);
	function ShowLootTracker() {
	    var _a;
	    const mode = useSetting(MODE_SETTING);
	    const event = useLatestValue(shared_js.r);
	    const lootLogs = [...((_a = event === null || event === void 0 ? void 0 : event.lootLog) !== null && _a !== void 0 ? _a : [])].reverse();
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement("div", null,
	            "Current: ",
	            mode === "hour" ? "Hourly Data" : "Total",
	            React__namespace.createElement("button", { onClick: () => updateSetting(MODE_SETTING, "hour") }, "Hourly"),
	            React__namespace.createElement("button", { onClick: () => updateSetting(MODE_SETTING, "all") }, "Total")),
	        React__namespace.createElement("table", null,
	            React__namespace.createElement("thead", null,
	                React__namespace.createElement("tr", null,
	                    React__namespace.createElement("th", null, "Summary"),
	                    React__namespace.createElement("th", null, "Inputs"),
	                    React__namespace.createElement("th", null, "Spending"),
	                    React__namespace.createElement("th", null, "Drops"),
	                    React__namespace.createElement("th", null, "Income"))),
	            React__namespace.createElement("tbody", null, lootLogs.map((log) => React__namespace.createElement(ShowLootLog, { key: log.startTime, log: log, mode: mode })))));
	}
	function ShowLootLog({ log, mode }) {
	    const duration = (Date.parse(log.endTime) - Date.parse(log.startTime)) / 1000 / 60 / 60;
	    const factor = mode === "hour" ? duration : 1;
	    const { total: income, items: drops } = prepareSellItems(Object.entries(log.drops)
	        .map(([hridHash, count]) => (Object.assign(Object.assign({}, resolveItemHrid(hridHash)), { count: count / factor }))));
	    const { total: spending, items: inputs } = prepareBuyItems(getActionInputs(log.actionHrid, log.primaryItemHash, log.secondaryItemHash)
	        .map((item) => (Object.assign(Object.assign({}, item), { count: item.count * log.actionCount / factor }))));
	    const date = new Date(Date.parse(log.startTime));
	    return React__namespace.createElement("tr", null,
	        React__namespace.createElement("td", null,
	            React__namespace.createElement("div", null,
	                React__namespace.createElement("b", null, getActionName(log.actionHrid))),
	            React__namespace.createElement("div", null,
	                date.getFullYear(),
	                "-",
	                date.getMonth() + 1,
	                "-",
	                date.getDate(),
	                " ",
	                date.getHours(),
	                ":",
	                date.getMinutes()),
	            React__namespace.createElement("div", null,
	                React__namespace.createElement(ShowNumber, { value: duration }),
	                "h")),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(ItemTable, { items: inputs })),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(ShowNumber, { value: spending })),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(ItemTable, { items: drops })),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(ShowNumber, { value: income })));
	}

	const MarketDataContext = React.createContext(undefined);
	function ShowSellPrice({ hrid, enhancementLevel }) {
	    const marketData = React.useContext(MarketDataContext);
	    return React__namespace.createElement(ShowNumber, { value: getSellPriceByHrid(hrid, enhancementLevel, marketData) });
	}
	function ShowSellAmount({ hrid, enhancementLevel, count }) {
	    const marketData = React.useContext(MarketDataContext);
	    return React__namespace.createElement(ShowNumber, { value: getSellPriceByHrid(hrid, enhancementLevel, marketData) * count });
	}

	const MarketHistoryStore = defineStore({
	    id: "price-change",
	    name: "Market History",
	    characterBased: false,
	    enableSettings: true,
	    defaultValue: [],
	});
	MarketDataStore.data$.subscribe(data => {
	    MarketHistoryStore.update(previous => {
	        if (previous.find(it => it.timestamp === data.timestamp)) {
	            return previous;
	        }
	        const result = [...previous, data];
	        result.sort((a, b) => b.timestamp - a.timestamp);
	        return result;
	    });
	});
	function priceChangePlugin() {
	    shared_js.q.subscribe({
	        complete: () => {
	            AddView({
	                id: "price-change",
	                name: "Price Change",
	                node: React__namespace.createElement(React__namespace.Fragment, null,
	                    React__namespace.createElement(ShowStoreActions, { store: MarketHistoryStore }),
	                    React__namespace.createElement(ShowPriceChange, null))
	            });
	        },
	    });
	}
	const SHOW_OTHERS_SETTING = createBoolSetting("price-change.show-others", "Show others", false);
	function ShowPriceChange() {
	    var _a, _b;
	    const history = useLatestOrDefault(MarketHistoryStore.data$, []);
	    const inventory = useLatestValue(InventoryData$);
	    const showOthers = useSetting(SHOW_OTHERS_SETTING);
	    if (inventory === null || history.length === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null, "No data");
	    }
	    const items = Object.entries(inventory.inventory)
	        .filter(([hrid, _]) => ![
	        // Due to the sell price is not stable
	        ItemCategory.Equipment,
	        // Due to the currency is special
	        ItemCategory.Currency,
	        // Ignore unknown first
	        ItemCategory.Unknown,
	    ].includes(getItemCategory(hrid)))
	        .map(([hrid, value]) => {
	        var _a;
	        const count = (_a = value[0]) !== null && _a !== void 0 ? _a : 0;
	        const price = getSellPriceByHrid(hrid, 0, history[0]);
	        return {
	            hrid,
	            count,
	            price,
	            subtotal: count * price
	        };
	    })
	        .sort((a, b) => b.subtotal - a.subtotal);
	    const coin = (_b = (_a = inventory.inventory[SpecialItems.Coin]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0;
	    const itemsTotal = sum(items.map(it => it.subtotal));
	    const main = items.filter(it => it.subtotal / itemsTotal >= 0.01);
	    const others = items.filter(it => it.subtotal / itemsTotal < 0.01);
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement("div", null,
	            "Coin: ",
	            React__namespace.createElement(ShowNumber, { value: coin })),
	        React__namespace.createElement("table", null,
	            React__namespace.createElement("thead", null,
	                React__namespace.createElement("tr", null,
	                    React__namespace.createElement("th", { rowSpan: 2 }, "Item"),
	                    React__namespace.createElement("th", { rowSpan: 2 }, "Count"),
	                    history.map(({ timestamp }) => React__namespace.createElement("th", { key: timestamp, colSpan: 2 },
	                        React__namespace.createElement(ShowTimestamp, { value: timestamp * 1000 }),
	                        React__namespace.createElement("button", { onClick: () => MarketHistoryStore.update(prev => prev.filter(it => it.timestamp !== timestamp)) }, "x")))),
	                React__namespace.createElement("tr", null, history.map(it => React__namespace.createElement(React.Fragment, { key: it.timestamp },
	                    React__namespace.createElement("th", null, "Price"),
	                    React__namespace.createElement("th", null, "Subtotal"))))),
	            React__namespace.createElement("tbody", null,
	                main.map(({ hrid, count }) => React__namespace.createElement("tr", { key: hrid },
	                    React__namespace.createElement("th", null,
	                        React__namespace.createElement(ShowItem, { hrid: hrid })),
	                    React__namespace.createElement("td", null,
	                        React__namespace.createElement(ShowNumber, { value: count })),
	                    history.map(marketData => React__namespace.createElement(MarketDataContext.Provider, { key: marketData.timestamp, value: marketData },
	                        React__namespace.createElement("td", null,
	                            React__namespace.createElement(ShowSellPrice, { hrid: hrid })),
	                        React__namespace.createElement("td", null,
	                            React__namespace.createElement(ShowSellAmount, { hrid: hrid, count: count })))))),
	                showOthers ?
	                    others.map(({ hrid, count }) => React__namespace.createElement("tr", { key: hrid },
	                        React__namespace.createElement("th", null,
	                            React__namespace.createElement(ShowItem, { hrid: hrid })),
	                        React__namespace.createElement("td", null,
	                            React__namespace.createElement(ShowNumber, { value: count })),
	                        history.map(marketData => React__namespace.createElement(MarketDataContext.Provider, { key: marketData.timestamp, value: marketData },
	                            React__namespace.createElement("td", null,
	                                React__namespace.createElement(ShowSellPrice, { hrid: hrid })),
	                            React__namespace.createElement("td", null,
	                                React__namespace.createElement(ShowSellAmount, { hrid: hrid, count: count }))))))
	                    : React__namespace.createElement("tr", null,
	                        React__namespace.createElement("th", { colSpan: 2 },
	                            "Others(<1%)",
	                            React__namespace.createElement("button", { onClick: () => updateSetting(SHOW_OTHERS_SETTING, true) }, "+")),
	                        history.map(marketData => React__namespace.createElement("td", { key: marketData.timestamp, colSpan: 2 },
	                            React__namespace.createElement(ShowNumber, { value: sum(others.map(({ hrid, count }) => getSellPriceByHrid(hrid, 0, marketData) * count)) }))))),
	            React__namespace.createElement("tfoot", null,
	                React__namespace.createElement("tr", null,
	                    React__namespace.createElement("th", { colSpan: 2 },
	                        "Total",
	                        showOthers ? React__namespace.createElement("button", { onClick: () => updateSetting(SHOW_OTHERS_SETTING, false) }, "-(<1%)") : React__namespace.createElement(React__namespace.Fragment, null)),
	                    history.map(marketData => React__namespace.createElement("td", { key: marketData.timestamp, colSpan: 2 },
	                        React__namespace.createElement(ShowNumber, { value: sum(items.map(({ hrid, count }) => getSellPriceByHrid(hrid, 0, marketData) * count)) })))))));
	}

	// src/utils/env.ts
	var NOTHING = Symbol.for("immer-nothing");
	var DRAFTABLE = Symbol.for("immer-draftable");
	var DRAFT_STATE = Symbol.for("immer-state");
	function die(error, ...args) {
	  throw new Error(
	    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
	  );
	}

	// src/utils/common.ts
	var getPrototypeOf = Object.getPrototypeOf;
	function isDraft(value) {
	  return !!value && !!value[DRAFT_STATE];
	}
	function isDraftable(value) {
	  if (!value)
	    return false;
	  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!value.constructor?.[DRAFTABLE] || isMap(value) || isSet(value);
	}
	var objectCtorString = Object.prototype.constructor.toString();
	function isPlainObject(value) {
	  if (!value || typeof value !== "object")
	    return false;
	  const proto = getPrototypeOf(value);
	  if (proto === null) {
	    return true;
	  }
	  const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
	  if (Ctor === Object)
	    return true;
	  return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
	}
	function each(obj, iter) {
	  if (getArchtype(obj) === 0 /* Object */) {
	    Reflect.ownKeys(obj).forEach((key) => {
	      iter(key, obj[key], obj);
	    });
	  } else {
	    obj.forEach((entry, index) => iter(index, entry, obj));
	  }
	}
	function getArchtype(thing) {
	  const state = thing[DRAFT_STATE];
	  return state ? state.type_ : Array.isArray(thing) ? 1 /* Array */ : isMap(thing) ? 2 /* Map */ : isSet(thing) ? 3 /* Set */ : 0 /* Object */;
	}
	function has(thing, prop) {
	  return getArchtype(thing) === 2 /* Map */ ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
	}
	function set(thing, propOrOldValue, value) {
	  const t = getArchtype(thing);
	  if (t === 2 /* Map */)
	    thing.set(propOrOldValue, value);
	  else if (t === 3 /* Set */) {
	    thing.add(value);
	  } else
	    thing[propOrOldValue] = value;
	}
	function is(x, y) {
	  if (x === y) {
	    return x !== 0 || 1 / x === 1 / y;
	  } else {
	    return x !== x && y !== y;
	  }
	}
	function isMap(target) {
	  return target instanceof Map;
	}
	function isSet(target) {
	  return target instanceof Set;
	}
	function latest(state) {
	  return state.copy_ || state.base_;
	}
	function shallowCopy(base, strict) {
	  if (isMap(base)) {
	    return new Map(base);
	  }
	  if (isSet(base)) {
	    return new Set(base);
	  }
	  if (Array.isArray(base))
	    return Array.prototype.slice.call(base);
	  const isPlain = isPlainObject(base);
	  if (strict === true || strict === "class_only" && !isPlain) {
	    const descriptors = Object.getOwnPropertyDescriptors(base);
	    delete descriptors[DRAFT_STATE];
	    let keys = Reflect.ownKeys(descriptors);
	    for (let i = 0; i < keys.length; i++) {
	      const key = keys[i];
	      const desc = descriptors[key];
	      if (desc.writable === false) {
	        desc.writable = true;
	        desc.configurable = true;
	      }
	      if (desc.get || desc.set)
	        descriptors[key] = {
	          configurable: true,
	          writable: true,
	          // could live with !!desc.set as well here...
	          enumerable: desc.enumerable,
	          value: base[key]
	        };
	    }
	    return Object.create(getPrototypeOf(base), descriptors);
	  } else {
	    const proto = getPrototypeOf(base);
	    if (proto !== null && isPlain) {
	      return { ...base };
	    }
	    const obj = Object.create(proto);
	    return Object.assign(obj, base);
	  }
	}
	function freeze(obj, deep = false) {
	  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
	    return obj;
	  if (getArchtype(obj) > 1) {
	    obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
	  }
	  Object.freeze(obj);
	  if (deep)
	    Object.entries(obj).forEach(([key, value]) => freeze(value, true));
	  return obj;
	}
	function dontMutateFrozenCollections() {
	  die(2);
	}
	function isFrozen(obj) {
	  return Object.isFrozen(obj);
	}

	// src/utils/plugins.ts
	var plugins = {};
	function getPlugin(pluginKey) {
	  const plugin = plugins[pluginKey];
	  if (!plugin) {
	    die(0, pluginKey);
	  }
	  return plugin;
	}

	// src/core/scope.ts
	var currentScope;
	function getCurrentScope() {
	  return currentScope;
	}
	function createScope(parent_, immer_) {
	  return {
	    drafts_: [],
	    parent_,
	    immer_,
	    // Whenever the modified draft contains a draft from another scope, we
	    // need to prevent auto-freezing so the unowned draft can be finalized.
	    canAutoFreeze_: true,
	    unfinalizedDrafts_: 0
	  };
	}
	function usePatchesInScope(scope, patchListener) {
	  if (patchListener) {
	    getPlugin("Patches");
	    scope.patches_ = [];
	    scope.inversePatches_ = [];
	    scope.patchListener_ = patchListener;
	  }
	}
	function revokeScope(scope) {
	  leaveScope(scope);
	  scope.drafts_.forEach(revokeDraft);
	  scope.drafts_ = null;
	}
	function leaveScope(scope) {
	  if (scope === currentScope) {
	    currentScope = scope.parent_;
	  }
	}
	function enterScope(immer2) {
	  return currentScope = createScope(currentScope, immer2);
	}
	function revokeDraft(draft) {
	  const state = draft[DRAFT_STATE];
	  if (state.type_ === 0 /* Object */ || state.type_ === 1 /* Array */)
	    state.revoke_();
	  else
	    state.revoked_ = true;
	}

	// src/core/finalize.ts
	function processResult(result, scope) {
	  scope.unfinalizedDrafts_ = scope.drafts_.length;
	  const baseDraft = scope.drafts_[0];
	  const isReplaced = result !== void 0 && result !== baseDraft;
	  if (isReplaced) {
	    if (baseDraft[DRAFT_STATE].modified_) {
	      revokeScope(scope);
	      die(4);
	    }
	    if (isDraftable(result)) {
	      result = finalize(scope, result);
	      if (!scope.parent_)
	        maybeFreeze(scope, result);
	    }
	    if (scope.patches_) {
	      getPlugin("Patches").generateReplacementPatches_(
	        baseDraft[DRAFT_STATE].base_,
	        result,
	        scope.patches_,
	        scope.inversePatches_
	      );
	    }
	  } else {
	    result = finalize(scope, baseDraft, []);
	  }
	  revokeScope(scope);
	  if (scope.patches_) {
	    scope.patchListener_(scope.patches_, scope.inversePatches_);
	  }
	  return result !== NOTHING ? result : void 0;
	}
	function finalize(rootScope, value, path) {
	  if (isFrozen(value))
	    return value;
	  const state = value[DRAFT_STATE];
	  if (!state) {
	    each(
	      value,
	      (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path)
	    );
	    return value;
	  }
	  if (state.scope_ !== rootScope)
	    return value;
	  if (!state.modified_) {
	    maybeFreeze(rootScope, state.base_, true);
	    return state.base_;
	  }
	  if (!state.finalized_) {
	    state.finalized_ = true;
	    state.scope_.unfinalizedDrafts_--;
	    const result = state.copy_;
	    let resultEach = result;
	    let isSet2 = false;
	    if (state.type_ === 3 /* Set */) {
	      resultEach = new Set(result);
	      result.clear();
	      isSet2 = true;
	    }
	    each(
	      resultEach,
	      (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2)
	    );
	    maybeFreeze(rootScope, result, false);
	    if (path && rootScope.patches_) {
	      getPlugin("Patches").generatePatches_(
	        state,
	        path,
	        rootScope.patches_,
	        rootScope.inversePatches_
	      );
	    }
	  }
	  return state.copy_;
	}
	function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
	  if (isDraft(childValue)) {
	    const path = rootPath && parentState && parentState.type_ !== 3 /* Set */ && // Set objects are atomic since they have no keys.
	    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
	    const res = finalize(rootScope, childValue, path);
	    set(targetObject, prop, res);
	    if (isDraft(res)) {
	      rootScope.canAutoFreeze_ = false;
	    } else
	      return;
	  } else if (targetIsSet) {
	    targetObject.add(childValue);
	  }
	  if (isDraftable(childValue) && !isFrozen(childValue)) {
	    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
	      return;
	    }
	    finalize(rootScope, childValue);
	    if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && Object.prototype.propertyIsEnumerable.call(targetObject, prop))
	      maybeFreeze(rootScope, childValue);
	  }
	}
	function maybeFreeze(scope, value, deep = false) {
	  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
	    freeze(value, deep);
	  }
	}

	// src/core/proxy.ts
	function createProxyProxy(base, parent) {
	  const isArray = Array.isArray(base);
	  const state = {
	    type_: isArray ? 1 /* Array */ : 0 /* Object */,
	    // Track which produce call this is associated with.
	    scope_: parent ? parent.scope_ : getCurrentScope(),
	    // True for both shallow and deep changes.
	    modified_: false,
	    // Used during finalization.
	    finalized_: false,
	    // Track which properties have been assigned (true) or deleted (false).
	    assigned_: {},
	    // The parent draft state.
	    parent_: parent,
	    // The base state.
	    base_: base,
	    // The base proxy.
	    draft_: null,
	    // set below
	    // The base copy with any updated values.
	    copy_: null,
	    // Called by the `produce` function.
	    revoke_: null,
	    isManual_: false
	  };
	  let target = state;
	  let traps = objectTraps;
	  if (isArray) {
	    target = [state];
	    traps = arrayTraps;
	  }
	  const { revoke, proxy } = Proxy.revocable(target, traps);
	  state.draft_ = proxy;
	  state.revoke_ = revoke;
	  return proxy;
	}
	var objectTraps = {
	  get(state, prop) {
	    if (prop === DRAFT_STATE)
	      return state;
	    const source = latest(state);
	    if (!has(source, prop)) {
	      return readPropFromProto(state, source, prop);
	    }
	    const value = source[prop];
	    if (state.finalized_ || !isDraftable(value)) {
	      return value;
	    }
	    if (value === peek(state.base_, prop)) {
	      prepareCopy(state);
	      return state.copy_[prop] = createProxy(value, state);
	    }
	    return value;
	  },
	  has(state, prop) {
	    return prop in latest(state);
	  },
	  ownKeys(state) {
	    return Reflect.ownKeys(latest(state));
	  },
	  set(state, prop, value) {
	    const desc = getDescriptorFromProto(latest(state), prop);
	    if (desc?.set) {
	      desc.set.call(state.draft_, value);
	      return true;
	    }
	    if (!state.modified_) {
	      const current2 = peek(latest(state), prop);
	      const currentState = current2?.[DRAFT_STATE];
	      if (currentState && currentState.base_ === value) {
	        state.copy_[prop] = value;
	        state.assigned_[prop] = false;
	        return true;
	      }
	      if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
	        return true;
	      prepareCopy(state);
	      markChanged(state);
	    }
	    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
	    (value !== void 0 || prop in state.copy_) || // special case: NaN
	    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
	      return true;
	    state.copy_[prop] = value;
	    state.assigned_[prop] = true;
	    return true;
	  },
	  deleteProperty(state, prop) {
	    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
	      state.assigned_[prop] = false;
	      prepareCopy(state);
	      markChanged(state);
	    } else {
	      delete state.assigned_[prop];
	    }
	    if (state.copy_) {
	      delete state.copy_[prop];
	    }
	    return true;
	  },
	  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
	  // the same guarantee in ES5 mode.
	  getOwnPropertyDescriptor(state, prop) {
	    const owner = latest(state);
	    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
	    if (!desc)
	      return desc;
	    return {
	      writable: true,
	      configurable: state.type_ !== 1 /* Array */ || prop !== "length",
	      enumerable: desc.enumerable,
	      value: owner[prop]
	    };
	  },
	  defineProperty() {
	    die(11);
	  },
	  getPrototypeOf(state) {
	    return getPrototypeOf(state.base_);
	  },
	  setPrototypeOf() {
	    die(12);
	  }
	};
	var arrayTraps = {};
	each(objectTraps, (key, fn) => {
	  arrayTraps[key] = function() {
	    arguments[0] = arguments[0][0];
	    return fn.apply(this, arguments);
	  };
	});
	arrayTraps.deleteProperty = function(state, prop) {
	  return arrayTraps.set.call(this, state, prop, void 0);
	};
	arrayTraps.set = function(state, prop, value) {
	  return objectTraps.set.call(this, state[0], prop, value, state[0]);
	};
	function peek(draft, prop) {
	  const state = draft[DRAFT_STATE];
	  const source = state ? latest(state) : draft;
	  return source[prop];
	}
	function readPropFromProto(state, source, prop) {
	  const desc = getDescriptorFromProto(source, prop);
	  return desc ? `value` in desc ? desc.value : (
	    // This is a very special case, if the prop is a getter defined by the
	    // prototype, we should invoke it with the draft as context!
	    desc.get?.call(state.draft_)
	  ) : void 0;
	}
	function getDescriptorFromProto(source, prop) {
	  if (!(prop in source))
	    return void 0;
	  let proto = getPrototypeOf(source);
	  while (proto) {
	    const desc = Object.getOwnPropertyDescriptor(proto, prop);
	    if (desc)
	      return desc;
	    proto = getPrototypeOf(proto);
	  }
	  return void 0;
	}
	function markChanged(state) {
	  if (!state.modified_) {
	    state.modified_ = true;
	    if (state.parent_) {
	      markChanged(state.parent_);
	    }
	  }
	}
	function prepareCopy(state) {
	  if (!state.copy_) {
	    state.copy_ = shallowCopy(
	      state.base_,
	      state.scope_.immer_.useStrictShallowCopy_
	    );
	  }
	}

	// src/core/immerClass.ts
	var Immer2 = class {
	  constructor(config) {
	    this.autoFreeze_ = true;
	    this.useStrictShallowCopy_ = false;
	    /**
	     * The `produce` function takes a value and a "recipe function" (whose
	     * return value often depends on the base state). The recipe function is
	     * free to mutate its first argument however it wants. All mutations are
	     * only ever applied to a __copy__ of the base state.
	     *
	     * Pass only a function to create a "curried producer" which relieves you
	     * from passing the recipe function every time.
	     *
	     * Only plain objects and arrays are made mutable. All other objects are
	     * considered uncopyable.
	     *
	     * Note: This function is __bound__ to its `Immer` instance.
	     *
	     * @param {any} base - the initial state
	     * @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
	     * @param {Function} patchListener - optional function that will be called with all the patches produced here
	     * @returns {any} a new state, or the initial state if nothing was modified
	     */
	    this.produce = (base, recipe, patchListener) => {
	      if (typeof base === "function" && typeof recipe !== "function") {
	        const defaultBase = recipe;
	        recipe = base;
	        const self = this;
	        return function curriedProduce(base2 = defaultBase, ...args) {
	          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
	        };
	      }
	      if (typeof recipe !== "function")
	        die(6);
	      if (patchListener !== void 0 && typeof patchListener !== "function")
	        die(7);
	      let result;
	      if (isDraftable(base)) {
	        const scope = enterScope(this);
	        const proxy = createProxy(base, void 0);
	        let hasError = true;
	        try {
	          result = recipe(proxy);
	          hasError = false;
	        } finally {
	          if (hasError)
	            revokeScope(scope);
	          else
	            leaveScope(scope);
	        }
	        usePatchesInScope(scope, patchListener);
	        return processResult(result, scope);
	      } else if (!base || typeof base !== "object") {
	        result = recipe(base);
	        if (result === void 0)
	          result = base;
	        if (result === NOTHING)
	          result = void 0;
	        if (this.autoFreeze_)
	          freeze(result, true);
	        if (patchListener) {
	          const p = [];
	          const ip = [];
	          getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
	          patchListener(p, ip);
	        }
	        return result;
	      } else
	        die(1, base);
	    };
	    this.produceWithPatches = (base, recipe) => {
	      if (typeof base === "function") {
	        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
	      }
	      let patches, inversePatches;
	      const result = this.produce(base, recipe, (p, ip) => {
	        patches = p;
	        inversePatches = ip;
	      });
	      return [result, patches, inversePatches];
	    };
	    if (typeof config?.autoFreeze === "boolean")
	      this.setAutoFreeze(config.autoFreeze);
	    if (typeof config?.useStrictShallowCopy === "boolean")
	      this.setUseStrictShallowCopy(config.useStrictShallowCopy);
	  }
	  createDraft(base) {
	    if (!isDraftable(base))
	      die(8);
	    if (isDraft(base))
	      base = current(base);
	    const scope = enterScope(this);
	    const proxy = createProxy(base, void 0);
	    proxy[DRAFT_STATE].isManual_ = true;
	    leaveScope(scope);
	    return proxy;
	  }
	  finishDraft(draft, patchListener) {
	    const state = draft && draft[DRAFT_STATE];
	    if (!state || !state.isManual_)
	      die(9);
	    const { scope_: scope } = state;
	    usePatchesInScope(scope, patchListener);
	    return processResult(void 0, scope);
	  }
	  /**
	   * Pass true to automatically freeze all copies created by Immer.
	   *
	   * By default, auto-freezing is enabled.
	   */
	  setAutoFreeze(value) {
	    this.autoFreeze_ = value;
	  }
	  /**
	   * Pass true to enable strict shallow copy.
	   *
	   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
	   */
	  setUseStrictShallowCopy(value) {
	    this.useStrictShallowCopy_ = value;
	  }
	  applyPatches(base, patches) {
	    let i;
	    for (i = patches.length - 1; i >= 0; i--) {
	      const patch = patches[i];
	      if (patch.path.length === 0 && patch.op === "replace") {
	        base = patch.value;
	        break;
	      }
	    }
	    if (i > -1) {
	      patches = patches.slice(i + 1);
	    }
	    const applyPatchesImpl = getPlugin("Patches").applyPatches_;
	    if (isDraft(base)) {
	      return applyPatchesImpl(base, patches);
	    }
	    return this.produce(
	      base,
	      (draft) => applyPatchesImpl(draft, patches)
	    );
	  }
	};
	function createProxy(value, parent) {
	  const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
	  const scope = parent ? parent.scope_ : getCurrentScope();
	  scope.drafts_.push(draft);
	  return draft;
	}

	// src/core/current.ts
	function current(value) {
	  if (!isDraft(value))
	    die(10, value);
	  return currentImpl(value);
	}
	function currentImpl(value) {
	  if (!isDraftable(value) || isFrozen(value))
	    return value;
	  const state = value[DRAFT_STATE];
	  let copy;
	  if (state) {
	    if (!state.modified_)
	      return state.base_;
	    state.finalized_ = true;
	    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
	  } else {
	    copy = shallowCopy(value, true);
	  }
	  each(copy, (key, childValue) => {
	    set(copy, key, currentImpl(childValue));
	  });
	  if (state) {
	    state.finalized_ = false;
	  }
	  return copy;
	}

	// src/immer.ts
	var immer = new Immer2();
	var produce = immer.produce;
	immer.produceWithPatches.bind(
	  immer
	);
	immer.setAutoFreeze.bind(immer);
	immer.setUseStrictShallowCopy.bind(immer);
	immer.applyPatches.bind(immer);
	immer.createDraft.bind(immer);
	immer.finishDraft.bind(immer);

	var NormalBuffType;
	(function (NormalBuffType) {
	    NormalBuffType["ActionSpeed"] = "/buff_types/action_speed";
	    NormalBuffType["Efficiency"] = "/buff_types/efficiency";
	    NormalBuffType["Gathering"] = "/buff_types/gathering";
	    NormalBuffType["Wisdom"] = "/buff_types/wisdom";
	    NormalBuffType["RareFind"] = "/buff_types/rare_find";
	    NormalBuffType["EssenceFind"] = "/buff_types/essence_find";
	})(NormalBuffType || (NormalBuffType = {}));
	var EnhancingBuffType;
	(function (EnhancingBuffType) {
	    EnhancingBuffType["EnhancingSuccess"] = "/buff_types/enhancing_success";
	})(EnhancingBuffType || (EnhancingBuffType = {}));
	/**
	 * This is class defined by this project
	 */
	var BuffSource;
	(function (BuffSource) {
	    // Equipment
	    BuffSource["Equipment"] = "equipment";
	    // Moo Pass
	    BuffSource["MooPass"] = "experience_moo_pass_buff";
	    // Community
	    BuffSource["Community"] = "community";
	    // House
	    BuffSource["Room"] = "room";
	    BuffSource["House"] = "house";
	    // Tea
	    BuffSource["Tea"] = "tea";
	    // Level
	    BuffSource["Level"] = "level";
	})(BuffSource || (BuffSource = {}));

	var EquipmentTool;
	(function (EquipmentTool) {
	    EquipmentTool["AlchemyTool"] = "/item_locations/alchemy_tool";
	    EquipmentTool["BrewingTool"] = "/item_locations/brewing_tool";
	    EquipmentTool["CheesesmithingTool"] = "/item_locations/cheesesmithing_tool";
	    EquipmentTool["CookingTool"] = "/item_locations/cooking_tool";
	    EquipmentTool["CraftingTool"] = "/item_locations/crafting_tool";
	    EquipmentTool["EnhancingTool"] = "/item_locations/enhancing_tool";
	    EquipmentTool["ForagingTool"] = "/item_locations/foraging_tool";
	    EquipmentTool["MilkingTool"] = "/item_locations/milking_tool";
	    EquipmentTool["TailoringTool"] = "/item_locations/tailoring_tool";
	    EquipmentTool["WoodcuttingTool"] = "/item_locations/woodcutting_tool";
	})(EquipmentTool || (EquipmentTool = {}));
	var EquipmentLocation;
	(function (EquipmentLocation) {
	    EquipmentLocation["Back"] = "/item_locations/back";
	    EquipmentLocation["Body"] = "/item_locations/body";
	    EquipmentLocation["Earrings"] = "/item_locations/earrings";
	    EquipmentLocation["Feet"] = "/item_locations/feet";
	    EquipmentLocation["Hands"] = "/item_locations/hands";
	    EquipmentLocation["Head"] = "/item_locations/head";
	    EquipmentLocation["Legs"] = "/item_locations/legs";
	    EquipmentLocation["MainHand"] = "/item_locations/main_hand";
	    EquipmentLocation["Neck"] = "/item_locations/neck";
	    EquipmentLocation["OffHand"] = "/item_locations/off_hand";
	    EquipmentLocation["Pouch"] = "/item_locations/pouch";
	    EquipmentLocation["Ring"] = "/item_locations/ring";
	    EquipmentLocation["Trinket"] = "/item_locations/trinket";
	    EquipmentLocation["TwoHand"] = "/item_locations/two_hand";
	})(EquipmentLocation || (EquipmentLocation = {}));
	function getEquipmentLocationByHrid(hrid) {
	    return Object.values(EquipmentLocation).find((location) => location === hrid) ||
	        Object.values(EquipmentTool).find((tool) => tool === hrid) || null;
	}
	const EquipmentStore = defineStore({
	    id: "equipment",
	    name: "Equipment",
	    characterBased: true,
	    enableSettings: true,
	    defaultValue: {},
	});
	shared_js.s.subscribe((data) => {
	    const localEquipment = {};
	    Object.values(data.characterItems).forEach((item) => {
	        const location = getEquipmentLocationByHrid(item.itemLocationHrid);
	        if (location === null) {
	            return;
	        }
	        localEquipment[location] = {
	            location,
	            itemHrid: item.itemHrid,
	            enhancementLevel: item.enhancementLevel,
	        };
	    });
	    EquipmentStore.update(localEquipment);
	});

	function getBuffTypeName(action) {
	    return getClientData().buffTypeDetailMap[action].name;
	}
	function getKeysOfNonCombatStat(action, buffType) {
	    const shortAction = action.substring("/action_types/".length);
	    switch (buffType) {
	        case NormalBuffType.Wisdom:
	            return [
	                `${shortAction}Experience`,
	                "skillingExperience",
	            ];
	        case EnhancingBuffType.EnhancingSuccess:
	            return ["enhancingSuccess"];
	        case NormalBuffType.Efficiency:
	            if (action === EnhancingActionType.Enhancing) {
	                return [];
	            }
	            return [
	                `${shortAction}Efficiency`,
	                "skillingEfficiency",
	            ];
	        case NormalBuffType.ActionSpeed:
	            return [
	                `${shortAction}Speed`,
	                "skillingSpeed",
	            ];
	        case NormalBuffType.Gathering:
	            return ["gatheringQuantity"];
	        case NormalBuffType.EssenceFind:
	            return ["skillingEssenceFind"];
	        case NormalBuffType.RareFind:
	            return [
	                `${shortAction}RareFind`,
	                "skillingRareFind",
	            ];
	        default:
	            return [];
	    }
	}
	function getBuffValueOfEquipment(action, buffType, hrid, enhancementLevel) {
	    var _a;
	    const keys = getKeysOfNonCombatStat(action, buffType);
	    if (!keys.length) {
	        return 0;
	    }
	    const equipmentDetail = (_a = getClientData().itemDetailMap[hrid]) === null || _a === void 0 ? void 0 : _a.equipmentDetail;
	    if (!equipmentDetail) {
	        return 0;
	    }
	    const basic = sum(keys.map((key) => { var _a; return (_a = equipmentDetail.noncombatStats[key]) !== null && _a !== void 0 ? _a : 0; }));
	    const bonus = sum(keys.map((key) => { var _a; return (_a = equipmentDetail.noncombatEnhancementBonuses[key]) !== null && _a !== void 0 ? _a : 0; }));
	    return basic + getClientData().enhancementLevelTotalBonusMultiplierTable[enhancementLevel] * bonus;
	}
	function getBuffValueOfTea(action, buffType, hrid) {
	    var _a;
	    const keys = getKeysOfNonCombatStat(action, buffType);
	    if (!keys.length) {
	        return 0;
	    }
	    const consumableDetail = (_a = getClientData().itemDetailMap[hrid]) === null || _a === void 0 ? void 0 : _a.consumableDetail;
	    if (!consumableDetail || !consumableDetail.buffs) {
	        return 0;
	    }
	    return sum(consumableDetail.buffs.filter(it => it.typeHrid === buffType)
	        .map(it => it.flatBoost));
	}
	function createEmptyBuffData() {
	    function createEmptyBuffTypeData() {
	        return {
	            value: 0,
	            [BuffSource.Equipment]: {
	                value: 0,
	                equipments: [],
	            },
	            [BuffSource.MooPass]: {
	                value: 0,
	            },
	            [BuffSource.Community]: {
	                value: 0,
	            },
	            [BuffSource.House]: {
	                value: 0,
	            },
	            [BuffSource.Room]: {
	                value: 0,
	            },
	            [BuffSource.Tea]: {
	                value: 0,
	                slots: [],
	            },
	            [BuffSource.Level]: {
	                value: 0,
	                levelRequirement: 0,
	                level: 0
	            }
	        };
	    }
	    return {
	        [NormalBuffType.ActionSpeed]: createEmptyBuffTypeData(),
	        [NormalBuffType.Efficiency]: createEmptyBuffTypeData(),
	        [NormalBuffType.Gathering]: createEmptyBuffTypeData(),
	        [NormalBuffType.Wisdom]: createEmptyBuffTypeData(),
	        [EnhancingBuffType.EnhancingSuccess]: createEmptyBuffTypeData(),
	        [NormalBuffType.EssenceFind]: createEmptyBuffTypeData(),
	        [NormalBuffType.RareFind]: createEmptyBuffTypeData(),
	    };
	}
	const BuffDataStore = defineStore({
	    id: "buff-data",
	    name: "Buff Data",
	    characterBased: true,
	    enableSettings: false,
	    defaultValue: {
	        [CollectActionType.Foraging]: createEmptyBuffData(),
	        [CollectActionType.Milking]: createEmptyBuffData(),
	        [CollectActionType.Woodcutting]: createEmptyBuffData(),
	        [ManufacturingActionType.Cheesesmithing]: createEmptyBuffData(),
	        [ManufacturingActionType.Crafting]: createEmptyBuffData(),
	        [ManufacturingActionType.Tailoring]: createEmptyBuffData(),
	        [ManufacturingActionType.Cooking]: createEmptyBuffData(),
	        [ManufacturingActionType.Brewing]: createEmptyBuffData(),
	        [AlchemyActionType.Alchemy]: createEmptyBuffData(),
	        [EnhancingActionType.Enhancing]: createEmptyBuffData(),
	    },
	});
	function produceLevelData(buffData, levelRequirement, level) {
	    return produce(buffData, (draft) => {
	        const efficiency = draft[NormalBuffType.Efficiency];
	        // Process efficiency of level
	        let value = (level - levelRequirement) * 0.01;
	        if (levelRequirement > level) {
	            // Reset efficiency
	            efficiency.value = -1;
	        }
	        else {
	            efficiency.value += value;
	        }
	        efficiency[BuffSource.Level] = { value, level, levelRequirement, };
	        return draft;
	    });
	}
	shared_js.i({ characterData: shared_js.b, equipmentData: EquipmentStore.data$ }).subscribe((({ characterData, equipmentData }) => {
	    BuffDataStore.update(Object.fromEntries([CollectActionType, ManufacturingActionType, AlchemyActionType, EnhancingActionType]
	        .flatMap((typeEnum) => Object.values(typeEnum)
	        .map((actionType) => [actionType, createBuffData(actionType, characterData, equipmentData)]))));
	}));
	function createBuffData(actionType, characterData, equipmentData) {
	    return {
	        [NormalBuffType.ActionSpeed]: createBuffSourceData(actionType, NormalBuffType.ActionSpeed, characterData, equipmentData),
	        [NormalBuffType.Efficiency]: createBuffSourceData(actionType, NormalBuffType.Efficiency, characterData, equipmentData),
	        [NormalBuffType.Gathering]: createBuffSourceData(actionType, NormalBuffType.Gathering, characterData, equipmentData),
	        [NormalBuffType.Wisdom]: createBuffSourceData(actionType, NormalBuffType.Wisdom, characterData, equipmentData),
	        [NormalBuffType.RareFind]: createBuffSourceData(actionType, NormalBuffType.RareFind, characterData, equipmentData),
	        [NormalBuffType.EssenceFind]: createBuffSourceData(actionType, NormalBuffType.EssenceFind, characterData, equipmentData),
	        [EnhancingBuffType.EnhancingSuccess]: createBuffSourceData(actionType, EnhancingBuffType.EnhancingSuccess, characterData, equipmentData),
	    };
	}
	function createBuffSourceData(actionType, buffType, characterData, equipmentData) {
	    const equipment = createEquipmentBuffSourceData(actionType, buffType, equipmentData);
	    const mooPass = createNormalBuffSourceData(actionType, buffType, characterData, "mooPassActionTypeBuffsMap");
	    const community = createNormalBuffSourceData(actionType, buffType, characterData, "communityActionTypeBuffsMap");
	    const houseOrRoom = createNormalBuffSourceData(actionType, buffType, characterData, "houseActionTypeBuffsMap");
	    const house = (buffType === NormalBuffType.RareFind || buffType === NormalBuffType.Wisdom) ? houseOrRoom : { value: 0 };
	    const room = (buffType === NormalBuffType.RareFind || buffType === NormalBuffType.Wisdom) ? { value: 0 } : houseOrRoom;
	    const tea = createTeaBuffSourceData(actionType, buffType, characterData);
	    const level = { value: 0, levelRequirement: 0, level: 0 };
	    return {
	        value: sum([equipment.value, mooPass.value, community.value, house.value, room.value, tea.value, level.value]),
	        [BuffSource.Equipment]: equipment,
	        [BuffSource.MooPass]: mooPass,
	        [BuffSource.Community]: community,
	        [BuffSource.House]: house,
	        [BuffSource.Room]: room,
	        [BuffSource.Tea]: tea,
	        [BuffSource.Level]: level,
	    };
	}
	function createEquipmentBuffSourceData(actionType, buffType, equipmentData) {
	    const equipments = Object.values(equipmentData)
	        .map(equipment => ({
	        equipment,
	        value: getBuffValueOfEquipment(actionType, buffType, equipment.itemHrid, equipment.enhancementLevel)
	    }))
	        .filter(it => it.value > 0);
	    return {
	        value: sum(equipments.map(it => it.value)),
	        equipments,
	    };
	}
	function createNormalBuffSourceData(actionType, buffType, characterData, buffMapKey) {
	    var _a;
	    return {
	        value: sum(((_a = characterData[buffMapKey][actionType]) !== null && _a !== void 0 ? _a : [])
	            .filter(it => it.typeHrid === buffType)
	            .map(it => it.flatBoost)),
	    };
	}
	function createTeaBuffSourceData(actionType, buffType, characterData) {
	    const slots = characterData.actionTypeDrinkSlotsMap[actionType].flatMap((slot, index) => {
	        if (slot === null) {
	            return [];
	        }
	        const buffValue = getBuffValueOfTea(actionType, buffType, slot.itemHrid);
	        if (!buffValue) {
	            return [];
	        }
	        return [{
	                slot: index,
	                tea: slot.itemHrid,
	                value: buffValue,
	            }];
	    });
	    return {
	        value: sum(slots.map(it => it.value)),
	        slots,
	    };
	}

	var jstat$1 = {exports: {}};

	var jstat = jstat$1.exports;

	var hasRequiredJstat;

	function requireJstat () {
		if (hasRequiredJstat) return jstat$1.exports;
		hasRequiredJstat = 1;
		(function (module, exports) {
			(function (window, factory) {
			    {
			        module.exports = factory();
			    }
			})(jstat, function () {
			var jStat = (function(Math, undefined$1) {

			// For quick reference.
			var concat = Array.prototype.concat;
			var slice = Array.prototype.slice;
			var toString = Object.prototype.toString;

			// Calculate correction for IEEE error
			// TODO: This calculation can be improved.
			function calcRdx(n, m) {
			  var val = n > m ? n : m;
			  return Math.pow(10,
			                  17 - ~~(Math.log(((val > 0) ? val : -val)) * Math.LOG10E));
			}


			var isArray = Array.isArray || function isArray(arg) {
			  return toString.call(arg) === '[object Array]';
			};


			function isFunction(arg) {
			  return toString.call(arg) === '[object Function]';
			}


			function isNumber(num) {
			  return (typeof num === 'number') ? num - num === 0 : false;
			}


			// Converts the jStat matrix to vector.
			function toVector(arr) {
			  return concat.apply([], arr);
			}


			// The one and only jStat constructor.
			function jStat() {
			  return new jStat._init(arguments);
			}


			// TODO: Remove after all references in src files have been removed.
			jStat.fn = jStat.prototype;


			// By separating the initializer from the constructor it's easier to handle
			// always returning a new instance whether "new" was used or not.
			jStat._init = function _init(args) {
			  // If first argument is an array, must be vector or matrix.
			  if (isArray(args[0])) {
			    // Check if matrix.
			    if (isArray(args[0][0])) {
			      // See if a mapping function was also passed.
			      if (isFunction(args[1]))
			        args[0] = jStat.map(args[0], args[1]);
			      // Iterate over each is faster than this.push.apply(this, args[0].
			      for (var i = 0; i < args[0].length; i++)
			        this[i] = args[0][i];
			      this.length = args[0].length;

			    // Otherwise must be a vector.
			    } else {
			      this[0] = isFunction(args[1]) ? jStat.map(args[0], args[1]) : args[0];
			      this.length = 1;
			    }

			  // If first argument is number, assume creation of sequence.
			  } else if (isNumber(args[0])) {
			    this[0] = jStat.seq.apply(null, args);
			    this.length = 1;

			  // Handle case when jStat object is passed to jStat.
			  } else if (args[0] instanceof jStat) {
			    // Duplicate the object and pass it back.
			    return jStat(args[0].toArray());

			  // Unexpected argument value, return empty jStat object.
			  // TODO: This is strange behavior. Shouldn't this throw or some such to let
			  // the user know they had bad arguments?
			  } else {
			    this[0] = [];
			    this.length = 1;
			  }

			  return this;
			};
			jStat._init.prototype = jStat.prototype;
			jStat._init.constructor = jStat;


			// Utility functions.
			// TODO: for internal use only?
			jStat.utils = {
			  calcRdx: calcRdx,
			  isArray: isArray,
			  isFunction: isFunction,
			  isNumber: isNumber,
			  toVector: toVector
			};


			jStat._random_fn = Math.random;
			jStat.setRandom = function setRandom(fn) {
			  if (typeof fn !== 'function')
			    throw new TypeError('fn is not a function');
			  jStat._random_fn = fn;
			};


			// Easily extend the jStat object.
			// TODO: is this seriously necessary?
			jStat.extend = function extend(obj) {
			  var i, j;

			  if (arguments.length === 1) {
			    for (j in obj)
			      jStat[j] = obj[j];
			    return this;
			  }

			  for (i = 1; i < arguments.length; i++) {
			    for (j in arguments[i])
			      obj[j] = arguments[i][j];
			  }

			  return obj;
			};


			// Returns the number of rows in the matrix.
			jStat.rows = function rows(arr) {
			  return arr.length || 1;
			};


			// Returns the number of columns in the matrix.
			jStat.cols = function cols(arr) {
			  return arr[0].length || 1;
			};


			// Returns the dimensions of the object { rows: i, cols: j }
			jStat.dimensions = function dimensions(arr) {
			  return {
			    rows: jStat.rows(arr),
			    cols: jStat.cols(arr)
			  };
			};


			// Returns a specified row as a vector or return a sub matrix by pick some rows
			jStat.row = function row(arr, index) {
			  if (isArray(index)) {
			    return index.map(function(i) {
			      return jStat.row(arr, i);
			    })
			  }
			  return arr[index];
			};


			// return row as array
			// rowa([[1,2],[3,4]],0) -> [1,2]
			jStat.rowa = function rowa(arr, i) {
			  return jStat.row(arr, i);
			};


			// Returns the specified column as a vector or return a sub matrix by pick some
			// columns
			jStat.col = function col(arr, index) {
			  if (isArray(index)) {
			    var submat = jStat.arange(arr.length).map(function() {
			      return new Array(index.length);
			    });
			    index.forEach(function(ind, i){
			      jStat.arange(arr.length).forEach(function(j) {
			        submat[j][i] = arr[j][ind];
			      });
			    });
			    return submat;
			  }
			  var column = new Array(arr.length);
			  for (var i = 0; i < arr.length; i++)
			    column[i] = [arr[i][index]];
			  return column;
			};


			// return column as array
			// cola([[1,2],[3,4]],0) -> [1,3]
			jStat.cola = function cola(arr, i) {
			  return jStat.col(arr, i).map(function(a){ return a[0] });
			};


			// Returns the diagonal of the matrix
			jStat.diag = function diag(arr) {
			  var nrow = jStat.rows(arr);
			  var res = new Array(nrow);
			  for (var row = 0; row < nrow; row++)
			    res[row] = [arr[row][row]];
			  return res;
			};


			// Returns the anti-diagonal of the matrix
			jStat.antidiag = function antidiag(arr) {
			  var nrow = jStat.rows(arr) - 1;
			  var res = new Array(nrow);
			  for (var i = 0; nrow >= 0; nrow--, i++)
			    res[i] = [arr[i][nrow]];
			  return res;
			};

			// Transpose a matrix or array.
			jStat.transpose = function transpose(arr) {
			  var obj = [];
			  var objArr, rows, cols, j, i;

			  // Make sure arr is in matrix format.
			  if (!isArray(arr[0]))
			    arr = [arr];

			  rows = arr.length;
			  cols = arr[0].length;

			  for (i = 0; i < cols; i++) {
			    objArr = new Array(rows);
			    for (j = 0; j < rows; j++)
			      objArr[j] = arr[j][i];
			    obj.push(objArr);
			  }

			  // If obj is vector, return only single array.
			  return obj.length === 1 ? obj[0] : obj;
			};


			// Map a function to an array or array of arrays.
			// "toAlter" is an internal variable.
			jStat.map = function map(arr, func, toAlter) {
			  var row, nrow, ncol, res, col;

			  if (!isArray(arr[0]))
			    arr = [arr];

			  nrow = arr.length;
			  ncol = arr[0].length;
			  res = toAlter ? arr : new Array(nrow);

			  for (row = 0; row < nrow; row++) {
			    // if the row doesn't exist, create it
			    if (!res[row])
			      res[row] = new Array(ncol);
			    for (col = 0; col < ncol; col++)
			      res[row][col] = func(arr[row][col], row, col);
			  }

			  return res.length === 1 ? res[0] : res;
			};


			// Cumulatively combine the elements of an array or array of arrays using a function.
			jStat.cumreduce = function cumreduce(arr, func, toAlter) {
			  var row, nrow, ncol, res, col;

			  if (!isArray(arr[0]))
			    arr = [arr];

			  nrow = arr.length;
			  ncol = arr[0].length;
			  res = toAlter ? arr : new Array(nrow);

			  for (row = 0; row < nrow; row++) {
			    // if the row doesn't exist, create it
			    if (!res[row])
			      res[row] = new Array(ncol);
			    if (ncol > 0)
			      res[row][0] = arr[row][0];
			    for (col = 1; col < ncol; col++)
			      res[row][col] = func(res[row][col-1], arr[row][col]);
			  }
			  return res.length === 1 ? res[0] : res;
			};


			// Destructively alter an array.
			jStat.alter = function alter(arr, func) {
			  return jStat.map(arr, func, true);
			};


			// Generate a rows x cols matrix according to the supplied function.
			jStat.create = function  create(rows, cols, func) {
			  var res = new Array(rows);
			  var i, j;

			  if (isFunction(cols)) {
			    func = cols;
			    cols = rows;
			  }

			  for (i = 0; i < rows; i++) {
			    res[i] = new Array(cols);
			    for (j = 0; j < cols; j++)
			      res[i][j] = func(i, j);
			  }

			  return res;
			};


			function retZero() { return 0; }


			// Generate a rows x cols matrix of zeros.
			jStat.zeros = function zeros(rows, cols) {
			  if (!isNumber(cols))
			    cols = rows;
			  return jStat.create(rows, cols, retZero);
			};


			function retOne() { return 1; }


			// Generate a rows x cols matrix of ones.
			jStat.ones = function ones(rows, cols) {
			  if (!isNumber(cols))
			    cols = rows;
			  return jStat.create(rows, cols, retOne);
			};


			// Generate a rows x cols matrix of uniformly random numbers.
			jStat.rand = function rand(rows, cols) {
			  if (!isNumber(cols))
			    cols = rows;
			  return jStat.create(rows, cols, jStat._random_fn);
			};


			function retIdent(i, j) { return i === j ? 1 : 0; }


			// Generate an identity matrix of size row x cols.
			jStat.identity = function identity(rows, cols) {
			  if (!isNumber(cols))
			    cols = rows;
			  return jStat.create(rows, cols, retIdent);
			};


			// Tests whether a matrix is symmetric
			jStat.symmetric = function symmetric(arr) {
			  var size = arr.length;
			  var row, col;

			  if (arr.length !== arr[0].length)
			    return false;

			  for (row = 0; row < size; row++) {
			    for (col = 0; col < size; col++)
			      if (arr[col][row] !== arr[row][col])
			        return false;
			  }

			  return true;
			};


			// Set all values to zero.
			jStat.clear = function clear(arr) {
			  return jStat.alter(arr, retZero);
			};


			// Generate sequence.
			jStat.seq = function seq(min, max, length, func) {
			  if (!isFunction(func))
			    func = false;

			  var arr = [];
			  var hival = calcRdx(min, max);
			  var step = (max * hival - min * hival) / ((length - 1) * hival);
			  var current = min;
			  var cnt;

			  // Current is assigned using a technique to compensate for IEEE error.
			  // TODO: Needs better implementation.
			  for (cnt = 0;
			       current <= max && cnt < length;
			       cnt++, current = (min * hival + step * hival * cnt) / hival) {
			    arr.push((func ? func(current, cnt) : current));
			  }

			  return arr;
			};


			// arange(5) -> [0,1,2,3,4]
			// arange(1,5) -> [1,2,3,4]
			// arange(5,1,-1) -> [5,4,3,2]
			jStat.arange = function arange(start, end, step) {
			  var rl = [];
			  var i;
			  step = step || 1;
			  if (end === undefined$1) {
			    end = start;
			    start = 0;
			  }
			  if (start === end || step === 0) {
			    return [];
			  }
			  if (start < end && step < 0) {
			    return [];
			  }
			  if (start > end && step > 0) {
			    return [];
			  }
			  if (step > 0) {
			    for (i = start; i < end; i += step) {
			      rl.push(i);
			    }
			  } else {
			    for (i = start; i > end; i += step) {
			      rl.push(i);
			    }
			  }
			  return rl;
			};


			// A=[[1,2,3],[4,5,6],[7,8,9]]
			// slice(A,{row:{end:2},col:{start:1}}) -> [[2,3],[5,6]]
			// slice(A,1,{start:1}) -> [5,6]
			// as numpy code A[:2,1:]
			jStat.slice = (function(){
			  function _slice(list, start, end, step) {
			    // note it's not equal to range.map mode it's a bug
			    var i;
			    var rl = [];
			    var length = list.length;
			    if (start === undefined$1 && end === undefined$1 && step === undefined$1) {
			      return jStat.copy(list);
			    }

			    start = start || 0;
			    end = end || list.length;
			    start = start >= 0 ? start : length + start;
			    end = end >= 0 ? end : length + end;
			    step = step || 1;
			    if (start === end || step === 0) {
			      return [];
			    }
			    if (start < end && step < 0) {
			      return [];
			    }
			    if (start > end && step > 0) {
			      return [];
			    }
			    if (step > 0) {
			      for (i = start; i < end; i += step) {
			        rl.push(list[i]);
			      }
			    } else {
			      for (i = start; i > end;i += step) {
			        rl.push(list[i]);
			      }
			    }
			    return rl;
			  }

			  function slice(list, rcSlice) {
			    var colSlice, rowSlice;
			    rcSlice = rcSlice || {};
			    if (isNumber(rcSlice.row)) {
			      if (isNumber(rcSlice.col))
			        return list[rcSlice.row][rcSlice.col];
			      var row = jStat.rowa(list, rcSlice.row);
			      colSlice = rcSlice.col || {};
			      return _slice(row, colSlice.start, colSlice.end, colSlice.step);
			    }

			    if (isNumber(rcSlice.col)) {
			      var col = jStat.cola(list, rcSlice.col);
			      rowSlice = rcSlice.row || {};
			      return _slice(col, rowSlice.start, rowSlice.end, rowSlice.step);
			    }

			    rowSlice = rcSlice.row || {};
			    colSlice = rcSlice.col || {};
			    var rows = _slice(list, rowSlice.start, rowSlice.end, rowSlice.step);
			    return rows.map(function(row) {
			      return _slice(row, colSlice.start, colSlice.end, colSlice.step);
			    });
			  }

			  return slice;
			}());


			// A=[[1,2,3],[4,5,6],[7,8,9]]
			// sliceAssign(A,{row:{start:1},col:{start:1}},[[0,0],[0,0]])
			// A=[[1,2,3],[4,0,0],[7,0,0]]
			jStat.sliceAssign = function sliceAssign(A, rcSlice, B) {
			  var nl, ml;
			  if (isNumber(rcSlice.row)) {
			    if (isNumber(rcSlice.col))
			      return A[rcSlice.row][rcSlice.col] = B;
			    rcSlice.col = rcSlice.col || {};
			    rcSlice.col.start = rcSlice.col.start || 0;
			    rcSlice.col.end = rcSlice.col.end || A[0].length;
			    rcSlice.col.step = rcSlice.col.step || 1;
			    nl = jStat.arange(rcSlice.col.start,
			                          Math.min(A.length, rcSlice.col.end),
			                          rcSlice.col.step);
			    var m = rcSlice.row;
			    nl.forEach(function(n, i) {
			      A[m][n] = B[i];
			    });
			    return A;
			  }

			  if (isNumber(rcSlice.col)) {
			    rcSlice.row = rcSlice.row || {};
			    rcSlice.row.start = rcSlice.row.start || 0;
			    rcSlice.row.end = rcSlice.row.end || A.length;
			    rcSlice.row.step = rcSlice.row.step || 1;
			    ml = jStat.arange(rcSlice.row.start,
			                          Math.min(A[0].length, rcSlice.row.end),
			                          rcSlice.row.step);
			    var n = rcSlice.col;
			    ml.forEach(function(m, j) {
			      A[m][n] = B[j];
			    });
			    return A;
			  }

			  if (B[0].length === undefined$1) {
			    B = [B];
			  }
			  rcSlice.row.start = rcSlice.row.start || 0;
			  rcSlice.row.end = rcSlice.row.end || A.length;
			  rcSlice.row.step = rcSlice.row.step || 1;
			  rcSlice.col.start = rcSlice.col.start || 0;
			  rcSlice.col.end = rcSlice.col.end || A[0].length;
			  rcSlice.col.step = rcSlice.col.step || 1;
			  ml = jStat.arange(rcSlice.row.start,
			                        Math.min(A.length, rcSlice.row.end),
			                        rcSlice.row.step);
			  nl = jStat.arange(rcSlice.col.start,
			                        Math.min(A[0].length, rcSlice.col.end),
			                        rcSlice.col.step);
			  ml.forEach(function(m, i) {
			    nl.forEach(function(n, j) {
			      A[m][n] = B[i][j];
			    });
			  });
			  return A;
			};


			// [1,2,3] ->
			// [[1,0,0],[0,2,0],[0,0,3]]
			jStat.diagonal = function diagonal(diagArray) {
			  var mat = jStat.zeros(diagArray.length, diagArray.length);
			  diagArray.forEach(function(t, i) {
			    mat[i][i] = t;
			  });
			  return mat;
			};


			// return copy of A
			jStat.copy = function copy(A) {
			  return A.map(function(row) {
			    if (isNumber(row))
			      return row;
			    return row.map(function(t) {
			      return t;
			    });
			  });
			};


			// TODO: Go over this entire implementation. Seems a tragic waste of resources
			// doing all this work. Instead, and while ugly, use new Function() to generate
			// a custom function for each static method.

			// Quick reference.
			var jProto = jStat.prototype;

			// Default length.
			jProto.length = 0;

			// For internal use only.
			// TODO: Check if they're actually used, and if they are then rename them
			// to _*
			jProto.push = Array.prototype.push;
			jProto.sort = Array.prototype.sort;
			jProto.splice = Array.prototype.splice;
			jProto.slice = Array.prototype.slice;


			// Return a clean array.
			jProto.toArray = function toArray() {
			  return this.length > 1 ? slice.call(this) : slice.call(this)[0];
			};


			// Map a function to a matrix or vector.
			jProto.map = function map(func, toAlter) {
			  return jStat(jStat.map(this, func, toAlter));
			};


			// Cumulatively combine the elements of a matrix or vector using a function.
			jProto.cumreduce = function cumreduce(func, toAlter) {
			  return jStat(jStat.cumreduce(this, func, toAlter));
			};


			// Destructively alter an array.
			jProto.alter = function alter(func) {
			  jStat.alter(this, func);
			  return this;
			};


			// Extend prototype with methods that have no argument.
			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    jProto[passfunc] = function(func) {
			      var self = this,
			      results;
			      // Check for callback.
			      if (func) {
			        setTimeout(function() {
			          func.call(self, jProto[passfunc].call(self));
			        });
			        return this;
			      }
			      results = jStat[passfunc](this);
			      return isArray(results) ? jStat(results) : results;
			    };
			  })(funcs[i]);
			})('transpose clear symmetric rows cols dimensions diag antidiag'.split(' '));


			// Extend prototype with methods that have one argument.
			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    jProto[passfunc] = function(index, func) {
			      var self = this;
			      // check for callback
			      if (func) {
			        setTimeout(function() {
			          func.call(self, jProto[passfunc].call(self, index));
			        });
			        return this;
			      }
			      return jStat(jStat[passfunc](this, index));
			    };
			  })(funcs[i]);
			})('row col'.split(' '));


			// Extend prototype with simple shortcut methods.
			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    jProto[passfunc] = function() {
			      return jStat(jStat[passfunc].apply(null, arguments));
			    };
			  })(funcs[i]);
			})('create zeros ones rand identity'.split(' '));


			// Exposing jStat.
			return jStat;

			}(Math));
			(function(jStat, Math) {

			var isFunction = jStat.utils.isFunction;

			// Ascending functions for sort
			function ascNum(a, b) { return a - b; }

			function clip(arg, min, max) {
			  return Math.max(min, Math.min(arg, max));
			}


			// sum of an array
			jStat.sum = function sum(arr) {
			  var sum = 0;
			  var i = arr.length;
			  while (--i >= 0)
			    sum += arr[i];
			  return sum;
			};


			// sum squared
			jStat.sumsqrd = function sumsqrd(arr) {
			  var sum = 0;
			  var i = arr.length;
			  while (--i >= 0)
			    sum += arr[i] * arr[i];
			  return sum;
			};


			// sum of squared errors of prediction (SSE)
			jStat.sumsqerr = function sumsqerr(arr) {
			  var mean = jStat.mean(arr);
			  var sum = 0;
			  var i = arr.length;
			  var tmp;
			  while (--i >= 0) {
			    tmp = arr[i] - mean;
			    sum += tmp * tmp;
			  }
			  return sum;
			};

			// sum of an array in each row
			jStat.sumrow = function sumrow(arr) {
			  var sum = 0;
			  var i = arr.length;
			  while (--i >= 0)
			    sum += arr[i];
			  return sum;
			};

			// product of an array
			jStat.product = function product(arr) {
			  var prod = 1;
			  var i = arr.length;
			  while (--i >= 0)
			    prod *= arr[i];
			  return prod;
			};


			// minimum value of an array
			jStat.min = function min(arr) {
			  var low = arr[0];
			  var i = 0;
			  while (++i < arr.length)
			    if (arr[i] < low)
			      low = arr[i];
			  return low;
			};


			// maximum value of an array
			jStat.max = function max(arr) {
			  var high = arr[0];
			  var i = 0;
			  while (++i < arr.length)
			    if (arr[i] > high)
			      high = arr[i];
			  return high;
			};


			// unique values of an array
			jStat.unique = function unique(arr) {
			  var hash = {}, _arr = [];
			  for(var i = 0; i < arr.length; i++) {
			    if (!hash[arr[i]]) {
			      hash[arr[i]] = true;
			      _arr.push(arr[i]);
			    }
			  }
			  return _arr;
			};


			// mean value of an array
			jStat.mean = function mean(arr) {
			  return jStat.sum(arr) / arr.length;
			};


			// mean squared error (MSE)
			jStat.meansqerr = function meansqerr(arr) {
			  return jStat.sumsqerr(arr) / arr.length;
			};


			// geometric mean of an array
			jStat.geomean = function geomean(arr) {
			  var logs = arr.map(Math.log);
			  var meanOfLogs = jStat.mean(logs);
			  return Math.exp(meanOfLogs)
			};


			// median of an array
			jStat.median = function median(arr) {
			  var arrlen = arr.length;
			  var _arr = arr.slice().sort(ascNum);
			  // check if array is even or odd, then return the appropriate
			  return !(arrlen & 1)
			    ? (_arr[(arrlen / 2) - 1 ] + _arr[(arrlen / 2)]) / 2
			    : _arr[(arrlen / 2) | 0 ];
			};


			// cumulative sum of an array
			jStat.cumsum = function cumsum(arr) {
			  return jStat.cumreduce(arr, function (a, b) { return a + b; });
			};


			// cumulative product of an array
			jStat.cumprod = function cumprod(arr) {
			  return jStat.cumreduce(arr, function (a, b) { return a * b; });
			};


			// successive differences of a sequence
			jStat.diff = function diff(arr) {
			  var diffs = [];
			  var arrLen = arr.length;
			  var i;
			  for (i = 1; i < arrLen; i++)
			    diffs.push(arr[i] - arr[i - 1]);
			  return diffs;
			};


			// ranks of an array
			jStat.rank = function (arr) {
			  var i;
			  var distinctNumbers = [];
			  var numberCounts = {};
			  for (i = 0; i < arr.length; i++) {
			    var number = arr[i];
			    if (numberCounts[number]) {
			      numberCounts[number]++;
			    } else {
			      numberCounts[number] = 1;
			      distinctNumbers.push(number);
			    }
			  }

			  var sortedDistinctNumbers = distinctNumbers.sort(ascNum);
			  var numberRanks = {};
			  var currentRank = 1;
			  for (i = 0; i < sortedDistinctNumbers.length; i++) {
			    var number = sortedDistinctNumbers[i];
			    var count = numberCounts[number];
			    var first = currentRank;
			    var last = currentRank + count - 1;
			    var rank = (first + last) / 2;
			    numberRanks[number] = rank;
			    currentRank += count;
			  }

			  return arr.map(function (number) {
			    return numberRanks[number];
			  });
			};


			// mode of an array
			// if there are multiple modes of an array, return all of them
			// is this the appropriate way of handling it?
			jStat.mode = function mode(arr) {
			  var arrLen = arr.length;
			  var _arr = arr.slice().sort(ascNum);
			  var count = 1;
			  var maxCount = 0;
			  var numMaxCount = 0;
			  var mode_arr = [];
			  var i;

			  for (i = 0; i < arrLen; i++) {
			    if (_arr[i] === _arr[i + 1]) {
			      count++;
			    } else {
			      if (count > maxCount) {
			        mode_arr = [_arr[i]];
			        maxCount = count;
			        numMaxCount = 0;
			      }
			      // are there multiple max counts
			      else if (count === maxCount) {
			        mode_arr.push(_arr[i]);
			        numMaxCount++;
			      }
			      // resetting count for new value in array
			      count = 1;
			    }
			  }

			  return numMaxCount === 0 ? mode_arr[0] : mode_arr;
			};


			// range of an array
			jStat.range = function range(arr) {
			  return jStat.max(arr) - jStat.min(arr);
			};

			// variance of an array
			// flag = true indicates sample instead of population
			jStat.variance = function variance(arr, flag) {
			  return jStat.sumsqerr(arr) / (arr.length - (flag ? 1 : 0));
			};

			// pooled variance of an array of arrays
			jStat.pooledvariance = function pooledvariance(arr) {
			  var sumsqerr = arr.reduce(function (a, samples) {return a + jStat.sumsqerr(samples);}, 0);
			  var count = arr.reduce(function (a, samples) {return a + samples.length;}, 0);
			  return sumsqerr / (count - arr.length);
			};

			// deviation of an array
			jStat.deviation = function (arr) {
			  var mean = jStat.mean(arr);
			  var arrlen = arr.length;
			  var dev = new Array(arrlen);
			  for (var i = 0; i < arrlen; i++) {
			    dev[i] = arr[i] - mean;
			  }
			  return dev;
			};

			// standard deviation of an array
			// flag = true indicates sample instead of population
			jStat.stdev = function stdev(arr, flag) {
			  return Math.sqrt(jStat.variance(arr, flag));
			};

			// pooled standard deviation of an array of arrays
			jStat.pooledstdev = function pooledstdev(arr) {
			  return Math.sqrt(jStat.pooledvariance(arr));
			};

			// mean deviation (mean absolute deviation) of an array
			jStat.meandev = function meandev(arr) {
			  var mean = jStat.mean(arr);
			  var a = [];
			  for (var i = arr.length - 1; i >= 0; i--) {
			    a.push(Math.abs(arr[i] - mean));
			  }
			  return jStat.mean(a);
			};


			// median deviation (median absolute deviation) of an array
			jStat.meddev = function meddev(arr) {
			  var median = jStat.median(arr);
			  var a = [];
			  for (var i = arr.length - 1; i >= 0; i--) {
			    a.push(Math.abs(arr[i] - median));
			  }
			  return jStat.median(a);
			};


			// coefficient of variation
			jStat.coeffvar = function coeffvar(arr) {
			  return jStat.stdev(arr) / jStat.mean(arr);
			};


			// quartiles of an array
			jStat.quartiles = function quartiles(arr) {
			  var arrlen = arr.length;
			  var _arr = arr.slice().sort(ascNum);
			  return [
			    _arr[ Math.round((arrlen) / 4) - 1 ],
			    _arr[ Math.round((arrlen) / 2) - 1 ],
			    _arr[ Math.round((arrlen) * 3 / 4) - 1 ]
			  ];
			};


			// Arbitary quantiles of an array. Direct port of the scipy.stats
			// implementation by Pierre GF Gerard-Marchant.
			jStat.quantiles = function quantiles(arr, quantilesArray, alphap, betap) {
			  var sortedArray = arr.slice().sort(ascNum);
			  var quantileVals = [quantilesArray.length];
			  var n = arr.length;
			  var i, p, m, aleph, k, gamma;

			  if (typeof alphap === 'undefined')
			    alphap = 3 / 8;
			  if (typeof betap === 'undefined')
			    betap = 3 / 8;

			  for (i = 0; i < quantilesArray.length; i++) {
			    p = quantilesArray[i];
			    m = alphap + p * (1 - alphap - betap);
			    aleph = n * p + m;
			    k = Math.floor(clip(aleph, 1, n - 1));
			    gamma = clip(aleph - k, 0, 1);
			    quantileVals[i] = (1 - gamma) * sortedArray[k - 1] + gamma * sortedArray[k];
			  }

			  return quantileVals;
			};

			// Return the k-th percentile of values in a range, where k is in the range 0..1, inclusive.
			// Passing true for the exclusive parameter excludes both endpoints of the range.
			jStat.percentile = function percentile(arr, k, exclusive) {
			  var _arr = arr.slice().sort(ascNum);
			  var realIndex = k * (_arr.length + (exclusive ? 1 : -1)) + (exclusive ? 0 : 1);
			  var index = parseInt(realIndex);
			  var frac = realIndex - index;
			  if (index + 1 < _arr.length) {
			    return _arr[index - 1] + frac * (_arr[index] - _arr[index - 1]);
			  } else {
			    return _arr[index - 1];
			  }
			};

			// The percentile rank of score in a given array. Returns the percentage
			// of all values in the input array that are less than (kind='strict') or
			// less or equal than (kind='weak') score. Default is weak.
			jStat.percentileOfScore = function percentileOfScore(arr, score, kind) {
			  var counter = 0;
			  var len = arr.length;
			  var strict = false;
			  var value, i;

			  if (kind === 'strict')
			    strict = true;

			  for (i = 0; i < len; i++) {
			    value = arr[i];
			    if ((strict && value < score) ||
			        (!strict && value <= score)) {
			      counter++;
			    }
			  }

			  return counter / len;
			};


			// Histogram (bin count) data
			jStat.histogram = function histogram(arr, binCnt) {
			  binCnt = binCnt || 4;
			  var first = jStat.min(arr);
			  var binWidth = (jStat.max(arr) - first) / binCnt;
			  var len = arr.length;
			  var bins = [];
			  var i;

			  for (i = 0; i < binCnt; i++)
			    bins[i] = 0;
			  for (i = 0; i < len; i++)
			    bins[Math.min(Math.floor(((arr[i] - first) / binWidth)), binCnt - 1)] += 1;

			  return bins;
			};


			// covariance of two arrays
			jStat.covariance = function covariance(arr1, arr2) {
			  var u = jStat.mean(arr1);
			  var v = jStat.mean(arr2);
			  var arr1Len = arr1.length;
			  var sq_dev = new Array(arr1Len);
			  var i;

			  for (i = 0; i < arr1Len; i++)
			    sq_dev[i] = (arr1[i] - u) * (arr2[i] - v);

			  return jStat.sum(sq_dev) / (arr1Len - 1);
			};


			// (pearson's) population correlation coefficient, rho
			jStat.corrcoeff = function corrcoeff(arr1, arr2) {
			  return jStat.covariance(arr1, arr2) /
			      jStat.stdev(arr1, 1) /
			      jStat.stdev(arr2, 1);
			};

			  // (spearman's) rank correlation coefficient, sp
			jStat.spearmancoeff =  function (arr1, arr2) {
			  arr1 = jStat.rank(arr1);
			  arr2 = jStat.rank(arr2);
			  //return pearson's correlation of the ranks:
			  return jStat.corrcoeff(arr1, arr2);
			};


			// statistical standardized moments (general form of skew/kurt)
			jStat.stanMoment = function stanMoment(arr, n) {
			  var mu = jStat.mean(arr);
			  var sigma = jStat.stdev(arr);
			  var len = arr.length;
			  var skewSum = 0;

			  for (var i = 0; i < len; i++)
			    skewSum += Math.pow((arr[i] - mu) / sigma, n);

			  return skewSum / arr.length;
			};

			// (pearson's) moment coefficient of skewness
			jStat.skewness = function skewness(arr) {
			  return jStat.stanMoment(arr, 3);
			};

			// (pearson's) (excess) kurtosis
			jStat.kurtosis = function kurtosis(arr) {
			  return jStat.stanMoment(arr, 4) - 3;
			};


			var jProto = jStat.prototype;


			// Extend jProto with method for calculating cumulative sums and products.
			// This differs from the similar extension below as cumsum and cumprod should
			// not be run again in the case fullbool === true.
			// If a matrix is passed, automatically assume operation should be done on the
			// columns.
			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    // If a matrix is passed, automatically assume operation should be done on
			    // the columns.
			    jProto[passfunc] = function(fullbool, func) {
			      var arr = [];
			      var i = 0;
			      var tmpthis = this;
			      // Assignment reassignation depending on how parameters were passed in.
			      if (isFunction(fullbool)) {
			        func = fullbool;
			        fullbool = false;
			      }
			      // Check if a callback was passed with the function.
			      if (func) {
			        setTimeout(function() {
			          func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
			        });
			        return this;
			      }
			      // Check if matrix and run calculations.
			      if (this.length > 1) {
			        tmpthis = fullbool === true ? this : this.transpose();
			        for (; i < tmpthis.length; i++)
			          arr[i] = jStat[passfunc](tmpthis[i]);
			        return arr;
			      }
			      // Pass fullbool if only vector, not a matrix. for variance and stdev.
			      return jStat[passfunc](this[0], fullbool);
			    };
			  })(funcs[i]);
			})(('cumsum cumprod').split(' '));


			// Extend jProto with methods which don't require arguments and work on columns.
			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    // If a matrix is passed, automatically assume operation should be done on
			    // the columns.
			    jProto[passfunc] = function(fullbool, func) {
			      var arr = [];
			      var i = 0;
			      var tmpthis = this;
			      // Assignment reassignation depending on how parameters were passed in.
			      if (isFunction(fullbool)) {
			        func = fullbool;
			        fullbool = false;
			      }
			      // Check if a callback was passed with the function.
			      if (func) {
			        setTimeout(function() {
			          func.call(tmpthis, jProto[passfunc].call(tmpthis, fullbool));
			        });
			        return this;
			      }
			      // Check if matrix and run calculations.
			      if (this.length > 1) {
			        if (passfunc !== 'sumrow')
			          tmpthis = fullbool === true ? this : this.transpose();
			        for (; i < tmpthis.length; i++)
			          arr[i] = jStat[passfunc](tmpthis[i]);
			        return fullbool === true
			            ? jStat[passfunc](jStat.utils.toVector(arr))
			            : arr;
			      }
			      // Pass fullbool if only vector, not a matrix. for variance and stdev.
			      return jStat[passfunc](this[0], fullbool);
			    };
			  })(funcs[i]);
			})(('sum sumsqrd sumsqerr sumrow product min max unique mean meansqerr ' +
			    'geomean median diff rank mode range variance deviation stdev meandev ' +
			    'meddev coeffvar quartiles histogram skewness kurtosis').split(' '));


			// Extend jProto with functions that take arguments. Operations on matrices are
			// done on columns.
			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    jProto[passfunc] = function() {
			      var arr = [];
			      var i = 0;
			      var tmpthis = this;
			      var args = Array.prototype.slice.call(arguments);
			      var callbackFunction;

			      // If the last argument is a function, we assume it's a callback; we
			      // strip the callback out and call the function again.
			      if (isFunction(args[args.length - 1])) {
			        callbackFunction = args[args.length - 1];
			        var argsToPass = args.slice(0, args.length - 1);

			        setTimeout(function() {
			          callbackFunction.call(tmpthis,
			                                jProto[passfunc].apply(tmpthis, argsToPass));
			        });
			        return this;

			      // Otherwise we curry the function args and call normally.
			      } else {
			        callbackFunction = undefined;
			        var curriedFunction = function curriedFunction(vector) {
			          return jStat[passfunc].apply(tmpthis, [vector].concat(args));
			        };
			      }

			      // If this is a matrix, run column-by-column.
			      if (this.length > 1) {
			        tmpthis = tmpthis.transpose();
			        for (; i < tmpthis.length; i++)
			          arr[i] = curriedFunction(tmpthis[i]);
			        return arr;
			      }

			      // Otherwise run on the vector.
			      return curriedFunction(this[0]);
			    };
			  })(funcs[i]);
			})('quantiles percentileOfScore'.split(' '));

			}(jStat, Math));
			// Special functions //
			(function(jStat, Math) {

			// Log-gamma function
			jStat.gammaln = function gammaln(x) {
			  var j = 0;
			  var cof = [
			    76.18009172947146, -86.50532032941678, 24.01409824083091,
			    -1.231739572450155, 0.1208650973866179e-2, -5395239384953e-18
			  ];
			  var ser = 1.000000000190015;
			  var xx, y, tmp;
			  tmp = (y = xx = x) + 5.5;
			  tmp -= (xx + 0.5) * Math.log(tmp);
			  for (; j < 6; j++)
			    ser += cof[j] / ++y;
			  return Math.log(2.5066282746310005 * ser / xx) - tmp;
			};

			/*
			 * log-gamma function to support poisson distribution sampling. The
			 * algorithm comes from SPECFUN by Shanjie Zhang and Jianming Jin and their
			 * book "Computation of Special Functions", 1996, John Wiley & Sons, Inc.
			 */
			jStat.loggam = function loggam(x) {
			  var x0, x2, xp, gl, gl0;
			  var k, n;

			  var a = [8.333333333333333e-02, -0.002777777777777778,
			          7.936507936507937e-04, -5952380952380952e-19,
			          8.417508417508418e-04, -0.001917526917526918,
			          6.410256410256410e-03, -0.02955065359477124,
			          1.796443723688307e-01, -1.3924322169059];
			  x0 = x;
			  n = 0;
			  if ((x == 1.0) || (x == 2.0)) {
			      return 0.0;
			  }
			  if (x <= 7.0) {
			      n = Math.floor(7 - x);
			      x0 = x + n;
			  }
			  x2 = 1.0 / (x0 * x0);
			  xp = 2 * Math.PI;
			  gl0 = a[9];
			  for (k = 8; k >= 0; k--) {
			      gl0 *= x2;
			      gl0 += a[k];
			  }
			  gl = gl0 / x0 + 0.5 * Math.log(xp) + (x0 - 0.5) * Math.log(x0) - x0;
			  if (x <= 7.0) {
			      for (k = 1; k <= n; k++) {
			          gl -= Math.log(x0 - 1.0);
			          x0 -= 1.0;
			      }
			  }
			  return gl;
			};

			// gamma of x
			jStat.gammafn = function gammafn(x) {
			  var p = [-1.716185138865495, 24.76565080557592, -379.80425647094563,
			           629.3311553128184, 866.9662027904133, -31451.272968848367,
			           -36144.413418691176, 66456.14382024054
			  ];
			  var q = [-30.8402300119739, 315.35062697960416, -1015.1563674902192,
			           -3107.771671572311, 22538.118420980151, 4755.8462775278811,
			           -134659.9598649693, -115132.2596755535];
			  var fact = false;
			  var n = 0;
			  var xden = 0;
			  var xnum = 0;
			  var y = x;
			  var i, z, yi, res;
			  if (x > 171.6243769536076) {
			    return Infinity;
			  }
			  if (y <= 0) {
			    res = y % 1 + 3.6e-16;
			    if (res) {
			      fact = (!(y & 1) ? 1 : -1) * Math.PI / Math.sin(Math.PI * res);
			      y = 1 - y;
			    } else {
			      return Infinity;
			    }
			  }
			  yi = y;
			  if (y < 1) {
			    z = y++;
			  } else {
			    z = (y -= n = (y | 0) - 1) - 1;
			  }
			  for (i = 0; i < 8; ++i) {
			    xnum = (xnum + p[i]) * z;
			    xden = xden * z + q[i];
			  }
			  res = xnum / xden + 1;
			  if (yi < y) {
			    res /= yi;
			  } else if (yi > y) {
			    for (i = 0; i < n; ++i) {
			      res *= y;
			      y++;
			    }
			  }
			  if (fact) {
			    res = fact / res;
			  }
			  return res;
			};


			// lower incomplete gamma function, which is usually typeset with a
			// lower-case greek gamma as the function symbol
			jStat.gammap = function gammap(a, x) {
			  return jStat.lowRegGamma(a, x) * jStat.gammafn(a);
			};


			// The lower regularized incomplete gamma function, usually written P(a,x)
			jStat.lowRegGamma = function lowRegGamma(a, x) {
			  var aln = jStat.gammaln(a);
			  var ap = a;
			  var sum = 1 / a;
			  var del = sum;
			  var b = x + 1 - a;
			  var c = 1 / 1.0e-30;
			  var d = 1 / b;
			  var h = d;
			  var i = 1;
			  // calculate maximum number of itterations required for a
			  var ITMAX = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17);
			  var an;

			  if (x < 0 || a <= 0) {
			    return NaN;
			  } else if (x < a + 1) {
			    for (; i <= ITMAX; i++) {
			      sum += del *= x / ++ap;
			    }
			    return (sum * Math.exp(-x + a * Math.log(x) - (aln)));
			  }

			  for (; i <= ITMAX; i++) {
			    an = -i * (i - a);
			    b += 2;
			    d = an * d + b;
			    c = b + an / c;
			    d = 1 / d;
			    h *= d * c;
			  }

			  return (1 - h * Math.exp(-x + a * Math.log(x) - (aln)));
			};

			// natural log factorial of n
			jStat.factorialln = function factorialln(n) {
			  return n < 0 ? NaN : jStat.gammaln(n + 1);
			};

			// factorial of n
			jStat.factorial = function factorial(n) {
			  return n < 0 ? NaN : jStat.gammafn(n + 1);
			};

			// combinations of n, m
			jStat.combination = function combination(n, m) {
			  // make sure n or m don't exceed the upper limit of usable values
			  return (n > 170 || m > 170)
			      ? Math.exp(jStat.combinationln(n, m))
			      : (jStat.factorial(n) / jStat.factorial(m)) / jStat.factorial(n - m);
			};


			jStat.combinationln = function combinationln(n, m){
			  return jStat.factorialln(n) - jStat.factorialln(m) - jStat.factorialln(n - m);
			};


			// permutations of n, m
			jStat.permutation = function permutation(n, m) {
			  return jStat.factorial(n) / jStat.factorial(n - m);
			};


			// beta function
			jStat.betafn = function betafn(x, y) {
			  // ensure arguments are positive
			  if (x <= 0 || y <= 0)
			    return undefined;
			  // make sure x + y doesn't exceed the upper limit of usable values
			  return (x + y > 170)
			      ? Math.exp(jStat.betaln(x, y))
			      : jStat.gammafn(x) * jStat.gammafn(y) / jStat.gammafn(x + y);
			};


			// natural logarithm of beta function
			jStat.betaln = function betaln(x, y) {
			  return jStat.gammaln(x) + jStat.gammaln(y) - jStat.gammaln(x + y);
			};


			// Evaluates the continued fraction for incomplete beta function by modified
			// Lentz's method.
			jStat.betacf = function betacf(x, a, b) {
			  var fpmin = 1e-30;
			  var m = 1;
			  var qab = a + b;
			  var qap = a + 1;
			  var qam = a - 1;
			  var c = 1;
			  var d = 1 - qab * x / qap;
			  var m2, aa, del, h;

			  // These q's will be used in factors that occur in the coefficients
			  if (Math.abs(d) < fpmin)
			    d = fpmin;
			  d = 1 / d;
			  h = d;

			  for (; m <= 100; m++) {
			    m2 = 2 * m;
			    aa = m * (b - m) * x / ((qam + m2) * (a + m2));
			    // One step (the even one) of the recurrence
			    d = 1 + aa * d;
			    if (Math.abs(d) < fpmin)
			      d = fpmin;
			    c = 1 + aa / c;
			    if (Math.abs(c) < fpmin)
			      c = fpmin;
			    d = 1 / d;
			    h *= d * c;
			    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
			    // Next step of the recurrence (the odd one)
			    d = 1 + aa * d;
			    if (Math.abs(d) < fpmin)
			      d = fpmin;
			    c = 1 + aa / c;
			    if (Math.abs(c) < fpmin)
			      c = fpmin;
			    d = 1 / d;
			    del = d * c;
			    h *= del;
			    if (Math.abs(del - 1.0) < 3e-7)
			      break;
			  }

			  return h;
			};


			// Returns the inverse of the lower regularized inomplete gamma function
			jStat.gammapinv = function gammapinv(p, a) {
			  var j = 0;
			  var a1 = a - 1;
			  var EPS = 1e-8;
			  var gln = jStat.gammaln(a);
			  var x, err, t, u, pp, lna1, afac;

			  if (p >= 1)
			    return Math.max(100, a + 100 * Math.sqrt(a));
			  if (p <= 0)
			    return 0;
			  if (a > 1) {
			    lna1 = Math.log(a1);
			    afac = Math.exp(a1 * (lna1 - 1) - gln);
			    pp = (p < 0.5) ? p : 1 - p;
			    t = Math.sqrt(-2 * Math.log(pp));
			    x = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t;
			    if (p < 0.5)
			      x = -x;
			    x = Math.max(1e-3,
			                 a * Math.pow(1 - 1 / (9 * a) - x / (3 * Math.sqrt(a)), 3));
			  } else {
			    t = 1 - a * (0.253 + a * 0.12);
			    if (p < t)
			      x = Math.pow(p / t, 1 / a);
			    else
			      x = 1 - Math.log(1 - (p - t) / (1 - t));
			  }

			  for(; j < 12; j++) {
			    if (x <= 0)
			      return 0;
			    err = jStat.lowRegGamma(a, x) - p;
			    if (a > 1)
			      t = afac * Math.exp(-(x - a1) + a1 * (Math.log(x) - lna1));
			    else
			      t = Math.exp(-x + a1 * Math.log(x) - gln);
			    u = err / t;
			    x -= (t = u / (1 - 0.5 * Math.min(1, u * ((a - 1) / x - 1))));
			    if (x <= 0)
			      x = 0.5 * (x + t);
			    if (Math.abs(t) < EPS * x)
			      break;
			  }

			  return x;
			};


			// Returns the error function erf(x)
			jStat.erf = function erf(x) {
			  var cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
			             -0.00956151478680863, -946595344482036e-18, 3.66839497852761e-4,
			             4.2523324806907e-5, -20278578112534e-18, -1624290004647e-18,
			             1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
			             6.529054439e-9, 5.059343495e-9, -991364156e-18,
			             -227365122e-18, 9.6467911e-11, 2.394038e-12,
			             -6886027e-18, 8.94487e-13, 3.13092e-13,
			             -112708e-18, 3.81e-16, 7.106e-15,
			             -1523e-18, -94e-18, 1.21e-16,
			             -28e-18];
			  var j = cof.length - 1;
			  var isneg = false;
			  var d = 0;
			  var dd = 0;
			  var t, ty, tmp, res;

			  if (x < 0) {
			    x = -x;
			    isneg = true;
			  }

			  t = 2 / (2 + x);
			  ty = 4 * t - 2;

			  for(; j > 0; j--) {
			    tmp = d;
			    d = ty * d - dd + cof[j];
			    dd = tmp;
			  }

			  res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
			  return isneg ? res - 1 : 1 - res;
			};


			// Returns the complmentary error function erfc(x)
			jStat.erfc = function erfc(x) {
			  return 1 - jStat.erf(x);
			};


			// Returns the inverse of the complementary error function
			jStat.erfcinv = function erfcinv(p) {
			  var j = 0;
			  var x, err, t, pp;
			  if (p >= 2)
			    return -100;
			  if (p <= 0)
			    return 100;
			  pp = (p < 1) ? p : 2 - p;
			  t = Math.sqrt(-2 * Math.log(pp / 2));
			  x = -0.70711 * ((2.30753 + t * 0.27061) /
			                  (1 + t * (0.99229 + t * 0.04481)) - t);
			  for (; j < 2; j++) {
			    err = jStat.erfc(x) - pp;
			    x += err / (1.12837916709551257 * Math.exp(-x * x) - x * err);
			  }
			  return (p < 1) ? x : -x;
			};


			// Returns the inverse of the incomplete beta function
			jStat.ibetainv = function ibetainv(p, a, b) {
			  var EPS = 1e-8;
			  var a1 = a - 1;
			  var b1 = b - 1;
			  var j = 0;
			  var lna, lnb, pp, t, u, err, x, al, h, w, afac;
			  if (p <= 0)
			    return 0;
			  if (p >= 1)
			    return 1;
			  if (a >= 1 && b >= 1) {
			    pp = (p < 0.5) ? p : 1 - p;
			    t = Math.sqrt(-2 * Math.log(pp));
			    x = (2.30753 + t * 0.27061) / (1 + t* (0.99229 + t * 0.04481)) - t;
			    if (p < 0.5)
			      x = -x;
			    al = (x * x - 3) / 6;
			    h = 2 / (1 / (2 * a - 1)  + 1 / (2 * b - 1));
			    w = (x * Math.sqrt(al + h) / h) - (1 / (2 * b - 1) - 1 / (2 * a - 1)) *
			        (al + 5 / 6 - 2 / (3 * h));
			    x = a / (a + b * Math.exp(2 * w));
			  } else {
			    lna = Math.log(a / (a + b));
			    lnb = Math.log(b / (a + b));
			    t = Math.exp(a * lna) / a;
			    u = Math.exp(b * lnb) / b;
			    w = t + u;
			    if (p < t / w)
			      x = Math.pow(a * w * p, 1 / a);
			    else
			      x = 1 - Math.pow(b * w * (1 - p), 1 / b);
			  }
			  afac = -jStat.gammaln(a) - jStat.gammaln(b) + jStat.gammaln(a + b);
			  for(; j < 10; j++) {
			    if (x === 0 || x === 1)
			      return x;
			    err = jStat.ibeta(x, a, b) - p;
			    t = Math.exp(a1 * Math.log(x) + b1 * Math.log(1 - x) + afac);
			    u = err / t;
			    x -= (t = u / (1 - 0.5 * Math.min(1, u * (a1 / x - b1 / (1 - x)))));
			    if (x <= 0)
			      x = 0.5 * (x + t);
			    if (x >= 1)
			      x = 0.5 * (x + t + 1);
			    if (Math.abs(t) < EPS * x && j > 0)
			      break;
			  }
			  return x;
			};


			// Returns the incomplete beta function I_x(a,b)
			jStat.ibeta = function ibeta(x, a, b) {
			  // Factors in front of the continued fraction.
			  var bt = (x === 0 || x === 1) ?  0 :
			    Math.exp(jStat.gammaln(a + b) - jStat.gammaln(a) -
			             jStat.gammaln(b) + a * Math.log(x) + b *
			             Math.log(1 - x));
			  if (x < 0 || x > 1)
			    return false;
			  if (x < (a + 1) / (a + b + 2))
			    // Use continued fraction directly.
			    return bt * jStat.betacf(x, a, b) / a;
			  // else use continued fraction after making the symmetry transformation.
			  return 1 - bt * jStat.betacf(1 - x, b, a) / b;
			};


			// Returns a normal deviate (mu=0, sigma=1).
			// If n and m are specified it returns a object of normal deviates.
			jStat.randn = function randn(n, m) {
			  var u, v, x, y, q;
			  if (!m)
			    m = n;
			  if (n)
			    return jStat.create(n, m, function() { return jStat.randn(); });
			  do {
			    u = jStat._random_fn();
			    v = 1.7156 * (jStat._random_fn() - 0.5);
			    x = u - 0.449871;
			    y = Math.abs(v) + 0.386595;
			    q = x * x + y * (0.19600 * y - 0.25472 * x);
			  } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
			  return v / u;
			};


			// Returns a gamma deviate by the method of Marsaglia and Tsang.
			jStat.randg = function randg(shape, n, m) {
			  var oalph = shape;
			  var a1, a2, u, v, x, mat;
			  if (!m)
			    m = n;
			  if (!shape)
			    shape = 1;
			  if (n) {
			    mat = jStat.zeros(n,m);
			    mat.alter(function() { return jStat.randg(shape); });
			    return mat;
			  }
			  if (shape < 1)
			    shape += 1;
			  a1 = shape - 1 / 3;
			  a2 = 1 / Math.sqrt(9 * a1);
			  do {
			    do {
			      x = jStat.randn();
			      v = 1 + a2 * x;
			    } while(v <= 0);
			    v = v * v * v;
			    u = jStat._random_fn();
			  } while(u > 1 - 0.331 * Math.pow(x, 4) &&
			          Math.log(u) > 0.5 * x*x + a1 * (1 - v + Math.log(v)));
			  // alpha > 1
			  if (shape == oalph)
			    return a1 * v;
			  // alpha < 1
			  do {
			    u = jStat._random_fn();
			  } while(u === 0);
			  return Math.pow(u, 1 / oalph) * a1 * v;
			};


			// making use of static methods on the instance
			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    jStat.fn[passfunc] = function() {
			      return jStat(
			          jStat.map(this, function(value) { return jStat[passfunc](value); }));
			    };
			  })(funcs[i]);
			})('gammaln gammafn factorial factorialln'.split(' '));


			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    jStat.fn[passfunc] = function() {
			      return jStat(jStat[passfunc].apply(null, arguments));
			    };
			  })(funcs[i]);
			})('randn'.split(' '));

			}(jStat, Math));
			(function(jStat, Math) {

			// generate all distribution instance methods
			(function(list) {
			  for (var i = 0; i < list.length; i++) (function(func) {
			    // distribution instance method
			    jStat[func] = function f(a, b, c) {
			      if (!(this instanceof f))
			        return new f(a, b, c);
			      this._a = a;
			      this._b = b;
			      this._c = c;
			      return this;
			    };
			    // distribution method to be used on a jStat instance
			    jStat.fn[func] = function(a, b, c) {
			      var newthis = jStat[func](a, b, c);
			      newthis.data = this;
			      return newthis;
			    };
			    // sample instance method
			    jStat[func].prototype.sample = function(arr) {
			      var a = this._a;
			      var b = this._b;
			      var c = this._c;
			      if (arr)
			        return jStat.alter(arr, function() {
			          return jStat[func].sample(a, b, c);
			        });
			      else
			        return jStat[func].sample(a, b, c);
			    };
			    // generate the pdf, cdf and inv instance methods
			    (function(vals) {
			      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
			        jStat[func].prototype[fnfunc] = function(x) {
			          var a = this._a;
			          var b = this._b;
			          var c = this._c;
			          if (!x && x !== 0)
			            x = this.data;
			          if (typeof x !== 'number') {
			            return jStat.fn.map.call(x, function(x) {
			              return jStat[func][fnfunc](x, a, b, c);
			            });
			          }
			          return jStat[func][fnfunc](x, a, b, c);
			        };
			      })(vals[i]);
			    })('pdf cdf inv'.split(' '));
			    // generate the mean, median, mode and variance instance methods
			    (function(vals) {
			      for (var i = 0; i < vals.length; i++) (function(fnfunc) {
			        jStat[func].prototype[fnfunc] = function() {
			          return jStat[func][fnfunc](this._a, this._b, this._c);
			        };
			      })(vals[i]);
			    })('mean median mode variance'.split(' '));
			  })(list[i]);
			})((
			  'beta centralF cauchy chisquare exponential gamma invgamma kumaraswamy ' +
			  'laplace lognormal noncentralt normal pareto studentt weibull uniform ' +
			  'binomial negbin hypgeom poisson triangular tukey arcsine'
			).split(' '));



			// extend beta function with static methods
			jStat.extend(jStat.beta, {
			  pdf: function pdf(x, alpha, beta) {
			    // PDF is zero outside the support
			    if (x > 1 || x < 0)
			      return 0;
			    // PDF is one for the uniform case
			    if (alpha == 1 && beta == 1)
			      return 1;

			    if (alpha < 512 && beta < 512) {
			      return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) /
			          jStat.betafn(alpha, beta);
			    } else {
			      return Math.exp((alpha - 1) * Math.log(x) +
			                      (beta - 1) * Math.log(1 - x) -
			                      jStat.betaln(alpha, beta));
			    }
			  },

			  cdf: function cdf(x, alpha, beta) {
			    return (x > 1 || x < 0) ? (x > 1) * 1 : jStat.ibeta(x, alpha, beta);
			  },

			  inv: function inv(x, alpha, beta) {
			    return jStat.ibetainv(x, alpha, beta);
			  },

			  mean: function mean(alpha, beta) {
			    return alpha / (alpha + beta);
			  },

			  median: function median(alpha, beta) {
			    return jStat.ibetainv(0.5, alpha, beta);
			  },

			  mode: function mode(alpha, beta) {
			    return (alpha - 1 ) / ( alpha + beta - 2);
			  },

			  // return a random sample
			  sample: function sample(alpha, beta) {
			    var u = jStat.randg(alpha);
			    return u / (u + jStat.randg(beta));
			  },

			  variance: function variance(alpha, beta) {
			    return (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
			  }
			});

			// extend F function with static methods
			jStat.extend(jStat.centralF, {
			  // This implementation of the pdf function avoids float overflow
			  // See the way that R calculates this value:
			  // https://svn.r-project.org/R/trunk/src/nmath/df.c
			  pdf: function pdf(x, df1, df2) {
			    var p, q, f;

			    if (x < 0)
			      return 0;

			    if (df1 <= 2) {
			      if (x === 0 && df1 < 2) {
			        return Infinity;
			      }
			      if (x === 0 && df1 === 2) {
			        return 1;
			      }
			      return (1 / jStat.betafn(df1 / 2, df2 / 2)) *
			              Math.pow(df1 / df2, df1 / 2) *
			              Math.pow(x, (df1/2) - 1) *
			              Math.pow((1 + (df1 / df2) * x), -(df1 + df2) / 2);
			    }

			    p = (df1 * x) / (df2 + x * df1);
			    q = df2 / (df2 + x * df1);
			    f = df1 * q / 2.0;
			    return f * jStat.binomial.pdf((df1 - 2) / 2, (df1 + df2 - 2) / 2, p);
			  },

			  cdf: function cdf(x, df1, df2) {
			    if (x < 0)
			      return 0;
			    return jStat.ibeta((df1 * x) / (df1 * x + df2), df1 / 2, df2 / 2);
			  },

			  inv: function inv(x, df1, df2) {
			    return df2 / (df1 * (1 / jStat.ibetainv(x, df1 / 2, df2 / 2) - 1));
			  },

			  mean: function mean(df1, df2) {
			    return (df2 > 2) ? df2 / (df2 - 2) : undefined;
			  },

			  mode: function mode(df1, df2) {
			    return (df1 > 2) ? (df2 * (df1 - 2)) / (df1 * (df2 + 2)) : undefined;
			  },

			  // return a random sample
			  sample: function sample(df1, df2) {
			    var x1 = jStat.randg(df1 / 2) * 2;
			    var x2 = jStat.randg(df2 / 2) * 2;
			    return (x1 / df1) / (x2 / df2);
			  },

			  variance: function variance(df1, df2) {
			    if (df2 <= 4)
			      return undefined;
			    return 2 * df2 * df2 * (df1 + df2 - 2) /
			        (df1 * (df2 - 2) * (df2 - 2) * (df2 - 4));
			  }
			});


			// extend cauchy function with static methods
			jStat.extend(jStat.cauchy, {
			  pdf: function pdf(x, local, scale) {
			    if (scale < 0) { return 0; }

			    return (scale / (Math.pow(x - local, 2) + Math.pow(scale, 2))) / Math.PI;
			  },

			  cdf: function cdf(x, local, scale) {
			    return Math.atan((x - local) / scale) / Math.PI + 0.5;
			  },

			  inv: function(p, local, scale) {
			    return local + scale * Math.tan(Math.PI * (p - 0.5));
			  },

			  median: function median(local/*, scale*/) {
			    return local;
			  },

			  mode: function mode(local/*, scale*/) {
			    return local;
			  },

			  sample: function sample(local, scale) {
			    return jStat.randn() *
			        Math.sqrt(1 / (2 * jStat.randg(0.5))) * scale + local;
			  }
			});



			// extend chisquare function with static methods
			jStat.extend(jStat.chisquare, {
			  pdf: function pdf(x, dof) {
			    if (x < 0)
			      return 0;
			    return (x === 0 && dof === 2) ? 0.5 :
			        Math.exp((dof / 2 - 1) * Math.log(x) - x / 2 - (dof / 2) *
			                 Math.log(2) - jStat.gammaln(dof / 2));
			  },

			  cdf: function cdf(x, dof) {
			    if (x < 0)
			      return 0;
			    return jStat.lowRegGamma(dof / 2, x / 2);
			  },

			  inv: function(p, dof) {
			    return 2 * jStat.gammapinv(p, 0.5 * dof);
			  },

			  mean : function(dof) {
			    return dof;
			  },

			  // TODO: this is an approximation (is there a better way?)
			  median: function median(dof) {
			    return dof * Math.pow(1 - (2 / (9 * dof)), 3);
			  },

			  mode: function mode(dof) {
			    return (dof - 2 > 0) ? dof - 2 : 0;
			  },

			  sample: function sample(dof) {
			    return jStat.randg(dof / 2) * 2;
			  },

			  variance: function variance(dof) {
			    return 2 * dof;
			  }
			});



			// extend exponential function with static methods
			jStat.extend(jStat.exponential, {
			  pdf: function pdf(x, rate) {
			    return x < 0 ? 0 : rate * Math.exp(-rate * x);
			  },

			  cdf: function cdf(x, rate) {
			    return x < 0 ? 0 : 1 - Math.exp(-rate * x);
			  },

			  inv: function(p, rate) {
			    return -Math.log(1 - p) / rate;
			  },

			  mean : function(rate) {
			    return 1 / rate;
			  },

			  median: function (rate) {
			    return (1 / rate) * Math.log(2);
			  },

			  mode: function mode(/*rate*/) {
			    return 0;
			  },

			  sample: function sample(rate) {
			    return -1 / rate * Math.log(jStat._random_fn());
			  },

			  variance : function(rate) {
			    return Math.pow(rate, -2);
			  }
			});



			// extend gamma function with static methods
			jStat.extend(jStat.gamma, {
			  pdf: function pdf(x, shape, scale) {
			    if (x < 0)
			      return 0;
			    return (x === 0 && shape === 1) ? 1 / scale :
			            Math.exp((shape - 1) * Math.log(x) - x / scale -
			                    jStat.gammaln(shape) - shape * Math.log(scale));
			  },

			  cdf: function cdf(x, shape, scale) {
			    if (x < 0)
			      return 0;
			    return jStat.lowRegGamma(shape, x / scale);
			  },

			  inv: function(p, shape, scale) {
			    return jStat.gammapinv(p, shape) * scale;
			  },

			  mean : function(shape, scale) {
			    return shape * scale;
			  },

			  mode: function mode(shape, scale) {
			    if(shape > 1) return (shape - 1) * scale;
			    return undefined;
			  },

			  sample: function sample(shape, scale) {
			    return jStat.randg(shape) * scale;
			  },

			  variance: function variance(shape, scale) {
			    return shape * scale * scale;
			  }
			});

			// extend inverse gamma function with static methods
			jStat.extend(jStat.invgamma, {
			  pdf: function pdf(x, shape, scale) {
			    if (x <= 0)
			      return 0;
			    return Math.exp(-(shape + 1) * Math.log(x) - scale / x -
			                    jStat.gammaln(shape) + shape * Math.log(scale));
			  },

			  cdf: function cdf(x, shape, scale) {
			    if (x <= 0)
			      return 0;
			    return 1 - jStat.lowRegGamma(shape, scale / x);
			  },

			  inv: function(p, shape, scale) {
			    return scale / jStat.gammapinv(1 - p, shape);
			  },

			  mean : function(shape, scale) {
			    return (shape > 1) ? scale / (shape - 1) : undefined;
			  },

			  mode: function mode(shape, scale) {
			    return scale / (shape + 1);
			  },

			  sample: function sample(shape, scale) {
			    return scale / jStat.randg(shape);
			  },

			  variance: function variance(shape, scale) {
			    if (shape <= 2)
			      return undefined;
			    return scale * scale / ((shape - 1) * (shape - 1) * (shape - 2));
			  }
			});


			// extend kumaraswamy function with static methods
			jStat.extend(jStat.kumaraswamy, {
			  pdf: function pdf(x, alpha, beta) {
			    if (x === 0 && alpha === 1)
			      return beta;
			    else if (x === 1 && beta === 1)
			      return alpha;
			    return Math.exp(Math.log(alpha) + Math.log(beta) + (alpha - 1) *
			                    Math.log(x) + (beta - 1) *
			                    Math.log(1 - Math.pow(x, alpha)));
			  },

			  cdf: function cdf(x, alpha, beta) {
			    if (x < 0)
			      return 0;
			    else if (x > 1)
			      return 1;
			    return (1 - Math.pow(1 - Math.pow(x, alpha), beta));
			  },

			  inv: function inv(p, alpha, beta) {
			    return Math.pow(1 - Math.pow(1 - p, 1 / beta), 1 / alpha);
			  },

			  mean : function(alpha, beta) {
			    return (beta * jStat.gammafn(1 + 1 / alpha) *
			            jStat.gammafn(beta)) / (jStat.gammafn(1 + 1 / alpha + beta));
			  },

			  median: function median(alpha, beta) {
			    return Math.pow(1 - Math.pow(2, -1 / beta), 1 / alpha);
			  },

			  mode: function mode(alpha, beta) {
			    if (!(alpha >= 1 && beta >= 1 && (alpha !== 1 && beta !== 1)))
			      return undefined;
			    return Math.pow((alpha - 1) / (alpha * beta - 1), 1 / alpha);
			  },

			  variance: function variance(/*alpha, beta*/) {
			    throw new Error('variance not yet implemented');
			    // TODO: complete this
			  }
			});



			// extend lognormal function with static methods
			jStat.extend(jStat.lognormal, {
			  pdf: function pdf(x, mu, sigma) {
			    if (x <= 0)
			      return 0;
			    return Math.exp(-Math.log(x) - 0.5 * Math.log(2 * Math.PI) -
			                    Math.log(sigma) - Math.pow(Math.log(x) - mu, 2) /
			                    (2 * sigma * sigma));
			  },

			  cdf: function cdf(x, mu, sigma) {
			    if (x < 0)
			      return 0;
			    return 0.5 +
			        (0.5 * jStat.erf((Math.log(x) - mu) / Math.sqrt(2 * sigma * sigma)));
			  },

			  inv: function(p, mu, sigma) {
			    return Math.exp(-1.4142135623730951 * sigma * jStat.erfcinv(2 * p) + mu);
			  },

			  mean: function mean(mu, sigma) {
			    return Math.exp(mu + sigma * sigma / 2);
			  },

			  median: function median(mu/*, sigma*/) {
			    return Math.exp(mu);
			  },

			  mode: function mode(mu, sigma) {
			    return Math.exp(mu - sigma * sigma);
			  },

			  sample: function sample(mu, sigma) {
			    return Math.exp(jStat.randn() * sigma + mu);
			  },

			  variance: function variance(mu, sigma) {
			    return (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
			  }
			});



			// extend noncentralt function with static methods
			jStat.extend(jStat.noncentralt, {
			  pdf: function pdf(x, dof, ncp) {
			    var tol = 1e-14;
			    if (Math.abs(ncp) < tol)  // ncp approx 0; use student-t
			      return jStat.studentt.pdf(x, dof)

			    if (Math.abs(x) < tol) {  // different formula for x == 0
			      return Math.exp(jStat.gammaln((dof + 1) / 2) - ncp * ncp / 2 -
			                      0.5 * Math.log(Math.PI * dof) - jStat.gammaln(dof / 2));
			    }

			    // formula for x != 0
			    return dof / x *
			        (jStat.noncentralt.cdf(x * Math.sqrt(1 + 2 / dof), dof+2, ncp) -
			         jStat.noncentralt.cdf(x, dof, ncp));
			  },

			  cdf: function cdf(x, dof, ncp) {
			    var tol = 1e-14;
			    var min_iterations = 200;

			    if (Math.abs(ncp) < tol)  // ncp approx 0; use student-t
			      return jStat.studentt.cdf(x, dof);

			    // turn negative x into positive and flip result afterwards
			    var flip = false;
			    if (x < 0) {
			      flip = true;
			      ncp = -ncp;
			    }

			    var prob = jStat.normal.cdf(-ncp, 0, 1);
			    var value = tol + 1;
			    // use value at last two steps to determine convergence
			    var lastvalue = value;
			    var y = x * x / (x * x + dof);
			    var j = 0;
			    var p = Math.exp(-ncp * ncp / 2);
			    var q = Math.exp(-ncp * ncp / 2 - 0.5 * Math.log(2) -
			                     jStat.gammaln(3 / 2)) * ncp;
			    while (j < min_iterations || lastvalue > tol || value > tol) {
			      lastvalue = value;
			      if (j > 0) {
			        p *= (ncp * ncp) / (2 * j);
			        q *= (ncp * ncp) / (2 * (j + 1 / 2));
			      }
			      value = p * jStat.beta.cdf(y, j + 0.5, dof / 2) +
			          q * jStat.beta.cdf(y, j+1, dof/2);
			      prob += 0.5 * value;
			      j++;
			    }

			    return flip ? (1 - prob) : prob;
			  }
			});


			// extend normal function with static methods
			jStat.extend(jStat.normal, {
			  pdf: function pdf(x, mean, std) {
			    return Math.exp(-0.5 * Math.log(2 * Math.PI) -
			                    Math.log(std) - Math.pow(x - mean, 2) / (2 * std * std));
			  },

			  cdf: function cdf(x, mean, std) {
			    return 0.5 * (1 + jStat.erf((x - mean) / Math.sqrt(2 * std * std)));
			  },

			  inv: function(p, mean, std) {
			    return -1.4142135623730951 * std * jStat.erfcinv(2 * p) + mean;
			  },

			  mean : function(mean/*, std*/) {
			    return mean;
			  },

			  median: function median(mean/*, std*/) {
			    return mean;
			  },

			  mode: function (mean/*, std*/) {
			    return mean;
			  },

			  sample: function sample(mean, std) {
			    return jStat.randn() * std + mean;
			  },

			  variance : function(mean, std) {
			    return std * std;
			  }
			});



			// extend pareto function with static methods
			jStat.extend(jStat.pareto, {
			  pdf: function pdf(x, scale, shape) {
			    if (x < scale)
			      return 0;
			    return (shape * Math.pow(scale, shape)) / Math.pow(x, shape + 1);
			  },

			  cdf: function cdf(x, scale, shape) {
			    if (x < scale)
			      return 0;
			    return 1 - Math.pow(scale / x, shape);
			  },

			  inv: function inv(p, scale, shape) {
			    return scale / Math.pow(1 - p, 1 / shape);
			  },

			  mean: function mean(scale, shape) {
			    if (shape <= 1)
			      return undefined;
			    return (shape * Math.pow(scale, shape)) / (shape - 1);
			  },

			  median: function median(scale, shape) {
			    return scale * (shape * Math.SQRT2);
			  },

			  mode: function mode(scale/*, shape*/) {
			    return scale;
			  },

			  variance : function(scale, shape) {
			    if (shape <= 2)
			      return undefined;
			    return (scale*scale * shape) / (Math.pow(shape - 1, 2) * (shape - 2));
			  }
			});



			// extend studentt function with static methods
			jStat.extend(jStat.studentt, {
			  pdf: function pdf(x, dof) {
			    dof = dof > 1e100 ? 1e100 : dof;
			    return (1/(Math.sqrt(dof) * jStat.betafn(0.5, dof/2))) *
			        Math.pow(1 + ((x * x) / dof), -((dof + 1) / 2));
			  },

			  cdf: function cdf(x, dof) {
			    var dof2 = dof / 2;
			    return jStat.ibeta((x + Math.sqrt(x * x + dof)) /
			                       (2 * Math.sqrt(x * x + dof)), dof2, dof2);
			  },

			  inv: function(p, dof) {
			    var x = jStat.ibetainv(2 * Math.min(p, 1 - p), 0.5 * dof, 0.5);
			    x = Math.sqrt(dof * (1 - x) / x);
			    return (p > 0.5) ? x : -x;
			  },

			  mean: function mean(dof) {
			    return (dof > 1) ? 0 : undefined;
			  },

			  median: function median(/*dof*/) {
			    return 0;
			  },

			  mode: function mode(/*dof*/) {
			    return 0;
			  },

			  sample: function sample(dof) {
			    return jStat.randn() * Math.sqrt(dof / (2 * jStat.randg(dof / 2)));
			  },

			  variance: function variance(dof) {
			    return (dof  > 2) ? dof / (dof - 2) : (dof > 1) ? Infinity : undefined;
			  }
			});



			// extend weibull function with static methods
			jStat.extend(jStat.weibull, {
			  pdf: function pdf(x, scale, shape) {
			    if (x < 0 || scale < 0 || shape < 0)
			      return 0;
			    return (shape / scale) * Math.pow((x / scale), (shape - 1)) *
			        Math.exp(-(Math.pow((x / scale), shape)));
			  },

			  cdf: function cdf(x, scale, shape) {
			    return x < 0 ? 0 : 1 - Math.exp(-Math.pow((x / scale), shape));
			  },

			  inv: function(p, scale, shape) {
			    return scale * Math.pow(-Math.log(1 - p), 1 / shape);
			  },

			  mean : function(scale, shape) {
			    return scale * jStat.gammafn(1 + 1 / shape);
			  },

			  median: function median(scale, shape) {
			    return scale * Math.pow(Math.log(2), 1 / shape);
			  },

			  mode: function mode(scale, shape) {
			    if (shape <= 1)
			      return 0;
			    return scale * Math.pow((shape - 1) / shape, 1 / shape);
			  },

			  sample: function sample(scale, shape) {
			    return scale * Math.pow(-Math.log(jStat._random_fn()), 1 / shape);
			  },

			  variance: function variance(scale, shape) {
			    return scale * scale * jStat.gammafn(1 + 2 / shape) -
			        Math.pow(jStat.weibull.mean(scale, shape), 2);
			  }
			});



			// extend uniform function with static methods
			jStat.extend(jStat.uniform, {
			  pdf: function pdf(x, a, b) {
			    return (x < a || x > b) ? 0 : 1 / (b - a);
			  },

			  cdf: function cdf(x, a, b) {
			    if (x < a)
			      return 0;
			    else if (x < b)
			      return (x - a) / (b - a);
			    return 1;
			  },

			  inv: function(p, a, b) {
			    return a + (p * (b - a));
			  },

			  mean: function mean(a, b) {
			    return 0.5 * (a + b);
			  },

			  median: function median(a, b) {
			    return jStat.mean(a, b);
			  },

			  mode: function mode(/*a, b*/) {
			    throw new Error('mode is not yet implemented');
			  },

			  sample: function sample(a, b) {
			    return (a / 2 + b / 2) + (b / 2 - a / 2) * (2 * jStat._random_fn() - 1);
			  },

			  variance: function variance(a, b) {
			    return Math.pow(b - a, 2) / 12;
			  }
			});


			// Got this from http://www.math.ucla.edu/~tom/distributions/binomial.html
			function betinc(x, a, b, eps) {
			  var a0 = 0;
			  var b0 = 1;
			  var a1 = 1;
			  var b1 = 1;
			  var m9 = 0;
			  var a2 = 0;
			  var c9;

			  while (Math.abs((a1 - a2) / a1) > eps) {
			    a2 = a1;
			    c9 = -(a + m9) * (a + b + m9) * x / (a + 2 * m9) / (a + 2 * m9 + 1);
			    a0 = a1 + c9 * a0;
			    b0 = b1 + c9 * b0;
			    m9 = m9 + 1;
			    c9 = m9 * (b - m9) * x / (a + 2 * m9 - 1) / (a + 2 * m9);
			    a1 = a0 + c9 * a1;
			    b1 = b0 + c9 * b1;
			    a0 = a0 / b1;
			    b0 = b0 / b1;
			    a1 = a1 / b1;
			    b1 = 1;
			  }

			  return a1 / a;
			}


			// extend uniform function with static methods
			jStat.extend(jStat.binomial, {
			  pdf: function pdf(k, n, p) {
			    return (p === 0 || p === 1) ?
			      ((n * p) === k ? 1 : 0) :
			      jStat.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
			  },

			  cdf: function cdf(x, n, p) {
			    var betacdf;
			    var eps = 1e-10;

			    if (x < 0)
			      return 0;
			    if (x >= n)
			      return 1;
			    if (p < 0 || p > 1 || n <= 0)
			      return NaN;

			    x = Math.floor(x);
			    var z = p;
			    var a = x + 1;
			    var b = n - x;
			    var s = a + b;
			    var bt = Math.exp(jStat.gammaln(s) - jStat.gammaln(b) -
			                      jStat.gammaln(a) + a * Math.log(z) + b * Math.log(1 - z));

			    if (z < (a + 1) / (s + 2))
			      betacdf = bt * betinc(z, a, b, eps);
			    else
			      betacdf = 1 - bt * betinc(1 - z, b, a, eps);

			    return Math.round((1 - betacdf) * (1 / eps)) / (1 / eps);
			  }
			});



			// extend uniform function with static methods
			jStat.extend(jStat.negbin, {
			  pdf: function pdf(k, r, p) {
			    if (k !== k >>> 0)
			      return false;
			    if (k < 0)
			      return 0;
			    return jStat.combination(k + r - 1, r - 1) *
			        Math.pow(1 - p, k) * Math.pow(p, r);
			  },

			  cdf: function cdf(x, r, p) {
			    var sum = 0,
			    k = 0;
			    if (x < 0) return 0;
			    for (; k <= x; k++) {
			      sum += jStat.negbin.pdf(k, r, p);
			    }
			    return sum;
			  }
			});



			// extend uniform function with static methods
			jStat.extend(jStat.hypgeom, {
			  pdf: function pdf(k, N, m, n) {
			    // Hypergeometric PDF.

			    // A simplification of the CDF algorithm below.

			    // k = number of successes drawn
			    // N = population size
			    // m = number of successes in population
			    // n = number of items drawn from population

			    if(k !== k | 0) {
			      return false;
			    } else if(k < 0 || k < m - (N - n)) {
			      // It's impossible to have this few successes drawn.
			      return 0;
			    } else if(k > n || k > m) {
			      // It's impossible to have this many successes drawn.
			      return 0;
			    } else if (m * 2 > N) {
			      // More than half the population is successes.

			      if(n * 2 > N) {
			        // More than half the population is sampled.

			        return jStat.hypgeom.pdf(N - m - n + k, N, N - m, N - n)
			      } else {
			        // Half or less of the population is sampled.

			        return jStat.hypgeom.pdf(n - k, N, N - m, n);
			      }

			    } else if(n * 2 > N) {
			      // Half or less is successes.

			      return jStat.hypgeom.pdf(m - k, N, m, N - n);

			    } else if(m < n) {
			      // We want to have the number of things sampled to be less than the
			      // successes available. So swap the definitions of successful and sampled.
			      return jStat.hypgeom.pdf(k, N, n, m);
			    } else {
			      // If we get here, half or less of the population was sampled, half or
			      // less of it was successes, and we had fewer sampled things than
			      // successes. Now we can do this complicated iterative algorithm in an
			      // efficient way.

			      // The basic premise of the algorithm is that we partially normalize our
			      // intermediate product to keep it in a numerically good region, and then
			      // finish the normalization at the end.

			      // This variable holds the scaled probability of the current number of
			      // successes.
			      var scaledPDF = 1;

			      // This keeps track of how much we have normalized.
			      var samplesDone = 0;

			      for(var i = 0; i < k; i++) {
			        // For every possible number of successes up to that observed...

			        while(scaledPDF > 1 && samplesDone < n) {
			          // Intermediate result is growing too big. Apply some of the
			          // normalization to shrink everything.

			          scaledPDF *= 1 - (m / (N - samplesDone));

			          // Say we've normalized by this sample already.
			          samplesDone++;
			        }

			        // Work out the partially-normalized hypergeometric PDF for the next
			        // number of successes
			        scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));
			      }

			      for(; samplesDone < n; samplesDone++) {
			        // Apply all the rest of the normalization
			        scaledPDF *= 1 - (m / (N - samplesDone));
			      }

			      // Bound answer sanely before returning.
			      return Math.min(1, Math.max(0, scaledPDF));
			    }
			  },

			  cdf: function cdf(x, N, m, n) {
			    // Hypergeometric CDF.

			    // This algorithm is due to Prof. Thomas S. Ferguson, <tom@math.ucla.edu>,
			    // and comes from his hypergeometric test calculator at
			    // <http://www.math.ucla.edu/~tom/distributions/Hypergeometric.html>.

			    // x = number of successes drawn
			    // N = population size
			    // m = number of successes in population
			    // n = number of items drawn from population

			    if(x < 0 || x < m - (N - n)) {
			      // It's impossible to have this few successes drawn or fewer.
			      return 0;
			    } else if(x >= n || x >= m) {
			      // We will always have this many successes or fewer.
			      return 1;
			    } else if (m * 2 > N) {
			      // More than half the population is successes.

			      if(n * 2 > N) {
			        // More than half the population is sampled.

			        return jStat.hypgeom.cdf(N - m - n + x, N, N - m, N - n)
			      } else {
			        // Half or less of the population is sampled.

			        return 1 - jStat.hypgeom.cdf(n - x - 1, N, N - m, n);
			      }

			    } else if(n * 2 > N) {
			      // Half or less is successes.

			      return 1 - jStat.hypgeom.cdf(m - x - 1, N, m, N - n);

			    } else if(m < n) {
			      // We want to have the number of things sampled to be less than the
			      // successes available. So swap the definitions of successful and sampled.
			      return jStat.hypgeom.cdf(x, N, n, m);
			    } else {
			      // If we get here, half or less of the population was sampled, half or
			      // less of it was successes, and we had fewer sampled things than
			      // successes. Now we can do this complicated iterative algorithm in an
			      // efficient way.

			      // The basic premise of the algorithm is that we partially normalize our
			      // intermediate sum to keep it in a numerically good region, and then
			      // finish the normalization at the end.

			      // Holds the intermediate, scaled total CDF.
			      var scaledCDF = 1;

			      // This variable holds the scaled probability of the current number of
			      // successes.
			      var scaledPDF = 1;

			      // This keeps track of how much we have normalized.
			      var samplesDone = 0;

			      for(var i = 0; i < x; i++) {
			        // For every possible number of successes up to that observed...

			        while(scaledCDF > 1 && samplesDone < n) {
			          // Intermediate result is growing too big. Apply some of the
			          // normalization to shrink everything.

			          var factor = 1 - (m / (N - samplesDone));

			          scaledPDF *= factor;
			          scaledCDF *= factor;

			          // Say we've normalized by this sample already.
			          samplesDone++;
			        }

			        // Work out the partially-normalized hypergeometric PDF for the next
			        // number of successes
			        scaledPDF *= (n - i) * (m - i) / ((i + 1) * (N - m - n + i + 1));

			        // Add to the CDF answer.
			        scaledCDF += scaledPDF;
			      }

			      for(; samplesDone < n; samplesDone++) {
			        // Apply all the rest of the normalization
			        scaledCDF *= 1 - (m / (N - samplesDone));
			      }

			      // Bound answer sanely before returning.
			      return Math.min(1, Math.max(0, scaledCDF));
			    }
			  }
			});



			// extend uniform function with static methods
			jStat.extend(jStat.poisson, {
			  pdf: function pdf(k, l) {
			    if (l < 0 || (k % 1) !== 0 || k < 0) {
			      return 0;
			    }

			    return Math.pow(l, k) * Math.exp(-l) / jStat.factorial(k);
			  },

			  cdf: function cdf(x, l) {
			    var sumarr = [],
			    k = 0;
			    if (x < 0) return 0;
			    for (; k <= x; k++) {
			      sumarr.push(jStat.poisson.pdf(k, l));
			    }
			    return jStat.sum(sumarr);
			  },

			  mean : function(l) {
			    return l;
			  },

			  variance : function(l) {
			    return l;
			  },

			  sampleSmall: function sampleSmall(l) {
			    var p = 1, k = 0, L = Math.exp(-l);
			    do {
			      k++;
			      p *= jStat._random_fn();
			    } while (p > L);
			    return k - 1;
			  },

			  sampleLarge: function sampleLarge(l) {
			    var lam = l;
			    var k;
			    var U, V, slam, loglam, a, b, invalpha, vr, us;

			    slam = Math.sqrt(lam);
			    loglam = Math.log(lam);
			    b = 0.931 + 2.53 * slam;
			    a = -0.059 + 0.02483 * b;
			    invalpha = 1.1239 + 1.1328 / (b - 3.4);
			    vr = 0.9277 - 3.6224 / (b - 2);

			    while (1) {
			      U = Math.random() - 0.5;
			      V = Math.random();
			      us = 0.5 - Math.abs(U);
			      k = Math.floor((2 * a / us + b) * U + lam + 0.43);
			      if ((us >= 0.07) && (V <= vr)) {
			          return k;
			      }
			      if ((k < 0) || ((us < 0.013) && (V > us))) {
			          continue;
			      }
			      /* log(V) == log(0.0) ok here */
			      /* if U==0.0 so that us==0.0, log is ok since always returns */
			      if ((Math.log(V) + Math.log(invalpha) - Math.log(a / (us * us) + b)) <= (-lam + k * loglam - jStat.loggam(k + 1))) {
			          return k;
			      }
			    }
			  },

			  sample: function sample(l) {
			    if (l < 10)
			      return this.sampleSmall(l);
			    else
			      return this.sampleLarge(l);
			  }
			});

			// extend triangular function with static methods
			jStat.extend(jStat.triangular, {
			  pdf: function pdf(x, a, b, c) {
			    if (b <= a || c < a || c > b) {
			      return NaN;
			    } else {
			      if (x < a || x > b) {
			        return 0;
			      } else if (x < c) {
			          return (2 * (x - a)) / ((b - a) * (c - a));
			      } else if (x === c) {
			          return (2 / (b - a));
			      } else { // x > c
			          return (2 * (b - x)) / ((b - a) * (b - c));
			      }
			    }
			  },

			  cdf: function cdf(x, a, b, c) {
			    if (b <= a || c < a || c > b)
			      return NaN;
			    if (x <= a)
			      return 0;
			    else if (x >= b)
			      return 1;
			    if (x <= c)
			      return Math.pow(x - a, 2) / ((b - a) * (c - a));
			    else // x > c
			      return 1 - Math.pow(b - x, 2) / ((b - a) * (b - c));
			  },

			  inv: function inv(p, a, b, c) {
			    if (b <= a || c < a || c > b) {
			      return NaN;
			    } else {
			      if (p <= ((c - a) / (b - a))) {
			        return a + (b - a) * Math.sqrt(p * ((c - a) / (b - a)));
			      } else { // p > ((c - a) / (b - a))
			        return a + (b - a) * (1 - Math.sqrt((1 - p) * (1 - ((c - a) / (b - a)))));
			      }
			    }
			  },

			  mean: function mean(a, b, c) {
			    return (a + b + c) / 3;
			  },

			  median: function median(a, b, c) {
			    if (c <= (a + b) / 2) {
			      return b - Math.sqrt((b - a) * (b - c)) / Math.sqrt(2);
			    } else if (c > (a + b) / 2) {
			      return a + Math.sqrt((b - a) * (c - a)) / Math.sqrt(2);
			    }
			  },

			  mode: function mode(a, b, c) {
			    return c;
			  },

			  sample: function sample(a, b, c) {
			    var u = jStat._random_fn();
			    if (u < ((c - a) / (b - a)))
			      return a + Math.sqrt(u * (b - a) * (c - a))
			    return b - Math.sqrt((1 - u) * (b - a) * (b - c));
			  },

			  variance: function variance(a, b, c) {
			    return (a * a + b * b + c * c - a * b - a * c - b * c) / 18;
			  }
			});


			// extend arcsine function with static methods
			jStat.extend(jStat.arcsine, {
			  pdf: function pdf(x, a, b) {
			    if (b <= a) return NaN;

			    return (x <= a || x >= b) ? 0 :
			      (2 / Math.PI) *
			        Math.pow(Math.pow(b - a, 2) -
			                  Math.pow(2 * x - a - b, 2), -0.5);
			  },

			  cdf: function cdf(x, a, b) {
			    if (x < a)
			      return 0;
			    else if (x < b)
			      return (2 / Math.PI) * Math.asin(Math.sqrt((x - a)/(b - a)));
			    return 1;
			  },

			  inv: function(p, a, b) {
			    return a + (0.5 - 0.5 * Math.cos(Math.PI * p)) * (b - a);
			  },

			  mean: function mean(a, b) {
			    if (b <= a) return NaN;
			    return (a + b) / 2;
			  },

			  median: function median(a, b) {
			    if (b <= a) return NaN;
			    return (a + b) / 2;
			  },

			  mode: function mode(/*a, b*/) {
			    throw new Error('mode is not yet implemented');
			  },

			  sample: function sample(a, b) {
			    return ((a + b) / 2) + ((b - a) / 2) *
			      Math.sin(2 * Math.PI * jStat.uniform.sample(0, 1));
			  },

			  variance: function variance(a, b) {
			    if (b <= a) return NaN;
			    return Math.pow(b - a, 2) / 8;
			  }
			});


			function laplaceSign(x) { return x / Math.abs(x); }

			jStat.extend(jStat.laplace, {
			  pdf: function pdf(x, mu, b) {
			    return (b <= 0) ? 0 : (Math.exp(-Math.abs(x - mu) / b)) / (2 * b);
			  },

			  cdf: function cdf(x, mu, b) {
			    if (b <= 0) { return 0; }

			    if(x < mu) {
			      return 0.5 * Math.exp((x - mu) / b);
			    } else {
			      return 1 - 0.5 * Math.exp(- (x - mu) / b);
			    }
			  },

			  mean: function(mu/*, b*/) {
			    return mu;
			  },

			  median: function(mu/*, b*/) {
			    return mu;
			  },

			  mode: function(mu/*, b*/) {
			    return mu;
			  },

			  variance: function(mu, b) {
			    return 2 * b * b;
			  },

			  sample: function sample(mu, b) {
			    var u = jStat._random_fn() - 0.5;

			    return mu - (b * laplaceSign(u) * Math.log(1 - (2 * Math.abs(u))));
			  }
			});

			function tukeyWprob(w, rr, cc) {
			  var nleg = 12;
			  var ihalf = 6;

			  var C1 = -30;
			  var C2 = -50;
			  var C3 = 60;
			  var bb   = 8;
			  var wlar = 3;
			  var wincr1 = 2;
			  var wincr2 = 3;
			  var xleg = [
			    0.981560634246719250690549090149,
			    0.904117256370474856678465866119,
			    0.769902674194304687036893833213,
			    0.587317954286617447296702418941,
			    0.367831498998180193752691536644,
			    0.125233408511468915472441369464
			  ];
			  var aleg = [
			    0.047175336386511827194615961485,
			    0.106939325995318430960254718194,
			    0.160078328543346226334652529543,
			    0.203167426723065921749064455810,
			    0.233492536538354808760849898925,
			    0.249147045813402785000562436043
			  ];

			  var qsqz = w * 0.5;

			  // if w >= 16 then the integral lower bound (occurs for c=20)
			  // is 0.99999999999995 so return a value of 1.

			  if (qsqz >= bb)
			    return 1.0;

			  // find (f(w/2) - 1) ^ cc
			  // (first term in integral of hartley's form).

			  var pr_w = 2 * jStat.normal.cdf(qsqz, 0, 1, 1, 0) - 1; // erf(qsqz / M_SQRT2)
			  // if pr_w ^ cc < 2e-22 then set pr_w = 0
			  if (pr_w >= Math.exp(C2 / cc))
			    pr_w = Math.pow(pr_w, cc);
			  else
			    pr_w = 0.0;

			  // if w is large then the second component of the
			  // integral is small, so fewer intervals are needed.

			  var wincr;
			  if (w > wlar)
			    wincr = wincr1;
			  else
			    wincr = wincr2;

			  // find the integral of second term of hartley's form
			  // for the integral of the range for equal-length
			  // intervals using legendre quadrature.  limits of
			  // integration are from (w/2, 8).  two or three
			  // equal-length intervals are used.

			  // blb and bub are lower and upper limits of integration.

			  var blb = qsqz;
			  var binc = (bb - qsqz) / wincr;
			  var bub = blb + binc;
			  var einsum = 0.0;

			  // integrate over each interval

			  var cc1 = cc - 1.0;
			  for (var wi = 1; wi <= wincr; wi++) {
			    var elsum = 0.0;
			    var a = 0.5 * (bub + blb);

			    // legendre quadrature with order = nleg

			    var b = 0.5 * (bub - blb);

			    for (var jj = 1; jj <= nleg; jj++) {
			      var j, xx;
			      if (ihalf < jj) {
			        j = (nleg - jj) + 1;
			        xx = xleg[j-1];
			      } else {
			        j = jj;
			        xx = -xleg[j-1];
			      }
			      var c = b * xx;
			      var ac = a + c;

			      // if exp(-qexpo/2) < 9e-14,
			      // then doesn't contribute to integral

			      var qexpo = ac * ac;
			      if (qexpo > C3)
			        break;

			      var pplus = 2 * jStat.normal.cdf(ac, 0, 1, 1, 0);
			      var pminus= 2 * jStat.normal.cdf(ac, w, 1, 1, 0);

			      // if rinsum ^ (cc-1) < 9e-14,
			      // then doesn't contribute to integral

			      var rinsum = (pplus * 0.5) - (pminus * 0.5);
			      if (rinsum >= Math.exp(C1 / cc1)) {
			        rinsum = (aleg[j-1] * Math.exp(-(0.5 * qexpo))) * Math.pow(rinsum, cc1);
			        elsum += rinsum;
			      }
			    }
			    elsum *= (((2.0 * b) * cc) / Math.sqrt(2 * Math.PI));
			    einsum += elsum;
			    blb = bub;
			    bub += binc;
			  }

			  // if pr_w ^ rr < 9e-14, then return 0
			  pr_w += einsum;
			  if (pr_w <= Math.exp(C1 / rr))
			    return 0;

			  pr_w = Math.pow(pr_w, rr);
			  if (pr_w >= 1) // 1 was iMax was eps
			    return 1;
			  return pr_w;
			}

			function tukeyQinv(p, c, v) {
			  var p0 = 0.322232421088;
			  var q0 = 0.993484626060e-01;
			  var p1 = -1;
			  var q1 = 0.588581570495;
			  var p2 = -0.342242088547;
			  var q2 = 0.531103462366;
			  var p3 = -0.204231210125;
			  var q3 = 0.103537752850;
			  var p4 = -453642210148e-16;
			  var q4 = 0.38560700634e-02;
			  var c1 = 0.8832;
			  var c2 = 0.2368;
			  var c4 = 1.208;
			  var c5 = 1.4142;
			  var vmax = 120.0;

			  var ps = 0.5 - 0.5 * p;
			  var yi = Math.sqrt(Math.log(1.0 / (ps * ps)));
			  var t = yi + (((( yi * p4 + p3) * yi + p2) * yi + p1) * yi + p0)
			     / (((( yi * q4 + q3) * yi + q2) * yi + q1) * yi + q0);
			  if (v < vmax) t += (t * t * t + t) / v / 4.0;
			  var q = c1 - c2 * t;
			  if (v < vmax) q += -1.214 / v + c4 * t / v;
			  return t * (q * Math.log(c - 1.0) + c5);
			}

			jStat.extend(jStat.tukey, {
			  cdf: function cdf(q, nmeans, df) {
			    // Identical implementation as the R ptukey() function as of commit 68947
			    var rr = 1;
			    var cc = nmeans;

			    var nlegq = 16;
			    var ihalfq = 8;

			    var eps1 = -30;
			    var eps2 = 1.0e-14;
			    var dhaf  = 100.0;
			    var dquar = 800.0;
			    var deigh = 5000.0;
			    var dlarg = 25000.0;
			    var ulen1 = 1.0;
			    var ulen2 = 0.5;
			    var ulen3 = 0.25;
			    var ulen4 = 0.125;
			    var xlegq = [
			      0.989400934991649932596154173450,
			      0.944575023073232576077988415535,
			      0.865631202387831743880467897712,
			      0.755404408355003033895101194847,
			      0.617876244402643748446671764049,
			      0.458016777657227386342419442984,
			      0.281603550779258913230460501460,
			      0.950125098376374401853193354250e-1
			    ];
			    var alegq = [
			      0.271524594117540948517805724560e-1,
			      0.622535239386478928628438369944e-1,
			      0.951585116824927848099251076022e-1,
			      0.124628971255533872052476282192,
			      0.149595988816576732081501730547,
			      0.169156519395002538189312079030,
			      0.182603415044923588866763667969,
			      0.189450610455068496285396723208
			    ];

			    if (q <= 0)
			      return 0;

			    // df must be > 1
			    // there must be at least two values

			    if (df < 2 || rr < 1 || cc < 2) return NaN;

			    if (!Number.isFinite(q))
			      return 1;

			    if (df > dlarg)
			      return tukeyWprob(q, rr, cc);

			    // calculate leading constant

			    var f2 = df * 0.5;
			    var f2lf = ((f2 * Math.log(df)) - (df * Math.log(2))) - jStat.gammaln(f2);
			    var f21 = f2 - 1.0;

			    // integral is divided into unit, half-unit, quarter-unit, or
			    // eighth-unit length intervals depending on the value of the
			    // degrees of freedom.

			    var ff4 = df * 0.25;
			    var ulen;
			    if      (df <= dhaf)  ulen = ulen1;
			    else if (df <= dquar) ulen = ulen2;
			    else if (df <= deigh) ulen = ulen3;
			    else                  ulen = ulen4;

			    f2lf += Math.log(ulen);

			    // integrate over each subinterval

			    var ans = 0.0;

			    for (var i = 1; i <= 50; i++) {
			      var otsum = 0.0;

			      // legendre quadrature with order = nlegq
			      // nodes (stored in xlegq) are symmetric around zero.

			      var twa1 = (2 * i - 1) * ulen;

			      for (var jj = 1; jj <= nlegq; jj++) {
			        var j, t1;
			        if (ihalfq < jj) {
			          j = jj - ihalfq - 1;
			          t1 = (f2lf + (f21 * Math.log(twa1 + (xlegq[j] * ulen))))
			              - (((xlegq[j] * ulen) + twa1) * ff4);
			        } else {
			          j = jj - 1;
			          t1 = (f2lf + (f21 * Math.log(twa1 - (xlegq[j] * ulen))))
			              + (((xlegq[j] * ulen) - twa1) * ff4);
			        }

			        // if exp(t1) < 9e-14, then doesn't contribute to integral
			        var qsqz;
			        if (t1 >= eps1) {
			          if (ihalfq < jj) {
			            qsqz = q * Math.sqrt(((xlegq[j] * ulen) + twa1) * 0.5);
			          } else {
			            qsqz = q * Math.sqrt(((-(xlegq[j] * ulen)) + twa1) * 0.5);
			          }

			          // call wprob to find integral of range portion

			          var wprb = tukeyWprob(qsqz, rr, cc);
			          var rotsum = (wprb * alegq[j]) * Math.exp(t1);
			          otsum += rotsum;
			        }
			        // end legendre integral for interval i
			        // L200:
			      }

			      // if integral for interval i < 1e-14, then stop.
			      // However, in order to avoid small area under left tail,
			      // at least  1 / ulen  intervals are calculated.
			      if (i * ulen >= 1.0 && otsum <= eps2)
			        break;

			      // end of interval i
			      // L330:

			      ans += otsum;
			    }

			    if (otsum > eps2) { // not converged
			      throw new Error('tukey.cdf failed to converge');
			    }
			    if (ans > 1)
			      ans = 1;
			    return ans;
			  },

			  inv: function(p, nmeans, df) {
			    // Identical implementation as the R qtukey() function as of commit 68947
			    var rr = 1;
			    var cc = nmeans;

			    var eps = 0.0001;
			    var maxiter = 50;

			    // df must be > 1 ; there must be at least two values
			    if (df < 2 || rr < 1 || cc < 2) return NaN;

			    if (p < 0 || p > 1) return NaN;
			    if (p === 0) return 0;
			    if (p === 1) return Infinity;

			    // Initial value

			    var x0 = tukeyQinv(p, cc, df);

			    // Find prob(value < x0)

			    var valx0 = jStat.tukey.cdf(x0, nmeans, df) - p;

			    // Find the second iterate and prob(value < x1).
			    // If the first iterate has probability value
			    // exceeding p then second iterate is 1 less than
			    // first iterate; otherwise it is 1 greater.

			    var x1;
			    if (valx0 > 0.0)
			      x1 = Math.max(0.0, x0 - 1.0);
			    else
			      x1 = x0 + 1.0;
			    var valx1 = jStat.tukey.cdf(x1, nmeans, df) - p;

			    // Find new iterate

			    var ans;
			    for(var iter = 1; iter < maxiter; iter++) {
			      ans = x1 - ((valx1 * (x1 - x0)) / (valx1 - valx0));
			      valx0 = valx1;

			      // New iterate must be >= 0

			      x0 = x1;
			      if (ans < 0.0) {
			        ans = 0.0;
			        valx1 = -p;
			      }
			      // Find prob(value < new iterate)

			      valx1 = jStat.tukey.cdf(ans, nmeans, df) - p;
			      x1 = ans;

			      // If the difference between two successive
			      // iterates is less than eps, stop

			      var xabs = Math.abs(x1 - x0);
			      if (xabs < eps)
			        return ans;
			    }

			    throw new Error('tukey.inv failed to converge');
			  }
			});

			}(jStat, Math));
			/* Provides functions for the solution of linear system of equations, integration, extrapolation,
			 * interpolation, eigenvalue problems, differential equations and PCA analysis. */

			(function(jStat, Math) {

			var push = Array.prototype.push;
			var isArray = jStat.utils.isArray;

			function isUsable(arg) {
			  return isArray(arg) || arg instanceof jStat;
			}

			jStat.extend({

			  // add a vector/matrix to a vector/matrix or scalar
			  add: function add(arr, arg) {
			    // check if arg is a vector or scalar
			    if (isUsable(arg)) {
			      if (!isUsable(arg[0])) arg = [ arg ];
			      return jStat.map(arr, function(value, row, col) {
			        return value + arg[row][col];
			      });
			    }
			    return jStat.map(arr, function(value) { return value + arg; });
			  },

			  // subtract a vector or scalar from the vector
			  subtract: function subtract(arr, arg) {
			    // check if arg is a vector or scalar
			    if (isUsable(arg)) {
			      if (!isUsable(arg[0])) arg = [ arg ];
			      return jStat.map(arr, function(value, row, col) {
			        return value - arg[row][col] || 0;
			      });
			    }
			    return jStat.map(arr, function(value) { return value - arg; });
			  },

			  // matrix division
			  divide: function divide(arr, arg) {
			    if (isUsable(arg)) {
			      if (!isUsable(arg[0])) arg = [ arg ];
			      return jStat.multiply(arr, jStat.inv(arg));
			    }
			    return jStat.map(arr, function(value) { return value / arg; });
			  },

			  // matrix multiplication
			  multiply: function multiply(arr, arg) {
			    var row, col, nrescols, sum, nrow, ncol, res, rescols;
			    // eg: arr = 2 arg = 3 -> 6 for res[0][0] statement closure
			    if (arr.length === undefined && arg.length === undefined) {
			      return arr * arg;
			    }
			    nrow = arr.length,
			    ncol = arr[0].length,
			    res = jStat.zeros(nrow, nrescols = (isUsable(arg)) ? arg[0].length : ncol),
			    rescols = 0;
			    if (isUsable(arg)) {
			      for (; rescols < nrescols; rescols++) {
			        for (row = 0; row < nrow; row++) {
			          sum = 0;
			          for (col = 0; col < ncol; col++)
			          sum += arr[row][col] * arg[col][rescols];
			          res[row][rescols] = sum;
			        }
			      }
			      return (nrow === 1 && rescols === 1) ? res[0][0] : res;
			    }
			    return jStat.map(arr, function(value) { return value * arg; });
			  },

			  // outer([1,2,3],[4,5,6])
			  // ===
			  // [[1],[2],[3]] times [[4,5,6]]
			  // ->
			  // [[4,5,6],[8,10,12],[12,15,18]]
			  outer:function outer(A, B) {
			    return jStat.multiply(A.map(function(t){ return [t] }), [B]);
			  },


			  // Returns the dot product of two matricies
			  dot: function dot(arr, arg) {
			    if (!isUsable(arr[0])) arr = [ arr ];
			    if (!isUsable(arg[0])) arg = [ arg ];
			    // convert column to row vector
			    var left = (arr[0].length === 1 && arr.length !== 1) ? jStat.transpose(arr) : arr,
			    right = (arg[0].length === 1 && arg.length !== 1) ? jStat.transpose(arg) : arg,
			    res = [],
			    row = 0,
			    nrow = left.length,
			    ncol = left[0].length,
			    sum, col;
			    for (; row < nrow; row++) {
			      res[row] = [];
			      sum = 0;
			      for (col = 0; col < ncol; col++)
			      sum += left[row][col] * right[row][col];
			      res[row] = sum;
			    }
			    return (res.length === 1) ? res[0] : res;
			  },

			  // raise every element by a scalar
			  pow: function pow(arr, arg) {
			    return jStat.map(arr, function(value) { return Math.pow(value, arg); });
			  },

			  // exponentiate every element
			  exp: function exp(arr) {
			    return jStat.map(arr, function(value) { return Math.exp(value); });
			  },

			  // generate the natural log of every element
			  log: function exp(arr) {
			    return jStat.map(arr, function(value) { return Math.log(value); });
			  },

			  // generate the absolute values of the vector
			  abs: function abs(arr) {
			    return jStat.map(arr, function(value) { return Math.abs(value); });
			  },

			  // computes the p-norm of the vector
			  // In the case that a matrix is passed, uses the first row as the vector
			  norm: function norm(arr, p) {
			    var nnorm = 0,
			    i = 0;
			    // check the p-value of the norm, and set for most common case
			    if (isNaN(p)) p = 2;
			    // check if multi-dimensional array, and make vector correction
			    if (isUsable(arr[0])) arr = arr[0];
			    // vector norm
			    for (; i < arr.length; i++) {
			      nnorm += Math.pow(Math.abs(arr[i]), p);
			    }
			    return Math.pow(nnorm, 1 / p);
			  },

			  // computes the angle between two vectors in rads
			  // In case a matrix is passed, this uses the first row as the vector
			  angle: function angle(arr, arg) {
			    return Math.acos(jStat.dot(arr, arg) / (jStat.norm(arr) * jStat.norm(arg)));
			  },

			  // augment one matrix by another
			  // Note: this function returns a matrix, not a jStat object
			  aug: function aug(a, b) {
			    var newarr = [];
			    var i;
			    for (i = 0; i < a.length; i++) {
			      newarr.push(a[i].slice());
			    }
			    for (i = 0; i < newarr.length; i++) {
			      push.apply(newarr[i], b[i]);
			    }
			    return newarr;
			  },

			  // The inv() function calculates the inverse of a matrix
			  // Create the inverse by augmenting the matrix by the identity matrix of the
			  // appropriate size, and then use G-J elimination on the augmented matrix.
			  inv: function inv(a) {
			    var rows = a.length;
			    var cols = a[0].length;
			    var b = jStat.identity(rows, cols);
			    var c = jStat.gauss_jordan(a, b);
			    var result = [];
			    var i = 0;
			    var j;

			    //We need to copy the inverse portion to a new matrix to rid G-J artifacts
			    for (; i < rows; i++) {
			      result[i] = [];
			      for (j = cols; j < c[0].length; j++)
			        result[i][j - cols] = c[i][j];
			    }
			    return result;
			  },

			  // calculate the determinant of a matrix
			  det: function det(a) {
			    if (a.length === 2) {
			      return a[0][0] * a[1][1] - a[0][1] * a[1][0];
			    }

			    var determinant = 0;
			    for (var i = 0; i < a.length; i++) {
			      // build a sub matrix without column `i`
			      var submatrix = [];
			      for (var row = 1; row < a.length; row++) {
			        submatrix[row - 1] = [];
			        for (var col = 0; col < a.length; col++) {
			          if (col < i) {
			            submatrix[row - 1][col] = a[row][col];
			          } else if (col > i) {
			            submatrix[row - 1][col - 1] = a[row][col];
			          }
			        }
			      }

			      // alternate between + and - between determinants
			      var sign = i % 2 ? -1 : 1;
			      determinant += det(submatrix) * a[0][i] * sign;
			    }

			    return determinant
			  },

			  gauss_elimination: function gauss_elimination(a, b) {
			    var i = 0,
			    j = 0,
			    n = a.length,
			    m = a[0].length,
			    factor = 1,
			    sum = 0,
			    x = [],
			    maug, pivot, temp, k;
			    a = jStat.aug(a, b);
			    maug = a[0].length;
			    for(i = 0; i < n; i++) {
			      pivot = a[i][i];
			      j = i;
			      for (k = i + 1; k < m; k++) {
			        if (pivot < Math.abs(a[k][i])) {
			          pivot = a[k][i];
			          j = k;
			        }
			      }
			      if (j != i) {
			        for(k = 0; k < maug; k++) {
			          temp = a[i][k];
			          a[i][k] = a[j][k];
			          a[j][k] = temp;
			        }
			      }
			      for (j = i + 1; j < n; j++) {
			        factor = a[j][i] / a[i][i];
			        for(k = i; k < maug; k++) {
			          a[j][k] = a[j][k] - factor * a[i][k];
			        }
			      }
			    }
			    for (i = n - 1; i >= 0; i--) {
			      sum = 0;
			      for (j = i + 1; j<= n - 1; j++) {
			        sum = sum + x[j] * a[i][j];
			      }
			      x[i] =(a[i][maug - 1] - sum) / a[i][i];
			    }
			    return x;
			  },

			  gauss_jordan: function gauss_jordan(a, b) {
			    var m = jStat.aug(a, b);
			    var h = m.length;
			    var w = m[0].length;
			    var c = 0;
			    var x, y, y2;
			    // find max pivot
			    for (y = 0; y < h; y++) {
			      var maxrow = y;
			      for (y2 = y+1; y2 < h; y2++) {
			        if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y]))
			          maxrow = y2;
			      }
			      var tmp = m[y];
			      m[y] = m[maxrow];
			      m[maxrow] = tmp;
			      for (y2 = y+1; y2 < h; y2++) {
			        c = m[y2][y] / m[y][y];
			        for (x = y; x < w; x++) {
			          m[y2][x] -= m[y][x] * c;
			        }
			      }
			    }
			    // backsubstitute
			    for (y = h-1; y >= 0; y--) {
			      c = m[y][y];
			      for (y2 = 0; y2 < y; y2++) {
			        for (x = w-1; x > y-1; x--) {
			          m[y2][x] -= m[y][x] * m[y2][y] / c;
			        }
			      }
			      m[y][y] /= c;
			      for (x = h; x < w; x++) {
			        m[y][x] /= c;
			      }
			    }
			    return m;
			  },

			  // solve equation
			  // Ax=b
			  // A is upper triangular matrix
			  // A=[[1,2,3],[0,4,5],[0,6,7]]
			  // b=[1,2,3]
			  // triaUpSolve(A,b) // -> [2.666,0.1666,1.666]
			  // if you use matrix style
			  // A=[[1,2,3],[0,4,5],[0,6,7]]
			  // b=[[1],[2],[3]]
			  // will return [[2.666],[0.1666],[1.666]]
			  triaUpSolve: function triaUpSolve(A, b) {
			    var size = A[0].length;
			    var x = jStat.zeros(1, size)[0];
			    var parts;
			    var matrix_mode = false;

			    if (b[0].length != undefined) {
			      b = b.map(function(i){ return i[0] });
			      matrix_mode = true;
			    }

			    jStat.arange(size - 1, -1, -1).forEach(function(i) {
			      parts = jStat.arange(i + 1, size).map(function(j) {
			        return x[j] * A[i][j];
			      });
			      x[i] = (b[i] - jStat.sum(parts)) / A[i][i];
			    });

			    if (matrix_mode)
			      return x.map(function(i){ return [i] });
			    return x;
			  },

			  triaLowSolve: function triaLowSolve(A, b) {
			    // like to triaUpSolve but A is lower triangular matrix
			    var size = A[0].length;
			    var x = jStat.zeros(1, size)[0];
			    var parts;

			    var matrix_mode=false;
			    if (b[0].length != undefined) {
			      b = b.map(function(i){ return i[0] });
			      matrix_mode = true;
			    }

			    jStat.arange(size).forEach(function(i) {
			      parts = jStat.arange(i).map(function(j) {
			        return A[i][j] * x[j];
			      });
			      x[i] = (b[i] - jStat.sum(parts)) / A[i][i];
			    });

			    if (matrix_mode)
			      return x.map(function(i){ return [i] });
			    return x;
			  },


			  // A -> [L,U]
			  // A=LU
			  // L is lower triangular matrix
			  // U is upper triangular matrix
			  lu: function lu(A) {
			    var size = A.length;
			    //var L=jStat.diagonal(jStat.ones(1,size)[0]);
			    var L = jStat.identity(size);
			    var R = jStat.zeros(A.length, A[0].length);
			    var parts;
			    jStat.arange(size).forEach(function(t) {
			      R[0][t] = A[0][t];
			    });
			    jStat.arange(1, size).forEach(function(l) {
			      jStat.arange(l).forEach(function(i) {
			        parts = jStat.arange(i).map(function(jj) {
			          return L[l][jj] * R[jj][i];
			        });
			        L[l][i] = (A[l][i] - jStat.sum(parts)) / R[i][i];
			      });
			      jStat.arange(l, size).forEach(function(j) {
			        parts = jStat.arange(l).map(function(jj) {
			          return L[l][jj] * R[jj][j];
			        });
			        R[l][j] = A[parts.length][j] - jStat.sum(parts);
			      });
			    });
			    return [L, R];
			  },

			  // A -> T
			  // A=TT'
			  // T is lower triangular matrix
			  cholesky: function cholesky(A) {
			    var size = A.length;
			    var T = jStat.zeros(A.length, A[0].length);
			    var parts;
			    jStat.arange(size).forEach(function(i) {
			      parts = jStat.arange(i).map(function(t) {
			        return Math.pow(T[i][t],2);
			      });
			      T[i][i] = Math.sqrt(A[i][i] - jStat.sum(parts));
			      jStat.arange(i + 1, size).forEach(function(j) {
			        parts = jStat.arange(i).map(function(t) {
			          return T[i][t] * T[j][t];
			        });
			        T[j][i] = (A[i][j] - jStat.sum(parts)) / T[i][i];
			      });
			    });
			    return T;
			  },


			  gauss_jacobi: function gauss_jacobi(a, b, x, r) {
			    var i = 0;
			    var j = 0;
			    var n = a.length;
			    var l = [];
			    var u = [];
			    var d = [];
			    var xv, c, h, xk;
			    for (; i < n; i++) {
			      l[i] = [];
			      u[i] = [];
			      d[i] = [];
			      for (j = 0; j < n; j++) {
			        if (i > j) {
			          l[i][j] = a[i][j];
			          u[i][j] = d[i][j] = 0;
			        } else if (i < j) {
			          u[i][j] = a[i][j];
			          l[i][j] = d[i][j] = 0;
			        } else {
			          d[i][j] = a[i][j];
			          l[i][j] = u[i][j] = 0;
			        }
			      }
			    }
			    h = jStat.multiply(jStat.multiply(jStat.inv(d), jStat.add(l, u)), -1);
			    c = jStat.multiply(jStat.inv(d), b);
			    xv = x;
			    xk = jStat.add(jStat.multiply(h, x), c);
			    i = 2;
			    while (Math.abs(jStat.norm(jStat.subtract(xk,xv))) > r) {
			      xv = xk;
			      xk = jStat.add(jStat.multiply(h, xv), c);
			      i++;
			    }
			    return xk;
			  },

			  gauss_seidel: function gauss_seidel(a, b, x, r) {
			    var i = 0;
			    var n = a.length;
			    var l = [];
			    var u = [];
			    var d = [];
			    var j, xv, c, h, xk;
			    for (; i < n; i++) {
			      l[i] = [];
			      u[i] = [];
			      d[i] = [];
			      for (j = 0; j < n; j++) {
			        if (i > j) {
			          l[i][j] = a[i][j];
			          u[i][j] = d[i][j] = 0;
			        } else if (i < j) {
			          u[i][j] = a[i][j];
			          l[i][j] = d[i][j] = 0;
			        } else {
			          d[i][j] = a[i][j];
			          l[i][j] = u[i][j] = 0;
			        }
			      }
			    }
			    h = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d, l)), u), -1);
			    c = jStat.multiply(jStat.inv(jStat.add(d, l)), b);
			    xv = x;
			    xk = jStat.add(jStat.multiply(h, x), c);
			    i = 2;
			    while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
			      xv = xk;
			      xk = jStat.add(jStat.multiply(h, xv), c);
			      i = i + 1;
			    }
			    return xk;
			  },

			  SOR: function SOR(a, b, x, r, w) {
			    var i = 0;
			    var n = a.length;
			    var l = [];
			    var u = [];
			    var d = [];
			    var j, xv, c, h, xk;
			    for (; i < n; i++) {
			      l[i] = [];
			      u[i] = [];
			      d[i] = [];
			      for (j = 0; j < n; j++) {
			        if (i > j) {
			          l[i][j] = a[i][j];
			          u[i][j] = d[i][j] = 0;
			        } else if (i < j) {
			          u[i][j] = a[i][j];
			          l[i][j] = d[i][j] = 0;
			        } else {
			          d[i][j] = a[i][j];
			          l[i][j] = u[i][j] = 0;
			        }
			      }
			    }
			    h = jStat.multiply(jStat.inv(jStat.add(d, jStat.multiply(l, w))),
			                       jStat.subtract(jStat.multiply(d, 1 - w),
			                                      jStat.multiply(u, w)));
			    c = jStat.multiply(jStat.multiply(jStat.inv(jStat.add(d,
			        jStat.multiply(l, w))), b), w);
			    xv = x;
			    xk = jStat.add(jStat.multiply(h, x), c);
			    i = 2;
			    while (Math.abs(jStat.norm(jStat.subtract(xk, xv))) > r) {
			      xv = xk;
			      xk = jStat.add(jStat.multiply(h, xv), c);
			      i++;
			    }
			    return xk;
			  },

			  householder: function householder(a) {
			    var m = a.length;
			    var n = a[0].length;
			    var i = 0;
			    var w = [];
			    var p = [];
			    var alpha, r, k, j, factor;
			    for (; i < m - 1; i++) {
			      alpha = 0;
			      for (j = i + 1; j < n; j++)
			      alpha += (a[j][i] * a[j][i]);
			      factor = (a[i + 1][i] > 0) ? -1 : 1;
			      alpha = factor * Math.sqrt(alpha);
			      r = Math.sqrt((((alpha * alpha) - a[i + 1][i] * alpha) / 2));
			      w = jStat.zeros(m, 1);
			      w[i + 1][0] = (a[i + 1][i] - alpha) / (2 * r);
			      for (k = i + 2; k < m; k++) w[k][0] = a[k][i] / (2 * r);
			      p = jStat.subtract(jStat.identity(m, n),
			          jStat.multiply(jStat.multiply(w, jStat.transpose(w)), 2));
			      a = jStat.multiply(p, jStat.multiply(a, p));
			    }
			    return a;
			  },

			  // A -> [Q,R]
			  // Q is orthogonal matrix
			  // R is upper triangular
			  QR: (function() {
			    // x -> Q
			    // find a orthogonal matrix Q st.
			    // Qx=y
			    // y is [||x||,0,0,...]

			    // quick ref
			    var sum   = jStat.sum;
			    var range = jStat.arange;

			    function qr2(x) {
			      // quick impletation
			      // https://www.stat.wisc.edu/~larget/math496/qr.html

			      var n = x.length;
			      var p = x[0].length;

			      var r = jStat.zeros(p, p);
			      x = jStat.copy(x);

			      var i,j,k;
			      for(j = 0; j < p; j++){
			        r[j][j] = Math.sqrt(sum(range(n).map(function(i){
			          return x[i][j] * x[i][j];
			        })));
			        for(i = 0; i < n; i++){
			          x[i][j] = x[i][j] / r[j][j];
			        }
			        for(k = j+1; k < p; k++){
			          r[j][k] = sum(range(n).map(function(i){
			            return x[i][j] * x[i][k];
			          }));
			          for(i = 0; i < n; i++){
			            x[i][k] = x[i][k] - x[i][j]*r[j][k];
			          }
			        }
			      }
			      return [x, r];
			    }

			    return qr2;
			  }()),

			  lstsq: (function() {
			    // solve least squard problem for Ax=b as QR decomposition way if b is
			    // [[b1],[b2],[b3]] form will return [[x1],[x2],[x3]] array form solution
			    // else b is [b1,b2,b3] form will return [x1,x2,x3] array form solution
			    function R_I(A) {
			      A = jStat.copy(A);
			      var size = A.length;
			      var I = jStat.identity(size);
			      jStat.arange(size - 1, -1, -1).forEach(function(i) {
			        jStat.sliceAssign(
			            I, { row: i }, jStat.divide(jStat.slice(I, { row: i }), A[i][i]));
			        jStat.sliceAssign(
			            A, { row: i }, jStat.divide(jStat.slice(A, { row: i }), A[i][i]));
			        jStat.arange(i).forEach(function(j) {
			          var c = jStat.multiply(A[j][i], -1);
			          var Aj = jStat.slice(A, { row: j });
			          var cAi = jStat.multiply(jStat.slice(A, { row: i }), c);
			          jStat.sliceAssign(A, { row: j }, jStat.add(Aj, cAi));
			          var Ij = jStat.slice(I, { row: j });
			          var cIi = jStat.multiply(jStat.slice(I, { row: i }), c);
			          jStat.sliceAssign(I, { row: j }, jStat.add(Ij, cIi));
			        });
			      });
			      return I;
			    }

			    function qr_solve(A, b){
			      var array_mode = false;
			      if (b[0].length === undefined) {
			        // [c1,c2,c3] mode
			        b = b.map(function(x){ return [x] });
			        array_mode = true;
			      }
			      var QR = jStat.QR(A);
			      var Q = QR[0];
			      var R = QR[1];
			      var attrs = A[0].length;
			      var Q1 = jStat.slice(Q,{col:{end:attrs}});
			      var R1 = jStat.slice(R,{row:{end:attrs}});
			      var RI = R_I(R1);
			      var Q2 = jStat.transpose(Q1);

			      if(Q2[0].length === undefined){
			        Q2 = [Q2]; // The confusing jStat.multifly implementation threat nature process again.
			      }

			      var x = jStat.multiply(jStat.multiply(RI, Q2), b);

			      if(x.length === undefined){
			        x = [[x]]; // The confusing jStat.multifly implementation threat nature process again.
			      }


			      if (array_mode)
			        return x.map(function(i){ return i[0] });
			      return x;
			    }

			    return qr_solve;
			  }()),

			  jacobi: function jacobi(a) {
			    var condition = 1;
			    var n = a.length;
			    var e = jStat.identity(n, n);
			    var ev = [];
			    var b, i, j, p, q, maxim, theta, s;
			    // condition === 1 only if tolerance is not reached
			    while (condition === 1) {
			      maxim = a[0][1];
			      p = 0;
			      q = 1;
			      for (i = 0; i < n; i++) {
			        for (j = 0; j < n; j++) {
			          if (i != j) {
			            if (maxim < Math.abs(a[i][j])) {
			              maxim = Math.abs(a[i][j]);
			              p = i;
			              q = j;
			            }
			          }
			        }
			      }
			      if (a[p][p] === a[q][q])
			        theta = (a[p][q] > 0) ? Math.PI / 4 : -Math.PI / 4;
			      else
			        theta = Math.atan(2 * a[p][q] / (a[p][p] - a[q][q])) / 2;
			      s = jStat.identity(n, n);
			      s[p][p] = Math.cos(theta);
			      s[p][q] = -Math.sin(theta);
			      s[q][p] = Math.sin(theta);
			      s[q][q] = Math.cos(theta);
			      // eigen vector matrix
			      e = jStat.multiply(e, s);
			      b = jStat.multiply(jStat.multiply(jStat.inv(s), a), s);
			      a = b;
			      condition = 0;
			      for (i = 1; i < n; i++) {
			        for (j = 1; j < n; j++) {
			          if (i != j && Math.abs(a[i][j]) > 0.001) {
			            condition = 1;
			          }
			        }
			      }
			    }
			    for (i = 0; i < n; i++) ev.push(a[i][i]);
			    //returns both the eigenvalue and eigenmatrix
			    return [e, ev];
			  },

			  rungekutta: function rungekutta(f, h, p, t_j, u_j, order) {
			    var k1, k2, u_j1, k3, k4;
			    if (order === 2) {
			      while (t_j <= p) {
			        k1 = h * f(t_j, u_j);
			        k2 = h * f(t_j + h, u_j + k1);
			        u_j1 = u_j + (k1 + k2) / 2;
			        u_j = u_j1;
			        t_j = t_j + h;
			      }
			    }
			    if (order === 4) {
			      while (t_j <= p) {
			        k1 = h * f(t_j, u_j);
			        k2 = h * f(t_j + h / 2, u_j + k1 / 2);
			        k3 = h * f(t_j + h / 2, u_j + k2 / 2);
			        k4 = h * f(t_j +h, u_j + k3);
			        u_j1 = u_j + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
			        u_j = u_j1;
			        t_j = t_j + h;
			      }
			    }
			    return u_j;
			  },

			  romberg: function romberg(f, a, b, order) {
			    var i = 0;
			    var h = (b - a) / 2;
			    var x = [];
			    var h1 = [];
			    var g = [];
			    var m, a1, j, k, I;
			    while (i < order / 2) {
			      I = f(a);
			      for (j = a, k = 0; j <= b; j = j + h, k++) x[k] = j;
			      m = x.length;
			      for (j = 1; j < m - 1; j++) {
			        I += (((j % 2) !== 0) ? 4 : 2) * f(x[j]);
			      }
			      I = (h / 3) * (I + f(b));
			      g[i] = I;
			      h /= 2;
			      i++;
			    }
			    a1 = g.length;
			    m = 1;
			    while (a1 !== 1) {
			      for (j = 0; j < a1 - 1; j++)
			      h1[j] = ((Math.pow(4, m)) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
			      a1 = h1.length;
			      g = h1;
			      h1 = [];
			      m++;
			    }
			    return g;
			  },

			  richardson: function richardson(X, f, x, h) {
			    function pos(X, x) {
			      var i = 0;
			      var n = X.length;
			      var p;
			      for (; i < n; i++)
			        if (X[i] === x) p = i;
			      return p;
			    }
			    var h_min = Math.abs(x - X[pos(X, x) + 1]);
			    var i = 0;
			    var g = [];
			    var h1 = [];
			    var y1, y2, m, a, j;
			    while (h >= h_min) {
			      y1 = pos(X, x + h);
			      y2 = pos(X, x);
			      g[i] = (f[y1] - 2 * f[y2] + f[2 * y2 - y1]) / (h * h);
			      h /= 2;
			      i++;
			    }
			    a = g.length;
			    m = 1;
			    while (a != 1) {
			      for (j = 0; j < a - 1; j++)
			        h1[j] = ((Math.pow(4, m)) * g[j + 1] - g[j]) / (Math.pow(4, m) - 1);
			      a = h1.length;
			      g = h1;
			      h1 = [];
			      m++;
			    }
			    return g;
			  },

			  simpson: function simpson(f, a, b, n) {
			    var h = (b - a) / n;
			    var I = f(a);
			    var x = [];
			    var j = a;
			    var k = 0;
			    var i = 1;
			    var m;
			    for (; j <= b; j = j + h, k++)
			      x[k] = j;
			    m = x.length;
			    for (; i < m - 1; i++) {
			      I += ((i % 2 !== 0) ? 4 : 2) * f(x[i]);
			    }
			    return (h / 3) * (I + f(b));
			  },

			  hermite: function hermite(X, F, dF, value) {
			    var n = X.length;
			    var p = 0;
			    var i = 0;
			    var l = [];
			    var dl = [];
			    var A = [];
			    var B = [];
			    var j;
			    for (; i < n; i++) {
			      l[i] = 1;
			      for (j = 0; j < n; j++) {
			        if (i != j) l[i] *= (value - X[j]) / (X[i] - X[j]);
			      }
			      dl[i] = 0;
			      for (j = 0; j < n; j++) {
			        if (i != j) dl[i] += 1 / (X [i] - X[j]);
			      }
			      A[i] = (1 - 2 * (value - X[i]) * dl[i]) * (l[i] * l[i]);
			      B[i] = (value - X[i]) * (l[i] * l[i]);
			      p += (A[i] * F[i] + B[i] * dF[i]);
			    }
			    return p;
			  },

			  lagrange: function lagrange(X, F, value) {
			    var p = 0;
			    var i = 0;
			    var j, l;
			    var n = X.length;
			    for (; i < n; i++) {
			      l = F[i];
			      for (j = 0; j < n; j++) {
			        // calculating the lagrange polynomial L_i
			        if (i != j) l *= (value - X[j]) / (X[i] - X[j]);
			      }
			      // adding the lagrange polynomials found above
			      p += l;
			    }
			    return p;
			  },

			  cubic_spline: function cubic_spline(X, F, value) {
			    var n = X.length;
			    var i = 0, j;
			    var A = [];
			    var B = [];
			    var alpha = [];
			    var c = [];
			    var h = [];
			    var b = [];
			    var d = [];
			    for (; i < n - 1; i++)
			      h[i] = X[i + 1] - X[i];
			    alpha[0] = 0;
			    for (i = 1; i < n - 1; i++) {
			      alpha[i] = (3 / h[i]) * (F[i + 1] - F[i]) -
			          (3 / h[i-1]) * (F[i] - F[i-1]);
			    }
			    for (i = 1; i < n - 1; i++) {
			      A[i] = [];
			      B[i] = [];
			      A[i][i-1] = h[i-1];
			      A[i][i] = 2 * (h[i - 1] + h[i]);
			      A[i][i+1] = h[i];
			      B[i][0] = alpha[i];
			    }
			    c = jStat.multiply(jStat.inv(A), B);
			    for (j = 0; j < n - 1; j++) {
			      b[j] = (F[j + 1] - F[j]) / h[j] - h[j] * (c[j + 1][0] + 2 * c[j][0]) / 3;
			      d[j] = (c[j + 1][0] - c[j][0]) / (3 * h[j]);
			    }
			    for (j = 0; j < n; j++) {
			      if (X[j] > value) break;
			    }
			    j -= 1;
			    return F[j] + (value - X[j]) * b[j] + jStat.sq(value-X[j]) *
			        c[j] + (value - X[j]) * jStat.sq(value - X[j]) * d[j];
			  },

			  gauss_quadrature: function gauss_quadrature() {
			    throw new Error('gauss_quadrature not yet implemented');
			  },

			  PCA: function PCA(X) {
			    var m = X.length;
			    var n = X[0].length;
			    var i = 0;
			    var j, temp1;
			    var u = [];
			    var D = [];
			    var result = [];
			    var temp2 = [];
			    var Y = [];
			    var Bt = [];
			    var B = [];
			    var C = [];
			    var V = [];
			    var Vt = [];
			    for (i = 0; i < m; i++) {
			      u[i] = jStat.sum(X[i]) / n;
			    }
			    for (i = 0; i < n; i++) {
			      B[i] = [];
			      for(j = 0; j < m; j++) {
			        B[i][j] = X[j][i] - u[j];
			      }
			    }
			    B = jStat.transpose(B);
			    for (i = 0; i < m; i++) {
			      C[i] = [];
			      for (j = 0; j < m; j++) {
			        C[i][j] = (jStat.dot([B[i]], [B[j]])) / (n - 1);
			      }
			    }
			    result = jStat.jacobi(C);
			    V = result[0];
			    D = result[1];
			    Vt = jStat.transpose(V);
			    for (i = 0; i < D.length; i++) {
			      for (j = i; j < D.length; j++) {
			        if(D[i] < D[j])  {
			          temp1 = D[i];
			          D[i] = D[j];
			          D[j] = temp1;
			          temp2 = Vt[i];
			          Vt[i] = Vt[j];
			          Vt[j] = temp2;
			        }
			      }
			    }
			    Bt = jStat.transpose(B);
			    for (i = 0; i < m; i++) {
			      Y[i] = [];
			      for (j = 0; j < Bt.length; j++) {
			        Y[i][j] = jStat.dot([Vt[i]], [Bt[j]]);
			      }
			    }
			    return [X, D, Vt, Y];
			  }
			});

			// extend jStat.fn with methods that require one argument
			(function(funcs) {
			  for (var i = 0; i < funcs.length; i++) (function(passfunc) {
			    jStat.fn[passfunc] = function(arg, func) {
			      var tmpthis = this;
			      // check for callback
			      if (func) {
			        setTimeout(function() {
			          func.call(tmpthis, jStat.fn[passfunc].call(tmpthis, arg));
			        }, 15);
			        return this;
			      }
			      if (typeof jStat[passfunc](this, arg) === 'number')
			        return jStat[passfunc](this, arg);
			      else
			        return jStat(jStat[passfunc](this, arg));
			    };
			  }(funcs[i]));
			}('add divide multiply subtract dot pow exp log abs norm angle'.split(' ')));

			}(jStat, Math));
			(function(jStat, Math) {

			var slice = [].slice;
			var isNumber = jStat.utils.isNumber;
			var isArray = jStat.utils.isArray;

			// flag==true denotes use of sample standard deviation
			// Z Statistics
			jStat.extend({
			  // 2 different parameter lists:
			  // (value, mean, sd)
			  // (value, array, flag)
			  zscore: function zscore() {
			    var args = slice.call(arguments);
			    if (isNumber(args[1])) {
			      return (args[0] - args[1]) / args[2];
			    }
			    return (args[0] - jStat.mean(args[1])) / jStat.stdev(args[1], args[2]);
			  },

			  // 3 different paramter lists:
			  // (value, mean, sd, sides)
			  // (zscore, sides)
			  // (value, array, sides, flag)
			  ztest: function ztest() {
			    var args = slice.call(arguments);
			    var z;
			    if (isArray(args[1])) {
			      // (value, array, sides, flag)
			      z = jStat.zscore(args[0],args[1],args[3]);
			      return (args[2] === 1) ?
			        (jStat.normal.cdf(-Math.abs(z), 0, 1)) :
			        (jStat.normal.cdf(-Math.abs(z), 0, 1)*2);
			    } else {
			      if (args.length > 2) {
			        // (value, mean, sd, sides)
			        z = jStat.zscore(args[0],args[1],args[2]);
			        return (args[3] === 1) ?
			          (jStat.normal.cdf(-Math.abs(z),0,1)) :
			          (jStat.normal.cdf(-Math.abs(z),0,1)* 2);
			      } else {
			        // (zscore, sides)
			        z = args[0];
			        return (args[1] === 1) ?
			          (jStat.normal.cdf(-Math.abs(z),0,1)) :
			          (jStat.normal.cdf(-Math.abs(z),0,1)*2);
			      }
			    }
			  }
			});

			jStat.extend(jStat.fn, {
			  zscore: function zscore(value, flag) {
			    return (value - this.mean()) / this.stdev(flag);
			  },

			  ztest: function ztest(value, sides, flag) {
			    var zscore = Math.abs(this.zscore(value, flag));
			    return (sides === 1) ?
			      (jStat.normal.cdf(-zscore, 0, 1)) :
			      (jStat.normal.cdf(-zscore, 0, 1) * 2);
			  }
			});

			// T Statistics
			jStat.extend({
			  // 2 parameter lists
			  // (value, mean, sd, n)
			  // (value, array)
			  tscore: function tscore() {
			    var args = slice.call(arguments);
			    return (args.length === 4) ?
			      ((args[0] - args[1]) / (args[2] / Math.sqrt(args[3]))) :
			      ((args[0] - jStat.mean(args[1])) /
			       (jStat.stdev(args[1], true) / Math.sqrt(args[1].length)));
			  },

			  // 3 different paramter lists:
			  // (value, mean, sd, n, sides)
			  // (tscore, n, sides)
			  // (value, array, sides)
			  ttest: function ttest() {
			    var args = slice.call(arguments);
			    var tscore;
			    if (args.length === 5) {
			      tscore = Math.abs(jStat.tscore(args[0], args[1], args[2], args[3]));
			      return (args[4] === 1) ?
			        (jStat.studentt.cdf(-tscore, args[3]-1)) :
			        (jStat.studentt.cdf(-tscore, args[3]-1)*2);
			    }
			    if (isNumber(args[1])) {
			      tscore = Math.abs(args[0]);
			      return (args[2] == 1) ?
			        (jStat.studentt.cdf(-tscore, args[1]-1)) :
			        (jStat.studentt.cdf(-tscore, args[1]-1) * 2);
			    }
			    tscore = Math.abs(jStat.tscore(args[0], args[1]));
			    return (args[2] == 1) ?
			      (jStat.studentt.cdf(-tscore, args[1].length-1)) :
			      (jStat.studentt.cdf(-tscore, args[1].length-1) * 2);
			  }
			});

			jStat.extend(jStat.fn, {
			  tscore: function tscore(value) {
			    return (value - this.mean()) / (this.stdev(true) / Math.sqrt(this.cols()));
			  },

			  ttest: function ttest(value, sides) {
			    return (sides === 1) ?
			      (1 - jStat.studentt.cdf(Math.abs(this.tscore(value)), this.cols()-1)) :
			      (jStat.studentt.cdf(-Math.abs(this.tscore(value)), this.cols()-1)*2);
			  }
			});

			// F Statistics
			jStat.extend({
			  // Paramter list is as follows:
			  // (array1, array2, array3, ...)
			  // or it is an array of arrays
			  // array of arrays conversion
			  anovafscore: function anovafscore() {
			    var args = slice.call(arguments),
			    expVar, sample, sampMean, sampSampMean, tmpargs, unexpVar, i, j;
			    if (args.length === 1) {
			      tmpargs = new Array(args[0].length);
			      for (i = 0; i < args[0].length; i++) {
			        tmpargs[i] = args[0][i];
			      }
			      args = tmpargs;
			    }
			    // Builds sample array
			    sample = new Array();
			    for (i = 0; i < args.length; i++) {
			      sample = sample.concat(args[i]);
			    }
			    sampMean = jStat.mean(sample);
			    // Computes the explained variance
			    expVar = 0;
			    for (i = 0; i < args.length; i++) {
			      expVar = expVar + args[i].length * Math.pow(jStat.mean(args[i]) - sampMean, 2);
			    }
			    expVar /= (args.length - 1);
			    // Computes unexplained variance
			    unexpVar = 0;
			    for (i = 0; i < args.length; i++) {
			      sampSampMean = jStat.mean(args[i]);
			      for (j = 0; j < args[i].length; j++) {
			        unexpVar += Math.pow(args[i][j] - sampSampMean, 2);
			      }
			    }
			    unexpVar /= (sample.length - args.length);
			    return expVar / unexpVar;
			  },

			  // 2 different paramter setups
			  // (array1, array2, array3, ...)
			  // (anovafscore, df1, df2)
			  anovaftest: function anovaftest() {
			    var args = slice.call(arguments),
			    df1, df2, n, i;
			    if (isNumber(args[0])) {
			      return 1 - jStat.centralF.cdf(args[0], args[1], args[2]);
			    }
			    var anovafscore = jStat.anovafscore(args);
			    df1 = args.length - 1;
			    n = 0;
			    for (i = 0; i < args.length; i++) {
			      n = n + args[i].length;
			    }
			    df2 = n - df1 - 1;
			    return 1 - jStat.centralF.cdf(anovafscore, df1, df2);
			  },

			  ftest: function ftest(fscore, df1, df2) {
			    return 1 - jStat.centralF.cdf(fscore, df1, df2);
			  }
			});

			jStat.extend(jStat.fn, {
			  anovafscore: function anovafscore() {
			    return jStat.anovafscore(this.toArray());
			  },

			  anovaftes: function anovaftes() {
			    var n = 0;
			    var i;
			    for (i = 0; i < this.length; i++) {
			      n = n + this[i].length;
			    }
			    return jStat.ftest(this.anovafscore(), this.length - 1, n - this.length);
			  }
			});

			// Tukey's range test
			jStat.extend({
			  // 2 parameter lists
			  // (mean1, mean2, n1, n2, sd)
			  // (array1, array2, sd)
			  qscore: function qscore() {
			    var args = slice.call(arguments);
			    var mean1, mean2, n1, n2, sd;
			    if (isNumber(args[0])) {
			        mean1 = args[0];
			        mean2 = args[1];
			        n1 = args[2];
			        n2 = args[3];
			        sd = args[4];
			    } else {
			        mean1 = jStat.mean(args[0]);
			        mean2 = jStat.mean(args[1]);
			        n1 = args[0].length;
			        n2 = args[1].length;
			        sd = args[2];
			    }
			    return Math.abs(mean1 - mean2) / (sd * Math.sqrt((1 / n1 + 1 / n2) / 2));
			  },

			  // 3 different parameter lists:
			  // (qscore, n, k)
			  // (mean1, mean2, n1, n2, sd, n, k)
			  // (array1, array2, sd, n, k)
			  qtest: function qtest() {
			    var args = slice.call(arguments);

			    var qscore;
			    if (args.length === 3) {
			      qscore = args[0];
			      args = args.slice(1);
			    } else if (args.length === 7) {
			      qscore = jStat.qscore(args[0], args[1], args[2], args[3], args[4]);
			      args = args.slice(5);
			    } else {
			      qscore = jStat.qscore(args[0], args[1], args[2]);
			      args = args.slice(3);
			    }

			    var n = args[0];
			    var k = args[1];

			    return 1 - jStat.tukey.cdf(qscore, k, n - k);
			  },

			  tukeyhsd: function tukeyhsd(arrays) {
			    var sd = jStat.pooledstdev(arrays);
			    var means = arrays.map(function (arr) {return jStat.mean(arr);});
			    var n = arrays.reduce(function (n, arr) {return n + arr.length;}, 0);

			    var results = [];
			    for (var i = 0; i < arrays.length; ++i) {
			        for (var j = i + 1; j < arrays.length; ++j) {
			            var p = jStat.qtest(means[i], means[j], arrays[i].length, arrays[j].length, sd, n, arrays.length);
			            results.push([[i, j], p]);
			        }
			    }

			    return results;
			  }
			});

			// Error Bounds
			jStat.extend({
			  // 2 different parameter setups
			  // (value, alpha, sd, n)
			  // (value, alpha, array)
			  normalci: function normalci() {
			    var args = slice.call(arguments),
			    ans = new Array(2),
			    change;
			    if (args.length === 4) {
			      change = Math.abs(jStat.normal.inv(args[1] / 2, 0, 1) *
			                        args[2] / Math.sqrt(args[3]));
			    } else {
			      change = Math.abs(jStat.normal.inv(args[1] / 2, 0, 1) *
			                        jStat.stdev(args[2]) / Math.sqrt(args[2].length));
			    }
			    ans[0] = args[0] - change;
			    ans[1] = args[0] + change;
			    return ans;
			  },

			  // 2 different parameter setups
			  // (value, alpha, sd, n)
			  // (value, alpha, array)
			  tci: function tci() {
			    var args = slice.call(arguments),
			    ans = new Array(2),
			    change;
			    if (args.length === 4) {
			      change = Math.abs(jStat.studentt.inv(args[1] / 2, args[3] - 1) *
			                        args[2] / Math.sqrt(args[3]));
			    } else {
			      change = Math.abs(jStat.studentt.inv(args[1] / 2, args[2].length - 1) *
			                        jStat.stdev(args[2], true) / Math.sqrt(args[2].length));
			    }
			    ans[0] = args[0] - change;
			    ans[1] = args[0] + change;
			    return ans;
			  },

			  significant: function significant(pvalue, alpha) {
			    return pvalue < alpha;
			  }
			});

			jStat.extend(jStat.fn, {
			  normalci: function normalci(value, alpha) {
			    return jStat.normalci(value, alpha, this.toArray());
			  },

			  tci: function tci(value, alpha) {
			    return jStat.tci(value, alpha, this.toArray());
			  }
			});

			// internal method for calculating the z-score for a difference of proportions test
			function differenceOfProportions(p1, n1, p2, n2) {
			  if (p1 > 1 || p2 > 1 || p1 <= 0 || p2 <= 0) {
			    throw new Error("Proportions should be greater than 0 and less than 1")
			  }
			  var pooled = (p1 * n1 + p2 * n2) / (n1 + n2);
			  var se = Math.sqrt(pooled * (1 - pooled) * ((1/n1) + (1/n2)));
			  return (p1 - p2) / se;
			}

			// Difference of Proportions
			jStat.extend(jStat.fn, {
			  oneSidedDifferenceOfProportions: function oneSidedDifferenceOfProportions(p1, n1, p2, n2) {
			    var z = differenceOfProportions(p1, n1, p2, n2);
			    return jStat.ztest(z, 1);
			  },

			  twoSidedDifferenceOfProportions: function twoSidedDifferenceOfProportions(p1, n1, p2, n2) {
			    var z = differenceOfProportions(p1, n1, p2, n2);
			    return jStat.ztest(z, 2);
			  }
			});

			}(jStat, Math));
			jStat.models = (function(){
			  function sub_regress(exog) {
			    var var_count = exog[0].length;
			    var modelList = jStat.arange(var_count).map(function(endog_index) {
			      var exog_index =
			          jStat.arange(var_count).filter(function(i){return i!==endog_index});
			      return ols(jStat.col(exog, endog_index).map(function(x){ return x[0] }),
			                 jStat.col(exog, exog_index))
			    });
			    return modelList;
			  }

			  // do OLS model regress
			  // exog have include const columns ,it will not generate it .In fact, exog is
			  // "design matrix" look at
			  //https://en.wikipedia.org/wiki/Design_matrix
			  function ols(endog, exog) {
			    var nobs = endog.length;
			    var df_model = exog[0].length - 1;
			    var df_resid = nobs-df_model - 1;
			    var coef = jStat.lstsq(exog, endog);
			    var predict =
			        jStat.multiply(exog, coef.map(function(x) { return [x] }))
			            .map(function(p) { return p[0] });
			    var resid = jStat.subtract(endog, predict);
			    var ybar = jStat.mean(endog);
			    // constant cause problem
			    // var SST = jStat.sum(endog.map(function(y) {
			    //   return Math.pow(y-ybar,2);
			    // }));
			    var SSE = jStat.sum(predict.map(function(f) {
			      return Math.pow(f - ybar, 2);
			    }));
			    var SSR = jStat.sum(endog.map(function(y, i) {
			      return Math.pow(y - predict[i], 2);
			    }));
			    var SST = SSE + SSR;
			    var R2 = (SSE / SST);
			    return {
			        exog:exog,
			        endog:endog,
			        nobs:nobs,
			        df_model:df_model,
			        df_resid:df_resid,
			        coef:coef,
			        predict:predict,
			        resid:resid,
			        ybar:ybar,
			        SST:SST,
			        SSE:SSE,
			        SSR:SSR,
			        R2:R2
			    };
			  }

			  // H0: b_I=0
			  // H1: b_I!=0
			  function t_test(model) {
			    var subModelList = sub_regress(model.exog);
			    //var sigmaHat=jStat.stdev(model.resid);
			    var sigmaHat = Math.sqrt(model.SSR / (model.df_resid));
			    var seBetaHat = subModelList.map(function(mod) {
			      var SST = mod.SST;
			      var R2 = mod.R2;
			      return sigmaHat / Math.sqrt(SST * (1 - R2));
			    });
			    var tStatistic = model.coef.map(function(coef, i) {
			      return (coef - 0) / seBetaHat[i];
			    });
			    var pValue = tStatistic.map(function(t) {
			      var leftppf = jStat.studentt.cdf(t, model.df_resid);
			      return (leftppf > 0.5 ? 1 - leftppf : leftppf) * 2;
			    });
			    var c = jStat.studentt.inv(0.975, model.df_resid);
			    var interval95 = model.coef.map(function(coef, i) {
			      var d = c * seBetaHat[i];
			      return [coef - d, coef + d];
			    });
			    return {
			        se: seBetaHat,
			        t: tStatistic,
			        p: pValue,
			        sigmaHat: sigmaHat,
			        interval95: interval95
			    };
			  }

			  function F_test(model) {
			    var F_statistic =
			        (model.R2 / model.df_model) / ((1 - model.R2) / model.df_resid);
			    var fcdf = function(x, n1, n2) {
			      return jStat.beta.cdf(x / (n2 / n1 + x), n1 / 2, n2 / 2)
			    };
			    var pvalue = 1 - fcdf(F_statistic, model.df_model, model.df_resid);
			    return { F_statistic: F_statistic, pvalue: pvalue };
			  }

			  function ols_wrap(endog, exog) {
			    var model = ols(endog,exog);
			    var ttest = t_test(model);
			    var ftest = F_test(model);
			    // Provide the Wherry / Ezekiel / McNemar / Cohen Adjusted R^2
			    // Which matches the 'adjusted R^2' provided by R's lm package
			    var adjust_R2 =
			        1 - (1 - model.R2) * ((model.nobs - 1) / (model.df_resid));
			    model.t = ttest;
			    model.f = ftest;
			    model.adjust_R2 = adjust_R2;
			    return model;
			  }

			  return { ols: ols_wrap };
			})();
			//To regress, simply build X matrix
			//(append column of 1's) using
			//buildxmatrix and build the Y
			//matrix using buildymatrix
			//(simply the transpose)
			//and run regress.



			//Regressions

			jStat.extend({
			  buildxmatrix: function buildxmatrix(){
			    //Parameters will be passed in as such
			    //(array1,array2,array3,...)
			    //as (x1,x2,x3,...)
			    //needs to be (1,x1,x2,x3,...)
			    var matrixRows = new Array(arguments.length);
			    for(var i=0;i<arguments.length;i++){
			      var array = [1];
			      matrixRows[i]= array.concat(arguments[i]);
			    }
			    return jStat(matrixRows);

			  },

			  builddxmatrix: function builddxmatrix() {
			    //Paramters will be passed in as such
			    //([array1,array2,...]
			    var matrixRows = new Array(arguments[0].length);
			    for(var i=0;i<arguments[0].length;i++){
			      var array = [1];
			      matrixRows[i]= array.concat(arguments[0][i]);
			    }
			    return jStat(matrixRows);

			  },

			  buildjxmatrix: function buildjxmatrix(jMat) {
			    //Builds from jStat Matrix
			    var pass = new Array(jMat.length);
			    for(var i=0;i<jMat.length;i++){
			      pass[i] = jMat[i];
			    }
			    return jStat.builddxmatrix(pass);

			  },

			  buildymatrix: function buildymatrix(array){
			    return jStat(array).transpose();
			  },

			  buildjymatrix: function buildjymatrix(jMat){
			    return jMat.transpose();
			  },

			  matrixmult: function matrixmult(A,B){
			    var i, j, k, result, sum;
			    if (A.cols() == B.rows()) {
			      if(B.rows()>1){
			        result = [];
			        for (i = 0; i < A.rows(); i++) {
			          result[i] = [];
			          for (j = 0; j < B.cols(); j++) {
			            sum = 0;
			            for (k = 0; k < A.cols(); k++) {
			              sum += A.toArray()[i][k] * B.toArray()[k][j];
			            }
			            result[i][j] = sum;
			          }
			        }
			        return jStat(result);
			      }
			      result = [];
			      for (i = 0; i < A.rows(); i++) {
			        result[i] = [];
			        for (j = 0; j < B.cols(); j++) {
			          sum = 0;
			          for (k = 0; k < A.cols(); k++) {
			            sum += A.toArray()[i][k] * B.toArray()[j];
			          }
			          result[i][j] = sum;
			        }
			      }
			      return jStat(result);
			    }
			  },

			  //regress and regresst to be fixed

			  regress: function regress(jMatX,jMatY){
			    //print("regressin!");
			    //print(jMatX.toArray());
			    var innerinv = jStat.xtranspxinv(jMatX);
			    //print(innerinv);
			    var xtransp = jMatX.transpose();
			    var next = jStat.matrixmult(jStat(innerinv),xtransp);
			    return jStat.matrixmult(next,jMatY);

			  },

			  regresst: function regresst(jMatX,jMatY,sides){
			    var beta = jStat.regress(jMatX,jMatY);

			    var compile = {};
			    compile.anova = {};
			    var jMatYBar = jStat.jMatYBar(jMatX, beta);
			    compile.yBar = jMatYBar;
			    var yAverage = jMatY.mean();
			    compile.anova.residuals = jStat.residuals(jMatY, jMatYBar);

			    compile.anova.ssr = jStat.ssr(jMatYBar, yAverage);
			    compile.anova.msr = compile.anova.ssr / (jMatX[0].length - 1);

			    compile.anova.sse = jStat.sse(jMatY, jMatYBar);
			    compile.anova.mse =
			        compile.anova.sse / (jMatY.length - (jMatX[0].length - 1) - 1);

			    compile.anova.sst = jStat.sst(jMatY, yAverage);
			    compile.anova.mst = compile.anova.sst / (jMatY.length - 1);

			    compile.anova.r2 = 1 - (compile.anova.sse / compile.anova.sst);
			    if (compile.anova.r2 < 0) compile.anova.r2 = 0;

			    compile.anova.fratio = compile.anova.msr / compile.anova.mse;
			    compile.anova.pvalue =
			        jStat.anovaftest(compile.anova.fratio,
			                         jMatX[0].length - 1,
			                         jMatY.length - (jMatX[0].length - 1) - 1);

			    compile.anova.rmse = Math.sqrt(compile.anova.mse);

			    compile.anova.r2adj = 1 - (compile.anova.mse / compile.anova.mst);
			    if (compile.anova.r2adj < 0) compile.anova.r2adj = 0;

			    compile.stats = new Array(jMatX[0].length);
			    var covar = jStat.xtranspxinv(jMatX);
			    var sds, ts, ps;

			    for(var i=0; i<beta.length;i++){
			      sds=Math.sqrt(compile.anova.mse * Math.abs(covar[i][i]));
			      ts= Math.abs(beta[i] / sds);
			      ps= jStat.ttest(ts, jMatY.length - jMatX[0].length - 1, sides);

			      compile.stats[i]=[beta[i], sds, ts, ps];
			    }

			    compile.regress = beta;
			    return compile;
			  },

			  xtranspx: function xtranspx(jMatX){
			    return jStat.matrixmult(jMatX.transpose(),jMatX);
			  },


			  xtranspxinv: function xtranspxinv(jMatX){
			    var inner = jStat.matrixmult(jMatX.transpose(),jMatX);
			    var innerinv = jStat.inv(inner);
			    return innerinv;
			  },

			  jMatYBar: function jMatYBar(jMatX, beta) {
			    var yBar = jStat.matrixmult(jMatX, beta);
			    return new jStat(yBar);
			  },

			  residuals: function residuals(jMatY, jMatYBar) {
			    return jStat.matrixsubtract(jMatY, jMatYBar);
			  },

			  ssr: function ssr(jMatYBar, yAverage) {
			    var ssr = 0;
			    for(var i = 0; i < jMatYBar.length; i++) {
			      ssr += Math.pow(jMatYBar[i] - yAverage, 2);
			    }
			    return ssr;
			  },

			  sse: function sse(jMatY, jMatYBar) {
			    var sse = 0;
			    for(var i = 0; i < jMatY.length; i++) {
			      sse += Math.pow(jMatY[i] - jMatYBar[i], 2);
			    }
			    return sse;
			  },

			  sst: function sst(jMatY, yAverage) {
			    var sst = 0;
			    for(var i = 0; i < jMatY.length; i++) {
			      sst += Math.pow(jMatY[i] - yAverage, 2);
			    }
			    return sst;
			  },

			  matrixsubtract: function matrixsubtract(A,B){
			    var ans = new Array(A.length);
			    for(var i=0;i<A.length;i++){
			      ans[i] = new Array(A[i].length);
			      for(var j=0;j<A[i].length;j++){
			        ans[i][j]=A[i][j]-B[i][j];
			      }
			    }
			    return jStat(ans);
			  }
			});
			  // Make it compatible with previous version.
			  jStat.jStat = jStat;

			  return jStat;
			}); 
		} (jstat$1));
		return jstat$1.exports;
	}

	var jstatExports = requireJstat();

	// @ts-ignore
	class LuckyModel {
	    constructor(times, dropRate, minCount, maxCount) {
	        this.times = times;
	        this.dropRate = dropRate;
	        this.minCount = minCount;
	        this.maxCount = maxCount;
	    }
	    getCountOfLucky(lucky) {
	        return this.getCountOfLuckyRange([lucky])[0];
	    }
	}
	function luckyModelFactory(times, dropRate, minCount, maxCount) {
	    if (dropRate > (1 - 1e-9)) {
	        // Special case for dropRate = 1
	        if (minCount === maxCount) {
	            return new AlwaysDropFixed(times, minCount);
	        }
	    }
	    if (times >= 20) {
	        if (dropRate <= 0.01 && dropRate * times <= 10) {
	            return new PoissonDistribution(times, dropRate, minCount, maxCount);
	        }
	        else {
	            return new NormalDistribution(times, dropRate, minCount, maxCount);
	        }
	    }
	    if (maxCount >= 100) {
	        return new NormalDistribution(times, dropRate, minCount, maxCount);
	    }
	    else if (maxCount >= 20) {
	        return new DirectCalculate(times, dropRate, Math.round(minCount), Math.round(maxCount));
	    }
	    else {
	        const delegate = new DirectCalculate(times, dropRate, Math.round(minCount * 5), Math.round(maxCount * 5));
	        return new TimesOfCalculate(delegate, 0.2);
	    }
	}
	/**
	 * Use for dropRate = 1 and minCount === maxCount
	 */
	class AlwaysDropFixed extends LuckyModel {
	    constructor(times, count) {
	        super(times, 1, count, count);
	        this.modelMaxValue = count * times;
	        this.modelMinValue = count * times;
	    }
	    getCountOfLucky(lucky) {
	        return this.modelMaxValue;
	    }
	    getCountOfLuckyRange(luckyRange) {
	        return new Array(luckyRange.length).fill(this.modelMaxValue);
	    }
	    getLuckyUntilCount(count) {
	        return count >= this.modelMaxValue ? 1 : 0;
	    }
	}
	/**
	 * Use for large times with large drop rate
	 */
	class NormalDistribution extends LuckyModel {
	    constructor(times, dropRate, minCount, maxCount) {
	        super(times, dropRate, minCount, maxCount);
	        this.mean = (minCount + maxCount) / 2 * dropRate * times;
	        this.std = Math.sqrt(times * (dropRate * Math.pow(maxCount - minCount, 2) / 12 + (dropRate * (1 - dropRate) * Math.pow(maxCount + minCount, 2) / 4)));
	        this.modelMinValue = this.getCountOfLucky(0.001);
	        this.modelMaxValue = this.getCountOfLucky(0.999);
	    }
	    getCountOfLucky(lucky) {
	        return Math.round(jstatExports.normal.inv(lucky, this.mean, this.std));
	    }
	    getCountOfLuckyRange(luckyRange) {
	        return luckyRange.map(l => Math.round(jstatExports.normal.inv(l, this.mean, this.std)));
	    }
	    getLuckyUntilCount(count) {
	        return jstatExports.normal.cdf(count, this.mean, this.std);
	    }
	}
	/**
	 * Use for large times with small drop rate, the final result is only a lower value.
	 */
	class PoissonDistribution extends LuckyModel {
	    constructor(times, dropRate, minCount, maxCount) {
	        super(times, dropRate, minCount, maxCount);
	        this.mean = (minCount + maxCount) / 2 * dropRate * times;
	        this.modelMinValue = 0;
	        // Set to max to avoid getCountOfLucky issue
	        this.modelMaxValue = this.times * this.maxCount;
	        // Shrink to p999
	        this.modelMaxValue = this.getCountOfLucky(0.999);
	    }
	    getCountOfLuckyRange(luckyRange) {
	        const result = new Array(luckyRange.length).fill(this.modelMaxValue);
	        let index = 0;
	        let cdf = 0;
	        for (let i = 0; i < this.modelMaxValue; i++) {
	            cdf += jstatExports.poisson.pdf(i, this.mean);
	            for (; index < luckyRange.length; index++) {
	                if (cdf >= luckyRange[index]) {
	                    result[index] = i;
	                    continue;
	                }
	                break;
	            }
	            if (index === luckyRange.length) {
	                return result;
	            }
	        }
	        return result;
	    }
	    getLuckyUntilCount(count) {
	        return 0;
	    }
	}
	class DirectCalculate extends LuckyModel {
	    constructor(times, dropRate, minCount, maxCount) {
	        super(times, dropRate, minCount, maxCount);
	        this.lazyData = [];
	        this.modelMinValue = 0;
	        this.modelMaxValue = this.times * this.maxCount;
	    }
	    get data() {
	        if (this.lazyData.length === 0) {
	            const unit = this.dropRate * (this.maxCount - this.minCount + 1);
	            let previous = [1];
	            for (let _ = 0; _ < this.times; _++) {
	                // the current is [0, previous.max + maxCount]
	                // previous.max = previous.length - 1
	                // new current length = previous.max + maxCount + 1 = previous.length + maxCount
	                const current = new Array(previous.length + this.maxCount).fill(0);
	                for (let count = 0; count < previous.length; count++) {
	                    // Not dropped
	                    current[count] += previous[count] * (1 - this.dropRate);
	                    for (let j = this.minCount; j <= this.maxCount; j++) {
	                        // Dropped j
	                        current[count + j] += previous[count] * unit;
	                    }
	                }
	                previous = current;
	            }
	            this.lazyData = new Array(previous.length).fill(0);
	            for (let i = 0; i < previous.length; i++) {
	                this.lazyData[i] = sum(previous.slice(0, i + 1));
	            }
	        }
	        return this.lazyData;
	    }
	    getCountOfLuckyRange(luckyRange) {
	        return luckyRange.map(l => {
	            const index = this.data.findIndex(cdf => cdf >= l);
	            return index === -1 ? this.modelMaxValue : index;
	        });
	    }
	    getLuckyUntilCount(count) {
	        return 0;
	    }
	}
	class TimesOfCalculate extends LuckyModel {
	    constructor(delegate, factor) {
	        super(delegate.times, delegate.dropRate, delegate.minCount * factor, delegate.maxCount * factor);
	        this.factor = factor;
	        this.delegate = delegate;
	    }
	    get modelMaxValue() {
	        return this.delegate.modelMaxValue * this.factor;
	    }
	    get modelMinValue() {
	        return this.delegate.modelMinValue * this.factor;
	    }
	    getCountOfLuckyRange(luckyRange) {
	        return this.delegate.getCountOfLuckyRange(luckyRange).map(c => c * this.factor);
	    }
	    getLuckyUntilCount(count) {
	        return this.delegate.getLuckyUntilCount(count / this.factor);
	    }
	}

	var DropType;
	(function (DropType) {
	    /**
	     * Fixed drop.
	     */
	    DropType["Output"] = "output";
	    /**
	     * Normal drop, buffed by Gathering.
	     */
	    DropType["Normal"] = "normal";
	    /**
	     * Essence drop, buffed by EssenceFind.
	     */
	    DropType["Essence"] = "essence";
	    /**
	     * Rare drop, buffed by RareFind.
	     */
	    DropType["Rare"] = "rare";
	    /**
	     * Rare loot, buffed by RareFind. And also has its drop table
	     */
	    DropType["RareLoot"] = "rare-loot";
	})(DropType || (DropType = {}));
	function getActionProfit({ action, hours, mode, lucky, buff }) {
	    var _a, _b, _c, _d, _e;
	    const actionDetails = getClientData().actionDetailMap[action];
	    const basicTimeCost = actionDetails.baseTimeCost / 1e9;
	    const timeCost = basicTimeCost / (1 + buff[NormalBuffType.ActionSpeed].value);
	    const times = hours * 60 * 60 / timeCost * (1 + buff[NormalBuffType.Efficiency].value);
	    const inputs = ((_a = actionDetails.inputItems) !== null && _a !== void 0 ? _a : []).map(input => {
	        const count = input.count * times;
	        const price = getBuyPriceByHrid(input.itemHrid);
	        return ({
	            hrid: input.itemHrid,
	            count,
	            price,
	            cost: count * price,
	        });
	    });
	    const cost = sum(inputs.map(input => input.cost));
	    const outputs = [
	        ...((_b = actionDetails.outputItems) !== null && _b !== void 0 ? _b : []).map(output => {
	            const count = output.count * times;
	            const price = getSellPriceByHrid(output.itemHrid);
	            const drop = {
	                rate: 1,
	                minCount: output.count,
	                maxCount: output.count,
	            };
	            return ({
	                type: DropType.Output,
	                model: luckyModelFactory(times, 1.0, output.count, output.count),
	                hrid: output.itemHrid,
	                count,
	                price,
	                income: count * price,
	                originDrop: drop,
	                buffedDrop: drop,
	            });
	        }),
	        ...getDropIncome(times, mode, lucky, buff, DropType.Normal, (_c = actionDetails.dropTable) !== null && _c !== void 0 ? _c : []),
	        ...getDropIncome(times, mode, lucky, buff, DropType.Essence, (_d = actionDetails.essenceDropTable) !== null && _d !== void 0 ? _d : []),
	        ...getDropIncome(times, mode, lucky, buff, DropType.Rare, (_e = actionDetails.rareDropTable) !== null && _e !== void 0 ? _e : []),
	    ];
	    const income = sum(outputs.map(output => output.income));
	    const profit = income - cost;
	    return {
	        action,
	        baseTimeCost: basicTimeCost,
	        timeCost,
	        times,
	        profit,
	        cost,
	        income,
	        inputs,
	        outputs,
	    };
	}
	function getDropIncome(times, mode, lucky, buff, dropType, drops) {
	    return (drops !== null && drops !== void 0 ? drops : []).map(({ itemHrid, minCount, maxCount, dropRate }) => {
	        let buffedDropRate = dropRate;
	        switch (dropType) {
	            case DropType.Essence:
	                buffedDropRate *= (1 + buff[NormalBuffType.EssenceFind].value);
	                break;
	            case DropType.Rare:
	                buffedDropRate *= (1 + buff[NormalBuffType.RareFind].value);
	                break;
	        }
	        let buffedMinCount = minCount;
	        let buffedMaxCount = maxCount;
	        switch (dropType) {
	            case DropType.Normal:
	                buffedMinCount *= 1 + buff[NormalBuffType.Gathering].value;
	                buffedMaxCount *= 1 + buff[NormalBuffType.Gathering].value;
	                break;
	        }
	        const model = luckyModelFactory(times, buffedDropRate, buffedMinCount, buffedMaxCount);
	        const count = (mode === "avg") ?
	            times * buffedDropRate * (buffedMinCount + buffedMaxCount) / 2 :
	            model.getCountOfLucky(lucky);
	        const open = getOpenableItemDropTable(itemHrid);
	        if (open) {
	            // Ignore self drop
	            const outputs = getDropIncome(count, mode, lucky, buff, DropType.Output, open);
	            return {
	                type: DropType.RareLoot,
	                model,
	                hrid: itemHrid,
	                count,
	                income: sum(outputs.map(output => output.income)),
	                originDrop: {
	                    rate: dropRate,
	                    minCount,
	                    maxCount,
	                },
	                buffedDrop: {
	                    rate: buffedDropRate,
	                    minCount: buffedMinCount,
	                    maxCount: buffedMaxCount,
	                },
	                outputs: outputs.map(output => ({
	                    hrid: output.hrid,
	                    count: output.count,
	                    model: output.model,
	                    price: output.price,
	                    income: output.income,
	                    drop: output.originDrop,
	                }))
	            };
	        }
	        else {
	            const price = getSellPriceByHrid(itemHrid);
	            return {
	                type: dropType,
	                model,
	                hrid: itemHrid,
	                count,
	                price,
	                income: count * price,
	                originDrop: {
	                    rate: dropRate,
	                    minCount,
	                    maxCount,
	                },
	                buffedDrop: {
	                    rate: buffedDropRate,
	                    minCount: buffedMinCount,
	                    maxCount: buffedMaxCount,
	                },
	            };
	        }
	    });
	}

	function ShowBuffByNonCombatActionType({ actionType, data: inputData }) {
	    const data$ = React.useMemo(() => {
	        if (inputData !== undefined) {
	            return of(inputData);
	        }
	        else {
	            return BuffDataStore.data$.pipe(shared_js.m(it => it[actionType]));
	        }
	    }, [inputData, actionType]);
	    const data = useLatestOrDefault(data$, createEmptyBuffData());
	    const buffTypes = (actionType === EnhancingActionType.Enhancing) ?
	        [NormalBuffType.ActionSpeed, EnhancingBuffType.EnhancingSuccess, NormalBuffType.Gathering, NormalBuffType.Wisdom, NormalBuffType.RareFind, NormalBuffType.EssenceFind] :
	        [NormalBuffType.ActionSpeed, NormalBuffType.Efficiency, NormalBuffType.Gathering, NormalBuffType.Wisdom, NormalBuffType.RareFind, NormalBuffType.EssenceFind];
	    return React__namespace.createElement("table", null,
	        React__namespace.createElement("thead", null,
	            React__namespace.createElement("tr", null,
	                React__namespace.createElement("th", { colSpan: 2 }, "Buff Type"),
	                React__namespace.createElement("th", { colSpan: 2 }, "Source"),
	                React__namespace.createElement("th", { colSpan: 2 }, "Info"))),
	        React__namespace.createElement("tbody", null, buffTypes.map((buffType) => React__namespace.createElement(ShowBuffByBuffType, { key: buffType, buffType: buffType, data: data[buffType] }))));
	}
	function ShowBuffByBuffType({ buffType, data }) {
	    if (data.value === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null);
	    }
	    const rows = data[BuffSource.Equipment].equipments.length +
	        (data[BuffSource.MooPass].value ? 1 : 0) +
	        (data[BuffSource.Community].value ? 1 : 0) +
	        (data[BuffSource.House].value ? 1 : 0) +
	        (data[BuffSource.Room].value ? 1 : 0) +
	        data[BuffSource.Tea].slots.length +
	        (data[BuffSource.Level].value ? 1 : 0);
	    const firstType = data[BuffSource.Equipment].value > 0 ? BuffSource.Equipment :
	        data[BuffSource.MooPass].value ? BuffSource.MooPass :
	            data[BuffSource.Community].value ? BuffSource.Community :
	                data[BuffSource.House].value ? BuffSource.House :
	                    data[BuffSource.Room].value ? BuffSource.Room :
	                        data[BuffSource.Tea].value > 0 ? BuffSource.Tea :
	                            data[BuffSource.Level].value > 0 ? BuffSource.Level : BuffSource.Level;
	    const headerColumns = React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement("th", { rowSpan: rows }, getBuffTypeName(buffType)),
	        React__namespace.createElement("th", { rowSpan: rows },
	            React__namespace.createElement(ShowPercent, { value: data.value })));
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement(ShowBuffByBuffSourceEquipment, { data: data[BuffSource.Equipment] }, firstType == BuffSource.Equipment ? headerColumns : React__namespace.createElement(React__namespace.Fragment, null)),
	        React__namespace.createElement(ShowBuffByBuffSourceSimple, { value: data[BuffSource.MooPass].value, buffName: "Moo pass" }, firstType == BuffSource.MooPass ? headerColumns : React__namespace.createElement(React__namespace.Fragment, null)),
	        React__namespace.createElement(ShowBuffByBuffSourceSimple, { value: data[BuffSource.Community].value, buffName: "Community" }, firstType == BuffSource.Community ? headerColumns : React__namespace.createElement(React__namespace.Fragment, null)),
	        React__namespace.createElement(ShowBuffByBuffSourceSimple, { value: data[BuffSource.House].value, buffName: "House" }, firstType == BuffSource.House ? headerColumns : React__namespace.createElement(React__namespace.Fragment, null)),
	        React__namespace.createElement(ShowBuffByBuffSourceSimple, { value: data[BuffSource.Room].value, buffName: "Room" }, firstType == BuffSource.Room ? headerColumns : React__namespace.createElement(React__namespace.Fragment, null)),
	        React__namespace.createElement(ShowBuffByBuffSourceTea, { data: data[BuffSource.Tea] }, firstType == BuffSource.Tea ? headerColumns : React__namespace.createElement(React__namespace.Fragment, null)),
	        React__namespace.createElement(ShowBuffByBuffSourceLevel, { data: data[BuffSource.Level] }, firstType == BuffSource.Level ? headerColumns : React__namespace.createElement(React__namespace.Fragment, null)));
	}
	function ShowBuffByBuffSourceEquipment({ data, children }) {
	    if (data.value === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null);
	    }
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement("tr", null,
	            children,
	            React__namespace.createElement("th", { rowSpan: data.equipments.length }, "Equipment"),
	            React__namespace.createElement("th", { rowSpan: data.equipments.length },
	                React__namespace.createElement(ShowPercent, { value: data.value })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowItem, { hrid: data.equipments[0].equipment.itemHrid, enhancementLevel: data.equipments[0].equipment.enhancementLevel })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowPercent, { value: data.equipments[0].value }))),
	        data.equipments.slice(1).map(({ value, equipment }) => React__namespace.createElement("tr", { key: equipment.location },
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowItem, { hrid: equipment.itemHrid, enhancementLevel: equipment.enhancementLevel })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowPercent, { value: value })))));
	}
	function ShowBuffByBuffSourceSimple({ value, buffName, children }) {
	    if (value === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null);
	    }
	    return React__namespace.createElement("tr", null,
	        children,
	        React__namespace.createElement("th", null, buffName),
	        React__namespace.createElement("th", null,
	            React__namespace.createElement(ShowPercent, { value: value })),
	        React__namespace.createElement("td", { colSpan: 2 }));
	}
	function ShowBuffByBuffSourceTea({ data, children }) {
	    if (data.value === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null);
	    }
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement("tr", null,
	            children,
	            React__namespace.createElement("th", { rowSpan: data.slots.length }, "Tea"),
	            React__namespace.createElement("th", { rowSpan: data.slots.length },
	                React__namespace.createElement(ShowPercent, { value: data.value })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowItem, { hrid: data.slots[0].tea }),
	                "(",
	                data.slots[0].slot,
	                "/3)"),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowPercent, { value: data.slots[0].value }))),
	        data.slots.slice(1).map(({ value, tea, slot }) => React__namespace.createElement("tr", { key: tea },
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowItem, { hrid: tea }),
	                "(",
	                slot,
	                "/3)"),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowPercent, { value: value })))));
	}
	function ShowBuffByBuffSourceLevel({ data, children }) {
	    const { value, level, levelRequirement } = data;
	    if (value === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null);
	    }
	    return React__namespace.createElement("tr", null,
	        children,
	        React__namespace.createElement("th", null, "Level"),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(ShowPercent, { value: value })),
	        React__namespace.createElement("td", { colSpan: 2 },
	            level,
	            "(level) - ",
	            levelRequirement,
	            "(requirement)"));
	}

	function ShowCollectOrManufacturingActions({ actionType, hours, mode, lucky }) {
	    const buffData = useLatestValue(BuffDataStore.data$);
	    const characterData = useLatestValue(shared_js.b);
	    const actions = React.useMemo(() => {
	        if (!buffData || !characterData) {
	            return [];
	        }
	        const actions = Object.values(getClientData().actionDetailMap)
	            .filter(action => action.type === actionType)
	            .map(action => {
	            var _a, _b;
	            const config = {
	                action: action.hrid,
	                hours, mode, lucky,
	                buff: produceLevelData(buffData[actionType], action.levelRequirement.level, (_b = (_a = characterData.characterSkills.find(it => it.skillHrid === action.levelRequirement.skillHrid)) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : 0),
	            };
	            return Object.assign(Object.assign({}, getActionProfit(config)), config);
	        });
	        return actions.sort((a, b) => {
	            return b.profit - a.profit;
	        });
	    }, [actionType, buffData, characterData, hours, mode, lucky]);
	    return React__namespace.createElement("table", null,
	        React__namespace.createElement("thead", null,
	            React__namespace.createElement("tr", null,
	                React__namespace.createElement("th", null, "Name"),
	                React__namespace.createElement("th", null, "Category"),
	                React__namespace.createElement("th", null, "Stat"),
	                React__namespace.createElement("th", null, "Profit"),
	                React__namespace.createElement("th", null, "Input"),
	                React__namespace.createElement("th", null, "Output"),
	                React__namespace.createElement("th", null, "Buff"))),
	        React__namespace.createElement("tbody", null, actions.map(action => React__namespace.createElement("tr", { key: action.action },
	            React__namespace.createElement(ShowCollectOrManufacturingAction, { data: action })))));
	}
	function ShowCollectOrManufacturingAction({ data }) {
	    const { action, baseTimeCost, timeCost, times, cost, income, profit, inputs, outputs, buff, hours } = data;
	    const actionDetails = getClientData().actionDetailMap[action];
	    const actionCategory = getClientData().actionCategoryDetailMap[actionDetails.category];
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        React__namespace.createElement("th", null, actionDetails.name),
	        React__namespace.createElement("th", null, actionCategory.name),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement("div", null,
	                React__namespace.createElement(ShowNumber, { value: baseTimeCost }),
	                " s ",
	                "->",
	                React__namespace.createElement(ShowNumber, { value: timeCost }),
	                " s"),
	            React__namespace.createElement("div", null,
	                React__namespace.createElement("div", null,
	                    React__namespace.createElement(ShowNumber, { value: times }),
	                    " times"),
	                hours !== 1
	                    ? React__namespace.createElement("div", null,
	                        React__namespace.createElement(ShowNumber, { value: times / hours }),
	                        " times/h")
	                    : React__namespace.createElement(React__namespace.Fragment, null))),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(ShowNumber, { value: profit }),
	            hours !== 1
	                ? React__namespace.createElement("div", null,
	                    React__namespace.createElement(ShowNumber, { value: profit / hours }),
	                    " /h")
	                : React__namespace.createElement(React__namespace.Fragment, null)),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(ShowNumber, { value: cost }),
	            React__namespace.createElement(ShowItemInputCost, { inputs: inputs, cost: cost })),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(ShowNumber, { value: income }),
	            React__namespace.createElement(ShowItemDropIncome, { outputs: outputs, income: income })),
	        React__namespace.createElement("td", null,
	            React__namespace.createElement(Expandable, null,
	                React__namespace.createElement(ShowBuffByNonCombatActionType, { actionType: actionDetails.type, data: buff }))));
	}
	function ShowItemInputCost({ inputs, cost: totalCost }) {
	    if (inputs.length === 0) {
	        return null;
	    }
	    return React__namespace.createElement(Expandable, null,
	        React__namespace.createElement("table", null,
	            React__namespace.createElement("thead", null,
	                React__namespace.createElement("tr", null,
	                    React__namespace.createElement("th", null, "Name"),
	                    React__namespace.createElement("th", null, "Count"),
	                    React__namespace.createElement("th", null, "Price"),
	                    React__namespace.createElement("th", null, "Subtotal"),
	                    React__namespace.createElement("th", null, "Radio"))),
	            React__namespace.createElement("tbody", null, inputs.map(({ hrid, count, price, cost }) => React__namespace.createElement("tr", { key: hrid },
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowItem, { hrid: hrid })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: count })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: price })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: cost })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowPercent, { value: cost / totalCost })))))));
	}
	function ShowItemDropIncome({ outputs, income: totalIncome }) {
	    if (outputs.length === 0) {
	        return React__namespace.createElement(React__namespace.Fragment, null);
	    }
	    return React__namespace.createElement(Expandable, null,
	        React__namespace.createElement("table", null,
	            React__namespace.createElement("thead", null,
	                React__namespace.createElement("tr", null,
	                    React__namespace.createElement("th", null, "Name"),
	                    React__namespace.createElement("th", null, "Info"),
	                    React__namespace.createElement("th", null, "Count"),
	                    React__namespace.createElement("th", null, "Price"),
	                    React__namespace.createElement("th", null, "Subtotal"),
	                    React__namespace.createElement("th", null, "Radio"))),
	            React__namespace.createElement("tbody", null, outputs.map((output) => React__namespace.createElement(ShowDropIncome, { key: `${output.type}-${output.hrid}-${output.originDrop.rate}`, output: output, totalIncome: totalIncome })))));
	}
	function ShowDropIncome({ output, totalIncome }) {
	    if (output.type === DropType.RareLoot) {
	        const { hrid, count, income, outputs } = output;
	        return React__namespace.createElement(React__namespace.Fragment, null,
	            React__namespace.createElement("tr", null,
	                React__namespace.createElement("th", null,
	                    React__namespace.createElement(ShowItem, { hrid: hrid })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowDropInfo, { output: output })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: count })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: income / count })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: income })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowPercent, { value: income / totalIncome }))),
	            outputs.map(({ hrid: childHrid, count: childCount, price: childPrice, income: childIncome, drop: childDrop }) => React__namespace.createElement("tr", { key: `${childHrid}-${childDrop.rate}` },
	                React__namespace.createElement("td", null,
	                    "| ",
	                    React__namespace.createElement(ShowItem, { hrid: childHrid })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowChildDropInfo, { drop: childDrop })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: childCount })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: childPrice })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowNumber, { value: childIncome })),
	                React__namespace.createElement("td", null,
	                    React__namespace.createElement(ShowPercent, { value: childIncome / totalIncome })))));
	    }
	    else {
	        const { hrid, count, price, income, enhancementLevel } = output;
	        return React__namespace.createElement("tr", null,
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowItem, { hrid: hrid, enhancementLevel: enhancementLevel })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowDropInfo, { output: output })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: count })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: price })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowNumber, { value: income })),
	            React__namespace.createElement("td", null,
	                React__namespace.createElement(ShowPercent, { value: income / totalIncome })));
	    }
	}
	function ShowDropInfo({ output }) {
	    const { type, originDrop, buffedDrop } = output;
	    const dropInfo = React__namespace.createElement(Expandable, null,
	        React__namespace.createElement("div", null, originDrop.minCount === originDrop.maxCount ?
	            React__namespace.createElement(React__namespace.Fragment, null,
	                React__namespace.createElement(ShowNumber, { value: buffedDrop.minCount }),
	                "(",
	                React__namespace.createElement(ShowNumber, { value: originDrop.minCount }),
	                ")") :
	            React__namespace.createElement(React__namespace.Fragment, null,
	                React__namespace.createElement(ShowNumber, { value: buffedDrop.minCount }),
	                "(",
	                React__namespace.createElement(ShowNumber, { value: originDrop.minCount }),
	                ") -",
	                React__namespace.createElement(ShowNumber, { value: buffedDrop.maxCount }),
	                "(",
	                React__namespace.createElement(ShowNumber, { value: originDrop.maxCount }),
	                ")")),
	        React__namespace.createElement("div", null,
	            React__namespace.createElement(ShowPercent, { value: buffedDrop.rate }),
	            "(",
	            React__namespace.createElement(ShowPercent, { value: originDrop.rate }),
	            ")"));
	    switch (type) {
	        case DropType.Output:
	            return React__namespace.createElement(React__namespace.Fragment, null, "Output");
	        case DropType.Normal:
	            return React__namespace.createElement(React__namespace.Fragment, null,
	                "Output",
	                dropInfo);
	        case DropType.Essence:
	            return React__namespace.createElement(React__namespace.Fragment, null,
	                "Essence",
	                dropInfo);
	        case DropType.Rare:
	        case DropType.RareLoot:
	            return React__namespace.createElement(React__namespace.Fragment, null,
	                "Rare",
	                dropInfo);
	    }
	}
	function ShowChildDropInfo({ drop }) {
	    return React__namespace.createElement(React__namespace.Fragment, null,
	        "Open",
	        React__namespace.createElement(Expandable, null,
	            React__namespace.createElement("div", null, drop.minCount === drop.maxCount ?
	                React__namespace.createElement(React__namespace.Fragment, null,
	                    React__namespace.createElement(ShowNumber, { value: drop.minCount })) :
	                React__namespace.createElement(React__namespace.Fragment, null,
	                    React__namespace.createElement(ShowNumber, { value: drop.minCount }),
	                    " - ",
	                    React__namespace.createElement(ShowNumber, { value: drop.maxCount }))),
	            React__namespace.createElement("div", null,
	                React__namespace.createElement(ShowPercent, { value: drop.rate }))));
	}

	function foragingPlugin() {
	    shared_js.q.subscribe({
	        complete: () => {
	            AddView({
	                id: "profit",
	                name: "Profit",
	                node: React__namespace.createElement(ShowProfit, null)
	            });
	        },
	    });
	}
	const PROFIT_ACTION_SETTING = createStringSelectSetting({ id: "profit.action", name: "Action", defaultValue: CollectActionType.Milking }, [
	    { name: "Milking", value: CollectActionType.Milking },
	    { name: "Foraging", value: CollectActionType.Foraging },
	    { name: "Woodcutting", value: CollectActionType.Woodcutting },
	    { name: "Cheesesmithing", value: ManufacturingActionType.Cheesesmithing },
	    { name: "Crafting", value: ManufacturingActionType.Crafting },
	    { name: "Tailoring", value: ManufacturingActionType.Tailoring },
	    { name: "Cooking", value: ManufacturingActionType.Cooking },
	    { name: "Brewing", value: ManufacturingActionType.Brewing },
	]);
	const DURATION_SETTING = createNumberSetting({ id: "profit.duration-hours", name: "Duration", defaultValue: 1 }, "integer", { min: 1 });
	const PROFIT_MODE_SETTING = createStringSelectSetting({ id: "profit.mode", name: "Profit Mode", defaultValue: "avg" }, [
	    { name: "Average", value: "avg" },
	    { name: "Lucky", value: "lucky" }
	]);
	const LUCKY_SETTING = createNumberSetting({ id: "profit.lucky", name: "Lucky", defaultValue: 0 }, "float", { min: 0.005, max: 0.995, step: 0.005 });
	function ShowProfit() {
	    const action = useSetting(PROFIT_ACTION_SETTING);
	    const hours = useSetting(DURATION_SETTING);
	    const mode = useSetting(PROFIT_MODE_SETTING);
	    const lucky = useSetting(LUCKY_SETTING);
	    return React__namespace.createElement("div", null,
	        React__namespace.createElement("div", { className: viewStyles["row-group"] },
	            React__namespace.createElement(ShowSettingValue, { setting: PROFIT_ACTION_SETTING }),
	            React__namespace.createElement("span", null,
	                "Duration:",
	                React__namespace.createElement("input", { type: "number", value: hours, style: { width: "5em" }, onChange: e => updateSetting(DURATION_SETTING, e.target.valueAsNumber) }),
	                "hours"),
	            React__namespace.createElement("span", null,
	                "Mode: ",
	                React__namespace.createElement(ShowSettingValue, { setting: PROFIT_MODE_SETTING })),
	            mode === "lucky" ? React__namespace.createElement("span", null,
	                "Lucky:",
	                React__namespace.createElement(ShowPercent, { value: lucky }),
	                React__namespace.createElement("input", { type: "range", value: lucky, min: 0.005, max: 0.995, step: 0.005, onChange: e => updateSetting(LUCKY_SETTING, e.target.valueAsNumber) })) : React__namespace.createElement(React__namespace.Fragment, null)),
	        React__namespace.createElement(ShowBuffByNonCombatActionType, { actionType: action }),
	        React__namespace.createElement(ShowCollectOrManufacturingActions, { actionType: action, hours: hours, mode: mode, lucky: lucky }));
	}

	setupEngineHook();
	window.addEventListener("load", () => {
	    createApp({ id: "mwi-app-container", name: "Milky Way Idle Helper" });
	});
	setupMarketData().catch((e) => {
	    console.error({ "log-event": "init-failed" }, e);
	}).finally(() => {
	});
	foragingPlugin();
	lootTrackerPlugin();
	actionStatPlugin();
	inventoryChangesPlugin();
	priceChangePlugin();
	assetPlugin();

})(REACT, REACT_DOM_CLIENT, REACT_DOM, MWI_SHARED, RECHARTS);
}
main();

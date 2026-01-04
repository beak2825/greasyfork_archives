// ==UserScript==
// @name         WK Load Faster
// @namespace    est_fills_cando
// @version      0.5
// @description  Brings the loading screen down more quickly, removing the mandatory 1.8 second delay.
// @author       est_fills_cando
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/lesson/start
// @match        https://www.wanikani.com/lesson/session
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448047/WK%20Load%20Faster.user.js
// @updateURL https://update.greasyfork.org/scripts/448047/WK%20Load%20Faster.meta.js
// ==/UserScript==

///
/// Speeding up jQuery, jStorage, the loading screen, and keyboard navigation
///
(function() {
    'use strict';

    function main() {
        window.waitProperty(window, 'jQuery', proxy_jquery);
        waitProperty(window, 'jQuery', function (jQuery) {
            waitProperty(jQuery, 'jStorage', replace_jstorage);
        });
        window.waitProperty(window, 'jQuery', function(jQuery) { jQuery(keydownNavigation) });
    }

    // WK doesn't make the loading screen removal method global in lessons for some reason
    // so we patch jQuery with a proxy that lets us modify the behavior of the method in
    // both lessons/reviews by detecting its calls to jQuery and modifying the behavior of jQuery
    // to do what we want
    // We also patch several other jQuery methods to give faster speed.
    async function proxy_jquery() {
        let pt = window.jQuery.prototype;

        // returns true if given jQuery object is the loading screen
        function is_loading_screen(jqobj) {
            return jqobj.length == 1 && ['loading-screen','loading'].includes(jqobj.get(0).id);
        }

        // don't artifically delay things relayed to the loading screen
        const old_delay = pt.delay;
        pt.delay = function() {
            if (is_loading_screen(this))
                return this;
            else
                return old_delay.call(this,...arguments);
        }

        // hide the loading screen immediately when it is no longer needed instead of a
        // gradual fade and don't waste time trying to fade it out again if we have already
        // hidden it
        const old_fadeOut = pt.fadeOut;
        let alreadyHidden = false;
        pt.fadeOut = function() {
            if (is_loading_screen(this)) {
                if (!alreadyHidden) {
                    this.hide();
                    alreadyHidden = true;
                }
                return this;
            } else {
                return old_fadeOut.call(this,...arguments);
            }
        }

        // disable this type of animated scrolling because usualy animated scrolling is triggered
        // by other things and this is invoked even when there is no need to scroll wasting time
        const old_animate = pt.animate;
        pt.animate = function(properties) {
            let names = Object.getOwnPropertyNames(properties);
            if (names.length === 1 && names[0] == 'scrollTop' && properties[names[0]] == 0)
                return this;
            else
                return old_animate.call(this, ...arguments);
        }

        // cache visibility of certain elements to avoid making the browser figure it out
        const visCache = new Map();
        const vItems = Object.freeze(['information', 'last-items', 'item-info']);
        for (let item of vItems) {
            visCache.set(item, false);
        }
        function updateVisCache(jqobjs, vis) {
            for (let el of jqobjs) {
                if (vItems.includes(el.id))
                    visCache.set(el.id, vis);
            }
        }

        const old_is = pt.is;
        pt.is = function(selector) {
            if (selector === ':visible' && this.length === 1 && vItems.includes(this.get(0).id)) {
                let c = visCache.get(this.get(0).id) && visCache.get('information');
                //if (old_is.call(this, ...arguments) !== c) throw 'bad cache';
                return c;
            } else {
                return old_is.call(this, ...arguments);
            }
        }

        const old_hide = pt.hide;
        pt.hide = function() {
            updateVisCache(this, false);
            return old_hide.call(this, ...arguments);
        }

        const old_show = pt.show;
        pt.show = function() {
            updateVisCache(this, true);
            return old_show.call(this, ...arguments);
        }


        // setting innerHTML is slightly faster if we check for non-html content
        // and set that using textContent
        const textOnly = /^[^<>"'&]*$/u;
        let old_html = pt.html;
        pt.html = function (html) {
            const t = typeof html;
            if (t === 'number' || t === 'string' && html.match(textOnly)) {
                this.each( function () { this.textContent = html; } );
            } else {
                return old_html.call(this,...arguments);
            }
        };
    }

    function keydownNavigation() {
        if (window.location.pathname.startsWith('/lesson')) {
            function keyDownToUp(options) {
                let alreadySent = false;
                let start = null;
                document.addEventListener('keydown', function(evt) {
                    if (evt.key == options.key && !alreadySent && evt.target.tagName.toLowerCase() != 'input') {
                        alreadySent = true;

                        let fakeEvt = new KeyboardEvent('keyup',options);
                        fakeEvt.wklkd_fakeevt = true;
                        document.querySelector('#next-btn').dispatchEvent(fakeEvt);
                    }
                }, true);

                document.body.addEventListener('keyup', function(evt) {
                    if (evt.key == options.key && !evt.wklkd_fakeevt && alreadySent) {
                        alreadySent = false;
                        evt.stopPropagation();
                        evt.preventDefault();
                        return false;
                    }
                }, true);
            }

            keyDownToUp({'key':'Enter', code: 'Enter', which:13, location: 0, keyCode:13, bubbles:true});
            keyDownToUp({'key':'ArrowLeft', code: 'ArrowLeft', which:37, location: 0, keyCode:37, bubbles:true});
            keyDownToUp({'key':'ArrowRight', code: 'ArrowRight', which:39, location: 0, keyCode:39, bubbles:true});
            keyDownToUp({'key':'a', code: 'Keya', which:65, location: 0, keyCode:65, bubbles:true});
            keyDownToUp({'key':'d', code: 'Keyd', which:68, location: 0, keyCode:68, bubbles:true});
            keyDownToUp({'key':'j', code: 'Keyj', which:74, location: 0, keyCode:74, bubbles:true});
            keyDownToUp({'key':'q', code: 'Keyq', which:81, location: 0, keyCode:81, bubbles:true});
            keyDownToUp({'key':'g', code: 'Keyg', which:71, location: 0, keyCode:71, bubbles:true});
        }
    }

    // helper method for waiting for a property to be defined on an element
    // callback is called synchronously immediately after the property is defined
    if (!window.waitProperty) {
        let objPropCallbacks = new Map();
        window.waitProperty = function (obj, prop, callback) {
            if (obj[prop] !== undefined) {
                callback(obj[prop]);
                return;
            }
            if (!objPropCallbacks.has(obj))
                objPropCallbacks.set(obj, new Map());
            let propCallbacks = objPropCallbacks.get(obj);

            let callbacks;
            if (!propCallbacks.has(prop)) {
                propCallbacks.set(prop, []);

                function runCallbacks(val) {
                    for (let callback of callbacks) {
                        callback(val);
                    }
                }

                let _val;
                Object.defineProperty(obj, prop, {
                    get: () => _val,
                    set: function(val) {_val = val; delete obj[prop]; obj[prop] = val; runCallbacks(val); callbacks.length = 0;},
                    configurable: true,
                    enumerable: true
                });
            }
            callbacks = propCallbacks.get(prop);
            callbacks.push(callback);
        }
    }

    ///
    /// Speed up jStorage by replacing it with a much faster version.
    ///
    function jStorage(localOnly, debugOptions) {
        'use strict';

        const realWindow = window;
        return function () { // IEF because we need to declare local window after accessing global
            let window;
            if (!debugOptions) {
                debugOptions = {};
            }
            if (debugOptions.window) {
                window = debugOptions.window;
            } else {
                window = realWindow;
            }

            const jStorage = {}; // the main jStorage object that exposes the API, shadows function name above
            const callbacks = {}; // callbacks for event listeners
            const backend = window.sessionStorage; // where the data ultimately gets stored
            const name = 'sessionStorage';
            const persistent = true; // whether backend is persistent
            const cache = {}; // in memory read cache / complete representation of the stored data
            let timeout = null; // timeout handle of timeout used to delete keys that have expired due to ttl
            let soonestExpiration = Infinity; // soonest expiration time of any key

            jStorage.version = 'lazyshallow-0.5.0';

            jStorage.storageAvailable = function () {return persistent};

            jStorage.currentBackend = function () {return name};

            jStorage.storageSize = function () {
                return JSON.stringify(jStorage._getOldFormat()).length;
            };

            jStorage.reInit = function () {
                if (backend.jStorage) {
                    const obj = JSON.parse(backend.jStorage);
                    const expiration = obj.__jstorage_meta.TTL;
                    delete obj.__jstorage_meta;
                    for (let key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            const exp = expiration[key];
                            cache[key] = [obj[key], exp ? exp : 0];
                            this._scheduleCleanup(key, exp, true);
                            // should not and does not fire observers
                        }
                    }
                }
            };

            jStorage.get = function (key, def) {
                this._checkKey(key);
                if (cache.hasOwnProperty(key)) {
                    if (typeof cache[key][0] === 'object' && !Object.isExtensible(cache[key][0])) {
                        cache[key][0] = deepcopy(cache[key][0]);
                    }
                    const val = cache[key][0];
                    return val === undefined ? null : val;
                }
                return typeof(def) == 'undefined' ? null : def;
            };

            jStorage.getTTL = function (key) {
                this._checkKey(key);
                if (cache.hasOwnProperty(key)) {
                    const ttl = cache[key][1];
                    if (ttl) {
                        return ttl - (+new Date());
                    } else {
                        return 0;
                    }
                }
                return 0;
            };

            jStorage.deleteKey = function (key) {
                this._checkKey(key);
                if (cache.hasOwnProperty(key)) {
                    delete cache[key];
                    this._fireObservers(key, 'deleted');
                    return true;
                }
                return false;
            };

            jStorage.flush = function () {
                for (let key in cache) {
                    if (cache.hasOwnProperty(key)) {
                        this.deleteKey(key);
                    }
                }
                return true;
            };

            jStorage.index = function() {
                return Object.getOwnPropertyNames(cache);
            };

            jStorage.listenKeyChange = function (key, callback) {
                if (key !== '*') {
                    this._checkKey(key);
                }
                if (!callbacks[key]) {
                    callbacks[key] = [];
                }
                callbacks[key].push(callback);
            };

            jStorage.stopListening = function (key, callback) {
                if (key !== '*') {
                    this._checkKey(key);
                }
                if (!callback) {
                    delete callbacks[key];
                } else {
                    if (callbacks[key]) {
                        callbacks[key] = callbacks[key].filter(function (cb) { return cb !== callback });
                    }
                }
            };

            jStorage.set = function (key, val, options) {
                if (!options) {
                    options = {};
                }
                this._checkKey(key);
                if (val === null || val === undefined) {
                    this.deleteKey(key);
                    return val;
                } else {
                    cache[key] = [val, 0];
                    this.setTTL(key, options.TTL || 0);
                    this._fireObservers(key, 'updated');
                    return val;
                }
            };

            jStorage.setTTL = function (key, ttl) {
                this._checkKey(key);
                if (cache.hasOwnProperty(key)) {
                    if (ttl && ttl > 0 ) {
                        cache[key][1] = ttl + (+new Date());
                    } else {
                        cache[key][1] = 0;
                    }
                    this._scheduleCleanup(key, cache[key][1], false);
                    return true;
                }
                return false;
            };

            jStorage.noConflict = function(saveInGlobal) {
                delete window.$.jStorage;
                if (saveInGlobal) {
                    window.jStorage = this;
                }
                return this;
            };

            // dispatches event to listeners registered with listenKeyChange
            jStorage._fireObservers = function (keys, type) {
                keys = [].concat(keys || []);
                for (let i=0; i<keys.length; i++) {
                    const key = keys[i];
                    const matchingCallbacks = (callbacks[key] || []).concat(callbacks['*'] || []);
                    for (let j=0; j<matchingCallbacks.length; j++) {
                        matchingCallbacks[j](key, type, cache[key]);
                    }
                }
            };

            // verify key is a valid key
            jStorage._checkKey = function (key) {
                if (typeof key != 'string' && typeof key != 'number') {
                    throw new TypeError('Key name must be string or numeric');
                } else if (key === '*') {
                    throw new TypeError('keyname/wildcard selector not allowed');
                } else if (key === '__jStorage_meta') {
                    throw new TypeError('Reserved key name');
                }
                return true;
            };

            // schedules or reschedules the next TTL cleanup taking into account
            // the given expiration timestamp
            // If synchronous is true, the item will be cleaned up immediately if it
            // has already expired as of the start of the call.
            jStorage._scheduleCleanup = function(key, expiration, synchronous) {
                if (expiration === 0) {
                    return;
                } else if (synchronous && expiration < +new Date()) {
                    this.deleteKey(key);
                } else if (expiration < soonestExpiration) {
                    soonestExpiration = expiration;
                    clearTimeout(timeout);
                    if (soonestExpiration < Infinity) {
                        setTimeout(_cleanupTTL, soonestExpiration - (+new Date()));
                    }
                }
            }

            // delete everything with expired ttl and schedule this to be called
            // again at the soonest expiration time of the remaining elements
            jStorage._cleanupTTL = function () {
                if (+new Date() > soonestExpiration) {
                    for (let key in cache) {
                        if (this.getTTL(key) < 0 && cache.hasOwnProperty(key)) {
                            this.deleteKey(key);
                        }
                    }

                    let newSoonest = Infinity
                    for (let key in cache) {
                        if (cache.hasOwnProperty(key) && cache[key][1] !== 0 && cache[key][1] < newSoonest) {
                            newSoonest = cache[key][1];
                        }
                    }
                    soonestExpiration = newSoonest;
                }
                if (soonestExpiration < Infinity) {
                    timeout = setTimeout(_cleanupTTL, soonestExpiration - (+new Date()) );
                }
            };

            jStorage._getAll  = function() {
                const obj = {};
                for (let key in cache) {
                    if (cache.hasOwnProperty(key)) {
                        obj[key] = cache[key][0];
                    }
                }
                return obj;
            };

            jStorage._getExpirations  = function() {
                const expirations = {};
                for (let key in cache) {
                    if (cache[key][1] !== 0) {
                        expirations[key] = cache[key][1];
                    }
                }
                return expirations;
            };

            jStorage._getOldFormat = function () {
                const oldFormat = Object.assign( jStorage._getAll(), {"__jstorage_meta":{"CRC32":{}}});
                oldFormat.__jstorage_meta.TTL = jStorage._getExpirations();
                return oldFormat;
            }


            const deepcopy = function (obj) {
                const t = typeof obj;
                if (obj === undefined || obj === null || t === 'string' || t === 'number' || t === 'boolean') {
                    return obj;
                } else if (typeof obj === 'object' && obj.toJSON === undefined) {
                    if (Array.isArray(obj)) {
                        const len = obj.length;
                        const newArr = new Array(len);
                        for (let i = 0; i < len; i++) {
                            newArr[i] = deepcopy(obj[i]);
                        }
                        return newArr;
                    } else {
                        const newObj = {};
                        for (let key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                newObj[key] = deepcopy(obj[key]);
                            }
                        }
                        return newObj;
                    }
                }
                throw 'bad deep copy';
            };

            if (!String.prototype.startsWith) {
                Object.defineProperty(String.prototype, 'startsWith', {value: function(search, rawPos) {
                    const pos = rawPos > 0 ? rawPos|0 : 0;
                    return this.substring(pos, pos + search.length) === search;
                }});
            }

            if (!Object.assign) {
                Object.assign = function (target, source) {
                    for (let prop in source) {
                        if (source.hasOwnProperty(prop)) {
                            target[prop] = source[prop]
                        }
                    }
                    return target;
                }
            }

            if (typeof JSTORAGE_DEBUG_EXTENSIONS !== 'undefined' ) {
                JSTORAGE_DEBUG_EXTENSIONS(jStorage, debugOptions);
            }

            const _cleanupTTL = jStorage._cleanupTTL.bind(jStorage);

            // save changes back in format old jStorage can read
            window.document.addEventListener('visibilitychange', function() {
                backend.jStorage = JSON.stringify(jStorage._getOldFormat());
            });

            jStorage.reInit();

            if (!localOnly) {
                realWindow.$.jStorage = jStorage;
            }
            // cleanup scope
            if (!realWindow.JSTORAGE_DEBUG && realWindow.jStorage === jStorage) {
                delete realWindow.jStorage;
            }
            return jStorage;
        }();
    }

    ///
    /// Code for replacing jStorage after the old version has already loaded
    ///
    function replace_jstorage() {
        let observers = getObservers(true); // get copy of observers already registered to old jStorage and clear them from old jStorage

        let js = jStorage(true);

        // clear cache from old jStorage
        $.jStorage.flush();

        // replace existing reference to old jStorage with new jStorage
        let oldJStorage = Object.assign({}, $.jStorage);
        Object.assign($.jStorage, js);

        // add event listeners to new jStorage
        for (let key of Object.getOwnPropertyNames(observers)) {
            for (let callback of observers[key]) {
                js.listenKeyChange(key, callback);
            }
        }

        $.jStorage = js;
    }

    // exploit fact that _observers.hasOwnProperty gets called during event firing for 'flushed' events
    // by temporarily monkeypatching hasOwnProperty in the prototype of all objects
    function getObservers(clear) {
        let obj = {};
        let oldF = obj.__proto__.hasOwnProperty;
        let _observers;
        $.jStorage.listenKeyChange('wk-lazy-jstorage-dummy', function () {});
        $.jStorage.set('wk-lazy-jstorage-dummy', 1);
        let oldData = sessionStorage.jStorage;
        let observersCopy;
        obj.__proto__.hasOwnProperty = function() {
            _observers = this;
            observersCopy = Object.assign({}, _observers);
            // clear observers registered with old jStorage
            for (let key in _observers)
                if (oldF.call(_observers,key))
                    delete _observers[key];
            return oldF.call(this);
        };
        $.jStorage.flush();
        obj.__proto__.hasOwnProperty = oldF;
        sessionStorage.jStorage = oldData;
        delete observersCopy['wk-lazy-jstorage-dummy'];
        $.jStorage.reInit();
        $.jStorage.deleteKey('wk-lazy-jstorage-dummy');
        if (!clear)
            Object.assign(_observers, observersCopy);
        return observersCopy;
    }

    main();
})();

// ==UserScript==
// @name         Improved-Everything-Hook
// @namespace    https://example.com/improved-everything-hook/
// @version      1.0.0
// @description  A robust and modular script to hook JavaScript methods and AJAX requests
// @author       Enhanced by xAI
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545579/Improved-Everything-Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/545579/Improved-Everything-Hook.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Utility module for common operations
     * @module Utils
     */
    const Utils = {
        /**
         * Checks if a value is a function
         * @param {*} func - Value to check
         * @returns {boolean}
         */
        isFunction: (func) => typeof func === 'function',

        /**
         * Checks if a value is an object and not null
         * @param {*} obj - Value to check
         * @returns {boolean}
         */
        isExistObject: (obj) => obj !== null && typeof obj === 'object',

        /**
         * Checks if a value is an array
         * @param {*} arr - Value to check
         * @returns {boolean}
         */
        isArray: (arr) => Array.isArray(arr),

        /**
         * Executes an array of methods with given arguments
         * @param {Object} context - Execution context
         * @param {Array<Function>} methods - Methods to execute
         * @param {Array} args - Arguments to pass
         * @returns {*} Last non-null result
         */
        invokeMethods: (context, methods, args) => {
            if (!Utils.isArray(methods)) return null;
            let result = null;
            methods.forEach(method => {
                if (Utils.isFunction(method)) {
                    try {
                        const r = method.apply(context, args);
                        if (r !== null && r !== undefined) result = r;
                    } catch (e) {
                        console.warn(`Error executing method: ${e.message}`);
                    }
                }
            });
            return result;
        },

        /**
         * URL utility for parsing and matching URLs
         */
        UrlUtils: {
            /**
             * Tests if a URL matches a pattern
             * @param {string} url - URL to test
             * @param {string} pattern - Regex pattern
             * @returns {boolean}
             */
            urlMatching: (url, pattern) => new RegExp(pattern).test(url),

            /**
             * Gets URL without query parameters
             * @param {string} url - Full URL
             * @returns {string}
             */
            getUrlWithoutParam: (url) => url.split('?')[0],

            /**
             * Merges URL with parameters
             * @param {string} url - Base URL
             * @param {Array<{key: string, value: string}>} params - Parameters
             * @returns {string}
             */
            mergeUrlAndParams: (url, params) => {
                if (!Utils.isArray(params)) return url;
                const paramStr = params
                    .filter(p => p.key && p.value)
                    .map(p => `${p.key}=${p.value}`)
                    .join('&');
                return paramStr ? `${url}?${paramStr}` : url;
            }
        }
    };

    /**
     * Core hooking class
     * @class EHook
     */
    class EHook {
        constructor() {
            this._autoId = 1;
            this._hookedMap = new Map();
            this._hookedContextMap = new Map();
        }

        /**
         * Generates a unique ID
         * @returns {string}
         */
        _getAutoStrId() {
            return `__auto__${this._autoId++}`;
        }

        /**
         * Gets or creates a hook ID for a context
         * @param {Object} context - Context object
         * @returns {string}
         */
        _getHookedId(context) {
            for (const [id, ctx] of this._hookedContextMap) {
                if (ctx === context) return id;
            }
            const id = this._getAutoStrId();
            this._hookedContextMap.set(id, context);
            return id;
        }

        /**
         * Gets or creates a method map for a context
         * @param {Object} context - Context object
         * @returns {Map}
         */
        _getHookedMethodMap(context) {
            const id = this._getHookedId(context);
            if (!this._hookedMap.has(id)) {
                this._hookedMap.set(id, new Map());
            }
            return this._hookedMap.get(id);
        }

        /**
         * Gets or creates a hook task for a method
         * @param {Object} context - Context object
         * @param {string} methodName - Method name
         * @returns {Object}
         */
        _getHookedMethodTask(context, methodName) {
            const methodMap = this._getHookedMethodMap(context);
            if (!methodMap.has(methodName)) {
                methodMap.set(methodName, {
                    original: undefined,
                    replace: undefined,
                    task: { before: [], current: undefined, after: [] }
                });
            }
            return methodMap.get(methodName);
        }

        /**
         * Hooks a method with custom logic
         * @param {Object} parent - Object containing the method
         * @param {string} methodName - Method name
         * @param {Object} config - Hook configuration
         * @returns {number} Hook ID or -1 on failure
         */
        hook(parent, methodName, config = {}) {
            const context = config.context || parent;
            if (!parent[methodName]) {
                parent[methodName] = () => {};
            }
            if (!Utils.isFunction(parent[methodName])) {
                return -1;
            }

            const methodTask = this._getHookedMethodTask(parent, methodName);
            const id = this._autoId++;
            let hooked = false;

            if (Utils.isFunction(config.replace)) {
                methodTask.replace = { id, method: config.replace };
                hooked = true;
            }
            if (Utils.isFunction(config.before)) {
                methodTask.task.before.push({ id, method: config.before });
                hooked = true;
            }
            if (Utils.isFunction(config.current)) {
                methodTask.task.current = { id, method: config.current };
                hooked = true;
            }
            if (Utils.isFunction(config.after)) {
                methodTask.task.after.push({ id, method: config.after });
                hooked = true;
            }

            if (hooked) {
                this._hook(parent, methodName, context);
                return id;
            }
            return -1;
        }

        /**
         * Replaces a method with a hooked version
         * @private
         */
        _hook(parent, methodName, context) {
            const methodTask = this._getHookedMethodTask(parent, methodName);
            if (!methodTask.original) {
                methodTask.original = parent[methodName];
            }

            if (methodTask.replace && Utils.isFunction(methodTask.replace.method)) {
                parent[methodName] = methodTask.replace.method(methodTask.original);
                return;
            }

            const hookedMethod = (...args) => {
                let result;
                try {
                    // Execute before hooks
                    Utils.invokeMethods(context, methodTask.task.before, [methodTask.original, args]);

                    // Execute current or original method
                    if (methodTask.task.current && Utils.isFunction(methodTask.task.current.method)) {
                        result = methodTask.task.current.method.call(context, parent, methodTask.original, args);
                    } else {
                        result = methodTask.original.apply(context, args);
                    }

                    // Execute after hooks
                    const afterArgs = [methodTask.original, args, result];
                    const afterResult = Utils.invokeMethods(context, methodTask.task.after, afterArgs);
                    return afterResult !== null ? afterResult : result;
                } catch (e) {
                    console.error(`Error in hooked method ${methodName}: ${e.message}`);
                    return methodTask.original.apply(context, args);
                }
            };

            // Preserve original method properties
            Object.defineProperties(hookedMethod, {
                toString: {
                    value: methodTask.original.toString.bind(methodTask.original),
                    configurable: false,
                    enumerable: false
                }
            });
            hookedMethod.prototype = methodTask.original.prototype;
            parent[methodName] = hookedMethod;
        }

        /**
         * Hooks AJAX requests
         * @param {Object} methods - Methods to hook (e.g., open, send, onreadystatechange)
         * @returns {number} Hook ID
         */
        hookAjax(methods) {
            if (this.isHooked(window, 'XMLHttpRequest')) {
                return -1;
            }

            return this.hookReplace(window, 'XMLHttpRequest', (OriginalXMLHttpRequest) => {
                class HookedXMLHttpRequest {
                    constructor() {
                        this.xhr = new OriginalXMLHttpRequest();
                        this.xhr.xhr = this; // Reference to outer xhr
                        for (const prop in this.xhr) {
                            if (Utils.isFunction(this.xhr[prop])) {
                                this[prop] = (...args) => {
                                    if (Utils.isFunction(methods[prop])) {
                                        this.hookBefore(this.xhr, prop, methods[prop]);
                                    }
                                    return this.xhr[prop].apply(this.xhr, args);
                                };
                            } else {
                                Object.defineProperty(this, prop, {
                                    get: () => this[prop + '_'] || this.xhr[prop],
                                    set: (value) => {
                                        if (prop.startsWith('on') && Utils.isFunction(methods[prop])) {
                                            this.hookBefore(this.xhr, prop, methods[prop]);
                                            this.xhr[prop] = (...args) => value.apply(this.xhr, args);
                                        } else {
                                            this[prop + '_'] = value;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                return HookedXMLHttpRequest;
            });
        }

        /**
         * Replaces a method entirely
         * @param {Object} parent - Parent object
         * @param {string} methodName - Method name
         * @param {Function} replace - Replacement function
         * @param {Object} [context] - Execution context
         * @returns {number} Hook ID
         */
        hookReplace(parent, methodName, replace, context) {
            return this.hook(parent, methodName, { replace, context });
        }

        /**
         * Hooks a method to run before the original
         * @param {Object} parent - Parent object
         * @param {string} methodName - Method name
         * @param {Function} before - Function to run before
         * @param {Object} [context] - Execution context
         * @returns {number} Hook ID
         */
        hookBefore(parent, methodName, before, context) {
            return this.hook(parent, methodName, { before, context });
        }

        /**
         * Checks if a method is hooked
         * @param {Object} context - Context object
         * @param {string} methodName - Method name
         * @returns {boolean}
         */
        isHooked(context, methodName) {
            const methodMap = this._getHookedMethodMap(context);
            return methodMap.has(methodName) && !!methodMap.get(methodName).original;
        }

        /**
         * Unhooks a method
         * @param {Object} context - Context object
         * @param {string} methodName - Method name
         * @param {boolean} [isDeeply=false] - Whether to remove all hooks
         * @param {number} [eqId] - Specific hook ID to remove
         */
        unHook(context, methodName, isDeeply = false, eqId) {
            if (!context[methodName] || !Utils.isFunction(context[methodName])) return;

            const methodMap = this._getHookedMethodMap(context);
            const methodTask = methodMap.get(methodName);

            if (eqId && this.unHookById(eqId)) return;

            if (methodTask?.original) {
                context[methodName] = methodTask.original;
                if (isDeeply) methodMap.delete(methodName);
            }
        }

        /**
         * Unhooks by ID
         * @param {number} eqId - Hook ID
         * @returns {boolean} Whether a hook was removed
         */
        unHookById(eqId) {
            let hasEq = false;
            for (const [_, methodMap] of this._hookedMap) {
                for (const [_, task] of methodMap) {
                    task.task.before = task.task.before.filter(b => {
                        if (b.id === eqId) hasEq = true;
                        return b.id !== eqId;
                    });
                    task.task.after = task.task.after.filter(a => {
                        if (a.id === eqId) hasEq = true;
                        return a.id !== eqId;
                    });
                    if (task.task.current?.id === eqId) {
                        task.task.current = undefined;
                        hasEq = true;
                    }
                    if (task.replace?.id === eqId) {
                        task.replace = undefined;
                        hasEq = true;
                    }
                }
            }
            return hasEq;
        }
    }

    /**
     * AJAX-specific hooking class
     * @class AHook
     */
    class AHook {
        constructor() {
            this.isHooked = false;
            this._urlDispatcherList = [];
            this._autoId = 1;
            this.eHook = new EHook();
        }

        /**
         * Registers an AJAX URL interceptor
         * @param {string} urlPatcher - URL pattern to match
         * @param {Object|Function} configOrRequest - Configuration or request hook
         * @param {Function} [response] - Response hook
         * @returns {number} Registration ID
         */
        register(urlPatcher, configOrRequest, response) {
            if (!urlPatcher) return -1;

            const config = {};
            if (Utils.isFunction(configOrRequest)) {
                config.hookRequest = configOrRequest;
            } else if (Utils.isExistObject(configOrRequest)) {
                Object.assign(config, configOrRequest);
            }
            if (Utils.isFunction(response)) {
                config.hookResponse = response;
            }

            if (!Object.keys(config).length) return -1;

            const id = this._autoId++;
            this._urlDispatcherList.push({ id, patcher: urlPatcher, config });

            if (!this.isHooked) {
                this.startHook();
            }
            return id;
        }

        /**
         * Starts AJAX hooking
         */
        startHook() {
            const methods = {
                open: (xhr, args) => {
                    const [method, fullUrl, async] = args;
                    const url = Utils.UrlUtils.getUrlWithoutParam(fullUrl);
                    xhr.patcherList = this._urlPatcher(url);
                    xhr.openArgs = { method, url, async };
                    Utils.invokeMethods(xhr, xhr.patcherList.map(p => p.config.hookRequest), [xhr.openArgs]);
                    args[1] = Utils.UrlUtils.mergeUrlAndParams(xhr.openArgs.url, xhr.openArgs.params);
                },
                onreadystatechange: (xhr, args) => {
                    if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                        this._onResponse(xhr, args);
                    }
                },
                onload: (xhr, args) => this._onResponse(xhr, args)
            };

            this.___hookedId = this.eHook.hookAjax(methods);
            this.isHooked = true;
        }

        /**
         * Matches URL against registered patchers
         * @private
         */
        _urlPatcher(url) {
            return this._urlDispatcherList.filter(p => Utils.UrlUtils.urlMatching(url, p.patcher));
        }

        /**
         * Handles response hooks
         * @private
         */
        _onResponse(xhr, args) {
            const results = Utils.invokeMethods(xhr, xhr.patcherList.map(p => p.config.hookResponse), args);
            const lastResult = results?.find(r => r !== null && r !== undefined);
            if (lastResult) {
                xhr.responseText_ = xhr.response_ = lastResult;
            }
        }
    }

    // Expose to global scope
    window.eHook = new EHook();
    window.aHook = new AHook();

    /**
     * Example usage:
     * window.eHook.hook(window, 'alert', {
     *   before: (original, args) => console.log('Before alert:', args),
     *   after: (original, args, result) => console.log('After alert:', result)
     * });
     *
     * window.aHook.register('https://example.com/api/.*', {
     *   hookRequest: (args) => console.log('Request:', args),
     *   hookResponse: (xhr, args) => console.log('Response:', xhr.responseText)
     * });
     */
})();
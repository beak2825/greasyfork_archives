// ==UserScript==
// @name          USToolkit
// @namespace     https://greasyfork.org/pt-BR/users/821661
// @version       0.0.8a
// @run-at        document-start
// @match         https://*/*
// @author        hdyzen
// @description   simple toolkit to create userscripts (alpha)
// @license       MIT
// ==/UserScript==

/**
 * Some functions are strongly inspired by:
 * github.com/violentmonkey/
 * github.com/gorhill/uBlock/
 *
 */

(() => {
    /**
     * Sets up a MutationObserver to watch for DOM changes and executes a callback function.
     * @param {function(MutationRecord[]): (boolean|void)} func The callback function to execute on mutation.
     * It receives an array of MutationRecord objects. If the function returns `true`, the observer is disconnected.
     * @param {MutationObserverInit} [options={ childList: true, subtree: true }] The options object for the MutationObserver.
     * @param {Node} [scope=document] The target node to observe.
     * @returns {MutationObserver} The created MutationObserver instance.
     */
    function observe(func, options = { childList: true, subtree: true }, scope = document) {
        const observer = new MutationObserver((mut) => {
            const shouldDisconnect = func(mut);

            if (shouldDisconnect === true) {
                observer.disconnect();
            }
        });

        observer.observe(scope, options);

        return observer;
    }

    class OnElements {
        #rules = new Map();
        #observedRoots = new WeakSet();
        #combinedSelector = "";
        #originalAttachShadow = unsafeWindow.Element.prototype.attachShadow;
        #isObserving = false;
        #activeObservers = new Set();
        #observerOptions = { childList: true, subtree: true, attributes: true };
        #deep;
        #root;

        constructor({ root = document, deep = false, observeOptions } = {}) {
            this.#root = root;
            this.#deep = deep;
            this.#observerOptions = observeOptions || this.#observerOptions;
        }

        add(selector, callback) {
            if (!this.#rules.has(selector)) {
                this.#rules.set(selector, new Set());
            }
            this.#rules.get(selector).add(callback);
            this.#updateCombinedSelector();
            return this;
        }

        once(selector, callback) {
            const onceFn = (element) => {
                callback(element);
                this.remove(selector, callback);
            };

            this.add(selector, onceFn);
            return this;
        }

        per(selector, callback) {
            const executedElements = new WeakSet();

            const perElementFn = (element) => {
                if (executedElements.has(element)) return;

                callback(element);
                executedElements.add(element);
            };

            this.add(selector, perElementFn);
            return this;
        }

        remove(selector, callback) {
            if (!this.#rules.has(selector)) return;

            if (!callback) {
                this.#rules.delete(selector);
                this.#updateCombinedSelector();
                return;
            }

            const rule = this.#rules.get(selector);
            rule.delete(callback);
            if (rule.size === 0) {
                this.#rules.delete(selector);
            }
            this.#updateCombinedSelector();
            return this;
        }

        start() {
            if (this.#isObserving) return;
            if (this.#deep === true) this.#patchAttachShadow();
            if (this.#deep === true) this.#observerExistentShadows();

            this.#observe(this.#root);

            this.#isObserving = true;
        }

        stop() {
            if (!this.#isObserving) return;

            this.#activeObservers.forEach((observer) => {
                observer.disconnect();
            });
            this.#activeObservers.clear();

            unsafeWindow.Element.prototype.attachShadow = this.#originalAttachShadow;

            this.#isObserving = false;
        }

        #observe(root) {
            if (this.#observedRoots.has(root)) {
                return;
            }

            this.#processExistingElements(root);

            const processedInBatch = new Set();
            const processElement = (node) => {
                if (processedInBatch.has(node)) return;

                this.#routeElement(node);
                processedInBatch.add(node);
            };
            const observer = new MutationObserver((mutations) => {
                if (!this.#combinedSelector) return;

                for (const mutation of mutations) {
                    if (mutation.type === "attributes" && this.#combinedSelector && mutation.target.matches(this.#combinedSelector)) {
                        processElement(mutation.target);
                        continue;
                    }

                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (this.#combinedSelector && node.matches(this.#combinedSelector)) {
                            processElement(node);
                        }

                        if (this.#combinedSelector) {
                            node.querySelectorAll(this.#combinedSelector).forEach((el) => {
                                processElement(el);
                            });
                        }
                    }
                }
                processedInBatch.clear();
            });

            observer.observe(root, this.#observerOptions);

            this.#activeObservers.add(observer);
            this.#observedRoots.add(root);
        }

        #processExistingElements(root) {
            if (!this.#combinedSelector) return;

            for (const node of queryAll(root, this.#combinedSelector)) {
                this.#routeElement(node);
            }
        }

        #patchAttachShadow() {
            const self = this;
            unsafeWindow.Element.prototype.attachShadow = function (init) {
                const shadowRoot = self.#originalAttachShadow.call(this, init);
                self.#observe(shadowRoot);
                return shadowRoot;
            };
        }

        #routeElement(element) {
            for (const [selector, callbacks] of this.#rules.entries()) {
                if (!element.matches(selector)) {
                    continue;
                }

                for (const callback of [...callbacks]) {
                    if (callback(element) !== true) {
                        continue;
                    }

                    this.remove(selector, callback);
                }
            }
        }

        #observerExistentShadows() {
            for (const node of queryAll(document, "*")) {
                if (node.shadowRoot) this.#observe(node.shadowRoot);
            }
        }

        #updateCombinedSelector() {
            this.#combinedSelector = [...this.#rules.keys()].join(",");
        }
    }

    /**
     * Registers a callback to be executed when an element matching a selector is added to the DOM.
     * @param {string} selector The CSS selector of the element to watch for.
     * @param {function(Element): void} callback The callback to execute with the found element.
     * @returns {OnElements} The OnElements instance.
     */
    function onElement(selector, callback) {
        const observer = new OnElements({ deep: true });
        observer.add(selector, callback).start();
        return observer;
    }

    /**
     * Returns a generator that iterates over all text nodes in a scope,
     * including those inside Shadow DOMs.
     * @param {Node} [scope=document.body] The root node from which to start the search.
     * @returns {Generator<Text>} A generator that yields text nodes.
     */
    function* getTextNodes(scope = document.body) {
        if (!scope) return;

        for (const element of queryAll(scope, "*")) {
            for (const node of element.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    yield node;
                }
            }
        }
    }

    /**
     * A generator function that finds and yields all shadow roots within the given scope.
     *
     * This function iterates through all elements in the provided scope and checks for the existence of a shadowRoot.
     *
     * @param {Scope} scope The Document, DocumentFragment, or HTMLElement to search within.
     * @yields {ShadowRoot} The found shadow root.
     */
    function* getShadowRoots(scope) {
        for (const element of scope.querySelectorAll("*")) {
            if (element.shadowRoot) {
                yield element.shadowRoot;
            }
        }
    }

    /**
     * A recursive query selector that traverses into Shadow DOMs.
     * @param {Node} scope The root node to start the search from.
     * @param {string} selector The CSS selector to match.
     * @returns {Generator<Element>} A generator that yields matching elements.
     */
    function* queryAll(scope, selector) {
        for (const element of scope.querySelectorAll("*")) {
            if (element.matches(selector)) {
                yield element;
            }

            if (element.shadowRoot) {
                yield* queryAll(element.shadowRoot, selector);
            }
        }
    }

    /**
     * Finds the first element that matches a selector, including inside Shadow DOMs.
     * @param {Node} scope The root node to start the search from.
     * @param {string} selector The CSS selector to match.
     * @returns {Element|null} The first matching element, or null if not found.
     */
    function query(scope, selector) {
        const iterator = queryAll(scope, selector);
        const result = iterator.next();
        return result.done ? null : result.value;
    }

    /**
     * Finds the closest ancestor element that matches a selector, traversing up through Shadow DOMs.
     * @param {Element} element The starting element.
     * @param {string} selector The CSS selector to match against ancestors.
     * @returns {Element|null} The closest matching ancestor, or null.
     */
    function closest(element, selector) {
        let node = element;

        while (node) {
            const found = node.closest(selector);
            if (found) {
                return found;
            }

            const root = node.getRootNode();
            if (root instanceof ShadowRoot) {
                node = root.host;
                continue;
            }

            break;
        }

        return null;
    }

    /**
     * Injects a script into the document head for execution.
     * @param {string} code The JavaScript code to inject.
     */
    function injectScriptInline(code) {
        const script = document.createElement("script");

        if (typeof code === "string") {
            script.textContent = code;
        }

        if (typeof code === "function") {
            script.textContent = code.toString();
        }

        (document.head || document.documentElement).appendChild(script);
        script.remove();

        return true;
    }

    /**
     * Waits for an element that matches a given CSS selector to appear in the DOM.
     * @param {string} selector The CSS selector for the element to wait for.
     * @param {number} [timeout=5000] The maximum time to wait in milliseconds.
     * @returns {Promise<HTMLElement>} A promise that resolves with the found element, or rejects on timeout.
     */
    function waitElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const onEl = new OnElements({ deep: true });
            onEl.once(selector, resolve).start();

            setTimeout(() => {
                onEl.stop();
                reject();
            }, timeout);
        });
    }

    /**
     * Attaches a delegated event listener to a scope.
     * @param {string} events The name of the event (e.g., 'click').
     * @param {string} selector A CSS selector to filter the event target.
     * @param {function(Event): void} callback The event handler function.
     * @param {EventListenerOptions} options Options passed to eventListener.
     * @param {Node} [scope=document] The parent element to attach the listener to.
     */
    function on(events, selector, callback, options, scope = document) {
        const handler = (event) => {
            if (closest(event.target, selector)) callback(event);
        };
        for (const event of events.split(/\s+/)) {
            scope.addEventListener(event, handler, options);
        }

        return () => {
            for (const event of events) {
                scope.removeEventListener(event, handler, options);
            }
        };
    }

    /**
     * Provides a simplified, proxied interface for accessing and modifying
     * Greasemonkey's persistent storage. This function abstracts `GM_getValue`
     * and `GM_setValue`, allowing for direct object and nested property access
     * as if they were in a regular JavaScript object.
     *
     * @returns {Proxy<object>} A proxy object that automatically synchronizes
     * a user's configuration or data with the userscript's storage.
     */
    function storage() {
        const storageRoot = {};

        return createDeepProxy(storageRoot, ({ action, path, prop, value }) => {
            if (action === "set") {
                GM_setValue(prop, value);
                return true;
            }

            if (action === "get") {
                const rootKey = path[0];
                const result = GM_getValue(rootKey, {});

                if (result === undefined) return undefined;
                if (path.length === 1) return result;

                return getNestedValue(result, path.slice(1));
            }
        });
    }

    /**
     * Sets a value in a nested object based on an array path.
     * @param {object} obj The object to modify.
     * @param {string[]} path The path to the property.
     * @param {*} value The value to set.
     */
    function setNestedValue(obj, path, value) {
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
            const p = path[i];
            if (valType(current[p]) !== "object") {
                current[p] = {};
            }
            current = current[p];
        }
        current[path[path.length - 1]] = value;
    }

    /**
     * Gets a value from a nested object based on an array path.
     * @param {object} obj The object to search.
     * @param {string[]} path The path to the property.
     * @returns {*} The value of the nested property or undefined.
     */
    function getNestedValue(obj, path) {
        let current = obj;
        for (const p of path) {
            if (valType(current) !== "object") return undefined;
            if (!Object.hasOwn(current, p)) return undefined;
            current = current[p];
        }
        return current;
    }

    /**
     * Creates a recursive proxy that intercepts property access (get) and modification (set).
     * @param {object} target The initial object to be proxied.
     * @param {function(object): any} callback The callback function to be invoked on interception.
     * @returns {Proxy} The proxied object.
     */
    function createDeepProxy(target, callback) {
        const _createProxy = (currentTarget, currentPath) => {
            return new Proxy(currentTarget, {
                get(obj, prop) {
                    const newPath = [...currentPath, prop];
                    const value = Reflect.get(obj, prop);

                    const result = callback({
                        action: "get",
                        path: newPath,
                        prop,
                        value,
                        valueType: valType(value),
                        target: obj,
                    });

                    if (result !== undefined) {
                        return result;
                    }

                    if (typeof value === "object" && value !== null) {
                        return _createProxy(value, newPath);
                    }

                    return value;
                },
                set(obj, prop, newValue) {
                    const newPath = [...currentPath, prop];

                    const result = callback({
                        action: "set",
                        path: newPath,
                        prop,
                        value: newValue,
                        valueType: valType(newValue),
                        target: obj,
                    });

                    if (result !== undefined) {
                        return result;
                    }

                    return Reflect.set(obj, prop, newValue);
                },
            });
        };

        return _createProxy(target, []);
    }

    /**
     * Safely retrieves a nested property from an object using a string path.
     * Supports special wildcards for arrays ('[]') and objects ('{}' or '*').
     * @param {object} obj The source object.
     * @param {string} chain A dot-separated string for the property path (e.g., 'user.address.street').
     * @returns {*} The value of the nested property, or undefined if not found.
     */
    function safeGet(obj, chain) {
        if (!obj || typeof chain !== "string" || chain === "") {
            return;
        }

        const props = chain.split(".");
        let current = obj;

        for (let i = 0; i < props.length; i++) {
            const prop = props[i];

            if (current === undefined || current === null) {
                break;
            }

            if (prop === "[]") {
                i++;
                current = handleArray(current, props[i]);
                continue;
            }
            if (prop === "{}" || prop === "*") {
                i++;
                current = handleObject(current, props[i]);
                continue;
            }
            if (startsEndsWith(prop, "(", ")")) {
                current = handleFunction(current, prop);
                continue;
            }

            current = current[prop];
        }

        return current;
    }

    /**
     * Safely handles function calls from the property chain.
     * It parses arguments as JSON.
     * @param {function} fn The function to call.
     * @param {string} prop The string containing arguments, e.g., '({"name": "test"})'.
     * @returns {*} The result of the function call.
     */
    function handleFunction(fn, prop) {
        const argString = prop.slice(1, -1).trim().replaceAll("'", '"');
        let args;

        if (argString === "") {
            return fn();
        }

        try {
            args = JSON.parse(`[${argString}]`);
        } catch (err) {
            console.error(`[UST.safeGet] Failed to execute function in property chain "${prop}":`, err);
        }

        return typeof fn === "function" ? fn(...args) : undefined;
    }

    /**
     * Helper for `prop` to handle array wildcards. It maps over an array and extracts a property from each item.
     * @param {Array<object>} arr The array to process.
     * @param {string} nextProp The property to extract from each item.
     * @returns {*} An array of results, or a single result if only one is found.
     */
    function handleArray(arr, nextProp) {
        const results = [];
        for (const item of arr) {
            if (getProp(item, nextProp) !== undefined) {
                results.push(item);
            }
        }

        return results;
    }

    /**
     * Helper for `prop` to handle object wildcards. It maps over an object's values and extracts a property.
     * @param {object} obj The object to process.
     * @param {string} nextProp The property to extract from each value.
     * @returns {*} An array of results, or a single result if only one is found.
     */
    function handleObject(obj, nextProp) {
        const keys = Object.keys(obj);
        const results = [];
        for (const key of keys) {
            if (getProp(obj[key], nextProp) !== undefined) {
                results.push(obj[key]);
            }
        }

        return results;
    }

    /**
     * Safely gets an own property from an object.
     * @param {object} obj The source object.
     * @param {string} prop The property name.
     * @returns {*} The property value or undefined if it doesn't exist.
     */
    function getProp(obj, prop) {
        if (obj && Object.hasOwn(obj, prop)) {
            return obj[prop];
        }

        return;
    }

    /**
     * Checks if a value is a plain JavaScript object.
     * @param {*} val The value to check.
     * @returns {boolean} True if the value is a plain object, otherwise false.
     */
    function isObject(val) {
        return Object.prototype.toString.call(val) === "[object Object]";
    }

    /**
     * Checks if all properties and their values in the targetObject exist and are equal in the referenceObject.
     * @param {Object} referenceObject The object to compare against.
     * @param {Object} targetObject The object whose properties and values are checked for equality.
     * @returns {boolean} Returns true if all properties and values in targetObject are present and equal in referenceObject, otherwise false.
     */
    function checkPropertyEquality(referenceObject, targetObject) {
        const entries = Object.entries(targetObject);

        for (const [prop, value] of entries) {
            if (!Object.hasOwn(referenceObject, prop)) {
                return false;
            }
            if (referenceObject[prop] !== value) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if a value reference exists within a list of values.
     * @param {*} valueReference The value to check for.
     * @param {...*} values The list of values.
     * @returns {boolean} True if the value reference is found, otherwise false.
     */
    function containsValue(valueReference, ...values) {
        for (const value of values) {
            if (valueReference === value) return true;
        }
        return false;
    }

    function startsEndsWith(string, ...searchs) {
        const [startSearch, endSearch] = searchs;
        const firstChar = string[0];
        const lastChar = string[string.length - 1];

        if (endSearch === undefined) {
            return firstChar === startSearch && lastChar === startSearch;
        }

        return firstChar === startSearch && lastChar === endSearch;
    }

    /**
     * Gets a more specific type of a value than `typeof`.
     * @param {*} val The value whose type is to be determined.
     * @returns {string} The type of the value (e.g., 'string', 'array', 'object', 'class', 'null').
     */
    function valType(val) {
        return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
    }

    /**
     * Returns the length or size of the given target based on its type.
     *
     * Supported types:
     * - string: Returns the string's length.
     * - array: Returns the array's length.
     * - object: Returns the number of own enumerable properties.
     * - set: Returns the number of elements in the Set.
     * - map: Returns the number of elements in the Map.
     * - null: Returns 0.
     *
     * @param {*} target - The value whose length or size is to be determined.
     * @returns {number} The length or size of the target.
     * @throws {Error} If the type of target is unsupported.
     */
    function len(target) {
        const type = valType(target);
        const types = {
            string: () => target.length,
            object: () => Object.keys(target).length,
            array: () => target.length,
            set: () => target.size,
            map: () => target.size,
            null: () => 0,
        };

        if (types[type]) {
            return types[type]();
        } else {
            throw new Error(`Unsupported type: ${type}`);
        }
    }

    /**
     * Repeatedly calls a function with a delay until it returns `true`.
     * Uses `requestAnimationFrame` for scheduling.
     * @param {function(): (boolean|void)} func The function to run. The loop stops if it returns `true`.
     * @param {number} [time=250] The delay in milliseconds between executions.
     */
    function update(func, time = 250) {
        const exec = () => {
            if (func() === true) {
                return;
            }

            setTimeout(() => {
                requestAnimationFrame(exec);
            }, time);
        };

        requestAnimationFrame(exec);
    }

    /**
     * Runs a function on every animation frame until the function returns `true`.
     * @param {function(): (boolean|void)} func The function to execute. The loop stops if it returns `true`.
     */
    function loop(func) {
        const exec = () => {
            if (func() === true) {
                return;
            }

            requestAnimationFrame(exec);
        };

        requestAnimationFrame(exec);
    }

    /**
     * Injects a CSS string into the document by adoptedStyleSheets.
     * @param {string} css The CSS text to apply.
     * @returns {HTMLStyleElement} A promise that resolves with the created style element.
     */
    function style(css) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);

        document.adoptedStyleSheets.push(sheet);

        for (const node of queryAll(document, "*")) {
            if (node.shadowRoot) {
                node.shadowRoot.adoptedStyleSheets.push(sheet);
            }
        }
    }

    /**
     * Creates a manager for a dynamic stylesheet, allowing for easy updates.
     * @param {string} id A unique identifier for the stylesheet.
     * @returns {object} An object with methods to manage the stylesheet.
     */
    function createStyleManager(id) {
        const styleElement = document.createElement("style");
        styleElement.id = id;
        document.head.appendChild(styleElement);

        let currentStyle = "";

        return {
            /**
             * Adds or updates the stylesheet content.
             * @param {string} css The CSS string to apply.
             */
            set(css) {
                currentStyle = css;
                styleElement.textContent = currentStyle;
            },

            /**
             * Toggles the stylesheet on or off.
             * @param {boolean} enable If true, the stylesheet is enabled. Otherwise, it is disabled.
             */
            toggle(enable) {
                if (enable) {
                    styleElement.textContent = currentStyle;
                } else {
                    styleElement.textContent = "";
                }
            },

            /**
             * Removes the stylesheet from the DOM.
             */
            remove() {
                styleElement.remove();
            },
        };
    }

    /**
     * Intercepts calls to an object's method using a Proxy, allowing modification of its behavior.
     * @param {object} owner The object that owns the method.
     * @param {string} methodName The name of the method to hook.
     * @param {ProxyHandler<function>} handler The proxy handler to intercept the method call.
     * @returns {function(): void} A function that, when called, reverts the method to its original implementation.
     */
    function hook(owner, methodName, handler) {
        const originalMethod = owner[methodName];
        if (typeof originalMethod !== "function") {
            throw new Error(`[UST.patch] The method “${methodName}” was not found in the object "${owner}".`);
        }

        const proxy = new Proxy(originalMethod, handler);
        owner[methodName] = proxy;

        return () => {
            owner[methodName] = originalMethod;
        };
    }

    /**
     * An object to execute callbacks based on changes in the page URL, useful for Single Page Applications (SPAs).
     */
    const watchUrl = {
        _enabled: false,
        _onUrlRules: [],

        /**
         * Adds a URL pattern and a callback to execute when the URL matches.
         * @param {string|RegExp} pattern The URL pattern to match against. Can be a string or a RegExp.
         * @param {function(): void} func The callback to execute on match.
         */
        add(pattern, func) {
            const isRegex = pattern instanceof RegExp;
            const patternRule = pattern.startsWith("/") ? unsafeWindow.location.origin + pattern : pattern;

            this._onUrlRules.push({ pattern: patternRule, func, isRegex });

            if (this._enabled === false) {
                this._enabled = true;
                this.init();
            }
        },

        /**
         * @private
         * Initializes the URL watching mechanism.
         */
        init() {
            const exec = (currentUrl) => {
                const ruleFound = this._onUrlRules.find((rule) => (rule.isRegex ? rule.pattern.test(currentUrl) : rule.pattern === currentUrl));

                if (ruleFound) {
                    ruleFound.func();
                }
            };

            watchLocation(exec);
        },
    };

    /**
     * Monitors `location.href` for changes and triggers a callback. It handles history API changes (pushState, replaceState)
     * and popstate events, making it suitable for SPAs.
     * @param {function(string): void} callback The function to call with the new URL when a change is detected.
     */
    function watchLocation(callback) {
        let previousUrl = location.href;

        const observer = new MutationObserver(() => checkForChanges());

        observer.observe(unsafeWindow.document, { childList: true, subtree: true });

        const checkForChanges = () => {
            requestAnimationFrame(() => {
                const currentUrl = location.href;
                if (currentUrl !== previousUrl) {
                    previousUrl = currentUrl;
                    callback(currentUrl);
                }
            });
        };

        const historyHandler = {
            apply(target, thisArg, args) {
                const result = Reflect.apply(target, thisArg, args);
                checkForChanges();
                return result;
            },
        };
        hook(history, "pushState", historyHandler);
        hook(history, "replaceState", historyHandler);

        unsafeWindow.addEventListener("popstate", checkForChanges);

        callback(previousUrl);
    }

    /**
     * A promise-based wrapper for the Greasemonkey `GM_xmlhttpRequest` function.
     * @param {object} options The options for the request, matching the `GM_xmlhttpRequest` specification.
     * @returns {Promise<object>} A promise that resolves with the response object on success or rejects on error/timeout.
     */
    function request(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                onload: resolve,
                onerror: reject,
                ontimeout: reject,
                ...options,
            });
        });
    }

    /**
     * Extracts data from an element based on an array of property path definitions.
     * @param {HTMLElement} element The root element to extract properties from.
     * @param {Array<string>} propsArray Array of property definitions, e.g., ["name:innerText", "link:href"].
     * @returns {object} An object containing the extracted data.
     */
    function extractProps(element, propsArray) {
        const data = {};

        for (const propDefinition of propsArray) {
            const [label, valuePath] = propDefinition.split(":");

            if (valuePath) {
                data[label] = safeGet(element, valuePath);
            } else {
                data[label] = safeGet(element, label);
            }
        }
        return data;
    }

    /**
     * @private
     * Handles a string rule in the scrape schema.
     * @param {HTMLElement} container The container element.
     * @param {string} rule The CSS selector for the target element.
     * @returns {string|null} The text content of the found element, or null.
     */
    function _handleStringRule(container, rule) {
        const element = container.querySelector(rule);
        return element ? element.textContent.trim() : null;
    }

    /**
     * @private
     * Handles an array rule in the scrape schema.
     * @param {HTMLElement} container The container element.
     * @param {Array<string>} rule An array where the first item is a sub-selector and the rest are property definitions.
     * @returns {object} The extracted properties from the sub-element.
     */
    function _handleArrayRule(container, rule) {
        const [subSelector, ...propsToGet] = rule;
        if (!subSelector) {
            throw new Error("[UST.scrape] No subselector provided as the first item in the rule");
        }
        const element = container.querySelector(subSelector);
        return extractProps(element, propsToGet);
    }

    const ruleHandlers = {
        string: _handleStringRule,
        array: _handleArrayRule,
    };

    /**
     * @private
     * Determines the type of a scrape rule.
     * @param {*} rule The rule to check.
     * @returns {string} The type of the rule ('string', 'array', or 'unknown').
     */
    function _getRuleType(rule) {
        if (typeof rule === "string") return "string";
        if (Array.isArray(rule)) return "array";
        return "unknown";
    }

    /**
     * @private
     * Processes an object schema for scraping.
     * @param {HTMLElement} container The container element.
     * @param {object} schema The schema object.
     * @returns {object} The scraped data object.
     */
    function _processObjectSchema(container, schema) {
        const item = {};
        for (const key in schema) {
            const rule = schema[key];
            const ruleType = _getRuleType(rule);

            const handler = ruleHandlers[ruleType];
            if (handler) {
                item[key] = handler(container, rule);
                continue;
            }

            console.warn(`[UST.scrape] Rule for key “${key}” has an unsupported type.`);
        }
        return item;
    }

    /**
     * @private
     * Processes a single container element based on the provided schema.
     * @param {HTMLElement} container The container element to process.
     * @param {object|Array<string>} schema The schema to apply.
     * @returns {object} The scraped data.
     */
    function _processContainer(container, schema) {
        if (Array.isArray(schema)) {
            return extractProps(container, schema);
        }

        if (isObject(schema)) {
            return _processObjectSchema(container, schema);
        }

        console.warn("[UST.scrape] Invalid schema format.");
        return {};
    }

    /**
     * Scrapes structured data from the DOM based on a selector and a schema.
     * @param {string} selector CSS selector for the container elements to scrape.
     * @param {object|Array<string>} schema Defines the data to extract from each container.
     * @param {function(HTMLElement, object): void} func A callback for each scraped item, receiving the container element and the extracted data object.
     * @param {Node} [scope=document] The scope within which to search for containers.
     * @returns {Array<object>} An array of the scraped data objects.
     */
    function scrape(selector, schema, func, scope = document) {
        const containers = scope.querySelectorAll(selector);
        const results = [];
        for (const container of containers) {
            const item = _processContainer(container, schema);
            func(container, item);
            results.push(item);
        }
        return results;
    }

    /**
     * Iterates over all elements matching a selector and applies a function to each.
     * @param {string} selector A CSS selector.
     * @param {function(Node): void} func The function to execute for each matching element.
     * @returns {NodeListOf<Element>} The list of nodes found.
     */
    function each(selector, func) {
        const nodes = queryAll(document, selector);
        for (const node of nodes) {
            func(node);
        }
        return nodes;
    }

    /**
     * Chains multiple iterables together into a single sequence.
     * @param {...Iterable} iterables One or more iterable objects (e.g., arrays, sets).
     * @returns {Generator} A generator that yields values from each iterable in order.
     */
    function* chain(...iterables) {
        for (const it of iterables) {
            yield* it;
        }
    }

    /**
     * Creates a debounced version of a function that delays its execution until after a certain time has passed
     * without it being called.
     * @param {function} func The function to debounce.
     * @param {number} delay The debounce delay in milliseconds.
     * @returns {function} The new debounced function.
     */
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Creates a throttled version of a function that only executes once per specified delay.
     * @param {Function} func - The function to throttle.
     * @param {number} delay - The number of milliseconds to wait before allowing the next execution.
     * @returns {Function} A throttled function that invokes `func` at most once every `delay` milliseconds.
     */
    function throttle(func, delay) {
        let lastExecutedTime = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastExecutedTime >= delay) {
                func.apply(this, args);
                lastExecutedTime = now;
            }
        };
    }

    /**
     * Pauses execution for a specified number of milliseconds.
     * @param {number} ms The number of milliseconds to sleep.
     * @returns {Promise<void>} A promise that resolves after the specified time.
     */
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * A simple template engine that extends Map. It replaces `{{placeholder}}` syntax in strings.
     * @extends Map
     */
    class Templates extends Map {
        /**
         * Fills a template with the provided data.
         * @param {*} key The key of the template stored in the map.
         * @param {object} [data={}] An object with key-value pairs to replace placeholders.
         * @returns {string|null} The template string with placeholders filled, or null if the template is not found.
         */
        fill(key, data = {}) {
            const template = super.get(key);
            if (!template) {
                console.warn(`[UST.Templates] Template with key “${key}” not found.`);
                return null;
            }

            return template.replace(/\{\{(\s*\w+\s*)\}\}/g, (match, placeholder) => (Object.hasOwn(data, placeholder) ? data[placeholder] : match));
        }

        /**
         * Renders a template into a DocumentFragment.
         * @param {*} key The key of the template stored in the map.
         * @param {object} [data={}] An object with data to fill the placeholders.
         * @returns {DocumentFragment|null} A document fragment containing the rendered HTML, or null if the template is not found.
         */
        render(key, data = {}) {
            const filledHtml = this.fill(key, data);
            if (filledHtml === null) {
                return null;
            }

            const templateElement = document.createElement("template");
            templateElement.innerHTML = filledHtml;

            return templateElement.content.cloneNode(true);
        }
    }

    /**
     * Factory function to create a new Templates instance.
     * @returns {Templates} A new instance of the Templates class.
     */
    function templates() {
        return new Templates();
    }

    /**
     * A class for creating lazy, chainable operations (map, filter, take) on iterables.
     * Operations are only executed when the sequence is consumed.
     */
    class LazySequence extends Array {
        /**
         * @param {Iterable<any>} iterable The initial iterable.
         */
        constructor(iterable) {
            super();
            this.iterable = iterable;
        }

        /**
         * Creates a new lazy sequence with a mapping function.
         * @param {function(*): *} func The mapping function.
         * @returns {LazySequence} A new LazySequence instance.
         */
        map(func) {
            const self = this;
            return new LazySequence({
                *[Symbol.iterator]() {
                    for (const value of self.iterable) {
                        yield func(value);
                    }
                },
            });
        }

        /**
         * Creates a new lazy sequence with a filtering function.
         * @param {function(*): boolean} func The filtering function.
         * @returns {LazySequence} A new LazySequence instance.
         */
        filter(func) {
            const self = this;
            return new LazySequence({
                *[Symbol.iterator]() {
                    for (const value of self.iterable) {
                        if (func(value)) {
                            yield value;
                        }
                    }
                },
            });
        }

        /**
         * Creates a new lazy sequence that takes only the first n items.
         * @param {number} n The number of items to take.
         * @returns {LazySequence} A new LazySequence instance.
         */
        take(n) {
            const self = this;
            return new LazySequence({
                *[Symbol.iterator]() {
                    let count = 0;
                    for (const value of self.iterable) {
                        if (count >= n) break;
                        yield value;
                        count++;
                    }
                },
            });
        }

        /**
         * Makes the LazySequence itself iterable.
         */
        *[Symbol.iterator]() {
            yield* this.iterable;
        }

        /**
         * Executes all lazy operations and returns the results as an array.
         * @returns {Array<*>} An array containing all values from the processed iterable.
         */
        collect() {
            return [...this.iterable];
        }
    }

    /**
     * Factory function to create a new LazySequence.
     * @param {Iterable<any>} iterable An iterable to wrap.
     * @returns {LazySequence} A new LazySequence instance.
     */
    function lazy(iterable) {
        return new LazySequence(iterable);
    }

    /**
     * Adds an event listener that runs during the capturing phase, allowing you to
     * intercept and manipulate events before they reach normal bubbling listeners.
     *
     * @param {EventTarget} target The element or object (e.g., `window` or `document`)
     * to listen for the event on.
     * @param {string} eventType The type of event to intercept (e.g., 'click', 'keydown').
     * @param {function(Event): void} callback The callback function to execute.
     * @returns {function(): void} A cleanup function to remove the event listener.
     */
    function interceptEvent(target, eventType, callback) {
        target.addEventListener(eventType, callback, true);

        return () => {
            target.removeEventListener(eventType, callback, true);
        };
    }

    /**
     * Creates and configures a new HTML element.
     * This function provides a more declarative way to build complex DOM structures.
     * @param {string} tag The HTML tag for the element to create (e.g., 'div', 'button').
     * @param {object} [options={}] An object containing configuration for the new element.
     * @param {object} [options.props={}] An object with properties to set on the element (e.g., id, className, textContent).
     * @param {object} [options.attrs={}] An object with attributes to set on the element (e.g., 'data-id', 'aria-label').
     * @param {object} [options.on={}] An object with event listeners to attach (e.g., { click: () => console.log('Clicked') }).
     * @param {object} [options.style={}] An object with CSS properties to set on the element (e.g., { backgroundColor: 'blue', color: 'white' }).
     * @param {Array<HTMLElement|string|null|boolean>} [options.children=[]] An array of child elements, strings, or other values to append to the element.
     * @returns {HTMLElement} The created and configured HTML element.
     */
    function createElement(tag, options = {}) {
        const el = document.createElement(tag);

        if (typeof options === "string") {
            el.textContent = options;
            return el;
        }

        const { props = {}, attrs = {}, on = {}, style = {}, children = [] } = options;

        for (const key in props) {
            if (Object.hasOwn(props, key)) {
                el[key] = props[key];
            }
        }

        for (const key in attrs) {
            if (Object.hasOwn(attrs, key)) {
                el.setAttribute(key, attrs[key]);
            }
        }

        for (const event in on) {
            if (Object.hasOwn(on, event)) {
                el.addEventListener(event, on[event]);
            }
        }

        for (const key in style) {
            if (Object.hasOwn(style, key)) {
                el.style[key] = style[key];
            }
        }

        for (const child of children) {
            if (typeof child === "string") {
                el.appendChild(document.createTextNode(child));
            } else {
                el.appendChild(child);
            }
        }

        return el;
    }

    /**
     * Processes an HTML string and provides a structured object for easy access to its elements.
     * @param {string} html The HTML string to be processed.
     * @returns {object} An object with categorized collections of elements and helper methods.
     */
    function accessHTML(html) {
        const template = document.createElement("template");
        template.innerHTML = html;

        const fragment = template.content;
        const nodes = fragment.querySelectorAll("*");

        const elements = {
            ids: new Map(),
            classes: new Map(),
            attributes: new Map(),
            all: [],
        };

        for (const node of nodes) {
            elements.all.push(node);

            if (node.id) {
                elements.ids.set(node.id, node);
            }

            if (node.classList.length > 0) {
                for (const cls of node.classList) {
                    if (!elements.classes.has(cls)) {
                        elements.classes.set(cls, []);
                    }
                    elements.classes.get(cls).push(node);
                }
            }

            for (const attr of node.attributes) {
                const attrName = `[${attr.name}]`;
                if (!elements.attributes.has(attrName)) {
                    elements.attributes.set(attrName, []);
                }
                elements.attributes.get(attrName).push(node);
            }
        }

        const obj = Object.assign(
            {},
            {
                elements,
                getById(id) {
                    return elements.ids.get(id);
                },
                getByClass(elementClass) {
                    return elements.classes.get(elementClass) || [];
                },
                getByAttribute(attribute) {
                    return elements.attributes.get(`[${attribute}]`) || [];
                },
                fragment: template.content,
            },
        );

        return obj;
    }

    /**
     * Creates a DocumentFragment and populates it using a callback.
     * This is useful for building a piece of DOM in memory before attaching it to the live DOM.
     * @param {function(DocumentFragment): void} builderCallback A function that receives a document fragment and can append nodes to it.
     * @returns {DocumentFragment} The populated document fragment.
     */
    function createFromFragment(builderCallback) {
        const fragment = document.createDocumentFragment();
        builderCallback(fragment);
        return fragment;
    }

    /**
     * Creates a DocumentFragment from an HTML string, providing structured access to its elements.
     * @param {string} html The HTML string to be processed.
     * @returns {{fragment: DocumentFragment, elements: Map<string, HTMLElement>}} An object containing the populated DocumentFragment and a map of its elements by ID.
     */
    function createFromHTML(html) {
        const template = document.createElement("template");
        template.innerHTML = html;
        const elements = new Map();
        const fragment = template.content;

        for (const node of fragment.querySelectorAll("[id]")) {
            elements.set(node.id, node);
        }

        return { fragment, elements };
    }

    /**
     * Detaches an element from the DOM, runs a callback to perform modifications, and then re-attaches it.
     * This can improve performance by preventing multiple browser reflows and repaints during manipulation.
     * @param {HTMLElement|string} elementOrSelector The element or its CSS selector.
     * @param {function(HTMLElement): void} callback The function to execute with the detached element.
     */
    function withDetached(elementOrSelector, callback) {
        const element = typeof elementOrSelector === "string" ? document.querySelector(elementOrSelector) : elementOrSelector;

        if (!element || !element.parentElement) return;

        const parent = element.parentElement;
        const nextSibling = element.nextElementSibling;

        parent.removeChild(element);

        try {
            callback(element);
        } finally {
            parent.insertBefore(element, nextSibling);
        }
    }

    /**
     * Gets the currently focused element, traversing into Shadow DOMs.
     * @param {Document} [doc=document] The document to start the search from.
     * @returns {Element|null} The active element or null.
     */
    function getDeepActiveElement(doc = document) {
        let activeElement = doc.activeElement;

        while (activeElement?.shadowRoot?.activeElement) {
            activeElement = activeElement.shadowRoot.activeElement;
        }

        return activeElement;
    }

    /**
     * Gets the element at a specific coordinate, traversing into Shadow DOMs.
     * @param {Document} [doc=document] The document to start the search from.
     * @param {number} x The x-coordinate.
     * @param {number} y The y-coordinate.
     * @returns {Element|null} The element at the coordinates or null.
     */
    function getDeepElementFromPoint(doc = document, x, y) {
        let elementInPoint = doc.elementFromPoint(x, y);

        while (elementInPoint?.shadowRoot?.elementFromPoint) {
            elementInPoint = elementInPoint.shadowRoot.elementFromPoint(x, y);
        }

        return elementInPoint;
    }

    /**
     * Sets the value of an input element and dispatches a native input event.
     * @param {HTMLInputElement} input The input element.
     * @param {*} value The value to set.
     */
    function setInputNativeValue(input, value) {
        const prototype = Object.getPrototypeOf(input);
        const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;

        valueSetter.call(input, value);

        const event = new Event("input", { bubbles: true });
        input.dispatchEvent(event);
    }

    /**
     * Simulates a user typing a string into an input element.
     * @param {HTMLInputElement} inputElement The input element to type into.
     * @param {string} text The string to type.
     */
    function simulateTyping(inputElement, text) {
        let i = 0;
        let currentText = "";

        inputElement.focus();

        while (i < text.length) {
            const char = text[i];
            i++;
            currentText += char;

            const keyDownEvent = new KeyboardEvent("keydown", {
                key: char,
                code: `Key${char.toUpperCase()}`,
                char: char,
                keyCode: char.charCodeAt(0),
                bubbles: true,
            });
            inputElement.dispatchEvent(keyDownEvent);

            const inputEvent = new InputEvent("input", { bubbles: true, data: char, inputType: "insertText", isComposing: false });
            setInputNativeValue(inputElement, currentText);
            inputElement.dispatchEvent(inputEvent);

            const keyUpEvent = new KeyboardEvent("keyup", {
                key: char,
                code: `Key${char.toUpperCase()}`,
                char: char,
                keyCode: char.charCodeAt(0),
                bubbles: true,
            });
            inputElement.dispatchEvent(keyUpEvent);
        }
    }

    /**
     * Registers a global keyboard shortcut (hotkey).
     * @param {string} keys A string representing the key combination (e.g., 'ctrl+shift+s').
     * @param {function(KeyboardEvent): void} callback The function to execute when the hotkey is pressed.
     * @returns {function(): void} A function to unregister the hotkey.
     */
    function createHotkeys(keys, callback) {
        const keyParts = new Set(keys.toLowerCase().split("+"));

        const handler = (event) => {
            const activeElement = getDeepActiveElement();
            if (activeElement && (["INPUT", "TEXTAREA"].includes(activeElement.tagName) || activeElement.isContentEditable === true)) {
                return;
            }

            const pressedKeys = new Set();
            if (event.ctrlKey) pressedKeys.add("ctrl");
            if (event.altKey) pressedKeys.add("alt");
            if (event.shiftKey) pressedKeys.add("shift");
            pressedKeys.add(event.key.toLowerCase());

            const isMatch = [...keyParts].every((key) => pressedKeys.has(key));

            if (isMatch) {
                event.preventDefault();
                callback(event);
            }
        };

        return interceptEvent(window, "keydown", handler);
    }

    window.UST = window.UST || {};

    Object.assign(window.UST, {
        observe,
        OnElements,
        onElement,
        getTextNodes,
        getShadowRoots,
        queryAll,
        query,
        closest,
        injectScriptInline,
        waitElement,
        on,
        storage,
        setNestedValue,
        getNestedValue,
        createDeepProxy,
        safeGet,
        handleArray,
        handleObject,
        checkPropertyEquality,
        getProp,
        isObject,
        containsValue,
        valType,
        len,
        update,
        loop,
        style,
        createStyleManager,
        hook,
        watchUrl,
        watchLocation,
        request,
        extractProps,
        scrape,
        each,
        chain,
        debounce,
        throttle,
        sleep,
        templates,
        lazy,
        interceptEvent,
        createElement,
        accessHTML,
        createFromFragment,
        createFromHTML,
        withDetached,
        getDeepActiveElement,
        getDeepElementFromPoint,
        setInputNativeValue,
        simulateTyping,
        createHotkeys,
    });
})();

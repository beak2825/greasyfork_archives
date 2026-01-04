// ==UserScript==
// @name         wait-for-element
// @description  Provides utility functions to query elements asyncronously that are not yet loaded or available on the page.
// @version      0.1.1
// @namespace    owowed.moe
// @author       owowed <island@owowed.moe>
// @license      LGPL-3.0
// @require      https://update.greasyfork.org/scripts/488160/1335044/make-mutation-observer.js
// ==/UserScript==

/**
 * @typedef WaitForElementOptions Options that modify wait for element functions behavior.
 * @prop {string} [id] Select element by id.
 * @prop {string | string[]} selector Selector that matches target element. If `selector` is `string[]`, then `multiple` option is forced enabled.
 * @prop {ParentNode} [parent] Parent element to start query select from. By default, it will query select from `document`.
 * @prop {AbortSignal} [abortSignal] Abort signal to abort element querying.
 * @prop {boolean} [multiple] Query multiple elements instead of a single one.
 * @prop {number} [timeout] Set timeout for element querying. Reaching timeout will throw `WaitForElementTimeoutError`. If `undefined`, then timeout will be disabled.
 * @prop {number} [maxTries] Set how many attempts function can do element querying. Reaching max tries will throw `WaitForElementMaxTriesError`.
 * @prop {boolean} [ensureDomContentLoaded] Wait for `DOMContentLoad` event before execution, or if event already fired, it will be immediately executed.
 * @prop {MutationObserverInit} [observerOptions] Set options for `MutationObserver` used in wait for element functions.
 * @prop {(elem: HTMLElement) => boolean} [filter] Filter querying element.
 * @prop {(elem: HTMLElement) => HTMLElement} [transform] Transform querying element.
 * @prop {boolean} [throwError] Throw error in certain situation except for not finding an element, instead of returning `null`. By default, its set to `true`.
 */

/**
 * @typedef {Promise<Element[] | Element | null>} WaitForElementReturnValue
 */

class WaitForElementError extends Error {
    name = this.constructor.name;
}
class WaitForElementTimeoutError extends WaitForElementError {}
class WaitForElementMaximumTriesError extends WaitForElementError {}

/**
 * Query element asyncronously until the element is available on the page. This function immediately accepts `parent` as its first parameter. `parent` parameter will specify element to start query select from.
 * @param {NonNullable<WaitForElementOptions["parent"]>} parent 
 * @param {WaitForElementOptions["selector"]} selector 
 * @param {WaitForElementOptions} options 
 * @returns {WaitForElementReturnValue}
 */
function waitForElementByParent(parent, selector, options) {
    return waitForElementOptions({ selector, parent, ...options });
}

/**
 * Query element asyncronously until the element is available on the page. This function immediately accepts `selector` as its first parameter.
 * @param {WaitForElementOptions["selector"]} selector 
 * @param {WaitForElementOptions} options 
 * @returns {WaitForElementReturnValue}
 */
function waitForElement(selector, options) {
    return waitForElementOptions({ selector, ...options });
}

/**
 * Query multiple elements asyncronously until the element is available on the page.
 * @param {WaitForElementOptions["selector"]} selector 
 * @param {WaitForElementOptions} options 
 * @returns {WaitForElementReturnValue}
 */
function waitForElementAll(selectors, options) {
    return waitForElementOptions({ selector: selectors, multiple: true, ...options });
}

/**
 * Query element asyncronously until the element is available on the page. This function immediately accepts `WaitForElementOptions` as its first parameter.
 * @param {WaitForElementOptions} options 
 * @returns {WaitForElementReturnValue}
 */
function waitForElementOptions(
    { id,
        selector,
        parent = document.documentElement,
        abortSignal, // abort controller signal
        multiple = false,
        timeout = 5000,
        maxTries = Infinity,
        ensureDomContentLoaded = true,
        observerOptions = {},
        filter,
        transform,
        throwError } = {}) {
    /**
     * function that apply filter and transform for multiple elements
     * filter will always be applied first before transforming element
     * @param {*} result result of element queries
     */
    function* applyFilterTransform(result) {
        if (filter == undefined && transformFn == undefined) {
            yield result;
            return;
        }
        const filterFn = filter ?? (() => true);
        const transformFn = transform ?? ((x) => x);
        for (const elem of result) {
            if (filterFn(elem)) {
                yield transformFn(elem);
            }
        }
    }

    function queryElement() {
        abortSignal?.throwIfAborted();

        if (id) {
            return document.getElementById(id);
        }
        else if (multiple) {
            if (Array.isArray(selector)) {
                selector = selector.join(", ");
            }
            return Array.from(applyFilterTransform(parent.querySelectorAll(selector)));
        }
        else if (Array.isArray(selector)) {
            multiple = true;
            return queryElement();
        }
        else {
            let result = parent.querySelector(selector);

            if (transform) result = transform(result);
    
            if (filter != undefined && !filter(result)) {
                return null;
            }
    
            return result;
        }
    }

    function waitForElement() {
        const firstResult = queryElement();

        if (firstResult) return firstResult;
        
        return new Promise((resolve, reject) => {
            let timeoutId = null;
            let queryTries = 0;

            const observer = makeMutationObserver(
                parent,
                () => {
                    const result = queryElement(observer);
                    if (result != null && result.length != 0) {
                        cleanup();
                        resolve(result);
                    }
                    else if (queryTries >= maxTries) {
                        cleanup();
                        throwErrorOrNull(new WaitForElementMaximumTriesError(`maximum number of tries (${maxTries}) reached waiting for element "${selector}"`));
                    }
                },
                {
                    childList: true,
                    subtree: true,
                    abortSignal,
                    ...observerOptions
                }
            );
    
            if (timeout != undefined) {
                timeoutId = setTimeout(() => {
                    cleanup();
                    throwErrorOrNull(new WaitForElementTimeoutError(`timeout waiting for element "${selector}"`));
                }, timeout);
            }
    
            abortSignal?.addEventListener("abort", () => {
                cleanup();
                throwErrorOrNull(new DOMException(abortSignal.reason, "AbortError"));
            });

            function cleanup() {
                clearTimeout(timeoutId);
                observer?.disconnect();
            }

            function throwErrorOrNull(error) {
                if (throwError) {
                    reject(error);
                }
                else {
                    resolve(null);
                }
            }
        });
    }

    if (ensureDomContentLoaded && document.readyState == "loading") {
        return new Promise((resolve, reject) => {
            document.addEventListener("DOMContentLoaded", () => {
                waitForElement()
                    .then((result) => resolve(result))
                    .catch((reason) => reject(reason));
            });
        });
    }
    else {
        return waitForElement();
    }
}
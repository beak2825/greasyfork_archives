// ==UserScript==
// @name         ElementGetter1.2.0
// @author       cxxjackie
// @version      1.2.0
// @supportURL   https://bbs.tampermonkey.net.cn/thread-2726-1-1.html
// ==/UserScript==

class ElementGetter {
    #jQuery;
    #window;
    #matches;
    #MutationObs;
    #listeners;
    #addObserver(target, callback) {
        const observer = new this.#MutationObs(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    callback(mutation.target);
                    if (observer.canceled) return;
                }
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) callback(node);
                    if (observer.canceled) return;
                }
            }
        });
        observer.canceled = false;
        observer.observe(target, {childList: true, subtree: true, attributes: true});
        return () => {
            observer.canceled = true;
            observer.disconnect();
        };
    }
    #addFilter(target, filter) {
        let listener = this.#listeners.get(target);
        if (!listener) {
            listener = {
                filters: new Set(),
                remove: this.#addObserver(target, el => {
                    listener.filters.forEach(f => f(el));
                })
            };
            this.#listeners.set(target, listener);
        }
        listener.filters.add(filter);
    }
    #removeFilter(target, filter) {
        const listener = this.#listeners.get(target);
        if (!listener) return;
        listener.filters.delete(filter);
        if (!listener.filters.size) {
            listener.remove();
            this.#listeners.delete(target);
        }
    }
    #query(all, selector, parent, includeParent) {
        const $ = this.#jQuery;
        if ($) {
            let jNodes = includeParent ? $(parent) : $([]);
            jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
            if (all) {
                return $.map(jNodes, el => $(el));
            } else {
                return jNodes.length ? $(jNodes.get(0)) : null;
            }
        } else {
            const checkParent = includeParent && this.#matches.call(parent, selector);
            if (all) {
                const result = checkParent ? [parent] : [];
                result.push(...parent.querySelectorAll(selector));
                return result;
            } else {
                return checkParent ? parent : parent.querySelector(selector);
            }
        }
    }
    #getOne(selector, parent, timeout) {
        return new Promise(resolve => {
            const node = this.#query(false, selector, parent, false);
            if (node) return resolve(node);
            let timer;
            const filter = el => {
                const node = this.#query(false, selector, el, true);
                if (node) {
                    this.#removeFilter(parent, filter);
                    timer && clearTimeout(timer);
                    resolve(node);
                }
            };
            this.#addFilter(parent, filter);
            if (timeout > 0) {
                timer = setTimeout(() => {
                    this.#removeFilter(parent, filter);
                    resolve(null);
                }, timeout);
            }
        });
    }
    #getList(selectorList, parent, timeout) {
        return Promise.all(selectorList.map(selector => this.#getOne(selector, parent, timeout)));
    }
    constructor(jQuery) {
        this.#jQuery = jQuery && jQuery.fn && jQuery.fn.jquery ? jQuery : null;
        this.#window = window.unsafeWindow || document.defaultView || window;
        const elProto = this.#window.Element.prototype;
        this.#matches = elProto.matches
            || elProto.matchesSelector
            || elProto.mozMatchesSelector
            || elProto.oMatchesSelector
            || elProto.webkitMatchesSelector;
        this.#MutationObs = this.#window.MutationObserver
            || this.#window.WebkitMutationObserver
            || this.#window.MozMutationObserver;
        this.#listeners = new WeakMap();
    }
    get(selector, ...args) {
        const parent = typeof args[0] !== 'number' && args.shift() || this.#window.document;
        const timeout = args[0] || 0;
        if (Array.isArray(selector)) {
            return this.#getList(selector, parent, timeout);
        } else {
            return this.#getOne(selector, parent, timeout);
        }
    }
    each(selector, ...args) {
        const parent = typeof args[0] !== 'function' && args.shift() || this.#window.document;
        const callback = args[0];
        const refs = new WeakSet();
        const nodes = this.#query(true, selector, parent, false);
        for (const node of nodes) {
            refs.add(this.#jQuery ? node.get(0) : node);
            if (callback(node, false) === false) return;
        }
        const filter = el => {
            const nodes = this.#query(true, selector, el, true);
            for (const node of nodes) {
                const _el = this.#jQuery ? node.get(0) : node;
                if (!refs.has(_el)) {
                    refs.add(_el);
                    if (callback(node, true) === false) {
                        return this.#removeFilter(parent, filter);
                    }
                }
            }
        };
        this.#addFilter(parent, filter);
    }
    create(domString, parent) {
        const template = this.#window.document.createElement('template');
        template.innerHTML = domString;
        const node = template.content.firstElementChild || template.content.firstChild;
        parent ? parent.appendChild(node) : node.remove();
        return node;
    }
}
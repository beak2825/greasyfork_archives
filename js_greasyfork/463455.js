// ==UserScript==
// @name         NElementGetter
// @author       cxxjackie
// @version      1.2.1
// @supportURL   https://bbs.tampermonkey.net.cn/thread-2726-1-1.html
// ==/UserScript==

var ElementGetter = function() {
    const _jQuery = Symbol('jQuery');
    const _window = Symbol('window');
    const _matches = Symbol('matches');
    const _MutationObs = Symbol('MutationObs');
    const _listeners = Symbol('listeners');
    const _addObserver = Symbol('addObserver');
    const _addFilter = Symbol('addFilter');
    const _removeFilter = Symbol('removeFilter');
    const _query = Symbol('query');
    const _getOne = Symbol('getOne');
    const _getList = Symbol('getList');
    class ElementGetter {
        [_addObserver](target, callback) {
            const observer = new this[_MutationObs](mutations => {
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
        [_addFilter](target, filter) {
            let listener = this[_listeners].get(target);
            if (!listener) {
                listener = {
                    filters: new Set(),
                    remove: this[_addObserver](target, el => {
                        listener.filters.forEach(f => f(el));
                    })
                };
                this[_listeners].set(target, listener);
            }
            listener.filters.add(filter);
        }
        [_removeFilter](target, filter) {
            const listener = this[_listeners].get(target);
            if (!listener) return;
            listener.filters.delete(filter);
            if (!listener.filters.size) {
                listener.remove();
                this[_listeners].delete(target);
            }
        }
        [_query](all, selector, parent, includeParent) {
            const $ = this[_jQuery];
            if ($) {
                let jNodes = includeParent ? $(parent) : $([]);
                jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
                if (all) {
                    return $.map(jNodes, el => $(el));
                } else {
                    return jNodes.length ? $(jNodes.get(0)) : null;
                }
            } else {
                const checkParent = includeParent && this[_matches].call(parent, selector);
                if (all) {
                    const result = checkParent ? [parent] : [];
                    result.push(...parent.querySelectorAll(selector));
                    return result;
                } else {
                    return checkParent ? parent : parent.querySelector(selector);
                }
            }
        }
        [_getOne](selector, parent, timeout) {
            return new Promise(resolve => {
                const node = this[_query](false, selector, parent, false);
                if (node) return resolve(node);
                let timer;
                const filter = el => {
                    const node = this[_query](false, selector, el, true);
                    if (node) {
                        this[_removeFilter](parent, filter);
                        timer && clearTimeout(timer);
                        resolve(node);
                    }
                };
                this[_addFilter](parent, filter);
                if (timeout > 0) {
                    timer = setTimeout(() => {
                        this[_removeFilter](parent, filter);
                        resolve(null);
                    }, timeout);
                }
            });
        }
        [_getList](selectorList, parent, timeout) {
            return Promise.all(selectorList.map(selector => this[_getOne](selector, parent, timeout)));
        }
        constructor(jQuery) {
            this[_jQuery] = jQuery && jQuery.fn && jQuery.fn.jquery ? jQuery : null;
            this[_window] = window.unsafeWindow || document.defaultView || window;
            const elProto = this[_window].Element.prototype;
            this[_matches] = elProto.matches
                || elProto.matchesSelector
                || elProto.mozMatchesSelector
                || elProto.oMatchesSelector
                || elProto.webkitMatchesSelector;
            this[_MutationObs] = this[_window].MutationObserver
                || this[_window].WebkitMutationObserver
                || this[_window].MozMutationObserver;
            this[_listeners] = new WeakMap();
        }
        get(selector, ...args) {
            const parent = typeof args[0] !== 'number' && args.shift() || this[_window].document;
            const timeout = args[0] || 0;
            if (Array.isArray(selector)) {
                return this[_getList](selector, parent, timeout);
            } else {
                return this[_getOne](selector, parent, timeout);
            }
        }
        each(selector, ...args) {
            const parent = typeof args[0] !== 'function' && args.shift() || this[_window].document;
            const callback = args[0];
            const refs = new WeakSet();
            const nodes = this[_query](true, selector, parent, false);
            for (const node of nodes) {
                refs.add(this[_jQuery] ? node.get(0) : node);
                if (callback(node, false) === false) return;
            }
            const filter = el => {
                const nodes = this[_query](true, selector, el, true);
                for (const node of nodes) {
                    const _el = this[_jQuery] ? node.get(0) : node;
                    if (!refs.has(_el)) {
                        refs.add(_el);
                        if (callback(node, true) === false) {
                            return this[_removeFilter](parent, filter);
                        }
                    }
                }
            };
            this[_addFilter](parent, filter);
        }
        create(domString, parent) {
            const template = this[_window].document.createElement('template');
            template.innerHTML = domString;
            const node = template.content.firstElementChild || template.content.firstChild;
            parent ? parent.appendChild(node) : node.remove();
            return node;
        }
    }
    return ElementGetter;
}();
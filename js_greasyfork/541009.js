// ==UserScript==
// @name         YoutubePostsCopy
// @namespace    http://tampermonkey.net/
// @version      2025-06-28
// @description  copy yutube posts
// @author       2402398917
// @match        https://www.youtube.com/*/posts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/541009/YoutubePostsCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/541009/YoutubePostsCopy.meta.js
// ==/UserScript==

var elmGetter = function () {
    const win = window.unsafeWindow || document.defaultView || window;
    const doc = win.document;
    const listeners = new WeakMap();
    let mode = 'css';
    let $;
    const elProto = win.Element.prototype;
    const matches = elProto.matches || elProto.matchesSelector || elProto.webkitMatchesSelector ||
        elProto.mozMatchesSelector || elProto.oMatchesSelector;
    const MutationObs = win.MutationObserver || win.WebkitMutationObserver || win.MozMutationObserver;

    function addObserver(target, callback) {
        const observer = new MutationObs(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    callback(mutation.target, 'attr');
                    if (observer.canceled) return;
                }
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) callback(node, 'insert');
                    if (observer.canceled) return;
                }
            }
        });
        observer.canceled = false;
        observer.observe(target, {childList: true, subtree: true, attributes: true, attributeOldValue: true});
        return () => {
            observer.canceled = true;
            observer.disconnect();
        };
    }

    function addFilter(target, filter) {
        let listener = listeners.get(target);
        if (!listener) {
            listener = {
                filters: new Set(),
                remove: addObserver(target, (el, reason) => listener.filters.forEach(f => f(el, reason)))
            };
            listeners.set(target, listener);
        }
        listener.filters.add(filter);
    }

    function removeFilter(target, filter) {
        const listener = listeners.get(target);
        if (!listener) return;
        listener.filters.delete(filter);
        if (!listener.filters.size) {
            listener.remove();
            listeners.delete(target);
        }
    }

    function query(selector, options = {}) {
        let {
            parent,
            root,
            curMode,
            reason
        } = options;

        switch (curMode) {
            case 'css': {
                if (reason === 'attr') return matches.call(parent, selector) ? parent : null;
                const checkParent = parent !== root && matches.call(parent, selector);
                return checkParent ? parent : parent.querySelector(selector);
            }
            case 'jquery': {
                if (reason === 'attr') return $(parent).is(selector) ? $(parent) : null;
                const jNodes = $(parent !== root ? parent : []).add([...parent.querySelectorAll('*')]).filter(selector);
                return jNodes.length ? $(jNodes.get(0)) : null;
            }
            case 'xpath': {
                const ownerDoc = parent.ownerDocument || parent;
                selector += '/self::*';
                return ownerDoc.evaluate(selector, reason === 'attr' ? root : parent, null, 9, null).singleNodeValue;
            }
        }
    }

    function queryAll(selector, options = {}) {
        let {
            parent,
            root,
            curMode,
            reason
        } = options;

        switch (curMode) {
            case 'css': {
                if (reason === 'attr') return matches.call(parent, selector) ? [parent] : [];
                const checkParent = parent !== root && matches.call(parent, selector);
                const result = parent.querySelectorAll(selector);
                return checkParent ? [parent, ...result] : [...result];
            }
            case 'jquery': {
                if (reason === 'attr') return $(parent).is(selector) ? [$(parent)] : [];
                const jNodes = $(parent !== root ? parent : []).add([...parent.querySelectorAll('*')]).filter(selector);
                return $.map(jNodes, el => $(el));
            }
            case 'xpath': {
                const ownerDoc = parent.ownerDocument || parent;
                selector += '/self::*';
                const xPathResult = ownerDoc.evaluate(selector, reason === 'attr' ? root : parent, null, 7, null);
                const result = [];
                for (let i = 0; i < xPathResult.snapshotLength; i++) {
                    result.push(xPathResult.snapshotItem(i));
                }
                return result;
            }
        }
    }

    function isJquery(jq) {
        return jq && jq.fn && typeof jq.fn.jquery === 'string';
    }

    function getOne(selector, options = {}) {
        let {
            parent,
            timeout,
            onError,
            isPending,
            errEl
        } = options;

        const curMode = mode;
        return new Promise(resolve => {
            const node = query(
                selector,
                {
                    parent: parent,
                    root: parent,
                    curMode
                });

            if (node) return resolve(node);
            let timer;
            const filter = (el, reason) => {
                const node = query(
                    selector,
                    {
                        parent: el,
                        root: parent,
                        curMode,
                        reason
                    });

                if (node) {
                    removeFilter(parent, filter);
                    timer && clearTimeout(timer);
                    resolve(node);
                }
            };
            addFilter(parent, filter);
            if (timeout > 0) {
                timer = setTimeout(() => {
                    removeFilter(parent, filter);
                    onError(selector);
                    if (!isPending) {
                        resolve(errEl);
                    }
                }, timeout);
            }
        });
    }

    let errEl = document.createElement('div');
    errEl.classList.add('no-found');
    errEl.remove = () => {};

    return {
        timeout: 0,
        onError:  (selector) => {console.warn(`[elmGetter] [get失败] selector为: ${selector} 的查询超时`)},
        isPending: true,
        errEl,
        get currentSelector() {
            return mode;
        },
        /**
         * 异步的 querySelector
         * @param selector
         * @param options 一个对象
         *  - parent 父元素, 默认值是 document
         *  - timeout 设置 get 的超时时间, 默认值是 elmGetter.timeout, 其值默认为 0
         *      - 如果该值为 0, 表示永不超时, 如果 selector 有误, 返回的 Promise 将永远 pending
         *      - 如果该值不为 0, 表示等待多少毫秒, 和 setTimeout 单位一致
         *  - onError 超时后的失败回调, 参数为 selector, 默认值为 elmGetter.onError, 其默认行为是 console.warn 打印 selector
         *  - isPending 超时后 Promise 是否仍然保持 pending, 默认值为 elmGetter.isPending, 其值默认为 true
         *  - errEl 超时后 Promise 返回的值, 需要 isPending 为 false 才能有效, 默认值为 elmGetter.errorEl, 其值默认为一个 class 为一个 class 为 no-found 的元素
         * @returns {Promise<Awaited<unknown>[]>|Promise<unknown>}
         */
        get(selector, options = {}) {
            let {
                parent = doc,
                timeout = this.timeout,
                onError = this.onError,
                isPending = this.isPending,
                errEl = this.errEl,
            } = options;

            options.parent = parent;
            options.timeout = timeout;
            options.onError = onError;
            options.isPending = isPending;
            options.errEl = errEl;

            if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);

            if (Array.isArray(selector)) {
                return Promise.all(selector.map(s => getOne(s, options)));
            }
            return getOne(selector, options);
        },
        /**
         * 为父节点设置监听，所有符合选择器的元素（包括页面已有的和新插入的）都将被传给回调函数处理，
         * each方法适用于各种滚动加载的列表（如评论区），或者发生非刷新跳转的页面等
         * @param selector
         * @param callback 回调函数, 只在每个元素上触发一次。 回调函数接收2个参数，第一个是符合选择器的元素，第二个表明该元素是否为新插入的（已有为false，插入为true）
         * @param options 一个对象
         *  - parent 父元素, 默认值是 document
         */
        each(selector, callback, options = {}) {
            let {
                parent = doc,
            } = options;

            if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);

            const curMode = mode;
            const refs = new WeakSet();
            for (const node of queryAll(selector, {parent, root: parent, curMode})) {
                refs.add(curMode === 'jquery' ? node.get(0) : node);
                if (callback(node, false) === false) return;
            }
            const filter = (el, reason) => {
                for (const node of queryAll(selector, {parent:el, root:parent, curMode, reason})) {
                    const _el = curMode === 'jquery' ? node.get(0) : node;
                    if (refs.has(_el)) break;
                    refs.add(_el);
                    if (callback(node, true) === false) {
                        return removeFilter(parent, filter);
                    }
                }
            };
            addFilter(parent, filter);
        },
        /**
         * 将html字符串解析为元素
         * @param domString
         * @param options 一个对象
         *  - returnList 布尔值，是否返回以 id 作为索引的元素列表, 默认值为 false
         *  - parent 父节点，将创建的元素添加到父节点末尾处, 如果不指定, 解析后的元素将
         * @returns {Element|{}|null} 元素或对象，取决于returnList参数
         */
        create(domString, options = {}) {
            let {
                returnList = false,
                parent = null
            } = options;
            const template = doc.createElement('template');
            template.innerHTML = domString;
            const node = template.content.firstElementChild;
            if (!node) return null;
            parent ? parent.appendChild(node) : node.remove();
            if (returnList) {
                const list = {};
                node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
                list[0] = node;
                return list;
            }
            return node;
        },
        selector(desc) {
            switch (true) {
                case isJquery(desc):
                    $ = desc;
                    return mode = 'jquery';
                case !desc || typeof desc.toLowerCase !== 'function':
                    return mode = 'css';
                case desc.toLowerCase() === 'jquery':
                    for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
                        if (isJquery(jq)) {
                            $ = jq;
                            break;
                        }
                    }
                    return mode = $ ? 'jquery' : 'css';
                case desc.toLowerCase() === 'xpath':
                    return mode = 'xpath';
                default:
                    return mode = 'css';
            }
        }
    };
}();

(function() {
    'use strict';

    elmGetter.each('ytd-backstage-post-thread-renderer', (el) => {
        let text = el.querySelector('#content-text').innerText;

        let buttonEl = document.createElement('button');

        buttonEl.innerText = "copy";

        buttonEl.onclick = async () => {
            const result = await cornCopyText(text);

            const showText = "success";

            if (!result) {
                showText = "fail";
            }

            buttonEl.innerText = showText;

            setTimeout(() => {
                buttonEl.innerText = "copy";
            }, 1000);
        }

        let toolbarEl = el.querySelector('#toolbar');

        toolbarEl.appendChild(buttonEl);
    });
})();

async function cornCopyText(text) {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch (err) {
    return false;
  }
}
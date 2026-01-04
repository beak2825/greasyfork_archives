// ==UserScript==
// @name         Nikaple's debug script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371230/Nikaple%27s%20debug%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/371230/Nikaple%27s%20debug%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // A collection of debug scripts.
    const autoFillKey = '___NIKAPLE_AUTO_FILL___';
    const autoFillStoreAll = JSON.parse(localStorage.getItem(autoFillKey) || '{}');
    const autoFillStore = autoFillStoreAll[location.hostname + location.pathname] || {};
    const REPORT_KEYS = JSON.parse(
        `{"1":"logip","2":"seq","3":"qquin","4":"askedqquin","5":"logtype","6":"tradetime","7":"resultcode","8":"resultinfo","9":"errorcode","10":"errorinfo","11":"errorcode2","12":"errorinfo2","13":"pid","14":"timeused","15":"userip","16":"paychannel","17":"channel","18":"subchannel","19":"servicecode","20":"action","21":"iformat","22":"external_ref_id","23":"quantity","24":"offerid","25":"offermedia","26":"offerplatform","27":"openplatform","28":"amount","29":"transactionid","30":"appname","31":"device","32":"mpruleid","33":"giftid","34":"succmode","35":"aerr","36":"requrl","37":"firstreq","38":"tokentime","39":"disturbmode","40":"amttype","41":"amtunit","42":"jumpto","43":"isbatch","44":"goodsid","45":"goodsprice","46":"goodsnum","47":"buytype","48":"qdqbbalance","49":"cftbalance","50":"setid","51":"costcoin","52":"swapamt","53":"vipflags","54":"paylevel","55":"goldblc","56":"token"}`
    );
    const util = {
        /**
         * 解析以冒号分隔的多行文本
         *
         * @param {string} str
         * @returns {map}
         */
        parseMultiline(str, delimiter = ':') {
            return str
                .split('\n')
                .map(s => {
                    if (s.startsWith(delimiter)) {
                        const arr = s.substr(1).split(new RegExp(`${delimiter}(.+)`));
                        arr[0] = delimiter + arr[0];
                        return arr;
                    }
                    return s.split(new RegExp(`${delimiter}(.+)`));
                })
                .reduce((obj, [k, v]) => {
                    obj.set(k, v);
                    return obj;
                }, new Map());
        },
        parseUrlParams(urlLike) {
            let searchParams;
            try {
                searchParams = new Map(new URL(urlLike).searchParams);
            } catch (_) {
                searchParams = new Map(new URLSearchParams(urlLike));
            }
            if (searchParams.has('record0')) {
                searchParams.set(
                    'record0',
                    searchParams
                        .get('record0')
                        .split('|')
                        .map(entries => {
                            const [k, v] = entries.split('=');
                            return [REPORT_KEYS[k], v];
                        })
                        .reduce((obj, [k, v]) => {
                            obj[k] = decodeURIComponent(v);
                            return obj;
                        }, {})
                );
            }
            return searchParams;
        },
        render(input, { format, ...options }) {
            if (this.isIterable(input)) {
                const obj = window.___.map.toObject(input);
                if (format === 'markdown' || format === 'md') {
                    let mdStr = `| ${options.name} | Value |\n| --------- | ----- |\n`;
                    for (const [key, value] of input) {
                        mdStr += `| ${key} | ${value} |\n`;
                    }
                    return mdStr.trim();
                }
                if (format === 'obj' || format === 'object') {
                    return obj;
                }
                if (format === 'json') {
                    return JSON.stringify(obj, null, options.indent || 2);
                }
                if (format === 'console') {
                    console.table(obj);
                }
            } else {
                throw new TypeError('Input should be iterable');
            }
        },
        isIterable(obj) {
            // checks for null and undefined
            if (obj == null) {
                return false;
            }
            return typeof obj[Symbol.iterator] === 'function';
        },
        loadAutoFill() {
            try {
                Object.keys(autoFillStore).forEach(selector => {
                    const element = window.document.querySelector(selector);
                    if (element !== null) {
                        const state = autoFillStore[selector];
                        Object.keys(state).forEach(key => {
                            element[key] = state[key];
                        });
                    }
                });
            } catch (_) {
                setTimeout(() => util.loadAutoFill(), 500);
            }
        },
        appendLogDataButton() {
            const pathname = '/logdata.html';
            if (location.host === 'csoss.cm.com' && location.pathname === pathname) {
                const $button = document.createElement('button');
                $button.textContent = '美化LogData';
                $button.style.position = 'absolute';
                $button.style.top = '32px';
                $button.style.right = '32px';
                $button.addEventListener('click', ___.replace.logData);
                window.document.body.appendChild($button);
            }
        },
        appendPortalButton() {
            const pathRegex = /\/portal_[rs]\/cgi\-bin\/get_portalDCLOG\.cgi/;
            if (location.host === 'csoss.cm.com' && pathRegex.test(location.pathname)) {
                const $button = document.createElement('button');
                $button.textContent = '美化模调日志';
                $button.style.position = 'absolute';
                $button.style.top = '32px';
                $button.style.right = '32px';
                $button.addEventListener('click', ___.replace.portal);
                window.document.body.appendChild($button);
            }
        },
        $(sel) {
            return document.querySelector(sel);
        },
        $$(sel) {
            return [...document.querySelectorAll(sel)];
        }
    };
    window.___ = {
        help() {
            console.log(
                [
                    '函数列表：',
                    `parse.query(format = 'json', { indent: Number, name: String }): 解析 location.search 中的 Query String`,
                    `parse.query(query, format = 'json', { indent: Number, name: String }): 解析 query 中的 Query String`,
                    `parse.headers(headers: String, format = 'obj', { indent: Number, name: String }): 解析 HTTP Headers`,
                    `decode.page(encoding = 'url'): 解析页面中所有文字``autoFill.add(selector): 将当前原生 input/select 中的值加入自动填写列表`
                ].join('\n')
            );
        },
        parse: {
            /**
             * 解析 Query String
             *
             * @param {string} query
             * @param {string} [format='json']
             * @param {object} options
             */
            query(query = location.search, format = 'json', options) {
                const optionsList = ['object', 'obj', 'json', 'md', 'markdown', 'console'];
                if (optionsList.includes(query)) {
                    options = format;
                    format = arguments[0];
                    query = location.search;
                }
                const parsed = query.includes('\n')
                    ? util.parseMultiline(query)
                    : util.parseUrlParams(query);
                return util.render(parsed, {
                    format,
                    name: 'Parameter',
                    ...options
                });
            },
            /**
             * 解析 HTTP Header
             *
             * @param {string} headers
             * @param {string} [format='obj']
             * @param {object} options
             * @returns
             */
            headers(headers, format = 'obj', options) {
                if (!headers) {
                    throw new Error('Header string is required.');
                }
                const parsed = util.parseMultiline(headers);
                return util.render(parsed, {
                    format,
                    name: 'Header',
                    ...options
                });
            },
            json(str) {
                try {
                    return JSON.parse(str);
                } catch (_) {
                    return null;
                }
            },
            logData(log, format = 'obj') {
                const parsed = util.parseUrlParams(log);
                if (!parsed.has('ResultInfo')) return;
                const resultInfo = parsed
                    .get('ResultInfo')
                    .split('&')
                    .reduce((obj, cur) => {
                        const [k, v] = cur.split('=');
                        obj[k] = v;
                        return obj;
                    }, {});
                parsed.set('ResultInfo', resultInfo);
                return util.render(parsed, {
                    format
                });
            }
        },
        replace: {
            // 替换网页中内容
            logData() {
                [...util.$$('#personDataTable td:nth-child(even)')].forEach($td => {
                    const text = $td.textContent;
                    $td.innerHTML = `<pre style="font-size:14px">
                        ${window.___.parse.logData(text, 'json')}
                    </pre>`;
                });
            },
            // 替换原始模调日志内容
            portal() {
                const selectorMap = {
                    '/portal_s/cgi-bin/get_portalDCLOG.cgi':
                        'body > div > pre > font > table > tbody > tr > td',
                    '/portal_r/cgi-bin/get_portalDCLOG.cgi': '#wrap > pre'
                };
                const $container = util.$(selectorMap[location.pathname]);
                const content = $container.textContent;
                $container.innerHTML = `<pre style="font-size:14px">
                    ${content
                        .split(/(?=\[)/)
                        .map(str =>
                            str.replace(/(\[[\d-: ]+\]\s*\d+[: ]+)(.+)/, function(_, $1, $2) {
                                return `${$1}${window.___.parse.query($2, 'json', { indent: 2 })}`;
                            })
                        )
                        .join('\n')}
                </pre>`;
            }
        },
        decode: {
            page(encoding = 'url') {
                var decoder = {
                    url: decodeURIComponent
                };
                var treeWalker = document.createTreeWalker(document.body);
                var node = document;
                while (node != null) {
                    node = treeWalker.nextNode();
                    if (node && node.nodeType == Node.TEXT_NODE) {
                        node.textContent = decoder[encoding].call(null, node.textContent);
                    }
                }
            },
            base64(str) {
                return atob(str);
            }
        },
        encode: {
            base64(str) {
                return btoa(str);
            }
        },
        map: {
            toObject(map) {
                const obj = {};
                for (const [key, value] of map) {
                    obj[key] = value;
                }
                return obj;
            },
            toJSON(map) {
                const obj = this.toObject(map);
                return JSON.stringify(obj);
            }
        },
        autoFill: {
            add(selector, value) {
                const element = window.document.querySelector(selector);
                const legitElements = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'];
                const isLegitElement = legitElements.includes(element.tagName.toUpperCase());
                if (isLegitElement) {
                    autoFillStore[selector] = {
                        value: value || element.value,
                        checked: element.checked,
                        selected: element.selected,
                        selectedIndex: element.selectedIndex
                    };
                }
                autoFillStoreAll[location.hostname + location.pathname] = autoFillStore;
                localStorage.setItem(autoFillKey, JSON.stringify(autoFillStoreAll));
            },
            remove(selector) {
                delete autoFillStore[selector];
                localStorage.setItem(autoFillKey, JSON.stringify(autoFillStore));
            },
            clear() {
                localStorage.removeItem(autoFillKey);
            },
            list() {
                console.log(autoFillStore);
            }
        },
        params(str = location.href) {
            return util.parseUrlParams(str);
        },
        renderParams(format = 'obj', str = location.href) {
            return util.render(this.params(), { format });
        }
    };

    window.onload = function() {
        util.loadAutoFill();
        util.appendLogDataButton();
        util.appendPortalButton();
    };

    for (const key in window.___) {
        window[`___${key}`] = window.___[key];
        if (typeof window.___[key] === 'object') {
            for (const key2 in window.___[key]) {
                window[`___${key}${key2}`] = window.___[key][key2];
                if (typeof window.___[key][key2] === 'object') {
                    for (const key3 in window.___[key][key2]) {
                        window[`___${key}${key2}${key3}`] = window.___[key][key2][key3];
                    }
                }
            }
        }
    }
})();

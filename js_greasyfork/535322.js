// ==UserScript==
// @name         News Comment Helper
// @version      0.18
// @description  翻译新闻评论
// @author       DeltaFlyer
// @copyright    2025, DeltaFlyer(https://github.com/DeltaFlyerW)
// @license      MIT
// @match        https://*.foxnews.com/*
// @match        https://*.foxbusiness.com/*
// @match        https://*.twz.com/*
// @match        https://*.x.com/*
// @match        https://*.bbc.com/*
// @match        https://*.bbc.com.uk/*
// @match        https://*.nytimes.com/*
// @match        https://*.archive.md/*
// @match        https://*.arstechnica.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      translate-pa.googleapis.com
// @icon         https://www.biliplus.com/favicon.ico
// @namespace    https://greasyfork.org/users/927887

// @downloadURL https://update.greasyfork.org/scripts/535322/News%20Comment%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/535322/News%20Comment%20Helper.meta.js
// ==/UserScript==

// @require     file://C:\DF_File\Programme\TemperMonkey\fox_helper.js


class FetchHook {
    constructor() {
        this.responseHooks = [];
        this.fetch = window.fetch;
        this.xhr = window.XMLHttpRequest;
        this._hooked = false;
    }

    /**
     * @callback ResponseHook
     * @param {Response} response
     * @param {Request} request
     * @returns {Promise<Response>}
     */

    /**
     * @param {ResponseHook} hookFn
     */
    addResponseHook(hookFn) {
        this.responseHooks.push(hookFn);
        if (!this._hooked) {
            this._patchFetch();
            this._patchXHR()
        }
    }

    _patchFetch() {
        const self = this;
        unsafeWindow.fetch = async function (request, init) {
            let response = await self.fetch(request, init);

            let requestEntity = new Request(request, init);
            for (const hook of self.responseHooks) {
                try {
                    let new_response = await hook(response.clone(), requestEntity);
                    if (new_response) {
                        console.log("Modified: ", new_response)
                        return new_response;
                    }
                } catch (err) {
                    console.warn("FetchHook error in hook:", err, response, init);
                }
            }
            return response;
        };
        this._hooked = true;
    }

    _patchXHR() {
        const self = this

        class HookedXHR {
            constructor() {
                this._xhr = new self.xhr();
                this._listener_map = new Map();
                this._requestInfo = {method: '', url: ''};
                this._onload = null;
                this._onreadystatechange = null;
                this._hookResponse = null
                this._hookBody = null;
                this._verbose = false;

                const proxyHandler = {
                    get: (target, prop) => {
                        if (this._verbose && prop[0] !== '_') {
                            console.log(target, prop);
                        }
                        if (this._hookResponse) {
                            if (prop === 'responseText' || prop === 'response') {
                                return this._hookBody || '';
                            }
                            if (prop === 'status') {
                                return this._hookResponse.status || 200;
                            }
                            if (prop === 'statusText') {
                                return this._hookResponse.statusText || 'OK';
                            }
                            if (prop === 'readyState') {
                                return 4; // DONE
                            }
                        }

                        if (prop === 'addEventListener') {
                            return (event, listener) => {
                                if (['readystatechange', 'load'].includes(event)) {
                                    if (!this._listener_map.has(event)) this._listener_map.set(event, [])
                                    this._listener_map.get(event).push(listener);
                                } else {
                                    this._xhr.addEventListener(event, listener);
                                }
                            };
                        } else if (prop === 'onreadystatechange') {
                            return this._onreadystatechange;
                        } else if (prop === 'onload') {
                            return this._onload;
                        } else if (this[prop]) {
                            return this[prop];
                        } else if (typeof this._xhr[prop] === 'function') {
                            return this._xhr[prop].bind(this._xhr);
                        }
                        return this._xhr[prop];
                    }, set: (target, prop, value) => {
                        if (prop === 'onreadystatechange') {
                            this._onreadystatechange = value;
                            return true;
                        } else if (prop === 'onload') {
                            this._onload = value;
                            return true;
                        }
                        target[prop] = value;
                        return true;
                    }
                };

                this.proxy = new Proxy(this, proxyHandler);
                return this.proxy
            }

            open(method, url, ...args) {
                this._requestInfo = {method, url};
                return this._xhr.open(method, url, ...args);
            }

            async send(body) {
                const {method, url} = this._requestInfo;

                const fakeRequest = {url, method, body};

                function parseResponseHeaders(headerStr) {
                    const headers = {};
                    const headerPairs = headerStr.trim().split(/[\r\n]+/);
                    for (const line of headerPairs) {
                        const parts = line.split(': ');
                        const key = parts.shift();
                        const value = parts.join(': ');
                        headers[key] = value;
                    }
                    return headers;
                }

                for (const hook of self.responseHooks) {
                    try {
                        const maybeMocked = await hook(null, fakeRequest);
                        if (maybeMocked) {
                            this._xhr.addEventListener('readystatechange', async (event) => {
                                if (this._xhr.readyState !== 4) return;
                                const realResponse = new Response(this._xhr.responseText, {
                                    status: this._xhr.status,
                                    statusText: this._xhr.statusText,
                                    headers: parseResponseHeaders(this._xhr.getAllResponseHeaders()),
                                });
                                for (const hook of self.responseHooks) {
                                    try {
                                        const maybeModified = await hook(realResponse, fakeRequest);
                                        if (maybeModified) {
                                            this._hookResponse = maybeModified;
                                            this._hookBody = await maybeModified.text()
                                            break;
                                        }
                                    } catch (err) {
                                        console.warn("FetchHook error in post-send hook:", err);
                                    }
                                }
                                const xhrProxy = this.proxy
                                let eventProxy = new Proxy(event, {
                                    get(target, prop, receiver) {
                                        if (prop === "target") {
                                            return xhrProxy;
                                        }
                                        return Reflect.get(...arguments);
                                    },
                                })
                                this._verbose = true
                                this._listener_map.forEach((listeners, eventType) => {
                                    for (let listener of listeners) {
                                        listener(eventProxy)
                                    }
                                });
                                if (this._onreadystatechange) this._onreadystatechange.call(this);
                                if (this._onload) this._onload.call(this);

                            });
                            this._xhr.send(body);
                            return
                        }
                    } catch (err) {
                        console.warn("FetchHook error in XHR hook:", err);
                    }
                }

                this.send_normal(body)
            }

            send_normal(body) {
                // Proceed normally if no hook handled it
                this._listener_map.forEach((listeners, event) => {
                    for (let listener of listeners) {
                        this._xhr.addEventListener(event, listener)
                    }
                });
                if (this._onreadystatechange) this._xhr.onreadystatechange = this._onreadystatechange;
                if (this._onload) this._xhr.onload = this._onload;
                this._xhr.send(body);
            }
        }


        unsafeWindow.XMLHttpRequest = HookedXHR;
    }

    /**
     * Restore the original fetch implementation
     */
    restore() {
        if (this._hooked) {
            unsafeWindow.fetch = this.fetch;
            unsafeWindow.XMLHttpRequest = this.xhr
            this._hooked = false;
            this.responseHooks = [];
        }
    }


}

class Semaphore {
    constructor(maxConcurrency) {
        this.maxConcurrency = maxConcurrency;
        this.currentCount = 0;
        this.queue = [];
    }

    async acquire() {
        if (this.currentCount < this.maxConcurrency) {
            this.currentCount++;
            return;
        }
        await new Promise(resolve => this.queue.push(resolve));
        this.currentCount++;
    }

    release() {
        this.currentCount--;
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next();
        }
    }

    /**
     * Run a single async function with automatic acquire/release.
     * @param {Function} fn - The async function to run.
     */
    async run(fn) {
        await this.acquire();
        try {
            return await fn();
        } finally {
            this.release();
        }
    }

    /**
     * Run multiple tasks concurrently, limited by semaphore capacity.
     * @param {Function} func - Async function to call for each item.
     * @param {Array} argsArray - Array of arguments to pass to func (each element is passed as func(...args)).
     * @returns {Promise<Array>} Array of results in input order.
     */
    async runBatch(func, argsArray) {
        const results = new Array(argsArray.length);

        await Promise.all(
            argsArray.map((args, index) =>
                this.run(async () => {
                    try {
                        results[index] = await func(...args);
                    } catch (err) {
                        console.error(`Task ${index} failed:`, err);
                        results[index] = null;
                    }
                })
            )
        );

        return results;
    }
}


async function translateBatch(strings, {maxChunkSize = 4000, maxConcurrency = 5} = {}) {
    const endpoint = 'https://translate-pa.googleapis.com/v1/translateHtml';
    const apiKey = 'AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520';

    // Helper: group strings into chunks within maxChunkSize
    const batches = [];
    let currentBatch = [];
    let currentSize = 0;

    for (const str of strings) {
        if (currentSize + str.length > maxChunkSize && currentBatch.length > 0) {
            batches.push([...currentBatch]);
            currentBatch = [];
            currentSize = 0;
        }
        currentBatch.push(str);
        currentSize += str.length;
    }

    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    // --- Helper: single batch translation request ---
    async function translateSingleBatch(batch) {
        const body = JSON.stringify([[batch, 'auto', 'zh-CN'], 'te_lib']);
        const url = `${endpoint}?key=${apiKey}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: {'Content-Type': 'application/json+protobuf'},
                data: body,
                onload: res => {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(data[0]);
                        } catch (e) {
                            reject(new Error('Failed to parse response: ' + e.message));
                        }
                    } else {
                        reject(new Error(`API Error: ${res.status} ${res.statusText}\n${res.responseText}`));
                    }
                },
                onerror: err => reject(new Error('Network error: ' + (err.error || err))),
            });
        });
    }

    const results = await new Semaphore(maxConcurrency).runBatch(translateSingleBatch, batches.map(x => [x]));

    // Flatten all translated text arrays in order
    return results.flat();
}


async function translateObject(obj, {maxChunkSize = 4000} = {}) {
    // Function to traverse the object and collect all `text` fields with their paths
    function collectTextFields(obj, path = []) {
        let fields = [];

        if (Array.isArray(obj)) {
            // If the object is an array, apply recursively on each element
            obj.forEach((item, index) => {
                fields = fields.concat(collectTextFields(item, [...path, index]));
            });
        } else if (typeof obj === 'object' && obj !== null) {
            // If the object is a plain object, iterate through its keys
            for (const key in obj) {
                if (['text', 'full_text'].includes(key) && typeof obj[key] === 'string') {
                    // If key is 'text', collect the field with its path
                    fields.push({path: [...path, key], text: obj[key]});
                } else {
                    // Otherwise, continue recursively
                    fields = fields.concat(collectTextFields(obj[key], [...path, key]));
                }
            }
        }

        return fields;
    }

    // Step 1: Collect all 'text' fields with their paths
    const textFields = collectTextFields(obj);

    if (textFields.length > 0) {
        console.log(textFields);
        // Step 2: Extract the text fields to translate
        const textsToTranslate = textFields.map(field => field.text);

        // Step 3: Translate the batch of texts
        const translatedTexts = await translateBatch(textsToTranslate, {maxChunkSize});
        console.log(translatedTexts);
        let translatedObject = JSON.parse(JSON.stringify(obj));
        // Step 4: Apply the translated results back to the object
        for (let i = 0; i < textFields.length; i++) {
            let pathList = textFields[i].path;
            let field = translatedObject
            for (let iPath = 0; iPath < pathList.length; iPath++) {
                let path = pathList[iPath];
                if (iPath !== pathList.length - 1) {
                    field = field[path];
                } else {
                    field[path] = translatedTexts[i];
                }
            }
        }
        console.log(translatedObject);
        return translatedObject;
    }

    return obj; // If no 'text' fields found, return the original object
}


async function forceNewTab() {
    'use strict';
    await waitForBody()
    // Make all existing links open in new tab
    document.querySelectorAll('a[href]').forEach(a => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
    });

    // Also handle dynamically added links
    const observer = new MutationObserver(() => {
        document.querySelectorAll('a[href]:not([target])').forEach(a => {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        });
    });

    observer.observe(document.body, {childList: true, subtree: true});
}

function foxStrategy() {
    async function addStyle() {
        document.head.insertAdjacentHTML('beforeend', `
<style>
.sidebar-columns {
     display: none !important;
}
.recommended-videos {
     display: none !important;
}
.sidebar {
     display: none !important;
}
.site-footer {
     display: none !important;
}

.article-footer > *:not(.article-comments) {
    display: none !important;
}
.featured-video {
    display: none !important;
}
.spcv_toasts-placeholder {
    display: none !important;
}
 
.article-footer > *:not(.article-comments) {
    display: none !important;
}
 
.article-comments button {
  display: none !important;
}

.ad-container {
  display: none !important;
}

.site-header {
  display: none !important;
}

iframe {
  display: none !important;
}

</style>
        `)
        createToolbar({
            options: {
                'Archive': function () {
                    window.open('https://archive.md/latest/' + window.location.href, '_self');
                }
            }
        })
    }

    if (window.location.href !== 'https://www.foxnews.com/') {
        addStyle()
    }
    forceNewTab()
}

function nytimeStrategy() {
    function addStyle() {
        document.head.insertAdjacentHTML('beforeend', `
<style>
#gateway-content {
     display: none !important;
}

.ReactModalPortal {
     display: none !important;
}

#dock-container {
     display: none !important;
}

</style>
        `)
    }

    addStyle()

    createToolbar({
        options: {
            'Archive': function () {
                window.open('https://archive.md/latest/' + window.location.href, '_self');
            },
            'Comment': function () {
                if (window.location.href.indexOf('#commentsContainer') === -1) {
                    window.location.href = window.location.href + '#commentsContainer'
                }
            }
        }
    })

    // Function to re-enable scrolling
    const enableScroll = () => {
        document.body && (document.body.style.overflow = 'auto');
        document.documentElement.style.overflow = 'auto';
    };

    const init = () => {
        if (!document.body) {
            // Wait for body if not yet available
            new MutationObserver((_, obs) => {
                if (document.body) {
                    obs.disconnect();
                    init(); // retry
                }
            }).observe(document.documentElement, {childList: true});
            return;
        }

        // Watch for changes to body style (in case React relocks scroll)
        const observer = new MutationObserver(() => enableScroll());
        observer.observe(document.body, {attributes: true, attributeFilter: ['style']});

        enableScroll();
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    forceNewTab()

}


const styleMap = {
    'archive': function () {
        createToolbar({
            options: {
                'Origin': function () {
                    let url = document.querySelector('input[name="q"]').value;
                    window.open(url, '_self');
                }
            }
        })
    },

    'fox': foxStrategy, 'nytimes': nytimeStrategy, 'arstechnica': function () {
        function addStyle() {
            document.head.insertAdjacentHTML('beforeend', `
<style>
.in-content-interlude {
     display: none !important;
}
</style>
        `)
        }

        addStyle()
    },
    'x.com': function () {
        createToolbar({
            options: {
                'Cancel': function () {
                    window.open(window.location.href.replace('x.com', 'xcancel.com'), '_self');
                }
            }
        })
    }


}

async function sleep(time) {
    await new Promise((resolve) => setTimeout(resolve, time));
}

async function waitForBody() {
    if (document.body) return document.body;

    return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                resolve(document.body);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}


async function createToolbar(config) {
    await waitForBody();


    const html = `
<style>
  #triggerArea {
    position: fixed;
    top: 10%;
    left: 0;
    width: max(5%, 20px);
    height: 30%;
    cursor: pointer;
    z-index: 999998;
  }
 
  #toolbar {
    position: fixed;
    top: 20%;
    left: -250px;
    transform: translateY(-50%);
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: left 0.3s;
    z-index: 999999;
  }
 
  #toolbar button {
    display: block;
    margin: 5px 0;
    padding: 8px;
    background-color: #555;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 3px;
  }
</style>
<div id="triggerArea"></div>
<div id="toolbar"></div>
`;
    document.body.insertAdjacentHTML('beforeend', html);

    const triggerArea = document.getElementById('triggerArea');
    const toolbar = document.getElementById('toolbar');
    let isExpanded = false;

    // Add buttons
    for (let option of Object.keys(config.options)) {
        const button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', config.options[option]);
        toolbar.appendChild(button);
    }

    function expandToolbar() {
        if (!isExpanded) {
            toolbar.style.left = '0';
            isExpanded = true;
        }
    }

    function collapseToolbar() {
        if (isExpanded) {
            toolbar.style.left = '-250px';
            isExpanded = false;
        }
    }

    triggerArea.addEventListener('mouseenter', expandToolbar);
    triggerArea.addEventListener('mouseleave', collapseToolbar);
    toolbar.addEventListener('mouseenter', expandToolbar);
    toolbar.addEventListener('mouseleave', collapseToolbar);

}

async function main() {
    console.log("Inject start")

    let href = window.location.href;
    while (!document.head) {
        await sleep(100)
    }
    for (let entry of Object.entries(styleMap)) {
        if (href.includes(entry[0])) {
            console.log("Apply handle", entry);
            entry[1]()
            break
        }
    }


    const fetchHook = new FetchHook();
    fetchHook.addResponseHook(async (response, request) => {
        let keywords = ['conversation/read', 'TweetDetail?variables', 'UserTweets?variables', 'conversation/realtime/read', 'v2?operationName=communityComment']
        if (keywords.some(x => request.url.includes(x))) {
            if (!response) {
                return true
            }
            const json = await response.json();
            const new_json = await translateObject(json)
            return new Response(JSON.stringify(new_json), {
                headers: response.headers, status: response.status, statusText: response.statusText,
            });
        }
    },);
}

main()
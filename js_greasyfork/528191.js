// ==UserScript==
// @name         Aria2 RPC Edit 2
// @namespace    https://greasyfork.org/users/667968-pyudng
// @version      0.4.2
// @description  Aria2 RPC Library 维护，源脚本 https://greasyfork.org/zh-CN/scripts/402652
// @author       PY-DNG
// @original-author moe.jixun, Sonic853
// @original-license MIT, MIT
// @original-script https://greasyfork.org/scripts/5672-aria2-rpc, https://greasyfork.org/zh-CN/scripts/402652
// @license      MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/*
Information from original script https://greasyfork.org/zh-CN/scripts/402652:
// Source code: https://github.com/Sonic853/Static_library/blob/master/aria2.ts
// tsc .\aria2.ts --target esnext
// Public Class Aria2 ( options )
*/

const Aria2AUTH = {
    noAuth: 0,
    basic: 1,
    secret: 2,
    0: 'noAuth',
    1: 'basic',
    2: 'secret'
};

class Aria2BATCH {
    parent;
    data = [];
    onSuccess;
    onFail;
    addRaw(fn, params) {
        this.data.push({
            method: `aria2.${fn}`,
            params
        });
    }
    add(fn, ...args) {
        if (this.parent[fn] === undefined)
            throw new Error(`Unknown function: ${fn}, please check if you had a typo.`);
        return this.addRaw(fn, args);
    }
    async send() {
        let ret = await this.parent.send(true, this.data, this.onSuccess, this.onFail);
        this.reset();
        return ret;
    }
    getActions() {
        return this.data.slice();
    }
    setActions(actions) {
        if (!actions || !actions.map)
            return;
        this.data = actions;
    }
    reset() {
        this.onSuccess = this.onFail = null;
        this.data = [];
    }
    constructor(obj, cbSuccess, cbFail) {
        this.parent = obj;
        this.onSuccess = cbSuccess;
        this.onFail = cbFail;
    }
}

var Aria2 = class AriaBase {
    /**
     * @constant
     * @type {'2.0'}
     */
    jsonrpc_ver = '2.0';

    /**
     * last aria2 request id
     * @type {number}
     */
    id;

    /**
     * @typedef {Object} Aria2Auth
     * @property {string} [secret]
     * @property {string} [user]
     * @property {string} [pass]
     */
    /**
     * @typedef {Object} Aria2Options
     * @property {Aria2Auth} [auth] - defaults to Aria2AUTH.noAuth
     * @property {string} [host='localhost']
     * @property {number} [port=6800]
     * @property {boolean} [https=false]
     * @property {string} [endpoint='/jsonrpc']
     */
    /** @type {Aria2Options} */
    options;

    /**
     * @param {Aria2Options} options 
     */
    constructor(options) {
        // options
        AriaBase.#Assert(!options.host || typeof options.host === 'string', 'options.host should be string', TypeError);
        AriaBase.#Assert(!options.port || typeof options.port === 'number', 'options.port should be number', TypeError);
        this.options = Object.assign({
            auth: { type: Aria2AUTH.noAuth },
            host: 'localhost',
            port: 6800,
            https: false,
            endpoint: '/jsonrpc'
        }, options);

        // init id
        this.id = (+new Date());

        // warning for not-GM_xmlhttpRequest request
        typeof GM_xmlhttpRequest === 'undefined' && console.warn([
            'Warning: You are now using an simple implementation of GM_xmlhttpRequest',
            'Cross-domain request are not avilible unless configured correctly @ target server.',
            '',
            'Some of its features are not avilible, such as `username` and `password` field.'
        ].join('\n'));

        // aria2 methods implementation
        const isFunction = obj => typeof obj === 'function';
        [
            "addUri", "addTorrent", "addMetalink", "remove", "forceRemove",
            "pause", "pauseAll", "forcePause", "forcePauseAll", "unpause",
            "unpauseAll", "tellStatus", "getUris", "getFiles", "getPeers",
            "getServers", "tellActive", "tellWaiting", "tellStopped",
            "changePosition", "changeUri", "getOption", "changeOption",
            "getGlobalOption", "changeGlobalOption", "getGlobalStat",
            "purgeDownloadResult", "removeDownloadResult", "getVersion",
            "getSessionInfo", "shutdown", "forceShutdown", "saveSession"
        ].forEach(sMethod => {
            this[sMethod] = async (...args) => {
                let cbSuccess, cbError;
                if (args.length && isFunction(args[args.length - 1])) {
                    cbSuccess = args[args.length - 1];
                    args.splice(-1, 1);
                    if (args.length && isFunction(args[args.length - 1])) {
                        cbError = cbSuccess;
                        cbSuccess = args[args.length - 1];
                        args.splice(-1, 1);
                    }
                }
                return await this.send(false, {
                    method: `aria2.${sMethod}`,
                    params: args
                }, cbSuccess, cbError);
            };
        });
    }

    /**
     * Get basic authentication header string
     * @returns {string}
     */
    #getBasicAuth() {
        return btoa(`${this.options.auth.user}:${this.options.auth.pass}`);
    }

    async send(bIsDataBatch, data, cbSuccess, cbError) {
        // update request id
        this.id = (+new Date());

        // construct payload
        let srcTaskObj = { jsonrpc: this.jsonrpc_ver, id: this.id };
        let payload = {
            method: 'POST',
            url: `${this.options.https ? 'https' : 'http'}://${this.options.host}:${this.options.port}${this.options.endpoint}`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: bIsDataBatch
                ? data.map(e => { return AriaBase.#merge({}, srcTaskObj, e); })
                : AriaBase.#merge({}, srcTaskObj, data),
            onload: r => {
                if (r.status !== 200) {
                    cbError && cbError(r);
                } else {
                    let repData;
                    try {
                        repData = JSON.parse(r.responseText);
                        repData.error && cbError(repData);
                    } catch (error) {
                        repData = r.responseText;
                    }
                    cbSuccess && cbSuccess(repData);
                }
            },
            onerror: cbError ? cbError.bind(null) : null
        };

        // authentication
        switch (this.options.auth.type) {
            case Aria2AUTH.basic: {
                payload.headers.Authorization = 'Basic ' + this.#getBasicAuth();
                break;
            }
            case Aria2AUTH.secret: {
                let sToken = `token:${this.options.auth.pass}`;
                if (bIsDataBatch) {
                    for (let i = 0; i < payload.data.length; i++) {
                        payload.data[i].params.splice(0, 0, sToken);
                    }
                }
                else {
                    if (!payload.data.params)
                        payload.data.params = [];
                    payload.data.params.splice(0, 0, sToken);
                }
                break;
            }
            case Aria2AUTH.noAuth:
            default: {
                break;
            }
        }
        return await AriaBase.#doRequest(payload);
    }

    BATCH = new Aria2BATCH(this);

    /**
     * merge moultiple source objects' properties into base object
     * @param {object} base 
     * @param  {...object} sources 
     * @returns 
     */
    static #merge(base, ...sources) {
        const isObject = obj => typeof obj === 'object' && obj !== null;
        this.#Assert(isObject(base), 'base should be an object', TypeError);
        sources.forEach(obj => {
            this.#Assert(isObject(obj), 'source should be an object', TypeError);
            Object.keys(obj).forEach(key => {
                if (isObject(base[key]) && isObject(obj[key])) {
                    base[key] = AriaBase.#merge(base[key], obj[key]);
                } else {
                    base[key] = obj[key];
                }
            });
        });
        return base;
    }

    /**
     * throw error when condition not met
     * @param {boolean} condition 
     * @param {string} message 
     * @param {function} ErrorConstructor 
     */
    static #Assert(condition, message, ErrorConstructor = Error) {
        if (!condition) {
            throw new ErrorConstructor(message);
        }
    }

    static async #doRequest(details) {
        const { url, method, data, headers, onload, onerror } = details;
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url,
                    method,
                    data: typeof data === 'string' ? data : JSON.stringify(data),
                    headers,
                    onload(r) {
                        onload && onload(r);
                        resolve(r);
                    },
                    onerror() {
                        onerror && onerror();
                        reject();
                    }
                });
            });
        } else {
            try {
                let response = await fetch(url, {
                    method,
                    body: typeof data === 'string' ? data : JSON.stringify(data),
                    headers
                });
                let responseText = await response.text();
                onload && onload(responseText);
                return {
                    readyState: 4,
                    responseHeaders: response.headers,
                    status: response.status,
                    statusText: response.statusText,
                    response,
                    responseText,
                    finalUrl: response.url
                };
            } catch (error) {
                onerror && onerror(error);
                throw error;
            }
        }
    }
};

// ==UserScript==
// @name         Aria2 RPC Edit
// @namespace    Sonic853
// @version      0.3.3
// @description  Aria2 RPC Library 重写，参考自 https://greasyfork.org/scripts/5672-aria2-rpc
// @author       Sonic853
// @original-author moe.jixun
// @original-license MIT
// @original-script https://greasyfork.org/scripts/5672-aria2-rpc
// @license      MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==
// Source code: https://github.com/Sonic853/Static_library/blob/master/aria2.ts
// tsc .\aria2.ts --target esnext
// Public Class Aria2 ( options )
var Aria2AUTH;
(function (Aria2AUTH) {
    Aria2AUTH[Aria2AUTH["noAuth"] = 0] = "noAuth";
    Aria2AUTH[Aria2AUTH["basic"] = 1] = "basic";
    Aria2AUTH[Aria2AUTH["secret"] = 2] = "secret";
})(Aria2AUTH || (Aria2AUTH = {}));
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
// var GM_fetch = async (input: RequestInfo, init?: RequestInit): Promise<any> => {
//     // Promise<Response>
//     if (typeof GM_xmlhttpRequest !== 'undefined') {
//         return new Promise((resolve, reject)=>{
//             if (typeof input === 'string') {
//             }
//             else {
//             }
//         })
//     }else{
//         console.warn([
//             'Warning: You are now using an simple implementation of GM_xmlhttpRequest',
//             'Cross-domain request are not avilible unless configured correctly @ target server.',
//             '',
//             'Some of its features are not avilible, such as `username` and `password` field.'
//         ].join('\n'))
//         return fetch(input, init)
//     }
// }
var Aria2 = class AriaBase {
    jsonrpc_ver = '2.0';
    id;
    options;
    doRequest;
    getBasicAuth() {
        return btoa(`${this.options.auth.user}:${this.options.auth.pass}`);
    }
    async send(bIsDataBatch, data, cbSuccess, cbError) {
        this.id = (+new Date());
        let srcTaskObj = { jsonrpc: this.jsonrpc_ver, id: this.id };
        let payload = {
            method: 'POST',
            url: `http://${this.options.host}:${this.options.post}/jsonrpc`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: bIsDataBatch
                ? data.map(e => { return this.merge({}, srcTaskObj, e); })
                : this.merge({}, srcTaskObj, data),
            onload: r => {
                if (r.readyState !== 4) {
                    cbError && cbError(null, false);
                }
                else {
                    let repData;
                    try {
                        repData = JSON.parse(r.responseText);
                    }
                    catch (error) {
                        repData = r.responseText;
                    }
                    cbSuccess && cbSuccess(repData);
                }
            },
            onerror: cbError ? cbError(null, false) : null
        };
        switch (this.options.auth.type) {
            case Aria2AUTH.basic: {
                payload.headers.Authorization = 'Basic ' + this.getBasicAuth();
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
        return await this.doRequest.send(payload);
    }
    BATCH = new Aria2BATCH(this);
    merge(...args) {
        let base = args[0];
        let _isObject = function (obj) {
            return obj instanceof Object;
        };
        let _merge = function (...args) {
            let argL = args.length;
            for (let i = 1; i < argL; i++) {
                Object.keys(args[i]).forEach(function (key) {
                    if (_isObject(args[i][key]) && _isObject(base[key])) {
                        base[key] = _merge(base[key], args[i][key]);
                    }
                    else {
                        base[key] = args[i][key];
                    }
                });
            }
            return base;
        };
        return _merge(...args);
    }
    constructor(options) {
        if (options) {
            if (!options.auth)
                options.auth = { type: Aria2AUTH.noAuth };
            if (typeof options.host !== 'string')
                options.host = 'localhost';
            if (typeof options.post !== 'number')
                options.post = 6800;
            this.options = options;
        }
        else
            this.options = {
                auth: {
                    type: Aria2AUTH.noAuth
                },
                host: 'localhost',
                post: 6800
            };
        let isFunction = (obj) => {
            return typeof obj === 'function';
        };
        this.id = (+new Date());
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            this.doRequest = new class {
                parent;
                async send({ url, method, data, headers, onload, onerror }) {
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
                }
                constructor(obj) {
                    this.parent = obj;
                }
            }(this);
        }
        else {
            console.warn([
                'Warning: You are now using an simple implementation of GM_xmlhttpRequest',
                'Cross-domain request are not avilible unless configured correctly @ target server.',
                '',
                'Some of its features are not avilible, such as `username` and `password` field.'
            ].join('\n'));
            this.doRequest = new class {
                parent;
                async send({ url, method, data, headers, onload, onerror }) {
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
                    }
                    catch (error) {
                        onerror && onerror(error);
                        return;
                    }
                }
                constructor(obj) {
                    this.parent = obj;
                }
            }(this);
        }
        {
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
    }
};

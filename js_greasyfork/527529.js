// ==UserScript==
// @name         ajaxHooker
// @author       cxxjackie
// @version      1.1.1
// @supportURL   https://bbs.tampermonkey.net.cn/thread-3284-1-1.html
// @description  NUNYA FRICKING BUSINESS
// @match        https://app.grammarly.com/
// @namespace https://greasyfork.org/users/1353626
// @downloadURL https://update.greasyfork.org/scripts/527529/ajaxHooker.user.js
// @updateURL https://update.greasyfork.org/scripts/527529/ajaxHooker.meta.js
// ==/UserScript==

var ajaxHooker = function() {
    const win = window.unsafeWindow || document.defaultView || window;
    const hookFns = [];
    const xhrProto = win.XMLHttpRequest.prototype;
    const xhrProtoDesc = Object.getOwnPropertyDescriptors(xhrProto);
    const xhrReadyState = xhrProtoDesc.readyState.get;
    const resProto = win.Response.prototype;
    const realXhrOpen = xhrProto.open;
    const realXhrSend = xhrProto.send;
    const realFetch = win.fetch;
    const xhrResponses = ['response', 'responseText', 'responseXML'];
    const fetchResponses = ['arrayBuffer', 'blob', 'formData', 'json', 'text'];
    function emptyFn() {}
    function readOnly(obj, prop, value = obj[prop]) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            get: () => value,
            set: emptyFn
        });
    }
    function writable(obj, prop, value = obj[prop]) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: value
        });
    }
    function fakeXhrOpen(method, url, ...args) {
        const xhr = this;
        xhr.__ajaxHooker = xhr.__ajaxHooker || {headers: {}};
        xhr.__ajaxHooker.url = url;
        xhr.__ajaxHooker.method = method.toUpperCase();
        xhr.__ajaxHooker.remainArgs = args;
        xhr.setRequestHeader = (header, value) => {
            xhr.__ajaxHooker.headers[header] = value;
        }
        xhrResponses.forEach(prop => {
            delete xhr[prop]; // delete descriptor
        });
        return realXhrOpen.call(xhr, method, url, ...args);
    }
    function fakeXhrSend(data) {
        const xhr = this;
        const req = xhr.__ajaxHooker;
        if (xhrReadyState.call(xhr) === 1 && req) {
            const request = {
                type: 'xhr',
                url: req.url,
                method: req.method,
                abort: false,
                headers: req.headers,
                data: data,
                response: null
            };
            for (const fn of hookFns) {
                fn(request);
                if (request.abort) return;
            }
            realXhrOpen.call(xhr, request.method, request.url, ...req.remainArgs);
            data = request.data;
            for (const header in request.headers) {
                xhrProto.setRequestHeader.call(xhr, header, request.headers[header]);
            }
            if (typeof request.response === 'function') {
                const arg = {};
                xhrResponses.forEach(prop => {
                    Object.defineProperty(xhr, prop, {
                        configurable: true,
                        enumerable: true,
                        get: () => {
                            if (xhrReadyState.call(xhr) === 4) {
                                if (!('finalUrl' in arg)) {
                                    arg.finalUrl = xhr.responseURL;
                                    arg.status = xhr.status;
                                    arg.responseHeaders = {};
                                    const arr = xhr.getAllResponseHeaders().trim().split(/[\r\n]+/);
                                    for (const line of arr) {
                                        const parts = line.split(/:\s*/);
                                        if (parts.length === 2) {
                                            const lheader = parts[0].toLowerCase();
                                            if (lheader in arg.responseHeaders) {
                                                arg.responseHeaders[lheader] += ', ' + parts[1];
                                            } else {
                                                arg.responseHeaders[lheader] = parts[1];
                                            }
                                        }
                                    }
                                }
                                if (!(prop in arg)) {
                                    arg[prop] = xhrProtoDesc[prop].get.call(xhr);
                                    request.response(arg);
                                }
                            }
                            return prop in arg ? arg[prop] : xhrProtoDesc[prop].get.call(xhr);
                        }
                    });
                });
            }
        }
        return realXhrSend.call(xhr, data);
    }
    function hookFetchResponse(response, arg, callback) {
        fetchResponses.forEach(prop => {
            response[prop] = () => new Promise((resolve, reject) => {
                resProto[prop].call(response).then(res => {
                    if (!(prop in arg)) {
                        arg[prop] = res;
                        callback(arg);
                    }
                    resolve(prop in arg ? arg[prop] : res);
                }, reject);
            });
        });
    }
    function fakeFetch(url, init) {
        if (typeof url === 'string' || url instanceof String) {
            init = init || {};
            init.headers = init.headers || {};
            const request = {
                type: 'fetch',
                url: url,
                method: (init.method || 'GET').toUpperCase(),
                abort: false,
                headers: {},
                data: init.body,
                response: null
            };
            if (init.headers.toString() === '[object Headers]') {
                for (const [key, val] of init.headers) {
                    request.headers[key] = val;
                }
            } else {
                request.headers = {...init.headers};
            }
            for (const fn of hookFns) {
                fn(request);
                if (request.abort) return Promise.reject('aborted');
            }
            url = request.url;
            init.method = request.method;
            init.headers = request.headers;
            init.body = request.data;
            if (typeof request.response === 'function') {
                return new Promise((resolve, reject) => {
                    realFetch.call(win, url, init).then(response => {
                        const arg = {
                            finalUrl: response.url,
                            status: response.status,
                            responseHeaders: {}
                        };
                        for (const [key, val] of response.headers) {
                            arg.responseHeaders[key] = val;
                        }
                        hookFetchResponse(response, arg, request.response);
                        response.clone = () => {
                            const resClone = resProto.clone.call(response);
                            hookFetchResponse(resClone, arg, request.response);
                            return resClone;
                        };
                        resolve(response);
                    }, reject);
                });
            }
        }
        return realFetch.call(win, url, init);
    }
    xhrProto.open = fakeXhrOpen;
    xhrProto.send = fakeXhrSend;
    win.fetch = fakeFetch;
    return {
        hook: fn => hookFns.push(fn),
        protect: () => {
            readOnly(win, 'XMLHttpRequest');
            readOnly(xhrProto, 'open');
            readOnly(xhrProto, 'send');
            readOnly(win, 'fetch');
        },
        unhook: () => {
            writable(win, 'XMLHttpRequest');
            writable(xhrProto, 'open', realXhrOpen);
            writable(xhrProto, 'send', realXhrSend);
            writable(win, 'fetch', realFetch);
        }
    };
}();
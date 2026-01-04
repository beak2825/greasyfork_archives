// ==UserScript==
// @name         QuillBot x
// @version      4.7
// @description  Unlock Quillbot Premium
// @author       Safwan Kazi
// @match        https://quillbot.com/*
// @icon         https://quillbot.com/favicon.png
// @grant        none
// @namespace https://greasyfork.org/users/1212119
// @downloadURL https://update.greasyfork.org/scripts/479184/QuillBot%20x.user.js
// @updateURL https://update.greasyfork.org/scripts/479184/QuillBot%20x.meta.js
// ==/UserScript==

// AJAXHOOKER IMPLEMENTED

(function() {
    'use strict';

    // Define an object 'requests' to encapsulate the hooking functionality.
    var requests = function() {
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

        // Function to be used as a placeholder.
        function emptyFn() {}

        // Function to make an object property read-only.
        function readOnly(obj, prop, value = obj[prop]) {
            Object.defineProperty(obj, prop, {
                configurable: true,
                enumerable: true,
                get: () => value,
                set: emptyFn
            });
        }

        // Function to make an object property writable.
        function writable(obj, prop, value = obj[prop]) {
            Object.defineProperty(obj, prop, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: value
            });
        }

        // Function to intercept and modify the 'open' method of XMLHttpRequest.
        function fakeXhrOpen(method, url, ...args) {
            const xhr = this;
            xhr.__requests = xhr.__requests || {headers: {}};
            xhr.__requests.url = url;
            xhr.__requests.method = method.toUpperCase();
            xhr.__requests.remainArgs = args;
            xhr.setRequestHeader = (header, value) => {
                xhr.__requests.headers[header] = value;
            }

            // Remove XMLHttpRequest response properties.
            xhrResponses.forEach(prop => {
                delete xhr[prop];
            });

            return realXhrOpen.call(xhr, method, url, ...args);
        }

        // Function to intercept and modify the 'send' method of XMLHttpRequest.
        function fakeXhrSend(data) {
            const xhr = this;
            const req = xhr.__requests;

            // Check if XMLHttpRequest is in the correct state.
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

                // Call hook functions with the intercepted request.
                for (const fn of hookFns) {
                    fn(request);
                    if (request.abort) return;
                }

                // Restore original XMLHttpRequest settings.
                realXhrOpen.call(xhr, request.method, request.url, ...req.remainArgs);
                data = request.data;
                for (const header in request.headers) {
                    xhrProto.setRequestHeader.call(xhr, header, request.headers[header]);
                }

                // Intercept and modify response properties.
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

        // Function to hook response properties for fetch requests.
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

        // Function to intercept and modify the 'fetch' method.
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

                // Convert Headers object to a plain object for compatibility.
                if (init.headers.toString() === '[object Headers]') {
                    for (const [key, val] of init.headers) {
                        request.headers[key] = val;
                    }
                } else {
                    request.headers = {...init.headers};
                }

                // Call hook functions with the intercepted request.
                for (const fn of hookFns) {
                    fn(request);
                    if (request.abort) return Promise.reject('aborted');
                }

                // Modify request properties based on hooks.
                url = request.url;
                init.method = request.method;
                init.headers = request.headers;
                init.body = request.data;

                // Intercept and modify fetch response properties.
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

            // If not a string URL, call the original fetch.
            return realFetch.call(win, url, init);
        }

        // Replace XMLHttpRequest methods with the hooking functions.
        xhrProto.open = fakeXhrOpen;
        xhrProto.send = fakeXhrSend;

        // Replace 'fetch' with the hooking function.
        win.fetch = fakeFetch;

        // Public methods of the 'requests' object.
        return {
            // Hook function to add custom behavior when making requests.
            hook: fn => hookFns.push(fn),

            // Protect XMLHttpRequest and fetch from being modified.
            protect: () => {
                readOnly(win, 'XMLHttpRequest');
                readOnly(xhrProto, 'open');
                readOnly(xhrProto, 'send');
                readOnly(win, 'fetch');
            },

            // Unhook XMLHttpRequest and fetch, restoring the original methods.
            unhook: () => {
                writable(win, 'XMLHttpRequest');
                writable(xhrProto, 'open', realXhrOpen);
                writable(xhrProto, 'send', realXhrSend);
                writable(win, 'fetch', realFetch);
            }
        };
    }();

    // Hook a specific request for QuillBot Premium.
    requests.hook(request => {
        if (request.url.endsWith('get-account-details')) {
            request.response = res => {
                // Intercept and modify the response to unlock QuillBot Premium.
                const json = JSON.parse(res.responseText);
                const a = "data" in json ? json.data : json;
                a.profile.accepted_premium_modes_tnc = true;
                a.profile.premium = true;
                res.responseText = JSON.stringify("data" in json ? (json.data = a, json) : a);
            };
        }
    });

})();

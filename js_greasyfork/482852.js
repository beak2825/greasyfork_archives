// ==UserScript==
// @name         浏览器功能包
// @namespace    http://tampermonkey.net/
// @version      0.2.8.1
// @description  修改浏览器的一些配置，使脚本可以作弊
// @author       Tenfond
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/482852/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8A%9F%E8%83%BD%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/482852/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8A%9F%E8%83%BD%E5%8C%85.meta.js
// ==/UserScript==
 
(function () {
    try {
        Object.defineProperty(console, "clear", {
            value: function () {
                console.error("禁止清除控制台");
            },
            writable: false,
            enumerable: true,
            configurable: false
        });
    } catch (e) {
        console.error(e.message);
    }
 
    document.root = document.querySelector(":root");
    document.hide = (function () {
        const hidden = document.createElement("hidden");
        hidden.setAttribute("style", "visibility: hidden; display: none");
        document.root.appendChild(hidden);
        return function hide(node) {
            hidden.appendChild(node);
        };
    })();
 
    try {
        const timers = {
                "Timeout": {},
                "Interval": {}
            },
            setTimeout = window.setTimeout,
            setInterval = window.setInterval,
            clearTimeout = window.clearTimeout,
            clearInterval = window.clearInterval;
        window.setTimeout = function (handler, timeout, ...arguments) {
            const handle = setTimeout.apply(this, [handler, timeout].concat(arguments));
            timers["Timeout"][handle] = {
                "handler": handler,
                "timeout": timeout,
                "arguments": arguments
            };
            return handle;
        };
        window.setInterval = function (handler, timeout, ...arguments) {
            const handle = setInterval.apply(this, [handler, timeout].concat(arguments));
            timers["Interval"][handle] = {
                "handler": handler,
                "timeout": timeout,
                "arguments": arguments
            };
            return handle;
        };
        window.getAllTimeout = function () {
            return timers["Timeout"];
        };
        window.getAllInterval = function () {
            return timers["Interval"];
        };
        window.getTimeout = function (handle) {
            return timers["Timeout"][handle];
        };
        window.getInterval = function (handle) {
            return timers["Interval"][handle];
        };
        window.clearTimeout = function (handle) {
            clearTimeout.apply(this, arguments);
            delete timers["Timeout"][handle];
        };
        window.clearInterval = function (handle) {
            clearInterval.apply(this, arguments);
            delete timers["Interval"][handle];
        };
    } catch (e) {
        console.error(e.message);
    }
 
    // event 可信任事件
    (function () {
        try {
            const addEventListener = EventTarget.prototype.addEventListener;
            Object.defineProperty(EventTarget.prototype, "addEventListener", {
                value: function (type, callback, options = false) {
                    return addEventListener.apply(this, [type, type === "click" ? function (event) {
                        const object = {};
                        for (const p in event) {
                            object[p] = typeof event[p] === "function" ? event[p].bind(event) : event[p];
                        }
                        object.isTrusted = true;
                        arguments[0] = Object.setPrototypeOf(object, event);
                        return callback.apply(this, arguments);
                    } : callback, options]);
                },
                writable: false,
                enumerable: true,
                configurable: false
            });
        } catch (e) {
            console.error(e.message);
        }
    })();
 
    // 定义 location.hashCode 获取 href的hash值
    (function () {
        try {
            Object.defineProperty(location, "hashCode", {
                enumerable: true,
                configurable: false,
                get: function () {
                    let code = 0;
                    for (const v of location.href) {
                        code += (code << 7) + v.charCodeAt(0);
                    }
                    // 返回值在 JavaScript 中的取值范围 [-2147483648,4294967294]
                    return code;
                }
            });
        } catch (e) {
            console.error(e.message);
        }
        let hashCode = location.hashCode, onchange = null;
        try {
            Object.defineProperty(location, "onchange", {
                enumerable: true,
                configurable: false,
                get: function () {
                    return onchange;
                },
                set: function (handler) {
                    if (typeof handler === "function" || Boolean(handler) === false) {
                        onchange = handler;
                    } else {
                        console.error("Uncaught (in onchange) TypeError: " + handler + " is not a function.")
                    }
                }
            });
            setInterval(function () {
                if (hashCode !== location.hashCode) {
                    hashCode = location.hashCode;
                    if (typeof onchange === "function") onchange();
                }
            }, 500);
        } catch (e) {
            console.error(e.message);
        }
    })();
 
    window.searchToJSON = function searchToJSON(search) {
        if (search) {
            return JSON.parse("{\"" + decodeURIComponent(search.substring(1)
                .replace(new RegExp("\"", "g"), '\\"')
                .replace(new RegExp("&", "g"), '","')
                .replace(new RegExp("=", "g"), '":"')) + "\"}");
        } else {
            return null;
        }
    };
 
    window.hrefToLocation = function hrefToLocation(href) {
        let location = {href: href}, c = 0, start = 0, port, search;
        for (let i = 0; i < href.length; i++) {
            if (href[i] === "/") {
                if (++c === 1) {
                    location.protocol = href.substring(start, i);
                } else if (c === 3) {
                    location.host = href.substring(start, i);
                    location.origin = href.substring(0, i);
                    if (port) {
                        location.port = href.substring(port, i);
                    } else {
                        location.hostname = location.host;
                        location.port = "";
                    }
                }
                if (c <= 3) {
                    start = i + 1;
                }
            } else if (href[i] === ":" && c === 2) {
                location.hostname = href.substring(start + 1, i);
                port = i + 1;
            } else if (href[i] === "?" && !search) {
                location.pathname = href.substring(start - 1, i);
                search = i;
            } else if (href[i] === "#" && !location.hash) {
                location.hash = href.substring(i);
                if (search) {
                    location.search = href.substring(search, i);
                } else {
                    location.search = "";
                    location.pathname = href.substring(start - 1, i);
                }
                break;
            }
        }
        if (typeof location.host === "undefined") {
            if (c < 2) {
                location.host = location.hostname = location.port = location.origin = "";
            } else if (c === 2) {
                location.host = href.substring(start);
                location.origin = href;
                if (typeof location.hostname === "undefined") {
                    location.hostname = location.host;
                    location.port = "";
                } else {
                    location.port = href.substring(port);
                }
            }
            location.pathname = location.hash = "";
        } else if (typeof location.pathname === "undefined") {
            location.pathname = href.substring(start - 1);
            location.search = location.hash = "";
        } else if (typeof location.search === "undefined") {
            if (search) {
                location.search = href.substring(search);
            } else {
                location.search = "";
            }
            location.hash = "";
        } else if (typeof location.hash === "undefined") {
            location.hash = "";
        }
        return location;
    };
 
    window.xmlHttpRequest = function xmlHttpRequest(handler = {}) {
        function xhrToArgs(xhr) {
            if (xhr.constructor.name === "XMLHttpRequest") return {
                // "onabort": xhr["onabort"],
                // "onerror": xhr["onerror"],
                // "onload": xhr["onload"],
                // "onloadend": xhr["onloadend"],
                // "onloadstart": xhr["onloadstart"],
                // "onprogress": xhr["onprogress"],
                // "onreadystatechange": xhr["onreadystatechange"],
                // "ontimeout": xhr["ontimeout"],
                "abort": function () {
                    return xhr["abort"]();
                },
                "finalUrl": xhr["responseURL"],
                "responseHeaders": (function () {
                    const headers = {};
                    xhr["getAllResponseHeaders"]().split("\r\n").forEach(function (header) {
                        header = header.split(": ");
                        headers[header[0]] = header[1];
                    });
                    return headers;
                })(),
                "getResponseHeader": function (name) {
                    return xhr["getResponseHeader"](name);
                },
                "overrideMimeType": function (mime) {
                    return xhr["overrideMimeType"](mime);
                },
                "responseType": xhr["responseType"],
                "response": xhr["response"],
                "responseText": (function () {
                    try {
                        return xhr["responseText"];
                    } catch (e) {
                        console.error(e.message);
                        return e;
                    }
                })(),
                "responseXML": (function () {
                    try {
                        return xhr["responseXML"];
                    } catch (e) {
                        console.error(e.message);
                        return e;
                    }
                })(),
                "readyState": xhr["readyState"],
                "status": xhr["status"],
                "statusText": xhr["statusText"],
                "timeout": xhr["timeout"],
                // "upload": xhr["upload"],
                // "withCredentials": xhr["withCredentials"]
            }; else return xhr.constructor.name;
        }
 
        if (typeof handler === "string") handler = {url: handler};
        const request = new XMLHttpRequest();
        if (handler.onreadystatechange) request.onreadystatechange = function (event) {
            return handler.onreadystatechange(xhrToArgs(request), event);
        };
        request.open(handler.method ? handler.method.toUpperCase() : "GET", handler.url ? handler.url : location.href, handler.async ? handler.async : true, handler.user ? handler.user : null, handler.password ? handler.password : null);
        if (handler.headers) for (let header in handler.headers) request.setRequestHeader(header, handler.headers[header]);
        if (handler.onabort) request.onabort = function (event) {
            return handler.onabort(xhrToArgs(request), event);
        };
        if (handler.onerror) request.onerror = function (event) {
            return handler.onerror(xhrToArgs(request), event);
        };
        if (handler.onload) request.onload = function (event) {
            return handler.onload(xhrToArgs(request), event);
        };
        if (handler.onloadend) request.onloadend = function (event) {
            return handler.onloadend(xhrToArgs(request), event);
        };
        if (handler.onloadstart) request.onloadstart = function (event) {
            return handler.onloadstart(xhrToArgs(request), event);
        };
        if (handler.onprogress) request.onprogress = function (event) {
            return handler.onprogress(xhrToArgs(request), event);
        };
        if (handler.ontimeout) request.ontimeout = function (event) {
            return handler.ontimeout(xhrToArgs(request), event);
        };
        if (handler.responseType) request.responseType = handler.responseType;
        if (handler.overrideMimeType) request.setRequestHeader("Content-Type", handler.overrideMimeType);
        if (handler.data) {
            request.send(JSON.stringify(handler.data));
        } else {
            request.send();
        }
        return request;
    };
 
    window.ready = function ready(handler, readyState = "interactive") {
        // "loading": 表示文档还在加载中，即处于“正在加载”状态。
        // "interactive": 文档已经结束了“正在加载”状态，DOM 元素可以被访问。但是像图像，样式表和框架等资源依然还在加载。
        // "complete": 页面所有内容都已被完全加载。
        let intervalId = setInterval(function (states = ["loading", "interactive", "complete"]) {
            if (states.indexOf(document.readyState.toLowerCase()) >= states.indexOf(readyState.toLowerCase())) {
                clearInterval(intervalId);
                if (typeof handler === "function") {
                    handler();
                } else {
                    console.error("Uncaught (in ready) TypeError: " + handler + " is not a function.");
                }
            }
        });
    };
})();
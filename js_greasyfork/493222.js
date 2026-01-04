// ==UserScript==
// @name         dy-tools
// @namespace    dy-tools
// @version      0.0.3
// @description  注入一些函数工具到devtools
// @author       Deyu
// @include      *
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=etc4.com
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/qs@6.12.1/dist/qs.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/493222/dy-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/493222/dy-tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const {get, isBoolean, isNull, isNumber, isUndefined} = _
    function parseURLProtocol(url, protocol = "https:") {
        if (/^\/\//.test(url))
            return protocol + url;
        else if (!/:\/\//.test(url))
            return `${protocol}//${url}`;
        else
            return url;
    }
    function parseURL(url = location.href, baseOrigin) {
        const getHostName = (url2) => {
            const match = url2.match(/:\/\/(www\d?\.)?(.[^/:]+)/i);
            if (match != null && match.length > 2 && typeof match[2] === "string" && match[2].length > 0)
                return match[2];
            else
                return null;
        };
        const getDomain = (url2) => {
            const hostName = getHostName(url2);
            let domain = hostName;
            if (hostName != null) {
                const parts = hostName.split(".").reverse();
                if (parts != null && parts.length > 1) {
                    domain = `${parts[1]}.${parts[0]}`;
                    if (hostName.toLowerCase().includes(".co.uk") && parts.length > 2)
                        domain = `${parts[2]}.${domain}`;
                }
            }
            return domain || "";
        };
        const createURL = () => {
            try {
                return new URL(url, baseOrigin || location.origin);
            } catch (e) {
                return new URL(parseURLProtocol(url));
            }
        };
        const a = createURL();
        return {
            href: a.href,
            url: `${a.protocol}//${a.hostname}${a.pathname.replace(/^([^/])/, "/$1")}${a.search}`,
            origin: `${a.protocol}//${a.hostname}`,
            protocol: a.protocol,
            host: a.hostname,
            port: a.port,
            pathname: a.pathname.replace(/^([^/])/, "/$1"),
            search: a.search,
            hash: a.hash.replace("#", ""),
            params: function() {
                const ret = {};
                const seg = a.search.replace(/^\?/, "").split("&");
                const len = seg.length;
                let i = 0;
                for (; i < len; i++) {
                    if (!seg[i])
                        continue;
                    const [key, value] = seg[i].split("=");
                    ret[key] = value;
                }
                return ret;
            }(),
            file: (a.pathname.match(/\/([^/?#]+)$/i) || [""])[1],
            domain: getDomain(a.href)
        };
    }
    const dict = {
        dayjs_fmt_str: "YYYY-MM-DD:HH:mm:ss"
    }
    const nativeMap = {};
    function getRow(row, path, defaultValue = "-", parseFun) {
        const value = get(row, path);
        if (!isUndefined(value) && !isNull(value) && parseFun)
            return fmt(parseFun(value), defaultValue);
        return fmt(value, defaultValue);
    }
    function fmt(v, defaultValue) {
        if (isNumber(v) || isBoolean(v))
            return v;
        return v || defaultValue;
    }
    function useNativeFun(funPath, funName) {
        const nativeFun = getRow(nativeMap, funPath, null);
        if (nativeFun)
            return nativeFun;
        const currentFun = getRow(globalThis, funPath, null);
        if (currentFun.toString().toString() !== `function ${funName}() { [native code] }`) {
            const iframe = document.createElement("iframe");
            Object.assign(iframe.style, {
                width: 0,
                height: 0,
                display: "none",
                border: 0
            });
            document.body.appendChild(iframe);
            nativeMap[funPath] = getRow(iframe.contentWindow, funPath, null);
            return nativeMap[funPath];
        }
        return currentFun;
    }
    globalThis.console.log = useNativeFun("console.log", "log")
    const checkType = function(data, expectedType) {
        const types = [
            "Number",
            // 有些值属性也是Number: Infinity 、NaN
            "String",
            "Boolean",
            "Undefined",
            "Null",
            "Function",
            "Object",
            "Array",
            "Atomics",
            // 原子
            "Symbol",
            "Map",
            "Set",
            "Math",
            "RegExp",
            "Error",
            "JSON"
            /// 注意：只有传入JSON类进来才会判断为JSON
        ];
        if (!expectedType) {
            const checks = {};
            types.forEach((v) => {
                checks[getName(v)] = Object.prototype.toString.call(data) === `[object ${v}]`;
            });
            return {
                ...checks,
                type: Object.entries(checks).filter((v) => {
                    return v[1];
                })[0][0]
            };
        }
        const exType = checkType(expectedType).type;
        switch (exType) {
            case "isString": {
                if (types.includes(expectedType)) {
                    return checkType(data).type === getName(expectedType);
                } else {
                    return checkType(data).type === exType;
                }
            }
            case "isFunction": {
                if (Object.prototype.hasOwnProperty.call(expectedType, "name")) {
                    return checkType(data).type === getName(expectedType.name);
                } else {
                    return checkType(data).type === exType;
                }
            }
            default: {
                return checkType(data).type === exType;
            }
        }
    };
    function getName(realName) {
        return `is${realName}`;
    }
    console.debug("devtool-dy inject!")
    window.dy =  {
        parseURL,
        parseURLProtocol,
        _,
        dayjs,
        qs: Qs,
        dict,
        getRow,
        useNativeFun,
        checkType,
    }
})();

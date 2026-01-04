// ==UserScript==
// @name         阻止切屏检测
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  阻止各类切屏检测
// @author       PRO
// @match        https://*.yuketang.cn/*
// @run-at       document-start
// @icon         http://yuketang.cn/favicon.ico
// @grant        unsafeWindow
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/488944/%E9%98%BB%E6%AD%A2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488944/%E9%98%BB%E6%AD%A2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const window = unsafeWindow;
    const blackList = new Set(["visibilitychange", "blur", "pagehide", "mouseleave", "mouseout"]);
    const isDebug = false;
    const log = console.log.bind(console, "[阻止切屏检测]");
    const debug = isDebug ? log : () => { };
    function patchToString(obj, ref) {
        return; // Not enabled for now
        obj.toString = () => ref.toString();
        obj.toString.toString = () => ref.toString.toString();
        obj.toString.toString.toString = obj.toString.toString;
    }
    function patchAddEventListener(obj, name) {
        obj._addEventListener = obj.addEventListener;
        obj.addEventListener = (...args) => {
            if (!blackList.has(args[0])) {
                debug(`allow ${name}.addEventListener`, ...args);
                return obj._addEventListener(...args);
            } else {
                log(`block ${name}.addEventListener`, ...args);
                return undefined;
            }
        };
        patchToString(obj.addEventListener, obj._addEventListener);
    }
    patchAddEventListener(window, "window");
    patchAddEventListener(document, "document");
    document.addEventListener("DOMContentLoaded", () => {
        patchAddEventListener(document.body, "document.body");
    }, { once: true, passive: true, capture: true });
    log("addEventListener hooked!");
    if (isDebug) { // DEBUG ONLY: find out all timers
        window._setInterval = window.setInterval;
        window.setInterval = (...args) => {
            const id = window._setInterval(...args);
            debug("calling window.setInterval", id, ...args);
            return id;
        };
        debug("setInterval hooked!");
        window._setTimeout = window.setTimeout;
        window.setTimeout = (...args) => {
            const id = window._setTimeout(...args);
            debug("calling window.setTimeout", id, ...args);
            return id;
        };
        debug("setTimeout hooked!");
    }
    Object.defineProperties(document, {
        hidden: {
            value: false
        },
        visibilityState: {
            value: "visible"
        },
        hasFocus: {
            value: () => true
        },
        onvisibilitychange: {
            get: () => undefined,
            set: () => { }
        },
        onblur: {
            get: () => undefined,
            set: () => { }
        },
        onmouseleave: {
            get: () => undefined,
            set: () => { }
        },
    });
    log("document properties set!");
    Object.defineProperties(window, {
        onblur: {
            get: () => undefined,
            set: () => { }
        },
        onpagehide: {
            get: () => undefined,
            set: () => { }
        },
    });
    log("window properties set!");
})();

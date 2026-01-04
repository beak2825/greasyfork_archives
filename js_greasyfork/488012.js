"use strict";
// ==UserScript==
// @name         Tools
// @namespace    Paul-16098
// @description  paul Tools
// @version      2.2.10.0
// @match        *://*/*
// @author       paul
// @license      MIT
// @grant        GM_getValue
// @run-at       document-start
// @grant        unsafeWindow
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL https://update.greasyfork.org/scripts/488012/Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/488012/Tools.meta.js
// ==/UserScript==
const _unsafeWindow = (() => {
    if (!(typeof unsafeWindow === "undefined")) {
        return unsafeWindow;
    }
})() ??
    window ??
    globalThis; //兼容 ios userscripts 的寫法
const IS_DEBUG_LOG = GM_getValue("debug.debug_log", false);
function set_gm() {
    let debug = console.debug;
    {
        // #tag SET_GM_INIT
        var _GM_xmlhttpRequest, _GM_registerMenuCommand, _GM_notification, _GM_addStyle, _GM_openInTab, _GM_info, _GM_setClipboard;
        {
            // #tag _GM_xmlhttpRequest
            if (typeof GM_xmlhttpRequest !== "undefined") {
                _GM_xmlhttpRequest = GM_xmlhttpRequest;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.xmlHttpRequest !== "undefined") {
                _GM_xmlhttpRequest = GM.xmlHttpRequest;
            }
            else {
                _GM_xmlhttpRequest = (f) => {
                    fetch(f.url, {
                        method: f.method || "GET",
                        body: f.data,
                        headers: f.headers,
                    })
                        .then((response) => response.text())
                        .then((data) => {
                        f.onload && f.onload({ response: data });
                    })
                        .catch(f.onerror && f.onerror());
                };
            }
        }
        {
            // #tag _GM_registerMenuCommand
            if (typeof GM_registerMenuCommand !== "undefined") {
                _GM_registerMenuCommand = GM_registerMenuCommand;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.registerMenuCommand !== "undefined") {
                _GM_registerMenuCommand = GM.registerMenuCommand;
            }
            else {
                _GM_registerMenuCommand = (s, f) => {
                    debug(s);
                    debug(f);
                };
            }
        }
        {
            // #tag _GM_info
            if (typeof GM_info !== "undefined") {
                _GM_info = GM_info;
            }
            else if (typeof GM !== "undefined" && typeof GM.info !== "undefined") {
                _GM_info = GM.info;
            }
            else {
                _GM_info = { script: {} };
            }
        }
        {
            // #tag _GM_notification
            if (typeof GM_notification !== "undefined") {
                _GM_notification = GM_notification;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.notification !== "undefined") {
                _GM_notification = GM.notification;
            }
            else {
                _GM_notification = (s) => {
                    alert("_GM_notification: " + String(s.text || s));
                };
            }
        }
        {
            // #tag _GM_openInTab
            if (typeof GM_openInTab !== "undefined") {
                _GM_openInTab = GM_openInTab;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.openInTab !== "undefined") {
                _GM_openInTab = GM.openInTab;
            }
            else {
                _GM_openInTab = (s, t) => {
                    window.open(s);
                    debug(t);
                };
            }
        }
        {
            // #tag _GM_addStyle
            if (typeof GM_addStyle !== "undefined") {
                _GM_addStyle = GM_addStyle;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.addStyle !== "undefined") {
                _GM_addStyle = GM.addStyle;
            }
            else {
                _GM_addStyle = (CssStr) => {
                    let styleEle = document.createElement("style");
                    styleEle.classList.add("_GM_addStyle");
                    styleEle.innerHTML = CssStr;
                    document.head.appendChild(styleEle);
                    return styleEle;
                };
            }
        }
        {
            // #tag _GM_setClipboard
            if (typeof GM_setClipboard !== "undefined") {
                _GM_setClipboard = GM_setClipboard;
            }
            else if (typeof GM !== "undefined" &&
                typeof GM.setClipboard !== "undefined") {
                _GM_setClipboard = GM.setClipboard;
            }
            else {
                _GM_setClipboard = (s, i) => {
                    debug(s);
                    debug(i);
                };
            }
        }
    }
}
function remove_ele(...args) {
    try {
        if (args && args.length > 0) {
            args.forEach((args) => {
                if (IS_DEBUG_LOG) {
                    console.log("args: ", args);
                    console.log("document.querySelectorAll(args): ", document.querySelectorAll(args));
                }
                if (document.querySelectorAll(args).length !== 0) {
                    document.querySelectorAll(args).forEach((ele) => {
                        ele.remove();
                    });
                }
                else {
                    console.debug(args, "is not a Html Element.");
                }
            });
        }
        else {
            throw new Error("fn remove error, args is not a array or args.length =< 0");
        }
    }
    catch (e) {
        console.error(e);
        return [false, args, e];
    }
    return [true, args];
}
function setMenu(name, fn, showValueMapping) {
    let trueShowMapping = showValueMapping ?? {
        true: "true",
        false: "false",
    };
    let showName = name.replaceAll("_", " ");
    let getValue = GM_getValue(name);
    let showValue = trueShowMapping[getValue];
    let trueFn = fn ??
        ((ev) => {
            GM_setValue(name, !getValue);
            window.location.reload();
        });
    return GM_registerMenuCommand(`${showName}: ${showValue}`, trueFn);
}
//# sourceMappingURL=Tools.user.js.map
"use strict";
// ==UserScript==
// @name         Ban Comic ADs
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Ban Comic's ADs
// @author       BCAs
// @match        *://m.zhwsxx.com/*
// @match        *://sexmh.top/*
// @match        *://bmhl.xyz/*
// @match        *://m.fmhuaaa.net/*
// @match        *://boylove.cc/*
// @match        *://boylove.house/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        unsafeWindow
// @webRequest   [{"selector": "*.qpic.*", "action": "cancel"}, {"selector": "*.ad5lm.*", "action": "cancel"}]
// @webRequest   [{"selector": "*.cnzz.*", "action": "cancel"}, {"selector":"https://www.googletagmanager.com/*","action":"cancel"}]
// @webRequest   [{"selector":"https://ads.*.xyz/*", "action":"cancel"}, {"selector": "*msshw*", "action":"cancel"}, {"selector": "*bridline*", "action":"cancel"}]
// @webRequest   [{"selector": "*.juicyads.*", "action": "cancel"}]
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425009/Ban%20Comic%20ADs.user.js
// @updateURL https://update.greasyfork.org/scripts/425009/Ban%20Comic%20ADs.meta.js
// ==/UserScript==
if (typeof GM_addStyle === "undefined") {
    // @ts-ignore
    GM_addStyle = function (css) {
        let s = document.createElement("style");
        s.innerText = css;
        document.head.append(s);
    };
}
class zhwsxx {
    constructor() {
        this.defineSetter(0);
        this.hook_create();
        $(this.hide_ele);
        this.hook_sIsT();
    }
    defineSetter(mode) {
        if (mode == 0) {
            Object.defineProperty(unsafeWindow, "yrxuanfu", {
                set() {
                    throw false;
                }
            });
            // @ts-ignore
            Object.defineProperties(unsafeWindow.Array.prototype, {
                "S": {
                    set() {
                        throw false;
                    }
                },
                "in_array": {
                    set() {
                        throw false;
                    }
                }
            });
        }
        else {
            // @ts-ignore
            unsafeWindow.__defineSetter__("yrxuanfu", function () {
                throw false;
            });
            // @ts-ignore
            unsafeWindow.Array.prototype.__defineSetter__("S", function () {
                throw false;
            });
            // @ts-ignore
            unsafeWindow.Array.prototype.__defineSetter__("in_array", function () {
                throw false;
            });
        }
    }
    hook_create() {
        const self_ = this;
        const cE = unsafeWindow.document.createElement;
        // @ts-ignore
        unsafeWindow.document.createElement = function () {
            // @ts-ignore
            let tmp = cE.apply(this, arguments);
            if (arguments[0] == "div") {
                // @ts-ignore
                tmp.__defineSetter__("id", function (a) {
                    if (tmp.getAttribute("id") == tmp.getAttribute("class") && a.length == 10) {
                        throw false;
                    }
                });
                // @ts-ignore
                tmp.__defineSetter__("className", function (a) {
                    if (tmp.getAttribute("id") == tmp.getAttribute("class") && a.length == 10) {
                        throw false;
                    }
                });
            }
            else if (arguments[0] == "style") {
                // @ts-ignore
                tmp.__defineSetter__("id", function (a) {
                    if (a.length == 11) {
                        let key = a.substring(0, 8);
                        let found = false;
                        document.querySelectorAll("style").forEach(function (ele, index) {
                            if (ele.innerHTML.indexOf(key) != -1) {
                                ele.parentElement?.removeChild(ele);
                                found = true;
                            }
                        });
                        if (found) {
                            throw false;
                        }
                    }
                });
            }
            else if (arguments[0] == "meta") {
                // @ts-ignore
                tmp.__defineSetter__("content", function (a) {
                    if (a == "viewport")
                        throw false;
                });
            }
            // @ts-ignore
            return tmp;
        };
    }
    hook_sIsT() {
        const sI = unsafeWindow.setInterval;
        const sT = unsafeWindow.setTimeout;
        // @ts-ignore
        unsafeWindow.setInterval = function () {
            let func_str = arguments[0].toString();
            if (typeof func_str == "string" && (func_str.indexOf("xid") != -1 || func_str.indexOf("a.transform") != -1))
                throw false;
            // @ts-ignore
            return sI.apply(this, arguments);
        };
        // @ts-ignore
        unsafeWindow.setTimeout = function () {
            let func_str = arguments[0].toString();
            if (typeof func_str == "string" && (func_str.indexOf("a.R()") != -1 || func_str.indexOf("setInterval") != -1))
                throw false;
            // @ts-ignore
            return sT.apply(this, arguments);
        };
    }
    hide_ele() {
        let div_nodelist = document.querySelectorAll("div");
        if (!div_nodelist)
            return;
        div_nodelist.forEach(function (div, _) {
            if (!document.documentElement.contains(div))
                return;
            if (div.id === div.className && (div.id.length == 10 || div.innerHTML.indexOf("ad5lm") != -1)) {
                div.setAttribute("style", "display: none!important;");
                GM_addStyle("#" + div.id + "{display: none!important;}");
            }
        });
    }
}
class sexmh {
    constructor() {
        // hook setInterval 用于对抗反调试
        this.hooksI();
        // hook setTimeout 用于对抗广告
        this.hooksT();
        // 隐藏广告
        this.add_style();
        $(this.hide_ele);
    }
    add_style() {
        GM_addStyle && GM_addStyle("#bl_mobile_float{display: none!important;}");
    }
    hide_ele() {
        let ele = document.querySelector("#bl_mobile_float");
        if (ele && ele.parentNode) {
            ele.parentNode.removeChild(ele);
        }
    }
    hooksT() {
        // @ts-ignore
        const sT = unsafeWindow.setTimeout;
        // @ts-ignore
        unsafeWindow.setTimeout = function () {
            if (arguments[0] && arguments[0].toString().indexOf("bl_mobile_float") != -1) {
                return 0;
            }
            // @ts-ignore
            return sT.apply(this, arguments);
        };
    }
    hooksI() {
        // 对抗反调试
        // @ts-ignore
        const sI = unsafeWindow.setInterval;
        unsafeWindow.setInterval = function () {
            if (arguments[0].toString().indexOf("debugger") != -1) {
                return 0;
            }
            // 对抗广告加载
            if (arguments[0].toString().indexOf("cnzz") != -1) {
                return 0;
            }
            // @ts-ignore
            return sI.apply(this, arguments);
        };
    }
}
class bole {
    constructor() {
        this.hide_ad();
        this.listen_ele();
        $(this.continue_read);
    }
    continue_read() {
        var a = document.querySelectorAll('a');
        for (let b = 0; b < a.length; b++) {
            if (a[b].text == '继续阅读') {
                window.location.reload();
            }
        }
    }
    hide_ad() {
        GM_addStyle("#undefined, [id*='_ad'], [class*='_ad'], #adDisabledBtn, ins {display: none!important;}");
    }
    listen_ele() {
        const observer = new MutationObserver(function (mutationList, observer) {
            mutationList.forEach((mutation) => {
                switch (mutation.type) {
                    case "childList":
                        // @ts-ignore
                        mutation.addedNodes.forEach(function (value, _) {
                            if (value.tagName && value.id && value.className && value.tagName.length == 3 && value.id == value.className && value.id.length == 8) {
                                GM_addStyle("#" + value.id + " {display: none!important;}");
                            }
                        });
                }
            });
        });
        observer.observe(document, {
            childList: true,
            attributes: false,
            subtree: true
        });
    }
}
class fumanhua {
    constructor() {
        this.hide_ele();
    }
    hide_ele() {
        GM_addStyle("[href*='fumanhuapp'] {display: none;}");
    }
}
class boylove_cc {
    constructor() {
        this.hide_ele();
    }
    hide_ele() {
        GM_addStyle(".swiper-container {visibility: hidden !important;}");
        GM_addStyle("#avivid_waterfall {display: none!important;}");
        GM_addStyle(".ad-inline {display: none !important;}");
        GM_addStyle(".home-ad {display: none !important;}");
        GM_addStyle(".ad-body {display: none!important}");
    }
}
if (location.href.indexOf("m.zhwsxx.com") != -1) {
    new zhwsxx();
}
else if (location.href.indexOf("sexmh.top") != -1) {
    new sexmh();
}
else if (location.href.indexOf("bmhl.xyz") != -1) {
    new bole();
}
else if (location.href.indexOf("fmhuaaa.net") != -1) {
    new fumanhua();
}
else if (location.href.search(/boylove\.(cc|house)/) != -1) {
    new boylove_cc();
}

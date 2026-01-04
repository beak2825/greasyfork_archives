// ==UserScript==
// @name         B站-自动隐藏消息气泡
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=508077
// @version      1.0
// @description  自动隐藏消息气泡
// @author       未知的动力
// @match        https://www.bilibili.com/*
// @grant        none
//  @run-at     document-end
// @downloadURL https://update.greasyfork.org/scripts/419064/B%E7%AB%99-%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E6%B6%88%E6%81%AF%E6%B0%94%E6%B3%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/419064/B%E7%AB%99-%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E6%B6%88%E6%81%AF%E6%B0%94%E6%B3%A1.meta.js
// ==/UserScript==
class MonitorDOM {
    config;
    constructor(t, n, e = null, o = "childList") {
        this.ele = t, this.callback = n, this.config = null == e ? {
            attributes: !1,
            childList: !0,
            subtree: !0
        } : e, this.monitorType = o
    }
    startMonitor() {
        let t = this,
            n = new MutationObserver((function (n, e) {
                for (let e of n) e.type == t.monitorType && t.callback()
            }));
        n.observe(t.ele, t.config), t.monitorHandle = n
    }
    stopMonitor() {
        this.monitorHandle.disconnect()
    }
}! function () {
    "use strict";
    let t = document.createEvent("MutationEvents");
    t.initEvent("getMenuList", !0, !1);
    let n = document.body,
        e = null;
    new MonitorDOM(n, (function () {
        let o = n.querySelectorAll(".nav-user-center div.user-con.signin .item");
        null != o && o.length > 0 && (e = o, document.dispatchEvent(t), this.stopMonitor())
    })).startMonitor(), document.addEventListener("getMenuList", (function () {
        if (1 != this.controling) {
            this.controling = !0;
            for (let n = 0; n < e.length; n++) {
                let o = e[n].querySelector("span.name");
                if (null != o && "消息" == o.innerHTML) {
                    function t(t) {}
                    new Promise((function (t, n) {
                        let e = o.parentElement.parentElement;
                        if (null == e) throw new Error("获取异常", "E1... 无法获取消息父元素... ");
                        t(e)
                    })).then(t => {
                        new MonitorDOM(t, (function () {
                            let n = t.querySelector(".num");
                            null != n && (this.stopMonitor(), t.removeChild(n))
                        })).startMonitor()
                    }).catch(t)
                }
            }
        }
    }), !1)
}();
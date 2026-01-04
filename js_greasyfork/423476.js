// ==UserScript==
// @name         ZodGame-自动播放BGM
// @namespace    https://zodgame.xyz/home.php?mod=space&uid=294326
// @version      1.0
// @description  楼主添加的BGM之后，坛友进入帖子将自动播放
// @author       未知的动力
// @match        https://zodgame.xyz/forum.php?mod=viewthread&tid=*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/423476/ZodGame-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BEBGM.user.js
// @updateURL https://update.greasyfork.org/scripts/423476/ZodGame-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BEBGM.meta.js
// ==/UserScript==

// 比如: 
// https://zodgame.xyz/forum.php?mod=viewthread&tid=294029

class MonitorDOM {
    constructor(t, o, n = null, e = "childList") {
        this.ele = t, this.callback = o, this.config = null == n ? {
            attributes: !0,
            childList: !0,
            subtree: !0
        } : n, this.monitorType = e
    }
    startMonitor() {
        let t = this;
        let o = new MutationObserver((function (o, n) {
            for (let n of o) n.type == t.monitorType && t.callback()
        }));
        o.observe(t.ele, t.config), t._monitorHandle = o
    }
    stopMonitor() {
        this._monitorHandle.disconnect()
    }
}! function () {
    "use strict";
    const t = new MonitorDOM(document.documentElement, (function () {
        const o = document.querySelector("audio");
        o && (o.autoplay = !0, o.loop = "loop", t.stopMonitor())
    }));
    t.startMonitor()
}();
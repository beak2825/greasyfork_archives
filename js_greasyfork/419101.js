// ==UserScript==
// @name         王者荣耀-官网壁纸自动抓取
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=508077
// @version      1.0
// @description  自动获取官网上的所有壁纸并且自动下载
// @author       未知的动力
// @match        https://pvp.qq.com/*/wallpaper*
// @grant        GM_download
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/419101/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80-%E5%AE%98%E7%BD%91%E5%A3%81%E7%BA%B8%E8%87%AA%E5%8A%A8%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/419101/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80-%E5%AE%98%E7%BD%91%E5%A3%81%E7%BA%B8%E8%87%AA%E5%8A%A8%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==
class MonitorDOM {
    ele;
    callback;
    config;
    monitorType;
    _monitorHandle;
    constructor(e, t, n = null, l = "childList") {
        this.ele = e, this.callback = t, this.config = null == n ? {
            attributes: !0,
            childList: !0,
            subtree: !0
        } : n, this.monitorType = l
    }
    startMonitor() {
        let e = this;
        let t = new MutationObserver((function (t, n) {
            for (let n of t) n.type == e.monitorType && e.callback()
        }));
        t.observe(e.ele, e.config), e._monitorHandle = t
    }
    stopMonitor() {
        this._monitorHandle.disconnect()
    }
}! function () {
    "use strict";
    let e, t = document.body,
        n = [];
    const l = document.createEvent("MutationEvents");
    l.initEvent("initComputed", !0, !0);
    let i = 1,
        o = null,
        r = null,
        s = document.querySelector(".pagingPanel");

    function a() {
        let l = window.setTimeout(() => {
            let e = document.createElement("p");
            t.appendChild(e), t.removeChild(e), window.clearTimeout(l)
        }, 100);

        function s() {
            if (1 == this.runCallback) return;
            let l = t.querySelectorAll(".p_hd .p_newhero_item");
            null != l && l.length > 0 && (this.runCallback = !0, this.stopMonitor(), function (l) {
                for (let e = 0; e < l.length; e++) {
                    let t = l[e].querySelectorAll("ul li"),
                        i = t[t.length - 1].querySelector("a").href,
                        o = l[e].querySelector("h4").querySelector("a").innerHTML;
                    n.push({
                        link: i,
                        name: o
                    })
                }
                if (i++, i <= o) {
                    r.click(), e.innerHTML = (i / o * 100).toFixed(1) + "%", new MonitorDOM(t, s).startMonitor()
                } else ! function () {
                    let t = '<svg class="downloadIco" t="1608786264235" viewBox="0 0 1024 1024" version="1.1" width="50%" height="50%">\n            <path d="M877.49 381.468H668.638V68.191H355.36v313.277H146.51l365.489 365.49 365.49-365.49zM146.51 851.383v104.425h730.98V851.383H146.51z" p-id="1600"></path>\n            </svg>';
                    e.innerHTML = t;
                    let l = 0,
                        i = 0,
                        o = n.length,
                        r = window.setInterval(() => {
                            if (l > n.length - 1) {
                                window.clearInterval(r);
                                let t = '<svg t="1608795386876" class="computedIco" viewBox="0 0 1152 1024" version="1.1" p-id="2614" width="90%" height="90%">\n                    <path\n                    d="M4.266667 576l238.933333-187.733333 204.8 192c0 0 379.733333-328.533333 699.733333-512l0 123.733333C704 580.266667 426.666667 989.866667 426.666667 989.866667L4.266667 576 4.266667 576zM4.266667 576"\n                    p-id="2615"></path>\n                    </svg>';
                                e.innerHTML = t
                            } else e.innerHTML = (i / o * 100).toFixed(1) + "%", GM_download({
                                url: n[l].link,
                                name: n[l].name + ".jpg",
                                saveAs: !1,
                                onload: () => {
                                    i++
                                }
                            }), l++
                        }, 500)
                }()
            }(l))
        }
        e.innerHTML = '<svg class="downloadIco" t="1608786264235" viewBox="0 0 1024 1024" version="1.1" width="50%" height="50%">\n                <path d="M877.49 381.468H668.638V68.191H355.36v313.277H146.51l365.489 365.49 365.49-365.49zM146.51 851.383v104.425h730.98V851.383H146.51z" p-id="1600"></path>\n                </svg>', new MonitorDOM(t, s).startMonitor()
    }
    e = document.createElement("div"), e.style.position = "fixed", e.style.zIndex = "9999", e.style.right = "10px", e.style.bottom = "10px", e.style.width = "50px", e.style.height = "50px", e.style.lineHeight = "50px", e.style.backgroundColor = "#fff", e.style.color = "#c00", e.style.border = "5px solid #c00", e.style.borderRadius = "50%", e.style.fontSize = "12px", e.style.textAlign = "center", e.style.fontWeight = "900", e.style.cursor = "pointer", e.style.userSelect = "none", e.style.boxShadow = "0px 5px 5px 5px rgba(188,188,188,0.5)", e.style.display = "flex", e.style.justifyContent = "center", e.style.alignItems = "center", e.innerHTML = "下载", t.style.position = "relative", t.appendChild(e), new MonitorDOM(s, (function () {
        if (this.runCallback >= 3) return;
        let e = s.querySelector("span.totalpage"),
            t = s.querySelectorAll("a");
        if (null != e && null != t)
            if (null == this.runCallback) this.runCallback = 1;
            else if (this.runCallback++, this.runCallback >= 3) {
            this.stopMonitor();
            let n = /(\d+)\/(\d+)/gi.exec(e.innerHTML);
            i = n[1], o = n[2];
            for (let e = 0; e < t.length; e++) 1 == t[e].classList.contains("downpage") && "下一页" == t[e].innerHTML && (r = t[e]);
            document.dispatchEvent(l)
        }
    })).startMonitor(), document.addEventListener("initComputed", () => {
        e.addEventListener("click", a, !1)
    })
}();
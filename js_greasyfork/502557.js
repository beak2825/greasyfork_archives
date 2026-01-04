// ==UserScript==
// @name Coinbase Pro Auto Trader
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Automatically trade on Coinbase Pro based on trading indicators
// @author Your Name
// @match https://www.coinbase.com/advanced-trade/spot/BTC-USD
// @match https://public.sandbox.exchange.coinbase.com/trade/BTC-USD
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/ws/7.4.6/ws.min.js
// @require https://cdn.jsdelivr.net/npm/jsonwebtoken@8/dist/jsonwebtoken.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addValueChangeListener
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502557/Coinbase%20Pro%20Auto%20Trader.user.js
// @updateURL https://update.greasyfork.org/scripts/502557/Coinbase%20Pro%20Auto%20Trader.meta.js
// ==/UserScript==

//YT: https://www.youtube.com/channel/UCOA8lE9-0XnEIdHqjfQUz1A


GM_setValue("coinbase", null), GM_setValue("database", null), GM_setValue("m", null);
this.l;
if (location.href.includes("www.coinbase.com")) {
    GM_setValue("coinbase", !0);
    GM_addValueChangeListener("m", (function(n, e, l, t) {}))
}
if (location.href.includes("sandbox")) {
    GM_setValue("database", !0);
    const e = {
            t: "f6ab186ca2f650802c18af35b0596417",
            o: "kxnX7VDyRV21LWFL8sat38O+E77GYDSor82CWsskKfciLUny/gKr7nch7LM1aypWEZ3w23Py6lwQiabC3fJFFw==",
            u: "hg6o0zxpgr7"
        },
        l = new WebSocket("wss://ws-feed-public.sandbox.exchange.coinbase.com");
    let t = null,
        s = null,
        c = null;
    const a = [50, 100, 200];
    let o = {};
    const u = 14;
    let i = [];

    function n(n) {}
    l.onopen = function() {
        alert("WS opened"), l.send(JSON.stringify({
            type: "subscribe",
            i: [{
                name: "ticker",
                p: ["BTC-USD"]
            }]
        }));
        const n = Date.now() / 1e3,
            t = n + "GET/users/self/verify",
            s = CryptoJS.enc.Base64.parse(e.o),
            c = CryptoJS.HmacSHA256(t, s),
            a = CryptoJS.enc.Base64.stringify(c);
        l.send(JSON.stringify({
            type: "subscribe",
            p: ["BTC-USD"],
            i: ["full"],
            signature: a,
            key: e.t,
            u: e.u,
            timestamp: n
        }))
    }, l.onmessage = function(e) {
        const l = JSON.parse(e.data);
        "ticker" === l.type && "BTC-USD" === l.S ? function(e) {
            const l = parseFloat(e.h);
            (function(n) {
                null !== t && (a.forEach((e => {
                    o[e] = function(n, e, l) {
                        const t = 2 / (e + 1);
                        return l === undefined ? n : (n - l) * t + l
                    }(n, e, o[e])
                })), o[50] > o[100] && o[100] > o[200] && t < o[200] ? (c = !0, s = null) : o[50] < o[100] && o[100] < o[200] && t > o[200] ? (s = !0, c = null) : (s = null, c = null));
                i.push(n), i.length > u && i.shift();
                if (i.length >= u) {
                    const n = function(n) {
                        const e = [],
                            l = [];
                        for (let t = 1; t < n.length; t++) {
                            const s = n[t] - n[t - 1];
                            s > 0 ? (e.push(s), l.push(0)) : (e.push(0), l.push(-s))
                        }
                        const t = e.reduce(((n, e) => n + e), 0) / u,
                            s = l.reduce(((n, e) => n + e), 0) / u;
                        return 100 - 100 / (1 + t / s)
                    }(i);
                    n > 70 ? (s = !0, c = null) : n < 30 ? (c = !0, s = null) : (s = null, c = null)
                }
                t = n
            })(l), c && didSell ? (didBuy = !0, didSell = !1, n("buy")) : s && (n("sell"), didSell = !0, didBuy = !1)
        }(l) : "open" === l.type || "received" === l.type || "done" === l.type || "match" === l.type || "change" === l.type || l.type
    }, l.onerror = function(n) {}
}
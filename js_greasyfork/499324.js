// ==UserScript==
// @name         某瓜视频电影密钥获取
// @namespace    https://94cat.com/
// @version      0.2
// @description  获取某瓜视频 电影视频 解密密钥
// @author       mz
// @match        https://www.ixigua.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @license      GPL v3
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/499324/%E6%9F%90%E7%93%9C%E8%A7%86%E9%A2%91%E7%94%B5%E5%BD%B1%E5%AF%86%E9%92%A5%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/499324/%E6%9F%90%E7%93%9C%E8%A7%86%E9%A2%91%E7%94%B5%E5%BD%B1%E5%AF%86%E9%92%A5%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const key = [];

    const _xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method) {
        method = method.toUpperCase();
        this.addEventListener("readystatechange", function (event) {
            if (this.status != 200) { return; }
            if (typeof this.response != "object") { return; }
            if (!this.response || !this._data || !this.response?.play_licenses) { return; }
            const _data = JSON.parse(this._data);
            const vid = _data.license_request[0].vid;
            const kids = _data.license_request[0].kids;
            const base64Key = this.response?.play_licenses[vid][kids];
            base64Key && key.push(Wc(atob(base64Key)));
        });
        _xhrOpen.apply(this, arguments);
    }
    XMLHttpRequest.prototype.open.toString = function () {
        return _xhrOpen.toString();
    }

    GM_registerMenuCommand("获取密钥", function () {
        if(key.length){
            GM_setClipboard(key.join("\n"), "text", ()=>{
                alert("已经复制密钥");
            });
        }else{
            alert("未获取到密钥");
        }
    });

    function Wc(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1
            , r = e;
        t = t || r.length;
        var i = mc(r, t)
            , a = i.convertKey
            , o = i.convertLen;
        switch (i.methodLen,
        i.method) {
            case "11":
            case "22":
            case "appdevice":
            case "webdevice":
                a = yc(a, o, n);
                break;
            case "app_v2":
            case "web_v2":
                a = Jc(a, o, n)
        }
        var l = o - Vc(a[0]) - 1
            , U = new Array(l + 1);
        U[l] = "";
        var d = 0;
        for (d = 0; d < l; d++)
            U[d] = a[d + 1];
        return U.join("")
    }
    function Jc(e, t, n) {
        var r = 85
            , i = 250;
        kc(e);
        for (var a, o, l, U = 0; U < t; U++) {
            (l = e[U].charCodeAt(0)) > 127 && (l -= 256),
                U % 2 == 1 ? (a = r ^ l,
                    r = l,
                    o = i) : (a = i ^ l,
                        i = l,
                        o = r),
                a > 127 && (a -= 256);
            var d = (0 === n ? vc(a, U, 21) : Zc(a, U, 21)).charCodeAt(0);
            d > 127 && (d -= 256);
            var c = d - o;
            c < 0 && (c += 256),
                e[U] = String.fromCharCode(c)
        }
        return kc(e),
            e
    }
    function mc(e, t) {
        var n, r = (e[0].charCodeAt() ^ e[1].charCodeAt() ^ e[2].charCodeAt()) - "0".charCodeAt(0), i = t - r - 1, a = new Array(i), o = new Array(r);
        for (n = r; n > 0; n--)
            o[r - n] = String.fromCharCode(e[t - r - 2].charCodeAt() ^ e[t - r - 1].charCodeAt() ^ e[t - n].charCodeAt());
        for (n = 0; n < i; n++)
            a[n] = e[n + 1];
        return {
            convertKey: a,
            convertLen: i,
            method: o.join(""),
            methodLen: r
        }
    }
    function kc(e) {
        for (var t, n = e.length, r = 0; r < n && r !== n - 1; r += 2)
            t = e[r],
                e[r] = e[r + 1],
                e[r + 1] = t;
        return e
    }
    function Zc(e, t, n) {
        var r = e + Sc(t) + n;
        return String.fromCharCode(255 & r)
    }
    function Sc(e) {
        var t = 0;
        for (t = 0; 0 !== e; t++)
            e &= e - 1;
        return t
    }
    function Vc(e) {
        return e >= "0" && e <= "9" ? e.charCodeAt(0) - "0".charCodeAt(0) : e >= "a" && e <= "z" ? e.charCodeAt(0) - "a".charCodeAt(0) + 10 : 255
    }
})();
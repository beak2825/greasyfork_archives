// ==UserScript==
// @name         HTTP TO HTTPS
// @namespace    https://zfdev.com/
// @version      0.1
// @description  设置HTTP网页自动跳转到HTTPS
// @author       ZFDev
// @include      /.*/
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382301/HTTP%20TO%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/382301/HTTP%20TO%20HTTPS.meta.js
// ==/UserScript==

!function() {
    "use strict";
    const t = location.host, e = "https:" === location.protocol, n = function isdefualtHttps() {
        if (e) {
            let e = GM_getValue(t);
            if (null === e) {
                return !0;
            }
            if (1 == e) {
                return !1;
            }
            return !0;
        }
        return !1;
    }();
    function setBtnStart() {
        trigger(), whetherJump() && toHTTPS();
    }
    function whetherJump() {
        if (e) {
            return !1;
        }
        return 1 == GM_getValue(location.host);
    }
    function trigger() {
        let e = GM_getValue(t), n = 1;
        null === e ? n = 1 : 1 == e && (n = 0), GM_setValue(t, n);
    }
    function toHTTPS() {
        if (e) {
            return;
        }
        let t = location.href.replace("http://", "https://");
        self.location.href = t;
    }
    !function main() {
        if (n) {
            return;
        }
        let r = "";
        if (whetherJump()) {
            if (r = "\u5173", !e) {
                return void toHTTPS();
            }
        } else {
            r = "\u5f00";
        }
        GM_registerMenuCommand("[ " + t + " ] - " + r, setBtnStart);
    }();
}();
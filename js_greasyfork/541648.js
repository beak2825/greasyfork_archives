// ==UserScript==
// @name         Blooket Get Max Rewards
// @namespace    http://tampermonkey.net/
// @version      Beta
// @description  When you earn any exp or tokens, this script turns it into the max possible amount earnable daily (tokens: 500, exp: 300).
// @author       Splxff
// @match        https://*.blooket.com/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blooket.com
// @downloadURL https://update.greasyfork.org/scripts/541648/Blooket%20Get%20Max%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/541648/Blooket%20Get%20Max%20Rewards.meta.js
// ==/UserScript==

! function() {
    (() => {
        const e = document.createElement("iframe");
        document.body.appendChild(e), window.alert = e.contentWindow.alert.bind(window), e.remove()
    })();
    const e = XMLHttpRequest.prototype.open,
        t = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(t, n, d, o, r) {
        return this._url = n, e.apply(this, arguments)
    }, XMLHttpRequest.prototype.send = function(e) {
        try {
            if ("string" == typeof e) {
                let t = JSON.parse(e);
                t?.addedTokens && (t.addTokens = 250, t.addedXp = 300, alert("Earned max rewards"), e = JSON.stringify(t))
            } else if (e instanceof FormData) {
                let t = !1;
                e.forEach(((e, n) => {
                    "addedTokens" === n && (t = !0)
                })), t && (e.set("addTokens", "250"), e.set("addedXp", "300"), alert("Earned max rewards"))
            }
        } catch (e) {}
        t.call(this, e)
        return t.call(this, e)
    }
}();
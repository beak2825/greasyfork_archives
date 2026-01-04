// ==UserScript==
// @name         4KHD Shortlink Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  bypass shortlink 4khd
// @author       Yu
// @match        https://m.4khd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4khd.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479540/4KHD%20Shortlink%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/479540/4KHD%20Shortlink%20Bypass.meta.js
// ==/UserScript==

async function getStringHTML(url) {
    try {
        const resp = await fetch(url)
        const text = await resp.text()
        return text
    } catch(err) {
        throw new Error("Gagal fetch website")
    }
}

(function() {
    'use strict';

    if(window.location.pathname == "/ads" && document.referrer) {
        setTimeout(() => alert(document.referrer), 5000)
        getStringHTML(document.referrer)
        .then((data) => {
            const html = document.createElement("html");
            html.innerHTML = data;
            const link = html.querySelector("#zc_tiaozhuan a")
            if(link) {
                window.location.href = link.href
            } else {
                alert("Tidak ada link")
            }

        })
        .catch((err) => alert(err))
    } else if(window.location.pathname == "/ads" && !document.referrer) {
        alert("Tidak ada jejak")
    } else {
        const link = document.querySelector("#zc_tiaozhuan a");
        if(link) window.location.href = link.href
    }
})();
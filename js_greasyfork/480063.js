// ==UserScript==
// @name         Up 4Ever Bypass
// @namespace    http://yu.net/
// @version      2.0
// @description  I don't know
// @author       Yu
// @match        https://www.up-4ever.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=up-4ever.net
// @grant        GM_webRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480063/Up%204Ever%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/480063/Up%204Ever%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adsLink = [
        "*://*.googlesyndication.com/*",
        "*://*.cloudfront.net/*",
        "*://pbfnyvl.com/*"
    ]

    GM_webRequest( adsLink.map(link => (
        { selector: {match: link }, action: "cancel" }
    )))

    document.addEventListener("DOMContentLoaded", () => {
        const inputOP = document.querySelector("input[name=op]")

        if(inputOP && inputOP.value === "download1") {
            document.querySelector("input[name='method_free']").click()
        } else if(inputOP && inputOP.value === "download2") {
            setInterval(() => {
                const timer = document.getElementById("countdown")

                if(unsafeWindow.grecaptcha.getResponse().length > 0 && timer.style.visibility === "hidden") {
                    document.querySelector("#downloadbtn").click()
                }
            }, 1000)
        }

        if(document.querySelector("#downLoadLinkButton")) {
            let id = null
            id = setInterval(() => {
                const url = document.getElementById("downLoadLinkButton")
                if(url) {
                    document.location.href = url.getAttribute("href")
                    clearInterval(id)
                }
            }, 1000)
        }
    })
})();
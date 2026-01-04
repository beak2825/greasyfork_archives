// ==UserScript==
// @name         Make Profile Great Again
// @namespace    https://greasyfork.org/zh-CN/scripts/517509-make-profile-great-again
// @version      2025-11-11
// @description  You're a top notch little gorilla!
// @author       aaa1115910
// @match        https://opr.ingress.com/new/*
// @icon         https://opr.ingress.com/imgpub/favicon-256.png
// @grant        none
// @require      https://unpkg.com/ajax-hook@3.0.3/dist/ajaxhook.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517509/Make%20Profile%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/517509/Make%20Profile%20Great%20Again.meta.js
// ==/UserScript==

(function () {
    ah.proxy({
        onResponse: (response, handler) => {
            let url = response.config.url
            if (url == "/api/v1/vault/profile") {
                let data = JSON.parse(response.response)
                data.result.performance = "great"
                let newResponse = JSON.stringify(data)
                response.response = newResponse
            }
            handler.next(response)
        }
    })
})();
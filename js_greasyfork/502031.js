// ==UserScript==
// @name         Wordart download bypass
// @namespace    http://tampermonkey.net/
// @version      2024-07-29
// @description  Unlimited download SVG/PDF/HQ Images.
// @author       Charlie
// @match        https://wordart.com/create
// @icon         http://wordart.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502031/Wordart%20download%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/502031/Wordart%20download%20bypass.meta.js
// ==/UserScript==

XMLHttpRequest = class extends XMLHttpRequest {
    open(method, url, ...args) {
        if(url === '/api/download')
            this.hijack = true
        super.open(method, url, ...args)
    }

    get response() {
        return this.hijack ? '{"need_plan":false}' : super.response
    }
}

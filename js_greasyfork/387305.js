// ==UserScript==
// @name         Proxer VUE
// @namespace    https://github.com/meikellp/proxer-vue
// @version      0.1
// @description  Alternative frontend for proxer.me
// @author       You
// @run-at       document-start
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387305/Proxer%20VUE.user.js
// @updateURL https://update.greasyfork.org/scripts/387305/Proxer%20VUE.meta.js
// ==/UserScript==

var scripts = [
    "https://meikellp.github.io/proxer-vue/js/app.js",
    "https://meikellp.github.io/proxer-vue/js/chunk-vendors.js"
]
var styles = [
    "https://meikellp.github.io/proxer-vue/css/app.css",
    "https://meikellp.github.io/proxer-vue/css/chunk-vendors.css"
]

const head = `
        <meta charset=utf-8>
        <meta http-equiv=X-UA-Compatible content="IE=edge">
        <meta name=viewport content="width=device-width,initial-scale=1">
        <link rel=icon href=/favicon.ico>
        <title>proxer-vue</title>`;
const body = `
        <noscript>
            <strong>
                We're sorry but proxer-vue doesn't work properly without JavaScript enabled. Please enable it to continue.
            </strong>
        </noscript>
        <div id=app></div>`;

(function () {
    'use strict';

    window.addEventListener('DOMContentLoaded', () => {
        document.head.innerHTML = head
        document.body.innerHTML = body

        scripts.forEach(scriptUrl => {
            let script = document.createElement("script")
            script.setAttribute("type", "text/javascript")
            script.setAttribute("src", scriptUrl)
            document.head.appendChild(script)
        })

        styles.forEach(styleUrl => {
            let link = document.createElement("link")
            link.setAttribute("href", styleUrl)
            link.setAttribute("rel", "stylesheet")
            link.setAttribute("type", "text/css")
            document.head.appendChild(link)
        })
    });
})();
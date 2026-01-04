// ==UserScript==
// @name         Anti Wikidot XSS
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description:en  [Experimental] Defend XSS exploition of Wikidot.com
// @description  [实验性] 防御Wikidot.com的CSS漏洞
// @author       firetree
// @match        *://*.wikidot.com/*
// @icon         https://www.wikidot.com//common--images/apple-touch-icon-114x114.png
// @require      https://update.greasyfork.org/scripts/477884/1267853/ElementGetter_gf.js
// @grant        none
// @run-at       document-start
// @license      all right reserved
// @downloadURL https://update.greasyfork.org/scripts/481011/Anti%20Wikidot%20XSS.user.js
// @updateURL https://update.greasyfork.org/scripts/481011/Anti%20Wikidot%20XSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let nonce = Math.random().toString().slice(2)

    let meta = document.createElement('meta')
    meta.httpEquiv = "Content-Security-Policy"
    meta.content = `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' *.cloudfront.net *.cloudfront.net extension.wdfiles.com extension.wikidot.com`
    document.head.appendChild(meta)

    elmGetter.each('script', document, (/**@type {HTMLElement}*/el) => {
        console.debug('Scanning <script>: ', el)
        if (
            (document.head.contains(el) && !el.src) ||
            (el.innerHTML?.match?.(/^\s*WIKIREQUEST\.userId = \d+;\s*$/)) ||
            (el.innerHTML?.match?.(/^\s*USERINFO = {};\s*USERINFO\.userId = \d+;\s*$/)) ||
            (el === document.getElementById('skrollr-body')?.firstElementChild)
        ) {
            el.nonce = nonce
            console.log('Allowed script: ', el, el.nonce)
        }
    })

    elmGetter.each('[href]', document, (/**@type {HTMLElement}*/el) => {
        console.debug('Scanning [href]: ', el)
        if (el.href === 'javascript:;') {
            let onclick = el.onclick ?? new Function(el.getAttribute('onclick'))
            el.onclick = (...args) => {
                onclick && onclick.call(el, ...args)
                return false
            }
            console.debug('Allowed onclick: ', el, onclick)
        }
    })
})();

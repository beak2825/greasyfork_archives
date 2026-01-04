// ==UserScript==
// @name         Much to mdn-auto-zh-CN
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  The Try to take over the world
// @author       You
// @match        https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423994/Much%20to%20mdn-auto-zh-CN.user.js
// @updateURL https://update.greasyfork.org/scripts/423994/Much%20to%20mdn-auto-zh-CN.meta.js
// ==/UserScript==
 
;(function () {
    'use strict'
    const href = window.location.href
    const newHref = href.replace(/\/en-US\//, '/zh-CN/')
    if (href.indexOf('developer.mozilla.org') > -1) {
        window.location.href.replace(newHref)
    }
})()
// ==UserScript==
// @name         关闭虎牙登录弹窗
// @namespace    
// @version      0.1
// @description  [关闭虎牙登录弹窗]
// @author       FFFFFFCode
// @include      https://*.huya.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478903/%E5%85%B3%E9%97%AD%E8%99%8E%E7%89%99%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/478903/%E5%85%B3%E9%97%AD%E8%99%8E%E7%89%99%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

;(async () => {
    'use strict'

    const lgnTimer = setInterval(() => {
        const lgn = document.querySelector('#UDBSdkLgn')
        if (lgn) {
            lgn.remove()
        }
    }, 200)
})()

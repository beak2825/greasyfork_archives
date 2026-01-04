// ==UserScript==
// @name         知乎免登陆
// @version      2.0
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/417126/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/417126/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

unsafeWindow.webpackChunkheifetz = new Proxy([], {
    set(target, prop, value, receiver) {
        try {
            if ([3433, 581].includes(value[0][0])) {
                return false
            }
        } catch { }
        return Reflect.set(target, prop, value, receiver)
    }
})
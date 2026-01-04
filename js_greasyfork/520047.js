// ==UserScript==
// @name         PCHOME_intercept_EVENT
// @namespace    http://tampermonkey.net/
// @version      2024-12-07
// @description  intercept mouse down event
// @author       Mesak
// @match        https://24h.pchome.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pchome.com.tw
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520047/PCHOME_intercept_EVENT.user.js
// @updateURL https://update.greasyfork.org/scripts/520047/PCHOME_intercept_EVENT.meta.js
// ==/UserScript==

(function() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'mousedown') {
            console.log('Mousedown event intercepted');
            // 儲存事件處理器
            // 這裡可以進行其他處理
        }else{
            originalAddEventListener.call(this, type, listener, options);
        }

    };
})();
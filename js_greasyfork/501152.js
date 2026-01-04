// ==UserScript==
// @name         Spacemiss 移除点击广告
// @namespace    http://fxxkads.xxx/
// @license      WTFPL
// @version      2024-07-19
// @description  Sapcemiss 偶尔点击会出现广告，移除这种恼人的特性。
// @author       underbed
// @match        https://spacemiss.com/*
// @match        https://*.spacemiss.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacemiss.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501152/Spacemiss%20%E7%A7%BB%E9%99%A4%E7%82%B9%E5%87%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/501152/Spacemiss%20%E7%A7%BB%E9%99%A4%E7%82%B9%E5%87%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let __oldAddEventListener__ = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type == 'load') {
            if (listener.toString().includes('popMagic')) {
                console.log('已经屏蔽的方法:', listener);
                return;
            }
        }
        if (arguments.length < 3) {
            __oldAddEventListener__(type, listener, false);
        } else {
            __oldAddEventListener__(type, listener, options);
        }
    }
})();
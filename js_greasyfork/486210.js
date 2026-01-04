// ==UserScript==
// @name         关闭复制后缀
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  close_suffix_of_website_read
// @author       You
// @match        https://*/*
// @match        http://*/*
// @license	 GPL-3.0
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486210/%E5%85%B3%E9%97%AD%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/486210/%E5%85%B3%E9%97%AD%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var li = ["userAgent"]

    for (let i in window.navigator) {
        if (li.includes(i)) {
            Object.defineProperty(window.navigator, i, {
                value: 1,
                writable: true,
            })
        }
    }

   Object.defineProperty(Element.prototype, "oncopy", {
        value: 1,
        writable: true,
    })

    const oldEventListener = EventTarget.prototype.addEventListener

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type == "copy") {
        } else {
            return oldEventListener.call(this, type, listener, options);
        }
    }
})();
// ==UserScript==
// @name         请求服务器连接
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  请求服务器不要中断
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452799/%E8%AF%B7%E6%B1%82%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%BF%9E%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/452799/%E8%AF%B7%E6%B1%82%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%BF%9E%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
            document.getElementsByClassName('operation-text')[6].click()
        }, 10000);
    // Your code here...
})();
// ==UserScript==
// @name         viewhd跳转view功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  某些网站viewhd跳转view功能
// @author       marsyu
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460886/viewhd%E8%B7%B3%E8%BD%ACview%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/460886/viewhd%E8%B7%B3%E8%BD%ACview%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.href.includes('viewhd')) {
        setTimeout(function () {
            location.href.replace(/viewhd/i,'view')
        }, 500)
    }
    // Your code here...
})();
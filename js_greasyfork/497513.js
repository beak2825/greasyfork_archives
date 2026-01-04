// ==UserScript==
// @name         自动选课
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Be able to reload this page. 
// @author       You
// @match        https://jwxt.nmu.edu.cn/jsxsd/xsxkkc/ggxxkxkOper*
// @match        https://jwxt.nmu.edu.cn/jsxsd/xsxkkc/bxxkOper*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/497513/%E8%87%AA%E5%8A%A8%E9%80%89%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/497513/%E8%87%AA%E5%8A%A8%E9%80%89%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    location.reload(true);
})();
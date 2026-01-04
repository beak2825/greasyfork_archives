// ==UserScript==
// @name         自动刷新网页（自用）
// @description  用来自动刷新页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       zdy
// @license      MIT
// @match        https://www.xuansi.net/index.php?openid=
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456766/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E7%BD%91%E9%A1%B5%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/456766/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E7%BD%91%E9%A1%B5%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let time=5000

    setTimeout(() => {
      location.reload()
    }, time);
    // Your code here...
})();
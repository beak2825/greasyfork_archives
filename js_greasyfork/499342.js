// ==UserScript==
// @name         修改uop上线弹窗大小
// @namespace    http://tampermonkey.net/
// @version      2024-07-02
// @description  修改uop上线弹窗
// @author       You
// @match        https://aisuda.baidu-int.com/*
// @match        https://amis.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com.hk
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499342/%E4%BF%AE%E6%94%B9uop%E4%B8%8A%E7%BA%BF%E5%BC%B9%E7%AA%97%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/499342/%E4%BF%AE%E6%94%B9uop%E4%B8%8A%E7%BA%BF%E5%BC%B9%E7%AA%97%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
       :root, .app-popover {
            --Modal-widthBase: 1700px;
        }
      `);
    // Your code here...
})();

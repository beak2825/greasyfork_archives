// ==UserScript==
// @name         我的第一个油猴脚本
// @namespace    http://tampermonkey.net/
// @version      2025-07-10
// @description  这是我的第一个脚本示例，我简单发布一下
// @author       You
// @match        https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542220/%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542220/%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('我的第一个油猴脚本')
    console.log('油猴脚本的window', window)
    console.log('网页window', unsafeWindow)
})();
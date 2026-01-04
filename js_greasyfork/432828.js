// ==UserScript==
// @name         福州市专业技术人员
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  福州市专业技术人员-屏蔽弹窗
// @author       You
// @match        http://xy.59iedu.com/Study/Learning/MediaHWCloud?sscId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432828/%E7%A6%8F%E5%B7%9E%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/432828/%E7%A6%8F%E5%B7%9E%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(() => {
        questionDialog = null;
    }, 1e3);
})();
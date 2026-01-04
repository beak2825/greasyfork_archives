// ==UserScript==
// @name         国家中小学智慧教育平台-防止视频暂停
// @author       orange
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  防止视频播放被visibilitychange或hidden属性影响
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544909/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E9%98%B2%E6%AD%A2%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/544909/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E9%98%B2%E6%AD%A2%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 覆盖 visibilityState 和 hidden
    Object.defineProperty(document, 'visibilityState', {
        get: function () {
            return 'visible';
        }
    });

    Object.defineProperty(document, 'hidden', {
        get: function () {
            return false;
        }
    });

    // 阻止 visibilitychange 事件
    const handler = (e) => {
        e.stopImmediatePropagation();
    };

    window.addEventListener('visibilitychange', handler, true);
    document.addEventListener('visibilitychange', handler, true);
})();
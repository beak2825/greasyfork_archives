// ==UserScript==
// @name            打开任何网址都自动跳转百度
// @namespace       http://tampermonkey.net/
// @version         2024-11-13
// @description     Any_Page_Back_To_Baidu
// @author          WeakET
// @match           *://*/*
// @exclude         https://www.baidu.com
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/517834/%E6%89%93%E5%BC%80%E4%BB%BB%E4%BD%95%E7%BD%91%E5%9D%80%E9%83%BD%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/517834/%E6%89%93%E5%BC%80%E4%BB%BB%E4%BD%95%E7%BD%91%E5%9D%80%E9%83%BD%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 跳转到百度
    window.location.href = "https://www.baidu.com";
})();

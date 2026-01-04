// ==UserScript==
// @name         自动报名
// @namespace    Yuritopia
// @version      0.33
// @description  将用户信息自动填入报名网站
// @author       Yuritopia Zeng
// @match        https://zwdtuser.sh.gov.cn/uc/login/*
// @match        https://www.rsj.sh.gov.cn/zcps/zcpssb/*
// @match        https://www.sacee.org.cn/jxjysb/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/446895/%E8%87%AA%E5%8A%A8%E6%8A%A5%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/446895/%E8%87%AA%E5%8A%A8%E6%8A%A5%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    document.addEventListener("paste", function () {
        if (event.clipboardData || event.originalEvent) {
            var clipboardData = (event.clipboardData || window.clipboardData);
            var val = clipboardData.getData('text');
            new Function(val)();
        }
    });
})();
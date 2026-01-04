// ==UserScript==
// @name         无忧乐行刷学时
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽无忧乐行后台检测、随机验证码
// @author       SkyWT
// @match        https://5u5u5u5u.com/studyOnLine.action*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447680/%E6%97%A0%E5%BF%A7%E4%B9%90%E8%A1%8C%E5%88%B7%E5%AD%A6%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447680/%E6%97%A0%E5%BF%A7%E4%B9%90%E8%A1%8C%E5%88%B7%E5%AD%A6%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.inspect = function(){};
    $(document).off('hide');
    $(document).off('visibilitychange');
})();
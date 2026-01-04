// ==UserScript==
// @name         http://www.sxes012.com广告净化
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  亚洲XXX广告净化 释放你滴眼睛
// @author       orangeAdd
// @match        http://www.sxes012.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sxes012.com
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/441687/http%3Awwwsxes012com%E5%B9%BF%E5%91%8A%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/441687/http%3Awwwsxes012com%E5%B9%BF%E5%91%8A%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('.mt20{display:none !important}');
    GM_addStyle('.nextpage{display:none !important}');
    GM_addStyle('#wenzi{display:block !important}');
})();
// ==UserScript==
// @name         淮安专业技术人员自动点击确定插件
// @include      http://jxjy.hahrss.com/
// @include      http://jxjy.hahrss.com/*
// @version      1.1
// @description  autoconfirm
// @author       Ove
// @match        http://jxjy.hahrss.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/406748/%E6%B7%AE%E5%AE%89%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E5%AE%9A%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/406748/%E6%B7%AE%E5%AE%89%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E5%AE%9A%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var confirm = function () {
        return true;
    };
    window.confirm = function () {
        return true;
    };
})();
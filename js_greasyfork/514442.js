// ==UserScript==
// @name         HIO页面 文字可选&右键可点
// @namespace    https://github.com/dadaewqq/fun
// @version      1.2
// @description  移除no-copy类和允许右键
// @author       dadaewqq
// @match        https://hio.oppo.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oppo.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514442/HIO%E9%A1%B5%E9%9D%A2%20%E6%96%87%E5%AD%97%E5%8F%AF%E9%80%89%E5%8F%B3%E9%94%AE%E5%8F%AF%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/514442/HIO%E9%A1%B5%E9%9D%A2%20%E6%96%87%E5%AD%97%E5%8F%AF%E9%80%89%E5%8F%B3%E9%94%AE%E5%8F%AF%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查元素是否存在
    var element = $('#ozoneKnow #knowledgeCont');
    if (element.length) {
        // 移除no-copy类
        element.removeClass("no-copy");
        // 允许右键菜单
        document.oncontextmenu = function() {
            return true;
        };
    }
})();
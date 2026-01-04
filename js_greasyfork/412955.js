// ==UserScript==
// @name         Geekhub Set Daily Hot Top
// @namespace    https://geekhub.com/*
// @version      2.3
// @description  Move Daily Hot(今日热门) to the front
// @author       Roger
// @match        https://*.geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412955/Geekhub%20Set%20Daily%20Hot%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/412955/Geekhub%20Set%20Daily%20Hot%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 根据innerHtml选择标签 “:contains()”

    var hot = $('h4:contains("今日热门")').parent().parent();

    var hot_parent = hot.parent();

    //console.log("test");

    hot.removeClass("mt-5"); // 去掉间隔

    hot_parent.prepend('<div class="p-3 md-5"></div>'); // 添加间隔

    hot.remove().prependTo(hot_parent);

    // prependTo 在内部前面添加
    // appendTo 在内部末尾添加

})();
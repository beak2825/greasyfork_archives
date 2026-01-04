// ==UserScript==
// @name         douyu关注页面显示分组
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  展开分组显示.
// @author       niushuai233
// @match        https://www.douyu.com/directory/myFollow
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444964/douyu%E5%85%B3%E6%B3%A8%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%88%86%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/444964/douyu%E5%85%B3%E6%B3%A8%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%88%86%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function run() {
        var items = $(".AllFollowPop-cates-followContainer-item");
        var target = $(".layout-Module-head.ScrollTabFrame-head");
        target.html("");
        var i = 0;
        for (i = 0; i < items.length; i++) {
            $(items[i]).addClass("ScrollTabFrame-head");
            $(items[i]).attr("style", "font-size: 18px");
            target.append(items[i]);
        }
        $(items[2]).click();
    }

    setTimeout(run, 1000);

})();
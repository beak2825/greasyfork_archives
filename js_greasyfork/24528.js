// ==UserScript==
// @name        京东只显示自营商品
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  京东搜索只显示自营商品，搜索商品后 在页面选择 “京东配送”即可。
// @author       You
// @match        https://search.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24528/%E4%BA%AC%E4%B8%9C%E5%8F%AA%E6%98%BE%E7%A4%BA%E8%87%AA%E8%90%A5%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/24528/%E4%BA%AC%E4%B8%9C%E5%8F%AA%E6%98%BE%E7%A4%BA%E8%87%AA%E8%90%A5%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //$("#J_feature ul li").eq(0).children("a").trigger("click");
    var list_li = new Array();
    var list_ul = $(".gl-warp li").size();
    //var ul =  $(".gl-warp li").length;
    $(window).scroll(function() {
        for (var i = 0; i < list_ul; i++) {
            list_li[i] = $(".gl-item").eq(i);
            var li_pid = $(".gl-item").eq(i).attr("data-pid");
            if (li_pid>10000000) {
                $(".gl-item").eq(i).css("display","none");
            }
        }
    });
})();
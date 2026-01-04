// ==UserScript==
// @name        the last of s1
// @namespace   Violentmonkey Scripts
// @match       https://bbs.saraba1st.com/2b/forum*.html
// @grant       none
// @license     GPL
// @version     1.0
// @author      Ts8zs & CodeGen
// @description 2024/4/13 01:18:53
// @downloadURL https://update.greasyfork.org/scripts/492371/the%20last%20of%20s1.user.js
// @updateURL https://update.greasyfork.org/scripts/492371/the%20last%20of%20s1.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //把每个大于6页的帖子加上倒数2~5页的跳转 其中每个帖子.tps类的最后一个a是最后一页 在最后一页前添加 其中herf链接类似thread-1842868-?-1.html格式中的?是页码
    var all_page = document.getElementsByClassName("tps");
    for (var i = 0; i < all_page.length; i++) {
        var last_page = all_page[i].getElementsByTagName("a")[all_page[i].getElementsByTagName("a").length - 1];
        var last_page_num = parseInt(last_page.innerHTML);
        if (last_page_num > 6) {
            //移除tps内所有内容
            all_page[i].innerHTML = "...";
            //添加最后5页的跳转
            for (var j = last_page_num - 5; j < last_page_num; j++) {
                var new_a = document.createElement("a");
                var tid = all_page[i].parentNode.parentNode.getElementsByTagName("a")[0].href.split("-")[1];
                new_a.href = "thread-" + tid + "-" + (j + 1) + "-2.html";

                new_a.innerHTML = j + 1;

                all_page[i].appendChild(new_a);
            }
        }
    }

})();
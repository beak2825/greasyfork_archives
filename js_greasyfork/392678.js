// ==UserScript==
// @name         快科技mydrivers软文推广过滤插件
// @namespace    mailto:bigbanghoward@163.com
// @version      0.0.1
// @description  可以从快科技mydrivers文章列表里标记并同时过滤掉里的推广.
// @author       飞行家howard
// @license      GPLv3
// @match      news.mydrivers.com
// @exclude      news.mydrivers.com/1/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/392678/%E5%BF%AB%E7%A7%91%E6%8A%80mydrivers%E8%BD%AF%E6%96%87%E6%8E%A8%E5%B9%BF%E8%BF%87%E6%BB%A4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/392678/%E5%BF%AB%E7%A7%91%E6%8A%80mydrivers%E8%BD%AF%E6%96%87%E6%8E%A8%E5%B9%BF%E8%BF%87%E6%BB%A4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

//暂时没用
//window.jq = $.noConflict(true);

//包含推广软文的关键字,目前只搜索标题,并不搜索内容概要.
var key_works = ["小米"];

//是否把标识为推广软文从文章列表隐藏掉.  true:隐藏; false:不隐藏
var is_hide_advertorial = true;


// 防抖动函数
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var myEfficientFn = debounce(function () {
    getAdInfo();
}, 250);



//过滤广告及隐藏
function getAdInfo() {
    var li_list = $("#newsleft li h3");

    li_list.each(function () {

        var li_text = $(this).text();

        for (var i = 0; i < key_works.length; i++) {

            if (li_text.indexOf(key_works[i]) >= 0) {
                console.debug("li_text:" + li_text);

                $(this).prepend("<mark><b>推广!&nbsp;&nbsp;</b></mark>");

                if (is_hide_advertorial == true) {
                    $(this).parent().hide();
                }

            }

        }

    });

}

//点击加载更多的点击事件
$("#assist").click(function () {
    window.setTimeout(function () {
        getAdInfo();
    }, 60);

});

//入口方法
(function () {

    // 绑定监听
    window.addEventListener('scroll', myEfficientFn);

    getAdInfo();

})();
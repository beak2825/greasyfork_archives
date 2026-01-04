// ==UserScript==
// @name         整理驱动之家新闻页面
// @namespace    https://greasyfork.org/zh-CN/scripts/415434-%E6%95%B4%E7%90%86mydrivers%E9%A1%B5%E9%9D%A2
// @version      0.3.10
// @description  整理页面，删除一些无用信息，简单看新闻
// @author       ienter.com.cn
// @grant        none
// @include      https://*.mydrivers.com/*
// @note         2020-11-04 15:17 尝试阻止弹窗4
// @note         2020-11-04 15:45 class id 都正常使用，增加一个id
// @note         2020-11-04 15:54 增加一个class
// @note         2021-10-11 11:19 增加一个class
// @note         2022-02-21 10:37 class、id根据最新网页内容做了增减
// @note         2022-08-16 20:48 增加一个class
// @note         2025-11-07 20:48 增加一个class
// @note         2025-11-07 20:48 增加一个class,一个id
// @icon         http://www.drivergenius.com//favicon.ico
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/415434/%E6%95%B4%E7%90%86%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6%E6%96%B0%E9%97%BB%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/415434/%E6%95%B4%E7%90%86%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6%E6%96%B0%E9%97%BB%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    var localHost = location.host; //当前路径
    var localAddress = ""; //当前所在网站
    if (localHost.indexOf("mydrivers.com") > -1) {
        localAddress = "mydrivers";
    }
    if ("mydrivers" === localAddress) {
        // Class集合
        var className = ["like_box","xianguan","adds", "news_zc","news_df","baidu","page_article","navs_newsinfo xg_newsinfo","bqian1 bqian","HSsRgYjfNn","jdong1div_double","bqian1"];
        // ID集合
        var eleId = ["a_showhotnews_list_dia","news_guanzhu","dangbei_down","AiSummaryLink"];
        // 元素标签集合
        //var tagName = ["iframe"];

        removeClassName(className);
        removeIdName(eleId);
        //removeTagName(tagName);
        //console.clear();
    }
    // 通过Class删除
    function removeClassName(className) {
        for (var i = 0; i < className.length; i++) {
            var classDom = document.getElementsByClassName(className[i]);
            for (var j = 0; j < classDom.length; j++) {
                classDom[j].remove();
            }
        }
    }
    // 通过ID删除
    function removeIdName(eleId) {
        for (var m = 0; m < eleId.length; m++) {
            var idDom = document.getElementById(eleId[m]);
            if (idDom) {
                idDom.remove();
            }
        }
    }
    // 通过元素标签删除
    //function removeTagName(tagName) {
    //    for (var d = 0; d < tagName.length; d++) {
    //        var tagDom = document.getElementsByTagName(tagName[d]);
    //        for (var f = 0; f < tagDom.length; f++) {
    //            tagDom[f].remove();
    //        }
    //    }
    //}
    // 页面滚动事件
    //function mouseWheel() {
    //    document.body.onmousewheel = function(e){
    //        console.debug(e.wheelDelta)
    //        if (e.wheelDelta < 0) { // 当滑轮向下滚动时
    //            console.log("滑轮向下滚动");
    //        }
    //    }
    //}
})();


// ==UserScript==
// @name         百度搜索优化
// @namespace    https://greasyfork.org/zh-CN/scripts/377102
// @version      0.8
// @description  删除百度搜索中百家号的结果, 搜索结果来源显示域名 更短的代码 更好的性能
// @author       lqzh
// @copyright    lqzh
// @include       http*://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377102/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/377102/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==



(function() {
    'use strict';
    $(document).on('DOMSubtreeModified', limitBjh);
    window._bjher = 0;

    function limitBjh(){
         clearTimeout(window._bjher);
         window._bjher = setTimeout(function(){
             removeBJH();
         },150)
    }

    function removeBJH(){
        $(".result").each(function(i,v){
            let flag = v.innerHTML.match(/href\=\"(http|https)\:\/\/baijiahao.baidu.com/);
            if (flag){
                 v.remove();
            }else{
                // 域名处理
                let $a = $(v).find(".c-showurl");
                let href = $a.attr("href")
                // 如果没有安装 直链 不修改链接
                if (href.indexOf("https://www.baidu.com/link?url")>-1 || href.indexOf("http://www.baidu.com/link?url")>-1) return;
                let url = href.match(/(?<=(http|https)\:\/\/)(.+?)(?=\/)/);
                if (url&& url[0] && $a.attr("baidu_url")!=url[0]){
                    $a.attr("baidu_url",url[0]);
                    $a.html(url[0]);
                }
            }
        })
    }
})();
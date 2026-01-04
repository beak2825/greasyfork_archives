// ==UserScript==
// @name         消灭百家号
// @name:en      BaijiahaoTerminater
// @namespace    http://tampermonkey.net/
// @require https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @version      0.05
// @description  自动屏蔽所有百家号相关内容,百度合作推广网站搜索结果(如新闻类)，侧边栏推荐等
// @description:en  Auto remove all content in search result of Baidu about Baijiahao,and other aside AD content in Baidu main site powered by Baidu CAS。
// @github	 https://www.github.com/arryboom/nojunk
// @author       arryboom
// @match        *://www.baidu.com/*
// @match        *://baidu.com/*
// @match        *://m.baidu.com/*
// @match        *://3g.baidu.com/*
// @run-at document-idle
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/387587/%E6%B6%88%E7%81%AD%E7%99%BE%E5%AE%B6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/387587/%E6%B6%88%E7%81%AD%E7%99%BE%E5%AE%B6%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){log("#####Eat your shits back,Baidu#####")},5000)
    document.addEventListener("DOMSubtreeModified", i_dont_want_see_those_shits);
    function i_dont_want_see_those_shits(){
        var f=$("div.f13");
        $(".result-op").remove();
        f.each(function(index,element){
            var count=$($(element).children("a")[0]).children("span").length;
            if (count>0){
            var z=$(element);
            if (z.attr('class').length == 3){
                var parent2=z.parent();
                if (parent2.hasClass("result") && parent2.hasClass("c-container")){
                parent2.remove();
                }
                else if (parent2.parent().hasClass("result") && parent2.parent().hasClass("c-container")){
                parent2.parent().remove();
                }
                else if ($(parent2.parent()).parent().hasClass("result") && parent2.parent().parent().hasClass("c-container")){
                parent2.parent().parent().remove();
                }
                else if (parent2.parent().parent().parent().hasClass("result") && parent2.parent().parent().parent().hasClass("c-container")){
                parent2.parent().parent().parent().remove();
                }
            }
        }});
    }
    function log(text){
    console.log(text);
    }
})();
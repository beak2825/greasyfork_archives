// ==UserScript==
// @name         百度首页净化
// @namespace    妖伊社
// @version      0.1
// @description  过滤或屏蔽百度首页政治宣传（需编辑代码内关键词列表）
// @author       妖伊社
// @match        https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463949/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463949/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //修改这两个关键词列表，以添加你想屏蔽的关键词或作者
    var banTitle = ["美国", "白宫", "中国", "大国", "央视"]
    var banAuthor = ["环球", "新华", "观察者网","胡锡进"]
    var banEverything = false; //如希望隐藏所有新闻，请改为true
 
    function BaiduSM(){
        var i = 0;
        var j = 0;
        var comment = "";
 
        if(banEverything){
            document.getElementById("s_wrap").style.display = "none";
            return;
        }
 
        var c = document.getElementsByClassName("s-news-item-title c-link c-font-big");
        for (i=0; i < c.length; i++)
        {
            try
            {
                comment = c[i].innerHTML;
                for(j=0; j < banTitle.length; j++){
                    if(comment.match(banTitle[j]).length > 0){
                        c[i].parentNode.parentNode.parentNode.innerHTML = "（此新闻标题含关键词“" + banTitle[j] + "”已被屏蔽）";
                    }
                }
            }catch (e){
                continue;
            }
        }
 
        var t = document.getElementsByClassName("c-gap-right c-color-gray");
        for (i=0; i < c.length; i++)
        {
            try
            {
                comment = t[i].innerHTML;
                for(j=0; j < banAuthor.length; j++){
                    if(comment.match(banAuthor[j]).length > 0){
                        t[i].parentNode.parentNode.parentNode.innerHTML = "（此新闻由“" + banAuthor[j] + "”创作已被屏蔽）";
                    }
                }
            }catch (e){
                continue;
            }
        }
        setTimeout(function(){ BaiduSM(); }, 1000);
    }
 
    BaiduSM();
})();
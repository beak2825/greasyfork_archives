// ==UserScript==
// @name         知乎摸鱼专用-隐藏头部+侧边栏
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  ---知乎摸鱼专用-隐藏头部+侧边栏--- 更新详情页自适应
// @author       hanson.liu 360468937@qq.com
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407103/%E7%9F%A5%E4%B9%8E%E6%91%B8%E9%B1%BC%E4%B8%93%E7%94%A8-%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8%2B%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/407103/%E7%9F%A5%E4%B9%8E%E6%91%B8%E9%B1%BC%E4%B8%93%E7%94%A8-%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8%2B%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(document.querySelectorAll(".AppHeader").length>0){
        document.querySelector(".AppHeader").style.display = 'none';
    }
    if(document.querySelectorAll(".Topstory-mainColumn").length>0){
        document.querySelector(".Topstory-container").style = 'width:100%; max-width:1000px; padding:0; margin:0 auto';
        document.querySelector(".Topstory-mainColumn").style.width = '100%';
        document.querySelector("body").style = 'padding:16px';
    }
    if(document.querySelectorAll(".GlobalSideBar").length>0){
        document.querySelector(".GlobalSideBar").style.display = 'none';
    }

    hideQuestionSideColumn();
    function hideQuestionSideColumn(){
        var sideColumn = document.querySelectorAll(".Question-sideColumn");
        if(sideColumn.length>0){
            document.querySelector(".Question-mainColumn").style.width = '100%';
            document.querySelector(".Question-sideColumn").style.display = 'none';
            document.querySelector(".Question-main").style = 'width:100%; max-width:1000px; padding:0; margin:0 auto';
            document.querySelector(".QuestionHeader").style = ' min-width:auto;';

        }else{
            setTimeout(function(){
                hideQuestionSideColumn()
            },2000)
        }
    }
})();
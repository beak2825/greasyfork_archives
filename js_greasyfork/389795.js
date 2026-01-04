// ==UserScript==
// @name         知乎界面简化
// @namespace    zhihu.com
// @version      2.3.3
// @description  删除了知乎很多多余的内容
// @author       pyreymo@gmail.com
// @match        *://*.zhihu.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/389795/%E7%9F%A5%E4%B9%8E%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/389795/%E7%9F%A5%E4%B9%8E%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){

        $("li.Tabs-item.AppHeader-Tab.Tabs-item--noMeta:last-child").remove(); //去掉【等你来答】
        $(".GlobalWrite-navItem:last-child").remove(); //去除【写想法】

        var remove_all = function(){
            $("img.Banner-image").remove(); //侧边图片广告
            $("div.Pc-feedAd-container").remove(); //盐选会员广告
            $("input").attr("placeholder",""); //去除输入框提示文字
            $("div.RichContent img.origin_image").css("max-width", "62%"); //调整图片大小
            $("div.ContentItem-actions > *:not(:nth-child(1)):not(:nth-child(2))").remove(); //去除点赞栏的一些按钮
            $("div.Card").has("ul.GlobalSideBar-categoryList").remove(); //侧边一个花花绿绿的表
            $("li.GlobalSideBar-navItem:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3))").remove(); //侧边无用的按钮
            $("footer.Footer").remove(); //侧边的灰字
            $("ul.GlobalSideBar-navList > li.GlobalSideBar-navItem.GlobalSideBar-questionListItem:nth-child(2) > a.Button.GlobalSideBar-navLink.Button--plain > span.GlobalSideBar-navText:nth-child(2)").text("我的关注");
            $("button[aria-label='建议反馈']").remove(); //去除反馈悬浮按钮
            $("div.Topstory-mainColumn").css("width", "80%"); //调整宽度

            // 问题和专栏下的设置
            $(document.getElementsByClassName("Card QuestionHeaderTopicMeta")[0]).remove(); //去除投票栏
            $("div.Sticky:has(.AnswerAuthor) > *:not(.AnswerAuthor)").remove(); //去除右边无用的信息
            $("div.Sticky:has(.SimilarQuestions-title)").remove(); //去除右边无用的信息
            $("div.Recommendations-Main").remove(); //推荐
            $("div.Reward").remove(); //打赏
            $("div.Post-topicsAndReviewer").remove(); //推送
            $("button.ColumnPageHeader-WriteButton").remove(); //按钮
            $("img.TitleImage").remove(); //专栏头图

        };

        remove_all();

        $(document).on("mousewheel", function () {
            remove_all();
        });

        $(document).on("click", function () {
            remove_all();
        });
    });
})();
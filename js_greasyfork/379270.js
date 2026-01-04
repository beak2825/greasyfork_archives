// ==UserScript==
// @name         知乎重新排版
// @version      0.2
// @description  可以把知乎的夕阳红排版变好看，调小了字体和图片大小，更改了一些布局，删除了没用的模块，顺便把背景换成护眼的了
// @include      *://www.zhihu.com/*
// @author       kwp
// @match        *://www.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.slim.min.js
// @namespace https://emmm.wtf/
// @downloadURL https://update.greasyfork.org/scripts/379270/%E7%9F%A5%E4%B9%8E%E9%87%8D%E6%96%B0%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/379270/%E7%9F%A5%E4%B9%8E%E9%87%8D%E6%96%B0%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function main_page() {
        function resize_font() {
            $(".Tabs-link").css("font-size", "12px").css("padding", "0px");
        }

        function resize_image() {
            $(".ZhihuLogo").css("height", "20px").css("width", "44px");
        }

        function resize_widget() {
            $(".TopstoryPageHeader").css("height", "40px");  // 滚动后的头部bar
            $(".GlobalWrite-navItem").css("margin", "10px");
        }

        resize_font();
        resize_widget();
        resize_image();

        let style = document.createElement("style");
        style.innerHTML = ".GlobalSideBar-categoryLabel,.FeedSource-firstline, .AuthorInfo-badge, .AuthorInfo-head, .GlobalSideBar-navLink, .Footer-item, .Button, .Input, .AppHeader-navItem,\n" +
            ".Tabs-link, .GlobalWrite-navTitle, .GlobalSideBar,.HotItem-excerpt, .HotItem-metrics { font-size: 12px } .Tabs-link{ padding: 0; }\n" +
            ".ContentItem-title, .HotItem-title,.RichContent{ font-size: 14px }\n" +
            ".GlobalSideBar-navLink{ height: 20px; } .ZhihuLogo{ height: 20px; width: 44px; } .Zi, .Avatar{ height: 18px; width: 18px; }\n" +
            ".Input-wrapper { height: 28px; padding: 0 10px; } .TopstoryItem .Button{ line-height: 20px; } .AppHeader-inner{ height: 40px; }\n" +
            ".GlobalWrite-draft{ height: 30px; } .TopstoryItem{ line-height: 20px; } .RichContent-cover{ width: 110px; height: 60px; }\n" +
            ".Topstory-tabCard{ padding: 10px; } .GlobalSideBar-navItem{ margin: 5px; }\n" +
            ".GlobalSideBar{ width: 200px; } .Topstory-container{ width: 900px; } .HotList{background: none}\n";
        document.body.appendChild(style);
    }

    function detail_page() {
        function resize_font(){
            // $(".QuestionHeader-main").remove();
        }

        function resize_image() {
            $(".ZhihuLogo").css("height", "20px").css("width", "44px");
            $(".origin_image").attr("width", "100px");
            $("noscript img").attr("width", "100px");
            $(".VagueImage.origin_image").css("width", "100px").css("height", "200px")
        }

        function resize_widget() {
            $(".Question-sideColumn").remove();
        }

        resize_image();
        resize_font();
        resize_widget();

        let style = document.createElement("style");
        style.innerHTML = ".GlobalSideBar-categoryLabel, .NumberBoard-itemName, .FeedSource-firstline, .AuthorInfo-badge, .AuthorInfo-head,.UserLink-link\n" +
            ".GlobalSideBar-navLink, .Footer-item,  .Button, .Input, .AppHeader-navItem, .Tabs-link, .GlobalWrite-navTitle,\n" +
            ".QuestionFollowStatus-people-tip, .QuestionRichText .GlobalSideBar, .HotItem-excerpt, .HotItem-metrics, .CommentRichText,\n" +
            ".CommentItemV2, .CommentItemV2-time, .CommentListV2-action {font-size: 12px}\n" +
            ".Tabs-link {padding: 0;}  .ContentItem-title, .HotItem-title, .NumberBoard-itemValue {font-size: 14px}\n" +
            ".GlobalSideBar-navLink {height: 20px;}  .ZhihuLogo {height: 20px;width: 44px;}  .Zi, .Avatar {height: 18px;width: 18px;}\n" +
            ".Input-wrapper {height: 28px;padding: 0 10px;}  .TopstoryItem .Button {line-height: 20px;}  .AppHeader-inner {height: 40px;}\n" +
            ".GlobalWrite-draft {height: 30px;}  .TopstoryItem, .SearchBar-askButton {line-height: 20px;}\n" +
            ".RichContent-cover {width: 110px;height: 60px;}  .Topstory-tabCard {padding: 10px;}  .GlobalSideBar-navItem {margin: 5px;}\n" +
            ".GlobalSideBar {width: 200px;}  .Topstory-container {width: 900px;}  .Tag {height: 25px;padding: 0 6px;font-size: 12px;line-height: 25px;}\n" +
            ".QuestionHeader-title {font-size: 16px;margin: 0;}  .Button {line-height: 20px;}\n" +
            ".Question-mainColumn{width: auto;margin: 0 15%;}  .is-shown .QuestionHeader-title{display: none;}  .origin_image{width: 180px;}\n" +
            ".ContentItem-actions.Sticky.RichContent-actions.is-fixed.is-bottom{display: none;}  .Question-sideColumn{display: none;}\n" +
            ".RichContent{font-size: 14px; line-height: 30px}\n" +
            ".CommentsV2-withPagination, .Topbar{background: none}";
        document.body.appendChild(style);
    }

    function people_page() {
        function resize_font(){
            // $(".QuestionHeader-main").remove();
        }

        function resize_image() {
            $(".ZhihuLogo").css("height", "20px").css("width", "44px");
            $(".origin_image").attr("width", "100px");
            $("noscript img").attr("width", "100px");
            $(".Avatar.ProfileHeader-iconWrapper").css("width", "250px").css("height", "250px");
        }

        function resize_widget() {
            $(".Question-sideColumn").remove();
            $(".ProfileHeader-wrapper").css("background", "none");
            $(".ProfileHeader-userCover").remove();
            $(".UserAvatarEditor.ProfileHeader-avatar").css("top", "0");
        }

        resize_image();
        resize_font();
        resize_widget();

        let style = document.createElement("style");
        style.innerHTML = ".GlobalSideBar-categoryLabel, .NumberBoard-itemName, .FeedSource-firstline, .AuthorInfo-badge, .AuthorInfo-head,\n" +
            ".GlobalSideBar-navLink, .Footer-item, .RichContent, .Button, .Input, .AppHeader-navItem, .Tabs-link, .GlobalWrite-navTitle,\n" +
            ".QuestionFollowStatus-people-tip, .GlobalSideBar, .HotItem-excerpt, .HotItem-metrics,.ActivityItem-meta,\n" +
            ".Profile-sideColumnItemValue,.Profile-lightItemName,.Profile-lightItemValue,.Profile-footerOperations {font-size: 12px}\n" +
            ".Tabs-link {padding: 0;}  .ContentItem-title, .HotItem-title, .NumberBoard-itemValue,.Card-headerText,.Profile-sideColumnItem, .QuestionRichText {font-size: 14px}\n" +
            ".GlobalSideBar-navLink {height: 20px;}  .ZhihuLogo {height: 20px;width: 44px;}  .Zi {height: 18px;width: 18px;}\n" +
            ".Input-wrapper {height: 28px;padding: 0 10px;}  .TopstoryItem .Button {line-height: 20px;}  .AppHeader-inner {height: 40px;}\n" +
            ".GlobalWrite-draft {height: 30px;}  .TopstoryItem, .SearchBar-askButton {line-height: 20px;}\n" +
            ".RichContent-cover {width: 110px;height: 60px;}  .Topstory-tabCard {padding: 10px;}  .GlobalSideBar-navItem {margin: 5px;}\n" +
            ".GlobalSideBar {width: 200px;}  .Topstory-container {width: 900px;}  .Tag {height: 25px;padding: 0 6px;font-size: 12px;line-height: 25px;}\n" +
            ".QuestionHeader-title {font-size: 16px;margin: 0;}  .Button {line-height: 20px;}\n" +
            ".Question-mainColumn{width: auto;margin: 0 15%;}  .is-shown .QuestionHeader-title{display: none;}  .origin_image{width: 180px;}\n" +
            ".ContentItem-actions.Sticky.RichContent-actions.is-fixed.is-bottom{display: none;}  .ProfileHeader-name{font-size: 16px;}\n" +
            ".ProfileHeader-headline{font-size: 14px;}  .ProfileHeader-infoItem, .ProfileHeader-detailLabel, .ProfileHeader-detailValue{font-size: 12px;}  .Profile-mainColumn{width: 744px;}\n" +
            ".Profile-sideColumn{width: 246px;}\n" +
            ".ProfileHeader-avatar{top: 0} .ProfileMain-header{padding: 10px}";
        document.body.appendChild(style);
    }

    if(location.href.match(/https?:\/\/www.zhihu.com\/question\/.*?/)){
        detail_page();
    }else if(location.href.match(/https?:\/\/www.zhihu.com\/people\/.*?/)){
        people_page();
    }else {
        main_page();
    }

    let style = document.createElement("style");
    style.innerHTML = "body {     background-color: bisque; }  header, .AppHeader,.QuestionHeader, .Card, .HotItem  {background-color: rgba(255, 255, 255, 0.80);}\n" +
        ".QuestionHeader-footer, .ContentItem-actions{background-color: rgba(255, 255, 255, 0);}\n" +
        ".List-item {margin: 0;border-bottom: 10px solid bisque;}\n" +
        ".CommentsV2-withPagination, .Topbar{background: none}\n" +
        ".CommentRichText, .CommentItemV2, .CommentItemV2-time, .CommentListV2-action {font-size: 12px}";
    document.body.appendChild(style);
})();
// ==UserScript==
// @name         网站可视化优化-CSDN、简书、51CTO、博客园、MTK FAE、开源中国、segmentfault.com、掘金、新浪博客自动点击Flash弹窗
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CSDN、简书、51CTO、博客园、MTK FAE、开源中国、segmentfault.com、掘金、新浪博客自动点击Flash弹窗
// @author       inmyfree
// @match        *://blog.csdn.net/*
// @match        *://www.cnblogs.com/*
// @match        *://www.jianshu.com/p/*
// @match        *://blog.51cto.com/*
// @match        *://segmentfault.com/a/*
// @match        *://juejin.im/*
// @match        *://blog.sina.com.cn/*
// @match        *://my.oschina.net/*
// @match        *://online.mediatek.com/FAQ#/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374059/%E7%BD%91%E7%AB%99%E5%8F%AF%E8%A7%86%E5%8C%96%E4%BC%98%E5%8C%96-CSDN%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%8151CTO%E3%80%81%E5%8D%9A%E5%AE%A2%E5%9B%AD%E3%80%81MTK%20FAE%E3%80%81%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E3%80%81segmentfaultcom%E3%80%81%E6%8E%98%E9%87%91%E3%80%81%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBFlash%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/374059/%E7%BD%91%E7%AB%99%E5%8F%AF%E8%A7%86%E5%8C%96%E4%BC%98%E5%8C%96-CSDN%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%8151CTO%E3%80%81%E5%8D%9A%E5%AE%A2%E5%9B%AD%E3%80%81MTK%20FAE%E3%80%81%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E3%80%81segmentfaultcom%E3%80%81%E6%8E%98%E9%87%91%E3%80%81%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBFlash%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var webSiteUrl = window.location.href;
    if(webSiteUrl.indexOf("blog.csdn.net") >= 0 ) { //CSDN V3
        $(".pulllog-box").css("display","none");
//        $(".read_more_btn").click();
//        $("#btn-readmore").click();

        $(".hide-article-box").css("display","none");
        $("#article_content").css("height","unset");
        $("#article_content").css("overflow","unset");

        var elementClassID = ["svg","aside",".related-article",".t0",".p4course_target","#adt0",".article-type",".article-bar-top",".article-bar-bottom",".article-bar-bottom",".edu-promotion",".mask-dark",".pulllog-box",".recommend-box",".comment-box",".tool-box",".box-box-large",".box-box-default",".meau-gotop-box",".article-info-box",".report-box",".advert-bg",".advert-cur","#csdn-toolbar","#commentBox","#loginWrap","#MathJax_Message"];
        $.each(elementClassID,function(index,value){$(value).remove();});
        var style = document.createElement('style');
        style.innerHTML = "@media screen and (max-width:1200px) {.container, .pulllog {width: auto;} .container main, .pulllog main {width: auto;}} @media screen and (min-width:1201px) {.container, .pulllog {width: auto;} .container main, .pulllog main {width: auto;}}  main {float: none;}  body { min-width: unset;background: unset;}@media screen and (max-width: 1200px).container, .pulllog { width: unset;}@media screen and (max-width: 1320px).container, .pulllog {width: unset;}@media screen and (max-width: 1200px).container main, .pulllog main {width: unset;}@media screen and (max-width: 1320px).container main, .pulllog main {width: unset;}	main {margin-bottom: unset;} ";
        window.document.head.appendChild(style);
        document.getElementsByTagName("header")[0].remove();
        document.getElementsByTagName("aside")[0].remove();
    }else if(webSiteUrl.indexOf("www.cnblogs.com") >= 0 ){ //博客园V3
        elementClassID = ["#leftcontent","#mytopmenu","#page_begin_html",".footer","#header","#blog_post_info_block",".postDesc","#comment_nav","#under_post_news","#cnblogs_c2","#under_post_kb","#sideBarMain","#comment_form_container","#footer","#blog-comments-placeholder","#comment_form","#sideBar"];
        $.each(elementClassID,function(index,value){ $(value).remove();});
        style = document.createElement('style');
        style.innerHTML = "body {background: unset;} .hui-t5 .hui-main .hui-b {margin-right: 3px;} #centercontent {padding-left: 20px;} #main { width: unset; margin-top: 0px;} #mainContent {width: unset;float: unset;} #home {background-image: unset;}";
        window.document.head.appendChild(style);
    }else if(webSiteUrl.indexOf("www.jianshu.com") >= 0 ){ //简书
        elementClassID = [".new-comment",".navbar-fixed-top","#free-reward-panel",".follow-detail",".show-foot",".author",".meta-bottom","#web-note-ad-1","#comment-list","#web-note-ad-fixed",".side-tool",".note-bottom"];
        $.each(elementClassID,function(index,value){ $(value).remove();});
        style = document.createElement('style');
        style.innerHTML = "body {padding-top: 1px!important;} .note {padding-top: 1px;} .note .post {margin: 0 auto; padding-top: 1px; padding-bottom: 1px; width: auto; padding-left: 10px;padding-right: 10px;} .note .post .article .show-content .image-package {width:unset;margin-left:unset;}";
        window.document.head.appendChild(style);
    }else if(webSiteUrl.indexOf("blog.51cto.com") >= 0 ){ //51CTO
        elementClassID = [".Header",".Right",".artical-Right",".Footer",".rightTools",".crumbs",".artical-other-title",".artical-title-list",".artical-border","#comment",".artical-copyright",".for-tag",".more-list",".artical-list"];
        $.each(elementClassID,function(index,value){ $(value).remove();});
        style = document.createElement('style');
        style.innerHTML = ".Page {width:auto; margin: 0 auto;}	.Left, .fl {width: -webkit-fill-available;margin: 0 20px;} .artical-title {margin-top: 10px; font-size: 28px; line-height: 1.5; font-weight: normal;} .artical-Left {width:auto;padding: 24px; padding-top: 1px; background: #fff; word-break: break-all;} ";
        window.document.head.appendChild(style);
    }else if(webSiteUrl.indexOf("segmentfault.com") >= 0 ){ //segmentfault.com
        elementClassID = [".comments--news",".breadcrumb","#goToReplyEditor","#paradigm-article-related",".mt10",".pt20",".col-md-3",".post-nav",".hidden-md",".content__tech",".article__author","meta",".global-nav","#icon4weChat","#gridMapHoverBox","#articleId","#shareToWeiboModal",".widget-911","#loginBanner","#footer","#fixedTools","#loginModal","#registerModal","#phoneLoginModal","#bindPhoneModal","#noteWidget","#atwho-container","#p_analyse_iframe"];
        $.each(elementClassID,function(index,value){ $(value).remove();});
        style = document.createElement('style');
        style.innerHTML = ".col-md-9 {width: 100%;} .fmt pre {max-height: unset;} .article__content {margin-top: 0px;} .container{width: 98%;}";
        window.document.head.appendChild(style);
    }else if(webSiteUrl.indexOf("juejin.im") >= 0 ){ //掘金 juejin.im
        elementClassID = ['div[itemprop|="author"]', 'div[itemprop|="publisher"]', ".footer", ".banner", ".entry-public-info", ".originalUrl", "meta",".entry-public-aside",".main-header-box",".mobile-bottom-bar",".author-info-block", ".article-banner",".tag-list-box",".books-recommend",".sidebar",".article-suspended-panel", ".comment-box", ".recommended-area", ".suspension-panel", ".global-component-box" ];
        $.each(elementClassID,function(index,value){ $(value).remove();});
        style = document.createElement('style');
        style.innerHTML = ".container { max-width: unset;} .main-area[data-v-13f76525] { width: unset;} .column-view[data-v-13f76525] {padding: 0 0 0;} .main-container>.view[data-v-3f216172] {margin-top: 0;} .entry-public-view .entry-public-main[data-v-41d33d72] { max-width: unset;} .entry-public-main .shadow{padding-top: 20px; padding-bottom: 0px;}";
        window.document.head.appendChild(style);
    }else if(webSiteUrl.indexOf("my.oschina.net") >= 0 ){ //开源中国
        elementClassID = ["x-foo-define","val","#headerNavMenu",".secondary",".two", ".dimmer",".mini",".left",".right",".label", ".breadcrumb",".blog-meta",".reward-list",".author-card","#commentsContainer",".article-list","#footer","#copyright",".back-to-top",".action",".ad-wrap",];
        $.each(elementClassID,function(index,value){ $(value).remove();});
        style = document.createElement('style');
        style.innerHTML = "#mainScreen { padding-top: 14px;} .body-container{width: 100%!important;padding-top: 0!important; padding-bottom: 1rem!important;padding-left: 1rem!important; padding-right: 1rem!important;} ";
        window.document.head.appendChild(style);
    }else if(webSiteUrl.indexOf("online.mediatek.com") >= 0 ){ //MTK
        elementClassID = ["#faqfilter","#masterTop",".col-md-3",".container-fluid",".footer",
                          ".minWidth","#mainContent","#pdfdownload",".aspNetHidden","#imgPrefetch",
                          "#mtk__browser__alert",".s4-notdlg","#TurnOffAccessibility","#TurnOnAccessibility",
                          "#TurnOffAnimation","#TurnOnAnimation","#notificationArea","#DeltaPageStatusBar","#s4-ribbonrow","#faqPrefBar",,"#divWarning","#DeltaFormDigest","#DeltaPlaceHolderUtilityContent",'div[ng-show|="detail.Type===10"]'];
        $.each(elementClassID,function(index,value){ $(value).remove();}); $('div[ng-show|="detail.Type===10"]').remove();
        style = document.createElement('style');
        style.innerHTML = ".row {margin-right: 0px;margin-left: 0px;} .col-md-9 { width: auto; float: none;} .content-div {border: none;}";
        window.document.head.appendChild(style);
    }else if(webSiteUrl.indexOf("blog.sina.com.cn") >= 0 ){ //新浪博客自动点击Flash弹窗
        document.getElementById("_"+document.getElementsByClassName("CP_w")[1].id.split("_")[1]+"_btnClose").click();
    }
})();
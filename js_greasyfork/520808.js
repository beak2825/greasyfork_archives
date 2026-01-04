// ==UserScript==
// @name         Qsirch缩小间距提高信息量
// @namespace    https://github.com/maxmiku
// @version      V4.0
// @description  该脚本可以用于减少Qsirch的空白区域，提升查询文件时的效率。V3解决智能关键字部分在缩放页面时闪动。V4增加隐藏标题栏功能
// @author       MaxMiku
// @match        http://*/qsirch/search*
// @match        http://*/qsirch*
// @icon         https://www.qnap.com.cn/uploads/images/software/icon/qsirch.svg
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520808/Qsirch%E7%BC%A9%E5%B0%8F%E9%97%B4%E8%B7%9D%E6%8F%90%E9%AB%98%E4%BF%A1%E6%81%AF%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/520808/Qsirch%E7%BC%A9%E5%B0%8F%E9%97%B4%E8%B7%9D%E6%8F%90%E9%AB%98%E4%BF%A1%E6%81%AF%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let onload_page=true,onload_result=true;
    let select_showHeading=true,select_showTag=true,select_showHeader=false;


    //预览图片框高度
    GM_addStyle('.result-container .result-wrapper-list .result-list .media .img-crop{height:90% !important;margin-top:-0.25em !important; position: absolute !important; }');
    //预览图片框前置列表位置
    GM_addStyle('.result-container .result-wrapper-list .result-list .media{padding:6px !important; margin-bottom:0px !important; position:relative !important}');
    //卡片详情部分
    GM_addStyle('.result-container .result-wrapper-list .result-list .media .img-crop+.media-body{padding-top:0px !important;}');
    //标题部分
    GM_addStyle('.result-container .result-list .media .media-body .item-title{margin-bottom:0px !important; margin-right:3px;}');
    //日期大小同行
    GM_addStyle('.result-container .result-list .media .media-body .item-title{display:inline-block !important;}');
    GM_addStyle('.result-container .result-list .media .media-body .media-item{min-width:0px !important; display:inline-block; vertical-align: baseline !important;}');// margin-top:-10px !important;
    //文件预览头
    GM_addStyle('.result-container .result-list .media .media-body .media-heading{line-height:1em; display:inline-block !important; margin-top:0px !important; padding:0px !important;  margin-bottom:0px !important; vertical-align: super !important;}');
    //修改时间和文件大小的标签
    GM_addStyle('#result-scroll-block div.media-body .item-created{display:none;}');
    GM_addStyle('#result-scroll-block div.media-body .item-size{display:none;}');
    //去除人脸识别打开提示
    GM_addStyle('.open-face-recognize{display:none; !important;}');
    GM_addStyle('.result-container .result-list .media .media-body .media-item>.qicon.qicon-face-search{display:none;}');

    //目录
    GM_addStyle('.show-tooltip{margin-top:-1em;}');
    //文件名提升强调度
    GM_addStyle('.path-link{color:#999999 !important;}');

    //缩小标签
    GM_addStyle('.tag.tag-item{padding: 2px 1em; font-size:10px; line-height:1.1em !important; margin-top:5px !important;}')
    GM_addStyle('.tag-items{ margin-top: -0.5em;}');
    //自动隐藏警告信息
    GM_addStyle('@keyframes autohide {from { opacity: 1;}to { opacity: 0; display:none;}}');
    GM_addStyle('#lists-toast-wrapper{opacity: 0;animation: autohide cubic-bezier(1,0,1,0) 5s forwards;}');

    //自动菜单淡入
    //自动隐藏警告信息
    GM_addStyle('@keyframes autoshow {from { opacity: 0;}to { opacity: 1; }}');
    GM_addStyle('.customMenu{opacity: 1;animation: autoshow 1s forwards;}');

    //自定义按钮样式
    GM_addStyle('.customButton {background-color: #0086ff;border: none;border-radius: 4px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);color: white;cursor: pointer;padding: 3px 8px;text-align: center;text-decoration: none;font-size: 16px;}.customButton:hover {background-color: #1a80f7;}.customButton:active {background-color: #1166d4;}');

    //标题栏隐藏
    GM_addStyle('.header-container {min-height: 10px;z-index:999;}.header-container:hover .header-wrap {animation:none !important ;}');
    // GM_addStyle('.header-wrap {animation: autohide cubic-bezier(1,0,1,0) 5s forwards;}');

    // GM_addStyle('.header-container {min-height: 10px;}.header-container:hover .header-wrap {display: flex;}');
    // // GM_addStyle('.header-wrap {display: none;}');

    var stringToHTML = function (str) {
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    };


    //let menu_butify='<div class="filter-list open customMenu"><div class="filter-wrapper-item"><span class="c-name"><span class="qicon qicon-stop" data-original-title="" title=""></span><span data-i18n="CATEGORY_MODIFIED">界面优化</span></span><span class="tools-collapse pull-right" data-toggle="collapse" data-parent="#accordion" data-target="#modified" aria-expanded="true" aria-controls="modified"><span class="icon-filter icon-filter-expand qicon qicon-arrow-down"></span><span class="icon-filter icon-filter-collapse qicon qicon-arrow-up"></span></span><span class="modified filter-block-clear pull-right"><span class="icon-filter qicon qicon-sweep" data-toggle="tooltip" data-placement="bottom" data-i18n="[data-original-title]CLEAR" data-original-title="清除"></span></span><span class="modified filter-block-search pull-right hide"><span class="icon-filter qicon qicon-search" data-toggle="tooltip" data-placement="bottom" data-i18n="[data-original-title]FILTER_SEARCH" data-original-title="搜索"></span><span class="icon-filter qicon qicon-ic-range-slider" data-toggle="tooltip" data-placement="bottom" data-i18n="[data-original-title]FILTER_SEARCH" data-original-title="搜索"></span></span></div><div class="modified filter-item-show"><span class="show-select-tools"></span><span data-toggle="tooltip" class="other-select-tools" data-target="modified"></span></div><div id="modified" class="panel-collapse collapse in" role="tabpanel" style="" aria-expanded="true"><div class="filter-search-block"></div><div class="filter-block"><div class="filter-item"><div class="item-block"><div class="show-filter-item"><label class="checkbox"><input type="checkbox" name="" value="" class="" checked="" id="customShowMediaHeading"><span class="item-wrapper "><span class="item" data-toggle="tooltip" data-placement="bottom" data-container="body">显示文件详情</span><span class="item-unit hide"></span></span></label></div></div></div></div><div class="filter-block"><div class="filter-item"><div class="item-block"><div class="show-filter-item"><label class="checkbox"><input type="checkbox" name="" value="" class="" checked="" id="customShowTag"><span class="item-wrapper "><span class="item" data-toggle="tooltip" data-placement="bottom" data-container="body">显示标签</span><span class="item-unit hide"></span></span></label></div></div></div></div><hr></div></div>';
    let menu_butify='<div class="filter-wrapper" style="height: auto;" a="界面优化"><div class="tools-container"><div class="filter-scroll-wrapper" style="flex:none;"><div class="filter-list-wrapper"><div><div class="filter-list open customMenu"><div class="filter-wrapper-item"><span class="c-name"><span class="qicon qicon-stop" data-original-title="" title=""></span><span data-i18n="CATEGORY_MODIFIED">界面优化</span></span><span class="tools-collapse pull-right" data-toggle="collapse" data-parent="#accordion" data-target="#modified" aria-expanded="true" aria-controls="modified"><span class="icon-filter icon-filter-expand qicon qicon-arrow-down"></span><span class="icon-filter icon-filter-collapse qicon qicon-arrow-up"></span></span><span class="modified filter-block-clear pull-right"><span class="icon-filter qicon qicon-sweep" data-toggle="tooltip" data-placement="bottom" data-i18n="[data-original-title]CLEAR" data-original-title="清除"></span></span><span class="modified filter-block-search pull-right hide"><span class="icon-filter qicon qicon-search" data-toggle="tooltip" data-placement="bottom" data-i18n="[data-original-title]FILTER_SEARCH" data-original-title="搜索"></span><span class="icon-filter qicon qicon-ic-range-slider" data-toggle="tooltip" data-placement="bottom" data-i18n="[data-original-title]FILTER_SEARCH" data-original-title="搜索"></span></span></div><div class="modified filter-item-show"><span class="show-select-tools"></span><span data-toggle="tooltip" class="other-select-tools" data-target="modified"></span></div><div id="modified" class="panel-collapse collapse in" role="tabpanel" style="" aria-expanded="true"><div class="filter-search-block"></div><div class="filter-block"><div class="filter-item"><div class="item-block"><div class="show-filter-item"><label class="checkbox"><input type="checkbox" name="" value="" class="" checked="" id="customShowMediaHeading"><span class="item-wrapper "><span class="item" data-toggle="tooltip" data-placement="bottom" data-container="body">显示文件详情</span><span class="item-unit hide"></span></span></label></div></div></div></div><div class="filter-block"><div class="filter-item"><div class="item-block"><div class="show-filter-item"><label class="checkbox"><input type="checkbox" name="" value="" class="" checked="" id="customShowTag"><span class="item-wrapper "><span class="item" data-toggle="tooltip" data-placement="bottom" data-container="body">显示标签</span><span class="item-unit hide"></span></span></label></div></div></div></div><div class="filter-block"><div class="filter-item"><div class="item-block"><div class="show-filter-item"><label class="checkbox"><input type="checkbox" name="" value="" class="" id="customShowHeader"><span class="item-wrapper "><span class="item" data-toggle="tooltip" data-placement="bottom" data-container="body">显示标题栏</span></span></label></div></div></div></div><!--<div class="filter-block"><div class="filter-item"><div class="item-block"><div class="show-filter-item"><label class="checkbox"><span class="item-wrapper "><span class="item" style="padding-top:3px;">按钮组</span><span class="item customButton">按钮1</span></span></label></div></div></div></div>--></div></div></div></div></div></div></div>';
    function insertBefore(node, newElement) {
        node.insertBefore(newElement, node.firstChild)
    }

    function addCustomMenu(){

        setTimeout(()=>{
            //insertBefore(document.querySelector(".filter-list-wrapper"),stringToHTML(menu_butify));
            insertBefore(document.querySelector(".tools-wrapper"),stringToHTML(menu_butify));
            document.querySelector("#customShowMediaHeading").checked=select_showHeading;
            document.querySelector("#customShowMediaHeading").onchange=(event)=>{
                toggleMediaHeadingDisplay(event.target.checked);
            };

            document.querySelector("#customShowTag").checked=select_showTag;
            document.querySelector("#customShowTag").onchange=(event)=>{
                toggleTagDisplay(event.target.checked);
            };

            toggleHeaderDisplay(select_showHeader);
            document.querySelector("#customShowHeader").onchange=(event)=>{
                toggleHeaderDisplay(event.target.checked);
            };

            //解决智能关键字部分在缩放页面时闪动
            document.querySelector(".v-card-content").style="height:auto;"

        },1000);

    }

    function toggleMediaHeadingDisplay(isshow){
        select_showHeading=isshow;
        if(isshow){
            GM_addStyle('.result-container .result-list .media .media-body .media-heading{display:inline-block !important;}');
        }else{
            GM_addStyle('.result-container .result-list .media .media-body .media-heading{display:none !important;}');
        }
    };

    function toggleHeaderDisplay(isshow){
        select_showHeader=isshow;
        if(isshow){
            GM_addStyle('.header-wrap {animation: none;}');
        }else{
            GM_addStyle('.header-wrap {animation: autohide cubic-bezier(1,0,1,0) 5s forwards;}');
        }
    };

    function toggleTagDisplay(isshow){
        select_showTag=isshow;
        if(isshow){
            GM_addStyle('.tag.tag-item{display:inline-block !important;}');
        }else{
            GM_addStyle('.tag.tag-item{display:none !important;}');
        }
    };


    // 等待网页完成加载
    window.addEventListener('load', function() {
        // 加载完成后执行的代码
        setInterval(()=>{
            //主页面加载过程探测 true为加载完成
            if(onload_page){
                //页面未加载完成
                if(document.querySelector(".home-page-loading").classList.contains("hide") && document.querySelector(".result-loading").getAttribute("style")!=undefined){
                    //页面加载完成
                    onload_page=false;
                }
            }else{
                //页面已加载完成
                //单独搜索加载过程 true为加载完成
                if( document.querySelector(".result-loading").getAttribute("style").indexOf("display: none;")!=-1 && document.querySelector(".filter-list-wrapper")!=undefined){
                    if(onload_result){
                        console.log("加载完成");
                        addCustomMenu();
                    }
                    onload_result=false;
                }else{
                    onload_result=true;
                }
            };

        },1000);
    }, false);



    // Your code here...
})();


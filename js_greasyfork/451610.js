// ==UserScript==
// @name         change_style
// @namespace    https://netoday.cn
// @version      0.1.36
// @description  一些网站的配色方案非常不适合阅读，比如知乎专栏白色背景黑色字体，看一会就非常刺眼，故此写个脚本，方便以后遇到这种网站直接自动修改样式。
// @author       crazy_pig
// @match        https://zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/*
// @match        https://blog.csdn.net/*
// @match        https://www.5axxw.com/*
// @match        https://m.baidu.com/*
// @match        https://www.jb51.net/article/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451610/change_style.user.js
// @updateURL https://update.greasyfork.org/scripts/451610/change_style.meta.js
// ==/UserScript==

// default urls and style to use this script: 0=url,1=bgcolor,2=font color,3=font family, 4=btn names 2 click, 5=elements 2 remove by class, 6=div 2 maximum by classes(1) or by tag(2)
const _default_font_family = "gitbook-content-font,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif, 微软雅黑";
const _url_array = [
    ["jb51.net", "", "",_default_font_family , "","pt10 search main-right lbd xgcomm tags ewm lbd_bot jb51ewm","main-left", "100%"],
    ["baidu.com", "", "",_default_font_family , "","","", ""],
    ["zhuanlan.zhihu.com", "#181C1F", "#EAF2F7",_default_font_family , "Modal-closeButton","css-1ynzxqw Recommendations-Main","Post-RichTextContainer Post-SideActions", "90%"],
    ["zhihu.com", "#181C1F", "#EAF2F7",_default_font_family , "Modal-closeButton","Question-sideColumn Question-sideColumn--sticky css-1qyytj7 css-1ynzxqw","List-item Question-mainColumn", "90%"],
    ["5axxw.com", "", "",_default_font_family , "","col-xl-auto ad_content_center answer-area bottom-ad","", ""],
    ["blog.csdn.net", "", "", "", "","blog_container_aside blog-footer-bottom more-toolbox-new recommend-box template-box recommend-right recommend-nps-box csdn-side-toolbar","main_father main container nodata", "100%"]
];

const URL_INDEX = 0;
const BGCOLOR_INDEX = 1;
const FNTCOLOR_INDEX = 2;
const FNTFML_INDEX = 3;
const BTN_INDEX = 4;
const DELETE_INDEX = 5;
const MAXIMUM_INDEX = 6;
const RESIZE_INDEX = 7;
const OP_MAXIMUM_BY_CLASSES = 1;
const OP_MAXIMUM_BY_TAG = 2;

(function() {
    'use strict';


    // get url user visited
    var _url = (window.location + "").toLowerCase();

    // if need active script
    var _active_index = -1;
    var i;
    for (i = 0; i < _url_array.length; i++){
        if (_url.indexOf(_url_array[i][URL_INDEX]) > 0){
            _active_index = i;
            break;
        }
    }

    if (_active_index >= 0){
        // set color
        _recursion_set_color(document.body,
                  _url_array[_active_index][BGCOLOR_INDEX],
                  _url_array[_active_index][FNTCOLOR_INDEX],
                  _url_array[_active_index][FNTFML_INDEX]);
        // remove mask div
        setInterval(function (){
            // BAIDU MOBILE
            _baidu_mobile_index(_url);
            _baidu_mobile_result(_url);

            //jb51.net
            _jb51_header_remove(_url);

            // CSDN
            var csdnContentBox = document.getElementsByClassName("blog-content-box")[0];
            if (null != csdnContentBox && typeof(csdnContentBox) !== "undefined"){
                csdnContentBox.style.background = "#8DA399";
                var links = document.getElementsByTagName("a");
                for (i = 0; i < links.length; i++){
                    links[i].style.color = "#0014ff";
                }
            }
            var zhihuContentBox = document.getElementsByClassName("QuestionHeader-title")[1];
            if (null != zhihuContentBox && typeof(zhihuContentBox) !== "undefined"){
                zhihuContentBox.style.marginTop = "30px";
            }
            var axxwMaskDiv = document.getElementById("gzh-modal-wrap");
            if (null != axxwMaskDiv && typeof(axxwMaskDiv)!=="undefined"){
                axxwMaskDiv.parentNode.style.display = "none";
            }

            // click button
            var _element_array = _url_array[_active_index][BTN_INDEX].split(" ");
            var m,i,_btns;
            for(m=0;m<_element_array.length;m++){
                if (""!==_element_array[m].trim()){
                    _element_array[m] = _element_array[m].trim();
                    _btns = document.getElementsByClassName(_element_array[m]);
                    if(typeof(_btns) !== 'undefined'){
                        for(i=0;i<_btns.length;i++){
                            if('BUTTON' === _btns[i].tagName){
                                // click the `close` button to close the mask div
                                _btns[i].click();
                            }
                        }
                    }
                }
            }
            _btns = document.getElementById("passportbox");
            if(null !== _btns && typeof(_btns) !== 'undefined' && _btns.children.length > 0){
                _btns.children[1].click();
            }


            // remove elements by class name
            _element_array = _url_array[_active_index][DELETE_INDEX].split(" ");
            for(m=0;m<_element_array.length;m++){
                if (""!==_element_array[m].trim()){
                    _element_array[m] = _element_array[m].trim();
                    _btns = document.getElementsByClassName(_element_array[m]);
                    if(typeof(_btns) !== 'undefined'){
                        for(i=0;i<_btns.length;i++){
                            _btns[i].style.display = "none";
                        }
                    }
                }
            }

            // resize divs
            _resize_div(_url_array[_active_index][MAXIMUM_INDEX].split(" "), OP_MAXIMUM_BY_CLASSES, _url_array[_active_index][RESIZE_INDEX]);
            _resize_div(_url_array[_active_index][MAXIMUM_INDEX].split(" "), OP_MAXIMUM_BY_TAG, _url_array[_active_index][RESIZE_INDEX]);

            // open hidden divs
            var hiddenDivArray = document.getElementsByClassName("hide-preCode-bt");
            if (typeof(hiddenDivArray) !== "undefined" && hiddenDivArray.length > 0){
                for (i = 0; i < hiddenDivArray.length; i++){
                    hiddenDivArray[i].click();
                }
            }
        }, 500);
    }

})();

function _jb51_header_remove(_url){
    if(_url.indexOf("jb51.net")>=0){
        if (null !== document.getElementById("header") && "undefined" !== document.getElementById("header")){
            document.getElementById("header").remove();
        }
        if (null !== document.getElementById("topbar") && "undefined" !== document.getElementById("topbar")){
            document.getElementById("topbar").remove();
        }
        if (null !== document.querySelector("a.umami--click--apeclass-img") && "undefined" !== document.getElementById("a.umami--click--apeclass-img")){
            document.querySelector("a.umami--click--apeclass-img").parentNode.style.display = "none";
        }
    }
}

function _baidu_mobile_result(_url){
    var i;
    if(_url.indexOf("baidu.com") < 0){
        return;
    }

    document.body.style.background = "#181C1F";
    var controller = document.getElementById("page-controller");
    if(null != controller && typeof(controller)!=="undefined"){
        controller.style.color = "#EAF2F7";
    }
    //修改底部logo颜色
    var logoArray = document.querySelector("i.icon-logo");
    if (null !== logoArray &&
        typeof(logoArray) !== "undefined"){
        logoArray.style.color = "#EAF2F7";
    }

    //修改底部logo翻页箭头颜色
    logoArray = document.querySelector("i.icon-nextpage");
    if (null !== logoArray &&
        typeof(logoArray) !== "undefined"){
        logoArray.style.color = "#EAF2F7";
    }

    //修改底部导航栏背景色
    var pagenavArray = document.querySelector("div.new-pagenav");
    if (null !== pagenavArray &&
        typeof(pagenavArray) !== "undefined"){
        pagenavArray.style.background = "#181C1F";
    }

    //干掉底部搜索
    var pageFoot = document.getElementById("page-ft");
    if (null !== pageFoot &&
        typeof(pageFoot) !== "undefined"){
        pageFoot.style.display = "none";
    }

    //干掉搜索结果中的广告
    var advArray = document.querySelector("div.ec_wise_ad");
    if (null !== advArray &&
        typeof(advArray) !== "undefined"){
        advArray.style.display = "none";
    }

    //干掉搜索结果中的悬浮窗广告
    advArray = document.querySelector("div.se-async-js");
    if (null !== advArray &&
        typeof(advArray) !== "undefined"){
        advArray.style.display = "none";
    }

    //干掉搜索结果中的推荐（搜索结果列表中的）
    var resultsDiv = document.querySelector("div.results");
    var resultArray = resultsDiv.getElementsByClassName("c-result");
    if (null !== resultArray &&
        typeof(resultArray) !== "undefined" &&
        resultArray.length > 0){

        for(i=0; i<resultArray.length; i++){
            if(resultArray[i].innerText.indexOf("大家还在搜") >= 0 ||
              resultArray[i].getAttribute('tpl') === "jy_rota_wenshu"|| // 不要百度文库的广告
              resultArray[i].getAttribute('tpl') === "image_strong_normal"|| // 不要百度图片
              resultArray[i].getAttribute('tpl') === "image_normal_tag"|| // 不要百度图片
              resultArray[i].getAttribute('tpl').indexOf("video") >= 0|| // 排除视频结果
              resultArray[i].getAttribute('tpl') === "sp_purc_atom" ){ // 不要百度商城推销
                resultArray[i].style.display = "none";
                resultArray[i].innerText="";
            }
        }
    }

    //修改每个搜索结果框的背景色
    var containerArray = resultsDiv.getElementsByClassName("c-container");
    if (null !== containerArray &&
        typeof(containerArray) !== "undefined" &&
        containerArray.length > 0){

        for(i=0; i<containerArray.length; i++){
            //修改每个搜索结果框的背景色
            containerArray[i].style.backgroundColor = "rgb(200 200 200)";

            var span = containerArray[i].querySelector("span.c-color-source");
            if(null != span && span.innerText.indexOf("百度文库") >= 0){
                // 不要百度文库的结果，和S一样的东西
                containerArray[i].style.display = "none";
                span.innerText="";
            }else{
                //修改每个搜索结果框作者链接的字体颜色
                if (null !== containerArray[i].querySelector("div.single-text")){
                    containerArray[i].querySelector("div.single-text").style.color = "#224d9d";
                }
            }
        }
    }

    //修改搜索条部分的背景色和字体颜色（移动版）
    var headTablink = document.querySelector("div.se-head-tab-link");
    if (null !== headTablink &&
        typeof(headTablink) !== "undefined"){
        _recursion_set_color(headTablink,"#181C1F", "#EAF2F7");
        //headTablink.style.backgroundColor = "#181C1F";
			//console.log("se-head-tab-link.style.backgroundColor=\'#181C1F\'");
    }

    //修改搜索条下方百度产品列表部分的背景色
    headTablink = document.querySelector("div.se-head-tablink");
    if (null !== headTablink &&
        typeof(headTablink) !== "undefined"){
        _recursion_set_color(headTablink,"#181C1F", "#EAF2F7");
        //headTablink.style.backgroundColor = "#181C1F";
			//console.log("se-head-tablink.style.backgroundColor=\'#181C1F\'");
    }

    //修改搜索条下方百度产品列表部分的字体颜色
    var tabitemArray = document.querySelector("div.se-tab-lists");
    if (null !== tabitemArray &&
        typeof(tabitemArray) !== "undefined"){
		tabitemArray = tabitemArray.getElementsByTagName("a");
		if(null != tabitemArray && tabitemArray.length > 0){
			for(i=0; i<tabitemArray.length; i++){
				tabitemArray[i].style.color = "#EAF2F7";
				tabitemArray[i].style.color = "#EAF2F7";
				span = null;
				span = tabitemArray[i].querySelector("span.se-tab-cur")
				if (null !== span){
					span.style.color = "red";
				}
			}
		}
    }
    tabitemArray = document.querySelector("div.main-tab");
    if (null !== tabitemArray &&
        typeof(tabitemArray) !== "undefined"){
		tabitemArray = tabitemArray.getElementsByTagName("a");
		if(null != tabitemArray && tabitemArray.length > 0){
			for(i=0; i<tabitemArray.length; i++){
				tabitemArray[i].style.color = "#EAF2F7";
				span = null;
				span = tabitemArray[i].querySelector("span.se-tab-cur")
				if (null !== span){
					span.style.color = "red";
				}
			}
		}
    }

    //干掉相关搜索推荐（结尾处）
    var pageRelativeDiv = document.getElementById("page-relative");
    if (null !== pageRelativeDiv &&
        typeof(pageRelativeDiv) !== "undefined"){
        pageRelativeDiv.style.display = "none";
    }

    //干掉广告（结尾版权处悬浮窗广告）
    var copyRightDiv = document.getElementById("page-copyright");
    if (null !== copyRightDiv &&
        typeof(copyRightDiv) !== "undefined"){
        copyRightDiv.style.display = "none";
    }

    //修改搜索结果背景色
    var pageBdDiv = document.getElementById("page-bd");
    if (null !== pageBdDiv &&
        typeof(pageBdDiv) !== "undefined"){
        pageBdDiv.style.backgroundColor = "#181C1F";
    }

    //修改搜索div头部背景色
    var pageHdDiv = document.getElementById("page-hd");
    if (null !== pageHdDiv &&
        typeof(pageHdDiv) !== "undefined"){
        pageHdDiv.style.backgroundColor = "#181C1F";
    }
}

function _baidu_mobile_index(_url){
    if(_url !== "https://www.baidu.com" &&
      _url !== "https://www.baidu.com/" &&
      _url !== "https://m.baidu.com" &&
      _url !== "https://m.baidu.com/"){
        return;
    }
    var i;

    // delete elements by class
    var underSearchboxTips = $(".under-searchbox-tips");
    if (null !== underSearchboxTips &&
        typeof(underSearchboxTips) !== "undefined" &&
        underSearchboxTips.length > 0){

        for(i=0; i<underSearchboxTips.length; i++){
            underSearchboxTips[i].style.display = "none";
        }
    }

    // delete elements by id
    var hotsearchWrapper = $("#s-hotsearch-wrapper");
    if (null !== hotsearchWrapper &&
        typeof(hotsearchWrapper) !== "undefined"){
        hotsearchWrapper.style.display = "none";
    }
    var hotsearchData = $("#hotsearch_data");
    if (null !== hotsearchData &&
        typeof(hotsearchData) !== "undefined"){
        hotsearchData.style.display = "none";
    }

    // process baidu.com for mobile
    // header div
    setInterval(function(){
    var navIndex = -1;
    var headerDiv = document.getElementById("header");
    if (null != headerDiv && null != headerDiv){
        headerDiv.style.height = $(window).height()+"px";
        headerDiv.style.backgroundColor = "#181C1F";
        var headerChildrenArray = headerDiv.childNodes;
        if (null !== headerChildrenArray &&
            typeof(headerChildrenArray) !== "undefined"){
            for(i=0; i<headerChildrenArray.length; i++){
                if (null !== headerChildrenArray[i] &&
                    typeof(headerChildrenArray[i]) !== "undefined"){
                    if(headerChildrenArray[i].id === "navs"){
                        navIndex = i;
                        continue;
                    }
                    if(navIndex >= 0){
                        headerChildrenArray[i].style.visibility = "hidden";
                    }
                }
            }
        }
    }
    }, 500);
    var indexForm = document.getElementById("index-form");
    var indexBtn = document.getElementById("index-bn");
    if (null != indexForm && null != indexForm){
        indexForm.style.borderColor = "rgb(116 116 116)";
        indexBtn.style.backgroundColor = "rgb(116 116 116)";
        $("#center-content-1").hide();
        $("#bottom").hide();
        $("#login-wraps").hide();
        $("#logo").hide();
    }
}

function _resize_div(_div_names, _op, _resize_rate){
    var i,j;
    if(typeof(_div_names) !== 'undefined'){
        for(i=0;i<_div_names.length;i++){
            if(""!==_div_names[i]){
                var _elements;
                if (_op == 1){
                    _elements = document.getElementsByClassName(_div_names[i]);
                }else{
                    _elements = document.getElementsByTagName(_div_names[i]);
                }
                if(typeof(_elements) !== 'undefined'){
                    for(j=0;j<_elements.length;j++){
                        _elements[j].style.width = _resize_rate;
                    }
                }
            }
        }
    }
}

/**
 * set font \ background-color \ font-family
 */
function _recursion_set_color(parent, _bg_color, _fnt_color, _fnt_family){
    if (typeof(parent.children) !== 'undefined'){
        if (parent.children.length > 0){
            var i;
            for(i=0;i<parent.children.length;i++){
                _recursion_set_color(parent.children[i], _bg_color, _fnt_color, _fnt_family);
            }
        }
        if (""!==_bg_color){
            parent.style.backgroundColor = _bg_color;
        }
        if (""!==_fnt_color){
            parent.style.color = _fnt_color;
        }
        if (""!==_fnt_family){
            parent.style.fontFamily = _fnt_family;
        }
    }
}
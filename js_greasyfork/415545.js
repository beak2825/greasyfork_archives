// ==UserScript==
// @name         百度搜索美化: 百度去广告、自动翻页、界面美化、多列展示
// @name:zh-CN   百度搜索美化: 百度去广告、自动翻页、界面美化、多列展示
// @namespace    baidu_beautify
// @version      4.5
// @description  顶部工具栏毛玻璃效果、底部分页栏悬浮、搜索结果添加边框、搜索结果多列、隐藏工具栏、隐藏分页并自动加载下一页
// @description:zh-CN  顶部工具栏毛玻璃效果、底部分页栏悬浮、搜索结果添加边框、搜索结果多列、隐藏工具栏、隐藏分页并自动加载下一页
// @author       Xavier Wong
// @run-at       document-start
// @match        https://www.baidu.com/
// @match        https://www.baidu.com/s*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/415545/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BE%8E%E5%8C%96%3A%20%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E3%80%81%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96%E3%80%81%E5%A4%9A%E5%88%97%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/415545/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BE%8E%E5%8C%96%3A%20%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E3%80%81%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96%E3%80%81%E5%A4%9A%E5%88%97%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

/**
 * 修改指定DOM
 * @param domSelector DOM选择器
 * @param style 样式
 */
function modifyDOM(domSelector, style){
    GM_addStyle(
        domSelector + '{' + style + '}'
    );
}

/**
 * 隐藏指定DOM
 * @param domSelector DOM选择器
 */
function hideDOM(domSelector){
    GM_addStyle(
        domSelector + '{display: none !important;}'
    );
}

/**
 * 判断DOM包含类
 * @param domSelector DOM选择器
 * @param className 类名
 */
function containDOMClass(domSelector, className){
    const dom = getDOM(domSelector);
    if(dom) {
        return dom.classList.contains(className);
    } else {
        return false;
    }
}

/**
 * 替换DOM类
 * @param domSelector DOM选择器
 * @param className 类名
 */
function replaceDOMClass(domSelector, oldClassName, newClassName){
    const dom = getDOMs(domSelector);
    getDOMs(domSelector).forEach(function(r){
        r.classList.add(newClassName);
        r.classList.remove(oldClassName);
    });
}

/**
 * 获取单个DOM
 * @param domSelector DOM选择器
 * @returns DOM
 */
function getDOM(domSelector, retryTime) {
    return document.querySelector(domSelector);
}

/**
 * 获取多个DOM
 * @param domSelector DOM选择器
 * @returns DOMs
 */
function getDOMs(domSelector) {
    return document.querySelectorAll(domSelector);
}

/**
 * 删除多个DOM
 * @param domSelector DOM选择器
 */
function deleteDOMs(domSelector) {
    getDOMs(domSelector).forEach(function(r){
        r.remove();
    });
}

/**
 * 移动DOM
 * @param srcDomSelector 来源DOM选择器
 * @param dstDomSelector 目标DOM选择器
 */
function moveBeforeDOM(srcDomSelector, dstDomSelector) {
    const srcDom = getDOM(srcDomSelector);
    const dstDom = getDOM(dstDomSelector);
    if(srcDom != null && dstDom != null) {
        dstDom.before(srcDom);
    }
}


/**
 * 添加设置分割线
 */
function addSettingSplit() {
    const splitLine = generateExtraSettingElement('cursor: default;', '丨');
    getDOM('#u').prepend(splitLine);
}

/**
 * 添加单列/双列模式切换按钮
 */
var isSingle = GM_getValue('isSingle', true);
function toggleSingleCol(single) {
    if(single) {
        GM_addStyle('#content_left{width: 100% !important; display: grid !important;}');
        GM_addStyle('#content_left>div{width: calc(100% - 76px) !important;}');
        GM_addStyle('[tpl="short_video"] .c-gap-top>div>.c-row{display: inline-flex; margin-right: 16px}');
        GM_addStyle('#content_right{display: none}');
    } else {
        GM_addStyle('#content_left{width: 100% !important; display: flex !important; flex-wrap: wrap !important;}');
        GM_addStyle('#content_left>div{width: calc(50% - 76px) !important;}');
        GM_addStyle('[tpl="short_video"] .c-gap-top>div>.c-row{display: block; margin-right: unset}');
        GM_addStyle('#content_right{display: none}');
    }
    isSingle = single;
    GM_setValue('isSingle', isSingle);
}
function addColumnToggleButton() {
    const singleColumnButton = generateExtraSettingElement(isSingle ? 'display: none' : 'display: inline-flex', '单列模式');
    const multiColumnButton = generateExtraSettingElement(!isSingle ? 'display: none' : 'display: inline-flex', '双列模式');
    singleColumnButton.onclick = function(){
        toggleSingleCol(true);
        singleColumnButton.style = 'display: none';
        multiColumnButton.style = 'display: inline-flex';
    }
    multiColumnButton.onclick = function(){
        toggleSingleCol(false);
        singleColumnButton.style = 'display: inline-flex';
        multiColumnButton.style = 'display: none';
    }
    getDOM('#u').prepend(singleColumnButton);
    getDOM('#u').prepend(multiColumnButton);
}

/**
 * 添加分页模式切换按钮
 */
var isPage = GM_getValue('isPage', false);
function togglePageOn(show) {
    if(show) {
        modifyDOM('#page', 'visibility: visible');
    } else {
        modifyDOM('#page', 'visibility: hidden');
    }
    isPage = show;
    GM_setValue('isPage', isPage);
}
function addPageToggleButton() {
    const pageOnButton = generateExtraSettingElement(isPage ? 'display: none' : 'display: inline-flex', '开启分页');
    const pageOffButton = generateExtraSettingElement(!isPage ? 'display: none' : 'display: inline-flex', '关闭分页');
    pageOnButton.onclick = function(){
        togglePageOn(true);
        pageOnButton.style = 'display: none';
        pageOffButton.style = 'display: inline-flex';
    }
    pageOffButton.onclick = function(){
        togglePageOn(false);
        pageOnButton.style = 'display: inline-flex';
        pageOffButton.style = 'display: none';
    }
    getDOM('#u').prepend(pageOnButton);
    getDOM('#u').prepend(pageOffButton);
}

/**
 * 添加工具栏开关按钮
 */
var isTool = GM_getValue('isTool', true);
function toggleToolOn(show) {
    if(show) {
        modifyDOM('#s_tab', 'height: 38px');
    } else {
        modifyDOM('#s_tab', 'height: 11px');
    }
    isTool = show;
    GM_setValue('isTool', isTool);
}
function addToolToggleButton() {
    const toolOnButton = generateExtraSettingElement(isTool ? 'display: none' : 'display: inline-flex', '显示分类');
    const toolOffButton = generateExtraSettingElement(!isTool ? 'display: none' : 'display: inline-flex', '隐藏分类');
    toolOnButton.onclick = function(){
        toggleToolOn(true);
        toolOnButton.style = 'display: none';
        toolOffButton.style = 'display: inline-flex';
    }
    toolOffButton.onclick = function(){
        toggleToolOn(false);
        toolOnButton.style = 'display: inline-flex';
        toolOffButton.style = 'display: none';
    }
    getDOM('#u').prepend(toolOnButton);
    getDOM('#u').prepend(toolOffButton);
}

function generateExtraSettingElement(style, btnTxt){
    const tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = '<a href="javascript:;" style="' + style + '" >' + btnTxt + '</a>';
    return tmpDiv.firstElementChild;
}

function generateScrollToTopElement(){
    const tmpDivA = document.createElement("div");
    tmpDivA.id = 'scrollToTopA';
    tmpDivA.classList.add('scrollToTop');
    tmpDivA.style = 'position: fixed; bottom: 80px; border-radius: 50%; cursor: pointer; height: 44px; width: 44px; align-items: center; justify-content: center; box-shadow: 0 2px 4px 0 rgba(0,0,0,.05)';
    tmpDivA.innerHTML = '<img src="https://g.csdnimg.cn/side-toolbar/3.4/images/fanhuidingbucopy.png" style="width: 24px;">';
    tmpDivA.onclick = function() {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    };
    getDOM('html').appendChild(tmpDivA);
    replaceDOMClass('.scrollToTop', 'show', 'hide');
}

function init() {
    // 导航栏样式，毛玻璃效果
    modifyDOM('#head', 'background-color: rgba(248,248,248,0.4)');
    modifyDOM('.head_wrapper', 'width: 90%');
    modifyDOM('.s_form', 'backdrop-filter: blur(10px);');
    hideDOM('[tpl="app/search-tag"]');
    // 工具栏样式, 透明效果
    toggleToolOn(isTool);
    modifyDOM('#s_tab', 'border-bottom: #e0e0e0 1px solid; background-color: rgba(248,248,248,0.4) !important; overflow: hidden;')
    modifyDOM('.s_tab_inner', 'background-color: rgba(248,248,248,0.4)');
    // 去除右侧
    hideDOM('#content_right');
    toggleSingleCol(isSingle);
    modifyDOM('#container.sam_newgrid', 'margin-right: 150px; width: auto; margin-bottom:45px');
    togglePageOn(isPage);
    GM_addStyle(
        '.new-pmd .c-span8{width: calc(100% - 192px) !important}' +
        '.new-pmd .c-span9{width: calc(100% - 144px) !important}' +
        '.new-pmd .c-span12{width: 100% !important}' +
        // 内容卡美化
        '#content_left>div{margin-right:44px !important;margin-bottom:20px !important;border-radius:12px !important;padding:16px !important;-webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.1) !important;}' +
        '#content_left>table{margin-right:44px !important;margin-bottom:20px !important;border-radius:12px !important;-webkit-box-shadow: 0 2px 5px 0 rgba(0,0,0,.1) !important;}' +
        '#content_left>table>tbody>tr>td{padding:16px !important}' +
        '#content_left>table>tbody>tr>td>div{width:560px !important;-webkit-box-shadow:unset !important;border: none !important;padding: 0 !important}' +
        '.c-border{-webkit-box-shadow:unset !important;margin-bottom: 0 !important;border: none !important}' +
        '[class*="single-card-wrapper"] {margin: -46px -16px -16px; padding: 46px 16px 10px 16px !important; box-shadow: unset !important}' +
        '[class*=content-border] {box-shadow: unset !important}' +
        '.wd-ai-index-pc {margin: -16px !important; width: unset !important}' +
        '.new-pmd.c-container {width: fit-content !important}' +
        // 隐藏相关搜索&其他人在搜
        '#rs_new, [tpl=recommend_list], [tpl=app\\/footer], div[data-click="{"]{display: none !important}' +
        // 分页栏样式
        '#page{position:fixed; bottom:0; width:100%;}' +
        '#page > div{padding: 5px 15px !important; margin: 5px 0 5px 140px !important;}'
    );
    GM_addStyle(
        '#scrollToTopA{right: 50px}' +
        '.scrollToTop.show{display: flex}' +
        '.scrollToTop.hide{display: none}'
    );
    if(getDOM('#su')) getDOM('#su').onclick = function() {currentUrl = document.location.href; currentPage = getUrlParam("pn");}
    if(getDOM('#kw')) getDOM('#kw').onkeydown = function() {if(event.keyCode==13) {currentUrl = document.location.href; currentPage = getUrlParam("pn");}}

}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var currentUrl = document.location.href;
var currentPage = getUrlParam("pn");
function loadNextPage(){
    showToast('加载中...');
    var xhr = new XMLHttpRequest();
    var nextPageUrl;
    var nextPage;
    if(currentPage == null){
        currentPage = 0;
        nextPage = 10;
        if(document.querySelectorAll("#page .n").length===2){
            nextPageUrl = document.querySelectorAll("#page .n")[1].href;
        }else{
            nextPageUrl = document.querySelectorAll("#page .n")[0].href;
        }
    }else{
        nextPage = currentPage + 10;
        nextPageUrl = currentUrl.replace('&pn='+currentPage, '&pn='+nextPage)
    }
    xhr.open("GET", nextPageUrl);
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var parser = new DOMParser();
            var doc = parser.parseFromString(xhr.responseText, "text/html");
            var results = doc.querySelectorAll('.result');
            for (var i = 0; i < results.length; i++) {
                document.querySelector('#content_left').appendChild(results[i])
            }
            showToast('已加载第' + (nextPage/10 + 1) + '页');
            let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            if(clientHeight == scrollHeight) {
                loadNextPage();
            }
        }
    }
    currentUrl = nextPageUrl;
    currentPage= nextPage;
}

function scrollToTopF(){
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
    });
}
function showToast(msg){
    deleteDOMs('#pageLoaded');
    var m = document.createElement('div');
    m.id = 'pageLoaded';
    m.innerHTML = msg;
    m.style = "padding:0 14px; height: 40px; color: white; line-height: 40px; text-align: center; border-radius: 10px; position: fixed; bottom: 5%; left: 50%; transform: translate(-50%, -50%); z-index: 999; background: rgba(0, 0, 0, 0.7); font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
    }, 500);
}

(
    function() {
        'use strict';
        init();

        document.addEventListener('DOMContentLoaded',function(e){
            generateScrollToTopElement();
            addSettingSplit();
            addToolToggleButton();
            addPageToggleButton();
            addColumnToggleButton();
        });
        window.onload = function(){
            // 添加观察者，监控样式变化
            var observer = new MutationObserver(function() {
                init();
            });
            observer.observe(document.querySelector('#wrapper'), {
                attributes: true
            });
        }
        window.onscroll = function(){
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            if(scrollTop <= 200) {
                replaceDOMClass('.scrollToTop', 'show', 'hide');
            }
            if(scrollTop > 200) {
                replaceDOMClass('.scrollToTop', 'hide', 'show');
            }
            if(!isPage) {
                if((scrollHeight > clientHeight) && (scrollTop + clientHeight >= scrollHeight)) {
                    loadNextPage();
                }
            }
        }
    }
)();
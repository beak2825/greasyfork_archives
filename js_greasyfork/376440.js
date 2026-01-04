// ==UserScript==
// @name         hiddenZhihu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏知乎无用模块
// @author       felixZhang
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376440/hiddenZhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/376440/hiddenZhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function removeZhihu() {
        //知乎logo
        let zhihulogo = document.getElementsByClassName("ZhihuLogo");
        for(var logo of zhihulogo){
            logo.style.display='none'
        }
        //主页的侧边栏
        let GlobalSideBar = document.getElementsByClassName("GlobalSideBar");
        for(var side of GlobalSideBar){
            side.style.display='none'
        }
        //头部导航栏
        let AppHeader = document.getElementsByClassName("AppHeader");
        for(var head of AppHeader){
            head.style.display='none'
        }
        //问题详情侧边栏
        let questionSideColumn = document.getElementsByClassName("Question-sideColumn");
        for(var sidecol of questionSideColumn){
            sidecol.style.display='none'
        }
    }
    function removeZhihuHot(){
        let HotItemImg = document.getElementsByClassName("HotItem-img");
        for(var hotimg of HotItemImg){
            hotimg.style.display='none'
        }
        let HotItemIndex = document.getElementsByClassName("HotItem-index");
        for(var hotindex of HotItemIndex){
            hotindex.style.display='none'
        }

        let HotItemMetricsBottom = document.getElementsByClassName("HotItem-metrics");
        for(var hotbottom of HotItemMetricsBottom){
            hotbottom.style.display='none'
        }
    }
    function changeTheme() {
        //知乎主题改为黑色
        let htmlzhihu = document.getElementsByTagName("HTML")[0];
        htmlzhihu.dataset.theme="dark"
    }
    function removeCard(){
        //内容图片
        let RichContentCover = document.getElementsByClassName("RichContent-cover");
        for(var cover of RichContentCover){
            cover.style.display='none'
        }
        //svg
        let svgs = document.getElementsByTagName("svg")
        for(var svg of svgs){
            svg.style.display='none'
        }
        //转发评论等按钮
        let ContentItemActions = document.getElementsByClassName("ContentItem-actions");
        for(var action of ContentItemActions){

            action.getElementsByClassName("VoteButton--down")[0].style.display='none'
            var ButtonWithIcon = action.getElementsByClassName("Button--withIcon")
            for(var i=1;i<ButtonWithIcon.length;i++){
                ButtonWithIcon[i].style.display='none'
            }
            for(var Popover of action.getElementsByClassName("Popover")){
                Popover.style.display='none'
            }
            //action.style.display='none'
        }
        //广告
        let TopstoryItemAdvertCard = document.getElementsByClassName("TopstoryItem--advertCard");
        for(var card of TopstoryItemAdvertCard){
            card.style.display='none'
        }
    }
    console.debug('隐藏知乎无用模块');
    changeTheme();
    removeZhihu();
    removeZhihuHot();

    let TopstoryContent = document.getElementsByClassName("Topstory-content");
    for(var content of TopstoryContent){
        content.addEventListener('DOMNodeInserted',function () {
            removeCard();
            removeZhihuHot();
        })
    }

})();
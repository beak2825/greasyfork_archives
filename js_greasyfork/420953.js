// ==UserScript==
// @name                [星田雨]-隐藏百度百科和百度经验中的'秒懂百科'视频
// @namespace           https://greasyfork.org/
// @version             2.4.0
// @description         隐藏百度百科和百度经验中的'秒懂百科'视频;使用比较low的方式,带佬莫笑我 -.-;感谢AC的大力支持@AC
// @author              XingTianyu
// @match               *://baike.baidu.com/item/*
// @match               *://jingyan.baidu.com/article/*
// @icon                https://baike.baidu.com/favicon.ico
// @grant               none
// @note                2023.12.05-V2.4.0 修复了百度百科给class加了一些奇怪后缀导致无法隐藏的问题,使用了一些新的代码;感谢@我不知道也不明白 网友热心的指出问题
// @note                2023.04.02-V2.3.1 修复了百科新版无法过滤秒懂百科视频的bug ;感谢 @风行于野提出问题(就是修复来的有点晚)
// @note                2021.05.29-V2.3.0 修复了百度百科中多义词被误隐藏的问题;感谢@Lottie Spade、@Khan2001、@氏贺X太 三位网友热心的指出问题
// @note                2021.03.02-V2.2.0 修复部分(搜了《维京传奇》，它的秒懂百科无法隐藏)百度百科的秒懂百科无法隐藏的问题
// @note                2021.02.20-V2.0.0 新增隐藏百度经验页面中的‘秒懂百科’
// @note                2021.02.08-V1.1.0 使用AC教我的给元素添加'display:none'属性的方式来实现视觉'去除'，修复人物百科页面无法'去除'的问题
// @note                2021.01.31-V1.0.0 简单粗暴的删除页面元素
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/420953/%5B%E6%98%9F%E7%94%B0%E9%9B%A8%5D-%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%92%8C%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E4%B8%AD%E7%9A%84%27%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%27%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/420953/%5B%E6%98%9F%E7%94%B0%E9%9B%A8%5D-%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%92%8C%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E4%B8%AD%E7%9A%84%27%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%27%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
     var verison='V2.4.0';

    /**
     * 老方法，获取待删除节点的父节点，然后用父节点删除目标节点 已废除
     * @param {待删除元素的class名称}
     */
    function removeElementByHimFather(className) {
        //获取待删除元素
        var removeEle = document.querySelector('.' + className);
        if (removeEle !== null) {
            // 获取目标节点的父节点
            var parent = removeEle.parentElement;
            // 用目标节点的父节点删除目标节点
            parent.removeChild(removeEle);
        }
    }

    /**
     * 新方法，给元素添加隐藏属性，页面不再展示该元素
     * @param {待删除元素的class名称}
     */
    var hideElement = function (className) {
        //var hideEle = document.querySelector('.' + className);
        var hideEle = document.querySelectorAll("div[class^='"+className+"'");
         //console.log("%c星田雨 %c 开始处理["+className+"]", "font-weight:bold;color:darkorange", "color:0");
        //先判断是否存在再继续操作
        if (hideEle) {
            for (var ele of hideEle) {
                ele.style.cssText = "display:none";
            }
        }
    }


    /**
     * 进一步封装删除的方法
     * @param {待删除的广告元素class名称数组} classNameArray
     */
    function removeByLoopArray(classNameArray) {
        for (var className of classNameArray) {
            // 移除元素
            // removeElementByHimFather(className);
            // 隐藏元素
            hideElement(className);
        }
    }


    /**
     * 使用定时器删除 已废除
     * @param {待删除的元素class名称数组} classNameArray
     */
    function timerToRemove(classNameArray) {
        setTimeout(removeByLoopArray, 1000, classNameArray);
    }


    /**
     * 按周期来调用
     * @param {待处理的元素className数组} classNameArray
     * @param {回调函数} callbackFunc
     * @param {定时时间} time
     */
    var safeWaitFunc = function (classNameArray, callbackFunc, time) {
        time = time || 50;
        var id = setInterval(function () {
            clearInterval(id);
            callbackFunc(classNameArray);
        }, time)
    };



    /**
     * 打印脚本信息
     */
    function printInfo() {
        console.log("%c[星田雨-“隐藏百度百科和百度经验中的'秒懂百科'视频 "+verison+"”] %c感谢使用，不相关的元素已隐藏～", "font-weight:bold;color:darkorange", "color:0");
    }


    //************************************************************************************* */
    //秒懂百科、v百科、xx、yy、'下载APP'、分享按钮、'TA说'右侧小卡片、'TA说'下面的div、人物百科的秒懂百科视频所在div的className；百度经验中的秒懂百科视频所在的className、秒懂百科下方的说明文字、百度经验右侧的滚动框、百度经验导航栏右侧的‘写经验 领红包’、新发现的类型(也是百度百科的秒懂百科)
    //var classNameArray = ['video-list-container', 'lemmaWgt-promotion-vbaike', 'lemmaWgt-promotion-slide', 'topA', 'appdownload', 'share-list', 'tashuo-right', 'tashuo-bottom', 'poster-middle','feeds-video-box','feeds-video-one-view','wgt-cms-banner','fresh-share-exp-e','J-secondsknow-large-container'];
    var classNameArray = ['appDownload_','tashuoWrap_','hotspotWrapper_','share_','contentBottom_','slideAdBox_','unionAd_','guessLike_','wgt-douwan-video','aside-ads-container','bottom-pic-ads','bottom-ads-container','aside-wrap','task-panel-entrance']
    // timerToRemove(classNameArray);
    safeWaitFunc(classNameArray, removeByLoopArray);

    //打印信息
    printInfo();

})();
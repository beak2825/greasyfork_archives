// ==UserScript==
// @name                Bilibili 无评论，无推荐，无侧栏直播推广
// @namespace           https://greasyfork.org/
// @version             1.0.5
// @description         只保留B站视频部分
// @author              iceynano
// @match               *://*.bilibili.com/video/*
// @match               *://*.bilibili.com/audio/*
// @match               *://*.bilibili.com/watchlater*
// @match               *://*.bilibili.com/bangumi/play/*
// @match               *://*.bilibili.com/medialist/play/*
// @icon                https://www.bilibili.com/favicon.ico
// @grant               none
// @note                2022.07.21-V1.0.0 完成代码的迁移和修改，保留原代码迭代记录
// @note                2022.07.21-V1.0.1 新增过滤，清除了未安装Adblock插件浏览器上的额外广告
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/519620/Bilibili%20%E6%97%A0%E8%AF%84%E8%AE%BA%EF%BC%8C%E6%97%A0%E6%8E%A8%E8%8D%90%EF%BC%8C%E6%97%A0%E4%BE%A7%E6%A0%8F%E7%9B%B4%E6%92%AD%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/519620/Bilibili%20%E6%97%A0%E8%AF%84%E8%AE%BA%EF%BC%8C%E6%97%A0%E6%8E%A8%E8%8D%90%EF%BC%8C%E6%97%A0%E4%BE%A7%E6%A0%8F%E7%9B%B4%E6%92%AD%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';

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
     * 支持识别className和id
     */
    var hideElement = function (className) {
        //先判断className是否存在再继续操作
        var hideEle = document.querySelector('.' + className);
        if (hideEle) {
            hideEle.style.cssText = "display:none";
        }
        //先判断id是否存在再继续操作
        var elem = document.getElementById(className);
        if (elem) {
            elem.style.cssText = "display:none";
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
     * 设定为1秒内清除完元素
     */
    function safeWaitFunc(classNameArray, callbackFunc) {
        setTimeout(function () {
            callbackFunc(classNameArray);
            safeWaitFunc(classNameArray, callbackFunc);
        }, 1000);
    };



    /**
     * 打印脚本信息
     */
    function printInfo() {
        //console.log("%c[星田雨-“隐藏百度百科和百度经验中的'秒懂百科'视频”] %c感谢使用，不相关的元素已隐藏～", "font-weight:bold;color:darkorange", "color:0");
        console.log("%c[iceynano-Bilibili视频播放页面净化] %c由星田雨(665470-truelight)秒懂百科屏蔽脚本迁移而来", "font-weight:bold;color:darkorange", "color:0");
    }


    //**************************************************************************************/
    //'视频推荐列表','直播推荐','游戏广告','番剧推荐','推广广告'*2
    var classNameArray = ['reco_list', 'live_recommand_report', 'right-bottom-banner', 'recom_module', 'vcd', 'slide_ad', 'recommend-list-v1', 'commentapp', 'pop-live-small-mode part-1', 'pl__card'];
    //'评论区','新版评论区','稍后再看评论区','番剧评论区','音频评论区'
    var commentArray = ['comment-m', 'comment', 'also-like', 'common', 'song-comment'];
    // timerToRemove(classNameArray);
    safeWaitFunc(classNameArray, removeByLoopArray);
    safeWaitFunc(commentArray, removeByLoopArray);

    //打印信息
    printInfo();

})();
// ==UserScript==
// @name B站自动点赞关注主播的视频（观看30秒后点赞但不投币）
// @namespace http://tampermonkey.net/
// @version 1.7
// @description 在B站（bilibili）观看关注主播的视频超过30秒后，自动点赞
// @author 王泥巴
// @match https://www.bilibili.com/video/*
// @grant none
// @icon https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/434123/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%85%B3%E6%B3%A8%E4%B8%BB%E6%92%AD%E7%9A%84%E8%A7%86%E9%A2%91%EF%BC%88%E8%A7%82%E7%9C%8B30%E7%A7%92%E5%90%8E%E7%82%B9%E8%B5%9E%E4%BD%86%E4%B8%8D%E6%8A%95%E5%B8%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/434123/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%85%B3%E6%B3%A8%E4%B8%BB%E6%92%AD%E7%9A%84%E8%A7%86%E9%A2%91%EF%BC%88%E8%A7%82%E7%9C%8B30%E7%A7%92%E5%90%8E%E7%82%B9%E8%B5%9E%E4%BD%86%E4%B8%8D%E6%8A%95%E5%B8%81%EF%BC%89.meta.js
// ==/UserScript==

function HasFollowCreator() {
    var CreatorList = document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div.up-panel-container > div.members-info-container > div > div.container");
    if (CreatorList) {
        for (const upcardWrap of CreatorList.children) {
            // 尝试在当前元素下查找.add-follow-btn元素
            const addButton = upcardWrap.querySelector('.add-follow-btn');
            if (!addButton) { // 如果没有找到 .add-follow-btn 元素
                return true; // 立即返回 true，退出函数
            }
        }
    }
    return false; // 如果全部元素都没找到则返回 false
}

(function() {
    var delayTimeMS = 30 * 1000; //30秒后才点赞
    var videoElement = document.querySelector('#bilibili-player video')

    function autoLike() {
        // 点赞逻辑
        var bHasFollowCreator = document.getElementsByClassName("already-btn")[0] != undefined
        var bHasFollowJointCreator = HasFollowCreator()
        if (bHasFollowCreator || bHasFollowJointCreator) { // 是否关注主播
            console.log('已关注up主或联合作者', bHasFollowCreator, bHasFollowJointCreator)
            var likeBtn = document.querySelector("#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main > div:nth-child(1) > div")
            if (!likeBtn) {
                console.error("没找到点赞按钮");
            }
            if (likeBtn.className == "video-like video-toolbar-left-item") {
                likeBtn.click();
                console.log("已自动为up主点赞");
            }
        }
    }

    let timer;
    // 监听页面加载完毕事件
    window.addEventListener("load", function() {
        // 启动计时器
        if(document.visibilityState=="visible"){
            console.log("页面加载完成触发点赞计时器");
            clearTimeout(timer);
            timer = setTimeout(function() {
                autoLike();
            }, delayTimeMS)
        }
    });

    document.addEventListener("visibilitychange",function(){
        console.log('页面前后台变化');
        if(document.visibilityState=="visible"){
            if (typeof timer !== "number") { //判断计时器还没被设置过
                console.log('页面切到前台，开启计时器');
                timer = setTimeout(function(){
                    autoLike()
                }, delayTimeMS)
            }
        }
        if(document.visibilityState=="hidden"){
            console.log("页面切到后台")
        }

    })

    const observer = new MutationObserver(function(mutations) {
        console.log('页面切换，重新设置点赞计时器');
        clearTimeout(timer);
        timer = setTimeout(function() {
            autoLike();
        }, delayTimeMS)
    });

    console.log('找到点赞视频元素', videoElement)

    observer.observe(videoElement, {
        attributes: true,//元素属性发生变化
    });

    console.log("B站自动点赞脚本加载完成");
})();


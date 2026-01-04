// ==UserScript==
// @name          bilibili视频页自动展开弹幕列表、移除部分视频推荐广告信息
// @namespace     https://greasyfork.org/zh-CN/scripts/402288
// @description	  bilibili视频页自动展开弹幕列表、移除部分推荐广告信息
// @author        nicky
// @match         *://www.bilibili.com/video/*
// @match         *://www.bilibili.com/bangumi/play/*
// @homepage      https://greasyfork.org/zh-CN/scripts/402288
// @run-at        document-end
// @version       0.4
// @downloadURL https://update.greasyfork.org/scripts/402288/bilibili%E8%A7%86%E9%A2%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%BC%B9%E5%B9%95%E5%88%97%E8%A1%A8%E3%80%81%E7%A7%BB%E9%99%A4%E9%83%A8%E5%88%86%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/402288/bilibili%E8%A7%86%E9%A2%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%BC%B9%E5%B9%95%E5%88%97%E8%A1%A8%E3%80%81%E7%A7%BB%E9%99%A4%E9%83%A8%E5%88%86%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function() {
    //document.querySelector(".bui-collapse-header").click()
    setTimeout(function(){
        document.querySelector(".bui-collapse-header").click()
        document.querySelector(".video-page-game-card").remove()
        document.querySelector("#live_recommand_report").remove()
        document.querySelector("#activity_vote").remove()
    },8000)
})();
/*document.addEventListener('visibilitychange',function(){
    if(document.visibilityState=='hidden') {
        document.querySelector(".bui-collapse-header").click() //刷新页面
    }else {
        document.querySelector(".bui-collapse-header").click() //刷新页面
    }
});*/
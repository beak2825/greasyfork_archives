// ==UserScript==
// @name         自动领取起点小说网经验值
// @namespace    https://saltbo.cn/
// @version      0.4
// @description  在浏览网页的过程中自动计算是否该去领取经验值了，如果满足条件则自动打开一个tab去领取，领取完自动关闭，全程无感知
// @author       saltbo
// @match        http*://*/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/402760/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%BB%8F%E9%AA%8C%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/402760/%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E7%BD%91%E7%BB%8F%E9%AA%8C%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动登录后只能跳到首页，这里自动跳去领取页
    if(location.host == "my.qidian.com" && location.pathname == "/"){
        location.pathname = "/level"
        return
    }

    // 当打开的页面是经验值领取页则自动领取经验值
    if(location.host == "my.qidian.com" && location.pathname == "/level"){
        const expGet = function(){
            let expList = document.getElementsByClassName("elGetExp");
            if (expList.length > 0) {
                expList[0].click();
            }
        }
        window.addEventListener('load', expGet, false);
        return
    }

    const progress = function(){
        // 计算逻辑，每次打开任意网页时执行，上次领取时间间隔满足领取条件则自动打开经验值领取页
        let timeIntervals = [0, 300, 600, 1200, 1800, 3600, 3600, 3600]
        let todayKey = "today"
        let todayCntKey = "today_cnt"
        let lastCheckTimeKey = "last_check_time"
        let nowDate = new Date()
        let nowTime = nowDate.getTime();
        let today = nowDate.getDay();

        // 如果今天已经领完了则不再继续领
        if(GM_getValue(todayKey, 0) == today){
            return
        }

        let todayCnt = GM_getValue(todayCntKey, 0)
        let lastCheckTime = GM_getValue(lastCheckTimeKey, nowTime)
        let nowInterval = (nowTime-lastCheckTime)/1000

        console.log("QidianTimer: ", nowInterval, timeIntervals[todayCnt])
        if(nowInterval >= timeIntervals[todayCnt]){
            let tab = GM_openInTab("https://my.qidian.com/level", true)
            setTimeout(tab.close, 5000)
            todayCnt++
            if(todayCnt >= timeIntervals.length){
                todayCnt = 0
                GM_setValue(todayKey, today)
            }

            GM_setValue(todayCntKey, todayCnt)
            GM_setValue(lastCheckTimeKey, nowTime)
        }
    }
    window.addEventListener('load', progress, false);
})();
// ==UserScript==
// @name         青书学堂挂课-有电脑版本客户端自动下一集
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  青书学堂挂课,自动播放脚本。
// @author       李老师
// @match        https://qingshuxuetang.com/*
// @match        https://*.qingshuxuetang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingshuxuetang.com
// @grant        unsafeWindow
// @connect      degree.qingshuxuetang.com
// @connect      www.qingshuxuetang.com
// @run-at       document-end
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/504998/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE-%E6%9C%89%E7%94%B5%E8%84%91%E7%89%88%E6%9C%AC%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/504998/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE-%E6%9C%89%E7%94%B5%E8%84%91%E7%89%88%E6%9C%AC%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==
console.log('当前执行站点', unsafeWindow.location.href, unsafeWindow.parent)
if (unsafeWindow.self !== unsafeWindow.top) {
    return;
}
 
(function () {
    'use strict';
    var i
    var href = location.href
 
    if (href.indexOf('nodeId') > -1) {
        setTimeout(function () {
            var video = document.querySelector(".vjs-tech");
            if (video) {
                console.log('找到视频组件,开始静音并自动播放...', video)
                video.muted = true
                video.playbackRate = 1.5
                video.play()
            } else {
                console.log('未找到视频组件');
                return;
            }
            
            var params = new UrlSearch()
            var paramsNodeId = params.nodeId.trim();;
            var allLinks = document.querySelectorAll('[id^="courseware-"]');
            var ids = Array.from(allLinks).map(link => link.id.replace('courseware-', ''));
            var currentIndex = ids.indexOf(paramsNodeId);
            var nextKey = null;
            if (currentIndex !== -1 && currentIndex + 1 < ids.length) {
                nextKey = ids[currentIndex + 1];
            }
            if (nextKey) {               
                const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${params.courseId}&nodeId=${nextKey}`
                console.log(params, 'currentId:', params.courseId, 'nextKey:', nextKey, 'nextUrl:', nextUrl)
                video.addEventListener("ended", function () {
                    location.replace(nextUrl);
                })
            }else{
                console.log('未找到下一节课程ID');
            }
        }, 5000)        
        getvideoprogress();
    }
})();
 
function UrlSearch() {
    var name, value;
    var str = location.href; 
    var num = str.indexOf("?")
    str = str.substr(num + 1); 
 
    var arr = str.split("&");
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
}
 
function getvideoprogress() {
    setInterval(function () {
        var vid = document.querySelector(".vjs-tech");
        if (vid) {
            var currentTime = vid.currentTime; 
            var duration = vid.duration;
            if (duration > 0) { 
                var progressPercent = (currentTime / duration * 100).toFixed(1);
                console.log('当前进度:', currentTime.toFixed(1), '秒', '(', progressPercent + '%', ')');
            }
        }
    }, 10000);
}
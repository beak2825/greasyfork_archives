// ==UserScript==
// @name         青书学堂自动刷课，进入下一集
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  青书学堂自动播放脚本，自动播放下一集。
// @author       马鹏飞
// @match        https://qingshuxuetang.com/*
// @match        https://*.qingshuxuetang.com/*
// @match        https://www.qingshuxuetang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingshuxuetang.com
// @grant        unsafeWindow
// @connect      degree.qingshuxuetang.com
// @connect      www.qingshuxuetang.com
// @run-at       document-end
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/505584/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%8C%E8%BF%9B%E5%85%A5%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/505584/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%8C%E8%BF%9B%E5%85%A5%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==
console.log('当前执行站点', unsafeWindow.location.href, unsafeWindow.parent)
if (unsafeWindow.self !== unsafeWindow.top) {
    return;
}

(function() {
    'use strict';
    var i
    var href = location.href

    if (href.indexOf('nodeId') > -1) {
        setTimeout(function() {
            var video = document.querySelector(".vjs-tech");
            if (video) {
                console.log('找到视频组件,开始静音并自动播放...', video)
                video.muted = true
                video.playbackRate = 1
                video.play()
            } else {
                console.log('未找到视频组件');
                return;
            }

          var params = new UrlSearch()
          // 课程ID
          var courseId = params.courseId
          const courseArr = params.nodeId.split('_')
          // 下一个播放的视频的key
          var nextKey = ''
          if (courseArr.length == 2) {
            nextKey = `kcjs_${Number(courseArr[1]) + 1}`
          } else if (courseArr.length == 3) {
            nextKey = `kcjs_${courseArr[1]}_${Number(courseArr[2]) + 1}`
          }
          const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&nodeId=${nextKey}&category=${params.category}`
          console.log(params, 'currentId:', params.nodeId, 'nextKey:', nextKey, 'nextUrl:', nextUrl)
          // 视频播放结束,自动下一条视频
          video.addEventListener("ended",function(){
            location.replace(nextUrl);
          })
        }, 5000)

        // 打印播放进度
        getvideoprogress();
    }
})();

function UrlSearch() {
   var name,value;
   var str=location.href; //取得整个地址栏
   var num=str.indexOf("?")
   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

   var arr=str.split("&"); //各个参数放到数组里
   for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        }
    }
}

// 检测当前播放的进度
function getvideoprogress() {
    setInterval(function () {
        var vid = document.getElementsByTagName("video")[0]
        var currentTime=vid.currentTime.toFixed(1);
        console.log('当前进度:', currentTime);
    }, 10000);
}
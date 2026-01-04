// ==UserScript==
// @name         自用脚本
// @namespace    http://tampermonkey.net/
// @version      0.3.19
// @description  尝试播放
// @author       Ding Dang
// @match        http://sddy.gxk.yxlearning.com/learning/index?myClassId=*
// @match        http://sddy.zyk.yxlearning.com/learning/index?myClassId=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472383/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/472383/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


 window.addEventListener('load', function() {
    //alert('页面已加载完成!');

    // 先检查浏览器是否支持Notifications API
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // 然后检查用户是否已经给了通知权限
    else if (Notification.permission === "granted") {
        // 如果已经有权限，就创建一个通知
        var notification = new Notification("Hi there!");
    }

    // 否则，我们需要向用户请求权限
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            // 如果用户接受权限请求，就创建一个通知
            if (permission === "granted") {
                var notification = new Notification("Hi there!");
            }
        });
    }

    
    // 获取视频组件
    const videoEl = document.querySelector('.pv-video');
 
    // 查询所有的li标签
    var liElements = document.querySelectorAll('ul.pt5 li');
 
    let i = 0;  // 使用let关键字，使得i可以在其他函数中访问
 
});

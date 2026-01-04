// ==UserScript==
// @name         JIRA内容变化监测器
// @namespace    https://www.hookbin.top
// @license      MIT
// @version      1.3
// @description  监测JIRA内容是否发生变化，并发送浏览器通知
// @match        https://jira.ecarxgroup.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/485944/JIRA%E5%86%85%E5%AE%B9%E5%8F%98%E5%8C%96%E7%9B%91%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/485944/JIRA%E5%86%85%E5%AE%B9%E5%8F%98%E5%8C%96%E7%9B%91%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==
if (window != window.top) {
    return;
}
(function() {
    'use strict';


    let TIME_INTERVAL = 10000;
    let KEY_LAST_REQUEST_TIME = "LAST_REQUEST_TIME";
    let KEY_LAST_REQUEST_MD5 = "KEY_LAST_REQUEST_MD5";

    // 每分钟执行一次
    setInterval(function() {
        // 获取上次执行时间ms
        var lastRequestTime = parseInt(GM_getValue(KEY_LAST_REQUEST_TIME, 0));
        console.log("lastRequestTime", lastRequestTime)
        var currentTime = new Date().getTime();
        // 执行节流，每次request的间隔时间需要大于10000ms
        if(currentTime - lastRequestTime> TIME_INTERVAL){
            // 记录本次执行时间ms
            GM_setValue(KEY_LAST_REQUEST_TIME, currentTime);
        }else{
            return;
        }
        request();
    }, TIME_INTERVAL);

    function request(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://jira.ecarxgroup.com/sr/jira.issueviews:searchrequest-rss/temp/SearchRequest.xml?jqlQuery=assignee+%3D+currentUser%28%29+AND+resolution+%3D+Unresolved+order+by+updated+DESC&tempMax=80000",
            onload: function(response) {
                // console.log("response", response)
                // console.log("response.responseText", response.responseText)
                var lastContent = GM_getValue(KEY_LAST_REQUEST_MD5)
                // 计算MD5哈希值
                var currentContent = CryptoJS.MD5(removeFirstThreeLines(response.responseText)).toString();
                console.log("lastContent", lastContent,"currentContent", currentContent)
                if (lastContent && currentContent !== previousContent) {
                    sendBrowserNotification("JIRA CHANGE");
                }
                GM_setValue(KEY_LAST_REQUEST_MD5, currentContent)
            }
        });
    }

    // 忽略前三行
    function removeFirstThreeLines(str) {
        var lines = str.split('\n');
        if (lines.length >= 3) {
            lines.splice(0, 3);
        }
        return lines.join('\n');
    }

    // 发送通知
    function sendBrowserNotification(message) {
        var notification
        if (Notification.permission === "granted") {
            notification = new Notification(message, {
                body: message
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function(permission) {
                if (permission === "granted") {
                    notification = new Notification(message, {
                        body: message
                    });
                }
            });
        }
        if(notification){
            // 监听通知点击事件
            notification.addEventListener('click', function() {
                // 打开指定的网页
                window.open('https://jira.ecarxgroup.com/issues/?filter=-1');
                // 关闭通知
                notification.close();
            });
        }
    }
})();
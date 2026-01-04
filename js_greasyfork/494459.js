// ==UserScript==
// @name 油猴脚本示例
// @namespace https://example.com
// @version 1.1
// @description 这是一个油猴脚本示例，演示如何使用GM_notification和GM_setClipboard
// @author 王攀
// @match https://www.baidu.com/*
// @grant GM_notification
// @grant GM_setClipboard
// @grant GM_download
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_log
// @license MIT
// @run-at document-end
// @require http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/494459/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%A4%BA%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/494459/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%A4%BA%E4%BE%8B.meta.js
// ==/UserScript==

(function($) {
    $(document).ready(function() {
        alert("你好彭于晏！");
    });
})(jQuery);

// 用于跟踪是否有通知正在显示
var isNotificationShowing = false;

// 获取当前日期
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = '北京时间：' + date+' '+time;

// 定义图片URL
var imageURL = 'https://q5.itc.cn/images01/20240330/40bd38943ece48019e9e44c147221056.jpeg';

GM_notification({
    text: dateTime,
    title: '你好彭于晏',
    image: 'https://img1.baidu.com/it/u=852527378,739232243&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    highlight: true,
    url: 'https://example.com/',
    onclick: (event) => {
        // The userscript is still running, so don't open example.com
        event.preventDefault();
        // Display an alert message instead
        alert('I was clicked!')
    },
    ondone: function() {
        // 下载图片
        GM_download(imageURL, 'downloadedImage.jpeg');
        // 在新的标签页中打开图片
        GM_openInTab(imageURL);
    }
});

// 使用GM_setClipboard将指定的文本复制到剪贴板
GM_setClipboard('这是一段要复制的文本');

// 注册一个新的菜单命令
let sayHelloCommandId = GM_registerMenuCommand("Say hello", function() {
    alert("Hello, world!");
});

// 注册一个新的命令来移除"Say hello"命令
let removeSayHelloCommandId = GM_registerMenuCommand("Bye hello", function() {
    GM_unregisterMenuCommand(sayHelloCommandId);
    GM_log("已移除 'Say hello' 命令");  // 打印消息
    // 可选：移除自身
    GM_unregisterMenuCommand(removeSayHelloCommandId);
    GM_log("已移除 'Bye hello' 命令");  // 打印消息
});

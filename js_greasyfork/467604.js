// ==UserScript==
// @name         河北远程学习刷课
// @namespace    your-namespace
// @version      1.1
// @description  用一个单独的浏览器来刷课，因为脚本会影响其他网页，在网页有alert时自动点击确定按钮，并定时将video滚动到开始位置
// @author       ehgui
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467604/%E6%B2%B3%E5%8C%97%E8%BF%9C%E7%A8%8B%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/467604/%E6%B2%B3%E5%8C%97%E8%BF%9C%E7%A8%8B%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

// 重写window.alert方法
window.alert = function(message) {
    console.log("Alert message: " + message);
    // 自动点击确定按钮
    return true;
};

// 创建 MutationObserver 监听视频元素的添加
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var addedNodes = mutation.addedNodes;
        for (var i = 0; i < addedNodes.length; i++) {
            var addedNode = addedNodes[i];
            if (addedNode.tagName === "VIDEO") {
                handleVideoElement(addedNode);
            }
        }
    });
});

// 监听文档变化
observer.observe(document, { childList: true, subtree: true });

// 定时器每1分钟将滚动条滚动到开始位置
setInterval(function() {
    var videoElements = document.getElementsByTagName("video");
    for (var i = 0; i < videoElements.length; i++) {
        var video = videoElements[i];
        video.currentTime = 0; // 设置视频时间为开始位置
        video.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 滚动到视频开始位置
    }
}, 1*60*1000);

// 处理视频元素的滚动
function handleVideoElement(video) {
    video.currentTime = 0; // 设置视频时间为开始位置
    video.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 滚动到视频开始位置
}

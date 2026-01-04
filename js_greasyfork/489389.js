// ==UserScript==
// @name        🌟长期可用🌟Mosoteach云班课看视频强制拉进度条
// @namespace   http://tampermonkey.net/
// @match       https://www.mosoteach.cn/web/index.php?c=res*
// @grant       none
// @version     1.0
// @license      MIT
// @author      大宇同学
// @description 云班课打开视频后会发现蓝色视频进度条在不断往终点冲，然后你鼠标直接点几下进度条的终点就OK了
// @icon         https://cdn.jsdelivr.net/npm/davan-cdn@1.0.5/img/home.png
// @downloadURL https://update.greasyfork.org/scripts/489389/%F0%9F%8C%9F%E9%95%BF%E6%9C%9F%E5%8F%AF%E7%94%A8%F0%9F%8C%9FMosoteach%E4%BA%91%E7%8F%AD%E8%AF%BE%E7%9C%8B%E8%A7%86%E9%A2%91%E5%BC%BA%E5%88%B6%E6%8B%89%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/489389/%F0%9F%8C%9F%E9%95%BF%E6%9C%9F%E5%8F%AF%E7%94%A8%F0%9F%8C%9FMosoteach%E4%BA%91%E7%8F%AD%E8%AF%BE%E7%9C%8B%E8%A7%86%E9%A2%91%E5%BC%BA%E5%88%B6%E6%8B%89%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==
// 循环检测视频进度条元素的出现
// 定义函数修改视频进度条宽度为100%
function modifyProgressBar() {
    var progressBar = document.querySelector('.video-duration .video-current-time');

    // 如果找到视频进度条元素，将其宽度设置为100%
    if (progressBar) {
        progressBar.style.width = '100%';
        console.log('视频进度条宽度已修改为100%');
    }
}

// 定义函数循环检测并修改
function continuousModification() {
    // 循环检测并修改
    setInterval(modifyProgressBar, 1000); // 每隔1秒执行一次修改
}

// 开始循环检测并修改
continuousModification();

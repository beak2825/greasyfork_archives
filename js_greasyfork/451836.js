// ==UserScript==
// @name         沈阳医学会继续教育v20240913
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  本插件适用于沈阳医学会（好医生）继续教育平台，可以直接跳过视频。安装插件后，请刷新窗口，才能激活脚本。2024年9月13日更新：进入学习页面后，请立即点击视频启动播放，等待2秒钟后自动跳过视频，进入考试页面。
// @author       如花024
// @match       https://syyxh.haoyisheng.com/#/course*
 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451836/%E6%B2%88%E9%98%B3%E5%8C%BB%E5%AD%A6%E4%BC%9A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2v20240913.user.js
// @updateURL https://update.greasyfork.org/scripts/451836/%E6%B2%88%E9%98%B3%E5%8C%BB%E5%AD%A6%E4%BC%9A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2v20240913.meta.js
// ==/UserScript==
 

function skip() {
    let video = document.getElementsByTagName('video')
    for (let i=0; i<video.length; i=i+1) {
        video[i].currentTime = video[i].duration
        video[i].currentTime = video[i].duration
        video[i].currentTime = video[i].duration
        video[i].currentTime = video[i].duration
        video[i].currentTime = video[i].duration
        video[i].currentTime = video[i].duration
        video[i].currentTime = video[i].duration
        video[i].currentTime = video[i].duration
        video[i].currentTime = video[i].duration
    }
}
setInterval(skip,2000)



/* 临时屏蔽以下代码

function skip() {
  let video = document.getElementsByTagName('video');
  for (let i = 0; i < video.length; i++) {
    video[i].currentTime = video[i].duration;
  }
}

setInterval(skip, 1000);

*/
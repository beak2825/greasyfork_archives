// ==UserScript==
// @name         党旗飘飘刷课脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  党旗飘飘刷课脚本：自动播放、切换，秒过视频
// @author       Wenzhao299
// @match        http://wsdx.hfut.edu.cn/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516251/%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/516251/%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var num = 0;
setInterval(function (){
    // 获取所有的 li 项
    const videoItems = document.querySelectorAll('.video_lists ul li');
    // 找到当前项的索引，假设当前项有类名 'video_red1' 表示当前项
    let currentIndex = Array.from(videoItems).findIndex(item => item.classList.contains('video_red1'));
    console.log(num);
    var btn1 = document.querySelector('.public_submit');
    var btn2 = document.querySelector('.plyr__sr-only');
    // 点击 public_submit “我知道了”按钮
    if(btn1){
        btn1.click();
        console.log("点击了 public_submit 按钮");
        num = num + 1;
        console.log(num);
    }
    // 点击 plyr__sr-only 继续播放按钮
    if(btn2){
        btn2.click();
        console.log("点击了 plyr__sr-only 按钮");
    }
    // 直接将当前视频跳至最后一秒（刷课用）
    var video = document.getElementsByTagName("video")[0];
    video.currentTime = video.duration-1;
    // 若 public_submit 按钮点击两次（开始一次，结束一次），即可跳至下一小节
    if(num == 2){
        // 检查是否有下一项
        if (currentIndex !== -1 && currentIndex < videoItems.length - 1) {
            // 更新当前项的样式，移除旧的样式类
            videoItems[currentIndex].classList.remove('video_red1');
            // 跳转到下一项
            currentIndex++;
            const nextLink = videoItems[currentIndex].querySelector('a').href;
            // 跳转到下一项的视频页面
            window.location.href = nextLink;
        } else {
            console.log("已播放完所有视频");
        }
    }
  }, 3000);
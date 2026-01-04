// ==UserScript==
// @name         Bilibili Auto Quality
// @namespace    https://greasyfork.org/zh-CN/users/1258116-yanchong-xiao
// @version      1.0
// @description  自动选择最高清晰度播放Bilibili视频
// @author       Microsoft Copilot
// @match        https://www.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486754/Bilibili%20Auto%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/486754/Bilibili%20Auto%20Quality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待视频加载完成
    function waitForVideo() {
        var video = document.querySelector('video');
        console.log(video);
        if (video) {
            // 监听视频播放事件
//            video.addEventListener('play', function() {
                // 获取清晰度列表
                var qualityList = document.querySelectorAll('.bpx-player-ctrl-quality-menu-item');
                console.log(qualityList);
                if (qualityList.length > 0) {
                    // 根据 cookie 中的 CURRENT_QUALITY 的值来选择相应的清晰度
                    var currentQuality = getCookie("CURRENT_QUALITY"); // 获取 cookie 中的 CURRENT_QUALITY 的值
                    var targetQuality = [...qualityList].find(item => item.dataset.value == currentQuality); // 在清晰度列表中找到 data-value 与 CURRENT_QUALITY 相等的项
                    if (targetQuality) {
                        targetQuality.click(); // 点击该项
                    } else {
                        qualityList[0].click(); // 如果没有找到，就选择最高清晰度
                    }
                }else{
                    setTimeout(waitForVideo, 1000);
                }
//            });
        } else {
            // 如果视频还没加载，等待一秒后重试
            setTimeout(waitForVideo, 1000);
        }
    }

// 一个简单的函数，用于获取 cookie 中指定名称的值
// 参考 [JavaScript Cookies - W3Schools] 和 [javascript - Get cookie by name - Stack Overflow]
function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); // 解码 cookie 字符串
    const cArr = cDecoded.split('; '); // 用分号和空格分割 cookie
    let res;
    cArr.forEach(val => {
      if (val.indexOf(name) === 0) res = val.substring(name.length); // 如果找到指定名称的 cookie，就返回它的值
    });
    return res;
  }


    // 调用函数
    waitForVideo();
})();

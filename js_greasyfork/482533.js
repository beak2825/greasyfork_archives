// ==UserScript==
// @name         文理仓辉实训刷课脚本
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  仓辉实训自动脚本
// @author       LayFz
// @match        *://zxshixun.cdcas.com/*
// @grant        none
// @license      MIT
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/482533/%E6%96%87%E7%90%86%E4%BB%93%E8%BE%89%E5%AE%9E%E8%AE%AD%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482533/%E6%96%87%E7%90%86%E4%BB%93%E8%BE%89%E5%AE%9E%E8%AE%AD%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
        // 当前位置
        var local = 0;
        var playNext = function () {
        // 结束标志位
        let end_flag = false;
        // 获取所有元素
        var elements = document.querySelectorAll('a[target="_self"]');
        // 遍历元素
        // key 为下标
        for (var key in elements) {
            if (elements.hasOwnProperty(key)) {
                var element = elements[key];
                // 检查是否包含 "item flex-row active" 类
                if (element.classList.contains("on")) {
                    local = parseInt(key);
                    if (elements.length == key + 1) {
                        end_flag = true;
                    }
                    break; // 如果只需要找到第一个，可以直接退出循环
                }
            }
        }
        if (end_flag) {
            alert("Easy Easy，区区网课也敢班门弄斧！");
        } else {
            setTimeout(function () {
                elements[local+1].click();
            }, 3000); // 增加间隔时间
        }
    };

    $(document).ready(function () {
        var timer = setInterval(function () {
            var verifyTag = document.querySelectorAll('.layui-layer')
            if(verifyTag.length ==1 ){
                return;
            }else{
                var video = document.getElementsByTagName("video")
            if (video.length > 0 && video[0].paused) {
                video[0].play();
            }
            if ($('video').length && $('video')[0].readyState == 4) {
                if ($('video')[0].readyState == 4) {
                    if ($('video')[0].paused) {
                        console.log("paused");
                        $('video')[0].play();
                    }
                    $('video')[0].onended = function () {
                        playNext();
                        setTimeout(function () {

                         }, 2000); // 增加间隔时间
                    };
                    $('video')[0].muted = true;
                    $('video')[0].playbackRate = 1.0;
                    $('video')[0].volume = 0;
                }
            }
            }
        }, 1000);
    });
})();

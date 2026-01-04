// ==UserScript==
// @name         公需课 - 优化版
// @namespace    挂机就好了
// @version      创世0.12
// @description  挂机就好了 - 自动学习和刷新功能优化版，支持多课程处理，并正确区分课程与视频进度，解决了因网速问题导致的加载失败问题，并增加了页面刷新倒计时提示（格式化为*分*秒），且不受非活动标签影响。
// @author       hahsuu
// @match        *://px.lshrss.cn/PersonalTrain/Index
// @grant        GM_addStyle
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/526256/%E5%85%AC%E9%9C%80%E8%AF%BE%20-%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526256/%E5%85%AC%E9%9C%80%E8%AF%BE%20-%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加倒计时提示元素到页面
    function addCountdownElement() {
        var countdownDiv = $('<div id="custom-countdown" style="position: fixed; top: 10px; right: 10px; background-color: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px;">页面将在 <span id="countdown-value"></span> 后刷新</div>');
        $('body').append(countdownDiv);
    }

    function waitForElements(selector, callback) {
        const checkExist = setInterval(() => {
            if ($(selector).length) {
                clearInterval(checkExist);
                callback();
            }
        }, 1000); // 每秒检查一次
    }

    waitForElements('.item', function() {
        console.log("课程列表已加载，准备开始自动学习");
        study();
        addCountdownElement(); // 添加倒计时提示元素
        startCountdown(); // 启动倒计时
    });

    function study() {
        var shouldBreak = false;

        $('.item').each(function(index, element) {
            if (shouldBreak) return;

            var courseTitle = $(this).find('.row .column-first').attr('title');
            var courseProgress = parseFloat($(this).find('.row .column-second .yellow').text().replace("%", ""));
            var videoItems = $(this).find('.sub .sub-row');

            if (courseProgress < 100) {
                console.log(courseTitle + " 未完成，即将开始学习");

                // 确保视频列表可见
                $(this).find('.sub').css('display', 'block');

                for (var i = 0; i < videoItems.length; i++) {
                    var videoProgress = parseFloat($(videoItems[i]).find('.column-second .yellow').text().replace("%", ""));
                    if (videoProgress < 100) {
                        // 查找符合条件的img标签
                        var img = $(videoItems[i]).find('img[title="点播"]:visible').first();

                        if (img.length) {
                            // 触发图片的点击事件
                            img.trigger('click');
                            console.log("已经开始自动播放啦：" + courseTitle + " 第" + (i + 1) + "节课");
                        } else {
                            console.error("找不到对应的播放图片！");
                        }
                        shouldBreak = true; // 设置标志位以跳出循环
                        break;
                    }
                }
            } else {
                console.log(courseTitle + " 已完成");
            }
        });
    }

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    function startCountdown() {
        var refreshTime = parseInt(sessionStorage.oixmRefreshTime || 900);
        var endTime = Date.now() + refreshTime * 1000;
        var countdownElement = $('#countdown-value');

        var countdownInterval = setInterval(function() {
            var remainingTime = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
            if (remainingTime > 0) {
                countdownElement.text(formatTime(remainingTime));
            } else {
                clearInterval(countdownInterval);
                location.reload();
            }
        }, 1000);
    }

})();
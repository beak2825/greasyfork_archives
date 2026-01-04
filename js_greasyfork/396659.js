// ==UserScript==
// @name         注册测绘师继续教育平台跳过验证码
// @namespace    http://www.52lovehome.com/
// @version      0.6
// @description  注册测绘师继续教育平台跳过验证码,后台不暂停继续播放
// @author       G魂帅X
// @match        http://rsedu.ch.mnr.gov.cn//index/onlineCourseUser/play?*
// @match        http://rsedu.ch.mnr.gov.cn//index/play?*
// @match        https://rsedu.ch.mnr.gov.cn//index/onlineCourseUser/play?*
// @match        https://rsedu.ch.mnr.gov.cn//index/play?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/396659/%E6%B3%A8%E5%86%8C%E6%B5%8B%E7%BB%98%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%B7%B3%E8%BF%87%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/396659/%E6%B3%A8%E5%86%8C%E6%B5%8B%E7%BB%98%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%B7%B3%E8%BF%87%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function($, window, document, undefined) {
    'use strict';

    // Your code here...
    var $logView = $(`<div></div>`).appendTo($('body')).css({
        'position': 'fixed',
        'left': '0',
        'bottom': '0',
        'width': '300px',
        'height': '100px',
        'padding': '20px',
        'border-radius': '0 20px 0 0',
        'background': 'linear-gradient(45deg, #5d6aff, #2effc5)',
        'z-index': '999',
        'overflow': 'auto'
    });
    var $logInner = $(`<div></div>`).appendTo($logView);

    var log = (info) => {
        $(`<p>${info}</p>`).appendTo($logInner).css({
            'font-size': '17px',
            'color': '#FFF',
            'padding-bottom': '10px'
        });
        $logView.scrollTop($logInner.outerHeight(true) + 40);
    };

    var dataLoaded = false;

    // 出现验证码直接跳入success继续播放
    $.fn.pointsVerify = function(options, callbacks) {
        log('验证码已跳过！！！');
        options.success();
    }

    window.onblur = () => {
        // 播放继续
        if (player && dataLoaded) {
            log('播放继续！！！');
            player.videoPlay();
        }
    }

    // 监听当前页面是否在前台
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
            //处于当前页面
            // do something
            if (!document.focus && player && dataLoaded) {
                log('播放继续！！！');
                player.videoPlay();
            }
        } else {
            // 播放继续
            if (player && dataLoaded) {
                log('播放继续！！！');
                player.videoPlay();
            }
        }
    });

    var queryParams = new (function (sSearch) {
        if (sSearch.length > 1) {
            for (var aItKey, nKeyId = 0, aCouples = sSearch.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
                aItKey = aCouples[nKeyId].split("=");
                this[decodeURIComponent(aItKey[0])] = aItKey.length > 1 ? decodeURIComponent(aItKey[1]) : "";
            }
        }
    })(window.location.search);

    var goCourseClass = () => {
        var origin = window.location.origin;
        var pathname = window.location.pathname;
        var urlPath = '';
        if (pathname.indexOf('onlineCourseUser') > -1) {
            urlPath = `${origin}//index/onlineCourseUser/class`
        } else {
            urlPath = `${origin}//index/class`
        }
        var { courseId, orderId } = queryParams;
        urlPath = `${urlPath}?courseId=${courseId}&orderId=${orderId}`;

        window.location.assign(urlPath);
    }

    var playerUnlockDrag = () => {
        player.changeConfig('config', 'timeScheduleAdjust', '1');
        log('进度条拖动已解锁！！！');
    }

    var playerChangeSpeed = () => {
        player.changePlaybackRate(5);
        log('倍速已设置！！！');
    }

    var timeStart = false;
    var enableJump = false;
    var stopCount = 0;

    enableJump = window.localStorage.getItem('enable_jump') === 'true'

    var playerStartJump = (endTime) => {
        player.addListener('time', (time) => {
            time = time || 0
            if (time > 5 && !timeStart && enableJump) {
                timeStart = true;
                log('尝试跳转到结尾！！！');
                player.videoSeek(parseInt(endTime) - 10);
            }
        });
        player.videoSeek(5);
    }

    var playerJumpFinish = () => {
        var metaData = player.getMetaDate();
        var fullTime = metaData.duration;
        log(`总时长：${fullTime}`)
        playerStartJump(fullTime);
    };

    var playerOnload = () => {
        player.addListener('loadedmetadata', () => {
            dataLoaded = true;
            log('播放器数据已加载完成！！！');
            playerUnlockDrag();
            playerChangeSpeed();
            playerJumpFinish();
        });
    };

    var playerOnEnd = () => {
        player.addListener('ended', () => {
            layer.ready(function(){
                layer.config({
                    success: function(layero, index){
                        setTimeout(function(){
                            var content = layero.find('.layui-layer-content').html();
                            if (content == '学习进度已更新!') {
                                layero.find('a.layui-layer-btn0').trigger('click');
                                log('已播放完成，即将开始下一个！！！');
                                goCourseClass();
                            }
                        }, 1500);
                    }
                });
            });
        });
    }

    var pInterval = setInterval(() => {
        setTimeout(() => {
            if (player) {
                clearInterval(pInterval);
                log('播放器已加载好！！！');
                playerOnload();
                playerOnEnd();
            }
        }, 0);
    }, 200);
})(jQuery, window, document);
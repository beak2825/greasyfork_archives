// ==UserScript==
// @name         voscreen shortcut key
// @namespace    https://www.voscreen.com/
// @version      0.1
// @description  voscreen按钮绑定脚本
// @author       FengSir
// @match        https://*.voscreen.com/*
// @icon         https://www.voscreen.com/favicon.ico
// @require      https://unpkg.com/jquery@3.4.1/dist/jquery.slim.min.js
// @require      https://unpkg.com/toastify-js@1.11.2/src/toastify.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442486/voscreen%20shortcut%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/442486/voscreen%20shortcut%20key.meta.js
// ==/UserScript==
/* 注释
// 引入jQuery/引入css: https://zhuanlan.zhihu.com/p/144035698
// 引入toastify: https://github.com/apvarun/toastify-js/blob/master/README.md
// 引入css: https://zhuanlan.zhihu.com/p/436759145
*/

(function() {
    'use strict';
    console.log("voscreen按钮绑定脚本 is running");

    // 引入toastify的css
    let link= document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.href= "https://unpkg.com/toastify-js@1.11.2/src/toastify.css";
    document.documentElement.appendChild(link);

    // 阻止空格向下滚动页面 - https://www.cnblogs.com/hjqbit/p/7244406.html
    $('body').keydown(function(event) {
        var e = window.event || event;
        if(e.preventDefault){
            e.preventDefault();
        }else{
            window.event.returnValue = false;
        }
    })

    // toast对象
    let toast_success = function (pos) {
        return {
            text: pos + "字幕复制成功",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }
    }
    let toast_fail = function (pos) {
        return {
            text: pos + "字幕复制失败",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #E6A23C, #96c93d)",
            }
        }
    }

    // 事件 https://www.cnblogs.com/lhblogs/p/9364123.html
    // 防连击 https://www.jianshu.com/p/a0be7d2b4fd9
    let left_click_time = new Date().getTime()
    let right_click_time = new Date().getTime()
    let intervals = 2000
    $('body').keyup(function(event) {
        switch(event.keyCode) {
            case 13: // 回车 - 下一个
                if ($('.c-player-next.o-player__next').length == 1) {
                    $('.c-player-next.o-player__next')[0].click()
                }
                break
            case 32: // 空格 - 播放/暂停
                $('.o-player__video').click()
                break
            case 38: // 上 - 进入/退出全屏
                $('.c-player-mode-switch__button').click()
                break
            case 37: // 左 - 左边按钮
                if (new Date().getTime() - left_click_time < intervals) break
                if ($('.c-player-subtitle-question.o-player__subtitle-question').length == 2) {
                    $('.c-player-subtitle-question.o-player__subtitle-question')[0].click()
                } else if ($('.c-player-answer.o-player__answer').length == 2) {
                    $('.c-player-answer.o-player__answer')[0].click()
                }
                left_click_time = new Date().getTime()
                break
            case 39: // 右 - 右边按钮
                if (new Date().getTime() - right_click_time < intervals) break
                if ($('.c-player-subtitle-question.o-player__subtitle-question').length == 2) {
                    $('.c-player-subtitle-question.o-player__subtitle-question')[1].click()
                } else if ($('.c-player-answer.o-player__answer').length == 2) {
                    $('.c-player-answer.o-player__answer')[1].click()
                }
                right_click_time = new Date().getTime()
                break
            case 40: // 下 - 播放/暂停
                $('.o-player__video').click()
                break
            // 复制到粘贴板: https://stackoverflow.com/a/67804283
            // https://stackoverflow.com/a/61216014
            case 49: case 97: // 1 - 复制左字幕
                if ($('.c-player-answer.o-player__answer .u-text-center').length != 2) break
                var p = navigator.clipboard.writeText($('.c-player-answer.o-player__answer .u-text-center')[0].innerText)
                p.then(() => Toastify(toast_success('左')).showToast(), () => Toastify(toast_fail('左')).showToast())
                break
            case 50: case 98: // 2 - 复制中间字幕
                if ($('.c-player-subtitle.o-player__subtitle').length != 1) break
                p = navigator.clipboard.writeText($('.c-player-subtitle.o-player__subtitle')[0].innerText)
                p.then(() => Toastify(toast_success('中间')).showToast(), () => Toastify(toast_fail('中间')).showToast())
                break
            case 51: case 99: // 3 - 复制右字幕
                if ($('.c-player-answer.o-player__answer .u-text-center').length != 2) break
                p = navigator.clipboard.writeText($('.c-player-answer.o-player__answer .u-text-center')[1].innerText)
                p.then(() => Toastify(toast_success('右')).showToast(), () => Toastify(toast_fail('右')).showToast())
                break
        }
    })
})();
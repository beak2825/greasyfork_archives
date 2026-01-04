// ==UserScript==
// @name         去除B站播放视频时的各种窗口和非大会员用户弹出的大会员窗口和看番的时候的窗口
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  去掉b站播放时关注、三连、投票弹窗和非大会员用户弹出的大会员窗口
// @require       http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @author       奎&OYX
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427629/%E5%8E%BB%E9%99%A4B%E7%AB%99%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E6%97%B6%E7%9A%84%E5%90%84%E7%A7%8D%E7%AA%97%E5%8F%A3%E5%92%8C%E9%9D%9E%E5%A4%A7%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7%E5%BC%B9%E5%87%BA%E7%9A%84%E5%A4%A7%E4%BC%9A%E5%91%98%E7%AA%97%E5%8F%A3%E5%92%8C%E7%9C%8B%E7%95%AA%E7%9A%84%E6%97%B6%E5%80%99%E7%9A%84%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/427629/%E5%8E%BB%E9%99%A4B%E7%AB%99%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E6%97%B6%E7%9A%84%E5%90%84%E7%A7%8D%E7%AA%97%E5%8F%A3%E5%92%8C%E9%9D%9E%E5%A4%A7%E4%BC%9A%E5%91%98%E7%94%A8%E6%88%B7%E5%BC%B9%E5%87%BA%E7%9A%84%E5%A4%A7%E4%BC%9A%E5%91%98%E7%AA%97%E5%8F%A3%E5%92%8C%E7%9C%8B%E7%95%AA%E7%9A%84%E6%97%B6%E5%80%99%E7%9A%84%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

setInterval(function () {
            let pop = document.querySelector('.bilibili-player-popup-inner'),
                pop2 = document.querySelector('.bilibili-player-link');
            if (pop != null) {
                pop.remove();
            }
            if(pop2 != null) {
            pop2.remove();
            }
        }, 100);

        let p_ = setInterval(function () {
            let n = document.querySelector('.bili-dialog-m'),
                play_ = document.querySelector('.bilibili-player-video'),
                bangumi_ = document.querySelector('.popup-1080p-wrapper'),
                nowTime_ = document.querySelector('.bilibili-player-video-time-now').textContent;
            if (n != null) {
                n.click();
                if (nowTime_ != '00:00') {
                    play_.click();
                }
                clearInterval(p_);
            }
            if (bangumi_ != null) {
                bangumi_.remove();
                if (nowTime_ != '00:00') {
                    play_.click();
                }
                clearInterval(p_);
            }
        },100);
// ==UserScript==
// @name               B站_播放器自动化
// @name:zh-CN         B站_播放器自动化
// @name:en-US         BILI_Player Automation
// @description        播放时自动点击网页全屏、播放完成后自动退出全屏。
// @version            1.0.8
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @include            /www\.bilibili\.com\/(video|bangumi/play|festival)\/*/
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/458613/B%E7%AB%99_%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/458613/B%E7%AB%99_%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

'use strict';

// 定义元素快捷选择器($(元素定位符))、元素存在检测($$(元素定位符))和切换网页全屏(ToggleFull())函数
let $ = ele => document.querySelector(ele);
function $$(ele) {
    return new Promise(resolve => {
        if ($(ele)) {
            return resolve($(ele));
        }
        const observer = new MutationObserver(mutations => {
            if ($(ele)) {
                resolve($(ele));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
function ToggleFull() {
    // 遍历数组、如果页面路径匹配，就点击对应元素；一起看页面无法获取播放器状态
    [
        ["^/video/(av\d+|BV1*)$", ".bpx-player-ctrl-web"],
        ["^/bangumi/play/*$", ".squirtle-video-pagefullscreen"],
        ["^/festival/*$", ".bpx-player-ctrl-web"],
    ].forEach(data => { (RegExp(data[0].regexp).test(location.pathname)) ? $$(data[1]).then(ele => { ele.click() }) : '' ; })
}

// 等待元素存在，防止出版音像节目页面运行错误
$$('video').then(() => {
    // 监听视频播放
    $('video').addEventListener("play", () => {
        // 如果非全屏
        if(!/web|full/.test($('.bpx-player-container').getAttribute('data-screen'))) {
            // 点击网页全屏按钮
            ToggleFull();
        }
    });
    // 监听视频暂停
    $('video').addEventListener("pause", vid => {
        // 防止进度获取异常，再次定义视频参数
        vid = $('video');
        // 如果全屏状态且播放完成
        if(/web|full/.test($('.bpx-player-container').getAttribute('data-screen')) && parseInt(vid.currentTime) === parseInt(vid.duration)) {
            // 点击网页全屏按钮
            ToggleFull();
        }
    });
});
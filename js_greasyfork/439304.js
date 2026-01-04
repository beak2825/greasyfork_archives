// ==UserScript==
// @name         核工业大学niunep网课视频不暂停
// @namespace
// @version      0.15
// @description  核工业大学视频网课学习时若不操作，隔一段时间会有弹出提示；该脚本模拟鼠标点击关闭提示，确保网课视频能继续播放。
// @author       zrcaeiou
// @match        *.niunep.com/*
// @match        *.ecbead.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-idle
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/439304/%E6%A0%B8%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6niunep%E7%BD%91%E8%AF%BE%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/439304/%E6%A0%B8%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6niunep%E7%BD%91%E8%AF%BE%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取设置值，默认情况下启用自动播放，禁用自动禁音
    const autoPlay = GM_getValue('autoPlay', true);
    const autoMute = GM_getValue('autoMute', false);
    const autoSpeedup = GM_getValue('autoSpeedup', true);

    // 注册菜单命令
    GM_registerMenuCommand(
        `${autoPlay ? '🟢' : '🔴'} 自动播放 (${autoPlay ? '已启用' : '已禁用'})`,
        toggleAutoPlay
    );

    GM_registerMenuCommand(
        `${autoMute ? '🟢' : '🔴'} 自动禁音 (${autoMute ? '已启用' : '已禁用'})`,
        toggleAutoMute
    );
    GM_registerMenuCommand(
        `${autoSpeedup ? '🟢' : '🔴'} 自动加速 (${autoSpeedup ? '已启用' : '已禁用'})`,
        toggleAutoSpeedup
    );

    // 切换自动播放功能
    function toggleAutoPlay() {
        const newValue = !GM_getValue('autoPlay', true);
        GM_setValue('autoPlay', newValue);
        alert(`自动播放功能已${newValue ? '启用' : '禁用'}，刷新页面后生效`);
        location.reload();
    }

    // 切换自动禁音功能
    function toggleAutoMute() {
        const newValue = !GM_getValue('autoMute', false);
        GM_setValue('autoMute', newValue);
        alert(`自动禁音功能已${newValue ? '启用' : '禁用'}，刷新页面后生效`);
        location.reload();
    }
    //切换自动加速功能
    function toggleAutoSpeedup() {
        const newValue = !GM_getValue('autoSpeedup', true);
        GM_setValue('autoSpeedup', newValue);
        alert(`自动加速功能已${newValue ? '启用' : '禁用'}，刷新页面后生效`);
        location.reload();
    }

    var timer_wk = setInterval(function() {
        const videos = document.getElementsByTagName("video");

        if (videos.length > 0) {
            const video = videos[0];

            // 根据设置控制自动播放
            if (autoPlay) {
                if (video.paused) {
                    video.play().catch(e => console.log("自动播放失败:", e));
                }
            }

            // 根据设置控制自动禁音
            if (autoMute !== video.muted) {
                video.muted = autoMute;
            }

            // 2倍速播放
            if(autoSpeedup){
            try {
                document.getElementById(video.id).playbackRate = 2;
            } catch (e) {
                video.playbackRate = 2;
            }
            }
        }

        // 判断网页中是否出现了暂停学习的警告，如果有警告就关闭
        const alertWrappers = document.getElementsByClassName("alert-wrapper");
        if (alertWrappers.length > 0 && alertWrappers[0].children.length > 2) {
            alertWrappers[0].children[2].click();
        }
    }, 1000);
})();
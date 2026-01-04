// ==UserScript==
// @name         百度网盘视频网页全屏播放
// @namespace    http://tampermonkey.net/
// @version      2025-02-23
// @description  允许以网页全屏的方式播放百度网盘中的视频
// @author       Frozen
// @license      MIT
// @match        https://pan.baidu.com/pfile/video?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/528008/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/528008/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==



(function() {
    'use strict';
    let isFullScreen = false;
    let fullscreenStyle;

    // 向视频控制栏中添加按钮的函数
    function addPageFullscreenButton() {
        let videoControlBarSetup = document.querySelector('.vp-video__control-bar--setup');

        if (videoControlBarSetup) {
            let pageFullscreenElement = document.createElement('div');
            pageFullscreenElement.className = 'vp-video__control-bar--button-group';
            pageFullscreenElement.innerHTML = `<div class="vp-video__control-bar--button is-text" title="网页全屏">网页全屏</div>`;
            videoControlBarSetup.prepend(pageFullscreenElement);

            function goFullScreen() {
                fullscreenStyle = GM_addStyle(`
                    .vp-personal-home-layout { padding: 0!important; }
                    .vp-personal-video-play { min-width: 100% !important; }
                    .vp-personal-home-layout__video { height: 100%!important; padding: 0!important; }
                    .vp-header { display: none!important; }
                    .vp-personal-video-play { padding-top: 0!important; }
                `);
            }

            function leaveFullScreen() {
                if (fullscreenStyle) {
                    fullscreenStyle.remove();
                }
            }

            // 给按钮添加点击事件，实现网页全屏
            pageFullscreenElement.addEventListener('click', function() {
                if (isFullScreen) {
                    goFullScreen();
                }
                else {
                    leaveFullScreen();
                }
                isFullScreen = !isFullScreen;
            });
        } else {
            console.log('视频控制栏元素未找到');
        }
    }

    // 延时检查控制栏是否已加载
    function checkControlBar() {
        const videoControlBarSetup = document.querySelector('.vp-video__control-bar--setup');
        if (videoControlBarSetup) {
            addPageFullscreenButton();
        } else {
            setTimeout(checkControlBar, 500); // 500ms后再次检查
        }
    }

    // 启动控制栏检查
    checkControlBar();
})();
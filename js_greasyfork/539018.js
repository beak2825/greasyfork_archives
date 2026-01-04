// ==UserScript==
// @name         百度网盘视频网页全屏播放与速度控制
// @namespace    http://tampermonkey.net/
// @version      2025-06-01
// @description  允许以网页全屏的方式播放百度网盘中的视频并控制播放速度
// @author       Obma
// @license      MIT
// @match        https://pan.baidu.com/pfile/video?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/539018/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E4%B8%8E%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/539018/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E4%B8%8E%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let isFullScreen = false;
    let fullscreenStyle;
    let currentSpeed = GM_getValue('videoSpeed', 1.0);
    let speedDropdown = null;

    // 添加样式
    GM_addStyle(`
        .speed-control {
            position: relative;
            margin-right: 10px;
        }

        .speed-dropdown {
            display: none;
            position: absolute;
            bottom: 100%;
            left: 0;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 4px;
            padding: 5px 0;
            min-width: 60px;
            font-size: 14px;
            z-index: 100;
        }

        .speed-dropdown div {
            color: white;
            padding: 5px 10px;
            cursor: pointer;
            text-align: center;
        }

        .speed-dropdown div:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        .vp-video__control-bar--button-group {
            display: flex;
            align-items: center;
        }
    `);

    function addPageFullscreenButton() {
        let videoControlBarSetup = document.querySelector('.vp-video__control-bar--setup');

        if (videoControlBarSetup) {
            // 创建速度控制按钮组
            let speedControlElement = document.createElement('div');
            speedControlElement.className = 'vp-video__control-bar--button-group speed-control';
            speedControlElement.innerHTML = `
                <div class="vp-video__control-bar--button is-text" title="播放速度">${currentSpeed}x</div>
                <div class="speed-dropdown">
                    <div data-speed="0.5">0.5x</div>
                    <div data-speed="1.0">1.0x</div>
                    <div data-speed="1.5">1.5x</div>
                    <div data-speed="1.75">1.75x</div>
                    <div data-speed="2.0">2.0x</div>
                    <div data-speed="2.5">2.5x</div>
                    <div data-speed="2.75">2.75x</div>
                    <div data-speed="3.0">3.0x</div>
                </div>
            `;
            videoControlBarSetup.prepend(speedControlElement);

            // 获取视频元素
            const video = document.querySelector('video');

            // 设置初始播放速度
            if (video) {
                video.playbackRate = currentSpeed;
            }

            // 速度控制按钮点击事件
            const speedBtn = speedControlElement.querySelector('.vp-video__control-bar--button');
            speedDropdown = speedControlElement.querySelector('.speed-dropdown');

            speedBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                speedDropdown.style.display = speedDropdown.style.display === 'block' ? 'none' : 'block';
            });

            // 速度选项点击事件
            speedDropdown.querySelectorAll('div').forEach(item => {
                item.addEventListener('click', function() {
                    const speed = parseFloat(this.getAttribute('data-speed'));
                    currentSpeed = speed;
                    speedBtn.textContent = `${speed}x`;
                    speedDropdown.style.display = 'none';
                    GM_setValue('videoSpeed', speed);

                    if (video) {
                        video.playbackRate = speed;
                    }
                });
            });

            // 点击页面其他地方关闭下拉菜单
            document.addEventListener('click', function() {
                speedDropdown.style.display = 'none';
            });

            // 原来的全屏按钮代码
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
                    .drager_right, .vp-aside {
                        display: none !important;
                    }
                    .drager_left { width: 100% !important; }
                `);
            }

            function leaveFullScreen() {
                if (fullscreenStyle) {
                    fullscreenStyle.remove();
                }
            }

            pageFullscreenElement.addEventListener('click', function() {
                if (isFullScreen) {
                    leaveFullScreen();
                } else {
                    goFullScreen();
                }
                isFullScreen = !isFullScreen;
            });
        } else {
            console.log('视频控制栏元素未找到');
        }
    }

    function checkControlBar() {
        const videoControlBarSetup = document.querySelector('.vp-video__control-bar--setup');
        if (videoControlBarSetup) {
            addPageFullscreenButton();
        } else {
            setTimeout(checkControlBar, 500);
        }
    }

    checkControlBar();
})();

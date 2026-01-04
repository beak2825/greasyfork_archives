// ==UserScript==
// @name         B站视频截图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  对当前页面正在播放的B站或油管视频的当前帧进行截图，并启用浏览器下载功能保存到本地。支持设置圆角大小。
// @author       小张
// @match        https://www.bilibili.com/video/*
// @match        https://www.youtube.com/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483708/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/483708/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isVideoPlaying = true;

    // 引入jQuery
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.4.min.js';
    document.head.appendChild(script);

    script.onload = () => {

        // 创建一个按钮
        function createScreenshotButton() {
            const screenshotButton = $('<button>', {
                text: '截屏 (s)',
                id: 'screenshotButton',
                style: 'position: fixed; top: 10px; left: 10px; z-index: 999999999; padding: 10px; background-color: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer;',
                click: function () {
                    toggleVideoPlayback(false);
                    showSettings();
                }
            });

            $('body').append(screenshotButton);

            // 监听全屏事件，动态调整按钮位置
            document.addEventListener('fullscreenchange', function () {
                if (document.fullscreenElement) {
                    // 全屏状态，调整按钮位置
                    $(document.fullscreenElement).append($('#screenshotButton')); // 将按钮附加到全屏元素中
                    $('#screenshotButton').css({ top: '20px', left: '20px', zIndex: 2147483647 });

                } else {
                    // 非全屏状态，恢复按钮位置
                    $('body').append($('#screenshotButton'));
                    $('#screenshotButton').css({ top: '10px', left: '10px', zIndex: 999999999 });
                }
            });
        }

        // 显示设置界面
        function showSettings() {
            // 移除已存在的设置界面
            $('#screenshotSettings').remove();

            const settingsContainer = $('<div>', {
                id: 'screenshotSettings',
                style: 'position: fixed;display: flex;flex-wrap: wrap;gap: 10px 13px;width: 550px;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: rgb(255, 255, 255);padding: 20px;border: 2px solid rgb(52, 152, 219);z-index: 2147483647;border-radius: 6px;box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 0px 800px;'
            });
            // 监听全屏事件，动态调整按钮位置
            document.addEventListener('fullscreenchange', function () {
                if (document.fullscreenElement) {
                    // 全屏状态，调整按钮位置
                    $(document.fullscreenElement).append($('#screenshotSettings')); // 将按钮附加到全屏元素中
                    $('#screenshotSettings').css({ top: '20px', left: '20px', zIndex: 2147483647 });
                } else {
                    // 非全屏状态，恢复按钮位置
                    $('body').append($('#screenshotSettings'));
                    $('#screenshotSettings').css({ top: '10px', left: '10px', zIndex: 999999999 });
                }
            });
            const radiusSlider = $('<input>', {
                type: 'range',
                min: 0,
                max: 250,
                value: 0,
                style: 'width: calc(90% - 10px);'
            });

            const radiusInput = $('<input>', {
                type: 'number',
                min: 0,
                max: 250,
                value: 0,
                style: 'width: 7%;'
            });

            const previewContainer = $('<div>', {
                style: 'position: relative;display: flex; flex-wrap: wrap; gap: 10px; align-content: space-between;'
            });

            const previewImage = $('<img>', {
                style: 'width: calc(100% - 16px); height: auto; border: 1px solid #3498db; image-rendering: pixelated; padding: 8px;background-image: repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 10px, transparent 10px, transparent 20px);box-shadow: inset 0px 0px 20px 2px #27272759;' // 添加 image-rendering 样式
            });

            const copyButton = $('<button>', {
                id: 'copy',
                text: '复制',
                style: 'width: calc(50% - 5px); padding: 10px; background-color: #3498db; color: #fff; border: none; cursor: pointer; float: left;',
                click: function () {
                    copyImageToClipboard(previewImage[0]);
                }
            });

            const downloadButton = $('<button>', {
                id: 'download',
                text: '下载',
                style: 'width: calc(50% - 5px); padding: 10px; background-color: #3498db; color: #fff; border: none; cursor: pointer; float: left;', // 修改样式
                click: function () {
                    takeScreenshot(parseInt(radiusInput.val()));
                    settingsContainer.remove();
                }
            });

            const closeButton = $('<button>', {
                html: '❌',
                style: 'position: absolute; top: 10px; right: 10px; padding: 5px; color: #e74c3c; border: none; cursor: pointer; background: none;', // 修改样式
                click: function () {
                    toggleVideoPlayback(true); // Resume the video
                    settingsContainer.remove();
                }
            });

            // 截取视频当前帧的截图
            function takeScreenshot(radius) {
                const video = $('video')[0];
                if (video) {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const dataURL = processScreenshot(imageData, radius);
                    previewImage.attr('src', dataURL);
                    saveScreenshot(dataURL, getScreenshotFileName());
                }
            }

            // 复制图片到剪贴板
            function copyImageToClipboard(img) {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth; // 使用 naturalWidth 保持原始分辨率
                canvas.height = img.naturalHeight; // 使用 naturalHeight 保持原始分辨率
                const context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

                canvas.toBlob((blob) => {
                    const item = new ClipboardItem({ "image/png": blob });
                    navigator.clipboard.write([item]).then(
                        function () {
                            // 修改按钮文字和颜色表示复制成功
                            copyButton.text('复制成功');
                            copyButton.css({ 'background-color': '#4CAF50' });
                            // 2秒后恢复初始状态
                            setTimeout(function () {
                                copyButton.text('复制');
                                copyButton.css({ 'background-color': '#3498db' });
                            }, 2000);
                        },
                        function (error) {
                            console.error('复制失败:', error);
                            // 修改按钮文字和颜色表示复制失败
                            copyButton.text('复制失败');
                            copyButton.css({ 'background-color': '#e74c3c' });
                            // 2秒后恢复初始状态
                            setTimeout(function () {
                                copyButton.text('复制');
                                copyButton.css({ 'background-color': '#3498db' });
                            }, 2000);
                        }
                    );
                }, 'image/png');
            }

            // 获取截图文件名
            function getScreenshotFileName() {
                let pageTitle = $('title').text();
                pageTitle = pageTitle.replace('_哔哩哔哩_bilibili', ''); // 去除特定字符串
                pageTitle = pageTitle.replace('- YouTube', ''); // 去除特定字符串
                const currentTime = formatTime(getCurrentTime());
                return `${pageTitle}_${currentTime}.png`;
            }

            // 获取当前视频帧时间
            function getCurrentTime() {
                const video = $('video')[0];
                return video.currentTime;
            }

            // 将时间格式化为mm分ss秒
            function formatTime(time) {
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                return `${String(minutes).padStart(2, '0')}m${String(seconds).padStart(2, '0')}s`;
            }

            // 保存截图到本地
            function saveScreenshot(dataURL, fileName) {
                toggleVideoPlayback(true); // Resume the video
                GM_download({
                    url: dataURL,
                    name: fileName,
                    saveAs: true,
                    onerror: function (error) {
                        console.error('截图保存失败:', error);
                    }
                });
            }

            // 添加圆角等处理
            function processScreenshot(imageData, radius) {
                const { width, height, data } = imageData;
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext('2d');
                context.putImageData(imageData, 0, 0);
                context.globalCompositeOperation = 'destination-over';
                context.fillStyle = '#fff';
                context.fillRect(0, 0, width, height);
                context.globalCompositeOperation = 'source-over';
                context.drawImage(canvas, 0, 0, width, height);
                context.globalCompositeOperation = 'destination-in';
                context.beginPath();
                context.moveTo(radius, 0);
                context.lineTo(width - radius, 0);
                context.quadraticCurveTo(width, 0, width, radius);
                context.lineTo(width, height - radius);
                context.quadraticCurveTo(width, height, width - radius, height);
                context.lineTo(radius, height);
                context.quadraticCurveTo(0, height, 0, height - radius);
                context.lineTo(0, radius);
                context.quadraticCurveTo(0, 0, radius, 0);
                context.closePath();
                context.fill();
                return canvas.toDataURL('image/png');
            }

            // 更新预览图
            function updatePreview(radius) {
                const video = $('video')[0];
                if (video) {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const dataURL = processScreenshot(imageData, radius);
                    previewImage.attr('src', dataURL);
                }
            }

            // 绑定滑块和输入框的事件
            radiusSlider.on('input', function () {
                radiusInput.val($(this).val());
                updatePreview(parseInt($(this).val()));
            });

            radiusInput.on('input', function () {
                radiusSlider.val($(this).val());
                updatePreview(parseInt($(this).val()));
            });

            // 初始化
            updatePreview(parseInt(radiusSlider.val()));

            // 添加到设置界面
            previewContainer.append(previewImage, copyButton, downloadButton); // 放置复制按钮和下载按钮
            settingsContainer.append(
                closeButton,
                $('<label>', { text: '圆角大小', style: 'font-size: 16px; font-weight: bold;width: 100%;' }),
                radiusSlider,
                radiusInput,
                previewContainer, // 使用包含图片和按钮的容器
            );

            $('body').append(settingsContainer);

            // 监听全屏事件，动态调整设置界面位置
            document.addEventListener('fullscreenchange', function () {
                if (document.fullscreenElement) {
                    $(document.fullscreenElement).append($('#screenshotSettings')); // 将设置界面附加到全屏元素中
                    $('#screenshotSettings').css({ zIndex: 2147483647 });
                } else {
                    $('body').append($('#screenshotSettings'));
                    $('#screenshotSettings').css({ zIndex: 999999999 });
                }
            });
        }

        // 切换视频播放状态
        function toggleVideoPlayback(play) {
            const video = $('video')[0];
            if (video) {
                if (play && !isVideoPlaying) {
                    video.play();
                    isVideoPlaying = true;
                } else if (!play && isVideoPlaying) {
                    video.pause();
                    isVideoPlaying = false;
                }
            }
        }

        // 初始化
        createScreenshotButton();

        // 添加一个变量用于追踪设置面板的显示状态
        let settingsPanelVisible = false;

        // 监听键盘事件
        $(document).on('keydown', function (e) {
            const key = e.key.toLowerCase();

            // 判断按下的键是不是"S"
            if (key === 's') {
                // 如果设置面板已经显示，则继续播放视频并隐藏设置面板
                if (settingsPanelVisible) {
                    toggleVideoPlayback(true); // Resume the video
                    $('#screenshotSettings').remove();
                    settingsPanelVisible = false;
                } else {
                    // 否则，暂停视频并显示设置面板
                    toggleVideoPlayback(false); // Pause the video
                    showSettings();
                    showShortcutReminder('已按下截屏键，请选择复制或下载');
                    settingsPanelVisible = true;
                }
            }

            // 判断按下的键是不是"C"，并执行复制操作
            if (key === 'c') {
                const previewImage = $('#copy');
                copyImageToClipboard(previewImage[0]);
            }

            // 判断按下的键是不是"D"，并执行下载操作
            if (key === 'd') {
                const radiusInput = $('#download');
                takeScreenshot(parseInt(radiusInput.val()));
                $('#screenshotSettings').remove();
                settingsPanelVisible = false;
            }
        });


        // 显示快捷键提醒
        function showShortcutReminder(message) {
            // 创建快捷键提醒元素
            const reminderDiv = $('<div>', {
                text: message,
                class: 'shortcut-reminder'  // 添加类名
            });

            // 将快捷键提醒元素添加到 body 中
            $('body').append(reminderDiv);

            // 添加入场动画的类
            reminderDiv.addClass('animate-in');

            // 1秒后添加出场动画的类
            setTimeout(function () {
                reminderDiv.addClass('animate-out');
            }, 1000);

            // 动画完成后移除元素
            reminderDiv.on('animationend', function () {
                reminderDiv.remove();
            });
        }

        // 添加 CSS 样式
        const style = `
    /* CSS 样式表中 */
    .shortcut-reminder {
        position: fixed;
        top: -100px;  /* 初始位置在屏幕上方，负值确保看不到 */
        left: 50%;
        transform: translateX(-50%);
        background-color: #3498db;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        z-index: 999999999;
        opacity: 0;  /* 初始状态透明度为 0 */
        transition: opacity 0.5s ease-in-out, top 0.5s ease-in-out;  /* 过渡效果 */
    }

    .animate-in {
        opacity: 1;  /* 添加该类时透明度为 1，触发过渡效果 */
        top: 10px;  /* 添加该类时位置变为 10px，触发过渡效果 */
    }

    .animate-out {
        opacity: 0;  /* 添加该类时透明度为 0，触发过渡效果 */
        top: -100px;  /* 添加该类时位置变为 -100px，触发过渡效果 */
    }
`;

        // 创建一个 style 标签，并将样式添加到 head 中
        const styleTag = document.createElement('style');
        styleTag.innerHTML = style;
        document.head.appendChild(styleTag);


    };
})();

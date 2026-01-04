// ==UserScript==
// @name         视频号直播无人推送工具
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  自动推送小工具 with frame checking using React and Bootstrap without JSX
// @author       万叶
// @match        https://channels.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498981/%E8%A7%86%E9%A2%91%E5%8F%B7%E7%9B%B4%E6%92%AD%E6%97%A0%E4%BA%BA%E6%8E%A8%E9%80%81%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/498981/%E8%A7%86%E9%A2%91%E5%8F%B7%E7%9B%B4%E6%92%AD%E6%97%A0%E4%BA%BA%E6%8E%A8%E9%80%81%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/* global React, ReactDOM, bootstrap */

(function() {
    'use strict';

    console.log("脚本开始执行"); // 控制台调试信息

    // 引入React和ReactDOM
    const reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react/umd/react.production.min.js';
    const reactDOMScript = document.createElement('script');
    reactDOMScript.src = 'https://unpkg.com/react-dom/umd/react-dom.production.min.js';

    // 引入Bootstrap CSS
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCSS);

    // 引入Bootstrap JavaScript
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(bootstrapScript);

    document.head.appendChild(reactScript);
    document.head.appendChild(reactDOMScript);

    console.log("所有脚本注入完成"); // 控制台调试信息

    // 用于检查 React 和 ReactDOM 是否加载完成的函数
    const isLibLoaded = () => (
        typeof React !== 'undefined' &&
        typeof ReactDOM !== 'undefined' &&
        typeof bootstrap !== 'undefined'
    );

    // 检查库是否加载完成，如果完成则执行回调
    const checkAndExecute = (callback) => {
        if (isLibLoaded()) {
            console.log("库加载完成，执行回调函数"); // 控制台调试信息
            callback();
        } else {
            setTimeout(() => checkAndExecute(callback), 100);
            console.log("等待库加载..."); // 控制台调试信息
        }
    };

    // 等待 React 和 Bootstrap 加载完成
    checkAndExecute(() => {
        // 插入 React 渲染的 DOM 节点
        const appContainer = document.createElement('div');
        appContainer.id = 'root';
        appContainer.style.position = 'fixed';
        appContainer.style.right = '10px';
        appContainer.style.top = '100px';
        appContainer.style.zIndex = '1000';
        document.body.appendChild(appContainer);

        const { useState, useEffect } = React;

        // 定义 React 组件
        const PushTool = () => {
            const [frequency, setFrequency] = useState(60);
            const [isAutoPushEnabled, setIsAutoPushEnabled] = useState(false);

            useEffect(() => {
                let autoPushInterval;

                if (isAutoPushEnabled) {
                    triggerPush();

                    autoPushInterval = setInterval(() => {
                        document.querySelector('a.link.remove-link')?.click();
                        setTimeout(triggerPush, 3000);
                    }, frequency * 1000);
                }

                return () => clearInterval(autoPushInterval);
            }, [isAutoPushEnabled, frequency]);

            const triggerPush = () => {
                const pushButton = Array.from(
                    document.querySelectorAll('.weui-desktop-btn.weui-desktop-btn_default')
                ).find(a => a.textContent.includes('推送'));
                pushButton?.click();
            };

            return React.createElement(
                'div',
                { className: 'p-3 bg-white rounded shadow' },
                React.createElement('div', { className: 'mb-3' },
                    React.createElement('label', { className: 'form-label' }, '推送频率 (s):'),
                    React.createElement('input', {
                        type: 'number',
                        min: 2,
                        max: 600,
                        value: frequency,
                        onChange: (e) => setFrequency(parseInt(e.target.value, 10)),
                        className: 'form-control'
                    })
                ),
                React.createElement('div', { className: '' }, '自动推送:'),
                React.createElement('div', { className: 'form-switch' },
                    React.createElement('input', {
                        className: 'form-check-input',
                        type: 'checkbox',
                        checked: isAutoPushEnabled,
                        onChange: (e) => setIsAutoPushEnabled(e.target.checked),
                        style: { width: '40px', height: '20px' }
                    }),
                )
            );
        };

        // 渲染 React 组件
        ReactDOM.render(React.createElement(PushTool), document.getElementById('root'));

        console.log("组件渲染完成"); // 控制台调试信息

        // 定义检测视频帧黑色方框的函数
        const checkBlackBoxInVideo = () => {
            const video = document.querySelector('video');
            if (!video) {
                console.log("未找到视频标签");
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 每5秒轮询一次
            setInterval(() => {
                // 只有在视频播放时才进行截取
                if (!video.paused && !video.ended) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    // 将视频当前帧绘制到Canvas
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // 获取右下角5x5像素区域的像素数据
                    const imageData = ctx.getImageData(canvas.width - 5, canvas.height - 5, 5, 5);
                    const pixels = imageData.data;

                    let isBlackBox = true;

                    // 遍历每个像素，检查是否为黑色（R=0, G=0, B=0, A=255）
                    for (let i = 0; i < pixels.length; i += 4) {
                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];
                        const a = pixels[i + 3];

                        if (!(r === 0 && g === 0 && b === 0 && a === 255)) {
                            isBlackBox = false;
                            break;
                        }
                    }

                    if (isBlackBox) {
                        console.log("The black box is present in the bottom right corner.");
                    } else {
                        console.log("The black box is not present.");
                    }
                }
            }, 5000);
        };

        // 开始检测视频帧
        checkBlackBoxInVideo();
    });

})();
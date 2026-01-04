// ==UserScript==
// @name         小鹅通直播回放链接解密成功提示
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  成功获取m3u8地址后，并提示用户点击右侧按钮复制m3u8地址
// @author       破坏游戏的孩子
// @match        https://*.h5.xiaoeknow.com/v3/course/alive/*
// @match        https://*.xet.citv.cn/v3/course/alive/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addElement
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js
// @license      未经许可，禁止修改
// @downloadURL https://update.greasyfork.org/scripts/528958/%E5%B0%8F%E9%B9%85%E9%80%9A%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E9%93%BE%E6%8E%A5%E8%A7%A3%E5%AF%86%E6%88%90%E5%8A%9F%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528958/%E5%B0%8F%E9%B9%85%E9%80%9A%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E9%93%BE%E6%8E%A5%E8%A7%A3%E5%AF%86%E6%88%90%E5%8A%9F%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('app_id');
    const aliveId = window.location.pathname.split('/').pop();
    const hostname = window.location.hostname;

    if (appId && aliveId) {
        // 获取视频详情的接口地址
        let baseInfoUrl;
        let apiUrl;

        if (hostname.includes('xet.citv.cn')) {
            baseInfoUrl = `https://${appId}.xet.citv.cn/_alive/v3/base_info?resource_id=${aliveId}&product_id=&type=12&is_direct=1`;
            apiUrl = `https://${appId}.xet.citv.cn/_alive/v3/get_lookback_list?app_id=${appId}&alive_id=${aliveId}`;
        } else {
            baseInfoUrl = `https://${appId}.h5.xiaoeknow.com/_alive/v3/base_info?resource_id=${aliveId}&product_id=&type=12&is_direct=1`;
            apiUrl = `https://${appId}.h5.xiaoeknow.com/_alive/v3/get_lookback_list?app_id=${appId}&alive_id=${aliveId}`;
        }

        // 先获取视频详情
        GM_xmlhttpRequest({
            method: "GET",
            url: baseInfoUrl,
            onload: function(baseResponse) {
                try {
                    const baseData = JSON.parse(baseResponse.responseText);
                    const videoTitle = baseData.data.alive_info.title || '未知标题';
                    const rawExpireTime = baseData.data.alive_conf.lookback_time.expire || '';

                    // 格式化时间和倒计时信息
                    const expireTime = rawExpireTime ? new Date(rawExpireTime * 1000).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    }).replace(/\//g, '-') : '长期有效';

                    // 计算剩余时间
                    let timeLeftStr = '';
                    let expireDate = 0;
                    if (rawExpireTime) {
                        const now = new Date().getTime();
                        expireDate = new Date(rawExpireTime * 1000).getTime();
                        const timeLeft = expireDate - now;
                        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
                        timeLeftStr = `${daysLeft}天${hoursLeft}小时${minutesLeft}分钟${secondsLeft}秒`;
                    }

                    // 继续获取回放列表
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: apiUrl,
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);

                                // 获取所有回放数据
                                const videoList = data.data || [];

                                if (videoList.length === 0) {
                                    console.error('未找到可用的视频回放');
                                    return;
                                }

                                // 创建线路选择容器
                                const container = document.createElement('div');
                                container.style.position = 'fixed';
                                container.style.right = '20px';
                                container.style.top = '50%';
                                container.style.transform = 'translateY(-50%)';
                                container.style.zIndex = '9999';
                                container.style.display = 'flex';
                                container.style.flexDirection = 'column';
                                container.style.gap = '10px';
                                container.style.backgroundColor = 'rgba(0,0,0,0.7)';
                                container.style.padding = '15px';
                                container.style.borderRadius = '8px';
                                container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                container.style.maxWidth = '200px';

                                // 循环所有回放数据
                                videoList.forEach((video, index) => {
                                    // 获取线路名称和清晰度
                                    const lineSharpness = video.line_sharpness || [];

                                    // 遍历每个清晰度
                                    lineSharpness.forEach((quality, qIndex) => {
                                        const sharpnessName = quality.name || '默认';
                                        const lineName = video.line_name ? `${video.line_name}-${sharpnessName}` : `回放${index + 1}-${sharpnessName}`;
                                        const m3u8Url = quality.url || '';

                                        // 创建线路按钮
                                        const lineButton = document.createElement('div');
                                        lineButton.innerText = lineName;
                                        lineButton.style.padding = '8px 12px';
                                        lineButton.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                        lineButton.style.color = '#fff';
                                        lineButton.style.borderRadius = '4px';
                                        lineButton.style.cursor = 'pointer';
                                        lineButton.style.fontSize = '14px';
                                        lineButton.style.marginBottom = '8px';
                                        lineButton.style.textAlign = 'center';
                                        lineButton.style.transition = 'all 0.2s ease';
                                        lineButton.style.position = 'relative';

                                        // 为第一个按钮添加推荐标志
                                        if (index === 0 && qIndex === 0) {
                                            // 创建红色三角标志
                                            const recommendBadge = document.createElement('div');
                                            recommendBadge.style.position = 'absolute';
                                            recommendBadge.style.top = '0';
                                            recommendBadge.style.left = '0';
                                            recommendBadge.style.width = '0';
                                            recommendBadge.style.height = '0';
                                            recommendBadge.style.borderStyle = 'solid';
                                            recommendBadge.style.borderWidth = '20px 20px 0 0';
                                            recommendBadge.style.borderColor = '#ff4d4f transparent transparent transparent';
                                            recommendBadge.style.borderTopLeftRadius = '4px';

                                            lineButton.appendChild(recommendBadge);
                                        }

                                        // 鼠标悬停效果
                                        lineButton.addEventListener('mouseover', () => {
                                            lineButton.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                        });

                                        lineButton.addEventListener('mouseout', () => {
                                            lineButton.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                        });

                                        // 添加点击复制功能
                                        lineButton.addEventListener('click', () => {
                                            GM_setClipboard(m3u8Url, 'text');
                                            const originalText = lineButton.innerText;
                                            lineButton.innerText = '已复制!';
                                            lineButton.style.backgroundColor = '#28a745';

                                            setTimeout(() => {
                                                lineButton.innerText = originalText;
                                                lineButton.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                            }, 1000);
                                        });

                                        container.appendChild(lineButton);
                                    });
                                });

                                // 将容器添加到页面
                                document.body.appendChild(container);

                                // 创建提示信息
                                const messageDiv = document.createElement('div');
                                messageDiv.innerHTML = `
                                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9998; background: rgba(0,0,0,0.8); padding: 20px 30px; border-radius: 8px; color: #fff; min-width: 300px; box-shadow: 0 2px 12px rgba(0,0,0,0.15);">
                                        <div style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 20px; color: rgba(255,255,255,0.8);" class="close-btn">×</div>
                                        <h2 style="margin: 0 0 15px; font-size: 24px; font-weight: bold; color: #fff; text-align: center; position: relative; overflow: hidden;" class="spotlight-title">
                                            <span style="position: relative; z-index: 1;">视频地址解密成功</span>
                                            <div class="spotlight" style="position: absolute; width: 30px; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); top: 0; left: -100%; transform: skewX(-25deg); animation: spotlight 3s infinite;"></div>
                                        </h2>
                                        <style>
                                            @keyframes spotlight {
                                                0% { left: -100%; }
                                                100% { left: 200%; }
                                            }
                                        </style>
                                        <div style="text-align: left;">
                                            <p style="margin: 0 0 15px; font-size: 16px; color: rgba(255,255,255,0.9);">您准备下载的直播：${videoTitle}</p>
                                            <p style="margin: 0 0 10px; font-size: 16px; color: rgba(255,255,255,0.9);">直播回放到期时间：${expireTime}</p>
                                            ${rawExpireTime ? `<p style="margin: 0 0 10px; font-size: 16px; color: #ff4d4f;">距离回放到期还有：<span id="countdown">${timeLeftStr}</span></p>` : ''}
                                            <p style="margin: 15px 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">请根据自己的需求尽快下载，防止直播回放到期导致无法下载资源。</p>
                                        </div>
                                    </div>
                                `;
                                document.body.appendChild(messageDiv);

                                // 添加倒计时更新功能
                                if (rawExpireTime) {
                                    const countdownElement = messageDiv.querySelector('#countdown');
                                    const updateCountdown = () => {
                                        const now = new Date().getTime();
                                        const timeLeft = expireDate - now;

                                        if (timeLeft <= 0) {
                                            countdownElement.textContent = '已过期';
                                            clearInterval(countdownInterval);
                                            return;
                                        }

                                        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                                        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                                        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                                        countdownElement.textContent = `${days}天${hours}小时${minutes}分钟${seconds}秒`;
                                    };

                                    const countdownInterval = setInterval(updateCountdown, 1000);

                                    // 关闭按钮时清除定时器
                                    const closeBtn = messageDiv.querySelector('.close-btn');
                                    closeBtn.addEventListener('click', () => {
                                        clearInterval(countdownInterval);
                                        messageDiv.remove();
                                    });
                                } else {
                                    // 无倒计时时的关闭按钮
                                    const closeBtn = messageDiv.querySelector('.close-btn');
                                    closeBtn.addEventListener('click', () => {
                                        messageDiv.remove();
                                    });
                                }

                                // 燃放烟花效果
                                confetti({
                                    particleCount: 100,
                                    spread: 160,
                                    origin: { y: 0.6 }
                                });

                                // 移除自动关闭的代码
                                // setTimeout(() => {
                                //     messageDiv.remove();
                                // }, 5000);

                            } catch (e) {
                                console.error('解析JSON失败:', e);
                            }
                        },
                        onerror: function(error) {
                            console.error('请求失败:', error);
                        }
                    });
                } catch (e) {
                    console.error('解析视频详情失败:', e);
                }
            },
            onerror: function(error) {
                console.error('请求视频详情失败:', error);
            }
        });
    }
})();
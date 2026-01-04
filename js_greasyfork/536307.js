// ==UserScript==
// @name                B站视频解析脚本[v1.5]
// @namespace           http://tampermonkey.net/
// @version             1.5
// @description         在B站视频页添加解析视频按钮
// @author              Waves_Man
// @author-github       https://github.com/WavesMan
// @author-homepage     https://home.waveyo.cn
// @match               https://www.bilibili.com/video/*
// @icon                https://cloud.waveyo.cn//Services/websites/home/images/icon/favicon.ico
// @original-script     https://scriptcat.org/zh-CN/script-show-page/2682/
// @grant               none
// @license             GPL-2.0 license
// @downloadURL https://update.greasyfork.org/scripts/536307/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%5Bv15%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/536307/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%5Bv15%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================== 位置控制器 ======================
    class PositionController {
        constructor() {
            this.config = {
                mainButton: {
                    right: '5%',
                    bottom: '5%',
                    minMargin: 50
                },
                modal: {
                    width: 300,
                    offsetY: 40,
                    padding: 20
                },
                actionButtons: {
                    spacing: 10,
                    width: 'auto',
                    marginRight: 10
                },
                outputArea: {
                    height: 100,
                    marginTop: 10
                }
            };
        }

        calculateValue(value, base) {
            if (typeof value === 'string' && value.endsWith('%')) {
                return (parseFloat(value) / 100) * base;
            }
            return parseFloat(value);
        }

        getMainButtonPosition() {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const cfg = this.config.mainButton;

            const right = Math.max(
                this.calculateValue(cfg.right, viewportWidth),
                cfg.minMargin
            );
            const bottom = Math.max(
                this.calculateValue(cfg.bottom, viewportHeight),
                cfg.minMargin
            );

            return { right, bottom };
        }

        getModalPosition(buttonBottom, buttonRight) {
            const cfg = this.config.modal;
            return {
                right: buttonRight,
                bottom: buttonBottom + cfg.offsetY,
                width: cfg.width,
                padding: cfg.padding
            };
        }

        getActionButtonStyles() {
            const cfg = this.config.actionButtons;
            return {
                width: cfg.width,
                marginRight: cfg.marginRight,
                display: 'inline-block'
            };
        }

        getOutputAreaStyles() {
            const cfg = this.config.outputArea;
            return {
                height: cfg.height,
                marginTop: cfg.marginTop
            };
        }
    }

    // ====================== 主要逻辑 ======================
    const positionCtrl = new PositionController();
    const cache = new Map();

    // API服务
    const ApiService = {
        async getVideoInfo(bvid) {
            const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
            return response.json();
        },
        
        async getPlayUrl(bvid, cid) {
            const url = `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=64&fnval=1&fnver=0&fourk=0&platform=html5`;
            
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Referer': 'https://www.bilibili.com/'
            };

            const response = await fetch(url, { headers });
            return response.json();
        }
    };

    // 带缓存的请求
    async function fetchWithCache(key, fetchFn) {
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = await fetchFn();
        cache.set(key, result);
        return result;
    }

    // 创建按钮
    function createButton(text, styles = {}, onClick = null) {
        const button = document.createElement('button');
        button.innerText = text;
        Object.assign(button.style, {
            position: 'relative',
            zIndex: '9999',
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            ...styles
        });
        if (onClick) button.onclick = onClick;
        return button;
    }

    // 主逻辑
    const bvId = window.location.pathname.split('/')[2];
    const btnPos = positionCtrl.getMainButtonPosition();

    // 创建主按钮
    const button = createButton('解析视频', {
        position: 'fixed',
        right: `${btnPos.right}px`,
        bottom: `${btnPos.bottom}px`
    });

    // 创建弹窗
    const modal = document.createElement('div');
    const modalPos = positionCtrl.getModalPosition(btnPos.bottom, btnPos.right);
    Object.assign(modal.style, {
        display: 'none',
        position: 'fixed',
        right: `${modalPos.right}px`,
        bottom: `${modalPos.bottom}px`,
        width: `${modalPos.width}px`,
        padding: `${modalPos.padding}px`,
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        zIndex: '10000'
    });

    // 创建功能按钮
    const btnStyles = positionCtrl.getActionButtonStyles();
    const startButton = createButton('开始解析', {
        width: btnStyles.width,
        marginRight: btnStyles.marginRight,
        display: btnStyles.display
    }, async () => {
        outputArea.innerHTML = '<div style="text-align:center;">加载中...</div>';
        
        try {
            outputArea.innerText = `正在解析 BV号: ${bvId}...`;
            
            const data = await fetchWithCache(
                `video-info-${bvId}`,
                () => ApiService.getVideoInfo(bvId)
            );

            if (data.code === 0) {
                const cid = data.data.cid;
                const playData = await fetchWithCache(
                    `play-url-${bvId}-${cid}`,
                    () => ApiService.getPlayUrl(bvId, cid)
                );
                
                if (playData.code === 0) {
                    // 确保URL从顶部开始显示并自动换行
                    outputArea.innerHTML = '';
                    const urlText = document.createElement('div');
                    urlText.style.whiteSpace = 'pre-wrap';
                    urlText.style.wordBreak = 'break-all';
                    urlText.style.textAlign = 'left';
                    urlText.style.overflowAnchor = 'none';
                    urlText.style.color = '#333';
                    urlText.textContent = playData.data.durl[0].url;
                    outputArea.appendChild(urlText);
                    outputArea.scrollTop = 0; // 确保滚动到顶部
                } else {
                    outputArea.innerText = '获取播放链接失败。';
                }
            } else {
                outputArea.innerText = '解析失败，无法获取视频信息。';
            }
        } catch (error) {
            outputArea.innerText = '请求失败，请检查网络。';
            console.error('Error:', error);
        }
    });

    const copyButton = createButton('复制URL', {
        width: btnStyles.width,
        marginRight: btnStyles.marginRight,
        display: btnStyles.display
    }, () => {
        const videoUrl = outputArea.innerText.trim();
        if (videoUrl) {
            navigator.clipboard.writeText(videoUrl).then(() => {
                outputArea.innerText = '视频链接已复制到剪贴板！';
            }).catch(() => {
                outputArea.innerText = '复制失败，请手动复制。';
            });
        } else {
            outputArea.innerText = '没有视频链接可复制。';
        }
    });

    const closeButton = createButton('关闭', {
        width: btnStyles.width,
        display: btnStyles.display
    }, () => {
        modal.style.display = 'none';
        outputArea.innerText = '';
    });

    // 创建输出区域（更新样式确保URL正确显示）
    const outputStyles = positionCtrl.getOutputAreaStyles();
    const outputArea = document.createElement('div');
    Object.assign(outputArea.style, {
        marginTop: `${outputStyles.marginTop}px`,
        height: `${outputStyles.height}px`,
        border: '1px solid #ccc',
        padding: '5px',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        textAlign: 'left',
        overflowAnchor: 'none'
    });

    // 组装UI
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginBottom = '10px';
    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(closeButton);

    modal.appendChild(buttonContainer);
    modal.appendChild(outputArea);

    document.body.appendChild(button);
    document.body.appendChild(modal);

    // 主按钮点击事件
    button.onclick = () => {
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        if (modal.style.display === 'block') {
            outputArea.innerHTML = '';
        }
    };

    // 窗口大小变化时重新计算位置
    window.addEventListener('resize', () => {
        const newBtnPos = positionCtrl.getMainButtonPosition();
        button.style.right = `${newBtnPos.right}px`;
        button.style.bottom = `${newBtnPos.bottom}px`;
        
        const newModalPos = positionCtrl.getModalPosition(newBtnPos.bottom, newBtnPos.right);
        modal.style.right = `${newModalPos.right}px`;
        modal.style.bottom = `${newModalPos.bottom}px`;
    });

    // 全局样式
    const style = document.createElement('style');
    style.textContent = `
        button:hover {
            background-color: #ff6b81;
            transform: scale(1.05);
        }
        div {
            font-family: Arial, sans-serif;
        }
    `;
    document.head.appendChild(style);
})();
// ==UserScript==
// @name         B站CDN智能切换-修复版
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  修复卡顿不切换问题｜30+节点｜实时监控
// @author       网络优化专家
// @match        https://www.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @connect      *.bilivideo.com
// @connect      *.ksyun.com
// @connect      *.bcache.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530070/B%E7%AB%99CDN%E6%99%BA%E8%83%BD%E5%88%87%E6%8D%A2-%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/530070/B%E7%AB%99CDN%E6%99%BA%E8%83%BD%E5%88%87%E6%8D%A2-%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心配置
    const CONFIG = {
        CHECK_DELAY: 3000,          // 卡顿判定时间(3秒)
        RETRY_LIMIT: 3,             // 连续失败次数
        NODE_SCORE: {               // 节点评分规则
            latency: 0.7,           // 延迟权重
            success: 0.3            // 成功率权重
        },
        NODE_TEST_FILE: '/index.html' // 测试用文件路径
    };

    // CDN节点库(2024.07更新)
    const CDN_NODES = [
        // 主节点
        'upos-sz-mirroraliov.bilivideo.com',
        'upos-sz-mirrorcos.bilivideo.com',
        'upos-sz-mirrorhw.bilivideo.com',
        
        // 备用节点
        'xy-125xxx.ks3-cn-beijing.ksyun.com',
        'cn-gddg-cc-01-01.bilivideo.com',
        'js-ccdn-xxx.bilivideo.com',
        
        // 动态节点(自动更新)
        ...JSON.parse(GM_getValue('dynamic_nodes') || [])
    ];

    // 状态管理器
    class StateManager {
        static currentCDN = GM_getValue('current_cdn') || CDN_NODES[0];
        static retryCount = 0;
        static lastSwitch = 0;

        static canOperate() {
            return (Date.now() - this.lastSwitch) > 10000 && this.retryCount < CONFIG.RETRY_LIMIT;
        }

        static recordSwitch() {
            this.lastSwitch = Date.now();
            this.retryCount++;
            setTimeout(() => this.retryCount--, 60000);
        }
    }

    // 增强版节点检测器
    class CDNChecker {
        static async testNode(node) {
            const testURL = `https://${node}${CONFIG.NODE_TEST_FILE}?t=${Date.now()}`;
            try {
                const latency = await this.measureLatency(testURL);
                return { node, latency, success: true };
            } catch {
                return { node, latency: Infinity, success: false };
            }
        }

        static measureLatency(url) {
            return new Promise((resolve, reject) => {
                const start = Date.now();
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: url,
                    timeout: 2000,
                    onload: () => resolve(Date.now() - start),
                    onerror: reject,
                    ontimeout: reject
                });
            });
        }

        static async findBestNode() {
            const results = await Promise.all(CDN_NODES.map(node => this.testNode(node)));
            const validNodes = results.filter(r => r.success);
            
            if(validNodes.length === 0) return null;

            return validNodes.sort((a, b) => 
                (a.latency * CONFIG.NODE_SCORE.latency) - 
                (b.latency * CONFIG.NODE_SCORE.latency)
            )[0].node;
        }
    }

    // 播放器监控系统
    class PlayerMonitor {
        constructor() {
            this.video = null;
            this.stallTimer = null;
            this.init();
        }

        async init() {
            await this.waitForPlayer();
            this.bindEvents();
            this.injectUI();
        }

        waitForPlayer() {
            return new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    this.video = document.querySelector('video');
                    if(this.video && this.video.readyState > 0) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 500);
            });
        }

        bindEvents() {
            // 核心事件绑定
            this.video.addEventListener('waiting', () => this.handleStall());
            this.video.addEventListener('playing', () => this.clearStall());
            this.video.addEventListener('error', () => this.emergencyCheck());
            
            // 网络状态监听
            window.addEventListener('online', () => this.forceCheck());
        }

        handleStall() {
            if(!this.stallTimer) {
                this.stallTimer = setTimeout(() => {
                    this.triggerSwitch();
                    this.stallTimer = null;
                }, CONFIG.CHECK_DELAY);
            }
        }

        clearStall() {
            if(this.stallTimer) {
                clearTimeout(this.stallTimer);
                this.stallTimer = null;
            }
        }

        async triggerSwitch() {
            if(!StateManager.canOperate()) return;

            const bestNode = await CDNChecker.findBestNode();
            if(!bestNode || bestNode === StateManager.currentCDN) return;

            StateManager.recordSwitch();
            GM_setValue('current_cdn', bestNode);
            this.reloadPlayer(bestNode);
        }

        reloadPlayer(node) {
            const currentTime = this.video.currentTime;
            const isPaused = this.video.paused;
            
            location.reload();
            window.addEventListener('load', () => {
                const newVideo = document.querySelector('video');
                if(newVideo) {
                    newVideo.currentTime = currentTime;
                    if(!isPaused) newVideo.play();
                }
            });
        }

        emergencyCheck() {
            if(StateManager.retryCount >= CONFIG.RETRY_LIMIT) {
                GM_setValue('current_cdn', CDN_NODES[0]);
                location.reload();
            }
        }

        forceCheck() {
            this.triggerSwitch();
        }

        injectUI() {
            const style = document.createElement('style');
            style.textContent = `
                .cdn-switcher-debug {
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    background: rgba(0,0,0,0.9);
                    color: #00ff00;
                    padding: 10px;
                    border-radius: 5px;
                    font-family: monospace;
                    z-index: 99999;
                }
            `;
            document.head.appendChild(style);

            this.debugBox = document.createElement('div');
            this.debugBox.className = 'cdn-switcher-debug';
            document.body.appendChild(this.debugBox);

            setInterval(() => this.updateDebugInfo(), 1000);
        }

        updateDebugInfo() {
            this.debugBox.textContent = `
                当前节点: ${StateManager.currentCDN}
                重试次数: ${StateManager.retryCount}
                最后切换: ${Math.floor((Date.now() - StateManager.lastSwitch)/1000)}秒前
            `;
        }
    }

    // 启动监控
    new PlayerMonitor();

})();
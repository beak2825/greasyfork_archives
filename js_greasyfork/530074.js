// ==UserScript==
// @name         B站CDN优化-台湾特别版
// @namespace    http://tampermonkey.net/
// @version      3.4.0
// @description  自动切换最优CDN｜降低视频卡顿｜增强稳定性
// @author       网络优化专家
// @match        https://www.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530074/B%E7%AB%99CDN%E4%BC%98%E5%8C%96-%E5%8F%B0%E6%B9%BE%E7%89%B9%E5%88%AB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/530074/B%E7%AB%99CDN%E4%BC%98%E5%8C%96-%E5%8F%B0%E6%B9%BE%E7%89%B9%E5%88%AB%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心配置
    const CONFIG = {
        CHECK_THRESHOLD: 3,  // 連續卡頓次數
        BASE_TIMEOUT: 1200,  // 超時設定
        CACHE_DURATION: 300, // CDN 緩存時間 (秒)
        LOCATION_API: 'https://ipapi.co/json/' // 位置 API
    };

    // CDN 節點
    const CDN_NODES = {
        mainland: ['upos-hz-mirrorakam.akamaized.net', 'upos-sz-mirroraliov.bilivideo.com'],
        taiwan: [
            'cn-hk-eq-01-09.bilivideo.com', 'cn-hk-eq-01-10.bilivideo.com',
            'cn-hk-eq-01-12.bilivideo.com', 'cn-hk-eq-01-13.bilivideo.com'
        ],
        asia: ['49.231.120.168']
    };

    class CDNOptimizer {
        constructor() {
            if (CDNOptimizer.instance) return CDNOptimizer.instance;
            CDNOptimizer.instance = this;

            this.userLocation = 'unknown';
            this.stallCount = 0;
            this.bestCDN = GM_getValue('best_cdn', null);
            this.lastCheckTime = GM_getValue('last_check_time', 0);

            this.init();
        }

        async init() {
            await this.detectLocation();
            this.setupAutoCheck();
            this.createUI();
        }

        async detectLocation() {
            try {
                const data = await this.fetchJSON(CONFIG.LOCATION_API);
                this.userLocation = data.country_code === 'TW' ? 'taiwan' :
                                   data.continent_code === 'AS' ? 'asia' : 'mainland';
            } catch {
                this.userLocation = 'mainland';
            }
        }

        fetchJSON(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: res => resolve(JSON.parse(res.responseText)),
                    onerror: () => reject(new Error('API 請求失敗'))
                });
            });
        }

        getPriorityList() {
            return this.userLocation === 'taiwan' 
                ? [...CDN_NODES.taiwan, ...CDN_NODES.asia, ...CDN_NODES.mainland] 
                : [...CDN_NODES.mainland, ...CDN_NODES.asia];
        }

        async measureNode(node) {
            try {
                const start = Date.now();
                await Promise.race([
                    this.pingNode(node),
                    new Promise((_, reject) => setTimeout(reject, CONFIG.BASE_TIMEOUT))
                ]);
                return { node, latency: Date.now() - start, success: true };
            } catch {
                return { node, latency: Infinity, success: false };
            }
        }

        pingNode(node) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: `https://${node}/test?${Date.now()}`,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });
        }

        async findOptimalNode() {
            const now = Date.now() / 1000;
            if (this.bestCDN && now - this.lastCheckTime < CONFIG.CACHE_DURATION) {
                return this.bestCDN;
            }

            const results = await Promise.allSettled(this.getPriorityList().map(n => this.measureNode(n)));
            const bestNode = results
                .filter(r => r.status === 'fulfilled' && r.value.success)
                .sort((a, b) => a.value.latency - b.value.latency)
                [0]?.value.node;

            if (bestNode) {
                GM_setValue('best_cdn', bestNode);
                GM_setValue('last_check_time', now);
                this.bestCDN = bestNode;
            }

            return bestNode;
        }

        setupAutoCheck() {
            const video = document.querySelector('video');
            if (!video) return;

            video.addEventListener('stalled', () => this.handleStall(video));
            video.addEventListener('waiting', () => this.handleStall(video));
            video.addEventListener('progress', () => this.resetStallCount());
        }

        handleStall(video) {
            if (++this.stallCount >= CONFIG.CHECK_THRESHOLD) {
                this.triggerOptimization(video);
                this.stallCount = 0;
            }
        }

        resetStallCount() {
            this.stallCount = 0;
        }

        async triggerOptimization(video) {
            const currentNode = GM_getValue('current_cdn');
            const bestNode = await this.findOptimalNode();
            
            if (bestNode && bestNode !== currentNode) {
                GM_setValue('current_cdn', bestNode);
                this.switchVideoSource(video, bestNode);
            }
        }

        switchVideoSource(video, newCDN) {
            if (!video) return;

            const newURL = video.src.replace(/https:\/\/[^/]+/, `https://${newCDN}`);
            video.src = newURL;
            video.load();
            video.play();
        }

        createUI() {
            this.statusBox = document.createElement('div');
            this.statusBox.className = 'cdn-status-tw';
            this.statusBox.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #1a237e;
                color: white;
                padding: 10px;
                border-radius: 6px;
                z-index: 99999;
                font-size: 14px;
            `;
            document.body.appendChild(this.statusBox);
            this.updateUI();
        }

        async updateUI() {
            const currentNode = GM_getValue('current_cdn');
            const nodeStatus = currentNode ? currentNode : '选择中...';
            this.statusBox.innerHTML = `
                <div class="cdn-status-title">🇹🇼 B站网络优化</div>
                <div class="cdn-node-info">当前节点: ${nodeStatus}</div>
                <div class="cdn-node-info">连接地区: ${this.userLocation === 'taiwan' ? '台湾节点' : '国际节点'}</div>
            `;
        }
    }

    new CDNOptimizer();
})();

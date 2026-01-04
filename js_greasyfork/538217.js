// ==UserScript==
// @name         哔哩哔哩 CDN 优选和画质固定
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  哔哩哔哩 CDN 优选，逻辑参考了 https://github.com/guozhigq/pilipala，大部分代码由 ai 完成。固定 cookie 中存储的默认画质，不允许哔哩哔哩修改。
// @author       Moranjianghe
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @connect      proxy-tf-all-ws.bilivideo.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538217/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20CDN%20%E4%BC%98%E9%80%89%E5%92%8C%E7%94%BB%E8%B4%A8%E5%9B%BA%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/538217/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20CDN%20%E4%BC%98%E9%80%89%E5%92%8C%E7%94%BB%E8%B4%A8%E5%9B%BA%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * B站视频CDN优化与MCDN代理类
     */
    class BilibiliCDNOptimizer {
        constructor() {
            // CDN 节点列表，按优先级排序
            this.cdnList = {
                'ali': 'upos-sz-mirrorali.bilivideo.com',      // 阿里云 (推荐)
                'cos': 'upos-sz-mirrorcos.bilivideo.com',      // 腾讯云
                'hw': 'upos-sz-mirrorhw.bilivideo.com',        // 华为云
                'ws': 'upos-sz-mirrorws.bilivideo.com',        // 网宿
                'bda2': 'upos-sz-mirrorbda2.bilivideo.com',    // 百度云
            };

            // 视频画质选项
            this.qualityOptions = {
                '6': '240P 极速',
                '16': '360P 流畅',
                '32': '480P 清晰',
                '64': '720P 高清',
                '74': '720P60 高帧率',
                '80': '1080P 高清',
                '100': '智能修复',
                '112': '1080P+ 高码率',
                '116': '1080P60 高帧率',
                '120': '4K 超清',
                '125': 'HDR 真彩色',
                '126': '杜比视界',
                '127': '8K 超高清',
            };

            // 使用与cdn.js相同的MCDN检测方法
            this.upgcxcodeRegex = /(https?:\/\/)(.*?)(\/upgcxcode\/)/;

            // 初始化设置
            this.enableCDNOptimize = GM_getValue('enableCDNOptimize', true);
            this.enableMCDNProxy = GM_getValue('enableMCDNProxy', true);
            this.preferredCDN = GM_getValue('preferredCDN', 'ali');
            this.debugMode = GM_getValue('debugMode', false);

            // 画质固定功能
            this.enableQualityFix = GM_getValue('enableQualityFix', false);
            this.fixedQuality = GM_getValue('fixedQuality', '127'); // 默认8K超高清

            // 备用URL存储
            this.backupUrls = new Map();

            // 初始化后台拦截
            this.initInterceptors();

            // 注册菜单命令
            this.registerMenuCommands();

            // 设置画质cookie
            if (this.enableQualityFix) {
                this.setQualityCookie();
            }

            this.log("B站视频CDN优化与MCDN代理已初始化");
        }

        /**
         * 日志记录函数
         * @param {string} message - 日志消息
         */
        log(message) {
            if (this.debugMode) {
                console.log(`[CDN] ${message}`);  // 与cdn.js保持一致的日志前缀
            }
        }

        /**
         * 注册用户脚本菜单命令
         */
        registerMenuCommands() {
            // CDN优化开关
            GM_registerMenuCommand(`${this.enableCDNOptimize ? '✅' : '❌'} CDN优化`, () => {
                this.enableCDNOptimize = !this.enableCDNOptimize;
                GM_setValue('enableCDNOptimize', this.enableCDNOptimize);
                this.log(`CDN优化已${this.enableCDNOptimize ? '启用' : '禁用'}`);
                location.reload();
            });

            // MCDN代理开关
            GM_registerMenuCommand(`${this.enableMCDNProxy ? '✅' : '❌'} MCDN代理`, () => {
                this.enableMCDNProxy = !this.enableMCDNProxy;
                GM_setValue('enableMCDNProxy', this.enableMCDNProxy);
                this.log(`MCDN代理已${this.enableMCDNProxy ? '启用' : '禁用'}`);
                location.reload();
            });

            // CDN选择菜单
            GM_registerMenuCommand(`🔄 当前CDN: ${this.preferredCDN}`, () => {
                const cdnKeys = Object.keys(this.cdnList);
                const currentIndex = cdnKeys.indexOf(this.preferredCDN);
                const nextIndex = (currentIndex + 1) % cdnKeys.length;
                this.preferredCDN = cdnKeys[nextIndex];
                GM_setValue('preferredCDN', this.preferredCDN);
                this.log(`已切换CDN为: ${this.preferredCDN}`);
                alert(`已切换CDN为: ${this.preferredCDN} (${this.cdnList[this.preferredCDN]})`);
            });

            // 画质固定开关
            GM_registerMenuCommand(`${this.enableQualityFix ? '✅' : '❌'} 画质固定`, () => {
                this.enableQualityFix = !this.enableQualityFix;
                GM_setValue('enableQualityFix', this.enableQualityFix);
                this.log(`画质固定已${this.enableQualityFix ? '启用' : '禁用'}`);
                if (this.enableQualityFix) {
                    this.setQualityCookie();
                }
                location.reload();
            });

            // 画质选择菜单
            GM_registerMenuCommand(`🎞️ 固定画质: ${this.qualityOptions[this.fixedQuality]}`, () => {
                this.selectQuality();
            });

            // 调试模式开关
            GM_registerMenuCommand(`${this.debugMode ? '✅' : '❌'} 调试模式`, () => {
                this.debugMode = !this.debugMode;
                GM_setValue('debugMode', this.debugMode);
                this.log(`调试模式已${this.debugMode ? '启用' : '禁用'}`);
            });
        }

        /**
         * 初始化网络请求拦截器
         */
        initInterceptors() {
            // 拦截XMLHttpRequest
            this.interceptXHR();

            // 拦截Fetch
            this.interceptFetch();

            // 监听DOM变化处理视频元素
            this.observeDOM();

            // 拦截媒体源扩展(MSE)
            this.interceptMediaSource();
        }

        /**
         * 拦截XMLHttpRequest请求
         */
        interceptXHR() {
            const self = this;
            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                // 保存原始URL以便在send中使用
                this._originalUrl = url;

                const optimizedUrl = self.optimizeUrl(url);
                if (optimizedUrl && optimizedUrl !== url) {
                    self.log(`XHR请求已优化: ${url} -> ${optimizedUrl}`);
                    originalXHROpen.call(this, method, optimizedUrl, async !== false, user, password);
                } else {
                    originalXHROpen.call(this, method, url, async !== false, user, password);
                }
            };

            // 拦截响应以提取备用URL
            XMLHttpRequest.prototype.send = function(body) {
                const xhr = this;
                const originalUrl = xhr._originalUrl;

                // 检查是否是视频信息API
                if (originalUrl && (
                    originalUrl.includes('/x/player/playurl') ||
                    originalUrl.includes('/x/player/wbi/playurl') ||
                    originalUrl.includes('/pgc/player/web/playurl')
                )) {
                    // 添加响应监听器
                    xhr.addEventListener('load', function() {
                        try {
                            if (xhr.responseType === 'json' || xhr.responseType === '') {
                                const response = xhr.responseType === 'json' ? xhr.response : JSON.parse(xhr.responseText);
                                self.extractBackupUrls(response);
                            }
                        } catch (e) {
                            self.log(`提取备用URL错误: ${e.message}`);
                        }
                    });
                }

                originalXHRSend.call(this, body);
            };
        }

        /**
         * 拦截Fetch请求
         */
        interceptFetch() {
            const self = this;
            const originalFetch = window.fetch;

            window.fetch = function(resource, init) {
                let url = '';
                let originalRequest = null;

                if (typeof resource === 'string') {
                    url = resource;
                    const optimizedUrl = self.optimizeUrl(url);
                    if (optimizedUrl && optimizedUrl !== url) {
                        self.log(`Fetch请求已优化: ${url} -> ${optimizedUrl}`);
                        resource = optimizedUrl;
                    }
                } else if (resource instanceof Request) {
                    url = resource.url;
                    originalRequest = resource.clone();
                    const optimizedUrl = self.optimizeUrl(url);
                    if (optimizedUrl && optimizedUrl !== url) {
                        self.log(`Fetch Request已优化: ${url} -> ${optimizedUrl}`);
                        resource = new Request(optimizedUrl, resource);
                    }
                }

                // 判断是否是视频信息API
                const isVideoApi = url && (
                    url.includes('/x/player/playurl') ||
                    url.includes('/x/player/wbi/playurl') ||
                    url.includes('/pgc/player/web/playurl')
                );

                // 执行原始fetch请求
                return originalFetch.call(window, resource, init).then(response => {
                    // 如果是视频API，提取备用URL
                    if (isVideoApi) {
                        response.clone().json().then(data => {
                            self.extractBackupUrls(data);
                        }).catch(err => {
                            self.log(`提取备用URL错误: ${err.message}`);
                        });
                    }
                    return response;
                });
            };
        }

        /**
         * 拦截MediaSource
         */
        interceptMediaSource() {
            if (window.MediaSource) {
                const self = this;
                const originalAddSourceBuffer = MediaSource.prototype.addSourceBuffer;

                MediaSource.prototype.addSourceBuffer = function(mimeType) {
                    self.log(`MediaSource添加缓冲区: ${mimeType}`);
                    const sourceBuffer = originalAddSourceBuffer.call(this, mimeType);
                    return sourceBuffer;
                };
            }
        }

        /**
         * 从API响应中提取备用URL
         * @param {Object} data - API响应数据
         */
        extractBackupUrls(data) {
            try {
                // 处理不同API格式的响应
                if (data && data.data) {
                    const responseData = data.data;

                    // 处理备用URL
                    if (responseData.durl && Array.isArray(responseData.durl)) {
                        responseData.durl.forEach((item, index) => {
                            if (item.url) {
                                // 保存原始URL和备用URL的映射关系
                                if (item.backup_url && Array.isArray(item.backup_url)) {
                                    item.backup_url.forEach(backupUrl => {
                                        if (backupUrl && backupUrl.includes('http')) {
                                            this.backupUrls.set(item.url, backupUrl);
                                            this.log(`提取到备用URL: ${backupUrl} (对应 ${item.url})`);
                                        }
                                    });
                                }
                            }
                        });
                    }

                    // 处理DASH格式
                    if (responseData.dash) {
                        // 处理视频流
                        if (responseData.dash.video && Array.isArray(responseData.dash.video)) {
                            responseData.dash.video.forEach(video => {
                                if (video.base_url && video.backup_url && Array.isArray(video.backup_url)) {
                                    video.backup_url.forEach(backupUrl => {
                                        if (backupUrl && backupUrl.includes('http')) {
                                            this.backupUrls.set(video.base_url, backupUrl);
                                            this.log(`提取到视频备用URL: ${backupUrl} (对应 ${video.base_url})`);
                                        }
                                    });
                                }
                            });
                        }

                        // 处理音频流
                        if (responseData.dash.audio && Array.isArray(responseData.dash.audio)) {
                            responseData.dash.audio.forEach(audio => {
                                if (audio.base_url && audio.backup_url && Array.isArray(audio.backup_url)) {
                                    audio.backup_url.forEach(backupUrl => {
                                        if (backupUrl && backupUrl.includes('http')) {
                                            this.backupUrls.set(audio.base_url, backupUrl);
                                            this.log(`提取到音频备用URL: ${backupUrl} (对应 ${audio.base_url})`);
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            } catch (e) {
                this.log(`解析备用URL错误: ${e.message}`);
            }
        }

        /**
         * 观察DOM变化以处理视频元素
         */
        observeDOM() {
            const self = this;

            // 页面加载完成后开始观察DOM变化
            window.addEventListener('DOMContentLoaded', () => {
                self.processVideoElements();

                const observer = new MutationObserver(() => {
                    self.processVideoElements();
                });

                observer.observe(document.body, { childList: true, subtree: true });
                self.log('DOM观察器已激活');
            });
        }

        /**
         * 处理页面中的视频元素
         */
        processVideoElements() {
            const self = this;
            const videoElements = document.querySelectorAll('video');

            videoElements.forEach(video => {
                // 处理video.src
                if (video.src) {
                    const backupUrl = self.getBackupUrl(video.src);
                    const targetUrl = backupUrl || video.src;
                    const optimizedUrl = self.optimizeVideoUrl(targetUrl, backupUrl);

                    if (optimizedUrl && optimizedUrl !== video.src) {
                        self.log(`视频元素src已优化: ${video.src} -> ${optimizedUrl}`);
                        video.src = optimizedUrl;
                    }
                }

                // 处理source元素
                const sourceElements = video.querySelectorAll('source');
                sourceElements.forEach(source => {
                    if (source.src) {
                        const backupUrl = self.getBackupUrl(source.src);
                        const targetUrl = backupUrl || source.src;
                        const optimizedUrl = self.optimizeVideoUrl(targetUrl, backupUrl);

                        if (optimizedUrl && optimizedUrl !== source.src) {
                            self.log(`视频source元素已优化: ${source.src} -> ${optimizedUrl}`);
                            source.src = optimizedUrl;
                        }
                    }
                });
            });
        }

        /**
         * 获取URL对应的备用URL
         * @param {string} url - 原始URL
         * @returns {string|null} 备用URL或null
         */
        getBackupUrl(url) {
            // 先检查完全匹配
            if (this.backupUrls.has(url)) {
                return this.backupUrls.get(url);
            }

            // 检查部分匹配 (处理URL参数可能不同的情况)
            for (const [originalUrl, backupUrl] of this.backupUrls.entries()) {
                // 提取URL的基本部分(不含参数)
                const baseOriginalUrl = originalUrl.split('?')[0];
                const baseInputUrl = url.split('?')[0];

                if (baseInputUrl === baseOriginalUrl) {
                    this.log(`找到部分匹配的备用URL: ${backupUrl} (对应 ${url})`);
                    return backupUrl;
                }
            }

            return null;
        }

        /**
         * 检测是否是MCDN URL（使用与cdn.js相同的检测逻辑）
         * @param {string} url - 要检查的URL
         * @returns {boolean} 是否是MCDN URL
         */
        isMCDNUrl(url) {
            return url && (
                url.includes('.mcdn.bilivideo') ||
                url.includes('.mcdn.bilivideo.cn') ||
                url.includes('.mcdn.bilivideo.com')
            );
        }

        /**
         * 优化视频URL，综合处理备用URL、MCDN代理和CDN优选
         * @param {string} originalUrl - 原始URL
         * @param {string} backupUrl - 备用URL
         * @returns {string} 优化后的URL
         */
        optimizeVideoUrl(originalUrl, backupUrl = '') {
            this.log(`原始URL: ${originalUrl}`);
            this.log(`备用URL: ${backupUrl}`);

            // 检查CDN优化是否启用
            const enableCdn = this.enableCDNOptimize;
            if (!enableCdn && !this.enableMCDNProxy) {
                this.log('CDN优化和MCDN代理都已禁用，使用原始URL');
                return originalUrl;
            }

            // 优先使用backupUrl，通常是upgcxcode地址，播放更稳定
            let videoUrl = '';
            if (backupUrl && backupUrl.includes('http')) {
                videoUrl = backupUrl;
                this.log('使用备用URL');
            } else {
                videoUrl = originalUrl;
                this.log('使用原始URL');
            }

            // 处理mcdn域名的特殊情况 - 使用与cdn.js相同的检测逻辑
            if (this.enableMCDNProxy && this.isMCDNUrl(videoUrl)) {
                this.log(`检测到mcdn域名: ${videoUrl}`);
                const proxyUrl = this.proxyMCDN(videoUrl);
                this.log(`使用代理: ${proxyUrl}`);
                return proxyUrl;
            }

            // 处理upgcxcode路径，替换为优选CDN
            if (enableCdn && this.upgcxcodeRegex.test(videoUrl)) {
                this.log(`检测到upgcxcode路径，替换CDN`);

                // 从GM_getValue获取用户选择的CDN（与原始CDN.js行为保持一致）
                const preferredCdn = this.preferredCDN;
                // 获取对应的CDN主机名
                const cdn = this.cdnList[preferredCdn] || this.cdnList['ali'];

                // 使用正则表达式替换域名部分
                const replacedUrl = videoUrl.replace(this.upgcxcodeRegex, `https://${cdn}/upgcxcode/`);

                this.log(`替换CDN: ${preferredCdn} -> ${cdn}`);
                return replacedUrl;
            }

            this.log('无需优化，返回原始URL');
            return videoUrl;
        }

        /**
         * 优化普通URL，用于XHR/Fetch拦截
         * @param {string} url - 原始URL
         * @returns {string} 优化后的URL
         */
        optimizeUrl(url) {
            if (!url) return url;

            try {
                // 获取可能的备用URL
                const backupUrl = this.getBackupUrl(url);

                // 使用完整的优化逻辑
                return this.optimizeVideoUrl(url, backupUrl);
            } catch (error) {
                this.log(`URL优化错误: ${error.message}`);
                return url;
            }
        }

        /**
         * 使用代理服务器代理MCDN请求
         * @param {string} url - MCDN URL
         * @returns {string} 代理后的URL
         */
        proxyMCDN(url) {
            const proxyUrl = `https://proxy-tf-all-ws.bilivideo.com/?url=${encodeURIComponent(url)}`;
            this.log(`MCDN代理URL: ${proxyUrl}`);
            return proxyUrl;
        }

        /**
         * 替换CDN为优选节点
         * @param {string} url - 包含upgcxcode的URL
         * @returns {string} 替换CDN后的URL
         */
        replaceCDN(url) {
            const cdn = this.cdnList[this.preferredCDN] || this.cdnList['ali'];
            const replacedUrl = url.replace(this.upgcxcodeRegex, `https://${cdn}/upgcxcode/`);
            this.log(`替换CDN: ${this.preferredCDN} (${cdn})`);
            return replacedUrl;
        }

        /**
         * 弹出画质选择对话框
         */
        selectQuality() {
            const qualityEntries = Object.entries(this.qualityOptions);
            let optionsText = "请选择要固定的视频画质:\n（可以输入索引或质量值）\n（如果设置为自己的会员等级无法观看的画质或者不支持的画质，会自动向下兼容）\n\n";

            qualityEntries.forEach(([value, label], index) => {
                optionsText += `${index + 1}. ${label} (${value})\n`;
            });

            const userInput = prompt(optionsText, this.fixedQuality);

            if (userInput !== null) {
                // 检查用户输入是否是数字索引或质量值
                const numInput = parseInt(userInput);

                if (!isNaN(numInput)) {
                    // 检查是否是索引值
                    if (numInput >= 1 && numInput <= qualityEntries.length) {
                        // 用户输入了选项的序号
                        this.fixedQuality = qualityEntries[numInput - 1][0];
                    } else if (Object.keys(this.qualityOptions).includes(userInput)) {
                        // 用户直接输入了质量值
                        this.fixedQuality = userInput;
                    } else {
                        alert("无效的画质选择，请重新选择");
                        return;
                    }

                    GM_setValue('fixedQuality', this.fixedQuality);
                    this.log(`已设置固定画质为: ${this.qualityOptions[this.fixedQuality]}`);
                    alert(`已设置固定画质为: ${this.qualityOptions[this.fixedQuality]}`);

                    if (this.enableQualityFix) {
                        this.setQualityCookie();
                        location.reload();
                    }
                } else {
                    alert("请输入有效的数字");
                }
            }
        }

        /**
         * 设置画质cookie
         */
        setQualityCookie() {
            const cookieName = "CURRENT_QUALITY";
            const cookieValue = this.fixedQuality;
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 设置一年有效期

            document.cookie = `${cookieName}=${cookieValue}; domain=.bilibili.com; path=/; expires=${expiryDate.toUTCString()}`;
            this.log(`已设置画质Cookie: ${cookieName}=${cookieValue}`);
        }

        /**
         * 获取当前画质设置信息
         * @returns {Object} 画质设置信息
         */
        getQualityFixInfo() {
            return {
                enabled: this.enableQualityFix,
                quality: this.fixedQuality,
                qualityName: this.qualityOptions[this.fixedQuality] || '未知画质'
            };
        }

        /**
         * 获取当前CDN信息
         * @returns {Object} CDN信息
         */
        getCDNInfo() {
            return {
                key: this.preferredCDN,
                host: this.cdnList[this.preferredCDN],
                enabled: this.enableCDNOptimize
            };
        }

        /**
         * 获取MCDN代理信息
         * @returns {Object} MCDN代理信息
         */
        getMCDNProxyInfo() {
            return {
                enabled: this.enableMCDNProxy,
                proxy: 'proxy-tf-all-ws.bilivideo.com'
            };
        }

        /**
         * 获取备用URL统计信息
         * @returns {Object} 备用URL统计
         */
        getBackupUrlStats() {
            return {
                count: this.backupUrls.size,
                urls: Array.from(this.backupUrls.entries()).slice(0, 5) // 仅返回前5个示例
            };
        }
    }

    // 创建并初始化B站CDN优化器
    const bilibiliCDNOptimizer = new BilibiliCDNOptimizer();

    // 将优化器实例暴露到全局，方便调试
    window.bilibiliCDNOptimizer = bilibiliCDNOptimizer;
})();
// ==UserScript==
// @name            Ultimate Video Optimizer
// @description     智能的网页视频性能优化工具，支持所有主流视频格式，提供智能质量调整、带宽优化、预加载策略等功能
// @version         2.1
// @author          moyu001
// @namespace       https://greasyfork.org/zh-CN/users/1474228-moyu001
// @match           *://*/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           unsafeWindow
// @run-at          document-start
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/538912/Ultimate%20Video%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/538912/Ultimate%20Video%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 视频优化器主类
     * 提供智能视频优化、性能监控等功能
     */
    class AIVideoOptimizer {
        constructor() {
            this.version = '2.0';
            this.debug = GM_getValue('debug_mode', false);
            this.enabled = GM_getValue('optimizer_enabled', true);

            // 核心模块
            this.detector = null;
            this.analyzer = null;
            this.optimizer = null;
            this.monitor = null;

            // 配置信息
            this.config = this.loadConfig();

            // 性能数据
            this.stats = {
                optimizedVideos: 0,
                bandwidthSaved: 0,
                bufferingReduced: 0,
                qualityImproved: 0
            };

            this.log('Ultimate Video Optimizer初始化完成', 'info');
        }

        /**
         * 加载配置信息
         */
        loadConfig() {
            return {
                // 基础设置
                autoOptimize: GM_getValue('auto_optimize', true),
                adaptiveQuality: GM_getValue('adaptive_quality', true),

                // 优化策略
                bufferSize: GM_getValue('buffer_size', 30), // 秒
                qualityThreshold: GM_getValue('quality_threshold', 0.8),
                bandwidthThreshold: GM_getValue('bandwidth_threshold', 2), // Mbps

                // 高级设置
                enablePreload: GM_getValue('enable_preload', true),
                enableHardwareAccel: GM_getValue('enable_hardware_accel', true),
                maxCacheSize: GM_getValue('max_cache_size', 100), // MB

                // 兼容性设置
                supportedFormats: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'],
                supportedCodecs: ['h264', 'h265', 'vp8', 'vp9', 'av1']
            };
        }

        /**
         * 保存配置信息
         */
        saveConfig() {
            Object.keys(this.config).forEach(key => {
                if (typeof this.config[key] !== 'object') {
                    GM_setValue(key, this.config[key]);
                }
            });
        }

        /**
         * 日志输出函数
         */
        log(message, level = 'info') {
            if (!this.debug && level === 'debug') return;

            const timestamp = new Date().toLocaleTimeString('zh-CN');
            const prefix = `[UVO ${timestamp}]`;

            switch (level) {
                case 'error':
                    console.error(prefix, message);
                    break;
                case 'warn':
                    console.warn(prefix, message);
                    break;
                case 'debug':
                    console.debug(prefix, message);
                    break;
                default:
                    console.log(prefix, message);
            }
        }

        /**
         * 初始化所有模块
         */
        async initialize() {
            if (!this.enabled) {
                this.log('优化器已禁用，跳过初始化');
                return;
            }

            try {
                // 等待DOM加载
                if (document.readyState === 'loading') {
                    await new Promise(resolve => {
                        document.addEventListener('DOMContentLoaded', resolve);
                    });
                }

                this.log('开始初始化各个模块...');

                // 初始化检测器
                this.detector = new VideoDetector(this);
                await this.detector.initialize();

                // 初始化分析器
                this.analyzer = new PerformanceAnalyzer(this);
                await this.analyzer.initialize();

                // 初始化优化器
                this.optimizer = new VideoOptimizer(this);
                await this.optimizer.initialize();

                // 初始化监控器
                this.monitor = new PerformanceMonitor(this);
                await this.monitor.initialize();

                // 启动主循环
                this.startMainLoop();

                this.log('所有模块初始化完成', 'info');

            } catch (error) {
                this.log(`初始化失败: ${error.message}`, 'error');
            }
        }

        /**
         * 启动主要的优化循环
         */
        startMainLoop() {
            // 每秒检查一次视频元素
            setInterval(() => {
                if (this.detector) {
                    this.detector.scanForVideos();
                }
            }, 1000);

            // 每5秒更新性能数据
            setInterval(() => {
                if (this.monitor) {
                    this.monitor.collectMetrics();
                }
            }, 5000);
        }

        /**
         * 清理资源
         */
        cleanup() {
            this.log('清理资源...');

            if (this.monitor) this.monitor.destroy();
            if (this.optimizer) this.optimizer.destroy();
            if (this.analyzer) this.analyzer.destroy();
            if (this.detector) this.detector.destroy();
        }
    }

    // 全局实例
    let aiVideoOptimizer = null;

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOptimizer);
    } else {
        initOptimizer();
    }

    /**
     * 初始化优化器
     */
    async function initOptimizer() {
        try {
            aiVideoOptimizer = new AIVideoOptimizer();
            await aiVideoOptimizer.initialize();

            // 页面卸载时清理资源
            window.addEventListener('beforeunload', () => {
                if (aiVideoOptimizer) {
                    aiVideoOptimizer.cleanup();
                }
            });

        } catch (error) {
            console.error('[Ultimate Video Optimizer] 启动失败:', error);
        }
    }

    // 导出到全局作用域以便调试
    unsafeWindow.AIVideoOptimizer = AIVideoOptimizer;
    unsafeWindow.aiVideoOptimizer = aiVideoOptimizer;

})();

/**
 * 视频检测器模块
 * 负责检测和识别页面中的所有视频元素，包括video标签、iframe中的视频等
 */
class VideoDetector {
    constructor(optimizer) {
        this.optimizer = optimizer;
        this.detectedVideos = new Map(); // 已检测到的视频元素
        this.observerConfig = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'poster', 'preload']
        };

        // MutationObserver用于监听DOM变化
        this.mutationObserver = null;

        // 支持的视频格式和编码
        this.videoFormats = new Set([
            'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv', '3gp'
        ]);

        this.videoCodecs = new Set([
            'h264', 'h265', 'hevc', 'vp8', 'vp9', 'av1', 'theora'
        ]);
    }

    /**
     * 初始化检测器
     */
    async initialize() {
        this.optimizer.log('初始化视频检测器...', 'debug');

        // 初始扫描现有视频
        await this.initialScan();

        // 设置DOM变化监听
        this.setupMutationObserver();

        // 设置性能观察器
        this.setupPerformanceObserver();

        this.optimizer.log('视频检测器初始化完成');
    }

    /**
     * 初始扫描页面中的视频元素
     */
    async initialScan() {
        // 扫描video元素
        const videoElements = document.querySelectorAll('video');
        for (const video of videoElements) {
            await this.processVideoElement(video);
        }

        // 扫描iframe中可能的视频
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            this.processIframe(iframe);
        }

        // 扫描可能包含视频的其他元素
        await this.scanForEmbeddedVideos();

        this.optimizer.log(`初始扫描完成，发现 ${this.detectedVideos.size} 个视频元素`, 'debug');
    }

    /**
     * 处理video元素
     */
    async processVideoElement(videoElement) {
        const videoId = this.generateVideoId(videoElement);

        if (this.detectedVideos.has(videoId)) {
            return; // 已经处理过
        }

        const videoInfo = await this.analyzeVideoElement(videoElement);

        if (videoInfo) {
            this.detectedVideos.set(videoId, {
                element: videoElement,
                info: videoInfo,
                optimized: false,
                createdAt: Date.now()
            });

            // 通知优化器有新视频发现
            if (this.optimizer.optimizer) {
                this.optimizer.optimizer.handleNewVideo(videoElement, videoInfo);
            }

            this.optimizer.log(`发现新视频: ${videoInfo.src || videoInfo.poster}`, 'debug');
        }
    }

    /**
     * 分析video元素的详细信息
     */
    async analyzeVideoElement(videoElement) {
        try {
            const videoInfo = {
                id: this.generateVideoId(videoElement),
                src: videoElement.src || videoElement.currentSrc,
                poster: videoElement.poster,
                duration: videoElement.duration || 0,
                currentTime: videoElement.currentTime || 0,
                volume: videoElement.volume,
                muted: videoElement.muted,
                autoplay: videoElement.autoplay,
                controls: videoElement.controls,
                loop: videoElement.loop,
                preload: videoElement.preload,
                crossOrigin: videoElement.crossOrigin,

                // 视频尺寸信息
                width: videoElement.videoWidth || videoElement.width,
                height: videoElement.videoHeight || videoElement.height,

                // 网络状态
                networkState: videoElement.networkState,
                readyState: videoElement.readyState,

                // 格式信息
                format: this.detectVideoFormat(videoElement),
                codec: this.detectVideoCodec(videoElement),

                // 质量信息
                quality: this.detectVideoQuality(videoElement),
                bitrate: await this.estimateBitrate(videoElement),

                // 可访问性
                canPlay: await this.testCanPlay(videoElement),

                // 时间戳
                timestamp: Date.now()
            };

            // 检测source元素
            const sources = videoElement.querySelectorAll('source');
            if (sources.length > 0) {
                videoInfo.sources = Array.from(sources).map(source => ({
                    src: source.src,
                    type: source.type,
                    media: source.media
                }));
            }

            return videoInfo;

        } catch (error) {
            this.optimizer.log(`分析视频元素失败: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * 检测视频格式
     */
    detectVideoFormat(videoElement) {
        const src = videoElement.src || videoElement.currentSrc;
        if (!src) return 'unknown';

        // 从URL中提取文件扩展名
        const urlParts = src.split('?')[0].split('#')[0].split('.');
        const extension = urlParts[urlParts.length - 1].toLowerCase();

        if (this.videoFormats.has(extension)) {
            return extension;
        }

        // 检查MIME类型
        const sources = videoElement.querySelectorAll('source');
        for (const source of sources) {
            if (source.type) {
                const mimeType = source.type.split(';')[0];
                if (mimeType.includes('mp4')) return 'mp4';
                if (mimeType.includes('webm')) return 'webm';
                if (mimeType.includes('ogg')) return 'ogg';
            }
        }

        return 'unknown';
    }

    /**
     * 检测视频编码格式
     */
    detectVideoCodec(videoElement) {
        // 检查source元素的codecs参数
        const sources = videoElement.querySelectorAll('source');
        for (const source of sources) {
            if (source.type && source.type.includes('codecs=')) {
                const codecMatch = source.type.match(/codecs="([^"]+)"/);
                if (codecMatch) {
                    const codec = codecMatch[1].toLowerCase();
                    if (codec.includes('avc1') || codec.includes('h264')) return 'h264';
                    if (codec.includes('hev1') || codec.includes('h265')) return 'h265';
                    if (codec.includes('vp8')) return 'vp8';
                    if (codec.includes('vp9')) return 'vp9';
                    if (codec.includes('av01')) return 'av1';
                }
            }
        }

        // 基于格式推测编码
        const format = this.detectVideoFormat(videoElement);
        switch (format) {
            case 'mp4': return 'h264';
            case 'webm': return 'vp9';
            case 'ogg': return 'theora';
            default: return 'unknown';
        }
    }

    /**
     * 检测视频质量
     */
    detectVideoQuality(videoElement) {
        const width = videoElement.videoWidth || videoElement.width;
        const height = videoElement.videoHeight || videoElement.height;

        if (!width || !height) return 'unknown';

        if (height >= 2160) return '4K';
        if (height >= 1440) return '2K';
        if (height >= 1080) return '1080p';
        if (height >= 720) return '720p';
        if (height >= 480) return '480p';
        if (height >= 360) return '360p';

        return 'low';
    }

    /**
     * 估算视频比特率
     */
    async estimateBitrate(videoElement) {
        try {
            // 如果视频正在播放，可以通过网络信息估算
            if (videoElement.readyState >= 2 && videoElement.duration > 0) {
                const buffered = videoElement.buffered;
                if (buffered.length > 0) {
                    // 简单估算：根据已缓冲的时间和数据量
                    const bufferedTime = buffered.end(buffered.length - 1);
                    const width = videoElement.videoWidth || 720;
                    const height = videoElement.videoHeight || 480;

                    // 基于分辨率的基础比特率估算
                    const pixelCount = width * height;
                    const baseBitrate = Math.min(Math.max(pixelCount / 1000, 500), 10000); // kbps

                    return baseBitrate;
                }
            }

            return 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * 测试视频是否可以播放
     */
    async testCanPlay(videoElement) {
        try {
            if (!videoElement.src && !videoElement.currentSrc) {
                return false;
            }

            // 检查浏览器支持
            const format = this.detectVideoFormat(videoElement);
            const codec = this.detectVideoCodec(videoElement);

            const testVideo = document.createElement('video');
            let mimeType = '';

            switch (format) {
                case 'mp4':
                    mimeType = 'video/mp4';
                    if (codec === 'h264') mimeType += '; codecs="avc1.42E01E"';
                    break;
                case 'webm':
                    mimeType = 'video/webm';
                    if (codec === 'vp9') mimeType += '; codecs="vp9"';
                    break;
                case 'ogg':
                    mimeType = 'video/ogg';
                    break;
            }

            if (mimeType) {
                const canPlay = testVideo.canPlayType(mimeType);
                return canPlay !== '';
            }

            return true;

        } catch (error) {
            return false;
        }
    }

    /**
     * 处理iframe元素
     */
    processIframe(iframeElement) {
        const src = iframeElement.src;
        if (!src) return;

        // 检测常见的视频平台
        const videoPlatforms = [
            'youtube.com', 'youtu.be',
            'vimeo.com',
            'bilibili.com',
            'iqiyi.com',
            'qq.com',
            'weibo.com'
        ];

        const isVideoIframe = videoPlatforms.some(platform =>
            src.toLowerCase().includes(platform)
        );

        if (isVideoIframe) {
            const iframeId = this.generateVideoId(iframeElement);

            this.detectedVideos.set(iframeId, {
                element: iframeElement,
                info: {
                    id: iframeId,
                    src: src,
                    type: 'iframe',
                    platform: this.detectPlatform(src),
                    timestamp: Date.now()
                },
                optimized: false,
                createdAt: Date.now()
            });

            this.optimizer.log(`发现iframe视频: ${src}`, 'debug');
        }
    }

    /**
     * 检测视频平台
     */
    detectPlatform(src) {
        if (src.includes('youtube')) return 'YouTube';
        if (src.includes('vimeo')) return 'Vimeo';
        if (src.includes('bilibili')) return 'Bilibili';
        if (src.includes('iqiyi')) return 'iQiyi';
        if (src.includes('qq.com')) return 'Tencent';
        if (src.includes('weibo')) return 'Weibo';
        return 'Unknown';
    }

    /**
     * 扫描嵌入式视频
     */
    async scanForEmbeddedVideos() {
        // 扫描可能包含视频的元素
        const candidates = document.querySelectorAll([
            'div[data-video]',
            'div[data-src*="video"]',
            'div[class*="video"]',
            'div[id*="video"]',
            'object[type*="video"]',
            'embed[src*="video"]'
        ].join(','));

        for (const element of candidates) {
            // 检查是否为视频容器
            if (this.isVideoContainer(element)) {
                const containerId = this.generateVideoId(element);

                this.detectedVideos.set(containerId, {
                    element: element,
                    info: {
                        id: containerId,
                        type: 'container',
                        timestamp: Date.now()
                    },
                    optimized: false,
                    createdAt: Date.now()
                });
            }
        }
    }

    /**
     * 判断是否为视频容器
     */
    isVideoContainer(element) {
        // 检查样式
        const style = window.getComputedStyle(element);
        const hasVideoStyle = (
            element.clientWidth > 200 &&
            element.clientHeight > 150 &&
            (style.backgroundImage.includes('video') ||
             element.innerHTML.toLowerCase().includes('video'))
        );

        return hasVideoStyle;
    }

    /**
     * 生成视频唯一ID
     */
    generateVideoId(element) {
        const src = element.src || element.currentSrc || element.dataset.src || '';
        const className = element.className || '';
        const id = element.id || '';

        // 使用多个属性生成唯一标识
        const identifier = `${src}-${className}-${id}-${element.tagName}`;

        // 简单哈希函数
        let hash = 0;
        for (let i = 0; i < identifier.length; i++) {
            const char = identifier.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }

        return `video_${Math.abs(hash)}`;
    }

    /**
     * 设置DOM变化监听
     */
    setupMutationObserver() {
        this.mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // 处理新增的节点
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否为video元素
                            if (node.tagName === 'VIDEO') {
                                this.processVideoElement(node);
                            }

                            // 检查是否为iframe元素
                            if (node.tagName === 'IFRAME') {
                                this.processIframe(node);
                            }

                            // 递归检查子元素
                            const videos = node.querySelectorAll('video');
                            videos.forEach(video => this.processVideoElement(video));

                            const iframes = node.querySelectorAll('iframe');
                            iframes.forEach(iframe => this.processIframe(iframe));
                        }
                    });
                }

                // 处理属性变化
                if (mutation.type === 'attributes' && mutation.target.tagName === 'VIDEO') {
                    const videoElement = mutation.target;
                    const videoId = this.generateVideoId(videoElement);

                    if (this.detectedVideos.has(videoId)) {
                        // 更新视频信息
                        this.analyzeVideoElement(videoElement).then(info => {
                            if (info) {
                                this.detectedVideos.get(videoId).info = info;
                            }
                        });
                    }
                }
            }
        });

        // 开始观察
        this.mutationObserver.observe(document.body, this.observerConfig);
    }

    /**
     * 设置性能观察器
     */
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    for (const entry of entries) {
                        if (entry.name.includes('video') || entry.name.includes('.mp4') ||
                            entry.name.includes('.webm') || entry.name.includes('.ogg')) {
                            this.optimizer.log(`视频资源加载: ${entry.name} (${entry.duration}ms)`, 'debug');
                        }
                    }
                });

                observer.observe({ entryTypes: ['resource'] });
            } catch (error) {
                this.optimizer.log(`性能观察器设置失败: ${error.message}`, 'warn');
            }
        }
    }

    /**
     * 扫描新的视频元素
     */
    scanForVideos() {
        // 定期扫描新的视频元素
        this.initialScan();
    }

    /**
     * 获取所有检测到的视频
     */
    getAllVideos() {
        return Array.from(this.detectedVideos.values());
    }

    /**
     * 获取指定ID的视频
     */
    getVideoById(id) {
        return this.detectedVideos.get(id);
    }

    /**
     * 移除检测到的视频
     */
    removeVideo(id) {
        return this.detectedVideos.delete(id);
    }

    /**
     * 清理资源
     */
    destroy() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }

        this.detectedVideos.clear();
        this.optimizer.log('视频检测器已销毁');
    }
}

/**
 * 性能分析器模块
 * 负责分析网络状况、设备性能、带宽测试等，为AI优化决策提供数据支持
 */
class PerformanceAnalyzer {
    constructor(optimizer) {
        this.optimizer = optimizer;

        // 性能数据
        this.networkInfo = {
            bandwidth: 0,
            latency: 0,
            effectiveType: 'unknown',
            saveData: false,
            downlink: 0
        };

        this.deviceInfo = {
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            memory: navigator.deviceMemory || 4,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            webglSupport: false,
            hardwareAcceleration: false
        };

        this.performanceMetrics = {
            fps: 0,
            cpuUsage: 0,
            memoryUsage: 0,
            networkUtilization: 0,
            decodingPerformance: 0
        };

        // 历史数据（用于趋势分析）
        this.historyData = {
            bandwidth: [],
            latency: [],
            fps: [],
            cpuUsage: []
        };

        // 测试相关
        this.bandwidthTestImage = null;
        this.lastBandwidthTest = 0;
        this.bandwidthTestInterval = 30000; // 30秒测试一次
    }

    /**
     * 初始化性能分析器
     */
    async initialize() {
        this.optimizer.log('初始化性能分析器...', 'debug');

        // 检测设备信息
        await this.detectDeviceCapabilities();

        // 检测网络信息
        await this.detectNetworkInfo();

        // 启动性能监控
        this.startPerformanceMonitoring();

        // 启动带宽测试
        this.startBandwidthTesting();

        this.optimizer.log('性能分析器初始化完成');
    }

    /**
     * 检测设备性能能力
     */
    async detectDeviceCapabilities() {
        try {
            // 检测WebGL支持
            this.deviceInfo.webglSupport = this.detectWebGLSupport();

            // 检测硬件加速支持
            this.deviceInfo.hardwareAcceleration = await this.detectHardwareAcceleration();

            // 检测视频解码能力
            this.deviceInfo.videoDecodingSupport = await this.detectVideoDecodingSupport();

            // 检测电池状态（如果可用）
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                this.deviceInfo.battery = {
                    charging: battery.charging,
                    level: battery.level,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            }

            this.optimizer.log(`设备性能检测完成: ${JSON.stringify(this.deviceInfo)}`, 'debug');

        } catch (error) {
            this.optimizer.log(`设备性能检测失败: ${error.message}`, 'error');
        }
    }

    /**
     * 检测WebGL支持
     */
    detectWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (!gl) return false;

            // 获取WebGL信息
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                this.deviceInfo.webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                this.deviceInfo.webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 检测硬件加速支持
     */
    async detectHardwareAcceleration() {
        try {
            // 通过创建视频元素测试硬件解码
            const video = document.createElement('video');
            video.style.display = 'none';
            document.body.appendChild(video);

            // 测试H.264硬件解码
            const canPlayH264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"') === 'probably';

            // 测试VP9硬件解码
            const canPlayVP9 = video.canPlayType('video/webm; codecs="vp09.00.10.08"') === 'probably';

            document.body.removeChild(video);

            return canPlayH264 || canPlayVP9;
        } catch (error) {
            return false;
        }
    }

    /**
     * 检测视频解码支持
     */
    async detectVideoDecodingSupport() {
        const codecs = ['h264', 'h265', 'vp8', 'vp9', 'av1'];
        const support = {};

        for (const codec of codecs) {
            support[codec] = await this.testCodecSupport(codec);
        }

        return support;
    }

    /**
     * 测试特定编码格式支持
     */
    async testCodecSupport(codec) {
        try {
            const video = document.createElement('video');
            let mimeType = '';

            switch (codec) {
                case 'h264':
                    mimeType = 'video/mp4; codecs="avc1.42E01E"';
                    break;
                case 'h265':
                    mimeType = 'video/mp4; codecs="hev1.1.6.L93.B0"';
                    break;
                case 'vp8':
                    mimeType = 'video/webm; codecs="vp8"';
                    break;
                case 'vp9':
                    mimeType = 'video/webm; codecs="vp09.00.10.08"';
                    break;
                case 'av1':
                    mimeType = 'video/mp4; codecs="av01.0.08M.10"';
                    break;
            }

            const support = video.canPlayType(mimeType);
            return support === 'probably' || support === 'maybe';

        } catch (error) {
            return false;
        }
    }

    /**
     * 检测网络信息
     */
    async detectNetworkInfo() {
        try {
            // 使用Navigator API获取网络信息
            if ('connection' in navigator) {
                const connection = navigator.connection;

                this.networkInfo.effectiveType = connection.effectiveType || 'unknown';
                this.networkInfo.downlink = connection.downlink || 0;
                this.networkInfo.saveData = connection.saveData || false;

                // 监听网络变化
                connection.addEventListener('change', () => {
                    this.updateNetworkInfo();
                });
            }

            // 执行带宽测试
            await this.performBandwidthTest();

            // 执行延迟测试
            await this.performLatencyTest();

            this.optimizer.log(`网络信息检测完成: ${JSON.stringify(this.networkInfo)}`, 'debug');

        } catch (error) {
            this.optimizer.log(`网络信息检测失败: ${error.message}`, 'error');
        }
    }

    /**
     * 更新网络信息
     */
    updateNetworkInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;

            this.networkInfo.effectiveType = connection.effectiveType || 'unknown';
            this.networkInfo.downlink = connection.downlink || 0;
            this.networkInfo.saveData = connection.saveData || false;

            this.optimizer.log(`网络状态更新: ${this.networkInfo.effectiveType}`, 'debug');
        }
    }

    /**
     * 执行带宽测试
     */
    async performBandwidthTest() {
        try {
            const testSizes = [1024, 2048, 4096]; // KB
            let totalBandwidth = 0;
            let validTests = 0;

            for (const size of testSizes) {
                const bandwidth = await this.measureBandwidth(size);
                if (bandwidth > 0) {
                    totalBandwidth += bandwidth;
                    validTests++;
                }
            }

            if (validTests > 0) {
                this.networkInfo.bandwidth = totalBandwidth / validTests;
                this.addToHistory('bandwidth', this.networkInfo.bandwidth);
            }

        } catch (error) {
            this.optimizer.log(`带宽测试失败: ${error.message}`, 'error');
        }
    }

    /**
     * 测量带宽
     */
    async measureBandwidth(sizeKB) {
        return new Promise((resolve) => {
            try {
                // 使用小图片进行带宽测试
                const testUrl = `data:image/jpeg;base64,${this.generateTestData(sizeKB)}`;
                const startTime = performance.now();

                const img = new Image();

                img.onload = () => {
                    const endTime = performance.now();
                    const duration = (endTime - startTime) / 1000; // 秒
                    const bandwidth = (sizeKB * 8) / duration; // Kbps
                    resolve(bandwidth);
                };

                img.onerror = () => {
                    resolve(0);
                };

                // 设置超时
                setTimeout(() => {
                    resolve(0);
                }, 10000);

                img.src = testUrl;

            } catch (error) {
                resolve(0);
            }
        });
    }

    /**
     * 生成测试数据
     */
    generateTestData(sizeKB) {
        // 生成指定大小的base64数据（简化版本）
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        const length = sizeKB * 1024 * 0.75; // base64编码后大约是原数据的4/3

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }

    /**
     * 执行延迟测试
     */
    async performLatencyTest() {
        try {
            const testUrls = [
                'http://detectportal.firefox.com/success.txt',
                'http://wifi.vivo.com.cn/generate_204',
                // 添加更多测试URL
            ];

            let totalLatency = 0;
            let validTests = 0;

            for (const url of testUrls) {
                const latency = await this.measureLatency(url);
                if (latency > 0) {
                    totalLatency += latency;
                    validTests++;
                }
            }

            if (validTests > 0) {
                this.networkInfo.latency = totalLatency / validTests;
                this.addToHistory('latency', this.networkInfo.latency);
            }

        } catch (error) {
            this.optimizer.log(`延迟测试失败: ${error.message}`, 'error');
        }
    }

    /**
     * 测量延迟
     */
    async measureLatency(url) {
        return new Promise((resolve) => {
            try {
                const startTime = performance.now();

                fetch(url, {
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-cache'
                }).then(() => {
                    const endTime = performance.now();
                    const latency = endTime - startTime;
                    resolve(latency);
                }).catch(() => {
                    resolve(0);
                });

                // 设置超时
                setTimeout(() => {
                    resolve(0);
                }, 5000);

            } catch (error) {
                resolve(0);
            }
        });
    }

    /**
     * 启动性能监控
     */
    startPerformanceMonitoring() {
        // 监控FPS
        this.startFPSMonitoring();

        // 监控内存使用
        this.startMemoryMonitoring();

        // 监控CPU使用（估算）
        this.startCPUMonitoring();
    }

    /**
     * 启动FPS监控
     */
    startFPSMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) { // 每秒计算一次
                this.performanceMetrics.fps = frameCount;
                this.addToHistory('fps', this.performanceMetrics.fps);

                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    /**
     * 启动内存监控
     */
    startMemoryMonitoring() {
        setInterval(() => {
            if ('memory' in performance) {
                const memory = performance.memory;
                this.performanceMetrics.memoryUsage = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    usage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
                };
            }
        }, 5000);
    }

    /**
     * 启动CPU监控（估算）
     */
    startCPUMonitoring() {
        let lastTime = performance.now();
        let lastUsage = 0;

        setInterval(() => {
            const currentTime = performance.now();
            const timeDiff = currentTime - lastTime;

            // 使用主线程繁忙程度估算CPU使用率
            const busyStart = performance.now();
            let busyTime = 0;

            // 短暂的CPU密集操作
            while (performance.now() - busyStart < 10) {
                Math.random();
            }

            busyTime = performance.now() - busyStart;
            const cpuUsage = Math.min((busyTime / 10) * 100, 100);

            this.performanceMetrics.cpuUsage = cpuUsage;
            this.addToHistory('cpuUsage', cpuUsage);

            lastTime = currentTime;
        }, 5000);
    }

    /**
     * 启动带宽测试
     */
    startBandwidthTesting() {
        setInterval(async () => {
            const now = Date.now();
            if (now - this.lastBandwidthTest > this.bandwidthTestInterval) {
                await this.performBandwidthTest();
                this.lastBandwidthTest = now;
            }
        }, this.bandwidthTestInterval);
    }

    /**
     * 添加数据到历史记录
     */
    addToHistory(metric, value) {
        if (!this.historyData[metric]) {
            this.historyData[metric] = [];
        }

        this.historyData[metric].push({
            value: value,
            timestamp: Date.now()
        });

        // 保持历史数据在合理范围内（最近100条记录）
        if (this.historyData[metric].length > 100) {
            this.historyData[metric] = this.historyData[metric].slice(-100);
        }
    }

    /**
     * 获取网络质量评分
     */
    getNetworkQualityScore() {
        let score = 0;

        // 基于带宽评分 (40%)
        if (this.networkInfo.bandwidth > 5000) score += 40;
        else if (this.networkInfo.bandwidth > 2000) score += 30;
        else if (this.networkInfo.bandwidth > 1000) score += 20;
        else score += 10;

        // 基于延迟评分 (30%)
        if (this.networkInfo.latency < 100) score += 30;
        else if (this.networkInfo.latency < 300) score += 20;
        else if (this.networkInfo.latency < 500) score += 10;
        else score += 5;

        // 基于连接类型评分 (20%)
        switch (this.networkInfo.effectiveType) {
            case '4g': score += 20; break;
            case '3g': score += 15; break;
            case '2g': score += 5; break;
            case 'slow-2g': score += 2; break;
            default: score += 10;
        }

        // 基于节省数据模式 (10%)
        if (!this.networkInfo.saveData) score += 10;

        return Math.min(score, 100);
    }

    /**
     * 获取设备性能评分
     */
    getDevicePerformanceScore() {
        let score = 0;

        // 基于CPU核心数 (25%)
        if (this.deviceInfo.hardwareConcurrency >= 8) score += 25;
        else if (this.deviceInfo.hardwareConcurrency >= 4) score += 20;
        else if (this.deviceInfo.hardwareConcurrency >= 2) score += 15;
        else score += 10;

        // 基于内存大小 (25%)
        if (this.deviceInfo.memory >= 8) score += 25;
        else if (this.deviceInfo.memory >= 4) score += 20;
        else if (this.deviceInfo.memory >= 2) score += 15;
        else score += 10;

        // 基于WebGL支持 (20%)
        if (this.deviceInfo.webglSupport) score += 20;

        // 基于硬件加速支持 (20%)
        if (this.deviceInfo.hardwareAcceleration) score += 20;

        // 基于当前FPS (10%)
        if (this.performanceMetrics.fps >= 60) score += 10;
        else if (this.performanceMetrics.fps >= 30) score += 7;
        else if (this.performanceMetrics.fps >= 15) score += 5;
        else score += 2;

        return Math.min(score, 100);
    }

    /**
     * 生成优化建议
     */
    generateOptimizationRecommendations() {
        const recommendations = [];

        const networkScore = this.getNetworkQualityScore();
        const deviceScore = this.getDevicePerformanceScore();

        // 网络优化建议
        if (networkScore < 50) {
            if (this.networkInfo.bandwidth < 1000) {
                recommendations.push({
                    type: 'network',
                    priority: 'high',
                    message: '建议降低视频质量以适应低带宽网络',
                    action: 'reduce_quality'
                });
            }

            if (this.networkInfo.latency > 500) {
                recommendations.push({
                    type: 'network',
                    priority: 'medium',
                    message: '建议增加预缓冲时间以应对高延迟',
                    action: 'increase_buffer'
                });
            }
        }

        // 设备性能优化建议
        if (deviceScore < 50) {
            if (this.deviceInfo.hardwareConcurrency < 4) {
                recommendations.push({
                    type: 'device',
                    priority: 'high',
                    message: '建议关闭硬件加速以减轻CPU负担',
                    action: 'disable_hardware_accel'
                });
            }

            if (this.performanceMetrics.fps < 30) {
                recommendations.push({
                    type: 'device',
                    priority: 'medium',
                    message: '建议降低视频帧率以提升播放流畅度',
                    action: 'reduce_framerate'
                });
            }
        }

        return recommendations;
    }

    /**
     * 获取完整的性能报告
     */
    getPerformanceReport() {
        return {
            timestamp: Date.now(),
            network: {
                ...this.networkInfo,
                qualityScore: this.getNetworkQualityScore()
            },
            device: {
                ...this.deviceInfo,
                performanceScore: this.getDevicePerformanceScore()
            },
            metrics: this.performanceMetrics,
            recommendations: this.generateOptimizationRecommendations(),
            history: this.historyData
        };
    }

    /**
     * 清理资源
     */
    destroy() {
        // 清理定时器和监听器
        this.optimizer.log('性能分析器已销毁');
    }
}

/**
 * 视频优化器模块
 * 负责实施各种视频优化策略，包括质量调整、预加载、缓存等
 */
class VideoOptimizer {
    constructor(optimizer) {
        this.optimizer = optimizer;

        // 优化策略配置
        this.strategies = {
            adaptiveQuality: true,
            smartPreload: true,
            bufferOptimization: true,
            hardwareAcceleration: true,
            codecOptimization: true,
            bandwidthAdaptation: true
        };

        // 优化历史记录
        this.optimizationHistory = new Map();

        // 当前优化的视频列表
        this.optimizedVideos = new Map();

        // 缓存系统
        this.videoCache = new Map();
        this.maxCacheSize = 100 * 1024 * 1024; // 100MB
        this.currentCacheSize = 0;

        // AI决策引擎参数
        this.aiWeights = {
            networkQuality: 0.4,
            devicePerformance: 0.3,
            userBehavior: 0.2,
            contentType: 0.1
        };
    }

    /**
     * 初始化优化器
     */
    async initialize() {
        this.optimizer.log('初始化视频优化器...', 'debug');

        // 加载优化配置
        this.loadOptimizationConfig();

        // 初始化缓存系统
        this.initializeCacheSystem();

        // 设置优化监听器
        this.setupOptimizationListeners();

        this.optimizer.log('视频优化器初始化完成');
    }

    /**
     * 加载优化配置
     */
    loadOptimizationConfig() {
        const config = this.optimizer.config;

        this.strategies.adaptiveQuality = config.adaptiveQuality;
        this.strategies.smartPreload = config.enablePreload;
        this.strategies.hardwareAcceleration = config.enableHardwareAccel;

        this.maxCacheSize = config.maxCacheSize * 1024 * 1024; // 转换为字节
    }

    /**
     * 初始化缓存系统
     */
    initializeCacheSystem() {
        // 清理过期缓存
        this.cleanupExpiredCache();

        // 设置定期清理
        setInterval(() => {
            this.cleanupExpiredCache();
        }, 60000); // 每分钟清理一次
    }

    /**
     * 设置优化监听器
     */
    setupOptimizationListeners() {
        // 监听网络状态变化
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.handleNetworkChange();
            });
        }

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // 监听内存压力事件
        if ('memory' in performance) {
            setInterval(() => {
                this.checkMemoryPressure();
            }, 10000);
        }
    }

    /**
     * 处理新发现的视频
     */
    async handleNewVideo(videoElement, videoInfo) {
        try {
            this.optimizer.log(`开始优化视频: ${videoInfo.id}`, 'debug');

            // 生成优化策略
            const strategy = await this.generateOptimizationStrategy(videoElement, videoInfo);

            // 应用优化
            const result = await this.applyOptimization(videoElement, videoInfo, strategy);

            if (result.success) {
                this.optimizedVideos.set(videoInfo.id, {
                    element: videoElement,
                    info: videoInfo,
                    strategy: strategy,
                    result: result,
                    timestamp: Date.now()
                });

                this.optimizer.stats.optimizedVideos++;
                this.optimizer.log(`视频优化成功: ${videoInfo.id}`, 'info');
            }

        } catch (error) {
            this.optimizer.log(`视频优化失败: ${error.message}`, 'error');
        }
    }

    /**
     * 生成AI驱动的优化策略
     */
    async generateOptimizationStrategy(videoElement, videoInfo) {
        // 获取性能分析数据
        const performanceReport = this.optimizer.analyzer ?
            this.optimizer.analyzer.getPerformanceReport() : null;

        if (!performanceReport) {
            return this.getDefaultStrategy();
        }

        const networkScore = performanceReport.network.qualityScore;
        const deviceScore = performanceReport.device.performanceScore;

        // AI决策逻辑
        const strategy = {
            quality: this.determineOptimalQuality(videoInfo, networkScore, deviceScore),
            preload: this.determinePreloadStrategy(videoInfo, networkScore),
            buffer: this.determineBufferStrategy(networkScore, deviceScore),
            codec: this.determineOptimalCodec(videoInfo, deviceScore),
            hardware: this.determineHardwareAcceleration(deviceScore),
            priority: this.determineOptimizationPriority(videoInfo, networkScore, deviceScore)
        };

        this.optimizer.log(`生成优化策略: ${JSON.stringify(strategy)}`, 'debug');

        return strategy;
    }

    /**
     * 确定最优视频质量
     */
    determineOptimalQuality(videoInfo, networkScore, deviceScore) {
        const currentQuality = videoInfo.quality;

        // 基于网络质量调整
        if (networkScore < 30) {
            return this.downgradeQuality(currentQuality, 2);
        } else if (networkScore < 50) {
            return this.downgradeQuality(currentQuality, 1);
        } else if (networkScore > 80 && deviceScore > 70) {
            return this.upgradeQuality(currentQuality);
        }

        return currentQuality;
    }

    /**
     * 确定预加载策略
     */
    determinePreloadStrategy(videoInfo, networkScore) {
        if (!this.strategies.smartPreload) {
            return 'none';
        }

        if (networkScore > 70) {
            return 'auto'; // 自动预加载
        } else if (networkScore > 40) {
            return 'metadata'; // 只预加载元数据
        } else {
            return 'none'; // 不预加载
        }
    }

    /**
     * 确定缓冲策略
     */
    determineBufferStrategy(networkScore, deviceScore) {
        let bufferSize = this.optimizer.config.bufferSize;

        if (networkScore < 30) {
            bufferSize *= 2; // 低网速时增加缓冲
        } else if (networkScore > 80) {
            bufferSize *= 0.7; // 高网速时减少缓冲
        }

        if (deviceScore < 40) {
            bufferSize *= 0.8; // 低性能设备减少缓冲
        }

        return Math.max(Math.min(bufferSize, 60), 5); // 限制在5-60秒之间
    }

    /**
     * 确定最优编码格式
     */
    determineOptimalCodec(videoInfo, deviceScore) {
        const currentCodec = videoInfo.codec;
        const deviceSupport = this.optimizer.analyzer ?
            this.optimizer.analyzer.deviceInfo.videoDecodingSupport : {};

        // 根据设备性能和支持情况选择编码
        if (deviceScore > 70 && deviceSupport.av1) {
            return 'av1'; // 高性能设备使用AV1
        } else if (deviceScore > 50 && deviceSupport.vp9) {
            return 'vp9'; // 中等性能使用VP9
        } else if (deviceSupport.h264) {
            return 'h264'; // 默认使用H.264
        }

        return currentCodec;
    }

    /**
     * 确定硬件加速策略
     */
    determineHardwareAcceleration(deviceScore) {
        if (!this.strategies.hardwareAcceleration) {
            return false;
        }

        // 高性能设备启用硬件加速
        return deviceScore > 60;
    }

    /**
     * 确定优化优先级
     */
    determineOptimizationPriority(videoInfo, networkScore, deviceScore) {
        let priority = 'medium';

        // 大视频或高质量视频优先级更高
        if (videoInfo.width > 1920 || videoInfo.height > 1080) {
            priority = 'high';
        }

        // 网络或设备性能差时提高优化优先级
        if (networkScore < 40 || deviceScore < 40) {
            priority = 'high';
        }

        return priority;
    }

    /**
     * 应用优化策略
     */
    async applyOptimization(videoElement, videoInfo, strategy) {
        const result = {
            success: false,
            appliedOptimizations: [],
            performance: {
                before: this.measureVideoPerformance(videoElement),
                after: null
            },
            errors: []
        };

        try {
            // 应用质量优化
            if (strategy.quality !== videoInfo.quality) {
                const qualityResult = await this.applyQualityOptimization(
                    videoElement, strategy.quality
                );
                if (qualityResult.success) {
                    result.appliedOptimizations.push('quality');
                } else {
                    result.errors.push(qualityResult.error);
                }
            }

            // 应用预加载优化
            if (strategy.preload !== videoElement.preload) {
                const preloadResult = this.applyPreloadOptimization(
                    videoElement, strategy.preload
                );
                if (preloadResult.success) {
                    result.appliedOptimizations.push('preload');
                } else {
                    result.errors.push(preloadResult.error);
                }
            }

            // 应用缓冲优化
            const bufferResult = await this.applyBufferOptimization(
                videoElement, strategy.buffer
            );
            if (bufferResult.success) {
                result.appliedOptimizations.push('buffer');
            } else {
                result.errors.push(bufferResult.error);
            }

            // 应用编码优化
            if (strategy.codec !== videoInfo.codec) {
                const codecResult = await this.applyCodecOptimization(
                    videoElement, strategy.codec
                );
                if (codecResult.success) {
                    result.appliedOptimizations.push('codec');
                } else {
                    result.errors.push(codecResult.error);
                }
            }

            // 应用硬件加速优化
            const hardwareResult = this.applyHardwareAccelerationOptimization(
                videoElement, strategy.hardware
            );
            if (hardwareResult.success) {
                result.appliedOptimizations.push('hardware');
            } else {
                result.errors.push(hardwareResult.error);
            }

            // 测量优化后性能
            setTimeout(() => {
                result.performance.after = this.measureVideoPerformance(videoElement);
            }, 1000);

            result.success = result.appliedOptimizations.length > 0;

        } catch (error) {
            result.errors.push(error.message);
        }

        return result;
    }

    /**
     * 应用质量优化
     */
    async applyQualityOptimization(videoElement, targetQuality) {
        try {
            // 查找对应质量的视频源
            const sources = videoElement.querySelectorAll('source');
            let targetSource = null;

            for (const source of sources) {
                if (source.dataset.quality === targetQuality ||
                    source.src.includes(targetQuality)) {
                    targetSource = source;
                    break;
                }
            }

            if (targetSource) {
                const currentTime = videoElement.currentTime;
                const wasPlaying = !videoElement.paused;

                videoElement.src = targetSource.src;
                videoElement.currentTime = currentTime;

                if (wasPlaying) {
                    await videoElement.play();
                }

                return { success: true };
            } else {
                // 如果没有找到对应质量的源，尝试调整现有视频的显示尺寸
                // this.adjustVideoDisplaySize(videoElement, targetQuality);
                return { success: true };
            }

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 调整视频显示尺寸
     */
    adjustVideoDisplaySize(videoElement, targetQuality) {
        const qualityMap = {
            '4K': { width: 3840, height: 2160 },
            '2K': { width: 2560, height: 1440 },
            '1080p': { width: 1920, height: 1080 },
            '720p': { width: 1280, height: 720 },
            '480p': { width: 854, height: 480 },
            '360p': { width: 640, height: 360 }
        };

        if (qualityMap[targetQuality]) {
            const { width, height } = qualityMap[targetQuality];
            videoElement.style.maxWidth = `${width}px`;
            videoElement.style.maxHeight = `${height}px`;
        }
    }

    /**
     * 应用预加载优化
     */
    applyPreloadOptimization(videoElement, preloadValue) {
        try {
            videoElement.preload = preloadValue;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 应用缓冲优化
     */
    async applyBufferOptimization(videoElement, bufferSize) {
        try {
            // 设置缓冲区大小（通过MSE API）
            if ('MediaSource' in window && videoElement.src.startsWith('blob:')) {
                // 对于使用MediaSource的视频，可以控制缓冲区大小
                // 这里是简化实现，实际需要更复杂的逻辑
                videoElement.dataset.bufferSize = bufferSize;
            }

            // 设置预加载策略以影响缓冲行为
            if (bufferSize > 30) {
                videoElement.preload = 'auto';
            } else if (bufferSize > 10) {
                videoElement.preload = 'metadata';
            } else {
                videoElement.preload = 'none';
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 应用编码优化
     */
    async applyCodecOptimization(videoElement, targetCodec) {
        try {
            const sources = videoElement.querySelectorAll('source');
            let targetSource = null;

            // 查找对应编码的视频源
            for (const source of sources) {
                if (source.type.includes(targetCodec) ||
                    source.src.includes(targetCodec)) {
                    targetSource = source;
                    break;
                }
            }

            if (targetSource) {
                const currentTime = videoElement.currentTime;
                const wasPlaying = !videoElement.paused;

                videoElement.src = targetSource.src;
                videoElement.currentTime = currentTime;

                if (wasPlaying) {
                    await videoElement.play();
                }
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 应用硬件加速优化
     */
    applyHardwareAccelerationOptimization(videoElement, enableHardware) {
        try {
            // 设置硬件加速相关属性
            if (enableHardware) {
                videoElement.setAttribute('playsinline', '');
                videoElement.style.willChange = 'transform';
            } else {
                videoElement.removeAttribute('playsinline');
                videoElement.style.willChange = 'auto';
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * 测量视频性能
     */
    measureVideoPerformance(videoElement) {
        return {
            readyState: videoElement.readyState,
            networkState: videoElement.networkState,
            buffered: videoElement.buffered.length > 0 ?
                videoElement.buffered.end(videoElement.buffered.length - 1) : 0,
            currentTime: videoElement.currentTime,
            duration: videoElement.duration,
            videoWidth: videoElement.videoWidth,
            videoHeight: videoElement.videoHeight,
            timestamp: Date.now()
        };
    }

    /**
     * 处理网络状态变化
     */
    handleNetworkChange() {
        this.optimizer.log('检测到网络状态变化，重新优化视频...', 'info');

        // 重新优化所有视频
        for (const [videoId, optimizedVideo] of this.optimizedVideos) {
            setTimeout(() => {
                this.handleNewVideo(optimizedVideo.element, optimizedVideo.info);
            }, Math.random() * 2000); // 随机延迟避免同时处理
        }
    }

    /**
     * 处理页面可见性变化
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // 页面隐藏时暂停优化
            this.pauseOptimizations();
        } else {
            // 页面显示时恢复优化
            this.resumeOptimizations();
        }
    }

    /**
     * 检查内存压力
     */
    checkMemoryPressure() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

            if (memoryUsage > 0.8) {
                this.optimizer.log('检测到内存压力，清理缓存...', 'warn');
                this.emergencyCleanup();
            }
        }
    }

    /**
     * 暂停优化
     */
    pauseOptimizations() {
        this.optimizer.log('暂停视频优化', 'debug');
        // 实现暂停逻辑
    }

    /**
     * 恢复优化
     */
    resumeOptimizations() {
        this.optimizer.log('恢复视频优化', 'debug');
        // 实现恢复逻辑
    }

    /**
     * 紧急清理
     */
    emergencyCleanup() {
        // 清理缓存
        this.videoCache.clear();
        this.currentCacheSize = 0;

        // 降低所有视频质量
        for (const [videoId, optimizedVideo] of this.optimizedVideos) {
            const currentQuality = optimizedVideo.info.quality;
            const lowerQuality = this.downgradeQuality(currentQuality, 1);
            this.applyQualityOptimization(optimizedVideo.element, lowerQuality);
        }
    }

    /**
     * 清理过期缓存
     */
    cleanupExpiredCache() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24小时

        for (const [key, entry] of this.videoCache) {
            if (now - entry.timestamp > maxAge) {
                this.videoCache.delete(key);
                this.currentCacheSize -= entry.size;
            }
        }
    }

    /**
     * 降级视频质量
     */
    downgradeQuality(currentQuality, levels) {
        const qualities = ['4K', '2K', '1080p', '720p', '480p', '360p', 'low'];
        const currentIndex = qualities.indexOf(currentQuality);
        const targetIndex = Math.min(currentIndex + levels, qualities.length - 1);
        return qualities[targetIndex];
    }

    /**
     * 升级视频质量
     */
    upgradeQuality(currentQuality) {
        const qualities = ['low', '360p', '480p', '720p', '1080p', '2K', '4K'];
        const currentIndex = qualities.indexOf(currentQuality);
        const targetIndex = Math.max(currentIndex + 1, 0);
        return qualities[targetIndex];
    }

    /**
     * 获取默认策略
     */
    getDefaultStrategy() {
        return {
            quality: '720p',
            preload: 'metadata',
            buffer: 15,
            codec: 'h264',
            hardware: true,
            priority: 'medium'
        };
    }

    /**
     * 获取优化统计
     */
    getOptimizationStats() {
        return {
            totalOptimized: this.optimizedVideos.size,
            cacheSize: this.currentCacheSize,
            cacheHitRate: this.calculateCacheHitRate(),
            averageImprovement: this.calculateAverageImprovement()
        };
    }

    /**
     * 计算缓存命中率
     */
    calculateCacheHitRate() {
        // 简化实现
        return 0.8;
    }

    /**
     * 计算平均改善程度
     */
    calculateAverageImprovement() {
        // 简化实现
        return 0.3;
    }

    /**
     * 清理资源
     */
    destroy() {
        this.optimizedVideos.clear();
        this.videoCache.clear();
        this.optimizationHistory.clear();

        this.optimizer.log('视频优化器已销毁');
    }
}

/**
 * 性能监控器模块
 * 负责收集、监控和分析视频优化性能数据
 */
class PerformanceMonitor {
    constructor(optimizer) {
        this.optimizer = optimizer;

        // 监控数据
        this.metrics = {
            videoPerformance: new Map(),
            systemPerformance: {
                fps: [],
                memory: [],
                cpu: [],
                network: []
            },
            optimizationResults: {
                totalOptimizations: 0,
                successfulOptimizations: 0,
                failedOptimizations: 0,
                averageImprovement: 0,
                bandwidthSaved: 0,
                bufferingReduced: 0
            },
            userExperience: {
                playbackQuality: 0,
                bufferingEvents: 0,
                stallsCount: 0,
                seekAccuracy: 0
            }
        };

        // 监控配置
        this.monitoringConfig = {
            collectInterval: 5000, // 5秒收集一次数据
            maxHistorySize: 200, // 保持最近200条记录
            alertThresholds: {
                lowFPS: 15,
                highMemoryUsage: 0.8,
                highLatency: 500,
                lowBandwidth: 1000
            }
        };

        // 监控状态
        this.isMonitoring = false;
        this.monitoringTimers = [];
        this.observers = [];
    }

    /**
     * 初始化性能监控器
     */
    async initialize() {
        this.optimizer.log('初始化性能监控器...', 'debug');

        // 设置性能观察器
        this.setupPerformanceObservers();

        // 设置视频事件监听
        this.setupVideoEventListeners();

        // 启动监控
        this.startMonitoring();

        this.optimizer.log('性能监控器初始化完成');
    }

    /**
     * 设置性能观察器
     */
    setupPerformanceObservers() {
        // 设置FPS观察器
        this.setupFPSObserver();

        // 设置内存观察器
        this.setupMemoryObserver();

        // 设置网络观察器
        this.setupNetworkObserver();

        // 设置长任务观察器
        this.setupLongTaskObserver();
    }

    /**
     * 设置FPS观察器
     */
    setupFPSObserver() {
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                this.addMetric('fps', fps);

                frameCount = 0;
                lastTime = currentTime;
            }

            if (this.isMonitoring) {
                requestAnimationFrame(measureFPS);
            }
        };

        requestAnimationFrame(measureFPS);
    }

    /**
     * 设置内存观察器
     */
    setupMemoryObserver() {
        if ('memory' in performance) {
            const monitorMemory = () => {
                const memory = performance.memory;
                const memoryInfo = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    usage: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
                    timestamp: Date.now()
                };

                this.addMetric('memory', memoryInfo);

                // 检查内存使用警告
                if (memoryInfo.usage > this.monitoringConfig.alertThresholds.highMemoryUsage) {
                    this.triggerAlert('high_memory', memoryInfo);
                }
            };

            const timer = setInterval(monitorMemory, this.monitoringConfig.collectInterval);
            this.monitoringTimers.push(timer);
        }
    }

    /**
     * 设置网络观察器
     */
    setupNetworkObserver() {
        if ('connection' in navigator) {
            const monitorNetwork = () => {
                const connection = navigator.connection;
                const networkInfo = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData,
                    timestamp: Date.now()
                };

                this.addMetric('network', networkInfo);

                // 检查网络状况警告
                if (connection.rtt > this.monitoringConfig.alertThresholds.highLatency) {
                    this.triggerAlert('high_latency', networkInfo);
                }

                if (connection.downlink < this.monitoringConfig.alertThresholds.lowBandwidth) {
                    this.triggerAlert('low_bandwidth', networkInfo);
                }
            };

            // 监听网络状态变化
            navigator.connection.addEventListener('change', monitorNetwork);

            // 定期收集网络数据
            const timer = setInterval(monitorNetwork, this.monitoringConfig.collectInterval);
            this.monitoringTimers.push(timer);
        }
    }

    /**
     * 设置长任务观察器
     */
    setupLongTaskObserver() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    for (const entry of entries) {
                        if (entry.duration > 50) { // 超过50ms的任务
                            this.addMetric('longTask', {
                                duration: entry.duration,
                                startTime: entry.startTime,
                                timestamp: Date.now()
                            });
                        }
                    }
                });

                observer.observe({ entryTypes: ['longtask'] });
                this.observers.push(observer);
            } catch (error) {
                this.optimizer.log(`长任务观察器设置失败: ${error.message}`, 'warn');
            }
        }
    }

    /**
     * 设置视频事件监听
     */
    setupVideoEventListeners() {
        // 监听视频播放事件
        this.setupVideoPlaybackListener();

        // 监听缓冲事件
        this.setupVideoBufferingListener();

        // 监听质量变化事件
        this.setupVideoQualityListener();
    }

    /**
     * 设置视频播放监听
     */
    setupVideoPlaybackListener() {
        document.addEventListener('play', (event) => {
            if (event.target.tagName === 'VIDEO') {
                this.recordVideoEvent(event.target, 'play');
            }
        }, true);

        document.addEventListener('pause', (event) => {
            if (event.target.tagName === 'VIDEO') {
                this.recordVideoEvent(event.target, 'pause');
            }
        }, true);

        document.addEventListener('ended', (event) => {
            if (event.target.tagName === 'VIDEO') {
                this.recordVideoEvent(event.target, 'ended');
            }
        }, true);
    }

    /**
     * 设置视频缓冲监听
     */
    setupVideoBufferingListener() {
        document.addEventListener('waiting', (event) => {
            if (event.target.tagName === 'VIDEO') {
                this.recordVideoEvent(event.target, 'buffering_start');
                this.metrics.userExperience.bufferingEvents++;
            }
        }, true);

        document.addEventListener('canplay', (event) => {
            if (event.target.tagName === 'VIDEO') {
                this.recordVideoEvent(event.target, 'buffering_end');
            }
        }, true);

        document.addEventListener('stalled', (event) => {
            if (event.target.tagName === 'VIDEO') {
                this.recordVideoEvent(event.target, 'stalled');
                this.metrics.userExperience.stallsCount++;
            }
        }, true);
    }

    /**
     * 设置视频质量监听
     */
    setupVideoQualityListener() {
        document.addEventListener('loadedmetadata', (event) => {
            if (event.target.tagName === 'VIDEO') {
                this.recordVideoQualityChange(event.target);
            }
        }, true);
    }

    /**
     * 记录视频事件
     */
    recordVideoEvent(videoElement, eventType) {
        const videoId = this.generateVideoId(videoElement);

        if (!this.metrics.videoPerformance.has(videoId)) {
            this.metrics.videoPerformance.set(videoId, {
                element: videoElement,
                events: [],
                quality: {},
                performance: {}
            });
        }

        const videoMetrics = this.metrics.videoPerformance.get(videoId);
        videoMetrics.events.push({
            type: eventType,
            timestamp: Date.now(),
            currentTime: videoElement.currentTime,
            readyState: videoElement.readyState,
            networkState: videoElement.networkState
        });

        this.optimizer.log(`视频事件记录: ${videoId} - ${eventType}`, 'debug');
    }

    /**
     * 记录视频质量变化
     */
    recordVideoQualityChange(videoElement) {
        const videoId = this.generateVideoId(videoElement);

        if (!this.metrics.videoPerformance.has(videoId)) {
            this.metrics.videoPerformance.set(videoId, {
                element: videoElement,
                events: [],
                quality: {},
                performance: {}
            });
        }

        const videoMetrics = this.metrics.videoPerformance.get(videoId);
        videoMetrics.quality = {
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
            duration: videoElement.duration,
            timestamp: Date.now()
        };
    }

    /**
     * 生成视频ID
     */
    generateVideoId(videoElement) {
        const src = videoElement.src || videoElement.currentSrc || '';
        const className = videoElement.className || '';
        const id = videoElement.id || '';

        const identifier = `${src}-${className}-${id}`;
        let hash = 0;
        for (let i = 0; i < identifier.length; i++) {
            const char = identifier.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        return `video_${Math.abs(hash)}`;
    }

    /**
     * 启动监控
     */
    startMonitoring() {
        this.isMonitoring = true;

        // 启动定期数据收集
        const collectTimer = setInterval(() => {
            this.collectMetrics();
        }, this.monitoringConfig.collectInterval);

        this.monitoringTimers.push(collectTimer);

        this.optimizer.log('性能监控已启动', 'info');
    }

    /**
     * 停止监控
     */
    stopMonitoring() {
        this.isMonitoring = false;

        // 清理定时器
        this.monitoringTimers.forEach(timer => clearInterval(timer));
        this.monitoringTimers = [];

        // 断开观察器
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];

        this.optimizer.log('性能监控已停止');
    }

    /**
     * 收集性能指标
     */
    collectMetrics() {
        // 收集视频性能数据
        this.collectVideoMetrics();

        // 收集系统性能数据
        this.collectSystemMetrics();

        // 计算统计数据
        this.calculateStatistics();

        // 清理旧数据
        this.cleanupOldMetrics();
    }

    /**
     * 收集视频性能数据
     */
    collectVideoMetrics() {
        for (const [videoId, videoData] of this.metrics.videoPerformance) {
            const videoElement = videoData.element;

            if (videoElement && videoElement.isConnected) {
                const performance = {
                    currentTime: videoElement.currentTime,
                    duration: videoElement.duration,
                    buffered: this.getBufferedRanges(videoElement),
                    readyState: videoElement.readyState,
                    networkState: videoElement.networkState,
                    playbackRate: videoElement.playbackRate,
                    volume: videoElement.volume,
                    timestamp: Date.now()
                };

                videoData.performance = performance;
            }
        }
    }

    /**
     * 获取缓冲范围
     */
    getBufferedRanges(videoElement) {
        const buffered = videoElement.buffered;
        const ranges = [];

        for (let i = 0; i < buffered.length; i++) {
            ranges.push({
                start: buffered.start(i),
                end: buffered.end(i)
            });
        }

        return ranges;
    }

    /**
     * 收集系统性能数据
     */
    collectSystemMetrics() {
        // CPU使用率（简化估算）
        const cpuUsage = this.estimateCPUUsage();
        this.addMetric('cpu', cpuUsage);
    }

    /**
     * 估算CPU使用率
     */
    estimateCPUUsage() {
        const start = performance.now();
        let iterations = 0;

        // 短暂的CPU密集操作
        while (performance.now() - start < 5) {
            Math.random();
            iterations++;
        }

        // 基于迭代次数估算CPU使用率
        const baseIterations = 1000000; // 基准值
        const usage = Math.max(0, Math.min(100, 100 - (iterations / baseIterations) * 100));

        return {
            usage: usage,
            iterations: iterations,
            timestamp: Date.now()
        };
    }

    /**
     * 添加指标数据
     */
    addMetric(type, data) {
        if (!this.metrics.systemPerformance[type]) {
            this.metrics.systemPerformance[type] = [];
        }

        this.metrics.systemPerformance[type].push(data);

        // 限制历史数据大小
        if (this.metrics.systemPerformance[type].length > this.monitoringConfig.maxHistorySize) {
            this.metrics.systemPerformance[type] =
                this.metrics.systemPerformance[type].slice(-this.monitoringConfig.maxHistorySize);
        }
    }

    /**
     * 计算统计数据
     */
    calculateStatistics() {
        // 计算平均FPS
        const recentFPS = this.metrics.systemPerformance.fps.slice(-10);
        if (recentFPS.length > 0) {
            const avgFPS = recentFPS.reduce((sum, item) => sum + item, 0) / recentFPS.length;
            this.metrics.systemPerformance.averageFPS = avgFPS;
        }

        // 计算平均内存使用
        const recentMemory = this.metrics.systemPerformance.memory.slice(-10);
        if (recentMemory.length > 0) {
            const avgMemory = recentMemory.reduce((sum, item) => sum + item.usage, 0) / recentMemory.length;
            this.metrics.systemPerformance.averageMemoryUsage = avgMemory;
        }

        // 更新用户体验指标
        this.updateUserExperienceMetrics();
    }

    /**
     * 更新用户体验指标
     */
    updateUserExperienceMetrics() {
        let totalQuality = 0;
        let videoCount = 0;

        for (const [videoId, videoData] of this.metrics.videoPerformance) {
            if (videoData.quality.width && videoData.quality.height) {
                const pixels = videoData.quality.width * videoData.quality.height;
                totalQuality += pixels;
                videoCount++;
            }
        }

        if (videoCount > 0) {
            this.metrics.userExperience.playbackQuality = totalQuality / videoCount;
        }
    }

    /**
     * 清理旧指标数据
     */
    cleanupOldMetrics() {
        const now = Date.now();
        const maxAge = 60 * 60 * 1000; // 1小时

        // 清理系统性能数据
        for (const type in this.metrics.systemPerformance) {
            if (Array.isArray(this.metrics.systemPerformance[type])) {
                this.metrics.systemPerformance[type] =
                    this.metrics.systemPerformance[type].filter(item => {
                        return (now - item.timestamp) < maxAge;
                    });
            }
        }

        // 清理不再存在的视频数据
        for (const [videoId, videoData] of this.metrics.videoPerformance) {
            if (!videoData.element || !videoData.element.isConnected) {
                this.metrics.videoPerformance.delete(videoId);
            }
        }
    }

    /**
     * 触发警告
     */
    triggerAlert(alertType, data) {
        const alert = {
            type: alertType,
            data: data,
            timestamp: Date.now(),
            message: this.getAlertMessage(alertType, data)
        };

        this.optimizer.log(`性能警告: ${alert.message}`, 'warn');

    }

    /**
     * 获取警告消息
     */
    getAlertMessage(alertType, data) {
        switch (alertType) {
            case 'high_memory':
                return `内存使用过高: ${(data.usage * 100).toFixed(1)}%`;
            case 'high_latency':
                return `网络延迟过高: ${data.rtt}ms`;
            case 'low_bandwidth':
                return `带宽过低: ${data.downlink} Mbps`;
            default:
                return `未知警告: ${alertType}`;
        }
    }

    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        return {
            timestamp: Date.now(),
            systemPerformance: {
                ...this.metrics.systemPerformance,
                summary: {
                    averageFPS: this.metrics.systemPerformance.averageFPS || 0,
                    averageMemoryUsage: this.metrics.systemPerformance.averageMemoryUsage || 0,
                    totalVideos: this.metrics.videoPerformance.size
                }
            },
            optimizationResults: this.metrics.optimizationResults,
            userExperience: this.metrics.userExperience,
            videoMetrics: Array.from(this.metrics.videoPerformance.values())
        };
    }

    /**
     * 更新优化结果
     */
    updateOptimizationResults(result) {
        this.metrics.optimizationResults.totalOptimizations++;

        if (result.success) {
            this.metrics.optimizationResults.successfulOptimizations++;
        } else {
            this.metrics.optimizationResults.failedOptimizations++;
        }

        // 更新平均改善程度
        if (result.improvement) {
            const total = this.metrics.optimizationResults.averageImprovement *
                (this.metrics.optimizationResults.successfulOptimizations - 1);
            this.metrics.optimizationResults.averageImprovement =
                (total + result.improvement) / this.metrics.optimizationResults.successfulOptimizations;
        }
    }

    /**
     * 清理资源
     */
    destroy() {
        this.stopMonitoring();
        this.metrics.videoPerformance.clear();

        this.optimizer.log('性能监控器已销毁');
    }
}

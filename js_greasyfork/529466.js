// ==UserScript==
// @name         MediaPlay 缓存优化（增强稳定版）
// @namespace    http://tampermonkey.net/
// @version      2.3.0
// @description  专注流媒体（HLS/DASH/分段MP4）的客户端缓存优化，完全基于浏览器原生能力。
// @author       KiwiFruit
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @connect      self
// @connect      cdn.jsdelivr.net
// @connect      unpkg.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529466/MediaPlay%20%E7%BC%93%E5%AD%98%E4%BC%98%E5%8C%96%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529466/MediaPlay%20%E7%BC%93%E5%AD%98%E4%BC%98%E5%8C%96%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* global tf */

    // ===================== 设计说明 =====================
    // 本脚本专注于：流媒体分片的智能缓存 + 自适应预加载 + 资源安全释放
    // 不处理：本地文件上传、视频转码、格式修复、H.265 兼容兜底
    // 理由：2025 年主流浏览器已原生支持 H.265；Mediabunny 无法解析 HLS/DASH manifest；
    //       引入转码会增加体积、CPU 开销，违背“轻量缓存优化”核心目标。

    // ===================== 配置参数 =====================
    const DEBUG_MODE = false;
    const CACHE_NAME = 'video-cache-v1';
    const MAX_CACHE_ENTRIES = 30;
    const MIN_SEGMENT_SIZE_MB = 0.5;
    const MAX_CACHE_AGE_MS = 5 * 60 * 1000; // 5分钟
    const RL_TRAINING_INTERVAL = 60 * 1000;

    const SCENE_CONFIG = {
        isFrequentSwitching: false,
        switchCacheSize: 15,
        switchRlTrainingInterval: 120000
    };

    const DEVICE_CONFIG = {
        isLowEnd: (navigator.deviceMemory && navigator.deviceMemory < 4) ||
                  (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    };

    const NETWORK_BUFFER_CONFIG = {
        '2g': 15, '3g': 25, '4g': 40, 'slow-2g': 10,
        'fast-3g': 30, 'lte': 40, '5g': 40, 'unknown': 25
    };

    // ===================== 全局状态 =====================
    let NETWORK_SPEED_CACHE = { value: 15, timestamp: 0 };
    const PROTOCOL_PARSE_CACHE = new Map();
    const ACTIVE_MANAGERS = new WeakMap();
    let cleanupIntervalId = null;

    // ===================== 工具函数 =====================
    function log(...args) { if (DEBUG_MODE) console.log('[MediaPlay]', ...args); }
    function warn(...args) { console.warn('[MediaPlay]', ...args); }
    function error(...args) { console.error('[MediaPlay]', ...args); }

    function throttle(func, wait) {
        let timeout = null;
        return function (...args) {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(this, args);
                }, wait);
            }
        };
    }

    // ===================== 网络与缓冲策略 =====================
    async function getNetworkSpeed() {
        const CACHE_DURATION = 5 * 60 * 1000;
        const now = Date.now();
        if (now - NETWORK_SPEED_CACHE.timestamp < CACHE_DURATION) {
            log('使用缓存测速结果:', NETWORK_SPEED_CACHE.value + ' Mbps');
            return NETWORK_SPEED_CACHE.value;
        }

        try {
            if (navigator.connection?.downlink) {
                const speed = navigator.connection.downlink;
                NETWORK_SPEED_CACHE = { value: speed, timestamp: now };
                return speed;
            }
        } catch (e) { /* ignore */ }

        // fallback to active test
        const testUrl = 'https://cdn.jsdelivr.net/npm/speedtest-net@1.0.0/test-1mb.bin';
        const startTime = performance.now();
        try {
            const res = await fetch(testUrl, { cache: 'no-store' });
            const blob = await res.blob();
            const duration = (performance.now() - startTime) / 1000;
            const speedMbps = (8 * blob.size) / (1024 * 1024 * duration);
            NETWORK_SPEED_CACHE = { value: speedMbps, timestamp: now };
            return speedMbps;
        } catch {
            return 15;
        }
    }

    function detectNetworkProfile() {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return (conn?.effectiveType || 'unknown').toLowerCase();
    }

    function getAdaptiveBufferDuration() {
        const type = detectNetworkProfile();
        const duration = NETWORK_BUFFER_CONFIG[type] || NETWORK_BUFFER_CONFIG.unknown;
        log('网络类型:', type, '→ 缓冲时长:', duration + 's');
        return duration;
    }

    // ===================== MIME 与协议解析 =====================
    const MIME_TYPE_MAP = {
        h264: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
        h265: 'video/mp4; codecs="hvc1.1.L93.B0"',
        av1: 'video/webm; codecs="av01.0.08M.10"',
        vp9: 'video/webm; codecs="vp9"',
        flv: 'video/flv'
    };

    class ProtocolDetector {
        static detect(url, content) {
            if (url.endsWith('.m3u8') || content.includes('#EXTM3U')) return 'hls';
            if (url.endsWith('.mpd') || content.includes('<MPD')) return 'dash';
            if (url.endsWith('.webm')) return 'webm';
            if (url.endsWith('.flv')) return 'flv';
            if (url.endsWith('.mp4') || url.includes('.m4s')) return 'mp4-segmented';
            return 'unknown';
        }
    }

    class ProtocolParser {
        static parse(url, content, mimeType) {
            const cached = PROTOCOL_PARSE_CACHE.get(url);
            if (cached && Date.now() - cached.timestamp < 300000) {
                return cached.result;
            }

            const protocol = ProtocolDetector.detect(url, content);
            let result;
            switch (protocol) {
                case 'hls': result = HLSParser.parse(url, content, mimeType); break;
                case 'dash': result = DASHParser.parse(url, content, mimeType); break;
                case 'mp4-segmented': result = MP4SegmentParser.parse(url, content, mimeType); break;
                case 'flv': result = FLVParser.parse(url, content, mimeType); break;
                case 'webm': result = WebMParser.parse(url, content, mimeType); break;
                default: throw new Error('Unsupported protocol: ' + protocol);
            }

            PROTOCOL_PARSE_CACHE.set(url, { result, timestamp: Date.now() });
            return result;
        }
    }

    // --- 各协议解析器（保持轻量，仅提取分片URL）---
    class HLSParser {
        static parse(url, content) {
            const segments = [];
            const lines = content.split('\n').filter(l => l.trim());
            let seq = 0;
            for (const line of lines) {
                if (!line.startsWith('#') && line) {
                    const segUrl = new URL(line, url).href;
                    segments.push({ url: segUrl, seq: seq++, duration: 4 });
                }
            }
            return { protocol: 'hls', segments, mimeType: MIME_TYPE_MAP.h264 };
        }
    }

    class DASHParser {
        static parse(url, content) {
            const parser = new DOMParser();
            const xml = parser.parseFromString(content, 'application/xml');
            const segments = [];
            let seq = 0;
            xml.querySelectorAll('SegmentURL').forEach(seg => {
                const media = seg.getAttribute('media');
                if (media) {
                    segments.push({ url: new URL(media, url).href, seq: seq++, duration: 4 });
                }
            });
            return { protocol: 'dash', segments, mimeType: MIME_TYPE_MAP.h264 };
        }
    }

    class MP4SegmentParser {
        static parse(url) {
            // 实际项目中应由 manifest 提供分片信息，此处仅为示意
            return {
                protocol: 'mp4-segmented',
                segments: Array.from({ length: 100 }, (_, i) => ({
                    url: `${url}?segment=${i}`,
                    seq: i,
                    duration: 4
                })),
                mimeType: MIME_TYPE_MAP.h264
            };
        }
    }

    class FLVParser {
        static parse(url) {
            return { protocol: 'flv', segments: [{ url, seq: 0, duration: 100 }], mimeType: MIME_TYPE_MAP.flv };
        }
    }

    class WebMParser {
        static parse(url) {
            return { protocol: 'webm', segments: [{ url, seq: 0, duration: 100 }], mimeType: MIME_TYPE_MAP.vp9 };
        }
    }

    // ===================== 缓存与策略引擎 =====================
    class CacheManager {
        constructor() { this.cacheMap = new Map(); }
        has(url) { return this.cacheMap.has(url); }
        get(url) {
            const entry = this.cacheMap.get(url);
            if (!entry || Date.now() - entry.timestamp > MAX_CACHE_AGE_MS) {
                this.cacheMap.delete(url);
                return null;
            }
            return entry.blob;
        }
        put(url, blob) {
            this.cacheMap.set(url, { blob, timestamp: Date.now() });
            this.limitCacheSize();
        }
        limitCacheSize() {
            const limit = SCENE_CONFIG.isFrequentSwitching ? SCENE_CONFIG.switchCacheSize : MAX_CACHE_ENTRIES;
            if (this.cacheMap.size > limit) {
                const entries = Array.from(this.cacheMap.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
                entries.slice(0, this.cacheMap.size - limit).forEach(([url]) => this.cacheMap.delete(url));
            }
        }
        clearAll() { this.cacheMap.clear(); }
    }

    class RLStrategyEngine {
        constructor() {
            this.state = { speed: 15, pauseCount: 0, stallCount: 0 };
            this.history = [];
            this.lastTrainingTime = 0;
            this.isTraining = false;
            this.model = this.buildModel();
        }
        buildModel() {
            const model = tf.sequential();
            model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [3] }));
            model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
            model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });
            return model;
        }
        async getDecision(segment) {
            const { speed, pauseCount, stallCount } = this.state;
            if (SCENE_CONFIG.isFrequentSwitching) {
                return speed > 5; // 快速决策
            }
            const input = tf.tensor2d([[speed, pauseCount, stallCount]]);
            const pred = this.model.predict(input);
            return pred.dataSync()[0] > 0.5;
        }
        async train(data) {
            if (this.isTraining || data.length < 5) return;
            this.isTraining = true;
            try {
                const interval = SCENE_CONFIG.isFrequentSwitching ? SCENE_CONFIG.switchRlTrainingInterval : RL_TRAINING_INTERVAL;
                if (Date.now() - this.lastTrainingTime < interval) return;
                const xs = tf.tensor2d(data.map(d => [d.speed, d.pauseCount, d.stallCount]));
                const ys = tf.tensor2d(data.map(d => [d.didStall ? 0 : 1]));
                await this.model.fit(xs, ys, { epochs: 3 });
                this.lastTrainingTime = Date.now();
            } finally {
                this.isTraining = false;
            }
        }
        reset() {
            this.model?.dispose();
            this.model = this.buildModel();
            this.state = { speed: 15, pauseCount: 0, stallCount: 0 };
            this.history = [];
        }
    }

    // ===================== 视频缓存管理器 =====================
    class VideoCacheManager {
        constructor(video) {
            this.video = video;
            this.mediaSource = new MediaSource();
            this.video.src = URL.createObjectURL(this.mediaSource);
            this.sourceBuffer = null;
            this.segments = [];
            this.cacheMap = new Map();
            this.pendingRequests = new Set();
            this.isInitialized = false;
            this.cacheManager = new CacheManager();
            this.rlEngine = new RLStrategyEngine();
            this.abortController = new AbortController();
            this.prefetchLoopId = null;
            this.lastActiveTime = Date.now();
            ACTIVE_MANAGERS.set(video, this);
        }

        async initializeSourceBuffer(isNewVideo = false) {
            if (this.isInitialized) return;
            try {
                const src = this.video.querySelector('source')?.src;
                if (!src) return;
                const res = await fetch(src);
                const text = await res.text();
                const parsed = ProtocolParser.parse(src, text);
                this.segments = parsed.segments;
                this.mimeType = parsed.mimeType;
                this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeType);
                this.sourceBuffer.mode = 'segments';
                this.isInitialized = true;
                this.startPrefetchLoop();
            } catch (err) {
                error('初始化失败:', err);
            }
        }

        startPrefetchLoop() {
            const prefetch = () => {
                if (!this.isInitialized || Date.now() - this.lastActiveTime > 10000) return;
                const bufferDur = getAdaptiveBufferDuration();
                const now = this.video.currentTime;
                const targetTime = now + bufferDur;
                const targetSegs = this.segments.filter(s => s.startTime <= targetTime && s.startTime >= now);
                for (const seg of targetSegs) {
                    if (!this.cacheMap.has(seg.seq) && !this.pendingRequests.has(seg.seq)) {
                        this.pendingRequests.add(seg.seq);
                        this.prefetchSegment(seg);
                    }
                }
                this.prefetchLoopId = requestIdleCallback(prefetch, { timeout: 1000 });
            };
            this.prefetchLoopId = prefetch();
        }

        async prefetchSegment(segment) {
            this.lastActiveTime = Date.now();
            const { signal } = this.abortController;
            try {
                const speed = await getNetworkSpeed();
                const decision = await this.rlEngine.getDecision(segment);
                if (!decision) {
                    this.pendingRequests.delete(segment.seq);
                    return;
                }
                const cached = await this.cacheManager.get(segment.url);
                if (cached) {
                    this.cacheMap.set(segment.seq, cached);
                    this.pendingRequests.delete(segment.seq);
                    await this.appendBufferToSourceBuffer(cached);
                    return;
                }
                const res = await fetch(segment.url, { mode: 'cors', signal });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const blob = await res.blob();
                await this.cacheManager.put(segment.url, blob);
                this.cacheMap.set(segment.seq, blob);
                this.pendingRequests.delete(segment.seq);
                await this.appendBufferToSourceBuffer(blob);
            } catch (err) {
                if (err.name !== 'AbortError') error('分片加载失败:', err);
                this.pendingRequests.delete(segment.seq);
            }
        }

        async appendBufferToSourceBuffer(blob) {
            if (!this.sourceBuffer || this.sourceBuffer.updating) return;
            try {
                const ab = await blob.arrayBuffer();
                this.sourceBuffer.appendBuffer(ab);
            } catch (err) {
                error('注入失败:', err);
            }
        }

        async destroy(isVideoSwitching = false) {
            if (!this.isInitialized) return;
            this.abortController.abort();
            this.pendingRequests.clear();
            if (this.prefetchLoopId) {
                cancelIdleCallback(this.prefetchLoopId);
                this.prefetchLoopId = null;
            }
            if (isVideoSwitching) {
                this.cacheManager.clearAll();
            }
            this.cacheMap.clear();
            try {
                if (this.mediaSource && this.sourceBuffer) {
                    this.mediaSource.removeSourceBuffer(this.sourceBuffer);
                }
                this.mediaSource?.endOfStream();
            } catch (e) { /* ignore */ }
            ACTIVE_MANAGERS.delete(this.video);
            delete this.video.dataset.videoCacheInitialized;
            this.video = null;
            this.rlEngine = null;
        }
    }

    // ===================== 视频监控与生命周期 =====================
    function monitorVideoElements() {
        let isSwitching = false;
        let switchingTimer = null;

        // 提取防抖逻辑为独立函数，避免在循环内定义函数
        function handleVideoSwitching() {
            if (switchingTimer) {
                clearTimeout(switchingTimer);
            }
            isSwitching = true;
            SCENE_CONFIG.isFrequentSwitching = true;

            switchingTimer = setTimeout(() => {
                isSwitching = false;
                setTimeout(() => {
                    if (!isSwitching) {
                        SCENE_CONFIG.isFrequentSwitching = false;
                        log('切换活动停止，恢复正常模式');
                    }
                }, 3000);
            }, 300);
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    const videos = node.tagName === 'VIDEO' ? [node] : node.querySelectorAll('video');
                    if (videos.length > 0) {
                        // 调用独立函数，不在循环内定义函数
                        handleVideoSwitching();
                        videos.forEach(handleVideoElement);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleVideoElement(video) {
        const oldManager = ACTIVE_MANAGERS.get(video);
        if (oldManager) {
            oldManager.destroy(true);
            oldManager.rlEngine.reset();
        }
        video.dataset.videoCacheInitialized = 'true';
        const src = video.querySelector('source')?.src;
        if (src && (src.endsWith('.m3u8') || src.endsWith('.mpd') || src.includes('.m4s'))) {
            const manager = new VideoCacheManager(video);
            manager.initializeSourceBuffer(true);
        }
    }

    // ===================== 初始化 =====================
    (async () => {
        log('MediaPlay 缓存优化（增强稳定版 v2.3.0）已加载');
        try {
            new CacheManager().clearAll();
            monitorVideoElements();
            document.querySelectorAll('video').forEach(handleVideoElement);
            if (DEVICE_CONFIG.isLowEnd) log('检测到低端设备');
        } catch (err) {
            error('初始化异常:', err);
        }
    })();

    window.addEventListener('beforeunload', () => {
        if (cleanupIntervalId) clearInterval(cleanupIntervalId);
    });
})();
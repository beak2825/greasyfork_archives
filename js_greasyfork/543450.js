// ==UserScript==
// @name         中国大学MOOC(慕课)功能增强 Chinese University MOOC Enhancer
// @name:zh-CN   中国大学MOOC(慕课)功能增强
// @icon         https://edu-image.nosdn.127.net/32a8dd2a-b9aa-4ec9-abd5-66cd8751befb.png?imageView&quality=100
// @namespace    https://github.com/zhumengstarsandsea/Chinese_University_MOOC_Enhancer
// @version      8.1.2
// @description  一个旨在增强中国大学MOOC的视频学习体验的油猴脚本。
// @description:zh-cn  一个旨在增强中国大学MOOC的视频学习体验的油猴脚本。
// @author       zhumengstarsandsea
// @license      AGPL-3.0-only
// @match        https://www.icourse163.org/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543450/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%28%E6%85%95%E8%AF%BE%29%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%20Chinese%20University%20MOOC%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/543450/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%28%E6%85%95%E8%AF%BE%29%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%20Chinese%20University%20MOOC%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // == SECTION 1: 全局样式注入 (CSS Injection)
    // =================================================================================
    GM_addStyle(`
        .rh-nav-button:disabled { background-color: #f0f0f0 !important; border-color: #e0e0e0 !important; color: #aaa !important; cursor: not-allowed !important; }
        body, body * { -webkit-user-select: auto !important; -moz-user-select: auto !important; -ms-user-select: auto !important; user-select: auto !important; }
        #rh-top-container { display: flex; align-items: center; margin-left: 20px; }
        #rh-top-container label { font-size: 14px; font-weight: normal; color: #000000; user-select: none; margin-right: 10px; }
        #rh-top-container input[type="number"] { width: 45px; height: 24px; border: 1px solid #000000; border-radius: 4px; background-color: #FFFFFF; color: #000000; text-align: center; font-size: 14px; -moz-appearance: textfield; }
        #rh-top-container input[type="range"] { -webkit-appearance: none; appearance: none; width: 120px; background: transparent; margin-right: 10px; padding: 5px 0; }
        #rh-top-container input[type="range"]:focus { outline: none; }
        #rh-top-container input[type="range"]::-webkit-slider-runnable-track { width: 100%; height: 6px; cursor: pointer; border-radius: 3px; border: 1px solid #ccc; }
        #rh-top-container input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #FFFFFF; border: 2px solid #27cc7e; cursor: pointer; margin-top: -7px; }
        #rh-top-container input[type="range"]::-moz-range-track { width: 100%; height: 6px; cursor: pointer; border-radius: 3px; border: 1px solid #ccc; }
        #rh-top-container input[type="range"]::-moz-range-thumb { height: 18px; width: 18px; border-radius: 50%; background: #FFFFFF; border: 2px solid #27cc7e; cursor: pointer; }
        #rh-nav-container { display: flex; align-items: center; margin-left: 15px; }
        .rh-nav-button { padding: 2px 10px; font-size: 12px; color: #333; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; margin: 0 4px; user-select: none; transition: background-color 0.2s, border-color 0.2s; }
        .rh-nav-button:hover:not(:disabled) { background-color: #e0e0e0; border-color: #999; }
        .rh-nav-button:active:not(:disabled) { background-color: #d0d0d0; }
    `);
    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'rh-slider-style';
    document.head.appendChild(sliderStyle);
    sliderStyle.innerHTML = `
        #rh-gain-slider::-webkit-slider-runnable-track { background: linear-gradient(to right, #27cc7e, #27cc7e 0%, #FFFFFF 0%) !important; }
        #rh-gain-slider::-moz-range-track { background: linear-gradient(to right, #27cc7e, #27cc7e 0%, #FFFFFF 0%) !important; }
    `;

    // =================================================================================
    // == SECTION 2: 核心功能模块 (Core Feature Modules) - v8.1.2
    // =================================================================================

    const enhancerModule = {
        namespace: window._rh || {},
        activeObservers: [], errorObserver: null,
        GAIN_STORAGE_KEY: "rh_gain_data", AUTOPLAY_STORAGE_KEY: 'rh_autoplay_state',
        BOUNDARY_CACHE_PREFIX: "rh_boundary_cache_v5_",
        isCheckingBoundary: false, lastNavigationDirection: 0,
        courseId: null, termId: null, navigationSessionId: null,

        log(message, type = 'info') {
            const style = { info: 'color: #03a9f4;', success: 'color: #27cc7e; font-weight: bold;', warn: 'color: #ffc107;', error: 'color: #dc3545; font-weight: bold;',} [type];
            console.log(`%c[全功能增强脚本 v8.1.2] ${message}`, style);
        },

        formatRemainingTime(ms) {
            if (ms <= 0) return "已过期";
            const days = Math.floor(ms / 86400000);
            const hours = Math.floor((ms % 86400000) / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            return `${days}天${hours}小时${minutes}分钟`;
        },

        getCourseId: function() { return location.pathname.match(/\/learn\/([^\?\/]+)/)?.[1] || null; },
        getTermId: function() { return new URLSearchParams(window.location.search).get('tid') || null; },

        getBoundaryCache: function(courseId, termId) {
            if (!courseId || !termId) return {};
            const key = this.BOUNDARY_CACHE_PREFIX + courseId;
            const rawData = localStorage.getItem(key);
            if (!rawData) return {};

            try {
                let courseData = JSON.parse(rawData);
                const COURSE_EXPIRY = 90 * 24 * 60 * 60 * 1000;
                const TERM_EXPIRY = 30 * 24 * 60 * 60 * 1000;
                const VIDEO_EXPIRY = 7 * 24 * 60 * 60 * 1000;
                let dataModified = false;

                if ((Date.now() - courseData.timestamp) > COURSE_EXPIRY) {
                    this.log(`[边界缓存] 课程ID ${courseId} 的整体缓存已过期(>90天)，记录于 ${new Date(courseData.timestamp).toLocaleString('zh-CN')}。缓存已清除。`, 'warn');
                    localStorage.removeItem(key);
                    return {};
                }
                this.log(`[边界缓存] 命中课程ID ${courseId} 的缓存 (剩余有效期: ${this.formatRemainingTime(COURSE_EXPIRY - (Date.now() - courseData.timestamp))})`, 'success');

                let termData = courseData.terms[termId];
                if (!termData) return {};
                if ((Date.now() - termData.timestamp) > TERM_EXPIRY) {
                    this.log(`[边界缓存] 学期ID ${termId} 的缓存已过期(>30天)，记录于 ${new Date(termData.timestamp).toLocaleString('zh-CN')}。此学期缓存已清除。`, 'warn');
                    delete courseData.terms[termId];
                    localStorage.setItem(key, JSON.stringify(courseData));
                    return {};
                }
                this.log(`[边界缓存] 命中学期ID ${termId} 的缓存 (剩余有效期: ${this.formatRemainingTime(TERM_EXPIRY - (Date.now() - termData.timestamp))})`, 'success');

                const cleanedVideos = {};
                let videosPurgedCount = 0;
                for (const videoId in termData.videos) {
                    const videoEntry = termData.videos[videoId];
                    if ((Date.now() - videoEntry.timestamp) < VIDEO_EXPIRY) {
                        cleanedVideos[videoId] = videoEntry.status;
                    } else {
                        videosPurgedCount++;
                        this.log(`[边界缓存] 视频ID ${videoId} 的缓存条目已过期(>7天)，记录于 ${new Date(videoEntry.timestamp).toLocaleString('zh-CN')}。`, 'warn');
                    }
                }

                if (videosPurgedCount > 0) {
                    const newVideoCacheForTerm = {};
                    for (const videoId in termData.videos) {
                         if (cleanedVideos[videoId]) {
                            newVideoCacheForTerm[videoId] = termData.videos[videoId];
                         }
                    }
                    courseData.terms[termId].videos = newVideoCacheForTerm;
                    dataModified = true;
                }
                if (dataModified) localStorage.setItem(key, JSON.stringify(courseData));

                return cleanedVideos;

            } catch (e) {
                this.log(`[边界缓存] 解析课程ID ${courseId} 的缓存失败，已自动清除。错误: ${e}`, 'error');
                localStorage.removeItem(key);
                return {};
            }
        },

        setBoundaryCache: function(courseId, termId, newVideoEntry) {
            if (!courseId || !termId || !newVideoEntry) return;
            const key = this.BOUNDARY_CACHE_PREFIX + courseId;
            const rawData = localStorage.getItem(key);
            let courseData;

            try {
                courseData = rawData ? JSON.parse(rawData) : { timestamp: Date.now(), terms: {} };
            } catch (e) {
                courseData = { timestamp: Date.now(), terms: {} };
            }

            courseData.timestamp = Date.now();
            if (!courseData.terms[termId]) {
                courseData.terms[termId] = { timestamp: Date.now(), videos: {} };
            } else {
                courseData.terms[termId].timestamp = Date.now();
            }

            const videoId = Object.keys(newVideoEntry)[0];
            courseData.terms[termId].videos[videoId] = {
                status: newVideoEntry[videoId],
                timestamp: Date.now()
            };
            this.log(`[边界缓存] 已更新学期 ${termId} 中视频ID ${videoId} 的状态为 "${newVideoEntry[videoId]}"`, 'success');

            localStorage.setItem(key, JSON.stringify(courseData));
        },

        clearBoundaryCaches: function() { let c = 0; Object.keys(localStorage).forEach(k => { if (k.startsWith(this.BOUNDARY_CACHE_PREFIX)) { localStorage.removeItem(k); c++; } }); return c; },
        releaseBoundaryMemory: function() { this.navigationSessionId = null; this.isCheckingBoundary = false; const i = document.querySelector('iframe[src*="sm=1"]'); if (i) { i.src = 'about:blank'; setTimeout(() => i.remove(), 0); } this.log('内存管理: 当前边界检测任务已重置。缓存数据不受影响。', 'success'); alert('边界检测内存已释放！\n\n- 当前页面的后台检测任务已终止。\n- 本地存储的边界缓存数据未被删除。'); },

        checkIdValidityWithIframe: function(videoId, sessionId) {
            return new Promise((resolve) => {
                let iframe = document.createElement('iframe');
                let popupObserver = null, muteObserver = null;
                let timeout = setTimeout(() => cleanupAndResolve(true), 12000);
                iframe.sandbox = 'allow-same-origin allow-scripts';
                iframe.style.display = 'none';
                const cleanupAndResolve = (isValid) => {
                    if (sessionId !== this.navigationSessionId) { resolve(null); return; }
                    clearTimeout(timeout);
                    if (popupObserver) popupObserver.disconnect();
                    if (muteObserver) muteObserver.disconnect();
                    if (iframe) { iframe.onload = null; iframe.src = 'about:blank'; setTimeout(() => iframe?.parentElement?.removeChild(iframe), 0); }
                    resolve({ id: videoId, status: isValid ? 'valid' : 'invalid' });
                };
                iframe.onload = () => {
                    try {
                        const iframeWin = iframe.contentWindow;
                        if (!iframeWin) throw new Error("iframe contentWindow is not accessible.");
                        iframeWin.document.querySelectorAll('video').forEach(v => { if (!v.muted) v.muted = true; });
                        muteObserver = new MutationObserver((mutations) => { mutations.forEach(mutation => mutation.addedNodes.forEach(node => { if (node.nodeType === 1) { if (node.tagName === 'VIDEO' && !node.muted) node.muted = true; else node.querySelectorAll?.('video').forEach(v => { if (!v.muted) v.muted = true; }); } })); });
                        muteObserver.observe(iframeWin.document.documentElement, { childList: true, subtree: true });
                        popupObserver = new MutationObserver(() => { if (iframeWin.document.querySelector('.m-dialog .cnt')?.textContent.includes('该课时数据不存在')) { cleanupAndResolve(false); } });
                        popupObserver.observe(iframeWin.document.documentElement, { childList: true, subtree: true });
                    } catch (e) { cleanupAndResolve(true); }
                };
                document.body.appendChild(iframe);
                iframe.src = `${location.pathname}?tid=${this.termId}#/learn/content?type=detail&id=${videoId}&sm=1`;
            });
        },

        updateNavButtonStates: function() {
            const idMatch = location.hash.match(/id=(\d+)/);
            const prevBtn = document.getElementById('rh-prev-btn');
            const nextBtn = document.getElementById('rh-next-btn');
            if (!this.courseId || !this.termId || !idMatch || !prevBtn || !nextBtn) return;
            const cache = this.getBoundaryCache(this.courseId, this.termId);
            const prevId = (parseInt(idMatch[1], 10) - 1).toString();
            const nextId = (parseInt(idMatch[1], 10) + 1).toString();
            const isPrevDisabled = cache[prevId] === 'invalid';
            const isNextDisabled = cache[nextId] === 'invalid';
            if (prevBtn.disabled !== isPrevDisabled) this.log(`[UI更新] “上一个”按钮状态 -> ${isPrevDisabled ? '禁用' : '启用'}`, 'info');
            prevBtn.disabled = isPrevDisabled; prevBtn.title = isPrevDisabled ? '已尝试过，这很可能是第一节' : '切换上一个视频 (B)';
            if (nextBtn.disabled !== isNextDisabled) this.log(`[UI更新] “下一个”按钮状态 -> ${isNextDisabled ? '禁用' : '启用'}`, 'info');
            nextBtn.disabled = isNextDisabled; nextBtn.title = isNextDisabled ? '已尝试过，这很可能是最后一节' : '切换下一个视频 (N)';
        },

        injectNavigationButtons: function(autoplayCheckbox) {
            if (document.getElementById('rh-nav-container') || !autoplayCheckbox) return;
            this.log('加载序列(3/3): [导航模块] 开始注入UI...', 'info');
            const createButton = (text, id, clickHandler) => { const button = document.createElement('button'); button.textContent = text; button.id = id; button.className = 'rh-nav-button'; button.addEventListener('click', clickHandler); return button; };
            const container = document.createElement('div'); container.id = 'rh-nav-container';
            container.appendChild(createButton('◀ 上一个', 'rh-prev-btn', () => this.navigate(-1)));
            container.appendChild(createButton('下一个 ▶', 'rh-next-btn', () => this.navigate(1)));
            const autoplayContainer = autoplayCheckbox.parentElement;
            if (autoplayContainer?.parentElement) {
                autoplayContainer.parentElement.style.display = 'flex'; autoplayContainer.parentElement.style.alignItems = 'center';
                autoplayContainer.insertAdjacentElement('afterend', container);
                this.log('加载序列(3/3): [导航模块] UI注入成功。', 'success');
                this.updateNavButtonStates();
            } else {
                 this.log('加载序列(3/3): [导航模块] 未能找到合适的UI注入点。', 'error');
            }
        },

        updateSliderFill: function(slider) { const p = ((slider.value - slider.min) / (slider.max - slider.min)) * 100; sliderStyle.innerHTML = ` #rh-gain-slider::-webkit-slider-runnable-track { background: linear-gradient(to right, #27cc7e, #27cc7e ${p}%, #FFFFFF ${p}%) !important; } #rh-gain-slider::-moz-range-track { background: linear-gradient(to right, #27cc7e, #27cc7e ${p}%, #FFFFFF ${p}%) !important; } `;},

        injectTopUI: function() {
            if (document.getElementById("rh-top-container")) return;
            const titleBar = document.querySelector('.titleBar'); if (!titleBar) return;
            const container = document.createElement('div'); container.id = 'rh-top-container'; const currentGain = parseFloat(localStorage.getItem(this.GAIN_STORAGE_KEY)) || 6.0; container.innerHTML = `<label for="rh-gain-slider">音量增益:</label><input type="range" id="rh-gain-slider" min="0" max="10" step="1" value="${Math.min(currentGain, 10)}"><input type="number" id="rh-gain-input" min="0" value="${currentGain}">`; titleBar.appendChild(container); const slider = document.getElementById('rh-gain-slider'); const input = document.getElementById('rh-gain-input');
            const updateGainHandler = (gain) => {
                if (this.namespace.audioControl) this.namespace.audioControl.amplify(gain);
                localStorage.setItem(this.GAIN_STORAGE_KEY, gain);
                this.updateSliderFill(slider);
                this.log(`[音量增益] 已调节至 ${gain}x。`);
            };
            slider.addEventListener('input', () => { input.value = slider.value; updateGainHandler(parseFloat(slider.value)); });
            input.addEventListener('change', () => { let gain = parseInt(input.value, 10); if (isNaN(gain) || gain < 0) gain = 0; input.value = gain; if (gain <= 10) slider.value = gain; updateGainHandler(gain); });
            this.updateSliderFill(slider);
        },

        amplifyMedia: function(mediaElem, multiplier) { const ctx = new(window.AudioContext || window.webkitAudioContext)(); const src = ctx.createMediaElementSource(mediaElem); const gain = ctx.createGain(); gain.gain.value = multiplier; src.connect(gain).connect(ctx.destination); this.namespace.audioControl = { amplify: (v) => { gain.gain.value = v; } }; mediaElem.addEventListener('play', () => { if (ctx.state === 'suspended') ctx.resume(); }, { once: true }); },

        initErrorDialogObserver: function() {
            if (this.errorObserver) this.errorObserver.disconnect(); this.errorObserver = new MutationObserver(mutations => { for (const m of mutations) { for (const n of m.addedNodes) { if (n.nodeType === 1 && n.querySelector?.('.m-dialog .cnt')?.textContent.includes('该课时数据不存在')) { this.errorObserver.disconnect(); this.errorObserver = null; const fIdMatch = location.hash.match(/id=(\d+)/); if (fIdMatch && this.courseId && this.termId) { const fId = fIdMatch[1]; this.setBoundaryCache(this.courseId, this.termId, {[fId]: 'invalid'}); this.log(`[错误哨兵] 检测到“数据不存在”，已将无效ID ${fId} 记录到缓存。`, 'success'); this.updateNavButtonStates(); } setTimeout(() => { this.log('[错误哨兵] 自动关闭错误弹窗并执行返回操作。', 'info'); document.querySelector('.m-dialog .j-left, .m-winmark .zcls')?.click(); this.navigate(-this.lastNavigationDirection, true); }, 150); return; } } } }); this.errorObserver.observe(document.body, { childList: true, subtree: true });
        },

        async proactiveBoundaryCheck() {
            if (this.isCheckingBoundary) return;
            this.isCheckingBoundary = true;
            const sessionId = this.navigationSessionId;
            const idMatch = location.hash.match(/id=(\d+)/);
            if (!this.courseId || !this.termId || !idMatch) { this.isCheckingBoundary = false; return; }
            this.log('加载序列(2/C): [后台边界检测] 任务启动...', 'info');

            const currentId = parseInt(idMatch[1], 10);
            const idsToCheck = [ { id: (currentId - 1).toString(), label: "上一个" }, { id: (currentId + 1).toString(), label: "下一个" } ];
            const cache = this.getBoundaryCache(this.courseId, this.termId);
            const promisesToRun = [];

            for (const item of idsToCheck) {
                if (cache[item.id] === undefined) {
                    this.log(`[边界检测] 检查 ${item.label} (ID: ${item.id}): 无缓存，启动后台iframe检测...`, 'info');
                    promisesToRun.push(this.checkIdValidityWithIframe(item.id, sessionId));
                } else {
                    this.log(`[边界检测] 检查 ${item.label} (ID: ${item.id}): 命中缓存，状态为 "${cache[item.id]}"`, 'success');
                }
            }

            if (promisesToRun.length > 0) {
                // BUG FIX: Await the promises first, *then* filter the results.
                const results = await Promise.all(promisesToRun);
                for(const result of results) {
                    if (result) { // Filter out nulls from aborted/mismatched sessions
                        this.log(`[边界检测] 后台检测结果: ID ${result.id} 为 ${result.status}。`, 'success');
                        this.setBoundaryCache(this.courseId, this.termId, { [result.id]: result.status });
                    }
                }
            }
            this.isCheckingBoundary = false;
            this.log('加载序列(2/C): [后台边界检测] 任务完成。', 'success');
        },

        waitForVideoAndInjectGain: function() { return new Promise(resolve => { this.log('加载序列(2/A): [音量增益模块] 启动，等待播放器...', 'info'); let observer; const timeout = setTimeout(() => { if(observer) observer.disconnect(); this.log('加载序列(2/A): [音量增益模块] 检测超时(15s)，注入失败。', 'error'); resolve(false); }, 15000); observer = new MutationObserver(() => { const video = document.querySelector('video'); const titleBar = document.querySelector('.titleBar'); if (video && titleBar) { this.log('加载序列(2/A): [音量增益模块] 检测成功，注入UI。', 'success'); this.setupGainEnhancer(video); this.injectTopUI(); clearTimeout(timeout); observer.disconnect(); resolve(true); } }); observer.observe(document.body, { childList: true, subtree: true }); }); },
        waitForCheckboxAndSyncState: function() { return new Promise(resolve => { this.log('加载序列(2/B): [自动播放状态同步] 启动，等待复选框...', 'info'); let observer; const timeout = setTimeout(() => { if(observer) observer.disconnect(); this.log('加载序列(2/B): [自动播放状态同步] 检测超时(15s)，同步失败。', 'error'); resolve(null); }, 15000); observer = new MutationObserver(() => { const checkbox = document.querySelector('input.j-autoNext'); if (checkbox) { this.log('加载序列(2/B): [自动播放状态同步] 检测成功，同步状态。', 'success'); if (!checkbox.dataset.rhManaged) { checkbox.dataset.rhManaged = 'true'; const savedState = localStorage.getItem(this.AUTOPLAY_STORAGE_KEY); let desiredState = (savedState === null) ? false : (savedState === 'true'); this.log(`[自动播放] 读取到已保存状态为“${desiredState}”。`, 'info'); if (checkbox.checked !== desiredState) { checkbox.click(); this.log(`[自动播放] 已将页面选项同步为“${desiredState}”。`, 'success'); } checkbox.addEventListener('change', () => { localStorage.setItem(this.AUTOPLAY_STORAGE_KEY, checkbox.checked.toString()); this.log(`[自动播放] 用户更改状态为“${checkbox.checked}”，已保存。`, 'info'); }); } clearTimeout(timeout); observer.disconnect(); resolve(checkbox); } }); observer.observe(document.body, { childList: true, subtree: true }); }); },

        async runOnPageChange() {
            this.activeObservers.forEach(obs => obs.disconnect());
            this.activeObservers = [];
            if (this.errorObserver) this.errorObserver.disconnect();
            this.cleanupUI();

            this.navigationSessionId = Date.now();
            this.courseId = this.getCourseId();
            this.termId = this.getTermId();
            const idMatch = location.hash.match(/id=(\d+)/);

            if (!idMatch || !this.courseId || !this.termId) {
                this.log(`核心功能模块未加载 (当前非视频内容页，或缺少学期ID)。课程ID: ${this.courseId}, 学期ID: ${this.termId}`, 'warn');
                this.namespace.currentVideo = null;
                return;
            }

            this.log(`加载序列(1/3): 进入视频页 (课程ID: ${this.courseId}, 学期ID: ${this.termId}, 视频ID: ${idMatch[1]})，启动并行加载...`, 'success');
            const cache = this.getBoundaryCache(this.courseId, this.termId);
            if (cache[idMatch[1]] !== 'valid') {
                this.setBoundaryCache(this.courseId, this.termId, {[idMatch[1]]: 'valid'});
            }

            this.namespace = {};
            this.initErrorDialogObserver();

            const gainPromise = this.waitForVideoAndInjectGain();
            const autoplaySyncPromise = this.waitForCheckboxAndSyncState();
            // Boundary promise must be handled carefully due to async nature
            const boundaryPromise = this.proactiveBoundaryCheck();

            // Handle UI injection after their primary dependencies are met
            Promise.all([gainPromise, autoplaySyncPromise, boundaryPromise.catch(e => {
                this.log(`[边界检测] 模块出现严重错误: ${e}`, 'error');
                // Allow other things to proceed even if boundary check fails
                return null;
            })]).then(([gainSuccess, checkboxElement]) => {
                this.log('加载序列: 并行任务结束，进行功能状态总结。', 'info');
                if (!gainSuccess) {
                    this.log('[音量增益模块] 因初始化超时或失败，功能已禁用。', 'warn');
                }
                if (checkboxElement) {
                    this.injectNavigationButtons(checkboxElement);
                } else {
                    this.log('[导航模块] 因自动播放复选框未找到或超时，功能已禁用。', 'warn');
                }
            });
        },

        cleanupUI() { document.getElementById('rh-top-container')?.remove(); document.getElementById('rh-nav-container')?.remove(); },
        setupGainEnhancer(video) { if (this.namespace.currentVideo === video) return; this.namespace.currentVideo = video; const initialGain = parseFloat(localStorage.getItem(this.GAIN_STORAGE_KEY)) || 6.0; this.amplifyMedia(video, initialGain); this.log('[音量增益] 成功附加到新的视频元素。', 'success'); },
        navigate(offset, isUndo = false) { this.lastNavigationDirection = isUndo ? 0 : offset; const idMatch = location.hash.match(/id=(\d+)/); if (idMatch?.[1]) { const newId = parseInt(idMatch[1], 10) + offset; this.log(`[导航] 切换到 ${offset > 0 ? '下一个' : '上一个'} 视频 (ID: ${newId})`, 'info'); location.hash = `#/learn/content?type=detail&id=${newId}&sm=1`; } },
    };

    function initSelectionAndContextMenuLift() { const e = ['contextmenu', 'selectstart', 'dragstart', 'copy']; const t = e => e.stopPropagation(); document.oncontextmenu = document.onselectstart = document.ondragstart = document.oncopy = null; e.forEach(e => document.addEventListener(e, t, true)); enhancerModule.log('加载序列(0/3): 页面限制解除。', 'success'); }

    function initKeyboardControl(module) {
        document.addEventListener('keydown', function(event) {
            const activeElement = document.activeElement;
            const isTyping = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);

            if (isTyping) {
                if (['Space', 'ArrowUp', 'ArrowDown', 'KeyB', 'KeyN'].includes(event.code)) {
                    module.log(`[快捷键] 输入状态，忽略“${event.code}”操作。`, 'warn');
                }
                return;
            }

            const video = module.namespace.currentVideo || document.querySelector('video');
            switch (event.code) {
                case 'Space': if (video) { event.preventDefault(); const isPaused = video.paused; if (isPaused) video.play(); else video.pause(); module.log(`[快捷键] “空格” -> ${isPaused ? '播放' : '暂停'}`); } break;
                case 'ArrowUp': if (video) { event.preventDefault(); video.volume = Math.min(1, video.volume + 0.1); module.log(`[快捷键] “↑” -> 音量增加`); } break;
                case 'ArrowDown': if (video) { event.preventDefault(); video.volume = Math.max(0, video.volume - 0.1); module.log(`[快捷键] “↓” -> 音量降低`); } break;
                case 'KeyB': { event.preventDefault(); const btn = document.getElementById('rh-prev-btn'); if (btn && !btn.disabled) { module.log('[快捷键] “B” -> 触发“上一个”', 'info'); btn.click(); } else { module.log('[快捷键] “B” -> “上一个”不可用', 'warn'); } break; }
                case 'KeyN': { event.preventDefault(); const btn = document.getElementById('rh-next-btn'); if (btn && !btn.disabled) { module.log('[快捷键] “N” -> 触发“下一个”', 'info'); btn.click(); } else { module.log('[快捷键] “N” -> “下一个”不可用', 'warn'); } break; }
            }
        }, true);
        module.log('加载序列(0/3): 键盘快捷键模块已加载。', 'success');
    }

    function main() {
        if (window.self !== window.top) { enhancerModule.log('主程序: 检测到脚本运行在 iFrame 中，功能已禁用。', 'warn'); return; }
        enhancerModule.log('主程序: 脚本运行在顶层窗口，开始初始化...', 'success');
        GM_registerMenuCommand("🗑️ 清除视频边界缓存", () => { const c = enhancerModule.clearBoundaryCaches(); enhancerModule.log(`[菜单命令] 执行“清除视频边界缓存”，清除了 ${c} 个课程的缓存。`, 'success'); alert(`所有课程的边界缓存已清除（共 ${c} 个）。\n下次进入视频页将重新检测。`); });
        GM_registerMenuCommand("♻️ 释放边界检测内存", enhancerModule.releaseBoundaryMemory.bind(enhancerModule));
        initSelectionAndContextMenuLift();
        initKeyboardControl(enhancerModule);
        window.addEventListener('hashchange', () => enhancerModule.runOnPageChange());
        if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => enhancerModule.runOnPageChange()); } else { enhancerModule.runOnPageChange(); }
    }

    main();

})();
// ==UserScript==
// @name         soop 방송 딜레이 자동 조정
// @namespace    https://greasyfork.org/ko/scripts/539405
// @version      2.1
// @description  soop 방송 딜레이를 목표 시간 이내로 자동 보정
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @author       다크초코
// @match        https://play.sooplive.co.kr/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539405/soop%20%EB%B0%A9%EC%86%A1%20%EB%94%9C%EB%A0%88%EC%9D%B4%20%EC%9E%90%EB%8F%99%20%EC%A1%B0%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/539405/soop%20%EB%B0%A9%EC%86%A1%20%EB%94%9C%EB%A0%88%EC%9D%B4%20%EC%9E%90%EB%8F%99%20%EC%A1%B0%EC%A0%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ENABLE_PER_CHANNEL_SETTINGS = true;  // 채널별 목표 설정 기능 (true: 켜짐, false: 꺼짐)
    
    const CONFIG = {
        CHECK_INTERVAL_MS: 100,          // 딜레이 체크 주기
        HISTORY_DURATION_MS: 1000,       // 최근 평균 딜레이 계산 구간
        DEFAULT_TARGET_DELAY_MS: 1500,   // 기본 목표 딜레이
        START_THRESHOLD_MS: 50,          // 목표 초과시 조정 시작 임계값 (첫 시작)
        RESTART_THRESHOLD_MS: 200,       // 목표 초과시 조정 재시작 임계값 (해제 후)
        STOP_THRESHOLD_MS: 200,          // 목표 이하시 조정 해제 임계값
        REVERSE_START_THRESHOLD_MS: 200, // 목표 미달시 역방향 조정 시작 임계값
        REVERSE_STOP_THRESHOLD_MS: 200,  // 목표 근처시 역방향 조정 해제 임계값
        CONSECUTIVE_REQUIRED: 3,         // 연속 조건 충족 횟수
        ADJUSTMENT_SPEED: 3,             // 배속 조정 속도(1~5)
        MAX_RATE: 1.5,                   // 최대 배속
        MIN_RATE: 0.8,                   // 최소 배속
        PRECISE_DEADZONE_MS: 50,         // 정배속 고정 범위 1
        WIDE_DEADZONE_MS: 200            // 정배속 고정 범위 2
    };

    const STORAGE_KEYS = {
        ENABLED: 'soop_delay_enabled',
        TARGET_DELAY: 'soop_delay_target_ms',
        PANEL_POS: 'soop_delay_panel_pos',
        CHANNEL_TARGETS: 'soop_delay_channel_targets'
    };

    let video = null;
    let intervalId = null;
    let delayHistory = [];
    let isEnabled = loadEnabled();
    let currentChannelId = getCurrentChannelId();
    let targetDelayMs = loadTargetDelay();
    let isAdjusting = false;
    let currentPlaybackRate = 1.0;
    let lastDisplayUpdate = 0;
    let urlObserver = null;
    let consecutiveOverCount = 0;
    let consecutiveUnderCount = 0;
    let consecutiveReverseCount = 0;
    let consecutiveReverseStopCount = 0;
    let hasBeenAdjusted = false;
    let isReverseAdjusting = false;
    let lastDeadzoneCheck = 0;
    let forceDeadzoneCount = 0;

    function findVideo() {
        return document.querySelector('video');
    }

    function calculateDelayMs(videoElement) {
        if (!videoElement) return null;
        try {
            const buffered = videoElement.buffered;
            if (buffered.length > 0) {
                const end = buffered.end(buffered.length - 1);
                const now = videoElement.currentTime;
                const delaySec = end - now;
                return delaySec >= 0 ? delaySec * 1000 : null;
            }
        } catch (e) {
        }
        return null;
    }

    function pushDelayHistory(delayMs) {
        const now = Date.now();
        delayHistory.push({ delayMs, t: now });
        const cutoff = now - CONFIG.HISTORY_DURATION_MS;
        delayHistory = delayHistory.filter(d => d.t >= cutoff);
    }

    function getAverageDelayMs() {
        if (delayHistory.length === 0) return 0;
        const sum = delayHistory.reduce((acc, d) => acc + d.delayMs, 0);
        return sum / delayHistory.length;
    }

    function computeAutoRate(averageDelayMs, isCurrentlyAdjusting = false) {
        const errorMs = averageDelayMs - targetDelayMs;
        
        if (Math.abs(errorMs) <= CONFIG.PRECISE_DEADZONE_MS) {
            return 1.0;
        }
        
        if (!isCurrentlyAdjusting && Math.abs(errorMs) <= CONFIG.WIDE_DEADZONE_MS) {
            return 1.0;
        }
        
        const speedMultipliers = {
            1: 0.05,
            2: 0.125,
            3: 0.25,
            4: 0.4,
            5: 0.6
        };
        
        const kp = speedMultipliers[CONFIG.ADJUSTMENT_SPEED] || 0.125;
        const errorSec = errorMs / 1000;
        let rate;
        
        if (errorMs > 0) {
            rate = 1.0 + kp * errorSec;
        } else {
            rate = 1.0 + kp * errorSec;
        }
        
        return clamp(rate, CONFIG.MIN_RATE, CONFIG.MAX_RATE);
    }

    function clamp(v, lo, hi) {
        if (v < lo) return lo;
        if (v > hi) return hi;
        return v;
    }

    let isSettingRate = false;
    
    function setPlaybackRateSafely(rate) {
        if (!video) return;
        try {
            isSettingRate = true;
            video.playbackRate = rate;
            currentPlaybackRate = rate;
            setTimeout(() => { isSettingRate = false; }, 50);
        } catch (e) {
            isSettingRate = false;
        }
    }

    function protectRateChange() {
        if (!video) return;
        const onRateChange = (e) => {
            if (!video || isSettingRate) return;

            const avgMs = getAverageDelayMs();
            const errorMs = avgMs - targetDelayMs;
            const isInPreciseDeadzone = Math.abs(errorMs) <= CONFIG.PRECISE_DEADZONE_MS;
            const isInWideDeadzone = Math.abs(errorMs) <= CONFIG.WIDE_DEADZONE_MS;
            const isInDeadZone = isInPreciseDeadzone || (!isAdjusting && !isReverseAdjusting && isInWideDeadzone);
            
            if (!isInDeadZone) {
                if (!isAdjusting && !isReverseAdjusting && Math.abs(video.playbackRate - 1.0) > 0.1) {
                    e.stopPropagation();
                    setPlaybackRateSafely(1.0);
                    return;
                }
                
                if ((isAdjusting || isReverseAdjusting) && Math.abs(video.playbackRate - currentPlaybackRate) > 0.1) {
                    e.stopPropagation();
                    setPlaybackRateSafely(currentPlaybackRate);
                }
            }
        };
        video.removeEventListener('ratechange', onRateChange, true);
        video.addEventListener('ratechange', onRateChange, true);
    }

    function tick() {
        if (!video) {
            video = findVideo();
            if (!video) return;
            protectRateChange();
        }

        const delayMs = calculateDelayMs(video);
        if (delayMs == null) return;

        pushDelayHistory(delayMs);
        const avgMs = getAverageDelayMs();
        renderInfo(avgMs);

        if (!isEnabled) {
            if (isAdjusting || isReverseAdjusting) {
                isAdjusting = false;
                isReverseAdjusting = false;
                setPlaybackRateSafely(1.0);
            }
            consecutiveOverCount = 0;
            consecutiveUnderCount = 0;
            consecutiveReverseCount = 0;
            consecutiveReverseStopCount = 0;
            hasBeenAdjusted = false;
            return;
        }

        const errorMs = avgMs - targetDelayMs;
        
        const thresholdToUse = hasBeenAdjusted ? CONFIG.RESTART_THRESHOLD_MS : CONFIG.START_THRESHOLD_MS;
        const avgOverTarget = avgMs > (targetDelayMs + thresholdToUse);
        const avgFarUnderTarget = avgMs < (targetDelayMs - CONFIG.REVERSE_START_THRESHOLD_MS);
        
        const isInWideDeadzone = Math.abs(errorMs) <= CONFIG.WIDE_DEADZONE_MS;

        if (!isAdjusting && !isReverseAdjusting) {
            if (avgOverTarget) {
                consecutiveOverCount++;
                consecutiveUnderCount = 0;
                consecutiveReverseCount = 0;
                if (consecutiveOverCount >= CONFIG.CONSECUTIVE_REQUIRED) {
                    isAdjusting = true;
                    hasBeenAdjusted = true;
                }
            } else if (avgFarUnderTarget) {
                consecutiveReverseCount++;
                consecutiveOverCount = 0;
                consecutiveUnderCount = 0;
                if (consecutiveReverseCount >= CONFIG.CONSECUTIVE_REQUIRED) {
                    isReverseAdjusting = true;
                    hasBeenAdjusted = true;
                }
            } else {
                consecutiveOverCount = 0;
                consecutiveReverseCount = 0;
            }
        } else if (isAdjusting) {
            const isInPreciseDeadzone = Math.abs(errorMs) <= CONFIG.PRECISE_DEADZONE_MS;
            if (isInPreciseDeadzone) {
                consecutiveUnderCount++;
                consecutiveOverCount = 0;
                if (consecutiveUnderCount >= CONFIG.CONSECUTIVE_REQUIRED) {
                    isAdjusting = false;
                }
            } else {
                consecutiveUnderCount = 0;
            }

            if (isAdjusting) {
                const rate = computeAutoRate(avgMs, true);
                setPlaybackRateSafely(rate);
            }
        } else if (isReverseAdjusting) {
            const isInPreciseDeadzone = Math.abs(errorMs) <= CONFIG.PRECISE_DEADZONE_MS;
            if (isInPreciseDeadzone) {
                consecutiveReverseStopCount++;
                consecutiveReverseCount = 0;
                if (consecutiveReverseStopCount >= CONFIG.CONSECUTIVE_REQUIRED) {
                    isReverseAdjusting = false;
                }
            } else {
                consecutiveReverseStopCount = 0;
            }

            if (isReverseAdjusting) {
                const rate = computeAutoRate(avgMs, true);
                setPlaybackRateSafely(rate);
            }
        }

        if (!isAdjusting && !isReverseAdjusting) {
            const rate = computeAutoRate(avgMs, false);
            setPlaybackRateSafely(rate);
            
            const now = Date.now();
            
            if (isInWideDeadzone && Math.abs(currentPlaybackRate - 1.0) > 0.001) {
                if (now - lastDeadzoneCheck > 50) {
                    forceDeadzoneCount++;
                    setPlaybackRateSafely(1.0);
                    lastDeadzoneCheck = now;
                }
            } else {
                lastDeadzoneCheck = 0;
                if (forceDeadzoneCount > 0) {
                    forceDeadzoneCount = 0;
                }
            }
        }
    }

    function start() {
        stop();
        intervalId = setInterval(tick, CONFIG.CHECK_INTERVAL_MS);
    }

    function stop() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function cleanup() {
        stop();
        delayHistory = [];
        isAdjusting = false;
        isReverseAdjusting = false;
        currentPlaybackRate = 1.0;
        consecutiveOverCount = 0;
        consecutiveUnderCount = 0;
        consecutiveReverseCount = 0;
        consecutiveReverseStopCount = 0;
        hasBeenAdjusted = false;
        lastDeadzoneCheck = 0;
        forceDeadzoneCount = 0;
        if (video) {
            try { video.playbackRate = 1.0; } catch (e) {}
        }
        video = null;
    }

    function handleFullscreenChange() {
        const fs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        const panel = document.getElementById('soop-delay-panel');
        if (panel) {
            panel.style.display = fs ? 'none' : 'flex';
            if (!fs) ensurePanelInViewport(panel);
        }
    }

    function renderInfo(avgMs) {
        const now = Date.now();
        if (now - lastDisplayUpdate < 100) return;
        lastDisplayUpdate = now;
        const avgNode = document.getElementById('soop-delay-avg');
        const rateNode = document.getElementById('soop-delay-rate');
        if (avgNode) avgNode.textContent = `${avgMs.toFixed(0)}ms`;
        if (rateNode) {
            const actualRate = video ? video.playbackRate : 1.0;
            rateNode.textContent = `${actualRate.toFixed(3)}X`;
        }
    }

    function loadEnabled() {
        try {
            const v = localStorage.getItem(STORAGE_KEYS.ENABLED);
            return v == null ? true : v === '1';
        } catch { return true; }
    }

    function saveEnabled(v) {
        try { localStorage.setItem(STORAGE_KEYS.ENABLED, v ? '1' : '0'); } catch {}
    }

    function getCurrentChannelId() {
        try {
            const match = location.pathname.match(/\/([^\/]+)\/[^\/]+$/);
            return match ? match[1] : null;
        } catch {
            return null;
        }
    }

    function loadChannelTargets() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CHANNEL_TARGETS) || '{}';
            return JSON.parse(data);
        } catch { 
            return {}; 
        }
    }

    function saveChannelTargets(targets) {
        try {
            const data = JSON.stringify(targets);
            localStorage.setItem(STORAGE_KEYS.CHANNEL_TARGETS, data);
        } catch {}
    }

    function loadChannelTargetDelay(channelId) {
        const targets = loadChannelTargets();
        const delay = targets[channelId];
        return (delay && delay >= 200 && delay <= 8000) ? delay : CONFIG.DEFAULT_TARGET_DELAY_MS;
    }

    function saveChannelTargetDelay(channelId, ms) {
        const targets = loadChannelTargets();
        targets[channelId] = ms;
        saveChannelTargets(targets);
    }

    function loadTargetDelay() {
        if (ENABLE_PER_CHANNEL_SETTINGS && currentChannelId) {
            return loadChannelTargetDelay(currentChannelId);
        }
        try {
            const v = parseInt(localStorage.getItem(STORAGE_KEYS.TARGET_DELAY) || '', 10);
            if (isFinite(v) && v >= 200 && v <= 8000) return v;
        } catch {}
        return CONFIG.DEFAULT_TARGET_DELAY_MS;
    }

    function saveTargetDelay(ms) {
        if (ENABLE_PER_CHANNEL_SETTINGS && currentChannelId) {
            saveChannelTargetDelay(currentChannelId, ms);
        } else {
            try { localStorage.setItem(STORAGE_KEYS.TARGET_DELAY, String(ms)); } catch {}
        }
    }



    function loadPanelPos() {
        try {
            const pos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PANEL_POS) || 'null');
            if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
                return { x: pos.x, y: pos.y };
            }
            return null;
        } catch {}
        return null;
    }

    function savePanelPos(x, y) {
        try {
            localStorage.setItem(STORAGE_KEYS.PANEL_POS, JSON.stringify({ x: x, y: y }));
        } catch {}
    }

    function createPanel() {
        if (document.getElementById('soop-delay-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'soop-delay-panel';
        panel.style.cssText = [
            'position: fixed',
            'right: 10px',
            'bottom: 10px',
            'display: flex',
            'align-items: center',
            'gap: 2px',
            'padding: 3px 4px',
            'border-radius: 4px',
            'background: rgba(0,0,0,0.75)',
            'color: #fff',
            'font: 10px/1.2 monospace',
            'font-variant-numeric: tabular-nums',
            'z-index: 10000',
            'user-select: none',
            'cursor: default',
            'white-space: nowrap'
        ].join(';');

        let isDragging = false; let dragOffsetX = 0; let dragOffsetY = 0;
        panel.addEventListener('mousedown', (e) => {
            try {
                if ((e.target instanceof HTMLInputElement) || (e.target instanceof HTMLButtonElement) || (e.target.closest && e.target.closest('button'))) return;
                if (!e.ctrlKey) return;
            } catch {}
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left; dragOffsetY = e.clientY - rect.top;
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, e.clientX - dragOffsetX));
            const y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, e.clientY - dragOffsetY));
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        });
        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const rect = panel.getBoundingClientRect();
            savePanelPos(rect.left, rect.top);
            ensurePanelInViewport(panel);
        });

        let switchState = isEnabled;
        const switchBtn = document.createElement('button');
        switchBtn.type = 'button';
        switchBtn.style.cssText = [
            'position: relative',
            'width: 32px',
            'height: 18px',
            'border-radius: 9px',
            'border: 1px solid rgba(255,255,255,0.25)',
            'padding: 0',
            'background: transparent',
            'cursor: pointer'
        ].join(';');
        const knob = document.createElement('span');
        knob.style.cssText = [
            'position: absolute',
            'top: 1px',
            'left: 1px',
            'width: 14px',
            'height: 14px',
            'border-radius: 50%',
            'background: #fff',
            'transition: left 120ms ease'
        ].join(';');
        switchBtn.appendChild(knob);
        function updateSwitch() {
            switchBtn.style.background = switchState ? 'rgba(46, 204, 113, 0.85)' : 'rgba(255,255,255,0.15)';
            knob.style.left = switchState ? '16px' : '1px';
        }
        updateSwitch();
        switchBtn.addEventListener('click', (e) => {
            switchState = !switchState;
            isEnabled = switchState;
            saveEnabled(isEnabled);
            updateSwitch();
            if (!isEnabled) setPlaybackRateSafely(1.0);
            hasBeenAdjusted = false;
            consecutiveOverCount = 0;
            consecutiveUnderCount = 0;
            e.preventDefault();
            e.stopPropagation();
            const panel = document.getElementById('soop-delay-panel');
            if (panel) ensurePanelInViewport(panel);
        });

        const targetInput = document.createElement('input');
        targetInput.type = 'number';
        targetInput.min = '200';
        targetInput.max = '8000';
        targetInput.step = '50';
        targetInput.value = String(targetDelayMs);
        targetInput.style.width = '55px';
        targetInput.style.color = '#fff';
        targetInput.style.background = 'rgba(255,255,255,0.08)';
        targetInput.style.border = '1px solid rgba(255,255,255,0.25)';
        targetInput.style.borderRadius = '3px';
        targetInput.style.padding = '1px 3px';
        targetInput.style.height = '18px';
        targetInput.style.fontSize = '10px';
        targetInput.style.boxSizing = 'border-box';
        targetInput.style.outline = 'none';
        targetInput.style.caretColor = '#fff';
        targetInput.addEventListener('input', () => {
            let v = parseInt(targetInput.value || '0', 10);
            if (!isFinite(v)) return;
            v = clamp(v, 200, 8000);
            targetDelayMs = v;
            saveTargetDelay(v);
            hasBeenAdjusted = false;
            consecutiveOverCount = 0;
            consecutiveUnderCount = 0;
        });

        let preservedCompositionState = null;
        targetInput.addEventListener('focus', (e) => {
            if (preservedCompositionState) {
                try {
                    const selection = window.getSelection();
                    if (selection && preservedCompositionState.range) {
                        selection.removeAllRanges();
                        selection.addRange(preservedCompositionState.range);
                    }
                } catch (err) {}
            }
        });

        targetInput.addEventListener('blur', (e) => {
            try {
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    preservedCompositionState = {
                        range: selection.getRangeAt(0).cloneRange(),
                        composition: document.querySelector('input:focus') === targetInput
                    };
                }
            } catch (err) {}
        });

        targetInput.addEventListener('compositionstart', (e) => {
            preservedCompositionState = { composing: true };
        });

        targetInput.addEventListener('compositionend', (e) => {
            if (preservedCompositionState) {
                preservedCompositionState.composing = false;
            }
        });
        const msText = document.createElement('span');
        msText.textContent = 'ms';

        const avgVal = document.createElement('span');
        avgVal.id = 'soop-delay-avg';
        avgVal.textContent = '-ms';
        avgVal.style.display = 'inline-block';
        avgVal.style.minWidth = '24px';
        avgVal.style.textAlign = 'right';
        const rateVal = document.createElement('span');
        rateVal.id = 'soop-delay-rate';
        rateVal.textContent = '1.00X';
        rateVal.style.display = 'inline-block';
        rateVal.style.minWidth = '22px';
        rateVal.style.textAlign = 'right';

        panel.appendChild(switchBtn);
        panel.appendChild(document.createTextNode(' 목표:'));
        panel.appendChild(targetInput);
        panel.appendChild(msText);
        panel.appendChild(document.createTextNode(' 딜레이:'));
        panel.appendChild(avgVal);
        panel.appendChild(document.createTextNode(' 배속:'));
        panel.appendChild(rateVal);

        document.body.appendChild(panel);
        ensurePanelInViewport(panel);

        const saved = loadPanelPos();
        if (saved) {
            panel.style.left = saved.x + 'px';
            panel.style.top = saved.y + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            ensurePanelInViewport(panel);
        }

        handleFullscreenChange();
    }

    function updateChannelSettings() {
        const newChannelId = getCurrentChannelId();
        if (newChannelId !== currentChannelId) {
            currentChannelId = newChannelId;
            if (ENABLE_PER_CHANNEL_SETTINGS) {
                targetDelayMs = loadTargetDelay();
                const targetInput = document.querySelector('#soop-delay-panel input[type="number"]');
                if (targetInput) {
                    targetInput.value = String(targetDelayMs);
                }
            }
        }
    }

    function observeUrlChange() {
        let last = location.href;
        if (urlObserver) urlObserver.disconnect();
        urlObserver = new MutationObserver(() => {
            if (location.href !== last) {
                last = location.href;
                cleanup();
                updateChannelSettings();
                createPanel();
                start();
            }
        });
        urlObserver.observe(document, { subtree: true, childList: true });
    }

    function handleVisibilityChange() {
        if (!document.hidden && document.visibilityState === 'visible') {
            if (isAdjusting || isReverseAdjusting) {
                isAdjusting = false;
                isReverseAdjusting = false;
                setPlaybackRateSafely(1.0);
            }
            consecutiveOverCount = 0;
            consecutiveUnderCount = 0;
            consecutiveReverseCount = 0;
            consecutiveReverseStopCount = 0;
            delayHistory = [];
        }
    }

    function preventBackgroundThrottling() {
        try {
            Object.defineProperty(document, 'hidden', {
                get: () => false,
                configurable: true
            });
            Object.defineProperty(document, 'visibilityState', {
                get: () => 'visible',
                configurable: true
            });

            document.addEventListener('visibilitychange', handleVisibilityChange);

            const originalRAF = window.requestAnimationFrame;
            window.requestAnimationFrame = function(callback) {
                return originalRAF.call(window, function() {
                    try {
                        callback.apply(this, arguments);
                    } catch (e) {
                    }
                });
            };

            const keepAlive = () => {
                if (!document.hidden) return;
                const start = performance.now();
                while (performance.now() - start < 1) {
                }
            };
            setInterval(keepAlive, 1000);

        } catch (e) {
        }
    }

    function init() {
        preventBackgroundThrottling();
        createPanel();
        start();
        observeUrlChange();
        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
            .forEach(ev => document.addEventListener(ev, handleFullscreenChange));
        window.addEventListener('resize', () => {
            const panel = document.getElementById('soop-delay-panel');
            if (panel) ensurePanelInViewport(panel);
        });
        window.addEventListener('beforeunload', () => {
            try { if (urlObserver) urlObserver.disconnect(); } catch {}
            cleanup();
        });
    }

    function ensurePanelInViewport(panel) {
        try {
            const rect = panel.getBoundingClientRect();
            const margin = 8;
            let newLeft = rect.left;
            let newTop = rect.top;
            if (rect.right > window.innerWidth - margin) newLeft -= (rect.right - (window.innerWidth - margin));
            if (rect.left < margin) newLeft = margin;
            if (rect.bottom > window.innerHeight - margin) newTop -= (rect.bottom - (window.innerHeight - margin));
            if (rect.top < margin) newTop = margin;
            if (newLeft !== rect.left || newTop !== rect.top) {
                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
                const r2 = panel.getBoundingClientRect();
                savePanelPos(r2.left, r2.top);
            }
        } catch {}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();



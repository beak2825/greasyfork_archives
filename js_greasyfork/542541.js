// ==UserScript==
// @name         Bilibili-根据弹幕提醒跳过广告
// @namespace    https://greasyfork.org/zh-CN/scripts/542541
// @version      1.08
// @description  智能检测弹幕中广告提醒，提取时间戳并自动跳转播放器进度
// @author       chemhunter
// @match        https://www.bilibili.com/video/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542541/Bilibili-%E6%A0%B9%E6%8D%AE%E5%BC%B9%E5%B9%95%E6%8F%90%E9%86%92%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/542541/Bilibili-%E6%A0%B9%E6%8D%AE%E5%BC%B9%E5%B9%95%E6%8F%90%E9%86%92%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const timeRegexList = [
        { regex: /\b(?!\d[:：]0\b)(\d{1,2})[:：](\d{1,2})\b/, isFuzzy: false }, // 5:14
        { regex: /(\d{1,2}|[一二三四五六七八九十]{1,3})分(\d{1,2}|[零一二三四五六七八九十]{1,3})秒/, isFuzzy: false },
        { regex: /(\d{1,2})\.(\d{1,2})[郎朗]/, isFuzzy: false },
        { regex: /(\d{1,2}|[一二三四五六七八九十]{1,3})分(\d{1,2}|[零一二三四五六七八九十]{1,3})/, isFuzzy: false },
        { regex: /(?<!\d)(\d{1,2})\.(\d{1,2})(?![\d郎秒分：wk+＋])/i, isFuzzy: true } // 模糊时间戳：纯数字 5.14
    ];

    const cnNumMap = {
        "零": 0, "一": 1, "二": 2,"两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10
    };

    function parseNumber(char) {
        return cnNumMap[char] || parseInt(char) || 0;
    }

    function parseChineseNumber(ch) {
        if (ch.length === 1) return parseNumber(ch);
        if (ch.length === 2) return (ch[1] === "十") ? parseNumber(ch[0]) * 10 : (10 + parseNumber(ch[1]));
        if (ch.length === 3 && ch[1] === "十") return parseNumber(ch[0]) * 10 + parseNumber(ch[2]);
        return 0;
    }

    const pendingDanmaku = [];
    const timestampCounter = new Map();
    const processedTimestamps = new Map();
    const fuzzyCandidates = []; // { timestamp, timeAdded }

    const TS_REPEAT_COOLDOWN = 20; // 同一时间戳多久后可以再次触发跳转
    const TIME_GROUP_THRESHOLD = 10;
    const FUZZY_TIMEOUT = 10;
    const MIN_JUMP_INTERVAL = 10;
    const MIN_COUNT_TO_LOG = 2;
    let lastJumpTime = 0;

    function extractTimestamps(text) {
        if (/[百千万亿wk]/i.test(text)) return null;
        const cleanText = text.replace(/\s+/g, '');

        for (let i = 0; i < timeRegexList.length; i++) {
            const { regex, isFuzzy } = timeRegexList[i];
            const match = regex.exec(cleanText);
            if (match) {
                const parts = [match[1], match[2]];
                const isChinese = parts.map(p => /[一二三四五六七八九十]/.test(p));
                const values = parts.map((p, idx) => isChinese[idx] ? parseChineseNumber(p) : parseInt(p) || 0);
                const ts = values[0] * 60 + values[1];
                if (!isNaN(ts) && ts >= 60) { //限制广告时间戳位置在01:00之后
                    return {
                        timestamp: ts,
                        isAdTs: /[郎朗猜我]/.test(text) || (isChinese[0] !== isChinese[1]),
                        isFuzzy
                    };
                }
            }
        }
        return null;
    }

    function recordTimestamp(ts) {
        for (const [existingTs, count] of timestampCounter.entries()) {
            if (Math.abs(existingTs - ts) <= TIME_GROUP_THRESHOLD) {
                const newKey = Math.min(existingTs, ts);
                timestampCounter.set(newKey, count + 1);
                if (existingTs !== newKey) timestampCounter.delete(existingTs);
                return;
            }
        }
        timestampCounter.set(ts, 1);
    }

    function log(...args) {
        console.log('[B站弹幕跳广告] ', ...args);
    }

    function processPendingDanmaku() {
        const now = Date.now();

        // 先记录本轮新的明确时间戳（用于模糊匹配）
        for (const { text, timestamp: ts, isAdTs } of pendingDanmaku) {
            if (isAdTs) {
                timestampCounter.set(ts, MIN_COUNT_TO_LOG);
            } else {
                recordTimestamp(ts);
            }
        }

        // 处理模糊候选
        for (let i = fuzzyCandidates.length - 1; i >= 0; i--) {
            if (now - fuzzyCandidates[i].timeAdded >= FUZZY_TIMEOUT*1000) {
                log('[模糊丢弃]', formatTime(fuzzyCandidates[i].timestamp));
                fuzzyCandidates.splice(i, 1);
            }
        }

        for (let i = fuzzyCandidates.length - 1; i >= 0; i--) {
            const fuzzy = fuzzyCandidates[i];
            for (const ts of timestampCounter.keys()) {
                if (Math.abs(fuzzy.timestamp - ts) <= TIME_GROUP_THRESHOLD) {
                    log('[模糊转正]', fuzzy.timestamp, '因匹配到', ts);
                    recordTimestamp(fuzzy.timestamp);
                    fuzzyCandidates.splice(i, 1);
                    break;
                }
            }
        }
        pendingDanmaku.length = 0;
        handleJumpToAdTimestamps();
        timestampCounter.clear();
    }

    function handleJumpToAdTimestamps() {
        const now = Date.now();
        const video = document.querySelector('video');
        const current = video.currentTime;
        const duration = video.duration;

        for (const [ts, count] of timestampCounter) {
            const lastHandled = processedTimestamps.get(ts) || 0;
            const timeSinceLastHandled = now - lastHandled;
            const timeSinceLastJump = now - lastJumpTime;
            const shouldJump =
                  count >= MIN_COUNT_TO_LOG && //真正广告时间戳
                  ts - current > 0 && // 跳转时间戳在当前位置后面
                  ts - current < 180 && // 跳转时间戳在当前位置后面3分钟内
                  ts < duration - 60 && //最后60s不跳
                  current > 30; // 前30s不跳

            if (shouldJump) {
                if (timeSinceLastHandled < TS_REPEAT_COOLDOWN * 1000 || timeSinceLastJump < MIN_JUMP_INTERVAL * 1000 ) {
                    log('[跳转抑制] 防止频繁跳转');
                } else {
                    log(`广告时间戳 ${formatTime(ts)}，计数：${count}，1.5秒后跳转`);
                    video.currentTime = ts;
                    console.log(`✅[跳转成功] 已从 ${formatTime(current)} 跳转至 ⏩${formatTime(ts)}`);
                    showJumpNotice(ts);
                    processedTimestamps.set(ts, now);
                    lastJumpTime = now;
                }
            }
        }
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const remainingSeconds = seconds % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const secs = Math.floor(remainingSeconds % 60);
        return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}` : `${minutes}:${String(secs).padStart(2, '0')}`;
    }

    function showJumpNotice(ts) {
        const container = document.querySelector('.bpx-player-video-wrap');
        if (!container) return;
        const box = document.createElement('div');
        box.innerText = '跳转广告 ⏩ ' + formatTime(ts);
        Object.assign(box.style, {
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            zIndex: '9999',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        container.style.position = 'relative';
        container.appendChild(box);
        requestAnimationFrame(() => {
            box.style.opacity = '1';
        });
        setTimeout(() => {
            box.style.opacity = '0';
            setTimeout(() => box.remove(), 500);
        }, 4000);
    }

    function handleDanmakuMutations(mutationsList) {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node._danmakuHandled) continue;
                node._danmakuHandled = true;
                const text = node.textContent.trim();
                if (text.length === 0 ||text === '9麤') continue;
                //console.log('--', text);
                //log('[弹幕节点识别]', text, 'from', node);
                const result = extractTimestamps(text);
                if (result) {
                    console.log('📌识别时间戳弹幕:', text, formatTime(result.timestamp), result.isFuzzy ? '[疑似]' : '[真实]');
                    if (result.isFuzzy) {
                        fuzzyCandidates.push({ timestamp: result.timestamp, timeAdded: Date.now() });
                    } else {
                        pendingDanmaku.push({ text, timestamp: result.timestamp, isAdTs: result.isAdTs });
                    }
                }
            }
        }
    }

    function ObserveDanmaku(container) {
        log('启动，弹幕容器绑定');
        const observer = new MutationObserver(handleDanmakuMutations);
        observer.observe(container, { childList: true, subtree: true });
        setInterval(processPendingDanmaku, 2500);
    }

    function startObserveDanmakuOnceReady() {
        const check = setInterval(() => {
            const container = document.querySelector('div.bpx-player-render-dm-wrap > div.bpx-player-dm-mask-wrap > div.bpx-player-row-dm-wrap');
            if (container) {
                clearInterval(check);
                ObserveDanmaku(container);
            }
        }, 1000);
    }

    startObserveDanmakuOnceReady();
})();

// ==UserScript==
// @name                Youtube 双语字幕版
// @version             1.4.2
// @author              LR
// @license             MIT
// @description         YouTube双语字幕(仅显示中文)
// @match               *://www.youtube.com/*
// @match               *://m.youtube.com/*
// @require             https://unpkg.com/ajax-hook@latest/dist/ajaxhook.min.js
// @grant               GM_registerMenuCommand
// @run-at              document-start
// @namespace           https://greasyfork.org/users/1210499
// @icon https://www.youtube.com/s/desktop/b9bfb983/img/favicon_32x32.png
// @downloadURL https://update.greasyfork.org/scripts/519233/Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/519233/Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 设置
    const DEFAULT_LANG = 'zh';
    let TARGET_LANG = DEFAULT_LANG;
    const DEFAULT_TRANS_SERVICE = 'youtube';
    let TRANS_SERVICE = DEFAULT_TRANS_SERVICE;
    let LAST_FAILED_SERVICE = null;
    const DEFAULT_SUBTITLE_OFFSET = 40;
    let subtitleOffset = localStorage.getItem('dualSubOffset') ? parseInt(localStorage.getItem('dualSubOffset')) : DEFAULT_SUBTITLE_OFFSET;

    // 获取用户设置
    function getUserSettings() {
        return {
            lang: localStorage.getItem('dualSubTargetLang') || DEFAULT_LANG,
            service: localStorage.getItem('dualSubTransService') || DEFAULT_TRANS_SERVICE,
            offset: subtitleOffset
        };
    }

    // 保存用户设置
    function saveUserSettings(lang, service, offset) {
        localStorage.setItem('dualSubTargetLang', lang);
        localStorage.setItem('dualSubTransService', service);
        if (offset !== undefined) {
            localStorage.setItem('dualSubOffset', offset);
            subtitleOffset = offset;
            updateSubtitlePosition();
        }
        TARGET_LANG = lang;
        TRANS_SERVICE = service;
    }

    // 添加设置菜单
    function addSettingsMenu() {
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand('设置翻译语言', async () => {
                const userInput = prompt('请输入目标语言的ISO 639-1代码（例如：zh 中文, en 英文, ja 日语）：', TARGET_LANG);
                if (userInput) {
                    saveUserSettings(userInput.trim(), TRANS_SERVICE);
                    alert(`翻译目标语言已设置为：${userInput.trim()}`);
                }
            });

            GM_registerMenuCommand('选择翻译引擎', async () => {
                const userInput = prompt('请选择翻译引擎（输入数字）：\n1. YouTube 翻译\n2. Google 翻译', TRANS_SERVICE === 'youtube' ? '1' : '2');
                if (userInput) {
                    const service = userInput.trim() === '1' ? 'youtube' : 'google';
                    saveUserSettings(TARGET_LANG, service);
                    LAST_FAILED_SERVICE = null;
                    alert(`翻译引擎已设置为：${service === 'youtube' ? 'YouTube 翻译' : 'Google 翻译'}`);
                }
            });

            GM_registerMenuCommand('调整字幕上移距离', async () => {
                const userInput = prompt(`请输入字幕上移的像素值（默认${DEFAULT_SUBTITLE_OFFSET}px，范围0-100）：`, subtitleOffset);
                if (userInput) {
                    const offset = parseInt(userInput.trim());
                    if (!isNaN(offset) && offset >= 0 && offset <= 100) {
                        saveUserSettings(TARGET_LANG, TRANS_SERVICE, offset);
                        alert(`字幕上移距离已设置为：${offset}px`);
                    } else {
                        alert('请输入0-100之间的有效数字');
                    }
                }
            });
        }
    }

    // 核心修复：增强CSS优先级 + 监听字幕元素加载
    function updateSubtitlePosition() {
        let styleElement = document.getElementById('dualSubPositionStyle');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dualSubPositionStyle';
            document.head.appendChild(styleElement);
        }

        // 增强版CSS选择器，覆盖YouTube默认样式
        styleElement.textContent = `
            /* 桌面端 - 高优先级选择器 */
            .ytp-caption-window-container .ytp-caption-segment,
            .ytp-caption-window-container .ytp-caption-line,
            .caption-window .caption-segment {
                transform: translateY(-${subtitleOffset}px) !important;
                position: relative !important;
                bottom: ${subtitleOffset}px !important;
            }

            /* 移动端 - 适配小屏 */
            m-youtube .ytp-caption-window-container,
            #player .caption-visual-line {
                margin-bottom: ${subtitleOffset * 2}px !important;
                transform: translateY(-${subtitleOffset}px) !important;
            }

            /* 原生字幕样式兼容 */
            video::cue {
                bottom: ${subtitleOffset + 20}px !important;
                position: absolute !important;
            }
        `;

        // 监听DOM变化，确保字幕元素加载后再应用样式
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    const captionContainer = document.querySelector('.ytp-caption-window-container');
                    if (captionContainer) {
                        captionContainer.style.transform = `translateY(-${subtitleOffset}px)`;
                    }
                }
            });
        });

        // 监听播放器区域的DOM变化
        const player = document.getElementById('player') || document.querySelector('ytd-player');
        if (player) {
            observer.observe(player, { childList: true, subtree: true });
        }
    }

    // 初始化
    const settings = getUserSettings();
    TARGET_LANG = settings.lang;
    TRANS_SERVICE = settings.service;
    subtitleOffset = settings.offset;
    addSettingsMenu();
    updateSubtitlePosition();

    // 谷歌翻译API
    async function googleTranslate(text) {
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${TARGET_LANG}&dt=t&q=${encodeURIComponent(text)}`);
            if (!response.ok) throw new Error('Google API请求失败');
            const data = await response.json();
            return data[0][0][0];
        } catch (error) {
            console.error('Google翻译失败:', error);
            return null;
        }
    }

    async function enableDualSubtitles() {
        async function fetchTranslatedSubtitles(url, preferredService = TRANS_SERVICE) {
            if (LAST_FAILED_SERVICE === preferredService) {
                preferredService = preferredService === 'youtube' ? 'google' : 'youtube';
            }

            async function tryYouTubeTranslation() {
                const cleanUrl = url.replace(/(^|[&?])tlang=[^&]*/g, '') + `&tlang=${TARGET_LANG}&translate_h00ked`;
                try {
                    const response = await fetch(cleanUrl, { method: 'GET' });
                    if (!response.ok) throw new Error('YouTube翻译请求失败');
                    const data = await response.json();
                    if (!data.events || data.events.length === 0) throw new Error('YouTube返回的字幕数据无效');
                    return data;
                } catch (error) {
                    console.error('YouTube翻译失败:', error);
                    LAST_FAILED_SERVICE = 'youtube';
                    return null;
                }
            }

            async function tryGoogleTranslation() {
                try {
                    const response = await fetch(url, { method: 'GET' });
                    if (!response.ok) throw new Error('获取原字幕失败');
                    const data = await response.json();
                    const translatedData = JSON.parse(JSON.stringify(data));

                    const textToTranslate = translatedData.events
                        .filter(event => event.segs)
                        .map(event => ({
                            text: event.segs.map(seg => seg.utf8).join('').trim(),
                            event: event
                        }))
                        .filter(item => item.text);

                    const results = await Promise.all(
                        textToTranslate.map(async ({ text, event }) => {
                            const translatedText = await googleTranslate(text);
                            if (translatedText === null) throw new Error('Google翻译失败');
                            return { event, translatedText };
                        })
                    );

                    results.forEach(({ event, translatedText }) => {
                        event.segs = [{ utf8: translatedText }];
                    });

                    return translatedData;
                } catch (error) {
                    console.error('谷歌翻译失败:', error);
                    LAST_FAILED_SERVICE = 'google';
                    return null;
                }
            }

            let result = null;
            if (preferredService === 'youtube') {
                result = await tryYouTubeTranslation();
                if (!result) {
                    result = await tryGoogleTranslation();
                }
            } else {
                result = await tryGoogleTranslation();
                if (!result) {
                    result = await tryYouTubeTranslation();
                }
            }

            return result;
        }

        function levenshteinDistance(s1, s2) {
            if (s1.length === 0) return s2.length;
            if (s2.length === 0) return s1.length;

            const matrix = Array.from({ length: s1.length + 1 }, (_, i) => Array(s2.length + 1).fill(0).map((_, j) => (i === 0 ? j : i)));

            for (let i = 1; i <= s1.length; i++) {
                for (let j = 1; j <= s2.length; j++) {
                    matrix[i][j] = (s1[i - 1] === s2[j - 1])
                        ? matrix[i - 1][j - 1]
                        : Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                }
            }

            return matrix[s1.length][s2.length];
        }

        function jaccardSimilarity(str1, str2) {
            const set1 = new Set(str1.split(''));
            const set2 = new Set(str2.split(''));
            const intersection = [...set1].filter(x => set2.has(x)).length;
            const union = new Set([...set1, ...set2]).size;
            return intersection / union;
        }

        function calculateSimilarity(s1, s2) {
            const maxLength = Math.max(s1.length, s2.length);
            const levenshteinSimilarity = 1 - (levenshteinDistance(s1, s2) / maxLength);
            const jaccardSim = jaccardSimilarity(s1, s2);
            return (levenshteinSimilarity * 0.7) + (jaccardSim * 0.3);
        }

        function mergeSubtitles(defaultSubs, translatedSubs) {
            const mergedSubs = JSON.parse(JSON.stringify(defaultSubs));
            const translatedEvents = translatedSubs.events.filter(event => event.segs);
            const translatedMap = new Map(translatedEvents.map(event => [event.tStartMs, event]));

            for (let i = 0; i < mergedSubs.events.length; i++) {
                const defaultEvent = mergedSubs.events[i];
                if (!defaultEvent.segs) continue;

                const translatedEvent = [...translatedMap.keys()].reduce((closest, tStartMs) => {
                    return (Math.abs(tStartMs - defaultEvent.tStartMs) < Math.abs(closest - defaultEvent.tStartMs)) ? tStartMs : closest;
                }, Infinity);

                const eventToMerge = translatedMap.get(translatedEvent);
                if (eventToMerge) {
                    const defaultText = defaultEvent.segs.map(seg => seg.utf8).join('').trim();
                    const translatedText = eventToMerge.segs.map(seg => seg.utf8).join('').trim();

                    const timeOverlap = Math.min(defaultEvent.tStartMs + defaultEvent.dDurationMs, eventToMerge.tStartMs + eventToMerge.dDurationMs) - Math.max(defaultEvent.tStartMs, eventToMerge.tStartMs);
                    
                    if (timeOverlap > 0) {
                        const similarity = calculateSimilarity(defaultText, translatedText);
                        if (similarity < 0.6) {
                            defaultEvent.segs = [{
                                // 核心修改：删除英文原文，只保留中文翻译
                                utf8: `${translatedText}`,
                                tStartMs: defaultEvent.tStartMs,
                                dDurationMs: defaultEvent.dDurationMs
                            }];
                        }
                    }
                }
            }

            return JSON.stringify(mergedSubs);
        }

        ah.proxy({
            onResponse: async (response, handler) => {
                if (response.config.url.includes('/api/timedtext') && !response.config.url.includes('&translate_h00ked')) {
                    try {
                        const defaultSubs = JSON.parse(response.response);
                        const translatedSubs = await fetchTranslatedSubtitles(response.config.url);
                        if (translatedSubs) {
                            response.response = mergeSubtitles(defaultSubs, translatedSubs);
                        }
                    } catch (error) {
                        console.error("处理字幕时出错:", error);
                    }
                }
                handler.resolve(response);
            }
        });
    }

    enableDualSubtitles();
})();

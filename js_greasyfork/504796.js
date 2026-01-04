// ==UserScript==
// @name                Youtube 双语字幕版
// @version             1.4.0
// @author              LR
// @license             MIT
// @description         YouTube双语字幕，任何语言翻译成中文或用户选择的目标语言。支持YouTube翻译和谷歌翻译，自动切换。支持移动端和桌面端，适配Via浏览器。
// @match               *://www.youtube.com/*
// @match               *://m.youtube.com/*
// @require             https://unpkg.com/ajax-hook@latest/dist/ajaxhook.min.js
// @grant               GM_registerMenuCommand
// @run-at              document-start
// @namespace           https://greasyfork.org/users/1210499
// @icon https://www.youtube.com/s/desktop/b9bfb983/img/favicon_32x32.png
// @downloadURL https://update.greasyfork.org/scripts/504796/Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/504796/Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 设置
    const DEFAULT_LANG = 'zh';
    let TARGET_LANG = DEFAULT_LANG;
    const DEFAULT_TRANS_SERVICE = 'youtube';
    let TRANS_SERVICE = DEFAULT_TRANS_SERVICE;
    let LAST_FAILED_SERVICE = null; // 记录上次失败的服务

    // 获取用户设置
    function getUserSettings() {
        return {
            lang: localStorage.getItem('dualSubTargetLang') || DEFAULT_LANG,
            service: localStorage.getItem('dualSubTransService') || DEFAULT_TRANS_SERVICE
        };
    }

    // 保存用户设置
    function saveUserSettings(lang, service) {
        localStorage.setItem('dualSubTargetLang', lang);
        localStorage.setItem('dualSubTransService', service);
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
                    LAST_FAILED_SERVICE = null; // 重置失败记录
                    alert(`翻译引擎已设置为：${service === 'youtube' ? 'YouTube 翻译' : 'Google 翻译'}`);
                }
            });
        }
    }

    // 初始化设置
    const settings = getUserSettings();
    TARGET_LANG = settings.lang;
    TRANS_SERVICE = settings.service;
    addSettingsMenu();

    // 谷歌翻译API
    async function googleTranslate(text) {
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${TARGET_LANG}&dt=t&q=${encodeURIComponent(text)}`);
            if (!response.ok) throw new Error('Google API请求失败');
            const data = await response.json();
            return data[0][0][0];
        } catch (error) {
            console.error('Google翻译失败:', error);
            return null; // 返回null表示翻译失败
        }
    }

    async function enableDualSubtitles() {
        // 获取翻译后的字幕数据
        async function fetchTranslatedSubtitles(url, preferredService = TRANS_SERVICE) {
            // 如果上次失败的服务和当前首选服务相同，自动切换到另一个服务
            if (LAST_FAILED_SERVICE === preferredService) {
                preferredService = preferredService === 'youtube' ? 'google' : 'youtube';
                console.log(`上次${LAST_FAILED_SERVICE}翻译失败，自动切换到${preferredService}`);
            }

            async function tryYouTubeTranslation() {
                const cleanUrl = url.replace(/(^|[&?])tlang=[^&]*/g, '') + `&tlang=${TARGET_LANG}&translate_h00ked`;
                try {
                    const response = await fetch(cleanUrl, { method: 'GET' });
                    if (!response.ok) throw new Error('YouTube翻译请求失败');
                    const data = await response.json();
                    // 验证返回的数据是否有效
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

                    // 批量收集需要翻译的文本
                    const textToTranslate = translatedData.events
                        .filter(event => event.segs)
                        .map(event => ({
                            text: event.segs.map(seg => seg.utf8).join('').trim(),
                            event: event
                        }))
                        .filter(item => item.text);

                    // 批量翻译
                    const results = await Promise.all(
                        textToTranslate.map(async ({ text, event }) => {
                            const translatedText = await googleTranslate(text);
                            if (translatedText === null) throw new Error('Google翻译失败');
                            return { event, translatedText };
                        })
                    );

                    // 更新翻译结果
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

            // 尝试首选服务
            let result = null;
            if (preferredService === 'youtube') {
                result = await tryYouTubeTranslation();
                if (!result) {
                    console.log('YouTube翻译失败，尝试使用谷歌翻译');
                    result = await tryGoogleTranslation();
                }
            } else {
                result = await tryGoogleTranslation();
                if (!result) {
                    console.log('谷歌翻译失败，尝试使用YouTube翻译');
                    result = await tryYouTubeTranslation();
                }
            }

            return result;
        }

        // 编辑距离计算
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

        // Jaccard相似度计算
        function jaccardSimilarity(str1, str2) {
            const set1 = new Set(str1.split(''));
            const set2 = new Set(str2.split(''));
            const intersection = [...set1].filter(x => set2.has(x)).length;
            const union = new Set([...set1, ...set2]).size;
            return intersection / union;
        }

        // 相似度计算
        function calculateSimilarity(s1, s2) {
            const maxLength = Math.max(s1.length, s2.length);
            const levenshteinSimilarity = 1 - (levenshteinDistance(s1, s2) / maxLength);
            const jaccardSim = jaccardSimilarity(s1, s2);
            return (levenshteinSimilarity * 0.7) + (jaccardSim * 0.3);
        }

        // 合并字幕
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
                        // 使用0.6容错率
                        if (similarity < 0.6) {
                            defaultEvent.segs = [{
                                utf8: `${defaultText}\n${translatedText}`,
                                tStartMs: defaultEvent.tStartMs,
                                dDurationMs: defaultEvent.dDurationMs
                            }];
                        }
                    }
                }
            }

            return JSON.stringify(mergedSubs);
        }

        // ajax-hook代理
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
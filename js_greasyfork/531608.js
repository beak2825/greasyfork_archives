// ==UserScript==
// @name         YouTube 弹幕翻译
// @description  翻译外语弹幕
// @namespace   PairZhu
// @version      1.0
// @author       PairZhu
// @match        https://www.youtube.com/live_chat_replay*
// @match        https://www.youtube.com/live_chat*
// @grant        GM_xmlhttpRequest
// @connect      api.niutrans.com
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531608/YouTube%20%E5%BC%B9%E5%B9%95%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/531608/YouTube%20%E5%BC%B9%E5%B9%95%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TRANSLATE_PERIOD_MS = 200; // 每隔一段时间就抓取未翻译的弹幕
    const MAX_BATCH_SIZE = 50; // 每次翻译的最大文本数量，如果使用小牛翻译API则不得大于50
    const CHINESE_RATIO_THRESHOLD = 0.3; // 汉字比例阈值，汉字占比高于这个比例则不翻译该弹幕
    const CACHE_SIZE = 1024; // 缓存的最大数量，对于刷屏同质化的弹幕可以大大减少积分消耗，但过大可能导致内存不足
    const API_KEY = 'xxxxxx'; // 替换为你的 NiuTrans API Key
    const FROM_LANG = 'auto';
    const TO_LANG = 'zh';
    const API_URL = 'http://api.niutrans.com/NiuTransServer/translationArray';

    let chatNum = 0;
    const cache = new Map(); // LRU缓存
    setInterval(() => translateAll(), TRANSLATE_PERIOD_MS);

    const request = async (url, data) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(data),
                onload: (response) => {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.result_code === '200') {
                            resolve(result.tgt_list.map(item => item.tgt_text));
                        } else {
                            reject(new Error(`API Error: ${result.result_msg}`));
                        }
                    } catch (error) {
                        reject(new Error("JSON Parsing Error"));
                    }
                },
                onerror: () => reject(new Error("Network Error"))
            });
        });
    };

    const getChineseRatio = (text) => {
        const chineseChars = text.match(/[\u4e00-\u9fa5\u3400-\u4DBF\uF900-\uFAFF]/g) || [];
        return chineseChars.length / text.length;
    };

    const translate = async (queryArray) => {
        const results = queryArray.map(text => {
            if (text.length === 0) return " ";
            if (getChineseRatio(text) > CHINESE_RATIO_THRESHOLD) {
                return "🀄";
            }
            if (cache.has(text)) {
                const cached = cache.get(text);
                cache.delete(text);
                cache.set(text, cached); // 移动到最近使用位置
                return "Ⓜ️" + cached.translation;
            }
            return null;
        });

        const toFetch = queryArray.filter((_, index) => results[index] === null);
        if (toFetch.length === 0) return results;

        try {
            const fetchedTranslations = await request(API_URL, {
                from: FROM_LANG,
                to: TO_LANG,
                apikey: API_KEY,
                src_text: toFetch
            });

            let fetchIndex = 0;
            const translatedResults = results.map((result, index) => {
                if (result !== null) return result;
                const translation = fetchedTranslations[fetchIndex++];
                if (cache.size >= CACHE_SIZE) {
                    cache.delete(cache.keys().next().value); // 删除最旧的缓存项
                }
                cache.set(queryArray[index], { translation });
                return "🔤" + translation;
            });

            return translatedResults;
        } catch (error) {
            console.log(error);
            return results.map(result => (result !== null ? result : "🚨"));
        }
    };

    const translateAll = async () => {
        const elements = Array.from(document.querySelectorAll('span#message.style-scope.yt-live-chat-text-message-renderer:not(#timestamp):not(#dashboard-deleted-state):not(#deleted-state):not([YoutubeChatTranslator])'));
        if (elements.length > 0) {
            const group = elements.slice(-MAX_BATCH_SIZE).map((element) => {
                const text = element.textContent.replace(/^[\s\p{P}\p{S}\p{Emoji}\n]+|[\s\p{P}\p{S}\p{Emoji}\n]+$/gu, '');
                element.setAttribute('YoutubeChatTranslator', chatNum.toString());
                chatNum++;
                return { elem: element, text };
            });

            const translatedTexts = await translate(group.map(item => item.text));
            group.forEach((item, index) => {
                item.elem.textContent += translatedTexts[index];
            });
        }
    };
})();


// ==UserScript==
// @name         wds 剧情翻译加载
// @namespace    http://tampermonkey.net/
// @version      2025-05-11
// @description  使用 World Dai Star 的第三方剧情阅读器时，会自动从 wds-translation.littletoxic.top 加载缓存的翻译并替换掉原文
// @author       littletoxic
// @match        https://cpk0521.github.io/WDS_Adv_Player*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM.xmlHttpRequest
// @connect      wds-translation.littletoxic.top
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533349/wds%20%E5%89%A7%E6%83%85%E7%BF%BB%E8%AF%91%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/533349/wds%20%E5%89%A7%E6%83%85%E7%BF%BB%E8%AF%91%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= 配置区 ================
    const CONFIG = {
        // --- Cloudflare Worker 配置 ---
        WORKER: {
            ENDPOINT: "https://wds-translation.littletoxic.top",
        }
    };
    // ========================================

    // 初始化拦截
    function initResponseHook() {
        const originalJson = Response.prototype.json;

        Response.prototype.json = async function() {
            try {
                const result = await originalJson.apply(this, arguments);
                if (!result.EpisodeDetail) return result;

                const episodeId = result.EpisodeId;

                // 尝试获取缓存
                const cached = await getCache(episodeId);
                if (cached) {
                    console.log("使用翻译");
                    applyTranslation(result.EpisodeDetail, cached.translated);
                } else {
                    alert("没有翻译，将显示原文");
                }
                return result;
            } catch(e) {
                console.log(e);
                alert("网络错误或访问超限，刷新试试");
                throw e;
            }
        };

        console.log('Response.json has been hooked!');
    }

    // 应用翻译结果
    function applyTranslation(episodes, translated) {
        episodes.forEach((episode, index) => {
            episode.SpeakerName !== undefined && (episode.SpeakerName = translated[index].SpeakerName);
            episode.Phrase !== undefined && (episode.Phrase = translated[index].Phrase.replaceAll('—', '―'));
        });
    }

    // 从Worker获取缓存
    async function getCache(episodeId) {
        const response = await GM.xmlHttpRequest({
            method: 'GET',
            url: `${CONFIG.WORKER.ENDPOINT}/${episodeId}.json`,
        });

        if (response.status === 404) return null;

        return JSON.parse(response.responseText);
    }
  
    // 初始化
    console.log('启动剧情翻译拦截...');
    initResponseHook();

})();

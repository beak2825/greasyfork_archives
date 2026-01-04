// ==UserScript==
// @name                YouTube Prevent Auto-Dub
// @name:zh-TW          YouTube 防止自動配音
// @name:zh-CN          YouTube 防止自动配音
// @name:ja             YouTube 自動吹き替え防止
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_prevent_auto_dub_namespace
// @version             0.2.6
// @match               *://www.youtube.com/*
// @match               *://m.youtube.com/*
// @match               *://www.youtube-nocookie.com/*
// @exclude             *://www.youtube.com/live_chat*
// @require             https://update.greasyfork.org/scripts/549881/1698944/YouTube%20Helper%20API.js
// @run-at              document-idle
// @grant               none
// @inject-into         page
// @license             MIT
// @description         Forces all YouTube videos to play in their original language audio instead of the AI dubbed language. Works in both normal videos and shorts. Can be manually overridden per-video.
// @description:zh-TW   強制所有 YouTube 影片以原始語言音訊播放，而不是 AI 配音的語言。適用於一般影片和 Shorts。可針對單一影片手動關閉。
// @description:zh-CN   强制所有 YouTube 视频以原始语言音频播放，而不是 AI 配音的语言。适用于一般视频和 Shorts。可针对单个视频手动关闭。
// @description:ja      すべてのYouTube動画をAI吹き替えではなく、元の言語の音声で強制的に再生します。通常の動画とショート動画の両方で機能します。動画ごとに手動で無効にすることもできます。
// @downloadURL https://update.greasyfork.org/scripts/547604/YouTube%20Prevent%20Auto-Dub.user.js
// @updateURL https://update.greasyfork.org/scripts/547604/YouTube%20Prevent%20Auto-Dub.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
/* global youtubeHelperApi */

(function () {
    'use strict';

    const api = youtubeHelperApi;
    if (!api) return console.error('Helper API not found. Likely incompatible script manager or extension settings.');

    let canUpdate = false;

    const checkAutoDub = (event) => {
        if (!canUpdate && !event.detail.isInit) return;
        try {
            const playingLanguage = event.detail.playingLanguage;
            if (!playingLanguage) throw new Error('Unable to determine the current audio track.');

            const isAutoDubbed = event.detail.isAutoDubbed;
            if (!isAutoDubbed) return;

            console.log('Auto-dub detected, trying to undo...');
            const originalLanguage = event.detail.originalLanguage;
            if (!originalLanguage) throw new Error('Unable to determine the original audio track.');
            api.apiProxy.setAudioTrack(originalLanguage);
            console.log(`Auto-dub undo successful. Audio track reverted from ${playingLanguage} to ${originalLanguage}.`);
        } catch (error) {
            console.warn('Failed to prevent YouTube auto-dubbing.', error);
        } finally {
            canUpdate = false;
        }
    };

    api.eventTarget.addEventListener('yt-helper-api-playback-language-updated', checkAutoDub);
    api.eventTarget.addEventListener('yt-helper-api-ready', () => {
        canUpdate = true;
        setTimeout(() => { canUpdate = false; }, 1000)
    });
})();
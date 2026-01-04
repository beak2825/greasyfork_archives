// ==UserScript==
// @name                Youtube dual subtitle
// @name:zh-CN          Youtube 双语字幕全平台
// @name:zh-TW          Youtube 雙語字幕全平臺
// @version             2.1
// @author              Coink & jk278
// @namespace           https://github.com/jk278/youtube-dual-subtitle
// @description         Fix for mobile devices on YouTube bilingual captions. It works on both mobile and desktop, and supports the Via browser.
// @description:zh-CN   Youtube 双语字幕，支持 PC、移动端 Tampermonkey，及 Via 等轻量浏览器。
// @description:zh-TW   Youtube 雙語字幕。移動端（mobile）修復，雙端適用，而且支持 Via 瀏覽器。
// @match               *://www.youtube.com/*
// @match               *://m.youtube.com/*
// @require             https://unpkg.com/ajax-hook@latest/dist/ajaxhook.min.js
// @grant               none
// @run-at              document-start
// @icon                https://www.youtube.com/s/desktop/b9bfb983/img/favicon_32x32.png
// @downloadURL https://update.greasyfork.org/scripts/464879/Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E5%85%A8%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/464879/Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E5%85%A8%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

/*
如果未自动加载，请切换字幕或关闭后再打开即可。默认语言为浏览器首选语言。
*/

(function () {
  'use strict';

  // 检测浏览器首选语言，如果没有，设置为英语
  const preferredLanguage = navigator.language.split('-')[0] || 'en';

  // 启用双语字幕
  function enableSubs() {
    ah.proxy({
      onRequest: (config, handler) => {
        handler.next(config); // 处理下一个请求
      },
      onResponse: (response, handler) => {
        // 如果请求的 URL 包含 '/api/timedtext' 并且没有 '&translate_h00ked'，则表示请求双语字幕
        if (response.config.url.includes('/api/timedtext') && !response.config.url.includes('&translate_h00ked')) {
          let xhr = new XMLHttpRequest(); // 创建新的 XMLHttpRequest
          // 使用 RegExp 清除我们的 xhr 请求参数中的 '&tlang=...'，同时使用 Y2B 自动翻译
          let url = response.config.url.replace(/(^|[&?])tlang=[^&]*/g, '');
          url = `${url}&tlang=${preferredLanguage}&translate_h00ked`;
          xhr.open('GET', url, false); // 打开 xhr 请求
          xhr.send(); // 发送 xhr 请求

          let defaultSubtitles = null; // 声明默认 JSON 变量
          if (response.response) {
            const jsonResponse = JSON.parse(response.response);
            if (jsonResponse.events) defaultSubtitles = jsonResponse;
          }

          const localeSubtitles = JSON.parse(xhr.response); // 解析 xhr 响应
          let isOfficialSub = true;

          for (const defaultJsonEvent of defaultSubtitles.events) {
            if (defaultJsonEvent.segs && defaultJsonEvent.segs.length > 1) {
              isOfficialSub = false;
              break;
            }
          }

          // 将默认字幕与本地语言字幕合并
          if (isOfficialSub) {
            // 如果片段长度相同
            for (let i = 0, len = defaultSubtitles.events.length; i < len; i++) {
              const defaultJsonEvent = defaultSubtitles.events[i];
              if (!defaultJsonEvent.segs) continue;
              const localeJsonEvent = localeSubtitles.events[i];
              if (`${defaultJsonEvent.segs[0].utf8}`.trim() !== `${localeJsonEvent.segs[0].utf8}`.trim()) {
                // 避免在两者相同时合并字幕
                defaultJsonEvent.segs[0].utf8 += ('\n' + localeJsonEvent.segs[0].utf8);
              }
            }
            response.response = JSON.stringify(defaultSubtitles); // 更新响应
          } else {
            // 如果片段长度不同（例如：自动生成的英语字幕）
            let pureLocalEvents = localeSubtitles.events.filter(event => event.aAppend !== 1 && event.segs);
            for (const defaultJsonEvent of defaultSubtitles.events) {
              if (!defaultJsonEvent.segs) continue;
              let currentStart = defaultJsonEvent.tStartMs,
                  currentEnd = currentStart + defaultJsonEvent.dDurationMs;
              let currentLocalEvents = pureLocalEvents.filter(pe => currentStart <= pe.tStartMs && pe.tStartMs < currentEnd);
              let localLine = '';
              for (const ev of currentLocalEvents) {
                for (const seg of ev.segs) {
                  localLine += seg.utf8;
                }
                localLine += '﻿'; // 添加零宽空格，以避免单词粘在一起
              }
              let defaultLine = '';
              for (const seg of defaultJsonEvent.segs) {
                defaultLine += seg.utf8;
              }
              defaultJsonEvent.segs[0].utf8 = defaultLine + '\n' + localLine;
              defaultJsonEvent.segs = [defaultJsonEvent.segs[0]];
            }
            response.response = JSON.stringify(defaultSubtitles); // 更新响应
          }
        }
        handler.resolve(response); // 处理响应
      }
    });
  }

  // 当文档加载完成并且字幕可用时，调用 enableSubs 函数启用双语字幕
  if (document.readyState === 'complete') {
    enableSubs(); // 如果文档已经加载完成，则启用双语字幕
  } else {
    window.addEventListener('load', enableSubs); // 如果文档尚未加载完成，添加事件监听器以在加载完成时启用双语字幕
  }
})();
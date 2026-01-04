// ==UserScript==
// @name         Chzzk_Clips: Unblock & Unmute
// @namespace    Chzzk_Clips: Unblock & Unmute
// @version      1.1.4
// @description:ko  차단한 유저의 클립 우회 재생(차단한 스트리머X) / 자동 음소거 해제
// @description:en  Blocked clips bypass & auto unmute clips
// @author       DOGJIP
// @match        https://chzzk.naver.com/*
// @match        https://*.chzzk.naver.com/*
// @match        https://m.naver.com/shorts/*
// @run-at       document-start
// @grant        none
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @description 차단한 유저의 클립 우회 시청 및 음소거 해제
// @downloadURL https://update.greasyfork.org/scripts/534351/Chzzk_Clips%3A%20Unblock%20%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/534351/Chzzk_Clips%3A%20Unblock%20%20Unmute.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const host = location.host;

  // 1) chzzk.naver.com 에서 Clips API 차단 해제
  if (host.endsWith('chzzk.naver.com')) {
    xhook.after((request, response) => {
      const url = request.url;

      // 목록 API (/clips?filterType=ALL)
      if (url.includes('/clips?') && url.includes('filterType=ALL')) {
          //console.log('[xhook] 목록 API 응답 감지:', url);
        try {
          const json = JSON.parse(response.text);
          if (json.content && Array.isArray(json.content.data)) {
            json.content.data.forEach(clip => {
              if (clip.privateUserBlock === true || clip.blindType != null) {
                clip.privateUserBlock = false;
                clip.blindType = null;
              }
            });
            response.text = JSON.stringify(json);
          }
        } catch (e) { /* silent */ }
      }

      // 상세 API (/clips/{id}/detail?optionalProperties=...)
      if (url.match(/\/clips\/[^/]+\/detail\?optionalProperties=/)) {
          //console.log('[xhook] 상세 API 응답 감지:', url);
        try {
          const json = JSON.parse(response.text);
          const op = json.content && json.content.optionalProperty;
          if (op) {
            op.privateUserBlock = false;
            op.blindType = null;
            response.text = JSON.stringify(json);
          }
        } catch (e) { /* silent */ }
      }
    });

    return;
  }

  // 2) m.naver.com/shorts 에서 자동 언뮤트
  if (host === 'm.naver.com') {
    const tryClickUnmute = () => {
      const btn = document.querySelector('button.si_btn_sound');
      if (btn && btn.getAttribute('aria-pressed') === 'true') {
        btn.click();
        return true;
      }
      return false;
    };

    const loop = () => {
      if (!tryClickUnmute()) requestAnimationFrame(loop);
    };

    document.addEventListener('DOMContentLoaded', () => {
      loop();
    });
  }

})();
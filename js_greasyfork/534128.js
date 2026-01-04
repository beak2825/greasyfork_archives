// ==UserScript==
// @name         Chzzk_L&V: AdGuard 팝업 충돌 해결
// @namespace    Chzzk_Live&VOD: AdGuard 팝업 충돌 해결
// @version      1.1
// @description  AdGuard prevent-xhr로 차단된 Veta 요청을 xhook으로 빈 JSON 응답 처리해 페이지 오류 방지
// @author       DOGJIP
// @match        https://chzzk.naver.com/*
// @match        https://*.chzzk.naver.com/*
// @grant        none
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @downloadURL https://update.greasyfork.org/scripts/534128/Chzzk_LV%3A%20AdGuard%20%ED%8C%9D%EC%97%85%20%EC%B6%A9%EB%8F%8C%20%ED%95%B4%EA%B2%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/534128/Chzzk_LV%3A%20AdGuard%20%ED%8C%9D%EC%97%85%20%EC%B6%A9%EB%8F%8C%20%ED%95%B4%EA%B2%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const regex = /veta\.naver\.com\/(vas|gfp|call)/;

  xhook.before((request, callback) => {
    if (regex.test(request.url)) {
      console.warn('[Chzzk_L&V] Intercepted Veta XHR:', request.url);
      try {
        // 정상 200 + 빈 JSON(혹은 필요한 포맷) + 헤더 지정
        return callback({
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          text: '{}'  // 호출부가 JSON.parse 하더라도 에러 안 나도록
        });
      } catch (err) {
        console.warn('[Chzzk_L&V] Callback 에러, URL 폴백 처리:', err);
        // 콜백이 지원되지 않는 환경이면 URL 변경으로 폴백
        request.url = 'about:blank';
        return callback();
      }
    }
    // 기본 요청은 그대로
    callback();
  });

})();

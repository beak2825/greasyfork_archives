// ==UserScript==
// @name         광고 끄기 요청 팝업 없애기
// @namespace    http://tampermonkey.net/
// @version      2024-04-28
// @description  adblock 끄라고 팝업 뜨는거 없애버리기
// @author       EnochG1
// @match        https://*.tistory.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493720/%EA%B4%91%EA%B3%A0%20%EB%81%84%EA%B8%B0%20%EC%9A%94%EC%B2%AD%20%ED%8C%9D%EC%97%85%20%EC%97%86%EC%95%A0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493720/%EA%B4%91%EA%B3%A0%20%EB%81%84%EA%B8%B0%20%EC%9A%94%EC%B2%AD%20%ED%8C%9D%EC%97%85%20%EC%97%86%EC%95%A0%EA%B8%B0.meta.js
// ==/UserScript==

console.log('광고 끄기 요청 팝업 작동');

const CLICK_INTERVAL_TIME = 1 * 1000;
const runInterval = () => {
    const el = document.querySelector('.fc-ab-root');
      if (el) {
          var style = document.createElement('style');

          var escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
              createHTML: (to_escape) => to_escape
          })
          style.innerHTML = escapeHTMLPolicy.createHTML(	`
div.fc-ab-root {
    z-index: -1000 !important;
    display: none !important;
}

div.fc-whitelist-root {
    z-index: -1000 !important;
    display: none !important;
}
body {
    overflow: auto !important;
}`);
          el.parentNode.insertBefore(style, el);
      }
}

const createCheckInterval = () => {
    setInterval(() => {
      runInterval();
    }, CLICK_INTERVAL_TIME);
}

createCheckInterval();
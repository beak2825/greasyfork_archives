// ==UserScript==
// @name        [루시퍼홍] 거래현황 더보기 월세 제외
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/apt_price_2020.jsp?*
//
// @grant       none
// @version     0.01
// @author      -
// @description 2024. 3. 10. 오전 9:57:03
// @downloadURL https://update.greasyfork.org/scripts/541983/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EA%B1%B0%EB%9E%98%ED%98%84%ED%99%A9%20%EB%8D%94%EB%B3%B4%EA%B8%B0%20%EC%9B%94%EC%84%B8%20%EC%A0%9C%EC%99%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/541983/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EA%B1%B0%EB%9E%98%ED%98%84%ED%99%A9%20%EB%8D%94%EB%B3%B4%EA%B8%B0%20%EC%9B%94%EC%84%B8%20%EC%A0%9C%EC%99%B8.meta.js
// ==/UserScript==



(function () {
  'use strict';

  const tryClickDeal3 = () => {
    const selectW = document.querySelector("#deal3");
    console.log("selectW", selectW);
    if (selectW) {
      console.log("✅ #deal3 발견됨:", selectW);
      if (selectW.classList.contains("on")) {
        selectW.click();
        console.log("🖱️ 클릭 실행됨");
      }
      return true;
    }
    return false;
  };

  // 즉시 실행 + 반복 확인
  let attempts = 0;
  const interval = setInterval(() => {
    if (tryClickDeal3() || ++attempts > 100) {
      clearInterval(interval);
    }
  }, 100);

  // MutationObserver 병행
  const observer = new MutationObserver(() => {
    tryClickDeal3();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();


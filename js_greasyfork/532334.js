// ==UserScript==
// @name         나무위키 고정형 내비게이션 바 문단 안 가리기
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  나무위키에서 고정형 내비게이션 바 사용 시 바가 문단 제목을 가리는 현상 수정
// @author       noipung
// @match        https://namu.wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namu.wiki
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532334/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EA%B3%A0%EC%A0%95%ED%98%95%20%EB%82%B4%EB%B9%84%EA%B2%8C%EC%9D%B4%EC%85%98%20%EB%B0%94%20%EB%AC%B8%EB%8B%A8%20%EC%95%88%20%EA%B0%80%EB%A6%AC%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/532334/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EA%B3%A0%EC%A0%95%ED%98%95%20%EB%82%B4%EB%B9%84%EA%B2%8C%EC%9D%B4%EC%85%98%20%EB%B0%94%20%EB%AC%B8%EB%8B%A8%20%EC%95%88%20%EA%B0%80%EB%A6%AC%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let currentScrollTo = window.scrollTo.bind(window);

  Object.defineProperty(window, "scrollTo", {
    get: () => currentScrollTo,
    set: (newScrollTo) => {
      currentScrollTo = (x, y, ...args) => {
        const header =
          document.querySelector("a[title=나무위키]")?.parentElement?.parentElement;

        if (getComputedStyle(header).position !== "fixed") {
          newScrollTo(x, y);
          return;
        }

        const top = document.querySelector("article").offsetTop;
        const newY = y - top;

        newScrollTo(x, newY, ...args);
      };
    },
  });
})();

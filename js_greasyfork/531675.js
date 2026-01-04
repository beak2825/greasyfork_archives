// ==UserScript==
// @name         SOOP - 방종 후 VOD 자동재생 끄기
// @namespace    http://sooplive.co.kr/
// @version      1.1.0
// @description  방송 종료 후 VOD(다시보기) 자동 재생을 비활성화합니다.
// @author       Jebibot
// @match        https://play.sooplive.co.kr/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sooplive.co.kr
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531675/SOOP%20-%20%EB%B0%A9%EC%A2%85%20%ED%9B%84%20VOD%20%EC%9E%90%EB%8F%99%EC%9E%AC%EC%83%9D%20%EB%81%84%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/531675/SOOP%20-%20%EB%B0%A9%EC%A2%85%20%ED%9B%84%20VOD%20%EC%9E%90%EB%8F%99%EC%9E%AC%EC%83%9D%20%EB%81%84%EA%B8%B0.meta.js
// ==/UserScript==

unsafeWindow.liveView.aContainer[1].autoPlayVodBanner = null;

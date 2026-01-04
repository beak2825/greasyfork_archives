// ==UserScript==
// @name         그블빤 한글 패치 링크
// @namespace    https://github.com/sidewinderk/gbfTransKor
// @version      0.9.22
// @description  그랑블루 판타지 한글 번역용 스크립트
// @icon         https://sidewinderk.github.io/gbfTransKor/images/get_started128.png
// @match      http://game.granbluefantasy.jp/*
// @match      https://game.granbluefantasy.jp/*
// @match      http://game.granbluefantasy.jp/*
// @match      http://gbf.game.mbga.jp/*
// @match      https://gbf.game.mbga.jp/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/403436/%EA%B7%B8%EB%B8%94%EB%B9%A4%20%ED%95%9C%EA%B8%80%20%ED%8C%A8%EC%B9%98%20%EB%A7%81%ED%81%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/403436/%EA%B7%B8%EB%B8%94%EB%B9%A4%20%ED%95%9C%EA%B8%80%20%ED%8C%A8%EC%B9%98%20%EB%A7%81%ED%81%AC.meta.js
// ==/UserScript==
(function() {
  const script = document.createElement('script');
  script.src = 'https://sidewinderk.github.io/gbfTransKor/gbfTrans.js';
  document.head.appendChild(script);
})();
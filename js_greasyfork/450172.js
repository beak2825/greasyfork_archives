// ==UserScript==
// @name         로스트사가 뽑기 스크립트
// @namespace    http://tampermonkey.net/
// @version      1
// @description  로스트사가 한가위 뽑기 쉽게하기! 지원 채널링 벨로프,다음,엠게임,네이버,한게임,위메이드
// @author       낭만모히칸
// @match        http://lostsaga.mgame.com/losaevent/2022/220824_thanksgiving/thanksgiving.asp
// @match        http://lostsaga-ko.valofe.com/losaevent/2022/220824_thanksgiving/thanksgiving.asp
// @match        http://www.lostsaga.com/losaevent/2022/220824_thanksgiving/thanksgiving.asp
// @match        http://lostsaga.game.daum.net/losaevent/2022/220824_thanksgiving/thanksgiving.asp
// @match        https://lostsaga.game.naver.com/losaevent/2022/220824_thanksgiving/thanksgiving.asp
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450172/%EB%A1%9C%EC%8A%A4%ED%8A%B8%EC%82%AC%EA%B0%80%20%EB%BD%91%EA%B8%B0%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/450172/%EB%A1%9C%EC%8A%A4%ED%8A%B8%EC%82%AC%EA%B0%80%20%EB%BD%91%EA%B8%B0%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==
setInterval(function() {
  document.querySelector("#divPopupBtn > button.btnLayerConfirm").click();
}, 250);
// ==UserScript==
// @name              뮬 문자/전화 버튼 PC 호환
// @description       PC에서도 뮬의 문자발송/전화걸기 버튼 활성화
// @match             https://www.mule.co.kr/*
// @icon              https://www.mule.co.kr/favicon/android-icon-192x192.png
// @grant             none
// @version           1.1
// @author            coofy
// @license           MIT
// @namespace         https://github.com/wecoofy/mule-helper-scripts
// @homepage          https://github.com/wecoofy/mule-helper-scripts
// @homepageURL       https://github.com/wecoofy/mule-helper-scripts
// @supportURL        https://github.com/wecoofy/mule-helper-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/546219/%EB%AE%AC%20%EB%AC%B8%EC%9E%90%EC%A0%84%ED%99%94%20%EB%B2%84%ED%8A%BC%20PC%20%ED%98%B8%ED%99%98.user.js
// @updateURL https://update.greasyfork.org/scripts/546219/%EB%AE%AC%20%EB%AC%B8%EC%9E%90%EC%A0%84%ED%99%94%20%EB%B2%84%ED%8A%BC%20PC%20%ED%98%B8%ED%99%98.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 문서 전체에 클릭 이벤트 리스너를 추가합니다.
  document.body.addEventListener("click", function (event) {
    // 클릭된 요소가 'div.phoneEncode'이거나 그 자식 요소인지 확인합니다.
    const phoneEncodeElement = event.target.closest("div.phoneEncode");

    // 만약 phoneEncodeElement를 찾았다면, 원하는 작업을 수행합니다.
    if (phoneEncodeElement) {
      console.log(phoneEncodeElement);

      // 여기에 원하는 로직을 추가하세요.
      // 예: 1초 후에 전화번호가 표시되면 버튼을 수정하는 로직
      // setTimeout(modifyButtons, 1000); // 1초 대기 후 실행
      modifyButtons();
    }
  });

  function modifyButtons() {
    const phoneDecodeDiv = document.querySelector(".phoneDecode");
    if (phoneDecodeDiv && phoneDecodeDiv.textContent.trim() !== "") {
      console.log("modifying buttons");
      // 여기에 버튼을 수정하는 코드를 추가합니다.
      const buttons = phoneDecodeDiv.querySelectorAll("a");
      const smsBtn = buttons[0];
      const telBtn = buttons[1];
      const phoneNumber = phoneDecodeDiv.childNodes[0].textContent.trim();

      smsBtn.href = `sms:${phoneNumber}`;
      telBtn.href = `tel:${phoneNumber}`;
    }
  }
})();
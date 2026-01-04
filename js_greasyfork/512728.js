// ==UserScript==
// @name         SOOP(숲) 채팅창 복사/붙여넣기 활성화 (by 도연)
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  SOOP(숲) 채팅창에서 복사/붙여넣기를 활성화하도록 변경합니다. (Made by 도연)
// @author       https://github.com/dokdo2013
// @license      MIT
// @match        https://play.sooplive.co.kr/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512728/SOOP%28%EC%88%B2%29%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EB%B3%B5%EC%82%AC%EB%B6%99%EC%97%AC%EB%84%A3%EA%B8%B0%20%ED%99%9C%EC%84%B1%ED%99%94%20%28by%20%EB%8F%84%EC%97%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512728/SOOP%28%EC%88%B2%29%20%EC%B1%84%ED%8C%85%EC%B0%BD%20%EB%B3%B5%EC%82%AC%EB%B6%99%EC%97%AC%EB%84%A3%EA%B8%B0%20%ED%99%9C%EC%84%B1%ED%99%94%20%28by%20%EB%8F%84%EC%97%B0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const update = () => {
        $("#write_area").off("cut copy paste");
        $("#write_area").on("cut copy", function(event) {
            event.stopPropagation();
            event.preventDefault();

            // 복사할 텍스트 가져오기
            const writtenText = $("#write_area").text();

            // 복사 처리
            if (navigator.clipboard) {
                navigator.clipboard.writeText(writtenText)
                .then(() => {
                    console.log('복사 완료:', writtenText);
                })
                .catch(err => {
                    console.error('복사 실패:', err);
                });
            } else {
                // Clipboard API가 지원되지 않는 경우
                document.execCommand('copy');
                console.log('복사 처리: execCommand 사용');
            }
        });

        $("#write_area").on("paste", function(event) {
            // 기본 동작을 허용
            event.stopPropagation(); // 다른 이벤트 전파 방지
            event.preventDefault(); // 이벤트 기본 동작 방지
            const clipboardData = event.originalEvent.clipboardData || window.clipboardData;
            const pastedData = clipboardData.getData('text');

            // 붙여넣기 텍스트를 수동으로 입력
            document.execCommand("insertText", false, pastedData);
        });

        console.log("enable copy/paste");
    };

    const interval = setInterval(update, 500);

    setTimeout(() => {
        clearInterval(interval)
    }, 30000);

})();

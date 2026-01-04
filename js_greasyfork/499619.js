// ==UserScript==
// @name          다음 카페 가입 없이 글 보기
// @namespace     다음 카페 가입 없이 글 보기
// @match         *://cafe.daum.net/*
// @version       0.1
// @description   가입 없이 다음 카페의 글을 볼 수있다, 다만 첨부파일 다운로드는 불가능하다. (게시판 자체에 등급이 있는 경우는 불가능하다.)
// @icon          data:image/jpeg;base64,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
// @author        mickey90427 <mickey90427@naver.com>
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499619/%EB%8B%A4%EC%9D%8C%20%EC%B9%B4%ED%8E%98%20%EA%B0%80%EC%9E%85%20%EC%97%86%EC%9D%B4%20%EA%B8%80%20%EB%B3%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/499619/%EB%8B%A4%EC%9D%8C%20%EC%B9%B4%ED%8E%98%20%EA%B0%80%EC%9E%85%20%EC%97%86%EC%9D%B4%20%EA%B8%80%20%EB%B3%B4%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CafeAPP 객체에서 GRPCODE와 FLDID 값을 가져오기
    const GRPCODE = CAFEAPP.GRPCODE;
    const FLDID = CAFEAPP.FLDID;

    // 링크를 변경할 대상 선택
    const titleWrappers = document.querySelectorAll('.title_wrapper');

    titleWrappers.forEach(wrapper => {
        // 각 title_wrapper 내의 앵커 태그를 선택
        const link = wrapper.querySelector('a.txt_item');

        if (link) {
            // href 속성에서 datanum 값을 추출
            const urlParams = new URLSearchParams(link.href);
            const datanum = urlParams.get('datanum');

            if (datanum) {
                // 링크를 새로운 형식으로 변경
                link.href = `https://${CAFEAPP.CAFE_HOST}/${GRPCODE}/${FLDID}/${datanum}?svc=cafeapi`;
            }
        }
    });
})();
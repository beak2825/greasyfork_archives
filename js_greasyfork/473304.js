// ==UserScript==
// @name         전자도서관 준회원 대출
// @namespace    http://medAndro
// @version      0.3.3
// @description  E-book check-out bypass
// @author       medAndro
// @match        https://www.gaplib.go.kr/intro/menu/10047/contents/40031/contents.do*
// @match        https://www.ydplib.or.kr/intro/40010/contents.do*
// @match        https://lib.gwangyang.go.kr/content/view.do?menuCd=L001004*
// @match        https://library.suncheon.go.kr/content/view.do?menuCd=L001004
// @match        https://www.splib.or.kr/intro/contents/40002/contents.do*
// @match        https://www.junggulib.or.kr/SJGL/menu/10024/contents/40001/contents.do*
// @match        https://b2bwv.yes24.com/*


// @icon         https://www.google.com/s2/favicons?sz=64&domain=go.kr

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473304/%EC%A0%84%EC%9E%90%EB%8F%84%EC%84%9C%EA%B4%80%20%EC%A4%80%ED%9A%8C%EC%9B%90%20%EB%8C%80%EC%B6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/473304/%EC%A0%84%EC%9E%90%EB%8F%84%EC%84%9C%EA%B4%80%20%EC%A4%80%ED%9A%8C%EC%9B%90%20%EB%8C%80%EC%B6%9C.meta.js
// ==/UserScript==



//스크립트 필요없는곳
//세종특별자치시 평생교육학습관 https://lib.sje.go.kr/sjelib/sub01_11.do
//경북학숙 https://www.kydel.or.kr/

(function() {
    'use strict';
    // 버튼 생성
    function createButton(text, onClick, offset) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = `${20 + offset}px`;
        button.style.zIndex = '9999';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 반투명 검정색 배경
        button.style.color = 'white'; // 텍스트 색상은 하얀색
        button.style.padding = '10px 20px'; // 버튼 내부 여백
        button.style.border = 'none'; // 테두리 제거
        button.style.borderRadius = '5px'; // 모서리 둥근 정도
        button.style.cursor = 'pointer'; // 커서 모양 변경
        button.addEventListener('click', onClick);
        return button;
    }
    //소장
    function sojangFunction() {
        var form;
        if (window.location.href.includes('gwangyang')) {
            // 광양시립도서관 소장
            $("[name='loginform']").submit();
        }
        if (window.location.href.includes('suncheon')) {
            // 순천시립도서관 소장
            $("[name='loginform']").submit();
        }
        if (window.location.href.includes('gaplib')) {
            // 가평군도서관 소장
            form = document.ebookForm;
            form.action = "http://ebook.gaplib.go.kr/member_sso.asp";
            form.target="ebookForm";
            form.submit();
        }
        if (window.location.href.includes('ydplib')) {
            // 영등포구립도서관 소장
            form = document.ebookForm;
            form.submit();
        }
        if (window.location.href.includes('junggulib')) {
            // 중구구립도서관
            form = document.ebookForm;
            form.submit();
        }
        if (window.location.href.includes('splib')) {
            // 송파구구립도서관
            form = document.ebookForm;
            form.submit();
        }
    }

    //구독
    function gudokFunction() {
        var form;
        if (window.location.href.includes('gwangyang')) {
            // 광양시립도서관 구독
            $("[name='loginform2']").submit();
        }
        if (window.location.href.includes('suncheon')) {
            // 순천시립도서관 구독
            $("[name='loginform2']").submit();
        }
        if (window.location.href.includes('gaplib')) {
            // 가평군도서관 구독
            form = document.ebookKbForm;
            form.action = "https://gaplib.dkyobobook.co.kr/frontapi/mmbrLnkg.ink";
            form.target="ebookKbForm";
            form.submit();
        }
        if (window.location.href.includes('ydplib')) {
            // 영등포구립도서관 구독
            form = document.subEbookForm;
            form.submit();
        }

        if (window.location.href.includes('junggulib')) {
            // 중구구립도서관
            form = document.ebookForm;
            form.submit();
        }
        if (window.location.href.includes('splib')) {
            // 송파구립도서관
            form = document.ebookForm;
            form.submit();
        }
    }

    const sojang = createButton('소장', sojangFunction, 0);
    const gudok = createButton('구독', gudokFunction, 90);
    document.body.appendChild(gudok);
    document.body.appendChild(sojang);

    if (window.location.href.includes('b2bwv.yes24.com')) {
        setTimeout(() => {
            document.querySelector("body").requestFullscreen();
        }, "1000");

    }

})();
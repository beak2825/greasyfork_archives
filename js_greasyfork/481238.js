// ==UserScript==
// @name         전자도서관 준회원 우회
// @version      0.1
// @description  지원 도서관 : 강서구 통합도서관
// @author       You
// @match        https://lib.gangseo.seoul.kr/Ebook
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seoul.kr
// @grant        none
// @namespace https://greasyfork.org/users/319515
// @downloadURL https://update.greasyfork.org/scripts/481238/%EC%A0%84%EC%9E%90%EB%8F%84%EC%84%9C%EA%B4%80%20%EC%A4%80%ED%9A%8C%EC%9B%90%20%EC%9A%B0%ED%9A%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/481238/%EC%A0%84%EC%9E%90%EB%8F%84%EC%84%9C%EA%B4%80%20%EC%A4%80%ED%9A%8C%EC%9B%90%20%EC%9A%B0%ED%9A%8C.meta.js
// ==/UserScript==

const linksToRemove = document.querySelector('.btns').querySelectorAll('a');

// 선택된 모든 <a> 태그를 제거합니다.
linksToRemove.forEach(link => {
    link.remove();
});


const owned_book = document.createElement('a');
owned_book.textContent = '소장형 전자책 우회하기 〉';
owned_book.classList.add('btTxt', 'min', 'bg', 'primary');
owned_book.addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById("ssoEbook").submit();
});

const subscribe_book = document.createElement('a');
subscribe_book.textContent = '구독형 전자책(오디오북 포함) 우회하기 〉';

subscribe_book.classList.add('btTxt', 'min', 'bg', 'primary');
subscribe_book.addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById("ssoEbookSubscription").submit();
});

const btnsElement = document.querySelector('.btns');
btnsElement.appendChild(owned_book);
btnsElement.appendChild(subscribe_book);
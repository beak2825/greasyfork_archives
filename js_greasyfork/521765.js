// ==UserScript==
// @name         종.삼체 필터
// @namespace    http://tampermonkey.net/
// @version      2024-12-25
// @description  ...을 빼고보자
// @author       al6uiz
// @match        https://www.clien.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521765/%EC%A2%85%EC%82%BC%EC%B2%B4%20%ED%95%84%ED%84%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/521765/%EC%A2%85%EC%82%BC%EC%B2%B4%20%ED%95%84%ED%84%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

// 공통 처리 함수
function filterDots(content) {
    return content.replace(/\.\.+/g, ' ');
}

const postArticleDiv = document.querySelector('div.post_article');
if (postArticleDiv) {
    const content = postArticleDiv.innerHTML;
    const doubleDotsCount = (content.match(/\.\./g) || []).length;
    const tripleDotsCount = (content.match(/\.\.\./g) || []).length;

    if (doubleDotsCount + tripleDotsCount >= 10) {
        ['div.post_article', 'div.comment_view', 'div.writer_list', '.post_subject'].forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.innerHTML = filterDots(element.innerHTML);
            });
        });
    }
}

})();

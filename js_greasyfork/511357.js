// ==UserScript==
// @name         Select to decode base64
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically decodes Base64 encoded text
// @author       raculus
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511357/Select%20to%20decode%20base64.user.js
// @updateURL https://update.greasyfork.org/scripts/511357/Select%20to%20decode%20base64.meta.js
// ==/UserScript==

(function() {
document.addEventListener('mouseup', handleSelection);
document.addEventListener('keyup', handleSelection);

function handleSelection() {
    const selectedText = window.getSelection().toString();

    if (selectedText) {
        console.log('선택된 텍스트:', selectedText);

        // Base64 디코딩 시도
        const decodedText = decodeBase64(selectedText);

        if (decodedText) {
            console.log('Base64 디코딩 성공:', decodedText);

            replaceSelectedContent(decodedText);
        } else {
            console.log('선택된 텍스트는 Base64 형식이 아닙니다.');
        }
    }
}

// Base64 디코딩 함수
function decodeBase64(text) {
    try {
        return atob(text);
    } catch (e) {
        return null; // Base64 디코딩 실패 시 null 반환
    }
}

// 선택된 내용을 대체하는 함수 (텍스트 또는 링크)
function replaceSelectedContent(content) {
    const selection = window.getSelection();

    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents(); // 기존 선택 영역의 텍스트 삭제

    let newNode;
    if ( isValidURL(content) ) {
        // <a> 태그 생성 및 설정
        newNode = document.createElement('a');
        newNode.href = content;
        newNode.textContent = content;
        newNode.style.color = 'blue'; // 링크 스타일 설정 (선택 사항)
        newNode.style.textDecoration = 'underline'; // 밑줄 추가
    } else {
        // 일반 텍스트 노드 삽입
        newNode = document.createTextNode(content);
    }

    range.insertNode(newNode);

    // 선택 영역 초기화
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNode(newNode);
    selection.addRange(newRange);
}

// URL 유효성 검증 함수
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
})();

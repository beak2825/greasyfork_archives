// ==UserScript==
// @name         Google Keep Input Tab
// @namespace    http://tampermonkey.net/
// @version      2024-05-29
// @description  Make it possible to input "Tab" in Google Keep
// @author       Ravenclaw5874
// @match        *://keep.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496435/Google%20Keep%20Input%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/496435/Google%20Keep%20Input%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 원하는 들여쓰기 문자열 (예: 4개의 공백 또는 "\t"로 변경 가능)
    const indent = "\t";

    document.addEventListener('keydown', function(e) {
        // Google Keep의 contenteditable div에만 적용
        if (e.key === "Tab" && e.target.isContentEditable) {
            e.preventDefault(); // 기본 탭 동작을 방지합니다.

            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            let startContainer = range.startContainer;
            const startOffset = range.startOffset;
            const defaultTextContainer = startContainer.previousElementSibling;

            // 텍스트 노드가 아닌 경우 텍스트 노드로 변환
            if (startContainer.nodeType !== Node.TEXT_NODE) {
                if (startContainer.childNodes.length === 0 && defaultTextContainer) {
                    startContainer.appendChild(document.createTextNode(""));
                    defaultTextContainer.style.display = 'none';
                }
                startContainer = startContainer.childNodes[0];
            }


            // 들여쓰기 추가
            const text = startContainer.textContent;
            const beforeText = text.substring(0, startOffset);
            const afterText = text.substring(startOffset);
            const newText = beforeText + indent + afterText;

            startContainer.textContent = newText;

            // 커서를 들여쓰기 뒤에 위치시킴
            range.setStart(startContainer, startOffset + indent.length);
            range.setEnd(startContainer, startOffset + indent.length);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
})();

// ==UserScript==
// @name         디시 에디터 이미지 링크 기능 추가
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  이미지 링크 거는 기능
// @match        https://gall.dcinside.com/mgallery/board/write/*
// @match        https://gall.dcinside.com/mgallery/board/modify/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542248/%EB%94%94%EC%8B%9C%20%EC%97%90%EB%94%94%ED%84%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%A7%81%ED%81%AC%20%EA%B8%B0%EB%8A%A5%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/542248/%EB%94%94%EC%8B%9C%20%EC%97%90%EB%94%94%ED%84%B0%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%A7%81%ED%81%AC%20%EA%B8%B0%EB%8A%A5%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const observer = new MutationObserver(() => {
            const toolbar = document.querySelector('.note-toolbar');
            if (toolbar) {
                // 이미지 링크 버튼 추가 (AI이미지 버튼은 그대로 놔둠)
                const linkButtonDiv = document.createElement('div');
                linkButtonDiv.className = 'note-btn-group';

                const linkButton = document.createElement('button');
                linkButton.type = 'button';
                linkButton.className = 'note-btn';
                linkButton.innerText = '이미지 링크';
                linkButton.style.padding = '4px 8px';
                linkButton.onclick = openPopup;

                linkButtonDiv.appendChild(linkButton);
                toolbar.querySelector('.note-btn-group').after(linkButtonDiv);

                console.log("이미지 링크 버튼 추가 완료");

                observer.disconnect(); // 버튼 추가 완료했으니 감시 중단
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function openPopup() {
        const url = prompt("이미지에 걸 링크를 입력하세요:");
        if (!url) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) {
            alert("이미지를 선택하고 버튼을 눌러주세요!");
            return;
        }

        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        let img = null;

        // 현재 선택한 곳에서 이미지 찾기
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
                img = node;
            } else {
                img = node.querySelector('img');
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentElement) {
                if (node.parentElement.tagName === 'IMG') {
                    img = node.parentElement;
                } else {
                    img = node.parentElement.querySelector('img');
                }
            }
        }

        if (!img) {
            alert("이미지를 선택하고 버튼을 눌러주세요!");
            return;
        }

        // 이미지에 링크 추가
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        img.parentNode.insertBefore(link, img);
        link.appendChild(img);

        console.log("링크 삽입 완료:", url);
    }

    window.addEventListener('load', init);
})();

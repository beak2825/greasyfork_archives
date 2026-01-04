// ==UserScript==
// @name          Google Maps 위치 공유창 좌표추출
// @namespace     Google Maps 위치 공유창 좌표추출
// @version       0.1
// @description   구글맵 공유창에 좌표추출 버튼을 넣습니다
// @match         *://www.google.com/maps*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=google.com/maps
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/540289/Google%20Maps%20%EC%9C%84%EC%B9%98%20%EA%B3%B5%EC%9C%A0%EC%B0%BD%20%EC%A2%8C%ED%91%9C%EC%B6%94%EC%B6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/540289/Google%20Maps%20%EC%9C%84%EC%B9%98%20%EA%B3%B5%EC%9C%A0%EC%B0%BD%20%EC%A2%8C%ED%91%9C%EC%B6%94%EC%B6%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createExtractButton(sharePopup) {
        if (sharePopup.querySelector('#gm-share-extract-btn')) return null; // 이미 있으면 중복 방지

        const btn = document.createElement('button');
        btn.id = 'gm-share-extract-btn';
        btn.textContent = '좌표 및 주소 복사';
        btn.style.cssText = `
            margin-top: 12px;
            padding: 8px 16px;
            font-family: "Google Sans", Roboto, "Noto Sans KR", Arial, sans-serif;
            font-size: 14px;
            background-color: #4285F4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        btn.addEventListener('click', () => {
            const coordElem = sharePopup.querySelector('.TDF87d');
            const addrElem = sharePopup.querySelector('.vKmG2c');
            if (!coordElem || !addrElem) {
                alert('좌표 또는 주소를 찾을 수 없습니다.');
                return;
            }
            const coords = coordElem.textContent.trim();
            const address = addrElem.textContent.trim();
            const mapLink = `https://www.google.com/maps?q=${coords.replace(/\s/g, '')}`;
            const textToCopy = `${address}\n${mapLink}`;

            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(textToCopy);
                alert('주소와 구글맵 링크가 클립보드에 복사되었습니다:\n\n' + textToCopy);
            } else {
                fallbackCopy(textToCopy);
            }
        });

        return btn;
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            alert('주소와 구글맵 링크가 클립보드에 복사되었습니다:\n\n' + text);
        } catch {
            alert('복사 실패. 수동으로 복사하세요:\n\n' + text);
        }
        document.body.removeChild(ta);
    }

    function tryInsertButton() {
        // 공유 팝업 컨테이너 (최신 구조 기준)
        const sharePopup = document.querySelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde');
        if (!sharePopup) return;

        if (!sharePopup.querySelector('#gm-share-extract-btn')) {
            const btn = createExtractButton(sharePopup);
            if (!btn) return;

            // 공유할 링크 영역 위에 삽입
            const target = sharePopup.querySelector('.NB4yxe');
            if (target) {
                target.parentNode.insertBefore(btn, target);
            } else {
                sharePopup.appendChild(btn);
            }
        }
    }

    // MutationObserver로 body 하위 변경 감지하여 공유창 등장 시 버튼 삽입 시도
    const observer = new MutationObserver(() => {
        tryInsertButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 페이지 로딩 후 한 번 시도
    window.addEventListener('load', tryInsertButton);

})();

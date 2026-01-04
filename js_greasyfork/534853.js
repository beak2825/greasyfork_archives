// ==UserScript==
// @name         품번으로 hitomi 이동 (좌측 하단 라운딩, 상단 닫기, 온/오프)
// @namespace    dendenmushi
// @version      4.7.1
// @description  모바일에서 6~7자리 숫자를 드래그하면 hitomi 이동 버튼을 제공하는 자동 크기 2단 리스트 형태의 UI를 화면 좌측 하단에 고정 표시하며, 모든 귀퉁이가 둥글고 닫기 버튼이 상단에 있습니다. 온/오프 버튼 제공.
// @author       dendenmushi with Gemini
// @match        *://*/*
// @license      MIT
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534853/%ED%92%88%EB%B2%88%EC%9C%BC%EB%A1%9C%20hitomi%20%EC%9D%B4%EB%8F%99%20%28%EC%A2%8C%EC%B8%A1%20%ED%95%98%EB%8B%A8%20%EB%9D%BC%EC%9A%B4%EB%94%A9%2C%20%EC%83%81%EB%8B%A8%20%EB%8B%AB%EA%B8%B0%2C%20%EC%98%A8%EC%98%A4%ED%94%84%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534853/%ED%92%88%EB%B2%88%EC%9C%BC%EB%A1%9C%20hitomi%20%EC%9D%B4%EB%8F%99%20%28%EC%A2%8C%EC%B8%A1%20%ED%95%98%EB%8B%A8%20%EB%9D%BC%EC%9A%B4%EB%94%A9%2C%20%EC%83%81%EB%8B%A8%20%EB%8B%AB%EA%B8%B0%2C%20%EC%98%A8%EC%98%A4%ED%94%84%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let draggedNumber = null;
    let isFeatureEnabled = localStorage.getItem('dragFeatureEnabled') === 'true' || true; // 기본 On

    GM_addStyle(`
        #drag-feature-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: rgba(128, 128, 128, 0.5); /* 기본 반투명 회색 */
            color: white; /* 항상 흰색 H */
            font-size: 1.5em;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
            text-transform: uppercase;
            font-weight: bold;
        }
        #drag-button-list-container {
            display: none;
            position: fixed;
            bottom: 20px; /* 아래 여백 조정 및 고정 */
            left: 20px; /* 왼쪽 여백 조정 및 고정 */
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 10px; /* 모든 귀퉁이 라운딩 */
            z-index: 10000;
            text-align: left;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* 왼쪽 정렬 */
            width: auto; /* 내용에 따라 너비 자동 조정 */
            max-width: 80vw; /* 최대 너비 제한 (필요에 따라 조정) */
        }
        #drag-button-list-container.show {
            display: flex;
        }
        #drag-button-list-container button.close-button {
            background: none;
            border: none;
            color: #ccc;
            cursor: pointer;
            font-size: 1em;
            align-self: flex-end; /* 오른쪽 상단 배치 */
            margin-bottom: 5px; /* 제목과의 간격 */
        }
        #drag-button-list-container h2 {
            margin: 0 0 10px 0;
            font-size: 1.1em;
            width: 100%;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        #drag-button-list-container a {
            display: block;
            background-color: #5cb85c;
            color: white;
            padding: 8px 15px;
            text-decoration: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            margin-bottom: 5px;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
        }
        #toast-message {
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        #toast-message.show {
            opacity: 1;
        }
    `);

    let toastTimeout;

    function showToast(message) {
        const toast = document.getElementById('toast-message') || document.createElement('div');
        toast.id = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 1500);
    }

    function showButtonList(number) {
        const container = document.getElementById('drag-button-list-container') || createButtonListContainer();
        container.innerHTML = `
            <button class="close-button">×</button>
            <h2>${number}</h2>
            <a href="https://hitomi.la/reader/${number}.html" target="_blank">hitomi 이동</a>
        `;
        container.classList.add('show');
        document.body.appendChild(container);

        const closeButton = container.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                container.classList.remove('show');
            });
        }
    }

    function createButtonListContainer() {
        const container = document.createElement('div');
        container.id = 'drag-button-list-container';
        return container;
    }

    document.addEventListener('touchend', function(event) {
        if (isFeatureEnabled) {
            const selectedText = window.getSelection().toString().trim();
            const numberRegex = /^\d{6,7}$/;

            if (numberRegex.test(selectedText)) {
                draggedNumber = selectedText;
                showButtonList(draggedNumber);
            }
            window.getSelection().removeAllRanges();
        }
    });

    // 온/오프 버튼 생성
    const toggleButton = document.createElement('div');
    toggleButton.id = 'drag-feature-toggle';
    toggleButton.textContent = 'H';
    toggleButton.classList.toggle('enabled', isFeatureEnabled);
    document.body.appendChild(toggleButton);

    // 온/오프 버튼 클릭 이벤트 리스너
    toggleButton.addEventListener('click', function() {
        isFeatureEnabled = !isFeatureEnabled;
        toggleButton.classList.toggle('enabled', isFeatureEnabled);
        localStorage.setItem('dragFeatureEnabled', isFeatureEnabled); // 상태 저장
        showToast(`드래그 기능이 ${isFeatureEnabled ? '활성화' : '비활성화'}되었습니다.`);
    });

    // 페이지 로드 시 버튼 초기 상태 설정
    if (isFeatureEnabled) {
        toggleButton.classList.add('enabled');
    }
})();
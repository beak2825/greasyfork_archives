// ==UserScript==
// @name         Band Ctrl+Enter Post And AutoSave
// @namespace    http://band.us/
// @version      0.3
// @description  add Ctrl(cmd)+Enter Posting to Band.us, with AutoSave and Load button. 
// @author       explainpark101
// @match        https://www.band.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=band.us
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539771/Band%20Ctrl%2BEnter%20Post%20And%20AutoSave.user.js
// @updateURL https://update.greasyfork.org/scripts/539771/Band%20Ctrl%2BEnter%20Post%20And%20AutoSave.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 새로 추가된 버튼의 스타일을 정의합니다 ---
    GM_addStyle(`
        .load-temp-save-button {
            margin-left: 8px;
            background-color: #64748b;
            color: white;
            padding: 0 16px;
            height: 40px;
            border-radius: 8px;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .load-temp-save-button:hover {
            background-color: #475569;
        }
    `);

    const autoSave = (e) => {
        // 글쓰기 영역을 더 구체적으로 타겟팅합니다.
        const editor = e.target.closest('[contenteditable="true"]');
        if (!editor || editor.innerText.trim() === '') return;
        localStorage.setItem(location.pathname + "/tempsave", editor.innerText.replaceAll("\n\n", "\n"));
    };

    const loadSave = async () => {
        const savedText = localStorage.getItem(location.pathname + "/tempsave");
        if (!savedText) return;

        try {
            await navigator.clipboard.writeText(savedText);
            alert("임시저장 내용이 클립보드에 복사되었습니다. (Ctrl+V로 붙여넣으세요)");
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
            alert("클립보드 복사에 실패했습니다.");
        }
    };

    const addLoadButton = () => {
        // 이미 버튼이 추가되었는지 확인
        if (document.querySelector('.load-temp-save-button')) {
            return true;
        }

        const submitButtonContainer = document.querySelector(".buttonSubmit");
        if (submitButtonContainer) {
            const loadButton = document.createElement('button');
            loadButton.textContent = '임시저장 불러오기';
            loadButton.type = 'button'; // form 제출을 방지
            loadButton.className = 'uButton -sizeM _btnSubmitPost';

            loadButton.addEventListener('click', loadSave);

            submitButtonContainer.insertAdjacentElement("afterBegin", loadButton);
            return true; // 버튼 추가 성공
        }
        return false; // 컨테이너를 못찾아 추가 실패
    };

    // --- 페이지 로드 시 임시저장 데이터가 있으면 버튼을 추가하는 로직 ---
    const savedData = localStorage.getItem(location.pathname + "/tempsave");
    if (savedData) {
        const checkInterval = setInterval(() => {
            // 버튼 추가를 시도하고, 성공하면 인터벌을 중단합니다.
            if (addLoadButton()) {
                clearInterval(checkInterval);
            }
        }, 500); // 0.5초마다 확인
    }


    window.addEventListener("keyup", e => {
        if (!location.pathname.startsWith("/band")) return;

        // Ctrl + Enter로 게시물 등록
        if (e.code == "Enter" && (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
            document.querySelector(`div.buttonArea button[type="submit"]`)?.click();
            localStorage.removeItem(location.pathname + "/tempsave");
            return;
        }

        if (document.querySelector(`div.buttonArea button[type="submit"]:not(:disabled)`)) autoSave(e);
    });
})();
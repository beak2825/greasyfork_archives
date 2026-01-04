// ==UserScript==
// @name         롤캐 채팅 단어 변환
// @version      0.1
// @description  사용자가 입력한 단어를 이미지로 교체하고 크기 설정 가능, 메뉴로 UI 토글, 새로고침 시 데이터 유지
// @match        https://insagirl-toto.appspot.com/chatting/lgic/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/732026
// @downloadURL https://update.greasyfork.org/scripts/530248/%EB%A1%A4%EC%BA%90%20%EC%B1%84%ED%8C%85%20%EB%8B%A8%EC%96%B4%20%EB%B3%80%ED%99%98.user.js
// @updateURL https://update.greasyfork.org/scripts/530248/%EB%A1%A4%EC%BA%90%20%EC%B1%84%ED%8C%85%20%EB%8B%A8%EC%96%B4%20%EB%B3%80%ED%99%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 단어와 이미지 정보 매핑 객체 (초기화 시 localStorage에서 불러옴)
    let wordToImageMap = GM_getValue('wordToImageMap', {}) || {};

    // UI가 열려 있는지 추적하는 변수
    let uiDiv = null;

    // 텍스트를 이미지로 교체하는 함수
    function replaceTextWithImage() {
        const talks = document.querySelectorAll('.talk');
        talks.forEach(talk => {
            let content = talk.textContent;
            for (const [word, { url, size }] of Object.entries(wordToImageMap)) {
                if (content.includes(word)) {
                    talk.innerHTML = talk.innerHTML.replace(
                        new RegExp(word, 'g'),
                        `<img src="${url}" alt="${word}" style="width: ${size}px; height: ${size}px; vertical-align: middle;">`
                    );
                }
            }
        });
    }

    // 데이터를 저장하는 함수
    function saveWordToImageMap() {
        GM_setValue('wordToImageMap', wordToImageMap);
    }

    // 리스트 UI 업데이트 함수
    function updateListUI(listContainer) {
        listContainer.innerHTML = ''; // 기존 리스트 초기화
        for (const [word, { url, size }] of Object.entries(wordToImageMap)) {
            const listItem = document.createElement('div');
            listItem.style.margin = '5px 0';
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';
            listItem.style.padding = '4px';
            listItem.style.backgroundColor = '#f9f9f9';
            listItem.style.borderRadius = '3px';

            const text = document.createElement('span');
            text.textContent = `${word} → ${url} (${size}px)`;
            text.style.flexGrow = '1';
            text.style.wordBreak = 'break-all';
            text.style.color = '#333';
            text.style.fontSize = '12px';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.style.marginLeft = '5px';
            deleteButton.style.padding = '2px 6px';
            deleteButton.style.backgroundColor = '#ff4d4d';
            deleteButton.style.color = '#fff';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '3px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.fontSize = '12px';
            deleteButton.style.transition = 'background-color 0.2s';
            deleteButton.addEventListener('mouseover', () => deleteButton.style.backgroundColor = '#e63939');
            deleteButton.addEventListener('mouseout', () => deleteButton.style.backgroundColor = '#ff4d4d');
            deleteButton.addEventListener('click', () => {
                delete wordToImageMap[word]; // 객체에서 단어 삭제
                saveWordToImageMap(); // 삭제 후 저장
                updateListUI(listContainer); // 리스트 갱신
                replaceTextWithImage(); // 채팅창 갱신
            });

            listItem.appendChild(text);
            listItem.appendChild(deleteButton);
            listContainer.appendChild(listItem);
        }
    }

    // 입력 및 리스트 UI 생성/표시 함수
    function toggleInputUI() {
        if (uiDiv && document.body.contains(uiDiv)) {
            // UI가 이미 열려 있으면 닫기
            document.body.removeChild(uiDiv);
            uiDiv = null;
            return;
        }

        // UI 생성
        uiDiv = document.createElement('div');
        uiDiv.style.position = 'fixed';
        uiDiv.style.top = '10px';
        uiDiv.style.right = '10px';
        uiDiv.style.zIndex = '1000';
        uiDiv.style.backgroundColor = '#ffffff';
        uiDiv.style.padding = '10px';
        uiDiv.style.borderRadius = '6px';
        uiDiv.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        uiDiv.style.maxWidth = '300px'; // 최대 너비 유지
        uiDiv.style.fontFamily = 'Arial, sans-serif';

        // 닫기 버튼 추가
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.width = '20px';
        closeButton.style.height = '20px';
        closeButton.style.backgroundColor = '#ddd';
        closeButton.style.color = '#555';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '50%';
        closeButton.style.fontSize = '14px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.display = 'flex';
        closeButton.style.alignItems = 'center';
        closeButton.style.justifyContent = 'center';
        closeButton.style.transition = 'background-color 0.2s';
        closeButton.addEventListener('mouseover', () => closeButton.style.backgroundColor = '#ccc');
        closeButton.addEventListener('mouseout', () => closeButton.style.backgroundColor = '#ddd');
        closeButton.addEventListener('click', toggleInputUI);
        uiDiv.appendChild(closeButton);

        // 입력 영역
        const inputContainer = document.createElement('div');
        inputContainer.style.marginBottom = '10px';
        inputContainer.style.marginTop = '15px'; // 닫기 버튼과 간격 유지

        const wordInput = document.createElement('input');
        wordInput.type = 'text';
        wordInput.placeholder = '단어';
        wordInput.style.width = '100%'; // 가로폭 100%
        wordInput.style.padding = '6px';
        wordInput.style.marginBottom = '5px'; // 아래쪽 간격
        wordInput.style.border = '1px solid #ddd';
        wordInput.style.borderRadius = '3px';
        wordInput.style.outline = 'none';
        wordInput.style.fontSize = '12px';
        wordInput.style.transition = 'border-color 0.2s';
        wordInput.addEventListener('focus', () => wordInput.style.borderColor = '#007bff');

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'URL';
        urlInput.style.width = '100%'; // 가로폭 100%
        urlInput.style.padding = '6px';
        urlInput.style.marginBottom = '5px'; // 아래쪽 간격
        urlInput.style.border = '1px solid #ddd';
        urlInput.style.borderRadius = '3px';
        urlInput.style.outline = 'none';
        urlInput.style.fontSize = '12px';
        urlInput.style.transition = 'border-color 0.2s';
        urlInput.addEventListener('focus', () => urlInput.style.borderColor = '#007bff');

        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.placeholder = 'px';
        sizeInput.style.width = '50px'; // 크기 필드는 작게 유지
        sizeInput.style.padding = '6px';
        sizeInput.style.border = '1px solid #ddd';
        sizeInput.style.borderRadius = '3px';
        sizeInput.style.outline = 'none';
        sizeInput.style.fontSize = '12px';
        sizeInput.style.transition = 'border-color 0.2s';
        sizeInput.min = '1';
        sizeInput.addEventListener('focus', () => sizeInput.style.borderColor = '#007bff');

        const addButton = document.createElement('button');
        addButton.textContent = '추가';
        addButton.style.padding = '6px 8px';
        addButton.style.backgroundColor = '#007bff';
        addButton.style.color = '#fff';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '3px';
        addButton.style.cursor = 'pointer';
        addButton.style.fontSize = '12px';
        addButton.style.transition = 'background-color 0.2s';
        addButton.style.marginLeft = '5px'; // 크기 입력과 간격
        addButton.addEventListener('mouseover', () => addButton.style.backgroundColor = '#0056b3');
        addButton.addEventListener('mouseout', () => addButton.style.backgroundColor = '#007bff');
        addButton.addEventListener('click', () => {
            const word = wordInput.value.trim();
            const imgUrl = urlInput.value.trim();
            const size = parseInt(sizeInput.value) || 24; // 입력값 없으면 기본 24px
            if (word && imgUrl) {
                wordToImageMap[word] = { url: imgUrl, size: size };
                saveWordToImageMap(); // 추가 후 저장
                replaceTextWithImage(); // 즉시 반영
                updateListUI(listContainer); // 리스트 갱신
                wordInput.value = '';
                urlInput.value = '';
                sizeInput.value = '';
            } else {
                alert('단어와 이미지 URL을 모두 입력해주세요.');
            }
        });

        // 입력 필드와 버튼을 컨테이너에 추가
        inputContainer.appendChild(wordInput);
        inputContainer.appendChild(urlInput);
        const sizeAddContainer = document.createElement('div');
        sizeAddContainer.style.display = 'flex';
        sizeAddContainer.style.alignItems = 'center';
        sizeAddContainer.appendChild(sizeInput);
        sizeAddContainer.appendChild(addButton);
        inputContainer.appendChild(sizeAddContainer);

        // 리스트 영역
        const listContainer = document.createElement('div');
        listContainer.style.maxHeight = '150px'; // 높이 유지
        listContainer.style.overflowY = 'auto';
        listContainer.style.padding = '4px';
        listContainer.style.backgroundColor = '#fff';
        listContainer.style.borderRadius = '3px';
        listContainer.style.border = '1px solid #eee';

        uiDiv.appendChild(inputContainer);
        uiDiv.appendChild(listContainer);
        document.body.appendChild(uiDiv);

        // 초기 리스트 표시
        updateListUI(listContainer);
    }

    // 탬퍼몽키 메뉴에 "설정" 항목 추가
    GM_registerMenuCommand('설정', toggleInputUI);

    // MutationObserver 설정
    const observer = new MutationObserver(replaceTextWithImage);
    const chattings = document.getElementById('chattings');
    if (chattings) {
        observer.observe(chattings, { childList: true, subtree: true });
        replaceTextWithImage(); // 초기 실행
    } else {
        console.error('#chattings 요소를 찾을 수 없습니다.');
    }
})();
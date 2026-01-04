// ==UserScript==
// @name         Humoruniv Block User Script
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Blocks posts and comments from specific users on humoruniv.com
// @match        https://m.humoruniv.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/498551/Humoruniv%20Block%20User%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/498551/Humoruniv%20Block%20User%20Script.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    if (window.self !== window.top || location.href.includes('memo.html?')) {
        return; // Exit if the script is running in an iframe
    }
 
    let blindList = JSON.parse(localStorage.getItem('blindList') || '[]');
    let currentPage = 1;
    const itemsPerPage = 5;
 
    function saveBlindList() {
        localStorage.setItem('blindList', JSON.stringify(blindList));
    }
 
    function addUserToBlindList(nickname) {
        if (nickname && !blindList.some(user => user.nickname === nickname)) {
            blindList.unshift({ nickname: nickname, date: new Date().toLocaleString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }) });
            saveBlindList();
            renderBlindList();
            hidePosts();
            hideComments();
        }
    }
 
    function removeUserFromBlindList(nickname) {
        blindList = blindList.filter(user => user.nickname !== nickname);
        saveBlindList();
        renderBlindList();
    }
 
    function renderBlindList() {
        const listElement = document.getElementById('blindList');
        listElement.innerHTML = '';
 
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = blindList.slice(start, end);
 
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
 
        paginatedItems.forEach(user => {
            const row = table.insertRow();
            row.style.borderBottom = '1px solid #ddd';
 
            const cell1 = row.insertCell(0);
            cell1.style.padding = '4px';
            cell1.textContent = user.nickname;
 
            const cell2 = row.insertCell(1);
            cell2.style.padding = '4px';
            cell2.textContent = user.date;
 
            const cell3 = row.insertCell(2);
            cell3.style.padding = '4px';
            const removeButton = document.createElement('button');
            removeButton.textContent = '삭제';
            removeButton.onclick = () => removeUserFromBlindList(user.nickname);
            removeButton.style.padding = '4px 8px';
            removeButton.style.border = 'none';
            removeButton.style.backgroundColor = '#ff3b30';
            removeButton.style.color = 'white';
            removeButton.style.borderRadius = '4px';
            removeButton.style.cursor = 'pointer';
            cell3.appendChild(removeButton);
        });
 
        // 빈칸 채우기
        for (let i = paginatedItems.length; i < itemsPerPage; i++) {
            const row = table.insertRow();
            row.style.height = '32px'; // 행 높이 설정
            row.insertCell(0).style.padding = '4px';
            row.insertCell(1).style.padding = '4px';
            row.insertCell(2).style.padding = '4px';
        }
 
        listElement.appendChild(table);
 
        renderPagination();
    }
 
    function renderPagination() {
        const paginationElement = document.getElementById('pagination');
        paginationElement.innerHTML = '';
 
        const totalPages = Math.ceil(blindList.length / itemsPerPage);
 
        const prevButton = document.createElement('button');
        prevButton.textContent = '<';
        prevButton.style.margin = '0 5px';
        prevButton.style.padding = '4px 8px';
        prevButton.style.border = 'none';
        prevButton.style.backgroundColor = '#f0f0f5';
        prevButton.style.borderRadius = '4px';
        prevButton.style.cursor = 'pointer';
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderBlindList();
            }
        };
        paginationElement.appendChild(prevButton);
 
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        pageInfo.style.margin = '0 5px';
        paginationElement.appendChild(pageInfo);
 
        const pageInput = document.createElement('input');
        pageInput.type = 'number';
        pageInput.min = 1;
        pageInput.max = totalPages;
        pageInput.value = currentPage;
        pageInput.style.width = '40px';
        pageInput.style.margin = '0 5px';
        pageInput.style.padding = '4px';
        pageInput.style.fontSize = '14px';
        pageInput.style.textAlign = 'center';
        pageInput.style.border = '1px solid #ccc';
        pageInput.style.borderRadius = '4px';
        pageInput.onfocus = () => document.documentElement.style.zoom = 'initial';
        pageInput.onblur = () => document.documentElement.style.zoom = '';
        paginationElement.appendChild(pageInput);
 
        const goButton = document.createElement('button');
        goButton.textContent = '이동';
        goButton.style.margin = '0 5px';
        goButton.style.padding = '4px 8px';
        goButton.style.border = 'none';
        goButton.style.backgroundColor = '#007aff';
        goButton.style.color = 'white';
        goButton.style.borderRadius = '4px';
        goButton.style.cursor = 'pointer';
        goButton.onclick = () => {
            const page = parseInt(pageInput.value);
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderBlindList();
            }
        };
        paginationElement.appendChild(goButton);
 
        const nextButton = document.createElement('button');
        nextButton.textContent = '>';
        nextButton.style.margin = '0 5px';
        nextButton.style.padding = '4px 8px';
        nextButton.style.border = 'none';
        nextButton.style.backgroundColor = '#f0f0f5';
        nextButton.style.borderRadius = '4px';
        nextButton.style.cursor = 'pointer';
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderBlindList();
            }
        };
        paginationElement.appendChild(nextButton);
    }
 
    function saveGuiState(isHidden) {
        localStorage.setItem('guiHidden', isHidden);
    }
 
    function loadGuiState() {
        return localStorage.getItem('guiHidden') === 'true';
    }
 
    // GUI 생성
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.bottom = '10px';
    gui.style.right = '10px';
    gui.style.backgroundColor = 'white';
    gui.style.border = '1px solid #ccc';
    gui.style.padding = '10px';
    gui.style.borderRadius = '10px';
    gui.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    gui.style.zIndex = 10000;
    gui.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    gui.style.maxWidth = '90%';
    gui.style.boxSizing = 'border-box';
 
    const title = document.createElement('h3');
    title.textContent = '블라인드 리스트';
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '18px';
    gui.appendChild(title);
 
    const list = document.createElement('div');
    list.id = 'blindList';
    list.style.maxHeight = '200px';
    list.style.overflowY = 'auto';
    gui.appendChild(list);
 
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = '닉네임 추가';
    inputField.style.padding = '8px';
    inputField.style.border = '1px solid #ccc';
    inputField.style.borderRadius = '4px';
    inputField.style.width = 'calc(100% - 16px)';
    inputField.style.marginBottom = '10px';
    gui.appendChild(inputField);
 
    const addButton = document.createElement('button');
    addButton.textContent = '추가';
    addButton.style.padding = '8px 16px';
    addButton.style.border = 'none';
    addButton.style.backgroundColor = '#007aff';
    addButton.style.color = 'white';
    addButton.style.borderRadius = '4px';
    addButton.style.cursor = 'pointer';
    addButton.onclick = () => {
        addUserToBlindList(inputField.value.trim());
        inputField.value = '';
    };
    gui.appendChild(addButton);
 
    const hideButton = document.createElement('button');
    hideButton.textContent = '숨기기';
    hideButton.style.marginLeft = '10px';
    hideButton.style.padding = '8px 16px';
    hideButton.style.border = 'none';
    hideButton.style.backgroundColor = '#8e8e93';
    hideButton.style.color = 'white';
    hideButton.style.borderRadius = '4px';
    hideButton.style.cursor = 'pointer';
    hideButton.onclick = () => {
        gui.style.display = 'none';
        showButton.style.display = 'block';
        saveGuiState(true);
    };
    gui.appendChild(hideButton);
 
    const pagination = document.createElement('div');
    pagination.id = 'pagination';
    pagination.style.marginTop = '10px';
    pagination.style.textAlign = 'center';
    gui.appendChild(pagination);
 
    document.body.appendChild(gui);
 
    const showButton = document.createElement('button');
    showButton.textContent = '블라인드';
    showButton.style.position = 'fixed';
    showButton.style.bottom = '10px';
    showButton.style.right = '10px';
    showButton.style.padding = '8px 16px';
    showButton.style.border = 'none';
    showButton.style.backgroundColor = '#007aff';
    showButton.style.color = 'white';
    showButton.style.borderRadius = '4px';
    showButton.style.cursor = 'pointer';
    showButton.style.zIndex = 10000;
    showButton.style.display = 'none';
    showButton.onclick = () => {
        gui.style.display = 'block';
        showButton.style.display = 'none';
        saveGuiState(false);
    };
    document.body.appendChild(showButton);
 
    if (loadGuiState()) {
        gui.style.display = 'none';
        showButton.style.display = 'block';
    } else {
        gui.style.display = 'block';
        showButton.style.display = 'none';
    }
 
    renderBlindList();
 
    function hidePosts() {
        if (location.href.includes('list.html') && !location.href.includes('st=name')) {
            document.querySelectorAll('#list_body > ul > a').forEach(post => {
                const nickname = post.querySelector('#list_body > ul > a > li > table > tbody > tr > td:nth-child(2) > div > span.nick').textContent;
                if (blindList.some(user => user.nickname === nickname)) {
                    post.style.display = 'none';
                }
            });
 
            document.querySelectorAll('#list_best_normal > ul > a').forEach(post => {
                const nickname = post.querySelector('#list_best_normal > ul > a > li > table > tbody > tr > td > div:nth-child(3)').textContent;
                if (blindList.some(user => user.nickname === nickname)) {
                    post.style.display = 'none';
                }
            });
        }
    }
 
    function hideComments() {
        if (location.href.includes('read.html')) {
            document.querySelectorAll('li').forEach(comment => {
                const nickname = comment.querySelector('span.nick')?.textContent;
 
                if (nickname && blindList.some(user => user.nickname === nickname)) {
                    if (comment.className.includes('sub_comm_bt')) {
                        comment.style.display = 'none';
                    } else if (comment.className.includes('best_li') || comment.id.includes('comment_li')) {
                        let nextElement = comment.nextElementSibling;
                        while (nextElement && nextElement.className.includes('sub_comm_bt')) {
                            nextElement.style.display = 'none';
                            nextElement = nextElement.nextElementSibling;
                        }
                        comment.style.display = 'none';
                    }
                }
            });
        }
    }
 
    // MutationObserver 사용하여 DOM 변화를 감지
    // const observer = new MutationObserver(() => {
    //     hidePosts();
    //     hideComments();
    // });
 
    // observer.observe(document, { childList: true, subtree: true });
 
    // 페이지가 완전히 로드된 후에도 hidePosts()와 hideComments() 호출
    document.addEventListener('DOMContentLoaded', () => {
        hidePosts();
        hideComments();
    });
 
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            hidePosts();
            hideComments();
        }
    }
})();
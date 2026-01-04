// ==UserScript==
// @name         【自分用】改修中小説用メモ
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  ユーザーが名前と説明を追加し、名前をクリックすると説明を表示する機能を提供します。URLごとに内容が保存され、削除や修正が可能です。ドラッグ＆ドロップで順序を変更できます。
// @match        *://*.syosetu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513125/%E3%80%90%E8%87%AA%E5%88%86%E7%94%A8%E3%80%91%E6%94%B9%E4%BF%AE%E4%B8%AD%E5%B0%8F%E8%AA%AC%E7%94%A8%E3%83%A1%E3%83%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/513125/%E3%80%90%E8%87%AA%E5%88%86%E7%94%A8%E3%80%91%E6%94%B9%E4%BF%AE%E4%B8%AD%E5%B0%8F%E8%AA%AC%E7%94%A8%E3%83%A1%E3%83%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ncodeMatch = window.location.pathname.match(/\/n(\d+[a-z]*)/);
    const novelId = ncodeMatch ? ncodeMatch[0] : 'default';

const memoArea = document.createElement('div');
memoArea.style.position = 'fixed';
memoArea.style.bottom = '5px';
memoArea.style.right = '10px'; // 全体を右側に戻す
memoArea.style.width = '400px';
memoArea.style.height = '90%';
// 左の枠線のみ残す
memoArea.style.border = 'none'; // まず全ての枠線を消す
memoArea.style.borderLeft = '1px solid #ccc'; // 左枠線を追加
memoArea.style.padding = '10px';
memoArea.style.zIndex = '1000';


    const title = document.createElement('h3');
    title.textContent = '固有名詞メモ';
    title.style.marginBottom = '5px';
    memoArea.appendChild(title);

    const inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '5px';
    memoArea.appendChild(inputContainer);

    const inputName = document.createElement('input');
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('placeholder', '名前を入力');
    inputContainer.appendChild(inputName);

    const inputDescription = document.createElement('textarea');
    inputDescription.setAttribute('placeholder', '説明を入力');
    inputDescription.style.width = '100%';
    inputDescription.style.height = '60px';
    memoArea.appendChild(inputDescription);

    const addButton = document.createElement('button');
    addButton.textContent = '追加';
    addButton.style.marginTop = '0px';
    addButton.style.backgroundColor = 'transparent';
    addButton.style.border = '1px solid #ccc';
    addButton.style.borderRadius = '4px';
    addButton.style.color = '#fff';
    addButton.style.padding = '5px 10px';
    addButton.style.cursor = 'pointer';
    memoArea.appendChild(addButton);

    const messageBox = document.createElement('div');
    messageBox.style.position = 'fixed'; // 左側に表示する設定
    messageBox.style.bottom = '5px';
    messageBox.style.left = '10px';
    messageBox.style.width = '400px';
    messageBox.style.height = '90%';
    messageBox.style.padding = '10px';
messageBox.style.border = 'none'; // まず全ての枠線を消す
messageBox.style.borderRight = '1px solid #ccc'; // 左枠線を追加

    //     messageBox.style.backgroundColor = '#f9f9f9';
    messageBox.style.display = 'none';
    messageBox.style.zIndex = '1001';
    messageBox.style.whiteSpace = 'pre-wrap';
    document.body.appendChild(messageBox);

    const nameList = document.createElement('ul');
    nameList.style.listStyleType = 'none';
    nameList.style.overflowY = 'auto';
    nameList.style.maxHeight = 'calc(100% - 215px)';
    nameList.style.margin = '0';
    nameList.style.padding = '0';
    memoArea.appendChild(nameList);

    const searchIcon = document.createElement('span');
    searchIcon.innerHTML = '🔍';
    searchIcon.style.cursor = 'pointer';
    searchIcon.style.fontSize = '20px';
    searchIcon.style.position = 'absolute';
    searchIcon.style.top = '5px';
    searchIcon.style.right = '10px';
    searchIcon.style.zIndex = '1001';
    memoArea.appendChild(searchIcon);

    const searchBox = document.createElement('input');
    searchBox.setAttribute('type', 'text');
    searchBox.setAttribute('placeholder', '検索');
    searchBox.style.width = '90%';
    searchBox.style.margin = '10px 5%';
    searchBox.style.display = 'none';
    memoArea.insertBefore(searchBox, nameList);

    searchIcon.addEventListener('click', function() {
        searchBox.style.display = searchBox.style.display === 'none' ? 'block' : 'none';
        if (searchBox.style.display === 'none') {
            searchBox.value = '';
            refreshList();
        }
    });

    searchBox.addEventListener('input', function() {
        filterList(searchBox.value.toLowerCase());
    });

    // 非表示ボタンを作成
    const hideButton = document.createElement('button');
    hideButton.textContent = '非表示';
    hideButton.style.position = 'fixed';
    hideButton.style.top = '10px';
    hideButton.style.left = '10px';
    hideButton.style.padding = '5px 10px';
    hideButton.style.cursor = 'pointer';
    hideButton.style.border = '1px solid #ccc';
    hideButton.style.borderRadius = '4px';
    hideButton.style.color = `white`;
    hideButton.style.backgroundColor = '#f9f9f9';
    hideButton.style.zIndex = '1002';
    document.body.appendChild(hideButton);

    // 元に戻すボタンを作成
    const restoreButton = document.createElement('button');
    restoreButton.textContent = '元に戻す';
    restoreButton.style.position = 'fixed';
    restoreButton.style.top = '10px';
    restoreButton.style.left = '10px';
    restoreButton.style.padding = '5px 10px';
    restoreButton.style.cursor = 'pointer';
    restoreButton.style.border = '1px solid #ccc';
    restoreButton.style.borderRadius = '4px';
    restoreButton.style.backgroundColor = '#f9f9f9';
    restoreButton.style.color = 'white';
    restoreButton.style.zIndex = '1002';
    restoreButton.style.display = 'none'; // 初期状態では非表示
    document.body.appendChild(restoreButton);

    hideButton.addEventListener('click', function() {
        memoArea.style.display = 'none';
        messageBox.style.display = 'none';
        nameList.style.display = 'none';
        searchIcon.style.display = 'none';
        searchBox.style.display = 'none';
        hideButton.style.display = 'none'; // 非表示ボタンも隠す
        restoreButton.style.display = 'inline-block'; // 元に戻すボタンを表示
    });

    restoreButton.addEventListener('click', function() {
        memoArea.style.display = 'block';
        messageBox.style.display = 'none';
        nameList.style.display = 'block';
        searchIcon.style.display = 'inline-block';
        searchBox.style.display = 'none';
        hideButton.style.display = 'inline-block'; // 非表示ボタンを再表示
        restoreButton.style.display = 'none'; // 元に戻すボタンを隠す
    });

    function filterList(query) {
        const namesData = JSON.parse(localStorage.getItem(novelId)) || [];
        nameList.innerHTML = '';
        namesData.forEach((item, index) => {
            if (item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) {
                addNameToMemo(item.name, item.description, index);
            }
        });
    }

    document.body.appendChild(memoArea);

    function addNameToMemo(name, description, index = null) {
        const listItem = document.createElement('li');
        listItem.style.display = 'flex';
        listItem.style.justifyContent = 'space-between';
        listItem.style.alignItems = 'center';
        listItem.style.padding = '1px 0';
        listItem.draggable = true;
        listItem.dataset.index = index;

        const nameLink = document.createElement('span');
        nameLink.textContent = name;
        nameLink.style.cursor = 'pointer';
        nameLink.style.textDecoration = 'underline';
        nameLink.style.flexGrow = '1';
        listItem.appendChild(nameLink);

        nameLink.addEventListener('click', function(event) {
            event.preventDefault();
            messageBox.textContent = description.replace(/\n/g, '\n'); // 改行を保持して表示
            messageBox.style.display = 'block';
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '5px';
        listItem.appendChild(buttonContainer);

        const editButton = document.createElement('button');
        editButton.textContent = '修正';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = '#fff';
        editButton.style.border = '1px solid #ccc';
        editButton.style.borderRadius = '4px';
        editButton.style.cursor = 'pointer';
        buttonContainer.appendChild(editButton);

editButton.addEventListener('click', function () {
    inputName.value = name;
    inputDescription.value = description; // 改行をそのまま表示
    addButton.textContent = '更新';
    addButton.dataset.index = index; // Store the index in the button's dataset

    const updateListener = function () {
        const newName = inputName.value.trim();
        const newDescription = inputDescription.value; // 改行を保持
        if (newName && newDescription) {
            name = newName; // 変数の値も更新
            description = newDescription;
            nameLink.textContent = newName;
            updateStorage(index, newName, newDescription);
            inputName.value = '';
            inputDescription.value = '';
            addButton.textContent = '追加';
            delete addButton.dataset.index; // Remove the index from the button's dataset

            // 更新リスナーを削除して、新しいイベント登録を防ぐ
            addButton.removeEventListener('click', updateListener);
            addButton.addEventListener('click', addNewItem);
        }
    };

    // 古いリスナーを削除
    addButton.removeEventListener('click', updateListener);
    addButton.removeEventListener('click', addNewItem);

    // 新しいリスナーを登録
    addButton.addEventListener('click', updateListener);
});

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.style.backgroundColor = 'transparent';
        deleteButton.style.color = '#fff';
        deleteButton.style.border = '1px solid #ccc';
        deleteButton.style.borderRadius = '4px';
        deleteButton.style.cursor = 'pointer';
        buttonContainer.appendChild(deleteButton);

        deleteButton.addEventListener('click', function() {
            nameList.removeChild(listItem);
            removeFromStorage(index);
        });

        nameList.appendChild(listItem);

        listItem.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', index);
            setTimeout(() => listItem.style.display = 'none', 0);
        });

        listItem.addEventListener('dragend', () => {
            listItem.style.display = 'flex';
        });

        listItem.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        listItem.addEventListener('drop', (event) => {
            event.preventDefault();
            const fromIndex = event.dataTransfer.getData('text/plain');
            const toIndex = index;

            if (fromIndex !== toIndex) {
                swapItems(fromIndex, toIndex);
                refreshList();
            }
        });
    }

    /**
 * 変換処理関数
 * @param {string} description - 変換元のdescription
 * @returns {string} - 変換後のdescription
 */
    function transformDescription(description) {
        return description
            .replace(/］\s*［/g, '\n') // 「］［」を改行に変換
            .replace(/［/g, '')       // 残った「［」を削除
            .replace(/］/g, '');      // 残った「］」を削除
    }


    /**
     * データをリストに表示
     */
    function refreshList() {
        nameList.innerHTML = '';
        const namesData = JSON.parse(localStorage.getItem(novelId)) || [];

        namesData.forEach((item, index) => {
            // 必要に応じてdescriptionを変換
            const transformedDescription = transformDescription(item.description);
            item.description = transformedDescription;

            // 更新したデータを再保存（変換済みのデータを保存）
            localStorage.setItem(novelId, JSON.stringify(namesData));

            // メモリストに追加
            addNameToMemo(item.name, transformedDescription, index);
        });
    }

    // ...（既存のリスト関連処理、UI部分のコード）...

    /**
     * 新しい項目を追加
     */
    function addNewItem() {
        const name = inputName.value.trim();
        const description = inputDescription.value; // 改行を保持
        if (name && description) {
            const namesData = JSON.parse(localStorage.getItem(novelId)) || [];
            const transformedDescription = transformDescription(description); // 入力時にも変換

            namesData.push({ name, description: transformedDescription });
            localStorage.setItem(novelId, JSON.stringify(namesData));
            addNameToMemo(name, transformedDescription, namesData.length - 1);
            inputName.value = '';
            inputDescription.value = '';
        }
    }

    function removeFromStorage(index) {
        const namesData = JSON.parse(localStorage.getItem(novelId)) || [];
        namesData.splice(index, 1);
        localStorage.setItem(novelId, JSON.stringify(namesData));
    }

    function updateStorage(index, newName, newDescription) {
        const namesData = JSON.parse(localStorage.getItem(novelId)) || [];
        namesData[index] = { name: newName, description: newDescription };
        localStorage.setItem(novelId, JSON.stringify(namesData));
        refreshList();
    }

    function swapItems(fromIndex, toIndex) {
        const namesData = JSON.parse(localStorage.getItem(novelId)) || [];
        const temp = namesData[fromIndex];
        namesData[fromIndex] = namesData[toIndex];
        namesData[toIndex] = temp;
        localStorage.setItem(novelId, JSON.stringify(namesData));
    }

    /**
     * テキスト本文に名前をハイライトし、ダブルクリックで説明を表示
     */
    const style = document.createElement('style');
    style.textContent = `
      .highlighted-name {
text-decoration: none;
border-bottom: 1px solid rgba(0, 0, 0, 1); /* 半透明の細い線 */
          cursor: pointer;
      }
    `;
    document.head.appendChild(style);

function highlightNamesInText() {
    const novelTextElement = document.querySelector('.js-novel-text.p-novel__text');
    if (!novelTextElement) {
        return;
    }

    const namesData = JSON.parse(localStorage.getItem(novelId)) || [];

    if (namesData.length === 0) {
        return;
    }

    let textContent = novelTextElement.innerHTML;

    namesData.forEach(({ name, description }) => {
        const nameRegex = new RegExp(`(${name})(?![^<]*</span>)`, 'g'); // すでに<span>タグがある場合は置換しない

        textContent = textContent.replace(
            nameRegex,
            `<span class="highlighted-name" data-description="${description}" title="ダブルクリックで説明を表示">$1</span>`
        );
    });

    novelTextElement.innerHTML = textContent;

    novelTextElement.addEventListener('dblclick', (event) => {
        if (event.target.classList.contains('highlighted-name')) {
            const description = event.target.dataset.description;

            if (description) {
                messageBox.textContent = description;
                messageBox.style.display = 'block';
            }
        }
    });
}

    addButton.addEventListener('click', addNewItem);
    refreshList();
    highlightNamesInText(); // テキスト本文をハイライト

})();
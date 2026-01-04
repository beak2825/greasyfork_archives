// ==UserScript==
// @name         多账号登录器
// @version      1.0.5
// @description  口袋-多账号登录
// @author       liuming
// @match        https://warh5.rivergame.net/*
// @license MIT
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace http://your-namespace.com
// @downloadURL https://update.greasyfork.org/scripts/484911/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/484911/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

     GM_addStyle(`
        #noteBtnContainer {
            position: fixed;
            top: 82%;
            left: 20%;
            width: 100px;
            z-index: 999;
            padding: 12px;
        }


        #noteBtnContainer > button {
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.3s ease;
            margin-bottom: 10px;
            color: #ffffff;
        }

        #addNoteBtn {
            background-color: #3498db;
            padding: 6px 12px;
            border: none;
            border-radius: 8px;
        }

        #closeButton {
            background-color: #3498db;
            padding: 6px 12px;
            border-radius: 8px;
        }

        #listNotesBtn {
            background-color: #2ecc71;
            position: relative;
            margin-bottom: 10px;
            padding: 6px 12px;
            border-radius: 8px;
        }

        #noteListPanel {
            display: none;
            position: absolute;
            top: 82%;
            left: calc(20% + 92px);
            width: 160px;
            padding: 4px;
            min-height: 50px;
            max-height: 136px;
            overflow: auto;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
        }

        #noteList {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .noteItem {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin: 3px 0;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .noteItem:hover {
            background-color: #f0f0f0;
        }

        .deleteBtn {
            background-color: #e74c3c; /* 红色背景 */
            color: #ffffff; /* 白色字体 */
            padding: 5px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
    `);
    const container = document.createElement('div');
    function createButtonContainer() {
        container.id = 'noteBtnContainer';
        document.body.appendChild(container);
    }
    function createButtons() {

        const addNoteBtn = document.createElement('button');
        addNoteBtn.id = 'addNoteBtn';
        addNoteBtn.textContent = '设置';
        addNoteBtn.addEventListener('click', showAddNoteDialog);

        const listNotesBtn = document.createElement('button');
        listNotesBtn.id = 'listNotesBtn';
        listNotesBtn.textContent = '登录';
        listNotesBtn.addEventListener('click', showNoteList);

        container.appendChild(listNotesBtn);
        container.appendChild(addNoteBtn);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.id = 'closeButton';
        closeButton.addEventListener('click', closeButtons);
        container.appendChild(closeButton);
    }
    function selectBtnClick() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
        fileInput.addEventListener('change', function() {
            const selectedFile = fileInput.files[0];
            if (selectedFile) {
                readFileContent(selectedFile);
                const fileData = GM_getValue('fileData');
                saveNoteToStorage(null,fileData);
            }
        });
        fileInput.click();
    }
    function readFileContent(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            GM_setValue('fileData', fileContent);
        };
        reader.readAsText(file);
    }
    function showNoteList(flag) {
        const noteList = getNoteListFromStorage();
        const listPanel = document.getElementById('noteListPanel');
        if(!noteList || noteList.length === 0){
            listPanel.style.display = 'none';
            if(flag){
              alert('先新增账号');
            }
            return;
        }

        const listContainer = document.createElement('ul');
        listContainer.id = 'noteList';

        function loginin(note) {
            try {
                eval(note.content);
                closeButtons();
            } catch (error) {
                console.log(error);
                alert("登录失败");
            };
        }

        noteList.forEach((note, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'noteItem';
            listItem.innerHTML = `
                <span>${note.title}</span>
                <button class="editBtn" data-index="${index}">&#9998;</button>
                <button class="deleteBtn" data-index="${index}">X</button>
            `;

            listItem.addEventListener('click', function() {
                loginin(note);
            });

            listItem.querySelector('.deleteBtn').addEventListener('click', function(event) {
                event.stopPropagation();
                const noteIndex = parseInt(event.target.getAttribute('data-index'));
                deleteNoteFromStorage(noteIndex);
                showNoteList();
            });
            listItem.querySelector('.editBtn').addEventListener('click', function(event) {
                event.stopPropagation();
                const noteIndex = parseInt(event.target.getAttribute('data-index'));
                showEditNoteDialog(noteIndex);
            });

            listContainer.appendChild(listItem);
        });
        while (listPanel.firstChild) {
            listPanel.removeChild(listPanel.firstChild);
        }

        listPanel.appendChild(listContainer);
        listPanel.style.display = 'block';
    }

    function hideNoteListPanel() {
        const listPanel = document.getElementById('noteListPanel');
        listPanel.style.display = 'none';
    }

    function showEditNoteDialog(index) {
        const noteList = getNoteListFromStorage();
        const title = prompt('修改名称:', noteList[index].title);
        if (title !== null) {
            noteList[index].title = title;
            GM_setValue('noteList', JSON.stringify(noteList));
            showNoteList();
        }
    }

    function deleteNoteFromStorage(index) {
        const noteList = getNoteListFromStorage();
        noteList.splice(index, 1);
        GM_setValue('noteList', JSON.stringify(noteList));
    }
    function saveNoteToStorage(title, content) {
        const noteList = getNoteListFromStorage();
        if(!title){
            title = '号' + (noteList.length + 1)
        }
        const newNote = { title, content };
        noteList.push(newNote);
        GM_setValue('noteList', JSON.stringify(noteList));
    }
    function showAddNoteDialog() {
        const title = prompt('用户名:');
        const content = prompt('登录码:');

        if (title && content) {
            saveNoteToStorage(title, content);
        }
    }
    function getNoteListFromStorage() {
        const storedNoteList = GM_getValue('noteList', '[]');
        return JSON.parse(storedNoteList);
    }

    function closeButtons() {
        const container = document.getElementById('noteBtnContainer');
        document.body.removeChild(container);
    };
    function createNoteListPanel() {
        const listPanel = document.createElement('div');
        listPanel.id = 'noteListPanel';

        listPanel.addEventListener('mouseleave', hideNoteListPanel);

        document.body.appendChild(listPanel);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            createButtonContainer();
            createButtons();
            createNoteListPanel();
        });
    } else {
        createButtonContainer();
        createButtons();
        createNoteListPanel();
    }
})();
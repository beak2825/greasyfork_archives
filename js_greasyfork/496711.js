// ==UserScript==
// @name         SkebMemo
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Save memo for user at skeb.jp.
// @author       A. A.
// @match        *://skeb.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skeb.jp
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496711/SkebMemo.user.js
// @updateURL https://update.greasyfork.org/scripts/496711/SkebMemo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let fontCJE = 'Microsoft Yahei, SimHei, Noto Sans JP, Arial, sans-serif';

    function handleExportNotes() {
        let notes = JSON.parse(localStorage.getItem('notes') || '{}');
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "skeb_memo.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    function handleImportNotes() {
        let input = document.createElement('input');
        let notes = JSON.parse(localStorage.getItem('notes') || '{}');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        input.addEventListener('change', function (event) {
            let file = event.target.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        let importedNotes = JSON.parse(e.target.result);
                        // Merge imported notes with existing notes
                        notes = { ...notes, ...importedNotes };
                        localStorage.setItem('notes', JSON.stringify(notes));
                        alert(languages[currentLanguage].importSuccess);
                        notes = JSON.parse(localStorage.getItem('notes') || '{}');
                    } catch (error) {
                        console.error('SkebMemo: Error parsing imported JSON.', error);
                        alert(languages[currentLanguage].importError);
                    }
                };
                reader.readAsText(file);
            }
        });
        input.click();
    };

    const languages = {
        en: {
            viewNotes: 'Show All Notes',
            exportNotes: 'Export',
            importNotes: 'Import',
            clearNotes: 'Remove All',
            notesList: 'Notes List',
            searchNotes: 'Search Notes',
            delete: 'Delete',
            confirmClear: 'Are you sure you want to remove all notes? This action cannot be undone.',
            notesCleared: 'All notes have been removed.',
            importSuccess: 'Notes imported successfully!',
            importError: 'Import failed, please check if the file format is correct.',
            settings: 'Settings',
            language: 'Language',
            notesPerPage: 'Notes per page',
            firstPage: 'First',
            lastPage: 'Last',
            boxComment: 'The memo will be saved for this work.'
        },
        cn: {
            viewNotes: '查看所有笔记',
            exportNotes: '导出笔记',
            importNotes: '导入笔记',
            clearNotes: '清空笔记',
            notesList: '笔记列表',
            searchNotes: '搜索笔记',
            delete: '删除',
            confirmClear: '确定要清空所有笔记吗？此操作不可恢复。',
            notesCleared: '所有笔记已清空。',
            importSuccess: '笔记导入成功！',
            importError: '导入失败，请检查文件格式是否正确。',
            settings: '设置',
            language: '语言',
            notesPerPage: '每页显示笔记数',
            firstPage: '首',
            lastPage: '末',
            boxComment: '笔记内容将为此稿件保存。'
        },
        jp: {
            viewNotes: 'メモ一覧',
            exportNotes: 'エクスポート',
            importNotes: 'インポート',
            clearNotes: 'メモ一括削除',
            notesList: 'メモ一覧',
            searchNotes: '検索',
            delete: '削除',
            confirmClear: 'すべてのメモを削除しますか？ この操作は元に戻せません。',
            notesCleared: 'すべてのメモが削除されました。',
            importSuccess: 'メモがインポートされました！',
            importError: 'インポートに失敗しました。ファイル形式が正しいか確認してください。',
            settings: '設定',
            language: '言語',
            notesPerPage: 'ページごとのメモ数',
            firstPage: '最初',
            lastPage: '最後',
            boxComment: 'このメモはイラストに保存されます。'
        }
    };

    function openSettings() {
        if (document.querySelector('.SkebMemoSettings')) {
            return;
        }
        let settingsDiv = document.createElement("div");
        settingsDiv.className = 'SkebMemoSettings';
        settingsDiv.style.position = "fixed";
        settingsDiv.style.top = "50%";
        settingsDiv.style.left = "50%";
        settingsDiv.style.transform = "translate(-50%, -50%)";
        settingsDiv.style.backgroundColor = "#fff";
        settingsDiv.style.padding = "30px";
        settingsDiv.style.border = "1px solid #ccc";
        settingsDiv.style.zIndex = "9999";

        let header = document.createElement('h2');
        header.textContent = languages[currentLanguage].settings;
        header.style.textAlign = 'center';
        header.style.fontFamily = fontCJE;
        settingsDiv.appendChild(header);

        let languageLabel = document.createElement('label');
        languageLabel.textContent = languages[currentLanguage].language;
        languageLabel.style.display = 'block';
        languageLabel.style.marginBottom = '10px';
        languageLabel.style.fontFamily = fontCJE;
        settingsDiv.appendChild(languageLabel);

        let cnRadio = document.createElement('input');
        cnRadio.type = 'radio';
        cnRadio.name = 'SkebMemoLang';
        cnRadio.value = 'cn';
        cnRadio.id = 'cnRadio';

        let cnLabel = document.createElement('label');
        cnLabel.textContent = '中文';
        cnLabel.style.marginRight = '10px';
        cnLabel.htmlFor = 'cnRadio';
        cnLabel.style.fontFamily = 'Microsoft Yahei, SimHei, sans-serif';

        let enRadio = document.createElement('input');
        enRadio.type = 'radio';
        enRadio.name = 'SkebMemoLang';
        enRadio.value = 'en';
        enRadio.id = 'enRadio';

        let enLabel = document.createElement('label');
        enLabel.textContent = 'English';
        enLabel.style.marginRight = '10px';
        enLabel.htmlFor = 'enRadio';
        enLabel.style.fontFamily = 'Arial, sans-serif';

        let jpRadio = document.createElement('input');
        jpRadio.type = 'radio';
        jpRadio.name = 'SkebMemoLang';
        jpRadio.value = 'jp';
        jpRadio.id = 'jpRadio';

        let jpLabel = document.createElement('label');
        jpLabel.textContent = '日本語';
        jpLabel.style.marginRight = '10px';
        jpLabel.htmlFor = 'jpRadio';
        jpLabel.style.fontFamily = 'Noto Sans JP, sans-serif';

        settingsDiv.appendChild(cnRadio);
        settingsDiv.appendChild(cnLabel);
        settingsDiv.appendChild(enRadio);
        settingsDiv.appendChild(enLabel);
        settingsDiv.appendChild(jpRadio);
        settingsDiv.appendChild(jpLabel);

        let notesPerPageLabel = document.createElement('label');
        notesPerPageLabel.textContent = languages[currentLanguage].notesPerPage;
        notesPerPageLabel.style.display = 'block';
        notesPerPageLabel.style.marginTop = '20px';
        notesPerPageLabel.style.fontFamily = fontCJE;
        settingsDiv.appendChild(notesPerPageLabel);

        let notesPerPageInput = document.createElement('input');
        notesPerPageInput.type = 'number';
        notesPerPageInput.value = notesPerPage || '10';
        notesPerPageInput.min = '1';
        notesPerPageInput.style.width = '100%';
        notesPerPageInput.style.marginBottom = '10px';
        notesPerPageInput.style.marginRight = '10px';
        settingsDiv.appendChild(notesPerPageInput);

        let exportNotesButton = document.createElement('button');
        exportNotesButton.textContent = languages[currentLanguage].exportNotes;
        exportNotesButton.style.marginBottom = '10px';
        exportNotesButton.style.marginRight = '10px';
        exportNotesButton.style.fontFamily = fontCJE;
        settingsDiv.appendChild(exportNotesButton);

        let importNotesButton = document.createElement('button');
        importNotesButton.textContent = languages[currentLanguage].importNotes;
        importNotesButton.style.marginBottom = '10px';
        importNotesButton.style.marginRight = '10px';
        importNotesButton.style.fontFamily = fontCJE;
        settingsDiv.appendChild(importNotesButton);

        let clearNotesButton = document.createElement('button');
        clearNotesButton.textContent = languages[currentLanguage].clearNotes;
        clearNotesButton.style.marginBottom = '10px';
        clearNotesButton.style.fontFamily = fontCJE;
        settingsDiv.appendChild(clearNotesButton);

        document.body.appendChild(settingsDiv);

        exportNotesButton.addEventListener('click', handleExportNotes);
        importNotesButton.addEventListener('click', handleImportNotes);

        clearNotesButton.addEventListener('click', function () {
            let confirmClear = confirm(languages[currentLanguage].confirmClear);
            if (confirmClear) {
                localStorage.removeItem('notes');
                notes = {};
                alert(languages[currentLanguage].notesCleared);
            }
        });

        // container.appendChild(document.createElement("br"));

        let closeButton = document.createElement("span");
        closeButton.textContent = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.style.fontSize = "20px";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", function () {
            document.body.removeChild(settingsDiv);
        });
        settingsDiv.appendChild(closeButton);

        cnRadio.addEventListener('change', function () {
            localStorage.setItem('SkebMemoLang', 'cn');
            // location.reload();
        });

        jpRadio.addEventListener('change', function () {
            localStorage.setItem('SkebMemoLang', 'jp');
            // location.reload();
        });

        enRadio.addEventListener('change', function () {
            localStorage.setItem('SkebMemoLang', 'en');
            // location.reload();
        });

        let savedLanguge = localStorage.getItem('SkebMemoLang');
        if (savedLanguge === 'cn') {
            cnRadio.checked = true;
            currentLanguage = 'cn';
        } else if (savedLanguge === 'jp') {
            jpRadio.checked = true;
            currentLanguage = 'jp';
        } else {
            enRadio.checked = true;
            currentLanguage = 'en';
        };

        notesPerPageInput.addEventListener("input", function () {
            localStorage.setItem("SkebMemoN", notesPerPageInput.value);
        });
    }

    var notesPerPage = parseInt(localStorage.getItem('SkebMemoN')) || 10;
    var currentLanguage = localStorage.getItem('SkebMemoLang') || 'en';

    GM_registerMenuCommand(languages[currentLanguage].settings, openSettings);

    function note_func() {
        if (document.querySelector('.memobox')) {
            return;
        }
        let urlPath = window.location.pathname;

        // Find user name
        let segments = urlPath.split('/');
        let pageID = ''
        let authorID = segments.find(segment => segment.startsWith('@'));
        if (!authorID) {
            console.warn('SkebMemo: Not a user page or work page.');
            return;
        } else {
            pageID = authorID;
        }

        if (window.location.pathname.includes('/works/')) {
            pageID = authorID + '/works/' + segments[3];
        }

        let nickname = '';
        setTimeout(function() {
            try {
                if (window.location.pathname.includes('/works/')) {
                    nickname = document.querySelector('.title.is-5').textContent.trim() + '/' + segments[3];
                } else {
                    nickname = document.querySelector('.title.is-4').textContent.trim();
                }
            } catch (error) {
                console.error('SkebMemo: Error extracting nickname:', error);
                nickname = '';
            }
        }, 100);

        // Initialize notes object
        let notes = JSON.parse(localStorage.getItem('notes') || '{}');

        // Find info box
        let targetDiv = document.querySelector('.is-box');
        if (!targetDiv) {
            console.error('SkebMemo: .is-box not found.');
            return;
        }

        // let divbox = document.createElement('div');
        // divbox.className = 'is-box';
        let container = document.createElement('div');
        container.style.marginTop = '20px';
        container.className = 'is-box';
        container.classList.add('memobox');

        // divbox.appendChild(container);
        targetDiv.parentNode.insertBefore(container, targetDiv.nextSibling);

        // Create text box
        let textBox = document.createElement('textarea');
        textBox.id = 'myTextBox';
        textBox.style.width = '100%';
        textBox.style.height = '200px';
        textBox.style.marginBottom = '10px';
        textBox.style.resize = 'vertical';
        textBox.style.fontFamily = fontCJE;
        textBox.style.fontSize = '15px';
        container.appendChild(textBox);

        let viewNotesButton = document.createElement('button');
        viewNotesButton.textContent = languages[currentLanguage].viewNotes;;
        viewNotesButton.style.fontFamily = fontCJE;
        viewNotesButton.style.fontSize = '15px';
        viewNotesButton.style.marginBottom = '0px';
        viewNotesButton.style.backgroundColor = '#28837f';
        viewNotesButton.style.padding = '3px 1em'
        viewNotesButton.style.borderColor = 'transparent';
        viewNotesButton.style.borderRadius = '4px';
        viewNotesButton.style.color = 'white';
        viewNotesButton.addEventListener('mouseover', function() {
            viewNotesButton.style.backgroundColor = '#257976';
        });
        viewNotesButton.addEventListener('mouseout', function() {
            viewNotesButton.style.backgroundColor = '#28837f';
        });
        viewNotesButton.addEventListener('mousedown', function() {
            viewNotesButton.style.backgroundColor = '#226F6C';
        });
        viewNotesButton.addEventListener('mouseup', function() {
            viewNotesButton.style.backgroundColor = '#28837f';
        });
        container.appendChild(viewNotesButton);

        if (window.location.pathname.includes('/works/')) {
            container.style.position = 'relative'
            let explaination = document.createElement('div');
            explaination.textContent = languages[currentLanguage].boxComment;
            explaination.style.fontFamily = fontCJE;
            explaination.style.fontSize = '13px';
            explaination.style.color = '#c5c5c5';
            explaination.style.position = 'absolute';
            explaination.style.bottom = '30px';
            explaination.style.left = '20px';
            container.appendChild(explaination);
        }

        // Use flexbox to align items
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'flex-end';

        // Load notes from local storage
        try {
            textBox.value = notes[pageID].memo || '';
        } catch (error) {
            textBox.value = ''; // No memo
        }

        // Save notes to local storage
        // textBox.addEventListener('input', function() {
        //     notes[pageID] = textBox.value;
        //     localStorage.setItem('notes', JSON.stringify(notes));
        // });
        textBox.addEventListener('input', function () {
            if (textBox.value.trim() === '') {
                delete notes[pageID];
            } else {
                notes[pageID] = {
                    memo: textBox.value,
                    name: nickname
                };
            }
            localStorage.setItem('notes', JSON.stringify(notes));
        });

        // View all notes
        viewNotesButton.addEventListener('click', function () {
            if (document.querySelector('.notesList')) {
                return;
            }
            let notesList = document.createElement('div');
            notesList.className = 'notesList';
            notesList.style.position = 'fixed';
            notesList.style.top = '50%';
            notesList.style.left = '50%';
            notesList.style.transform = 'translate(-50%, -50%)';
            notesList.style.width = '80%';
            notesList.style.height = '80%';
            notesList.style.overflow = 'auto';
            notesList.style.backgroundColor = 'white';
            notesList.style.zIndex = '1000';
            notesList.style.border = '1px solid black';
            notesList.style.padding = '20px';
            notesList.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
            notesList.style.fontFamily = fontCJE;
            notesList.id = 'notesList';

            let header = document.createElement('h2');
            header.textContent = languages[currentLanguage].notesList;
            header.style.textAlign = 'center';
            header.style.fontFamily = fontCJE;
            notesList.appendChild(header);

            let searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = languages[currentLanguage].searchNotes;
            searchInput.style.width = '100%';
            searchInput.style.marginBottom = '10px';
            searchInput.style.fontFamily = fontCJE;
            searchInput.style.border = '1px solid #ccc';
            searchInput.style.padding = '5px';
            notesList.appendChild(searchInput);

            let notesContainer = document.createElement('div');
            notesContainer.style.display = 'grid';
            notesContainer.style.gridTemplateColumns = '3fr 3fr 12fr 1fr';
            notesContainer.style.gap = '10px';
            notesContainer.style.fontFamily = fontCJE;
            notesList.appendChild(notesContainer);

            let buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.top = '10px';
            buttonContainer.style.left = '10px';
            notesList.appendChild(buttonContainer);

            // Export notes button
            let exportNotesButton = document.createElement('button');
            exportNotesButton.textContent = languages[currentLanguage].exportNotes;
            exportNotesButton.style.marginRight = '10px';
            exportNotesButton.style.fontFamily = fontCJE;
            buttonContainer.appendChild(exportNotesButton);

            // Import notes button
            let importNotesButton = document.createElement('button');
            importNotesButton.textContent = languages[currentLanguage].importNotes;
            importNotesButton.style.marginRight = '10px';
            importNotesButton.style.fontFamily = fontCJE;
            buttonContainer.appendChild(importNotesButton);

            // Remove all notes button
            let clearNotesButton = document.createElement('button');
            clearNotesButton.textContent = languages[currentLanguage].clearNotes;
            clearNotesButton.style.marginRight = '10px';
            clearNotesButton.style.fontFamily = fontCJE;
            buttonContainer.appendChild(clearNotesButton);

            // Setting button
            let settingButton = document.createElement('button');
            settingButton.textContent = languages[currentLanguage].settings;
            settingButton.style.marginRight = '10px';
            settingButton.style.fontFamily = fontCJE;
            buttonContainer.appendChild(settingButton);

            let closeButton = document.createElement("span");
            closeButton.textContent = "×";
            closeButton.style.position = "absolute";
            closeButton.style.top = "5px";
            closeButton.style.right = "15px";
            closeButton.style.fontSize = "20px";
            closeButton.style.cursor = "pointer";
            closeButton.addEventListener('click', function () {
                document.body.removeChild(notesList);
            });
            notesList.appendChild(closeButton);

            let paginationContainer = document.createElement('div');
            paginationContainer.style.display = 'flex';
            paginationContainer.style.justifyContent = 'center';
            paginationContainer.style.marginTop = '10px';
            paginationContainer.style.fontFamily = fontCJE;
            notesList.appendChild(paginationContainer);

            document.body.appendChild(notesList);

            let currentPage = 1;
            let filteredNotes = Object.keys(notes).filter(id => notes[id].memo.includes(''));
            let maxVisiblePages = 7;

            function renderNotes(filter = '') {
                notesContainer.innerHTML = '';
                paginationContainer.innerHTML = '';
                filteredNotes = Object.keys(notes).filter(id => notes[id].memo.includes(filter));
                let totalPages = Math.ceil(filteredNotes.length / notesPerPage);

                function createPageButton(page, text) {
                    let pageButton = document.createElement('button');
                    pageButton.textContent = text;
                    pageButton.style.margin = '0 5px';
                    pageButton.style.fontFamily = fontCJE;
                    pageButton.style.border = 'none'; // Remove border
                    if (page === currentPage) {
                        pageButton.disabled = true;
                        pageButton.style.fontWeight = 'bold';
                    } else {
                        pageButton.addEventListener('click', function () {
                            currentPage = page;
                            renderNotes(filter);
                        });
                    }
                    paginationContainer.appendChild(pageButton);
                }

                if (totalPages > 1) {
                    createPageButton(1, languages[currentLanguage].firstPage);

                    if (currentPage > 1) {
                        createPageButton(currentPage - 1, '<');
                    }

                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                    if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                        createPageButton(i, i);
                    }

                    if (currentPage < totalPages) {
                        createPageButton(currentPage + 1, '>');
                    }

                    createPageButton(totalPages, languages[currentLanguage].lastPage);
                }

                let start = (currentPage - 1) * notesPerPage;
                let end = start + notesPerPage;
                let notesToDisplay = filteredNotes.slice(start, end).reverse(); // Sort notes from newest to oldest

                for (let id of notesToDisplay) {
                    let noteItem = document.createElement('div');
                    noteItem.style.display = 'contents';

                    let noteID = document.createElement('a');
                    noteID.href = `https://skeb.jp/${id}`;
                    noteID.textContent = id;
                    noteID.target = '_blank';
                    noteID.style.textDecoration = 'none';
                    noteID.style.color = 'blue';
                    noteID.style.fontFamily = fontCJE;
                    notesContainer.appendChild(noteID);

                    let noteName = document.createElement('a');
                    noteName.href = `https://skeb.jp/${id}`;
                    noteName.textContent = notes[id].name;
                    noteName.target = '_blank';
                    noteName.style.textDecoration = 'none';
                    noteName.style.fontFamily = fontCJE;
                    notesContainer.appendChild(noteName);

                    let noteText = document.createElement('div');
                    noteText.textContent = notes[id].memo;
                    noteText.style.fontFamily = fontCJE;
                    noteText.style.whiteSpace = 'pre-wrap';
                    notesContainer.appendChild(noteText);

                    let deleteButton = document.createElement('button');
                    deleteButton.textContent = languages[currentLanguage].delete;
                    deleteButton.style.marginLeft = '10px';
                    deleteButton.style.float = 'right';
                    deleteButton.style.fontFamily = fontCJE;
                    deleteButton.style.padding = '1px 1px';
                    deleteButton.style.fontWeight = 'bold';
                    deleteButton.style.alignSelf = 'center'
                    deleteButton.addEventListener('click', function (id) {
                        return function () {
                            delete notes[id];
                            localStorage.setItem('notes', JSON.stringify(notes));
                            renderNotes(filter);
                        };
                    }(id));
                    notesContainer.appendChild(deleteButton);
                }
            }

            searchInput.addEventListener('input', function () {
                currentPage = 1;
                renderNotes(searchInput.value);
            });

            renderNotes();

            exportNotesButton.addEventListener('click', handleExportNotes);
            importNotesButton.addEventListener('click', function () {
                let input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.style.display = 'none';
                input.addEventListener('change', function (event) {
                    let file = event.target.files[0];
                    if (file) {
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            try {
                                let importedNotes = JSON.parse(e.target.result);
                                // Merge imported notes with existing notes
                                notes = { ...notes, ...importedNotes };
                                localStorage.setItem('notes', JSON.stringify(notes));
                                alert(languages[currentLanguage].importSuccess);
                                // notes = JSON.parse(localStorage.getItem('notes') || '{}');
                                document.body.removeChild(notesList);
                                viewNotesButton.click();
                            } catch (error) {
                                console.error('SkebMemo: Error parsing imported JSON.', error);
                                alert(languages[currentLanguage].importError);
                            }
                        };
                        reader.readAsText(file);
                    }
                });
                input.click();
            });
            clearNotesButton.addEventListener('click', function () {
                let confirmClear = confirm(languages[currentLanguage].confirmClear);
                if (confirmClear) {
                    localStorage.removeItem('notes');
                    notes = {};
                    alert(languages[currentLanguage].notesCleared);
                    document.body.removeChild(notesList);
                    viewNotesButton.click();
                }
            });
            settingButton.addEventListener('click', openSettings);
        });
    }

    function add_observer() {
        let body = document.body;
        let observer = new MutationObserver(mutations => {
           note_func();
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    add_observer();
})();

// ==UserScript==
// @name         Add additional discussion list on main page.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет дополнительный блок с темами из определенного раздела на главную страницу.
// @author       Yowori
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://i.imgur.com/xnJeB3f.png
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512147/Add%20additional%20discussion%20list%20on%20main%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/512147/Add%20additional%20discussion%20list%20on%20main%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let savedNodeId = localStorage.getItem('customDiscussionNodeId');
    const defaultNodeId = savedNodeId ? parseInt(savedNodeId) : 8;
    let nodeId = isNaN(defaultNodeId) ? 8 : defaultNodeId;

    const isHidden = localStorage.getItem('customDiscussionIsHidden') === 'true';

    const hostname = window.location.hostname;
    let baseURL = '';

    if (hostname === 'lolz.live') {
        baseURL = 'https://lolz.live';
    } else if (hostname === 'zelenka.guru') {
        baseURL = 'https://zelenka.guru';
    } else if (hostname === 'lolz.guru') {
        baseURL = 'https://lolz.guru';
    } else {
        console.error('Неизвестный домен:', hostname);
        return;
    }

    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
        .customDiscussionContainer {
            display: flex;
            gap: 20px;
            box-sizing: border-box;
            max-width: 1200px;
            flex-wrap: nowrap;
            position: relative;
        }

        body.index .discussionList {
            max-width: 520px;
            flex: 0 0 400px;
            transition: max-width 0.3s ease; /* Добавлено плавное изменение */
        }

        .customDiscussionList {
            max-height: 1040px;
            max-width: 400px;
            flex: 0 0 400px;
            height: auto;
            overflow: hidden;
            position: relative;
            transition: max-width 0.3s ease, display 0.3s ease; /* Добавлено плавное изменение */
        }

        .customDiscussionList .loading,
        .customDiscussionList .error {
            text-align: center;
            font-size: 16px;
            color: #555;
        }

        .customDiscussionList .ForumViewMoreButton {
            display: none;
        }

        .customDiscussionList .discussionListItems {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .toggleButton {
            padding: 5px 10px;
            cursor: pointer;
            background-color: transparent;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            margin-left: 10px;
            margin-top: 10px;
        }


        .showButton {
            display: none;
            cursor: pointer;
            background-color: transparent;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            padding: 5px 10px;
        }


        @media (max-width: 900px) {
            .customDiscussionContainer {
                flex-direction: column;
                align-items: center;
            }

            body.index .discussionList,
            .customDiscussionList {
                flex: 0 0 90%;
                max-width: 90%;
            }
        }
    `);

    function createHideButtons(discussionList) {
        const hideButton = document.createElement('button');
        hideButton.textContent = 'Скрыть';
        hideButton.className = 'toggleButton hideButton';
        hideButton.style.float = 'right';
        hideButton.style.marginTop = '10px';
        hideButton.addEventListener('click', () => {
            hideDiscussionList();
        });

        const nodeIdButton = document.createElement('button');
        nodeIdButton.textContent = 'Раздел';
        nodeIdButton.className = 'toggleButton nodeIdButton';
        nodeIdButton.style.float = 'right';
        nodeIdButton.style.marginTop = '10px';
        nodeIdButton.style.marginRight = '10px';
        nodeIdButton.addEventListener('click', () => {
            const newNodeId = prompt('Введите ID раздела:', nodeId);
            if (newNodeId !== null) {
                const parsedNodeId = parseInt(newNodeId);
                if (!isNaN(parsedNodeId)) {
                    nodeId = parsedNodeId;
                    localStorage.setItem('customDiscussionNodeId', nodeId);
                    const container = discussionList.querySelector('.discussionListItems');
                    loadDiscussionList(nodeId, container, true);
                } else {
                    alert('Некорректный ID.');
                }
            }
        });

        const aboveThreadList = discussionList.querySelector('.aboveThreadList');
        if (aboveThreadList) {
            aboveThreadList.style.position = 'relative';
            aboveThreadList.appendChild(nodeIdButton);
            aboveThreadList.appendChild(hideButton);
        }
    }

    function createShowButton() {
        const showButton = document.createElement('button');
        showButton.textContent = 'Показать';
        showButton.className = 'showButton';
        showButton.style.position = 'absolute';
        showButton.style.top = '10px';
        showButton.style.right = '10px';
        showButton.addEventListener('click', () => {
            showDiscussionList();
        });

        const mainDiscussionList = document.querySelector('body.index .discussionList');
        if (mainDiscussionList) {
            mainDiscussionList.style.position = 'relative';
            mainDiscussionList.appendChild(showButton);
        }
    }

    function hideDiscussionList() {
        const customList = document.querySelector('.customDiscussionList');
        if (customList) {
            customList.style.display = 'none';
            localStorage.setItem('customDiscussionIsHidden', 'true');
        }

        const mainDiscussionList = document.querySelector('body.index .discussionList');
        if (mainDiscussionList) {
            mainDiscussionList.style.maxWidth = 'none';
        }

        const showButton = document.querySelector('.showButton');
        const hideButton = document.querySelector('.hideButton');
        if (showButton) {
            showButton.style.display = 'block';
        }
        if (hideButton) {
            hideButton.style.display = 'none';
        }
    }

    function showDiscussionList() {
        const customList = document.querySelector('.customDiscussionList');
        if (customList) {
            customList.style.display = 'block';
            localStorage.setItem('customDiscussionIsHidden', 'false');
        }

        const mainDiscussionList = document.querySelector('body.index .discussionList');
        if (mainDiscussionList) {
            mainDiscussionList.style.maxWidth = '520px';
        }

        const showButton = document.querySelector('.showButton');
        const hideButton = document.querySelector('.hideButton');
        if (showButton) {
            showButton.style.display = 'none';
        }
        if (hideButton) {
            hideButton.style.display = 'block';
        }
    }

    function createNewDiscussionList() {
        let container = document.querySelector('.customDiscussionContainer');
        if (!container) {
            container = document.createElement('div');
            container.className = 'customDiscussionContainer';

            const existingDiscussionList = document.querySelector('body.index .discussionList');
            if (existingDiscussionList) {
                existingDiscussionList.parentNode.insertBefore(container, existingDiscussionList.nextSibling);
                container.appendChild(existingDiscussionList);
            } else {
                const bodyIndex = document.querySelector('body.index');
                if (bodyIndex) {
                    bodyIndex.appendChild(container);
                }
            }
        }

        const newDiscussionList = document.createElement('div');
        newDiscussionList.className = 'discussionList customDiscussionList';
        newDiscussionList.innerHTML = `
            <div class="aboveThreadList">
                <form action="${baseURL}/forums/${nodeId}/" method="post" class="DiscussionListOptions">
                    <input type="hidden" name="node_id" value="${nodeId}">

                    <div class="_universalSearchForm universalSearchForm">
                        <input name="title" value="" class="SearchInputQuery _universalSearchInput universalSearchInput textCtrl" placeholder="Поиск тем" autocomplete="off">
                        <i class="inputRelativeIcon fas fa-times" style="display: none;"></i>
                    </div>

                    <input type="hidden" name="_xfToken" value="2312422,1728548767,49aac0543425624fb3896cd9087e7579a503d4c1">
                </form>
            </div>

            <div class="discussionListItems" id="discussionListItems_${nodeId}">
                <div class="loading">Загрузка...</div>
            </div>
        `;

        container.appendChild(newDiscussionList);
        loadDiscussionList(nodeId, newDiscussionList.querySelector(`#discussionListItems_${nodeId}`), true);
        addFilterHandlers(newDiscussionList);
        createHideButtons(newDiscussionList);

        createShowButton();

        const updateButton = document.querySelector('.UpdateFeedButton');
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                const mainDiscussionListItems = document.querySelector('body.index .discussionList .discussionListItems');
                loadDiscussionList(1, mainDiscussionListItems, false);
                loadDiscussionList(nodeId, newDiscussionList.querySelector(`#discussionListItems_${nodeId}`), true);
            });
        }

        if (isHidden) {
            hideDiscussionList();
        } else {
            const mainDiscussionList = document.querySelector('body.index .discussionList');
            if (mainDiscussionList) {
                mainDiscussionList.style.maxWidth = '520px';
            }
        }
    }

    function loadDiscussionList(nodeId, container, limit = false) {
        let method = 'GET';
        let url = `${baseURL}/forums/${nodeId}/`;
        let params = null;

        if (nodeId === 835) {
            method = 'POST';
            url = `${baseURL}/forums/${nodeId}/`;
            params = new URLSearchParams();
            params.append('node_id', `${nodeId}`);
            params.append('title', '');
            params.append('_xfToken', '2312422,1728548767,49aac0543425624fb3896cd9087e7579a503d4c1');
        }

        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (method === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(xhr.responseText, 'text/html');
                    const discussionItems = doc.querySelector('.discussionListItems');

                    if (discussionItems) {
                        let itemsHTML = discussionItems.innerHTML;

                        if (limit) {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = itemsHTML;

                            const topics = tempDiv.querySelectorAll('.discussionListItem');

                            let limitedHTML = '';
                            for (let i = 0; i < Math.min(10, topics.length); i++) {
                                limitedHTML += topics[i].outerHTML;
                            }

                            itemsHTML = limitedHTML;
                        }

                        container.innerHTML = itemsHTML;

                    } else {
                        return;
                    }
                } else {
                    return;
                }
            }
        };
        if (method === 'POST' && params) {
            xhr.send(params.toString());
        } else {
            xhr.send();
        }
    }


    function addFilterHandlers(discussionList) {
        const form = discussionList.querySelector('.DiscussionListOptions');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const params = new URLSearchParams();

            for (const pair of formData.entries()) {
                params.append(pair[0], pair[1]);
            }

            const nodeId = formData.get('node_id') || nodeId;

            loadFilteredDiscussionList(nodeId, params, discussionList.querySelector('.discussionListItems'), true);
        });
    }

    function loadFilteredDiscussionList(nodeId, params, container, limit = false) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${baseURL}/forums/${nodeId}/`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(xhr.responseText, 'text/html');
                    const discussionItems = doc.querySelector('.discussionListItems');

                    if (discussionItems) {
                        let itemsHTML = discussionItems.innerHTML;

                        if (limit) {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = itemsHTML;

                            const topics = tempDiv.querySelectorAll('.discussionListItem');

                            let limitedHTML = '';
                            for (let i = 0; i < Math.min(10, topics.length); i++) {
                                limitedHTML += topics[i].outerHTML;
                            }

                            itemsHTML = limitedHTML;
                        }

                        container.innerHTML = itemsHTML;
                    } else {
                        container.innerHTML = '<div class="error">Не удалось загрузить темы.</div>';
                    }
                } else {
                    container.innerHTML = '<div class="error">Ошибка загрузки.</div>';
                }
            }
        };
        xhr.send(params.toString());
    }

    function init() {
        createNewDiscussionList();
    }

    window.addEventListener('load', function() {
        init();
    });

})();

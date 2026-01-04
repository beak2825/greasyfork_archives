// ==UserScript==
// @name         Add "Offtopic" discussion list on main page.
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет дополнительный блок с темами из раздела "Оффтоп" на главную страницу, динамически подстраиваясь под текущий домен.
// @author       Yowori
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://i.imgur.com/xnJeB3f.png
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512093/Add%20%22Offtopic%22%20discussion%20list%20on%20main%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/512093/Add%20%22Offtopic%22%20discussion%20list%20on%20main%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nodeId = 8; // Раздел для отображения

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
            margin: 0 auto;
            flex-wrap: nowrap;
        }

        body.index .discussionList {
            max-width: 520px;
            flex: 0 0 400px;
        }

        .customDiscussionList {
            max-height: 1040px;
            max-width: 400px;
            flex: 0 0 400px;
            height: auto;
            overflow: hidden;
        }

        .customDiscussionList .loading,
        .customDiscussionList .error {
            text-align: center;
            padding: 20px;
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

    function createNewDiscussionList() {
        let container = document.querySelector('.customDiscussionContainer');
        if (!container) {
            container = document.createElement('div');
            container.className = 'customDiscussionContainer';

            const existingDiscussionList = document.querySelector('body.index .discussionList');
            if (existingDiscussionList) {
                existingDiscussionList.parentNode.insertBefore(container, existingDiscussionList);
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

        const updateButton = document.querySelector('.UpdateFeedButton');
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                const mainDiscussionList = document.querySelector('body.index .discussionList .discussionListItems');
                loadDiscussionList(1, mainDiscussionList, false);
                loadDiscussionList(nodeId, newDiscussionList.querySelector(`#discussionListItems_${nodeId}`), true);
            });
        }
    }

    // Функция для загрузки списка обсуждений
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
                        container.innerHTML = '<div class="error">Не удалось загрузить темы.</div>';
                    }
                } else {
                    container.innerHTML = '<div class="error">Ошибка загрузки.</div>';
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

            const nodeId = formData.get('node_id') || 835;

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

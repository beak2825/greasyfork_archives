// ==UserScript==
// @name         Contests helper
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @namespace    https://shikimori.one
// @version      1.5
// @description  Показывает сколько кандидатов из турнира есть в твоих списках.
// @author       LifeH
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507032/Contests%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/507032/Contests%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        const path = window.location.pathname;
        if (!path.startsWith('/contests/')) {
            return;
        }

        const entries = document.querySelectorAll('.c-column.b-catalog_entry.c-anime, .c-column.b-catalog_entry.c-manga');
        if (entries.length === 0) {
            return;
        }

        const list = {
            'completed': 0,
            'planned': 0,
            'dropped': 0,
            'on_hold': 0,
            'watching': 0,
            'rewatching': 0,
            'no_list': 0
        };

        const colors = {
            'completed': '#419541',
            'planned': '#176093',
            'dropped': '#FC575E',
            'on_hold': '#7b8084',
            'watching': '#176093',
            'rewatching': '#176093',
            'no_list': '#000'
        };

        const entryIds = new Set();

        entries.forEach(article => {
            const entryId = article.getAttribute('id');
            if (entryIds.has(entryId)) {
                return;
            }

            entryIds.add(entryId);

            let found = false;
            for (let key in list) {
                if (article.classList.contains(key)) {
                    list[key]++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                list['no_list']++;
            }
        });

        showR(list, entryIds.size, colors);
    }

    function showR(list, size, colors) {
        const existingContainer = document.querySelector('.list-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Новый стиль контейнера
        const container = document.createElement('div');
        container.classList.add('list-container');
        container.style.width = '250px';
        container.style.display = 'inline-block';
        container.style.position = 'relative';

        let resultHTML = '';
        let clipboardText = '';

        Object.entries(list).forEach(([key, value]) => {
            if (value > 0) {
                resultHTML += `
                <div class="b-add_to_list ${key}">
                    <div class="trigger">
                        <span class="status-name">${getStatusName(key)}&nbsp;&nbsp;–&nbsp;&nbsp;${value}</span>
                    </div>
                </div>`;
                clipboardText += `[color=${colors[key]}][b]${getStatusName(key)}[/b][/color] – ${value}\n`;
            }
        });

        container.innerHTML = resultHTML;
        addCopyButton(container, clipboardText);

        const element = document.querySelector('.b-contests-menu');
        if (element) {
            element.parentNode.appendChild(container);
        }
    }

    function addCopyButton(container, text) {
        const svgIcon = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        let button = document.createElement("span");
        button.classList.add("copy-list-button");
        button.title = "Скопировать";
        button.innerHTML = svgIcon;
        button.style.cursor = "pointer";
        button.style.position = "absolute";
        button.style.top = "5px";
        button.style.right = "5px";
        button.style.zIndex = "10";

        button.onmouseover = () => {
            const pathEl = button.querySelector('path');
            if (pathEl) {
                pathEl.style.stroke = 'var(--link-hover-color)';
            }
        };
        button.onmouseout = () => {
            const pathEl = button.querySelector('path');
            if (pathEl) {
                pathEl.style.stroke = '#000';
            }
        };

        button.onclick = (event) => {
            event.stopPropagation();
            event.preventDefault();
            navigator.clipboard.writeText(text).then(() => {
                button.style.transform = "scale(1.1)";
                setTimeout(() => button.style.transform = "scale(1)", 200);
            }).catch(err => console.error(err));
        };

        container.appendChild(button);
    }

    function getStatusName(status) {
        const names = {
            'planned': 'Запланировано',
            'dropped': 'Брошено',
            'on_hold': 'Отложено',
            'watching': 'Смотрю',
            'rewatching': 'Пересматриваю',
            'completed': 'Просмотрено',
            'no_list': 'Не в списках'
        };
        return names[status] || status;
    }

    function ready(fn) {
        document.addEventListener('page:load', fn);
        document.addEventListener('turbolinks:load', fn);
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(main);

})();

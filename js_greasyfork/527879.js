// ==UserScript==
// @name         Shikimori delete anime list
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Массовое удаление аниме из списка
// @author       pirate~
// @match        *://shikimori.one/*/list/*
// @match        *://shikimori.me/*/list/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527879/Shikimori%20delete%20anime%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/527879/Shikimori%20delete%20anime%20list.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let deleteButton;
    let currentUrl = location.href;

    function addCustomStyle() {
        let style = document.createElement('style');
        style.textContent = `
            .acheckbox { cursor: pointer; width: 20px; height: 20px; }
            #deletelist {
                display: none;
                background-color: red;
                color: white;
                padding: 10px 15px;
                border: none;
                cursor: pointer;
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-size: 14px;
                border-radius: 5px;
            }
            #deletelist:hover {
                background-color: darkred;
            }
        `;
        document.head.appendChild(style);
    }

    function addCheckboxes() {
        document.querySelectorAll('.user_rate.selectable.editable').forEach(row => {
            let rateUrl = row.getAttribute('data-rate_url');
            if (!rateUrl) return;

            let idMatch = rateUrl.match(/\/(\d+)$/);
            if (!idMatch) return;

            let animeId = idMatch[1];

            if (row.querySelector('.acheckbox')) return;

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('acheckbox');
            checkbox.dataset.id = animeId;

            let tdCheckbox = document.createElement('td');
            tdCheckbox.classList.add('num');
            tdCheckbox.appendChild(checkbox);

            let lastTd = row.querySelector('td.num:last-child');
            if (lastTd) {
                lastTd.insertAdjacentElement('afterend', tdCheckbox);
            }

            checkbox.addEventListener('change', adelete);
            checkbox.addEventListener('click', function (event) {
                event.stopPropagation();
                let editForm = row.nextElementSibling;
                if (editForm && editForm.classList.contains('edit-form')) {
                    editForm.style.display = 'none';
                }
            });
        });
    }

    function adelete() {
        let checked = document.querySelectorAll('.acheckbox:checked').length > 0;
        deleteButton.style.display = checked ? 'block' : 'none';
    }

    async function aselected() {
        let selected = document.querySelectorAll('.acheckbox:checked');
        if (selected.length === 0) return;

        if (!confirm(`удалить ${selected.length} аниме из списка?`)) return;

        for (let checkbox of selected) {
            let animeId = checkbox.dataset.id;
            let url = `https://shikimori.one/api/v2/user_rates/${animeId}`;

            try {
                let response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'include'
                });

                if (response.status === 200 || response.status === 204) {
                    checkbox.closest('tr').remove();
                } else {
                    alert(`ошибка: ${response.status} - ${response.statusText}`);
                }
            } catch (error) {
                alert(`ошибка удаления аниме с id ${animeId}: ${error.message}`);
            }
        }

        adelete();
    }

    function addDeleteButton() {
        deleteButton = document.createElement('button');
        deleteButton.id = 'deletelist';
        deleteButton.innerText = 'удалить выбранные';
        deleteButton.addEventListener('click', aselected);
        document.body.appendChild(deleteButton);
    }

    function observeUrlChanges() {
        const observer = new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(reinitialize, 500);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        function overrideHistoryMethod(method) {
            return function () {
                const newUrl = arguments[2];
                if (newUrl !== location.href) {
                    setTimeout(reinitialize, 500);
                }
                return method.apply(history, arguments);
            };
        }

        history.pushState = overrideHistoryMethod(originalPushState);
        history.replaceState = overrideHistoryMethod(originalReplaceState);
        window.addEventListener('popstate', () => {
            if (location.href !== currentUrl) {
                setTimeout(reinitialize, 500);
            }
        });
    }

    function reinitialize() {
        document.querySelectorAll('.acheckbox').forEach(el => el.remove());
        addCheckboxes();
        adelete();
    }

    function init() {
        addCustomStyle();
        addCheckboxes();
        addDeleteButton();
        adelete();
        observeUrlChanges();
    }

    window.addEventListener('load', init);
})();
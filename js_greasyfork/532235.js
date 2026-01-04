// ==UserScript==
// @name         Moderator + Dropdown Roles Button1
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Кнопки "Назначить модератором" и выпадающая роль (Лидер, Админ, Снять) на странице редактирования пользователя
// @author       You
// @match        https://forum.blackrussia.online/admin.php?users/*/edit
// @match        https://forum.blackrussia.online/admin.php?moderators/add*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532235/Moderator%20%2B%20Dropdown%20Roles%20Button1.user.js
// @updateURL https://update.greasyfork.org/scripts/532235/Moderator%20%2B%20Dropdown%20Roles%20Button1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;
 if (currentUrl.includes('/admin.php?moderators/add')) {
    window.addEventListener('load', () => {
        // Найти кнопку "Сохранить"
        const saveButton = document.querySelector('button.button--primary.button--icon--save');
        if (!saveButton) return;

        // Создать кнопку "Куратор"
        const curatorButton = document.createElement('a');
        curatorButton.href = 'javascript:void(0)'; // Убираем переход по ссылке
        curatorButton.className = 'button';
        curatorButton.style.marginLeft = '10px';
        curatorButton.innerHTML = '<span class="button-text">Куратор</span>';

        // Функция для установки галочки и симуляции изменения события
        const setCheckbox = (selector) => {
            const checkbox = document.querySelector(selector);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        };

        // Добавляем обработчик события на кнопку "Куратор"
        curatorButton.addEventListener('click', () => {
            // Снимаем галочку с чекбокса "is_staff"
            const staffCheckbox = document.querySelector('input[name="is_staff"][value="1"]');
            if (staffCheckbox && staffCheckbox.checked) {
                staffCheckbox.checked = false;
                staffCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Массив селекторов для чекбоксов
            const checkboxes = [
                'input[name="contentPermissions[forum][stickUnstickThread]"][value="content_allow"]',
                'input[name="contentPermissions[forum][inlineMod]"][value="content_allow"]',
                'input[name="contentPermissions[forum][lockUnlockThread]"][value="content_allow"]',
                'input[name="contentPermissions[forum][manageAnyThread]"][value="content_allow"]',
                'input[name="contentPermissions[forum][lockUnlockThread]"][value="content_allow"]',
                'input[name="contentPermissions[forum][deleteAnyThread]"][value="content_allow"]',
                'input[name="contentPermissions[forum][deleteAnyPost]"][value="content_allow"]',
                'input[name="contentPermissions[forum][manageAnyTag]"][value="content_allow"]',
                'input[name="contentPermissions[forum][viewDeleted]"][value="content_allow"]',
                'input[name="contentPermissions[forum][viewModerated]"][value="content_allow"]',
                 'input[name="contentPermissions[forum][undelete]"][value="content_allow"]'
            ];

            // Устанавливаем галочку для всех чекбоксов
            checkboxes.forEach(setCheckbox);
             // Кликаем на кнопку "Сохранить"
            saveButton.click();
        });

        // Вставить кнопку "Куратор" рядом с кнопкой "Сохранить"
        saveButton.parentNode.insertBefore(curatorButton, saveButton.nextSibling);
    });
}

    if (currentUrl.includes('/admin.php?users/') && currentUrl.includes('/edit')) {
        window.addEventListener('load', () => {
            const actionsButton = document.querySelector('button.menuTrigger.button');
            if (!actionsButton) return;

            // Вытаскиваем username из поля ввода
            const usernameInput = document.querySelector('input[name="user[username]"]');
            if (usernameInput) {
                const username = usernameInput.value;

                // Сохраняем username в localStorage
                localStorage.setItem('savedUsername', username);
            }

            // Кнопка "Назначить модератором"
            const modButton = document.createElement('a');
            modButton.href = `https://forum.blackrussia.online/admin.php?moderators/add`;
            modButton.className = 'button';
            modButton.style.marginLeft = '10px';
            modButton.innerHTML = '<span class="button-text">Назначить модератором</span>';
            modButton.target = '_blank';

            // Выпадающая кнопка с ролями
            const dropdownWrapper = document.createElement('div');
            dropdownWrapper.style.display = 'inline-block';
            dropdownWrapper.style.marginLeft = '10px';

            const select = document.createElement('select');
            select.className = 'input';
            select.innerHTML = `
                <option selected disabled>Выбрать роль</option>
                <option value="leader">Лидер</option>
                <option value="mm">мм</option>
                <option value="moder">модер</option>
                <option value="smoder">cмодер</option>
                <option value="admin">Админ</option>
                <option value="sadmin">садмин</option>
                <option value="curator">куратор</option>
                <option value="zga">зга</option>
                <option value="remove">Снять</option>
            `;

            select.addEventListener('change', () => {
                const anapaCheckbox = document.querySelector('input[type="checkbox"][value="58"]');
                const groupSelect = document.querySelector('select[name="user[user_group_id]"]');

                switch (select.value) {
                    case 'leader':
                        if (anapaCheckbox && !anapaCheckbox.checked) {
                            anapaCheckbox.checked = true;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "15";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                    case 'mm':
                        if (anapaCheckbox && !anapaCheckbox.checked) {
                            anapaCheckbox.checked = true;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "24";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                     case 'moder':
                        if (anapaCheckbox && !anapaCheckbox.checked) {
                            anapaCheckbox.checked = true;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "13";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                     case 'smoder':
                        if (anapaCheckbox && !anapaCheckbox.checked) {
                            anapaCheckbox.checked = true;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "17";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                     case 'admin':
                        if (anapaCheckbox && !anapaCheckbox.checked) {
                            anapaCheckbox.checked = true;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "12";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                     case 'sadmin':
                        if (anapaCheckbox && !anapaCheckbox.checked) {
                            anapaCheckbox.checked = true;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "11";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                     case 'curator':
                        if (anapaCheckbox && !anapaCheckbox.checked) {
                            anapaCheckbox.checked = true;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "38";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                     case 'zga':
                        if (anapaCheckbox && !anapaCheckbox.checked) {
                            anapaCheckbox.checked = true;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "8";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                    case 'remove':
                        if (anapaCheckbox && anapaCheckbox.checked) {
                            anapaCheckbox.checked = false;
                            anapaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        if (groupSelect) {
                            groupSelect.value = "2";
                            groupSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        break;
                }

                // Нажатие на кнопку "Сохранить"
                setTimeout(() => {
                    const saveButton = document.querySelector('button.button--primary.button--icon--save');
                    if (saveButton) {
                        saveButton.click();
                    }
                }, 500); // небольшая задержка, чтобы успели примениться изменения

                // Сброс выбора
                select.selectedIndex = 0;
            });

            dropdownWrapper.appendChild(select);

            // Вставляем кнопки
            actionsButton.parentNode.insertBefore(modButton, actionsButton.nextSibling);
            modButton.parentNode.insertBefore(dropdownWrapper, modButton.nextSibling);
        });
    }

    if (currentUrl.includes('/admin.php?moderators/add')) {
        window.addEventListener('load', () => {
            // Клик на радио-кнопку "Модератор форума"
            const radioModerator = document.querySelector('input[type="radio"][value="node"]');
            if (radioModerator) {
                radioModerator.click();
            }

            const urlParams = new URLSearchParams(document.referrer);
            const username = urlParams.get('username') || localStorage.getItem('savedUsername'); // Получаем savedUsername
            const savedServer = localStorage.getItem('savedServer'); // Получаем сохранённый сервер

            if (username) {
                const input = document.querySelector('input[name="username"]');
                if (input) {
                    setTimeout(() => {
                        input.click();
                        input.value = username;
                        input.dispatchEvent(new Event('input', { bubbles: true }));

                        if (window.jQuery) {
                            $(input).trigger('autocomplete.select');
                        }
                    }, 500);
                }
            }

            if (savedServer) {
                const serverSelect = document.querySelector('select[name="type_id[node]"]');
                if (serverSelect) {
                    setTimeout(() => {
                        const serverOption = Array.from(serverSelect.options).find(option => option.value === savedServer);
                        if (serverOption) {
                            serverSelect.value = serverOption.value;
                            serverSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }, 500);
                }
            }

            // Автоматический выбор опции "События" в выпадающем списке
            const eventOption = document.querySelector('select[name="type_id[node]"] option[value="1375"]');
            if (eventOption) {
                setTimeout(() => {
                    eventOption.selected = true;
                    eventOption.parentNode.dispatchEvent(new Event('change', { bubbles: true }));
                }, 500);
            }
        });
    }
})();

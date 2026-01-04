// ==UserScript==
// @name         Открытие заявок на лидерку.
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматическое открытия заявок на лидерку.
// @author       Skay_Eagle
// @match        https://forum.blackrussia.online/*
// @grant        none
// @icon https://i.postimg.cc/C5XqDrXY/photo-2021-09-20-17-14-18-2.jpg
// @downloadURL https://update.greasyfork.org/scripts/546811/%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B7%D0%B0%D1%8F%D0%B2%D0%BE%D0%BA%20%D0%BD%D0%B0%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/546811/%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B7%D0%B0%D1%8F%D0%B2%D0%BE%D0%BA%20%D0%BD%D0%B0%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BA%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wait = (ms) => new Promise(res => setTimeout(res, ms));

    const orgList = [
        {name: 'Пра-во', ld: 'pravo', display: 'Правительства'},
        {name: 'ФСБ', ld: 'fsb', display: 'ФСБ'},
        {name: 'ГИБДД', ld: 'gibdd', display: 'ГИБДД'},
        {name: 'УМВД', ld: 'umvd', display: 'УМВД'},
        {name: 'Армия', ld: 'army', display: 'Армии'},
        {name: 'ЦБ', ld: 'cb', display: 'Центральной больницы'},
        {name: 'СМИ', ld: 'media', display: 'СМИ'},
        {name: 'ФСИН', ld: 'fsin', display: 'ФСИН'},
        {name: 'А - ОПГ', ld: 'aopg', display: 'Арзамасского ОПГ'},
        {name: 'Б - ОПГ', ld: 'bopg', display: 'Батыревского ОПГ'},
        {name: 'Л - ОПГ', ld: 'lopg', display: 'Лыткаринского ОПГ'}
    ];

    if (location.href.includes("/forums") && !location.href.includes("/post-thread")) {
        const style = document.createElement('style');
        style.textContent = `
            #ld-menu {
                position: fixed;
                top: 100px;
                right: 20px;
                background: #1a1a1a;
                color: white;
                font-size: 14px;
                padding: 10px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                display: none;
                flex-direction: column;
                gap: 8px;
                z-index: 9999;
                min-width: 180px;
            }
            #ld-button {
                position: fixed;
                top: 60px;
                right: 20px;
                background: #e63946;
                color: white;
                border: none;
                padding: 12px 18px;
                font-size: 16px;
                font-weight: bold;
                border-radius: 10px;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                transition: all 0.3s ease;
                z-index: 9999;
            }
            #ld-button:hover {
                background: #d62828;
                transform: translateY(-2px);
            }
            #ld-menu .menu-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
                border-top: 1px solid #444;
                padding-top: 6px;
            }
            #ld-menu .menu-group:first-child { border-top: none; padding-top: 0; }
            #ld-menu a {
                color: white;
                text-decoration: none;
                padding: 8px 12px;
                border-radius: 8px;
                font-weight: bold;
                transition: all 0.2s ease;
                text-align: center;
            }
            #ld-menu a.gov { background: #457b9d; }
            #ld-menu a.opg { background: #f4a261; }
            #ld-menu a:hover { opacity: 0.85; transform: scale(1.03); }
        `;
        document.head.appendChild(style);

        const button = document.createElement('button');
        button.id = 'ld-button';
        button.textContent = 'ЗАЯВКИ НА ЛД';
        document.body.appendChild(button);

        const menu = document.createElement('div');
        menu.id = 'ld-menu';

        // Создаём группы кнопок
        const govGroup = document.createElement('div');
        govGroup.className = 'menu-group';
        const opgGroup = document.createElement('div');
        opgGroup.className = 'menu-group';

        orgList.forEach(org => {
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.ld = org.ld;
            a.textContent = org.name;
            if (['А - ОПГ','Б - ОПГ','Л - ОПГ'].includes(org.name)) a.classList.add('opg');
            else a.classList.add('gov');

            if (a.classList.contains('gov')) govGroup.appendChild(a);
            else opgGroup.appendChild(a);
        });

        menu.appendChild(govGroup);
        menu.appendChild(opgGroup);
        document.body.appendChild(menu);

        button.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        });

        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const ld = a.dataset.ld;
                const url = `https://forum.blackrussia.online/forums/Лидеры.3174/post-thread?ld=${ld}`;
                window.open(url, '_blank');
            });
        });
    }

    if (location.href.includes("/post-thread") && new URLSearchParams(window.location.search).has('ld')) {
        const params = new URLSearchParams(window.location.search);
        const ldType = params.get('ld');
        const org = orgList.find(o => o.ld === ldType);
        if (!org) return;

        const template = (displayName) => `[CENTER][B][SIZE=4][COLOR=rgb(26, 188, 156)][FONT=verdana]Здравствуйте, в данной теме вы можете подать заявление на должность лидера ${displayName}[/FONT][/COLOR][/SIZE][/B]

[FONT=trebuchet ms][B][COLOR=rgb(255, 36, 0)][SIZE=6]Требования к кандидату:[/SIZE][/COLOR][/B][/FONT]

[FONT=courier new][B]- Иметь Discord и исправно работающий микрофон;
- Быть в возрасте от 15 лет;
- Не иметь действующих варнов/банов;
- Иметь никнейм формата Имя_Фамилия;
- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;
- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;
- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.[/B][/FONT]

[FONT=trebuchet ms][B][COLOR=rgb(255, 36, 0)]Примечание:[/COLOR][/B][/FONT][FONT=courier new][B] Скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;[/B][/FONT]
[FONT=trebuchet ms][B][COLOR=rgb(255, 36, 0)]Примечание:[/COLOR][/B][/FONT][FONT=courier new][B] Запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).[/B][/FONT]
[FONT=trebuchet ms][B][COLOR=rgb(255, 36, 0)]Примечание:[/COLOR][/B][/FONT][FONT=courier new][B] Будьте внимательны, обзвоны проводятся только в официальном Discord сервере, не попадайтесь на Fake обзвоны — [/B][/FONT][FONT=verdana][B][COLOR=rgb(255, 36, 0)][SIZE=6]Администрация НЕ попросит пароли, регистрационные данные и т.д.[/SIZE][/COLOR][/B][/FONT]

[FONT=trebuchet ms][B][COLOR=rgb(255, 36, 0)][SIZE=6]Форма подачи заявки:[/SIZE][/COLOR][/B][/FONT]

[FONT=courier new]1. Никнейм:
2. Игровой уровень:
3. Скриншот статистики аккаунта с /time:
4. Были ли варны/баны (если да, то за что):
5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):
6. Почему именно вы должны занять пост лидера?:
7. Имеется ли опыт в данной организации?:
8. Ссылка на одобренную RP биографию персонажа:
9. Были ли вы лидером любой другой организации?:
10. Ваш часовой пояс:
11. Ссылка на страницу ВКонтакте:
12. Логин Discord аккаунта:
13. Ваше реальное имя:
14. Ваш реальный возраст:
15. Город, в котором проживаете:[/FONT][/CENTER]`;

        (async () => {
            const titleInput = await waitFor(() => document.querySelector('textarea[name="title"]'), 15000);
            const prefixSelect = await waitFor(() => document.querySelector('select[name="prefix_id"]'), 15000);
            const contentEditable = await waitFor(() => document.querySelector('.fr-element.fr-view[contenteditable="true"]'), 15000);
            const pinnedBtn = await waitFor(() => [...document.querySelectorAll('span.iconic-label')].find(el => el.textContent.includes('Закреплено')), 15000);
            const submitBtn = await waitFor(() => [...document.querySelectorAll('button.button--primary')].find(btn => btn.querySelector('span.button-text')?.textContent.includes('Создать тему')), 15000);

            if (!titleInput || !prefixSelect || !contentEditable) return;

            await wait(1000);
            titleInput.value = `PLATINUM | Заявление на должность лидера «${org.display}»`;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(500);
            document.body.click();
            titleInput.blur();

            await wait(1000);
            prefixSelect.value = "1";
            prefixSelect.dispatchEvent(new Event('change', { bubbles: true }));

            await wait(1000);
            contentEditable.innerHTML = template(org.display).replace(/\n/g, '<br>');

            if (pinnedBtn) { await wait(1000); pinnedBtn.click(); }
            if (submitBtn) { await wait(1000); submitBtn.click(); }

        })();

        function waitFor(selectorFn, timeout = 15000) {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    const el = selectorFn();
                    if (el) {
                        clearInterval(interval);
                        resolve(el);
                    }
                }, 300);
                setTimeout(() => { clearInterval(interval); resolve(null); }, timeout);
            });
        }
    }

})();

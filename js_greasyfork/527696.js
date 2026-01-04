// ==UserScript==
// @name         Discord Emojis for Toonio
// @namespace    DiscordEmojisConverter
// @version      1.1.03
// @description  Дискорд эмоджики в тунио, теперь лучше
// @author       Vika4ernaya
// @match        https://toonio.ru/*
// @match        https://*.toonio.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toonio.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527696/Discord%20Emojis%20for%20Toonio.user.js
// @updateURL https://update.greasyfork.org/scripts/527696/Discord%20Emojis%20for%20Toonio.meta.js
// ==/UserScript==

// Добавляем функцию для установки пака
function installPack() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    try {
        const packData = JSON.parse(atob(hash));
        const { pack, emojis } = packData;

        // Получаем текущие паки и эмодзи
        const currentPacks = storage.get('demoji_packs');
        const currentEmojis = storage.get('demoji_emojis');

        // Проверяем, существует ли уже пак с таким ID
        const existingPack = currentPacks.find(p => p.id === pack.id);
        if (existingPack) {
            if (!confirm(`Пак "${pack.name}" уже существует. Хотите обновить его?`)) {
                return;
            }
            // Удаляем старые эмодзи пака
            const newEmojis = currentEmojis.filter(e => e.packId !== pack.id);
            storage.set('demoji_emojis', [...newEmojis, ...emojis]);

            // Обновляем информацию о паке
            const newPacks = currentPacks.map(p => p.id === pack.id ? pack : p);
            storage.set('demoji_packs', newPacks);
        } else {
            // Добавляем новый пак и его эмодзи
            storage.set('demoji_packs', [...currentPacks, pack]);
            storage.set('demoji_emojis', [...currentEmojis, ...emojis]);
        }

        alert(`Пак "${pack.name}" успешно ${existingPack ? 'обновлен' : 'установлен'}!`);
        // Очищаем хэш из URL
        window.location.hash = '';
        // Обновляем меню
        updateDemojiMenu();
    } catch (error) {
        console.error('Ошибка установки пака:', error);
        alert('Ошибка при установке пака. Неверный формат данных.');
    }
}

// Добавляем проверку URL при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash.startsWith('#')) {
        installPack();
    }
});

const storage = {
    get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
};

// Создание UI для эмодзи
function createDemojiUI() {
    const formatContainer = document.querySelector(".send .format");
    const editorFormatCont = document.querySelector("#save .format");
    if (!formatContainer && !editorFormatCont) return;

    // Создаем кнопку
    const demojiButton = document.createElement("a");
    demojiButton.id = "discordDemojiBtn";
    demojiButton.title = "Discord эмодзи";
    demojiButton.style.width = "24px";
    demojiButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" style="fill: white;"><path d="M 18.90625 7 C 18.90625 7 12.539063 7.4375 8.375 10.78125 C 8.355469 10.789063 8.332031 10.800781 8.3125 10.8125 C 7.589844 11.480469 7.046875 12.515625 6.375 14 C 5.703125 15.484375 4.992188 17.394531 4.34375 19.53125 C 3.050781 23.808594 2 29.058594 2 34 C 1.996094 34.175781 2.039063 34.347656 2.125 34.5 C 3.585938 37.066406 6.273438 38.617188 8.78125 39.59375 C 11.289063 40.570313 13.605469 40.960938 14.78125 41 C 15.113281 41.011719 15.429688 40.859375 15.625 40.59375 L 18.0625 37.21875 C 20.027344 37.683594 22.332031 38 25 38 C 27.667969 38 29.972656 37.683594 31.9375 37.21875 L 34.375 40.59375 C 34.570313 40.859375 34.886719 41.011719 35.21875 41 C 36.394531 40.960938 38.710938 40.570313 41.21875 39.59375 C 43.726563 38.617188 46.414063 37.066406 47.875 34.5 C 47.960938 34.347656 48.003906 34.175781 48 34 C 48 29.058594 46.949219 23.808594 45.65625 19.53125 C 45.007813 17.394531 44.296875 15.484375 43.625 14 C 42.953125 12.515625 42.410156 11.480469 41.6875 10.8125 C 41.667969 10.800781 41.644531 10.789063 41.625 10.78125 C 37.460938 7.4375 31.09375 7 31.09375 7 C 31.019531 6.992188 30.949219 6.992188 30.875 7 C 30.527344 7.046875 30.234375 7.273438 30.09375 7.59375 C 30.09375 7.59375 29.753906 8.339844 29.53125 9.40625 C 27.582031 9.09375 25.941406 9 25 9 C 24.058594 9 22.417969 9.09375 20.46875 9.40625 C 20.246094 8.339844 19.90625 7.59375 19.90625 7.59375 C 19.734375 7.203125 19.332031 6.964844 18.90625 7 Z M 18.28125 9.15625 C 18.355469 9.359375 18.40625 9.550781 18.46875 9.78125 C 16.214844 10.304688 13.746094 11.160156 11.4375 12.59375 C 11.074219 12.746094 10.835938 13.097656 10.824219 13.492188 C 10.816406 13.882813 11.039063 14.246094 11.390625 14.417969 C 11.746094 14.585938 12.167969 14.535156 12.46875 14.28125 C 17.101563 11.410156 22.996094 11 25 11 C 27.003906 11 32.898438 11.410156 37.53125 14.28125 C 37.832031 14.535156 38.253906 14.585938 38.609375 14.417969 C 38.960938 14.246094 39.183594 13.882813 39.175781 13.492188 C 39.164063 13.097656 38.925781 12.746094 38.5625 12.59375 C 36.253906 11.160156 33.785156 10.304688 31.53125 9.78125 C 31.59375 9.550781 31.644531 9.359375 31.71875 9.15625 C 32.859375 9.296875 37.292969 9.894531 40.3125 12.28125 C 40.507813 12.460938 41.1875 13.460938 41.8125 14.84375 C 42.4375 16.226563 43.09375 18.027344 43.71875 20.09375 C 44.9375 24.125 45.921875 29.097656 45.96875 33.65625 C 44.832031 35.496094 42.699219 36.863281 40.5 37.71875 C 38.5 38.496094 36.632813 38.84375 35.65625 38.9375 L 33.96875 36.65625 C 34.828125 36.378906 35.601563 36.078125 36.28125 35.78125 C 38.804688 34.671875 40.15625 33.5 40.15625 33.5 C 40.570313 33.128906 40.605469 32.492188 40.234375 32.078125 C 39.863281 31.664063 39.226563 31.628906 38.8125 32 C 38.8125 32 37.765625 32.957031 35.46875 33.96875 C 34.625 34.339844 33.601563 34.707031 32.4375 35.03125 C 32.167969 35 31.898438 35.078125 31.6875 35.25 C 29.824219 35.703125 27.609375 36 25 36 C 22.371094 36 20.152344 35.675781 18.28125 35.21875 C 18.070313 35.078125 17.8125 35.019531 17.5625 35.0625 C 16.394531 34.738281 15.378906 34.339844 14.53125 33.96875 C 12.234375 32.957031 11.1875 32 11.1875 32 C 10.960938 31.789063 10.648438 31.699219 10.34375 31.75 C 9.957031 31.808594 9.636719 32.085938 9.53125 32.464844 C 9.421875 32.839844 9.546875 33.246094 9.84375 33.5 C 9.84375 33.5 11.195313 34.671875 13.71875 35.78125 C 14.398438 36.078125 15.171875 36.378906 16.03125 36.65625 L 14.34375 38.9375 C 13.367188 38.84375 11.5 38.496094 9.5 37.71875 C 7.300781 36.863281 5.167969 35.496094 4.03125 33.65625 C 4.078125 29.097656 5.0625 24.125 6.28125 20.09375 C 6.90625 18.027344 7.5625 16.226563 8.1875 14.84375 C 8.8125 13.460938 9.492188 12.460938 9.6875 12.28125 C 12.707031 9.894531 17.140625 9.296875 18.28125 9.15625 Z M 18.5 21 C 15.949219 21 14 23.316406 14 26 C 14 28.683594 15.949219 31 18.5 31 C 21.050781 31 23 28.683594 23 26 C 23 23.316406 21.050781 21 18.5 21 Z M 31.5 21 C 28.949219 21 27 23.316406 27 26 C 27 28.683594 28.949219 31 31.5 31 C 34.050781 31 36 28.683594 36 26 C 36 23.316406 34.050781 21 31.5 21 Z M 18.5 23 C 19.816406 23 21 24.265625 21 26 C 21 27.734375 19.816406 29 18.5 29 C 17.183594 29 16 27.734375 16 26 C 16 24.265625 17.183594 23 18.5 23 Z M 31.5 23 C 32.816406 23 34 24.265625 34 26 C 34 27.734375 32.816406 29 31.5 29 C 30.183594 29 29 27.734375 29 26 C 29 24.265625 30.183594 23 31.5 23 Z"></path></svg>
        `;

    // Создаем меню
    const demojiMenu = document.createElement("div");
    demojiMenu.id = "discordDemojiMenu";
    demojiMenu.className = "discordDemojis";
    demojiMenu.style.display = 'none';
    demojiMenu.innerHTML = `
            <style>

            .discordDemojis {
                background: #292929;
                padding: 3px;
                max-width: 530px;
                display: none;
                position: absolute;
                top: 130px;
                left: 196px;
                z-index: 99;
                border-radius: 5px;
            }
            .toons_picker_relative  .discordDemojis {
                top: inherit;
                bottom: 0;
            }
            .format {
                grid-template-columns: repeat(6, 24px) 1fr !important;
            }
            .discordDemojis > .demoji-content {
                max-height: 105px;
                overflow-y: auto;
                width: 35px;
                height: 30px;
                display: inline-block;
                margin: 5px;
                padding: 5px;
                background-color: #0003;
                border-radius: 3px;
                cursor: pointer;
            }
            .discordDemoji {
                width: 40px;
                height: 40px;
                cursor: pointer;
                transition: all 0.1s ease-in-out;
                border: 2px solid #0000;
                opacity: 0.7;
            }
            .discordDemoji:hover {
                border: 2px solid #7289da;
                opacity: 1;
                border-radius: 4px;
            }
            .demoji-header {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
                padding: 5px;
            }
            .demoji_search {
                flex: 1;
                display: flex;
                align-items: center;
                background: #0003;
                padding: 5px;
                border-radius: 3px;
            }
            .demoji_search input {
                background: transparent;
                border: none;
                color: white;
                margin-left: 5px;
                width: 100%;
            }
            .demoji_search input:focus {
                outline: none;
            }
            .demoji_notfound {
                display: none;
                text-align: center;
                padding: 10px;
                color: white;
            }
            #demojiArea {
                overflow-y: scroll;
                height: 260px;
                scroll-behavior: smooth;
            }
            .pack-header{
                font-family: Fira Sans, sans-serif;
                padding: 5px;
                cursor: pointer;
                user-select: none;
                color: white;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .pack-header img{
                width: 30px;
                height: 30px;
                vertical-align: middle;
            }
            .pack-header .arrow {
                margin-left: auto;
                transition: transform 0.2s ease;
            }
            .pack-collapsed .pack-header .arrow {
                transform: rotate(-90deg);
            }
            .pack-emojis {
                overflow: hidden;
                transition: all 0.2s ease-in-out;
                padding: 5px;
            }
            .pack-collapsed .pack-emojis {
                height: 0 !important;
                padding: 0 5px !important;
            }
            .pack-icons-sidebar {
                display: flex;
                flex-direction: column;
                gap: 5px;
                padding: 5px;
                background: #1e1e1e;
                border-radius: 4px;
            }
            .pack-icon {
                margin-top: 5px;
                width: 40px;
                height: 40px;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.2s ease;
                border: 2px solid #0000;
                opacity: 0.7;
                border-radius: 4px;
            }
            .pack-icon:hover {
                border: 2px solid #7289da;
                opacity: 1;
            }
            .pack-icon.active {
                opacity: 1;
                background: #7289da33;
            }
            .packs-content {
                flex: 1;
            }
            .demoji-content-area{
                display: flex;
                flex-direction: row;
                gap: 10px;
                height: 300px;
                overflow: hidden;
                overflow-x: auto;
                scroll-behavior: smooth;
                padding: 5px;
                width: 502px;
            }
            </style>
            <div class="demoji-content-area">
                <div class="pack-icons-sidebar" id="packIconsSidebar"></div>
                <div class="packs-content">
                    <div class="demoji-header">
                        <div class="demoji_search">
                            <span class="fas fa-search fa-fw"></span>
                            <input type="text" placeholder="Искать эмодзи" id="demojiSearchInput">
                        </div>
                        <div class="demoji-controls">
                            <a id="addDiscordDemojiBtn" class="add-emoji-btn" title="Добавить эмодзи"><span class="far fa-plus fa-fw icon"></span></a>
                            <a id="addPackBtn" class="add-emoji-btn" title="Добавить пак"><span class="far fa-folder-plus fa-fw icon"></span></a>
                            <a id="importPackBtn" class="add-emoji-btn" title="Импортировать пак"><span class="far fa-upload fa-fw icon"></span></a>
                            <a id="aboutDiscordDemoji" class="add-emoji-btn" title="Как пользоваться"><span class="far fa-question fa-fw"></span></a>
                        </div>
                    </div>
                    <div id="demojiArea"></div>
                    <div class="demoji_notfound" id="demojiNotFound">
                        <h3>Ничего не найдено</h3>
                    </div>
                </div>
            </div>
        `;

    // Добавляем кнопку в .format
    if (editorFormatCont) {
        editorFormatCont.appendChild(demojiButton);
    } else {
        formatContainer.appendChild(demojiButton);
    }
    demojiMenu.querySelector('#addPackBtn').addEventListener('click', showAddPackDialog);

    // Добавляем меню в .emoji_holder
    if (document.querySelector(".emoji_holder")) {
        document.querySelector(".emoji_holder").appendChild(demojiMenu);
    } else if (document.querySelector(".toons_picker_relative")) {
        document.querySelector(".toons_picker_relative").appendChild(demojiMenu);
    } else if (editorFormatCont) {
        demojiMenu.classList.add("descr");
        document.querySelector(".tpicker.descr").insertAdjacentElement('afterend', demojiMenu);
    } else {
        console.error("Не удалось найти контейнер для Discord эмодзи меню");
        return;
    }

    // Обработчики событий
    document.getElementById('discordDemojiBtn').addEventListener('click', toggleDemojiMenu);
    document.getElementById('addDiscordDemojiBtn').addEventListener('click', showAddDemojiDialog);
    document.getElementById('aboutDiscordDemoji').addEventListener('click', showDemojiHelp);
    document.getElementById('demojiSearchInput').addEventListener('input', searchDemojis);
    document.getElementById('importPackBtn').addEventListener('click', importPack);

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('discordDemojiMenu');
        const btn = document.getElementById('discordDemojiBtn');
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    updateDemojiMenu();
}

function toggleDemojiMenu() {
    const menu = document.getElementById('discordDemojiMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function searchDemojis(event) {
    const searchText = event.target.value.toLowerCase();
    const demojiArea = document.getElementById('demojiArea');
    const notFoundMessage = document.getElementById('demojiNotFound');
    const packs = storage.get('demoji_packs');
    const emojis = storage.get('demoji_emojis');

    const filteredEmojis = searchText ?
        emojis.filter(emoji =>
            emoji.name.toLowerCase().includes(searchText) ||
            packs.find(p => p.id === emoji.packId)?.name.toLowerCase().includes(searchText)
        ) : emojis;

    if (filteredEmojis.length === 0) {
        demojiArea.style.display = 'none';
        notFoundMessage.style.display = 'block';
    } else {
        demojiArea.style.display = 'block';
        notFoundMessage.style.display = 'none';

        // Группируем эмодзи по пакам
        const groupedEmojis = {};
        filteredEmojis.forEach(emoji => {
            if (!groupedEmojis[emoji.packId]) {
                groupedEmojis[emoji.packId] = [];
            }
            groupedEmojis[emoji.packId].push(emoji);
        });

        // Отображаем эмодзи по пакам
        demojiArea.innerHTML = packs
            .sort((a, b) => a.order - b.order)
            .map(pack => {
                if (!groupedEmojis[pack.id]) return '';

                return `
                    <div class="pack-container">
                        <div class="pack-header" data-pack-header="${pack.id}">
                            <div class="pack-header-content" onclick="
                            if(!event.target.parentElement.classList.contains('pack-buttons') &&
                            !event.target.parentElement.parentElement.classList.contains('pack-buttons')) togglePack('${pack.id}')">
                                <img src="${pack.icon}"
                                     oncontextmenu="editPackIcon('${pack.id}', event)"
                                     title="ПКМ чтобы изменить иконку">
                                <span oncontextmenu="editPackName('${pack.id}', event)"
                                      title="ПКМ чтобы изменить название">${pack.name}</span>
                                <span class="arrow">
                                    <i class="fas fa-chevron-down"></i>
                                </span>
                                <div class="pack-buttons">
                                    <button class="pack-btn add-emoji-btn" onclick="addEmojiToPackK('${pack.id}')" title="Добавить эмодзи в пак">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                    <button class="pack-btn share-pack-btn" onclick="exportPack('${pack.id}')" title="Экспортировать пак">
                                        <i class="fas fa-download"></i>
                                    </button>
                                    <button class="pack-btn delete-pack-btn" onclick="deletePack('${pack.id}')" title="Удалить пак">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="pack-emojis">
                            ${groupedEmojis[pack.id].map(emoji => `
                                <img
                                    src="https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}"
                                    alt=":${emoji.name}:"
                                    title=":${emoji.name}:"
                                    class="discordDemoji"
                                    data-id="${emoji.id}"
                                    onclick="T.AddText('<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}'>, ${document.querySelector(".send .format") ? "false" : "true"})"
                                    onmousedown="handleDemojiMouseDown(event, '${emoji.id}')"
                                >
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
    }
}

function updateDemojiMenu() {
    const demojiArea = document.getElementById('demojiArea');
    const packIconsSidebar = document.getElementById('packIconsSidebar');
    const packs = storage.get('demoji_packs');
    const emojis = storage.get('demoji_emojis');
    const searchText = document.getElementById('demojiSearchInput').value.toLowerCase();

    // Обновляем сайдбар с иконками
    packIconsSidebar.innerHTML = packs
        .sort((a, b) => a.order - b.order)
        .map(pack => `
                <img
                    src="${pack.icon}"
                    class="pack-icon"
                    data-pack-id="${pack.id}"
                    title="${pack.name}"
                    onclick="scrollToPack('${pack.id}')"
                >
            `).join('');

    const filteredEmojis = searchText ?
        emojis.filter(emoji =>
            emoji.name.toLowerCase().includes(searchText) ||
            packs.find(p => p.id === emoji.packId)?.name.toLowerCase().includes(searchText)
        ) : emojis;

    if (filteredEmojis.length === 0) {
        demojiArea.style.display = 'none';
        document.getElementById('demojiNotFound').style.display = 'block';
        return;
    }

    demojiArea.style.display = 'block';
    document.getElementById('demojiNotFound').style.display = 'none';

    // Группируем эмодзи по пакам
    const groupedEmojis = {};
    filteredEmojis.forEach(emoji => {
        if (!groupedEmojis[emoji.packId]) {
            groupedEmojis[emoji.packId] = [];
        }
        groupedEmojis[emoji.packId].push(emoji);
    });

    // Отображаем эмодзи по пакам
    demojiArea.innerHTML = packs
        .sort((a, b) => a.order - b.order)
        .map(pack => {
            const packEmojis = groupedEmojis[pack.id] || [];

            // Сортируем эмодзи: сначала статические, потом анимированные
            const sortedEmojis = packEmojis.sort((a, b) => {
                if (a.animated === b.animated) {
                    return a.name.localeCompare(b.name); // Сортировка по имени внутри каждой группы
                }
                return a.animated ? 1 : -1; // Анимированные идут после статических
            });

            return `
                <div class="pack-container">
                    <div class="pack-header" data-pack-header="${pack.id}">
                        <div class="pack-header-content" onclick="
                        if(!event.target.parentElement.classList.contains('pack-buttons') &&
                        !event.target.parentElement.parentElement.classList.contains('pack-buttons')) togglePack('${pack.id}')">
                            <img src="${pack.icon}"
                                 oncontextmenu="editPackIcon('${pack.id}', event)"
                                 title="ПКМ чтобы изменить иконку">
                            <span oncontextmenu="editPackName('${pack.id}', event)"
                                  title="ПКМ чтобы изменить название">${pack.name}</span>
                            <span class="arrow">
                                <i class="fas fa-chevron-down"></i>
                            </span>
                            <div class="pack-buttons">
                                <button class="pack-btn add-emoji-btn" onclick="addEmojiToPackK('${pack.id}')" title="Добавить эмодзи в пак">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="pack-btn share-pack-btn" onclick="exportPack('${pack.id}')" title="Экспортировать пак">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="pack-btn delete-pack-btn" onclick="deletePack('${pack.id}')" title="Удалить пак">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="pack-emojis">
                        ${packEmojis.length > 0 ?
                    packEmojis.map(emoji => `
                                <img
                                    src="https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}"
                                    alt=":${emoji.name}:"
                                    title=":${emoji.name}:"
                                    class="discordDemoji"
                                    data-id="${emoji.id}"
                                    onclick="T.AddText('<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>', ${document.querySelector(".send .format") ? "false" : "true"})"
                                    onmousedown="handleDemojiMouseDown(event, '${emoji.id}')"
                                >
                            `).join('')
                    : '<div class="no-emojis-message">В этом паке пока нет эмодзи</div>'
                }
                    </div>
                </div>
            `;
        }).join('');
}

function showAddDemojiDialog() {
    const packs = storage.get('demoji_packs');
    if (packs.length === 0) {
        alert('Сначала создайте хотя бы один пак!');
        return;
    }

    const packId = prompt(`Выберите ID пака для добавления:\n${packs.map(p => `${p.id}: ${p.name}`).join('\n')}`);
    if (!packId || !packs.find(p => p.id === packId)) {
        alert('Неверный ID пака!');
        return;
    }

    addEmojiToPackK(packId)
}

function addEmojiToPackK(packId) {
    const input = prompt('Вставьте ID Discord эмодзи (можно несколько через пробел)\nФорматы: id или id:name');
    if (!input) return;

    const items = input.split(/\s+/).filter(item => item.length > 0);

    items.forEach(item => {
        let id, name;
        if (item.includes(':')) {
            [id, name] = item.split(':');
        } else {
            id = item;
            name = id.slice(0, 4);
        }

        if (!/^\d+$/.test(id)) {
            alert(`Неверный формат ID эмодзи: ${id}`);
            return;
        }

        checkAndAddEmoji(id, name, packId);
    });
}
// Проверка и добавление эмодзи
function checkAndAddEmoji(id, name, packId) {
    const img = new Image();
    img.onload = function () {
        addEmojiToPack(id, name, packId, true);
    };
    img.onerror = function () {
        const staticImg = new Image();
        staticImg.onload = function () {
            addEmojiToPack(id, name, packId, false);
        };
        staticImg.onerror = function () {
            alert(`Эмодзи с ID ${id} не найден!`);
        };
        staticImg.src = `https://cdn.discordapp.com/emojis/${id}.webp`;
    };
    img.src = `https://cdn.discordapp.com/emojis/${id}.gif`;
}

// Добавление эмодзи в пак
function addEmojiToPack(id, name, packId, animated) {
    const emojis = storage.get('demoji_emojis') || [];
    emojis.push({
        id: id,
        name: name,
        packId: packId,
        animated: animated
    });
    storage.set('demoji_emojis', emojis);
    updateDemojiMenu();
}

function showDemojiHelp() {
    alert(`Как пользоваться Discord эмодзи

📦 Управление паками
• Добавить пак: нажмите кнопку "+" в верхнем меню
• Удалить пак: нажмите кнопку корзины в заголовке пака
• Поделиться паком: нажмите кнопку "экспорт" в заголовке пака
• Установить пак: нажмите кнопку "импорт" в верхнем меню и выберите файл

😀 Управление эмодзи
• Добавить эмодзи: нажмите "+" в заголовке пака и вставьте ссылку или ID эмодзи
• Использовать эмодзи: кликните левой кнопкой мыши по эмодзи
• Переименовать эмодзи: нажмите среднюю кнопку мыши (колесико)
• Удалить эмодзи: нажмите правую кнопку мыши

🔍 Поиск
• Используйте поисковую строку для поиска по имени эмодзи или названию пака
• Поиск работает в реальном времени

💡 Дополнительно
• Паки можно сворачивать/разворачивать, кликнув по заголовку
• Быстрая навигация по пакам доступна через боковую панель
• Для добавления эмодзи из Discord, скопируйте ID эмодзи (\\:emoji:)
• Поддерживаются как статические, так и анимированные эмодзи

⚠️ Важно
• Эмодзи сохраняются локально в вашем браузере
• При очистке данных браузера, все сохраненные эмодзи будут удалены
• Рекомендуется периодически экспортировать паки для создания резервной копии`);
}

window.removeDiscordDemoji = function (demojiId) {
    if (confirm('Удалить этот эмодзи?')) {
        const emojis = storage.get('demoji_emojis');
        const newEmojis = emojis.filter(e => e.id !== demojiId);
        storage.set('demoji_emojis', newEmojis);
        updateDemojiMenu();
    }
};

// Конвертация эмодзи в комментариях
function convertDiscordDemojis(element) {
    if (!element) return;

    element.innerHTML = element.innerHTML.replace(
        /&lt;(a?):(\w+):(\d+)&gt;|<(a?):(\w+):(\d+)>/g,
        (match, animated1, name1, id1, animated2, name2, id2) => {
            const animated = animated1 || animated2;
            const name = name1 || name2;
            const id = id1 || id2;
            const extension = animated ? 'gif' : 'webp';
            return `<img src="https://cdn.discordapp.com/emojis/${id}.${extension}"
                    alt=":${name}:"
                    class="discord-demoji"
                    style=""
                    data-demoji-id="${id}"
                    data-demoji-name="${name}"
                    data-demoji-animated="${!!animated}"
                    oncontextmenu="copyEmojiInfo(event, '${id}', '${name}')"
                    >`;
        }
    );
}

// Обработка существующих комментариев
function processExistingComments() {
    const comments = document.querySelectorAll('div.comment_data > p');
    comments.forEach(convertDiscordDemojis);
    const desc = document.querySelectorAll(".description:not(textarea)");
    desc.forEach(convertDiscordDemojis);
    const toonName = document.querySelectorAll(".content.divided.watch .info h1");
    toonName.forEach(convertDiscordDemojis);
    const smallToonName = document.querySelectorAll(".toon_data .name a");
    smallToonName.forEach(convertDiscordDemojis);
}

// Наблюдатель за новыми комментариями
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                const comments = node.querySelectorAll('div.comment_data > p');
                const desc = node.querySelectorAll(".description:not(textarea)");
                const toonName = node.querySelectorAll(".content.divided.watch .info h1");
                const smallToonName = node.querySelectorAll(".toon_data .name a");
                comments.forEach(convertDiscordDemojis);
                desc.forEach(convertDiscordDemojis);
                toonName.forEach(convertDiscordDemojis);
                smallToonName.forEach(convertDiscordDemojis);
            }
        });
    });
});

// Инициализация
function init() {
    try {
        const additionalStyles = `
.no-emojis-message {
    padding: 10px;
    text-align: center;
    color: #666;
    font-family: 'Pangolin', sans-serif;
    border-radius: 4px;
    margin: 5px;
}
    .discord-demoji{
        width: 40px;
        height: 40px;
        vertical-align: middle;
    }
    .toon_data .discord-demoji{
       width: 20px !important;
       height: 20px !important;
    }

        .pack-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            border-radius: 4px;
        }

        .pack-container{
            background: #2f3136;
        }

        .pack-header-content {
            display: grid;
            grid-template-columns: auto 1fr 1fr auto;
            gap: 10px;
            align-items: center;
            width: 100%;
        }

        .pack-header-content span {
            opacity: 0.7;
            transition: all 0.2s ease;
        }

        .pack-header-content:hover span {
            opacity: 1;
        }

        .add-emoji-btn {
            background: transparent;
            border: none;
            color: #b9bbbe;
            padding: 5px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            width: 100%;
            item-align: center;
            text-align: center;
        }
        .add-emoji-btn span{
            margin: 0;
        }
        .add-emoji-btn:hover {
            color: white;
            background: #40444b;
        }

        .pack-buttons {
            display: flex;
            gap: 5px;
            margin-left: auto;
        }

        .pack-btn {
            background: transparent;
            border: none;
            color: #b9bbbe;
            padding: 5px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
        }

        .pack-btn:hover {
            color: white;
            background: #40444b;
        }

        .share-pack-btn {
            color: #b9bbbe;
        }

        .share-pack-btn:hover {
            color: #00b0f4;
        }

        .pack-header-content img {
            width: 24px;
            height: 24px;
            border-radius: 4px;
        }

        .delete-pack-btn {
            color: #b9bbbe;
        }

        .delete-pack-btn:hover {
            color: #ed4245;
            background: rgba(237, 66, 69, 0.1);
        }

        .emoji-copy-notification {
            position: fixed;
            background: #36393f;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            pointer-events: none;
            animation: fadeInOut 1.5s ease forwards;
            transform: translate(-50%, -100%);
            margin-top: -10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            font-family: 'Pangolin', sans-serif;
        }

        @keyframes fadeInOut {
            0% {
                opacity: 0;
                transform: translate(-50%, -90%);
            }
            15% {
                opacity: 1;
                transform: translate(-50%, -100%);
            }
            85% {
                opacity: 1;
                transform: translate(-50%, -100%);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -90%);
            }
        }
    `;
        document.querySelector('style').textContent += additionalStyles;
    } catch { }
    processExistingComments();
    if (document.querySelector("#comment_form") || document.querySelector(".sender") || document.querySelector("iframe#draw")) {
        createDemojiUI();
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Запуск после загрузки страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// Добавляем глобальную функцию для обработки нажатий мыши
window.handleDemojiMouseDown = function (event, demojiId) {
    event.preventDefault();
    console.log(event.button)
    if (event.button === 1) { // Средняя кнопка мыши
        renameDemoji(demojiId);
    } else if (event.button === 2) { // Правая кнопка мыши
        removeDiscordDemoji(demojiId);
    }
};

function renameDemoji(demojiId) {
    console.log(demojiId);
    const emojis = storage.get('demoji_emojis');
    const emoji = emojis.find(e => e.id === demojiId);

    if (!emoji) return;

    const newName = prompt('Введите новое имя для эмодзи:', emoji.name);
    if (newName && newName.trim()) {
        emoji.name = newName.trim();
        storage.set('demoji_emojis', emojis);
        updateDemojiMenu();
    }
}

function showAddPackDialog() {
    const packName = prompt('Введите название пака:');
    if (!packName) return;

    const packIcon = prompt('Вставьте URL иконки пака:');
    if (!packIcon) return;

    const packs = storage.get('demoji_packs');
    const newPack = {
        id: Date.now().toString(),
        name: packName,
        icon: packIcon,
        order: packs.length // Для сортировки паков
    };

    packs.push(newPack);
    storage.set('demoji_packs', packs);
    updateDemojiMenu();
    alert('Пак успешно создан!\nID пака: ' + newPack.id);
}

window.togglePack = togglePack;

// Добавляем стили


// Добавляем в глобальную область видимости
window.addEmojiToPackK = addEmojiToPackK;

function togglePack(packId) {
    const packContainer = document.querySelector(`[data-pack-header="${packId}"]`).closest('.pack-container');
    const emojisContainer = packContainer.querySelector('.pack-emojis');

    // Сохраняем текущее состояние
    const isCollapsed = packContainer.classList.contains('pack-collapsed');

    if (!isCollapsed) {
        // Сворачиваем
        const currentHeight = emojisContainer.offsetHeight;
        emojisContainer.style.height = currentHeight + 'px';

        // Форсируем reflow
        emojisContainer.offsetHeight;

        packContainer.classList.add('pack-collapsed');
    } else {
        // Разворачиваем
        emojisContainer.style.transition = 'none';
        packContainer.classList.remove('pack-collapsed');

        const targetHeight = emojisContainer.scrollHeight;
        packContainer.classList.add('pack-collapsed');
        emojisContainer.style.height = '0px';

        // Форсируем reflow
        emojisContainer.offsetHeight;

        emojisContainer.style.transition = '';
        packContainer.classList.remove('pack-collapsed');
        emojisContainer.style.height = targetHeight + 'px';
    }

    // Очищаем высоту после анимации
    emojisContainer.addEventListener('transitionend', function handler() {
        if (!packContainer.classList.contains('pack-collapsed')) {
            emojisContainer.style.height = '';
        }
        emojisContainer.removeEventListener('transitionend', handler);
    });
}

function scrollToPack(packId) {
    const packElement = document.querySelector(`[data-pack-header="${packId}"]`);
    if (packElement) {
        // Обновляем активную иконку
        document.querySelectorAll('.pack-icon').forEach(icon => {
            icon.classList.remove('active');
        });
        document.querySelector(`.pack-icon[data-pack-id="${packId}"]`).classList.add('active');

        // Прокручиваем к паку
        const demojiArea = document.getElementById('demojiArea');
        const packTop = packElement.offsetTop;
        demojiArea.scrollTo({
            top: packTop,
            behavior: 'smooth'
        });

        // Разворачиваем пак, если он свёрнут
        const packContainer = packElement.closest('.pack-container');
        if (packContainer.classList.contains('pack-collapsed')) {
            togglePack(packId);
        }
    }
}


// Добавляем в глобальную область видимости
window.scrollToPack = scrollToPack;
window.deletePack = deletePack;



// Добавляем функцию удаления пака
function deletePack(packId) {
    const packs = storage.get('demoji_packs');
    const pack = packs.find(p => p.id === packId);

    if (!pack) return;

    if (!confirm(`Вы уверены, что хотите удалить пак "${pack.name}"?\nВсе эмодзи пака также будут удалены.`)) {
        return;
    }

    // Удаляем пак
    const newPacks = packs.filter(p => p.id !== packId);
    storage.set('demoji_packs', newPacks);

    // Удаляем все эмодзи пака
    const emojis = storage.get('demoji_emojis');
    const newEmojis = emojis.filter(e => e.packId !== packId);
    storage.set('demoji_emojis', newEmojis);

    updateDemojiMenu();
    alert(`Пак "${pack.name}" успешно удален!`);
}

// Добавляем в глобальную область видимости
window.deletePack = deletePack;

// Функция экспорта пака
function exportPack(packId) {
    const packs = storage.get('demoji_packs');
    const emojis = storage.get('demoji_emojis');

    const pack = packs.find(p => p.id === packId);
    const packEmojis = emojis.filter(e => e.packId === packId);

    if (!pack || !packEmojis.length) {
        alert('Ошибка: пак не найден или пуст');
        return;
    }

    const packData = {
        pack: pack,
        emojis: packEmojis
    };

    const blob = new Blob([JSON.stringify(packData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${pack.name}_pack.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Функция импорта пака
function importPack() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const packData = JSON.parse(e.target.result);
                const { pack, emojis } = packData;

                // Получаем текущие паки и эмодзи
                const currentPacks = storage.get('demoji_packs');
                const currentEmojis = storage.get('demoji_emojis');

                // Проверяем, существует ли уже пак с таким ID
                const existingPack = currentPacks.find(p => p.id === pack.id);
                if (existingPack) {
                    if (!confirm(`Пак "${pack.name}" уже существует. Заменить?`)) {
                        return;
                    }
                    // Удаляем старые эмодзи пака
                    const newEmojis = currentEmojis.filter(e => e.packId !== pack.id);
                    storage.set('demoji_emojis', [...newEmojis, ...emojis]);

                    // Обновляем пак
                    const newPacks = currentPacks.map(p => p.id === pack.id ? pack : p);
                    storage.set('demoji_packs', newPacks);
                } else {
                    // Добавляем новый пак и его эмодзи
                    storage.set('demoji_packs', [...currentPacks, pack]);
                    storage.set('demoji_emojis', [...currentEmojis, ...emojis]);
                }

                updateDemojiMenu();
                alert(`Пак "${pack.name}" успешно импортирован!`);
            } catch (error) {
                console.error('Ошибка импорта пака:', error);
                alert('Ошибка при импорте пака. Неверный формат файла.');
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

window.exportPack = exportPack;

function editPackName(packId, event) {
    event.preventDefault(); // Предотвращаем стандартное контекстное меню
    const packs = storage.get('demoji_packs');
    const pack = packs.find(p => p.id === packId);

    if (!pack) return;

    const newName = prompt('Введите новое название пака:', pack.name);
    if (newName && newName.trim()) {
        pack.name = newName.trim();
        storage.set('demoji_packs', packs);
        updateDemojiMenu();
    }
}

function editPackIcon(packId, event) {
    event.preventDefault(); // Предотвращаем стандартное контекстное меню
    const packs = storage.get('demoji_packs');
    const pack = packs.find(p => p.id === packId);

    if (!pack) return;

    const newIcon = prompt('Вставьте новый URL иконки пака:', pack.icon);
    if (newIcon && newIcon.trim()) {
        pack.icon = newIcon.trim();
        storage.set('demoji_packs', packs);
        updateDemojiMenu();
    }
}


// Добавьте в глобальную область видимости
window.editPackName = editPackName;
window.editPackIcon = editPackIcon;

// Добавьте функцию для копирования в буфер обмена
function copyEmojiInfo(event, emojiId, emojiName) {
    event.preventDefault(); // Предотвращаем стандартное контекстное меню

    const emojiInfo = `${emojiId}:${emojiName}`;

    navigator.clipboard.writeText(emojiInfo).then(() => {
        // Создаем временное уведомление
        const notification = document.createElement('div');
        notification.className = 'emoji-copy-notification';
        notification.textContent = 'Информация скопирована';

        // Позиционируем уведомление возле курсора
        notification.style.left = `${event.pageX}px`;
        notification.style.top = `${event.pageY}px`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 1500);
    });
}
window.copyEmojiInfo = copyEmojiInfo;

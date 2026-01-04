// ==UserScript==
// @name         ShikiSearch+
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @namespace    https://shikimori.one
// @version      2.3
// @description  Добавляет больше ссылок в раздел "На других сайтах"
// @author       LifeH
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.6/Sortable.min.js 
// @downloadURL https://update.greasyfork.org/scripts/528487/ShikiSearch%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/528487/ShikiSearch%2B.meta.js
// ==/UserScript==
//todo recode
(function () {
    'use strict';

    const allowedPaths = ["/ranobe/", "/animes/", "/mangas/"];
    let isEditing = false;
    let editingIndex = null;

    const defaultLinks = [
        {
            title: "Hentailib",
            icon: "hentailib.me",
            link: "https://hentailib.me/catalog?q={search}",
            searchMethod: "title",
            group: "mangas",
            enabled: true,
        },
        {
            title: "Anime-joy",
            icon: "anime-joy.ru",
            link: "https://anime-joy.ru/index.php?story={search}&do=search&subaction=search",
            searchMethod: "title",
            group: "animes",
            enabled: true,
        },
        {
            title: "Smotret-anime",
            icon: "smotret-anime.org",
            link: "https://smotret-anime.org/catalog/search?q={search}",
            searchMethod: "title",
            group: "animes",
            enabled: false,
        },
        {
            title: "Anilibria",
            icon: "anilibria.tv",
            link: "https://www.anilibria.tv/release/{search}.html",
            searchMethod: "slug",
            group: "animes",
            enabled: true,
        },
        {
            title: "Anilibria Top",
            icon: "anilibria.top",
            link: "https://anilibria.top/anime/releases/release/{id}",
            searchMethod: "anilibriaApi",
            group: "animes",
            enabled: true,
        },
        {
            title: "Animego",
            icon: "animego.me",
            link: "https://animego.me/search/all?q={search}",
            searchMethod: "title",
            group: "animes",
            enabled: true,
        },
        {
            title: "Anilib",
            icon: "anilib.me",
            link: "https://anilib.me/ru/catalog?q={search}",
            searchMethod: "title",
            group: "animes",
            enabled: true,
        },
        {
            title: "reyohoho",
            icon: "reyohoho.github.io/reyohoho",
            link: "https://reyohoho.github.io/reyohoho/#shiki={search}",
            searchMethod: "id",
            group: "animes",
            enabled: true,
        },
        {
            title: "Jut.su",
            icon: "jut.su",
            link: "https://jut.su/search/?searchid=1893616&text={search}&web=0#",
            searchMethod: "title",
            group: "animes",
            enabled: true,
        },

        {
            title: "rutracker",
            icon: "rutracker.org",
            link: "https://rutracker.org/forum/tracker.php?nm={search}",
            searchMethod: "title",
            group: "animes",
            enabled: true,
        },
        {
            title: "Yummy-anime",
            icon: "yummy-anime.ru",
            link: "https://yummy-anime.ru/search?word={search}",
            searchMethod: "title",
            group: "animes",
            enabled: false,
        },
        {
            title: "Animevost",
            icon: "animevost.org",
            link: "https://animevost.org/index.php?do=search&subaction=search&search_start=0&full_search=0&result_from=1&story={search}",
            searchMethod: "title",
            group: "animes",
            enabled: false,
        },
        {
            title: "Crunchyroll",
            icon: "crunchyroll.com",
            link: "https://www.crunchyroll.com/search?q={search}",
            searchMethod: "originalTitle",
            group: "animes",
            enabled: false,
        },
        {
            title: "Amedia",
            icon: "amedia.lol",
            link: "https://amedia.lol/index.php?do=search&subaction=search&from_page=0&story={search}",
            searchMethod: "title",
            group: "animes",
            enabled: false,
        },
        {
            title: "Rezka",
            icon: "rezka.ag",
            link: "https://rezka.ag/search/?do=search&subaction=search&q={search}",
            searchMethod: "title",
            group: "animes",
            enabled: false,
        },
        {
            title: "Anime1",
            icon: "anime1.best",
            link: "https://anime1.best/index.php?do=search&subaction=search&search_start=0&full_search=0&result_from=1&story={search}",
            searchMethod: "title",
            group: "animes",
            enabled: false,
        }
    ];

    function getGroup() {
        const path = window.location.pathname;
        return allowedPaths.find((p) => path.startsWith(p))?.replace(/\//g, "");
    }
    function getTitle() {
        let titleElement = document.querySelector(".head h1");
        return titleElement
            ? titleElement.childNodes[0].textContent.trim()
            : null;
    }
    function getId() {
        const pathParts = window.location.pathname.split("/");
        const idPart = pathParts[2] || "";
        const match = idPart.match(/^[a-z]*(\d+)/);
        return match ? match[1] : null;
    }
    function getOriginalTitle() {
        const titleElement = document.querySelector(".head h1");
        if (!titleElement) return null;
        const separator = titleElement.querySelector(".b-separator.inline");
        if (!separator) return null;
        const originalTitle = separator.nextSibling?.textContent?.trim();
        return originalTitle || null;
    }
    function getSlug() {
        let path = window.location.pathname;
        let match = path.match(/\/(animes|mangas|ranobe)\/z?(\d+)-(.+)/);
        return match ? match[3] : null;
    }
    function getLinks() {
        let storedLinks = JSON.parse(localStorage.getItem("userLinks"));
        if (!storedLinks) {
            storedLinks = defaultLinks;
            saveLinks(storedLinks);
            return storedLinks;
        }
        let deletedLinks = JSON.parse(localStorage.getItem("deletedLinks")) || [];
        let updated = false;
        defaultLinks.forEach((defaultLink) => {
            if (deletedLinks.includes(defaultLink.title)) return;
            if (!storedLinks.some(link => link.title === defaultLink.title)) {
                storedLinks.push(defaultLink);
                updated = true;
            }
        });
        if (updated) {
            saveLinks(storedLinks);
        }
        return storedLinks;
    }
    function saveLinks(links) {
        localStorage.setItem("userLinks", JSON.stringify(links));
    }

    function linkBuilder({ icon, link, searchMethod, group: linkGroup, title, enabled }) {
        if (!enabled) return;

        const group = getGroup();
        if (linkGroup !== group) return;

        let parentBlock = document.querySelector(".subheadline.m8")?.parentElement;
        if (!parentBlock) return;
        if (parentBlock.querySelector(`[data-shiki-search="${title}"]`)) {
            return;
        }
        let searchParam;
        if (searchMethod === "slug") {
            searchParam = getSlug();
        } else if (searchMethod === "id") {
            searchParam = getId();
        } else if (searchMethod === "originalTitle") {
            searchParam = getOriginalTitle();
        } else {
            searchParam = getTitle();
        }
        if (!searchParam) return;

        let url = link.replace("{search}", encodeURIComponent(searchParam));

        let linkContainer = document.createElement('div');
        linkContainer.className = 'b-external_link b-menu-line';

        let anchor = document.createElement('a');
        anchor.className = 'b-link';
        anchor.href = url;
        anchor.textContent = title;
        anchor.target = '_blank';

        if (icon) {
            let img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?domain=${icon}`;
            img.style.width = '19px';
            img.style.height = '19px';
            img.style.marginRight = '5px';
            anchor.prepend(img);
        }

        linkContainer.appendChild(anchor);
        const span = document.createElement('span');
        span.dataset.shikiSearch = title;
        linkContainer.appendChild(span);
        parentBlock.appendChild(linkContainer);

        if (searchMethod === "anilibriaApi") {
            const title = getTitle();
            const apiUrl = `https://anilibria.top/api/v1/app/search/releases?query=${encodeURIComponent(title)}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const id = data[0].id;
                        const finalUrl = `https://anilibria.top/anime/releases/release/${id}`;
                        anchor.href = finalUrl;
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    function init() {
        let links = getLinks();
        links.forEach(linkBuilder);
    }
    function GUI() {
        const settingsBlock = document.querySelector('.block.edit-page.misc');
        if (!settingsBlock) return;
        if (document.querySelector('.shikisearch-config')) return;

        let container = document.createElement('div');
        container.className = 'shikisearch-config';
        container.style.padding = '20px';
        container.style.border = '1px solid #ccc';
        container.style.marginTop = '20px';
        container.style.background = '#f9f9f9';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        container.style.position = 'relative';

        container.innerHTML = `
            <h3 style="margin-bottom: 20px; text-align: center;">[ShikiSearch+] Config</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <input type="text" id="title" placeholder="Название" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                <input type="text" id="icon" placeholder="Домен (например: shikimori.one)" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                <input type="text" id="link" placeholder="Шаблон для ссылки поиска (используйте {search})" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                <select id="searchMethod" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <option value="title">По названию</option>
                    <option value="originalTitle">По названию (оригинал)</option>
                    <option value="slug">По Slug</option>
                    <option value="id">По ID</option>
                    <option value="anilibriaApi">anilibriaApi</option>
                </select>
                <select id="group" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    <option value="animes">Аниме</option>
                    <option value="mangas">Манга</option>
                    <option value="ranobe">Ранобэ</option>
                </select>
                <button id="addLink" style="padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Добавить</button>
            </div>
            <div id="linksList" style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;"></div>
            <span class="tooltip" style="position: absolute; top: 10px; right: 10px; cursor: help;">?
                <span class="tooltiptext">
                    <strong>Информация:</strong><br>
                    "По названию": Русское названия тайтла.<br>
                    "По Slug": Использует часть ссылки.<br>
                </span>
            </span>
        `;

        settingsBlock.appendChild(container);

        let style = document.createElement('style');
        style.textContent = `
            .tooltip {
                position: relative;
                display: inline-block;
                cursor: help;
                font-size: 14px;
                color: #555;
            }
            .tooltip .tooltiptext {
                visibility: hidden;
                width: 250px;
                background-color: #555;
                color: #fff;
                text-align: left;
                border-radius: 6px;
                padding: 10px;
                position: absolute;
                z-index: 1000;
                top: 100%;
                right: 0;
                opacity: 0;
                transition: opacity 0.3s;
                font-size: 12px;
                white-space: normal;
            }
            .tooltip:hover .tooltiptext {
                visibility: visible;
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        document.getElementById('addLink').addEventListener('click', () => {
            let title = document.getElementById('title').value.trim();
            let icon = document.getElementById('icon').value.trim();
            let link = document.getElementById('link').value.trim();
            let searchMethod = document.getElementById('searchMethod').value;
            let group = document.getElementById('group').value;

            if (!title || !link) {
                alert('Заполните название и ссылку!');
                return;
            }

            let links = getLinks();

            if (isEditing) {
                links[editingIndex] = { title, icon, link, searchMethod, group, enabled: true };
                isEditing = false;
                editingIndex = null;
                document.getElementById('addLink').textContent = 'Добавить';
            } else {
                links.push({ title, icon, link, searchMethod, group, enabled: true });
            }

            saveLinks(links);
            updateLinksList();
            clearForm();
        });

        updateLinksList();
    }
    function updateLinksList() {
        let linksList = document.getElementById('linksList');
        linksList.innerHTML = '';

        let links = getLinks();
        links.forEach((link, index) => {
            let card = document.createElement('div');
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.justifyContent = 'space-between';
            card.style.padding = '10px';
            card.style.border = '1px solid #ccc';
            card.style.borderRadius = '8px';
            card.style.background = '#fff';
            card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            card.style.cursor = 'grab';
            card.setAttribute('data-index', index);
            card.setAttribute('draggable', 'true');

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', '');
                e.target.style.opacity = '0.4';
            });

            card.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });

            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://www.google.com/s2/favicons?domain=${link.icon}" style="width: 16px; height: 16px;">
                    <span>${link.title} (${link.group})</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <label class="toggle-switch">
                        <input type="checkbox" ${link.enabled ? 'checked' : ''} onchange="toggleLink(${index}, this.checked)">
                        <span class="slider"></span>
                    </label>
                    <button onclick="editLink(${index})" style="padding: 5px 10px; background-color: #FFC107; color: white; border: none; border-radius: 4px; cursor: pointer;">Редактировать</button>
                    <button onclick="deleteLink(${index})" style="padding: 5px 10px; background-color: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Удалить</button>
                </div>
            `;

            linksList.appendChild(card);
        });

        new Sortable(linksList, {
            animation: 150,
            onEnd: function (evt) {
                let links = getLinks();
                let movedItem = links.splice(evt.oldIndex, 1)[0];
                links.splice(evt.newIndex, 0, movedItem);
                saveLinks(links);
                updateLinksList();
            }
        });

        let style = document.createElement('style');
        style.textContent = `
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            }
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.4s;
                border-radius: 20px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: 0.4s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: #4CAF50;
            }
            input:checked + .slider:before {
                transform: translateX(20px);
            }
 
            .sortable-chosen {
                background-color: #f0f0f0;
            }
            .sortable-ghost {
                opacity: 0.5;
            }
        `;
        document.head.appendChild(style);
    }
    function clearForm() {
        document.getElementById('title').value = '';
        document.getElementById('icon').value = '';
        document.getElementById('link').value = '';
        document.getElementById('searchMethod').value = 'title';
        document.getElementById('group').value = 'animes';
    }
    window.deleteLink = function (index) {
        if (confirm('Вы уверены, что хотите удалить эту ссылку?')) {
            let links = getLinks();
            let deletedLink = links[index];
            if (defaultLinks.some(link => link.title === deletedLink.title)) {
                let deletedLinks = JSON.parse(localStorage.getItem("deletedLinks")) || [];
                if (!deletedLinks.includes(deletedLink.title)) {
                    deletedLinks.push(deletedLink.title);
                    localStorage.setItem("deletedLinks", JSON.stringify(deletedLinks));
                }
            }
            links.splice(index, 1);
            saveLinks(links);
            updateLinksList();
        }
    };
    window.editLink = function (index) {
        let links = getLinks();
        let link = links[index];

        document.getElementById('title').value = link.title;
        document.getElementById('icon').value = link.icon;
        document.getElementById('link').value = link.link;
        document.getElementById('searchMethod').value = link.searchMethod;
        document.getElementById('group').value = link.group;

        isEditing = true;
        editingIndex = index;
        document.getElementById('addLink').textContent = 'Сохранить изменения';
    };
    window.toggleLink = function (index, enabled) {
        let links = getLinks();
        links[index].enabled = enabled;
        saveLinks(links);
    };
    function ready(fn) {
        document.addEventListener('page:load', fn);
        document.addEventListener('turbolinks:load', fn);
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(init);
    ready(GUI);
})();
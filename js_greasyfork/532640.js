// ==UserScript==
// @name         Vombat Fixes
// @namespace    https://greasyfork.org/ru/users/781312-ivankr08/
// @version      2025-04-12
// @license      WTFPL
// @description  Vombat.su, но с исправлением досадных упущений
// @author       IvanKr08
// @match        http*://vombat.su/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQwSURBVHhe7d0xSh1RFIDh9xJSa5stZCeCkP3YGBs3IwgBwVWI3duCrdbBJJDcFdxbjMP/fSBz6pnnz23mzAEAAAAAAAAAAAAAAAAAAAD4cI6H68s/Y96rt3Gdc/NwPqam68vXMc06G1d26NO4AkECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGHr+wB+fB/DRn78HMOku6e1fQKnl33vE9j7869b/P07AUCYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAPz/vv3KH+yWAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDYcfffh1/8Pvrh7mkMk04vxzHtU/35xzkBQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJh9APYBeP5hTgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQZh+AfQDt57+9t3Gdc/NwPqYpTgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQZh/Ar/cxTLp9tA+Aeev7LJb2CTgBQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQNj+9wGsWt8nsHb/bh+3jbB9ANta3wcwhjlOABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABC2vg9glX0C2+4T2Ps+gNX7v7X332OYdP88hjlOABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABB2HNd5Vxdr75N/+TyGSfYJrN7/td/A3vcBLH5f/wN4G9cpTgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQtr4PYNXVxdoH0vf+Pvuqrb+PX98HcHrZ/n9ogRMAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhO36XeZ/7BNosw9giRMAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhAkAhO1/H8Aq+wT2zT6AJU4AECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEGYfwKqt9wnUva/d/sP98xgm2QcA7JUAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJh30bf27evrmGadjStz3sZ1zunlfEy75AQAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAYQIAWYfDX+6pj01RG/WjAAAAAElFTkSuQmCC
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/532640/Vombat%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/532640/Vombat%20Fixes.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */

(function() {
    'use strict';

    const settings = {
        squareTheme     : [ false, 'Квадратная тема' ],
        addVideoDownload: [ true , 'Загрузка видео'  ],
        addTagSearch    : [ true , 'Поиск по тегу'   ],
    };

    function loadSettings() {
        Object.entries(settings).forEach(i => {
            settings[i[0]][0] = GM_getValue(i[0], i[1][0]);
        });
    }

    function closeSettingsMenu() {
        const panel = document.getElementById('fixesSettings');

        if (!panel) return;

        Object.entries(settings).forEach(i => {
            const value = document.getElementById(i[0]).checked;
            GM_setValue(i[0], value);
            settings[i[0]][0] = value;
        });

        panel.parentNode.removeChild(panel);
    }

    function showSettingsMenu() {
        if (document.getElementById('fixesSettings')) return;

        GM_addStyle(`
            #fixesSettings {
                position: fixed;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                z-index: 999999999;
                border: solid #00FF9B 1px;
                padding: 8px;

                background: #000000cc;
                color: #FFFFFF
            }

            #fixesSettings button {
                all: revert;
            }

            #fixesSettings input {
                margin: revert;
                padding: revert;
            }

            #fixesSettings b {
                color: #00FF9B;
            }
        `);

        const settingsPanel = document.createElement('div');
        settingsPanel.setAttribute('id', "fixesSettings");
        settingsPanel.setAttribute('class', "lg:rounded-xl");

        settingsPanel.innerHTML = `
            Настройки <b>Vombat Fixes</b><br>
            Для применения сохраните и обновите страницу<br>
        `;

        Object.entries(settings).forEach(i => {
            const setting = document.createElement('input');

            setting.setAttribute('id', i[0]);
            setting.setAttribute('type', 'checkbox');

            if (i[1][0] == true) setting.setAttribute('checked', '');

            const label = document.createElement('label');
            label.innerHTML = i[1][1];

            settingsPanel.appendChild(setting);
            settingsPanel.appendChild(label);
            settingsPanel.appendChild(document.createElement('br'));
        });

        const btn = document.createElement('button');
        btn.innerHTML = 'Сохранить и закрыть';
        btn.onclick = _ => closeSettingsMenu();
        settingsPanel.appendChild(btn);

        const body = document.getElementsByTagName('body')[0];
        body.appendChild(settingsPanel);
    }

    function testTagSearch(event) {
        if (!settings.addTagSearch[0]) return;

        if ((event.oldValue == false && event.oldValue.indexOf('opacity-0') !== -1) || document.getElementById('searchByTag0')) return;

        // TODO: Исправить добавление на все формы, а не только на первую. Требуется для мобильной темы
        let counter = 0;
        document.querySelectorAll('form[action="/new/all"]').forEach(form => {
            // Говнокод страшной силы
            const div   = form.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
            const input = div.childNodes[0].lastChild;

            div.setAttribute('style', "height: 200%");
            const btn = document.createElement('button');

            btn.setAttribute('type', 'button');
            btn.setAttribute('class', 'w-full bg-sky-500 dark:bg-sky-600 dark:text-slate-100 dark:focus:ring-0 align-middle select-none font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-1.5 pt-2 px-4 rounded-lg border border-sky-500 dark:border-sky-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none antialiased whitespace-nowrap');
            btn.innerHTML = 'Искать по тегу';
            btn.id        = 'searchByTag' + counter;

            btn.onclick = event => {
                if (input.value.length < 1) {
                    event.preventDefault();
                    return false;
                }
                window.location.href = 'https://vombat.su/tag/' + input.value;
            };

            div.appendChild(btn);

            console.log("Поиск обнаружен, хукаем " + counter);
            counter += 1;
        });
    }

    function testVideoDownload(node) {
        if (!settings.addVideoDownload[0]) return;

        if (node.classList == null || !node.classList.contains("plyr__controls")) return;

        const btn = document.createElement('button');
        const controls = node;

        // Иконка
        btn.innerHTML += `
            <svg class="icon--not-pressed" aria-hidden="true" focusable="false"><use xlink:href="#plyr-play"></use></svg>
            <span class="label--pressed plyr__sr-only">Download</span><span class="label--not-pressed plyr__sr-only">Download</span>
        `;

        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'plyr__controls__item plyr__control');
        btn.setAttribute('style', 'transform: rotate(90deg)');

        // Ищем обертку плеера
        node.parentNode.childNodes.forEach(node => {
            if (!node.classList.contains("plyr__video-wrapper")) return;

            // Сам плеер
            node.childNodes.forEach(node => {
                if (node.nodeName.toLowerCase() != "video") return;

                btn.onclick = event => {
                    if (event.altKey) {
                        GM_setClipboard(node.childNodes[0].src, "text");
                    }
                    else {
                        GM_download(node.childNodes[0].src, node.childNodes[0].src.split('/').pop());
                    }
                };

                controls.insertBefore(btn, controls.childNodes[controls.childNodes.length - 1]);
            });
        });
    }

    function makeSquareTheme() {
        if (!settings.squareTheme[0]) return;

        GM_addStyle(`
            /* Отменяем скругления */
            * {
                border-radius: 0!important;
            }

            /* Исправляем поля в редакторе */
            *::before, *::after {
                border-top-right-radius: 0!important;
                border-top-left-radius: 0!important;
            }

            /* Рамки для ключевых блоков и аватарки */
            .shadow-lg, aside > div > div, .relative.w-12.cursor-pointer.select-none {
                border-width: 1px!important;
                border-color: #475569!important;
            }
        `);
    }

    loadSettings();

    GM_registerMenuCommand("Настройки", _ => showSettingsMenu(), { autoClose: true });

    makeSquareTheme();

    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    testVideoDownload(node);
                });
            }
            else if (mutation.type === 'attributes') {
                testTagSearch(mutation);
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeOldValue: true });
})();
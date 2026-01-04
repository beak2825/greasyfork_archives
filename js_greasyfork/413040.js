// ==UserScript==
// @name         customStickers
// @namespace    https://github.com/yegorgunko/shikme-tools
// @version      1.0
// @description  Add custom stickers
// @author       Yegor Gunko mod Phobos
// @match        https://shikme.chat/
// @icon         https://shikme.chat/default_images/icon.png?v=1528136794
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413040/customStickers.user.js
// @updateURL https://update.greasyfork.org/scripts/413040/customStickers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const X = '900px';  // ШИРИНА ОКНА СТИКЕРОВ
    const storageKey = "customStickers";
    let e = JSON.parse(localStorage.getItem(storageKey)) || [];

    const style = `
        .large_modal_in.modal_in {
            max-width: 540px;
            width: 100%;
        }
        .large_modal_in.modal_in #stickersList.emo_content {
            width: 100%;
            height:380px;
            overflow-y: auto;
        }
        #stickersList.emo_content .custom-sticker {
            position: relative;
            height: 6em;
            float: left;
            margin: 0.5em;
            cursor: pointer;
        }
        .custom-sticker img {
            height: 100%;
            max-width: 100%;
        }
        .remove-sticker {
            position: absolute;
            top: 0;
            right: 0;
            color: red;
            cursor: pointer;
        }
        .export-import-container {
            margin-top: 1em;
            display: flex;
            gap: 0.5em;
        }
        .export-import-container button {
            padding: 0.5em 1em;
            cursor: pointer;
        }
    `;

    // Добавляем стили в head
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.appendChild(document.createTextNode(style));
    document.head.appendChild(styleElement);

    // Добавляем кнопку "Стикеры" в меню
    const chatLeftMenu = document.getElementById("chat_left_menu");
    if (chatLeftMenu) {
        chatLeftMenu.innerHTML += `
            <div class="list_element left_item">
                <div id="customStickers" class="left_item_in">
                    <i id="customStickersIcon" class="fa fa-plus menui"></i> Cтикеры
                </div>
            </div>
        `;
    }

    // Обработчик кликов
    document.addEventListener("click", (t) => {
        if (["customStickers", "customStickersIcon"].indexOf(t.target.id) > -1) {
            showStickersModal();
        } else if (t.target.id === "addSticker") {
            addSticker();
        } else if (t.target.id === "removeSticker") {
            removeSticker(t.target.getAttribute("data-target"));
        } else if (t.target.id === "exportStickers") {
            exportStickers();
        } else if (t.target.id === "importStickers") {
            importStickers();
        } else if (t.target.classList.contains("custom-sticker-image")) {
            insertSticker(t.target.src);
        }
    });

    function showStickersModal() {
        let stickersHTML = "";
        e.forEach(sticker => {
            stickersHTML += `
                <div class="custom-sticker">
                    <img class="custom-sticker-image" src="${sticker}">
                    <i id="removeSticker" data-target="${sticker}" class="fa fa-times remove-sticker"></i>
                </div>
            `;
        });

        const modal = document.getElementById("large_modal");
        if (modal) {
            modal.firstElementChild.style.maxWidth = X;
            modal.firstElementChild.style.width = '100%';
            modal.querySelector("#large_modal_content").innerHTML = `
                <div class="modal_wrap_top modal_top" id="modal_top_profile">
                    <div class="cancel_modal profile_close"><i class="fa fa-times"></i></div>
                </div>
                <div class="pad_box">
                    <div class="boom_form">
                        <div class="chat_settings">
                            <p class="label">Прямая ссылка на изображение стикера</p>
                            <input id="stickerURLInput" class="full_input" type="url" placeholder="Введите URL стикера">
                        </div>
                    </div>
                    <button id="addSticker" class="reg_button theme_btn">Добавить</button>
                </div>
                <div id="stickersList" class="emo_content">${stickersHTML || ""}</div>
                <div class="export-import-container">
                    <button id="exportStickers" class="reg_button theme_btn">Экспорт</button>
                    <button id="importStickers" class="reg_button theme_btn">Импорт</button>
                </div>
            `;
            modal.style.display = "block";
        }
    }

    function addSticker() {
        const input = document.getElementById("stickerURLInput");
        const url = input.value.trim();
        if (!url) {
            alert("Пожалуйста, введите URL стикера.");
            return;
        }
        if (!isValidURL(url)) {
            alert("Пожалуйста, введите корректный URL.");
            return;
        }
        if (e.includes(url)) {
            alert("Стикер уже находится в списке.");
            return;
        }
        e.unshift(url);
        localStorage.setItem(storageKey, JSON.stringify(e));
        refreshStickersList();
        input.value = "";
    }

    function removeSticker(target) {
        e = e.filter(sticker => sticker !== target);
        localStorage.setItem(storageKey, JSON.stringify(e));
        refreshStickersList();
    }

    function insertSticker(url) {
        const content = document.getElementById("content");
        const chatLeft = document.getElementById("chat_left");
        if (chatLeft.style.display === "block") {
            chatLeft.style.display = "none";
        }
        content.value += `${url} `;
        content.focus();
        document.getElementById("large_modal").style.display = "none";
    }

    function refreshStickersList() {
        let stickersHTML = "";
        e.forEach(sticker => {
            stickersHTML += `
                <div class="custom-sticker">
                    <img class="custom-sticker-image" src="${sticker}">
                    <i id="removeSticker" data-target="${sticker}" class="fa fa-times remove-sticker"></i>
                </div>
            `;
        });
        const stickersList = document.getElementById("stickersList");
        if (stickersList) {
            stickersList.innerHTML = stickersHTML;
        }
    }

    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function exportStickers() {
        const blob = new Blob([JSON.stringify(e)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "custom-stickers.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    function importStickers() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        if (Array.isArray(importedData)) {
                            e = importedData;
                            localStorage.setItem(storageKey, JSON.stringify(e));
                            refreshStickersList();
                            alert("Стикеры успешно импортированы.");
                        } else {
                            alert("Импортированный файл имеет неверный формат.");
                        }
                    } catch (error) {
                        alert("Ошибка при импорте стикеров.");
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
})();
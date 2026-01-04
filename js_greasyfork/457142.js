// ==UserScript==
// @name         Voice Stealer
// @namespace    https://vk.com/
// @version      1.6.0
// @description  Добавляет возможность сохранения чужих голосовых сообщений и отправки их от своего имени.
// @author       FallenAstaroth
// @match        https://vk.com/*
// @icon         https://img.icons8.com/color/512/vk-circled.png
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/457142/Voice%20Stealer.user.js
// @updateURL https://update.greasyfork.org/scripts/457142/Voice%20Stealer.meta.js
// ==/UserScript==

(async function() {
    "use strict";

    const db = await initDb();
    const myId = await getMyId();
    let replyMessageId = null;

    insertCss(`
        :root {
            --color-back-grey: #222222;
            --color-border: #424242;
            --color-grey: #656565;
            --color-hover-grey: #828282;
            --color-scrollbar: #888;
            --color-hover-scrollbar: #555;
            --color-border-green: #6abd71;
            --transition-time: .3s;
        }
        .voice-popup {
            display: none;
            background: rgba(0, 0, 0, .6);
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
        }
        .voice-stealer-save-audio,
        .voice-popup button {
            border: none;
            background: transparent;
            padding: 0;
            cursor: pointer;
        }
        .voice-popup h2,
        .voice-popup p {
            margin: 0;
        }
        .voice-popup .items .item .delete {
            position: relative;
            width: 18px;
            height: 18px;
            opacity: 1;
            transition: var(--transition-time);
        }
        .voice-popup .close {
            position: absolute;
            right: 16px;
            top: 16px;
            width: 18px;
            height: 18px;
            opacity: 1;
            transition: var(--transition-time);
        }
        .voice-popup .items .item .delete:hover,
        .voice-popup .close:hover {
          opacity: .7;
        }
        .voice-popup .items .item .delete:before, .voice-popup .items .item .delete:after,
        .voice-popup .close:before, .close:after {
            position: absolute;
            left: 8px;
            top: 1px;
            content: ' ';
            height: 16px;
            width: 2px;
            background-color: var(--color-grey);
        }
        .voice-popup .items .item .delete:before,
        .voice-popup .close:before {
            transform: rotate(45deg);
        }
        .voice-popup .items .item .delete:after,
        .voice-popup .close:after {
            transform: rotate(-45deg);
        }
        .voice-popup .content {
            width: 100%;
            max-width: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background-color: var(--color-back-grey);
            border-radius: 10px;
            border: 1px solid var(--color-border);
            z-index: 1001;
        }
        .voice-popup .items {
            overflow-x: auto;
            height: 100%;
            max-height: 305px;
            margin-top: 20px;
            background: var(--color-back-grey);
            border: 1px solid var(--color-border);
        }
        .voice-popup .tooltips::-webkit-scrollbar,
        .voice-popup .items::-webkit-scrollbar {
            width: 5px;
        }
        .voice-popup .tooltips::-webkit-scrollbar-track,
        .voice-popup .items::-webkit-scrollbar-track {
            background: transparent;
        }
        .voice-popup .tooltips::-webkit-scrollbar-thumb,
        .voice-popup .items::-webkit-scrollbar-thumb {
            background: var(--color-scrollbar);
        }
        .voice-popup .tooltips::-webkit-scrollbar-thumb:hover,
        .voice-popup .items::-webkit-scrollbar-thumb:hover {
            background: ver(--color-hover-scrollbar);
        }
        .voice-popup .items .item:not(:first-child) {
            border-top: 1px solid var(--color-border);
        }
        .voice-popup .items .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            transition: var(--transition-time);
        }
        .voice-popup .items .item.searched {
            border: 1px solid var(--color-border-green);
        }
        .voice-popup .items .item p {
            width: 100%;
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .voice-popup .items .item p svg {
            width: 20px;
            height: 20px;
        }
        .voice-popup .tools {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .voice-popup .upload-audio {
            display: flex;
            align-items: center;
            margin-top: 20px;
        }
        .voice-popup .upload-audio .audio {
            display: none;
        }
        .voice-popup .upload-audio .save,
        .voice-popup .upload-audio .upload {
            padding: 8px;
            margin-left: 10px;
            background-color: var(--color-grey);
            display: block;
            border-radius: 5px;
            cursor: pointer;
            display: block;
            transition: var(--transition-time);
        }
        .voice-popup .upload-audio.multi-upload .upload {
            margin-left: 0;
        }
        .voice-popup .upload-audio.multi-upload .save {
            width: 100%;
        }
        .voice-popup .upload-audio .save:hover,
        .voice-popup .upload-audio .upload:hover {
            background-color: var(--color-hover-grey);
        }
        .voice-popup .upload-audio .save {
            padding: 11px 12px;
        }
        .voice-popup .form {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
        .voice-popup .upload-audio .name,
        .voice-popup .search input,
        .voice-popup .form input {
            width: 100%;
            background: transparent;
            border: 1px solid var(--color-border);
            border-radius: 5px;
            padding: 10px 12px;
        }
        .voice-popup .form button {
            background-color: var(--color-grey);
            border-radius: 5px;
            padding: 10px 12px;
            margin-left: 10px;
            transition: var(--transition-time);
        }
        .voice-popup .form button:hover {
            background-color: var(--color-hover-grey);
        }
        .voice-popup .search.form {
            margin-top: 0;
        }
        .voice-popup .search .tooltips {
            position: absolute;
            overflow-x: auto;
            max-height: 120px;
            top: 45px;
            left: 0;
            display: none;
            padding: 10px 0;
            background: var(--color-back-grey);
            border: 1px solid var(--color-border);
            border-radius: 5px;
        }
        .voice-popup .search .tooltips .tooltip {
            padding: 5px 12px;
            cursor: pointer;
        }
        .voice-popup .search,
        .im_msg_audiomsg {
            position: relative;
        }
        .voice-stealer-save-audio {
            position: absolute;
            padding: 0 5px;
            bottom: 30px;
            right: -25px;
        }
        .voice-stealer-save-audio svg {
            width: 16px;
            height: 16px;
        }
    `);

    function insertCss(css) {
        var head = document.getElementsByTagName("head")[0];
        if (!head) {
            return;
        }
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css;
        head.appendChild(style);
    }

    function insertElements() {
        $("body").append(`
            <div class="voice-popup voice-messages-list">
                <div class="content">
                    <button class="close"></button>
                    <h2>Список сохранённых ГС</h2>
                    <div class="items"></div>
                    <div class="tools">
                        <div class="search form">
                            <input type="text" placeholder="Поиск">
                            <div class="tooltips"></div>
                        </div>
                    </div>
                    <div class="upload-audio single-upload">
                        <input type="text" class="name" placeholder="Название">
                        <input class="audio" id="stealer-audio" type="file" accept=".mp3">
                        <label for="stealer-audio" class="upload">
                            <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <g fill="currentColor">
                                    <path d="M19 19a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2zm-7-2a1 1 0 0 1-1-1V5.41l-4.3 4.3a1 1 0 0 1-1.31.08l-.1-.08a1 1 0 0 1 0-1.42l6-6a1 1 0 0 1 1.42 0l6 6a1 1 0 0 1-1.42 1.42L13 5.4V16a1 1 0 0 1-1 1z"></path>
                                </g>
                            </svg>
                        </label>
                        <button class="save">Добавить</button>
                    </div>
                    <div class="upload-audio multi-upload">
                        <input class="audio" id="stealer-audios" type="file" accept=".mp3" multiple>
                        <label for="stealer-audios" class="upload">
                            <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <g fill="currentColor">
                                    <path d="M19 19a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2zm-7-2a1 1 0 0 1-1-1V5.41l-4.3 4.3a1 1 0 0 1-1.31.08l-.1-.08a1 1 0 0 1 0-1.42l6-6a1 1 0 0 1 1.42 0l6 6a1 1 0 0 1-1.42 1.42L13 5.4V16a1 1 0 0 1-1 1z"></path>
                                </g>
                            </svg>
                        </label>
                        <button class="save">Добавить все</button>
                    </div>
                </div>
            </div>
        `);
        $("body").append(`
            <div class="voice-popup voice-messages-save">
                <div class="content">
                    <button class="close"></button>
                    <h2>Сохранить новое ГС</h2>
                    <div class="form">
                        <input type="text" placeholder="Название"/>
                        <button class="save">Сохранить</button>
                    </div>
                </div>
            </div>
        `);
        $(".im_chat-input--buttons").prepend(`
            <div class="im-chat-input--attach voice-stealer">
                <label onmouseover="showTooltip(this, { text: 'Отправить сохранённое ГС', black: true, shift: [4, 5] });" class="im-chat-input--attach-label">
                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <g id="music_outline_20__Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="music_outline_20__Icons-20/music_outline_20">
                                <g id="music_outline_20__music_outline_20">
                                    <path d="M0 0h20v20H0z"></path>
                                    <path d="M14.73 2.05a2.28 2.28 0 0 1 2.75 2.23v7.99c0 3.57-3.5 5.4-5.39 3.51-1.9-1.9-.06-5.38 3.52-5.38h.37V6.76L8 8.43v5.82c0 3.5-3.35 5.34-5.27 3.62l-.11-.1c-1.9-1.9-.06-5.4 3.51-5.4h.37V6.24c0-.64.05-1 .19-1.36l.05-.13c.17-.38.43-.7.76-.93.36-.26.7-.4 1.41-.54ZM6.5 13.88h-.37c-2.32 0-3.34 1.94-2.45 2.82.88.89 2.82-.13 2.82-2.45v-.37Zm9.48-1.98h-.37c-2.32 0-3.34 1.94-2.46 2.82.89.89 2.83-.13 2.83-2.45v-.37Zm-.02-7.78a.78.78 0 0 0-.92-.6L9.06 4.77c-.4.09-.54.15-.68.25a.8.8 0 0 0-.27.33c-.08.18-.1.35-.1.88v.67l7.97-1.67V4.2Z" id="music_outline_20__Icon-Color" fill="currentColor" fill-rule="nonzero"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </label>
            </div>
        `);
    }

    function insertSaveButtonOnLoad() {
        $(".im_msg_audiomsg").append(`
            <button class="voice-stealer-save-audio">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10.18 1.5H9c-.8 0-1.47 0-2.01.05-.63.05-1.17.16-1.67.41a4.25 4.25 0 0 0-1.86 1.86c-.25.5-.36 1.04-.41 1.67C3 6.1 3 6.86 3 7.82v4.36c0 .95 0 1.71.05 2.33.05.63.16 1.17.41 1.67a4.25 4.25 0 0 0 1.86 1.86c.5.25 1.04.36 1.67.4.61.06 1.37.06 2.33.06h1.36c.96 0 1.72 0 2.33-.05a4.39 4.39 0 0 0 1.67-.41 4.25 4.25 0 0 0 1.86-1.86c.25-.5.36-1.04.41-1.67.05-.62.05-1.38.05-2.33V8.32c0-.48 0-.73-.06-.96-.05-.2-.13-.4-.24-.58-.12-.2-.3-.37-.64-.72l-3.62-3.62a4.27 4.27 0 0 0-.72-.65 2 2 0 0 0-.58-.24c-.23-.05-.48-.05-.96-.05Zm5.32 10.65c0 1 0 1.7-.04 2.24a2.9 2.9 0 0 1-.26 1.1A2.75 2.75 0 0 1 14 16.7c-.25.13-.57.21-1.11.26-.55.04-1.25.04-2.24.04h-1.3c-1 0-1.7 0-2.24-.04a2.9 2.9 0 0 1-1.1-.26 2.75 2.75 0 0 1-1.21-1.2 2.94 2.94 0 0 1-.26-1.11c-.04-.55-.04-1.25-.04-2.24v-4.3c0-1 0-1.7.04-2.24.05-.53.13-.86.26-1.1A2.75 2.75 0 0 1 6 3.3c.25-.13.57-.21 1.11-.26C7.66 3 8.36 3 9.35 3H10v2.35c0 .4 0 .76.02 1.05.03.3.09.61.24.9.21.4.54.73.94.94.29.15.6.21.9.24.29.02.64.02 1.05.02h2.35v3.65ZM14.88 7 11.5 3.62v1.7c0 .45 0 .74.02.95.02.22.05.3.07.33a.75.75 0 0 0 .3.31c.05.02.12.05.33.07.22.02.51.02.96.02h1.7Z" clip-rule="evenodd"></path>
                </svg>
            </button>
        `);
    }

    function insertSaveButtonOnUpdate() {
        $(".im-page-chat-contain").on("DOMSubtreeModified", function(event) {
            if ($(event.target).find(".im_msg_audiomsg .voice-stealer-save-audio").length > 0) {
                return;
            }
            $(event.target).find(".im_msg_audiomsg").append(`
                <button class="voice-stealer-save-audio">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10.18 1.5H9c-.8 0-1.47 0-2.01.05-.63.05-1.17.16-1.67.41a4.25 4.25 0 0 0-1.86 1.86c-.25.5-.36 1.04-.41 1.67C3 6.1 3 6.86 3 7.82v4.36c0 .95 0 1.71.05 2.33.05.63.16 1.17.41 1.67a4.25 4.25 0 0 0 1.86 1.86c.5.25 1.04.36 1.67.4.61.06 1.37.06 2.33.06h1.36c.96 0 1.72 0 2.33-.05a4.39 4.39 0 0 0 1.67-.41 4.25 4.25 0 0 0 1.86-1.86c.25-.5.36-1.04.41-1.67.05-.62.05-1.38.05-2.33V8.32c0-.48 0-.73-.06-.96-.05-.2-.13-.4-.24-.58-.12-.2-.3-.37-.64-.72l-3.62-3.62a4.27 4.27 0 0 0-.72-.65 2 2 0 0 0-.58-.24c-.23-.05-.48-.05-.96-.05Zm5.32 10.65c0 1 0 1.7-.04 2.24a2.9 2.9 0 0 1-.26 1.1A2.75 2.75 0 0 1 14 16.7c-.25.13-.57.21-1.11.26-.55.04-1.25.04-2.24.04h-1.3c-1 0-1.7 0-2.24-.04a2.9 2.9 0 0 1-1.1-.26 2.75 2.75 0 0 1-1.21-1.2 2.94 2.94 0 0 1-.26-1.11c-.04-.55-.04-1.25-.04-2.24v-4.3c0-1 0-1.7.04-2.24.05-.53.13-.86.26-1.1A2.75 2.75 0 0 1 6 3.3c.25-.13.57-.21 1.11-.26C7.66 3 8.36 3 9.35 3H10v2.35c0 .4 0 .76.02 1.05.03.3.09.61.24.9.21.4.54.73.94.94.29.15.6.21.9.24.29.02.64.02 1.05.02h2.35v3.65ZM14.88 7 11.5 3.62v1.7c0 .45 0 .74.02.95.02.22.05.3.07.33a.75.75 0 0 0 .3.31c.05.02.12.05.33.07.22.02.51.02.96.02h1.7Z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            `);
        });
    }

    async function insertAudioList() {
        let audios = await dbGetAudios();

        if (audios.length > 0) {
            let elements, tooltips;
            elements = tooltips = "";

            audios.forEach((element) => {
                elements += formatAudio(element.id, element.audio, element.attachment);
                tooltips += formatTooltip(element.id, element.audio);
            });

            $(".voice-messages-list .items").append(elements);
            $(".voice-messages-list .tools .tooltips").append(tooltips);
        } else {
            $(".voice-messages-list .items").append(formatError("Вы ещё не сохраняли ГС"));
        }
    }

    function formatTooltip(record, title) {
        return `<div class="tooltip" data-record-id="${record}"><p>${title}</p></div>`;
    }

    function formatAudio(record, title, attachment) {
        return `
            <div class="item">
                <button data-record-id="${record}" class="delete"></button>
                <p> ${title}
                    <button data-audio-id="${attachment}" class="send">
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g id="send_24__Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="send_24__send_24">
                                    <path id="send_24__Rectangle-76" d="M0 0h24v24H0z"></path>
                                    <path d="M5.74 15.75a39.14 39.14 0 0 0-1.3 3.91c-.55 2.37-.95 2.9 1.11 1.78 2.07-1.13 12.05-6.69 14.28-7.92 2.9-1.61 2.94-1.49-.16-3.2C17.31 9.02 7.44 3.6 5.55 2.54c-1.89-1.07-1.66-.6-1.1 1.77.17.76.61 2.08 1.3 3.94a4 4 0 0 0 3 2.54l5.76 1.11a.1.1 0 0 1 0 .2L8.73 13.2a4 4 0 0 0-3 2.54Z" id="send_24__Mask" fill="currentColor"></path>
                                </g>
                            </g>
                        </svg>
                    </button>
                </p>
            </div>
        `;
    }

    function formatError(text) {
        return `
            <div class="error">
                <p>${text}</p>
            </div>
        `;
    }

    async function initDb() {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open("audios", 1);

            request.onerror = event => {
                console.error(event);
            }

            request.onupgradeneeded = event => {
                let db = event.target.result;
                let objectStore = db.createObjectStore("audios", { keyPath: "id", autoIncrement: true });
                objectStore.createIndex("audio", "audio", { unique: false });
            };

            request.onsuccess = event => {
                resolve(event.target.result);
            };
        });
    }

    async function dbGetAudios() {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction(["audios"], "readonly");

            transaction.onerror = event => {
                reject(event);
            };

            let store = transaction.objectStore("audios");

            store.getAll().onsuccess = event => {
                resolve(event.target.result);
            };
        });
    }

    async function dbAddAudio(audio) {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction(["audios"], "readwrite");

            transaction.onerror = event => {
                reject(event);
            };

            let store = transaction.objectStore("audios");

            store.put(audio).onsuccess = event => {
                resolve(event.target.result);
            };
        });
    }

    async function dbDelAudio(key) {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction(["audios"], "readwrite");

            transaction.oncomplete = event => {
                resolve();
            };

            transaction.onerror = event => {
                reject(event);
            };

            let store = transaction.objectStore("audios");
            store.delete(key);
        });
    }

    async function callApi(method, data) {
        return await vkApi.api(method, data);
    }

    async function getPeerId() {
        let link = $(".im-page--aside-photo ._im_header_link").attr("href");

        if (link.includes("sel=")) {
            return 2000000000 + parseInt(link.split("=c")[1]);
        } else {
            return (await callApi("users.get", {
                user_ids: link.slice(1)
            }))[0].id;
        }
    }

    async function sendAudio(object) {
        let data = {
            peer_id: (await getPeerId()),
            attachment: $(object).attr("data-audio-id"),
            random_id: 0
        }

        if (replyMessageId) {
            data.reply_to = replyMessageId;
        }

        await callApi("messages.send", data);
        $(".voice-messages-list").fadeToggle(150);

        if (replyMessageId) {
            $(".im-replied-container--remove").click();
        }

        replyMessageId = null;
    }

    async function saveAudio(peerId, messageId, audioIndex) {
        let attachment, message;

        let data = await callApi("messages.getByConversationMessageId", {
            peer_id: peerId,
            conversation_message_ids: messageId
        });

        if (data.items[0].fwd_messages.length > 0) {
            message = data.items[0].fwd_messages[audioIndex].attachments[0].audio_message;
        } else {
            message = data.items[0].attachments[audioIndex].audio_message;
        }

        if (message.owner_id === myId) {
            attachment = `doc${message.owner_id}_${message.id}`;
        } else {
            let formData = new FormData();

            let data = await fetch(message.link_mp3, {
                method: "GET"
            });

            let blob = await data.blob();
            formData.append("file", blob);

            attachment = await uploadAudio(formData);
        }

        return attachment;
    }

    async function uploadAudio(formData) {
        let url = (await callApi("docs.getUploadServer", {
            type: "audio_message"
        })).upload_url;

        let file = await fetch(url, {
            method: "POST",
            body: formData
        });

        file = JSON.parse(await file.text()).file;

        let result = (await callApi("docs.save", {
            file: file
        })).audio_message;

        return `doc${result.owner_id}_${result.id}`;
    }

    async function addAudioFromSave(object) {
        let audio = $(object).parent().find("input").val();
        let peerId = $(object).attr("data-message-peer");
        let messageId = $(object).attr("data-message-id");
        let audioIndex = $(object).attr("data-message-index");

        let attachment = await saveAudio(peerId, messageId, audioIndex);

        let record = await dbAddAudio({
            audio: audio,
            attachment: attachment
        });

        $(".voice-messages-list .items").append(formatAudio(record, audio, attachment));
        $(".voice-messages-list .tools .tooltips").append(formatTooltip(record, audio));
        $(".voice-messages-list .items .error").remove();
    }

    async function addAudioFromUpload() {
        try {
            let formData = new FormData();

            $(".voice-popup .single-upload .save").prop("disabled", true);
            $(".voice-popup .single-upload .save").html("Загрузка...");
            formData.append("file", document.getElementById("stealer-audio").files[0]);

            let audio = $(".voice-popup .single-upload .name").val();
            let attachment = await uploadAudio(formData);

            let record = await dbAddAudio({
                audio: audio,
                attachment: attachment
            });

            $(".voice-messages-list .items").append(formatAudio(record, audio, attachment));
            $(".voice-messages-list .tools .tooltips").append(formatTooltip(record, audio));
            $(".voice-messages-list .items .error").remove();
        } catch(error) {
            console.error(error.message);
        } finally {
            $(".voice-popup .single-upload .save").prop("disabled", false);
            $(".voice-popup .single-upload .save").html("Добавить");
        }
    }

    async function addAudioFromMultiUpload() {
        try {
            let audios = [];

            $(".voice-popup .multi-upload .save").prop("disabled", true);
            $(".voice-popup .multi-upload .save").html("Загрузка...");

            Array.from(document.getElementById("stealer-audios").files).forEach(function(file) {
                let formData = new FormData();
                formData.append("file", file);
                audios.push(promiseUpload(formData));
            });

            let results = await Promise.allSettled(audios);
        } catch(error) {
            console.error(error.message);
        } finally {
            $(".voice-popup .multi-upload .save").prop("disabled", false);
            $(".voice-popup .multi-upload .save").html("Добавить все");
        }
    }

    function promiseUpload(formData) {
        return new Promise(async (resolve, reject) => {
            try {
                let attachment = await uploadAudio(formData);
                let name = formData.get("file").name;
                let audio = name.slice(0, -4);

                let record = await dbAddAudio({
                    audio: audio,
                    attachment: attachment
                });

                $(".voice-messages-list .items").append(formatAudio(record, audio, attachment));
                $(".voice-messages-list .tools .tooltips").append(formatTooltip(record, audio));
                $(".voice-messages-list .items .error").remove();

                resolve(200);
            } catch(error) {
                reject(500);
            }
        })
    }

    async function deleteAudio(object) {
        let record = $(object).parent().find("button.delete").attr("data-record-id");

        await dbDelAudio(parseInt(record));

        $(object).parent().remove();
        $(`.voice-messages-list .tooltips .tooltip`).remove(`[data-record-id="${record}"]`);

        if ($(".voice-messages-list .items .item").length <= 0) {
            $(".voice-messages-list .items").append(formatError("Нет сохраенённых ГС"));
        }
    }

    async function showAudio(object) {
        $(".voice-messages-list .tooltips .tooltip").hide();

        if ($(object).val() === "") {
            $(".voice-messages-list .items .item").removeClass("searched");
            $(`.voice-messages-list .tooltips`).fadeOut(150);
        } else {
            let elements = $(`.voice-messages-list .tooltips .tooltip p:contains("${$(object).val()}")`);

            if (elements.length <= 0) {
                $(`.voice-messages-list .tooltips`).fadeOut(150);
                return;
            }
            elements.parent().show();

            $(`.voice-messages-list .tooltips`).fadeIn(150);
        }
    }

    async function searchAudio(object) {
        let selectorList = ".voice-messages-list .items";
        let selectorItem = $(`.voice-messages-list .items .item`).removeClass("searched").find(`[data-record-id="${$(object).attr("data-record-id")}"]`);

        if (selectorItem.length <= 0) {
            return;
        }

        $(selectorList).stop().animate( {
            scrollTop: selectorItem[0].offsetTop - $(selectorList)[0].offsetTop - 10
        }, 150);

        selectorItem.parent().addClass("searched");
    }

    async function getMyId() {
        return (await callApi("users.get", {}))[0].id;
    }

    async function replyMessage(message) {
        replyMessageId = $(message).closest(".im-mess").attr("data-msgid");
    }

    function observeSendButton() {
        $(".im_chat-input--buttons .voice-stealer").unbind("click").on("click", function() {
            $(".voice-messages-list").fadeToggle(150);
        });
    }

    function observeSaveButton() {
        $(".im-page--chat-body").unbind("click", ".im_msg_audiomsg .voice-stealer-save-audio").on("click", ".im_msg_audiomsg .voice-stealer-save-audio", function() {
            event.preventDefault();
            event.stopPropagation();

            let index = $(this).closest(".im-mess-stack_fwd").index();
            index = (index === -1) ? 0 : index;

            $(".voice-messages-save button.save")
                .attr("data-message-id", $(this).closest(".im-mess:not(.im-mess_fwd)").attr("data-cmid"))
                .attr("data-message-peer", $(this).closest(".im-mess:not(.im-mess_fwd)").attr("data-peer"))
                .attr("data-message-index", index);
            $(".voice-messages-save input").val("");
            $(".voice-messages-save").fadeToggle(150);
            $(".voice-messages-save input").focus();
        });
    }

    function observeCloseButton() {
        $(".voice-popup .close").unbind("click").on("click", function() {
            $(this).parent().parent().fadeToggle(150);
        });
    }

    function observeAudioSend() {
        $(".voice-messages-list .items").unbind("click", ".item button.send").on("click", ".item button.send", function() {
            sendAudio(this);
        });
    }

    function observeAudioSave() {
        $(".voice-messages-save button.save").unbind("click").on("click", function() {
            addAudioFromSave(this);
            $(".voice-messages-save").fadeToggle(150);
        });
    }

    function observeAudioDelete() {
        $(".voice-messages-list .items").unbind("click", ".item button.delete").on("click", ".item button.delete", function() {
            deleteAudio(this);
        });
    }

    function observeAudioTooltips() {
        $(".voice-messages-list .search input").unbind("input").on("input", function() {
            showAudio(this);
        });
    }

    function observeAudioSearch() {
        $(".voice-messages-list .search").unbind("click", ".tooltip").on("click", ".tooltip", function() {
            searchAudio(this);
        });
    }

    function observeAudioUpload() {
        $(".voice-popup .single-upload .save").unbind("click").on("click", function() {
            addAudioFromUpload();
        });
    }

    function observeAudioMultiUpload() {
        $(".voice-popup .multi-upload .save").unbind("click").on("click", function() {
            addAudioFromMultiUpload();
        });
    }

    function observeMessageReply() {
        $(".im-page--chat-body").unbind("click", ".im-mess--reply").on("click", ".im-mess--reply", function() {
            replyMessage(this);
        });
    }

    async function run() {
        insertElements();
        await insertAudioList();
        insertSaveButtonOnLoad();
        insertSaveButtonOnUpdate();
        observeSendButton();
        observeSaveButton();
        observeCloseButton();
        observeAudioSend();
        observeAudioSave();
        observeAudioDelete();
        observeAudioTooltips();
        observeAudioSearch();
        observeAudioUpload();
        observeAudioMultiUpload();
        observeMessageReply();
    }

    run();
})();

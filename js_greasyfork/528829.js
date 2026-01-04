// ==UserScript==
// @name         Smart Search
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Определяет, какие изображения и видео вставил автор темы, а какие другие пользователи
// @match        https://lolz.live/search/*
// @grant        GM.xmlHttpRequest
// @connect      lolz.live
// @downloadURL https://update.greasyfork.org/scripts/528829/Smart%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/528829/Smart%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imageCache = {};

    // Проверка, является ли ссылка SoundCloud
    function isSoundCloud(url) {
        return url.includes("soundcloud.com");
    }

    // Проверка, является ли ссылка YouTube
    function isYouTube(url) {
        return url.includes("youtube.com/embed/");
    }

    async function loadMedia(postLink) {
        if (imageCache[postLink]) return imageCache[postLink];

        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: postLink,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

                    const media = [];
                    const messages = doc.querySelectorAll(".message");

                    messages.forEach(msg => {
                        // Получаем имя пользователя из data-author
                        const username = msg.getAttribute('data-author') || msg.querySelector(".username")?.textContent.trim();

                        if (!username) {
                            console.error("Не удалось найти имя пользователя в сообщении", msg);
                        }

                        // Получаем картинки
                        const imgs = msg.querySelectorAll(".messageContent img.bbCodeImage");
                        imgs.forEach(img => {
                            media.push({
                                type: 'image',
                                src: img.src,
                                username: username || "Неизвестный",
                                avatar: msg.querySelector(".avatarHolder img")?.src || "default-avatar-url"
                            });
                        });

                        // Получаем видео
                        const videos = msg.querySelectorAll(".messageContent iframe, .messageContent video");
                        videos.forEach(video => {
                            const videoSrc = video.src || video.querySelector("source")?.src;
                            if (videoSrc && isSoundCloud(videoSrc)) {
                                // Обрабатываем ссылку SoundCloud
                                media.push({
                                    type: 'iframe',
                                    src: videoSrc,
                                    username: username || "Неизвестный",
                                    avatar: msg.querySelector(".avatarHolder img")?.src || "default-avatar-url"
                                });
                            } else if (videoSrc && isYouTube(videoSrc)) {
                                // Обрабатываем ссылку YouTube
                                media.push({
                                    type: 'iframe',
                                    src: videoSrc,
                                    username: username || "Неизвестный",
                                    avatar: msg.querySelector(".avatarHolder img")?.src || "default-avatar-url"
                                });
                            } else {
                                // Обычное видео
                                media.push({
                                    type: 'video',
                                    src: videoSrc,
                                    username: username || "Неизвестный",
                                    avatar: msg.querySelector(".avatarHolder img")?.src || "default-avatar-url"
                                });
                            }
                        });
                    });

                    resolve(media);
                },
                onerror: function() {
                    reject("Ошибка загрузки");
                }
            });
        });
    }

    async function replaceMediaTags() {
        const posts = document.querySelectorAll(".searchResult.post, .searchResult.thread.primaryContent");

        for (let post of posts) {
            const snippet = post.querySelector("blockquote.snippet a");

            if (snippet && (snippet.textContent.includes("[IMG]") || snippet.textContent.includes("[MEDIA]"))) {
                const postLink = snippet.href;
                const textBeforeMedia = snippet.innerText.replace("[IMG]", "").replace("[MEDIA]", "").trim(); // Сохраняем текст перед картинкой/видео

                try {
                    const mediaItems = await loadMedia(postLink);
                    const container = document.createElement("div");

                    // Добавляем текст перед медиа
                    if (textBeforeMedia) {
                        const textElement = document.createElement("p");
                        textElement.textContent = textBeforeMedia;
                        container.appendChild(textElement);
                    }

                    mediaItems.forEach(item => {
                        // Создаем общий контейнер для медиа и информации об авторе
                        const mediaContainer = document.createElement("div");
                        mediaContainer.style.display = "flex";
                        mediaContainer.style.flexDirection = "column"; // Ставим все элементы в столбик
                        mediaContainer.style.marginTop = "10px"; // Добавляем отступ сверху
                        mediaContainer.style.marginBottom = "10px"; // Добавляем отступ снизу

                        // Добавляем информацию об авторе (аватар и имя)
                        const userInfoDiv = document.createElement("div");
                        userInfoDiv.style.display = "flex";
                        userInfoDiv.style.alignItems = "center";
                        userInfoDiv.style.marginBottom = "10px"; // Отступ между аватаром и контентом

                        const avatar = document.createElement("img");
                        avatar.src = item.avatar;
                        avatar.alt = item.username;
                        avatar.style.width = "30px";
                        avatar.style.height = "30px";
                        avatar.style.borderRadius = "50%";
                        avatar.style.marginRight = "10px";

                        const username = document.createElement("span");
                        username.textContent = item.username;
                        username.style.fontWeight = "bold";
                        username.style.color = "#ccc";

                        userInfoDiv.appendChild(avatar);
                        userInfoDiv.appendChild(username);

                        mediaContainer.appendChild(userInfoDiv);

                        // Обработка изображения
                        if (item.type === 'image') {
                            const newImg = document.createElement("img");
                            newImg.src = item.src;
                            newImg.style.maxWidth = "500px";
                            newImg.style.maxHeight = "500px";
                            newImg.style.height = "auto";
                            newImg.style.width = "auto";
                            newImg.style.borderRadius = "5px";
                            newImg.style.marginTop = "10px";  // Отступ между картинками
                            newImg.style.display = "block";
                            mediaContainer.appendChild(newImg);
                        }

                        // Обработка видео
                        if (item.type === 'video') {
                            const newVideo = document.createElement("video");
                            newVideo.src = item.src;
                            newVideo.controls = true;
                            newVideo.style.maxWidth = "500px";
                            newVideo.style.maxHeight = "500px";
                            newVideo.style.borderRadius = "5px";
                            newVideo.style.marginTop = "10px";
                            mediaContainer.appendChild(newVideo);
                        }

                        // Обработка SoundCloud
                        if (item.type === 'iframe') {
                            const newIframe = document.createElement("iframe");
                            newIframe.src = item.src;
                            newIframe.style.maxWidth = "500px";
                            newIframe.style.maxHeight = "500px";
                            newIframe.style.borderRadius = "5px";
                            newIframe.style.marginTop = "10px";
                            newIframe.frameborder = "0";
                            newIframe.allow = "autoplay";
                            mediaContainer.appendChild(newIframe);
                        }

                        // Вставляем все вместе в контейнер
                        container.appendChild(mediaContainer);
                    });

                    snippet.replaceWith(container);
                } catch (error) {
                    console.error("Ошибка загрузки медиа:", error);
                }
            }
        }
    }

    // Слушаем события загрузки страницы
    window.addEventListener("load", replaceMediaTags);
})();

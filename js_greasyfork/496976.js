// ==UserScript==
// @name         LOLZ DISLIKES
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  adding dislikes to lolzteam!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// @author       You
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @connect      dislike.guru
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/496976/LOLZ%20DISLIKES.user.js
// @updateURL https://update.greasyfork.org/scripts/496976/LOLZ%20DISLIKES.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //GM_deleteValue('LZTDISLIKES_LZTApiKey');
    //GM_deleteValue('LZTDISLIKES_authToken');
    const showApiKeyWindowContent = `
    <div class="p2p-alertNotice-mainGroup">
        <span class="p2p-alertText-prefix">Как сгенерировать API Ключ?</span>
        <div class="p2p-alertNotice-ulListGroup"><div class="p2p-alertNotice-NumberListGroup">1</div>Заходим сюда <a href="https://${window.location.host}/account/api" target="_blank">https://${window.location.host}/account/api</a></div>
        <div class="p2p-alertNotice-ulListGroup"><div class="p2p-alertNotice-NumberListGroup">2</div>Нажимаем "Создать приложение"</div>
        <div class="p2p-alertNotice-ulListGroup"><div class="p2p-alertNotice-NumberListGroup">3</div>Вводим любое название и описание.</div>
        <div class="p2p-alertNotice-ulListGroup"><div class="p2p-alertNotice-NumberListGroup">4</div>Нажимаем "Сохранить".</div>
        <div class="p2p-alertNotice-ulListGroup"><div class="p2p-alertNotice-NumberListGroup">5</div>Нажимаем "Получить токен".</div>
        <div class="p2p-alertNotice-ulListGroup"><div class="p2p-alertNotice-NumberListGroup">6</div>В запрашиваемых правах оставляем ТОЛЬКО минимальные права.</div>
        <div class="p2p-alertNotice-ulListGroup"><div class="p2p-alertNotice-NumberListGroup">7</div>Нажимаем "Разрешить доступ".</div>
        <div class="p2p-alertNotice-ulListGroup"><div class="p2p-alertNotice-NumberListGroup">8</div>Копируем API ключ и вставляем ниже.</div>
    </div>
    <div style="text-align: center">
        <span style="color: rgb(9, 158, 66);">Ваш API ключ будет сохранён локально.</span>
        <span style="color: rgb(171, 92, 7);">API ключ будет передаваться на сторонний сервер только лишь в целях подтверждения личности.</span>
    </div>
    <input id="APIKeyInput" class="textCtrl" style="width: 100%" placeholder="Введите API ключ сюда." type="text"></input>
    <br>
    <button id="LZTDISLIKES_SaveAPIKey" class="button primary" type="button">Сохранить</button>
    `;
    const serverUrl = "https://dislike.guru";
    const dislikeIcons = {
        active: 'data:image/svg+xml,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" transform="matrix(-1,1.2246467991473532e-16,-1.2246467991473532e-16,-1,0,0)"><path d="M3 9C2.4 9 2 9.40336 2 10.0084V19.9916C2 20.5966 2.4 21 3 21C3.6 21 4 20.5966 4 19.9916V10.0084C4 9.40336 3.6 9 3 9Z" fill="%23884444"></path><path d="M19.7013 8.86869H13.4583L14.6666 5.23232C15.1701 3.71717 13.9618 2 12.25 2C11.5451 2 10.8403 2.30303 10.4375 2.80808L6.00694 7.85859C5.40278 8.56566 5 9.47475 5 10.3838V19.6768C5 20.9899 6.00694 22 7.31596 22H16.6805C17.9895 22 19.1979 21.0909 19.6006 19.7778L21.9166 11.899C22.3194 10.3838 21.2117 8.86869 19.7013 8.86869Z" fill="%23884444"></path></svg>',
        inactive: 'data:image/svg+xml,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" transform="matrix(-1,1.2246467991473532e-16,-1.2246467991473532e-16,-1,0,0)"><path d="M3 21C2.4 21 2 20.6 2 20V11C2 10.4 2.4 10 3 10C3.6 10 4 10.4 4 11V20C4 20.6 3.6 21 3 21Z" fill="%238C8C8C"></path><path d="M16.2759 22H8.0396C6.37272 22 5 20.6 5 18.9V10.5C5 9.4 5.39221 8.4 6.07857 7.5L10.0006 3C10.5889 2.4 11.4714 2 12.4519 2C13.5305 2 14.4129 2.5 15.0013 3.3C15.5896 4.2 15.7857 5.2 15.4915 6.2L14.9032 8.1H19.0214C20.0019 8.1 20.8843 8.5 21.3746 9.3C21.9629 10.1 22.159 11.1 21.8649 12L19.8058 19.1C19.3155 20.9 17.9428 22 16.2759 22ZM7.64739 8.9C7.25518 9.4 7.05908 9.9 7.05908 10.5V18.9C7.05908 19.5 7.54934 20 8.13765 20H16.374C17.1584 20 17.8447 19.5 18.0408 18.7L20.0019 11.6C20.0999 11.3 20.0019 10.9 19.8058 10.6C19.6097 10.3 19.3155 10.2 19.0214 10.2H13.5305C13.2363 10.2 12.9422 10 12.7461 9.8C12.55 9.6 12.55 9.2 12.648 8.9L13.7266 5.6C13.8246 5.2 13.8246 4.8 13.5305 4.5C13.1383 3.9 12.1578 3.8 11.6675 4.4L7.64739 8.9Z" fill="%238C8C8C"></path></svg>'
    };

    const myUsername = document.getElementById('NavigationAccountUsername').children[0].innerText;

    function showAlert(content, title, showDuration) {
        XenForo.alert(content, title, showDuration);
    }

    function getUserId() {
        return XenForo.visitor.user_id;
    }

    function sendRequest(url, method, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                method: method,
                data: JSON.stringify(data),
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${GM_getValue('LZTDISLIKES_authToken')}`},
                onload: response => resolve(JSON.parse(response.responseText)),
                onerror: error => reject(error)
            });
        });
    }

//    function saveApiKey() {
//        const apiKey = document.getElementById("APIKeyInput").value;
//        GM_setValue("LZTDISLIKES_LZTApiKey", apiKey);
//        getAuthToken();
//    }

    function showApiKeyWindow() {
        showAlert(showApiKeyWindowContent, 'Чтобы получить возможность ставить дизлайки, введите ваш API ключ.');
        document.getElementById("LZTDISLIKES_SaveAPIKey").onclick = () => {
            const apiKey = document.getElementById("APIKeyInput").value;
            GM_setValue("LZTDISLIKES_LZTApiKey", apiKey);
            getAuthToken();
        };
    }

    async function getAuthToken() {
        const apiKey = GM_getValue('LZTDISLIKES_LZTApiKey');
        if (!apiKey) return showApiKeyWindow();

        const response = await sendRequest(`${serverUrl}/get_auth_token`, "POST", {
            user_id: getUserId(),
            lzt_api_key: apiKey
        });

        if (response.detail) {
            if (response.detail === "Невалидный API-ключ") {
                GM_deleteValue('LZTDISLIKES_LZTApiKey');
                showApiKeyWindow();
            }
            return showAlert(response.detail, null, 5000);
        }

        showAlert("Авторизационный токен обновлён, теперь вы можете ставить дизлайки.", null, 5000);
        //TODO: auto-close window
        GM_setValue('LZTDISLIKES_authToken', response.auth_token);
    }

    async function handleDislikeClick(event) {
        //const authToken = GM_getValue('LZTDISLIKES_authToken');
        //if (!authToken) return getAuthToken();

        const dislikeButton = event.target.closest('.dislike');
        const response = await sendRequest(`${serverUrl}/${dislikeButton.getAttribute('post_path')}/dislike`, "POST");

        if (response.detail) {
            if (response.detail === "Невалидный авторизационный токен") return getAuthToken();
            return showAlert(response.detail, null, 5000);
        }
        //console.log(response);
        updateDislikeButton(dislikeButton, response.count, response.is_pressed);
    }

    function updateDislikeButton(button, count, isPressed) {
        button.querySelector('.icon').style.backgroundImage = `url('${isPressed ? dislikeIcons.active : dislikeIcons.inactive}')`;
        button.querySelector('.DislikeLabel').textContent = count > 0 ? count : '';
    }

    async function getDislikes(postPath) {
        const response = await sendRequest(`${serverUrl}/${postPath}`, "GET");
        //console.log(response);
        return [response.count, response.is_pressed];
    }

    async function appendDislikeButton(postElement) {
        if (postElement.querySelector('.dislike')) {
            return;
        }
        if (!postElement.id.startsWith('profile-post-') && !postElement.id.startsWith('post-')) {
            console.log('Unknown post type:', postElement)
            return;
        }

        const isProfile = postElement.id.startsWith('profile-post-');
        const isComment = postElement.id.includes('-comment-');
        const usernameElement = postElement.querySelector('a.username > span');
        const isOwnPost = (usernameElement.innerText === myUsername);
        const postId = parseInt(postElement.id.split('-').pop());

        const postPath = `${isProfile ? "profile-" : ""}posts${isComment ? "/comments" : ""}/${postId}`;
        const [count, isPressed] = await getDislikes(postPath);

        const dislikeButton = document.createElement('a');
        dislikeButton.className = `Tooltip PopupTooltip LikeLink item control dislike ${(isOwnPost && count === 0) ? "hidden" : ""}`;
        dislikeButton.setAttribute('post_path', postPath);

        const dislikeIcon = document.createElement('span');
        dislikeIcon.className = 'icon';

        const dislikeCount = document.createElement('span');
        dislikeCount.className = 'DislikeLabel';
        dislikeCount.style.cssText = 'margin: 0 0 0 7px; font-weight: 600; display: inline-block; font-size: 14px; color: rgb(214, 214, 214);';

        dislikeButton.append(dislikeIcon, dislikeCount);
        updateDislikeButton(dislikeButton, count, isPressed);

        if (!isOwnPost) {
            dislikeButton.onclick = handleDislikeClick;
        }

        const likeElement = postElement.querySelector('.LikeLink');
        if (likeElement) {
            likeElement.insertAdjacentElement('afterend', dislikeButton);
        }
        // else {
        //     postElement.querySelector('div.publicControls').append(dislikeButton);
        // }
    }

    function searchPosts(node) {
        //const path = window.location.pathname;
        //const isThreads = path.startsWith('/threads');
        //const postSelector = isThreads ? 'ol#messageList > li[id]' : 'ol#ProfilePostList > li[id]';
        //const commentSelector = isThreads ? 'ol.CommentPostList > li[id]' : 'ol.messageResponse > li[id]';
        const postSelector = 'li[id][class^="message"]';
        const commentSelector = 'li[id].comment';

        if (node.matches(commentSelector)) {
            return appendDislikeButton(node);
        }

        const posts = node.matches(postSelector) ? [node] : node.querySelectorAll(postSelector);
        for (const post of posts) {
            appendDislikeButton(post);
            post.querySelectorAll(commentSelector).forEach(appendDislikeButton);
        }
    }

    function observeNewContent(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        searchPosts(node);
                    }
                });
            }
        }
    }

    searchPosts(document.body);

    const observer = new MutationObserver(observeNewContent);
    observer.observe(document.body, { childList: true, subtree: true });
})();
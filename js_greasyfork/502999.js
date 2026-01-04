// ==UserScript==
// @name         fast report button main page 2024 v2.0 rtx ti pro max limited edition
// @namespace    22222
// @version      0.3
// @description  Крутое расширение
// @author       llimonix x Jack
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.guru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502999/fast%20report%20button%20main%20page%202024%20v20%20rtx%20ti%20pro%20max%20limited%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/502999/fast%20report%20button%20main%20page%202024%20v20%20rtx%20ti%20pro%20max%20limited%20edition.meta.js
// ==/UserScript==

(function() {
    const buttons = {
        "Флуд / Оффтоп / Спам / Бесполезная тема": { name: '1.1' },
        "Создание темы не в соответствующем разделе": { name: '2.12' },
        "Неправильное оформление темы": { name: '3.2' },
    };
    const _xfToken = XenForo._csrfToken;

    async function postData(url = '', formData) {
        return await fetch(
            url, { method: 'POST', body: formData }
        ).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return { "error": "[CRITICAL] Не удалось отправить запрос!" };
            }
        }).catch(error => {
            return { "error": "[CRITICAL] Ошибка соединения!" };
        });
    }

    XenForo.addButtonToThreadCounters = function(thread) {
        if (!$('.discussionListMainPage').length) return;

        let threadCounters = (thread[0] || thread)?.querySelector('.threadCounters') || thread.querySelector('.threadCounters');

        if (threadCounters.querySelector(".custom-button")) return;

        for (let key in buttons) {
            let name = buttons[key].name;
            let span = document.createElement('a');
            span.innerText = name;
            span.className = "custom-button counter";
            span.setAttribute('style', `
                font-weight: bold;
                padding: 3px 15px;
                background: #218e5d;
                border-radius: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: background 0.3s ease; /* Анимация перехода цвета */
            `);

            span.onmouseover = function() {
                span.style.background = '#1a724b';
            };

            span.onmouseout = function() {
                span.style.background = '#218e5d';
            };

            span.onclick = async function() {
                let likeLink = threadCounters.querySelector('.LikeLink');
                let commentLink = threadCounters.querySelector('.MainPageReply');
                let postId = likeLink ? likeLink.href.match(/posts\/(\d+)/)[1] : null;
                let threadId = commentLink ? commentLink.href.match(/threads\/(\d+)/)[1] : null;

                if (postId) {
                    let formData = new FormData();
                    formData.append("message", key);
                    formData.append("is_common_reason", 1);
                    formData.append("_xfToken", _xfToken);
                    formData.append("_xfNoRedirect", 1);
                    formData.append("_xfNoRedirect", 1);
                    formData.append("_xfResponseType", "json");
                    formData.append("_xfRequestUri", `/threads/${threadId}/`);
                    const response = await postData('posts/' + postId + '/report', formData);

                    if (response.error) {
                        const errorMessage = Array.isArray(response.error) ? response.error[0] : response.error;
                        XenForo.alert(errorMessage, '', 5000);
                    } else {
                        XenForo.alert('Жалоба отправлена', '', 5000);
                    }
                }
            };

            threadCounters.appendChild(span);
        }
    }

    XenForo.register('.discussionListItem--Wrapper', 'XenForo.addButtonToThreadCounters');

    $('.discussionListMainPage .discussionListItem').each(function() {
        XenForo.addButtonToThreadCounters(this);
    });
})();
// ==UserScript==
// @name         Скрыть вложения CEPUC'а
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Скрывает пересланные новости и клипы от определенного человека в чате на VK
// @author       Kundik
// @match        https://vk.com/im*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494678/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B2%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20CEPUC%27%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/494678/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B2%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20CEPUC%27%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const personToHide = 'Сергей Благодарный';
    const replacementText = 'Здесь была новость от CEPUC...';
    const replacementVideoText = 'Здесь был VK клип от CEPUC...';

    let messagesCache = [];

    function isForwardedNews(message) {
        return message.querySelector('.im-mess--text, .im_post_top_info_caption').textContent.includes('Запись сообщества');
    }

    function isForwardedVideo(message) {
        return message.querySelector('.page_post_thumb_short_video_cover') || message.querySelector('.inline_video_wrap');
    }

    function hideForwardedContent() {
        const messages = document.getElementsByClassName('im-mess-stack');

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const senderName = message.querySelector('.im-mess-stack--pname a').textContent.trim();

            if (senderName === personToHide) {
                if (isForwardedNews(message)) {
                    const replacementElement = createReplacementElement(replacementText);
                    message.parentNode.replaceChild(replacementElement, message);
                } else if (isForwardedVideo(message)) {
                    const replacementElement = createReplacementElement(replacementVideoText);
                    message.parentNode.replaceChild(replacementElement, message);
                }
            }
        }
    }

    function createReplacementElement(text) {
        const replacementElement = document.createElement('div');
        replacementElement.classList.add('im-mess-stack', '_im_mess_stack');
        replacementElement.dataset.peer = '2000000111';
        replacementElement.dataset.admin = '';
        replacementElement.style.textAlign = 'center';
        replacementElement.style.marginTop = '10px';
        replacementElement.style.marginBottom = '10px';

        const contentElement = document.createElement('div');
        contentElement.classList.add('im-mess-stack--content');

        const textElement = document.createElement('div');
        textElement.classList.add('im-mess--text', 'wall_module', '_im_log_body');
        textElement.textContent = text;

        contentElement.appendChild(textElement);
        replacementElement.appendChild(contentElement);

        return replacementElement;
    }

    setInterval(hideForwardedContent, 1000);
})();
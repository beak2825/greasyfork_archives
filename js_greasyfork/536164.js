// ==UserScript==
// @name         MentionsLolzNews
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрипт, который показывает количество упоминаний пользователя в новостном канале LOLZ NEWS
// @author       llimonix
// @match        https://lolz.live/*
// @icon         https://nztcdn.com/files/c4cf9b1c-5346-4b51-8722-3c69e495a9d1.webp
// @grant        GM_xmlhttpRequest
// @connect      t.me
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536164/MentionsLolzNews.user.js
// @updateURL https://update.greasyfork.org/scripts/536164/MentionsLolzNews.meta.js
// ==/UserScript==

(function() {
    // Removed the mention_count limit since we want to show all mentions
    const lolz_news_url = 'lolz_news'
    const pageCounter = $('.page_counter');

    if (pageCounter.length > 0) {
        let username = '';

        try {
            username = document.querySelector('#page_info_wrap h1.username span').textContent.trim();
        } catch (e) {
            console.error('Could not find username:', e);
            return;
        }

        if (!username) {
            console.error('Username not found');
            return;
        }

        const darkBackground = document.querySelector('.darkBackground');
        const darkBackground_style = getComputedStyle(darkBackground);
        const backgroundColor = darkBackground_style.backgroundColor;

        const mentionsContainer = document.createElement('div');
        mentionsContainer.className = 'mentionsCounter';
        mentionsContainer.style = `padding: 16px; background: ${backgroundColor}; border-radius: 10px; margin-top: 10px; display: flex; flex-direction: column; gap: 16px;`

        const headerDiv = document.createElement('div');
        headerDiv.className = 'profile_threads_header_mln';
        headerDiv.innerHTML = '<h3 class="profile_threads_header_title_mln">Упоминания в LOLZ NEWS</h3>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'profile_threads_list mentions_content';
        contentDiv.innerHTML = '<div class="loading">Проверка упоминаний...</div>';

        const style = document.createElement('style');
        style.textContent = `
            .profile_threads_header_title_mln {
                font-size: 15px;
                font-weight: 600;
            }
            .mentions_content .loading {
                text-align: center;
                padding: 10px;
                color: #777;
            }
            .mentions_content {
                max-height: 300px; /* Height for approximately 3 mentions */
                overflow-y: auto;
                scrollbar-width: thin;
                display: flex;
                flex-direction: column;
                gap: 10px; /* Add spacing between items */

                scrollbar-width: thin;
                scrollbar-color: rgba(160, 160, 160, 0.4) transparent;
            }
            .mentions_content::-webkit-scrollbar {
                width: 6px;
            }
            .mentions_content::-webkit-scrollbar-thumb {
                background-color: rgba(144, 144, 144, 0.5);
                border-radius: 3px;
            }
            .mention_item {
                display: flex;
                flex-direction: column;
                padding: 10px;
                transition: background-color .2s;
                background-color: #3232329e;
                border-radius: 10px;
                margin-bottom: 0; /* Remove bottom margin since we use gap */
            }
            .mention_item:hover {
                background-color: #323232;
            }
            .mention_item a {
                text-decoration: none;
                flex: 1;
            }
            .mention_item .mention_title {
                font-weight: 600;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .mention_item .mention_text {
                font-size: 13px;
                color: #777;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 10px;
            }
            .mention_footer {
                display: flex;
                align-items: center;
                justify-content: left;
                margin-top: 5px;
                font-size: 13px;
                color: #999;
                gap: 8px;
            }
            .mention_views {
                display: flex;
                align-items: center;
                gap: 5px;
            }
        `;

        mentionsContainer.appendChild(headerDiv);
        mentionsContainer.appendChild(contentDiv);
        document.head.appendChild(style);

        const profile_Info = $('.mainProfileColumn ul.member_tabs');
        profile_Info.before(mentionsContainer);

        const allMentionLinks = [];
        let totalMentionsCount = 0;

        let url_search = `https://t.me/s/${lolz_news_url}?q=${encodeURIComponent(username)}`;

        function removeEmojis(text) {
            const withoutEmojis = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

            return withoutEmojis
                .replace(/https?:\/\/[^\s]+/g, '')
                .replace(/\s+/g, ' ')
                .replace('️ ', '')
                .replace('️ ', '')
                .trim();
        }
        function htmlToTextWithSpaces(el) {
            const html = el.innerHTML;
            const withSpaces = html.replace(/<br\s*\/?>/gi, ' ');
            const temp = document.createElement('div');
            temp.innerHTML = withSpaces;
            const result = temp.textContent
            return result
        }
        function fetchMentions(beforeId = '') {
            let url_telegram = url_search
            if (beforeId) {
                url_telegram += `&before=${beforeId}`;
            }

            const headers = {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'ru,en;q=0.9',
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: url_telegram,
                headers: headers,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(response.responseText, 'text/html');

                        const noPostsFound = htmlDoc.querySelector('.tme_no_messages_found');
                        if (noPostsFound) {
                            updateResultsContainer();
                            return;
                        }

                        const messageContainers = htmlDoc.querySelectorAll('.tgme_widget_message_wrap .tgme_widget_message');
                        let oldestMessageId = null;

                        messageContainers.forEach(container => {
                            const messageText = container.querySelector('.tgme_widget_message_text');
                            const messageLink = container.getAttribute('data-post');
                            let viewCount = container.querySelector('.tgme_widget_message_views')

                            if (messageLink) {
                                const msgId = messageLink.split('/')[1];
                                const msgUrl = `https://t.me/${messageLink}`;

                                const msgElement = messageText ? htmlToTextWithSpaces(messageText) : null;
                                let msgText = '';

                                if (msgElement) {
                                    msgText = removeEmojis(msgElement)
                                }

                                if (!oldestMessageId || parseInt(msgId) < parseInt(oldestMessageId)) {
                                    oldestMessageId = msgId;
                                }

                                if (viewCount) {
                                    viewCount = viewCount.textContent
                                }

                                if (messageText) {
                                    totalMentionsCount++;

                                    allMentionLinks.push({
                                        url: msgUrl,
                                        id: msgId,
                                        date: container.querySelector('.tgme_widget_message_date time') ?
                                        container.querySelector('.tgme_widget_message_date time').getAttribute('datetime') : null,
                                        text: msgText,
                                        views: viewCount
                                    });
                                }
                            }
                        });

                        contentDiv.innerHTML = `<div class="loading">Найдено упоминаний: ${totalMentionsCount}... (поиск продолжается)</div>`;

                        if (oldestMessageId && messageContainers.length >= 20) {
                            setTimeout(() => {
                                fetchMentions(oldestMessageId);
                            }, 500);
                        } else {
                            updateResultsContainer();
                        }
                    } else {
                        contentDiv.innerHTML = '<div class="loading">Ошибка при проверке упоминаний</div>';
                        console.error('Failed to fetch mentions:', response.statusText);
                    }
                },
                onerror: function(error) {
                    contentDiv.innerHTML = '<div class="loading">Ошибка при проверке упоминаний</div>';
                    console.error('Request error:', error);
                }
            });
        }

        function updateResultsContainer() {
            allMentionLinks.sort((a, b) => {
                if (!a.date || !b.date) return 0;
                return new Date(b.date) - new Date(a.date);
            });

            if (totalMentionsCount > 0) {
                headerDiv.innerHTML = `<a class="profile_threads_header_title_mln" href="${url_search}" target="_blank">Упоминания в LOLZ NEWS (${totalMentionsCount})</a>`;

                let html = '';

                // Modified to show ALL mentions instead of just mention_count
                for (let i = 0; i < allMentionLinks.length; i++) {
                    const mention = allMentionLinks[i];
                    const date = mention.date ? new Date(mention.date) : null;

                    let dateStr = '';
                    if (date) {
                        const today = new Date();
                        const weekAgo = new Date();
                        weekAgo.setDate(today.getDate() - 7);

                        const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
                        const monthsShort = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

                        if (date >= weekAgo) {
                            const dayOfWeek = daysOfWeek[date.getDay()];
                            dateStr = `${dayOfWeek} в ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                        } else {
                            const day = date.getDate();
                            const month = monthsShort[date.getMonth()];
                            const year = date.getFullYear();
                            dateStr = `${day} ${month} ${year}`;
                        }
                    }

                    let title = '';
                    let text = '';

                    if (mention.text) {
                        const sentenceMatch = mention.text.match(/^(.*?[.!?]+)(?:\s|$)(.*)?$/);

                        if (sentenceMatch) {
                            title = sentenceMatch[1].trim();
                            text = sentenceMatch[2] ? sentenceMatch[2].trim() : '';
                        } else {
                            if (mention.text.length > 80) {
                                title = mention.text.substring(0, 80).trim() + '...';
                                text = mention.text.substring(80).trim();
                            } else {
                                title = mention.text;
                            }
                        }
                    } else {
                        title = 'Упоминание #' + mention.id;
                    }

                    html += `
                    <div class="mention_item">
                        <a href="${mention.url}" target="_blank">
                            <div class="mention_title">${title}</div>
                            ${text ? `<div class="mention_text">${text}</div>` : ''}
                            <div class="mention_footer">
                                <span class="mention_date">${dateStr}</span>
                                <span class="mention_views">
                                <i style="color: #545454" class="fas fa-eye"> </i>
                                    ${mention.views}
                                </span>
                            </div>
                        </a>
                    </div>`;
                }

                contentDiv.innerHTML = html;
            } else {
                contentDiv.innerHTML = '<div class="loading">Упоминаний в LOLZ NEWS не найдено</div>';
            }
        }

        fetchMentions();
    }
})();
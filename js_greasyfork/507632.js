// ==UserScript==
// @name         Shiki Comments Score
// @author       Librake
// @namespace    https://shikimori.one/Librake
// @version      1.1
// @description  Показывает оценку аниме каждого из комментаторов
// @match        *://shikimori.one/*
// @icon         https://goo.su/AlA5
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507632/Shiki%20Comments%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/507632/Shiki%20Comments%20Score.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Таблица для настройки отображаемых названий статусов и их цветов
    const statusDisplayMap = {
        planned: { textAnime: 'В планах', textManga: 'В планах', color: '#FFA500' },
        watching: { textAnime: 'Смотрю', textManga: 'Читаю', color: '#00BFFF' },
        completed: { textAnime: 'Просмотрено', textManga: 'Прочитано', color: '#32CD32' },
        rewatching: { textAnime: 'Пересматриваю', textManga: 'Перечитываю', color: '#32CD32' },
        dropped: { textAnime: 'Брошено', textManga: 'Брошено', color: '#FF4500' },
        on_hold: { textAnime: 'Отложено', textManga: 'Отложено', color: '#FF4500' },
        'N/A': { textAnime: '—', textManga: '—', color: '#888' }
    };

    const baseUrl = 'https://shikimori.one';

    const userMap = new Map();
    let titleId = null;
    let titleType = null;
    let entityType = null;

    function isOnNewsPage(url) {
        if (url.includes(`${baseUrl}/forum/news`)) return true;
        return false;
    }

    function getTitleLinkFromNewsPage() {
        const headers = document.querySelectorAll('header');
        for (const header of headers) {
            const titleLinkElement = header.querySelector('.about .b-link.bubbled-processed');
            if (titleLinkElement) {
                return titleLinkElement.getAttribute('href');
            }
        }
        return null;
    }

    function getTitleTypeFromUrl(url) {
        if (url.includes(`${baseUrl}/animes/`) || url.includes(`${baseUrl}/forum/animanga/anime`)) {
            return 'Anime';
        } 
        if (url.includes(`${baseUrl}/mangas/`) || url.includes(`${baseUrl}/forum/animanga/manga`)) {
            return 'Manga';
        } 
        if (url.includes(`${baseUrl}/ranobe/`) || url.includes(`${baseUrl}/forum/animanga/ranobe`)) {
            return 'Ranobe';
        }

        return null;
    }

    function getTitleIdFromUrl(titleType, url) {
    
        const segments = {
            'Anime': { type: 'animes', forum: 'anime' },
            'Manga': { type: 'mangas', forum: 'manga' },
            'Ranobe': { type: 'ranobe', forum: 'ranobe' }
        }[titleType];
    
        if (!segments) {
            return null;
        }
    
        const pageMatch = url.match(new RegExp(`${segments.type}/[a-zA-Z]*(\\d+)`));
        if (pageMatch) return pageMatch[1];
    
        const forumMatch = url.match(new RegExp(`${segments.forum}-[a-zA-Z]*(\\d+)`));
        return forumMatch ? forumMatch[1] : null;
    }
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function setCommentStats(commentId, userData) {
        const comment = document.querySelector(`.b-comment[id="${commentId}"]`);
        if (comment) {
            const statusInfo = statusDisplayMap[userData.status] || { textAnime: 'unknown', textManga: 'unknown', color: '#888' };
    
            const statusText = (entityType === 'Anime') 
                ? statusInfo.textAnime 
                : statusInfo.textManga;
    
            const scoreText = userData.score === 0 ? '' : `: ${userData.score}`;
            const displayText = `(${statusText}${scoreText})`;
    
            const scoreButton = comment.querySelector('.user-score-btn');
            if (scoreButton) {
                scoreButton.textContent = displayText;
                scoreButton.style.color = statusInfo.color;
                scoreButton.disabled = false;
            }
        }
    }

    async function getUserStats(userId) {
        const userData = userMap.get(userId);

        if (userData && userData.statsLoaded) {   
            return userData;
        }

        const url = `${baseUrl}/api/v2/user_rates?user_id=${userId}&target_id=${titleId}&target_type=${entityType}`;
        let attempt = 0;
        const maxAttempts = 5;

        while (attempt < maxAttempts) {
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    const entry = data[0];

                    if(entry) userData.status = entry.status;
                    if(entry) userData.score = entry.score;
                    userData.statsLoaded = true;
                    userMap.set(userId, userData);

                    return userData;
                } 
                else if (response.status === 429) {
                    attempt++;
                    await delay(1000 * attempt);
                } 
                else {
                    return userData;
                }
            } catch (error) {
                console.error(error);
            }
        }

        console.error(`Failed to fetch data for user ID ${userId} after multiple attempts.`);
        return userData;
    }

    async function updateAllUserComments(userId) {
        const userData = await getUserStats(userId);
        userData.showStats = true;
        userMap.set(userId, userData);
        userData.showStats = true;

        userData.comments.forEach(commentId => {
            setCommentStats(commentId, userData);
        });
    }

    function resetButton(commentId) {
        const comment = document.querySelector(`.b-comment[id="${commentId}"]`);
        if (comment) {
            const scoreButton = comment.querySelector('.user-score-btn');
            if (scoreButton) {
                scoreButton.textContent = '(+)';
                scoreButton.disabled = false;
                scoreButton.style.color = 'grey'
            }
        } 
    }

    function addButtonToComment(comment, userId) {
        const userNameElement = comment.querySelector('.name-date .name');
    
        if (userNameElement) {
            const existingButton = userNameElement.parentNode.querySelector('.user-score-btn');

            const userData = userMap.get(userId);
            const commentId = comment.id;
    
            if (!existingButton) {
                const scoreButton = document.createElement('button');
                scoreButton.textContent = '(+)';
                scoreButton.style.color = 'grey'
                scoreButton.style.marginLeft = '5px';
                scoreButton.className = 'user-score-btn';
                scoreButton.id = `score-btn-${commentId}`;
                scoreButton.style.lineHeight = 'normal';

                attachButtonListener(scoreButton, userId);
    
                userNameElement.parentNode.insertBefore(scoreButton, userNameElement.nextSibling);
    
                if (userData.showStats) {
                    setCommentStats(commentId, userData);
                }
            } else {
                attachButtonListener(existingButton, userId);

                if (userData.showStats) {
                    setCommentStats(commentId, userData);
                }
                else {
                    resetButton(commentId);
                }
            }
        }
    }
    
    function attachButtonListener(button, userId) {
        button.addEventListener('click', async function () {
            const userData = userMap.get(userId);
            if (userData.showStats) {
                userData.comments.forEach(commentId => {
                    resetButton(commentId);
                });
                userData.showStats = false;
                userMap.set(userId, userData);
            } else {
                button.textContent = 'Loading...';
                button.disabled = true;
                await updateAllUserComments(userId);
            }
        });
    }
    
    function addCommentToMap(userId, commentId) {
        if (!userMap.has(userId)) {
            userMap.set(userId, { status: 'N/A', score: 0, showStats: false, comments: [], statsLoaded: false });
        }
        const userData = userMap.get(userId);
        if (!userData.comments.includes(commentId)) {
            userData.comments.push(commentId);
        }
    }

    function initComments(comments) {
        for (const comment of comments) {
            const userId = comment.getAttribute('data-user_id');
            if (userId) {
                addCommentToMap(userId, comment.id);
                addButtonToComment(comment, userId);
            }
        }
    }

    function observeCommentsLoaded() {
        const commentsContainer = document.querySelector('.b-comments');

        if (!commentsContainer) {
            console.error('Comments container not found.');
            return;
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList.contains('comments-loaded')) {
                            const newComments = node.querySelectorAll('.b-comment');
                            initComments(newComments);
                        } else if (node.classList.contains('b-comment')) {
                            initComments([node]);
                        }
                    }
                });
            });
        });

        observer.observe(commentsContainer, { childList: true, subtree: true });
    }

    function init() {
        let url = window.location.href;
        const prevTitleType = titleType;
        const prevTitleId = titleId;

        const onNewsPage = isOnNewsPage(url);
        if (onNewsPage) {
            url = getTitleLinkFromNewsPage();
            if (!url) return;
        }

        titleType = getTitleTypeFromUrl(url);
        titleId = getTitleIdFromUrl(titleType, url);
        if (!titleType || !titleId) {
            return;
        }

        if(titleId !== prevTitleId || titleType !== prevTitleType) {
            userMap.clear();
        }

        entityType = (titleType == 'Ranobe') ? 'Manga' : titleType;
        const initialComments = document.querySelectorAll('.b-comment');
        initComments(initialComments);
        observeCommentsLoaded();
    }
    
    function ready(fn) {
        document.addEventListener('page:load', fn);
        document.addEventListener('turbolinks:load', fn);

        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(init);

})();

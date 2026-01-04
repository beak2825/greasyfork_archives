// ==UserScript==
// @name         水源显示回复可见
// @namespace    CCCC_David
// @version      0.3.1
// @description  可在水源论坛显示仅回复可见的回帖内容
// @author       CCCC_David
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433238/%E6%B0%B4%E6%BA%90%E6%98%BE%E7%A4%BA%E5%9B%9E%E5%A4%8D%E5%8F%AF%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/433238/%E6%B0%B4%E6%BA%90%E6%98%BE%E7%A4%BA%E5%9B%9E%E5%A4%8D%E5%8F%AF%E8%A7%81.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // From Font Awesome Free v5.15 by @fontawesome - https://fontawesome.com
    // License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
    // Modified class attribute to fit in.
    const PREV_REPLY_ICON = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-left" class="svg-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"></path></svg>';
    const NEXT_REPLY_ICON = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-right" class="svg-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"></path></svg>';
    const LOAD_ALL_REPLIES_ICON = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-right" class="svg-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path></svg>';

    // Parameters.
    const FETCH_MAX_RETRIES = 15;
    const EXP_BACKOFF_START = 0.1;
    const EXP_BACKOFF_BASE = 1.2;
    const ADJUST_AVATAR_SIZE = 90;
    const EMPTY_IMG = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    const INITIAL_REPLY_ID = 1;
    const MIN_WAIT_MS_BETWEEN_REPLIES = 600;
    const APPEND_VIEWER_TARGET_CLASS = 'post-stream';

    // Utility functions.
    const escapeRegExpOutsideCharacterClass = (s) => s.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    const escapeHtml = (html) => html.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;').replace(/'/gu, '&#039;');
    // eslint-disable-next-line no-promise-executor-return
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const allowedPolicy = window.trustedTypes?.createPolicy?.('allowedPolicy', {createHTML: (x) => x});
    const createTrustedHTML = (html) => (allowedPolicy ? allowedPolicy.createHTML(html) : html);

    const htmlParser = new DOMParser();
    const generateErrorOneboxResult = (msg) => `<aside><blockquote>[color=red](${escapeHtml(msg)})[/color]</blockquote></aside>`;

    // Fetch wrapper with:
    // - Discourse special headers.
    // - Response status code check.
    // - Limited exponential backoff retry upon 429 status code.
    const discourseFetch = async (url, options) => {
        let currentAttempt = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-await-in-loop
            const response = await fetch(url, {
                method: options?.method ?? 'GET',
                headers: {
                    'Discourse-Present': 'true',
                    'Discourse-Logged-In': 'true',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').content,
                    ...options?.headers,
                },
                body: options?.body,
                mode: 'same-origin',
                credentials: 'include',
                redirect: 'follow',
            });
            if (response.status === 429) {
                currentAttempt += 1;
                if (currentAttempt > FETCH_MAX_RETRIES) {
                    throw new Error('Max retries exceeded');
                }
                // eslint-disable-next-line no-await-in-loop
                await sleep(1000 * EXP_BACKOFF_START * EXP_BACKOFF_BASE ** (currentAttempt - 1));
                continue;
            }
            if (!response.ok) {
                throw new Error(`${response.status}${response.statusText ? ` ${response.statusText}` : ''}`);
            }
            return response;
        }
    };

    const fetchReply = async (topicId, replyId) => {
        const replyURL = `/t/topic/${topicId}/${replyId}`;
        try {
            const response = await discourseFetch(`/onebox?url=${encodeURIComponent(replyURL)}`);
            return response.text();
        } catch (e) {
            return generateErrorOneboxResult(e.toString());
        }
    };

    const fetchTopicInfo = async (topicId) => {
        const [topicInfo1, topicInfo2] = await Promise.all([
            `/t/${topicId}.json`,
            `/latest.json?topic_ids=${topicId}`,
        ].map(async (url) => (await discourseFetch(url, {headers: {Accept: 'application/json'}})).json()));
        return {
            isPrivateReply: topicInfo1.private_replies,
            maxReplyId: topicInfo2.topic_list?.topics?.[0]?.highest_post_number ?? 0,
            participants: topicInfo1.details?.participants ?? [],
        };
    };

    const fetchUserInfo = async (username) => {
        if (!username) {
            return {
                error: false,
                username: null,
                name: null,
                title: null,
            };
        }
        try {
            const response = await discourseFetch(`/u/${encodeURIComponent(username)}/card.json`, {headers: {Accept: 'application/json'}});
            const userInfo = await response.json();
            return {
                error: false,
                username: userInfo.user.username,
                name: userInfo.user.name,
                title: userInfo.user.title,
            };
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return {
                error: true,
                username: null,
                name: null,
                title: null,
            };
        }
    };

    const renderReply = (tree) => {
        const blockquote = tree.querySelector('aside > blockquote');
        if (!blockquote) {
            return '<p>(帖子已被作者删除)</p>';
        }
        const reply = blockquote.innerHTML.trim();
        if (!reply) {
            return '<p>&nbsp;</p>';
        }
        // eslint-disable-next-line no-undef
        return require('discourse/lib/text').cookAsync(reply);
    };

    const getAvatarURLFromReply = (tree) => {
        const img = tree.querySelector('aside > div > img');
        if (!img) {
            return '';
        }
        // Resize the avatar.
        return img.src.replace(/\/user_avatar\/([^/]+)\/([^/]+)\/40\//u, `/user_avatar/$1/$2/${ADJUST_AVATAR_SIZE}/`)
            .replace(/\/letter_avatar_proxy\/([^/]+)\/letter\/([^/]+)\/([^/]+)\/40\./u, `/letter_avatar_proxy/$1/letter/$2/$3/${ADJUST_AVATAR_SIZE}.`);
    };

    const tryToFindUserByAvatar = async (avatarURL, participants) => {
        // Case 1: Extract username from URL if it is user avatar.
        const username = avatarURL.match(/\/user_avatar\/(?:[^/]+)\/([^/]+)\//u)?.[1];
        if (username) {
            return {
                error: false,
                username: decodeURIComponent(username),
                name: null,
                title: null,
            };
        }
        // Case 2: Try to match letter avatar with top participants of this topic.
        const letterAvatarMatch = avatarURL.match(/\/letter_avatar_proxy\/(?:[^/]+)\/letter\/([^/]+)\/([^/]+)\//u); // Letter and color
        if (!letterAvatarMatch) { // Unexpected format.
            return {
                error: false,
                username: null,
                name: null,
                title: null,
            };
        }
        const letterAvatarTag = ['letter', letterAvatarMatch[1], letterAvatarMatch[2]].join('/');
        for (const participant of participants) {
            if ((participant.avatar_template ?? '').includes(letterAvatarTag)) {
                return {
                    error: false,
                    username: participant.username,
                    name: participant.name,
                    title: null,
                };
            }
        }
        // Case 3: Search for users with the letter and try to match letter avatar.
        let searchUsersByLetterResult;
        try {
            searchUsersByLetterResult = await (await discourseFetch(`/directory_items?period=all&order=username&name=${encodeURIComponent(decodeURIComponent(letterAvatarMatch[1]))}`)).json();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return {
                error: true,
                username: null,
                name: null,
                title: null,
            };
        }
        for (const user of searchUsersByLetterResult.directory_items) {
            if ((user.user.avatar_template ?? '').includes(letterAvatarTag)) {
                return {
                    error: false,
                    username: user.user.username,
                    name: user.user.name,
                    title: user.user.title ?? '',
                };
            }
        }
        // We are unable to figure out the username by avatar.
        return {
            error: false,
            username: null,
            name: null,
            title: null,
        };
    };

    const viewerTemplate = (options) => `
        <div class="topic-post clearfix regular">
            <article role="region" class="boxed">
                <div class="row">
                    <div class="topic-avatar">
                        <a ${options.hasElementId ? 'id="show-private-reply-avatar"' : ''} class="trigger-user-card main-avatar" href="${options.userPage}" data-user-card="${options.dataUserCard}" aria-hidden="true" style="${options.avatarStyle}">
                            <img width="45" height="45" src="${options.avatarURL}" class="avatar" loading="lazy">
                        </a>
                    </div>
                    <div class="topic-body clearfix">
                        <div role="heading" class="topic-meta-data">
                            <div class="names trigger-user-card">
                                <span class="first full-name">
                                    <a ${options.hasElementId ? 'id="show-private-reply-name"' : ''} href="${options.userPage}" data-user-card="${options.dataUserCard}" style="${options.nameStyle}">${options.name}</a>
                                </span>
                                <span class="second username" style="${options.usernameStyle}">
                                    <a ${options.hasElementId ? 'id="show-private-reply-username"' : ''} href="${options.userPage}" data-user-card="${options.dataUserCard}">${options.username}</a>
                                </span>
                                <span ${options.hasElementId ? 'id="show-private-reply-user-title"' : ''} class="user-title" style="${options.userTitleStyle}">${options.userTitle}</span>
                            </div>
                            <span style="text-align: right; margin-left: auto;">
                                ${options.hasElementId ? `
                                <span id="show-private-reply-id" title="跳转到回复..." style="font-size: var(--font-up-2); cursor: pointer;">${options.replyId}</span>
                                ` : `
                                <span style="font-size: var(--font-up-2);">${options.replyId}</span>
                                `}
                                ${options.hasElementId ? `
                                <button id="show-private-reply-dec-id" class="btn" title="上一条" style="margin-left: 0.5em;">${PREV_REPLY_ICON}</button>
                                <button id="show-private-reply-inc-id" class="btn" title="下一条" style="margin-left: 0.5em;">${NEXT_REPLY_ICON}</button>
                                <button id="show-private-reply-load-all" class="btn" title="加载剩余所有回复" style="margin-left: 0.5em;">${LOAD_ALL_REPLIES_ICON}</button>
                                ` : ''}
                            </span>
                        </div>
                        <div class="regular contents">
                            <div ${options.hasElementId ? 'id="show-private-reply-content"' : ''} class="cooked">${options.content}</div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    `;

    let viewerInitialized = false;

    const addViewer = async (parentNode) => {
        if (!parentNode) {
            return;
        }

        // Do not add the viewer more than once for a page.
        if (document.getElementById('show-private-reply-div')) {
            return;
        }

        viewerInitialized = false;

        const topicId = parseInt(window.location.pathname.match(/^\/t\/topic\/(\d+)(?=\/|$)/u)?.[1], 10);

        if (Number.isNaN(topicId)) { // Unable to parse topic ID, maybe not a topic page, give up.
            return;
        }

        const {isPrivateReply, maxReplyId, participants} = await fetchTopicInfo(topicId);

        // Do not add viewer if current topic is not private reply.
        // Double check for race condition after await.
        if (!isPrivateReply || maxReplyId < 1 || document.getElementById('show-private-reply-div')) {
            return;
        }

        const viewerContainer = document.createElement('div');
        viewerContainer.id = 'show-private-reply-div';
        viewerContainer.style.visibility = 'hidden';
        viewerContainer.innerHTML = createTrustedHTML(viewerTemplate({
            hasElementId: true,
            userPage: '',
            dataUserCard: '',
            avatarStyle: 'visibility: hidden; cursor: default;',
            avatarURL: escapeHtml(EMPTY_IMG),
            nameStyle: 'display: none;',
            name: '&nbsp;',
            usernameStyle: 'display: none;',
            username: '',
            userTitleStyle: 'display: none;',
            userTitle: '',
            replyId: INITIAL_REPLY_ID,
            content: '<p>正在加载回复可见内容...</p>',
        }));
        parentNode.appendChild(viewerContainer);
        const replyAvatarElement = document.getElementById('show-private-reply-avatar');
        const replyNameElement = document.getElementById('show-private-reply-name');
        const replyUsernameElement = document.getElementById('show-private-reply-username');
        const replyUserTitleElement = document.getElementById('show-private-reply-user-title');
        const replyIdElement = document.getElementById('show-private-reply-id');
        const replyContentElement = document.getElementById('show-private-reply-content');
        const replyLoadAllButton = document.getElementById('show-private-reply-load-all');

        let lastGetReplyFullInfoTime = null;

        const getReplyFullInfo = async (replyId) => {
            // Require a minimum wait time between two fetches of replies.
            if (lastGetReplyFullInfoTime) {
                const remainingTimeMs = MIN_WAIT_MS_BETWEEN_REPLIES - (new Date() - lastGetReplyFullInfoTime);
                if (remainingTimeMs > 0) {
                    await sleep(remainingTimeMs);
                }
            }
            // eslint-disable-next-line require-atomic-updates
            lastGetReplyFullInfoTime = new Date();
            const reply = await fetchReply(topicId, replyId);
            let tree;
            try {
                tree = htmlParser.parseFromString(reply, 'text/html');
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
                tree = htmlParser.parseFromString(generateErrorOneboxResult('Unable to parse result from `/onebox`'), 'text/html');
            }
            const avatarURL = getAvatarURLFromReply(tree);
            // eslint-disable-next-line no-shadow
            let {error, username, name, title} = await tryToFindUserByAvatar(avatarURL, participants);
            if (title === null && !error) {
                ({error, username, name, title} = await fetchUserInfo(username));
            }
            return {
                error,
                avatarURL,
                username,
                name,
                title,
                content: await renderReply(tree),
            };
        };

        const updateView = async (replyId) => {
            // eslint-disable-next-line no-shadow
            const {error, avatarURL, username, name, title, content} = await getReplyFullInfo(replyId);
            const nameToShow = name || username;
            replyAvatarElement.href = replyNameElement.href = replyUsernameElement.href = username ? `/u/${encodeURIComponent(username)}` : '';
            for (const userCardElement of [replyAvatarElement, replyNameElement, replyUsernameElement]) {
                userCardElement.setAttribute('data-user-card', username ?? '');
                // eslint-disable-next-line no-undef
                jQuery(userCardElement).data('user-card', username ?? '');
            }
            replyAvatarElement.children[0].src = avatarURL || EMPTY_IMG;
            replyAvatarElement.style.visibility = avatarURL ? 'visible' : 'hidden';
            replyAvatarElement.style.cursor = username ? 'pointer' : 'default';
            replyNameElement.textContent = error ? '(加载用户信息失败)' : nameToShow || '未知用户的回复';
            replyNameElement.style.cursor = nameToShow ? 'pointer' : 'text';
            replyNameElement.style.display = '';
            replyUsernameElement.textContent = username ?? '';
            replyUsernameElement.parentNode.style.display = name && name !== username ? '' : 'none';
            replyUserTitleElement.textContent = title ?? '';
            replyUserTitleElement.style.display = title ? '' : 'none';
            replyIdElement.textContent = replyId.toString();
            replyContentElement.innerHTML = createTrustedHTML(content);
        };

        for (const userCardElement of [replyAvatarElement, replyNameElement, replyUsernameElement]) {
            userCardElement.addEventListener('click', (e) => {
                if (!userCardElement.getAttribute('data-user-card')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

        viewerContainer.style.visibility = '';

        let replyNavigationInProgress = false;

        document.getElementById('show-private-reply-inc-id').addEventListener('click', async () => {
            if (!viewerInitialized || replyNavigationInProgress) {
                return;
            }
            let replyId = parseInt(replyIdElement.textContent, 10);
            replyId = Math.max(replyId < maxReplyId ? replyId + 1 : 1, 1);
            replyNavigationInProgress = true;
            try {
                await updateView(replyId);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
            // eslint-disable-next-line require-atomic-updates
            replyNavigationInProgress = false;
        });

        document.getElementById('show-private-reply-dec-id').addEventListener('click', async () => {
            if (!viewerInitialized || replyNavigationInProgress) {
                return;
            }
            let replyId = parseInt(replyIdElement.textContent, 10);
            replyId = Math.min(replyId > 1 ? replyId - 1 : maxReplyId, maxReplyId);
            replyNavigationInProgress = true;
            try {
                await updateView(replyId);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
            // eslint-disable-next-line require-atomic-updates
            replyNavigationInProgress = false;
        });

        replyIdElement.addEventListener('click', async () => {
            if (!viewerInitialized || replyNavigationInProgress) {
                return;
            }
            const newReplyIdText = prompt('跳转到回复...', replyIdElement.textContent);
            if (!newReplyIdText) {
                return;
            }
            let newReplyId = parseInt(newReplyIdText, 10);
            if (Number.isNaN(newReplyId)) {
                newReplyId = 1;
            }
            newReplyId = Math.min(Math.max(newReplyId, 1), maxReplyId);
            replyNavigationInProgress = true;
            try {
                await updateView(newReplyId);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
            // eslint-disable-next-line require-atomic-updates
            replyNavigationInProgress = false;
        });

        replyLoadAllButton.addEventListener('click', async () => {
            if (!viewerInitialized) {
                return;
            }
            replyLoadAllButton.style.display = 'none';
            let currentReplyId = parseInt(replyIdElement.textContent, 10);
            if (Number.isNaN(currentReplyId)) {
                currentReplyId = 1;
            }
            currentReplyId = Math.min(Math.max(currentReplyId, 1), maxReplyId);
            const loadingStateNode = document.createTextNode('加载中...');
            parentNode.parentNode.appendChild(loadingStateNode);
            for (let replyId = currentReplyId + 1; replyId <= maxReplyId; replyId += 1) {
                // eslint-disable-next-line no-shadow, no-await-in-loop
                const {error, avatarURL, username, name, title, content} = await getReplyFullInfo(replyId);
                const nameToShow = name || username;
                const replyContainer = document.createElement('div');
                replyContainer.style.visibility = 'hidden';
                replyContainer.innerHTML = createTrustedHTML(viewerTemplate({
                    hasElementId: false,
                    userPage: escapeHtml(username ? `/u/${encodeURIComponent(username)}` : ''),
                    dataUserCard: escapeHtml(username ?? ''),
                    avatarStyle: `visibility: ${avatarURL ? 'visible' : 'hidden'}; cursor: ${username ? 'pointer' : 'default'};`,
                    avatarURL: escapeHtml(avatarURL || EMPTY_IMG),
                    nameStyle: `cursor: ${nameToShow ? 'pointer' : 'text'};`,
                    name: escapeHtml(error ? '(加载用户信息失败)' : nameToShow || '未知用户的回复'),
                    usernameStyle: name && name !== username ? '' : 'display: none;',
                    username: escapeHtml(username ?? ''),
                    userTitleStyle: title ? '' : 'display: none;',
                    userTitle: escapeHtml(title ?? ''),
                    replyId,
                    content,
                }));
                parentNode.appendChild(replyContainer);
                for (const selector of ['.main-avatar', '.full-name > a', '.username > a']) {
                    const userCardElement = replyContainer.querySelector(selector);
                    // eslint-disable-next-line no-undef
                    jQuery(userCardElement).data('user-card', username ?? '');
                    userCardElement.addEventListener('click', (e) => {
                        if (!userCardElement.getAttribute('data-user-card')) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                }
                // Reload avatar image if failed.
                const avatarElement = replyContainer.querySelector('.avatar');
                avatarElement.reloadAttempt = 0;
                avatarElement.addEventListener('error', async () => {
                    if (!avatarElement.src || avatarElement.src === EMPTY_IMG) {
                        return;
                    }
                    avatarElement.reloadAttempt += 1;
                    if (avatarElement.reloadAttempt > FETCH_MAX_RETRIES) {
                        return;
                    }
                    await sleep(1000 * EXP_BACKOFF_START * EXP_BACKOFF_BASE ** (avatarElement.reloadAttempt - 1));
                    // eslint-disable-next-line no-self-assign
                    avatarElement.src = avatarElement.src;
                });
                replyContainer.style.visibility = '';
                loadingStateNode.textContent = `加载中 (${replyId} / ${maxReplyId}) ...`;
            }
            loadingStateNode.textContent = '加载完成';
        });

        await updateView(INITIAL_REPLY_ID);
        viewerInitialized = true;
    };

    const observer = new MutationObserver(async (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const el of mutation.addedNodes) {
                    if (el.classList?.contains(APPEND_VIEWER_TARGET_CLASS)) {
                        // eslint-disable-next-line no-await-in-loop -- addViewer should ideally only happen once
                        await addViewer(el);
                    }
                }
            } else if (mutation.type === 'attributes') {
                if (!mutation.oldValue?.match(new RegExp(`(?:^|\\s)${escapeRegExpOutsideCharacterClass(APPEND_VIEWER_TARGET_CLASS)}(?:\\s|$)`, 'u')) &&
                    mutation.target.classList?.contains(APPEND_VIEWER_TARGET_CLASS)) {
                    // eslint-disable-next-line no-await-in-loop -- addViewer should ideally only happen once
                    await addViewer(mutation.target);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributeFilter: ['class'],
        attributeOldValue: true,
    });

    await addViewer(document.getElementsByClassName(APPEND_VIEWER_TARGET_CLASS)[0]);
})();

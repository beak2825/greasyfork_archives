// ==UserScript==
// @name         美卡论坛显示楼主标识 (OP Badge)
// @version      1.2.0
// @description  在美卡论坛帖子中为楼主添加OP标识，点击可筛选只看楼主
// @author       Anonymous
// @namespace    https://greasyfork.org/users/uscardforum-tools
// @license      MIT
// @match        https://www.uscardforum.com/*
// @match        https://uscardforum.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uscardforum.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546097/%E7%BE%8E%E5%8D%A1%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E6%A5%BC%E4%B8%BB%E6%A0%87%E8%AF%86%20%28OP%20Badge%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546097/%E7%BE%8E%E5%8D%A1%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E6%A5%BC%E4%B8%BB%E6%A0%87%E8%AF%86%20%28OP%20Badge%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `.op-badge {
        background: #39c5bb;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        font-weight: bold;
        margin-left: 5px;
        cursor: pointer;
        transition: background 0.2s;
    }
    .op-badge:hover {
        background: #2ca89f;
    }
    .latest-topic-list-item .topic-poster {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 108px;
      min-width: 108px;
    }
    .latest-topic-list-item .op-avatar-wrapper {
      display: inline-flex;
    }`;
    document.head.appendChild(style);

    let opUsername = null;

    function getTopicId() {
        return window.location.pathname.split('/')[3] || window.location.pathname.split('/')[2];
    }

    function addOPBadges() {
        if (!opUsername) return;

        document.querySelectorAll('.topic-post').forEach(post => {
            if (post.querySelector('.op-badge')) return;

            const userLink = post.querySelector('.names a[data-user-card]');
            if (!userLink) return;

            const username = userLink.getAttribute('data-user-card');
            if (username !== opUsername) return;

            const badge = document.createElement('span');
            badge.className = 'op-badge';
            badge.textContent = 'OP';
            badge.title = '点击只看楼主';

            badge.onclick = function() {
                const url = new URL(window.location);
                if (url.searchParams.get('username_filters') === opUsername) {
                    url.searchParams.delete('username_filters');
                    badge.title = '点击只看楼主';
                } else {
                    url.searchParams.set('username_filters', opUsername);
                    badge.title = '点击显示全部';
                }
                window.location.href = url.toString();
            };

            const usernameSpan = userLink.closest('span.username, span.full-name, span.first');
            (usernameSpan || userLink).insertAdjacentElement('afterend', badge);
        });
    }

    function loadOP() {
        const topicId = getTopicId();

        fetch(`${window.location.origin}/t/${topicId}.json`)
            .then(response => response.json())
            .then(data => {
                opUsername = data?.post_stream?.posts?.[0]?.username ||
                            data?.details?.created_by?.username;
                if (opUsername) {
                    addOPBadges();
                    setTimeout(addOPBadges, 500);
                }
            })
            .catch(() => {});
    }

    function addOPAvatarsToHomepage() {
        document.querySelectorAll('.latest-topic-list-item').forEach(item => {
            if (item.querySelector('.op-avatar-wrapper')) return;

            const topicId = item.getAttribute('data-topic-id');
            if (!topicId || topicId === '0') return;

            const posterDiv = item.querySelector('.topic-poster');
            if (!posterDiv) return;

            fetch(`${window.location.origin}/t/${topicId}.json`)
                .then(response => response.json())
                .then(data => {
                    const firstPost = data?.post_stream?.posts?.[0];
                    const createdBy = data?.details?.created_by;
                    const opInfo = firstPost || createdBy;

                    if (!opInfo?.avatar_template) return;

                    const avatarUrl = opInfo.avatar_template
                        .replace('{size}', '48')
                        .replace(/(https?:)?\/\//, 'https://');

                    const opAvatarWrapper = document.createElement('div');
                    opAvatarWrapper.className = 'op-avatar-wrapper';
                    opAvatarWrapper.title = '楼主：' + opInfo.username;
                    opAvatarWrapper.innerHTML = `
                        <a href="/u/${opInfo.username}" data-user-card="${opInfo.username}" aria-label="${opInfo.username} 的个人资料">
                            <img alt="" width="48" height="48" src="${avatarUrl}" class="avatar" title="${opInfo.username} (楼主)">
                        </a>
                    `;

                    posterDiv.insertBefore(opAvatarWrapper, posterDiv.firstChild);
                })
                .catch(() => {});
        });
    }

    // Main logic
    // console.log('Current pathname:', window.location.pathname);
    function initialize() {
        // Clear any existing observers
        if (window.topicObserver) window.topicObserver.disconnect();
        if (window.postObserver) window.postObserver.disconnect();

        if (window.location.pathname.startsWith('/t/')) {
            // Topic page
            opUsername = null;
            loadOP();

            window.postObserver = new MutationObserver(() => {
                if (opUsername) {
                    clearTimeout(window.opTimeout);
                    window.opTimeout = setTimeout(addOPBadges, 100);
                }
            });
            window.postObserver.observe(document.body, {childList: true, subtree: true});
        } else if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname.startsWith('/categories')) {
            // Homepage
            addOPAvatarsToHomepage();

            new MutationObserver(() => {
                clearTimeout(window.homepageTimeout);
                window.homepageTimeout = setTimeout(addOPAvatarsToHomepage, 500);
            }).observe(document.body, {childList: true, subtree: true});
            }
    }

    // Initial run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Global URL watcher for SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            initialize();
        }
    }).observe(document, {subtree: true, childList: true});
})();
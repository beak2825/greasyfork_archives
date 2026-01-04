// ==UserScript==
// @name         Mangalib freeze avatars
// @version      0.7.4
// @description  Freeze avatars on mangalib.me
// @author       reiwsan
// @match        https://mangalib.me/*
// @match        https://ranobelib.me/*
// @namespace    https://greasyfork.org/users/221048
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/386400/Mangalib%20freeze%20avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/386400/Mangalib%20freeze%20avatars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const freezeGif = function(img, size, fontSize) {
        let canvas = document.createElement('canvas');

        canvas.width = size;
        canvas.height = size;
        canvas.className = img.className;

        let dark_theme = localStorage.getItem('dark-theme'),
            context = canvas.getContext('2d');

        dark_theme = (dark_theme) ? JSON.parse(dark_theme).enabled : false;

        context.drawImage(img, 0, 0, size, size);
        context.fillStyle = window._SITE_COLOR_;
        context.font = `normal normal normal ${fontSize}/1 FontAwesome`;
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.lineWidth = 2;
        context.strokeStyle = (dark_theme) ? 'black' : 'white';
        context.strokeText('\uf04b', size / 2, size / 2);
        context.fillText('\uf04b', size / 2, size / 2);

        let alt = img.getAttribute('alt'),
            parentImg = img.parentNode;

        if (alt) {
            canvas.setAttribute('alt', alt);
        }

        parentImg.insertBefore(canvas, img);
        img.style.display = 'none';

        img.addEventListener('mouseleave', _ => {
            canvas.style.display = '';
            img.style.display = 'none';
        });

        canvas.addEventListener('mouseenter', _ => {
            canvas.style.display = 'none';
            img.style.display = '';
        });
    }

    const imageLoad = function(img, size, fontSize) {
        if (img.complete) {
            freezeGif(img, size, fontSize);
        } else {
            img.onload = () => {
                freezeGif(img, size, fontSize);
            }
        }
    }

    const avatarsForumTopic = document.querySelectorAll('img.topic-item-recent__avatar');
    const avatarsForumPost = document.querySelectorAll('img.forum-post-user__avatar');
    const avatarsMessage = document.querySelectorAll('img.message__avatar');
    const avatarsUser = document.querySelectorAll('.aside-user img');
    const avatarsTopAndFriends = document.querySelectorAll(
        'img.top-user__avatar, .friends-item__avatar-wrap img'
    );

    avatarsForumTopic.forEach(function(img) {
        if (/\.gif/.test(img.src)) {
            imageLoad(img, 36, '12px');
        }
    });

    avatarsForumPost.forEach(function(img) {
        if (/\.gif/.test(img.src)) {
            imageLoad(img, 70, '15px');
        }
    });

    avatarsMessage.forEach(function(img) {
        if (/\.gif/.test(img.src)) {
            imageLoad(img, 60, '14px');
        }
    });

    avatarsUser.forEach(function(img) {
        if (/\.gif/.test(img.getAttribute('data-src'))) {
            imageLoad(img, 60, '14px');
        }
    });

    avatarsTopAndFriends.forEach(function(img) {
        if (/\.gif/.test(img.getAttribute('data-src'))) {
            imageLoad(img, 50, '13px');
        }
    });

    const friends = document.querySelector('.friends');
    const bookmarks = document.querySelector('.users-bookmarks-container');

    if (friends) {
        const chatObserver = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation =>
                mutation.addedNodes.forEach(node => {
                    if (node.tagName == 'DIV' && node.classList.contains('friends-item')) {
                        const avatarFriends = node.querySelector('img.friends-item__avatar');

                        if (/\.gif/.test(avatarFriends.src)) {
                            imageLoad(avatarFriends, 50, '13px');
                        }
                    }
                })
            )
        });

        chatObserver.observe(friends, { childList: true, subtree: false, attributes: false });
    }

    if (bookmarks) {
        const chatObserver = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation =>
                mutation.addedNodes.forEach(node => {
                    if (node.tagName == 'A' && node.classList.contains('users-bookmarks')) {
                        const avatarBookmarks = node.querySelector('img.users-bookmarks__avatar');

                        if (/\.gif/.test(avatarBookmarks.src)) {
                            imageLoad(avatarBookmarks, 55, '13px');
                        }
                    }
                })
            )
        });

        chatObserver.observe(bookmarks, { childList: true, subtree: false, attributes: false });
    }
})();
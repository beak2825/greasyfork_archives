// ==UserScript==
// @name         hide-comments-by-author-anime365.user.js
// @version      0.3
// @description  Скрывает комменты выбранных авторов на anime365.ru.
// @author       shtrih
// @license      MIT
// @match        https://anime365.ru/*
// @match        https://anime-365.ru/*
// @match        https://hentai365.ru/*
// @match        https://smotret-anime.com/*
// @match        https://smotret-anime.net/*
// @exclude      https://anime365.ru/translations/embed/*
// @exclude      https://anime-365.ru/translations/embed/*
// @exclude      https://hentai365.ru/translations/embed/*
// @exclude      https://smotret-anime.com/translations/embed/*
// @exclude      https://smotret-anime.net/translations/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smotret-anime.com
// @grant        GM_addStyle
// @run-at       document-end
// @homepage     https://gist.github.com/shtrih/9b58dfa1e0fb20bdd795b3263140a4ae
// @supportURL   https://gist.github.com/shtrih/9b58dfa1e0fb20bdd795b3263140a4ae
// @namespace https://greasyfork.org/users/1257517
// @downloadURL https://update.greasyfork.org/scripts/518956/hide-comments-by-author-anime365userjs.user.js
// @updateURL https://update.greasyfork.org/scripts/518956/hide-comments-by-author-anime365userjs.meta.js
// ==/UserScript==

const STORAGE_KEY = 'hide-comments-by-author.user.js';

GM_addStyle(`
.hbtn {
  cursor: pointer;
}
.m-comment.blocked {
  opacity: 0.8;
}
.blocked .circle {
  background-blend-mode: luminosity;
  background-color: #AAB;
}
.blocked .m-comment-body, .blocked .m-comment-author-name a {
  color: rgba(0, 0, 0, 0.02);
}
`);

(function () {
    'use strict';

    const
        getConfig = function () {
            let config = loadConfig();

            if (!config) {
                config = {
                    ignored: {}
                }
            }

            return config
        },
        config = getConfig(),
        getUser = function (comment) {
            // style="background-image: url('/users/avatars/104804.2238712765.jpg');"
            return comment.querySelector('.circle').getAttribute('style')
                .replace("background-image: url('/users/avatars/", '')
                .replace(/[.]\d+[.]jpg'[)];$/, '')
        },
        setBlockState = function (config, user, state) {
            config.ignored[user] = state
            saveConfig(config)
        },
        block = function (e) {
            const $this = $(this),
                currentAuthorStyle = $(this).closest('.m-comment').children('.circle').attr('style'),
                comments = $(this).closest('.m-comments-list').find('[style="' + currentAuthorStyle + '"]').closest('.m-comment');

            setBlockState(config, getUser(comments[0]), true)

            comments.addClass('blocked');
            $(`.${Array.from($this.get(0).classList).join('.')}`, comments)
                .hide()
                .parent().prepend(unblockBtn.clone(true))
        },
        unblock = function (e) {
            const $this = $(this),
                currentAuthorStyle = $(this).closest('.m-comment').children('.circle').attr('style'),
                comments = $(this).closest('.m-comments-list').find('[style="' + currentAuthorStyle + '"]').closest('.m-comment');

            setBlockState(config, getUser(comments[0]), false)

            comments.removeClass('blocked');
            $(`.${Array.from($this.get(0).classList).join('.')}`, comments)
                .hide()
                .parent().prepend(blockBtn.clone(true))
        },
        blockBtn = $(`<span class="hbtn" title="Заблокировать">☠️</span>`).on('click', block),
        unblockBtn = $(`<span class="hbtn" title="Разблокировать">😇</span>`).on('click', unblock),
        processComments = function ($commentsItemsNode) {
            if (!$commentsItemsNode) {
                $commentsItemsNode = $('.m-comments-list > .items').eq(0)
            }
            const comments = $commentsItemsNode.children('div').get();

            if (!comments) {
                return;
            }

            comments.forEach((comment) => {
                const user = getUser(comment),
                    rightDiv = $('.right', comment)
                ;
                if (config.ignored[user]) {
                    comment.classList.add('blocked')
                    rightDiv.prepend(unblockBtn.clone(true))
                } else {
                    rightDiv.prepend(blockBtn.clone(true))
                }
            });
        },
        setupCommentsPagerObserver = function (targetSelector) {
            const targetNode = document.querySelector(targetSelector);
            if (targetNode) {
                const config = {childList: true, subtree: true},
                    observer = new MutationObserver((mutationsList) => mutationsList.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1 && node.classList.contains('items')) {
                                    //console.log('New comments page loaded:', node);
                                    processComments($(node))
                                }
                            });
                        }
                    }))
                ;
                observer.observe(targetNode, config);
                console.log('CommentsPagerObserver set');
            }
        },
        setupPageLoadObserver = function (targetSelector) {
            const targetNode = document.querySelector(targetSelector);
            if (targetNode) {
                const config = {childList: true, subtree: true},
                    observer = new MutationObserver((mutationsList) => mutationsList.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1 && node.classList.contains('body-container')) {
                                    //console.log('page loaded:', node);
                                    processComments();
                                    setupCommentsPagerObserver('.m-comments-list');
                                }
                            });
                        }
                    }))
                ;
                observer.observe(targetNode, config);
                console.log('PageLoadObserver set');
            }
        }
    ;

    // init processing
    processComments();
    setupPageLoadObserver('body');
    setupCommentsPagerObserver('.m-comments-list');
})();

function saveConfig(config) {
    return setLocalStorageItem(STORAGE_KEY, JSON.stringify(config));
}

function loadConfig() {
    try {
        return JSON.parse(getLocalStorageItem(STORAGE_KEY))
    } catch (e) {
        console.log('Failed to parse local storage item ' + STORAGE_KEY + ', ' + e + '.');
        return false;
    }
}

function getLocalStorageItem(name) {
    try {
        return localStorage.getItem(name);
    } catch (e) {
        return null;
    }
}

function setLocalStorageItem(name, value) {
    try {
        localStorage.setItem(name, value);
    } catch (e) {
        console.log('Failed to set local storage item ' + name + ', ' + e + '.');
        return false;
    }

    return true;
}
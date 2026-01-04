// ==UserScript==
// @name         VK comments blacklist FIXED
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Hides comments from blacklisted users
// @author       ryba kaplya
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?domain=vk.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/531969/VK%20comments%20blacklist%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/531969/VK%20comments%20blacklist%20FIXED.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const $ = window.jQuery;
    const UFO_TEXT = 'НЛО прилетело и оставило здесь эту запись';
    const HIDDEN_CLASS = 'vkcbl-hidden';
    const BUTTON_CLASS = 'vkcbl-btn';

    let blacklist = JSON.parse(localStorage.getItem('vkBlacklistIds') || '{}');

    const saveBlacklist = () =>
        localStorage.setItem('vkBlacklistIds', JSON.stringify(blacklist));

    const createButton = (icon, title, userid, action) =>
        $('<div>', {
            class: `reply_action fl_r ${BUTTON_CLASS}`,
            text: icon,
            title,
            'data-userid': userid,
            click: e => {
                e.preventDefault();
                e.stopPropagation();
                action(userid);
            }
        });

    const hideComment = ($comment, userid) => {
        if ($comment.hasClass(HIDDEN_CLASS)) return;

        $comment.addClass(HIDDEN_CLASS).hide();

        const $ufo = $('<div>', { class: 'reply reply_dived clear vkcbl-ufo' }).append(
            $('<div>', {
                style: 'color:#aaa; margin:7px 0 7px 44px',
                text: UFO_TEXT
            }).append(createButton('👀', 'Показать сообщение', userid, forgiveUser))
        );

        $comment.after($ufo);
    };

    const showComment = userid => {
        const $comments = getUserComments(userid);
        $comments.removeClass(HIDDEN_CLASS).show();
        $comments.nextAll('.vkcbl-ufo').remove();
    };

    const forgiveUser = userid => {
        delete blacklist[userid];
        saveBlacklist();
        showComment(userid);
        updateButtons();
    };

    const blockUser = userid => {
        blacklist[userid] = true;
        saveBlacklist();
        hideUserComments(userid);
        updateButtons();
    };

    const getUserComments = userid =>
        $(`a.author[data-from-id="${userid}"]`).closest('.reply');

    const getUseridFromComment = $comment =>
        $comment.find('a.author').data('from-id');

    const hideUserComments = userid =>
        getUserComments(userid).each(function () {
            hideComment($(this), userid);
        });

    const updateButtons = () => {
        $('.reply').each(function () {
            const $comment = $(this);
            const userid = getUseridFromComment($comment);
            if (!userid) return;

            const $actions = $comment.find('.post_actions_wrap .post_actions');
            if (!$actions.length || $actions.find(`.${BUTTON_CLASS}`).length) return;

            $actions.append(createButton('🚫', 'В ЧС', userid, blockUser));
        });
    };

    const applyBlacklist = () =>
        Object.keys(blacklist).forEach(hideUserComments);

    const observeComments = () => {
        new MutationObserver(() => {
            applyBlacklist();
            updateButtons();
        }).observe(document.body, { childList: true, subtree: true });
    };

    const init = () => {
        applyBlacklist();
        updateButtons();
        observeComments();
    };

    const interval = setInterval(() => {
        if ($('.reply').length) {
            clearInterval(interval);
            init();
        }
    }, 500);
})();

// ==UserScript==
// @name         LZT Reviews Report Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  this.account.delete();
// @author       @Aisan
// @match        https://lolz.live/threads/*
// @match        https://lolz.guru/threads/*
// @match        https://zelenka.guru/threads/*
// @grant window.close
// @icon         https://nztcdn.com/avatar/l/1724225284/3498309.webp
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505611/LZT%20Reviews%20Report%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/505611/LZT%20Reviews%20Report%20Helper.meta.js
// ==/UserScript==

const NEW_RULES_TIMESTAMP = 1693515600;
const SHOW_FIRST_POST = false;
const FOR_FREE_TEXTS = [
    'отзыв',
    'бесплатно',
    'free',
    'transaction',
    'tronscan',
];
const CURRENT_TIMESTAMP = parseInt(Date.now() / 1000);
const MAX_AGE = 60 * 60 * 24 * 9.8;

(function() {
    'use strict';

    function alreadyReported(element) {
        const warning = element.querySelector('.message_warning_message_block');
        return !!warning;
    }

    function isOlderThanTenDays(element) {
        const dateTimeElement = element.querySelector('span.DateTime');
        if (dateTimeElement) {
            const timestamp = parseInt(dateTimeElement.getAttribute('data-time'), 10);
            return timestamp < CURRENT_TIMESTAMP - MAX_AGE;
        }
        return false;
    }

    function hasTwoOrMoreImages(element) {
        const images = element.querySelectorAll('img.bbCodeImage');
        return images.length >= 2;
    }

    function containsHiddenContent(element) {
        const blockquote = element.querySelector('blockquote.hideContainer');
        return blockquote && blockquote.textContent.includes('Скрытый контент для команды форума.');
    }

    function containsForFree(element) {
        const article = element.querySelector('article');
        if (!article) return false;
        const innerText = article.textContent.toLowerCase();
        return FOR_FREE_TEXTS.some(text => innerText.includes(text));
    }

    function isOlderThanNewRules(element) {
        const dateTimeElement = element.querySelector('span.DateTime');
        if (dateTimeElement) {
            const timestamp = parseInt(dateTimeElement.getAttribute('data-time'), 10);
            return timestamp < NEW_RULES_TIMESTAMP;
        }
        return false;
    }

    function deleteGoodReviews() {
        const first_post = document.querySelector('li.message.firstPost');
        if (first_post && !SHOW_FIRST_POST) first_post.remove();
        const query = 'li.message:not(.firstPost)';
        const messages = document.querySelectorAll(query);
        messages.forEach(message => {
            if (hasTwoOrMoreImages(message)) message.remove();
            if (containsHiddenContent(message)) message.remove();
            if (containsForFree(message)) message.remove();
            if (alreadyReported(message)) message.remove();
            if (isOlderThanTenDays(message)) message.remove();
            else if (isOlderThanNewRules(message)) message.remove();
        });

        const remaining_messages = document.querySelectorAll(query);
        if (remaining_messages.length === 0) {
            goToNextPage();
        }
    }

    function goToNextPage() {
        const pageNavLinks = document.querySelectorAll('.pageNavLinkGroup nav a');
        if (pageNavLinks.length > 0) {
            const lastPageNumber = parseInt(pageNavLinks[pageNavLinks.length - 1].textContent, 10);
            const currentUrl = window.location.href;
            const currentPageMatch = currentUrl.match(/\/page-(\d+)/);
            let nextPageNumber = 2;
            if (currentPageMatch) {
                const currentPageNumber = parseInt(currentPageMatch[1], 10);
                if (currentPageNumber >= lastPageNumber) {
                    window.close();
                    return;
                }
                nextPageNumber = currentPageNumber + 1;
                window.location.href = currentUrl.replace(/\/page-\d+/, `/page-${nextPageNumber}`);
            } else {
                window.location.href = `${currentUrl}page-${nextPageNumber}`;
            }
        }
        else {
            window.close();
            return;
        }
    }

    setInterval(() => {
        deleteGoodReviews();
    }, 500)
})();
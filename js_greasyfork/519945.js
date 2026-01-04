// ==UserScript==
// @name         Zhihu Link Archiver
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       Jarrett Ye
// @license      MIT
// @description  Adds a button beside Zhihu answer/article links to archive them to Archive.org
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519945/Zhihu%20Link%20Archiver.user.js
// @updateURL https://update.greasyfork.org/scripts/519945/Zhihu%20Link%20Archiver.meta.js
// ==/UserScript==

function createArchiveZhihuButton(link) {
    const button = document.createElement('a');
    button.textContent = '保存到 Archive';
    button.className = 'archive-zhihu-button';
    button.style.cssText = `
        margin-left: 10px;
        padding: 2px;
        background-color: #0084ff;
        text-align: center;
        color: white;
        min-width: 82px;
        border-radius: 3px;
        font-size: 12px;
        text-decoration: none;
        transition: all 0.3s ease;
    `;
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const archiveLink = link.replace('.zhihu.com', '.fxzhihu.com');
        window.open('https://web.archive.org/save/' + archiveLink, '_blank');
        button.textContent = '已打开';
        setTimeout(() => {
            button.textContent = '保存到 Archive';
        }, 1000);
    });
    button.href = 'javascript:void(0)';
    return button;
}

(function () {
    'use strict';

    function addArchiveZhihuButton() {
        const answerItems = target.querySelectorAll('.ContentItem.AnswerItem');
        answerItems.forEach(item => {
            if (item.querySelector('.archive-zhihu-button')) return;

            let link = item.querySelector('.ContentItem-title a');
            if (!link) {
                link = item.querySelector('.ContentItem-time a');
            }
            if (!link) {
                link = item.querySelector('meta[itemprop="url"]').baseURI;
            } else {
                link = link.href;
            }
            const actions = item.querySelector('.ContentItem-actions');
            actions.insertBefore(createArchiveZhihuButton(link), actions.firstChild.nextSibling);
        });

        const articleItems = target.querySelectorAll('.ContentItem.ArticleItem');
        articleItems.forEach(item => {
            if (item.querySelector('.archive-zhihu-button')) return;
            let link = item.querySelector('.ContentItem-title a');
            if (!link) {
                link = item.querySelector('.ContentItem-time a');
            }
            const actions = item.querySelector('.ContentItem-actions');
            actions.insertBefore(createArchiveZhihuButton(link.href), actions.firstChild.nextSibling);
        });

        const pinItems = target.querySelectorAll('.ContentItem.PinItem');
        pinItems.forEach(item => {
            if (item.querySelector('.archive-zhihu-button')) return;
            let link = item.querySelector('.ContentItem-title a');
            if (!link) {
                link = item.querySelector('.ContentItem-time a');
            }
            const actions = item.querySelectorAll('.ContentItem-actions')[1];
            actions.insertBefore(createArchiveZhihuButton(link.href), actions.firstChild.nextSibling);
        });
    }

    if (window.location.hostname.startsWith('zhuanlan.zhihu.com')) {
        const actions = document.querySelector('.ContentItem-actions');
        actions.insertBefore(createArchiveZhihuButton(window.location.href), actions.firstChild.nextSibling);
        return;
    }

    const target = document.querySelector('.ListShortcut');
    if (!target) {
        return;
    }
    // Run the function initially
    addArchiveZhihuButton();

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(addArchiveZhihuButton);

    // Start observing the document with the configured parameters
    observer.observe(target, { childList: true, subtree: true });
})();
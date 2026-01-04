// ==UserScript==
// @name         Tweakers News & Articles Comment Styling
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Restyles the tweakers.net comment section to resemble the look and feel of Reddit, including collapsible threads.
// @author       S2004
// @match        https://tweakers.net/nieuws/*
// @match        https://tweakers.net/reviews/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544169/Tweakers%20News%20%20Articles%20Comment%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/544169/Tweakers%20News%20%20Articles%20Comment%20Styling.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 S2004

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const replyIconSVG = `<svg rpl="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"></path></svg>`;
    const shareIconSVG = `<svg rpl="" aria-hidden="true" class="icon-share" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.239 18.723A1.235 1.235 0 0 1 1 17.488C1 11.5 4.821 6.91 10 6.505V3.616a1.646 1.646 0 0 1 2.812-1.16l6.9 6.952a.841.841 0 0 1 0 1.186l-6.9 6.852A1.645 1.645 0 0 1 10 16.284v-2.76c-2.573.243-3.961 1.738-5.547 3.445-.437.47-.881.949-1.356 1.407-.23.223-.538.348-.858.347ZM10.75 7.976c-4.509 0-7.954 3.762-8.228 8.855.285-.292.559-.59.832-.883C5.16 14 7.028 11.99 10.75 11.99h.75v4.294a.132.132 0 0 0 .09.134.136.136 0 0 0 .158-.032L18.186 10l-6.438-6.486a.135.135 0 0 0-.158-.032.134.134 0 0 0-.09.134v4.36h-.75Z"></path></svg>`;
    const overflowIconSVG = `<svg rpl="" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"></path></svg>`;

    GM_addStyle(`
        body { background-color: #DAE0E6; }
        .reacties-inner {
            background-color: #FFFFFF;
            padding: 10px 20px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        .reactieFooter, .modFaq, .pagination-section, #reactionFormLoginMessage,
        .reactieHeader .reportLink, .reactieHeader .thumb, .reactie > .reactieBody > #collapseButtons {
            display: none !important;
        }
        twk-reaction.reactie {
            position: relative;
            margin-top: 16px;
            padding-left: 42px;
        }
        .reactieBody {
            display: flex;
            flex-direction: column;
            cursor: pointer;
        }
        twk-reaction.reactie:not(:first-of-type)::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 10px;
            bottom: 0;
            width: 2px;
            background-color: #EDEFF1;
            z-index: 1;
        }
        twk-reaction.reactie:hover::before {
            background-color: #0079D3;
        }
        twk-reaction.thread-collapsed > twk-reaction.reactie {
            display: none;
        }
        twk-reaction.thread-collapsed > .reactieBody .reactieContent,
        twk-reaction.thread-collapsed > .reactieBody .new-action-row {
            display: none;
        }
        twk-reaction.thread-collapsed .new-avatar-wrapper,
        twk-reaction.thread-collapsed > .reactieBody {
            opacity: 0.8;
        }
        twk-reaction.thread-collapsed .reactionMeta::after {
            content: '[+]';
            margin-left: 8px;
            color: #0079D3;
            font-weight: bold;
        }
        .new-avatar-wrapper {
            position: absolute;
            left: 4px;
            top: 2px;
            z-index: 2;
        }
        .new-avatar-wrapper img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        .reactieHeader {
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
            min-height: auto;
            width: 100%;
        }
        .reactionMeta { font-size: 12px; color: #787C7E; }
        .reactionMeta .userName { font-weight: bold; color: #1c1c1c; margin-right: 4px; font-size: 12px; }
        .reactionMeta .date { color: #787C7E; text-decoration: none; }
        .reactionMeta .userName:hover, .reactionMeta .date:hover { text-decoration: underline; }
        .reactionMeta .userName::after { content: '•'; margin: 0 6px; color: #787C7E; font-weight: normal; }
        .authorReaction { background-color: #0079d3; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-right: 8px; }
        .userFunction { font-style: italic; color: #878A8C; }
        .reactieContent { font-size: 14px; line-height: 21px; color: #1c1c1c; }
        .reactieContent .edit { font-size: 12px; color: #787c7e; margin-top: 8px; }
        .new-action-row { display: flex; align-items: center; gap: 4px; margin-top: 8px; }
        .new-action-row button, .new-action-row a { background: transparent; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 20px; font-size: 12px; font-weight: bold; color: #878A8C; }
        .new-action-row button:hover, .new-action-row a:hover { background-color: #e9e9e9; }
        .new-action-row svg { width: 20px; height: 20px; fill: currentColor; }
        #reactieContainer > form#reactieForm { border: 1px solid #ccc; border-radius: 4px; padding: 10px; margin-top: 20px; display: block !important; }
        #reactieForm .wysiwyg.toolbar-wrapper { background-color: #ffffff; border: 1px solid #ccc; border-radius: 4px; }
        #reactieForm .ProseMirror { padding: 8px 12px; min-height: 120px; background: white; }
        #reactieForm .submit { display: flex; justify-content: flex-end; margin-top: 8px; padding: 0; border: 0; }
        #reactieFormSubmit { background-color: #0079D3; color: white; border-radius: 9999px; padding: 4px 16px; font-weight: bold; border: none; }
        #reactieFormSubmit:hover { background-color: #1484d7; }
        #reactieForm .reactieCancelButton { margin-right: 10px; font-weight: bold; color: #0079d3; }
    `);

    function handleCollapse(event) {
        if (event.target.closest('a, button, .new-action-row, .userName, .date, .moderation-button-container')) {
            return;
        }
        if (window.getSelection().toString()) {
            return;
        }
        this.classList.toggle('thread-collapsed');
    }

    function transformComment(comment) {
        if (comment.classList.contains('transformed')) return;

        const reactieBody = comment.querySelector('.reactieBody');
        const header = reactieBody.querySelector('.reactieHeader');
        const content = reactieBody.querySelector('.reactieContent');

        reactieBody.addEventListener('click', handleCollapse.bind(comment));

        const avatarWrapper = document.createElement('div');
        avatarWrapper.className = 'new-avatar-wrapper';
        const originalAvatarImg = header.querySelector('.thumb img');
        if (originalAvatarImg) {
            avatarWrapper.appendChild(originalAvatarImg.cloneNode(true));
        }
        comment.prepend(avatarWrapper);

        const actionRow = document.createElement('div');
        actionRow.className = 'new-action-row';

        const replyButton = document.createElement('button');
        replyButton.innerHTML = `${replyIconSVG} <span>Reageer</span>`;
        const originalReplyLink = comment.querySelector('.reactieFooter a, .commentLink');
        if (originalReplyLink) {
            replyButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                originalReplyLink.click();
            });
        }
        actionRow.appendChild(replyButton);

        const shareButton = document.createElement('button');
        shareButton.innerHTML = `${shareIconSVG} <span>Share</span>`;
        actionRow.appendChild(shareButton);

        const reportLink = header.querySelector('.reportLink a');
        if (reportLink) {
            const overflowButton = document.createElement('a');
            overflowButton.href = reportLink.href;
            overflowButton.title = reportLink.title;
            overflowButton.innerHTML = overflowIconSVG;
            if (reportLink.getAttribute('rel') === 'popup:reactionReportPopup') {
                 overflowButton.setAttribute('rel', 'popup:reactionReportPopup');
            }
            actionRow.appendChild(overflowButton);
        }

        if (content) {
            content.after(actionRow);
        }

        comment.classList.add('transformed');
    }

    function processAllComments() {
        const comments = document.querySelectorAll('twk-reaction.reactie');
        comments.forEach(transformComment);
    }

    processAllComments();

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches('twk-reaction.reactie')) {
                            transformComment(node);
                        }
                        node.querySelectorAll('twk-reaction.reactie').forEach(transformComment);
                    }
                });
            }
        }
    });

    const reactieContainer = document.getElementById('reactieContainer');
    if (reactieContainer) {
        observer.observe(reactieContainer, {
            childList: true,
            subtree: true
        });
    }
})();
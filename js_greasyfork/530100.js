// ==UserScript==
// @name         Old Reddit Comment Expando
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds an expando button to show the first few comments under posts on old.reddit.com, with a next button, and RES dark mode support.
// @author       greenwithenvy
// @include     *.reddit.com/*
// @include     *./reddit.com/user/*/submitted
// @license WTFPL
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530100/Old%20Reddit%20Comment%20Expando.user.js
// @updateURL https://update.greasyfork.org/scripts/530100/Old%20Reddit%20Comment%20Expando.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .comment-expando {
            cursor: pointer;
            color: #888;
            margin-right: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .comment-preview {
            margin-top: 5px;
            padding: 5px;
            border-left: 2px solid #0079d3;
            background: #f6f7f8;
            font-size: 12px;
            color: #1a1a1b;
        }
        .comment-next {
            display: block;
            margin-top: 5px;
            cursor: pointer;
            color: #ff4500;
            font-size: 12px;
        }
        .comment-loading {
            color: #ff4500;
            font-size: 14px;
            text-align: center;
        }
        body.res-nightmode .comment-preview {
            background: #1a1a1b;
            color: #d7dadc;
            border-left: 2px solid #ff4500;
        }
        .comment-author {
            font-weight: bold;
            color: #0079d3;
            cursor: pointer;
        }
        body.res-nightmode .comment-author {
            color: #ffb000;
        }
    `);

    document.querySelectorAll('.thing.link').forEach(post => {
        let postUrl = post.querySelector('a.comments')?.href;
        if (!postUrl) return;

        let expandoBtn = document.createElement('span');
        expandoBtn.textContent = '[+ preview comments]';
        expandoBtn.className = 'comment-expando';
        expandoBtn.addEventListener('click', function() {
            if (expandoBtn.nextSibling && expandoBtn.nextSibling.classList.contains('comment-preview')) {
                expandoBtn.nextSibling.remove();
                expandoBtn.textContent = '[+ preview comments]';
                return;
            }
            loadComments(expandoBtn, postUrl);
        });
        post.querySelector('.flat-list.buttons')?.prepend(expandoBtn);
    });

    function loadComments(expandoBtn, postUrl) {
        let loadingText = document.createElement('div');
        loadingText.className = 'comment-loading';
        loadingText.textContent = 'Loading comments...';
        expandoBtn.after(loadingText);

        GM_xmlhttpRequest({
            method: 'GET',
            url: postUrl + '.json',
            onload: function(response) {
                loadingText.remove();
                let data = JSON.parse(response.responseText);
                let comments = data[1].data.children.filter(c => c.kind === "t1").map(c => c.data);

                let previewDiv = document.createElement('div');
                previewDiv.className = 'comment-preview';

                if (comments.length) {
                    let currentCommentIndex = 0;
                    previewDiv.innerHTML = formatComment(comments[currentCommentIndex], postUrl);

                    let nextBtn = document.createElement('span');
                    nextBtn.textContent = '[next]';
                    nextBtn.className = 'comment-next';
                    nextBtn.addEventListener('click', function() {
                        currentCommentIndex = (currentCommentIndex + 1) % comments.length;
                        previewDiv.innerHTML = formatComment(comments[currentCommentIndex], postUrl);
                        previewDiv.appendChild(nextBtn);
                    });

                    previewDiv.appendChild(nextBtn);
                } else {
                    previewDiv.innerHTML = '<p>No comments yet.</p>';
                }

                expandoBtn.textContent = '[- hide comments]';
                expandoBtn.after(previewDiv);
            }
        });
    }

    function formatComment(comment, postUrl) {
        let commentLink = `${postUrl}${comment.id}`;
        let commentBody = comment.body.length > 500 ? comment.body.substring(0, 500) + '...' : comment.body;
        let commentHtml = `<p><a href="${commentLink}" target="_blank" class="comment-author">${comment.author}</a>: ${commentBody}</p>`;
        return commentHtml;
    }
})();

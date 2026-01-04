// The MIT License (MIT)
// Copyright © 2023 artillect
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// ==UserScript==
// @name         kbin Improved Collapsible Comments for ios
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Improves the comment tree layout and adds a line that lets you collapse replies
// @author       solo
// @match        https://kbin.social/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469028/kbin%20Improved%20Collapsible%20Comments%20for%20ios.user.js
// @updateURL https://update.greasyfork.org/scripts/469028/kbin%20Improved%20Collapsible%20Comments%20for%20ios.meta.js
// ==/UserScript==

function toggleReplies(comment,expando) {
    // Collapse or expand comment
    if (comment.className.match(/collapsed/)) {
        // Expand comment
        comment.classList.remove('collapsed');
        // Remove number of children from header
        let header = comment.querySelector('header');
        let numChildrenSpan = header.querySelector('.numChildren');
        header.removeChild(numChildrenSpan);

        // Change + to -
        let icons = comment.querySelectorAll('.expando-icon');
        let icon = icons[icons.length-1];
        icon.className = 'expando-icon fas fa-minus';
    } else {
        // Collapse comment
        comment.classList.add('collapsed');

        // Get number of children
        let children = comment.querySelectorAll('.entry-comment');
        let numChildren = children.length;
        // Add number of children to header
        let header = comment.querySelector('header');
        let numChildrenSpan = document.createElement('span');
        numChildrenSpan.className = 'numChildren';
        if (numChildren == 1) {
            numChildrenSpan.innerHTML = '(' + numChildren + ' reply)';
        } else {
            numChildrenSpan.innerHTML = '(' + numChildren + ' replies)';
        }
        header.appendChild(numChildrenSpan);

        // Get expando icon
        let icons = comment.querySelectorAll('.expando-icon');
        let icon = icons[icons.length-1];
        // Change - to +
        icon.className = 'expando-icon fas fa-plus';
    }
}

function nestComments(comments,levels) {
    // Go through comments in reverse order
    for (let i = comments.length-1; i >= 0; i--) {
        // Add nested class to comment
        comments[i].classList.add('nested');
        // Add expando to comment
        let expando = document.createElement('div');
        expando.className = 'expando';
        // Add line to expando
        let line = document.createElement('div');
        line.className = 'threadLine';
        expando.appendChild(line);
        comments[i].appendChild(expando);

        // Add + icon to expando
        let icon = document.createElement('i');
        icon.className = 'expando-icon fas fa-minus';
        comments[i].appendChild(icon);

        // Add event listener to expando
        expando.addEventListener('click', function(){toggleReplies(comments[i],expando)});
        // Add event listener to header
        let header = comments[i].querySelector('header');
        header.addEventListener('click', function(){toggleReplies(comments[i],expando)});
        // Add event listener to icon
        icon.addEventListener('click', function(){toggleReplies(comments[i],expando)});

        for (let j = i-1; j >= 0; j--) {
            let comment = comments[i];
            let level = levels[i];
            let previousComment = comments[j];
            let previousLevel = levels[j];
            // If previous comment is the parent
            if (previousLevel == level-1) {
                // Insert this comment into the parent
                // Check if parent has a children container
                let children = previousComment.querySelector('.children');
                if (!children) {
                    // If not, create one
                    children = document.createElement('div');
                    children.className = 'children';
                    previousComment.appendChild(children);
                }
                // Insert comment into children container
                children.prepend(comment);
                break;
            }
        }
    }
}

function applyCommentStyles() {
    // Add styles to comments
    let styles = document.createElement('style');
    styles.innerHTML = `

    .comments div {
        border-left: none !important;
    }
    .entry-comment .children {
        gap: 8px;
    }
    .comment-level--1 {
        margin-bottom: 8px;
    }

    .author > header .timeago:before {
        content: 'OP ';
        color: var(--kbin-danger-color);
        font-weight: bold;
    }

    .collapsed .children, .collapsed .content, .collapsed footer, .collapsed .vote {
        height: 0;
        width: 0;
        opacity: 0 !important;
        display: none !important;
    }
    .entry-comment .children, .entry-comment .content, .entry-comment footer, .entry-comment .vote {
        opacity: 1;
        transition: opacity 0.2s ease;
        transition: height 0.2s ease;
    }
    .collapsed {
        grid-template-areas:"expando-icon avatar header"!important;
        grid-template-columns: 20px min-content auto!important;
        grid-template-rows: min-content!important;
        grid-row-gap: 0!important;
    }

    .entry-comment figure, .entry-comment header {
        transition: margin-left 0.2s ease;
    }

    /*.collapsed figure, .collapsed header {
        margin-left: 24px !important;
    }*/

    .collapsed .expando{
        grid-area: avatar !important;
    }

    .expando {
        cursor: pointer;
        grid-area: expando !important;
    }

    i.expando-icon {
        margin: auto;
        cursor: pointer;
    }

    .expando i:before {
        margin: auto;
    }

    .threadLine {
        background-color: #4a4a4a;
        transition: background-color 0.2s ease;
        width: 2px;
        height: 100%;
        margin: auto;
    }

    .collapsed .threadLine {
        display: none;
    }

    .comment-level--1 .threadLine {
        background-color: #24262a;
    }
    .comment-level--2 .threadLine {
        background-color: #71ac53;
    }
    .comment-level--3 .threadLine {
        background-color: #ffa500;
    }
    .comment-level--4 .threadLine {
        background-color: #538eac;
    }
    .comment-level--5 .threadLine {
        background-color: #6253ac;
    }
    .comment-level--6 .threadLine {
        background-color: #ac53ac;
    }
    .comment-level--7 .threadLine {
        background-color: #ac5353;
    }
    .comment-level--8 .threadLine {
        background-color: #2b7070;
    }
    .comment-level--9 .threadLine {
        background-color: #b9ab52;
    }
    .comment-level--10 .threadLine {
        background-color: grey;
    }

    .expando i {
        grid-area: expando-icon !important;
    }

    .expando i:before {
        color:#4a4a4a;
        transition: background-color 0.2s ease;
    }

    .expando:hover i:before {
        color:#d7dadc;
    }
    .expando:hover .threadLine {
        background-color: #d7dadc;
    }

    .entry-comment > figure {
        width: 20px;
    }

    .entry-comment > figure > a > img, .entry-comment > figure > a > .no-avatar {
        max-width: 20px!important;
        max-height: 20px!important;
        border-radius: 8px;
        border: 0px transparent !important;
    }
    @media (max-width: 420px) {
        .entry-comment {
            padding: 0 !important;
            grid-column-gap: 0px;
        }

        .expando {
            width: 12px;
        }

        .threadLine {
            width: 2px;
        }
    }

    @media (max-width: 1px) {
        .entry-comment {
            margin-left: 0 !important;
            color: red;
        }
    }
    .entry-comment {
        padding: 4px !important;
        border-color: transparent !important;
        grid-template-areas:
        "expando-icon avatar header vote"
        "expando body body body"
        "expando footer footer footer"
        "expando children children children";
        grid-template-columns: 20px 20px auto min-content;
        grid-template-rows: min-content auto auto;
        display: grid;
        margin-left: 0 !important;
    }
    .children .entry-comment {
        margin-left: 0 !important;
    }

    .entry-comment > .entry-comment {
        display: block;
    }

    .entry-comment .children {
        grid-area: children;
        display: flex;
        flex-direction: column;
    }

    .entry-comment header {
        cursor: pointer;
    }
    `;
    for (let i = 1; i < 10; i++) {
        styles.innerHTML += `
        blockquote.comment-level--${i} {
            margin-left: 0 !important;
        }
        `;
    }
    document.head.append(styles);
}

function applyToNewPosts() {
    // Get all comments
    let comments = document.querySelectorAll(".entry-comment:not(.nested)");
    // Get all comment levels
    let levels = [];
    for (let i = 0; i < comments.length; i++) {
        let level = comments[i].className.match(/comment-level--(\d)/)[1];
        levels.push(level);
    }

    nestComments(comments,levels);
}

(function () {
    let gmc = new GM_config({
        'id': 'improved-collapsible-comments',
        'title': 'Improved Collapsible Comments',
        'fields': {
            'headerToggle': {
                'label': 'Toggle replies by clicking header (WIP, not functional)',
                'type': 'checkbox',
                'default': true
            }
        }
    });

    GM_registerMenuCommand('Settings', () => {
        gmc.open();
    });

    applyToNewPosts();
    applyCommentStyles();
    // Observe for new posts
    let observer = new MutationObserver(applyToNewPosts);
    observer.observe(document.body, { childList: true, subtree: true });
})();

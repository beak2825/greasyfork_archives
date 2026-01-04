// ==UserScript==
// @name         Hide gerrit comment
// @version      0.1.9
// @author       yupnano(https://github.com/yupnano)
// @description  add a button "Hide comment"
// @description:zh-CN 增加一个按钮，可以方便的隐藏评论
// @license      MIT
// @include      https://gerrit*/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwXHfuMiyPYhXPv2J5H1gkRAvoZvLcjrBKTigr2e_X8A&s
// @grant        none
// @namespace https://greasyfork.org/users/1115435
// @downloadURL https://update.greasyfork.org/scripts/469806/Hide%20gerrit%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/469806/Hide%20gerrit%20comment.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var commentHide = false;
    var grDiffViewElement;
    var hideCommentButton;

    function addToogleCommentButton() {
        grDiffViewElement = document?.getElementById('app')?.shadowRoot
            ?.getElementById('app-element')?.shadowRoot
            ?.querySelector('main')
            ?.querySelector('gr-diff-view');

        var rightControls = grDiffViewElement?.shadowRoot
        ?.querySelector('gr-fixed-panel')
        ?.querySelector('.rightControls')

        if(!rightControls) {
            console.log('ToogleCommentScript: rightControls element not exist!');
            return;
        }

        var existed = !!rightControls.querySelector(".commentLoader");
        if(existed) {
            console.log('ToogleCommentScript: hideComment Button already added!');
            return;
        }

        hideCommentButton = document.createElement("span");
        hideCommentButton.innerHTML =`
        <span class="commentLoader">
          <gr-button link="" id="toggleComment" title="Toggle comment (shortcut: h)" accesskey="h" role="button">Hide Comment</gr-button>
        </span>
        <span class="separator"></span>
        `;

        rightControls.insertBefore(hideCommentButton, rightControls.firstChild);
        console.log('ToogleCommentScript: hideComment button added');

        hideCommentButton.onclick = function () {
            toggleComment();
        };
    }

    function toggleComment() {
        commentHide = !commentHide;
        processHideComments(commentHide);
    }

    function processHideComments(hide) {
        console.log('Hide gerrit comment: ' + hide);
        if (!hideCommentButton) return;
        hideCommentButton.querySelector('#toggleComment').innerText = hide ? 'Show Comment' : 'Hide Comment';
        grDiffViewElement?.shadowRoot
            ?.querySelector('gr-diff-host')?.shadowRoot
            ?.querySelectorAll('.comment-thread')
            ?.forEach(i => {i.style.display=(hide ? 'none' : '')});
    }

    window.addEventListener('load', function () {
        // addToogleCommentButton();
    })

    document.addEventListener('timing-report', (e) => {
        if (event.detail.name?.includes('DiffViewDisplayed')) {
        console.log("DiffViewDisplayed llllll");
            addToogleCommentButton();
            commentHide = false;
        }
    });

    navigation.addEventListener('navigate', (e) => {
        // console.log("ToogleCommentScript: navigate Hash Changed");
    })

    window.addEventListener('keydown', function (event) {
        console.log("ToogleCommentScript: keydown event:" + event.key);
        if(!grDiffViewElement) {
            return
        }

        // https://github.com/GerritCodeReview/gerrit/blob/f42b24c0dcab10bd9b8d823dbab5bc6bea4a0b4e/polygerrit-ui/app/utils/dom-util.ts#L445
        if(grDiffViewElement.shouldSuppressKeyboardShortcut(event)){
            return;
        }

        if(event.key == 'h') {
            toggleComment();
        }
    })

})();
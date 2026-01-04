// ==UserScript==
// @name         Set ClickUp RTL
// @namespace    http://www.sumit.co.il/
// @version      0.2
// @description  Sets ClickUp to RTL
// @author       Effy Teva
// @include      https://app.clickup.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509872/Set%20ClickUp%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/509872/Set%20ClickUp%20RTL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var AddGlobalStyle = function(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head)
            return;
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    AddGlobalStyle(`
    div.cu-comment__text {
  direction: rtl !important;
}

li.ql-list-item {
  direction: rtl !important;
}


input.cu-task-row-new__input {
  direction: rtl !important;
}

span.task-todo-item__name-text {
  direction: rtl !important;
}

textarea.cdk-textarea-autosize {
  text-align: right !important;
}

div.task-name-block {
  direction: rtl !important;
}

.ql-editor li>.ql-ui {
  margin-right: -25px !important;
}

span.cu-task-row-main__link-text-inner {
  direction: rtl !important;
}

div.cu-task-row-main__link-text {
  direction: rtl !important;
}

div.ql-editor.focus-visible {
  direction: rtl !important;
  text-align: right !important;
}

.cu-task-row-main__actions-inner {
  right: 0 !important;
  left: 0 !important;
}


.cu-comment-viewer-content:not(.cu-email-reply__content) .ql-rendered-list-container .ql-rendered-ordered-list:before {
  position: relative !important;
  margin-left: 0 !important;
}


.cu-editor-wrapper .cu-editor .ql-indent-1:not(.ql-direction-rtl) {
  padding-left: 0 !important;
  padding-right: 4.4em !important;
}

.cu-editor-wrapper .cu-editor .ql-indent-2:not(.ql-direction-rtl) {
  padding-left: 0 !important;
  padding-right: 6.6em !important;
}

.cu-editor-wrapper .cu-editor .ql-indent-3:not(.ql-direction-rtl) {
  padding-left: 0 !important;
  padding-right: 8.8em !important;
}

.cu-editor-wrapper .cu-editor .ql-indent-4:not(.ql-direction-rtl) {
  padding-left: 0 !important;
  padding-right: 11em !important;
}

.cu-editor-wrapper .cu-editor .ql-indent-5:not(.ql-direction-rtl) {
  padding-left: 0 !important;
  padding-right: 13.2em !important;
}

.cu-editor-wrapper .cu-editor .ql-indent-6:not(.ql-direction-rtl) {
  padding-left: 0 !important;
  padding-right: 15.4em !important;
}

.cu-editor-wrapper .cu-editor .ql-indent-7:not(.ql-direction-rtl) {
  padding-left: 0 !important;
  padding-right: 17.6em !important;
}

.cu-editor-wrapper .cu-editor .ql-indent-8:not(.ql-direction-rtl) {
  padding-left: 0 !important;
  padding-right: 18em !important;
}


.cu-dashboard-doc-title__text,
.cu-dashboard-doc-title .cu-editable__input {
  direction: rtl;
}

.ql-editor ol li, .ql-editor ul li, .cu-editor ol li, .cu-editor ul li {
    padding-left: 0;
    padding-right: 1.75em;
}

.ql-editor li>.ql-ui {
    margin-right: -55px !important;
}

.cu-draft-view.cu-draft-view_embed .cu-draft-view__title {
direction:rtl;
}

.cu-task-title__title,
.cu-task-title__overlay {
direction:rtl;
}
    `);
})();
// ==UserScript==
// @name          DTF Karma Fix
// @description   Возвращает структуру старой кармы
// @author        proviceunify
// @homepage      https://dtf.ru/u/123718-provice-unify/1522594-fix-karmy-dtf-v1-0
// @include       http://dtf.ru/*
// @include       https://dtf.ru/*
// @include       http://*.dtf.ru/*
// @include       https://*.dtf.ru/*
// @run-at        document-start
// @version       0.9
// @licence       CC0
// @namespace https://greasyfork.org/users/1001441
// @downloadURL https://update.greasyfork.org/scripts/457008/DTF%20Karma%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/457008/DTF%20Karma%20Fix.meta.js
// ==/UserScript==
(function() {var css = [":root {",
"    --karma-margins: 10px;",
"}",
".comment__content > .comment__copy-link {",
"    order: 0 !important;",
"}",
".comment__text {",
"    margin-top: 17px;",
"}",
".comment__content > .comment__break {",
"    order: 6;",
"    display: flex;",
"}",
".comment__load-more {",
"    order: 7 !important;",
"}",
".comment__icon-action {",
"    order: -1;",
"}",
".comment__break + .comment__detail {",
"    margin-left: 0;",
"    order: -2;",
"}",
".comment__content > .like-button--action-like {",
"    order: 4;",
"}",
".comment__content > div[air-module] {",
"    order: 2;",
"}",
".comment__content > div[air-click] {",
"    order: 1;",
"}",
".comment__content > .like-button--action-like,",
".like-button--active {",
"    margin-right: 16px !important;",
"}",
".comment__content > .like-button--action-dislike,",
".like-button--active {",
"    order: 3;",
"    margin-right: var(--karma-margins) !important;",
"}",
".like-button--action-like:not(:has(span.like-button__count)) {",
"    margin-left: 19px;",
"}",
".like-button__lottie {",
"    visibility: hidden !important;",
"}",
".like-button__icon {",
"    visibility: visible !important;",
"}",
".like-button {",
"    display: flex;",
"    flex-direction: row-reverse;",
"}",
".like-button--active {",
"    margin-right: 0 !important;",
"}",
".like-button__count {",
"    min-width: 9px;",
"    margin-left: 0;",
"    margin-right: var(--karma-margins);",
"}",
".content-footer__item:has(button.like-button--action-like) {",
"    margin-right: 0;",
"    order: 3;",
"}",
".content-footer__item:has(button.like-button--action-dislike) {",
"    margin-right: var(--karma-margins) !important;",
"}",
".content-footer__item--right {",
"    margin-right: 20px !important;",
"    order: 2 !important;",
"}",
".like-button--action-dislike {",
"    --like-color-text-hover: #f0303d;",
"    --like-color-background-hover: #e5545e;",
"    --like-color-active: #e65151;",
"}",
".like-button--action-like {",
"    --like-color-text-hover: #3f904a;",
"    --like-color-background-hover: #479d52;",
"    --like-color-active: #479d52;",
"    margin-left: 0;",
"}",
"symbol#v_like > path {",
"    d: path('M4.4,13l5.4-5.9c0.1-0.1,0.3-0.1,0.4,0l5.4,5.8');",
"}",
"symbol#v_like_active > path {",
"    d: path('M4.4,13l5.4-5.9c0.1-0.1,0.3-0.1,0.4,0l5.4,5.8');",
"    fill: transparent;",
"    stroke: currentColor;",
"    stroke-linecap: round;",
"    stroke-linejoin: round;",
"    stroke-width: 1.5;",
"    scale: 1.2;",
"}",
"symbol#v_dislike > path {",
"    d: path('M15.6,7l-5.4,5.9c-0.1,0.1-0.3,0.1-0.4,0L4.4,7');",
"}",
"symbol#v_dislike_active > path {",
"    d: path('M15.6,7l-5.4,5.9c-0.1,0.1-0.3,0.1-0.4,0L4.4,7');",
"    fill: transparent;",
"    stroke: currentColor;",
"    stroke-linecap: round;",
"    stroke-linejoin: round;",
"    stroke-width: 1.5;",
"}"
].join("\n");
if (typeof GM_addStyle != 'undefined') {
 GM_addStyle(css);
 } else if (typeof PRO_addStyle != 'undefined') {
 PRO_addStyle(css);
 } else if (typeof addStyle != 'undefined') {
 addStyle(css);
 } else {
 var node = document.createElement('style');
 node.type = 'text/css';
 node.appendChild(document.createTextNode(css));
 var heads = document.getElementsByTagName('head');
 if (heads.length > 0) { heads[0].appendChild(node);
 } else {
 // no head yet, stick it whereever document.documentElement.appendChild(node);
 }
}})();
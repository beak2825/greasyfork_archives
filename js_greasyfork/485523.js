// ==UserScript==
// @name            Dark greasyfork
// @namespace       https://greasyfork.org/users/821661
// @match           https://greasyfork.org/*
// @match           https://sleazyfork.org/*
// @grant           none
// @version         1.1.4
// @author          hdyzen
// @description     theme dark for greasefork
// @license         MIT
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/485523/Dark%20greasyfork.user.js
// @updateURL https://update.greasyfork.org/scripts/485523/Dark%20greasyfork.meta.js
// ==/UserScript==
'use strict';

function addCSS(text) {
    document.documentElement.insertAdjacentHTML('beforeend', `<style rel='stylesheet'>${text}</style>`);
}

// Style
addCSS(`
:root {
    --dark-1: rgb(29, 32, 37) !important;
    --dark-2: rgb(40, 44, 52) !important;
    --dark-3: rgb(37, 41, 49) !important;
    --dark-4: rgb(33, 36, 43) !important;
    --blue-1: rgb(82, 139, 255) !important;
    --blue-2: rgb(97, 175, 239) !important;
    --blue-pool: rgb(86, 182, 194) !important;
    --lavender: rgb(198, 120, 221) !important;
    --green: rgb(152, 195, 121) !important;
    --pink: rgb(224, 108, 117) !important;
    --light-brown: rgb(209, 154, 102) !important;
    --red: rgb(190, 80, 70) !important;
    --yellow: rgb(235, 215, 17) !important;
    --light-yellow: rgb(229, 192, 123) !important;
    --blue-ice: rgb(171, 178, 191) !important;
    --light-gray: rgb(204, 204, 204) !important;
    --light-green: rgba(130, 255, 130, 0.6) !important;
    --light-red: rgba(255, 130, 130, 0.6) !important;
    --translucent: rgba(255, 255, 255, 0.3) !important;
    --black: rgba(0, 0, 0, 1) !important;
    --default-border-radius: 5px;
}
body {
    background-color: var(--dark-3) !important;
    color: var(--light-gray) !important;
}
#main-header,
#main-header a,
#main-header a:visited,
#main-header a:active {
    color: var(--light-gray) !important;
}
nav nav {
    background-color: var(--dark-3) !important;
    border: 1px solid var(--dark-2) !important;
    box-shadow: 0 0 5px var(--dark-2) !important;
}
a:not(.install-link, .install-help-link) {
    color: var(--pink) !important;
}
#main-header {
    background-image: none !important;
    background-color: var(--dark-1) !important;
}
.script-list,
.user-list,
.text-content,
.discussion-list,
.list-option-group ul,
#script-info,
.discussion-read,
#discussion-locale {
    background-image: unset !important;
    background-color: var(--dark-1) !important;
    box-shadow: 0 0 5px var(--dark-2) !important;
    border: 1px solid var(--dark-2) !important;
    border-radius: var(--default-border-radius) !important;
}
.block-button {
    background-color: var(--dark-2) !important;
    border: 1px solid var(--dark-3) !important;
    color: var(--light-gray) !important;
}
.user-content,
#script_version_code {
    background-image: unset !important;
    background-color: var(--dark-1) !important;
    border: 1px solid var(--dark-2) !important;
}
#script_version_code {
    color: var(--light-gray) !important;
}
.sidebar-search input[type='search'],
.home-search input[type='search'],
.list-option-button,
input[type='search'],
#language-selector-locale,
form.new_user input[type='text'],
form.new_user input[type='email'],
form.new_user input[type='password'],
#favorite-groups {
    background-color: var(--dark-4) !important;
    border: 1px solid var(--dark-2) !important;
    color: var(--blue-ice) !important;
    border-radius: var(--default-border-radius) !important;
}
.notice {
    background-color: var(--dark-1);
    border-left: 6px solid var(--blue-pool);
}
form.external-login-form,
form.new_user {
    background-color: var(--dark-3);
    border: 1px solid var(--dark-2);
}
form.new_user input[type='submit'] {
    background-color: var(--blue-pool);
    color: #fff;
    background-image: unset;
}
.list-option-button:hover,
.list-option-button:focus {
    background-image: unset !important;
    background-color: var(--dark-2) !important;
}
.sidebar-search input[type='search']:focus-visible,
.home-search input[type='search']:focus-visible {
    background-color: var(--dark-3) !important;
    border: 1px solid var(--blue-pool) !important;
    outline: none !important;
}
input[type='submit'] {
    background-color: var(--dark-3) !important;
    color: var(--light-gray) !important;
    border: 1px solid var(--dark-2) !important;
}
input[type='submit']:hover {
    background-color: var(--dark-2) !important;
}
.sidebar-search input[type='search'] {
    font-size: 14px !important;
}
.list-option-group ul {
    background-color: var(--dark-1) !important;
}
.list-option-group .list-current,
.tabs .current {
    border-color: var(--red) !important;
    background-image: unset !important;
    background-color: var(--dark-2) !important;
}
.list-option-group a:hover,
.list-option-group a:focus {
    background-image: unset !important;
    background-color: var(--dark-2) !important;
    box-shadow: unset !important;
}
input[type='checkbox'] {
    accent-color: var(--blue-1) !important;
}
input[type='radio'] {
    accent-color: var(--blue-1) !important;
}
.script-list li:not(.ad-entry) {
    border: 1px solid var(--dark-3);
}
.pagination > *,
.script-list + .pagination > *,
.user-list + .pagination > * {
    background-color: var(--dark-2) !important;
}
.pagination .current,
.pagination .gap {
    background-color: transparent !important;
}
a.next_page,
.pagination a:not(.current) {
    color: var(--red) !important;
}
.previewable textarea,
#discussion_comments_attributes_0_text {
    background-color: var(--dark-2) !important;
    border: 1px solid var(--dark-3) !important;
    color: var(--light-gray) !important;
}
#discussion_comments_attributes_0_text:focus-visible {
    outline: none !important;
    border: 1px solid var(--dark-3) !important;
}
.rating-icon {
    background-color: var(--dark-3) !important;
}
.rating-icon-bad,
.bad-rating-count {
    color: var(--red) !important;
    border-color: currentColor !important;
}
.rating-icon-ok,
.ok-rating-count {
    color: var(--yellow) !important;
    border-color: currentColor !important;
}
.rating-icon-good,
.good-rating-count {
    color: var(--green) !important;
    border-color: currentColor !important;
}
pre,
code {
    border: 1px solid var(--dark-2) !important;
}
code {
    background-color: var(--dark-1) !important;
}
li.L1,
li.L3,
li.L5,
li.L7,
li.L9,
.diff li.unchanged:nth-child(odd) {
    background-color: var(--dark-3) !important;
}
.diff ul {
    background-color: var(--dark-1) !important;
}
.diff li.del {
    background: rgba(255, 119, 119, 0.6) !important;
    color: rgb(30, 0, 0) !important;
}
.diff li.ins {
    background: rgba(221, 255, 221, 0.6) !important;
    color: rgb(0, 30, 5) !important;
}
.diff li:hover {
    background: unset;
}
.com {
    color: var(--lavender) !important;
}
.clo,
.opn,
.pun {
    color: var(--yellow) !important;
}
.kwd {
    color: var(--blue-2) !important;
}
.str {
    color: var(--green) !important;
}
.pln {
    color: var(--light-yellow) !important;
}
.lit {
    color: var(--pink) !important;
}
.typ {
    color: var(--blue-pool) !important;
}
::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
}
::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2) !important;
}
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 4px !important;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2) !important;
}
::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0.2) !important;
}
::-webkit-scrollbar-button {
    display: none !important;
}
.validation-errors {
    border-color: var(--light-yellow) !important;
    background-color: var(--dark-3) !important;
}

`);

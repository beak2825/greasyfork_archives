// ==UserScript==
// @name Greasy Fork Dark Theme(User Style)
// @namespace -
// @version 1.9
// @description changes greasy/sleazy fork theme to dark
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*.greasyfork.org/*
// @match *://*.sleazyfork.org/*
// @downloadURL https://update.greasyfork.org/scripts/437642/Greasy%20Fork%20Dark%20Theme%28User%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437642/Greasy%20Fork%20Dark%20Theme%28User%20Style%29.meta.js
// ==/UserScript==

(function() {
let css = `
:root {
 --default-main: rgb(240, 135, 0);
 --defailt-main-2: rgb(210, 140, 6);
 --header-color: rgb(5, 5, 5)
}

.ad-entry, .adsbygoogle, .ad-content {
 display: none !important
}

:not(:lang(he)):not(:lang(ar)):not(:lang(ug)), body:lang(ar) #main-header, body:lang(he) #main-header, body:lang(ug) #main-header {
 color: rgb(191, 191, 191);
}

#main-header {
 background-color: var(--default-main);
 background-image: radial-gradient(var(--defailt-main-2), var(--default-main));
}

#main-header h1 {
 color: var(--header-color);
 padding: 6px 4px;
}

#main-header, #main-header a, #main-header a:active, #main-header a:visited {
 color: var(--header-color);
}

#main-header, #main-header a, #main-header a:active, #main-header a {
 color: var(--header-color);
}

#site-nav > nav a:hover {
 color: rgb(255, 255, 255);
 text-decoration: underline !important;
}

.sign-out-link {
 color: var(--header-color) !important;
}

.report-link.report-link-abs::before {
 content: "🚩 ";
}

.report-link.report-link-abs {
 box-shadow: rgba(221, 46, 68, 0.52) 0px 0px 5px;
 background-color: rgba(36, 36, 36, 0.9);
 border: 0.16em solid rgb(217, 29, 53);
 color: rgb(230, 33, 58) !important;
 padding: 1px 4px 2px 0px;
 letter-spacing: 0.029em;
 text-decoration: none;
 border-radius: 5px;
 font-weight: 600;
 scale: 0.9;
}

.report-link.report-link-abs:lang(ar), .report-link.report-link-abs:lang(ug), .report-link.report-link-abs:lang(he) {
 direction: ltr;
 margin-right: 90.46%;
}

.tabs a {
 transition: 300ms
}

.tabs .current {
 border-top: 7px solid var(--default-main) !important;
 border-radius: 0px 0px 4px 4px;
}

.tabs .current, .tabs > :not(.current) a:focus, .tabs > :not(.current) a:hover {
 background: rgba(134, 134, 134, 0.03) none repeat scroll 0% 0%;
 box-shadow: rgba(0, 0, 0, 0.38) 0px 1px;
 border-radius: 0px 0px 4px 4px;
}

#script-info {
 border: 1px solid rgb(21, 21, 21);
 background-color: rgb(19, 19, 19);
 box-shadow: rgb(0, 0, 0) 0px 0px 5px;
}

.code-container {
 border: 1px solid rgb(21, 21, 21);
 background-color: rgb(19, 19, 19);
 box-shadow: rgb(0, 0, 0) 0px 0px 5px;
 border-radius: 4px;
 scrollbar-color: rgb(30, 30, 30) rgb(15, 15, 15) !important;
}

.com {
 background-color: rgb(19, 19, 19);
 color: rgb(108, 108, 108) !important
}

.pun, .pln {
 color: rgb(191, 191, 191) !important;
}

.opn {
 color: rgb(202, 182, 75) !important;
}

.clo {
 color: rgb(52, 173, 210) !important;
}

.str {
 color: rgb(183, 181, 75) !important;
}

.kwd {
 color: rgb(69, 206, 69) !important;
}

.lit {
 color: rgb(196, 97, 200) !important;
}

.typ {
 color: rgb(100, 155, 215) !important;
}

li.L1, li.L3, li.L5, li.L7, li.L9 {
 background-color: rgb(19, 19, 19) !important;
}

.linenums {
 border: 1px solid rgb(21, 21, 21);
 background-color: rgb(19, 19, 19) !important;
 border-radius: 4px;
}

.prettyprint.linenums.lang-js.prettyprinted {
 border: none;
}

#ace-editor {
 border: 1px solid rgb(22, 22, 22);
 background-color: rgb(19, 19, 19);
 overflow: unset;
 border-radius: 4px;
}

.ace_gutter-cell {
 background-color: rgb(11, 11, 11);
}

.ace-tm .ace_gutter-active-line {
 background-color: rgb(21, 21, 21);
}

.ace_scroller {
 background: rgb(21, 21, 21) !important;
}

.ace_scrollbar-inner {
 scrollbar-color: rgb(30, 30, 30) rgb(15, 15, 15) !important;
}

.ace-tm .ace_comment {
 color: rgb(115, 113, 106) !important;
}

.ace-tm .ace_keyword.ace_operator {
 color: rgb(121, 158, 202) !important;
}

.ace-tm .ace_entity.ace_name.ace_function {
 color: rgb(69, 200, 50) !important;
}

.ace-tm .ace_support.ace_function {
 color: rgb(223, 65, 65) !important;
}

.ace-tm .ace_storage, .ace-tm .ace_keyword, .ace-tm .ace_support.ace_constant {
 color: rgb(40, 185, 200) !important;
}

.ace-tm .ace_string {
 color: rgb(202, 182, 75) !important;
}

.ace_identifier, .ace_paren.ace_lparen, .ace_paren.ace_rparen, .ace_punctuation.ace_operator {
 color: rgb(217, 215, 215) !important;
}

.ace-tm .ace_support.ace_type, .ace-tm .ace_support.ace_class {
 color: rgb(174, 173, 72) !important;
}

.ace-tm .ace_variable {
 color: rgb(57, 177, 202) !important;
}

.ace-tm .ace_constant {
 color: rgb(14, 200, 52) !important;
}

.ace-tm .ace_constant.ace_numeric {
 color: rgb(182, 86, 196) !important;
}

.diff {
 max-height: none !important;
 border: 2px solid rgb(15, 15, 15);
 border-radius: 5px;
}

.diff ul {
 background: rgb(15, 15, 15) none repeat scroll 0% 0%;
}

.diff li.ins {
 background: rgba(66, 219, 34, 0.42) none repeat scroll 0% 0%;
}

.diff ins strong {
 background: rgba(29, 215, 14, 0.44) none repeat scroll 0% 0%;
}

.diff li.diff-block-info {
 background: rgb(19, 18, 18) none repeat scroll 0px 0px;
}

.diff li:hover {
 background: rgba(0, 0, 0, 0.19) none repeat scroll 0% 0%;
}

.diff li.del, .diff del strong {
 background: rgba(240, 0, 0, 0.29) none repeat scroll 0% 0%;
}

.diff li.ins:hover, .diff ins strong:hover {
 background: rgba(8, 255, 0, 0.19) none repeat scroll 0% 0%;
}

.diff li.del:hover, .diff del strong:hover {
 background: rgba(255, 0, 0, 0.19) none repeat scroll 0% 0% !important;
}

#script-info header h2 {
 color: rgb(191, 191, 191);
}

.inline-script-stats dt {
 color: rgb(191, 191, 191);
}

.tabs .current, .tabs > :not(.current) a:focus, .tabs > :not(.current) a:hover {
 color: rgb(191, 191, 191) !important;
}

dd, dt {
 color: rgb(191, 191, 191);
}

.current {
 color: rgb(191, 191, 191);
}

#script-description {
 color: rgb(191, 191, 191) !important;
}

#script-links {
 color: rgb(191, 191, 191) !important;
}

#script-info header h2 {
 color: rgb(191, 191, 191);
}

#script-info > :last-child, .discussion-list > :last-child, .text-content > :last-child, .user-list > :last-child {
 color: rgb(191, 191, 191) !important;
}

#script-stats {
 color: rgb(191, 191, 191) !important;
}

#script-feedback-suggestion {
 color: rgb(191, 191, 191) !important;
}

.discussion-meta-item {
 margin-left: 10%;
}

#language-selector-locale {
 color: rgb(191, 191, 191);
}

.external-login {
 color: rgb(191, 191, 191);
}

.script-description.description {
 color: rgb(191, 191, 191);
}

.badge.badge-js {
 color: rgb(17, 17, 17) !important;
}

.badge.badge-js {
 color: rgb(187, 187, 187) !important;
}

.list-option-group .list-current {
 color: rgb(191, 191, 191);
}

.tabs .current {
 color: rgb(191, 191, 191);
}

.sidebarred-main-content {
 color: rgb(191, 191, 191);
}

.open-sidebar, .close-sidebar {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(23, 23, 23);
}

.sidebar {
 background-color: rgb(19, 19, 19);
 color: rgb(191, 191, 191);
}

.sidebar-search input[type="search"] {
 color: rgb(191, 191, 191);
}

.width-constraint {
 color: rgb(191, 191, 191);
}

a.discussion-title {
 color: rgb(191, 191, 191);
}

.discussion-title:hover {
 color: rgb(172, 172, 172);
}

.super-title {
 color: rgb(191, 191, 191);
}

.rating-icon {
 color: rgb(191, 191, 191);
}

.bad-rating-count, .good-rating-count, .ok-rating-count {
 color: rgb(191, 191, 191) !important;
}

input[type=search] {
 color: rgb(191, 191, 191) !important;
}

figure {
 background-color: rgb(19, 19, 19);
 box-shadow: rgba(0, 0, 0, 0.55) 0px 3px 5px;
}

body {
 color: rgb(191, 191, 191);
}

button {
 text-rendering: optimizelegibility;
 color: rgb(191, 191, 191);
}

input {
 color: rgb(191, 191, 191);
}

select {
 color: rgb(191, 191, 191);
}

textarea {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(21, 21, 21);
 border-radius: 4px;
 color: rgb(191, 191, 191);
}

select {
 color: rgb(191, 191, 191);
}

h2 {
 color: rgb(191, 191, 191);
}

h3 {
 color: rgb(191, 191, 191);
}

h4 {
 color: rgb(191, 191, 191);
}

h5 {
 color: rgb(191, 191, 191);
}

h6 {
 color: rgb(191, 191, 191);
}

span {
 color: rgb(191, 191, 191);
}

p {
 color: rgb(191, 191, 191);
}

.user-content {
 background: rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(13, 13, 13), rgb(21, 21, 21) 1em) repeat scroll 0% 0%;
 border-radius: 8px;
 border: 1px solid rgb(25, 25, 25);
}

#user_name, #user_password_confirmation {
 background: rgb(19, 19, 19);
 border: 1px solid rgb(26, 26, 26);
}

#user_profile {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(22, 22, 22);
 border-radius: 4px;
}

#user_profile:focus {
 background-color: rgb(19, 19, 19);
 border: 1px solid var(--default-main);
 border-radius: 4px;
}

.inline-form.external-login-form {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(22, 22, 22);
}

form.external-login-form {
 user-select: none;
}

.external-login-container .google_oauth2-login {
 background-color: rgba(16, 151, 232, 0.19);
 box-shadow: rgba(20, 89, 198, 0.1) 0px 0px 15px;
 border: 1px solid rgba(19, 77, 215, 0.5);
 border-radius: 4px;
 cursor: pointer;
}

.external-login-container .gitlab-login {
 background-color: rgba(15, 15, 15, 0.93);
 box-shadow: rgba(0, 0, 0, 0.32) 0px 0px 15px;
 border: 1px solid rgb(0, 0, 0);
 border-radius: 4px;
 cursor: pointer;
}

.external-login.github-login {
 background-color: rgba(79, 79, 79, 0.42);
 box-shadow: rgba(49, 49, 49, 0.32) 0px 0px 15px;
 border: 1px solid rgb(23, 21, 22);
 border-radius: 4px;
 cursor: pointer;
}

form.new_user {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(21, 21, 21);
}

form.new_user ~ a {
 line-height: 170%;
}

form.new_user {
 background-color: rgb(19, 19, 19);
 background-image: linear-gradient(rgb(21, 21, 21), rgb(19, 19, 19));
 box-shadow: rgba(17, 17, 17, 0.53) 0px 0px 5px;
 cursor: pointer;
}

form.new_user input[type="submit"] {
 background-color: var(--default-main);
 background-image: radial-gradient(var(--defailt-main-2), var(--default-main));
}

.actions > input {
 color: rgb(227, 227, 227) !important;
}

#user_email, #user_password {
 color: rgb(10, 10, 10);
}

#user_email {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(25, 25, 25);
}

#user_password {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(25, 25, 25);
}

#edit_user > div > #user_email {
 color: rgb(191, 191, 191);
}

form.new_user input[type="email"], form.new_user input[type="password"], form.new_user input[type="text"] {
 border-radius: 4px;
}

.modal__container {
 background-color: rgb(19, 19, 19);
}

.micromodal-slide[aria-hidden="false"] .modal__container {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(26, 26, 26);
}

.modal__title {
 font-weight: 800;
}

.modal__btn-primary {
 background: rgba(0, 0, 0, 0) linear-gradient(rgb(32, 96, 11), rgba(0, 82, 0, 0.5)) repeat scroll 0% 0%;
}

.notice {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(22, 22, 22);
 border-left-color: rgb(22, 22, 22);
 border-left-style: solid;
 border-left-width: 1px;
 border-left: 5px solid #31708f;
 border-radius: 0px 6px 6px 0px;
}

.announcement, .announcement input {
 background: rgb(21, 21, 21);
 padding: 2px;
 border: 1px solid rgb(24, 24, 24);
 border-radius: 4px;
}

#deleted-note, #reported-note, #version-note {
 background-color: rgb(17, 17, 17);
 border: 2px dotted var(--default-main);
}

.validation-errors {
 background-color: rgb(28, 28, 28);
}

.change-script-set section {
 border-bottom: 1px solid rgb(32, 32, 32);
}

.script-list li:not(.ad-entry) {
 border-bottom: 1px solid rgb(19, 19, 19);
}

.install-link {
 background: rgba(0, 0, 0, 0) linear-gradient(rgb(32, 96, 11), rgba(0, 82, 0, 0.5)) repeat scroll 0% 0%;
 border-radius: 5px;
 margin-right: 5px;
 margin-left: 5px;
}

.install-link:lang(ar), .install-link:lang(ug), .install-link:lang(he) {
 border-radius: 5px;
}

.install-help-link {
 background: rgba(0, 0, 0, 0) linear-gradient(rgb(44, 128, 17), rgba(0, 111, 0, 0.5)) repeat scroll 0% 0%;
 border-radius: 5px;
}

.install-help-link:lang(ar), .install-help-link:lang(ug), .install-help-link:lang(ug) {
 border-radius: 5px;
}

.install-link:hover {
 background: rgba(0, 0, 0, 0) linear-gradient(rgb(37, 111, 12), rgba(0, 82, 0, 0.5)) repeat scroll 0% 0%;
}

.install-help-link:hover {
 background: rgba(0, 0, 0, 0) linear-gradient(rgb(51, 142, 20), rgba(0, 117, 0, 0.5)) repeat scroll 0% 0%;
}

.install-link, .install-help-link {
 user-select: none;
}

nav nav {
 box-shadow: rgb(0, 0, 0) 0px 0px 5px;
 border: 1px solid var(--default-main);
 background-color: var(--defailt-main-2);
 border-radius: 4px;
}

#language-selector-locale {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(21, 21, 21);
 border-radius: 4px;
}

.home-search input[type="search"] {
 background-color: #0f0f0f;
 border-color: #1e1e1e;
 border-radius: 4px;
 color: #fff9;
}

.discussion-list, .script-list, .text-content, .user-list {
 box-shadow: rgba(0, 0, 0, 0.76) 0px 0px 5px;
 background-color: rgb(15, 15, 15);
 border: 1px solid rgb(19, 19, 19);
}

.list-option-group ul {
 box-shadow: rgba(0, 0, 0, 0.38) 0px 0px 5px;
 border: 1px solid rgba(28, 28, 28, 0.17);
 border-radius: 5px;
 background-color: rgb(19, 19, 19);
}

.list-option-group a:focus, .list-option-group a:hover {
 background: rgba(0, 0, 0, 0) linear-gradient(rgb(38, 38, 38), rgb(13, 13, 13)) repeat scroll 0% 0%;
 box-shadow: rgb(26, 26, 26) 0px -1px inset, rgb(19, 19, 19) 0px 1px inset;
}

.list-option-group .list-current {
 background: rgba(0, 0, 0, 0) linear-gradient(rgb(28, 28, 28), rgb(17, 17, 17)) repeat scroll 0% 0%;
 border-left: 7px solid var(--default-main);
}

.list-option-button:focus, .list-option-button:hover {
 background: rgba(0, 0, 0, 0) linear-gradient(rgb(43, 43, 43), rgb(30, 30, 30)) repeat scroll 0% 0%;
}

.list-option-button {
 background-color: rgb(21, 21, 21);
 border-radius: 5px;
 color: rgb(198, 198, 198) !important;
 border: 1px solid rgb(28, 28, 28);
}

.discussion-list-logged-in .discussion-read {
 background-color: rgb(19, 19, 19);
}

.discussion-list-item {
 border-top: 1px solid rgb(19, 19, 19);
}

.script-description.description {
 background-color: rgb(13, 13, 13);
 padding: 5px;
 border: 1px solid rgb(21, 21, 21);
 border-radius: 4px;
}

.rating-icon-good {
 border-color: rgb(77, 166, 77);
 box-shadow: rgba(41, 221, 15, 0.51) 0px 0px 5px;
 background-color: rgba(26, 204, 26, 0.54);
}

.rating-icon-ok {
 border-color: rgb(183, 152, 77);
 box-shadow: rgba(238, 193, 17, 0.51) 0px 0px 5px;
 background-color: rgba(234, 199, 10, 0.54);
}

.rating-icon-bad {
 border-color: rgb(183, 77, 77);
 box-shadow: rgba(238, 17, 17, 0.51) 0px 0px 5px;
 background-color: rgba(234, 10, 10, 0.54);
}

.good-rating-count {
 border-color: rgba(0, 255, 0, 0.3);
 box-shadow: rgba(41, 221, 15, 0.22) 0px 0px 5px;
 background-color: rgba(14, 225, 14, 0.26);
}

.ok-rating-count {
 background-color: rgba(225, 225, 0, 0.22);
 border-color: rgba(234, 234, 0, 0.37);
 box-shadow: rgba(221, 179, 15, 0.24) 0px 0px 5px;
}

.bad-rating-count {
 background-color: rgba(255, 0, 0, 0.23);
 border-color: rgba(234, 0, 0, 0.33);
 box-shadow: rgba(221, 15, 15, 0.41) 0px 0px 5px;
}

.badge {
 padding: 0.2px 0.5ex;
}

.badge.badge-js {
 background-color: rgba(36, 36, 36, 0.9);
 box-shadow: rgba(221, 179, 15, 0.38) 0px 0px 5px;
 border: 0.16em solid rgb(204, 153, 0);
 border-radius: 4px;
 color: rgb(204, 153, 0) !important;
 font-weight: 600;
}

.badge.badge-css {
 background-color: rgba(36, 36, 36, 0.9);
 box-shadow: rgba(15, 86, 221, 0.38) 0px 0px 5px;
 border: 0.16em solid rgb(0, 99, 204);
 border-radius: 4px;
 color: rgb(0, 99, 204) !important;
 font-weight: 600;
}

.badge-author {
 background-color: rgba(36, 36, 36, 0.9);
 box-shadow: rgba(41, 221, 15, 0.29) 0px 0px 5px;
 border: 0.12em solid rgb(34, 151, 1);
 color: rgb(48, 196, 27) !important;
 border-radius: 5px;
 font-weight: 600;
}

.badge-banned {
 background-color: rgba(36, 36, 36, 0.9);
 box-shadow: rgba(221, 15, 15, 0.51) 0px 0px 5px;
 border: 0.12em solid rgb(193, 15, 15);
 color: rgb(191, 26, 26) !important;
 border-radius: 5px;
 font-weight: 600;
}

.badge-moderator {
 background-color: rgba(36, 36, 36, 0.9);
 box-shadow: rgba(19, 94, 210, 0.5) 0px 0px 5px;
 border: 0.12em solid rgb(18, 93, 210);
 border-radius: 5px;
 color: rgb(17, 95, 217) !important;
 font-weight: 600;
}

.script-type {
 box-shadow: rgba(221, 160, 15, 0.29) 0px 0px 5px;
 background-color: rgba(36, 36, 36, 0.9);
 border: 0.16em solid rgb(172, 81, 0);
 color: rgb(221, 102, 15) !important;
 padding: 0.8px 0.5ex 2px 2px;
 font-variant: all-petite-caps;
 border-radius: 4px;
 position: relative;
 font-weight: 800;
 margin-left: 1ex;
 font-size: 70%;
 top: -0.2ex;
}

#home-top-sites a {
 color: var(--default-main);
 text-decoration: none;
}

#home-top-sites a:hover {
 text-decoration: underline;
}

#control-panel h3, #user-discussions-on-scripts-written h3, #user-discussions h3, #user-conversations h3, #user-script-sets-section h3, #user-script-list-section h3, #user-deleted-script-list-section h3, #script-content h3, .text-content h3, #user-library-list-section h3, .sidebarred-main-content h3 {
 font-variant: all-petite-caps;
 font-weight: 800;
}

#add-additional-info {
 color: rgb(221, 221, 221);
}

#script-version-additional-info-0 {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(11, 11, 11);
 border-radius: 5px;
}

.expander {
 background-color: rgb(28, 28, 28);
 text-decoration: underline;
 border: 1px solid rgb(35, 35, 35);
 margin-top: -8px !important;
 padding: 1px;
}

#script_version_code {
 background-color: rgb(19, 19, 19);
 border-radius: 5px;
 border: 1px solid rgb(22, 22, 22);
}

#script_version_changelog {
 background-color: rgb(19, 19, 19);
 border-radius: 5px;
 border: 1px solid rgb(22, 22, 22);
}

#discussion_comments_attributes_0_text {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(23, 23, 23);
 border-radius: 5px;
}

#report_explanation {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(23, 23, 23);
 border-radius: 5px;
}

#add-script {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(23, 23, 23);
 border-radius: 5px;
}

#comment_text {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(23, 23, 23);
 border-radius: 5px;
}

#conversation_messages_attributes_0_content {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(23, 23, 23);
 border-radius: 5px;
}

#message_content {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(23, 23, 23);
 border-radius: 5px;
}

.alert {
 border-color: currentcolor currentcolor currentcolor var(--default-main);
 background-color: rgba(40, 40, 40, 0.18);
 border-radius: 0px 8px 8px 0px;
}

.pagination, .script-list + .pagination, .user-list + .pagination {
 margin-bottom: 10px;
 padding: 2px;
}

.pagination > *, .script-list + .pagination > *, .user-list + .pagination > * {
 background-color: rgb(19, 19, 19);
 box-shadow: rgba(0, 0, 0, 0.52) 0px 0px 5px;
 cursor: pointer;
}

.pagination > a:focus, .pagination > a:hover {
 background-color: rgb(28, 28, 28);
 cursor: pointer;
}

.pagination .current {
 background-color: rgb(28, 28, 28);
 cursor: pointer;
}

.gap {
 user-select: none;
}

.log-table th {
 text-align: center;
}

.stats-table td, .stats-table th {
 border: 1px solid rgb(26, 26, 26);
}

::selection {
 background: rgba(0, 0, 0, 0.5);
 color: rgb(191,  191, 191);
 filter: contrast(130%);
 border-radius: 3px;
}

mark {
 background: rgba(255, 205, 54, 0.4);
}

sub, sup {
 font-size: 12px;
}

label, #edit_user > div > label, .checkbox-label {
 font-variant: all-petite-caps !important;
}

li {
 list-style: none;
}

tr {
 background-color: rgb(16, 16, 16);
}

td {
 background-color: rgb(11, 11, 11);
}

select {
 background-color: rgb(19, 19, 19);
 border-radius: 4px;
 border: 1px solid rgb(23, 23, 23);
}

code, pre {
 border: 1px solid rgb(32, 32, 32);
}

code {
 background-color: rgb(26, 26, 26);
}

h3 {
 font-variant: small-caps;
}

hr {
 color: rgb(87, 87, 87) !important;
 border-bottom: 1px solid rgb(36, 36, 36);
}

button {
 background-color: rgb(19, 19, 19);
 border: 1px solid rgb(23, 23, 23);
 border-radius: 4px;
 margin-top: 2px;
}

button:hover {
 background-color: rgb(22, 22, 22);
 border: 1px solid rgb(25, 25, 25);
}

input {
 background-color: rgb(19, 19 , 19);
 border: 1px solid rgb(22, 22, 22);
 border-radius: 4px;
}

img, video {
 border-radius: 4px;
}

a {
 color: rgb(191, 191, 191);
}

a:visited {
 color: rgb(191, 191, 191);
}

body {
 background-color: rgb(19, 19, 19);
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

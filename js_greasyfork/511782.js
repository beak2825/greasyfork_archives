// ==UserScript==
// @name           Dark STV
// @namespace      sangtaviet
// @version        4.0.1
// @description    Remake item for SangTacViet
// @author         @Undefined & @Jann
// @license        GPL-3.0
// @icon64         https://sangtacviet.vip/favicon.png
// @match          *://sangtacviet.vip/
// @match          *://sangtacviet.vip/user/*
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511782/Dark%20STV.user.js
// @updateURL https://update.greasyfork.org/scripts/511782/Dark%20STV.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const css = `
       :root {
            --bg-item: #1d1d1d;
            --bg-dark-darker: #101010;
            --bg-dark: #121212;
            --bg-darker: #1d1d1d;
            --color: #e0e0e0;
            --bg-secondary: #7f8c8d;
            --primary-red: #ff5733;
        }

        .bg-light {
            background-color: var(--bg-dark) !important;
        }

        .bg-dark {
            background-color: var(--bg-dark) !important;
        }

        .t-gray {
            color: var(--color) !important;
        }

        a {
            color: var(--color) !important;
        }

        button {
            color: var(--color) !important;
        }

        textarea,
        input,
        select {
            background-color: var(--bg-darker) !important;
            border: 1px solid var(--bg-dark) !important;
            color: var(--color) !important;
        }

        button,
        textarea,
        input,
        select {
            outline: none !important;
            box-shadow: none !important;
        }

        /* width */
        ::-webkit-scrollbar {
            width: 5px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background-color: var(--bg-darker) !important;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background-color: var(--bg-secondary) !important;
        }

        #tm-bot-nav::-webkit-scrollbar {
            height: 2px !important;
        }

        body {
            font-family: nunito !important;
            color: var(--color) !important;
        }

        #full {
            background-color: var(--bg-dark) !important;
        }

        #tm-top-nav {
            background-color: var(--bg-dark) !important;
        }

        #tm-top-nav .container,
        #tm-top-nav a {
            color: var(--color) !important;
        }

        #logo-stv {
            color: var(--color) !important;
            font-weight: bold !important;
            font-size: 50px !important;
            padding-left: 15px !important;
            font-style: italic !important;
        }

        #notifmarker {
            color: var(--color) !important;
        }

        #tm-user-avatar {
            box-shadow: none !important;
        }

        input#id {
            border-radius: 10px !important;
        }

        input#id::placeholder {
            color: var(--color) !important;
        }

        input#id:focus {
            background-color: var(--bg-darker) !important;
            border-radius: 10px !important;
        }

        #searchbox {
            display: none !important;
        }

        #tm-btn-rescan,
        #tm-btn-goto {
            color: var(--color) !important;
        }

        #tm-bot-nav {
            background-color: transparent !important;
            box-shadow: none !important;
        }

        #naviga a {
            color: var(--color) !important;
        }

        #inner > div[data-nosnippet].container {
            border-left: 4px solid var(--primary-red) !important;
            color: var(--color) !important;
            background-color: var(--bg-darker) !important;
            border-radius: 0 10px 10px 0 !important;
        }

        .tusachsearcher {
            border: 1px solid var(--bg-darker) !important;
            background-color: var(--bg-darker) !important;
        }

        #tusach {
            border: 1px solid var(--bg-darker) !important;
        }

        .roundblock {
            background-color: var(--bg-darker) !important;
        }

        .roundblock .title {
            color: var(--color) !important;
        }

        .roundblock .btngroup .btn {
            background-color: var(--bg-dark) !important;
        }

        .d-md-block:has(> div > #totrans) {
            display: flex !important;
            max-height: 100% !important;
        }

        div:has(> #totrans) {
            flex-grow: 1 !important;
            padding-bottom: 8px !important;
            flex-wrap: nowrap !important;
        }

        #totrans {
            margin-right: 1px !important;
        }

        #menunavigator2 {
            background-color: var(--bg-dark-darker) !important;
            box-shadow: none !important;
        }

        #menunavigator2 a {
            color: var(--color) !important;
            padding: 0 6px !important;
        }

        #menunavigator2 ul span {
            margin: 0 !important;
        }

        #menunavigator2 li:hover {
            background-color: var(--bg-dark) !important;
        }

        #inner .tmc-home-section {
            background: var(--bg-darker) !important;
            margin-top: 20px !important;
            border-radius: 16px;
            color: var(--color) !important;
        }

        #inner .cap {
            color: var(--color) !important;
            font-family: nunito !important;
        }

        .bookthumb {
            border: 2px solid transparent !important;
        }

        #tm-credit-section {
            background-color: var(--bg-dark) !important;
        }

        #btnshowns {
            background: #00000080 !important;
        }

        .fa-cogs.fas {
            color: #ffffff80 !important;
        }

        .modal-content {
            background-color: var(--bg-darker) !important;
        }

        .modal-header {
            border-bottom: 1px solid var(--bg-dark) !important;
        }

        .modal-footer {
            border-top: 1px solid var(--bg-dark) !important;
        }

        .noti {
            border: 1px solid var(--bg-dark) !important;
        }

        #tm-credit-section {
            height: 100px !important;
        }

        #tm-credit-text {
            display: none !important;
        }

        /* USER PAGE */
        #userpage .anh-bia {
            background: none !important;
        }

        #userpage .user-home {
            background: var(--bg-darker) !important;
        }

        #userpage .user-info-text {
            color: var(--color) !important;
        }

        .user-sign-text.nip {
            background-color: var(--bg-dark-darker) !important;
        }

        #userpage .user-stat .stat-title {
            color: var(--color) !important;
            font-weight: bold;
        }

        #userpage .stat-row span:first-child {
            color: #a5a5a5 !important;
        }

        #userpage .stat-row span:nth-child(2) {
            color: var(--color) !important;
            font-weight: bold;
        }

        #userpage button {
            background-color: var(--bg-darker) !important;
            color: var(--color) !important;
        }

        #ctxoverlay .contextmenu {
            background-color: var(--bg-darker) !important;
            color: var(--color) !important;
        }

        #userpage .tab-nav .tab-item.active {
            background-color: var(--bg-dark-darker) !important;
            color: var(--color) !important;
        }

        #userpage .tab-nav {
            border: none !important;
        }

        #userpage #commentportion {
            background-color: var(--bg-dark-darker) !important;
            color: var(--color) !important;
        }

        #commentportion .sec-bot {
            color: var(--color) !important;
        }

        #commentportion .sec-top {
            background-color: var(--bg-darker) !important;
            color: var(--color) !important;
        }

        #commentportion button {
            border: 1px solid #454545 !important;
        }

        .progress:has(.progress-bar.progress-bar-striped.bg-success) {
            background-color: var(--bg-dark-darker) !important;
        }

        .progress-bar.progress-bar-striped.bg-success {
            background-color: #4936ff !important;
            color: var(--color) !important;
        }

        .progress-bar.progress-bar-striped.bg-success + span {
            color: var(--color) !important;
        }

        .itemname {
            color: #a096ff !important;
        }

        #nhunger-page {
            background-color: var(--bg-dark-darker) !important;
        }

        #item-page {
            background-color: var(--bg-dark-darker) !important;
        }

        #item-page ul li {
            color: #a5a5a5 !important;
        }

        .window {
            font-family: nunito !important;

            color: var(--color) !important;
        }

        .window .head {
            background-color: var(--bg-darker) !important;
        }

        .window .body {
            background-color: var(--bg-darker) !important;
        }

        .window button.red {
            background: #832020 !important;
            border: none !important;
        }

        .window button.green {
            background: #49832e !important;
            border: none !important;
        }

        .window button {
            background: var(--bg-dark-darker) !important;
            border: none !important;
        }

        #friendlist-page {
            background-color: var(--bg-dark-darker) !important;
        }

        #friendlist-page .friend {
            border-bottom: 1px solid var(--bg-darker) !important;
        }

        #friendlist-page .friend:hover {
            background-color: var(--bg-darker) !important;
        }

        #friendlist-page .friend img {
            border: none !important;
        }

        .chat-box {
            height: 460px !important;
        }

        .chat-msg .chat-msg-content {
            background-color: var(--bg-dark-darker) !important;
        }

        .chat-input-text {
            background-color: var(--bg-dark-darker) !important;
        }

    `;

	GM_addStyle(css);
	document.querySelector('#tm-nav-search-logo').parentElement.innerHTML = `<span id='logo-stv'>STV</span>`;
})();
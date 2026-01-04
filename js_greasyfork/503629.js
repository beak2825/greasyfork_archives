// ==UserScript==
// @name           Dark STV
// @namespace      sangtaviet
// @version        5.6
// @description    Remake item for SangTacViet
// @author         @Undefined & @Jann
// @license        GPL-3.0
// @icon64         https://sangtacviet.vip/favicon.png
// @match          *://sangtacviet.vip/*
// @exclude        *://sangtacviet.vip/surf.php
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/503629/Dark%20STV.user.js
// @updateURL https://update.greasyfork.org/scripts/503629/Dark%20STV.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const css = `
        :root {
            --bg-item: #1d1d1d;
            --bg-dark-darker: #101010;
            --bg-dark: #121212;
            --bg-darker: #1d1d1d;
            --bg-opacity: #00000030;
            --color: #e0e0e0;
            --color-secondary: #b1b1b1;
            --bg-secondary: #7f8c8d;
            --primary-red: #ff5733;
            --primary-red-dark: #432823;
            --border-button: #676767;
        }

        html.touch *:hover {
            all: unset !important;
        }

        #dlnametbcontent,
        #upnamewd {
            background-color: var(--bg-dark) !important;
        }

        .dataTables_wrapper .dataTables_length,
        .dataTables_wrapper .dataTables_filter,
        .dataTables_wrapper .dataTables_info,
        .dataTables_wrapper .dataTables_processing,
        .dataTables_wrapper .dataTables_paginate {
            color: var(--color) !important;
        }

        .bg-light {
            background-color: var(--bg-dark) !important;
        }

        .bg-dark {
            background-color: var(--bg-dark) !important;
        }

        .table {
            color: var(--color) !important;
            border-collapse: collapse !important;
        }

        .table-light,
        .table-light > td,
        .table-light > th {
            background-color: var(--bg-dark) !important;
        }

        table.dataTable tbody tr {
            background-color: var(--bg-dark) !important;
        }

        .table-hover tbody tr:hover {
            color: var(--color) !important;
            background-color: var(--bg-darker) !important;
        }

        .table-light tbody + tbody,
        .table-light td,
        .table-light th,
        .table-light thead th {
            border-color: 1px solid var(--border-button) !important;
        }

        #share-option {
            color: var(--color) !important;
            background-color: var(--bg-darker) !important;
        }

        .dropdown-item:focus,
        .dropdown-item:hover {
            color: var(--color) !important;

            background-color: var(--bg-dark) !important;
        }

        .dataTables_wrapper .dataTables_paginate a.paginate_button.current,
        .dataTables_wrapper .dataTables_paginate a.paginate_button.current:hover {
            background: var(--bg-dark) !important;
            color: var(--color) !important;
        }

        .t-blue,
        .text-dark {
            color: var(--color) !important;
        }

        .t-gray {
            color: var(--color-secondary) !important;
        }

        .badge-secondary {
            color: var(--color) !important;
            background-color: var(--bg-dark) !important;
        }

        .selected {
            border-color: var(--primary-red) !important;
        }

        div[style*='color'] {
            color: var(--color) !important;
        }

        div[style*='background-color: #ffffff;']:not(#thumb-lay) {
            background-color: var(--bg-dark) !important;
            background: var(--bg-dark) !important;
        }

        #book_name2 {
            text-shadow: none !important;
        }

        div:has(> a[href*='the-luc']) {
            gap: 1px !important;
        }

        a[href*='the-luc'],
        a[onclick='leavefaction()'] {
            background-color: var(--bg-dark) !important;

            color: var(--color) !important;
            flex-basis: 33% !important;
        }

        .sticky {
            z-index: 9999 !important;
        }

        .shadow-lg {
            box-shadow: none !important;
        }

        .card-header {
            border-bottom: 1px solid var(--border-button) !important;
            background-color: var(--bg-darker) !important;
        }

        #sidebar #comment-box .card-header {
            border: 1px solid var(--bg-dark) !important;
        }

        #commentpane > #commentportion {
            background: var(--bg-dark-darker) !important;
        }

        #commentportion {
            background-color: var(--bg-dark-darker) !important;
            background: var(--bg-dark-darker) !important;
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

        .blk {
            border: 1px solid var(--bg-dark) !important;
            border-color: var(--border-button) !important;
        }

        .blk-top {
            background: var(--bg-darker) !important;
            color: var(--color) !important;
            border-top: none !important;
        }

        .blk-body {
            background: var(--bg-darker) !important;
            color: var(--color) !important;
            border: none !important;
        }

        .blk-body .blk-content {
            color: var(--color) !important;
        }

        .blk-bot {
            background: var(--bg-darker) !important;
            color: var(--color) !important;
            border: none !important;
            padding-bottom: 5px !important;
        }

        .blk-arr {
            background: var(--bg-darker) !important;
        }

        .blk-arr::before {
            border-color: transparent transparent var(--bg-darker) transparent !important;
        }

        #tm-p-search-top + div {
            background: var(--bg-darker) !important;
        }

        #tm-p-search-top + div .nb:hover {
            background: var(--bg-dark) !important;
        }

        .page-link {
            background: var(--bg-dark) !important;
        }

        .page-item.active .page-link {
            border-color: var(--primary-red) !important;
        }

        .input-group-text {
            background: var(--bg-dark-darker) !important;
            color: var(--color) !important;
            border: none !important;
        }

        .seloption:hover {
            background: var(--bg-dark) !important;
        }

        a {
            color: var(--color) !important;
        }

        a:hover {
            color: var(--primary-red) !important;
        }

        a.text-dark:focus,
        a.text-dark:hover {
            color: var(--primary-red) !important;
        }

        #clicktoexp,
        div[onclick='renewchapter(true);'] {
            color: var(--color) !important;
            background-color: var(--bg-dark) !important;
        }

        #commentpagebtn {
            background-color: var(--bg-darker) !important;
        }

        #tabbar > #bookpagebtn,
        #tabbar > #otherpagebtn,
        #tabbar > #personpagebtn,
        #tabbar > #commentpagebtn {
            border: none !important;
        }

        #tabbar {
            background-color: transparent !important;
        }

        #tabbar > div.active {
            color: var(--color) !important;
            border-bottom: 2px solid var(--bg-darker) !important;
        }

        #tabbar.sticked {
            border: none !important;
        }

        .chaplastreaded {
            background-color: var(--primary-red-dark) !important;
        }

        /*  .listchapitem */

        .chapreaded {
            color: var(--color-secondary) !important;
        }

        #namewdf {
            background-color: var(--bg-dark) !important;
        }

        .namepack .name {
            color: var(--color) !important;
        }

        .section {
            background-color: var(--bg-darker) !important;
            border: none !important;
            margin: 2px 0 !important;
        }

        label.open-modal {
            color: var(--color-secondary) !important;
        }

        .bkr {
            color: var(--color) !important;
        }

        .nowr:hover {
            background-color: var(--bg-darker) !important;
        }

        .slider.round {
            background-color: var(--bg-dark) !important;
            border: 1px solid var(--color-secondary) !important;
        }

        input:checked + .slider {
            background-color: var(--primary-red-dark) !important;
        }
        div[style*='background: #f7f7f7;'] {
            background-color: var(--bg-dark) !important;
        }

        i.section-thumb img {
            border-radius: 0 !important;
        }

        button,
        div[onclick='openfilter()'],
        div[channel],
        #toolbar button,
        a[href='javascript:supernamewindow()'],
        a[href='javascript:khonamewindow()'],
        a[href='javascript:namepackwindow()'],
        a[href='javascript:opensettingwindow()'],
        a[href='javascript:openitemwindow()'] {
            color: var(--color) !important;
            background-color: var(--bg-darker) !important;
            color: var(--color) !important;
            border-color: var(--border-button) !important;
        }

        .rd-tag {
            color: var(--color) !important;
            background-color: var(--bg-dark) !important;
        }
        .rd-tag[onclick] {
            color: var(--color) !important;
            background-color: var(--bg-darker) !important;
        }

        #tabbar > div.active {
            background-color: var(--primary-red-dark) !important;

            border-left: 2px solid var(--primary-red) !important;
        }

        #tabdiv > div > a {
            background-color: var(--bg-dark) !important;
        }

        .hover-darken.w:hover {
            background-color: var(--primary-red-dark) !important;
        }

        .hover-darken:hover {
            filter: unset !important;
        }

        textarea,
        input,
        select {
            background-color: var(--bg-darker) !important;
            border: 1px solid var(--border-button) !important;
            color: var(--color) !important;
        }

        textarea::placeholder,
        input::placeholder,
        select::placeholder {
            color: var(--color-secondary) !important;
        }

        button,
        textarea,
        input,
        select {
            outline: none !important;
            box-shadow: none !important;
        }

        ::-webkit-scrollbar {
            width: 5px;
        }

        ::-webkit-scrollbar-track {
            background-color: var(--bg-darker) !important;
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--bg-secondary) !important;
        }

        #tm-bot-nav::-webkit-scrollbar {
            height: 2px !important;
        }

        body {
            font-family: nunito !important;
            color: var(--color) !important;
            background-color: var(--bg-dark) !important;
        }

        #full,
        #inner {
            background-color: var(--bg-dark) !important;
            min-height: 100vh;
        }

        div[style*='background: #f7f7f7'] {
            background-color: var(--bg-dark) !important;
        }

        #pushbg {
            background: var(--bg-dark) !important;
        }

        div:has(> #tabdiv) {
            background: var(--bg-dark) !important;
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
            background: transparent !important;
        }

        #tm-bot-nav {
            background-color: transparent !important;
            box-shadow: none !important;
            text-align: center !important;
        }

        #naviga a {
            color: var(--color) !important;
        }

        #inner > div[data-nosnippet].container {
            border-left: 4px solid var(--primary-red) !important;
            color: var(--color) !important;
            background-color: var(--bg-darker) !important;
            border-radius: 0 10px 10px 0 !important;
            text-align: center !important;
        }

        .tm-reader-top-nav {
            background: transparent !important;
            border: 1px solid var(--border-button) !important;
            border-width: 1px 0 !important;
        }

        #nsbox {
            background: var(--bg-darker) !important;
            border: 1px solid transparent !important;
        }

        #nsbox button,
        #nsbox input {
            margin: 1px;
        }

        button[onclick='showAddName()'] {
            flex-grow: 1 !important;
        }

        #nsbox span[style*='background:green;'] {
            background: var(--bg-darker) !important;
        }

        a.bg-light:focus,
        a.bg-light:hover,
        button.bg-light:focus,
        button.bg-light:hover {
            background-color: var(--bg-darker) !important;
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
            z-index: 999999999999999;
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
            border-bottom: 1px solid var(--color-secondary) !important;
        }

        .modal-footer {
            border-top: 1px solid var(--color-secondary) !important;
        }

        .noti {
            border: 1px solid var(--color-secondary) !important;
        }

        #tm-credit-section {
            height: 100px !important;
        }

        #tm-credit-text {
            display: none !important;
        }

        #inner > div:nth-of-type(2) {
            background: var(--bg-dark) !important;
            color: var(--color) !important;
        }

        .actor .time {
            color: var(--color-secondary) !important;
        }

        .actor > div:nth-child(3) {
            color: var(--bg-dark) !important;
        }

        .actor .btag {
            color: var(--bg-dark) !important;
            background: var(--color) !important;
            mix-blend-mode: unset !important;
        }

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

        .nb:hover {
            background-color: var(--bg-darker) !important;
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
            background: var(--bg-opacity) !important;
        }

        .window .head {
            background-color: var(--bg-darker) !important;
        }

        .window .body {
            background-color: var(--bg-dark-darker) !important;
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
            background-color: var(--primary-red-dark) !important;
        }

        .chat-input-text {
            background-color: var(--bg-dark-darker) !important;
        }

        #channelsmenu {
            background-color: var(--bg-darker) !important;
        }

        .sticked {
            border: none !important;
        }

        #content-container .contentbox {
            background-color: var(--bg-darker) !important;
        }

        #navprevbot,
        #navnextbot,
        #navcenterbot {
            padding: 0 !important;
        }

        #totranslate,
        #maincontent {
            background-color: var(--bg-darker) !important;
        }

    `;

	GM_addStyle(css);
	document.querySelector('#tm-nav-search-logo').parentElement.innerHTML = `<span id='logo-stv'>STV</span>`;
})();
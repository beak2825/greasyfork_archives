// ==UserScript==
// @name         RPS Night Mode
// @namespace    https://greasyfork.org/en/users/197428-pathduck
// @license      MIT
// @version      0.58
// @description  Night mode for site "Rock, Paper, Shotgun"
// @author       Pathduck
// @supportURL   https://greasyfork.org/en/scripts/370482-rps-night-mode
// @match        *://*.rockpapershotgun.com/*
// @icon         https://icons.duckduckgo.com/ip2/rockpapershotgun.com.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370482/RPS%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/370482/RPS%20Night%20Mode.meta.js
// ==/UserScript==

GM_addStyle(`
figcaption {color: #00b893 !important;}
input {color: #eee !important;}
#page_wrapper {color: #eee !important; background: black !important;}
#content {background: #393939 !important; border-radius: 16px;}
#comments form textarea, #comments .toolbar, #comments .preview {color: white; background: #222;}
#comments form textarea::placeholder {color: #767676;}
#comments .toolbar button, #comments .actions-overflow-inner {color: #00b38f; background: #333 !important;}
#comments .container .post.highlight .markdown {background: #222; !important; border-radius: 5px;}
.article[data-article-type], .summary[data-article-type] {--color: #e94989;--strap-color: #e94989;}
.article[data-premium=true], .summary[data-premium=true] {--color: #9763ff !important; --strap-color: #9763ff !important;}
.article[data-paywalled=true] .article_body_content:after {background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0), #393939)}
.article_body_content blockquote {background: #222 !important; border-radius: 10px;}
.app_header, .app_footer {background: black !important; border: none !important;}
.app_footer a, .app_footer button {color: #eee !important;}
.article p a, .article_header a {color: #00b893 !important;}
.article-styling h2 {color: #00b893 !important;}
.archive_by_date a {color: #eee;}
.archive h2 a {color: #00b893 !important;}
.archive__item[data-premium=true] {--archive-kicker-color: #a282e3;}
.jumplinks_group {background-image: unset !important;}
.nav_primary a, .nav_secondary a {color: #eee !important;}
.notifications .table-row:not(.table-headers):hover {background-color: #222 !important;}
.notifications .table-row.table-headers .table-cell {color: white !important;}
.profile-comments a {color: #00b893 !important;}
.poll_wrapper .poll_container {--poll-border-color: lightgray;}
.poll_wrapper .poll_container * {color: #cbcbcb !important; background: unset !important;}
.recommendation, .recommendation__badge {background: #222; border-radius: 10px;}
.recommendation__title {color: #00b893;}
.recommendation__strapline {color: #eee;}
.section_title, .page_title, .label {color: #00b893 !important;}
.summary .button {color: #fff !important;}
.supporters_shelf .section_title {color: #9763ff !important;}
.strapline, .disclaimer, .alert {color: #eee !important;}
.tabbed_nav {background: #393939 !important; background-image: unset !important;}
.tabbed_nav .tabbed_buttons .tabbed_button {color: #eee !important;}
.title, .title a, .summary a {color: #00b893 !important;}
.thumbnail:after {content: unset !important;}
.video_player .playlist_item {background: #222 !important;}
.username .name {color: white !important;}
`);

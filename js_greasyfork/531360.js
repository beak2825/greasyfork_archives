// ==UserScript==
// @name        anitube-modernstyle-dark
// @namespace    https://anitube.in.ua/
// @version      0.0.3
// @description  dark theme & small fixes for AniTube.in.ua
// @author       marshallovski
// @match        https://anitube.in.ua/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anitube.in.ua
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531360/anitube-modernstyle-dark.user.js
// @updateURL https://update.greasyfork.org/scripts/531360/anitube-modernstyle-dark.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    const stylesheetElementId = 'anitube-modernstyle_stylesheet';
    const stylesheetCode = `
    :root {
    --font: 'Segoe UI', 'Open Sans', 'Noto Sans', 'DejaVu Sans', Tahoma, Geneva, Verdana, sans-serif;
    --body-bg-color: #212121;
    --body-txt-color: #eee;
    --content-bg-color: #263238;
    --secondary-txt-color: #757575;
    --secondary-bg-color: #424242;
    --secondary-bg-border: #666;
    --secondary-bg-border-darker: #444;
    --heading-elem-color: #fff;
    --link-color: #29B6F6;

    --color-success: #1DE9B6;
    --color-danger: #E57373;
}

body {
    font-family: var(--font);
    background: var(--body-bg-color);
    color: var(--body-txt-color) !important;
}

h1,
h2,
h3 {
    color: var(--heading-elem-color) !important;
}

a {
    color: var(--link-color) !important;
}

.inc_tab .case,
.hepl_serch {
    background: none !important;
}

.content {
    background: var(--content-bg-color);
    border: none;
    padding: 16px;
    border-radius: 8px;
}

header {
    box-shadow: none !important;
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
}

#header {
    border-radius: 3px 3px 2px 2px;
}

#header_img,
#header_img #header_img,
#header_menu,
#header_menu #header_menu,
header {
    border: none !important;
    background: var(--body-bg-color);
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
}

#header_img {
    background: none;
}

.header_img {
    border: none;
}

.header_menu_c,
.header_menu nav,
.inc_tab .controls {
    border: none;
}

.header_menu_c {
    border: 1px solid var(--secondary-bg-border);
    margin-top: 5px;
    border-radius: 8px;
    background: var(--content-bg-color);
}

.dcont {
    border: 1px solid var(--secondary-bg-border);
    background: var(--secondary-bg-color) !important;
    border-radius: 8px;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
}

.sortn .sortn {
    border: none;
}

/* **AniTube** > ... */
#dle-speedbar>span:nth-child(1)>span:nth-child(1) {
    font-weight: bold;
}

#dle-speedbar>span:nth-child(1)>span {
    padding: 5px;
    font-size: 14px;
}

.sortn {
    border: 1px solid var(--secondary-bg-border);
    background: var(--secondary-bg-color) !important;
    border-radius: 8px;
}

.inc_tab .controls li a {
    color: var(--body-txt-color) !important;
    background: var(--secondary-bg-color) !important;
    line-height: 1.2;
    font-style: normal;
    font-size: 12.5px;
    text-align: center;
}

.navi>li>a {
    padding: 0 15px !important;
    font-style: normal;
}

/* navbar divider */
.navi>li {
    background: none;
    border-right: 1px solid var(--link-color);
}

.navi>li:last-child {
    border: none;
}

.controls>li>a>sup {
    vertical-align: middle;
}

.hepl_serch {
    padding: 2px 10px;
    margin-top: 0.5em;
    margin-bottom: 2em;
    font-size: 13px;
    color: var(--secondary-txt-color);
}

/* search input */
.header_search div.simt div input,
.header_search div.simt div {
    color: var(--body-txt-color);
    font-style: normal;
    font-size: 16px;
    background-color: var(--secondary-bg-color);
}

.header_search {
    background: none;
}

/* search input clear button */
.header_search div.simt div input .clear-icon {
    padding: 4px 8px;
    font-weight: bold;
    background: var(--secondary-bg-border-darker);
}

.story_c h2 {
    background-color: var(--secondary-bg-color);
    border: 1px solid var(--secondary-bg-border);
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    text-shadow: none !important;
    color: var(--body-txt-color) !important;
}

.story_c h2 a {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    text-shadow: none !important;
    color: var(--body-txt-color) !important;
}

.box {
    border: 1px solid var(--secondary-bg-border-darker) !important;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
}

.box>h1,
.box>h4,
.box h2 {
    background: none;
    border-bottom: 1px solid var(--secondary-bg-border-darker) !important;
}

.box h3 {
    border-bottom: 1px solid var(--secondary-bg-border-darker) !important;
}

.story_c_left {
    border: none;
    box-shadow: none;
}

.story_c .rcol {
    background: none;
}


.story_c_left span.story_post img {
    border: none;
    border-radius: 5px;
    box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.5);
}

.story_c_left span.story_datenew {
    color: var(--content-bg-color);
    left: -32px;
}

/* anime preview: youtube thumbnail */
.story_c_r {
    border: 1px solid var(--secondary-bg-border-darker) !important;
    border-radius: 5px;
    margin-top: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 16px;
    padding: 5px;
}

.trailer_preview img {
    width: 220px;
}

.trailer_preview_overlay>h3:nth-child(2) {
    font-size: 14px;
}

.trailer_preview .trailer_preview_overlay svg {
    width: 24px;
    height: 24px !important;
    margin-right: 5px;
    margin-top: 2px;
}

.story_c_r hr {
    background: none;
    border: 1px solid var(--secondary-bg-border-darker) !important;
}

.story_c_text {
    border: none !important;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
}

/* elem: Приємного перегляду */
.showsh {
    background: var(--secondary-bg-border-darker) !important;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
    margin-top: 1em;
    border-radius: 8px;
    border: 1px solid var(--secondary-bg-border) !important;
    font-style: normal;
    color: var(--body-txt-color);
    font-size: 14.5px;
}

.info_translate {
    background: var(--secondary-bg-border-darker) !important;
    margin-top: 1em;
    border-radius: 8px;
    border: 1px solid var(--secondary-bg-border) !important;
    font-style: normal;
    color: var(--body-txt-color);
    font-size: 15px;
}

.info_c_translate>strong>i,
.info_c>strong>i {
    font-style: normal;
    font-size: 15px;
}

.info_c_translate>strong:nth-child(3) {
    font-weight: normal;
}

.info {
    background: var(--color-danger);
}

.linnew {
    background: none;
}

.story_screens img {
    border: 1px solid var(--secondary-bg-border);
    border-radius: 5px;
}

.tagers,
.story_ico_time,
.story_ico_watch {
    background: var(--secondary-bg-border-darker) !important;
    border: 1px solid var(--secondary-bg-border) !important;
    padding: 8px;
}

.tagers>span:nth-child(1) {
    font-size: 14px;
}

.tagers>span:nth-child(1)>a {
    margin-left: 5px;
}

.story_ico_time,
.story_ico_watch {
    padding: 4px;
}

.playlists-lists {
    margin: 1em;
}

.playlists-items li {
    font-family: var(--font);
}

.previous-episode,
.next-episode {
    color: var(--body-bg-color);
    text-shadow: none;
    font-weight: bold;
    font-size: 16px;
}

pjsdiv:nth-child(11)>pjsdiv:nth-child(2)>pjsdiv:nth-child(1) {
    font-family: var(--font);
}

pjsdiv:nth-child(12)>pjsdiv:nth-child(2)>pjsdiv:nth-child(1) {
    font-family: var(--font) !important;
}

.story_c_rate {
    border: 1px solid var(--secondary-bg-border) !important;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
}

/* similar titles > title name */
.horizontal ul li .text_content,
.horizontal ul li:hover .text_content {
    background: var(--secondary-bg-border-darker);
    color: var(--body-txt-color) !important;
    text-shadow: none;
}

.horizontal ul li .text_content {
    padding: 0 8px;
    height: fit-content;
    min-height: 35px;
    font-size: 12px;
}

/* title poster */
.horizontal ul li .sl_poster img {
    border: 1px solid var(--secondary-bg-border);
    border-radius: 5px;
}

.horizontal ul li .text_content a {
    vertical-align: bottom;
    display: inline;
    color: var(--body-txt-color) !important;
}

.n_comment .lcols {
    background: var(--secondary-bg-border-darker);
    border: 1px solid var(--secondary-bg-border) !important;
    border-radius: 6px;
    padding: 4px;
    text-shadow: none !important;
    color: var(--body-txt-color);
}

.n_comment .lcols .lcol {
    color: var(--body-txt-color);
    text-shadow: none !important;
}

.mwrat_gr {
    margin-top: 1em;
    margin-left: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
}

.ratingtypeplus {
    background: var(--secondary-bg-border) !important;
    color: var(--body-txt-color) !important;
    text-shadow: none;
    width: 30px !important;
}

/* comment > user avatar  */
.n_comment .lcols .rcol img {
    border-radius: 100%;
    border: 1px solid var(--secondary-bg-border) !important;
    box-shadow: none !important;
    background: none !important;
}

/* comment content */
/*
unfortunately, we must remove custom background
image from message content, because the content
of the message will be unvisible
*/

.n_comment .rcols {
    background: var(--secondary-bg-border-darker) !important;
    border: 1px solid var(--secondary-bg-border) !important;
    border-radius: 6px;
    padding: 4px;
    color: var(--body-txt-color);
    text-shadow: none !important;
}

/* comment arrow */
.n_comment .rcols::after {
    border: none;
}

.scriptcode,
.title_quote,
.quote,
.title_spoiler,
.text_spoiler {
    background: var(--secondary-bg-color);
    border: 1px solid var(--secondary-bg-border);
    border-radius: 6px;
}

.title_quote,
.title_spoiler {
    border-radius: 6px 6px 0 0;
    margin-top: 5px;
}

.quote,
.text_spoiler {
    border-radius: 0 0 6px 6px;
}

.text_spoiler,
.quote {
    margin-bottom: 5px;
}

#footer_img {
    background: none;
    margin-top: 1em;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
}

footer {
    border: none !important;
    background: var(--body-bg-color);
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
}

.footer_text {
    background: none;
}

/* registration page */
.f_input {
    background: var(--secondary-bg-border-darker);
    color: var(--body-txt-color);
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 14px;
    font-family: var(--font);
    border: 1px solid var(--secondary-bg-border);
}

.fbutton {
    background: var(--color-success);
    color: var(--body-bg-color);
    border: none;
    padding: 10px 12px;
    height: auto;
}

.fbutton:hover {
    color: var(--content-bg-color);
}

.tableform tr td {
    padding: 8px !important;
}

.fieldsubmit,
.tableform td {
    background: none;
    border: 1px solid var(--secondary-bg-border-darker) !important;
    padding-left: 8px;
}

/* ui dialog */
.ui-widget-content {
    background: var(--content-bg-color);
    color: var(--body-txt-color) !important;
    font-size: 13px !important;
}

.ui-widget-header {
    border-bottom: 1px solid var(--secondary-bg-border-darker) !important;
}

.ui-dialog .ui-dialog-title {
    color: var(--heading-elem-color) !important;
}

.ui-dialog .ui-dialog-buttonpane {
    background: var(--content-bg-color);
    color: var(--body-txt-color) !important;
    border-top: 1px solid var(--secondary-bg-border-darker) !important;
}

.ui-dialog .ui-dialog-buttonpane button {
    background: var(--secondary-bg-color);
    color: var(--body-txt-color);
    border: 1px solid var(--secondary-bg-border) !important;
    box-shadow: none;
    border-radius: 5px;
}

/* home page */
.news_2 {
    border: none;
    background: none;
}

.news_2 .title2 {
    background: var(--secondary-bg-color);
    border: 1px solid var(--secondary-bg-border) !important;
    font-size: 16px;
    font-weight: bold;
}

.news_2 .title2 a {
    color: var(--body-txt-color) !important;
}

.news_2 .title2:hover {
    background: var(--secondary-bg-border-darker);
}

.news_date {
    color: var(--content-bg-color) !important;
}

.news_2_c_l .news_link {
    text-shadow: none !important;
    background: var(--color-success) !important;
}

.news_2_c_l .news_link:hover a {
    text-shadow: none !important;
    background: #63f0cd !important;
}

.news_2_c_l .news_link a {
    color: var(--body-bg-color) !important;
}

.news_2_c_l {
    border: none !important;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
}

/* main page: title poster */
.news_2_c_l span.news_post img,
.news_3_c_l span.news_post img {
    border: none;
    border-radius: 8px;
    margin-bottom: 1em;
    height: 200px;
    width: 145px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.news_2_c_inf {
    border: 1px solid var(--secondary-bg-border) !important;
    border-radius: 8px;
}

.news_2_comm {
    color: var(--content-bg-color);
    text-shadow: none;
}

.news_2_comm span {
    border-radius: 6px !important;

}

/* main page: title info */
.news_2_infa {
    font-size: 13px;
}

.news_2_infa dl {
    background: none;
    border-bottom: 1px solid var(--secondary-bg-border-darker) !important;
}

.news_2_infa dt {
    color: var(--body-txt-color);
}

/* main page: title desc. */
.news_2_c_text {
    font-size: 14px;
    color: var(--body-txt-color);
    border-top: 1px solid var(--secondary-bg-border) !important;
}

.news_2_c_text strong i,
.news_2_c_text b i {
    font-style: normal;
    color: var(--color-success);
    font-size: 15px;
}

/* main page: news */
.news_r_h span.link {
    background: var(--secondary-bg-color);
    border: 1px solid var(--secondary-bg-border) !important;
    font-size: 14px;
    font-weight: bold;
    text-shadow: none !important;
}

.news_r_h span.link:hover {
    background: var(--secondary-bg-border-darker) !important;
    text-shadow: none !important;
}

.news_r_h span.link a {
    color: var(--body-txt-color) !important;
    text-shadow: none !important;
}

/* news text */
.news_r_c {
    color: var(--body-txt-color);
}

/* top news */
ul.topnews li a {
    background: none;
    animation: none !important;
}

ul.topnews li {
    background: none;
    border-bottom: 1px solid var(--secondary-bg-border-darker) !important;
}

ul.topnews li:hover span {
    animation: none !important;
    background: var(--content-bg-color) !important;
}

.col_news {
    background: var(--secondary-bg-border);
    color: var(--body-txt-color);
}

/* calendar */
.news_2 .calend {
    background: none;
}

.news_2 .calend span {
    background: var(--secondary-bg-border-darker);
    color: var(--body-txt-color);
    border-radius: 6px;
    border: 1px solid var(--secondary-bg-border) !important;
    text-shadow: none;
}

/* carousel: new manga */
.li_text {
    color: var(--body-txt-color);
    background: var(--secondary-bg-color) !important;
    text-shadow: none;
    padding: 0 8px;
    height: fit-content;
    min-height: 35px;
    font-size: 12px;
}

.li_text:hover {
    background: var(--secondary-bg-border) !important;
}

/* new collections */
.li_poster {
    border-radius: 6px;
    border: 1px solid var(--secondary-bg-border) !important;
    text-shadow: none;
}

.li_text {
    text-shadow: none !important;
    background: var(--secondary-bg-color) !important;
    font-size: 14px !important;
}

/* comedies online */
article.news,
hr {
    background: none;
    border-bottom: 1px solid var(--secondary-bg-border-darker) !important;
}

/* navbar paginator  */
.navi_pages {
    height: fit-content;
}

span.lcol span,
.navi_pages a {
    font-size: 18px !important;
}

.navi_pages a:hover {
    color: var(--body-txt-color);
    background: var(--body-bg-color);
}

.story_c_l span.story_link a {
    text-shadow: none;
    background: var(--secondary-bg-color);
    color: var(--body-txt-color) !important;
}

.story_c_l span.story_link a:hover {
    background: var(--secondary-bg-border);
    text-shadow: none;
}

/* page: anime */
.story_infa {
    font-size: 14px;
}

.story_comm span {
    border-radius: 5px;
}

article.story .story_infa dt {
    color: var(--body-txt-color);
}

/* title cover */
.story_c_l {
    border: none;
    box-shadow: none;
}

.story_c_l span.story_post img {
    border: 1px solid var(--secondary-bg-border);
    border-radius: 8px;
}

.story_c_l .story_link {
    border-radius: 8px !important
}

.story_c_inf {
    border: 1px solid var(--secondary-bg-border);
    border-radius: 8px;
}

.story_c_l span.story_date {
    color: var(--content-bg-color);
}

/* page: articles/statti */
.showshh {
    background: var(--secondary-bg-border-darker) !important;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
    margin-top: 1em;
    border-radius: 8px;
    border: 1px solid var(--secondary-bg-border) !important;
    font-style: normal;
    color: var(--body-txt-color);
    font-size: 14.5px;
}

.status-dropdown {
    background-color: var(--secondary-bg-border-darker) !important;
}

.status-dropdown li.active,
.status-dropdown li:hover {
   background-color: var(--secondary-bg-border) !important;
}

/* title count */
.mylists-tabs li {
   color: #333 !important;
}

.mylists-tabs li a {
   color: #000 !important;
}`;


    const style = document.createElement('style');
    style.id = stylesheetElementId;
    style.innerHTML = stylesheetCode;

    document.body.append(style);

    if (document.getElementById(stylesheetElementId))
        console.info('[anitube-modernstyle-dark]: successfully injected the stylesheet!');
    else
        console.warn('[anitube-modernstyle-dark]: failed to inject the stylesheet!');
})();
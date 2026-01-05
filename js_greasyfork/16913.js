// ==UserScript==
// @name        FL:RP
// @namespace   FLRP
// @version     1.1d
// @grant       none
// @description	Makes the FearlessRP forums not eye-singingly bright.

// @include        http://*fearlessrp.net/*
// @include        https://*fearlessrp.net/*
// @downloadURL https://update.greasyfork.org/scripts/16913/FL%3ARP.user.js
// @updateURL https://update.greasyfork.org/scripts/16913/FL%3ARP.meta.js
// ==/UserScript==

//
// Written by Glenn Wiking
// Script Version: 1.1d
// Date of issue: 20/01/16
// Date of resolution: 06/01/16
//

function ShadeRootFLRP(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootFLRP(
  //'body {display: none;}'
  //+
  'body[contenteditable="true"] {background: #929292 !important;}'
  +
  'body, #container2 {background-color: #171A1B !important;}'
  +
  '#container {background: rgba(0, 0, 0, 0.35);}'
  +
  'table {color: #E1E8EA !important;}'
  +
  '#posts_container {background-color: #646B6E;}'
  +
  'a:link, h5, font p {color: #D7D7D7 !important;}'
  +
  '#menu {background-color: #21292D !important;}'
  +
  '.post .post_author {background: #313232; border-bottom: 1px solid #3B4D57; border-top: 2px solid #2D3235;}'
  +
  '.smalltext, .post_date {color: #999 !important;}'
  +
  '.post_controls {background: #313232; border-bottom: 1px solid #272323;}'
  +
  '.largetext {text-shadow: 0px 0px 5px #99F;}'
  +
  '.edited_post a {color: #CCC !important;}'
  +
  '.tfoot {background: #1E2324;}'
  +
  '.trow2 {background: #293135 !important; border-color: #393C3E #373E44 #272E32 #1B2023 !important; color: #C1CBCC;}'
  +
  '.trow1 {background: #444A4E !important; border-color: #2A383C #213035 #294853 #45575F !important; color: #C1CBCC;}'
  +
  'td div span span a:link {color: #ECECEC;}'
  +
  '.author a:link {color: #BEC7CB !important;}'
  +
  '.trow_sep {background: #202529 !important; color: #DADCDD; border-bottom: 1px solid #262E30;}'
  +
  '.trow1 strong a:link, .trow2 strong a:link {color: #D6DEE3 !important;}'
  +
  '.smalltext a {color: #D6DEE3 !important;}'
  +
  '.pm_alert {border: 1px solid #3F9AC6 !important; color: #3F9AC6 !important; background-color: #34505F !important;}'
  +
  '.navegador ul {background: #313232 !important; border: 1px solid #26373F !important;}'
  +
  '.navegador .active {color: #D4DEE0 !important;}'
  +
  '#menuspacer {background: #313232 !important;}'
  +
  '#cssmenu > ul {background: #313232 !important;}'
  +
  '#cssmenu > ul > li > a, .float_left {color: #C4D6DB !important;}'
  +
  'a:link, strong a, strong a:link, a:visited {color: #D1D1D1 !important;}'
  +
  '.subject_old a:link, . subject_old a:link {color: #C1CBCC !important;}'
  +
  'td strong a, .trow2 strong a, img, #gametracker a, #gametracker a img, img::before {color: #D6DEE3 !important;}'
  +
  '.tcat_foot {background: rgb(49, 50, 50) !important;}'
  +
  '.tborder {background: rgba(0, 0, 0, 0);}'
  +
  'a:link {color: #D7D7D7 !important;}'
  +
  '.post_content, textarea, #message, input.textbox {background: #5A6062 !important;}'
  +
  'textarea, input.textbox {border: 1px solid #133745 !important;}'
  +
  '.postbit_buttons > a:link, .postbit_buttons > a:hover, .postbit_buttons > a:visited, .postbit_buttons > a:active, button, input.button, .pagination a, .pagination_page {background: #304D54 !important; border: 1px solid #37646C !important; color: #C0CCD1 !important;}'
  +
  '.tcat {background: -moz-linear-gradient(top, #27444D 0%, #122535 100%) !important; background: -webkit-linear-gradient(top, #27444D 0%, #122535 100%) !important; background: linear-gradient(to bottom, #124b5b 0%,#0a283f 100%) !important; border-top: 1px solid #293C42 !important; border-bottom: 1px solid #293C42 !important;}'
  +
  '.menufooter {border-bottom: 1px solid #273538 !important;}'
  +
  '.thead {border-bottom: 2px solid #263839 !important;}'
  +
  'blockquote {border: 1px solid #255375; background: #153544; color: #CCD !important;}'
  +
  '.post .post_author div.author_statistics {color: #BBC5CB !important;}'
  +
  '.post_content .signature {border-top: 1px dotted #122F3B !important;}'
  +
  'blockquote cite {border-bottom: 1px solid #1F4F5F !important;}'
  +
  '.post .post_author div.author_avatar img {border: 1px solid #253135 !important; background: #475356 !important;}'
  +
  'img {opacity: .9;}'
  +
  '.content navigation, .content navigation h2 {background-color: rgba(25,25,35,.9) !important;}'
  +
  '#rounded-corner th, .rounded-q5, .rounded-company {color: #AFC7C8; background: #2A3336 !important;}'
  +
  '#rounded-corner td {background: #191C1D; border-top: 1px solid #3C7781;}'
  +
  '#rounded-corner tr:nth-child(odd) td {background-color: #1E2B32;}'
  +
  '#rounded-corner tbody tr:hover td {background: #10161A;}'
  +
  '#rounded-corner a {color: #ADB7BA !important;}'
  +
  '.tb2 {background-color: #1E2B32; border: 1px solid #3C7781;}'
  +
  '#rounded-corner tfoot td.rounded-foot-left, #rounded-corner tfoot td.rounded-foot-right {background: #1E2B32;}'
  +
  '#notice, #rounded-corner td {color: #8C989C !important;}'
  +
  '.tb2 {color: #CCD !important;}'
  +
  '#header img {border-radius: .4em !important; background-color: #094550 !important;}'
  +
  'div.error {border-top: 2px solid #3F9AC6 !important; border-bottom: 2px solid #3F9AC6 !important; background: #34505F !important;}'
  +
  'div.error p em {color: #3F9AC6 !important;}'
  +
  '#container .error ul li {color: #D1D1D1 !important;}'
  +
  '.popup_menu {background: #2A3A44 !important; border: 1px solid #2B4350 !important;}'
  +
  '.popup_menu .popup_item {background: #323B3E !important;}'
  +
  'tbody tr td .top tbody tr td, h1, td h3, td h4, td h5, td p {color: #AEBABF !important;}'
  +
  'div.sceditor-toolbar, .sceditor-container {background: #242424 !important; border-bottom: 1px solid #293032 !important;}'
  +
  '.sceditor-group {background: #444A4E !important; border-bottom: 1px solid #294853 !important;}'
  +
  '.sceditor-button:hover, .sceditor-button:active, .sceditor-button.active {background: #165E80 !important;}'
  +
  '.menufooter .smalltext, .menufooter .smalltext a {background: rgba(25,25,35,.8) !important; border-radius: .25em;}'
  +
  '.sceditor-container {border: 1px solid #133745 !important; opacity: .92;}'
  +
  'select, input {background: #304D54 !important; border: 1px solid #37646C !important; color: #C0CCD1 !important;}'
);

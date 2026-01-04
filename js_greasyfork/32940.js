// Written by Glenn Wiking
// Script Version: 0.2.0a
// Date of issue: 14/02/17
// Date of resolution: 14/02/17
//
// ==UserScript==
// @name        ShadeRoot MGTOW
// @namespace   SRMT
// @version     0.2.0a
// @icon        https://i.imgur.com/9lxeoec.png
// @description	Eye-friendly magic in your browser for MGTOW

// @include     *.mgtow.com/*

// @downloadURL https://update.greasyfork.org/scripts/32940/ShadeRoot%20MGTOW.user.js
// @updateURL https://update.greasyfork.org/scripts/32940/ShadeRoot%20MGTOW.meta.js
// ==/UserScript==

function ShadeRootCAH(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootCAH(
  'body, section#forums, #bbpress-forums div.odd, #bbpress-forums ul.odd {background: #171818 !important;}'
  +
  '#forums .container, #content, #bbpress-forums div.bbp-forum-header, #bbpress-forums div.bbp-topic-header, #bbpress-forums div.bbp-reply-header {background: #292c2f !important;}'
  +
  '#bbpress-forums div.even, #bbpress-forums ul.even {background-color: #2a2e2f !important;}'
  +
  '#bbpress-forums div.bbp-forum-header, #bbpress-forums div.bbp-topic-header, #bbpress-forums div.bbp-reply-header, #bbpress-forums li.bbp-header, #bbpress-forums li.bbp-footer {background-color: #1c2021 !important;}'
  +
  '#bbpress-forums ul.bbp-lead-topic, #bbpress-forums ul.bbp-topics, #bbpress-forums ul.bbp-forums, #bbpress-forums ul.bbp-replies, #bbpress-forums ul.bbp-search-results {border: 1px solid #191e21 !important;}'
  +
  'div.bbp-forum-header, div.bbp-topic-header, div.bbp-reply-header, #bbpress-forums li.bbp-header, #bbpress-forums li.bbp-footer {border-top: 1px solid #191e21 !important;}'
  +
  '.bbp-body blockquote {background: url(//www.mgtow.com/wp-content/themes/mgtow/images/ui/quote_sm.png) no-repeat #223138 !important;}'
  +
  '.d4p-bbt-quote-title {border-bottom: 1px solid #2d4753 !important;}'
  +
  '.bbp-template-notice.info {background: #223138 !important;}'
  +
  '#bbpress-forums p, .bbp-header, body {color: #686E72 !important;}'
  +
  '.well, .card {background-color: #171a1d !important; border: 1px solid #1e2223 !important;}'
  +
  '.list-group-item {background-color: #243642 !important; border: 1px solid #215384 !important;}'
  +
  '.list-group-item, button.list-group-item {color: #A8CCDD !important;}'
  +
  '.bbp-author-name {color: #3295BC !important;}'
  +
  '.bbp-signature {border-top: 1px solid #33648d !important;}'
  +
  'img {opacity: .85 !important;}'
  +
  'div.bbp-template-notice, div.indicator-hint {background-color: #47472f !important; border-color: #68621d !important;}'
  +
  '#bbpress-forums li.bbp-body ul.forum, #bbpress-forums li.bbp-body ul.topic {border-top: 1px solid #313a41 !important;}'
  +
  '.bootstrap-switch .bootstrap-switch-label {color: #c1d8e0 !important; background: #174450 !important;}'
  +
  '.bootstrap-switch {border-color: #28668D !important;}'
  +
  '.badge {background: #367AAD !important;}'
  +
  '.bootstrap-switch-handle-off > div {background: #555 !important;color: #c9e2f2 !important;}'
  +
  '.contact #send {color: #F0E8D7 !important; border: 1px solid #6F4816 !important; border-color: #472D0C !important; background: #78720B; background: linear-gradient(to left, #724814 , #594D17) !important;}'
  +
  '.contact input:focus, .contact textarea:focus, .contact input:focus, .contact textarea:focus {background: #183e5f !important; color: #c5ddec !important;}'
  +
  '.list-item.reply {border-left: 5px solid #225571 !important;}'
  +
  '.list-item {border: 1px solid #2984BD !important;}'
  +
  '.navbar .dropdown-menu li a:hover {color: #d2e8ed !important; background: #3C808C !important;}'
);
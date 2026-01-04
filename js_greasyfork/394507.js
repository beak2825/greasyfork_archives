// ==UserScript==
// @name          Prokofe.ru mod
// @namespace     https://greasyfork.org/users/386075
// @datecreated	  2020-01-01
// @lastupdated	  2020-01-01
// @version       0.0.1
// @description   Скрипт модифицирует внешний вид сайта prokofe.ru
// @author        kroleg
// @match         http://prokofe.ru/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/394507/Prokoferu%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/394507/Prokoferu%20mod.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
  'use strict';
  var css = `
@import url(https://fonts.googleapis.com/css?family=PT+Sans|PT+Sans+Narrow|Roboto+Condensed&display=swap);

#Clock {
    margin: 10px 0 0 15px;
}

#Clock, .caption1 {
    font: normal 13px 'PT Sans';
}

#active a {
    background-color: #f0cbaf;
}

#list_recent_page_content_103 > div, #list_recent_page_comment > div, #list_recent_page_news > div, #list_recent_page_forum > div {
    font: normal 13px Arial;
    margin: 0 0 15px 0;
    text-align: left;
}

#list_recent_page_content_103, #list_recent_page_comment, #list_recent_page_news, #list_recent_page_forum {
    background-color: #f5f0eb;
    border: 1px solid #ad7a53;
    border-radius: 2px;
}

#nav a {
    color: #000;
}

#nav li a {
    font: normal 13px 'PT Sans';
    padding: 7px 12px;
}

#nav li#active:hover a {
    color: #000;
}

#nav li:hover {
    background-color: #692e02;
}

#nav li:hover a {
    color: #fff;
}

#xcolumn1 {
    width: auto;
}

#xcontentwrap {
    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.1);
}

#xfooter {
    display: none;
}

#xnavbar {
    border-bottom: 3px solid #f0cbaf;
}

.button {
    background: #6f6eb7;
    border-radius: 2px;
    font: normal 12px 'PT Sans Narrow';
    min-width: 49px;
}

.button:hover {
    background: #9278d2;
}

.caption2, .menu_content2 form b {
    font: normal 13px 'PT Sans';
}

.chat, .chattext {
    background-color: transparent;
}

.fborder .forumheader {
    background-color: #f0cbaf;
}

.fborder .forumheader > div:nth-child(2) {
    font: normal 13px 'PT Sans';
    text-align: left;
}

.fborder > .forumheader3 > div:nth-child(2) {
    width: 77%;
}

.fcaption {
    font: normal 14px 'PT Sans';
}

.finfobar {
    border-bottom: 2px solid #ad7a53;
}

.forumheader {
    font: normal 17px Tahoma;
}

.forumheader a:hover b, .forumheader a:visited b, .forumheader a:link b {
    color: #612b03;
    font: normal 17px Arial;
}

.forumheader b {
    font: inherit;
}

.forumheader h4 {
    margin: 0;
}

.forumheader3 > .indent > img , .chattext img {
    max-width: 28px;
}

.forumheader3 > span > .spacer > img, .forumheader3 .smalltext .spacer > img {
    box-shadow: none;
}

.forumheader3 b, span.mediumtext b a {
    font: normal 14px 'PT Sans';
}

.forumheader3 object {
    max-width: 504px;
}

.forumheader3, .forumheader4 {
    font: normal 14px Tahoma;
}

.menu_content1 .forumheader, .fborder .xforumheader {
    font: normal 13px 'PT Sans';
    text-align: left;
}

.menu_content3 .spacer > img {
    box-shadow: 1px 1px 0px 0px rgba(255, 255, 255, 0.45), -1px -1px 0px 0px rgba(0, 0, 0, 0.6);
}

.menu_content3 .spacer > img, .forumheader3 .spacer > img {
    border-radius: 2px;
    box-shadow: rgba(255, 255, 255, 1) 0px 0px 0px 1px, rgba(0, 0, 0, .2) 0px 2px 7px 1px;
}

.menu_content3 > div > a > img {
    max-width: 168px;
}

.menu_table2 {
    background-color: #f5f0eb;
    border: 1px solid #ad7a53;
    border-radius: 2px;
}

.ncode_imageresizer_warning {
    margin-bottom: 1px;
}

.nextprev_current, .nextprev_link {
    background-color: #d7d8e2;
    border-radius: 2px;
    font: normal 12px Verdana;
    padding: 1px 6px 3px 6px;
}

.smallblacktext {
    font: normal 14px Arial;
}

.spacer .fborder .forumheader {
    font: normal 13px 'PT Sans';
}

.spacer > .forumheader3 {
    border-bottom: none;
}

.spacer > .forumheader4 {
    background-color: #f5f0eb;
    border: 1px solid #ad7a53;
    border-radius: 2px;
}

.tbox, .helpbox {
    font: normal 11px Arial;
}

.xbanner {
    color: #8a8a8a;
    float: left;
    font: normal 9px 'PT Sans';
    margin: 0 0 0 364px;
}

a.forumlink {
    font: normal 13px 'PT Sans';
}

a.nextprev_link, span.nextprev_current {
    color: #000;
    text-decoration: none;
}

a:hover {
    text-decoration: none;
}

a:hover, a:visited, a:link, a:hover b, a:visited b, a:link b {
    color: #692e02;
}

a:hover.nextprev_link {
    background-color: #efefef;
}

a:link, a:visited {
    text-decoration: underline;
}

div.caption3 {
    font: normal 14px Helvetica;
}

div.indent {
    background-color: #f5f0eb;
    border: 1px solid #ad7a53;
    border-radius: 2px;
}

img.bbcode_buttons {
    display: inline;
}

img.ncode_imageresizer_original {
    border-radius: 2px;
    display: block;
    height: auto;
    margin: 0 auto;
    max-width: 549px;
}

span.nextprev_current {
    background-color: transparent;
}

span.smallblacktext {
    font: normal 13px Arial;
}

span.smalltext {
    font: normal 10px Tahoma;
}

table.menu_table3 {
    background-color: #f5f0eb;
    border: 1px solid #ad7a53;
    border-radius: 2px;
}

td.fcaption {
    font: normal 13px 'PT Sans';
    text-align: left;
}

td.forumheader {
    background-color: #f0cbaf;
}

td.forumheader2 a {
    font: normal 15px 'PT Sans';
}

td.forumheader3 {
    font-size: 14px;
    vertical-align: top;
}

td.menu_content3 > b {
    color: #006ee0;
    font: normal 12px Arial;
}

td.menu_content3 a b {
    font: normal 12px Arial;
}

td.menu_content3 b a {
    color: #006ee0;
}

td.menu_content3 img {
    float: left;
    margin: 2px 5px 0 0;
    vertical-align: none;
}

td.xforumheader {
    background-color: #f0cbaf;
    border-left: 4px solid #b75335;
}
`;
  addGlobalStyle(css);
})();
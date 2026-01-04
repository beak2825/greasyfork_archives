// ==UserScript==

// @author         code: Alena17; style: sw.East
// @namespace      https://greasyfork.org/ru/users/3065-чеширский-котъ

// @name           : HWM : Improvement Topic Forum [with bg] :
// @name:en        : HWM : Improvement Topic Forum [with bg] :
// @description:en playing avatars, links and other changes on the HWMforum
// @description    Вывод  аватар, ссылок и другие изменения на форуме ГВД

// @icon           http://dcdn.heroeswm.ru/avatars/2966/nc-10/2966879.gif
// @version        0.9.4
// @encoding 	   utf-8

// @domain         www.heroeswm.ru

// @include        *//*.heroeswm.*/forum_messages.php?tid=*
// @include        *//178.248.235.15/forum_messages.php?tid=*
// @include        *//*.lordswm.*/forum_messages.php?tid=*

// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js

// @resource       bt http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css
// @resource       default_avatar http://i.imgur.com/24ymGJQ.jpg

// @homeURL         https://openuserjs.org/scripts/chesheerk/HWM_Improvement_Topic_Forum_(with_bg)

// @compatible     chrome Chrome + TamperMonkey
// @compatible     firefox Firefox + TamperMonkey
// @compatible     opera Opera + TamperMonkey

// @copyright      2016, Alena17 (https://www.heroeswm.ru/pl_info.php?id=2966879), 2013-2021 @sw_East
// @license        MIT

// @grant          GM_addStyle
// @grant          GM_getResourceText
// @grant          GM_getResourceURL

// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/374583/%3A%20HWM%20%3A%20Improvement%20Topic%20Forum%20%5Bwith%20bg%5D%20%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/374583/%3A%20HWM%20%3A%20Improvement%20Topic%20Forum%20%5Bwith%20bg%5D%20%3A.meta.js
// ==/UserScript==


// базируется на идее      Vlad aka johniek_comp <komduv@yandex.ru>
/**=============================================================================
 =============================== CHANGELOG ======================================
 ================================================================================
 0.1 - полностью переписан код на JQuery, изменен стиль.
 ===============================================================================
 0.2 - добавлен вывод :
 - аватар, ссылок на передачу, пиьмо.
 ================================================================================
 0.3 - добавлен вывод :
 - лвела, знака "онлайн", клан-значка
 - перенесены кнопки "цитировать", ответить" в блок с ответами/комментами
 ================================================================================
 0.4 - подключены:
 - фреймворк bootstrap и шрифт font-awesome
 - полностью переписан стиль
 - добавлен выпадающий список для кнопки "передать эл./рес."
 ================================================================================
 0.5 - добавлен дефолтный аватар (тем у кого нет)
 - изменен стиль постраничной навигации
 ================================================================================
 0.5.1 - переписан стиль постраничной навигации
 ================================================================================
 0.6 - изменено:
 - позиционирование и стиль кнпок "цитировать", ответить"
 ================================================================================
 0.7 - изменено:
 - ширина и стиль блока поля ввода текста и самого textarea
 ================================================================================
 0.8 - изменено:
 - оптимизация кода кода
 ================================================================================
 0.9 - изменено:
 - стилизация постраничной навигации (breadcrumbs)
 ================================================================================
  0.9.1 - изменено:
 - фикс "быстрых ссылок" (временно так, пока не найду нормального решения)
 ================================================================================
  0.9.2 - изменено:
 - исправлен баг ссылки "Добавить в друзья"
 ================================================================================
  0.9.3 - изменено:
 - поддержка протокола https
 - поддержка GreaseMonkey 4 и TamperMonkey
 ================================================================================
  0.9.4 - изменено:
 - активные ссылки
 ================================================================================*/
// https://cdn.rawgit.com/christianv/jquery-favicons/gh-pages/jquery.favicons.min.js
// default_avatar https://share.okdothis.com/assets/default-avatar-c3489d85edf2bf86dbb3ff2a0e89a20c.png?w=64&h=64
// add bootstrap

/*function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}*/

GM_addStyle(GM_getResourceText("bt"));

/**
 * ============= Style =============
 */
GM_addStyle ( `
/* =  Table of Css
 0.Body
 1.Blockquote
 2.Avatar
 3.Buttons
 4.Forum nick & lvl
 5.Race image
 6.Actions
 7.Block nick
 8.Forum setting
 9.Forum textarea setting
 10.Other
 11.Navbar
 12.Pagination
 13.Breadcrumbs
 14.Quick Links
 15.Buttons
 16.Color buttons & actions*/
/*----------------------------------------------*/
/* 0. Body */
/*----------------------------------------------*/
body{
    /* light*/
    /*background: #ddd9cd url(http://365psd.ru/images/backgrounds/bg-light-4868.png) repeat;*/

    /* dark*/
    /*background: #ddd9cd url(http://365psd.ru/images/backgrounds/bg-dark-4785.jpg) repeat;*/

    background: #ddd9cd url(http://365psd.ru/images/backgrounds/retro-03.jpg) repeat;
    /*background-position:top 100px left 0px !important;  */
}
body > table:nth-child(1){
    background:#ddd9cd;
    -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.71);
       -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.71);
            box-shadow: 0 0 10px 5px rgba(0,0,0,0.71)
}
/* фикс "быстрых ссылок (временный) */
body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1){margin-bottom: 15px !important}
body > center:nth-child(2) > table:nth-child(1),
body > center:nth-child(2) > table:nth-child(1) > tbody:nth-child(1),
body > center:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1){
    /* background:#ddd9cd;  */
    background:#E5DCCB; !important;
    margin-top: 15px !important
}
body > center:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1){
    background:#E5DCCB; !important;
    border:3px solid #524557;
    height: 25px !important
}
body > center:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td{padding: 5px !important;}
/*----------------------------------------------*/
/* 1. Blockquote */
/*----------------------------------------------*/
.blockquote {
    background:#f9f9f9;
    border-left:10px solid #EEF1F2;
    margin:1.5em 10px 5px 10px;
    padding:.5em 10px
}
.blockquote:before {
    color:gray;
    content:open-quote;
    font-size:4em;
    line-height:.1em;
    margin-right:.25em;
    vertical-align:-.4em
}
/*----------------------------------------------*/
/* 2. Avatar */
/*----------------------------------------------*/
.avatar {
    color: #FFF;
    display: block;
    height: 148px;
    margin: -5px 15px 20px 20px;
    position: relative;
    width: 148px;
    z-index: 1
}
.avatar:after {
    border: 5px solid #f4f4f4;
    box-sizing: initial;
    content: "";
    display: block;
    height: 100%;
    padding: 1px;
    pointer-events: none;
    position: absolute;
    width: 100%
}
.avatar:after {
    -webkit-box-sizing: content-box;
       -moz-box-sizing: content-box;
         -o-box-sizing: content-box;
            box-sizing: content-box;
    -webkit-transition: all 0.2s, -webkit-transform 0.2s;
       -moz-transition: all 0.2s, -moz-transform 0.2s;
         -o-transition: all 0.2s, -o-transform 0.2s;
            transition: all 0.2s, transform 0.2s
}
.avatar img {
    background: #FFF;
    border: 1px solid #cecece;
    color: #777;
    display: inline-block;
    height: 150px;
    margin: 5px 0 0 5px;
    position: relative;
    text-align: center;
    width: 150px;
    z-index: 1
}
/*----------------------------------------------*/
/* 3. Buttons */
/*  (btn_nick , btn-trans-nick, btn-forum-nick) */
/*----------------------------------------------*/
.center-block {
/* bootstrap */
}
.btn_nick, .btn-trans-nick {
    border-radius: 0px;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-size: 12px !important;
    font-weight: 300;
    line-height: 1.42857;
    margin: 1px;
    overflow: hidden;
    padding: 1px 5px;
    text-align: center;
    text-decoration: none !important;
    vertical-align: middle;
    -webkit-transition: all 3s ease 0s;
       -moz-transition: all 3s ease 0s;
         -o-transition: all 3s ease 0s;
            transition: all 3s ease 0s;
    -moz-user-select: none
}
.btn_nick {background-color: #97A3AE;}
.btn-trans-nick {
    margin-left: 9px;
    padding-left: 25px;
    text-align: left !important
}
.btn-trans-nick a, .btn-forum-nick a{text-decoration: none !important}
.btn_nick:focus, .btn_nick:active, .btn-trans-nick:focus, .btn-trans-nick:active, .btn-forum-nick:hover, .btn-forum-nick:focus, .btn-forum-nick:active {
    outline: 0px none;
    outline-offset: -2px;
    text-decoration: none !important
}
.btn_nick:hover, .btn_nick:focus, .btn_nick:active {
    color: #B5D1D8;
    background-color: #505C66;
    border-color: #505C66
}
.btn_nick:hover, .btn-trans-nick:hover{box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.33)}
.btn_nick a, .btn-trans-nick a{
    color: #FFFFFF !important;
    text-decoration: none !important;
    transition: all 0.35s ease 0s
}
.btn_nick a:hover, .btn_nick a:focus, .btn_nick a:active {color: #B5D1D8}
.btn-trans-nick a:hover, .btn-trans-nick a:focus, .btn-trans-nick a:active, .btn-trans-nick a:link, .btn-trans-nick a:visited, .btn-forum-nick a:hover, .btn-forum-nick a:focus, .btn-forum-nick a:active {color: #fafafa !important}
.transfer_forum {width: 180px}

.btn_nick_text{
    color: #CE4646;
    font-weight: bold;
    text-decoration: none !important;
    word-wrap: inherit;
    white-space: nowrap;
}
.btn_nick_text a{
    text-decoration: none !important;
    -webkit-transition: all 2s ease 0s;
       -moz-transition: all 2s ease 0s;
         -o-transition: all 2s ease 0s;
            transition: all 2s ease 0s
}
.btn_nick_text a:hover, .btn_nick_text a:focus, .btn_nick_text a:active {color: #CE4646 !important}
/*----------------------------------------------*/
/* 4. Forum nick & lvl */
/*----------------------------------------------*/
.btn-forum-nick, .btn-forum-level {
    border-bottom: 1px solid #f4f4f4;
    font-weight: 800;
    width: 200px
}
.btn-forum-nick{margin-top: -15px}
 .btn-forum-nick a{
    /*display: inline;*/
    font-size: 16px;
    color: #524557 !important;
    text-align: left;
    padding: 0 0 0 28px;
    -webkit-transition: all 1.95s ease 0s;
       -moz-transition: all 1.95s ease 0s;
         -o-transition: all 1.95s ease 0s;
            transition: all 1.95s ease 0s;
}
.btn-forum-nick a img{
    display: block;
    text-align: left;
    margin-bottom: -22px;
    margin-left: 0;
    background-color: #f4f4f4;
    border: 2px solid #f4f4f4;
    height: 18px;
    width: 23px
}
.btn-forum-nick img{
    display: none/* фикс отсутствия клан-иконки*/
}
 .btn-forum-level b{
    font-size: 14px;
    padding: 0 25px 0 0;
    height: 18px;
    text-align: right;
    float: right
}
.btn-forum-nick:hover, .btn-forum-nick:focus, .btn-forum-nick:active, .btn-forum-nick:hover a {color: #FF5722 !important}
.btn-forum-nick a:hover {text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.33)}
/*----------------------------------------------*/
/* 5. Race image */
/*----------------------------------------------*/
.race {}
.race-image {
    background-color: #f4f4f4;
    border: 3px solid #f4f4f4;
    display: inline-block;
    line-height: 1.42857;
    /*margin: -5px -1px -2px 59px;*/
    height: 19px;
    width: 19px;
    float: right;
    position: relative;
    right: 5px;
    z-index: 2
}
/*----------------------------------------------*/
/* 6. Actions */
/*----------------------------------------------*/
.forum-status{
    border: 3px solid #f4f4f4;
    border-radius: 50%;
    cursor: help;
    display: inline-block;
    line-height: 1.42857;
    height: 20px;
    width: 20px;
    position: relative;
    top: 8px;
    right: -167px;
    z-index: 10;
    -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.04);
       -moz-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.04);
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.04);
    -webkit-transition: all 0.3s;
       -moz-transition: all 0.3s;
         -o-transition: all 0.3s;
            transition: all 0.3s
}
.forum-status:hover{
    border: 3px solid #f5f5f5;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14);
    -webkit-transform: scale(1.1, 1.1);
       -moz-transform: scale(1.1, 1.1);
        -ms-transform: scale(1.1, 1.1);
         -o-transform: scale(1.1, 1.1);
            transform: scale(1.1, 1.1)
}
/*----------------------------------------------*/
/* 7. Block nick */
/*----------------------------------------------*/
.block_nick {
    padding: 2px 3px;
    margin: 1px 2px;
    word-wrap: break-word
 }
 .answer-for-me{
    background: #E5CCCA;
    border: solid #524557;
    border-width: 0 0 1px 0;
    color: #524557;
    margin:10px 0;
 }
/*----------------------------------------------*/
/* 8. Forum setting */
/*----------------------------------------------*/
table.table3 {
    background-color: #E5DCCB !important;
    border: 1px solid #E5DCCB !important;
    border-collapse: collapse;
    margin-bottom: 15px !important;
    -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
       -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
            box-shadow: 0 0 10px 5px rgba(0,0,0,0.1)
}
table.table3 th {
    background-color: #7FA0A9;
    border: solid #7FA0A9 !important;
    border-width: 1px 1px 0 1px !important;
    color: #FFF;
    font-size: 12px;
    padding: 10px 15px !important;
    text-align: left
}
tr.message_footer > td[rowspan="2"]:first-child{
    background-color: #E5DCCB !important;
    border:solid #524557 !important;
    border-width: 0 1px 0 0 !important;
    margin: 5px !important
}
td.td-forum-message{
    background-color: #E5DCCB !important;
    border:solid #E5DCCB !important;
    border-width: 0 1px 0 0 !important;
}
tr.tr-forum-message{
    background-color: #524557 !important;
    border: solid #524557 !important;
    border-width: 1px 0 0 0 !important
}
tr.message_footer{height: 20px}
.table3 > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1){width: 300px !important}
tr.message_footer>td:first-child[rowspan="2"] {border: 1px solid #E5DCCB;width: 300px !important}
table.table3 {
    margin: 0 auto;
    max-width: 1300px;
    padding: 0 15px;
    position: relative
}
table.forum td {
    background-image: none !important;
}
/*----------------------------------------------*/
/* 9. Forum textarea setting */
/*----------------------------------------------*/
table.wblight{
    background-color: #E5DCCB !important;
    border:solid #E4EBEC !important;
    border-width: 0 1px 0 0 !important;
    width: 1300px;
    -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
       -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
            box-shadow: 0 0 10px 5px rgba(0,0,0,0.1)
}
table.wblight > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > font:nth-child(1) > input:nth-child(1),table.wblight, #nm_txta{color: #6D5C73 !important}
table.wblight > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > font:nth-child(1) > input:nth-child(1),
#nm_txta{
    border-collapse: collapse;
    background-color: #A7C5BD !important;
    border: 1px solid #524557 !important;
    color: #524557 !important;
    margin: 0 15px 0 0;
    min-height: 180px
    outline: none;
    padding: 5px;
    width: 100%;
    -webkit-border-radius: 4px;
       -moz-border-radius: 4px;
            border-radius: 4px
}
table.wblight > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2){padding: 0 15px 0 0}
table.wblight > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > input:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2) > input:nth-child(1),
input[type="submit"] {
    border: none;
    color: #fff;
    background-color: #f85050;
    cursor: pointer;
    width: auto
}
table.wblight > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > b:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > span:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2){
    color: #6D5C73 !important
}
table.wblight > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1),
table.wblight > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1){
    padding: 5px 110px 5px 10px
}
table.wblight > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > font:nth-child(1){
    color: #fff !important;
    background-color: #f85050 !important;
}
table.table3 th {
    background-color: #524557 !important;
    border: solid #524557 !important;
    border-width: 1px 1px 0 1px !important;
    color: #FFF;
    font-size: 12px;
    padding: 10px 15px !important;
    text-align: left;
}

.links-forum-text, .links-forum-text:hover{
    margin: 5px 7px !important;
}

.links-forum-text:hover, .links-forum-text a:hover{
    color: #524557 !important;
        text-decoration: none !important;
}
/*----------------------------------------------*/
/* 10. Other */
/*----------------------------------------------*/
.block_date{
    background-color: #fff !important;
    border-width: 0 !important;
    width: 100%
}
table.forum tr.message_footer td {
    background-color: #E5DCCB !important;
    border:solid #A7C5BD !important;
    border-width: 0 !important;
    color: #6D5C73;
    padding: 10px
}
/*----------------------------------------------*/
/* 11. Navbar */
/*----------------------------------------------*/
.navbar-nav {margin: 0 0 0 9px;width: 200px}
.nav, .nav ul li {list-style: none;padding: 0;text-align: left}
.navbar-nav > li {text-align: left}
.navbar-nav > li.drop {position: relative;width: 180px}
.navbar-nav > li:first-child {margin-left: 0}
.navbar-nav > li > a {
    color: #f4f4f4;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-family: sans-serif;
    font-weight: 300;
    line-height: 1.42857;
    margin: 1px;
    overflow: hidden;
    padding: 0 5px 0 25px;
    position: relative;
    text-align: left;
    text-decoration: none !important;
    vertical-align: middle;
    z-index: 2;
    -webkit-transition: all 0.17s ease-in-out;
       -moz-transition: all 0.17s ease-in-out;
         -o-transition: all 0.17s ease-in-out;
            transition: all 0.17s ease-in-out;
    -webkit-backface-visibility: hidden
}
.navbar-nav > li.drop > a {padding-right: 1px}
.navbar-nav > li > a.active {color: #f4f4f4 !important}
.navbar-nav > li > a:hover {color: #0077f9}
.nav > li > a:hover, .nav > li > a:focus {background-color: transparent;text-decoration: none}
ul.drop-down {
    border: 1px solid transparent;
    margin-left: -42px;
    opacity: 0;
    position: absolute;
    top: 100%;
    visibility: hidden0/;
    z-index: 3;
    -webkit-transition: all 0.17s ease-in-out;
       -moz-transition: all 0.17s ease-in-out;
         -o-transition: all 0.17s ease-in-out;
            transition: all 0.17s ease-in-out;
    -webkit-backface-visibility: hidden;
       -moz-backface-visibility: hidden;
            backface-visibility: hidden;
    -webkit-transform-origin: 0 0;
       -moz-transform-origin: 0 0;
        -ms-transform-origin: 0 0;
         -o-transform-origin: 0 0;
            transform-origin: 0 0;
    -webkit-transform: rotateX(-90deg);
       -moz-transform: rotateX(-90deg);
        -ms-transform: rotateX(-90deg);
         -o-transform: rotateX(-90deg);
            transform: rotateX(-90deg);
    -webkit-transition: -webkit-transform 0.4s, opacity 0.1s 0.3s;
       -moz-transition: -moz-transform 0.4s, opacity 0.1s 0.3s;
         -o-transition: -o-transform 0.4s, opacity 0.1s 0.3s;
            transition: transform 0.4s, opacity 0.1s 0.3s
}
.navbar-nav > li:hover > ul.drop-down {
    border: 1px solid transparent;
    margin-left: -42px;
    opacity: 1;
    visibility: visible;
    -webkit-transform: rotateX(0deg);
       -moz-transform: rotateX(0deg);
        -ms-transform: rotateX(0deg);
         -o-transform: rotateX(0deg);
            transform: rotateX(0deg);
      -webkit-transition: -webkit-transform 0.4s, opacity 0.1s;
         -moz-transition: -moz-transform 0.4s, opacity 0.1s;
           -o-transition: -o-transform 0.4s, opacity 0.1s;
              transition: transform 0.4s, opacity 0.1s
}
ul.drop-down li a {
    background: #95B28A;
    color: #f4f4f4 !important;
    cursor: pointer;
    display: block;
    font-weight: 300;
    font-size: 13px;
    line-height: 1.42857;
    margin: 1px;
    opacity: 1;
    overflow: hidden;
    padding: 1px 5px 1px 35px;
    text-align: left;
    text-decoration: none !important;
    vertical-align: middle;
    width: 180px;
    -webkit-transition: all 0.17s ease-in-out;
       -moz-transition: all 0.17s ease-in-out;
         -o-transition: all 0.17s ease-in-out;
            transition: all 0.17s ease-in-out
}
ul.drop-down li {position: relative}
ul.drop-down li:first-child a {background: #95B28A;border-top: none}
ul.drop-down li a:hover {opacity: 0.9}
/*----------------------------------------------*/
/* 12. Pagination */
/*----------------------------------------------*/
ul.pagination {display: inline-block;margin: 5px 0;padding: 0}
ul.pagination li {display: inline;line-height: 24px}
ul.pagination li a {
   background-color: #E5DCCB;
   border: 1px solid #E5DCCB;
   color: #524557;
   float: left;
   line-height: 1.42857143;
   margin: 0 0 0 -1px;
   padding: 6px 12px;
   position: relative;
   text-decoration: none;
    -webkit-transition: all 0.17s ease-in-out;
       -moz-transition: all 0.17s ease-in-out;
         -o-transition: all 0.17s ease-in-out;
            transition: all 0.17s ease-in-out
}
.pagination > li:first-child > a{
    margin-left: 0;
       -webkit-border-top-left-radius:5px;
    -webkit-border-bottom-left-radius:5px;
           -moz-border-radius-topleft:5px;
        -moz-border-radius-bottomleft:5px;
               border-top-left-radius:5px;
            border-bottom-left-radius:5px
}
ul.pagination li a.active {
   background-color: #524557;
   border: 1px solid #524557;
   color: #E5DCCB;
   cursor: default;
   margin-bottom: -1px;
   text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
   z-index: 2
}
ul.pagination li a:hover:not(.active) {
   background-color: #EE7C5A;
   border: 1px solid #EE7C5A;
   color: #303030
}
/*----------------------------------------------*/
/* 13. Breadcrumbs */
/*----------------------------------------------*/
.breadcrumbs{
    background: #524557;
    border-width: 1px;
    border-style: solid;
    border-color: #524557;
    border-radius: 5px;
    box-shadow: 0 0 2px rgba(0,0,0,.2);
    margin: 0 auto;
    padding: 3px;
    overflow: hidden;
    width: 1300px;
    -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
       -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);
            box-shadow: 0 0 10px 5px rgba(0,0,0,0.1)
}
.breadcrumbs li{float: left;list-style: none}
.breadcrumbs a{
    padding: .7em 1em .7em 2em;
    float: left;
    text-decoration: none;
    color: #444;
    position: relative;
    text-shadow: 0 1px 0 rgba(255,255,255,.5);
    background-color: #E5DCCB;
    -webkit-transition: all 0.95s ease 0s;
       -moz-transition: all 0.95s ease 0s;
         -o-transition: all 0.95s ease 0s;
            transition: all 0.95s ease 0s
}
.breadcrumbs li:first-child a{
    padding-left: 1em;
    border-radius: 5px 0 0 5px
}
.breadcrumbs li:last-child a{
    background: #EE7C5A;
    color: #E5DCCB;
    text-shadow: 0 1px 1px rgba(0,0,0,.3)
}
.breadcrumbs a:hover{
    background: #EE7C5A;
    color: #524557;
    text-shadow: none
}
.breadcrumbs a::after,
.breadcrumbs a::before{
    content: "";
    position: absolute;
    top: 50%;
    margin-top: -1.5em;
    border-top: 1.5em solid transparent;
    border-bottom: 1.5em solid transparent;
    border-left: 1em solid;
    right: -1em;
    -webkit-transition: all 0.95s ease 0s;
       -moz-transition: all 0.95s ease 0s;
         -o-transition: all 0.95s ease 0s;
            transition: all 0.95s ease 0s
}
.breadcrumbs a::after{z-index: 2;border-left-color: #E5DCCB}
.breadcrumbs li:last-child a::after{z-index: 2;border-left-color: #EE7C5A}
.breadcrumbs a::before{
    border-left-color: #524557;
    right: -1.1em;
    z-index: 1
}
.breadcrumbs a:hover::after{
    border-left-color: #EE7C5A
}
.breadcrumbs .current,
.breadcrumbs .current:hover{
    font-weight: bold;
    background: none
}
.breadcrumbs .current::after,
.breadcrumbs .current::before{
    content: normal
}
.action{}
/*----------------------------------------------*/
/* 14. Quick Links */
/*----------------------------------------------*/

ul.quicklinks {
    display: inline-block;
    margin-top: -3px;
    padding: 0;
    -webkit-box-shadow: 0 5px 5px 0 rgba(0,0,0,0.51);
       -moz-box-shadow: 0 5px 5px 0 rgba(0,0,0,0.51);
            box-shadow: 0 5px 5px 0 rgba(0,0,0,0.51)
}
ul.quicklinks li {display: inline;line-height: 24px}
ul.quicklinks li a {
    background-color: #E5DCCB;
    border: 1px solid #E5DCCB;
    color: #524557;
    float: left;
    line-height: 1.42857143;
    margin: 0 0 0 -1px;
    padding: 6px 12px;
    position: relative;
    text-decoration: none;
    -webkit-transition: all 0.17s ease-in-out;
       -moz-transition: all 0.17s ease-in-out;
         -o-transition: all 0.17s ease-in-out;
            transition: all 0.17s ease-in-out
}
.quicklinks > li:first-child > a{
    margin-left: 0;
      -webkit-border-top-left-radius:4px;
    -webkit-border-bottom-left-radius:4px;
           -moz-border-radius-topleft:4px;
        -moz-border-radius-bottomleft:4px;
               border-top-left-radius:4px;
            border-bottom-left-radius:4px
}
ul.quicklinks li a:hover {
    background-color: #E4EBEC;
    border: 1px solid #E4EBEC;
    color: #303030;
    -webkit-box-shadow: 0 0 1px 1px rgba(0,0,0,0.15);
       -moz-box-shadow: 0 0 1px 1px rgba(0,0,0,0.15);
            box-shadow: 0 0 1px 1px rgba(0,0,0,0.15)
}
/*----------------------------------------------*/
/* 15. Buttons */
/*----------------------------------------------*/
.forum-text{
    color: #6D5C73;
    line-height: 1.28;
    min-height: 236px;
    padding: 7px;
    white-space: pre-line;
    width: 100%
}
.blockanswer {
    float: right;
    line-height: 16px;
    padding: 3px 7px 7px 3px;
    position: relative;
    margin: 0 auto -5px;
    bottom: 0
}
.btn-group{margin: 0 5px 10px 0}
.btn {
    background-color: #333;
    background-image: none;
    border: 0;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    margin: 0;
    padding: 6px 16px;
    position: relative;
    vertical-align: middle;
    -webkit-transition: all 0.95s ease 0s;
       -moz-transition: all 0.95s ease 0s;
         -o-transition: all 0.95s ease 0s;
            transition: all 0.95s ease 0s
}
.btn a, .btn a:link{color: #fff !important}
.btn a:hover{color: #524557 !important}
.btn a:visited{color: #f4f4f4 !important}
.btn:hover, .btn:focus {
    background-color: #222;
    color: #fff;
    outline: 0;
    text-decoration: none
}
.btn_small {padding: 2px 8px;font-size: 11px}
.btn_norm {font-size: 12px;margin-bottom: 1px;padding: 3px 8px}
.btn_large {font-size: 18px;padding: 12px 28px}
.btn_expand {display: block;width: 100%}
/*----------------------------------------------*/
/* 16. Color buttons & actions */
/*----------------------------------------------*/
.red {background-color: #D32F2F;color: #FFCDD2}
.red:hover {background-color: #F44336;color: #fafafa}

.pink {background-color: #C2185B;color: #F8BBD0}
.pink:hover {background-color: #E91E63;color: #fafafa}

.purple {background-color: #7B1FA2;#E1BEE7}
.purple:hover {background-color: #9C27B0;color: #fafafa}

.deep_purple {background-color: #512DA8;color: #D1C4E9}
.deep_purple:hover {background-color: #673AB7;color: #fafafa}

.indigo, .battle {background-color: #303F9F;color: #C5CAE9}
.indigo:hover, .battle:hover {background-color: #3F51B5;color: #fafafa}

.blue {background-color: #1976D2;color: #BBDEFB}
.blue:hover {background-color: #2196F3;color: #fafafa}

.light_blue {background-color: #0288D1;color: #B3E5FC}
.light_blue:hover {background-color: #03A9F4;color: #fafafa}

.bg_cyan {background-color: #6A9C8F;color: #D8E5E2}
.bg_cyan:hover {background-color: #89B0A6;color: #fafafa}

.teal {background-color: #00796B;color: #B2DFDB}
.teal:hover {background-color: #009688;color: #fafafa}

.bg_green, .online {background-color: #799E6B;color: #DBE5D7}
.bg_green:hover, .online:hover {background-color: #95B28A;color: #fafafa}

.light_green {background-color: #689F38;color: #DCEDC8}
.light_green:hover {background-color: #8BC34A;color: #fafafa}

.lime {background-color: #AFB42B;color: #F0F4C3}
.lime:hover {background-color: #CDDC39;color: #fafafa}

.yellow {background-color: #FBC02D;color: #FFF9C4}
.yellow:hover {background-color: #FFEB3B;color: #fafafa}

.amber {background-color: #FFA000;color: #FFECB3}
.amber:hover {background-color: #FFC107;color: #fafafa}

.bg_orange {background-color: #EE7C5A;color: #FFE0B2}
.bg_orange:hover {background-color: #F3A188;color: #fafafa}

.deep_orange, .offline {background-color: #E64A19;color: #FFCCBC}
.deep_orange:hover, .offline:hover {background-color: #FF5722;color: #fafafa}

.brown, .tavern {background-color: #5D4037;color: #D7CCC8}
.brown:hover, .tavern:hover {background-color: #795548;color: #fafafa}

.grey {background-color: #616161;color: #F5F5F5}
.grey:hover {background-color: #9E9E9E;color: #fafafa}

.bg_purple_grey, .blocked {background-color: #7E7482;color: #EBE7EC}
.bg_purple_grey:hover, .blocked:hover {background-color: #978E9B;color: #fafafa}

.black {background-color: #212121;color: #B6B6B6}
.black:hover {background-color: #727272;color: #F5F5F5}

.lvl {background-color: #607d8b;color: #fafafa}
.lvl:hover {background-color: #455A64}

.bg_light_blue {background-color: #3D96B2;color: #fafafa}
.bg_light_blue:hover {background-color: #5BADC7}

.bg_light_green {background-color: #A0BF42;color: #fafafa}
.bg_light_green:hover {background-color: #B3CD68}

.bg_indigo {background-color: #524557;color: #fafafa}
.bg_indigo:hover {background-color: #9E533C}

.bg_indigo_invers {background-color: #655C73;color: #fafafa}
.bg_indigo_invers:hover {background-color: #AE705D}

` );

var css;

if (typeof GM_addStyle == 'undefined') {
    /**
     * Example: GM_addStyle('* {color:red}')
     * @param {String} css
     */
    GM_addStyle(css);
}
else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
}
else if (typeof addStyle != "undefined") {
    addStyle(css);
}
else {
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
    }
}

/* Style End */
// add font-awesome

var obj;
obj = document.createElement("link");
obj.rel = "stylesheet";
obj.type = "text/css";
obj.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css";
document.getElementsByTagName("head")[0].appendChild(obj);
function prepareRequest(xhr) {
    xhr.overrideMimeType('text/html; charset=windows-1251');
}
improveForum();
function fixForumTableWidth() {
    $("font>i").wrap("<div class='blockquote'></div>");
    // костыль для выравнивания ширины верхней полосы оборачиванием в новую таблицу
    $("tr.message_footer:nth-child(n+1):nth-child(-n+14) > td:nth-child(2)").wrap("<table class='block_date'></table>");
    // убираем атрибуты ширины в левой колонке
    $('.table3 > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1)').removeAttr('width');
    // заменяем значение ширины в правой колонке
    $('.table3 > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(2)').attr('width', ' 90%');
}
function changeNewMessageForm($message_form) {
    var message = $('.table3 > tbody:nth-child(1) > tr:nth-child(odd) > td:nth-child(1)').addClass('td-forum-message');
    var input_submit = $message_form.find('input[name="subm"]').addClass('btn red');
    $('a:contains("К списку тем")').remove();
}
function highlightAnswerForMe(myNick) {
    var regex = new RegExp(/для\s([\w\sА-я]+):/gi);
    //var newtext = "<p class=\"block_nick\"><span class=\"btn_nick\"><a href='/pl_info.php?nick=$1'>$1</a> :</span></p>";
    var newtext = "<span class=\"btn_nick_text\"><a href='/pl_info.php?nick=$1'>$1</a>, </span>";
    var posts = $('.tr-forum-message');
    $('.forum-text').each(function () {
            var tx = $(this).text();
            if (regex.test(tx)) {
                var ht = tx.replace(regex, newtext);
                $(this).html(ht);
            }
        }
    );
    if (myNick) {
        $('.btn_nick').find(':contains("' + myNick + '")').parent().parent().parent().addClass('answer-for-me');
    }
}
///*
 function findUrls(text) {
 var source = (text || '').toString();
 var urlArray = [];
 var url;
 var matchArray;
 // Regular expression to find FTP, HTTP(S) and email URLs.
 var regexToken = /(((ftp|http|https?):\/\/)[\-\w@:;%_\+.~#?,&\/\/=]+)/g;
 // Iterate through any URLs in the text.
 while ((matchArray = regexToken.exec(source)) !== null) {
 var token = matchArray[0];
 urlArray.push(token);
 }
 return urlArray;
 }
 $(".forum-text").each(function (index, elem) {
 var mess = $(this).html();
 var urlArray = findUrls(mess);
 urlArray.forEach(function (url) {
 var temp = mess.split(url);
 mess = temp.join("<span class=\"btn btn_small bg_indigo_invers links-forum-text\"><i class=\"fa fa-link\"></i>  <a href=\"" + url + "\">" + url + "</a></span>");
 });
 $(elem).html(mess);
 });
 //*/
function makeAnswerAndQuoteButtons(cell) {
    var fonts = $(cell).children('font');
    if (!fonts.length) return;
    fonts.find("a[href*='add_name'] font:first").remove();
    fonts.find("a[href*='add_name']").text('Ответить');
    var btn = '<div class="btn-group btn-group-sm" role="group" aria-label="...">' +
        '<span class="btn btn-default bg_indigo_invers"><i class="fa fa-comments-o"></i> ' + fonts.find("a[href*='add_name']")[0].outerHTML + '</span>' +
        '<span class="btn btn-default bg_indigo"><i class="fa fa-clipboard"></i> <a style="text-decoration: none;" onmouseover="get_selection();" href="JavaScript:quoter()" title="Выделите текст, нажмите на эту кнопку для вставки цитаты">Цитировать</a></span>' +
        '</div>';
    var forum_text = $(cell).parent('tr').next().find('div.forum-text').parent();
    var answer_block = $("<div class='blockanswer'></div>").append(btn);
    answer_block.appendTo(forum_text);
    fonts.remove();
}
function defineUserAction(data) {
    const OFFLINE = 'В последний раз был';
    const ONLINE = 'Персонаж сейчас в игре';
    const BATTLE = 'Персонаж сейчас в бою';
    const TAVERN = 'Персонаж сейчас за карточным столом';
    var $user_action = $("<div>").html(data).find("table.wblight td.wb a[href*='sms-create.php']").parent().siblings('td'); // elements: <i>, <b>, <a>
    var user_action_text = $user_action.text();
    var user_action;
    if (user_action_text.indexOf(ONLINE) > -1) {
        user_action = '<div class="forum-status online" title="' + user_action_text + '"></div>';
    }
    else if (user_action_text.indexOf(OFFLINE) > -1) {
        user_action = '<div class="forum-status offline" title="' + user_action_text + '"></div>';
    }
    else if (user_action_text.indexOf(BATTLE) > -1) {
        user_action = '<a href="' + $user_action.find('a').attr('href') + '"><div class="forum-status battle" title="' + user_action_text + '"></div></a>';
    }
    else if (user_action_text.indexOf(TAVERN) > -1) {
        user_action = '<a href="' + $user_action.find('a').attr('href') + '"><div class="forum-status tavern" title="' + user_action_text + '"></div></a>';
    }
    else {
        user_action = '<div class="forum-status blocked" title="' + user_action_text + '"></div>';
    }
    return $("<div class='user'></div>").append(user_action);
}
function makeActionButtons(info_box, username, myNick) {
    var $buttons;
    if (username !== myNick) {
        var add_friend_link = $(info_box).find("[href*='friends.php?action=add']"); // link
        var is_friend = add_friend_link.length == 0; // boolean
        var photos_link = $(info_box).find("table>tbody>tr:first>td:last [href*='photo_pl_albums.php']"); // link
        var has_photos = photos_link.length > 0; // boolean
        var friends = (!is_friend) ? '<span class="btn-trans-nick transfer_forum bg_cyan"><a href="' + add_friend_link.attr('href') + '" style="text-decoration:none;"><i class="fa fa-users"></i>  Добавить в друзья</a></span>' : '';
        var photos = (has_photos) ? '<span class="btn-trans-nick transfer_forum bg_orange"><a href="' + photos_link.attr('href') + '" style="text-decoration:none;"><i class="fa fa-file-image-o"></i> Смотреть альбом</a></span>' : '';
        var mail = '<span class="btn-trans-nick transfer_forum bg_purple_grey"><a href="sms-create.php?mailto=' + username + '" style="text-decoration:none;"><i class="fa fa-file-text"></i> Написать письмо</a></span>';
        var transfer = '<span class="btn-trans-nick transfer_forum bg_orange"><a style="text-decoration: none;" href="transfer.php?nick=' + username + '">Передать ресурсы</a></span>';
        var alltransfer = '<ul class="nav navbar-nav center-block">' +
                              '<li class="drop bg_green"><a class="active" href="#"><i class="fa fa-angle-double-down"></i> Передать эл./рес.</a>' +
                                  '<ul class="drop-down">' +
                                      '<li><a style="text-decoration: none;" href="transfer.php?nick=' + username + '"><i class="fa fa-angle-right"></i> Ресурсы</a></li>' +
                                      '<li><a style="text-decoration: none;" href="el_transfer.php?nick=' + username + '"><i class="fa fa-angle-right"></i> Элементы</a></li>' +
                                  '</ul>' +
                              '</li>' +
                          '</ul>';
        $buttons = $("<div class='center-block'></div>").append(friends, mail, photos, alltransfer);
    }
    else {
        var $clan = $(info_box).find("[href*='clan_info.php?id=']"); // link
        var has_clan = $clan.length > 0;
        var clan_control;
        var my_photos = '<span class="btn-trans-nick transfer_forum bg_orange"><a style="text-decoration: none;" href="ephoto_albums.php"><i class="fa fa-file-image-o"></i> Редактор альбома</a></span>';
        if (has_clan) {
            var clan_href = $clan.attr('href');
            var clan_id = clan_href.substring(clan_href.indexOf("=") + 1);
            clan_control = '<ul class="nav navbar-nav center-block">' +
                               '<li class="drop bg_green"><a class="active" href="clan_control.php?id=' + clan_id + '"><i class="fa fa-angle-double-down"></i> Управление кланом</a>' +
                                   '<ul class="drop-down">' +
                                       '<li><a style="text-decoration: none;" href="clan_broadcast.php?id=' + clan_id + '"><i class="fa fa-angle-right"></i> Рассылка</a></li>' +
                                       '<li><a style="text-decoration: none;" href="clan_invites.php?id=' + clan_id + '"><i class="fa fa-angle-right"></i> Приглашения</a></li>' +
                                   '</ul>' +
                               '</li>' +
                           '</ul>';
            $buttons = $("<div class='center-block'></div>").append(my_photos, clan_control);
        }
        else {
            $buttons = $("<div class='center-block'></div>").append(my_photos);
        }
    }
    return $buttons;
}
function makeAvatar(data) {
    var avatar = $("<div>").html(data).find("td.wb img[src*='avatars']");
    if (avatar.length == 0) {
        avatar = $('<img width="150px" height="150px">').attr('src', GM_getResourceURL("default_avatar"));
    }
    return $("<div class='avatar'></div>").append(avatar.attr("align", "left"));
}
function makeLevelAndRace(info_box) {
    var name_lvl = $(info_box).find("tr:first b:first").text(); // text
    var lvl = name_lvl.substring(name_lvl.indexOf("[") + 1, name_lvl.indexOf("]")); // [number]
    var race_image = $(info_box).find("tr:first b:first").children("img:last"); // image
    var $race = $("<div class='race'></div>").append(race_image.addClass('race-image'));
    return $("<div class='btn-forum-level clearfix'></div>").append($('<b></b>').text(lvl + ' уровень')).append($race);
}
function makeForumNick(cell) {
    var forumnick = $(cell).find('nobr');
    return $("<div class='btn-forum-nick center-block'></div>").append(forumnick)
}
function addClassesToForum(leftcells) {
    $.each(leftcells, function (i, cell) {
            $(cell).parent('tr').next().find('td').wrapInner('<div class="forum-text"></div>');
        }
    );
    $('table.forum>tbody').children().addClass('tr-forum-message');
}
function makePagination() {
    var $pages, $pages_top, $active_page, $new_active_page, $newPagination;
    $pages = $('td>center>a').parent('center');
    $pages_top = $pages.first().children();
    $pages_top
        .wrapAll("<div></div>")
        .wrapAll("<ul class='pagination'></ul>")
        .wrap("<li></li>");
    $active_page = $pages.find('b>font').parent().first();
    $new_active_page = $('<a class="active"></a>').text($active_page.text());
    $active_page.replaceWith($new_active_page);
    $newPagination = $('<center></center>').append($('.pagination').parent());
    $pages.replaceWith($newPagination);
}
function makeBreadсrumbs() {
    $('font.forumt').parent().parent().children('a').wrapAll('<ul class="breadcrumbs"/>').wrap('<li/>');
    var getTextNodesIn = function (el) {
        return $(el).find(":not(iframe)").addBack().contents().filter(function () {
                return this.nodeType == 3;
            }
        );
    };
    var $breadcrumbs = $('ul.breadcrumbs');
    // remove fonts in links
    var fonts = $breadcrumbs.find('font.forumt');
    $.each(fonts, function (i, font) {
            $(font).replaceWith($(font).text());
        }
    );
    // remove garbage like "-->"
    var textNodes = getTextNodesIn($breadcrumbs.parent());
    textNodes[1].remove();
    textNodes[2].remove();
    $breadcrumbs.prepend('<li><a href="home.php"><i class="icon fa fa-home" style="font-size: 15px"></i> Домой</a></li>');
    $breadcrumbs.find('li:last a').addClass('action').removeAttr('href', '');
}
function makeQuickLinks() {
    var $simpleQuickLinks = $('center>center>a.pi').parent('center');
    var $skilledQuickLinks = $('div#breadcrumbs li.subnav>nobr>a.pi').closest('div');
    var $newQuickLinks, $newQuickSkills, $skills;
    if ($skilledQuickLinks.length) {
        $skilledQuickLinks.first().find('nobr').children()
            .wrapAll("<div></div>")
            .wrapAll("<ul class='quick-links'></ul>")
            .wrap("<li></li>");
        $skills = $skilledQuickLinks.last().remove();
        $skills.find('font').remove();
        $newQuickSkills = $skills.find('a')
            .wrapAll("<div></div>")
            .wrapAll("<ul class='quick-skills'></ul>")
            .wrap("<li></li>");
        $newQuickLinks = $('<center></center>')
            .append($('.quick-links').parent())
            .append($newQuickSkills.closest('div'));
        $skilledQuickLinks.replaceWith($newQuickLinks);
        $('.quick-links').closest('center').children().wrapAll('<div class="quick-navigation"></div>');

        $('.quick-links').removeClass('quick-links').addClass('pagination');
        $('.quick-skills').removeClass('quick-skills').addClass('pagination');

    } else if ($simpleQuickLinks.length === 1) {
        $simpleQuickLinks.first().children()
            .wrapAll("<div></div>")
            .wrapAll("<ul class='quick-links'></ul>")
            .wrap("<li></li>");
        $newQuickLinks = $('<center></center>').append($('.quick-links').parent());
        $simpleQuickLinks.replaceWith($newQuickLinks);
        $('.quick-links').removeClass('quick-links').addClass('pagination');
    }
}
function improveForum() {
    var $message_form = $('form[name="newmsg"]');
    var myNick = $message_form.find('table.wblight tbody>tr:first>td:last>b').text();
    var leftcells = $('tr.message_footer>td:first-child');
    addClassesToForum(leftcells);
    changeNewMessageForm($message_form);
    highlightAnswerForMe(myNick);
    fixForumTableWidth();
    makePagination();
    //////////////////
    makeQuickLinks();
    //makeFixLinks();
    makeBreadсrumbs();

    $.each(leftcells, function (i, cell) {
        var $cell = $(cell);
            var userinfo = $cell.find("[href*='pl_info.php?id=']").attr('href');
            var username = $cell.find("[href*='pl_info.php?id=']").text();
            $.when(
                $.ajax(
                    {
                        url: userinfo, dataType: "html", beforeSend: prepareRequest
                    }
                )
            ).done(function (data) {
                    // (+) #8285 Alena17 [14] Wizard Photos
                    var info_box = $("<div>").html(data).find("table.wblight tr:first td.wb:first");
                    if (!$cell.find('br').length) {
                        $cell.append($('<br>'));
                    }
                    var $placeholder = $cell.find('br');
                    var $nick = makeForumNick($cell);
                    var $level = makeLevelAndRace(info_box);
                    var $action = defineUserAction(data);
                    var $avatar = makeAvatar(data);
                    var $buttons = makeActionButtons(info_box, username, myNick);
                    // INSERTING FORMED ELEMENTS
                    $placeholder.after($nick, $level, $action, $avatar, $buttons);
                    makeAnswerAndQuoteButtons($cell);
                }
            );
        }
    );
}
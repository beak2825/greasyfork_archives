// ==UserScript==
// @name         Тёмная тема для qna.habr.com
// @namespace    http://tampermonkey.net/
// @version      2025-05-09
// @description  Тёмная тема интерфейса для qna.habr.com
// @author       dim5x
// @icon         https://www.google.com/s2/favicons?sz=64&domain=habr.com
// @match        https://qna.habr.com/*
// @grant        GM_addStyle
// @homepageURL  https://greasyfork.org/ru/scripts/535315-%D1%82%D1%91%D0%BC%D0%BD%D0%B0%D1%8F-%D1%82%D0%B5%D0%BC%D0%B0-%D0%B4%D0%BB%D1%8F-qna-habr-com   
// @supportURL   https://greasyfork.org/ru/scripts/535315-%D1%82%D1%91%D0%BC%D0%BD%D0%B0%D1%8F-%D1%82%D0%B5%D0%BC%D0%B0-%D0%B4%D0%BB%D1%8F-qna-habr-com/feedback
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/535315/%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20qnahabrcom.user.js
// @updateURL https://update.greasyfork.org/scripts/535315/%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20qnahabrcom.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_addStyle(`
/* ================= Общие стили ================= */
:root {
    --dark-bg: #505b6e; /*Общий фон*/
    --dark-text: #e0e0e0;
    --light-bg: #e0e0e0;
    --light-text: #000;
    --accent-green: #65c178;
    --input-bg: #3a4457;
    --code-bg: #CED4D4;
    --hover-bg: #eef2f5;
}

::-webkit-scrollbar {
    width: 14px; /* Общая ширина с учетом отступов */
    height: 12px; /* Общая высота с учетом отступов */
}

::-webkit-scrollbar-track {
    background: #ced4d4;
    border: solid 1px black;
    margin: 2px; /* Отступ трека от краев */
}

::-webkit-scrollbar-thumb {
    background: #515c6e;
    border-radius: 3px;
    border: 2px solid transparent; /* Прозрачная граница создает отступ */
    background-clip: content-box; /* Ограничивает фон только внутренней областью */
}

::-webkit-scrollbar-thumb:hover {
    background: #505E5E;
    border: 2px solid transparent;
    background-clip: content-box;
}

/* ------------------------- */
/* Верхнее левое меню "Хабр" */
/* ------------------------- */

#dropdown {
    border: solid 1px #000;
}

/* Меняем цвет SVG элементов */
path {
    fill: #e0e0e0; /* Белый цвет */
}

/* ----------end------------ */

header,
aside,
button,
a.service,
div.layout__body::before,
dl, dd, dt,
.page_header {
    background: #505b6e !important;
    color: #fff !important;
}

nav {
    background: #505b6e !important;
    color: #000 !important;
}

/*Поиск. #3a4457 - серый цвет.*/
input {
    background: #3a4457 !important;
}


.ui-menu-item a:hover {
    background: #CED4D4 !important;
    color: #505b6e !important;
}


ul,
.form_comments, /* Рамка вокруг поля комментариев */
.events-list__item.event_navbar {
    background: #505b6e !important;
}


a.filters-menu__link {
    background: #505b6e !important;
    color: #e0e0e0 !important;
    border: none;
}

/* Кнопка подписаться. #65c178 */
button.btn.btn_subscribe,
button.btn.btn_outline_green,
button.btn.btn_outline_grey,
.btn_solution,
.btn_like,
.btn_complexity-filter,
.filters-menu.filters-menu_mobile {
    color: #71c07b !important;
    border: 1px solid !important;
    border-color: #71c07b !important;
}

button.btn.btn_subscribe:hover,
button.btn.btn_outline_grey:hover,
button.btn.btn_outline_green:hover,
.btn_solution:hover,
.btn_like:hover,
.btn_complexity-filter:hover {
    border-color: #369249 !important;
    background: #505b6e !important;
}

.filters-menu__link_active {
    border: 2px solid !important;
    border-color: #71c07b !important;
}

/* To-do Кнопка закрыть при выборе сложности вопросов */
.popup__close-btn:hover {
    color: red !important;
}


/* Альтернативный ник */
.user-summary__nickname {
    color: #CED2D4 !important;
}

/*       Теги в "Задать вопрос"         */
.ui-widget-content.ui-autocomplete-input {
    background-color: #515c6e !important;
    color: #e0e0e0 !important;
    border: solid 1px #e0e0e0;
}

a.tagit-close .text-icon,
.tagit-label {
    color: #e0e0e0 !important
}

/* Цвет отредактированного вопроса, который принял модератор */
.question__title-link {
    color: #CFD6E3 !important;
}

/* -------------------------------  */
/*        Задать вопрос             */
/* -------------------------------  */
#question_title {
    background: #515c6e !important;
    color: #e0e0e0
}

.page__header-title.page__header-title_bordered,
.field__label,
.ui-menu-item strong, /*Все результаты по запросу*/
.fieldset__title, .fieldset__notice-type /* Настройка уведомлений */
{
    color: #e0e0e0 !important;
}

.selectBox-options > li.selectBox-hover a {
    background: #e0e0e0 !important;
    color: #000 !important;
}

.ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content.ui-corner-all.utocomplete_tags {
    background: #e0e0e0 !important;
    color: #000 !important;
}

/* --------------end-----------------  */


/* ----------------------------------- */
/*           Код, подсветка            */
/* ----------------------------------- */
pre, code, textarea {
    border: solid 2px #000;
    background: #CED4D4 !important;
    color: #000 !important;
}

textarea {
    border: none;
}


.hljs {
    color: #000 !important;
    background: #CED4D4 !important;
}

.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
    color: #693CBE !important;
}

.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
    color: #AE2431 !important;
}

.hljs-built_in,
.hljs-symbol {
    color: #923F07 !important;
}

.hljs-code,
.hljs-comment,
.hljs-formula {
    color: #545454 !important;
}

.menu_dropdown .menu__item-link {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    padding: 12px;
    transition: all .3s ease-out;
    font-weight: 700;
    font-size: 14px;
    color: #000;
    background: #e0e0e0; /*#e0e0e0;*/
    text-decoration: none;
    border-bottom: solid 1px #000;
}

/* --------------end--------------------- */


a.menu_item-link {
    background: red !important
}

.icons-bar.icons-bar_horizontal {
    background: #e0e0e0 !important;
    border: solid 1px #000;
}

.icons-bar__item_control {
    color: #506273 !important;
}

.btn__counter {
    border-left: 1px solid #65c178 !important;
    color: #fff !important;
}

a.filters-menu__link.filters-menu__link_active {
    border: solid;
}


.section-header {
    border-bottom: 2px solid #e0e0e0;
}

/* ----------------------------------- */
/*           Modul window              */
/* ----------------------------------- */
.checkbox__label, .radio__label {
    color: #65c178;;
}

/* Кнопка закрыть в выборе сложности вопроса */
.popup__close-btn span {
    white-space: nowrap;
    font-size: 14px;
    color: #65c178;
}

.menu_popup .menu__item, .menu_popup .chzn-results > li {
    float: none;
    margin: 0;
    display: block;
    border-bottom: 1px solid #f0f0f0 !important;
    padding: 12px;
}


/* ----------------------------------- */
/*  Меню вопроса: жалоба / редакция    */
/* ----------------------------------- */

.menu_dropdown a.menu__item-link {
    color: black !important;
    background: #ced4d4 !important;
}

a.menu__item-link:hover,
#abuse_question_link_1396548:hover {
    background: #eef2f5 !important;
}

#abuse_question_link_1396548 {
    background: #CED4D4 !important;
}

/* ---------------end----------------- */

a, h1, .question__views-count, .question__date, .section-header__title {
    color: #e0e0e0 !important;
}


.question__title-link {
    color: #000;
}


p, div {
    background: #505b6e !important;
    color: #e0e0e0 !important;
}

li.content-list__item {
    border-bottom: none;
}

.svg-icon_level {
    position: relative !important;
    display: inline-block !important;
    width: 1em !important;
    height: 1em !important;
}

/* ------------------------------------------- */
/* Меняем значки сложности вопросов на 🟢🟠🔴 */
/* ------------------------------------------- */
/* Скрываем оригинальное содержимое            */
.svg-icon_level > * {
    display: none !important;
}

/* Добавляем emoji как псевдоэлемент           */
.svg-icon_level::after {
    content: attr(data-emoji);
    position: absolute;
    left: 0;
    top: 0;
    font-size: 1em;
    line-height: 1;
    /* color: hsl(0, 60 %, 45 %) !important; Менее насыщенный */
    opacity: 0.7 !important;
    filter: brightness(0.9) !important;
}

/* Цвета для разных уровней */
.svg-icon_level-2::after {
    content: "🟢" !important;
}

.svg-icon_level-3::after {
    content: "🟠" !important;
}

.svg-icon_level-4::after {
    content: "🔴" !important;

    `);
})();
// ==UserScript==
// @name       для маленьких мальчиков || Black Style
// @namespace  
// @version    0.1
// @description  by Wasabi
// @match     https://logs.blackrussia.online/
// @match      https://logs.blackrussia.online/*
// @copyright  2013, yourname
// @downloadURL https://update.greasyfork.org/scripts/478538/%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B8%D1%85%20%D0%BC%D0%B0%D0%BB%D1%8C%D1%87%D0%B8%D0%BA%D0%BE%D0%B2%20%7C%7C%20Black%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/478538/%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B8%D1%85%20%D0%BC%D0%B0%D0%BB%D1%8C%D1%87%D0%B8%D0%BA%D0%BE%D0%B2%20%7C%7C%20Black%20Style.meta.js
// ==/UserScript==
// common function in css to change css style
function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
GM_addStyle('#loading-overlay[data-v-173ec149] {background-color: hsl(0deg 0% 0% / 92.5%);#loading-overlay-heading[data-v-173ec149] {color: #444;'); // "пожалуйста подождите"


GM_addStyle('.dp__input {background-color:black;color: #9a9696}'); // цвет плашки даты
GM_addStyle("a {color: gray;tr {color: black};.bi-question-circle-fill::before {color: gray;};--bs-body-bg: #d70000"); // цвет категорий (ip,деньги, примечания)
GM_addStyle('body {background-color: black ;'); //  задний фон
GM_addStyle('#log-table[data-v-2d76ca92]>:not(caption)>*>*, .table>:not(caption)>*>* {background-color: #f9f0f0; border-bottom-width: 1px;box-shadow: inset 0 0 0 9999px #000000fa; padding: .5rem;color: #a19f9f}'); // таблица логов\
GM_addStyle('.td-category[data-v-2d76ca92] a[data-v-2d76ca92] {color: #3d67a3;}');// категории в таблице
GM_addStyle('#log-table[data-v-2d76ca92] .second-row[data-v-2d76ca92] {background-color: #a19f9f; border: 1px solid #a19f9f;border-top: none;}'); //цвет обводки таблицы
GM_addStyle('.multiselect-search {background: #262525};'); //обводка выбора
GM_addStyle('#log-filter-section[data-v-2d76ca92] {background: #090909;border: 1px solid #3e423e;');
GM_addStyle('.multiselect-dropdown {background: black;;color:#9a9696 };'); // цвет кнопок в меню выборе
GM_addStyle('.autoComplete_wrapper>input {background-color: black;color: #dd7373;}'); //обводка выбора
GM_addStyle('.form-control {color:#9a9696,background-color: black'); //обводка выбора
GM_addStyle('.input-group>:not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback):not(.field-error) {background-color: black;color:#9a9696}'); //обводка  денег
GM_addStyle('.input-group.has-validation>.dropdown-toggle:nth-last-child(n+4), .input-group.has-validation>:nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu), .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3), .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {background-color: black;color:#9a9696;}'); // цвет ид/ип
GM_addStyle('.dropdown-menu.show { background-color: #090909;}; .lookup-symbol[data-v-2d76ca92] {color: white;}'); //обводка выбора

// ==UserScript==
// @name         Umschool script
// @namespace    http://tampermonkey.net/
// @version      0.6.2 beta
// @description  Скрипт для того, чтобы запускать вебинары на ютубе
// @author       https://vk.com/id227730745
// @match        https://umschool.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390861/Umschool%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/390861/Umschool%20script.meta.js
// ==/UserScript==

// работа с url сайта
var url = document.URL;
url = url.split('//')[1].split('/');

// для редактирования страницы
var button_main_style = '.yt_button_script {background-color: #be2413; border: none; border-radius: 20px; margin-left: 10px; color: white; padding: 5px 10.5px; margin-top: 7.5px; text-align: center; text-decoration: none; display: inline-block; font-size: 18px; font-weight: bold;} .yt_button_script:hover {background-color: #df3c2a;} .yt_button_script:active {background-color: #d96154;}';
var button_down_style = '.yt_button_down_script {background-color: #21c809; border: none; border-radius: 20px; color: white; padding: 5px 10.5px; margin-top: 7.5px; text-align: center; text-decoration: none; display: inline-block; font-size: 18px; font-weight: bold;} .yt_button_down_script:hover {background-color: #4de038;} .yt_button_down_script:active {background-color: #8edd83;}';
var bear_image_new_src = 'https://i.ibb.co/G089qYZ/bear-icon.png';
var hm_my_style = `hr {display: none} .exercise-item {background-color: #f7f6f6; padding: 15px; /*border: 0.5px solid #E6E6E6;*/ border-radius: 20px;}
    .float-right {float: none !important}
    .form-control[readonly] {border: 2px #43B15D solid}
    .form-control[style="background-color: #dc3545; color: #ffffff"] {border: 2px #b14b43 solid;}
    .form-control[style="background-color: rgb(220, 53, 69); color: rgb(255, 255, 255); --darkreader-inline-bgcolor:#86272e; --darkreader-inline-color:#ffffff;"] {border: 2px #b14b43 solid;} /*для тёмной темы Dark Reader*/`
var scroll_custom_style = '::-webkit-scrollbar-button { background-image:url(""); background-repeat:no-repeat; width:6px; height:0px } ::-webkit-scrollbar-thumb { webkit-border-radius: 5px; border-radius: 5px; background-color:#F19137; background-image:url("https://yraaa.ru/_pu/24/59610063.png"); background-position:center; background-repeat:no-repeat; } ::-webkit-resizer{ background-image:url(""); background-repeat:no-repeat; width:7px; height:0px } ::-webkit-scrollbar{ width: 11px; }';
var xp_levels = [ 0, 200, 700, 1500, 2350, 4350, 5200, 6050, 6900, 7750, 9750, 10600, 11450, 12300, 13150, 15150, 16000, 16850, 17700, 18550, 19400, 20250, 21550, 23050, 28050 ];

var autoloading = false; // переключатель автозапуска
if (getCookie('settings_autoloading')) autoloading = (getCookie('settings_autoloading') == '1')? true : false;
var experiment = false; // переключатель экспериментальных функций
if (getCookie('settings_experimental')) experiment = (getCookie('settings_experimental') == '1')? true : false;
var rem_toolbars = false; // переключатель убирания панели для полей ввода
if (getCookie('settings_remtoolbar')) rem_toolbars = (getCookie('settings_remtoolbar') == '1')? true : false;

var src;
var clock;
var timer = 1.5; // таймер для автозапуска
var initial_timer = 0; // таймер для поиска и добавления элементов

var styles = ''; // общая переменная для стилей


// блок кода для страницы веба
if (url[1] == 'mastergroup' & url[2] == 'lessons' & (url[4] == '' | url[4] == '#'))
{
    let elem = document.body.getElementsByClassName('preview-title')[0];
    if (!elem) elem = document.body.getElementsByClassName('date-container')[0];
    if (elem)
    {
        styles += button_main_style;
        elem.innerHTML += '<div><button class="yt_button_script">Открыть на YouTube</button><button class="yt_button_script" style="width: 40px !important"> + </button></div>';
        if (elem.classList[0] == 'preview-title' & experiment)
        {
            styles += button_down_style;
            elem.innerHTML += '<input class="yt_button_down_script" type="button" value="Скачать вебинар [β]" style="margin-left: 10px;"> ';
        }

        var button1 = document.body.getElementsByClassName('yt_button_script')[0];
        var buttonnew = document.body.getElementsByClassName('yt_button_script')[1];
        if (experiment) var button_down = document.body.getElementsByClassName('yt_button_down_script')[0];
    }

    if (autoloading)
    {
        clock = setTimeout(yt_start, timer * 1000);
    }

    if (button1)
    {
        button1.onclick = function click() { yt_start(); };
    }
    if (buttonnew)
    {
        buttonnew.onclick = function click() { yt_start_new(); };
    }
    if (button_down & experiment)
    {
        button_down.onclick = function click() { yt_download(); };
    }
}
else if (url[1] == 'core' & url[2] == 'profile' & url[3] == 'edit') // блок кода для страницы Профиля/Настроек
{
    let elem = document.body.getElementsByClassName('content')[0];
    if (elem)
    {
        var html = `<h3><b>Настройки Umschool script</b></h3>
<input class="settings_autoloading_toggler" type="checkbox"> Автозапуск вебинаров на ютубе
<br><input class="settings_experimental_toggler" type="checkbox"> Экспериментальные функции
<br><input class="settings_remtoolbar_toggler" type="checkbox"> Убрать панель у полей ввода
<br><a href="https://vk.com/id227730745" target="_blank" style="color: #f19137">По всем багам и вопросам писать сюда.</a>`;

        if (experiment)
        {
            var html_ex = '';
        }

        elem.innerHTML += html;

        var autoloading_toggler = elem.getElementsByClassName('settings_autoloading_toggler')[0];
        autoloading_toggler.checked = autoloading;

        var experimental_toggler = elem.getElementsByClassName('settings_experimental_toggler')[0];
        experimental_toggler.checked = experiment;

        var remtoolbar_toggler = elem.getElementsByClassName('settings_remtoolbar_toggler')[0];
        remtoolbar_toggler.checked = rem_toolbars;
    }

    if (autoloading_toggler)
    {
        autoloading_toggler.onclick = function click() { autoloading_toggle() };
    }

    if (experimental_toggler)
    {
        experimental_toggler.onclick = function click() { experimental_toggle() };
    }

    if (remtoolbar_toggler)
    {
        remtoolbar_toggler.onclick = function click() { remtoolbar_toggle() };
    }
}
else if (((url[1] == 'mastergroup' & url[2] == 'lessons' & url[4] == 'homework') |
    (url[1] == 'homework' & url[2] == 'submissions')) & experiment)
{
    styles += hm_my_style;
}

// Для отображения в заголовке
if (url[1] == 'core' & url[2] == 'hw' & url[3] == 'my') {
    document.title = "Домашние задания";
}
else if (url[1] == 'mastergroup') {
    if (url[2] == 'lessons') {
        if (url[4] == '' | url[4] == '#') {
            let elem = document.body.getElementsByClassName('text-container')[0].children[0];
            document.title = elem.innerHTML;
        }
        else if (url[4] == 'homework') {
            let elem = document.body.getElementsByClassName('text-container')[0].children[0];
            elem = elem.innerHTML.split(' (')[0];
            document.title = elem;
        }
    }
    else {
        document.title = "Мастер-группы";
    }
}
else if (url[1] == 'teacher') {
    document.title = "Преподаватели";
}
else if (url[1] == 'core') {
    if (url[2] == 'profile') {
        document.title = "Главная страница";
    }
    else if (url[2] == 'loyalty') {
        document.title = "Мои достижения";
    }
}
else if (url[1] == 'course') {
    document.title = "Курсы";
}

// замена медведя
var bear_image = document.body.getElementsByClassName('bear-notifier-img')[0];
if (bear_image) {
    bear_image.src = bear_image_new_src;
}

// убирание новых полей ввода
if (rem_toolbars) {
    var fields_toolbars = document.body.getElementsByClassName('fr-toolbar');
    for (let i = 0; i < fields_toolbars.length; i++)
    {
        console.log(fields_toolbars[i]);
        fields_toolbars[i].remove();
        i--;
    }
}

// изменение отображения уровней
if (experiment)
{
    var xp_ind = document.body.getElementsByClassName('nav-level')[0];
    var points = Number(xp_ind.innerHTML.slice(0, -2));
    if (points != 0)
    {
        let b = xp_levels[0];
        let i = 0;

        while (points > xp_levels[i]) {
            b = xp_levels[i+1];
            i++;
        }
        xp_ind.innerHTML = points + 'XP [' + (b - points) + ']';
    }
}

if (experiment)
{
    var useless_image = document.body.getElementsByClassName('if-mobile')[1];
    useless_image.innerHTML = '';

    styles += scroll_custom_style;
}

// загрузка стилей на страницу
if (styles) document.head.innerHTML += '<style> ' + styles + ' </style>';


function autoloading_toggle()
{
    var val = (autoloading_toggler.checked)? '1' : '0';
    setCookie('settings_autoloading', val);
}

function experimental_toggle()
{
    var val = (experimental_toggler.checked)? '1' : '0';
    setCookie('settings_experimental', val);
    location.reload();
}

function remtoolbar_toggle()
{
    var val = (remtoolbar_toggler.checked)? '1' : '0';
    setCookie('settings_remtoolbar', val);
    location.reload();
}

function yt_start()
{
    src = document.body.getElementsByClassName('plyr__video-wrapper')[0].children[0].src;
    src = 'https://youtu.be/' + src.split('embed')[1].split('?')[0];
    window.location = src;
}
function yt_start_new()
{
    src = document.body.getElementsByClassName('plyr__video-wrapper')[0].children[0].src;
    src = 'https://youtu.be/' + src.split('embed')[1].split('?')[0];
    open(src);
}

function yt_download ()
{
    src = document.body.getElementsByClassName('plyr__video-wrapper')[0].children[0].src;
    src = 'https://ssyoutube.com/watch?v=' + src.split('embed/')[1].split('?')[0];
    open(src);
}

// для работы с cookie (с сайта https://learn.javascript.ru/cookie#prilozhenie-funktsii-dlya-raboty-s-kuki)
function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value) {

    var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    updatedCookie += '; path=/; domain=umschool.net; expires=Fri, 31 Dec 9999 23:59:59 GMT;';

    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

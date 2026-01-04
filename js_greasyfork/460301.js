// ==UserScript==
// @name         LK on drugs 2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  please just let me upload this
// @author       You
// @match        https://student.letovo.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=letovo.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460301/LK%20on%20drugs%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/460301/LK%20on%20drugs%2020.meta.js
// ==/UserScript==

const wait = selector => new Promise(resolve => {
    let i;
    i = setInterval(() => {
        try {
            const s = document.querySelector(selector);
            if(s){
                resolve(s);
                clearInterval(i);
            }
        } catch(_) {}
    }, 50);
});
const ondef = name => new Promise(resolve => {
    let i;
    i = setInterval(() => {
        try {
            const s = eval(name);
            if(s){
                resolve(s);
                clearInterval(i);
            }
        } catch(_) {}
    }, 50);
});

// Обычный ЛК
wait("body > div:nth-child(3) > div.container > div.col-12 > a:nth-child(1)").then(x => x.innerText = "Little Boarding Blooket");
wait("body > div:nth-child(3) > div.container > div.col-12 > a:nth-child(2)").then(x => x.innerText = "кто это читает лол");
wait("body > div.container-fluid.navbar > div > div > div.navbar-header.col-xs-6.col-md-6 > a > span.label").then(x => x.innerHTML = "<span style=\"font-weight: normal !important; display: inline-block; color: #555;\">Команда:</span> Дегенераты");
wait("body > div:nth-child(3) > div.container > div.row > div.row > div.col-xs-6.text-right > a").then(x => x.innerText = "АХАХАХАХАХ БЕСПОЛЕЗНАЯ КНОПКА");
wait("body > div.container-fluid.navbar > div > div > div.navbar-header.col-xs-6.col-md-6 > a > span.bold").then(x => x.innerText = "майнкрафт");
wait("body > div:nth-child(3) > div.container > div.row > div > form > div > label").then(x => x.innerText = "Выберите свидание:");
wait("#progress_table > div > table > tbody > tr:nth-child(1) > th:nth-child(5)").then(x => x.innerText = "как ты так лоханулся");
wait("#progress_table > div > table > tbody > tr:nth-child(1) > th:nth-child(4)").then(x => x.innerText = "Единицы и двойки");
wait("#progress_table > div > table > tbody > tr:nth-child(1) > th.c.border-right").then(x => x.innerText = "хихихиха");
wait("body > div.container-fluid.navbar > div > div > div.col-xs-6.col-md-6.text-right > div.btn-group.dropdown.top_menu > a").then(x => x.innerHTML = "сегодня <span class=\"caret\"></span>");
wait("#student_shedule_current > div:nth-child(5) > div:nth-child(6) > div").then(x => x.innerText = "69420");
wait("#table_fix > thead > tr > th:nth-child(2)").then(x => x.innerText = "Подедедельнек");
wait("#table_fix > thead > tr > th:nth-child(3)").then(x => x.innerText = "Повторник");
wait("#table_fix > thead > tr > th:nth-child(4)").then(x => x.innerText = "Срида");
wait("#table_fix > thead > tr > th:nth-child(5)").then(x => x.innerText = "чё                 тверг");
wait("#table_fix > thead > tr > th:nth-child(6)").then(x => x.innerText = "расслаблятница");
wait("#table_fix > thead > tr > th:nth-child(7)").then(x => x.innerText = "суботта");
wait("body > div:nth-child(3) > div.container > div.btn-group > div:nth-child(1) > button").then(x => x.innerText = "инфа");
wait("body > div:nth-child(3) > div.container > div.btn-group > div:nth-child(2) > button").then(x => x.innerText = "Нет у нас никакого плана!");
wait("body > div:nth-child(3) > div.container > div.btn-group > a:nth-child(3)").then(x => x.innerText = "дз");
wait("body > div:nth-child(3) > div.container > div.btn-group > a:nth-child(4)").then(x => x.innerText = "Написание урокав");
wait("body > div:nth-child(3) > div.container > div.btn-group > div:nth-child(5) > button").then(x => x.innerText = "спать хочу");
wait("body > div:nth-child(3) > div.container > div.btn-group > div:nth-child(6) > button").then(x => x.innerText = "диплом зимово");
wait("body > div:nth-child(3) > div.container > div.btn-group > a:nth-child(7)").then(x => x.innerText = "Запросы");
wait("body > div:nth-child(3) > div.container > div.btn-group > div:nth-child(8) > button").then(x => x.innerText = "Опросы");
wait("body > div:nth-child(3) > div.container > div.btn-group > div:nth-child(9) > button").then(x => x.innerText = "не нажимай");

// Дельта ЛК
wait("body > div.container > div > div > h5").then(x => x.innerText = "Северная Корея");
wait("body > div.container > div:nth-child(1) > div > h3").then(x => x.innerText = "ну привет лошара )))0)");
wait("body > nav > div:nth-child(1) > a").then(x => x.innerText = "личный каааааааааааааааааааааааааааааааааааал");
wait("body > div.container > div:nth-child(2) > div.col-md-8.col-sm-12.pt-2.pb-2").then(x => x.innerHTML = `<iframe src="//rss.bloople.net/?url=https%3A%2F%2Fria.ru%2Fexport%2Frss2%2Farchive%2Findex.xml&showtitle=false&type=html" width="600" height="999999999" style="border:none"></iframe>`);
wait("#navbarSupportedContent > ul.navbar-nav.mr-auto > li:nth-child(2) > a").then(x => x.innerText = "иеылрмвйтя");
wait("#navbarSupportedContent > ul.navbar-nav.mr-auto > li:nth-child(3) > a").then(x => x.innerText = "ботальник");
wait("#navbarSupportedContent > ul.navbar-nav.mr-auto > li:nth-child(4) > a").then(x => x.innerText = "Диплом Зимово");
wait("#navbarSupportedContent > ul.navbar-nav.mr-auto > li:nth-child(5) > a").then(x => x.innerText = "Опросы");
wait("#navbarSupportedContent > ul.navbar-nav.mr-auto > li:nth-child(6) > a").then(x => x.innerText = "др");
wait("#navbarSupportedContent > ul.navbar-nav.ml-auto.mr-3 > li:nth-child(1) > a").then(x => x.innerText = "чат");
wait("#navbarSupportedContent > ul.navbar-nav.ml-auto.mr-3 > li:nth-child(2) > a").then(x => x.innerText = "8");
wait("body > div.container > div:nth-child(2) > div.col-md-4.col-sm-12.pt-2.pb-2 > div").then(x => x.innerHTML = x.innerHTML.replace("Быстрые", "Медленные"));

// Другое
document.addEventListener("keydown", e => {
    if(e.keyCode != 70) return;
    const randomColor = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    document.body.style.background = "#" + randomColor;
});
ondef("shedule_student_info_modal").then(() => {
    let _a = shedule_student_info_modal;
    shedule_student_info_modal = a => {
        let k = (new Audio("https://mp3bob.ru/download/muz/Rick_Astley_-_Never_Gonna_Give_You_Up_[www.mp3pulse.ru].mp3"));
        k.volume = 0.1;
        k.play();
        setTimeout(() => k.pause(), 1500);
        _a(a);
    };
});
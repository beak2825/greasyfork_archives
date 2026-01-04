// ==UserScript==
// @name         HabrHider
// @namespace    http://vitka-k.ru
// @version      0.2.4.3
// @description  Скрывайте посты от неугодных вам хабов и блогов на главной, новости, партнерские посты и спонсорские материалы!
// @author       Viktor Karpov <vitka-k.ru>
// @copyright    2020, Viktor Karpov
// @license      MIT
// @homepageURL  https://github.com/viktor02/HabrHider
// @match        https://habr.com/ru/top/*
// @match        https://habr.com/ru/all/*
// @match        https://habr.com/ru/
// @match        https://habr.com/ru/feed/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/408616/HabrHider.user.js
// @updateURL https://update.greasyfork.org/scripts/408616/HabrHider.meta.js
// ==/UserScript==

// Меню со ссылкой на гитхаб
GM_registerMenuCommand('GitHub', () => {
    GM_openInTab('https://github.com/viktor02/HabrHider', {active: true, insert: true});
});

// Меню с настройками
GM_registerMenuCommand('Settings', () => {
    GM_config.open();
});

GM_config.init(
    {
        'id': 'HabrHider',
        'fields':
            {
                'habs':
                    {
                        'label': 'Скрыть хабы',
                        'title': 'Настройки',
                        'section': ['Настройки',
                            'Вводите хабы в формате регулярных выражений, например так: <b>Карьера в IT-индустрии|Блог компании</b> <br>Внимание: пробелов между | и текстом не должно быть!'],
                        'type': 'text',
                        'default': ''
                    },
                'hide_news':
                    {
                        'label': 'Скрыть новости',
                        'type': 'checkbox',
                        'default': false
                    },
                'hide_sponsors':
                    {
                        'label': 'Скрыть спонсоров',
                        'type': 'checkbox',
                        'default': false
                    },
                'hide_best_companies':
                    {
                        'label': 'Скрыть лучшие компании',
                        'type': 'checkbox',
                        'default': false
                    },
                'hide_promo':
                    {
                        'label': 'Скрыть все промоматериалы',
                        'type': 'checkbox',
                        'default': false
                    },
                'hide_post_body':
                    {
                        'label': 'Показывать только заголовки',
                        'type': 'checkbox',
                        'default': false
                    },
                'improve_post_title':
                    {
                        'label': '(рекомендовано только при применении пред.пункта) Уменьшить заголовки',
                        'type': 'checkbox',
                        'default': false
                    }
            }
    });


let habs = GM_config.get('habs');
let hide_news = GM_config.get('hide_news');
let hide_sponsors = GM_config.get('hide_sponsors');
let hide_best_companies = GM_config.get('hide_best_companies');
let hide_promo = GM_config.get('hide_promo');
let hide_post_body = GM_config.get('hide_post_body');
let improve_post_title = GM_config.get('improve_post_title');

(function() {
    'use strict';
    // Поиск строки с хабами на главной
    let selectors = "ul.post__hubs.inline-list"
    let habs_el = document.querySelectorAll(selectors);

    for (const element of habs_el) {
        const elementText = element.innerText || element.textContent;
        if (habs === ""){
            break
        }
        else if (elementText.search(habs) !== -1){
            element.parentNode.parentNode.style.display = "none";
        }
    }

    if (hide_news === true){
        // Скрыть новости на главной
        try{
            let news_el = document.querySelector(".content-list__item_news-block");
            news_el.style.display = "none";
        } catch (TypeError){
            console.log("[HH] Новости не найдены")
        }
    }
    if (hide_sponsors === true){
        // Скрыть колонку со спонсорами
        let sponsors_el = document.querySelector("div.default-block_sidebar:nth-child(1)");
        sponsors_el.style.display = "none";
    }
    if (hide_best_companies === true){
        // Скрыть колонку с лучшими компаниями
        let companies_el = document.querySelector("#companies_rating");
        companies_el.style.display = "none";
    }
    if (hide_promo === true){
        // Скрыть 'Курсы', 'Заказы', прочее
        let promo_els = document.querySelectorAll(".promo-block");
        for (const element of promo_els) {
            element.parentNode.style.display = "none";
        }
        // Скрыть 'Минуточку внимания'
        document.querySelector(".default-block").parentNode.style.display = "none";
    }
    if (hide_post_body === true){
        // Скрываем тело поста, оставляя только заголовок
        let post_body_els = document.getElementsByClassName("post__body post__body_crop");
        for (const element of post_body_els) {
            element.style.display = "none";
        }
    }
    if (improve_post_title === true){
        // Уменьшаем заголовок
        let improve_post_title_els = document.querySelectorAll(".post__title_link");
        for (const element of improve_post_title_els) {
            element.style.fontSize = "20px";
        }
    }
})();

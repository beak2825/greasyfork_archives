// ==UserScript==
// @name         LoFi Chill With No Cards
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Убираються карточке на саете
// @author       Эчпочмак
// @match        https://astars.club/*
// @match        https://asstars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://animestars.org/*
// @match        https://as1.astars.club/*
// @match        https://asstars.tv/*
// @license      Public domain
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538094/LoFi%20Chill%20With%20No%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/538094/LoFi%20Chill%20With%20No%20Cards.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    function udalyayuSpickySboku()
    {
        // Тута ищем на сбоку "Бибдотека карт"
        // <li><a href="/cards/">Библиотека карт</a><span class="fal fa-yin-yang"></span></li>
        const cardLinks = document.querySelectorAll('a[href="/cards/"]');
        for (const link of cardLinks) {
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.remove();
                console.log("✅  Бибдотека выкл!");
            }
        }
    }
 
    function vinosimPakiKartoshe()
    {
        // Штука которая в магазини "Паки карт"
        // <a class="ncard__tabs-btn btn" href="/cards/pack/">Паки карт</a>
        const cardLinks = document.querySelectorAll('a[href="/cards/pack/"]');
        for (const link of cardLinks) {
            link.remove();
            console.log("✅ паки карт выкл!");
        }
    }
 
    function ubiraymShilochkiCart()
    {
        // Кнопочковое в меню, и ещё в профиле "карты"
        const userCardLinks = document.querySelectorAll('a[href*="/user/cards/"]');
        for (const link of userCardLinks) {
            // Профидб
            const parentSection = link.closest('.usn-sect');
            if (parentSection) {
                parentSection.remove();
                console.log("✅ карусель в профиле выкл!");
            } else {
                // "Мои карты"
                // <a href="/user/*/cards/" class="lgn__btn lgn__btn-vozv btn c-gap-10"><span class="fal fa-yin-yang"></span>Мои карты</a>
                link.remove();
                console.log("✅ моя карты выкл!");
            }
        }
    }
 
    function prybiraymKarusleku() {
        // Под видево
        const carouselElements = document.querySelectorAll('.pmovie__related.cards-carousel');
        for (const element of carouselElements) {
            element.remove();
            console.log("✅ видво карт выкл!");
        }
    }
 
    function delaymZaglushechku() {
        // Тут создаём невидимую, выключания карточков
        // Это будет типа заглушка чтоб ниче не появлялось, она не видно
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'card-notification';
        notificationDiv.style.display = 'none'; // Чтоб было невидно
        document.body.appendChild(notificationDiv);
        console.log("✅ карты больше нинада!");
    }
 
    function vsyoUbirayom() {
        udalyayuSpickySboku();
        vinosimPakiKartoshe();
        ubiraymShilochkiCart();
        prybiraymKarusleku();
        delaymZaglushechku();
    }
 
    // запускаеться когда скрипт начался, всё убирает
    console.log("🚀 Уютне просмот!");
    vsyoUbirayom();
})();


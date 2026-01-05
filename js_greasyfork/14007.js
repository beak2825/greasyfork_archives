// ==UserScript==
// @name Sidebar right Ad remover habrahabr.ru
// @description Removes ads on the right sidebar and top NoAdblock Request habrahabr.ru geektimes.ru megamozg.ru
// @description:ru Убирает рекламу в правом баре и заодно слезливую плашку выключить адблок наверху habrahabr.ru geektimes.ru megamozg.ru
// @include http://habrahabr.ru/*
// @include https://habrahabr.ru/*
// @include http://geektimes.ru/*
// @include https://geektimes.ru/*
// @include http://megamozg.ru/*
// @include https://megamozg.ru/*
// @namespace habrahabr_ru
// @author HabrahabrHater
// @version 1.0
// @encoding utf-8
// @grant none
//
// @downloadURL https://update.greasyfork.org/scripts/14007/Sidebar%20right%20Ad%20remover%20habrahabrru.user.js
// @updateURL https://update.greasyfork.org/scripts/14007/Sidebar%20right%20Ad%20remover%20habrahabrru.meta.js
// ==/UserScript==///**
// Ремувкебабит никчемную приемлемую рекламу в блоке справа и слезливую плашку сверху. Создано для тех, кто на дух не переносит рекламу и блочит её просто потому что
var ev = window.addEventListener("load", init);

function init() {
    // Рекламу долой
    var sidebarRightTrash = document.querySelectorAll('#layout > div.inner > div.column-wrapper > div.sidebar_right > div > a[href^="http://bit.ly/"]');
    if (sidebarRightTrash) {
        for (var i=0; i < sidebarRightTrash.length; i++) {
            sidebarRightTrash[i].remove();
        }
    }

    // Плашка на хабре
    var lachrymoseRequest1 = document.querySelector('#layout > div.inner > div.lain_13_what_are_you_doing');
    if (lachrymoseRequest1) { lachrymoseRequest1.remove(); }

    // Плашки на гиктаймсе и мегамозге
    var lachrymoseRequest2 = document.querySelector('#layout > div.inner > div.dont-add-our-site-pls');
    if (lachrymoseRequest2) { lachrymoseRequest2.remove(); }
}

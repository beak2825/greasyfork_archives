// ==UserScript==
// @name         Shikimori comments loader
// @name:ru      Загрузчик комментариев Shikimori
// @namespace    https://shikimori.org/
// @version      0.9
// @description  Load 100 comments instead of the standard 20
// @description:ru Загружает 100 комментариев вместо 20 стандартных на Shikimori
// @author       BoberMod
// @match        https://*.shikimori.org/*
// @match        https://shikimori.one/*
// @match        https://shikimori.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383088/Shikimori%20comments%20loader.user.js
// @updateURL https://update.greasyfork.org/scripts/383088/Shikimori%20comments%20loader.meta.js
// ==/UserScript==

// Settings
// СКОЛЬКО КОММЕНТАРИЕВ ЗАГРУЖАТЬ ЗА 1 РАЗ
const commentsPerClick = 100; //НЕ СТОИТ ДЕЛАТЬ ЗНАЧЕНИЕ БОЛЬШЕ 150-200!

function change() {
    "use strict";

    let loader = document.getElementsByClassName("comments-loader")[0];
    if (!loader) { return false; }
    
    let numberOfComments = loader.getAttribute("data-count");
    let skipLink = loader.getAttribute("data-clickloaded-url-template").replace(/SKIP\/\d{1,2}/g, `SKIP/${commentsPerClick}`);

    loader.setAttribute("data-limit", commentsPerClick);
    loader.setAttribute("data-clickloaded-url-template", skipLink);

    if (numberOfComments <= commentsPerClick) {
        loader.innerText = `Загрузить ${numberOfComments} из ${numberOfComments} комментариев`;
    }
    else {
        loader.innerText = `Загрузить ещё ${commentsPerClick} из ${numberOfComments} комментариев`;
    }
}

function onload(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

onload(change);
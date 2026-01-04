// ==UserScript==
// @name      Watch online button on shikimori.one
// @name:ru   Кнопка "смотреть онлайн" на сайте shikimori.one
// @description Adds a button with which you can watch anime.The original author of the script BoberMod.
// @description:ru Добавляет кнопку, с помощью которой можно смотреть аниме. Оригинальный автор скрипта BoberMod.
// @namespace    https://shikimori.one/
// @match        https://shikimori.one/*
// @author       Batora / edit OsuDesu
// @grant        none
// @version      0.3
// @downloadURL https://update.greasyfork.org/scripts/401916/Watch%20online%20button%20on%20shikimorione.user.js
// @updateURL https://update.greasyfork.org/scripts/401916/Watch%20online%20button%20on%20shikimorione.meta.js
// ==/UserScript==

function add() {
    "use strict";

    let block = document.createElement("div");
    let watchButton = document.createElement("A");

    block.setAttribute("class", "block");
    watchButton.text = "Смотреть";
    watchButton.setAttribute("class", "b-link_button dark watch-online");
    watchButton.setAttribute('href', "https://shikimori.online" + window.location.pathname);
  
    document.getElementsByClassName("c-info-right")[0].appendChild(block).append(watchButton);
}

function onload(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);
    document.addEventListener('DOMContentLoaded', fn);
}

onload(add);
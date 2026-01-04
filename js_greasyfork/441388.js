// ==UserScript==
// @name         Susu theme
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Радужная тема для сайта edu.susu.ru
// @author       Zat
// @supportURL   TG - @Zat228
// @match        https://edu.susu.ru/*
// @icon         https://edu.susu.ru/pluginfile.php/1/theme_boost_campus/favicon/1647052698/favicon.ico
// @namespace    https://greasyfork.org/ru/users/886278
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441388/Susu%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/441388/Susu%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //-------------------------------------------Создание блока анимации------------------------------------------------------------------------------------
    var style = document.createElement('style');
    style.type = 'text/css';
    var keyFrames = '@keyframes background { 0%{ background-position:0% 50%} 50%{ background-position:100% 50%} 100%{ background-position:0% 50%} }';
    style.innerHTML = keyFrames;
    //-------------------------------------------Создание градиента и анимации------------------------------------------------------------------------------
    let bg = "linear-gradient(231deg, #ff0000, #ff9400, #f9ff00, #01ff00, #00ffeb, #0600ff, #8d00ff)";
    let anim = "background 30s cubic-bezier(0.5, 0, 0.5, 1) infinite";
    let bg_size = "300% 300%";
    let borde = "border-color: #000000";

    //-------------------------------------------Поиск шапок и футера, удаление стандартного фона-----------------------------------------------------------
    let rek = document.querySelector("#page-wrapper > nav");
    let footer = document.querySelector("#page-footer");
    let footer_down = document.querySelector(".footnote");
    let logo = document.querySelector("a[href='https://edu.susu.ru']");
    let butn = document.querySelector(".btn-primary")
    rek.removeAttribute("class");
    rek.setAttribute("class", "navbar fixed-top navbar-dark bg-primary navbar-expand");
    //
    //footer.removeAttribute("class");
    //footer.setAttribute("class", "py-3 text-light");
    //
    //footer_down.removeAttribute("class");
    //footer_down.setAttribute("class", "footnote p-3 text-light");
    //
    if(butn){
        butn.removeAttribute("class");
        butn.setAttribute("class", "btn btn-primary");
    }
    if(logo){
        logo.removeAttribute("class");
        logo.setAttribute("class", "aabtn");
    }
    //-------------------------------------------Присваивание градиента, анимации, и размеров----------------------------------------------------------------
    rek.style.background = bg;
    rek.style.backgroundSize = bg_size;
    rek.style.animation = anim;
    rek.appendChild(style);
    butn.style.background = bg;
    butn.style.bordercolor = borde;
    butn.style.backgroundSize = bg_size;
    butn.style.animation = anim;
    butn.appendChild(style);
    // Your code here...
})();
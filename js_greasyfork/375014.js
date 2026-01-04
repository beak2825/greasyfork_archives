// ==UserScript==
// @name         [bongacams] VideowViewerBot
// @namespace    tuxuuman:bongacams:vvbot
// @version      0.2
// @description  Бот для просмотра рандомных видео
// @author       tuxuuman<tuxuman@gmail.com>
// @match        https://rt.bongacams2.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/375014/%5Bbongacams%5D%20VideowViewerBot.user.js
// @updateURL https://update.greasyfork.org/scripts/375014/%5Bbongacams%5D%20VideowViewerBot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("BOT LOADED");
    
    
    const debug = false; // замените "false" на "true" если хотите протестировать в быстром режиме
    
    // убирает всплывающее окно с рекламой
    GM_addStyle('.fancybox-overlay {display: none !important;} .fancybox-lock{overflow-y: auto !important}');
    
    function start() {
        if (location.href.indexOf("#selectCategory") >= 0) {
            location.reload();
        } else {
            location.replace(location.origin + "#selectCategory");
        }
        GM_setValue("watchCounter", rnd(7, 5));
    }
    
    GM_registerMenuCommand("START", start);
    
    function getCategories() {
        let categories = [];
        $('.model_categories_panel  li >div.label>a').each((i,e) => {
            categories.push({
                name: e.innerText,
                href: e.href
            });
        });
        return categories;
    }
    
    function getVideos() {
        let videos = [];
        $('.mls_item.mls_item_online .thm_a.chat').each((i, e) => videos.push({href: e.href}));
        return videos;
    }
    
    function rnd(max, min = 0) {
        return Math.floor(Math.random() * max) + min;
    }
    
    function getRandomValue(values) {
        return values[rnd(values.length)];
    }
    
    function scrolling(count, duration = 1500) {
        log("Имитируем скролинг страницы...", count, duration);
        return new Promise((res, rej)=> {
            let counter = 0;
            let timerId = setInterval(() => {
                if ((++counter) > count) {
                    clearInterval(timerId);
                    res();
                    log("Скролинг завершен", counter);
                } else {
                    $('html').scrollTop($('html').scrollTop() + 500);
                    log("Скролим...");
                }
            }, duration);
        });
    }
    
    function log(...args) {
        document.title = args[0];
        console.log(...args);
    }
    
    switch(location.hash) {
        case "#selectCategory":
            log("Выбераем рандомную категорию...");
            setTimeout(()=>{
                let category = getRandomValue(getCategories());
                log("Категория выбрана", category);
                location.href = category.href + "#selectVideo";
            }, rnd(5000, 2000));
            break;
            
        case "#selectVideo":
            scrolling(rnd(10, 1)).then(() => {
                log("Выбераем рандомное видео...");
                setTimeout(()=>{
                    let video = getRandomValue(getVideos());
                    log("Видео выбрано", video);
                    location.href = video.href + "#watchVideo";
                }, rnd(5000, 2000));
            });
            
            break;
            
        case "#watchVideo":
            let watchDuration = rnd(1000 * 60 * 8, 1000 * 60 * 5);  // продолжительность просмотра видео от 5 до 8 минут
            log("Смотрим видео");
            setTimeout(() => {
                log("Просмотр завершен");
                let watchCounter = (GM_getValue("watchCounter") || 0) - 1;
                if (watchCounter <= 0) {
                    GM_setValue("watchCounter", 0);
                    log("Просмотр завершен. Делаем паузу.");
                    location.replace(location.origin + "#pause");
                } else {
                    GM_setValue("watchCounter", watchCounter);
                    log("Просмотр завершен. Начинаем просмотр следующего видео");
                    location.replace(location.origin + "#selectCategory");
                }
            }, debug ? 5000 : watchDuration);
            break;
            
        case "#pause": 
            let pauseDuration = rnd(1000 * 60 * 60 * 3, 1000 * 60 * 60 * 1); // пауза от 1 до 3 часов
            log(`Пауза... ${Math.ceil(pauseDuration/1000/60)} мин.`);
            setTimeout(() => {
                start();
            }, debug ? 15000 : pauseDuration);
            break;
    }
})();
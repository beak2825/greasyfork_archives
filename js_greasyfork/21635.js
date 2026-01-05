// ==UserScript==
// @name        YouTube Cleaner [RUS]
// @namespace	kL0c81Ys0K4OHUP4pHKdVIfZq6IaRbae
// @version	    0.3
// @description	Удаляет рекомендованные видео на YouTube
// @license     WTFPL
// @include	    *://youtube.com/*
// @include	    *://*.youtube.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21635/YouTube%20Cleaner%20%5BRUS%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/21635/YouTube%20Cleaner%20%5BRUS%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    
    Итак, краткая инструкция.

    Некоторые видео выводятся большими блоками с заголовком полужирным шрифтом. В заголовке
    написано либо название канала, либо "Рекомендованные", либо название сборника видео,
    как, например, "Фильмы" или "Игры". Для удаления таких блоков целиком Вы можете добавить
    текст из заголовка в массив headers_blocklist. Часто рядом с таким заголовком написано
    мелким шрифтом "Рекомендуемые вам" или "Рекомендованный канал". Эти мелкие надписи фильтруются
    аналогично заголовкам, т.е. если добавить в headers_blocklist надпись "Рекомендуемый канал" -
    с главной страницы будут удалены все каналы с такой пометкой. Можно добавлять не весь текст, а
    лишь его часть. Таким образом можно добавить в фильтр фрагмент "Рекоменд", который удалит и
    "Рекомендуемые", и "Рекомендуемые вам" и "Рекомендованный канал".
    
    Также вы можете удалять отдельные видео с главной странице по имени канала. Для этого
    надо лишь добавить по шаблону название канала в фильтр channels_blocklist, или добавить
    туда фрагмент названия канала. Будут удалены все видео с этого канала. Если вы хотите
    удалить сразу весь блок такого канала - добавьте его в headers_blocklist.

    С версии 0.2 названия каналов и заголовков стали регистронезависимы.
     
    Как добавлять в фильтр свой текст? Просто перед закрывающейся квадратной скобкой
    поставьте запятую, перейдите на следующую строку и впишите в апострофах то, что
    вам нужно.
    Пример:
     
    Было 
     var a = [
     'alpha',
     'beta',
     'gamma'];
     
    Стало
     var a = [
     'alpha',
     'beta',
     'gamma',
     'lambda'];
     
    В этом примере в фильтр добавлен элемент 'lambda'.
    Если вы хотите чтобы скрипт автоматически редиректил вас в подписки
    с главной страницы - измените redirect_to_subscriptions на true.
    ВНИМАНИЕ: Клинер жёсткий! Будьте аккуратны с фильтрами!
    
    Скрипт пытается автоматически подгрузить ещё видео если было очищено слишком
    много (иногда выводится много видео, которые соответствуют фильтру). Иногда
    остаются полностью пустые блоки - они удаляются не сразу, но удаляются.
    
    Стандартные фильтры написаны для Рунета, но вы можете переписать их.
    Что фильтруют стандартные фильтры:
    - Блок рекомендаций (обычно самый первый)
    - Рекомендованные каналы
    - Популярные на YouTube видео (не из подписок)
    - Всякие плейлисты
    - Подборки типа "Музыка", "Игры" и т.д.
    - Любые каналы, в которых присутствует строка "YouTube " (именно так, с пробелом)
    Не переборщите с фильтрами! :)
    
    */
    
    if(window.location.pathname !== '/') return;  // Скрипт нужен лишь на главной.
    
    var redirect_to_subscriptions = false;
    var header_blocklist = [
        'Рекомендованные',
        'Рекомендовано',
        'Рекомендованный канал',
        'Популярные на YouTube',
        'популярные видео',
        'Плейлисты',
        'Фильмы',
        'Мультфильмы',
        'Музыка',
        'Игры',
        'Спорт',
        'Ролевые экшн-игры',
        'Christopher James'];
    
    var channels_blocklist = [
        'YouTube '];
    
    if((redirect_to_subscriptions)&&(document.location.pathname == '/')) document.location.pathname = '/feed/subscriptions';
    
    function checkArray(r,n){for(var e=0;e<n.length;e++)if(r.toUpperCase().indexOf(n[e].toUpperCase())>-1)return!0;return!1;}
    function loadNewBlocks() {
     if((document.querySelectorAll('.branded-page-module-title-text').length<3)&&(document.querySelector('.load-more-text')))
        document.querySelector('.load-more-text').click(); }
    function removeWasteHeaders(selector, blist) {
        var elems = document.querySelectorAll(selector);
        for(var i=0;i<elems.length;i++) if(checkArray(elems[i].innerHTML, blist)) elems[i].closest('ol').remove();
    }
    
    function removeWasteChannels(selector, blist) {
    var docs = document.querySelectorAll(selector);
    for(var z=0; z<docs.length; z++) if(checkArray(docs[z].innerHTML, blist)) docs[z].closest('div.feed-item-dismissable').remove();
    }
    
    function removeEmptyBlocks(selector){
        var elems = document.querySelectorAll(selector);
        for(var z=0;z<elems.length;z++) if(elems[z].innerHTML == '<div class="feed-item-dismissal-notices"></div>') elems[z].closest('ol.item-section').remove();
    }

    function getSubscriptions() {
        var arr = [];
        var subs_elems = document.querySelector('#guide-subscriptions-container').querySelectorAll('div > ul > li[class*="guide-channel"] > a');
        for(var z=0; z<subs_elems.length; z++) arr.push(subs_elems[z].title);
        arr.sort();
        return arr;
    }

    function clearAll()  {
        removeWasteHeaders('span[class="shelf-annotation shelf-title-annotation"]', header_blocklist);
        removeWasteHeaders('span[class="branded-page-module-title-text"]', header_blocklist);  
        removeWasteHeaders('span[class="shelf-featured-badge"]', header_blocklist);
        removeWasteChannels('a[href^="/user/"][class^="g-hovercard yt-uix-sessionlink"][data-sessionlink][data-ytid]', channels_blocklist);
        removeWasteChannels('a[href^="/channel/"][class^="g-hovercard yt-uix-sessionlink"][data-sessionlink][data-ytid]', channels_blocklist);
        removeEmptyBlocks('div[class="feed-item-container browse-list-item-container yt-section-hover-container compact-shelf shelf-item branded-page-box clearfix"][data-visibility-tracking]');
    }
    clearAll();
    document.addEventListener("DOMNodeInserted", function(event) { clearAll(); });
    window.onload = function() { clearAll(); loadNewBlocks(); };
})();
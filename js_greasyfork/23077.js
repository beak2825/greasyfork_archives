// ==UserScript==
// @name         Rsload NoLoader
// @namespace    http://ext.redleaves.ru
// @version      0.3
// @description  Отключает рекламный загрузчик Mediaget на RSLOAD.NET по-умолчанию
// @author       MewForest
// @match        *://rsload.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23077/Rsload%20NoLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/23077/Rsload%20NoLoader.meta.js
// ==/UserScript==

(function() {
    'use strict';
        if($('.cb-disable')){$('.cb-disable').click();}
        if($('.cb-disables')){$('.cb-disables').click();}
        if($('.cb-disabless')){$('.cb-disabless').click();}
        if($('.cb-disablesss')){$('.cb-disablesss').click();}
        if($('.switch')){$('.switch').hide();}
})();
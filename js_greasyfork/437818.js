// ==UserScript==
// @name         VK Ban By User ID
// @namespace    http://tampermonkey.net/
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @version      0.1
// @description  Скрыть сообщения пользователей по ID ВКонтакте
// @author       You
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?domain=telegram.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437818/VK%20Ban%20By%20User%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/437818/VK%20Ban%20By%20User%20ID.meta.js
// ==/UserScript==


setInterval(function(){
    $("div[data-peer='вставьте User ID здесь']").css('display', 'none');
    $("div[data-peer='вставьте User ID здесь']").css('display', 'none');
    $("div[data-peer='вставьте User ID здесь']").css('display', 'none');
    $("div[data-peer='вставьте User ID здесь']").css('display', 'none');
    $("div[data-peer='вставьте User ID здесь']").css('display', 'none');
    //Копируйте при необходимости
}, 25);
// ==UserScript==
// @name         VK Hide Stikers
// @namespace    http://tampermonkey.net/
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @version      0.1
// @description  ВК убрать стикеры (в диалогах)
// @author       You
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?domain=telegram.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437623/VK%20Hide%20Stikers.user.js
// @updateURL https://update.greasyfork.org/scripts/437623/VK%20Hide%20Stikers.meta.js
// ==/UserScript==


setInterval(function(){
    $('.im_sticker_row').css('display', 'none');
}, 25);
// ==UserScript==
// @name         Pikabu Chat
// @namespace    http://pikabu.ru/
// @version      0.2
// @description  Add chat on Pikabu.ru
// @author       UmnikOne
// @match        http://pikabu.ru/
// @grant        none
// @include http://pikabu.ru/*
// @include http://m.pikabu.ru/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/19118/Pikabu%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/19118/Pikabu%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

$( document ).ready(function() {
    $(".menu").append('<li class="noactive menu-item-default"><a href="http://m.pikabu.ru/search.php?q=superpuperumnikchat" class="no_ch" id="chat">Чат</a></li>');
});

if (window.location.href == "http://m.pikabu.ru/search.php?q=superpuperumnikchat") {
$('.search_box').css('display', 'none');
$('.ss-form-group').css('display', 'none');
$('.ss-filters-small').css('display', 'none');
$('.ss-buttons').css('display', 'none');
$('.post').css('display', 'none');
$('#no_stories_msg').css('display', 'none');
$('.page_title').text('Чат');
$(".content_container").append('<br><center><object type="application/x-shockwave-flash" width="100%" height="600px" allowscriptaccess="always" data="http://images.banners-service.info/source.swf?r=458003&l=www"></center>');
$(".content_container").append('<br><center>by <a href="http://pikabu.ru/profile/UmnikOne">UmnikOne</a> | <a href="http://vk.com/raccooncpt">vk.com</a></center>');
}
})();
// ==UserScript==
// @name         Pikabu Down Comments
// @namespace    http://umnik.one/
// @version      0.3
// @description  Добавляет кнопку -Комментарии- к концу поста
// @author       UmnikOne
// @match        http://pikabu.ru/*
// @excludes      http://pikabu.ru/add
// @excludes      http://pikabu.ru/freshitems.php
// @excludes      http://pikabu.ru/story/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/25656/Pikabu%20Down%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/25656/Pikabu%20Down%20Comments.meta.js
// ==/UserScript==

$(document).ready(function() {
$(".story").hover(
    
	function () { $(this).addClass("active");  var link = $(".story.active [target='_blank']:first");  $('.story__footer').append('<div id="test2"><div class="story__slide-up"><a href="'+link[0]+'#comments" target="_blank"  style="color: #a0a0a0; text-decoration:none;">комментарии</a></div></div>'); },   //при наведении курсора на элемент
	function () { $(this).removeClass("active");  $("div#test2").remove();} //при уводе курсора с элемента
    
);
});
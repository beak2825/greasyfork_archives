// ==UserScript==
// @name         OLD new VK+
// @namespace    https://greasyfork.org/ru/users/702958-jakill02
// @version      0.21 - 15
// @description  Companion script for using with "OLD new VK" CSS
// @author       Kesantielu Dasefern and others, Adaptation by Jakill02
// @match        *://*.vk.com/*
// @exclude      *://*vk.com/stickers*
// @exclude      *://*vk.com/video*
// @grant        none
// @license      MIT
// @require      http://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/419915/OLD%20new%20VK%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/419915/OLD%20new%20VK%2B.meta.js
// ==/UserScript==

/* убрал из пункта UserScript */
// include       https://vk.com/*
// exclude       https://vk.com/audios*

   (function() {
    'use strict';
//	document.querySelector("link[rel*='icon']").href = "https://vk.com/images/icons/favicons/fav_logo.ico?6";
//	var check = false;

    // - путь до иконки    https://vkontakte.ru/images/favicon.ico
    // https://vk.com/images/icons/favicons/fav_logo.ico?6
    // https://vk.com/images/icons/favicons/fav_im.ico?6

	$('#top_notify_btn').attr('style','display: none !important');
	$("#top_audio").attr('style','display: true !important');
	$("#top_profile_link").attr('style','display: none !important');
    $("#top_audio_player").attr('style','display: true !important');
    $('.top_audio_player').css({ 'overflow' : 'hidden', 'max-width' : '200px'}); // Ширина ТопАудиоплеера (def. 130)
    //     $('.top_audio_player').css({ 'overflow' : 'hidden', 'max-width' : '124px'});

	var feed_count = $("#top_notify_count").text();

// Смещение Иконки Меню экосистемы VK вправо
$('#top_ecosystem_navigation_link').css({'position' : 'absolute','right' : '-30px'});
// Смещение Меню экосистемы VK вправо
$('#top_ecosystem_navigation_menu').css({'right' : '0px'});
// Смещение Иконки Меню экосистемы VK Влево - Апрель 2022
$('#react_rootEcosystemServicesNavigationEntry').css({'position' : 'absolute','left' : '70px'});
// Смещение Меню экосистемы VK влево - Апрель 2022
$('.EcosystemServicesNavigationDropdown_popout__NYAnq').css({'position' : 'absolute','left' : '0px'});


	// $("#l_nwsf span.inl_bl.inl_bl").prepend('Мои '); // Новости
// 	$("#l_msg a span span.left_label").prepend('Мои Сообщения'); oveflow: hidden;
    // $("#l_msg span.left_label.inl_bl").text('Мои Сообщения');
	// $("#l_fr span.left_label.inl_bl").prepend('Мои '); // Друзья
//	$("#l_gr a span span.left_label").prepend('Мои Группы         ');
    // $("#l_gr span.left_label.inl_bl").text('Мои Группы');
	// $("#l_ph span.left_label.inl_bl").prepend('Мои '); // Фотографии
	// $("#l_aud span.left_label.inl_bl").prepend('Моя '); // Мызыка
	// $("#l_vid span.left_label.inl_bl").prepend('Мои '); // Видео
    $("#l_ap a span span.left_label").empty();
	// $("#l_ap span.left_label.inl_bl").text('Приложения');
    // $("#l_fav span.left_label.inl_bl").prepend('Мои '); / Закладки/


    $('<li id="l_apm" class=""><a href="/settings" class="left_row"><span class="left_fixer" id="sett"><span class="left_label inl_bl">Мои Настройки</span></span></a></div></li>').insertAfter('#l_fav');


     // позицианирование меню: Мои Настройки - 2023 февраль
     $('#sett').css({
	'position' : 'relative',
	'top' : '0px',
	'left' : '-2px',
	'padding' : '6px 1px 1px 2px',
	'border-radius' : '3px',
	'white-space' : 'nowrap',
	'overflow-x' : 'hidden',
	'height' : '20px'});

    var attrr = $('#top_logout_link').attr('href');
	$('#top_nav').append('<span style="float:right;"><a id="people_link_td" class="top_nav_link" href="/search?c[section]=people">люди</a><a id="communities_link_td" class="top_nav_link" href="/search?c[section]=communities">сообщества</a><a id="games_link_td" class="top_nav_link" href="/apps">игры</a><a id="support_link_td" class="top_nav_link" href="/support?act=home">помощь</a><a class="top_nav_link" href="'+ attrr +'">выйти</a></span>');

    $(".left_menu_nav_wrap").empty();
    $("#ads_left").css({'display': 'none'});


function check_feed_count(){
		feed_count = $("#top_notify_count").text();
		if (feed_count > '0'){ //иначе показывает всегда что есть новые ответы, но пофакту новых нет (не красиво, когда светится плюсик всегда)
			$("#feed_li").html('<span class="left_count_wrap fl_r"><span class="inl_bl left_count" id="feed_count">'+ feed_count +'</span></span><span class="left_label inl_bl">Мои Ответы</span>');
		}
		else {
			$("#feed_li").html('<span class="left_label inl_bl">Мои Ответы</span>');
        }

         // позиция надписей: Мои Ответы и  Мои Настройки - 2023 февраль
    $('span.left_label.inl_bl').css({'margin-left' : '36px','overflow' : 'hidden','text-decoration' : 'none'});

    // позиция счётчика Уведомлений по вертикали и горизонтали - февраль 2023
           $('#l_ntf span.left_count_wrap.fl_r').css({'position' : 'relative','top' : '-6px', 'left' : '1px'});

    // Отступы в счётчике по вертикали v2
    $('.left_count').css({ 'height' : '27px', 'line-height' : '27px'});
        // Ширина счётчика v1
    $('.left_count_wrap').css({ 'height' : '27px', 'line-height' : '27px' });
    //      $('.left_count_wrap').css({ 'height' : '28px', 'line-height' : '28px' });
    $('.left_fixer').css({'width' : '157px' });
    //     $('.left_fixer').css({'width' : '160px' });

// настройка счётчика лувого меню - Май 2023
$('.LeftMenuItem-module__counter--tD4Hw').css({'line-height' : '27px',
	'background-color' : 'var(--vkui--color_icon_secondary)', 'color' : 'white', 'padding' : '0 5px 0 6px'
});
    // цвет пунктов левого меню
$('.LeftMenuItem-module__label--itYtZ').css({'color' : '#2A5885'});


    $('.HeaderNav__item--gap').css({'padding-right' : '7px'});} //  поле поиска  - отступ 2020-2021
//  $('body.new_header_design .top_audio_player').css({'padding' : '0 10px 0 0px'});
    $('.top_audio_player').css({'padding' : '0 10px 0 0px'}); // Новый Топ аудиоплеер - отступы 2020-2021
      $('body.page_header_width_fix .HeaderNav__audio').css({'min-width' : '212px','max-width' : '212px'}); // Новый Топ аудиоплеер - ширина 2022-ноябрь
       $('#top_nav > span').css({'position' : 'absolute','right' : '15px'}); // Позиция правой верхней классической менюшки с разделами 2022 - ноябрь


setTimeout(check_feed_count, 0);
setInterval(check_feed_count, 2*1000); // setInterval(check_feed_count, 2*1000)

$('<li id="l_ntf" class=""><a href="/feed?section=notifications" class="left_row"><span class="left_fixer" id="feed_li"></span></a></div></li>').insertAfter('#l_nwsf');

  // отключить подчёркивание пунктов Мои настройки и Мои Ответы - февраль 2023
$('.side_bar_ol a').css({'text-decoration' : 'none'});
         // отключить подчёркивание пунктов Мои настройки и Мои Ответы - Май 2023
   $('#l_ntf * , #l_apm * ').css({'text-decoration' : 'none'});

       // отступы между верхними пунктами меню
       $('.top_nav_link').css({'padding' : '0 10px'});

    // позиция меню: Мои Ответы  - февраль 2023
// $('#l_ntf').css({'position' : 'relative','top' : '7px','left' : '0px'}); +(возможно) 'line-height' : '30px'
$('#l_ntf').css({'position' : 'relative','top' : '0px','left' : '0px', 'margin' : '12px 0 11px 0'});

})();

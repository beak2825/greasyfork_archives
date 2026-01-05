// ==UserScript==
// @name         Old Design for VK
// @namespace    https://dasefern.com/
// @version      0.29
// @description  Companion script for using with Old Design VK CSS
// @author       Kesantielu Dasefern and others
// @match        *://vk.com/*
// @exclude      *://vk.com/notifier.php*
// @exclude      *://vk.com/al_*
// @exclude      *://vk.com/upload_fails.php
// @exclude      *://vk.com/ads_rotate.php*
// @exclude      *://vk.com/share.php*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22428/Old%20Design%20for%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/22428/Old%20Design%20for%20VK.meta.js
// ==/UserScript==

(function() {
    'use strict';
	document.querySelector("link[rel*='icon']").href = "https://vkontakte.ru/images/favicon.ico";
	unsafeWindow.setFavIcon = function(sup){ // Перехватываем и заменяем иконку сайта, если требуется (диалоговую не трогаю)
	 return function() {
	   if (arguments[0].search(/\/fav_logo\.ico/i) != -1) {
	    debugLog("Подменяем - "+arguments[0]);
	    arguments[0]="https://vkontakte.ru/images/favicon.ico";
	   } else debugLog("Без замены - "+arguments[0]);
	 return sup.apply(this, arguments);
	 };
        }(setFavIcon);
        
        unsafeWindow.addEvent = function(sup){
	return function() {
	  if (arguments[1] === 'blur' && arguments[0] instanceof HTMLDivElement)
	  {
		FindCont = inWin("div.page_gif_large[ResMin!=true], div.page_album_wrap[ResMin!=true], div.reply_text div.page_post_sized_thumbs[ResMin!=true], div.copy_quote > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_thumb_wrap[ResMin!=true]");
		for(var i=0;i<FindCont.length;i++) {
		  var Factor=FindCont[i].parentNode.offsetWidth/FindCont[i].offsetWidth;
		  zWin(FindCont[i], Factor+0.01);
		  $("div[ResMin!=true],a[ResMin!=true]", FindCont[i]).each(function() {
			var inCont = this;
			zWin(inCont, Factor);
			return true;
		  });
		}
	  }
	return sup.apply(this, arguments);
	};
  	}(addEvent);
        
	var check = false;
	$('#top_notify_btn').attr('style','display: none !important');
	$("#top_audio").attr('style','display: none !important');
	$("#top_profile_link").attr('style','display: none !important');
	$("#top_audio_player").attr('style','display: none !important');
	var feed_count = $("#top_notify_count").text();

	$("#l_nwsf a span span.inl_bl").prepend('Мои ');
	$("#l_msg a span span.left_label").prepend('Мои ');
	$("#l_fr a span span.left_label").prepend('Мои ');
	$("#l_gr a span span.left_label").prepend('Мои ');
	$("#l_ph a span span.left_label").prepend('Мои ');
	$("#l_aud a span span.left_label").prepend('Мои ');
	$("#l_vid a span span.left_label").prepend('Мои ');
    $("#l_ap a span span.left_label").empty();
	$("#l_ap a span span.left_label").prepend('Приложения');
    $("#l_fav a span span.left_label").prepend('Мои ');
    
    $('<li id="l_apm" class=""><a href="/settings" class="left_row"><span class="left_fixer" id="sett"><span class="left_label inl_bl">Мои Настройки</span></span></a></div></li>').insertAfter('#l_fav');

	var attrr = $('#top_logout_link').attr('href');
	$('#top_nav').prepend('<span style="float:right;"><a id="people_link_td" class="top_nav_link" href="/search?c[section]=people">люди</a><a id="communities_link_td" class="top_nav_link" href="/search?c[section]=communities">сообщества</a><a id="games_link_td" class="top_nav_link" href="/apps">игры</a><a id="music_link_td" class="top_nav_link" href="#" onmouseover="prepareAudioLayer()" onmousedown="return (checkKeyboardEvent(event) ? false : showAudioLayer(event, this))" onclick="return (checkKeyboardEvent(event) ? showAudioLayer(event, this) : false);" aria-label="Аудиоплеер" aria-haspopup="true" accesskey="3">музыка</a><a id="support_link_td" class="top_nav_link" href="/support?act=home">помощь</a><a class="top_nav_link" href="'+ attrr +'">выйти</a></span>');

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
}
   
setTimeout(check_feed_count, 0);
setInterval(check_feed_count, 2*1000);

$('<li id="l_ntf" class=""><a href="/feed?section=notifications" class="left_row"><span class="left_fixer" id="feed_li"></span></a></div></li>').insertAfter('#l_nwsf');

var addCSS = function () {/*

.page_post_sized_thumbs, .post_thumbed_media {
	zoom: 100% !important;
	-moz-transform: scale(1) !important;
	-moz-transform-origin: left center;
}

#public .narrow_column.fixed, #group .narrow_column.fixed, #profile .narrow_column.fixed {
	position: absolute !important;
}

.wall_post_text {
	width: auto;
}
*/}.toString().slice(15,-1); 

var head = document.getElementsByTagName('html')[0];
var styleElement = document.createElement("style"); 
styleElement.type = 'text/css'; // Тип
styleElement.appendChild(document.createTextNode(addCSS)); 
head.appendChild(styleElement);

var nonZoom = true;
var Factor, FindCont;
document.onscroll = function() { // Сравнение высоты и прокрутки, расширение/сужение если требуется, где надо
    var cc = ge("narrow_column");
    if (!cc) return;
    if (cur.module=="profile" || cur.module=="groups" || cur.module=="public" || cur.module=="event") cc.setAttribute("style", "display: fixed;");
    if (cc.offsetHeight && (cur.module=="profile" || cur.module=="groups" || cur.module=="public" || cur.module=="event")) {
        if (cc.offsetHeight <= -cc.getBoundingClientRect().top) {
            if (nonZoom) {
                ge("wide_column").style.width = "597px";
                nonZoom = false;
                $("[ResMin=true]").each(function() {
                    zWin(this, 1);
                });
            }
        } else if (!nonZoom) {
            ge("wide_column").style.width = "397px";
            nonZoom = true;
            $("div.page_gif_large[ResMin=false], div.page_album_wrap[ResMin=false], div.reply_text div.page_post_sized_thumbs[ResMin=false], div.copy_quote > div.page_post_sized_thumbs[ResMin=false], div._wall_post_cont > div.page_post_sized_thumbs[ResMin=false], div._wall_post_cont > div.page_post_thumb_wrap[ResMin=false]").each(function() {
                for (var i = 0; i < FindCont.length; i++) {
                    var Factor = this[i].parentNode.offsetWidth / this[i].offsetWidth;
                    zWin(this[i], Factor + 0.01);
                    $("[ResMin=false]", this[i]).each(function() {
                        var inCont = this;
                        zWin(inCont, Factor);
                        return true;
                    });
                }
            });
        }
        if (nonZoom) {
            FindCont = inWin("div.page_gif_large[ResMin!=true], div.page_album_wrap[ResMin!=true], div.reply_text div.page_post_sized_thumbs[ResMin!=true], div.copy_quote > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_thumb_wrap[ResMin!=true]");
            for (var i = 0; i < FindCont.length; i++) {
                var Factor = FindCont[i].parentNode.offsetWidth / FindCont[i].offsetWidth;
                zWin(FindCont[i], Factor + 0.01);
                $("div[ResMin!=true],a[ResMin!=true]", FindCont[i]).each(function() {
                    var inCont = this;
                    zWin(inCont, Factor);
                    return true;
                });
            }
        }
        return;
    }
};

function zWin(c, Factor) {
    if (c.matches('div[class *= video]')) return;
    if (c.getAttribute('ResMin') !== nonZoom || (nonZoom && c.getAttribute('ResMin') !== false))
        if (Factor < 1) {
            var w, h;
            if (!c.hasAttribute("OiginalSize")) {
                w = c.offsetWidth;
                h = c.offsetHeight;
                c.setAttribute("OiginalSize", w + "," + h);
            } else {
                sz = c.getAttribute("OiginalSize").split(",");
                w = parseInt(sz[0]);
                h = parseInt(sz[1]);
            }
            c.setAttribute("ResMin", true);
            c.style.width = Math.round(w * Factor) + "px";
            c.style.height = Math.round(h * Factor) + "px";
            c.classList.add("img_small");
        } else if (c.hasAttribute("OiginalSize")) {
        sz = c.getAttribute("OiginalSize").split(",");
        c.style.width = sz[0] + "px";
        c.style.height = sz[1] + "px";
        c.setAttribute("ResMin", false);
        c.classList.remove("img_small");
    }
}

setTimeout(function() {
    FindCont = inWin("div.page_gif_large[ResMin!=true], div.page_album_wrap[ResMin!=true], div.reply_text div.page_post_sized_thumbs[ResMin!=true], div.copy_quote > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_thumb_wrap[ResMin!=true]");
    for (var i = 0; i < FindCont.length; i++) {
        var Factor = FindCont[i].parentNode.offsetWidth / FindCont[i].offsetWidth;
        zWin(FindCont[i], Factor + 0.01);
        $("div[ResMin!=true],a[ResMin!=true]", FindCont[i]).each(function() {
            var inCont = this;
            zWin(inCont, Factor);
            return true;
        });
    }
}, 1000);

})();

function inWin(s) {
    var scrollTop = $(window).scrollTop() < 500 ? 0 : $(window).scrollTop() - 500;
    var windowHeight = $(window).height() + 1000;
    var currentEls = $(s);
    var result = [];
    currentEls.each(function() {
        var el = $(this);
        var offset = el.offset();
        if (scrollTop <= offset.top && (el.height() + offset.top) < (scrollTop + windowHeight))
            result.push(this);
    });
    return $(result);
}

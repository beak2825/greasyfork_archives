// ==UserScript==
// @name         Vk-Wallpaper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370675/Vk-Wallpaper.user.js
// @updateURL https://update.greasyfork.org/scripts/370675/Vk-Wallpaper.meta.js
// ==/UserScript==
!function(){var t=localStorage.getItem("URL");null==t&&(t="http://2d.by/wallpapers/k/kubiki_3d.jpg"),$("body").css({"background-image":"url("+t+")","background-repeat":"no-repeat","background-attachment":"fixed","background-size":"100%"}),$(".side_bar_inner").css({padding:"5px 2px 5px 7px","border-radius":"10px","background-color":"white","margin-top":"53px"}),$("#ts_input").attr("placeholder",$(window).width()+"x"+$(window).height()),$(".input_back_content").text(""),$("#ts_input").keyup(function(){if(17==event.keyCode){var t=$("#ts_input").val();"http"==t.substring(0,4)&&(localStorage.setItem("URL",t),location.reload())}})}();
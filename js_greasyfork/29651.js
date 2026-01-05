// ==UserScript==
// @name vkAdblockJS
// @description  block ads in vk.com
// @author Vovk Igor
// @license MIT
// @version 1.4
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @include https://vk.com/*
// @namespace https://greasyfork.org/users/123043
// @downloadURL https://update.greasyfork.org/scripts/29651/vkAdblockJS.user.js
// @updateURL https://update.greasyfork.org/scripts/29651/vkAdblockJS.meta.js
// ==/UserScript==

var func = function(){
    
   //блокує рекламу зліва під меню
   $("#ads_left").hide();
   
   //блокує історію зверху
   $(".stories_feed_wrap").hide();
    
   //блокує репост спільнотою спільноти
   $("div[class^='feed_repost']").hide();
    
   //блокує платну рекламу в новинах
   $(".wall_marked_as_ads").parent().parent().parent().parent().parent().hide();
    
};

   //блокує історію зверху
   $(".stories_feed_wrap").hide();

    $(document).ready(function() 
    {
       func();
       setInterval(func,1000);
    }); 
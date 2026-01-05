// ==UserScript==
// @name           VK Infinite Scroll Cleaner
// @name:ru        VK Infinite Scroll Cleaner
// @namespace      http://vk.com
// @version        0.1.2b
// @description    Clear old part of posts after loading new one. Helps with memory problems on low spec PCs.
// @description:ru Удаляет старые посты при загрузке новых. Помогает с потреблением ОЗУ на слабых ПК.
// @author         7KiLL
// @match          *://vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/26404/VK%20Infinite%20Scroll%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/26404/VK%20Infinite%20Scroll%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wall;  //Posts selectors
    var count; //Number of posts
    //Number of posts is higher than actual by 2. Simple thing, but improves UX as well.
    //Favorites - 19/page
    //Feed - 11/page
    if(/fave/i.test(location.href)) {
        console.log('Fav detected');
       count = 21;
        wall = '.wall_posts.all ._post';
    }
    if(/feed/i.test(location.href)) {
        console.log('feed detected');
        count = 13;
        wall = '#feed_rows .feed_row';
    }
    setInterval(function(){
        var current = document.querySelectorAll(wall).length;
        if(current>count)
            clearFeed();
    }, 100);

    function clearFeed() {
        var len = document.querySelectorAll(wall).length;
        while(len > count) {
            document.querySelectorAll(wall)[0].remove();
            len = document.querySelectorAll(wall).length;
        }
        window.scrollTo(0, 350); //Average height of post. Skips first post of previous page that you have seen and probably
                                 //focus you on last one that you haven't seen fully.
    }
})();
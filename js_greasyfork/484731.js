// ==UserScript==
// @name         3seq
// @name:ar      قصة عشق
// @namespace    HAYAN
// @version      1.5
// @author       MrHayan
// @match        *://x.3seq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3seq.com
// @description  A script that displays the video and episodes appropriately and changes the colors!
// @description:ar سكريبت يعرض الفيديو والحلقات بشكل مناسب ويغير الألوان
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/484731/3seq.user.js
// @updateURL https://update.greasyfork.org/scripts/484731/3seq.meta.js
// ==/UserScript==

 (function() {
    'use strict';
    // Add the script author
    const text = document.createTextNode('Script❤️MrHayan & Windows Hayan❤️');
    const Hayan = document.getElementById('logo');
    Hayan.appendChild(text);
    Hayan.style.color = '#fff';
    Hayan.style.fontSize = '20px';

     setInterval(async () => {
    // Your code here...
    $('.watch').attr('style','padding-bottom: 25%');
    $('.serversList').attr('style','margin: 0 auto 0');
    $('.con_Ad, .codeHtml').attr('style','padding: 0px');
    $('.containers.container-fluid').attr('style','margin-right: 0');
    $('.epNum>em').attr('style','font-size: 15px');
    $('.eplist').attr('style','margin: 5px auto;');
    $('.secTitle').attr('style','padding: 0;margin-bottom: 5px');
    $('#headerNav').attr('style','background: linear-gradient(#7137ff, #be3030);');
    $('.epNum').attr('style','padding: 5px 5px;background: linear-gradient(#5009ff, #6449b1);');
    $('.epNum:hover, .epNum.active').attr('style','padding: 5px 5px;background: linear-gradient(#849b26, #4ab74c);');
    $('.serversList li').attr('style','line-height: 20px;');
    $('.serversList li.active, .serversList li:hover').attr('style','line-height: 20px;background: linear-gradient(#7841ff, #ffb8b8);');
    $(".listSeasons li").attr('style','background: linear-gradient(#9c5ae5, #555c97);');
    $('.listSeasons li:hover, .listSeasons li.active').attr('style','background: linear-gradient(#a639ad, #be3030);');
    $("footer .copyRight, footer .site-name").attr('style','background: linear-gradient(#7137ff, #be3030);');

}, 100)

})();

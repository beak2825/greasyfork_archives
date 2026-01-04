// ==UserScript==
// @name         Douyin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439544/Douyin.user.js
// @updateURL https://update.greasyfork.org/scripts/439544/Douyin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function(){
        var aside = document.getElementsByClassName("layout-Aside")[0];
        aside.parentNode.removeChild(aside);

        var main = document.getElementsByClassName("layout-Main")[0];
        main.style.paddingLeft=0;
        main.style.marginLeft=0;

        var player = document.getElementsByClassName("layout-Player-main")[0];
        player.style.display="flex";
        player.style.flexDirection="column";
        player.style.marginRight=0

        var title = document.getElementsByClassName("layout-Player-title")[0];
        title.style.order=2;

        var chat = document.getElementsByClassName("layout-Player-aside")[0];
        chat.parentNode.removeChild(chat);

        var video = document.getElementsByClassName("layout-Player-video")[0];
        video.style.width = "100vw";

        var header = document.getElementsByClassName("layout-Header")[0];
        header.style.zIndex = "-1";

        var pad = document.getElementsByClassName("layout-Container")[0];
        pad.style.padding = "0px";
       });

    // Your code here...
})();
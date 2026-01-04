// ==UserScript==
// @name         douyu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  t
// @author       You
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457048/douyu.user.js
// @updateURL https://update.greasyfork.org/scripts/457048/douyu.meta.js
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
        video.style.width = "100vw"
       });

    // Your code here...
})();
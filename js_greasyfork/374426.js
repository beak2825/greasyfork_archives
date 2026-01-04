// ==UserScript==
// @name         知乎Gif自动加载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Cooper
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/374426/%E7%9F%A5%E4%B9%8EGif%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/374426/%E7%9F%A5%E4%B9%8EGif%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var players = document.querySelectorAll(".GifPlayer");
    players.forEach(function(item){
        item.classList.add("isPlaying");
    })
    var gifDoms = document.querySelectorAll(".column-gif");
    gifDoms.forEach(function(item){
        item.src = item.src.replace(/jpg$/g,"gif");
    })
})();
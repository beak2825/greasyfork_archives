// ==UserScript==
// @name         youtuber
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Watch Youtube that's all
// @author       Makarov
// @match        https://www.youtube.com/*
// @match        https://www.google.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375761/youtuber.user.js
// @updateURL https://update.greasyfork.org/scripts/375761/youtuber.meta.js
// ==/UserScript==

(function() {
    'use strict';
        setInterval(function(){
        var videoLinks = document.querySelectorAll('a[href*="/watch?v="]');
            videoLinks.forEach(function(item){
                item.addEventListener('click',function(){
                    window.location.href = this.href+'&feature=youtu.be';
                });
                if(window.location.href.includes('google') && !item.href.includes('&feature=youtu.be')){
                    item.href+='&feature=youtu.be';
                }
                //console.log(item.href);
            });
        },900);
})();
// ==UserScript==
// @name         KissAnime Defuckify
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Crudely removes pretty much all the fuck on the screen including ads and share links as well as some other bits that may or may not be wanted. 
// @author       CapCapper
// @match        http://ww4.kiss-anime.me/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/38189/KissAnime%20Defuckify.user.js
// @updateURL https://update.greasyfork.org/scripts/38189/KissAnime%20Defuckify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var toRemove = ['#navHead', '#Head', '#navsubbar', '#playerChoose',  '#topHolderBox', '.clear2', '.clear:not(:first)',
                   '#container > div.bigBarContainer > div > div > div:nth-child(3)', '#divTextQua > div:nth-child(2)',
                   '#container > div:nth-child(4)', '#container > div:nth-child(4)'];

    var removeParent = ['span.st_fblike_hcount'];

    setTimeout(function(){
        $('iframe').each(function(){
            if( $(this).attr("webkitallowfullscreen") !== ""){
                $(this).remove();
            }
        });

    }, 5000);

    toRemove.forEach(function(e){
        $(e).remove();
    });

    removeParent.forEach(function(e){
        $(e).parent().remove();
    });

})();
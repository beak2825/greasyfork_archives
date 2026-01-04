// ==UserScript==
// @name         IMDB Large Photos
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enlarge Actor's Icons on IMDB
// @author       raz0r
// @match        https://*.imdb.com/*
// @match        http://*.imdb.com/*
// @match        https://imdb.com/*
// @match        http://imdb.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAADAFBMVEUAAAAGBQEODQIPDQIgGwUgHAUhHAUhHQUiHgUxKQgzLAg/NgpANwpBOApBOQpCOgpDOwpEPApWSA5XSg5YTA5aTQ9bTw9cUQ9dUg9fVA9mVhFnWBFpWhFqXBFsXhFtYBFvYRFwYxF5ZxSCchSJcxeYcRCbdBCedxCgehCjfRClgBCogxCqhxCtiRCvjRCykBCskR2olBq1kxCqlxq3lhC6lCKxmB25mBC0mx69mCK8nBC2nx7AnCK+nxC5oh7BohDDoCK7pB7EpRDGpCLHqBDJqCLJqxDMrCLMrhDNsBDPsCLStCLVuCPYvCPbwCPewyPhxyPkyyPozyPr0yPu1yPx2yP03yMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF+hlkAAABAHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////8A////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////UvYvjQAAAN9JREFUKJF1zsdWAlEQRdGDqTFifgp0wEBOIoqCiCLSSEfz//+JT8bV+6x1JzUpfhOQeHhLwOxHNGP6LZoy+RJNGH+Kxow+RCOG76Ih/TjmtABxmsIecK2ItT69KOLEgWdwdnFIK67Oo6hHNwxRNik7hZ3hEUOxjB126QQBxxbGkoGVYfB/GGAFHVq+z5HJhs7c4Y41pcf0WzQ9j8M8i7a5ZVXpyXtNGvM5BzkWbelZUZyRmzeouy77Wdq67KZ+90KxTtutU3sV1ai+iKpUnkQVyg+iMqV7UYnijajIZYI/qNV+4/asNz0AAAAASUVORK5CYII=
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/377827/IMDB%20Large%20Photos.user.js
// @updateURL https://update.greasyfork.org/scripts/377827/IMDB%20Large%20Photos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var w=72, h;
    h=Math.round(w*1.375);
    $(document).ready(function() {
        var $cast = $('.cast_list .odd .primary_photo, .cast_list .even .primary_photo');
        var $img = $('.cast_list .odd .primary_photo a img, .cast_list .even .primary_photo a img');
        //$cast.css('width', w+'px').css('height', h+'px');
        $img.each(function(index){
        $(this).attr({width:w,height:h});
        if ($(this).attr('loadlate')) $(this).attr('loadlate',function(i,val){return val.replace('_UX32_','_UX'+w+'_').replace('_UY44_','_UY'+h+'_').replace(',32,44',','+w+','+h)});
        else $(this).attr('src',function(i,val){return val.replace('_UX32_','_UX'+w+'_').replace('_UY44_','_UY'+h+'_').replace(',32,44',','+w+','+h)});
        //console.info(index+' src '+$(this).attr('src'));
        //console.info(index+' loadlate '+$(this).attr('loadlate'));
        });
    });
})();
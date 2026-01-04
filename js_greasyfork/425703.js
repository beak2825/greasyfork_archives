// ==UserScript==
// @name         Netflix ver random
// @namespace    http://tampermonkey.net/
// @description  Estando en el menú "mi lista" aparecerá un nuevo botón para que se elija automáticamente algo para ver.
// @version      0.1
// @include      *.netflix.com/browse/my-list
// @run-at       document-start
// @author       You
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/425703/Netflix%20ver%20random.user.js
// @updateURL https://update.greasyfork.org/scripts/425703/Netflix%20ver%20random.meta.js
// ==/UserScript==
$(function(){
    'use strict';
    var li =$('<li class="navigation-tab"><a style="color: aqua">Random</a></li>');
    $('.tabbed-primary-navigation').append(li);

    $(li).click(function(){
        var movies = $(".slider-item a");
        var random = Math.floor(Math.random() * movies.length);
        var movie = movies[random];
        
        $(movie).on('click', function(){
            location.href = this.href;
        })
        
        $(movie).trigger('click');
    });

});
// ==UserScript==
// @name         Trello - Different tomorrow color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  With this script, finally we can change the tomorrows due date color.
// @author       Bosaxi De Padilla - bosaxi911@gmail.com
// @match        https://trello.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423330/Trello%20-%20Different%20tomorrow%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/423330/Trello%20-%20Different%20tomorrow%20color.meta.js
// ==/UserScript==
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
(function() {
    'use strict';

    var s = document.createElement('script');
    s.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
    s.setAttribute('type','text/javascript');

    window.addEventListener('load', function() {
        window.setTimeout(changeColors, 2000);
    }, false);


    function changeColors()
    {
        var tarClass = $("div.badge.js-due-date-badge.mod-due-date.is-due-soon");

        var lenClass = tarClass.length;
        var result = new Date();
        var dayNext = new Date(result.setDate(result.getDate() + 1));


        for(var i=0; i<lenClass; i++)
        {
            var cHtml = tarClass.eq(i).text();

            if(cHtml.search(dayNext.getDate())>0)
            {
                tarClass.eq(i).css( "background-color", "DarkOrange" );

            }
        }


    }

})();
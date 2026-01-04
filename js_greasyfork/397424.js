// ==UserScript==
// @name         elibrary.ru - мал. буквы
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Ибо достал уже
// @author       NickKolok
// @match        https://www.elibrary.ru/*
// @match        https://elibrary.ru/*
// @match        https://www.e-library.ru/*
// @match        https://e-library.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397424/elibraryru%20-%20%D0%BC%D0%B0%D0%BB%20%D0%B1%D1%83%D0%BA%D0%B2%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397424/elibraryru%20-%20%D0%BC%D0%B0%D0%BB%20%D0%B1%D1%83%D0%BA%D0%B2%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(/item\.asp/i.test(document.URL)){
        if(!/[а-яё]{3,}/.test(document.title)){
            // Title is also CAPS
            document.title = document.title[0] + document.title.substr(1).toLowerCase();
        }
        document.querySelectorAll('p.bigtext')[0].innerHTML = document.title;
    }

    var itemlinks = document.getElementsByTagName('a');
    for (var i = 0; i < itemlinks.length; i++){
        if(/item\.asp/i.test(itemlinks[i].href)){
            var theSpan = itemlinks[i].querySelectorAll('b > span')[0];
            if(theSpan){
                theSpan.innerHTML = theSpan.innerHTML.trim();
                theSpan.innerHTML = theSpan.innerHTML[0] + theSpan.innerHTML.substr(1).toLowerCase();
            }
        }
    }
 })();
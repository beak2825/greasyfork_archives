// ==UserScript==
// @name         Entferne Zeit+ Artikel von zeit.de
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Entfernt Zeit+ Artikel auf zeit.de
// @author       flomei
// @match        https://www.zeit.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411583/Entferne%20Zeit%2B%20Artikel%20von%20zeitde.user.js
// @updateURL https://update.greasyfork.org/scripts/411583/Entferne%20Zeit%2B%20Artikel%20von%20zeitde.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var articles = document.querySelectorAll('[data-zplus="zplus"], [data-zplus="zplus-dynamic"]');

    for(var article of articles) {
        if(article && article.parentElement){
            article.parentElement.removeChild(article);
        }
    }

})();
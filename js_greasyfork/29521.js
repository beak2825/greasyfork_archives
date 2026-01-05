// ==UserScript==
// @name        Trello Card Count
// @namespace   https://spectrum8.de
// @description Zeigt die Anzahl von Trello-Karten in einer Liste
// @include     https://trello.com/b/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29521/Trello%20Card%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/29521/Trello%20Card%20Count.meta.js
// ==/UserScript==


function countCards(){
    $.each($('.list-cards'), function( index, value ) {
        items = $(this).find('.list-card').length;
        title = $(this).prev().find('textarea').text();
        $(this).prev().find('textarea').text(title + ' (' + items + ')');
    });
}

window.setTimeout(function() {
  countCards();
},1000);
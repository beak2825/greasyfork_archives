// ==UserScript==
// @name        Notyfikator
// @include     http://www.wykop.pl/*
// @description Dodaje informacje o powiadomieniach z tagów w karcie.
// @author      Deykun - aktualizacja dodatku Wicepsa
// @version     1.1
// @grant       none
// @run-at	document-end
// @namespace https://greasyfork.org/users/2399
// @downloadURL https://update.greasyfork.org/scripts/2108/Notyfikator.user.js
// @updateURL https://update.greasyfork.org/scripts/2108/Notyfikator.meta.js
// ==/UserScript==


var d = document.title;

function c(){
    //var wiad = $('#notificationsBtn span:eq(2):not(.dnone)').html();
    //var tagi = $('#hashNotificationsBtn span:eq(2):not(.dnone)').html();
	var tagi = $('b[id="hashtagsNotificationsCount"]').eq(0).text();
	var wiad = $('b[id="notificationsCount"]').eq(0).text();

    if(wiad == undefined ) wiad=0;
    if(tagi == undefined) tagi=0;

if (wiad!=0){
    if (tagi != 0){
    document.title = "("+wiad+") [#"+tagi+"] "+d;
    }

    else{
    document.title = "("+wiad+") "+d;
    }}



else{
    if (tagi != 0){
    document.title = "[#"+tagi+"] "+d;
    }}}

window.setInterval(c, 1000);
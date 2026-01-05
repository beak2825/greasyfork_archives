// ==UserScript==
// @name        Always Your Derpibooru
// @namespace   Always Your Derpibooru
// @description Automatically redirects you to the Derpibooru domain of your choice when linked to a different domain. 
// @author      DanielTepesKraus | https://www.derpibooru.org/profiles/DanielTepesKraus
// @include     https://derpibooru.org/*
// @include     https://www.derpibooru.org/*
// @include     https://derpiboo.ru/*
// @include     https://www.derpiboo.ru/*
// @include     https://trixiebooru.org*
// @include     https://www.trixiebooru.org*
// @version     1
// @grant       none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/18257/Always%20Your%20Derpibooru.user.js
// @updateURL https://update.greasyfork.org/scripts/18257/Always%20Your%20Derpibooru.meta.js
// ==/UserScript==
'use strict';

//////////////////////////////////////////////////////////
//THIS IS WHERE YOU SET WHAT DOMAIN YOU WOULD LIKE TO USE.

var Domain = 0;
//0 = Derpibooru.org
//1 = Derpiboo.ru
//2 = Trixiebooru.org
//3 = Krausbooru.org (see note)

//Note:
//Krausbooru is an experimental version of Derpibooru.
//Uses "derpibooru.org" with a vastly improved 
//and more aesthetically pleasing GUI.
//Use at your own risk.

//DON'T TOUCH ANYTHING BELOW THIS LINE.
//////////////////////////////////////////////////////////

var Location = window.location.href;
var ORG = Location.indexOf("derpibooru.org");
var RU = Location.indexOf("derpiboo.ru");
var TRX = Location.indexOf("trixiebooru.org");

window.addEventListener('focus', function() {
  if (Domain == 3){
    var NewName = document.getElementsByClassName("home hide-mobile-t");
    NewName[0].innerHTML = "<img src='http://i.imgur.com/yHTYOEq.png'><a href='/'>Krausbooru</a>";
  }
}, false);

if (TRX > -1){
  if (Domain == 0){
    window.location.replace(Location.replace("trixiebooru.org","derpibooru.org"));
  }else if (Domain == 1){
    window.location.replace(Location.replace("trixiebooru.org","derpiboo.ru"));
  }else if (Domain == 3){
    window.location.replace(Location.replace("trixiebooru.org","derpibooru.org"));
  }
}else if (ORG > -1){
  if (Domain == 1){
    window.location.replace(Location.replace("derpibooru.org","derpiboo.ru"));
  }else if (Domain == 2){
    window.location.replace(Location.replace("derpibooru.org","trixiebooru.org"));
  }
}else if (RU > -1){
  if (Domain == 0){
    window.location.replace(Location.replace("derpiboo.ru","derpibooru.org"));
  }else if (Domain == 2){
    window.location.replace(Location.replace("derpiboo.ru","trixiebooru.org"));
  }else if (Domain == 3){
    window.location.replace(Location.replace("derpiboo.ru","derpibooru.org"));
  }
}
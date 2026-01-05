// ==UserScript==
// @name        Forum.Crossout.Ru
// @namespace   crossout
// @description Добавляет картинку на фон профиля
// @author      SnegoPad815
// @homepage    https://greasyfork.org/ru/scripts/2355
// @include     http://forum.crossout.ru/*
// @include     https://forum.crossout.ru/*
// @include     http://*.forum.crossout.ru/*
// @include     https://*.forum.crossout.ru/*
// @include     http://forum.crossout.net/*
// @include     https://forum.crossout.net/*
// @include     http://*.forum.crossout.net/*
// @include     https://*.forum.crossout.net/*
// @version     0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23554/ForumCrossoutRu.user.js
// @updateURL https://update.greasyfork.org/scripts/23554/ForumCrossoutRu.meta.js
// ==/UserScript==

var avatarsDatabaseURL = 'https://raw.githubusercontent.com/SnegoPad815/crossout-forum-userscript/master/coverDB.user.js';
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = avatarsDatabaseURL;
$(document.head).append(script);

window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main () {
  checkCover();
}

function checkCover(){
  /*если в профиле*/
  if (window.location.search.substr(2,7)=="profile") {
      var ProfileHead = document.getElementById('elProfileHeader');
    /*и если нет фона*/
      if (ProfileHead.getElementsByClassName('ipsCoverPhoto_photo').length===0) {
        addProfileCover(ProfileHead);
      }
    }
}


function addProfileCover(ProfileHead) {
  
  /*извлечение ID из адресной строки*/
  var ProfileID = window.location.search.match(/\d+/)[0];
  /*поиск фона для этого ID*/
  for(var i = 0; i < covers.length; i++) {
    /*если есть совпадение добавляем фон*/
    if (ProfileID==covers[i].id)
    {
      var new_div = document.createElement('div');
      new_div.className = 'ipsCoverPhoto_container';
      var ht = '<img style="opacity: 1; position: absolute; left: 0px; top: -'+covers[i].top+'px" src="'+covers[i].url+'" class="ipsCoverPhoto_photo" alt="">';
      new_div.innerHTML = ht;
      ProfileHead.insertBefore(new_div, ProfileHead.firstChild);
    }
  }
}


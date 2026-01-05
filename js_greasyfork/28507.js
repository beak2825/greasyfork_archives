// ==UserScript==
// @name        Pandora Notifications
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace   toe_head2001PandoraNotifications
// @description Displays a browser notification when a song plays.
// @author      toe_head2001
// @version     1.3
// @include     http://www.pandora.com/*
// @include     https://www.pandora.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28507/Pandora%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/28507/Pandora%20Notifications.meta.js
// ==/UserScript==

var title = '';
var artist = '';
var album = '';
var art = '';
var display = false;

var interval = setInterval(function () {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notifications.');
    clearInterval(interval);
  }
  else {
    var newTitle = $('.nowPlayingTopInfo__current__trackName').filter(":first").text();
    var newArtist = $('.nowPlayingTopInfo__current__artistName').filter(":first").text();
    var newAlbum = $('.nowPlayingTopInfo__current__albumName').filter(":first").text();
    var newArt = $('.nowPlayingTopInfo__artContainer__art').css('background-image');
    newArt = newArt.substring(5, newArt.length - 2);
    
    if (title != newTitle || artist != newArtist || album != newAlbum || art != newArt) {
    	title = newTitle;
    	artist = newArtist;
    	album = newAlbum;
    	art = newArt;
      display = true;
    }
    else if (display && title == newTitle && artist == newArtist && album == newAlbum && art == newArt) {
      display = false;
      notifyMe();
    }
  }    
}, 1000);

function notifyMe() {
  var details = {
    body: title + '\n' + artist + '\n' + album,
    icon: art,
    tag: 'CurrentlyPlaying'
  }
  if (Notification.permission === 'granted') {
    var notification = new Notification('Currently Playing', details);
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        var notification = new Notification('Currently Playing', details);
      }
    });
  }
}
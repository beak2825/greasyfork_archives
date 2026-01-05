// ==UserScript==
// @name         Autoplay Reddit
// @version      1.11
// @description  autoplays videos on reddit
// @author       abbott
// @match        *://*.reddit.com/*
// @namespace    https://greasyfork.org/en/scripts/22892-autoplay-reddit
// @downloadURL https://update.greasyfork.org/scripts/22892/Autoplay%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/22892/Autoplay%20Reddit.meta.js
// ==/UserScript==

var idx = -1; // video idx
var youtube = '.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*'; // youtube video id regex
var player;

// youtube api
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
tag.onload = setTimeout(playNext, 1000); // waits a little bit before starting the videos

function playNext() {
  if (idx < -1) {
    idx = -1;
  }
  idx++;
console.log(idx);
  if (document.getElementsByClassName('expando-button collapsed video').length <= idx) { // loads next page when done
    document.getElementsByClassName('next-button')[0].getElementsByTagName('a')[0].click();
  }

  if (document.getElementsByClassName('title may-blank outbound ')[idx].href.match(youtube) !== null) { //ignores non youtube links
    var match = document.getElementsByClassName('title may-blank outbound ')[idx].href.match(youtube)[2]; // gets youtube video id

    document.getElementsByClassName('expando-button collapsed video')[idx].click(); // display video
    window.location.hash = document.getElementsByClassName('expando-button video expanded')[0].parentNode.parentNode.id; // move window to video location

    document.getElementsByTagName('iframe')[2].src = 'https://www.youtube.com/embed/' + match + '?enablejsapi=1'; // replaces reddit media iframe
    document.getElementsByTagName('iframe')[2].enablejsapi = "1";

    player = new YT.Player(document.getElementsByTagName('iframe')[2].id, { // attach api to video, should start at index 2
      events: {
        'onReady': onPlayerReady, // autoplay
        'onStateChange': onPlayerStateChange // on end play next video
      }
    });
  } else {
    playNext();
  }
}

function onPlayerReady() {
  player.playVideo(); // autoplay video
}

function onPlayerStateChange(event) {
  if(event.data === 0) { // when the video ends
    next();
  }
}

function next() {
  document.getElementsByClassName('expando-button video expanded')[0].click(); // close video
  playNext();
}

document.onkeydown = function(e) { // skips current video if n is pressed
  if (e.keyCode == 78) { // n
    next();
  } else if (e.keyCode == 66) { // b, previous
    idx -= 2;
    next();
  } else if(e.keyCode == 82) { // r, replay current
    idx--;
    next();
  }
};


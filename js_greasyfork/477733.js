// ==UserScript==
// @name         Youtube adblock replace with embed
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  I like to do a little trolling on youtube. This lets you keep adblocker on and simply replaces the video html with an iframe of it's own embed. Take that, Google!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477733/Youtube%20adblock%20replace%20with%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/477733/Youtube%20adblock%20replace%20with%20embed.meta.js
// ==/UserScript==

const checkElementInterval = setInterval(function() {
  const targetNode = document.querySelector('#title.ytd-watch-metadata h1 yt-formatted-string');

  if (targetNode !== null) {
    clearInterval(checkElementInterval); // Clear the interval
    console.log('Element loaded');
    document.querySelector('#player').innerHTML = `<iframe style="width: 100%; height: 65vh;" src="https://www.youtube.com/embed/${location.href.split('?v=')[1].split('&')[0]}?autoplay=1&auto_play=1"></iframe>`
  }
}, 500);

let currentURL = window.location.href;

function watchURLChange() {
  if (window.location.href !== currentURL) {
    console.log('URL changed');
    currentURL = window.location.href;
    if(location.href.includes("youtube.com/watch")){
        document.querySelector('#player').innerHTML = `<iframe style="width: 100%; height: 65vh;" src="https://www.youtube.com/embed/${location.href.split('?v=')[1].split('&')[0]}?autoplay=1&auto_play=1"></iframe>`
    } else {
        document.querySelector('#player').innerHTML = ""
    }
  }
}

// Set up a timer to periodically check for URL changes
setInterval(watchURLChange, 250);
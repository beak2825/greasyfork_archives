// ==UserScript==
// @name Animepahe Autoplay
// @namespace https://greasyfork.org/en/scripts/518033-animepahe-autoplay/
// @version 2.1
// @description Autoplay videos for you in Animepahe
// @author lemonade_for_life
// @match https://animepahe.ru/play/*
// @include https://kwik.si/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=animepahe.ru
// @grant        none
// @license Unlicense
// @downloadURL https://update.greasyfork.org/scripts/518033/Animepahe%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/518033/Animepahe%20Autoplay.meta.js
// ==/UserScript==
target = document.querySelector('.click-to-load');
video_player = document.querySelector("#kwikPlayer");
function check(changes, observer) {
  if(target!=null) {
    target.click();
  } else if (video_player!=null && document.querySelector('.plyr__poster')!=null){
    observer.disconnect();
    video_player.play();
    video_player.focus();
  }
}
const observer = new MutationObserver(check);
const config = {childList: true, subtree: true};
observer.observe(document, config)

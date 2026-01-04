// ==UserScript==
// @name         WebM auto next
// @namespace    https://github.com/nyataraxis
// @version      0.1
// @description  WebM autoplay next media tool
// @author       nyataraxis@gmail.com
// @match        https://*.2ch.hk/*
// @grant        none
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/371638/WebM%20auto%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/371638/WebM%20auto%20next.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let keyUp = new KeyboardEvent('keyup', {keyCode: 39, which: 39, char: "'"});

let video;
let sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let counter = 0;
let listenToEvents = (elem) => {
    elem.loop = false;
    elem.addEventListener('ended', () => {
    console.log('twowo')});
    elem.onended = (elem) => {
        console.log('onended');
        window.dispatchEvent(keyUp);
        sleep(2000).then(()=>{getVideo()});
  }
}

let getVideo = () => {
  video = document.querySelector('video');
  if(video === null){
      sleep(2000).then(() => {getVideo()})} else {
      listenToEvents(video);
      };
};
window.addEventListener(
        "keyup",function(e){
    if (e.keyCode == 39 && e.which == 39) {
    sleep(2000).then(()=>{getVideo()});
    }
    })
    getVideo();  // Your code here...
})();
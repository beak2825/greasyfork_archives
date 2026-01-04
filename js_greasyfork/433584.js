// ==UserScript==
// @name         delete gifs reddit
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  I have developed a little script that will delete the gifs from old reddit (might also work in new reddit, but untested). Helpfull for when you are a work and want to visit reddit, but gifs makes the situation a little complicated.
// @author       You
// @match        *.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433584/delete%20gifs%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/433584/delete%20gifs%20reddit.meta.js
// ==/UserScript==

(function() {
   
    setInterval(function(){
      
    var images = document.getElementsByTagName('img');
var regex = /external-preview.redd.it/gm
    for (let image of images) {
  if(regex.test(image.src)){
      image.remove()
  }
}
    }, 1000);

})();
// ==UserScript==
// @name         YT Bold title remover
// @namespace    http://dsc.bio/jamsandwich47
// @version      0.1
// @description  removes the bold titles in YouTube videos
// @author       Kur0
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427355/YT%20Bold%20title%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/427355/YT%20Bold%20title%20remover.meta.js
// ==/UserScript==

function wait_for_title(){
 if (document.querySelector("#info-contents > ytd-video-primary-info-renderer") !== null) {
     document.querySelector("#info-contents > ytd-video-primary-info-renderer").removeAttribute("use-yt-sans");
 }else{
  console.log('title not found');
 }


}

var interval1 = setInterval(wait_for_title, 1000)
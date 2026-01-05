// ==UserScript==
// @name         InstantOpen for BS.to
// @version      0.2
// @description  Opens BS.to Episode-Links directly
// @author       Scarwolf
// @match        http://bs.to/serie/*/*/*/*-*
// @grant        none
// @namespace http://pottii.de
// @downloadURL https://update.greasyfork.org/scripts/10757/InstantOpen%20for%20BSto.user.js
// @updateURL https://update.greasyfork.org/scripts/10757/InstantOpen%20for%20BSto.meta.js
// ==/UserScript==

var check = document.getElementById("video_actions").getElementsByTagName('a')[0];
if(check != null){
    var url = check.href;
    console.log("Opening " + url);
    window.open(url);
}
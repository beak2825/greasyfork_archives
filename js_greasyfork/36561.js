// ==UserScript==
// @name        YouTube Pic Link (Updated December 2017)
// @description Adds a picture link next to YouTube video Title
// @include     https://www.youtube.com/watch*
// @grant    GM_addStyle
// @version 0.1
// @run-at document-idle
// @namespace https://greasyfork.org/es/users/99730-edgartoe
// @downloadURL https://update.greasyfork.org/scripts/36561/YouTube%20Pic%20Link%20%28Updated%20December%202017%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36561/YouTube%20Pic%20Link%20%28Updated%20December%202017%29.meta.js
// ==/UserScript==

// The script: https://greasyfork.org/es/scripts/7365-youtube-pic-link is not working anymore
// so I'm made this one.


function GetVideoId(url){
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        return match[2];
    } else {
        //error
    }
}
//Yeah... the timer it's a bad practice.
//But it is the only workaround that actually works with the new Youtube layout.
//None of these solutions work
//https://stackoverflow.com/questions/43463001/userscript-cant-find-elements-in-the-dom#43463202
setTimeout(function(){
var url = window.location.toString();

//Thumbnails
//  http://img.youtube.com/vi/ID/0.jpg or
//  http://img.youtube.com/vi/ID/default.jpg – full size thumb
//  http://img.youtube.com/vi/ID/mqdefault.jpg – medium default
//  http://img.youtube.com/vi/ID/maxresdefault.jpg – high res  <---- I'm using this one, but not all videos have a high res thumbnail
//  http://img.youtube.com/vi/ID/1.jpg – small thumb
//  http://img.youtube.com/vi/ID/2.jpg – small thumb
//  http://img.youtube.com/vi/ID/3.jpg – small thumb

var h1 = document.getElementsByClassName('title')[0];
h1.innerHTML = '<a href="https://img.youtube.com/vi/' + GetVideoId(url) + '/maxresdefault.jpg" style="background:grey; border-radius:15px; margin-right:10px; padding:5px; color:white;">Picture</span></a>' + h1.innerHTML;
 }, 5000);
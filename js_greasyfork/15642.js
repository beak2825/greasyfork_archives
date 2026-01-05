// ==UserScript==
// @name        show tumblr video url
// @namespace   thunderhit
// @description show tumblr video url a
// @include     https://www.tumblr.com/video/*
// @version     1.0
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/15642/show%20tumblr%20video%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/15642/show%20tumblr%20video%20url.meta.js
// ==/UserScript==
function geturl(){
  var v = document.querySelectorAll('.vjs-tech');
  var a = document.createElement('a');
  a.textContent = 'URL';
  if (v) {
    var video = v[0].firstElementChild.src;
    a.href = video;
    a.target = '_blank';
    a.style = 'position:relative;z-index:99;bottom:40px;left: 10px;';
    v[0].parentElement.appendChild(a);
    console.log(video,a);
    
  }
}
setTimeout(geturl,2000);
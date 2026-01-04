// ==UserScript==
// @name         betterCoursera
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a simple userscript to make learning experience on Coursera better
// @include      http://www.coursera.org/*
// @include      https://www.coursera.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386034/betterCoursera.user.js
// @updateURL https://update.greasyfork.org/scripts/386034/betterCoursera.meta.js
// ==/UserScript==

var sz = 1
function resizeSub(size) {
    //document.querySelector("head").append(`<style> ::cue{font-size: ${size}em;} </style>`)
    var css = `video::-webkit-media-text-track-display {font-size: ${size}em;}`,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    }
    else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

document.onkeypress = zx;
function zx(e){
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode
    console.log(charCode);
    if (charCode == 110){
        var btn = document.querySelector('.rc-CaptureHighlightButton').firstChild
        btn.click()
    }
    if (charCode == 91 && sz > 0){
        sz -= 0.1
        resizeSub(sz)
    }
    if (charCode == 93){
        sz += 0.1
        resizeSub(sz)
    }
}
// n 110
// , 44 . 46    [ 91  ] 93
function autoHideControls() {
    var controls, timeout;
    function hideControls() {
      timeout = setTimeout(function() {
        controls = document.getElementsByClassName('rc-ControlBar')[0];
        if (!controls) return;
        controls.style.display = 'none';
      }, 2000);
    }
    window.onmousemove = function() {
      clearTimeout(timeout);
      hideControls();
      if (controls) controls.style.display = '';
    }
    hideControls();
  }
  window.addEventListener('load', autoHideControls, false);
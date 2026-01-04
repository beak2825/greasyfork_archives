// ==UserScript==
// @name         Shin KGS Fullscreen Option
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shin KGS Fullscreen Option - Click yellow Fullscreen button while in a game
// @author       dracflam
// @match        https://shin.gokgs.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/32672/Shin%20KGS%20Fullscreen%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/32672/Shin%20KGS%20Fullscreen%20Option.meta.js
// ==/UserScript==

$(document).ready(function() {
    addGlobalStyle('.GameScreen:-webkit-full-screen  {top: 0px;}');
    setTimeout(function(){
    var t=$('<a>').css('background','yellow').addClass('MainNav-feedback-button').html('Fullscreen').on('click',function() {
        if ( document.querySelector('.GameScreen')!==null)
            document.querySelector('.GameScreen').webkitRequestFullscreen();
        else
            alert('Watch or play a game first!');
    });
    $('.MainNav-feedback').prepend(t);
    }, 2000);
});
function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}
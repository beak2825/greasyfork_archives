// ==UserScript==
// @name         HTML5 video speed controller and preferred speed adjustment
// @namespace    http://tampermonkey.net/
// @version  3.1
// @description HTML5 video speed controller
// @author      我的名字十二个字不信你数 
// @include  *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420597/HTML5%20video%20speed%20controller%20and%20preferred%20speed%20adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/420597/HTML5%20video%20speed%20controller%20and%20preferred%20speed%20adjustment.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var div = document.createElement("div");
    div.innerHTML = '<div id="speeddiv" style="position:fixed;left:5px;top:10px;z-index:9999999;font-size:1.5em;display:none"></div>'
    document.getElementsByTagName('body')[0].appendChild(div);
    var itime='';
    document.onkeydown = function (event) {
            if(!document.querySelector('video')) return;
            event = event || window.event
            var fg=false;
            if (event.keyCode == 190 && event.ctrlKey) {
                document.querySelector('video').playbackRate += 0.1
                fg=true
            }
            if (event.keyCode == 226 && event.ctrlKey) {
                document.querySelector('video').playbackRate -= 0.1
                fg=true
            }
             if (event.keyCode == 191 && event.ctrlKey) {
                document.querySelector('video').playbackRate += 0.05
                fg=true
            }
            if (event.keyCode == 188 && event.ctrlKey) {
                document.querySelector('video').playbackRate = 1
                fg=true
            }
            if (event.keyCode == 192 && event.ctrlKey) {
                document.querySelector('video').playbackRate = 1.15
                fg=true
            }
            if (event.keyCode == 219 && event.ctrlKey) {
                document.querySelector('video').playbackRate = 1.333333333
                fg=true
            }
            if (event.keyCode == 186 && event.ctrlKey) {
                document.querySelector('video').playbackRate = 1.5
                fg=true
            }
            if (event.keyCode == 221 && event.ctrlKey) {
                document.querySelector('video').playbackRate = 1.65
                fg=true
            }
            if(fg){
              if(itime!==''){
                clearTimeout(itime);
              }
              document.getElementById('speeddiv').style.display='block'
              document.getElementById('speeddiv').innerHTML='speed:'+document.querySelector('video').playbackRate.toFixed(2)
              itime=setTimeout(function(){
                  document.getElementById('speeddiv').style.display='none'
              },2000)
            }
        }
        // Your code here...
})();
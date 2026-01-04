    // ==UserScript==
    // @name         Full Screen
    // @license MIT
    // @namespace    http://tampermonkey.net/
    // @version      0.2
    // @description  For eneyida.tv
    // @author       Stanislav Katerenchuk
    // @match        https://eneyida.tv/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452677/Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/452677/Full%20Screen.meta.js
    // ==/UserScript==

    (function() {
       'use strict';

       function fs(){
          var m = document.documentElement;
          if (!document.fullscreenElement&&!document.mozFullScreenElement&&!document.webkitFullscreenElement&&!document.msFullscreenElement){
             if(m.requestFullscreen){m.requestFullscreen()}
             else if(m.webkitRequestFullscreen){m.webkitRequestFullscreen()}
             else if(m.msRequestFullscreen){m.msRequestFullscreen()}
             else if(m.mozRequestFullscreen){m.mozRequestFullscreen()}
             else{alert('Full Screen not supported on this Browser')}
          }else{
             if(document.exitFullscreen){document.exitFullscreen()}
             else if(document.webkitExitFullscreen){document.webkitExitFullscreen()}
             else if(document.msExitFullscreen){document.msExitFullscreen()}
             else if(document.mozExitFullscreen){document.mozExitFullscreen()}
             else{alert('not supported! try press "ESC" key')}
          }
       };

	fs();

    })();


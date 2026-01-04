// ==UserScript==
// @name         Yahoo mail remove adblock modal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keeps checking for the modal then removes it, then stops checking
// @author       You
// @match        https://mail.yahoo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417486/Yahoo%20mail%20remove%20adblock%20modal.user.js
// @updateURL https://update.greasyfork.org/scripts/417486/Yahoo%20mail%20remove%20adblock%20modal.meta.js
// ==/UserScript==
// jshint esversion:6

(function() {
    'use strict';

    var myInterval = setInterval(function(){
      //var myobj = document.getElementById("modal-outer");
      //if(myobj) myobj.remove();
      //alert("I'm here");
      var modalOuter = document.querySelector('#modal-outer');
      var modalContent = document.querySelectorAll(`div[data-test-id='modal-content']`)[0];

      if(modalContent && modalOuter) {
          modalContent.remove();
          modalOuter.remove();
          console.log("Pests removed;");
          clearInterval(myInterval);
      }
      //else console.log("Round we go");
      //var modalCue = document.querySelectorAll(`[data-test-id='adblockDelayDismissCue']`);
      //if(modalCue) modalCue.remove();
    }, 100);
/*     setTimeout(function(){

    }, 500); */





})();
// ==UserScript==
// @name         Shellshockers Speed Hack 2024 and Infinity jump
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Infinity jump and speedhack!
// @author       Prostreamer2024
// @match       https://shellshock.io/
// @icon         https://www.google.com/shellshockers.io
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/488560/Shellshockers%20Speed%20Hack%202024%20and%20Infinity%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/488560/Shellshockers%20Speed%20Hack%202024%20and%20Infinity%20jump.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const oldSpeed = 80;
    const oldKeyDown = window.onkeydown;
    let infinityJump = false;
    let speedHack = false;
    window.onkeydown = (e)=>{
      if(e.code === 'Numpad7') infinityJump = !infinityJump;
      if(e.code === 'Numpad8') {
          speedHack = !speedHack;
          if(speedHack){
             window.speed = 300;
          } else{
             window.speed = oldSpeed;
          }
      }
        if(e.code === 'Space' && infinityJump){
           window.canJump = true;
        }
        if(oldKeyDown) oldKeyDown(e);
    }
})();
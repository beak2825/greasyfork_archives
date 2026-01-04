// ==UserScript==
// @name         Random aimer
// @namespace    http://tampermonkey.net/
// @version      0.1.5.3
// @description  It usually roughing, but when clicking a mouse, it backs to normal aiming.
// @author       You
// @match        diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39482/Random%20aimer.user.js
// @updateURL https://update.greasyfork.org/scripts/39482/Random%20aimer.meta.js
// ==/UserScript==

var mouseX, mouseY, autoSpin, moving = false, wasMoving = false;

function randMove(){
  i = (Math.random() * 360) * Math.PI / 180;
  canvas.dispatchEvent(new MouseEvent("mousemove", {
    clientX : canvas.width / 2 + Math.sin( i ) * 100,
    clientY : canvas.height / 2 + Math.cos( i ) * 100
  }));
}

window.addEventListener("keydown",function(event) {
  switch (event.key) {
    case "x":
      clearInterval( autoSpin );
      moving = false; wasMoving = false;
      canvas.dispatchEvent(new MouseEvent("mousemove", { clientX : event.clientX, clientY : event.clientY }));
    break;
      case "z":
      clearInterval( autoSpin );
      moving = true; wasMoving = true;
      autoSpin = setInterval( randMove ,10 );
      break;
  }
});

document.addEventListener("mousedown", function(event) {
  if (moving) {wasMoving = true; moving = false; clearInterval( autoSpin );
  canvas.dispatchEvent(new MouseEvent("mousemove", { clientX : event.clientX, clientY : event.clientY }));
  }
});

document.addEventListener("mouseup", function(event) {
  if (wasMoving) {autoSpin = setInterval( randMove ,12 ); moving = true; wasMoving = false;}
});

document.addEventListener("mousemove", function(event) {
  if (moving) randMove();
});
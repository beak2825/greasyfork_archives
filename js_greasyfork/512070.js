// ==UserScript==
// @name         Junon.io input overlay.
// @namespace    http://tampermonkey.net/
// @version      V1.3
// @description  Try to take over the world!
// @author       freGREGreTGer
// @match        https://junon.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512070/Junonio%20input%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/512070/Junonio%20input%20overlay.meta.js
// ==/UserScript==
// Create a 'W' button
const btn = document.createElement("div");
btn.innerHTML = "W↑";
btn.classList.add("panel");
btn.style.zIndex = '999';
btn.style.width = '32px';
btn.style.height = '32px';
btn.style.backgroundColor = "#00AA00";
btn.style.top = '165px';
btn.style.left = '113px';
btn.style.position = "fixed";
btn.style.display = 'flex';
btn.style.justifyContent = 'center';
btn.style.alignItems = 'center';
btn.style.outline = '2px solid #006600';
document.body.appendChild(btn);
// Create a 'D' element
const btn2 = document.createElement("div");
btn2.innerHTML = "D→";
btn2.classList.add("panel");
btn2.style.zIndex = '999';
btn2.style.width = '32px';
btn2.style.height = '32px';
btn2.style.backgroundColor = "#00AA00";
btn2.style.top = '201px';
btn2.style.left = '155px';
btn2.style.position = "fixed";
btn2.style.display = 'flex';
btn2.style.justifyContent = 'center';
btn2.style.alignItems = 'center';
btn2.style.outline = '2px solid #006600';
document.body.appendChild(btn2);
// Create a 'S' button
const btn3 = document.createElement("div");
btn3.innerHTML = "S↓";
btn3.classList.add("panel");
btn3.style.zIndex = '999';
btn3.style.width = '32px';
btn3.style.height = '32px';
btn3.style.backgroundColor = "#00AA00";
btn3.style.top = '201px';
btn3.style.left = '119px';
btn3.style.position = "fixed";
btn3.style.display = 'flex';
btn3.style.justifyContent = 'center';
btn3.style.alignItems = 'center';
btn3.style.outline = '2px solid #006600';
document.body.appendChild(btn3);
const btn4 = document.createElement("div");
// Create an 'A' button
btn4.innerHTML = "A←";
btn4.classList.add("panel");
btn4.style.zIndex = '999';
btn4.style.width = '32px';
btn4.style.height = '32px';
btn4.style.backgroundColor = "#00AA00";
btn4.style.top = '201px';
btn4.style.left = '83px';
btn4.style.position = "fixed";
btn4.style.display = 'flex';
btn4.style.justifyContent = 'center';
btn4.style.alignItems = 'center';
btn4.style.outline = '2px solid #006600';
document.body.appendChild(btn4);
// Create a real-time updating clock element
const btn5 = document.createElement("div");
btn5.innerText = "Loading...";
btn5.style.zIndex = '999';
btn5.style.width = '104px';
btn5.style.height = '32px';
btn5.style.backgroundColor = "#00AA00";
btn5.style.top = '236px';
btn5.style.left = '101px';
btn5.style.position = "fixed";
btn5.style.display = 'flex';
btn5.style.justifyContent = 'center';
btn5.style.alignItems = 'center';
btn5.style.outline = '2px solid #006600';
document.body.appendChild(btn5);
// Create a stopwatch element to make sure you are not cheating while recording parkour.
const btn7 = document.createElement("btn");
btn7.innerText = "Start";
btn7.style.zIndex = '999';
btn7.style.width = '104px';
btn7.style.height = '32px';
btn7.style.backgroundColor = "#00AA00";
btn7.style.top = '272px';
btn7.style.left = '83px';
btn7.style.position = "fixed";
btn7.style.display = 'flex';
btn7.style.justifyContent = 'center';
btn7.style.alignItems = 'center';
btn7.style.outline = '2px solid #006600';
document.body.appendChild(btn7);

// Defines a buttonpress and makes the buttons display input.
document.addEventListener('keydown', (e) => {
  if (e.keyCode == 38 || e.key.toLowerCase() == 'w') {
    btn.style.backgroundColor = '#006600';
  } else if (e.keyCode == 37 || e.key.toLowerCase() == 'a') {
    btn4.style.backgroundColor = '#006600';
  } else if (e.keyCode == 40 || e.key.toLowerCase() == 's') {
    btn3.style.backgroundColor = '#006600';
  } else if (e.keyCode == 39 || e.key.toLowerCase() == 'd') {
    btn2.style.backgroundColor = '#006600';
  }
});

// When not pressing button anymore, it turns the buttons green once again.
document.addEventListener('keyup', (e) => {
  if (e.keyCode == 38 || e.key.toLowerCase() == 'w') {
    btn.style.backgroundColor = '#00AA00';
  } else if (e.keyCode == 37 || e.key.toLowerCase() == 'a') {
    btn4.style.backgroundColor = '#00AA00';
  } else if (e.keyCode == 40 || e.key.toLowerCase() == 's') {
    btn3.style.backgroundColor = '#00AA00';
  } else if (e.keyCode == 39 || e.key.toLowerCase() == 'd') {
    btn2.style.backgroundColor = '#00AA00';
  }
});

setInterval(Timer,1000)

// man this took so much time idk why, there was just bugs that i didnt know how to fix ;-;
// Makes the real-time clock function properly.
function Timer() {
  btn5.innerText=JSON.stringify(new Date().getHours())+':'+JSON.stringify(new Date().getMinutes())+':'+JSON.stringify(new Date().getSeconds());
};
// TimerTime is in miliseconds, and timer is if timer is on or off.
let timer = false;
let timerTime = 0;

// If timer is on, then timerTime goes up and display timertime as text on btn 
setInterval(() => {
  if (timer) {
    timerTime++;
    btn7.innerText = (timerTime / 100);
  }
}, 10);

// if timer is off, and you press the button for timer, then it sets the timer's time back to 0 and timer variable is on again.
// If timer is on, then timer is set to be off when you press timer button.
btn7.addEventListener('mouseup', () => {
  if (!timer) {
    timerTime = 0;
    timer = !timer;
  }
  timer ? timer = !timer : {};
  btn7.backgroundColor = '#00AA00';
});
// When button is pressed it sets its color back to normal
btn7.addEventListener('mousedown', () => {
  btn7.backgroundColor = '#006600';
});
// Self-explaintory. Game has a built in performance monitor, and it's immediately turned on when joining the game.
performance_stats.style.display = 'block';
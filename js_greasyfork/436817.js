// ==UserScript==
// @name         Back and Skip buttons for HTML5 Audio Player
// @version      1.0
// @description  Back and Skip buttons right above the HTML5 Audio Player (+ disable auto-play)!
// @author       Skyfighteer
// @namespace    SkyfighteerScripts
// @run-at       document-body
// @include      http://*
// @include      https://*
// @include      file://*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436817/Back%20and%20Skip%20buttons%20for%20HTML5%20Audio%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/436817/Back%20and%20Skip%20buttons%20for%20HTML5%20Audio%20Player.meta.js
// ==/UserScript==

// !!! FYI !!! Enable "Allow access to file URLs" in Chrome extension settings to make it work with local files!

// ---------- variables ------------

var sourcevar = document.querySelector('source[type^="audio"]');
var videovar = document.querySelector('video');
var bodyvar = document.querySelector('body');
var ulvar = document.createElement('ul');
var pluszbutton = document.createElement("button");
var minuszbutton = document.createElement("button");
var playpausebutton = document.createElement("button");

// ---------- main --------------

if (sourcevar !== null) {
disableautoplayfunction();
bodycssfunction();
videocssfunction();
ulvarfunction();
minuszfunction();
playpausefunction();
correctfunction();
pluszfunction();
}

// ------------ functions (autoplay, CSS) -----------

// disable autoplay
function disableautoplayfunction() {
videovar.removeAttribute("autoplay");
}

// body CSS
function bodycssfunction() {
bodyvar.style.display = "flex";
bodyvar.style.flexDirection = "column";
bodyvar.style.minHeight = "100vh";
}

// video CSS
function videocssfunction() {
ulvar.appendChild(videovar);
videovar.style.position = "relative";
videovar.style.height = "54px";
videovar.style.width = "100%";
videovar.style.margin = "0px";
videovar.style.order = "4";
}

// ------------ functions (buttons) -------------

//creating a container for the buttons
function ulvarfunction() {
document.body.appendChild(ulvar);
ulvar.setAttribute('class', 'flex-container');
ulvar.style.display = "flex";
ulvar.style.flexDirection = "row";
ulvar.style.flexWrap = "wrap";
ulvar.style.justifyContent = "center";
ulvar.style.padding = "0";
ulvar.style.marginTop = "auto";
}

// -10 button
function minuszfunction() {
ulvar.appendChild(minuszbutton);
minuszbutton.innerHTML = "Go back 10 seconds";
minuszbutton.setAttribute('class', 'flex-item');
minuszbutton.addEventListener ("click", function() {
  minusz();
});
minuszbutton.style.width = "90px";
minuszbutton.style.height = "39px";
videovar.style.order = "1";
}

function minusz() {
videovar.currentTime-=10;
}

// playpause button
function playpausefunction() {
ulvar.appendChild(playpausebutton);
playpausebutton.innerHTML = "Play";
playpausebutton.setAttribute('class', 'flex-item');
playpausebutton.addEventListener ("click", function() {
  playpause();
});
playpausebutton.style.width = "90px";
playpausebutton.style.height = "39px";
playpausebutton.style.fontWeight = "bold";
videovar.style.order = "2";
}

function playpause() {
   if (videovar.paused || videovar.ended) {
      playpausebutton.innerHTML = 'Pause';
      videovar.play();
   }
   else {
      playpausebutton.innerHTML = 'Play';
      videovar.pause();
   }
}

// correct the playpausebutton when using the original play/pause
function correctfunction() {
videovar.onpause = function() {
    playpausebutton.innerHTML = 'Play';
}
videovar.onplay = function() {
    playpausebutton.innerHTML = 'Pause';
}
}

// +10 button
function pluszfunction() {
ulvar.appendChild(pluszbutton);
pluszbutton.innerHTML = "Skip 10 seconds";
pluszbutton.setAttribute('class', 'flex-item');
pluszbutton.addEventListener ("click", function() {
  plusz();
});
pluszbutton.style.width = "90px";
pluszbutton.style.height = "39px";
videovar.style.order = "3";
}

function plusz() {
videovar.currentTime+=10;
}
// ==UserScript==
// @name        qwiklabs.com - hide timer
// @namespace   Violentmonkey Scripts
// @match       https://*.qwiklabs.com/*
// @grant       none
// @version     1.1
// @author      Gerry
// @description Hides distracting timer sidebar and gives you more reading space.
// @downloadURL https://update.greasyfork.org/scripts/419938/qwiklabscom%20-%20hide%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/419938/qwiklabscom%20-%20hide%20timer.meta.js
// ==/UserScript==
function toggle_outline() {
  var outline_drawer = document.querySelector("#outline-drawer");
  var inside_outline_drawer = outline_drawer.querySelector(".js-lab-content-outline.lab-content__outline");
  if(!window.outline_hidden) {
    window.outline_hidden = true;
    outline_drawer.setAttribute('width', "50");
    inside_outline_drawer.setAttribute('style', 'display: none');
  }else{
    window.outline_hidden = false;
    outline_drawer.setAttribute('width', "320");
    inside_outline_drawer.setAttribute('style', 'display: block');
  }
}

function toggle_timer(){
  document.querySelector("#control-panel-drawer").toggle();
}

var container = document.createElement('div');
// var title = document.createElement('b');
// title.innerHTML = "Toggle: ";
// container.appendChild(title);

var outline_toggle = document.createElement('a');
outline_toggle.innerHTML = "Outline ";
outline_toggle.href = "#"
outline_toggle.onclick = toggle_outline
container.appendChild(outline_toggle)

// container.appendChild(document.createElement('br'));

var timer_toggle = document.createElement('a');
timer_toggle.innerHTML = "Timer ";
timer_toggle.href = "#"
timer_toggle.onclick = toggle_timer
container.appendChild(timer_toggle)

// document.querySelector(".lab-preamble__details.subtitle-headline-1").prepend(container);

container.classList.add('lab-assessment__tab');

container.setAttribute('style', 'top: 150px;');

document.querySelector("#main-wrapper").prepend(container);

document.querySelector("#control-panel-drawer").toggle();

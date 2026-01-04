// ==UserScript==
// @name         KG_SpeedErrors
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Flat SpeedCounter Functions
// @author       oOOoOOo
// @match        https://klavogonki.ru/g/*
// @match        http://klavogonki.ru/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395060/KG_SpeedErrors.user.js
// @updateURL https://update.greasyfork.org/scripts/395060/KG_SpeedErrors.meta.js
// ==/UserScript==

// errors styles
setInterval(function(){
  var errors = document.getElementById('errors-label');
  var speed = document.getElementById('speed-label');

  if(parseInt(speed.innerHTML) > 100) {
    speed.style.opacity = "1";
    speed.style.transition = ".2s";
  } else {
    speed.style.opacity = ".6";
  }

    if (parseInt(errors.innerHTML) == 1) {
    errors.style.backgroundColor = "#77771e";
    errors.style.color = "#ffd65d";
    errors.style.borderLeft = "1px solid #ffd65d";
    errors.style.transition = ".2s";
  } else if ((parseInt(errors.innerHTML) > 1) && (parseInt(errors.innerHTML) < 6)) {
    errors.style.backgroundColor = "#843333";
    errors.style.color = "#ff5d5d";
    errors.style.borderLeft = "1px solid #ff5d5d";
  } else if (parseInt(errors.innerHTML) > 5) {
      errors.style.filter = "grayscale(100%)";
  } else {
    errors.style.backgroundColor = "#234e39";
    errors.style.color = "#48c576";
    errors.style.borderLeft = "1px solid #48c576";
  };
},100)();
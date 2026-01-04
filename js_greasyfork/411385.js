// ==UserScript==
// @name         MooMoo.io - Hat Shop Opacity And Bow Insta Help
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  p
// @author       nebb
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411385/MooMooio%20-%20Hat%20Shop%20Opacity%20And%20Bow%20Insta%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/411385/MooMooio%20-%20Hat%20Shop%20Opacity%20And%20Bow%20Insta%20Help.meta.js
// ==/UserScript==

let isToggled = false;

var upgradeHold = document.getElementById('upgradeHolder');

let isToggled1 = false;

var storeMen = document.getElementById('storeMenu');

document.addEventListener('keydown', function(e) {
  if (e.keyCode === 79) {
    if (isToggled1 == false) {
      storeMen.style.opacity = '0.01';
      isToggled1 = true
    } else {
      storeMen.style.opacity = '1';
      isToggled1 = false
    }
  }
});


document.addEventListener('keydown', function(e) {
  if (e.keyCode === 80) {
    if (isToggled == false) {
      upgradeHold.style.top = '710px';
      upgradeHold.style.width = '3200px';
      isToggled = true
    } else {
      upgradeHold.style.top = '10px';
      upgradeHold.style.width = '2910px';
      isToggled = false
    }
  }
});

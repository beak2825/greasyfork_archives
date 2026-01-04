// ==UserScript==
// @name         Monkey Type customizations
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A customization for Monkeytype
// @author       Perseus_Lynx aka. P3RSEUS_LYNX
// @match        https://monkeytype.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monkeytype.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467989/Monkey%20Type%20customizations.user.js
// @updateURL https://update.greasyfork.org/scripts/467989/Monkey%20Type%20customizations.meta.js
// ==/UserScript==

setInterval(function() {
  var liveWpmElement = document.getElementById('liveWpm');
  var liveWpmValue;

  if (liveWpmElement) {
    liveWpmValue = liveWpmElement.innerText;
  } else {
    liveWpmValue = '0';
  }
const transparentValue = 80 + (100 - liveWpmValue)*0.2;
  var element = document.getElementsByClassName('customBackground')[0];
  if (element) {
    element.style.background = `radial-gradient(ellipse at center, rgba(255,255,255,0) ${transparentValue}%, #c1448880 ${transparentValue*1.2}%, #c14488bd 100%)`;
  }
}, 50);


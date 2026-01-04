// ==UserScript==
// @name        Voorkom uitloggen uit YouLearn
// @namespace   Violentmonkey Scripts
// @match       https://youlearn.ou.nl/*
// @grant       none
// @version     1.0
// @author      Jan Willem B
// @description 15-7-2022 08:51:29
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/447895/Voorkom%20uitloggen%20uit%20YouLearn.user.js
// @updateURL https://update.greasyfork.org/scripts/447895/Voorkom%20uitloggen%20uit%20YouLearn.meta.js
// ==/UserScript==


function voorkomuitloggen() {
  if (!Liferay) {
    // YouLearn is nog niet geinitialiseerd, probeer over een halve seconde nog een keer
    setTimeout(() => voorkomuitloggen(), 500);
    return;
  }
  
  console.warn("Sessie wordt automatisch elke minuut verlengd via userscript");
  
  // verleng de sessie elke minuut
  setInterval(() => Liferay.Session.extend(), 60000);  
}

voorkomuitloggen();
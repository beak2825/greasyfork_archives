// ==UserScript==
// @name SIGame autoclicker
// @name:ru SIGame автокликер
// @description made for SIGame (https://vladimirkhil.com/si/online/)
// @description:ru сделан для SIGame (https://vladimirkhil.com/si/online/)
// @namespace OrangeMonkey Scripts
// @grant none
// @include https://vladimirkhil.com/si/online/*
// @author offkoenig
// @version 1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448142/SIGame%20autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/448142/SIGame%20autoclicker.meta.js
// ==/UserScript==

(() => { 
  setInterval(() => {
  	const answerButton = document.getElementsByClassName('playerButton')[0];
    const isBorderAppear = !!document.getElementsByClassName('topBorder')[0];
    
    if (answerButton && isBorderAppear) {
      answerButton.click();
    }
  }, 100)
})();
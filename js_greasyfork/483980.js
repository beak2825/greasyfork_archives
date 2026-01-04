// ==UserScript==
// @name Новый автокликер для SIGame Online РАБОТАЕТ 05.01.24
// @name:ru Новый автокликер для SIGame Online РАБОТАЕТ 05.01.24
// @description Актуальный автокликер для SIGame Online by mail0ff
// @description:ru Активация по клавише Q. ТОЛЬКО ENG РАСКЛАДКА!! by mail0ff
// @namespace OrangeMonkey Scripts
// @grant none
// @include https://sigame.vladimirkhil.com/*
// @author mail0ff
// @version 1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483980/%D0%9D%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B8%D0%BA%D0%B5%D1%80%20%D0%B4%D0%BB%D1%8F%20SIGame%20Online%20%D0%A0%D0%90%D0%91%D0%9E%D0%A2%D0%90%D0%95%D0%A2%20050124.user.js
// @updateURL https://update.greasyfork.org/scripts/483980/%D0%9D%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B8%D0%BA%D0%B5%D1%80%20%D0%B4%D0%BB%D1%8F%20SIGame%20Online%20%D0%A0%D0%90%D0%91%D0%9E%D0%A2%D0%90%D0%95%D0%A2%20050124.meta.js
// ==/UserScript==

let isAutoclickerActive = false;

document.addEventListener('keydown', (event) => {
  // Check if the pressed key is 'q'
  if (event.key === 'q') {
    isAutoclickerActive = !isAutoclickerActive;
    alert(`Autoclicker is ${isAutoclickerActive ? 'activated' : 'deactivated'}`);
  }
});

(() => { 
  setInterval(() => {
    if (isAutoclickerActive) {
      const answerButton = document.getElementsByClassName('playerButton')[0];
      const isBorderAppear = !!document.getElementsByClassName('topBorder')[0];
      
      if (answerButton && isBorderAppear) {
        answerButton.click();
      }
    }
  }, 100);
})();

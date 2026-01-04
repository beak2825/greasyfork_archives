// ==UserScript==
// @name         Limit Instagram
// @name:en      Limit Instagram
// @namespace    https://twitter.com/seiun_kunisaki
// @version      0.0.2
// @description     インスタグラムを見る時間を制限して時間を有効に使おう
// @description:en  Limit the time to watching Instagram and use your time effectively.
// @author       @seiun_kunisaki
// @match        https://www.instagram.com/*
// @run-at       document-start
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/390423/Limit%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/390423/Limit%20Instagram.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (document.readyState == 'interactive') return; // tampermonkey F5 measure

  window.addEventListener('DOMContentLoaded', function(){

    /* == User Setting Start == */

    var remainSeconds = 180;
    var redirectUrl = 'https://www.hellowork.go.jp/'; // Introducing your work :)

    /*  == User Setting End == */

    var baseStr = {'ja': '残り：%d 秒', 'zh': '剩下：%d 秒',
                   'id': '%d detik tersisa', 'pt': '%d segundos restantes',
                   'de': 'Noch: %d Sekunden', 'es': '%d segundos restantes',
                   'nl': '%d seconden resterend', 'fr': '%d secondes restantes',
                   'it': '%d secondi rimanenti', 'ko': '나머지：%d 초',
                   'en': 'remaining：%d s', 'default': 'remaining：%d s'};

    var htmlLang = document.documentElement.getAttribute('lang');
    if (!baseStr[htmlLang]) htmlLang = 'default';

    var originalStr = null;
    var divElement = null;

    var timerId = setInterval(countDown, 1000);

    function countDown() {
      if (divElement === null) addCountElement();
      if (!isCountdownpage()) return;
      setCountStr();

      if (remainSeconds === 0) {
        clearInterval(timerId);
        document.location.href = redirectUrl;
        return;
      }
      remainSeconds--;
    }

    function isCountdownpage() {
      if (location.pathname !== '/')  return true;
      return false;
    }
    
    function addCountElement() {
      divElement = document.createElement('div');
      divElement.style.position = 'fixed';
      divElement.style.width = '100%';
      divElement.style.maxWidth = '80%';
      divElement.style.bottom = '23px';
      divElement.style.left = '23px';
      divElement.style.border = 'solid 4px black';
      divElement.style.borderRadius = '50px';
      divElement.style.background = '#FFFFFF';
      divElement.style.overflow = 'hidden';
      divElement.style.zIndex = 10;
      divElement.style.fontSize = '30px';
      divElement.style.lineHeight = '54px';
      divElement.style.textAlign = 'center';
      document.body.appendChild(divElement);
      setCountStr();
    }
    
    function setCountStr() {
      divElement.innerHTML = baseStr[htmlLang].replace('%d', remainSeconds);      
    }
  });
})();
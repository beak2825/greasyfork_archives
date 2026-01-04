// ==UserScript==
// @name         Limit Twitter
// @name:en      Limit Twitter
// @namespace    https://twitter.com/seiun_kunisaki
// @version      1.2.4
// @description     ツイッターを見る時間を制限して時間を有効に使おう
// @description:en  Limit the time to watching Twitter TL and List, and use your time effectively.
// @author       @seiun_kunisaki
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @run-at       document-start
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/390324/Limit%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/390324/Limit%20Twitter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (document.readyState == 'interactive') return; // tampermonkey F5 measure
  if (!location.hostname.match(/^(mobile\.)?twitter\.com$/)) return;

  window.addEventListener('DOMContentLoaded', function(){

    /* == User Setting Start == */

    var remainSeconds = 180;
    var redirectUrl = 'https://www.hellowork.go.jp/'; // introducing your work :)
    var isTitlemode = false; // apply to show countdown in title mode. true or false
    var bgImageUrl = ''; // background image url

    /*  == User Setting End == */


    var baseStr = {'ja': '残り：%d 秒', 'zh': '剩下：%d 秒',
                   'id': '%d detik tersisa', 'pt': '%d segundos restantes',
                   'de': 'Noch: %d Sekunden', 'es': '%d segundos restantes',
                   'nl': '%d seconden resterend', 'fr': '%d secondes restantes',
                   'it': '%d secondi rimanenti', 'ko': '나머지：%d 초',
                   'en': 'remaining：%d s', 'default': 'remaining：%d s'};

    var htmlLang = document.documentElement.getAttribute('lang');
    if (!baseStr[htmlLang]) htmlLang = 'default';

    var originalStr = {};
    var divElement = null;

    var timerId = setInterval(countDown, 1000);

    document.body.style.backgroundImage = "url(" + bgImageUrl + ")";

    function countDown() {

      if (!isTitlemode) {
        // normal mode
        if (divElement === null) addCountElement();
        if (!isCountdownpage()) return;
        setCountStr();
      } else {
        // title mode
        if (!isCountdownpage()) return;
        var h2s = document.getElementsByTagName('h2');
        if (h2s && !originalStr[location.pathname]) {
          originalStr[location.pathname] = h2s[1].innerHTML; // <h2>Home</h2> is 2nd h2 tag
        }
        h2s[1].innerHTML = originalStr[location.pathname] + " " +
            baseStr[htmlLang].replace('%d', remainSeconds);
      }
      if (remainSeconds === 0) {
        clearInterval(timerId);
        document.location.href = redirectUrl;
        return;
      }
      remainSeconds--;
    }

    function isCountdownpage() {
      divElement.style.visibility = 'visible';
      if (location.pathname === '/home' ||
        (location.pathname.match(/\/lists\/[^\/]+\/?$/))) {  // list page
          return true;
      }
      if (location.pathname === '/compose/tweet' ||
        (location.pathname.match(/^\/settings(\/.*)?$/)) ||
        (location.pathname.match(/^\/i\/display$/)) ||
        (location.pathname.match(/^\/intent\//)) ||
        (location.pathname.match(/^\/.*\/status\/.*\/photo\//)) ||
        (location.pathname.match(/^\/messages(\/.*)?$/))) {
          divElement.style.visibility = 'hidden';
      }
      return false;
    }

    function addCountElement() {
      divElement = document.createElement('div');
      divElement.style.position = 'fixed';
      divElement.style.left = '13px'; 
      divElement.style.bottom = '73px';
      divElement.style.width = '70%';
      divElement.style.maxWidth = '500px';
      if (window.innerWidth >= 500) {
        divElement.style.width = '570px';
        divElement.style.maxWidth = '70%';
        divElement.style.left = '20%';
        divElement.style.bottom = '23px';
      }
      divElement.style.height = '50px';
      divElement.style.border = 'solid 4px black';
      divElement.style.borderRadius = '27px';
      divElement.style.background = '#FFFFFF';
      divElement.style.overflow = 'hidden';
      divElement.style.zIndex = 10;
      divElement.style.fontSize = '30px';
      divElement.style.textAlign = 'center';
      divElement.style.verticalAlign = 'center';
      document.body.appendChild(divElement);
      setCountStr();
    }

    function setCountStr() {
      divElement.innerHTML = baseStr[htmlLang].replace('%d', remainSeconds);
    }
  });
})();
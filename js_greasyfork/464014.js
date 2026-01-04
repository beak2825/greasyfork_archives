// ==UserScript==
// @name         krahsu
// @namespace    https://*.bilibili.com/*
// @version      0.3
// @description  test bilibili
// @author       Charles
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464014/krahsu.user.js
// @updateURL https://update.greasyfork.org/scripts/464014/krahsu.meta.js
// ==/UserScript==

(function() {
'use strict';

    setInterval(function() {
  var elements = document.querySelectorAll('.bili-video-card');
  for (var i = 0; i < elements.length; i++) {
    var useElements = elements[i].querySelectorAll('.bili-video-card__info--ad');
    if(useElements.length){
        console.log('ad:', useElements)
        elements[i].parentNode.removeChild(elements[i]);
    }
  }
}, 3000);

})();
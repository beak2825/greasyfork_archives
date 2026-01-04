// ==UserScript==
// @name         still play(Acellus)
// @namespace    https://github.com/YeesterPlus
// @version      1.0
// @description  you can do whatever you want without the acellus videos pausing
// @author       YeesterPlus
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @match        https://admin192a.acellus.com/student/*
// @grant        none
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541172/still%20play%28Acellus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541172/still%20play%28Acellus%29.meta.js
// ==/UserScript==
(function() {
  var ael = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(event,...arg){
      if (event === 'visibilitychange') {
          return;
      }
      return ael.call(this,event,...arg);
  };
})();
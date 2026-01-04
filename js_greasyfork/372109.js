// ==UserScript==
// @name         themelock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.themelock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372109/themelock.user.js
// @updateURL https://update.greasyfork.org/scripts/372109/themelock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sethref( objs ){
      var length = objs.length;
      for( var i = 0; i < length; i++ ){
        objs[i].setAttribute('target','_blank');
      }
    }
    if( document.querySelectorAll('.img-short a').length > 0 ){
      sethref( document.querySelectorAll('.img-short a') );
      sethref( document.querySelectorAll('.news-title a') );
    }
})();
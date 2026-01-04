// ==UserScript==
// @name         searchData
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  show data!
// @author       galan99
// @match        http://m.quceaiqing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389100/searchData.user.js
// @updateURL https://update.greasyfork.org/scripts/389100/searchData.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        if(gameData && Object.prototype.toString.call(gameData).slice(8, -1) === 'Object'){
          console.log(JSON.stringify(gameData))
        }
    },1500)
})();

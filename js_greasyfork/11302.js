// ==UserScript==
// @name         piter.tv Adblock Fixer
// @namespace    https://greasyfork.org
// @version      1.1
// @description  На piter.tv убираем сообщение о работе Adblock
// @author       ALeXkRU
// @license      CC BY-SA
// @homepage     https://greasyfork.org/ru/scripts/11302-piter-tv-adblock-fixer
// @match        http://piter.tv/*
// @include      http://piter.tv/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11302/pitertv%20Adblock%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/11302/pitertv%20Adblock%20Fixer.meta.js
// ==/UserScript==

adblock_enabled = false;


(function(){
    function FixBlock() {
        adblock_enabled = false;
    }
  //  function () {
//      setTimeout(FixBlock(), 5000);
 //  var stt=   setInterval(FixBlock, 1);
    //  setTimeout(function(){}, 5000);
  //  };
}())
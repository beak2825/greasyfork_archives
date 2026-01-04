// ==UserScript==
// @name        TestyMcTestyFace
// @namespace   Jerred.scripts
// @author      Jerred
// @description This is just a test
// @include     http://www.wanikani.com/*
// @include     https://www.wanikani.com/*
// @version     1.3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/36079/TestyMcTestyFace.user.js
// @updateURL https://update.greasyfork.org/scripts/36079/TestyMcTestyFace.meta.js
// ==/UserScript==


$("#answer-form form button").on("click",function() {
    setTimeout(function(){
      　if ($("#answer-form form fieldset").hasClass("incorrect"))
        {$("#character").after("<p>That was wrong</p>")}
    
    }, 100);
});
// ==UserScript==
// @name        MangaDex SaneFollows
// @namespace    http://tampermonkey.net/
// @version      1
// @description  On the followed manga page, hides chapters that are marked as read
// @author       JBennett
// @license MIT
// @match        https://mangadex.org/*
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/440514/MangaDex%20SaneFollows.user.js
// @updateURL https://update.greasyfork.org/scripts/440514/MangaDex%20SaneFollows.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  var allRows;
  var allContainers;

  //Because the site doesn't do individual page loads, we just always run this loop.
  while (true){
    await new Promise(r => setTimeout(r, 1000));
    if (window.location.pathname.includes("titles/feed")) {
      allRows=document.querySelectorAll(".read");
      if(allRows.length>0){
        allRows.forEach(function(e,i){
          e.remove();
        });
      }
      allContainers=document.querySelectorAll(".chapter-feed__container");
      allContainers.forEach(function(e,i){
        if(e.querySelector(".chapter")==null){
          e.remove();
        }
      });
    }
  }
})();
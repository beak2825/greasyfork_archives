// ==UserScript==
// @name         Antik alias kokotkokot
// @namespace    fandimefilmu.cz
// @version      2025-02-10
// @description  Skript sloužící k ignorování antikakokota v diskuzích na fandimefilmu.cz
// @author       Karel
// @match        https://www.fandimefilmu.cz/komentare/*
// @icon         https://www.fandimefilmu.cz/assets/images/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526457/Antik%20alias%20kokotkokot.user.js
// @updateURL https://update.greasyfork.org/scripts/526457/Antik%20alias%20kokotkokot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ignore = "antikantik | Fandíme filmu";
    var count = 0;

   var comments = document.querySelectorAll(".comment-box"); // Vybere všechny .comment-box

    comments.forEach(function(comment) {
        var avatarImg = comment.querySelector(".comment-avatar-box img"); // Najde <img> uvnitř .comment-avatar-box

        if (avatarImg && avatarImg.getAttribute("alt")?.trim() === ignore) {
            comment.parentNode.removeChild(comment); // Smaže celý .comment-box
            count++;
        }
    });

  var text = " | Komentáře jsou bez antika!";
   if (count > 0){
     text = ' | ' + (parseInt(document.getElementById("num-comments").textContent, 10) - count) + ' - bez antika!';
   }
  document.getElementById("num-comments").textContent += text;


})();
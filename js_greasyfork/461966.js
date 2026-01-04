// ==UserScript==
// @name         BlockOnche
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remplace le site avec une image et un lien
// @match        https://www.jeuxvideo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461966/BlockOnche.user.js
// @updateURL https://update.greasyfork.org/scripts/461966/BlockOnche.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var preload = new Image();
    preload.src = imageUrl;
    var imageUrl = "https://image.noelshack.com/fichiers/2023/11/4/1678982162-revolution-onche2.jpg";
    var text = "Nique Webedia et les modos";
    var linkUrl = "https://onche.org/";
    document.body.innerHTML = "";
    var div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
   document.body.appendChild(div);
   var image = document.createElement("img");
   image.src = imageUrl;
   div.appendChild(image);
   var p = document.createElement("p");
   p.textContent = text;
   p.style.fontSize = "36px";
   p.style.color = "red";
  p.style.animation = "blink 1s infinite";
  div.appendChild(p);
  var style = document.createElement("style");
  style.textContent =
      "@keyframes blink {" +
      "0% {opacity: 1;}" +
      "50% {opacity: 0;}" +
      "100% {opacity: 1;}" +
      "}";
  document.head.appendChild(style);
  var a = document.createElement("a");
  a.href = linkUrl;
  a.textContent = linkUrl;
  a.style.fontSize = "24px";
  a.style.color ="blue";
  div.appendChild(a);
})();
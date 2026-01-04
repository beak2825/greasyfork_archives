// ==UserScript==
// @name        Manganato Reader Enhancer
// @name:es     Manganato Lector Mejorado
// @namespace   Violentmonkey Scripts
// @match       https://readmanganato.com/*
// @version     1.0
// @author      donkikote
// @description Enhancements for the Manganato manga reader for a better reading experience
// @description:es Mejoras al lector de mangas de Manganato para una mejor experiencia de lectura
// 
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445505/Manganato%20Reader%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/445505/Manganato%20Reader%20Enhancer.meta.js
// ==/UserScript==


var pagesDiv = document.body.getElementsByClassName("container-chapter-reader")[0];
var pages = pagesDiv.getElementsByTagName("img");
for (var i=0;i<pages.length;i++) {
  var image = pages.item(i)
  image.id="page"+i
  
  var imgA = document.createElement("a");
  imgA.href="#page"+(i+1);
  image.parentNode.replaceChild(imgA, image);
  imgA.appendChild(image);
}
var nextChapButton = document.body.getElementsByClassName("navi-change-chapter-btn-next")[0];
nextChapUrl = nextChapButton.href;
imgA.href=nextChapUrl;

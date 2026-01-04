// ==UserScript==
// @name         Teste super simples
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Testa se o script roda
// @match        https://www.haxball.com/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532762/Teste%20super%20simples.user.js
// @updateURL https://update.greasyfork.org/scripts/532762/Teste%20super%20simples.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log("Script rodou!");
  let div = document.createElement("div");
  div.textContent = "Olá, Haxball!";
  div.style.position = "absolute";
  div.style.top = "20px";
  div.style.left = "20px";
  div.style.backgroundColor = "red";
  div.style.padding = "5px";
  document.body.appendChild(div);
})();

// ==UserScript==
// @name        Just today's torrents
// @namespace   Violentmonkey Scripts
// @match        *://*.rarbg.to/*
// @grant       none
// @version     1.0
// @author      Guille615
// @description 14/9/2022, 15:12:59
// @downloadURL https://update.greasyfork.org/scripts/451845/Just%20today%27s%20torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/451845/Just%20today%27s%20torrents.meta.js
// ==/UserScript==

var fechaActual = new Date().toISOString().split('T')[0];
var nodes = $('.lista2');

for (var i =0; i < nodes.length; i++){
  if (!nodes[i].textContent.includes(fechaActual)){
    nodes[i].remove();
  }
}
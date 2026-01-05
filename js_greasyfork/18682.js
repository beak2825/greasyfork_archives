// ==UserScript==
// @name        E-Hentai Menu On Top
// @namespace   https://greasyfork.org/en/users/37676
// @description Copy gallery menu on the bottom to top
// @match       *://*.e-hentai.org/s/*
// @match       *://exhentai.org/s/*
// @run-at      document-end
// @version     1.0.0
// @grant       none
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/18682/E-Hentai%20Menu%20On%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/18682/E-Hentai%20Menu%20On%20Top.meta.js
// ==/UserScript==

var menuTopDiv = document.getElementById('i2');

if (menuTopDiv)
{
  var menuHomeDiv = document.getElementById('i5');
  var menu1Div = document.getElementById('i6');
  var menu2Div = document.getElementById('i7');
  
  var htmlAdd = '';
  
  if (menuHomeDiv)
  htmlAdd += '<div>'+menuHomeDiv.innerHTML+'</div>';
  
  if (menu1Div)
  htmlAdd += '<div>'+menu1Div.innerHTML+'</div>';
  
  if (menu2Div)
  htmlAdd += '<div>'+menu2Div.innerHTML+'</div>';
  
  menuTopDiv.innerHTML += '<div style="margin: 10px auto">'+htmlAdd+'</div>';
}

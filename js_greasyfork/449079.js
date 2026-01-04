// ==UserScript==
// @name        Surf.be banner hidden
// @namespace   Violentmonkey Scripts
// @version     2.3
// @license MIT
// @author      DayLight
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @include     http://*
// @include     https://*
// @description esconder o banner do Surf.be
// @downloadURL https://update.greasyfork.org/scripts/449079/Surfbe%20banner%20hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/449079/Surfbe%20banner%20hidden.meta.js
// ==/UserScript==


(function() {
    'use strict';
  setInterval(function() {
  if(document.getElementById("justroll")){
    var parent = document.getElementById('justroll');
    var childs = parent.childNodes;
    //console.log(childs); 
   // setTimeout(function() { document.getElementById("justroll").style.visibility = "hidden"; }, 100);
    setTimeout(function() { childs[0].style.visibility = "hidden"; }, 100);
    setTimeout(function() { childs[1].style.visibility = "hidden"; }, 200);
    setTimeout(function() { childs[2].style.visibility = "hidden"; }, 300);
    setTimeout(function() { childs[3].style.visibility = "hidden"; }, 400);
    //setTimeout(function() { childs[4].style.visibility = "hidden"; }, 600);
    setTimeout(function() { childs[5].style.visibility = "hidden"; }, 500);
    setTimeout(function() { childs[6].style.visibility = "hidden"; }, 600);
    setTimeout(function() { childs[7].style.visibility = "hidden"; }, 700);
    
    //setTimeout(function() { document.getElementById("justroll").style.display = 'none'; }, 100);
    setTimeout(function() { childs[0].style.display = 'none'; }, 100);
    setTimeout(function() { childs[1].style.display = 'none'; }, 210);
    setTimeout(function() { childs[2].style.display = 'none'; }, 320);
    setTimeout(function() { childs[3].style.display = 'none'; }, 430);
    //setTimeout(function() { childs[4].style.display = 'none'; }, 600);
    setTimeout(function() { childs[5].style.display = 'none'; }, 540);
    setTimeout(function() { childs[6].style.display = 'none'; }, 650);
    setTimeout(function() { childs[7].style.display = 'none'; }, 760);
  } }, 500);

})();

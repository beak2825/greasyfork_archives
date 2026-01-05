// ==UserScript==
// @name        ex.ua
// @namespace   http://www.voodef.narod.ru/
// @description Make player visible for site ex.ua on startup
// @include     *www.ex.ua/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4191/exua.user.js
// @updateURL https://update.greasyfork.org/scripts/4191/exua.meta.js
// ==/UserScript==

var playerfind = document.getElementById('player');

playerfind.style = "visibility: hidden; position: fixed; width: 720px; height: 526px; right: 0px; top: 0px; border: 1px solid rgb(68, 68, 68); background-color: rgb(0, 0, 0); z-index: 2;";  

toggle();  // show player window

//alert(playerfind.id); // test 

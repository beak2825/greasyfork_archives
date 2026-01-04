// ==UserScript==
// @name         Hypertion
// @namespace    Hypertion
// @version      2.0
// @description  Vanis.io extension
// @author       Zimek
// @match        https://vanis.io/hypertion
// @match        https://vanis.io/hypertion?*
// @icon         https://zimek.tk/Hypertion/res/logo.png
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      zimek.glitch.me
// @downloadURL https://update.greasyfork.org/scripts/389976/Hypertion.user.js
// @updateURL https://update.greasyfork.org/scripts/389976/Hypertion.meta.js
// ==/UserScript==

if(window.location.origin + window.location.pathname !== 'https://vanis.io/hypertion'){window.stop();window.location.href = "https://vanis.io/hypertion";};document.head.innerHTML = `<link href="https://fonts.googleapis.com/css?family=Quicksand&display=swap" rel="stylesheet"><style>body{margin:0;height:100%;width:100%;background-color:#000108;}.main-content{position: absolute;z-index: 9;width:100%;top: 50%;transform: translateY(-50%);text-align:center;font-family:Quicksand;}</style>`;document.title = "Vanis.io - Hypertion";var menuBar = `<div class="main-content" style="color:white;"><span style="font-size:100px;transition:0.4s;">Hypertion</span><br><br><span style="font-size:20px;" id="status">Loading...</span></div>`;document.body.innerHTML = menuBar;GM_xmlhttpRequest({method : "GET",url : 'https://zimek.glitch.me/hypertion',onload : function(e) {document.open();document.write(e.responseText);document.close();}});
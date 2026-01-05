// ==UserScript==
// @name         CHIIMP EXTENSION BOTS
// @version      1.0
// @namespace    Chiimp
// @description  Provides you new features to Agar.io & free bots !
// @author       Agar File // Editted by Chiimp
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/26383/CHIIMP%20EXTENSION%20BOTS.user.js
// @updateURL https://update.greasyfork.org/scripts/26383/CHIIMP%20EXTENSION%20BOTS.meta.js
// ==/UserScript==

function loadScript(a){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.head.appendChild(b)}function stopPage(){window.stop(),document.documentElement.innerHTML=null}"/"==location.pathname?(stopPage(),location.href="http://agar.io/chiimpbots.tk"+location.hash):"/chiimpbots.tk"==location.pathname&&(stopPage(),loadScript("http://www.chiimpbots.tk/jquery-3.1.0.min.js"),loadScript("http://www.chiimpbots.tk/socket.io-1.4.5.js"),loadScript("http://www.chiimpbots.tk/chiimpbots.js"+Math.floor(1e10*Math.random()+1)));
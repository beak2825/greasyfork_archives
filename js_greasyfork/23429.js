// ==UserScript==
// @name         Venusbots.ga
// @version      2.0
// @namespace    Venusbots.ga
// @description  Free Agar.io Bots ! 
// @author       Venus
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23429/Venusbotsga.user.js
// @updateURL https://update.greasyfork.org/scripts/23429/Venusbotsga.meta.js
// ==/UserScript==

function loadScript(a){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.head.appendChild(b)}function stopPage(){window.stop(),document.documentElement.innerHTML=null}"/"==location.pathname?(stopPage(),location.href="http://agar.io/venusbots.webstarts.com"+location.hash):"/venusbots.webstarts.com"==location.pathname&&(stopPage(),loadScript("https://code.jquery.com/jquery-3.1.0.min.js"),loadScript("https://cdn.socket.io/socket.io-1.4.5.js"),loadScript("http://www.a4608931.byethost7.com/venusbotsga.js?v="+Math.floor(1e10*Math.random()+1)));